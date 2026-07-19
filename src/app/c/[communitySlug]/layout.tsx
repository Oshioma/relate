import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LayoutGrid, Layers, CalendarDays, BookOpen, Users, Shield, ArrowLeft, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getUnreadNotificationCount } from "@/lib/data/notifications";
import { getUnreadMessageCount } from "@/lib/data/messages";
import { Avatar } from "@/components/ui/avatar";
import { NavLink } from "@/components/layout/nav-link";
import { LogoutButton } from "@/components/layout/logout-button";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { NotificationsNavLink, NotificationsIconLink } from "@/components/layout/notification-bell";
import { MessagesNavLink, MessagesIconLink } from "@/components/layout/messages-bell";

export default async function CommunityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  if (!user) {
    redirect(`/login?next=/c/${communitySlug}`);
  }

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) {
    notFound();
  }

  const [profile, membership, unreadCount, unreadMessageCount, spaces] = await Promise.all([
    getProfile(supabase, user.id),
    getMembership(supabase, community.id, user.id),
    getUnreadNotificationCount(supabase, user.id),
    getUnreadMessageCount(supabase, user.id),
    getCommunitySpaces(supabase, community.id),
  ]);

  if (!membership && !community.is_public) {
    notFound();
  }

  if (membership?.status === "banned") {
    notFound();
  }

  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  const base = `/c/${community.slug}`;
  const navSpaces = spaces.filter((space) => space.show_in_nav);

  const navItems = [
    { href: base, label: "Overview", icon: <LayoutGrid className="h-4 w-4" /> },
    ...navSpaces.map((space) => ({
      href: `${base}/spaces/${space.slug}`,
      label: space.name,
      icon: <Layers className="h-4 w-4" />,
    })),
    { href: `${base}/spaces`, label: "All spaces", icon: <LayoutGrid className="h-4 w-4" /> },
    { href: `${base}/events`, label: "Events", icon: <CalendarDays className="h-4 w-4" /> },
    { href: `${base}/resources`, label: "Resources", icon: <BookOpen className="h-4 w-4" /> },
    { href: `${base}/members`, label: "Members", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            All communities
          </Link>
          <div className="mt-3 flex items-center gap-2.5">
            <Avatar src={community.logo_url} name={community.name} size={32} />
            <span className="truncate text-sm font-semibold text-foreground">{community.name}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                exact={item.href === base || item.href === `${base}/spaces`}
              >
                {item.label}
              </NavLink>
            ))}
            {isStaff && (
              <NavLink href={`${base}/admin`} icon={<Shield className="h-4 w-4" />}>
                Admin
              </NavLink>
            )}
            <NotificationsNavLink count={unreadCount} />
            <MessagesNavLink count={unreadMessageCount} />
          </div>
        </div>

        <div className="border-t border-border p-3">
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
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pb-16 md:pb-0">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
          <Link href="/dashboard" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="truncate text-sm font-semibold text-foreground">{community.name}</span>
          <div className="flex items-center gap-4">
            <NotificationsIconLink count={unreadCount} />
            <MessagesIconLink count={unreadMessageCount} />
            <Link href="/settings">
              <Avatar src={profile?.avatar_url} name={profile?.full_name || profile?.username} size={28} />
            </Link>
          </div>
        </header>

        <main className="flex-1">
          {!membership && (
            <div className="border-b border-border bg-accent-soft px-4 py-2.5 text-center text-sm text-accent">
              You&apos;re viewing {community.name} as a guest. Join to post and see member-only spaces.
            </div>
          )}
          {children}
        </main>
      </div>

      <MobileTabBar
        tabs={[
          { href: base, label: "Overview", icon: <LayoutGrid className="h-5 w-5" />, exact: true },
          { href: `${base}/spaces`, label: "Spaces", icon: <LayoutGrid className="h-5 w-5" /> },
          { href: `${base}/events`, label: "Events", icon: <CalendarDays className="h-5 w-5" /> },
          { href: `${base}/resources`, label: "Resources", icon: <BookOpen className="h-5 w-5" /> },
          { href: `${base}/members`, label: "Members", icon: <Users className="h-5 w-5" /> },
        ]}
      />
    </div>
  );
}
