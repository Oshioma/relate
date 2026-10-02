# Research brief 05b — the Indian textual chain, and the serpents nobody has looked at

**For a researcher with web access. Pasteable as-is.**

**Where this sits.** Brief 05a covered the Indus Valley, Mesopotamia, the
transmission question and images. It went out and has not come back. **05b does
not depend on it** — the two can be worked in either order, and if 05a is still
outstanding, start here instead, because Part A below is the spine of the whole
collection and nothing else in it makes sense without one.

**State of the collection as of 2026-09-27, counted from the seed files:** four
records against a target of 75–100, and the twenty-six-element traceback
completely empty. That is not a complaint about anyone. It is the honest
starting position, and Part A alone would change the collection more than any
other single piece of work available.

---

## THE STANDARD

Unchanged from briefs 03 to 07, and it is the whole reason this dataset is worth
building.

1. **Quote, do not paraphrase.** Where a date or a claim rests on a passage, give
   the passage — in transliteration if the original is not Latin script, and in a
   published translation with the translator named. A rendering you made yourself
   is fine and useful; say that it is one.
2. **Name who established it.** A date in Indology is an argument, not an
   observation. "c. 1000 CE" with no scholar attached hides the fact that someone
   argued for it and someone else may not agree. **The traceback below will not
   accept a date without a name**, and that is deliberate.
3. **`NOT FOUND` is a correct and valuable answer.** "I looked in X and Y and
   could not establish the earliest attestation of this term" is a finding I will
   record on the element. An approximate century supplied to fill a gap is not.
4. **Never smooth a disagreement.** Where two scholars give different dates, send
   both with both names. The disagreement is more interesting than either date
   and the dataset has fields for it.

**The single most damaging thing you could send me** is a plausible date with no
passage and no scholar. It would be indistinguishable from the real ones, it
would make the collection's central table look finished, and it would be wrong
in the one place the whole project claims to be trustworthy.

---

# PART A — THE TRACEBACK (the priority, by a long way)

## What it is and why it is the most valuable thing here

The modern seven-cakra rainbow diagram is routinely presented as an ancient and
unchanging map of the body. **"Kundalini" is not one idea with one history.** It
is a word, a serpent, a coil, a sleep, an awakening, a central channel, two
lateral ones, a location at the base, a destination at the crown, a set of
wheels, a fire, a nectar, and a union — and each of those has its own earliest
attestation.

If it turns out that `nāḍī` is attested a thousand years before `kuṇḍalinī`, and
that the seven-cakra arrangement is later than both, **that is visible in one
screen and nowhere else in this collection.** That is the payoff, and it needs
nothing but dates.

## The form each answer must take

An element is either **filled** or **open**. There is no third state and no
free-text box where a plausible century can be typed.

**To fill one, all four of these:**

```
element:       (the key, exactly as listed below)
text:          (the work — e.g. "Haṭhayogapradīpikā")
passage:       (chapter and verse, or folio — NOT just the work)
dateText:      (as the scholarship states it, e.g. "mid-15th century")
startYear:     (a single integer, negative for BCE, for the timeline axis)
establishedBy: (the scholar or edition whose dating this is — REQUIRED)
quote:         (the passage itself, transliterated, if you have it)
translation:   (published translation + translator, or your own marked as yours)
```

**To leave one open, one thing:**

```
element:                 (the key)
whatWouldEstablishThis:  (what a researcher would have to find — be specific;
                          "read X" is better than "more research needed")
searched:                (where you actually looked, so nobody repeats it)
```

A date with no passage is not an attestation. A date with no scholar hides that
it is an argument. **Both are refused.**

## The twenty-six elements

Use these keys exactly. They already exist in the codebase and your answers are
filed against them.

**The word and the creature**

| key | what needs dating |
| --- | --- |
| `kundalini-word` | earliest securely dated occurrence of the word *kuṇḍalinī* |
| `kundalini-as-serpent` | earliest text describing it explicitly as a **serpent** — not merely as coiled |
| `coiled` | the coil itself as an attribute |
| `dormant` | described as sleeping or dormant |
| `awakening` | the awakening as an event to be brought about |
| `shakti` | identification with **Śakti** |

**A note on the first two, which is the point of splitting them.** *Kuṇḍalinī*
derives from a word for *coiled*. **A coil is not automatically a snake.** If the
serpent identification is later than the word, that is a real finding and the two
rows exist to show it.

**The channels and the route**

