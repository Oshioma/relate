import {
  clampWindow,
  fractionOf,
  logValueOf,
  MIN_WINDOW_YEARS,
  positionAt,
  positionFromLogValue,
  presentPosition,
  TIMELINE_MAX_YEAR,
  TIMELINE_MIN_YEAR,
  timelineExtentWindow,
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

/**
 * `base` moved so the strip's middle date is `date` — at the same zoom when it
 * fits, and NARROWED when it does not.
 *
 * A window can only be centred on a date if half its span fits on each side
 * of it before the ends of time. Keeping the zoom regardless made most of the
 * bar unreachable: a 100,000-year view cannot be centred later than about
 * 47,000 BCE, so dragging the thumb right stopped dead around the middle of
 * the bar, and the whole-of-time view could not be dragged at all. So near an
 * end the window shrinks just enough to stay centred on the date, and every
 * point on the bar can be reached. Drags always start from the window they
 * began with, so dragging back out restores the zoom.
 */
export function windowCentredOn(
  base: TimeWindow,
  date: number,
  scale: TimeScale = "linear",
  now: number = presentPosition()
): TimeWindow {
  const centre = Math.max(TIMELINE_MIN_YEAR, Math.min(TIMELINE_MAX_YEAR, date));
  if (scale === "linear") {
    const room = Math.min(centre - TIMELINE_MIN_YEAR, TIMELINE_MAX_YEAR - centre);
    const half = Math.max(MIN_WINDOW_YEARS / 2, Math.min((base.to - base.from) / 2, room));
    return clampWindow({ from: centre - half, to: centre + half });
  }
  const middle = logValueOf(centre, now);
  const room = Math.min(logValueOf(TIMELINE_MAX_YEAR, now) - middle, middle - logValueOf(TIMELINE_MIN_YEAR, now));
  const wanted = (logValueOf(base.to, now) - logValueOf(base.from, now)) / 2;
  const half = Math.max(0, Math.min(wanted, room));
  const window = { from: positionFromLogValue(middle - half, now), to: positionFromLogValue(middle + half, now) };
  // A log window squeezed against an end can come out narrower than the
  // narrowest the strip allows; widen it about its centre rather than letting
  // clampWindow slide it off the date.
  if (window.to - window.from < MIN_WINDOW_YEARS) return clampWindow({ from: centre - MIN_WINDOW_YEARS / 2, to: centre + MIN_WINDOW_YEARS / 2 });
  return clampWindow(window);
}

/**
 * The window, at `base`'s zoom where it fits, whose thumb is centred at bar
 * position `centre`. Near either end of time it narrows so that it can be
 * (see windowCentredOn).
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
