-- =============================================================================
-- Relate — Courses: live, video and text lessons; one-off purchase; tiers
--
-- Every course space can now mix three kinds of lesson:
--
--   'text'   written lesson (the body), as before.
--   'video'  a prerecorded video (video_url: YouTube, Vimeo, Google Drive or
--            a direct .mp4 link), with optional notes in the body.
--   'live'   a live video lesson at live_starts_at (until live_ends_at). The
--            room opens inside the lesson; afterwards the teacher pastes the
--            recording into video_url and the lesson becomes its playback.
--
-- Paying for a course:
--
--   A one-off Stripe Checkout (mode 'payment') writes a course_enrollments row
--   with paid = true (the webhook, service role). Staff grants are paid = true
--   too. Whether a buyer may also JOIN the live lessons, or only watch their
--   playbacks, is the course's live_included_with_purchase switch.
--
--   A membership tier can include a course for free (tier_courses). This is
--   per course on purpose: putting the course's SPACE in a tier (tier_spaces)
--   would gate the whole space to tier members, and one-off buyers couldn't
--   even open the course page. Tier members join live lessons and watch every
--   playback, and their access ends with the subscription.
--
-- Paid lessons are now readable by: the team, a PAID enrolment (bought or
-- granted), or an active tier that includes the course. A free enrolment
-- (paid = false) no longer opens a paid course, so a lapsed tier member's
-- leftover enrolment can't keep the lessons open. (Checked before writing: no
-- paid course had an unpaid enrolment.)
--
-- Also converts Escape Space's "Wisdom School Self-Discovery Course" space
-- from a Live space into a Courses space, at Oshi's request, with a draft
-- course ready for its lessons.
--
-- Safe to re-run.
-- =============================================================================

-- --- Lesson kinds --------------------------------------------------------------
alter table public.course_lessons add column if not exists lesson_type text not null default 'text';
alter table public.course_lessons add column if not exists live_starts_at timestamptz;
alter table public.course_lessons add column if not exists live_ends_at timestamptz;

alter table public.course_lessons drop constraint if exists course_lessons_lesson_type_check;
alter table public.course_lessons
  add constraint course_lessons_lesson_type_check check (lesson_type in ('text', 'video', 'live'));

alter table public.course_lessons drop constraint if exists course_lessons_live_needs_start;
alter table public.course_lessons
  add constraint course_lessons_live_needs_start check (lesson_type <> 'live' or live_starts_at is not null);

-- Lessons that were only a video link are video lessons.
update public.course_lessons
set lesson_type = 'video'
where lesson_type = 'text' and video_url is not null and coalesce(btrim(body), '') = '';

-- --- Purchase settings ---------------------------------------------------------
alter table public.courses add column if not exists live_included_with_purchase boolean not null default false;
alter table public.course_enrollments add column if not exists stripe_checkout_session_id text;

-- --- Tiers that include a course -----------------------------------------------
create table if not exists public.tier_courses (
  tier_id uuid not null references public.community_tiers (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tier_id, course_id)
);

create index if not exists idx_tier_courses_course on public.tier_courses (course_id);

alter table public.tier_courses enable row level security;

drop policy if exists "tier_courses_select" on public.tier_courses;
create policy "tier_courses_select" on public.tier_courses
  for select to authenticated
  using (public.is_community_member(community_id, auth.uid()) or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "tier_courses_manage_staff" on public.tier_courses;
create policy "tier_courses_manage_staff" on public.tier_courses
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

-- Does the user hold a paid-up subscription to a tier that includes this
-- course? Same "paid up" rule as has_active_tier_for_space.
create or replace function public.has_active_tier_for_course(p_course_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.tier_subscriptions sub
    join public.tier_courses tc on tc.tier_id = sub.tier_id
    where tc.course_id = p_course_id
      and sub.user_id = p_user_id
      and sub.status in ('active', 'trialing')
      and (sub.current_period_end is null or sub.current_period_end > now())
  );
$$;

revoke all on function public.has_active_tier_for_course(uuid, uuid) from public;
grant execute on function public.has_active_tier_for_course(uuid, uuid) to authenticated;

-- --- Who can read a lesson -----------------------------------------------------
drop policy if exists "course_lessons_select" on public.course_lessons;
create policy "course_lessons_select" on public.course_lessons
  for select to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_lessons.course_id
        and public.has_space_access(c.space_id, auth.uid())
        and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
        and (
          c.price_cents = 0
          or public.is_community_staff(c.community_id, auth.uid())
          or exists (
            select 1 from public.course_enrollments e
            where e.course_id = c.id and e.user_id = auth.uid() and e.paid
          )
          or public.has_active_tier_for_course(c.id, auth.uid())
        )
    )
  );

-- Members enrol themselves in free courses, and in paid courses their tier
-- includes (to track progress). Never as a paid enrolment: only the webhook
-- and the team write those.
drop policy if exists "course_enrollments_insert_self" on public.course_enrollments;
create policy "course_enrollments_insert_self" on public.course_enrollments
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and paid = false
    and stripe_checkout_session_id is null
    and exists (
      select 1 from public.courses c
      where c.id = course_enrollments.course_id
        and c.status = 'published'
        and (c.price_cents = 0 or public.has_active_tier_for_course(c.id, auth.uid()))
        and public.is_community_member(c.community_id, auth.uid())
        and public.has_space_access(c.space_id, auth.uid())
    )
  );

-- --- The outline now says what kind each lesson is -----------------------------
drop function if exists public.course_lesson_outline(uuid[]);
create or replace function public.course_lesson_outline(p_course_ids uuid[])
returns table (
  id uuid,
  module_id uuid,
  course_id uuid,
  community_id uuid,
  title text,
  duration_minutes integer,
  sort_order integer,
  created_at timestamptz,
  updated_at timestamptz,
  lesson_type text,
  live_starts_at timestamptz,
  live_ends_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select l.id, l.module_id, l.course_id, l.community_id, l.title, l.duration_minutes, l.sort_order, l.created_at, l.updated_at,
         l.lesson_type, l.live_starts_at, l.live_ends_at
  from public.course_lessons l
  join public.courses c on c.id = l.course_id
  where l.course_id = any(p_course_ids)
    and public.has_space_access(c.space_id, auth.uid())
    and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
  order by l.sort_order;
$$;

revoke all on function public.course_lesson_outline(uuid[]) from public;
grant execute on function public.course_lesson_outline(uuid[]) to authenticated;

-- --- Escape Space: Wisdom School becomes a Courses space -----------------------
do $$
declare
  v_space public.spaces%rowtype;
  v_owner uuid;
  v_course uuid;
begin
  select s.* into v_space
  from public.spaces s
  join public.communities c on c.id = s.community_id
  where c.slug = 'escapespace' and s.slug = 'wisdom-school-teachings';
  if not found then
    return;
  end if;

  update public.spaces set space_type = 'course' where id = v_space.id and space_type <> 'course';

  if not exists (select 1 from public.courses where space_id = v_space.id) then
    select owner_id into v_owner from public.communities where id = v_space.community_id;
    insert into public.courses (space_id, community_id, created_by, instructor_id, title, summary, status)
    values (
      v_space.id,
      v_space.community_id,
      v_owner,
      v_owner,
      'Wisdom School Self-Discovery Course',
      'The Wisdom School teachings: join the live sessions, and watch every session back afterwards.',
      'draft'
    )
    returning id into v_course;

    insert into public.course_modules (course_id, community_id, title, sort_order)
    values (v_course, v_space.community_id, 'Teachings', 0);
  end if;
end $$;
