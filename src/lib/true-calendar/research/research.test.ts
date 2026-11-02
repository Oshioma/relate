import { test } from "node:test";
import assert from "node:assert/strict";
import { parseImport, planImport, keysMentioned } from "./import-plan";
import { cyclePositionOn, entriesForDay, isAnchored, nextDatesForPosition, notesForDay, phaseKeysFor, EMPTY_BUNDLE } from "./daily";
import { moonDay } from "../astronomy";

// Test data is deliberately fictional ("Example people", "test." keys): these
// tests check the machinery, not any culture's history.

const file = {
  format: "true-calendar/v1",
  sources: [{ key: "test.book", title: "An example book", source_type: "academic" }],
  cultures: [{ key: "test.people", name: "Example people", continent: "Africa", research_status: "partial", review_status: "published" }],
  systems: [{ key: "test.people.week", culture_key: "test.people", name: "Example week", kind: "day_cycle", review_status: "published", sources: [{ source: "test.book", locator: "p. 1" }] }],
  cycles: [
    {
      key: "test.people.week.cycle",
      system_key: "test.people.week",
      name: "Example cycle",
      length_days: 4,
      anchor_date: "2026-01-01",
      anchor_position: 2,
      anchor_source_key: "test.book",
      review_status: "published",
      sources: [{ source: "test.book" }],
    },
  ],
  cycle_positions: [
    { key: "test.people.week.cycle.a", cycle_key: "test.people.week.cycle", position: 0, name: "Day A", review_status: "published", sources: [{ source: "test.book" }] },
  ],
};

const empty = { rows: {}, citedClaims: new Set<string>() };

test("a valid file plans inserts for every record", () => {
  const { file: parsed, errors } = parseImport(file);
  assert.deepEqual(errors, []);
  const plan = planImport(parsed!, empty);
  assert.equal(plan.ok, true, JSON.stringify(plan.errors));
  assert.deepEqual(plan.sections.find((s) => s.section === "cycles")!.insert, ["test.people.week.cycle"]);
  assert.equal(plan.citations, 3);
  assert.ok(keysMentioned(parsed!).calendar_sources.has("test.book"));
});

test("re-importing unchanged rows plans no writes (no duplicates)", () => {
  const { file: parsed } = parseImport(file);
  const rows = { calendar_sources: new Map([["test.book", { key: "test.book", title: "An example book", author: undefined, source_type: "academic", review_status: "draft" }]]) };
  const plan = planImport(parsed!, { rows, citedClaims: new Set() });
  const sources = plan.sections.find((s) => s.section === "sources")!;
  assert.deepEqual(sources.unchanged, ["test.book"]);
  assert.deepEqual(sources.insert, []);
});

test("wrong format, bad keys and missing references are reported with paths", () => {
  assert.equal(parseImport({ format: "v0" }).errors[0].path, "format");
  const bad = parseImport({ ...file, cultures: [{ key: "Not A Key", name: "x", continent: "Africa" }] });
  assert.equal(bad.file, null);
  assert.match(bad.errors[0].path, /cultures\[0\]\.key/);

  const { file: parsed } = parseImport({ ...file, systems: [{ ...file.systems[0], culture_key: "test.missing" }] });
  const plan = planImport(parsed!, empty);
  assert.equal(plan.ok, false);
  assert.ok(plan.errors.some((e) => e.path === "systems[0].culture_key"));
});

test("a published claim without a supporting source is refused", () => {
  const { file: parsed } = parseImport({ ...file, cycle_positions: [{ ...file.cycle_positions[0], sources: [] }] });
  const plan = planImport(parsed!, empty);
  assert.ok(plan.errors.some((e) => /cites no supporting source/.test(e.message)));
});

test("an anchor needs a position and a source, and a position must fit the cycle", () => {
  const { file: parsed } = parseImport({
    ...file,
    cycles: [{ ...file.cycles[0], anchor_source_key: null }],
    cycle_positions: [{ ...file.cycle_positions[0], position: 9 }],
  });
  const plan = planImport(parsed!, empty);
  assert.ok(plan.errors.some((e) => /anchor_position and anchor_source_key/.test(e.message)));
  assert.ok(plan.errors.some((e) => e.path === "cycle_positions[0].position"));
});

test("duplicate keys in one file are refused", () => {
  const { file: parsed } = parseImport({ ...file, sources: [file.sources[0], file.sources[0]] });
  assert.ok(planImport(parsed!, empty).errors.some((e) => /appears twice/.test(e.message)));
});

