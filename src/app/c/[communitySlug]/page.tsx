import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquare, CalendarDays, Pin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunityPosts } from "@/lib/data/posts";
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
  const [posts, events] = await Promise.all([
    getCommunityPosts(supabase, community.id, 6),
    getCommunityEvents(supabase, community.id),
  ]);
  const { upcoming } = splitUpcomingPast(events);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      {community.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={community.cover_image_url}
          alt=""
          className="mb-6 h-40 w-full rounded-lg border border-border object-cover sm:h-56"
        />
      )}

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
          {posts.length === 0 ? (
            <EmptyState
              icon={<MessageSquare className="h-6 w-6" />}
              title="No posts yet"
              description="Once members start posting, activity will show up here."
            />
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <Card key={post.id}>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
  );
}
