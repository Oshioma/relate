-- =============================================================================
-- Relate — Plant ID as its own space type (enum)
--
-- Adds 'plant_id' to the public.space_type enum: a space where members upload a
-- photo to identify a plant (distinct from the Plant Health Scanner, which
-- diagnoses problems). CHECK-constraint rebuild is in the next migration. Safe
-- to re-run.
-- =============================================================================

alter type public.space_type add value if not exists 'plant_id';
