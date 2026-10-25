import { test } from "node:test";
import assert from "node:assert/strict";
import { visibleCountForHash } from "./hash-target";

const ids = Array.from({ length: 32 }, (_, i) => `id-${i}`);

test("an event already shown keeps the current page", () => {
  assert.equal(visibleCountForHash(ids, "#event-id-3", 10, 10), 10);
});

test("an event further down opens enough pages to show it", () => {
  assert.equal(visibleCountForHash(ids, "#event-id-17", 10, 10), 20);
  assert.equal(visibleCountForHash(ids, "#event-id-31", 10, 10), 40);
});

test("unknown or unrelated hashes change nothing", () => {
  assert.equal(visibleCountForHash(ids, "#event-missing", 10, 10), 10);
  assert.equal(visibleCountForHash(ids, "#add-event", 10, 10), 10);
  assert.equal(visibleCountForHash(ids, "", 10, 10), 10);
});
