-- =============================================================================
-- Relate — sidebar sections
--
-- A community's nav is a flat list in the admin's own order. That reads fine
-- with six spaces and badly with sixteen. This lets an admin file each space
-- under Home, Learn or Connect, and the sidebar draws headings for whichever
-- groups are in use.
--
-- Opt-in, and additive in the strict sense: null means ungrouped, every space
-- starts null, and a community where nothing is grouped renders exactly the
-- flat list it always did. The admin's sort_order still orders spaces within a
-- group — a group sections the nav, it does not reorder it.
--
-- No policy is added or changed. Setting a group is an update on spaces, which
-- spaces_update_admin already restricts to community admins, and the column is
-- covered by that policy the moment it exists.
--
-- Safe to re-run.
-- =============================================================================

alter table public.spaces
  add column if not exists nav_group text;

comment on column public.spaces.nav_group is
  'Sidebar section: home, learn or connect. Null = ungrouped, which renders in a trailing unlabelled section. See src/lib/nav-groups.ts.';

-- A closed set, so a typo cannot invent a fourth heading that appears once and
-- confuses everybody.
alter table public.spaces
  drop constraint if exists spaces_nav_group_allowed;
alter table public.spaces
  add constraint spaces_nav_group_allowed
  check (nav_group is null or nav_group in ('home', 'learn', 'connect'));

-- --- One-time backfill, schools only -----------------------------------------
--
-- School communities get sensible groups now, because a homeschool nav is
-- exactly the case this was built for and asking somebody to file sixteen
-- spaces by hand before seeing any benefit is a poor trade.
--
-- Every other community is left ungrouped and therefore visually unchanged —
-- their admins can opt in space by space. And nothing already grouped is
-- touched, so a re-run is a no-op.
update public.spaces s
set nav_group = case s.space_type
  when 'discussion' then 'home'
  when 'gallery' then 'home'
  when 'growth_journey' then 'home'
  when 'custom' then 'home'

  when 'lessons' then 'learn'
  when 'course' then 'learn'
  when 'guides' then 'learn'
  when 'resources' then 'learn'
  when 'qa' then 'learn'
  when 'challenges' then 'learn'
  when 'crop_guides' then 'learn'
  when 'plant_scanner' then 'learn'
  when 'plant_id' then 'learn'
  when 'journal' then 'learn'
  when 'my_crops' then 'learn'

  when 'clubs' then 'connect'
  when 'meetups' then 'connect'
  when 'directory' then 'connect'
  when 'live' then 'connect'
  when 'business_directory' then 'connect'
  when 'marketplace' then 'connect'
  when 'jobs' then 'connect'
  when 'accommodation' then 'connect'
  when 'recommendations' then 'connect'
  when 'volunteer_hub' then 'connect'
  when 'map' then 'connect'
end
from public.communities c
where c.id = s.community_id
  and c.school_kind is not null
  and s.nav_group is null;