| key | what needs dating |
| --- | --- |
| `base-location` | located at the base of the body |
| `nadi` | *nāḍī* as a channel in the body |
| `sushumna` | *Suṣumṇā* by name |
| `ida` | *Iḍā* by name |
| `pingala` | *Piṅgalā* by name |
| `upward-movement` | movement upward through the body |
| `crown-destination` | the crown as the destination |

**The centres**

| key | what needs dating |
| --- | --- |
| `cakras` | *cakra* as a centre in the body |
| `seven-cakra-system` | **the seven-cakra arrangement specifically** |
| `lotus-imagery` | lotuses for the centres |
| `granthis` | *granthi* knots |
| `cakra-piercing` | piercing of the cakras |
| `sahasrara` | *Sahasrāra* by name |
| `ajna` | *Ājñā* by name |

**`seven-cakra-system` carries an extra instruction.** The table is incomplete
without the texts that give **other numbers**. If a source gives four, five, six,
nine or twelve centres, send it — a system presented as fixed and ancient turning
out to have competing counts is exactly the sort of thing this collection exists
to show.

**The physiology and the goal**

| key | what needs dating |
| --- | --- |
| `inner-fire` | inner heat as a practice or phenomenon |
| `prana` | *prāṇa* as vital force |
| `breath-retention` | breath retention as technique |
| `amrta` | *amṛta*, the nectar |
| `shiva-shakti-union` | union of Śiva and Śakti at the crown |
| `liberation-through-ascent` | liberation achieved **by** the ascent |

## Where to look — named as a trail, none of it read here

I have not opened any of these and I am not asserting what they say. They are
where I would start, and naming them is not a substitute for you checking them.

- **Mallinson & Singleton, *Roots of Yoga*** (Penguin Classics, 2017) — a
  sourcebook of translated passages organised by topic, with chapters bearing
  directly on the subtle body, the channels and *kuṇḍalinī*. If one book could
  fill half this table, it is probably this one.
- **David Gordon White, *The Alchemical Body*** — for the tantric and
  Siddha material and the history of the subtle body.
- **Sir John Woodroffe (Arthur Avalon), *The Serpent Power*** (1919) — the
  translation of the *Ṣaṭcakranirūpaṇa* that introduced most of this vocabulary
  to English. **Treat it as a primary source for the MODERN chain (Part C), not
  as authority for the ancient one.**
- Primary texts likely to matter: the *Haṭhayogapradīpikā*, the
  *Ṣaṭcakranirūpaṇa*, the *Kubjikāmata Tantra*, the *Netra Tantra*, the
  *Yogasūtra*, and the early *Upaniṣads*. Which of these actually carries the
  earliest attestation of each term is the question, not an assumption.

## The three disputed precursors, which stay separate

Three elements already carry a **precursor** — something that looks like the
later idea and is argued over. **"Something like this appears earlier" and "this
is attested earlier" are different statements** and the dataset keeps them in
different fields.

| element | the precursor on record | what I need |
| --- | --- | --- |
| `nadi` | *Chāndogya Upaniṣad* 8.6.6 and *Kaṭha Upaniṣad* 2.3.16 | the actual wording, a translation, and **who disputes the reading and on what grounds** |
| `upward-movement` | the same two passages — one channel going upward toward the head | as above; is the "hundred and one channels" passage really about the same thing? |
| `inner-fire` | Vedic *tapas* | is *tapas* a precursor of the yogic inner heat, or a different phenomenon given the same word? Name who argues each way. |

**Do not resolve these.** Record the dispute with names on both sides. A
precursor with no stated reason for the dispute degrades into a nod, and the
codebase enforces a minimum length on that field for exactly that reason.

---

# PART B — THE MODERN CHAIN (short, and unusually valuable)

The collection carries a claim genealogy for **"the serpent is a universal symbol
of the same inner energy, recognised independently by every ancient culture."**
Its verdict is `later_interpretation`. Two of its four links are **unread**, and
they are unread because I refuse to name a work from memory in a chain about
fabricated citations.

**B1.** Who, in nineteenth- or early twentieth-century **comparative mythology**,
made the step from "serpents appear in many cultures" to "they encode one
underlying idea"? I need an **author, a title, a date and a page**. One properly
cited example is worth more than a survey.

**B2.** Where does the specific claim that the shared referent is an **energy in
the body** enter? Theosophical and early twentieth-century esoteric writing is
the obvious place to look, and Avalon's *The Serpent Power* (1919) is the obvious
hinge, but I do not know that and will not write it down until someone has read
it.

