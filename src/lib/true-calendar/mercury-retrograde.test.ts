import assert from "node:assert/strict";
import test from "node:test";
import { mercuryRetrogradeStations, MERCURY_TRADITION } from "./mercury-retrograde";

test("Mercury station boundaries alternate between entering and leaving retrograde", () => {
  const stations = mercuryRetrogradeStations(new Date("2026-01-01T00:00:00Z"), new Date("2026-12-31T00:00:00Z"));
  assert.ok(stations.length >= 4 && stations.length <= 10, "Expected multiple Mercury stations in a year");
  for (let i = 1; i < stations.length; i++) {
    assert.ok(stations[i].utc > stations[i-1].utc);
    assert.notEqual(stations[i].kind, stations[i-1].kind);
  }
  for (const s of stations) assert.match(s.dateLocal, /^2026-\d\d-\d\d$/);
});
test("source attribution is explicit and historical overclaim is avoided", () => {
  assert.ok(MERCURY_TRADITION.historicalSource.startsWith("https://"));
  assert.match(MERCURY_TRADITION.historicalCaveat, /not established/);
  assert.ok(MERCURY_TRADITION.category.includes("trade"));
});
test("rejects invalid ranges", () => {
  assert.throws(() => mercuryRetrogradeStations(new Date("2027-01-01"), new Date("2026-01-01")));
});
