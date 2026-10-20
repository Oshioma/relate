"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Counts one read of a guide (see the editorial_guide_views migration). Runs
// once after the page loads in a real browser, so crawlers and prefetches
// aren't counted. The reader is identified only by a random id kept in this
// browser; the database keeps one row per reader per guide per day and skips
// drafts and the community's own staff.

const KEY = "relate:guide-reader";

function readerId(): string {
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing && /^[A-Za-z0-9_-]{8,64}$/.test(existing)) return existing;
    const id = crypto.randomUUID().replace(/-/g, "");
    window.localStorage.setItem(KEY, id);
    return id;
  } catch {
    // Storage blocked (private mode): count this visit with a throwaway id.
    return crypto.randomUUID().replace(/-/g, "");
  }
}

export function GuideViewBeacon({ guideId }: { guideId: string }) {
  useEffect(() => {
    void createClient()
      .rpc("record_editorial_guide_view", { p_guide_id: guideId, p_visitor_id: readerId() })
      .then(() => undefined, () => undefined);
  }, [guideId]);
  return null;
}
