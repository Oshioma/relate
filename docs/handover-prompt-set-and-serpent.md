# Handover prompt — Set/Seth and the Serpent collection

Paste everything below the line into a new Claude session that has web access.
It is written to be self-contained.

---

## What you are working on

`Oshioma/relate` — a Next.js 16 + Supabase community platform whose centrepiece
is an **Interactive Learning Timeline**. Read `AGENTS.md` first; it is short and
binding. Two rules from it that catch people out:

- **Never hand-name a migration.** Use `scripts/new-migration.sh <name>`, which
  derives a unique monotonic timestamp. CI fails the PR on duplicate prefixes.
- **One branch per logically separate change**, cut fresh from the latest `main`.
  Never stack new work on a branch whose PR has merged.

Other things worth knowing before you write code:

- `src/types/database.ts` is **hand-written**. Its members must be `type`
  aliases, not `interface`s, or `.insert()` degrades to `never`.
- Tests run with
  `node --experimental-strip-types --import ./scripts/ts-resolve.mjs --test "src/**/*.test.ts"`.
  The runner **cannot import `.tsx`** — put logic that needs testing in a `.ts`
  file beside the component.
- Full check before any push: `npx tsc --noEmit`, the test command above,
  `npx eslint src/`, `npm run build`.

## The architectural rule the whole timeline is built on

> **An event has no date.** Dates live on *claims*, because different sources
> give different dates, different precision, and sometimes different kinds of
> statement altogether. A timeline that flattens those into one number is
> teaching the opposite of how history is actually known.

There is **no confidence-score field anywhere**, and that is enforced by a
database CHECK constraint and by tests. Do not add one, and do not smuggle one
in as a percentage in prose.

The same move has been extended twice:

- **A subject has no measurement** — `SeedMeasurement` in `seed-types.ts`.
- **"When is this from?" and "Why do we think it is what we say it is?" are two
  questions** — `identificationStatus` (`IDENTIFICATION_STATUSES` in
  `taxonomy.ts`). *Not* a confidence scale: "possible" is not 40%.

Read `src/lib/timeline/seed-types.ts` and `src/lib/timeline/taxonomy.ts` in full
before writing a dataset. The comments are the specification.

## State of play

| PR | What | Status |
|----|------|--------|
| #515 | **Set, Seth, Sutekh** — 29 records, 10 sources, 21 guard tests. Branch `claude/set-sutekh-timeline` | **Open, needs review/merge** |
| #516 | Removes the tallest-humans dataset | Open |
| #514 | Tallest humans tranche three | Closed unmerged, deliberately |
| — | `claude/tallest-humans-image-provenance` | Pushed, **do not merge** — superseded by #516. See "Salvage" below |

## THE BLOCKER, and why this handover exists

The previous session ran in a sandbox whose egress proxy answered **403 to
CONNECT** for every scholarly host. Verified, not assumed:

```
commons.wikimedia.org      upload.wikimedia.org       www.monash.edu
research.monash.edu        chesterbeatty.ie           resources.metmuseum.org
inscriptionslibrary.bibalex.org                       webperso.iut.univ-paris8.fr
www.loc.gov                tile.loc.gov               wellcomecollection.org
iiif.wellcomecollection.org                           www.britishmuseum.org
www.tarsus.ie              tansebe.github.io
```

Only GitHub, npm, PyPI and Anthropic were reachable. **If you have web access,
the single most valuable thing you can do is open these sources and replace
secondhand summaries with what the texts actually say.**

Every record written under that constraint carries `NEEDS SOURCE VERIFICATION`
in its notes, naming exactly what to check. Those flags are the work list. Do
not delete one without doing the reading.

---

# OUTSTANDING WORK

## 1. Set dataset: the evidence-layer architecture (highest priority)

The owner's requirement, in their words:

> The application must make the interpretive chain visible:
> ANCIENT PAPYRUS → EGYPTIAN TEXT → MODERN TRANSCRIPTION → TRANSLITERATION →
> TRANSLATION → MODERN SUMMARY → INTERPRETATION.
> **Never collapse these into a single field called "FACT."**

