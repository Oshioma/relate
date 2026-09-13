// =============================================================================
// THE GEOMETRY OF THE OVERVIEW BAR'S WINDOW BOX
//
// Everything here works in FRACTIONS OF THE RAIL, 0 at the left-hand end and 1
// at the right. Years never appear: the bar is spaced by magnitude and the
// component converts at the edges, so the arithmetic below is the same whatever
// scale the strip above is drawn on. That is also what makes it testable
// without a browser, which is the point — the bug this file exists to fix was
// arithmetic, and it was invisible in the component because nothing could look
// at it.
// =============================================================================

/** A window box on the rail. Both values are fractions, and `from <= to`. */
export type RailBox = { from: number; to: number };

/**
 * PULLING A GRIP WIDENS THE BOX AT BOTH ENDS.
 *
 * WHAT THIS REPLACED, AND WHY IT HAD TO GO. Each grip used to move alone, with
 * the opposite edge pinned exactly where it was. That reads well — stretching
 * never moved the end you were using as your reference — and it made the
 * control useless for the thing people actually do with it.
 *
 * The measurement, on a 975-pixel rail with the box's right edge at 0.8:
 *
 *     left grip pulled out to     box width     drag still needed to
 *                                               reach the right-hand end
 *     2019                            98 px                    195 px
 *     1844                           195 px                    195 px
 *     75,657 BCE                     390 px                    195 px
 *     32.9 mya                       585 px                    195 px
 *     13.9 bya                       780 px                    195 px
 *
 * Widen the box eightfold and the trip to the far end does not shorten by a
 * single pixel — because the distance left to travel is `1 - to`, and pinning
 * `to` pins it by construction. Zooming out bought nothing, which is the
 * opposite of what zooming out is for.
 *
 * So the grabbed grip goes exactly where the pointer is, and the OPPOSITE EDGE
 * MOVES THE SAME DISTANCE THE OTHER WAY. The box's centre stays put, the width
 * grows by twice what you dragged, and every pixel of widening is a pixel you
 * no longer have to drag afterwards — in both directions.
 *
 * THE PRICE, stated because it is real: pulling the left grip out no longer
 * holds the recent end still. Widening to see deep time now also carries the
 * right-hand edge later. That was a deliberate choice, made because a control
 * that keeps your reference and cannot get you anywhere is the wrong trade.
 *
 * AT THE RAIL'S ENDS the box simply stops being symmetrical: the mirrored edge
 * stops at 0 or 1 and the grabbed grip carries on following the pointer, which
 * is the only behaviour that does not make a grip stick to your finger and then
 * come unstuck.
 */
export function resizeBox(
  box: RailBox,
  edge: "from" | "to",
  /** Where the pointer is, as a fraction of the rail. */
  fraction: number,
  /** The narrowest the box may be drawn, as a fraction of the rail. */
  minWidth: number
): RailBox {
  const centre = (box.from + box.to) / 2;
  const target = clamp01(fraction);
  // THE LIMIT IS THE CENTRE, NOT THE OTHER GRIP. Closing about the centre means
  // both edges come in, so the width runs out when the grabbed edge is half the
  // minimum from the middle — pushing it as far as the opposite grip would
  // invert the box.
  const half = Math.max(minWidth, 0) / 2;

  let from: number;
  let to: number;
  if (edge === "from") {
    from = Math.min(target, centre - half);
    to = box.to + (box.from - from);
  } else {
    to = Math.max(target, centre + half);
    from = box.from - (to - box.to);
  }

  return { from: Math.max(0, from), to: Math.min(1, to) };
}

/**
 * How far the box must still be dragged to put its right-hand edge at the end
 * of the rail. Exported because it is the number the fix is about, and a claim
 * that widening shortens it is worth checking rather than asserting.
 */
export function travelToRightEnd(box: RailBox): number {
  return Math.max(0, 1 - box.to);
}

/** Same question, the other way. */
export function travelToLeftEnd(box: RailBox): number {
  return Math.max(0, box.from);
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
