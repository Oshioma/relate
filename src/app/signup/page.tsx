import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { SignupForm } from "./signup-form";

// When the signup came from an email invite (/invite/<code>), the invite row
// already knows the recipient's address — we emailed it to them. Resolve it
// through the public preview RPC so the form can pre-fill and lock the email,
// leaving them only a password to pick. Returns null for link invites (no
// email on the row) or anything else, so the form collects the email normally.
async function invitedEmail(next: string): Promise<string | null> {
  const match = next.match(/^\/invite\/([^/?#]+)/);
  if (!match) return null;

  const supabase = await createClient();
  const { data } = await supabase.rpc("get_invite_preview", { p_code: decodeURIComponent(match[1]) });
  return data?.[0]?.invite_email ?? null;
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";
  const prefilledEmail = await invitedEmail(next);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            Relate
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">One account, every community you belong to.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <SignupForm next={next} prefilledEmail={prefilledEmail} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
