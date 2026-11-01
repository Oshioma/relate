# Research batch 02 (Oshi, 2026-11-01)

`batch-02.original.json` is the file as supplied (47 records).
`batch-02.v1.json` is the same research in the `true-calendar/v1` import
format. The converter keeps the batch's safeguards:

- **Māori (Te Papa)** is stored as a separate system, "Te Papa's maramataka
  activity sequence".
  - Entries are numbered in the order the page displays them, and every entry
    says the number is not a night number.
  - The page's fractional and repeated positions (2.5, 7.8, a second 12) are
    recorded in the uncertainty note.
  - Names are given only for Whiro, Tirea, Rākaunui and Mutuwhenua. Unnamed
    entries are not filled in.
  - Each entry's practice is split into the historical significance and the
    modern reflection.
- **Ancient Egypt** covers religious lunar days 1, 2 and 15 (Stern 2012), and
  the civil calendar's structure (12 × 30 + 5; Akhet, Peret, Shemu). Neither
  is placed on modern dates.
- **Athens** has Noumenia, Agathos Daimon and the seventh day (Apollo) as days
  of the month, and Hekate's Deipnon as a month-end observance. Records sourced
  only from Hellenion are tagged *modern interpretation*.
- **Igbo**: the four-day market week is an unanchored cycle, because there is
  no universal Gregorian anchor and it varies by community.
- **Yoruba**: Ellis's five-day week is its own variant, tagged *contested*.
  It is never merged with four-day accounts and is not anchored.

Everything is a draft. Source titles were taken from the links, so confirm
them when reviewing.

## Overlap with batch 01

Batch 01's Māori nights put Hoata at 3, Rākaunui at 14 and Mutuwhenua at 29.
Batch 02's README says Te Papa's text doesn't support fixed night numbers, or
the name at position 2.5. A reviewer should decide whether to reject batch
01's five Māori nights.
