import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type PublicCrop = {
  slug: string;
  name: string;
  imageUrl: string;
  overview: string | null;
  difficulty: string | null;
  daysToHarvest: number | null;
  beginnerFriendly: boolean;
};

// A few published crop guides with photos, for a community's public landing
// page. Crops are platform-wide reference records readable only when signed in
// (RLS), but a guide's name, photo and one-line overview are exactly what a
// landing page should show off — the full guide still sits behind sign-up.
// Only published crops with an image, only these display columns. Beginner-
// friendly crops first. Fails soft to an empty list.
export async function getPublicCrops(limit = 6): Promise<PublicCrop[]> {
  try {
    const { data, error } = await createAdminClient()
      .from("crops")
      .select("slug, common_name, image_url, overview, difficulty, time_to_maturity_days, beginner_friendly")
      .eq("status", "published")
      .not("image_url", "is", null)
      .neq("image_url", "")
      .order("beginner_friendly", { ascending: false })
      .order("common_name", { ascending: true })
      .limit(limit);
    if (error || !data) return [];
    return data.map((crop) => ({
      slug: crop.slug,
      name: crop.common_name,
      imageUrl: crop.image_url as string,
      overview: crop.overview,
      difficulty: crop.difficulty,
      daysToHarvest: crop.time_to_maturity_days,
      beginnerFriendly: crop.beginner_friendly,
    }));
  } catch {
    return [];
  }
}
