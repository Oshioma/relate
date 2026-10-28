import { z } from "zod";
import type { BusinessWithStats } from "@/lib/data/businesses";

// Taxi routes from Zanzibar Rentals (www.zanzibarrentals.com), the Zanzibar
// Rooms app's marketplace, where hosts list their own taxis. Its public feed
// (GET /api/public/taxis, contract in the Zanzibar Rooms repo's
// docs/zanzibar-rentals-public-taxis.md) is read here and shown on Mzungu
// Zanzibar under the directory's Taxi category and the Getting Around guide's
// drivers (mixed into the directory as ordinary listings), so a taxi a host
// adds there turns up here on its own: the fetch is
// cached for FEED_REVALIDATE seconds, no sync job needed.
//
// The feed is someone else's server, so nothing from it is trusted: every item
// is validated on its own and a malformed one is dropped, links must point at
// Zanzibar Rentals itself, and any failure at all (disabled, timeout, 5xx, bad
// JSON, nothing left) comes back as null so the section simply doesn't render.
// This file is plain TypeScript (no Next imports) so the tests can run it.

export const DEFAULT_TAXIS_FEED_URL = "https://www.zanzibarrentals.com/api/public/taxis";
// Where a driver signs up to list their own taxi routes.
export const LIST_YOUR_TAXI_URL = "https://www.zanzibarrentals.com/host/signup?type=taxi&utm_source=mzunguzanzibar&utm_medium=referral";
const LISTING_HOSTS = ["www.zanzibarrentals.com", "zanzibarrentals.com"];
// Hosts next.config.ts allows for next/image. Keep in step with images.remotePatterns.
const PHOTO_SOURCES = [{ host: "qkjojurwzkanrwfgaefv.supabase.co", path: "/storage/v1/" }];

// The one community that shows them: Mzungu Zanzibar.
export const TAXIS_COMMUNITY = "mzunguzanzibar";
export const TAXI_CATEGORY = "taxi";

export const FEED_TIMEOUT_MS = 3000;
// Seconds. The feed itself is cached 10 minutes at the edge.
export const FEED_REVALIDATE = 15 * 60;
export const MAX_TAXIS = 60;

export type ZanzibarRentalsTaxi = {
  id: string;
  from: string;
  to: string | null;
  host: string;
  area: string | null;
  price: number | null;
  currency: string;
  pricePer: "trip" | "day" | "hour" | "session" | "vehicle" | "group" | "person";
  seats: number | null;
  photoUrl: string | null;
  url: string;
  summary: string;
};

export function showsZanzibarRentalsTaxis(communitySlug: string): boolean {
  return communitySlug === TAXIS_COMMUNITY;
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
  from: z.string().trim().min(1).max(120),
  to: z.string().trim().max(120).nullish(),
  area: z.string().nullish(),
  host: z.string().trim().min(1).max(200),
  price: z.number().finite().min(0).nullish(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  price_per: z.enum(["trip", "day", "hour", "session", "vehicle", "group", "person"]),
  seats: z.number().int().positive().max(100).nullish(),
  photo_url: z.string().nullish(),
  url: z.string(),
  summary: z.string().nullish(),
});

function toTaxi(raw: unknown): ZanzibarRentalsTaxi | null {
  const parsed = itemSchema.safeParse(raw);
  if (!parsed.success) return null;
  const item = parsed.data;

  // The whole card links out, so the link must be Zanzibar Rentals itself.
  const link = httpsUrl(item.url);
  if (!link || !LISTING_HOSTS.includes(link.hostname)) return null;

  const photo = item.photo_url ? httpsUrl(item.photo_url) : null;
  return {
    id: item.id,
    from: clip(item.from, 60),
    to: item.to?.trim() ? clip(item.to, 60) : null,
    host: clip(item.host, 80),
    area: item.area?.trim() ? clip(item.area, 60) : null,
    price: item.price ?? null,
    currency: item.currency,
    pricePer: item.price_per,
    seats: item.seats ?? null,
    photoUrl: photo && PHOTO_SOURCES.some((p) => p.host === photo.hostname && photo.pathname.startsWith(p.path)) ? photo.href : null,
    url: link.href,
    summary: item.summary ? clip(item.summary, 160) : "",
  };
}

// The taxis in a feed response, or null when the response isn't a version-1
// feed or nothing in it survives validation.
export function parseTaxisFeed(json: unknown, limit = MAX_TAXIS): ZanzibarRentalsTaxi[] | null {
  if (!json || typeof json !== "object") return null;
  const feed = json as { version?: unknown; taxis?: unknown };
  if (feed.version !== 1 || !Array.isArray(feed.taxis)) return null;
  const seen = new Set<string>();
  const taxis: ZanzibarRentalsTaxi[] = [];
  for (const raw of feed.taxis) {
    const taxi = toTaxi(raw);
    if (!taxi || seen.has(taxi.id)) continue;
    seen.add(taxi.id);
    taxis.push(taxi);
    if (taxis.length >= limit) break;
  }
  return taxis.length > 0 ? taxis : null;
}

