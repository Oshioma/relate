-- =============================================================================
-- Relate — Place-Based Community: Volunteer Hub
--
-- Run this after supabase/place-community.sql (needs the 'volunteer_hub'
-- space_type value). Safe to re-run.
--
-- A space with space_type = 'volunteer_hub' lists projects, causes and
-- one-off requests (beach cleanups, fundraising, tree planting, animal
-- rescue, community requests, …). category is free text with UI presets,
-- same reasoning as clubs.category — the set of causes is unbounded.
-- volunteer_signups is "volunteer matching": members sign up for a project,
-- mirroring club_members/space_challenge_participants exactly, except the
-- organiser (not just staff) can also remove a signup — they're the one
-- coordinating who's actually showing up.
-- =============================================================================

do $$ begin
  create type public.volunteer_project_status as enum ('open', 'in_progress', 'completed');
exception when duplicate_object then null; end $$;

create table if not exists public.volunteer_projects (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  organiser_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  category text,
  description text not null,
  status public.volunteer_project_status not null default 'open',
  volunteers_needed integer check (volunteers_needed is null or volunteers_needed > 0),
  location_label text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.volunteer_projects;
create trigger set_updated_at before update on public.volunteer_projects
  for each row execute function public.set_updated_at();

create index if not exists idx_volunteer_projects_space on public.volunteer_projects (space_id, created_at desc);

alter table public.volunteer_projects enable row level security;

drop policy if exists "volunteer_projects_select" on public.volunteer_projects;
create policy "volunteer_projects_select" on public.volunteer_projects
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "volunteer_projects_insert_member" on public.volunteer_projects;
create policy "volunteer_projects_insert_member" on public.volunteer_projects
  for insert to authenticated
  with check (
    organiser_id = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "volunteer_projects_update_organiser_or_staff" on public.volunteer_projects;
create policy "volunteer_projects_update_organiser_or_staff" on public.volunteer_projects
  for update to authenticated
  using (organiser_id = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (organiser_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "volunteer_projects_delete_organiser_or_staff" on public.volunteer_projects;
create policy "volunteer_projects_delete_organiser_or_staff" on public.volunteer_projects
  for delete to authenticated
  using (organiser_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- volunteer_signups: who has signed up to help with which project.
-- -----------------------------------------------------------------------------
create table if not exists public.volunteer_signups (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.volunteer_projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  signed_up_at timestamptz not null default now(),
  unique (project_id, user_id)
);

create index if not exists idx_volunteer_signups_project on public.volunteer_signups (project_id);
create index if not exists idx_volunteer_signups_user on public.volunteer_signups (user_id);

alter table public.volunteer_signups enable row level security;

drop policy if exists "volunteer_signups_select" on public.volunteer_signups;
create policy "volunteer_signups_select" on public.volunteer_signups
  for select to authenticated
  using (
    exists (
      select 1 from public.volunteer_projects p
      where p.id = volunteer_signups.project_id
        and public.can_view_space(p.space_id, auth.uid())
    )
  );

drop policy if exists "volunteer_signups_insert_self" on public.volunteer_signups;
create policy "volunteer_signups_insert_self" on public.volunteer_signups
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.volunteer_projects p
      where p.id = volunteer_signups.project_id
        and public.is_community_member(p.community_id, auth.uid())
    )
  );

drop policy if exists "volunteer_signups_delete_self_or_organiser_or_staff" on public.volunteer_signups;
create policy "volunteer_signups_delete_self_or_organiser_or_staff" on public.volunteer_signups
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.volunteer_projects p
      where p.id = volunteer_signups.project_id
        and (p.organiser_id = auth.uid() or public.is_community_staff(p.community_id, auth.uid()))
    )
  );
