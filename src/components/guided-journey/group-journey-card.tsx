"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { requestAdoption } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import type { OpenGroupJourney } from "@/lib/data/guided-journey";
import { Textarea } from "@/components/ui/input";
import { DraftForm } from "./draft-form";
import { JourneyImage } from "./journey-image";

export function GroupJourneyCard({
  journey,
  mentorName,
  communitySlug,
  spaceSlug,
  spaceId,
  pending,
}: {
  journey: OpenGroupJourney;
  mentorName: string;
  communitySlug: string;
  spaceSlug: string;
  spaceId: string;
  pending: boolean;
}) {
  const [sent, setSent] = useState(pending);
  const placesLeft = journey.max_beginners === null ? null : journey.max_beginners - journey.beginnerCount;
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card">
      <JourneyImage src={journey.cover_image_url} alt="" aspect="aspect-[16/9]" rounded="rounded-none" sizes="(min-width: 1024px) 30vw, 100vw" />
      <div className="p-5">
        <h3 className="font-semibold text-foreground">{journey.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">with {mentorName}</p>
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-accent">
          <Users className="h-3.5 w-3.5" />
          {journey.beginnerCount} joined{placesLeft !== null ? ` · ${placesLeft} ${placesLeft === 1 ? "place" : "places"} left` : ""}
        </p>
        {sent ? (
          <p className="mt-4 rounded-full bg-accent-soft px-4 py-2 text-center text-sm font-medium text-accent">Asked to join — waiting for a reply</p>
        ) : (
          <DraftForm
            action={requestAdoption}
            draftKey={`journey-group:${spaceId}:${journey.id}`}
            hidden={{ community_slug: communitySlug, space_slug: spaceSlug, mentor_id: journey.mentor_id, requested_journey_id: journey.id }}
            submitLabel="Ask to join"
            pendingLabel="Sending…"
            submitClassName="w-full"
            className="mt-4 space-y-3"
            onSuccess={() => setSent(true)}
          >
            <Textarea name="message" rows={2} placeholder="A quick hello (optional)" aria-label="Message" />
          </DraftForm>
        )}
      </div>
    </article>
  );
}