> The user should be able to move backwards from any statement we make until
> they reach the surviving evidence.

This is **architecture, not content**, and none of it is blocked by network
access. Build it first; the texts then fill it in.

Required layers, each addressable and separately displayable:

```
PRIMARY_OBJECT   PRIMARY_TEXT   TRANSCRIPTION   TRANSLITERATION
TRANSLATION      MODERN_SUMMARY INTERPRETATION  ALTERNATIVE_INTERPRETATION
DATE_CLAIM       SOURCE         IMAGE           LOCATION   EVIDENCE_STATUS
```

UI: a reader can toggle SHOW ORIGINAL TEXT / SHOW TRANSLITERATION /
SHOW TRANSLATION / SHOW WHAT WE SAY IT MEANS.

**Where translations differ, store multiple translation claims** — Gardiner
1931 vs Lichtheim 1976 vs Wente/Simpson — and show the difference. The claims
architecture already supports this; reuse it rather than building a parallel
model. Do not reproduce an entire copyrighted modern translation: store the
bibliographic citation, quote short passages only, and write an original close
summary from the transliteration and the reputable translations.

## 2. Set dataset: parallel geographic lanes

> The interface must no longer imply that hostility towards Set happened
> simultaneously throughout Egypt.

Model **NILE VALLEY** and **DAKHLEH OASIS** as parallel evidence tracks, ideally
also Thebes / Memphis / Delta / other western oases. The supportable conclusion
is that Set's cult could be proscribed in parts of Egypt while continuing in
Dakhleh. **Do not turn that into a stronger nationwide claim than the
archaeology supports.**

Currently `late-period-persecution-of-set` holds a deliberately wide
seven-century `estimated_range` and a test asserts the range stays that wide.
Replace the vagueness with *dated instances site by site*, not with a narrower
guess.

## 3. Mut el-Kharab / Dakhleh Oasis

Official project:
`https://www.monash.edu/arts/philosophical-historical-indigenous-studies/dakhleh-oasis-project/excavations/mut-el-kharab`
Publications: same URL + `/publications`

Key reading:
- Colin A. Hope (2016), *Reconstructing the Image of Seth, Lord of the Oasis, in
  his Temple at Mut el-Kharab in Dakhleh Oasis*, pp. 123–145.
  `https://research.monash.edu/en/publications/reconstructing-the-image-of-seth-lord-of-the-oasis-in-his-temple-/`
- Hope & Kaper, *Egyptian Interest in the Oases in the New Kingdom and a New
  Stela for Seth from Mut el-Kharab*
- Hope & Warfe, *The Proscription of Seth Revisited*

**Do not create one generic "Temple of Seth at Dakhleh" event.** Separate
records for at least: earliest Dakhleh evidence for Set; New Kingdom temple
activity; the Ramesside Seth stela; Seth with Nephthys; Seth and Amun at the
site; the Greater Dakhleh Stela; the epithet "Seth, Lord of the Oasis"; the
Set-animal determinative on the Greater Dakhleh Stela; the Smaller Dakhleh
Stela; the change or disappearance of the determinative; altered Set
inscriptions; Third Intermediate Period cult activity; Late Period; Ptolemaic;
Roman; Christianisation and the end of the institutional cult.

For every object retrieve: photograph, drawing, excavation context, object
number, date, inscription, transliteration, translation, publication,
page/figure number, and the excavator's own interpretation.

Put the Greater and Smaller Dakhleh Stelae **side by side** on the
determinative question. **Do not automatically call the change "demonisation."**
Ask what changed, when, and why the excavators think so.

**Do not infer continuous worship merely because the temple remained standing.**

**Do not substitute generic Set imagery for these actual archaeological
objects.**

## 4. The Contendings of Horus and Seth

- Papyrus Chester Beatty I, recto 1,1–16,8. 20th Dynasty / Ramesside,
  c. 12th century BCE. Thebes. Chester Beatty Library, Dublin.
- Gardiner (1931), *The Library of A. Chester Beatty*. Full scan:
  `https://chesterbeatty.ie/assets/uploads/2018/11/The-Library-of-A.-Chestera-Beatty-Description-of-a-Hieratic-Papyrus-with-a-Mythological-Story-Love-Songs-and-Other-Miscellaneous-Texts.pdf`
