-- =============================================================================
-- Relate — Place-Based Community: Accommodation
--
-- Run this after supabase/place-community.sql (needs the 'accommodation'
-- space_type value) and supabase/business-directory.sql (accommodation
-- listings can optionally link to a businesses row). Safe to re-run.
--
-- A space with space_type = 'accommodation' lists hotels, hostels,
-- guesthouses, holiday rentals, long-term rentals, house shares and
-- camping. `business_id` is optional, same reasoning as job_listings — a
-- hotel that's already in the Business Directory can link here instead of
-- duplicating its details. `status` lets a lister mark a place unavailable
-- without deleting the listing (e.g. fully booked for the season).
-- =============================================================================

do $$ begin
  create type public.accommodation_type as enum (
    'hotel', 'hostel', 'guesthouse', 'holiday_rental', 'long_term_rental', 'house_share', 'camping'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.accommodation_status as enum ('available', 'unavailable');
exception when duplicate_object then null; end $$;

create table if not exists public.accommodation_listings (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  listed_by uuid not null references public.profiles (id) on delete cascade,
  business_id uuid references public.businesses (id) on delete set null,
  name text not null,
  accommodation_type public.accommodation_type not null default 'holiday_rental',
  description text,
  photo_url text,
  price_per_night numeric(12, 2),
  currency text,
  booking_url text,
  location_label text,
  lat double precision,
  lng double precision,
  status public.accommodation_status not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.accommodation_listings;
create trigger set_updated_at before update on public.accommodation_listings
  for each row execute function public.set_updated_at();

create index if not exists idx_accommodation_listings_space on public.accommodation_listings (space_id, created_at desc);
create index if not exists idx_accommodation_listings_type on public.accommodation_listings (space_id, accommodation_type);

alter table public.accommodation_listings enable row level security;

drop policy if exists "accommodation_listings_select" on public.accommodation_listings;
create policy "accommodation_listings_select" on public.accommodation_listings
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "accommodation_listings_insert_member" on public.accommodation_listings;
create policy "accommodation_listings_insert_member" on public.accommodation_listings
  for insert to authenticated
  with check (
    listed_by = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "accommodation_listings_update_lister_or_staff" on public.accommodation_listings;
create policy "accommodation_listings_update_lister_or_staff" on public.accommodation_listings
  for update to authenticated
  using (listed_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (listed_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "accommodation_listings_delete_lister_or_staff" on public.accommodation_listings;
create policy "accommodation_listings_delete_lister_or_staff" on public.accommodation_listings
  for delete to authenticated
  using (listed_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));
