-- =============================================================================
-- Relate — Plant Health Scanner as its own space type (enum)
--
-- Adds 'plant_scanner' to the public.space_type enum so a community (farming
-- communities get it by default) can add a dedicated Plant Health Scanner
-- space. Mirrors how 'crop_guides' and 'course' were added; the CHECK-constraint
-- rebuild is in the next migration. Kept in its own migration so the value is
-- committed before anything uses it. Safe to re-run.
-- =============================================================================

alter type public.space_type add value if not exists 'plant_scanner';
