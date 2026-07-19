import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) {
      redirect(next.startsWith("/") ? next : "/dashboard");
    }
  }

  redirect("/login?error=confirmation-failed");
}
