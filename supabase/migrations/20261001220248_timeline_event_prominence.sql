-- =============================================================================
-- Relate — how prominent a timeline record is, for semantic zoom
--
-- Zoomed out, the strip cannot show every record, and choosing by position
-- alone (whichever happened to be packed first) shows an arbitrary handful.
-- Semantic zoom shows the MOST IMPORTANT records that fit and reveals the rest
-- as you zoom in — the way a map shows countries, then cities, then streets.
--
-- Importance has two sources, decided with the owner:
--
--   prominence — set by staff or by a seed dataset, when a record's importance
--                is a judgement the data cannot make:
--                  1 = landmark  (Great Pyramid, founding of Rome)
--                  2 = notable
--                  3 = detail    (one of forty dated finds at a site)
--   null       — not set: the app scores the record from what it has
--                (pictures, dates, sources, a description) and ranks it
--                between notable and detail. See src/lib/timeline/prominence.ts.
--
-- Most records stay null; the column is for overriding the score, not for
-- filling in on every row.
--
-- Additive. Nothing existing changes; every row starts unset.
-- =============================================================================

alter table public.timeline_events
  add column if not exists prominence smallint;

alter table public.timeline_events
  drop constraint if exists timeline_events_prominence_range;
alter table public.timeline_events
  add constraint timeline_events_prominence_range check (prominence is null or prominence between 1 and 3);

comment on column public.timeline_events.prominence is
  'How prominent the record is when zoomed out: 1 landmark, 2 notable, 3 detail. Null = scored by the app from its pictures, dates and sources. Set by staff or seed data.';
