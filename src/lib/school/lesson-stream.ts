// The shared pipeline behind writing a lesson: generate, save, illustrate,
// reporting each stage as it happens.
//
// Two routes need exactly this — creating a lesson from pasted text, and
// rewriting an existing one for a different age band — so it lives here
// rather than being written twice and drifting apart.
//
// The response is newline-delimited JSON:
//
//   {"type":"progress","chars":1240}     text arriving
//   {"type":"done","row":{...}}          saved; the lesson is complete
//   {"type":"images"}                    now looking for pictures
//   {"type":"illustrated","row":{...}}   pictures added
//   {"type":"error","error":"…"}
//
// Order matters: the lesson is saved and announced before any time is spent on
// pictures, because requests run under a platform time limit and losing a
// finished lesson to an image lookup is not survivable.
//
// This is the one place in the codebase that streams rather than using a server
// action. Writing a lesson runs well past the point where a server action is
// comfortable, and a streaming connection both reports progress and stays busy
// enough that a gateway won't cut it off mid-write.

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LessonMediaType } from "@/types/database";
import {
  attachImages,
  generateLesson,
  LessonGenerationError,
  type EarlierLevel,
} from "@/lib/ai/lesson-writer";
import { cleanDiscoveryCategories, storableLesson, type AgeBandKey } from "@/lib/school/lesson-types";
import { recordAiSpend } from "@/lib/usage/ai-spend";
import { getUsageRates } from "@/lib/usage/pricing";
import { claudeCost, claudeRateFor } from "@/lib/usage/costs";
import { parseVideoLink } from "@/lib/school/video-links";
import { isLessonMediaPath, mediaTypeOfPath } from "@/lib/school/lesson-media";

