-- =============================================================================
-- Relate — Extend per-space paywalls to course & marketplace content
--
-- The first paywall migration (20260729185900_space_paywall.sql) gated the base
-- content tables (posts/comments/resources) on has_space_access(). Course and
-- marketplace spaces keep their content in their own tables, so their read
-- policies still gated on can_view_space() — which ignores the subscription.
-- This repoints every space-scoped SELECT (and the content-creating INSERTs)
-- for those tables onto has_space_access(), so a member without an active
-- subscription to a paid space can't read or post its courses/listings either.
--
-- has_space_access() == can_view_space() for FREE spaces, so nothing changes
-- for them. Staff always pass, and the existing published/draft and
-- membership/seller checks are preserved verbatim — only the space gate swaps.
--
-- Safe to re-run.
-- =============================================================================

-- --- Rule: public spaces are always free ------------------------------------
-- A public space is open to everyone (including signed-out visitors), so it can
-- never be paid — pricing only applies to members/private spaces, where the
-- paywall gates access a member would otherwise have. This invariant also means
-- the anonymous read paths (…_select_anon, which only ever match public spaces)
-- can never expose paid content, so they need no paywall change.
alter table public.spaces
  drop constraint if exists spaces_public_is_free;
alter table public.spaces
  add constraint spaces_public_is_free check (price_cents = 0 or visibility <> 'public');

-- --- marketplace_listings (authenticated) -----------------------------------
drop policy if exists "marketplace_listings_select" on public.marketplace_listings;
create policy "marketplace_listings_select" on public.marketplace_listings
  for select to authenticated
  using (public.has_space_access(space_id, auth.uid()));

drop policy if exists "marketplace_listings_insert_member" on public.marketplace_listings;
create policy "marketplace_listings_insert_member" on public.marketplace_listings
  for insert to authenticated
  with check (
    seller_id = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.has_space_access(space_id, auth.uid())
  );

-- --- courses -----------------------------------------------------------------
drop policy if exists "courses_select" on public.courses;
create policy "courses_select" on public.courses
  for select to authenticated
  using (
    public.has_space_access(space_id, auth.uid())
    and (status = 'published' or public.is_community_staff(community_id, auth.uid()))
  );

drop policy if exists "course_modules_select" on public.course_modules;
create policy "course_modules_select" on public.course_modules
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_modules.course_id
        and public.has_space_access(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

drop policy if exists "course_lessons_select" on public.course_lessons;
create policy "course_lessons_select" on public.course_lessons
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_lessons.course_id
        and public.has_space_access(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

drop policy if exists "course_enrollments_select" on public.course_enrollments;
create policy "course_enrollments_select" on public.course_enrollments
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.courses c
      where c.id = course_enrollments.course_id
        and public.has_space_access(c.space_id, auth.uid())
    )
  );

-- Self-enrolling is an act of access, so it needs the subscription too. This
-- preserves the current (courses_v3) rule — self-enrol only in a FREE,
-- published course — and adds the space gate. For a free space has_space_access
-- == can_view_space, so there's no free-space behaviour change. Paid enrolments
-- still come from staff (course_enrollments_insert_staff, left untouched).
drop policy if exists "course_enrollments_insert_self" on public.course_enrollments;
create policy "course_enrollments_insert_self" on public.course_enrollments
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.courses c
      where c.id = course_enrollments.course_id
        and c.status = 'published'
        and c.price_cents = 0
        and public.is_community_member(c.community_id, auth.uid())
        and public.has_space_access(c.space_id, auth.uid())
    )
  );

-- --- lesson Q&A (courses v2) -------------------------------------------------
drop policy if exists "lesson_comments_select" on public.lesson_comments;
create policy "lesson_comments_select" on public.lesson_comments
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = lesson_comments.course_id
        and public.has_space_access(c.space_id, auth.uid())
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
        and public.has_space_access(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

drop policy if exists "course_announcements_select" on public.course_announcements;
create policy "course_announcements_select" on public.course_announcements
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_announcements.course_id
        and public.has_space_access(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

-- --- prerequisites (courses v3) ---------------------------------------------
drop policy if exists "course_prerequisites_select" on public.course_prerequisites;
create policy "course_prerequisites_select" on public.course_prerequisites
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_prerequisites.course_id
        and public.has_space_access(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

-- --- learner-facing quiz structure (courses v3) -----------------------------
-- The redacted (no is_correct) quiz read used by learners. Same gate swap; the
-- function stays SECURITY DEFINER so it can read across the quiz tables.
create or replace function public.course_quiz_data(p_course_id uuid)
returns table (
  quiz_id uuid,
  lesson_id uuid,
  quiz_title text,
  pass_percent integer,
  question_id uuid,
  question_prompt text,
  question_sort integer,
  option_id uuid,
  option_label text,
  option_sort integer
)
language sql
security definer
stable
set search_path = public
as $$
  select q.id, q.lesson_id, q.title, q.pass_percent,
         qq.id, qq.prompt, qq.sort_order,
         qo.id, qo.label, qo.sort_order
  from public.course_quizzes q
  join public.courses c on c.id = q.course_id
  left join public.quiz_questions qq on qq.quiz_id = q.id
  left join public.quiz_options qo on qo.question_id = qq.id
  where q.course_id = p_course_id
    and public.has_space_access(c.space_id, auth.uid())
    and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
  order by q.id, qq.sort_order, qo.sort_order;
$$;
