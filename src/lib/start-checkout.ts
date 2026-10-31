import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isStripeConfigured,
  createTierCheckoutSession,
  createCourseCheckoutSession,
  createCourseInstalmentCheckoutSession,
  type CheckoutLook,
  type CheckoutMetadata,
} from "@/lib/stripe";
import { checkoutLookFor } from "@/lib/checkout-look";
import { instalmentPlan } from "@/lib/courses/instalments";
import { communityCanCharge } from "@/lib/data/plan-limits";
import { tierCheckoutDescription } from "@/lib/checkout-description";
import { CHECKOUT_MESSAGES, guestCheckoutReturnPath } from "@/lib/checkout-links";

// Starting Stripe Checkout for a membership tier or a paid course, for either
// a signed-in buyer or a guest (buyer null). The Membership page's Join
// button, the course page's Buy button and the shareable buy links
// (membership/join/<tier>, membership/course/<course>) all come through here.
// Every read uses the service role: a guest can't read tiers or courses under
// RLS, and only one sellable item's name and price are used.

export type CheckoutResult = { error: string } | { url: string };
export type CheckoutBuyer = { id: string; email: string | null } | null;

// Absolute base URL for Stripe's return links from the request host, so
// checkout returns to whatever host (subdomain / custom domain) the buyer is on.
async function requestBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

type Admin = ReturnType<typeof createAdminClient>;
type Look = { recurring: CheckoutLook; oneOff: CheckoutLook };

// The community selling an item, when it can take payments. notFoundMessage is
// the item's own "not found" line, used when the link names another community.
// A tier's own checkout line and picture, when given, win over the community's.
async function chargeableCommunity(
  admin: Admin,
  communityId: string,
  communitySlug: string,
  notFoundMessage: string,
  tier?: { checkout_message?: string | null; checkout_image_url?: string | null }
): Promise<{ error: string } | { community: { id: string; name: string; stripe_account_id: string; look: Look } }> {
  const { data: community } = await admin
    .from("communities")
    // "*" so the checkout look reads checkout_message once its migration is
    // applied, and still works before.
    .select("*")
    .eq("id", communityId)
    .maybeSingle();
  // The link names the community too; a tier id pasted under another
  // community's address isn't sold there.
  if (!community || community.slug !== communitySlug) return { error: notFoundMessage };
  if (!community.stripe_account_id || !community.stripe_charges_enabled) return { error: CHECKOUT_MESSAGES.paymentsNotReady };
  return {
    community: {
      id: community.id,
      name: community.name,
      stripe_account_id: community.stripe_account_id,
      look: { recurring: checkoutLookFor(community, { tier }), oneOff: checkoutLookFor(community, { oneOff: true }) },
    },
  };
}

async function isBanned(admin: Admin, communityId: string, userId: string): Promise<boolean> {
  const { data } = await admin
    .from("community_memberships")
    .select("status")
    .eq("community_id", communityId)
    .eq("user_id", userId)
    .maybeSingle();
  return data?.status === "banned";
}

function metadataFor(buyer: CheckoutBuyer, communityId: string): CheckoutMetadata {
  return buyer ? { community_id: communityId, user_id: buyer.id } : { community_id: communityId, guest: "1" };
}

export async function startTierCheckout(tierId: string, communitySlug: string, buyer: CheckoutBuyer): Promise<CheckoutResult> {
  if (!isStripeConfigured()) return { error: CHECKOUT_MESSAGES.notConfigured };

  const admin = createAdminClient();
  const { data: tier } = await admin
    .from("community_tiers")
    // "*" so the tier's own checkout look is read once its migration
    // (20261030195412) is applied, and still works before.
    .select("*")
    .eq("id", tierId)
    .maybeSingle();
  if (!tier) return { error: CHECKOUT_MESSAGES.tierNotFound };
  if (tier.archived_at) return { error: CHECKOUT_MESSAGES.tierArchived };
  if (tier.price_cents <= 0) return { error: CHECKOUT_MESSAGES.tierFree };

  const found = await chargeableCommunity(admin, tier.community_id, communitySlug, CHECKOUT_MESSAGES.tierNotFound, tier);
  if ("error" in found) return found;
  const { community } = found;

  if (buyer) {
    if (await isBanned(admin, community.id, buyer.id)) return { error: CHECKOUT_MESSAGES.banned };
    const { data: sub } = await admin
      .from("tier_subscriptions")
      .select("status")
      .eq("tier_id", tier.id)
      .eq("user_id", buyer.id)
      .maybeSingle();
    if (sub && (sub.status === "active" || sub.status === "trialing")) return { error: CHECKOUT_MESSAGES.alreadyOnTier };
  }

  // Same gate as the per-space paywall: a lapsed plan stops NEW paid
  // memberships. Members already on this tier keep it and keep renewing.
  if (!(await communityCanCharge(admin, community.id))) {
    return {
      error: CHECKOUT_MESSAGES.tierNotOnSale,
    };
  }

  // What the tier includes, for the Checkout page: the spaces it unlocks (the
  // full description is on the Membership page).
  const { data: tierSpaces } = await admin.from("tier_spaces").select("spaces(name)").eq("tier_id", tier.id);
  const spaceNames = (tierSpaces ?? []).flatMap((row) => {
    const s = row.spaces as { name: string } | { name: string }[] | null;
    return Array.isArray(s) ? s.map((x) => x.name) : s ? [s.name] : [];
  });

  const base = await requestBaseUrl();
  const communityUrl = `${base}/c/${communitySlug}`;

  try {
    const session = await createTierCheckoutSession({
      stripeAccount: community.stripe_account_id,
      priceCents: tier.price_cents,
      currency: tier.currency,
      productName: `${tier.name} — ${community.name}`,
      productDescription: tierCheckoutDescription(spaceNames),
      successUrl: buyer ? `${communityUrl}?subscribed=1` : `${base}${guestCheckoutReturnPath(communitySlug)}`,
      cancelUrl: buyer ? communityUrl : `${communityUrl}/membership`,
      customerEmail: buyer?.email ?? undefined,
      metadata: { ...metadataFor(buyer, community.id), tier_id: tier.id },
      look: community.look.recurring,
    });
    return { url: session.url };
  } catch (err) {
    return { error: (err as Error).message || "Couldn't start checkout." };
  }
}

