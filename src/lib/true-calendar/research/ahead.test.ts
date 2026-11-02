import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseImport } from "./import-plan";
import { type ResearchBundle, EMPTY_BUNDLE } from "./daily";
import { adviceAhead, adviceList, filterFeed } from "./ahead";
import { planImport } from "./import-plan";
import { IMPORT_SECTIONS } from "./model";
import { lunarMonthContaining, moonDays } from "../astronomy";

// The real research batches, as if a reviewer had published everything:
// the acceptance test for "Next advice from the past".
function publishedBundle(): ResearchBundle {
  const b: ResearchBundle = { ...EMPTY_BUNDLE, cultures: [], systems: [], cycles: [], positions: [], observances: [], meanings: [], recommendations: [], correspondences: [], notes: [], lunarDays: [], months: [], sources: [], citations: [] };
  for (const n of ["01", "02", "03", "04", "05", "06", "07"]) {
    const { file } = parseImport(JSON.parse(readFileSync(new URL(`../../../../docs/true-calendar/research/batch-${n}.v1.json`, import.meta.url), "utf8")));
    assert.ok(file, `batch ${n} parses`);
    const add = <T extends { key: string }>(list: T[], rows: T[]) => {
      for (const r of rows) {
        const i = list.findIndex((x) => x.key === r.key);
        if (i >= 0) list[i] = r;
        else list.push(r);
      }
    };
    add(b.cultures as never[], file.cultures as never[]);
    add(b.systems as never[], file.systems as never[]);
    add(b.cycles as never[], file.cycles as never[]);
    add(b.positions as never[], file.cycle_positions as never[]);
    add(b.observances as never[], file.observances as never[]);
    add(b.meanings as never[], file.meanings as never[]);
    add(b.recommendations as never[], file.recommendations as never[]);
    add(b.correspondences as never[], file.date_correspondences as never[]);
    add(b.lunarDays as never[], file.lunar_days as never[]);
    add(b.months as never[], file.months as never[]);
    add(b.sources as never[], file.sources as never[]);
    for (const { section, table } of IMPORT_SECTIONS) {
      for (const r of file[section] as Array<{ key: string; sources?: { source: string; relation: string }[] }>) {
        for (const c of r.sources ?? []) if (c.relation === "supports") b.citations.push({ claim_table: table, claim_key: r.key, source_key: c.source });
      }
    }
  }
  return b;
}

const from = { year: 2026, month: 11, day: 2 };
const all = { category: "all", culture: "all", tier: "all" } as const;
function feedFrom(day = from, tz = "Africa/Dar_es_Salaam") {
  return adviceAhead(publishedBundle(), day, moonDays(day, 35, tz));
}

test("acceptance: Akwasidae dated 22 Nov 2026 with its source-status qualification", () => {
  const akwasidae = feedFrom().dated.find((i) => i.name === "Akwasidae");
  assert.ok(akwasidae);
  assert.deepEqual(akwasidae.date, { year: 2026, month: 11, day: 22 });
  assert.equal(akwasidae.status, "secondary"); // batch 05: a secondary listing, never "official"
  assert.match(akwasidae.caution ?? "", /Manhyia/);
  assert.ok(akwasidae.sources.some((s) => s.key === "src.akandictionary-akwasidae-2026"));
  assert.ok(akwasidae.sources.some((s) => s.key === "src.nyamedua-akwasidae-2026"));
});

function feedWithMonth(day = from, tz = "Africa/Dar_es_Salaam") {
  return adviceAhead(publishedBundle(), day, moonDays(day, 35, tz), { monthStart: lunarMonthContaining(day, tz).month.start });
}

test("acceptance: Whiro and Rākaunui appear once each, dated by a stated count from the new Moon", () => {
  const { lunar } = feedWithMonth();
  const expected: Record<string, { year: number; month: number; day: number }> = {
    Whiro: { year: 2026, month: 11, day: 9 }, // the new Moon, 9 Nov 2026 (Zanzibar)
    Rākaunui: { year: 2026, month: 11, day: 22 }, // batch 01's night 14 (exact) wins over Te Papa's entry 16
  };
  for (const name of ["Whiro", "Rākaunui"]) {
    const found = lunar.filter((i) => i.name === name);
    assert.equal(found.length, 1, `${name} appears once (merged across batches)`);
    assert.equal(found[0].cultureKey, "oceania.maori");
    assert.deepEqual(found[0].date, expected[name]);
    assert.equal(found[0].status, "counted");
    assert.match(found[0].caution ?? "", /counted by us from the new Moon/);
    assert.match(found[0].caution ?? "", /full Moon/); // iwi start months differently
  }
});

