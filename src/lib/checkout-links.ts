import { communityHostHref } from "./community-path";

// Shareable "buy" links for a community's memberships and courses. Each one
// opens Stripe Checkout straight away — no signup first — and works for
// anyone: a signed-in member buys on their own account, a signed-out visitor
// pays as a guest and the return page (membership/paid) makes or matches their
// account from the email they gave Stripe. All of them live under
// /c/<slug>/membership, which the proxy already lets signed-out visitors reach.

export function tierCheckoutPath(communitySlug: string, tierId: string): string {
  return `/c/${communitySlug}/membership/join/${encodeURIComponent(tierId)}`;
}

export function courseCheckoutPath(communitySlug: string, courseId: string): string {
  return `/c/${communitySlug}/membership/course/${encodeURIComponent(courseId)}`;
}

// Where Stripe sends a guest buyer back. {CHECKOUT_SESSION_ID} is Stripe's own
// placeholder, filled in with the session id on the way back.
export function guestCheckoutReturnPath(communitySlug: string): string {
  return `/c/${communitySlug}/membership/paid?session_id={CHECKOUT_SESSION_ID}`;
}

// The full link an admin copies to share, on whichever host they're using. On
// the platform host pages live at /c/<slug>/…; on the community's own
// subdomain or custom domain the same page is served at the clean path.
export function shareableCheckoutLink(path: string, communitySlug: string, location: { origin: string; pathname: string }): string {
  const onPlatformHost = location.pathname.startsWith(`/c/${communitySlug}`);
  return `${location.origin}${onPlatformHost ? path : communityHostHref(path, communitySlug)}`;
}

// How long after a guest checkout opened its return page may still sign the
// buyer in by itself. Stripe sends them back the moment they pay; this only
// bounds a stale link found later (say, in browser history).
export const GUEST_SIGN_IN_WINDOW_SECONDS = 6 * 60 * 60;

// Whether the return page may sign a guest buyer straight in. Only an account
// this very checkout created, and only before it has ever been signed in to:
// Stripe doesn't check that the email belongs to the buyer, so an address that
// already had an account always gets an emailed sign-in link instead — never a
// session handed to whoever typed it.
export function canSignInGuestBuyer(args: {
  accountCheckoutSession: unknown;
  checkoutSessionId: string;
  lastSignInAt: string | null | undefined;
  checkoutCreatedAt: number | null | undefined;
  nowSeconds: number;
}): boolean {
  if (!args.checkoutSessionId || args.accountCheckoutSession !== args.checkoutSessionId) return false;
  if (args.lastSignInAt) return false;
  if (!args.checkoutCreatedAt) return false;
  return args.nowSeconds - args.checkoutCreatedAt <= GUEST_SIGN_IN_WINDOW_SECONDS;
}

// "jane@example.com" -> "j***@example.com", for "we've emailed you" notes.
export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return email;
  return `${email[0]}***${email.slice(at)}`;
}

// Every reason a buy link can bounce back to the Membership page with. The
// page only shows one of these (anything else in the address, say a link
// someone crafted, becomes the generic line), so no outside text appears there.
export const CHECKOUT_MESSAGES = {
  notConfigured: "Payments aren't available on this platform yet.",
  courseNotConfigured: "Payments aren't available on this platform yet. Ask a course admin for access.",
  paymentsNotReady: "This community hasn't finished setting up payments yet. Try again later.",
  tierNotFound: "Membership tier not found.",
  tierArchived: "This membership is no longer available.",
  tierFree: "This membership is free — no subscription needed.",
  banned: "You can't join this community.",
  alreadyOnTier: "You're already on this membership.",
  tierNotOnSale: "This membership isn't open to new subscribers right now. Please check back later, or contact the community's admins.",
  courseNotOpen: "This course isn't open yet.",
  courseFree: "This course is free — just enrol.",
  alreadyHaveCourse: "You already have this course.",
  noInstalments: "This course isn't offered in monthly payments.",
  courseNotOnSale: "This course isn't on sale right now. Please check back later, or contact the community's admins.",
  paymentNotFound: "We couldn't find that payment.",
  checkoutUnfinished: "That checkout wasn't finished, so nothing was charged.",
} as const;

const KNOWN_MESSAGES = new Set<string>(Object.values(CHECKOUT_MESSAGES));

export function checkoutNotice(raw: string | undefined): string | null {
  if (!raw) return null;
  return KNOWN_MESSAGES.has(raw) ? raw : "Checkout couldn't start just now. Please try again in a minute.";
}
