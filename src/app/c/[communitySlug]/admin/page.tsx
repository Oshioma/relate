import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarDays, Users, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, getCommunityMembers } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityProfileFields } from "@/lib/data/community-profile-fields";
import { getJournalFieldsBySpaceIds } from "@/lib/data/journal";
import { getCommunityNavLinks } from "@/lib/data/nav-links";
import { getCommunityNavItemOrder } from "@/lib/data/nav-order";
import { getCommunityFeatureControls, getCommunityFeatures } from "@/lib/data/features";
import { BUILTIN_NAV_ITEMS, defaultNavItemSort } from "@/lib/nav-items";
import { Card, CardContent } from "@/components/ui/card";
import { CommunityFeaturesSection } from "./community-features-section";
import { NewSpaceForm } from "./new-space-form";
import { SpacesManager, type NavManagerItem } from "./spaces-manager";
import { CommunityBrandingForm } from "./community-branding-form";
import { CommunityDetailsForm } from "./community-details-form";
import { ProfileFieldsSection } from "./profile-fields-section";
import { NewNavLinkForm } from "./new-nav-link-form";
import { NavLinksList } from "./nav-links-list";
import { CustomDomainSection } from "./custom-domain-section";
import { isVercelDomainAutomationConfigured } from "@/lib/vercel-domains";
import { DeleteCommunitySection } from "./delete-community-section";

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

  const isOwner = membership?.role === "owner";

  const [spaces, members, profileFields, navLinks, navItemOrder, features, featureControls] = await Promise.all([
    getCommunitySpaces(supabase, community.id),
    getCommunityMembers(supabase, community.id),
    getCommunityProfileFields(supabase, community.id),
    getCommunityNavLinks(supabase, community.id),
    getCommunityNavItemOrder(supabase, community.id),
    getCommunityFeatures(supabase, community.id),
    isOwner ? getCommunityFeatureControls(supabase, community.id) : Promise.resolve([]),
  ]);

  const journalSpaceIds = spaces.filter((s) => s.space_type === "journal").map((s) => s.id);
  const journalFieldsBySpaceId = await getJournalFieldsBySpaceIds(supabase, journalSpaceIds);

  // The sidebar order: spaces and the enabled built-in links (Events, Search)
  // as one draggable list, pre-sorted the way the sidebar renders them.
  const navManagerItems: NavManagerItem[] = [
    ...spaces.map((s) => ({ kind: "space" as const, key: s.id, sort: s.sort_order, space: s })),
    ...BUILTIN_NAV_ITEMS.filter((item) => features[item.key]).map((item) => ({
      kind: "builtin" as const,
      key: `builtin:${item.key}`,
      sort: navItemOrder[item.key]?.sortOrder ?? defaultNavItemSort(item.key),
      itemKey: item.key,
      label: item.label,
      showInNav: navItemOrder[item.key]?.showInNav ?? true,
    })),
  ].sort((a, b) => a.sort - b.sort);

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

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Community details</h2>
      <div className="mb-8 space-y-4">
        <CommunityDetailsForm community={community} />
        <CommunityBrandingForm community={community} />
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Spaces</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Drag to reorder. Events and Search can be moved among your spaces too — Feed always stays at the top.
      </p>
      {navManagerItems.length > 0 && (
        <div className="mb-4">
          <SpacesManager
            items={navManagerItems}
            communityId={community.id}
            communitySlug={community.slug}
            journalFieldsBySpaceId={journalFieldsBySpaceId}
          />
        </div>
      )}
      <div className="mb-8">
        <NewSpaceForm communityId={community.id} communitySlug={community.slug} />
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Custom profile fields</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Ask members questions specific to {community.name} — answers show up on their member profile within this community.
      </p>
      <div className="mb-8">
        <ProfileFieldsSection communityId={community.id} communitySlug={community.slug} fields={profileFields} />
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Sidebar links</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Add external links to {community.name}&apos;s sidebar — each opens in a new tab.
      </p>
      <div className="mb-4">
        <NewNavLinkForm communityId={community.id} communitySlug={community.slug} />
      </div>
      <div className="mb-8">
        <NavLinksList links={navLinks} communitySlug={community.slug} />
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
        <Link href={`/c/${community.slug}/members`}>
          <Card className="transition-shadow hover:shadow-sm">
            <CardContent className="flex items-center gap-3 pt-5">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">View members</span>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/c/${community.slug}/admin/concierge`}>
          <Card className="transition-shadow hover:shadow-sm">
            <CardContent className="flex items-center gap-3 pt-5">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Concierge queries</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {isOwner && featureControls.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-sm font-medium uppercase tracking-wide text-muted-foreground">Features</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Turn optional sections of {community.name} on or off. The platform admin decides which are available to you.
          </p>
          <div className="mb-8">
            <CommunityFeaturesSection communityId={community.id} controls={featureControls} />
          </div>
        </>
      )}

      {isOwner && (
        <>
          <h2 className="mb-3 mt-8 text-sm font-medium uppercase tracking-wide text-muted-foreground">Custom domain</h2>
          <CustomDomainSection community={community} vercelAutomated={isVercelDomainAutomationConfigured()} />

          <h2 className="mb-3 mt-8 text-sm font-medium uppercase tracking-wide text-danger">Danger zone</h2>
          <DeleteCommunitySection community={community} />
        </>
      )}
    </div>
  );
}
