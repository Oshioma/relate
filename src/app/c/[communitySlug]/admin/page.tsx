import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarDays, BookOpen, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, getCommunityMembers } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { Card, CardContent } from "@/components/ui/card";
import { NewSpaceForm } from "./new-space-form";
import { CommunityBrandingForm } from "./community-branding-form";

export default async function AdminPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const membership = await getMembership(supabase, community.id, user.id);
  const isAdmin = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");

  if (!isAdmin) {
    redirect(`/c/${community.slug}`);
  }

  const [spaces, members] = await Promise.all([
    getCommunitySpaces(supabase, community.id),
    getCommunityMembers(supabase, community.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Admin</h1>
      <p className="mb-8 text-sm text-muted-foreground">Manage {community.name}.</p>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-2xl font-semibold text-foreground">{members.length}</p>
            <p className="text-xs text-muted-foreground">Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-2xl font-semibold text-foreground">{spaces.length}</p>
            <p className="text-xs text-muted-foreground">Spaces</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Branding</h2>
      <div className="mb-8">
        <CommunityBrandingForm community={community} />
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Create a space</h2>
      <div className="mb-8">
        <NewSpaceForm communityId={community.id} communitySlug={community.slug} />
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">More</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href={`/c/${community.slug}/events`}>
          <Card className="transition-shadow hover:shadow-sm">
            <CardContent className="flex items-center gap-3 pt-5">
              <CalendarDays className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Schedule an event</span>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/c/${community.slug}/resources`}>
          <Card className="transition-shadow hover:shadow-sm">
            <CardContent className="flex items-center gap-3 pt-5">
              <BookOpen className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Add a resource</span>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/c/${community.slug}/members`}>
          <Card className="transition-shadow hover:shadow-sm">
            <CardContent className="flex items-center gap-3 pt-5">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">View members</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