- Gardiner's hieroglyphic transcription also in *Late Egyptian Stories*, pp. 37–60.
- Digital transcription: `https://webperso.iut.univ-paris8.fr/~rosmord/hieroglyphes/HorusAndSeth/`
- Page-by-page project: `https://tansebe.github.io/hr-st/hr-st.html`
- Lichtheim, *Ancient Egyptian Literature* II, pp. 214–223 (cite, do not reproduce).
- A photograph of recto page 4 is reproduced in *Metropolitan Museum Journal* 50
  (2015): `https://resources.metmuseum.org/resources/metpublications/pdf/Metropolitan_Museum_Journal_v_50_2015.pdf`

**The central dispute is succession to Osiris.** Do not reduce the text to
"Horus is good and Seth is evil" — the narrative is explicitly a legal dispute
over royal office, and Seth has an argument.

**Read the Gardiner text and extract episodes yourself; do not work from the
list below instead of reading.** At minimum: Horus claims Osiris's office;
Seth's counterclaim (record the actual basis he gives, with papyrus page/line);
the divine court (Re-Harakhty, Thoth, the Ennead, Neith, Isis); Neith's
judgment and the Ennead's reaction; Re-Harakhty's disagreement; Hathor and
Re-Harakhty (**do not sanitise** — the manuscript describes Hathor exposing
herself and Re-Harakhty laughing); Isis's interventions (record what she
actually does); Isis disguised obtaining a statement from Seth, and why that
answer matters legally; the hippopotamus contest; the violent episode between
Horus and Isis; Seth's sexual challenge and its aftermath — semen, lettuce, the
hearing — in **academically neutral language, neither sensationalised nor
censored**; Thoth's determination of where each god's semen is; the stone-boat
contest; Osiris's intervention and his argument about legitimate kingship; and
the final settlement — **not** "good defeats evil", but who actually receives
the office and what role Seth is subsequently given.

Keep ancient narrative separate from modern sexual / political / symbolic
interpretation.

## 5. The 400-Year Stela

Egyptian Museum, Cairo; commonly cited JE 60539. 19th Dynasty, under
Ramesses II. Found at Tanis; likely original context Avaris / Pi-Ramesses.

**Keep the date the stela was made separate from the Year 400 written on it.**
The dataset already does this and a test enforces it: the era claim is stored
*positionless*, because subtracting four hundred would make the dataset the one
asserting the disputed part.

Extract: the royal titulary; "Year 400, 4th month of the third season, day 4";
the attribution to Seth-the-Great-of-Strength and "the Ombite"; Seth shown with
royal-style titulary; Seti's full titulary including **High Priest of Seth**;
and the prayer to Seth — published renderings include "great of strength in the
boat of millions of years" placing Seth "in the bow of the ship of Re".

That last passage is important: it connects the **textual** evidence to the
**visual** evidence already in the dataset of Set defending Ra's barque
(`set-spears-apep`). Cross-link them — but **do not claim this stela depicts the
Apep battle** unless it does.

The lunette deity is read as "Set/Seth of Ramesses", in foreign/Asiatic
iconography. Make the **text claim** and the **iconographic claim** separately.

On what Year 400 means, store at least three separate claims with scholars
attached: (A) it commemorates the establishment or institutionalisation of the
cult of Seth at Avaris; (B) the initiating event remains debated; (C) Avaris
archaeology independently evidences a Seth cult in roughly that Second
Intermediate Period window. **Do not revive the obsolete reading of
"Seth-the-Great-of-Strength / Nubti" as an unknown Hyksos pharaoh** without
clearly marking it as an older interpretation.

Sources: Breasted, *Ancient Records of Egypt* III §§538–542; Pritchard, *ANET*
p. 252ff; Kitchen, *Ramesside Inscriptions* II pp. 287–288 and *RITA* II
pp. 116–117; Sethe, *Der Denkstein mit dem Datum des Jahres 400…*; Montet, *La
stèle de l'an 400 retrouvée*; Habachi on the Four Hundred Year Stela and
Avaris–Pi-Ramesses. A web copy of the older ANET translation is at
`https://www.tarsus.ie/resources/Wisdom-Lit.-/ANET-PDF.pdf` — **do not treat it
as superior to Kitchen/Sethe/Montet.**

