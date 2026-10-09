import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Community,
  CommunityMembership,
  Database,
  GuidedJourneySpace,
  Journey,
  JourneyBeginnerProfile,
  JourneyMentorProfile,
  JourneyMilestone,
  JourneyParticipant,
  JourneyReport,
  JourneyStory,
  JourneyTemplate,
  JourneyUpdate,
  MentorshipRequest,
  Profile,
  Space,
} from "@/types/database";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { resolveConfig, type GuidedJourneyConfig, type GuidedJourneyPreset } from "@/lib/guided-journey/config";
import { getPreset } from "@/lib/guided-journey/presets";

type Client = SupabaseClient<Database>;

// Everything a guided-journey page needs to know about where it is and who is
// looking. Returns null when the community/space doesn't exist, the viewer
// can't see it (RLS), or the space isn't a guided-journey space — every page
// turns that into a 404.
export type GuidedJourneyContext = {
  supabase: Client;
  userId: string | null;
  community: Community;
  space: Space;
  membership: CommunityMembership | null;
  isMember: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  settings: GuidedJourneySpace | null;
  preset: GuidedJourneyPreset;
  config: GuidedJourneyConfig;
  basePath: string;
};

export async function getGuidedJourneyContext(
  supabase: Client,
  communitySlug: string,
  spaceSlug: string
): Promise<GuidedJourneyContext | null> {
  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return null;
  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space || space.space_type !== "guided_journey") return null;

  const [membership, settingsResult] = await Promise.all([
    user ? getMembership(supabase, community.id, user.id) : Promise.resolve(null),
    supabase.from("guided_journey_spaces").select("*").eq("space_id", space.id).maybeSingle(),
  ]);
  const settings = settingsResult.data ?? null;
  const preset = getPreset(settings?.preset_key);
  const active = membership?.status === "active";
  const role = membership?.role;

  return {
    supabase,
    userId: user?.id ?? null,
    community,
    space,
    membership,
    isMember: active,
    isStaff: active && (role === "owner" || role === "admin" || role === "moderator"),
    isAdmin: active && (role === "owner" || role === "admin"),
    settings,
    preset,
    config: resolveConfig(preset, settings?.config ?? {}),
    basePath: `/c/${community.slug}/spaces/${space.slug}`,
  };
}

export async function getMyJourneyProfiles(supabase: Client, spaceId: string, userId: string | null) {
  if (!userId) return { beginner: null, mentor: null };
  const [b, m] = await Promise.all([
    supabase.from("journey_beginner_profiles").select("*").eq("space_id", spaceId).eq("user_id", userId).maybeSingle(),
    supabase.from("journey_mentor_profiles").select("*").eq("space_id", spaceId).eq("user_id", userId).maybeSingle(),
  ]);
  return { beginner: (b.data ?? null) as JourneyBeginnerProfile | null, mentor: (m.data ?? null) as JourneyMentorProfile | null };
}

export type MentorWithProfile = JourneyMentorProfile & {
  profile: Profile;
  activeBeginners: number;
  completedJourneys: number;
};

export async function getSpaceMentors(supabase: Client, spaceId: string): Promise<MentorWithProfile[]> {
  const [{ data, error }, stats] = await Promise.all([
    supabase.from("journey_mentor_profiles").select("*, profile:user_id (*)").eq("space_id", spaceId).order("created_at", { ascending: true }),
    supabase.rpc("mentor_journey_stats", { p_space_id: spaceId }),
  ]);
  if (error) throw error;
  const byMentor = new Map((stats.data ?? []).map((s) => [s.mentor_id, s]));
  return ((data ?? []) as unknown as (JourneyMentorProfile & { profile: Profile })[])
    .filter((m) => m.profile)
    .map((m) => ({
      ...m,
      activeBeginners: byMentor.get(m.user_id)?.active_beginners ?? 0,
      completedJourneys: byMentor.get(m.user_id)?.completed_journeys ?? 0,
    }));
}

