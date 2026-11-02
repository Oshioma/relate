import { test } from "node:test";
import assert from "node:assert/strict";
import { type CivilDate, addDays, compareDates, formatIsoDate, zonedParts } from "../dates";
import { lunarMonthContaining, moonDays, quartersBetween } from "../astronomy";
import { adviceAhead, adviceDays, mappingLevel } from "./ahead";
import { mappingCoverage } from "./coverage";
import { MAPPING_PROFILES, type MappingChoice, anchorDates, dayCycleDates, lunarNightDates, profileFor } from "./mapping";
import { publishedBundle } from "./test-bundle";

const EAT = "Africa/Dar_es_Salaam";
const NOV2 = { year: 2026, month: 11, day: 2 };
const iso = formatIsoDate;
const bundle = publishedBundle();
function days(from: CivilDate, range = 30, choice?: MappingChoice) {
  const moons = moonDays(from, range + 31, EAT);
  const feed = adviceAhead(bundle, from, moons, { monthStart: lunarMonthContaining(from, EAT).month.start, choice });
  return { feed, days: adviceDays(feed, moons, from, range) };
}

test("astronomical anchors for November 2026 match the published times (EAT, within 2 minutes)", () => {
  const quarters = quartersBetween(new Date("2026-11-02T00:00:00Z"), new Date("2026-12-02T00:00:00Z"));
  const want: [string, string, number, number][] = [
    ["new", "2026-11-09", 10, 2],
    ["first", "2026-11-17", 14, 48],
    ["full", "2026-11-24", 17, 53],
    ["last", "2026-12-01", 9, 8],
  ];
  for (const [kind, date, h, m] of want) {
    const q = quarters.find((x) => x.kind === kind);
    assert.ok(q, kind);
    const p = zonedParts(q.instant, EAT);
    assert.equal(`${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`, date, kind);
    assert.ok(Math.abs(p.hour * 60 + p.minute - (h * 60 + m)) <= 2, `${kind} at ${p.hour}:${p.minute}`);
  }
  // And the timeline puts the phases on those dates.
  const d = days(NOV2).days;
  const q = Object.fromEntries(d.filter((x) => x.quarter).map((x) => [x.quarter, iso(x.date)]));
  assert.deepEqual(q, { new: "2026-11-09", first: "2026-11-17", full: "2026-11-24", last: "2026-12-01" });
});

test("1. every date is chronological, and 2. one date can carry several cultures", () => {
  const d = days(NOV2).days;
  const serials = d.map((x) => x.serial);
  assert.deepEqual(serials, [...serials].sort((a, b) => a - b));
  assert.equal(new Set(serials).size, serials.length);
  assert.ok(d.findIndex((x) => iso(x.date) === "2026-11-09") < d.findIndex((x) => iso(x.date) === "2026-11-22"));
  const nov9 = d.find((x) => iso(x.date) === "2026-11-09")!;
  assert.ok(nov9.cultures.length >= 3, nov9.cultures.map((c) => c.cultureName).join(", "));
  assert.ok(nov9.cultures.some((c) => c.cultureKey === "oceania.maori"));
});

test("3. lunar-night sequences progress one night a day, and 4. reset at the next month", () => {
  const hawaii = profileFor("oceania.hawaiian.oahu-lunar-nights")!;
  const from = NOV2;
  const to = addDays(from, 70);
  const anchors = anchorDates(hawaii, from, to);
  // Night n and n+1 are consecutive dates inside a month.
  const n1 = lunarNightDates(hawaii, 1, from, to, anchors);
  const n2 = lunarNightDates(hawaii, 2, from, to, anchors);
  assert.ok(n1.length >= 2);
  assert.equal(iso(addDays(n1[0], 1)), iso(n2[0]));
  // Night 1 of the next month comes right after the last night of this one,
  // and no date carries two nights of the same calendar.
  const byDate = new Map<string, number[]>();
  for (let n = 1; n <= 30; n++) for (const d of lunarNightDates(hawaii, n, from, to, anchors)) byDate.set(iso(d), [...(byDate.get(iso(d)) ?? []), n]);
  assert.ok([...byDate.values()].every((list) => list.length === 1), "one night per date");
  const dates = [...byDate.keys()].sort();
  const firstReset = dates.findIndex((d, i) => i > 0 && byDate.get(d)![0] === 1);
  const before = byDate.get(dates[firstReset - 1])![0];
  assert.ok(before === 29 || before === 30, `the month ends on night ${before}`);
});

test("5. timezones: the 9 Nov new Moon is 8 Nov in Hawaiʻi; each profile counts in its home time", () => {
  assert.equal(moonDays({ year: 2026, month: 11, day: 8 }, 1, "Pacific/Honolulu")[0].quarter?.kind, "new");
  assert.equal(moonDays({ year: 2026, month: 11, day: 9 }, 1, EAT)[0].quarter?.kind, "new");
  const maori = profileFor("oceania.maori.maramataka")!;
  const hawaii = profileFor("oceania.hawaiian.oahu-lunar-nights")!;
  const from = NOV2;
  const to = addDays(from, 20);
  // Whiro: the new Moon's date in New Zealand (9 Nov, 8 pm NZDT).
  assert.deepEqual(lunarNightDates(maori, 1, from, to).map(iso), ["2026-11-09"]);
  // Hilo: the first Hawaiian evening with the Moon a day old (conjunction 9 pm on 8 Nov HST → 10 Nov).
  assert.deepEqual(lunarNightDates(hawaii, 1, from, to).map(iso), ["2026-11-10"]);
});

