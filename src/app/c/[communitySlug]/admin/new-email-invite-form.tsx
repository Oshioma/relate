"use client";

import { useRef, useState } from "react";
import { sendEmailInvite } from "./invites-actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewEmailInviteForm({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await sendEmailInvite(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
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
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Sending…" className="w-auto">
        Send email invite
      </SubmitButton>
    </form>
  );
}
