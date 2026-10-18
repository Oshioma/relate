"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  completeJourney,
  endJourney,
  postJourneyUpdate,
  saveJourneySettings,
  setInPersonConsent,
} from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import type { GuidedJourneyConfig } from "@/lib/guided-journey/config";
import type { Journey, JourneyMilestone } from "@/types/database";
import { Input, Textarea } from "@/components/ui/input";
import { DraftForm, Field } from "./draft-form";
import { PhotoPicker } from "./photo-picker";

function usePhotoDraft(field: string, initial: string[] = []) {
  const [photos, setPhotos] = useState<string[]>(initial);
  const onRestore = useCallback(
    (values: Record<string, string | string[]>) => {
      try {
        const saved = JSON.parse(String(values[field] ?? "[]"));
        if (Array.isArray(saved)) setPhotos(saved.filter((u): u is string => typeof u === "string"));
      } catch {
        // ignore
      }
    },
    [field]
  );
  return { photos, setPhotos, onRestore };
}

// The weekly progress update. Lightweight on purpose: a photo and a line is a
// perfectly good update; the question and problems fields are there when needed.
export function UpdateComposer({
  journeyId,
  communitySlug,
  spaceSlug,
  userId,
  milestones,
  config,
  isMentor,
}: {
  journeyId: string;
  communitySlug: string;
  spaceSlug: string;
  userId: string;
  milestones: JourneyMilestone[];
  config: GuidedJourneyConfig;
  isMentor: boolean;
}) {
  const { photos, setPhotos, onRestore } = usePhotoDraft("photos");
  const [more, setMore] = useState(false);
  const current = milestones.find((m) => m.status !== "done");
  return (
    <DraftForm
      action={postJourneyUpdate}
      draftKey={`journey-update:${journeyId}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug, journey_id: journeyId }}
      submitLabel={isMentor ? "Post" : "Post update"}
      pendingLabel="Posting…"
      onRestore={onRestore}
      onSuccess={() => {
        setPhotos([]);
        setMore(false);
      }}
      resetOnSuccess
      className="space-y-4"
    >
      <PhotoPicker name="photos" userId={userId} max={6} value={photos} onChange={setPhotos} label={isMentor ? "Add photos" : "Add this week's photos"} compact />
      <Textarea
        name="body"
        rows={3}
        placeholder={isMentor ? `A tip, some encouragement, or a check-in…` : `How is your ${config.terms.subject} doing this week?`}
        aria-label="Update"
      />
      {!isMentor && (
        <Textarea name="question" rows={2} placeholder={`A question for your ${config.terms.mentor}? (optional)`} aria-label="Question" />
      )}
      {more || isMentor ? null : (
        <button type="button" onClick={() => setMore(true)} className="text-xs font-semibold text-accent hover:underline">
          + Problems or milestone progress
        </button>
      )}
      {(more || isMentor) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {!isMentor && <Textarea name="problems" rows={2} placeholder="Anything going wrong? Pests, wilting, yellow leaves…" aria-label="Problems" />}
          <div className="space-y-2">
            <select
              name="milestone_id"
              defaultValue={current?.id ?? ""}
              aria-label="Milestone"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No particular milestone</option>
              {milestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.status === "done" ? "✓ " : ""}
                  {m.title}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs text-foreground">
              <input type="checkbox" name="milestone_done" className="h-4 w-4 accent-[var(--accent)]" />
              This update completes that milestone
            </label>
          </div>
        </div>
      )}
    </DraftForm>
  );
}

export function ReplyForm({ journeyId, parentId, communitySlug, spaceSlug, userId }: { journeyId: string; parentId: string; communitySlug: string; spaceSlug: string; userId: string }) {
  const [open, setOpen] = useState(false);
  const { photos, setPhotos, onRestore } = usePhotoDraft("photos");
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs font-semibold text-accent hover:underline">
        Reply
      </button>
    );
  }
  return (
    <DraftForm
      action={postJourneyUpdate}
      draftKey={`journey-reply:${parentId}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug, journey_id: journeyId, parent_id: parentId }}
      submitLabel="Reply"
      pendingLabel="Sending…"
      submitSize="sm"
      onRestore={onRestore}
      onSuccess={() => {
        setPhotos([]);
        setOpen(false);
      }}
      resetOnSuccess
      className="space-y-2"
    >
      <Textarea name="body" rows={2} placeholder="Your advice or answer…" aria-label="Reply" autoFocus />
      <PhotoPicker name="photos" userId={userId} max={3} value={photos} onChange={setPhotos} label="Photo" compact />
    </DraftForm>
  );
}

