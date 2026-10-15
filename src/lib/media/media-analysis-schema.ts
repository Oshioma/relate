// What a finished review looks like, and how a raw answer is tidied into it.
//
// Pure (no server-only imports) so the tidying can be unit-tested. Used by
// src/lib/ai/analyse-media.ts on the model's answer.

import { z } from "zod";
import { CONCERN_CATEGORIES, CONCERN_LEVELS, MEDIA_KIND_KEYS, MEDIA_VERDICT_KEYS, PROFANITY_LEVELS } from "@/lib/media/media-types";

export const CONCERN_KEYS = CONCERN_CATEGORIES.map((c) => c.key);
const PROFANITY_KEYS = PROFANITY_LEVELS.map((p) => p.value);

// THE ANSWER IS TIDIED, NOT REJECTED.
//
// The first version validated every field strictly — a theme over sixty
// characters, a note over four hundred — and threw the whole review away when
// one was over. Three reviews of one book in a row died that way, each on a
// theme the model had written as a sentence. A parent watching a spinner for
// a minute does not care that one phrase was long. So: strings are trimmed to
// length, lists capped, numbers clamped, an unknown category becomes "other",
// an unknown level drops that one note. Only a missing title — a review of
// nothing — still fails.
const text = (max: number) => z.string().catch("").transform((v) => v.trim().slice(0, max));
const optionalText = (max: number) =>
  z
    .string()
    .nullable()
    .catch(null)
    .transform((v) => {
      const trimmed = v?.trim().slice(0, max) ?? "";
      return trimmed ? trimmed : null;
    });
const oneOf = <T extends string>(allowed: readonly T[], fallback: T) =>
  z.string().catch(fallback).transform((v) => (allowed.includes(v as T) ? (v as T) : fallback));
const age = z
  .number()
  .nullable()
  .catch(null)
  .transform((n) => (n == null || !Number.isFinite(n) ? null : Math.min(21, Math.max(0, Math.round(n)))));

export const MediaAnalysisSchema = z.object({
  kind: oneOf(MEDIA_KIND_KEYS, "other"),
  title: text(200).pipe(z.string().min(1)),
  creator: optionalText(200),
  description: text(2000),
  age_min: age,
  age_max: age,
  verdict: oneOf(MEDIA_VERDICT_KEYS, "caution"),
  reason: optionalText(1000),
  profanity: oneOf(PROFANITY_KEYS, "unknown"),
  concerns: z
    .array(z.object({ category: z.string().catch("other"), level: z.string().catch(""), note: z.string().nullable().catch(null) }))
    .catch([])
    .transform((list) =>
      list
        .flatMap((c) => {
          const level = (CONCERN_LEVELS as readonly string[]).includes(c.level) ? (c.level as (typeof CONCERN_LEVELS)[number]) : null;
          if (!level) return [];
          const category = CONCERN_KEYS.includes(c.category) ? c.category : "other";
          return [{ category, level, note: (c.note ?? "").trim().slice(0, 400) }];
        })
        .slice(0, 20)
    ),
  themes: z
    .array(z.string())
    .catch([])
    .transform((list) => [...new Set(list.map((t) => t.trim().replace(/[.;]+$/, "").slice(0, 80)).filter(Boolean))].slice(0, 20)),
  summary_for_parents: text(2000),
  confidence: oneOf(["low", "medium", "high"] as const, "low"),
  sources: z
    .array(z.string())
    .catch([])
    .transform((list) => list.filter((u) => /^https?:\/\//i.test(u)).map((u) => u.slice(0, 500)).slice(0, 12)),
  cover_image_url: optionalText(1000),
});

export type MediaAnalysisShape = z.infer<typeof MediaAnalysisSchema>;
