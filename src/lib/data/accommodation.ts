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
