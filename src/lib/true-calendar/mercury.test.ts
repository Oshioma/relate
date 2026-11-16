import { test } from "node:test";
import assert from "node:assert/strict";
import { mercuryOn, mercuryStationsInYear, retrogradePeriods } from "./mercury";
import { formatIsoDate, zonedParts } from "./dates";

const EAT = "Africa/Dar_es_Salaam";
const iso = formatIsoDate;

test("2026 retrograde periods match the published dates", () => {
  const p = retrogradePeriods(2026, 2026).filter((x) => x.start.getUTCFullYear() === 2026);
  assert.deepEqual(
    p.map((x) => [x.start.toISOString().slice(0, 10), x.end.toISOString().slice(0, 10)]),
    [
      ["2026-02-26", "2026-03-20"],
      ["2026-06-29", "2026-07-23"],
      ["2026-10-24", "2026-11-13"],
    ]
  );
  // Stations alternate, three or four times each way a year.
  const s = mercuryStationsInYear(2026);
  for (let i = 1; i < s.length; i++) assert.notEqual(s[i].kind, s[i - 1].kind);
});

test("2 Nov 2026 is day 10 of a 21-day retrograde, 24 Oct to 13 Nov (EAT)", () => {
  const m = mercuryOn({ year: 2026, month: 11, day: 2 }, EAT);
  assert.equal(m.retrograde, true);
  assert.equal(iso(m.startDate), "2026-10-24");
  assert.equal(iso(m.endDate), "2026-11-13");
  assert.equal(m.day, 10);
  assert.equal(m.length, 21);
  assert.equal(m.station, null);
});

test("station days and the days around them", () => {
  assert.equal(mercuryOn({ year: 2026, month: 10, day: 24 }, EAT).station, "retrograde");
  const end = mercuryOn({ year: 2026, month: 11, day: 13 }, EAT);
  assert.equal(end.station, "direct");
  assert.equal(end.retrograde, true);
  const after = mercuryOn({ year: 2026, month: 11, day: 14 }, EAT);
  assert.equal(after.retrograde, false);
  assert.equal(after.day, null);
  // When direct, the period is the next one.
  assert.equal(iso(after.startDate).slice(0, 7), "2027-02");
  assert.equal(mercuryOn({ year: 2026, month: 10, day: 23 }, EAT).retrograde, false);
});

test("timezones: a station near midnight UTC falls on different local dates", () => {
  const s = mercuryStationsInYear(2026).find((x) => x.kind === "direct" && x.instant.toISOString().startsWith("2026-07-23"))!;
  const utc = zonedParts(s.instant, "UTC");
  assert.ok(utc.hour >= 20, `station at ${utc.hour}:00 UTC`);
  // Already 24 July in Zanzibar, still 23 July in Hawaiʻi.
  assert.equal(mercuryOn({ year: 2026, month: 7, day: 24 }, EAT).station, "direct");
  assert.equal(mercuryOn({ year: 2026, month: 7, day: 23 }, "Pacific/Honolulu").station, "direct");
});

test("a retrograde period that crosses a year boundary is found from either side", () => {
  const all = retrogradePeriods(2000, 2040);
  const crossing = all.find((p) => p.start.getUTCFullYear() !== p.end.getUTCFullYear());
  assert.ok(crossing, "some period crosses New Year");
  const mid = new Date((crossing.start.getTime() + crossing.end.getTime()) / 2);
  const d = { year: mid.getUTCFullYear(), month: mid.getUTCMonth() + 1, day: mid.getUTCDate() };
  assert.equal(mercuryOn(d, "UTC").retrograde, true);
});
