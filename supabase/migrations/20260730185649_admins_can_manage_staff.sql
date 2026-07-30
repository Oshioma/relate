-- Per-community toggle: may non-owner admins manage other staff
-- (admins/moderators), or is that reserved to the owner?
--
-- Before this migration the membership RLS policies gated update/delete on
-- is_community_admin(), so ANY admin could change the role of, or remove, any
-- other admin or moderator (only the owner was shielded, and only by the
-- server action, not RLS). This adds an opt-in switch. Default false: admins
-- manage regular members only; the owner always manages everyone.

alter table public.communities
  add column if not exists admins_can_manage_staff boolean not null default false;

-- SECURITY DEFINER helpers so they can read the tables inside RLS without
-- tripping the memberships policies' own recursion (same rationale as the
-- existing is_community_* helpers). Owner is derived from communities.owner_id
-- to avoid reading community_memberships from within its own policy.
create or replace function public.is_community_owner(p_community_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.communities c
    where c.id = p_community_id
      and c.owner_id = p_user_id
  );
$$;

create or replace function public.community_allows_admin_staff_mgmt(p_community_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select admins_can_manage_staff from public.communities where id = p_community_id),
    false
  );
$$;

-- A non-owner admin may act on a membership row only when the target is a plain
-- member, or when the community has opted in to admin staff management. The
-- owner (is_community_owner) is always allowed; the owner as a *target* is never
-- reachable by an admin because the admin branch requires role <> 'owner'.
drop policy if exists "memberships_update_admin_or_self" on public.community_memberships;
create policy "memberships_update_admin_or_self" on public.community_memberships
  for update to authenticated
  using (
    user_id = auth.uid()
    or public.is_community_owner(community_id, auth.uid())
    or (
      public.is_community_admin(community_id, auth.uid())
      and role <> 'owner'
      and (role = 'member' or public.community_allows_admin_staff_mgmt(community_id))
    )
  )
  with check (
    (user_id = auth.uid() and role = 'member')
    or public.is_community_owner(community_id, auth.uid())
    or (
      public.is_community_admin(community_id, auth.uid())
      and role <> 'owner'
      and (role = 'member' or public.community_allows_admin_staff_mgmt(community_id))
    )
  );

drop policy if exists "memberships_delete_admin_or_self" on public.community_memberships;
create policy "memberships_delete_admin_or_self" on public.community_memberships
  for delete to authenticated
  using (
    user_id = auth.uid()
    or public.is_community_owner(community_id, auth.uid())
    or (
      public.is_community_admin(community_id, auth.uid())
      and role <> 'owner'
      and (role = 'member' or public.community_allows_admin_staff_mgmt(community_id))
    )
  );

-- The switch itself must be owner-only. RLS on communities (communities_update_admin)
-- lets any admin update the row, and Postgres RLS can't scope a policy to a
-- single column — so without this an admin could flip the toggle and grant
-- themselves staff management. A row trigger rejects a change to this one column
-- from anyone but the owner, regardless of entry point (server action, direct
-- API). Other columns are unaffected; service-role writes never touch it, so the
-- `is distinct from` guard leaves them alone.
create or replace function public.guard_admins_can_manage_staff()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.admins_can_manage_staff is distinct from old.admins_can_manage_staff
     and not public.is_community_owner(new.id, auth.uid()) then
    raise exception 'Only the community owner can change admins_can_manage_staff';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_admins_can_manage_staff on public.communities;
create trigger guard_admins_can_manage_staff
  before update on public.communities
  for each row execute function public.guard_admins_can_manage_staff();
