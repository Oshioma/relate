import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getLesson, getLessonFamily, getSavedLessonIds, redactSource } from "@/lib/data/lessons";
import { isLessonWriterConfigured, lessonSystemPrompt } from "@/lib/ai/lesson-writer";
import {
  ageBandLabel,
  ageBandRank,
  isAgeBandKey,
  DEFAULT_AGE_BAND,
  type LessonRow,
} from "@/lib/school/lesson-types";
import { LessonDetailView } from "../../lesson-detail-view";
import { LessonAddLevel } from "../../lesson-add-level";

// One page per source: every age level written from the same material, youngest
// first. Opening any level's link opens the whole page, and a reader skims the
// levels they already know and carries on down as far as they like.
export default async function LessonPage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; lessonId: string }>;
}) {
  const { communitySlug, spaceSlug, lessonId } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) notFound();

  // RLS already limits this to lessons in spaces the viewer can see; the
  // space_id check stops a lesson being reached through another space's URL.
  const lesson = await getLesson(supabase, lessonId);
  if (!lesson || lesson.space_id !== space.id) notFound();

  // Every level the viewer may see. RLS leaves out private ones.
  const levels = await getLessonFamily(supabase, lesson);

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const isStaff =
    membership?.status === "active" &&
    (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  const isMember = membership?.status === "active";

  // A save is private to whoever made it, so this reads as the viewer and a
  // guest simply gets nothing back.
  const savedIds = user
    ? await getSavedLessonIds(
        supabase,
        user.id,
        levels.map((level) => level.id)
      )
    : new Set<string>();

  // The rules a level was written under, rebuilt from the row. Computed here
  // and only for staff, so it never reaches a member's page payload at all —
  // hiding it with CSS would still have shipped it to everybody.
  // The prompt as sent, when the lesson kept one. Rebuilt only as a fallback
  // for lessons written before they did — and the panel says which it got, so
  // "rebuilt" is never mistaken for evidence.
  function rulesFor(level: LessonRow) {
    if (!isStaff) return null;
    return (
      level.prompt_used ??
      lessonSystemPrompt(
        isAgeBandKey(level.age_band) ? level.age_band : DEFAULT_AGE_BAND,
        level.beyond_source,
        levels.some((other) => ageBandRank(other.age_band) < ageBandRank(level.age_band))
      )
    );
  }

  // The material is private unless its author has published it. Staff see it
  // regardless, because they answer for what is in their space and cannot
  // check a lesson they can't see the source of.
  //
  // Stripped from the row rather than hidden in the view: this component's
  // props are serialised into the page, so a source left on the object and
  // merely not rendered is still readable by anyone who looks. The button says
  // "Source is private", and this is what makes that true.
  function visibleRow(level: LessonRow): LessonRow {
    const canSeeSource = Boolean(isStaff) || level.source_public;
    return canSeeSource ? level : redactSource(level);
  }

  const writerConfigured = isLessonWriterConfigured();
  const canAddLevel =
    Boolean(isStaff) &&
    writerConfigured &&
    levels.some((level) => (level.source_text ?? "").trim().length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Link href={`/c/${community.slug}/spaces/${space.slug}`} className="hover:underline">
          {space.name}
        </Link>
      </p>

      {/* The levels on this page, so an adult can jump past the ones written
          for children without scrolling through them. */}
      {levels.length > 1 && (
        <nav
          aria-label="Levels"
          className="mb-5 flex flex-wrap items-center gap-2 rounded-xl bg-muted/60 px-4 py-3"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Jump to
          </span>
          {levels.map((level) => (
            <a
              key={level.id}
              href={`#level-${level.id}`}
              className="rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
            >
              {ageBandLabel(level.age_band)}
            </a>
          ))}
        </nav>
      )}

      <div className="space-y-10">
        {levels.map((level, index) => (
          <LessonDetailView
            key={level.id}
            lesson={{ ...visibleRow(level), saved: savedIds.has(level.id) }}
            communitySlug={community.slug}
            spaceSlug={space.slug}
            canEdit={Boolean(isStaff)}
            // Its author decides whether anyone else sees it; staff can too,
            // since they answer for what is in their space.
            canManageVisibility={Boolean(isStaff) || level.created_by === user?.id}
            canSave={Boolean(isMember)}
            sourceRules={rulesFor(level)}
            rulesAreOriginal={Boolean(level.prompt_used)}
            level={{
              index,
              count: levels.length,
              // Only claimed for a level that really was written on top of
              // the ones above it. Levels written before families existed were
              // each written on their own, and may overlap.
              previousBand:
                index > 0 && level.prompt_used?.includes("<earlier_levels>")
                  ? levels[index - 1].age_band
                  : null,
            }}
          />
        ))}

        {canAddLevel && (
          <LessonAddLevel
            lessonId={levels.find((level) => (level.source_text ?? "").trim())?.id ?? lesson.id}
            existingBands={levels.map((level) => level.age_band)}
            communitySlug={community.slug}
            spaceSlug={space.slug}
          />
        )}
      </div>
    </div>
  );
}
