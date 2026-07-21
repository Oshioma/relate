import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Guide, GuideRevision, GuideComment, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export type GuideWithStats = {
  guide: Guide;
  avgRating: number | null;
  ratingCount: number;
  contributorCount: number;
};

export async function getSpaceGuides(supabase: Client, spaceId: string): Promise<GuideWithStats[]> {
  const { data: guides, error } = await supabase
    .from("guides")
    .select("*")
    .eq("space_id", spaceId)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!guides || guides.length === 0) return [];

  const guideIds = guides.map((g) => g.id);

  const [{ data: ratings, error: ratingsError }, { data: contributors, error: contributorsError }] = await Promise.all([
    supabase.from("guide_ratings").select("guide_id, rating").in("guide_id", guideIds),
    supabase.from("guide_contributors").select("guide_id").in("guide_id", guideIds),
  ]);

  if (ratingsError) throw ratingsError;
  if (contributorsError) throw contributorsError;

  const ratingsByGuideId = new Map<string, number[]>();
  for (const row of ratings ?? []) {
    const list = ratingsByGuideId.get(row.guide_id) ?? [];
    list.push(row.rating);
    ratingsByGuideId.set(row.guide_id, list);
  }

  const contributorCountByGuideId = new Map<string, number>();
  for (const row of contributors ?? []) {
    contributorCountByGuideId.set(row.guide_id, (contributorCountByGuideId.get(row.guide_id) ?? 0) + 1);
  }

  return guides.map((guide) => {
    const guideRatings = ratingsByGuideId.get(guide.id) ?? [];
    return {
      guide,
      avgRating: average(guideRatings),
      ratingCount: guideRatings.length,
      contributorCount: contributorCountByGuideId.get(guide.id) ?? 0,
    };
  });
}

export type GuideDetail = {
  guide: Guide;
  contributors: Profile[];
  revisions: GuideRevision[];
  comments: (GuideComment & { author: Profile })[];
  avgRating: number | null;
  ratingCount: number;
  viewerRating: number | null;
};

export async function getGuideDetail(supabase: Client, guideId: string, viewerId: string): Promise<GuideDetail | null> {
  const { data: guide, error } = await supabase.from("guides").select("*").eq("id", guideId).maybeSingle();
  if (error) throw error;
  if (!guide) return null;

  const [{ data: contributorRows, error: contributorsError }, { data: revisions, error: revisionsError }, { data: comments, error: commentsError }, { data: ratings, error: ratingsError }] =
    await Promise.all([
      supabase.from("guide_contributors").select("user_id, profile:user_id (*)").eq("guide_id", guideId),
      supabase.from("guide_revisions").select("*").eq("guide_id", guideId).order("created_at", { ascending: false }),
      supabase.from("guide_comments").select("*, author:author_id (*)").eq("guide_id", guideId).order("created_at", { ascending: true }),
      supabase.from("guide_ratings").select("user_id, rating").eq("guide_id", guideId),
    ]);

  if (contributorsError) throw contributorsError;
  if (revisionsError) throw revisionsError;
  if (commentsError) throw commentsError;
  if (ratingsError) throw ratingsError;

  const contributors = (contributorRows ?? []).map((row) => row.profile).filter((p): p is Profile => Boolean(p)) as unknown as Profile[];
  const ratingValues = (ratings ?? []).map((r) => r.rating);
  const viewerRating = (ratings ?? []).find((r) => r.user_id === viewerId)?.rating ?? null;

  return {
    guide,
    contributors,
    revisions: revisions ?? [],
    comments: (comments ?? []) as unknown as (GuideComment & { author: Profile })[],
    avgRating: average(ratingValues),
    ratingCount: ratingValues.length,
    viewerRating,
  };
}