## 6. Audit the existing Set records against the primary evidence

> If our description says more than the source supports: **CHANGE IT.**
> If the ancient text is ambiguous: **SHOW THE AMBIGUITY.**
> If translations differ: **STORE MULTIPLE TRANSLATION CLAIMS.**
> If scholarly interpretations differ: **STORE THEM SEPARATELY.**

Do not merely add citations to existing prose. The records most in need:
`contendings-of-horus-and-seth` (written entirely secondhand and says so),
`set-in-the-pyramid-texts` (no utterance cited by number),
`set-survives-in-the-oases` (a signpost, not evidence),
`late-period-persecution-of-set` (a summary of a consensus about a process),
`egyptian-hittite-treaty-sutekh` (which Sutekh is in the witness list is a real
open question — the Egyptian sign renders Levantine and Anatolian storm gods
too).

## 7. New collection: THE SERPENT, KUNDALINI & SACRED ASCENT

A full brief was given. Headline requirements:

- **75+ events, preferably 100+.** "I'd rather have 80 meaningful entries than
  100 padded ones." Do not manufacture events to reach a number.
- **200+ quality images** if licensing permits, prioritising museum photographs,
  archaeological photographs and manuscript scans over modern illustrations.
  Galleries rather than one image for major events.
- **Do not argue that every serpent symbol represents Kundalini.** Show the
  evidence and the competing interpretations.

Classification labels — **not** confidence scores:
🟢 EXPLICIT KUNDALINI · 🔵 HISTORICAL PRECURSOR · 🟣 RELATED TRADITION ·
🟡 CROSS-CULTURAL PARALLEL · 🟠 SPECULATIVE / ESOTERIC INTERPRETATION

Sections requested: Indus Valley (the script is **undeciphered** — never write
"the Indus people practised Kundalini yoga"); Mesopotamia (the Gudea vase gets
its own major event, with the Iḍā/Suṣumṇā/Piṅgalā comparison explicitly labelled
a cross-cultural visual comparison and **not** historical evidence); Egypt
(Wadjet, uraeus, Djed — show mainstream *versus* esoteric "Djed = spine", never
the latter as fact); early Vedic; early Upaniṣads (Chāndogya 8.6.6 and Kaṭha
2.3.16, both with Sanskrit, transliteration, translation, dating claims, and
original text kept separate from later commentary); Maitrī (built as a visible
dating controversy — the showcase for why the timeline allows multiple date
claims); other Upaniṣadic material; Buddhist subtle body; early Śaiva Tantra
(the earliest securely datable uses of *kuṇḍalinī*); the serpent form of
Kundalini as **separate events per element**, not one; the cakra system (**do
not assume there were always seven**); Haṭha yoga; Greece (caduceus, Asclepius —
separate VISUAL SIMILARITY from EVIDENCE OF TRANSMISSION); biblical traditions
(Numbers 21, Nehushtan, John 3:14, Jacob's Ladder, Peniel — **explicitly explain
that Peniel and "pineal" are not etymologically related**, as a worked example
of esoteric association versus linguistic evidence; Matthew 6:22); Christian
mysticism; Iran; China/Daoism (**do not backdate the late Neijing Tu** — separate
the date of the surviving diagram from the age of the traditions in it);
Mesoamerica; other cultures; sacred tree / world axis; a serpent+staff object
database; a forehead/crown database; an inner-fire database; and modern
Kundalini (Avalon/Woodroffe, Jung, Sivananda, Yogi Bhajan, the modern
seven-colour rainbow chakra system as **one historical development**).

Three research outputs are wanted, and the first is called out as among the most
important: a table of **how far back each individual element of the later
Kundalini system can actually be traced** (element / earliest secure evidence /
date / source / earlier possible precursor / date / why disputed); a
cross-civilisation serpent+ascent motif table; and a chronological "earliest 25
objects/texts" gallery.

