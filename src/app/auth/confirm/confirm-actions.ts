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

// Actually consume the single-use email token and sign the visitor in. This is
// deliberately a Server Action reached only by the POST that the "Continue"
// button on /auth/confirm makes — never a plain GET. Email clients and
// corporate link scanners (Outlook Safe Links, Proofpoint, Gmail's prefetch,
// antivirus, …) fetch every URL in an incoming message to inspect it; if that
// automated GET were allowed to verify, it would burn the one-time token before
// the human ever clicked, and the real click would land on "this link has
// expired". Requiring a form POST means only a person pressing the button
// spends the token. See src/app/auth/confirm/page.tsx.
export async function confirmOtp(formData: FormData): Promise<void> {
  const tokenHash = String(formData.get("token_hash") ?? "");
  const type = String(formData.get("type") ?? "");
  const nextRaw = String(formData.get("next") ?? "");
  const next = nextRaw.startsWith("/") ? nextRaw : "/dashboard";

  if (!tokenHash || !isValidOtpType(type)) {
    redirect("/login?error=confirmation-failed");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type: type as EmailOtpType, token_hash: tokenHash });

  // redirect() throws to perform the navigation, so it must sit outside any
  // try/catch — keep the verify result in a plain variable and branch after.
  if (error) {
    console.error("[auth/confirm] verifyOtp failed:", error);
    redirect("/login?error=confirmation-failed");
  }

  redirect(next);
}
