-- =============================================================================
-- Relate — lessons that were written but could not be saved
--
-- Writing a lesson is a paid model call. If the insert into space_lessons then
-- fails (a missing column after a half-finished deploy, a dropped connection),
-- the finished lesson used to exist only in the browser tab that asked for it,
-- and the teacher's only option was to pay for it to be written again.
--
-- Now the complete row is parked here instead, and the page offers "Save it
-- now", which inserts it as it was written, without calling the model.
--
-- row is the space_lessons insert exactly as it would have been sent.
-- Service-role only (RLS on, no policies): the save route checks the person
-- may write lessons in that space before moving the row across.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.unsaved_lessons (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  row jsonb not null,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists unsaved_lessons_created_by_idx
  on public.unsaved_lessons (created_by, created_at);

alter table public.unsaved_lessons enable row level security;
