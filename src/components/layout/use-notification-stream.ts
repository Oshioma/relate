"use client";

import { useEffect, useId, useState } from "react";
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

  return { notifications, unreadCount };
}
