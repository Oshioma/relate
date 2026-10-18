"use client";

import { useState } from "react";
import { respondToRequest } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import { Textarea } from "@/components/ui/input";
import { DraftForm } from "./draft-form";
import { cn } from "@/lib/utils";

// Accept or decline — always the mentor's explicit choice.
export function RequestResponse({
  requestId,
  communitySlug,
  spaceSlug,
  groupJourneys,
  presetGroupJourneyId,
  beginnerName,
}: {
  requestId: string;
  communitySlug: string;
  spaceSlug: string;
  groupJourneys: { id: string; title: string }[];
  presetGroupJourneyId: string | null;
  beginnerName: string;
}) {
  const [decision, setDecision] = useState<"accept" | "decline">("accept");
  return (
    <DraftForm
      action={respondToRequest}
      draftKey={`journey-respond:${requestId}`}
      hidden={{ community_slug: communitySlug, space_slug: spaceSlug, request_id: requestId, decision }}
      submitLabel={decision === "accept" ? `Accept and start with ${beginnerName}` : "Decline kindly"}
      pendingLabel={decision === "accept" ? "Starting…" : "Sending…"}
      className="space-y-3"
      submitVariant={decision === "decline" ? "secondary" : "primary"}
    >
      <div className="inline-flex rounded-full bg-muted p-1 text-sm" role="radiogroup" aria-label="Your answer">
        {(["accept", "decline"] as const).map((d) => (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={decision === d}
            onClick={() => setDecision(d)}
            className={cn("rounded-full px-4 py-1.5 font-medium transition", decision === d ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
          >
            {d === "accept" ? "Accept" : "Decline"}
          </button>
        ))}
      </div>
      {decision === "accept" && groupJourneys.length > 0 && (
        <select
          name="group_journey_id"
          defaultValue={presetGroupJourneyId ?? ""}
          aria-label="Which journey"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Start a new one-to-one journey</option>
          {groupJourneys.map((g) => (
            <option key={g.id} value={g.id}>
              Add to group: {g.title}
            </option>
          ))}
        </select>
      )}
      <Textarea
        name="message"
        rows={2}
        placeholder={decision === "accept" ? "A welcome note (optional)" : "A kind word, e.g. I'm full this season (optional)"}
        aria-label="Message"
      />
    </DraftForm>
  );
}
