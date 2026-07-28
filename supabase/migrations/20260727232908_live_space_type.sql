-- =============================================================================
-- Relate — add space_type = 'live' (Live Events)
--
-- A space with space_type = 'live' hosts live video sessions ("Live Events"):
-- staff start a session, members join an embedded video meeting in-page. This
-- migration only adds the enum value — Postgres requires ADD VALUE to be
-- committed before any statement uses it, so it lives in its own migration
-- ahead of the CHECK rebuild and the live_sessions table. Idempotent.
-- =============================================================================

alter type public.space_type add value if not exists 'live';
