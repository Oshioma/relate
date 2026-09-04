-- =============================================================================
-- Relate — School communities: sending a lesson home
--
-- A lesson in the library is written for the adult teaching it: it carries the
-- objectives, the teaching notes and the answer key. Sending it home is a
-- different act with a different audience — the parent gets the material, the
-- activity and the questions, and deliberately not the answers.
--
-- So homework is its own row rather than a flag on the lesson: it has a note in
-- the teacher's own words ("read section 2 and do the activity"), a due date,
-- and a record of who has done it. The parent-facing pack is generated from the
-- lesson at print time; nothing is duplicated.
--
-- A lesson may be sent home more than once — the same material set again next
-- term is a NEW assignment, not an edit of the old one, so last term's ticks
-- don't carry over and mark this term's families as already done.
--
-- WHAT THIS DELIBERATELY DOES NOT STORE: which child. There are no pupil
-- records on this platform and this is not where they should start appearing.
-- A completion is one adult saying "we did this" — keyed on the member, not on
-- a named child.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.lesson_homework (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.space_lessons (id) on delete cascade,
  -- Denormalised from the lesson so every policy and query here can be answered
  -- without a join back to space_lessons.
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  -- What the teacher is actually asking for, in their own words. Optional: a
  -- lesson sent home with no note means "read this".
  note text,
  -- Null = no deadline, which is a real choice for reading sent home over a
  -- holiday rather than a missing value.
  due_on date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.lesson_homework;
create trigger set_updated_at before update on public.lesson_homework
  for each row execute function public.set_updated_at();

-- The space page lists what is currently set, soonest deadline first.
create index if not exists idx_lesson_homework_space
  on public.lesson_homework (space_id, due_on);
create index if not exists idx_lesson_homework_lesson
  on public.lesson_homework (lesson_id, created_at desc);

alter table public.lesson_homework enable row level security;

drop policy if exists "lesson_homework_select" on public.lesson_homework;
create policy "lesson_homework_select" on public.lesson_homework
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

-- Mirrors the authenticated policy with a null user, true only for public
-- spaces — same pattern as space_lessons_select_anon.
drop policy if exists "lesson_homework_select_anon" on public.lesson_homework;
create policy "lesson_homework_select_anon" on public.lesson_homework
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

-- Setting homework is staff-only, like writing the lesson it comes from.
drop policy if exists "lesson_homework_insert_staff" on public.lesson_homework;
create policy "lesson_homework_insert_staff" on public.lesson_homework
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_community_staff(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "lesson_homework_update_author_or_staff" on public.lesson_homework;
create policy "lesson_homework_update_author_or_staff" on public.lesson_homework
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "lesson_homework_delete_author_or_staff" on public.lesson_homework;
create policy "lesson_homework_delete_author_or_staff" on public.lesson_homework
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- lesson_homework_completions: one adult saying "we did this".
--
-- Row presence IS the state, the same way event_rsvps works: ticking inserts,
-- un-ticking deletes. There is no "in progress" and no grade — this is a parent
-- telling a teacher the work happened, not an assessment record.
-- -----------------------------------------------------------------------------
create table if not exists public.lesson_homework_completions (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references public.lesson_homework (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (homework_id, user_id)
);

create index if not exists idx_lesson_homework_completions_homework
  on public.lesson_homework_completions (homework_id);
create index if not exists idx_lesson_homework_completions_user
  on public.lesson_homework_completions (user_id);

alter table public.lesson_homework_completions enable row level security;

-- A member sees their own ticks; staff see everyone's, because "who still
-- hasn't done it" is the entire reason a teacher would look.
drop policy if exists "lesson_homework_completions_select" on public.lesson_homework_completions;
create policy "lesson_homework_completions_select" on public.lesson_homework_completions
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.lesson_homework h
      where h.id = lesson_homework_completions.homework_id
        and public.is_community_staff(h.community_id, auth.uid())
    )
  );

drop policy if exists "lesson_homework_completions_insert_self" on public.lesson_homework_completions;
create policy "lesson_homework_completions_insert_self" on public.lesson_homework_completions
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.lesson_homework h
      where h.id = lesson_homework_completions.homework_id
        and public.is_community_member(h.community_id, auth.uid())
        and public.can_view_space(h.space_id, auth.uid())
    )
  );

-- Un-ticking is the member's own to do. Staff may also clear one — a tick on
-- the wrong row is otherwise stuck there forever.
drop policy if exists "lesson_homework_completions_delete" on public.lesson_homework_completions;
create policy "lesson_homework_completions_delete" on public.lesson_homework_completions
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.lesson_homework h
      where h.id = lesson_homework_completions.homework_id
        and public.is_community_staff(h.community_id, auth.uid())
    )
  );
