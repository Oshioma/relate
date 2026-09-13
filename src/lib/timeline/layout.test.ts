import { test } from "node:test";
import assert from "node:assert/strict";

import { layoutTimeline, ROW_BASE_PX } from "./layout";
import type { TimelineEventWithClaims } from "@/lib/data/timeline";

// ---------------------------------------------------------------------------
// THE STRIP, AS A FUNCTION.
//
// layoutTimeline is pure, which is the only reason any of this is testable: a
// crowded timeline is very hard to reason about in a browser and quite easy to
// reason about as "ninety events, six hundred pixels, how many are drawn".
//
// These tests exist because the layout had no tests at all, and a real defect
// had been living in it: a record whose earliest claim is 13.8 billion years
// ago produced a footprint nearly three billion pixels wide, which consumed an
// entire row on its own and pushed everything else into the overflow row.
// ---------------------------------------------------------------------------

const WINDOW = { from: -3859, to: 3000 };
const WIDTH = 1430;

let nextId = 0;
/** One event with one claim at a given year. Only the fields the layout reads. */
const eventAt = (startYear: number, options: { endYear?: number; title?: string } = {}) =>
  ({
    id: `e${nextId++}`,
    slug: `e${nextId}`,
    title: options.title ?? `Event ${nextId}`,
    summary: null,
    description: null,
    category: "history",
    status: "published",
    people: [],
    civilisations: [],
    trackIds: [],
    claims: [
      {
        id: `c${nextId}`,
        start_year: startYear,
        end_year: options.endYear ?? null,
        start_month: null,
        start_day: null,
        date_precision: "year",
        precision_decimals: 0,
        is_approximate: false,
        temporal_claim_type: null,
        duration_years: null,
        chronology: "conventional",
        original_date_text: "",
        uncertainty_plus: null,
        uncertainty_minus: null,
        date_convention: null,
        convention_reference_year: null,
      },
    ],
  }) as unknown as TimelineEventWithClaims;

/** Everything the layout drew or accounted for, by count. */
const accountedFor = (layout: ReturnType<typeof layoutTimeline>) =>
  layout.events.length + layout.clusters.reduce((sum, cluster) => sum + cluster.count, 0);

// ---------------------------------------------------------------------------
// THE DEFECT THIS FILE WAS WRITTEN FOR
// ---------------------------------------------------------------------------

test("a claim far outside the window does not produce an enormous footprint", () => {
  // 13.8 billion years ago, in a window about seven thousand years wide, is
  // roughly 2.9 billion pixels to the left. Unclamped, that number reached the
  // row packer and the DOM alike.
  const deepTime = eventAt(-13_800_000_000, { endYear: 0, title: "The age of the universe" });
  const layout = layoutTimeline([deepTime], WINDOW, WIDTH, 400, "linear");

  assert.equal(layout.events.length, 1, "the record should still be drawn");
  const placed = layout.events[0];
  assert.ok(
    placed.xFrom > -200,
    `xFrom is ${Math.round(placed.xFrom)} — a footprint reaching that far left cannot be packed sensibly`
  );
  assert.ok(
    placed.xTo - placed.xFrom < WIDTH + 200,
    `footprint is ${Math.round(placed.xTo - placed.xFrom)}px wide on a ${WIDTH}px strip`
  );
});

test("a deep-time record reserves only the row it occupies on screen", () => {
  // The mechanism of the original bug: events are packed in xFrom order, so an
  // event starting billions of pixels to the left reserved its row from there,
  // and nothing could ever precede it — the row was spent on one record.
  //
  // Clamped, such a record reserves its row only as far as it actually reaches.
  // A record ending early in the window therefore leaves the rest of that row
  // free, and a later event can share it.
  const deepTime = eventAt(-13_800_000_000, { endYear: -3500, title: "Age of the universe" });
  const later = eventAt(2500, { title: "Something recent" });
  const layout = layoutTimeline([deepTime, later], WINDOW, WIDTH, 400, "linear");

  assert.equal(accountedFor(layout), 2, "an event went missing");
  assert.equal(
    layout.rows,
    1,
    "a deep-time record ending near the left edge still took a whole row from an event at the right edge"
  );
});

test("deep-time records that genuinely overlap still get their own rows", () => {
  // The complement, so the clamp is not mistaken for a licence to overlap.
  // Four records all running to the present really do cover the same pixels.
  const deepTimes = [-13_800_000_000, -4_500_000_000, -600_000_000, -66_000_000].map((year) =>
    eventAt(year, { endYear: 0 })
  );
  const layout = layoutTimeline(deepTimes, WINDOW, WIDTH, 400, "linear");
  assert.equal(accountedFor(layout), 4, "an event went missing");
  assert.ok(layout.rows >= 2, "four overlapping spans were drawn on top of each other");
});

