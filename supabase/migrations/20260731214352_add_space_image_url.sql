-- Cover art for spaces. A space can carry an optional image, surfaced on the
-- mobile "Explore" strip and the Spaces grid so the community reads as places,
-- not a list of icons. Null = no cover (callers fall back to the type icon).
--
-- The URL points at an already-public storage object (the community-assets
-- bucket), so no new RLS is needed here: spaces are already readable per their
-- existing visibility policies, and this column rides along with the row.
alter table public.spaces
  add column if not exists image_url text;
