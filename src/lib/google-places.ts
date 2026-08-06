import "server-only";
import type { BusinessGoogleReview, BusinessHoursSchedule } from "@/types/database";

// Talks to the Places API (New) — https://places.googleapis.com/v1. Needs
// GOOGLE_PLACES_API_KEY with "Places API (New)" enabled; without it every
// helper returns null and callers fall back to whatever is cached in the
// businesses.google_* columns.
//
// Field masks are kept tight on purpose: rating + reviews come from the
// (cheaper) Place Details Essentials/Pro tiers, and we only ever request the
// one result we need from Text Search.

export type GooglePlaceData = {
  placeId: string;
  rating: number | null;
  reviewCount: number | null;
  mapsUrl: string | null;
  reviews: BusinessGoogleReview[];
};

const PLACE_FIELDS = "id,rating,userRatingCount,googleMapsUri,reviews";
const SEARCH_FIELDS = PLACE_FIELDS.split(",")
  .map((f) => `places.${f}`)
  .join(",");

// Reviews are a popup teaser, not a review browser — keep the cached payload
// small and let "More on Google" carry the rest.
const MAX_REVIEWS = 3;
const MAX_REVIEW_CHARS = 320;

export function isGooglePlacesConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY);
}

type RawReview = {
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; photoUri?: string };
};

type RawPlace = {
  id?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: RawReview[];
};

function toPlaceData(place: RawPlace): GooglePlaceData | null {
  if (!place.id) return null;

  const reviews: BusinessGoogleReview[] = (place.reviews ?? [])
    .filter((r) => typeof r.rating === "number" && r.text?.text)
    .slice(0, MAX_REVIEWS)
    .map((r) => {
      const text = r.text!.text!.trim();
      return {
        author: r.authorAttribution?.displayName?.trim() || "A Google user",
        author_photo_url: r.authorAttribution?.photoUri ?? null,
        rating: r.rating!,
        text: text.length > MAX_REVIEW_CHARS ? `${text.slice(0, MAX_REVIEW_CHARS).trimEnd()}…` : text,
        relative_time: r.relativePublishTimeDescription ?? "",
      };
    });

  return {
    placeId: place.id,
    rating: typeof place.rating === "number" ? place.rating : null,
    reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
    mapsUrl: place.googleMapsUri ?? null,
    reviews,
  };
}

async function fetchPlaceById(placeId: string, apiKey: string): Promise<GooglePlaceData | null> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": PLACE_FIELDS,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return toPlaceData((await res.json()) as RawPlace);
}

// Finds the business's Google Place by name, biased to its pin. The bias
// radius is tight (2km) so "Coral Cafe" in one village doesn't match its
// namesake across the island; a wrong match can be corrected by setting
// google_place_id on the listing directly.
async function searchPlace(name: string, lat: number, lng: number, apiKey: string): Promise<GooglePlaceData | null> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": SEARCH_FIELDS,
    },
    body: JSON.stringify({
      textQuery: name,
      maxResultCount: 1,
      locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: 2000 } },
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { places?: RawPlace[] };
  const place = data.places?.[0];
  return place ? toPlaceData(place) : null;
}

export async function fetchGooglePlaceForBusiness(business: {
  name: string;
  lat: number | null;
  lng: number | null;
  google_place_id: string | null;
}): Promise<GooglePlaceData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    if (business.google_place_id) {
      return await fetchPlaceById(business.google_place_id, apiKey);
    }
    if (business.lat !== null && business.lng !== null) {
      return await searchPlace(business.name, business.lat, business.lng, apiKey);
    }
    return null;
  } catch {
    // Network/quota hiccups degrade to cached (or no) Google data rather than
    // breaking the popup.
    return null;
  }
}

// ---------------------------------------------------------------------------
// Listing import
//
// The popup path above wants ratings and reviews for a business we already
// have. Importing wants the opposite: everything needed to *create* a listing —
// name, address, pin, contact details, hours, category hints. Different field
// mask, different (richer, pricier) tier, so it's a separate call rather than
// widening PLACE_FIELDS for every popup open.
// ---------------------------------------------------------------------------

export type GooglePlaceDetails = {
  placeId: string;
  name: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  website: string | null;
  phone: string | null;
  summary: string | null;
  // Google's own place types ("restaurant", "lodging", "cafe" …), used to
  // pre-select our category / accommodation type.
  types: string[];
  openingHours: BusinessHoursSchedule | null;
  mapsUrl: string | null;
};

