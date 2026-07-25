-- =============================================================================
-- Relate — Courses v2: Q&A, drip scheduling, certificates, announcements
--
-- Builds on 20260725140000_courses.sql. Safe to re-run.
--
--   * lesson_comments      per-lesson Q&A/discussion
--   * course_modules.available_at   drip: a module unlocks on/after this time
--   * courses.certificate_enabled   offer a completion certificate
--   * course_announcements  staff broadcasts to a course's learners
--
-- Drip is a soft gate: locked modules (and their lessons) are still returned
-- by RLS so a learner can see "unlocks on <date>" in the outline; the player
-- hides the body and the Mark-complete action until the unlock time. Hard
-- date-gating in RLS would also hide the lesson titles, which is worse UX.
-- =============================================================================

alter table public.course_modules add column if not exists available_at timestamptz;
alter table public.courses add column if not exists certificate_enabled boolean not null default false;

-- -----------------------------------------------------------------------------
-- lesson_comments: threaded-lite Q&A under a lesson. Any member who can see
-- the course may post; authors edit their own; staff moderate.
-- -----------------------------------------------------------------------------
create table if not exists public.lesson_comments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.lesson_comments;
create trigger set_updated_at before update on public.lesson_comments
  for each row execute function public.set_updated_at();

create index if not exists idx_lesson_comments_lesson on public.lesson_comments (lesson_id, created_at);

alter table public.lesson_comments enable row level security;

drop policy if exists "lesson_comments_select" on public.lesson_comments;
create policy "lesson_comments_select" on public.lesson_comments
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = lesson_comments.course_id
        and public.can_view_space(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

drop policy if exists "lesson_comments_insert_member" on public.lesson_comments;
create policy "lesson_comments_insert_member" on public.lesson_comments
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and exists (
      select 1 from public.courses c
      where c.id = lesson_comments.course_id
        and public.can_view_space(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

drop policy if exists "lesson_comments_update_author" on public.lesson_comments;
create policy "lesson_comments_update_author" on public.lesson_comments
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "lesson_comments_delete_author_or_staff" on public.lesson_comments;
create policy "lesson_comments_delete_author_or_staff" on public.lesson_comments
  for delete to authenticated
  using (author_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- course_announcements: staff broadcasts shown at the top of the course.
-- -----------------------------------------------------------------------------
create table if not exists public.course_announcements (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  title text not null,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.course_announcements;
create trigger set_updated_at before update on public.course_announcements
  for each row execute function public.set_updated_at();

create index if not exists idx_course_announcements_course on public.course_announcements (course_id, created_at desc);

alter table public.course_announcements enable row level security;

drop policy if exists "course_announcements_select" on public.course_announcements;
create policy "course_announcements_select" on public.course_announcements
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_announcements.course_id
        and public.can_view_space(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

drop policy if exists "course_announcements_manage_staff" on public.course_announcements;
create policy "course_announcements_manage_staff" on public.course_announcements
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));
