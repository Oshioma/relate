"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { joinChallenge, leaveChallenge, deleteChallenge } from "./challenges-actions";
import type { ChallengeWithParticipants } from "@/lib/data/challenges";

function challengeStatus(startDate: string, endDate: string): { label: string; tone: "accent" | "neutral" | "danger" } {
  const today = new Date().toISOString().slice(0, 10);
  if (today < startDate) return { label: "Upcoming", tone: "neutral" };
  if (today > endDate) return { label: "Ended", tone: "danger" };
  return { label: "In progress", tone: "accent" };
}

export function ChallengeCard({
  data,
  communitySlug,
  spaceSlug,
  canManage,
  canInteract,
}: {
  data: ChallengeWithParticipants;
  communitySlug: string;
  spaceSlug: string;
  canManage: boolean;
  canInteract: boolean;
}) {
  const { challenge, participants, participantCount, viewerJoined } = data;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const status = challengeStatus(challenge.start_date, challenge.end_date);

  function toggleParticipation() {
    setError(null);
    startTransition(async () => {
      const result = viewerJoined
        ? await leaveChallenge(challenge.id, communitySlug, spaceSlug)
        : await joinChallenge(challenge.id, communitySlug, spaceSlug);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${challenge.title}"? This can't be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteChallenge(challenge.id, communitySlug, spaceSlug);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{challenge.title}</h3>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(challenge.start_date)} – {formatDate(challenge.end_date)}
            </p>
          </div>
          {canManage && (
            <button
              type="button"
              title="Delete challenge"
              disabled={isPending}
              onClick={handleDelete}
              className="shrink-0 text-muted-foreground hover:text-danger disabled:opacity-60"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {challenge.description && <p className="mt-2 text-sm text-foreground">{challenge.description}</p>}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {participants.length > 0 && (
              <div className="flex -space-x-2">
                {participants.slice(0, 5).map((profile) => (
                  <Avatar
                    key={profile.id}
                    src={profile.avatar_url}
                    name={profile.full_name || profile.username}
                    size={24}
                    className="ring-2 ring-card"
                  />
                ))}
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>

          {canInteract && (
            <Button type="button" variant={viewerJoined ? "secondary" : "primary"} disabled={isPending} onClick={toggleParticipation}>
              {viewerJoined ? "Leave" : "Join"}
            </Button>
          )}
        </div>

        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </CardContent>
    </Card>
  );
}
