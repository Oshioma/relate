import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Club, Profile, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export type ClubWithContext = Club & { creator: Profile; space: Pick<Space, "id" | "name" | "slug"> };

// Newest clubs across the whole community, for the feed. Skips member counts
// (unlike getSpaceClubs) — the feed just needs the club itself.
export async function getCommunityRecentClubs(supabase: Client, communityId: string, limit = 6): Promise<ClubWithContext[]> {
  const { data, error } = await supabase
    .from("clubs")
    .select("*, creator:created_by (*), space:space_id (id, name, slug)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ClubWithContext[];
}

export type ClubWithMembers = {
  club: Club;
  members: Profile[];
  memberCount: number;
  viewerJoined: boolean;
};

export async function getSpaceClubs(supabase: Client, spaceId: string, viewerId: string): Promise<ClubWithMembers[]> {
  const { data: clubs, error } = await supabase.from("clubs").select("*").eq("space_id", spaceId).order("created_at", { ascending: false });

  if (error) throw error;
  if (!clubs || clubs.length === 0) return [];

  const clubIds = clubs.map((c) => c.id);

  const { data: members, error: membersError } = await supabase
    .from("club_members")
    .select("club_id, user_id, profile:user_id (*)")
    .in("club_id", clubIds);

  if (membersError) throw membersError;

  const byClubId = new Map<string, { profile: Profile; userId: string }[]>();
  for (const row of members ?? []) {
    const list = byClubId.get(row.club_id) ?? [];
    if (row.profile) list.push({ profile: row.profile as unknown as Profile, userId: row.user_id });
    byClubId.set(row.club_id, list);
  }

  return clubs.map((club) => {
    const rows = byClubId.get(club.id) ?? [];
    return {
      club,
      members: rows.map((r) => r.profile),
      memberCount: rows.length,
      viewerJoined: rows.some((r) => r.userId === viewerId),
    };
  });
}
