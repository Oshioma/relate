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

function toPixels(delta: number, deltaMode: number): number {
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
