import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getCommunitySpaces(supabase: Client, communityId: string): Promise<Space[]> {
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSpaceBySlug(
  supabase: Client,
  communityId: string,
  spaceSlug: string
): Promise<Space | null> {
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("community_id", communityId)
    .eq("slug", spaceSlug)
    .maybeSingle();

  if (error) throw error;
  return data;
}
