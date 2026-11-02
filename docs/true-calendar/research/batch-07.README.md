# Research batch 07

Oshi's batch 07 (20 records, `batch-07.original.json`, README in
`batch-07.original.README.md`), converted to `batch-07.v1.json` after
comparing every record with batches 01–06.

## Duplicates

None of the 20 repeats an earlier record from the same source.

There are two overlaps with batch 02's Athenian month, which comes from a
modern Hellenic organisation:
- Hesiod's day 1 is a holy day; Athens has the Noumenia.
- Hesiod's day 7 is sacred to Apollo; Athens has Apollo's day.

Hesiod is an ancient primary text from Boeotia, not Athens, so these are kept
as separate claims under their own culture. They corroborate each other rather
than duplicate.

## New

**Sources (3)**
- Hesiod, *Works and Days* (Center for Hellenic Studies).
- The British Museum lucky-days papyrus (Google Arts & Culture).
- The University of Hawaiʻi Hawaiian lunar calendar.

**Culture (1)**
- `europe.hesiodic-greek`, "Ancient Greek (Hesiodic)", so that these days get
  their own History page.

**Hesiod's days of the month (14)**
- Stored as lunar days in `europe.hesiodic-greek.works-and-days`.
- The two "middle sixth / middle seventh" days are stored at 16 and 17. That
  numbering is our reading, and each record says so.
- The "fifth days" record is shown at day 5, and its caution explains which
  days are meant.
- 9 records carry concrete farm or work advice and also get a practice record,
  with the batch's modern application labelled as modern. They are days 8, 9,
  11, 12, 13, 27, 30, middle sixth and middle seventh.
- The holy days and the omen days are kept as history only, not as practices,
  following the batch's own rule. These are day 1, day 4 (marriage), day 20
  (births) and the fifth days.

**Egyptian lucky, unlucky and mixed days (3)**
- Stored as observances on the new system
  `africa.north.ancient-egyptian.lucky-days`.
- The source does not list which days, so none are dated.
- The unlucky-day record is shown as history, not safety advice.

**Hawaiian seasonal months (3)**
- Makaliʻi, Welehu and Ikiʻiki, stored as observances on
  `oceania.hawaiian.seasonal-months`.
- The source summary gives no month numbers, so none are invented.
- Each carries the caution that these are Hawaiʻi's seasons, not East Africa's.

## Dates

Following Oshi's instruction for this batch, ancient Greek month days are never
placed on Gregorian dates. This now applies to Hesiod's days and to the
Athenian days from batch 02, which until now were counted from the new Moon.

The Egyptian civil-calendar days and the Hawaiian months are not dated either.

Everything imports as draft and is published only by a reviewer.
