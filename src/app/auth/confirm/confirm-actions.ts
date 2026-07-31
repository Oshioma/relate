"use server";

import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// The email OTP types that can legitimately reach /auth/confirm — signup and
// invite confirmations, password recovery, email-change, and magic links.
// Anything else is treated as a bad link.
const VALID_OTP_TYPES: EmailOtpType[] = ["signup", "invite", "recovery", "email_change", "magiclink", "email"];

function isValidOtpType(value: string): value is EmailOtpType {
  return (VALID_OTP_TYPES as string[]).includes(value);
}

// Actually complete the sign-in from an email link, and only from the POST that
// the "Continue" button on /auth/confirm makes — never a plain GET. Email
// clients and corporate link scanners (Outlook Safe Links, Proofpoint, Gmail's
// prefetch, antivirus, …) fetch every URL in an incoming message to inspect it;
// if that automated GET were allowed to verify, it would burn the one-time
// token before the human ever clicked, and the real click would land on "this
// link has expired". Requiring a form POST means only a person pressing the
// button spends the token. See src/app/auth/confirm/page.tsx.
//
// Two link shapes arrive here, depending on how the email was minted:
//   • token_hash + type — the app-minted flow (admin.generateLink), verified
//     with verifyOtp. No per-browser state, so it works cross-device.
//   • code             — Supabase's default templates route through GoTrue's
//     /verify endpoint, which redirects back with a PKCE `?code=` to exchange.
export async function confirmOtp(formData: FormData): Promise<void> {
  const tokenHash = String(formData.get("token_hash") ?? "");
  const type = String(formData.get("type") ?? "");
  const code = String(formData.get("code") ?? "");
  const nextRaw = String(formData.get("next") ?? "");
  const next = nextRaw.startsWith("/") ? nextRaw : "/dashboard";

  const supabase = await createClient();

  // redirect() throws to navigate, so it must sit outside the verify call —
  // keep the outcome in a flag and branch after.
  let failed = false;
  if (tokenHash && isValidOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) {
      console.error("[auth/confirm] verifyOtp failed:", error);
      failed = true;
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/confirm] exchangeCodeForSession failed:", error);
      failed = true;
    }
  } else {
    failed = true;
  }

  if (failed) {
    redirect("/login?error=confirmation-failed");
  }

  redirect(next);
}
