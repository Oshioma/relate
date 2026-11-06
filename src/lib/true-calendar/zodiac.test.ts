import { test } from "node:test";
import assert from "node:assert/strict";
import {
  exportIngressCache,
  formatDuration,
  importIngressCache,
  moonIngresses,
  moonSignStays,
  nextHighlighted,
  personalEvents,
  signName,
  solarHouse,
  stayDates,
  sunSign,
} from "./zodiac";
import { civilDateAt, formatIsoDate } from "./dates";

const MIN = 60_000;

// Reference instants from NASA JPL Horizons (Moon/Sun, geocentric, quantity 31,
// observer ecliptic longitude): at each instant the longitude is within 0.0012°
// of the sign boundary, i.e. a few seconds of Moon motion.
const HORIZONS = [
  { sign: 0, at: "2026-11-20T05:52:07Z" }, // 359.99884°
  { sign: 1, at: "2026-11-22T10:09:35Z" }, // 29.99887°
  { sign: 2, at: "2026-11-24T11:09:32Z" }, // 59.99912°
];

test("Moon ingresses match JPL Horizons to within a minute", () => {
  const list = moonIngresses(new Date("2026-11-01T00:00:00Z"), new Date("2026-12-01T00:00:00Z"));
  for (const ref of HORIZONS) {
    const hit = list.find((i) => i.sign === ref.sign);
    assert.ok(hit, `${signName(ref.sign)} ingress found`);
    assert.ok(Math.abs(hit.at.getTime() - Date.parse(ref.at)) < MIN, `${signName(ref.sign)}: ${hit.at.toISOString()} vs ${ref.at}`);
  }
});

test("ingresses are real, not a fixed 2.5-day stride, and the signs follow in order", () => {
  const list = moonIngresses(new Date("2026-01-01T00:00:00Z"), new Date("2027-01-01T00:00:00Z"));
  assert.ok(list.length >= 160 && list.length <= 170, `${list.length} ingresses in a year`);
  const gaps = list.slice(1).map((x, i) => (x.at.getTime() - list[i].at.getTime()) / 86_400_000);
  assert.ok(Math.min(...gaps) < 2.1 && Math.max(...gaps) > 2.5, `stays vary: ${Math.min(...gaps).toFixed(2)}–${Math.max(...gaps).toFixed(2)} days`);
  list.slice(1).forEach((x, i) => assert.equal(x.sign, (list[i].sign + 1) % 12));
});

test("stays never duplicate across month edges and tile time exactly", () => {
  const stays = moonSignStays(new Date("2026-10-25T00:00:00Z"), new Date("2027-01-10T00:00:00Z"));
  const ids = new Set(stays.map((s) => `${s.sign}@${s.start.getTime()}`));
  assert.equal(ids.size, stays.length);
  stays.slice(1).forEach((s, i) => assert.equal(s.start.getTime(), stays[i].end.getTime()));
});

test("19 June 1976 is Gemini without a birth time; Taurus is house 12, Cancer house 2", () => {
  const s = sunSign({ date: { year: 1976, month: 6, day: 19 } });
  assert.equal(signName(s.sign), "Gemini");
  assert.equal(s.certain, true);
  assert.equal(solarHouse(1, s.sign), 12);
  assert.equal(solarHouse(2, s.sign), 1);
  assert.equal(solarHouse(3, s.sign), 2);
  const ev = personalEvents(s.sign, new Date("2026-11-20T00:00:00Z"), new Date("2026-11-27T00:00:00Z"));
  const taurus = ev.find((e) => e.sign === 1);
  assert.equal(taurus?.kind, "preceding");
  assert.equal(ev.find((e) => e.sign === 2)?.kind, "sun");
  assert.equal(ev.find((e) => e.sign === 3)?.kind, "following");
  assert.equal(ev.find((e) => e.sign === 0)?.kind, "other");
});

test("a cusp birthday without a time is flagged, and the time settles it", () => {
  // The June solstice of 1976 was at 06:24 UTC on 21 June (Sun at 90°).
  const open = sunSign({ date: { year: 1976, month: 6, day: 21 }, timeZone: "Europe/London" });
  assert.equal(open.certain, false);
  assert.deepEqual([open.sign, open.otherSign].sort(), [2, 3]);
  assert.ok(Math.abs((open.changeAt?.getTime() ?? 0) - Date.parse("1976-06-21T06:23:58Z")) < MIN);
  // 07:00 BST = 06:00 UTC, before the change: Gemini. 08:00 BST = 07:00 UTC: Cancer.
  assert.equal(sunSign({ date: { year: 1976, month: 6, day: 21 }, time: "07:00", timeZone: "Europe/London" }).sign, 2);
  assert.equal(sunSign({ date: { year: 1976, month: 6, day: 21 }, time: "08:00", timeZone: "Europe/London" }).sign, 3);
});

test("the next highlighted period and its countdown", () => {
  const next = nextHighlighted(2, new Date("2026-11-21T00:00:00Z"));
  assert.equal(next?.kind, "preceding");
  assert.equal(next?.sign, 1);
  assert.equal(formatDuration(next!.durationMs), "2 days 1 hour");
  assert.equal(formatDuration(90 * MIN), "1 hour 30 minutes");
});

test("a stay's local dates follow the viewer's timezone", () => {
  const taurus = moonSignStays(new Date("2026-11-22T00:00:00Z"), new Date("2026-11-23T00:00:00Z")).find((s) => s.sign === 1)!;
  assert.deepEqual(stayDates(taurus, "Africa/Dar_es_Salaam", civilDateAt).map(formatIsoDate), ["2026-11-22", "2026-11-23", "2026-11-24"]);
  // In Auckland (UTC+13) the stay starts on the 22nd at 23:09 and ends on the 25th at 00:09.
  assert.deepEqual(stayDates(taurus, "Pacific/Auckland", civilDateAt).map(formatIsoDate), ["2026-11-22", "2026-11-23", "2026-11-24", "2026-11-25"]);
});

test("the ingress cache round-trips and ignores bad data", () => {
  moonIngresses(new Date("2026-11-01T00:00:00Z"), new Date("2026-11-30T00:00:00Z"));
  const saved = exportIngressCache();
  assert.ok(saved["2026-11"].length >= 13);
  importIngressCache({ "2026-13": [[1, 2]], nope: 1, "2031-01": [["x", 1]] });
  importIngressCache(null);
  assert.equal(moonIngresses(new Date("2026-11-22T00:00:00Z"), new Date("2026-11-23T00:00:00Z"))[0].sign, 1);
});
