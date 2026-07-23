-- =============================================================================
-- Relate — Place-Based Community: Clubs & Groups
--
-- Run this after supabase/place-community.sql (needs the 'clubs' space_type
-- value). Safe to re-run.
--
-- The brief describes each club as "a full community-within-a-community."
-- Building actual nested sub-communities (their own posts, spaces, feed)
-- would be a much bigger feature than everything else in this round —
-- instead this mirrors space_challenges/space_challenge_participants
-- (see challenges.sql): a club is something members join, with a meeting
-- location and a member list, not its own discussion feed. `category` is
-- free text, not an enum — unlike businesses or job types, a club's topic
-- (Photography, Dog Owners, Language Exchange, …) is genuinely unbounded,
-- so the UI offers presets as suggestions rather than a fixed list.
-- =============================================================================

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  category text,
  description text,
  location_label text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.clubs;
create trigger set_updated_at before update on public.clubs
  for each row execute function public.set_updated_at();

create index if not exists idx_clubs_space on public.clubs (space_id, created_at desc);

alter table public.clubs enable row level security;

drop policy if exists "clubs_select" on public.clubs;
create policy "clubs_select" on public.clubs
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "clubs_insert_member" on public.clubs;
create policy "clubs_insert_member" on public.clubs
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "clubs_update_creator_or_staff" on public.clubs;
create policy "clubs_update_creator_or_staff" on public.clubs
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "clubs_delete_creator_or_staff" on public.clubs;
create policy "clubs_delete_creator_or_staff" on public.clubs
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- club_members: who has joined which club.
-- -----------------------------------------------------------------------------
create table if not exists public.club_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (club_id, user_id)
);

create index if not exists idx_club_members_club on public.club_members (club_id);
create index if not exists idx_club_members_user on public.club_members (user_id);

alter table public.club_members enable row level security;

drop policy if exists "club_members_select" on public.club_members;
create policy "club_members_select" on public.club_members
  for select to authenticated
  using (
    exists (
      select 1 from public.clubs c
      where c.id = club_members.club_id
        and public.can_view_space(c.space_id, auth.uid())
    )
  );

drop policy if exists "club_members_insert_self" on public.club_members;
create policy "club_members_insert_self" on public.club_members
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.clubs c
      where c.id = club_members.club_id
        and public.is_community_member(c.community_id, auth.uid())
    )
  );

drop policy if exists "club_members_delete_self_or_staff" on public.club_members;
create policy "club_members_delete_self_or_staff" on public.club_members
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.clubs c
      where c.id = club_members.club_id
        and public.is_community_staff(c.community_id, auth.uid())
    )
  );
