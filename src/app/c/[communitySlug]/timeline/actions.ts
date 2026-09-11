"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getMembership, isCommunityStaff, isCommunityMember } from "@/lib/data/community";
import {
  getTimelineWindow,
  getTimelineEventBySlug,
  searchTimelineEvents,
  searchTimelineSources,
  countClaimsPerSource,
  getEventRevisions,
  type TimelineFilters,
  type TimelineEventWithClaims,
} from "@/lib/data/timeline";
import { communityHasTimeline, timelinePath } from "@/lib/timeline/availability";

import { STARTER_TRACKS } from "@/lib/timeline/taxonomy";
import {
  SHOWCASE_CLAIMS,
  SHOWCASE_EVENT,
  SHOWCASE_EVENT_SLUG,
  SHOWCASE_SOURCES,
} from "@/lib/timeline/showcase-event";
import { bringEventPicturesIn, isHotlinked } from "@/lib/timeline/bring-in-image";
import {
  claimDraftSchema,
  eventDraftSchema,
  resolveDateInput,
  resolveUncertaintyYears,
  sourceDraftSchema,
  type ClaimDraft,
  type SourceDraft,
} from "@/lib/timeline/draft";
import { slugify, normalizeUrl } from "@/lib/utils";
import { readSourceLink, type LinkReadResult } from "@/lib/timeline/source-link";
import type { Community, CommunityMembership, TimelineSource, TimelineRevision } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type TimelineFormState = { error: string } | { ok: true; slug: string } | undefined;

// Everything here re-resolves the community and the viewer's membership from
// the session rather than trusting anything the form sent. RLS would stop a
// forged community_id on its own, but a server action that checks first turns
// "permission denied" into a sentence a person can act on.
async function requireTimelineWriter(communitySlug: string): Promise<
  | { error: string }
  | {
      supabase: SupabaseClient<Database>;
      community: Community;
      membership: CommunityMembership | null;
      userId: string;
      isStaff: boolean;
    }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return { error: "That community no longer exists." };
  if (!communityHasTimeline(community)) return { error: "This community doesn't have a timeline." };

  const membership = await getMembership(supabase, community.id, user.id);
  if (!isCommunityMember(community, membership, user.id)) {
    return { error: "Join this community to add to its timeline." };
  }

  return {
    supabase,
    community,
    membership,
    userId: user.id,
    isStaff: isCommunityStaff(community, membership, user.id),
  };
}

