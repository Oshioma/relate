import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { leadPicture } from "./cluster-lead";
import { compareImportance } from "./prominence";
import { claimInterval, type TimeWindow } from "./time";

// ONE PICTURE OF THE TIME YOU ARE LOOKING AT.
//
// The ruler above the strip names the middle date of the view. Beside it sits a
// single thumbnail: the record with a picture CLOSEST to that date, among the
// records currently shown (so filters apply). Scrolling moves the middle date,
// so the picture changes as you travel — a glimpse of each period on the way
// through, without having to stop and open anything.
//
// Only records inside the view qualify. A picture from four thousand years
// away is not a picture of "that time period", and an empty slot says honestly
// that nothing pictured is on screen.

export type EraPicture = {
  url: string;
  /** Doubles as the alt text. May begin "UNVERIFIED —" (see AGENTS.md). */
  caption: string | null;
  unverified: boolean;
};

/** The picture a record leads with — the same one its card on the strip shows — with its caption. */
export function pictureOf(event: TimelineEventWithClaims): EraPicture | null {
  const url = leadPicture(event);
  if (!url) return null;
  const caption = (event.media ?? []).find((item) => item.url === url)?.caption ?? null;
  return { url, caption, unverified: /^UNVERIFIED\b/i.test(caption ?? "") };
}

// How much a long date range is held back, as a share of its length (capped at
// the view's width). A record dated "25,000 BCE – 100 CE" spans every middle
// date for twenty-five thousand years; counted as distance zero it won the
// thumbnail at every step and the picture stopped changing. Held back by a
// quarter of its length, it still shows when nothing more specific is near,
// but a single-date record close to the middle wins.
const RANGE_VAGUENESS = 0.25;

/**
 * How far a record is from `date`, for choosing the thumbnail: the gap to its
 * nearest claim (zero when a claim's range spans the date), plus a share of
 * that range's length, so the more specific record wins.
 */
function distanceTo(event: TimelineEventWithClaims, date: number, view: TimeWindow): number | null {
  const viewSpan = view.to - view.from;
  let best: number | null = null;
  for (const claim of event.claims) {
    const interval = claimInterval(claim);
    if (!interval) continue;
    // Off screen entirely: not part of the period being looked at.
    if (interval.hi < view.from || interval.lo > view.to) continue;
    const gap = date < interval.lo ? interval.lo - date : date > interval.hi ? date - interval.hi : 0;
    const distance = gap + RANGE_VAGUENESS * Math.min(interval.hi - interval.lo, viewSpan);
    if (best === null || distance < best) best = distance;
  }
  return best;
}

/**
 * The pictured record nearest the middle date `date`, among those inside
 * `view`. Ties go to the more important record (prominence.ts), so a landmark
 * beats a minor find at the same distance. Pictures in `failed` — addresses
 * that would not load — are passed over, so a broken host never leaves an
 * empty frame.
 */
export function nearestPictured(
  events: TimelineEventWithClaims[],
  date: number,
  view: TimeWindow,
  failed: ReadonlySet<string> = new Set()
): { event: TimelineEventWithClaims; picture: EraPicture } | null {
  let best: { event: TimelineEventWithClaims; picture: EraPicture; distance: number } | null = null;
  for (const event of events) {
    const picture = pictureOf(event);
    if (!picture || failed.has(picture.url)) continue;
    const distance = distanceTo(event, date, view);
    if (distance === null) continue;
    if (!best || distance < best.distance || (distance === best.distance && compareImportance(event, best.event) < 0)) {
      best = { event, picture, distance };
    }
  }
  return best ? { event: best.event, picture: best.picture } : null;
}
