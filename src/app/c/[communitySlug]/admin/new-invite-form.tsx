"use client";

import { useActionState, useRef, useEffect } from "react";
import { createInvite, type InviteFormState } from "./invites-actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewInviteForm({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [state, formAction] = useActionState<InviteFormState, FormData>(createInvite, undefined);
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
        <div>
          <Label htmlFor="role">Role granted</Label>
          <select
            id="role"
            name="role"
            defaultValue="member"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="member">Member</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>

        <div>
          <Label htmlFor="max_uses">Max uses (optional)</Label>
          <Input id="max_uses" name="max_uses" type="number" min={1} placeholder="Unlimited" />
        </div>

        <div>
          <Label htmlFor="expires_in_days">Expires in days (optional)</Label>
          <Input id="expires_in_days" name="expires_in_days" type="number" min={1} placeholder="Never" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Creating…" className="w-auto">
        Create invite link
      </SubmitButton>
    </form>
  );
}
