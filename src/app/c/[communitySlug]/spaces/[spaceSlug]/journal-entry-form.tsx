"use client";

import { useActionState, useRef, useEffect } from "react";
import { createJournalEntry, type JournalEntryFormState } from "./journal-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { SpaceJournalField } from "@/types/database";

export function JournalEntryForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  fields,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  fields: SpaceJournalField[];
}) {
  const [state, formAction] = useActionState<JournalEntryFormState, FormData>(createJournalEntry, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
    }
  }, [state]);

  if (fields.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        This journal has no fields set up yet — an admin can add some from this community&apos;s Admin page.
      </p>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      {fields.map((field) => (
        <JournalFieldInput key={field.id} field={field} />
      ))}

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Logging…" className="w-auto">
        Log entry
      </SubmitButton>
    </form>
  );
}

function JournalFieldInput({ field }: { field: SpaceJournalField }) {
  const name = `field:${field.id}`;
  const label = (
    <Label htmlFor={name}>
      {field.label}
      {field.is_required && <span className="text-danger"> *</span>}
    </Label>
  );

  if (field.field_type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name={name} className="h-4 w-4 rounded border-border accent-[var(--accent)]" />
        {field.label}
        {field.is_required && <span className="text-danger">*</span>}
      </label>
    );
  }

  if (field.field_type === "textarea") {
    return (
      <div>
        {label}
        <Textarea id={name} name={name} rows={2} required={field.is_required} />
      </div>
    );
  }

  if (field.field_type === "dropdown") {
    return (
      <div>
        {label}
        <select
          id={name}
          name={name}
          required={field.is_required}
          defaultValue=""
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="" disabled>
            Select…
          </option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.field_type === "multiselect") {
    return (
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-foreground">
          {field.label}
          {field.is_required && <span className="text-danger"> *</span>}
        </legend>
        <div className="flex flex-wrap gap-3">
          {field.options.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 text-sm text-foreground">
              <input type="checkbox" name={name} value={opt} className="h-4 w-4 rounded border-border accent-[var(--accent)]" />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  const inputType = field.field_type === "number" ? "number" : field.field_type === "date" ? "date" : field.field_type === "url" ? "url" : "text";

  return (
    <div>
      {label}
      <Input id={name} name={name} type={inputType} required={field.is_required} />
    </div>
  );
}
