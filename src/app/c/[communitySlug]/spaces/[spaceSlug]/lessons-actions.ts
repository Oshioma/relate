"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { getLesson } from "@/lib/data/lessons";
import type { StoredLesson } from "@/lib/school/lesson-types";

// Editing lessons. Writing one is a route handler because it streams (see
// src/lib/school/lesson-stream.ts); everything else is an ordinary action.
//
// Each one re-checks that the caller may author in this space rather than
// trusting the UI, and RLS refuses the write regardless.

export type LessonActionState = { error: string } | undefined;

export async function deleteLesson(
  _prevState: LessonActionState,
  formData: FormData
): Promise<LessonActionState> {
  const lessonId = String(formData.get("lesson_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");

  const supabase = await createClient();

  const lesson = await getLesson(supabase, lessonId);
  if (!lesson) return { error: "Lesson not found." };

  const auth = await authorizeLessonAuthor(supabase, lesson.space_id);
  if (!auth.ok) return { error: auth.error };

  const { error } = await supabase.from("space_lessons").delete().eq("id", lessonId);
  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  redirect(`/c/${communitySlug}/spaces/${spaceSlug}`);
}

// Takes one picture off a lesson. The commonest edit by far: an image search is
// a guess, and a wrong picture in front of a class is worse than none.
export async function removeLessonImage(
  _prevState: LessonActionState,
  formData: FormData
): Promise<LessonActionState> {
  const lessonId = String(formData.get("lesson_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const sectionIndex = Number(formData.get("section_index"));

  if (!Number.isInteger(sectionIndex) || sectionIndex < 0) {
    return { error: "Unknown section." };
  }

  const supabase = await createClient();

  const lesson = await getLesson(supabase, lessonId);
  if (!lesson) return { error: "Lesson not found." };

  const auth = await authorizeLessonAuthor(supabase, lesson.space_id);
  if (!auth.ok) return { error: auth.error };

  const document = lesson.lesson;
  if (sectionIndex >= (document.sections?.length ?? 0)) {
    return { error: "Unknown section." };
  }

  const updated: StoredLesson = {
    ...document,
    sections: document.sections.map((section, i) =>
      i === sectionIndex ? { ...section, image: null } : section
    ),
  };

  const { error } = await supabase
    .from("space_lessons")
    .update({ lesson: updated })
    .eq("id", lessonId);

  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lessonId}`);
}
