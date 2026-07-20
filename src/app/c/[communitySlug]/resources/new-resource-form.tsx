"use client";

import { useActionState, useRef, useEffect } from "react";
import { createResource, type ResourceFormState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Space } from "@/types/database";

interface NewResourceFormProps {
  communityId: string;
  communitySlug: string;
  spaces: Space[];
}

export function NewResourceForm({ communityId, communitySlug, spaces }: NewResourceFormProps) {
  const [state, formAction] = useActionState<ResourceFormState, FormData>(createResource, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
    }
  }, [state]);

  if (spaces.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        Create a space first, then come back to add resources to it.
      </p>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />

      <div>
        <Label htmlFor="resource_title">Title</Label>
        <Input id="resource_title" name="title" placeholder="Companion planting guide" required />
      </div>

      <div>
        <Label htmlFor="resource_description">Description (optional)</Label>
        <Textarea id="resource_description" name="description" rows={2} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="url">URL</Label>
          <Input id="url" name="url" type="text" placeholder="example.com" required />
        </div>
        <div>
          <Label htmlFor="resource_type">Type</Label>
          <select
            id="resource_type"
            name="resource_type"
            defaultValue="link"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="link">Link</option>
            <option value="file">File</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="space_id">Space</Label>
        <select
          id="space_id"
          name="space_id"
          defaultValue={spaces[0]?.id}
          required
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {spaces.map((space) => (
            <option key={space.id} value={space.id}>
              {space.name}
            </option>
          ))}
        </select>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add resource
      </SubmitButton>
    </form>
  );
}
