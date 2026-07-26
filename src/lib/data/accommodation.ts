import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, AccommodationListing, Business, Profile, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export type AccommodationListingWithBusiness = AccommodationListing & { business: Pick<Business, "id" | "name"> | null };
export type AccommodationListingWithContext = AccommodationListingWithBusiness & {
  lister: Profile;
  space: Pick<Space, "id" | "name" | "slug">;
};

// Newest available listings across the whole community, for the feed.
export async function getCommunityRecentAccommodationListings(
  supabase: Client,
  communityId: string,
  limit = 6
): Promise<AccommodationListingWithContext[]> {
  const { data, error } = await supabase
    .from("accommodation_listings")
    .select("*, business:business_id (id, name), lister:listed_by (*), space:space_id (id, name, slug)")
    .eq("community_id", communityId)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as AccommodationListingWithContext[];
}

export async function getSpaceAccommodationListings(supabase: Client, spaceId: string): Promise<AccommodationListingWithBusiness[]> {
  const { data, error } = await supabase
    .from("accommodation_listings")
    .select("*, business:business_id (id, name)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as AccommodationListingWithBusiness[];
}

export type AccommodationDetail = {
  listing: AccommodationListingWithBusiness & { lister: Profile };
};

// One listing plus who posted it and any linked business, for its own page.
// Reviews and the viewer's saved state are layered in by later data helpers.
export async function getAccommodationDetail(supabase: Client, listingId: string): Promise<AccommodationDetail | null> {
  const { data, error } = await supabase
    .from("accommodation_listings")
    .select("*, business:business_id (id, name), lister:listed_by (*)")
    .eq("id", listingId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return { listing: data as unknown as AccommodationListingWithBusiness & { lister: Profile } };
}
