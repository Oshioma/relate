"use client";

import { useActionState } from "react";
import { saveProfileFieldValues, type ProfileFieldValuesFormState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ProfileFieldWithValue } from "@/lib/data/community-profile-fields";

function FieldInput({ field }: { field: ProfileFieldWithValue }) {
  const name = `field_${field.id}`;

  switch (field.field_type) {
    case "textarea":
      return <Textarea id={name} name={name} rows={3} defaultValue={typeof field.value === "string" ? field.value : ""} />;
    case "number":
      return (
        <Input
          id={name}
          name={name}
          type="number"
          defaultValue={typeof field.value === "number" ? field.value : ""}
        />
      );
    case "date":
      return <Input id={name} name={name} type="date" defaultValue={typeof field.value === "string" ? field.value : ""} />;
    case "url":
      return <Input id={name} name={name} type="url" defaultValue={typeof field.value === "string" ? field.value : ""} placeholder="https://…" />;
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            id={name}
            name={name}
            defaultChecked={field.value === true}
            className="h-4 w-4 rounded border-border accent-[var(--accent)]"
          />
          Yes
        </label>
      );
    case "dropdown":
      return (
        <select
          id={name}
          name={name}
          defaultValue={typeof field.value === "string" ? field.value : ""}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <option value="">Select…</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case "multiselect": {
      const selected = Array.isArray(field.value) ? field.value : [];
      return (
        <div className="space-y-1.5">
          {field.options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name={name}
                value={option}
                defaultChecked={selected.includes(option)}
                className="h-4 w-4 rounded border-border accent-[var(--accent)]"
              />
              {option}
            </label>
          ))}
        </div>
      );
    }
    default:
      return <Input id={name} name={name} defaultValue={typeof field.value === "string" ? field.value : ""} />;
  }
}

export function ProfileFieldAnswersForm({
  communityId,
  communitySlug,
  username,
  fields,
}: {
  communityId: string;
  communitySlug: string;
  username: string;
  fields: ProfileFieldWithValue[];
}) {
  const [state, formAction] = useActionState<ProfileFieldValuesFormState, FormData>(saveProfileFieldValues, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="username" value={username} />

      {fields.map((field) => (
        <div key={field.id}>
          {field.field_type !== "checkbox" && (
            <Label htmlFor={`field_${field.id}`}>
              {field.label}
              {field.is_required && <span className="text-danger"> *</span>}
            </Label>
          )}
          <FieldInput field={field} />
        </div>
      ))}

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save answers
      </SubmitButton>
    </form>
  );
}
