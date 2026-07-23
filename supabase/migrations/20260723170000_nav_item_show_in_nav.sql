-- Per-community "show in navigation" for the built-in nav items (Events,
-- Search), mirroring public.spaces.show_in_nav.
--
-- Until now the only way to hide Events or Search from the sidebar was the
-- owner-only feature toggle (community_feature_prefs), which turns the whole
-- feature off — page, mobile tab and sidebar link together. Spaces, by
-- contrast, have a per-item "Show in navigation" checkbox that hides the link
-- while leaving the space reachable. This column gives the built-in links the
-- same behaviour: a false value hides the link from the sidebar and mobile tab
-- bar while the feature (and its page) stays enabled.
--
-- Defaults to true, so existing rows — created only for reordering — keep
-- showing their link. A missing row still means "unpositioned and visible".

alter table public.community_nav_item_order
  add column if not exists show_in_nav boolean not null default true;
