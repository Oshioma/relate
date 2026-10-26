-- =============================================================================
-- Homepage photos, chosen by the super admin
--
-- Until now the platform homepage took its pictures from the featured
-- communities' covers in the order they were featured, so which photo landed
-- where was an accident of that order. These let Platform admin → Homepage
-- pick them:
--
--   hero_community_id  the community shown in the hero's browser-and-phone
--                      preview (its cover, logo, name and tagline). Must be
--                      public to appear; null = the first featured one with a
--                      cover, as before.
--   why_photo_url      the photo beside "Powerful community tools".
--   closing_photo_url  the photo behind "Start your community today".
--                      Null = picked from the featured communities' covers, as
--                      before.
--
-- On the platform_settings singleton, which is already public-read and
-- super-admin-write.
-- =============================================================================

alter table public.platform_settings
  add column if not exists hero_community_id uuid references public.communities (id) on delete set null,
  add column if not exists why_photo_url text,
  add column if not exists closing_photo_url text;
