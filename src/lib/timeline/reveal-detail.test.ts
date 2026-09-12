import { test } from "node:test";
import assert from "node:assert/strict";

import { revealDetailAt, DETAIL_TOP_FRACTION } from "./reveal-detail";

// The real geometry, measured on a seeded timeline at 1280x900: the strip
// occupies document Y 564..1124 and the detail opens at 1176.
const STRIP_TOP = 564;
const STRIP_BOTTOM = 1124;
const DETAIL_TOP = 1176;
const VIEWPORT = 900;

test("opening a record leaves the strip on the screen", () => {
  // The whole point. Before this, the target was the detail's own top, which
  // put the strip at -612..-52 — off the screen entirely.
  const target = revealDetailAt({ detailTop: DETAIL_TOP, scrollY: 0, viewportHeight: VIEWPORT });
  assert.notEqual(target, null);
  const stripTopInViewport = STRIP_TOP - target!;
  const stripBottomInViewport = STRIP_BOTTOM - target!;
  assert.ok(stripBottomInViewport > 0, `strip is above the fold: bottom at ${stripBottomInViewport}`);
  assert.ok(stripTopInViewport < VIEWPORT, "strip is below the fold");
  // And a useful amount of it, not a sliver.
  const visible = Math.min(VIEWPORT, stripBottomInViewport) - Math.max(0, stripTopInViewport);
  assert.ok(visible >= 300, `only ${visible}px of the strip left visible`);
});

test("opening a record actually reveals the record", () => {
  // The failure the scrolling exists to prevent: the visible part of the page
  // is identical before and after, so the click looks like it did nothing.
  const target = revealDetailAt({ detailTop: DETAIL_TOP, scrollY: 0, viewportHeight: VIEWPORT });
  const detailTopInViewport = DETAIL_TOP - target!;
  assert.ok(detailTopInViewport < VIEWPORT, "detail is still below the fold");
  const shown = VIEWPORT - detailTopInViewport;
  assert.ok(shown >= 300, `only ${shown}px of the detail brought into view`);
});

test("a detail already on screen does not move the page", () => {
  // Clicking a second card while the first is open. Moving the page here is
  // moving it for no reason, which is the complaint in miniature.
  assert.equal(revealDetailAt({ detailTop: 300, scrollY: 0, viewportHeight: VIEWPORT }), null);
  assert.equal(revealDetailAt({ detailTop: 1200, scrollY: 1000, viewportHeight: VIEWPORT }), null);
});

test("a detail one pixel inside the bottom edge is not 'already visible'", () => {
  // Intersecting the viewport is not the same as being legible in it.
  const justInside = revealDetailAt({ detailTop: 899, scrollY: 0, viewportHeight: VIEWPORT });
  assert.notEqual(justInside, null, "a sliver at the bottom edge should still be revealed");
});

test("the page is never scrolled to a negative position", () => {
  // A short page, or a detail near the top of the document.
  const target = revealDetailAt({ detailTop: 200, scrollY: 900, viewportHeight: VIEWPORT });
  if (target !== null) assert.ok(target >= 0, `negative scroll target ${target}`);
});

test("the fraction leaves more room above than below", () => {
  // If this ever drops to a half or less, the strip loses the space it needs
  // at its tallest (560px at xl) and the fix stops fixing anything.
  assert.ok(DETAIL_TOP_FRACTION > 0.5, "the strip needs the larger share of the screen");
  assert.ok(DETAIL_TOP_FRACTION < 0.8, "at this point the detail is barely revealed");
});

test("a tall strip still fits on a short laptop screen", () => {
  // 1512x860 with the xl strip: the case a 'block: start' scroll handles worst.
  const target = revealDetailAt({ detailTop: DETAIL_TOP, scrollY: 0, viewportHeight: 760 });
  const stripBottomInViewport = STRIP_BOTTOM - target!;
  assert.ok(stripBottomInViewport > 0, `strip pushed off a 760px screen: ${stripBottomInViewport}`);
});
