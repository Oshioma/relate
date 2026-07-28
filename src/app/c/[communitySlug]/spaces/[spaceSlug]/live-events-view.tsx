"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Radio, Video, History, LogOut, ShieldCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeTime } from "@/lib/utils";
import { startLiveSession, endLiveSession } from "./live-events-actions";
import { JitsiRoom } from "./jitsi-room";
import type { LiveSessionWithStarter } from "@/lib/data/live-events";

export function LiveEventsView({
  active,
  past,
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
  past: LiveSessionWithStarter[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  spaceName: string;
  isStaff: boolean;
  // Whether the viewer is an active member (only members join the meeting).
  canJoin: boolean;
  displayName?: string | null;
  // Whether JaaS env is set — decides which video backend the meeting uses.
  // Shown only to staff as a small status line.
  jaasConfigured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Whether the viewer has the meeting open. The room only ever renders inside
  // the `active` branch, so when a session ends and `active` goes null the
  // iframe unmounts on its own — no cleanup effect needed. Set it true up front
  // when staff go live so the host lands straight in the room once the
  // refreshed data brings the new session down as a prop.
  const [roomOpen, setRoomOpen] = useState(false);
  const [title, setTitle] = useState("");

  function handleStart() {
    setError(null);
    startTransition(async () => {
      const res = await startLiveSession({
        spaceId,
        communityId,
        communitySlug,
        spaceSlug,
        title: title.trim() || spaceName,
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      setTitle("");
      setRoomOpen(true);
      router.refresh();
    });
  }

  function handleEnd(sessionId: string) {
    setError(null);
    startTransition(async () => {
      const res = await endLiveSession({ sessionId, communitySlug, spaceSlug });
      if (res.error) {
        setError(res.error);
        return;
      }
      setRoomOpen(false);
      router.refresh();
    });
  }

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

      {active ? (
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
      ) : isStaff ? (
        <Card>
          <CardContent className="pt-5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Radio className="h-4 w-4 text-muted-foreground" /> Start a live session
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Go live and members can join a video meeting right here. Give it a name so people know what it&apos;s about.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g. ${spaceName} — welcome call`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleStart();
                }}
              />
              <Button type="button" onClick={handleStart} disabled={pending} className="shrink-0">
                <Radio className="h-4 w-4" /> {pending ? "Going live…" : "Go live"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={<Radio className="h-6 w-6" />}
          title="No live event right now"
          description="When a host goes live, a Join button will appear here."
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
