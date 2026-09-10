"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Link2, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TimelineTrack } from "@/types/database";
import { EventFields, parseList, type EventFieldValues } from "./event-fields";
import { ClaimFields } from "./claim-fields";
import { createTimelineEvent, importSourceFromLink } from "./actions";
import {
  emptyClaimDraft,
  emptySourceDraft,
  resolveDateInput,
  resolveUncertaintyYears,
  type ClaimDraft,
  type EventDraft,
} from "@/lib/timeline/draft";
import { formatClaimDate } from "@/lib/timeline/time";

// Adding an event, in four steps.
//
// The steps exist because of what step four is: "add another proposed date if
// another source gives a different chronology". Asked as one long form, nobody
// ever gets there — the second date is the interesting one, and it has to be
// offered at the moment the first is fresh, with the reason for it written next
// to the button. It is never required: an event with one well-sourced date is a
// good contribution.
//
// Nothing is written until the last step. A wizard that saved as it went would
// leave half-events with no date behind them every time somebody closed a tab,
// and an event with no date cannot be drawn at all.

const STEPS = ["The event", "Its first date", "The source", "More dates"] as const;

function emptyFields(): EventFieldValues {
  return {
    title: "",
    summary: "",
    description: "",
    category: "history",
    subcategory: "",
    eventType: "",
    eventTypeNote: "",
    tags: "",
    people: "",
    civilisations: "",
    locationName: "",
    imageUrl: null,
    trackIds: [],
  };
}

/** What a draft claim will read as once stored — the same renderer the timeline uses. */
function previewClaim(claim: ClaimDraft): string | null {
  const start = resolveDateInput(claim.start);
  if (!start) return null;
  const end = resolveDateInput(claim.end);
  const uncertainty = resolveUncertaintyYears(claim);
  const normalised = formatClaimDate({
    start_year: start.year,
    start_month: start.month,
    start_day: start.day,
    end_year: end?.year ?? null,
    end_month: end?.month ?? null,
    end_day: end?.day ?? null,
    date_precision: claim.date_precision,
    precision_decimals: claim.precision_decimals,
    is_approximate: claim.is_approximate,
    uncertainty_plus: uncertainty.plus,
    uncertainty_minus: uncertainty.minus,
    original_date_text: "",
  });
  const original = claim.original_date_text.trim();
  // Both, but only when they differ. A source that words it the same way we do
  // shouldn't be quoted back at itself in brackets.
  if (!original || original === normalised) return normalised;
  return `${original} (${normalised})`;
}

