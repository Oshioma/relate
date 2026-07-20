import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquare, Pin, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getSpacePosts } from "@/lib/data/posts";
import { getSpaceResources } from "@/lib/data/resources";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeTime } from "@/lib/utils";
import { NewPostForm } from "./new-post-form";
import { SpaceResourceForm } from "./space-resource-form";
import { SPACE_TYPES } from "@/lib/space-types";

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

  const [membership, posts, resources] = await Promise.all([
    getMembership(supabase, community.id, user.id),
    isResourceSpace ? Promise.resolve([]) : getSpacePosts(supabase, space.id),
    isResourceSpace ? getSpaceResources(supabase, space.id) : Promise.resolve([]),
  ]);

  const canPost = membership?.status === "active";
  const TypeIcon = SPACE_TYPES[space.space_type].icon;

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
