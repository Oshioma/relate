// POST /api/lessons/<id>/rewrite   { ageBand }
//
// Writes the same material again for a different age group. Every lesson keeps
// the text it was built from, so this needs nothing from the teacher but a
// choice of band — which is the feature that makes the library worth having in
// a school: one text, one lesson per year group.
//
// The result is a new lesson, not a replacement: the point is usually to have
// both.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { consumeLessonQuota } from "@/lib/school/lesson-quota";
import { streamLesson } from "@/lib/school/lesson-stream";
import { getLesson } from "@/lib/data/lessons";
import { MIN_SOURCE_CHARS, canGoBeyondSource, isAgeBandKey } from "@/lib/school/lesson-types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400, headers: NO_STORE });
  }

  const requestedBand = (body as { ageBand?: unknown }).ageBand;
  if (typeof requestedBand !== "string" || !isAgeBandKey(requestedBand)) {
    return NextResponse.json({ error: "Unknown age band." }, { status: 400, headers: NO_STORE });
  }

  // "Go deeper" leaves the source behind, so it is checked here rather than
  // trusted from the client: a request naming a child band is refused outright
  // rather than quietly downgraded, because silently ignoring the flag would
  // hand back a lesson that is not the one that was asked for.
  const beyondSource = (body as { beyondSource?: unknown }).beyondSource === true;
  if (beyondSource && !canGoBeyondSource(requestedBand)) {
    return NextResponse.json(
      { error: "Going beyond the source is only available on an adult age group." },
      { status: 400, headers: NO_STORE }
    );
  }

  // RLS scopes this to lessons in spaces the caller can see.
  const lesson = await getLesson(supabase, id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404, headers: NO_STORE });
  }

  // Seeing a lesson is not the same as being allowed to write one.
  const auth = await authorizeLessonAuthor(supabase, lesson.space_id);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: NO_STORE });
  }

  const sourceText = (lesson.source_text ?? "").trim();
  if (sourceText.length < MIN_SOURCE_CHARS) {
    return NextResponse.json(
      {
        error:
          "This lesson didn't keep the text it was built from, so it can't be rewritten. Paste the material again instead.",
      },
      { status: 422, headers: NO_STORE }
    );
  }

  // Rewriting to the band a lesson is already in produces a duplicate — unless
  // this is "go deeper", which is a genuinely different lesson from the same
  // material and is allowed to share its age.
  if (lesson.age_band === requestedBand && !beyondSource) {
    return NextResponse.json(
      { error: "That's the age group this lesson is already written for." },
      { status: 400, headers: NO_STORE }
    );
  }

  // A rewrite is a full model call, so it counts against the same quota.
  const quota = await consumeLessonQuota(supabase, auth.userId);
  if (!quota.allowed) {
    return NextResponse.json({ error: quota.message }, { status: 429, headers: NO_STORE });
  }

  return streamLesson({
    supabase,
    spaceId: auth.space.id,
    communityId: auth.space.community_id,
    userId: auth.userId,
    sourceText,
    ageBand: requestedBand,
    beyondSource,
    // A rewrite is the same material for a different reader, so it came from
    // wherever the original did. Losing the reference on a rewrite would make
    // provenance depend on which copy somebody happened to open.
    sourceUrl: lesson.source_url,
    sourceTitle: lesson.source_title,
  });
}
