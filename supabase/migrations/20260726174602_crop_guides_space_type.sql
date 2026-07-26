-- =============================================================================
-- Relate — Crop Guides, Stage 1: register the 'crop_guides' space type (enum)
--
-- Adds 'crop_guides' to the public.space_type enum, mirroring how 'course' and
-- the place-based types were added (see courses.sql / place-community.sql).
-- The matching CHECK-constraint rebuild lives in the next migration, because
-- some deployments guard spaces.space_type with a TEXT check rather than the
-- enum. Kept in its own migration so the new value is committed before any
-- later migration uses it. Safe to re-run.
--
-- A Crop Guides space is the entry point to the community's growing knowledge
-- engine: a browsable, searchable library of organic crop guides. The backing
-- tables land in 20260726174604_crop_guides.sql.
-- =============================================================================

alter type public.space_type add value if not exists 'crop_guides';
