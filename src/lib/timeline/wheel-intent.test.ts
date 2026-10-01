import { test } from "node:test";
import assert from "node:assert/strict";

import { wheelIntent, type WheelLike } from "./wheel-intent";

const wheel = (overrides: Partial<WheelLike>): WheelLike => ({
  deltaX: 0,
  deltaY: 0,
  deltaMode: 0,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  ...overrides,
});

test("a plain vertical wheel or swipe belongs to the page, never to zoom", () => {
  // The rule the whole interaction model rests on: the reader must be able to
  // scroll down past the strip to the record below it.
  assert.deepEqual(wheelIntent(wheel({ deltaY: 100 })), { kind: "page" });
  assert.deepEqual(wheelIntent(wheel({ deltaY: -4, deltaX: 1 })), { kind: "page" });
});

test("a sideways trackpad swipe travels through time", () => {
  assert.deepEqual(wheelIntent(wheel({ deltaX: 30, deltaY: 4 })), { kind: "pan", pixels: 30 });
  assert.deepEqual(wheelIntent(wheel({ deltaX: -30, deltaY: 4 })), { kind: "pan", pixels: -30 });
});

test("a wobble mid-swipe keeps the axis the swipe started on", () => {
  // Mostly vertical for one event, but the gesture began sideways.
  assert.deepEqual(wheelIntent(wheel({ deltaX: 3, deltaY: 5 }), "x"), { kind: "pan", pixels: 3 });
  // And a page scroll that drifts sideways stays a page scroll.
  assert.deepEqual(wheelIntent(wheel({ deltaX: 8, deltaY: 2 }), "y"), { kind: "page" });
});

test("pinch (wheel + ctrlKey) zooms: apart is in, together is out", () => {
  const apart = wheelIntent(wheel({ deltaY: -5, ctrlKey: true }));
  const together = wheelIntent(wheel({ deltaY: 5, ctrlKey: true }));
  assert.equal(apart.kind, "zoom");
  assert.equal(together.kind, "zoom");
  assert.ok(apart.kind === "zoom" && apart.factor < 1, "fingers apart should narrow the window");
  assert.ok(together.kind === "zoom" && together.factor > 1, "fingers together should widen it");
});

test("Cmd + wheel zooms like Ctrl + wheel", () => {
  assert.deepEqual(wheelIntent(wheel({ deltaY: 100, metaKey: true })), wheelIntent(wheel({ deltaY: 100, ctrlKey: true })));
});

test("a Ctrl + mouse-wheel notch zooms by about one button step, not a leap", () => {
  const notch = wheelIntent(wheel({ deltaY: 100, ctrlKey: true }));
  assert.ok(notch.kind === "zoom" && notch.factor > 1.3 && notch.factor < 2, `factor ${notch.kind === "zoom" && notch.factor}`);
});

test("Shift + wheel travels through time, whichever axis the browser put it on", () => {
  assert.deepEqual(wheelIntent(wheel({ deltaY: 100, shiftKey: true })), { kind: "pan", pixels: 100 });
  assert.deepEqual(wheelIntent(wheel({ deltaX: 100, shiftKey: true })), { kind: "pan", pixels: 100 });
});

test("line-mode deltas (Firefox with a mouse) are brought to pixels", () => {
  assert.deepEqual(wheelIntent(wheel({ deltaY: 3, deltaMode: 1, shiftKey: true })), { kind: "pan", pixels: 48 });
});
