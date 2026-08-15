import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Community, CommunityMembership, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

// Whether a signed-in viewer can see a community's Members list/page, per
// its members_visibility setting: 'public' allows any signed-in viewer (incl.
// guests who haven't joined), 'members' requires an active membership,
// 'private' requires staff. Callers must separately require a signed-in user
// — the Members page itself is never reachable by a signed-out visitor.
export function canViewMembers(community: Community, membership: CommunityMembership | null): boolean {
  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  switch (community.members_visibility) {
    case "public":
      return true;
    case "private":
      return isStaff;
    case "members":
    default:
      return membership?.status === "active";
  }
}

export type CommunityWithMembership = Community & {
  membership: Pick<CommunityMembership, "role" | "status">;
};

// Communities the given user actively belongs to, most recently joined first.
export async function getUserCommunities(
  supabase: Client,
  userId: string
): Promise<CommunityWithMembership[]> {
  const { data, error } = await supabase
    .from("community_memberships")
    .select("role, status, created_at, communities:community_id (*)")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .filter((row) => row.communities)
    .map((row) => ({
      ...(row.communities as unknown as Community),
      membership: { role: row.role, status: row.status },
    }));
}

// Every community, newest first — for the platform admin's community list.
// Relies on communities_select_super_admin (RLS) to see private ones too.
export async function getAllCommunities(supabase: Client): Promise<Community[]> {
  const { data, error } = await supabase.from("communities").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// A private community's row is readable by anyone ("visible in search"), so a
// non-member — signed-out or signed-in — resolves it here and the app renders
// the community shell (with only its public spaces in the nav). invite_only
// communities and unknown slugs still return null, staying a non-revealing 404.
// The members-only surfaces (the feed) are gated in the page layer, and space
// content is gated per-space by RLS.
export async function getCommunityBySlug(supabase: Client, slug: string): Promise<Community | null> {
  const { data, error } = await supabase.from("communities").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getMembership(
  supabase: Client,
  communityId: string,
  userId: string
): Promise<CommunityMembership | null> {
  const { data, error } = await supabase
    .from("community_memberships")
    .select("*")
    .eq("community_id", communityId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Public communities the user could self-join. Hidden: the ones they're
// already an active member of (nothing left to join) and the ones they're
// banned from (never offer a door that won't open).
//
// A merely *invited* membership deliberately does not hide the community. This
// used to key off the presence of a membership row of any status, so a user who
// had been invited but hadn't accepted fell through both dashboard lists at
// once — "Your communities" wants status 'active', and this one excluded them
// for having a row at all — and the community vanished from their dashboard
// entirely. joinCommunity() promotes an existing invite in place rather than
// inserting a second row.
export async function getDiscoverableCommunities(supabase: Client, userId: string): Promise<Community[]> {
  const { data: memberships, error: membershipError } = await supabase
    .from("community_memberships")
    .select("community_id, status")
    .eq("user_id", userId);

  if (membershipError) throw membershipError;

  const hiddenIds = (memberships ?? [])
    .filter((m) => m.status === "active" || m.status === "banned")
    .map((m) => m.community_id);

  let query = supabase.from("communities").select("*").eq("is_public", true);
  if (hiddenIds.length > 0) {
    query = query.not("id", "in", `(${hiddenIds.join(",")})`);
  }

  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export interface CommunityStats {
  members: number;
  events: number;
  businesses: number;
  posts: number;
}

// Headline counts for the community landing page's stats strip. Each is a
// head-only COUNT query (no rows fetched), run in parallel. A null count
// (unexpected) collapses to 0 so the strip always renders.
export async function getCommunityStats(supabase: Client, communityId: string): Promise<CommunityStats> {
  const [members, events, businesses, posts] = await Promise.all([
    supabase
      .from("community_memberships")
      .select("id", { count: "exact", head: true })
      .eq("community_id", communityId)
      .eq("status", "active"),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("community_id", communityId),
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("community_id", communityId),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("community_id", communityId),
  ]);

  return {
    members: members.count ?? 0,
    events: events.count ?? 0,
    businesses: businesses.count ?? 0,
    posts: posts.count ?? 0,
  };
}

export type MemberRow = CommunityMembership & { profile: Profile };

export async function getCommunityMembers(supabase: Client, communityId: string): Promise<MemberRow[]> {
  const { data, error } = await supabase
    .from("community_memberships")
    .select("*, profile:user_id (*)")
    .eq("community_id", communityId)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as MemberRow[];
}

// The most recently joined active members, newest first — used to surface
// "New Member" cards in the community feed alongside posts and other activity.
export async function getCommunityRecentMembers(
  supabase: Client,
  communityId: string,
  limit: number
): Promise<MemberRow[]> {
  const { data, error } = await supabase
    .from("community_memberships")
    .select("*, profile:user_id (*)")
    .eq("community_id", communityId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as MemberRow[];
}
