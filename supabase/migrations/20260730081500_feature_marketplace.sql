-- =============================================================================
-- Relate — Feature Marketplace (Layer 2): packs unlock space types
--
-- A platform-owned, curated catalogue of feature packs. Each pack maps to one
-- or more space types (Course Builder → 'course', Local Jobs → 'jobs', …).
-- Installing a free pack, or subscribing to a paid one, unlocks those space
-- types for the community — they get OR-ed into the space-type pool that gates
-- the "add a space" picker.
--
--   feature_packs             — the catalogue, defined by the super admin.
--   community_feature_addons  — which packs a community has installed/bought
--                               (paid rows written only by the Stripe webhook).
--   community_purchased_space_types() — the space types a community's ACTIVE
--                               packs grant; unioned into the pool resolver.
--
-- Making a pack meaningful is a super-admin choice: turn a space type OFF in the
-- platform default pool, then sell a pack that grants it. Until a type's default
-- is disabled it's already available to everyone, so a pack for it is a no-op —
-- this migration doesn't disable any defaults (that would remove a type from
-- existing communities) and leaves that decision to the operator.
--
-- Safe to re-run.
-- =============================================================================

-- --- Catalogue ---------------------------------------------------------------
create table if not exists public.feature_packs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price_cents integer not null default 0,
  currency text not null default 'gbp',
  -- The Stripe recurring Price id (null for a free pack, or a paid pack the
  -- operator hasn't wired up yet — such a paid pack can't be checked out).
  stripe_price_id text,
  -- The space type keys this pack unlocks (stored as text so the catalogue
  -- isn't coupled to the space_type enum).
  space_types text[] not null default '{}',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feature_packs_price_nonneg check (price_cents >= 0)
);

drop trigger if exists set_updated_at on public.feature_packs;
create trigger set_updated_at before update on public.feature_packs
  for each row execute function public.set_updated_at();

alter table public.feature_packs enable row level security;

drop policy if exists "feature_packs_select" on public.feature_packs;
create policy "feature_packs_select" on public.feature_packs
  for select to authenticated
  using (is_active or public.is_super_admin(auth.uid()));

drop policy if exists "feature_packs_manage_super_admin" on public.feature_packs;
create policy "feature_packs_manage_super_admin" on public.feature_packs
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- --- Installs / purchases ----------------------------------------------------
-- One row per (community, pack). Paid packs are written only by the service-role
-- webhook; free packs are inserted by the admin server action via the
-- service-role client after it verifies the pack is free — so there is no
-- authenticated write policy here.
create table if not exists public.community_feature_addons (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  pack_id uuid not null references public.feature_packs(id) on delete cascade,
  status text not null default 'active',
  stripe_subscription_id text unique,
  stripe_customer_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (community_id, pack_id)
);

create index if not exists community_feature_addons_community_idx on public.community_feature_addons(community_id);

alter table public.community_feature_addons enable row level security;

-- Community admins can see what their community has installed (drives the
-- marketplace UI's installed/available state). Writes are service-role only.
drop policy if exists "community_feature_addons_select" on public.community_feature_addons;
create policy "community_feature_addons_select" on public.community_feature_addons
  for select to authenticated
  using (public.is_community_admin(community_id, auth.uid()));

-- --- Pool contribution -------------------------------------------------------
-- The space types unlocked by a community's ACTIVE packs (active/trialing, not
-- lapsed). Unioned into getCommunitySpaceTypePool so purchased packs force-
-- enable their types. Security definer so it can read across the addon/pack
-- tables regardless of the caller.
create or replace function public.community_purchased_space_types(p_community_id uuid)
returns text[]
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(array_agg(distinct st), '{}')
  from public.community_feature_addons a
  join public.feature_packs p on p.id = a.pack_id
  cross join lateral unnest(p.space_types) as st
  where a.community_id = p_community_id
    and p.is_active
    and a.status in ('active', 'trialing')
    and (a.current_period_end is null or a.current_period_end > now());
$$;

-- --- Seed example packs ------------------------------------------------------
-- Catalogue starters. Prices in GBP, no Stripe price id yet (operator adds it,
-- and disables the matching space type's platform default, to make the pack
-- gate anything). Free packs need no Stripe price.
insert into public.feature_packs (slug, name, description, price_cents, currency, space_types, sort_order) values
  ('course-builder',     'Course Builder',     'Sell and run structured courses with modules, lessons and quizzes.', 1500, 'gbp', '{course}',              1),
  ('local-jobs',         'Local Jobs',         'A jobs board for your community.',                                     500,  'gbp', '{jobs}',                2),
  ('business-directory', 'Business Directory', 'A searchable directory of local businesses.',                          1000, 'gbp', '{business_directory}',  3),
  ('marketplace',        'Marketplace',        'Let members buy and sell within the community.',                       1000, 'gbp', '{marketplace}',         4)
on conflict (slug) do nothing;
