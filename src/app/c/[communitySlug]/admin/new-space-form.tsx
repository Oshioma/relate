"use client";

import { useRef, useState } from "react";
import { createSpace } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { SPACE_TYPES, groupSpaceTypesByCategory } from "@/lib/space-types";
import type { SpaceType } from "@/types/database";

export function NewSpaceForm({
  communityId,
  communitySlug,
  allowedTypes,
}: {
  communityId: string;
  communitySlug: string;
  // The space types this community may add, as regulated by the super admin.
  allowedTypes: SpaceType[];
}) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Group the allowed types under their categories for the picker.
  const groups = groupSpaceTypesByCategory(allowedTypes.map((t) => SPACE_TYPES[t]));
  const defaultType = allowedTypes.includes("discussion") ? "discussion" : allowedTypes[0];

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createSpace(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
  }

  if (allowedTypes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        No space types are available to this community yet. Ask the platform admin to enable some.
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />

      <div>
        <Label htmlFor="space_name">Name</Label>
        <Input id="space_name" name="name" placeholder="Announcements" required />
      </div>

      <div>
        <Label htmlFor="space_description">Description (optional)</Label>
        <Textarea id="space_description" name="description" rows={2} />
      </div>

      <div>
        <Label htmlFor="space_type">Type</Label>
        <select
          id="space_type"
          name="space_type"
          defaultValue={defaultType}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {groups.map((group) => (
            <optgroup key={group.category.key} label={group.category.label}>
              {group.types.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="visibility">Who can see it</Label>
        <select
          id="visibility"
          name="visibility"
          defaultValue="members"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="public">Public — anyone, even non-members</option>
          <option value="members">Members — active members only</option>
          <option value="private">Private — owners, admins &amp; moderators only</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="show_in_nav" defaultChecked className="h-4 w-4 rounded border-border" />
        Show in left navigation
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Creating…" className="w-auto">
        Create space
      </SubmitButton>
    </form>
  );
}
