import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { claimInterval, formatYear } from "./time";

// WHICH RECORD LEADS A CLUSTER CARD.
//
// A card names one record and counts the rest, so the one it names is the
// whole of what the card says. The order, decided with the people who use it:
//
//   1. one this reader has NOT opened yet — the card should be a way of
//      finding what is new to you, not the same record every visit;
//   2. then one with a picture — a card with a thumbnail is the one people
//      look at, and a record with a picture usually has more to show;
//   3. then the one with the most date claims — the record most worth reading
//      when sources disagree about it;
//   4. then the earliest, then by title, so the choice never flickers between
//      renders.
//
// For a signed-out visitor nothing is "seen", so rule 1 is a tie and the
// pictures decide.

/** The picture a card would show for this record, or null. */
export function leadPicture(event: Pick<TimelineEventWithClaims, "image_url" | "media">): string | null {
  return event.image_url || event.media?.[0]?.url || null;
}

function earliest(event: TimelineEventWithClaims): number {
  let lo = Infinity;
  for (const claim of event.claims) {
    const interval = claimInterval(claim);
    if (interval && interval.lo < lo) lo = interval.lo;
  }
  return lo;
}

/** The cluster's records in the order they should be offered, leader first. */
export function rankClusterEvents(
  events: TimelineEventWithClaims[],
  seen: ReadonlySet<string>,
  failedPictures: ReadonlySet<string> = new Set()
): TimelineEventWithClaims[] {
  const hasPicture = (event: TimelineEventWithClaims) => {
    const picture = leadPicture(event);
    // A picture that has already failed to load is no picture.
    return picture !== null && !failedPictures.has(picture);
  };
  return [...events].sort(
    (a, b) =>
      Number(seen.has(a.id)) - Number(seen.has(b.id)) ||
      Number(hasPicture(b)) - Number(hasPicture(a)) ||
      b.claims.length - a.claims.length ||
      earliest(a) - earliest(b) ||
      a.title.localeCompare(b.title)
  );
}

/**
 * The stretch of time a cluster covers, as the card writes it: "2600 – 2500 BCE",
 * or one date when every record shares it. Taken from the records' own claims
 * rather than the cluster's zoom window, which is padded and would misstate it.
 */
export function clusterSpanLabel(events: TimelineEventWithClaims[]): string | null {
  let lo = Infinity;
  let hi = -Infinity;
  for (const event of events) {
    for (const claim of event.claims) {
      const interval = claimInterval(claim);
      if (!interval) continue;
      // A range is stated by its ends. A single date's interval runs to the
      // start of the NEXT year (or straddles a rounded measurement), so its own
      // date is its middle: the year 2600 BCE is [−2599, −2598], and taking the
      // upper edge would write 2599 BCE.
      const mid = (interval.lo + interval.hi) / 2;
      lo = Math.min(lo, interval.kind === "range" ? interval.lo : mid);
      hi = Math.max(hi, interval.kind === "range" ? interval.hi : mid);
    }
  }
  if (!Number.isFinite(lo)) return null;
  const from = formatYear(Math.floor(lo), { compact: true });
  const to = formatYear(Math.floor(hi), { compact: true });
  if (from === to) return from;
  // "2600 BCE – 2500 BCE" says the era twice; say it once, at the end.
  const era = (text: string) => text.match(/ (BCE|CE)$/)?.[1] ?? null;
  if (era(from) && era(from) === era(to)) return `${from.replace(/ (BCE|CE)$/, "")} – ${to}`;
  return `${from} – ${to}`;
}
