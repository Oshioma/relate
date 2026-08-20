-- =============================================================================
-- Relate — Activity communities: Meetups ("Happening Now")
--
-- A meetup is a real-time, member-posted invitation to do the activity
-- together: a time, a meeting point, a pace and a number of spots. It is
-- deliberately NOT the community Events calendar — events are organised weeks
-- ahead by staff and live in the sidebar; a meetup is "I'm walking in 40
-- minutes, who's coming?", posted by any member, interesting for a few hours
-- and then gone. Mirrors clubs/club_members (see clubs.sql) for shape and RLS.
--
-- Free text rather than enums for `activity` and `pace`: the set of activities
-- a community organises around is unbounded (the UI offers the community's own
-- activity kind as a preset), and pace vocabulary differs per activity — a
-- "moderate" walk and a "moderate" ride share nothing. `status` is the one
-- closed set: a meetup is open until its host calls it off.
--
-- Capacity is advisory here (checked in the server action before joining), the
-- same way volunteer_projects.volunteers_needed is — a race that lets one extra
-- person onto a walk is not worth a locking write path.
-- Safe to re-run.
-- =============================================================================

create table if not exists public.meetups (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  -- What's being done: "Hiking", "Trail run", "Padel". Seeded from the
  -- community's activity kind in the composer, editable per meetup.
  activity text,
  meeting_point text,
  lat double precision,
  lng double precision,
  starts_at timestamptz not null,
  -- Null = open-ended ("out until we're done"). Used to work out whether a
  -- meetup is still happening now, or already over.
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  pace text,
  distance_km numeric(6, 2) check (distance_km is null or distance_km >= 0),
  -- Null = no limit. Counts the host, who always occupies a spot.
  capacity integer check (capacity is null or capacity > 0),
  status text not null default 'open' check (status in ('open', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.meetups;
create trigger set_updated_at before update on public.meetups
  for each row execute function public.set_updated_at();

-- The board is ordered by start time, not creation time: what matters is
-- what's on now and what's next.
create index if not exists idx_meetups_space on public.meetups (space_id, starts_at desc);
create index if not exists idx_meetups_community on public.meetups (community_id, starts_at desc);

alter table public.meetups enable row level security;

drop policy if exists "meetups_select" on public.meetups;
create policy "meetups_select" on public.meetups
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "meetups_insert_member" on public.meetups;
create policy "meetups_insert_member" on public.meetups
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "meetups_update_host_or_staff" on public.meetups;
create policy "meetups_update_host_or_staff" on public.meetups
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "meetups_delete_host_or_staff" on public.meetups;
create policy "meetups_delete_host_or_staff" on public.meetups
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- meetup_participants: who's coming. The host is inserted as a participant on
-- create, so "who's going" is one list rather than host-plus-others everywhere.
-- -----------------------------------------------------------------------------
create table if not exists public.meetup_participants (
  id uuid primary key default gen_random_uuid(),
  meetup_id uuid not null references public.meetups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (meetup_id, user_id)
);

create index if not exists idx_meetup_participants_meetup on public.meetup_participants (meetup_id);
create index if not exists idx_meetup_participants_user on public.meetup_participants (user_id);

alter table public.meetup_participants enable row level security;

drop policy if exists "meetup_participants_select" on public.meetup_participants;
create policy "meetup_participants_select" on public.meetup_participants
  for select to authenticated
  using (
    exists (
      select 1 from public.meetups m
      where m.id = meetup_participants.meetup_id
        and public.can_view_space(m.space_id, auth.uid())
    )
  );

drop policy if exists "meetup_participants_insert_self" on public.meetup_participants;
create policy "meetup_participants_insert_self" on public.meetup_participants
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.meetups m
      where m.id = meetup_participants.meetup_id
        and m.status = 'open'
        and public.is_community_member(m.community_id, auth.uid())
        and public.can_view_space(m.space_id, auth.uid())
    )
  );

drop policy if exists "meetup_participants_delete_self_or_staff" on public.meetup_participants;
create policy "meetup_participants_delete_self_or_staff" on public.meetup_participants
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.meetups m
      where m.id = meetup_participants.meetup_id
        and public.is_community_staff(m.community_id, auth.uid())
    )
  );
