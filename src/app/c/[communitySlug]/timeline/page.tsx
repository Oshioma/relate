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
  eventsMissingPictures,
  getEventLinks,
  getLinkedRecords,
  getTimelinePeriods,
  getTimelinePeriodLinks,
  hasTimelinePeriod,
} from "@/lib/data/timeline";
import { SHOWCASE_EVENT_SLUG, showcaseNeedsPictures } from "@/lib/timeline/showcase-event";
import { HANNIBAL_ANCHOR_SLUG, HANNIBAL_EVENTS } from "@/lib/timeline/hannibal-seed";
import { DEEP_TIME_ANCHOR_SLUG } from "@/lib/timeline/deep-time-seed";
import { EARLY_SAPIENS_ANCHOR_SLUG } from "@/lib/timeline/early-sapiens-seed";
import { PERIODS_ANCHOR_SLUG } from "@/lib/timeline/period-seed";
import { ATLANTIS_ANCHOR_SLUG } from "@/lib/timeline/atlantis-seed";
import { LEMURIA_ANCHOR_SLUG } from "@/lib/timeline/lemuria-seed";
import { COSMOLOGY_ANCHOR_SLUG } from "@/lib/timeline/cosmology-seed";
import { FLOOD_PHYSICAL_ANCHOR_SLUG } from "@/lib/timeline/flood-physical-seed";
import { FLOOD_MESOPOTAMIA_ANCHOR_SLUG } from "@/lib/timeline/flood-mesopotamia-seed";
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

  const [
    initial,
    tracks,
    sources,
    facets,
    pending,
    markers,
    showcase,
    citations,
    periods,
    periodLinks,
    eventLinks,
    hasHannibal,
    hasDeepTime,
    hasEarlySapiens,
    hasPeriods,
    hasAtlantis,
    hasLemuria,
    hasCosmology,
    hasFloodPhysical,
    hasFloodMesopotamia,
    hannibalNeedsPictures,
  ] = await Promise.all([
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
    // PERIODS ARE FETCHED WHOLE, not by window. There are a dozen or two, they
    // are nearly always wider than what is on screen, and which of them is
    // worth drawing at this zoom is a client-side question that changes on
    // every pan. Two small queries once beats one query per pan.
    getTimelinePeriods(supabase, community.id),
    getTimelinePeriodLinks(supabase, community.id),
    // The edges between records, fetched whole for the same reason the periods
    // are: there are few of them, they are small, and the drawer that reads
    // them opens on any event without another round trip.
    getEventLinks(supabase, community.id),
    // One head-count, to decide whether to offer the Hannibal dataset. Asked
    // only for staff, who are the only people who could act on the answer.
    isStaff ? hasTimelineEvent(supabase, community.id, HANNIBAL_ANCHOR_SLUG) : Promise.resolve(true),
    isStaff ? hasTimelineEvent(supabase, community.id, DEEP_TIME_ANCHOR_SLUG) : Promise.resolve(true),
    isStaff ? hasTimelineEvent(supabase, community.id, EARLY_SAPIENS_ANCHOR_SLUG) : Promise.resolve(true),
    isStaff ? hasTimelinePeriod(supabase, community.id, PERIODS_ANCHOR_SLUG) : Promise.resolve(true),
    isStaff ? hasTimelineEvent(supabase, community.id, ATLANTIS_ANCHOR_SLUG) : Promise.resolve(true),
    isStaff ? hasTimelineEvent(supabase, community.id, LEMURIA_ANCHOR_SLUG) : Promise.resolve(true),
    isStaff ? hasTimelineEvent(supabase, community.id, COSMOLOGY_ANCHOR_SLUG) : Promise.resolve(true),
    isStaff ? hasTimelineEvent(supabase, community.id, FLOOD_PHYSICAL_ANCHOR_SLUG) : Promise.resolve(true),
    isStaff ? hasTimelineEvent(supabase, community.id, FLOOD_MESOPOTAMIA_ANCHOR_SLUG) : Promise.resolve(true),
    // Its events may be here from before it had pictures. Staff only: nobody
    // else could act on the answer.
    isStaff
      ? eventsMissingPictures(
          supabase,
          community.id,
          HANNIBAL_EVENTS.filter((event) => event.imageUrl).map((event) => event.slug)
        )
      : Promise.resolve(false),
  ]);

  // The titles at the ends of those edges. A second query because it depends on
  // the first, and small: the far end of a link is very often outside the
  // window — Sclater's hypothesis is in 1864 and the Mauritia paper in 2017.
  const linkedRecords = await getLinkedRecords(supabase, community.id, eventLinks);

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
        hasEarlySapiens={hasEarlySapiens}
        // The context bands, and the edges between them. Empty is the normal
        // state for a community that has never been offered them — the timeline
        // works exactly as before with no periods at all.
        periods={periods}
        periodLinks={periodLinks}
        eventLinks={eventLinks}
        linkedRecords={linkedRecords}
        hasPeriods={hasPeriods}
        hasAtlantis={hasAtlantis}
        hasLemuria={hasLemuria}
        hasCosmology={hasCosmology}
        hasFloodPhysical={hasFloodPhysical}
        hasFloodMesopotamia={hasFloodMesopotamia}
        hannibalNeedsPictures={hannibalNeedsPictures}
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
