import { test } from "node:test";
import assert from "node:assert/strict";

import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { compareImportance, derivedScore, importanceOf } from "./prominence";

let n = 0;
function record(overrides: Record<string, unknown> = {}): TimelineEventWithClaims {
  n += 1;
  const { claimCount = 1, sources = [] as (string | null)[], ...rest } = overrides as {
    claimCount?: number;
    sources?: (string | null)[];
  };
  return {
    id: `e${String(n).padStart(3, "0")}`,
    title: `Record ${n}`,
    summary: null,
    description: null,
    image_url: null,
    media: [],
    prominence: null,
    trackIds: [],
    claims: Array.from({ length: claimCount }, (_, i) => ({
      id: `c${n}-${i}`,
      start_year: -2600 + i,
      end_year: null,
      start_month: null,
      start_day: null,
      date_precision: "year",
      precision_decimals: null,
      is_approximate: false,
      source_id: sources[i] ?? null,
    })),
    ...rest,
  } as unknown as TimelineEventWithClaims;
}

test("a landmark outranks any unset record, however rich", () => {
  const landmark = record({ prominence: 1 });
  const rich = record({ image_url: "a", media: [{ url: "b" }, { url: "c" }], claimCount: 5, sources: ["s1", "s2", "s3", "s4", "s5"], summary: "yes" });
  assert.ok(importanceOf(landmark) > importanceOf(rich));
});

test("tiers order landmark > notable > unset > detail", () => {
  const order = [record({ prominence: 1 }), record({ prominence: 2 }), record(), record({ prominence: 3, image_url: "x", claimCount: 5 })];
  const ranked = [...order].reverse().sort(compareImportance);
  assert.deepEqual(ranked.map((e) => e.id), order.map((e) => e.id));
});

test("among unset records, what a record has decides", () => {
  const bare = record();
  const pictured = record({ image_url: "x" });
  const sourced = record({ claimCount: 3, sources: ["s1", "s2", "s3"] });
  assert.ok(derivedScore(pictured) > derivedScore(bare));
  assert.ok(derivedScore(sourced) > derivedScore(bare));
});

test("no single ingredient runs away with the score", () => {
  const forty = record({ media: Array.from({ length: 40 }, (_, i) => ({ url: `m${i}` })) });
  const four = record({ media: Array.from({ length: 4 }, (_, i) => ({ url: `m${i}` })) });
  assert.equal(derivedScore(forty), derivedScore(four));
});

test("the same records always rank in the same order", () => {
  const a = record();
  const b = record();
  assert.deepEqual([a, b].sort(compareImportance), [b, a].sort(compareImportance));
});
