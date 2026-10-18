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

// ---------------------------------------------------------------------------
// THE TWO-FINGER SWIPE THAT "DID NOT WORK"
// ---------------------------------------------------------------------------

import { WHEEL_RELEASE_PX } from "./wheel-intent";
import { fractionOf, panWindow, positionAt, zoomWindow } from "./time";

/** As play(), but each event may be marked uncancelable and spaced its own way. */
function playTimed(events: (Partial<WheelLike> & { cancelable?: boolean; gap?: number })[], start = 1000): string[] {
  let gesture: WheelGesture | null = null;
  let at = start;
  return events.map(({ cancelable = true, gap = 16, ...overrides }, index) => {
    if (index > 0) at += gap;
    const read = readWheelGesture(gesture, wheel(overrides), at, cancelable);
    gesture = read.gesture;
    return read.action.kind === "pan" ? `pan ${read.action.pixels}` : read.action.kind;
  });
}

test("fingers that wobble up and down before travelling sideways still travel", () => {
  // The real bug. The wobble's SIZES used to be added up, so ±2px three times
  // read as six pixels of vertical and locked the whole swipe to the page.
  const actions = play([
    { deltaY: 2 },
    { deltaY: -2 },
    { deltaY: 2 },
    { deltaX: -2, deltaY: -1 },
    { deltaX: -6, deltaY: 1 },
    { deltaX: -10 },
    { deltaX: -14 },
  ]);
  assert.ok(!actions.includes("page"), actions.join(", "));
  assert.deepEqual(actions.slice(-4), ["pan -2", "pan -6", "pan -10", "pan -14"]);
});

test("a swipe travels both ways: fingers left is later, fingers right is earlier", () => {
  // macOS reports fingers moving left as positive deltaX (content scrolls
  // right), and a positive pan moves the window later.
  assert.deepEqual(play([{ deltaX: 8 }, { deltaX: 14 }]), ["pan 8", "pan 14"]);
  assert.deepEqual(play([{ deltaX: -8 }, { deltaX: -14 }]), ["pan -8", "pan -14"]);
  const view = { from: -1000, to: 1000 };
  assert.ok(panWindow(view, 0.1).from > view.from, "a positive pan is later");
  assert.ok(panWindow(view, -0.1).from < view.from, "a negative pan is earlier");
});

test("a sideways swipe with steady vertical drift still travels", () => {
  const actions = play([
    { deltaX: -5, deltaY: 3 },
    { deltaX: -9, deltaY: 5 },
    { deltaX: -12, deltaY: 6 },
    { deltaX: -7, deltaY: 4 },
  ]);
  assert.deepEqual(actions, ["pan -5", "pan -9", "pan -12", "pan -7"]);
});

test("a diagonal swipe goes to the strip; a steep one to the page", () => {
  assert.ok(play([{ deltaX: 6, deltaY: 6 }, { deltaX: 8, deltaY: 8 }]).every((action) => action.startsWith("pan")));
  const steep = play([{ deltaX: 2, deltaY: 8 }, { deltaX: 3, deltaY: 10 }, { deltaX: 2, deltaY: 9 }]);
  assert.deepEqual(steep, ["page", "page", "page"]);
});

test("a slow swipe of one-pixel steps moves from its first pixel", () => {
  const actions = playTimed([{ deltaX: 1 }, { deltaX: 1, gap: 60 }, { deltaX: 1, gap: 60 }, { deltaX: 2, gap: 60 }]);
  assert.deepEqual(actions, ["pan 1", "pan 1", "pan 1", "pan 2"]);
});

test("a fast swipe moves by its whole delta at once", () => {
  assert.deepEqual(play([{ deltaX: 120, deltaY: 10 }, { deltaX: 140 }]), ["pan 120", "pan 140"]);
});

test("the momentum tail keeps travelling, even when the browser marks it uncancelable", () => {
  const actions = playTimed([
    { deltaX: 20 },
    { deltaX: 30 },
    // Fingers lifted: momentum, decaying, some of it uncancelable.
    { deltaX: 18, cancelable: false },
    { deltaX: 9, cancelable: false },
    { deltaX: 4, cancelable: false },
    { deltaX: 1, cancelable: false },
  ]);
  assert.deepEqual(actions, ["pan 20", "pan 30", "pan 18", "pan 9", "pan 4", "pan 1"]);
});

test("an uncancelable stream the strip never owned is the page's", () => {
  // The page is already scrolling and has carried the strip under the pointer.
  assert.deepEqual(playTimed([{ deltaY: 30, cancelable: false }, { deltaX: 10, deltaY: 20, cancelable: false }]), ["page", "page"]);
  // A page scroll that drifts sideways once the browser owns it stays the page's.
  assert.deepEqual(
    playTimed([{ deltaY: 4 }, { deltaY: 10 }, { deltaX: 20, deltaY: 2, cancelable: false }]),
    ["hold", "page", "page"]
  );
});

test("an uncancelable pinch is never acted on", () => {
  assert.deepEqual(readWheelGesture(null, wheel({ deltaY: -5, ctrlKey: true }), 0, false).action, { kind: "page" });
});

test("a short vertical wobble mid-swipe is held, a real turn to vertical goes to the page", () => {
  const wobble = play([{ deltaX: 12 }, { deltaY: 4 }, { deltaY: 4 }, { deltaX: 10 }]);
  assert.deepEqual(wobble, ["pan 12", "hold", "hold", "pan 10"]);

  const steps = Math.ceil(WHEEL_RELEASE_PX / 6) + 1;
  const turn = play([{ deltaX: 12 }, { deltaX: 3 }, ...Array.from({ length: steps }, () => ({ deltaY: 6 }))]);
  assert.equal(turn.at(-1), "page", turn.join(", "));
  assert.ok(!turn.slice(0, 2).includes("page"));
});

test("a plain vertical scroll never zooms, however it is shaped", () => {
  for (const events of [
    [{ deltaY: 100 }],
    [{ deltaY: 3 }, { deltaY: 30 }, { deltaY: 60 }],
    [{ deltaY: -2 }, { deltaY: -40 }, { deltaX: 1, deltaY: -40 }],
  ]) {
    assert.ok(!play(events).includes("zoom"), JSON.stringify(events));
  }
});

test("zooming keeps the date under the pointer where it was, on both scales", () => {
  for (const scale of ["linear", "log"] as const) {
    // Away from the ends of time, where clamping rightly takes over.
    const view = { from: -60_000, to: -30_000 };
    for (const anchor of [0.1, 0.5, 0.83]) {
      const date = positionAt(view, anchor, scale);
      for (const factor of [0.5, 0.9, 1.1, 2]) {
        const next = zoomWindow(view, factor, anchor, scale);
        assert.ok(Math.abs(fractionOf(next, date, scale) - anchor) < 1e-6, `${scale} ${anchor} ×${factor}`);
      }
    }
  }
});