test("every lunar night gets a date; Hawaiian nights start the evening after the new Moon", () => {
  const { lunar } = feedWithMonth();
  const greek = (i: { cultureKey: string }) => /^europe\.(athenian|hesiodic)-greek$/.test(i.cultureKey);
  assert.ok(lunar.filter((i) => !greek(i)).every((i) => i.date !== null), "every non-Greek lunar item is dated");
  assert.ok(lunar.filter(greek).every((i) => i.date === null && i.status === "lunar_pending"), "ancient Greek days are never dated");
  const kukahi = lunar.find((i) => i.name === "Kukahi"); // night 3
  assert.deepEqual(kukahi?.date, { year: 2026, month: 11, day: 12 });
  const newMoon = lunar.find((i) => i.id.startsWith("sky|new|"));
  assert.deepEqual(newMoon?.date, { year: 2026, month: 11, day: 9 });
  const orders = lunar.filter((i) => i.date).map((i) => i.order);
  assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
});

test("acceptance: Hawaiian Kū planting guidance, with the disagreement shown", () => {
  const { lunar } = feedFrom();
  const kukahi = lunar.find((i) => i.name === "Kukahi");
  assert.ok(kukahi && kukahi.categories.includes("farming") && kukahi.sources.length > 0);
  assert.ok(kukahi.conflicts.length >= 2, "Kū nights: Handy and Handy vs Kepelino");
  const olekulua = lunar.find((i) => i.id === "night|oceania.hawaiian.oahu-lunar-nights.night-22");
  assert.ok(olekulua && olekulua.conflicts.length >= 2 && olekulua.evidence.includes("contested"));
  assert.ok(olekulua.conflicts.every((c) => c.sources.length > 0), "each account beside its source");
});

test("acceptance: Igbo market days recurring, with no invented dates", () => {
  const { dated, seasonal } = feedFrom();
  const igbo = seasonal.filter((i) => i.cultureKey === "africa.west.igbo");
  assert.deepEqual(igbo.map((i) => i.name).sort(), ["Afọ", "Eke", "Nkwọ", "Orie"].sort());
  assert.ok(igbo.every((i) => i.date === null && i.status === "recurring" && i.categories.includes("trade")));
  assert.ok(!dated.some((i) => i.cultureKey === "africa.west.igbo"));
});

test("acceptance: batch 05 appears; three cultures; every card has a source", () => {
  const feed = feedFrom();
  const items = [...feed.dated, ...feed.lunar, ...feed.seasonal];
  assert.ok(new Set(items.map((i) => i.cultureKey)).size >= 3);
  assert.ok(items.some((i) => i.modern.some((m) => m.includes("Review garden and fishing plans"))), "batch 05 Whiro reading");
  assert.ok(items.some((i) => i.name === "Artemis day"), "batch 05 Athenian day 6");
  for (const i of items) assert.ok(i.sources.length > 0, `${i.id} cites a source`);
  // Daily notes (modern suggestions) are never presented as advice from the past.
  assert.ok(!items.some((i) => i.name === "Review unfinished work"));
  // Egyptian seasons stay in their own region.
  const egypt = feed.seasonal.find((i) => i.id === "season|africa.north.ancient-egyptian.civil");
  assert.ok(egypt && /Zanzibar/.test(egypt.caution ?? ""));
});

test("filters narrow the feed by kind, culture and source confidence", () => {
  const feed = feedFrom();
  const fishing = filterFeed(feed, { ...all, category: "fishing" });
  assert.ok(fishing.lunar.length > 0 && fishing.lunar.every((i) => i.categories.includes("fishing")));
  const hawaii = filterFeed(feed, { ...all, culture: "oceania.hawaiian" });
  assert.ok(hawaii.lunar.length >= 30 && [...hawaii.dated, ...hawaii.lunar, ...hawaii.seasonal].every((i) => i.cultureKey === "oceania.hawaiian"));
  const oral = filterFeed(feed, { ...all, tier: "oral" });
  assert.ok(oral.lunar.length > 0 && oral.lunar.every((i) => i.tiers.includes("oral")));
  assert.equal(filterFeed(feed, { ...all, culture: "nowhere" }).lunar.length, 0);
});

