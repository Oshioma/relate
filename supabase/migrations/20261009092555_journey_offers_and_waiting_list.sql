-- =============================================================================
-- Relate — Guided Journey: mentor offers and the waiting list
--
-- Until now only a beginner could start a mentorship (by asking a mentor).
-- A beginner who signed up while no mentor was available was invisible: no
-- status, and no way for a mentor to find them. This adds:
--
--   * mentorship_requests.initiated_by ('beginner' | 'mentor'). A mentor can
--     now OFFER to help a waiting beginner. Consent is unchanged in spirit:
--     whoever did not start the request is the one who accepts or declines,
--     so nobody is ever paired without saying yes.
--   * journey_beginner_profiles.listed_for_offers — the beginner's opt-in to
--     appear on the waiting list (default on; a checkbox in onboarding).
--   * waiting_beginners(space) — the waiting list for active mentors and
--     staff, returning only non-identifying answers (region, interests,
--     space, experience, help mode). Approximate location, notes and the
--     space photo stay private until a request exists between the two.
--   * A notification to waiting beginners when a mentor whose experience
--     matches their interests joins ('journey_mentor_available').
--   * Notifications for offers, and responses routed to whoever initiated.
--
-- Safe to re-run.
-- =============================================================================

alter table public.mentorship_requests
  add column if not exists initiated_by text not null default 'beginner';
alter table public.mentorship_requests
  drop constraint if exists mentorship_requests_initiated_by_check;
alter table public.mentorship_requests
  add constraint mentorship_requests_initiated_by_check check (initiated_by in ('beginner', 'mentor'));

alter table public.journey_beginner_profiles
  add column if not exists listed_for_offers boolean not null default true;

-- A beginner is "waiting" while they have a profile, aren't on an active
-- journey in this space, and have nothing pending in either direction.
create or replace function public.is_waiting_beginner(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.journey_beginner_profiles b where b.space_id = p_space_id and b.user_id = p_user_id)
    and not exists (
      select 1 from public.journey_participants p
      join public.journeys j on j.id = p.journey_id
      where j.space_id = p_space_id and p.user_id = p_user_id and p.role = 'beginner'
        and p.left_at is null and j.status = 'active'
    )
    and not exists (
      select 1 from public.mentorship_requests r
      where r.space_id = p_space_id and r.beginner_id = p_user_id and r.status = 'pending'
    );
$$;

-- Listed on the waiting list and actually waiting: who a mentor may offer to.
create or replace function public.is_offerable_beginner(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.journey_beginner_profiles b
    where b.space_id = p_space_id and b.user_id = p_user_id and b.listed_for_offers
  ) and public.is_waiting_beginner(p_space_id, p_user_id);
$$;

-- A beginner's own request: unchanged rules, now explicit about who started it.
drop policy if exists "mentorship_requests_insert_beginner" on public.mentorship_requests;
create policy "mentorship_requests_insert_beginner" on public.mentorship_requests
  for insert to authenticated
  with check (
    beginner_id = auth.uid()
    and initiated_by = 'beginner'
    and status = 'pending'
    and journey_id is null
    and responded_at is null
    and response_message is null
    and public.can_view_space(space_id, auth.uid())
    and public.is_community_member(public.space_community_id(space_id), auth.uid())
    and not public.is_blocked_between(beginner_id, mentor_id)
    and exists (
      select 1 from public.guided_journey_spaces g
      where g.space_id = mentorship_requests.space_id and g.accepting_beginners
    )
    and exists (
      select 1 from public.journey_beginner_profiles b
      where b.space_id = mentorship_requests.space_id and b.user_id = auth.uid()
    )
    and exists (
      select 1 from public.journey_mentor_profiles m
      where m.space_id = mentorship_requests.space_id
        and m.user_id = mentorship_requests.mentor_id
        and m.status = 'active'
        and not m.is_paused
    )
  );

-- A mentor's offer: only to a beginner who is listed on the waiting list,
-- from an active, unpaused mentor profile, never across a block.
drop policy if exists "mentorship_requests_insert_mentor_offer" on public.mentorship_requests;
create policy "mentorship_requests_insert_mentor_offer" on public.mentorship_requests
  for insert to authenticated
  with check (
    mentor_id = auth.uid()
    and initiated_by = 'mentor'
    and status = 'pending'
    and journey_id is null
    and requested_journey_id is null
    and responded_at is null
    and response_message is null
    and public.can_view_space(space_id, auth.uid())
    and public.is_community_member(public.space_community_id(space_id), auth.uid())
    and not public.is_blocked_between(beginner_id, mentor_id)
    and exists (
      select 1 from public.journey_mentor_profiles m
      where m.space_id = mentorship_requests.space_id
        and m.user_id = auth.uid()
        and m.status = 'active'
        and not m.is_paused
    )
    -- SECURITY DEFINER check: the mentor can't read the beginner's profile
    -- row until a request exists between them, so a plain subquery here
    -- would refuse every offer.
    and public.is_offerable_beginner(space_id, beginner_id)
  );

