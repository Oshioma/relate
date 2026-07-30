"use server";

import { createClient } from "@/lib/supabase/server";

export type PushSubscriptionInput = { endpoint: string; p256dh: string; auth: string };

// Store (or refresh) a Web Push subscription for the signed-in member. Keyed by
// endpoint (globally unique), so re-subscribing the same device upserts.
export async function savePushSubscription(sub: PushSubscriptionInput): Promise<{ error: string | null }> {
  if (!sub.endpoint || !sub.p256dh || !sub.auth) return { error: "Incomplete subscription." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert(
      { user_id: user.id, endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
      { onConflict: "endpoint" }
    );
  return { error: error?.message ?? null };
}

export async function removePushSubscription(endpoint: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint).eq("user_id", user.id);
  return { error: error?.message ?? null };
}
