import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CheckoutBuyer, CheckoutResult } from "@/lib/start-checkout";

// Shared by the shareable buy links (join/<tier>, course/<course>): start
// Checkout for whoever is visiting — on their own account when signed in, as a
// guest otherwise — and send the browser to Stripe, or back to the
// Membership page with the reason when it can't be bought.
export async function checkoutRedirect(
  request: NextRequest,
  communitySlug: string,
  start: (buyer: CheckoutBuyer) => Promise<CheckoutResult>
): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const result = await start(user ? { id: user.id, email: user.email ?? null } : null);
  if ("url" in result) return NextResponse.redirect(result.url, 303);

  const back = new URL(`/c/${communitySlug}/membership`, request.url);
  back.searchParams.set("checkout_error", result.error);
  return NextResponse.redirect(back, 303);
}
