import Link from "next/link";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { loadGuidedJourneyPage } from "@/lib/data/guided-journey-page";
import { getJourneyTemplates, getMyJourneyProfiles, getOpenGroupJourneys, getRequestsForUser, getSpaceMentors, displayName } from "@/lib/data/guided-journey";
import { rankMentors } from "@/lib/guided-journey/matching";
import { optionLabel } from "@/lib/guided-journey/config";
import { JourneyGate, JourneyShell, SafetyNote } from "@/components/guided-journey/journey-shell";
import { MentorCard } from "@/components/guided-journey/mentor-card";
import { GroupJourneyCard } from "@/components/guided-journey/group-journey-card";

export default async function FindMentorPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string }>;
  searchParams: Promise<{ welcome?: string; all?: string }>;
}) {
  const ctx = await loadGuidedJourneyPage(params);
  const { welcome, all } = await searchParams;
  const { config } = ctx;

  if (!ctx.isMember || !ctx.userId) {
    return (
      <JourneyShell ctx={ctx} active="mentors" title={config.beginnerCard.button}>
        <JourneyGate ctx={ctx} next={`${ctx.basePath}/mentors`} />
      </JourneyShell>
    );
  }

  const { beginner } = await getMyJourneyProfiles(ctx.supabase, ctx.space.id, ctx.userId);
  if (!beginner) redirect(`${ctx.basePath}/join/beginner`);

  const [mentors, templates, groups, requests] = await Promise.all([
    getSpaceMentors(ctx.supabase, ctx.space.id),
    getJourneyTemplates(ctx.supabase, ctx.space.id),
    getOpenGroupJourneys(ctx.supabase, ctx.space.id),
    getRequestsForUser(ctx.supabase, ctx.space.id, ctx.userId),
  ]);
  const pendingTo = new Set(requests.outgoing.filter((r) => r.status === "pending").map((r) => r.mentor_id));
  const activeMentors = mentors.filter((m) => m.status === "active");

  const ranked = rankMentors(
    {
      userId: ctx.userId,
      country: beginner.country,
      region: beginner.region,
      interests: beginner.interests,
      languages: beginner.languages,
      helpMode: beginner.help_mode,
    },
    activeMentors.map((m) => ({
      ...m,
      userId: m.user_id,
      preferredTopics: m.preferred_topics,
      helpMode: m.help_mode,
      isPaused: m.is_paused,
    })),
    (v) => optionLabel(config.questions.interests.options, v)
  );
  const shown = all === "1" ? ranked : ranked.slice(0, 9);
  const openGroups = groups.filter((g) => g.mentor_id !== ctx.userId);

  return (
    <JourneyShell
      ctx={ctx}
      active="mentors"
      wide
      title={welcome ? `Lovely — here are some ${config.terms.mentors} for you` : `Suggested ${config.terms.mentors}`}
      intro={
        <>
          Ordered by what you&apos;d like to {config.category === "Gardening" ? "grow" : "do"}, then climate and region, language, availability and how you&apos;d like help.{" "}
          <Link href={`${ctx.basePath}/join/beginner`} className="font-medium text-accent hover:underline">
            Edit your answers
          </Link>
        </>
      }
    >
      {shown.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <Users className="mx-auto h-8 w-8 text-accent" />
          <p className="mt-3 font-semibold text-foreground">No {config.terms.mentors} have free places right now</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            New {config.terms.mentors} join regularly. Your profile is saved — check back soon, or ask in the community if anyone can help.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(({ mentor, reasons, placesLeft }) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              reasons={reasons}
              placesLeft={placesLeft}
              config={config}
              templates={templates}
              communitySlug={ctx.community.slug}
              spaceSlug={ctx.space.slug}
              spaceId={ctx.space.id}
              pendingRequest={pendingTo.has(mentor.user_id)}
            />
          ))}
        </div>
      )}
      {ranked.length > shown.length && (
        <p className="mt-6 text-center">
          <Link href={`${ctx.basePath}/mentors?all=1`} className="text-sm font-semibold text-accent hover:underline">
            Show all {ranked.length} {config.terms.mentors}
          </Link>
        </p>
      )}

      {openGroups.length > 0 && (
        <section className="mt-14" aria-labelledby="gj-groups">
          <h2 id="gj-groups" className="text-2xl font-semibold tracking-tight text-foreground">
            Group journeys open to join
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            One {config.terms.mentor}, a few {config.terms.beginners}, the same {config.terms.journey} — learn alongside others.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {openGroups.map((g) => (
              <GroupJourneyCard
                key={g.id}
                journey={g}
                mentorName={displayName(g.mentor)}
                communitySlug={ctx.community.slug}
                spaceSlug={ctx.space.slug}
                spaceId={ctx.space.id}
                pending={requests.outgoing.some((r) => r.status === "pending" && r.requested_journey_id === g.id)}
              />
            ))}
          </div>
        </section>
      )}

      <SafetyNote ctx={ctx} className="mt-12" />
    </JourneyShell>
  );
}
