import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquare, CalendarDays, Pin, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunityPosts } from "@/lib/data/posts";
import { getCommunityRecentBusinesses, getCommunityBusinessCustomCategories } from "@/lib/data/businesses";
import { businessCategoryLabel } from "@/lib/business-categories";
import { getCommunityEvents, splitUpcomingPast } from "@/lib/data/events";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { JoinCommunityButton } from "./join-community-button";
import { formatRelativeTime, formatDateTime } from "@/lib/utils";

export default async function CommunityFeedPage({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const membership = await getMembership(supabase, community.id, user.id);
  const [posts, events, recentBusinesses, customCategories] = await Promise.all([
    getCommunityPosts(supabase, community.id, 6),
    getCommunityEvents(supabase, community.id),
    getCommunityRecentBusinesses(supabase, community.id, 6),
    getCommunityBusinessCustomCategories(supabase, community.id),
  ]);
  const { upcoming } = splitUpcomingPast(events);

  // Recent activity mixes posts and new directory listings: pinned posts stay
  // on top, everything else in reverse-chronological order.
  type FeedItem =
    | { kind: "post"; created_at: string; post: (typeof posts)[number] }
    | { kind: "business"; created_at: string; business: (typeof recentBusinesses)[number] };
  const pinnedItems: FeedItem[] = posts.filter((p) => p.is_pinned).map((p) => ({ kind: "post", created_at: p.created_at, post: p }));
  const restItems: FeedItem[] = [
    ...posts.filter((p) => !p.is_pinned).map((p): FeedItem => ({ kind: "post", created_at: p.created_at, post: p })),
    ...recentBusinesses.map((b): FeedItem => ({ kind: "business", created_at: b.created_at, business: b })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const activity = [...pinnedItems, ...restItems].slice(0, 10);

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
          {!membership && <JoinCommunityButton communityId={community.id} />}
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
              <div className="space-y-3">
                {activity.map((item) =>
                  item.kind === "post" ? (
                    <Card key={`post-${item.post.id}`}>
                      <CardContent className="pt-5">
                        <div className="flex items-start gap-3">
                          <Avatar src={item.post.author?.avatar_url} name={item.post.author?.full_name || item.post.author?.username} size={32} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {item.post.is_pinned && <Pin className="h-3.5 w-3.5 text-accent" />}
                              <h3 className="text-sm font-semibold text-foreground">{item.post.title}</h3>
                              <Badge tone="neutral">{item.post.post_type}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.post.author?.full_name || item.post.author?.username} · {formatRelativeTime(item.post.created_at)}
                            </p>
                            {item.post.body && <p className="mt-2 line-clamp-2 text-sm text-foreground">{item.post.body}</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card key={`business-${item.business.id}`}>
                      <CardContent className="pt-5">
                        <div className="flex items-start gap-3">
                          {item.business.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.business.image_url}
                              alt={item.business.name}
                              className="h-8 w-8 shrink-0 rounded-md object-cover"
                              style={{ objectPosition: item.business.image_position ?? "50% 50%" }}
                            />
                          ) : (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                              <Store className="h-4 w-4" />
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold text-foreground">{item.business.name}</h3>
                              <Badge tone="accent">{businessCategoryLabel(item.business.category, customCategories)}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Added by {item.business.creator?.full_name || item.business.creator?.username} ·{" "}
                              {formatRelativeTime(item.business.created_at)}
                            </p>
                            {item.business.description && (
                              <p className="mt-2 line-clamp-2 text-sm text-foreground">{item.business.description}</p>
                            )}
                            {item.business.space && (
                              <Link
                                href={`/c/${community.slug}/spaces/${item.business.space.slug}?category=${item.business.category}`}
                                className="mt-2 inline-block text-xs font-medium text-accent hover:underline"
                              >
                                View in {item.business.space.name} →
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            )}
          </div>

          <div>
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
