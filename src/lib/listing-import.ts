import "server-only";
import { fetchPageContent, parsePublicUrl, resolveRedirect, type PageContent } from "@/lib/page-content";
import { lookupGooglePlace, fetchGooglePlaceDetails, isGooglePlacesConfigured, type GooglePlaceDetails } from "@/lib/google-places";
import { extractListingWithAi, isListingExtractionConfigured } from "@/lib/ai/extract-listing";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";
import { EMPTY_DRAFT, isEmptyDraft, type ListingDraft, type ListingImportKind, type ListingImportResult } from "@/lib/listing-draft";
import type { BusinessCategory, AccommodationType } from "@/types/database";

// "Paste a link, get a filled-in form."
//
// Three sources, tried in the order of how much they can be trusted:
//
//   1. Google Places, when the link is a Google Maps/share link. Structured,
//      authoritative, no model involved.
//   2. The page itself, read once and handed to Claude for extraction. This is
//      the path Booking.com / Airbnb / a hotel's own site take.
//   3. The URL string alone, when the site refuses server-side requests — which
//      the big booking sites often do. Only the name and town survive, and the
//      caller tells the member the rest is on them.
//
// Whichever source produced the draft, Google Places then fills in the gaps it
// can (pin, phone, hours) so a Booking.com import still lands on the map.

const MAX_PHOTOS = 6;

// Sites that host listings *about* a place rather than being the place's own
// site — never adopt one of these as the listing's website, and for a stay they
// are the booking link instead.
const AGGREGATOR_HOSTS = [
  "booking.com",
  "airbnb.",
  "vrbo.com",
  "expedia.",
  "hotels.com",
  "agoda.com",
  "tripadvisor.",
  "hostelworld.com",
  "trivago.",
  "google.",
  "goo.gl",
  "g.co",
  "yelp.",
  "facebook.com",
  "instagram.com",
];

function hostMatches(url: URL, needles: string[]): boolean {
  const host = url.hostname.toLowerCase();
  return needles.some((needle) => host === needle || host.includes(needle));
}

function isAggregator(url: URL): boolean {
  return hostMatches(url, AGGREGATOR_HOSTS);
}

// Anchored on purpose: a bare `endsWith("goo.gl")` would also accept
// "evilgoo.gl", and `google\.[a-z.]+$` would accept "google.com.example.net" —
// both would hand an attacker-chosen host the Google-link treatment.
function isGoogleHost(host: string): boolean {
  return /^(?:.+\.)?google\.[a-z]{2,3}(?:\.[a-z]{2})?$/.test(host);
}

