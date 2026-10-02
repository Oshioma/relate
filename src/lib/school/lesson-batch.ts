// Writing a lesson's missing ages in the background, at half price.
//
// Anthropic's Message Batches API charges half the normal price but answers
// later — usually minutes, at most a day. The levels have to be written one
// after another, youngest first, because an older level is told what the
// younger ones already covered so it doesn't repeat them. So a job holds a
// queue of age bands and keeps exactly one batch in flight:
//
//   submit the youngest pending band  →  wait  →  save that level
//   →  submit the next band, now knowing what the saved level said  →  …
//
// Nothing runs on a timer. The job moves on whenever somebody looks at it: the
// lesson page syncs it on load and polls it while open. Close the page and it
// waits in Anthropic's queue; open it again and it carries on.
//
// Everything here uses the service-role client. The routes check the caller
// may write lessons in the space before they get here, and a level saved by
// the job belongs to whoever started it.

import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, LessonBatchJob, SpaceLesson } from "@/types/database";
import {
  attachImages,
  lessonRequest,
  lessonSystemPrompt,
  LessonGenerationError,
  readLessonMessage,
} from "@/lib/ai/lesson-writer";
import {
  ageBandLabel,
  ageBandRank,
  canGoBeyondSource,
  isAgeBandKey,
  toLessonRow,
  type AgeBandKey,
} from "@/lib/school/lesson-types";
import { buildLessonRow } from "@/lib/school/lesson-stream";
import { parkUnsavedLesson } from "@/lib/school/unsaved-lessons";
import { checkAiAllowance, recordAiSpend } from "@/lib/usage/ai-spend";
import { getUsageRates } from "@/lib/usage/pricing";
import { claudeCostWithCache, claudeRateFor } from "@/lib/usage/costs";

// The Batches API's discount on every token.
const BATCH_PRICE_FACTOR = 0.5;
// Pictures are looked up after each level is saved, inside whichever request
// happened to sync the job — so they get a short budget, and "Find pictures"
// on the page is there for anything they miss.
const IMAGE_BUDGET_MS = 8000;

type Admin = ReturnType<typeof createAdminClient>;

// What the page needs to show progress. Nothing about the source or prompts.
export type BatchJobStatus = {
  id: string;
  status: LessonBatchJob["status"];
  currentBand: string | null;
  pendingBands: string[];
  lessonIds: string[];
  error: string | null;
};

export function batchJobStatus(job: LessonBatchJob): BatchJobStatus {
  return {
    id: job.id,
    status: job.status,
    currentBand: job.current_band,
    pendingBands: job.pending_bands,
    lessonIds: job.lesson_ids,
    error: job.error,
  };
}

async function familyLevels(admin: Admin, familyId: string, spaceId: string): Promise<SpaceLesson[]> {
  const { data } = await admin
    .from("space_lessons")
    .select("*")
    .eq("family_id", familyId)
    .eq("space_id", spaceId);
  return (data ?? []) as SpaceLesson[];
}

async function update(admin: Admin, id: string, values: Partial<LessonBatchJob>): Promise<LessonBatchJob> {
  const { data } = await admin
    .from("lesson_batch_jobs")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  return data as LessonBatchJob;
}

// The running job for a lesson's page, if there is one.
export async function activeBatchJob(familyId: string, spaceId: string): Promise<LessonBatchJob | null> {
  const { data } = await createAdminClient()
    .from("lesson_batch_jobs")
    .select("*")
    .eq("family_id", familyId)
    .eq("space_id", spaceId)
    .eq("status", "running")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as LessonBatchJob | null) ?? null;
}

