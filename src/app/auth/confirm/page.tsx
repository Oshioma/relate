import type { EmailOtpType } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { normalizeCustomDomain, platformSubdomainSlug } from "@/lib/custom-domain";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { confirmOtp } from "./confirm-actions";

// A `return_host` param means the email link was requested on a community's
// custom domain: confirmation and password-reset emails always link to the
// platform origin (so custom domains never touch Supabase's redirect
// allowlist), and this resolves where to send the token onward. The host is
// only trusted if it is a verified custom domain in our own database — the same
// security-definer lookup the proxy uses — so the token can only ever be
// forwarded to another face of this very app, never an arbitrary site. Returns
// null for anything else, which falls back to confirming right here.
async function verifiedReturnHost(rawHost: string | null): Promise<string | null> {
  if (!rawHost) return null;

  const [hostPart, portPart] = rawHost.split(":");
  const hostname = normalizeCustomDomain(hostPart ?? "");
  if (!hostname) return null;
  const port = portPart && /^\d{1,5}$/.test(portPart) ? `:${portPart}` : "";

  // <slug>.<platform-apex> subdomains are trusted without a database check:
  // the wildcard resolves to this app no matter what the label is, so the
  // worst case for a non-existent slug is a 404 on our own domain.
  if (platformSubdomainSlug(hostname)) return `${hostname}${port}`;

  const supabase = await createClient();
  const { data: slug } = await supabase.rpc("community_slug_for_domain", { p_domain: hostname });
  return slug ? `${hostname}${port}` : null;
}

// Human-facing copy for the confirm button, by the kind of email link that led
// here. The point of the interstitial is that a *person* presses this, so the
// wording should match what they're expecting from the email they clicked.
function interstitialCopy(type: EmailOtpType | null): { heading: string; body: string; cta: string } {
  switch (type) {
    case "recovery":
      return {
        heading: "Reset your password",
        body: "Confirm it's you to continue. You'll pick a new password on the next screen.",
        cta: "Continue",
      };
    case "signup":
    case "invite":
    case "email":
      return {
        heading: "Confirm your email",
        body: "One tap to verify your email address and finish setting up your account.",
        cta: "Confirm my email",
      };
    case "email_change":
      return {
        heading: "Confirm your new email",
        body: "Confirm this address to finish updating the email on your account.",
        cta: "Confirm email",
      };
    default:
      return {
        heading: "Almost there",
        body: "Confirm to continue to your account.",
        cta: "Continue",
      };
  }
}

// Landing page for every account email link — signup/invite confirmation,
// password recovery, email change. Supabase's templates link to
// `{{ .ConfirmationURL }}`, configured (see README) to point here with
// `token_hash` + `type` query params.
//
// Crucially, this page does NOT verify the token on load. Verifying consumes a
// single-use token, and email clients and corporate link scanners (Outlook Safe
// Links, Proofpoint, Gmail prefetch, antivirus, …) issue an automated GET to
// every link in an incoming message to inspect it. If that GET verified, the
// token would already be spent by the time the recipient clicked — which is
// exactly the "the link has expired, but I only just made it" report this page
// fixes. Instead we render a "Continue" button whose POST (a Server Action)
// does the verification, so only a real human press spends the token.
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string; return_host?: string }>;
}) {
  const params = await searchParams;
  const tokenHash = params.token_hash ?? "";
  const type = (params.type ?? null) as EmailOtpType | null;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";

  if (!tokenHash || !type) {
    redirect("/login?error=confirmation-failed");
  }

  // Forward the token to the custom domain *unverified* and let that host's own
  // copy of this page show the button and verify: verifyOtp sets the session
  // cookie on whichever host runs it, and auth cookies are host-scoped, so
  // verifying here would leave the member logged out on their community's
  // domain. The forwarded URL carries no return_host, so it lands on the
  // interstitial below on the second pass. This hop is a redirect that consumes
  // nothing, so a scanner following it still can't spend the token.
  const returnHost = await verifiedReturnHost(params.return_host ?? null);
  if (returnHost) {
    const headerList = await headers();
    const proto = headerList.get("x-forwarded-proto") ?? "https";
    const target = new URL(`${proto}://${returnHost}/auth/confirm`);
    target.searchParams.set("token_hash", tokenHash);
    target.searchParams.set("type", type);
    target.searchParams.set("next", next);
    redirect(target.toString());
  }

  const copy = interstitialCopy(type);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            Relate
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-foreground">{copy.heading}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{copy.body}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form action={confirmOtp} className="space-y-4">
              <input type="hidden" name="token_hash" value={tokenHash} />
              <input type="hidden" name="type" value={type} />
              <input type="hidden" name="next" value={next} />
              <SubmitButton pendingText="Confirming…">{copy.cta}</SubmitButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
