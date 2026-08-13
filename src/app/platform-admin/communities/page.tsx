import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getPlatformOverview, getCommunitiesWithMembers, getAllUsers, getSpamCandidates } from "@/lib/data/platform-analytics";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { SpamCleanup } from "./spam-cleanup";

export const dynamic = "force-dynamic";

export default async function PlatformCommunitiesPage() {
  // The layout already gates this route; re-verify here because the page reads
  // through the service-role admin client, which bypasses RLS entirely.
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/login?next=/platform-admin/communities");
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) redirect("/dashboard");

  const admin = createAdminClient();
  const [overview, communities, users, spamCandidates] = await Promise.all([
    getPlatformOverview(admin),
    getCommunitiesWithMembers(admin),
    getAllUsers(admin),
    getSpamCandidates(admin),
  ]);

  const unattachedCount = users.filter((u) => u.communityCount === 0).length;

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Every community on the platform with its members underneath. Members are ordered most-engaged first — staff, then by
        contribution score and how recently they were active. Click a member to see their full activity across every community.
      </p>

      <div className="mb-8 grid grid-cols-3 gap-3">
        <StatTile label="Communities" value={overview.communities} />
        <StatTile label="Users" value={overview.users} />
        <StatTile label="Active memberships" value={overview.memberships} />
      </div>

      <SpamCleanup candidates={spamCandidates} />

      <details className="mb-8 rounded-lg border border-border p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">All users ({users.length})</span>
          <span className="text-xs text-muted-foreground">
            {unattachedCount > 0 ? `${unattachedCount} in no community` : "everyone is in a community"}
          </span>
        </summary>
        <p className="mb-3 mt-2 text-xs text-muted-foreground">
          Every registered user, including people who signed up but haven&apos;t joined a community — those show above the
          rest and are why the total user count is higher than the members listed under communities.
        </p>
        <ul className="divide-y divide-border border-t border-border">
          {users.map(({ profile, communityCount }) => (
            <li key={profile.id}>
              <Link
                href={`/platform-admin/users/${profile.id}`}
                className="flex items-center gap-3 py-2.5 hover:opacity-80"
              >
                <Avatar src={profile.avatar_url} name={profile.full_name || profile.username} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {profile.full_name || profile.username}
                    {profile.is_super_admin && (
                      <span className="ml-2 align-middle text-[10px] font-medium uppercase tracking-wide text-accent">
                        Super admin
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">@{profile.username}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-xs text-muted-foreground">
                    {profile.last_active_at ? `Active ${formatRelativeTime(profile.last_active_at)}` : "Never active"}
                  </p>
                  <p className="text-xs text-muted-foreground">Joined {formatDate(profile.created_at)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge tone={communityCount === 0 ? "danger" : "neutral"}>
                    {communityCount === 0
                      ? "No community"
                      : `${communityCount} ${communityCount === 1 ? "community" : "communities"}`}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{profile.contribution_score} pts</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </details>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Communities</h2>

      <div className="space-y-3">
        {communities.map(({ community, memberCount, members }) => (
          <details key={community.id} className="rounded-lg border border-border p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{community.name}</p>
                <p className="text-xs text-muted-foreground">/c/{community.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={community.privacy === "public" ? "accent" : "neutral"}>{community.privacy}</Badge>
                <Badge tone="neutral">
                  {memberCount} {memberCount === 1 ? "member" : "members"}
                </Badge>
              </div>
            </summary>

            <p className="mt-2 text-xs text-muted-foreground">Created {formatDate(community.created_at)}</p>

            {members.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No active members yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border border-t border-border">
                {members.map((member) => (
                  <li key={member.profile.id}>
                    <Link
                      href={`/platform-admin/users/${member.profile.id}`}
                      className="flex items-center gap-3 py-2.5 hover:opacity-80"
                    >
                      <Avatar
                        src={member.profile.avatar_url}
                        name={member.profile.full_name || member.profile.username}
                        size={36}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {member.profile.full_name || member.profile.username}
                          {member.profile.is_super_admin && (
                            <span className="ml-2 align-middle text-[10px] font-medium uppercase tracking-wide text-accent">
                              Super admin
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">@{member.profile.username}</p>
                      </div>
                      <div className="hidden text-right sm:block">
                        <p className="text-xs text-muted-foreground">
                          {member.profile.last_active_at
                            ? `Active ${formatRelativeTime(member.profile.last_active_at)}`
                            : "Never active"}
                        </p>
                        <p className="text-xs text-muted-foreground">Joined {formatDate(member.joinedAt)}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <Badge tone={member.role === "member" ? "neutral" : "accent"}>{member.role}</Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {member.profile.contribution_score} pts
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-border pt-3">
              <Link href={`/c/${community.slug}`} className="text-xs text-accent underline">
                Open community →
              </Link>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-2xl font-semibold tracking-tight text-foreground">{value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
