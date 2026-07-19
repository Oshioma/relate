import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Layers, CalendarDays, BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import type { Community } from "@/types/database";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const { data: featuredCommunities } = await supabase
    .from("communities")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: true })
    .limit(3);

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight">Relate</span>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <LinkButton href="/signup" size="sm">
            Create account
          </LinkButton>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-3xl px-6 pb-16 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            Built for community hosts
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            A calm, private home for your community.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Whether you run a networking group, mastermind, co-working space,
            membership, or local community, Relate helps your audience connect
            like never before — creating stronger relationships that keep
            people coming back.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <LinkButton href="/signup" size="lg">
              Get started
            </LinkButton>
            <LinkButton href="/login" size="lg" variant="secondary">
              Sign in
            </LinkButton>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Spend less time managing your community and more time growing it.
          </p>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Turn members into a thriving community.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
            Communities grow because people build relationships. Relate helps
            community hosts make those connections happen.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<Layers className="h-5 w-5" />}
              title="Spaces"
              description="Organize discussions, announcements, and resources into focused spaces."
            />
            <Feature
              icon={<Users className="h-5 w-5" />}
              title="Members"
              description="Every community keeps its own members, roles, and permissions."
            />
            <Feature
              icon={<CalendarDays className="h-5 w-5" />}
              title="Events"
              description="Plan calls, meetups, and gatherings your members won't miss."
            />
            <Feature
              icon={<BookOpen className="h-5 w-5" />}
              title="Resources"
              description="Keep the links, files, and guides your community relies on close at hand."
            />
          </div>
        </section>

        {featuredCommunities && featuredCommunities.length > 0 && (
          <section className="mx-auto max-w-5xl px-6 pb-24">
            <h2 className="text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
              A few communities already at home here
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {featuredCommunities.map((community) => (
                <CommunityPreview key={community.id} community={community} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        Relate — built for quiet, focused communities.
      </footer>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function CommunityPreview({ community }: { community: Community }) {
  return (
    <Card className="text-left">
      <CardContent className="pt-6">
        <Avatar src={community.logo_url} name={community.name} size={36} className="mb-3" />
        <h3 className="text-sm font-semibold text-foreground">{community.name}</h3>
        {community.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{community.description}</p>}
      </CardContent>
    </Card>
  );
}
