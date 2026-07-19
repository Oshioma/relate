import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Bell, MessageSquare, Megaphone, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getNotifications, type NotificationWithActor } from "@/lib/data/notifications";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeTime } from "@/lib/utils";

const typeIcon = {
  comment: <MessageSquare className="h-4 w-4" />,
  post: <Megaphone className="h-4 w-4" />,
  membership: <Users className="h-4 w-4" />,
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/notifications");
  }

  const notifications = await getNotifications(supabase, user.id, 50);
  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

  if (unreadIds.length > 0) {
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/dashboard" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">Notifications</h1>

      {notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-6 w-6" />} title="No notifications yet" description="Activity across your communities will show up here." />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} wasUnread={unreadIds.includes(notification.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationRow({ notification, wasUnread }: { notification: NotificationWithActor; wasUnread: boolean }) {
  const content = (
    <Card className={wasUnread ? "border-accent/40 bg-accent-soft/40" : undefined}>
      <CardContent className="flex items-start gap-3 pt-5">
        {notification.actor ? (
          <Avatar src={notification.actor.avatar_url} name={notification.actor.full_name || notification.actor.username} size={32} />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
            {typeIcon[notification.type]}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{notification.title}</p>
          {notification.body && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{notification.body}</p>}
          <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(notification.created_at)}</p>
        </div>
        {wasUnread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
      </CardContent>
    </Card>
  );

  return notification.link ? <Link href={notification.link}>{content}</Link> : content;
}
