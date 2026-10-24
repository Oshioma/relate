import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, Info, ArrowRight, Check, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { describeSpaceAccess, findAccessIssues, type AccessCommunity, type AccessSpace, type AccessTier } from "@/lib/access/model";
import { getAccessPreset, matchPreset } from "@/lib/access/presets";
import { describeAudiences, summarizeAccessGroups, type AccessGroupKey } from "@/lib/access/summary";
import type { Community, JoinPolicy } from "@/types/database";
import { AccessGroupTiles } from "./access-group-tiles";
import { PublicAccessForm } from "./public-access-form";
import { MonetizationChecklist, type ChecklistStep } from "./monetization-checklist";
import { SpaceAccessEditor } from "./access/space-access-editor";

function Chips({ names, locked }: { names: string[]; locked?: boolean }) {
  if (!names.length) return null;
  const Icon = locked ? Lock : Check;
  return (
    <span className="mt-1 flex flex-wrap gap-1.5">
      {names.map((name) => (
        <span
          key={name}
          className={
            locked
              ? "inline-flex max-w-full items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              : "inline-flex max-w-full items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-xs text-foreground"
          }
        >
          <Icon className="h-3 w-3 shrink-0" />
          <span className="truncate">{name}</span>
        </span>
      ))}
    </span>
  );
}

// "Who can see what?" at the top of Admin: what visitors, free members and
// paid members each get (worked out space by space, so the lines can't
// contradict each other), anything that looks wrong, and the four groups the
// settings are arranged in. Each group opens its settings right below itself.
export function AccessSummaryCard({
  community,
  fullCommunity,
  joinPolicy,
  spaces,
  tiers,
  canCharge,
  isOwner,
  communitySlug,
  checklistSteps,
}: {
  community: AccessCommunity;
  fullCommunity: Community;
  joinPolicy: JoinPolicy;
  spaces: AccessSpace[];
  tiers: AccessTier[];
  canCharge: boolean;
  isOwner: boolean;
  communitySlug: string;
  checklistSteps: ChecklistStep[];
}) {
  const audiences = describeAudiences(community, spaces, tiers);
  const issues = findAccessIssues(community, spaces, tiers);
  const preset = getAccessPreset(matchPreset(community, spaces, tiers));
  const groups = summarizeAccessGroups({ community, joinPolicy, spaces, tiers, canCharge });
  const paymentsEnabled = canCharge && Boolean(community.stripe_charges_enabled);

  const panels: Record<AccessGroupKey, ReactNode> = {
    discoverability: <PublicAccessForm community={fullCommunity} section="discoverability" />,
    joining: <PublicAccessForm community={fullCommunity} section="joining" />,
    memberships: isOwner ? (
      <div className="space-y-3">
        <MonetizationChecklist steps={checklistSteps} />
        <p className="text-sm text-muted-foreground">
          A membership only unlocks the spaces you pick for it.{" "}
          <a href="#tiers" className="font-medium text-accent underline-offset-2 hover:underline">
            Create or edit memberships
          </a>
        </p>
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">Only the owner can change memberships and payments.</p>
    ),
    spaces: spaces.length ? (
      <ul className="divide-y divide-border">
        {spaces.map((space) => (
          <li key={space.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">{space.name}</span>
              <span className="block text-xs text-muted-foreground">{describeSpaceAccess(space, tiers)}</span>
            </span>
            <span className="w-full sm:w-auto">
              <SpaceAccessEditor space={space} tiers={tiers} community={community} communitySlug={communitySlug} paymentsEnabled={paymentsEnabled} />
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-muted-foreground">No spaces yet.</p>
    ),
  };

  return (
    <Card id="who-can-see-what" className="mb-8 scroll-mt-20">
      <CardContent className="pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Who can see what?
          </h2>
          {preset && <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">Set up like: {preset.label}</span>}
        </div>

        <dl className="mt-3 space-y-3">
          {audiences.map((line) => (
            <div key={line.who} className="grid gap-x-3 sm:grid-cols-[8rem_1fr]">
              <dt className="text-sm font-semibold text-foreground">{line.who}</dt>
              <dd className="min-w-0 text-sm text-foreground">
                {line.text}
                <Chips names={line.open} />
                <Chips names={line.locked} locked />
              </dd>
            </div>
          ))}
        </dl>

        {issues.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {issues.map((issue) => {
              const Icon = issue.severity === "problem" ? AlertTriangle : Info;
              return (
                <li
                  key={`${issue.code}-${issue.spaceId ?? issue.tierId ?? ""}`}
                  className={issue.severity === "problem" ? "flex items-start gap-2 rounded-md bg-danger/10 px-3 py-2 text-xs text-danger" : "flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-xs text-foreground"}
                >
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {issue.message}
                </li>
              );
            })}
          </ul>
        )}

        <AccessGroupTiles groups={groups.map((g) => ({ key: g.key, label: g.label, now: g.now, panel: panels[g.key] }))} />

        <Link
          href={`/c/${communitySlug}/admin/access`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          See every space for every kind of person
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
