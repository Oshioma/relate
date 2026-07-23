-- =============================================================================
-- Relate — event RSVPs
--
-- Run this in the Supabase SQL editor after supabase/schema.sql. Safe to
-- re-run.
--
-- Attending is just row presence: RSVPing inserts a row, canceling deletes
-- it. No separate "going/interested/declined" states for now.
-- =============================================================================

create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table public.event_rsvps enable row level security;

drop policy if exists "event_rsvps_select" on public.event_rsvps;
create policy "event_rsvps_select" on public.event_rsvps
  for select to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id
        and (public.is_community_public(e.community_id) or public.is_community_member(e.community_id, auth.uid()))
    )
  );

drop policy if exists "event_rsvps_insert_self" on public.event_rsvps;
create policy "event_rsvps_insert_self" on public.event_rsvps
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.events e
      where e.id = event_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "event_rsvps_delete_self" on public.event_rsvps;
create policy "event_rsvps_delete_self" on public.event_rsvps
  for delete to authenticated
  using (user_id = auth.uid());
