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
  showcaseNeedsPictures,
} from "@/lib/timeline/showcase-event";
import { bringEventPicturesIn } from "@/lib/timeline/bring-in-image";
import { checkPictures, type PictureCheck } from "@/lib/timeline/check-pictures";
import { HANNIBAL_EVENTS, HANNIBAL_SOURCES, HANNIBAL_TRACK } from "@/lib/timeline/hannibal-seed";
import { DEEP_TIME_EVENTS, DEEP_TIME_SOURCES, DEEP_TIME_TRACK } from "@/lib/timeline/deep-time-seed";
import {
  EARLY_SAPIENS_EVENTS,
  EARLY_SAPIENS_SOURCES,
  EARLY_SAPIENS_TRACK,
} from "@/lib/timeline/early-sapiens-seed";
import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "@/lib/timeline/seed-types";
import { PERIODS, PERIOD_LINKS, PERIOD_SOURCES, PERIODS_ANCHOR_SLUG } from "@/lib/timeline/period-seed";
import { ATLANTIS_EVENTS, ATLANTIS_LINKS, ATLANTIS_SOURCES, ATLANTIS_TRACK } from "@/lib/timeline/atlantis-seed";
import { LEMURIA_EVENTS, LEMURIA_LINKS, LEMURIA_SOURCES, LEMURIA_TRACK } from "@/lib/timeline/lemuria-seed";
import { COSMOLOGY_EVENTS, COSMOLOGY_LINKS, COSMOLOGY_SOURCES, COSMOLOGY_TRACK } from "@/lib/timeline/cosmology-seed";
import {
  FLOOD_SUBMERGED_EVENTS,
  FLOOD_SUBMERGED_LINKS,
  FLOOD_SUBMERGED_SOURCES,
  FLOOD_SUBMERGED_TRACK,
} from "@/lib/timeline/flood-submerged-seed";
import {
  FLOOD_CHINA_EVENTS,
  FLOOD_CHINA_LINKS,
  FLOOD_CHINA_SOURCES,
  FLOOD_CHINA_TRACK,
} from "@/lib/timeline/flood-china-seed";
import {
  FLOOD_EURASIA_EVENTS,
  FLOOD_EURASIA_LINKS,
  FLOOD_EURASIA_SOURCES,
  FLOOD_EURASIA_TRACK,
} from "@/lib/timeline/flood-eurasia-seed";
import {
  FLOOD_MESOPOTAMIA_EVENTS,
  FLOOD_MESOPOTAMIA_LINKS,
  FLOOD_MESOPOTAMIA_SOURCES,
  FLOOD_MESOPOTAMIA_TRACK,
} from "@/lib/timeline/flood-mesopotamia-seed";
import {
  FLOOD_PHYSICAL_EVENTS,
  FLOOD_PHYSICAL_LINKS,
  FLOOD_PHYSICAL_SOURCES,
  FLOOD_PHYSICAL_TRACK,
} from "@/lib/timeline/flood-physical-seed";
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
  // A claim now belongs to either an event or a PERIOD, and this form edits an
  // event's dates. A period boundary reaching it would mean the wrong id was
  // posted, not that the period should be edited through the event flow.
  if (!existing.event_id) return { error: "That date belongs to a time period, not to an event." };
  const existingEventId = existing.event_id;

  const { data: event } = await supabase
    .from("timeline_events")
    .select("id, slug, status, created_by")
    .eq("id", existingEventId)
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

  const row = claimRow(parsed.data, existingEventId, community.id, userId, sourceId);
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
  // See updateDateClaim: this removes a date from an EVENT. A period's
  // boundaries are managed with the period.
  if (!claim.event_id) return { error: "That date belongs to a time period, not to an event." };

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
    // Already here, so this is not a seed — it is a repair, and there are two
    // different things to repair.
    //
    // A copy taken before the photographs were part of the worked example has
    // NONE: seeding is a no-op once the event exists, so #430's pictures never
    // reached the communities that took it after #429. Those get the worked
    // example's own photographs, added now.
    //
    // A copy taken after that has them as links to Wikimedia, which is the
    // arrangement that shows empty grey boxes. Those get brought in.
    //
    // Either way it repairs the event in place. A second copy of the Great
    // Pyramid is not what anybody is asking for.
    if (!showcaseNeedsPictures(existing)) return { ok: true as const, slug: existing.slug, broughtIn: 0 };

    const ownMedia = existing.media ?? [];
    const hadNone = ownMedia.length === 0 && !existing.image_url;
    const { pictures, broughtIn, reason } = await bringEventPicturesIn(supabase, {
      // A community that has added its own pictures keeps them; only one that
      // has none at all is given the worked example's.
      pictures: hadNone
        ? { imageUrl: SHOWCASE_EVENT.imageUrl, media: [...SHOWCASE_EVENT.media] }
        : { imageUrl: existing.image_url, media: ownMedia },
      userId,
      slug: SHOWCASE_EVENT_SLUG,
    });

    if (broughtIn > 0 || hadNone) {
      const { error: repairError } = await supabase
        .from("timeline_events")
        .update({ image_url: pictures.imageUrl, media: pictures.media })
        .eq("id", existing.id);
      if (repairError) return { error: repairError.message };
      revalidatePath(timelinePath(community.slug));
    }
    // Logged as well as returned: the reason is worth having in the server log
    // even when the person who pressed the button has already moved on.
    if (reason) console.error("Bringing the worked example's pictures in:", reason);
    return { ok: true as const, slug: existing.slug, broughtIn, reason };
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
  const { pictures: seedPictures, broughtIn: seedBroughtIn, reason: seedReason } = await bringEventPicturesIn(supabase, {
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
    start_year: claim.startYear ?? null,
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
  if (seedReason) console.error("Bringing the worked example's pictures in:", seedReason);
  return { ok: true as const, slug: event.slug, broughtIn: seedBroughtIn, reason: seedReason };
}

/**
 * Seed a prepared dataset into this community's timeline.
 *
 * One function for both of them — the Great Pyramid's neighbours, Hannibal,
 * and the Middle Pleistocene — because they are the same operation over
 * different data, and two copies of this would be two things to keep correct.
 *
 * IDEMPOTENT PER EVENT, NOT PER DATASET. An event already present under its
 * slug is skipped whole: its claims are not touched, its citations are not
 * re-added, and anything a community has edited stays edited. Run it twice and
 * the second run adds nothing; run it after a community has deleted three of
 * seventeen and only those three come back.
 *
 * SOURCES ARE MATCHED ON TITLE AND AUTHOR. This dataset cites two different
 * books both called "Hannibal" — Lancel's and Hunt's. Keyed on title alone the
 * second would silently reuse the first, and a claim about the Col du Clapier
 * would end up attributed to a book that never mentions it. Attribution is the
 * whole point of this feature, so the key includes the author.
 *
 * PARTIAL FAILURE DOES NOT ROLL THE WHOLE THING BACK. If one event fails to
 * insert, the ones already added stay and the count comes back honest. An
 * event whose CLAIMS fail is removed again, because an event with no dates
 * cannot be drawn on a timeline.
 */
/**
 * Insert this dataset's sources, reusing any the community already has.
 *
 * Split out of seedDataset because the time periods need exactly this and none
 * of the rest of it: a period is not an event, has no pictures and no lane, but
 * its boundary claims cite the same kind of source in the same table. Two
 * copies of this loop would have been two places for "have we already got this
 * one?" to be answered differently.
 *
 * Returns the seed key → source id map the claims are written against.
 */
async function resolveSeedSources(
  supabase: SupabaseClient<Database>,
  community: Community,
  userId: string,
  seedSources: SeedSource[]
): Promise<{ error: string } | { ok: true; sourceIds: Map<string, string> }> {
  // TITLE AND AUTHOR, NOT TITLE. Two books called "Hannibal" by two people are
  // two sources, and keying on the title alone silently merged them.
  const sourceKeyOf = (title: string, author: string | null | undefined) =>
    `${title.trim().toLowerCase()}|${(author ?? "").trim().toLowerCase()}`;

  const { data: known } = await supabase
    .from("timeline_sources")
    .select("id, title, author")
    .eq("community_id", community.id);
  const byTitle = new Map((known ?? []).map((row) => [sourceKeyOf(row.title, row.author), row.id]));
  const sourceIds = new Map<string, string>();

  for (const source of seedSources) {
    const already = byTitle.get(sourceKeyOf(source.title, source.author));
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
    // Added to the map as well as the list: two entries in one file that are
    // the same work would otherwise be inserted twice in a single run.
    byTitle.set(sourceKeyOf(source.title, source.author), data.id);
  }

  // The citation chain, wired once every source has an id.
  for (const source of seedSources) {
    if (!source.citedBy) continue;
    const child = sourceIds.get(source.key);
    const parent = sourceIds.get(source.citedBy);
    if (!child || !parent) continue;
    await supabase.from("timeline_sources").update({ cited_by_source_id: parent }).eq("id", child);
  }

  return { ok: true, sourceIds };
}

async function seedDataset(
  supabase: SupabaseClient<Database>,
  community: Community,
  userId: string,
  dataset: { events: SeedEvent[]; sources: SeedSource[]; track: SeedTrack; label: string; links?: SeedEventLink[] }
): Promise<
  { error: string } | { ok: true; added: number; skipped: number; failed: number; repaired: number; linked: number }
> {
  const { events: seedEvents, sources: seedSources, track, label, links: seedLinks = [] } = dataset;

  // --- The lane -------------------------------------------------------------
  const { data: existingTrack } = await supabase
    .from("timeline_tracks")
    .select("id")
    .eq("community_id", community.id)
    .eq("slug", track.slug)
    .maybeSingle();

  let trackId = existingTrack?.id ?? null;
  if (!trackId) {
    const { data: newTrack } = await supabase
      .from("timeline_tracks")
      .insert({
        community_id: community.id,
        created_by: userId,
        name: track.name,
        slug: track.slug,
        kind: track.kind,
        color: track.color,
        sort_order: 50,
      })
      .select("id")
      .single();
    trackId = newTrack?.id ?? null;
  }

  // --- The sources ----------------------------------------------------------
  const resolved = await resolveSeedSources(supabase, community, userId, seedSources);
  if ("error" in resolved) return resolved;
  const { sourceIds } = resolved;

  // --- The events -----------------------------------------------------------
  const { data: presentRows } = await supabase
    .from("timeline_events")
    .select("slug")
    .eq("community_id", community.id)
    .in("slug", seedEvents.map((event) => event.slug));
  const present = new Set((presentRows ?? []).map((row) => row.slug));

  let added = 0;
  const skipped: string[] = [];
  const failed: string[] = [];

  let repaired = 0;

  for (const seed of seedEvents) {
    if (present.has(seed.slug)) {
      skipped.push(seed.slug);
      // ALREADY HERE — BUT PERHAPS WITHOUT ITS PICTURES. A community that took
      // this dataset before the pictures were part of it has events that were
      // never offered any, and skipping the event skips them for ever. Only an
      // event with NO pictures at all is topped up; anything a community added
      // itself is left alone.
      if (seed.imageUrl || seed.media?.length) {
        const { data: existing } = await supabase
          .from("timeline_events")
          .select("id, image_url, media")
          .eq("community_id", community.id)
          .eq("slug", seed.slug)
          .maybeSingle();
        if (existing && !existing.image_url && (existing.media ?? []).length === 0) {
          const { pictures, broughtIn } = await bringEventPicturesIn(supabase, {
            pictures: { imageUrl: seed.imageUrl ?? null, media: [...(seed.media ?? [])] },
            userId,
            slug: seed.slug,
          });
          await supabase
            .from("timeline_events")
            .update({ image_url: pictures.imageUrl, media: pictures.media })
            .eq("id", existing.id);
          if (broughtIn > 0) repaired++;
        }
      }
      continue;
    }

    // Copied into the community's own storage before the event is written, so
    // it never carries an address pointing somewhere we do not control.
    const { pictures } = await bringEventPicturesIn(supabase, {
      pictures: { imageUrl: seed.imageUrl ?? null, media: [...(seed.media ?? [])] },
      userId,
      slug: seed.slug,
    });

    const { data: event, error: eventError } = await supabase
      .from("timeline_events")
      .insert({
        community_id: community.id,
        created_by: userId,
        slug: seed.slug,
        title: seed.title,
        summary: seed.summary,
        description: seed.description,
        category: seed.category,
        subcategory: seed.subcategory ?? null,
        event_type: seed.eventType,
        event_type_note: seed.eventTypeNote ?? null,
        tags: seed.tags,
        people: seed.people ?? [],
        civilisations: seed.civilisations ?? [],
        motifs: seed.motifs ?? [],
        location_name: seed.locationName ?? null,
        lat: seed.lat ?? null,
        lng: seed.lng ?? null,
        image_url: pictures.imageUrl,
        media: pictures.media,
        status: "published",
      })
      .select("id, slug")
      .single();
    if (eventError || !event) {
      failed.push(seed.slug);
      continue;
    }

    const claimRows = seed.claims.map((claim) => ({
      event_id: event.id,
      community_id: community.id,
      created_by: userId,
      source_id: claim.sourceKey ? sourceIds.get(claim.sourceKey) ?? null : null,
      // Undefined becomes null: a claim that places nothing on the axis, which
      // the database accepts only alongside a positionless temporal type.
      start_year: claim.startYear ?? null,
      start_month: claim.startMonth ?? null,
      start_day: claim.startDay ?? null,
      end_year: claim.endYear ?? null,
      date_precision: claim.datePrecision,
      precision_decimals: claim.precisionDecimals ?? 0,
      temporal_claim_type: claim.temporalClaimType ?? null,
      duration_years: claim.durationYears ?? null,
      what_is_dated: claim.whatIsDated ?? null,
      date_convention: claim.dateConvention ?? null,
      convention_reference_year: claim.conventionReferenceYear ?? null,
      // A stated measurement error, kept as one. See SeedClaim: a tolerance is
      // never folded into end_year, because "609 ± 40 ka" and "700–500 ka" are
      // different assertions about different things.
      uncertainty_plus: claim.uncertaintyPlus ?? null,
      uncertainty_minus: claim.uncertaintyMinus ?? null,
      is_approximate: claim.isApproximate,
      original_date_text: claim.originalDateText,
      dating_method: claim.datingMethod,
      chronology: claim.chronology,
      evidence: claim.evidence,
      notes: claim.notes ?? null,
    }));

    const { data: insertedClaims, error: claimError } = await supabase
      .from("timeline_date_claims")
      .insert(claimRows)
      .select("id, original_date_text");
    if (claimError) {
      // An event with no dates cannot be drawn. Take it back out rather than
      // leave an entry the timeline cannot place.
      await supabase.from("timeline_events").delete().eq("id", event.id);
      failed.push(seed.slug);
      continue;
    }

    // Citations, matched back to their claim by its date text — unique within
    // each event for exactly this reason.
    const claimIdByText = new Map<string, string>(
      (insertedClaims ?? []).map((row) => [row.original_date_text, row.id])
    );
    const citationRows = seed.claims.flatMap((claim) => {
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
      // Not fatal, for the same reason as the worked example: an entry missing
      // its further reading is worth far more than no entry at all.
      if (citationError) console.error(`${label} citations failed:`, JSON.stringify(citationError));
    }

    if (trackId) {
      await supabase
        .from("timeline_event_tracks")
        .insert({ event_id: event.id, track_id: trackId, community_id: community.id });
    }

    added++;
  }

  // --- The relationships ----------------------------------------------------
  //
  // Written last, because an edge can point forwards to a record that had not
  // been inserted when its own turn came round.
  const linked = await syncSeedLinks(supabase, community.id, userId, seedLinks, sourceIds, label);

  return { ok: true as const, added, skipped: skipped.length, failed: failed.length, repaired, linked };
}

/**
 * Insert the edges of a seeded dataset that this community does not have yet.
 *
 * SHARED BY THE SEEDER AND THE REFRESH, and that is the point. Relationships
 * arrived after both datasets had already been taken, so every community that
 * had Atlantis or Lemuria would otherwise have kept a version of them with no
 * cross-references at all — which is most of what there is to know about
 * Lemuria. The refresh exists for exactly that situation, so it runs this too.
 *
 * IDEMPOTENT BY READING WHAT IS THERE rather than by upserting: the uniqueness
 * rule is an expression index over coalesce(viewpoint, ''), and an upsert
 * cannot name an expression index.
 *
 * IT ONLY EVER ADDS. An edge already present is left exactly as it is, note and
 * all — somebody may have rewritten it, and a maintenance job that overwrites a
 * person's words is worse than one that does nothing. The same rule the claim
 * refresh follows, arrived at more cheaply here because an edge has no dates to
 * reconcile: its identity IS its (pair, relation, viewpoint).
 */
async function syncSeedLinks(
  supabase: SupabaseClient<Database>,
  communityId: string,
  userId: string,
  seedLinks: SeedEventLink[],
  sourceIds: Map<string, string>,
  label: string
): Promise<number> {
  if (seedLinks.length === 0) return 0;

  const slugs = [...new Set(seedLinks.flatMap((link) => [link.from, link.to]))];
  const { data: linkedEvents } = await supabase
    .from("timeline_events")
    .select("id, slug")
    .eq("community_id", communityId)
    .in("slug", slugs);
  const idBySlug = new Map((linkedEvents ?? []).map((row) => [row.slug, row.id]));

  const { data: existingLinks } = await supabase
    .from("timeline_event_links")
    .select("from_event_id, to_event_id, relation, viewpoint")
    .eq("community_id", communityId);
  const already = new Set(
    (existingLinks ?? []).map((row) => `${row.from_event_id}|${row.to_event_id}|${row.relation}|${row.viewpoint ?? ""}`)
  );

  const linkRows = seedLinks.flatMap((link, index) => {
    const from = idBySlug.get(link.from);
    const to = idBySlug.get(link.to);
    // A record the community never took, or took and deleted. The edge is
    // simply not written — half an edge is not a thing.
    if (!from || !to || from === to) return [];
    const key = `${from}|${to}|${link.relation}|${link.viewpoint ?? ""}`;
    if (already.has(key)) return [];
    already.add(key);
    return [{
      community_id: communityId,
      created_by: userId,
      from_event_id: from,
      to_event_id: to,
      relation: link.relation,
      viewpoint: link.viewpoint ?? null,
      source_id: link.sourceKey ? sourceIds.get(link.sourceKey) ?? null : null,
      note: link.note,
      sort_order: index,
    }];
  });

  if (linkRows.length === 0) return 0;

  const { error } = await supabase.from("timeline_event_links").insert(linkRows);
  // Not fatal, for the same reason citations are not: records without their
  // cross-references are worth far more than no records at all.
  if (error) {
    console.error(`${label} links failed:`, JSON.stringify(error));
    return 0;
  }
  return linkRows.length;
}

/**
 * The fifteen time periods, and their boundary claims. See period-seed.ts.
 *
 * IDEMPOTENT BY SLUG, like every other seeder here: a period already present is
 * left exactly as it is, including any edits the community has made to it. A
 * second run adds what is missing and touches nothing else, which matters more
 * for periods than for events — a period is the frame everything else is read
 * against, and silently rewriting one would change the meaning of every event
 * inside it.
 *
 * Staff only, matching the RLS on the table. A period is not a contribution.
 */
export async function seedTimePeriods(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the time periods." };

  const resolved = await resolveSeedSources(supabase, community, userId, PERIOD_SOURCES);
  if ("error" in resolved) return resolved;
  const { sourceIds } = resolved;

  const { data: presentRows } = await supabase
    .from("timeline_periods")
    .select("id, slug")
    .eq("community_id", community.id)
    .in("slug", PERIODS.map((period) => period.slug));
  const idBySlug = new Map((presentRows ?? []).map((row) => [row.slug, row.id]));

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const seed of PERIODS) {
    if (idBySlug.has(seed.slug)) {
      skipped++;
      continue;
    }

    // Copied into the community's own storage, and the credits resolved from
    // each picture's own source, before the period is written — the same call
    // an event makes, so a period picture cannot end up on a different footing
    // from an event one.
    const { pictures } = await bringEventPicturesIn(supabase, {
      pictures: { imageUrl: seed.imageUrl ?? null, media: [...(seed.media ?? [])] },
      userId,
      slug: seed.slug,
    });

    const { data: period, error: periodError } = await supabase
      .from("timeline_periods")
      .insert({
        community_id: community.id,
        created_by: userId,
        slug: seed.slug,
        name: seed.name,
        aliases: seed.aliases ?? [],
        summary: seed.summary,
        description: seed.description,
        period_type: seed.periodType,
        framework: seed.framework ?? null,
        defining_criteria: seed.definingCriteria ?? null,
        evidence: seed.evidence ?? null,
        interpretation: seed.interpretation ?? null,
        region: seed.region ?? null,
        display_priority: seed.displayPriority ?? 0,
        image_url: pictures.imageUrl,
        media: pictures.media,
        status: "published",
      })
      .select("id, slug")
      .single();
    if (periodError || !period) {
      failed++;
      continue;
    }

    const claimRows = seed.claims.map((claim) => ({
      period_id: period.id,
      community_id: community.id,
      created_by: userId,
      source_id: claim.sourceKey ? sourceIds.get(claim.sourceKey) ?? null : null,
      start_year: claim.startYear,
      start_month: claim.startMonth ?? null,
      start_day: claim.startDay ?? null,
      end_year: claim.endYear ?? null,
      date_precision: claim.datePrecision,
      precision_decimals: claim.precisionDecimals ?? 0,
      uncertainty_plus: claim.uncertaintyPlus ?? null,
      uncertainty_minus: claim.uncertaintyMinus ?? null,
      is_approximate: claim.isApproximate,
      // The two columns a boundary needs that an event's date does not.
      region: claim.region ?? null,
      is_ongoing: claim.isOngoing ?? false,
      original_date_text: claim.originalDateText,
      dating_method: claim.datingMethod,
      chronology: claim.chronology,
      evidence: claim.evidence,
      notes: claim.notes ?? null,
    }));

    const { data: insertedClaims, error: claimError } = await supabase
      .from("timeline_date_claims")
      .insert(claimRows)
      .select("id, original_date_text");
    if (claimError) {
      // A period with no boundaries cannot be drawn and cannot be reasoned
      // about. Take it back out rather than leave a band with no extent.
      await supabase.from("timeline_periods").delete().eq("id", period.id);
      failed++;
      continue;
    }

    const claimIdByText = new Map<string, string>(
      (insertedClaims ?? []).map((row) => [row.original_date_text, row.id])
    );
    const citationRows = seed.claims.flatMap((claim) => {
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
      // Not fatal: a boundary missing its published dispute is worth more than
      // no boundary at all.
      if (citationError) console.error("Period citations failed:", JSON.stringify(citationError));
    }

    idBySlug.set(period.slug, period.id);
    added++;
  }

  // The edges, once every period has an id. Written after the loop because a
  // link can point forwards to a period that had not been inserted yet.
  const linkRows = PERIOD_LINKS.flatMap((link) => {
    const from = idBySlug.get(link.from);
    const to = idBySlug.get(link.to);
    if (!from || !to) return [];
    return [{ community_id: community.id, from_period_id: from, to_period_id: to, relation: link.relation }];
  });
  if (linkRows.length > 0) {
    // Idempotent: the primary key is (from, to, relation), so a second run
    // conflicts on every row and changes nothing.
    const { error: linkError } = await supabase
      .from("timeline_period_links")
      .upsert(linkRows, { onConflict: "from_period_id,to_period_id,relation", ignoreDuplicates: true });
    if (linkError) console.error("Period links failed:", JSON.stringify(linkError));
  }

  revalidatePath(timelinePath(community.slug));
  return { ok: true as const, added, skipped, failed, anchor: PERIODS_ANCHOR_SLUG };
}

/** Seventeen events from the Second Punic War. See hannibal-seed.ts. */
export async function seedHannibalDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the Hannibal dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: HANNIBAL_EVENTS,
    sources: HANNIBAL_SOURCES,
    track: HANNIBAL_TRACK,
    label: "Hannibal",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
}

/** Five records from around a hundred thousand years ago. See early-sapiens-seed.ts. */
export async function seedEarlySapiensDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the early Homo sapiens dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: EARLY_SAPIENS_EVENTS,
    sources: EARLY_SAPIENS_SOURCES,
    track: EARLY_SAPIENS_TRACK,
    label: "Early Homo sapiens",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
}

