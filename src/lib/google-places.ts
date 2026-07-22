import "server-only";
import type { BusinessGoogleReview } from "@/types/database";

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
