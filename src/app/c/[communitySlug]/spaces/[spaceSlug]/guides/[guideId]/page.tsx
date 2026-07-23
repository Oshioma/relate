import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getGuideDetail } from "@/lib/data/guides";
import { GuideDetailView } from "../../guide-detail-view";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; guideId: string }>;
}) {
  const { communitySlug, spaceSlug, guideId } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) notFound();

  const viewerId = user?.id ?? "";
  const detail = await getGuideDetail(supabase, guideId, viewerId);
  if (!detail || detail.guide.space_id !== space.id) notFound();

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const canComment = membership?.status === "active";
  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  const isCreator = detail.guide.created_by === viewerId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Link href={`/c/${community.slug}/spaces/${space.slug}`} className="hover:underline">
          {space.name}
        </Link>
      </p>

      <GuideDetailView
        detail={detail}
        communitySlug={community.slug}
        spaceSlug={space.slug}
        userId={viewerId}
        canComment={Boolean(canComment)}
        canEdit={Boolean(canComment)}
        canDelete={isCreator || Boolean(isStaff)}
        isStaff={Boolean(isStaff)}
      />
    </div>
  );
}
