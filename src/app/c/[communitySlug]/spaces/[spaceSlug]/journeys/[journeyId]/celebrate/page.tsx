import Link from "next/link";
import { notFound } from "next/navigation";
import { HeartHandshake, Quote, Share2, Sprout } from "lucide-react";
import { loadGuidedJourneyPage } from "@/lib/data/guided-journey-page";
import { displayName, getJourneyDetail, weeksBetween } from "@/lib/data/guided-journey";
import { JourneyShell } from "@/components/guided-journey/journey-shell";
import { JourneyImage } from "@/components/guided-journey/journey-image";
import { MentorConsentForm, ReflectionForm, StoryForm } from "@/components/guided-journey/story-form";
import { LinkButton } from "@/components/ui/button";

const LEAVES = Array.from({ length: 14 }, (_, i) => i);

export default async function CelebratePage({ params }: { params: Promise<{ communitySlug: string; spaceSlug: string; journeyId: string }> }) {
  const ctx = await loadGuidedJourneyPage(params);
  const { journeyId } = await params;
  const detail = await getJourneyDetail(ctx.supabase, journeyId);
  if (!detail || detail.journey.space_id !== ctx.space.id || !ctx.userId) notFound();
  const { journey, participants, milestones, updates, stories } = detail;
  const { config } = ctx;
  if (journey.status !== "completed") notFound();

  const me = participants.find((p) => p.user_id === ctx.userId);
  const isMentor = me?.role === "mentor";
  const mentor = participants.find((p) => p.role === "mentor");
  const photos = updates.flatMap((u) => u.photos);
  const first = photos[0] ?? journey.cover_image_url;
  const latest = photos.length > 1 ? photos[photos.length - 1] : null;
  const weeks = weeksBetween(journey.started_at, journey.completed_at);
  const done = milestones.filter((m) => m.status === "done").length;
  const myStory = stories.find((s) => s.author_id === ctx.userId) ?? null;
  const storiesForMentor = isMentor ? stories : [];
  const problems = updates.map((u) => u.problems).filter(Boolean).join("\n");
  const storyUrl = myStory?.status === "published" ? `${ctx.basePath}/stories/${myStory.id}` : null;
  const reflections = participants.filter((p) => p.reflection);
  const hidden = { communitySlug: ctx.community.slug, spaceSlug: ctx.space.slug };

  return (
    <JourneyShell ctx={ctx} active="journeys" wide>
      <section className="relative overflow-hidden rounded-[2rem] bg-accent px-6 py-12 text-center text-accent-foreground sm:px-10 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
          {LEAVES.map((i) => (
            <Sprout
              key={i}
              className="absolute h-5 w-5 opacity-0 animate-[gj-drift_6s_ease-in_1]"
              style={{ left: `${(i * 37) % 100}%`, top: "-5%", animationDelay: `${(i % 7) * 0.35}s` }}
            />
          ))}
        </div>
        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] opacity-80">{journey.title}</p>
        <h1 className="relative mt-3 text-4xl font-semibold tracking-tight animate-[gj-rise_700ms_ease-out] motion-reduce:animate-none sm:text-5xl">
          {config.completion.title}
        </h1>
        <p className="relative mx-auto mt-3 max-w-xl text-base opacity-90">{config.completion.subtitle}</p>
        <dl className="relative mx-auto mt-8 grid max-w-lg grid-cols-3 gap-4">
          <Stat label="Weeks" value={String(weeks)} />
          <Stat label="Milestones" value={`${done}/${milestones.length}`} />
          <Stat label="Updates" value={String(updates.filter((u) => !u.parent_id).length)} />
        </dl>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <figure>
          <JourneyImage src={first} alt="The first photo of this journey" sizes="(min-width: 640px) 50vw, 100vw" />
          <figcaption className="mt-2 text-sm text-muted-foreground">Where it started</figcaption>
        </figure>
        <figure>
          <JourneyImage src={latest} alt="The latest photo of this journey" sizes="(min-width: 640px) 50vw, 100vw" />
          <figcaption className="mt-2 text-sm text-muted-foreground">{latest ? "Where it ended up" : "Add a final photo in an update or your story"}</figcaption>
        </figure>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        {journey.mentor_acknowledgement && mentor && (
          <blockquote className="rounded-3xl border border-border bg-card p-6">
            <Quote className="h-6 w-6 text-accent" />
            <p className="mt-2 text-lg leading-relaxed text-foreground">{journey.mentor_acknowledgement}</p>
            <footer className="mt-3 text-sm text-muted-foreground">— {displayName(mentor.profile)}, your {config.terms.mentor}</footer>
          </blockquote>
        )}
        {reflections.map((p) => (
          <blockquote key={p.id} className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm font-semibold text-accent">{displayName(p.profile)} reflects</p>
            <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-foreground">{p.reflection}</p>
          </blockquote>
        ))}
      </section>

      {me && (
        <details className="mt-6 rounded-3xl border border-border bg-card p-5">
          <summary className="cursor-pointer text-sm font-semibold text-foreground">{me.reflection ? "Edit your reflection" : "Add a short reflection"}</summary>
          <div className="mt-4">
            <ReflectionForm journeyId={journey.id} {...hidden} reflection={me.reflection} acknowledgement={journey.mentor_acknowledgement} isMentor={isMentor} />
          </div>
        </details>
      )}

      <section className="mt-10 flex flex-wrap items-center gap-3">
        {storyUrl ? (
          <LinkButton href={`${storyUrl}?share=1`} size="lg" className="rounded-full">
            <Share2 className="h-4 w-4" />
            Share Journey
          </LinkButton>
        ) : (
          !isMentor && <p className="text-sm text-muted-foreground">Publish your story below to get a link you can share.</p>
        )}
        <LinkButton href={`${ctx.basePath}/mentors`} variant="secondary" size="lg" className="rounded-full">
          {config.completion.againButton}
        </LinkButton>
        <LinkButton href={`${ctx.basePath}/join/mentor?from=completion`} size="lg" className="rounded-full">
          <HeartHandshake className="h-4 w-4" />
          {config.completion.helpButton}
        </LinkButton>
      </section>

      {!isMentor && (
        <section className="mt-6 rounded-3xl bg-accent-soft p-6">
          <p className="text-lg font-semibold text-foreground">{config.completion.mentorInvite}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;d join as a {config.terms.firstSuccessHelper.toLowerCase()} — helping with exactly what you&apos;ve done, not as an expert.{" "}
            <Link href={`${ctx.basePath}/join/mentor?from=completion`} className="font-semibold text-accent hover:underline">
              Tell me more
            </Link>
          </p>
        </section>
      )}

      {!isMentor && me && (
        <section className="mt-12" aria-labelledby="gj-story">
          <h2 id="gj-story" className="text-2xl font-semibold tracking-tight text-foreground">
            Your story
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            What you learned could help the next {config.terms.beginner}. It stays private unless you choose to publish it.
          </p>
          <div className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-6">
            <StoryForm
              journeyId={journey.id}
              {...hidden}
              userId={ctx.userId}
              config={config}
              story={myStory}
              journeyPhotos={photos}
              defaults={{
                title: journey.title,
                subject: journey.subject ?? "",
                region: "",
                weeks,
                before: first ?? null,
                after: latest,
                problems,
              }}
            />
          </div>
        </section>
      )}

      {storiesForMentor.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground">Stories from this journey</h2>
          <div className="mt-4 space-y-4">
            {storiesForMentor.map((s) => (
              <div key={s.id} className="rounded-3xl border border-border bg-card p-5">
                <p className="font-semibold text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.status === "published" ? "Published" : s.status === "hidden" ? "Hidden by staff" : "Private draft"}</p>
                <div className="mt-4">
                  <MentorConsentForm story={s} {...hidden} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </JourneyShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-3">
      <dd className="text-2xl font-semibold">{value}</dd>
      <dt className="text-xs uppercase tracking-wide opacity-80">{label}</dt>
    </div>
  );
}
