"use client";

import { Plus, X } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";
import type { TimelineTrack } from "@/types/database";
import { MEDIA_KINDS, TIMELINE_CATEGORIES, TIMELINE_EVENT_TYPES, mediaKindHint } from "@/lib/timeline/taxonomy";

// The event's own details — everything except its dates.
//
// Shared by "add an event" and "edit this event" so the two can never drift
// into offering different fields, which is how an edit form quietly becomes a
// way to lose data somebody entered on the add form.

export type EventFieldValues = {
  title: string;
  summary: string;
  description: string;
  category: string;
  subcategory: string;
  eventType: string;
  eventTypeNote: string;
  tags: string;
  people: string;
  civilisations: string;
  locationName: string;
  imageUrl: string | null;
  /**
   * EVERY PICTURE ON THIS RECORD, not just a cover.
   *
   * The first one is the cover — that is what imageUrl is derived from on save
   * — so nobody has to upload the same file twice to get both.
   */
  media: MediaDraft[];
  trackIds: string[];
};

export type MediaDraft = {
  url: string;
  caption: string;
  credit: string;
  shows: string;
};

export function emptyMedia(): MediaDraft {
  return { url: "", caption: "", credit: "", shows: "" };
}

export function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function EventFields({
  value,
  onChange,
  tracks,
  userId,
  uploadKey,
  autoFocus = false,
}: {
  value: EventFieldValues;
  onChange: (next: EventFieldValues) => void;
  tracks: TimelineTrack[];
  userId: string;
  /** Stable per form, so a second upload replaces the first rather than orphaning it. */
  uploadKey: string;
  autoFocus?: boolean;
}) {
  /** Change one picture in the list, leaving the rest exactly as they are. */
  function updateMedia(index: number, patch: Partial<MediaDraft>) {
    onChange({
      ...value,
      media: value.media.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  }

  function update(patch: Partial<EventFieldValues>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>What happened?</Label>
        <Input
          value={value.title}
          onChange={(event) => update({ title: event.target.value })}
          aria-label="Title"
          placeholder="Construction of the Great Pyramid"
          autoFocus={autoFocus}
        />
      </div>

      <div>
        <Label>In one line</Label>
        <Input
          value={value.summary}
          onChange={(event) => update({ summary: event.target.value })}
          aria-label="One-line summary"
          placeholder="The largest of the pyramids at Giza, built for the pharaoh Khufu."
        />
      </div>

      <div>
        <Label>The full story</Label>
        <Textarea
          rows={5}
          value={value.description}
          onChange={(event) => update({ description: event.target.value })}
          placeholder="What happened, why it matters, and what we know about it."
        />
      </div>

      {/* WHAT KIND OF RECORD THIS IS — not how much anyone believes it. The
          hint under the control says so, because the difference between
          "describing a claim" and "rating a claim" is the whole difference
          between this feature and a fact-checking widget. */}
      <div className="rounded-lg border border-border bg-muted/30 p-3.5">
        <Label>What kind of record is this?</Label>
        <select
          aria-label="What kind of record is this?"
          value={value.eventType}
          onChange={(event) => update({ eventType: event.target.value })}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Not stated</option>
          {TIMELINE_EVENT_TYPES.map((type) => (
            <option key={type.key} value={type.key}>
              {type.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          {TIMELINE_EVENT_TYPES.find((type) => type.key === value.eventType)?.hint ??
            "Describes what sort of record this is — a historical event, a scientific model, a traditional account. It is not a judgement about whether it happened."}
        </p>
        {value.eventType && (
          <div className="mt-3">
            <Label>Anything worth explaining about that?</Label>
            <Textarea
              rows={2}
              value={value.eventTypeNote}
              onChange={(event) => update({ eventTypeNote: event.target.value })}
              placeholder="Optional — e.g. “Known only from one account, written three centuries later.”"
            />
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Category</Label>
          <select
            aria-label="Category"
            value={value.category}
            onChange={(event) => update({ category: event.target.value })}
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
            value={value.subcategory}
            onChange={(event) => update({ subcategory: event.target.value })}
            aria-label="More specifically"
          placeholder="Architecture"
          />
        </div>
        <div>
          <Label>People involved</Label>
          <Input
            value={value.people}
            onChange={(event) => update({ people: event.target.value })}
            aria-label="People involved"
          placeholder="Khufu, Hemiunu"
          />
        </div>
        <div>
          <Label>Civilisations</Label>
          <Input
            value={value.civilisations}
            onChange={(event) => update({ civilisations: event.target.value })}
            aria-label="Civilisations"
          placeholder="Ancient Egypt"
          />
        </div>
        <div>
          <Label>Where</Label>
          <Input
            value={value.locationName}
            onChange={(event) => update({ locationName: event.target.value })}
            aria-label="Where"
          placeholder="Giza, Egypt"
          />
        </div>
        <div>
          <Label>Tags</Label>
          <Input
            value={value.tags}
            onChange={(event) => update({ tags: event.target.value })}
            aria-label="Tags"
          placeholder="pyramids, old kingdom"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">People, civilisations and tags are comma separated.</p>

      <div>
        <Label>Pictures</Label>
        <p className="mb-2 text-xs text-muted-foreground">
          The first one is used as the cover. For each, say what it is a picture{" "}
          <em>of</em> — a photograph of the evidence and a nineteenth-century painting of the same event are not the
          same kind of thing, and a painting that does not say so reads as a record.
        </p>

        <div className="space-y-3">
          {value.media.map((item, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-3">
              <div className="flex flex-wrap items-start gap-3">
                <ImageUpload
                  // Keyed on the URL for the same reason the cover was: the
                  // control seeds its preview from currentUrl once, on mount.
                  key={item.url || `slot-${index}`}
                  bucket="uploads"
                  basePath={`${userId}/timeline/${uploadKey}-${index + 1}`}
                  currentUrl={item.url || null}
                  onUploaded={(url) => updateMedia(index, { url })}
                  shape="square"
                  size={104}
                  aspect={16 / 9}
                  label={index === 0 ? "Cover picture" : `Picture ${index + 1}`}
                  hint=""
                />

                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <Label>What does this show?</Label>
                    <select
                      value={item.shows}
                      onChange={(event) => updateMedia(index, { shows: event.target.value })}
                      aria-label={`What picture ${index + 1} shows`}
                      className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    >
                      <option value="">Not said</option>
                      {MEDIA_KINDS.map((kind) => (
                        <option key={kind.key} value={kind.key}>
                          {kind.label}
                        </option>
                      ))}
                    </select>
                    {mediaKindHint(item.shows) && (
                      <p className="mt-1 text-xs text-muted-foreground">{mediaKindHint(item.shows)}</p>
                    )}
                  </div>

                  <div>
                    <Label>Caption</Label>
                    <Textarea
                      value={item.caption}
                      onChange={(event) => updateMedia(index, { caption: event.target.value })}
                      aria-label={`Caption for picture ${index + 1}`}
                      rows={2}
                      placeholder="What it shows — and what it is not evidence of."
                    />
                  </div>

                  <div>
                    <Label>Who made it, and under what terms</Label>
                    <Input
                      value={item.credit}
                      onChange={(event) => updateMedia(index, { credit: event.target.value })}
                      aria-label={`Credit for picture ${index + 1}`}
                      placeholder="Photographer, licence, where it came from"
                    />
                    {/* Kept out of the caption on purpose: the caption is also
                        the alt text, and a licence read aloud with a URL
                        spelled out is not a description of a photograph. */}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Shown under the picture, not inside the caption. Required by most licences if the picture is not
                      yours.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onChange({ ...value, media: value.media.filter((_, i) => i !== index) })}
                  aria-label={`Remove picture ${index + 1}`}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-danger"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {value.media.length < 12 && (
          <button
            type="button"
            onClick={() => onChange({ ...value, media: [...value.media, emptyMedia()] })}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            {value.media.length === 0 ? "Add a picture" : "Add another picture"}
          </button>
        )}
      </div>


      {tracks.length > 0 && (
        <div>
          <Label>Which compare lanes does this belong in?</Label>
          <div className="flex flex-wrap gap-1.5">
            {tracks.map((track) => {
              const on = value.trackIds.includes(track.id);
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() =>
                    update({
                      trackIds: on
                        ? value.trackIds.filter((id) => id !== track.id)
                        : [...value.trackIds, track.id],
                    })
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
  );
}
