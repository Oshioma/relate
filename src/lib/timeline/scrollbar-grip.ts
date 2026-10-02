import {
  clampWindow,
  fractionOf,
  logValueOf,
  positionAt,
  positionFromLogValue,
  presentPosition,
  timelineExtentWindow,
  windowAround,
  zoomWindow,
  type TimeScale,
  type TimeWindow,
} from "./time";

// THE SCROLLBAR THUMB MARKS THE MIDDLE OF WHAT YOU ARE LOOKING AT.
//
// The bar spans all of time spaced by order of magnitude around Now, so the
// same number of years takes far more of it near the present than in the deep
// past. Two earlier thumbs both fell foul of that:
//
//   - a thumb that covered the window's first and last dates exactly stayed at
//     its minimum width left of centre and ballooned right of it (a 500-year
//     window grew from 30px to ~500px as it neared Now), so the two halves of
//     the bar behaved like different controls;
//   - a fixed-size thumb pinned to the window's edges ended up sitting over
//     "Now" while the strip showed 125,501 BCE.
//
// So the thumb is one fixed size everywhere and its CENTRE is the strip's
// middle date — the same date the chip beside it names. It makes no claim about
// where the strip's edges fall (the strip's ruler shows those), so it never
// contradicts anything on screen, and it moves the same way on both sides of
// the bar: a pixel of drag is the same step along the bar wherever you are.

const FULL = timelineExtentWindow();

/** Where a date sits on the bar, 0–1. */
export function barFraction(position: number): number {
  return fractionOf(FULL, position, "log");
}

/** The date at the bar position `fraction`, the inverse of barFraction. */
export function dateAtBar(fraction: number): number {
  return positionAt(FULL, Math.max(0, Math.min(1, fraction)), "log");
}

/** The date at the middle of the strip — what the thumb's centre marks. */
export function middleDate(view: TimeWindow, scale: TimeScale = "linear"): number {
  return positionAt(view, 0.5, scale);
}

/** Where the thumb's centre sits on the bar, 0–1. */
export function thumbCentre(view: TimeWindow, scale: TimeScale = "linear"): number {
  return barFraction(middleDate(view, scale));
}

/** `base` moved so the strip's middle date is `date`, at the same zoom. */
export function windowCentredOn(
  base: TimeWindow,
  date: number,
  scale: TimeScale = "linear",
  now: number = presentPosition()
): TimeWindow {
  if (scale === "linear") return windowAround(date, base.to - base.from);
  const half = (logValueOf(base.to, now) - logValueOf(base.from, now)) / 2;
  const middle = logValueOf(date, now);
  return clampWindow({ from: positionFromLogValue(middle - half, now), to: positionFromLogValue(middle + half, now) });
}

/**
 * The window, at `base`'s zoom, whose thumb is centred at bar position
 * `centre`. Near either end of time the window stops at that end, and the
 * thumb with it.
 */
export function windowWithThumbAt(base: TimeWindow, centre: number, scale: TimeScale = "linear"): TimeWindow {
  return windowCentredOn(base, dateAtBar(centre), scale);
}

/** Pixels of pull on a thumb end that double (outwards) or halve (inwards) the span. */
export const PULL_PX_PER_DOUBLING = 40;

/**
 * Pulling an end of the thumb zooms about the strip's middle date: outwards
 * shows more time, inwards less. `outwardPx` is how far the end has been
 * pulled away from the thumb's centre (negative when pushed towards it).
 */
export function windowAfterPull(base: TimeWindow, outwardPx: number, scale: TimeScale = "linear"): TimeWindow {
  return zoomWindow(base, Math.pow(2, outwardPx / PULL_PX_PER_DOUBLING), 0.5, scale);
}
