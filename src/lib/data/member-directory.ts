import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, BusinessProfile, MemberLocation, MembershipRole, Profile } from "@/types/database";
import { getCommunityMembers } from "./community";

type Client = SupabaseClient<Database>;

export type DirectoryMember = {
  membershipId: string;
  role: MembershipRole;
  joinedAt: string;
  profile: Profile;
  interests: string[];
  skills: string[];
  needsHelpWith: string[];
  canHelpWith: string[];
  location: MemberLocation | null;
  business: BusinessProfile | null;
};

function groupBy<T>(rows: T[], key: (row: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const k = key(row);
    const list = map.get(k) ?? [];
    list.push(row);
    map.set(k, list);
  }
  return map;
}

// Every active member of a community, enriched with the Stage 1 tag/
// location/business data needed to search, filter, and build discovery
// sections. Fetched as a handful of batched `.in(...)` queries rather than
// N+1 per member.
export async function getDirectoryMembers(supabase: Client, communityId: string): Promise<DirectoryMember[]> {
  const members = await getCommunityMembers(supabase, communityId);
  const profileIds = members.map((m) => m.user_id);

  if (profileIds.length === 0) return [];

  const [
    { data: interests, error: interestsError },
    { data: skills, error: skillsError },
    { data: helpRequests, error: helpRequestsError },
    { data: locations, error: locationsError },
    { data: businesses, error: businessesError },
  ] = await Promise.all([
    supabase.from("member_interests").select("profile_id, interest").in("profile_id", profileIds),
    supabase.from("member_skills").select("profile_id, skill").in("profile_id", profileIds),
    supabase.from("member_help_requests").select("profile_id, kind, topic").in("profile_id", profileIds),
    supabase.from("member_locations").select("*").in("profile_id", profileIds),
    supabase.from("business_profiles").select("*").in("profile_id", profileIds),
  ]);

  if (interestsError) throw interestsError;
  if (skillsError) throw skillsError;
  if (helpRequestsError) throw helpRequestsError;
  if (locationsError) throw locationsError;
  if (businessesError) throw businessesError;

  const interestsByProfile = groupBy(interests ?? [], (row) => row.profile_id);
  const skillsByProfile = groupBy(skills ?? [], (row) => row.profile_id);
  const helpRequestsByProfile = groupBy(helpRequests ?? [], (row) => row.profile_id);
  const locationByProfile = new Map((locations ?? []).map((row) => [row.profile_id, row]));
  const businessByProfile = new Map((businesses ?? []).map((row) => [row.profile_id, row]));

  return members.map((member) => ({
    membershipId: member.id,
    role: member.role,
    joinedAt: member.created_at,
    profile: member.profile,
    interests: (interestsByProfile.get(member.user_id) ?? []).map((row) => row.interest),
    skills: (skillsByProfile.get(member.user_id) ?? []).map((row) => row.skill),
    needsHelpWith: (helpRequestsByProfile.get(member.user_id) ?? [])
      .filter((row) => row.kind === "needs_help")
      .map((row) => row.topic),
    canHelpWith: (helpRequestsByProfile.get(member.user_id) ?? [])
      .filter((row) => row.kind === "can_help")
      .map((row) => row.topic),
    location: locationByProfile.get(member.user_id) ?? null,
    business: businessByProfile.get(member.user_id) ?? null,
  }));
}

export function isDiscoverable(member: DirectoryMember): boolean {
  return member.profile.is_discoverable;
}

export function matchesQuery(member: DirectoryMember, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    member.profile.full_name,
    member.profile.username,
    member.profile.bio,
    member.profile.profession,
    member.profile.company,
    ...member.interests,
    ...member.skills,
    ...member.needsHelpWith,
    ...member.canHelpWith,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function getNewMembers(members: DirectoryMember[], limit = 6): DirectoryMember[] {
  return [...members].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()).slice(0, limit);
}

export function getRecentlyActiveMembers(members: DirectoryMember[], limit = 6): DirectoryMember[] {
  return members
    .filter((m) => !m.profile.hide_online_status && m.profile.last_active_at)
    .sort((a, b) => new Date(b.profile.last_active_at!).getTime() - new Date(a.profile.last_active_at!).getTime())
    .slice(0, limit);
}

export function getTopContributors(members: DirectoryMember[], limit = 6): DirectoryMember[] {
  return [...members]
    .filter((m) => m.profile.contribution_score > 0)
    .sort((a, b) => b.profile.contribution_score - a.profile.contribution_score)
    .slice(0, limit);
}

export function getBusinesses(members: DirectoryMember[], limit = 6): DirectoryMember[] {
  return members.filter((m) => m.business && !m.profile.hide_business_profile).slice(0, limit);
}

export function getMembersNearYou(members: DirectoryMember[], viewerLocation: MemberLocation | null, limit = 6): DirectoryMember[] {
  if (!viewerLocation?.is_visible || !viewerLocation.country) return [];

  return members
    .filter((m) => m.location?.is_visible && m.location.country?.toLowerCase() === viewerLocation.country?.toLowerCase())
    .sort((a, b) => {
      const aSameRegion = a.location?.region && a.location.region === viewerLocation.region ? 1 : 0;
      const bSameRegion = b.location?.region && b.location.region === viewerLocation.region ? 1 : 0;
      return bSameRegion - aSameRegion;
    })
    .slice(0, limit);
}

export function getRecommendedMembers(
  members: DirectoryMember[],
  viewerProfileId: string,
  viewerInterests: string[],
  viewerSkills: string[],
  viewerProfession: string | null,
  limit = 6
): DirectoryMember[] {
  const viewerInterestSet = new Set(viewerInterests.map((i) => i.toLowerCase()));
  const viewerSkillSet = new Set(viewerSkills.map((s) => s.toLowerCase()));

  return members
    .filter((m) => m.profile.id !== viewerProfileId)
    .map((member) => {
      const sharedInterests = member.interests.filter((i) => viewerInterestSet.has(i.toLowerCase())).length;
      const sharedSkills = member.skills.filter((s) => viewerSkillSet.has(s.toLowerCase())).length;
      const professionMatch = viewerProfession && member.profile.profession === viewerProfession ? 1 : 0;
      const score = sharedInterests * 2 + sharedSkills * 2 + professionMatch * 3;
      return { member, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.member);
}
