import Link from "@/components/ui/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityAdmin } from "@/lib/data/community";
import {
  ANALYTICS_RANGES,
  getCommunityAnalytics,
  parseAnalyticsRange,
  periodChange,
} from "@/lib/data/community-analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ColumnChart, type ChartColumn } from "./column-chart";

// Activity for one community, for its owner and admins (and the platform super
// admin). All counting happens in the community_analytics() RPC, which also
// enforces access; this page is the same gate in front of it so a non-admin is
// sent back to the community instead of seeing an error.
export default async function CommunityAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string }>;
  searchParams: Promise<{ range?: string | string[] }>;
}) {
  const { communitySlug } = await params;
  const { range: rangeParam } = await searchParams;
  const range = parseAnalyticsRange(rangeParam);
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const [membership, profile] = await Promise.all([
    getMembership(supabase, community.id, user.id),
    getProfile(supabase, user.id),
  ]);
  if (!isCommunityAdmin(community, membership, user.id) && !profile?.is_super_admin) {
    redirect(`/c/${community.slug}`);
  }

  const analytics = await getCommunityAnalytics(supabase, community.id, range);
  const { current, previous, presence } = analytics;
  const base = `/c/${community.slug}`;

  const dayLabel = (day: string) =>
    new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });

  const activeColumns: ChartColumn[] = analytics.daily.map((d) => ({ label: dayLabel(d.day), value: d.active }));
  const membershipColumns: ChartColumn[] = analytics.daily.map((d) => ({
    label: dayLabel(d.day),
    value: d.joins,
    below: d.leaves,
  }));
  const contributionColumns: ChartColumn[] = analytics.daily.map((d) => ({
    label: dayLabel(d.day),
    value: d.posts + d.comments + d.reactions,
    detail: [`${d.posts} posts`, `${d.comments} comments`, `${d.reactions} smiles`],
  }));

  const tiles: { label: string; value: number; previous: number; upIsGood: boolean; note?: string }[] = [
    {
      label: "Active members",
      value: current.activeMembers,
      previous: previous.activeMembers,
      upIsGood: true,
      note: `${presence.activeToday} today`,
    },
    { label: "New members", value: current.joins, previous: previous.joins, upIsGood: true },
    { label: "Members left", value: current.leaves, previous: previous.leaves, upIsGood: false },
    { label: "Posts", value: current.posts, previous: previous.posts, upIsGood: true },
    { label: "Comments", value: current.comments, previous: previous.comments, upIsGood: true },
    { label: "Smiles", value: current.reactions, previous: previous.reactions, upIsGood: true },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href={`${base}/admin`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Admin
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Analytics</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Activity in {community.name}. {presence.memberCount.toLocaleString()} members ·{" "}
              {presence.active7d.toLocaleString()} active this week · {presence.active30d.toLocaleString()} this month.
            </p>
          </div>
        </div>

        {/* Range filter: plain links, so the choice lives in the URL and survives a refresh. */}
        <nav aria-label="Time range" className="flex rounded-md border border-border bg-card p-0.5 text-sm">
          {ANALYTICS_RANGES.map((r) => (
            <Link
              key={r}
              href={`${base}/admin/analytics?range=${r}`}
              aria-current={r === range ? "page" : undefined}
              className={cn(
                "rounded px-3 py-1 transition-colors",
                r === range ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r} days
            </Link>
          ))}
        </nav>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {tiles.map((tile) => {
          const change = periodChange(tile.value, tile.previous);
          const good = change !== null && (tile.upIsGood ? change > 0 : change < 0);
          const bad = change !== null && (tile.upIsGood ? change < 0 : change > 0);
          return (
            <Card key={tile.label}>
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground">{tile.label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{tile.value.toLocaleString()}</p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    good ? "text-accent" : bad ? "text-danger" : "text-muted-foreground"
                  )}
                >
                  {change === null
                    ? tile.value > 0
                      ? "New this period"
                      : "No change"
                    : `${change > 0 ? "▲ +" : change < 0 ? "▼ " : ""}${change}% vs previous ${range} days`}
                </p>
                {tile.note && <p className="mt-0.5 text-xs text-muted-foreground">{tile.note}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-5">
            <ColumnChart title="Active members per day" valueName="Active members" columns={activeColumns} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <ColumnChart
              title="Members joining and leaving"
              valueName="Joined"
              belowName="Left"
              columns={membershipColumns}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="pt-5">
            <ColumnChart
              title="Posts, comments and smiles per day"
              valueName="Total"
              columns={contributionColumns}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Busiest spaces</h2>
          <Card>
            <CardContent className="pt-5">
              {analytics.topSpaces.length === 0 ? (
                <p className="text-sm text-muted-foreground">No posts or comments in the last {range} days.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr>
                      <th className="pb-2 font-medium">Space</th>
                      <th className="pb-2 text-right font-medium">Posts</th>
                      <th className="pb-2 text-right font-medium">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {analytics.topSpaces.map((space) => (
                      <tr key={space.id} className="border-t border-border">
                        <td className="py-2">
                          <Link href={`${base}/spaces/${space.slug}`} className="text-foreground hover:underline">
                            {space.name}
                          </Link>
                        </td>
                        <td className="py-2 text-right text-foreground">{space.posts.toLocaleString()}</td>
                        <td className="py-2 text-right text-foreground">{space.comments.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Most active members</h2>
          <Card>
            <CardContent className="pt-5">
              {analytics.topMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No member activity in the last {range} days.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr>
                      <th className="pb-2 font-medium">Member</th>
                      <th className="pb-2 text-right font-medium" title="Days active">Days</th>
                      <th className="pb-2 text-right font-medium">Posts</th>
                      <th className="pb-2 text-right font-medium">Comments</th>
                      <th className="pb-2 text-right font-medium">Smiles</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {analytics.topMembers.map((member) => (
                      <tr key={member.userId} className="border-t border-border">
                        <td className="py-2">
                          <Link
                            href={`${base}/members/${member.username}`}
                            className="flex min-w-0 items-center gap-2 text-foreground hover:underline"
                          >
                            <Avatar src={member.avatarUrl} name={member.name} size={24} />
                            <span className="truncate">{member.name}</span>
                          </Link>
                        </td>
                        <td className="py-2 text-right text-foreground">{member.activeDays}</td>
                        <td className="py-2 text-right text-foreground">{member.posts}</td>
                        <td className="py-2 text-right text-foreground">{member.comments}</td>
                        <td className="py-2 text-right text-foreground">{member.reactions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Days are counted in UTC. &ldquo;Active&rdquo; means a member opened {community.name} that day. Join and leave
        history starts from August 2026, when the app began recording it.
      </p>
    </div>
  );
}
