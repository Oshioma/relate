import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { platformSubdomainSlug } from "@/lib/custom-domain";
import { verifiedCommunityHost } from "@/lib/verified-community-host";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { continueToCommunityHost } from "./bridge-actions";

// The community the visitor is continuing to, for the consent copy. Best
// effort: a private community this anon-ish client can't read just renders
// with generic wording — the domain itself is always shown.
async function communityNameForHost(
  supabase: Awaited<ReturnType<typeof createClient>>,
  host: string
): Promise<string | null> {
  const hostname = host.split(":")[0];
  let slug: string | null = platformSubdomainSlug(hostname);
  if (!slug) {
    const { data } = await supabase.rpc("community_slug_for_domain", { p_domain: hostname });
    slug = data ?? null;
  }
  if (!slug) return null;

  const { data } = await supabase.from("communities").select("name").eq("slug", slug).maybeSingle();
  return data?.name ?? null;
}

// The platform half of the cross-host auth bridge (see src/lib/auth-bridge.ts
// for the whole flow). A logged-out visit to a community's custom domain
// lands here; if the platform holds a session, one press of "Continue" signs
// the same account in over there.
//
// The press is deliberately required rather than bridging silently: domain
// verification proves DNS control, not that the domain's traffic reaches this
// app — a hostile community owner could point their verified domain at their
// own server and harvest whatever a silent bridge sent it. So nothing is
// minted on GET; the person first sees which community and which domain
// they're continuing to, and the token only exists after their explicit,
// origin-checked POST (see bridge-actions.ts).
export default async function BridgePage({
  searchParams,
}: {
  searchParams: Promise<{ host?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/";

  const host = await verifiedCommunityHost(params.host ?? null);
  if (!host) {
    // Nothing legitimate to bridge to — treat it like any stray auth URL.
    redirect("/login");
  }

  const headerList = await headers();
  const proto = headerList.get("x-forwarded-proto") ?? "https";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    // No session on the platform either. Hand off to the community host's
    // finish route with no token: it remembers the attempt (so the proxy
    // doesn't bounce straight back here) and shows that host's own sign-in.
    redirect(`${proto}://${host}/auth/bridge/finish?next=${encodeURIComponent(next)}`);
  }

  const communityName = await communityNameForHost(supabase, host);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            Relate
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-foreground">
            Continue to {communityName ?? "this community"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re signed in as <span className="font-medium text-foreground">{user.email}</span>. One tap to use
            the same account on <span className="font-medium text-foreground">{host}</span>.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form action={continueToCommunityHost} className="space-y-4">
              <input type="hidden" name="host" value={host} />
              <input type="hidden" name="next" value={next} />
              <SubmitButton pendingText="Continuing…">Continue</SubmitButton>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Not you?{" "}
          <a href={`${proto}://${host}/login?next=${encodeURIComponent(next)}`} className="font-medium text-accent hover:underline">
            Sign in with a different account
          </a>
        </p>
      </div>
    </div>
  );
}
