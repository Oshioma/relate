import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarDays, Sparkles, ListTree, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, getCommunityMembers } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityEvents } from "@/lib/data/events";
import { AdminSectionNav, type AdminNavSection } from "./admin-section-nav";
import { MonetizationChecklist, type ChecklistStep } from "./monetization-checklist";
import { MembersSection } from "./members-section";
import { StaffManagementToggle } from "./staff-management-toggle";
import { getCommunityProfileFields } from "@/lib/data/community-profile-fields";
import { getJournalFieldsBySpaceIds } from "@/lib/data/journal";
import { getCommunityNavLinks } from "@/lib/data/nav-links";
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
import { CommunityGuidelinesForm } from "./community-guidelines-form";
import { CommunityContactInfoForm } from "./community-contact-info-form";
import { countUnhandledCommunityContactMessages } from "@/lib/data/contact-messages";
import { PublicAccessForm } from "./public-access-form";
import { ProfileFieldsSection } from "./profile-fields-section";
import { NewNavLinkForm } from "./new-nav-link-form";
import { NavLinksList } from "./nav-links-list";
import { CustomDomainSection } from "./custom-domain-section";
import { isVercelDomainAutomationConfigured } from "@/lib/vercel-domains";
import { DeleteCommunitySection } from "./delete-community-section";
import { BillingSection } from "./billing-section";
import { PlanSection } from "./plan-section";
import { MarketplaceSection } from "./marketplace-section";
import { TiersSection } from "./tiers-section";
import { getActivePlatformPlans } from "@/lib/data/platform-plans";
import { adminSeatsLeft, communityHasFeature, getPlanCapacity, memberSeatsLeft } from "@/lib/data/plan-limits";
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
  const isAdmin = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");

  if (!isAdmin) {
    redirect(`/c/${community.slug}`);
  }

  const isOwner = membership?.role === "owner";

  const [spaces, members, events, profileFields, navLinks, navItemOrder, features, featureControls, featuredCategories, customCategories, labelOverrides, allowedTypes] =
    await Promise.all([
      getCommunitySpaces(supabase, community.id),
      getCommunityMembers(supabase, community.id),
      getCommunityEvents(supabase, community.id),
      getCommunityProfileFields(supabase, community.id),
      getCommunityNavLinks(supabase, community.id),
      getCommunityNavItemOrder(supabase, community.id),
      getCommunityFeatures(supabase, community.id),
      isOwner ? getCommunityFeatureControls(supabase, community.id) : Promise.resolve([]),
      getCommunityFeaturedBusinessCategories(supabase, community.id),
      getCommunityBusinessCustomCategories(supabase, community.id),
      getCommunityBusinessCategoryLabelOverrides(supabase, community.id),
      getAllowedSpaceTypes(supabase, community.id),
    ]);

  const journalSpaceIds = spaces.filter((s) => s.space_type === "journal").map((s) => s.id);
  const journalFieldsBySpaceId = await getJournalFieldsBySpaceIds(supabase, journalSpaceIds);

  // Just the open count — the messages themselves live on the Inbox page.
  const openMessageCount = await countUnhandledCommunityContactMessages(supabase, community.id);

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
  const capacity = await getPlanCapacity(supabase, community.id);
  const memberSeats = memberSeatsLeft(capacity);
  const adminSeats = adminSeatsLeft(capacity);

  // 'white_label' is what a plan calls running the community on your own
  // domain. Only the owner sees that section at all.
  const planAllowsCustomDomain = isOwner
    ? await communityHasFeature(supabase, community.id, "white_label")
    : false;

  const platformPlans = isOwner ? await getActivePlatformPlans(supabase) : [];
  const currentPlan = platformPlans.find((p) => p.id === community.plan_id) ?? null;
  const planIsLive = community.plan_status === "active" || community.plan_status === "trialing";
  const canCharge = Boolean(planIsLive && currentPlan?.features.includes("paid_memberships"));

  // Feature marketplace (owner-only): available packs + which this community has
  // actively installed.
  const featurePacks = isOwner ? await getActiveFeaturePacks(supabase) : [];
  const communityAddons = isOwner ? await getCommunityAddons(supabase, community.id) : [];
  const installedPackIds = communityAddons
    .filter((a) => a.status === "active" || a.status === "trialing")
    .map((a) => a.pack_id);

  // Membership tiers (owner-only section, shown once payments are connected).
  // Public spaces are always free, so they can't be assigned to a tier.
  const tiers = isOwner && canCharge ? await getCommunityTiers(supabase, community.id) : [];
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

  // Sections shown in the sticky jump-nav, in page order. Owner-only sections
  // are appended only when they actually render below, so a chip never points
  // at a missing anchor.
  const sections: AdminNavSection[] = [
    { id: "overview", label: "Overview" },
    { id: "members", label: "Members" },
    { id: "details", label: "Details" },
    { id: "guidelines", label: "Guidelines" },
    { id: "contact", label: "Contact" },
    { id: "public-access", label: "Public access" },
    { id: "spaces", label: "Spaces" },
    { id: "profile-fields", label: "Profile fields" },
    { id: "sidebar-links", label: "Sidebar links" },
    { id: "more", label: "More" },
  ];
  if (isOwner && featureControls.length > 0) sections.push({ id: "features", label: "Features" });
  if (isOwner) {
    sections.push(
      { id: "plan", label: "Plan" },
      { id: "marketplace", label: "Marketplace" },
      { id: "payments", label: "Payments" },
      { id: "tiers", label: "Tiers" },
      { id: "domain", label: "Custom domain" },
      { id: "danger", label: "Danger zone" },
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <AdminSectionNav sections={sections} />

      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Admin</h1>
      <p className="mb-8 text-sm text-muted-foreground">Manage {community.name}.</p>

      <div id="overview" className="mb-8 grid scroll-mt-20 grid-cols-2 gap-4 sm:grid-cols-4">
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

      <h2 id="members" className="mb-3 scroll-mt-20 text-sm font-medium uppercase tracking-wide text-muted-foreground">Members</h2>
      {(memberSeats !== null || adminSeats !== null) && (
        <p className={`mb-3 text-sm ${memberSeats === 0 || adminSeats === 0 ? "text-danger" : "text-muted-foreground"}`}>
          {memberSeats !== null && (
            <>
              <span className="font-medium text-foreground">
                {capacity.memberCount} of {capacity.memberLimit}
              </span>{" "}
              members used
              {memberSeats === 0
                ? " — this community can't take new members until its plan changes."
                : ` (${memberSeats} left)`}
              .{" "}
            </>
          )}
          {adminSeats !== null && (
            <>
              {capacity.adminCount} of {capacity.adminLimit} admin{capacity.adminLimit === 1 ? "" : "s"} used
              {adminSeats === 0 ? " — add a Moderator instead, or upgrade for another admin" : ""}.{" "}
            </>
          )}
          <Link href={`/pricing?community=${encodeURIComponent(community.slug)}`} className="text-accent underline">
            See plans
          </Link>
        </p>
      )}
      <div className="mb-8 space-y-4">
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
          />
        </div>
      )}
      <div className="mb-8">
        <NewSpaceForm communityId={community.id} communitySlug={community.slug} allowedTypes={allowedTypes} />
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
    </div>
  );
}
