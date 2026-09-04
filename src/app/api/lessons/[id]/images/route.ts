// POST /api/lessons/<id>/images
//
// Finds pictures for a lesson that doesn't have them — one whose image lookup
// ran out of time inside the generation budget. Cheap and model-free: it only
// searches openly-licensed image catalogues, so it is deliberately NOT metered
// against the lesson quota.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { attachImages, sectionSearchPhrase } from "@/lib/ai/lesson-writer";
import { getLesson } from "@/lib/data/lessons";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();

  const lesson = await getLesson(supabase, id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404, headers: NO_STORE });
  }

  const auth = await authorizeLessonAuthor(supabase, lesson.space_id);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: NO_STORE });
  }

  const document = lesson.lesson;

  // Lessons whose sections carry no search phrase fall back to their headings,
  // so only a lesson with no usable text at all is refused.
  const hasQueries = (document.sections ?? []).some((section) =>
    sectionSearchPhrase(section, document.title)
  );
  if (!hasQueries) {
    return NextResponse.json(
      { error: "This lesson has no headings to search on." },
      { status: 422, headers: NO_STORE }
    );
  }

  const { lesson: illustrated, found } = await attachImages(document);

  if (found === 0) {
    return NextResponse.json(
      { error: "No pictures found for this lesson." },
      { status: 404, headers: NO_STORE }
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("space_lessons")
    .update({ lesson: illustrated })
    .eq("id", id)
    .select("*")
    .single();

  if (updateError || !updated) {
    return NextResponse.json(
      { error: "Found pictures but could not save them." },
      { status: 500, headers: NO_STORE }
    );
  }

  return NextResponse.json({ row: updated, found }, { headers: NO_STORE });
}
