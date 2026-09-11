import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  TimelineEvent,
  TimelineDateClaim,
  TimelineSource,
  TimelineTrack,
  TimelineRevision,
  TimelineClaimSource,
  TimelinePeriod,
  TimelinePeriodLink,
} from "@/types/database";
import { claimsDisagree, type ClaimTimeParts } from "@/lib/timeline/time";

type Client = SupabaseClient<Database>;

// Reads for the Interactive Learning Timeline.
//
// THE PERFORMANCE SHAPE. A community's timeline can hold thousands of events
// spread over 13.8 billion years, and the browser must never be asked to hold
// all of them. Every read here is bounded twice over:
//
//   1. By the VISIBLE WINDOW. The axis is a range of years, so the query is a
//      range query on timeline_date_claims.start_position — the indexed,
//      generated column — and events outside it are never fetched. Panning and
//      zooming re-ask (debounced); they do not filter something already loaded.
//   2. By a HARD CAP. A window that would return more rows than the cap returns
//      the cap and says so, so the UI can tell the reader to zoom in rather
//      than quietly drawing a fraction of the truth.
//
// Filters (category, track, viewpoint, disputed-only, …) are applied in the
// query wherever Postgres can do it, so a filtered view of a large timeline
// costs one small result rather than a large one narrowed in JavaScript.

/** An event with everything the timeline draws it from. */
export type TimelineEventWithClaims = TimelineEvent & {
  claims: TimelineDateClaim[];
  trackIds: string[];
};

export type TimelineWindowResult = {
  events: TimelineEventWithClaims[];
  /** Total published events in this community, whatever the window. */
  total: number;
  /** True when the cap bit — there is more in this window than was returned. */
  truncated: boolean;
};

export type TimelineFilters = {
  category?: string | null;
  trackId?: string | null;
  chronology?: string | null;
  sourceType?: string | null;
  person?: string | null;
  civilisation?: string | null;
  /** Only events whose sources place them at different points in time. */
  disputedOnly?: boolean;
  /** Include the viewer's own pending contributions and, for staff, everyone's. */
  includePending?: boolean;
};

// Enough to fill any screen at any zoom several times over, small enough that
// the payload stays in the tens of kilobytes.
export const TIMELINE_WINDOW_CAP = 400;

const EVENT_COLUMNS =
  "id, community_id, created_by, slug, title, summary, description, category, subcategory, event_type, event_type_note, tags, location_name, lat, lng, image_url, media, people, civilisations, status, reviewed_by, reviewed_at, created_at, updated_at";

/**
 * Every event with at least one date claim landing in [from, to].
 *
 * "Landing in" means overlapping, not starting in: a claim that runs
 * 2600–2500 BCE belongs on screen when you are looking at 2550 BCE, and a
 * period that spans the whole window belongs on screen even though neither of
 * its ends is in view.
 */
