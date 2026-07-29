-- =============================================================================
-- Relate — localize Live Events notification times
--
-- The scheduled-event and reminder notifications previously baked a UTC time
-- into their body. Because the fan-out inserts one row per recipient, we can
-- format each member's time in their own timezone (profiles.timezone, captured
-- from the browser), falling back to UTC. Redefines the two notification
-- functions to do so via a small formatting helper. Safe to re-run.
-- =============================================================================

-- Renders a timestamptz as a friendly local-time string in the given IANA
-- timezone, e.g. format_local_time(ts, 'Africa/Nairobi') -> "Wed 30 Jul, 18:00
-- (Africa/Nairobi)". A null/blank timezone falls back to UTC. STABLE because
-- timezone conversion depends on the (session-stable) tz database.
create or replace function public.format_local_time(ts timestamptz, tz text)
returns text
language sql
stable
set search_path = public
as $$
  select to_char(ts at time zone coalesce(nullif(tz, ''), 'UTC'), 'FMDy DD Mon, HH24:MI')
    || coalesce(' (' || nullif(tz, '') || ')', ' UTC');
$$;

-- Redefine the schedule/go-live fan-out to localize the scheduled time. Only
-- the 'live_event' body changes (it now joins profiles for each recipient's
-- timezone); 'live_started' carries no time and is unchanged.
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
          then 'Starts ' || public.format_local_time(new.scheduled_start, pr.timezone)
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

-- Redefine the reminder job to localize the "starts" time per RSVPer.
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
    'Starts ' || public.format_local_time(s.scheduled_start, pr.timezone),
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
