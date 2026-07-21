import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, MarketplaceListing, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export type ListingWithSeller = MarketplaceListing & { seller: Profile };

export async function getSpaceListings(supabase: Client, spaceId: string): Promise<ListingWithSeller[]> {
  const { data, error } = await supabase
    .from("marketplace_listings")
    .select("*, seller:seller_id (*)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as ListingWithSeller[];
}
