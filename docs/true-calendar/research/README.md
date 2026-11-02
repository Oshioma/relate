# The True Calendar: research data

The calendars and the Moon are calculated in the browser. Everything about
what a day meant to a culture comes from research rows in the `calendar_*`
tables (migration `20261101221142_true_calendar_research.sql`), and readers
only ever see rows whose `review_status` is `published`.

## Three layers, kept apart

1. **Historical claims**: cultures, calendar systems, months, lunar days,
   observances, meanings. Each carries evidence tags (historically documented,
   oral tradition, scholarly reconstruction, contested, unverified lead…),
   a confidence, an uncertainty note, and citations.
2. **Cycle rules**: how a claim reaches a modern date. A repeating day cycle
   (the Akan 42-day Adaduanan, the Igbo four-day market week) is placed on the
   calendar only from a sourced anchor: `anchor_date` was position
   `anchor_position`, per `anchor_source_key`. Lunar days of a particular
   calendar are *not* placed on dates, because their months began by local
   observation. A source that gives a dated entry directly goes in
   `date_correspondences`.
3. **Modern interpretation**: `recommendations.modern_interpretation`, always
   shown apart from `historical_practice` and labelled as a suggestion.
   A modern suggestion for a particular date that belongs to no tradition
   goes in `daily_notes` (`note_date`, `title`, `explanation`, `disclaimer`);
   its evidence must include `modern_interpretation`.

## Importing

Files use the format `true-calendar/v1` (see `src/lib/true-calendar/research/model.ts`
for every field). Researchers and reviewers open **Research** in the space:

1. Paste the JSON or choose the file. What you paste is kept as a draft in the
   browser until it is imported or you sign out.
2. **Dry run** validates the file: unknown fields, bad keys, missing
   references, duplicate keys, published claims without a supporting source,
   cycles anchored without a source. It lists what would be new, changed or
   unchanged.
3. **Import** upserts by `key`, so re-importing a corrected file updates rows
   instead of duplicating them.
4. A reviewer publishes record by record, or **Publish everything ready** for
   a culture (records still missing a supporting source stay drafts).

Nothing needs a rebuild: published rows appear on the Calendar and History
pages straight away.

## Who can do what

- Super admins are reviewers automatically.
- Add others with SQL: `insert into calendar_researchers (user_id, role) values ('<uuid>', 'researcher');`
  (`role` is `researcher` or `reviewer`). Only reviewers can publish; a
  database trigger refuses anyone else.

## Files here

- `catalogue.v1.json`: the 80 traditions (catalogue entries only; the
  migration installs them).
- `batch-01.v1.json`: Oshi's research batch 01 (Hawaiian Oʻahu lunar nights,
  Māori, Akan Adaduanan), converted to v1; all claims are drafts for review.
  See `batch-01.README.md`.
