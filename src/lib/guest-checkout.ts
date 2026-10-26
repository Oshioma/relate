import "server-only";
import type { createAdminClient } from "@/lib/supabase/admin";
import type { StripeCheckoutSession } from "@/lib/stripe";
import { authEventContext, signupContextMetadata } from "@/lib/auth-events";

// Guest checkouts: a signed-out visitor follows a community's shareable buy
// link (src/lib/checkout-links.ts), pays on Stripe Checkout without making an
// account first, and becomes a member from the email they gave Stripe. Both
// the Stripe webhook and the return page (membership/paid) call
// fulfilGuestCheckout; every write is an upsert, so whichever runs second just
// repeats the first.

type Admin = ReturnType<typeof createAdminClient>;

export type GuestBuyer = {
  userId: string;
  email: string;
  // The checkout session that created this account (app_metadata, which only
  // the service role can write), so the return page can tell an account this
  // purchase made from one that already existed.
  accountCheckoutSession: string | null;
  lastSignInAt: string | null;
};

function isGuestCheckout(meta: Record<string, string>): boolean {
  return meta.guest === "1" && Boolean(meta.community_id) && Boolean(meta.tier_id || meta.course_id);
}

// Whether a guest checkout has actually been paid for. A membership has its
// subscription once Checkout completes; a one-off course payment by bank debit
// completes first and is paid later (checkout.session.async_payment_succeeded).
export function guestCheckoutIsPaid(session: StripeCheckoutSession): boolean {
  const meta = session.metadata ?? {};
  if (!isGuestCheckout(meta)) return false;
  if (meta.tier_id) return Boolean(session.subscription);
  return session.mode === "payment" && (session.payment_status === "paid" || session.payment_status === "no_payment_required");
}

// The account for the email the buyer gave Stripe: made now (confirmed, no
// password yet) when there isn't one, otherwise the existing one. Nothing here
// signs anyone in.
async function findOrCreateBuyer(admin: Admin, session: StripeCheckoutSession, communitySlug: string | null): Promise<GuestBuyer | null> {
  const email = session.customer_details?.email?.trim().toLowerCase();
  if (!email) return null;

  const context = signupContextMetadata(authEventContext(communitySlug ? `/c/${communitySlug}` : "/", null));
  const created = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: session.customer_details?.name?.trim() ?? "", ...context },
    app_metadata: { checkout_session: session.id },
  });
  if (created.data?.user) {
    return { userId: created.data.user.id, email, accountCheckoutSession: session.id, lastSignInAt: null };
  }

  // Most likely "already registered". A magic-link token is the Admin API's way
  // to look a user up by email; the token itself is thrown away here.
  const link = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const user = link.data?.user;
  if (!user) {
    console.error("[guest-checkout] couldn't find or create the buyer's account:", created.error ?? link.error);
    return null;
  }
  const marker = (user.app_metadata as Record<string, unknown> | undefined)?.checkout_session;
  return {
    userId: user.id,
    email,
    accountCheckoutSession: typeof marker === "string" ? marker : null,
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}

// Record a paid guest checkout: the buyer's account, their tier subscription or
// course enrolment, and an active membership. Returns the buyer, or null when
// the session isn't a paid guest checkout (or the account couldn't be made).
export async function fulfilGuestCheckout(admin: Admin, session: StripeCheckoutSession): Promise<GuestBuyer | null> {
  const meta = session.metadata ?? {};
  if (!guestCheckoutIsPaid(session)) return null;

  const { data: community } = await admin.from("communities").select("slug").eq("id", meta.community_id).maybeSingle();
  const buyer = await findOrCreateBuyer(admin, session, community?.slug ?? null);
  if (!buyer) return null;

  if (meta.tier_id) {
    const { error } = await admin.from("tier_subscriptions").upsert(
      {
        tier_id: meta.tier_id,
        user_id: buyer.userId,
        community_id: meta.community_id,
        stripe_subscription_id: session.subscription ?? null,
        stripe_customer_id: session.customer ?? null,
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "tier_id,user_id" }
    );
    if (error) throw new Error(`tier subscription: ${error.message}`);
  } else if (meta.course_id) {
    const { error } = await admin.from("course_enrollments").upsert(
      { course_id: meta.course_id, user_id: buyer.userId, paid: true, stripe_checkout_session_id: session.id },
      { onConflict: "course_id,user_id" }
    );
    if (error) throw new Error(`course enrolment: ${error.message}`);
  }

  // A guest isn't a member yet, and a course lives in one of the community's
  // spaces, so either purchase makes them one.
  await ensureActiveMembership(admin, meta.community_id, buyer.userId);
  return buyer;
}

// Make a paying buyer an active member of the community. No row → a new
// member; a pending request or invite → approved by the payment. An existing
// active row (any role) is left alone, and so is a ban. Best effort: a failure
// here (say, a plan's member limit) must not fail the webhook, which would make
// Stripe retry a payment that has already been recorded.
export async function ensureActiveMembership(admin: Admin, communityId: string, userId: string): Promise<void> {
  try {
    const { data: existing } = await admin
      .from("community_memberships")
      .select("id, status")
      .eq("community_id", communityId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!existing) {
      const { error } = await admin
        .from("community_memberships")
        .insert({ community_id: communityId, user_id: userId, role: "member", status: "active" });
      if (error) console.error("[stripe webhook] couldn't add paying member", error.message);
    } else if (existing.status === "requested" || existing.status === "invited") {
      const { error } = await admin.from("community_memberships").update({ status: "active" }).eq("id", existing.id);
      if (error) console.error("[stripe webhook] couldn't activate paying member", error.message);
    }
  } catch (err) {
    console.error("[stripe webhook] membership upsert failed", err);
  }
}