**B3.** Is there a traceable moment when the **Gudea vase** (Louvre AO 190)
started being reproduced beside a cakra diagram? Earliest printed instance you
can find. This is the form the claim now circulates in — a visual pairing with no
sentence anybody signed — and dating the pairing would be a genuinely new
finding.

---

# PART C — GREECE, AND ONE THING TO CHECK AT FIRST HAND

The collection's **control record** rests on a single dated fact taken at one
remove: that serpent-legged Gigantes appear in Greek art **after about 380 BCE**,
where Archaic and Classical Gigantes are man-sized hoplites. It is currently
sourced to **Vian 1952** through another record in this repository, and Vian has
not been opened.

**C1.** Verify the date at first hand, and tell me **how firm the art-historical
consensus is**. If it is contested, the control record needs to say so — it is
currently the strongest counter-example in the collection and it must not be the
softest evidence.

**C2.** The **caduceus** (two serpents, winged staff, Hermes) and the **Rod of
Asclepius** (one serpent, no wings, medicine) are routinely confused, including
by medical organisations. When does the confusion start, and is there a published
account of it? This is a documented modern error about serpent symbolism, which
makes it directly useful here.

**C3.** Does any specialist in Greek religion or art connect the entwined-serpent
form to anything resembling a doctrine about the body? **I expect the answer is
no, and a well-evidenced no is a finding I will record**, not a wasted search.

---

# PART D — THE TRADITIONS THIS COLLECTION HAS NOT TOUCHED

Four records is not a cross-cultural collection. But the gap must not be filled
by scraping serpents from everywhere — that would build the exact pile the
collection exists to resist.

**So the question for each tradition below is deliberately narrow:**

> What does the serpent **do** in this tradition, according to specialists in it,
> and does any specialist connect it to energy, ascent, or the human body?

| tradition | the obvious starting point |
| --- | --- |
| China | the dragon/serpent and *qi*; the Daoist internal-alchemy body |
| Mesoamerica | Quetzalcoatl / Kukulkan — a feathered serpent, which is not obviously the same kind of thing |
| Norse | Jörmungandr, the world-encircling serpent; Níðhöggr at the root of Yggdrasil |
| West Africa | Dan / Damballa and the serpent-and-rainbow complex |
| Hebrew / Near Eastern | the *nāḥāš* of Genesis 3, and the Nehushtan of Numbers 21 |

**Two rules for this section, and the first one matters more than the research.**

1. **Some of these are living traditions with practitioners.** Damballa and
   Quetzalcoatl are not museum objects. Report what specialists **in** the
   tradition say wherever you can find it, and never describe a living practice
   in the past tense.
2. **The Hebrew serpent is where the strongest claims get made and where the
   evidence is thinnest.** Nehushtan — a bronze serpent on a pole that is later
   destroyed — is a favourite of the universalist literature. Treat it with the
   same care as the Pashupati seal: what the text says, and separately, what has
   been read into it.

**One record per tradition is enough for now.** I would rather have five careful
records than thirty thin ones, and the collection's own structure will make the
thinness visible if they are thin.

---

# PART E — SIX QUESTIONS

**E1.** What is the earliest **securely dated** occurrence of the word
*kuṇḍalinī*, and whose dating is that? *(This is the single most important
question in the brief.)*

**E2.** Is the seven-cakra system attested earlier or later than the word
*kuṇḍalinī*? Which texts give a different number?

**E3.** Where does the **rainbow colour scheme** for the cakras come from? It is
presented as ancient constantly. Is it? If it is modern, whose is it?

**E4.** Do specialists in Indian religion accept *Chāndogya* 8.6.6 as a precursor
of the *nāḍī* system, or is that a retrospective reading? Names on both sides.

**E5.** Is there **any** ancient source — not a modern comparativist — that
treats serpent symbols from more than one culture as the same thing? *(A
well-evidenced "no" here would firm up the collection's central verdict, so this
is not a throwaway question.)*

**E6.** What do the editors and translators of the tantric texts say they
**cannot** establish? Their own stated limits are worth more than anyone's
confidence, and they are the fastest route to an honest set of open elements.

---

## Return format

Grouped by part. For Part A, one block per element using the fill-or-open shape
above — **and please send the open ones too**, with what you searched. An element
you looked at and could not date is a result; the codebase has a field for it and
a test that stops the table reading as finished while it is not.

