-- =============================================================================
-- Relate — a community's owner always has their seat
--
-- Every staff check in the app and in RLS goes through is_community_member /
-- is_community_staff / is_community_admin, and all three ask exactly one
-- question: does this person have an *active membership row* with the right
-- role? communities.owner_id is never consulted. handle_new_community writes
-- that row for the founder, so normally the two agree — but they are separate
-- facts, and when they drift the owner is locked out of their own community:
-- /c/<slug>/admin redirects them away (it reads the membership role), the shell
-- shows them the "you're viewing this as a guest" banner, and for a private
-- community the feed is replaced by the members-only gate. Nothing in the UI
-- offers a way back, because every door is guarded by the row that's missing.
--
-- Two changes, both narrowing to the same single row per community:
--
--   1. The three helpers now also answer yes for communities.owner_id. This is
--      the same reasoning as community_owner_seat_never_refused: the owner is
--      not a member of the community, they *are* the community, and owner_id is
--      a single column so at most one person per community can match. It grants
--      nothing to anyone who didn't already own the row.
--   2. A backfill that repairs (or creates) the owner's membership everywhere,
--      so the data agrees with the helpers rather than merely being papered
--      over by them.
--
-- Safe to re-run.
-- =============================================================================

create or replace function public.is_community_member(p_community_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.community_memberships m
    where m.community_id = p_community_id
      and m.user_id = p_user_id
      and m.status = 'active'
  ) or exists (
    select 1 from public.communities c
    where c.id = p_community_id
      and c.owner_id = p_user_id
  );
$$;

create or replace function public.is_community_staff(p_community_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.community_memberships m
    where m.community_id = p_community_id
      and m.user_id = p_user_id
      and m.status = 'active'
      and m.role in ('owner', 'admin', 'moderator')
  ) or exists (
    select 1 from public.communities c
    where c.id = p_community_id
      and c.owner_id = p_user_id
  );
$$;

create or replace function public.is_community_admin(p_community_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.community_memberships m
    where m.community_id = p_community_id
      and m.user_id = p_user_id
      and m.status = 'active'
      and m.role in ('owner', 'admin')
  ) or exists (
    select 1 from public.communities c
    where c.id = p_community_id
      and c.owner_id = p_user_id
  );
$$;

-- Repair the data itself. Any community whose owner has no row gets one; any
-- whose owner has a row that says something other than an active owner is put
-- back. The `where` on the conflict branch keeps this to genuinely-wrong rows,
-- so a re-run touches nothing and the updated_at/created_at of healthy rows is
-- left alone.
insert into public.community_memberships (user_id, community_id, role, status)
select c.owner_id, c.id, 'owner', 'active'
from public.communities c
where c.owner_id is not null
on conflict (user_id, community_id) do update
  set role = 'owner', status = 'active'
  where community_memberships.role is distinct from 'owner'
     or community_memberships.status is distinct from 'active';
