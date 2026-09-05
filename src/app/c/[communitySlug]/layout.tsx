import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LayoutGrid, Layers, CalendarDays, Users, Shield, BadgeCheck, ArrowLeft, Settings, ExternalLink, Search, Tag, Gem, BookOpen, Mail, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import {
  getCommunityBySlug,
  getMembership,
  canViewMembers,
  isCommunityAdmin,
  isCommunityMember,
} from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityNavLinks } from "@/lib/data/nav-links";
import { getCommunityNavItemOrder } from "@/lib/data/nav-order";
import { getCommunityFeaturedBusinessCategories, getCommunityBusinessCustomCategories, getCommunityBusinessCategoryLabelOverrides } from "@/lib/data/businesses";
import { getCommunityFeatures } from "@/lib/data/features";
import { getCommunityLiveSession } from "@/lib/data/live-events";
import { countActiveTiers } from "@/lib/data/tiers";
import { defaultNavItemSort } from "@/lib/nav-items";
import { homeLabelForCommunity } from "@/lib/community-templates";
import { NAV_GROUPS, isNavGroup, type NavGroup } from "@/lib/nav-groups";
import { businessCategoryPluralLabel } from "@/lib/business-categories";
import { getNotifications, getUnreadNotificationCount } from "@/lib/data/notifications";
import { getConversations, getUnreadMessageCount } from "@/lib/data/messages";
import { countUnhandledCommunityContactMessages } from "@/lib/data/contact-messages";
import { Avatar } from "@/components/ui/avatar";
import { NavLink } from "@/components/layout/nav-link";
import { LogoutButton } from "@/components/layout/logout-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NotificationsPopover } from "@/components/layout/notifications-popover";
import { MessagesPopover } from "@/components/layout/messages-popover";
import { TimezoneSync } from "@/components/layout/timezone-sync";
import { LiveSessionWatcher } from "@/components/layout/live-session-watcher";
import { communityAccentStyle } from "@/lib/accent-color";
import { CommunityJoinCta } from "./community-join-cta";
import { PlanLapseBanner } from "@/components/community/plan-lapse-banner";
import { getPlanLapseNotice } from "@/lib/data/plan-limits";