export async function getTimelineWindow(
  supabase: Client,
  communityId: string,
  from: number,
  to: number,
  filters: TimelineFilters = {},
  cap = TIMELINE_WINDOW_CAP
): Promise<TimelineWindowResult> {
  // The claims in view, with their event embedded so this is one round trip
  // rather than "find ids, then fetch them".
  let query = supabase
    .from("timeline_date_claims")
    .select(`event_id, start_position, end_position, event:event_id!inner (${EVENT_COLUMNS})`)
    .eq("community_id", communityId)
    .lte("start_position", to)
    // Overlap: a point claim ends where it starts, so coalesce is what the
    // filter needs — expressed as "either the end is past `from`, or there is
    // no end and the start is".
    .or(`end_position.gte.${from},and(end_position.is.null,start_position.gte.${from})`)
    .order("start_position", { ascending: true })
    // Claims, not events — several claims can belong to one event, so ask for
    // more rows than the event cap before deduplicating.
    .limit(cap * 3);

  if (!filters.includePending) query = query.eq("event.status", "published");
  if (filters.category) query = query.eq("event.category", filters.category);
  if (filters.chronology) query = query.eq("chronology", filters.chronology);
  if (filters.person) query = query.contains("event.people", [filters.person]);
  if (filters.civilisation) query = query.contains("event.civilisations", [filters.civilisation]);

  const [{ data, error }, total] = await Promise.all([
    query,
    countTimelineEvents(supabase, communityId),
  ]);
  if (error) throw error;

  const rows = (data ?? []) as unknown as { event_id: string; event: TimelineEvent | null }[];

  // Distinct events, in the order their earliest visible claim appears.
  const eventById = new Map<string, TimelineEvent>();
  for (const row of rows) {
    if (!row.event) continue;
    if (!eventById.has(row.event_id)) eventById.set(row.event_id, row.event);
    if (eventById.size >= cap) break;
  }
  const truncated = eventById.size >= cap && rows.length > eventById.size;

  let eventIds = [...eventById.keys()];

  // A track filter is a join, and PostgREST can't express "and it is in this
  // lane" against an embedded resource two levels down — so it narrows the
  // (already capped) id list instead of the whole table.
  if (filters.trackId) {
    const inTrack = await getEventIdsInTracks(supabase, communityId, [filters.trackId]);
    const allowed = new Set(inTrack.map((row) => row.event_id));
    eventIds = eventIds.filter((id) => allowed.has(id));
  }

  if (eventIds.length === 0) return { events: [], total, truncated: false };

  const [claims, trackLinks] = await Promise.all([
    getClaimsForEvents(supabase, eventIds),
    getTrackLinksForEvents(supabase, eventIds),
  ]);

  const claimsByEvent = groupBy(claims, (claim) => claim.event_id);
  const tracksByEvent = groupBy(trackLinks, (link) => link.event_id);

  let events: TimelineEventWithClaims[] = eventIds.map((id) => ({
    ...(eventById.get(id) as TimelineEvent),
    claims: claimsByEvent.get(id) ?? [],
    trackIds: (tracksByEvent.get(id) ?? []).map((link) => link.track_id),
  }));

  if (filters.sourceType) {
    // "Show me what archaeology says" — an event qualifies when any of its
    // claims cites a source of that type.
    const sourceIds = await getSourceIdsOfType(supabase, communityId, filters.sourceType);
    const allowed = new Set(sourceIds);
    events = events.filter((event) => event.claims.some((claim) => claim.source_id && allowed.has(claim.source_id)));
  }

  if (filters.disputedOnly) {
    events = events.filter((event) => isDisputed(event.claims));
  }

  return { events, total, truncated };
}

/**
 * Whether an event's sources actually place it in different stretches of time.
 *
 * Delegates to compareClaims so the "sources disagree" FILTER and the sentence
 * the detail panel prints can never contradict each other — two sources that
 * both say 1066 are corroboration, and two whose ranges overlap have not been
 * caught disagreeing by a distance.
 */
export function isDisputed(claims: ClaimTimeParts[]): boolean {
  return claimsDisagree(claims);
}

