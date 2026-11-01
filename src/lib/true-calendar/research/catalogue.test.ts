import { test } from "node:test";
import assert from "node:assert/strict";
import { filterCatalogue } from "./catalogue";

const cultures = [
  { key: "test.a", name: "Ëxample A", continent: "Africa", region: "West", research_status: "partial", period_start: -500, period_end: null, continues_today: "yes", countries: ["Somewhere"] },
  { key: "test.b", name: "Example B", continent: "Europe", region: "North", research_status: "not_started" },
];
const systems = [{ culture_key: "test.a", kind: "day_cycle", name: "Market week" }];
const none = { q: "", continent: "", kind: "", status: "", period: "" };

test("catalogue filters combine, ignore accents, and search calendar names", () => {
  assert.equal(filterCatalogue(cultures, systems, none).length, 2);
  assert.deepEqual(filterCatalogue(cultures, systems, { ...none, q: "example a" }).map((c) => c.key), ["test.a"]);
  assert.deepEqual(filterCatalogue(cultures, systems, { ...none, q: "market" }).map((c) => c.key), ["test.a"]);
  assert.deepEqual(filterCatalogue(cultures, systems, { ...none, kind: "day_cycle" }).map((c) => c.key), ["test.a"]);
  assert.deepEqual(filterCatalogue(cultures, systems, { ...none, continent: "Europe", status: "not_started" }).map((c) => c.key), ["test.b"]);
  assert.deepEqual(filterCatalogue(cultures, systems, { ...none, period: "ancient" }).map((c) => c.key), ["test.a"]);
  assert.deepEqual(filterCatalogue(cultures, systems, { ...none, period: "living" }).map((c) => c.key), ["test.a"]);
});
