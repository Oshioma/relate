import { test } from "node:test";
import assert from "node:assert/strict";

import {
  fractionOf,
  positionAt,
  panWindow,
  formatYear,
  timelineExtentWindow,
  type TimeWindow,
} from "./time";

// ---------------------------------------------------------------------------
// THE CENTRE DATE.
//
// The strip draws a white line down its middle and the overview writes a date
// beside a line of its own. They are claiming to mark THE SAME DATE, in two
// places, on two different scales — the strip spans the window, the overview
// spans all of time on a log scale. If that claim is ever false the feature is
// worse than not having it, because a reader will believe it.
//
// So the date has one definition, used by both: the year at the halfway point
// of the strip. Not the arithmetic mean of the window's ends — on the
// spaced-by-magnitude scale those are different years, and the line would name
// a date it was not drawn at.
// ---------------------------------------------------------------------------

const centreOf = (window: TimeWindow, scale: "linear" | "log" = "linear") => positionAt(window, 0.5, scale);

test("on the linear scale the centre is the midpoint of the window", () => {
  const window = { from: -4000, to: 2000 };
  assert.equal(centreOf(window), -1000);
});

test("the centre always lies inside the window it describes", () => {
  const windows: TimeWindow[] = [
    { from: -4000, to: 2000 },
    { from: -13_800_000_000, to: 2000 },
    { from: 1900, to: 2000 },
    { from: -3000, to: -2999 },
  ];
  for (const window of windows) {
    for (const scale of ["linear", "log"] as const) {
      const centre = centreOf(window, scale);
      assert.ok(
        centre > window.from && centre < window.to,
        `${scale} ${window.from}..${window.to}: centre ${centre} is outside its own window`
      );
    }
  }
});

test("on the spaced-by-magnitude scale the centre is NOT the arithmetic mean", () => {
  // The reason the code calls positionAt rather than averaging the ends. If
  // this ever stops being true the shortcut becomes harmless — but while it is
  // true, averaging would draw the line in one place and name another date.
  const window = { from: -13_800_000_000, to: 2000 };
  const mean = (window.from + window.to) / 2;
  const centre = centreOf(window, "log");
  assert.notEqual(Math.round(centre), Math.round(mean));
  // And it is not a rounding difference: they are billions of years apart.
  assert.ok(Math.abs(centre - mean) > 1_000_000_000, `centre ${centre} vs mean ${mean}`);
});

test("scrolling left reads earlier and scrolling right reads later", () => {
  // The behaviour asked for, in the terms it was asked in.
  for (const scale of ["linear", "log"] as const) {
    const window = { from: -4000, to: 2000 };
    const here = centreOf(window, scale);
    const left = centreOf(panWindow(window, -0.25, scale), scale);
    const right = centreOf(panWindow(window, 0.25, scale), scale);
    assert.ok(left < here, `${scale}: scrolling left did not read earlier (${left} vs ${here})`);
    assert.ok(right > here, `${scale}: scrolling right did not read later (${right} vs ${here})`);
  }
});

test("the date's own position on the overview bar is NOT where the line is drawn", () => {
  // WHY THE LINE IS FIXED AT THE MIDDLE OF THE BAR, kept as a test because it
  // looks like a thing somebody would later "fix".
  //
  // The bar spans all of time on a log scale; the strip spans the window. So
  // the view's centre date does not generally fall at the middle of the bar,
  // and the first version drew the line where the date lands — which at a wide
  // zoom put a line and a label near the LEFT EDGE, claiming to mark the middle
  // of what you were looking at.
  //
  // The mark is now a fixed playhead: the bar's centre is the reading position,
  // and the date beside it is a label rather than a pointer. If these two ever
  // did coincide, positioning by the date would be harmless — this test says
  // how far from harmless it currently is.
  // MEASURED, not guessed. On the linear strip at full zoom-out the centre date
  // is 6.95 billion years ago, and that date sits at 0.023 of a bar which is
  // itself logarithmic — two per cent from the left edge. That is the picture
  // that prompted the change. (On the log scale the two happen to coincide at
  // 0.500, which is why the fault was invisible until someone looked at a
  // linear strip zoomed all the way out.)
  const full = timelineExtentWindow();
  const whereTheDateFalls = fractionOf(full, centreOf(full, "linear"), "log");
  assert.ok(
    whereTheDateFalls < 0.1,
    `the date lands at ${whereTheDateFalls.toFixed(3)} of the bar; if that is near the middle, ` +
      "drawing the line at the date would no longer be the bug this test records"
  );
});

test("the centre date has something to say at either end of time", () => {
  // It is written into a bar nine pixels tall; an empty string or a raw
  // astronomical number there would be worse than no label.
  for (const window of [
    { from: -13_900_000_000, to: -13_000_000_000 },
    { from: 1990, to: 2010 },
    { from: -3000, to: -2000 },
  ]) {
    const label = formatYear(centreOf(window), { compact: true });
    assert.ok(label.trim().length > 0, `no label for ${window.from}..${window.to}`);
    assert.ok(!label.includes("NaN"), `NaN in "${label}"`);
  }
});
