"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isStripeConfigured, createTierCheckoutSession, setSubscriptionCancellation } from "@/lib/stripe";
import { communityCanCharge } from "@/lib/data/plan-limits";

export type CheckoutResult = { error: string } | { url: string };
export type CancelResult = { error: string | null };

// Build an absolute base URL for Stripe's return links from the request host, so
// checkout returns to whatever host (subdomain / custom domain) the member is
// on. Mirrors paywall-actions.ts.
async function requestBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

// Start a Stripe Checkout subscription for a membership tier and hand the
// browser the redirect URL. Like subscribeToSpace, this is a direct charge on
// the community's connected account (the owner keeps 100%); the webhook records
// the tier subscription on success, which unlocks the tier's spaces.
export async function subscribeToTier(tierId: string, communitySlug: string): Promise<CheckoutResult> {
  if (!isStripeConfigured()) {
    return { error: "Payments aren't available on this platform yet." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to join this membership." };

  // RLS only returns tiers to members of the community, so a non-member reading
  // this resolves to null — they need to join the (free) community first.
  const { data: tier } = await supabase
    .from("community_tiers")
    .select("id, name, price_cents, currency, community_id, archived_at")
    .eq("id", tierId)
    .maybeSingle();
  if (!tier) return { error: "Membership tier not found." };
  if (tier.archived_at) return { error: "This membership is no longer available." };
  if (tier.price_cents <= 0) return { error: "This membership is free — no subscription needed." };

  const { data: community } = await supabase
    .from("communities")
    .select("id, name, stripe_account_id, stripe_charges_enabled")
    .eq("id", tier.community_id)
    .maybeSingle();
  if (!community?.stripe_account_id || !community.stripe_charges_enabled) {
    return { error: "This community hasn't finished setting up payments yet. Try again later." };
  }

  // Same gate as the per-space paywall: a lapsed plan stops NEW paid
  // memberships. Members already on this tier keep it and keep renewing.
  if (!(await communityCanCharge(supabase, community.id))) {
    return {
      error: "This membership isn't open to new subscribers right now. Please check back later, or contact the community's admins.",
    };
  }

  const base = await requestBaseUrl();
  const communityUrl = `${base}/c/${communitySlug}`;

  try {
    const session = await createTierCheckoutSession({
      stripeAccount: community.stripe_account_id,
      priceCents: tier.price_cents,
      currency: tier.currency,
      productName: `${tier.name} — ${community.name}`,
      successUrl: `${communityUrl}?subscribed=1`,
      cancelUrl: communityUrl,
      customerEmail: user.email ?? undefined,
      metadata: { tier_id: tier.id, user_id: user.id, community_id: community.id },
    });
    return { url: session.url };
  } catch (err) {
    return { error: (err as Error).message || "Couldn't start checkout." };
  }
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