function isShortenerHost(host: string): boolean {
  return ["goo.gl", "g.co", "bit.ly", "t.co"].some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function isGoogleLink(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  if (host === "goo.gl" || host.endsWith(".goo.gl") || host === "g.co" || host.endsWith(".g.co")) return true;
  return isGoogleHost(host) && (url.pathname.startsWith("/maps") || url.searchParams.has("q"));
}

function isShortLink(url: URL): boolean {
  return isShortenerHost(url.hostname.toLowerCase());
}

// ---------------------------------------------------------------------------
// Google Maps links
// ---------------------------------------------------------------------------

// A share URL carries the place name in its path and the real coordinates in
// the `data` blob (!3d<lat>!4d<lng>) — the `@lat,lng` pair is only the map
// viewport, so it's the weaker fallback.
function readGoogleMapsUrl(url: URL): { query: string | null; near: { lat: number; lng: number } | null; placeId: string | null } {
  const decoded = decodeURIComponent(url.pathname);

  const placeMatch = decoded.match(/\/maps\/place\/([^/@]+)/);
  const name = placeMatch ? placeMatch[1].replace(/\+/g, " ").trim() : null;
  const query = name || url.searchParams.get("q")?.replace(/\+/g, " ").trim() || null;

  const full = url.toString();
  const exact = full.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const viewport = full.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const coords = exact ?? viewport;
  const near = coords ? { lat: Number(coords[1]), lng: Number(coords[2]) } : null;

  const placeId =
    url.searchParams.get("place_id") ??
    query?.match(/^place_id:(.+)$/)?.[1] ??
    full.match(/[?&]query_place_id=([^&]+)/)?.[1] ??
    null;

  return {
    query: query && !query.startsWith("place_id:") ? query : null,
    near: near && Number.isFinite(near.lat) && Number.isFinite(near.lng) ? near : null,
    placeId,
  };
}

// Google's own place types → our directory categories. Ordered most specific
// first: a "coffee_shop" that is also tagged "restaurant" should read as a café.
const GOOGLE_CATEGORY_RULES: { types: string[]; category: BusinessCategory }[] = [
  { types: ["coworking_space"], category: "coworking" },
  { types: ["cafe", "coffee_shop", "bakery", "tea_house", "juice_shop"], category: "cafe" },
  { types: ["restaurant", "bar", "food", "meal_takeaway", "meal_delivery", "pizza_restaurant", "fast_food_restaurant"], category: "restaurant" },
  { types: ["gym", "fitness_center", "yoga_studio", "sports_club", "sports_complex"], category: "fitness" },
  { types: ["pharmacy", "doctor", "dentist", "hospital", "physiotherapist", "medical_lab", "spa", "massage", "wellness_center"], category: "health" },
  { types: ["taxi_stand", "taxi_service"], category: "taxi" },
  { types: ["tourist_attraction", "museum", "park", "night_club", "amusement_park", "diving_center", "water_park", "zoo", "art_gallery", "casino", "tour_agency"], category: "activity" },
  { types: ["supermarket", "grocery_store", "store", "clothing_store", "book_store", "convenience_store", "shopping_mall", "market", "department_store"], category: "shop" },
  { types: ["laundry", "bank", "atm", "car_repair", "car_rental", "electrician", "plumber", "real_estate_agency", "insurance_agency", "travel_agency", "beauty_salon", "hair_salon", "barber_shop", "storage", "moving_company", "post_office"], category: "service" },
];

function googleCategory(types: string[]): BusinessCategory | null {
  const set = new Set(types.map((t) => t.toLowerCase()));
  for (const rule of GOOGLE_CATEGORY_RULES) {
    if (rule.types.some((t) => set.has(t))) return rule.category;
  }
  return null;
}

const GOOGLE_ACCOMMODATION_RULES: { types: string[]; value: AccommodationType }[] = [
  { types: ["hostel"], value: "hostel" },
  { types: ["guest_house", "bed_and_breakfast", "inn"], value: "guesthouse" },
  { types: ["campground", "camping_cabin", "rv_park"], value: "camping" },
  { types: ["cottage", "farmstay", "vacation_home_rental", "apartment_complex"], value: "holiday_rental" },
  { types: ["hotel", "resort_hotel", "motel", "extended_stay_hotel", "lodging"], value: "hotel" },
];

function googleAccommodationType(types: string[]): AccommodationType | null {
  const set = new Set(types.map((t) => t.toLowerCase()));
  for (const rule of GOOGLE_ACCOMMODATION_RULES) {
    if (rule.types.some((t) => set.has(t))) return rule.value;
  }
  return null;
}

// "Beach Road, Kendwa, Zanzibar, Tanzania" → "Kendwa". A Google formatted
// address for a business nearly always leads with the street line, so the
// locality is the component right after it; with only two components there's no
// street line and the first one is the place. Wrong sometimes — the member sees
// the value in the form and can correct it.
function localityFromAddress(address: string | null): string | null {
  if (!address) return null;
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const candidate = parts.length >= 3 ? parts[1] : parts[0];
  // Leading digits mean we grabbed a postcode or a house number, not a village.
  return candidate && candidate.length <= 60 && !/^\d/.test(candidate) ? candidate : null;
}

function draftFromGooglePlace(place: GooglePlaceDetails, kind: ListingImportKind): ListingDraft {
  return {
    ...EMPTY_DRAFT,
    name: place.name,
    description: place.summary,
    address: place.address,
    location_label: localityFromAddress(place.address),
    website: place.website,
    phone: place.phone,
    lat: place.lat,
    lng: place.lng,
    category: kind === "business" ? googleCategory(place.types) : null,
    opening_hours: kind === "business" ? place.openingHours : null,
    accommodation_type: kind === "accommodation" ? googleAccommodationType(place.types) : null,
  };
}

// ---------------------------------------------------------------------------
// Merging
// ---------------------------------------------------------------------------

// `base` wins wherever it has something; `extra` only fills holes. Used to let
// a Google lookup complete an AI draft without ever overwriting what the page
// actually said.
function fillGaps(base: ListingDraft, extra: Partial<ListingDraft>): ListingDraft {
  const merged: ListingDraft = { ...base };
  for (const [key, value] of Object.entries(extra) as [keyof ListingDraft, ListingDraft[keyof ListingDraft]][]) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      if (value.length > 0 && (merged[key] as unknown[]).length === 0) {
        (merged as Record<string, unknown>)[key] = value;
      }
      continue;
    }
    if (merged[key] === null) (merged as Record<string, unknown>)[key] = value;
  }
  // A pin is only meaningful as a pair — never take a latitude from one source
  // and a longitude from another.
  if (merged.lat === null || merged.lng === null) {
    merged.lat = null;
    merged.lng = null;
  }
  return merged;
}

