import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  MessageSquare,
  CalendarDays,
  Store,
  ShoppingBag,
  Briefcase,
  BedDouble,
  Star,
  UsersRound,
  HandHeart,
  UserPlus,
  Footprints,
  MessageSquareQuote,
  GraduationCap,
  BookOpen,
  Sprout,
  Compass,
  Play,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import {
  getCommunityBySlug,
  getMembership,
  getCommunityRecentMembers,
  getCommunityStats,
  getCommunityWeeklyActivity,
  isCommunityAdmin,
  isCommunityMember,
} from "@/lib/data/community";
import { getGrowingJourneySpace, getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityFeatures } from "@/lib/data/features";
import { getCommunityNavItemOrder } from "@/lib/data/nav-order";
import { SPACE_TYPES } from "@/lib/space-types";
import { Tag, Search } from "lucide-react";
import { getCommunityPosts } from "@/lib/data/posts";
import { getFeedInteractions, feedInteractionFor } from "@/lib/data/feed-interactions";
import { getCommunityRecentBusinesses, getCommunityBusinessCustomCategories, getCommunityBusinessCategoryLabelOverrides, getCommunityFeaturedBusinessCategories } from "@/lib/data/businesses";
import { businessCategoryLabel, businessCategoryPluralLabel } from "@/lib/business-categories";
import { getCommunityEvents, getCommunityRecentEvents, getEventRsvpCounts, splitUpcomingPast } from "@/lib/data/events";
import { getCommunityRecentMarketplaceListings } from "@/lib/data/marketplace";
import { marketplaceCategoryLabel } from "@/lib/marketplace-categories";
import { getCommunityRecentJobListings } from "@/lib/data/jobs";
import { jobTypeLabel } from "@/lib/job-types";
import { getCommunityRecentAccommodationListings } from "@/lib/data/accommodation";
import { accommodationTypeLabel, formatAccommodationPrice } from "@/lib/accommodation-types";
import { getCommunityRecentRecommendations } from "@/lib/data/recommendations";
import { getCommunityRecentReviews, ratingStars } from "@/lib/data/reviews";
import { getCommunityRecentCourses } from "@/lib/data/courses";
import { getCommunityRecentGuides } from "@/lib/data/guides";
import { toPlainText } from "@/components/ui/rich-text";
import { recommendationCategoryLabel } from "@/lib/recommendation-categories";
import { getCommunityRecentClubs } from "@/lib/data/clubs";
import { getCommunityUpcomingMeetups } from "@/lib/data/meetups";
import { formatMeetupCountdown, meetupPhase } from "@/lib/meetups";
import { getCommunityRecentVolunteerProjects } from "@/lib/data/volunteer-hub";
import { EmptyState } from "@/components/ui/empty-state";
import { CommunityJoinCta } from "./community-join-cta";
import { CommunityGate } from "./community-gate";
import { WeatherTidesCard } from "./weather-tides-card";
import { FeedItemCard, type FeedItem } from "./feed-item-card";
import { ShareJourneyCard } from "./share-journey-card";
import { DiscoverStrip, type DiscoverShortcut } from "./discover-strip";
import { CoverQuickEdit } from "./cover-quick-edit";
import { CoverCropProvider, CommunityCoverImage } from "./cover-crop";
import { FeedHero, HeroLink, type HeroStat } from "./feed-hero";
import { SpaceCards } from "./space-cards";
import { FeedComposer } from "./feed-composer";
import { UpcomingEventsCard } from "./upcoming-events-card";
import { NewMembersCard } from "./new-members-card";
import { CommunityActivityCard, type ActivityStat } from "./community-activity-card";
import { FeaturedSpaceCard } from "./featured-space-card";
import { formatDateTime, isImageUrl, isVideoUrl } from "@/lib/utils";
import { postGallery } from "@/lib/post-media";

