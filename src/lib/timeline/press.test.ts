import { test } from "node:test";
import assert from "node:assert/strict";

import { dragThreshold, isDrag } from "./press";

test("a click's tremor is not a drag", () => {
  for (const dx of [0, 1, -2, 3, -3]) assert.equal(isDrag(dx, "mouse"), false, `${dx}px`);
});

test("a deliberate push sideways is a drag, either way", () => {
  assert.equal(isDrag(dragThreshold("mouse"), "mouse"), true);
  assert.equal(isDrag(-12, "mouse"), true);
  assert.equal(isDrag(12, "pen"), true);
});

test("a fingertip gets more room before a tap stops being a tap", () => {
  assert.ok(dragThreshold("touch") > dragThreshold("mouse"));
  assert.equal(isDrag(5, "touch"), false);
  assert.equal(isDrag(-9, "touch"), true);
});
