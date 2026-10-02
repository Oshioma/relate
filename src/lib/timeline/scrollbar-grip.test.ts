import { test } from "node:test";
import assert from "node:assert/strict";

import { barFraction, middleDate, thumbCentre, windowAfterPull, windowWithThumbAt } from "./scrollbar-grip";

const close = (a: number, b: number, tolerance: number) => Math.abs(a - b) < tolerance;

test("the thumb's centre is the strip's middle date, not Now", () => {
  // The pinned thumb sat over "Now" while the strip showed 125,501 BCE.
  const view = { from: -254_000, to: 3000 };
  assert.ok(close(thumbCentre(view), barFraction(-125_500), 1e-9));
  assert.ok(thumbCentre(view) < barFraction(0), "the middle of this view is long before the present");
});

test("dragging moves the thumb the same way on both sides of the bar", () => {
  // The complaint: left of centre the thumb behaved like one control, right of
  // centre like another. Each step of drag must move the thumb by that step,
  // wherever on the bar it happens.
  for (const base of [
    { from: -60_000, to: -50_000 },
    { from: -3000, to: -1000 },
    { from: 1000, to: 1500 },
  ]) {
    const start = thumbCentre(base);
    for (const step of [-0.05, -0.02, 0.02]) {
      const next = windowWithThumbAt(base, start + step);
      assert.ok(close(thumbCentre(next), start + step, 1e-6), `${base.from}: step ${step} landed ${thumbCentre(next) - start}`);
      assert.ok(close(next.to - next.from, base.to - base.from, 1e-6), "the zoom must not change while dragging");
    }
  }
});

test("dragging right moves later, dragging left moves earlier", () => {
  const base = { from: -60_000, to: -50_000 };
  const start = thumbCentre(base);
  assert.ok(windowWithThumbAt(base, start + 0.05).from > base.from);
  assert.ok(windowWithThumbAt(base, start - 0.05).from < base.from);
});

test("every point on the bar can be reached, whatever the zoom", () => {
  // The bug: keeping the zoom fixed, a 100,000-year view could not be centred
  // later than ~47,000 BCE, so the thumb stuck in the middle of the bar, and
  // the whole-of-time view could not be dragged at all.
  for (const scale of ["linear", "log"] as const) {
    for (const base of [
      { from: -13_900_000_000, to: 3000 },
      { from: -254_000, to: 3000 },
      { from: -60_000, to: -50_000 },
      { from: -3000, to: -1000 },
    ]) {
      for (const pointer of [0.05, 0.3, 0.5, 0.6, 0.75, 0.9, 0.97]) {
        const next = windowWithThumbAt(base, pointer, scale);
        assert.ok(close(thumbCentre(next, scale), pointer, 1e-3), `${scale} ${base.from}: pointer ${pointer} landed ${thumbCentre(next, scale)}`);
      }
    }
  }
});

test("near an end the view narrows, and dragging back restores the zoom", () => {
  const base = { from: -60_000, to: -50_000 };
  const late = windowWithThumbAt(base, 0.9);
  assert.ok(late.to - late.from < 10_000, "a date near Now cannot be the middle of a 10,000-year view");
  assert.ok(late.to <= 3000);
  const back = windowWithThumbAt(base, thumbCentre(base));
  assert.ok(close(back.to - back.from, 10_000, 1e-6));
  assert.ok(close(back.from, base.from, 1e-6));
});

test("the log strip keeps its own zoom while dragged", () => {
  const base = { from: -1_000_000, to: 1500 };
  const start = thumbCentre(base, "log");
  const next = windowWithThumbAt(base, start - 0.05, "log");
  assert.ok(close(thumbCentre(next, "log"), start - 0.05, 1e-6));
  assert.ok(next.from < base.from, "dragging left should move earlier");
});

test("pulling an end out zooms out, pushing it in zooms in, about the middle date", () => {
  const base = { from: -3000, to: -1000 };
  const out = windowAfterPull(base, 40);
  const inward = windowAfterPull(base, -40);
  assert.ok(close(out.to - out.from, 4000, 1e-6));
  assert.ok(close(inward.to - inward.from, 1000, 1e-6));
  assert.ok(close(middleDate(out), middleDate(base), 1e-6));
  assert.ok(close(middleDate(inward), middleDate(base), 1e-6));
});
