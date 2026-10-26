import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { circlePicturesInHtml, circleVideosInHtml, isCirclePictureUrl } from "@/lib/circle-pictures";

/** How many Circle pictures and videos are still waiting, for the admin card's count. */
export async function countCirclePictures(communityId: string): Promise<number> {
  try {
    const admin = createAdminClient();
    const [{ data: members }, { data: guides }, { data: posts }] = await Promise.all([
      admin
        .from("community_memberships")
        .select("profile:user_id (avatar_url)")
        .eq("community_id", communityId)
        .eq("status", "active"),
      admin.from("guides").select("body").eq("community_id", communityId),
      admin.from("posts").select("body").eq("community_id", communityId),
    ]);
    let count = 0;
    for (const row of (members ?? []) as unknown as { profile: { avatar_url: string | null } | null }[]) {
      if (isCirclePictureUrl(row.profile?.avatar_url)) count++;
    }
    for (const piece of [...(guides ?? []), ...(posts ?? [])]) count += circlePicturesInHtml(piece.body).length + circleVideosInHtml(piece.body).length;
    return count;
  } catch {
    return 0;
  }
}
