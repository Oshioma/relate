-- =============================================================================
-- Relate — Business Directory: Google Places enrichment
--
-- Run this after supabase/business-directory.sql. Safe to re-run.
--
-- Businesses can be linked to their Google Place so the map popup (and later
-- the directory card) shows their live Google rating and a couple of review
-- snippets. The link is either set explicitly (google_place_id) or found
-- automatically on first popup open by a name + location Text Search — see
-- src/lib/google-places.ts.
--
-- The google_* columns are a short-lived cache, refreshed server-side (via
-- the service-role client) when google_synced_at goes stale. Google's Places
-- policy allows caching place IDs indefinitely but other content only
-- temporarily, so the sync window is kept to hours, not weeks, and reviews
-- are always rendered with Google attribution.
-- =============================================================================

alter table public.businesses add column if not exists google_place_id text;
alter table public.businesses add column if not exists google_rating numeric(2,1);
alter table public.businesses add column if not exists google_review_count integer;
-- Array of { author, author_photo_url, rating, text, relative_time } — see
-- BusinessGoogleReview in src/types/database.ts.
alter table public.businesses add column if not exists google_reviews jsonb;
alter table public.businesses add column if not exists google_maps_url text;
alter table public.businesses add column if not exists google_synced_at timestamptz;
