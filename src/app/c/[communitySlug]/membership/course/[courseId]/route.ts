import type { NextRequest } from "next/server";
import { startCourseCheckout } from "@/lib/start-checkout";
import { checkoutRedirect } from "../../checkout-redirect";

// A paid course's shareable link: straight to Stripe Checkout, no signup
// first. See src/lib/checkout-links.ts.
export async function GET(request: NextRequest, { params }: { params: Promise<{ communitySlug: string; courseId: string }> }) {
  const { communitySlug, courseId } = await params;
  return checkoutRedirect(request, communitySlug, (buyer) => startCourseCheckout(courseId, communitySlug, buyer));
}