/** A slug nobody else in this community is using. */
async function uniqueEventSlug(
  supabase: SupabaseClient<Database>,
  communityId: string,
  title: string
): Promise<string> {
  const root = slugify(title) || "event";
  const { data } = await supabase
    .from("timeline_events")
    .select("slug")
    .eq("community_id", communityId)
    .like("slug", `${root}%`);

  const taken = new Set((data ?? []).map((row) => row.slug));
  if (!taken.has(root)) return root;
  for (let i = 2; i < 200; i++) {
    const candidate = `${root}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${root}-${Date.now()}`;
}

/** A source id, but only if it belongs to this community — otherwise null. */
async function sameCommunitySourceId(
  supabase: SupabaseClient<Database>,
  communityId: string,
  sourceId: string | null | undefined
): Promise<string | null> {
  if (!sourceId) return null;
  const { data } = await supabase
    .from("timeline_sources")
    .select("id")
    .eq("id", sourceId)
    .eq("community_id", communityId)
    .maybeSingle();
  return data?.id ?? null;
}

/**
 * Add a source, or reuse one already cited in this community.
 *
 * The source's own date is written to its own columns, never to the claim's —
 * keeping "when the Anglo-Saxon Chronicle was compiled" and "when the Battle of
 * Hastings happened" as the two different facts they are (§8 of the brief).
 */
async function resolveSourceId(
  supabase: SupabaseClient<Database>,
  communityId: string,
  userId: string,
  // Only the two fields that answer "which source?" — so the underlying-source
  // action can reuse this without inventing a claim it doesn't have.
  claim: Pick<ClaimDraft, "source_id" | "new_source">
): Promise<string | null> {
  if (claim.source_id) return claim.source_id;
  const draft: SourceDraft | null | undefined = claim.new_source;
  if (!draft || !draft.title.trim()) return null;

  const published = resolveDateInput(draft.published);

  const { data, error } = await supabase
    .from("timeline_sources")
    .insert({
      community_id: communityId,
      created_by: userId,
      title: draft.title.trim(),
      author: draft.author?.trim() || null,
      publisher: draft.publisher?.trim() || null,
      work_title: draft.work_title?.trim() || null,
      reference: draft.reference?.trim() || null,
      url: draft.url?.trim() ? normalizeUrl(draft.url) : null,
      file_url: draft.file_url?.trim() || null,
      source_type: draft.source_type || "other",
      notes: draft.notes?.trim() || null,
      // When somebody looked at it — the fact that makes a citation to an
      // editable page checkable by the next reader.
      accessed_on: draft.accessed_on?.trim() || null,
      quotation: draft.quotation?.trim() || null,
      // The source this one was found THROUGH. Only ever a source in the same
      // community: RLS would refuse a foreign id, but checking here turns a
      // permission error into nothing at all, which is what a broken chain
      // should cost.
      cited_by_source_id: (await sameCommunitySourceId(supabase, communityId, draft.cited_by_source_id)) ?? null,
      published_year: published?.year ?? null,
      published_month: published?.month ?? null,
      published_day: published?.day ?? null,
      published_is_approximate: draft.published_is_approximate ?? false,
      published_display: draft.published_display?.trim() || "",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

type ClaimRow = Database["public"]["Tables"]["timeline_date_claims"]["Insert"];

function claimRow(
  claim: ClaimDraft,
  eventId: string,
  communityId: string,
  userId: string,
  sourceId: string | null
): ClaimRow | null {
  const start = resolveDateInput(claim.start);
  if (!start) return null;
  const end = resolveDateInput(claim.end);
  // Typed in the claim's own unit ("± 0.021" beside "13.799 billion"), stored
  // in years so every comparison is a subtraction.
  const uncertainty = resolveUncertaintyYears(claim);

  return {
    event_id: eventId,
    community_id: communityId,
    created_by: userId,
    source_id: sourceId,
    start_year: start.year,
    start_month: start.month,
    start_day: start.day,
    end_year: end?.year ?? null,
    end_month: end?.month ?? null,
    end_day: end?.day ?? null,
    date_precision: claim.date_precision || "year",
    precision_decimals: claim.precision_decimals ?? 0,
    is_approximate: claim.is_approximate ?? false,
    uncertainty_plus: uncertainty.plus,
    uncertainty_minus: uncertainty.minus,
    // Verbatim, and the one field normalisation is never allowed to touch.
    original_date_text: claim.original_date_text?.trim() || "",
    dating_method: claim.dating_method || null,
    chronology: claim.chronology || null,
    evidence: claim.evidence?.trim() || null,
    notes: claim.notes?.trim() || null,
  };
}

/**
 * The whole "Add event" flow, in one submission: the event, every proposed
 * date, and any source added along the way.
 *
 * Staff publish straight away; anyone else's entry lands as 'pending' and is
 * invisible to the community until staff approve it — the moderation pattern
 * business claims and crop proposals already use. RLS forces that status
 * independently, so this is the message, not the gate.
 */
export async function createTimelineEvent(
  _prevState: TimelineFormState,
  formData: FormData
): Promise<TimelineFormState> {
  const communitySlug = String(formData.get("community_slug") ?? "");
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;

  let payload: unknown;
  try {
    payload = JSON.parse(String(formData.get("draft") ?? "{}"));
  } catch {
    return { error: "Something went wrong reading the form. Please try again." };
  }

  const parsed = eventDraftSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first ? `${first.path.join(".") || "That"} isn't right: ${first.message}` : "Please check the form." };
  }
  const draft = parsed.data;

  if (!draft.claims.some((claim) => resolveDateInput(claim.start))) {
    return { error: "Add at least one proposed date — an event needs somewhere to sit on the timeline." };
  }

  const slug = await uniqueEventSlug(supabase, community.id, draft.title);

  const { data: event, error: eventError } = await supabase
    .from("timeline_events")
    .insert({
      community_id: community.id,
      created_by: userId,
      slug,
      title: draft.title,
      summary: draft.summary ?? "",
      description: draft.description ?? "",
      category: draft.category || "other",
      subcategory: draft.subcategory?.trim() || null,
      event_type: draft.event_type?.trim() || null,
      event_type_note: draft.event_type_note?.trim() || null,
      tags: draft.tags ?? [],
      people: draft.people ?? [],
      civilisations: draft.civilisations ?? [],
      location_name: draft.location_name?.trim() || null,
      lat: draft.lat ?? null,
      lng: draft.lng ?? null,
      image_url: draft.image_url?.trim() || null,
      status: isStaff ? "published" : "pending",
    })
    .select("id, slug")
    .single();

  if (eventError) return { error: eventError.message };

  const rows: ClaimRow[] = [];
  try {
    for (const claim of draft.claims) {
      const sourceId = await resolveSourceId(supabase, community.id, userId, claim);
      const row = claimRow(claim, event.id, community.id, userId, sourceId);
      if (row) rows.push(row);
    }
  } catch (error) {
    // The event exists but has no date yet, which would leave an entry that can
    // never be drawn. Take it back out rather than leave that behind.
    await supabase.from("timeline_events").delete().eq("id", event.id);
    return { error: error instanceof Error ? error.message : "Couldn't save the source." };
  }

  if (rows.length === 0) {
    await supabase.from("timeline_events").delete().eq("id", event.id);
    return { error: "Add at least one proposed date — an event needs somewhere to sit on the timeline." };
  }

  const { error: claimError } = await supabase.from("timeline_date_claims").insert(rows);
  if (claimError) {
    await supabase.from("timeline_events").delete().eq("id", event.id);
    return { error: claimError.message };
  }

  if (draft.track_ids.length > 0) {
    // Filing into a lane is a nicety, not the entry — a lane that has since been
    // deleted shouldn't cost somebody their event.
    await supabase.from("timeline_event_tracks").insert(
      draft.track_ids.map((trackId) => ({ event_id: event.id, track_id: trackId, community_id: community.id }))
    );
  }

  revalidatePath(timelinePath(community.slug));
  return { ok: true, slug: event.slug };
}

/** "Add another proposed date" on an event that already exists. */
export async function addDateClaim(
  _prevState: TimelineFormState,
  formData: FormData
): Promise<TimelineFormState> {
  const communitySlug = String(formData.get("community_slug") ?? "");
  const eventId = String(formData.get("event_id") ?? "");
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId } = context;

  let payload: unknown;
  try {
    payload = JSON.parse(String(formData.get("claim") ?? "{}"));
  } catch {
    return { error: "Something went wrong reading the form. Please try again." };
  }

  const parsed = eventDraftSchema.shape.claims.element.safeParse(payload);
  if (!parsed.success) return { error: "Please check the date you entered." };

  const { data: event, error: lookupError } = await supabase
    .from("timeline_events")
    .select("id, slug, community_id")
    .eq("id", eventId)
    .eq("community_id", community.id)
    .maybeSingle();
  if (lookupError) return { error: lookupError.message };
  if (!event) return { error: "That event no longer exists." };

  let sourceId: string | null = null;
  try {
    sourceId = await resolveSourceId(supabase, community.id, userId, parsed.data);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save the source." };
  }

  const row = claimRow(parsed.data, event.id, community.id, userId, sourceId);
  if (!row) return { error: "That date isn't complete." };

  const { error } = await supabase.from("timeline_date_claims").insert(row);
  if (error) return { error: error.message };

  revalidatePath(timelinePath(community.slug));
  revalidatePath(`${timelinePath(community.slug)}/${event.slug}`);
  return { ok: true, slug: event.slug };
}

// ---------------------------------------------------------------------------
// Editing
//
// WHO MAY EDIT, AND WHAT IT COSTS
//
// Staff edit anything, and it stays published — approving something and then
// fixing a typo in it should not queue it behind themselves.
//
// A contributor may keep editing their OWN entry. While it is pending that is
// free. Once staff have published it, editing it sends it back for approval:
// otherwise "add an event, wait for approval, then rewrite it" is a way past
// moderation, and the whole queue is theatre. The UI says this before they
// start, not after they save.
//
// This is enforced three times over, which is deliberate: the events table's
// RLS with-check refuses a member writing a published row at all, the trigger
// in …_timeline_v1_hardening.sql catches a member editing the DATES of a
// published event, and the code below is what turns either into a sentence
// somebody can act on rather than "permission denied".
//
// Nothing here deletes and recreates. An edit keeps the event's id, its slug,
// its claims, its sources and its lanes — see updateTimelineEvent on why the
// slug in particular is left alone.
// ---------------------------------------------------------------------------

/** Whether this edit puts the event back in the moderation queue, and why. */
type EditVerdict = { returnsToQueue: boolean };

function editVerdict(status: string, isStaff: boolean): EditVerdict {
  return { returnsToQueue: !isStaff && status === "published" };
}

export type TimelineEditState = { error: string } | { ok: true; slug: string; returnedToQueue: boolean } | undefined;

export async function updateTimelineEvent(
  _prevState: TimelineEditState,
  formData: FormData
): Promise<TimelineEditState> {
  const communitySlug = String(formData.get("community_slug") ?? "");
  const eventId = String(formData.get("event_id") ?? "");
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;

  let payload: unknown;
  try {
    payload = JSON.parse(String(formData.get("draft") ?? "{}"));
  } catch {
    return { error: "Something went wrong reading the form. Please try again." };
  }

  // The claims are edited one at a time by their own actions, so the event form
  // validates against everything except them.
  const parsed = eventDraftSchema.omit({ claims: true }).safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first ? `${first.path.join(".") || "That"} isn't right: ${first.message}` : "Please check the form." };
  }
  const draft = parsed.data;

  const { data: current, error: lookupError } = await supabase
    .from("timeline_events")
    .select("id, slug, status, created_by")
    .eq("id", eventId)
    .eq("community_id", community.id)
    .maybeSingle();
  if (lookupError) return { error: lookupError.message };
  if (!current) return { error: "That event no longer exists." };

  if (!isStaff && current.created_by !== userId) {
    return { error: "Only the person who added this event, or the community's teachers, can edit it." };
  }

  const verdict = editVerdict(current.status, isStaff);

  const { error } = await supabase
    .from("timeline_events")
    .update({
      // SLUG DELIBERATELY ABSENT. Renaming an event must not break a link
      // somebody bookmarked, shared or put in a lesson — and Relate already
      // works this way: updateSpace renames a space and never touches its slug.
      title: draft.title,
      summary: draft.summary ?? "",
      description: draft.description ?? "",
      category: draft.category || "other",
      subcategory: draft.subcategory?.trim() || null,
      event_type: draft.event_type?.trim() || null,
      event_type_note: draft.event_type_note?.trim() || null,
      tags: draft.tags ?? [],
      people: draft.people ?? [],
      civilisations: draft.civilisations ?? [],
      location_name: draft.location_name?.trim() || null,
      lat: draft.lat ?? null,
      lng: draft.lng ?? null,
      image_url: draft.image_url?.trim() || null,
      ...(verdict.returnsToQueue ? { status: "pending" as const, reviewed_by: null, reviewed_at: null } : {}),
    })
    .eq("id", eventId);

  if (error) return { error: error.message };

  const trackResult = await setEventTracks(eventId, communitySlug, draft.track_ids ?? []);
  if (trackResult && "error" in trackResult) return { error: trackResult.error };

  revalidatePath(timelinePath(community.slug));
  revalidatePath(`${timelinePath(community.slug)}/${current.slug}`);
  return { ok: true, slug: current.slug, returnedToQueue: verdict.returnsToQueue };
}

