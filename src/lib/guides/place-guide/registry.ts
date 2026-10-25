import type { PlaceGuideDefinition } from "./types";
import { PICTURESQUE_GUIDE } from "@/lib/guides/picturesque/content";
import { RESTAURANTS_GUIDE } from "@/lib/guides/restaurants/content";
import { BEACH_BARS_GUIDE } from "@/lib/guides/beach-bars/content";
import { ADVENTURE_GUIDE } from "@/lib/guides/adventure/content";
import { GETTING_AROUND_GUIDE } from "@/lib/guides/getting-around/content";

// Every place guide the app can render, by slug. Adding a guide is a
// definition here plus an editorial_guides row (migration).
const PLACE_GUIDES: PlaceGuideDefinition[] = [PICTURESQUE_GUIDE, RESTAURANTS_GUIDE, BEACH_BARS_GUIDE, ADVENTURE_GUIDE, GETTING_AROUND_GUIDE];

export function placeGuideFor(slug: string): PlaceGuideDefinition | null {
  return PLACE_GUIDES.find((g) => g.slug === slug) ?? null;
}