test("6. estimated dates are labelled; 7. undated records never get a date", () => {
  const { feed, days: d } = days(NOV2);
  for (const day of d)
    for (const r of day.rows) {
      const level = mappingLevel(r.item);
      assert.notEqual(level, "C");
      if (level === "B") assert.ok(r.approximate && /Approximate lunar alignment|Illustrative reconstruction|provisional/i.test(`${r.item.caution} ${r.item.status}`), r.item.id);
    }
  const all = [...feed.dated, ...feed.lunar, ...feed.seasonal];
  const unmapped = all.filter((i) => /igbo|yoruba|ancient-egyptian\.(civil|lucky)|seasonal-months/.test(`${i.systemKey ?? ""} ${i.cultureKey} ${i.id}`) && !i.id.startsWith("night|africa.north.ancient-egyptian.lunar"));
  assert.ok(unmapped.length > 10);
  for (const i of unmapped) {
    if (i.cultureKey === "africa.west.igbo" || i.cultureKey === "africa.west.yoruba" || /lucky-days|seasonal-months/.test(i.id)) {
      assert.equal(i.date, null, `${i.id} stays undated`);
      assert.equal(mappingLevel(i), "C");
    }
  }
  // A non-lunar cycle is never pushed through lunar maths.
  assert.deepEqual(lunarNightDates(profileFor("africa.west.igbo.market-week")!, 1, NOV2, addDays(NOV2, 30)), []);
  // A day cycle with an anchor counts in its own length: the Akan 42-day cycle from
  // its 1 Feb 2026 anchor lands on the published Akwasidae of 22 Nov 2026.
  assert.deepEqual(dayCycleDates({ year: 2026, month: 2, day: 1 }, 0, 42, 0, NOV2, addDays(NOV2, 90)).map(iso), ["2026-11-22", "2027-01-03"]);
});

test("8. different start-of-month conventions give different dates", () => {
  const whiro = days(NOV2, 30).feed.lunar.find((i) => i.name === "Whiro")!;
  const full = days(NOV2, 30, { "maori-month": "maori.full-moon-start" }).feed.lunar.find((i) => i.name === "Whiro")!;
  assert.equal(iso(whiro.date!), "2026-11-09");
  // The full Moon is 14:54 UTC on 24 Nov: already 25 Nov in New Zealand.
  assert.equal(iso(full.date!), "2026-11-25");
  assert.equal(full.profileKey, "maori.full-moon-start");
  // Hawaiian and Māori night 1 differ too (first crescent versus dark Moon).
  const hilo = days(NOV2).feed.lunar.find((i) => i.name === "Hilo")!;
  assert.ok(compareDates(hilo.date!, whiro.date!) > 0);
});

test("9. filters preserve date order; 10. every interpretation links a source and a History page", () => {
  for (const category of ["farming", "fishing", "ceremony"] as const) {
    const moons = moonDays(NOV2, 61, EAT);
    const feed = adviceAhead(bundle, NOV2, moons, {});
    const d = adviceDays(feed, moons, NOV2, 30, { category, culture: "all", tier: "all" });
    const serials = d.map((x) => x.serial);
    assert.deepEqual(serials, [...serials].sort((a, b) => a - b));
    assert.ok(d.every((x) => x.rows.every((r) => r.item.categories.includes(category))));
  }
  for (const day of days(NOV2).days)
    for (const r of day.rows) {
      assert.ok(r.item.sources.length > 0 && r.item.sources.every((s) => s.title), `${r.item.id} has a source`);
      // Mercury is calculated astronomy with an astrological reading, not a researched culture.
      if (r.item.cultureKey !== "astrology.western") assert.ok(bundle.cultures.some((c) => c.key === r.item.cultureKey), `${r.item.id} has a History page`);
    }
});

test("every profile states its fields; one profile per default group; no universal rule", () => {
  const groups = new Map<string, number>();
  for (const p of MAPPING_PROFILES) {
    assert.ok(p.cultureKey && p.community && p.calendarSystem && p.monthBoundary && p.timezone && p.region && p.assumption && p.historicalPeriod, p.key);
    assert.ok(p.sourceKeys.length > 0, `${p.key} cites a source`);
    if (p.isDefault) groups.set(p.group, (groups.get(p.group) ?? 0) + 1);
  }
  assert.ok([...groups.values()].every((n) => n === 1));
  assert.equal(profileFor("some.unknown.system"), null);
});

test("coverage counts add up and verified needs a listing, not a calculation", () => {
  const c = mappingCoverage(bundle);
  assert.ok(c.total > 200 && c.actionable > 50);
  assert.ok(c.verified > 0 && c.estimated > c.verified && c.awaiting > 0);
  assert.ok(c.culturesMapped >= 5, c.culturesMappedNames.join(", "));
  assert.ok(c.profiles.find((p) => p.profile.key === "igbo.market-week-unanchored")!.records > 0);
});
