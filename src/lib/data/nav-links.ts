import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, CommunityNavLink } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getCommunityNavLinks(supabase: Client, communityId: string): Promise<CommunityNavLink[]> {
  const { data, error } = await supabase
    .from("community_nav_links")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
