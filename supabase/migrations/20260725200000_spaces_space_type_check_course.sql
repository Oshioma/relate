-- =============================================================================
-- Relate — allow space_type = 'course' at the CHECK-constraint level
--
-- Some deployments store spaces.space_type as TEXT guarded by a CHECK
-- constraint (spaces_space_type_check) rather than the public.space_type enum.
-- On those databases, adding the 'course' enum value (see the courses
-- migration) is not enough — inserting a Courses space still fails the CHECK.
--
-- This rebuilds the constraint with the full set of space types the app uses,
-- including 'course'. `space_type::text` keeps it correct whether the column is
-- text or the enum. Idempotent and safe to re-run.
-- =============================================================================

alter table public.spaces drop constraint if exists spaces_space_type_check;

alter table public.spaces add constraint spaces_space_type_check
  check (space_type::text in (
    'discussion', 'journal', 'gallery', 'resources', 'directory', 'challenges',
    'growth_journey', 'qa', 'custom', 'map', 'marketplace', 'business_directory',
    'guides', 'clubs', 'volunteer_hub', 'jobs', 'accommodation', 'recommendations', 'course'
  ));
