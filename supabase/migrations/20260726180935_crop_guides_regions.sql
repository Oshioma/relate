-- =============================================================================
-- Relate — Crop Guides, Phase 3: region-aware planting calendars
--
-- Safe to re-run.
--
-- Three tables:
--   * crop_regions            — platform-global reference regions (climate &
--                               geographic), super-admin curated, all readable.
--   * crop_calendars          — the default monthly planting calendar for a crop
--                               in a reference region: which months to sow
--                               indoors / direct sow / transplant / harvest /
--                               avoid. Global reference data like crops.
--   * community_crop_regions  — a community's own growing regions (e.g. Zanzibar,
--                               Kenya Highlands, Scotland). Each optionally
--                               inherits a reference region's calendar as its
--                               starting point (base_region_id). Community
--                               admins manage these; members read them to pick a
--                               local calendar on a crop page.
--
-- Per-crop, per-community MONTH overrides (a community tuning individual months
-- away from its base region) are a later phase — for now a community region
-- shows its base reference region's calendar, which already lets communities
-- offer a locally-labelled calendar immediately.
-- =============================================================================

-- crop_regions (global reference) ---------------------------------------------
create table if not exists public.crop_regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  kind text not null default 'climate' check (kind in ('climate', 'geographic')),
  hemisphere text check (hemisphere in ('north', 'south')),  -- null = not hemisphere-specific
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_crop_regions_kind on public.crop_regions (kind, sort_order);

alter table public.crop_regions enable row level security;

drop policy if exists "crop_regions_select" on public.crop_regions;
create policy "crop_regions_select" on public.crop_regions
  for select to authenticated
  using (true);

drop policy if exists "crop_regions_write_super_admin" on public.crop_regions;
create policy "crop_regions_write_super_admin" on public.crop_regions
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- crop_calendars (global default calendars) -----------------------------------
-- One row per (crop, region, month, activity). A crop in a region can carry
-- several activities in the same month (e.g. direct sow AND harvest), hence the
-- composite unique rather than one row per month.
create table if not exists public.crop_calendars (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid not null references public.crops (id) on delete cascade,
  region_id uuid not null references public.crop_regions (id) on delete cascade,
  month smallint not null check (month between 1 and 12),
  activity text not null check (activity in ('sow_indoors', 'direct_sow', 'transplant', 'harvest', 'avoid')),
  created_at timestamptz not null default now(),
  unique (crop_id, region_id, month, activity)
);

create index if not exists idx_crop_calendars_crop_region on public.crop_calendars (crop_id, region_id);
create index if not exists idx_crop_calendars_region_month on public.crop_calendars (region_id, month);

alter table public.crop_calendars enable row level security;

drop policy if exists "crop_calendars_select" on public.crop_calendars;
create policy "crop_calendars_select" on public.crop_calendars
  for select to authenticated
  using (
    exists (
      select 1 from public.crops c
      where c.id = crop_calendars.crop_id
        and (c.status = 'published' or public.is_super_admin(auth.uid()))
    )
  );

drop policy if exists "crop_calendars_write_super_admin" on public.crop_calendars;
create policy "crop_calendars_write_super_admin" on public.crop_calendars
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- community_crop_regions (per-community growing regions) -----------------------
create table if not exists public.community_crop_regions (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  name text not null,
  -- The reference region whose default calendar this local region inherits.
  base_region_id uuid references public.crop_regions (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (community_id, name)
);

drop trigger if exists set_updated_at on public.community_crop_regions;
create trigger set_updated_at before update on public.community_crop_regions
  for each row execute function public.set_updated_at();

create index if not exists idx_community_crop_regions_community on public.community_crop_regions (community_id);

alter table public.community_crop_regions enable row level security;

-- Any member of the community can read its local regions (to pick one on a crop
-- page); a community admin manages them.
drop policy if exists "community_crop_regions_select" on public.community_crop_regions;
create policy "community_crop_regions_select" on public.community_crop_regions
  for select to authenticated
  using (public.is_community_member(community_id, auth.uid()));

drop policy if exists "community_crop_regions_manage_admin" on public.community_crop_regions;
create policy "community_crop_regions_manage_admin" on public.community_crop_regions
  for all to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));
