"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { arePrerequisitesMet } from "@/lib/data/courses";
import { getProfileByUsername } from "@/lib/data/profile";
import type { CourseStatus } from "@/types/database";

// Revalidate the whole space subtree (list + player + manage) in one call.
function revalidateSpace(communitySlug: string, spaceSlug: string) {
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`, "layout");
}

type ServerClient = Awaited<ReturnType<typeof createClient>>;

async function nextModuleSortOrder(supabase: ServerClient, courseId: string): Promise<number> {
  const { data } = await supabase
    .from("course_modules")
    .select("sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const top = data?.[0]?.sort_order;
  return typeof top === "number" ? top + 1 : 0;
}

async function nextLessonSortOrder(supabase: ServerClient, moduleId: string): Promise<number> {
  const { data } = await supabase
    .from("course_lessons")
    .select("sort_order")
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const top = data?.[0]?.sort_order;
  return typeof top === "number" ? top + 1 : 0;
}

// -----------------------------------------------------------------------------
// Courses
// -----------------------------------------------------------------------------
export type CreateCourseResult = { error: string } | { courseId: string };

export async function createCourse(_prevState: CreateCourseResult | undefined, formData: FormData): Promise<CreateCourseResult> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();

  if (!title) return { error: "Give the course a title." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { data: course, error } = await supabase
    .from("courses")
    .insert({
      space_id: spaceId,
      community_id: communityId,
      created_by: user.id,
      instructor_id: user.id,
      title,
      summary: summary || null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidateSpace(communitySlug, spaceSlug);
  return { courseId: course.id };
}

export type CourseFormState = { error: string } | { ok: true } | undefined;

export async function updateCourseSettings(_prevState: CourseFormState, formData: FormData): Promise<CourseFormState> {
  const courseId = String(formData.get("course_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();

  if (!title) return { error: "The course needs a title." };

  const supabase = await createClient();
  const { error } = await supabase.from("courses").update({ title, summary: summary || null }).eq("id", courseId);
  if (error) return { error: error.message };

  revalidateSpace(communitySlug, spaceSlug);
  return { ok: true };
}

export async function updateCourseCover(courseId: string, coverImageUrl: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("courses").update({ cover_image_url: coverImageUrl || null }).eq("id", courseId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function setCourseStatus(courseId: string, status: CourseStatus, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("courses").update({ status }).eq("id", courseId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function deleteCourse(courseId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------
export async function createModule(courseId: string, communityId: string, title: string, communitySlug: string, spaceSlug: string) {
  const trimmed = title.trim();
  if (!trimmed) return { error: "Give the module a title." };

  const supabase = await createClient();
  const sortOrder = await nextModuleSortOrder(supabase, courseId);
  const { error } = await supabase.from("course_modules").insert({ course_id: courseId, community_id: communityId, title: trimmed, sort_order: sortOrder });
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function renameModule(moduleId: string, title: string, communitySlug: string, spaceSlug: string) {
  const trimmed = title.trim();
  if (!trimmed) return { error: "The module needs a title." };
  const supabase = await createClient();
  const { error } = await supabase.from("course_modules").update({ title: trimmed }).eq("id", moduleId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function deleteModule(moduleId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("course_modules").delete().eq("id", moduleId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// Swap this module's sort_order with its neighbour in the given direction.
export async function moveModule(moduleId: string, direction: "up" | "down", communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { data: current } = await supabase.from("course_modules").select("id, course_id, sort_order").eq("id", moduleId).maybeSingle();
  if (!current) return { error: "Module not found." };

  const { data: siblings } = await supabase
    .from("course_modules")
    .select("id, sort_order")
    .eq("course_id", current.course_id)
    .order("sort_order", { ascending: true });
  if (!siblings) return { error: null };

  const index = siblings.findIndex((m) => m.id === moduleId);
  const neighbourIndex = direction === "up" ? index - 1 : index + 1;
  if (neighbourIndex < 0 || neighbourIndex >= siblings.length) return { error: null };

  const neighbour = siblings[neighbourIndex];
  await Promise.all([
    supabase.from("course_modules").update({ sort_order: neighbour.sort_order }).eq("id", current.id),
    supabase.from("course_modules").update({ sort_order: current.sort_order }).eq("id", neighbour.id),
  ]);
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// -----------------------------------------------------------------------------
// Lessons
// -----------------------------------------------------------------------------
function parseDuration(raw: FormDataEntryValue | null): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

export type LessonFormState = { error: string } | { ok: true } | undefined;

export async function createLesson(_prevState: LessonFormState, formData: FormData): Promise<LessonFormState> {
  const moduleId = String(formData.get("module_id") ?? "");
  const courseId = String(formData.get("course_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  const durationMinutes = parseDuration(formData.get("duration_minutes"));

  if (!title) return { error: "Give the lesson a title." };

  const supabase = await createClient();
  const sortOrder = await nextLessonSortOrder(supabase, moduleId);
  const { error } = await supabase.from("course_lessons").insert({
    module_id: moduleId,
    course_id: courseId,
    community_id: communityId,
    title,
    body: body || null,
    video_url: videoUrl || null,
    duration_minutes: durationMinutes,
    sort_order: sortOrder,
  });
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { ok: true };
}

export async function updateLesson(_prevState: LessonFormState, formData: FormData): Promise<LessonFormState> {
  const lessonId = String(formData.get("lesson_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  const durationMinutes = parseDuration(formData.get("duration_minutes"));

  if (!title) return { error: "The lesson needs a title." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("course_lessons")
    .update({ title, body: body || null, video_url: videoUrl || null, duration_minutes: durationMinutes })
    .eq("id", lessonId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { ok: true };
}

export async function deleteLesson(lessonId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("course_lessons").delete().eq("id", lessonId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function moveLesson(lessonId: string, direction: "up" | "down", communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { data: current } = await supabase.from("course_lessons").select("id, module_id, sort_order").eq("id", lessonId).maybeSingle();
  if (!current) return { error: "Lesson not found." };

  const { data: siblings } = await supabase
    .from("course_lessons")
    .select("id, sort_order")
    .eq("module_id", current.module_id)
    .order("sort_order", { ascending: true });
  if (!siblings) return { error: null };

  const index = siblings.findIndex((l) => l.id === lessonId);
  const neighbourIndex = direction === "up" ? index - 1 : index + 1;
  if (neighbourIndex < 0 || neighbourIndex >= siblings.length) return { error: null };

  const neighbour = siblings[neighbourIndex];
  await Promise.all([
    supabase.from("course_lessons").update({ sort_order: neighbour.sort_order }).eq("id", current.id),
    supabase.from("course_lessons").update({ sort_order: current.sort_order }).eq("id", neighbour.id),
  ]);
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// -----------------------------------------------------------------------------
// Enrollment + progress (member self-service)
// -----------------------------------------------------------------------------
export async function enrollInCourse(courseId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  // Paid courses can't be self-enrolled — they need a purchase or a staff grant.
  const { data: course } = await supabase.from("courses").select("price_cents").eq("id", courseId).maybeSingle();
  if (course && course.price_cents > 0) return { error: "This is a paid course — buy it to enrol." };

  // Prerequisites are enforced here (RLS can't express "completed course X").
  if (!(await arePrerequisitesMet(supabase, courseId, user.id))) {
    return { error: "Finish this course's prerequisites first." };
  }

  const { error } = await supabase.from("course_enrollments").insert({ course_id: courseId, user_id: user.id });
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function unenrollFromCourse(courseId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase.from("course_enrollments").delete().eq("course_id", courseId).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function markLessonComplete(
  lessonId: string,
  courseId: string,
  communityId: string,
  communitySlug: string,
  spaceSlug: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase
    .from("lesson_completions")
    .upsert({ lesson_id: lessonId, course_id: courseId, community_id: communityId, user_id: user.id }, { onConflict: "lesson_id,user_id" });
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function unmarkLessonComplete(lessonId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase.from("lesson_completions").delete().eq("lesson_id", lessonId).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// -----------------------------------------------------------------------------
// v2 — Lesson Q&A
// -----------------------------------------------------------------------------
export async function addLessonComment(
  lessonId: string,
  courseId: string,
  communityId: string,
  body: string,
  communitySlug: string,
  spaceSlug: string
) {
  const trimmed = body.trim();
  if (!trimmed) return { error: "Write something first." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase
    .from("lesson_comments")
    .insert({ lesson_id: lessonId, course_id: courseId, community_id: communityId, author_id: user.id, body: trimmed });
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function deleteLessonComment(commentId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("lesson_comments").delete().eq("id", commentId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// -----------------------------------------------------------------------------
// v2 — Drip scheduling & certificates (staff)
// -----------------------------------------------------------------------------
export async function setModuleDrip(moduleId: string, availableAt: string | null, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const value = availableAt && availableAt.trim() ? availableAt : null;
  const { error } = await supabase.from("course_modules").update({ available_at: value }).eq("id", moduleId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function setCertificateEnabled(courseId: string, enabled: boolean, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("courses").update({ certificate_enabled: enabled }).eq("id", courseId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// -----------------------------------------------------------------------------
// v2 — Course announcements (staff)
// -----------------------------------------------------------------------------
export async function createAnnouncement(_prevState: CourseFormState, formData: FormData): Promise<CourseFormState> {
  const courseId = String(formData.get("course_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!title) return { error: "Give the announcement a title." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase
    .from("course_announcements")
    .insert({ course_id: courseId, community_id: communityId, author_id: user.id, title, body: body || null });
  if (error) return { error: error.message };

  revalidateSpace(communitySlug, spaceSlug);
  return { ok: true };
}

export async function deleteAnnouncement(announcementId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("course_announcements").delete().eq("id", announcementId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// -----------------------------------------------------------------------------
// v3 — Pricing & access (staff)
// -----------------------------------------------------------------------------
export async function setCoursePrice(courseId: string, priceCents: number, currency: string, communitySlug: string, spaceSlug: string) {
  const price = Number.isFinite(priceCents) && priceCents >= 0 ? Math.round(priceCents) : 0;
  const supabase = await createClient();
  const { error } = await supabase.from("courses").update({ price_cents: price, currency: currency || "usd" }).eq("id", courseId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// Staff grant a member access to a course (the working path for paid courses
// until a payment provider is connected).
export async function grantCourseAccess(courseId: string, username: string, communitySlug: string, spaceSlug: string) {
  const handle = username.trim().replace(/^@/, "").toLowerCase();
  if (!handle) return { error: "Enter a member's username." };

  const supabase = await createClient();
  const profile = await getProfileByUsername(supabase, handle);
  if (!profile) return { error: `No member found with username "${handle}".` };

  const { error } = await supabase.from("course_enrollments").upsert(
    { course_id: courseId, user_id: profile.id, paid: true },
    { onConflict: "course_id,user_id" }
  );
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// Buying a paid course. A payment provider (e.g. Stripe Checkout) would be
// invoked here; until one is connected we degrade honestly rather than granting
// access for free.
export async function purchaseCourse(courseId: string, communitySlug: string, spaceSlug: string) {
  // These identify the course/return path a real checkout session would use;
  // referenced here so the stub keeps the final signature.
  void courseId;
  void communitySlug;
  void spaceSlug;
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Paid enrolment isn't available yet — this community hasn't connected a payment method. Ask a course admin for access." };
  }
  // TODO: create a checkout session, redirect, and grant a paid enrolment on
  // the payment webhook. Left unimplemented until a provider is configured.
  return { error: "Checkout isn't wired up yet." };
}

// -----------------------------------------------------------------------------
// v3 — Prerequisites (staff)
// -----------------------------------------------------------------------------
export async function addPrerequisite(courseId: string, communityId: string, prerequisiteCourseId: string, communitySlug: string, spaceSlug: string) {
  if (!prerequisiteCourseId) return { error: "Pick a course." };
  if (prerequisiteCourseId === courseId) return { error: "A course can't require itself." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("course_prerequisites")
    .insert({ course_id: courseId, prerequisite_course_id: prerequisiteCourseId, community_id: communityId });
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function removePrerequisite(courseId: string, prerequisiteCourseId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("course_prerequisites")
    .delete()
    .eq("course_id", courseId)
    .eq("prerequisite_course_id", prerequisiteCourseId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// -----------------------------------------------------------------------------
// v3 — Quiz authoring (staff)
// -----------------------------------------------------------------------------
async function nextSort(supabase: ServerClient, table: "quiz_questions" | "quiz_options", column: "quiz_id" | "question_id", parentId: string): Promise<number> {
  const { data } =
    table === "quiz_questions"
      ? await supabase.from("quiz_questions").select("sort_order").eq(column as "quiz_id", parentId).order("sort_order", { ascending: false }).limit(1)
      : await supabase.from("quiz_options").select("sort_order").eq(column as "question_id", parentId).order("sort_order", { ascending: false }).limit(1);
  const top = data?.[0]?.sort_order;
  return typeof top === "number" ? top + 1 : 0;
}

export async function createQuiz(lessonId: string, courseId: string, communityId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("course_quizzes").insert({ lesson_id: lessonId, course_id: courseId, community_id: communityId });
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function deleteQuiz(quizId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("course_quizzes").delete().eq("id", quizId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function setQuizPassPercent(quizId: string, passPercent: number, communitySlug: string, spaceSlug: string) {
  const pct = Math.max(0, Math.min(100, Math.round(passPercent)));
  const supabase = await createClient();
  const { error } = await supabase.from("course_quizzes").update({ pass_percent: pct }).eq("id", quizId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function addQuizQuestion(quizId: string, communityId: string, prompt: string, communitySlug: string, spaceSlug: string) {
  const trimmed = prompt.trim();
  if (!trimmed) return { error: "Write the question." };
  const supabase = await createClient();
  const sortOrder = await nextSort(supabase, "quiz_questions", "quiz_id", quizId);
  const { error } = await supabase.from("quiz_questions").insert({ quiz_id: quizId, community_id: communityId, prompt: trimmed, sort_order: sortOrder });
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function deleteQuizQuestion(questionId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("quiz_questions").delete().eq("id", questionId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function addQuizOption(questionId: string, communityId: string, label: string, isCorrect: boolean, communitySlug: string, spaceSlug: string) {
  const trimmed = label.trim();
  if (!trimmed) return { error: "Write the answer option." };
  const supabase = await createClient();
  const sortOrder = await nextSort(supabase, "quiz_options", "question_id", questionId);
  const { error } = await supabase
    .from("quiz_options")
    .insert({ question_id: questionId, community_id: communityId, label: trimmed, is_correct: isCorrect, sort_order: sortOrder });
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function toggleQuizOptionCorrect(optionId: string, isCorrect: boolean, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("quiz_options").update({ is_correct: isCorrect }).eq("id", optionId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

export async function deleteQuizOption(optionId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("quiz_options").delete().eq("id", optionId);
  if (error) return { error: error.message };
  revalidateSpace(communitySlug, spaceSlug);
  return { error: null };
}

// -----------------------------------------------------------------------------
// v3 — Taking a quiz (member). Grading happens in the DB (grade_quiz), so the
// correct answers never reach the client.
// -----------------------------------------------------------------------------
export type QuizResult = { error: string } | { scorePercent: number; passed: boolean };

export async function submitQuizAttempt(quizId: string, selectedOptionIds: string[], communitySlug: string, spaceSlug: string): Promise<QuizResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { data, error } = await supabase.rpc("grade_quiz", { p_quiz_id: quizId, p_selected: selectedOptionIds });
  if (error) return { error: error.message };

  const result = data?.[0];
  if (!result) return { error: "Couldn't grade this attempt." };
  revalidateSpace(communitySlug, spaceSlug);
  return { scorePercent: result.score_percent, passed: result.passed };
}