type Env = Record<string, string | undefined>;

// The kill switch: on unless ZANZIBAR_RENTALS_TAXIS_ENABLED says otherwise.
export function taxisEnabled(env: Env): boolean {
  const value = env.ZANZIBAR_RENTALS_TAXIS_ENABLED?.trim().toLowerCase();
  return !value || !["0", "false", "off", "no"].includes(value);
}

export function taxisFeedUrl(env: Env): string | null {
  const configured = env.ZANZIBAR_RENTALS_TAXIS_FEED_URL?.trim();
  if (!configured) return DEFAULT_TAXIS_FEED_URL;
  return httpsUrl(configured)?.href ?? null;
}

type FetchLike = (url: string, init: RequestInit & { next?: { revalidate?: number } }) => Promise<Response>;

// Every taxi on Zanzibar Rentals, or null to render nothing. Never throws.
export async function getZanzibarRentalsTaxis({
  env = process.env,
  fetchImpl = fetch,
  timeoutMs = FEED_TIMEOUT_MS,
  limit = MAX_TAXIS,
}: { env?: Env; fetchImpl?: FetchLike; timeoutMs?: number; limit?: number } = {}): Promise<ZanzibarRentalsTaxi[] | null> {
  if (!taxisEnabled(env)) return null;
  const url = taxisFeedUrl(env);
  if (!url) return null;
  try {
    const res = await fetchImpl(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
      next: { revalidate: FEED_REVALIDATE },
    });
    if (!res.ok) return null;
    return parseTaxisFeed(await res.json(), limit);
  } catch {
    return null;
  }
}

// "$60 / trip, up to 6", "$30 / car (up to 4)", "Price on request".
export function formatTaxiPrice(taxi: Pick<ZanzibarRentalsTaxi, "price" | "currency" | "pricePer" | "seats">): string {
  if (taxi.price === null) return "Price on request";
  let amount: string;
  try {
    amount = new Intl.NumberFormat("en-US", { style: "currency", currency: taxi.currency, maximumFractionDigits: 0 }).format(taxi.price);
  } catch {
    amount = `${taxi.currency} ${Math.round(taxi.price)}`;
  }
  const per = taxi.pricePer === "vehicle" ? "car" : taxi.pricePer;
  return `${amount} / ${per}`;
}

// Where a taxi leaves from, which is the place it's listed under in the
// directory (Airport, Stone Town, Kendwa): the start of its route, else the
// driver's area for a taxi not named as a route. "Stonetown" and "stone town"
// both read "Stone Town" so they share one group.
export function taxiDeparture(taxi: Pick<ZanzibarRentalsTaxi, "from" | "to" | "area">): string | null {
  const place = taxi.to ? taxi.from : taxi.area;
  if (!place) return null;
  return /^stone\s*town$/i.test(place.trim()) ? "Stone Town" : place;
}

// A taxi as an ordinary card in a directory's Taxi grid, so it sorts, filters
// and groups by area with the directory's own listings. It has no row of its
// own: `partner` sends the card out to Zanzibar Rentals instead of to a
// listing page, and there is nothing to save or review here.
export function taxiDirectoryListing(
  taxi: ZanzibarRentalsTaxi,
  space: { spaceId: string; communityId: string },
  now: string = new Date(0).toISOString()
): BusinessWithStats {
  const name = taxi.to ? `${taxi.from} → ${taxi.to}` : taxi.from;
  const details = [taxi.host, formatTaxiPrice(taxi), taxi.seats ? `up to ${taxi.seats} people` : null].filter(Boolean).join(" · ");
  return {
    business: {
      id: `zanzibar-rentals-${taxi.id}`,
      space_id: space.spaceId,
      community_id: space.communityId,
      created_by: "",
      name,
      slug: null,
      category: TAXI_CATEGORY,
      is_local: false,
      description: taxi.summary ? `${details}. ${taxi.summary}` : details,
      website: taxi.url,
      phone: null,
      address: null,
      opening_hours: null,
      lat: null,
      lng: null,
      location_label: taxiDeparture(taxi),
      image_url: taxi.photoUrl,
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
    imageCount: taxi.photoUrl ? 1 : 0,
    saved: false,
    partner: { url: taxi.url, label: "Book on Zanzibar Rentals" },
  };
}
