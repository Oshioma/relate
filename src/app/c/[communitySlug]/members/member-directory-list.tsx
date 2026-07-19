"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { matchesQuery, type DirectoryMember } from "@/lib/data/member-directory";
import { MemberRoleSelect } from "./member-role-select";
import { RemoveMemberButton } from "./remove-member-button";
import { BlockMemberButton } from "./block-member-button";
import type { MembershipRole } from "@/types/database";

const roleTone = {
  owner: "accent",
  admin: "accent",
  moderator: "neutral",
  member: "neutral",
} as const;

type SortKey = "recent" | "score" | "newest" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Recently active" },
  { value: "score", label: "Top contributors" },
  { value: "newest", label: "Newest members" },
  { value: "name", label: "Name (A–Z)" },
];

function sortMembers(members: DirectoryMember[], sortBy: SortKey): DirectoryMember[] {
  const sorted = [...members];

  switch (sortBy) {
    case "recent":
      return sorted.sort((a, b) => {
        const aTime = a.profile.last_active_at ? new Date(a.profile.last_active_at).getTime() : 0;
        const bTime = b.profile.last_active_at ? new Date(b.profile.last_active_at).getTime() : 0;
        return bTime - aTime;
      });
    case "score":
      return sorted.sort((a, b) => b.profile.contribution_score - a.profile.contribution_score);
    case "newest":
      return sorted.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
    case "name":
      return sorted.sort((a, b) =>
        (a.profile.full_name || a.profile.username).localeCompare(b.profile.full_name || b.profile.username)
      );
  }
}

export function MemberDirectoryList({
  members,
  communitySlug,
  currentUserId,
  isAdmin,
}: {
  members: DirectoryMember[];
  communitySlug: string;
  currentUserId: string;
  isAdmin: boolean;
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<MembershipRole | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("recent");

  const filtered = useMemo(() => {
    const matches = members.filter((member) => matchesQuery(member, query) && (roleFilter === "all" || member.role === roleFilter));
    return sortMembers(matches, sortBy);
  }, [members, query, roleFilter, sortBy]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, profession, interests, skills…"
            className="pl-9"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value as MembershipRole | "all")}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="member">Member</option>
        </select>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortKey)}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No members match" description="Try a different search or filter." />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {filtered.map((member) => {
              const canManage = isAdmin && member.role !== "owner" && member.profile.id !== currentUserId;

              return (
                <div key={member.membershipId} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <Link
                    href={`/c/${communitySlug}/members/${member.profile.username}`}
                    className="flex min-w-0 items-center gap-3 hover:opacity-80"
                  >
                    <Avatar src={member.profile.avatar_url} name={member.profile.full_name || member.profile.username} size={36} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {member.profile.full_name || member.profile.username}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">@{member.profile.username}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3">
                    {canManage ? (
                      <>
                        <MemberRoleSelect membershipId={member.membershipId} role={member.role} communitySlug={communitySlug} />
                        <RemoveMemberButton membershipId={member.membershipId} communitySlug={communitySlug} />
                      </>
                    ) : (
                      <Badge tone={roleTone[member.role]}>{member.role}</Badge>
                    )}
                    {member.profile.id !== currentUserId && (
                      <BlockMemberButton profileId={member.profile.id} communitySlug={communitySlug} />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
