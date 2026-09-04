-- =============================================================================
-- Relate — remove the lesson homework tables
--
-- Sending a lesson home was built and then not wanted: the panel sat at the top
-- of every lesson page offering something nobody was going to use, and a
-- teaching library is better without it. The UI, actions and data layer are
-- gone in the same change; these tables are the rest of it.
--
-- This DROPS DATA. Anything set as homework, and every completion ticked
-- against it, goes with the tables. That is the point of removing a feature
-- rather than hiding it, but it is not recoverable — if any of it mattered,
-- copy it out before applying this.
--
-- Nothing else references either table: space_lessons has no column pointing at
-- them, so removing them leaves the library exactly as it was.
--
-- Safe to re-run.
-- =============================================================================

-- Completions first: they reference lesson_homework.
drop table if exists public.lesson_homework_completions;
drop table if exists public.lesson_homework;
