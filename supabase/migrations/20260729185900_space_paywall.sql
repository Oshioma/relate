-- =============================================================================
-- Relate — Per-space paywalls (Stripe Connect Express)
--
-- Lets a community owner charge members a recurring monthly fee for access to
-- an individual space. The owner connects their own Stripe account (Connect
-- Express); members subscribe with a Stripe Checkout subscription; the webhook
-- (src/app/api/stripe/webhook/route.ts) records the subscription here and this
-- migration's RLS gates the space's content on it.
--
-- Money model: the owner is the merchant of record and keeps 100% of the
-- charge (no platform application fee). The platform monetises separately by
-- charging owners for a paid tier — a later change, not this one.
--
-- Safe to re-run.
-- =============================================================================

-- --- Connect account, per community -----------------------------------------
-- The owner's connected Stripe account. `stripe_charges_enabled` mirrors the
-- account's charges_enabled flag (set by our onboarding refresh and the
-- account.updated webhook) — a space can only take money once it's true.
-- Only ever written from server-side code that has verified the caller is a
-- community admin (see admin/billing-actions.ts) or from the service-role
-- webhook handler.
alter table public.communities
  add column if not exists stripe_account_id text,
  add column if not exists stripe_charges_enabled boolean not null default false;

-- --- Price, per space --------------------------------------------------------
-- price_cents = 0 means the space is free (unchanged behaviour). > 0 makes it a
-- paid space: members need an active subscription to see its content. currency
-- is an ISO-4217 lowercase code, matching the existing courses table.
alter table public.spaces
  add column if not exists price_cents integer not null default 0,
  add column if not exists currency text not null default 'usd';

alter table public.spaces
  drop constraint if exists spaces_price_cents_nonneg;
alter table public.spaces
  add constraint spaces_price_cents_nonneg check (price_cents >= 0);

-- --- Subscriptions -----------------------------------------------------------
-- One row per (space, member). Written only by the service-role webhook
-- handler — never by members directly — so the source of truth is Stripe, not
-- a value the browser can set. `status` mirrors the Stripe subscription status.
create table if not exists public.space_subscriptions (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  -- active | trialing | past_due | canceled | incomplete | incomplete_expired | unpaid
  status text not null default 'incomplete',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (space_id, user_id)
);

create index if not exists space_subscriptions_user_idx on public.space_subscriptions(user_id);
create index if not exists space_subscriptions_space_idx on public.space_subscriptions(space_id);
create index if not exists space_subscriptions_community_idx on public.space_subscriptions(community_id);

-- --- Access helpers ----------------------------------------------------------
-- Does this user hold a paid-up subscription to this space? "Paid up" = the
-- Stripe status is one that grants access AND the paid period hasn't lapsed
-- (a null period_end is treated as still-valid, e.g. a brand-new active sub
-- the period-end webhook hasn't populated yet).
create or replace function public.has_active_space_subscription(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.space_subscriptions s
    where s.space_id = p_space_id
      and s.user_id = p_user_id
      and s.status in ('active', 'trialing')
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;

-- The content gate. Mirrors can_view_space for free spaces (no behaviour
-- change), but a paid space (price_cents > 0) additionally requires an active
-- subscription — staff always pass so owners/admins/mods can manage the space
-- without paying themselves.
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
    when s.price_cents > 0 then public.has_active_space_subscription(p_space_id, p_user_id)
    else public.can_view_space(p_space_id, p_user_id)
  end
  -- left join guarantees exactly one row even when the space id doesn't exist,
  -- so `s.id is null` is reachable rather than collapsing to zero rows.
  from (select 1) _
  left join (select id, community_id, price_cents from public.spaces where id = p_space_id) s on true;
$$;

-- --- Repoint content RLS onto the paywall-aware gate -------------------------
-- Free spaces are unaffected (has_space_access == can_view_space for them).
-- Only posts/comments/resources are space-scoped content in the base schema;
-- events are community-scoped (no space_id) so they stay as they were. Space
-- types with their own content tables are additionally gated in the UI (the
-- space page renders the paywall before fetching anything) — see page.tsx.

drop policy if exists "posts_select" on public.posts;
create policy "posts_select" on public.posts
  for select to authenticated
  using (public.has_space_access(space_id, auth.uid()));

drop policy if exists "posts_insert_member" on public.posts;
create policy "posts_insert_member" on public.posts
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.has_space_access(space_id, auth.uid())
  );

drop policy if exists "comments_select" on public.comments;
create policy "comments_select" on public.comments
  for select to authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and public.has_space_access(p.space_id, auth.uid())
    )
  );

drop policy if exists "comments_insert_member" on public.comments;
create policy "comments_insert_member" on public.comments
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.posts p
      where p.id = post_id
        and public.is_community_member(p.community_id, auth.uid())
        and public.has_space_access(p.space_id, auth.uid())
    )
  );

drop policy if exists "resources_select" on public.resources;
create policy "resources_select" on public.resources
  for select to authenticated
  using (public.has_space_access(space_id, auth.uid()));

-- --- space_subscriptions RLS -------------------------------------------------
alter table public.space_subscriptions enable row level security;

-- A member can see their own subscriptions; staff can see all of their
-- community's (to view who has access). No insert/update/delete policies exist,
-- so only the service-role webhook handler (which bypasses RLS) writes rows.
drop policy if exists "space_subscriptions_select" on public.space_subscriptions;
create policy "space_subscriptions_select" on public.space_subscriptions
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_community_staff(community_id, auth.uid())
  );
