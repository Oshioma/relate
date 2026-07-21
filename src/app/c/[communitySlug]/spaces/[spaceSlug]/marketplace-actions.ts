"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { MARKETPLACE_CATEGORIES } from "@/lib/marketplace-categories";
import type { MarketplaceListingType, MarketplaceListingStatus } from "@/types/database";

export type ListingFormState = { error: string } | undefined;

function parseListingType(raw: FormDataEntryValue | null): MarketplaceListingType {
  const value = String(raw ?? "goods");
  return MARKETPLACE_CATEGORIES.some((c) => c.value === value) ? (value as MarketplaceListingType) : "goods";
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

export async function createListing(_prevState: ListingFormState, formData: FormData): Promise<ListingFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const listingType = parseListingType(formData.get("listing_type"));
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = parsePrice(formData.get("price"));
  const currency = String(formData.get("currency") ?? "").trim();
  const photoUrl = String(formData.get("photo_url") ?? "").trim();
  const locationLabel = String(formData.get("location_label") ?? "").trim();
  const lat = parseCoordinate(formData.get("lat"), -90, 90);
  const lng = parseCoordinate(formData.get("lng"), -180, 180);

  if (!title) {
    return { error: "Give the listing a title." };
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

  const { error } = await supabase.from("marketplace_listings").insert({
    space_id: spaceId,
    community_id: communityId,
    seller_id: user.id,
    listing_type: listingType,
    title,
    description: description || null,
    price,
    currency: price !== null ? currency || "USD" : null,
    photo_url: photoUrl || null,
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

export async function deleteListing(listingId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("marketplace_listings").delete().eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function setListingStatus(listingId: string, status: MarketplaceListingStatus, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("marketplace_listings").update({ status }).eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
