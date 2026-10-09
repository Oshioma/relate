"use client";

import { useCallback, useState } from "react";
import { saveBeginnerProfile } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import { HELP_MODE_CHOICES, helpModeToChoices, type GuidedJourneyConfig } from "@/lib/guided-journey/config";
import type { JourneyBeginnerProfile } from "@/types/database";
import { Input, Textarea } from "@/components/ui/input";
import { ChoiceChips, DraftForm, Field } from "./draft-form";
import { PhotoPicker } from "./photo-picker";

// Beginner onboarding: the space's five questions, one optional photo of the
// growing space, and the adult confirmation. Deliberately short.
export function BeginnerOnboardingForm({
  communitySlug,
  spaceSlug,
  spaceId,
  userId,
  config,
  existing,
}: {
  communitySlug: string;
  spaceSlug: string;
  spaceId: string;
  userId: string;
  config: GuidedJourneyConfig;
  existing: JourneyBeginnerProfile | null;
}) {
  const q = config.questions;
  const [photo, setPhoto] = useState<string[]>(existing?.space_photo_url ? [existing.space_photo_url] : []);
  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    try {
      const saved = JSON.parse(String(values.space_photo ?? "[]"));
      if (Array.isArray(saved)) setPhoto(saved.filter((u): u is string => typeof u === "string"));
    } catch {
      // ignore a malformed draft
    }
  }, []);

  return (
    <DraftForm
      action={saveBeginnerProfile}
      draftKey={`journey-beginner:${spaceId}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug }}
      submitLabel={existing ? "Save and see suggestions" : `Show me ${config.terms.mentors}`}
      onRestore={onRestore}
      className="space-y-8"
    >
      <Step n={1}>
        <Field label={q.location.label} help={q.location.help}>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input name="country" placeholder="Country" defaultValue={existing?.country ?? ""} autoComplete="country-name" required aria-label="Country" />
            <Input name="region" placeholder="Region or climate" defaultValue={existing?.region ?? ""} aria-label="Region" />
            <Input name="approx_location" placeholder="Approx. area (optional)" defaultValue={existing?.approx_location ?? ""} aria-label="Approximate area (optional)" autoComplete="off" />
          </div>
        </Field>
      </Step>

      <Step n={2}>
        <Field label={q.setting.label} help={q.setting.help}>
          <ChoiceChips name="setting" options={q.setting.options} defaultValue={existing?.setting ?? []} />
        </Field>
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted-foreground">A photo of your space helps your {config.terms.mentor} picture it (optional).</p>
          <PhotoPicker name="space_photo" userId={userId} max={1} value={photo} onChange={setPhoto} label="Add a photo of your space" compact />
        </div>
      </Step>

      <Step n={3}>
        <Field label={q.interests.label} help={q.interests.help}>
          <ChoiceChips name="interests" options={q.interests.options} defaultValue={existing?.interests ?? []} />
        </Field>
      </Step>

      <Step n={4}>
        <Field label={q.experience.label} help={q.experience.help}>
          <ChoiceChips name="experience" type="radio" options={q.experience.options} defaultValue={existing?.experience ? [existing.experience] : []} />
        </Field>
      </Step>

      <Step n={5}>
        <Field label={q.helpMode.label} help={q.helpMode.help}>
          <ChoiceChips name="help_mode" options={HELP_MODE_CHOICES} defaultValue={helpModeToChoices(existing?.help_mode ?? "either")} />
        </Field>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Languages you're comfortable in" htmlFor="gj-languages">
            <Input id="gj-languages" name="languages" placeholder="e.g. English, Swahili" defaultValue={existing?.languages.join(", ") ?? ""} />
          </Field>
          <Field label="Anything else? (optional)" htmlFor="gj-notes">
            <Textarea id="gj-notes" name="notes" rows={2} placeholder="e.g. I have a north-facing balcony" defaultValue={existing?.notes ?? ""} />
          </Field>
        </div>
      </Step>

      <label className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm text-foreground">
        <input
          type="checkbox"
          name="listed_for_offers"
          defaultChecked={existing?.listed_for_offers ?? true}
          className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
        />
        <span>
          Let {config.terms.mentors} see I&apos;m looking and offer to help.{" "}
          <span className="text-muted-foreground">
            They&apos;ll see your name, region and the answers above — never your approximate area or notes — and nothing starts unless you accept.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 rounded-2xl bg-accent-soft p-4 text-sm text-foreground">
        <input type="checkbox" name="adult" required defaultChecked={Boolean(existing)} className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
        <span>I&apos;m 18 or over. Direct mentoring is for adults only for now.</span>
      </label>
    </DraftForm>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 sm:grid-cols-[2.5rem_1fr]">
      <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent sm:inline-flex" aria-hidden>
        {n}
      </span>
      <div>{children}</div>
    </section>
  );
}
