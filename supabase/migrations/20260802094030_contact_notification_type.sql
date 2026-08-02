-- =============================================================================
-- Relate — notification type for community contact-form messages
--
-- Adds 'contact': the in-app notification a community owner receives when
-- someone submits their community's contact form. Like every notification it
-- shows in the bell in-app; the existing email_notification() trigger emails a
-- copy unless the recipient has opted this type out (opt-out, default on), and
-- the push trigger mirrors it. No new plumbing beyond the enum value — the
-- contact server action inserts an ordinary notifications row and the existing
-- pipelines do the rest. Idempotent.
-- =============================================================================

alter type public.notification_type add value if not exists 'contact';
