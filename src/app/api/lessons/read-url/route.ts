// Read a web page into the lesson composer.
//
// Its own route rather than part of POST /api/lessons: reading a page and
// writing a lesson are separate decisions. Somebody pastes a link, sees what
// came back, edits it, and only then asks for a lesson — which also means a
// page that reads badly costs nothing but a look.
//
// Staff-only and metered, for the same reason the writer is: it spends money.

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { consumeLessonQuota } from "@/lib/school/lesson-quota";
import { readUrl } from "@/lib/ai/read-url";
import { MAX_SOURCE_CHARS } from "@/lib/school/lesson-types";

export const maxDuration = 90;

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400, headers: NO_STORE });
  }

  const payload = body as { spaceId?: unknown; url?: unknown };
  const spaceId = typeof payload.spaceId === "string" ? payload.spaceId : "";
  const url = typeof payload.url === "string" ? payload.url : "";

  if (!spaceId) {
    return NextResponse.json({ error: "Which space?" }, { status: 400, headers: NO_STORE });
  }
  if (!url.trim()) {
    return NextResponse.json({ error: "Paste a link first." }, { status: 400, headers: NO_STORE });
  }

  // Same gate as writing a lesson: this is authoring, and it costs money.
  const auth = await authorizeLessonAuthor(supabase, spaceId);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: NO_STORE });
  }

  // Shares the daily lesson allowance rather than having one of its own. A
  // page read is cheaper than a lesson, but it is the same budget and the
  // same person, and one counter is one thing to explain.
  const quota = await consumeLessonQuota(supabase, auth.userId);
  if (!quota.allowed) {
    return NextResponse.json({ error: quota.message }, { status: 429, headers: NO_STORE });
  }

  const result = await readUrl(url);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422, headers: NO_STORE });
  }

  // A very long page is trimmed rather than refused: the composer shows what
  // came back and says it was cut, which beats "that page is too long" when
  // the first half was exactly what somebody wanted.
  const text = result.text.slice(0, MAX_SOURCE_CHARS);

  return NextResponse.json(
    { text, title: result.title, truncated: text.length < result.text.length },
    { headers: NO_STORE }
  );
}
