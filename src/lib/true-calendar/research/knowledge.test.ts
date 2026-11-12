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
import { cyclePositionOn } from "./daily";
import { jianchuOn, sexagenaryName, tithiOn } from "./day-rules";
import { explainItem } from "./explanations";

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

// --- Batch 09: a line for every day from five more traditions ---------------

test("at least 8 lines a day: Nov 2026 and Jul 2027 average 8+ interpretations from 6+ traditions", () => {
  for (const from of [d(2026, 11, 1), d(2027, 7, 1)]) {
    const daily = dailyCoverage(bundle, from, 30, EAT);
    assert.equal(daily.emptyDays.length, 0);
    assert.ok(daily.avgInterpretations >= 8, `${iso(from)}: ${daily.avgInterpretations}`);
    assert.ok(daily.avgCultures >= 6, `${iso(from)}: ${daily.avgCultures}`);
  }
});

test("Maya day names follow the GMT correlation: 21 Dec 2012 was Ajaw, 16 May 2026 Ix, 2 Nov 2026 Kʼan", () => {
  const cycle = bundle.cycles.find((c) => c.key === "americas.maya.tzolkin.day-names")!;
  const nameOn = (x: CivilDate) => bundle.positions.find((p) => p.cycle_key === cycle.key && p.position === cyclePositionOn(cycle, x))!.name;
  assert.equal(nameOn(d(2012, 12, 21)), "Ajaw");
  assert.equal(nameOn(d(2026, 5, 16)), "Ix"); // 10 Ix 7 Sip on the FAMSI converter
  assert.equal(nameOn(d(2026, 11, 2)), "Kʼan");
  const haab = bundle.cycles.find((c) => c.key === "americas.maya.haab.year")!;
  assert.equal(cyclePositionOn(haab, d(2026, 5, 16)), 2 * 20 + 7, "7 Sip");
});

test("Akan: the six-day week meets the seven-day week in the 42-day grid (Akwasidae = Kuru on a Sunday)", () => {
  const { days } = view(d(2026, 11, 1), 30);
  const on = (x: string) => days.find((y) => iso(y.date) === x)!.rows.map((r) => r.item.name);
  assert.ok(on("2026-11-22").includes("Akwasidae") && on("2026-11-22").includes("Kuru") && on("2026-11-22").includes("Kwasiada"));
  // Awukudae is Kuru on a Wednesday, 24 days after Akwasidae: 4 Nov 2026 (from 11 Oct).
  assert.ok(on("2026-11-04").includes("Awukudae") && on("2026-11-04").includes("Wukuada"));
  // Bartle's 1978 dates count to the same cycle as the 2026 listings.
  assert.equal((daysFromCivil(d(2026, 2, 1)) - daysFromCivil(d(1978, 1, 8))) % 42, 0);
});

test("Hindu tithi at sunrise: 2 Nov 2026 is Kṛṣṇa Aṣṭamī; Ekādaśī comes twice a month", () => {
  assert.equal(tithiOn(d(2026, 11, 2)), 23);
  const { days } = view(d(2026, 11, 1), 60);
  const ek = days.filter((x) => x.rows.some((r) => /Ekādaśī/.test(r.item.name)));
  assert.ok(ek.length >= 3 && ek.length <= 5, ek.map((x) => iso(x.date)).join(","));
  // Never two tithis on one day (a yearly festival on the same day is its own row).
  for (const x of days) assert.ok(x.rows.filter((r) => r.item.systemKey === "asia.south.vedic-hindu.tithi" && r.item.id.startsWith("night|")).length <= 1, iso(x.date));
});

test("Chinese day officers: 2 Nov 2026 (庚辰) is 破; the officer repeats when Lidong opens the 亥 month", () => {
  assert.equal(sexagenaryName(d(2026, 11, 2)), "庚辰");
  assert.equal(sexagenaryName(d(1949, 10, 1)), "甲子");
  assert.equal(jianchuOn(d(2026, 11, 2)), 6); // 破
  // 6 and 7 November 2026: the day before and the day of Lidong share an officer.
  assert.equal(jianchuOn(d(2026, 11, 6)), jianchuOn(d(2026, 11, 7)));
  const { days } = view(d(2026, 11, 1), 30);
  assert.ok(days.every((x) => x.rows.filter((r) => r.item.systemKey === "asia.east.chinese.jianchu").length === 1), "one officer every day");
});

test("every line has a plain-words explanation", () => {
  const { days } = view(d(2026, 11, 1), 365);
  const missing = new Set<string>();
  for (const x of days) for (const r of x.rows) if (!explainItem(r.item)) missing.add(r.item.id);
  assert.deepEqual([...missing], []);
});

test("Hindu yearly festivals land on their published dates", () => {
  // Published dates (Wikipedia infoboxes, which cite Drik Panchang and news listings).
  const cases: [string, string[]][] = [
    ["ugadi-gudi-padwa", ["2025-03-30", "2026-03-19"]],
    ["vasant-panchami", ["2026-01-23", "2027-02-11"]],
    ["ganesh-chaturthi", ["2025-08-27", "2026-09-14", "2027-09-04"]],
    ["krishna-janmashtami", ["2026-09-04"]],
    ["nandotsava", ["2026-09-05"]],
    ["maha-navami", ["2026-10-19"]],
    ["vijayadashami", ["2026-10-20"]],
    ["govardhan-puja-bali-pratipada", ["2025-10-22"]],
    ["bhai-dooj", ["2026-11-11"]],
    ["chhath", ["2026-11-15"]],
    ["karva-chauth", ["2026-10-29"]],
    ["diwali", ["2027-10-29"]],
    ["maha-shivaratri", ["2027-03-06"]],
    ["rama-navami", ["2027-04-15"]],
  ];
  const { days } = view(d(2025, 1, 1), 1095);
  for (const [slug, dates] of cases) {
    const got = days.filter((x) => x.rows.some((r) => r.item.id === `obs|asia.south.vedic-hindu.tithi.festival.${slug}`)).map((x) => iso(x.date));
    for (const want of dates) assert.ok(got.includes(want), `${slug}: ${got.join(",")} lacks ${want}`);
  }
  // 2026 has an extra (adhika) Jyeshtha, 17 May to 15 June: no festival falls in it.
  const adhika = days.filter((x) => iso(x.date) >= "2026-05-17" && iso(x.date) <= "2026-06-15" && x.rows.some((r) => r.item.id.includes(".festival.")));
  assert.deepEqual(adhika.map((x) => iso(x.date)), []);
});

test("a day shows only what belongs to that day or month", () => {
  const { days } = view(d(2026, 11, 1), 120);
  const items = new Map(days.flatMap((x) => x.rows.map((r) => [r.item.id, r.item] as const)));
  for (const item of items.values()) {
    if (!item.id.startsWith("night|")) continue;
    const text = [...item.says, ...item.modern, item.caution ?? "", explainItem(item) ?? ""].join(" ");
    // A lunar day shown every month never lists other months' festivals.
    assert.doesNotMatch(text, /particular months|big festival|some months/i, item.id);
    // Sayce's rules for the second (inserted) Ulūlu are not shown in ordinary months.
    assert.doesNotMatch(text, /second\)? Ulūlu|Sayce/, item.id);
  }
  // Day 19 held only in Ulūlu: shown as Ulūlu's own rule, not every month.
  assert.ok(![...items.keys()].includes("night|middle-east.babylonian.lunisolar.day-19"));
  assert.ok(![...items.keys()].includes("night|middle-east.babylonian.lunisolar.day-02"));
});
