"use client";

import { useCallback, useState } from "react";
import {
  duplicateGuidedJourneySpace,
  saveSpaceSettings,
  saveTemplate,
} from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import type { GuidedJourneyConfig } from "@/lib/guided-journey/config";
import { milestonesToText, optionsToText } from "@/lib/guided-journey/config-form";
import type { JourneyTemplate } from "@/types/database";
import { Input, Textarea } from "@/components/ui/input";
import { DraftForm, Field } from "./draft-form";
import { PhotoPicker } from "./photo-picker";

type Hidden = { community_slug: string; space_slug: string };

function Group({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <summary className="cursor-pointer text-sm font-semibold text-foreground">{title}</summary>
      <div className="mt-4 space-y-4">{children}</div>
    </details>
  );
}

function Text({ name, label, value, rows }: { name: string; label: string; value: string; rows?: number }) {
  return (
    <Field label={label} htmlFor={name}>
      {rows ? <Textarea id={name} name={name} rows={rows} defaultValue={value} /> : <Input id={name} name={name} defaultValue={value} />}
    </Field>
  );
}

// An image field inside the settings form: upload a new photo or clear it.
function ImageField({ name, label, value, userId }: { name: string; label: string; value: string | null; userId: string }) {
  const [urls, setUrls] = useState<string[]>(value ? [value] : []);
  return (
    <Field label={label}>
      <input type="hidden" name={name} value={urls[0] ?? ""} />
      <PhotoPicker name={`${name}__picker`} userId={userId} max={1} value={urls} onChange={setUrls} label="Upload photo" compact />
    </Field>
  );
}

