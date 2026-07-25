import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getCourseDetail } from "@/lib/data/courses";
import { CoursePlayer } from "../../course-player";

export default async function CoursePage({
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

  const viewerId = user?.id ?? "";
  const detail = await getCourseDetail(supabase, courseId, viewerId);
  // RLS returns null for a draft the viewer can't see, and for a course in
  // another space — so this doubles as the access + not-found gate.
  if (!detail || detail.course.space_id !== space.id) notFound();

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const isMember = membership?.status === "active";
  const isStaff = isMember && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href={`/c/${community.slug}/spaces/${space.slug}`}
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {space.name}
      </Link>

      <CoursePlayer
        detail={detail}
        communityId={community.id}
        communitySlug={community.slug}
        spaceSlug={space.slug}
        canEnroll={Boolean(isMember)}
        isStaff={Boolean(isStaff)}
      />
    </div>
  );
}
