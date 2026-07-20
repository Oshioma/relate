import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Challenge, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export type ChallengeWithParticipants = {
  challenge: Challenge;
  participants: Profile[];
  participantCount: number;
  viewerJoined: boolean;
};

export async function getSpaceChallenges(
  supabase: Client,
  spaceId: string,
  viewerId: string
): Promise<ChallengeWithParticipants[]> {
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("space_id", spaceId)
    .order("start_date", { ascending: false });

  if (error) throw error;
  if (!challenges || challenges.length === 0) return [];

  const challengeIds = challenges.map((c) => c.id);

  const { data: participants, error: participantsError } = await supabase
    .from("challenge_participants")
    .select("challenge_id, user_id, profile:user_id (*)")
    .in("challenge_id", challengeIds);

  if (participantsError) throw participantsError;

  const byChallengeId = new Map<string, { profile: Profile; userId: string }[]>();
  for (const row of participants ?? []) {
    const list = byChallengeId.get(row.challenge_id) ?? [];
    if (row.profile) list.push({ profile: row.profile as unknown as Profile, userId: row.user_id });
    byChallengeId.set(row.challenge_id, list);
  }

  return challenges.map((challenge) => {
    const rows = byChallengeId.get(challenge.id) ?? [];
    return {
      challenge,
      participants: rows.map((r) => r.profile),
      participantCount: rows.length,
      viewerJoined: rows.some((r) => r.userId === viewerId),
    };
  });
}
