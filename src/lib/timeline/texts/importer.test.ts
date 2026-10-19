import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { ALL_CORPORA } from "./corpus";
import { INVENTORY } from "./inventory";
import { importWorkChunk, installLibrary } from "./importer";

// THE IMPORTER AGAINST AN IN-MEMORY DATABASE.
//
// A small stand-in for the Supabase query builder — just the calls the
// importer makes, with unique-key upserts — so the properties the brief asks
// for can be checked without a server: a second run changes nothing, an
// interrupted import resumes from its cursor, parents get ids before their
// children, and layers a person wrote are never touched.

type Row = Record<string, unknown>;

const UNIQUE: Record<string, string[][]> = {
  timeline_text_works: [["community_id", "work_key"]],
  timeline_themes: [["community_id", "theme_key"]],
  timeline_text_manuscripts: [["community_id", "manuscript_key"]],
  timeline_text_passages: [["community_id", "passage_key"]],
  timeline_text_layers: [["passage_id", "import_key"]],
  timeline_passage_witnesses: [["passage_id", "manuscript_id"]],
  timeline_passage_dates: [["passage_id", "import_key"]],
  timeline_passage_images: [["community_id", "import_key"]],
  timeline_passage_links: [["community_id", "import_key"]],
  timeline_passage_themes: [["passage_id", "theme_id"]],
};

class FakeDb {
  tables = new Map<string, Row[]>();
  clock = 0;
  table(name: string) {
    if (!this.tables.has(name)) this.tables.set(name, []);
    return this.tables.get(name)!;
  }
  from(name: string) {
    return new Query(this, name);
  }
}

type Result = { data: unknown; error: unknown; count?: number | null };

class Query implements PromiseLike<Result> {
  private filters: ((row: Row) => boolean)[] = [];
  private mode: "select" | "insert" | "upsert" | "update" | "delete" = "select";
  private payload: Row[] = [];
  private conflict: string[] | null = null;
  private orderBy: { col: string; asc: boolean } | null = null;
  private max: number | null = null;
  private from_ = 0;
  private single_: "one" | "maybe" | null = null;
  private head = false;
  private counting = false;
  private returning = false;

  private db: FakeDb;
  private name: string;
  constructor(db: FakeDb, name: string) {
    this.db = db;
    this.name = name;
  }

  select(_cols?: string, options?: { count?: string; head?: boolean }) {
    if (this.mode !== "select") this.returning = true;
    if (options?.count) this.counting = true;
    if (options?.head) this.head = true;
    return this;
  }
  insert(rows: Row | Row[]) {
    this.mode = "insert";
    this.payload = Array.isArray(rows) ? rows : [rows];
    return this;
  }
  upsert(rows: Row | Row[], options: { onConflict: string }) {
    this.mode = "upsert";
    this.payload = Array.isArray(rows) ? rows : [rows];
    this.conflict = options.onConflict.split(",");
    return this;
  }
  update(values: Row) {
    this.mode = "update";
    this.payload = [values];
    return this;
  }
  delete() {
    this.mode = "delete";
    return this;
  }
  eq(col: string, value: unknown) {
    this.filters.push((row) => row[col] === value);
    return this;
  }
  neq(col: string, value: unknown) {
    this.filters.push((row) => row[col] !== value);
    return this;
  }
  in(col: string, values: unknown[]) {
    this.filters.push((row) => values.includes(row[col]));
    return this;
  }
  not(col: string, op: string, value: unknown) {
    assert.equal(op, "is");
    this.filters.push((row) => (row[col] ?? null) !== value);
    return this;
  }
  order(col: string, options?: { ascending?: boolean }) {
    this.orderBy = { col, asc: options?.ascending ?? true };
    return this;
  }
  limit(n: number) {
    this.max = n;
    return this;
  }
  range(a: number, b: number) {
    this.from_ = a;
    this.max = b - a + 1;
    return this;
  }
  maybeSingle() {
    this.single_ = "maybe";
    return this;
  }
  single() {
    this.single_ = "one";
    return this;
  }

