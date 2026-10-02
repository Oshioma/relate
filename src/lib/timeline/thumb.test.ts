import { test } from "node:test";
import assert from "node:assert/strict";

import { panWindow, positionAt, timelineExtentWindow } from "./time";
import { spanForThumbWidth, thumbFor, thumbWidthForSpan, windowForThumb } from "./thumb";

test("swiping slides the thumb without resizing it", () => {
  // The complaint: the same ten thousand years took a sliver of the bar in the
  // deep past and half of it near now, so the thumb ballooned while swiping.
  let view = { from: -60_000, to: -50_000 };
  const widths = new Set<number>();
  for (let i = 0; i < 12; i++) {
    widths.add(Number(thumbFor(view).width.toFixed(9)));
    view = panWindow(view, 0.4);
  }
  assert.equal(widths.size, 1, `the thumb changed size while panning: ${[...widths].join(", ")}`);
});

test("zooming in narrows the thumb, and all of time fills the bar", () => {
  assert.ok(thumbWidthForSpan(1_000) < thumbWidthForSpan(100_000));
  const full = timelineExtentWindow();
  assert.equal(thumbFor(full).width, 1);
});

test("width and span are exact inverses", () => {
  for (const span of [10, 1_000, 4.5e9]) {
    assert.ok(Math.abs(spanForThumbWidth(thumbWidthForSpan(span)) - span) / span < 1e-9);
  }
});

test("the thumb is centred on the strip's centre date and stays inside the bar", () => {
  const thumb = thumbFor({ from: -3000, to: -2000 });
  assert.ok(thumb.from >= 0 && thumb.to <= 1);
  assert.ok(Math.abs((thumb.from + thumb.to) / 2 - thumb.centre) < 1e-9);
});

test("dragging the thumb moves through time at the same zoom", () => {
  const view = { from: -3000, to: -2000 };
  const thumb = thumbFor(view);
  const moved = windowForThumb(thumb.centre + 0.05, thumb.width);
  assert.ok(Math.abs(moved.to - moved.from - 1000) < 1e-6, `span became ${moved.to - moved.from}`);
  assert.ok(positionAt(moved, 0.5) > positionAt(view, 0.5), "dragging right should move later");
});

test("a thumb read back gives the window it was drawn from", () => {
  const view = { from: -3000, to: -2000 };
  const thumb = thumbFor(view);
  const back = windowForThumb(thumb.centre, thumb.width);
  assert.ok(Math.abs(back.from - view.from) < 1e-6 && Math.abs(back.to - view.to) < 1e-6, `${back.from}..${back.to}`);
});

test("a ten-thousand-year view takes about a tenth of the bar, not a third", () => {
  const share = thumbWidthForSpan(10_000);
  assert.ok(share > 0.05 && share < 0.15, `share ${share}`);
});
