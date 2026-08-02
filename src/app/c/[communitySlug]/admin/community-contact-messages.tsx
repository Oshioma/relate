import { formatDateTime } from "@/lib/utils";
import type { ContactMessage } from "@/types/database";

// Read-only inbox of a community's contact-form submissions for the admin page.
// Staff also get an in-app notification for each new message; this is the
// durable record, with a mailto reply link.
export function CommunityContactMessages({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) {
    return (
      <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
        No messages yet. Submissions from your contact page will show here and ping your notifications.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div key={message.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{message.name}</p>
              <a href={`mailto:${message.email}`} className="text-xs text-accent hover:underline">
                {message.email}
              </a>
            </div>
            <time className="text-xs text-muted-foreground" dateTime={message.created_at}>
              {formatDateTime(message.created_at)}
            </time>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{message.message}</p>
          <a
            href={`mailto:${message.email}?subject=${encodeURIComponent("Re: your message")}`}
            className="mt-3 inline-block text-xs font-medium text-accent hover:underline"
          >
            Reply by email
          </a>
        </div>
      ))}
    </div>
  );
}
