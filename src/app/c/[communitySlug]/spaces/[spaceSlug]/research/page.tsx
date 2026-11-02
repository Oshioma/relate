import type { Metadata } from "next";
import { loadTrueCalendarSpace } from "@/lib/data/true-calendar-space";
import { getBundledResearchStatus, getRecentImportRuns, getReviewQueue } from "@/lib/data/true-calendar";
import { TrueCalendarFrame } from "@/components/true-calendar/true-calendar-frame";
import { ImportPanel, ReadyToImport, ReviewQueue } from "@/components/true-calendar/research-desk";

export const metadata: Metadata = { title: "Research · The True Calendar" };

// The research desk, for calendar researchers and reviewers only (super
// admins are reviewers). Everyone else sees a short note.

export default async function TrueCalendarResearchPage({ params }: { params: Promise<{ communitySlug: string; spaceSlug: string }> }) {
  const { communitySlug, spaceSlug } = await params;
  const { supabase, space, spacePath, researcherRole } = await loadTrueCalendarSpace(communitySlug, spaceSlug);

  if (!researcherRole) {
    return (
      <TrueCalendarFrame title={space.name} basePath={spacePath} active="research">
        <p className="text-base text-[var(--tc-muted)]">The research desk is for the calendar&apos;s researchers and reviewers.</p>
      </TrueCalendarFrame>
    );
  }

  const [{ items, cultureNames }, runs, bundled] = await Promise.all([getReviewQueue(supabase), getRecentImportRuns(supabase), getBundledResearchStatus(supabase)]);
  return (
    <TrueCalendarFrame title={space.name} basePath={spacePath} active="research" showResearch>
      <div className="space-y-5">
        <p className="text-base text-[var(--tc-muted)]">
          You are a {researcherRole}. {researcherRole === "reviewer" ? "You can import research and publish it." : "You can import research as drafts and mark it ready; a reviewer publishes it."}
        </p>
        <ReadyToImport spacePath={spacePath} files={bundled} />
        <ImportPanel spacePath={spacePath} />
        <ReviewQueue spacePath={spacePath} items={items} cultureNames={[...cultureNames]} isReviewer={researcherRole === "reviewer"} />
        {runs.length > 0 ? (
          <section aria-labelledby="tc-runs-heading" className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4">
            <h2 id="tc-runs-heading" className="font-serif text-2xl">Recent imports</h2>
            <ul className="mt-2 space-y-1 text-base">
              {runs.map((r) => (
                <li key={r.id}>
                  {new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC ·{" "}
                  {r.dry_run ? "dry run" : "imported"}
                  {(r.summary as { ok?: boolean }).ok === false ? " · had problems" : ""}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </TrueCalendarFrame>
  );
}
