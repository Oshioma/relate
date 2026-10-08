-- =============================================================================
-- Relate — enum values for the Guided Journey space type ("Adopt a Beginner")
--
-- A guided-journey space pairs an experienced member (a mentor) with a
-- beginner for one shared journey: a first crop, a first sail, a first five
-- meals. The space type is generic; each space carries its own terminology,
-- imagery, onboarding questions and milestones (see
-- 20261008191453_guided_journey_tables.sql and src/lib/guided-journey/).
--
-- Only enum values live here — Postgres refuses to use a value added in the
-- same transaction, so the CHECK rebuild, tables and triggers that reference
-- them come in later migrations:
--   * space_type 'guided_journey'
--   * notification_type
--       'journey_request'           a beginner asked a mentor for help
--       'journey_request_response'  the mentor accepted or declined
--       'journey_update'            a progress update or reply on a journey
--       'journey_completed'         a journey reached its finish
--       'journey_report'            a member reported something (to staff)
-- Idempotent.
-- =============================================================================

alter type public.space_type add value if not exists 'guided_journey';
alter type public.notification_type add value if not exists 'journey_request';
alter type public.notification_type add value if not exists 'journey_request_response';
alter type public.notification_type add value if not exists 'journey_update';
alter type public.notification_type add value if not exists 'journey_completed';
alter type public.notification_type add value if not exists 'journey_report';
