-- =============================================================================
-- Relate — sidebar sections an admin can name
--
-- Sidebar sections shipped as a closed set: Home, Learn and Connect, fixed in
-- code and in a check constraint on spaces.nav_group. That was right for a
-- homeschool nav and too tight for everybody else — a growing community wants
-- a "My growing" section for the spaces that are about your own plot, and had
-- no way to make one.
--
-- This moves the set into a table, one row per section per community, that the
-- community's admins can add to, rename, reorder and remove from in Admin.
--
-- WHAT STAYS THE SAME
-- spaces.nav_group still holds a section key and null still means ungrouped,
-- so nothing already filed moves. Every existing community gets Home, Learn and
-- Connect as rows (and so does every new one, by trigger), which means the nav
-- renders exactly as it did until an admin changes something.
--
-- WHY A KEY AND A LABEL
-- The key is what spaces point at and never changes; the label is what the
-- sidebar shows. Renaming "Learn" to "Lessons" is then a one-row update, and
-- the built-in links (Events under connect, Search under home, Timeline under
-- learn) keep finding their section by key.
--
-- THE CLOSED SET IS KEPT, PER COMMUNITY
-- The old check constraint existed so a typo could not invent a heading. A
-- composite foreign key does the same job now: a space can only name a section
-- its own community has. Removing a section ungroups its spaces first (the
-- before-delete trigger below) rather than failing or deleting anything.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.community_nav_groups (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  key text not null check (key ~ '^[a-z0-9_]{1,40}$'),
  label text not null check (char_length(btrim(label)) between 1 and 40),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (community_id, key)
);

comment on table public.community_nav_groups is
  'Sidebar sections per community. spaces.nav_group references (community_id, key). See src/lib/nav-groups.ts.';

drop trigger if exists set_updated_at on public.community_nav_groups;
create trigger set_updated_at before update on public.community_nav_groups
  for each row execute function public.set_updated_at();

create index if not exists idx_community_nav_groups_community
  on public.community_nav_groups (community_id, sort_order);

alter table public.community_nav_groups enable row level security;

-- Section names are shell configuration, read on every page of a community by
-- guests and members alike, like community_features.
drop policy if exists "community_nav_groups_select" on public.community_nav_groups;
create policy "community_nav_groups_select" on public.community_nav_groups
  for select to anon, authenticated
  using (true);

drop policy if exists "community_nav_groups_manage_admin" on public.community_nav_groups;
create policy "community_nav_groups_manage_admin" on public.community_nav_groups
  for all to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));

-- --- The three every community starts with -----------------------------------

create or replace function public.seed_community_nav_groups(p_community_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.community_nav_groups (community_id, key, label, sort_order)
  values
    (p_community_id, 'home', 'Home', 0),
    (p_community_id, 'learn', 'Learn', 1),
    (p_community_id, 'connect', 'Connect', 2)
  on conflict (community_id, key) do nothing;
$$;

revoke all on function public.seed_community_nav_groups(uuid) from public, anon, authenticated;

create or replace function public.seed_nav_groups_for_new_community()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.seed_community_nav_groups(new.id);
  return new;
end;
$$;

drop trigger if exists seed_nav_groups on public.communities;
create trigger seed_nav_groups after insert on public.communities
  for each row execute function public.seed_nav_groups_for_new_community();

select public.seed_community_nav_groups(c.id) from public.communities c;

-- "My growing" for the growing communities: any community with one of the
-- grower's own tools in it. Empty until an admin files spaces under it, and an
-- empty section draws no heading, so nobody's nav changes because of this.
insert into public.community_nav_groups (community_id, key, label, sort_order)
select distinct s.community_id, 'my_growing', 'My growing', 3
from public.spaces s
where s.space_type in ('my_crops', 'crop_guides', 'plant_scanner', 'plant_id')
on conflict (community_id, key) do nothing;

-- --- Spaces point at their own community's sections --------------------------

alter table public.spaces
  drop constraint if exists spaces_nav_group_allowed;

-- Anything left over that no section matches (there should be none: the old
-- constraint only allowed the three seeded keys) is ungrouped rather than
-- blocking the foreign key.
update public.spaces s
set nav_group = null
where s.nav_group is not null
  and not exists (
    select 1 from public.community_nav_groups g
    where g.community_id = s.community_id and g.key = s.nav_group
  );

alter table public.spaces
  drop constraint if exists spaces_nav_group_fkey;
alter table public.spaces
  add constraint spaces_nav_group_fkey
  foreign key (community_id, nav_group)
  references public.community_nav_groups (community_id, key);

comment on column public.spaces.nav_group is
  'Sidebar section key from community_nav_groups for this community. Null = ungrouped, which renders in a trailing unlabelled section. See src/lib/nav-groups.ts.';

-- Removing a section ungroups its spaces. They fall to the trailing unlabelled
-- section, still reachable, and can be refiled.
create or replace function public.ungroup_spaces_for_nav_group()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- The community itself is being deleted: its spaces are going too, so
  -- there is nothing to ungroup.
  if not exists (select 1 from public.communities where id = old.community_id) then
    return old;
  end if;

  update public.spaces
  set nav_group = null
  where community_id = old.community_id and nav_group = old.key;
  return old;
end;
$$;

drop trigger if exists ungroup_spaces on public.community_nav_groups;
create trigger ungroup_spaces before delete on public.community_nav_groups
  for each row execute function public.ungroup_spaces_for_nav_group();
