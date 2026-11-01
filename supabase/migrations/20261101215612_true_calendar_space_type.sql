-- =============================================================================
-- Relate — enum value for The True Calendar space type
--
-- A True Calendar space shows two synchronised calendars for one selected day
-- (Gregorian beside the International Fixed Calendar or an astronomical lunar
-- calendar) with the Moon's real phase, eclipses, equinoxes and rise/set
-- times. All of that is calculated in the browser
-- (src/lib/true-calendar/), so the space needs no tables of its own yet.
--
-- Only the enum value lives here — Postgres refuses to use a value added in
-- the same transaction, so the CHECK rebuild and the space row come in the
-- next two migrations. Idempotent.
-- =============================================================================

alter type public.space_type add value if not exists 'true_calendar';
