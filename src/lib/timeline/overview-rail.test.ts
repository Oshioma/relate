import { test } from "node:test";
import assert from "node:assert/strict";

import { resizeBox, travelToRightEnd, travelToLeftEnd, type RailBox } from "./overview-rail";

// ---------------------------------------------------------------------------
// WIDENING THE BOX HAS TO SHORTEN THE JOURNEY.
//
// The reported problem, in one sentence: pulling the left grip out made the box
// eight times wider and did not reduce the drag to the right-hand end by a
// single pixel. It could not, because the old code pinned the opposite edge, so
// the distance left to travel was `1 - to` with `to` held constant.
//
// The rule these tests exist to hold: EVERY PIXEL OF WIDENING IS A PIXEL YOU DO
// NOT HAVE TO DRAG AFTERWARDS, at whichever end you are heading for.
// ---------------------------------------------------------------------------

const MIN = 30 / 975; // MIN_BOX_PX over a representative rail width
const px = (fraction: number) => Math.round(fraction * 975);

test("pulling the left grip out shortens the trip to the RIGHT-hand end", () => {
  // THE REPORTED CASE. Before this change every row of this table read 195px.
  const start: RailBox = { from: 0.6, to: 0.8 };
  const before = travelToRightEnd(start);
  let previous = before;
  for (const target of [0.55, 0.5, 0.45, 0.4]) {
    const box = resizeBox(start, "from", target, MIN);
    const now = travelToRightEnd(box);
    assert.ok(
      now < previous,
      `pulled the left grip to ${target} and the trip right stayed at ${px(now)}px`
    );
    previous = now;
  }
  assert.ok(previous < before / 2, `widening halved nothing: ${px(before)}px → ${px(previous)}px`);
});

test("pulling the right grip out shortens the trip to the LEFT-hand end", () => {
  // The same property, mirrored, because a fix that only worked one way would
  // be the same bug with the sign changed.
  const start: RailBox = { from: 0.2, to: 0.4 };
  const before = travelToLeftEnd(start);
  const box = resizeBox(start, "to", 0.6, MIN);
  assert.ok(travelToLeftEnd(box) < before, "widening rightwards left the trip left unchanged");
  assert.equal(Number(box.from.toFixed(6)), 0, "0.2 out on the right should have used up 0.2 on the left");
});

test("the grabbed grip lands exactly where the pointer is", () => {
  // Direct manipulation. A grip that lags the finger reads as a broken control
  // however good the arithmetic behind it.
  const box = resizeBox({ from: 0.4, to: 0.6 }, "from", 0.25, MIN);
  assert.equal(Number(box.from.toFixed(6)), 0.25);
  const other = resizeBox({ from: 0.4, to: 0.6 }, "to", 0.75, MIN);
  assert.equal(Number(other.to.toFixed(6)), 0.75);
});

test("the centre of the box does not move while it is being resized", () => {
  // This is what makes widening symmetrical, and it is the property the whole
  // change rests on: the far edge moves the same distance the grabbed one did.
  const start: RailBox = { from: 0.4, to: 0.6 };
  for (const target of [0.35, 0.3, 0.2, 0.45]) {
    const box = resizeBox(start, "from", target, MIN);
    assert.equal(
      Number(((box.from + box.to) / 2).toFixed(6)),
      0.5,
      `resizing to ${target} shifted the centre to ${(box.from + box.to) / 2}`
    );
  }
});

test("dragging a grip through the middle stops at the minimum width, and does not invert", () => {
  for (const target of [0.5, 0.6, 0.9, 1]) {
    const box = resizeBox({ from: 0.4, to: 0.6 }, "from", target, MIN);
    assert.ok(box.to > box.from, `box inverted: ${box.from} → ${box.to}`);
    assert.ok(
      box.to - box.from >= MIN - 1e-9,
      `box narrowed to ${px(box.to - box.from)}px, under the ${px(MIN)}px minimum`
    );
  }
});

test("narrowing closes both edges too, so zooming in is the same gesture backwards", () => {
  const box = resizeBox({ from: 0.3, to: 0.7 }, "from", 0.4, MIN);
  assert.equal(Number(box.from.toFixed(6)), 0.4);
  assert.equal(Number(box.to.toFixed(6)), 0.6, "the far edge should have come in by the same 0.1");
});

test("at the rail's ends the mirrored edge stops and the grabbed grip carries on", () => {
  // The alternative — refusing to move once one side is against the end —
  // makes the grip stick to the pointer and then come unstuck, which is worse
  // than an asymmetrical box.
  const box = resizeBox({ from: 0.3, to: 0.9 }, "from", 0.1, MIN);
  assert.equal(Number(box.from.toFixed(6)), 0.1, "the grabbed grip did not reach the pointer");
  assert.equal(box.to, 1, "the mirrored edge should have stopped at the rail's end");
});

test("a box already filling the rail cannot be widened, and does not break trying", () => {
  const box = resizeBox({ from: 0, to: 1 }, "from", -0.5, MIN);
  assert.deepEqual(box, { from: 0, to: 1 });
});

test("the box never leaves the rail, whatever it is dragged to", () => {
  const boxes: RailBox[] = [
    { from: 0, to: 0.1 },
    { from: 0.45, to: 0.55 },
    { from: 0.9, to: 1 },
    { from: 0, to: 1 },
  ];
  for (const start of boxes) {
    for (const edge of ["from", "to"] as const) {
      for (const target of [-2, -0.1, 0, 0.5, 1, 1.1, 3, Number.NaN]) {
        const box = resizeBox(start, edge, target, MIN);
        assert.ok(box.from >= 0 && box.to <= 1, `${edge}→${target} gave ${box.from}..${box.to}`);
        assert.ok(box.to >= box.from, `${edge}→${target} inverted the box`);
      }
    }
  }
});

test("widening all the way from either grip reaches the far end without a further drag", () => {
  // The user's sentence, as an assertion: extending the box to the left should
  // reduce the time it takes to move it to the right — to nothing, if you pull
  // far enough.
  const start: RailBox = { from: 0.4, to: 0.6 };
  assert.equal(travelToRightEnd(resizeBox(start, "from", 0, MIN)), 0);
  assert.equal(travelToLeftEnd(resizeBox(start, "to", 1, MIN)), 0);
});
