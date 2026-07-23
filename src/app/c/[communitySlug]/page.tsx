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
import { getCommunityBySlug, getMembership, getCommunityRecentMembers } from "@/lib/data/community";
import { getCommunityPosts } from "@/lib/data/posts";
import { getCommunityRecentBusinesses, getCommunityBusinessCustomCategories } from "@/lib/data/businesses";
import { businessCategoryLabel } from "@/lib/business-categories";
import { getCommunityEvents, getCommunityRecentEvents, splitUpcomingPast } from "@/lib/data/events";
import { getCommunityRecentMarketplaceListings } from "@/lib/data/marketplace";
import { marketplaceCategoryLabel } from "@/lib/marketplace-categories";
import { getCommunityRecentJobListings } from "@/lib/data/jobs";
import { jobTypeLabel } from "@/lib/job-types";
import { getCommunityRecentAccommodationListings } from "@/lib/data/accommodation";
import { accommodationTypeLabel } from "@/lib/accommodation-types";
import { getCommunityRecentRecommendations } from "@/lib/data/recommendations";
import { recommendationCategoryLabel } from "@/lib/recommendation-categories";
import { getCommunityRecentClubs } from "@/lib/data/clubs";
import { getCommunityRecentVolunteerProjects } from "@/lib/data/volunteer-hub";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { JoinCommunityButton } from "./join-community-button";
import { WeatherTidesCard } from "./weather-tides-card";
import { FeedItemCard, type FeedItem } from "./feed-item-card";
import { formatDateTime } from "@/lib/utils";

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
  const [
    posts,
    events,
    recentBusinesses,
    customCategories,
    recentEvents,
    recentListings,
    recentJobs,
    recentStays,
    recentRecommendations,
    recentClubs,
    recentVolunteerProjects,
    recentMembers,
  ] = await Promise.all([
    getCommunityPosts(supabase, community.id, 6),
    getCommunityEvents(supabase, community.id),
    getCommunityRecentBusinesses(supabase, community.id, 6),
    getCommunityBusinessCustomCategories(supabase, community.id),
    getCommunityRecentEvents(supabase, community.id, 6),
    getCommunityRecentMarketplaceListings(supabase, community.id, 6),
    getCommunityRecentJobListings(supabase, community.id, 6),
    getCommunityRecentAccommodationListings(supabase, community.id, 6),
    getCommunityRecentRecommendations(supabase, community.id, 6),
    getCommunityRecentClubs(supabase, community.id, 6),
    getCommunityRecentVolunteerProjects(supabase, community.id, 6),
    getCommunityRecentMembers(supabase, community.id, 6),
  ]);
  const { upcoming } = splitUpcomingPast(events);

  const base = `/c/${community.slug}`;

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
      imageUrl: null,
      typeBadge: p.post_type,
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
      typeBadge: businessCategoryLabel(b.category, customCategories),
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
      typeBadge: "Event",
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
      typeBadge: marketplaceCategoryLabel(l.listing_type),
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
      typeBadge: jobTypeLabel(j.job_type),
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
      imageUrl: a.photo_url,
      typeBadge: accommodationTypeLabel(a.accommodation_type),
      detail: a.price_per_night !== null ? `${a.currency ?? ""} ${a.price_per_night}/night`.trim() : null,
      authorName: a.lister?.full_name || a.lister?.username || null,
      authorAvatar: a.lister?.avatar_url ?? null,
      spaceName: a.space?.name ?? null,
      href: a.space ? `${base}/spaces/${a.space.slug}` : base,
    })),
    ...recentRecommendations.map((r): FeedItem => ({
      key: `recommendation-${r.id}`,
      createdAt: r.created_at,
      icon: Star,
      title: r.title,
      description: r.note,
      imageUrl: null,
      typeBadge: recommendationCategoryLabel(r.category),
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
      typeBadge: c.category,
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
      typeBadge: v.category,
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
    })),
  ];

  const pinned = items.filter((i) => i.isPinned).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const rest = items.filter((i) => !i.isPinned).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const activity = [...pinned, ...rest].slice(0, 15);

  return (
    <div>
      {community.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={community.cover_image_url}
          alt=""
          className="h-40 w-full border-b border-border object-cover sm:h-64"
        />
      )}

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{community.name}</h1>
            {community.description && <p className="mt-1 text-sm text-muted-foreground">{community.description}</p>}
          </div>
          {user && !membership && <JoinCommunityButton communityId={community.id} />}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Recent activity
            </h2>
            {activity.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="h-6 w-6" />}
                title="No posts yet"
                description="Once members start posting, activity will show up here."
              />
            ) : (
              <div className="space-y-5">
                {activity.map((item) => (
                  <FeedItemCard key={item.key} item={item} />
                ))}
              </div>
            )}
          </div>

          <div>
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