const cycle = { ...file.cycles[0], description: null, original_name: null, transliteration: null, translation: null, anchor_note: null, regional_note: null, evidence: [], confidence: null, uncertainty: null, period_label: null } as never;

test("cycle positions count from the sourced anchor, both ways", () => {
  assert.equal(isAnchored(cycle), true);
  assert.equal(cyclePositionOn(cycle, { year: 2026, month: 1, day: 1 }), 2);
  assert.equal(cyclePositionOn(cycle, { year: 2026, month: 1, day: 3 }), 0);
  assert.equal(cyclePositionOn(cycle, { year: 2025, month: 12, day: 31 }), 1);
  assert.deepEqual(nextDatesForPosition(cycle, 0, { year: 2026, month: 1, day: 1 }, 2), [
    { year: 2026, month: 1, day: 3 },
    { year: 2026, month: 1, day: 7 },
  ]);
  assert.equal(cyclePositionOn({ ...(cycle as object), anchor_date: null } as never, { year: 2026, month: 1, day: 1 }), null);
});

test("entries appear only on matching days", () => {
  const { file: parsed } = parseImport(file);
  const bundle = {
    ...EMPTY_BUNDLE,
    cultures: parsed!.cultures,
    systems: parsed!.systems,
    cycles: parsed!.cycles,
    positions: parsed!.cycle_positions,
  };
  assert.equal(entriesForDay(bundle, { year: 2026, month: 1, day: 3 }, null).length, 1);
  assert.equal(entriesForDay(bundle, { year: 2026, month: 1, day: 4 }, null).length, 0);
});

test("phase keys for calculated days", () => {
  assert.deepEqual(phaseKeysFor(moonDay({ year: 2024, month: 4, day: 23 }, "UTC")), ["full"]);
  assert.ok(phaseKeysFor(moonDay({ year: 2024, month: 4, day: 10 }, "UTC")).includes("first_crescent"));
  assert.deepEqual(phaseKeysFor(moonDay({ year: 2024, month: 4, day: 28 }, "UTC")), ["waning"]);
});

test("sourced dates join the matching cycle entry, or stand alone", () => {
  const { file: parsed } = parseImport(file);
  const base = { ...EMPTY_BUNDLE, cultures: parsed!.cultures, systems: parsed!.systems, cycles: parsed!.cycles, positions: parsed!.cycle_positions };
  const dated = (key: string, from: string) => ({ key, culture_key: "test.people", system_key: "test.people.week", label: "Example day", gregorian_from: from, gregorian_to: from, certainty: "exact" }) as never;
  const onCycle = entriesForDay({ ...base, correspondences: [dated("test.people.d1", "2026-01-03")] }, { year: 2026, month: 1, day: 3 }, null);
  assert.equal(onCycle.length, 1);
  assert.equal(onCycle[0].kind, "cycle");
  assert.equal(onCycle[0].correspondences.length, 1);
  const alone = entriesForDay({ ...base, correspondences: [dated("test.people.d2", "2026-01-04")] }, { year: 2026, month: 1, day: 4 }, null);
  assert.equal(alone.length, 1);
  assert.equal(alone[0].kind, "dated");
});

test("re-importing a draft file never unpublishes a reviewed record", () => {
  const { file: parsed } = parseImport(file);
  const rows = { calendar_sources: new Map([["test.book", { key: "test.book", title: "An example book", source_type: "academic", review_status: "published" }]]) };
  const plan = planImport(parsed!, { rows, citedClaims: new Set() });
  assert.deepEqual(plan.sections.find((s) => s.section === "sources")!.unchanged, ["test.book"]);
});

test("daily notes must be labelled modern, and appear only on their date", () => {
  const note = { key: "test.note.2026-01-05", note_date: "2026-01-05", title: "An example suggestion", sources: [{ source: "test.book" }] };
  const ok = planImport(parseImport({ ...file, daily_notes: [note] }).file!, empty);
  assert.equal(ok.ok, true);
  const bad = planImport(parseImport({ ...file, daily_notes: [{ ...note, evidence: ["historically_documented"] }] }).file!, empty);
  assert.ok(bad.errors.some((e) => e.path === "daily_notes[0].evidence"));
  const notes = [{ ...ok.file!.daily_notes[0] }];
  assert.equal(notesForDay({ ...EMPTY_BUNDLE, notes }, { year: 2026, month: 1, day: 5 }).length, 1);
  assert.equal(notesForDay({ ...EMPTY_BUNDLE, notes }, { year: 2026, month: 1, day: 6 }).length, 0);
});
