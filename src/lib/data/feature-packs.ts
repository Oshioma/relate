import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, FeaturePack, CommunityFeatureAddon } from "@/types/database";

type Client = SupabaseClient<Database>;

// Active packs in the marketplace, in display order. RLS returns active packs to
// everyone and all packs to the super admin.
export async function getActiveFeaturePacks(supabase: Client): Promise<FeaturePack[]> {
  const { data, error } = await supabase
    .from("feature_packs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// Every pack including inactive — for the super-admin management screen.
export async function getAllFeaturePacks(supabase: Client): Promise<FeaturePack[]> {
  const { data, error } = await supabase.from("feature_packs").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// A community's installed/purchased packs (visible to admins via RLS).
export async function getCommunityAddons(supabase: Client, communityId: string): Promise<CommunityFeatureAddon[]> {
  const { data, error } = await supabase.from("community_feature_addons").select("*").eq("community_id", communityId);
  if (error) throw error;
  return data ?? [];
}
