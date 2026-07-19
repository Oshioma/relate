-- =============================================================================
-- Relate — multi-tenant community platform
-- Core schema + Row Level Security policies
--
-- Run this once in the Supabase SQL editor (or via `supabase db push`) on a
-- fresh project. Safe to re-run: every object is created with IF NOT EXISTS /
-- OR REPLACE / DROP POLICY IF EXISTS guards.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.membership_role as enum ('owner', 'admin', 'moderator', 'member');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.membership_status as enum ('active', 'invited', 'banned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.space_visibility as enum ('public', 'members', 'private');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.post_type as enum ('discussion', 'announcement', 'resource');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.resource_type as enum ('link', 'file', 'video', 'document');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

-- One row per authenticated user. Created automatically via trigger below.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  username text not null unique,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_]{3,30}$')
);

-- A tenant. Anyone can own one (future: marketplace of communities).
create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  cover_image_url text,
  owner_id uuid not null references public.profiles (id) on delete restrict,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint slug_format check (slug ~ '^[a-z0-9-]{2,60}$')
);

-- Who belongs to which tenant, and with what role/status.
create table if not exists public.community_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  role public.membership_role not null default 'member',
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (user_id, community_id)
);

-- Sub-areas inside a community (e.g. "General", "Announcements", "Resources").
create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  visibility public.space_visibility not null default 'members',
  sort_order integer not null default 0,
  show_in_nav boolean not null default true,
  created_at timestamptz not null default now(),
  unique (community_id, slug),
  constraint space_slug_format check (slug ~ '^[a-z0-9-]{2,60}$')
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  space_id uuid not null references public.spaces (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text,
  post_type public.post_type not null default 'discussion',
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz,
  location text,
  online_url text,
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint event_time_order check (end_time is null or end_time >= start_time)
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  space_id uuid not null references public.spaces (id) on delete cascade,
  title text not null,
  description text,
  url text not null,
  resource_type public.resource_type not null default 'link',
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
create index if not exists idx_community_memberships_user on public.community_memberships (user_id);
create index if not exists idx_community_memberships_community on public.community_memberships (community_id);
create index if not exists idx_spaces_community on public.spaces (community_id);
create index if not exists idx_posts_community on public.posts (community_id);
create index if not exists idx_posts_space on public.posts (space_id);
create index if not exists idx_posts_author on public.posts (author_id);
create index if not exists idx_comments_post on public.comments (post_id);
create index if not exists idx_comments_author on public.comments (author_id);
create index if not exists idx_events_community on public.events (community_id);
create index if not exists idx_events_start_time on public.events (start_time);
create index if not exists idx_resources_community on public.resources (community_id);
create index if not exists idx_resources_space on public.resources (space_id);

-- -----------------------------------------------------------------------------
-- updated_at bookkeeping
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.communities;
create trigger set_updated_at before update on public.communities
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.posts;
create trigger set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.comments;
create trigger set_updated_at before update on public.comments
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- New auth.users -> public.profiles
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    '[^a-z0-9_]', '', 'g'
  ));

  if base_username is null or length(base_username) < 3 then
    base_username := 'user' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  final_username := base_username;

  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, full_name, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    final_username,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- New community -> owner membership
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_community()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.community_memberships (user_id, community_id, role, status)
  values (new.owner_id, new.id, 'owner', 'active')
  on conflict (user_id, community_id) do update
    set role = 'owner', status = 'active';
  return new;
end;
$$;

drop trigger if exists on_community_created on public.communities;
create trigger on_community_created
  after insert on public.communities
  for each row execute function public.handle_new_community();

-- -----------------------------------------------------------------------------
-- Helper functions used inside RLS policies
--
-- These are SECURITY DEFINER so they can read community_memberships without
-- being blocked by that table's own RLS policies (which would otherwise cause
-- infinite recursion when membership policies call back into themselves).
-- -----------------------------------------------------------------------------
create or replace function public.is_community_member(p_community_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.community_memberships m
    where m.community_id = p_community_id
      and m.user_id = p_user_id
      and m.status = 'active'
  );
$$;

create or replace function public.is_community_staff(p_community_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.community_memberships m
    where m.community_id = p_community_id
      and m.user_id = p_user_id
      and m.status = 'active'
      and m.role in ('owner', 'admin', 'moderator')
  );
$$;

create or replace function public.is_community_admin(p_community_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.community_memberships m
    where m.community_id = p_community_id
      and m.user_id = p_user_id
      and m.status = 'active'
      and m.role in ('owner', 'admin')
  );
$$;

create or replace function public.is_community_public(p_community_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select c.is_public from public.communities c where c.id = p_community_id), false);
$$;

