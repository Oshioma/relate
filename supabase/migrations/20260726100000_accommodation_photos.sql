-- =============================================================================
-- Relate — Accommodation: multiple photos per listing
--
-- Follow-up to accommodation.sql. A listing carried a single `photo_url`; hosts
-- want to show a place from several angles, so add a `photo_urls text[]` gallery.
-- The first entry is the cover, and `photo_url` stays as the denormalised cover
-- (kept in sync with photo_urls[1] by the app) so the feed, Explore Map popups
-- and any existing readers keep working without a join. Mirrors the
-- "businesses.image_url stays as a denormalised cover" split from
-- business_directory_enhancements.sql, but folded into an array column because
-- accommodation is a single-table feature with no per-photo crop framing.
--
-- Safe to re-run.
-- =============================================================================

alter table public.accommodation_listings
  add column if not exists photo_urls text[] not null default '{}';

-- Backfill: seed the gallery from each listing's existing single cover so the
-- first photo shown keeps matching today's card thumbnail.
update public.accommodation_listings
set photo_urls = array[photo_url]
where photo_url is not null
  and (photo_urls is null or cardinality(photo_urls) = 0);
