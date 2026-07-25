-- =============================================================================
-- Relate — space-type pool (which kinds of space a community may add)
--
-- Community admins add spaces from a pool of space types (Discussion, Course,
-- Marketplace, Explore Map, …). This lets a platform super admin regulate
-- that pool: set which types are available by default for every community,
-- and override the pool per community.
--
-- Mirrors the two-level feature-availability model (feature_defaults +
-- community_features). Resolution order for a given community + space type:
--   1. an explicit community_space_types row wins;
--   2. otherwise fall back to space_type_defaults;
--   3. otherwise default to enabled (today's behavior — every type available).
--
-- Intentionally NOT seeded. A missing row means "allowed", so the pool is
-- identical to today until a super admin narrows it — no backfill, and adding
-- a new space type in code needs no migration here.
-- =============================================================================

-- space_type_defaults ---------------------------------------------------------
-- Platform-wide default pool: which space types new (and un-overridden)
-- communities may add. Missing row = allowed.

create table if not exists public.space_type_defaults (
  space_type text primary key,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.space_type_defaults;
create trigger set_updated_at before update on public.space_type_defaults
  for each row execute function public.set_updated_at();

alter table public.space_type_defaults enable row level security;

drop policy if exists "space_type_defaults_select" on public.space_type_defaults;
create policy "space_type_defaults_select" on public.space_type_defaults
  for select to authenticated
  using (true);

drop policy if exists "space_type_defaults_write" on public.space_type_defaults;
create policy "space_type_defaults_write" on public.space_type_defaults
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- community_space_types -------------------------------------------------------
-- Per-community override of the default pool, set by the super admin. An
-- explicit row decides whether that community may add spaces of the type.

create table if not exists public.community_space_types (
  community_id uuid not null references public.communities (id) on delete cascade,
  space_type text not null,
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (community_id, space_type)
);

drop trigger if exists set_updated_at on public.community_space_types;
create trigger set_updated_at before update on public.community_space_types
  for each row execute function public.set_updated_at();

create index if not exists idx_community_space_types_community
  on public.community_space_types (community_id);

alter table public.community_space_types enable row level security;

-- Readable by any authenticated user: a community's admins resolve their pool
-- to build the "add a space" type picker (mirrors community_features).
drop policy if exists "community_space_types_select" on public.community_space_types;
create policy "community_space_types_select" on public.community_space_types
  for select to authenticated
  using (true);

-- Only a platform super admin may regulate a community's pool.
drop policy if exists "community_space_types_write" on public.community_space_types;
create policy "community_space_types_write" on public.community_space_types
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));