/**
 * Atlantis, and the two records that let a reader take its dates apart.
 * See atlantis-seed.ts.
 */
export async function seedAtlantisDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the Atlantis dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: ATLANTIS_EVENTS,
    sources: ATLANTIS_SOURCES,
    track: ATLANTIS_TRACK,
    links: ATLANTIS_LINKS,
    label: "Atlantis",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
}

// ---------------------------------------------------------------------------
// BRINGING AN ALREADY-SEEDED DATASET UP TO DATE
//
// The seeders are idempotent by slug: an event already present is skipped
// entirely, which is what makes running one twice harmless. It also means a
// correction to a seed file never reaches a community that took the dataset
// before the correction was made.
//
// That is a real problem rather than a theoretical one. The Atlantis dataset
// shipped with Rudolf Steiner's 7227 BC filed as a date he states; research
// afterwards established that he states no such thing — the figure is counted
// back from an epoch boundary he does give — so the claim's method, its
// evidence, its source and its wording all changed. A community that took the
// dataset the day before would still be showing a reader the wrong account of
// where that number comes from, for ever, with no way to find out.
//
// So: one button that reconciles what is stored against what the seed files now
// say. It is deliberately conservative.
//
//   IT NEVER TOUCHES ANYTHING A PERSON HAS EDITED. Every edit in this feature
//   is recorded in timeline_revisions by a trigger, so "has a human changed
//   this?" is a question with an actual answer rather than a guess. A row with
//   an 'updated' revision against it is left exactly as the community left it,
//   and reported as skipped.
//
//   IT NEVER ADDS OR REMOVES CLAIMS. Only the editorial fields of a claim
//   already there — what it says and where it came from — and only where the
//   match is unambiguous.
//
//   IT NEVER GUESSES. A claim is matched by its date, and where two claims on
//   one event share a date (Plato and Donnelly both sit at ~9600 BCE) it must
//   also match on the source's own wording, or it is skipped and counted.
// ---------------------------------------------------------------------------

