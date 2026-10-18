-- =============================================================================
-- Relate — marking lessons written at half price
--
-- Levels written in the background through Anthropic's Message Batches API
-- (lesson-batch.ts) are billed at half price. Their token counts look like any
-- other lesson's, so without a flag every cost figure priced them at the full
-- rate: about twice what they really cost. ai_batch says which ones they are,
-- and lesson_usage_rows hands it to the Usage & costs panel.
--
-- Safe to re-run.
-- =============================================================================

alter table public.space_lessons
  add column if not exists ai_batch boolean not null default false;

comment on column public.space_lessons.ai_batch is
  'Written through the Message Batches API, so billed at half the normal token price.';

-- The return type changes, so the function is dropped and made again.
drop function if exists public.lesson_usage_rows(timestamptz, integer);

create function public.lesson_usage_rows(p_since timestamptz, p_limit integer)
returns table (
  community_id uuid,
  ai_model text,
  ai_input_tokens integer,
  ai_output_tokens integer,
  ai_batch boolean,
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
    l.ai_batch,
    case when l.ai_input_tokens is null then length(l.source_text) end,
    case when l.ai_output_tokens is null then length(l.lesson::text) end
  from public.space_lessons l
  where p_since is null or l.created_at >= p_since
  order by l.created_at desc, l.id
  limit greatest(1, least(coalesce(p_limit, 5000), 50000));
$$;

revoke all on function public.lesson_usage_rows(timestamptz, integer) from public, anon, authenticated;
grant execute on function public.lesson_usage_rows(timestamptz, integer) to service_role;
