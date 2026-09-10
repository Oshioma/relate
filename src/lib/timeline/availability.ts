import type { Community } from "@/types/database";

// WHICH COMMUNITIES HAVE A TIMELINE.
//
// One question, one answer, one place — mirrored by community_has_timeline() in
// the database so the nav and RLS can never disagree about who this is for.
//
// Today: a School community whose kind is Homeschool. The feature was built for
// them and nothing in it is homeschool-specific — an event, some date claims
// and their sources would work as well for a local history society or a science
// community. Opening it to one of those is this file plus the SQL function,
// with no schema change: nothing below the surface knows what a homeschool is.

/** School kinds (src/lib/community-templates.ts) whose communities get the timeline. */
export const TIMELINE_SCHOOL_KINDS = ["homeschool"] as const;

/** Community templates whose every community gets the timeline, whatever their kind. Empty for now. */
export const TIMELINE_TEMPLATE_KEYS: readonly string[] = [];

type TimelineEligibleCommunity = Pick<Community, "template_key" | "school_kind">;

export function communityHasTimeline(community: TimelineEligibleCommunity | null | undefined): boolean {
  if (!community) return false;
  if (community.template_key && TIMELINE_TEMPLATE_KEYS.includes(community.template_key)) return true;
  return (
    community.template_key === "school" &&
    Boolean(community.school_kind) &&
    (TIMELINE_SCHOOL_KINDS as readonly string[]).includes(community.school_kind as string)
  );
}

/** The path to a community's timeline. One definition, so every link agrees. */
export function timelinePath(communitySlug: string): string {
  return `/c/${communitySlug}/timeline`;
}

export function timelineEventPath(communitySlug: string, eventSlug: string): string {
  return `/c/${communitySlug}/timeline/${eventSlug}`;
}
