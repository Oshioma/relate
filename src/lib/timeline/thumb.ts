import {
  clampWindow,
  fractionOf,
  logValueOf,
  positionAt,
  positionFromLogValue,
  presentPosition,
  timelineExtentWindow,
  type TimeScale,
  type TimeWindow,
} from "./time";

// THE SCROLLBAR THUMB: A SIZE THAT MEANS ZOOM, AND NOTHING ELSE.
//
// The scrollbar shows all of time on a log scale, so a fixed span of years
// takes very different widths along it: ten thousand years is a sliver among
// the billions on the left and half the bar near the present. Drawing the
// thumb as the true extent of the window therefore made it balloon and shrink
// as the reader swiped — "it scrolls, but it also adjusts the size of the
// scroll bar, which makes it difficult".
//
// So, as decided with the owner, the thumb is drawn like an ordinary
// scrollbar's: its WIDTH comes only from how much time is on screen (wider when
// zoomed out, full when everything is shown) and its CENTRE sits on the date
// at the middle of the strip. Swiping slides it; only zooming resizes it. Its
// edges are therefore approximate — they no longer mark the exact first and
// last visible dates — which is the trade that was chosen.

const FULL = timelineExtentWindow();
const FULL_SPAN = FULL.to - FULL.from;
const LOG_FULL = Math.log10(1 + FULL_SPAN);
// How steeply the thumb grows with zoom. Straight log (1) made a ten-thousand-
// year view fill 38% of the bar, which reads as "you are seeing a lot of time";
// at 2.5 it is about a tenth, a single century is near the minimum, and only
// views of millions of years take a large share — still full at all of time.
const THUMB_CURVE = 2.5;

/** How wide the thumb is, 0–1 of the bar, for a window this many years wide. */
export function thumbWidthForSpan(span: number): number {
  const share = Math.max(0, Math.min(1, Math.log10(1 + Math.max(0, span)) / LOG_FULL));
  return Math.pow(share, THUMB_CURVE);
}

/** The inverse: how many years a thumb this wide stands for. */
export function spanForThumbWidth(width: number): number {
  const share = Math.pow(Math.max(0, Math.min(1, width)), 1 / THUMB_CURVE);
  return Math.pow(10, share * LOG_FULL) - 1;
}

/** Where on the bar a date sits, 0–1 — the bar's own log spacing. */
export function barFraction(position: number): number {
  return fractionOf(FULL, position, "log");
}

/**
 * The thumb for a window: centred on the strip's centre date, as wide as its
 * zoom, kept inside the bar. `from`/`to` are fractions of the bar.
 */
export function thumbFor(view: TimeWindow, scale: TimeScale = "linear"): { from: number; to: number; width: number; centre: number } {
  const width = thumbWidthForSpan(view.to - view.from);
  const centre = barFraction(positionAt(view, 0.5, scale));
  const from = Math.max(0, Math.min(1 - width, centre - width / 2));
  return { from, to: from + width, width, centre };
}

/**
 * The window a thumb stands for: the date under its centre, at the zoom its
 * width means. On the log strip the window is centred in log space, so the
 * date lands under the strip's own centre line.
 */
export function windowForThumb(centre: number, width: number, scale: TimeScale = "linear", now: number = presentPosition()): TimeWindow {
  const date = positionAt(FULL, Math.max(0, Math.min(1, centre)), "log");
  const span = spanForThumbWidth(width);
  const linear = clampWindow({ from: date - span / 2, to: date + span / 2 });
  if (scale === "linear") return linear;
  const half = (logValueOf(linear.to, now) - logValueOf(linear.from, now)) / 2;
  const middle = logValueOf(date, now);
  return clampWindow({ from: positionFromLogValue(middle - half, now), to: positionFromLogValue(middle + half, now) });
}
