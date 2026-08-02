"use client";

import { useState, useTransition } from "react";
import { setContactMessageHandled } from "./actions";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { ContactMessage } from "@/types/database";

function MessageRow({ message }: { message: ContactMessage }) {
  const [handled, setHandled] = useState(message.handled);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !handled;
    setError(null);
    setHandled(next); // optimistic
    startTransition(async () => {
      const result = await setContactMessageHandled(message.id, next);
      if (result?.error) {
        setHandled(!next); // revert
        setError(result.error);
      }
    });
  };

  return (
    <div className={`rounded-lg border border-border p-4 ${handled ? "opacity-60" : "bg-card"}`}>
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

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          {handled ? "Reopen" : "Mark handled"}
        </button>
        <a
          href={`mailto:${message.email}?subject=${encodeURIComponent("Re: your message to Relate")}`}
          className="text-xs font-medium text-accent hover:underline"
        >
          Reply by email
        </a>
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    </div>
  );
}

export function ContactInbox({ messages }: { messages: ContactMessage[] }) {
  const [showHandled, setShowHandled] = useState(false);
  const openCount = messages.filter((m) => !m.handled).length;
  const visible = showHandled ? messages : messages.filter((m) => !m.handled);

  if (messages.length === 0) {
    return <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">No messages yet.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {openCount} new · {messages.length} total
        </p>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={showHandled} onChange={(e) => setShowHandled(e.target.checked)} />
          Show handled
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
          Nothing new — you&apos;re all caught up.
        </p>
      ) : (
        visible.map((message) => <MessageRow key={message.id} message={message} />)
      )}
    </div>
  );
}
