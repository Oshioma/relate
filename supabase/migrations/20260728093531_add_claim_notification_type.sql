-- =============================================================================
-- Relate — add the 'claim' notification type
--
-- Business-directory ownership claims notify staff (a new claim to review) and
-- the claimant (their claim was approved/rejected). Both use this new enum
-- value. Adding it lives in its own migration because a new enum value can't be
-- referenced in the same transaction that adds it — the trigger functions that
-- use it are in the following migration. Safe to re-run.
-- =============================================================================

alter type public.notification_type add value if not exists 'claim';