/** Every claim on these events — including ones outside the window, so the disagreement shown is the whole disagreement. */
export async function getClaimsForEvents(supabase: Client, eventIds: string[]): Promise<TimelineDateClaim[]> {
  if (eventIds.length === 0) return [];
  const { data, error } = await supabase
    .from("timeline_date_claims")
    .select("*")
    .in("event_id", eventIds)
    .order("start_position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

async function getTrackLinksForEvents(supabase: Client, eventIds: string[]) {
  if (eventIds.length === 0) return [];
  const { data, error } = await supabase
    .from("timeline_event_tracks")
    .select("event_id, track_id")
    .in("event_id", eventIds);
  if (error) throw error;
  return data ?? [];
}

async function getEventIdsInTracks(supabase: Client, communityId: string, trackIds: string[]) {
  const { data, error } = await supabase
    .from("timeline_event_tracks")
    .select("event_id, track_id")
    .eq("community_id", communityId)
    .in("track_id", trackIds);
  if (error) throw error;
  return data ?? [];
}

async function getSourceIdsOfType(supabase: Client, communityId: string, sourceType: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("timeline_sources")
    .select("id")
    .eq("community_id", communityId)
    .eq("source_type", sourceType);
  if (error) throw error;
  return (data ?? []).map((row) => row.id);
}

/**
 * The earliest and latest points anything in this community is claimed to have
 * happened — what the page opens on.
 *
 * A community studying the Tudors should not open on 13.8 billion years of
 * empty axis, and one that has just added the Big Bang should not open on the
 * sixteenth century. Two indexed single-row reads, so this costs nothing.
 */
export async function getTimelineExtent(
  supabase: Client,
  communityId: string
): Promise<{ from: number; to: number } | null> {
  const [earliest, latest] = await Promise.all([
    supabase
      .from("timeline_date_claims")
      .select("start_position")
      .eq("community_id", communityId)
      .order("start_position", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("timeline_date_claims")
      .select("start_position, end_position")
      .eq("community_id", communityId)
      .order("start_position", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (earliest.error) throw earliest.error;
  if (latest.error) throw latest.error;
  if (!earliest.data || !latest.data) return null;

  const from = earliest.data.start_position;
  const to = Math.max(latest.data.end_position ?? latest.data.start_position, from + 1);
  return { from, to };
}

export async function countTimelineEvents(supabase: Client, communityId: string): Promise<number> {
  const { count, error } = await supabase
    .from("timeline_events")
    .select("id", { count: "exact", head: true })
    .eq("community_id", communityId)
    .eq("status", "published");
  if (error) throw error;
  return count ?? 0;
}

/**
 * Search, across everything a reader might remember about an event: its own
 * words, the people and civilisations it names, its tags, and the sources cited
 * for its dates.
 *
 * Three queries rather than one because they ask genuinely different questions
 * of Postgres — ilike over text, containment over arrays, and a hop through
 * claims to sources — and merging three small id sets is cheaper than the
 * single query that could express all three.
 */
export async function searchTimelineEvents(
  supabase: Client,
  communityId: string,
  term: string,
  limit = 40
): Promise<TimelineEventWithClaims[]> {
  const query = term.trim();
  if (query.length < 2) return [];
  // PostgREST's or() takes a comma-separated list, and array containment is
  // written {"value"} — so a comma, bracket, brace or quote in the term would be
  // read as syntax rather than as text. Strip what can't appear in a name
  // anyway; the wildcards go too, so a term of "%" can't match everything.
  const safe = query.replace(/[,()[\]{}"'*\\%]/g, " ").trim();
  if (!safe) return [];
  const like = `%${safe}%`;

  const [textMatches, arrayMatches, sourceMatches] = await Promise.all([
    supabase
      .from("timeline_events")
      .select(EVENT_COLUMNS)
      .eq("community_id", communityId)
      .eq("status", "published")
      .or(
        [
          `title.ilike.${like}`,
          `summary.ilike.${like}`,
          `description.ilike.${like}`,
          `subcategory.ilike.${like}`,
          `location_name.ilike.${like}`,
          `category.ilike.${like}`,
        ].join(",")
      )
      .limit(limit),
    // Arrays are matched by containment, which is exact per element — so this
    // finds "Cleopatra" typed in full, and the ilike pass above catches the
    // half-typed version wherever the name also appears in the text.
    supabase
      .from("timeline_events")
      .select(EVENT_COLUMNS)
      .eq("community_id", communityId)
      .eq("status", "published")
      .or(`tags.cs.{"${safe}"},people.cs.{"${safe}"},civilisations.cs.{"${safe}"}`)
      .limit(limit),
    searchEventsBySource(supabase, communityId, like, limit),
  ]);

  if (textMatches.error) throw textMatches.error;
  if (arrayMatches.error) throw arrayMatches.error;

  const byId = new Map<string, TimelineEvent>();
  for (const event of [...(textMatches.data ?? []), ...(arrayMatches.data ?? []), ...sourceMatches]) {
    byId.set(event.id, event as TimelineEvent);
  }

  const ids = [...byId.keys()].slice(0, limit);
  if (ids.length === 0) return [];

  const claims = await getClaimsForEvents(supabase, ids);
  const claimsByEvent = groupBy(claims, (claim) => claim.event_id);

  return ids.map((id) => ({
    ...(byId.get(id) as TimelineEvent),
    claims: claimsByEvent.get(id) ?? [],
    trackIds: [],
  }));
}

/** Events whose dates cite a source matching the term — "everything from the Anglo-Saxon Chronicle". */
async function searchEventsBySource(supabase: Client, communityId: string, like: string, limit: number): Promise<TimelineEvent[]> {
  const { data: sources, error: sourceError } = await supabase
    .from("timeline_sources")
    .select("id")
    .eq("community_id", communityId)
    .or([`title.ilike.${like}`, `author.ilike.${like}`, `publisher.ilike.${like}`, `work_title.ilike.${like}`].join(","))
    .limit(limit);
  if (sourceError) throw sourceError;
  const sourceIds = (sources ?? []).map((row) => row.id);
  if (sourceIds.length === 0) return [];

  const { data: claims, error: claimError } = await supabase
    .from("timeline_date_claims")
    .select("event_id")
    .eq("community_id", communityId)
    .in("source_id", sourceIds)
    .limit(limit * 2);
  if (claimError) throw claimError;

  // Period boundary claims cite sources too, and they have no event. Dropping
  // them here keeps "what else does this source date?" answering with events.
  const eventIds = [...new Set((claims ?? []).map((row) => row.event_id).filter((id) => id !== null))].slice(0, limit);
  if (eventIds.length === 0) return [];

  const { data, error } = await supabase
    .from("timeline_events")
    .select(EVENT_COLUMNS)
    .in("id", eventIds)
    .eq("status", "published");
  if (error) throw error;
  return (data ?? []) as TimelineEvent[];
}

export async function getTimelineEventBySlug(
  supabase: Client,
  communityId: string,
  slug: string
): Promise<TimelineEventWithClaims | null> {
  const { data, error } = await supabase
    .from("timeline_events")
    .select("*")
    .eq("community_id", communityId)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const [claims, trackLinks] = await Promise.all([
    getClaimsForEvents(supabase, [data.id]),
    getTrackLinksForEvents(supabase, [data.id]),
  ]);

  return { ...data, claims, trackIds: trackLinks.map((link) => link.track_id) };
}

/** Contributions waiting on staff. RLS already limits this to people who may see them. */
export async function getPendingTimelineEvents(
  supabase: Client,
  communityId: string
): Promise<TimelineEventWithClaims[]> {
  const { data, error } = await supabase
    .from("timeline_events")
    .select("*")
    .eq("community_id", communityId)
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) throw error;

  const events = data ?? [];
  if (events.length === 0) return [];

  const claims = await getClaimsForEvents(supabase, events.map((event) => event.id));
  const claimsByEvent = groupBy(claims, (claim) => claim.event_id);
  return events.map((event) => ({ ...event, claims: claimsByEvent.get(event.id) ?? [], trackIds: [] }));
}

export async function getTimelineTracks(supabase: Client, communityId: string): Promise<TimelineTrack[]> {
  const { data, error } = await supabase
    .from("timeline_tracks")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getTimelineSources(supabase: Client, communityId: string): Promise<TimelineSource[]> {
  const { data, error } = await supabase
    .from("timeline_sources")
    .select("*")
    .eq("community_id", communityId)
    .order("title", { ascending: true })
    .limit(500);
  if (error) throw error;
  return data ?? [];
}

export async function getTimelineSourcesByIds(supabase: Client, ids: string[]): Promise<TimelineSource[]> {
  const unique = [...new Set(ids)];
  if (unique.length === 0) return [];
  const { data, error } = await supabase.from("timeline_sources").select("*").in("id", unique);
  if (error) throw error;
  return data ?? [];
}

/** Every event filed in these lanes, for Compare mode. */
export async function getTrackMembership(
  supabase: Client,
  communityId: string
): Promise<Map<string, string[]>> {
  const { data, error } = await supabase
    .from("timeline_event_tracks")
    .select("event_id, track_id")
    .eq("community_id", communityId);
  if (error) throw error;

  const byTrack = new Map<string, string[]>();
  for (const row of data ?? []) {
    const list = byTrack.get(row.track_id);
    if (list) list.push(row.event_id);
    else byTrack.set(row.track_id, [row.event_id]);
  }
  return byTrack;
}

/** The distinct people and civilisations named across a community's timeline — the filter dropdowns' options. */
export async function getTimelineFacets(
  supabase: Client,
  communityId: string
): Promise<{ people: string[]; civilisations: string[]; categories: string[] }> {
  const { data, error } = await supabase
    .from("timeline_events")
    .select("people, civilisations, category")
    .eq("community_id", communityId)
    .eq("status", "published")
    .limit(2000);
  if (error) throw error;

  const people = new Set<string>();
  const civilisations = new Set<string>();
  const categories = new Set<string>();
  for (const row of data ?? []) {
    for (const name of row.people ?? []) people.add(name);
    for (const name of row.civilisations ?? []) civilisations.add(name);
    if (row.category) categories.add(row.category);
  }
  const sort = (values: Set<string>) => [...values].sort((a, b) => a.localeCompare(b));
  return { people: sort(people), civilisations: sort(civilisations), categories: sort(categories) };
}

/**
 * Sources in this community matching what somebody is typing.
 *
 * Reuse is the point of sources being their own records: a community holding
 * "Herodotus — Histories" and "Herodotus Histories" as unrelated rows has lost
 * the ability to ask what else that source dates. This is what prevents that —
 * offered as a suggestion, never as an automatic merge, because different
 * editions, translations and printings of the same work legitimately ARE
 * different records.
 *
 * Matches title, author, publisher and the work the reference points into, so
 * "penguin" finds an edition and "herodotus" finds it by either name.
 */
export async function searchTimelineSources(
  supabase: Client,
  communityId: string,
  term: string,
  limit = 8
): Promise<TimelineSource[]> {
  const safe = term.trim().replace(/[,()[\]{}"'*\\%]/g, " ").trim();
  const query = supabase.from("timeline_sources").select("*").eq("community_id", communityId);

  // An empty box offers the most recently added few, so the first thing a
  // contributor sees is what their community already cites.
  const { data, error } = safe
    ? await query
        .or(
          [`title.ilike.%${safe}%`, `author.ilike.%${safe}%`, `publisher.ilike.%${safe}%`, `work_title.ilike.%${safe}%`].join(",")
        )
        .order("title", { ascending: true })
        .limit(limit)
    : await query.order("created_at", { ascending: false }).limit(limit);

  if (error) throw error;
  return data ?? [];
}

/** How many claims across the community cite each of these sources — "used by 4 dates". */
export async function countClaimsPerSource(
  supabase: Client,
  communityId: string,
  sourceIds: string[]
): Promise<Map<string, number>> {
  const unique = [...new Set(sourceIds)];
  if (unique.length === 0) return new Map();
  const { data, error } = await supabase
    .from("timeline_date_claims")
    .select("source_id")
    .eq("community_id", communityId)
    .in("source_id", unique);
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.source_id) continue;
    counts.set(row.source_id, (counts.get(row.source_id) ?? 0) + 1);
  }
  return counts;
}

/**
 * Everything a source is cited for, across the community.
 *
 * Nothing renders a dedicated source page yet, but a source has always been a
 * many-to-many record — one work dates any number of events — and this is the
 * read that page will need. Keeping it here means the shape is settled now,
 * rather than discovered later by a screen that assumed one source, one claim.
 */
export async function getSourceUsage(
  supabase: Client,
  communityId: string,
  sourceId: string
): Promise<{ claims: TimelineDateClaim[]; events: TimelineEvent[] }> {
  const { data: claims, error } = await supabase
    .from("timeline_date_claims")
    .select("*")
    .eq("community_id", communityId)
    .eq("source_id", sourceId)
    .order("start_position", { ascending: true });
  if (error) throw error;

  const eventIds = [...new Set((claims ?? []).map((claim) => claim.event_id).filter((id) => id !== null))];
  if (eventIds.length === 0) return { claims: claims ?? [], events: [] };

  const { data: events, error: eventError } = await supabase
    .from("timeline_events")
    .select(EVENT_COLUMNS)
    .in("id", eventIds);
  if (eventError) throw eventError;

  return { claims: claims ?? [], events: (events ?? []) as TimelineEvent[] };
}

/**
 * What has been changed on this event, newest first.
 *
 * Indexed on (event_id, created_at desc), so an event's history is an index
 * scan of its own rows rather than a walk of the community's — which is what
 * keeps the panel cheap on a timeline that has been edited for years.
 */
export async function getEventRevisions(
  supabase: Client,
  eventId: string,
  limit = 50
): Promise<(TimelineRevision & { actor: { username: string | null; full_name: string | null } | null })[]> {
  const { data, error } = await supabase
    .from("timeline_revisions")
    .select("*, actor:actor_id (username, full_name)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .limit(limit);

  // RLS limits this to staff. A non-staff reader gets an empty list rather than
  // an error, so the caller doesn't have to ask permission twice.
  if (error) throw error;
  return (data ?? []) as unknown as (TimelineRevision & {
    actor: { username: string | null; full_name: string | null } | null;
  })[];
}

/**
 * The citation chain under a source — Wikipedia → academic book → excavation
 * report.
 *
 * Reads DOWNWARDS from the source given: each step is the source that the
 * previous one led somebody to. That is the direction a learner travels when
 * they answer "can you find the original source?", so it is the direction the
 * chain is drawn.
 *
 * The depth cap is not decoration. `cited_by_source_id` is a plain
 * self-reference and Postgres will happily store A→B→A: the constraint only
 * refuses a source citing itself. A cycle here would be an infinite loop in a
 * server render, so the walk carries a seen-set AND a hard limit, and stops
 * quietly at either. A chain longer than six steps is a research project, not a
 * citation.
 */
export async function getSourceChain(
  supabase: Client,
  communityId: string,
  sourceId: string,
  maxDepth = 6
): Promise<TimelineSource[]> {
  const chain: TimelineSource[] = [];
  const seen = new Set<string>([sourceId]);
  let cursor = sourceId;

  for (let depth = 0; depth < maxDepth; depth++) {
    const { data, error } = await supabase
      .from("timeline_sources")
      .select("*")
      .eq("community_id", communityId)
      .eq("cited_by_source_id", cursor)
      .order("created_at", { ascending: true })
      .limit(1);
    if (error) throw error;

    const next: TimelineSource | undefined = (data ?? [])[0];
    if (!next || seen.has(next.id)) break;
    seen.add(next.id);
    chain.push(next);
    cursor = next.id;
  }

  return chain;
}

/** The chains under several sources at once, so an event's claims cost one pass each rather than one query per card. */
export async function getSourceChains(
  supabase: Client,
  communityId: string,
  sourceIds: string[]
): Promise<Map<string, TimelineSource[]>> {
  const unique = [...new Set(sourceIds)];
  const chains = new Map<string, TimelineSource[]>();
  for (const id of unique) {
    const chain = await getSourceChain(supabase, communityId, id);
    if (chain.length > 0) chains.set(id, chain);
  }
  return chains;
}

/**
 * WHERE EVERY EVENT SITS, and nothing else about it.
 *
 * The overview bar needs one number per event across the whole timeline, which
 * is the one read that cannot be bounded by the visible window — the entire
 * point of it is to show what is OUTSIDE the window.
 *
 * It is affordable because it is numbers. No titles, no summaries, no claims,
 * no sources: a thousand events is a few kilobytes, where a thousand full
 * events would be megabytes. That distinction is what makes this safe and made
 * the earlier "read everything" version not.
 *
 * Loaded with the page, never on a click, so it costs no spinner.
 */
export async function getEventMarkers(
  supabase: Client,
  communityId: string,
  limit = 5_000
): Promise<{ position: number; category: string }[]> {
  const { data, error } = await supabase
    .from("timeline_date_claims")
    .select("start_position, event:event_id!inner (category, status)")
    .eq("community_id", communityId)
    .order("start_position", { ascending: true })
    .limit(limit);
  if (error) throw error;

  const rows = (data ?? []) as unknown as {
    start_position: number;
    event: { category: string | null; status: string } | null;
  }[];

  // One mark per CLAIM, not per event, and deliberately: an event whose sources
  // disagree genuinely occupies two places on the timeline, and the bar that
  // shows you where things are should show both.
  return rows
    .filter((row) => row.event?.status === "published")
    .map((row) => ({ position: row.start_position, category: row.event?.category ?? "other" }));
}

/**
 * Every extra source attached to this community's date claims.
 *
 * Loaded whole rather than per claim, because these are four small columns and
 * a community's entire set of them is smaller than one event's description.
 * Fetching them with the page means a claim card can show what disputes it
 * without a second round trip when somebody opens it.
 */
/**
 * Is one particular event already in this community, by slug?
 *
 * A head-count rather than a fetch: the seed cards only need to know whether
 * the dataset has been taken, and loading a whole event with its claims and
 * sources to answer a yes/no question is work nobody asked for.
 */
export async function hasTimelineEvent(
  supabase: SupabaseClient<Database>,
  communityId: string,
  slug: string
): Promise<boolean> {
  const { count } = await supabase
    .from("timeline_events")
    .select("id", { count: "exact", head: true })
    .eq("community_id", communityId)
    .eq("slug", slug);
  return (count ?? 0) > 0;
}

/**
 * Are any of these events here WITHOUT pictures?
 *
 * For a dataset that gained its images after it was first offered: the events
 * are present, so the seeder skips them, so the pictures never arrive and the
 * offer to add the dataset is long gone. This is the question that puts the
 * offer back.
 */
export async function eventsMissingPictures(
  supabase: SupabaseClient<Database>,
  communityId: string,
  slugs: string[]
): Promise<boolean> {
  if (slugs.length === 0) return false;
  const { data } = await supabase
    .from("timeline_events")
    .select("image_url, media")
    .eq("community_id", communityId)
    .in("slug", slugs);
  return (data ?? []).some((row) => !row.image_url && (row.media ?? []).length === 0);
}

export async function getClaimCitations(
  supabase: Client,
  communityId: string,
  limit = 5_000
): Promise<TimelineClaimSource[]> {
  const { data, error } = await supabase
    .from("timeline_claim_sources")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Periods
// ---------------------------------------------------------------------------

export type TimelinePeriodWithClaims = TimelinePeriod & { claims: TimelineDateClaim[] };

/**
 * Every period this community has, with its boundary claims and its links.
 *
 * FETCHED WHOLE, NOT BY WINDOW, and that is the one place this file breaks its
 * own rule. Events are fetched by the visible window because there can be
 * thousands of them; periods are fetched entire because there are a dozen or
 * two, and because the window test that is right for an event is wrong for a
 * period. At a hundred thousand years ago the Middle Palaeolithic runs off both
 * edges of the screen — an overlap filter tuned for events would drop precisely
 * the band the reader is standing inside.
 *
 * Three queries, not N+1: the periods, then their claims in one `in`, then
 * their links in one more. Which periods are worth DRAWING at this zoom is
 * decided on the client from what comes back (see periodBands), because that
 * question changes on every pan and the answer is already in memory.
 */
export async function getTimelinePeriods(
  supabase: Client,
  communityId: string
): Promise<TimelinePeriodWithClaims[]> {
  const { data, error } = await supabase
    .from("timeline_periods")
    .select("*")
    .eq("community_id", communityId)
    .eq("status", "published")
    .order("display_priority", { ascending: false })
    .order("name", { ascending: true });
  if (error) throw error;

  const periods = data ?? [];
  if (periods.length === 0) return [];

  const { data: claims, error: claimError } = await supabase
    .from("timeline_date_claims")
    .select("*")
    .in("period_id", periods.map((period) => period.id))
    .order("start_position", { ascending: true });
  if (claimError) throw claimError;

  const byPeriod = groupBy(claims ?? [], (claim) => claim.period_id);
  return periods.map((period) => ({ ...period, claims: byPeriod.get(period.id) ?? [] }));
}

/** The edges between this community's periods — hierarchy and "worth reading together". */
export async function getTimelinePeriodLinks(
  supabase: Client,
  communityId: string
): Promise<TimelinePeriodLink[]> {
  const { data, error } = await supabase
    .from("timeline_period_links")
    .select("*")
    .eq("community_id", communityId);
  if (error) throw error;
  return data ?? [];
}

/** One row, to answer "does this community already have the period set?". */
export async function hasTimelinePeriod(
  supabase: Client,
  communityId: string,
  slug: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("timeline_periods")
    .select("id")
    .eq("community_id", communityId)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}

function groupBy<T, K>(rows: T[], key: (row: T) => K): Map<K, T[]> {
  const grouped = new Map<K, T[]>();
  for (const row of rows) {
    const k = key(row);
    const list = grouped.get(k);
    if (list) list.push(row);
    else grouped.set(k, [row]);
  }
  return grouped;
}
