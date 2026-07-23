"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { updateEvent } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { EventFormFields } from "./event-form-fields";
import type { PickedLocation } from "@/components/map/location-picker";
import type { Event } from "@/types/database";

export function EditEventForm({
  event,
  communitySlug,
  communityLocationName = null,
  onDone,
  onCancel,
}: {
  event: Event;
  communitySlug: string;
  communityLocationName?: string | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [pin, setPin] = useState<PickedLocation | null>(
    event.lat !== null && event.lng !== null ? { lat: event.lat, lng: event.lng } : null
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await updateEvent(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      onDone();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="event_id" value={event.id} />
      <input type="hidden" name="community_slug" value={communitySlug} />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Edit {event.title}</p>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <EventFormFields
        idPrefix={`edit_event_${event.id}`}
        event={event}
        pin={pin}
        onPinChange={setPin}
        communityLocationName={communityLocationName}
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save changes
      </SubmitButton>
    </form>
  );
}
