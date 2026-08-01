-- Per-community accent colour. The app's accent is a global token in
-- globals.css (a forest green); a community that wants to look like the place
-- it's about — a Zanzibar community in lagoon teal, say — can now override it
-- for its own pages. Null = inherit the platform accent, which is what every
-- existing community does.
--
-- Stored as a 6-digit hex string so it can be dropped straight into a CSS
-- custom property. The check constraint is the real guard: this value ends up
-- inside a style attribute, and anything that isn't a colour literal has no
-- business being there. The app normalises input before writing (see
-- src/lib/accent-color.ts), but the column refuses malformed values whatever
-- the caller does.
--
-- No new RLS: `communities` already restricts updates to the owner and admins,
-- and this column rides along with the row like logo_url and cover_image_url.
alter table public.communities
  add column if not exists accent_color text;

alter table public.communities
  drop constraint if exists communities_accent_color_format;

alter table public.communities
  add constraint communities_accent_color_format
  check (accent_color is null or accent_color ~ '^#[0-9a-fA-F]{6}$');
