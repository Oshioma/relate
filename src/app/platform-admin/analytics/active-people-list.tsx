"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import type { ActivePeople } from "@/lib/data/auth-analytics";
import { CopyEmails } from "./active/copy-emails";

// One rendering of "who was active", shared by the inline panel on the
// analytics page and the standalone /analytics/active page, so the two can't
// drift into showing different things.
export function ActivePeopleList({ result }: { result: ActivePeople }) {
  const emails = result.people.map((p) => p.email).filter((email): email is string => Boolean(email));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {result.from === result.to ? `${result.from} (UTC)` : `${result.from} → ${result.to} (UTC)`}
          {result.community ? ` · ${result.community.name}` : ""}
        </p>
        <CopyEmails emails={emails} />
      </div>

      {result.emailLookup === "unavailable" && (
        <p className="mt-2 text-xs text-danger">
          Email addresses couldn&apos;t be loaded.
          {result.emailLookupError ? ` (${result.emailLookupError})` : ""}
        </p>
      )}
      {result.emailLookup === "admin_api" && (
        <p className="mt-2 text-xs text-muted-foreground">
          Addresses came from the Auth admin API — slower, but correct.
        </p>
      )}
      {result.truncated && (
        <p className="mt-2 text-xs text-danger">
          Only the most recent activity was read for this window, so this list may be incomplete.
        </p>
      )}

      {result.people.length === 0 ? (
        <p className="mt-3 rounded-lg border border-border p-4 text-sm text-muted-foreground">
          Nobody was recorded in this window. Presence only counts signed-in people, and only from the moment tracking
          was switched on.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
          {result.people.map(({ profile, email, lastSeenAt, daysActive, places }) => (
            <li key={profile.id} className="flex items-start gap-3 px-4 py-3">
              <Avatar src={profile.avatar_url} name={profile.full_name || profile.username} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  <Link href={`/platform-admin/users/${profile.id}`} className="hover:underline">
                    {profile.full_name || profile.username}
                  </Link>{" "}
                  <span className="font-normal text-muted-foreground">@{profile.username}</span>
                </p>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="block truncate text-sm text-foreground/80 select-all hover:underline"
                  >
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
                <span className="text-[11px] text-muted-foreground">{profile.contribution_score} pts</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
