import {
  clampWindow,
  fractionOf,
  logValueOf,
  positionAt,
  positionFromLogValue,
  presentPosition,
  timelineExtentWindow,
  windowAround,
  type TimeScale,
  type TimeWindow,
} from "./time";

// DRAGGING THE SCROLLBAR THUMB: THE SPOT YOU GRABBED STAYS UNDER YOUR FINGER.
//
// The thumb is drawn exactly — its edges are the first and last dates on
// screen — on a bar that spans all of time spaced by order of magnitude. The
// same number of years therefore takes more of the bar near the present than
// in the deep past, and the thumb grows and shrinks as it travels. (A fixed-size
// thumb was tried and dropped: it had to stop marking the dates on screen, and
// ended up sitting over "Now" while the strip showed 125,501 BCE.)
//
// What a drag must not do is let that change of size slip the thumb out from
// under the pointer, or change the zoom. So a drag keeps the zoom it started
// with, and asks for the window whose thumb has the GRIPPED point — the same
// share of the way along it — exactly under the pointer.

const FULL = timelineExtentWindow();

/** Where a date sits on the bar, 0–1. */
export function barFraction(position: number): number {
  return fractionOf(FULL, position, "log");
}

/** The thumb as drawn: its true extent, widened to `minWidth` and kept on the bar. */
export function drawnThumb(view: TimeWindow, minWidth: number): { from: number; width: number } {
  const lo = barFraction(view.from);
  const hi = barFraction(view.to);
  const width = Math.max(minWidth, Math.min(1, hi - lo));
  return { from: Math.max(0, Math.min(1 - width, lo)), width };
}

/** `base` moved so the strip's centre date is `date`, at the same zoom. */
function centredOn(base: TimeWindow, date: number, scale: TimeScale, now: number): TimeWindow {
  if (scale === "linear") return windowAround(date, base.to - base.from);
  const half = (logValueOf(base.to, now) - logValueOf(base.from, now)) / 2;
  const middle = logValueOf(date, now);
  return clampWindow({ from: positionFromLogValue(middle - half, now), to: positionFromLogValue(middle + half, now) });
}

/**
 * The window, at `base`'s zoom, whose drawn thumb has the point `grip` of the
 * way along it (0 = left edge, 1 = right edge) at bar position `pointer`.
 * Found by bisection on the centre date: the thumb moves steadily rightwards as
 * the centre moves later, but its changing width has no tidy inverse.
 */
export function windowWithGripAt(
  base: TimeWindow,
  grip: number,
  pointer: number,
  minWidth: number,
  scale: TimeScale = "linear",
  now: number = presentPosition()
): TimeWindow {
  const gripAt = (window: TimeWindow) => {
    const thumb = drawnThumb(window, minWidth);
    return thumb.from + grip * thumb.width;
  };
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2;
    if (gripAt(centredOn(base, positionAt(FULL, mid, "log"), scale, now)) < pointer) lo = mid;
    else hi = mid;
  }
  return centredOn(base, positionAt(FULL, (lo + hi) / 2, "log"), scale, now);
}
