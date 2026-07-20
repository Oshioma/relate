"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardProgress } from "./WizardProgress";
import { StepBasics } from "./StepBasics";
import { StepTemplate } from "./StepTemplate";
import { StepCustomize } from "./StepCustomize";
import { StepLaunch } from "./StepLaunch";
import { INITIAL_WIZARD_STATE, type WizardState } from "./types";

export function CommunityWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE);

  function update(patch: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  const canAdvance = step === 1 ? Boolean(state.name.trim() && state.slug) : step === 2 ? Boolean(state.templateKey) : true;

  return (
    <div>
      <WizardProgress step={step} />

      {step === 1 && <StepBasics state={state} update={update} />}
      {step === 2 && <StepTemplate state={state} update={update} />}
      {step === 3 && <StepCustomize state={state} update={update} />}
      {step === 4 && <StepLaunch state={state} />}

      {step < 4 && (
        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={!canAdvance}>
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 4 && (
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setStep(3)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
