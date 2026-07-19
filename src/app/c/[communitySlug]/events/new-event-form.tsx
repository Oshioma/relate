"use client";

import { useActionState, useRef, useEffect } from "react";
import { createEvent, type EventFormState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewEventForm({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [state, formAction] = useActionState<EventFormState, FormData>(createEvent, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
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
          <Input id="online_url" name="online_url" type="url" placeholder="https://…" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Creating…" className="w-auto">
        Create event
      </SubmitButton>
    </form>
  );
}
