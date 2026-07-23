"use client";

import { useActionState } from "react";
import { updateCommunityDetails, type CommunityDetailsState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { PLACE_LOCATION_TYPES } from "@/lib/community-templates";
import type { Community } from "@/types/database";

export function CommunityDetailsForm({ community }: { community: Community }) {
  const [state, formAction] = useActionState<CommunityDetailsState, FormData>(updateCommunityDetails, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={community.id} />
      <input type="hidden" name="community_slug" value={community.slug} />

      <div>
        <Label htmlFor="community_name">Name</Label>
        <Input id="community_name" name="name" defaultValue={community.name} required />
      </div>

      <div>
        <Label htmlFor="community_description">Description</Label>
        <Textarea id="community_description" name="description" rows={2} defaultValue={community.description ?? ""} />
      </div>

      <div>
        <Label htmlFor="community_location">Location</Label>
        <Input
          id="community_location"
          name="location_name"
          defaultValue={community.location_name ?? ""}
          placeholder="Zanzibar, Tanzania"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          The place this community is about. Used by AI event discovery, the map, and live tides &amp; weather.
        </p>
      </div>

      <div>
        <Label htmlFor="community_location_type">Kind of place</Label>
        <select
          id="community_location_type"
          name="location_type"
          defaultValue={community.location_type ?? ""}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Not a specific place</option>
          {PLACE_LOCATION_TYPES.map((lt) => (
            <option key={lt.key} value={lt.key}>
              {lt.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          Islands and coastal areas get live tide times alongside their weather.
        </p>
      </div>

      <div className="border-t border-border pt-3">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="events_public"
            defaultChecked={community.events_public}
            className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)]"
          />
          <span>
            <span className="block font-medium text-foreground">Show events publicly</span>
            <span className="block text-muted-foreground">
              Let signed-out visitors see this community&apos;s events before logging in. They still
              can&apos;t RSVP or add events without an account.
            </span>
          </span>
        </label>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save
      </SubmitButton>
    </form>
  );
}
