import { notFound } from "next/navigation";
import { BookOpen, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunityResources } from "@/lib/data/resources";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { NewResourceForm } from "./new-resource-form";

export default async function ResourcesPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const [membership, resources, spaces] = await Promise.all([
    getMembership(supabase, community.id, user.id),
    getCommunityResources(supabase, community.id),
    getCommunitySpaces(supabase, community.id),
  ]);

  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">Resources</h1>

      {isStaff && (
        <div className="mb-8">
          <NewResourceForm communityId={community.id} communitySlug={community.slug} spaces={spaces} />
        </div>
      )}

      {resources.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-6 w-6" />} title="No resources yet" description="Links, files, and guides shared with the community will show up here." />
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
    </div>
  );
}
