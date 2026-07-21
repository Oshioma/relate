import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, MapCategory, Landmark, Business } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getMapCategories(supabase: Client, communityId: string): Promise<MapCategory[]> {
  const { data, error } = await supabase
    .from("map_categories")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSpaceLandmarks(supabase: Client, spaceId: string): Promise<Landmark[]> {
  const { data, error } = await supabase
    .from("landmarks")
    .select("*")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Businesses live in their own 'business_directory' space, but any with a
// pin (lat/lng set) shows up on the community's map too — the "Living Map"
// idea: the map is another way to browse the whole community, not a
// separate silo. Community-scoped rather than space-scoped since a business
// and the map space are usually different spaces.
export async function getCommunityMapPinnedBusinesses(supabase: Client, communityId: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("community_id", communityId)
    .not("lat", "is", null)
    .not("lng", "is", null);

  if (error) throw error;
  return data ?? [];
}
