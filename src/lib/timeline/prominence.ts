import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { claimInterval } from "./time";

// HOW IMPORTANT A RECORD IS, FOR SEMANTIC ZOOM.
//
// Zoomed out, the strip shows the most important records that fit and leaves
// the rest to cluster cards; zooming in makes room, and the next tier appears.
// This module is the "most important" half of that; the layout does the "that
// fit" half (layoutTimeline in layout.ts).
//
// Two sources, decided with the owner:
//
//   prominence — set by staff or a seed dataset: 1 landmark, 2 notable,
//                3 detail. A judgement the data cannot make: that the Great
//                Pyramid matters more than the fortieth dated find at Giza.
//   the score  — for everything left unset, which is most records: what the
//                record HAS. Pictures, independent dates, cited sources and a
//                written description are what make a record worth stopping on,
//                and they are also what a contributor spends effort on when a
//                record matters to them.
//
// An unset record ranks between notable and detail: staff marking something
// "detail" is a deliberate demotion, and should beat no decision at all.

export type Prominence = 1 | 2 | 3;

export const PROMINENCE_LABELS: Record<Prominence, string> = {
  1: "Landmark",
  2: "Notable",
  3: "Detail",
};

// Tier bases, far enough apart that no score can carry a record across one.
const TIER_BASE = { landmark: 3000, notable: 2000, unset: 1000, detail: 0 } as const;

/**
 * What a record has, as a number from 0 to about 20.
 *
 * Each ingredient is capped so no single one dominates: forty gallery pictures
 * do not make a record ten times as important as one with four.
 */
export function derivedScore(event: Pick<TimelineEventWithClaims, "image_url" | "media" | "claims" | "summary" | "description">): number {
  const pictures = (event.image_url ? 1 : 0) + (event.media?.length ?? 0);
  const sources = new Set(event.claims.map((claim) => claim.source_id).filter(Boolean)).size;
  const written = (event.summary?.trim() ? 1 : 0) + ((event.description?.trim().length ?? 0) > 200 ? 1 : 0);
  return (
    Math.min(pictures, 3) * 2 + // a picture is the strongest single sign
    Math.min(event.claims.length, 5) + // independent dates — and disputes worth reading
    Math.min(sources, 4) * 1.5 + // cited sources
    written * 1.5
  );
}

/** One number to rank by: higher is shown first. */
export function importanceOf(event: TimelineEventWithClaims): number {
  const base =
    event.prominence === 1
      ? TIER_BASE.landmark
      : event.prominence === 2
        ? TIER_BASE.notable
        : event.prominence === 3
          ? TIER_BASE.detail
          : TIER_BASE.unset;
  return base + derivedScore(event);
}

function earliest(event: TimelineEventWithClaims): number {
  let lo = Infinity;
  for (const claim of event.claims) {
    const interval = claimInterval(claim);
    if (interval && interval.lo < lo) lo = interval.lo;
  }
  return lo;
}

/**
 * Compare two records for semantic zoom: more important first, then earlier,
 * then by id — so the same data always reveals in the same order and nothing
 * flickers in and out as the reader pans.
 */
export function compareImportance(a: TimelineEventWithClaims, b: TimelineEventWithClaims): number {
  return importanceOf(b) - importanceOf(a) || earliest(a) - earliest(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}
