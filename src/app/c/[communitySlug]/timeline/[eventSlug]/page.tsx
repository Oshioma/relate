import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityMember, isCommunityStaff } from "@/lib/data/community";
import { getTimelineEventBySlug, getTimelineSourcesByIds } from "@/lib/data/timeline";
import { communityHasTimeline, timelinePath } from "@/lib/timeline/availability";
import { EventDetail } from "../event-detail";

// One event, at its own address.
//
// The timeline's drawer is the fast way to read an event; this is the one you
// can send to somebody, print, or land on from a search engine. Same component
// underneath, so the two can't say different things — the only difference is
// that "what was happening at the same time?" links back to the timeline here
// rather than moving it.

type Params = { communitySlug: string; eventSlug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { communitySlug, eventSlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return { title: "Timeline" };
  const event = await getTimelineEventBySlug(supabase, community.id, eventSlug);
  return event ? { title: event.title, description: event.summary || undefined } : { title: "Timeline" };
}

export default async function TimelineEventPage({ params }: { params: Promise<Params> }) {
  const { communitySlug, eventSlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();

  const event = await getTimelineEventBySlug(supabase, community.id, eventSlug);
  if (!event) notFound();

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const sources = await getTimelineSourcesByIds(
    supabase,
    event.claims.map((claim) => claim.source_id).filter((id): id is string => Boolean(id))
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href={timelinePath(community.slug)}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the timeline
      </Link>

      <EventDetail
        event={event}
        sources={sources}
        communitySlug={community.slug}
        canContribute={isCommunityMember(community, membership, user?.id)}
        isStaff={isCommunityStaff(community, membership, user?.id)}
      />
    </div>
  );
}
