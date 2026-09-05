-- =============================================================================
-- Relate — a Lessons space says what it is for, not how it works
--
-- The school template seeded every Lessons space with "The teaching library:
-- paste source material, get an age-appropriate lesson to teach or print."
-- That describes the writer, and the writer is one button on the page. Since
-- the library now opens with its own hero, that line became the page's
-- subtitle — under a heading that already said "Lessons", above a second
-- heading that said it again.
--
-- This replaces that exact seeded sentence with the line the page uses. Only
-- that sentence: a space whose description was written or edited by an admin
-- is left alone, because it is theirs.
--
-- Safe to re-run — the second run matches nothing.
-- =============================================================================

update public.spaces
set description = 'Real learning for real life. Ideas, activities and inspiration from our community.'
where space_type = 'lessons'
  and description = 'The teaching library: paste source material, get an age-appropriate lesson to teach or print.';
