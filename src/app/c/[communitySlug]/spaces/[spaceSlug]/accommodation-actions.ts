"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ACCOMMODATION_TYPES } from "@/lib/accommodation-types";
import type { AccommodationType, AccommodationStatus } from "@/types/database";

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
  const name = String(formData.get("name") ?? "").trim();
  const accommodationType = parseAccommodationType(formData.get("accommodation_type"));
  const description = String(formData.get("description") ?? "").trim();
  const photoUrls = parsePhotoUrls(formData.get("photo_urls"));
  const price = parsePrice(formData.get("price_per_night"));
  const currency = String(formData.get("currency") ?? "").trim();
  const bookingUrl = String(formData.get("booking_url") ?? "").trim();
  const locationLabel = String(formData.get("location_label") ?? "").trim();
  const lat = parseCoordinate(formData.get("lat"), -90, 90);
  const lng = parseCoordinate(formData.get("lng"), -180, 180);

  if (!name) {
    return { error: "Give the listing a name." };
  }
  if ((lat === null) !== (lng === null)) {
    return { error: "Set both latitude and longitude, or leave both blank." };
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
    name,
    accommodation_type: accommodationType,
    description: description || null,
    photo_url: photoUrls[0] ?? null,
    photo_urls: photoUrls,
    price_per_night: price,
    currency: price !== null ? currency || "USD" : null,
    booking_url: bookingUrl || null,
    location_label: locationLabel || null,
    lat,
    lng,
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
  const name = String(formData.get("name") ?? "").trim();
  const accommodationType = parseAccommodationType(formData.get("accommodation_type"));
  const description = String(formData.get("description") ?? "").trim();
  const photoUrls = parsePhotoUrls(formData.get("photo_urls"));
  const price = parsePrice(formData.get("price_per_night"));
  const currency = String(formData.get("currency") ?? "").trim();
  const bookingUrl = String(formData.get("booking_url") ?? "").trim();
  const locationLabel = String(formData.get("location_label") ?? "").trim();
  const lat = parseCoordinate(formData.get("lat"), -90, 90);
  const lng = parseCoordinate(formData.get("lng"), -180, 180);

  if (!listingId) {
    return { error: "Missing listing." };
  }
  if (!name) {
    return { error: "Give the listing a name." };
  }
  if ((lat === null) !== (lng === null)) {
    return { error: "Set both latitude and longitude, or leave both blank." };
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
  const { error } = await supabase
    .from("accommodation_listings")
    .update({
      name,
      accommodation_type: accommodationType,
      description: description || null,
      photo_url: photoUrls[0] ?? null,
      photo_urls: photoUrls,
      price_per_night: price,
      currency: price !== null ? currency || "USD" : null,
      booking_url: bookingUrl || null,
      location_label: locationLabel || null,
      lat,
      lng,
    })
    .eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
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
