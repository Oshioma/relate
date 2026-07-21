"use client";

import { useActionState, useRef, useEffect } from "react";
import { createVolunteerProject, type VolunteerProjectFormState } from "./volunteer-hub-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { VOLUNTEER_CATEGORY_PRESETS } from "@/lib/volunteer-categories";

export function NewVolunteerProjectForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  onDone,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState<VolunteerProjectFormState, FormData>(createVolunteerProject, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div>
        <Label htmlFor="project_title">Title</Label>
        <Input id="project_title" name="title" placeholder="Kendwa Beach Cleanup" required />
      </div>

      <div>
        <Label htmlFor="project_category">Category (optional)</Label>
        <input
          id="project_category"
          name="category"
          ref={categoryInputRef}
          defaultValue=""
          placeholder="Beach Cleanup"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {VOLUNTEER_CATEGORY_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                if (categoryInputRef.current) categoryInputRef.current.value = preset;
              }}
              className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="project_description">What help is needed?</Label>
        <Textarea id="project_description" name="description" rows={3} placeholder="What's the project, and what will volunteers do?" required />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="project_volunteers_needed">Volunteers needed (optional)</Label>
          <Input id="project_volunteers_needed" name="volunteers_needed" type="number" min="1" step="1" placeholder="10" />
        </div>
        <div>
          <Label htmlFor="project_location_label">Location (optional)</Label>
          <Input id="project_location_label" name="location_label" placeholder="Kendwa Beach" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="project_lat">Latitude (optional)</Label>
          <Input id="project_lat" name="lat" type="number" step="any" placeholder="-6.1462" />
        </div>
        <div>
          <Label htmlFor="project_lng">Longitude (optional)</Label>
          <Input id="project_lng" name="lng" type="number" step="any" placeholder="39.3621" />
        </div>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">Set both to show this project on the Explore Map.</p>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Posting…" className="w-auto">
        Post project
      </SubmitButton>
    </form>
  );
}
