import { placeGuideFor } from "@/lib/guides/place-guide/registry";
import type { PlaceKind } from "@/lib/guides/place-guide/types";

// Venues the community's own guides recommend (beach bars, restaurants),
// handed to event discovery so it checks their pages for live music, DJ
// nights and parties as well as the general listings sites.

export type GuideVenue = { name: string; area: string; website: string | null };

// Places that host events; beaches and viewpoints don't.
const EVENT_KINDS = new Set<PlaceKind>(["bar", "restaurant"]);
// Keeps the discovery prompt short; bars first, as they hold most events.
export const MAX_GUIDE_VENUES = 30;

export function guideVenues(guideSlugs: string[], limit = MAX_GUIDE_VENUES): GuideVenue[] {
  const places = guideSlugs
    .map((slug) => placeGuideFor(slug))
    .flatMap((def) => def?.places ?? [])
    .filter((p) => EVENT_KINDS.has(p.kind))
    .sort((a, b) => Number(b.kind === "bar") - Number(a.kind === "bar"));

  const seen = new Set<string>();
  const venues: GuideVenue[] = [];
  for (const p of places) {
    // The same place can be in two guides (a beach bar that's also a restaurant).
    if (seen.has(p.key)) continue;
    seen.add(p.key);
    venues.push({ name: p.name, area: p.area, website: p.website });
    if (venues.length === limit) break;
  }
  return venues;
}
