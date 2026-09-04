-- =============================================================================
-- Relate — "Design & Technology" becomes "Design & Tech"
--
-- The subject list is closed on purpose, and its names are shown as tiles in
-- the lesson library. "Design & Technology" was the longest of them by some way
-- and pushed the row of tiles onto a second line on its own.
--
-- normaliseSubject already folds the old name onto the new one, so nothing
-- would have broken without this. But the name is stored twice — the
-- denormalised `subject` column that the library groups on, and the copy inside
-- the lesson document that the editor's subject picker reads. Left alone, the
-- editor would open on a lesson whose subject matches none of the options it
-- offers, and quietly change it on the next save.
--
-- Both are updated here so the data says what the app says.
--
-- Safe to re-run: matches only the old name, which after the first run no
-- longer exists.
-- =============================================================================

update public.space_lessons
set subject = 'Design & Tech'
where subject = 'Design & Technology';

update public.space_lessons
set lesson = jsonb_set(lesson, '{subject}', '"Design & Tech"'::jsonb)
where lesson->>'subject' = 'Design & Technology';
