import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getBusinessDetail, getCommunityBusinessCustomCategories, getCommunityBusinessCategoryLabelOverrides } from "@/lib/data/businesses";
import { BusinessDetailView } from "../../business-detail-view";

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; businessId: string }>;
}) {
  const { communitySlug, spaceSlug, businessId } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) notFound();

  const viewerId = user?.id ?? "";
  const detail = await getBusinessDetail(supabase, businessId, viewerId);
  if (!detail || detail.business.space_id !== space.id) notFound();

  const [membership, profile] = await Promise.all([
    user ? getMembership(supabase, community.id, user.id) : Promise.resolve(null),
    user ? getProfile(supabase, user.id) : Promise.resolve(null),
  ]);
  const isActive = membership?.status === "active";
  const isStaff = isActive && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  // Platform super admins may review a listing they added themselves (handy for
  // seeding/testing); everyone else still can't review their own listing.
  const isSuperAdmin = Boolean(profile?.is_super_admin);
  // "Owner" = the member who added the listing or a member whose claim was approved.
  const isOwner = detail.business.created_by === viewerId || detail.business.claimed_by === viewerId;
  const canClaim = Boolean(isActive) && !isOwner && detail.business.claimed_by === null && detail.viewerClaim === null;

  const [customCategories, labelOverrides] = await Promise.all([
    getCommunityBusinessCustomCategories(supabase, community.id),
    getCommunityBusinessCategoryLabelOverrides(supabase, community.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Link href={`/c/${community.slug}/spaces/${space.slug}`} className="hover:underline">
          {space.name}
        </Link>
      </p>

      <BusinessDetailView
        detail={detail}
        communityId={community.id}
        communitySlug={community.slug}
        spaceSlug={space.slug}
        userId={viewerId}
        canManage={isOwner || Boolean(isStaff)}
        isStaff={Boolean(isStaff)}
        // Any active member may review, except the listing's own owner — but a
        // super admin may review even their own listing.
        canReview={Boolean(isActive) && (!isOwner || isSuperAdmin)}
        // The owner or staff may reply to reviews.
        canReply={isOwner || Boolean(isStaff)}
        // Any active member may bookmark.
        canSave={Boolean(isActive)}
        canClaim={canClaim}
        customCategories={customCategories.filter((c) => c.space_id === space.id)}
        labelOverrides={labelOverrides.filter((o) => o.space_id === space.id)}
      />
    </div>
  );
}
