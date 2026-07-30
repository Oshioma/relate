import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { MemberRow } from "@/lib/data/community";
import { MemberRoleSelect } from "../members/member-role-select";
import { RemoveMemberButton } from "../members/remove-member-button";

// Role breakdown over the active membership, in display order. Owner/admin sit
// up front because they're the ones an admin actually manages; a role with no
// members is dropped so the summary never shows "0 moderators".
const ROLE_ORDER = [
  { role: "owner", label: "Owners" },
  { role: "admin", label: "Admins" },
  { role: "moderator", label: "Moderators" },
  { role: "member", label: "Members" },
] as const;

const STAFF_ROLES = ["owner", "admin", "moderator"] as const;
const staffRank: Record<string, number> = { owner: 0, admin: 1, moderator: 2 };

// One member row with inline management. Reuses the same MemberRoleSelect /
// RemoveMemberButton (and their server actions) that the /members page uses, so
// the write path and its guards stay in one place. The owner and the viewer
// themselves aren't manageable — mirroring exactly what those actions enforce
// server-side — so they render as a static role badge instead of controls.
function MemberRow({
  member,
  communitySlug,
  currentUserId,
  viewerIsOwner,
  allowStaff,
}: {
  member: MemberRow;
  communitySlug: string;
  currentUserId: string;
  viewerIsOwner: boolean;
  allowStaff: boolean;
}) {
  // Same rule the RLS policy and server actions enforce: never the owner, never
  // yourself, and a non-owner admin can only touch a fellow admin/moderator
  // when the community has opted in.
  const targetIsStaff = member.role === "admin" || member.role === "moderator";
  const canManage =
    member.role !== "owner" &&
    member.user_id !== currentUserId &&
    (viewerIsOwner || !targetIsStaff || allowStaff);
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <Link
        href={`/c/${communitySlug}/members/${member.profile.username}`}
        className="flex min-w-0 items-center gap-3 hover:opacity-80"
      >
        <Avatar src={member.profile.avatar_url} name={member.profile.full_name || member.profile.username} size={32} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">
            {member.profile.full_name || member.profile.username}
          </span>
          <span className="block truncate text-xs text-muted-foreground">Joined {formatDate(member.created_at)}</span>
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        {canManage ? (
          <>
            <MemberRoleSelect membershipId={member.id} role={member.role} communitySlug={communitySlug} />
            <RemoveMemberButton membershipId={member.id} communitySlug={communitySlug} />
          </>
        ) : (
          <Badge tone={member.role === "owner" || member.role === "admin" ? "accent" : "neutral"}>{member.role}</Badge>
        )}
      </div>
    </div>
  );
}

// A members panel for the admin page with inline management. Lists all staff
// (owners/admins/moderators) so their roles can be changed or they can be
// removed without leaving the page, plus the most recent regular joins. The
// full /members directory — search, filters, blocking, invites — is one click
// away.
export function MembersSection({
  members,
  communitySlug,
  currentUserId,
  viewerIsOwner,
  allowStaff,
}: {
  members: MemberRow[];
  communitySlug: string;
  currentUserId: string;
  viewerIsOwner: boolean;
  allowStaff: boolean;
}) {
  const counts = new Map<string, number>();
  for (const m of members) counts.set(m.role, (counts.get(m.role) ?? 0) + 1);
  const breakdown = ROLE_ORDER.filter(({ role }) => (counts.get(role) ?? 0) > 0);

  const staff = members
    .filter((m) => (STAFF_ROLES as readonly string[]).includes(m.role))
    .sort((a, b) => staffRank[a.role] - staffRank[b.role]);

  // Newest first among plain members. getCommunityMembers returns them
  // oldest-first, so the tail is the most recent — take five and reverse.
  const recentMembers = members.filter((m) => m.role === "member").slice(-5).reverse();

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

        {staff.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Admins &amp; moderators</p>
            <div className="divide-y divide-border">
              {staff.map((m) => (
                <MemberRow
                  key={m.id}
                  member={m}
                  communitySlug={communitySlug}
                  currentUserId={currentUserId}
                  viewerIsOwner={viewerIsOwner}
                  allowStaff={allowStaff}
                />
              ))}
            </div>
          </div>
        )}

        {recentMembers.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Recently joined</p>
            <div className="divide-y divide-border">
              {recentMembers.map((m) => (
                <MemberRow
                  key={m.id}
                  member={m}
                  communitySlug={communitySlug}
                  currentUserId={currentUserId}
                  viewerIsOwner={viewerIsOwner}
                  allowStaff={allowStaff}
                />
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/c/${communitySlug}/members`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          All members, search &amp; invites <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
