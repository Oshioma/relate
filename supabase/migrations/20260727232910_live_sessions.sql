-- =============================================================================
-- Relate — Live Events: live_sessions
--
-- Run after space_type 'live' exists (see 20260727232908_live_space_type.sql).
-- Safe to re-run.
--
-- A space with space_type = 'live' hosts live video sessions. Staff start a
-- session (status 'live'); members who can view the space join an embedded
-- video meeting keyed by room_name; staff end it (status 'ended'). Ended rows
-- stay as a simple history of past live events.
--
-- Unlike Courses there's no content hierarchy and no per-learner progress — a
-- session is a single row. Authoring (start/end) is staff-only, mirroring
-- is_community_staff; joining needs no row of its own (the meeting itself is
-- the participation), so there's no member self-service table here.
--
-- community_id is denormalised onto the table (as Courses/Challenges do) purely
-- to keep the RLS staff checks a single hop.
-- =============================================================================

create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  started_by uuid references public.profiles (id) on delete set null,
  title text not null,
  -- The room name handed to the video provider (meet.jit.si). Anyone who can
  -- read this row (see RLS) can join the meeting, so at the video layer the
  -- string itself is the join secret — it must stay long and unguessable. It's
  -- generated server-side (see live-events-actions.ts), never user-supplied.
  room_name text not null unique,
  status text not null default 'live',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  constraint live_session_status_check check (status in ('live', 'ended'))
);

create index if not exists idx_live_sessions_space on public.live_sessions (space_id, created_at desc);

-- At most one live session per space at a time — a second "Go live" while one
-- is running would split the audience across two rooms.
create unique index if not exists uniq_live_sessions_one_live_per_space
  on public.live_sessions (space_id)
  where status = 'live';

alter table public.live_sessions enable row level security;

-- Sessions are visible to anyone who can view the space (members, and guests on
-- a public space) — that's who gets the room name to join.
drop policy if exists "live_sessions_select" on public.live_sessions;
create policy "live_sessions_select" on public.live_sessions
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

-- Only staff (owner/admin/moderator) start, end or delete a session.
drop policy if exists "live_sessions_manage_staff" on public.live_sessions;
create policy "live_sessions_manage_staff" on public.live_sessions
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));
