"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimelineDateClaim, TimelineSource, TimelineTrack } from "@/types/database";
import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { EventFields, parseList, type EventFieldValues } from "./event-fields";
import { ClaimFields } from "./claim-fields";
import { addDateClaim, deleteDateClaim, updateDateClaim, updateTimelineEvent } from "./actions";
import { emptyClaimDraft, resolveDateInput, type ClaimDraft, type EventDraft } from "@/lib/timeline/draft";
import { claimHeadline, dateUnit, eraYearOf, yearsAgoOf } from "@/lib/timeline/time";

// Editing an event, without deleting and recreating it.
//
// Everything keeps its identity: the event keeps its id and its SLUG (so a
// bookmark, a shared link or a lesson that points here still resolves), each
// date claim keeps its own id (so its revision history stays one thread rather
// than becoming a deletion beside an unrelated addition), and sources are never
// touched — they belong to the community, not to this event.
//
// Two panes rather than a wizard. A wizard is right for adding, where the steps
// teach the shape of the thing; it is wrong for editing, where somebody has
// come to change one field and should not have to walk past four screens to
// reach it.
//
// WHO PAYS WHAT. Staff edit and it stays published. A contributor editing their
// own published entry sends it back for approval — otherwise "post, wait for
// approval, then rewrite" walks straight past moderation. The banner says so
// before they start, not after they save.

type Pane = "details" | "dates";

/** A stored claim, back into the shape the form edits. */
function claimToDraft(claim: TimelineDateClaim): ClaimDraft {
  const unit = dateUnit(claim.date_precision);

  // Deep-time claims were typed as "13.799 billion years ago" and must go back
  // into the form that way — rebuilding them as an astronomical year would show
  // the contributor a number they never wrote.
  const asYearsAgo = (year: number) => {
    const ago = yearsAgoOf(year);
    if (unit.key === "billion_years") return { mode: "years_ago" as const, amount: ago / 1e9, unit: "billion" as const };
    if (unit.key === "million_years") return { mode: "years_ago" as const, amount: ago / 1e6, unit: "million" as const };
    if (unit.key === "thousand_years") return { mode: "years_ago" as const, amount: ago, unit: "years" as const };
    return null;
  };

  const toInput = (year: number, month: number | null, day: number | null) => {
    const ago = asYearsAgo(year);
    if (ago) return { ...ago, era: "CE" as const, month: null, day: null };
    const { year: eraYear, era } = eraYearOf(year);
    return { mode: "calendar" as const, year: eraYear, era, month, day, unit: "million" as const };
  };

  return {
    start: toInput(claim.start_year, claim.start_month, claim.start_day),
    end: claim.end_year != null ? toInput(claim.end_year, claim.end_month, claim.end_day) : null,
    date_precision: claim.date_precision,
    precision_decimals: claim.precision_decimals,
    is_approximate: claim.is_approximate,
    // Back into the unit it was typed in, so "± 0.021" doesn't reappear as
    // "± 21000000".
    uncertainty_plus_units: claim.uncertainty_plus == null ? null : claim.uncertainty_plus / unit.years,
    uncertainty_minus_units: claim.uncertainty_minus == null ? null : claim.uncertainty_minus / unit.years,
    original_date_text: claim.original_date_text ?? "",
    dating_method: claim.dating_method,
    chronology: claim.chronology,
    evidence: claim.evidence,
    notes: claim.notes,
    source_id: claim.source_id,
    new_source: null,
  };
}

