"use client";

import { useActionState } from "react";
import { updateCommunityContactInfo, type CommunityContactInfoState } from "./actions";
import { RichEditor } from "@/components/ui/rich-editor";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Community } from "@/types/database";

export function CommunityContactInfoForm({ community }: { community: Community }) {
  const [state, formAction] = useActionState<CommunityContactInfoState, FormData>(updateCommunityContactInfo, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={community.id} />
      <input type="hidden" name="community_slug" value={community.slug} />

      <p className="text-sm text-muted-foreground">
        Shown above the contact form at <span className="font-medium text-foreground">/c/{community.slug}/contact</span>.
        Add a phone or WhatsApp number, opening hours, an address — whatever visitors should see. Messages sent through the
        form land in your notifications. Leave empty to show just the form.
      </p>

      <RichEditor
        id="community_contact_info"
        name="contact_info"
        rows={6}
        defaultValue={community.contact_info ?? ""}
        placeholder="WhatsApp: +44 7000 000000 · Open Mon–Fri, 9–5…"
      />

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">Contact info saved.</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save contact info
      </SubmitButton>
    </form>
  );
}
