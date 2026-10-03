// Whether a Lessons space already has a lesson made from a link.
//
// Asked by the routes that read a link in (a page, or a video to transcribe)
// before they spend anything, so pasting the same link twice is answered with
// the lesson that already exists. See lesson-link-key.ts for what counts as
// "the same link".

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { lessonLinkKey } from "./lesson-link-key";

export type LessonFromLink = { id: string; title: string };

export async function findLessonFromLink(
  supabase: SupabaseClient<Database>,
  spaceId: string,
  url: string
): Promise<LessonFromLink | null> {
  const key = lessonLinkKey(url);
  if (!key) return null;

  // Compared here rather than in SQL because the key folds spellings together
  // that no column holds. A space's link-made lessons are a short list.
  const { data } = await supabase
    .from("space_lessons")
    .select("id, title, source_url, video_url, created_at")
    .eq("space_id", spaceId)
    .or("source_url.not.is.null,video_url.not.is.null")
    .order("created_at", { ascending: true });

  const match = (data ?? []).find(
    (lesson) => lessonLinkKey(lesson.source_url) === key || lessonLinkKey(lesson.video_url) === key
  );
  return match ? { id: match.id, title: match.title } : null;
}

// The answer a route gives when the link is taken. 409, with the lesson, so
// the composer can link to it and offer to go ahead anyway.
export function lessonExistsError(lesson: LessonFromLink): { error: string; existingLesson: LessonFromLink } {
  return {
    error: `You've already made a lesson from this link: "${lesson.title}".`,
    existingLesson: lesson,
  };
}