type SeedDatasetSpec = {
  label: string;
  events: SeedEvent[];
  sources: SeedSource[];
  links?: SeedEventLink[];
  /**
   * The lane these records live in. Needed because this registry is no longer
   * only walked to CORRECT records — it is also walked to put back ones that
   * have gone missing, and a restored record has to land in the same lane the
   * dedicated seeder would have put it in.
   *
   * The worked example has none: it is a single record that belongs to no lane.
   */
  track?: SeedTrack;
};

/** Every dataset this file can seed, for the refresh to walk. */
const SEEDED_DATASETS: SeedDatasetSpec[] = [
  { label: "The Great Pyramid worked example", events: [{ ...SHOWCASE_EVENT, claims: SHOWCASE_CLAIMS }], sources: SHOWCASE_SOURCES },
  { label: "Hannibal", track: HANNIBAL_TRACK, events: HANNIBAL_EVENTS, sources: HANNIBAL_SOURCES },
  { label: "Deep time",
    track: DEEP_TIME_TRACK, events: DEEP_TIME_EVENTS, sources: DEEP_TIME_SOURCES },
  { label: "Early Homo sapiens", track: EARLY_SAPIENS_TRACK, events: EARLY_SAPIENS_EVENTS, sources: EARLY_SAPIENS_SOURCES },
  { label: "Atlantis", track: ATLANTIS_TRACK, events: ATLANTIS_EVENTS, sources: ATLANTIS_SOURCES, links: ATLANTIS_LINKS },
  { label: "Lemuria",
    track: LEMURIA_TRACK, events: LEMURIA_EVENTS, sources: LEMURIA_SOURCES, links: LEMURIA_LINKS },
  { label: "Beginning of the universe",
    track: COSMOLOGY_TRACK, events: COSMOLOGY_EVENTS, sources: COSMOLOGY_SOURCES, links: COSMOLOGY_LINKS },
  { label: "Ice age floods and sea level",
    track: FLOOD_PHYSICAL_TRACK, events: FLOOD_PHYSICAL_EVENTS, sources: FLOOD_PHYSICAL_SOURCES, links: FLOOD_PHYSICAL_LINKS },
  {
    label: "Drowned lands, and the coasts people remember",
    track: FLOOD_SUBMERGED_TRACK,
    events: FLOOD_SUBMERGED_EVENTS,
    sources: FLOOD_SUBMERGED_SOURCES,
    links: FLOOD_SUBMERGED_LINKS,
  },
  {
    label: "Flood traditions: China",
    track: FLOOD_CHINA_TRACK,
    events: FLOOD_CHINA_EVENTS,
    sources: FLOOD_CHINA_SOURCES,
    links: FLOOD_CHINA_LINKS,
  },
  {
    label: "Flood traditions: Greece, India, Iran",
    track: FLOOD_EURASIA_TRACK,
    events: FLOOD_EURASIA_EVENTS,
    sources: FLOOD_EURASIA_SOURCES,
    links: FLOOD_EURASIA_LINKS,
  },
  {
    label: "Mesopotamian flood traditions",
    track: FLOOD_MESOPOTAMIA_TRACK,
    events: FLOOD_MESOPOTAMIA_EVENTS,
    sources: FLOOD_MESOPOTAMIA_SOURCES,
    links: FLOOD_MESOPOTAMIA_LINKS,
  },
];

