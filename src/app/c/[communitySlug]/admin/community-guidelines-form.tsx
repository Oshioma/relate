"use client";

import { useActionState } from "react";
import { updateCommunityGuidelines, type CommunityGuidelinesState } from "./actions";
import { RichEditor } from "@/components/ui/rich-editor";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Community } from "@/types/database";

export function CommunityGuidelinesForm({ community }: { community: Community }) {
  const [state, formAction] = useActionState<CommunityGuidelinesState, FormData>(updateCommunityGuidelines, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={community.id} />
      <input type="hidden" name="community_slug" value={community.slug} />

      <p className="text-sm text-muted-foreground">
        House rules or a code of conduct for {community.name}. Members and visitors can read them at{" "}
        <span className="font-medium text-foreground">/c/{community.slug}/guidelines</span>, linked from the community
        sidebar. Leave empty to hide the page.
      </p>

      <RichEditor
        id="community_guidelines"
        name="guidelines"
        rows={10}
        defaultValue={community.guidelines ?? ""}
        placeholder="Be kind. No spam. Keep discussion on-topic…"
      />

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">Guidelines saved.</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save guidelines
      </SubmitButton>
    </form>
  );
}
