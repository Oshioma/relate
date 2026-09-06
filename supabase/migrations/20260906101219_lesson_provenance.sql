-- =============================================================================
-- Relate — where a lesson came from, and what it was actually written under
--
-- Three columns, one idea: a lesson should be able to account for itself.
--
-- prompt_used
--   The system prompt AS SENT, recorded at generation time. The rules panel
--   currently rebuilds the prompt from the age band, which works for every
--   lesson ever written but has one flaw it has to admit on screen: change the
--   prompt later and an old lesson shows today's rules rather than the ones it
--   was written under. A stored copy is the true answer for anything written
--   from now on.
--
--   Deliberately NOT backfilled. Writing today's rebuilt prompt into older
--   rows would record a prompt those lessons were not written under, as though
--   it were the real one — worse than the panel honestly saying "rebuilt".
--   Null means "we don't have the original", and the panel says so.
--
-- source_url / source_title
--   Where the material came from, when it was read in from a link. The reader
--   already returns both and then throws them away once the text is in the
--   box, so a lesson has never been able to say where it came from. Null for
--   pasted material, which is most lessons and is fine.
--
-- source_public
--   Off by default. The pasted material and the reference are staff-only, the
--   same as the rules panel that shows them; this lets staff open ONE lesson's
--   provenance to everyone who can already see it. The system prompt is not
--   covered by this and stays staff-only in the app — it is internal plumbing
--   rather than provenance, and nobody browsing a lesson is helped by it.
--
-- All additive, all nullable or defaulted, no policy added or changed: these
-- are columns on space_lessons, which the existing staff-only update policy
-- already governs, and they are read by anyone who can already read the row.
--
-- Safe to re-run.
-- =============================================================================

alter table public.space_lessons
  add column if not exists prompt_used text,
  add column if not exists source_url text,
  add column if not exists source_title text,
  add column if not exists source_public boolean not null default false;

comment on column public.space_lessons.prompt_used is
  'The system prompt as actually sent, recorded at generation time. Null on lessons written before this existed — the rules panel then rebuilds it and says that it did.';
comment on column public.space_lessons.source_url is
  'The page the material was read in from, when a link was used. Null for pasted material.';
comment on column public.space_lessons.source_title is
  'That page''s title, for a readable reference line.';
comment on column public.space_lessons.source_public is
  'When true, the source material and reference are shown to anyone who can see the lesson. The system prompt stays staff-only regardless.';

-- Only http(s) links are ever stored, and only ones the reader accepted. The
-- check is here as well because a column that holds a URL shown as a link is
-- worth constraining at the place it is stored, not only at the place it is
-- written.
alter table public.space_lessons
  drop constraint if exists space_lessons_source_url_http;
alter table public.space_lessons
  add constraint space_lessons_source_url_http
  check (source_url is null or source_url ~* '^https?://');
