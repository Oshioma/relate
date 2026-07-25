-- =============================================================================
-- Relate — Space Builder: Courses (MVP)
--
-- Run after the space_type enum exists (schema.sql / space-types.sql). Safe to
-- re-run.
--
-- A space with space_type = 'course' hosts one or more courses a community's
-- staff author and members take. Unlike Challenges/Clubs (a single "join"
-- table), a course carries a real content hierarchy and per-learner progress:
--
--   courses ─┬─ course_modules ── course_lessons
--            ├─ course_enrollments        (who's taking it)
--            └─ (lessons) ── lesson_completions   (per-learner progress)
--
-- A course is draft or published: drafts are visible to staff only, so an
-- instructor can build the whole thing before members see it. Authoring is
-- staff-only (owner/admin/moderator, mirroring is_community_staff); enrolling
-- and marking lessons complete are member self-service, mirroring
-- space_challenge_participants.
--
-- community_id is denormalised onto every table (as Challenges/Clubs do on
-- their main tables) purely to keep the RLS staff checks a single hop.
-- =============================================================================

alter type public.space_type add value if not exists 'course';

-- -----------------------------------------------------------------------------
-- courses
-- -----------------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid references public.profiles (id) on delete set null,
  instructor_id uuid references public.profiles (id) on delete set null,
  title text not null,
  summary text,
  cover_image_url text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint course_status_check check (status in ('draft', 'published'))
);

drop trigger if exists set_updated_at on public.courses;
create trigger set_updated_at before update on public.courses
  for each row execute function public.set_updated_at();

create index if not exists idx_courses_space on public.courses (space_id, created_at desc);

alter table public.courses enable row level security;

-- Published courses are visible to anyone who can view the space; drafts only
-- to staff (so an instructor can build one privately).
drop policy if exists "courses_select" on public.courses;
create policy "courses_select" on public.courses
  for select to authenticated
  using (
    public.can_view_space(space_id, auth.uid())
    and (status = 'published' or public.is_community_staff(community_id, auth.uid()))
  );

drop policy if exists "courses_manage_staff" on public.courses;
create policy "courses_manage_staff" on public.courses
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- course_modules: ordered sections within a course.
-- -----------------------------------------------------------------------------
create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.course_modules;
create trigger set_updated_at before update on public.course_modules
  for each row execute function public.set_updated_at();

create index if not exists idx_course_modules_course on public.course_modules (course_id, sort_order);

alter table public.course_modules enable row level security;

drop policy if exists "course_modules_select" on public.course_modules;
create policy "course_modules_select" on public.course_modules
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_modules.course_id
        and public.can_view_space(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

drop policy if exists "course_modules_manage_staff" on public.course_modules;
create policy "course_modules_manage_staff" on public.course_modules
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- course_lessons: ordered lessons within a module. course_id is denormalised
-- alongside module_id so a course's whole lesson set (and its progress) is one
-- query, not a module join.
-- -----------------------------------------------------------------------------
create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  title text not null,
  body text,
  video_url text,
  duration_minutes integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lesson_duration_check check (duration_minutes is null or duration_minutes >= 0)
);

drop trigger if exists set_updated_at on public.course_lessons;
create trigger set_updated_at before update on public.course_lessons
  for each row execute function public.set_updated_at();

create index if not exists idx_course_lessons_module on public.course_lessons (module_id, sort_order);
create index if not exists idx_course_lessons_course on public.course_lessons (course_id);

alter table public.course_lessons enable row level security;

drop policy if exists "course_lessons_select" on public.course_lessons;
create policy "course_lessons_select" on public.course_lessons
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_lessons.course_id
        and public.can_view_space(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

drop policy if exists "course_lessons_manage_staff" on public.course_lessons;
create policy "course_lessons_manage_staff" on public.course_lessons
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- course_enrollments: who's taking which course (the "join" table).
-- -----------------------------------------------------------------------------
create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (course_id, user_id)
);

create index if not exists idx_course_enrollments_course on public.course_enrollments (course_id);
create index if not exists idx_course_enrollments_user on public.course_enrollments (user_id);

alter table public.course_enrollments enable row level security;

drop policy if exists "course_enrollments_select" on public.course_enrollments;
create policy "course_enrollments_select" on public.course_enrollments
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.courses c
      where c.id = course_enrollments.course_id
        and public.can_view_space(c.space_id, auth.uid())
    )
  );

-- A member enrols themselves in a published course they can see.
drop policy if exists "course_enrollments_insert_self" on public.course_enrollments;
create policy "course_enrollments_insert_self" on public.course_enrollments
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.courses c
      where c.id = course_enrollments.course_id
        and c.status = 'published'
        and public.is_community_member(c.community_id, auth.uid())
    )
  );

drop policy if exists "course_enrollments_delete_self_or_staff" on public.course_enrollments;
create policy "course_enrollments_delete_self_or_staff" on public.course_enrollments
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.courses c
      where c.id = course_enrollments.course_id
        and public.is_community_staff(c.community_id, auth.uid())
    )
  );

-- -----------------------------------------------------------------------------
-- lesson_completions: per-learner progress. A row means "this user has
-- finished this lesson". community_id is denormalised so staff can read a
-- community's progress in one hop.
-- -----------------------------------------------------------------------------
create table if not exists public.lesson_completions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (lesson_id, user_id)
);

create index if not exists idx_lesson_completions_user_course on public.lesson_completions (user_id, course_id);
create index if not exists idx_lesson_completions_lesson on public.lesson_completions (lesson_id);

alter table public.lesson_completions enable row level security;

-- A learner sees their own progress; staff see everyone's (for their community).
drop policy if exists "lesson_completions_select" on public.lesson_completions;
create policy "lesson_completions_select" on public.lesson_completions
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_community_staff(community_id, auth.uid())
  );

-- You can only mark your own progress, and only on a lesson whose course you're
-- enrolled in.
drop policy if exists "lesson_completions_insert_self" on public.lesson_completions;
create policy "lesson_completions_insert_self" on public.lesson_completions
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.course_lessons l
      join public.course_enrollments e
        on e.course_id = l.course_id and e.user_id = auth.uid()
      where l.id = lesson_completions.lesson_id
    )
  );

drop policy if exists "lesson_completions_delete_self" on public.lesson_completions;
create policy "lesson_completions_delete_self" on public.lesson_completions
  for delete to authenticated
  using (user_id = auth.uid());
