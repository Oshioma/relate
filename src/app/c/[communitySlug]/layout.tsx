import Link from "next/link";
import { notFound } from "next/navigation";
import { LayoutGrid, Layers, CalendarDays, Users, Shield, BadgeCheck, ArrowLeft, Settings, ExternalLink, Search, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityNavLinks } from "@/lib/data/nav-links";
import { getCommunityNavItemOrder } from "@/lib/data/nav-order";
import { getCommunityFeaturedBusinessCategories, getCommunityBusinessCustomCategories } from "@/lib/data/businesses";
import { getCommunityFeatures } from "@/lib/data/features";
import { defaultNavItemSort } from "@/lib/nav-items";
import { businessCategoryPluralLabel } from "@/lib/business-categories";
import { getNotifications, getUnreadNotificationCount } from "@/lib/data/notifications";
import { getConversations, getUnreadMessageCount } from "@/lib/data/messages";
import { Avatar } from "@/components/ui/avatar";
import { NavLink } from "@/components/layout/nav-link";
import { LogoutButton } from "@/components/layout/logout-button";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { NotificationsPopover } from "@/components/layout/notifications-popover";
import { MessagesPopover } from "@/components/layout/messages-popover";

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
    // For a guest, getCommunityBySlug only ever resolves public communities
    // (RLS), so a null here is either a private community or a bad slug —
    // notFound is the right, non-revealing answer in both cases.
    notFound();
  }

  // Community-scoped nav data everyone needs; RLS narrows `spaces` to the
  // public ones for a guest.
  const [spaces, navLinks, navItemOrder, featuredCategories, customCategories, features] = await Promise.all([
    getCommunitySpaces(supabase, community.id),
    getCommunityNavLinks(supabase, community.id),
    getCommunityNavItemOrder(supabase, community.id),
    getCommunityFeaturedBusinessCategories(supabase, community.id),
    getCommunityBusinessCustomCategories(supabase, community.id),
    getCommunityFeatures(supabase, community.id),
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

  if (user && !membership && !community.is_public) {
    notFound();
  }

  if (membership?.status === "banned") {
    notFound();
  }

  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  const base = `/c/${community.slug}`;
  const navSpaces = spaces.filter((space) => space.show_in_nav);

  // The sidebar interleaves spaces with the built-in feature links (Events,
  // Search): each is an "orderable unit" with a sort key. Spaces use their own
  // sort_order; a built-in link uses its saved position, or a large default
  // (defaultNavItemSort) that keeps it after the spaces until an admin drags
  // it. Feed stays pinned at the top and isn't part of the ordering.
  type NavUnit = { sort: number; items: { href: string; label: string; icon: React.ReactNode; sub?: boolean }[] };

  const orderedUnits: NavUnit[] = [
    // Featured business categories render as indented sub-links right under
    // their directory space, deep-linking to the pre-filtered directory — so
    // they travel with their space as one unit.
    ...navSpaces.map((space) => ({
      sort: space.sort_order,
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
            label: businessCategoryPluralLabel(f.category, customCategories),
            icon: <Tag className="h-3.5 w-3.5" />,
            sub: true,
          })),
      ],
    })),
    ...(features.events && navItemOrder.events?.showInNav !== false
      ? [{ sort: navItemOrder.events?.sortOrder ?? defaultNavItemSort("events"), items: [{ href: `${base}/events`, label: "Events", icon: <CalendarDays className="h-4 w-4" /> }] }]
      : []),
    ...(features.concierge && navItemOrder.concierge?.showInNav !== false
      ? [{ sort: navItemOrder.concierge?.sortOrder ?? defaultNavItemSort("concierge"), items: [{ href: `${base}/concierge`, label: "Search", icon: <Search className="h-4 w-4" /> }] }]
      : []),
  ].sort((a, b) => a.sort - b.sort);

  const navItems = [
    { href: base, label: "Feed", icon: <LayoutGrid className="h-4 w-4" /> },
    ...orderedUnits.flatMap((unit) => unit.items),
  ];

  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border px-5 py-5">
          <div className="flex flex-col items-center text-center">
            <Avatar src={community.logo_url} name={community.name} size={140} />
            <span className="mt-3 truncate text-lg font-semibold text-foreground">{community.name}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                exact={item.href === base}
                className={"sub" in item && item.sub ? "pl-9 py-1.5 text-[13px]" : undefined}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {navLinks.length > 0 && (
            <div className="mt-4 space-y-1 border-t border-border pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="truncate">{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border p-3">
          {user ? (
            <>
              <NavLink href={`${base}/members`} icon={<Users className="h-4 w-4" />}>
                Members
              </NavLink>
              <Link href="/settings" className="flex items-center gap-2.5 rounded-md px-3 py-2 hover:bg-muted">
                <Avatar src={profile?.avatar_url} name={profile?.full_name || profile?.username} size={32} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {profile?.full_name || profile?.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">@{profile?.username}</p>
                </div>
              </Link>
              <NavLink href="/settings" icon={<Settings className="h-4 w-4" />}>
                Settings
              </NavLink>
              <Link href="/dashboard" className="flex items-center gap-2.5 rounded-md px-3 py-2 hover:bg-muted">
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">All communities</span>
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
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:justify-end md:px-6">
          <Link href="/dashboard" className="text-muted-foreground md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="truncate text-sm font-semibold text-foreground md:hidden">{community.name}</span>
          <div className="flex items-center gap-4">
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
            {profile?.is_super_admin && (
              <Link
                href="/platform-admin"
                title="Super admin"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <BadgeCheck className="h-5 w-5" />
                <span className="hidden sm:inline">Super Admin</span>
              </Link>
            )}
            <Link href={`${base}/spaces`} aria-label="Spaces" className="text-muted-foreground hover:text-foreground">
              <LayoutGrid className="h-5 w-5" />
            </Link>
            {user ? (
              <>
                <NotificationsPopover notifications={recentNotifications} unreadCount={unreadCount} />
                <MessagesPopover conversations={conversations.slice(0, 5)} unreadCount={unreadMessageCount} />
                <Link href="/settings" className="md:hidden">
                  <Avatar src={profile?.avatar_url} name={profile?.full_name || profile?.username} size={28} />
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
          ) : !membership ? (
            <div className="border-b border-border bg-accent-soft px-4 py-2.5 text-center text-sm text-accent">
              You&apos;re viewing {community.name} as a guest. Join to post and see member-only spaces.
            </div>
          ) : null}
          {children}
        </main>
      </div>

      <MobileTabBar
        tabs={[
          { href: base, label: "Feed", icon: <LayoutGrid className="h-5 w-5" />, exact: true },
          { href: `${base}/spaces`, label: "Spaces", icon: <LayoutGrid className="h-5 w-5" /> },
          ...(features.events && navItemOrder.events?.showInNav !== false ? [{ href: `${base}/events`, label: "Events", icon: <CalendarDays className="h-5 w-5" /> }] : []),
          // Members is login-gated, so only show the tab to signed-in visitors.
          ...(user ? [{ href: `${base}/members`, label: "Members", icon: <Users className="h-5 w-5" /> }] : []),
          ...(features.concierge && navItemOrder.concierge?.showInNav !== false ? [{ href: `${base}/concierge`, label: "Search", icon: <Search className="h-5 w-5" /> }] : []),
        ]}
      />
    </div>
  );
}
