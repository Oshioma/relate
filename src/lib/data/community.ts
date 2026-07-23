import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Community, CommunityMembership, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

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

// Public communities the user could self-join (excludes anything they
// already have a membership row for, active or otherwise).
export async function getDiscoverableCommunities(supabase: Client, userId: string): Promise<Community[]> {
  const { data: memberships, error: membershipError } = await supabase
    .from("community_memberships")
    .select("community_id")
    .eq("user_id", userId);

  if (membershipError) throw membershipError;

  const joinedIds = (memberships ?? []).map((m) => m.community_id);

  let query = supabase.from("communities").select("*").eq("is_public", true);
  if (joinedIds.length > 0) {
    query = query.not("id", "in", `(${joinedIds.join(",")})`);
  }

  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
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
