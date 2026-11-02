import { test } from "node:test";
import assert from "node:assert/strict";
import {
  brownLunationNumber,
  fullMoonSize,
  lunarMonthContaining,
  moonDay,
  moonDistanceKm,
  newMoonsInYear,
  nextLunarEclipse,
  nextQuarter,
  nextSolarEclipse,
  riseSetOn,
  seasonEventsOn,
  seasonsOf,
  stepLunarMonth,
  SUGGESTED_PLACES,
  tidalPhase,
} from "./astronomy";
import { civilDateAt } from "./dates";

// Reference times are from NASA / US Naval Observatory published tables
// (rounded to the minute there); we allow a few minutes either way.
function near(actual: Date, isoUtc: string, minutes = 3) {
  const diff = Math.abs(actual.getTime() - new Date(isoUtc).getTime()) / 60000;
  assert.ok(diff <= minutes, `${actual.toISOString()} is ${diff.toFixed(1)} min from ${isoUtc}`);
}

test("principal phases match published times", () => {
  near(nextQuarter(new Date("2024-04-01T00:00Z"), "new").instant, "2024-04-08T18:21Z");
  near(nextQuarter(new Date("2024-04-10T00:00Z"), "full").instant, "2024-04-23T23:49Z");
  near(nextQuarter(new Date("2000-01-01T00:00Z"), "new").instant, "2000-01-06T18:14Z");
});

test("Nov-Dec 2026 phases match USNO (research batch 03)", () => {
  near(nextQuarter(new Date("2026-11-02T00:00Z"), "new").instant, "2026-11-09T07:02Z");
  near(nextQuarter(new Date("2026-11-02T00:00Z"), "first").instant, "2026-11-17T11:48Z");
  near(nextQuarter(new Date("2026-11-02T00:00Z"), "full").instant, "2026-11-24T14:53Z");
  near(nextQuarter(new Date("2026-11-02T00:00Z"), "last").instant, "2026-12-01T06:08Z");
  near(nextQuarter(new Date("2026-11-10T00:00Z"), "new").instant, "2026-12-09T00:52Z");
});

test("eclipses match NASA's catalogue", () => {
  const solar = nextSolarEclipse(new Date("2024-03-01T00:00Z"));
  assert.equal(solar.kind, "total");
  near(solar.peak, "2024-04-08T18:17Z", 5);
  const lunar = nextLunarEclipse(new Date("2025-03-01T00:00Z"));
  assert.equal(lunar.kind, "total");
  near(lunar.peak, "2025-03-14T06:59Z", 5);
});

test("equinoxes and solstices", () => {
  const [march, , , december] = seasonsOf(2024);
  near(march.instant, "2024-03-20T03:06Z");
  near(december.instant, "2024-12-21T09:20Z");
  // 21 Dec 2024 09:20 UTC is the 21st in Zanzibar and in London.
  assert.equal(seasonEventsOn({ year: 2024, month: 12, day: 21 }, "Africa/Dar_es_Salaam")[0]?.kind, "december-solstice");
});

test("Brown lunation numbers: lunation 1 began in January 1923", () => {
  const jan1923 = newMoonsInYear(1923, "UTC")[0];
  assert.equal(civilDateAt(jan1923, "UTC").month, 1);
  assert.equal(brownLunationNumber(jan1923), 1);
  assert.equal(brownLunationNumber(new Date("2000-01-06T18:14Z")), 953);
});

test("a lunar month starts on the local day of the conjunction and lasts 29 or 30 days", () => {
  // New moon 8 April 2024 18:21 UTC: still the 8th in Los Angeles, already
  // the 9th in Auckland — so lunar day 1 differs by place.
  const la = lunarMonthContaining({ year: 2024, month: 4, day: 8 }, "America/Los_Angeles");
  assert.equal(la.day, 1);
  const akl = lunarMonthContaining({ year: 2024, month: 4, day: 8 }, "Pacific/Auckland");
  assert.notEqual(akl.day, 1);
  assert.equal(lunarMonthContaining({ year: 2024, month: 4, day: 9 }, "Pacific/Auckland").day, 1);

  for (let m = 1; m <= 12; m++) {
    const { month } = lunarMonthContaining({ year: 2026, month: m, day: 15 }, "Africa/Dar_es_Salaam");
    assert.ok(month.length === 29 || month.length === 30, `length ${month.length}`);
  }
});

test("a year has 12 or 13 lunar months and they are numbered in order", () => {
  for (const year of [2023, 2024, 2025, 2026]) {
    const n = newMoonsInYear(year, "UTC").length;
    assert.ok(n === 12 || n === 13);
  }
  const first = lunarMonthContaining({ year: 2026, month: 1, day: 25 }, "UTC").month;
  const next = lunarMonthContaining(stepLunarMonth({ month: first, day: 3 }, 1, "UTC"), "UTC");
  assert.equal(next.month.numberInYear, first.numberInYear + 1);
  assert.equal(next.day, 3);
});

test("days carry a principal phase only on the local day it happens", () => {
  const fullDay = moonDay({ year: 2024, month: 4, day: 23 }, "Europe/London");
  assert.equal(fullDay.quarter, null); // 23:49 UTC is 00:49 BST on the 24th
  assert.equal(moonDay({ year: 2024, month: 4, day: 24 }, "Europe/London").name, "Full Moon");
  assert.equal(moonDay({ year: 2024, month: 4, day: 23 }, "UTC").name, "Full Moon");
  assert.ok(fullDay.state.illumination > 0.97);
  const crescent = moonDay({ year: 2024, month: 4, day: 11 }, "UTC");
  assert.equal(crescent.name, "Waxing Crescent");
  assert.ok(crescent.state.waxing);
  assert.ok(crescent.state.ageDays > 2 && crescent.state.ageDays < 3);
});

test("supermoon and micromoon by distance", () => {
  // 17 October 2024 was the closest full moon of that year (~357,000 km).
  const oct = nextQuarter(new Date("2024-10-10T00:00Z"), "full").instant;
  assert.equal(fullMoonSize(moonDistanceKm(oct)), "supermoon");
  // 24 Feb 2024 was the year's most distant full moon (~406,000 km).
  const feb = nextQuarter(new Date("2024-02-15T00:00Z"), "full").instant;
  assert.equal(fullMoonSize(moonDistanceKm(feb)), "micromoon");
});

test("spring and neap relationship", () => {
  assert.equal(tidalPhase(2), "spring");
  assert.equal(tidalPhase(181), "spring");
  assert.equal(tidalPhase(358), "spring");
  assert.equal(tidalPhase(92), "neap");
  assert.equal(tidalPhase(268), "neap");
  assert.equal(tidalPhase(50), "between");
});

test("sunrise in Stone Town is a little after 06:00 local", () => {
  const zanzibar = SUGGESTED_PLACES[0];
  const r = riseSetOn({ year: 2026, month: 11, day: 1 }, "Africa/Dar_es_Salaam", zanzibar);
  assert.ok(r.sunrise && r.sunset);
  const local = (d: Date) => new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Dar_es_Salaam", hour: "2-digit", minute: "2-digit" }).format(d);
  assert.match(local(r.sunrise!), /^0[56]:/);
  assert.match(local(r.sunset!), /^18:/);
});
