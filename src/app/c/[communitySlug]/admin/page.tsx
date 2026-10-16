import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarDays, Sparkles, ListTree, Inbox, BarChart3, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import {
  getCommunityBySlug,
  getMembership,
  getCommunityMembers,
  getPendingJoinRequests,
  isCommunityAdmin,
  isCommunityOwner,
} from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityEvents } from "@/lib/data/events";
import { SectionNav, type NavSection } from "@/components/ui/section-nav";
import { ViewAsMemberButton } from "./view-as-member-button";
import { MonetizationChecklist, type ChecklistStep } from "./monetization-checklist";
import { MembersSection } from "./members-section";
import { JoinRequestsSection } from "./join-requests-section";
import { StaffManagementToggle } from "./staff-management-toggle";
import { getCommunityProfileFields } from "@/lib/data/community-profile-fields";
import { getJournalFieldsBySpaceIds } from "@/lib/data/journal";
import { getCommunityNavLinks } from "@/lib/data/nav-links";
import { getCommunityNavGroups } from "@/lib/data/nav-groups";
import { DEFAULT_NAV_GROUPS } from "@/lib/nav-groups";
import { getCommunityNavItemOrder } from "@/lib/data/nav-order";
import { getCommunityFeatureControls, getCommunityFeatures } from "@/lib/data/features";
import { getAllowedSpaceTypes } from "@/lib/data/space-type-pool";
import { getCommunityFeaturedBusinessCategories, getCommunityBusinessCustomCategories, getCommunityBusinessCategoryLabelOverrides } from "@/lib/data/businesses";
import { BUILTIN_NAV_ITEMS, defaultNavItemSort } from "@/lib/nav-items";
import { businessCategoryPluralLabel } from "@/lib/business-categories";
import { Card, CardContent } from "@/components/ui/card";
import { CommunityFeaturesSection } from "./community-features-section";
import { NewSpaceForm } from "./new-space-form";
import { SpacesManager, type NavManagerItem, type NavSubItem } from "./spaces-manager";
import { CommunityBrandingForm } from "./community-branding-form";
import { CommunityDetailsForm } from "./community-details-form";
import { CommunityHeroForm } from "./community-hero-form";
import { CommunityGuidelinesForm } from "./community-guidelines-form";
import { CommunityContactInfoForm } from "./community-contact-info-form";
import { countUnhandledCommunityContactMessages } from "@/lib/data/contact-messages";
import { PublicAccessForm } from "./public-access-form";
import { ProfileFieldsSection } from "./profile-fields-section";
import { NewNavLinkForm } from "./new-nav-link-form";
import { NavLinksList } from "./nav-links-list";
import { NavGroupsSection } from "./nav-groups-section";
import { CustomDomainSection } from "./custom-domain-section";
import { isVercelDomainAutomationConfigured } from "@/lib/vercel-domains";
import { DeleteCommunitySection } from "./delete-community-section";
import { BillingSection } from "./billing-section";
import { PlanSection } from "./plan-section";
import { MarketplaceSection } from "./marketplace-section";
import { TiersSection } from "./tiers-section";
import { getActivePlatformPlans } from "@/lib/data/platform-plans";
import { communityHasFeature } from "@/lib/data/plan-limits";
import { getActiveFeaturePacks, getCommunityAddons } from "@/lib/data/feature-packs";
import { getCommunityTiers } from "@/lib/data/tiers";
import { isStripeConfigured } from "@/lib/stripe";

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string }>;
  searchParams: Promise<{ stripe?: string; plan?: string }>;
}) {
  const { communitySlug } = await params;
  const { stripe: stripeReturn, plan: planReturn } = await searchParams;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const membership = await getMembership(supabase, community.id, user.id);
  // Owner-aware on purpose. This guard used to read the membership row alone,
  // so an owner whose row was missing or wrong was redirected out of their own
  // community's admin page — and every other surface that could have told them
  // why is behind the same check. communities.owner_id is the authority.
  const isAdmin = isCommunityAdmin(community, membership, user.id);
  // Platform view: the super admin may open any community's admin page and see
  // exactly what its owner sees (plan, payments, tiers included) — read-only.
  // Every control below sits in a disabled fieldset, and the server actions
  // behind them still check community admin rights, so nothing can be changed
  // from here.
  const viewerProfile = isAdmin ? null : await getProfile(supabase, user.id);
  const platformView = !isAdmin && Boolean(viewerProfile?.is_super_admin);

  if (!isAdmin && !platformView) {
    redirect(`/c/${community.slug}`);
  }

  const isOwner = platformView || isCommunityOwner(community, user.id) || membership?.role === "owner";
  // In platform view the super admin usually isn't a member, so RLS would hide
  // a private community's members, spaces and the rest. Their reads go through
  // the service-role client instead — only after the super-admin check above.
  const db = platformView ? createAdminClient() : supabase;

  const [spaces, members, joinRequests, events, profileFields, navLinks, navItemOrder, features, featureControls, featuredCategories, customCategories, labelOverrides, allowedTypes, savedNavGroups] =
    await Promise.all([
      getCommunitySpaces(db, community.id),
      getCommunityMembers(db, community.id),
      getPendingJoinRequests(db, community.id),
      getCommunityEvents(db, community.id),
      getCommunityProfileFields(db, community.id),
      getCommunityNavLinks(db, community.id),
      getCommunityNavItemOrder(db, community.id),
      getCommunityFeatures(db, community.id),
      isOwner ? getCommunityFeatureControls(db, community.id) : Promise.resolve([]),
      getCommunityFeaturedBusinessCategories(db, community.id),
      getCommunityBusinessCustomCategories(db, community.id),
      getCommunityBusinessCategoryLabelOverrides(db, community.id),
      getAllowedSpaceTypes(db, community.id),
      getCommunityNavGroups(db, community.id),
    ]);

  // Sidebar sections. If they could not be read, the dropdowns still offer the
  // three every community starts with, and the manager below shows nothing to
  // edit rather than an error.
  const navGroups = savedNavGroups ?? [];
  const navGroupOptions = savedNavGroups ?? DEFAULT_NAV_GROUPS;
  const spaceCountsByNavGroup: Record<string, number> = {};
  for (const space of spaces) {
    if (space.nav_group) spaceCountsByNavGroup[space.nav_group] = (spaceCountsByNavGroup[space.nav_group] ?? 0) + 1;
  }

  const journalSpaceIds = spaces.filter((s) => s.space_type === "journal").map((s) => s.id);
  const journalFieldsBySpaceId = await getJournalFieldsBySpaceIds(db, journalSpaceIds);

  // Just the open count — the messages themselves live on the Inbox page.
  const openMessageCount = await countUnhandledCommunityContactMessages(db, community.id);

  // Overview stats. Members are already active-only (see getCommunityMembers);
  // "new this week" counts them by join date so the header reflects momentum,
  // not just a running total. Upcoming events look ahead from now.
  const now = new Date().getTime();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = members.filter((m) => new Date(m.created_at).getTime() >= weekAgo).length;
  const upcomingEvents = events.filter((e) => new Date(e.start_time).getTime() >= now).length;

  const stats: { label: string; value: number; sub?: string }[] = [
    { label: "Members", value: members.length },
    { label: "Spaces", value: spaces.length },
    { label: "Upcoming events", value: upcomingEvents },
    { label: "New this week", value: newThisWeek, sub: "members joined" },
  ];

  // Platform plans (owner-only). The community can charge members only while on
  // a live plan whose features include 'paid_memberships' — the same rule as
  // the community_can_charge() SQL gate, computed here to drive the UI.
  // Where this community stands against its plan's caps. Shown before anyone
  // runs into the wall, so "you can't add another member" is never the first
  // time an admin hears about it.

  // 'white_label' is what a plan calls running the community on your own
  // domain. Only the owner sees that section at all.
  const planAllowsCustomDomain = isOwner
    ? await communityHasFeature(db, community.id, "white_label")
    : false;

  const platformPlans = isOwner ? await getActivePlatformPlans(db) : [];
  const currentPlan = platformPlans.find((p) => p.id === community.plan_id) ?? null;
  const planIsLive =
    community.plan_status === "active" || community.plan_status === "trialing" || community.plan_status === "comped";
  const canCharge = Boolean(planIsLive && currentPlan?.features.includes("paid_memberships"));

  // Feature marketplace (owner-only): available packs + which this community has
  // actively installed.
  const featurePacks = isOwner ? await getActiveFeaturePacks(db) : [];
  const communityAddons = isOwner ? await getCommunityAddons(db, community.id) : [];
  const installedPackIds = communityAddons
    .filter((a) => a.status === "active" || a.status === "trialing")
    .map((a) => a.pack_id);

  // Membership tiers (owner-only section, shown once payments are connected).
  // Public spaces are always free, so they can't be assigned to a tier.
  const tiers = isOwner && canCharge ? await getCommunityTiers(db, community.id) : [];
  const tierAssignableSpaces = spaces.filter((s) => s.visibility !== "public").map((s) => ({ id: s.id, name: s.name }));

  // A space's nav sub-links, grouped by space and kept in nav order (the query
  // returns featured categories already sorted by sort_order). Today only a
  // business directory contributes them; a new source just adds to this map.
  const subItemsBySpaceId: Record<string, NavSubItem[]> = {};
  for (const f of featuredCategories) {
    const customsForSpace = customCategories.filter((c) => c.space_id === f.space_id);
    const overridesForSpace = labelOverrides.filter((o) => o.space_id === f.space_id);
    (subItemsBySpaceId[f.space_id] ??= []).push({
      kind: "featured_category",
      ref: f.category,
      label: businessCategoryPluralLabel(f.category, customsForSpace, overridesForSpace),
    });
  }

  // The sidebar order: spaces and the enabled built-in links (Events, Search)
  // as one draggable list, pre-sorted the way the sidebar renders them.
  const navManagerItems: NavManagerItem[] = [
    ...spaces.map((s) => ({ kind: "space" as const, key: s.id, sort: s.sort_order, space: s, subItems: subItemsBySpaceId[s.id] ?? [] })),
    ...BUILTIN_NAV_ITEMS.filter((item) => features[item.key]).map((item) => ({
      kind: "builtin" as const,
      key: `builtin:${item.key}`,
      sort: navItemOrder[item.key]?.sortOrder ?? defaultNavItemSort(item.key),
      itemKey: item.key,
      label: item.label,
      showInNav: navItemOrder[item.key]?.showInNav ?? true,
    })),
  ].sort((a, b) => a.sort - b.sort);

  // Owner-only "charge members" setup chain. Each step's `done` mirrors the
  // same gates the sections below enforce, so the checklist can never disagree
  // with what those sections actually let you do.
  const monetizationSteps: ChecklistStep[] = [
    { label: "Upgrade to a paid plan", hint: "Unlocks paid memberships on your plan.", done: canCharge, href: "#plan" },
    { label: "Connect Stripe", hint: "Link an account to receive payouts.", done: community.stripe_charges_enabled, href: "#payments" },
    { label: "Set a price on a space", hint: "Charge a monthly fee for any private space.", done: spaces.some((s) => s.price_cents > 0), href: "#spaces" },
    { label: "Bundle a membership tier", hint: "Group spaces into one recurring price.", done: tiers.length > 0, href: "#tiers" },
  ];

  // Sections shown in the admin nav, in page order and grouped under headings.
  // Owner-only sections are appended only when they actually render below, so
  // a link never points at a missing anchor.
  const sections: NavSection[] = [
    { id: "overview", label: "Overview", group: "Community" },
    { id: "members", label: "Members", group: "Community" },
    { id: "details", label: "Details", group: "Profile & pages" },
    { id: "landing", label: "Landing page", group: "Profile & pages" },
    { id: "guidelines", label: "Guidelines", group: "Profile & pages" },
    { id: "contact", label: "Contact", group: "Profile & pages" },
    { id: "public-access", label: "Public access", group: "Profile & pages" },
    { id: "spaces", label: "Spaces", group: "Spaces & sidebar" },
    { id: "sidebar-sections", label: "Sidebar sections", group: "Spaces & sidebar" },
    { id: "profile-fields", label: "Profile fields", group: "Spaces & sidebar" },
    { id: "sidebar-links", label: "Sidebar links", group: "Spaces & sidebar" },
    { id: "more", label: "More", group: "Spaces & sidebar" },
  ];
  if (isOwner && featureControls.length > 0) {
    sections.push({ id: "features", label: "Features", group: "Spaces & sidebar" });
  }
  if (isOwner) {
    sections.push(
      { id: "plan", label: "Plan", group: "Plan & payments" },
      { id: "marketplace", label: "Marketplace", group: "Plan & payments" },
      { id: "payments", label: "Payments", group: "Plan & payments" },
      { id: "tiers", label: "Tiers", group: "Plan & payments" },
      { id: "domain", label: "Custom domain", group: "Settings" },
      { id: "danger", label: "Danger zone", group: "Settings" },
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:grid lg:max-w-6xl lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10">
      <SectionNav sections={sections} label="Admin sections" />

      {/* A disabled fieldset turns off every input and button inside it in one
          go — the platform view's read-only switch. Links still work. */}
      <fieldset disabled={platformView} className="m-0 min-w-0 border-0 p-0 lg:max-w-3xl">
      {/* Sticky, so it stays in view however far down the page somebody
          scrolls: a disabled form half-way down with no explanation beside it
          reads as a broken form, not a read-only one. */}
      {platformView && (
        <div className="sticky top-0 z-30 mb-6 flex items-start gap-3 rounded-md border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent shadow-sm">
          <Eye className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            <span className="font-medium">Read-only: you&apos;re signed in as the platform admin ({user.email}), not as an
            owner or admin of {community.name}.</span>{" "}
            Every control on this page is switched off. To make changes here, sign in with this community&apos;s owner
            or admin account. You&apos;re seeing exactly what its owner does, including plan and payments; to grant or
            remove a complimentary plan, use{" "}
            <Link href="/platform-admin/communities" className="font-medium underline">
              Platform admin → Communities
            </Link>
            .
          </p>
        </div>
      )}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Admin</h1>
          <p className="text-sm text-muted-foreground">Manage {community.name}.</p>
        </div>
        {/* Hidden in platform view: a super admin who isn't staff here has
            nothing to step down from. */}
        {!platformView && <ViewAsMemberButton communityId={community.id} communitySlug={community.slug} />}
      </div>

      <div id="overview" className="mb-3 grid scroll-mt-20 grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5">
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              {stat.sub && <p className="mt-0.5 text-xs text-accent">{stat.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Link
        href={`/c/${community.slug}/admin/analytics`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <BarChart3 className="h-4 w-4" />
        View full analytics — active members, joins, posts and top members
      </Link>

      <h2 id="members" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Members</h2>
      <div className="mb-8 space-y-4">
        <JoinRequestsSection requests={joinRequests} communitySlug={community.slug} />
        <MembersSection
          members={members}
          communitySlug={community.slug}
          currentUserId={user.id}
          viewerIsOwner={isOwner}
          allowStaff={community.admins_can_manage_staff}
        />
        {isOwner && (
          <StaffManagementToggle
            communityId={community.id}
            communitySlug={community.slug}
            enabled={community.admins_can_manage_staff}
          />
        )}
      </div>

      <h2 id="details" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Community details</h2>
      <div className="mb-8 space-y-4">
        <CommunityDetailsForm community={community} />
        <CommunityBrandingForm community={community} />
      </div>

      <h2 id="landing" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Feed landing page</h2>
      <div className="mb-8">
        <CommunityHeroForm community={community} spaces={spaces} />
      </div>

      <h2 id="guidelines" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Community guidelines</h2>
      <div className="mb-8">
        <CommunityGuidelinesForm community={community} />
      </div>

      <h2 id="contact" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Contact page</h2>
      <div className="mb-8 space-y-4">
        <CommunityContactInfoForm community={community} />
        <Link href={`/c/${community.slug}/inbox`}>
          <Card className="transition-shadow hover:shadow-sm">
            <CardContent className="flex items-center gap-3 pt-5">
              <Inbox className="h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Inbox</p>
                <p className="text-xs text-muted-foreground">
                  {openMessageCount > 0
                    ? `${openMessageCount} message${openMessageCount === 1 ? "" : "s"} waiting for a reply`
                    : "Read what people have sent through your contact page"}
                </p>
              </div>
              {openMessageCount > 0 && (
                <span className="ml-auto shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                  {openMessageCount}
                </span>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      <h2 id="public-access" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Public access</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Who can find this community, and what they can see before joining. Individual spaces have their own visibility
        setting.
      </p>
      <div className="mb-8">
        <PublicAccessForm community={community} />
      </div>

      <h2 id="spaces" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Spaces</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Drag to reorder. Events and Search can be moved among your spaces too — Feed always stays at the top. A space with
        nav sub-links (like a business directory&apos;s featured categories) shows a{" "}
        <ListTree className="inline h-3.5 w-3.5 align-text-bottom" /> button to expand and reorder them.
      </p>
      {navManagerItems.length > 0 && (
        <div className="mb-4">
          <SpacesManager
            items={navManagerItems}
            communityId={community.id}
            communitySlug={community.slug}
            journalFieldsBySpaceId={journalFieldsBySpaceId}
            allowedTypes={allowedTypes}
            paymentsEnabled={canCharge && community.stripe_charges_enabled}
            navGroups={navGroupOptions}
          />
        </div>
      )}
      <h3 id="add-space" className="mb-1 scroll-mt-20 text-base font-semibold text-foreground">Add a space</h3>
      <p className="mb-3 text-sm text-muted-foreground">
        {platformView
          ? "Switched off in platform view — sign in as this community's owner or admin to add one."
          : "Give it a name, pick what kind of space it is, and it appears in the list above and in the sidebar."}
      </p>
      <div className="mb-8">
        <NewSpaceForm communityId={community.id} communitySlug={community.slug} allowedTypes={allowedTypes} />
      </div>

      <h2 id="sidebar-sections" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Sidebar sections</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Headings that group your spaces in the sidebar. File a space under one with its Section dropdown above. A section
        with no spaces in it shows no heading.
      </p>
      <div className="mb-8">
        <NavGroupsSection
          communityId={community.id}
          communitySlug={community.slug}
          groups={navGroups}
          spaceCounts={spaceCountsByNavGroup}
        />
      </div>

      <h2 id="profile-fields" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Custom profile fields</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Ask members questions specific to {community.name} — answers show up on their member profile within this community.
      </p>
      <div className="mb-8">
        <ProfileFieldsSection communityId={community.id} communitySlug={community.slug} fields={profileFields} />
      </div>

      <h2 id="sidebar-links" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Sidebar links</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Add external links to {community.name}&apos;s sidebar — each opens in a new tab.
      </p>
      <div className="mb-4">
        <NewNavLinkForm communityId={community.id} communitySlug={community.slug} />
      </div>
      <div className="mb-8">
        <NavLinksList links={navLinks} communitySlug={community.slug} />
      </div>

      <h2 id="more" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">More</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href={`/c/${community.slug}/events`}>
          <Card className="transition-shadow hover:shadow-sm">
            <CardContent className="flex items-center gap-3 pt-5">
              <CalendarDays className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Schedule an event</span>
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
          <h2 id="features" className="mb-3 mt-8 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Features</h2>
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
          <div className="mb-8 mt-8">
            <MonetizationChecklist steps={monetizationSteps} />
          </div>

          <h2 id="plan" className="mb-3 mt-8 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Plan</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Your community runs free forever. Upgrade to unlock premium features — including the ability to charge members
            for spaces.
          </p>
          <div className="mb-8">
            <PlanSection
              communityId={community.id}
              plans={platformPlans}
              currentPlanId={community.plan_id}
              planStatus={community.plan_status}
              hasBillingAccount={Boolean(community.plan_stripe_customer_id)}
              platformConfigured={isStripeConfigured()}
              justSubscribed={planReturn === "subscribed"}
            />
          </div>

          <h2 id="marketplace" className="mb-3 mt-8 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Feature marketplace</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Install feature packs to add more to {community.name}. Each pack unlocks its spaces in the &ldquo;add a
            space&rdquo; picker.
          </p>
          <div className="mb-8">
            <MarketplaceSection
              communityId={community.id}
              packs={featurePacks}
              installedPackIds={installedPackIds}
              platformConfigured={isStripeConfigured()}
            />
          </div>

          <h2 id="payments" className="mb-3 mt-8 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Payments</h2>
          {canCharge ? (
            <>
              <p className="mb-3 text-sm text-muted-foreground">
                Connect Stripe to charge members a monthly fee for individual spaces. Once payments are connected, set a
                price on a space in the <a href="#spaces" className="text-accent underline-offset-2 hover:underline">Spaces</a> section.
              </p>
              <div className="mb-8">
                <BillingSection
                  communityId={community.id}
                  communitySlug={community.slug}
                  stripeAccountId={community.stripe_account_id}
                  chargesEnabled={community.stripe_charges_enabled}
                  platformConfigured={isStripeConfigured()}
                  justReturned={stripeReturn === "return"}
                />
              </div>
            </>
          ) : (
            <p className="mb-8 text-sm text-muted-foreground">
              Charging members for spaces is a paid-plan feature.{" "}
              <a href="#plan" className="text-accent underline-offset-2 hover:underline">Upgrade your plan</a> to connect
              Stripe and set space prices.
            </p>
          )}

          <h2 id="tiers" className="mb-3 mt-8 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Membership tiers</h2>
          {canCharge && community.stripe_charges_enabled ? (
            <>
              <p className="mb-3 text-sm text-muted-foreground">
                Bundle spaces into a recurring membership — one price unlocks every space in the tier. Members can join a
                tier instead of paying for spaces one by one. Public spaces are always free and can&apos;t be tiered.
              </p>
              <div className="mb-8">
                <TiersSection communityId={community.id} communitySlug={community.slug} tiers={tiers} spaces={tierAssignableSpaces} />
              </div>
            </>
          ) : (
            <p className="mb-8 text-sm text-muted-foreground">
              <a href="#payments" className="text-accent underline-offset-2 hover:underline">Connect payments</a> to offer
              membership tiers.
            </p>
          )}

          <h2 id="domain" className="mb-3 mt-8 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Custom domain</h2>
          <CustomDomainSection
            community={community}
            vercelAutomated={isVercelDomainAutomationConfigured()}
            planAllowsCustomDomain={planAllowsCustomDomain}
          />

          <h2 id="danger" className="mb-3 mt-8 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-danger">Danger zone</h2>
          <DeleteCommunitySection community={community} />
        </>
      )}
      </fieldset>
    </div>
  );
}
