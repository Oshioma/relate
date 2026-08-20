-- =============================================================================
-- Relate — enum values for the Activity community type
--
-- The Activity template (hiking, running, cycling, padel, …) is built around
-- people going out together *now*, so it needs one genuinely new container: a
-- Meetups space ("Happening Now") where a member posts "walking Lion's Head at
-- 6pm, moderate pace, meeting at the gate" and others tap "I'm in".
--
-- This migration only adds enum values — Postgres refuses to use a value added
-- in the same transaction, so every value lives here, ahead of the CHECK
-- rebuild, the tables and the triggers that reference them:
--   * space_type 'meetups'      — the space itself
--   * notification_type 'meetup', 'meetup_join'
--                               — "a meetup was posted" / "someone's in"
--   * feed_item_type 'meetup'   — meetups on the community feed, with smiles
--                                 and comments like any other card
-- Idempotent.
-- =============================================================================

alter type public.space_type add value if not exists 'meetups';
alter type public.notification_type add value if not exists 'meetup';
alter type public.notification_type add value if not exists 'meetup_join';
alter type public.feed_item_type add value if not exists 'meetup';
