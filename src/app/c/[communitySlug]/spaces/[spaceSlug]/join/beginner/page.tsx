import { loadGuidedJourneyPage } from "@/lib/data/guided-journey-page";
import { getMyJourneyProfiles } from "@/lib/data/guided-journey";
import { JourneyGate, JourneyShell, SafetyNote } from "@/components/guided-journey/journey-shell";
import { BeginnerOnboardingForm } from "@/components/guided-journey/beginner-form";

export default async function BeginnerOnboardingPage({ params }: { params: Promise<{ communitySlug: string; spaceSlug: string }> }) {
  const ctx = await loadGuidedJourneyPage(params);
  const { config } = ctx;
  const { beginner } = await getMyJourneyProfiles(ctx.supabase, ctx.space.id, ctx.isMember ? ctx.userId : null);

  return (
    <JourneyShell
      ctx={ctx}
      active="mentors"
      title={beginner ? "Your profile" : config.beginnerCard.title}
      intro={
        beginner
          ? "Update your answers any time — your suggestions change with them."
          : `Five quick questions and we'll suggest ${config.terms.mentors} who suit you. It takes about a minute.`
      }
    >
      {!ctx.isMember || !ctx.userId ? (
        <JourneyGate ctx={ctx} next={`${ctx.basePath}/join/beginner`} />
      ) : !ctx.settings?.accepting_beginners && ctx.settings ? (
        <p className="rounded-2xl bg-muted p-6 text-sm text-foreground">New requests are paused in this space for now. Please check back soon.</p>
      ) : (
        <>
          <BeginnerOnboardingForm
            communitySlug={ctx.community.slug}
            spaceSlug={ctx.space.slug}
            spaceId={ctx.space.id}
            userId={ctx.userId}
            config={config}
            existing={beginner}
          />
          <SafetyNote ctx={ctx} className="mt-8" />
        </>
      )}
    </JourneyShell>
  );
}
