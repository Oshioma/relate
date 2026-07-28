import { NextResponse } from "next/server";

// TEMPORARY diagnostic — safe to delete. Reports only whether the two
// email-related secrets are present in the *running* server's environment,
// never their values. Use it to confirm production actually has them loaded
// (a var can be set in the dashboard yet not deployed until a redeploy).
//
//   GET /api/env-check -> { "resend": true, "serviceRole": false, ... }
//
// force-dynamic so the answer reflects the live env at request time rather
// than anything frozen at build.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    // The two keys the community-branded confirmation email needs.
    resend: Boolean(process.env.RESEND_API_KEY),
    serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    // Handy neighbours: without a sender address the branded email can't send,
    // and NODE_ENV tells you which deployment answered.
    inviteFrom: Boolean(process.env.INVITE_EMAIL_FROM),
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    nodeEnv: process.env.NODE_ENV ?? null,
  });
}
