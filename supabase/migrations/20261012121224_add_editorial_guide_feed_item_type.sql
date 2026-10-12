-- =============================================================================
-- Relate — editorial guides on the community feed
--
-- A published editorial guide (public.editorial_guides, e.g. "Where to Stay in
-- Zanzibar") now gets a card on its community's feed. Like every other feed
-- card it can carry reactions and comments, which name their target as
-- (item_type, item_id), so the enum needs a value for it.
--
-- Postgres refuses to use an enum value added in the same transaction, so — as
-- with 'course' and 'guide' — this migration adds the value and nothing else.
-- Idempotent.
-- =============================================================================

alter type public.feed_item_type add value if not exists 'editorial_guide';
