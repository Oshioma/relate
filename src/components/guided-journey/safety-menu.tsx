"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Flag, MessageCircle, ShieldOff } from "lucide-react";
import { blockMember } from "@/app/c/[communitySlug]/members/actions";
import { startConversation } from "@/app/messages/actions";
import { reportInJourneySpace } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import { REPORT_REASONS } from "@/lib/guided-journey/config";
import { Textarea } from "@/components/ui/input";
import { DraftForm, Field } from "./draft-form";
import { cn } from "@/lib/utils";

// Report / block / private message for a person in a guided-journey space.
// Blocking and private messages reuse the app's existing member_blocks and
// direct messages; reports go to this space's staff queue.
export function SafetyMenu({
  communitySlug,
  spaceSlug,
  spaceId,
  personId,
  personName,
  journeyId,
  updateId,
  storyId,
  allowMessage = false,
  allowBlock = true,
  className,
}: {
  communitySlug: string;
  spaceSlug: string;
  spaceId: string;
  personId?: string | null;
  personName?: string;
  journeyId?: string;
  updateId?: string;
  storyId?: string;
  allowMessage?: boolean;
  allowBlock?: boolean;
  className?: string;
}) {
  const [reporting, setReporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function block() {
    if (!personId) return;
    if (!window.confirm(`Block ${personName ?? "this member"}? You won't see each other here or be able to message, and any request between you is stopped.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await blockMember(personId, communitySlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function message() {
    if (!personId) return;
    setError(null);
    startTransition(async () => {
      const result = await startConversation(personId);
      if (result.error || !result.conversationId) setError(result.error ?? "Couldn't open a conversation.");
      else router.push(`/messages/${result.conversationId}`);
    });
  }

  return (
    <div className={cn("text-xs", className)}>
      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
        {allowMessage && personId && (
          <button type="button" onClick={message} disabled={isPending} className="inline-flex items-center gap-1 font-medium text-accent hover:underline disabled:opacity-60">
            <MessageCircle className="h-3.5 w-3.5" /> Message privately
          </button>
        )}
        <button type="button" onClick={() => setReporting((v) => !v)} className="inline-flex items-center gap-1 hover:text-foreground" aria-expanded={reporting}>
          <Flag className="h-3.5 w-3.5" /> Report
        </button>
        {allowBlock && personId && (
          <button type="button" onClick={block} disabled={isPending} className="inline-flex items-center gap-1 hover:text-danger disabled:opacity-60">
            <ShieldOff className="h-3.5 w-3.5" /> Block
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-danger">{error}</p>}
      {reporting && (
        <div className="mt-3 rounded-2xl border border-border bg-card p-4 text-sm">
          <DraftForm
            action={reportInJourneySpace}
            draftKey={`journey-report:${spaceId}:${personId ?? ""}:${updateId ?? storyId ?? journeyId ?? ""}`}
            hidden={{
              community_slug: communitySlug,
              space_slug: spaceSlug,
              reported_user_id: personId ?? "",
              journey_id: journeyId ?? "",
              update_id: updateId ?? "",
              story_id: storyId ?? "",
            }}
            submitLabel="Send report"
            pendingLabel="Sending…"
            submitSize="sm"
            className="space-y-3"
            resetOnSuccess
          >
            <Field label="What's wrong?" htmlFor={`report-reason-${personId}-${updateId ?? storyId ?? ""}`}>
              <select
                id={`report-reason-${personId}-${updateId ?? storyId ?? ""}`}
                name="reason"
                required
                defaultValue=""
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>
                  Choose a reason
                </option>
                {REPORT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>
            <Textarea name="details" rows={2} placeholder="Anything the team should know (optional)" aria-label="Details" />
          </DraftForm>
        </div>
      )}
    </div>
  );
}
