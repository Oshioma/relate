import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { ACTIVE_WINDOWS, getActivePeople, parseActiveWindow } from "@/lib/data/auth-analytics";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { CopyEmails } from "./copy-emails";

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
  const emails = result.people.map((p) => p.email).filter((email): email is string => Boolean(email));

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

      {emails.length > 0 && (
        <div className="mt-4">
          <CopyEmails emails={emails} />
        </div>
      )}

      {result.emailLookup === "unavailable" && (
        <p className="mt-4 text-xs text-danger">
          Email addresses couldn&apos;t be loaded.
          {result.emailLookupError ? ` (${result.emailLookupError})` : ""}
        </p>
      )}
      {result.emailLookup === "admin_api" && (
        <p className="mt-4 text-xs text-muted-foreground">
          Addresses came from the Auth admin API — slower, but correct.
        </p>
      )}
      {result.truncated && (
        <p className="mt-4 text-xs text-danger">
          Only the most recent activity was read for this window, so this list may be incomplete.
        </p>
      )}

      {result.people.length === 0 ? (
        <p className="mt-6 rounded-lg border border-border p-4 text-sm text-muted-foreground">
          Nobody was recorded in this window. Presence only counts signed-in people, and only from the moment
          tracking was switched on.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {result.people.map(({ profile: person, email, lastSeenAt, daysActive, places }) => (
            <li key={person.id} className="flex items-start gap-3 px-4 py-3">
              <Avatar src={person.avatar_url} name={person.full_name || person.username} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  <Link href={`/platform-admin/users/${person.id}`} className="hover:underline">
                    {person.full_name || person.username}
                  </Link>{" "}
                  <span className="font-normal text-muted-foreground">@{person.username}</span>
                </p>
                {email ? (
                  <a href={`mailto:${email}`} className="block truncate text-sm text-foreground/80 select-all hover:underline">
                    {email}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">No email on file</p>
                )}
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  Last seen {formatRelativeTime(lastSeenAt)} · {formatDateTime(lastSeenAt)}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {places.map((place) => (
                    <span
                      key={place.id ?? "platform"}
                      className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {place.slug ? (
                        <Link href={`/c/${place.slug}`} className="hover:underline">
                          {place.name}
                        </Link>
                      ) : (
                        place.name
                      )}
                      {place.id && !place.isMember ? " · visitor" : ""}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {daysActive > 1 && <Badge tone="accent">{daysActive} days</Badge>}
                <span className="text-[11px] text-muted-foreground">{person.contribution_score} pts</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
