import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, FeatureKey } from "@/types/database";

type Client = SupabaseClient<Database>;

// Explicit per-community sort positions for the built-in nav items (Events,
// Search). Keys with no row are omitted — callers fall back to
// defaultNavItemSort (src/lib/nav-items.ts), which sorts them after spaces.
export async function getCommunityNavItemOrder(
  supabase: Client,
  communityId: string
): Promise<Partial<Record<FeatureKey, number>>> {
  const { data, error } = await supabase
    .from("community_nav_item_order")
    .select("item_key, sort_order")
    .eq("community_id", communityId);

  if (error) throw error;

  const order: Partial<Record<FeatureKey, number>> = {};
  for (const row of data ?? []) {
    order[row.item_key as FeatureKey] = row.sort_order;
  }
  return order;
}
