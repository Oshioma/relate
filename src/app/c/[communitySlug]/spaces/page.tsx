import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers, Lock, Users as UsersIcon, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";

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
  if (!community || !user) notFound();

  const [membership, spaces] = await Promise.all([
    getMembership(supabase, community.id, user.id),
    getCommunitySpaces(supabase, community.id),
  ]);

  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");

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

      {spaces.length === 0 ? (
        <EmptyState icon={<Layers className="h-6 w-6" />} title="No spaces yet" description="Spaces will show up here once they're created." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {spaces.map((space) => (
            <Link key={space.id} href={`/c/${community.slug}/spaces/${space.slug}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-sm">
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{space.name}</h3>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {visibilityIcon[space.visibility]}
                      {space.visibility}
                    </span>
                  </div>
                  {space.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{space.description}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