End with:

1. **FILLED** — the element keys you dated, with the four required fields.
2. **OPEN** — the element keys you could not, with where you looked.
3. **DISAGREEMENTS** — anywhere two scholars gave different dates, with both.

## What not to send

- A date with no passage, or a date with no scholar. Both are refused by the
  structure and one of them is worse than an empty row.
- A century supplied to fill a gap.
- A resolution of any of the three disputed precursors.
- A serpent from a tradition nobody has connected to anything, added because it
  is a serpent.
- Any claim about a living tradition sourced only to writers outside it.

The collection's whole claim on a reader is that it shows how much evidence sits
under each part of a system usually presented as seamless. **An empty row proves
that claim. A filled-in guess destroys it.**


---

## RETENTION RULE — KEEP THE COMPARISONS, LABEL THE STATUS

Do **not** exclude a serpent/body/ascent comparison merely because the historical connection is unverified. The collection is meant to preserve the comparison while making the evidential status impossible to miss. This does **not** relax the traceback standard above: an unattested connection must never be promoted into an attested ancient doctrine.

For every comparison, separate four questions wherever the evidence allows:

1. **Object/text/tradition** — is the underlying object, passage or tradition itself securely identified and dated?
2. **Interpretation** — who actually proposed the comparison, in what work, and when?
3. **Relation** — is this explicit Kundalini, a historical precursor, a related tradition, a cross-cultural parallel, a speculative/esoteric reading, or a modern development?
4. **Transmission** — is there evidence that the idea or motif travelled between the cultures, or is transmission unknown/unestablished?

A record may therefore contain a secure ancient object and an **unverified proposed Kundalini connection** at the same time. That is not a contradiction; it is the point of the schema. Preserve the object, preserve the resemblance, preserve the claimant if one can be found, and preserve the absence of a demonstrated transmission mechanism.

### Comparisons that must be retained rather than filtered out

The following are explicit research targets. Their presence here means **investigate and keep the comparison**, not “accept the proposed equivalence.” Attach as many directly relevant and related images as licensing/provenance allows, with image-level identification status where appropriate.

| comparison | secure material to establish | proposed connection to retain separately | default status until evidence improves |
| --- | --- | --- | --- |
| Gudea / Ningishzida libation vase | object, inscription, date, iconography, specialist account of Ningishzida | entwined serpents / central axis compared with Kundalini or subtle-body diagrams | ancient object may be secure; Kundalini equivalence unverified unless a sourced historical argument establishes more |
| Greek caduceus | Hermes, two-serpent staff, chronology and iconography | serpents read as Iḍā/Piṅgalā and staff as Suṣumṇā | cross-cultural/speculative unless a specialist historical connection is found |
| Rod of Asclepius | one-serpent healing staff and its Greek medical/religious context | serpent rising on a staff read as spinal/Kundalini ascent | cross-cultural/speculative unless demonstrated |
| Quetzalcoatl / Kukulkan | Mesoamerican feathered-serpent traditions in their own specialist context | feathered serpent identified with Kundalini or ascending inner energy | related/cross-cultural; transmission unestablished unless evidence says otherwise |
| Nehushtan / bronze serpent | Numbers 21, 2 Kings 18:4, archaeology and Hebrew scholarship | pole as spine and serpent as Kundalini | speculative/later interpretation unless ancient evidence is found |
| Jörmungandr | Norse textual/iconographic tradition | world serpent equated with Kundalini or inner energy | related/cross-cultural; no bodily-energy equivalence assumed |
| Egyptian uraeus | Egyptian textual/iconographic meaning and chronology of the forehead cobra | awakened Kundalini reaching brow/crown | speculative/later interpretation unless Egyptological evidence supports the bodily-energy claim |
| Djed pillar | Egyptian meaning, chronology and iconographic contexts | Djed as spine/central channel carrying Kundalini | speculative/later interpretation unless the anatomical/esoteric chain can be sourced |
| double helix / DNA comparison | modern discovery and structure of DNA plus the ancient serpent image being compared | claim that ancient double-serpent imagery encoded DNA | modern speculative comparison; ancient knowledge of DNA is not established by resemblance |
| universal primordial serpent-energy doctrine | the individual serpent traditions and their own meanings | claim that they descend from one lost worldwide teaching (including Atlantis/Lemuria variants where sourced) | hypothesis/later interpretation; common origin or transmission must not be inferred from resemblance alone |

