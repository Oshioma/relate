import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getUserCommunities } from "@/lib/data/community";
import { getUnreadNotificationCount } from "@/lib/data/notifications";
import { Avatar } from "@/components/ui/avatar";
import { NavLink } from "@/components/layout/nav-link";
import { LogoutButton } from "@/components/layout/logout-button";
import { NotificationsNavLink, NotificationsIconLink } from "@/components/layout/notification-bell";
import { LayoutGrid, Settings, Plus } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const [profile, communities, unreadCount] = await Promise.all([
    getProfile(supabase, user.id),
    getUserCommunities(supabase, user.id),
    getUnreadNotificationCount(supabase, user.id),
  ]);

  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border px-5 py-5">
          <Link href="/dashboard" className="text-base font-semibold tracking-tight text-foreground">
            Relate
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLink href="/dashboard" icon={<LayoutGrid className="h-4 w-4" />} exact>
            Your communities
          </NavLink>
          <NavLink href="/communities/new" icon={<Plus className="h-4 w-4" />}>
            New community
          </NavLink>
          <NotificationsNavLink count={unreadCount} />

          {communities.length > 0 && (
            <div className="mt-5">
              <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Communities
              </p>
              <div className="space-y-1">
                {communities.map((community) => (
                  <NavLink key={community.id} href={`/c/${community.slug}`} icon={<Avatar src={community.logo_url} name={community.name} size={20} />}>
                    {community.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
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

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
          <Link href="/dashboard" className="text-base font-semibold tracking-tight text-foreground">
            Relate
          </Link>
          <div className="flex items-center gap-4">
            <NotificationsIconLink count={unreadCount} />
            <Link href="/settings">
              <Avatar src={profile?.avatar_url} name={profile?.full_name || profile?.username} size={30} />
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
