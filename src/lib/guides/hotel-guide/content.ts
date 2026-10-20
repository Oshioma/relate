import { z } from "zod";
import { cardThumb, photoSchema } from "@/lib/guides/where-to-stay/content";
import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import type { Hotel, HotelGuideDefinition, HotelGuideOverrides } from "./types";

// Built-in guide content + the admins' overrides = what the page shows. Same
// rules as the Where to Stay guide: overrides are validated on the way in and
// on the way out, and anything that no longer parses is ignored.

const text = (max: number) => z.string().trim().max(max);

export const hotelOverridesSchema = z.object({
  heroPhoto: photoSchema.nullish(),
  editorsNote: text(1000).nullish(),
  hotelPhotos: z.record(z.string(), z.unknown()).optional(),
});

export const hotelPhotosSchema = z.array(photoSchema).max(8);

export function guideHotels(def: HotelGuideDefinition): Hotel[] {
  return [...def.featured, ...def.more];
}

export function guideHotel(def: HotelGuideDefinition, key: string): Hotel | undefined {
  return guideHotels(def).find((h) => h.key === key);
}

// A hotel whose stored photo list no longer validates keeps its built-in
// photos, rather than taking the other hotels' photos down with it.
export function parseHotelOverrides(def: HotelGuideDefinition, raw: unknown): HotelGuideOverrides {
  const top = hotelOverridesSchema.safeParse(raw ?? {});
  if (!top.success) return {};
  const hotelPhotos: Record<string, GuidePhoto[]> = {};
  for (const [key, value] of Object.entries(top.data.hotelPhotos ?? {})) {
    if (!guideHotel(def, key)) continue;
    const parsed = hotelPhotosSchema.safeParse(value);
    if (parsed.success) hotelPhotos[key] = parsed.data;
  }
  return { heroPhoto: top.data.heroPhoto ?? null, editorsNote: top.data.editorsNote ?? null, hotelPhotos };
}

export type ResolvedHotelGuide = {
  featured: Hotel[];
  more: Hotel[];
  heroPhoto: GuidePhoto | null;
  editorsNote: string | null;
};

export function resolveHotelGuide(def: HotelGuideDefinition, overrides: HotelGuideOverrides): ResolvedHotelGuide {
  const apply = (h: Hotel): Hotel => {
    const photos = overrides.hotelPhotos?.[h.key];
    return photos ? { ...h, photos } : h;
  };
  return {
    featured: def.featured.map(apply),
    more: def.more.map(apply),
    heroPhoto: overrides.heroPhoto ?? def.heroPhoto,
    editorsNote: overrides.editorsNote ?? null,
  };
}

export function loadHotelGuide(def: HotelGuideDefinition, content: unknown): ResolvedHotelGuide {
  return resolveHotelGuide(def, parseHotelOverrides(def, content));
}

export function hotelGuideCardImage(def: HotelGuideDefinition, content: unknown): string | null {
  return cardThumb(loadHotelGuide(def, content).heroPhoto);
}

// Distinct photographs on the page (an area photo can serve two hotels).
export function photoCount(guide: ResolvedHotelGuide): number {
  const all = [guide.heroPhoto, ...[...guide.featured, ...guide.more].flatMap((h) => [...h.photos, ...h.areaPhotos])];
  return new Set(all.filter((p) => p !== null).map((p) => p.src)).size;
}
