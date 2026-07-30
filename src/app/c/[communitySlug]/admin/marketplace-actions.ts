"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMembership } from "@/lib/data/community";
import { isStripeConfigured, createBillingCheckoutSession } from "@/lib/stripe";

async function requestBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

// Confirm the caller is an admin/owner of the community.
async function requireAdmin(communityId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "You need to be signed in." };

  const membership = await getMembership(supabase, communityId, user.id);
  const isAdmin = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  if (!isAdmin) return { ok: false as const, error: "Only community admins can manage the marketplace." };

  return { ok: true as const, supabase, user };
}

export type PackResult = { error: string } | { ok: true } | { url: string };

// Install a FREE pack. Verifies the pack really is free (an admin can't sneak a
// paid pack in for nothing) and writes the addon via the service-role client,
// since the addons table is service-role-write-only.
export async function installFreePack(communityId: string, packId: string): Promise<PackResult> {
  const ctx = await requireAdmin(communityId);
  if (!ctx.ok) return { error: ctx.error };

  const { data: pack } = await ctx.supabase
    .from("feature_packs")
    .select("id, price_cents, is_active")
    .eq("id", packId)
    .maybeSingle();
  if (!pack || !pack.is_active) return { error: "That pack isn't available." };
  if (pack.price_cents > 0) return { error: "This is a paid pack — subscribe instead." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("community_feature_addons")
    .upsert({ community_id: communityId, pack_id: packId, status: "active", updated_at: new Date().toISOString() }, { onConflict: "community_id,pack_id" });
  if (error) return { error: error.message };

  return { ok: true };
}

// Remove a FREE pack. Paid packs are cancelled through the Stripe billing
// portal (Plan section), not here.
export async function uninstallFreePack(communityId: string, packId: string): Promise<PackResult> {
  const ctx = await requireAdmin(communityId);
  if (!ctx.ok) return { error: ctx.error };

  const { data: pack } = await ctx.supabase.from("feature_packs").select("price_cents").eq("id", packId).maybeSingle();
  if (pack && pack.price_cents > 0) return { error: "Manage paid packs from Billing." };

  const admin = createAdminClient();
  const { error } = await admin.from("community_feature_addons").delete().eq("community_id", communityId).eq("pack_id", packId);
  if (error) return { error: error.message };
  return { ok: true };
}

// Subscribe to a PAID pack via Stripe Checkout (platform billing). The webhook
// records the addon on payment.
export async function subscribeToPack(communityId: string, packId: string): Promise<PackResult> {
  if (!isStripeConfigured()) return { error: "Billing isn't available on this platform yet." };

  const ctx = await requireAdmin(communityId);
  if (!ctx.ok) return { error: ctx.error };

  const { data: community } = await ctx.supabase
    .from("communities")
    .select("slug, plan_stripe_customer_id")
    .eq("id", communityId)
    .maybeSingle();
  if (!community) return { error: "Community not found." };

  const { data: pack } = await ctx.supabase
    .from("feature_packs")
    .select("id, name, price_cents, stripe_price_id, is_active")
    .eq("id", packId)
    .maybeSingle();
  if (!pack || !pack.is_active) return { error: "That pack isn't available." };
  if (pack.price_cents === 0) return { error: "This pack is free — install it instead." };
  if (!pack.stripe_price_id) return { error: "This pack isn't ready for checkout yet — no Stripe price is configured." };

  const base = await requestBaseUrl();
  const adminUrl = `${base}/c/${community.slug}/admin`;

  try {
    const session = await createBillingCheckoutSession({
      priceId: pack.stripe_price_id,
      successUrl: `${adminUrl}?pack=installed`,
      cancelUrl: adminUrl,
      customerId: community.plan_stripe_customer_id ?? undefined,
      customerEmail: community.plan_stripe_customer_id ? undefined : ctx.user.email ?? undefined,
      metadata: { community_id: communityId, pack_id: pack.id },
    });
    return { url: session.url };
  } catch (err) {
    return { error: (err as Error).message || "Couldn't start checkout." };
  }
}
