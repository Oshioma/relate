-- =============================================================================
-- Relate — Community membership tiers (Phase 1: schema + access)
--
-- A tier is a named, recurring-priced membership that unlocks a SET of spaces
-- (via tier_spaces), rather than the existing per-space price which unlocks one.
-- Both coexist: a space is accessible if the member holds an active per-space
-- subscription OR an active subscription to any tier that includes the space.
--
-- Money flows exactly like the per-space paywall: the community's connected
-- Stripe account (Connect Express) is the merchant; tier_subscriptions are
-- written only by the service-role webhook. This migration is schema + access
-- only — checkout, webhook and UI come in later phases.
--
-- Access model: has_space_access() (defined in 20260729220747) is extended so a
-- space counts as "gated" when it has a per-space price OR belongs to any tier;
-- a gated space is opened by staff, an active per-space sub, or an active tier
-- sub covering it. Everything routes through can_view_space -> has_space_access,
-- so every space type becomes tier-aware with no per-policy churn.
--
-- Safe to re-run.
-- =============================================================================

-- --- Tiers -------------------------------------------------------------------
create table if not exists public.community_tiers (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  name text not null,
  description text,
  price_cents integer not null default 0,
  currency text not null default 'usd',
  sort_order integer not null default 0,
  -- Archived tiers stop accepting new subscribers but keep granting access to
  -- anyone already subscribed (the row and its tier_spaces stay live).
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  constraint community_tiers_price_cents_nonneg check (price_cents >= 0)
);

create index if not exists community_tiers_community_idx on public.community_tiers(community_id);

-- --- Which spaces a tier unlocks (M:N) ---------------------------------------
create table if not exists public.tier_spaces (
  tier_id uuid not null references public.community_tiers(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tier_id, space_id)
);

create index if not exists tier_spaces_space_idx on public.tier_spaces(space_id);
create index if not exists tier_spaces_tier_idx on public.tier_spaces(tier_id);

-- --- Tier subscriptions (mirrors space_subscriptions) ------------------------
-- One row per (tier, member). Written only by the service-role webhook — the
-- source of truth is Stripe, never a value the browser can set. community_id is
-- denormalised (like space_subscriptions) for RLS and indexing.
create table if not exists public.tier_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tier_id uuid not null references public.community_tiers(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  -- active | trialing | past_due | canceled | incomplete | incomplete_expired | unpaid
  status text not null default 'incomplete',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tier_id, user_id)
);

create index if not exists tier_subscriptions_user_idx on public.tier_subscriptions(user_id);
create index if not exists tier_subscriptions_tier_idx on public.tier_subscriptions(tier_id);
create index if not exists tier_subscriptions_community_idx on public.tier_subscriptions(community_id);

-- --- Access helpers ----------------------------------------------------------
-- Does the user hold a paid-up subscription to a tier that includes this space?
-- "Paid up" mirrors has_active_space_subscription: an access-granting Stripe
-- status and an unlapsed period (null period_end treated as still-valid).
create or replace function public.has_active_tier_for_space(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.tier_subscriptions sub
    join public.tier_spaces ts on ts.tier_id = sub.tier_id
    where ts.space_id = p_space_id
      and sub.user_id = p_user_id
      and sub.status in ('active', 'trialing')
      and (sub.current_period_end is null or sub.current_period_end > now())
  );
$$;

-- Extend the content gate: a space is "gated" when it has a per-space price OR
-- belongs to at least one tier. A gated space is opened by staff, an active
-- per-space subscription, or an active tier subscription that covers it. Free,
-- untiered spaces are unchanged (they fall through to can_see_space_shell).
-- Keeps the can_view_space -> has_space_access -> can_see_space_shell chain from
-- 20260729220747 intact (no recursion): the else branch still calls
-- can_see_space_shell, and the new helpers touch neither.
create or replace function public.has_space_access(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select case
    when s.id is null then false
    when public.is_community_staff(s.community_id, p_user_id) then true
    -- A public space is always open (mirrors spaces_public_is_free for the price
    -- path, and stops a public space that was added to a tier from being locked).
    when s.visibility <> 'public'
      and (s.price_cents > 0 or exists (select 1 from public.tier_spaces ts where ts.space_id = p_space_id)) then
      public.has_active_space_subscription(p_space_id, p_user_id)
        or public.has_active_tier_for_space(p_space_id, p_user_id)
    else public.can_see_space_shell(p_space_id, p_user_id)
  end
  -- left join guarantees exactly one row even when the space id doesn't exist,
  -- so `s.id is null` is reachable rather than collapsing to zero rows.
  from (select 1) _
  left join (select id, community_id, price_cents, visibility from public.spaces where id = p_space_id) s on true;
$$;

-- --- RLS ---------------------------------------------------------------------
alter table public.community_tiers enable row level security;
alter table public.tier_spaces enable row level security;
alter table public.tier_subscriptions enable row level security;

-- Tiers: any member of the community can read them (to see join options);
-- owners/admins manage them.
drop policy if exists "community_tiers_select" on public.community_tiers;
create policy "community_tiers_select" on public.community_tiers
  for select to authenticated
  using (public.is_community_member(community_id, auth.uid()));

drop policy if exists "community_tiers_write_admin" on public.community_tiers;
create policy "community_tiers_write_admin" on public.community_tiers
  for all to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));

-- Tier ↔ space links: readable by community members (to show what a tier
-- unlocks); writable by owners/admins. Community is reached through the tier.
drop policy if exists "tier_spaces_select" on public.tier_spaces;
create policy "tier_spaces_select" on public.tier_spaces
  for select to authenticated
  using (
    exists (
      select 1 from public.community_tiers t
      where t.id = tier_id and public.is_community_member(t.community_id, auth.uid())
    )
  );

drop policy if exists "tier_spaces_write_admin" on public.tier_spaces;
create policy "tier_spaces_write_admin" on public.tier_spaces
  for all to authenticated
  using (
    exists (
      select 1 from public.community_tiers t
      where t.id = tier_id and public.is_community_admin(t.community_id, auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.community_tiers t
      where t.id = tier_id and public.is_community_admin(t.community_id, auth.uid())
    )
  );

-- Tier subscriptions: a member sees their own; staff see all of their
-- community's. No insert/update/delete policies — only the service-role webhook
-- writes rows.
drop policy if exists "tier_subscriptions_select" on public.tier_subscriptions;
create policy "tier_subscriptions_select" on public.tier_subscriptions
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_community_staff(community_id, auth.uid())
  );
