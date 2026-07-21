"use client";

import { useState } from "react";
import { Sparkles, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCommunityTemplate, getPlaceLocationType } from "@/lib/community-templates";
import { TEMPLATE_ICONS } from "@/lib/template-icons";
import { createCommunityFromWizard } from "../actions";
import type { WizardState } from "./types";

export function StepLaunch({ state }: { state: WizardState }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const template = getCommunityTemplate(state.templateKey || "custom");
  const Icon = template ? (TEMPLATE_ICONS[template.icon] ?? Sparkles) : Sparkles;
  const locationType = state.templateKey === "place" ? getPlaceLocationType(state.locationType) : undefined;

  async function submit() {
    setSubmitting(true);
    setError(null);
    const result = await createCommunityFromWizard({
      name: state.name,
      slug: state.slug,
      description: state.description,
      privacy: state.privacy,
      locationType: state.templateKey === "place" ? state.locationType : "",
      locationName: state.templateKey === "place" ? state.locationName : "",
      mapLayers: state.templateKey === "place" ? state.mapLayers : [],
      spaces: state.spaces.map((s) => ({ name: s.name, description: s.description, show_in_nav: s.show_in_nav, space_type: s.space_type })),
      profileFields: state.profileFields.map((f) => ({ label: f.label, field_type: f.field_type, options: f.options })),
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

      {error && <div className="rounded-md border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}

      <Button onClick={submit} disabled={submitting || !state.name || !state.slug}>
        <Rocket className="h-4 w-4" />
        {submitting ? "Launching…" : "Launch Community"}
      </Button>
    </div>
  );
}
