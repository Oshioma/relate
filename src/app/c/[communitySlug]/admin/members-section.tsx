import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { MemberRow } from "@/lib/data/community";

// Role breakdown over the active membership, in display order. Owner/admin sit
// up front because they're the ones an admin actually manages; a role with no
// members is dropped so the summary never shows "0 moderators".
const ROLE_ORDER = [
  { role: "owner", label: "Owners" },
  { role: "admin", label: "Admins" },
  { role: "moderator", label: "Moderators" },
  { role: "member", label: "Members" },
] as const;

// A compact members panel for the admin page: role breakdown + the latest
// people to join, with a jump to the full /members page where roles, removals,
// and invites already live. Surfaces "who's in my community" — a core admin
// concern that was otherwise only reachable via a plain nav link.
export function MembersSection({ members, communitySlug }: { members: MemberRow[]; communitySlug: string }) {
  const counts = new Map<string, number>();
  for (const m of members) counts.set(m.role, (counts.get(m.role) ?? 0) + 1);
  const breakdown = ROLE_ORDER.filter(({ role }) => (counts.get(role) ?? 0) > 0);

  // Newest first. getCommunityMembers returns active members oldest-first, so
  // the tail is the most recent — take five and reverse for display.
  const recent = members.slice(-5).reverse();

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {breakdown.map(({ role, label }) => (
            <span key={role} className="text-muted-foreground">
              <span className="font-semibold text-foreground">{counts.get(role)}</span> {label}
            </span>
          ))}
        </div>

        {recent.length > 0 && (
          <>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Recently joined</p>
            <ul className="mb-4 space-y-2">
              {recent.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/c/${communitySlug}/members/${m.profile.username}`}
                    className="flex items-center gap-3 rounded-md px-2 py-1.5 -mx-2 transition-colors hover:bg-muted"
                  >
                    <Avatar src={m.profile.avatar_url} name={m.profile.full_name || m.profile.username} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {m.profile.full_name || m.profile.username}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        Joined {formatDate(m.created_at)}
                      </span>
                    </span>
                    {m.role !== "member" && <Badge tone="accent">{m.role}</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <Link
          href={`/c/${communitySlug}/members`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          Manage members, roles &amp; invites <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