export default async function CommunityFeedPage({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;

  // A private community's feed is members-only, but its shell still renders so
  // a visitor can reach any spaces the admin made public (from the nav). Show
  // the members-only gate here in place of the feed for a non-member — the
  // owner and every active member (checked via their membership) see the real
  // feed. Public communities never gate. invite_only never reaches this page
  // for a non-member (the community doesn't resolve for them under RLS).
  const isMember = isCommunityMember(community, membership, user?.id);
  // A private community may still choose to show its feed (Admin → Access).
  // Invite-only never does — it doesn't resolve for a stranger at all.
  const guestsMayRead = community.is_public || (community.feed_public && community.privacy !== "invite_only");
  // Staff get the in-place cover controls on the header (same test the layout
  // uses for the Admin link).
  const isStaff = isCommunityAdmin(community, membership, user?.id);
  if (!guestsMayRead && !isMember) {
    return (
      <CommunityGate
        community={community}
        isLoggedIn={Boolean(user)}
        requestPending={membership?.status === "requested"}
      />
    );
  }

  const [
    posts,
    events,
    recentBusinesses,
    customCategories,
    labelOverrides,
    recentEvents,
    recentListings,
    recentJobs,
    recentStays,
    recentRecommendations,
    recentReviews,
    recentCourses,
    recentGuides,
    recentClubs,
    upcomingMeetups,
    recentVolunteerProjects,
    recentMembers,
    stats,
    growingJourney,
    spaces,
    featuredCategories,
    features,
    navItemOrder,
  ] = await Promise.all([
    getCommunityPosts(supabase, community.id, 12),
    getCommunityEvents(supabase, community.id),
    getCommunityRecentBusinesses(supabase, community.id, 12),
    getCommunityBusinessCustomCategories(supabase, community.id),
    getCommunityBusinessCategoryLabelOverrides(supabase, community.id),
    getCommunityRecentEvents(supabase, community.id, 12),
    getCommunityRecentMarketplaceListings(supabase, community.id, 12),
    getCommunityRecentJobListings(supabase, community.id, 12),
    getCommunityRecentAccommodationListings(supabase, community.id, 12),
    getCommunityRecentRecommendations(supabase, community.id, 12),
    getCommunityRecentReviews(supabase, community.id, 12),
    getCommunityRecentCourses(supabase, community.id, 12),
    getCommunityRecentGuides(supabase, community.id, 12),
    getCommunityRecentClubs(supabase, community.id, 12),
    getCommunityUpcomingMeetups(supabase, community.id, 12),
    getCommunityRecentVolunteerProjects(supabase, community.id, 12),
    // Member profiles stay login-gated, so guests don't get "new member" cards.
    user ? getCommunityRecentMembers(supabase, community.id, 12) : Promise.resolve([]),
    getCommunityStats(supabase, community.id),
    getGrowingJourneySpace(supabase, community.id),
    getCommunitySpaces(supabase, community.id),
    getCommunityFeaturedBusinessCategories(supabase, community.id),
    getCommunityFeatures(supabase, community.id),
    getCommunityNavItemOrder(supabase, community.id),
  ]);
  const { upcoming } = splitUpcomingPast(events);

  const base = `/c/${community.slug}`;

  // Discover strip (mobile only): surface each nav space and its featured
  // categories (e.g. Restaurants under a Business Directory) as one-tap tiles
  // right where the visitor lands. Featured categories deep-link to the
  // pre-filtered directory, matching the desktop sidebar's sub-links.
  const navSpaces = spaces.filter((s) => s.show_in_nav);
  const discoverShortcuts: DiscoverShortcut[] = navSpaces.flatMap((space) => {
    const SpaceIcon = SPACE_TYPES[space.space_type].icon;
    const spaceLabelOverrides = labelOverrides.filter((o) => o.space_id === space.id);
    return [
      {
        href: `${base}/spaces/${space.slug}`,
        label: space.name,
        icon: <SpaceIcon className="h-5 w-5" />,
        imageUrl: space.image_url,
      },
      ...featuredCategories
        .filter((f) => f.space_id === space.id)
        .map((f): DiscoverShortcut => ({
          href: `${base}/spaces/${space.slug}?category=${f.category}`,
          label: businessCategoryPluralLabel(f.category, customCategories, spaceLabelOverrides),
          hint: space.name,
          icon: <Tag className="h-4 w-4" />,
          accent: true,
        })),
    ];
  });

  // Fold the enabled built-in features (Events, Search) into the strip too —
  // only when the community actually has them turned on and in the nav, so it
  // never advertises a destination that isn't there. Events carries a live
  // upcoming-count so the tile earns its place.
  const canSeeEvents = Boolean(user) || community.events_public;
  if (features.events && canSeeEvents && navItemOrder.events?.showInNav !== false) {
    discoverShortcuts.push({
      href: `${base}/events`,
      label: "Events",
      hint: upcoming.length > 0 ? `${upcoming.length} upcoming` : null,
      icon: <CalendarDays className="h-5 w-5" />,
    });
  }
  if (features.concierge && navItemOrder.concierge?.showInNav !== false) {
    discoverShortcuts.push({
      href: `${base}/concierge`,
      label: "Search",
      icon: <Search className="h-5 w-5" />,
    });
  }

  // Recent activity mixes posts with everything created anywhere in the
  // community (businesses, events, marketplace, jobs, stays,
  // recommendations, clubs, volunteer projects) into one normalized shape —
  // pinned posts stay on top, everything else in reverse-chronological order.
  const items: FeedItem[] = [
    ...posts.map((p): FeedItem => ({
      key: `post-${p.id}`,
      itemType: "post" as const,
      itemId: p.id,
      createdAt: p.created_at,
      isPinned: p.is_pinned,
      icon: MessageSquare,
      title: p.title,
      // Same treatment as the space page's post previews: a card shows an
      // excerpt, not the post's markup.
      description: p.body ? toPlainText(p.body) : null,
      // Lead with the post's own photo when it has one — media_url can also be
      // a video or document, which this thumbnail can't show, so gate on image.
      imageUrl: p.media_url && isImageUrl(p.media_url) ? p.media_url : null,
      // Several photos show as a gallery row instead of the single banner.
      imageUrls: postGallery(p).filter((u) => !isVideoUrl(u)),
      tags: p.tags ?? [],
      typeBadge: `${p.post_type} posted`,
      detail: null,
      authorName: p.author?.full_name || p.author?.username || null,
      authorAvatar: p.author?.avatar_url ?? null,
      spaceName: p.space?.name ?? null,
      href: p.space ? `${base}/spaces/${p.space.slug}/posts/${p.id}` : base,
    })),
    ...recentBusinesses.map((b): FeedItem => ({
      key: `business-${b.id}`,
      itemType: "business" as const,
      itemId: b.id,
      createdAt: b.created_at,
      icon: Store,
      title: b.name,
      description: b.description,
      imageUrl: b.image_url,
      imagePosition: b.image_position,
      typeBadge: `${businessCategoryLabel(b.category, customCategories, labelOverrides.filter((o) => o.space_id === b.space_id))} added`,
      detail: null,
      authorName: b.creator?.full_name || b.creator?.username || null,
      authorAvatar: b.creator?.avatar_url ?? null,
      spaceName: b.space?.name ?? null,
      href: b.space ? `${base}/spaces/${b.space.slug}/businesses/${b.slug ?? b.id}` : base,
    })),
    ...recentEvents.map((e): FeedItem => ({
      key: `event-${e.id}`,
      itemType: "event" as const,
      itemId: e.id,
      createdAt: e.created_at,
      icon: CalendarDays,
      title: e.title,
      description: e.description,
      imageUrl: e.image_url,
      typeBadge: "Event added",
      detail: `Starts ${formatDateTime(e.start_time)}`,
      authorName: e.creator?.full_name || e.creator?.username || null,
      authorAvatar: e.creator?.avatar_url ?? null,
      spaceName: null,
      href: `${base}/events`,
    })),
    ...recentListings.map((l): FeedItem => ({
      key: `listing-${l.id}`,
      itemType: "listing" as const,
      itemId: l.id,
      createdAt: l.created_at,
      icon: ShoppingBag,
      title: l.title,
      description: l.description,
      imageUrl: l.photo_url,
      typeBadge: `${marketplaceCategoryLabel(l.listing_type)} added`,
      detail: l.price !== null ? `${l.currency ?? ""} ${l.price}`.trim() : null,
      authorName: l.seller?.full_name || l.seller?.username || null,
      authorAvatar: l.seller?.avatar_url ?? null,
      spaceName: l.space?.name ?? null,
      href: l.space ? `${base}/spaces/${l.space.slug}` : base,
    })),
    ...recentJobs.map((j): FeedItem => ({
      key: `job-${j.id}`,
      itemType: "job" as const,
      itemId: j.id,
      createdAt: j.created_at,
      icon: Briefcase,
      title: j.title,
      description: j.description,
      imageUrl: null,
      typeBadge: `${jobTypeLabel(j.job_type)} job added`,
      detail: j.salary,
      authorName: j.poster?.full_name || j.poster?.username || null,
      authorAvatar: j.poster?.avatar_url ?? null,
      spaceName: j.space?.name ?? null,
      href: j.space ? `${base}/spaces/${j.space.slug}` : base,
    })),
    ...recentStays.map((a): FeedItem => ({
      key: `stay-${a.id}`,
      itemType: "stay" as const,
      itemId: a.id,
      createdAt: a.created_at,
      icon: BedDouble,
      title: a.name,
      description: a.description,
      imageUrl: a.photo_urls[0] ?? null,
      typeBadge: `${accommodationTypeLabel(a.accommodation_type)} added`,
      detail: formatAccommodationPrice(a),
      authorName: a.lister?.full_name || a.lister?.username || null,
      authorAvatar: a.lister?.avatar_url ?? null,
      spaceName: a.space?.name ?? null,
      href: a.space ? `${base}/spaces/${a.space.slug}/stays/${a.slug ?? a.id}` : base,
    })),
    ...recentRecommendations.map((r): FeedItem => ({
      key: `recommendation-${r.id}`,
      itemType: "recommendation" as const,
      itemId: r.id,
      createdAt: r.created_at,
      icon: Star,
      title: r.title,
      description: r.note,
      imageUrl: null,
      typeBadge: `${recommendationCategoryLabel(r.category)} recommendation added`,
      detail: null,
      authorName: r.recommendedBy?.full_name || r.recommendedBy?.username || null,
      authorAvatar: r.recommendedBy?.avatar_url ?? null,
      spaceName: r.space?.name ?? null,
      href: r.space ? `${base}/spaces/${r.space.slug}` : base,
    })),
    // A review is the most considered thing a member writes about a place, and
    // it used to live only on that listing's page. On the feed it reads as
    // "Sam · 4 stars · The Rock" — the card links straight to the listing so a
    // neighbour can read the rest and add their own.
    ...recentReviews.map((r): FeedItem => ({
      key: `review-${r.id}`,
      itemType: "review" as const,
      itemId: r.id,
      createdAt: r.created_at,
      icon: MessageSquareQuote,
      title: r.subject.name,
      description: r.body,
      imageUrl: r.subject.imageUrl,
      imagePosition: r.subject.imagePosition,
      typeBadge: "Review",
      // Carries the score even when the reviewer left no words, which is what
      // a rating-only review is.
      detail: ratingStars(r.rating),
      authorName: r.author?.full_name || r.author?.username || null,
      authorAvatar: r.author?.avatar_url ?? null,
      spaceName: r.subject.spaceName,
      href:
        r.subject.kind === "business"
          ? `${base}/spaces/${r.subject.spaceSlug}/businesses/${r.subject.slugOrId}`
          : `${base}/spaces/${r.subject.spaceSlug}/stays/${r.subject.slugOrId}`,
    })),
    // What a community knows is as much its activity as what it sells: a
    // published course and a written guide are the front page's business too.
    // Drafts stay out of the query — a course nobody can open isn't news yet.
    ...recentCourses.map((c): FeedItem => ({
      key: `course-${c.id}`,
      itemType: "course" as const,
      itemId: c.id,
      createdAt: c.created_at,
      icon: GraduationCap,
      title: c.title,
      description: c.summary,
      imageUrl: c.cover_image_url,
      typeBadge: "Course published",
      detail: c.price_cents > 0 ? `${(c.currency || "usd").toUpperCase()} ${(c.price_cents / 100).toFixed(2)}` : null,
      authorName: c.creator?.full_name || c.creator?.username || null,
      authorAvatar: c.creator?.avatar_url ?? null,
      spaceName: c.space?.name ?? null,
      href: c.space ? `${base}/spaces/${c.space.slug}/courses/${c.id}` : base,
    })),
    ...recentGuides.map((g): FeedItem => ({
      key: `guide-${g.id}`,
      itemType: "guide" as const,
      itemId: g.id,
      createdAt: g.created_at,
      icon: BookOpen,
      title: g.title,
      // The body is rich text; the card shows a plain excerpt and the guide
      // itself does the formatting.
      description: toPlainText(g.body),
      imageUrl: null,
      typeBadge: "Guide added",
      detail: null,
      authorName: g.creator?.full_name || g.creator?.username || null,
      authorAvatar: g.creator?.avatar_url ?? null,
      spaceName: g.space?.name ?? null,
      href: g.space ? `${base}/spaces/${g.space.slug}/guides/${g.id}` : base,
    })),
    ...recentClubs.map((c): FeedItem => ({
      key: `club-${c.id}`,
      itemType: "club" as const,
      itemId: c.id,
      createdAt: c.created_at,
      icon: UsersRound,
      title: c.name,
      description: c.description,
      imageUrl: null,
      typeBadge: "Club added",
      detail: null,
      authorName: c.creator?.full_name || c.creator?.username || null,
      authorAvatar: c.creator?.avatar_url ?? null,
      spaceName: c.space?.name ?? null,
      href: c.space ? `${base}/spaces/${c.space.slug}` : base,
    })),
    // Only meetups still worth joining reach the feed — one that's over is
    // history for the space, not an invitation. Sorted with everything else by
    // created_at below, so a walk posted just now sits at the top.
    ...upcomingMeetups
      .filter((m) => meetupPhase(m) !== "past" && meetupPhase(m) !== "cancelled")
      .map((m): FeedItem => ({
        key: `meetup-${m.id}`,
        itemType: "meetup" as const,
        itemId: m.id,
        createdAt: m.created_at,
        icon: Footprints,
        title: m.title,
        description: m.description,
        imageUrl: null,
        typeBadge: meetupPhase(m) === "now" ? "Happening now" : "Meetup",
        detail: [formatDateTime(m.starts_at), formatMeetupCountdown(m), m.meeting_point].filter(Boolean).join(" · "),
        authorName: m.host?.full_name || m.host?.username || null,
        authorAvatar: m.host?.avatar_url ?? null,
        spaceName: m.space?.name ?? null,
        href: m.space ? `${base}/spaces/${m.space.slug}` : base,
      })),
    ...recentVolunteerProjects.map((v): FeedItem => ({
      key: `volunteer-${v.id}`,
      itemType: "volunteer" as const,
      itemId: v.id,
      createdAt: v.created_at,
      icon: HandHeart,
      title: v.title,
      description: v.description,
      imageUrl: null,
      typeBadge: "Volunteer project added",
      detail: v.volunteers_needed ? `${v.volunteers_needed} volunteers needed` : null,
      authorName: v.organiser?.full_name || v.organiser?.username || null,
      authorAvatar: v.organiser?.avatar_url ?? null,
      spaceName: v.space?.name ?? null,
      href: v.space ? `${base}/spaces/${v.space.slug}` : base,
    })),
    ...recentMembers.map((m): FeedItem => ({
      key: `member-${m.id}`,
      itemType: "member" as const,
      itemId: m.id,
      createdAt: m.created_at,
      icon: UserPlus,
      title: m.profile.full_name || m.profile.username,
      description: [m.profile.profession, m.profile.company].filter(Boolean).join(" · ") || m.profile.bio,
      imageUrl: null,
      typeBadge: "New Member",
      detail: null,
      authorName: null,
      authorAvatar: null,
      spaceName: null,
      href: `${base}/members`,
      iconClassName: "bg-accent/15 text-accent",
    })),
  ];

  const pinned = items.filter((i) => i.isPinned).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const rest = items.filter((i) => !i.isPinned).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const activity = [...pinned, ...rest].slice(0, 40);

  // Spaces a member can post into from the feed's composer bar: the
  // discussion-shaped ones (they're the only ones with a #new-post composer),
  // minus broadcast spaces unless the viewer is staff.
  const postableSpaces = isMember
    ? navSpaces.filter(
        (s) => ["discussion", "qa", "gallery"].includes(s.space_type) && (!s.staff_post_only || isStaff)
      )
    : [];

  // Smiles and comments for the cards actually on screen — `activity` is
  // already capped, so this is a fixed handful of batched queries rather than
  // one per card. Guests get the tallies but no controls.
  const sidebarEvents = upcoming.slice(0, 4);
  const [feedInteractions, viewerProfile, weekly, eventGoing] = await Promise.all([
    getFeedInteractions(
      supabase,
      community.id,
      activity.map((item) => ({ type: item.itemType, id: item.itemId })),
      user?.id
    ),
    // The viewer's own face, so their smile joins the avatar stack the instant
    // they click instead of only after the refresh lands.
    user ? getProfile(supabase, user.id) : Promise.resolve(null),
    community.show_stats
      ? getCommunityWeeklyActivity(supabase, community.id, growingJourney?.id ?? null)
      : Promise.resolve(null),
    getEventRsvpCounts(supabase, sidebarEvents.filter((e) => e.capacity !== null).map((e) => e.id)),
  ]);
  const viewer = viewerProfile
    ? { id: viewerProfile.id, name: viewerProfile.full_name || viewerProfile.username, avatarUrl: viewerProfile.avatar_url }
    : null;

  // Counts are opt-in per community (show_stats, default off). A stat panel
  // exists to argue the place is busy, and small numbers argue the opposite —
  // so a community only shows them once its owner decides they help. Zero
  // values stay filtered out regardless. The same switch governs the weekly
  // "Community activity" card.
  const statItems: HeroStat[] = community.show_stats
    ? [
        { icon: UsersRound, label: "Members", value: stats.members },
        { icon: MessageSquare, label: "Posts", value: stats.posts },
        { icon: CalendarDays, label: "Events", value: stats.events },
        { icon: Store, label: "Businesses", value: stats.businesses },
      ].filter((s) => s.value > 0)
    : [];
  const activityStats: ActivityStat[] = weekly
    ? [
        { icon: MessageSquare, value: weekly.posts, label: "new posts this week" },
        { icon: Sprout, value: weekly.journeyUpdates, label: `${growingJourney?.name ?? "journey"} updates this week` },
        { icon: UserPlus, value: weekly.members, label: "new members this week" },
        { icon: CalendarDays, value: upcoming.length, label: "events coming up" },
      ].filter((s) => s.value > 0)
    : [];

  const onPhoto = Boolean(community.cover_image_url);
  const composerHref = postableSpaces[0] ? `${base}/spaces/${postableSpaces[0].slug}#new-post` : null;

  // The hero's calls to action change with who's looking: a stranger is asked
  // to join (via signup), a signed-in non-member gets the join/request button
  // their community's privacy allows, and a member is pointed at posting.
  const heroActions = !user ? (
    <>
      <HeroLink href={`/signup?next=${encodeURIComponent(base)}`} onPhoto={onPhoto}>
        Join the community
      </HeroLink>
      <HeroLink href={`/login?next=${encodeURIComponent(base)}`} variant="glass" onPhoto={onPhoto}>
        Log in
      </HeroLink>
    </>
  ) : !isMember ? (
    <CommunityJoinCta
      communityId={community.id}
      privacy={community.privacy}
      membershipStatus={membership?.status ?? null}
      size="lg"
    />
  ) : (
    <>
      {composerHref && (
        <HeroLink href={composerHref} onPhoto={onPhoto}>
          Share something
        </HeroLink>
      )}
      <HeroLink href={`${base}/spaces`} variant={composerHref ? "glass" : "solid"} onPhoto={onPhoto}>
        <Compass className="h-4 w-4" />
        Explore spaces
      </HeroLink>
    </>
  );
  // The admin's optional "Watch video" link rides after whichever buttons the
  // viewer got.
  const heroActionsWithVideo = (
    <>
      {heroActions}
      {community.hero_video_url && (
        <HeroLink href={community.hero_video_url} variant="glass" onPhoto={onPhoto} external>
          <Play className="h-4 w-4 fill-current" />
          Watch video
        </HeroLink>
      )}
    </>
  );
  // The space promoted in the sidebar photo card (Admin → Landing page). Read
  // from the viewer's own space list, so one they can't see never shows.
  const featuredSpace = community.featured_space_id
    ? spaces.find((s) => s.id === community.featured_space_id) ?? null
    : null;

  return (
    // The provider shares the cover crop between the header photo and the
    // staff picker, so the hero re-crops as it's picked rather than a refresh
    // later. It's needed even without a cover — the picker reads it.
    <CoverCropProvider position={community.cover_position} mobilePosition={community.cover_position_mobile}>
      <FeedHero
        headline={community.tagline || community.name}
        description={community.description}
        cover={community.cover_image_url ? <CommunityCoverImage src={community.cover_image_url} /> : null}
        stats={statItems}
        actions={heroActionsWithVideo}
        coverControl={
          isStaff &&
          (onPhoto ? (
            <CoverQuickEdit communityId={community.id} coverUrl={community.cover_image_url} />
          ) : (
            <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
              <CoverQuickEdit communityId={community.id} coverUrl={community.cover_image_url} hasCover={false} />
            </div>
          ))
        }
      />

      <DiscoverStrip title={`Explore ${community.name}`} shortcuts={discoverShortcuts} allHref={`${base}/spaces`} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <SpaceCards spaces={navSpaces} base={base} />

        {/* `min-w-0` on every column is load-bearing, not decoration. A grid
            item defaults to `min-width: auto`, so its track can't shrink below
            the item's min-content width — and min-content here is the longest
            unbreakable run of text in the column (a URL, an email, a long
            business name). On mobile the columns stack into one track, so a
            single long token anywhere widens the track past the viewport.

            Three columns on a wide screen (feed · events & members · journey &
            activity); below 2xl the two side columns stack into one sidebar,
            and on a phone everything stacks under the feed. */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_600px]">
          <div className="min-w-0 space-y-5">
            {isMember && viewer && (
              <FeedComposer base={base} spaces={postableSpaces} viewerName={viewer.name} viewerAvatar={viewer.avatarUrl} />
            )}
            {activity.length === 0 ? (
              // An empty feed means two different things. For a member the
              // community really is quiet. For a signed-out visitor it means
              // nothing here is public — which is a rule to state, not a
              // diagnosis to guess at: it could be that every space is
              // members-only, or that the public ones hold the kinds of thing
              // the feed doesn't carry. Either way "be the first to share
              // something" is the wrong thing to say to someone who can't.
              <EmptyState
                icon={<MessageSquare className="h-6 w-6" />}
                title={user ? "No activity yet" : "Nothing public here yet"}
                description={
                  user
                    ? "Be the first to share something — start a post, add a business, or list an event."
                    : `Signed-out visitors only see activity from spaces set to Public. Log in or join to see what's happening in ${community.name}.`
                }
                action={
                  user ? (
                    <Link
                      href={`${base}/spaces`}
                      className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
                    >
                      Explore spaces
                    </Link>
                  ) : (
                    <Link
                      href={`/login?next=${encodeURIComponent(base)}`}
                      className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
                    >
                      Log in
                    </Link>
                  )
                }
              />
            ) : (
              activity.map((item) => (
                <FeedItemCard
                  key={item.key}
                  item={{
                    ...item,
                    actions: {
                      communitySlug: community.slug,
                      communityId: community.id,
                      itemType: item.itemType,
                      itemId: item.itemId,
                      canInteract: isMember,
                      viewerId: user?.id ?? null,
                      viewer,
                      isStaff,
                      ...feedInteractionFor(feedInteractions, item.itemType, item.itemId),
                    },
                  }}
                />
              ))
            )}
          </div>

          <div className="grid min-w-0 content-start gap-6 2xl:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-w-0 space-y-6">
              <UpcomingEventsCard events={sidebarEvents} href={`${base}/events`} going={eventGoing} />
              <NewMembersCard members={recentMembers} href={`${base}/members`} />
            </div>
            <div className="min-w-0 space-y-6">
              {growingJourney && (
                <ShareJourneyCard
                  communityId={community.id}
                  communitySlug={community.slug}
                  spaceSlug={growingJourney.slug}
                  spaceName={growingJourney.name}
                  isLoggedIn={Boolean(user)}
                  isMember={isMember}
                />
              )}
              <CommunityActivityCard stats={activityStats} />
              <Suspense fallback={null}>
                <WeatherTidesCard community={community} />
              </Suspense>
              {featuredSpace && (
                <FeaturedSpaceCard space={featuredSpace} href={`${base}/spaces/${featuredSpace.slug}`} />
              )}
            </div>
          </div>
        </div>
      </div>
    </CoverCropProvider>
  );
}