const IMPORT_FIELDS = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "websiteUri",
  "internationalPhoneNumber",
  "editorialSummary",
  "types",
  "primaryType",
  "regularOpeningHours",
  "googleMapsUri",
].join(",");

type RawOpeningPoint = { day?: number; hour?: number; minute?: number };

type RawImportPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  websiteUri?: string;
  internationalPhoneNumber?: string;
  editorialSummary?: { text?: string };
  types?: string[];
  primaryType?: string;
  regularOpeningHours?: { periods?: { open?: RawOpeningPoint; close?: RawOpeningPoint }[] };
  googleMapsUri?: string;
};

function hhmm(point: RawOpeningPoint): string {
  const h = String(Math.min(23, Math.max(0, point.hour ?? 0))).padStart(2, "0");
  const m = String(Math.min(59, Math.max(0, point.minute ?? 0))).padStart(2, "0");
  return `${h}:${m}`;
}

// Google's periods are open/close points keyed by day-of-week (0 = Sunday,
// same as our schedule). Our schema holds a single range per day, so a place
// with split hours (lunch + dinner) keeps the earliest open and the latest
// close, and an overnight close is clamped to the end of the opening day.
// Days Google doesn't list are explicitly closed.
function toSchedule(hours: RawImportPlace["regularOpeningHours"]): BusinessHoursSchedule | null {
  const periods = hours?.periods;
  if (!periods || periods.length === 0) return null;

  const schedule: BusinessHoursSchedule = {};
  let hasOpen = false;

  for (const period of periods) {
    const day = period.open?.day;
    if (typeof day !== "number" || day < 0 || day > 6) continue;

    const open = hhmm(period.open!);
    // A period with no close is Google's "open 24 hours".
    const close = period.close ? (period.close.day === day ? hhmm(period.close) : "23:59") : "23:59";
    if (close <= open) continue;

    const key = String(day);
    const existing = schedule[key];
    schedule[key] = existing && !existing.closed
      ? { closed: false, open: existing.open < open ? existing.open : open, close: existing.close > close ? existing.close : close }
      : { closed: false, open, close };
    hasOpen = true;
  }

  if (!hasOpen) return null;
  for (const day of ["0", "1", "2", "3", "4", "5", "6"]) {
    if (!schedule[day]) schedule[day] = { closed: true, open: "09:00", close: "17:00" };
  }
  return schedule;
}

function toPlaceDetails(place: RawImportPlace): GooglePlaceDetails | null {
  if (!place.id) return null;
  const types = [place.primaryType, ...(place.types ?? [])].filter((t): t is string => Boolean(t));
  return {
    placeId: place.id,
    name: place.displayName?.text?.trim() || null,
    address: place.formattedAddress?.trim() || null,
    lat: typeof place.location?.latitude === "number" ? place.location.latitude : null,
    lng: typeof place.location?.longitude === "number" ? place.location.longitude : null,
    website: place.websiteUri?.trim() || null,
    phone: place.internationalPhoneNumber?.trim() || null,
    summary: place.editorialSummary?.text?.trim() || null,
    types: [...new Set(types)],
    openingHours: toSchedule(place.regularOpeningHours),
    mapsUrl: place.googleMapsUri ?? null,
  };
}

// Looks a place up by free-text query — a name off a Google Maps URL, or
// "<listing name>, <address>" recovered from a booking page. `near` biases the
// search when we know roughly where to look, which is what stops a common name
// from matching its namesake on another continent.
export async function lookupGooglePlace(
  query: string,
  near?: { lat: number; lng: number } | null
): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !query.trim()) return null;

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": IMPORT_FIELDS.split(",").map((f) => `places.${f}`).join(","),
      },
      body: JSON.stringify({
        textQuery: query.trim(),
        maxResultCount: 1,
        ...(near ? { locationBias: { circle: { center: { latitude: near.lat, longitude: near.lng }, radius: 20000 } } } : {}),
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { places?: RawImportPlace[] };
    const place = data.places?.[0];
    return place ? toPlaceDetails(place) : null;
  } catch {
    return null;
  }
}

export async function fetchGooglePlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": IMPORT_FIELDS },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return toPlaceDetails((await res.json()) as RawImportPlace);
  } catch {
    return null;
  }
}