test("dated items are in date order; after the published list the anchor gives a provisional date", () => {
  const { dated } = feedFrom({ year: 2026, month: 11, day: 23 }, "UTC");
  const akwasidae = dated.find((i) => i.name === "Akwasidae");
  assert.deepEqual(akwasidae?.date, { year: 2027, month: 1, day: 3 });
  assert.equal(akwasidae?.status, "provisional");
  const orders = dated.map((i) => i.order);
  assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
});

test("importing the same batch twice writes nothing the second time", () => {
  const raw = JSON.parse(readFileSync(new URL("../../../../docs/true-calendar/research/batch-05.v1.json", import.meta.url), "utf8"));
  const file = parseImport(raw).file!;
  const rows: Record<string, Map<string, Record<string, unknown>>> = {};
  for (const { section, table } of IMPORT_SECTIONS) {
    rows[table] = new Map((file[section] as Array<Record<string, unknown>>).map((r) => {
      const { sources: _s, ...row } = r;
      void _s;
      return [String(r.key), { ...row, review_status: "published" }];
    }));
  }
  const plan = planImport(file, { rows: rows as never, citedClaims: new Set() });
  assert.ok(plan.sections.every((s) => s.insert.length === 0 && s.update.length === 0));
});

test("batch 06: Ngāti Kahungunu nights dated approximately, Tūhoe months never dated", () => {
  const feed = feedWithMonth();
  const kiokio = feed.lunar.find((i) => i.name === "Tangaroa-kiokio");
  assert.ok(kiokio && kiokio.date && kiokio.status === "counted" && kiokio.categories.includes("fishing"));
  assert.ok(kiokio.sources.some((s) => s.key === "src.teara-maramataka"));
  // Whiro: one card, with the Te Papa and the Te Ara accounts.
  const whiro = feed.lunar.filter((i) => i.name === "Whiro");
  assert.equal(whiro.length, 1);
  assert.ok(whiro[0].sources.some((s) => s.key === "src.teara-maramataka") && whiro[0].sources.some((s) => s.key === "src.tepapa-maramataka"));
  const months = feed.seasonal.filter((i) => i.id.startsWith("month|oceania.maori.tuhoe-months"));
  assert.equal(months.length, 12);
  assert.ok(months.every((m) => m.date === null && m.status === "recurring" && /Zanzibar/.test(m.caution ?? "")));
});

test("the page list opens with listed dates and the Moon, then takes turns between traditions", () => {
  const list = adviceList(feedWithMonth());
  assert.equal(list[0].name, "Akwasidae");
  assert.equal(list[1].cultureKey, "sky");
  const next = list.slice(3, 7).map((i) => i.cultureKey);
  assert.ok(new Set(next).size >= 3, "different traditions near the top");
  const firstUndated = list.findIndex((i) => !i.date);
  assert.ok(firstUndated > 0 && list.slice(firstUndated).every((i) => !i.date));
});

test("batch 07: Hesiod's days undated with their practices; Egyptian lucky days and Hawaiian months recurring", () => {
  const feed = feedWithMonth();
  const hesiod = feed.lunar.filter((i) => i.cultureKey === "europe.hesiodic-greek");
  assert.equal(hesiod.length, 14);
  assert.ok(hesiod.every((i) => i.date === null && i.sources.some((s) => s.key === "src.hesiod-works-days-chs")));
  assert.equal(hesiod.filter((i) => i.hasPractice).length, 9);
  // Omens and birth signs are kept as history, not practices.
  assert.ok(!hesiod.find((i) => i.name === "Day 20")?.hasPractice);
  const egypt = feed.seasonal.filter((i) => i.id.startsWith("obs|africa.north.ancient-egyptian.lucky-days"));
  assert.equal(egypt.length, 3);
  assert.ok(egypt.every((i) => i.date === null && i.status === "recurring"));
  const months = feed.seasonal.filter((i) => i.id.startsWith("obs|oceania.hawaiian.seasonal-months"));
  assert.deepEqual(months.map((i) => i.name).sort(), ["Ikiʻiki", "Makaliʻi", "Welehu"]);
});
