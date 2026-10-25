import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { circlePicturesInHtml, isCirclePictureUrl } from "@/lib/circle-pictures";

/** How many Circle pictures are still waiting, for the admin card's count. */
export async function countCirclePictures(communityId: string): Promise<number> {
  try {
    const admin = createAdminClient();
    const [{ data: members }, { data: guides }] = await Promise.all([
      admin
        .from("community_memberships")
        .select("profile:user_id (avatar_url)")
        .eq("community_id", communityId)
        .eq("status", "active"),
      admin.from("guides").select("body").eq("community_id", communityId),
    ]);
    let count = 0;
    for (const row of (members ?? []) as unknown as { profile: { avatar_url: string | null } | null }[]) {
      if (isCirclePictureUrl(row.profile?.avatar_url)) count++;
    }
    for (const guide of guides ?? []) count += circlePicturesInHtml(guide.body).length;
    return count;
  } catch {
    return 0;
  }
}
