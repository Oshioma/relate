"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ACCOMMODATION_TYPES, ACCOMMODATION_PRICE_UNITS, ACCOMMODATION_AMENITIES } from "@/lib/accommodation-types";
import type { AccommodationType, AccommodationStatus, AccommodationPriceUnit } from "@/types/database";

export type AccommodationFormState = { error: string } | undefined;

function parseAccommodationType(raw: FormDataEntryValue | null): AccommodationType {
  const value = String(raw ?? "holiday_rental");
  return ACCOMMODATION_TYPES.some((t) => t.value === value) ? (value as AccommodationType) : "holiday_rental";
}

function parsePrice(raw: FormDataEntryValue | null): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function parseCoordinate(raw: FormDataEntryValue | null, min: number, max: number): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

function parseCount(raw: FormDataEntryValue | null): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

function parsePriceUnit(raw: FormDataEntryValue | null): AccommodationPriceUnit {
  const value = String(raw ?? "per_night");
  return ACCOMMODATION_PRICE_UNITS.some((u) => u.value === value) ? (value as AccommodationPriceUnit) : "per_night";
}

// Keep only known amenity slugs, deduped, from the checkbox group.
function parseAmenities(values: FormDataEntryValue[]): string[] {
  const allowed = new Set(ACCOMMODATION_AMENITIES.map((a) => a.value));
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of values) {
    const value = String(raw);
    if (allowed.has(value) && !seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }
  return result;
}

// An ISO date (YYYY-MM-DD) from a <input type="date">, or null.
function parseDate(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

// The column values shared by create and update, so the two actions can't drift
// out of sync. Returns a validation error instead of the values when a field is
// off.
type ListingFields = {
  name: string;
  accommodation_type: AccommodationType;
  business_id: string | null;
  description: string | null;
  photo_urls: string[];
  price_per_night: number | null;
  currency: string | null;
  price_unit: AccommodationPriceUnit;
  booking_url: string | null;
  location_label: string | null;
  lat: number | null;
  lng: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  max_guests: number | null;
  amenities: string[];
  available_from: string | null;
  available_to: string | null;
};

function parseListingFields(formData: FormData): { values: ListingFields } | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const photoUrls = parsePhotoUrls(formData.get("photo_urls"));
  const price = parsePrice(formData.get("price_per_night"));
  const currency = String(formData.get("currency") ?? "").trim();
  const lat = parseCoordinate(formData.get("lat"), -90, 90);
  const lng = parseCoordinate(formData.get("lng"), -180, 180);
  const availableFrom = parseDate(formData.get("available_from"));
  const availableTo = parseDate(formData.get("available_to"));

  if (!name) return { error: "Give the listing a name." };
  if ((lat === null) !== (lng === null)) return { error: "Set both latitude and longitude, or leave both blank." };
  // ISO dates compare lexically the same as chronologically.
  if (availableFrom && availableTo && availableFrom > availableTo) {
    return { error: "The available-from date must be on or before the available-to date." };
  }

  return {
    values: {
      name,
      accommodation_type: parseAccommodationType(formData.get("accommodation_type")),
      business_id: String(formData.get("business_id") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      photo_urls: photoUrls,
      price_per_night: price,
      currency: price !== null ? currency || "USD" : null,
      price_unit: parsePriceUnit(formData.get("price_unit")),
      booking_url: String(formData.get("booking_url") ?? "").trim() || null,
      location_label: String(formData.get("location_label") ?? "").trim() || null,
      lat,
      lng,
      bedrooms: parseCount(formData.get("bedrooms")),
      bathrooms: parseCount(formData.get("bathrooms")),
      max_guests: parseCount(formData.get("max_guests")),
      amenities: parseAmenities(formData.getAll("amenities")),
      available_from: availableFrom,
      available_to: availableTo,
    },
  };
}

const MAX_PHOTOS = 10;

// The photos editor sends its gallery as a JSON array of URL strings in a hidden
// `photo_urls` field; the first entry is the cover. Bad rows are dropped, dupes
// collapsed and the list is capped so a listing can't attach unbounded photos.
function parsePhotoUrls(raw: FormDataEntryValue | null): string[] {
  const value = String(raw ?? "").trim();
  if (!value) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const entry of parsed) {
    if (urls.length >= MAX_PHOTOS) break;
    const url = typeof entry === "string" ? entry.trim() : "";
    if (!/^https?:\/\//.test(url) || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return urls;
}

export async function createAccommodationListing(_prevState: AccommodationFormState, formData: FormData): Promise<AccommodationFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");

  const parsed = parseListingFields(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("accommodation_listings").insert({
    space_id: spaceId,
    community_id: communityId,
    listed_by: user.id,
    ...parsed.values,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function updateAccommodationListing(_prevState: AccommodationFormState, formData: FormData): Promise<AccommodationFormState> {
  const listingId = String(formData.get("listing_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");

  if (!listingId) {
    return { error: "Missing listing." };
  }

  const parsed = parseListingFields(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  // The lister-or-staff RLS policy on accommodation_listings decides whether
  // this update is allowed; we don't re-check ownership here.
  const { error } = await supabase.from("accommodation_listings").update(parsed.values).eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

// Toggle the current member's bookmark of a stay. Mirrors toggleSaveBusiness:
// insert/delete a single accommodation_saves row and report the new state so the
// card and detail heart can settle optimistic UI.
export async function toggleSaveAccommodation(listingId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("accommodation_saves")
    .select("id")
    .eq("listing_id", listingId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError.message };
  }

  if (existing) {
    const { error } = await supabase.from("accommodation_saves").delete().eq("id", existing.id);
    if (error) return { error: error.message };
    revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
    return { saved: false };
  }

  const { error } = await supabase.from("accommodation_saves").insert({ listing_id: listingId, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { saved: true };
}

export async function deleteAccommodationListing(listingId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accommodation_listings").delete().eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function setAccommodationStatus(listingId: string, status: AccommodationStatus, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accommodation_listings").update({ status }).eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
