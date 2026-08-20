"use client";

import { useRef, useState } from "react";
import { createMeetup } from "./meetups-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { MEETUP_PACE_PRESETS, MEETUP_DURATION_PRESETS } from "@/lib/meetups";

// A datetime-local input wants "YYYY-MM-DDTHH:mm" in the viewer's own zone,
// which is exactly how they think about "6pm".
function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function minutesFromNow(minutes: number): string {
  return toLocalInputValue(new Date(Date.now() + minutes * 60_000));
}

// This evening at 18:00 — today if it hasn't happened yet, otherwise tomorrow.
function thisEvening(): string {
  const evening = new Date();
  evening.setHours(18, 0, 0, 0);
  if (evening.getTime() < Date.now()) evening.setDate(evening.getDate() + 1);
  return toLocalInputValue(evening);
}

// Tomorrow morning at 08:00.
function tomorrowMorning(): string {
  const morning = new Date();
  morning.setDate(morning.getDate() + 1);
  morning.setHours(8, 0, 0, 0);
  return toLocalInputValue(morning);
}

export function NewMeetupForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  // The community's own activity, e.g. "Hiking" — prefilled so posting a walk
  // is three taps. Null for a community with no activity kind set.
  activityLabel,
  onDone,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  activityLabel: string | null;
  onDone?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [startsAt, setStartsAt] = useState(() => minutesFromNow(60));
  const [duration, setDuration] = useState<number | "">("");
  const [pace, setPace] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createMeetup(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setStartsAt(minutesFromNow(60));
      setDuration("");
      setPace("");
      onDone?.();
    }
  }

  const quickTimes: { label: string; value: () => string }[] = [
    { label: "In 30 min", value: () => minutesFromNow(30) },
    { label: "In 1 hour", value: () => minutesFromNow(60) },
    { label: "In 2 hours", value: () => minutesFromNow(120) },
    { label: "This evening", value: thisEvening },
    { label: "Tomorrow 8am", value: tomorrowMorning },
  ];

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div>
        <Label htmlFor="meetup_title">What are you doing?</Label>
        <Input id="meetup_title" name="title" placeholder="Evening walk up the ridge" required />
      </div>

      <div>
        <Label htmlFor="meetup_starts_at">When</Label>
        <Input
          id="meetup_starts_at"
          name="starts_at"
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
        />
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {quickTimes.map((quick) => (
            <button
              key={quick.label}
              type="button"
              onClick={() => setStartsAt(quick.value())}
              className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground"
            >
              {quick.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="meetup_meeting_point">Where you&apos;re meeting</Label>
        <Input id="meetup_meeting_point" name="meeting_point" placeholder="The car park by the second gate" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="meetup_activity">Activity</Label>
          <Input id="meetup_activity" name="activity" defaultValue={activityLabel ?? ""} placeholder="Hiking" />
        </div>
        <div>
          <Label htmlFor="meetup_pace">Pace</Label>
          <Input id="meetup_pace" name="pace" value={pace} onChange={(e) => setPace(e.target.value)} placeholder="Moderate" />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {MEETUP_PACE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPace(preset)}
                className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="meetup_duration_minutes">How long (optional)</Label>
        <Input
          id="meetup_duration_minutes"
          name="duration_minutes"
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Minutes — leave blank for open-ended"
        />
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {MEETUP_DURATION_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setDuration(preset)}
              className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground"
            >
              {preset < 60 ? `${preset} min` : `${preset / 60}h`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="meetup_distance_km">Distance in km (optional)</Label>
          <Input id="meetup_distance_km" name="distance_km" type="number" step="any" min={0} placeholder="8" />
        </div>
        <div>
          <Label htmlFor="meetup_capacity">Spots (optional)</Label>
          <Input id="meetup_capacity" name="capacity" type="number" min={1} placeholder="Leave blank for no limit" />
        </div>
      </div>

      <div>
        <Label htmlFor="meetup_description">Anything else (optional)</Label>
        <Textarea id="meetup_description" name="description" rows={2} placeholder="Bring a head torch — we'll finish in the dark. Dogs welcome." />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="meetup_lat">Latitude (optional)</Label>
          <Input id="meetup_lat" name="lat" type="number" step="any" placeholder="-33.9628" />
        </div>
        <div>
          <Label htmlFor="meetup_lng">Longitude (optional)</Label>
          <Input id="meetup_lng" name="lng" type="number" step="any" placeholder="18.4098" />
        </div>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">Set both to drop the meeting point on the Meet-Up Map.</p>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Posting…" className="w-auto">
        Post meetup
      </SubmitButton>
    </form>
  );
}
