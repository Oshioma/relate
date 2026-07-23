-- =============================================================================
-- Relate — platform feature flags & super admin
--
-- Run this in the Supabase SQL editor, after schema.sql. Safe to re-run.
--
-- Lets a platform operator (super admin) decide which optional built-in nav
-- features (Events, Concierge search) new communities start with, and
-- override that per existing community. Resolution order for a given
-- community + feature: an explicit community_features row wins; otherwise
-- fall back to feature_defaults; otherwise default to enabled (today's
-- always-on behavior).
--
-- There's no UI to grant the first super admin (chicken-and-egg), so do it
-- once by hand after you've signed up:
--   update public.profiles set is_super_admin = true where username = 'you';
-- =============================================================================

alter table public.profiles add column if not exists is_super_admin boolean not null default false;

create or replace function public.is_super_admin(p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_super_admin from public.profiles where id = p_user_id), false);
$$;

-- feature_defaults ------------------------------------------------------------

create table if not exists public.feature_defaults (
  feature_key text primary key,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.feature_defaults;
create trigger set_updated_at before update on public.feature_defaults
  for each row execute function public.set_updated_at();

insert into public.feature_defaults (feature_key, enabled) values
  ('events', true),
  ('concierge', true)
on conflict (feature_key) do nothing;

alter table public.feature_defaults enable row level security;

drop policy if exists "feature_defaults_select" on public.feature_defaults;
create policy "feature_defaults_select" on public.feature_defaults
  for select to authenticated
  using (true);

drop policy if exists "feature_defaults_write" on public.feature_defaults;
create policy "feature_defaults_write" on public.feature_defaults
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- community_features ----------------------------------------------------------

create table if not exists public.community_features (
  community_id uuid not null references public.communities (id) on delete cascade,
  feature_key text not null,
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (community_id, feature_key)
);

drop trigger if exists set_updated_at on public.community_features;
create trigger set_updated_at before update on public.community_features
  for each row execute function public.set_updated_at();

create index if not exists idx_community_features_community on public.community_features (community_id);

alter table public.community_features enable row level security;

drop policy if exists "community_features_select" on public.community_features;
create policy "community_features_select" on public.community_features
  for select to authenticated
  using (true);

drop policy if exists "community_features_write" on public.community_features;
create policy "community_features_write" on public.community_features
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- A super admin manages every community's features from /admin, including
-- private ones they aren't a member of — add a permissive select policy
-- (OR'd with communities_select_visible) rather than touching that policy.
drop policy if exists "communities_select_super_admin" on public.communities;
create policy "communities_select_super_admin" on public.communities
  for select to authenticated
  using (public.is_super_admin(auth.uid()));