/**
 * Edit one proposed date, in place.
 *
 * In place matters: the claim keeps its id, so its revision history stays
 * attached to it and "the date was changed from X to Y" survives as one thread
 * rather than becoming a deletion next to an unrelated addition.
 *
 * The source may be swapped for another the community already has, or a new one
 * added here. Detaching it entirely is allowed too — a claim whose source turned
 * out to be wrong is better shown as unsourced than as sourced to the wrong
 * thing.
 */
export async function updateDateClaim(
  _prevState: TimelineEditState,
  formData: FormData
): Promise<TimelineEditState> {
  const communitySlug = String(formData.get("community_slug") ?? "");
  const claimId = String(formData.get("claim_id") ?? "");
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;

  let payload: unknown;
  try {
    payload = JSON.parse(String(formData.get("claim") ?? "{}"));
  } catch {
    return { error: "Something went wrong reading the form. Please try again." };
  }

  const parsed = claimDraftSchema.safeParse(payload);
  if (!parsed.success) return { error: "Please check the date you entered." };

  const { data: existing, error: lookupError } = await supabase
    .from("timeline_date_claims")
    .select("id, event_id, created_by")
    .eq("id", claimId)
    .eq("community_id", community.id)
    .maybeSingle();
  if (lookupError) return { error: lookupError.message };
  if (!existing) return { error: "That proposed date no longer exists." };

  const { data: event } = await supabase
    .from("timeline_events")
    .select("id, slug, status, created_by")
    .eq("id", existing.event_id)
    .maybeSingle();
  if (!event) return { error: "That event no longer exists." };

  if (!isStaff && existing.created_by !== userId && event.created_by !== userId) {
    return { error: "Only the person who proposed this date, or the community's teachers, can change it." };
  }

  let sourceId: string | null;
  try {
    sourceId = await resolveSourceId(supabase, community.id, userId, parsed.data);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save the source." };
  }

  const row = claimRow(parsed.data, existing.event_id, community.id, userId, sourceId);
  if (!row) return { error: "That date isn't complete." };

  // created_by, event_id and community_id are deliberately not in this update.
  // An edit is recorded as a revision with its own actor; overwriting created_by
  // here would quietly reassign the claim to whoever last touched it, and the
  // other two would let a malformed payload move a claim between events or
  // communities.
  const changes = {
    source_id: row.source_id,
    start_year: row.start_year,
    start_month: row.start_month,
    start_day: row.start_day,
    end_year: row.end_year,
    end_month: row.end_month,
    end_day: row.end_day,
    date_precision: row.date_precision,
    precision_decimals: row.precision_decimals,
    is_approximate: row.is_approximate,
    uncertainty_plus: row.uncertainty_plus,
    uncertainty_minus: row.uncertainty_minus,
    original_date_text: row.original_date_text,
    dating_method: row.dating_method,
    chronology: row.chronology,
    evidence: row.evidence,
    notes: row.notes,
  };

  const verdict = editVerdict(event.status, isStaff);

  const { error } = await supabase.from("timeline_date_claims").update(changes).eq("id", claimId);
  if (error) return { error: error.message };

  revalidatePath(timelinePath(community.slug));
  revalidatePath(`${timelinePath(community.slug)}/${event.slug}`);
  return { ok: true, slug: event.slug, returnedToQueue: verdict.returnsToQueue };
}

