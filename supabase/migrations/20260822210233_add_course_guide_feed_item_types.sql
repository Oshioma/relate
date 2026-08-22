-- =============================================================================
-- Relate — courses and guides on the community feed
--
-- The feed carries twelve kinds of activity and a community's own teaching is
-- none of them: publish a course or write a guide and the front page says
-- nothing happened. For a community whose whole point is what it knows — a
-- gardening school, a growers' handbook — that is most of what it does, missing
-- from the one page everyone lands on.
--
-- The cards are built from the existing courses and guides tables, so this only
-- has to let a smile or a comment hang off them: feed_reactions/feed_comments
-- name their target as (item_type, item_id), and item_type is an enum that
-- doesn't know about either yet.
--
-- Postgres refuses to use an enum value added in the same transaction, so — as
-- with 'meetup' and 'review' — this migration adds the values and nothing else.
-- Idempotent.
-- =============================================================================

alter type public.feed_item_type add value if not exists 'course';
alter type public.feed_item_type add value if not exists 'guide';
