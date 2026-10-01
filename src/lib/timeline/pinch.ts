import { panWindow, zoomWindow, type TimeScale, type TimeWindow } from "./time";

// TWO FINGERS ON THE STRIP: ZOOM, AND TRAVEL WITH THEM.
//
// The date that was between the fingers when they landed stays between them:
// spread them and the strip opens out around that date; slide both sideways
// mid-pinch and the date goes with them. That is what a map does, and it is the
// difference between zooming INTO a moment and zooming at the middle of the
// screen while the moment you meant slides away.
//
// Always computed from the window the gesture STARTED with, never accumulated
// frame by frame, so a long pinch cannot drift.

export type PinchStart = {
  window: TimeWindow;
  /** Distance between the fingers when they landed, in pixels. */
  distance: number;
  /** Where between the fingers was, 0–1 across the strip. */
  anchor: number;
};

/** Straight-line distance between two touch points — a vertical pinch is still a pinch. */
export function fingerDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
}

/**
 * The window for the current finger positions.
 *
 * `distance` and `anchor` are the fingers NOW. Fingers apart (distance up) is a
 * narrower window — zoomed in — hence start/now rather than now/start.
 */
export function pinchWindow(start: PinchStart, distance: number, anchor: number, scale: TimeScale = "linear"): TimeWindow {
  const zoomed = zoomWindow(start.window, start.distance / Math.max(1, distance), start.anchor, scale);
  // After the zoom the anchored date is still at start.anchor; move the window
  // so it lands under where the fingers are now.
  return anchor === start.anchor ? zoomed : panWindow(zoomed, start.anchor - anchor, scale);
}
