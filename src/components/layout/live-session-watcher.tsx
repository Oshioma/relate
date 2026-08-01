"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Refreshes the server-rendered community shell whenever a live session in this
// community starts, ends or is removed — so the header "Live now!" badge pops
// in (and clears) instantly, without waiting for the viewer to navigate. RLS
// scopes the stream to sessions the viewer can see, and the community_id filter
// keeps it to this community. Renders nothing.
export function LiveSessionWatcher({ communityId }: { communityId: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!communityId) return;
    const supabase = createClient();
    let active = true;

    const channel = supabase.channel(`live-sessions:${communityId}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "live_sessions", filter: `community_id=eq.${communityId}` },
      () => {
        if (active) router.refresh();
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) supabase.realtime.setAuth(data.session.access_token);
      channel.subscribe();
    });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [communityId, router]);

  return null;
}
