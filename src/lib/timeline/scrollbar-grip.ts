import {
  clampWindow,
  logValueOf,
  MIN_WINDOW_YEARS,
  positionAt,
  positionFromLogValue,
  presentPosition,
  TIMELINE_MAX_YEAR,
  TIMELINE_MIN_YEAR,
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

// THE FUTURE GETS A SMALLER SHARE OF THE BAR.
//
// The bar is spaced by order of magnitude around Now, and the same spacing on
// both sides gave the next thousand years (Now to 3000 CE, a handful of plans
// and predictions) almost a quarter of the bar: as much room as everything
// between the first humans and the Bronze Age. Squeezing the future side to
// this share of its old width hands that room back to the past, where the
// records are, so a drag through history covers less time per pixel. The strip
// itself is untouched; this is only how the bar lays time out.
export const BAR_FUTURE_SHARE = 0.4;

/** A date's place on the bar before scaling to 0–1: magnitude around Now, the future squeezed. */
function barValue(position: number, now: number): number {
  const value = logValueOf(position, now);
  return value > 0 ? value * BAR_FUTURE_SHARE : value;
}

function barRange(now: number): { lo: number; hi: number } {
  return { lo: barValue(TIMELINE_MIN_YEAR, now), hi: barValue(TIMELINE_MAX_YEAR, now) };
}

/** Where a date sits on the bar, 0–1. */
export function barFraction(position: number): number {
  const now = presentPosition();
  const { lo, hi } = barRange(now);
  return (barValue(position, now) - lo) / (hi - lo);
}

/** The date at the bar position `fraction`, the inverse of barFraction. */
export function dateAtBar(fraction: number): number {
  const now = presentPosition();
  const { lo, hi } = barRange(now);
  const value = lo + (hi - lo) * Math.max(0, Math.min(1, fraction));
  return positionFromLogValue(value > 0 ? value / BAR_FUTURE_SHARE : value, now);
}

// THE THUMB'S SIZE.
//
// It used to be a fixed 56px, a third of which was zoom grips: a 37px middle
// to take hold of, on a bar that travels thirteen billion years. Now it is a
// share of the bar's width, between a size a fingertip can hold on a phone and
// one that still leaves the track readable on a wide screen — about 120px on
// a laptop.
const THUMB_SHARE = 0.12;
const THUMB_MIN_PX = 64;
const THUMB_MAX_PX = 136;

/** How wide the thumb is drawn, in pixels, on a bar `railWidth` pixels wide. */
export function thumbPixels(railWidth: number): number {
  return Math.max(THUMB_MIN_PX, Math.min(THUMB_MAX_PX, railWidth * THUMB_SHARE));
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

/** Pixels of pull on a thumb end that double (outwards) or halve (inwards) the span, for a short pull. */
export const PULL_PX_PER_DOUBLING = 40;
/** Past roughly this many pixels a pull speeds up, so a long one reaches the ends of time. */
export const PULL_ACCELERATE_PX = 100;

/**
 * How many doublings (negative: halvings) of the span a pull of `outwardPx`
 * is worth.
 *
 * A fixed 40px per doubling was precise but could not get anywhere: from a
 * 500-year view to all thirteen billion years is about 25 doublings, a
 * thousand pixels of pull — wider than the bar itself, so the ends of the
 * thumb could never show "everything" in one pull. So a short pull stays
 * precise and a long one accelerates: about 4 doublings by 100px, 16 by
 * 300px, and the whole of time from a 500-year view by about 400px.
 */
export function pullDoublings(outwardPx: number): number {
  const reach = Math.abs(outwardPx);
  const doublings = reach / PULL_PX_PER_DOUBLING + Math.pow(reach / PULL_ACCELERATE_PX, 2);
  return Math.sign(outwardPx) * doublings;
}

/**
 * Pulling an end of the thumb zooms about the strip's middle date: outwards
 * shows more time, inwards less. `outwardPx` is how far the end has been
 * pulled away from the thumb's centre (negative when pushed towards it).
 */
export function windowAfterPull(base: TimeWindow, outwardPx: number, scale: TimeScale = "linear"): TimeWindow {
  return zoomWindow(base, Math.pow(2, pullDoublings(outwardPx)), 0.5, scale);
}
