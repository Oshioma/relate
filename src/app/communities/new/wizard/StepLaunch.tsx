"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCommunityTemplate, getPlaceLocationType, getActivityKind, getSchoolKind } from "@/lib/community-templates";
import { TEMPLATE_ICONS } from "@/lib/template-icons";
import { OWNER_AGREEMENT_ACCEPTANCE } from "@/lib/owner-agreement";
import { createCommunityFromWizard } from "../actions";
import type { WizardState } from "./types";

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

  async function submit() {
    setSubmitting(true);
    setError(null);
    const result = await createCommunityFromWizard({
      name: state.name,
      slug: state.slug,
      description: state.description,
      privacy: state.privacy,
      templateKey: state.templateKey,
      locationType: state.templateKey === "place" ? state.locationType : "",
      locationName: state.templateKey === "place" ? state.locationName : "",
      artistMode: state.templateKey === "fanclub" ? state.artistMode : "",
      activityKind: state.templateKey === "activity" ? state.activityKind : "",
      schoolKind: state.templateKey === "school" ? state.schoolKind : "",
      // Both Place and Activity communities seed the map's togglable layers —
      // one from the kind of place, the other from the activity.
      mapLayers: state.templateKey === "place" || state.templateKey === "activity" ? state.mapLayers : [],
      spaces: state.spaces.map((s) => ({ name: s.name, description: s.description, show_in_nav: s.show_in_nav, space_type: s.space_type, staff_post_only: s.staff_post_only })),
      profileFields: state.profileFields.map((f) => ({ label: f.label, field_type: f.field_type, options: f.options })),
      ownerAgreementAccepted: agreed,
    });
    // Only reached on error — success redirects server-side.
    if (result?.error) {
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
            {state.description && <p className="mt-1 text-sm text-foreground">{state.description}</p>}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge tone="accent">{template?.label ?? "Custom"}</Badge>
          {activityKind && <Badge tone="accent">{activityKind.label}</Badge>}
          {schoolKind && <Badge tone="accent">{schoolKind.label}</Badge>}
          <Badge>{state.privacy.replace("_", " ")}</Badge>
          <Badge>{state.spaces.length} spaces</Badge>
          {state.profileFields.length > 0 && <Badge>{state.profileFields.length} profile fields</Badge>}
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
