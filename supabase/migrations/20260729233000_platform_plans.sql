-- =============================================================================
-- Relate — Platform paid tiers (the platform charges community owners)
--
-- Distinct from the per-space paywall (where an OWNER charges their MEMBERS via
-- Stripe Connect). Here the PLATFORM charges the OWNER a recurring fee via
-- Stripe Billing on the platform's own Stripe account. Being on an active paid
-- plan is what unlocks the ability to charge members at all.
--
--   platform_plans          — the tiers, defined by the super admin. Each has a
--                             Stripe recurring Price id and an
--                             allows_member_charging flag.
--   communities.plan_*       — which plan a community is on and its Stripe
--                             subscription state (written only by the webhook).
--   community_can_charge()   — true when the community's plan is live and allows
--                             charging; gates enabling paid spaces / Connect.
--
-- Soft downgrade: when a plan lapses, community_can_charge() flips false, which
-- blocks NEWLY enabling charging — but existing paid spaces and their member
-- subscriptions (Connect, on the owner's own account) keep running untouched.
--
-- Safe to re-run.
-- =============================================================================

-- --- Tiers -------------------------------------------------------------------
create table if not exists public.platform_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price_cents integer not null default 0,
  currency text not null default 'usd',
  -- The Stripe recurring Price id (price_…). Null until the operator creates the
  -- Price in their Stripe dashboard and pastes it in; a plan without one can't
  -- be checked out.
  stripe_price_id text,
  -- The premium capabilities this plan unlocks, as feature keys (e.g.
  -- 'paid_memberships', 'white_label', 'api', 'automation'). Being on a plan
  -- grants everything in this array — the single source of truth for gating, so
  -- a new premium feature is just a new key, no schema change. The feature
  -- marketplace (a later layer) grants the same keys à la carte.
  features text[] not null default '{}',
  -- Numeric caps for tiers that limit rather than gate (e.g. {"members":200,
  -- "admins":1}). Absent key = unlimited. Stored/displayed now; enforcement at
  -- the join/role chokepoints is a fast-follow.
  limits jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint platform_plans_price_nonneg check (price_cents >= 0)
);

drop trigger if exists set_updated_at on public.platform_plans;
create trigger set_updated_at before update on public.platform_plans
  for each row execute function public.set_updated_at();

alter table public.platform_plans enable row level security;

-- Anyone signed in can read active plans (to see pricing / pick one). The super
-- admin manages them; everyone else is read-only.
drop policy if exists "platform_plans_select" on public.platform_plans;
create policy "platform_plans_select" on public.platform_plans
  for select to authenticated
  using (is_active or public.is_super_admin(auth.uid()));

drop policy if exists "platform_plans_manage_super_admin" on public.platform_plans;
create policy "platform_plans_manage_super_admin" on public.platform_plans
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- --- Community plan state ----------------------------------------------------
alter table public.communities
  add column if not exists plan_id uuid references public.platform_plans(id),
  add column if not exists plan_status text not null default 'none',
  add column if not exists plan_current_period_end timestamptz,
  add column if not exists plan_stripe_customer_id text,
  add column if not exists plan_stripe_subscription_id text;

create unique index if not exists communities_plan_subscription_key
  on public.communities (plan_stripe_subscription_id)
  where plan_stripe_subscription_id is not null;

-- Block direct API writes to the plan columns — they're the source of truth for
-- "is this community paid", so only the service-role webhook may set them.
-- Mirrors protect_custom_domain_columns (see 20260723100010_custom_domains.sql):
-- anon/authenticated are blocked, service-role and direct SQL pass through.
create or replace function public.protect_community_plan_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      if new.plan_id is not null
        or new.plan_status is distinct from 'none'
        or new.plan_current_period_end is not null
        or new.plan_stripe_customer_id is not null
        or new.plan_stripe_subscription_id is not null
      then
        raise exception 'plan/billing state can only be changed through checkout';
      end if;
    elsif new.plan_id is distinct from old.plan_id
      or new.plan_status is distinct from old.plan_status
      or new.plan_current_period_end is distinct from old.plan_current_period_end
      or new.plan_stripe_customer_id is distinct from old.plan_stripe_customer_id
      or new.plan_stripe_subscription_id is distinct from old.plan_stripe_subscription_id
    then
      raise exception 'plan/billing state can only be changed through checkout';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists communities_protect_plan on public.communities;
create trigger communities_protect_plan
  before insert or update on public.communities
  for each row
  execute function public.protect_community_plan_columns();

-- --- Entitlement resolver ----------------------------------------------------
-- The one gate everything checks: does this community have a given premium
-- feature? A community's effective plan is its live paid plan (active/trialing,
-- not lapsed) if it has one, otherwise the seeded 'free' plan. The feature is
-- granted when it's in that plan's `features`. (When the marketplace lands,
-- this is where à-la-carte grants get unioned in — callers won't change.)
create or replace function public.community_has_feature(p_community_id uuid, p_feature text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (
      select p_feature = any(
        case
          when c.plan_id is not null
            and c.plan_status in ('active', 'trialing')
            and (c.plan_current_period_end is null or c.plan_current_period_end > now())
          then paid.features
          else coalesce(free.features, '{}')
        end
      )
      from public.communities c
      left join public.platform_plans paid on paid.id = c.plan_id
      left join public.platform_plans free on free.slug = 'free'
      where c.id = p_community_id
    ),
    false
  );
$$;

-- Convenience gate for the per-space paywall: a community can charge members
-- only when its plan includes the 'paid_memberships' feature. Soft downgrade
-- falls out for free: the flag flips false, blocking NEW charging while
-- existing paid spaces / member subscriptions keep running.
create or replace function public.community_can_charge(p_community_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.community_has_feature(p_community_id, 'paid_memberships');
$$;

-- --- Seed tiers --------------------------------------------------------------
-- Prices in GBP. 'free' is a real row so the resolver can fall back to it for
-- communities with no active paid plan (it grants no premium features and caps
-- members/admins). Paid tiers gate premium FEATURES, not member count — free
-- communities can grow before they feel limited. The operator sets each paid
-- plan's stripe_price_id in the platform-admin Plans section before owners can
-- subscribe; the free plan needs none. Enterprise is intentionally left for the
-- operator to add (custom pricing).
insert into public.platform_plans (slug, name, description, price_cents, currency, features, limits, sort_order) values
  (
    'free', 'Free', 'For testing and getting started.',
    0, 'gbp',
    '{}',
    '{"members": 200, "admins": 1}'::jsonb,
    0
  ),
  (
    'starter', 'Starter', 'For small creators ready to charge.',
    2500, 'gbp',
    '{paid_memberships,unlimited_members}',
    '{}'::jsonb,
    1
  ),
  (
    'growth', 'Growth', 'For businesses and paid communities.',
    4900, 'gbp',
    '{paid_memberships,unlimited_members,automation}',
    '{}'::jsonb,
    2
  ),
  (
    'pro', 'Pro', 'For large organisations.',
    19900, 'gbp',
    '{paid_memberships,unlimited_members,automation,white_label,api,advanced_permissions,multiple_communities,multiple_admins}',
    '{}'::jsonb,
    3
  )
on conflict (slug) do nothing;
