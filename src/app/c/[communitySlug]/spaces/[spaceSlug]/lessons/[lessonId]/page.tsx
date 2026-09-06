import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getLesson, getSavedLessonIds, redactSource } from "@/lib/data/lessons";
import { isLessonWriterConfigured, lessonSystemPrompt } from "@/lib/ai/lesson-writer";
import { isAgeBandKey, DEFAULT_AGE_BAND } from "@/lib/school/lesson-types";
import { LessonDetailView } from "../../lesson-detail-view";

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

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const isStaff =
    membership?.status === "active" &&
    (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  const isMember = membership?.status === "active";

  // A save is private to whoever made it, so this reads as the viewer and a
  // guest simply gets nothing back.
  const saved = user ? (await getSavedLessonIds(supabase, user.id, [lesson.id])).has(lesson.id) : false;

  // The rules this lesson was written under, rebuilt from the row. Computed
  // here and only for staff, so it never reaches a member's page payload at
  // all — hiding it with CSS would still have shipped it to everybody.
  // The prompt as sent, when the lesson kept one. Rebuilt only as a fallback
  // for lessons written before they did — and the panel says which it got, so
  // "rebuilt" is never mistaken for evidence.
  const sourceRules = isStaff
    ? lesson.prompt_used ??
      lessonSystemPrompt(
        isAgeBandKey(lesson.age_band) ? lesson.age_band : DEFAULT_AGE_BAND,
        lesson.beyond_source
      )
    : null;
  const rulesAreOriginal = Boolean(lesson.prompt_used);

  // The material is private unless its author has published it. Staff see it
  // regardless, because they answer for what is in their space and cannot
  // check a lesson they can't see the source of.
  //
  // Stripped from the row rather than hidden in the view: this component's
  // props are serialised into the page, so a source left on the object and
  // merely not rendered is still readable by anyone who looks. The button says
  // "Source is private", and this is what makes that true.
  const canSeeSource = Boolean(isStaff) || lesson.source_public;
  const visible = canSeeSource ? lesson : redactSource(lesson);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Link href={`/c/${community.slug}/spaces/${space.slug}`} className="hover:underline">
          {space.name}
        </Link>
      </p>

      <LessonDetailView
        lesson={{ ...visible, saved }}
        communitySlug={community.slug}
        spaceSlug={space.slug}
        canEdit={Boolean(isStaff)}
        // Its author decides whether anyone else sees it; staff can too, since
        // they answer for what is in their space.
        canManageVisibility={Boolean(isStaff) || lesson.created_by === user?.id}
        canSave={Boolean(isMember)}
        sourceRules={sourceRules}
        rulesAreOriginal={rulesAreOriginal}
        writerConfigured={isLessonWriterConfigured()}
      />
    </div>
  );
}
