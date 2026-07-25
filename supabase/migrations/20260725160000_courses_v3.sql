-- =============================================================================
-- Relate — Courses v3: quizzes/assessments, prerequisites, paid enrolment
--
-- Builds on the Courses MVP + v2. Safe to re-run.
--
-- Quizzes are graded server-side. Correct answers must never reach a learner's
-- client, so quiz_questions/quiz_options SELECT is staff-only; learners read a
-- redacted view via the SECURITY DEFINER function course_quiz_data() (no
-- is_correct), and submit through grade_quiz(), which scores against the
-- correct set, records the attempt, and auto-completes the lesson on a pass.
--
-- Paid enrolment: a course carries a price. The self-enrol RLS gate only lets
-- members join *free* courses on their own; paid access is granted by staff
-- (manual grant) or, once a payment provider is wired, a privileged purchase
-- flow. Prerequisites are enforced softly (in the enrol action + UI), like drip.
-- =============================================================================

-- Pricing ---------------------------------------------------------------------
alter table public.courses add column if not exists price_cents integer not null default 0;
alter table public.courses add column if not exists currency text not null default 'usd';
alter table public.course_enrollments add column if not exists paid boolean not null default false;

-- -----------------------------------------------------------------------------
-- Prerequisites: a course can require other courses be completed first.
-- -----------------------------------------------------------------------------
create table if not exists public.course_prerequisites (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  prerequisite_course_id uuid not null references public.courses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (course_id, prerequisite_course_id),
  constraint prerequisite_not_self check (course_id <> prerequisite_course_id)
);

create index if not exists idx_course_prerequisites_course on public.course_prerequisites (course_id);

alter table public.course_prerequisites enable row level security;

drop policy if exists "course_prerequisites_select" on public.course_prerequisites;
create policy "course_prerequisites_select" on public.course_prerequisites
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_prerequisites.course_id
        and public.can_view_space(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
    )
  );

drop policy if exists "course_prerequisites_manage_staff" on public.course_prerequisites;
create policy "course_prerequisites_manage_staff" on public.course_prerequisites
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- Quizzes. One quiz per lesson. Questions each have options; grading treats a
-- question as correct when the selected option set equals its correct set
-- (so single- and multi-answer both work).
-- -----------------------------------------------------------------------------
create table if not exists public.course_quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  title text not null default 'Quiz',
  pass_percent integer not null default 70,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id),
  constraint pass_percent_range check (pass_percent between 0 and 100)
);

drop trigger if exists set_updated_at on public.course_quizzes;
create trigger set_updated_at before update on public.course_quizzes
  for each row execute function public.set_updated_at();

create index if not exists idx_course_quizzes_course on public.course_quizzes (course_id);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.course_quizzes (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  prompt text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_questions_quiz on public.quiz_questions (quiz_id, sort_order);

create table if not exists public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  label text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_options_question on public.quiz_options (question_id, sort_order);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.course_quizzes (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  score_percent integer not null,
  passed boolean not null,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_attempts_user on public.quiz_attempts (user_id, quiz_id, created_at desc);

alter table public.course_quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.quiz_attempts enable row level security;

-- Quiz definitions are STAFF-ONLY at the table level. Learners read a redacted
-- copy via course_quiz_data() (below), which omits is_correct.
drop policy if exists "course_quizzes_staff" on public.course_quizzes;
create policy "course_quizzes_staff" on public.course_quizzes
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

drop policy if exists "quiz_questions_staff" on public.quiz_questions;
create policy "quiz_questions_staff" on public.quiz_questions
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

drop policy if exists "quiz_options_staff" on public.quiz_options;
create policy "quiz_options_staff" on public.quiz_options
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

-- A learner reads their own attempts; staff see everyone's. Writes happen only
-- through grade_quiz() (SECURITY DEFINER), so there is no insert policy.
drop policy if exists "quiz_attempts_select" on public.quiz_attempts;
create policy "quiz_attempts_select" on public.quiz_attempts
  for select to authenticated
  using (user_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- course_quiz_data: learner-facing quiz structure WITHOUT is_correct. Flat rows
-- (question x option); the app nests them. Visible to anyone who can view the
-- course.
-- -----------------------------------------------------------------------------
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
    and public.can_view_space(c.space_id, auth.uid())
    and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
  order by q.id, qq.sort_order, qo.sort_order;
$$;

-- -----------------------------------------------------------------------------
-- grade_quiz: score a submission against the correct set, record the attempt,
-- and auto-complete the attached lesson on a pass. Runs as definer so it can
-- read is_correct and write the attempt/completion the caller can't touch
-- directly.
-- -----------------------------------------------------------------------------
create or replace function public.grade_quiz(p_quiz_id uuid, p_selected uuid[])
returns table (score_percent integer, passed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_course_id uuid;
  v_community_id uuid;
  v_lesson_id uuid;
  v_pass integer;
  v_total integer;
  v_correct integer;
  v_score integer;
  v_passed boolean;
  v_uid uuid := auth.uid();
begin
  select course_id, community_id, lesson_id, pass_percent
    into v_course_id, v_community_id, v_lesson_id, v_pass
  from public.course_quizzes where id = p_quiz_id;

  if v_course_id is null then
    raise exception 'Quiz not found';
  end if;
  if not public.is_community_member(v_community_id, v_uid) then
    raise exception 'Not allowed';
  end if;

  select count(*) into v_total from public.quiz_questions where quiz_id = p_quiz_id;

  if v_total = 0 then
    v_score := 0;
  else
    select count(*) into v_correct
    from public.quiz_questions qq
    where qq.quiz_id = p_quiz_id
      and (
        select coalesce(array_agg(qo.id order by qo.id) filter (where qo.is_correct), '{}')
        from public.quiz_options qo where qo.question_id = qq.id
      ) = (
        select coalesce(array_agg(qo.id order by qo.id), '{}')
        from public.quiz_options qo where qo.question_id = qq.id and qo.id = any(p_selected)
      );
    v_score := round(100.0 * v_correct / v_total);
  end if;

  v_passed := v_score >= v_pass;

  insert into public.quiz_attempts (quiz_id, course_id, community_id, user_id, score_percent, passed, answers)
  values (p_quiz_id, v_course_id, v_community_id, v_uid, v_score, v_passed, to_jsonb(p_selected));

  if v_passed and v_lesson_id is not null then
    insert into public.lesson_completions (lesson_id, course_id, community_id, user_id)
    values (v_lesson_id, v_course_id, v_community_id, v_uid)
    on conflict (lesson_id, user_id) do nothing;
  end if;

  return query select v_score, v_passed;
end;
$$;

grant execute on function public.course_quiz_data(uuid) to authenticated;
grant execute on function public.grade_quiz(uuid, uuid[]) to authenticated;

-- -----------------------------------------------------------------------------
-- Enrolment RLS, revised for paid courses: a member may self-enrol only in a
-- FREE course. Paid enrolments are created by staff (manual grant) or a future
-- privileged purchase flow. (Replaces the v1 self-insert policy.)
-- -----------------------------------------------------------------------------
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
    )
  );

-- Staff can enrol anyone (grant access to a paid course, add a learner, etc.).
drop policy if exists "course_enrollments_insert_staff" on public.course_enrollments;
create policy "course_enrollments_insert_staff" on public.course_enrollments
  for insert to authenticated
  with check (
    exists (
      select 1 from public.courses c
      where c.id = course_enrollments.course_id
        and public.is_community_staff(c.community_id, auth.uid())
    )
  );
