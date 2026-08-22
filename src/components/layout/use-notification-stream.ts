"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/database";
import type { NotificationWithActor } from "@/lib/data/notifications";

// Live notifications over Supabase Realtime. Seeds from the server-rendered
// props, then subscribes to INSERTs on the notifications table for this user so
// the bell count and list update without a page refresh. RLS
// (notifications_select_own) means the subscription only ever receives this
// user's own rows.
//
// New rows arrive without the actor join the server does, so they render with
// the per-type fallback icon (that's why every notification type has one). The
// next navigation re-seeds from the server with full actor data and accurate
// read state.

const MAX_ITEMS = 6;

export function useNotificationStream(
  userId: string,
  initialNotifications: NotificationWithActor[],
  initialUnreadCount: number
) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  // Notifications this viewer has just opened. Kept separately from the list
  // itself because the list is re-seeded from the server on every navigation,
  // and clicking a notification navigates — the write and that render race, so
  // folding the change into the list would let a row flicker back to unread.
  // Held over the top of whatever the server says instead, until the server
  // says the same thing.
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(() => new Set());
  // A stable, per-instance channel name so multiple bells on one page (e.g. the
  // dashboard's desktop + mobile counts) don't collide on the same topic.
  const instanceId = useId();

  // Re-seed whenever the server sends fresh props (navigation / revalidation).
  // Adjusting state during render — not in an effect — is React's recommended
  // way to reset on prop change and avoids a cascading re-render. The props are
  // new references only when the server layout re-renders; live updates between
  // navigations leave them untouched, so local state is preserved.
  const [seed, setSeed] = useState(initialNotifications);
  if (seed !== initialNotifications) {
    setSeed(initialNotifications);
    setNotifications(initialNotifications);
    setUnreadCount(initialUnreadCount);
  }

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    let active = true;

    const channel = supabase.channel(`notifications:${userId}:${instanceId}`).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
      (payload) => {
        if (!active) return;
        const row = payload.new as Notification;
        setNotifications((prev) => {
          if (prev.some((n) => n.id === row.id)) return prev;
          return [{ ...row, actor: null }, ...prev].slice(0, MAX_ITEMS);
        });
        setUnreadCount((c) => c + 1);
      }
    );

    // Authorize the realtime socket with the user's JWT so RLS lets the
    // postgres_changes stream through.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) supabase.realtime.setAuth(data.session.access_token);
      channel.subscribe();
    });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [userId, instanceId]);

  /**
   * Mark one notification read — what opening it means. Optimistic: the row
   * loses its unread tint and the bell count drops before the write lands,
   * because the click is also a navigation and the eye is already elsewhere.
   */
  function markRead(id: string) {
    setReadIds((previous) => (previous.has(id) ? previous : new Set(previous).add(id)));
    // Awaited inside its own function rather than fired at the builder: a
    // supabase-js query is lazy — it only sends the request when something
    // awaits it, so `void supabase.from(…).update(…)` builds a request and
    // throws it away, silently, which is how a notification could look read
    // until the next page proved it never was.
    void persistRead([id]);
  }

  async function persistRead(ids: string[]) {
    const supabase = createClient();
    const { error } = await supabase.from("notifications").update({ read: true }).in("id", ids);
    // RLS only ever lets a member touch their own rows, so a failure here is
    // the network. Worth a line in the console; not worth interrupting anyone.
    if (error) console.warn("[notifications] could not mark read:", error.message);
  }

  const visible = useMemo(
    () => notifications.map((n) => (!n.read && readIds.has(n.id) ? { ...n, read: true } : n)),
    [notifications, readIds]
  );

  // The count covers more than the handful of rows on screen, so it can't be
  // recounted from them — subtract only the ones just opened that the server
  // hasn't caught up with yet.
  const pendingRead = notifications.filter((n) => !n.read && readIds.has(n.id)).length;

  return { notifications: visible, unreadCount: Math.max(0, unreadCount - pendingRead), markRead };
}
