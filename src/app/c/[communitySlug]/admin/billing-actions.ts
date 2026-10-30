"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMembership } from "@/lib/data/community";
import { normalizeCurrency } from "@/lib/currencies";
import {
  isStripeConfigured,
  createConnectAccount,
  createAccountLink,
  retrieveAccount,
  createBillingCheckoutSession,
  createBillingPortalSession,
  retrieveSubscription,
  changeSubscriptionPrice,
  uploadAccountBrandingFile,
  updateAccountBranding,
} from "@/lib/stripe";
import { CHECKOUT_MESSAGE_MAX } from "@/lib/checkout-look";

async function requestBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

// Where Stripe sends the owner back to. These flows are started from two
// places now — the community admin page and the public price list — so the
// caller says where it wants to land. Anything that isn't a plain in-app path
// is ignored rather than trusted: this value ends up in a redirect URL, and
// "//evil.example" is a path to the browser but an origin to the URL parser.
function safeReturnPath(path: string | undefined, fallback: string): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}

type AdminCommunity = {
  id: string;
  slug: string;
  name: string;
  stripe_account_id: string | null;
  stripe_charges_enabled: boolean;
  plan_stripe_customer_id: string | null;
  plan_id: string | null;
  plan_status: string;
  plan_stripe_subscription_id: string | null;
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
    .select(
      "id, slug, name, stripe_account_id, stripe_charges_enabled, plan_stripe_customer_id, plan_id, plan_status, plan_stripe_subscription_id"
    )
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
// Three outcomes: an error, a Checkout URL to send the owner to (their first
// paid plan), or `switched` — an existing subscription was moved onto the new
// price in place, with no checkout to visit. The caller shows the "finalizing"
// state for that last one, since the webhook writes the new plan a moment later.
export type PlanCheckoutResult = { error: string } | { url: string } | { switched: true };

// States in which the community's plan is genuinely in force — a live Stripe
// subscription to modify rather than replace, or a complimentary grant
// ('comped', no Stripe subscription, so the modify-in-place branch below
// never applies to it).
function isLiveSubscription(status: string): boolean {
  return status === "active" || status === "trialing" || status === "comped";
}

// Put a community on a plan.
//
// With a live subscription this CHANGES that subscription's price — upgrade or
// downgrade — rather than starting a second one. Sending an existing subscriber
// back through Checkout creates a parallel subscription: the community row
// would point at the new one while Stripe quietly kept charging for the old,
// billing the owner twice with nothing in the app to show it.
//
// Without one, it's a normal Checkout; the webhook records the plan when
// payment completes.
export async function subscribeCommunityToPlan(
  communityId: string,
  planId: string,
  returnPath?: string
): Promise<PlanCheckoutResult> {
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

  if (plan.id === community.plan_id && isLiveSubscription(community.plan_status)) {
    return { error: "That's already your plan." };
  }

  // Already paying: move the existing subscription across.
  if (community.plan_stripe_subscription_id && isLiveSubscription(community.plan_status)) {
    try {
      const subscription = await retrieveSubscription(community.plan_stripe_subscription_id);
      const item = subscription.items?.data?.[0];
      if (item?.id) {
        await changeSubscriptionPrice({
          subscriptionId: subscription.id,
          itemId: item.id,
          priceId: plan.stripe_price_id,
          metadata: { community_id: community.id, plan_id: plan.id },
        });
        // The plan_* columns are webhook-only (a DB trigger rejects writes from
        // anon/authenticated), so the row updates when customer.subscription
        // .updated arrives — moments later. The caller refreshes.
        revalidatePath(`/c/${community.slug}/admin`);
        return { switched: true };
      }
      // A subscription with no items is broken beyond what this flow should
      // guess at; fall through to Checkout rather than compounding it.
    } catch (err) {
      return { error: (err as Error).message || "Couldn't change your plan." };
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const base = await requestBaseUrl();
  const returnUrl = `${base}${safeReturnPath(returnPath, `/c/${community.slug}/admin`)}`;
  const separator = returnUrl.includes("?") ? "&" : "?";

  try {
    const session = await createBillingCheckoutSession({
      priceId: plan.stripe_price_id,
      successUrl: `${returnUrl}${separator}plan=subscribed`,
      cancelUrl: returnUrl,
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
export async function openBillingPortal(communityId: string, returnPath?: string): Promise<PortalResult> {
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
      returnUrl: `${base}${safeReturnPath(returnPath, `/c/${community.slug}/admin`)}`,
    });
    return { url: session.url };
  } catch (err) {
    return { error: (err as Error).message || "Couldn't open the billing portal." };
  }
}

// The community's one currency. Every price is charged in it, so changing it
// moves every existing tier, course and space price over too. The amounts stay
// the same numbers (£10 was $10); nothing is converted. Anyone already
// subscribed keeps paying what Stripe agreed with them; new checkouts use the
// new currency.
export async function setCommunityCurrency(
  communityId: string,
  communitySlug: string,
  rawCurrency: string
): Promise<{ error: string | null }> {
  const currency = normalizeCurrency(rawCurrency);
  if (!currency) return { error: "Pick a currency from the list." };

  const ctx = await requireAdminCommunity(communityId);
  if (!ctx.ok) return { error: ctx.error };
  const { supabase } = ctx;

  const { error } = await supabase.from("communities").update({ currency }).eq("id", communityId);
  if (error) return { error: error.message };
  for (const table of ["community_tiers", "courses", "spaces"] as const) {
    const { error: priceError } = await supabase.from(table).update({ currency }).eq("community_id", communityId);
    if (priceError) return { error: `Saved, but some prices weren't moved over: ${priceError.message}` };
  }

  revalidatePath(`/c/${communitySlug}`, "layout");
  return { error: null };
}

// The community's own line under the Pay button on its Stripe Checkout pages
// (tiers, courses, paid spaces). Blank = our default line.
export async function setCheckoutMessage(
  communityId: string,
  communitySlug: string,
  rawMessage: string
): Promise<{ error: string | null }> {
  const message = rawMessage.replace(/\s+/g, " ").trim();
  if (message.length > CHECKOUT_MESSAGE_MAX) return { error: `Keep it under ${CHECKOUT_MESSAGE_MAX} characters.` };

  const ctx = await requireAdminCommunity(communityId);
  if (!ctx.ok) return { error: ctx.error };

  const { error } = await ctx.supabase
    .from("communities")
    .update({ checkout_message: message || null })
    .eq("id", communityId);
  if (error) {
    // The column arrives with migration 20261026220603.
    if (/checkout_message/.test(error.message)) {
      return { error: "This needs a quick database update first. Ask the platform team to apply the latest migration." };
    }
    return { error: error.message };
  }
  revalidatePath(`/c/${communitySlug}/admin`);
  return { error: null };
}

// One membership tier's own Checkout look: the line under the Pay button and
// the picture beside the product. Blank = the community's line / cover photo.
// The picture must be one uploaded to our own storage.
export async function setTierCheckoutLook(
  communityId: string,
  communitySlug: string,
  tierId: string,
  rawMessage: string,
  rawImageUrl: string
): Promise<{ error: string | null }> {
  const message = rawMessage.replace(/\s+/g, " ").trim();
  if (message.length > CHECKOUT_MESSAGE_MAX) return { error: `Keep it under ${CHECKOUT_MESSAGE_MAX} characters.` };
  const imageUrl = rawImageUrl.trim();
  if (imageUrl && !isOwnStorageUrl(imageUrl)) return { error: "Upload the picture here rather than pasting an address." };

  const ctx = await requireAdminCommunity(communityId);
  if (!ctx.ok) return { error: ctx.error };

  const { data, error } = await ctx.supabase
    .from("community_tiers")
    .update({ checkout_message: message || null, checkout_image_url: imageUrl || null })
    .eq("id", tierId)
    .eq("community_id", communityId)
    .select("id");
  if (error) {
    // The columns arrive with migration 20261030195412.
    if (/checkout_(message|image_url)/.test(error.message)) {
      return { error: "This needs a quick database update first. Ask the platform team to apply the latest migration." };
    }
    return { error: error.message };
  }
  if (!data?.length) return { error: "That tier wasn't found." };
  revalidatePath(`/c/${communitySlug}/admin`);
  return { error: null };
}

// Put the community's logo (and accent colour) on its Stripe account, so every
// Checkout page shows it at the top. Only an image in our own storage is
// fetched: the URL is fetched server-side, so a pasted address elsewhere is
// never followed.
export async function syncCheckoutBranding(communityId: string, communitySlug: string): Promise<{ error: string | null }> {
  if (!isStripeConfigured()) return { error: "Payments aren't available on this platform yet." };
  const ctx = await requireAdminCommunity(communityId);
  if (!ctx.ok) return { error: ctx.error };
  const account = ctx.community.stripe_account_id;
  if (!account) return { error: "Connect Stripe first." };

  const { data: row } = await ctx.supabase.from("communities").select("logo_url, accent_color").eq("id", communityId).maybeSingle();
  const logoUrl = row?.logo_url ?? null;
  if (!logoUrl || !isOwnStorageUrl(logoUrl)) {
    return { error: "Add a logo to the community first (Admin → Community details), then try again." };
  }

  try {
    const res = await fetch(logoUrl, { cache: "no-store" });
    if (!res.ok) return { error: "Couldn't read the community logo." };
    const source = Buffer.from(await res.arrayBuffer());
    const { logo, icon } = await brandingImages(source);
    const [logoFile, iconFile] = await Promise.all([
      uploadAccountBrandingFile({ stripeAccount: account, purpose: "business_logo", bytes: logo, filename: "logo.png", contentType: "image/png" }),
      uploadAccountBrandingFile({ stripeAccount: account, purpose: "business_icon", bytes: icon, filename: "icon.png", contentType: "image/png" }),
    ]);
    await updateAccountBranding({
      account,
      logoFileId: logoFile.id,
      iconFileId: iconFile.id,
      primaryColor: /^#[0-9a-f]{6}$/i.test(row?.accent_color ?? "") ? row!.accent_color : null,
    });
  } catch (err) {
    return { error: (err as Error).message || "Couldn't update the Stripe branding." };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  return { error: null };
}

function isOwnStorageUrl(url: string): boolean {
  try {
    const own = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
    const target = new URL(url);
    return target.protocol === "https:" && target.host === own.host && target.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    return false;
  }
}

// Stripe wants PNG or JPG under 512 KB, at least 128 px; the icon square.
async function brandingImages(source: Buffer): Promise<{ logo: Uint8Array; icon: Uint8Array }> {
  const { default: sharp } = await import("sharp");
  const logo = await sharp(source)
    .resize(512, 512, { fit: "inside" })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  const icon = await sharp(source)
    .resize(256, 256, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  return { logo: new Uint8Array(logo), icon: new Uint8Array(icon) };
}
