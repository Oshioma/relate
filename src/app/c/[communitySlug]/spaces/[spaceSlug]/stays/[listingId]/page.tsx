import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getAccommodationDetail, getCommunityBusinessLinkOptions } from "@/lib/data/accommodation";
import { AccommodationDetailView } from "../../accommodation-detail-view";

export default async function AccommodationDetailPage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; listingId: string }>;
}) {
  const { communitySlug, spaceSlug, listingId } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) notFound();

  const viewerId = user?.id ?? "";
  const detail = await getAccommodationDetail(supabase, listingId, viewerId);
  if (!detail || detail.listing.space_id !== space.id) notFound();

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const isActive = membership?.status === "active";
  const isStaff = isActive && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  // The lister (listed_by) manages their own listing; staff can always manage.
  const canManage = detail.listing.listed_by === viewerId || Boolean(isStaff);
  // Directory listings this stay can link to — only needed when the viewer can
  // edit it.
  const businesses = canManage ? await getCommunityBusinessLinkOptions(supabase, community.id) : [];

  // For the "this is a restaurant too" bridge: the community's directory space
  // and the categories it offers, so the picker matches what the directory's
  // own form would show. Only whoever manages the stay ever sees it.
  const { data: directorySpace } = canManage
    ? await supabase
        .from("spaces")
        .select("id")
        .eq("community_id", community.id)
        .eq("space_type", "business_directory")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle()
    : { data: null };
  const { data: directoryCategories } = directorySpace
    ? await supabase.from("business_custom_categories").select("*").eq("space_id", directorySpace.id)
    : { data: null };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Link href={`/c/${community.slug}/spaces/${space.slug}`} className="hover:underline">
          {space.name}
        </Link>
      </p>

      <AccommodationDetailView
        detail={detail}
        communitySlug={community.slug}
        spaceSlug={space.slug}
        userId={viewerId}
        canManage={canManage}
        canSave={Boolean(isActive)}
        // Any active member may review, except the host of this listing.
        canReview={Boolean(isActive) && detail.listing.listed_by !== viewerId}
        // The host or staff may reply to reviews.
        canReply={canManage}
        isStaff={Boolean(isStaff)}
        businesses={businesses}
        canCreateBusiness={canManage && directorySpace !== null}
        directoryCategories={directoryCategories ?? []}
      />
    </div>
  );
}
