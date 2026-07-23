"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createEvent } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { PickedLocation } from "@/components/map/location-picker";

// Leaflet touches `window` at import time, so the picker can only load in the
// browser — same pattern as explore-map-loader.tsx.
const LocationPicker = dynamic(() => import("@/components/map/location-picker"), {
  ssr: false,
  loading: () => <div className="flex h-[280px] items-center justify-center rounded-md border border-border bg-muted text-xs text-muted-foreground">Loading map…</div>,
});

export function NewEventForm({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pin, setPin] = useState<PickedLocation | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createEvent(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setPin(null);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />

      <div>
        <Label htmlFor="event_title">Title</Label>
        <Input id="event_title" name="title" placeholder="Community welcome call" required />
      </div>

      <div>
        <Label htmlFor="event_description">Description</Label>
        <Textarea id="event_description" name="description" rows={2} placeholder="What's this event about?" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="start_time">Starts</Label>
          <Input id="start_time" name="start_time" type="datetime-local" required />
        </div>
        <div>
          <Label htmlFor="end_time">Ends (optional)</Label>
          <Input id="end_time" name="end_time" type="datetime-local" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="location">Location (optional)</Label>
          <Input id="location" name="location" placeholder="123 Main St, or leave blank" />
        </div>
        <div>
          <Label htmlFor="online_url">Online link (optional)</Label>
          <Input id="online_url" name="online_url" type="text" placeholder="example.com/meeting" />
        </div>
      </div>

      <div>
        <Label>Show on the Explore Map (optional)</Label>
        <LocationPicker value={pin} onChange={setPin} emoji="📅" helpText="Click the map to drop a pin — this puts the event on the Explore Map." />
        <input type="hidden" name="lat" value={pin?.lat ?? ""} />
        <input type="hidden" name="lng" value={pin?.lng ?? ""} />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Creating…" className="w-auto">
        Create event
      </SubmitButton>
    </form>
  );
}
