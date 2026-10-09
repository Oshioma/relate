-- Background video for a community's signed-out landing page (/welcome/<slug>),
-- separate from the feed hero's (hero_background_video_url), so a community can
-- have a clip on one and the still cover photo on the other.
--
--   landing_background_video_url — a short muted MP4/WebM clip looping behind the
--   landing page's headline on wide screens. The page's hero photo stays its
--   poster and the phone / reduced-motion fallback.

alter table public.communities
  add column if not exists landing_background_video_url text;

alter table public.communities
  drop constraint if exists communities_landing_background_video_url_http,
  add constraint communities_landing_background_video_url_http
    check (landing_background_video_url is null or landing_background_video_url ~* '^https?://');
