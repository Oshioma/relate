import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getCourseDetail, getCourseCompletionDate } from "@/lib/data/courses";
import { CourseCertificate } from "../../../course-certificate";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; courseId: string }>;
}) {
  const { communitySlug, spaceSlug, courseId } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  if (!user) redirect(`/login`);

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();
  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space) notFound();

  const detail = await getCourseDetail(supabase, courseId, user.id);
  if (!detail || detail.course.space_id !== space.id) notFound();

  const coursePath = `/c/${communitySlug}/spaces/${spaceSlug}/courses/${courseId}`;

  // A certificate exists only when the course offers one and the learner has
  // finished every lesson — otherwise send them back to the course.
  const finished = detail.lessonCount > 0 && detail.completedLessonIds.length >= detail.lessonCount;
  if (!detail.course.certificate_enabled || !detail.viewerEnrolled || !finished) {
    redirect(coursePath);
  }

  const [profile, completedAt] = await Promise.all([getProfile(supabase, user.id), getCourseCompletionDate(supabase, courseId, user.id)]);

  return (
    <CourseCertificate
      learnerName={profile?.full_name || profile?.username || "Member"}
      courseTitle={detail.course.title}
      instructorName={detail.instructor?.full_name || detail.instructor?.username || null}
      communityName={community.name}
      completedAt={completedAt}
      backHref={coursePath}
    />
  );
}
