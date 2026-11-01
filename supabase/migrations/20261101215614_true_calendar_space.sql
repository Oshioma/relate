-- =============================================================================
-- Relate — The True Calendar space in Squidge Over Skool
--
-- Adds the space to the homeschool community, members-only like its other
-- spaces (Oshi's choice, 2026-11-01), filed under Learn where that community
-- has the section. Skipped when the community doesn't exist (a fresh local
-- database) or already has the space. Safe to re-run.
-- =============================================================================

insert into public.spaces (community_id, name, slug, description, visibility, space_type, sort_order, show_in_nav, nav_group)
select
  c.id,
  'The True Calendar',
  'the-true-calendar',
  'Two calendars. One day. Many civilisations. Today in the Gregorian calendar beside the 13-month International Fixed Calendar or the true astronomical lunar calendar, with the Moon as it really is.',
  'members',
  'true_calendar',
  coalesce((select max(s.sort_order) + 1 from public.spaces s where s.community_id = c.id), 0),
  true,
  case when exists (
    select 1 from public.community_nav_groups g where g.community_id = c.id and g.key = 'learn'
  ) then 'learn' end
from public.communities c
where c.slug = 'squidgeoverskool'
  and not exists (
    select 1 from public.spaces s where s.community_id = c.id and s.slug = 'the-true-calendar'
  );
