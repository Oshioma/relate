"use client";

import { Input, Textarea, Label } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";
import type { TimelineTrack } from "@/types/database";
import { TIMELINE_CATEGORIES, TIMELINE_EVENT_TYPES } from "@/lib/timeline/taxonomy";

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
  trackIds: string[];
};

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
        <Label>Picture</Label>
        <ImageUpload
          bucket="uploads"
          basePath={`${userId}/timeline/${uploadKey}`}
          currentUrl={value.imageUrl}
          onUploaded={(url) => update({ imageUrl: url })}
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
