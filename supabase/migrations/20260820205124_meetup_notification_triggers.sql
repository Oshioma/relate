-- =============================================================================
-- Relate — Meetup notifications
--
-- Two triggers, mirroring notify_live_session:
--   * a meetup is posted        -> 'meetup'      to every member who can see
--                                                 the space, except the host
--   * someone joins a meetup    -> 'meetup_join' to the host only
--
-- The posted notification is the whole point of the Activity type: a walk
-- starting in 40 minutes is only useful if people hear about it now. The time
-- is rendered in each recipient's own timezone via format_local_time (see
-- 20260729185142_localize_live_notifications.sql), since the fan-out already
-- writes one row per member. Each notification is emailed and pushed by the
-- existing notifications triggers — no new plumbing. Safe to re-run.
-- =============================================================================

create or replace function public.notify_meetup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_community_slug text;
  v_space_slug text;
  v_link text;
  v_prefix text;
begin
  -- Only a brand-new, open meetup notifies. Edits and cancellations don't
  -- re-notify the community; the board and the host's own participants list
  -- carry those.
  if new.status <> 'open' then
    return new;
  end if;

  select slug into v_community_slug from public.communities where id = new.community_id;
  select slug into v_space_slug from public.spaces where id = new.space_id;
  v_link := '/c/' || v_community_slug || '/spaces/' || v_space_slug;
  v_prefix := coalesce(nullif(new.activity, '') || ': ', '');

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    m.user_id,
    new.community_id,
    'meetup',
    v_prefix || new.title,
    'Starts ' || public.format_local_time(new.starts_at, p.timezone)
      || coalesce(' · ' || nullif(new.meeting_point, ''), ''),
    v_link,
    new.created_by
  from public.community_memberships m
  join public.profiles p on p.id = m.user_id
  where m.community_id = new.community_id
    and m.status = 'active'
    and m.user_id is distinct from new.created_by
    and public.can_view_space(new.space_id, m.user_id);

  return new;
end;
$$;

drop trigger if exists trg_notify_meetup on public.meetups;
create trigger trg_notify_meetup
  after insert on public.meetups
  for each row execute function public.notify_meetup();

-- -----------------------------------------------------------------------------
-- Someone's in: tell the host, so they know who to wait for at the trailhead.
-- The host's own auto-join on create is skipped by the actor check.
-- -----------------------------------------------------------------------------
create or replace function public.notify_meetup_join()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_meetup public.meetups%rowtype;
  v_community_slug text;
  v_space_slug text;
  v_joiner text;
begin
  select * into v_meetup from public.meetups where id = new.meetup_id;
  if v_meetup.id is null or v_meetup.created_by = new.user_id then
    return new;
  end if;

  select coalesce(nullif(full_name, ''), username, 'Someone') into v_joiner
  from public.profiles where id = new.user_id;

  select slug into v_community_slug from public.communities where id = v_meetup.community_id;
  select slug into v_space_slug from public.spaces where id = v_meetup.space_id;

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  values (
    v_meetup.created_by,
    v_meetup.community_id,
    'meetup_join',
    coalesce(v_joiner, 'Someone') || ' is in: ' || v_meetup.title,
    null,
    '/c/' || v_community_slug || '/spaces/' || v_space_slug,
    new.user_id
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_meetup_join on public.meetup_participants;
create trigger trg_notify_meetup_join
  after insert on public.meetup_participants
  for each row execute function public.notify_meetup_join();
