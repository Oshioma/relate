import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityMember, isCommunityStaff } from "@/lib/data/community";
import {
  getTimelineWindow,
  getTimelineTracks,
  getTimelineSources,
  getTimelineFacets,
  getTimelineExtent,
  getPendingTimelineEvents,
  getEventMarkers,
  getTimelineEventBySlug,
  getClaimCitations,
  hasTimelineEvent,
} from "@/lib/data/timeline";
import { SHOWCASE_EVENT_SLUG, showcaseNeedsPictures } from "@/lib/timeline/showcase-event";
import { HANNIBAL_ANCHOR_SLUG } from "@/lib/timeline/hannibal-seed";
import { DEEP_TIME_ANCHOR_SLUG } from "@/lib/timeline/deep-time-seed";
import { communityHasTimeline } from "@/lib/timeline/availability";
import { clampWindow, TIMELINE_JUMPS, type TimeWindow } from "@/lib/timeline/time";
import { TimelineView } from "./timeline-view";

export const metadata: Metadata = { title: "Timeline" };

type SearchParams = { from?: string; to?: string; focus?: string };

/**
 * Where the timeline opens.
 *
 * A link with from/to wins — that is how "what was happening at the same time?"
 * and every shared link work. Otherwise it fits the window to what this
 * community has actually put on it, padded so the earliest and latest events
 * aren't jammed against the edges. A community with nothing yet opens on the
 * ancient world, which is where a homeschool timeline nearly always starts.
 */
function openingWindow(searchParams: SearchParams, extent: { from: number; to: number } | null): TimeWindow {
  const from = Number(searchParams.from);
  const to = Number(searchParams.to);
  if (Number.isFinite(from) && Number.isFinite(to) && to > from) {
    return clampWindow({ from, to });
  }
  if (!extent) return TIMELINE_JUMPS.find((jump) => jump.key === "ancient")!.window;

  const span = Math.max(50, extent.to - extent.from);
  const pad = span * 0.08;
  return clampWindow({ from: extent.from - pad, to: extent.to + pad });
}

export default async function TimelinePage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { communitySlug } = await params;
  const query = await searchParams;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  // The timeline belongs to homeschool communities today. A community that
  // doesn't have it has no such page — not an empty one.
  if (!communityHasTimeline(community)) notFound();

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const isStaff = isCommunityStaff(community, membership, user?.id);
  const canContribute = isCommunityMember(community, membership, user?.id);

  const extent = await getTimelineExtent(supabase, community.id);
  const view = openingWindow(query, extent);

  const [initial, tracks, sources, facets, pending, markers, showcase, citations, hasHannibal, hasDeepTime] = await Promise.all([
    getTimelineWindow(supabase, community.id, view.from, view.to, { includePending: Boolean(user) }),
    getTimelineTracks(supabase, community.id),
    getTimelineSources(supabase, community.id),
    getTimelineFacets(supabase, community.id),
    isStaff ? getPendingTimelineEvents(supabase, community.id) : Promise.resolve([]),
    // Positions only, for the overview bar. Numbers, so it costs a page of
    // text even for a community with thousands of events.
    getEventMarkers(supabase, community.id),
    // One row, to decide whether to offer the worked example. Cheaper than
    // scanning what they have, and it is the only question being asked.
    getTimelineEventBySlug(supabase, community.id, SHOWCASE_EVENT_SLUG),
    getClaimCitations(supabase, community.id),
    // One head-count, to decide whether to offer the Hannibal dataset. Asked
    // only for staff, who are the only people who could act on the answer.
    isStaff ? hasTimelineEvent(supabase, community.id, HANNIBAL_ANCHOR_SLUG) : Promise.resolve(true),
    isStaff ? hasTimelineEvent(supabase, community.id, DEEP_TIME_ANCHOR_SLUG) : Promise.resolve(true),
  ]);

  return (
    // WIDER THAN THE REST OF THE APP, ON PURPOSE.
    //
    // max-w-6xl is the right measure for a page of text and the wrong one for
    // this page, which is mostly a strip of time: every pixel it is not given
    // is a stretch of history the reader cannot see without zooming. On a
    // 1720px window it was leaving nearly 300px of empty gutter beside a
    // timeline that had run out of room.
    //
    // Capped rather than unbounded so an ultrawide monitor does not produce a
    // strip nobody can scan end to end, and the reading matter inside — an
    // event's summary and description — keeps its own measure.
    <div className="mx-auto w-full max-w-[110rem] px-4 py-6 sm:px-6 sm:py-8">
      <TimelineView
        communitySlug={community.slug}
        initialEvents={initial.events}
        initialWindow={view}
        initialTotal={initial.total}
        initialTruncated={initial.truncated}
        // The stretch this community's events actually occupy, so "Whole
        // timeline" can frame all of them without asking the server again.
        extent={extent}
        markers={markers}
        hasShowcase={showcase != null}
        hasHannibal={hasHannibal}
        hasDeepTime={hasDeepTime}
        // Its photographs are missing, or are links to somebody else's server
        // that do not load. Staff get offered the repair; nobody else sees
        // anything, because there is nothing they could do about it.
        showcaseNeedsPictures={showcase != null && showcaseNeedsPictures(showcase)}
        citations={citations}
        sources={sources}
        tracks={tracks}
        facets={facets}
        canContribute={canContribute}
        isStaff={isStaff}
        userId={user?.id ?? null}
        pendingCount={pending.length}
        focusSlug={query.focus ?? null}
      />
    </div>
  );
}
