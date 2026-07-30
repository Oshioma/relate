"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isStripeConfigured, createTierCheckoutSession } from "@/lib/stripe";

export type CheckoutResult = { error: string } | { url: string };

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
