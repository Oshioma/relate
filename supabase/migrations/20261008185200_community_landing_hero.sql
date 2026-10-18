-- Landing-page hero for a community's feed (/c/<slug>):
--   tagline           — the big headline over the cover ("Grow food. Share
--                       knowledge."). Null = the hero falls back to the name.
--   hero_video_url    — an optional "Watch video" link (YouTube, Vimeo, …).
--   featured_space_id — a space promoted in the feed sidebar's photo card
--                       ("Adopt a Beginner"). Cleared if the space is deleted.
-- Writes go through the existing communities update policy (owner/admins).

alter table public.communities
  add column if not exists tagline text,
  add column if not exists hero_video_url text,
  add column if not exists featured_space_id uuid references public.spaces(id) on delete set null;

alter table public.communities
  drop constraint if exists communities_tagline_length,
  add constraint communities_tagline_length check (tagline is null or char_length(tagline) <= 140),
  drop constraint if exists communities_hero_video_url_http,
  add constraint communities_hero_video_url_http check (hero_video_url is null or hero_video_url ~* '^https?://');
