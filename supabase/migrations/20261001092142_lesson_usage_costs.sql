-- =============================================================================
-- Relate — What lessons and video transcripts cost to make
--
-- The platform admin "Usage & costs" tab estimates what the paid parts of
-- Lessons spend: the Claude call that writes each lesson, and the Whisper
-- transcription and residential-proxy bandwidth behind a lesson from a video.
-- Until now none of that was recorded, so it could only be guessed from text
-- lengths. These columns record the real quantities as they happen; the app
-- turns them into money with rates it holds itself (src/lib/usage/pricing.ts),
-- so a price change never needs a migration and never rewrites history.
--
-- space_lessons
--   ai_model           the model id that answered, as Claude reported it.
--   ai_input_tokens    every input token billed: input_tokens plus cache
--                      creation and cache reads. The lesson writer does not use
--                      prompt caching, so the last two are zero today and the
--                      sum is exact; if caching is ever added, pricing the sum
--                      at the full input rate over-estimates, which is the safe
--                      direction for a cost panel.
--   ai_output_tokens   output tokens, thinking included.
--   All null on lessons written before this migration — the panel estimates
--   those from text lengths and says how many it estimated.
--
-- lesson_video_jobs
--   audio_seconds      seconds of audio sent to Whisper. Null or 0 when the
--                      platform's own captions were used.
--   download_bytes     bytes yt-dlp downloaded for the job (audio and/or
--                      captions). Through a residential proxy this is what is
--                      billed per GB.
--   proxied            whether the worker fetched through its proxy. Null on
--                      jobs from before the worker reported it.
--
-- All additive and nullable. Safe to re-run.
-- =============================================================================

alter table public.space_lessons
  add column if not exists ai_model text,
  add column if not exists ai_input_tokens integer,
  add column if not exists ai_output_tokens integer;

comment on column public.space_lessons.ai_input_tokens is
  'Input tokens billed for writing this lesson (input + cache creation + cache reads). Null before usage was recorded.';
comment on column public.space_lessons.ai_output_tokens is
  'Output tokens billed for writing this lesson. Null before usage was recorded.';

alter table public.lesson_video_jobs
  add column if not exists audio_seconds integer,
  add column if not exists download_bytes bigint,
  add column if not exists proxied boolean;

comment on column public.lesson_video_jobs.audio_seconds is
  'Seconds of audio sent to Whisper. Null/0 when captions were used.';
comment on column public.lesson_video_jobs.download_bytes is
  'Bytes the worker downloaded (media + captions) — the proxy bills on this.';

-- -----------------------------------------------------------------------------
-- lesson_usage_rows: one slim row per lesson for the cost panel.
--
-- Lessons written before the columns above have no token counts, so the panel
-- estimates them from how long the source and the lesson are. Asking
-- PostgREST for source_text and the lesson document to measure them would
-- ship tens of KB per lesson to throw away; this returns the two lengths
-- instead, and only for rows that need estimating. Newest first, capped by
-- the caller.
--
-- Service-role only, like user_emails_for_ids: it reads across every
-- community regardless of RLS, so it is reachable only from server code that
-- has already checked the caller is a super admin.
-- -----------------------------------------------------------------------------

create or replace function public.lesson_usage_rows(p_since timestamptz, p_limit integer)
returns table (
  community_id uuid,
  ai_model text,
  ai_input_tokens integer,
  ai_output_tokens integer,
  source_chars integer,
  lesson_chars integer
)
language sql
stable
set search_path = public
as $$
  select
    l.community_id,
    l.ai_model,
    l.ai_input_tokens,
    l.ai_output_tokens,
    case when l.ai_input_tokens is null then length(l.source_text) end,
    case when l.ai_output_tokens is null then length(l.lesson::text) end
  from public.space_lessons l
  where p_since is null or l.created_at >= p_since
  order by l.created_at desc, l.id
  limit greatest(1, least(coalesce(p_limit, 5000), 50000));
$$;

revoke all on function public.lesson_usage_rows(timestamptz, integer) from public, anon, authenticated;
grant execute on function public.lesson_usage_rows(timestamptz, integer) to service_role;
