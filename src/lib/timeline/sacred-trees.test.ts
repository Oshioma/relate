import { test } from "node:test";
import assert from "node:assert/strict";
import { SACRED_TREES_EVENTS, SACRED_TREES_SOURCES } from "./sacred-trees-seed";

test("sacred tree object dates remain distinct from modern diagram publication", () => {
  assert.equal(SACRED_TREES_EVENTS.length, 9);
  const sources = new Set(SACRED_TREES_SOURCES.map((source) => source.key));
  for (const event of SACRED_TREES_EVENTS) {
    assert.equal(event.claims.length, 1);
    assert.ok(event.claims[0].sourceKey && sources.has(event.claims[0].sourceKey));
    assert.ok(event.claims[0].whatIsDated?.includes("surviving object"));
  }
  const kamitic = SACRED_TREES_EVENTS.find((event) => event.slug === "kamiti-eleven-sphere-copy-2014")!;
  assert.equal(kamitic.claims[0].startYear, 2014);
  assert.match(kamitic.claims[0].evidence, /not an ancient Egyptian artifact/i);
  const kabbalah = SACRED_TREES_EVENTS.find((event) => event.slug === "sefirotic-tree-spain-1284")!;
  assert.equal(kabbalah.claims[0].startYear, 1284);
  const nimrud = SACRED_TREES_EVENTS.find((event) => event.slug === "nimrud-sacred-tree-relief")!;
  assert.equal(nimrud.claims[0].startYear, -882);
  assert.equal(nimrud.claims[0].endYear, -858);
});
