-- =============================================================================
-- Relate — Place-Based Community: Jobs Board
--
-- Run this after supabase/place-community.sql (needs the 'jobs' space_type
-- value) and supabase/business-directory.sql (job_listings can optionally
-- link to a businesses row). Safe to re-run.
--
-- A space with space_type = 'jobs' lists full time, part time, volunteer,
-- remote, internship and seasonal postings. `business_id` is optional —
-- a posting can be tied to an existing Business Directory listing (the
-- employer), or stand alone when the poster isn't listed there. `salary`
-- is free text (not numeric) since real postings say "negotiable",
-- "$18-22/hr" or "competitive" as often as a clean number.
-- =============================================================================

do $$ begin
  create type public.job_type as enum (
    'full_time', 'part_time', 'volunteer', 'remote', 'internship', 'seasonal'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.job_listing_status as enum ('open', 'closed');
exception when duplicate_object then null; end $$;

create table if not exists public.job_listings (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  posted_by uuid not null references public.profiles (id) on delete cascade,
  business_id uuid references public.businesses (id) on delete set null,
  title text not null,
  description text not null,
  job_type public.job_type not null default 'full_time',
  salary text,
  location_label text,
  lat double precision,
  lng double precision,
  apply_url text,
  status public.job_listing_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.job_listings;
create trigger set_updated_at before update on public.job_listings
  for each row execute function public.set_updated_at();

create index if not exists idx_job_listings_space on public.job_listings (space_id, created_at desc);
create index if not exists idx_job_listings_type on public.job_listings (space_id, job_type);

alter table public.job_listings enable row level security;

drop policy if exists "job_listings_select" on public.job_listings;
create policy "job_listings_select" on public.job_listings
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "job_listings_insert_member" on public.job_listings;
create policy "job_listings_insert_member" on public.job_listings
  for insert to authenticated
  with check (
    posted_by = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "job_listings_update_poster_or_staff" on public.job_listings;
create policy "job_listings_update_poster_or_staff" on public.job_listings
  for update to authenticated
  using (posted_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (posted_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "job_listings_delete_poster_or_staff" on public.job_listings;
create policy "job_listings_delete_poster_or_staff" on public.job_listings
  for delete to authenticated
  using (posted_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));
