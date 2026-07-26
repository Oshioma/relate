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

// A listing plus the aggregates the card and filters need: the viewer's saved
// state (and, once reviews land, its review score). Mirrors BusinessWithStats.
export type AccommodationListingWithStats = AccommodationListingWithBusiness & { saved: boolean };

export async function getSpaceAccommodationListingsWithStats(
  supabase: Client,
  spaceId: string,
  viewerId: string
): Promise<AccommodationListingWithStats[]> {
  const listings = await getSpaceAccommodationListings(supabase, spaceId);
  if (listings.length === 0) return [];

  const ids = listings.map((l) => l.id);
  const { data: saves, error: savesError } = viewerId
    ? await supabase.from("accommodation_saves").select("listing_id").in("listing_id", ids).eq("user_id", viewerId)
    : { data: [], error: null };
  if (savesError) throw savesError;

  const savedIds = new Set((saves ?? []).map((row) => row.listing_id));
  return listings.map((listing) => ({ ...listing, saved: savedIds.has(listing.id) }));
}

export type AccommodationDetail = {
  listing: AccommodationListingWithBusiness & { lister: Profile };
  saved: boolean;
};

// One listing plus who posted it, any linked business, and the viewer's saved
// state, for its own page. Reviews are layered in by a later data helper.
export async function getAccommodationDetail(supabase: Client, listingId: string, viewerId: string): Promise<AccommodationDetail | null> {
  const { data, error } = await supabase
    .from("accommodation_listings")
    .select("*, business:business_id (id, name), lister:listed_by (*)")
    .eq("id", listingId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { data: saveRow, error: saveError } = viewerId
    ? await supabase.from("accommodation_saves").select("id").eq("listing_id", listingId).eq("user_id", viewerId).maybeSingle()
    : { data: null, error: null };
  if (saveError) throw saveError;

  return {
    listing: data as unknown as AccommodationListingWithBusiness & { lister: Profile },
    saved: Boolean(saveRow),
  };
}
