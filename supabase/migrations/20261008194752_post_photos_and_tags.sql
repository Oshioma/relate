-- Posts can carry several photos and a few topic tags (the feed's "First
-- harvest" card: three photos, #Chillies #First harvest).
--
--   extra_media_urls — photos after the first. media_url stays the lead
--                      item, so everything that already reads it (map popups,
--                      space covers, feed thumbnails) keeps working unchanged.
--   tags             — short free-text topics, shown as chips.
--
-- Writes go through the existing posts insert/update policies.

alter table public.posts
  add column if not exists extra_media_urls text[] not null default '{}',
  add column if not exists tags text[] not null default '{}';

alter table public.posts
  drop constraint if exists posts_extra_media_urls_max,
  add constraint posts_extra_media_urls_max check (coalesce(array_length(extra_media_urls, 1), 0) <= 3),
  drop constraint if exists posts_tags_max,
  add constraint posts_tags_max check (coalesce(array_length(tags, 1), 0) <= 5);
