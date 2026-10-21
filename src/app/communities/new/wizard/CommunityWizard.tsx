"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardProgress } from "./WizardProgress";
import { StepBasics } from "./StepBasics";
import { StepAccess } from "./StepAccess";
import { StepTemplate } from "./StepTemplate";
import { StepPreview } from "./StepPreview";
import { StepLaunch } from "./StepLaunch";
import { headlineSuggestions } from "@/lib/headline-suggestions";
import { getAccessPreset, type AccessPresetKey } from "@/lib/access/presets";
import { readJsonDraft, writeJsonDraft } from "@/lib/use-form-draft";
import { applyPresetToSpaces } from "./wizard-spaces";
import { INITIAL_WIZARD_STATE, WIZARD_DRAFT_KEY, type WizardState } from "./types";
import type { TemplateSpace } from "@/lib/community-templates";
import type { SpaceType } from "@/types/database";

type WizardDraft = { step: number; state: WizardState };

function readDraft(): WizardDraft | null {
  try {
    const parsed = JSON.parse(readJsonDraft(WIZARD_DRAFT_KEY) || "null") as WizardDraft | null;
    if (!parsed || typeof parsed !== "object" || !parsed.state) return null;
    // Merge over the initial state so a draft saved by an older wizard still
    // has every field this one expects.
    return { step: Math.min(3, Math.max(1, Number(parsed.step) || 1)), state: { ...INITIAL_WIZARD_STATE, ...parsed.state } };
  } catch {
    return null;
  }
}

export function CommunityWizard({
  defaultSpacesByTemplate,
  allowedTypes,
}: {
  defaultSpacesByTemplate?: Record<string, TemplateSpace[]>;
  // Space types available to a new community, from the platform default pool.
  allowedTypes: SpaceType[];
}) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE);
  // Don't save until any earlier draft has been put back, or the empty first
  // render would overwrite it.
  const restored = useRef(false);
  const defaultType: SpaceType = allowedTypes.includes("discussion") ? "discussion" : (allowedTypes[0] ?? "discussion");

  useEffect(() => {
    const draft = readDraft();
    restored.current = true;
    if (!draft) return;
    // Restoring from browser storage after mount: the server render can't know
    // about it, so this can't be the initial state without a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(draft.state);
    setStep(draft.step);
  }, []);

  useEffect(() => {
    if (restored.current) writeJsonDraft(WIZARD_DRAFT_KEY, { step, state } satisfies WizardDraft);
  }, [step, state]);

  function update(patch: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  // The template step replaces the spaces wholesale; run them through the
  // chosen preset so a paid space never arrives open to everyone.
  function updateFromTemplate(patch: Partial<WizardState>) {
    setState((prev) => {
      const next = { ...prev, ...patch };
      return patch.spaces ? { ...next, spaces: applyPresetToSpaces(patch.spaces, getAccessPreset(prev.presetKey), defaultType) } : next;
    });
  }

  function choosePreset(key: AccessPresetKey) {
    setState((prev) => ({ ...prev, presetKey: key, spaces: applyPresetToSpaces(prev.spaces, getAccessPreset(key), defaultType) }));
  }

  function next() {
    // Entering Preview: pre-fill the headline from the chosen template, unless
    // the owner has already written their own.
    if (step === 1 && !state.taglineTouched) update({ tagline: headlineSuggestions(state.templateKey)[0] });
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0 });
  }

  const canAdvance = step === 1 ? Boolean(state.name.trim() && state.slug && state.presetKey && state.templateKey) : true;
  const missing =
    step === 1
      ? [!state.name.trim() && "a name", !state.presetKey && "how people get in", !state.templateKey && "a type of community"].filter(Boolean).join(", ")
      : "";

  return (
    <div>
      <WizardProgress step={step} />

      {step === 1 && (
        <div className="space-y-10">
          <StepBasics state={state} update={update} />
          <StepAccess state={state} onPreset={choosePreset} update={update} />
          <StepTemplate state={state} update={updateFromTemplate} defaultSpacesByTemplate={defaultSpacesByTemplate} allowedTypes={allowedTypes} />
        </div>
      )}
      {step === 2 && <StepPreview state={state} update={update} allowedTypes={allowedTypes} />}
      {step === 3 && <StepLaunch state={state} />}

      {step < 3 && (
        <div className="mt-8 border-t border-border pt-5">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="h-11 rounded-lg border border-border bg-card px-5 hover:bg-muted" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button className="h-11 rounded-lg px-5 sm:min-w-48" onClick={next} disabled={!canAdvance}>
              {step === 2 ? "Continue to launch" : "See the preview"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          {missing && <p className="mt-2 text-right text-xs text-muted-foreground">Still to choose: {missing}.</p>}
        </div>
      )}

      {step === 3 && (
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setStep(2)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
