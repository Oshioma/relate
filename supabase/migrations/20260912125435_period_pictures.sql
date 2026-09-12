-- =============================================================================
-- Relate — A PERIOD MAY CARRY PICTURES, THE SAME WAY AN EVENT DOES
--
-- Events have had `image_url` and `media` since the timeline shipped; periods
-- never did, so the fifteen named stretches of time are the only records in
-- this feature that cannot show anything. That is the whole reason for this
-- migration, and it is deliberately the SAME two columns under the SAME two
-- names rather than a period-shaped variation on them.
--
-- WHY NOT A DIFFERENT SHAPE. Every piece of machinery that already exists for
-- event pictures reads these two names: the copy-into-our-own-storage path, the
-- credit resolver that fetches who made a file and under what terms, the
-- "check every picture" report, and the media renderer with its "what is this a
-- picture OF" label. A period with `cover_image` and `illustrations` would have
-- needed a second copy of all four, and the second copy is where the drift
-- starts — one of them learns about a new source, the other does not.
--
-- WHAT A PERIOD PICTURE IS FOR, AND THE TRAP IN IT
--
-- A period is the frame every event is read against, which already makes it the
-- most dangerous thing on this timeline: "Bronze Age" printed across a band
-- looks like a fact about the world. A PICTURE MAKES THAT WORSE, because a
-- photograph of one bronze object printed across a band covering two thousand
-- years and several continents reads as a portrait of the whole span.
--
-- Nothing in the schema can prevent that; it is the caption's job, and the
-- `media` entries carry the same `shows` key events use so a reconstruction or
-- a later artwork has to declare itself. What the schema CAN do is refuse to
-- make the picture look authoritative: there is no "representative object"
-- column, no single canonical image beyond the cover the UI already understands
-- how to caption, and no field that ranks one picture above another.
--
-- Also absent, here as everywhere in this feature: any column that rates a
-- claim. No confidence, no score, no stars.
--
-- Additive and safe to re-run. Nothing is dropped and nothing is rewritten.
-- =============================================================================

-- The cover. Null is the normal state; most periods have no picture and the
-- band renders exactly as it does today.
alter table public.timeline_periods
  add column if not exists image_url text;

-- The gallery, in the same shape events use:
--   url      where the picture is
--   caption  what it shows, and what it is NOT evidence of
--   credit   who made it and under what terms — kept OUT of the caption,
--            because the caption is also the alt text and a licence read
--            aloud with the URL spelled out is not a description
--   kind     the media type: image, video
--   shows    what the picture is a picture OF, from MEDIA_KINDS — the field
--            that stops a later artwork being read as a record
alter table public.timeline_periods
  add column if not exists media jsonb not null default '[]'::jsonb;

-- A jsonb column will accept a string, a number or an object just as happily as
-- the array the application expects, and a period whose media is the string
-- "none" would break the renderer at read time rather than at write time.
alter table public.timeline_periods
  drop constraint if exists timeline_periods_media_is_array;
alter table public.timeline_periods
  add constraint timeline_periods_media_is_array
  check (jsonb_typeof(media) = 'array');

-- The grants on this table were already given to anon, authenticated and
-- service_role when it was created; adding columns does not change them, and
-- the existing RLS policies cover the rows rather than the columns. Nothing
-- further is needed here — noted because the absence of a grant block in a
-- migration that touches a table is otherwise the kind of thing that reads
-- like an oversight.

-- PostgREST caches the schema and will answer "column does not exist" for a
-- column that plainly does until it is told to look again.
notify pgrst, 'reload schema';
