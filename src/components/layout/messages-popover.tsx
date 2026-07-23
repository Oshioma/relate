"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { IconPopover } from "@/components/layout/icon-popover";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { ConversationSummary } from "@/lib/data/messages";

function MailIcon({ count }: { count: number }) {
  return (
    <span className="relative inline-flex">
      <Mail className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium leading-none text-danger-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </span>
  );
}

export function MessagesPopover({
  conversations,
  unreadCount,
}: {
  conversations: ConversationSummary[];
  unreadCount: number;
}) {
  return (
    <IconPopover icon={<MailIcon count={unreadCount} />} label="Messages" panelTitle="Messages">
      {conversations.length === 0 ? (
        <div className="px-4 py-8">
          <EmptyState
            icon={<Mail className="h-5 w-5" />}
            title="No conversations yet"
            description="Message a fellow member from their profile to start a conversation."
          />
        </div>
      ) : (
        <div className="divide-y divide-border">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar src={conversation.other.avatar_url} name={conversation.other.full_name || conversation.other.username} size={32} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {conversation.other.full_name || conversation.other.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">@{conversation.other.username}</p>
                </div>
              </div>
              {conversation.unreadCount > 0 && <Badge tone="accent">{conversation.unreadCount}</Badge>}
            </Link>
          ))}
        </div>
      )}
      <Link href="/messages" className="block border-t border-border px-4 py-2.5 text-center text-sm font-medium text-accent hover:bg-muted">
        See all messages
      </Link>
    </IconPopover>
  );
}
