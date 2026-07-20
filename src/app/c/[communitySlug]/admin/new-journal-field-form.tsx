"use client";

import { useActionState, useState } from "react";
import { createJournalField, type JournalFieldFormState } from "./journal-fields-actions";
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

export function NewJournalFieldForm({
  spaceId,
  communitySlug,
  spaceSlug,
}: {
  spaceId: string;
  communitySlug: string;
  spaceSlug: string;
}) {
  const [state, formAction] = useActionState<JournalFieldFormState, FormData>(createJournalField, undefined);
  const [fieldType, setFieldType] = useState<ProfileFieldType>("text");

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`journal-label-${spaceId}`}>Field label</Label>
          <Input id={`journal-label-${spaceId}`} name="label" required placeholder="Crop" />
        </div>
        <div>
          <Label htmlFor={`journal-type-${spaceId}`}>Type</Label>
          <select
            id={`journal-type-${spaceId}`}
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
          <Label htmlFor={`journal-options-${spaceId}`}>Options (comma-separated)</Label>
          <Input id={`journal-options-${spaceId}`} name="options" placeholder="Sunny, Cloudy, Rainy" />
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
