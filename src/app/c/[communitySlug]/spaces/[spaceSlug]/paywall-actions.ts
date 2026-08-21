"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isStripeConfigured, createSpaceCheckoutSession } from "@/lib/stripe";
import { communityCanCharge } from "@/lib/data/plan-limits";

export type CheckoutResult = { error: string } | { url: string };

// Build an absolute base URL for Stripe's return links. Communities can live on
// subdomains or custom domains, so trust the request host (the same one the
// member is on) rather than a single configured origin, falling back to
// NEXT_PUBLIC_SITE_URL when no host header is present.
async function requestBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

// Start a Stripe Checkout subscription for a paid space and hand the browser
// the redirect URL. The member ends up on the connected account's checkout
// (direct charge — the owner keeps 100%); the webhook grants access on success.
export async function subscribeToSpace(spaceId: string, communitySlug: string, spaceSlug: string): Promise<CheckoutResult> {
  if (!isStripeConfigured()) {
    return { error: "Payments aren't available on this platform yet." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to subscribe to this space." };

  const { data: space } = await supabase
    .from("spaces")
    .select("id, name, price_cents, currency, community_id")
    .eq("id", spaceId)
    .maybeSingle();
  if (!space) return { error: "Space not found." };
  if (space.price_cents <= 0) return { error: "This space is free — no subscription needed." };

  const { data: community } = await supabase
    .from("communities")
    .select("id, name, stripe_account_id, stripe_charges_enabled")
    .eq("id", space.community_id)
    .maybeSingle();
  if (!community?.stripe_account_id || !community.stripe_charges_enabled) {
    return { error: "This community hasn't finished setting up payments yet. Try again later." };
  }

  // Charging members is a paid-plan capability, and it has to be checked HERE
  // and not only where a price is set: otherwise a community whose plan lapsed
  // keeps signing up new paying members forever off a price it set while
  // subscribed. Members who already subscribed are unaffected — this blocks new
  // subscriptions, never existing ones.
  if (!(await communityCanCharge(supabase, community.id))) {
    return {
      error: "This space isn't accepting new subscriptions right now. Please check back later, or contact the community's admins.",
    };
  }

  const base = await requestBaseUrl();
  const spaceUrl = `${base}/c/${communitySlug}/spaces/${spaceSlug}`;

  try {
    const session = await createSpaceCheckoutSession({
      stripeAccount: community.stripe_account_id,
      priceCents: space.price_cents,
      currency: space.currency,
      productName: `${space.name} — ${community.name}`,
      successUrl: `${spaceUrl}?subscribed=1`,
      cancelUrl: spaceUrl,
      customerEmail: user.email ?? undefined,
      metadata: { space_id: space.id, user_id: user.id, community_id: community.id },
    });
    return { url: session.url };
  } catch (err) {
    return { error: (err as Error).message || "Couldn't start checkout." };
  }
}
