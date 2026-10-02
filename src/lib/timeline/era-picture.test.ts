import { test } from "node:test";
import assert from "node:assert/strict";

import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { nearestPictured, pictureOf } from "./era-picture";

let n = 0;
function record(start: number, overrides: Partial<TimelineEventWithClaims> & { end?: number } = {}): TimelineEventWithClaims {
  n += 1;
  const { end = null, ...rest } = overrides;
  return {
    id: `e${n}`,
    slug: `e${n}`,
    title: `Record ${n}`,
    image_url: `https://example.org/${n}.jpg`,
    media: [],
    prominence: null,
    claims: [
      {
        id: `c${n}`,
        start_year: start,
        end_year: end,
        start_month: null,
        start_day: null,
        end_month: null,
        end_day: null,
        date_precision: "year",
        precision_decimals: null,
        is_approximate: false,
      },
    ],
    trackIds: [],
    ...rest,
  } as unknown as TimelineEventWithClaims;
}

const view = { from: -5471, to: 2030 };

test("the picture nearest the middle date is the one shown", () => {
  const far = record(-5000);
  const near = record(-1700);
  const other = record(500);
  assert.equal(nearestPictured([far, near, other], -1721, view)?.event.id, near.id);
});

test("a record whose dates span the middle date beats one further off", () => {
  const spanning = record(-1800, { end: -1600 });
  const further = record(-1300);
  assert.equal(nearestPictured([further, spanning], -1721, view)?.event.id, spanning.id);
});

test("a long range spanning the whole view gives way to a dated record near the middle", () => {
  // "25,000 BCE – 100 CE" spans every middle date for millennia; counted as
  // distance zero it held the thumbnail at every step of a scroll.
  const vague = record(-25_000, { end: 100 });
  const specific = record(-1400);
  assert.equal(nearestPictured([vague, specific], -1721, view)?.event.id, specific.id);
  assert.equal(nearestPictured([vague], -1721, view)?.event.id, vague.id, "with nothing nearer, the range still shows");
});

test("scrolling moves the middle date, and the picture changes with it", () => {
  const events = [record(-4000), record(-1700), record(1200)];
  const shown = [-4100, -1721, 1100].map((date) => nearestPictured(events, date, view)?.event.id);
  assert.deepEqual(shown, events.map((event) => event.id));
});

test("records without a picture, or outside the view, are passed over", () => {
  const unpictured = record(-1721, { image_url: null });
  const offScreen = record(-9000);
  const pictured = record(1500);
  assert.equal(nearestPictured([unpictured, offScreen, pictured], -1721, view)?.event.id, pictured.id);
  assert.equal(nearestPictured([unpictured, offScreen], -1721, view), null, "nothing pictured on screen means no thumbnail");
});

test("a picture that failed to load gives way to the next nearest", () => {
  const broken = record(-1720);
  const next = record(-1500);
  assert.equal(nearestPictured([broken, next], -1721, view, new Set([broken.image_url!]))?.event.id, next.id);
});

test("at the same distance, the more important record wins", () => {
  const minor = record(-1721, { prominence: 3 });
  const landmark = record(-1721, { prominence: 1 });
  assert.equal(nearestPictured([minor, landmark], -1721, view)?.event.id, landmark.id);
});

test("an UNVERIFIED caption is carried through so the thumbnail can say so", () => {
  const event = record(0, { image_url: null, media: [{ url: "https://example.org/x.jpg", caption: "UNVERIFIED — a later engraving" }] });
  assert.deepEqual(pictureOf(event), { url: "https://example.org/x.jpg", caption: "UNVERIFIED — a later engraving", unverified: true });
});
