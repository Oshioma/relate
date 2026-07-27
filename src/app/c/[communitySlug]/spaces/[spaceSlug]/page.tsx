import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MessageSquare, Pin, ExternalLink, NotebookPen, Flag, ScanLine, LayoutTemplate } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RichText, toPlainText } from "@/components/ui/rich-text";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getSpacePosts } from "@/lib/data/posts";
import { SMILE_EMOJI } from "@/lib/post-reactions";
import { getSpaceResources } from "@/lib/data/resources";
import { getSpaceJournalFields, getSpaceJournalEntries } from "@/lib/data/journal";
import { getMemberTimeline } from "@/lib/data/growth-journey";
import { getSpaceChallenges } from "@/lib/data/challenges";
import { getSpaceBusinessesWithStats, getCommunityFeaturedBusinessCategories, getCommunityBusinessCustomCategories, getCommunityBusinessCategoryLabelOverrides } from "@/lib/data/businesses";
import { businessCategoryOptions } from "@/lib/business-categories";
import { getMapCategories, getSpaceLandmarks, getCommunityMapPinnedBusinesses } from "@/lib/data/map";
import { getCommunityMapItems } from "@/lib/data/map-items";
import { getSpaceListings } from "@/lib/data/marketplace";
import { getSpaceJobListings } from "@/lib/data/jobs";
import { getSpaceAccommodationListingsWithStats, getCommunityBusinessLinkOptions } from "@/lib/data/accommodation";
import { getSpaceRecommendations } from "@/lib/data/recommendations";
import { getSpaceClubs } from "@/lib/data/clubs";
import { getSpaceGuides } from "@/lib/data/guides";
import { getCrops, getCropRegions, getCommunityCropRegions, getCurrentMonthCalendar, getSavedCropIds, getCropSearchIndex, getCropProposals, type MonthCalendarRow } from "@/lib/data/crop-guides";
import { getMyFarmCrops, getPublicFarmCrops, isFarmBridgeConfigured, type FarmCrop, type PublicFarm } from "@/lib/farm-bridge";
import { getMyFarmPublic, getPublicFarmers } from "@/lib/data/farm-shares";
import { isPlantScannerConfigured } from "@/lib/ai/plant-scanner";
import { isPlantIdConfigured } from "@/lib/ai/plant-id";
import type { CropRegion, CommunityCropRegion } from "@/types/database";
import { getSpaceVolunteerProjects } from "@/lib/data/volunteer-hub";
import { getSpaceCourses } from "@/lib/data/courses";
import {
  getDirectoryMembers,
  isDiscoverable,
  getNewMembers,
  getRecommendedMembers,
  getMembersNearYou,
  getRecentlyActiveMembers,
  getTopContributors,
  getBusinesses,
} from "@/lib/data/member-directory";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatRelativeTime, isImageUrl, isVideoUrl } from "@/lib/utils";
import { MediaAttachment } from "@/components/ui/media-attachment";
import { NewPostForm } from "./new-post-form";
import { SpaceResourceForm } from "./space-resource-form";
import { TidesWeatherPanel } from "./tides-weather-panel";
import { JournalEntryForm } from "./journal-entry-form";
import { GrowthJourneyView } from "./growth-journey-view";
import { NewChallengeForm } from "./new-challenge-form";
import { ChallengeCard } from "./challenge-card";
import { BusinessDirectoryView } from "./business-directory-view";
import { ExploreMapLoader } from "./explore-map-loader";
import { MarketplaceView } from "./marketplace-view";
import { JobsBoardView } from "./jobs-board-view";
import { AccommodationView } from "./accommodation-view";
import { RecommendationsView } from "./recommendations-view";
import { ClubsView } from "./clubs-view";
import { GuidesView } from "./guides-view";
import { VolunteerHubView } from "./volunteer-hub-view";
import { CoursesView } from "./courses-view";
import { CropGuidesView } from "./crop-guides-view";
import { PlantScannerPanel } from "./plant-scanner-panel";
import { MyCropsView } from "./my-crops-view";
import { PlantIdPanel } from "./plant-id-panel";
import { SPACE_TYPES } from "@/lib/space-types";
import { MemberDirectoryList } from "../../members/member-directory-list";
import { DiscoverySection } from "../../members/discovery-section";

