// Caps how many lessons one person can write per day.
//
// Every lesson is a paid model call on material the writer chose, so access
// alone is not a licence to spend without limit. Authoring is already staff-
// only (see 20260904181544_space_lessons.sql), which bounds who can spend at
// all; this bounds how much.
//
// Reuses the platform's existing AI meter (consume_ai_quota / ai_usage_counters,
// added for Plant ID) rather than a table of its own: it is already atomic,
// security-definer, and resets at 00:00 UTC. Keyed on the user rather than the
// community, because the cost follows the person — a teacher in three school
// communities shares one budget.
//
// The count is consumed BEFORE the model runs and is never refunded, so a run
// of failures cannot be used to keep calling the model. That is the same rule
// the standalone app enforced by logging failed attempts.

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const QUOTA_BUCKET = "lesson";

export function lessonDailyLimit(): number {
  const raw = Number(process.env.LESSONS_PER_DAY);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 40;
}

export type QuotaVerdict = { allowed: true } | { allowed: false; message: string };

// Records one attempt and reports whether the caller is still within the daily
// limit. Fails CLOSED: if the counter can't be written we don't know what has
// been spent, and an unmetered model call is the worse outcome.
export async function consumeLessonQuota(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<QuotaVerdict> {
  const limit = lessonDailyLimit();

  const { data: withinLimit, error } = await supabase.rpc("consume_ai_quota", {
    p_bucket: QUOTA_BUCKET,
    p_identity: `user:${userId}`,
    p_limit: limit,
  });

  if (error) {
    console.error("Could not record lesson quota", error);
    return {
      allowed: false,
      message: "The lesson writer isn't available right now — try again shortly.",
    };
  }

  if (!withinLimit) {
    return {
      allowed: false,
      message: `That's ${limit} lessons today, which is the daily limit. It resets at midnight UTC.`,
    };
  }

  return { allowed: true };
}