export function InPersonToggle({
  journeyId,
  communitySlug,
  spaceSlug,
  mine,
  allAgreed,
  note,
}: {
  journeyId: string;
  communitySlug: string;
  spaceSlug: string;
  mine: boolean;
  allAgreed: boolean;
  note: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className="text-sm">
      <p className="font-semibold text-foreground">Meeting in person</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      <p className="mt-2 text-xs font-medium text-foreground">
        {allAgreed ? "✓ You've both agreed — arrange the details privately." : mine ? "You're happy to meet. Waiting for the other side." : "Not agreed. Online only for now."}
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const fd = new FormData();
            fd.set("community_slug", communitySlug);
            fd.set("space_slug", spaceSlug);
            fd.set("journey_id", journeyId);
            fd.set("ok", String(!mine));
            await setInPersonConsent(fd);
            router.refresh();
          })
        }
        className="mt-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-accent disabled:opacity-60"
      >
        {mine ? "I'd rather stay online" : "I'm happy to meet in person"}
      </button>
    </div>
  );
}

export function JourneySettingsForm({ journey, communitySlug, spaceSlug, userId }: { journey: Journey; communitySlug: string; spaceSlug: string; userId: string }) {
  const { photos, setPhotos, onRestore } = usePhotoDraft("cover", journey.cover_image_url ? [journey.cover_image_url] : []);
  return (
    <DraftForm
      action={saveJourneySettings}
      draftKey={`journey-settings:${journey.id}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug, journey_id: journey.id }}
      submitLabel="Save"
      submitSize="sm"
      onRestore={onRestore}
      className="space-y-3"
    >
      <Field label="Title" htmlFor="js-title">
        <Input id="js-title" name="title" defaultValue={journey.title} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Subject" htmlFor="js-subject">
          <Input id="js-subject" name="subject" defaultValue={journey.subject ?? ""} placeholder="e.g. Tomatoes" />
        </Field>
        <Field label="Weeks (approx.)" htmlFor="js-weeks">
          <Input id="js-weeks" name="expected_weeks" type="number" min={1} max={104} defaultValue={journey.expected_weeks ?? ""} />
        </Field>
      </div>
      <Field label="Check-in rhythm" htmlFor="js-freq" help="Weekly is the default. Agree what suits you both.">
        <Input id="js-freq" name="update_frequency" defaultValue={journey.update_frequency} list="js-freq-options" />
        <datalist id="js-freq-options">
          <option value="weekly" />
          <option value="every two weeks" />
          <option value="monthly" />
        </datalist>
      </Field>
      <Field label="Timing note" htmlFor="js-duration">
        <Input id="js-duration" name="duration_label" defaultValue={journey.duration_label ?? ""} placeholder="e.g. About 12 weeks in our climate" />
      </Field>
      <Field label="Cover photo">
        <PhotoPicker name="cover" userId={userId} max={1} value={photos} onChange={setPhotos} label="Choose a cover" compact />
      </Field>
    </DraftForm>
  );
}

export function CompleteJourneyForm({
  journeyId,
  communitySlug,
  spaceSlug,
  isMentor,
  config,
}: {
  journeyId: string;
  communitySlug: string;
  spaceSlug: string;
  isMentor: boolean;
  config: GuidedJourneyConfig;
}) {
  return (
    <DraftForm
      action={completeJourney}
      draftKey={`journey-complete:${journeyId}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug, journey_id: journeyId }}
      submitLabel="Celebrate! Mark complete"
      pendingLabel="Celebrating…"
      className="space-y-3"
    >
      {isMentor ? (
        <Textarea name="acknowledgement" rows={3} placeholder={`A few words for your ${config.terms.beginner} — what they did well.`} aria-label="Acknowledgement" />
      ) : (
        <Textarea name="reflection" rows={3} placeholder="Looking back: what did you learn? What surprised you?" aria-label="Reflection" />
      )}
    </DraftForm>
  );
}

export function EndJourneyForm({ journeyId, communitySlug, spaceSlug, isGroupBeginner }: { journeyId: string; communitySlug: string; spaceSlug: string; isGroupBeginner: boolean }) {
  return (
    <DraftForm
      action={endJourney}
      draftKey={`journey-end:${journeyId}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug, journey_id: journeyId }}
      submitLabel={isGroupBeginner ? "Leave this group journey" : "End this journey"}
      pendingLabel="Ending…"
      submitVariant="danger"
      submitSize="sm"
      className="space-y-2"
    >
      <p className="text-xs text-muted-foreground">
        Either of you can end it at any time — no reason needed. If something is wrong, please also report it so the community team can help.
      </p>
      <Textarea name="reason" rows={2} placeholder="A short note for the other person (optional)" aria-label="Reason" />
    </DraftForm>
  );
}
