import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { PlatformAdminTabs } from "./tabs";

// Shared shell for every /platform-admin route: the heading, the tab bar, and
// the one super-admin gate that guards the whole section. Nested pages still
// re-verify before touching the service-role client (defense in depth), but the
// redirect lives here so no admin surface renders for a non-admin.
export default async function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    redirect("/login?next=/platform-admin");
  }

  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Platform admin</h1>
      <PlatformAdminTabs />
      {children}
    </div>
  );
}