export function AddEventFlow({
  communitySlug,
  userId,
  tracks,
  isStaff,
  onClose,
}: {
  communitySlug: string;
  userId: string;
  tracks: TimelineTrack[];
  isStaff: boolean;
  /** Called with the new event's slug on success, so the timeline can move to it. */
  onClose: (createdSlug?: string) => void;
}) {
  const router = useRouter();
  // A stable, per-form key for the picture's storage path. Date.now() would
  // change on every re-render, so a second upload would land somewhere else and
  // the first would be orphaned.
  const uploadKey = useId().replace(/[^a-zA-Z0-9]/g, "");

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [fields, setFields] = useState<EventFieldValues>(emptyFields);
  const [claims, setClaims] = useState<ClaimDraft[]>([emptyClaimDraft()]);

  const [link, setLink] = useState("");
  const [reading, setReading] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkFilled, setLinkFilled] = useState<string[] | null>(null);

  // Start from a link.
  //
  // Somebody adding "the Chicxulub impact" usually has the article or the
  // documentary open already. One paste fills what the page genuinely knows —
  // the event's name, a one-line summary, a picture, and the whole source block
  // waiting on step 3 — so the form arrives mostly answered.
  //
  // WHAT IT WILL NEVER FILL IS THE DATE. Everything above can be checked at a
  // glance against the page; a date cannot. Scraping a year out of an article
  // and presenting it as a sourced claim would manufacture exactly the thing
  // this feature exists to make visible — somebody asserting a date without
  // saying where it came from. Step 2 says so out loud.
  async function readLink() {
    const trimmed = link.trim();
    if (!trimmed) return;
    setReading(true);
    setLinkError(null);
    setLinkFilled(null);

    const result = await importSourceFromLink(communitySlug, trimmed);
    setReading(false);

    if (!result.ok) {
      setLinkError(result.error);
      return;
    }

    const found = result.source;
    const got: string[] = [];
    if (found.title) got.push("what happened");
    if (found.summary) got.push("a summary");
    if (found.imageUrl) got.push("a picture");
    got.push("the source");

    setFields((current) => ({
      ...current,
      // Never overwrite something already typed.
      title: current.title.trim() || found.title,
      summary: current.summary.trim() || found.summary || "",
      imageUrl: current.imageUrl ?? found.imageUrl,
    }));

    setClaims((current) =>
      current.map((claim, index) =>
        index === 0
          ? {
              ...claim,
              source_id: null,
              new_source: {
                ...(claim.new_source ?? emptySourceDraft()),
                title: claim.new_source?.title?.trim() || found.title,
                author: claim.new_source?.author?.trim() || found.author || "",
                publisher: claim.new_source?.publisher?.trim() || found.publisher || "",
                url: found.url,
                source_type: found.sourceType,
                published: found.published
                  ? { mode: "calendar" as const, year: found.published.year, era: "CE" as const, month: found.published.month, day: found.published.day, unit: "million" as const }
                  : claim.new_source?.published ?? null,
              },
            }
          : claim
      )
    );
    setLinkFilled(got);
  }

  function updateClaim(index: number, next: ClaimDraft) {
    setClaims((current) => current.map((claim, i) => (i === index ? next : claim)));
  }

  const canLeaveStepOne = fields.title.trim().length >= 2;
  const canLeaveStepTwo = Boolean(resolveDateInput(claims[0]?.start));

  async function submit() {
    setError(null);
    setSaving(true);

    const draft: EventDraft = {
      title: fields.title.trim(),
      summary: fields.summary.trim(),
      description: fields.description.trim(),
      category: fields.category,
      subcategory: fields.subcategory.trim() || null,
      event_type: fields.eventType || null,
      event_type_note: fields.eventTypeNote.trim() || null,
      tags: parseList(fields.tags),
      people: parseList(fields.people),
      civilisations: parseList(fields.civilisations),
      location_name: fields.locationName.trim() || null,
      lat: null,
      lng: null,
      image_url: fields.imageUrl,
      track_ids: fields.trackIds,
      claims: claims.filter((claim) => resolveDateInput(claim.start)),
    };

    const formData = new FormData();
    formData.set("community_slug", communitySlug);
    formData.set("draft", JSON.stringify(draft));

    const result = await createTimelineEvent(undefined, formData);
    setSaving(false);

    if (result && "error" in result) {
      setError(result.error);
      return;
    }
    router.refresh();
    // 13.8 billion years is a lot of axis to be lost in: an event added while
    // looking at the ancient world would otherwise save successfully and appear
    // nowhere, which reads exactly like a failure.
    onClose(result && "ok" in result ? result.slug : undefined);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-background shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Add an event</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onClose()}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-1 px-5 pt-3">
          {STEPS.map((label, index) => (
            <div
              key={label}
              className={cn("h-1 flex-1 rounded-full", index <= step ? "bg-accent" : "bg-muted")}
              aria-hidden
            />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 0 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-card p-4">
                <Label>Got a link? Start from it</Label>
                <div className="flex flex-wrap gap-2">
                  <Input
                    aria-label="Link to start from"
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void readLink();
                      }
                    }}
                    placeholder="A YouTube video, a Wikipedia article, a news story, a paper…"
                    className="min-w-[16rem] flex-1"
                  />
                  <Button type="button" variant="secondary" onClick={() => void readLink()} disabled={reading || !link.trim()}>
                    {reading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Reading…</>) : (<><Link2 className="h-4 w-4" /> Fill in</>)}
                  </Button>
                </div>

                {linkFilled && (
                  <p className="mt-1.5 text-xs text-accent">
                    Filled in {linkFilled.join(", ")}. The source is waiting on step 3 — check it all over and correct
                    anything the page got wrong.
                  </p>
                )}
                {linkError && <p className="mt-1.5 text-xs text-danger">{linkError}</p>}
                {!linkFilled && !linkError && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Optional. We&apos;ll fill in what the page says about itself — its title, a summary, a picture, and
                    who published it — but never the date. That one has to come from you.
                  </p>
                )}
              </div>

              <EventFields value={fields} onChange={setFields} tracks={tracks} userId={userId} uploadKey={uploadKey} autoFocus />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Every date on this timeline belongs to somebody — a book, a dig, a study. Put the date here, and where it
                came from on the next step.
              </p>
              {linkFilled && (
                <p className="rounded-lg bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground">
                  We filled in what we could from your link, but not this. A date is a claim somebody makes, and reading
                  one off a page without saying where it came from is the habit this timeline exists to break. Read it
                  off the source yourself.
                </p>
              )}
              <ClaimFields
                value={claims[0]}
                onChange={(next) => updateClaim(0, next)}
                communitySlug={communitySlug}
                index={0}
                show="date"
                bare
              />
            </div>
          )}

          {step === 2 && (
            <ClaimFields
              value={claims[0]}
              onChange={(next) => updateClaim(0, next)}
              communitySlug={communitySlug}
              index={0}
              show="source"
              bare
            />
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">{fields.title || "Your event"}</p>
                <ul className="mt-1 space-y-0.5">
                  {claims.map((claim, index) => {
                    const preview = previewClaim(claim);
                    return preview ? (
                      <li key={index} className="text-sm text-muted-foreground">
                        {preview}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>

              {claims.slice(1).map((claim, index) => (
                <ClaimFields
                  key={index + 1}
                  value={claim}
                  onChange={(next) => updateClaim(index + 1, next)}
                  onRemove={() => setClaims((current) => current.filter((_, i) => i !== index + 1))}
                  communitySlug={communitySlug}
                  index={index + 1}
                />
              ))}

              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setClaims((current) => [...current, emptyClaimDraft()])}
                >
                  <Plus className="h-4 w-4" /> Add another proposed date
                </Button>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Add another date if another source gives a different chronology for this event. You don&apos;t have to
                  — but where sources disagree, showing both is the honest thing to do.
                </p>
              </div>

              {!isStaff && (
                <p className="rounded-lg bg-accent-soft px-3.5 py-3 text-sm text-accent">
                  Your entry will go to the community&apos;s teachers for approval before it appears on the timeline.
                </p>
              )}
            </div>
          )}

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => (step === 0 ? onClose() : setStep((current) => current - 1))}
            disabled={saving}
          >
            {step === 0 ? "Cancel" : (<><ArrowLeft className="h-4 w-4" /> Back</>)}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((current) => current + 1)}
              disabled={(step === 0 && !canLeaveStepOne) || (step === 1 && !canLeaveStepTwo)}
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={submit} disabled={saving || !canLeaveStepOne || !canLeaveStepTwo}>
              {saving ? "Saving…" : (<><Check className="h-4 w-4" /> {isStaff ? "Add to timeline" : "Send for approval"}</>)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