/**
 * Which of these claims A PERSON has edited — as opposed to a previous run of
 * this same refresh, or a backfill.
 *
 * Two tests, and both are needed:
 *
 *   actor_id is not null — a write from the SQL console, a migration or a
 *   service-role job is not somebody's editorial decision and must not freeze
 *   the row.
 *
 *   the change set does not mention seed_synced_at — the refresh stamps that
 *   column in the same UPDATE as the correction, so its own revisions always
 *   carry the key and a person's never do. Without this the feature would work
 *   exactly once per claim and then silently refuse for ever, because its own
 *   first correction would look like an edit to protect.
 */
async function editedByAPerson(
  supabase: SupabaseClient<Database>,
  communityId: string,
  claimIds: string[]
): Promise<Set<string>> {
  if (claimIds.length === 0) return new Set();
  const { data } = await supabase
    .from("timeline_revisions")
    .select("claim_id, actor_id, changes")
    .eq("community_id", communityId)
    .eq("entity", "claim")
    .eq("action", "updated")
    .in("claim_id", claimIds);

  const edited = new Set<string>();
  for (const row of data ?? []) {
    if (!row.claim_id || !row.actor_id) continue;
    if (row.changes && Object.prototype.hasOwnProperty.call(row.changes, "seed_synced_at")) continue;
    edited.add(row.claim_id);
  }
  return edited;
}

