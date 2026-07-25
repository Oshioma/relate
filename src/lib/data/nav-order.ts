import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, FeatureKey } from "@/types/database";

type Client = SupabaseClient<Database>;

// The saved sidebar settings for one built-in nav item: its explicit sort
// position and whether the admin has hidden it from the nav.
export type NavItemSetting = { sortOrder: number; showInNav: boolean };

// Explicit per-community settings for the built-in nav items (Events,
// Search). Keys with no row are omitted — callers fall back to
// defaultNavItemSort (src/lib/nav-items.ts) for position and treat the item as
// visible.
export async function getCommunityNavItemOrder(
  supabase: Client,
  communityId: string
): Promise<Partial<Record<FeatureKey, NavItemSetting>>> {
  const { data, error } = await supabase
    .from("community_nav_item_order")
    .select("item_key, sort_order, show_in_nav")
    .eq("community_id", communityId);

  if (error) throw error;

  const settings: Partial<Record<FeatureKey, NavItemSetting>> = {};
  for (const row of data ?? []) {
    settings[row.item_key as FeatureKey] = { sortOrder: row.sort_order, showInNav: row.show_in_nav };
  }
  return settings;
}
