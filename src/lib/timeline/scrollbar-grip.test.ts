import { test } from "node:test";
import assert from "node:assert/strict";

import { barFraction, dateAtBar, thumbPixels, middleDate, pullDoublings, thumbCentre, windowAfterPull, windowWithThumbAt } from "./scrollbar-grip";
import { presentPosition, TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR } from "./time";

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
  for (const scale of ["linear", "log"] as const) {
    const out = windowAfterPull(base, 40, scale);
    const inward = windowAfterPull(base, -40, scale);
    assert.ok(out.to - out.from > base.to - base.from);
    assert.ok(inward.to - inward.from < base.to - base.from);
    assert.ok(close(middleDate(out, scale), middleDate(base, scale), 1e-6));
    assert.ok(close(middleDate(inward, scale), middleDate(base, scale), 1e-6));
  }
  // Outwards and inwards by the same amount undo each other.
  const back = windowAfterPull(windowAfterPull(base, 70), -70);
  assert.ok(close(back.from, base.from, 1e-6) && close(back.to, base.to, 1e-6));
});

test("a pull starts gently: the thumb does not jump when taken hold of", () => {
  assert.equal(pullDoublings(0), 0);
  const base = { from: -3000, to: -1000 };
  const nudged = windowAfterPull(base, 1);
  assert.ok(Math.abs(nudged.to - nudged.from - 2000) < 40, "one pixel of pull is under 2% of the span");
  // Short pulls stay about a doubling per 40px, so small adjustments are precise.
  assert.ok(pullDoublings(40) > 1 && pullDoublings(40) < 1.2);
});

test("a long pull reaches all of time from a narrow view, inside the bar", () => {
  // At a fixed 40px per doubling this needed ~1000px of pull: wider than the bar.
  const base = { from: 1500, to: 2000 };
  const everything = windowAfterPull(base, 400);
  assert.equal(everything.from, TIMELINE_MIN_YEAR);
  assert.equal(everything.to, TIMELINE_MAX_YEAR);
  // And pushing in as far reaches a single day or so.
  const narrow = windowAfterPull(base, -400);
  assert.ok(narrow.to - narrow.from < 0.01);
  assert.ok(pullDoublings(-123) === -pullDoublings(123));
});

const LANDMARKS: [string, number][] = [
  ["the present", presentPosition()],
  ["Rome", -44],
  ["Egypt", -2560],
  ["10,500 BCE", -10_500],
  ["100,000 BCE", -100_000],
  ["1 million years ago", -1_000_000],
  ["65 million years ago", -65_000_000],
  ["4.5 billion years ago", -4_500_000_000],
  ["the earliest date", TIMELINE_MIN_YEAR],
];

test("the bar gives every landmark its own place, in order", () => {
  // The log bar must not crush recorded history into a pixel: each landmark
  // sits at least 2% of the bar from the next.
  const places = LANDMARKS.map(([, date]) => barFraction(date));
  for (let index = 1; index < places.length; index++) {
    assert.ok(places[index - 1] - places[index] > 0.02, `${LANDMARKS[index - 1][0]} vs ${LANDMARKS[index][0]}`);
  }
});

test("dragging the thumb or clicking the track arrives at each landmark, at any zoom, on both scales", () => {
  for (const scale of ["linear", "log"] as const) {
    for (const base of [
      { from: -100, to: 100 },
      { from: -60_000, to: -50_000 },
      { from: -13_900_000_000, to: 3000 },
    ]) {
      for (const [name, date] of LANDMARKS) {
        // Clicking the track centres the thumb where it was clicked; a drag
        // ends at the same function with the pointer's position.
        const next = windowWithThumbAt(base, barFraction(date), scale);
        const middle = middleDate(next, scale);
        // Within two hundred-thousandths of the distance from now: under a day
        // at Rome, under two years at 100,000 BCE. The round trip through a
        // bar spanning 13.9 billion years rounds by up to about 1.1e-5 of that
        // distance, depending on the clock's exact instant, so 1e-5 failed
        // on roughly one run in sixty.
        const tolerance = Math.max(1e-6, Math.abs(date - presentPosition()) * 2e-5);
        assert.ok(close(middle, date, tolerance), `${scale} ${base.from}: ${name} landed at ${middle}`);
      }
    }
  }
});

test("the bar's two directions are inverses of each other across all of time", () => {
  for (const fraction of [0, 0.001, 0.1, 0.4, 0.7, 0.77, 0.9, 0.999, 1]) {
    assert.ok(close(barFraction(dateAtBar(fraction)), fraction, 1e-9), `${fraction}`);
  }
});

test("switching between linear and log keeps the thumb on the strip's own middle date", () => {
  const view = { from: -1_000_000, to: 1500 };
  for (const scale of ["linear", "log"] as const) {
    assert.ok(close(thumbCentre(view, scale), barFraction(middleDate(view, scale)), 1e-12));
  }
  // The two scales put a different date in the middle of the same window, and
  // the thumb follows whichever the strip is drawn with.
  assert.notEqual(middleDate(view, "linear"), middleDate(view, "log"));
});

test("the thumb is big enough to hold and grows with the bar, within limits", () => {
  assert.equal(thumbPixels(340), 64, "a phone still gets a thumb a fingertip can hold");
  assert.ok(thumbPixels(1000) >= 100 && thumbPixels(1000) <= 140, `${thumbPixels(1000)}px on a laptop`);
  assert.equal(thumbPixels(2400), 136, "a wide screen does not get a giant thumb");
  for (const width of [300, 600, 900, 1200, 1800]) assert.ok(thumbPixels(width) > 56, "always larger than the old 56px");
});

test("the future takes a small share of the bar, the past the rest", () => {
  const now = barFraction(presentPosition());
  assert.ok(1 - now < 0.12, `the next thousand years take ${((1 - now) * 100).toFixed(1)}% of the bar`);
  // Recorded history (the last 5,000 years) gets at least a quarter of it.
  assert.ok(now - barFraction(-3000) > 0.25);
  // The future is still on the bar, in order.
  assert.ok(barFraction(2500) > now && barFraction(2900) > barFraction(2500));
});
