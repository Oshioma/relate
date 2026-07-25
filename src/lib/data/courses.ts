import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  Course,
  CourseModule,
  CourseLesson,
  LessonComment,
  CourseAnnouncement,
  CourseQuiz,
  QuizQuestion,
  QuizOption,
  Profile,
} from "@/types/database";

type Client = SupabaseClient<Database>;

// A prerequisite course plus whether the viewer has finished it.
export type PrerequisiteStatus = {
  courseId: string;
  title: string;
  completed: boolean;
};

// Learner-facing quiz: options carry NO is_correct (redacted by the RPC).
export type LessonQuizQuestion = { id: string; prompt: string; options: { id: string; label: string }[] };
export type LessonQuiz = { id: string; lessonId: string; title: string; passPercent: number; questions: LessonQuizQuestion[] };

// Staff authoring shape: full options incl. is_correct.
export type StaffQuizQuestion = { question: QuizQuestion; options: QuizOption[] };
export type StaffQuiz = { quiz: CourseQuiz; questions: StaffQuizQuestion[] };

export type ViewerAttempt = { scorePercent: number; passed: boolean };

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
  // v3:
  prerequisites: PrerequisiteStatus[];
  prerequisitesMet: boolean;
  quizzesByLesson: Record<string, LessonQuiz>;
  viewerAttempts: Record<string, ViewerAttempt>;
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

  const [
    modulesResult,
    lessonsResult,
    enrollmentsResult,
    completionsResult,
    instructorResult,
    announcementsResult,
    commentsResult,
    quizRowsResult,
    attemptsResult,
    prereqRowsResult,
  ] = await Promise.all([
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
      supabase.rpc("course_quiz_data", { p_course_id: courseId }),
      viewerId
        ? supabase.from("quiz_attempts").select("quiz_id, score_percent, passed").eq("course_id", courseId).eq("user_id", viewerId)
        : Promise.resolve({ data: [], error: null }),
      supabase.from("course_prerequisites").select("prerequisite_course_id").eq("course_id", courseId),
    ]);

  if (modulesResult.error) throw modulesResult.error;
  if (lessonsResult.error) throw lessonsResult.error;
  if (enrollmentsResult.error) throw enrollmentsResult.error;
  if (completionsResult.error) throw completionsResult.error;
  if (instructorResult.error) throw instructorResult.error;
  if (announcementsResult.error) throw announcementsResult.error;
  if (commentsResult.error) throw commentsResult.error;
  if (quizRowsResult.error) throw quizRowsResult.error;
  if (attemptsResult.error) throw attemptsResult.error;
  if (prereqRowsResult.error) throw prereqRowsResult.error;

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

  // Assemble the flat quiz rows (quiz x question x option) into per-lesson
  // quizzes. Options carry no is_correct — the RPC redacts it.
  const quizzesByLesson: Record<string, LessonQuiz> = {};
  const quizAcc = new Map<string, LessonQuiz>();
  const questionAcc = new Map<string, LessonQuizQuestion>();
  for (const row of quizRowsResult.data ?? []) {
    let quiz = quizAcc.get(row.quiz_id);
    if (!quiz) {
      quiz = { id: row.quiz_id, lessonId: row.lesson_id, title: row.quiz_title, passPercent: row.pass_percent, questions: [] };
      quizAcc.set(row.quiz_id, quiz);
      quizzesByLesson[row.lesson_id] = quiz;
    }
    if (row.question_id) {
      let question = questionAcc.get(row.question_id);
      if (!question) {
        question = { id: row.question_id, prompt: row.question_prompt ?? "", options: [] };
        questionAcc.set(row.question_id, question);
        quiz.questions.push(question);
      }
      if (row.option_id) question.options.push({ id: row.option_id, label: row.option_label ?? "" });
    }
  }

  const viewerAttempts: Record<string, ViewerAttempt> = {};
  for (const row of attemptsResult.data ?? []) {
    const existing = viewerAttempts[row.quiz_id];
    // Keep the best score and remember if they've ever passed.
    if (!existing || row.score_percent > existing.scorePercent) {
      viewerAttempts[row.quiz_id] = { scorePercent: row.score_percent, passed: (existing?.passed ?? false) || row.passed };
    } else if (row.passed) {
      viewerAttempts[row.quiz_id] = { ...existing, passed: true };
    }
  }

  const prerequisiteIds = (prereqRowsResult.data ?? []).map((r) => r.prerequisite_course_id);
  const prerequisites = await getPrerequisiteStatuses(supabase, prerequisiteIds, viewerId);
  const prerequisitesMet = prerequisites.every((p) => p.completed);

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
    prerequisites,
    prerequisitesMet,
    quizzesByLesson,
    viewerAttempts,
  };
}

