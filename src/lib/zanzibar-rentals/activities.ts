import { z } from "zod";
import type { BusinessWithStats } from "@/lib/data/businesses";

// Tours, boat trips and other activities from Zanzibar Rentals
// (www.zanzibarrentals.com), the Zanzibar Rooms app's marketplace, where hosts
// list their own. Its public feed (GET /api/public/activities, contract in the
// Zanzibar Rooms repo's docs/zanzibar-rentals-public-activities.md) is read
// here and mixed into Mzungu Zanzibar's directory as ordinary Activity
// listings, each card linking out to Zanzibar Rentals in a new window, so an
// activity a host adds there turns up here on its own: the fetch is cached
// for FEED_REVALIDATE seconds, no sync job needed. Taxis come from their own
// feed (taxis.ts) and car, scooter and bike hire is left out (it isn't an
// activity).
//
// The feed is someone else's server, so nothing from it is trusted: every item
// is validated on its own and a malformed one is dropped, links must point at
// Zanzibar Rentals itself, and any failure at all (disabled, timeout, 5xx, bad
// JSON, nothing left) comes back as null so nothing is added.
// This file is plain TypeScript (no Next imports) so the tests can run it.

export const DEFAULT_ACTIVITIES_FEED_URL = "https://www.zanzibarrentals.com/api/public/activities";
const LISTING_HOSTS = ["www.zanzibarrentals.com", "zanzibarrentals.com"];
// Hosts next.config.ts allows for next/image. Keep in step with images.remotePatterns.
const PHOTO_SOURCES = [{ host: "qkjojurwzkanrwfgaefv.supabase.co", path: "/storage/v1/" }];

// The one community that shows them: Mzungu Zanzibar.
export const ACTIVITIES_COMMUNITY = "mzunguzanzibar";
export const ACTIVITY_CATEGORY = "activity";
// The kinds of Zanzibar Rentals listing that count as activities here.
export const ACTIVITY_KINDS = ["tour", "boat", "service"] as const;

export const FEED_TIMEOUT_MS = 3000;
// Seconds. The feed itself is cached 10 minutes at the edge.
export const FEED_REVALIDATE = 15 * 60;
export const MAX_ACTIVITIES = 120;

export type ZanzibarRentalsActivity = {
  id: string;
  title: string;
  kind: (typeof ACTIVITY_KINDS)[number];
  host: string;
  area: string | null;
  price: number | null;
  currency: string;
  pricePer: "trip" | "day" | "hour" | "session" | "vehicle" | "group" | "person";
  duration: string | null;
  photoUrl: string | null;
  url: string;
  summary: string;
};

export function showsZanzibarRentalsActivities(communitySlug: string): boolean {
  return communitySlug === ACTIVITIES_COMMUNITY;
}

function httpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port ? url : null;
  } catch {
    return null;
  }
}

