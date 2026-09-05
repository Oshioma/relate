-- =============================================================================
-- Relate — two school spaces filed where they belong
--
-- The nav_group backfill filed spaces by space_type, and two of the school
-- template's own spaces came out wrong for a school:
--
--   Field Trips is a 'meetups' space, so it went to Connect. In a homeschool a
--   field trip is not a social occasion with a date on it — it is the lesson.
--   It belongs under Learn.
--
--   Family Chat is a 'discussion' space, so it went to Home. It is the place
--   families talk to each other, which is Connect.
--
-- WHY THIS IS NAME-MATCHED RATHER THAN A NEW RULE BY TYPE
-- A rule by space_type cannot express this. The same community has two
-- 'discussion' spaces — Family Chat and Curriculum Planning — that belong in
-- different sections, which is exactly why nav_group is a per-space setting
-- with a dropdown rather than something derived at render time. What CAN be
-- known is what the template itself created: these two names, with these two
-- types, in a school community, are the template's own spaces.
--
-- WHAT IT LEAVES ALONE
-- A space somebody has renamed does not match. A space of another type does
-- not match. A space whose section has already been changed does not match —
-- the guard requires the value still be the one the backfill set. And no other
-- community type is touched at all.
--
-- Safe to re-run: after the first run the guard no longer matches.
-- =============================================================================

update public.spaces s
set nav_group = 'learn'
from public.communities c
where c.id = s.community_id
  and c.school_kind is not null
  and s.name = 'Field Trips'
  and s.space_type = 'meetups'
  and s.nav_group = 'connect';

update public.spaces s
set nav_group = 'connect'
from public.communities c
where c.id = s.community_id
  and c.school_kind is not null
  and s.name = 'Family Chat'
  and s.space_type = 'discussion'
  and s.nav_group = 'home';
