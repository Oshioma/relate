-- =============================================================================
-- Relate — "<name> joined" takes you to the person, not the list
--
-- The notification names a specific person, so tapping it should introduce
-- them. It went to /members instead: the whole directory, with the new arrival
-- somewhere in it, which is work rather than a welcome. Their profile is where
-- everything a host would want — who they are, what they do, a way to say
-- hello — already is.
--
-- Nothing else changes: same trigger, same recipients, same title.
--
-- Safe to re-run.
-- =============================================================================

create or replace function public.notify_staff_new_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_community_name text;
  v_community_slug text;
  v_actor_name text;
  v_actor_username text;
begin
  if new.status != 'active' then
    return new;
  end if;

  select name, slug into v_community_name, v_community_slug
  from public.communities where id = new.community_id;

  select coalesce(full_name, username), username
    into v_actor_name, v_actor_username
  from public.profiles where id = new.user_id;

  insert into public.notifications (user_id, community_id, type, title, link, actor_id)
  select
    m.user_id,
    new.community_id,
    'membership',
    coalesce(v_actor_name, 'A new member') || ' joined ' || v_community_name,
    -- The member's own page, falling back to the directory if their profile
    -- row somehow isn't there yet (the link must always go somewhere).
    case
      when v_actor_username is not null
        then '/c/' || v_community_slug || '/members/' || v_actor_username
      else '/c/' || v_community_slug || '/members'
    end,
    new.user_id
  from public.community_memberships m
  where m.community_id = new.community_id
    and m.status = 'active'
    and m.role in ('owner', 'admin', 'moderator')
    and m.user_id != new.user_id;

  return new;
end;
$$;

drop trigger if exists trg_notify_staff_new_member on public.community_memberships;
create trigger trg_notify_staff_new_member
  after insert on public.community_memberships
  for each row execute function public.notify_staff_new_member();

-- The ones already sitting in people's bells. Only the staff "joined" variant
-- carries an actor and points at a bare /members path — the "You joined X"
-- notification links to the community itself, so it can't be caught here.
update public.notifications n
set link = n.link || '/' || p.username
from public.profiles p
where p.id = n.actor_id
  and n.type = 'membership'
  and n.link like '/c/%/members';
