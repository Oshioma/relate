-- =============================================================================
-- Relate — marking a lesson that went beyond its source
--
-- Every lesson until now carries one guarantee: everything in it came from the
-- material somebody pasted. That is what makes the library checkable — a
-- parent can hold the lesson against the source and see that nothing was
-- invented. It is also why the writer is told, for every age band, "do not
-- invent facts that are not in the source material".
--
-- "Go deeper" deliberately relaxes that. An adult reading about the Tetractys
-- may want the irrationality crisis, the numerology, and what modern
-- historians think the Pythagoreans actually believed — none of which a short
-- source will contain. That is a real thing to want, and it is a different
-- kind of document: it cannot be checked against its source, because most of
-- it is not in the source.
--
-- So it says so. This column is what lets the library show which lessons those
-- are, on the card and on the lesson itself, BEFORE somebody prints one out
-- for a child. The lesson also labels the beyond-the-source parts internally,
-- but a printed page loses everything except its words — the badge is for the
-- moment of choosing, which is the moment that matters.
--
-- Additive and default false: every existing lesson is, correctly, still a
-- lesson built only from its source. No policy is added or changed — writing
-- this column is an update on space_lessons, which the existing staff-only
-- policy already governs.
--
-- Safe to re-run.
-- =============================================================================

alter table public.space_lessons
  add column if not exists beyond_source boolean not null default false;

comment on column public.space_lessons.beyond_source is
  'True when the lesson was written in "go deeper" mode and contains material the pasted source did not. Shown as a badge so a reader knows it cannot be checked against its source. See src/lib/ai/lesson-writer.ts.';

-- Browsing "which of these went beyond the source" is a per-space question.
create index if not exists idx_space_lessons_beyond_source
  on public.space_lessons (space_id)
  where beyond_source;