-- The waiting list, for active mentors and staff only.
create or replace function public.waiting_beginners(p_space_id uuid)
returns table (
  user_id uuid,
  full_name text,
  username text,
  avatar_url text,
  country text,
  region text,
  setting text[],
  interests text[],
  experience text,
  help_mode text,
  languages text[],
  waiting_since timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select b.user_id, p.full_name, p.username, p.avatar_url, b.country, b.region, b.setting, b.interests,
         b.experience, b.help_mode, b.languages, b.created_at
  from public.journey_beginner_profiles b
  join public.profiles p on p.id = b.user_id
  where b.space_id = p_space_id
    and b.listed_for_offers
    and b.user_id <> auth.uid()
    and public.is_waiting_beginner(p_space_id, b.user_id)
    and not public.is_blocked_between(b.user_id, auth.uid())
    and (
      public.is_space_staff(p_space_id, auth.uid())
      or exists (
        select 1 from public.journey_mentor_profiles m
        where m.space_id = p_space_id and m.user_id = auth.uid() and m.status = 'active'
      )
    )
  order by b.created_at asc;
$$;

revoke all on function public.waiting_beginners(uuid) from public, anon;
grant execute on function public.waiting_beginners(uuid) to authenticated;

create or replace function public.respond_to_mentorship_request(
  p_request_id uuid,
  p_accept boolean,
  p_message text default null,
  p_group_journey_id uuid default null,
  p_milestones jsonb default null,
  p_default_title text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_req public.mentorship_requests%rowtype;
  v_mentor public.journey_mentor_profiles%rowtype;
  v_tpl public.journey_templates%rowtype;
  v_journey_id uuid;
  v_target uuid;
  v_milestones jsonb;
  v_group public.journeys%rowtype;
  v_group_count integer;
begin
  select * into v_req from public.mentorship_requests where id = p_request_id for update;
  if v_req.id is null then
    raise exception 'Request not found';
  end if;
  -- Whoever didn't start it answers: the mentor answers a beginner's
  -- request, the beginner answers a mentor's offer. Never the initiator.
  if (v_req.initiated_by = 'beginner' and v_req.mentor_id is distinct from auth.uid())
     or (v_req.initiated_by = 'mentor' and v_req.beginner_id is distinct from auth.uid()) then
    raise exception 'Only the person who was asked can answer this';
  end if;
  if v_req.status <> 'pending' then
    raise exception 'This request has already been answered';
  end if;

  if not p_accept then
    update public.mentorship_requests
      set status = 'declined', response_message = nullif(trim(p_message), ''), responded_at = now()
      where id = p_request_id;
    return null;
  end if;

  if public.is_blocked_between(v_req.beginner_id, v_req.mentor_id) then
    raise exception 'You can''t mentor this member';
  end if;

  select * into v_mentor from public.journey_mentor_profiles
    where space_id = v_req.space_id and user_id = v_req.mentor_id;
  if v_mentor.id is null or v_mentor.status <> 'active' then
    raise exception 'That mentor profile is not active in this space';
  end if;
  if public.mentor_active_beginner_count(v_req.space_id, v_req.mentor_id) >= v_mentor.capacity then
    raise exception '%', case when v_req.initiated_by = 'mentor' then 'This mentor has no free places any more — their offer can''t be accepted right now' else 'You have no free places right now — raise your capacity or finish a journey first' end;
  end if;

  v_target := coalesce(p_group_journey_id, v_req.requested_journey_id);

  if v_target is not null then
    select * into v_group from public.journeys where id = v_target for update;
    if v_group.id is null or v_group.space_id <> v_req.space_id or v_group.mentor_id <> v_req.mentor_id
       or v_group.status <> 'active' or not v_group.is_group then
      raise exception 'That group journey is not available';
    end if;
    select count(*) into v_group_count from public.journey_participants
      where journey_id = v_target and role = 'beginner' and left_at is null;
    if v_group.max_beginners is not null and v_group_count >= v_group.max_beginners then
      raise exception 'That group journey is full';
    end if;
    insert into public.journey_participants (journey_id, user_id, role)
      values (v_target, v_req.beginner_id, 'beginner')
      on conflict (journey_id, user_id) do update set left_at = null;
    v_journey_id := v_target;
  else
    if v_req.template_id is not null then
      select * into v_tpl from public.journey_templates where id = v_req.template_id and space_id = v_req.space_id;
    end if;
    v_milestones := coalesce(
      case when v_tpl.id is not null and jsonb_array_length(v_tpl.milestones) > 0 then v_tpl.milestones end,
      p_milestones,
      '[]'::jsonb
    );

    insert into public.journeys (space_id, template_id, mentor_id, title, subject, cover_image_url, duration_label, expected_weeks)
    values (
      v_req.space_id,
      v_tpl.id,
      v_req.mentor_id,
      coalesce(v_tpl.title, nullif(trim(p_default_title), ''), 'Our journey'),
      v_tpl.subject,
      v_tpl.cover_image_url,
      v_tpl.duration_label,
      v_tpl.expected_weeks
    )
    returning id into v_journey_id;

    insert into public.journey_participants (journey_id, user_id, role)
    values (v_journey_id, v_req.mentor_id, 'mentor'), (v_journey_id, v_req.beginner_id, 'beginner');

    insert into public.journey_milestones (journey_id, position, title, description)
    select v_journey_id, (m.ord - 1)::integer, left(m.value ->> 'title', 160), nullif(m.value ->> 'description', '')
    from jsonb_array_elements(v_milestones) with ordinality as m(value, ord)
    where coalesce(trim(m.value ->> 'title'), '') <> '';
  end if;

  update public.mentorship_requests
    set status = 'accepted', response_message = nullif(trim(p_message), ''), responded_at = now(), journey_id = v_journey_id
    where id = p_request_id;

  return v_journey_id;
end;
$$;

-- The initiator takes back a request or offer that hasn't been answered.
create or replace function public.withdraw_mentorship_request(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.mentorship_requests
    set status = 'withdrawn', responded_at = now()
    where id = p_request_id
      and status = 'pending'
      and ((initiated_by = 'beginner' and beginner_id = auth.uid())
        or (initiated_by = 'mentor' and mentor_id = auth.uid()));
  if not found then
    raise exception 'Request not found or already answered';
  end if;
end;
$$;

-- Notifications: the person asked hears about it; the initiator hears the answer.
create or replace function public.notify_mentorship_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_link text := public.journey_space_link(new.space_id);
  v_asker uuid := case when new.initiated_by = 'mentor' then new.mentor_id else new.beginner_id end;
  v_asked uuid := case when new.initiated_by = 'mentor' then new.beginner_id else new.mentor_id end;
begin
  if tg_op = 'INSERT' then
    insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
    values (
      v_asked,
      public.space_community_id(new.space_id),
      'journey_request',
      case when new.initiated_by = 'mentor'
        then public.journey_display_name(new.mentor_id) || ' has offered to guide you'
        else public.journey_display_name(new.beginner_id) || ' would like you to guide them'
      end,
      left(new.message, 200),
      v_link || '/requests',
      v_asker
    );
  elsif tg_op = 'UPDATE' and old.status = 'pending' and new.status in ('accepted', 'declined') then
    insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
    values (
      v_asker,
      public.space_community_id(new.space_id),
      'journey_request_response',
      case
        when new.status = 'accepted' then public.journey_display_name(v_asked) || ' said yes — your journey has started'
        when new.initiated_by = 'mentor' then public.journey_display_name(v_asked) || ' has decided not to go ahead for now'
        else public.journey_display_name(v_asked) || ' can''t take you on right now'
      end,
      left(new.response_message, 200),
      case when new.status = 'accepted' and new.journey_id is not null
        then v_link || '/journeys/' || new.journey_id
        else v_link || case when new.initiated_by = 'mentor' then '/requests' else '/mentors' end
      end,
      v_asked
    );
  end if;
  return new;
end;
$$;

-- A new mentor joins: tell the beginners who are waiting and want what this
-- mentor knows (or haven't decided yet). One notification per mentor sign-up.
create or replace function public.notify_mentor_available()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_topics text[] := array(select lower(trim(t)) from unnest(new.experience || new.preferred_topics) as t);
begin
  if new.status <> 'active' or new.is_paused then
    return new;
  end if;

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    b.user_id,
    public.space_community_id(new.space_id),
    'journey_mentor_available',
    public.journey_display_name(new.user_id) || ' has joined as a mentor and could help you',
    left(new.intro, 200),
    public.journey_space_link(new.space_id) || '/mentors',
    new.user_id
  from public.journey_beginner_profiles b
  where b.space_id = new.space_id
    and b.user_id <> new.user_id
    and public.is_waiting_beginner(new.space_id, b.user_id)
    and not public.is_blocked_between(b.user_id, new.user_id)
    and (
      cardinality(b.interests) = 0
      or 'not_sure' = any (b.interests)
      or exists (select 1 from unnest(b.interests) i where lower(i) = any (v_topics))
    );
  return new;
end;
$$;

drop trigger if exists trg_notify_mentor_available on public.journey_mentor_profiles;
create trigger trg_notify_mentor_available
  after insert on public.journey_mentor_profiles
  for each row execute function public.notify_mentor_available();