// `plan` "instalments" is for signed-in buyers only: a guest link always sells
// the course outright (the instalment webhook path keys on the buyer's id).
export async function startCourseCheckout(
  courseId: string,
  communitySlug: string,
  buyer: CheckoutBuyer,
  plan: "one_off" | "instalments" = "one_off"
): Promise<CheckoutResult> {
  if (!isStripeConfigured()) {
    return { error: CHECKOUT_MESSAGES.courseNotConfigured };
  }

  const admin = createAdminClient();
  const { data: course } = await admin
    .from("courses")
    .select("id, title, price_cents, currency, status, community_id, instalment_count, instalment_price_cents, spaces(slug)")
    .eq("id", courseId)
    .maybeSingle();
  if (!course || course.status !== "published") return { error: CHECKOUT_MESSAGES.courseNotOpen };
  if (course.price_cents <= 0) return { error: CHECKOUT_MESSAGES.courseFree };

  const found = await chargeableCommunity(admin, course.community_id, communitySlug, CHECKOUT_MESSAGES.courseNotOpen);
  if ("error" in found) return found;
  const { community } = found;

  if (buyer) {
    if (await isBanned(admin, community.id, buyer.id)) return { error: CHECKOUT_MESSAGES.banned };
    const { data: already } = await admin
      .from("course_enrollments")
      .select("paid")
      .eq("course_id", course.id)
      .eq("user_id", buyer.id)
      .maybeSingle();
    if (already?.paid) return { error: CHECKOUT_MESSAGES.alreadyHaveCourse };
  }

  // Same rule as the space paywall: a community whose plan lapsed stops
  // taking new payments.
  if (!(await communityCanCharge(admin, community.id))) {
    return { error: CHECKOUT_MESSAGES.courseNotOnSale };
  }

  const space = course.spaces as { slug: string } | { slug: string }[] | null;
  const spaceSlug = Array.isArray(space) ? space[0]?.slug : space?.slug;
  const base = await requestBaseUrl();
  const courseUrl = spaceSlug ? `${base}/c/${communitySlug}/spaces/${spaceSlug}/courses/${course.id}` : `${base}/c/${communitySlug}`;

  if (plan === "instalments" && buyer) {
    const instalments = instalmentPlan(course);
    if (!instalments) return { error: CHECKOUT_MESSAGES.noInstalments };
    try {
      const session = await createCourseInstalmentCheckoutSession({
        stripeAccount: community.stripe_account_id,
        priceCents: instalments.priceCents,
        currency: course.currency,
        instalments: instalments.count,
        productName: `${course.title} — ${community.name}`,
        successUrl: `${courseUrl}?purchased=1`,
        cancelUrl: courseUrl,
        customerEmail: buyer.email ?? undefined,
        metadata: { course_id: course.id, user_id: buyer.id, community_id: community.id, instalments: String(instalments.count) },
        look: community.look.oneOff,
      });
      return { url: session.url };
    } catch (err) {
      return { error: (err as Error).message || "Couldn't start checkout." };
    }
  }

  try {
    const session = await createCourseCheckoutSession({
      stripeAccount: community.stripe_account_id,
      priceCents: course.price_cents,
      currency: course.currency,
      productName: `${course.title} — ${community.name}`,
      successUrl: buyer ? `${courseUrl}?purchased=1` : `${base}${guestCheckoutReturnPath(communitySlug)}`,
      cancelUrl: buyer ? courseUrl : `${base}/c/${communitySlug}`,
      customerEmail: buyer?.email ?? undefined,
      metadata: { ...metadataFor(buyer, community.id), course_id: course.id },
      look: community.look.oneOff,
    });
    return { url: session.url };
  } catch (err) {
    return { error: (err as Error).message || "Couldn't start checkout." };
  }
}
