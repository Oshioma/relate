import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, MarketplaceListing, Profile, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export type ListingWithSeller = MarketplaceListing & { seller: Profile };
export type ListingWithSellerAndSpace = MarketplaceListing & { seller: Profile; space: Pick<Space, "id" | "name" | "slug"> };

// Newest active listings across the whole community, for the feed.
export async function getCommunityRecentMarketplaceListings(
  supabase: Client,
  communityId: string,
  limit = 6
): Promise<ListingWithSellerAndSpace[]> {
  const { data, error } = await supabase
    .from("marketplace_listings")
    .select("*, seller:seller_id (*), space:space_id (id, name, slug)")
    .eq("community_id", communityId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ListingWithSellerAndSpace[];
}

export async function getSpaceListings(supabase: Client, spaceId: string): Promise<ListingWithSeller[]> {
  const { data, error } = await supabase
    .from("marketplace_listings")
    .select("*, seller:seller_id (*)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as ListingWithSeller[];
}
