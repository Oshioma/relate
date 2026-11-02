# Research batch 03 (Oshi, 2026-11-02)

Supplied: `akan_akwasidae_2026.json` (eight 2026 Akwasidae dates from Nyame
Dua) and `astronomical_date_anchors_2026_11.json` (39 days of approximate Moon
stages, 2 Nov to 10 Dec 2026). Both are kept here as
`batch-03.*.original.json`.

`batch-03.v1.json` imports only the Akwasidae part:

- A second source, Nyame Dua's list, is added. Its eight dates are the same as
  batch 01's Akan Dictionary list, so the existing date entries, the 42-day
  Adaduanan anchor and the Akwasidae observance now cite both sources. Nothing
  new is placed on the calendar.
- The batch's caution ("Confirm with local community; not universal to all
  Akan groups") becomes the observance's uncertainty note.

The astronomical anchors file is **not imported**. The calendar never stores
Moon phases: it calculates them. The file's own README says its stages are
coarse and that its culture mappings are all `NOT_VERIFIED`. Its USNO phase
times are used instead as a test (`src/lib/true-calendar/astronomy.test.ts`),
which checks that the calendar's calculation agrees with them.
