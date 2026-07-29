"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Radio, Video, History, LogOut, ShieldCheck, TriangleAlert, CalendarClock, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import {
  startLiveSession,
  scheduleLiveSession,
  goLiveSession,
  endLiveSession,
  deleteLiveSession,
  rsvpToLiveSession,
  cancelLiveRsvp,
} from "./live-events-actions";
import { JitsiRoom } from "./jitsi-room";
import type { LiveSessionWithStarter, LiveRsvpWithAttendee } from "@/lib/data/live-events";

export function LiveEventsView({
  active,
  scheduled,
  past,
  rsvpsBySession,
  currentUserId,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  spaceName,
  isStaff,
  canJoin,
  displayName,
  jaasConfigured,
}: {
  active: LiveSessionWithStarter | null;
  scheduled: LiveSessionWithStarter[];
  past: LiveSessionWithStarter[];
  rsvpsBySession: Record<string, LiveRsvpWithAttendee[]>;
  currentUserId: string;
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  spaceName: string;
  isStaff: boolean;
  // Whether the viewer is an active member (only members join / RSVP).
  canJoin: boolean;
  displayName?: string | null;
  // Whether JaaS env is set — decides which video backend the meeting uses.
  // Shown only to staff as a small status line.
  jaasConfigured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // The room only ever renders inside the `active` branch, so when a session
  // ends and `active` goes null the iframe unmounts on its own. Set true up
  // front when staff go live so the host lands straight in the room.
  const [roomOpen, setRoomOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"now" | "schedule">("now");
  const [scheduledStart, setScheduledStart] = useState("");

  function run(action: () => Promise<{ error: string | null }>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (res.error) {
        setError(res.error);
        return;
      }
      after?.();
      router.refresh();
    });
  }

  function handleStartNow() {
    run(
      () => startLiveSession({ spaceId, communityId, communitySlug, spaceSlug, title: title.trim() || spaceName }),
      () => {
        setTitle("");
        setRoomOpen(true);
      }
    );
  }

  function handleSchedule() {
    if (!scheduledStart) {
      setError("Pick a date and time for the event.");
      return;
    }
    run(
      () => scheduleLiveSession({ spaceId, communityId, communitySlug, spaceSlug, title: title.trim() || spaceName, scheduledStart }),
      () => {
        setTitle("");
        setScheduledStart("");
      }
    );
  }

  function handleGoLive(sessionId: string) {
    run(() => goLiveSession({ sessionId, communitySlug, spaceSlug }), () => setRoomOpen(true));
  }

  function handleEnd(sessionId: string) {
    run(() => endLiveSession({ sessionId, communitySlug, spaceSlug }), () => setRoomOpen(false));
  }

  function handleDelete(sessionId: string) {
    run(() => deleteLiveSession({ sessionId, communitySlug, spaceSlug }));
  }

  function handleRsvp(sessionId: string, going: boolean) {
    run(() =>
      going
        ? cancelLiveRsvp({ sessionId, communitySlug, spaceSlug })
        : rsvpToLiveSession({ sessionId, communityId, communitySlug, spaceSlug })
    );
  }

  const showEmptyState = !active && scheduled.length === 0 && !isStaff;

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}

      {/* Staff-only: which video backend is live, so an admin can confirm the
          JaaS setup took effect without opening DevTools. */}
      {isStaff && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Video backend:</span>
          {jaasConfigured ? (
            <Badge tone="accent" className="gap-1 normal-case">
              <ShieldCheck className="h-3 w-3" /> JaaS · authenticated
            </Badge>
          ) : (
            <Badge tone="neutral" className="gap-1 normal-case" title="Set the JITSI_* env vars to switch to authenticated, unlimited rooms.">
              <TriangleAlert className="h-3 w-3" /> Public demo · 5-min limit
            </Badge>
          )}
        </div>
      )}

      {/* The currently-running session. */}
      {active && (
        <Card className="overflow-hidden border-accent/40">
          <CardContent className="pt-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-danger-foreground">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                    Live
                  </span>
                  <h2 className="truncate text-lg font-semibold text-foreground">{active.title}</h2>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  {active.starter && (
                    <>
                      <Avatar src={active.starter.avatar_url} name={active.starter.full_name || active.starter.username} size={20} />
                      <span>Started by {active.starter.full_name || active.starter.username}</span>
                      <span aria-hidden>·</span>
                    </>
                  )}
                  <span>{formatRelativeTime(active.started_at)}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!roomOpen ? (
                  canJoin ? (
                    <Button type="button" onClick={() => setRoomOpen(true)}>
                      <Video className="h-4 w-4" /> Join now
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">Join this community to take part.</span>
                  )
                ) : (
                  <Button type="button" variant="secondary" onClick={() => setRoomOpen(false)}>
                    <LogOut className="h-4 w-4" /> Leave
                  </Button>
                )}
                {isStaff && (
                  <Button type="button" variant="danger" onClick={() => handleEnd(active.id)} disabled={pending}>
                    End session
                  </Button>
                )}
              </div>
            </div>

            {roomOpen && (
              <div className="mt-4">
                <JitsiRoom
                  roomName={active.room_name}
                  communityId={communityId}
                  displayName={displayName}
                  subject={active.title}
                  onClose={() => setRoomOpen(false)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Staff: start now or schedule ahead. Hidden while a session is live to
          keep the one-session-per-space model simple. */}
      {isStaff && !active && (
        <Card>
          <CardContent className="pt-5">
            <div className="mb-3 inline-flex rounded-md border border-border p-0.5 text-sm">
              <button
                type="button"
                onClick={() => setMode("now")}
                className={cn("rounded px-3 py-1", mode === "now" ? "bg-accent text-accent-foreground" : "text-muted-foreground")}
              >
                Start now
              </button>
              <button
                type="button"
                onClick={() => setMode("schedule")}
                className={cn("rounded px-3 py-1", mode === "schedule" ? "bg-accent text-accent-foreground" : "text-muted-foreground")}
              >
                Schedule
              </button>
            </div>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. ${spaceName} — welcome call`}
              className="mb-2"
            />

            {mode === "now" ? (
              <Button type="button" onClick={handleStartNow} disabled={pending} className="w-full sm:w-auto">
                <Radio className="h-4 w-4" /> {pending ? "Going live…" : "Go live"}
              </Button>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input type="datetime-local" value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} className="sm:max-w-xs" />
                <Button type="button" onClick={handleSchedule} disabled={pending} className="shrink-0">
                  <CalendarClock className="h-4 w-4" /> {pending ? "Scheduling…" : "Schedule event"}
                </Button>
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {mode === "now"
                ? "Members get a “live now — join” notification when you go live."
                : "Members are notified now, can RSVP, and get a “live now” alert when you start."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upcoming scheduled events, soonest first. */}
      {scheduled.length > 0 && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            <CalendarClock className="h-4 w-4" /> Upcoming
          </h2>
          <div className="space-y-3">
            {scheduled.map((session) => {
              const rsvps = rsvpsBySession[session.id] ?? [];
              const going = rsvps.some((r) => r.user_id === currentUserId);
              const visible = rsvps.slice(0, 5);
              return (
                <Card key={session.id}>
                  <CardContent className="pt-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-foreground">{session.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {session.scheduled_start ? formatDateTime(session.scheduled_start) : "Time to be announced"}
                        </p>
                        {session.starter && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Hosted by {session.starter.full_name || session.starter.username}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {canJoin && (
                          <Button
                            type="button"
                            variant={going ? "secondary" : "primary"}
                            onClick={() => handleRsvp(session.id, going)}
                            disabled={pending}
                          >
                            {going ? (
                              <>
                                <Check className="h-4 w-4" /> Going
                              </>
                            ) : (
                              "RSVP"
                            )}
                          </Button>
                        )}
                        {isStaff && (
                          <>
                            <Button type="button" onClick={() => handleGoLive(session.id)} disabled={pending}>
                              <Radio className="h-4 w-4" /> Go live
                            </Button>
                            <button
                              type="button"
                              title="Cancel event"
                              onClick={() => handleDelete(session.id)}
                              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-danger"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {rsvps.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {visible.map((r) => (
                            <Avatar
                              key={r.id}
                              src={r.attendee?.avatar_url}
                              name={r.attendee?.full_name || r.attendee?.username}
                              size={24}
                              className="border-2 border-card"
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {rsvps.length} going{rsvps.length > visible.length ? ` (+${rsvps.length - visible.length} more)` : ""}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {showEmptyState && (
        <EmptyState
          icon={<Radio className="h-6 w-6" />}
          title="No live event right now"
          description="When a host schedules or starts a live event, it'll show up here."
        />
      )}

      {past.length > 0 && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            <History className="h-4 w-4" /> Past sessions
          </h2>
          <div className="space-y-2">
            {past.map((session) => (
              <Card key={session.id}>
                <CardContent className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{session.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.starter ? `Hosted by ${session.starter.full_name || session.starter.username} · ` : ""}
                      Ended {formatRelativeTime(session.ended_at ?? session.started_at)}
                    </p>
                  </div>
                  {isStaff && (
                    <button
                      type="button"
                      title="Remove from history"
                      onClick={() => handleDelete(session.id)}
                      className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
