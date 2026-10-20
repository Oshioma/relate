import type { HotelGuideDefinition } from "./types";
import { BOUTIQUE_GUIDE } from "@/lib/guides/boutique-hotels/content";
import { LUXURY_GUIDE } from "@/lib/guides/luxury-resorts/content";

// Every hotel guide the app can render, by slug. Adding a guide is a
// definition here plus an editorial_guides row (migration).
const HOTEL_GUIDES: HotelGuideDefinition[] = [BOUTIQUE_GUIDE, LUXURY_GUIDE];

export function hotelGuideFor(slug: string): HotelGuideDefinition | null {
  return HOTEL_GUIDES.find((g) => g.slug === slug) ?? null;
}

export function allHotelGuides(): HotelGuideDefinition[] {
  return HOTEL_GUIDES;
}
