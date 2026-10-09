-- =============================================================================
-- Relate — notification type for "a mentor who suits you has joined"
--
-- Sent to beginners waiting in a guided-journey space when a mentor whose
-- experience matches what they want to do signs up. Its own migration because
-- Postgres won't use an enum value in the transaction that adds it; the
-- trigger that sends it lives in 20261009075455_journey_offers_and_waiting_list.sql.
-- Idempotent.
-- =============================================================================

alter type public.notification_type add value if not exists 'journey_mentor_available';
