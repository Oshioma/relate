import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Layers, CalendarDays, BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

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
        <section className="mx-auto max-w-3xl px-6 pb-20 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            One platform. Many communities.
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            A calm, private home for the communities you belong to.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Spaces, discussions, events, and resources — without the noise of a
            corporate feed. Relate keeps every community you&apos;re part of in
            one clean, quiet place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <LinkButton href="/signup" size="lg">
              Get started
            </LinkButton>
            <LinkButton href="/login" size="lg" variant="secondary">
              Sign in
            </LinkButton>
          </div>
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

        <section className="mx-auto max-w-5xl px-6 pb-24">
          <h2 className="text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
            A few communities already at home here
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <CommunityPreview name="Kushukuru Community" description="A home for the Kushukuru family." />
            <CommunityPreview name="Zanzibar Community" description="Connecting people building in Zanzibar." />
            <CommunityPreview name="Farming Community" description="Growers sharing knowledge and harvests." />
          </div>
        </section>
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

function CommunityPreview({ name, description }: { name: string; description: string }) {
  return (
    <Card className="text-left">
      <CardContent className="pt-6">
        <div className="mb-3 h-9 w-9 rounded-full bg-muted" />
        <h3 className="text-sm font-semibold text-foreground">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
