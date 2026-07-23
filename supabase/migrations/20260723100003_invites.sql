-- =============================================================================
-- Relate — shareable community invite links
--
-- Run this in the Supabase SQL editor after supabase/schema.sql. Safe to
-- re-run.
--
-- Owners/admins generate a short code for their community. Anyone who visits
-- /invite/<code> while signed in is added as a member automatically — no
-- email sending involved. The invites table itself stays admin-only via RLS;
-- the actual preview/redemption logic runs through two SECURITY DEFINER
-- functions (get_invite_preview, redeem_invite) so a not-yet-a-member visitor
-- can validate and redeem a code without needing broader table access.
-- =============================================================================

create table if not exists public.community_invites (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  code text not null unique,
  role public.membership_role not null default 'member',
  max_uses integer,
  uses_count integer not null default 0,
  expires_at timestamptz,
  revoked boolean not null default false,
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint invite_role_check check (role in ('member', 'moderator')),
  constraint invite_max_uses_check check (max_uses is null or max_uses > 0)
);

create index if not exists idx_community_invites_community on public.community_invites (community_id);

alter table public.community_invites enable row level security;

drop policy if exists "invites_select_admin" on public.community_invites;
create policy "invites_select_admin" on public.community_invites
  for select to authenticated
  using (public.is_community_admin(community_id, auth.uid()));

drop policy if exists "invites_insert_admin" on public.community_invites;
create policy "invites_insert_admin" on public.community_invites
  for insert to authenticated
  with check (public.is_community_admin(community_id, auth.uid()) and created_by = auth.uid());

drop policy if exists "invites_update_admin" on public.community_invites;
create policy "invites_update_admin" on public.community_invites
  for update to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));

drop policy if exists "invites_delete_admin" on public.community_invites;
create policy "invites_delete_admin" on public.community_invites
  for delete to authenticated
  using (public.is_community_admin(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- Preview a code without redeeming it. Callable while logged out so an
-- /invite/<code> page can show "You're invited to X" before asking someone
-- to sign in or sign up.
-- -----------------------------------------------------------------------------
create or replace function public.get_invite_preview(p_code text)
returns table (community_name text, community_slug text, valid boolean, reason text)
language plpgsql
security definer
set search_path = public
as $$
declare
  inv record;
begin
  select ci.*, c.name as c_name, c.slug as c_slug
    into inv
  from public.community_invites ci
  join public.communities c on c.id = ci.community_id
  where ci.code = p_code;

  if not found then
    return query select null::text, null::text, false, 'This invite link is invalid.';
    return;
  end if;

  if inv.revoked then
    return query select inv.c_name, inv.c_slug, false, 'This invite link has been revoked.';
    return;
  end if;

  if inv.expires_at is not null and inv.expires_at < now() then
    return query select inv.c_name, inv.c_slug, false, 'This invite link has expired.';
    return;
  end if;

  if inv.max_uses is not null and inv.uses_count >= inv.max_uses then
    return query select inv.c_name, inv.c_slug, false, 'This invite link has reached its usage limit.';
    return;
  end if;

  return query select inv.c_name, inv.c_slug, true, null::text;
end;
$$;

grant execute on function public.get_invite_preview(text) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Redeem a code for the currently authenticated user. Adds (or reactivates)
-- a community_memberships row at the invite's role, then increments the
-- invite's use count.
-- -----------------------------------------------------------------------------
create or replace function public.redeem_invite(p_code text)
returns table (community_slug text, error text)
language plpgsql
security definer
set search_path = public
as $$
declare
  inv record;
  uid uuid := auth.uid();
  existing_status public.membership_status;
begin
  if uid is null then
    return query select null::text, 'You need to be signed in to accept an invite.';
    return;
  end if;

  select ci.*, c.slug as c_slug
    into inv
  from public.community_invites ci
  join public.communities c on c.id = ci.community_id
  where ci.code = p_code
  for update;

  if not found then
    return query select null::text, 'This invite link is invalid.';
    return;
  end if;

  if inv.revoked then
    return query select inv.c_slug, 'This invite link has been revoked.';
    return;
  end if;

  if inv.expires_at is not null and inv.expires_at < now() then
    return query select inv.c_slug, 'This invite link has expired.';
    return;
  end if;

  if inv.max_uses is not null and inv.uses_count >= inv.max_uses then
    return query select inv.c_slug, 'This invite link has reached its usage limit.';
    return;
  end if;

  select status into existing_status
  from public.community_memberships
  where user_id = uid and community_id = inv.community_id;

  if existing_status = 'banned' then
    return query select inv.c_slug, 'You have been banned from this community.';
    return;
  end if;

  insert into public.community_memberships (user_id, community_id, role, status)
  values (uid, inv.community_id, inv.role, 'active')
  on conflict (user_id, community_id) do update
    set status = 'active';

  update public.community_invites set uses_count = uses_count + 1 where id = inv.id;

  return query select inv.c_slug, null::text;
end;
$$;

grant execute on function public.redeem_invite(text) to authenticated;
