-- =============================================================================
-- Relate — allow space_type = 'meetups' at the CHECK-constraint level
--
-- Rebuilds spaces_space_type_check with the full set including 'meetups', for
-- deployments guarding the column with a TEXT CHECK rather than the enum.
-- Idempotent.
-- =============================================================================

alter table public.spaces drop constraint if exists spaces_space_type_check;

alter table public.spaces add constraint spaces_space_type_check
  check (space_type::text in (
    'discussion', 'journal', 'gallery', 'resources', 'directory', 'challenges',
    'growth_journey', 'qa', 'custom', 'map', 'marketplace', 'business_directory',
    'guides', 'clubs', 'volunteer_hub', 'jobs', 'accommodation', 'recommendations',
    'course', 'crop_guides', 'plant_scanner', 'my_crops', 'plant_id', 'live',
    'meetups'
  ));