export async function getJourneyTemplates(supabase: Client, spaceId: string, includeInactive = false): Promise<JourneyTemplate[]> {
  let query = supabase.from("journey_templates").select("*").eq("space_id", spaceId).order("sort_order", { ascending: true });
  if (!includeInactive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as JourneyTemplate[];
}

export type OpenGroupJourney = Journey & { mentor: Profile | null; beginnerCount: number };

export async function getOpenGroupJourneys(supabase: Client, spaceId: string): Promise<OpenGroupJourney[]> {
  const { data, error } = await supabase
    .from("journeys")
    .select("*, mentor:mentor_id (*)")
    .eq("space_id", spaceId)
    .eq("is_group", true)
    .eq("status", "active")
    .order("started_at", { ascending: false });
  if (error) throw error;
  const journeys = (data ?? []) as unknown as (Journey & { mentor: Profile | null })[];
  if (journeys.length === 0) return [];
  const { data: participants } = await supabase
    .from("journey_participants")
    .select("journey_id, role, left_at")
    .in("journey_id", journeys.map((j) => j.id));
  return journeys
    .map((j) => ({
      ...j,
      beginnerCount: (participants ?? []).filter((p) => p.journey_id === j.id && p.role === "beginner" && !p.left_at).length,
    }))
    .filter((j) => j.max_beginners === null || j.beginnerCount < j.max_beginners);
}

export type RequestWithPeople = MentorshipRequest & {
  beginner: Profile | null;
  mentor: Profile | null;
  template: Pick<JourneyTemplate, "id" | "title"> | null;
};

export async function getRequestsForUser(supabase: Client, spaceId: string, userId: string) {
  const { data, error } = await supabase
    .from("mentorship_requests")
    .select("*, beginner:beginner_id (*), mentor:mentor_id (*), template:template_id (id, title)")
    .eq("space_id", spaceId)
    .or(`beginner_id.eq.${userId},mentor_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as unknown as RequestWithPeople[];
  // Incoming = waiting on this person's answer; outgoing = started by them.
  const startedBy = (r: RequestWithPeople) => (r.initiated_by === "mentor" ? r.mentor_id : r.beginner_id);
  return {
    incoming: rows.filter((r) => startedBy(r) !== userId),
    outgoing: rows.filter((r) => startedBy(r) === userId),
  };
}

export type WaitingBeginner = Database["public"]["Functions"]["waiting_beginners"]["Returns"][number];

// The waiting list: beginners who opted in and have no mentor or pending
// request yet. Only active mentors and staff get rows (enforced in SQL), and
// only non-identifying answers.
export async function getWaitingBeginners(supabase: Client, spaceId: string): Promise<WaitingBeginner[]> {
  const { data, error } = await supabase.rpc("waiting_beginners", { p_space_id: spaceId });
  if (error) throw error;
  return data ?? [];
}

// Beginner profiles of the people who asked this mentor for help (RLS only
// returns those). Keyed by user id.
export async function getRequesterProfiles(supabase: Client, spaceId: string, userIds: string[]) {
  if (userIds.length === 0) return new Map<string, JourneyBeginnerProfile>();
  const { data } = await supabase.from("journey_beginner_profiles").select("*").eq("space_id", spaceId).in("user_id", userIds);
  return new Map(((data ?? []) as JourneyBeginnerProfile[]).map((p) => [p.user_id, p]));
}

export type JourneySummary = Journey & { role: "mentor" | "beginner"; progress: { done: number; total: number } };

export async function getMyJourneys(supabase: Client, spaceId: string, userId: string): Promise<JourneySummary[]> {
  const { data: mine } = await supabase.from("journey_participants").select("journey_id, role, left_at").eq("user_id", userId);
  const ids = (mine ?? []).map((m) => m.journey_id);
  if (ids.length === 0) return [];
  const [{ data: journeys }, { data: milestones }] = await Promise.all([
    supabase.from("journeys").select("*").in("id", ids).eq("space_id", spaceId).order("started_at", { ascending: false }),
    supabase.from("journey_milestones").select("journey_id, status").in("journey_id", ids),
  ]);
  return ((journeys ?? []) as Journey[]).map((j) => {
    const ms = (milestones ?? []).filter((m) => m.journey_id === j.id);
    return {
      ...j,
      role: (mine ?? []).find((m) => m.journey_id === j.id)?.role ?? "beginner",
      progress: { done: ms.filter((m) => m.status === "done").length, total: ms.length },
    };
  });
}

export type ParticipantWithProfile = JourneyParticipant & { profile: Profile };
export type UpdateWithAuthor = JourneyUpdate & { author: Profile | null };

export type JourneyDetail = {
  journey: Journey;
  participants: ParticipantWithProfile[];
  milestones: JourneyMilestone[];
  updates: UpdateWithAuthor[];
  stories: JourneyStory[];
  mentorProfile: JourneyMentorProfile | null;
};

export async function getJourneyDetail(supabase: Client, journeyId: string): Promise<JourneyDetail | null> {
  const { data: journey } = await supabase.from("journeys").select("*").eq("id", journeyId).maybeSingle();
  if (!journey) return null;
  const [participants, milestones, updates, stories, mentorProfile] = await Promise.all([
    supabase.from("journey_participants").select("*, profile:user_id (*)").eq("journey_id", journeyId).order("joined_at", { ascending: true }),
    supabase.from("journey_milestones").select("*").eq("journey_id", journeyId).order("position", { ascending: true }),
    supabase.from("journey_updates").select("*, author:author_id (*)").eq("journey_id", journeyId).order("created_at", { ascending: true }),
    supabase.from("journey_stories").select("*").eq("journey_id", journeyId),
    supabase.from("journey_mentor_profiles").select("*").eq("space_id", journey.space_id).eq("user_id", journey.mentor_id).maybeSingle(),
  ]);
  return {
    journey: journey as Journey,
    participants: ((participants.data ?? []) as unknown as ParticipantWithProfile[]).filter((p) => p.profile),
    milestones: (milestones.data ?? []) as JourneyMilestone[],
    updates: (updates.data ?? []) as unknown as UpdateWithAuthor[],
    stories: (stories.data ?? []) as JourneyStory[],
    mentorProfile: (mentorProfile.data ?? null) as JourneyMentorProfile | null,
  };
}

export type StoryWithPeople = JourneyStory & { author: Profile | null; mentor: Profile | null };

export async function getPublishedStories(supabase: Client, spaceId: string, limit = 60): Promise<StoryWithPeople[]> {
  const { data, error } = await supabase
    .from("journey_stories")
    .select("*, author:author_id (*), mentor:mentor_id (*)")
    .eq("space_id", spaceId)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  // The mentor is only named where they agreed to be (show_mentor).
  return ((data ?? []) as unknown as StoryWithPeople[]).map((s) => (s.show_mentor ? s : { ...s, mentor: null, mentor_acknowledgement: null }));
}

export async function getStory(supabase: Client, storyId: string): Promise<StoryWithPeople | null> {
  const { data } = await supabase.from("journey_stories").select("*, author:author_id (*), mentor:mentor_id (*)").eq("id", storyId).maybeSingle();
  if (!data) return null;
  const story = data as unknown as StoryWithPeople;
  return story.show_mentor ? story : { ...story, mentor: null, mentor_acknowledgement: null };
}

// --- Staff overview -----------------------------------------------------------

export type ReportWithPeople = JourneyReport & { reporter: Profile | null; reported: Profile | null };
export type JourneyWithMentor = Journey & { mentor: Profile | null };

export async function getSpaceAdminData(supabase: Client, spaceId: string) {
  const [requests, journeys, reports, stories, mentors, templates] = await Promise.all([
    supabase
      .from("mentorship_requests")
      .select("*, beginner:beginner_id (*), mentor:mentor_id (*), template:template_id (id, title)")
      .eq("space_id", spaceId)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("journeys").select("*, mentor:mentor_id (*)").eq("space_id", spaceId).order("started_at", { ascending: false }).limit(200),
    supabase
      .from("journey_reports")
      .select("*, reporter:reporter_id (*), reported:reported_user_id (*)")
      .eq("space_id", spaceId)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("journey_stories").select("*, author:author_id (*), mentor:mentor_id (*)").eq("space_id", spaceId).neq("status", "draft").order("updated_at", { ascending: false }),
    getSpaceMentors(supabase, spaceId),
    getJourneyTemplates(supabase, spaceId, true),
  ]);
  const waiting = await getWaitingBeginners(supabase, spaceId);
  return {
    requests: (requests.data ?? []) as unknown as RequestWithPeople[],
    journeys: (journeys.data ?? []) as unknown as JourneyWithMentor[],
    reports: (reports.data ?? []) as unknown as ReportWithPeople[],
    stories: (stories.data ?? []) as unknown as StoryWithPeople[],
    mentors,
    templates,
    waiting,
  };
}

export function displayName(profile: Pick<Profile, "full_name" | "username"> | null | undefined): string {
  return profile?.full_name || profile?.username || "A member";
}

export function weeksBetween(start: string, end: string | null): number {
  const ms = (end ? new Date(end).getTime() : Date.now()) - new Date(start).getTime();
  return Math.max(0, Math.round(ms / (7 * 24 * 60 * 60 * 1000)));
}
