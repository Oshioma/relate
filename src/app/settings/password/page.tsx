import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { UpdatePasswordForm } from "./update-password-form";

// Where the password-reset email lands (via /auth/confirm, which signs the
// visitor in from the recovery token before redirecting here) — and where
// email-invited members, who start with no password at all, set their first
// one.
export default async function PasswordSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/settings/password");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Set a new password</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        You&apos;re signed in as {user.email}. Choose the password you&apos;ll use from now on.
      </p>
      <Card>
        <CardContent className="pt-6">
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
