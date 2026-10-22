import { cardThumb } from "@/lib/guides/where-to-stay/content";
import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import { hotelOverridesSchema, hotelPhotosSchema } from "@/lib/guides/hotel-guide/content";
import type { Place, PlaceGuideDefinition, PlaceGuideOverrides } from "./types";

// Built-in guide content + the admins' overrides = what the page shows. The
// overrides share the hotel guides' schema (hero, editor's note, photos per
// entry), validated on the way in and out; anything that no longer parses is
// ignored rather than taking the page down.

export function guidePlace(def: PlaceGuideDefinition, key: string): Place | undefined {
  return def.places.find((p) => p.key === key);
}

// A place whose stored photo list no longer validates keeps its built-in
// photos, rather than taking the other places' photos down with it.
export function parsePlaceOverrides(def: PlaceGuideDefinition, raw: unknown): PlaceGuideOverrides {
  const top = hotelOverridesSchema.safeParse(raw ?? {});
  if (!top.success) return {};
  const hotelPhotos: Record<string, GuidePhoto[]> = {};
  for (const [key, value] of Object.entries(top.data.hotelPhotos ?? {})) {
    if (!guidePlace(def, key)) continue;
    const parsed = hotelPhotosSchema.safeParse(value);
    if (parsed.success) hotelPhotos[key] = parsed.data;
  }
  return { heroPhoto: top.data.heroPhoto ?? null, editorsNote: top.data.editorsNote ?? null, hotelPhotos };
}

export type ResolvedPlaceGuide = {
  places: Place[];
  heroPhoto: GuidePhoto | null;
  editorsNote: string | null;
};

export function resolvePlaceGuide(def: PlaceGuideDefinition, overrides: PlaceGuideOverrides): ResolvedPlaceGuide {
  return {
    places: def.places.map((p) => {
      const photos = overrides.hotelPhotos?.[p.key];
      return photos ? { ...p, photos } : p;
    }),
    heroPhoto: overrides.heroPhoto ?? def.heroPhoto,
    editorsNote: overrides.editorsNote ?? null,
  };
}

export function loadPlaceGuide(def: PlaceGuideDefinition, content: unknown): ResolvedPlaceGuide {
  return resolvePlaceGuide(def, parsePlaceOverrides(def, content));
}

export function placeGuideCardImage(def: PlaceGuideDefinition, content: unknown): string | null {
  return cardThumb(loadPlaceGuide(def, content).heroPhoto);
}

export function placePhotoCount(guide: ResolvedPlaceGuide): number {
  const all = [guide.heroPhoto, ...guide.places.flatMap((p) => p.photos)];
  return new Set(all.filter((p) => p !== null).map((p) => p.src)).size;
}
