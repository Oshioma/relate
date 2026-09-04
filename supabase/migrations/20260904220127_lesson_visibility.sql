-- =============================================================================
-- Relate — a lesson its author can keep to themselves
--
-- Every lesson in a Lessons space is visible to everyone who can see the space.
-- That is right for a finished lesson and wrong for a draft, a first attempt,
-- or something written for one child that nobody else needs to read. Without a
-- way to hold one back, the only alternative to publishing is deleting.
--
-- is_public defaults to true, so every lesson already written stays exactly as
-- visible as it was and nothing disappears from a library on deploy.
--
-- WHO CAN STILL SEE A PRIVATE LESSON: its author, and community staff. Staff
-- because they answer for what is in their space and cannot moderate what they
-- cannot see — hiding a lesson from other members is not a way to hide it from
-- the people responsible for the community.
--
-- Enforced in RLS rather than by filtering in the app: a private lesson must be
-- unreachable, not merely unlisted.
--
-- Safe to re-run.
-- =============================================================================

alter table public.space_lessons
  add column if not exists is_public boolean not null default true;

comment on column public.space_lessons.is_public is
  'False = visible only to its author and community staff. See lesson_visibility migration.';

-- The library lists a space''s visible lessons newest first; this keeps that
-- index useful now that visibility is part of the question.
create index if not exists idx_space_lessons_space_public
  on public.space_lessons (space_id, is_public, created_at desc);

-- Same space rule as before, plus the visibility test.
drop policy if exists "space_lessons_select" on public.space_lessons;
create policy "space_lessons_select" on public.space_lessons
  for select to authenticated
  using (
    public.can_view_space(space_id, auth.uid())
    and (
      is_public
      or created_by = auth.uid()
      or public.is_community_staff(community_id, auth.uid())
    )
  );

-- A guest is never the author and never staff, so they see public lessons only.
drop policy if exists "space_lessons_select_anon" on public.space_lessons;
create policy "space_lessons_select_anon" on public.space_lessons
  for select to anon
  using (public.can_view_space(space_id, null::uuid) and is_public);
