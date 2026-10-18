import { loadGuidedJourneyPage } from "@/lib/data/guided-journey-page";
import { getMyJourneyProfiles, getMyJourneys } from "@/lib/data/guided-journey";
import { JourneyGate, JourneyShell, SafetyNote } from "@/components/guided-journey/journey-shell";
import { MentorOnboardingForm } from "@/components/guided-journey/mentor-form";

export default async function MentorOnboardingPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const ctx = await loadGuidedJourneyPage(params);
  const { from } = await searchParams;
  const { config } = ctx;
  const memberId = ctx.isMember ? ctx.userId : null;
  const [{ mentor }, journeys] = await Promise.all([
    getMyJourneyProfiles(ctx.supabase, ctx.space.id, memberId),
    memberId ? getMyJourneys(ctx.supabase, ctx.space.id, memberId) : Promise.resolve([]),
  ]);
  // Someone who has completed a journey here as a beginner arrives as a
  // first-success helper — never automatically as an "expert".
  const completedAsBeginner = journeys.filter((j) => j.role === "beginner" && j.status === "completed");
  const suggestedLevel = mentor?.level ?? (from === "completion" || completedAsBeginner.length > 0 ? "first_harvest" : "community");

  return (
    <JourneyShell
      ctx={ctx}
      active="requests"
      title={mentor ? `Your ${config.terms.mentor} profile` : config.mentorCard.title}
      intro={
        from === "completion"
          ? config.completion.mentorInvite
          : `Share what you know. ${config.terms.beginners.charAt(0).toUpperCase() + config.terms.beginners.slice(1)} ask you directly, and nothing happens unless you say yes.`
      }
    >
      {!ctx.isMember || !ctx.userId ? (
        <JourneyGate ctx={ctx} next={`${ctx.basePath}/join/mentor`} />
      ) : ctx.settings && !ctx.settings.accepting_mentors && !mentor ? (
        <p className="rounded-2xl bg-muted p-6 text-sm text-foreground">This space isn&apos;t taking new {config.terms.mentors} right now. Please check back soon.</p>
      ) : (
        <>
          <MentorOnboardingForm
            communitySlug={ctx.community.slug}
            spaceSlug={ctx.space.slug}
            spaceId={ctx.space.id}
            userId={ctx.userId}
            config={config}
            existing={mentor}
            suggestedLevel={suggestedLevel}
            completedSubjects={completedAsBeginner.map((j) => j.subject || j.title)}
          />
          <SafetyNote ctx={ctx} className="mt-8" />
        </>
      )}
    </JourneyShell>
  );
}
