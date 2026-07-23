import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Recommendation, Profile, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export type RecommendationWithContext = Recommendation & { recommendedBy: Profile; space: Pick<Space, "id" | "name" | "slug"> };

// Newest recommendations across the whole community, for the feed. Skips
// vote counts (unlike getSpaceRecommendations) — the feed just needs the
// recommendation itself, not its full space-page detail.
export async function getCommunityRecentRecommendations(
  supabase: Client,
  communityId: string,
  limit = 6
): Promise<RecommendationWithContext[]> {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*, recommendedBy:recommended_by (*), space:space_id (id, name, slug)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as RecommendationWithContext[];
}

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
