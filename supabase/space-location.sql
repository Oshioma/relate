-- =============================================================================
-- Relate — per-space location override.
--
-- Safe to re-run. Adds `location_name` to `spaces` — no new table, no RLS
-- changes (spaces' existing policies already cover it).
--
-- Lets one space anchor its live data to a different place than the
-- community: a Zanzibar-wide community can point its Tides & Weather space
-- at "Nungwi" for accurate local tides while everything else stays
-- community-wide. Null means "use the community's location", which keeps
-- every existing space behaving exactly as before. Only the Tides & Weather
-- panel reads it today, but the column is deliberately generic — any future
-- space-scoped feature that needs a place (a per-space map, a
-- neighbourhood feed) should reuse it rather than adding its own.
-- =============================================================================

alter table public.spaces add column if not exists location_name text;
