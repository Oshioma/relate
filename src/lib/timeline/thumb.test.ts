import { test } from "node:test";
import assert from "node:assert/strict";

import { panWindow, positionAt, timelineExtentWindow } from "./time";
import { spanForThumbWidth, thumbFor, thumbWidthForSpan, windowAtThumb, windowForThumb } from "./thumb";

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

test("a view that reaches the end of the timeline puts the thumb against the end of the bar", () => {
  // The screenshot that prompted this: 254,001 BCE – 3000 CE already reaches the
  // end, but the thumb, centred on 125,501 BCE, sat mid-bar with track to spare.
  const atEnd = thumbFor({ from: -254_000, to: 3000 });
  assert.equal(atEnd.to, 1);
  const atStart = thumbFor({ from: timelineExtentWindow().from, to: timelineExtentWindow().from + 1e6 });
  assert.equal(atStart.from, 0);
  // Anywhere else it stays centred on its middle date.
  const middle = thumbFor({ from: -60_000, to: -50_000 });
  assert.ok(middle.from > 0 && middle.to < 1);
});

test("leaving an end, the thumb glides rather than leaping", () => {
  // Pinned at the end, then centred a pixel later, made the thumb jump most of
  // the bar on the first pixel of a drag.
  let view = { from: -254_000, to: 3000 };
  let previous = thumbFor(view).from;
  for (let i = 0; i < 40; i++) {
    view = panWindow(view, -0.05);
    const next = thumbFor(view).from;
    assert.ok(Math.abs(next - previous) < 0.05, `step ${i}: thumb jumped ${(next - previous).toFixed(3)} of the bar`);
    previous = next;
  }
});

test("a dragged thumb lands exactly where it was dragged, ends included", () => {
  const width = thumbWidthForSpan(257_000);
  for (const target of [0, 0.1, 0.4, 0.7, 0.75, 0.79, 1 - width]) {
    const drawn = thumbFor(windowAtThumb(target, width)).from;
    assert.ok(Math.abs(drawn - Math.min(target, 1 - width)) < 1e-4, `asked for ${target}, drawn at ${drawn}`);
  }
});
