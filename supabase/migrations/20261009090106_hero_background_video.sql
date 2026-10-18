-- Background video for a community's feed hero.
--
--   hero_background_video_url — a short muted clip (MP4/WebM) that loops behind
--   the headline in place of the still cover photo, on screens wide enough
--   for it. The cover stays the poster and the phone / reduced-motion
--   fallback, so the hero still needs a cover to show the video at all.
--
-- Owners upload the clip to the community-assets bucket (same per-community
-- path rules as the logo and cover), so that bucket now also takes MP4/WebM
-- and allows files up to 30MB. Images stay capped at 8MB by the uploader.

alter table public.communities
  add column if not exists hero_background_video_url text;

alter table public.communities
  drop constraint if exists communities_hero_background_video_url_http,
  add constraint communities_hero_background_video_url_http
    check (hero_background_video_url is null or hero_background_video_url ~* '^https?://');

update storage.buckets
set
  file_size_limit = 31457280,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
where id = 'community-assets';
