import Link from "next/link";
import { loadGuidedJourneyPage } from "@/lib/data/guided-journey-page";
import { getMyJourneys } from "@/lib/data/guided-journey";
import { JourneyGate, JourneyShell } from "@/components/guided-journey/journey-shell";
import { JourneyImage } from "@/components/guided-journey/journey-image";
import { ProgressBar } from "@/components/guided-journey/progress";

const STATUS: Record<string, string> = { active: "In progress", completed: "Completed", ended: "Ended" };

export default async function MyJourneysPage({ params }: { params: Promise<{ communitySlug: string; spaceSlug: string }> }) {
  const ctx = await loadGuidedJourneyPage(params);
  const { config } = ctx;
  if (!ctx.isMember || !ctx.userId) {
    return (
      <JourneyShell ctx={ctx} active="journeys" title="My journeys">
        <JourneyGate ctx={ctx} next={`${ctx.basePath}/journeys`} />
      </JourneyShell>
    );
  }
  const journeys = await getMyJourneys(ctx.supabase, ctx.space.id, ctx.userId);
  return (
    <JourneyShell ctx={ctx} active="journeys" title="My journeys" wide>
      {journeys.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No journeys yet. A {config.terms.journey} starts when a {config.terms.mentor} accepts a request.{" "}
          <Link href={`${ctx.basePath}/mentors`} className="font-semibold text-accent hover:underline">
            {config.beginnerCard.button}
          </Link>
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {journeys.map((j) => (
            <Link
              key={j.id}
              href={`${ctx.basePath}/journeys/${j.id}${j.status === "completed" ? "/celebrate" : ""}`}
              className="overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none"
            >
              <JourneyImage src={j.cover_image_url} alt="" aspect="aspect-[16/9]" rounded="rounded-none" sizes="(min-width: 1024px) 30vw, 100vw" />
              <div className="p-5">
                <p className="text-xs font-medium text-accent">
                  {STATUS[j.status]} · {j.role === "mentor" ? `You're the ${config.terms.mentor}` : `You're the ${config.terms.beginner}`}
                  {j.is_group ? " · Group" : ""}
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">{j.title}</p>
                <ProgressBar done={j.progress.done} total={j.progress.total} className="mt-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </JourneyShell>
  );
}
