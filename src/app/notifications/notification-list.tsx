"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MessageSquare, Megaphone, Users, Store, Radio, Mail, Reply, Footprints } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import type { NotificationWithActor } from "@/lib/data/notifications";

const typeIcon = {
  comment: <MessageSquare className="h-4 w-4" />,
  post: <Megaphone className="h-4 w-4" />,
  membership: <Users className="h-4 w-4" />,
  claim: <Store className="h-4 w-4" />,
  live_event: <Radio className="h-4 w-4" />,
  live_started: <Radio className="h-4 w-4" />,
  live_reminder: <Radio className="h-4 w-4" />,
  live_invite: <Radio className="h-4 w-4" />,
  member_message: <Mail className="h-4 w-4" />,
  contact: <Mail className="h-4 w-4" />,
  contact_reply: <Reply className="h-4 w-4" />,
  direct_message: <MessageSquare className="h-4 w-4" />,
  meetup: <Footprints className="h-4 w-4" />,
  meetup_join: <Footprints className="h-4 w-4" />,
};

/**
 * The notification list, where a row stays lit until it's opened.
 *
 * This page used to mark every notification read simply for being looked at,
 * which is the one thing that stops the list answering "which of these have I
 * dealt with?" — the answer was always "all of them". Reading is now what
 * opening does, one row at a time, with a way to clear the rest deliberately.
 */
export function NotificationList({ notifications }: { notifications: NotificationWithActor[] }) {
  const router = useRouter();
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(() => new Set());
  const [pending, startTransition] = useTransition();

  const unread = notifications.filter((n) => !n.read && !readIds.has(n.id));

  function markRead(id: string) {
    setReadIds((previous) => (previous.has(id) ? previous : new Set(previous).add(id)));
    const supabase = createClient();
    // Not awaited: the click is also a navigation, and a notification that
    // stays looking unread is the whole cost of this failing.
    void supabase.from("notifications").update({ read: true }).eq("id", id);
  }

  function markAllRead() {
    const ids = unread.map((n) => n.id);
    if (ids.length === 0) return;
    setReadIds((previous) => {
      const next = new Set(previous);
      ids.forEach((id) => next.add(id));
      return next;
    });
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from("notifications").update({ read: true }).in("id", ids);
      // The bell in the header is rendered by the layout, so it only catches up
      // on a re-render.
      router.refresh();
    });
  }

  return (
    <>
      {unread.length > 0 && (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={markAllRead}
            disabled={pending}
            className="text-sm font-medium text-accent underline disabled:opacity-50"
          >
            Mark all as read ({unread.length})
          </button>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((notification) => {
          const isUnread = !notification.read && !readIds.has(notification.id);
          const content = (
            <Card className={isUnread ? "border-accent/40 bg-accent-soft/40" : undefined}>
              <CardContent className="flex items-start gap-3 pt-5">
                {notification.actor ? (
                  <Avatar
                    src={notification.actor.avatar_url}
                    name={notification.actor.full_name || notification.actor.username}
                    size={32}
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    {typeIcon[notification.type]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{notification.title}</p>
                  {notification.body && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{notification.body}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(notification.created_at)}</p>
                </div>
                {isUnread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
              </CardContent>
            </Card>
          );

          return notification.link ? (
            <Link key={notification.id} href={notification.link} onClick={() => markRead(notification.id)}>
              {content}
            </Link>
          ) : (
            <div key={notification.id}>{content}</div>
          );
        })}
      </div>
    </>
  );
}
