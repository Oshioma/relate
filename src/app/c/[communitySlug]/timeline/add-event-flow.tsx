"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";
import type { TimelineSource, TimelineTrack } from "@/types/database";
import { ClaimFields } from "./claim-fields";
import { createTimelineEvent } from "./actions";
import { TIMELINE_CATEGORIES } from "@/lib/timeline/taxonomy";
import { emptyClaimDraft, resolveDateInput, type ClaimDraft, type EventDraft } from "@/lib/timeline/draft";
import { formatClaim } from "@/lib/timeline/time";

// Adding an event, in four steps.
//
// The steps exist because of what step four is: "add another proposed date if
// another source gives a different chronology". Asked as one long form, nobody
// ever gets there — the second date is the interesting one, and it has to be
// offered at the moment the first one is fresh, with the reason for it written
// next to the button. It is never required: an event with one well-sourced date
// is a good contribution.
//
// Nothing is written until the last step. A wizard that saved as it went would
// leave half-events with no date behind them every time somebody closed a tab,
// and an event with no date cannot be drawn at all.

const STEPS = ["The event", "Its first date", "The source", "More dates"] as const;

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function AddEventFlow({
  communitySlug,
  userId,
  sources,
  tracks,
  isStaff,
  onClose,
}: {
  communitySlug: string;
  userId: string;
  sources: TimelineSource[];
  tracks: TimelineTrack[];
  isStaff: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  // A stable, per-form key for the picture's storage path. Date.now() would
  // change on every re-render, so a second upload would land somewhere else and
  // the first would be orphaned.
  const uploadKey = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("history");
  const [subcategory, setSubcategory] = useState("");
  const [tags, setTags] = useState("");
  const [people, setPeople] = useState("");
  const [civilisations, setCivilisations] = useState("");
  const [locationName, setLocationName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [trackIds, setTrackIds] = useState<string[]>([]);
  const [claims, setClaims] = useState<ClaimDraft[]>([emptyClaimDraft()]);

  function updateClaim(index: number, next: ClaimDraft) {
    setClaims((current) => current.map((claim, i) => (i === index ? next : claim)));
  }

  const canLeaveStepOne = title.trim().length >= 2;
  const canLeaveStepTwo = Boolean(resolveDateInput(claims[0]?.start));

  async function submit() {
    setError(null);
    setSaving(true);

    const draft: EventDraft = {
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      category,
      subcategory: subcategory.trim() || null,
      tags: parseList(tags),
      people: parseList(people),
      civilisations: parseList(civilisations),
      location_name: locationName.trim() || null,
      lat: null,
      lng: null,
      image_url: imageUrl,
      track_ids: trackIds,
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
    onClose();
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
            onClick={onClose}
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
            <div className="space-y-4">
              <div>
                <Label>What happened?</Label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Construction of the Great Pyramid"
                  autoFocus
                />
              </div>
              <div>
                <Label>In one line</Label>
                <Input
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="The largest of the pyramids at Giza, built for the pharaoh Khufu."
                />
              </div>
              <div>
                <Label>The full story</Label>
                <Textarea
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What happened, why it matters, and what we know about it."
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Category</Label>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {TIMELINE_CATEGORIES.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>More specifically (optional)</Label>
                  <Input
                    value={subcategory}
                    onChange={(event) => setSubcategory(event.target.value)}
                    placeholder="Architecture"
                  />
                </div>
                <div>
                  <Label>People involved</Label>
                  <Input value={people} onChange={(event) => setPeople(event.target.value)} placeholder="Khufu, Hemiunu" />
                </div>
                <div>
                  <Label>Civilisations</Label>
                  <Input
                    value={civilisations}
                    onChange={(event) => setCivilisations(event.target.value)}
                    placeholder="Ancient Egypt"
                  />
                </div>
                <div>
                  <Label>Where</Label>
                  <Input value={locationName} onChange={(event) => setLocationName(event.target.value)} placeholder="Giza, Egypt" />
                </div>
                <div>
                  <Label>Tags</Label>
                  <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="pyramids, old kingdom" />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">People, civilisations and tags are comma separated.</p>

              <div>
                <Label>Picture</Label>
                <ImageUpload
                  bucket="uploads"
                  basePath={`${userId}/timeline/${uploadKey}`}
                  currentUrl={imageUrl}
                  onUploaded={(url) => setImageUrl(url)}
                  shape="square"
                  size={120}
                  aspect={16 / 9}
                  label="Add a picture"
                  hint="Optional. A photograph, painting or diagram."
                />
              </div>

              {tracks.length > 0 && (
                <div>
                  <Label>Which compare lanes does this belong in?</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {tracks.map((track) => {
                      const on = trackIds.includes(track.id);
                      return (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() =>
                            setTrackIds((current) =>
                              on ? current.filter((id) => id !== track.id) : [...current, track.id]
                            )
                          }
                          aria-pressed={on}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                            on ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {track.name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Lanes are how Compare shows what was happening elsewhere at the same time.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Every date on this timeline belongs to somebody — a book, a dig, a study. Put the date here, and where it
                came from on the next step.
              </p>
              <ClaimFields
                value={claims[0]}
                onChange={(next) => updateClaim(0, next)}
                sources={sources}
                index={0}
                show="date"
                bare
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <ClaimFields
                value={claims[0]}
                onChange={(next) => updateClaim(0, next)}
                sources={sources}
                index={0}
                show="source"
                bare
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">{title || "Your event"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {claims
                    .filter((claim) => resolveDateInput(claim.start))
                    .map((claim) => {
                      const resolved = resolveDateInput(claim.start);
                      const end = resolveDateInput(claim.end);
                      return resolved
                        ? formatClaim({
                            start_year: resolved.year,
                            start_month: resolved.month,
                            start_day: resolved.day,
                            end_year: end?.year ?? null,
                            end_month: end?.month ?? null,
                            end_day: end?.day ?? null,
                            date_precision: claim.date_precision,
                            is_approximate: claim.is_approximate,
                            display_text: claim.display_text,
                          })
                        : "";
                    })
                    .join("  ·  ")}
                </p>
              </div>

              {claims.slice(1).map((claim, index) => (
                <ClaimFields
                  key={index + 1}
                  value={claim}
                  onChange={(next) => updateClaim(index + 1, next)}
                  onRemove={() => setClaims((current) => current.filter((_, i) => i !== index + 1))}
                  sources={sources}
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
