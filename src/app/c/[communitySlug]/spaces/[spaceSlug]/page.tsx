import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquare, Pin, ExternalLink, NotebookPen, Flag, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getSpacePosts } from "@/lib/data/posts";
import { getSpaceResources } from "@/lib/data/resources";
import { getSpaceJournalFields, getSpaceJournalEntries } from "@/lib/data/journal";
import { getMemberTimeline } from "@/lib/data/growth-journey";
import { getSpaceChallenges } from "@/lib/data/challenges";
import { getSpaceBusinesses } from "@/lib/data/businesses";
import { getMapCategories, getSpaceLandmarks, getCommunityMapPinnedBusinesses } from "@/lib/data/map";
import { getSpaceListings } from "@/lib/data/marketplace";
import { getSpaceJobListings } from "@/lib/data/jobs";
import { getSpaceAccommodationListings } from "@/lib/data/accommodation";
import { getSpaceRecommendations } from "@/lib/data/recommendations";
import { getSpaceClubs } from "@/lib/data/clubs";
import { getSpaceGuides } from "@/lib/data/guides";
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
import { formatRelativeTime, isImageUrl, isVideoUrl } from "@/lib/utils";
import { MediaAttachment } from "@/components/ui/media-attachment";
import { NewPostForm } from "./new-post-form";
import { SpaceResourceForm } from "./space-resource-form";
import { JournalEntryForm } from "./journal-entry-form";
import { GrowthJourneyView } from "./growth-journey-view";
import { NewChallengeForm } from "./new-challenge-form";
import { ChallengeCard } from "./challenge-card";
import { NewBusinessForm } from "./new-business-form";
import { BusinessCard } from "./business-card";
import { ExploreMapLoader } from "./explore-map-loader";
import { MarketplaceView } from "./marketplace-view";
import { JobsBoardView } from "./jobs-board-view";
import { AccommodationView } from "./accommodation-view";
import { RecommendationsView } from "./recommendations-view";
import { ClubsView } from "./clubs-view";
import { GuidesView } from "./guides-view";
import { SPACE_TYPES } from "@/lib/space-types";
import { MemberDirectoryList } from "../../members/member-directory-list";
import { DiscoverySection } from "../../members/discovery-section";

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string }>;
}) {
  const { communitySlug, spaceSlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) notFound();

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
  const isDiscussionLike =
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
    !isGuidesSpace;

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
    listings,
    jobs,
    accommodationListings,
    recommendations,
    clubs,
    guides,
  ] = await Promise.all([
    getMembership(supabase, community.id, user.id),
    isDiscussionLike ? getSpacePosts(supabase, space.id) : Promise.resolve([]),
    isResourceSpace ? getSpaceResources(supabase, space.id) : Promise.resolve([]),
    isJournalSpace ? getSpaceJournalFields(supabase, space.id) : Promise.resolve([]),
    isJournalSpace ? getSpaceJournalEntries(supabase, space.id) : Promise.resolve([]),
    isGrowthJourneySpace ? getMemberTimeline(supabase, community.id, community.slug, user.id) : Promise.resolve([]),
    isDirectorySpace ? getDirectoryMembers(supabase, community.id) : Promise.resolve([]),
    isChallengeSpace ? getSpaceChallenges(supabase, space.id, user.id) : Promise.resolve([]),
    isBusinessDirectorySpace ? getSpaceBusinesses(supabase, space.id) : Promise.resolve([]),
    isMapSpace ? getMapCategories(supabase, community.id) : Promise.resolve([]),
    isMapSpace ? getSpaceLandmarks(supabase, space.id) : Promise.resolve([]),
    isMapSpace ? getCommunityMapPinnedBusinesses(supabase, community.id) : Promise.resolve([]),
    isMarketplaceSpace ? getSpaceListings(supabase, space.id) : Promise.resolve([]),
    isJobsSpace ? getSpaceJobListings(supabase, space.id) : Promise.resolve([]),
    isAccommodationSpace ? getSpaceAccommodationListings(supabase, space.id) : Promise.resolve([]),
    isRecommendationsSpace ? getSpaceRecommendations(supabase, space.id, user.id) : Promise.resolve([]),
    isClubsSpace ? getSpaceClubs(supabase, space.id, user.id) : Promise.resolve([]),
    isGuidesSpace ? getSpaceGuides(supabase, space.id) : Promise.resolve([]),
  ]);

  const canPost = membership?.status === "active";
  const isAdmin = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  // Mirrors is_community_staff() in schema.sql (owner/admin/moderator) — the
  // businesses table lets staff, not just admins, grant verified/featured.
  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  const TypeIcon = SPACE_TYPES[space.space_type].icon;

  const discoverableMembers = directoryMembers.filter(isDiscoverable);
  const viewerDirectoryEntry = directoryMembers.find((m) => m.profile.id === user.id);
  const recommendedMembers = isDirectorySpace
    ? getRecommendedMembers(
        discoverableMembers,
        user.id,
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
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Link href={`/c/${community.slug}/spaces`} className="hover:underline">
            Spaces
          </Link>
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
          <TypeIcon className="h-5 w-5 text-muted-foreground" />
          {space.name}
        </h1>
        {space.description && <p className="mt-1 text-sm text-muted-foreground">{space.description}</p>}
      </div>

      {isResourceSpace ? (
        <>
          {canPost && (
            <div className="mb-6">
              <SpaceResourceForm communityId={community.id} communitySlug={community.slug} spaceId={space.id} spaceSlug={space.slug} />
            </div>
          )}

          {resources.length === 0 ? (
            <EmptyState icon={<MessageSquare className="h-6 w-6" />} title="No resources yet" description="Links, files and guides added to this space will show up here." />
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
        <>
          <DiscoverySection title="Recommended for you" members={recommendedMembers} communitySlug={community.slug} />
          <DiscoverySection title="New members" members={newMembers} communitySlug={community.slug} />
          <DiscoverySection title="Members near you" members={nearYouMembers} communitySlug={community.slug} />
          <DiscoverySection title="Recently active" members={recentlyActiveMembers} communitySlug={community.slug} />
          <DiscoverySection title="Top contributors" members={topContributorMembers} communitySlug={community.slug} />
          <DiscoverySection title="Businesses" members={businessMembers} communitySlug={community.slug} />

          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">All members</h2>
          <MemberDirectoryList members={directoryMembers} communitySlug={community.slug} currentUserId={user.id} isAdmin={Boolean(isAdmin)} />
        </>
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
                />
              ))}
            </div>
          )}
        </>
      ) : isBusinessDirectorySpace ? (
        <>
          {canPost && (
            <div className="mb-6">
              <NewBusinessForm communityId={community.id} communitySlug={community.slug} spaceId={space.id} spaceSlug={space.slug} userId={user.id} />
            </div>
          )}

          {businesses.length === 0 ? (
            <EmptyState icon={<Building2 className="h-6 w-6" />} title="No businesses yet" description="Restaurants, cafes, shops and services members add will show up here." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  communitySlug={community.slug}
                  spaceSlug={space.slug}
                  canManage={Boolean(isStaff) || business.created_by === user.id}
                  isStaff={Boolean(isStaff)}
                  userId={user.id}
                />
              ))}
            </div>
          )}
        </>
      ) : isMapSpace ? (
        <ExploreMapLoader
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          categories={mapCategories}
          landmarks={landmarks}
          businesses={mapBusinesses}
          canPost={canPost}
          isAdmin={Boolean(isAdmin)}
          userId={user.id}
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
          userId={user.id}
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
          userId={user.id}
        />
      ) : isAccommodationSpace ? (
        <AccommodationView
          listings={accommodationListings}
          communityId={community.id}
          communitySlug={community.slug}
          spaceId={space.id}
          spaceSlug={space.slug}
          canPost={canPost}
          isStaff={Boolean(isStaff)}
          userId={user.id}
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
          userId={user.id}
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
          userId={user.id}
        />
      ) : isGuidesSpace ? (
        <GuidesView guides={guides} communityId={community.id} communitySlug={community.slug} spaceId={space.id} spaceSlug={space.slug} canPost={canPost} />
      ) : (
        <>
          {canPost && (
            <div className="mb-6">
              <NewPostForm communityId={community.id} spaceId={space.id} communitySlug={community.slug} spaceSlug={space.slug} />
            </div>
          )}

          {posts.length === 0 ? (
            <EmptyState icon={<MessageSquare className="h-6 w-6" />} title="No posts yet" description="Be the first to start a discussion here." />
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/c/${community.slug}/spaces/${space.slug}/posts/${post.id}`}>
                  <Card className="transition-shadow hover:shadow-sm">
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-3">
                        <Avatar src={post.author?.avatar_url} name={post.author?.full_name || post.author?.username} size={32} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {post.is_pinned && <Pin className="h-3.5 w-3.5 text-accent" />}
                            <h3 className="text-sm font-semibold text-foreground">{post.title}</h3>
                            <Badge tone="neutral">{post.post_type}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {post.author?.full_name || post.author?.username} · {formatRelativeTime(post.created_at)}
                          </p>
                          {post.body && <p className="mt-2 line-clamp-2 text-sm text-foreground">{post.body}</p>}
                          {post.media_url && (
                            <div className="mt-2">
                              <MediaAttachment url={post.media_url} className="max-h-48" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
