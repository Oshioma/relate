-- =============================================================================
-- Relate — Place-Based Community: Marketplace
--
-- Run this after supabase/place-community.sql (needs the 'marketplace'
-- space_type value). Safe to re-run.
--
-- A space with space_type = 'marketplace' lists goods, services, property,
-- vehicles, jobs, free items, wanted posts, experiences and tickets — one
-- table with a `listing_type` rather than one table per category, same
-- reasoning as businesses having a `category` column. Any active member can
-- post a listing; the seller (or staff) can mark it sold/active again or
-- remove it. Photos are a single external `photo_url` for now (see the
-- Avatar component's comment on why plain URLs, not Storage, for the same
-- reason) — a real upload pipeline is follow-up work.
-- =============================================================================

do $$ begin
  create type public.marketplace_listing_type as enum (
    'goods', 'services', 'property', 'vehicles', 'jobs', 'free', 'wanted', 'experiences', 'tickets'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.marketplace_listing_status as enum ('active', 'sold', 'expired');
exception when duplicate_object then null; end $$;

create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  listing_type public.marketplace_listing_type not null default 'goods',
  title text not null,
  description text,
  price numeric(12, 2),
  currency text,
  photo_url text,
  status public.marketplace_listing_status not null default 'active',
  lat double precision,
  lng double precision,
  location_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.marketplace_listings;
create trigger set_updated_at before update on public.marketplace_listings
  for each row execute function public.set_updated_at();

create index if not exists idx_marketplace_listings_space on public.marketplace_listings (space_id, created_at desc);
create index if not exists idx_marketplace_listings_type on public.marketplace_listings (space_id, listing_type);

alter table public.marketplace_listings enable row level security;

drop policy if exists "marketplace_listings_select" on public.marketplace_listings;
create policy "marketplace_listings_select" on public.marketplace_listings
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "marketplace_listings_insert_member" on public.marketplace_listings;
create policy "marketplace_listings_insert_member" on public.marketplace_listings
  for insert to authenticated
  with check (
    seller_id = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "marketplace_listings_update_seller_or_staff" on public.marketplace_listings;
create policy "marketplace_listings_update_seller_or_staff" on public.marketplace_listings
  for update to authenticated
  using (seller_id = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (seller_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "marketplace_listings_delete_seller_or_staff" on public.marketplace_listings;
create policy "marketplace_listings_delete_seller_or_staff" on public.marketplace_listings
  for delete to authenticated
  using (seller_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));