/**
 * Read a pasted link into source fields.
 *
 * Gated on being able to write to this community's timeline, and not because
 * the result is sensitive: an action that fetches any URL a stranger names is a
 * fetch proxy pointed at our network, and the cheapest way not to run one is to
 * ask who is calling. isPublicHttpUrl covers the rest.
 *
 * Failure is never fatal here. A site that refuses a server-side request has
 * cost the contributor nothing but a moment — the link is still a good source,
 * it just has to be typed, and the message says so.
 */
export async function importSourceFromLink(communitySlug: string, url: string): Promise<LinkReadResult> {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return { ok: false, error: context.error };
  return readSourceLink(url);
}

/**
 * "+ Add underlying source" — the source a Wikipedia article (or anything else)
 * led somebody to.
 *
 * This is the whole point of the chain: an encyclopedia entry is a summary of
 * other people's work, that work is listed at the bottom of it, and following
 * the list is the research habit worth teaching. The new source is a full
 * source in its own right — citable by any other date in the community — that
 * additionally records the route somebody took to reach it.
 *
 * Membership is required and RLS enforces it a second time. The citing source
 * is re-checked against the community rather than trusted from the form.
 */
export async function addUnderlyingSource(
  communitySlug: string,
  citedBySourceId: string,
  draft: unknown
): Promise<{ ok: true; source: TimelineSource } | { ok: false; error: string }> {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return { ok: false, error: context.error };
  const { supabase, community, userId } = context;

  const parsed = sourceDraftSchema.safeParse(draft);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the source details." };
  }

  const citing = await sameCommunitySourceId(supabase, community.id, citedBySourceId);
  if (!citing) return { ok: false, error: "That source is no longer here." };

  const id = await resolveSourceId(supabase, community.id, userId, {
    source_id: null,
    new_source: { ...parsed.data, cited_by_source_id: citing },
  });
  if (!id) return { ok: false, error: "Give the source a title." };

  const { data, error } = await supabase.from("timeline_sources").select("*").eq("id", id).single();
  if (error) return { ok: false, error: error.message };

  revalidatePath(timelinePath(community.slug));
  return { ok: true, source: data };
}

