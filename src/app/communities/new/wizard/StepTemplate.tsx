"use client";

import { Sparkles, Wand2, Check } from "lucide-react";
import { COMMUNITY_TEMPLATES, recommendSetup, TRANSFORMATION_GOAL_PRESETS } from "@/lib/community-templates";
import { TEMPLATE_ICONS } from "@/lib/template-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { nextId } from "./types";
import type { WizardState } from "./types";

export function StepTemplate({ state, update }: { state: WizardState; update: (patch: Partial<WizardState>) => void }) {
  function selectTemplate(key: string) {
    const template = COMMUNITY_TEMPLATES.find((t) => t.key === key)!;
    update({
      templateKey: key,
      spaces: template.defaultSpaces.map((s) => ({ id: nextId("space"), name: s.name, description: s.description, show_in_nav: true })),
      profileFields: template.defaultProfileFields.map((f) => ({ id: nextId("field"), label: f.label, field_type: f.field_type, options: f.options ?? [] })),
      rationale: [],
    });
  }

  function getAiRecommendations() {
    if (!state.templateKey) return;
    const rec = recommendSetup(state.templateKey, state.transformationGoal);
    update({
      spaces: rec.spaces.map((s) => ({ id: nextId("space"), name: s.name, description: s.description, show_in_nav: true })),
      profileFields: rec.profileFields.map((f) => ({ id: nextId("field"), label: f.label, field_type: f.field_type, options: f.options ?? [] })),
      rationale: rec.rationale,
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

      {state.templateKey && (
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
