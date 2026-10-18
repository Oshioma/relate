"use client";

import { createGroupJourney } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import type { JourneyTemplate } from "@/types/database";
import { Input } from "@/components/ui/input";
import { DraftForm, Field } from "./draft-form";

export function GroupJourneyForm({
  communitySlug,
  spaceSlug,
  spaceId,
  templates,
  capacity,
}: {
  communitySlug: string;
  spaceSlug: string;
  spaceId: string;
  templates: JourneyTemplate[];
  capacity: number;
}) {
  return (
    <DraftForm
      action={createGroupJourney}
      draftKey={`journey-group-new:${spaceId}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug }}
      submitLabel="Open group journey"
      pendingLabel="Opening…"
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_8rem]">
        <Field label="Title" htmlFor="gj-group-title">
          <Input id="gj-group-title" name="title" placeholder="e.g. Spring salad club" />
        </Field>
        <Field label="Starting point" htmlFor="gj-group-tpl">
          <select id="gj-group-tpl" name="template_id" defaultValue="" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">Default milestones</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Places" htmlFor="gj-group-max">
          <Input id="gj-group-max" name="max_beginners" type="number" min={1} max={20} defaultValue={capacity} />
        </Field>
      </div>
    </DraftForm>
  );
}
