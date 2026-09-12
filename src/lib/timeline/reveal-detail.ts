/**
 * WHERE TO SCROLL TO WHEN A RECORD IS OPENED.
 *
 * Clicking a card on the strip opens its detail below the strip. The detail
 * is long — on a seeded timeline it runs to some eleven thousand pixels — so
 * something has to bring it into view or the click looks like it did nothing
 * at all: the visible part of the page is identical before and after, and only
 * the scroll height changes.
 *
 * The obvious way to do that, and what this replaced, is
 * `scrollIntoView({ block: "start" })` on the detail. It works, and it takes
 * the strip with it: aligning the detail to the top of the viewport puts the
 * canvas entirely above the fold. You click a card to look at it and lose the
 * instrument you were reading it on, which is the reported problem — "a click
 * on the cards at the top scrolls me down".
 *
 * So the rule here is: reveal the detail WITHOUT pushing the strip off. The
 * detail's top lands partway down the screen, the strip keeps the space above
 * it, and both are on screen at once.
 *
 * Kept as a pure function of three numbers so the arithmetic can be checked
 * without a browser.
 */

/**
 * How far down the viewport the detail's top edge is placed. The space above
 * it is what the strip keeps.
 *
 * Just over half: enough of the detail to show its heading and the start of
 * its text, enough above it for the strip at every height it is given
 * (260px on a phone, 440 at sm, 560 at xl).
 */
export const DETAIL_TOP_FRACTION = 0.55;

/**
 * A detail whose top is already this far into the viewport needs no scroll at
 * all. Without a margin, a detail sitting one pixel inside the bottom edge
 * counts as visible and the click does nothing visible — so "visible" means
 * far enough in to be legible, not merely intersecting.
 */
const ALREADY_VISIBLE_MARGIN_PX = 120;

export type RevealInput = {
  /** Document Y of the top of the detail panel. */
  detailTop: number;
  /** Where the page is scrolled to now. */
  scrollY: number;
  /** Height of the viewport. */
  viewportHeight: number;
};

/**
 * The scroll position to move to, or null to stay put.
 *
 * Null rather than "the current position" because the two are different
 * instructions: one starts a smooth scroll that lands where it already is —
 * which still interrupts a scroll the reader has started — and the other does
 * not touch the page.
 */
export function revealDetailAt({ detailTop, scrollY, viewportHeight }: RevealInput): number | null {
  const topInViewport = detailTop - scrollY;

  // Already showing a useful amount of it: leave the page alone. This is the
  // case when somebody clicks a second card while the first is still open,
  // and moving the page then would be moving it for no reason.
  if (topInViewport >= 0 && topInViewport <= viewportHeight - ALREADY_VISIBLE_MARGIN_PX) return null;

  const target = Math.max(0, Math.round(detailTop - viewportHeight * DETAIL_TOP_FRACTION));

  // Never scroll UP to reveal something that is below the fold. That only
  // happens when the arithmetic above has gone wrong, and scrolling backwards
  // away from a record the reader just opened is worse than not moving.
  if (topInViewport > viewportHeight && target < scrollY) return null;

  return target;
}
