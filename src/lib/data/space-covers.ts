import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { CoverPhoto } from "@/lib/space-covers";
import { isImageUrl } from "@/lib/utils";

type Client = SupabaseClient<Database>;

// How many photos to pull from each source — enough to find a distinct one per
// card without reading a whole directory.
const PER_SOURCE = 30;

// Photos from the content of a community's spaces, used as cover fallbacks on
// the welcome page (see pickSpaceCovers). RLS applies as usual, so a guest only
// gets photos from content they could see anyway; a source that fails just
// contributes nothing rather than breaking the page.
export async function getSpaceContentPhotos(supabase: Client, communityId: string): Promise<CoverPhoto[]> {
  const [businesses, stays, posts] = await Promise.all([
    supabase
      .from("businesses")
      .select("space_id, image_url")
      .eq("community_id", communityId)
      .not("image_url", "is", null)
      .order("created_at", { ascending: true })
      .limit(PER_SOURCE),
    supabase
      .from("accommodation_listings")
      .select("space_id, photo_urls")
      .eq("community_id", communityId)
      .eq("status", "available")
      .order("created_at", { ascending: true })
      .limit(PER_SOURCE),
    supabase
      .from("posts")
      .select("space_id, media_url")
      .eq("community_id", communityId)
      .not("media_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(PER_SOURCE),
  ]);

  const photos: CoverPhoto[] = [];
  for (const row of businesses.data ?? []) {
    if (row.image_url) photos.push({ spaceId: row.space_id, url: row.image_url });
  }
  for (const row of stays.data ?? []) {
    const first = row.photo_urls?.[0];
    if (first) photos.push({ spaceId: row.space_id, url: first });
  }
  // A post's media can be a video or a file, so only take real images.
  for (const row of posts.data ?? []) {
    if (row.media_url && isImageUrl(row.media_url)) photos.push({ spaceId: row.space_id, url: row.media_url });
  }
  return photos;
}
