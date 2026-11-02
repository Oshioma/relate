// The daily knowledge engine: every date a hub of every tradition's knowledge.
import { test } from "node:test";
import assert from "node:assert/strict";
import { type CivilDate, addDays, compareDates, daysFromCivil, formatIsoDate } from "../dates";
import { moonDays } from "../astronomy";
import { formatFixedDate, gregorianToFixed } from "../fixed";
import { type AdviceCategory, adviceAhead, adviceDays, nightGroupsOf } from "./ahead";
import { dailyCoverage, mappingCoverage } from "./coverage";
import { anchorDates, lunarNightDates, monthSpans, profileFor } from "./mapping";
import { publishedBundle } from "./test-bundle";

const EAT = "Africa/Dar_es_Salaam";
const iso = formatIsoDate;
const bundle = publishedBundle();
const d = (year: number, month: number, day: number): CivilDate => ({ year, month, day });

function view(from: CivilDate, range = 30, category: AdviceCategory | "all" = "all") {
  const moons = moonDays(from, range + 31, EAT);
  const feed = adviceAhead(bundle, from, moons, { tz: EAT });
  return { feed, days: adviceDays(feed, moons, from, range, { category, culture: "all", tier: "all" }) };
}

for (const [label, from] of [
  ["November 2026", d(2026, 11, 1)],
  ["July 2027", d(2027, 7, 1)],
  ["across the year boundary", d(2026, 12, 15)],
] as const) {
  test(`${label}: one card per date, strict date order, many cultures under one date`, () => {
    const { days } = view(from, 31);
    const serials = days.map((x) => x.serial);
    assert.deepEqual(serials, [...serials].sort((a, b) => a - b));
    assert.equal(new Set(days.map((x) => x.id)).size, days.length, "one card per date");
    // Every day in these months has dated knowledge from more than one culture somewhere.
    assert.ok(days.some((x) => x.cultures.length >= 4), "at least one day with four or more cultures");
    for (const day of days) {
      for (const r of day.rows) {
        assert.ok(r.item.recurrence, `${r.item.id} says how often it comes round`);
        assert.ok(r.item.sources.length > 0, `${r.item.id} has a source`);
      }
    }
  });
}

test("across the year boundary: dates run on from December into January, Akwasidae on 3 January 2027", () => {
  const { days } = view(d(2026, 12, 20), 30);
  assert.ok(days.some((x) => x.date.year === 2027));
  const jan3 = days.find((x) => iso(x.date) === "2027-01-03");
  assert.ok(jan3?.rows.some((r) => r.item.cultureKey === "africa.west.akan" && r.item.recurrence === "Every 42 days"));
});

test("29- and 30-night months: a 29-night month has no night 30, and night 1 follows night 29", () => {
  const hilo = profileFor("oceania.hawaiian.oahu-lunar-nights")!;
  const from = d(2026, 1, 1);
  const to = d(2027, 12, 31);
  const anchors = anchorDates(hilo, from, to);
  const lengths = anchors.slice(1).map((a, i) => daysFromCivil(a) - daysFromCivil(anchors[i]));
  assert.ok(lengths.every((n) => n === 29 || n === 30), lengths.join(","));
  assert.ok(lengths.includes(29) && lengths.includes(30));
  // Night 30 exists only in 30-night months.
  const nights30 = lunarNightDates(hilo, 30, anchors[0], addDays(anchors[anchors.length - 1], -1), anchors);
  assert.equal(nights30.length, lengths.filter((n) => n === 30).length);
  for (let i = 0; i < anchors.length - 1; i++) {
    const last = lengths[i] === 30 ? 30 : 29;
    const lastNight = lunarNightDates(hilo, last, anchors[i], addDays(anchors[i + 1], -1), [anchors[i], anchors[i + 1]]);
    assert.deepEqual(lastNight.map(iso), [iso(addDays(anchors[i + 1], -1))], "the month's last night is the day before the next night 1");
  }
});

test("named nights advance one a day and reset at the month boundary", () => {
  const { days } = view(d(2026, 11, 1), 40);
  const hawaiian = days.flatMap((x) => x.rows.filter((r) => r.item.systemKey === "oceania.hawaiian.oahu-lunar-nights").map((r) => ({ serial: x.serial, night: r.item.night! })));
  for (let i = 1; i < hawaiian.length; i++) {
    const prev = hawaiian[i - 1];
    const cur = hawaiian[i];
    if (cur.serial === prev.serial + 1) assert.ok(cur.night === prev.night + 1 || cur.night === 1, `${prev.night} → ${cur.night}`);
  }
  assert.ok(hawaiian.some((h, i) => i > 0 && h.night === 1 && hawaiian[i - 1].night >= 29), "the count resets to night 1");
});

test("runs of same-named nights are grouped from the sources' own names", () => {
  const groups = nightGroupsOf(bundle.lunarDays);
  const kaloa = bundle.lunarDays.filter((x) => x.system_key === "oceania.hawaiian.oahu-lunar-nights" && /^Kāloa/.test(x.name ?? ""));
  assert.ok(kaloa.length === 3 && kaloa.every((x) => groups.get(x.key)?.label === "Kāloa nights" && groups.get(x.key)?.count === 3));
  const tangaroa = bundle.lunarDays.filter((x) => x.system_key === "oceania.maori.kahungunu-maramataka" && /^Tangaroa/.test(x.name ?? ""));
  assert.ok(tangaroa.length >= 3 && tangaroa.every((x) => groups.get(x.key)?.label === "Tangaroa nights"));
  // Te Papa's list is a display order, not a night count: no runs.
  assert.ok(bundle.lunarDays.filter((x) => /tepapa-sequence$/.test(x.system_key)).every((x) => !groups.has(x.key)));
});

