-- =============================================================================
-- Relate — daily usage quota for public AI tools
--
-- Public AI spaces (e.g. a Plant ID space marked public) can be used by anyone,
-- including signed-out visitors. Each identification calls a paid model, so
-- non-members are capped to a small number of runs per day, keyed by client IP,
-- to prevent anonymous abuse. Active members are exempt (the app skips the
-- quota check for them entirely).
--
-- consume_ai_quota atomically records one use for (bucket, identity, UTC day)
-- and returns whether the caller is still within p_limit. It is
-- security-definer so anon/authenticated can spend quota without any direct
-- write access to the counter table (RLS on the table denies that by default —
-- no policies are defined, so only this function and the service role touch it).
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.ai_usage_counters (
  -- What is being metered, e.g. 'plant_id'.
  bucket text not null,
  -- Who is being metered: 'ip:<addr>' for non-members. (Members are exempt and
  -- never recorded here.)
  identity text not null,
  -- UTC day the count belongs to; the quota resets at 00:00 UTC.
  day date not null,
  count integer not null default 0,
  primary key (bucket, identity, day)
);

-- Housekeeping: let a scheduled job (or a manual sweep) drop stale rows without
-- a table scan on the primary key.
create index if not exists idx_ai_usage_counters_day on public.ai_usage_counters (day);

alter table public.ai_usage_counters enable row level security;
-- No policies on purpose: the counter is written only through the
-- security-definer function below (and the service role). anon/authenticated
-- have no direct SELECT/INSERT/UPDATE access.

create or replace function public.consume_ai_quota(p_bucket text, p_identity text, p_limit integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day date := (now() at time zone 'utc')::date;
  v_count integer;
begin
  insert into public.ai_usage_counters (bucket, identity, day, count)
    values (p_bucket, p_identity, v_day, 1)
  on conflict (bucket, identity, day)
    do update set count = public.ai_usage_counters.count + 1
  returning count into v_count;

  -- Within limit when this use (already counted) is the p_limit-th or earlier.
  return v_count <= p_limit;
end;
$$;

grant execute on function public.consume_ai_quota(text, text, integer) to anon, authenticated;
