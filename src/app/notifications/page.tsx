import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getNotifications } from "@/lib/data/notifications";
import { EmptyState } from "@/components/ui/empty-state";
import { NotificationList } from "./notification-list";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/notifications");
  }

  // Deliberately not marked read here. Opening a notification is what reads it
  // (see NotificationList) — marking the lot read for merely looking at the
  // page is what left this list unable to say which ones had been dealt with.
  const notifications = await getNotifications(supabase, user.id, 50);

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
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
}
