"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { getLesson } from "@/lib/data/lessons";
import {
  EditableLessonSchema,
  normaliseSubject,
  type StoredLesson,
} from "@/lib/school/lesson-types";

// Editing lessons. Writing one is a route handler because it streams (see
// src/lib/school/lesson-stream.ts); everything else is an ordinary action.
//
// Each one re-checks that the caller may author in this space rather than
// trusting the UI, and RLS refuses the write regardless.

export type LessonActionState = { error: string } | undefined;

// Saves a hand-edited lesson. The model gets things wrong — a date, a name, a
// sentence pitched at the wrong age — and a teaching library nobody can correct
// is one nobody trusts.
//
// The document arrives as JSON rather than as form fields: it is a nested
// structure with variable-length lists, and flattening that into FormData keys
// only to rebuild it here would be its own source of bugs. It is validated
// before it is written, so what lands in the column is always the stored shape.
export async function updateLesson(
  _prevState: LessonActionState,
  formData: FormData
): Promise<LessonActionState> {
  const lessonId = String(formData.get("lesson_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("lesson") ?? ""));
  } catch {
    return { error: "That edit couldn't be read. Try again." };
  }

  const parsed = EditableLessonSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "That edit came back in an unexpected shape and wasn't saved." };
  }

  const title = parsed.data.title.trim();
  if (!title) return { error: "Give the lesson a title." };

  const supabase = await createClient();

  const lesson = await getLesson(supabase, lessonId);
  if (!lesson) return { error: "Lesson not found." };

  const auth = await authorizeLessonAuthor(supabase, lesson.space_id);
  if (!auth.ok) return { error: auth.error };

  const subject = normaliseSubject(parsed.data.subject);
  const document = { ...parsed.data, title, subject } as StoredLesson;

  // title and subject are denormalised onto the row so the library can sort and
  // group without reading every document — keep them in step with the edit.
  const { error } = await supabase
    .from("space_lessons")
    .update({ lesson: document, title, subject })
    .eq("id", lessonId);

  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lessonId}`);
}

// Publishes a lesson to the space, or takes it back.
//
// The author decides, and so may staff — they answer for what is in their
// space. RLS is the backstop: a lesson turned private is unreachable to
// everyone else, not merely unlisted.
export async function setLessonVisibility(
  _prevState: LessonActionState,
  formData: FormData
): Promise<LessonActionState> {
  const lessonId = String(formData.get("lesson_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const isPublic = formData.get("is_public") === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const lesson = await getLesson(supabase, lessonId);
  if (!lesson) return { error: "Lesson not found." };

  // Its author needs no further standing; anyone else must be staff here.
  if (lesson.created_by !== user.id) {
    const auth = await authorizeLessonAuthor(supabase, lesson.space_id);
    if (!auth.ok) return { error: auth.error };
  }

  const { error } = await supabase
    .from("space_lessons")
    .update({ is_public: isPublic })
    .eq("id", lessonId);

  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lessonId}`);
}

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
