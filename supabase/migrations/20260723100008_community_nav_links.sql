-- =============================================================================
-- Relate — custom sidebar links
--
-- Run this in the Supabase SQL editor. Safe to re-run.
--
-- Lets a community's owner/admins add arbitrary external links (e.g. "Farm
-- App") to that community's sidebar nav. Each opens in a new tab.
-- =============================================================================

create table if not exists public.community_nav_links (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  label text not null,
  url text not null,
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.community_nav_links;
create trigger set_updated_at before update on public.community_nav_links
  for each row execute function public.set_updated_at();

create index if not exists idx_community_nav_links_community on public.community_nav_links (community_id, sort_order);

alter table public.community_nav_links enable row level security;

drop policy if exists "community_nav_links_select" on public.community_nav_links;
create policy "community_nav_links_select" on public.community_nav_links
  for select to authenticated
  using (
    public.is_community_member(community_id, auth.uid())
    or public.is_community_public(community_id)
  );

drop policy if exists "community_nav_links_manage_admin" on public.community_nav_links;
create policy "community_nav_links_manage_admin" on public.community_nav_links
  for all to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));
