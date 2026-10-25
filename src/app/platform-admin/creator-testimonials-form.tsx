"use client";

import { useActionState, useEffect } from "react";
import { saveCreatorTestimonials, type CreatorTestimonialsFormState } from "./actions";
import { Input, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormDraft } from "@/lib/use-form-draft";
import {
  HOMEPAGE_TESTIMONIALS,
  MAX_CREATOR_NAME,
  MAX_CREATOR_QUOTE,
  MAX_CREATOR_ROLE,
  MAX_CREATOR_TESTIMONIALS,
} from "@/lib/creator-testimonials";
import type { CreatorTestimonial } from "@/types/database";

// Every slot is always on the page (filled ones first, then empty ones), so a
// draft restored after a refresh always has a field to land in.
export function CreatorTestimonialsForm({ testimonials }: { testimonials: CreatorTestimonial[] }) {
  const [state, formAction] = useActionState<CreatorTestimonialsFormState, FormData>(saveCreatorTestimonials, undefined);
  const { formRef, clearDraft } = useFormDraft("platform-creator-testimonials");

  useEffect(() => {
    if (state && "ok" in state) clearDraft();
  }, [state, clearDraft]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6 rounded-lg border border-border p-4">
      {Array.from({ length: MAX_CREATOR_TESTIMONIALS }, (_, i) => {
        const t = testimonials[i];
        return (
          <fieldset key={i} className="space-y-2">
            <legend className="mb-1 text-sm font-medium text-foreground">
              Quote {i + 1}
              {i < HOMEPAGE_TESTIMONIALS && <span className="font-normal text-muted-foreground"> · shown on the homepage</span>}
            </legend>
            <Textarea
              name={`quote_${i}`}
              rows={2}
              maxLength={MAX_CREATOR_QUOTE}
              defaultValue={t?.quote ?? ""}
              placeholder="What they said, word for word…"
              aria-label={`Quote ${i + 1}`}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                name={`name_${i}`}
                maxLength={MAX_CREATOR_NAME}
                defaultValue={t?.name ?? ""}
                placeholder="Name"
                aria-label={`Quote ${i + 1} name`}
              />
              <Input
                name={`role_${i}`}
                maxLength={MAX_CREATOR_ROLE}
                defaultValue={t?.role ?? ""}
                placeholder="Who they are, e.g. Founder, Nature's Gardeners"
                aria-label={`Quote ${i + 1} who they are`}
              />
            </div>
          </fieldset>
        );
      })}

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">Saved.</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save quotes
      </SubmitButton>
    </form>
  );
}
