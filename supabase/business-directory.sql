-- =============================================================================
-- Relate — Place-Based Community: Business Directory
--
-- Run this after supabase/place-community.sql (needs the 'business_directory'
-- space_type value). Safe to re-run.
--
-- A space with space_type = 'business_directory' lists local businesses —
-- Restaurants is the flagship category (every place community has them),
-- alongside Cafes, Shops, Accommodation, Services and a Local Trades catch-all
-- so villages/towns aren't stuck with a "Restaurants only" directory. Any
-- active member can add a listing; the member who added it (or a community
-- admin/moderator) can edit, remove, verify or feature it. Claiming a listing,
-- photos and reviews are follow-up work — see src/types/place.ts.
-- =============================================================================

do $$ begin
  create type public.business_category as enum (
    'restaurant', 'cafe', 'shop', 'accommodation', 'service', 'health', 'fitness', 'coworking', 'other'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  category public.business_category not null default 'other',
  description text,
  website text,
  phone text,
  address text,
  opening_hours text,
  lat double precision,
  lng double precision,
  location_label text,
  verified boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.businesses;
create trigger set_updated_at before update on public.businesses
  for each row execute function public.set_updated_at();

-- verified/featured are staff-only, even though the update RLS policy below
-- also allows the listing's own creator to edit the rest of the row (name,
-- description, hours, …) — without this, a member could self-verify or
-- self-feature their own listing directly through the API.
create or replace function public.enforce_business_privileged_fields()
returns trigger as $$
begin
  if not public.is_community_staff(new.community_id, auth.uid()) then
    new.verified := old.verified;
    new.featured := old.featured;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists enforce_business_privileged_fields on public.businesses;
create trigger enforce_business_privileged_fields before update on public.businesses
  for each row execute function public.enforce_business_privileged_fields();

create index if not exists idx_businesses_space on public.businesses (space_id, created_at desc);
create index if not exists idx_businesses_category on public.businesses (space_id, category);

alter table public.businesses enable row level security;

drop policy if exists "businesses_select" on public.businesses;
create policy "businesses_select" on public.businesses
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "businesses_insert_member" on public.businesses;
create policy "businesses_insert_member" on public.businesses
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "businesses_update_author_or_staff" on public.businesses;
create policy "businesses_update_author_or_staff" on public.businesses
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "businesses_delete_author_or_staff" on public.businesses;
create policy "businesses_delete_author_or_staff" on public.businesses
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));
