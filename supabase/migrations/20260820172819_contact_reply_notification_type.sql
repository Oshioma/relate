-- =============================================================================
-- Relate — notification type for a staff reply to a contact message
--
-- Adds 'contact_reply': the in-app notification the *sender* of a contact-form
-- message receives when a community's staff answers it from the inbox. The
-- reply text rides in the notification body, so the existing email_notification
-- trigger mails a copy and the push trigger mirrors it — no new plumbing. A
-- sender who wasn't signed in has no account to notify; the reply action emails
-- those directly instead.
--
-- Enum values must be added in their own migration: a value added and used in
-- the same transaction is not visible to it.
-- =============================================================================

alter type public.notification_type add value if not exists 'contact_reply';
