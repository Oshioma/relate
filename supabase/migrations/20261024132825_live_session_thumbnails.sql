-- =============================================================================
-- Relate — Live Events: a picture from the session for the Past sessions card
--
-- Sessions aren't recorded, so there's no video file to take a frame from.
-- Instead, while a host is in the room, their browser grabs a still of the
-- main video a few times (the meeting's own screenshot command) and saves the
-- latest one here. The Past sessions card shows it; sessions without one keep
-- the camera placeholder (or the cover image, when one was set).
--
-- The picture lives in the public 'uploads' bucket for spaces anyone can open,
-- and in the private 'space-files' bucket (served via /api/files) otherwise.
-- Safe to re-run.
-- =============================================================================

alter table public.live_sessions
  add column if not exists thumbnail_url text;
