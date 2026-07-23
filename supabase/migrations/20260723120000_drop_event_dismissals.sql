-- =============================================================================
-- Relate — drop event dismissals
--
-- Reverts 20260723110000_event_dismissals.sql: deleting an event was made to
-- permanently block AI discovery from ever re-adding a matching title, but
-- that's not the wanted behavior — a deleted event should be able to
-- reappear on a later discovery run. Safe to re-run.
-- =============================================================================

drop table if exists public.event_dismissals;