/** Sources this community already has, for the autocomplete in the claim form. */
export async function findTimelineSources(
  communitySlug: string,
  term: string
): Promise<(TimelineSource & { useCount: number })[]> {
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) return [];

  const sources = await searchTimelineSources(supabase, community.id, term);
  // "Used by 4 dates" is what tells a contributor this is the record their
  // community actually cites, rather than one of three near-identical rows.
  const counts = await countClaimsPerSource(supabase, community.id, sources.map((source) => source.id));
  return sources.map((source) => ({ ...source, useCount: counts.get(source.id) ?? 0 }));
}

/** What has been changed on this event. Staff only — RLS says so as well. */
export async function loadEventRevisions(
  communitySlug: string,
  eventId: string
): Promise<(TimelineRevision & { actor: { username: string | null; full_name: string | null } | null })[]> {
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) return [];
  return getEventRevisions(supabase, eventId);
}

/**
 * Remove one proposed date.
 *
 * Refused when it is the last one: an event with no date claims cannot be
 * placed on the axis at all, so it would vanish from the timeline while still
 * existing in the database — a record nobody can find and nobody can fix.
 * Deleting the event is the honest way to do that, and says so.
 */
export async function deleteDateClaim(claimId: string, communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community } = context;

  const { data: claim, error: lookupError } = await supabase
    .from("timeline_date_claims")
    .select("id, event_id")
    .eq("id", claimId)
    .eq("community_id", community.id)
    .maybeSingle();
  if (lookupError) return { error: lookupError.message };
  if (!claim) return { ok: true };

  const { count, error: countError } = await supabase
    .from("timeline_date_claims")
    .select("id", { count: "exact", head: true })
    .eq("event_id", claim.event_id);
  if (countError) return { error: countError.message };
  if ((count ?? 0) <= 1) {
    return { error: "This is the only proposed date on this event — remove the event itself, or add another date first." };
  }

  const { error } = await supabase.from("timeline_date_claims").delete().eq("id", claimId);
  if (error) return { error: error.message };
  revalidatePath(timelinePath(community.slug));
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Moderation — staff only, enforced by RLS as well as by these checks
// ---------------------------------------------------------------------------

