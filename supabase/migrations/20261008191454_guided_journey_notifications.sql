-- =============================================================================
-- Relate — Guided Journey notifications
--
-- Lightweight by design: one notification per real event, never a digest of
-- every edit. Each row is emailed and pushed by the existing notification
-- triggers (respecting each member's preferences), so there is no new
-- delivery plumbing.
--
--   request created            -> mentor           'journey_request'
--   request accepted/declined  -> beginner         'journey_request_response'
--   update or reply posted     -> other people on
--                                 the journey      'journey_update'
--   journey completed / ended  -> other people on
--                                 the journey      'journey_completed' / 'journey_update'
--   report filed               -> community staff  'journey_report'
--
-- Safe to re-run.
-- =============================================================================

create or replace function public.journey_space_link(p_space_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select '/c/' || c.slug || '/spaces/' || s.slug
  from public.spaces s join public.communities c on c.id = s.community_id
  where s.id = p_space_id;
$$;

create or replace function public.journey_display_name(p_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(nullif(full_name, ''), username, 'Someone') from public.profiles where id = p_user_id;
$$;

-- --- Requests -----------------------------------------------------------------
create or replace function public.notify_mentorship_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_link text := public.journey_space_link(new.space_id);
begin
  if tg_op = 'INSERT' then
    insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
    values (
      new.mentor_id,
      public.space_community_id(new.space_id),
      'journey_request',
      public.journey_display_name(new.beginner_id) || ' would like you to guide them',
      left(new.message, 200),
      v_link || '/requests',
      new.beginner_id
    );
  elsif tg_op = 'UPDATE' and old.status = 'pending' and new.status in ('accepted', 'declined') then
    insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
    values (
      new.beginner_id,
      public.space_community_id(new.space_id),
      'journey_request_response',
      case when new.status = 'accepted'
        then public.journey_display_name(new.mentor_id) || ' said yes — your journey has started'
        else public.journey_display_name(new.mentor_id) || ' can''t take you on right now'
      end,
      left(new.response_message, 200),
      case when new.status = 'accepted' and new.journey_id is not null
        then v_link || '/journeys/' || new.journey_id
        else v_link || '/mentors'
      end,
      new.mentor_id
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notify_mentorship_request on public.mentorship_requests;
create trigger trg_notify_mentorship_request
  after insert or update of status on public.mentorship_requests
  for each row execute function public.notify_mentorship_request();

-- --- Updates and replies --------------------------------------------------------
create or replace function public.notify_journey_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.journeys%rowtype;
begin
  select * into v_journey from public.journeys where id = new.journey_id;
  if v_journey.id is null then
    return new;
  end if;

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    p.user_id,
    public.space_community_id(v_journey.space_id),
    'journey_update',
    public.journey_display_name(new.author_id)
      || case
           when new.parent_id is not null then ' replied on '
           when coalesce(new.question, '') <> '' then ' asked a question on '
           else ' posted an update on '
         end
      || v_journey.title,
    left(coalesce(nullif(new.question, ''), new.body), 200),
    public.journey_space_link(v_journey.space_id) || '/journeys/' || v_journey.id,
    new.author_id
  from public.journey_participants p
  where p.journey_id = new.journey_id
    and p.left_at is null
    and p.user_id <> new.author_id;

  return new;
end;
$$;

drop trigger if exists trg_notify_journey_update on public.journey_updates;
create trigger trg_notify_journey_update
  after insert on public.journey_updates
  for each row execute function public.notify_journey_update();

-- --- Completion / ending ----------------------------------------------------------
create or replace function public.notify_journey_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := coalesce(auth.uid(), new.ended_by);
begin
  if new.status = old.status or new.status not in ('completed', 'ended') then
    return new;
  end if;

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    p.user_id,
    public.space_community_id(new.space_id),
    case when new.status = 'completed' then 'journey_completed'::public.notification_type
         else 'journey_update'::public.notification_type end,
    case when new.status = 'completed'
      then 'Journey complete: ' || new.title
      else public.journey_display_name(v_actor) || ' ended the journey ' || new.title
    end,
    case when new.status = 'ended' then left(new.end_reason, 200) end,
    public.journey_space_link(new.space_id) || '/journeys/' || new.id
      || case when new.status = 'completed' then '/celebrate' else '' end,
    v_actor
  from public.journey_participants p
  where p.journey_id = new.id
    and p.left_at is null
    and p.user_id is distinct from v_actor;

  return new;
end;
$$;

drop trigger if exists trg_notify_journey_status on public.journeys;
create trigger trg_notify_journey_status
  after update of status on public.journeys
  for each row execute function public.notify_journey_status();

-- --- Reports to staff ----------------------------------------------------------------
create or replace function public.notify_journey_report()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_community uuid := public.space_community_id(new.space_id);
begin
  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    m.user_id,
    v_community,
    'journey_report',
    'New report in ' || (select name from public.spaces where id = new.space_id),
    replace(new.reason, '_', ' ') || coalesce(': ' || left(new.details, 160), ''),
    public.journey_space_link(new.space_id) || '/manage?tab=reports',
    null -- reports are confidential: the reporter is not shown in the bell
  from public.community_memberships m
  where m.community_id = v_community
    and m.status = 'active'
    and m.role in ('owner', 'admin', 'moderator')
    and m.user_id <> new.reporter_id;
  return new;
end;
$$;

drop trigger if exists trg_notify_journey_report on public.journey_reports;
create trigger trg_notify_journey_report
  after insert on public.journey_reports
  for each row execute function public.notify_journey_report();
