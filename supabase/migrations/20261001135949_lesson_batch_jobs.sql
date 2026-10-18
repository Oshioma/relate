-- =============================================================================
-- Relate — writing a lesson's missing ages in the background, at half price
--
-- Anthropic's Message Batches API writes at half the normal price, but not
-- straight away: a request is queued and comes back minutes (occasionally
-- hours) later. That suits "write every age this lesson doesn't have yet",
-- which nobody needs to watch happen.
--
-- The levels must be written ONE AFTER ANOTHER, youngest first: an older
-- level is written knowing what the younger ones already said, so it doesn't
-- repeat them. So a job holds a queue of age bands and submits one batch at a
-- time; when it comes back, the level is saved and the next band goes in.
--
-- Nothing runs in the background on our side. The job moves forward whenever
-- the lesson page is opened or polls it (lesson-batch.ts), like the video jobs.
--
--   pending_bands   bands still to write, in order (youngest first)
--   current_band    the band in Anthropic's queue right now, if any
--   batch_id        Anthropic's id for that batch
--   lesson_ids      levels written so far by this job
--   status          running | done | error | cancelled
--
-- Service-role only (RLS on, no policies): the routes check the caller may
-- write lessons in the space before touching a job.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.lesson_batch_jobs (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  family_id uuid not null,
  -- The level whose source the job writes from.
  source_lesson_id uuid references public.space_lessons (id) on delete set null,
  pending_bands text[] not null default '{}',
  current_band text,
  batch_id text,
  lesson_ids uuid[] not null default '{}',
  status text not null default 'running'
    check (status in ('running', 'done', 'error', 'cancelled')),
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lesson_batch_jobs_family_idx
  on public.lesson_batch_jobs (family_id, status);

alter table public.lesson_batch_jobs enable row level security;