export async function reviewTimelineEvent(
  eventId: string,
  communitySlug: string,
  decision: "published" | "rejected"
) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can approve timeline entries." };

  const { error } = await supabase
    .from("timeline_events")
    .update({ status: decision, reviewed_by: userId, reviewed_at: new Date().toISOString() })
    .eq("id", eventId)
    .eq("community_id", community.id);

  if (error) return { error: error.message };
  revalidatePath(timelinePath(community.slug));
  return { ok: true };
}

export async function deleteTimelineEvent(eventId: string, communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community } = context;

  // Claims and track links cascade with the event.
  const { error } = await supabase.from("timeline_events").delete().eq("id", eventId).eq("community_id", community.id);
  if (error) return { error: error.message };
  revalidatePath(timelinePath(community.slug));
  return { ok: true };
}

/** Create the starter lanes for Compare mode. Once created they are the community's own to rename or delete. */
export async function seedStarterTracks(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can set up the compare lanes." };

  const { data: existing } = await supabase
    .from("timeline_tracks")
    .select("slug")
    .eq("community_id", community.id);
  const taken = new Set((existing ?? []).map((row) => row.slug));

  const rows = STARTER_TRACKS.filter((track) => !taken.has(track.slug)).map((track, index) => ({
    community_id: community.id,
    created_by: userId,
    name: track.name,
    slug: track.slug,
    kind: track.kind,
    color: track.color,
    sort_order: index,
  }));
  if (rows.length === 0) return { ok: true };

  const { error } = await supabase.from("timeline_tracks").insert(rows);
  if (error) return { error: error.message };
  revalidatePath(timelinePath(community.slug));
  return { ok: true };
}

/** Put an event into (or take it out of) a lane. */
/**
 * Seed the Great Pyramid worked example into this community's timeline.
 *
 * The same shape as seedStarterTracks above — staff only, in-app, idempotent —
 * because that is how this feature already seeds things and a second mechanism
 * would be a second thing to keep working. Nothing is written into a community
 * that has not asked for it.
 *
 * IDEMPOTENT BY SLUG AND TITLE. Run twice and the second run is a no-op: the
 * event is matched on its slug within the community, and each source on its
 * title. That matters more than usual here, because the alternative to a
 * no-op is five duplicate claims on a showcase event.
 */
