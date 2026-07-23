-- =============================================================================
-- Relate — Place-Based Community: Explore Map
--
-- Run this after supabase/place-community.sql (needs the 'map' space_type
-- value). Safe to re-run.
--
-- map_categories are the togglable layers on a community's map (Restaurants,
-- Beaches, Parks, …) — community-scoped like community_profile_fields,
-- since one community has (in practice) one Explore Map shared across it,
-- not one map per space. The wizard seeds these from a place community's
-- chosen location type (see recommendPlaceSetup's mapLayers in
-- src/lib/community-templates.ts) but admins can add, rename or toggle them
-- afterward.
--
-- landmarks are the pins members add directly to the map (a beach, a
-- viewpoint, a trailhead — anything that isn't already a Business). Scoped
-- to a space like businesses/challenges/journal entries are, so a landmark
-- knows which 'map' space it belongs to. Businesses with lat/lng set (see
-- supabase/business-directory.sql) appear on the same map without being
-- duplicated into this table.
-- =============================================================================

create table if not exists public.map_categories (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  name text not null,
  icon text,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_map_categories_community on public.map_categories (community_id, sort_order);

alter table public.map_categories enable row level security;

drop policy if exists "map_categories_select" on public.map_categories;
create policy "map_categories_select" on public.map_categories
  for select to authenticated
  using (public.is_community_member(community_id, auth.uid()) or public.is_community_admin(community_id, auth.uid()));

drop policy if exists "map_categories_manage_admin" on public.map_categories;
create policy "map_categories_manage_admin" on public.map_categories
  for all to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));

create table if not exists public.landmarks (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  category_id uuid references public.map_categories (id) on delete set null,
  created_by uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  lat double precision not null,
  lng double precision not null,
  location_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.landmarks;
create trigger set_updated_at before update on public.landmarks
  for each row execute function public.set_updated_at();

create index if not exists idx_landmarks_space on public.landmarks (space_id, created_at desc);
create index if not exists idx_landmarks_category on public.landmarks (category_id);

alter table public.landmarks enable row level security;

drop policy if exists "landmarks_select" on public.landmarks;
create policy "landmarks_select" on public.landmarks
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "landmarks_insert_member" on public.landmarks;
create policy "landmarks_insert_member" on public.landmarks
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "landmarks_update_author_or_staff" on public.landmarks;
create policy "landmarks_update_author_or_staff" on public.landmarks
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "landmarks_delete_author_or_staff" on public.landmarks;
create policy "landmarks_delete_author_or_staff" on public.landmarks
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));