  then<A = Result, B = never>(
    resolve?: ((value: Result) => A | PromiseLike<A>) | null,
    reject?: ((reason: unknown) => B | PromiseLike<B>) | null
  ): PromiseLike<A | B> {
    return new Promise<Result>((ok) => ok(this.run())).then(resolve, reject);
  }

  private matches(row: Row) {
    return this.filters.every((f) => f(row));
  }

  private run(): Result {
    const rows = this.db.table(this.name);
    let out: Row[] = [];
    if (this.mode === "insert" || this.mode === "upsert") {
      for (const incoming of this.payload) {
        const key = this.conflict;
        const found = key ? rows.find((row) => key.every((k) => row[k] === incoming[k] && incoming[k] != null)) : undefined;
        if (found) {
          Object.assign(found, incoming);
          out.push(found);
          continue;
        }
        for (const unique of UNIQUE[this.name] ?? []) {
          if (rows.some((row) => unique.every((k) => row[k] != null && row[k] === incoming[k]))) {
            return { data: null, error: { message: `duplicate key in ${this.name} (${unique.join(",")})` } };
          }
        }
        const row = {
          id: randomUUID(),
          created_at: new Date(++this.db.clock * 1000).toISOString(),
          started_at: new Date(this.db.clock * 1000).toISOString(),
          status: this.name === "timeline_text_import_runs" ? "running" : undefined,
          cursor: 0,
          inserted: 0,
          updated: 0,
          unchanged: 0,
          errors: [],
          completeness_status: "not_started",
          ...incoming,
        };
        rows.push(row);
        out.push(row);
      }
    } else if (this.mode === "update") {
      out = rows.filter((row) => this.matches(row));
      for (const row of out) Object.assign(row, this.payload[0]);
    } else if (this.mode === "delete") {
      out = rows.filter((row) => this.matches(row));
      this.db.tables.set(this.name, rows.filter((row) => !out.includes(row)));
    } else {
      out = rows.filter((row) => this.matches(row));
      if (this.orderBy) {
        const { col, asc } = this.orderBy;
        out = [...out].sort((a, b) => ((a[col] as number | string) < (b[col] as number | string) ? -1 : (a[col] as number | string) > (b[col] as number | string) ? 1 : 0) * (asc ? 1 : -1));
      }
      out = out.slice(this.from_, this.max == null ? undefined : this.from_ + this.max);
    }
    if (this.counting && this.head) return { data: null, error: null, count: out.length };
    if (this.single_) {
      if (out.length === 0) return this.single_ === "one" ? { data: null, error: { message: "no rows" } } : { data: null, error: null };
      return { data: { ...out[0] }, error: null };
    }
    return { data: out.map((row) => ({ ...row })), error: null };
  }
}

const COMMUNITY = { id: "c1", slug: "test" } as never;
const USER = "u1";

function freshDb() {
  const db = new FakeDb();
  // The records the inventory anchors to that already exist on the timeline.
  for (const slug of ["plato-timaeus-critias", "atlantis-destruction", "steiner-lemurian-epoch"]) {
    db.table("timeline_events").push({ id: randomUUID(), community_id: "c1", slug });
  }
  return db;
}

async function importAll(db: FakeDb, workKey: string) {
  const client = db as never;
  let result;
  do {
    result = await importWorkChunk(client, COMMUNITY, USER, workKey);
  } while (!result.done);
  return result;
}

test("installing the library twice adds markers, dates and works once", async () => {
  const db = freshDb();
  const first = await installLibrary(db as never, COMMUNITY, USER);
  assert.equal(first.works, INVENTORY.length);
  assert.ok(first.markersAdded > 20);
  const events = db.table("timeline_events").length;
  const claims = db.table("timeline_date_claims").length;

  const second = await installLibrary(db as never, COMMUNITY, USER);
  assert.equal(second.markersAdded, 0);
  assert.equal(second.claimsAdded, 0);
  assert.equal(second.linksAdded, 0);
  assert.equal(db.table("timeline_events").length, events);
  assert.equal(db.table("timeline_date_claims").length, claims);
  assert.equal(db.table("timeline_text_works").length, INVENTORY.length);
});

