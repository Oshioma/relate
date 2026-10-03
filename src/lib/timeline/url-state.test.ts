import { test } from "node:test";
import assert from "node:assert/strict";

import { EMPTY_TIMELINE_FILTERS, readTimelineUrlState, readWindow, roundEdge, timelineSearch, type TimelineUrlState } from "./url-state";

const base: TimelineUrlState = {
  ...EMPTY_TIMELINE_FILTERS,
  window: { from: -3000, to: -2000 },
  scale: "linear",
  focus: null,
  period: null,
};

const parse = (search: string) => Object.fromEntries(new URLSearchParams(search));

test("a written state reads back as the same state", () => {
  const state: TimelineUrlState = {
    ...base,
    window: { from: -10_600, to: -10_400 },
    scale: "log",
    focus: "great-pyramid",
    period: "p-123",
    category: "archaeology",
    trackId: "t-1",
    chronology: "conventional",
    sourceType: "primary",
    person: "Khufu",
    civilisation: "Egypt",
    tag: "benin-kingdom-context",
    disputedOnly: true,
    pendingOnly: true,
  };
  const params = parse(timelineSearch(state));
  const { window: expectedWindow, ...rest } = state;
  assert.deepEqual(readWindow(params), expectedWindow);
  assert.deepEqual(readTimelineUrlState(params), rest);
});

test("defaults are left out of the address", () => {
  assert.equal(timelineSearch(base), "?from=-3000&to=-2000");
});

test("parameters the timeline does not own survive", () => {
  const search = timelineSearch(base, "?ref=newsletter&focus=old-one");
  const params = parse(search);
  assert.equal(params.ref, "newsletter");
  assert.equal(params.focus, undefined, "a cleared selection must not linger");
});

test("edges are rounded to what the span can show, not to a fixed precision", () => {
  // Ten thousand years wide: whole years are plenty.
  assert.equal(roundEdge(-10_512.3456, 10_000), -10_512);
  // Four billion years wide: thousands of years are invisible.
  assert.equal(roundEdge(-4_499_998_050.7, 4_000_000_000), -4_500_000_000);
  // A month wide: fractions of a year are the whole picture.
  assert.equal(roundEdge(2026.123456789, 0.08), 2026.123457);
});

test("nonsense windows are ignored rather than trusted", () => {
  assert.equal(readWindow({ from: "abc", to: "10" }), null);
  assert.equal(readWindow({ from: "10", to: "5" }), null);
  assert.equal(readWindow({}), null);
});

test("an unknown scale falls back to linear", () => {
  assert.equal(readTimelineUrlState({ scale: "sideways" }).scale, "linear");
});
