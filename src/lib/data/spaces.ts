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

// "Journey" spaces — where members share their own progress — are identified
// by name, not a dedicated space_type: the templates create them as ordinary
// discussion or journal spaces ("Growing Journey", "Wellness Journal", "Farm
// Journal", "Founder Journal", …). Match any space whose name reads as a
// journey/journal, but only among the two types that actually have a composer
// (discussion → NewPostForm, journal → JournalEntryForm) so the feed's "Share
// your journey" card never links to a space with nowhere to post. Returns an
// empty array when the community runs no such space.
export async function getJourneySpaces(supabase: Client, communityId: string): Promise<Space[]> {
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("community_id", communityId)
    .in("space_type", ["discussion", "journal"])
    .or("name.ilike.%journey%,name.ilike.%journal%")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
