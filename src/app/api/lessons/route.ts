// POST /api/lessons
//
// Takes pasted source material, has Claude write an age-appropriate lesson from
// it, saves it into a Lessons space, and streams progress back.
//
// A route handler rather than a server action because the response is streamed:
// see the note at the top of src/lib/school/lesson-stream.ts.
//
// Auth, validation and quota failures answer as plain JSON with a real status
// code, since they happen before the stream opens. Once the stream is open,
// every outcome — including failure — is an NDJSON event.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { consumeLessonQuota } from "@/lib/school/lesson-quota";
import { streamLesson } from "@/lib/school/lesson-stream";
import {
  DEFAULT_AGE_BAND,
  MAX_SOURCE_CHARS,
  MIN_SOURCE_CHARS,
  isAgeBandKey,
} from "@/lib/school/lesson-types";

export const dynamic = "force-dynamic";

// Writing a lesson from a long paste can run well past a minute. Vercel Pro
// allows up to 300s; the client waits slightly longer than this so a
// server-side timeout reports itself rather than being cut off blind.
export const maxDuration = 300;

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400, headers: NO_STORE });
  }

  const payload = body as { spaceId?: unknown; sourceText?: unknown; ageBand?: unknown };
  const spaceId = typeof payload.spaceId === "string" ? payload.spaceId : "";
  if (!spaceId) {
    return NextResponse.json({ error: "Which space?" }, { status: 400, headers: NO_STORE });
  }

  const auth = await authorizeLessonAuthor(supabase, spaceId);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: NO_STORE });
  }

  const sourceText = typeof payload.sourceText === "string" ? payload.sourceText.trim() : "";
  const requestedBand = typeof payload.ageBand === "string" ? payload.ageBand : DEFAULT_AGE_BAND;

  if (sourceText.length < MIN_SOURCE_CHARS) {
    return NextResponse.json(
      { error: `Paste at least ${MIN_SOURCE_CHARS} characters to build a lesson from.` },
      { status: 400, headers: NO_STORE }
    );
  }

  if (sourceText.length > MAX_SOURCE_CHARS) {
    return NextResponse.json(
      {
        error: `That's ${sourceText.length.toLocaleString()} characters — paste ${MAX_SOURCE_CHARS.toLocaleString()} or fewer.`,
      },
      { status: 400, headers: NO_STORE }
    );
  }

  if (!isAgeBandKey(requestedBand)) {
    return NextResponse.json({ error: "Unknown age band." }, { status: 400, headers: NO_STORE });
  }

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
  });
}
