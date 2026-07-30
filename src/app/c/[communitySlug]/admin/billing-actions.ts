"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMembership } from "@/lib/data/community";
import {
  isStripeConfigured,
  createConnectAccount,
  createAccountLink,
  retrieveAccount,
  createBillingCheckoutSession,
  createBillingPortalSession,
} from "@/lib/stripe";

async function requestBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

type AdminCommunity = {
  id: string;
  slug: string;
  name: string;
  stripe_account_id: string | null;
  stripe_charges_enabled: boolean;
  plan_stripe_customer_id: string | null;
};

// Confirm the caller is an admin/owner of the community, returning the client
// and the row we need (id + connected-account state) or an error string. The
// `ok` discriminant lets callers narrow cleanly.
async function requireAdminCommunity(
  communityId: string
): Promise<{ ok: false; error: string } | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; community: AdminCommunity }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const membership = await getMembership(supabase, communityId, user.id);
  const isAdmin = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  if (!isAdmin) return { ok: false, error: "Only community admins can manage payments." };

  const { data: community } = await supabase
    .from("communities")
    .select("id, slug, name, stripe_account_id, stripe_charges_enabled, plan_stripe_customer_id")
    .eq("id", communityId)
    .maybeSingle();
  if (!community) return { ok: false, error: "Community not found." };

  return { ok: true, supabase, community };
}

export type ConnectResult = { error: string } | { url: string };

// Create (or reuse) the community's Connect Express account and hand back a
// Stripe-hosted onboarding link. The member returns to the admin page, where
// the billing section refreshes the account's status.
export async function startStripeConnectOnboarding(communityId: string): Promise<ConnectResult> {
  if (!isStripeConfigured()) {
    return { error: "Payments aren't available on this platform yet — no Stripe key is configured." };
  }

  const ctx = await requireAdminCommunity(communityId);
  if (!ctx.ok) return { error: ctx.error };
  const { supabase, community } = ctx;

  // Charging members is a paid-plan capability. Gate connecting Stripe on it so
  // an owner can't set up collection without an eligible plan.
  const { data: canCharge } = await supabase.rpc("community_can_charge", { p_community_id: community.id });
  if (!canCharge) {
    return { error: "Charging members is a paid-plan feature. Upgrade your plan to connect payments." };
  }

  try {
    let accountId = community.stripe_account_id;
    if (!accountId) {
      const account = await createConnectAccount();
      accountId = account.id;
      const { error } = await supabase.from("communities").update({ stripe_account_id: accountId }).eq("id", community.id);
      if (error) return { error: error.message };
    }

    const base = await requestBaseUrl();
    const returnUrl = `${base}/c/${community.slug}/admin?stripe=return`;
    const link = await createAccountLink({ account: accountId, refreshUrl: returnUrl, returnUrl });
    return { url: link.url };
  } catch (err) {
    return { error: (err as Error).message || "Couldn't start Stripe onboarding." };
  }
}

export type RefreshResult = { error: string } | { chargesEnabled: boolean };

// Pull the connected account's current charges_enabled flag from Stripe and
// store it. Called when the owner returns from onboarding (the account.updated
// webhook keeps it fresh afterwards).
export async function refreshStripeAccountStatus(communityId: string, communitySlug: string): Promise<RefreshResult> {
  if (!isStripeConfigured()) return { error: "Payments aren't configured on this platform." };

  const ctx = await requireAdminCommunity(communityId);
  if (!ctx.ok) return { error: ctx.error };
  const { supabase, community } = ctx;

  if (!community.stripe_account_id) return { error: "No Stripe account connected yet." };

  try {
    const account = await retrieveAccount(community.stripe_account_id);
    const chargesEnabled = Boolean(account.charges_enabled);
    const { error } = await supabase
      .from("communities")
      .update({ stripe_charges_enabled: chargesEnabled })
      .eq("id", community.id);
    if (error) return { error: error.message };

    revalidatePath(`/c/${communitySlug}/admin`);
    return { chargesEnabled };
  } catch (err) {
    return { error: (err as Error).message || "Couldn't refresh Stripe status." };
  }
}

// --- Platform plan (the platform charges the owner) -------------------------
export type PlanCheckoutResult = { error: string } | { url: string };

// Start Stripe Checkout for a platform plan. The webhook records the plan on
// the community once payment completes.
export async function subscribeCommunityToPlan(communityId: string, planId: string): Promise<PlanCheckoutResult> {
  if (!isStripeConfigured()) {
    return { error: "Billing isn't available on this platform yet — no Stripe key is configured." };
  }

  const ctx = await requireAdminCommunity(communityId);
  if (!ctx.ok) return { error: ctx.error };
  const { supabase, community } = ctx;

  const { data: plan } = await supabase
    .from("platform_plans")
    .select("id, name, price_cents, stripe_price_id, is_active")
    .eq("id", planId)
    .maybeSingle();
  if (!plan || !plan.is_active) return { error: "That plan isn't available." };
  if (plan.price_cents === 0) return { error: "The free plan needs no checkout." };
  if (!plan.stripe_price_id) {
    return { error: "This plan isn't ready for checkout yet — no Stripe price is configured." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const base = await requestBaseUrl();
  const adminUrl = `${base}/c/${community.slug}/admin`;

  try {
    const session = await createBillingCheckoutSession({
      priceId: plan.stripe_price_id,
      successUrl: `${adminUrl}?plan=subscribed`,
      cancelUrl: adminUrl,
      customerId: community.plan_stripe_customer_id ?? undefined,
      customerEmail: community.plan_stripe_customer_id ? undefined : user?.email ?? undefined,
      metadata: { community_id: community.id, plan_id: plan.id },
    });
    return { url: session.url };
  } catch (err) {
    return { error: (err as Error).message || "Couldn't start checkout." };
  }
}

export type PortalResult = { error: string } | { url: string };

// Open the Stripe billing portal so the owner can change or cancel their plan.
export async function openBillingPortal(communityId: string): Promise<PortalResult> {
  if (!isStripeConfigured()) return { error: "Billing isn't configured on this platform." };

  const ctx = await requireAdminCommunity(communityId);
  if (!ctx.ok) return { error: ctx.error };
  const { community } = ctx;

  if (!community.plan_stripe_customer_id) {
    return { error: "No billing account yet — subscribe to a plan first." };
  }

  const base = await requestBaseUrl();
  try {
    const session = await createBillingPortalSession({
      customerId: community.plan_stripe_customer_id,
      returnUrl: `${base}/c/${community.slug}/admin`,
    });
    return { url: session.url };
  } catch (err) {
    return { error: (err as Error).message || "Couldn't open the billing portal." };
  }
}