test("a work imports in chunks, every passage under its parent, and a re-import changes nothing", async () => {
  const db = freshDb();
  await installLibrary(db as never, COMMUNITY, USER);
  const critias = ALL_CORPORA.find((f) => f.workKey === "greek.critias")!;

  const done = await importAll(db, "greek.critias");
  assert.equal(done.cursor, critias.passages.length);
  assert.equal(done.inserted, critias.passages.length);

  const passages = db.table("timeline_text_passages");
  assert.equal(passages.length, critias.passages.length);
  const byKey = new Map(passages.map((p) => [p.passage_key, p]));
  for (const passage of critias.passages) {
    const row = byKey.get(passage.key)!;
    if (passage.parentKey) assert.equal(row.parent_id, byKey.get(passage.parentKey)!.id, passage.key);
  }
  const work = db.table("timeline_text_works").find((w) => w.work_key === "greek.critias")!;
  assert.equal(work.completeness_status, "verified_against_edition");

  const layers = db.table("timeline_text_layers").length;
  const again = await importWorkChunk(db as never, COMMUNITY, USER, "greek.critias", { restart: true });
  assert.equal(again.inserted, 0);
  assert.equal(again.updated, 0);
  assert.equal(db.table("timeline_text_passages").length, critias.passages.length);
  assert.equal(db.table("timeline_text_layers").length, layers);
});

test("importing a work the library has not installed yet installs it first", async () => {
  const db = freshDb();
  await installLibrary(db as never, COMMUNITY, USER);
  // As if the work was added to the inventory after the library was installed.
  const rows = db.table("timeline_text_works");
  rows.splice(rows.findIndex((w) => w.work_key === "greek.critias"), 1);

  const done = await importAll(db, "greek.critias");
  assert.equal(done.cursor, ALL_CORPORA.find((f) => f.workKey === "greek.critias")!.passages.length);
  assert.equal(db.table("timeline_text_works").length, INVENTORY.length);
});

test("an interrupted import resumes at its cursor", async () => {
  const db = freshDb();
  await installLibrary(db as never, COMMUNITY, USER);
  const first = await importWorkChunk(db as never, COMMUNITY, USER, "greek.timaeus", { chunk: 50 });
  assert.equal(first.done, false);
  assert.equal(first.cursor, 50);
  const work = db.table("timeline_text_works").find((w) => w.work_key === "greek.timaeus")!;
  assert.equal(work.completeness_status, "partial");

  const rest = await importAll(db, "greek.timaeus");
  assert.equal(rest.done, true);
  assert.equal(db.table("timeline_text_import_runs").length, 1, "one run, resumed — not restarted");
  assert.equal(db.table("timeline_text_passages").filter((p) => p.division_kind === "section").length, 364);
});

test("a re-import never touches a layer a person wrote", async () => {
  const db = freshDb();
  await installLibrary(db as never, COMMUNITY, USER);
  await importAll(db, "arab.emerald-tablet");
  const line = db.table("timeline_text_passages").find((p) => p.passage_key === "arab.tab.vulgate.02")!;
  db.table("timeline_text_layers").push({ id: "mine", passage_id: line.id, import_key: null, layer: "interpretation", content: "A reader's note" });

  await importWorkChunk(db as never, COMMUNITY, USER, "arab.emerald-tablet", { restart: true });
  // Force every passage to look changed, so the stale-layer sweep runs.
  for (const p of db.table("timeline_text_passages")) p.content_hash = "stale";
  await importWorkChunk(db as never, COMMUNITY, USER, "arab.emerald-tablet", { restart: true });
  assert.ok(db.table("timeline_text_layers").some((l) => l.id === "mine"));
  assert.ok(db.table("timeline_passage_links").length >= 4);
  assert.ok(db.table("timeline_passage_images").length >= 4);
});
