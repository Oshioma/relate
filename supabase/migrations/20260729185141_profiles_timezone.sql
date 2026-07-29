-- =============================================================================
-- Relate — per-member timezone
--
-- Stores each member's IANA timezone (e.g. 'Africa/Nairobi'), captured from the
-- browser. Used to format server-generated notification text (Live Events
-- schedule + reminder) in the recipient's own local time instead of UTC. Null
-- until captured; formatting falls back to UTC. Safe to re-run.
-- =============================================================================

alter table public.profiles
  add column if not exists timezone text;