/**
 * Reconcile the seeded records this community already has against what the seed
 * files say now. Staff only, and safe to run at any time: a community with
 * nothing out of date gets "nothing needed changing".
 */
/**
 * WHICH SEEDED DATASETS ARE ONLY PARTLY HERE.
 *
 * A dataset's offer card is hidden as soon as ONE anchor record exists, which
 * is the right test for "have they taken this" and says nothing about whether
 * all of it arrived. A seeding run that fails partway — a timeout, a dropped
 * connection — inserts some records including the anchor and then stops. The
 * card withdraws, the rest never come, and the timeline looks complete.
 *
 * Until now nothing anywhere said so. The repair button could fix it, but only
 * if you already suspected there was something to fix and pressed it blind;
 * somebody who watched a card disappear had no way to find out what they were
 * missing, or even that they were missing anything.
 *
 * So: count them, and let the page say it out loud. One query for every
 * dataset at once rather than one per dataset.
 *
 * A dataset with NOTHING present is not a gap — it is a dataset this community
 * has not taken, and offering it is the dataset card's job.
 */
export async function seededDatasetGaps(
  communitySlug: string
): Promise<{ label: string; have: number; total: number }[]> {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return [];
  const { supabase, community, isStaff } = context;
  // Only staff can act on this, so only staff are told about it.
  if (!isStaff) return [];

  const { data } = await supabase
    .from("timeline_events")
    .select("slug")
    .eq("community_id", community.id)
    .in("slug", SEEDED_DATASETS.flatMap((dataset) => dataset.events.map((event) => event.slug)));
  const have = new Set((data ?? []).map((row) => row.slug));

  return SEEDED_DATASETS.map((dataset) => ({
    label: dataset.label,
    have: dataset.events.filter((event) => have.has(event.slug)).length,
    total: dataset.events.length,
  })).filter((dataset) => dataset.have > 0 && dataset.have < dataset.total);
}

