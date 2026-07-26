-- =============================================================================
-- Relate — "My Crops" as its own space type (enum)
--
-- Adds 'my_crops' to the public.space_type enum so a community (farming ones by
-- default) can have a dedicated space showing a member's own crops from the
-- shamba.online farm app. Mirrors how 'crop_guides' / 'plant_scanner' were
-- added; the CHECK-constraint rebuild is in the next migration. Safe to re-run.
-- =============================================================================

alter type public.space_type add value if not exists 'my_crops';
