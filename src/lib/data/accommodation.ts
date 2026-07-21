import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, AccommodationListing, Business } from "@/types/database";

type Client = SupabaseClient<Database>;

export type AccommodationListingWithBusiness = AccommodationListing & { business: Pick<Business, "id" | "name"> | null };

export async function getSpaceAccommodationListings(supabase: Client, spaceId: string): Promise<AccommodationListingWithBusiness[]> {
  const { data, error } = await supabase
    .from("accommodation_listings")
    .select("*, business:business_id (id, name)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as AccommodationListingWithBusiness[];
}
