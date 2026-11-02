-- =============================================================================
-- The True Calendar: how a date is known, and where sources disagree.
--
-- calendar_date_correspondences.date_status says what kind of date a listed
-- Gregorian date is, so a secondary listing or a provisional conversion is
-- never shown as an official one:
--   official             an official announcement (e.g. a palace or council)
--   published_secondary  a published listing that is not the official one
--   astronomical         calculated from the sky
--   culturally_verified  a conversion confirmed with the community
--   provisional          a conversion that still needs confirming
--   unknown_disputed     the date itself is unknown or disputed
-- Left empty, a listed date is treated as a secondary listing.
--
-- calendar_recommendations.conflict_group ties together practices that
-- disagree (e.g. one account calls a night good for planting, another
-- unfavourable), so the interface shows them side by side and never merges
-- them into one instruction.
--
-- Safe to re-run.
-- =============================================================================

alter table public.calendar_date_correspondences add column if not exists date_status text;
alter table public.calendar_date_correspondences drop constraint if exists calendar_date_correspondences_date_status_check;
alter table public.calendar_date_correspondences add constraint calendar_date_correspondences_date_status_check
  check (date_status is null or date_status in ('official', 'published_secondary', 'astronomical', 'culturally_verified', 'provisional', 'unknown_disputed'));

alter table public.calendar_recommendations add column if not exists conflict_group text;
create index if not exists idx_calendar_recommendations_conflict_group on public.calendar_recommendations (conflict_group) where conflict_group is not null;