// For each prerequisite course, whether the viewer has completed every lesson.
async function getPrerequisiteStatuses(supabase: Client, prerequisiteIds: string[], viewerId: string): Promise<PrerequisiteStatus[]> {
  if (prerequisiteIds.length === 0) return [];

  const [coursesResult, lessonsResult, completionsResult] = await Promise.all([
    supabase.from("courses").select("id, title").in("id", prerequisiteIds),
    supabase.from("course_lessons").select("id, course_id").in("course_id", prerequisiteIds),
    viewerId
      ? supabase.from("lesson_completions").select("course_id").in("course_id", prerequisiteIds).eq("user_id", viewerId)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (coursesResult.error) throw coursesResult.error;
  if (lessonsResult.error) throw lessonsResult.error;
  if (completionsResult.error) throw completionsResult.error;

  const lessonCount = new Map<string, number>();
  for (const row of lessonsResult.data ?? []) lessonCount.set(row.course_id, (lessonCount.get(row.course_id) ?? 0) + 1);
  const completedCount = new Map<string, number>();
  for (const row of completionsResult.data ?? []) completedCount.set(row.course_id, (completedCount.get(row.course_id) ?? 0) + 1);

  const titleById = new Map<string, string>();
  for (const row of coursesResult.data ?? []) titleById.set(row.id, row.title);

  return prerequisiteIds.map((id) => {
    const total = lessonCount.get(id) ?? 0;
    const done = completedCount.get(id) ?? 0;
    return { courseId: id, title: titleById.get(id) ?? "A course", completed: total > 0 && done >= total };
  });
}

// Server-side gate for the enrol action: are all this course's prerequisites
// completed by the user? (RLS can't express this, so it's enforced here.)
export async function arePrerequisitesMet(supabase: Client, courseId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase.from("course_prerequisites").select("prerequisite_course_id").eq("course_id", courseId);
  if (error) throw error;
  const ids = (data ?? []).map((r) => r.prerequisite_course_id);
  const statuses = await getPrerequisiteStatuses(supabase, ids, userId);
  return statuses.every((s) => s.completed);
}

// Full quiz structure (incl. is_correct) for staff authoring — relies on the
// staff-only RLS on the quiz tables.
export async function getStaffQuizzes(supabase: Client, courseId: string): Promise<Record<string, StaffQuiz>> {
  const { data: quizzes, error } = await supabase.from("course_quizzes").select("*").eq("course_id", courseId);
  if (error) throw error;
  if (!quizzes || quizzes.length === 0) return {};

  const quizIds = quizzes.map((q) => q.id);
  const { data: questions, error: qErr } = await supabase.from("quiz_questions").select("*").in("quiz_id", quizIds).order("sort_order", { ascending: true });
  if (qErr) throw qErr;

  const questionIds = (questions ?? []).map((q) => q.id);
  const { data: options, error: oErr } = questionIds.length
    ? await supabase.from("quiz_options").select("*").in("question_id", questionIds).order("sort_order", { ascending: true })
    : { data: [], error: null };
  if (oErr) throw oErr;

  const optionsByQuestion = new Map<string, QuizOption[]>();
  for (const o of options ?? []) {
    const list = optionsByQuestion.get(o.question_id) ?? [];
    list.push(o);
    optionsByQuestion.set(o.question_id, list);
  }

  const questionsByQuiz = new Map<string, StaffQuizQuestion[]>();
  for (const q of questions ?? []) {
    const list = questionsByQuiz.get(q.quiz_id) ?? [];
    list.push({ question: q, options: optionsByQuestion.get(q.id) ?? [] });
    questionsByQuiz.set(q.quiz_id, list);
  }

  const byLesson: Record<string, StaffQuiz> = {};
  for (const quiz of quizzes) byLesson[quiz.lesson_id] = { quiz, questions: questionsByQuiz.get(quiz.id) ?? [] };
  return byLesson;
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
