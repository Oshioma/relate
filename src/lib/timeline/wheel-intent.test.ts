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

// ---------------------------------------------------------------------------
// WHOLE GESTURES — what a real trackpad sends
// ---------------------------------------------------------------------------

import { readWheelGesture, WHEEL_GESTURE_GAP_MS, type WheelGesture } from "./wheel-intent";

/** Feed a gesture's events in, a few milliseconds apart; return what each one did. */
function play(events: Partial<WheelLike>[], start = 1000): string[] {
  let gesture: WheelGesture | null = null;
  return events.map((overrides, index) => {
    const read = readWheelGesture(gesture, wheel(overrides), start + index * 16);
    gesture = read.gesture;
    return read.action.kind === "pan" ? `pan ${read.action.pixels}` : read.action.kind;
  });
}

test("a swipe that opens with a no-movement event still travels through time", () => {
  // macOS often begins a swipe with an event carrying no deltas at all. That
  // first event used to lock the gesture to vertical, so the strip never moved.
  assert.deepEqual(play([{}, { deltaX: -4 }, { deltaX: -9 }, { deltaX: -12 }]), ["hold", "pan -4", "pan -9", "pan -12"]);
});

test("a swipe that opens with a pixel of vertical drift still travels through time", () => {
  assert.deepEqual(play([{ deltaY: 1 }, { deltaX: -3, deltaY: 1 }, { deltaX: -10, deltaY: 1 }, { deltaX: -14 }]), [
    "hold",
    "pan -3",
    "pan -10",
    "pan -14",
  ]);
});

test("the opening events of an unclear gesture are held, never handed to the page", () => {
  // Handing the first event to the page is what makes the browser mark the rest
  // of the gesture uncancelable, so the strip could never claim it afterwards.
  const actions = play([{}, { deltaY: 1 }, { deltaX: 1, deltaY: 1 }]);
  assert.ok(!actions.includes("page"), actions.join(", "));
});

test("a plain vertical scroll is handed to the page once its direction is clear", () => {
  const actions = play([{ deltaY: 3 }, { deltaY: 8 }, { deltaY: 12 }, { deltaY: 12 }]);
  assert.equal(actions[0], "hold");
  assert.deepEqual(actions.slice(-2), ["page", "page"]);
});

test("once sideways, vertical wobble and the momentum tail stay with the strip", () => {
  const actions = play([{ deltaX: 10 }, { deltaX: 12, deltaY: 15 }, { deltaX: 2 }, { deltaX: 1 }]);
  assert.deepEqual(actions, ["pan 10", "pan 12", "pan 2", "pan 1"]);
});

test("a pause long enough starts a new gesture", () => {
  let gesture: WheelGesture | null = null;
  gesture = readWheelGesture(gesture, wheel({ deltaX: 20 }), 0).gesture;
  const next = readWheelGesture(gesture, wheel({ deltaY: 20 }), WHEEL_GESTURE_GAP_MS + 1);
  assert.equal(next.action.kind, "page");
});

test("pinch and Ctrl/Shift gestures are read on every event, as before", () => {
  assert.equal(readWheelGesture(null, wheel({ deltaY: -5, ctrlKey: true }), 0).action.kind, "zoom");
  assert.deepEqual(readWheelGesture(null, wheel({ deltaY: 30, shiftKey: true }), 0).action, { kind: "pan", pixels: 30 });
});
