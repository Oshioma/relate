-- =============================================================================
-- Relate — School communities, Stage 1: register the 'lessons' space type (enum)
--
-- Adds 'lessons' to the public.space_type enum, mirroring how 'crop_guides' and
-- 'course' were added. The matching CHECK-constraint rebuild lives in the next
-- migration, because some deployments guard spaces.space_type with a TEXT check
-- rather than the enum. Kept in its own migration so the new value is committed
-- before any later migration uses it. Safe to re-run.
--
-- A Lessons space is a school community's teaching library: staff paste source
-- material, Claude writes an age-appropriate lesson from it, and every member
-- who can see the space can read, print and re-use it. The backing table lands
-- in 20260904181544_space_lessons.sql.
--
-- Deliberately NOT the Courses space type: a course is an enrolled, sequential
-- program with progress and certificates. A lesson is one self-contained thing
-- a teacher hands out on a Tuesday.
-- =============================================================================

alter type public.space_type add value if not exists 'lessons';
