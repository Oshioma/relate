"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Rocket, CalendarClock, ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCommunityTemplate, getPlaceLocationType, getActivityKind, getSchoolKind, getCraftKind } from "@/lib/community-templates";
import { TEMPLATE_ICONS } from "@/lib/template-icons";
import { OWNER_AGREEMENT_ACCEPTANCE } from "@/lib/owner-agreement";
import { describeCommunityAccess } from "@/lib/access/model";
import { getAccessPreset, launchCommunitySettings } from "@/lib/access/presets";
import { describeJoining, joinPolicyOf } from "@/lib/join-policy";
import { clearFormDraft, writeJsonDraft } from "@/lib/use-form-draft";
import { createCommunityFromWizard } from "../actions";
import { spacesWaitingForMembership, wizardAccessSpaces, wizardCommunity } from "./wizard-spaces";
import { WIZARD_DRAFT_KEY, type WizardState } from "./types";

const PRIVACY_LABEL = { public: "Listed", private: "Unlisted", invite_only: "Hidden" } as const;

export function StepLaunch({ state }: { state: WizardState }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Mandatory Community Owner Agreement — the Launch button stays disabled and
  // the server action refuses the request until this is ticked.
  const [agreed, setAgreed] = useState(false);
  const template = getCommunityTemplate(state.templateKey || "custom");
  const Icon = template ? (TEMPLATE_ICONS[template.icon] ?? Sparkles) : Sparkles;
  const locationType = state.templateKey === "place" ? getPlaceLocationType(state.locationType) : undefined;
  const activityKind = state.templateKey === "activity" ? getActivityKind(state.activityKind) : undefined;
  const schoolKind = state.templateKey === "school" ? getSchoolKind(state.schoolKind) : undefined;
  const craftKind = state.templateKey === "craft" ? getCraftKind(state.craftKind) : undefined;
  const preset = getAccessPreset(state.presetKey);
  const community = wizardCommunity(state);
  const settings = preset ? launchCommunitySettings(preset, { hideCompletely: state.hideCompletely, custom: state.custom }) : null;
  const joinPolicy = joinPolicyOf({ privacy: community.privacy, join_policy: settings?.join_policy ?? null });
  const summary = describeCommunityAccess(community, wizardAccessSpaces(state.spaces, "today"), []);
  const waiting = spacesWaitingForMembership(state.spaces);

  async function submit() {
    setSubmitting(true);
    setError(null);
    // Cleared before the request: success redirects away and never returns
    // here. On an error the draft is written back below.
    clearFormDraft(WIZARD_DRAFT_KEY);
    const result = await createCommunityFromWizard({
      name: state.name,
      slug: state.slug,
      description: state.description,
      presetKey: state.presetKey,
      hideCompletely: state.hideCompletely,
      custom: state.custom,
      templateKey: state.templateKey,
      locationType: state.templateKey === "place" ? state.locationType : "",
      locationName: state.templateKey === "place" ? state.locationName : "",
      artistMode: state.templateKey === "fanclub" ? state.artistMode : "",
      activityKind: state.templateKey === "activity" ? state.activityKind : "",
      schoolKind: state.templateKey === "school" ? state.schoolKind : "",
      craftKind: state.templateKey === "craft" ? state.craftKind : "",
      // Both Place and Activity communities seed the map's togglable layers —
      // one from the kind of place, the other from the activity.
      mapLayers: state.templateKey === "place" || state.templateKey === "activity" ? state.mapLayers : [],
      spaces: state.spaces.map((s) => ({ name: s.name, description: s.description, show_in_nav: s.show_in_nav, space_type: s.space_type, staff_post_only: s.staff_post_only, access: s.access })),
      coverKey: state.coverKey,
      tagline: state.tagline,
      ownerAgreementAccepted: agreed,
    });
    // Only reached on error — success redirects server-side.
    if (result?.error) {
      writeJsonDraft(WIZARD_DRAFT_KEY, { step: 3, state });
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Ready to launch</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what we&apos;ll set up. You can change any of it afterward.</p>
      </div>

      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">{state.name || "Untitled community"}</h2>
            <p className="text-sm text-muted-foreground">/c/{state.slug}</p>
            {state.locationName && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {state.locationName}
                {locationType ? ` · ${locationType.label}` : ""}
              </p>
            )}
            {state.tagline.trim() && <p className="mt-1 text-sm font-semibold text-foreground">{state.tagline.trim()}</p>}
            {state.description && <p className="mt-1 text-sm text-foreground">{state.description}</p>}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge tone="accent">{template?.label ?? "Custom"}</Badge>
          {activityKind && <Badge tone="accent">{activityKind.label}</Badge>}
          {schoolKind && <Badge tone="accent">{schoolKind.label}</Badge>}
          {craftKind && <Badge tone="accent">{craftKind.label}</Badge>}
          <Badge>{PRIVACY_LABEL[community.privacy]}</Badge>
          {preset && <Badge>{preset.label}</Badge>}
          <Badge>{state.spaces.length} spaces</Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {state.spaces.map((s) => (
            <div key={s.id} className="truncate rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground">
              {s.name}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">Who can see what</h2>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-foreground">
          {summary.map((line) => (
            <li key={line}>{line}</li>
          ))}
          {community.privacy !== "invite_only" && <li>{describeJoining(joinPolicy)}</li>}
        </ul>
        {waiting.length > 0 && (
          <p className="mt-3 rounded-md bg-accent-soft px-3 py-2 text-sm text-foreground">
            <span className="font-semibold">Waiting for a membership:</span> {waiting.map((s) => s.name).join(", ")}.{" "}
            {waiting.length === 1 ? "It stays" : "They stay"} Admins only until you set up a membership in Admin, then you choose which
            memberships open {waiting.length === 1 ? "it" : "them"}.
          </p>
        )}

        <h3 className="mt-5 text-sm font-semibold text-foreground">Not done for you</h3>
        <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>No membership, price or payment is set up, so nobody is charged.</li>
          <li>Nothing is posted. Your spaces start empty{state.starterActivities.some((a) => a.spaceType === "challenges" && a.durationDays) ? ", apart from your first challenge" : ""}.</li>
          <li>Nobody is invited yet.</li>
        </ul>
        {preset?.nextStep && (
          <p className="mt-4 flex items-start gap-1.5 text-sm font-medium text-foreground">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            Next: {preset.nextStep}{waiting.length > 0 ? " You’ll land on Set up membership in Admin right after launch." : ""}
          </p>
        )}
      </Card>

      {state.starterActivities.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">Your first month</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            A community with rooms and nothing happening in them empties out. These are the rituals for your craft — the first
            challenge is created and running the moment you launch, and you can edit or delete any of it afterward.
          </p>
          <ul className="mt-3 space-y-2.5">
            {state.starterActivities.map((activity) => (
              <li key={activity.title} className="text-sm">
                <p className="font-semibold text-foreground">
                  {activity.title}
                  {activity.spaceType === "challenges" && activity.durationDays && (
                    <span className="ml-1.5 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">
                      {activity.durationDays} days, starting today
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{activity.description}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="text-base font-semibold text-foreground">Community Owner Agreement</h2>
        <p className="mt-2 text-sm font-semibold text-foreground">{OWNER_AGREEMENT_ACCEPTANCE}</p>
        <label className="mt-4 flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-[var(--accent)]"
          />
          <span className="text-sm text-foreground">
            I agree to the{" "}
            <Link href="/community-owner-agreement" target="_blank" className="font-medium text-accent underline underline-offset-2">
              Community Owner Agreement
            </Link>{" "}
            and relate.click{" "}
            <Link href="/terms" target="_blank" className="font-medium text-accent underline underline-offset-2">
              Terms &amp; Conditions
            </Link>
            .
          </span>
        </label>
      </Card>

      {error && <div className="rounded-md border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}

      <Button onClick={submit} disabled={submitting || !state.name || !state.slug || !agreed}>
        <Rocket className="h-4 w-4" />
        {submitting ? "Launching…" : "Launch Community"}
      </Button>
    </div>
  );
}
