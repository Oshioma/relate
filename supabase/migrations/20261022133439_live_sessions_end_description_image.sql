-- =============================================================================
-- Relate — Live Events: end time, description and cover image
--
-- A scheduled live session only had a title and a start time, while community
-- Events also carry an end time, a description and an image. This brings those
-- three across:
--
--   scheduled_end  — when the session is planned to finish (optional; must be
--                    after scheduled_start). Shown as "11:00–11:30". The real
--                    started_at / ended_at are still stamped by Go live / End.
--   description    — what the session is about (optional).
--   image_url      — a cover image for the card and the home page (optional).
--
-- The "New live event" and "starts soon" notifications now show the time range
-- when an end time is set. Safe to re-run.
-- =============================================================================

alter table public.live_sessions
  add column if not exists scheduled_end timestamptz,
  add column if not exists description text,
  add column if not exists image_url text;

alter table public.live_sessions drop constraint if exists live_sessions_scheduled_end_after_start;
alter table public.live_sessions add constraint live_sessions_scheduled_end_after_start
  check (scheduled_end is null or scheduled_start is null or scheduled_end > scheduled_start);

alter table public.live_sessions drop constraint if exists live_sessions_description_length;
alter table public.live_sessions add constraint live_sessions_description_length
  check (description is null or char_length(description) <= 2000);

-- Like format_local_time, but with the end time when there is one:
-- "Tue 20 Oct, 11:00–11:30 (Africa/Dar_es_Salaam)". An end on another day
-- gets its own date: "Tue 20 Oct, 23:00 – Wed 21 Oct, 01:00 UTC".
create or replace function public.format_local_time_range(start_ts timestamptz, end_ts timestamptz, tz text)
returns text
language sql
stable
set search_path = public
as $$
  select case
    when end_ts is null then public.format_local_time(start_ts, tz)
    when (start_ts at time zone coalesce(nullif(tz, ''), 'UTC'))::date
       = (end_ts at time zone coalesce(nullif(tz, ''), 'UTC'))::date
      then to_char(start_ts at time zone coalesce(nullif(tz, ''), 'UTC'), 'FMDy DD Mon, HH24:MI')
        || '–' || to_char(end_ts at time zone coalesce(nullif(tz, ''), 'UTC'), 'HH24:MI')
        || coalesce(' (' || nullif(tz, '') || ')', ' UTC')
    else to_char(start_ts at time zone coalesce(nullif(tz, ''), 'UTC'), 'FMDy DD Mon, HH24:MI')
      || ' – ' || public.format_local_time(end_ts, tz)
  end;
$$;

-- Same as 20260729185142_localize_live_notifications, with the time range in
-- the 'live_event' body.
create or replace function public.notify_live_session()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_community_slug text;
  v_space_slug text;
  v_link text;
  v_became_live boolean;
  v_became_scheduled boolean;
begin
  v_became_scheduled := (TG_OP = 'INSERT' and new.status = 'scheduled');
  v_became_live := (new.status = 'live' and (TG_OP = 'INSERT' or old.status is distinct from 'live'));

  if not (v_became_scheduled or v_became_live) then
    return new;
  end if;

  select slug into v_community_slug from public.communities where id = new.community_id;
  select slug into v_space_slug from public.spaces where id = new.space_id;
  v_link := '/c/' || v_community_slug || '/spaces/' || v_space_slug;

  if v_became_scheduled then
    insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
    select
      m.user_id,
      new.community_id,
      'live_event',
      'New live event: ' || new.title,
      case
        when new.scheduled_start is not null
          then 'Starts ' || public.format_local_time_range(new.scheduled_start, new.scheduled_end, pr.timezone)
        else null
      end,
      v_link,
      new.started_by
    from public.community_memberships m
    join public.profiles pr on pr.id = m.user_id
    where m.community_id = new.community_id
      and m.status = 'active'
      and m.user_id is distinct from new.started_by
      and public.can_view_space(new.space_id, m.user_id);
  end if;

  if v_became_live then
    insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
    select
      m.user_id,
      new.community_id,
      'live_started',
      new.title || ' is live now — join',
      null,
      v_link,
      new.started_by
    from public.community_memberships m
    where m.community_id = new.community_id
      and m.status = 'active'
      and m.user_id is distinct from new.started_by
      and public.can_view_space(new.space_id, m.user_id);
  end if;

  return new;
end;
$$;

-- Same as 20260729185142_localize_live_notifications, with the time range in
-- the reminder body.
create or replace function public.send_live_event_reminders()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    r.user_id,
    s.community_id,
    'live_reminder',
    s.title || ' starts soon',
    'Starts ' || public.format_local_time_range(s.scheduled_start, s.scheduled_end, pr.timezone),
    '/c/' || c.slug || '/spaces/' || sp.slug,
    s.started_by
  from public.live_sessions s
  join public.communities c on c.id = s.community_id
  join public.spaces sp on sp.id = s.space_id
  join public.live_session_rsvps r on r.session_id = s.id
  join public.profiles pr on pr.id = r.user_id
  where s.status = 'scheduled'
    and s.reminder_sent_at is null
    and s.scheduled_start is not null
    and s.scheduled_start <= now() + interval '10 minutes'
    and s.scheduled_start > now() - interval '1 hour'
    and public.can_view_space(s.space_id, r.user_id);

  update public.live_sessions s
  set reminder_sent_at = now()
  where s.status = 'scheduled'
    and s.reminder_sent_at is null
    and s.scheduled_start is not null
    and s.scheduled_start <= now() + interval '10 minutes'
    and s.scheduled_start > now() - interval '1 hour';
end;
$$;
