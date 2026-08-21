-- =============================================================================
-- Relate — plan grace period, and enforcement of the limits we advertise
--
-- Until now a lapsed plan reduced almost nothing. plan_status flipped to
-- 'canceled', community_has_feature() fell back to the free plan, and that
-- turned off exactly one thing: community_can_charge, which blocks *setting up*
-- new charging. A community that had already set it up kept charging existing
-- members AND kept signing up new paying ones, indefinitely. Meanwhile the free
-- plan's advertised caps ({"members": 200, "admins": 1}) were rendered on the
-- pricing page and enforced nowhere.
--
-- This adds the two halves that were missing:
--
-- 1. A GRACE PERIOD, so lapsing is never a cliff. A community keeps its paid
--    plan in full for `plan_grace_days` (default 30) after the period it paid
--    for ends — through a failed card and Stripe's dunning retries, through a
--    cancellation someone regrets. Only after that does it fall back to free.
--
-- 2. LIMIT ENFORCEMENT, at the one place every path into a community goes
--    through: a trigger on community_memberships. Nobody is ever removed and no
--    existing member loses anything — the cap only refuses to ADD past it.
--
-- The grace period deliberately covers everything, not just charging: for those
-- 30 days a lapsed community is indistinguishable from a paying one. That is
-- one rule to explain to an owner ("your plan keeps working for 30 days"), and
-- it means a failed payment never breaks a live community mid-month.
-- =============================================================================

-- --- Grace period ------------------------------------------------------------
-- Operator-tunable without a deploy. app_config has RLS on and no policies, so
-- it is service-role/definer-only to read and write.
insert into public.app_config (key, value) values ('plan_grace_days', '30')
on conflict (key) do nothing;

create or replace function public.plan_grace_days()
returns integer
language sql
security definer
stable
set search_path = public
as $$
  -- Anything non-numeric in app_config falls back to the default rather than
  -- erroring inside the gates below, which would take the whole app down.
  select coalesce(
    (
      select case when c.value ~ '^[0-9]+$' then c.value::integer else null end
      from public.app_config c
      where c.key = 'plan_grace_days'
    ),
    30
  );
$$;

-- --- Effective plan ----------------------------------------------------------
-- The single resolver everything else reads: which plan is this community
-- actually on right now?
--
--   * its paid plan while the subscription is live (active/trialing) and the
--     paid-for period hasn't ended;
--   * still its paid plan for plan_grace_days() after that period ended,
--     whatever the subscription's state — the grace window;
--   * otherwise the seeded 'free' plan.
--
-- plan_current_period_end is the anchor for grace, so a plan row with no period
-- end (never seen a Stripe subscription event) can't sit in grace forever.
create or replace function public.community_effective_plan_id(p_community_id uuid)
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (
      select c.plan_id
      from public.communities c
      where c.id = p_community_id
        and c.plan_id is not null
        and (
          (
            c.plan_status in ('active', 'trialing')
            and (c.plan_current_period_end is null or c.plan_current_period_end > now())
          )
          or (
            c.plan_current_period_end is not null
            and c.plan_current_period_end + make_interval(days => public.plan_grace_days()) > now()
          )
        )
    ),
    (select p.id from public.platform_plans p where p.slug = 'free')
  );
$$;

-- When the grace window runs out, for the banner that tells an owner what is
-- about to switch off. Null when there is nothing to count down: no paid plan,
-- or one that is simply live and paid up.
create or replace function public.community_plan_grace_until(p_community_id uuid)
returns timestamptz
language sql
security definer
stable
set search_path = public
as $$
  select c.plan_current_period_end + make_interval(days => public.plan_grace_days())
  from public.communities c
  where c.id = p_community_id
    and c.plan_id is not null
    and c.plan_current_period_end is not null
    and c.plan_status not in ('active', 'trialing');
$$;

-- --- Feature gate ------------------------------------------------------------
-- Same contract as before — callers don't change — but resolved through the
-- effective plan above, so the grace window grants features too.
create or replace function public.community_has_feature(p_community_id uuid, p_feature text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (
      select p_feature = any(p.features)
      from public.platform_plans p
      where p.id = public.community_effective_plan_id(p_community_id)
    ),
    false
  );
$$;

-- --- Numeric caps ------------------------------------------------------------
-- A plan's cap for a key (e.g. 'members', 'admins'), or NULL for unlimited —
-- an absent key has always meant unlimited, and paid plans set none.
create or replace function public.community_plan_limit(p_community_id uuid, p_key text)
returns integer
language sql
security definer
stable
set search_path = public
as $$
  select case
           when (p.limits ->> p_key) ~ '^[0-9]+$' then (p.limits ->> p_key)::integer
           else null
         end
  from public.platform_plans p
  where p.id = public.community_effective_plan_id(p_community_id);
$$;

grant execute on function public.community_plan_limit(uuid, text) to authenticated;
grant execute on function public.community_plan_grace_until(uuid) to authenticated;

-- --- Enforcement -------------------------------------------------------------
-- Every route into a community ends in a community_memberships row: the join
-- button, redeem_invite(), an admin adding someone, the owner membership
-- created with the community itself. Enforcing here rather than in each of
-- those means none of them can be forgotten.
--
-- Only ever refuses to ADD past a cap. Existing members and staff are never
-- touched, so a community that lapses (or that was over the cap before this
-- existed) keeps everyone it has — it just can't grow until it upgrades.
--
-- 'members' counts active memberships; 'admins' counts active owner+admin
-- seats, which is what "1 admin" on the free plan means: the owner, and nobody
-- else with the keys. Moderators are not admins and don't count.
create or replace function public.enforce_community_plan_limits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limit integer;
  v_count integer;
  v_adds_member boolean;
  v_adds_staff boolean;
  v_was_staff boolean;
begin
  -- A platform operator is the escape hatch for anything the caps get wrong.
  if public.is_super_admin(auth.uid()) then
    return new;
  end if;

  v_adds_member := new.status = 'active' and (tg_op = 'INSERT' or old.status is distinct from 'active');

  v_was_staff := tg_op = 'UPDATE' and old.status = 'active' and old.role in ('owner', 'admin');
  v_adds_staff := new.status = 'active' and new.role in ('owner', 'admin') and not v_was_staff;

  if v_adds_member then
    v_limit := public.community_plan_limit(new.community_id, 'members');
    if v_limit is not null then
      select count(*) into v_count
      from public.community_memberships m
      where m.community_id = new.community_id
        and m.status = 'active'
        and (tg_op = 'INSERT' or m.id <> new.id);

      if v_count >= v_limit then
        raise exception 'plan_limit: this community has reached its plan''s limit of % members. Its owner can upgrade the plan to add more.', v_limit
          using errcode = 'P0001';
      end if;
    end if;
  end if;

  if v_adds_staff then
    v_limit := public.community_plan_limit(new.community_id, 'admins');
    if v_limit is not null then
      select count(*) into v_count
      from public.community_memberships m
      where m.community_id = new.community_id
        and m.status = 'active'
        and m.role in ('owner', 'admin')
        and (tg_op = 'INSERT' or m.id <> new.id);

      if v_count >= v_limit then
        raise exception 'plan_limit: this community''s plan includes % admin(s). Upgrade the plan to add another, or use the Moderator role instead.', v_limit
          using errcode = 'P0001';
      end if;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_plan_limits on public.community_memberships;
create trigger enforce_plan_limits
  before insert or update on public.community_memberships
  for each row execute function public.enforce_community_plan_limits();
