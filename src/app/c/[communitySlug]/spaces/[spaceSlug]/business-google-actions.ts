"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchGooglePlaceForBusiness, isGooglePlacesConfigured } from "@/lib/google-places";
import type { Business, BusinessGoogleReview } from "@/types/database";

export type BusinessGoogleInfo = {
  rating: number | null;
  reviewCount: number | null;
  reviews: BusinessGoogleReview[];
  mapsUrl: string | null;
};

// Google's Places policy only allows short-lived caching of ratings/reviews
// (place IDs may be kept), and a stale "4.6 (128)" is worse than a refetch.
const SYNC_MAX_AGE_MS = 12 * 60 * 60 * 1000;

function cachedInfo(business: Business): BusinessGoogleInfo | null {
  if (business.google_synced_at === null) return null;
  return {
    rating: business.google_rating,
    reviewCount: business.google_review_count,
    reviews: business.google_reviews ?? [],
    mapsUrl: business.google_maps_url,
  };
}

// Called from the map popup on open. Reads through the user-scoped client so
// RLS decides whether the caller can see the business at all; only the cache
// write needs the service-role client (google_synced_at must update even when
// the viewer isn't the listing's author).
export async function getBusinessGoogleInfo(businessId: string): Promise<BusinessGoogleInfo | null> {
  const supabase = await createClient();
  const { data: business } = await supabase.from("businesses").select("*").eq("id", businessId).maybeSingle();
  if (!business) return null;

  const cached = cachedInfo(business);
  if (!isGooglePlacesConfigured()) return cached;

  const fresh =
    business.google_synced_at !== null && Date.now() - new Date(business.google_synced_at).getTime() < SYNC_MAX_AGE_MS;
  if (fresh) return cached;

  const place = await fetchGooglePlaceForBusiness(business);
  if (!place) {
    // No match or Google unavailable — remember the attempt so every popup
    // open doesn't re-hit the API, and serve whatever we had.
    await createAdminClient()
      .from("businesses")
      .update({ google_synced_at: new Date().toISOString() })
      .eq("id", businessId);
    return cached;
  }

  await createAdminClient()
    .from("businesses")
    .update({
      google_place_id: place.placeId,
      google_rating: place.rating,
      google_review_count: place.reviewCount,
      google_reviews: place.reviews,
      google_maps_url: place.mapsUrl,
      google_synced_at: new Date().toISOString(),
    })
    .eq("id", businessId);

  return {
    rating: place.rating,
    reviewCount: place.reviewCount,
    reviews: place.reviews,
    mapsUrl: place.mapsUrl,
  };
}
