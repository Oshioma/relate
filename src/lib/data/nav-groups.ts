import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, CommunityNavGroup } from "@/types/database";

type Client = SupabaseClient<Database>;

// Null when the sections could not be read (say, before the migration that
// adds the table has run): callers fall back to DEFAULT_NAV_GROUPS so the nav
// keeps its headings. An empty array is a real answer — the admin removed them.
export async function getCommunityNavGroups(supabase: Client, communityId: string): Promise<CommunityNavGroup[] | null> {
  const { data, error } = await supabase
    .from("community_nav_groups")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getCommunityNavGroups", error.message);
    return null;
  }
  return data ?? [];
}
