// GET    /api/lessons/batch-jobs/<id>   bring a background job up to date
// DELETE /api/lessons/batch-jobs/<id>   stop it
//
// The lesson page polls GET while it's open; each call moves the job on if its
// current level has come back. See src/lib/school/lesson-batch.ts.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { batchJobStatus, cancelBatchJob, getBatchJob, syncBatchJob } from "@/lib/school/lesson-batch";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "no-store" };

async function authorised(id: string) {
  const supabase = await createClient();
  const job = await getBatchJob(id);
  if (!job) return { error: NextResponse.json({ error: "Not found." }, { status: 404, headers: NO_STORE }) };
  const auth = await authorizeLessonAuthor(supabase, job.space_id);
  if (!auth.ok) {
    return { error: NextResponse.json({ error: auth.error }, { status: auth.status, headers: NO_STORE }) };
  }
  return { job };
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const found = await authorised(id);
  if ("error" in found) return found.error;
  const job = await syncBatchJob(found.job);
  return NextResponse.json({ job: batchJobStatus(job) }, { headers: NO_STORE });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const found = await authorised(id);
  if ("error" in found) return found.error;
  const job = await cancelBatchJob(found.job);
  return NextResponse.json({ job: batchJobStatus(job) }, { headers: NO_STORE });
}
