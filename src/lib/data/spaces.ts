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

// The farming template's "Growing Journey" is an ordinary discussion space
// identified by its name, not a dedicated space_type (the `growth_journey`
// type is the separate personal-timeline feature). Match case-insensitively
// on the name the template gives it, and only among discussion spaces so the
// timeline type never matches. Returns null when the community has no such
// space — which is how the feed's "Share your journey" card knows whether to
// render at all.
export async function getGrowingJourneySpace(supabase: Client, communityId: string): Promise<Space | null> {
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("community_id", communityId)
    .eq("space_type", "discussion")
    .ilike("name", "%growing journey%")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