// The snippet a search engine shows under the result, and the text on a
// social-share card, both come from the page's meta description. Without one,
// every community page inherited the root layout's generic line — and because
// that line says nothing about this particular community, Google discards it
// and scrapes visible page text instead, which is often a business listing
// ("Kendwa Rocks…") rather than anything about the community. So give each
// community its own description: the owner's own community.description when
// set, otherwise a name-based fallback that's still community-specific.
// Trimmed to ~160 chars (a word boundary) to stay within what search results
// display without truncating mid-word.
function communityMetaDescription(community: { name: string; description: string | null }): string {
  const own = community.description?.trim();
  if (own) {
    if (own.length <= 160) return own;
    const clipped = own.slice(0, 160);
    const lastSpace = clipped.lastIndexOf(" ");
    return `${(lastSpace > 100 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
  }
  return `${community.name} on Relate — its feed, spaces, events, members and local businesses, all in one place.`;
}

// Give each community its own tab title and meta description. `default` shows
// the community name on the community's own pages; the template lets any child
// page that sets a title render as "Page · Community" without repeating the
// community name everywhere. The description is inherited by every child page
// that doesn't set its own, so the whole community reads correctly in search.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}): Promise<Metadata> {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return {};
  const description = communityMetaDescription(community);
  // Only an absolute URL is safe here: a relative image path with no
  // metadataBase configured makes the build error out. Cover images are
  // Supabase public URLs (absolute), but guard anyway so an odd value degrades
  // to no OG image rather than a build failure.
  const cover = community.cover_image_url;
  const ogImage = cover && /^https?:\/\//i.test(cover) ? [cover] : undefined;
  return {
    title: { default: community.name, template: `%s · ${community.name}` },
    description,
    openGraph: {
      title: community.name,
      description,
      ...(ogImage ? { images: ogImage } : {}),
    },
  };
}

export default async function CommunityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  // Signed-out visitors are allowed here (the proxy lets public community
  // routes through). They get a read-only guest view: public spaces, events
  // and search, with "log in" prompts in place of the member chrome.
  const user = await getCurrentUser(supabase);

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) {
    // getCommunityBySlug resolves public and private communities for anyone
    // ("visible in search"), plus invite_only ones for their owner/members.
    // A null here is a non-member hitting an invite_only community ("Hidden")
    // or a bad slug — notFound is the right, non-revealing answer for both.
    // A private community DOES resolve here: the shell renders with only its
    // public spaces in the nav (space RLS), and the members-only feed is gated
    // in the page below.
    notFound();
  }

  // Community-scoped nav data everyone needs; RLS narrows `spaces` to the
  // public ones for a guest.
  const [spaces, navLinks, navItemOrder, featuredCategories, customCategories, labelOverrides, features, activeTierCount, liveSession] = await Promise.all([
    getCommunitySpaces(supabase, community.id),
    getCommunityNavLinks(supabase, community.id),
    getCommunityNavItemOrder(supabase, community.id),
    getCommunityFeaturedBusinessCategories(supabase, community.id),
    getCommunityBusinessCustomCategories(supabase, community.id),
    getCommunityBusinessCategoryLabelOverrides(supabase, community.id),
    getCommunityFeatures(supabase, community.id),
    countActiveTiers(supabase, community.id),
    getCommunityLiveSession(supabase, community.id),
  ]);

  // Personal chrome (profile, membership, notifications, messages) only exists
  // for a signed-in visitor.
  const personal = user
    ? await Promise.all([
        getProfile(supabase, user.id),
        getMembership(supabase, community.id, user.id),
        getUnreadNotificationCount(supabase, user.id),
        getUnreadMessageCount(supabase, user.id),
        getNotifications(supabase, user.id, 6),
        getConversations(supabase, user.id),
      ])
    : null;

  const profile = personal?.[0] ?? null;
  const membership = personal?.[1] ?? null;
  const unreadCount = personal?.[2] ?? 0;
  const unreadMessageCount = personal?.[3] ?? 0;
  const recentNotifications = personal?.[4] ?? [];
  const conversations = personal?.[5] ?? [];

  if (membership?.status === "banned") {
    notFound();
  }

  // Owner-aware: a community's owner is staff whether or not their membership
  // row says so. Reading only the row is what put an owner outside their own
  // community — no Admin link here, and the guest banner below — with nothing
  // on screen offering a way back in.
  const isStaff = isCommunityAdmin(community, membership, user?.id);
  const isMember = isCommunityMember(community, membership, user?.id);
  // Contact-form messages waiting on staff. Only staff can read them (RLS says
  // so too), so only staff pay for the count query.
  const openInboxCount = isStaff ? await countUnhandledCommunityContactMessages(supabase, community.id) : 0;
  // Only staff see a billing problem, and only when there is one — this is null
  // for every community on a live plan, which is nearly all of them.
  const planLapse = isStaff ? await getPlanLapseNotice(supabase, community) : null;
  // Members is login-gated regardless of visibility (the page itself requires
  // a signed-in user), then further narrowed by the community's setting.
  const showMembersLink = Boolean(user) && canViewMembers(community, membership, user?.id);
  const base = `/c/${community.slug}`;
  const navSpaces = spaces.filter((space) => space.show_in_nav);
  // Guests only get the Events link when the community has opted its events
  // into public view; signed-in visitors always do.
  const canSeeEvents = Boolean(user) || community.events_public;

  // The sidebar interleaves spaces with the built-in feature links (Events,
  // Search): each is an "orderable unit" with a sort key. Spaces use their own
  // sort_order; a built-in link uses its saved position, or a large default
  // (defaultNavItemSort) that keeps it after the spaces until an admin drags
  // it. Feed stays pinned at the top and isn't part of the ordering.
  // A unit also carries the sidebar section it belongs to, if any. Grouping is
  // opt-in: when nothing in the community has a group, every unit's group is
  // null and the nav renders as the flat list it always was. See
  // src/lib/nav-groups.ts for the three rules this follows.
  type NavUnit = {
    sort: number;
    group: NavGroup | null;
    items: { href: string; label: string; icon: React.ReactNode; sub?: boolean }[];
  };

  const orderedUnits: NavUnit[] = [
    // Featured business categories render as indented sub-links right under
    // their directory space, deep-linking to the pre-filtered directory — so
    // they travel with their space as one unit.
    ...navSpaces.map((space) => ({
      sort: space.sort_order,
      group: isNavGroup(space.nav_group) ? space.nav_group : null,
      items: [
        {
          href: `${base}/spaces/${space.slug}`,
          label: space.name,
          icon: <Layers className="h-4 w-4" />,
        },
        ...featuredCategories
          .filter((f) => f.space_id === space.id)
          .map((f) => ({
            href: `${base}/spaces/${space.slug}?category=${f.category}`,
            label: businessCategoryPluralLabel(f.category, customCategories, labelOverrides.filter((o) => o.space_id === space.id)),
            icon: <Tag className="h-3.5 w-3.5" />,
            sub: true,
          })),
      ],
    })),
    // The built-in links have no group column of their own — there is no row to
    // put one on — so they take the section their purpose implies. Events is
    // people meeting; Search reaches the whole community, so it belongs with
    // the front page rather than under one section of it. Both keep their
    // admin-set sort position within that section.
    ...(features.events && canSeeEvents && navItemOrder.events?.showInNav !== false
      ? [{ sort: navItemOrder.events?.sortOrder ?? defaultNavItemSort("events"), group: "connect" as NavGroup, items: [{ href: `${base}/events`, label: "Events", icon: <CalendarDays className="h-4 w-4" /> }] }]
      : []),
    ...(features.concierge && navItemOrder.concierge?.showInNav !== false
      ? [{ sort: navItemOrder.concierge?.sortOrder ?? defaultNavItemSort("concierge"), group: "home" as NavGroup, items: [{ href: `${base}/concierge`, label: "Search", icon: <Search className="h-4 w-4" /> }] }]
      : []),
  ].sort((a, b) => a.sort - b.sort);

  // Surface the Membership/join link only when the community actually offers a
  // (non-archived) tier — otherwise it's noise.
  const showMembershipLink = activeTierCount > 0;

  // "Feed" everywhere except a school, where it is "Today". Label only — the
  // route stays /c/<slug>.
  const homeLabel = homeLabelForCommunity(community.school_kind);

  const navItems = [
    { href: base, label: homeLabel, icon: <LayoutGrid className="h-4 w-4" /> },
    ...(showMembershipLink ? [{ href: `${base}/membership`, label: "Membership", icon: <Gem className="h-4 w-4" /> }] : []),
    ...orderedUnits.flatMap((unit) => unit.items),
  ];

  // The sections actually in use. Empty when nothing in this community has been
  // grouped, which is the signal to render the flat list — a single heading
  // over the whole nav labels nothing.
  const usedGroups = NAV_GROUPS.filter((group) =>
    orderedUnits.some((unit) => unit.group === group.key)
  );
  // Ungrouped units fall to the end, in their own order, with no heading. A
  // space that has not been filed yet must still be reachable.
  const ungroupedUnits = orderedUnits.filter((unit) => unit.group === null);

  // Today/Feed and Membership sit above every section: they are the way in and
  // the way to join, not one topic among several.
  const pinnedItems = [
    { href: base, label: homeLabel, icon: <LayoutGrid className="h-4 w-4" /> },
    ...(showMembershipLink ? [{ href: `${base}/membership`, label: "Membership", icon: <Gem className="h-4 w-4" /> }] : []),
  ];

  // A community that has chosen its own accent re-points the accent tokens for
  // everything inside its shell (see globals.css).
  const accentStyle = communityAccentStyle(community.accent_color);

  return (
    <div
      className="min-h-screen bg-background md:flex"
      style={accentStyle}
      {...(accentStyle ? { "data-community-accent": "" } : {})}
    >
      {/* Watches for a session going live / ending and refreshes the header
          badge instantly. Outside the signed-in gate so guests on a public
          live space see it too. */}
      <LiveSessionWatcher communityId={community.id} />

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        {/* Sidebar header: the logo on the plain card background. The cover
            photo was tried here and pulled back out — a tinted crop behind a
            logo made the sidebar compete with the hero rather than support it,
            and no tint reads well behind every possible logo. The cover earns
            its place on the feed header, where it's large enough to be the
            photograph it is. */}
        <div className="border-b border-border px-5 py-5">
          {/* The logo is the way home, the way every site's masthead works —
              it goes to the community feed from anywhere inside the community. */}
          <Link href={base} className="flex flex-col items-center text-center">
            <Avatar src={community.logo_url} name={community.name} initials={community.logo_initials} size={140} />
            <span className="mt-3 truncate text-lg font-semibold text-foreground transition-colors hover:text-accent">
              {community.name}
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {usedGroups.length === 0 ? (
            // Nothing grouped in this community: the nav it has always had.
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  exact={item.href === base}
                  className={"sub" in item && item.sub ? "pl-9 py-1.5 text-sm" : undefined}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {pinnedItems.map((item) => (
                <NavLink key={item.href} href={item.href} icon={item.icon} exact={item.href === base}>
                  {item.label}
                </NavLink>
              ))}

              {usedGroups.map((group) => (
                <div key={group.key} className="pt-4">
                  <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {group.label}
                  </p>
                  {orderedUnits
                    .filter((unit) => unit.group === group.key)
                    .flatMap((unit) => unit.items)
                    .map((item) => (
                      <NavLink
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        className={item.sub ? "pl-9 py-1.5 text-sm" : undefined}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                </div>
              ))}

              {ungroupedUnits.length > 0 && (
                // No heading: these have not been filed, and inventing a name
                // for "the rest" would look like a section somebody chose.
                <div className="space-y-1 pt-4">
                  {ungroupedUnits
                    .flatMap((unit) => unit.items)
                    .map((item) => (
                      <NavLink
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        className={item.sub ? "pl-9 py-1.5 text-sm" : undefined}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 space-y-1 border-t border-border pt-4">
            {community.guidelines && (
              <NavLink href={`${base}/guidelines`} icon={<BookOpen className="h-4 w-4" />}>
                Community guidelines
              </NavLink>
            )}
            <NavLink href={`${base}/contact`} icon={<Mail className="h-4 w-4" />}>
              Contact
            </NavLink>
            {navLinks.length > 0 && (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="truncate">{link.label}</span>
                  </a>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="border-t border-border p-3">
          {user ? (
            <>
              <Link href="/settings" className="flex items-center gap-2.5 rounded-md px-3 py-2 hover:bg-muted">
                <Avatar src={profile?.avatar_url} name={profile?.full_name || profile?.username} size={32} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {profile?.full_name || profile?.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">@{profile?.username}</p>
                </div>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <div className="space-y-2 px-1 py-1">
              <p className="px-2 text-xs text-muted-foreground">
                Browsing {community.name} as a guest.
              </p>
              <Link
                href={`/login?next=${encodeURIComponent(base)}`}
                className="flex w-full items-center justify-center rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
              >
                Log in
              </Link>
              <Link
                href={`/signup?next=${encodeURIComponent(base)}`}
                className="flex w-full items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pb-16 md:pb-0">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6">
          {/* The left of the header is deliberately not part of the cluster on
              the right: everything on the right is what a community owner sees,
              so a super admin browsing a community sees the same header they
              do, with their own platform link kept out of it. On desktop this
              group is empty for everyone else, and justify-between still puts
              the cluster at the far end. */}
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/dashboard" className="shrink-0 text-muted-foreground md:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="truncate text-sm font-semibold text-foreground md:hidden">{community.name}</span>
            {profile?.is_super_admin && (
              <Link
                href="/platform-admin"
                title="Super admin"
                className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <BadgeCheck className="h-5 w-5" />
                <span className="hidden sm:inline">Super Admin</span>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* When a session is live anywhere in the community, a pulsing badge
                in the header makes it impossible to miss and jumps straight into
                the room. Shown to anyone who can see the session (RLS-scoped). */}
            {liveSession && (
              <Link
                href={`${base}/spaces/${liveSession.spaceSlug}`}
                title={`${liveSession.title} is live now — join`}
                className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-danger-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                </span>
                Live now!
              </Link>
            )}
            {isStaff && (
              <Link
                href={`${base}/inbox`}
                title="Community inbox"
                className="relative flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Inbox className="h-5 w-5" />
                <span className="hidden sm:inline">Inbox</span>
                {openInboxCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground sm:static sm:h-auto sm:min-w-0 sm:rounded-full sm:px-1.5 sm:py-0.5">
                    {openInboxCount > 99 ? "99+" : openInboxCount}
                  </span>
                )}
              </Link>
            )}
            {isStaff && (
              <Link
                href={`${base}/admin`}
                title="Community admin"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Shield className="h-5 w-5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            {showMembersLink && (
              <Link href={`${base}/members`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Members
              </Link>
            )}
            <Link href={`${base}/spaces`} aria-label="Spaces" className="text-muted-foreground hover:text-foreground">
              <LayoutGrid className="h-5 w-5" />
            </Link>
            {user ? (
              <>
                <TimezoneSync current={profile?.timezone ?? null} />
                <NotificationsPopover userId={user.id} notifications={recentNotifications} unreadCount={unreadCount} />
                <MessagesPopover conversations={conversations.slice(0, 5)} unreadCount={unreadMessageCount} />
                <Link href="/settings" aria-label="Settings" className="text-muted-foreground hover:text-foreground">
                  <Settings className="h-5 w-5" />
                </Link>
              </>
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(base)}`}
                className="text-sm font-medium text-accent hover:underline"
              >
                Log in
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1">
          {!user ? (
            <div className="border-b border-border bg-accent-soft px-4 py-2.5 text-center text-sm text-accent">
              You&apos;re viewing the public parts of {community.name}.{" "}
              <Link href={`/login?next=${encodeURIComponent(base)}`} className="font-medium underline">
                Log in
              </Link>{" "}
              or{" "}
              <Link href={`/signup?next=${encodeURIComponent(base)}`} className="font-medium underline">
                sign up
              </Link>{" "}
              to post, review and join.
            </div>
          ) : !isMember ? (
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-b border-border bg-accent-soft px-4 py-2.5 text-center text-sm text-accent">
              <span>
                You&apos;re viewing {community.name} as a guest.{" "}
                {community.privacy === "public"
                  ? "Join to post and see member-only spaces."
                  : community.privacy === "private"
                    ? membership?.status === "requested"
                      ? "An admin is reviewing your request to join."
                      : "Ask to join to post and see member-only spaces."
                    : "Ask an admin for an invite to post and see member-only spaces."}
              </span>
              <CommunityJoinCta
                communityId={community.id}
                privacy={community.privacy}
                membershipStatus={membership?.status ?? null}
                size="sm"
              />
            </div>
          ) : null}
          {planLapse && (
            <PlanLapseBanner notice={planLapse} communityName={community.name} communitySlug={community.slug} />
          )}
          {children}
        </main>
      </div>

      {/* Mobile navigation: a compact bottom bar of primary destinations plus a
          Menu button that opens a slide-out drawer with the full nav tree — the
          same spaces, featured categories and links the desktop sidebar shows,
          which is otherwise `hidden md:flex` and unreachable on a phone. */}
      <MobileNav
        communityName={community.name}
        communityLogoUrl={community.logo_url}
        communityInitials={community.logo_initials}
        communityHref={base}
        tabs={[
          { href: base, label: homeLabel, icon: <LayoutGrid className="h-5 w-5" />, exact: true },
          { href: `${base}/spaces`, label: "Spaces", icon: <Layers className="h-5 w-5" /> },
          ...(features.events && canSeeEvents && navItemOrder.events?.showInNav !== false ? [{ href: `${base}/events`, label: "Events", icon: <CalendarDays className="h-5 w-5" /> }] : []),
          ...(features.concierge && navItemOrder.concierge?.showInNav !== false ? [{ href: `${base}/concierge`, label: "Search", icon: <Search className="h-5 w-5" /> }] : []),
        ]}
        items={[
          { href: base, label: homeLabel, icon: <LayoutGrid className="h-4 w-4" />, exact: true },
          ...(showMembershipLink ? [{ href: `${base}/membership`, label: "Membership", icon: <Gem className="h-4 w-4" /> }] : []),
          // The drawer shows the same sections as the sidebar. The heading
          // rides on the first item of each, so the drawer's search can keep
          // filtering one flat list — see MobileNavItem.heading.
          ...usedGroups.flatMap((group) =>
            orderedUnits
              .filter((unit) => unit.group === group.key)
              .flatMap((unit) => unit.items)
              .map((item, index) => (index === 0 ? { ...item, heading: group.label } : item))
          ),
          ...(usedGroups.length === 0
            ? orderedUnits.flatMap((unit) => unit.items)
            : ungroupedUnits.flatMap((unit) => unit.items)),
          ...(showMembersLink ? [{ href: `${base}/members`, label: "Members", icon: <Users className="h-4 w-4" /> }] : []),
          ...(community.guidelines ? [{ href: `${base}/guidelines`, label: "Community guidelines", icon: <BookOpen className="h-4 w-4" /> }] : []),
          { href: `${base}/contact`, label: "Contact", icon: <Mail className="h-4 w-4" /> },
        ]}
        links={navLinks.map((link) => ({ id: link.id, label: link.label, url: link.url }))}
        account={
          user
            ? {
                kind: "user",
                name: profile?.full_name || profile?.username || "You",
                username: profile?.username ?? null,
                avatarUrl: profile?.avatar_url ?? null,
              }
            : {
                kind: "guest",
                loginHref: `/login?next=${encodeURIComponent(base)}`,
                signupHref: `/signup?next=${encodeURIComponent(base)}`,
              }
        }
      />
    </div>
  );
}
