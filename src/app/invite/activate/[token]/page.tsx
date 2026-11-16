import type { Metadata } from "next";
import Link from "@/components/ui/link";
import { CheckCircle2, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { SubmitButton } from "@/components/ui/submit-button";
import { activationStatus } from "@/lib/activations";
import { UpdatePasswordForm } from "@/app/settings/password/update-password-form";
import { activateMembership } from "./actions";

export const metadata: Metadata = { title: "Activate your membership", robots: { index: false, follow: false } };

type ActivationCommunity = { name: string; slug: string; logo_url: string | null; cover_image_url: string | null };

const PROBLEMS: Record<string, string> = {
  signin: "We couldn't sign you in from this link. Use “Forgot your password?” below with this email address to get in.",
  membership: "You're no longer a member of this community, so this link can't be used. Contact the community if that's a mistake.",
  tier: "Something went wrong switching on your membership. Please try again in a minute.",
};

// Where the "Activate new membership" button in a "we've moved" email lands
// (Admin → Emails → Send an email). The page itself changes nothing: a mail
// scanner opening the link must not spend it. The person presses the button,
// which signs them in and switches on their membership, then they come back
// here to choose a password.
export default async function ActivatePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ problem?: string }>;
}) {
  const { token } = await params;
  const { problem } = await searchParams;

  const admin = createAdminClient();
  const { data: row } = await admin
    .from("community_activations")
    .select("token, community_id, user_id, used_at, expires_at, free_tier_ids")
    .eq("token", token)
    .maybeSingle();
  const { data: community } = row
    ? await admin
        .from("communities")
        .select("name, slug, logo_url, cover_image_url")
        .eq("id", row.community_id)
        .maybeSingle()
    : { data: null };

  if (!row || !community) {
    return (
      <Shell community={null}>
        <p className="text-sm text-danger">This activation link isn&apos;t valid.</p>
        <LinkButton href="/login" variant="secondary" className="mt-6">
          Sign in
        </LinkButton>
      </Shell>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const communityHref = `/c/${community.slug}`;
  const status = activationStatus(row);

  // Activated, and it's them: choose a password, then in they go.
  if (status === "used" && user?.id === row.user_id) {
    return (
      <Shell community={community}>
        <p className="flex items-center justify-center gap-1.5 text-base font-semibold text-foreground">
          <CheckCircle2 className="h-5 w-5 text-accent" />
          Your membership is active
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {row.free_tier_ids.length > 0 ? "Your free membership is switched on. " : ""}
          Choose a password so you can sign in as {user.email} next time.
        </p>
        <div className="mt-6 text-left">
          <UpdatePasswordForm doneHref={communityHref} doneLabel={`Go to ${community.name}`} />
        </div>
        <Link href={communityHref} className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground">
          I already have a password, take me in
        </Link>
      </Shell>
    );
  }

  if (status !== "ready") {
    return (
      <Shell community={community}>
        <p className="text-sm text-foreground">
          {status === "used"
            ? "This activation link has already been used."
            : `This activation link has expired. Ask ${community.name} to send you a new one.`}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;re still a member: sign in with your email address. If you never set a password, use “Forgot your
          password?”.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <LinkButton href={`/login?next=${encodeURIComponent(communityHref)}`}>Sign in</LinkButton>
          <LinkButton href="/forgot-password" variant="secondary">
            Forgot your password?
          </LinkButton>
        </div>
      </Shell>
    );
  }

  return (
    <Shell community={community}>
      <h1 className="text-lg font-semibold text-foreground">Activate your new membership</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {community.name} has moved to Relate. Press the button to sign in, then choose a password.
      </p>
      {problem && PROBLEMS[problem] && <p className="mt-4 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{PROBLEMS[problem]}</p>}
      <form action={activateMembership} className="mt-6">
        <input type="hidden" name="token" value={row.token} />
        <SubmitButton pendingText="Activating…">Activate my membership</SubmitButton>
      </form>
    </Shell>
  );
}

function Shell({ community, children }: { community: ActivationCommunity | null; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <Card className="overflow-hidden">
          {community?.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={community.cover_image_url} alt="" className="h-28 w-full object-cover" />
          )}
          <CardContent className={community?.cover_image_url ? "pb-8" : "pt-8 pb-8"}>
            {community ? (
              <div className={community.cover_image_url ? "-mt-10 mb-4" : "mb-4"}>
                <Avatar src={community.logo_url} name={community.name} size={80} className="mx-auto border-4 border-card bg-card" />
                <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">{community.name}</p>
              </div>
            ) : (
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Users className="h-6 w-6" />
              </div>
            )}
            {children}
          </CardContent>
        </Card>
        <p className="mt-6 text-xs text-muted-foreground">
          Powered by{" "}
          <Link href="/" className="font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
            Relate
          </Link>
        </p>
      </div>
    </div>
  );
}
