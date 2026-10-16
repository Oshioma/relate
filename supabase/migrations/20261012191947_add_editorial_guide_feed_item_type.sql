-- =============================================================================
-- Relate — editorial guides on the community feed
--
-- Publishing an editorial guide (e.g. "Where to Stay in Zanzibar") should show
-- on the community's front page like any other new guide, with its hero photo.
-- The card is built from editorial_guides; this only lets a smile or a comment
-- hang off it: feed_reactions/feed_comments name their target as
-- (item_type, item_id), and item_type is an enum that doesn't know this kind.
--
-- Postgres refuses to use an enum value added in the same transaction, so — as
-- with 'course' and 'guide' — this migration adds the value and nothing else.
-- Idempotent.
-- =============================================================================

alter type public.feed_item_type add value if not exists 'editorial_guide';
