import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Profile photos for testimonials linked to a member (Admin -> Testimonials),
// keyed by user id. A signed-out visitor can't read profiles under RLS, so
// this uses the service role, but only for the avatar column, only for the
// ids an admin linked, and only while each person is still an active member
// of this community. Fails soft: initials beat a page that 500s.
export async function getTestimonialMemberPhotos(communityId: string, memberIds: string[]): Promise<Map<string, string>> {
  const photos = new Map<string, string>();
  if (memberIds.length === 0) return photos;
  try {
    const { data, error } = await createAdminClient()
      .from("community_memberships")
      .select("user_id, profile:user_id (avatar_url)")
      .eq("community_id", communityId)
      .eq("status", "active")
      .in("user_id", memberIds);
    if (error || !data) return photos;
    for (const row of data as unknown as { user_id: string; profile: { avatar_url: string | null } | null }[]) {
      if (row.profile?.avatar_url) photos.set(row.user_id, row.profile.avatar_url);
    }
  } catch {
    // keep the initials
  }
  return photos;
}
