"use client";

import { useActionState, useState } from "react";
import { createProfileField, type ProfileFieldFormState } from "./profile-fields-actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ProfileFieldType } from "@/types/database";

const FIELD_TYPE_OPTIONS: { value: ProfileFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Long text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown (single choice)" },
  { value: "multiselect", label: "Multi-select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "url", label: "URL" },
];

const OPTIONS_TYPES: ProfileFieldType[] = ["dropdown", "multiselect"];

export function NewProfileFieldForm({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [state, formAction] = useActionState<ProfileFieldFormState, FormData>(createProfileField, undefined);
  const [fieldType, setFieldType] = useState<ProfileFieldType>("text");

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="label">Field label</Label>
          <Input id="label" name="label" required placeholder="Farm size (acres)" />
        </div>
        <div>
          <Label htmlFor="field_type">Type</Label>
          <select
            id="field_type"
            name="field_type"
            value={fieldType}
            onChange={(event) => setFieldType(event.target.value as ProfileFieldType)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {FIELD_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {OPTIONS_TYPES.includes(fieldType) && (
        <div>
          <Label htmlFor="options">Options (comma-separated)</Label>
          <Input id="options" name="options" placeholder="Under 1, 1-5, 5-20, Over 20" />
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="is_required" className="h-4 w-4 rounded border-border accent-[var(--accent)]" />
        Required
      </label>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add field
      </SubmitButton>
    </form>
  );
}
