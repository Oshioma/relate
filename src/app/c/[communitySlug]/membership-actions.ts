"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isStripeConfigured, setSubscriptionCancellation } from "@/lib/stripe";
import { startTierCheckout, type CheckoutResult } from "@/lib/start-checkout";

export type { CheckoutResult };
export type CancelResult = { error: string | null };

// Start a Stripe Checkout subscription for a membership tier and hand the
// browser the redirect URL. Like subscribeToSpace, this is a direct charge on
// the community's connected account (the owner keeps 100%); the webhook records
// the tier subscription on success, which unlocks the tier's spaces. Anyone
// signed in may buy a plan, member or not: paying makes them a member. Signed
// out visitors use the shareable link instead (membership/join/<tier>).
export async function subscribeToTier(tierId: string, communitySlug: string): Promise<CheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to join this membership." };
  return startTierCheckout(tierId, communitySlug, { id: user.id, email: user.email ?? null });
}

// Schedule the member's own tier subscription to cancel at period end (or, with
// cancel=false, resume it). Access continues until the period ends. The Stripe
// call runs on the community's connected account; the flag is also written
// straight away (via the service-role client, after the RLS-checked read
// confirms ownership) so the UI reflects it without waiting on the webhook.
async function setTierCancellation(tierId: string, communitySlug: string, cancel: boolean): Promise<CancelResult> {
  if (!isStripeConfigured()) return { error: "Payments aren't available on this platform yet." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  // RLS returns only the caller's own subscription rows.
  const { data: sub } = await supabase
    .from("tier_subscriptions")
    .select("id, stripe_subscription_id, community_id")
    .eq("tier_id", tierId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!sub || !sub.stripe_subscription_id) return { error: "No active subscription to change." };

  const { data: community } = await supabase
    .from("communities")
    .select("stripe_account_id")
    .eq("id", sub.community_id)
    .maybeSingle();
  if (!community?.stripe_account_id) return { error: "This community's payment account isn't available." };

  try {
    await setSubscriptionCancellation({
      stripeAccount: community.stripe_account_id,
      subscriptionId: sub.stripe_subscription_id,
      cancelAtPeriodEnd: cancel,
    });
  } catch (err) {
    return { error: (err as Error).message || "Couldn't update the subscription." };
  }

  // Reflect immediately; the webhook will confirm the same value.
  await createAdminClient().from("tier_subscriptions").update({ cancel_at_period_end: cancel }).eq("id", sub.id);

  revalidatePath(`/c/${communitySlug}/membership`);
  return { error: null };
}

export async function cancelTierSubscription(tierId: string, communitySlug: string): Promise<CancelResult> {
  return setTierCancellation(tierId, communitySlug, true);
}

export async function resumeTierSubscription(tierId: string, communitySlug: string): Promise<CancelResult> {
  return setTierCancellation(tierId, communitySlug, false);
}

// Per-space equivalent of setTierCancellation, for individually-priced spaces.
async function setSpaceCancellation(spaceId: string, communitySlug: string, cancel: boolean): Promise<CancelResult> {
  if (!isStripeConfigured()) return { error: "Payments aren't available on this platform yet." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { data: sub } = await supabase
    .from("space_subscriptions")
    .select("id, stripe_subscription_id, community_id")
    .eq("space_id", spaceId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!sub || !sub.stripe_subscription_id) return { error: "No active subscription to change." };

  const { data: community } = await supabase
    .from("communities")
    .select("stripe_account_id")
    .eq("id", sub.community_id)
    .maybeSingle();
  if (!community?.stripe_account_id) return { error: "This community's payment account isn't available." };

  try {
    await setSubscriptionCancellation({
      stripeAccount: community.stripe_account_id,
      subscriptionId: sub.stripe_subscription_id,
      cancelAtPeriodEnd: cancel,
    });
  } catch (err) {
    return { error: (err as Error).message || "Couldn't update the subscription." };
  }

  await createAdminClient().from("space_subscriptions").update({ cancel_at_period_end: cancel }).eq("id", sub.id);

  revalidatePath(`/c/${communitySlug}/membership`);
  return { error: null };
}

export async function cancelSpaceSubscription(spaceId: string, communitySlug: string): Promise<CancelResult> {
  return setSpaceCancellation(spaceId, communitySlug, true);
}

export async function resumeSpaceSubscription(spaceId: string, communitySlug: string): Promise<CancelResult> {
  return setSpaceCancellation(spaceId, communitySlug, false);
}
