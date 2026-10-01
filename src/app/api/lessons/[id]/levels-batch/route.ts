// POST /api/lessons/<id>/levels-batch   { bands?: string[] }
//
// Writes the ages this lesson doesn't have yet, in the background, at half
// price — one level after another, youngest first, so each older level still
// builds on the ones before it. See src/lib/school/lesson-batch.ts.
//
// With no bands given, every missing age is queued.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { consumeLessonQuota } from "@/lib/school/lesson-quota";
import { checkAiAllowance } from "@/lib/usage/ai-spend";
import { getLesson, getLessonFamily } from "@/lib/data/lessons";
import { activeBatchJob, batchJobStatus, startBatchJob } from "@/lib/school/lesson-batch";
import { AGE_BAND_KEYS, MIN_SOURCE_CHARS, isAgeBandKey, type AgeBandKey } from "@/lib/school/lesson-types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();

  const body = (await request.json().catch(() => ({}))) as { bands?: unknown };

  const lesson = await getLesson(supabase, id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404, headers: NO_STORE });
  }

  const auth = await authorizeLessonAuthor(supabase, lesson.space_id);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: NO_STORE });
  }

  if ((lesson.source_text ?? "").trim().length < MIN_SOURCE_CHARS) {
    return NextResponse.json(
      { error: "This lesson didn't keep the text it was built from, so it can't be rewritten." },
      { status: 422, headers: NO_STORE }
    );
  }

  // One background job per lesson at a time.
  const running = await activeBatchJob(lesson.family_id, lesson.space_id);
  if (running) {
    return NextResponse.json({ job: batchJobStatus(running) }, { headers: NO_STORE });
  }

  const family = await getLessonFamily(supabase, lesson);
  const have = new Set(family.map((level) => level.age_band));
  const requested = Array.isArray(body.bands)
    ? body.bands.filter((b): b is AgeBandKey => typeof b === "string" && isAgeBandKey(b))
    : AGE_BAND_KEYS;
  const bands = requested.filter((b) => !have.has(b));
  if (bands.length === 0) {
    return NextResponse.json(
      { error: "This lesson already has every age." },
      { status: 400, headers: NO_STORE }
    );
  }

  const allowance = await checkAiAllowance(auth.space.community_id, auth.userId);
  if (!allowance.allowed) {
    return NextResponse.json({ error: allowance.message }, { status: 402, headers: NO_STORE });
  }

  // Each level is one lesson against the person's daily limit, counted now.
  for (let i = 0; i < bands.length; i += 1) {
    const quota = await consumeLessonQuota(supabase, auth.userId);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.message }, { status: 429, headers: NO_STORE });
    }
  }

  try {
    const job = await startBatchJob({
      spaceId: auth.space.id,
      communityId: auth.space.community_id,
      userId: auth.userId,
      familyId: lesson.family_id,
      sourceLessonId: lesson.id,
      bands,
    });
    return NextResponse.json({ job: batchJobStatus(job) }, { headers: NO_STORE });
  } catch (error) {
    console.error("Could not start lesson batch job", error);
    return NextResponse.json(
      { error: "Couldn't start writing the levels. Try again in a minute." },
      { status: 500, headers: NO_STORE }
    );
  }
}
