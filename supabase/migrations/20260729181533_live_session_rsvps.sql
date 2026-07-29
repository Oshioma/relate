-- =============================================================================
-- Relate — Live Events: RSVPs
--
-- Members RSVP to a scheduled live session, mirroring event_rsvps: attending is
-- just row presence (RSVP inserts, cancel deletes), no going/interested states.
-- The RSVP list drives "X going" on the card and (Phase B) the pre-start
-- reminder audience. community_id is denormalised for a single-hop membership
-- check in RLS. Safe to re-run.
-- =============================================================================

create table if not exists public.live_session_rsvps (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (session_id, user_id)
);

create index if not exists idx_live_session_rsvps_session on public.live_session_rsvps (session_id);

alter table public.live_session_rsvps enable row level security;

-- Visible to anyone who can view the session's space (same audience that can
-- see the session itself).
drop policy if exists "live_session_rsvps_select" on public.live_session_rsvps;
create policy "live_session_rsvps_select" on public.live_session_rsvps
  for select to authenticated
  using (
    exists (
      select 1 from public.live_sessions ls
      where ls.id = session_id
        and public.can_view_space(ls.space_id, auth.uid())
    )
  );

-- Only active members can RSVP, and only for themselves.
drop policy if exists "live_session_rsvps_insert_self" on public.live_session_rsvps;
create policy "live_session_rsvps_insert_self" on public.live_session_rsvps
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and public.is_community_member(community_id, auth.uid())
  );

drop policy if exists "live_session_rsvps_delete_self" on public.live_session_rsvps;
create policy "live_session_rsvps_delete_self" on public.live_session_rsvps
  for delete to authenticated
  using (user_id = auth.uid());
