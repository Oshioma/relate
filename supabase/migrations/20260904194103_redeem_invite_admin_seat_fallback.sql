-- =============================================================================
-- Relate — an invite must never dead-end on the inviter's plan
--
-- Invites have been able to carry role = 'admin' since
-- 20260723100019_invite_admin_role.sql, and redeem_invite inserts that role
-- straight into community_memberships. Since
-- 20260821142228_plan_grace_and_limit_enforcement.sql, a trigger refuses an
-- owner/admin seat past the plan's cap — and the free plan allows exactly one,
-- which the owner already occupies.
--
-- Those two are fine apart and broken together: clicking an admin invite link
-- RAISES out of redeem_invite, so the whole redemption aborts and the person is
-- shown "this community's plan includes 1 admin(s). Upgrade the plan…" while
-- signing up. They did nothing wrong, they cannot upgrade anyone's plan, and
-- there is nothing on that page for them to do. They just can't get in.
--
-- So redemption now admits them at the best role the plan actually allows
-- instead of refusing entry: an admin invite with no admin seat free lands them
-- as a moderator, which is what the cap's own error message recommends
-- ("or use the Moderator role instead") and which the plan does not limit.
-- Moderator is strictly less than the admin they were offered, so this only
-- ever grants less than the inviter intended — never more. Community staff can
-- promote them properly once the plan has room, and that attempt fails in front
-- of the owner, who can actually act on it.
--
-- The downgrade is skipped for a platform super admin, who the cap trigger
-- already exempts: downgrading them here would silently take away a seat the
-- trigger was about to allow.
--
-- The member cap is deliberately still a hard stop: a community with no seats
-- left has no lesser role to offer, and that refusal already renders as a
-- sentence rather than a raw error (see src/app/invite/[code]/page.tsx).
--
-- Safe to re-run.
-- =============================================================================

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
  v_role public.membership_role;
  v_admin_limit integer;
  v_admin_count integer;
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

  -- Downgrade rather than refuse, but ONLY where the trigger would actually
  -- have refused — otherwise this quietly takes away a role the cap would have
  -- allowed. Mirrors enforce_community_plan_limits exactly: the platform
  -- operator's bypass first, then the 'admins' cap, which owner and admin share
  -- and moderators don't count toward. A null cap means unlimited.
  v_role := inv.role;

  if v_role = 'admin' and not public.is_super_admin(uid) then
    v_admin_limit := public.community_plan_limit(inv.community_id, 'admins');

    if v_admin_limit is not null then
      select count(*) into v_admin_count
      from public.community_memberships m
      where m.community_id = inv.community_id
        and m.status = 'active'
        and m.role in ('owner', 'admin');

      if v_admin_count >= v_admin_limit then
        v_role := 'moderator';
      end if;
    end if;
  end if;

  insert into public.community_memberships (user_id, community_id, role, status)
  values (uid, inv.community_id, v_role, 'active')
  on conflict (user_id, community_id) do update
    set status = 'active';

  update public.community_invites set uses_count = uses_count + 1 where id = inv.id;

  return query select inv.c_slug, null::text;
end;
$$;

grant execute on function public.redeem_invite(text) to authenticated;