export async function getBatchJob(id: string): Promise<LessonBatchJob | null> {
  const { data } = await createAdminClient()
    .from("lesson_batch_jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as LessonBatchJob | null) ?? null;
}

export async function startBatchJob(input: {
  spaceId: string;
  communityId: string;
  userId: string;
  familyId: string;
  sourceLessonId: string;
  bands: AgeBandKey[];
}): Promise<LessonBatchJob> {
  const admin = createAdminClient();
  const ordered = [...new Set(input.bands)].sort((a, b) => ageBandRank(a) - ageBandRank(b));
  const { data, error } = await admin
    .from("lesson_batch_jobs")
    .insert({
      space_id: input.spaceId,
      community_id: input.communityId,
      created_by: input.userId,
      family_id: input.familyId,
      source_lesson_id: input.sourceLessonId,
      pending_bands: ordered,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not start the job.");
  return submitNext(admin, data as LessonBatchJob);
}

// Puts the next band into Anthropic's queue, or finishes the job.
async function submitNext(admin: Admin, job: LessonBatchJob): Promise<LessonBatchJob> {
  const levels = await familyLevels(admin, job.family_id, job.space_id);
  const have = new Set(levels.map((l) => l.age_band));
  // A band somebody added by hand in the meantime is skipped, not duplicated.
  const pending = job.pending_bands.filter((b) => isAgeBandKey(b) && !have.has(b)) as AgeBandKey[];

  if (pending.length === 0) {
    return update(admin, job.id, { status: "done", current_band: null, batch_id: null, pending_bands: [] });
  }

  // Each level is a paid call, so the community's allowance is checked for
  // every one, not only when the job started.
  const allowance = await checkAiAllowance(job.community_id, job.created_by);
  if (!allowance.allowed) {
    return update(admin, job.id, { status: "error", error: allowance.message, current_band: null });
  }

  const source = levels.find((l) => l.id === job.source_lesson_id) ?? levels.find((l) => l.source_text?.trim());
  const sourceText = source?.source_text?.trim() ?? "";
  if (!source || !sourceText) {
    return update(admin, job.id, {
      status: "error",
      error: "This lesson no longer has the text it was written from.",
      current_band: null,
    });
  }

  const [band, ...rest] = pending;
  const earlierLevels = levels
    .filter((l) => ageBandRank(l.age_band) < ageBandRank(band))
    .sort((a, b) => ageBandRank(a.age_band) - ageBandRank(b.age_band))
    .map((l) => ({ ageBand: l.age_band, lesson: toLessonRow(l).lesson }));

  const { params } = lessonRequest({
    sourceText,
    ageBand: band,
    beyondSource: canGoBeyondSource(band),
    earlierLevels,
  });

  try {
    const batch = await new Anthropic().messages.batches.create({
      requests: [{ custom_id: `${job.id}-${band}`, params }],
    });
    return update(admin, job.id, {
      current_band: band,
      pending_bands: rest,
      batch_id: batch.id,
      source_lesson_id: source.id,
    });
  } catch (error) {
    console.error("Could not submit lesson batch", error);
    return update(admin, job.id, {
      status: "error",
      error: `Couldn't queue the ${ageBandLabel(band)} level. Try again in a minute.`,
      current_band: null,
    });
  }
}

// Brings a job up to date: if its batch has come back, save the level and
// queue the next one. Safe to call from several requests at once — only the
// one that claims the batch saves it.
export async function syncBatchJob(job: LessonBatchJob): Promise<LessonBatchJob> {
  if (job.status !== "running") return job;
  const admin = createAdminClient();

  // Nothing in flight (a submit failed part-way, or the previous level just
  // finished): queue the next band.
  if (!job.batch_id) return submitNext(admin, job);

  const client = new Anthropic();
  let batch: Anthropic.Messages.MessageBatch;
  try {
    batch = await client.messages.batches.retrieve(job.batch_id);
  } catch (error) {
    console.error("Could not check lesson batch", error);
    return job;
  }
  if (batch.processing_status !== "ended") return job;

  // Claim it: whoever clears batch_id first is the one who saves the level.
  const { data: claimed } = await admin
    .from("lesson_batch_jobs")
    .update({ batch_id: null, updated_at: new Date().toISOString() })
    .eq("id", job.id)
    .eq("batch_id", job.batch_id)
    .select("*")
    .maybeSingle();
  if (!claimed) return (await getBatchJob(job.id)) ?? job;
  const current = claimed as LessonBatchJob;
  const band = current.current_band;

  let message: Anthropic.Message | null = null;
  let failure: string | null = null;
  try {
    for await (const entry of await client.messages.batches.results(job.batch_id)) {
      if (entry.result.type === "succeeded") message = entry.result.message;
      else failure = entry.result.type === "errored" ? "The writer reported an error." : `The request ${entry.result.type}.`;
    }
  } catch (error) {
    console.error("Could not read lesson batch results", error);
    failure = "Couldn't read the finished level.";
  }

  if (!band || !isAgeBandKey(band) || !message) {
    return update(admin, job.id, {
      status: "error",
      error: `The ${band ? ageBandLabel(band) : "next"} level didn't come back. ${failure ?? ""}`.trim(),
      current_band: null,
    });
  }

  let saved: SpaceLesson | null = null;
  try {
    saved = await saveLevel(admin, current, band, message);
  } catch (error) {
    const reason = error instanceof LessonGenerationError ? error.message : "It couldn't be saved.";
    return update(admin, job.id, {
      status: "error",
      error: `The ${ageBandLabel(band)} level: ${reason}`,
      current_band: null,
    });
  }

  if (!saved) {
    return update(admin, job.id, {
      status: "error",
      error: `The ${ageBandLabel(band)} level was written but couldn't be saved. Try again in a minute.`,
      current_band: null,
    });
  }

  const next = await update(admin, job.id, {
    current_band: null,
    lesson_ids: [...current.lesson_ids, saved.id],
  });
  return submitNext(admin, next);
}

// Validates, charges, saves and illustrates one finished level. Returns null
// when it was written but could only be parked (see unsaved-lessons.ts).
async function saveLevel(
  admin: Admin,
  job: LessonBatchJob,
  band: AgeBandKey,
  message: Anthropic.Message
): Promise<SpaceLesson | null> {
  const { lesson, usage } = readLessonMessage(message);

  await recordAiSpend({
    communityId: job.community_id,
    userId: job.created_by,
    kind: "lesson",
    amountUsd:
      claudeCostWithCache(usage, claudeRateFor(usage.model, getUsageRates())) * BATCH_PRICE_FACTOR,
    ref: `lesson-batch:${message.id}`,
  });

  const levels = await familyLevels(admin, job.family_id, job.space_id);
  const source = levels.find((l) => l.id === job.source_lesson_id) ?? levels[0];
  const hadEarlier = levels.some((l) => ageBandRank(l.age_band) < ageBandRank(band));
  const beyondSource = canGoBeyondSource(band);

  const { document, row } = buildLessonRow({
    spaceId: job.space_id,
    communityId: job.community_id,
    userId: job.created_by,
    ageBand: band,
    sourceText: source?.source_text ?? "",
    lesson,
    promptUsed: lessonSystemPrompt(band, beyondSource, hadEarlier),
    beyondSource,
    sourceUrl: source?.source_url ?? null,
    sourceTitle: source?.source_title ?? null,
    videoUrl: source?.video_url ?? null,
    mediaPath: source?.media_path ?? null,
    mediaType: source?.media_type ?? null,
    familyId: job.family_id,
  });
  const full = {
    ...row,
    ai_model: usage.model,
    ai_input_tokens: usage.inputTokens,
    ai_output_tokens: usage.outputTokens,
    // Billed at half price; cost figures read this.
    ai_batch: true,
  } as Database["public"]["Tables"]["space_lessons"]["Insert"];

  const { data, error } = await admin.from("space_lessons").insert(full).select("*").single();
  if (error || !data) {
    console.error("Could not save batch lesson", error);
    await parkUnsavedLesson({
      spaceId: job.space_id,
      communityId: job.community_id,
      userId: job.created_by,
      row: full as Record<string, unknown>,
      error: error?.message ?? null,
    });
    return null;
  }

  // Pictures are a bonus; a level without them is still a level.
  try {
    const { lesson: illustrated, found } = await attachImages(document, IMAGE_BUDGET_MS);
    if (found > 0) await admin.from("space_lessons").update({ lesson: illustrated }).eq("id", data.id);
  } catch (error) {
    console.error("Could not illustrate batch lesson", error);
  }
  return data as SpaceLesson;
}

export async function cancelBatchJob(job: LessonBatchJob): Promise<LessonBatchJob> {
  const admin = createAdminClient();
  if (job.batch_id) {
    try {
      await new Anthropic().messages.batches.cancel(job.batch_id);
    } catch (error) {
      console.error("Could not cancel lesson batch", error);
    }
  }
  return update(admin, job.id, { status: "cancelled", current_band: null, batch_id: null });
}
