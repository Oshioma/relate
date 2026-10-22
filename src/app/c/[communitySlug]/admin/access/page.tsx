import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck, Check, Lock, EyeOff, AlertTriangle, Info, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityAdmin } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityTiers } from "@/lib/data/tiers";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buildAccessOverview, type OverviewCell } from "@/lib/access/overview";
import type { AccessIssue, AccessState } from "@/lib/access/model";
import { describeListing } from "@/lib/access/summary";
import { describeJoining, joinPolicyOf } from "@/lib/join-policy";
import { SpaceAccessEditor } from "./space-access-editor";
import { AccessCheck } from "./access-check";

const STATE_LOOK: Record<AccessState, { label: string; icon: typeof Check; className: string }> = {
  open: { label: "Opens", icon: Check, className: "text-accent" },
  locked: { label: "Locked", icon: Lock, className: "text-foreground" },
  hidden: { label: "Not shown", icon: EyeOff, className: "text-muted-foreground" },
};

function IssueLine({ issue }: { issue: AccessIssue }) {
  const Icon = issue.severity === "problem" ? AlertTriangle : Info;
  return (
    <li className={cn("flex items-start gap-2 rounded-md px-3 py-2 text-xs", issue.severity === "problem" ? "bg-danger/10 text-danger" : "bg-muted text-foreground")}>
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      {issue.message}
    </li>
  );
}

function CellView({ cell }: { cell: OverviewCell }) {
  const look = STATE_LOOK[cell.state];
  const Icon = look.icon;
  return (
    <div>
      <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", look.className)}>
        <Icon className="h-3.5 w-3.5" />
        {look.label}
      </span>
      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
        {cell.source === "community" && <Building2 className="mr-1 inline h-3 w-3 align-[-2px]" aria-label="Community-wide setting" />}
        {cell.reasonText}
      </p>
    </div>
  );
}

// Who can see what, space by space and person by person, with the rule behind
// each answer. Admins change a space's access in place with the same picker as
// the space editor. Everything here is worked out from the settings the admin
// can already read (src/lib/access); no member's content is opened to build it.
export default async function AccessOverviewPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const membership = await getMembership(supabase, community.id, user.id);
  if (!isCommunityAdmin(community, membership, user.id)) redirect(`/c/${community.slug}`);

  const [spaces, allTiers, { data: canCharge }, { data: memberRows }] = await Promise.all([
    getCommunitySpaces(supabase, community.id),
    getCommunityTiers(supabase, community.id),
    supabase.rpc("community_can_charge", { p_community_id: community.id }),
    // Everyone connected to the community, banned and pending included: "why
    // can't they get in?" is most often about exactly those people.
    supabase
      .from("community_memberships")
      .select("user_id, status, profile:user_id (full_name, username)")
      .eq("community_id", community.id)
      .in("status", ["active", "invited", "requested", "banned"]),
  ]);
  const people = ((memberRows ?? []) as unknown as { user_id: string; status: string; profile: { full_name: string | null; username: string } | null }[])
    .map((m) => ({ id: m.user_id, status: m.status, name: m.profile?.full_name || m.profile?.username || "Unnamed member" }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const tiers = allTiers.map((t) => ({ id: t.id, name: t.name, price_cents: t.price_cents, currency: t.currency, archived_at: t.archived_at }));
  const tierIdsBySpaceId: Record<string, string[]> = {};
  for (const tier of allTiers) for (const spaceId of tier.spaceIds) (tierIdsBySpaceId[spaceId] ??= []).push(tier.id);
  const accessCommunity = {
    privacy: community.privacy,
    feed_public: community.feed_public,
    events_public: community.events_public,
    members_visibility: community.members_visibility,
    stripe_charges_enabled: community.stripe_charges_enabled,
  };
  const accessSpaces = spaces.map((s) => ({
    id: s.id,
    name: s.name,
    visibility: s.visibility,
    price_cents: s.price_cents,
    currency: s.currency,
    show_in_nav: s.show_in_nav,
    when_locked: s.when_locked,
    tierIds: tierIdsBySpaceId[s.id] ?? [],
  }));
  const { viewers, rows, communityIssues } = buildAccessOverview(accessCommunity, accessSpaces, tiers);
  const paymentsEnabled = Boolean(canCharge) && community.stripe_charges_enabled;
  const base = `/c/${community.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href={`${base}/admin#who-can-see-what`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
        <ShieldCheck className="h-5 w-5 text-accent" />
        Who can see what
      </h1>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
        Every space in {community.name}, and what each kind of person gets when they try to open it. This is worked out
        from your settings, the same way the database enforces them. Change a space with its Change button; you&apos;ll be
        told who gains or loses access before it saves.
      </p>

      <Card className="mt-6">
        <CardContent className="space-y-1 pt-5 text-sm">
          <p className="flex items-start gap-1.5 text-foreground">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              <span className="font-medium">Community-wide:</span> {describeListing(accessCommunity)}{" "}
              {community.privacy !== "invite_only" && describeJoining(joinPolicyOf(community))}{" "}
              <Link href={`${base}/admin#discoverability`} className="text-accent underline-offset-2 hover:underline">
                Change
              </Link>
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Answers marked <Building2 className="inline h-3 w-3 align-[-2px]" /> come from this community-wide setting rather
            than the space&apos;s own.
          </p>
          {communityIssues.length > 0 && <ul className="space-y-1.5 pt-2">{communityIssues.map((i) => <IssueLine key={i.code + (i.tierId ?? "")} issue={i} />)}</ul>}
        </CardContent>
      </Card>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No spaces yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="bg-muted/60">
              <tr>
                <th scope="col" className="w-64 px-3 py-2 text-xs font-semibold text-foreground">
                  Space
                </th>
                {viewers.map((v) => (
                  <th key={v.key} scope="col" className="px-3 py-2 text-xs font-semibold text-foreground" title={v.note}>
                    {v.label}
                    {v.note && <span className="block text-[11px] font-normal text-muted-foreground">{v.note}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.space.id} className="border-t border-border align-top">
                  <th scope="row" className="px-3 py-3 text-left font-normal">
                    <p className="text-sm font-semibold text-foreground">{row.space.name}</p>
                    <p className="text-xs text-muted-foreground">{row.access}</p>
                    {row.inherited && (
                      <p className="mt-1 flex items-start gap-1 text-[11px] text-muted-foreground">
                        <Building2 className="mt-0.5 h-3 w-3 shrink-0" />
                        {row.inherited}
                      </p>
                    )}
                    {row.issues.length > 0 && <ul className="mt-2 space-y-1">{row.issues.map((i) => <IssueLine key={i.code} issue={i} />)}</ul>}
                    <SpaceAccessEditor
                      space={row.space}
                      tiers={tiers}
                      community={accessCommunity}
                      communitySlug={community.slug}
                      paymentsEnabled={paymentsEnabled}
                    />
                  </th>
                  {row.cells.map((cell) => (
                    <td key={cell.viewerKey} className="px-3 py-3">
                      <CellView cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AccessCheck people={people} spaces={spaces.map((s) => ({ id: s.id, name: s.name, teaser: s.when_locked === "teaser" }))} />
    </div>
  );
}
