import type { PlaceGuideDefinition } from "./types";
import { PICTURESQUE_GUIDE } from "@/lib/guides/picturesque/content";

// Every place guide the app can render, by slug. Adding a guide is a
// definition here plus an editorial_guides row (migration).
const PLACE_GUIDES: PlaceGuideDefinition[] = [PICTURESQUE_GUIDE];

export function placeGuideFor(slug: string): PlaceGuideDefinition | null {
  return PLACE_GUIDES.find((g) => g.slug === slug) ?? null;
}
