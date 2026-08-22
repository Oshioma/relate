import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { ACTIVE_WINDOWS, getActivePeople, parseActiveWindow } from "@/lib/data/auth-analytics";
import { cn } from "@/lib/utils";
import { ActivePeopleList } from "../active-people-list";

export const dynamic = "force-dynamic";

// The list behind the "N active today" tile. The count on its own can't be
// acted on — this is the page that answers "who?", with the addresses needed to
// actually reach them.
export default async function ActivePeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ window?: string; community?: string }>;
}) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/login?next=/platform-admin/analytics/active");
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) redirect("/dashboard");

  const params = await searchParams;
  const window = parseActiveWindow(params.window);
  const admin = createAdminClient();
  const result = await getActivePeople(admin, window, params.community);

  const windowLabel = ACTIVE_WINDOWS.find((w) => w.key === window)!.label.toLowerCase();

  return (
    <div>
      <Link
        href="/platform-admin/analytics"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Signups &amp; logins
      </Link>

      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {result.people.length} {result.people.length === 1 ? "person" : "people"} {windowLabel}
        {result.community ? ` in ${result.community.name}` : ""}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {result.from === result.to ? `${result.from} (UTC)` : `${result.from} → ${result.to} (UTC)`}
        {result.community ? null : " · everywhere on the platform, private communities included"}
      </p>

      {/* Switch window without going back. */}
      <nav className="mt-4 flex flex-wrap gap-1">
        {ACTIVE_WINDOWS.map((option) => {
          const href = `/platform-admin/analytics/active?window=${option.key}${
            params.community ? `&community=${encodeURIComponent(params.community)}` : ""
          }`;
          return (
            <Link
              key={option.key}
              href={href}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                option.key === window
                  ? "bg-accent-soft text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {option.label}
            </Link>
          );
        })}
        {result.community && (
          <Link
            href={`/platform-admin/analytics/active?window=${window}`}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Clear community filter
          </Link>
        )}
      </nav>

      <div className="mt-6">
        <ActivePeopleList result={result} />
      </div>
    </div>
  );
}
