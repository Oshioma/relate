import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, CommunityTier } from "@/types/database";

type Client = SupabaseClient<Database>;

export type TierWithSpaces = CommunityTier & { spaceIds: string[] };

// A community's membership tiers with the ids of the spaces each unlocks.
// RLS returns tiers to members; the admin page (admins) uses this to manage
// them, and the member membership page uses it to show join options.
export async function getCommunityTiers(supabase: Client, communityId: string): Promise<TierWithSpaces[]> {
  const { data: tiers, error } = await supabase
    .from("community_tiers")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;

  const list = tiers ?? [];
  if (list.length === 0) return [];

  const { data: links } = await supabase
    .from("tier_spaces")
    .select("tier_id, space_id")
    .in(
      "tier_id",
      list.map((t) => t.id)
    );

  const byTier = new Map<string, string[]>();
  for (const link of links ?? []) {
    const arr = byTier.get(link.tier_id) ?? [];
    arr.push(link.space_id);
    byTier.set(link.tier_id, arr);
  }

  return list.map((t) => ({ ...t, spaceIds: byTier.get(t.id) ?? [] }));
}
