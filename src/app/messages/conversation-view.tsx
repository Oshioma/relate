"use client";

import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video, CalendarClock, Phone, X, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { JitsiRoom } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/jitsi-room";
import type { DirectMessage, Profile } from "@/types/database";
import { startVideoCall, scheduleVideoCall, cancelVideoCall, getCallToken, markMessagesRead } from "./actions";
import { MessageComposer } from "./message-composer";

type Message = DirectMessage;

// Splits a message body into plain text and clickable links so pasted meeting
// links (Zoom, Meet, Jitsi, anything) are tappable. Matches http(s):// URLs and
// bare www. hosts; the latter get an https:// scheme when opened.
const URL_RE = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
function Linkified({ text, className }: { text: string; className?: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const href = part.startsWith("http") ? part : `https://${part}`;
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("underline underline-offset-2 break-all hover:opacity-80", className)}
            >
              {part}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function ConversationView({
  conversationId,
  currentUserId,
  other,
  initialMessages,
  displayName,
}: {
  conversationId: string;
  currentUserId: string;
  other: Profile;
  initialMessages: Message[];
  displayName?: string | null;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduledStart, setScheduledStart] = useState("");
  const [scheduleNote, setScheduleNote] = useState("");
  // The room currently open in the call overlay, if any.
  const [openRoom, setOpenRoom] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Re-seed from the server whenever fresh props arrive (navigation /
  // router.refresh after sending). Same render-time reset React recommends.
  const [seed, setSeed] = useState(initialMessages);
  if (seed !== initialMessages) {
    setSeed(initialMessages);
    setMessages(initialMessages);
  }

  const otherName = other.full_name || other.username;

  // Live updates: new messages (incl. call invites) and status changes (a call
  // cancelled or started) land without a refresh. RLS scopes the stream to this
  // conversation's participants.
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          if (!active) return;
          const row = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]));
          // Clear the unread badge if it arrived from the other person.
          if (row.sender_id !== currentUserId) {
            void markMessagesRead(conversationId);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "direct_messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          if (!active) return;
          const row = payload.new as Message;
          setMessages((prev) => prev.map((m) => (m.id === row.id ? { ...m, ...row } : m)));
        }
      );

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) supabase.realtime.setAuth(data.session.access_token);
      channel.subscribe();
    });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

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

  function handleStartCall() {
    setError(null);
    startTransition(async () => {
      const res = await startVideoCall(conversationId);
      if (res.error || !res.roomName) {
        setError(res.error ?? "That call couldn't be started.");
        return;
      }
      setOpenRoom(res.roomName);
      router.refresh();
    });
  }

  function handleSchedule() {
    if (!scheduledStart) {
      setError("Pick a date and time for the call.");
      return;
    }
    run(
      () => scheduleVideoCall(conversationId, scheduledStart, scheduleNote),
      () => {
        setScheduling(false);
        setScheduledStart("");
        setScheduleNote("");
      }
    );
  }

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border py-4">
        <Link href="/messages" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Avatar src={other.avatar_url} name={otherName} size={32} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{otherName}</p>
          <p className="truncate text-xs text-muted-foreground">@{other.username}</p>
        </div>
        {/* One-tap video call invites, right where you're already chatting. */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            onClick={handleStartCall}
            disabled={pending}
            title={`Start a video call with ${otherName}`}
          >
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Video call</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setScheduling((s) => !s)}
            disabled={pending}
            title="Schedule a video call"
          >
            <CalendarClock className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </Button>
        </div>
      </div>

      {/* Schedule panel */}
      {scheduling && (
        <div className="border-b border-border bg-muted/40 px-1 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              type="datetime-local"
              value={scheduledStart}
              onChange={(e) => setScheduledStart(e.target.value)}
              className="sm:max-w-xs"
            />
            <Input
              value={scheduleNote}
              onChange={(e) => setScheduleNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="flex-1"
            />
            <Button type="button" onClick={handleSchedule} disabled={pending} className="shrink-0">
              <CalendarClock className="h-4 w-4" /> {pending ? "Scheduling…" : "Send invite"}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Say hello 👋</p>
        ) : (
          messages.map((message) => {
            const isMine = message.sender_id === currentUserId;
            if (message.kind === "call") {
              return (
                <CallCard
                  key={message.id}
                  message={message}
                  isMine={isMine}
                  otherName={otherName}
                  onJoin={(room) => setOpenRoom(room)}
                  onCancel={(id) => run(() => cancelVideoCall(id))}
                  pending={pending}
                />
              );
            }
            return (
              <div key={message.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3.5 py-2 text-sm",
                    isMine ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">
                    <Linkified text={message.body} />
                  </p>
                  <p className="mt-1 text-[10px] opacity-70">{formatRelativeTime(message.created_at)}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <MessageComposer conversationId={conversationId} />

      {/* Call overlay */}
      {openRoom && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 p-2 sm:p-4">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between py-2">
            <p className="flex items-center gap-2 text-sm font-medium text-white">
              <Phone className="h-4 w-4" /> Video call with {otherName}
            </p>
            <Button type="button" variant="secondary" size="sm" onClick={() => setOpenRoom(null)}>
              <X className="h-4 w-4" /> Leave
            </Button>
          </div>
          <div className="mx-auto w-full max-w-5xl flex-1 overflow-hidden">
            <JitsiRoom
              roomName={openRoom}
              displayName={displayName}
              subject={`Call with ${otherName}`}
              onClose={() => setOpenRoom(null)}
              getToken={() => getCallToken({ conversationId, roomName: openRoom })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CallCard({
  message,
  isMine,
  otherName,
  onJoin,
  onCancel,
  pending,
}: {
  message: Message;
  isMine: boolean;
  otherName: string;
  onJoin: (room: string) => void;
  onCancel: (messageId: string) => void;
  pending: boolean;
}) {
  const hostName = isMine ? "You" : otherName;

  if (message.call_status === "cancelled") {
    return (
      <div className="flex justify-center">
        <p className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          Video call cancelled
        </p>
      </div>
    );
  }

  const scheduled = message.call_status === "scheduled";
  // The body doubles as an optional note for scheduled calls; hide the default
  // placeholder text.
  const note =
    message.body && message.body !== "Scheduled a video call" && message.body !== "Started a video call"
      ? message.body
      : null;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm rounded-xl border border-accent/40 bg-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
            {scheduled ? <CalendarClock className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </span>
          <div className="min-w-0 flex-1">
            {scheduled ? (
              <>
                <p className="text-sm font-medium text-foreground">Video call invite</p>
                <p className="text-sm text-muted-foreground">
                  {message.call_scheduled_at ? formatDateTime(message.call_scheduled_at) : "Time to be set"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">Invited by {hostName}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">
                  {hostName} started a video call
                </p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(message.created_at)}</p>
              </>
            )}
            {note && <p className="mt-1.5 text-sm text-foreground">{note}</p>}

            <div className="mt-3 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => message.call_room && onJoin(message.call_room)}
                disabled={!message.call_room}
              >
                <Video className="h-4 w-4" /> Join{scheduled ? " now" : ""}
              </Button>
              {scheduled && (
                <button
                  type="button"
                  onClick={() => onCancel(message.id)}
                  disabled={pending}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-danger disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
              )}
              {!scheduled && (
                <span className="inline-flex items-center gap-1 text-xs text-accent">
                  <Check className="h-3.5 w-3.5" /> Live now
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
