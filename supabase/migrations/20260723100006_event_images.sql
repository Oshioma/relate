-- =============================================================================
-- Relate — event images
--
-- Run this after supabase/schema.sql. Safe to re-run.
--
-- Optional cover image for an event: scraped from the event's source listing
-- when AI discovery finds it. Mirrors businesses.image_url.
-- =============================================================================

alter table public.events add column if not exists image_url text;
