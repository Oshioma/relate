import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Business, FeaturedBusinessCategory, BusinessCustomCategory } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getSpaceBusinesses(supabase: Client, spaceId: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("space_id", spaceId)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// All custom categories across a community's directory spaces — community-
// scoped like featured categories below, so the left nav can label featured
// custom slugs and the directory page can filter to its own space_id.
export async function getCommunityBusinessCustomCategories(
  supabase: Client,
  communityId: string
): Promise<BusinessCustomCategory[]> {
  const { data, error } = await supabase
    .from("business_custom_categories")
    .select("*")
    .eq("community_id", communityId)
    .order("label", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// All featured categories across a community's directory spaces — one query
// for the left nav, which groups them under their space by space_id.
export async function getCommunityFeaturedBusinessCategories(
  supabase: Client,
  communityId: string
): Promise<FeaturedBusinessCategory[]> {
  const { data, error } = await supabase
    .from("featured_business_categories")
    .select("*")
    .eq("community_id", communityId)
    .order("category", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
