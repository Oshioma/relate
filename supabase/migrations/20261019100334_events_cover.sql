-- =============================================================================
-- Relate — an uploaded cover for the Events page
--
-- communities.events_cover_url
--   The photo across the top of the community's Events page. Null shows the
--   default event photo, as before. Events is a built-in page, not a space, so
--   it has no spaces.image_url to keep its cover in. Written by community
--   admins under the existing communities_update_admin policy; the file lives
--   in the community-assets bucket like every other community picture.
--
-- Additive. Safe to re-run.
-- =============================================================================

alter table public.communities
  add column if not exists events_cover_url text;
