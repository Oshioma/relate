-- =============================================================================
-- Relate — Craft & Makers community kind marker.
--
-- The Craft & Makers template (communities.template_key = 'craft') seeds a
-- different starter set depending on which craft the community is built around:
-- a baking community wants a Recipe Box and a starter-lending shelf, a pottery
-- one wants kiln hire and firing schedules, a brewing one wants a batch log.
-- The seeded spaces already differ; this stores which craft was chosen so later
-- features (UI wording, the rituals a community is offered, analytics) can
-- differentiate them without inspecting the spaces.
--
-- Plain text, validated against CRAFT_KINDS at the application layer, exactly
-- like location_type, artist_mode, activity_kind and school_kind — so adding a
-- craft stays a code-only change. Null for every non-craft template.
-- =============================================================================

alter table public.communities
  add column if not exists craft_kind text;
