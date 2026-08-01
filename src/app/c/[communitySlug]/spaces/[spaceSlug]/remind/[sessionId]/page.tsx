import { notFound, redirect } from "next/navigation";
import { BellRing, Radio, Video } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug } from "@/lib/data/community";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

// One-tap "remind me" target for the live-session emails. A member arrives here
// from the "get an email reminder" link, we RSVP them to the scheduled session,
// and the existing reminder job (send_live_event_reminders) emails everyone
// who's RSVP'd 10 minutes before it starts. If the session is already live, we
// send them straight in instead.
export default async function RemindPage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; sessionId: string }>;
}) {
  const { communitySlug, spaceSlug, sessionId } = await params;
  const here = `/c/${communitySlug}/spaces/${spaceSlug}/remind/${sessionId}`;
  const spaceHref = `/c/${communitySlug}/spaces/${spaceSlug}`;

  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect(`/login?next=${encodeURIComponent(here)}`);

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  // RLS (live_sessions_select → can_view_space) means a member who can't see
  // the session gets null here, same as a bad id.
  const { data: session } = await supabase
    .from("live_sessions")
    .select("id, title, status, scheduled_start, community_id")
    .eq("id", sessionId)
    .eq("community_id", community.id)
    .maybeSingle();

  if (!session) notFound();

  // Already live — no reminder needed, just point them at the room.
  if (session.status === "live") {
    return (
      <Shell
        icon={<Radio className="h-6 w-6" />}
        title={`${session.title} is live now`}
        description="This session has already started — jump in."
        ctaLabel="Join now"
        ctaHref={spaceHref}
      />
    );
  }

  if (session.status !== "scheduled") {
    // Ended or otherwise not upcoming.
    return (
      <Shell
        icon={<Video className="h-6 w-6" />}
        title="This session isn't upcoming"
        description="There's nothing to be reminded about — it may have already wrapped up."
        ctaLabel="Back to the space"
        ctaHref={spaceHref}
      />
    );
  }

  // RSVP = the reminder subscription. Idempotent: a repeat click hits the
  // unique(session_id, user_id) index and is treated as already-signed-up.
  const { error } = await supabase.from("live_session_rsvps").insert({
    session_id: session.id,
    community_id: session.community_id,
    user_id: user.id,
  });

  // 23505 = unique violation = already RSVP'd; anything else (e.g. not a
  // member) is a real failure we should surface honestly.
  if (error && error.code !== "23505") {
    return (
      <Shell
        icon={<BellRing className="h-6 w-6" />}
        title="Couldn't set your reminder"
        description="You may need to be a member of this community to get reminders. Open the space to RSVP there."
        ctaLabel="Open the space"
        ctaHref={spaceHref}
      />
    );
  }

  const when = session.scheduled_start ? formatDateTime(session.scheduled_start) : null;
  return (
    <Shell
      icon={<BellRing className="h-6 w-6" />}
      title="You're on the list 🔔"
      description={
        when
          ? `We'll email you a reminder about “${session.title}” 10 minutes before it starts — ${when}.`
          : `We'll email you a reminder about “${session.title}” 10 minutes before it starts.`
      }
      ctaLabel="View the event"
      ctaHref={spaceHref}
    />
  );
}

function Shell({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/15 text-accent">{icon}</span>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
          <LinkButton href={ctaHref} className="mt-2">
            {ctaLabel}
          </LinkButton>
        </CardContent>
      </Card>
    </div>
  );
}
