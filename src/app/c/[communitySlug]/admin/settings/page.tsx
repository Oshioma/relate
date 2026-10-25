import Link from "@/components/ui/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityAdmin } from "@/lib/data/community";
import { countCirclePictures } from "@/lib/data/circle-picture-count";
import { SectionNav, type NavSection } from "@/components/ui/section-nav";
import { CirclePicturesSection } from "../circle-pictures-section";

// Server actions take the time limit of the page they are pressed on, and
// copying from Circle can run for minutes.
export const maxDuration = 300;

// The community's Settings tab: things an owner or admin sets up once rather
// than uses every day, starting with bringing a community in from another
// platform. The platform super admin can look but not change anything, as on
// the main admin page (the server actions check admin rights themselves).
export default async function CommunitySettingsPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const [membership, profile] = await Promise.all([
    getMembership(supabase, community.id, user.id),
    getProfile(supabase, user.id),
  ]);
  const isAdmin = isCommunityAdmin(community, membership, user.id);
  const platformView = !isAdmin && Boolean(profile?.is_super_admin);
  if (!isAdmin && !platformView) redirect(`/c/${community.slug}`);

  // Profile photos and guide and post pictures a Circle import left on Circle's servers.
  const circlePictureCount = await countCirclePictures(community.id);

  // Listed in page order, like the main admin page's nav.
  const base = `/c/${community.slug}`;
  const sections: NavSection[] = [
    { id: "import", label: "Import from other platforms", group: "Settings" },
    { id: "page-admin", label: "Back to admin", group: "Other admin pages", href: `${base}/admin` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:grid lg:max-w-6xl lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10">
      <SectionNav sections={sections} label="Settings sections" />

      <div className="min-w-0 lg:max-w-3xl">
        <Link
          href={`${base}/admin`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to admin
        </Link>
        <h1 className="mb-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
          <Settings className="h-6 w-6" />
          Settings
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">Set-up for {community.name} that you do once rather than every day.</p>

        <fieldset disabled={platformView} className="m-0 min-w-0 border-0 p-0">
          {platformView && (
            <p className="mb-6 rounded-md border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent">
              Read-only: you&apos;re the platform admin, not an owner or admin of {community.name}.
            </p>
          )}

          <h2 id="import" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Import from other platforms
          </h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Moved {community.name} here from another platform? Copy across what is still stored there, so it keeps working
            after the old community closes.
          </p>
          <h3 className="mt-6 text-base font-semibold text-foreground">Circle</h3>
          {circlePictureCount > 0 ? (
            <CirclePicturesSection communitySlug={community.slug} waiting={circlePictureCount} />
          ) : (
            <p className="mt-3 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
              Nothing is waiting to be copied from Circle: every profile photo and every picture in guides and posts is
              already stored here.
            </p>
          )}
        </fieldset>
      </div>
    </div>
  );
}
