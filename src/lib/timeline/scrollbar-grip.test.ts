import { test } from "node:test";
import assert from "node:assert/strict";

import { barFraction, drawnThumb, windowWithGripAt } from "./scrollbar-grip";

const MIN = 0.02;

test("the thumb marks exactly the dates on screen", () => {
  // The fixed-size thumb this replaces sat over "Now" while the strip showed
  // 125,501 BCE. An exact thumb's edges are the window's own dates.
  const view = { from: -254_000, to: 3000 };
  const thumb = drawnThumb(view, MIN);
  assert.ok(Math.abs(thumb.from - barFraction(view.from)) < 1e-9);
  assert.ok(Math.abs(thumb.from + thumb.width - barFraction(view.to)) < 1e-9);
});

test("a drag keeps the gripped point under the pointer and the zoom unchanged", () => {
  const base = { from: -60_000, to: -50_000 };
  for (const grip of [0.1, 0.5, 0.9]) {
    for (const pointer of [0.2, 0.45, 0.6, 0.7]) {
      const next = windowWithGripAt(base, grip, pointer, MIN);
      const thumb = drawnThumb(next, MIN);
      const landed = thumb.from + grip * thumb.width;
      if (next.to >= 3000 - 1e-6) {
        // Pushed against the present: the window can go no later, so the grip
        // stops short of a pointer dragged beyond what it can reach.
        assert.ok(landed <= pointer + 1e-4, `grip ${grip} pointer ${pointer} overshot to ${landed}`);
      } else {
        assert.ok(Math.abs(landed - pointer) < 1e-4, `grip ${grip} pointer ${pointer} landed ${landed}`);
      }
      assert.ok(Math.abs(next.to - next.from - 10_000) < 1e-6, `zoom changed to ${next.to - next.from}`);
    }
  }
});

test("dragging right moves later, dragging left moves earlier", () => {
  const base = { from: -60_000, to: -50_000 };
  const start = drawnThumb(base, MIN);
  const grip = 0.5;
  const at = start.from + grip * start.width;
  const right = windowWithGripAt(base, grip, at + 0.05, MIN);
  const left = windowWithGripAt(base, grip, at - 0.05, MIN);
  assert.ok(right.from > base.from && left.from < base.from);
});

test("the log strip keeps its own zoom while dragged", () => {
  const base = { from: -1_000_000, to: 1500 };
  const next = windowWithGripAt(base, 0.5, 0.3, MIN, "log");
  assert.ok(next.from < base.from, "dragging left should move earlier");
});

test("dragging past the end stops the window at the end, at the same zoom", () => {
  const base = { from: -60_000, to: -50_000 };
  const next = windowWithGripAt(base, 0.1, 0.95, MIN);
  assert.ok(Math.abs(next.to - 3000) < 1e-6, `ended at ${next.to}`);
  assert.ok(Math.abs(next.to - next.from - 10_000) < 1e-6);
});
