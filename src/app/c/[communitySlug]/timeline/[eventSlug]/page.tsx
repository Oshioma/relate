import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityMember, isCommunityStaff } from "@/lib/data/community";
import { getClaimCitations, getSourceChains, getTimelineEventBySlug, getTimelineSourcesByIds } from "@/lib/data/timeline";
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
  const cited = await getTimelineSourcesByIds(
    supabase,
    event.claims.map((claim) => claim.source_id).filter((id): id is string => Boolean(id))
  );

  // The chain under each cited source — Wikipedia → academic book → excavation
  // report. The timeline page already holds every source the community has, so
  // it walks the chain for free; this page loads only what it cites, and would
  // otherwise show a Wikipedia article whose "where this came from" was empty
  // on the very page most likely to be shared.
  const chains = await getSourceChains(supabase, community.id, cited.map((source) => source.id));
  const byId = new Map(cited.map((source) => [source.id, source]));
  for (const chain of chains.values()) {
    for (const link of chain) byId.set(link.id, link);
  }
  // The extra sources attached to this event's claims, plus any source they
  // point at that the event does not otherwise cite — a critique is usually
  // not the work the claim was built on, so it will not already be here.
  const citations = (await getClaimCitations(supabase, community.id)).filter((citation) =>
    event.claims.some((claim) => claim.id === citation.claim_id)
  );
  const missing = citations.map((citation) => citation.source_id).filter((id) => !byId.has(id));
  for (const source of await getTimelineSourcesByIds(supabase, missing)) byId.set(source.id, source);

  const sources = [...byId.values()];

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
        citations={citations}
        communitySlug={community.slug}
        canContribute={isCommunityMember(community, membership, user?.id)}
        isStaff={isCommunityStaff(community, membership, user?.id)}
      />
    </div>
  );
}
