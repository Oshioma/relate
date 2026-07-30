"use client";

import { Sparkles, Wand2, Check } from "lucide-react";
import {
  COMMUNITY_TEMPLATES,
  PLACE_LOCATION_TYPES,
  ARTIST_MODES,
  recommendSetup,
  recommendPlaceSetup,
  recommendArtistSetup,
  TRANSFORMATION_GOAL_PRESETS,
} from "@/lib/community-templates";
import { TEMPLATE_ICONS } from "@/lib/template-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { nextId } from "./types";
import type { WizardState, WizardSpace, WizardProfileField } from "./types";
import type { TemplateSpace, TemplateProfileField } from "@/lib/community-templates";
import type { SpaceType } from "@/types/database";

// Turns a template's suggested spaces into wizard spaces, dropping any whose
// type the super admin hasn't made available — the pool wins, so a banned type
// never even reaches the starter box.
function toWizardSpaces(spaces: TemplateSpace[], allowedTypes: SpaceType[]): WizardSpace[] {
  const allowed = new Set(allowedTypes);
  return spaces
    .filter((s) => allowed.has(s.space_type ?? "discussion"))
    .map((s) => ({ id: nextId("space"), name: s.name, description: s.description, show_in_nav: true, space_type: s.space_type ?? "discussion", staff_post_only: s.staff_post_only ?? false }));
}

function toWizardFields(fields: TemplateProfileField[]): WizardProfileField[] {
  return fields.map((f) => ({ id: nextId("field"), label: f.label, field_type: f.field_type, options: f.options ?? [] }));
}

export function StepTemplate({
  state,
  update,
  defaultSpacesByTemplate,
  allowedTypes,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  defaultSpacesByTemplate?: Record<string, TemplateSpace[]>;
  // Space types the platform makes available to new communities. Template
  // suggestions of any other type are filtered out of the starter box.
  allowedTypes: SpaceType[];
}) {
  const isPlace = state.templateKey === "place";
  const isArtist = state.templateKey === "fanclub";

  function selectTemplate(key: string) {
    const template = COMMUNITY_TEMPLATES.find((t) => t.key === key)!;
    // Prefer the super-admin-configured defaults for this type; fall back to
    // the template's code defaults.
    const defaultSpaces = defaultSpacesByTemplate?.[key] ?? template.defaultSpaces;
    update({
      templateKey: key,
      spaces: toWizardSpaces(defaultSpaces, allowedTypes),
      profileFields: toWizardFields(template.defaultProfileFields),
      locationType: "",
      artistMode: "",
      mapLayers: [],
      rationale: [],
    });
  }

  function selectArtistMode(key: string) {
    const rec = recommendArtistSetup(key);
    update({
      artistMode: key,
      spaces: toWizardSpaces(rec.spaces, allowedTypes),
      profileFields: toWizardFields(rec.profileFields),
      rationale: rec.rationale,
    });
  }

  function getAiRecommendations() {
    if (!state.templateKey) return;
    const rec = recommendSetup(state.templateKey, state.transformationGoal);
    update({
      spaces: toWizardSpaces(rec.spaces, allowedTypes),
      profileFields: toWizardFields(rec.profileFields),
      rationale: rec.rationale,
    });
  }

  function selectLocationType(key: string) {
    const rec = recommendPlaceSetup(key, defaultSpacesByTemplate?.["place"]);
    update({
      locationType: key,
      spaces: toWizardSpaces(rec.spaces, allowedTypes),
      profileFields: toWizardFields(rec.profileFields),
      rationale: rec.rationale,
      mapLayers: rec.mapLayers,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">What type of community are you creating?</h1>
        <p className="mt-1 text-sm text-muted-foreground">Each template suggests a starting set of spaces — you can change everything in the next step.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {COMMUNITY_TEMPLATES.map((t) => {
          const Icon = TEMPLATE_ICONS[t.icon] ?? Sparkles;
          const isActive = state.templateKey === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => selectTemplate(t.key)}
              className={cn(
                "rounded-lg border-2 p-3.5 text-left transition-colors",
                isActive ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40"
              )}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-2.5 text-sm font-semibold text-foreground">{t.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.tagline}</p>
            </button>
          );
        })}
      </div>

      {state.templateKey && isPlace && (
        <Card className="p-5">
          <div>
            <Label htmlFor="locationName">Where is this?</Label>
            <Input
              id="locationName"
              placeholder="e.g. Zanzibar, Tanzania"
              value={state.locationName}
              onChange={(e) => update({ locationName: e.target.value })}
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">What kind of place is this?</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Tailors your spaces, profile fields and Explore Map layers — still editable afterward.</p>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PLACE_LOCATION_TYPES.map((lt) => {
              const isActive = state.locationType === lt.key;
              return (
                <button
                  key={lt.key}
                  type="button"
                  onClick={() => selectLocationType(lt.key)}
                  title={lt.description}
                  className={cn(
                    "rounded-md border-2 px-3 py-2 text-left text-sm font-medium transition-colors",
                    isActive ? "border-accent bg-accent-soft text-foreground" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                  )}
                >
                  {lt.label}
                </button>
              );
            })}
          </div>

          {state.mapLayers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {state.mapLayers.map((layer) => (
                <span key={layer} className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {layer}
                </span>
              ))}
            </div>
          )}

          {state.rationale.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {state.rationale.map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {state.templateKey && isArtist && (
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Which kind of music community is this?</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Sets a different starting set of spaces and profile fields — still editable afterward.</p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ARTIST_MODES.map((m) => {
              const isActive = state.artistMode === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => selectArtistMode(m.key)}
                  className={cn(
                    "rounded-md border-2 p-3 text-left transition-colors",
                    isActive ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40"
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="mt-0.5 text-xs font-medium text-accent">{m.tagline}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                </button>
              );
            })}
          </div>

          {state.rationale.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {state.rationale.map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {state.templateKey && !isPlace && !isArtist && (
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">What transformation are you helping members achieve?</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Tunes your spaces and profile fields — still editable afterward.</p>

          <Input
            className="mt-3"
            placeholder="e.g. Grow Food"
            value={state.transformationGoal}
            onChange={(e) => update({ transformationGoal: e.target.value })}
          />

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {TRANSFORMATION_GOAL_PRESETS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => update({ transformationGoal: goal })}
                className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground"
              >
                {goal}
              </button>
            ))}
          </div>

          <Button variant="secondary" size="sm" className="mt-3 w-auto" onClick={getAiRecommendations}>
            <Wand2 className="h-3.5 w-3.5" />
            Get AI Recommendations
          </Button>

          {state.rationale.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {state.rationale.map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
