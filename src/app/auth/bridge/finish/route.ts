import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authEventContext, recordAuthEvent } from "@/lib/auth-events";
import { BRIDGE_CHECKED_COOKIE, BRIDGE_CHECKED_MAX_AGE_SECONDS } from "@/lib/auth-bridge";

// The community-host half of the cross-host auth bridge (see
// src/lib/auth-bridge.ts). Arrives via redirect from the platform's
// /auth/bridge in one of two shapes:
//
//   • with token_hash — the member pressed "Continue" on the platform, which
//     minted a one-time magic-link token for their account. Verifying it here
//     is what sets the session cookie on THIS host, which is the whole point:
//     auth cookies are host-scoped, so the custom domain needs its own.
//   • without        — the platform had no session to bridge. Remember that
//     for a while so the proxy stops detouring this visitor through the
//     platform, and let them sign in here the ordinary way.
//
// Verifying on a GET is safe here, unlike the email flows that need the
// /auth/confirm interstitial: this URL is only ever produced as a redirect
// inside the member's own browser — it never travels through email, so no
// link scanner can pre-spend the token.
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash") ?? "";
  const nextRaw = request.nextUrl.searchParams.get("next") ?? "";
  const next = nextRaw.startsWith("/") ? nextRaw : "/";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Already signed in on this host (a stale bridge link, or two tabs racing)
  // — nothing to finish.
  if (user) {
    redirect(next);
  }

  let bridged = false;
  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: tokenHash });
    if (error) {
      console.error("[auth/bridge/finish] verifyOtp failed:", error);
    } else {
      bridged = true;
    }
  }

  if (bridged) {
    // A bridge completion is a sign-in on this host — record it like one so
    // the per-community "Signups & logins" analytics stay honest.
    await recordAuthEvent(supabase, "login", authEventContext(next, request.headers.get("host")));
    redirect(next);
  }

  // No token, or a spent/expired one: mark the attempt so the proxy sends
  // the next protected-path hit straight to this host's own sign-in.
  (await cookies()).set(BRIDGE_CHECKED_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: BRIDGE_CHECKED_MAX_AGE_SECONDS,
  });
  redirect(`/login?next=${encodeURIComponent(next)}`);
}
