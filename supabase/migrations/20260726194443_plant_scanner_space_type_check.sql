-- =============================================================================
-- Relate — allow space_type = 'plant_scanner' at the CHECK-constraint level
--
-- Some deployments guard spaces.space_type with a TEXT CHECK constraint rather
-- than the enum. Rebuild it with the full set including 'plant_scanner' (and
-- 'crop_guides'). `space_type::text` keeps it correct either way. Idempotent.
-- =============================================================================

alter table public.spaces drop constraint if exists spaces_space_type_check;

alter table public.spaces add constraint spaces_space_type_check
  check (space_type::text in (
    'discussion', 'journal', 'gallery', 'resources', 'directory', 'challenges',
    'growth_journey', 'qa', 'custom', 'map', 'marketplace', 'business_directory',
    'guides', 'clubs', 'volunteer_hub', 'jobs', 'accommodation', 'recommendations',
    'course', 'crop_guides', 'plant_scanner'
  ));
