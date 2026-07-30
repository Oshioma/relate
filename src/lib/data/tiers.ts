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

export type SpaceTierOption = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  archived_at: string | null;
  // How many spaces this tier unlocks in total (for "includes this + N more").
  spaceCount: number;
};

// The tiers that include a given space, with how many spaces each unlocks.
// Drives the join options on a gated space's paywall. Returns archived tiers too
// (the caller decides — access still counts them, but join options shouldn't).
export async function getTiersForSpace(supabase: Client, spaceId: string): Promise<SpaceTierOption[]> {
  const { data: links } = await supabase.from("tier_spaces").select("tier_id").eq("space_id", spaceId);
  const tierIds = [...new Set((links ?? []).map((l) => l.tier_id))];
  if (tierIds.length === 0) return [];

  const { data: tiers } = await supabase
    .from("community_tiers")
    .select("id, name, description, price_cents, currency, archived_at, sort_order")
    .in("id", tierIds)
    .order("sort_order", { ascending: true });

  // Total spaces per covering tier (a separate pass so the count includes spaces
  // other than this one).
  const { data: allLinks } = await supabase.from("tier_spaces").select("tier_id").in("tier_id", tierIds);
  const counts = new Map<string, number>();
  for (const link of allLinks ?? []) counts.set(link.tier_id, (counts.get(link.tier_id) ?? 0) + 1);

  return (tiers ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    price_cents: t.price_cents,
    currency: t.currency,
    archived_at: t.archived_at,
    spaceCount: counts.get(t.id) ?? 0,
  }));
}
