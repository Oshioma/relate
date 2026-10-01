// POST /api/lessons/<id>/rewrite   { ageBand }
//
// Adds another age level to a lesson. Every lesson keeps the text it was built
// from, so this needs nothing from the teacher but a choice of band — which is
// the feature that makes the library worth having in a school: one text, one
// page, a level for each year group.
//
// The new level joins the lesson's family and shows on the same page. When it
// is older than levels that already exist, the writer is handed those younger
// levels and told to pick up where they stop rather than repeat them — so a
// reader can skim the earlier levels and carry on down as far as they like.
//
// The Adult level goes beyond the source; that is decided by the band, not
// asked for, so the client cannot turn it on for a child band or off for adults.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { consumeLessonQuota } from "@/lib/school/lesson-quota";
import { checkAiAllowance } from "@/lib/usage/ai-spend";
import { streamLesson } from "@/lib/school/lesson-stream";
import { getLesson, getLessonFamily } from "@/lib/data/lessons";
import {
  MIN_SOURCE_CHARS,
  ageBandLabel,
  ageBandRank,
  canGoBeyondSource,
  isAgeBandKey,
} from "@/lib/school/lesson-types";

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

  // One level per age on a page. A second one at the same age is the
  // near-duplicate this whole arrangement exists to get rid of; to redo a level,
  // delete it and add it again.
  const family = await getLessonFamily(supabase, lesson);
  if (family.some((level) => level.age_band === requestedBand)) {
    return NextResponse.json(
      {
        error: `This lesson already has a level for ${ageBandLabel(requestedBand)}. Delete that level first if you want it written again.`,
      },
      { status: 400, headers: NO_STORE }
    );
  }

  // A rewrite is a full model call, so it counts against the same quota.
  // The community's free monthly AI allowance, unless it is exempt or
  // subscribed. Checked before the daily quota so a refusal here doesn't
  // also use up one of the person's daily lessons.
  const allowance = await checkAiAllowance(auth.space.community_id, auth.userId);
  if (!allowance.allowed) {
    return NextResponse.json({ error: allowance.message }, { status: 402, headers: NO_STORE });
  }

  const quota = await consumeLessonQuota(supabase, auth.userId);
  if (!quota.allowed) {
    return NextResponse.json({ error: quota.message }, { status: 429, headers: NO_STORE });
  }

  // Everything younger than the new level, youngest first — what its reader
  // has already been through on the way down the page.
  const earlierLevels = family
    .filter((level) => ageBandRank(level.age_band) < ageBandRank(requestedBand))
    .map((level) => ({ ageBand: level.age_band, lesson: level.lesson }));

  return streamLesson({
    supabase,
    spaceId: auth.space.id,
    communityId: auth.space.community_id,
    userId: auth.userId,
    sourceText,
    ageBand: requestedBand,
    beyondSource: canGoBeyondSource(requestedBand),
    familyId: lesson.family_id,
    earlierLevels,
    // Another level of the same material, so it came from wherever the
    // original did. Losing the reference would make provenance depend on
    // which level somebody happened to open.
    sourceUrl: lesson.source_url,
    sourceTitle: lesson.source_title,
    videoUrl: lesson.video_url,
    // Already vouched for when the first level was written; possibly another
    // teacher's upload, which is fine — it is the same lesson's recording.
    mediaPath: lesson.media_path,
  });
}
