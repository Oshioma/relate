"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { AccessSelector } from "@/components/community/access-selector";
import type { AccessCommunity, AccessSpace, AccessTier } from "@/lib/access/model";
import { updateSpaceAccess, type SpaceFormState } from "../actions";

// "Change" on an overview row: the same access picker as the space editor, so
// narrowing names who loses access and widening needs ticking a confirmation
// before the form will submit.
export function SpaceAccessEditor({
  space,
  tiers,
  community,
  communitySlug,
  paymentsEnabled,
}: {
  space: AccessSpace;
  tiers: AccessTier[];
  community: AccessCommunity;
  communitySlug: string;
  paymentsEnabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  // Close once a save has gone through; the page re-renders with the new rows.
  const [state, formAction] = useActionState<SpaceFormState, FormData>(async (prev, formData) => {
    const result = await updateSpaceAccess(prev, formData);
    if (!result) setOpen(false);
    return result;
  }, undefined);

  if (!open) {
    return (
      <Button variant="ghost" className="h-8 px-2 text-xs" onClick={() => setOpen(true)} aria-label={`Change who can open ${space.name}`}>
        <Pencil className="h-3.5 w-3.5" />
        Change
      </Button>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-3 rounded-lg border border-border bg-card p-3">
      <input type="hidden" name="space_id" value={space.id} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <AccessSelector idPrefix={`overview-${space.id}`} space={space} tiers={tiers} community={community} paymentsEnabled={paymentsEnabled} />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <div className="flex items-center gap-2">
        <SubmitButton pendingText="Saving…" className="w-auto">
          Save
        </SubmitButton>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
