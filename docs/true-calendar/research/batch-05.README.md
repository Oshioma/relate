# Research batch 05 (Oshi, 2026-11-02)

`batch-05.original.json` is the file as supplied (23 records).
`batch-05.v1.json` attaches them to the records already imported, so nothing
is counted twice:

- **Māori** (6): practices on Te Papa's maramataka entries, matched by name
  (Whiro, Tirea, Rākaunui) or by Te Papa's wording for the unnamed ones. The
  batch's "lunar night N" is kept in each note, not used as a night number,
  because Te Papa's order differs and iwi start their months differently.
- **Hawaiian** (8): practices on the Oʻahu nights of the same number and name.
  Night 22 (ʻOlekūlua) carries both accounts (Kepelino good, Handy and Handy
  unfavourable) and is tagged *contested*.
- **Akan**: a modern reading for Akwasidae, and the caveat that the 2026 dates
  are a secondary listing (Explore Ghana Guide calls them calculated from 2025
  dates, not a Manhyia Palace announcement), added to every 2026 date and
  shown on the card.
- **Athens** (2): practices for Noumenia and Agathos Daimon, and a new day 6
  (Artemis). Artemis and Apollo days say "no generic activity recommendation
  established", so no recommendation is added for them. All marked as modern
  reconstruction.
- **Igbo** (4): a practice for each market day from the Nkwerre study, with its
  note that order and alignment vary by community. Still unanchored.

Every "modern_application" is stored as a modern interpretation. Everything is
a draft. The Igbo article's title was taken from the batch; confirm it on review.

## Added with Phase 5

- The eight 2026 Akwasidae dates carry `date_status: "published_secondary"`
  (new field), so the calendar labels them "Published secondary-source date",
  never official.
- Disagreements are linked with `conflict_group` (new field) instead of being
  merged: ʻOlekūlua (night 22: batch 01's practice and Kepelino vs Handy and
  Handy) and the Kū nights (Kūkahi recommended for planting; Kepelino cautions
  against some crops on Kūkolu). The card says "Historical interpretations
  differ" and lists each account beside its source.
- Regional variation is recorded on the records themselves: both Māori
  calendars get a month rule (iwi differ; some begin at the full Moon), citing
  Te Papa's "What is maramataka?", and the Igbo market-week cycle gets a
  regional note (order and alignment vary; the study describes Nkwerre).
