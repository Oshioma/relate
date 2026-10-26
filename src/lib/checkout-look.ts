// What a community's Stripe Checkout page shows besides Stripe's own account
// branding (logo, icon, colour — see syncStripeBranding): a picture beside the
// product and a short line under the Pay button. Used by every member-facing
// checkout: tiers, courses (one-off and instalments) and paid spaces.

type LookSource = {
  name: string;
  logo_url?: string | null;
  cover_image_url?: string | null;
  // Absent until the 20261026220603 migration is applied; the default line
  // shows meanwhile.
  checkout_message?: string | null;
};

export const CHECKOUT_MESSAGE_MAX = 500;

export function defaultCheckoutMessage(communityName: string): string {
  return `You'll have access to ${communityName} as soon as you've paid. Cancel any time.`;
}

// Stripe only takes public https image URLs for product images.
function httpsUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export function checkoutLookFor(community: LookSource, opts: { oneOff?: boolean } = {}): { imageUrl: string | null; submitMessage: string } {
  const own = community.checkout_message?.trim();
  const fallback = opts.oneOff
    ? `You'll have access to ${community.name} as soon as you've paid.`
    : defaultCheckoutMessage(community.name);
  return {
    imageUrl: httpsUrl(community.cover_image_url) ?? httpsUrl(community.logo_url),
    submitMessage: (own || fallback).slice(0, CHECKOUT_MESSAGE_MAX),
  };
}
