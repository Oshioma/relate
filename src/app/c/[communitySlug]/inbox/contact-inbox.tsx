"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Mail, MailCheck } from "lucide-react";
import { setCommunityContactMessageHandled } from "./actions";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";
import type { ContactMessage } from "@/types/database";

function MessageRow({
  message,
  communitySlug,
  communityName,
  highlighted,
}: {
  message: ContactMessage;
  communitySlug: string;
  communityName: string;
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
      } ${handled ? "opacity-60" : "bg-card"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{message.name}</p>
          <a href={`mailto:${message.email}`} className="text-xs text-accent hover:underline">
            {message.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          {handled ? <Badge tone="neutral">handled</Badge> : <Badge tone="accent">new</Badge>}
          <time className="text-xs text-muted-foreground" dateTime={message.created_at}>
            {formatDateTime(message.created_at)}
          </time>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{message.message}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: your message to ${communityName}`)}`}
          className="text-xs font-medium text-accent hover:underline"
        >
          Reply by email
        </a>
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
// newest first, with the same handled/reopen triage the platform inbox uses.
// Handled messages are hidden by default so the list is the work still to do,
// not an ever-growing archive.
//
// `highlightId` is the message a "new contact message" notification was about.
// It's ringed and scrolled to, and it stays visible even when it's already been
// handled — following a link to a message and being shown nothing would read as
// the link being broken.
export function CommunityContactInbox({
  messages,
  communitySlug,
  communityName,
  highlightId,
}: {
  messages: ContactMessage[];
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
            communityName={communityName}
            highlighted={message.id === highlightId}
          />
        ))
      )}
    </div>
  );
}
