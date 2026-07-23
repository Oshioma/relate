-- =============================================================================
-- Relate — Member Directory, Stage 1a: profile extensions + business profiles
--
-- Run this after supabase/schema.sql. Safe to re-run.
--
-- Adds the professional/networking fields the Member Directory needs, plus
-- the privacy switches that gate them. Existing RLS on `profiles`
-- (profiles_select_authenticated: select using (true)) stays as-is for
-- authenticated users generally — hide_profile is enforced by a stricter
-- policy below for people who DON'T already share an active community with
-- the viewer, since existing features (post/comment authorship, member
-- lists) depend on being able to see fellow community members regardless
-- of directory-visibility preferences.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles: professional + privacy fields
-- -----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists profession text,
  add column if not exists company text,
  add column if not exists website text,
  add column if not exists social_links jsonb not null default '{}'::jsonb,
  add column if not exists contribution_score integer not null default 0,
  add column if not exists last_active_at timestamptz,
  add column if not exists hide_profile boolean not null default false,
  add column if not exists hide_online_status boolean not null default false,
  add column if not exists hide_communities boolean not null default false,
  add column if not exists hide_social_links boolean not null default false,
  add column if not exists hide_business_profile boolean not null default false,
  add column if not exists is_discoverable boolean not null default true;

create index if not exists idx_profiles_contribution_score on public.profiles (contribution_score desc);
create index if not exists idx_profiles_last_active on public.profiles (last_active_at desc);

-- Lets a viewer see a profile that has hide_profile = true only if they
-- share an active membership with that person somewhere on the platform.
create or replace function public.shares_active_community(a uuid, b uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.community_memberships m1
    join public.community_memberships m2 on m1.community_id = m2.community_id
    where m1.user_id = a
      and m2.user_id = b
      and m1.status = 'active'
      and m2.status = 'active'
  );
$$;

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or hide_profile = false
    or public.shares_active_community(auth.uid(), id)
  );

-- -----------------------------------------------------------------------------
-- business_profiles: one optional business profile per user
-- -----------------------------------------------------------------------------
create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  business_name text not null,
  logo_url text,
  description text,
  website text,
  industry text,
  services text[] not null default '{}',
  products text[] not null default '{}',
  location text,
  contact_links jsonb not null default '{}'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.business_profiles;
create trigger set_updated_at before update on public.business_profiles
  for each row execute function public.set_updated_at();

alter table public.business_profiles enable row level security;

drop policy if exists "business_profiles_select" on public.business_profiles;
create policy "business_profiles_select" on public.business_profiles
  for select to authenticated
  using (
    profile_id = auth.uid()
    or (
      not exists (
        select 1 from public.profiles p where p.id = profile_id and p.hide_business_profile = true
      )
      and (
        not exists (select 1 from public.profiles p where p.id = profile_id and p.hide_profile = true)
        or public.shares_active_community(auth.uid(), profile_id)
      )
    )
  );

drop policy if exists "business_profiles_insert_own" on public.business_profiles;
create policy "business_profiles_insert_own" on public.business_profiles
  for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "business_profiles_update_own" on public.business_profiles;
create policy "business_profiles_update_own" on public.business_profiles
  for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists "business_profiles_delete_own" on public.business_profiles;
create policy "business_profiles_delete_own" on public.business_profiles
  for delete to authenticated
  using (profile_id = auth.uid());

-- -----------------------------------------------------------------------------
-- member_interests / member_skills: simple tag lists
-- -----------------------------------------------------------------------------
create table if not exists public.member_interests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  interest text not null,
  created_at timestamptz not null default now(),
  unique (profile_id, interest)
);

create table if not exists public.member_skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  skill text not null,
  created_at timestamptz not null default now(),
  unique (profile_id, skill)
);

create index if not exists idx_member_interests_interest on public.member_interests (interest);
create index if not exists idx_member_skills_skill on public.member_skills (skill);

alter table public.member_interests enable row level security;
alter table public.member_skills enable row level security;

drop policy if exists "member_interests_select" on public.member_interests;
create policy "member_interests_select" on public.member_interests
  for select to authenticated
  using (
    profile_id = auth.uid()
    or not exists (select 1 from public.profiles p where p.id = profile_id and p.hide_profile = true)
    or public.shares_active_community(auth.uid(), profile_id)
  );

drop policy if exists "member_interests_manage_own" on public.member_interests;
create policy "member_interests_manage_own" on public.member_interests
  for all to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists "member_skills_select" on public.member_skills;
create policy "member_skills_select" on public.member_skills
  for select to authenticated
  using (
    profile_id = auth.uid()
    or not exists (select 1 from public.profiles p where p.id = profile_id and p.hide_profile = true)
    or public.shares_active_community(auth.uid(), profile_id)
  );

drop policy if exists "member_skills_manage_own" on public.member_skills;
create policy "member_skills_manage_own" on public.member_skills
  for all to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- -----------------------------------------------------------------------------
-- member_help_requests: "needs help with" and "available to help with",
-- distinguished by `kind`
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.help_request_kind as enum ('needs_help', 'can_help');
exception when duplicate_object then null; end $$;

create table if not exists public.member_help_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  kind public.help_request_kind not null,
  topic text not null,
  created_at timestamptz not null default now(),
  unique (profile_id, kind, topic)
);

create index if not exists idx_member_help_requests_topic on public.member_help_requests (topic);

alter table public.member_help_requests enable row level security;

drop policy if exists "member_help_requests_select" on public.member_help_requests;
create policy "member_help_requests_select" on public.member_help_requests
  for select to authenticated
  using (
    profile_id = auth.uid()
    or not exists (select 1 from public.profiles p where p.id = profile_id and p.hide_profile = true)
    or public.shares_active_community(auth.uid(), profile_id)
  );

drop policy if exists "member_help_requests_manage_own" on public.member_help_requests;
create policy "member_help_requests_manage_own" on public.member_help_requests
  for all to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- -----------------------------------------------------------------------------
-- member_locations: approximate, opt-in only. City/region/country text —
-- never a precise address, never geocoded without explicit opt-in.
-- -----------------------------------------------------------------------------
create table if not exists public.member_locations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  city text,
  region text,
  country text,
  is_visible boolean not null default false,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.member_locations;
create trigger set_updated_at before update on public.member_locations
  for each row execute function public.set_updated_at();

create index if not exists idx_member_locations_country on public.member_locations (country) where is_visible;

alter table public.member_locations enable row level security;

drop policy if exists "member_locations_select" on public.member_locations;
create policy "member_locations_select" on public.member_locations
  for select to authenticated
  using (
    profile_id = auth.uid()
    or (
      is_visible = true
      and (
        not exists (select 1 from public.profiles p where p.id = profile_id and p.hide_profile = true)
        or public.shares_active_community(auth.uid(), profile_id)
      )
    )
  );

drop policy if exists "member_locations_manage_own" on public.member_locations;
create policy "member_locations_manage_own" on public.member_locations
  for all to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
