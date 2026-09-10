import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getPlatformSettings } from "@/lib/data/platform-settings";
import { LegalSettingsForm } from "../legal-settings-form";

// The platform's Terms & Conditions and Privacy Policy live on their own tab.
// They used to sit at the bottom of the Settings tab, where two editors holding
// documents thousands of words long buried every other control on the page —
// you had to scroll past the whole of the terms to reach anything below them.
export default async function PlatformLegalPage() {
  // Re-verify: the layout already gates this section, but the form's action
  // writes through the service-role client.
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/login?next=/platform-admin/legal");
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) redirect("/dashboard");

  const legalSettings = await getPlatformSettings(supabase);

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        The platform&apos;s Terms &amp; Conditions and Privacy Policy. These are linked in the footer on every page and
        shown at{" "}
        <Link href="/terms" target="_blank" rel="noreferrer" className="font-medium text-accent underline underline-offset-2">
          /terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" target="_blank" rel="noreferrer" className="font-medium text-accent underline underline-offset-2">
          /privacy
        </Link>
        .
      </p>

      <LegalSettingsForm settings={legalSettings} />
    </div>
  );
}
