import { z } from "zod";

// Places to stay from Zanzibar Rooms (www.zanzibarrooms.com), a separate app
// with a public feed of its listings. Relate shows a few of them under a
// Zanzibar destination's "Where to stay" as clearly labelled partner listings.
//
// The feed is someone else's server, so nothing from it is trusted: every item
// is validated on its own and a malformed one is dropped, links must point at
// Zanzibar Rooms itself, and any failure at all (disabled, timeout, 5xx, bad
// JSON, nothing left) comes back as null so the section simply doesn't render.
// This file is plain TypeScript (no Next imports) so the tests can run it.

export const DEFAULT_FEED_URL = "https://www.zanzibarrooms.com/api/public/stays";
const LISTING_ORIGIN = "https://www.zanzibarrooms.com";
// Hosts next.config.ts allows for next/image. A photo anywhere else is dropped
// (the card shows without it) rather than handed to an optimiser that would 400.
// Keep in step with images.remotePatterns.
const PHOTO_SOURCES = [
  { host: "www.zanzibarrooms.com", path: "/" },
  { host: "qkjojurwzkanrwfgaefv.supabase.co", path: "/storage/v1/" },
];

export const FEED_TIMEOUT_MS = 3000;
// Seconds. The feed itself is cached 10 minutes at the edge.
export const FEED_REVALIDATE = 15 * 60;
export const MAX_STAYS = 6;

export type ZanzibarRoomsStay = {
  id: string;
  name: string;
  area: string | null;
  fromPrice: number;
  currency: string;
  priceUnit: "night" | "month";
  maxGuests: number | null;
  photoUrl: string | null;
  photoAlt: string;
  url: string;
  summary: string;
};

export type StaysQuery =
  | { by: "area"; area: string; near?: { lat: number; lng: number } }
  | { by: "near"; lat: number; lng: number };

function httpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url : null;
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
  name: z.string().trim().min(1).max(200),
  area: z.string().nullish(),
  // Null for listings without a map position yet. Cards don't use them.
  lat: z.number().finite().min(-90).max(90).nullish(),
  lng: z.number().finite().min(-180).max(180).nullish(),
  from_price: z.number().finite().positive(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  price_unit: z.enum(["night", "month"]),
  max_guests: z.number().int().positive().max(100).nullish(),
  photo_url: z.string().nullish(),
  photo_alt: z.string().nullish(),
  url: z.string(),
  summary: z.string().nullish(),
});

function toStay(raw: unknown): ZanzibarRoomsStay | null {
  const parsed = itemSchema.safeParse(raw);
  if (!parsed.success) return null;
  const item = parsed.data;

  // The whole card links out, so the link must be Zanzibar Rooms itself.
  const link = httpsUrl(item.url);
  if (!link || link.origin !== LISTING_ORIGIN) return null;

  const photo = item.photo_url ? httpsUrl(item.photo_url) : null;
  const name = clip(item.name, 120);
  return {
    id: item.id,
    name,
    area: item.area?.trim() ? clip(item.area, 60) : null,
    fromPrice: item.from_price,
    currency: item.currency,
    priceUnit: item.price_unit,
    maxGuests: item.max_guests ?? null,
    photoUrl: photo && !photo.port && PHOTO_SOURCES.some((p) => p.host === photo.hostname && photo.pathname.startsWith(p.path)) ? photo.href : null,
    photoAlt: item.photo_alt?.trim() ? clip(item.photo_alt, 200) : name,
    url: link.href,
    summary: item.summary ? clip(item.summary, 160) : "",
  };
}

// The stays in a feed response, or null when the response isn't a version-1
// feed or nothing in it survives validation.
export function parseStaysFeed(json: unknown, limit = MAX_STAYS): ZanzibarRoomsStay[] | null {
  const stays = feedItems(json, limit);
  return stays && stays.length > 0 ? stays : null;
}

// Null for a response that isn't a feed at all; [] for a real, empty one.
function feedItems(json: unknown, limit: number): ZanzibarRoomsStay[] | null {
  if (!json || typeof json !== "object") return null;
  const feed = json as { version?: unknown; stays?: unknown };
  if (feed.version !== 1 || !Array.isArray(feed.stays)) return null;
  const seen = new Set<string>();
  const stays: ZanzibarRoomsStay[] = [];
  for (const raw of feed.stays) {
    const stay = toStay(raw);
    if (!stay || seen.has(stay.id)) continue;
    seen.add(stay.id);
    stays.push(stay);
    if (stays.length >= limit) break;
  }
  return stays;
}

// Unguja and Pemba with a little sea around them. Pages outside it get no
// Zanzibar Rooms section.
const ZANZIBAR_BOUNDS = { south: -6.6, north: -4.8, west: 39.1, east: 40.0 };

