import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MessageSquare, Pin, ExternalLink, NotebookPen, Flag, ScanLine, LayoutTemplate } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RichText, toPlainText } from "@/components/ui/rich-text";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, getCommunityMembers } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { hasActiveSpaceSubscription, hasActiveTierForSpace } from "@/lib/data/space-access";
import { getTiersForSpace } from "@/lib/data/tiers";
import { SpacePaywall } from "./space-paywall";
import { communityCanCharge } from "@/lib/data/plan-limits";
import { getSpacePosts, summarizeDiscussionActivity } from "@/lib/data/posts";
import { SMILE_EMOJI } from "@/lib/post-reactions";
import { SmileStack } from "@/components/ui/smile-stack";
import { DiscussionSpaceHeader } from "./discussion-space-header";
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
import { getSpaceMeetups } from "@/lib/data/meetups";
import { getSpaceLessons, getSavedLessonIds, withSavedState } from "@/lib/data/lessons";
import { DEFAULT_AGE_BAND } from "@/lib/school/lesson-types";
import { activityLabelForKind, schoolDefaultAgeBand } from "@/lib/community-templates";
import { getSpaceGuides } from "@/lib/data/guides";
import { getCrops, getCropRegions, getCommunityCropRegions, getCurrentMonthCalendar, getSavedCropIds, getCropSearchIndex, getCropProposals, type MonthCalendarRow } from "@/lib/data/crop-guides";
import { getMyFarmCrops, getPublicFarmCrops, isFarmBridgeConfigured, type FarmCrop, type PublicFarm } from "@/lib/farm-bridge";
import { getMyFarmPublic, getPublicFarmers } from "@/lib/data/farm-shares";
import { isPlantScannerConfigured } from "@/lib/ai/plant-scanner";
import { isPlantIdConfigured } from "@/lib/ai/plant-id";
import { isLessonWriterConfigured } from "@/lib/ai/lesson-writer";
import { isCropImageGenConfigured } from "@/lib/ai/crop-image";
import type { CropRegion, CommunityCropRegion } from "@/types/database";
import { getSpaceVolunteerProjects } from "@/lib/data/volunteer-hub";
import { getSpaceCourses } from "@/lib/data/courses";
import { getSpaceLiveSessions, splitLiveSessions, getLiveSessionRsvps, groupRsvpsBySession, getLiveSessionInvites, groupInvitesBySession } from "@/lib/data/live-events";
import { isJaasConfigured } from "@/lib/jitsi";
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
import { cn, formatRelativeTime, isImageUrl, isVideoUrl, isAudioUrl } from "@/lib/utils";
import { MediaAttachment } from "@/components/ui/media-attachment";
import { ExternalAudioPlayer, getExternalAudioEmbed } from "@/components/ui/external-audio-player";
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
import { MeetupsView } from "./meetups-view";
import { GuidesView } from "./guides-view";
import { VolunteerHubView } from "./volunteer-hub-view";
import { CoursesView } from "./courses-view";
import { LiveEventsView } from "./live-events-view";
import { CropGuidesView } from "./crop-guides-view";
import { LessonsView } from "./lessons-view";
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
  searchParams: Promise<{ category?: string | string[]; subscribed?: string; import?: string | string[] }>;
}) {
  const { communitySlug, spaceSlug } = await params;
  const { category: rawCategory, subscribed, import: rawImport } = await searchParams;
  // A link handed over from the directory's add form when what was pasted turned
  // out to be a place to stay — see the `handoff` on an import result.
  const importUrl = Array.isArray(rawImport) ? rawImport[0] : rawImport;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  // RLS only returns the space to a guest when it's public; members/private
  // resolve to null here, so notFound doubles as the access gate.
  if (!space) notFound();

  // Gated space gate: a space is gated when it has a per-space price OR belongs
  // to a membership tier. Its content shows only to staff and to members who
  // hold an active per-space subscription or an active tier that includes it.
  // Everyone else who can see the space (per its visibility) gets the paywall
  // instead — with the per-space price (if any) and any tiers that unlock it as
  // join options. RLS enforces the same rule via has_space_access() (this is the
  // UI side, and it covers space types whose content lives in their own tables).
  const spaceTiers = await getTiersForSpace(supabase, space.id);
  const isGated = space.price_cents > 0 || spaceTiers.length > 0;
  if (isGated) {
    const gateMembership = user ? await getMembership(supabase, community.id, user.id) : null;
    const gateIsStaff =
      gateMembership?.status === "active" &&
      (gateMembership.role === "owner" || gateMembership.role === "admin" || gateMembership.role === "moderator");
    const hasSpaceAccess =
      gateIsStaff ||
      (user ? await hasActiveSpaceSubscription(supabase, space.id, user.id) : false) ||
      (user ? await hasActiveTierForSpace(supabase, space.id, user.id) : false);
    if (!hasSpaceAccess) {
      // A community whose plan lapsed past its grace window can't take new
      // subscribers. Ask here rather than letting the button fail at checkout.
      const acceptingSubscriptions = await communityCanCharge(supabase, community.id);
      const joinableTiers = spaceTiers
        .filter((t) => !t.archived_at)
        .map((t) => ({ id: t.id, name: t.name, description: t.description, priceCents: t.price_cents, currency: t.currency, spaceCount: t.spaceCount }));
      return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
          <SpacePaywall
            spaceId={space.id}
            spaceName={space.name}
            spaceDescription={space.description}
            priceCents={space.price_cents}
            currency={space.currency}
            communitySlug={community.slug}
            spaceSlug={space.slug}
            isSignedIn={Boolean(user)}
            paymentsReady={community.stripe_charges_enabled}
            acceptingSubscriptions={acceptingSubscriptions}
            tiers={joinableTiers}
            justSubscribed={subscribed === "1"}
          />
        </div>
      );
    }
  }

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
  const isLiveSpace = space.space_type === "live";
  const isMeetupsSpace = space.space_type === "meetups";
  const isLessonsSpace = space.space_type === "lessons";
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
    !isPlantIdSpace &&
    !isLiveSpace &&
    !isMeetupsSpace &&
    !isLessonsSpace;

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
    liveSessions,
    meetups,
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
    isLiveSpace ? getSpaceLiveSessions(supabase, space.id) : Promise.resolve([]),
    isMeetupsSpace ? getSpaceMeetups(supabase, space.id, viewerId) : Promise.resolve([]),
  ]);

  const { active: activeLiveSession, scheduled: scheduledLiveSessions, past: pastLiveSessions } = splitLiveSessions(liveSessions);
  // RSVPs for the upcoming (scheduled) sessions, grouped by session for the card.
  const liveRsvps =
    isLiveSpace && scheduledLiveSessions.length > 0 ? await getLiveSessionRsvps(supabase, scheduledLiveSessions.map((s) => s.id)) : [];
  const liveRsvpsBySession = Object.fromEntries(groupRsvpsBySession(liveRsvps));
  // Hand-picked invites for the active + upcoming sessions, grouped for the card.
  const liveInviteSessionIds = [activeLiveSession?.id, ...scheduledLiveSessions.map((s) => s.id)].filter(
    (id): id is string => Boolean(id)
  );
  const liveInvites =
    isLiveSpace && liveInviteSessionIds.length > 0 ? await getLiveSessionInvites(supabase, liveInviteSessionIds) : [];
  const liveInvitesBySession = Object.fromEntries(groupInvitesBySession(liveInvites));
  // The name the viewer shows up as in the meeting.
  const liveViewer = isLiveSpace && user ? await getProfile(supabase, user.id) : null;
  const liveDisplayName = liveViewer?.full_name || liveViewer?.username || null;

  // The teaching library for a Lessons space. RLS scopes it to what the viewer
  // may see, so a guest on a public school community gets the same list.
  const allLessons = isLessonsSpace ? await getSpaceLessons(supabase, space.id) : [];
  // Which of them this viewer has saved. Private to them — staff can't see it
  // either — so a guest simply gets none and the bookmark isn't offered.
  const savedLessonIds = isLessonsSpace && user
    ? await getSavedLessonIds(supabase, user.id, allLessons.map((l) => l.id))
    : new Set<string>();
  const lessons = isLessonsSpace ? withSavedState(allLessons, savedLessonIds) : [];

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
  // The member list that powers the "invite members" picker in a live space.
  // Staff-only (only staff can invite), so members aren't loaded otherwise.
  const liveInviteMembers = isLiveSpace && isStaff ? (await getCommunityMembers(supabase, community.id)).map((m) => m.profile) : [];
  // A one-way / broadcast space (e.g. a fan community's Announcements): only
  // staff may start posts. Mirrors the posts_insert_member RLS policy, so the
  // composer is hidden exactly when a member's insert would be rejected.
  const canPostHere = canPost && (!space.staff_post_only || Boolean(isStaff));
  const TypeIcon = SPACE_TYPES[space.space_type].icon;

  // Header activity stats for discussion spaces, derived from the already-loaded
  // posts (no extra query).
  const discussionSummary = summarizeDiscussionActivity(posts);

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
    // A directory opens straight onto its own controls, so it also gives back
    // the page's top padding — every line above the first listing is a line of
    // the directory nobody can see.
    // A library of picture cards needs room: at max-w-3xl a two-column grid
    // gives 350px cards and a third column is impossible, so a Lessons space
    // gets the wider measure. Everything else keeps the reading width it had.
    <div
      className={cn(
        "mx-auto px-4 pb-8 sm:px-6 sm:pb-10",
        // A Lessons space widens again past 1700px, where the shell has
        // 400px+ of empty margin doing nothing, so the side rail can appear
        // without taking a column off the library. See lessons-view.
        isLessonsSpace ? "max-w-6xl rail:max-w-[103rem]" : "max-w-3xl",
        isBusinessDirectorySpace ? "pt-4 sm:pt-5" : "pt-8 sm:pt-10"
      )}
    >
      {isDiscussionLike ? (
        // Discussion spaces get a richer masthead with live activity stats.
        <DiscussionSpaceHeader name={space.name} description={space.description} Icon={TypeIcon} summary={discussionSummary} />
      ) : isBusinessDirectorySpace || isLessonsSpace ? null : (
        <div className="mb-6">
          {/* A custom page is a blank canvas: no default title or icon, its
              description *is* the whole page. Every other space keeps the title
              with a muted intro beneath it.

              A directory renders no masthead at all: the nav link that brought
              you here says "Directory", the category tiles below say it again
              in bigger letters, and a standing line about what a directory is
              ("Local businesses with profiles, hours and reviews") pushed the
              listings down the page every single visit.

              A Lessons space is the same: it opens with its own hero carrying
              the space's name and description, so rendering this one above it
              printed the title twice with two different subtitles under it. */}
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
      )}

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

          {/* Adding resources is staff-only (resources_insert_staff RLS), so only
              staff see the form — a member submitting it would just hit an RLS
              error. This makes a resources space (e.g. a fan community's Vault of
              exclusives) one-way: staff post, everyone else browses.
              A live-conditions space is a data page first: the live panel is its
              content, so skip the add-resource form and the "no resources yet"
              placeholder — any resources that do exist still render. */}
          {isStaff && !showLiveConditions && (
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
              {resources.map((resource) => {
                // Audio/video hosted here (or linked) play inline; everything else
                // stays a click-through link card.
                const externalAudio = getExternalAudioEmbed(resource.url);
                const isAudio = isAudioUrl(resource.url);
                const isVideo = isVideoUrl(resource.url);

                if (externalAudio || isAudio || isVideo) {
                  return (
                    <Card key={resource.id} className="h-full">
                      <CardContent className="pt-5">
                        <h3 className="text-sm font-semibold text-foreground">{resource.title}</h3>
                        {resource.description && (
                          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{resource.description}</p>
                        )}
                        <div className="mt-3">
                          {externalAudio ? (
                            <ExternalAudioPlayer embed={externalAudio} title={resource.title} />
                          ) : isVideo ? (
                            <video src={resource.url} controls preload="metadata" className="w-full rounded-md bg-muted" />
                          ) : (
                            <audio src={resource.url} controls preload="metadata" className="w-full" />
                          )}
                        </div>
                        <Badge tone="accent" className="mt-3">
                          {externalAudio?.providerLabel ?? (isVideo ? "video" : "audio")}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                }

                return (
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
                );
              })}
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
          <MemberDirectoryList
            members={directoryMembers}
            communitySlug={community.slug}
            currentUserId={viewerId}
            isAdmin={Boolean(isAdmin)}
            viewerIsOwner={membership?.role === "owner"}
            allowStaff={community.admins_can_manage_staff}
          />
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
          importUrl={importUrl}
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
      ) : isMeetupsSpace ? (
        <MeetupsView
          meetups={meetups}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          activityLabel={activityLabelForKind(community.activity_kind)}
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
      ) : isLessonsSpace ? (
        <LessonsView
          lessons={lessons}
          spaceId={space.id}
          communitySlug={community.slug}
          spaceSlug={space.slug}
          spaceName={space.name}
          spaceDescription={space.description}
          canWrite={Boolean(isStaff)}
          isMember={canPost}
          defaultAgeBand={schoolDefaultAgeBand(community.school_kind) ?? DEFAULT_AGE_BAND}
          writerConfigured={isLessonWriterConfigured()}
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
          viewerId={viewerId}
          isMember={canPost}
          isStaff={Boolean(isStaff)}
          imageGenEnabled={isCropImageGenConfigured()}
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
        ) : // A public Plant ID space is usable by anyone (guests included), capped by
        // a per-visitor daily quota in the action; a members-only space still
        // requires membership.
        canPost || space.visibility === "public" ? (
          <PlantIdPanel communitySlug={community.slug} cropGuidesSpaceSlug={cropGuidesSpaceSlug} />
        ) : (
          <EmptyState icon={<NotebookPen className="h-6 w-6" />} title="Members only" description="Join this community to identify plants." />
        )
      ) : isLiveSpace ? (
        <LiveEventsView
          active={activeLiveSession}
          scheduled={scheduledLiveSessions}
          past={pastLiveSessions}
          rsvpsBySession={liveRsvpsBySession}
          invitesBySession={liveInvitesBySession}
          inviteMembers={liveInviteMembers}
          currentUserId={viewerId}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          spaceName={space.name}
          isStaff={Boolean(isStaff)}
          canJoin={canPost}
          displayName={liveDisplayName}
          jaasConfigured={isJaasConfigured()}
        />
      ) : (
        <>
          {canPostHere ? (
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
          ) : (
            canPost && (
              <p className="mb-6 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                This is a one-way space — only the team posts here.{" "}
                {space.allow_member_comments
                  ? "You can still comment on and react to posts."
                  : "You can still react to posts."}
              </p>
            )
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
                          <SmileStack reactors={post.reactors} count={post.reaction_count} size={20} />
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
