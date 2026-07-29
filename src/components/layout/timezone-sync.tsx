"use client";

import { useEffect, useRef } from "react";
import { saveTimezone } from "./timezone-actions";

// Renders nothing. On mount it reads the browser's IANA timezone and, if it
// differs from what's stored on the member's profile, saves it (once) so
// notification times can be localized. Cheap and idempotent — it only calls the
// action when the value actually changed (a new member, or someone who moved /
// changed their device timezone).
export function TimezoneSync({ current }: { current: string | null }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz !== current) {
      sent.current = true;
      saveTimezone(tz).catch(() => {});
    }
  }, [current]);

  return null;
}
