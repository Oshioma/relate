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
  -- The only capability gated for now: whether being on this plan lets the
  -- owner charge members for spaces. Future limits/perks can be added as
  -- columns here without touching callers.
  allows_member_charging boolean not null default true,
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

-- --- Capability gate ---------------------------------------------------------
-- True when the community is on a live paid plan that permits member charging.
-- A null period_end is treated as still-valid (a fresh active sub before the
-- period-end webhook lands).
create or replace function public.community_can_charge(p_community_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.communities c
    join public.platform_plans p on p.id = c.plan_id
    where c.id = p_community_id
      and p.allows_member_charging
      and c.plan_status in ('active', 'trialing')
      and (c.plan_current_period_end is null or c.plan_current_period_end > now())
  );
$$;

-- --- Seed starter tiers ------------------------------------------------------
-- Two example paid tiers; "no plan" is the implicit free tier (can't charge).
-- The operator sets each plan's stripe_price_id (and tunes price/name) in the
-- platform-admin Plans section before owners can subscribe.
insert into public.platform_plans (slug, name, description, price_cents, currency, allows_member_charging, sort_order)
values
  ('pro',   'Pro',   'Charge members for spaces. For growing communities.', 2900, 'usd', true, 1),
  ('scale', 'Scale', 'Everything in Pro, for larger communities.',          9900, 'usd', true, 2)
on conflict (slug) do nothing;