export async function seedShowcaseEvent(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the worked example." };

  // Already here? Then there is nothing to do, and saying so is better than
  // quietly making a second copy.
  const { data: existing } = await supabase
    .from("timeline_events")
    .select("id, slug, image_url, media")
    .eq("community_id", community.id)
    .eq("slug", SHOWCASE_EVENT_SLUG)
    .maybeSingle();
  if (existing) {
    // Already here — but a copy seeded before the pictures were brought in is
    // still pointing at somebody else's server, and those photographs do not
    // load. Running this again repairs that in place rather than making a
    // second copy of the event, which is the only thing the reader wants.
    const externals = [existing.image_url, ...(existing.media ?? []).map((item) => item.url)].filter(isHotlinked);
    if (externals.length === 0) return { ok: true as const, slug: existing.slug };

    const { pictures, broughtIn } = await bringEventPicturesIn(supabase, {
      pictures: { imageUrl: existing.image_url, media: existing.media ?? [] },
      userId,
      slug: SHOWCASE_EVENT_SLUG,
    });
    if (broughtIn > 0) {
      await supabase
        .from("timeline_events")
        .update({ image_url: pictures.imageUrl, media: pictures.media })
        .eq("id", existing.id);
      revalidatePath(timelinePath(community.slug));
    }
    return { ok: true as const, slug: existing.slug, broughtIn };
  }

  // Sources first: the claims need their ids. Reuse a source the community
  // already has under the same title rather than adding a near-duplicate —
  // the same rule the source picker teaches contributors.
  const { data: known } = await supabase
    .from("timeline_sources")
    .select("id, title")
    .eq("community_id", community.id);
  const byTitle = new Map((known ?? []).map((row) => [row.title, row.id]));
  const sourceIds = new Map<string, string>();

  for (const source of SHOWCASE_SOURCES) {
    const already = byTitle.get(source.title);
    if (already) {
      sourceIds.set(source.key, already);
      continue;
    }
    const { data, error } = await supabase
      .from("timeline_sources")
      .insert({
        community_id: community.id,
        created_by: userId,
        title: source.title,
        author: source.author ?? null,
        publisher: source.publisher ?? null,
        work_title: source.workTitle ?? null,
        reference: source.reference ?? null,
        url: source.url ?? null,
        source_type: source.sourceType,
        notes: source.notes,
        published_year: source.publishedYear ?? null,
        published_display: source.publishedDisplay ?? "",
        published_is_approximate: false,
      })
      .select("id")
      .single();
    if (error) return { error: error.message };
    sourceIds.set(source.key, data.id);
  }

  // The citation chain, wired once every source has an id. Only where the
  // relationship is genuinely true — Wikipedia really does cite these papers.
  for (const source of SHOWCASE_SOURCES) {
    if (!source.citedBy) continue;
    const child = sourceIds.get(source.key);
    const parent = sourceIds.get(source.citedBy);
    if (!child || !parent) continue;
    await supabase.from("timeline_sources").update({ cited_by_source_id: parent }).eq("id", child);
  }

  // The photographs, copied into this community's own storage before the event
  // is written, so the event never carries a URL that points somewhere we do
  // not control. Anything that cannot be copied keeps its original URL, which
  // is no worse than the behaviour this replaces.
  const { pictures: seedPictures } = await bringEventPicturesIn(supabase, {
    pictures: { imageUrl: SHOWCASE_EVENT.imageUrl, media: [...SHOWCASE_EVENT.media] },
    userId,
    slug: SHOWCASE_EVENT_SLUG,
  });

  const { data: event, error: eventError } = await supabase
    .from("timeline_events")
    .insert({
      community_id: community.id,
      created_by: userId,
      slug: SHOWCASE_EVENT.slug,
      title: SHOWCASE_EVENT.title,
      summary: SHOWCASE_EVENT.summary,
      description: SHOWCASE_EVENT.description,
      category: SHOWCASE_EVENT.category,
      subcategory: SHOWCASE_EVENT.subcategory,
      event_type: SHOWCASE_EVENT.eventType,
      event_type_note: SHOWCASE_EVENT.eventTypeNote,
      tags: SHOWCASE_EVENT.tags,
      people: SHOWCASE_EVENT.people,
      civilisations: SHOWCASE_EVENT.civilisations,
      location_name: SHOWCASE_EVENT.locationName,
      lat: SHOWCASE_EVENT.lat,
      lng: SHOWCASE_EVENT.lng,
      image_url: seedPictures.imageUrl,
      media: seedPictures.media,
      // Staff are seeding it, so it goes straight in — the same as anything
      // else staff add. RLS allows this only because isStaff was checked above.
      status: "published",
    })
    .select("id, slug")
    .single();
  if (eventError) return { error: eventError.message };

  const rows = SHOWCASE_CLAIMS.map((claim) => ({
    event_id: event.id,
    community_id: community.id,
    created_by: userId,
    source_id: claim.sourceKey ? sourceIds.get(claim.sourceKey) ?? null : null,
    start_year: claim.startYear,
    end_year: claim.endYear ?? null,
    date_precision: claim.datePrecision,
    is_approximate: claim.isApproximate,
    original_date_text: claim.originalDateText,
    dating_method: claim.datingMethod,
    chronology: claim.chronology,
    evidence: claim.evidence,
    notes: claim.notes ?? null,
  }));

  const { data: insertedClaims, error: claimError } = await supabase
    .from("timeline_date_claims")
    .insert(rows)
    .select("id, original_date_text");
  if (claimError) {
    // An event with no dates cannot be drawn. Take it back out rather than
    // leave a showcase entry that the timeline cannot show.
    await supabase.from("timeline_events").delete().eq("id", event.id);
    return { error: claimError.message };
  }

  // The further sources on each claim — the supporting evidence, the published
  // criticism, the context. Matched back to the claim by its date text, which
  // is unique within this seed and is what the insert returned.
  const claimIdByText = new Map<string, string>(
    (insertedClaims ?? []).map((row) => [row.original_date_text, row.id])
  );
  const citationRows = SHOWCASE_CLAIMS.flatMap((claim) => {
    const claimId = claimIdByText.get(claim.originalDateText);
    if (!claimId) return [];
    return (claim.citations ?? []).flatMap((citation, index) => {
      const sourceId = sourceIds.get(citation.sourceKey);
      if (!sourceId) return [];
      return [{
        claim_id: claimId,
        source_id: sourceId,
        community_id: community.id,
        created_by: userId,
        relation: citation.relation,
        note: citation.note,
        sort_order: index,
      }];
    });
  });

  if (citationRows.length > 0) {
    const { error: citationError } = await supabase.from("timeline_claim_sources").insert(citationRows);
    // Not fatal: the event and its claims are the entry, and an entry missing
    // its further reading is worth far more than no entry at all.
    // Logged whole: the first time this failed, `.message` was undefined and
    // the log said "Showcase citations: undefined", which told nobody anything.
    if (citationError) console.error("Showcase citations failed:", JSON.stringify(citationError));
  }

  // File it into the Ancient Egypt lane where the community has one, so the
  // event shows up in Compare rather than only on the main strip. Best-effort:
  // a community that never seeded the starter lanes still gets the event.
  const { data: track } = await supabase
    .from("timeline_tracks")
    .select("id")
    .eq("community_id", community.id)
    .eq("slug", SHOWCASE_EVENT.trackSlug)
    .maybeSingle();
  if (track) {
    await supabase
      .from("timeline_event_tracks")
      .insert({ event_id: event.id, track_id: track.id, community_id: community.id });
  }

  revalidatePath(timelinePath(community.slug));
  return { ok: true as const, slug: event.slug };
}

