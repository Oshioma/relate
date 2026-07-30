-- Musician / Artist community mode marker.
--
-- The Musician / Artist template (communities.template_key = 'fanclub') seeds
-- either a fan community or an artist collective. The seeded spaces already
-- differ, but the community row itself didn't record which mode was chosen —
-- this stores it so later features can differentiate the two (UI, analytics,
-- feature gating) without inspecting the spaces.
--
-- Plain text, validated against ARTIST_MODES at the application layer, exactly
-- like location_type — so adding a mode stays a code-only change. Null for
-- every non-artist template and for artist communities created before this.

alter table public.communities
  add column if not exists artist_mode text;
