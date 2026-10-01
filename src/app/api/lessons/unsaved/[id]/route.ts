// POST /api/lessons/unsaved/<id>
//
// "Save it now": moves a lesson that was written but couldn't be saved into the
// library, exactly as it was written. No model call, so nothing is charged and
// no quota is used.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { saveUnsavedLesson, unsavedLessonSpace } from "@/lib/school/unsaved-lessons";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();

  const spaceId = await unsavedLessonSpace(id);
  if (!spaceId) {
    return NextResponse.json(
      { error: "That unsaved lesson isn't there any more." },
      { status: 404, headers: NO_STORE }
    );
  }

  // Still allowed to write lessons in that space?
  const auth = await authorizeLessonAuthor(supabase, spaceId);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: NO_STORE });
  }

  const result = await saveUnsavedLesson(supabase, auth.userId, id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status, headers: NO_STORE });
  }
  return NextResponse.json({ row: { id: result.row.id } }, { headers: NO_STORE });
}