function photosFromPage(page: PageContent | null): string[] {
  return page ? page.images.slice(0, MAX_PHOTOS) : [];
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export async function importListingDraft({
  rawUrl,
  kind,
  categories,
}: {
  rawUrl: string;
  kind: ListingImportKind;
  categories: string[];
}): Promise<ListingImportResult> {
  const parsed = parsePublicUrl(rawUrl);
  if (!parsed) {
    return { ok: false, error: "That doesn't look like a public web link. Paste the full https:// address." };
  }

  const allowedCategories = categories.length > 0 ? categories : BUSINESS_CATEGORIES.map((c) => c.value);
  const url = isShortLink(parsed) ? await resolveRedirect(parsed) : parsed;

  // 1. Google Maps / share links go straight to Places.
  if (isGoogleLink(url)) {
    if (!isGooglePlacesConfigured()) {
      return { ok: false, error: "Google Maps links need the Google Places API configured. Paste the place's own website or a Booking.com link instead." };
    }
    const { query, near, placeId } = readGoogleMapsUrl(url);
    const place = placeId ? await fetchGooglePlaceDetails(placeId) : query ? await lookupGooglePlace(query, near) : null;
    if (!place) {
      return { ok: false, error: "Couldn't find that place on Google. Try opening it in Google Maps and copying the link from the Share button." };
    }

    let draft = draftFromGooglePlace(place, kind);
    // The place's own website is usually where its photos are.
    if (draft.website) {
      const site = parsePublicUrl(draft.website);
      const page = site ? await fetchPageContent(site) : null;
      draft = { ...draft, photos: photosFromPage(page) };
    }
    return {
      ok: true,
      draft,
      source: "google",
      note: "Filled in from Google Maps. Check the details, add photos, and post.",
    };
  }

  if (!isListingExtractionConfigured()) {
    return { ok: false, error: "AI autofill isn't configured on this site yet. Add the details by hand for now." };
  }

  // 2. Read the page and let Claude extract it.
  const page = await fetchPageContent(url);
  const extracted = await extractListingWithAi({ url: url.toString(), kind, page, categories: allowedCategories });

  if (!extracted || isEmptyDraft(extracted)) {
    return {
      ok: false,
      error: page
        ? "Couldn't make sense of that page. It may be a login or search page rather than a single listing."
        : "That site wouldn't let us read the page. Try the place's own website, or a Google Maps link.",
    };
  }

  let draft: ListingDraft = { ...extracted, photos: photosFromPage(page) };

  // The pasted link itself is the booking link for a stay, and the website for
  // a business that has no other one — but only when it isn't an aggregator.
  const aggregator = isAggregator(url);
  if (kind === "accommodation") {
    draft.booking_url = url.toString();
  }
  if (!aggregator && !draft.website) {
    draft.website = url.toString();
  }

  // 3. Let Google fill the holes — above all the map pin, which no booking
  // page exposes but every listing wants.
  if (draft.name && isGooglePlacesConfigured()) {
    const query = [draft.name, draft.address ?? draft.location_label].filter(Boolean).join(", ");
    const place = await lookupGooglePlace(query, draft.lat !== null && draft.lng !== null ? { lat: draft.lat, lng: draft.lng } : null);
    if (place) draft = fillGaps(draft, draftFromGooglePlace(place, kind));
  }

  return {
    ok: true,
    draft,
    source: page ? "page" : "link",
    note: page
      ? "Filled in from that page. Check every field before posting — some of it is inferred."
      : "That site blocked us from reading the page, so only what the link itself revealed came through. Please fill in the rest.",
  };
}
