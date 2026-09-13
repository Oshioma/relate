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

test("the mark lands inside the box the overview draws", () => {
  // The overview places the line at the centre date's position on a bar
  // spanning all of time, rather than halfway across the box. Those agree on
  // the linear scale — and where they would not, the honest answer is where the
  // date actually falls. Either way it must be INSIDE the box, or the line is
  // pointing outside the stretch it claims to be the middle of.
  const full = timelineExtentWindow();
  const windows: TimeWindow[] = [
    { from: -4000, to: 2000 },
    { from: -13_800_000_000, to: 2000 },
    { from: 1900, to: 2000 },
  ];
  for (const window of windows) {
    for (const scale of ["linear", "log"] as const) {
      const boxFrom = fractionOf(full, window.from, "log");
      const boxTo = fractionOf(full, window.to, "log");
      const mark = fractionOf(full, centreOf(window, scale), "log");
      assert.ok(
        mark > boxFrom && mark < boxTo,
        `${scale} ${window.from}..${window.to}: mark at ${mark} is outside the box ${boxFrom}..${boxTo}`
      );
    }
  }
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
