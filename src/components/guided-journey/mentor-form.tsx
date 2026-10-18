"use client";

import { useCallback, useState } from "react";
import { saveMentorProfile } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import { HELP_MODE_CHOICES, helpModeToChoices, MENTOR_LEVELS, mentorLevelLabel, type GuidedJourneyConfig } from "@/lib/guided-journey/config";
import type { JourneyMentorProfile, MentorLevel } from "@/types/database";
import { Input, Textarea } from "@/components/ui/input";
import { ChoiceChips, DraftForm, Field } from "./draft-form";
import { PhotoPicker } from "./photo-picker";

export function MentorOnboardingForm({
  communitySlug,
  spaceSlug,
  spaceId,
  userId,
  config,
  existing,
  suggestedLevel,
  completedSubjects,
}: {
  communitySlug: string;
  spaceSlug: string;
  spaceId: string;
  userId: string;
  config: GuidedJourneyConfig;
  existing: JourneyMentorProfile | null;
  suggestedLevel: MentorLevel;
  completedSubjects: string[];
}) {
  const [photos, setPhotos] = useState<string[]>(existing?.photos ?? []);
  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    try {
      const saved = JSON.parse(String(values.photos ?? "[]"));
      if (Array.isArray(saved)) setPhotos(saved.filter((u): u is string => typeof u === "string"));
    } catch {
      // ignore
    }
  }, []);
  const interestValues = new Set(config.questions.interests.options.map((o) => o.value));
  const otherExperience = (existing?.experience ?? []).filter((e) => !interestValues.has(e));
  const capacityOptions = Array.from(new Set([...config.capacityOptions, ...(existing ? [existing.capacity] : [])])).sort((a, b) => a - b);

  return (
    <DraftForm
      action={saveMentorProfile}
      draftKey={`journey-mentor:${spaceId}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug }}
      submitLabel={existing ? "Save profile" : `Become a ${config.terms.mentor}`}
      onRestore={onRestore}
      className="space-y-7"
    >
      <Field label="How would you describe yourself?" help="This is shown on your card. It's your own description — staff verification is separate.">
        <div className="grid gap-2 sm:grid-cols-3">
          {MENTOR_LEVELS.map((level) => (
            <label key={level.value} className="cursor-pointer">
              <input type="radio" name="level" value={level.value} defaultChecked={suggestedLevel === level.value} className="peer sr-only" />
              <span className="block h-full rounded-2xl border border-border bg-card p-4 transition peer-checked:border-accent peer-checked:bg-accent-soft peer-focus-visible:ring-2 peer-focus-visible:ring-ring hover:border-accent">
                <span className="block text-sm font-semibold text-foreground">{mentorLevelLabel(level.value, config)}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{level.description}</span>
              </span>
            </label>
          ))}
        </div>
        {completedSubjects.length > 0 && (
          <p className="mt-2 text-xs text-accent">You completed: {completedSubjects.join(", ")}. That&apos;s exactly what you could help with.</p>
        )}
      </Field>

      <Field label={config.mentorQuestions.experienceLabel}>
        <ChoiceChips name="experience" options={config.questions.interests.options.filter((o) => o.value !== "not_sure")} defaultValue={existing?.experience ?? []} />
        <Input name="experience_other" className="mt-3" placeholder="Anything more specific? e.g. tomatoes, chillies, squash" defaultValue={otherExperience.join(", ") || completedSubjects.join(", ")} />
      </Field>

      <Field label={config.mentorQuestions.topicsLabel} htmlFor="gj-topics">
        <Input id="gj-topics" name="preferred_topics" placeholder="e.g. container growing, composting, seed saving" defaultValue={existing?.preferred_topics.join(", ") ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Country" htmlFor="gj-m-country">
          <Input id="gj-m-country" name="country" defaultValue={existing?.country ?? ""} autoComplete="country-name" required />
        </Field>
        <Field label="Region" htmlFor="gj-m-region">
          <Input id="gj-m-region" name="region" defaultValue={existing?.region ?? ""} />
        </Field>
        <Field label={config.mentorQuestions.climateLabel} htmlFor="gj-m-climate">
          <Input id="gj-m-climate" name="climate" placeholder="e.g. temperate, dry summers" defaultValue={existing?.climate ?? ""} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Years of experience (optional)" htmlFor="gj-m-years">
          <Input id="gj-m-years" name="years_experience" type="number" min={0} max={90} inputMode="numeric" defaultValue={existing?.years_experience ?? ""} />
        </Field>
        <Field label="Languages" htmlFor="gj-m-lang">
          <Input id="gj-m-lang" name="languages" placeholder="e.g. English, French" defaultValue={existing?.languages.join(", ") ?? ""} />
        </Field>
      </div>

      <Field label="How can you help?">
        <ChoiceChips name="help_mode" options={HELP_MODE_CHOICES} defaultValue={helpModeToChoices(existing?.help_mode ?? "online")} />
      </Field>

      <Field label={`How many ${config.terms.beginners} can you support at once?`} help="You can change this, or pause, any time.">
        <ChoiceChips
          name="capacity"
          type="radio"
          required
          options={capacityOptions.map((n) => ({ value: String(n), label: `${n} ${n === 1 ? config.terms.beginner : config.terms.beginners}` }))}
          defaultValue={[String(existing?.capacity ?? capacityOptions[0])]}
        />
        <label className="mt-3 flex items-start gap-2 text-sm text-foreground">
          <input type="checkbox" name="group_mentoring" defaultChecked={existing?.group_mentoring ?? false} className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
          <span>I&apos;m open to group journeys — several {config.terms.beginners} on the same {config.terms.journey} together.</span>
        </label>
      </Field>

      <Field label="Availability" htmlFor="gj-m-avail" help={`A weekly check-in is the default — say if that suits, or what does.`}>
        <Input id="gj-m-avail" name="availability" placeholder="e.g. weekends, replies within a few days" defaultValue={existing?.availability ?? ""} />
      </Field>

      <Field label="A short introduction" htmlFor="gj-m-intro">
        <Textarea id="gj-m-intro" name="intro" rows={4} required placeholder={config.mentorQuestions.introPlaceholder} defaultValue={existing?.intro ?? ""} />
      </Field>

      <Field label={config.mentorQuestions.photosLabel} help="Optional, up to 8.">
        <PhotoPicker name="photos" userId={userId} max={8} value={photos} onChange={setPhotos} />
      </Field>

      <label className="flex items-start gap-3 rounded-2xl bg-accent-soft p-4 text-sm text-foreground">
        <input type="checkbox" name="adult" required defaultChecked={Boolean(existing)} className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
        <span>
          I&apos;m 18 or over. I understand requests need my explicit yes, I can pause or end mentoring at any time, and in-person meetings only happen if we both agree.
        </span>
      </label>
    </DraftForm>
  );
}
