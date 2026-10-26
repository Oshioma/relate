import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retrieveCheckoutSession, type StripeCheckoutSession } from "@/lib/stripe";
import { fulfilGuestCheckout, guestCheckoutIsPaid, type GuestBuyer } from "@/lib/guest-checkout";
import { CHECKOUT_MESSAGES, canSignInGuestBuyer, maskEmail } from "@/lib/checkout-links";
import { isPlatformHost } from "@/lib/custom-domain";
import { authEventContext, recordAuthEvent } from "@/lib/auth-events";
import { isResendConfigured, sendCheckoutSignInEmail } from "@/lib/email";

// Where Stripe sends a guest buyer (someone who paid from a shareable buy link
// while signed out) once they've paid. It reads the Checkout Session back from
// Stripe, records the purchase on the account for the email they gave (making
// one if there's none — the webhook does the same, whichever comes first), and
// then:
//   • a brand-new account made by this very checkout is signed straight in;
//   • an email that already had an account is sent a one-tap sign-in link
//     instead, because Stripe never checks that the email is the buyer's.
// Either way the buyer lands on membership/welcome, which says which happened.
// This runs as a route handler (not a page) because signing in sets cookies,
// on whichever host the buyer is on.

type Admin = ReturnType<typeof createAdminClient>;

export async function GET(request: NextRequest, { params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const membershipPath = `/c/${communitySlug}/membership`;
  const failPath = (message: string) => `${membershipPath}?checkout_error=${encodeURIComponent(message)}`;

  const sessionId = request.nextUrl.searchParams.get("session_id") ?? "";
  if (!sessionId.startsWith("cs_")) redirect(membershipPath);

  const admin = createAdminClient();
  const { data: community } = await admin
    .from("communities")
    .select("id, name, logo_url, stripe_account_id")
    .eq("slug", communitySlug)
    .maybeSingle();
  if (!community?.stripe_account_id) redirect(failPath(CHECKOUT_MESSAGES.paymentNotFound));

  let session: StripeCheckoutSession | null = null;
  try {
    session = await retrieveCheckoutSession(sessionId, community.stripe_account_id);
  } catch (err) {
    console.error("[membership/paid] couldn't read the checkout session:", (err as Error).message);
  }
  const meta = session?.metadata ?? {};
  if (!session || meta.community_id !== community.id || meta.guest !== "1") {
    redirect(failPath(CHECKOUT_MESSAGES.paymentNotFound));
  }
  if (session.status !== "complete") redirect(failPath(CHECKOUT_MESSAGES.checkoutUnfinished));

  const item = await purchasedItem(admin, communitySlug, meta);
  const welcome = (state: string, extra: Record<string, string> = {}) => {
    const qs = new URLSearchParams({ state, next: item.path, ...(item.name ? { item: item.name } : {}), ...extra });
    return `${membershipPath}/welcome?${qs.toString()}`;
  };

  // A bank-debit course payment completes Checkout before the money arrives;
  // the webhook finishes it when Stripe confirms.
  if (!guestCheckoutIsPaid(session)) redirect(welcome("pending"));

  let buyer: GuestBuyer | null = null;
  try {
    buyer = await fulfilGuestCheckout(admin, session);
  } catch (err) {
    console.error("[membership/paid] couldn't record the purchase:", (err as Error).message);
  }
  if (!buyer) redirect(welcome("problem"));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id === buyer.userId) redirect(welcome("in"));

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  let signedIn = false;
  if (
    !user &&
    canSignInGuestBuyer({
      accountCheckoutSession: buyer.accountCheckoutSession,
      checkoutSessionId: session.id,
      lastSignInAt: buyer.lastSignInAt,
      checkoutCreatedAt: session.created,
      nowSeconds: Math.floor(Date.now() / 1000),
    })
  ) {
    const link = await admin.auth.admin.generateLink({ type: "magiclink", email: buyer.email });
    const tokenHash = link.data?.properties?.hashed_token;
    if (tokenHash) {
      const { error } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: tokenHash });
      if (error) console.error("[membership/paid] sign-in failed:", error);
      else signedIn = true;
    } else {
      console.error("[membership/paid] couldn't mint a sign-in token:", link.error);
    }
  }
  if (signedIn) {
    await recordAuthEvent(supabase, "login", authEventContext(item.path, host));
    redirect(welcome("new"));
  }

  const sent = await emailSignInLink({
    email: buyer.email,
    host,
    proto: request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", ""),
    next: item.path,
    communityName: community.name,
    communityLogoUrl: community.logo_url,
    itemName: item.name,
    admin,
  });
  redirect(welcome("email", { to: maskEmail(buyer.email), ...(sent ? {} : { sent: "0" }) }));
}

// What was bought and where to go next: the community for a membership, the
// course page for a course.
async function purchasedItem(admin: Admin, communitySlug: string, meta: Record<string, string>): Promise<{ name: string | null; path: string }> {
  const home = `/c/${communitySlug}`;
  if (meta.tier_id) {
    const { data: tier } = await admin.from("community_tiers").select("name").eq("id", meta.tier_id).maybeSingle();
    return { name: tier?.name ?? null, path: home };
  }
  if (meta.course_id) {
    const { data: course } = await admin.from("courses").select("id, title, spaces(slug)").eq("id", meta.course_id).maybeSingle();
    const space = course?.spaces as { slug: string } | { slug: string }[] | null | undefined;
    const spaceSlug = Array.isArray(space) ? space[0]?.slug : space?.slug;
    return {
      name: course?.title ?? null,
      path: course && spaceSlug ? `${home}/spaces/${spaceSlug}/courses/${course.id}` : home,
    };
  }
  return { name: null, path: home };
}

// Email an existing account holder a one-tap sign-in link that comes back to
// this community's host. Same link shape as the password-reset email: minted
// with the Admin API, opened through /auth/confirm (which forwards it to a
// community's own domain via return_host so the session lands there).
async function emailSignInLink(args: {
  email: string;
  host: string | null;
  proto: string;
  next: string;
  communityName: string;
  communityLogoUrl: string | null;
  itemName: string | null;
  admin: Admin;
}): Promise<boolean> {
  if (!isResendConfigured()) return false;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const customHost = args.host && !isPlatformHost(args.host) ? args.host : null;
  const platformOrigin = customHost || !args.host ? siteUrl : `${args.proto}://${args.host}`;

  const { data, error } = await args.admin.auth.admin.generateLink({
    type: "magiclink",
    email: args.email,
    options: { redirectTo: `${platformOrigin}/auth/confirm` },
  });
  const tokenHash = data?.properties?.hashed_token;
  if (error || !tokenHash) {
    console.error("[membership/paid] couldn't mint the sign-in link:", error);
    return false;
  }

  const signInUrl =
    `${platformOrigin}/auth/confirm?token_hash=${encodeURIComponent(tokenHash)}&type=magiclink` +
    `&next=${encodeURIComponent(args.next)}${customHost ? `&return_host=${encodeURIComponent(customHost)}` : ""}`;

  const sent = await sendCheckoutSignInEmail({
    to: args.email,
    communityName: args.communityName,
    communityLogoUrl: args.communityLogoUrl,
    itemName: args.itemName,
    signInUrl,
  });
  if (!sent.ok) console.error("[membership/paid] sign-in email failed:", sent.reason);
  return sent.ok;
}
