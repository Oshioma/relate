import { ShieldCheck, AlertTriangle, Info, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { describeCommunityAccess, findAccessIssues, type AccessCommunity, type AccessSpace, type AccessTier } from "@/lib/access/model";
import { getAccessPreset, matchPreset } from "@/lib/access/presets";
import { summarizeAccessGroups } from "@/lib/access/summary";
import type { JoinPolicy } from "@/types/database";

// "Who can see what?" at the top of Admin: the whole community's access in
// plain words, anything that looks wrong, and the four groups the settings are
// arranged in, each linking to where it's changed. Read-only — every change
// still goes through the forms below.
export function AccessSummaryCard({
  community,
  joinPolicy,
  spaces,
  tiers,
  canCharge,
  isOwner,
}: {
  community: AccessCommunity;
  joinPolicy: JoinPolicy;
  spaces: AccessSpace[];
  tiers: AccessTier[];
  canCharge: boolean;
  isOwner: boolean;
}) {
  const lines = describeCommunityAccess(community, spaces, tiers);
  const issues = findAccessIssues(community, spaces, tiers);
  const preset = getAccessPreset(matchPreset(community, spaces, tiers));
  const groups = summarizeAccessGroups({ community, joinPolicy, spaces, tiers, canCharge });

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

        <ul className="mt-3 space-y-1 text-sm text-foreground">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

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

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {groups.map((group) => {
            const ownerOnly = group.key === "memberships" && !isOwner;
            const body = (
              <>
                <span className="flex items-center justify-between gap-2 text-sm font-medium text-foreground">
                  {group.label}
                  {!ownerOnly && <ArrowRight className="h-3.5 w-3.5 text-accent" />}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{ownerOnly ? `${group.now} Only the owner can change these.` : group.now}</span>
              </>
            );
            return ownerOnly ? (
              <div key={group.key} className="rounded-md border border-border p-3">
                {body}
              </div>
            ) : (
              <a key={group.key} href={`#${group.anchor}`} className="block rounded-md border border-border p-3 transition-colors hover:border-accent/40 hover:bg-accent-soft/40">
                {body}
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
