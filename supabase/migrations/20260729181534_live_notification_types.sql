-- =============================================================================
-- Relate — notification types for Live Events
--
-- Adds two notification_type values used by the triggers in the next migration:
--   live_event    — a new live event has been scheduled (fan-out to members)
--   live_started  — a scheduled/ad-hoc session just went live ("join now")
--
-- Enum values must be committed before anything references them, so they live
-- in their own migration ahead of the trigger functions. Both are emailed by
-- default (the email_notification() trigger only defaults 'post' to off), and
-- members can opt out per-type from Settings. Idempotent.
-- =============================================================================

alter type public.notification_type add value if not exists 'live_event';
alter type public.notification_type add value if not exists 'live_started';
