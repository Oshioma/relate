import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  SpaceLesson,
  LessonHomework,
  LessonHomeworkCompletion,
} from "@/types/database";
import { toLessonRow, type LessonRow } from "@/lib/school/lesson-types";

type Client = SupabaseClient<Database>;

// Lessons are space-scoped, and RLS already limits every read to spaces the
// caller can view (including anonymously, for a public space) — so none of
// these re-check membership. The callers that WRITE do, because authoring is
// staff-only and RLS is the backstop, not the message.

export async function getSpaceLessons(supabase: Client, spaceId: string): Promise<LessonRow[]> {
  const { data, error } = await supabase
    .from("space_lessons")
    .select("*")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as SpaceLesson[]).map(toLessonRow);
}

export async function getLesson(supabase: Client, lessonId: string): Promise<LessonRow | null> {
  const { data, error } = await supabase
    .from("space_lessons")
    .select("*")
    .eq("id", lessonId)
    .maybeSingle();

  if (error) throw error;
  return data ? toLessonRow(data as SpaceLesson) : null;
}

// How many lessons this space holds, for the space list and nav counts.
export async function countSpaceLessons(supabase: Client, spaceId: string): Promise<number> {
  const { count, error } = await supabase
    .from("space_lessons")
    .select("id", { count: "exact", head: true })
    .eq("space_id", spaceId);

  if (error) throw error;
  return count ?? 0;
}

// --- Homework ---------------------------------------------------------------
//
// A lesson can be sent home more than once (the same material set again next
// term), so "the homework" for a lesson means its most recent assignment.
// Everything below reads through RLS: a member sees their own ticks, staff see
// everyone's.

export type HomeworkWithProgress = LessonHomework & {
  // How many members have ticked it off. Staff-only in practice: RLS hands a
  // member only their own completion rows, so this reads 0 or 1 for them.
  completedCount: number;
  // Whether the viewer has ticked it.
  completedByViewer: boolean;
};

// The current assignment for each of these lessons, keyed by lesson id.
// Lessons with nothing set are absent from the map rather than present as null.
export async function getHomeworkForLessons(
  supabase: Client,
  lessonIds: string[],
  viewerId: string
): Promise<Map<string, HomeworkWithProgress>> {
  if (lessonIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("lesson_homework")
    .select("*")
    .in("lesson_id", lessonIds)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Newest first, so the first row seen for a lesson is its current assignment.
  const current = new Map<string, LessonHomework>();
  for (const row of (data ?? []) as LessonHomework[]) {
    if (!current.has(row.lesson_id)) current.set(row.lesson_id, row);
  }
  if (current.size === 0) return new Map();

  const completions = await getCompletions(supabase, [...current.values()].map((h) => h.id));

  return new Map(
    [...current.entries()].map(([lessonId, homework]) => [
      lessonId,
      withProgress(homework, completions, viewerId),
    ])
  );
}

export async function getLessonHomework(
  supabase: Client,
  lessonId: string,
  viewerId: string
): Promise<HomeworkWithProgress | null> {
  const { data, error } = await supabase
    .from("lesson_homework")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const homework = data as LessonHomework;
  const completions = await getCompletions(supabase, [homework.id]);
  return withProgress(homework, completions, viewerId);
}

async function getCompletions(
  supabase: Client,
  homeworkIds: string[]
): Promise<LessonHomeworkCompletion[]> {
  if (homeworkIds.length === 0) return [];
  const { data, error } = await supabase
    .from("lesson_homework_completions")
    .select("*")
    .in("homework_id", homeworkIds);

  if (error) throw error;
  return (data ?? []) as LessonHomeworkCompletion[];
}

function withProgress(
  homework: LessonHomework,
  completions: LessonHomeworkCompletion[],
  viewerId: string
): HomeworkWithProgress {
  const mine = completions.filter((c) => c.homework_id === homework.id);
  return {
    ...homework,
    completedCount: mine.length,
    completedByViewer: viewerId ? mine.some((c) => c.user_id === viewerId) : false,
  };
}
