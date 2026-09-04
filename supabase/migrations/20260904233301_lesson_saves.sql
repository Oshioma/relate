-- =============================================================================
-- Relate — a lesson someone means to come back to
--
-- Browsing a library and doing a lesson happen at different times. A parent
-- finds three things worth doing on Sunday evening and wants them again on
-- Tuesday morning; without somewhere to put them the only options are memory
-- or a browser tab.
--
-- Row presence is the state, the same way event_rsvps and the old lesson
-- completions worked: saving inserts, unsaving deletes. There is no "unsaved"
-- row to keep, and the unique constraint means saving twice is not a duplicate
-- but a no-op the app can ignore.
--
-- A save is private. Nobody else can see what you have put aside, including
-- community staff — this is a reading list, not a submission, and there is no
-- moderation interest in it. That is deliberately unlike space_lessons, where
-- staff can see private lessons because they answer for what is published in
-- their space.
--
-- Saving is scoped to what you can already see: the insert policy re-checks
-- can_view_space, so a lesson that later turns private or a space someone
-- leaves cannot be kept reachable through a bookmark.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.lesson_saves (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.space_lessons (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (lesson_id, user_id)
);

-- "My saved lessons", which is the only way this is ever read.
create index if not exists idx_lesson_saves_user
  on public.lesson_saves (user_id, created_at desc);
create index if not exists idx_lesson_saves_lesson
  on public.lesson_saves (lesson_id);

alter table public.lesson_saves enable row level security;

-- Yours and nobody else's, in every direction.
drop policy if exists "lesson_saves_select_own" on public.lesson_saves;
create policy "lesson_saves_select_own" on public.lesson_saves
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "lesson_saves_insert_own" on public.lesson_saves;
create policy "lesson_saves_insert_own" on public.lesson_saves
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.space_lessons l
      where l.id = lesson_saves.lesson_id
        and public.can_view_space(l.space_id, auth.uid())
    )
  );

drop policy if exists "lesson_saves_delete_own" on public.lesson_saves;
create policy "lesson_saves_delete_own" on public.lesson_saves
  for delete to authenticated
  using (user_id = auth.uid());
