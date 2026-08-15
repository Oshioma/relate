import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Layers, CalendarDays, BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import type { Community } from "@/types/database";

// How many public communities the showcase strip considers, and how many of
// them it renders.
const SHOWCASE_POOL = 12;
const SHOWCASE_COUNT = 6;

// How much a community has to show on a card. The card renders a logo, a name
// and a description, so a description counts for most (it's the only line of
// copy) and a logo for the rest — together they're a decent proxy for "someone
// actually set this community up". Array.sort is stable, so communities that
// tie keep the newest-first order the query already applied.
function showcaseRank(community: Community): number {
  return (community.description?.trim() ? 2 : 0) + (community.logo_url ? 1 : 0);
}

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  // The showcase strip. Ordered newest-first because it used to be
  // oldest-first with a limit of 3, which pinned the strip to the same three
  // communities forever — a community created today could never appear on the
  // platform's own front door, no matter how public it was.
  //
  // Newest-first on its own would happily feature three empty shells created
  // minutes ago, so over-fetch a small pool and prefer the ones with something
  // to show (see showcaseRank).
  const { data: recentPublic } = await supabase
    .from("communities")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(SHOWCASE_POOL);

  const featuredCommunities = [...(recentPublic ?? [])]
    .sort((a, b) => showcaseRank(b) - showcaseRank(a))
    .slice(0, SHOWCASE_COUNT);

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

        {featuredCommunities.length > 0 && (
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
        <Avatar src={community.logo_url} name={community.name} size={56} className="mb-3" />
        <h3 className="text-sm font-semibold text-foreground">{community.name}</h3>
        {community.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{community.description}</p>}
      </CardContent>
    </Card>
  );
}
