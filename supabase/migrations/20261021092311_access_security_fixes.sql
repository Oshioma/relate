-- =============================================================================
-- Relate — access security fixes (before the access redesign builds on them)
--
-- Four gaps found while mapping who can see what. None changes what an
-- ordinary member, a paying member or the team can do through the app; each
-- closes a path that only exists by calling the API directly.
--
-- 1. A member could rewrite their own membership row.
--    memberships_update_admin_or_self lets a user update their own row unless
--    it is 'requested', and its WITH CHECK only pins role = 'member'. So a
--    banned member could set status = 'active' and walk back in, and any member
--    could change community_id on their own row to join a community they were
--    never let into (invite-only included). RLS can't compare OLD and NEW, so a
--    trigger does: through the API (roles anon/authenticated) nobody may move a
--    row to another person or community, and a member who isn't an
--    owner/admin may change their own status only from 'invited' to 'active'
--    (accepting an invite — what joinCommunity does). Security-definer code
--    such as redeem_invite runs as the function owner, not 'authenticated',
--    so invite links keep working exactly as before.
--
-- 2. A subscription outlived the membership.
--    The paid branch of has_space_access asked only "is there an active
--    subscription?", so someone who left or was banned while still subscribed
--    kept reading the space's content through the API, and a tier that
--    included a team-only (private) space opened it to subscribers. The paid
--    branch now also requires can_see_space_shell — an active member for a
--    members space, the team for a private one. The team still passes first,
--    free spaces are unchanged, and public spaces stay open to everyone.
--
-- 2a. An invite-only community's Public spaces were readable by anyone
--    through the API (see below).
--
-- 3. Paid course lessons were only hidden on screen.
--    course_lessons_select let anyone with access to the course's space read
--    every lesson body and video link, enrolled or not; the player merely hid
--    them. Lessons of a PAID course (price_cents > 0) now need an enrolment,
--    or the team. Free courses are unchanged. The course outline (titles and
--    durations, no body or video) stays readable through
--    course_lesson_outline(), so the course page can still show what's inside
--    before someone buys.
--
-- Safe to re-run.
-- =============================================================================

-- --- 1. Membership rows can't be rewritten by their own member ---------------
-- Deliberately NOT security definer: current_user must be the caller's role,
-- so API calls ('authenticated'/'anon') are checked and security-definer
-- functions (redeem_invite and friends, running as their owner) are not.
create or replace function public.guard_membership_self_update()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if new.user_id is distinct from old.user_id or new.community_id is distinct from old.community_id then
    raise exception 'A membership can''t be moved to another person or community.'
      using errcode = '42501';
  end if;

  if v_uid is not null
    and old.user_id = v_uid
    and new.status is distinct from old.status
    and not public.is_community_admin(old.community_id, v_uid)
    and not (old.status = 'invited' and new.status = 'active')
  then
    raise exception 'You can''t change your own membership status.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_membership_self_update on public.community_memberships;
create trigger guard_membership_self_update
  before update on public.community_memberships
  for each row execute function public.guard_membership_self_update();

-- --- 2a. A hidden community's public spaces stay hidden ----------------------
-- can_see_space_shell answered "public space" with a flat yes, so the posts,
-- comments and every other space type in a Public space of an INVITE-ONLY
-- community were readable by anyone calling the API, signed in or not — while
-- the app answers "not found" for the community itself. Invite-only now means
-- members only all the way down. Public and private communities are unchanged:
-- a private community's public spaces are open by link, as the layout intends.
create or replace function public.can_see_space_shell(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select case s.visibility
    when 'public' then c.privacy <> 'invite_only' or public.is_community_member(s.community_id, p_user_id)
    when 'members' then public.is_community_member(s.community_id, p_user_id)
    when 'private' then public.is_community_staff(s.community_id, p_user_id)
    else false
  end
  from public.spaces s
  join public.communities c on c.id = s.community_id
  where s.id = p_space_id;
$$;

-- The anon shell policy tested visibility directly; route it through the same
-- rule so a signed-out visitor can't list an invite-only community's spaces.
drop policy if exists "spaces_select_anon" on public.spaces;
create policy "spaces_select_anon" on public.spaces
  for select to anon
  using (visibility = 'public' and public.can_see_space_shell(id, null::uuid));

-- --- 2b. Paid access needs the membership too --------------------------------
-- Same chain as 20260730093203_membership_tiers (no recursion: the new call is
-- to can_see_space_shell, which calls neither has_space_access nor
-- can_view_space).
create or replace function public.has_space_access(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select case
    when s.id is null then false
    when public.is_community_staff(s.community_id, p_user_id) then true
    -- A public space is always open (mirrors spaces_public_is_free for the price
    -- path, and stops a public space that was added to a tier from being locked).
    when s.visibility <> 'public'
      and (s.price_cents > 0 or exists (select 1 from public.tier_spaces ts where ts.space_id = p_space_id)) then
      -- Paying opens what you could otherwise see: an active member for a
      -- members space, the team for a private one. A subscription alone —
      -- after leaving, after a ban — is not a way in.
      public.can_see_space_shell(p_space_id, p_user_id)
        and (
          public.has_active_space_subscription(p_space_id, p_user_id)
          or public.has_active_tier_for_space(p_space_id, p_user_id)
        )
    else public.can_see_space_shell(p_space_id, p_user_id)
  end
  -- left join guarantees exactly one row even when the space id doesn't exist,
  -- so `s.id is null` is reachable rather than collapsing to zero rows.
  from (select 1) _
  left join (select id, community_id, price_cents, visibility from public.spaces where id = p_space_id) s on true;
$$;

-- --- 3. Paid course lessons need an enrolment --------------------------------
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
            where e.course_id = c.id and e.user_id = auth.uid()
          )
        )
    )
  );

-- The outline of the courses the caller can open: everything a course page
-- lists, nothing a lesson teaches (no body, no video). Same space and
-- draft rules as the lessons themselves, minus the enrolment requirement.
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
  updated_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select l.id, l.module_id, l.course_id, l.community_id, l.title, l.duration_minutes, l.sort_order, l.created_at, l.updated_at
  from public.course_lessons l
  join public.courses c on c.id = l.course_id
  where l.course_id = any(p_course_ids)
    and public.has_space_access(c.space_id, auth.uid())
    and (c.status = 'published' or public.is_community_staff(c.community_id, auth.uid()))
  order by l.sort_order;
$$;

revoke all on function public.course_lesson_outline(uuid[]) from public;
grant execute on function public.course_lesson_outline(uuid[]) to authenticated;
