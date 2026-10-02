import { test } from "node:test";
import assert from "node:assert/strict";

import { fingerDistance, pinchWindow } from "./pinch";
import { fractionOf, positionAt } from "./time";

const start = { window: { from: -12_000, to: -8_000 }, distance: 100, anchor: 0.25 };

test("the date between the fingers stays between them as they spread", () => {
  const date = positionAt(start.window, start.anchor);
  const next = pinchWindow(start, 200, start.anchor);
  assert.ok(Math.abs(fractionOf(next, date) - start.anchor) < 1e-9);
  assert.ok(Math.abs(next.to - next.from - 2_000) < 1e-6, "twice as far apart is twice as close");
});

test("pinching together zooms out about the same date", () => {
  const date = positionAt(start.window, start.anchor);
  const next = pinchWindow(start, 50, start.anchor);
  assert.ok(next.to - next.from > 4_000);
  assert.ok(Math.abs(fractionOf(next, date) - start.anchor) < 1e-9);
});

test("sliding both fingers sideways carries the date with them", () => {
  const date = positionAt(start.window, start.anchor);
  const next = pinchWindow(start, 150, 0.6);
  assert.ok(Math.abs(fractionOf(next, date) - 0.6) < 1e-9, `date is at ${fractionOf(next, date)}`);
});

test("the same holds on the log axis", () => {
  const logStart = { window: { from: -1_000_000, to: 1500 }, distance: 120, anchor: 0.4 };
  const date = positionAt(logStart.window, logStart.anchor, "log");
  const next = pinchWindow(logStart, 240, 0.5, "log");
  assert.ok(Math.abs(fractionOf(next, date, "log") - 0.5) < 1e-6);
});

test("a vertical pinch is measured, not read as zero", () => {
  assert.equal(fingerDistance({ x: 10, y: 0 }, { x: 10, y: 80 }), 80);
  assert.equal(fingerDistance({ x: 3, y: 4 }, { x: 0, y: 0 }), 5);
});
