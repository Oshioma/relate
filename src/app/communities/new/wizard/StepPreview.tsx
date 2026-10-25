"use client";

import { useState } from "react";
import { Eye, Lock, EyeOff, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ACCESS_REASON_TEXT, explainSpaceAccess, type AccessState, type AccessViewer } from "@/lib/access/model";
import { describeJoining, joinPolicyOf } from "@/lib/join-policy";
import { getAccessPreset, launchCommunitySettings } from "@/lib/access/presets";
import { StepCustomize } from "./StepCustomize";
import { FUTURE_MEMBERSHIP, spacesWaitingForMembership, wizardAccessSpaces, wizardCommunity } from "./wizard-spaces";
import type { WizardState } from "./types";
import type { SpaceType } from "@/types/database";

type ViewerKey = "visitor" | "member" | "paid";

const VIEWERS: { key: ViewerKey; label: string; viewer: AccessViewer }[] = [
  { key: "visitor", label: "Visitor", viewer: { kind: "visitor" } },
  { key: "member", label: "Free member", viewer: { kind: "member" } },
  { key: "paid", label: "Paid member", viewer: { kind: "paid", tierIds: [FUTURE_MEMBERSHIP.id] } },
];

const STATE_CHIP: Record<AccessState, { label: string; icon: typeof Eye; className: string }> = {
  open: { label: "Can open", icon: Check, className: "bg-accent-soft text-accent" },
  locked: { label: "Sees it locked", icon: Lock, className: "bg-muted text-foreground" },
  hidden: { label: "Not shown", icon: EyeOff, className: "bg-muted text-muted-foreground" },
};

// Step 2: the community as three different people will meet it, worked out by
// the same access model the admin screens use (src/lib/access/model.ts), with
// the headline, cover and spaces editable underneath.
export function StepPreview({
  state,
  update,
  allowedTypes,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  allowedTypes: SpaceType[];
}) {
  const [viewerKey, setViewerKey] = useState<ViewerKey>("visitor");
  const viewer = VIEWERS.find((v) => v.key === viewerKey)!;
  const community = wizardCommunity(state);
  const preset = getAccessPreset(state.presetKey);
  const settings = preset ? launchCommunitySettings(preset, { hideCompletely: state.hideCompletely, custom: state.custom }) : null;
  const joinPolicy = joinPolicyOf({ privacy: community.privacy, join_policy: settings?.join_policy ?? null });
  const waiting = spacesWaitingForMembership(state.spaces);
  // A paid member is only different once a membership exists, so their tab
  // shows the community as it will be then.
  const spaces = wizardAccessSpaces(state.spaces, viewerKey === "paid" ? "withMembership" : "today");
  const rows = spaces.map((s) => ({ space: s, ...explainSpaceAccess(community, s, viewer.viewer) }));
  const shown = rows.filter((r) => r.state !== "hidden");
  const notShown = rows.filter((r) => r.state === "hidden");
  const locked = community.privacy === "invite_only" && viewerKey === "visitor";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">See it as others will</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch between the three people below. Change who can open a space further down and this updates straight away.
        </p>
      </div>

      <section>
        <div role="tablist" aria-label="See it as" className="inline-flex rounded-lg border border-border bg-card p-1">
          {VIEWERS.map((v) => (
            <button
              key={v.key}
              type="button"
              role="tab"
              aria-selected={viewerKey === v.key}
              onClick={() => setViewerKey(v.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                viewerKey === v.key ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <Card className="mt-3 p-5" role="tabpanel" aria-label={`As a ${viewer.label.toLowerCase()}`}>
          <h2 className="text-base font-semibold text-foreground">{state.tagline.trim() || state.name || "Your community"}</h2>

          {viewerKey === "visitor" && (
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {locked ? (
                <li>The link doesn&apos;t open for them. They only get in with an invitation.</li>
              ) : (
                <>
                  <li>{community.privacy === "public" ? "They can find it on Relate." : "They need the link to find it."}</li>
                  <li>{describeJoining(joinPolicy)}</li>
                  <li>
                    {community.feed_public || community.privacy === "public" ? "They can look at the feed before joining." : "They can't read the feed until they join."}
                    {community.events_public ? " Upcoming events are shown to them." : ""}
                  </li>
                </>
              )}
            </ul>
          )}
          {viewerKey === "paid" && (
            <p className="mt-2 rounded-md bg-muted px-3 py-2 text-sm text-foreground">
              {waiting.length
                ? "This is how it looks once you set up a membership. Until then, paid spaces are Admins only and paid members see what free members see."
                : "No space is set for paid members, so paid members see what free members see. Set a space to Paid members below to try it."}
            </p>
          )}

          {!locked && (
            <ul className="mt-4 divide-y divide-border">
              {shown.map(({ space, state: s, reason }) => {
                const chip = STATE_CHIP[s];
                const Icon = chip.icon;
                return (
                  <li key={space.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{space.name}</p>
                      <p className="text-xs text-muted-foreground">{ACCESS_REASON_TEXT[reason]}</p>
                    </div>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", chip.className)}>
                      <Icon className="h-3 w-3" />
                      {chip.label}
                    </span>
                  </li>
                );
              })}
              {shown.length === 0 && <li className="py-2.5 text-sm text-muted-foreground">No spaces they can see yet.</li>}
            </ul>
          )}
          {!locked && notShown.length > 0 && (
            <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
              <EyeOff className="mt-0.5 h-3 w-3 shrink-0" />
              Not shown to them: {notShown.map((r) => r.space.name).join(", ")}.
            </p>
          )}
        </Card>
      </section>

      <StepCustomize state={state} update={update} allowedTypes={allowedTypes} />
    </div>
  );
}
