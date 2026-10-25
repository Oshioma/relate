"use client";

import { useState } from "react";
import { sendEmailInvite } from "./invites-actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormDraft } from "@/lib/use-form-draft";

export function NewEmailInviteForm({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [error, setError] = useState<string | null>(null);
  // What's typed survives a refresh until the invite is sent.
  const { formRef, clearDraft } = useFormDraft(`email-invite:${communityId}`);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await sendEmailInvite(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      clearDraft();
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor="invite_email">Email address</Label>
          <Input id="invite_email" name="email" type="email" required placeholder="friend@example.com" />
        </div>

        <div>
          <Label htmlFor="invite_first_name">First name (optional)</Label>
          <Input id="invite_first_name" name="first_name" maxLength={80} placeholder="Amina" />
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

      <p className="text-xs text-muted-foreground">
        The first name fills {"{First_Name}"} in your own invite wording (Admin → Emails). The invite is single-use
        and expires after 14 days. If it lapses, the recipient can still tap the link and join
        from the community&apos;s page (when it&apos;s public).
      </p>
    </form>
  );
}
