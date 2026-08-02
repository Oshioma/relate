-- =============================================================================
-- Relate — notification type for 1:1 direct (inbox) messages
--
-- Adds 'direct_message': the in-app notification a member receives when another
-- member sends them a direct message (e.g. via the "Message business" button or
-- the member directory). Like every notification it shows in the bell in-app;
-- the existing email_notification() trigger emails a copy — carrying the message
-- text and a link straight to the conversation — unless the recipient has opted
-- this type out (opt-out, default on), and the push trigger mirrors it. No new
-- plumbing beyond the enum value: the sendMessage server action inserts an
-- ordinary notifications row and the existing pipelines do the rest. Idempotent.
-- =============================================================================

alter type public.notification_type add value if not exists 'direct_message';