export function streamLesson(input: {
  supabase: SupabaseClient<Database>;
  spaceId: string;
  communityId: string;
  userId: string;
  sourceText: string;
  ageBand: AgeBandKey;
  // The source is a starting point rather than a boundary. The caller derives
  // this from the band — see canGoBeyondSource.
  beyondSource?: boolean;
  // The family a new level joins, when it is another age of an existing
  // lesson. Omitted for a brand-new lesson, which starts a family of its own.
  familyId?: string;
  // Younger levels already in that family, for the writer to build on.
  earlierLevels?: EarlierLevel[];
  // Where the material came from, when it was read in from a link. The reader
  // hands both back and they were previously dropped once the text reached the
  // box, so a lesson could never say where it came from.
  sourceUrl?: string | null;
  sourceTitle?: string | null;
  // A video to show at the top of the lesson, when the material is its
  // transcript. Anything that isn't a recognised video link is dropped.
  videoUrl?: string | null;
  // An uploaded file to play at the top of the lesson instead: an object
  // path in 'uploads'. The CALLER checks it may use it (POST /api/lessons
  // checks it is the author's own upload; a rewrite reuses the stored one).
  mediaPath?: string | null;
}): Response {
  const { supabase, spaceId, communityId, userId, sourceText, ageBand } = input;
  const beyondSource = Boolean(input.beyondSource);
  // Only ever an http(s) URL, matching the column's own constraint.
  const sourceUrl =
    typeof input.sourceUrl === "string" && /^https?:\/\//i.test(input.sourceUrl)
      ? input.sourceUrl
      : null;
  const sourceTitle = sourceUrl ? (input.sourceTitle?.trim() || null) : null;
  const videoUrl = input.videoUrl ? (parseVideoLink(input.videoUrl)?.url ?? null) : null;
  // One thing at the top of a lesson: a link wins over a file, which can only
  // happen if a client sends both.
  const mediaPath = !videoUrl && input.mediaPath && isLessonMediaPath(input.mediaPath) ? input.mediaPath : null;
  const mediaType: LessonMediaType | null = mediaPath ? mediaTypeOfPath(mediaPath) : null;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        // Throttle progress so a fast stream doesn't flood the client.
        let lastSent = 0;
        const { lesson, promptUsed, usage } = await generateLesson({
          sourceText,
          ageBand,
          beyondSource,
          earlierLevels: input.earlierLevels,
          onProgress: (chars) => {
            if (chars - lastSent < 200) return;
            lastSent = chars;
            send({ type: "progress", chars });
          },
        });

        // Charged to the community's AI allowance as soon as the call returns —
        // before saving, so a lesson written but never saved still counts.
        await recordAiSpend({
          communityId,
          userId,
          kind: "lesson",
          amountUsd: (() => {
            const rates = getUsageRates();
            return claudeCost(usage.inputTokens, usage.outputTokens, claudeRateFor(usage.model, rates));
          })(),
          ref: `lesson:${crypto.randomUUID()}`,
        });

        // The document as it is stored. The writer also returns how long the
        // lesson takes and what kind of thing it is; those become columns, so
        // staff can override them — and keeping a second copy in the jsonb
        // would leave a stale one behind the moment they did.
        const document = storableLesson(lesson);

        const row = {
          space_id: spaceId,
          community_id: communityId,
          created_by: userId,
          age_band: ageBand,
          title: lesson.title,
          subject: lesson.subject,
          source_text: sourceText,
          lesson: document,
          // Classified by the same call that wrote it. Cleaned rather than
          // trusted: the column constrains these to the eight, and a model
          // returning something else should lose the value, not the lesson.
          discovery_categories: cleanDiscoveryCategories(lesson.discovery_categories),
          duration_minutes: lesson.duration_minutes ?? null,
          // Recorded on the row, not just in the prose: a reader deciding
          // whether to print this needs to know before they open it.
          beyond_source: beyondSource,
          // The prompt as sent, not as rebuildable. A lesson written today
          // stays truthful about its own rules after the prompt changes.
          prompt_used: promptUsed,
          source_url: sourceUrl,
          source_title: sourceTitle,
          video_url: videoUrl,
          media_path: mediaPath,
          media_type: mediaType,
          // Left to the column default for a new lesson: a family of one.
          ...(input.familyId ? { family_id: input.familyId } : {}),
        };
        // What the call cost in tokens, for the platform admin's cost panel.
        // Recorded now because it can't be recovered later.
        const usageColumns = {
          ai_model: usage.model,
          ai_input_tokens: usage.inputTokens,
          ai_output_tokens: usage.outputTokens,
        };

        const insert = (values: Database["public"]["Tables"]["space_lessons"]["Insert"]) =>
          supabase.from("space_lessons").insert(values).select("*").single();
        let { data: saved, error: insertError } = await insert({ ...row, ...usageColumns });
        // PGRST204 is "no such column": the code is deployed but the
        // lesson_usage_costs migration isn't pushed yet. A missing cost figure
        // must never cost a teacher their lesson, so save it without one.
        if (insertError?.code === "PGRST204") {
          ({ data: saved, error: insertError } = await insert(row));
        }

        if (insertError || !saved) {
          console.error("Could not save lesson", insertError);
          // The lesson is good even though saving failed — hand it back so the
          // work isn't lost, and let the client say it wasn't saved.
          send({
            type: "done",
            lesson: document,
            error: "The lesson was written but not saved.",
          });
          return;
        }

        // The reader has a complete lesson from here on. Everything below is a
        // bonus that may not finish.
        send({ type: "done", row: saved });

        send({ type: "images" });
        const { lesson: illustrated, found } = await attachImages(document);

        if (found > 0) {
          const { data: updated } = await supabase
            .from("space_lessons")
            .update({ lesson: illustrated })
            .eq("id", saved.id)
            .select("*")
            .single();

          if (updated) send({ type: "illustrated", row: updated });
        }
      } catch (error) {
        if (error instanceof LessonGenerationError) {
          send({ type: "error", error: error.message });
        } else {
          console.error("Lesson generation failed", error);
          send({ type: "error", error: "Could not build the lesson." });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      // Stops proxies buffering the stream into one lump at the end.
      "X-Accel-Buffering": "no",
    },
  });
}
