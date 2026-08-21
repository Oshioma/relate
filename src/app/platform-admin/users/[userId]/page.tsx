import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Briefcase, FileText, MessageSquare, CalendarDays, CalendarCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getPlatformUserDetail } from "@/lib/data/platform-analytics";
import { getUserAuthActivity } from "@/lib/data/auth-analytics";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime, formatRelativeTime } from "@/lib/utils";
import type { AuthEventType } from "@/types/database";

// Same wording as the platform-admin "Signups & logins" tab.
const AUTH_EVENT_LABELS: Record<AuthEventType, string> = {
  signup: "Signed up",
  email_confirmed: "Confirmed email",
  login: "Signed in",
  join: "Joined",
  invited: "Invited",
  leave: "Left",
};

export const dynamic = "force-dynamic";

export default async function PlatformUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  // Re-verify: this page reads through the service-role admin client.
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect(`/login?next=/platform-admin/users/${userId}`);
  const viewer = await getProfile(supabase, user.id);
  if (!viewer?.is_super_admin) redirect("/dashboard");

  const admin = createAdminClient();
  const [detail, authActivity] = await Promise.all([
    getPlatformUserDetail(admin, userId),
    getUserAuthActivity(admin, userId),
  ]);
  if (!detail) notFound();

  const { profile, memberships, totals, byCommunity, recentActivity } = detail;
  const mostActive = byCommunity[0];

  return (
    <div>
      <Link
        href="/platform-admin/communities"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Communities &amp; Members
      </Link>

      {/* Profile header */}
      <div className="flex items-start gap-4">
        <Avatar src={profile.avatar_url} name={profile.full_name || profile.username} size={72} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {profile.full_name || profile.username}
            </h2>
            {profile.is_super_admin && <Badge tone="accent">Super admin</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
          {(profile.profession || profile.company) && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              {[profile.profession, profile.company].filter(Boolean).join(" at ")}
            </p>
          )}
          {profile.bio && <p className="mt-2 max-w-xl text-sm text-foreground">{profile.bio}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="accent">{profile.contribution_score} points</Badge>
            <Badge tone="neutral">Joined {formatDate(profile.created_at)}</Badge>
            <Badge tone="neutral">
              {profile.last_active_at ? `Active ${formatRelativeTime(profile.last_active_at)}` : "Never active"}
            </Badge>
            <Badge tone="neutral">
              {authActivity.lastLoginAt
                ? `Last sign-in ${formatRelativeTime(authActivity.lastLoginAt)}`
                : "No sign-in recorded"}
            </Badge>
          </div>
          {/* Where this account came from — recorded at signup from the invite
              link, community page or domain the person used. */}
          <p className="mt-2 text-sm text-muted-foreground">
            Signed up{" "}
            {authActivity.signupCommunity ? (
              <>
                via{" "}
                <Link
                  href={`/c/${authActivity.signupCommunity.slug}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {authActivity.signupCommunity.name}
                </Link>
              </>
            ) : (
              "on the main site (no community attached)"
            )}
            {authActivity.signupSource ? ` · ${authActivity.signupSource.replace(/_/g, " ")}` : ""} ·{" "}
            {authActivity.loginCount} recorded {authActivity.loginCount === 1 ? "sign-in" : "sign-ins"}
          </p>
        </div>
      </div>

      {/* Activity totals */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={<FileText className="h-4 w-4" />} label="Posts" value={totals.posts} />
        <StatTile icon={<MessageSquare className="h-4 w-4" />} label="Comments" value={totals.comments} />
        <StatTile icon={<CalendarDays className="h-4 w-4" />} label="Events hosted" value={totals.eventsHosted} />
        <StatTile icon={<CalendarCheck className="h-4 w-4" />} label="Events attended" value={totals.eventsAttended} />
      </div>

      {mostActive && (mostActive.posts > 0 || mostActive.comments > 0) && (
        <p className="mt-4 text-sm text-muted-foreground">
          Most active in{" "}
          <Link href={`/c/${mostActive.communitySlug}`} className="font-medium text-foreground hover:underline">
            {mostActive.communityName}
          </Link>{" "}
          ({mostActive.posts} posts, {mostActive.comments} comments).
        </p>
      )}

      {/* Memberships */}
      <section className="mt-10">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Communities ({memberships.length})
        </h3>
        {memberships.length === 0 ? (
          <p className="text-sm text-muted-foreground">Not a member of any community.</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {memberships.map((m) => {
              const activity = byCommunity.find((c) => c.communityId === m.community.id);
              return (
                <li key={m.community.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <Link href={`/c/${m.community.slug}`} className="truncate text-sm font-medium text-foreground hover:underline">
                      {m.community.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Joined {formatDate(m.joinedAt)}
                      {activity ? ` · ${activity.posts} posts, ${activity.comments} comments` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {m.status !== "active" && <Badge tone="danger">{m.status}</Badge>}
                    <Badge tone={m.role === "member" ? "neutral" : "accent"}>{m.role}</Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Account events — signups, sign-ins and membership changes from the
          auth_events log (see the platform-admin "Signups & logins" tab). */}
      <section className="mt-10">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Account events</h3>
        {authActivity.events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing recorded yet — event logging started when this feature shipped.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {authActivity.events.map((event) => (
              <li key={event.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">
                    {AUTH_EVENT_LABELS[event.type]}
                    {event.communityName && (
                      <>
                        {" "}
                        <span className="text-muted-foreground">
                          {event.type === "login" ? "on" : "—"}{" "}
                        </span>
                        {event.communitySlug ? (
                          <Link href={`/c/${event.communitySlug}`} className="font-medium hover:underline">
                            {event.communityName}
                          </Link>
                        ) : (
                          event.communityName
                        )}
                      </>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatDateTime(event.createdAt)}
                    {event.source ? ` · ${event.source.replace(/_/g, " ")}` : ""}
                    {event.backfilled ? " · backfilled" : ""}
                  </p>
                </div>
                {event.communityPrivacy && event.communityPrivacy !== "public" && (
                  <Badge tone="neutral">{event.communityPrivacy}</Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent activity */}
      <section className="mt-10">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Recent activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts or comments yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentActivity.map((item) => {
              const href = `/c/${item.communitySlug}/spaces/${item.spaceSlug}/posts/${item.postId}`;
              return (
                <li key={`${item.kind}-${item.id}`} className="flex items-start gap-2.5 text-sm">
                  {item.kind === "post" ? (
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0">
                    {item.kind === "post" ? (
                      <p className="text-foreground">
                        Posted{" "}
                        <Link href={href} className="font-medium hover:underline">
                          {item.title}
                        </Link>
                      </p>
                    ) : (
                      <p className="text-foreground">
                        Commented on{" "}
                        <Link href={href} className="font-medium hover:underline">
                          {item.postTitle}
                        </Link>
                        : <span className="text-muted-foreground">{item.body.length > 120 ? `${item.body.slice(0, 120)}…` : item.body}</span>
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {item.communityName ? `${item.communityName} · ` : ""}
                      {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">{icon}</div>
      <p className="text-2xl font-semibold tracking-tight text-foreground">{value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
