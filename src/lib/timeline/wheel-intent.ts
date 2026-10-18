// WHAT A WHEEL EVENT OVER THE TIMELINE IS ASKING FOR.
//
// The strip navigates like a map whose one dimension is time, and a map that
// swallows the page's vertical scroll is a trap: the event detail, the
// evidence and the sources all live BELOW the strip, and a reader whose
// pointer happens to be over it must still be able to scroll down to them.
//
// So the rule is the one maps use:
//
//   pinch, or Ctrl/Cmd + wheel     → zoom about the pointer
//   sideways swipe, or Shift+wheel → travel through time
//   anything else (plain vertical) → NOT OURS — the page scrolls
//
// Kept pure so the mapping can be tested without a browser; the hook in
// use-time-navigation.ts only applies what this returns.

export type WheelLike = {
  deltaX: number;
  deltaY: number;
  deltaMode: number;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
};

export type WheelIntent =
  | { kind: "zoom"; factor: number }
  | { kind: "pan"; pixels: number }
  | { kind: "page" };

/** Which way the current run of wheel events was first read, so a diagonal swipe doesn't flip between the two. */
export type WheelAxis = "x" | "y";

// deltaMode 1 is lines (Firefox with a mouse), 2 is pages. Everything below
// is tuned in pixels, so those are brought to pixels first.
const LINE_PIXELS = 16;
const PAGE_PIXELS = 800;

// ONE ZOOM ENGINE, TWO KINDS OF INPUT.
//
// A trackpad pinch arrives as many small ctrlKey deltas (a few pixels each);
// a Ctrl+mouse-wheel notch arrives as one big one (~100). Clamping each delta
// before scaling lets the same constant serve both: a pinch stays continuous
// and a wheel notch lands at about the +/− buttons' step instead of leaping.
const ZOOM_SENSITIVITY = 0.01;
const ZOOM_DELTA_CLAMP = 50;

export function toPixels(delta: number, deltaMode: number): number {
  if (deltaMode === 1) return delta * LINE_PIXELS;
  if (deltaMode === 2) return delta * PAGE_PIXELS;
  return delta;
}

/**
 * Read one wheel event.
 *
 * `lockedAxis` is the axis the current gesture was first read on (null when a
 * new gesture starts). A two-finger swipe is never perfectly straight; without
 * the lock a mostly-sideways swipe that wobbles vertically for one event would
 * hand that event to the page and the strip would stutter.
 */
export function wheelIntent(event: WheelLike, lockedAxis: WheelAxis | null = null): WheelIntent {
  const dx = toPixels(event.deltaX, event.deltaMode);
  const dy = toPixels(event.deltaY, event.deltaMode);

  // Browsers report a trackpad pinch as wheel + ctrlKey, and Ctrl/Cmd + wheel
  // is the desktop zoom gesture. Either way: zoom, never the page.
  if (event.ctrlKey || event.metaKey) {
    const delta = Math.max(-ZOOM_DELTA_CLAMP, Math.min(ZOOM_DELTA_CLAMP, dy));
    // Positive deltaY is pinch-together / wheel-down, which zooms OUT — a
    // wider window, hence a factor above one.
    return { kind: "zoom", factor: Math.exp(delta * ZOOM_SENSITIVITY) };
  }

  // Shift + wheel is the desktop way to scroll sideways. Some browsers have
  // already turned it into deltaX by the time it arrives; others leave it in
  // deltaY. Take whichever carries the movement.
  if (event.shiftKey) {
    const pixels = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
    return pixels === 0 ? { kind: "page" } : { kind: "pan", pixels };
  }

  const axis: WheelAxis = lockedAxis ?? (Math.abs(dx) > Math.abs(dy) ? "x" : "y");
  if (axis === "x" && dx !== 0) return { kind: "pan", pixels: dx };
  return { kind: "page" };
}

// --- A whole gesture, not one event ---------------------------------------------
//
// WHY ONE EVENT IS NOT ENOUGH TO DECIDE.
//
// A trackpad swipe is a stream of wheel events, and the first is the worst one
// to judge it by: macOS often opens a swipe with an event that has no movement
// at all, or a pixel of vertical drift before the fingers settle into their
// sideways path.
//
// It matters more than a stutter, because of how browsers handle the stream.
// Once the page lets an event of a scroll through, the browser takes the
// gesture for itself and every later event in it arrives uncancelable — the
// strip can no longer claim it even when it turns plainly sideways.
//
// So the first few pixels of every gesture are HELD: claimed (the page stays
// still) but not acted on, until enough movement has arrived to tell which way
// it is going. Then it is committed — sideways travels through time, vertical
// is handed back to the page for the rest of the gesture. A vertical scroll
// loses its first few pixels, which nobody can see; a sideways swipe is never
// lost.
//
// HOW THE DIRECTION IS READ, AND WHY THE FIRST VERSION GOT IT WRONG.
//
// It used to add up the SIZE of every movement on each axis and call the
// gesture vertical whenever the vertical total was the larger one, ties
// included, after only six pixels. Two fingers landing on a trackpad wobble
// up and down before they travel sideways, and that wobble — a pixel up, a
// pixel down — counted in full. A swipe that opened with it was called
// vertical, every one of its events (and its whole momentum tail) went to the
// page, and since the page cannot scroll sideways nothing moved at all: the
// two-finger swipe "did not work".
//
// Now the totals are SIGNED, so a wobble cancels itself out, and the call
// leans sideways: a gesture is sideways unless it is clearly more vertical
// than horizontal (WHEEL_SIDEWAYS_LEAN). The strip is a band across the
// page, not the whole page, so a reader whose fingers move diagonally over it
// almost always means to travel through time; a reader scrolling the page
// moves nearly straight up or down.