export default async function SpaceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { communitySlug, spaceSlug } = await params;
  const { category: rawCategory } = await searchParams;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  // RLS only returns the space to a guest when it's public; members/private
  // resolve to null here, so notFound doubles as the access gate.
  if (!space) notFound();

  // Guests have no id; the personalized data helpers only use this to flag
  // "you joined / you voted", so an empty id safely reads as "not yet".
  const viewerId = user?.id ?? "";

  const isResourceSpace = space.space_type === "resources";
  const isJournalSpace = space.space_type === "journal";
  const isGrowthJourneySpace = space.space_type === "growth_journey";
  const isDirectorySpace = space.space_type === "directory";
  const isChallengeSpace = space.space_type === "challenges";
  const isBusinessDirectorySpace = space.space_type === "business_directory";
  const isMapSpace = space.space_type === "map";
  const isMarketplaceSpace = space.space_type === "marketplace";
  const isJobsSpace = space.space_type === "jobs";
  const isAccommodationSpace = space.space_type === "accommodation";
  const isRecommendationsSpace = space.space_type === "recommendations";
  const isClubsSpace = space.space_type === "clubs";
  const isGuidesSpace = space.space_type === "guides";
  const isVolunteerHubSpace = space.space_type === "volunteer_hub";
  const isCourseSpace = space.space_type === "course";
  const isCropGuidesSpace = space.space_type === "crop_guides";
  const isPlantScannerSpace = space.space_type === "plant_scanner";
  const isMyCropsSpace = space.space_type === "my_crops";
  const isPlantIdSpace = space.space_type === "plant_id";
  // A standalone page: its description is the whole content (rendered as
  // sanitised HTML/Markdown), with no post form and no feed.
  const isCustomPageSpace = space.space_type === "custom";
  const isDiscussionLike =
    !isCustomPageSpace &&
    !isResourceSpace &&
    !isJournalSpace &&
    !isGrowthJourneySpace &&
    !isDirectorySpace &&
    !isChallengeSpace &&
    !isBusinessDirectorySpace &&
    !isMapSpace &&
    !isMarketplaceSpace &&
    !isJobsSpace &&
    !isAccommodationSpace &&
    !isRecommendationsSpace &&
    !isClubsSpace &&
    !isGuidesSpace &&
    !isVolunteerHubSpace &&
    !isCourseSpace &&
    !isCropGuidesSpace &&
    !isPlantScannerSpace &&
    !isMyCropsSpace &&
    !isPlantIdSpace;

  const [
    membership,
    posts,
    resources,
    journalFields,
    journalEntries,
    timeline,
    directoryMembers,
    challenges,
    businesses,
    mapCategories,
    landmarks,
    mapBusinesses,
    mapItems,
    listings,
    jobs,
    accommodationListings,
    accommodationBusinessOptions,
    recommendations,
    clubs,
    guides,
    volunteerProjects,
    courses,
    crops,
  ] = await Promise.all([
    user ? getMembership(supabase, community.id, user.id) : Promise.resolve(null),
    isDiscussionLike ? getSpacePosts(supabase, space.id, viewerId) : Promise.resolve([]),
    isResourceSpace ? getSpaceResources(supabase, space.id) : Promise.resolve([]),
    isJournalSpace ? getSpaceJournalFields(supabase, space.id) : Promise.resolve([]),
    isJournalSpace ? getSpaceJournalEntries(supabase, space.id) : Promise.resolve([]),
    // Growth journey is a personal timeline — only meaningful once signed in.
    isGrowthJourneySpace && user ? getMemberTimeline(supabase, community.id, community.slug, user.id) : Promise.resolve([]),
    // The member directory stays login-gated even inside a public space.
    isDirectorySpace && user ? getDirectoryMembers(supabase, community.id) : Promise.resolve([]),
    isChallengeSpace ? getSpaceChallenges(supabase, space.id, viewerId) : Promise.resolve([]),
    isBusinessDirectorySpace ? getSpaceBusinessesWithStats(supabase, space.id, viewerId) : Promise.resolve([]),
    isMapSpace ? getMapCategories(supabase, community.id) : Promise.resolve([]),
    isMapSpace ? getSpaceLandmarks(supabase, space.id) : Promise.resolve([]),
    isMapSpace ? getCommunityMapPinnedBusinesses(supabase, community.id) : Promise.resolve([]),
    isMapSpace ? getCommunityMapItems(supabase, community.id, community.slug) : Promise.resolve([]),
    isMarketplaceSpace ? getSpaceListings(supabase, space.id) : Promise.resolve([]),
    isJobsSpace ? getSpaceJobListings(supabase, space.id) : Promise.resolve([]),
    isAccommodationSpace ? getSpaceAccommodationListingsWithStats(supabase, space.id, viewerId) : Promise.resolve([]),
    isAccommodationSpace ? getCommunityBusinessLinkOptions(supabase, community.id) : Promise.resolve([]),
    isRecommendationsSpace ? getSpaceRecommendations(supabase, space.id, viewerId) : Promise.resolve([]),
    isClubsSpace ? getSpaceClubs(supabase, space.id, viewerId) : Promise.resolve([]),
    isGuidesSpace ? getSpaceGuides(supabase, space.id) : Promise.resolve([]),
    isVolunteerHubSpace ? getSpaceVolunteerProjects(supabase, space.id, viewerId) : Promise.resolve([]),
    isCourseSpace ? getSpaceCourses(supabase, space.id, viewerId) : Promise.resolve([]),
    // Crops power the Crop Guides / My Crops views, and also the "choose a
    // crop photo" picker in the discussion composer.
    isCropGuidesSpace || isMyCropsSpace || isDiscussionLike ? getCrops(supabase) : Promise.resolve([]),
  ]);

  // Region-aware calendar data for a Crop Guides space (see crop-guides-view).
  const cropCurrentMonth = new Date().getMonth() + 1;
  const [cropRegions, cropCommunityRegions, cropMonthCalendar]: [CropRegion[], CommunityCropRegion[], MonthCalendarRow[]] = isCropGuidesSpace
    ? await Promise.all([getCropRegions(supabase), getCommunityCropRegions(supabase, community.id), getCurrentMonthCalendar(supabase, cropCurrentMonth)])
    : [[], [], []];
  const cropSavedIds = isCropGuidesSpace && user ? await getSavedCropIds(supabase, user.id) : [];
  // Extra per-crop search terms (pests, diseases, companions, community ailments)
  // so the library is searchable by ailment and association, not just name.
  const cropSearchIndex = isCropGuidesSpace ? await getCropSearchIndex(supabase, community.id) : {};
  const cropProposals = isCropGuidesSpace && membership?.status === "active" ? await getCropProposals(supabase, community.id) : [];
  // Standalone Plant Health Scanner / My Crops spaces deep-link matched crops
  // into the community's Crop Guides space, if one exists.
  const cropGuidesSpaceSlug: string | null =
    isPlantScannerSpace || isMyCropsSpace || isPlantIdSpace
      ? (await supabase.from("spaces").select("slug").eq("community_id", community.id).eq("space_type", "crop_guides").order("sort_order", { ascending: true }).limit(1).maybeSingle()).data?.slug ?? null
      : null;
  // The user's crops from the shamba.online farm app (empty unless the bridge is
  // configured and the user's email is linked to a farm).
  const cropFarmCrops: FarmCrop[] = isMyCropsSpace ? await getMyFarmCrops(user?.email) : [];
  const farmAppUrl = process.env.NEXT_PUBLIC_FARM_APP_URL ?? null;
  // Farm sharing: whether the viewer has opted their own farm public, and the
  // other members of this community who have opted in (with their crops). The
  // toggle only makes sense when the bridge is actually wired up.
  const farmBridgeReady = isMyCropsSpace && isFarmBridgeConfigured();
  const myFarmPublic: boolean = isMyCropsSpace && user ? await getMyFarmPublic(supabase, user.id) : false;
  const publicFarms: PublicFarm[] =
    isMyCropsSpace && user ? await getPublicFarmCrops(await getPublicFarmers(community.id, user.id)) : [];

  const featuredBusinessCategories = isBusinessDirectorySpace
    ? (await getCommunityFeaturedBusinessCategories(supabase, community.id)).filter((f) => f.space_id === space.id).map((f) => f.category)
    : [];
  const businessCustomCategories = isBusinessDirectorySpace
    ? (await getCommunityBusinessCustomCategories(supabase, community.id)).filter((c) => c.space_id === space.id)
    : [];
  const businessLabelOverrides = isBusinessDirectorySpace
    ? (await getCommunityBusinessCategoryLabelOverrides(supabase, community.id)).filter((o) => o.space_id === space.id)
    : [];
  // Only honour a ?category= the directory actually has — built-in or custom.
  const initialCategory = businessCategoryOptions(businessCustomCategories).find((c) => c.value === rawCategory)?.value;

  // The island/coastal templates create a "Tides & Weather" resources space;
  // matching on the name (rather than a dedicated space_type) keeps renamed
  // copies and hand-made "Weather" spaces working too. The panel itself
  // decides what it can show — tides only for tidal location types, and an
  // admin-facing setup hint when the community has no usable location yet.
  const showLiveConditions = isResourceSpace && /tide|weather/i.test(space.name);

  const canPost = membership?.status === "active";
  // The composer offers the author's own photo as a one-tap image source, so
  // fetch their profile only when they can actually post in a discussion space.
  const posterProfile = isDiscussionLike && canPost && user ? await getProfile(supabase, user.id) : null;
  // The composer also lets the author pick a photo from their own "My Crops"
  // (their shamba.online farm). Returns [] fast when the bridge is unconfigured
  // or the member has no linked farm, so it's cheap to load in every discussion.
  const posterFarmCrops: FarmCrop[] = isDiscussionLike && canPost && user ? await getMyFarmCrops(user.email) : [];
  const isAdmin = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  // Mirrors is_community_staff() in schema.sql (owner/admin/moderator) — the
  // businesses table lets staff, not just admins, grant verified/featured.
  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  const TypeIcon = SPACE_TYPES[space.space_type].icon;

  const discoverableMembers = directoryMembers.filter(isDiscoverable);
  const viewerDirectoryEntry = directoryMembers.find((m) => m.profile.id === viewerId);
  const recommendedMembers = isDirectorySpace
    ? getRecommendedMembers(
        discoverableMembers,
        viewerId,
        viewerDirectoryEntry?.interests ?? [],
        viewerDirectoryEntry?.skills ?? [],
        viewerDirectoryEntry?.profile.profession ?? null
      )
    : [];
  const newMembers = isDirectorySpace ? getNewMembers(discoverableMembers) : [];
  const nearYouMembers = isDirectorySpace ? getMembersNearYou(discoverableMembers, viewerDirectoryEntry?.location ?? null) : [];
  const recentlyActiveMembers = isDirectorySpace ? getRecentlyActiveMembers(discoverableMembers) : [];
  const topContributorMembers = isDirectorySpace ? getTopContributors(discoverableMembers) : [];
  const businessMembers = isDirectorySpace ? getBusinesses(discoverableMembers) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6">
        {/* A custom page is a blank canvas: no default title or icon, its
            description *is* the whole page. Every other space keeps the
            title with a muted intro beneath it. */}
        {!isCustomPageSpace && (
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
            <TypeIcon className="h-5 w-5 text-muted-foreground" />
            {space.name}
          </h1>
        )}
        {space.description && (
          <RichText
            content={space.description}
            className={isCustomPageSpace ? "text-foreground" : "mt-2 text-muted-foreground"}
          />
        )}
      </div>

      {isResourceSpace ? (
        <>
          {showLiveConditions && (
            <Suspense fallback={null}>
              <TidesWeatherPanel
                community={community}
                spaceLocationName={space.location_name}
                communitySlug={community.slug}
                isAdmin={Boolean(isAdmin)}
              />
            </Suspense>
          )}

          {/* A live-conditions space is a data page first: the live panel is
              its content, so skip the add-resource form and the "no resources
              yet" placeholder — any resources that do exist still render. */}
          {canPost && !showLiveConditions && (
            <div className="mb-6">
              <SpaceResourceForm communityId={community.id} communitySlug={community.slug} spaceId={space.id} spaceSlug={space.slug} />
            </div>
          )}

          {resources.length === 0 ? (
            !showLiveConditions && (
              <EmptyState icon={<MessageSquare className="h-6 w-6" />} title="No resources yet" description="Links, files and guides added to this space will show up here." />
            )
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {resources.map((resource) => (
                <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer">
                  <Card className="h-full transition-shadow hover:shadow-sm">
                    <CardContent className="pt-5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{resource.title}</h3>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      </div>
                      {resource.description && (
                        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{resource.description}</p>
                      )}
                      <Badge tone="accent" className="mt-3">
                        {resource.resource_type}
                      </Badge>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </>
      ) : isJournalSpace ? (
        <>
          {canPost && (
            <div className="mb-6">
              <JournalEntryForm
                communityId={community.id}
                communitySlug={community.slug}
                spaceId={space.id}
                spaceSlug={space.slug}
                fields={journalFields}
              />
            </div>
          )}

          {journalEntries.length === 0 ? (
            <EmptyState icon={<NotebookPen className="h-6 w-6" />} title="No entries yet" description="Log the first entry above to start this journal." />
          ) : (
            <div className="space-y-3">
              {journalEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <Avatar src={entry.author?.avatar_url} name={entry.author?.full_name || entry.author?.username} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">
                          {entry.author?.full_name || entry.author?.username} · {formatRelativeTime(entry.created_at)}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          {journalFields.map((field) => {
                            const value = entry.data[field.id];
                            if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
                              return null;
                            }
                            if (field.field_type === "url" && typeof value === "string") {
                              return (
                                <div key={field.id} className="text-sm text-foreground">
                                  <span className="font-medium text-muted-foreground">{field.label}: </span>
                                  {isImageUrl(value) || isVideoUrl(value) ? (
                                    <div className="mt-1">
                                      <MediaAttachment url={value} className="max-h-48" />
                                    </div>
                                  ) : (
                                    <a href={value} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                                      {value}
                                    </a>
                                  )}
                                </div>
                              );
                            }
                            return (
                              <p key={field.id} className="text-sm text-foreground">
                                <span className="font-medium text-muted-foreground">{field.label}: </span>
                                {typeof value === "boolean" ? (value ? "Yes" : "No") : Array.isArray(value) ? value.join(", ") : String(value)}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : isGrowthJourneySpace ? (
        <GrowthJourneyView events={timeline} />
      ) : isDirectorySpace ? (
        !user ? (
          <EmptyState
            icon={<MessageSquare className="h-6 w-6" />}
            title="Members only"
            description="Log in or join this community to browse the member directory."
          />
        ) : (
        <>
          <DiscoverySection title="Recommended for you" members={recommendedMembers} communitySlug={community.slug} />
          <DiscoverySection title="New members" members={newMembers} communitySlug={community.slug} />
          <DiscoverySection title="Members near you" members={nearYouMembers} communitySlug={community.slug} />
          <DiscoverySection title="Recently active" members={recentlyActiveMembers} communitySlug={community.slug} />
          <DiscoverySection title="Top contributors" members={topContributorMembers} communitySlug={community.slug} />
          <DiscoverySection title="Businesses" members={businessMembers} communitySlug={community.slug} />

          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">All members</h2>
          <MemberDirectoryList members={directoryMembers} communitySlug={community.slug} currentUserId={viewerId} isAdmin={Boolean(isAdmin)} />
        </>
        )
      ) : isChallengeSpace ? (
        <>
          {isAdmin && (
            <div className="mb-6">
              <NewChallengeForm communityId={community.id} communitySlug={community.slug} spaceId={space.id} spaceSlug={space.slug} />
            </div>
          )}

          {challenges.length === 0 ? (
            <EmptyState icon={<Flag className="h-6 w-6" />} title="No challenges yet" description="Time-boxed programs members can join together will show up here." />
          ) : (
            <div className="space-y-3">
              {challenges.map((data) => (
                <ChallengeCard
                  key={data.challenge.id}
                  data={data}
                  communitySlug={community.slug}
                  spaceSlug={space.slug}
                  canManage={Boolean(isAdmin)}
                  canInteract={canPost}
                />
              ))}
            </div>
          )}
        </>
      ) : isBusinessDirectorySpace ? (
        <BusinessDirectoryView
          // Remount when a nav sub-link changes the category param, so the
          // view picks up the new initial filter.
          key={initialCategory ?? "all"}
          businesses={businesses}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          canPost={canPost}
          isStaff={Boolean(isStaff)}
          userId={viewerId}
          initialCategory={initialCategory}
          featuredCategories={featuredBusinessCategories}
          customCategories={businessCustomCategories}
          labelOverrides={businessLabelOverrides}
        />
      ) : isMapSpace ? (
        <ExploreMapLoader
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          categories={mapCategories}
          landmarks={landmarks}
          businesses={mapBusinesses}
          items={mapItems}
          canPost={canPost}
          isAdmin={Boolean(isAdmin)}
          userId={viewerId}
        />
      ) : isMarketplaceSpace ? (
        <MarketplaceView
          listings={listings}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          canPost={canPost}
          isStaff={Boolean(isStaff)}
          userId={viewerId}
        />
      ) : isJobsSpace ? (
        <JobsBoardView
          jobs={jobs}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          canPost={canPost}
          isStaff={Boolean(isStaff)}
          userId={viewerId}
        />
      ) : isAccommodationSpace ? (
        <AccommodationView
          listings={accommodationListings}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          canPost={canPost}
          userId={viewerId}
          businesses={accommodationBusinessOptions}
        />
      ) : isRecommendationsSpace ? (
        <RecommendationsView
          recommendations={recommendations}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          canPost={canPost}
          isStaff={Boolean(isStaff)}
          userId={viewerId}
        />
      ) : isClubsSpace ? (
        <ClubsView
          clubs={clubs}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          canPost={canPost}
          isStaff={Boolean(isStaff)}
          userId={viewerId}
        />
      ) : isGuidesSpace ? (
        <GuidesView guides={guides} communityId={community.id} communitySlug={community.slug} spaceId={space.id} spaceSlug={space.slug} canPost={canPost} />
      ) : isVolunteerHubSpace ? (
        <VolunteerHubView
          projects={volunteerProjects}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          canPost={canPost}
          isStaff={Boolean(isStaff)}
          userId={viewerId}
        />
      ) : isCourseSpace ? (
        <CoursesView
          courses={courses}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          isStaff={Boolean(isStaff)}
        />
      ) : isCropGuidesSpace ? (
        <CropGuidesView
          crops={crops}
          communitySlug={community.slug}
          spaceSlug={space.slug}
          communityId={community.id}
          isAdmin={Boolean(isAdmin)}
          regions={cropRegions}
          communityRegions={cropCommunityRegions}
          monthCalendar={cropMonthCalendar}
          currentMonth={cropCurrentMonth}
          savedIds={cropSavedIds}
          searchIndex={cropSearchIndex}
          proposals={cropProposals}
          isMember={canPost}
          isStaff={Boolean(isStaff)}
        />
      ) : isPlantScannerSpace ? (
        !isPlantScannerConfigured() ? (
          <EmptyState icon={<ScanLine className="h-6 w-6" />} title="Scanner not set up" description="The plant health scanner isn't configured on this platform yet." />
        ) : !canPost ? (
          <EmptyState icon={<ScanLine className="h-6 w-6" />} title="Members only" description="Join this community to scan plants for diagnosis." />
        ) : (
          <PlantScannerPanel communitySlug={community.slug} cropGuidesSpaceSlug={cropGuidesSpaceSlug} />
        )
      ) : isMyCropsSpace ? (
        !canPost ? (
          <EmptyState icon={<NotebookPen className="h-6 w-6" />} title="Members only" description="Join this community to see your crops here." />
        ) : (
          <MyCropsView
            farmCrops={cropFarmCrops}
            farmAppUrl={farmAppUrl}
            crops={crops}
            communitySlug={community.slug}
            spaceSlug={space.slug}
            cropGuidesSpaceSlug={cropGuidesSpaceSlug}
            canShare={farmBridgeReady}
            isPublic={myFarmPublic}
            publicFarms={publicFarms}
          />
        )
      ) : isCustomPageSpace ? (
        // The description above is the entire page. Nothing else renders —
        // except a hint for admins when the page has no content yet.
        !space.description && isAdmin ? (
          <EmptyState
            icon={<LayoutTemplate className="h-6 w-6" />}
            title="This page is empty"
            description="Add your content in the space's Description (Admin → Spaces → Edit). You can paste HTML or Markdown."
          />
        ) : null
      ) : isPlantIdSpace ? (
        !isPlantIdConfigured() ? (
          <EmptyState icon={<NotebookPen className="h-6 w-6" />} title="Plant ID not set up" description="Plant identification isn't configured on this platform yet." />
        ) : !canPost ? (
          <EmptyState icon={<NotebookPen className="h-6 w-6" />} title="Members only" description="Join this community to identify plants." />
        ) : (
          <PlantIdPanel communitySlug={community.slug} cropGuidesSpaceSlug={cropGuidesSpaceSlug} />
        )
      ) : (
        <>
          {canPost && (
            <div id="new-post" className="mb-6 scroll-mt-6">
              <NewPostForm
                communityId={community.id}
                spaceId={space.id}
                communitySlug={community.slug}
                spaceSlug={space.slug}
                crops={crops}
                myCrops={posterFarmCrops}
                avatarUrl={posterProfile?.avatar_url}
                authorName={posterProfile?.full_name || posterProfile?.username}
              />
            </div>
          )}

          {posts.length === 0 ? (
            <EmptyState icon={<MessageSquare className="h-6 w-6" />} title="No posts yet" description="Be the first to start a discussion here." />
          ) : (
            <div className="space-y-5">
              {posts.map((post) => {
                // Photos and videos become a full-width banner atop the card so
                // the imagery leads; documents stay an inline link in the body.
                const bannerUrl = post.media_url && (isImageUrl(post.media_url) || isVideoUrl(post.media_url)) ? post.media_url : null;
                // The default "discussion" type is noise on every card, so only
                // announcements and resources earn a labelled pill.
                const typeTone = post.post_type === "announcement" ? "accent" : "neutral";
                return (
                  <Link key={post.id} href={`/c/${community.slug}/spaces/${space.slug}/posts/${post.id}`}>
                    <Card
                      className={cn(
                        "group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-accent/35 motion-reduce:transform-none motion-reduce:transition-none",
                        post.is_pinned && "border-accent/40"
                      )}
                    >
                      {bannerUrl && (
                        <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                          {isVideoUrl(bannerUrl) ? (
                            <video preload="metadata" src={bannerUrl} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none" />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={bannerUrl} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none" />
                          )}
                        </div>
                      )}
                      <CardContent className="pt-4">
                        {post.is_pinned && (
                          <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
                            <Pin className="h-3.5 w-3.5" />
                            Pinned
                          </div>
                        )}
                        <div className="flex items-center gap-2.5">
                          <Avatar src={post.author?.avatar_url} name={post.author?.full_name || post.author?.username} size={32} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{post.author?.full_name || post.author?.username}</p>
                            <p className="text-xs text-muted-foreground">{formatRelativeTime(post.created_at)}</p>
                          </div>
                          {post.post_type !== "discussion" && <Badge tone={typeTone}>{post.post_type}</Badge>}
                        </div>

                        <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
                          {post.title}
                        </h3>
                        {post.body && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{toPlainText(post.body)}</p>}
                        {post.media_url && !bannerUrl && (
                          <div className="mt-3">
                            <MediaAttachment url={post.media_url} />
                          </div>
                        )}

                        <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <MessageSquare className="h-4 w-4" />
                            {post.comment_count}
                            <span className="sr-only"> comments</span>
                          </span>
                          <span className={cn("inline-flex items-center gap-1.5", post.viewer_reacted && "text-accent")}>
                            <span aria-hidden className="text-base leading-none">{SMILE_EMOJI}</span>
                            {post.reaction_count}
                            <span className="sr-only"> smiles</span>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