// Every word, picture and option of the space, grouped. Field names are the
// config path ("cfg.terms.mentor"); the action keeps only what differs from
// the preset.
export function SpaceSettingsForm({
  hidden,
  spaceId,
  userId,
  config,
  acceptingMentors,
  acceptingBeginners,
}: {
  hidden: Hidden;
  spaceId: string;
  userId: string;
  config: GuidedJourneyConfig;
  acceptingMentors: boolean;
  acceptingBeginners: boolean;
}) {
  const t = config.terms;
  return (
    <DraftForm action={saveSpaceSettings} draftKey={`journey-settings-space:${spaceId}`} hidden={hidden} submitLabel="Save settings" className="space-y-4">
      <Group title="Status" open>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="accepting_beginners" defaultChecked={acceptingBeginners} className="h-4 w-4 accent-[var(--accent)]" />
          Accepting new {t.beginners} and requests
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="accepting_mentors" defaultChecked={acceptingMentors} className="h-4 w-4 accent-[var(--accent)]" />
          Accepting new {t.mentors}
        </label>
      </Group>

      <Group title="Name, hero and category" open>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="cfg.heroTitle" label="Title" value={config.heroTitle} />
          <Text name="cfg.category" label="Category" value={config.category} />
        </div>
        <Text name="cfg.tagline" label="Tagline" value={config.tagline} />
        <Text name="cfg.heroSubtitle" label="Subtitle" value={config.heroSubtitle} rows={2} />
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageField name="cfg.heroImageUrl" label="Cover image" value={config.heroImageUrl} userId={userId} />
          <Text name="cfg.heroImageAlt" label="Cover image description (alt text)" value={config.heroImageAlt} rows={2} />
        </div>
      </Group>

      <Group title="Terminology">
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="cfg.terms.beginner" label="Beginner (singular)" value={t.beginner} />
          <Text name="cfg.terms.beginners" label="Beginners (plural)" value={t.beginners} />
          <Text name="cfg.terms.mentor" label="Mentor (singular)" value={t.mentor} />
          <Text name="cfg.terms.mentors" label="Mentors (plural)" value={t.mentors} />
          <Text name="cfg.terms.journey" label="Journey name" value={t.journey} />
          <Text name="cfg.terms.subject" label="What a journey is about" value={t.subject} />
          <Text name="cfg.terms.requestButton" label="Request button" value={t.requestButton} />
          <Text name="cfg.terms.firstSuccessHelper" label="First-success helper label" value={t.firstSuccessHelper} />
        </div>
      </Group>

      <Group title="Entry cards">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <Text name="cfg.beginnerCard.title" label="Beginner card title" value={config.beginnerCard.title} />
            <Text name="cfg.beginnerCard.description" label="Description" value={config.beginnerCard.description} />
            <Text name="cfg.beginnerCard.button" label="Button" value={config.beginnerCard.button} />
          </div>
          <div className="space-y-3">
            <Text name="cfg.mentorCard.title" label="Mentor card title" value={config.mentorCard.title} />
            <Text name="cfg.mentorCard.description" label="Description" value={config.mentorCard.description} />
            <Text name="cfg.mentorCard.button" label="Button" value={config.mentorCard.button} />
          </div>
        </div>
      </Group>

      <Group title="The five stages">
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="cfg.stagesTitle" label="Section title" value={config.stagesTitle} />
          <Text name="cfg.stagesSubtitle" label="Section intro" value={config.stagesSubtitle} />
        </div>
        {config.stages.map((stage, i) => (
          <div key={i} className="grid gap-3 rounded-xl bg-muted/50 p-3 sm:grid-cols-2">
            <Text name={`cfg.stages.${i}.title`} label={`Stage ${i + 1} title`} value={stage.title} />
            <Text name={`cfg.stages.${i}.text`} label="Text" value={stage.text} rows={2} />
            <ImageField name={`cfg.stages.${i}.imageUrl`} label="Photo" value={stage.imageUrl} userId={userId} />
            <Text name={`cfg.stages.${i}.imageAlt`} label="Photo description (alt text)" value={stage.imageAlt} rows={2} />
          </div>
        ))}
      </Group>

      <Group title="Onboarding questions">
        <p className="text-xs text-muted-foreground">Five short questions. Options: one per line. Matching uses the interests options, so keep those meaningful.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="cfg.questions.location.label" label="1 · Location question" value={config.questions.location.label} />
          <Text name="cfg.questions.location.help" label="Help text" value={config.questions.location.help} />
        </div>
        {(["setting", "interests", "experience"] as const).map((key, i) => (
          <div key={key} className="grid gap-3 sm:grid-cols-[1fr_1fr]">
            <div className="space-y-3">
              <Text name={`cfg.questions.${key}.label`} label={`${i + 2} · Question`} value={config.questions[key].label} />
              <Text name={`cfg.questions.${key}.help`} label="Help text" value={config.questions[key].help} />
            </div>
            <Text name={`cfg.questions.${key}.options`} label="Options" value={optionsToText(config.questions[key].options)} rows={5} />
          </div>
        ))}
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="cfg.questions.helpMode.label" label="5 · How-to-help question" value={config.questions.helpMode.label} />
          <Text name="cfg.questions.helpMode.help" label="Help text" value={config.questions.helpMode.help} />
        </div>
      </Group>

      <Group title={`${t.mentors.charAt(0).toUpperCase()}${t.mentors.slice(1)} profile questions`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="cfg.mentorQuestions.experienceLabel" label="Experience question" value={config.mentorQuestions.experienceLabel} />
          <Text name="cfg.mentorQuestions.topicsLabel" label="Topics question" value={config.mentorQuestions.topicsLabel} />
          <Text name="cfg.mentorQuestions.climateLabel" label="Climate/region question" value={config.mentorQuestions.climateLabel} />
          <Text name="cfg.mentorQuestions.photosLabel" label="Photos label" value={config.mentorQuestions.photosLabel} />
        </div>
        <Text name="cfg.mentorQuestions.introPlaceholder" label="Introduction hint" value={config.mentorQuestions.introPlaceholder} rows={2} />
        <Text name="cfg.capacityOptions" label="Capacity choices (comma separated)" value={config.capacityOptions.join(", ")} />
      </Group>

      <Group title="Journeys and milestones">
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="cfg.defaultJourneyTitle" label="Default journey title" value={config.defaultJourneyTitle} />
          <Text name="cfg.defaultUpdateFrequency" label="Default check-in rhythm" value={config.defaultUpdateFrequency} />
        </div>
        <Text name="cfg.defaultMilestones" label="Default milestones (one per line, note after ::)" value={milestonesToText(config.defaultMilestones)} rows={10} />
      </Group>

      <Group title="Completion">
        <Text name="cfg.completion.title" label="Celebration title" value={config.completion.title} />
        <Text name="cfg.completion.subtitle" label="Celebration subtitle" value={config.completion.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="cfg.completion.againButton" label="Start-again button" value={config.completion.againButton} />
          <Text name="cfg.completion.helpButton" label="Help-another button" value={config.completion.helpButton} />
        </div>
        <Text name="cfg.completion.mentorInvite" label="Invitation to mentor" value={config.completion.mentorInvite} rows={2} />
      </Group>

      <Group title="Gallery">
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="cfg.gallery.title" label="Gallery title" value={config.gallery.title} />
          <Text name="cfg.gallery.methodLabel" label="Method filter label" value={config.gallery.methodLabel} />
        </div>
        <Text name="cfg.gallery.subtitle" label="Gallery intro" value={config.gallery.subtitle} rows={2} />
        <Text name="cfg.gallery.methodOptions" label="Method options (one per line)" value={optionsToText(config.gallery.methodOptions)} rows={5} />
      </Group>

      <Group title="Safety wording">
        <Text name="cfg.safety.adviceDisclaimer" label="Community advice disclaimer" value={config.safety.adviceDisclaimer} rows={3} />
        <Text name="cfg.safety.inPersonNote" label="In-person meeting note" value={config.safety.inPersonNote} rows={3} />
      </Group>
    </DraftForm>
  );
}

export function TemplateForm({ hidden, spaceId, userId, template }: { hidden: Hidden; spaceId: string; userId: string; template: JourneyTemplate | null }) {
  const [cover, setCover] = useState<string[]>(template?.cover_image_url ? [template.cover_image_url] : []);
  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    try {
      const saved = JSON.parse(String(values.cover ?? "[]"));
      if (Array.isArray(saved)) setCover(saved.filter((u): u is string => typeof u === "string"));
    } catch {
      // ignore
    }
  }, []);
  return (
    <DraftForm
      action={saveTemplate}
      draftKey={`journey-template:${spaceId}:${template?.id ?? "new"}`}
      hidden={{ ...hidden, template_id: template?.id ?? "" }}
      submitLabel={template ? "Save template" : "Add template"}
      submitSize="sm"
      onRestore={onRestore}
      resetOnSuccess={!template}
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_6rem]">
        <Field label="Title" htmlFor={`tpl-title-${template?.id ?? "new"}`}>
          <Input id={`tpl-title-${template?.id ?? "new"}`} name="title" required defaultValue={template?.title ?? ""} placeholder="My First Tomatoes" />
        </Field>
        <Field label="Subject" htmlFor={`tpl-subject-${template?.id ?? "new"}`}>
          <Input id={`tpl-subject-${template?.id ?? "new"}`} name="subject" defaultValue={template?.subject ?? ""} placeholder="Tomatoes" />
        </Field>
        <Field label="Order" htmlFor={`tpl-order-${template?.id ?? "new"}`}>
          <Input id={`tpl-order-${template?.id ?? "new"}`} name="sort_order" type="number" defaultValue={template?.sort_order ?? 0} />
        </Field>
      </div>
      <Textarea name="summary" rows={2} defaultValue={template?.summary ?? ""} placeholder="One or two lines about this journey" aria-label="Summary" />
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <Input name="duration_label" defaultValue={template?.duration_label ?? ""} placeholder="About 10–16 weeks — adjust for your climate" aria-label="Duration note" />
        <Input name="expected_weeks" type="number" min={1} max={104} defaultValue={template?.expected_weeks ?? ""} placeholder="Weeks" aria-label="Expected weeks" />
      </div>
      <Textarea
        name="milestones"
        rows={8}
        defaultValue={template ? milestonesToText(template.milestones) : ""}
        placeholder={"Choose your crop :: Pick a variety\nPrepare your soil\n…"}
        aria-label="Milestones"
      />
      <PhotoPicker name="cover" userId={userId} max={1} value={cover} onChange={setCover} label="Cover photo" compact />
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="is_active" defaultChecked={template?.is_active ?? true} className="h-4 w-4 accent-[var(--accent)]" />
        Offered to new journeys
      </label>
    </DraftForm>
  );
}