function clip(value: string, max: number): string {
  const s = value.trim().replace(/\s+/g, " ");
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

const itemSchema = z.object({
  id: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(200),
  kind: z.string(),
  area: z.string().nullish(),
  host: z.string().trim().min(1).max(200),
  price: z.number().finite().min(0).nullish(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  price_per: z.enum(["trip", "day", "hour", "session", "vehicle", "group", "person"]),
  duration: z.string().nullish(),
  photo_url: z.string().nullish(),
  url: z.string(),
  summary: z.string().nullish(),
});

function isActivityKind(kind: string): kind is ZanzibarRentalsActivity["kind"] {
  return (ACTIVITY_KINDS as readonly string[]).includes(kind);
}

function toActivity(raw: unknown): ZanzibarRentalsActivity | null {
  const parsed = itemSchema.safeParse(raw);
  if (!parsed.success) return null;
  const item = parsed.data;
  if (!isActivityKind(item.kind)) return null;

  // The whole card links out, so the link must be Zanzibar Rentals itself.
  const link = httpsUrl(item.url);
  if (!link || !LISTING_HOSTS.includes(link.hostname)) return null;

  const photo = item.photo_url ? httpsUrl(item.photo_url) : null;
  return {
    id: item.id,
    title: clip(item.title, 100),
    kind: item.kind,
    host: clip(item.host, 80),
    area: item.area?.trim() ? clip(item.area, 60) : null,
    price: item.price ?? null,
    currency: item.currency,
    pricePer: item.price_per,
    duration: item.duration?.trim() ? clip(item.duration, 40) : null,
    photoUrl: photo && PHOTO_SOURCES.some((p) => p.host === photo.hostname && photo.pathname.startsWith(p.path)) ? photo.href : null,
    url: link.href,
    summary: item.summary ? clip(item.summary, 160) : "",
  };
}

// The activities in a feed response, or null when the response isn't a
// version-1 feed or nothing in it survives validation.
export function parseActivitiesFeed(json: unknown, limit = MAX_ACTIVITIES): ZanzibarRentalsActivity[] | null {
  if (!json || typeof json !== "object") return null;
  const feed = json as { version?: unknown; activities?: unknown };
  if (feed.version !== 1 || !Array.isArray(feed.activities)) return null;
  const seen = new Set<string>();
  const activities: ZanzibarRentalsActivity[] = [];
  for (const raw of feed.activities) {
    const activity = toActivity(raw);
    if (!activity || seen.has(activity.id)) continue;
    seen.add(activity.id);
    activities.push(activity);
    if (activities.length >= limit) break;
  }
  return activities.length > 0 ? activities : null;
}

type Env = Record<string, string | undefined>;

// The kill switch: on unless ZANZIBAR_RENTALS_ACTIVITIES_ENABLED says otherwise.
export function activitiesEnabled(env: Env): boolean {
  const value = env.ZANZIBAR_RENTALS_ACTIVITIES_ENABLED?.trim().toLowerCase();
  return !value || !["0", "false", "off", "no"].includes(value);
}

export function activitiesFeedUrl(env: Env): string | null {
  const configured = env.ZANZIBAR_RENTALS_ACTIVITIES_FEED_URL?.trim();
  if (!configured) return DEFAULT_ACTIVITIES_FEED_URL;
  return httpsUrl(configured)?.href ?? null;
}

type FetchLike = (url: string, init: RequestInit & { next?: { revalidate?: number } }) => Promise<Response>;

// Every activity on Zanzibar Rentals, or null to add nothing. Never throws.
export async function getZanzibarRentalsActivities({
  env = process.env,
  fetchImpl = fetch,
  timeoutMs = FEED_TIMEOUT_MS,
  limit = MAX_ACTIVITIES,
}: { env?: Env; fetchImpl?: FetchLike; timeoutMs?: number; limit?: number } = {}): Promise<ZanzibarRentalsActivity[] | null> {
  if (!activitiesEnabled(env)) return null;
  const url = activitiesFeedUrl(env);
  if (!url) return null;
  try {
    const res = await fetchImpl(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
      next: { revalidate: FEED_REVALIDATE },
    });
    if (!res.ok) return null;
    return parseActivitiesFeed(await res.json(), limit);
  } catch {
    return null;
  }
}

// "$45 / person", "$120 / group", "$80 / boat", "Price on request".
export function formatActivityPrice(activity: Pick<ZanzibarRentalsActivity, "price" | "currency" | "pricePer" | "kind">): string {
  if (activity.price === null) return "Price on request";
  let amount: string;
  try {
    amount = new Intl.NumberFormat("en-US", { style: "currency", currency: activity.currency, maximumFractionDigits: 0 }).format(activity.price);
  } catch {
    amount = `${activity.currency} ${Math.round(activity.price)}`;
  }
  const per = activity.pricePer === "vehicle" ? (activity.kind === "boat" ? "boat" : "vehicle") : activity.pricePer;
  return `${amount} / ${per}`;
}

// An activity as an ordinary card in a directory's Activities grid, so it
// sorts, filters and groups by area with the directory's own listings. It has
// no row of its own: `partner` sends the card out to Zanzibar Rentals instead
// of to a listing page, and there is nothing to save or review here.
export function activityDirectoryListing(
  activity: ZanzibarRentalsActivity,
  space: { spaceId: string; communityId: string },
  now: string = new Date(0).toISOString()
): BusinessWithStats {
  const details = [activity.host, formatActivityPrice(activity), activity.duration].filter(Boolean).join(" · ");
  return {
    business: {
      id: `zanzibar-rentals-${activity.id}`,
      space_id: space.spaceId,
      community_id: space.communityId,
      created_by: "",
      name: activity.title,
      slug: null,
      category: ACTIVITY_CATEGORY,
      is_local: false,
      description: activity.summary ? `${details}. ${activity.summary}` : details,
      website: activity.url,
      phone: null,
      address: null,
      opening_hours: null,
      lat: null,
      lng: null,
      location_label: activity.area,
      image_url: activity.photoUrl,
      image_position: null,
      claimed_by: null,
      opening_hours_structured: null,
      google_place_id: null,
      google_rating: null,
      google_review_count: null,
      google_reviews: null,
      google_maps_url: null,
      google_synced_at: null,
      place_id: null,
      verified: false,
      featured: false,
      created_at: now,
      updated_at: now,
    },
    avgRating: null,
    ratingCount: 0,
    imageCount: activity.photoUrl ? 1 : 0,
    saved: false,
    partner: { url: activity.url, label: "Book on Zanzibar Rentals" },
  };
}