export function EditEventFlow({
  event,
  initialPane = "details",
  communitySlug,
  userId,
  sources,
  tracks,
  isStaff,
  onClose,
  onSaved,
}: {
  event: TimelineEventWithClaims;
  communitySlug: string;
  userId: string;
  sources: TimelineSource[];
  tracks: TimelineTrack[];
  isStaff: boolean;
  initialPane?: Pane;
  onClose: () => void;
  /**
   * Something was actually written. router.refresh() re-renders the server
   * components, which is enough for a page that reads its event from the
   * server — and not enough for the timeline, which holds its events and its
   * open panel in client state seeded once at mount. Renaming an event there
   * left the old title on the strip and in the panel until a full reload.
   */
  onSaved?: () => void;
}) {
  const router = useRouter();
  const uploadKey = useId().replace(/[^a-zA-Z0-9]/g, "");

  const [pane, setPane] = useState<Pane>(initialPane);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [fields, setFields] = useState<EventFieldValues>({
    title: event.title,
    summary: event.summary,
    description: event.description,
    category: event.category,
    subcategory: event.subcategory ?? "",
    eventType: event.event_type ?? "",
    eventTypeNote: event.event_type_note ?? "",
    tags: event.tags.join(", "),
    people: event.people.join(", "),
    civilisations: event.civilisations.join(", "),
    locationName: event.location_name ?? "",
    imageUrl: event.image_url,
    trackIds: event.trackIds,
  });

  // Which claim is open for editing, and the draft being edited.
  const [editingClaimId, setEditingClaimId] = useState<string | null>(null);
  const [claimDraft, setClaimDraft] = useState<ClaimDraft | null>(null);
  const [addingClaim, setAddingClaim] = useState(false);

  const returnsToQueue = !isStaff && event.status === "published";
  const sourcesById = new Map(sources.map((source) => [source.id, source]));

  async function saveDetails() {
    setError(null);
    setSaving(true);

    const draft: Omit<EventDraft, "claims"> = {
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
    };

    const formData = new FormData();
    formData.set("community_slug", communitySlug);
    formData.set("event_id", event.id);
    formData.set("draft", JSON.stringify(draft));

    const result = await updateTimelineEvent(undefined, formData);
    setSaving(false);

    if (result && "error" in result) {
      setError(result.error);
      return;
    }
    router.refresh();
    onSaved?.();
    onClose();
  }

  async function saveClaim() {
    if (!claimDraft) return;
    setError(null);
    if (!resolveDateInput(claimDraft.start)) {
      setError("Fill in the date first.");
      return;
    }
    setSaving(true);

    const formData = new FormData();
    formData.set("community_slug", communitySlug);
    formData.set("claim", JSON.stringify(claimDraft));

    let result;
    if (editingClaimId) {
      formData.set("claim_id", editingClaimId);
      result = await updateDateClaim(undefined, formData);
    } else {
      formData.set("event_id", event.id);
      result = await addDateClaim(undefined, formData);
    }
    setSaving(false);

    if (result && "error" in result) {
      setError(result.error);
      return;
    }
    setEditingClaimId(null);
    setClaimDraft(null);
    setAddingClaim(false);
    setNotice(editingClaimId ? "Date updated." : "Date added.");
    router.refresh();
    onSaved?.();
  }

  async function removeClaim(claimId: string) {
    setError(null);
    setSaving(true);
    const result = await deleteDateClaim(claimId, communitySlug);
    setSaving(false);
    if (result && "error" in result) {
      setError(result.error);
      return;
    }
    setNotice("Date removed.");
    router.refresh();
    onSaved?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-background shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">Edit “{event.title}”</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              The web address stays the same, so links to this event keep working.
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

        {returnsToQueue && (
          <p className="border-b border-border bg-accent-soft px-5 py-3 text-sm text-accent">
            This event has already been approved. Any change you make sends it back to the community&apos;s teachers for
            approval before it shows on the timeline again.
          </p>
        )}

        <div className="flex gap-1 border-b border-border px-5">
          {(
            [
              { key: "details", label: "Details" },
              { key: "dates", label: `Proposed dates (${event.claims.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setPane(tab.key)}
              aria-pressed={pane === tab.key}
              className={cn(
                "-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                pane === tab.key
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {pane === "details" ? (
            <EventFields
              value={fields}
              onChange={setFields}
              tracks={tracks}
              userId={userId}
              uploadKey={uploadKey}
            />
          ) : (
            <div className="space-y-4">
              {notice && <p className="rounded-lg bg-accent-soft px-3.5 py-2.5 text-sm text-accent">{notice}</p>}

              {claimDraft ? (
                <>
                  <ClaimFields
                    value={claimDraft}
                    onChange={setClaimDraft}
                    communitySlug={communitySlug}
                    attachedSource={claimDraft.source_id ? sourcesById.get(claimDraft.source_id) ?? null : null}
                    index={editingClaimId ? event.claims.findIndex((claim) => claim.id === editingClaimId) : event.claims.length}
                  />
                  <div className="flex gap-2">
                    <Button type="button" onClick={saveClaim} disabled={saving}>
                      {saving ? "Saving…" : editingClaimId ? "Save this date" : "Add this date"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={saving}
                      onClick={() => {
                        setClaimDraft(null);
                        setEditingClaimId(null);
                        setAddingClaim(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <ul className="space-y-2">
                    {event.claims.map((claim, index) => {
                      const { headline, normalised, quoted } = claimHeadline(claim);
                      const source = claim.source_id ? sourcesById.get(claim.source_id) : null;
                      return (
                        <li
                          key={claim.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{headline}</p>
                            {quoted && <p className="text-xs text-muted-foreground">On the timeline: {normalised}</p>}
                            <p className="text-sm text-muted-foreground">
                              {source ? source.title : "No source attached"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              disabled={saving}
                              onClick={() => {
                                setEditingClaimId(claim.id);
                                setClaimDraft(claimToDraft(claim));
                                setAddingClaim(false);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              disabled={saving || event.claims.length <= 1}
                              title={
                                event.claims.length <= 1
                                  ? "An event needs at least one proposed date to sit anywhere on the timeline."
                                  : undefined
                              }
                              onClick={() => removeClaim(claim.id)}
                            >
                              Remove
                            </Button>
                          </div>
                          <span className="sr-only">Proposed date {index + 1}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="rounded-xl border border-dashed border-border p-4 text-center">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={saving || addingClaim}
                      onClick={() => {
                        setEditingClaimId(null);
                        setClaimDraft(emptyClaimDraft());
                        setAddingClaim(true);
                      }}
                    >
                      <Plus className="h-4 w-4" /> Add another proposed date
                    </Button>
                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                      Add another date if another source gives a different chronology for this event.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Done
          </Button>
          {pane === "details" && (
            <Button type="button" onClick={saveDetails} disabled={saving || fields.title.trim().length < 2}>
              {saving ? "Saving…" : (<><Check className="h-4 w-4" /> Save details</>)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
