import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SpaceLesson } from "@/types/database";
import { toLessonRow, type LessonRow } from "@/lib/school/lesson-types";

type Client = SupabaseClient<Database>;

// Lessons are space-scoped, and RLS already limits every read to spaces the
// caller can view (including anonymously, for a public space) — so none of
// these re-check membership. The callers that WRITE do, because authoring is
// staff-only and RLS is the backstop, not the message.

export async function getSpaceLessons(supabase: Client, spaceId: string): Promise<LessonRow[]> {
  const { data, error } = await supabase
    .from("space_lessons")
    .select("*, creator:created_by (full_name, username, avatar_url)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  // Browsing never needs the pasted material, and the space view is a client
  // component — so without this every lesson's full source ships in the page
  // payload of anyone who can see the space, whatever the source panel shows.
  // One lesson at a time is the only place it is ever wanted.
  return ((data ?? []) as unknown as SpaceLesson[]).map((row) => toLessonRow(redactSource(row)));
}

// Blanks the source material and its reference. Applied on the way out of the
// data layer rather than by omitting columns from the SELECT, so a column
// added later is not silently dropped from every read.
//
// source_text is the material somebody pasted, and it is private by default:
// a lesson can be public while the chapter it was built from is not. Only the
// lesson page shows it, and only to staff or when the author has published it.
export function redactSource<T extends SpaceLesson>(row: T): T {
  return { ...row, source_text: "", source_url: null, source_title: null };
}

export async function getLesson(supabase: Client, lessonId: string): Promise<LessonRow | null> {
  const { data, error } = await supabase
    .from("space_lessons")
    .select("*, creator:created_by (full_name, username, avatar_url)")
    .eq("id", lessonId)
    .maybeSingle();

  if (error) throw error;
  return data ? toLessonRow(data as unknown as SpaceLesson) : null;
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

// --- Saved lessons -----------------------------------------------------------
//
// A save is private to whoever made it (see the lesson_saves migration), so
// these all read as the caller and RLS does the scoping. Nothing here needs to
// know about staff or spaces.

// The ids this viewer has saved, out of a set the page already has. Returns an
// empty set for a signed-out visitor rather than querying for nobody.
export async function getSavedLessonIds(
  supabase: Client,
  userId: string,
  lessonIds: string[]
): Promise<Set<string>> {
  if (!userId || lessonIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from("lesson_saves")
    .select("lesson_id")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);

  // A failure here costs a bookmark icon, not the library — the lessons still
  // render, just without their saved state.
  if (error) {
    console.error("Could not read saved lessons", error);
    return new Set();
  }

  return new Set((data ?? []).map((row) => row.lesson_id));
}

// Marks up rows the page already fetched, so the card can render its own state
// without every card asking the database.
export function withSavedState(lessons: LessonRow[], savedIds: Set<string>): LessonRow[] {
  return lessons.map((lesson) => ({ ...lesson, saved: savedIds.has(lesson.id) }));
}
