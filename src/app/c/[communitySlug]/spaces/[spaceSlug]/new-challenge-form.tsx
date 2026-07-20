"use client";

import { useActionState, useRef, useEffect } from "react";
import { createChallenge, type ChallengeFormState } from "./challenges-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewChallengeForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
}) {
  const [state, formAction] = useActionState<ChallengeFormState, FormData>(createChallenge, undefined);
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
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div>
        <Label htmlFor="challenge_title">Title</Label>
        <Input id="challenge_title" name="title" placeholder="30-Day Writing Sprint" required />
      </div>

      <div>
        <Label htmlFor="challenge_description">Description (optional)</Label>
        <Textarea id="challenge_description" name="description" rows={2} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="start_date">Start date</Label>
          <Input id="start_date" name="start_date" type="date" required />
        </div>
        <div>
          <Label htmlFor="end_date">End date</Label>
          <Input id="end_date" name="end_date" type="date" required />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Creating…" className="w-auto">
        Create challenge
      </SubmitButton>
    </form>
  );
}
