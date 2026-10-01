import { test } from "node:test";
import assert from "node:assert/strict";

import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { clusterSpanLabel, leadPicture, rankClusterEvents } from "./cluster-lead";

let n = 0;
function record(overrides: Partial<TimelineEventWithClaims> & { start?: number; claimCount?: number } = {}): TimelineEventWithClaims {
  n += 1;
  const { start = -2600, claimCount = 1, ...rest } = overrides;
  const claims = Array.from({ length: claimCount }, (_, i) => ({
    id: `c${n}-${i}`,
    start_year: start + i,
    end_year: null,
    start_month: null,
    start_day: null,
    end_month: null,
    end_day: null,
    date_precision: "year",
    precision_decimals: null,
    is_approximate: false,
  }));
  return {
    id: `e${n}`,
    slug: `e${n}`,
    title: `Record ${n}`,
    image_url: null,
    media: [],
    claims,
    trackIds: [],
    ...rest,
  } as unknown as TimelineEventWithClaims;
}

test("a record the reader has not opened leads, even over one with a picture", () => {
  const seenWithPicture = record({ image_url: "https://example.org/a.jpg" });
  const unseenPlain = record();
  const ranked = rankClusterEvents([seenWithPicture, unseenPlain], new Set([seenWithPicture.id]));
  assert.equal(ranked[0].id, unseenPlain.id);
});

test("among unseen records, one with a picture leads", () => {
  const plain = record({ claimCount: 4 });
  const pictured = record({ media: [{ url: "https://example.org/b.jpg" }] });
  assert.equal(rankClusterEvents([plain, pictured], new Set())[0].id, pictured.id);
});

test("when everything has been seen, pictures still decide", () => {
  const plain = record();
  const pictured = record({ image_url: "https://example.org/c.jpg" });
  const ranked = rankClusterEvents([plain, pictured], new Set([plain.id, pictured.id]));
  assert.equal(ranked[0].id, pictured.id);
});

test("a picture that failed to load does not count", () => {
  const broken = record({ image_url: "https://example.org/broken.jpg", start: -3000 });
  const plain = record({ claimCount: 2 });
  const ranked = rankClusterEvents([broken, plain], new Set(), new Set(["https://example.org/broken.jpg"]));
  assert.equal(ranked[0].id, plain.id);
});

test("ties fall to more date claims, then the earliest, so the lead never flickers", () => {
  const fewer = record({ claimCount: 1, start: -5000 });
  const more = record({ claimCount: 3, start: -1000 });
  assert.equal(rankClusterEvents([fewer, more], new Set())[0].id, more.id);
  const later = record({ start: -1000 });
  const earlier = record({ start: -2000 });
  assert.equal(rankClusterEvents([later, earlier], new Set())[0].id, earlier.id);
  // Same input in either order gives the same answer.
  assert.deepEqual(
    rankClusterEvents([later, earlier], new Set()).map((e) => e.id),
    rankClusterEvents([earlier, later], new Set()).map((e) => e.id)
  );
});

test("leadPicture prefers the cover image, then the first gallery picture", () => {
  assert.equal(leadPicture({ image_url: "a", media: [{ url: "b" }] }), "a");
  assert.equal(leadPicture({ image_url: null, media: [{ url: "b" }] }), "b");
  assert.equal(leadPicture({ image_url: null, media: [] }), null);
});

test("the span label covers every record's claims and names the era once", () => {
  const a = record({ start: -2599 }); // 2600 BCE
  const b = record({ start: -2499 }); // 2500 BCE
  assert.equal(clusterSpanLabel([a, b]), "2600 – 2500 BCE");
  assert.equal(clusterSpanLabel([a]), "2600 BCE");
  assert.equal(clusterSpanLabel([record({ claimCount: 0 })]), null);
});
