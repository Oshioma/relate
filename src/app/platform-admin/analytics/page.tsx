import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import {
  AUTH_EVENT_RANGES,
  AuthEventsNotInstalledError,
  getAuthAnalytics,
  parseAuthEventRange,
  type AuthAnalytics,
  type AuthEventFeedItem,
  type CommunityAuthActivity,
} from "@/lib/data/auth-analytics";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import type { AuthEventType } from "@/types/database";

export const dynamic = "force-dynamic";

// Human labels for the raw event types and the source strings the auth flows
// record (see src/lib/auth-events.ts).
const EVENT_LABELS: Record<AuthEventType, string> = {
  signup: "Signed up",
  email_confirmed: "Confirmed email",
  login: "Signed in",
  join: "Joined",
  invited: "Invited",
  leave: "Left",
};

const SOURCE_LABELS: Record<string, string> = {
  invite: "invite link",
  community_page: "community page",
  custom_domain: "custom domain",
  subdomain: "community subdomain",
  platform: "main site",
  backfill: "backfilled",
};

export default async function PlatformAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  // The layout gates the section; re-verify here because everything below is
  // read with the service-role client, which bypasses RLS — that is what makes
  // private and invite-only communities visible in this tab at all.
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/login?next=/platform-admin/analytics");
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) redirect("/dashboard");

  const range = parseAuthEventRange((await searchParams).range);
  const admin = createAdminClient();

  let analytics: AuthAnalytics;
  try {
    analytics = await getAuthAnalytics(admin, range);
  } catch (error) {
    if (error instanceof AuthEventsNotInstalledError) return <NotInstalled />;
    throw error;
  }

  const rangeLabel = AUTH_EVENT_RANGES.find((r) => r.key === range)!.label.toLowerCase();
  // A community belongs in the main list if anything happened in it — an event
  // or simply somebody being there.
  const hasActivity = (c: CommunityAuthActivity) =>
    c.counts.signup + c.counts.join + c.counts.login + c.counts.leave + c.presence.activeInWindow > 0;
  const active = analytics.byCommunity.filter(hasActivity);
  const quiet = analytics.byCommunity.filter((c) => !hasActivity(c) && c.communityId);

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Every signup, sign-in and membership change on the platform, plus who was actually around, attributed to the
        community it happened in. Private and invite-only communities are included — this page reads past row-level
        security, so a new member joining a community you aren&apos;t in still shows up here.
      </p>

      {/* Range picker */}
      <nav className="mb-6 flex flex-wrap gap-1">
        {AUTH_EVENT_RANGES.map((option) => (
          <Link
            key={option.key}
            href={`/platform-admin/analytics?range=${option.key}`}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              option.key === range
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {option.label}
          </Link>
        ))}
      </nav>

      {/* Presence — who was actually here, independent of the range picker
          (these are fixed windows: today, yesterday, 7 and 30 days). */}
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Active people</h2>
      {analytics.presenceAvailable ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Active today" value={analytics.active.today} hint="distinct people, UTC day" />
            <StatTile label="Yesterday" value={analytics.active.yesterday} hint="for comparison" />
            <StatTile label="Last 7 days" value={analytics.active.last7} hint="weekly actives" />
            <StatTile label="Last 30 days" value={analytics.active.last30} hint="monthly actives" />
          </div>
          <p className="mb-8 mt-3 text-xs text-muted-foreground">
            Counted from real page views by signed-in people, not from sign-ins — someone who returns every day without
            ever signing in again still counts. Each person is counted once per community per 15 minutes, and days are
            UTC.
          </p>
        </>
      ) : (
        <p className="mb-8 rounded-lg border border-border p-4 text-sm text-muted-foreground">
          Presence isn&apos;t being tracked on this database yet — push the{" "}
          <code>member_activity_presence</code> migration and these numbers start filling in from that moment.
        </p>
      )}

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Signups &amp; events (last {rangeLabel})
      </h2>
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Signups" value={analytics.totals.signup} hint={`new accounts, last ${rangeLabel}`} />
        <StatTile label="Confirmed" value={analytics.totals.email_confirmed} hint="clicked the email link" />
        <StatTile label="Sign-ins" value={analytics.totals.login} hint="password sign-ins" />
        <StatTile label="Joins" value={analytics.totals.join} hint="memberships activated" />
        <StatTile label="Invited" value={analytics.totals.invited} hint="not yet accepted" />
        <StatTile label="Left" value={analytics.totals.leave} hint="memberships ended" />
      </div>

      <p className="mb-8 text-xs text-muted-foreground">
        {analytics.signupsWithoutCommunity > 0 ? (
          <>
            <span className="font-medium text-foreground">{analytics.signupsWithoutCommunity}</span> of those signups
            are still in no community at all.{" "}
          </>
        ) : null}
        Sign-ins are only recorded when someone actually uses the sign-in form — a member returning on a live session
        doesn&apos;t create one.
        {analytics.truncated && (
          <span className="text-danger">
            {" "}
            The per-community breakdown below was capped at {analytics.rowsAnalysed.toLocaleString()} events; the
            totals above are still exact.
          </span>
        )}
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <DailyTrend days={analytics.daily} />
        {analytics.presenceAvailable && <DailyActive days={analytics.dailyActive} />}
      </div>

      {/* Per-community breakdown */}
      <h2 className="mb-3 mt-10 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        By community ({active.length} active, last {rangeLabel})
      </h2>
      {active.length === 0 ? (
        <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
          Nothing happened in this window. Try a longer range.
        </p>
      ) : (
        <div className="space-y-2">
          {active.map((row) => (
            <CommunityRow key={row.communityId ?? "none"} row={row} />
          ))}
        </div>
      )}

      {quiet.length > 0 && (
        <details className="mt-4 rounded-lg border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            No activity in this window ({quiet.length})
          </summary>
          <ul className="mt-3 space-y-1.5">
            {quiet.map((row) => (
              <li key={row.communityId} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-muted-foreground">
                  {row.name} <span className="text-xs">/c/{row.slug}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {row.memberCount} {row.memberCount === 1 ? "member" : "members"}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Live feed */}
      <h2 className="mb-3 mt-10 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Latest events ({analytics.recent.length})
      </h2>
      {analytics.recent.length === 0 ? (
        <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
          No events recorded in this window yet.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {analytics.recent.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </ul>
      )}
    </div>
  );
}

// The one state that isn't an error worth a stack trace: the migration that
// creates auth_events hasn't been pushed to this project yet.
function NotInstalled() {
  return (
    <div className="rounded-lg border border-border p-6">
      <p className="text-sm font-medium text-foreground">Event logging isn&apos;t set up on this database yet.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Push the <code>auth_events_analytics</code> migration (<code>supabase db push</code>, or paste
        <code> supabase/migrations/*_auth_events_analytics.sql</code> into the SQL editor). It creates the event log,
        starts recording signups, sign-ins and membership changes from that moment on, and backfills the signups and
        joins that already happened so this page opens with history rather than a blank slate.
      </p>
    </div>
  );
}

function CommunityRow({ row }: { row: CommunityAuthActivity }) {
  const newcomers = row.counts.signup + row.counts.join;
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {row.slug && row.communityId ? (
              <Link href={`/c/${row.slug}`} className="hover:underline">
                {row.name}
              </Link>
            ) : (
              row.name
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.slug ? `/c/${row.slug} · ` : ""}
            {row.memberCount} {row.memberCount === 1 ? "member" : "members"}
            {row.lastEventAt ? ` · last activity ${formatRelativeTime(row.lastEventAt)}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {row.privacy && <Badge tone={row.privacy === "public" ? "accent" : "neutral"}>{row.privacy}</Badge>}
          {row.createdInWindow && <Badge tone="accent">new community</Badge>}
          {newcomers > 0 && (
            <Badge tone="accent">
              +{newcomers} {newcomers === 1 ? "newcomer" : "newcomers"}
            </Badge>
          )}
          {row.presence.activeToday > 0 && (
            <Badge tone="neutral">
              {row.presence.activeToday} active today
              {row.presence.membersActiveToday < row.presence.activeToday
                ? ` (${row.presence.membersActiveToday} members)`
                : ""}
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
        <Metric label="Signups" value={row.counts.signup} />
        <Metric label="Joins" value={row.counts.join} />
        <Metric label="Sign-ins" value={row.counts.login} />
        <Metric label="Invited" value={row.counts.invited} />
        <Metric label="Left" value={row.counts.leave} />
        <Metric label="Active today" value={row.presence.activeToday} />
        <Metric label="Active in range" value={row.presence.activeInWindow} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <span className={value > 0 ? "text-foreground" : undefined}>
      <span className="font-medium">{value}</span> {label.toLowerCase()}
    </span>
  );
}

function EventRow({ event }: { event: AuthEventFeedItem }) {
  const name = event.user?.full_name || event.user?.username || "Deleted account";
  return (
    <li className="flex items-center gap-3 px-4 py-2.5">
      <Avatar src={event.user?.avatar_url ?? null} name={name} size={32} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-foreground">
          {event.user ? (
            <Link href={`/platform-admin/users/${event.user.id}`} className="font-medium hover:underline">
              {name}
            </Link>
          ) : (
            <span className="font-medium">{name}</span>
          )}{" "}
          <span className="text-muted-foreground">{EVENT_LABELS[event.type].toLowerCase()}</span>
          {event.communityName && (
            <>
              <span className="text-muted-foreground"> · </span>
              {event.communitySlug ? (
                <Link href={`/c/${event.communitySlug}`} className="hover:underline">
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
          {event.source ? ` · ${SOURCE_LABELS[event.source] ?? event.source}` : ""}
          {event.host ? ` · ${event.host}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge tone={event.type === "leave" ? "danger" : event.type === "signup" ? "accent" : "neutral"}>
          {EVENT_LABELS[event.type]}
        </Badge>
        {event.communityPrivacy && event.communityPrivacy !== "public" && (
          <span className="text-[11px] text-muted-foreground">{event.communityPrivacy}</span>
        )}
      </div>
    </li>
  );
}

// A plain CSS bar chart of the window, day by day: signups stacked over joins
// over sign-ins. No chart library — three divs whose heights are a percentage
// of the busiest day.
function DailyTrend({ days }: { days: { day: string; counts: Record<AuthEventType, number> }[] }) {
  if (days.length === 0) return null;
  const peak = Math.max(
    1,
    ...days.map((d) => d.counts.signup + d.counts.join + d.counts.login)
  );

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Daily activity</span>
        <LegendSwatch className="bg-accent" label="Signups" />
        <LegendSwatch className="bg-accent/50" label="Joins" />
        <LegendSwatch className="bg-muted-foreground/40" label="Sign-ins" />
      </div>
      <div className="flex h-32 items-end gap-[3px] overflow-x-auto">
        {days.map((day) => {
          const total = day.counts.signup + day.counts.join + day.counts.login;
          return (
            <div
              key={day.day}
              className="flex min-w-[6px] flex-1 flex-col justify-end"
              title={`${day.day} — ${day.counts.signup} signups, ${day.counts.join} joins, ${day.counts.login} sign-ins`}
            >
              <div style={{ height: `${(day.counts.signup / peak) * 100}%` }} className="w-full rounded-t-sm bg-accent" />
              <div style={{ height: `${(day.counts.join / peak) * 100}%` }} className="w-full bg-accent/50" />
              <div
                style={{ height: `${(day.counts.login / peak) * 100}%` }}
                className="w-full bg-muted-foreground/40"
              />
              {total === 0 && <div className="h-px w-full bg-border" />}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>{days[0].day}</span>
        <span>{days[days.length - 1].day}</span>
      </div>
    </div>
  );
}

// Distinct people seen per day. Deliberately its own chart rather than a fourth
// series on the one above: actives are a superset of signups and joins, so
// stacking them would misread as a total.
function DailyActive({ days }: { days: { day: string; active: number }[] }) {
  if (days.length === 0) {
    return (
      <div className="rounded-lg border border-border p-4">
        <p className="text-xs font-medium text-foreground">Daily active people</p>
        <p className="mt-2 text-xs text-muted-foreground">Nobody recorded yet.</p>
      </div>
    );
  }
  const peak = Math.max(1, ...days.map((d) => d.active));

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Daily active people</span>
        <span>peak {peak.toLocaleString()}</span>
      </div>
      <div className="flex h-32 items-end gap-[3px] overflow-x-auto">
        {days.map((day) => (
          <div
            key={day.day}
            className="flex min-w-[6px] flex-1 flex-col justify-end"
            title={`${day.day} — ${day.active} active`}
          >
            <div
              style={{ height: `${(day.active / peak) * 100}%` }}
              className="w-full rounded-t-sm bg-accent/70"
            />
            {day.active === 0 && <div className="h-px w-full bg-border" />}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>{days[0].day}</span>
        <span>{days[days.length - 1].day}</span>
      </div>
    </div>
  );
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2.5 w-2.5 rounded-sm", className)} />
      {label}
    </span>
  );
}

function StatTile({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-2xl font-semibold tracking-tight text-foreground">{value.toLocaleString()}</p>
      <p className="text-xs font-medium text-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{hint}</p>}
    </div>
  );
}
