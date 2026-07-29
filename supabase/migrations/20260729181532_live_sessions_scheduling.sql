-- =============================================================================
-- Relate — Live Events: schedule ahead
--
-- Until now a live session was ad-hoc "go live now" only. This adds a
-- scheduled-ahead lifecycle: a session can be created with status 'scheduled'
-- and a scheduled_start, then transition 'scheduled' -> 'live' -> 'ended'.
-- Ad-hoc sessions still insert directly as 'live' with scheduled_start null.
-- Safe to re-run.
-- =============================================================================

alter table public.live_sessions
  add column if not exists scheduled_start timestamptz;

-- Allow the new 'scheduled' status alongside the existing ones.
alter table public.live_sessions drop constraint if exists live_session_status_check;
alter table public.live_sessions add constraint live_session_status_check
  check (status in ('scheduled', 'live', 'ended'));

-- Order the upcoming list by when each session is due to start.
create index if not exists idx_live_sessions_scheduled
  on public.live_sessions (space_id, scheduled_start);
