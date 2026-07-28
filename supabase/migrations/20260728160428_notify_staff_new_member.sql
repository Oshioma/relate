-- =============================================================================
-- Relate — notify staff when a new member joins
--
-- notify_membership_added (in 20260723100004_notifications.sql) already tells
-- the person who joined ("You joined X"). This adds the mirror image: the
-- community's staff (owner/admin/moderator) are told a new member arrived —
-- matching how the farm app notifies its managers on a new member. Reuses the
-- existing 'membership' notification type. The new member is excluded, so
-- creating a community (owner adds themselves, and there are no other staff yet)
-- notifies no one. Safe to re-run.
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
begin
  if new.status != 'active' then
    return new;
  end if;

  select name, slug into v_community_name, v_community_slug
  from public.communities where id = new.community_id;

  select coalesce(full_name, username) into v_actor_name
  from public.profiles where id = new.user_id;

  insert into public.notifications (user_id, community_id, type, title, link, actor_id)
  select
    m.user_id,
    new.community_id,
    'membership',
    coalesce(v_actor_name, 'A new member') || ' joined ' || v_community_name,
    '/c/' || v_community_slug || '/members',
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
