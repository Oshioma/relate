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
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, getCommunityRecentMembers, getCommunityStats } from "@/lib/data/community";
import { getGrowingJourneySpace, getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityFeatures } from "@/lib/data/features";
import { getCommunityNavItemOrder } from "@/lib/data/nav-order";
import { SPACE_TYPES } from "@/lib/space-types";
import { Tag, Search } from "lucide-react";
import { getCommunityPosts } from "@/lib/data/posts";
import { getCommunityRecentBusinesses, getCommunityBusinessCustomCategories, getCommunityBusinessCategoryLabelOverrides, getCommunityFeaturedBusinessCategories } from "@/lib/data/businesses";
import { businessCategoryLabel, businessCategoryPluralLabel } from "@/lib/business-categories";
import { getCommunityEvents, getCommunityRecentEvents, splitUpcomingPast } from "@/lib/data/events";
import { getCommunityRecentMarketplaceListings } from "@/lib/data/marketplace";
import { marketplaceCategoryLabel } from "@/lib/marketplace-categories";
import { getCommunityRecentJobListings } from "@/lib/data/jobs";
import { jobTypeLabel } from "@/lib/job-types";
import { getCommunityRecentAccommodationListings } from "@/lib/data/accommodation";
import { accommodationTypeLabel, formatAccommodationPrice } from "@/lib/accommodation-types";
import { getCommunityRecentRecommendations } from "@/lib/data/recommendations";
import { recommendationCategoryLabel } from "@/lib/recommendation-categories";
import { getCommunityRecentClubs } from "@/lib/data/clubs";
import { getCommunityRecentVolunteerProjects } from "@/lib/data/volunteer-hub";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { JoinCommunityButton } from "./join-community-button";
import { CommunityGate } from "./community-gate";
import { WeatherTidesCard } from "./weather-tides-card";
import { FeedItemCard, type FeedItem } from "./feed-item-card";
import { ShareJourneyCard } from "./share-journey-card";
import { DiscoverStrip, type DiscoverShortcut } from "./discover-strip";
import { formatDateTime, isImageUrl } from "@/lib/utils";

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
  const isMember = membership?.status === "active" || community.owner_id === user?.id;
  if (!community.is_public && !isMember) {
    return <CommunityGate community={community} isLoggedIn={Boolean(user)} />;
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
    recentClubs,
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
    getCommunityRecentClubs(supabase, community.id, 12),
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
      createdAt: p.created_at,
      isPinned: p.is_pinned,
      icon: MessageSquare,
      title: p.title,
      description: p.body,
      // Lead with the post's own photo when it has one — media_url can also be
      // a video or document, which this thumbnail can't show, so gate on image.
      imageUrl: p.media_url && isImageUrl(p.media_url) ? p.media_url : null,
      typeBadge: `${p.post_type} posted`,
      detail: null,
      authorName: p.author?.full_name || p.author?.username || null,
      authorAvatar: p.author?.avatar_url ?? null,
      spaceName: p.space?.name ?? null,
      href: p.space ? `${base}/spaces/${p.space.slug}/posts/${p.id}` : base,
    })),
    ...recentBusinesses.map((b): FeedItem => ({
      key: `business-${b.id}`,
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
      href: b.space ? `${base}/spaces/${b.space.slug}?category=${b.category}` : base,
    })),
    ...recentEvents.map((e): FeedItem => ({
      key: `event-${e.id}`,
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
      href: a.space ? `${base}/spaces/${a.space.slug}/stays/${a.id}` : base,
    })),
    ...recentRecommendations.map((r): FeedItem => ({
      key: `recommendation-${r.id}`,
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
    ...recentClubs.map((c): FeedItem => ({
      key: `club-${c.id}`,
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
    ...recentVolunteerProjects.map((v): FeedItem => ({
      key: `volunteer-${v.id}`,
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

  const statItems = [
    { label: "Members", value: stats.members },
    { label: "Events", value: stats.events },
    { label: "Businesses", value: stats.businesses },
    { label: "Posts", value: stats.posts },
  ].filter((s) => s.value > 0);

  return (
    <div>
      {/* Hero: with a cover image the name, description and stats sit *on* the
          photo behind a gradient scrim — the community reads as the place it's
          about rather than as a banner glued above a document. The scrim is
          what makes that safe: it darkens the bottom of any photo, so white
          text stays legible over a bright sky or a blown-out beach alike. The
          crop is deliberately taller on a phone than on a desktop, so an image
          with sky and sand in it doesn't lose both. With no cover, the original
          accent-gradient header and its own stats strip still apply. */}
      {community.cover_image_url ? (
        <section className="relative isolate overflow-hidden border-b border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={community.cover_image_url}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/5"
          />
          <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 pb-7 pt-40 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-8 sm:pt-52">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white [text-shadow:0_2px_16px_rgb(0_0_0/0.45)] sm:text-4xl">
                {community.name}
              </h1>
              {community.description && (
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/90 [text-shadow:0_1px_10px_rgb(0_0_0/0.45)] sm:text-xl">
                  {community.description}
                </p>
              )}
            </div>
            {user && !membership && (
              <div className="shrink-0">
                <JoinCommunityButton communityId={community.id} />
              </div>
            )}
          </div>

          {statItems.length > 0 && (
            <div className="border-t border-white/15 bg-black/35 backdrop-blur-sm">
              <div className="mx-auto flex max-w-4xl flex-wrap gap-x-10 gap-y-3 px-4 py-4 sm:px-6">
                {statItems.map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">{stat.value.toLocaleString()}</span>
                    <span className="text-sm text-white/75">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="border-b border-border">
            <div className="bg-gradient-to-br from-accent/10 via-background to-background">
              <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-10">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{community.name}</h1>
                  {community.description && (
                    <p className="mt-3 max-w-2xl text-lg leading-relaxed text-foreground/80 sm:text-xl">
                      {community.description}
                    </p>
                  )}
                </div>
                {user && !membership && (
                  <div className="shrink-0">
                    <JoinCommunityButton communityId={community.id} />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Stats strip: at-a-glance signals that the community is active. */}
          {statItems.length > 0 && (
            <div className="border-b border-border bg-muted/30">
              <div className="mx-auto flex max-w-4xl flex-wrap gap-x-10 gap-y-3 px-4 py-4 sm:px-6">
                {statItems.map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">{stat.value.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <DiscoverStrip title={`Explore ${community.name}`} shortcuts={discoverShortcuts} allHref={`${base}/spaces`} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activity.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="h-6 w-6" />}
                title="No activity yet"
                description="Be the first to share something — start a post, add a business, or list an event."
                action={
                  <Link
                    href={`${base}/spaces`}
                    className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
                  >
                    Explore spaces
                  </Link>
                }
              />
            ) : (
              <div className="space-y-5">
                {activity.map((item) => (
                  <FeedItemCard key={item.key} item={item} />
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            {growingJourney && (
              <ShareJourneyCard
                communityId={community.id}
                communitySlug={community.slug}
                spaceSlug={growingJourney.slug}
                spaceName={growingJourney.name}
                isLoggedIn={Boolean(user)}
                isMember={membership?.status === "active"}
              />
            )}

            <Suspense fallback={null}>
              <WeatherTidesCard community={community} />
            </Suspense>

            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Upcoming events
            </h2>
            {upcoming.length === 0 ? (
              <EmptyState
                icon={<CalendarDays className="h-6 w-6" />}
                title="Nothing scheduled"
                description="Check back soon."
              />
            ) : (
              <div className="space-y-3">
                {upcoming.slice(0, 4).map((event) => (
                  <Card key={event.id}>
                    <CardContent className="pt-5">
                      <p className="text-sm font-semibold text-foreground">{event.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(event.start_time)}</p>
                    </CardContent>
                  </Card>
                ))}
                <Link
                  href={`/c/${community.slug}/events`}
                  className="block text-center text-sm font-medium text-accent hover:underline"
                >
                  View all events
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
