"use client";

import { useActionState } from "react";
import { updateCommunityDetails, type CommunityDetailsState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Community } from "@/types/database";

export function CommunityDetailsForm({ community }: { community: Community }) {
  const [state, formAction] = useActionState<CommunityDetailsState, FormData>(updateCommunityDetails, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={community.id} />
      <input type="hidden" name="community_slug" value={community.slug} />

      <div>
        <Label htmlFor="community_name">Name</Label>
        <Input id="community_name" name="name" defaultValue={community.name} required />
      </div>

      <div>
        <Label htmlFor="community_description">Description</Label>
        <Textarea id="community_description" name="description" rows={2} defaultValue={community.description ?? ""} />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save
      </SubmitButton>
    </form>
  );
}
