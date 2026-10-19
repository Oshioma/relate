import { z } from "zod";
import { cardThumb, photoSchema } from "@/lib/guides/where-to-stay/content";
import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import type { BoutiqueOverrides, Hotel } from "./types";
import { FEATURED_HOTELS, MORE_GEMS } from "./hotels";
import { BOUTIQUE_HERO_PHOTO } from "./photos";

// Built-in content + the admins' overrides = what the page shows. Same rules
// as the Where to Stay guide: overrides are validated on the way in and on the
// way out, and anything that no longer parses is ignored.

export const BOUTIQUE_HOTELS_SLUG = "best-boutique-hotels-zanzibar";
export const BOUTIQUE_HOTELS_TITLE = "Zanzibar's Best Boutique Hotels & Hidden Gems";
export const BOUTIQUE_HOTELS_SUBTITLE = "Beautiful places to stay, from romantic beachfront hideaways to extraordinary private villas.";
export const BOUTIQUE_HOTELS_SEO_TITLE = "Best Boutique Hotels in Zanzibar | Hidden Gems & Luxury Stays";
export const BOUTIQUE_HOTELS_DESCRIPTION =
  "Discover Zanzibar's best boutique hotels, romantic beachfront hideaways, private villas and hidden gems. Independent recommendations and practical local advice.";

const text = (max: number) => z.string().trim().max(max);

export const boutiqueOverridesSchema = z.object({
  heroPhoto: photoSchema.nullish(),
  editorsNote: text(1000).nullish(),
  hotelPhotos: z.record(z.string(), z.unknown()).optional(),
});

export const hotelPhotosSchema = z.array(photoSchema).max(8);

export const ALL_HOTELS: Hotel[] = [...FEATURED_HOTELS, ...MORE_GEMS];

export function defaultHotel(key: string): Hotel | undefined {
  return ALL_HOTELS.find((h) => h.key === key);
}

// A hotel whose stored photo list no longer validates keeps its built-in
// photos, rather than taking the other hotels' photos down with it.
export function parseBoutiqueOverrides(raw: unknown): BoutiqueOverrides {
  const top = boutiqueOverridesSchema.safeParse(raw ?? {});
  if (!top.success) return {};
  const hotelPhotos: Record<string, GuidePhoto[]> = {};
  for (const [key, value] of Object.entries(top.data.hotelPhotos ?? {})) {
    if (!defaultHotel(key)) continue;
    const parsed = hotelPhotosSchema.safeParse(value);
    if (parsed.success) hotelPhotos[key] = parsed.data;
  }
  return { heroPhoto: top.data.heroPhoto ?? null, editorsNote: top.data.editorsNote ?? null, hotelPhotos };
}

export type ResolvedBoutiqueGuide = {
  featured: Hotel[];
  gems: Hotel[];
  heroPhoto: GuidePhoto | null;
  editorsNote: string | null;
};

export function resolveBoutiqueContent(overrides: BoutiqueOverrides): ResolvedBoutiqueGuide {
  const apply = (h: Hotel): Hotel => {
    const photos = overrides.hotelPhotos?.[h.key];
    return photos ? { ...h, photos } : h;
  };
  return {
    featured: FEATURED_HOTELS.map(apply),
    gems: MORE_GEMS.map(apply),
    heroPhoto: overrides.heroPhoto ?? BOUTIQUE_HERO_PHOTO,
    editorsNote: overrides.editorsNote ?? null,
  };
}

export function boutiqueCardImage(content: unknown): string | null {
  return cardThumb(resolveBoutiqueContent(parseBoutiqueOverrides(content)).heroPhoto);
}

// Distinct photographs on the page (an area photo can serve two hotels).
export function photoCount(guide: ResolvedBoutiqueGuide): number {
  const all = [guide.heroPhoto, ...[...guide.featured, ...guide.gems].flatMap((h) => [...h.photos, ...h.areaPhotos])];
  return new Set(all.filter((p) => p !== null).map((p) => p.src)).size;
}
