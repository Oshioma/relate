import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

// Whether the user holds a paid-up subscription to a paid space. Mirrors the
// has_active_space_subscription() SQL used by RLS, but queried from the app so
// the space page can decide whether to render the paywall or the content.
// RLS on space_subscriptions only returns the caller's own rows, so this is
// safe to call with the user-scoped client.
export async function hasActiveSpaceSubscription(supabase: Client, spaceId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("space_subscriptions")
    .select("status, current_period_end")
    .eq("space_id", spaceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return false;
  if (data.status !== "active" && data.status !== "trialing") return false;
  if (data.current_period_end && new Date(data.current_period_end) <= new Date()) return false;
  return true;
}

export type MySpaceSubscription = {
  spaceId: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
};

// The viewer's active per-space subscriptions within a community, for the
// Membership page's "your subscriptions" management list. RLS returns only the
// caller's own space_subscriptions rows.
export async function getMyActiveSpaceSubscriptions(
  supabase: Client,
  communityId: string,
  userId: string
): Promise<MySpaceSubscription[]> {
  const { data } = await supabase
    .from("space_subscriptions")
    .select("space_id, status, current_period_end, cancel_at_period_end")
    .eq("community_id", communityId)
    .eq("user_id", userId);

  const now = new Date();
  return (data ?? [])
    .filter(
      (s) =>
        (s.status === "active" || s.status === "trialing") &&
        (!s.current_period_end || new Date(s.current_period_end) > now)
    )
    .map((s) => ({ spaceId: s.space_id, cancelAtPeriodEnd: s.cancel_at_period_end, currentPeriodEnd: s.current_period_end }));
}

// Whether the user holds a paid-up subscription to any tier that includes this
// space. Mirrors has_active_tier_for_space() in RLS, queried from the app so the
// space page can decide paywall vs content. tier_spaces is member-readable and
// tier_subscriptions returns the caller's own rows, so this is safe on the
// user-scoped client.
export async function hasActiveTierForSpace(supabase: Client, spaceId: string, userId: string): Promise<boolean> {
  const { data: links } = await supabase.from("tier_spaces").select("tier_id").eq("space_id", spaceId);
  const tierIds = [...new Set((links ?? []).map((l) => l.tier_id))];
  if (tierIds.length === 0) return false;

  const { data } = await supabase
    .from("tier_subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .in("tier_id", tierIds);

  return (data ?? []).some(
    (s) =>
      (s.status === "active" || s.status === "trialing") &&
      (!s.current_period_end || new Date(s.current_period_end) > new Date())
  );
}
