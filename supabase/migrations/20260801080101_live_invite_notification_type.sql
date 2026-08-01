-- =============================================================================
-- Relate — notification type for personal Live Event invites
--
-- Adds the 'live_invite' notification_type used by the trigger in the next
-- migration (20260801080102_live_session_invites.sql). Unlike 'live_event' /
-- 'live_started', which broadcast to the whole space, this fires only for the
-- specific members a host hand-picks to invite.
--
-- Enum values must be committed before anything references them, so — exactly
-- like the existing live_notification_types migration — the value lands in its
-- own migration ahead of the table and trigger. Emailed by default (the
-- email_notification() trigger only defaults 'post' off) and opt-out per-type
-- from Settings. Idempotent.
-- =============================================================================

alter type public.notification_type add value if not exists 'live_invite';
