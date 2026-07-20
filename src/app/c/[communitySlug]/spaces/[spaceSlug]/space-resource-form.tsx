"use client";

import { useActionState, useRef, useEffect } from "react";
import { createResource, type ResourceFormState } from "../../resources/actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function SpaceResourceForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
}) {
  const [state, formAction] = useActionState<ResourceFormState, FormData>(createResource, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

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
          <Input id="url" name="url" type="url" placeholder="https://…" required />
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

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Adding…" className="w-auto">
        Add resource
      </SubmitButton>
    </form>
  );
}