export function DuplicateSpaceForm({
  hidden,
  spaceId,
  communities,
  currentCommunityId,
  presets,
  currentPreset,
  spaceName,
}: {
  hidden: Hidden;
  spaceId: string;
  communities: { id: string; name: string }[];
  currentCommunityId: string;
  presets: { key: string; label: string; spaceName: string }[];
  currentPreset: string;
  spaceName: string;
}) {
  const select = "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <DraftForm action={duplicateGuidedJourneySpace} draftKey={`journey-duplicate:${spaceId}`} hidden={hidden} submitLabel="Create the new space" pendingLabel="Creating…" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Into community" htmlFor="dup-community">
          <select id="dup-community" name="target_community_id" defaultValue={currentCommunityId} className={select}>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Start from" htmlFor="dup-preset" help="Keep this space's wording, or switch to another preset.">
          <select id="dup-preset" name="preset_key" defaultValue="" className={select}>
            <option value="">A copy of this space ({currentPreset})</option>
            {presets
              .filter((p) => p.key !== currentPreset)
              .map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
          </select>
        </Field>
      </div>
      <Field label="New space name" htmlFor="dup-name">
        <Input id="dup-name" name="name" required defaultValue={`${spaceName} (copy)`} />
      </Field>
      <Field label="Description (optional)" htmlFor="dup-desc">
        <Input id="dup-desc" name="description" placeholder="e.g. Learn the ropes. Sail together." />
      </Field>
      <p className="text-xs text-muted-foreground">Copies settings, stages and templates only — never members, requests, journeys or stories.</p>
    </DraftForm>
  );
}