/** Events further apart than this belong to separate gestures (momentum keeps a swipe's events closer). */
export const WHEEL_GESTURE_GAP_MS = 200;
/** How much movement a gesture needs before its direction is trusted. */
export const WHEEL_AXIS_DECIDE_PX = 6;
/**
 * A gesture is sideways when its horizontal travel is at least this share of
 * its vertical travel — anything within about 53° of horizontal. Below one, so
 * a diagonal swipe goes to the strip rather than the page.
 */
export const WHEEL_SIDEWAYS_LEAN = 0.75;
/**
 * How far a sideways gesture has to turn plainly vertical before it is handed
 * back to the page. Momentum keeps a swipe's events close together, so a page
 * scroll begun just as a swipe's momentum fades would otherwise be read as
 * more of the swipe and swallowed.
 */
export const WHEEL_RELEASE_PX = 24;

export type WheelGesture = {
  axis: WheelAxis | null;
  at: number;
  /** Net movement since the gesture began, signed, so a wobble cancels out. */
  sumX: number;
  sumY: number;
  /** Net movement of the current run of plainly vertical events, while sideways. */
  turnX: number;
  turnY: number;
};

/** What to do with one event: as wheelIntent, plus "hold" — claim it, do nothing yet. */
export type WheelAction = WheelIntent | { kind: "hold" };

const leansSideways = (x: number, y: number) => x !== 0 && Math.abs(x) >= WHEEL_SIDEWAYS_LEAN * Math.abs(y);

/**
 * Read one event of a plain (unmodified) wheel stream as part of its gesture.
 *
 * `cancelable` is the event's own: false means the browser has already given
 * this stream to something else and will not let it be stopped. Such an event
 * still moves the strip when it continues a gesture the strip already owns —
 * a sideways swipe's momentum tail must not be cut off mid-glide — and is the
 * page's otherwise, so one gesture never moves two things.
 */
export function readWheelGesture(
  previous: WheelGesture | null,
  event: WheelLike,
  now: number,
  cancelable = true
): { gesture: WheelGesture | null; action: WheelAction } {
  // Modifier gestures are unambiguous on every event; they neither start nor
  // continue a plain swipe.
  if (event.ctrlKey || event.metaKey || event.shiftKey) {
    return { gesture: previous, action: cancelable ? wheelIntent(event) : { kind: "page" } };
  }

  const dx = toPixels(event.deltaX, event.deltaMode);
  const dy = toPixels(event.deltaY, event.deltaMode);
  const fresh = !previous || now - previous.at >= WHEEL_GESTURE_GAP_MS;

  if (!cancelable) {
    if (!fresh && previous.axis === "x") {
      const gesture = { ...previous, at: now, sumX: previous.sumX + dx, sumY: previous.sumY + dy };
      return { gesture, action: dx !== 0 ? { kind: "pan", pixels: dx } : { kind: "page" } };
    }
    return { gesture: previous, action: { kind: "page" } };
  }

  const gesture: WheelGesture = fresh
    ? { axis: null, at: now, sumX: dx, sumY: dy, turnX: 0, turnY: 0 }
    : { ...previous, at: now, sumX: previous.sumX + dx, sumY: previous.sumY + dy };

  if (gesture.axis === null && Math.abs(gesture.sumX) + Math.abs(gesture.sumY) >= WHEEL_AXIS_DECIDE_PX) {
    gesture.axis = leansSideways(gesture.sumX, gesture.sumY) ? "x" : "y";
  }

  if (gesture.axis === "y") return { gesture, action: { kind: "page" } };

  if (gesture.axis === "x") {
    // A run of plainly vertical events long enough to be a page scroll, not
    // a wobble: the swipe is over and the reader is scrolling the page.
    if (leansSideways(dx, dy) || (dx === 0 && dy === 0)) {
      gesture.turnX = 0;
      gesture.turnY = 0;
    } else {
      gesture.turnX += dx;
      gesture.turnY += dy;
      if (Math.abs(gesture.turnY) >= WHEEL_RELEASE_PX && Math.abs(gesture.turnX) < Math.abs(gesture.turnY) / 2) {
        gesture.axis = "y";
        return { gesture, action: { kind: "page" } };
      }
    }
    return { gesture, action: dx !== 0 ? { kind: "pan", pixels: dx } : { kind: "hold" } };
  }

  // Not decided yet: sideways movement travels at once (so a swipe responds
  // from its very first pixel); anything else is held.
  if (leansSideways(dx, dy)) return { gesture, action: { kind: "pan", pixels: dx } };
  return { gesture, action: { kind: "hold" } };
}
