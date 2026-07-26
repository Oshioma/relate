-- =============================================================================
-- Relate — Accommodation: drop the legacy photo_url cover column
--
-- photo_urls (added in accommodation_photos.sql) is now the single source of
-- truth for a listing's gallery, and every reader (card, detail, feed, Explore
-- Map) uses photo_urls[0] as the cover. photo_url was kept as a denormalised
-- cover during the transition and backfilled into photo_urls, so it's safe to
-- drop. Safe to re-run.
-- =============================================================================

-- Belt and braces: make sure nothing was left only in photo_url before dropping.
update public.accommodation_listings
set photo_urls = array[photo_url]
where photo_url is not null
  and (photo_urls is null or cardinality(photo_urls) = 0);

alter table public.accommodation_listings drop column if exists photo_url;
