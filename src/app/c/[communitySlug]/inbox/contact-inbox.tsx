"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Mail, MailCheck } from "lucide-react";
import { replyToCommunityContactMessage, setCommunityContactMessageHandled } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import type { ContactMessageReply } from "@/types/database";

// What the inbox is given for each message. Deliberately NOT the ContactMessage
// row: the sender's email address never reaches the browser. Staff reply
// through the box below, which delivers without anyone reading the address, so
// there's nothing left for it to be on the page for. `hasAccount` is all that
// survives of who sent it — enough to say how the reply will reach them.
export type InboxMessage = {
  id: string;
  name: string;
  message: string;
  handled: boolean;
  created_at: string;
  hasAccount: boolean;
};

// The reply box under a message, plus the replies already sent. Staff write
// here instead of leaving for their mail client, and the sender is notified
// in-app when they have an account, by email when they don't.
function ReplyThread({
  message,
  communitySlug,
  initialReplies,
  onReplied,
}: {
  message: InboxMessage;
  communitySlug: string;
  initialReplies: ContactMessageReply[];
  onReplied: () => void;
}) {
  const [replies, setReplies] = useState(initialReplies);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const send = () => {
    const trimmed = body.trim();
    if (!trimmed || pending) return;
    setError(null);
    setWarning(null);
    startTransition(async () => {
      const result = await replyToCommunityContactMessage(communitySlug, message.id, trimmed);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      // Clear the box only once the reply is actually stored — a failed send
      // must never eat what was typed.
      setReplies((current) => [...current, result.reply]);
      setBody("");
      setWarning(result.warning ?? null);
      onReplied();
    });
  };

  return (
    <div className="mt-3 space-y-3">
      {replies.length > 0 && (
        <div className="space-y-2 border-l-2 border-border pl-3">
          {replies.map((reply) => (
            <div key={reply.id}>
              <p className="text-xs text-muted-foreground">
                Replied {formatDateTime(reply.created_at)}
              </p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">{reply.body}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <label htmlFor={`reply-${message.id}`} className="sr-only">
          Reply to {message.name}
        </label>
        <Textarea
          id={`reply-${message.id}`}
          rows={3}
          maxLength={5000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={replies.length > 0 ? "Write another reply…" : `Reply to ${message.name}…`}
          disabled={pending}
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button size="sm" onClick={send} disabled={pending || body.trim().length === 0}>
            {pending ? "Sending…" : "Send reply"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {message.hasAccount ? "They'll get a notification." : "Sent to the email address they left."}
          </span>
        </div>
        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
        {warning && <p className="mt-2 text-xs text-muted-foreground">{warning}</p>}
      </div>
    </div>
  );
}

function MessageRow({
  message,
  communitySlug,
  replies,
  highlighted,
}: {
  message: InboxMessage;
  communitySlug: string;
  replies: ContactMessageReply[];
  highlighted: boolean;
}) {
  const [handled, setHandled] = useState(message.handled);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  // Arriving from the notification, bring the message it's about into view. It
  // can be anywhere down a long list, so landing at the top of the inbox and
  // leaving staff to find it is the thing the deep link exists to avoid.
  useEffect(() => {
    if (!highlighted) return;
    ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [highlighted]);

  const toggle = () => {
    const next = !handled;
    setError(null);
    setHandled(next); // optimistic — reverted below if the write is refused
    startTransition(async () => {
      const result = await setCommunityContactMessageHandled(communitySlug, message.id, next);
      if (result?.error) {
        setHandled(!next);
        setError(result.error);
      }
    });
  };

  return (
    <div
      ref={ref}
      id={`message-${message.id}`}
      className={`scroll-mt-24 rounded-lg border p-4 ${
        highlighted ? "border-accent ring-2 ring-accent/40" : "border-border"
      } ${handled ? "bg-card/60" : "bg-card"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{message.name}</p>
          <p className="text-xs text-muted-foreground">
            {message.hasAccount ? "Signed-in member" : "Visitor"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {handled ? <Badge tone="neutral">handled</Badge> : <Badge tone="accent">new</Badge>}
          <time className="text-xs text-muted-foreground" dateTime={message.created_at}>
            {formatDateTime(message.created_at)}
          </time>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{message.message}</p>

      <ReplyThread
        message={message}
        communitySlug={communitySlug}
        initialReplies={replies}
        // Replying marks the message handled server-side; keep the badge here in
        // step without a reload.
        onReplied={() => setHandled(true)}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          {handled ? "Reopen" : "Mark handled"}
        </button>
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    </div>
  );
}

// The community's contact-form inbox: every submission from /c/<slug>/contact,
// newest first, each with the replies sent so far and a box to write another.
// Handled messages are hidden by default so the list is the work still to do,
// not an ever-growing archive.
//
// `highlightId` is the message a "new contact message" notification was about.
// It's ringed and scrolled to, and it stays visible even when it's already been
// handled — following a link to a message and being shown nothing would read as
// the link being broken.
export function CommunityContactInbox({
  messages,
  replies,
  communitySlug,
  communityName,
  highlightId,
}: {
  messages: InboxMessage[];
  replies: ContactMessageReply[];
  communitySlug: string;
  communityName: string;
  highlightId?: string | null;
}) {
  const [showHandled, setShowHandled] = useState(false);
  const openCount = messages.filter((m) => !m.handled).length;
  const visible = messages.filter((m) => showHandled || !m.handled || m.id === highlightId);
  // A linked message that isn't here at all: the inbox shows the most recent
  // 200, and a message can also be gone if its community changed. Say so rather
  // than silently showing an ordinary-looking list.
  const linkedMissing = Boolean(highlightId) && !messages.some((m) => m.id === highlightId);

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={<Mail className="h-6 w-6" />}
        title="No messages yet"
        description={`Anything sent through ${communityName}'s contact page lands here — and pings your notifications.`}
      />
    );
  }

  return (
    <div className="space-y-3">
      {linkedMissing && (
        <p className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
          That message isn&apos;t in this inbox — it may be older than the 200 shown here.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {openCount} open · {messages.length} total
        </p>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={showHandled} onChange={(e) => setShowHandled(e.target.checked)} />
          Show handled
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<MailCheck className="h-6 w-6" />}
          title="You're all caught up"
          description="Every message has been marked handled. Tick “Show handled” to read them again."
        />
      ) : (
        visible.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            communitySlug={communitySlug}
            replies={replies.filter((reply) => reply.message_id === message.id)}
            highlighted={message.id === highlightId}
          />
        ))
      )}
    </div>
  );
}
