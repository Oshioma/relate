import Link from "next/link";
import { notFound } from "next/navigation";
import { History, Layers, Lock, Users as UsersIcon, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { toPlainText } from "@/components/ui/rich-text";
import { LinkButton } from "@/components/ui/button";
import { SPACE_TYPES } from "@/lib/space-types";
import { communityHasTimeline, timelinePath } from "@/lib/timeline/availability";

const visibilityIcon = {
  public: <Globe className="h-3.5 w-3.5" />,
  members: <UsersIcon className="h-3.5 w-3.5" />,
  private: <Lock className="h-3.5 w-3.5" />,
};

export default async function SpacesPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const [membership, spaces] = await Promise.all([
    user ? getMembership(supabase, community.id, user.id) : Promise.resolve(null),
    getCommunitySpaces(supabase, community.id),
  ]);

  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");

  // THE TIMELINE IS NOT A SPACE, AND THAT IS WHY NOBODY COULD FIND IT.
  //
  // This page lists rows from `spaces`. The Timeline is a built-in page gated
  // by the community's kind rather than a row in that table, so it appeared in
  // the sidebar and then simply was not here — which on mobile, where Spaces is
  // how you get around, meant members had no way to reach it at all.
  //
  // It is listed alongside the spaces, and labelled as built-in so it is not
  // mistaken for one: there is nothing to configure, rename or delete.
  const showTimeline = communityHasTimeline(community);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Spaces</h1>
        {isStaff && (
          <LinkButton href={`/c/${community.slug}/admin`} size="sm" variant="secondary">
            New space
          </LinkButton>
        )}
      </div>

      {spaces.length === 0 && !showTimeline ? (
        <EmptyState icon={<Layers className="h-6 w-6" />} title="No spaces yet" description="Spaces will show up here once they're created." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {showTimeline && (
            <Link href={timelinePath(community.slug)} className="group">
              <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-sm">
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <History className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <h3 className="truncate text-sm font-semibold text-foreground">Timeline</h3>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      Built-in
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    Events, the dates different sources give them, and where those dates come from.
                  </p>
                </CardContent>
              </Card>
            </Link>
          )}
          {spaces.map((space) => {
            const TypeIcon = SPACE_TYPES[space.space_type].icon;
            return (
              <Link key={space.id} href={`/c/${community.slug}/spaces/${space.slug}`} className="group">
                <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-sm">
                  {space.image_url && (
                    <div className="aspect-[5/2] w-full overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={space.image_url} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <TypeIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <h3 className="truncate text-sm font-semibold text-foreground">{space.name}</h3>
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                        {visibilityIcon[space.visibility]}
                        {space.visibility}
                      </span>
                    </div>
                    {space.description && (
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{toPlainText(space.description)}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
