-- Which part of the cover photo to keep when it's cropped.
--
-- The feed header crops the cover to a wide band and lays a text panel over
-- its foot, so whatever sits low in the photo is either cropped away or ends
-- up behind the text. Which part matters is a property of the photograph, not
-- something the app can pick: a jetty in the lower half wants the image pushed
-- up, a sky-heavy shot wants it pulled down. This is the owner's call, so it's
-- stored per community.
--
-- Maps to the CSS object-position of the cover image. Null = 'center', which
-- is the current behaviour, so existing communities are unaffected.
--
-- No new RLS: `communities` already restricts updates to the owner and admins,
-- and this column rides along with the row like cover_image_url itself.
alter table public.communities
  add column if not exists cover_position text;

alter table public.communities
  drop constraint if exists communities_cover_position_valid;

alter table public.communities
  add constraint communities_cover_position_valid
  check (cover_position is null or cover_position in ('top', 'center', 'bottom'));
