import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Recommendation, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export type RecommendationWithVotes = {
  recommendation: Recommendation;
  recommendedBy: Profile;
  voteCount: number;
  viewerVoted: boolean;
};

export async function getSpaceRecommendations(supabase: Client, spaceId: string, viewerId: string): Promise<RecommendationWithVotes[]> {
  const { data: recommendations, error } = await supabase
    .from("recommendations")
    .select("*, recommendedBy:recommended_by (*)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!recommendations || recommendations.length === 0) return [];

  const ids = recommendations.map((r) => r.id);
  const { data: votes, error: votesError } = await supabase.from("recommendation_votes").select("recommendation_id, user_id").in("recommendation_id", ids);

  if (votesError) throw votesError;

  const votesByRecommendationId = new Map<string, string[]>();
  for (const vote of votes ?? []) {
    const list = votesByRecommendationId.get(vote.recommendation_id) ?? [];
    list.push(vote.user_id);
    votesByRecommendationId.set(vote.recommendation_id, list);
  }

  return (recommendations as unknown as (Recommendation & { recommendedBy: Profile })[]).map((row) => {
    const voterIds = votesByRecommendationId.get(row.id) ?? [];
    const { recommendedBy, ...recommendation } = row;
    return {
      recommendation,
      recommendedBy,
      voteCount: voterIds.length,
      viewerVoted: voterIds.includes(viewerId),
    };
  });
}
