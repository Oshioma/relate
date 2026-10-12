import { z } from "zod";
import type { Destination, DestinationOverride, GuideOverrides, GuidePhoto } from "./types";
import { DEFAULT_DESTINATIONS } from "./destinations";
import { GUIDE_HERO_PHOTO } from "./photos";
import { ALL_TAGS } from "./labels";

// Built-in content + the admins' overrides = what the page shows.
//
// Overrides live in editorial_guides.content as JSON. They are validated here
// on the way in (the admin save action) AND on the way out (rendering), so a
// malformed or out-of-date value can never break the page: anything that
// doesn't parse is ignored and the built-in copy shows instead.

export const WHERE_TO_STAY_SLUG = "where-to-stay-in-zanzibar";
export const WHERE_TO_STAY_TITLE = "Where to Stay in Zanzibar";

const url = z.string().trim().url().max(2000);
const optionalUrl = url.nullish().or(z.literal("").transform(() => null));
const text = (max: number) => z.string().trim().max(max);

export const photoSchema = z.object({
  src: url,
  alt: text(300).min(1),
  caption: text(500),
  credit: text(200),
  licence: text(100),
  licenceUrl: optionalUrl.optional(),
  sourceUrl: url,
  identificationStatus: z.enum(["secure", "unverified"]),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

const listingRefSchema = z
  .object({ kind: z.enum(["business", "stay"]), slug: text(200).min(1) })
  .nullish();

export const restaurantSchema = z.object({
  name: text(150).min(1),
  listing: listingRefSchema,
  cuisine: text(200),
  price: z.enum(["$", "$$", "$$$"]),
  why: text(800),
  bestFor: z.array(text(60)).max(8),
  area: text(200),
  nearby: text(200).nullish(),
  website: optionalUrl.optional(),
  social: optionalUrl.optional(),
  mapsUrl: optionalUrl.optional(),
  disclosure: text(300).nullish(),
  verificationNote: text(300).nullish(),
});

export const staySchema = z.object({
  name: text(150).min(1),
  listing: listingRefSchema,
  type: text(80),
  price: z.enum(["$", "$$", "$$$"]),
  suits: text(300),
  why: text(800),
  position: z.enum(["beachfront", "cliff", "short-walk", "inland", "unknown"]),
  positionNote: text(300).nullish(),
  website: optionalUrl.optional(),
  disclosure: text(300).nullish(),
  verificationNote: text(300).nullish(),
});

export const destinationOverrideSchema = z
  .object({
    name: text(80).min(1),
    rank: z.number().int().min(1).max(99),
    category: text(150),
    coast: text(80),
    summary: text(400),
    bestFor: z.array(z.enum(ALL_TAGS as [string, ...string[]])).max(12),
    panel: z.object({
      swimming: z.enum(["excellent", "high-tide", "tide-dependent", "limited"]),
      tides: z.enum(["low", "moderate", "strong"]),
      atmosphere: z.enum(["peaceful", "moderate", "lively"]),
      nightlife: z.enum(["low", "medium", "high"]),
      restaurants: z.enum(["limited", "moderate", "excellent"]),
      budget: z.enum(["$", "$$", "$$$"]),
      accommodation: z.enum(["limited", "good", "wide"]),
      nights: text(40),
    }).partial(),
    intro: text(2000),
    whyPeopleLoveIt: text(2000),
    whatMakesItDifferent: text(2000),
    whoShouldStay: text(1500),
    whoMightNot: text(1500),
    misunderstandings: text(2000),
    beach: text(1500),
    eatingOut: text(1500),
    notes: z.array(z.object({ title: text(120).min(1), body: text(2000) })).max(8),
    tradeOff: text(300),
    photos: z.array(photoSchema).max(12),
    restaurants: z.array(restaurantSchema).max(6),
    stays: z.array(staySchema).max(8),
    editorialNote: text(1000).nullish(),
  })
  .partial();

export const overridesSchema = z.object({
  destinations: z.record(z.string(), z.unknown()).optional(),
  heroPhoto: photoSchema.nullish(),
  editorsNote: text(1000).nullish(),
});

// Parse stored overrides leniently: a destination whose override no longer
// validates is dropped on its own, rather than taking the rest down with it.
export function parseOverrides(raw: unknown): GuideOverrides {
  const top = overridesSchema.safeParse(raw ?? {});
  if (!top.success) return {};
  const destinations: Record<string, DestinationOverride> = {};
  for (const [key, value] of Object.entries(top.data.destinations ?? {})) {
    const parsed = destinationOverrideSchema.safeParse(value);
    if (parsed.success) destinations[key] = parsed.data as DestinationOverride;
  }
  return { destinations, heroPhoto: top.data.heroPhoto ?? null, editorsNote: top.data.editorsNote ?? null };
}

export type ResolvedGuide = {
  destinations: Destination[];
  heroPhoto: GuidePhoto | null;
  editorsNote: string | null;
};

export function resolveGuideContent(overrides: GuideOverrides): ResolvedGuide {
  const destinations = DEFAULT_DESTINATIONS.map((d) => {
    const o = overrides.destinations?.[d.key];
    if (!o) return d;
    return { ...d, ...o, panel: { ...d.panel, ...(o.panel ?? {}) }, key: d.key };
  }).sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
  return {
    destinations,
    heroPhoto: overrides.heroPhoto ?? GUIDE_HERO_PHOTO ?? destinations[0]?.photos[0] ?? null,
    editorsNote: overrides.editorsNote ?? null,
  };
}

export function defaultDestination(key: string): Destination | undefined {
  return DEFAULT_DESTINATIONS.find((d) => d.key === key);
}
