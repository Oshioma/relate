import { test } from "node:test";
import assert from "node:assert/strict";
import { isRecent } from "./recency";

test("isRecent is true inside the window and false outside it", () => {
  const now = Date.parse("2026-10-08T12:00:00Z");
  assert.equal(isRecent("2026-10-01T12:00:00Z", 14, now), true);
  assert.equal(isRecent("2026-09-20T12:00:00Z", 14, now), false);
  assert.equal(isRecent("not a date", 14, now), false);
});
