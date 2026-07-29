-- =============================================================================
-- Relate — Live Events notifications
--
-- One trigger on live_sessions fans out to members, mirroring notify_new_post:
--   * a session created with status 'scheduled'  -> 'live_event'   (all members)
--   * a session that becomes 'live' (inserted live, or scheduled -> live)
--                                                 -> 'live_started' (all members)
-- Both notify every active member who can view the space, except the host who
-- triggered it. Each notification is also emailed automatically (see
-- email_notification()), and streams into the bell in real time. Safe to re-run.
-- =============================================================================

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
  -- Newly live whether it was inserted straight as 'live' (ad-hoc "go live
  -- now") or transitioned from scheduled.
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
          then 'Starts ' || to_char(new.scheduled_start at time zone 'UTC', 'Mon DD, HH24:MI') || ' UTC'
        else null
      end,
      v_link,
      new.started_by
    from public.community_memberships m
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

drop trigger if exists trg_notify_live_session on public.live_sessions;
create trigger trg_notify_live_session
  after insert or update on public.live_sessions
  for each row execute function public.notify_live_session();