export async function setEventTracks(eventId: string, communitySlug: string, trackIds: string[]) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community } = context;

  const { error: clearError } = await supabase.from("timeline_event_tracks").delete().eq("event_id", eventId);
  if (clearError) return { error: clearError.message };

  if (trackIds.length > 0) {
    const { error } = await supabase
      .from("timeline_event_tracks")
      .insert(trackIds.map((trackId) => ({ event_id: eventId, track_id: trackId, community_id: community.id })));
    if (error) return { error: error.message };
  }
  revalidatePath(timelinePath(community.slug));
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Reads the client asks for as it moves
// ---------------------------------------------------------------------------

export type TimelineWindowPayload = {
  events: TimelineEventWithClaims[];
  total: number;
  truncated: boolean;
};

/**
 * The events in a window — what the canvas calls (debounced) as the reader pans
 * and zooms. Bounded server-side; the browser never holds the whole timeline.
 */
export async function loadTimelineWindow(
  communitySlug: string,
  from: number,
  to: number,
  filters: TimelineFilters = {}
): Promise<TimelineWindowPayload> {
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) return { events: [], total: 0, truncated: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return getTimelineWindow(supabase, community.id, from, to, {
    ...filters,
    // Not a widening: RLS decides what a pending row is visible TO. Staff see
    // the queue; a contributor sees the entry they just submitted sitting there
    // marked "Pending", which is far better than watching it vanish. Everyone
    // else's query returns published rows either way.
    includePending: Boolean(user),
  });
}

/** One event by slug, for framing the timeline on something just added or shared. */
export async function loadTimelineEvent(
  communitySlug: string,
  slug: string
): Promise<TimelineEventWithClaims | null> {
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) return null;
  return getTimelineEventBySlug(supabase, community.id, slug);
}

export async function searchTimeline(communitySlug: string, term: string): Promise<TimelineEventWithClaims[]> {
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) return [];
  return searchTimelineEvents(supabase, community.id, term);
}