> Do not flatten uncertainty. Never change "looks remarkably similar" into
> "therefore they are historically connected." Equally, do not dismiss an
> unusual correspondence merely because transmission has not been demonstrated.

**Reuse the existing event / claim / source / viewpoint / image / related-event
/ comparison / filtering systems.** Inspect the schema and migrations before
adding anything. Do not remove or overwrite existing timeline data.

## 8. Salvage from `claude/tallest-humans-image-provenance`

That branch is **not to be merged** — its dataset was deleted by PR #516 — but
it contains **generic image-provenance architecture the Serpent brief needs**.
Cherry-pick the schema, drop the dataset:

- `PROVENANCE_STATUSES` in `taxonomy.ts`: `verified` / `as_supplied` /
  `resolved_at_seed` / `unverified` / `contested`, with
  `provenanceNeedsWarning()`. It exists because metadata can be *accurate* and
  *unchecked-by-us* at the same time, and recording it as verified would be a
  lie of one word.
- Media fields on `SeedEvent.media`: `fileName`, `originalFileUrl` (no width
  parameter — a width makes a *rendering*, not the original), `originalSourceUrl`
  (the holding institution's record, which is **not** the Commons file page),
  `objectDate` / `photographDate` / `uploadDate` (**three dates, never one — an
  upload date is never the date of an image**), `rightsNotes` (for when two
  institutions' rights statements disagree, as the British Museum's and
  Commons' did), `subject` (what the picture is *of*, which is not always who
  it is *filed under*), `pixelWidth` / `pixelHeight`, `duplicateOf`,
  `provenanceStatus`, `provenanceNotes`.
- Media kinds, all of which warn: `hoax_object`, `historical_document`,
  `comparison_chart`, `engraving`; plus `mediaKindIsPhotograph()`,
  `mediaKindIsIllustration()`, `mediaKindIsFabricatedSubject()` as **predicates
  rather than stored booleans**, so a stored flag can never contradict `shows`.

### How licences are handled, and why it is right

**Do not type licences into seed files.** Set `creditFrom: "source"` on every
picture. At seed time `resolveCredits()` → `creditFor()` →
`fetchCommonsAttribution()` reads that file's **own** `extmetadata` from the
Commons API and takes `Artist` and `LicenseShortName` from it. That is per-file,
never per-category, and it is read at the moment of import rather than typed
from memory months earlier. A licence written into a seed file is a licence
written from memory.

`bringImageIn()` copies the bytes into the community's own storage — accepted
types are JPEG, PNG, WebP and GIF only, **max 8 MB**. TIFFs and PDFs cannot be
imported; a very high-resolution original (Library of Congress material runs to
~6858×5166) may exceed the ceiling and need a derivative.

### Four provenance traps found in real Commons categories

Useful as regression cases and as a warning about trusting categories:

1. A Middlesex Music Hall show bill dated **1886** sits in the Commons category
   of Patrick Cotter O'Brien, who died in **1806**. No part of it can be about
   him.
2. `Cardiff1869 Street Art Installation In Pasadena, California, 2011.jpg` is a
   **2011 artwork** whose filename opens with "1869". Anything reading leading
   digits as a date files street art as a contemporary record.
3. Jane Bunford's only photograph carries an **"own work"** claim dated 1922 —
   the year she died. Nobody uploading to Commons took it.
4. Four files of John Rogan are **not four photographs**. Two are the same
   goat-cart image under two different and incompatible CC licences; a 244×281
   file is a crop of *something*, and which is unknown — so it was left
   deliberately unlinked, because a wrong duplicate link silently deletes a real
   photograph from the count.

The general lesson, and the reason the owner asked for provenance checking in
the first place: **a Commons category is a filing decision, not a provenance.**
An image titled "Horus spearing Set", widely reused, is a modern artwork made in
**June 2025**; an image of Set spearing Apep reproduces a Twenty-first Dynasty
Book of the Dead scene. Image search presents the two identically. Both are in
the Set dataset, labelled differently, and a test pins the difference.
