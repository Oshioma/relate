import { redirect } from "next/navigation";
import { Users, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getUserCommunities, getDiscoverableCommunities } from "@/lib/data/community";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import Link from "next/link";
import { JoinButton } from "./join-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const [communities, discoverable] = await Promise.all([
    getUserCommunities(supabase, user.id),
    getDiscoverableCommunities(supabase, user.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your communities</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off.</p>
        </div>
        <LinkButton href="/communities/new" size="sm" variant="secondary" className="shrink-0">
          <Plus className="h-4 w-4" />
          New community
        </LinkButton>
      </div>

      {communities.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="You haven't joined a community yet"
          description="Join one of the communities below to get started."
          className="mb-10"
        />
      ) : (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Link key={community.id} href={`/c/${community.slug}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <Avatar src={community.logo_url} name={community.name} size={40} />
                    <Badge tone="accent">{community.membership.role}</Badge>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{community.name}</h3>
                  {community.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{community.description}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {discoverable.length > 0 && (
        <div>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Discover more communities
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {discoverable.map((community) => (
              <Card key={community.id}>
                <CardContent className="pt-6">
                  <Avatar src={community.logo_url} name={community.name} size={40} />
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{community.name}</h3>
                  {community.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{community.description}</p>
                  )}
                  <div className="mt-4">
                    <JoinButton communityId={community.id} slug={community.slug} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