create or replace function public.can_view_space(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select case s.visibility
    when 'public' then true
    when 'members' then public.is_community_member(s.community_id, p_user_id)
    when 'private' then public.is_community_staff(s.community_id, p_user_id)
    else false
  end
  from public.spaces s
  where s.id = p_space_id;
$$;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.communities enable row level security;
alter table public.community_memberships enable row level security;
alter table public.spaces enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.events enable row level security;
alter table public.resources enable row level security;

-- profiles ---------------------------------------------------------------
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated
  using (true);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- communities --------------------------------------------------------------
drop policy if exists "communities_select_visible" on public.communities;
create policy "communities_select_visible" on public.communities
  for select to authenticated
  using (
    is_public = true
    or owner_id = auth.uid()
    or public.is_community_member(id, auth.uid())
  );

-- Signed-out visitors can see public communities so the marketing landing
-- page can showcase real communities instead of static placeholders.
drop policy if exists "communities_select_public_anon" on public.communities;
create policy "communities_select_public_anon" on public.communities
  for select to anon
  using (is_public = true);

drop policy if exists "communities_insert_own" on public.communities;
create policy "communities_insert_own" on public.communities
  for insert to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "communities_update_admin" on public.communities;
create policy "communities_update_admin" on public.communities
  for update to authenticated
  using (public.is_community_admin(id, auth.uid()))
  with check (public.is_community_admin(id, auth.uid()));

drop policy if exists "communities_delete_owner" on public.communities;
create policy "communities_delete_owner" on public.communities
  for delete to authenticated
  using (owner_id = auth.uid());

-- community_memberships ------------------------------------------------------
drop policy if exists "memberships_select" on public.community_memberships;
create policy "memberships_select" on public.community_memberships
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_community_member(community_id, auth.uid())
    or public.is_community_admin(community_id, auth.uid())
  );

drop policy if exists "memberships_insert" on public.community_memberships;
create policy "memberships_insert" on public.community_memberships
  for insert to authenticated
  with check (
    -- self-join a public community
    (user_id = auth.uid() and public.is_community_public(community_id))
    -- or an owner/admin adding/inviting someone else
    or public.is_community_admin(community_id, auth.uid())
  );

drop policy if exists "memberships_update_admin_or_self" on public.community_memberships;
create policy "memberships_update_admin_or_self" on public.community_memberships
  for update to authenticated
  using (
    public.is_community_admin(community_id, auth.uid())
    or user_id = auth.uid()
  )
  with check (
    public.is_community_admin(community_id, auth.uid())
    or (user_id = auth.uid() and role = 'member')
  );

drop policy if exists "memberships_delete_admin_or_self" on public.community_memberships;
create policy "memberships_delete_admin_or_self" on public.community_memberships
  for delete to authenticated
  using (
    public.is_community_admin(community_id, auth.uid())
    or user_id = auth.uid()
  );

-- spaces ---------------------------------------------------------------------
drop policy if exists "spaces_select" on public.spaces;
create policy "spaces_select" on public.spaces
  for select to authenticated
  using (public.can_view_space(id, auth.uid()));

drop policy if exists "spaces_insert_admin" on public.spaces;
create policy "spaces_insert_admin" on public.spaces
  for insert to authenticated
  with check (public.is_community_admin(community_id, auth.uid()));

drop policy if exists "spaces_update_admin" on public.spaces;
create policy "spaces_update_admin" on public.spaces
  for update to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));

drop policy if exists "spaces_delete_admin" on public.spaces;
create policy "spaces_delete_admin" on public.spaces
  for delete to authenticated
  using (public.is_community_admin(community_id, auth.uid()));

-- posts ------------------------------------------------------------------------
drop policy if exists "posts_select" on public.posts;
create policy "posts_select" on public.posts
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "posts_insert_member" on public.posts;
create policy "posts_insert_member" on public.posts
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "posts_update_author_or_staff" on public.posts;
create policy "posts_update_author_or_staff" on public.posts
  for update to authenticated
  using (author_id = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (author_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "posts_delete_author_or_staff" on public.posts;
create policy "posts_delete_author_or_staff" on public.posts
  for delete to authenticated
  using (author_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- comments -----------------------------------------------------------------------
drop policy if exists "comments_select" on public.comments;
create policy "comments_select" on public.comments
  for select to authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and public.can_view_space(p.space_id, auth.uid())
    )
  );

drop policy if exists "comments_insert_member" on public.comments;
create policy "comments_insert_member" on public.comments
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.posts p
      where p.id = post_id
        and public.is_community_member(p.community_id, auth.uid())
    )
  );

drop policy if exists "comments_update_author_or_staff" on public.comments;
create policy "comments_update_author_or_staff" on public.comments
  for update to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.posts p
      where p.id = post_id and public.is_community_staff(p.community_id, auth.uid())
    )
  )
  with check (author_id = auth.uid());

drop policy if exists "comments_delete_author_or_staff" on public.comments;
create policy "comments_delete_author_or_staff" on public.comments
  for delete to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.posts p
      where p.id = post_id and public.is_community_staff(p.community_id, auth.uid())
    )
  );

-- events ----------------------------------------------------------------------
drop policy if exists "events_select" on public.events;
create policy "events_select" on public.events
  for select to authenticated
  using (
    public.is_community_public(community_id)
    or public.is_community_member(community_id, auth.uid())
  );

drop policy if exists "events_insert_staff" on public.events;
create policy "events_insert_staff" on public.events
  for insert to authenticated
  with check (created_by = auth.uid() and public.is_community_staff(community_id, auth.uid()));

drop policy if exists "events_update_staff" on public.events;
create policy "events_update_staff" on public.events
  for update to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

drop policy if exists "events_delete_staff" on public.events;
create policy "events_delete_staff" on public.events
  for delete to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

-- resources ---------------------------------------------------------------------
drop policy if exists "resources_select" on public.resources;
create policy "resources_select" on public.resources
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "resources_insert_staff" on public.resources;
create policy "resources_insert_staff" on public.resources
  for insert to authenticated
  with check (created_by = auth.uid() and public.is_community_staff(community_id, auth.uid()));

drop policy if exists "resources_update_staff" on public.resources;
create policy "resources_update_staff" on public.resources
  for update to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

drop policy if exists "resources_delete_staff" on public.resources;
create policy "resources_delete_staff" on public.resources
  for delete to authenticated
  using (public.is_community_staff(community_id, auth.uid()));
