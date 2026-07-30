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

// How many active (non-archived) tiers a community has — used to decide whether
// to surface the Membership nav link/page at all.
export async function countActiveTiers(supabase: Client, communityId: string): Promise<number> {
  const { count } = await supabase
    .from("community_tiers")
    .select("id", { count: "exact", head: true })
    .eq("community_id", communityId)
    .is("archived_at", null);
  return count ?? 0;
}

// The ids of tiers the user currently holds an active (paid-up) subscription to,
// within a community. Drives the "you're a member" state on the join page.
export async function getActiveTierIds(supabase: Client, communityId: string, userId: string): Promise<Set<string>> {
  const map = await getMyTierSubscriptions(supabase, communityId, userId);
  return new Set([...map].filter(([, s]) => s.active).map(([tierId]) => tierId));
}

export type MyTierSubscription = {
  // Access is currently granted (paid-up).
  active: boolean;
  // Scheduled to cancel at period end (access continues until then).
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
};

// The viewer's tier subscriptions in a community, keyed by tier id — active
// state plus the cancellation status the Membership page uses to offer
// Cancel / Resume.
export async function getMyTierSubscriptions(
  supabase: Client,
  communityId: string,
  userId: string
): Promise<Map<string, MyTierSubscription>> {
  const { data } = await supabase
    .from("tier_subscriptions")
    .select("tier_id, status, current_period_end, cancel_at_period_end")
    .eq("community_id", communityId)
    .eq("user_id", userId);

  const now = new Date();
  const map = new Map<string, MyTierSubscription>();
  for (const s of data ?? []) {
    const active =
      (s.status === "active" || s.status === "trialing") &&
      (!s.current_period_end || new Date(s.current_period_end) > now);
    map.set(s.tier_id, { active, cancelAtPeriodEnd: s.cancel_at_period_end, currentPeriodEnd: s.current_period_end });
  }
  return map;
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
