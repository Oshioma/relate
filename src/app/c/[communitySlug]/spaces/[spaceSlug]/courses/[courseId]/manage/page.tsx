import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getCourseDetail, getSpaceCourses, getStaffQuizzes } from "@/lib/data/courses";
import { getCommunityTiers } from "@/lib/data/tiers";
import { communityHasFeature } from "@/lib/data/plan-limits";
import { CourseManageView, type LessonRecordingStatus } from "../../../course-manage-view";

export default async function CourseManagePage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; courseId: string }>;
}) {
  const { communitySlug, spaceSlug, courseId } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) notFound();

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const isStaff =
    membership?.status === "active" && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  // Authoring is staff-only; everyone else gets a 404 rather than a hint.
  if (!isStaff) notFound();

  const detail = await getCourseDetail(supabase, courseId, user?.id ?? "");
  if (!detail || detail.course.space_id !== space.id) notFound();

  const [spaceCourses, staffQuizzes, tiers, canRecord, recordingRows] = await Promise.all([
    getSpaceCourses(supabase, space.id, user?.id ?? ""),
    getStaffQuizzes(supabase, courseId),
    getCommunityTiers(supabase, community.id),
    communityHasFeature(supabase, community.id, "session_recording"),
    supabase
      .from("course_lesson_recordings")
      .select("lesson_id, status, error, source_url, created_at")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false }),
  ]);
  // The latest recording of each live lesson (staff read these through RLS).
  const recordingByLesson: Record<string, LessonRecordingStatus> = {};
  for (const row of recordingRows.data ?? []) {
    if (recordingByLesson[row.lesson_id]) continue;
    recordingByLesson[row.lesson_id] = { status: row.status, error: row.error, sourceUrl: row.source_url, createdAt: row.created_at };
  }
  // Candidate prerequisites: every other course in this space.
  const siblingCourses = spaceCourses.filter((c) => c.course.id !== courseId).map((c) => ({ id: c.course.id, title: c.course.title }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href={`/c/${community.slug}/spaces/${space.slug}/courses/${courseId}`}
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to course
      </Link>

      <CourseManageView
        detail={detail}
        communityId={community.id}
        communitySlug={community.slug}
        spaceSlug={space.slug}
        siblingCourses={siblingCourses}
        staffQuizzes={staffQuizzes}
        tiers={tiers.filter((t) => !t.archived_at).map((t) => ({ id: t.id, name: t.name }))}
        recordings={{ canRecord, byLesson: recordingByLesson }}
      />
    </div>
  );
}
