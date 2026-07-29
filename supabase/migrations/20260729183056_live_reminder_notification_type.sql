-- =============================================================================
-- Relate — notification type for Live Events reminders (Phase B)
--
-- 'live_reminder' is sent by the scheduled job in the next migration to members
-- who RSVP'd, shortly before a scheduled session starts. Enum values must be
-- committed before anything references them, so this lives in its own migration
-- ahead of the function. Emailed by default; opt out per-type in Settings.
-- Idempotent.
-- =============================================================================

alter type public.notification_type add value if not exists 'live_reminder';
