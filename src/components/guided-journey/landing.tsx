import Link from "next/link";
import { ArrowRight, HeartHandshake, Sprout, Inbox, Clock, Settings2, ShieldCheck } from "lucide-react";
import type { GuidedJourneyContext, JourneySummary, StoryWithPeople } from "@/lib/data/guided-journey";
import type { JourneyBeginnerProfile, JourneyMentorProfile, JourneyTemplate } from "@/types/database";
import { capitalise } from "@/lib/guided-journey/config";
import { JourneyImage } from "./journey-image";
import { Reveal } from "./reveal";
import { ProgressBar } from "./progress";
import { StoryCard } from "./story-card";
import { cn } from "@/lib/utils";

// The front door of a guided-journey space. Written once, worded entirely by
// the space's config — this same page is "Adopt a Beginner" for Nature's
// Gardeners and "Adopt a New Sailor" for a sailing club.
export function GuidedJourneyLanding({
  ctx,
  beginner,
  mentor,
  journeys,
  pendingIncoming,
  pendingOutgoing,
  stories,
  templates,
  justEnded,
}: {
  ctx: GuidedJourneyContext;
  beginner: JourneyBeginnerProfile | null;
  mentor: JourneyMentorProfile | null;
  journeys: JourneySummary[];
  pendingIncoming: number;
  pendingOutgoing: number;
  stories: StoryWithPeople[];
  templates: JourneyTemplate[];
  justEnded: boolean;
}) {
  const { config, basePath } = ctx;
  const active = journeys.filter((j) => j.status === "active");
  const beginnerHref = beginner ? `${basePath}/mentors` : `${basePath}/join/beginner`;
  const mentorHref = mentor ? `${basePath}/requests` : `${basePath}/join/mentor`;
  const hasStatus = active.length > 0 || pendingIncoming > 0 || pendingOutgoing > 0 || Boolean(mentor);

  return (
    <div className="-mx-4 sm:-mx-6">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-accent-soft">
          <div className="grid items-center gap-0 lg:grid-cols-[1.05fr_1fr]">
            <div className="order-2 px-6 py-10 sm:px-10 sm:py-14 lg:order-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{config.category}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{config.heroTitle}</h1>
              <p className="mt-3 text-lg font-medium text-accent">{config.tagline}</p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/80">{config.heroSubtitle}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={beginnerHref}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none"
                >
                  {config.beginnerCard.button}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={mentorHref}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-card px-6 py-3 text-sm font-semibold text-accent transition hover:-translate-y-0.5 hover:border-accent motion-reduce:transform-none"
                >
                  {config.mentorCard.button}
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 lg:h-full">
              <JourneyImage
                src={config.heroImageUrl}
                alt={config.heroImageAlt}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                aspect="aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[26rem]"
                rounded="rounded-none"
              />
            </div>
          </div>
        </div>
      </section>

      {justEnded && (
        <p className="mx-4 mt-6 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground sm:mx-6">
          The journey has been ended. Thank you for the time you spent together — you can start a new one whenever you&apos;re ready.
        </p>
      )}

      {ctx.isStaff && !ctx.settings && (
        <p className="mx-4 mt-6 flex items-center gap-2 rounded-2xl border border-dashed border-accent/40 bg-card px-4 py-3 text-sm text-foreground sm:mx-6">
          <Settings2 className="h-4 w-4 text-accent" />
          This space is using the default wording.{" "}
          <Link href={`${basePath}/manage`} className="font-semibold text-accent underline-offset-2 hover:underline">
            Set it up in Manage
          </Link>
        </p>
      )}

      {/* ── Your status ─────────────────────────────────────────────────── */}
      {hasStatus && (
        <section className="mt-8 px-4 sm:px-6" aria-labelledby="gj-yours">
          <h2 id="gj-yours" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your journeys
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((j) => (
              <Link
                key={j.id}
                href={`${basePath}/journeys/${j.id}`}
                className="group rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md motion-reduce:transform-none"
              >
                <p className="text-xs font-medium text-accent">{j.role === "mentor" ? `You're the ${config.terms.mentor}` : `You're the ${config.terms.beginner}`}</p>
                <p className="mt-1 font-semibold text-foreground">{j.title}</p>
                <ProgressBar done={j.progress.done} total={j.progress.total} className="mt-3" />
              </Link>
            ))}
            {pendingIncoming > 0 && (
              <Link href={`${basePath}/requests`} className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent-soft p-4 transition hover:shadow-md">
                <Inbox className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold text-foreground">
                  {pendingIncoming === 1 ? "1 request waiting for your answer" : `${pendingIncoming} requests waiting for your answer`}
                </span>
              </Link>
            )}
            {pendingOutgoing > 0 && (
              <Link href={`${basePath}/requests`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:shadow-md">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {pendingOutgoing === 1 ? "Your request is waiting for a reply" : `${pendingOutgoing} requests waiting for a reply`}
                </span>
              </Link>
            )}
            {mentor && (
              <Link href={`${basePath}/join/mentor`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:shadow-md">
                <HeartHandshake className="h-5 w-5 text-accent" />
                <span className="text-sm text-foreground">
                  {mentor.is_paused ? `Your ${config.terms.mentor} profile is paused` : `You're listed as a ${config.terms.mentor}`} · Edit
                </span>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── Two ways in ─────────────────────────────────────────────────── */}
      <section className="mt-10 grid gap-4 px-4 sm:grid-cols-2 sm:px-6" aria-label="Choose your path">
        <EntryCard
          href={beginnerHref}
          icon={<Sprout className="h-7 w-7" />}
          title={config.beginnerCard.title}
          description={config.beginnerCard.description}
          button={config.beginnerCard.button}
          tone="solid"
        />
        <EntryCard
          href={mentorHref}
          icon={<HeartHandshake className="h-7 w-7" />}
          title={config.mentorCard.title}
          description={config.mentorCard.description}
          button={config.mentorCard.button}
          tone="soft"
        />
      </section>

      {/* ── Five stages ─────────────────────────────────────────────────── */}
      <section className="mt-16 px-4 sm:px-6" aria-labelledby="gj-how">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="gj-how" className="text-3xl font-semibold tracking-tight text-foreground">
            {config.stagesTitle}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{config.stagesSubtitle}</p>
        </div>
        <ol className="mt-10 space-y-10 sm:space-y-14">
          {config.stages.map((stage, i) => (
            <li key={i}>
              <Reveal>
                <div className="grid items-center gap-5 md:grid-cols-2 md:gap-10">
                  <JourneyImage
                    src={stage.imageUrl}
                    alt={stage.imageAlt}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className={cn("shadow-sm transition duration-500 hover:shadow-lg", i % 2 === 1 && "md:order-2")}
                  />
                  <div className={cn("md:px-4", i % 2 === 1 && "md:order-1")}>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {i + 1}
                    </span>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{stage.title}</h3>
                    <p className="mt-2 max-w-md text-base leading-relaxed text-muted-foreground">{stage.text}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Starter journeys ────────────────────────────────────────────── */}
      {templates.length > 0 && (
        <section className="mt-16 px-4 sm:px-6" aria-labelledby="gj-starters">
          <h2 id="gj-starters" className="text-2xl font-semibold tracking-tight text-foreground">
            Where people start
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Starting points you can adapt with your {config.terms.mentor} — timings are a guide and depend on where you are.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.slice(0, 6).map((t) => (
              <Reveal key={t.id}>
                <div className="h-full overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
                  <JourneyImage src={t.cover_image_url} alt="" aspect="aspect-[16/10]" rounded="rounded-none" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
                  <div className="p-4">
                    <p className="font-semibold text-foreground">{t.title}</p>
                    {t.summary && <p className="mt-1 text-sm text-muted-foreground">{t.summary}</p>}
                    <p className="mt-3 text-xs text-muted-foreground">
                      {t.milestones.length} milestones{t.duration_label ? ` · ${t.duration_label}` : ""}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Gallery preview ─────────────────────────────────────────────── */}
      <section className="mt-16 px-4 sm:px-6" aria-labelledby="gj-gallery">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="gj-gallery" className="text-2xl font-semibold tracking-tight text-foreground">
              {config.gallery.title}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">{config.gallery.subtitle}</p>
          </div>
          <Link href={`${basePath}/stories`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
            See all stories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {stories.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
            The first {config.terms.journey} stories will appear here once members finish and choose to share them.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stories.slice(0, 3).map((s) => (
              <StoryCard key={s.id} story={s} href={`${basePath}/stories/${s.id}`} config={config} />
            ))}
          </div>
        )}
      </section>

      {/* ── Trust ───────────────────────────────────────────────────────── */}
      <section className="mt-16 px-4 sm:px-6">
        <div className="grid gap-4 rounded-3xl bg-muted/70 p-6 sm:grid-cols-3 sm:p-8">
          <TrustPoint title="Nobody is assigned">
            {capitalise(config.terms.beginners)} ask; {config.terms.mentors} say yes or no. You can end a {config.terms.journey} at any time.
          </TrustPoint>
          <TrustPoint title="Your details stay yours">
            We never show addresses or contact details. Talk here or in private messages, and block or report anyone.
          </TrustPoint>
          <TrustPoint title="Community advice">{config.safety.adviceDisclaimer}</TrustPoint>
        </div>
      </section>
    </div>
  );
}

function EntryCard({
  href,
  icon,
  title,
  description,
  button,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  button: string;
  tone: "solid" | "soft";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none sm:p-8",
        tone === "solid" ? "border-accent/20 bg-card" : "border-border bg-card"
      )}
    >
      <span
        className={cn(
          "inline-flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 motion-reduce:transform-none",
          tone === "solid" ? "bg-accent text-accent-foreground" : "bg-accent-soft text-accent"
        )}
      >
        {icon}
      </span>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-1.5 text-base text-muted-foreground">{description}</p>
      <span
        className={cn(
          "mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
          tone === "solid" ? "bg-accent text-accent-foreground" : "border border-accent/30 text-accent group-hover:border-accent"
        )}
      >
        {button}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transform-none" />
      </span>
    </Link>
  );
}

function TrustPoint({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <ShieldCheck className="h-4 w-4 text-accent" />
        {title}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
