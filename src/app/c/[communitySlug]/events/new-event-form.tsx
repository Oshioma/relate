"use client";

import { useRef, useState } from "react";
import { createEvent } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { EventFormFields } from "./event-form-fields";
import type { PickedLocation } from "@/components/map/location-picker";

export function NewEventForm({
  communityId,
  communitySlug,
  communityLocationName = null,
}: {
  communityId: string;
  communitySlug: string;
  communityLocationName?: string | null;
}) {
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

      <EventFormFields idPrefix="event" pin={pin} onPinChange={setPin} communityLocationName={communityLocationName} />

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Creating…" className="w-auto">
        Create event
      </SubmitButton>
    </form>
  );
}
