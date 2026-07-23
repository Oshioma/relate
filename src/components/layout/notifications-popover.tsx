"use client";

import Link from "next/link";
import { Bell, MessageSquare, Megaphone, Users } from "lucide-react";
import { IconPopover } from "@/components/layout/icon-popover";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { NotificationWithActor } from "@/lib/data/notifications";

const typeIcon = {
  comment: <MessageSquare className="h-4 w-4" />,
  post: <Megaphone className="h-4 w-4" />,
  membership: <Users className="h-4 w-4" />,
};

function BellIcon({ count }: { count: number }) {
  return (
    <span className="relative inline-flex">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium leading-none text-danger-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </span>
  );
}

export function NotificationsPopover({
  notifications,
  unreadCount,
}: {
  notifications: NotificationWithActor[];
  unreadCount: number;
}) {
  return (
    <IconPopover icon={<BellIcon count={unreadCount} />} label="Notifications" panelTitle="Notifications">
      {notifications.length === 0 ? (
        <div className="px-4 py-8">
          <EmptyState
            icon={<Bell className="h-5 w-5" />}
            title="No notifications yet"
            description="Activity across your communities will show up here."
          />
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notifications.map((notification) => {
            const row = (
              <div className={cn("flex items-start gap-3 px-4 py-3 hover:bg-muted", !notification.read && "bg-accent-soft/40")}>
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
                  <p className="truncate text-sm font-medium text-foreground">{notification.title}</p>
                  {notification.body && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{notification.body}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(notification.created_at)}</p>
                </div>
              </div>
            );
            return notification.link ? (
              <Link key={notification.id} href={notification.link}>
                {row}
              </Link>
            ) : (
              <div key={notification.id}>{row}</div>
            );
          })}
        </div>
      )}
      <Link href="/notifications" className="block border-t border-border px-4 py-2.5 text-center text-sm font-medium text-accent hover:bg-muted">
        See all notifications
      </Link>
    </IconPopover>
  );
}
