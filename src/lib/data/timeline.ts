import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  TimelineEvent,
  TimelineDateClaim,
  TimelineSource,
  TimelineTrack,
} from "@/types/database";

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
  "id, community_id, created_by, slug, title, summary, description, category, subcategory, tags, location_name, lat, lng, image_url, media, people, civilisations, status, reviewed_by, reviewed_at, created_at, updated_at";

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
 * Whether an event's sources actually disagree — two or more claims that do NOT
 * land in the same place. Two sources that both say 1066 are corroboration, not
 * a dispute, and the "disputed dates" filter would be useless if it counted
 * them.
 */
export function isDisputed(claims: Pick<TimelineDateClaim, "start_position" | "end_position">[]): boolean {
  if (claims.length < 2) return false;
  const first = claims[0];
  return claims.some(
    (claim) =>
      claim.start_position !== first.start_position ||
      (claim.end_position ?? claim.start_position) !== (first.end_position ?? first.start_position)
  );
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

  const eventIds = [...new Set((claims ?? []).map((row) => row.event_id))].slice(0, limit);
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