export async function refreshSeededDatasets(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can bring the seeded datasets up to date." };

  let updated = 0;
  let keptBecauseEdited = 0;
  let skippedAmbiguous = 0;
  // Edges the dataset has gained since this community took it. Counted apart
  // from corrected claims because they are a different kind of repair: nothing
  // was wrong, something was missing.
  let linked = 0;
  // Pictures that gained a "what this shows" classification. Counted apart
  // again: nothing was wrong with them, they simply predate the field — the
  // same shape of gap the relationship backfill closed.
  let classified = 0;
  // RECORDS THIS COMMUNITY ONCE HAD AND NO LONGER DOES.
  //
  // The per-dataset offers ("Add the Chinese flood records") are gated on ONE
  // anchor slug being present, which is the right test for "have they taken
  // this dataset" and the wrong one for "do they still have all of it". Delete
  // any record that is not the anchor and the offer stays hidden — so there was
  // no route anywhere in the app to get that record back. Not a hard one, not a
  // slow one: none.
  //
  // This is that route. It is deliberately on the repair button rather than
  // running by itself, because a community may have removed a record ON
  // PURPOSE and putting it back unasked would be overriding them. Pressing a
  // button called "Check for corrections" is asking; and what came back is
  // named in the result, so a deliberate deletion can be seen and repeated.
  let restored = 0;
  const restoredTitles: string[] = [];
  const changed: string[] = [];

  for (const dataset of SEEDED_DATASETS) {
    // Which of this dataset's events the community actually has.
    const { data: presentRows } = await supabase
      .from("timeline_events")
      .select("id, slug")
      .eq("community_id", community.id)
      .in("slug", dataset.events.map((event) => event.slug));
    const present = presentRows ?? [];
    // Never touched this dataset at all — not a gap, just a dataset they have
    // not taken. Offering it is the per-dataset card's job, not this one's.
    if (present.length === 0) continue;

    // Anything of this dataset's that is missing is put back, with its claims,
    // its sources and its pictures, by the same path that seeded it in the
    // first place — so a restored record is identical to a freshly seeded one
    // rather than a thinner copy of it.
    const presentSlugs = new Set(present.map((row) => row.slug));
    const missing = dataset.events.filter((event) => !presentSlugs.has(event.slug));
    // seedDataset is the same function the dedicated offers call, and it skips
    // what is already there — so handing it the WHOLE dataset restores exactly
    // the gap and touches nothing else. Reusing it rather than writing a
    // restore-shaped copy is the point: a restored record gets its claims, its
    // sources, its citations, its links and its pictures by the identical path
    // a freshly seeded one does, so the two cannot drift apart.
    if (missing.length > 0 && dataset.track) {
      const result = await seedDataset(supabase, community, userId, {
        events: dataset.events,
        sources: dataset.sources,
        track: dataset.track,
        label: dataset.label,
        links: dataset.links,
      });
      if ("ok" in result) {
        restored += result.added;
        for (const event of missing) restoredTitles.push(event.title);
      }
    }

    // Sources first: a corrected claim often cites something the community has
    // never had — the two Steiner lectures did not exist in the dataset when it
    // first shipped. This inserts what is missing and reuses what is there.
    const resolved = await resolveSeedSources(supabase, community, userId, dataset.sources);
    if ("error" in resolved) return resolved;
    const { sourceIds } = resolved;

    const idBySlug = new Map(present.map((row) => [row.slug, row.id]));

    for (const seed of dataset.events) {
      const eventId = idBySlug.get(seed.slug);
      if (!eventId) continue;

      const { data: storedClaims } = await supabase
        .from("timeline_date_claims")
        .select(
          "id, start_year, end_year, original_date_text, dating_method, chronology, evidence, notes, source_id, temporal_claim_type, duration_years, what_is_dated"
        )
        .eq("event_id", eventId);
      const stored = storedClaims ?? [];
      if (stored.length === 0) continue;

      const editedHere = await editedByAPerson(supabase, community.id, stored.map((claim) => claim.id));

      for (const seedClaim of seed.claims) {
        // NULL MATCHES NULL. A seeded claim that places nothing has no
        // startYear, and comparing undefined against a stored null matched
        // nothing at all — so every positionless claim would have been counted
        // ambiguous and never reconciled. Both sides are normalised to null so
        // "no position" is a value that can be matched on, and the several
        // positionless claims on one record are then told apart by their
        // wording, which is the fallback that already exists below.
        const wantStart = seedClaim.startYear ?? null;
        const wantEnd = seedClaim.endYear ?? null;
        const sameDate = stored.filter(
          (claim) => (claim.start_year ?? null) === wantStart && (claim.end_year ?? null) === wantEnd
        );

        let match = sameDate.length === 1 ? sameDate[0] : null;
        if (!match && sameDate.length > 1) {
          // Two claims on one event at the same date — Plato and Donnelly both
          // sit at ~9600 BCE. Fall back to the source's own wording, which is
          // unique within an event by the seeder's own rule.
          const byText = sameDate.filter((claim) => claim.original_date_text === seedClaim.originalDateText);
          if (byText.length === 1) match = byText[0];
        }
        if (!match) {
          // Either the date moved (a different claim now) or the match is
          // ambiguous. Either way this is not a row to guess at.
          skippedAmbiguous++;
          continue;
        }
        if (editedHere.has(match.id)) {
          keptBecauseEdited++;
          continue;
        }

        const wantSource = seedClaim.sourceKey ? sourceIds.get(seedClaim.sourceKey) ?? null : null;
        const next = {
          original_date_text: seedClaim.originalDateText,
          dating_method: seedClaim.datingMethod,
          chronology: seedClaim.chronology,
          evidence: seedClaim.evidence,
          notes: seedClaim.notes ?? null,
          source_id: wantSource,
          // The three columns the cosmology work added. A community holding an
          // older copy of a dataset has them null, and they are exactly the
          // fields that stop its claims being read as rival figures — so the
          // refresh carries them in rather than leaving them to a re-seed that
          // idempotence would skip.
          temporal_claim_type: seedClaim.temporalClaimType ?? null,
          duration_years: seedClaim.durationYears ?? null,
          what_is_dated: seedClaim.whatIsDated ?? null,
        };
        const alreadyRight =
          match.original_date_text === next.original_date_text &&
          match.dating_method === next.dating_method &&
          match.chronology === next.chronology &&
          match.evidence === next.evidence &&
          (match.notes ?? null) === next.notes &&
          (match.source_id ?? null) === next.source_id &&
          (match.temporal_claim_type ?? null) === next.temporal_claim_type &&
          (match.duration_years ?? null) === next.duration_years &&
          (match.what_is_dated ?? null) === next.what_is_dated;
        if (alreadyRight) continue;

        // seed_synced_at rides along in the SAME update, so the revision the
        // trigger writes carries the key that marks this as the refresh's work
        // rather than a person's. See editedByAPerson.
        const { error } = await supabase
          .from("timeline_date_claims")
          .update({ ...next, seed_synced_at: new Date().toISOString() })
          .eq("id", match.id);
        if (error) continue;
        updated++;
        if (!changed.includes(seed.title)) changed.push(seed.title);
      }
    }

    // THE PICTURES THAT NEVER SAID WHAT THEY SHOW.
    //
    // A later artwork that does not declare itself reads as a photograph of
    // the event, and every community that took a dataset before the field
    // existed has exactly that. Matched by URL and only ever ADDED: a picture
    // that already carries a classification is left alone, because somebody
    // may have corrected it.
    for (const seed of dataset.events) {
      const eventId = idBySlug.get(seed.slug);
      if (!eventId || !seed.media || seed.media.length === 0) continue;

      const { data: stored } = await supabase
        .from("timeline_events")
        .select("media")
        .eq("id", eventId)
        .maybeSingle();
      const storedMedia = stored?.media ?? [];
      if (storedMedia.length === 0) continue;

      const showsByUrl = new Map(seed.media.filter((item) => item.shows).map((item) => [item.url, item.shows!]));
      let touched = false;
      const next = storedMedia.map((item) => {
        if (item.shows || !item.url) return item;
        // The seeder copies pictures into the community's own storage, so the
        // stored URL is not the seed's. Fall back to matching on the filename,
        // which survives the copy.
        const direct = showsByUrl.get(item.url);
        const byName =
          direct ??
          [...showsByUrl.entries()].find(([url]) => {
            const seedName = decodeURIComponent(url.split("/").pop() ?? "").split("?")[0];
            const storedName = decodeURIComponent(item.url.split("/").pop() ?? "").split("?")[0];
            return seedName.length > 0 && seedName === storedName;
          })?.[1];
        if (!byName) return item;
        touched = true;
        return { ...item, shows: byName };
      });

      if (!touched) continue;
      const { error } = await supabase.from("timeline_events").update({ media: next }).eq("id", eventId);
      if (error) continue;
      classified += next.filter((item, index) => item.shows && !storedMedia[index]?.shows).length;
      if (!changed.includes(seed.title)) changed.push(seed.title);
    }

    // THE EDGES THIS COMMUNITY NEVER GOT. Relationships were added to the
    // datasets after both had shipped, so a community that took Lemuria early
    // has thirteen records and no line drawn between any of them — Mu sitting
    // beside Lemuria with nothing saying who put them together. Adds what is
    // missing and never touches what is there.
    if (dataset.links && dataset.links.length > 0) {
      const added = await syncSeedLinks(supabase, community.id, userId, dataset.links, sourceIds, dataset.label);
      if (added > 0) {
        linked += added;
        if (!changed.includes(dataset.label)) changed.push(dataset.label);
      }
    }
  }

  revalidatePath(timelinePath(community.slug));
  return {
    ok: true as const,
    updated,
    keptBecauseEdited,
    skippedAmbiguous,
    linked,
    classified,
    restored,
    restoredTitles,
    changed,
  };
}

