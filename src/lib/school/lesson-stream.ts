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
import type { Database } from "@/types/database";
import {
  attachImages,
  generateLesson,
  LessonGenerationError,
} from "@/lib/ai/lesson-writer";
import { cleanDiscoveryCategories, storableLesson, type AgeBandKey } from "@/lib/school/lesson-types";

export function streamLesson(input: {
  supabase: SupabaseClient<Database>;
  spaceId: string;
  communityId: string;
  userId: string;
  sourceText: string;
  ageBand: AgeBandKey;
}): Response {
  const { supabase, spaceId, communityId, userId, sourceText, ageBand } = input;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        // Throttle progress so a fast stream doesn't flood the client.
        let lastSent = 0;
        const lesson = await generateLesson({
          sourceText,
          ageBand,
          onProgress: (chars) => {
            if (chars - lastSent < 200) return;
            lastSent = chars;
            send({ type: "progress", chars });
          },
        });

        // The document as it is stored. The writer also returns how long the
        // lesson takes and what kind of thing it is; those become columns, so
        // staff can override them — and keeping a second copy in the jsonb
        // would leave a stale one behind the moment they did.
        const document = storableLesson(lesson);

        const { data: saved, error: insertError } = await supabase
          .from("space_lessons")
          .insert({
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
          })
          .select("*")
          .single();

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
