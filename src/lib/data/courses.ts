import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Course, CourseModule, CourseLesson, LessonComment, CourseAnnouncement, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

// One course as it appears in the space's course list — enough for a card and
// the viewer's own progress, without pulling every lesson body.
export type CourseListItem = {
  course: Course;
  instructor: Profile | null;
  lessonCount: number;
  enrollmentCount: number;
  viewerEnrolled: boolean;
  // How many of this course's lessons the viewer has completed.
  completedCount: number;
};

// A module together with its ordered lessons, for the course player/outline.
export type CourseModuleWithLessons = {
  module: CourseModule;
  lessons: CourseLesson[];
};

export type LessonCommentWithAuthor = {
  comment: LessonComment;
  author: Profile | null;
};

export type AnnouncementWithAuthor = {
  announcement: CourseAnnouncement;
  author: Profile | null;
};

export type CourseDetail = {
  course: Course;
  instructor: Profile | null;
  modules: CourseModuleWithLessons[];
  lessonCount: number;
  enrollmentCount: number;
  viewerEnrolled: boolean;
  // Lesson ids the viewer has marked complete.
  completedLessonIds: string[];
  // v2:
  announcements: AnnouncementWithAuthor[];
  comments: LessonCommentWithAuthor[];
};

// RLS hides draft courses from non-staff, so this returns only what the viewer
// is allowed to see. Staff additionally see their own drafts.
export async function getSpaceCourses(supabase: Client, spaceId: string, viewerId: string): Promise<CourseListItem[]> {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!courses || courses.length === 0) return [];

  const courseIds = courses.map((c) => c.id);
  const instructorIds = [...new Set(courses.map((c) => c.instructor_id).filter((id): id is string => Boolean(id)))];

  const [lessonsResult, enrollmentsResult, completionsResult, instructorsResult] = await Promise.all([
    supabase.from("course_lessons").select("id, course_id").in("course_id", courseIds),
    supabase.from("course_enrollments").select("course_id, user_id").in("course_id", courseIds),
    // RLS returns only the viewer's own completions (plus staff-visible ones);
    // scoping to the viewer keeps the per-card progress unambiguous.
    viewerId
      ? supabase.from("lesson_completions").select("course_id, lesson_id").in("course_id", courseIds).eq("user_id", viewerId)
      : Promise.resolve({ data: [], error: null }),
    instructorIds.length ? supabase.from("profiles").select("*").in("id", instructorIds) : Promise.resolve({ data: [], error: null }),
  ]);

  if (lessonsResult.error) throw lessonsResult.error;
  if (enrollmentsResult.error) throw enrollmentsResult.error;
  if (completionsResult.error) throw completionsResult.error;
  if (instructorsResult.error) throw instructorsResult.error;

  const lessonCountByCourse = new Map<string, number>();
  for (const row of lessonsResult.data ?? []) {
    lessonCountByCourse.set(row.course_id, (lessonCountByCourse.get(row.course_id) ?? 0) + 1);
  }

  const enrollmentCountByCourse = new Map<string, number>();
  const viewerEnrolledCourses = new Set<string>();
  for (const row of enrollmentsResult.data ?? []) {
    enrollmentCountByCourse.set(row.course_id, (enrollmentCountByCourse.get(row.course_id) ?? 0) + 1);
    if (row.user_id === viewerId) viewerEnrolledCourses.add(row.course_id);
  }

  const completedByCourse = new Map<string, number>();
  for (const row of completionsResult.data ?? []) {
    completedByCourse.set(row.course_id, (completedByCourse.get(row.course_id) ?? 0) + 1);
  }

  const instructorById = new Map<string, Profile>();
  for (const profile of (instructorsResult.data ?? []) as Profile[]) {
    instructorById.set(profile.id, profile);
  }

  return courses.map((course) => ({
    course,
    instructor: course.instructor_id ? instructorById.get(course.instructor_id) ?? null : null,
    lessonCount: lessonCountByCourse.get(course.id) ?? 0,
    enrollmentCount: enrollmentCountByCourse.get(course.id) ?? 0,
    viewerEnrolled: viewerEnrolledCourses.has(course.id),
    completedCount: completedByCourse.get(course.id) ?? 0,
  }));
}

export async function getCourseDetail(supabase: Client, courseId: string, viewerId: string): Promise<CourseDetail | null> {
  const { data: course, error } = await supabase.from("courses").select("*").eq("id", courseId).maybeSingle();
  if (error) throw error;
  if (!course) return null;

  const [modulesResult, lessonsResult, enrollmentsResult, completionsResult, instructorResult, announcementsResult, commentsResult] =
    await Promise.all([
      supabase.from("course_modules").select("*").eq("course_id", courseId).order("sort_order", { ascending: true }),
      supabase.from("course_lessons").select("*").eq("course_id", courseId).order("sort_order", { ascending: true }),
      supabase.from("course_enrollments").select("course_id, user_id").eq("course_id", courseId),
      viewerId
        ? supabase.from("lesson_completions").select("lesson_id").eq("course_id", courseId).eq("user_id", viewerId)
        : Promise.resolve({ data: [], error: null }),
      course.instructor_id
        ? supabase.from("profiles").select("*").eq("id", course.instructor_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase.from("course_announcements").select("*, author:author_id (*)").eq("course_id", courseId).order("created_at", { ascending: false }),
      supabase.from("lesson_comments").select("*, author:author_id (*)").eq("course_id", courseId).order("created_at", { ascending: true }),
    ]);

  if (modulesResult.error) throw modulesResult.error;
  if (lessonsResult.error) throw lessonsResult.error;
  if (enrollmentsResult.error) throw enrollmentsResult.error;
  if (completionsResult.error) throw completionsResult.error;
  if (instructorResult.error) throw instructorResult.error;
  if (announcementsResult.error) throw announcementsResult.error;
  if (commentsResult.error) throw commentsResult.error;

  const lessonsByModule = new Map<string, CourseLesson[]>();
  for (const lesson of lessonsResult.data ?? []) {
    const list = lessonsByModule.get(lesson.module_id) ?? [];
    list.push(lesson);
    lessonsByModule.set(lesson.module_id, list);
  }

  const modules: CourseModuleWithLessons[] = (modulesResult.data ?? []).map((module) => ({
    module,
    lessons: lessonsByModule.get(module.id) ?? [],
  }));

  const enrollments = enrollmentsResult.data ?? [];

  const announcements: AnnouncementWithAuthor[] = (announcementsResult.data ?? []).map((row) => {
    const { author, ...announcement } = row as CourseAnnouncement & { author: Profile | null };
    return { announcement, author: author ?? null };
  });

  const comments: LessonCommentWithAuthor[] = (commentsResult.data ?? []).map((row) => {
    const { author, ...comment } = row as LessonComment & { author: Profile | null };
    return { comment, author: author ?? null };
  });

  return {
    course,
    instructor: (instructorResult.data as Profile | null) ?? null,
    modules,
    lessonCount: lessonsResult.data?.length ?? 0,
    enrollmentCount: enrollments.length,
    viewerEnrolled: enrollments.some((e) => e.user_id === viewerId),
    completedLessonIds: (completionsResult.data ?? []).map((row) => row.lesson_id),
    announcements,
    comments,
  };
}

// The most recent lesson-completion time for a learner in a course — used as
// the "completed on" date on the certificate. Null if they've completed none.
export async function getCourseCompletionDate(supabase: Client, courseId: string, userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("lesson_completions")
    .select("completed_at")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0]?.completed_at ?? null;
}
