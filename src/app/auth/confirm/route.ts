import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeCustomDomain } from "@/lib/custom-domain";

// A `return_host` param means the signup happened on a community's custom
// domain: confirmation emails always link to the platform origin (so custom
// domains never touch Supabase's redirect allowlist), and this resolves
// where to send the token onward. The host is only trusted if it is a
// verified custom domain in our own database — the same security-definer
// lookup the proxy uses — so the token can only ever be forwarded to
// another face of this very app, never an arbitrary site. Returns null for
// anything else, which falls back to confirming right here.
async function verifiedReturnHost(rawHost: string | null): Promise<string | null> {
  if (!rawHost) return null;

  const [hostPart, portPart] = rawHost.split(":");
  const hostname = normalizeCustomDomain(hostPart ?? "");
  if (!hostname) return null;
  const port = portPart && /^\d{1,5}$/.test(portPart) ? `:${portPart}` : "";

  const supabase = await createClient();
  const { data: slug } = await supabase.rpc("community_slug_for_domain", { p_domain: hostname });
  return slug ? `${hostname}${port}` : null;
}

// Target of the "Confirm signup" email link. Supabase's default template
// links to `{{ .ConfirmationURL }}`, which points at this route with
// `token_hash` + `type` query params (configure the Site URL /
// email template in the Supabase dashboard — see README).
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (tokenHash && type) {
    // Forward the token to the custom domain *unverified* and let that
    // host's own copy of this route verify it: verifyOtp sets the session
    // cookie on whichever host runs it, and auth cookies are host-scoped,
    // so verifying here would leave the member logged out on their
    // community's domain. The forwarded URL carries no return_host, so it
    // confirms below on the second pass.
    const returnHost = await verifiedReturnHost(searchParams.get("return_host"));
    if (returnHost) {
      const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
      const target = new URL(`${proto}://${returnHost}/auth/confirm`);
      target.searchParams.set("token_hash", tokenHash);
      target.searchParams.set("type", type);
      target.searchParams.set("next", next);
      redirect(target.toString());
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) {
      redirect(next.startsWith("/") ? next : "/dashboard");
    }
  }

  redirect("/login?error=confirmation-failed");
}