test("Babylonian months: Nisānu begins nearest the March equinox; months are 29 or 30 days, back to back", () => {
  const p = profileFor("middle-east.babylonian.lunisolar")!;
  assert.equal(p.illustrative, true);
  const spans = monthSpans(p, d(2027, 1, 1), d(2028, 6, 30));
  for (let i = 1; i < spans.length; i++) assert.equal(daysFromCivil(spans[i].start), daysFromCivil(spans[i - 1].end) + 1);
  assert.ok(spans.every((s) => [29, 30].includes(daysFromCivil(s.end) - daysFromCivil(s.start) + 1)));
  const nisanu = spans.filter((s) => s.ordinal === 1);
  assert.equal(nisanu.length, 2);
  for (const n of nisanu) {
    const equinox = d(n.start.year, 3, 20);
    assert.ok(Math.abs(daysFromCivil(n.start) - daysFromCivil(equinox)) <= 16, iso(n.start));
  }
  // A year has 12 or 13 months.
  const between = spans.filter((s) => compareDates(s.start, nisanu[0].start) >= 0 && compareDates(s.start, nisanu[1].start) < 0);
  assert.ok(between.length === 12 || between.length === 13);
});

test("Babylonian month-only days fall once a year, in their own month", () => {
  const { feed } = view(d(2027, 3, 25), 30);
  const all = [...feed.dated, ...feed.lunar, ...feed.seasonal];
  const marry = all.find((i) => i.id === "obs|middle-east.babylonian.lunisolar.aru-08-marriage");
  assert.ok(marry && marry.recurrence.startsWith("Once a year") && marry.status === "illustrative");
  const aru = monthSpans(profileFor("middle-east.babylonian.lunisolar")!, d(2027, 3, 25), d(2027, 5, 30)).find((s) => s.ordinal === 2)!;
  assert.deepEqual(marry.dates?.map(iso), [iso(addDays(aru.start, 7))]);
  // The general 7th/14th/21st/28th days come round every month.
  const day7 = all.find((i) => i.id === "night|middle-east.babylonian.lunisolar.day-07");
  assert.ok(day7 && day7.recurrence.startsWith("Monthly") && day7.categories.length > 0);
});

test("Tūhoe months: Pipiri is the month of Matariki, and every day says which month it is in", () => {
  const p = profileFor("oceania.maori.tuhoe-months")!;
  assert.equal(p.level, "B");
  const spans = monthSpans(p, d(2027, 5, 1), d(2027, 8, 30));
  const pipiri = spans.find((s) => s.ordinal === 1)!;
  assert.ok(compareDates(pipiri.start, d(2027, 6, 25)) <= 0 && compareDates(pipiri.end, d(2027, 6, 25)) >= 0, "Matariki 25 June 2027 falls in Pipiri");
  const { days } = view(d(2027, 7, 1), 10);
  assert.ok(days.every((x) => x.periods.some((t) => /Tūhoe month/.test(t.label))));
  // No Matariki date listed for the year: the months are not named.
  assert.equal(monthSpans(p, d(2040, 1, 1), d(2040, 12, 31)).filter((s) => s.ordinal !== null).length, 0);
});

test("Mercury retrograde appears under Trade, Communication and Travel, with its day count", () => {
  for (const category of ["trade", "communication", "travel"] as const) {
    const { days } = view(d(2026, 11, 2), 14, category);
    const merc = days.filter((x) => x.rows.some((r) => r.item.name === "Mercury retrograde"));
    assert.equal(merc.length, 12, `${category}: 2 to 13 November`);
    assert.equal(iso(merc[merc.length - 1].date), "2026-11-13");
  }
  const { days } = view(d(2026, 11, 2), 1);
  const tag = days[0].periods.find((p) => p.label === "Mercury retrograde")!;
  assert.deepEqual([tag.day, tag.length], [10, 21]);
});

test("filters act on single interpretations and keep date order", () => {
  for (const category of ["travel", "communication", "health", "rest", "trade", "fishing"] as const) {
    const { days } = view(d(2027, 3, 20), 60, category);
    const serials = days.map((x) => x.serial);
    assert.deepEqual(serials, [...serials].sort((a, b) => a - b));
    assert.ok(days.every((x) => x.rows.length > 0 && x.rows.every((r) => r.item.categories.includes(category))), category);
  }
});

test("Gregorian and International Fixed Calendar agree on the card dates", () => {
  assert.equal(formatFixedDate(gregorianToFixed(d(2026, 11, 2))), "26 October 2026");
  assert.equal(formatFixedDate(gregorianToFixed(d(2026, 12, 31))), "Year Day 2026");
});

test("coverage counts what readers see, and names the research gaps", () => {
  const c = mappingCoverage(bundle);
  assert.ok(c.culturesMappedNames.includes("Babylonian (Mesopotamia)"));
  assert.equal(c.unsourced, 0, "every published record has a source");
  const daily = dailyCoverage(bundle, d(2026, 11, 2), 30, EAT);
  assert.equal(daily.perDay.length, 30);
  assert.equal(daily.datesWithAdvice + daily.emptyDays.length, 30);
  assert.ok(daily.avgCultures >= 2 && daily.avgInterpretations >= daily.avgCultures);
});