### Image rule for these records

Do not use “unverified connection” as a reason to omit an otherwise relevant historical image. Prefer, in order: the actual object/manuscript; museum or holding-institution photography; excavation/publication plates; historically significant reproductions; then clearly labelled related imagery. If an image is itself securely identified but its claimed Kundalini significance is not, say exactly that. The image's status and the interpretation's status are separate.

### What would upgrade a comparison

A resemblance becomes historically stronger only when evidence supplies something beyond the resemblance: an ancient passage giving the relevant bodily meaning; a specialist reading grounded in the culture's own sources; a documented contact/transmission chain; or a traceable history showing who first made the comparison and how later writers inherited it. Until then, keep the comparison visible and label the gap.


---

## VERIFIED SOURCE PASS 01 — EARLY TEXTUAL CHAIN

**Status:** partial verification only. This section records what the current source pass can support without filling the remaining traceback from memory. It does not supersede the fill/open rules above.

### Early Kuṇḍalinī: keep the heart-stage separate from the later serpent-stage

**Sārdhatriśatikālottara 12.1–2 — candidate early Kuṇḍalinī attestation.** The critical-edition trail is N. R. Bhatt, *Sārdhatriśatikālottara* (Institut Français de Pondichéry, 1979). Modern specialist discussion by Shaman Hatley treats early tantric Śaiva material as central to the emergence of Kuṇḍalinī. The passage names *ādyā kuṇḍalinī* and places her in the region of the **heart**, with bud/sprout imagery and *amṛta*. This is important negative evidence against silently back-projecting the later base-of-spine sleeping-serpent system into every early occurrence.

**Do not yet mark `kundalini-word` FILLED solely from this note.** Before promotion to FILLED, the repository still needs the exact critically edited Sanskrit/transliteration, a published translation with translator named, and the specialist's explicit dating argument tied to this passage.

**Tantrasadbhāva — explicit serpentine development.** Published scholarship discussing this text reports Kuṇḍalinī/Śakti as curved and explicitly snake-like, including sleep/awakening imagery. This belongs in a separate developmental record from the Sārdhatriśatikālottara material. It is a candidate for `kundalini-as-serpent`, `dormant`, `awakening`, and `shakti`, but those elements remain OPEN until the exact passages, edition, published translation and dating authority are attached.

**Interpretive rule established by this pass:** *kuṇḍalinī* / coiled power is not automatically an explicit snake. `kundalini-word`, `coiled`, and `kundalini-as-serpent` remain independent traceback rows.

### Earlier channel/ascent precursors: do not relabel them Kuṇḍalinī

**Chāndogya Upaniṣad 8.6.6** and **Kaṭha Upaniṣad 2.3.16** belong in the precursor chain because they describe the heart's channels, one going upward toward the head/crown, with immortality associated with ascent by that route. They are evidence relevant to `nadi`, `upward-movement`, and `crown-destination`.

They do **not** by themselves establish Kuṇḍalinī, Suṣumṇā, Iḍā, Piṅgalā, a seven-cakra system, or a serpent rising through the spine. The research task remains to establish, with named specialists, whether treating these passages as precursors of the later nāḍī system is accepted or retrospective. Per the brief's original rule, that disagreement must not be resolved by the seed data.

### Traceback status after pass 01

**Candidate, not yet FILLED:** `kundalini-word`, `kundalini-as-serpent`, `coiled`, `dormant`, `awakening`, `shakti`, `nadi`, `upward-movement`, `crown-destination`, `amrta`.

**Still OPEN:** `base-location`, `sushumna`, `ida`, `pingala`, `cakras`, `seven-cakra-system`, `lotus-imagery`, `granthis`, `cakra-piercing`, `sahasrara`, `ajna`, `inner-fire`, `prana`, `breath-retention`, `shiva-shakti-union`, `liberation-through-ascent`.

The candidate rows remain unfilled deliberately: this pass found a stronger route to the primary evidence, but has not yet met the project's own requirement of passage + dating authority + exact text + published translation for each row.

### Image rule added during this pass

For textual-development records, do not attach a later chakra painting merely to make an early record visual. Prefer **no image** until a directly relevant manuscript, edition page, historical diagram or object is available. Across the track, duplicate crops, thumbnails and alternate resolutions of the same object do not count as additional evidence. A few materially different images are preferred to many near-duplicates.
