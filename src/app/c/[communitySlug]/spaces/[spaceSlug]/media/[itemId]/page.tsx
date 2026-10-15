import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getMediaItem } from "@/lib/data/media-items";
import { isMediaReviewConfigured } from "@/lib/ai/analyse-media";
import { MediaItemDetail } from "../../media-item-detail";

// One reviewed book, video or show on its own page: the whole review, the
// reasons, what the AI found and where, and — as a labelled button rather
// than the title itself — the link out to wherever it is sold or shown.
export default async function MediaItemPage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; itemId: string }>;
}) {
  const { communitySlug, spaceSlug, itemId } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space || space.space_type !== "books_media") notFound();

  // RLS already limits this to items in spaces the viewer can see; the
  // space_id check stops an item being reached through another space's URL.
  const item = await getMediaItem(supabase, itemId);
  if (!item || item.space_id !== space.id) notFound();

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const isStaff =
    membership?.status === "active" &&
    (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  const canManage = Boolean(isStaff) || (Boolean(user) && item.created_by === user?.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <MediaItemDetail
        item={item}
        communitySlug={community.slug}
        spaceSlug={space.slug}
        spaceName={space.name}
        canManage={canManage}
        aiConfigured={isMediaReviewConfigured()}
      />
    </div>
  );
}