/**
 * Lemuria, Mu, and the geology that answers the question they came from.
 * See lemuria-seed.ts.
 */
export async function seedLemuriaDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the Lemuria dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: LEMURIA_EVENTS,
    sources: LEMURIA_SOURCES,
    track: LEMURIA_TRACK,
    links: LEMURIA_LINKS,
    label: "Lemuria",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
}

/**
 * Ask every picture in this community whether it actually loads.
 *
 * READ-ONLY. It changes nothing, which is the point: a picture added by
 * writing a URL into a seed file is unverifiable until somebody opens the
 * record, and a broken one is silent — the page renders, the layout holds,
 * and there is a grey box where a photograph should be.
 *
 * Staff only, because it makes the server fetch URLs that members supplied.
 * The guard on which URLs may be fetched lives in check-pictures.ts and is the
 * most important part of this feature; read it before changing anything here.
 */
export async function checkTimelinePictures(communitySlug: string): Promise<
  { error: string } | { ok: true; checked: number; problems: PictureCheck[] }
> {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, isStaff } = context;
  if (!isStaff) return { error: "Only staff can check the pictures." };

  const { data, error } = await supabase
    .from("timeline_events")
    .select("slug, title, image_url, media")
    .eq("community_id", community.id);
  if (error) return { error: error.message };

  const records = (data ?? []).filter((record) => record.image_url || (record.media ?? []).length > 0);
  const results = await checkPictures(records);
  return { ok: true as const, checked: results.length, problems: results.filter((result) => result.outcome !== "ok") };
}

