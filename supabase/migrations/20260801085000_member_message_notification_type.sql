-- =============================================================================
-- Relate — notification type for staff messages to members
--
-- Adds 'member_message': a message a community host sends to hand-picked
-- members. Like every notification it always shows in the bell in-app; the
-- existing email_notification() trigger emails a copy unless the recipient has
-- turned this type off in Settings (opt-out, default on) — so a member can keep
-- just the in-app copy. No new plumbing needed beyond the enum value; the
-- server action inserts ordinary notifications rows and the email pipeline does
-- the rest. Idempotent.
-- =============================================================================

alter type public.notification_type add value if not exists 'member_message';