// Places Zanzibar Rooms files listings under by name. Anything else falls back
// to a search around the page's coordinates.
const ZANZIBAR_ROOMS_AREAS = [
  "Stone Town",
  "Nungwi",
  "Kendwa",
  "Matemwe",
  "Pwani Mchangani",
  "Kiwengwa",
  "Pongwe",
  "Uroa",
  "Michamvi",
  "Dongwe",
  "Bwejuu",
  "Paje",
  "Jambiani",
  "Kizimkazi",
];

export function inZanzibar(lat: number, lng: number): boolean {
  const b = ZANZIBAR_BOUNDS;
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= b.south && lat <= b.north && lng >= b.west && lng <= b.east;
}

// Which stays to ask for on a page about `place`: by area name when Zanzibar
// Rooms knows the area, else near the page's coordinates. Null for anywhere
// that isn't on Zanzibar or Pemba.
export function stayQueryFor(place: { name: string; lat?: number | null; lng?: number | null }): StaysQuery | null {
  const hasCoords = typeof place.lat === "number" && typeof place.lng === "number";
  if (hasCoords && !inZanzibar(place.lat!, place.lng!)) return null;
  const name = place.name.trim().toLowerCase();
  const area = ZANZIBAR_ROOMS_AREAS.find((a) => a.toLowerCase() === name);
  if (area) return hasCoords ? { by: "area", area, near: { lat: place.lat!, lng: place.lng! } } : { by: "area", area };
  if (hasCoords) return { by: "near", lat: place.lat!, lng: place.lng! };
  return null;
}

const NEAR_RADIUS_KM = 8;

export function feedUrl(base: string, query: { area: string } | { lat: number; lng: number }, limit = MAX_STAYS): string {
  const url = new URL(base);
  if ("area" in query) url.searchParams.set("area", query.area);
  else {
    url.searchParams.set("near", `${query.lat.toFixed(4)},${query.lng.toFixed(4)}`);
    url.searchParams.set("radius_km", String(NEAR_RADIUS_KM));
  }
  url.searchParams.set("limit", String(limit));
  return url.href;
}

type Env = Record<string, string | undefined>;

// The kill switch: on unless ZANZIBAR_ROOMS_STAYS_ENABLED says otherwise.
export function staysEnabled(env: Env): boolean {
  const value = env.ZANZIBAR_ROOMS_STAYS_ENABLED?.trim().toLowerCase();
  return !value || !["0", "false", "off", "no"].includes(value);
}

export function feedBase(env: Env): string | null {
  const configured = env.ZANZIBAR_ROOMS_FEED_URL?.trim();
  if (!configured) return DEFAULT_FEED_URL;
  return httpsUrl(configured)?.href ?? null;
}

type FetchLike = (url: string, init: RequestInit & { next?: { revalidate?: number } }) => Promise<Response>;

// [] only for a feed that answered with nothing usable; null for any failure.
async function fetchFeed(url: string, fetchImpl: FetchLike, timeoutMs: number): Promise<ZanzibarRoomsStay[] | null> {
  try {
    const res = await fetchImpl(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
      next: { revalidate: FEED_REVALIDATE },
    });
    if (!res.ok) return null;
    return feedItems(await res.json(), MAX_STAYS);
  } catch {
    return null;
  }
}

// The stays for one page, or null to render nothing. Never throws. An area
// with no listings falls back to what's near the page, when it has coordinates
// (a failed request doesn't: one timeout is enough).
export async function getZanzibarRoomsStays(
  query: StaysQuery | null,
  { env = process.env, fetchImpl = fetch, timeoutMs = FEED_TIMEOUT_MS }: { env?: Env; fetchImpl?: FetchLike; timeoutMs?: number } = {}
): Promise<ZanzibarRoomsStay[] | null> {
  if (!query || !staysEnabled(env)) return null;
  const base = feedBase(env);
  if (!base) return null;
  let stays = await fetchFeed(feedUrl(base, query.by === "near" ? query : { area: query.area }), fetchImpl, timeoutMs);
  if (stays?.length === 0 && query.by === "area" && query.near) stays = await fetchFeed(feedUrl(base, query.near), fetchImpl, timeoutMs);
  return stays && stays.length > 0 ? stays : null;
}

export function formatFromPrice(stay: Pick<ZanzibarRoomsStay, "fromPrice" | "currency" | "priceUnit">): string {
  let amount: string;
  try {
    amount = new Intl.NumberFormat("en-US", { style: "currency", currency: stay.currency, maximumFractionDigits: 0 }).format(stay.fromPrice);
  } catch {
    amount = `${stay.currency} ${Math.round(stay.fromPrice)}`;
  }
  return `from ${amount} / ${stay.priceUnit}`;
}
