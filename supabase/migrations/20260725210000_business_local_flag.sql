-- =============================================================================
-- Relate — Business Directory: "Local business" flag
--
-- A cross-cutting attribute, independent of category. Category answers what a
-- listing *does* (Restaurant, Café, Shop) and is single-select; is_local answers
-- whether it's a locally owned/run business and can be true for any category. So
-- a Restaurant marked local keeps category = 'restaurant' AND surfaces under a
-- "Local" filter — the two dimensions compose instead of competing.
--
-- Any member who can edit a listing can set this (covered by the existing
-- businesses update RLS); it isn't a privileged field like verified/featured,
-- so no new policy or trigger change is needed. Safe to re-run.
-- =============================================================================

alter table public.businesses
  add column if not exists is_local boolean not null default false;
