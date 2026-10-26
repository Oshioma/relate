"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Radio, Video, History, LogOut, ShieldCheck, TriangleAlert, CalendarClock, Trash2, Check, UserPlus, Mail, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { useFormDraft, clearFormDraft } from "@/lib/use-form-draft";
import { createClient } from "@/lib/supabase/client";
import { LIVE_HEARTBEAT_MS, LIVE_STALE_AFTER_MINUTES } from "@/lib/live-heartbeat";
import {
  startLiveSession,
  scheduleLiveSession,
  goLiveSession,
  updateLiveSession,
  endLiveSession,
  deleteLiveSession,
  rsvpToLiveSession,
  cancelLiveRsvp,
  saveLiveSessionSnapshot,
} from "./live-events-actions";
import { JitsiRoom } from "./jitsi-room";
import { LiveSessionFields, localInputToIso } from "./live-session-fields";
import { InviteMembersModal } from "./invite-members-modal";
import { MessageMembersModal } from "./message-members-modal";
import type { LiveSessionWithStarter, LiveRsvpWithAttendee, LiveInviteWithMember } from "@/lib/data/live-events";
import type { Profile } from "@/types/database";

export function LiveEventsView({
  active,
  scheduled,
  past,
  rsvpsBySession,
  invitesBySession,
  inviteMembers,
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
  autoJoin = false,
}: {
  active: LiveSessionWithStarter | null;
  scheduled: LiveSessionWithStarter[];
  past: LiveSessionWithStarter[];
  rsvpsBySession: Record<string, LiveRsvpWithAttendee[]>;
  // Hand-picked invites per session (active + scheduled).
  invitesBySession: Record<string, LiveInviteWithMember[]>;
  // Community members that populate the invite picker — staff-only, [] otherwise.
  inviteMembers: Profile[];
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
  // Open the room straight away (the page was reached through a "Join now" /
  // "Live now!" link), so there's no second Join click.
  autoJoin?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // The room only ever renders inside the `active` branch, so when a session
  // ends and `active` goes null the iframe unmounts on its own. Set true up
  // front when staff go live so the host lands straight in the room.
  // Also true on arrival from a "Join now" link (autoJoin) for anyone who can
  // take part.
  const [roomOpen, setRoomOpen] = useState(autoJoin && canJoin);
  // A "Join now" link followed while already on this page changes the prop
  // without remounting; open the room then too. Adjusted during render, not in
  // an effect, as React recommends for resetting state on a prop change.
  const [prevAutoJoin, setPrevAutoJoin] = useState(autoJoin);
  if (prevAutoJoin !== autoJoin) {
    setPrevAutoJoin(autoJoin);
    if (autoJoin && canJoin) setRoomOpen(true);
  }
  // The scheduled session whose edit form is open, if any.
  const [editingId, setEditingId] = useState<string | null>(null);
  // The session the "invite members" picker is currently open for, if any.
  const [inviteFor, setInviteFor] = useState<LiveSessionWithStarter | null>(null);
  // Whether the "email members" composer is open.
  const [messageOpen, setMessageOpen] = useState(false);
  // Staff who just left the meeting get a reminder to end the session, since
  // leaving the call doesn't end it for everyone.
  const [hostLeft, setHostLeft] = useState(false);

  // While the meeting is open here, tell the database someone is still in it.
  // A Supabase cron job ends live sessions nobody has been in for a while (see
  // end_stale_live_sessions), so a host who closes the tab without pressing
  // End session doesn't leave "Live now!" on for everyone.
  const heartbeatSessionId = roomOpen && active ? active.id : null;
  useEffect(() => {
    if (!heartbeatSessionId) return;
    const supabase = createClient();
    const beat = () => void supabase.rpc("touch_live_session", { p_session_id: heartbeatSessionId });
    beat();
    const timer = setInterval(beat, LIVE_HEARTBEAT_MS);
    return () => clearInterval(timer);
  }, [heartbeatSessionId]);

  function closeRoom() {
    setRoomOpen(false);
    if (isStaff) setHostLeft(true);
  }

  function openRoom() {
    setRoomOpen(true);
    setHostLeft(false);
  }

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

  function handleCompose(e: React.FormEvent<HTMLFormElement>, mode: ComposerMode, clearDraft: () => void) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = readSessionFields(form);
    const title = fields.title || spaceName;
    const reset = () => {
      clearDraft();
      form.reset();
    };

    if (mode === "now") {
      run(
        () => startLiveSession({ spaceId, communityId, communitySlug, spaceSlug, ...fields, title }),
        () => {
          reset();
          setRoomOpen(true);
        }
      );
      return;
    }

    if (!fields.scheduledStart) {
      setError("Pick a date and time for the event.");
      return;
    }
    run(() => scheduleLiveSession({ spaceId, communityId, communitySlug, spaceSlug, ...fields, title }), reset);
  }

  function handleEdit(e: React.FormEvent<HTMLFormElement>, sessionId: string) {
    e.preventDefault();
    const fields = readSessionFields(e.currentTarget);
    if (!fields.scheduledStart) {
      setError("Pick a date and time for the event.");
      return;
    }
    run(
      () => updateLiveSession({ sessionId, communitySlug, spaceSlug, ...fields, title: fields.title || spaceName }),
      () => {
        clearFormDraft(editDraftKey(sessionId));
        setEditingId(null);
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

  // Prefill the "Email members" composer from the session context: a live-now
  // shout with a join link, or the soonest upcoming one with a link that signs
  // the reader up for the 10-minutes-before reminder. `scheduled` is sorted
  // soonest-first, so [0] is the next event.
  const soonest = scheduled[0];
  // `message` is the human line; `link` is a relative path. The composer turns
  // the link into a full URL and drops it on its own line in the prefilled
  // body, so staff see exactly what recipients get and can edit before sending.
  const messageAutofill = active
    ? {
        subject: `We're going live now — ${active.title}`,
        message: `We're going live now in ${spaceName} — join us:`,
        link: `/c/${communitySlug}/spaces/${spaceSlug}`,
      }
    : soonest
    ? {
        subject: `Live soon: ${soonest.title}`,
        message: soonest.scheduled_start
          ? `We're scheduled to go live at ${formatDateTime(soonest.scheduled_start)}. Get an email reminder 10 minutes before we start:`
          : `We're scheduling a live session soon. Get an email reminder before we start:`,
        link: `/c/${communitySlug}/spaces/${spaceSlug}/remind/${soonest.id}`,
      }
    : null;

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}

      {/* Staff-only toolbar: the active video backend (so an admin can confirm
          the JaaS setup without DevTools) plus a shortcut to email members. */}
      {isStaff && (
        <div className="flex flex-wrap items-center justify-between gap-3">
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
          {/* Only offer "Email members" once there's actually a live or
              scheduled session to tell them about — messageAutofill is non-null
              exactly in that case. */}
          {messageAutofill && (
            <Button type="button" variant="secondary" size="sm" onClick={() => setMessageOpen(true)}>
              <Mail className="h-4 w-4" /> Email members
            </Button>
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
                {active.description && (
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{active.description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!roomOpen ? (
                  canJoin ? (
                    <Button type="button" onClick={openRoom}>
                      <Video className="h-4 w-4" /> Join now
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">Join this community to take part.</span>
                  )
                ) : (
                  <Button type="button" variant="secondary" onClick={closeRoom}>
                    <LogOut className="h-4 w-4" /> Leave
                  </Button>
                )}
                {isStaff && (
                  <>
                    <Button type="button" variant="secondary" onClick={() => setInviteFor(active)} disabled={pending}>
                      <UserPlus className="h-4 w-4" /> Invite
                    </Button>
                    <Button type="button" variant="danger" onClick={() => handleEnd(active.id)} disabled={pending}>
                      End session
                    </Button>
                  </>
                )}
              </div>
            </div>

            {hostLeft && !roomOpen && (
              <p className="mt-3 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-foreground">
                You&apos;ve left the meeting, but it&apos;s still showing as live to members. If it&apos;s over, press End
                session. Otherwise it ends by itself about {LIVE_STALE_AFTER_MINUTES} minutes after everyone has left.
              </p>
            )}

            <InvitedRow invites={invitesBySession[active.id] ?? []} isStaff={isStaff} />

            {roomOpen && (
              <div className="mt-4">
                <JitsiRoom
                  roomName={active.room_name}
                  communityId={communityId}
                  displayName={displayName}
                  subject={active.title}
                  onClose={closeRoom}
                  onSnapshot={
                    isStaff
                      ? (image) =>
                          void saveLiveSessionSnapshot({
                            sessionId: active.id,
                            communitySlug,
                            spaceSlug,
                            image,
                          })
                      : undefined
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Staff: start now or schedule ahead. Hidden while a session is live to
          keep the one-session-per-space model simple. */}
      {isStaff && !active && <SessionComposer spaceId={spaceId} spaceName={spaceName} pending={pending} onSubmit={handleCompose} />}

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
                <Card key={session.id} className="overflow-hidden">
                  {session.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.image_url} alt="" className="h-40 w-full object-cover" />
                  )}
                  <CardContent className="pt-5">
                    {editingId === session.id ? (
                      <EditSessionForm
                        session={session}
                        spaceName={spaceName}
                        pending={pending}
                        onSubmit={(e) => handleEdit(e, session.id)}
                        onCancel={() => {
                          clearFormDraft(editDraftKey(session.id));
                          setEditingId(null);
                        }}
                      />
                    ) : (
                      <>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-foreground">{session.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {session.scheduled_start ? formatTimeRange(session.scheduled_start, session.scheduled_end) : "Time to be announced"}
                            </p>
                            {session.starter && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                Hosted by {session.starter.full_name || session.starter.username}
                              </p>
                            )}
                            {session.description && (
                              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{session.description}</p>
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
                                <Button type="button" variant="secondary" onClick={() => setInviteFor(session)} disabled={pending}>
                                  <UserPlus className="h-4 w-4" /> Invite
                                </Button>
                                <Button type="button" onClick={() => handleGoLive(session.id)} disabled={pending}>
                                  <Radio className="h-4 w-4" /> Go live
                                </Button>
                                <button
                                  type="button"
                                  title="Edit event"
                                  onClick={() => setEditingId(session.id)}
                                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
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

                        <InvitedRow invites={invitesBySession[session.id] ?? []} isStaff={isStaff} />

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
                      </>
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((session) => (
              <PastSessionCard
                key={session.id}
                session={session}
                isStaff={isStaff}
                onDelete={() => handleDelete(session.id)}
                pending={pending}
              />
            ))}
          </div>
        </div>
      )}

      {/* Staff member-invite picker for the chosen session. */}
      {inviteFor && (
        <InviteMembersModal
          sessionId={inviteFor.id}
          sessionTitle={inviteFor.title}
          isLive={inviteFor.status === "live"}
          communityId={communityId}
          communitySlug={communitySlug}
          spaceSlug={spaceSlug}
          members={inviteMembers}
          alreadyInvitedIds={(invitesBySession[inviteFor.id] ?? []).map((i) => i.user_id)}
          currentUserId={currentUserId}
          onClose={() => setInviteFor(null)}
        />
      )}

      {/* Staff composer: email a message to selected members. */}
      {messageOpen && (
        <MessageMembersModal
          communityId={communityId}
          communitySlug={communitySlug}
          members={inviteMembers}
          currentUserId={currentUserId}
          autofill={messageAutofill}
          onClose={() => setMessageOpen(false)}
        />
      )}
    </div>
  );
}

// A past session rendered as a card: a video-tile header with a "replay"-style
// glyph, then the title, host and when it ended (plus how long it ran, when
// both timestamps are present). Staff get a remove-from-history control.
function PastSessionCard({
  session,
  isStaff,
  onDelete,
  pending,
}: {
  session: LiveSessionWithStarter;
  isStaff: boolean;
  onDelete: () => void;
  pending: boolean;
}) {
  const duration = formatSessionDuration(session.started_at, session.ended_at);
  const hostName = session.starter?.full_name || session.starter?.username;
  // A still from the meeting, else the session's cover image, else the camera.
  const picture = session.thumbnail_url || session.image_url;
  return (
    <Card className="group relative overflow-hidden">
      <div className="relative flex h-24 items-center justify-center overflow-hidden bg-gradient-to-br from-muted to-border">
        {picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={picture} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <Video className="h-7 w-7 text-muted-foreground/70" />
        )}
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground backdrop-blur">
          <History className="h-3 w-3" /> Ended
        </span>
        {duration && (
          <span className="absolute bottom-2 right-2 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur">
            {duration}
          </span>
        )}
        {isStaff && (
          <button
            type="button"
            title="Remove from history"
            onClick={onDelete}
            disabled={pending}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:text-danger group-hover:opacity-100 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <CardContent className="py-3">
        <p className="truncate text-sm font-semibold text-foreground" title={session.title}>
          {session.title}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          {session.starter && <Avatar src={session.starter.avatar_url} name={hostName} size={18} />}
          <span className="truncate">
            {hostName ? `${hostName} · ` : ""}
            {formatRelativeTime(session.ended_at ?? session.started_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// "45 min", "1h 20m" or null when we can't tell how long a session ran.
function formatSessionDuration(startedAt: string | null, endedAt: string | null): string | null {
  if (!startedAt || !endedAt) return null;
  const ms = new Date(endedAt).getTime() - new Date(startedAt).getTime();
  if (!Number.isFinite(ms) || ms < 60_000) return null;
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// The invited-members row on a session card. Staff see the full guest list
// (avatars + count); a plain member's RLS only returns their own invite, so
// they instead get a simple "You're invited" badge when they've been picked.
function InvitedRow({ invites, isStaff }: { invites: LiveInviteWithMember[]; isStaff: boolean }) {
  if (invites.length === 0) return null;

  if (!isStaff) {
    return (
      <div className="mt-3">
        <Badge tone="accent" className="gap-1 normal-case">
          <Check className="h-3 w-3" /> You&apos;re invited
        </Badge>
      </div>
    );
  }

  const visible = invites.slice(0, 5);
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Invited</span>
      <div className="flex -space-x-2">
        {visible.map((invite) => (
          <Avatar
            key={invite.id}
            src={invite.invitee?.avatar_url}
            name={invite.invitee?.full_name || invite.invitee?.username}
            size={24}
            className="border-2 border-card"
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {invites.length} invited{invites.length > visible.length ? ` (+${invites.length - visible.length} more)` : ""}
      </p>
    </div>
  );
}


type ComposerMode = "now" | "schedule";

// Staff: start a session now or schedule one ahead. Its own component so the
// draft hook attaches whenever the form appears — it's hidden while a session
// is live, and comes back when that session ends. What's typed survives a
// refresh (the house rule for forms), one draft per space.
function SessionComposer({
  spaceId,
  spaceName,
  pending,
  onSubmit,
}: {
  spaceId: string;
  spaceName: string;
  pending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, mode: ComposerMode, clearDraft: () => void) => void;
}) {
  const [mode, setMode] = useState<ComposerMode>("now");
  const { formRef, clearDraft } = useFormDraft(`live:${spaceId}`);
  return (
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

        <form ref={formRef} onSubmit={(e) => onSubmit(e, mode, clearDraft)} className="space-y-3">
          <LiveSessionFields idPrefix="live_new" spaceName={spaceName} showTimes={mode === "schedule"} />
          {mode === "now" ? (
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              <Radio className="h-4 w-4" /> {pending ? "Going live…" : "Go live"}
            </Button>
          ) : (
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              <CalendarClock className="h-4 w-4" /> {pending ? "Scheduling…" : "Schedule event"}
            </Button>
          )}
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          {mode === "now"
            ? "Members get a “live now — join” notification when you go live."
            : "Members are notified now, can RSVP, and get a “live now” alert when you start."}
        </p>
      </CardContent>
    </Card>
  );
}

// Reads the shared session fields off a composer or edit form. Times go to the
// server as full ISO timestamps, converted in the browser's time zone.
function readSessionFields(form: HTMLFormElement) {
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) ?? "").trim();
  return {
    title: text("title"),
    description: text("description"),
    imageUrl: text("image_url"),
    scheduledStart: localInputToIso(text("scheduled_start")),
    scheduledEnd: localInputToIso(text("scheduled_end")),
  };
}

function editDraftKey(sessionId: string) {
  return `live-edit:${sessionId}`;
}

// The edit form for one scheduled session, in place of its card body. Its
// typing survives a refresh like the composer's; Cancel throws the draft away.
function EditSessionForm({
  session,
  spaceName,
  pending,
  onSubmit,
  onCancel,
}: {
  session: LiveSessionWithStarter;
  spaceName: string;
  pending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  const { formRef } = useFormDraft(editDraftKey(session.id));
  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
      <LiveSessionFields
        idPrefix={`live_edit_${session.id}`}
        spaceName={spaceName}
        showTimes
        defaults={{
          title: session.title,
          description: session.description,
          imageUrl: session.image_url,
          scheduledStart: session.scheduled_start,
          scheduledEnd: session.scheduled_end,
        }}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// "Oct 20, 11:00 AM – 11:30 AM": the start as formatDateTime shows it, then
// just the end time when it's the same day (or the full end when it isn't).
function formatTimeRange(start: string, end: string | null): string {
  if (!end) return formatDateTime(start);
  const s = new Date(start);
  const e = new Date(end);
  const sameDay = s.toDateString() === e.toDateString();
  const endText = sameDay ? e.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : formatDateTime(end);
  return `${formatDateTime(start)} – ${endText}`;
}
