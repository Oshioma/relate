"use client";

import { Input, Textarea, Label } from "@/components/ui/input";
import type { Event } from "@/types/database";

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in local time, not
// an ISO string with a timezone offset.
function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// The shared field set for creating and editing an event. Uncontrolled text
// fields take their defaults from `event` when editing. Location is geocoded
// server-side on submit (see actions.ts) — that's what puts the event on the
// Explore Map, no separate pin-drop step.
export function EventFormFields({ idPrefix, event }: { idPrefix: string; event?: Event }) {
  return (
    <>
      <div>
        <Label htmlFor={`${idPrefix}_title`}>Title</Label>
        <Input id={`${idPrefix}_title`} name="title" placeholder="Community welcome call" defaultValue={event?.title} required />
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_description`}>Description</Label>
        <Textarea id={`${idPrefix}_description`} name="description" rows={2} placeholder="What's this event about?" defaultValue={event?.description ?? ""} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_start_time`}>Starts</Label>
          <Input
            id={`${idPrefix}_start_time`}
            name="start_time"
            type="datetime-local"
            defaultValue={toDatetimeLocal(event?.start_time)}
            required
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_end_time`}>Ends (optional)</Label>
          <Input id={`${idPrefix}_end_time`} name="end_time" type="datetime-local" defaultValue={toDatetimeLocal(event?.end_time)} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idPrefix}_location`}>Location</Label>
          <Input
            id={`${idPrefix}_location`}
            name="location"
            placeholder="123 Main St, or a place like Kendwa"
            defaultValue={event?.location ?? ""}
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}_online_url`}>Online link (optional)</Label>
          <Input id={`${idPrefix}_online_url`} name="online_url" type="text" placeholder="example.com/meeting" defaultValue={event?.online_url ?? ""} />
        </div>
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_image_url`}>Image URL (optional)</Label>
        <Input
          id={`${idPrefix}_image_url`}
          name="image_url"
          type="text"
          placeholder="https://example.com/photo.jpg"
          defaultValue={event?.image_url ?? ""}
        />
      </div>
    </>
  );
}
