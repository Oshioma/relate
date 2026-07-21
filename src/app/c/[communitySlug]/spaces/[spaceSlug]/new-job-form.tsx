"use client";

import { useActionState, useRef, useEffect } from "react";
import { createJobListing, type JobFormState } from "./jobs-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { JOB_TYPES } from "@/lib/job-types";

export function NewJobForm({
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
  const [state, formAction] = useActionState<JobFormState, FormData>(createJobListing, undefined);
  const formRef = useRef<HTMLFormElement>(null);

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

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="job_title">Title</Label>
          <Input id="job_title" name="title" placeholder="Dive instructor" required />
        </div>
        <div>
          <Label htmlFor="job_type">Type</Label>
          <select
            id="job_type"
            name="job_type"
            defaultValue="full_time"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {JOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="job_description">Description</Label>
        <Textarea id="job_description" name="description" rows={3} placeholder="What's the role, and who's it for?" required />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="job_salary">Salary (optional)</Label>
          <Input id="job_salary" name="salary" placeholder="$18–22/hr, negotiable, …" />
        </div>
        <div>
          <Label htmlFor="job_location_label">Location (optional)</Label>
          <Input id="job_location_label" name="location_label" placeholder="Stone Town" />
        </div>
      </div>

      <div>
        <Label htmlFor="job_apply_url">How to apply (optional)</Label>
        <Input id="job_apply_url" name="apply_url" placeholder="https://… or mailto:jobs@example.com" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="job_lat">Latitude (optional)</Label>
          <Input id="job_lat" name="lat" type="number" step="any" placeholder="-6.1462" />
        </div>
        <div>
          <Label htmlFor="job_lng">Longitude (optional)</Label>
          <Input id="job_lng" name="lng" type="number" step="any" placeholder="39.3621" />
        </div>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">Set both to show this listing on the Explore Map.</p>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Posting…" className="w-auto">
        Post job
      </SubmitButton>
    </form>
  );
}
