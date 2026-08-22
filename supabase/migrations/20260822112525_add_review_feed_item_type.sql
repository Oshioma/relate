-- =============================================================================
-- Relate — reviews on the community feed
--
-- A review is the most considered thing a member writes about a place, and
-- until now it was only visible to whoever happened to open that listing. It
-- belongs on the feed alongside "Restaurant added" and "Meetup" — that's how
-- the rest of the community learns the new café is worth the walk.
--
-- The feed card is built from place_reviews (and the legacy per-facet review
-- tables for listings that never got a place), so no new storage is needed.
-- What is needed is permission to hang a smile or a comment off that card:
-- feed_reactions/feed_comments name their target as (item_type, item_id), and
-- item_type is an enum that doesn't know about reviews yet.
--
-- Postgres refuses to use an enum value added in the same transaction, so —
-- as with the meetup values — this migration adds the value and nothing else.
-- Idempotent.
-- =============================================================================

alter type public.feed_item_type add value if not exists 'review';
