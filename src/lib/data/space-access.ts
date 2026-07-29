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
