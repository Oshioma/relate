import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { CommunityJoinCta } from "@/app/c/[communitySlug]/community-join-cta";
import type { GuidedJourneyContext } from "@/lib/data/guided-journey";
import { cn } from "@/lib/utils";

export type JourneyTab = "overview" | "mentors" | "requests" | "journeys" | "stories" | "manage";

// The frame every guided-journey sub-page shares: a way back to the space's
// landing page and a small tab row. Wide enough for photo grids, with the
// warm off-white page background the rest of the community uses.
export function JourneyShell({
  ctx,
  active,
  title,
  intro,
  children,
  wide = false,
}: {
  ctx: GuidedJourneyContext;
  active: JourneyTab;
  title?: string;
  intro?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  const { basePath, config } = ctx;
  const tabs: { key: JourneyTab; label: string; href: string; show: boolean }[] = [
    { key: "overview", label: "Overview", href: basePath, show: true },
    { key: "mentors", label: `Find a ${config.terms.mentor}`, href: `${basePath}/mentors`, show: ctx.isMember },
    { key: "requests", label: "Requests", href: `${basePath}/requests`, show: ctx.isMember },
    { key: "journeys", label: "My journeys", href: `${basePath}/journeys`, show: ctx.isMember },
    { key: "stories", label: config.gallery.title, href: `${basePath}/stories`, show: true },
    { key: "manage", label: "Manage", href: `${basePath}/manage`, show: ctx.isStaff },
  ];

  return (
    <div className={cn("mx-auto px-4 pb-16 pt-6 sm:px-6 sm:pt-8", wide ? "max-w-6xl" : "max-w-4xl")}>
      <Link href={basePath} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {config.heroTitle || ctx.space.name}
      </Link>
      <nav aria-label={`${ctx.space.name} sections`} className="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex min-w-max gap-1 border-b border-border">
          {tabs
            .filter((t) => t.show)
            .map((tab) => (
              <li key={tab.key}>
                <Link
                  href={tab.href}
                  aria-current={tab.key === active ? "page" : undefined}
                  className={cn(
                    "inline-block border-b-2 px-3 py-2.5 text-sm font-medium transition",
                    tab.key === active ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
      {(title || intro) && (
        <header className="mb-8 mt-8">
          {title && <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>}
          {intro && <div className="mt-2 max-w-2xl text-base text-muted-foreground">{intro}</div>}
        </header>
      )}
      {!title && !intro && <div className="h-6" />}
      {children}
    </div>
  );
}

// What a guest or non-member sees in place of a members-only step.
export function JourneyGate({ ctx, next }: { ctx: GuidedJourneyContext; next: string }) {
  if (!ctx.userId) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <LogIn className="mx-auto h-8 w-8 text-accent" />
        <h2 className="mt-3 text-xl font-semibold text-foreground">Sign in to get started</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {ctx.config.heroTitle} is for members of {ctx.community.name}. Sign in or create a free account to continue.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <LinkButton href={`/login?next=${encodeURIComponent(next)}`} size="lg" className="rounded-full">
            Sign in
          </LinkButton>
          <LinkButton href={`/signup?next=${encodeURIComponent(next)}`} variant="secondary" size="lg" className="rounded-full">
            Create an account
          </LinkButton>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
      <ShieldCheck className="mx-auto h-8 w-8 text-accent" />
      <h2 className="mt-3 text-xl font-semibold text-foreground">Join {ctx.community.name} first</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Mentoring happens between members, so we know who everyone is. Join the community, then come back here.
      </p>
      <div className="mt-5 flex justify-center">
        <CommunityJoinCta communityId={ctx.community.id} privacy={ctx.community.privacy} membershipStatus={ctx.membership?.status ?? null} size="lg" />
      </div>
    </div>
  );
}

export function SafetyNote({ ctx, className }: { ctx: GuidedJourneyContext; className?: string }) {
  return (
    <aside className={cn("rounded-2xl border border-border bg-muted/60 p-4 text-sm text-muted-foreground", className)}>
      <p className="flex items-start gap-2">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <span>{ctx.config.safety.adviceDisclaimer}</span>
      </p>
    </aside>
  );
}
