import { test } from "node:test";
import assert from "node:assert/strict";
import { moonIndexFor, moonsOfYear, withTraditions } from "./moons-of-year";
import { publishedBundle } from "./research/test-bundle";

const TZ = "Africa/Dar_es_Salaam";

test("2026 has 12 Moons that tile the year from the first new Moon, 29 or 30 days each", () => {
  const moons = moonsOfYear(2026, TZ);
  assert.equal(moons.length, 12);
  assert.deepEqual(moons[0].start, { year: 2026, month: 1, day: 18 });
  moons.forEach((m) => assert.ok(m.length === 29 || m.length === 30, `Moon ${m.number}: ${m.length} days`));
  moons.slice(1).forEach((m, i) => assert.equal(m.newMoon.getTime(), moons[i].nextNewMoon.getTime()));
  assert.equal(moonIndexFor(moons, { year: 2026, month: 11, day: 12 }), 10);
  assert.equal(moonIndexFor(moons, { year: 2026, month: 1, day: 5 }), -1);
});

test("a year with a 13th Moon has 13 cards", () => {
  assert.equal(moonsOfYear(2027, TZ).length, 13);
});

test("each Moon carries its sky events: the March 2026 total lunar eclipse and the equinox", () => {
  const moons = moonsOfYear(2026, TZ);
  assert.ok(moons[1].eclipses.some((e) => e.kind === "lunar" && e.type === "total"));
  assert.ok(moons[2].seasons.some((s) => s.kind === "march-equinox"));
  assert.equal(moons[11].fullMoonSize, "supermoon");
});

test("named months are placed only by a tradition's own year rule, with sources", () => {
  const moons = withTraditions(moonsOfYear(2026, TZ), publishedBundle());
  const nov = moons[10].traditions.map((t) => t.label);
  assert.ok(nov.some((l) => /Kislimu \(Babylonian month 9\)/.test(l)), nov.join("; "));
  assert.ok(nov.some((l) => /Whiringa-ā-rangi \(Tūhoe month 6\)/.test(l)), nov.join("; "));
  for (const m of moons) for (const t of m.traditions) {
    assert.ok(t.sources.length > 0, `${t.label} has a source`);
    assert.ok(t.rule.length > 0);
  }
  // No astrology in the traditions' months.
  assert.ok(moons.every((m) => m.traditions.every((t) => !/astrolog/i.test(t.cultureName))));
});

test("each tradition's month carries its dated advice: Kartika's Chhath, Nisānu's day rules", () => {
  const moons = withTraditions(moonsOfYear(2026, TZ), publishedBundle());
  const kartika = moons[10].traditions.find((t) => /^Kartika/.test(t.label));
  assert.ok(kartika, moons[10].traditions.map((t) => t.label).join("; "));
  const chhath = kartika.observances.find((o) => o.name === "Chhath");
  assert.deepEqual(chhath?.date, { year: 2026, month: 11, day: 15 });
  const nisanu = moons.flatMap((m) => m.traditions).find((t) => /Nisānu/.test(t.label))!;
  assert.ok(nisanu.observances.length >= 5);
  // In date order, each inside the tradition's month.
  const dates = nisanu.observances.map((o) => o.date!);
  dates.slice(1).forEach((d, i) => assert.ok(d.year * 400 + d.month * 32 + d.day >= dates[i].year * 400 + dates[i].month * 32 + dates[i].day));
});
