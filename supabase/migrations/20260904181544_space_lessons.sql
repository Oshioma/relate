-- =============================================================================
-- Relate — School communities: the Lessons library
--
-- One row per lesson written in a Lessons space. The lesson itself is stored as
-- jsonb rather than a table of sections/vocabulary/questions: it is written once
-- by the model, rendered as a whole, and never cross-queried. The columns that
-- ARE filtered and grouped on — subject, age_band — are first-class, so the
-- library can be browsed by subject and age without touching the document.
--
-- `source_text` is the material the lesson was built from, kept deliberately:
-- rewriting the same material for a different age band is the feature that makes
-- this worth having in a school (one text, one lesson per year group), and it
-- needs nothing from the teacher but a choice of band.
--
-- AUTHORING IS STAFF-ONLY. Every lesson is a paid model call, and in a school
-- the teaching library is a published artefact, not a scratchpad — so insert is
-- gated on is_community_staff, while every member who can see the space reads
-- and prints. Editing and deleting stay open to the lesson's own author as well,
-- so a teacher who later loses a moderator role can still tidy their own work.
--
-- Mirrors guides/meetups for shape and RLS. Safe to re-run.
-- =============================================================================

create table if not exists public.space_lessons (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  -- Which age band this lesson is written for. Free text validated against
  -- AGE_BANDS in src/lib/school/lesson-types.ts, so adding a band (or renaming
  -- one) stays a code-only change — the same reasoning as location_type.
  age_band text not null default '8-10',

  -- Denormalised from the jsonb document so the library can sort, group and
  -- filter without reading every lesson. Written by the app from the model's
  -- own answer, and kept in step on edit.
  title text not null default '',
  subject text not null default '',

  source_text text not null default '',

  -- The written lesson: objectives, vocabulary, sections, activity, questions,
  -- discussion prompts, and any pictures resolved for them. Shape is
  -- StoredLesson in src/lib/school/lesson-types.ts.
  lesson jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.space_lessons;
create trigger set_updated_at before update on public.space_lessons
  for each row execute function public.set_updated_at();

-- The library lists newest first, and filters by subject within a space.
create index if not exists idx_space_lessons_space
  on public.space_lessons (space_id, created_at desc);
create index if not exists idx_space_lessons_community
  on public.space_lessons (community_id, created_at desc);
create index if not exists idx_space_lessons_subject
  on public.space_lessons (space_id, subject, created_at desc);

alter table public.space_lessons enable row level security;

drop policy if exists "space_lessons_select" on public.space_lessons;
create policy "space_lessons_select" on public.space_lessons
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

-- Mirrors the authenticated policy with a null user, which resolves true only
-- for public spaces — a prospective parent can read a school's public teaching
-- library without an account. Same pattern as posts_select_anon.
drop policy if exists "space_lessons_select_anon" on public.space_lessons;
create policy "space_lessons_select_anon" on public.space_lessons
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

-- Staff only: see the authoring note in the header.
drop policy if exists "space_lessons_insert_staff" on public.space_lessons;
create policy "space_lessons_insert_staff" on public.space_lessons
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_community_staff(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "space_lessons_update_author_or_staff" on public.space_lessons;
create policy "space_lessons_update_author_or_staff" on public.space_lessons
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "space_lessons_delete_author_or_staff" on public.space_lessons;
create policy "space_lessons_delete_author_or_staff" on public.space_lessons
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));