test("overflow chips are not all stacked on the last row", () => {
  // THE VISIBLE SYMPTOM THIS WHOLE CHANGE EXISTS FOR: a bottom line of count
  // chips sitting on the last row's own events, while rows above keep gaps. The
  // fallback used to be `finalLines.length - 1` unconditionally.
  //
  // The fixture has to be shaped like a real timeline for the difference to
  // show: a few long spans on the left, a dense modern crowd, points between.
  // An evenly-spaced crowd gives every row the same reach, and then the least
  // crowded row genuinely IS the last one — which is why the first version of
  // this test passed with the bug still in place.
  // Titles are given a realistic length on purpose: a caption's width decides
  // how much of a row it reserves, so short test titles let everything fit and
  // the overflow path is never reached.
  const titled = (year: number, endYear?: number) =>
    eventAt(year, { endYear, title: `Event at ${year} with a reasonably long title here` });
  const events = [
    titled(-3800, -1200),
    titled(-3500, -900),
    titled(-3000, 500),
    ...Array.from({ length: 40 }, (_, index) => titled(-2500 + index * 90)),
    ...Array.from({ length: 50 }, (_, index) => titled(1500 + index * 28)),
  ];

  for (const height of [280, 360]) {
    const layout = layoutTimeline(events, WINDOW, WIDTH, height, "linear");
    const chips = layout.clusters.filter((cluster) => cluster.key.startsWith("overflow-"));
    assert.ok(chips.length > 1, `height ${height}: fixture produced ${chips.length} chips, so it tests nothing`);
    assert.ok(layout.rows > 2, `height ${height}: only ${layout.rows} rows, so there is nowhere else to put them`);
    const lastRow = layout.rows - 1;
    assert.ok(
      !chips.every((chip) => chip.row === lastRow),
      `height ${height}: all ${chips.length} chips are on the last row (${lastRow}) with rows above free`
    );
  }
});

// ---------------------------------------------------------------------------
// THE PROPERTY THAT MUST NEVER BREAK
// ---------------------------------------------------------------------------

test("nothing is silently lost, at any height", () => {
  // Every event with a positioned claim is either drawn or counted in a chip.
  // This is the promise the overflow machinery exists to keep, and it was the
  // one thing no test was checking while three behaviours were changed.
  const events = [
    ...Array.from({ length: 60 }, (_, index) => eventAt(-3000 + index * 100)),
    ...Array.from({ length: 40 }, (_, index) => eventAt(1900 + index * 2)),
    eventAt(-13_800_000_000, { endYear: 0 }),
  ];
  for (const height of [ROW_BASE_PX, 120, 200, 340, 500, 800]) {
    const layout = layoutTimeline(events, WINDOW, WIDTH, height, "linear");
    assert.equal(
      accountedFor(layout),
      events.length,
      `height ${height}: ${accountedFor(layout)} of ${events.length} accounted for`
    );
  }
});

test("an event is never both drawn and counted in a chip", () => {
  const events = Array.from({ length: 80 }, (_, index) => eventAt(1500 + index * 5));
  const layout = layoutTimeline(events, WINDOW, WIDTH, 200, "linear");
  const drawn = layout.events.length;
  const chipped = layout.clusters.reduce((sum, cluster) => sum + cluster.count, 0);
  assert.equal(drawn + chipped, events.length, "double counting or loss");
});

test("nothing is drawn outside the height it was given", () => {
  const events = Array.from({ length: 60 }, (_, index) => eventAt(-2000 + index * 60));
  for (const height of [120, 260, 500]) {
    const layout = layoutTimeline(events, WINDOW, WIDTH, height, "linear");
    // The first row always draws even on a strip too short for it, which is
    // deliberate; beyond that the layout must stay inside its budget.
    if (layout.rows > 1) {
      assert.ok(
        layout.height <= height,
        `height ${height}: laid out ${layout.height}px across ${layout.rows} rows`
      );
    }
    for (const placed of layout.events) {
      assert.ok(placed.row < layout.rows, `an event is on row ${placed.row} of ${layout.rows}`);
    }
    for (const cluster of layout.clusters) {
      assert.ok(cluster.row < layout.rows, `a chip is on row ${cluster.row} of ${layout.rows}`);
    }
  }
});

test("a zero-width strip lays out nothing rather than dividing by it", () => {
  const layout = layoutTimeline([eventAt(0)], WINDOW, 0, 400, "linear");
  assert.deepEqual(layout.events, []);
  assert.deepEqual(layout.clusters, []);
  assert.equal(layout.rows, 0);
});

test("an event with no positioned claim is not placed at the left edge", () => {
  // A claim naming no time has no x. Letting it through produced a zero, which
  // is the start of the window rather than "nowhere".
  const positionless = eventAt(0);
  (positionless.claims[0] as { start_year: number | null }).start_year = null;
  const layout = layoutTimeline([positionless], WINDOW, WIDTH, 400, "linear");
  assert.equal(layout.events.length, 0, "a positionless record was drawn at the window's start");
  assert.equal(accountedFor(layout), 0);
});
