import type { NextRequest } from "next/server";
import { startTierCheckout } from "@/lib/start-checkout";
import { checkoutRedirect } from "../../checkout-redirect";

// A membership tier's shareable link: straight to Stripe Checkout, no signup
// first. See src/lib/checkout-links.ts.
export async function GET(request: NextRequest, { params }: { params: Promise<{ communitySlug: string; tierId: string }> }) {
  const { communitySlug, tierId } = await params;
  return checkoutRedirect(request, communitySlug, (buyer) => startTierCheckout(tierId, communitySlug, buyer));
}
