"use client";

import { useCallback, useState } from "react";
import { saveReflection, saveStory, setStoryMentorConsent } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import type { GuidedJourneyConfig } from "@/lib/guided-journey/config";
import type { JourneyStory } from "@/types/database";
import { Input, Textarea } from "@/components/ui/input";
import { DraftForm, Field } from "./draft-form";
import { PhotoPicker } from "./photo-picker";

function parsePhotos(raw: string | string[] | undefined): string[] {
  try {
    const saved = JSON.parse(String(raw ?? "[]"));
    return Array.isArray(saved) ? saved.filter((u): u is string => typeof u === "string") : [];
  } catch {
    return [];
  }
}

// The beginner's growing story. Saved privately by default; publishing to the
// community gallery is an explicit tick, and can be undone any time.
export function StoryForm({
  journeyId,
  communitySlug,
  spaceSlug,
  userId,
  config,
  story,
  defaults,
  journeyPhotos,
}: {
  journeyId: string;
  communitySlug: string;
  spaceSlug: string;
  userId: string;
  config: GuidedJourneyConfig;
  story: JourneyStory | null;
  defaults: { title: string; subject: string; region: string; weeks: number; before: string | null; after: string | null; problems: string };
  journeyPhotos: string[];
}) {
  const [before, setBefore] = useState<string[]>(story?.before_photo_url ? [story.before_photo_url] : defaults.before ? [defaults.before] : []);
  const [after, setAfter] = useState<string[]>(story?.after_photo_url ? [story.after_photo_url] : defaults.after ? [defaults.after] : []);
  const [photos, setPhotos] = useState<string[]>(story?.photos ?? journeyPhotos.slice(0, 6));
  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    if ("before_photo" in values) setBefore(parsePhotos(values.before_photo));
    if ("after_photo" in values) setAfter(parsePhotos(values.after_photo));
    if ("photos" in values) setPhotos(parsePhotos(values.photos));
  }, []);

  return (
    <DraftForm
      action={saveStory}
      draftKey={`journey-story:${journeyId}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug, journey_id: journeyId }}
      submitLabel="Save story"
      onRestore={onRestore}
      className="space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="st-title">
          <Input id="st-title" name="title" required defaultValue={story?.title ?? defaults.title} />
        </Field>
        <Field label={`What did you ${config.category === "Gardening" ? "grow" : "do"}?`} htmlFor="st-subject">
          <Input id="st-subject" name="subject" defaultValue={story?.subject ?? defaults.subject} />
        </Field>
        <Field label="Region" htmlFor="st-region">
          <Input id="st-region" name="region" defaultValue={story?.region ?? defaults.region} />
        </Field>
        <Field label="Climate" htmlFor="st-climate">
          <Input id="st-climate" name="climate" defaultValue={story?.climate ?? ""} placeholder="e.g. temperate, hot and dry" />
        </Field>
        <Field label={config.gallery.methodLabel} htmlFor="st-method">
          <select id="st-method" name="method" defaultValue={story?.method ?? ""} className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">—</option>
            {config.gallery.methodOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="How many weeks?" htmlFor="st-weeks">
          <Input id="st-weeks" name="duration_weeks" type="number" min={0} max={520} defaultValue={story?.duration_weeks ?? defaults.weeks} />
        </Field>
      </div>
      <Field label="Growing conditions" htmlFor="st-conditions">
        <Textarea id="st-conditions" name="conditions" rows={2} defaultValue={story?.conditions ?? ""} placeholder="Space, sun, soil, containers…" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Problems you hit" htmlFor="st-problems">
          <Textarea id="st-problems" name="problems" rows={3} defaultValue={story?.problems ?? defaults.problems} />
        </Field>
        <Field label="What you tried" htmlFor="st-solutions">
          <Textarea id="st-solutions" name="solutions" rows={3} defaultValue={story?.solutions ?? ""} />
        </Field>
        <Field label="Lessons learned" htmlFor="st-lessons">
          <Textarea id="st-lessons" name="lessons" rows={3} defaultValue={story?.lessons ?? ""} />
        </Field>
        <Field label="Final results" htmlFor="st-results">
          <Textarea id="st-results" name="results" rows={3} defaultValue={story?.results ?? ""} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Before photo">
          <PhotoPicker name="before_photo" userId={userId} max={1} value={before} onChange={setBefore} label="Choose" compact />
        </Field>
        <Field label="After photo">
          <PhotoPicker name="after_photo" userId={userId} max={1} value={after} onChange={setAfter} label="Choose" compact />
        </Field>
      </div>
      <Field label="Timeline photos" help="From your updates — remove any you'd rather keep private.">
        <PhotoPicker name="photos" userId={userId} max={12} value={photos} onChange={setPhotos} compact />
      </Field>
      <label className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent-soft p-4 text-sm text-foreground">
        <input type="checkbox" name="publish" defaultChecked={story?.status === "published"} className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
        <span>
          <strong>Publish to {config.gallery.title}.</strong> Anyone who can see this space will be able to read it. Your {config.terms.mentor} is only named if they
          agree. Untick to make it private again.
        </span>
      </label>
    </DraftForm>
  );
}

export function MentorConsentForm({ story, communitySlug, spaceSlug }: { story: JourneyStory; communitySlug: string; spaceSlug: string }) {
  return (
    <DraftForm
      action={setStoryMentorConsent}
      draftKey={`journey-story-consent:${story.id}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug, story_id: story.id }}
      submitLabel="Save"
      submitSize="sm"
      className="space-y-3"
    >
      <label className="flex items-start gap-2 text-sm text-foreground">
        <input type="checkbox" name="show_mentor" defaultChecked={story.show_mentor} className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
        Name me on the public story
      </label>
      <Textarea name="mentor_acknowledgement" rows={2} defaultValue={story.mentor_acknowledgement ?? ""} placeholder="A line to show with the story (optional)" aria-label="Acknowledgement" />
    </DraftForm>
  );
}

export function ReflectionForm({
  journeyId,
  communitySlug,
  spaceSlug,
  reflection,
  acknowledgement,
  isMentor,
}: {
  journeyId: string;
  communitySlug: string;
  spaceSlug: string;
  reflection: string | null;
  acknowledgement: string | null;
  isMentor: boolean;
}) {
  return (
    <DraftForm
      action={saveReflection}
      draftKey={`journey-reflection:${journeyId}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug, journey_id: journeyId }}
      submitLabel="Save"
      submitSize="sm"
      className="space-y-3"
    >
      <Textarea name="reflection" rows={3} defaultValue={reflection ?? ""} placeholder="Your reflection: what did this journey teach you?" aria-label="Reflection" />
      {isMentor && (
        <Textarea name="acknowledgement" rows={2} defaultValue={acknowledgement ?? ""} placeholder="Your acknowledgement of their work" aria-label="Acknowledgement" />
      )}
    </DraftForm>
  );
}
