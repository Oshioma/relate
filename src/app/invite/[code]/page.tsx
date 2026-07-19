import Link from "next/link";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: previewRows } = await supabase.rpc("get_invite_preview", { p_code: code });
  const preview = previewRows?.[0];

  if (!preview || !preview.valid) {
    return (
      <InviteShell>
        <p className="text-sm text-danger">{preview?.reason ?? "This invite link is invalid."}</p>
        <LinkButton href="/dashboard" variant="secondary" className="mt-6">
          Go to dashboard
        </LinkButton>
      </InviteShell>
    );
  }

  if (!user) {
    const next = `/invite/${code}`;
    return (
      <InviteShell>
        <h1 className="text-lg font-semibold text-foreground">You&apos;re invited to {preview.community_name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in or create an account to join.</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <LinkButton href={`/login?next=${encodeURIComponent(next)}`}>Sign in</LinkButton>
          <LinkButton href={`/signup?next=${encodeURIComponent(next)}`} variant="secondary">
            Create account
          </LinkButton>
        </div>
      </InviteShell>
    );
  }

  const { data: redeemRows } = await supabase.rpc("redeem_invite", { p_code: code });
  const result = redeemRows?.[0];

  if (!result || result.error) {
    return (
      <InviteShell>
        <p className="text-sm text-danger">{result?.error ?? "Something went wrong redeeming this invite."}</p>
        <LinkButton href="/dashboard" variant="secondary" className="mt-6">
          Go to dashboard
        </LinkButton>
      </InviteShell>
    );
  }

  redirect(`/c/${result.community_slug}`);
}

function InviteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="mb-8 inline-block text-lg font-semibold tracking-tight text-foreground">
          Relate
        </Link>
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Users className="h-6 w-6" />
            </div>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
