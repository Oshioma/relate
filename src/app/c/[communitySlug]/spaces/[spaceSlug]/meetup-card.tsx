"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Gauge, Route, Users, X, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatDateTime } from "@/lib/utils";
import { joinMeetup, leaveMeetup, cancelMeetup, deleteMeetup } from "./meetups-actions";
import { formatMeetupCountdown, isMeetupJoinable, meetupPhase, meetupSpotsLeft } from "@/lib/meetups";
import type { MeetupWithGoing } from "@/lib/data/meetups";

export function MeetupCard({
  data,
  communitySlug,
  spaceSlug,
  canManage,
  canInteract,
  // Recomputed by the board on its own clock, so a card that was "in 20 min"
  // when the page rendered doesn't stay that way.
  now,
}: {
  data: MeetupWithGoing;
  communitySlug: string;
  spaceSlug: string;
  canManage: boolean;
  canInteract: boolean;
  now: number;
}) {
  const { meetup, host, going, goingCount, viewerGoing } = data;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const phase = meetupPhase(meetup, now);
  const spotsLeft = meetupSpotsLeft(meetup, goingCount);
  const isFull = spotsLeft === 0 && !viewerGoing;
  const joinable = isMeetupJoinable(meetup, now) && !isFull;

  function toggleGoing() {
    setError(null);
    startTransition(async () => {
      const result = viewerGoing
        ? await leaveMeetup(meetup.id, communitySlug, spaceSlug)
        : await joinMeetup(meetup.id, communitySlug, spaceSlug);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleCancel() {
    if (!window.confirm(`Call off "${meetup.title}"? Everyone who's coming keeps the notification, so they'll see it's off.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await cancelMeetup(meetup.id, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${meetup.title}"? This can't be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteMeetup(meetup.id, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  const facts = [
    meetup.meeting_point ? { icon: MapPin, text: meetup.meeting_point } : null,
    meetup.duration_minutes ? { icon: Clock, text: meetup.duration_minutes < 60 ? `${meetup.duration_minutes} min` : `${(meetup.duration_minutes / 60).toFixed(1).replace(/\.0$/, "")}h` } : null,
    meetup.distance_km ? { icon: Route, text: `${meetup.distance_km} km` } : null,
    meetup.pace ? { icon: Gauge, text: meetup.pace } : null,
  ].filter((f): f is { icon: typeof MapPin; text: string } => f !== null);

  return (
    <Card className={cn(phase === "now" && "border-accent", phase === "cancelled" && "opacity-70")}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {meetup.activity && <Badge tone="accent">{meetup.activity}</Badge>}
              {phase === "now" && <Badge tone="accent">On now</Badge>}
              {phase === "cancelled" && <Badge tone="danger">Called off</Badge>}
              {phase === "past" && <Badge>Done</Badge>}
            </div>
            <h3 className={cn("mt-1.5 text-sm font-semibold text-foreground", phase === "cancelled" && "line-through")}>{meetup.title}</h3>
            <p className="mt-0.5 text-xs font-medium text-accent">
              {phase === "past" || phase === "cancelled" ? formatDateTime(meetup.starts_at) : `${formatDateTime(meetup.starts_at)} · ${formatMeetupCountdown(meetup, now)}`}
            </p>
          </div>
          {canManage && (
            <div className="flex shrink-0 items-center gap-1.5">
              {meetup.status === "open" && phase !== "past" && (
                <button
                  type="button"
                  title="Call it off"
                  disabled={isPending}
                  onClick={handleCancel}
                  className="text-muted-foreground hover:text-danger disabled:opacity-60"
                >
                  <Ban className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                title="Delete meetup"
                disabled={isPending}
                onClick={handleDelete}
                className="text-muted-foreground hover:text-danger disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {facts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {facts.map((fact) => (
              <span key={fact.text} className="flex items-center gap-1 text-xs text-muted-foreground">
                <fact.icon className="h-3 w-3" />
                {fact.text}
              </span>
            ))}
          </div>
        )}

        {meetup.description && <p className="mt-2 text-sm text-foreground">{meetup.description}</p>}

        {host && (
          <p className="mt-2 text-xs text-muted-foreground">Posted by {host.full_name || host.username}</p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {going.length > 0 && (
              <div className="flex -space-x-2">
                {going.slice(0, 5).map((profile) => (
                  <Avatar key={profile.id} src={profile.avatar_url} name={profile.full_name || profile.username} size={24} className="ring-2 ring-card" />
                ))}
              </div>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {goingCount} going
              {spotsLeft !== null && phase !== "past" && phase !== "cancelled" && ` · ${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left`}
            </span>
          </div>

          {canInteract && (phase === "now" || phase === "soon" || phase === "later") && (
            <Button
              type="button"
              variant={viewerGoing ? "secondary" : "primary"}
              disabled={isPending || (!joinable && !viewerGoing)}
              onClick={toggleGoing}
              className="w-auto shrink-0"
            >
              {viewerGoing ? "Can't make it" : isFull ? "Full" : "I'm in"}
            </Button>
          )}
        </div>

        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </CardContent>
    </Card>
  );
}
