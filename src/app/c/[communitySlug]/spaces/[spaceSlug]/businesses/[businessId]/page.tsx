import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getBusinessDetail, getCommunityBusinessCustomCategories, getCommunityBusinessCategoryLabelOverrides } from "@/lib/data/businesses";
import { getCommunityAccommodationSpace, getStayLinkForBusiness } from "@/lib/data/accommodation";
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
  // Adding a listing is attribution, not ownership. The "owner" is only a member
  // whose claim was approved (claimed_by); the adder (created_by) is a curator.
  const isOwner = detail.business.claimed_by === viewerId;
  // Hand-off: the adder maintains the listing until it's claimed, then the owner
  // takes over. Staff and super admins can always manage.
  const isCaretaker = detail.business.claimed_by === null && detail.business.created_by === viewerId;
  const canManage = isOwner || isCaretaker || Boolean(isStaff) || isSuperAdmin;
  // Anyone signed in who can see this listing may claim an unclaimed one they
  // don't already have a *live* claim on — including the member who added it (a
  // curator claiming a listing they own) and a brand-new user who hasn't joined
  // the community yet ("claim your business" is how an owner gets connected). A
  // previously declined claim doesn't lock them out: they can claim again. Staff
  // still approve every claim before ownership is granted.
  const canClaim =
    Boolean(user) &&
    detail.business.claimed_by === null &&
    (detail.viewerClaim === null || detail.viewerClaim.status === "rejected");

  const [customCategories, labelOverrides] = await Promise.all([
    getCommunityBusinessCustomCategories(supabase, community.id),
    getCommunityBusinessCategoryLabelOverrides(supabase, community.id),
  ]);

  // Accommodation bridge: is this stay-like business already linked to a stay,
  // and (if not) is there an accommodation space to create one in?
  // The bridge used to be offered only on listings already tagged as
  // accommodation — no help at all to a hotel someone filed under Restaurants,
  // which is exactly when it's needed. Anyone who manages the listing can reach
  // it now; the card just states its case more quietly when we haven't detected
  // anything ourselves.
  const isStayLike = detail.business.category === "accommodation";
  const [linkedStay, accommodationSpace] = await Promise.all([
    getStayLinkForBusiness(supabase, detail.business.id),
    canManage ? getCommunityAccommodationSpace(supabase, community.id) : Promise.resolve(null),
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
        canManage={canManage}
        isStaff={Boolean(isStaff)}
        // Any active member may review, except the owner of a listing they've
        // claimed (you can't rate your own business). Adding a listing is
        // curation, not ownership, so the adder may still review it. Super admins
        // may review anything, for seeding.
        canReview={Boolean(isActive) && (!isOwner || isSuperAdmin)}
        // Whoever manages the listing may reply to reviews on its behalf.
        canReply={canManage}
        // Any active member may bookmark.
        canSave={Boolean(isActive)}
        canClaim={canClaim}
        linkedStay={linkedStay}
        canCreateStay={canManage && accommodationSpace !== null}
        stayDetected={isStayLike}
        customCategories={customCategories.filter((c) => c.space_id === space.id)}
        labelOverrides={labelOverrides.filter((o) => o.space_id === space.id)}
      />
    </div>
  );
}
