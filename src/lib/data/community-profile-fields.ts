import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, CommunityProfileField } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getCommunityProfileFields(supabase: Client, communityId: string): Promise<CommunityProfileField[]> {
  const { data, error } = await supabase
    .from("community_profile_fields")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