/**
 * The Chinese Great Flood, and the geological flood proposed as its origin.
 * See flood-china-seed.ts.
 */
export async function seedFloodChinaDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the flood traditions dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: FLOOD_CHINA_EVENTS,
    sources: FLOOD_CHINA_SOURCES,
    track: FLOOD_CHINA_TRACK,
    links: FLOOD_CHINA_LINKS,
    label: "Flood traditions: China",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
}

/**
 * The drowned landscapes, and the Australian coastal traditions.
 * See flood-submerged-seed.ts.
 */
export async function seedFloodSubmergedDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the drowned lands dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: FLOOD_SUBMERGED_EVENTS,
    sources: FLOOD_SUBMERGED_SOURCES,
    track: FLOOD_SUBMERGED_TRACK,
    links: FLOOD_SUBMERGED_LINKS,
    label: "Drowned lands, and the coasts people remember",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
}

/**
 * Greek, Indian and Iranian flood and catastrophe traditions.
 * See flood-eurasia-seed.ts.
 */
export async function seedFloodEurasiaDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the flood traditions dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: FLOOD_EURASIA_EVENTS,
    sources: FLOOD_EURASIA_SOURCES,
    track: FLOOD_EURASIA_TRACK,
    links: FLOOD_EURASIA_LINKS,
    label: "Flood traditions: Greece, India, Iran",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
}

/**
 * The Mesopotamian flood traditions, the flood deposits, and the competing
 * Biblical chronologies. See flood-mesopotamia-seed.ts.
 */
export async function seedFloodMesopotamiaDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the flood traditions dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: FLOOD_MESOPOTAMIA_EVENTS,
    sources: FLOOD_MESOPOTAMIA_SOURCES,
    track: FLOOD_MESOPOTAMIA_TRACK,
    links: FLOOD_MESOPOTAMIA_LINKS,
    label: "Mesopotamian flood traditions",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
}

/**
 * The physical floods and sea-level changes — Part A of the flood material.
 * Seeded before any tradition, on purpose. See flood-physical-seed.ts.
 */
export async function seedFloodPhysicalDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the ice age floods dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: FLOOD_PHYSICAL_EVENTS,
    sources: FLOOD_PHYSICAL_SOURCES,
    track: FLOOD_PHYSICAL_TRACK,
    links: FLOOD_PHYSICAL_LINKS,
    label: "Ice age floods and sea level",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
}

/**
 * The beginning and age of the universe — and the claim that it has neither.
 * See cosmology-seed.ts.
 */
export async function seedCosmologyDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the cosmology dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: COSMOLOGY_EVENTS,
    sources: COSMOLOGY_SOURCES,
    track: COSMOLOGY_TRACK,
    links: COSMOLOGY_LINKS,
    label: "Beginning of the universe",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
}

/** Ten records from the Middle Pleistocene. See deep-time-seed.ts. */
export async function seedDeepTimeDataset(communitySlug: string) {
  const context = await requireTimelineWriter(communitySlug);
  if ("error" in context) return context;
  const { supabase, community, userId, isStaff } = context;
  if (!isStaff) return { error: "Only staff can add the deep time dataset." };

  const result = await seedDataset(supabase, community, userId, {
    events: DEEP_TIME_EVENTS,
    sources: DEEP_TIME_SOURCES,
    track: DEEP_TIME_TRACK,
    label: "Deep time",
  });
  revalidatePath(timelinePath(community.slug));
  return result;
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
