"use client";

import { useActionState, useRef, useEffect } from "react";
import { sendEmailInvite } from "./invites-actions";
import type { InviteFormState } from "./invites-actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewEmailInviteForm({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [state, formAction] = useActionState<InviteFormState, FormData>(sendEmailInvite, undefined);
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

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Label htmlFor="invite_email">Email address</Label>
          <Input id="invite_email" name="email" type="email" required placeholder="friend@example.com" />
        </div>

        <div>
          <Label htmlFor="email_role">Role granted</Label>
          <select
            id="email_role"
            name="role"
            defaultValue="member"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="member">Member</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Sending…" className="w-auto">
        Send email invite
      </SubmitButton>
    </form>
  );
}
