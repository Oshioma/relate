import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getAccommodationDetail, getCommunityBusinessLinkOptions, resolveAccommodationRef } from "@/lib/data/accommodation";
import { AccommodationDetailView } from "../../accommodation-detail-view";
import { accommodationTypeLabel } from "@/lib/accommodation-types";
import { absoluteUrl, canonicalUrl, jsonLd, metaDescription, stayJsonLd } from "@/lib/seo";
import { pageCanonical } from "@/lib/seo-site";

type Params = Promise<{ communitySlug: string; spaceSlug: string; listingId: string }>;

// Each stay is its own search result — "Coral Villa – Guesthouse in Paje" —
// with the host's own description when there is one.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { communitySlug, spaceSlug, listingId: listingRef } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return {};
  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) return {};
  const ref = await resolveAccommodationRef(supabase, space.id, listingRef);
  if (!ref) return {};
  const { data: listing } = await supabase.from("accommodation_listings").select("*").eq("id", ref.id).maybeSingle();
  if (!listing || listing.space_id !== space.id) return {};
  const { url, origin } = await pageCanonical(community);
  const label = accommodationTypeLabel(listing.accommodation_type);
  const place = listing.location_label?.trim() || null;
  const title = `${listing.name} – ${label}${place ? ` in ${place}` : ""}`;
  const description =
    metaDescription(listing.description) ??
    `${listing.name}${place ? ` in ${place}` : ""}: ${label.toLowerCase()} photos, prices, amenities and reviews on ${community.name}.`;
  const image = absoluteUrl(listing.photo_urls?.[0], origin);
  return {
    title,
    description,
    // A stay marked unavailable stays reachable for its links and reviews,
    // but is no longer something to send searchers to.
    ...(listing.status === "available" ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      siteName: community.name,
      locale: "en_GB",
      title,
      description,
      ...(url ? { url } : {}),
      ...(image ? { images: [image] } : {}),
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function AccommodationDetailPage({
  params,
}: {
  params: Params;
}) {
  // The [listingId] segment is really an "id or slug" — old links carry the
  // UUID, new ones the human slug.
  const { communitySlug, spaceSlug, listingId: listingRef } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) notFound();

  const ref = await resolveAccommodationRef(supabase, space.id, listingRef);
  if (!ref) notFound();

  // Canonicalize to the slug URL: a request that came in on the UUID is
  // redirected to the stay's slug so shared and bookmarked links settle on the
  // readable form.
  if (ref.slug && listingRef !== ref.slug) {
    redirect(`/c/${communitySlug}/spaces/${spaceSlug}/stays/${ref.slug}`);
  }

  const viewerId = user?.id ?? "";
  const detail = await getAccommodationDetail(supabase, ref.id, viewerId);
  if (!detail || detail.listing.space_id !== space.id) notFound();

  const [membership, profile] = await Promise.all([
    user ? getMembership(supabase, community.id, user.id) : Promise.resolve(null),
    user ? getProfile(supabase, user.id) : Promise.resolve(null),
  ]);
  const isActive = membership?.status === "active";
  const isStaff = isActive && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  const isSuperAdmin = Boolean(profile?.is_super_admin);
  // Listing a stay is attribution, not ownership: the host is whoever's claim
  // staff approved (claimed_by). Hand-off — the lister maintains the stay while
  // it's unclaimed, then the host takes over. Staff and super admins always can.
  const isHost = detail.listing.claimed_by === viewerId;
  const isCaretaker = detail.listing.claimed_by === null && detail.listing.listed_by === viewerId;
  const canManage = isHost || isCaretaker || Boolean(isStaff) || isSuperAdmin;
  // Anyone signed in who can see an unclaimed stay may ask to host it — including
  // the member who listed it and a brand-new user who hasn't joined the community
  // yet, since claiming is how a host gets connected in the first place. A
  // previously declined claim doesn't lock them out. Staff approve every claim.
  const canClaim =
    Boolean(user) && detail.listing.claimed_by === null && (detail.viewerClaim === null || detail.viewerClaim.status === "rejected");
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
  // And that space's relabellings of the built-in categories. Without them the
  // picker offers "Restaurant" to a community that renamed it to "Eating out" —
  // the one name they've already replaced everywhere else in the directory.
  const { data: directoryLabelOverrides } = directorySpace
    ? await supabase.from("business_category_label_overrides").select("*").eq("space_id", directorySpace.id)
    : { data: null };

  // Structured data for a rich result: the stay, where it is, its price and
  // amenities, and its rating from this community's own reviews.
  const { origin, url } = await pageCanonical(community);
  const structured =
    origin && url
      ? stayJsonLd({
          listing: detail.listing,
          url,
          images: (detail.listing.photo_urls ?? []).map((src) => absoluteUrl(src, origin)).filter((src): src is string => Boolean(src)),
          rating: { avgRating: detail.avgRating, ratingCount: detail.ratingCount },
          breadcrumbs: [
            { name: community.name, url: canonicalUrl(origin, "/") },
            { name: space.name, url: canonicalUrl(origin, `/spaces/${space.slug}`) },
            { name: detail.listing.name, url },
          ],
        })
      : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      {structured.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
      ))}
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Link href={`/c/${community.slug}/spaces/${space.slug}`} className="hover:underline">
          {space.name}
        </Link>
      </p>

      <AccommodationDetailView
        detail={detail}
        communityId={community.id}
        communitySlug={community.slug}
        spaceSlug={space.slug}
        userId={viewerId}
        isLoggedIn={Boolean(user)}
        canManage={canManage}
        canSave={Boolean(isActive)}
        // Any active member may review, except whoever the listing speaks for —
        // its host, or the lister while it's unclaimed. Super admins may review
        // anything, for seeding.
        canReview={Boolean(isActive) && (!(isHost || isCaretaker) || isSuperAdmin)}
        // The host or staff may reply to reviews.
        canReply={canManage}
        canClaim={canClaim}
        isStaff={Boolean(isStaff)}
        businesses={businesses}
        canCreateBusiness={canManage && directorySpace !== null}
        directoryCategories={directoryCategories ?? []}
        directoryLabelOverrides={directoryLabelOverrides ?? []}
      />
    </div>
  );
}
