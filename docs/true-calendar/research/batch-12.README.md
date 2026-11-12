# Research batch 12: Hindu months and yearly festivals on their real dates

Oshi asked (12 November 2026) that the lunar days whose plain words said "some
months have a big festival on it" name those festivals, and that each festival
be its own event on the actual date it falls.

## What it adds
- **The twelve Hindu months**, Chaitra to Phalguna (`months`, on the tithi
  system). Each runs new Moon to new Moon (amānta) and is named by the sidereal
  sign the Sun enters during it (Chaitra for Meṣa). A month in which the Sun
  enters no sign is an extra (adhika) month: it gets no ordinal and no
  festivals. 2026 has an adhika Jyeshtha, 17 May to 15 June.
- **27 yearly festivals** (`observances` with `month_key` + `lunar_day`): the
  ones the batch 09 tithi records name, in their month, from Ugadi and Rama
  Navami to Diwali, Bhai Dooj, Chhath, Vasant Panchami, Maha Shivaratri and
  Holika Dahana. Dark-half festivals are stored in amānta months; the
  pūrṇimānta (northern) month name is given in `timing`.
- Sources: one Wikipedia article per festival, for its month and tithi, and
  Wikipedia's Hindu calendar article for the month rule.

## How a festival is dated (mapping.ts, day-rules.ts)
The festival falls on the day its tithi is in force, at Ujjain, at the time of
day almanacs check for it: sunrise for most, midday (11:30) for Ganesh
Chaturthi and Rama Navami, afternoon for Dussehra and Bhai Dooj, early evening
for Diwali and Karva Chauth, midnight for Janmashtami and Maha Shivaratri
(`HINDU_FESTIVAL_TIMES`). A tithi that is never in force at that hour falls on
the day it ran. Shown as "Approx.": local almanacs can differ by a day.

Checked against 16 published dates (the Wikipedia infoboxes, which cite Drik
Panchang): Ugadi 2025 and 2026, Vasant Panchami 2026 and 2027, Ganesh Chaturthi
2025 to 2027, Janmashtami 2026, Dussehra 2026, Karva Chauth 2026, Diwali 2027,
Maha Shivaratri 2027 and Rama Navami 2027 all match
(`knowledge.test.ts`). The hours were set to the almanac windows while checking
against these dates.

## Not dated
- Skanda Shashti and Onam: kept by Tamil and Malayalam solar months (Onam by
  the star Thiruvonam), not by a tithi in a lunar month.
- Balarama's birthday: batch 09 puts it on Bhadrapada Kṛṣṇa Ṣaṣṭhī, but
  Wikipedia gives Shravana Pūrṇimā, so it stays undated.
- Holika Dahana is placed on the full-Moon evening of Phalguna, the night
  before Holi (Wikipedia's Holi article and almanacs). Its own Wikipedia
  infobox says the day before (Śukla Caturdaśī); its line says so.
- Nandotsava, the day after Janmashtami, is checked at midnight like
  Janmashtami so the two stay a day apart.
