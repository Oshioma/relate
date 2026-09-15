# Timeline research briefs: the number 33, and the Brutus / Albion / Gogmagog cluster

Two large datasets have been specified and are **not yet built**. This file is the
spec, the research already done, and the reason the work is parked. It exists so
that none of it has to be reconstructed from a chat log.

---

## Why these are parked: this environment cannot reach the sources

Both briefs demand primary sources — verse numbers, Avestan terms, manuscript
dates, Latin wording, ancient-DNA study figures, civic records. The session that
drafted them could not open any of the hosts those live on. Measured, not
assumed:

```
www.wisdomlib.org      blocked by the network egress proxy
sacred-texts.com       blocked
www.iranicaonline.org  blocked
en.wikipedia.org       blocked
archive.org            blocked
www.gutenberg.org      blocked
commons.wikimedia.org  blocked (fetch; WebSearch against it still works)
```

`WebSearch` works and returns real snippets with real URLs, so a *source* can be
cited. What cannot be done from here is opening the text and reading the passage
— and both briefs turn on exactly that. Seeding a hundred records whose verse
numbers and study results were never actually read would break this repo's own
rule: **never fabricate a DOI, quotation, author, publication or URL; if a source
cannot be verified, don't seed it.**

**To unblock:** add those hosts to the environment's network policy. Then the
work below can be done properly.

---

## Research already completed (the 33 brief)

Established from search results, and worth keeping:

- **The Vedic 33 is solid.** Ṛgveda 8.30.2 addresses the gods collectively as
  "Three-and-Thirty Deities". The classification 8 Vasus + 11 Rudras + 12
  Ādityas + Indra + Prajāpati = 33 is attributed to the Śatapatha Brāhmaṇa;
  11.6.3.5 is a real locus for the Yājñavalkya "how many gods?" dialogue, which
  runs in parallel at Bṛhadāraṇyaka Upaniṣad 3.9. Yāska's Nirukta divides the 33
  across three planes of eleven. **Still to verify against the text:** the exact
  Ṛgvedic verse list, and whether the Dyaus/Pṛthivī variant and the
  Indra/Prajāpati variant are in different recensions.

- **The Buddhist 33 is inherited, on reference-work authority.** Trāyastriṃśa /
  Tāvatiṃsa is described as taking its name from "the 33 gods … an ancient
  mythological notion originating in vedic times", and the number is "not an
  enumeration of the gods who live there (there are far more) but a general term
  inherited from Vedic mythology". Śakra/Sakka is Indra. That is a **B —
  highly probable transmission**, not a speculation.

- **The Avestan 33 does NOT look ancient, and this is the brief's most useful
  negative finding.** Two searches failed to find any Avestan passage naming
  thirty-three divine beings. What does exist: in *present-day* Zoroastrianism
  the term Amesha Spenta "is frequently used to refer to the thirty-three
  divinities that have either a day-name dedication in the Zoroastrian calendar
  or that have a Yasht dedicated to them", and avesta.org's Afrinagan material
  mentions "thirty-three dedications in the Siruzas" — the Siroza being the
  thirty-day calendar text. So the online claim that the Avesta attests 33 lords
  alongside the Vedic 33 appears to rest on a **modern calendrical usage**, not
  on an Avestan doctrine. If that holds, the Proto-Indo-Iranian 33 hypothesis
  loses its Iranian leg and the Ṛgveda stays the oldest securely attested use.
  **Must be checked against Yasna 1.10 and the Visperad before being asserted.**

- **The brief's Śatapatha calculation did not verify.** "24 half-months + 6
  seasons + day + night + year = 33" was not found. Search surfaced two
  different things: a passage reading "twenty-four half-months, seven seasons,
  the two, day and night, and the year itself" (which totals 34, not 33), and a
  genuinely attested 33-fold decomposition that is **anatomical** — "ten fingers,
  ten toes, ten vital airs, two feet, and the trunk is the thirty-third". The
  proposed calculation may be a later synthesis. **Needs the primary text.**

---

## Schema gaps both briefs need

Neither brief can be expressed honestly with the vocabularies as they stand.

1. **Transmission classes A–G on event links.** Both briefs specify the same
   scale: A directly documented, B highly probable, C possible/plausible, D
   thematic parallel, E numerical coincidence possible, F later retrospective
   connection, G unsupported. `EVENT_RELATIONS` has `source_of`, `associated`,
   `identified`, `evidence_for`, `relevant`, `related` — which covers A/B and
   part of F, and has nothing that says "the same shape of story with no
   evidence either knew of the other" (D) or "numerically identical and probably
   for no reason" (E). D is required by the 33-daughters ↔ Watchers comparison,
   which is the single most load-bearing edge in the Brutus cluster.

2. **Viewpoints for esoteric and modern-occult readings.** `CLAIM_VIEWPOINTS`
   has `alternative` and `alternative_widespread`; both briefs distinguish an
   *esoteric interpretation* from a *modern occult interpretation* from a
   *later retrospective interpretation*, and collapsing the three loses the
   thing the datasets are for.

3. **A place to hang "what would confirm / what would falsify this".** The
   Brutus brief asks for it on every major claim. Nothing in `SeedClaim` holds
   it; `evidence` and `notes` would have to carry it by convention, or the type
   gains a field.

Do this work **with** the first tranche, not before it — a vocabulary added
speculatively is a vocabulary nobody uses correctly.

---

## Brief A — THE NUMBER 33

Investigate why 33 recurs across religion, cosmology, initiation and esotericism,
and determine for each case whether examples are historically connected,
inherited, independently developed, deliberately borrowed, retrospectively
connected by later occultists, or coincidence. **Particular interest: whether an
ancient chain can be established before Freemasonry.**

Core rule: never present speculation as established history; label every claim as
primary-source fact / mainstream scholarly / traditional religious / later
interpretation / esoteric / modern occult / speculative / unsupported. Do not
discard alternative claims — label them and say what evidence exists. **No
confidence scores.** The purpose is to let users compare interpretations, not to
have the application decide.

Sections, in the brief's own order:

1. **Vedic 33 gods** — Ṛgveda passages naming 33 / thrice-eleven; the 8+11+12+2
   classifications and why they differ; whether "330 million" developed
   linguistically or theologically from the older 33.
2. **33 as Vedic cosmology** — Śatapatha and other Brāhmaṇa 33-fold ritual
   structures; verify the 24-half-months formulation; relation to year,
   sacrifice, and to the 33 gods.
3. **Proto-Indo-Iranian 33** — *the critical section.* Avesta, Yasna, Yashts,
   Amesha Spentas, Yazatas, "33 lords". Check every claimed Iranian reference
   against the Avestan source. Then: is there enough to reconstruct a
   Proto-Indo-Iranian 33? Do not assign c. 2500–2000 BCE unless evidence
   supports it.
4. **Buddhist Heaven of the Thirty-Three** — Trāyastriṃśa/Tāvatiṃsa, Meru,
   Śakra; the 32-around-1 geometry and how early it is attested; whether the
   transmission Vedic 33 → Indra → Śakra → Heaven of the Thirty-Three is
   supported.
5. **Egypt** — search thoroughly; if there is no meaningful 33 tradition, record
   that explicitly, list the numbers that ARE important (3, 7, 9, 12, 42), and
   keep ancient evidence separate from later Hermetic claims about Egypt.
6. **Mesopotamia** — same; explain 60, 50, 40, 30; if 33 is absent, record it.
7. **Judaism** — Lag BaOmer (Lamed 30 + Gimel 3), earliest evidence, Shimon bar
   Yochai, Zohar, bonfires, when the 33rd day acquired mystical significance.
   Do not infer significance from anything that merely calculates to 33.
8. **Christianity — Jesus at 33** — make explicit that the New Testament does
   not state it; show how it is calculated; find the **earliest** source that
   explicitly claims it.
9. **Islam** — post-prayer dhikr 33×3; hadith collections and references;
   variants; 33×3 = 99 and its relation (if any) to the Names; tasbih and
   prayer-bead traditions, early textual practice kept apart from later beads.
10. **Enoch / Watchers / Nephilim** — any genuine numerical role for 33; do not
    count modern chapter numbering as ancient evidence; classify the relation to
    the British 33-daughters legend rather than asserting transmission.
11. **Medieval Britain — 33 mothers of the giants** — *Des Grantz Geanz*, the
    Brut tradition; earliest manuscript, composition date, language, the actual
    number in each manuscript, whether Diocletian is named, whether incubi are
    explicit, the word used for giants; Albina and Albion. **Why exactly 33?**
    Search the scholarship; do not guess.
12. **Gogmagog → Gog and Magog** — Geoffrey, Brutus, Corineus, Albion; when the
    biblical names merged with British giant mythology; keep Ezekiel 38–39 and
    Revelation 20 separate.
13. **Gog and Magog as guardians of London** — the full transformation with
    dates: Guildhall, Lord Mayor's Show, 1554, 1605, 1700s, modern statues.
14. **Wicker giants and processional effigies** — British and European
    comparisons; keep documented procession apart from proposed pagan survival
    apart from modern conspiracy reading; do not present Frazer-style
    sacrificial-survival theory as established.
15. **City of London guilds / livery companies** — who actually participates; do
    not call livery companies secret societies; investigate documented overlap
    with Freemasonry and other orders where evidence exists.
16. **Dante** — 33+1 / 33 / 33 = 100; Trinity symbolism vs Christ's age; what
    scholars actually argue.
17. **Rosicrucianism** — search the original manifestos for 33 rather than
    assuming modern readings; then trace later use.
18. **Freemasonry — why 33 degrees?** — Morin's 25-degree Rite of Perfection →
    the 33-degree system → Charleston 1801; the earliest document establishing
    33; test every proposed explanation against primary Masonic sources. **"The
    original reason for choosing 33 is uncertain" is a better answer than an
    invented one.**
19. **33 vertebrae** — the anatomy and its variation; when the vertebrae↔Jesus
    link first appears; whether any ancient Indian yogic text says kundalini
    rises through 33 vertebrae. If absent, label the connection a modern
    esoteric synthesis.
20. **Sacred secretion / "Christ oil"** — trace earliest sources; keep anatomy
    apart from symbolic claims; do not present unsupported biology as fact.
21. **Master number 33** — earliest books and authors; whether Pythagoras taught
    anything of the sort.
22. **Pythagoreanism** — genuine ancient significance of 33, if any; if the
    sources emphasise 1, 3, 4, 7, 10 and the tetractys but not 33, say so.
23. **Mithraism** — the claim of 33 degrees against the attested seven grades;
    mark unsupported if unsupported.
24. **Other traditions** — Taoism, Chinese folk religion, Shinto, Jainism,
    Sikhism, Tibetan, Bon, Greek, Roman, Celtic, Norse, Germanic, Slavic,
    African, Mesoamerican, Andean, Aboriginal Australian. **Negative findings are
    useful.** Do not force 33 where it is not significant.
25. **Transmission map** — the Indo-Iranian→Vedic→Buddhist chain; separately the
    Jesus→medieval numerology→Dante→Christian esotericism→Rosicrucian/Masonic
    chain; separately the 33 daughters→Albion→giants→Gogmagog→Gog and
    Magog→Guildhall chain, asking whether 33 survives past the first stage.
26. **A–G classification on every relationship.** No percentages.
27. **"Oldest three" section** — current candidates are the Vedic 33 gods, later
    Vedic 33-fold cosmology, and the Buddhist Heaven; test whether a genuine
    Avestan 33 should displace one and push the tradition earlier. Do not assume
    the ordering is right.
28. **Output shape** — chronological, oldest first, each record carrying
    tradition, culture, region, date range, BCE/CE, primary source and passage,
    original-language term, translation, what 33 represents, historical context,
    dating method, mainstream / traditional / alternative / esoteric readings,
    transmission evidence, earlier and later related events, scholarly sources,
    URLs, and disputes. **A date is a claim attributable to a source, never a
    single authoritative number.**
29. **Disputed records get multiple claims** — e.g. Ṛgvedic composition:
    mainstream dating, earlier scholarly dating, traditional Hindu chronology,
    each with claimant, method, viewpoint, supporting evidence and criticism.
    Do not collapse them.
30. **Sourcing priority** — primary texts, manuscript catalogues, archaeological
    reports, university publications, peer review, academic encyclopedias,
    religious bodies for their own doctrine, reputable translations, Wikipedia
    for orientation only, esoteric sources **only** as evidence that the modern
    esoteric interpretation exists.

Final questions the dataset should be able to answer: oldest secure use; whether
it predates the surviving Ṛgveda; whether a Proto-Indo-Iranian 33 is supportable;
whether Buddhist 33 is demonstrably inherited; when Christianity first fixed
Jesus at 33; why Islamic ritual took 33; why exactly 33 daughters; whether those
women relate to Watcher traditions; when Gogmagog became Gog and Magog; why
London's defeated giants became guardians; whether Masonic involvement in the
Gog/Magog tradition is documented; why the Scottish Rite settled on 33; the
earliest vertebrae↔ascent link; whether any ancient kundalini text mentions 33
vertebrae; which internet claims are unsupported; which traditions demonstrably
influenced each other; and whether there is one continuous ancient 33 tradition
or several independent ones later combined.

---

## Brief B — BRUTUS OF TROY / ALBION / GOGMAGOG

A flagship cluster, not a single event. Users must be able to see the traditional
account, the earliest surviving text, mainstream interpretation, archaeology,
ancient DNA, ancient testimony, historical-core hypotheses, cultural-memory
hypotheses, earlier-population hypotheses, esoteric readings, objections,
contradictions, later transformations and modern civic survival **side by side**.

Rules: an event has no canonical date — every date is a claim carrying source,
source date, source type, dating method, viewpoint, explanation, and whether it
is approximate / traditional / archaeological / genetic / textual / modern
reconstruction. **No confidence scores.** Do not debunk with dismissive language;
classify accurately. "Myth" may be a record type but must never end the
investigation — a legendary tradition can simultaneously contain invented
genealogy, propaganda, remembered geography, real places, distorted migration
memory, religious symbolism, etymological speculation, older oral tradition and
later additions.

Classification labels to support: established archaeology; established ancient
DNA; primary ancient testimony; medieval historical tradition; legendary history;
indigenous tradition; mainstream scholarly interpretation; historical-core
hypothesis; cultural-memory hypothesis; alternative interpretation; esoteric
interpretation; symbolic interpretation; later retrospective interpretation;
numerical parallel; possible transmission; unsupported at present; contradicted
by current evidence; unresolved. Plus transmission classes A–G as above.

The records to build:

- **Brutus of Troy comes to Albion** — traditional c. 1100 BCE, with *several*
  competing date claims from different chronicles and reconstructions. The full
  traditional account: Aeneas descent, the prophecy and the accidental killing of
  his father, exile, gathering the Trojan descendants, the westward journey, the
  oracle, the Mediterranean and North African/Mauretanian legs, Gaul, joining
  Corineus, Albion and its giants, the displacement, Corineus against Gogmagog,
  the renaming, Brutus as first king, Cornwall to Corineus, Troia Nova on the
  Thames, and the division among Locrinus, Kamber and Albanactus. **Make
  unmistakable that the giants are not in every early version** — *Historia
  Brittonum* has Brutus without Geoffrey's developed Gogmagog conquest. The
  textual growth must be visible.
- **Brutus appears in Historia Brittonum** (c. 829–830 CE) — disputed
  authorship, the Aeneas/Troy genealogy, three centuries before Geoffrey, the
  compiler's reference to more than one account of Britain's origins, manuscript
  transmission and surviving manuscript dates. Note plainly: this shows the
  tradition predates Geoffrey; it does **not** show Brutus existed c. 1100 BCE.
- **The documentary gap** — ~1,900 years from the traditional date to the first
  surviving documentation, then Geoffrey at c. 1136. Make it visually obvious,
  with a "why this matters" explanation.
- **Bronze Age context** — Troy VI/VII, the traditional Trojan War chronology,
  the Bronze Age Collapse, post-1200 BCE movements, the Sea Peoples, trade
  disruption, maritime mobility, Atlantic Bronze Age exchange. Do not say the
  Sea Peoples were Trojans unless a source argues it.
- **British tin in Mediterranean networks** — Cornwall and Devon, shipwreck
  ingots, eastern Mediterranean finds, isotope provenance and its limits,
  intermediary networks. State that British material demonstrably entered
  networks ultimately connecting Atlantic Britain with the Mediterranean —
  **not** that British ships sailed to Troy. Map with dotted lines where routes
  are uncertain.
- **Late Bronze Age migration into Britain** — the ancient-DNA record, with the
  c. 1000–875 BCE ancestry change in southern Britain; migrants closest in
  sampled data to continental western European populations; the proportion of
  later ancestry where the study supports it. Side by side with the traditional
  story, labelled **"structural correspondence — not identity"**. Do not equate
  the migrants with Trojans.
- **Case for a historical core** — fifteen contextual correspondences, labelled
  *evidence and contextual correspondences supporting investigation*, explicitly
  **not** "fifteen proofs".
- **Case against** — equally prominent: the documentary gap, no inscription, no
  grave, no DNA, no Trojan colony archaeology, no contemporary Near Eastern
  record, DNA pointing to continental western Europe, the rejected Brutus→Britain
  etymology, Trinovantum as likely reinterpretation of Trinovantes, the growth of
  the story, the giant episode's absence from the earliest account, and
  increasing supernatural material in later versions.
- **The Giants of Albion** — Geoffrey's narrative in detail, plus a displacement
  reading (earlier population → incomers → retreat → occupation → ceremonial
  defeat of the strongest), labelled as a reading and not a finding.
- **Earlier British populations and appearance** — Cheddar Man and
  DNA-based pigmentation prediction (millennia before Brutus, and not to be
  identified with Gogmagog); **Tacitus on the Silures** (c. 98 CE) with the Latin
  *colorati vultus* and *torti plerumque crines* and the honest translation
  range, plus his Iberian speculation; his contrast between Caledonians, Silures
  and southeastern Britons. Neither "sub-Saharan Africans" nor "slightly tanned
  northern Europeans" — keep close to the wording. Then the cultural-memory
  hypothesis, and the explicit limitation that no early source says Gogmagog or
  the giants were Black.
- **Bronze Age British pigmentation DNA** — individuals from 1500–800 BCE in
  Cornwall, Devon, Wales and southern England; pigmentation predictions,
  ancestry, reconstructions, isotopic mobility. Do not extrapolate from one
  specimen.
- **What might Brutus have looked like?** — the traditional genealogy against
  Late Bronze Age Anatolian/Aegean population genetics. A medieval painting is
  not evidence of Bronze Age phenotype. The answer is **"unknown"**, with
  hypotheses attached. Do not assert he was Black.
- **Memnon, king of the Ethiopians** — the Trojan cycle, Tithonus and Eos, the
  Achilles and Antilochus episode, the lost *Aethiopis*, surviving references,
  and ancient artwork showing Memnon with Ethiopian attendants. Relationship
  classified as *shared extended Trojan mythological network* — not as evidence
  about Brutus.
- **Trojan genealogy** — Dardanus → Erichthonius → Tros, branching to
  Ilus/Laomedon/Priam/Tithonus/Memnon and to Assaracus/Capys/Anchises/Aeneas and
  the legendary Brutus line, showing the two are on different branches, with
  variant genealogies where sources disagree.
- **Where did Dardanus come from?** — Troad, Samothrace, Arcadia, Italian
  Corythus traditions, and any genuinely sourced African/Libyan/Egyptian claim.
  **Do not invent African ancestry**; if no ancient source gives it, say so.
- **Prydein / Prydain** — the indigenous Welsh foundation identity set against
  the Brutus immigrant model; earliest occurrences, meaning, Welsh poetry and
  sovereignty traditions, Arthurian links, and whether it operates independently
  of Geoffrey. Present as *competing British origin traditions*.
- **Welsh giant traditions before Geoffrey** — *Culhwch ac Olwen*, Ysbaddaden
  Pencawr, Wrnach. Geoffrey did not invent British giants; that does not make his
  Giants of Albion a Bronze Age memory.
- **Gogmagog** — Goemagot, Gogmagog, Gogmagog Albionus and the later Gog/Magog
  confusion; size, strength, the oak-tree feat if the source has it, the
  wrestling, the cliff, Gogmagog's Leap, Cornwall, later appearance, civic
  transformation. Interpretation lanes: traditional, literary, colonial,
  historical-memory, indigenous-population, archetypal, esoteric, political.
- **Corineus** — the Trojan-linked warrior, Cornwall, the wrestling, the civic
  role, and any sourced later tradition giving him giant ancestry. Note that
  "giant" is not a stable category across these traditions.
- **Cornwall** — giants, Corineus, the etymology tradition, tin, Atlantic trade,
  prehistoric monuments. A geographic correspondence, not proof.
- **33 daughters of Albion** — the Diocletian legend, the husband-murder, exile,
  arrival, supernatural unions, giant offspring — and **manuscript variants
  tracked, including versions with 30 rather than 33. Do not silently
  standardise to 33.**
- **Genesis 6 / Watchers / 1 Enoch parallel** — a correspondence table
  (supernatural males, human women, forbidden union, giant offspring, violence,
  primordial setting), transmission routes through Josephus, Lactantius,
  Sulpicius Severus, Augustine, Syncellus, Testament traditions and medieval
  incubus demonology. Classification: *possible tradition-level transmission*.
  Do not claim direct copying of 1 Enoch.
- **The number 33 panel** — the bridge into Brief A, every connection labelled.
  No implication that they are one hidden system.
- **London civic giant timeline** — 1415 (Henry V, London Bridge, the gatekeeper
  giant and the keys), 1522 (Charles V, Hercules and Samson), 1554 (Mary I and
  Philip II; Corineus Britannus and Gogmagog Albionus), 1559 if supported, 1605,
  1672 (Thomas Jordan's giants, with primary quotation for the moving/talking
  details), 1708/09 (Saunders statues), 1741 (Boreman's liberty reading), 1782
  (the oath imagery), 1830–31 (political cartoons), 1940 (Blitz), 1953 (Evans
  replacements), 1993 (wicker revival, with the clergy objection if sourced),
  today.
- **The 1554 pairing** — Gogmagog Albionus against Corineus Britannus, as a
  before/after of Albion and Britain, with scholarly interpretations, and
  "before/after" labelled a modern scholarly reading unless it is a source
  phrase.
- **How Gogmagog became Gog + Magog** — dates, printed sources, civic records,
  biblical influence, the forgetting of Corineus. Do not claim deliberate
  biblical inversion without evidence.
- **Biblical Gog and Magog** — Ezekiel 38–39, Revelation 20, Ya'jūj and Ma'jūj,
  then the London naming, with labels: name borrowing / biblical resonance /
  possible symbolic inversion / unsupported deliberate anti-Christian theory.
- **Pagan effigy and sacrifice language** — quote official Lord Mayor's Show
  material minimally and accurately, with context. Do not imply London performs
  human sacrifice; present it as *historical interpretation used by the official
  civic tradition*.
- **Guilds and livery companies** — the Basketmakers, the Guild of Young
  Freemen, the Show. Civic institutions, not secret societies — with an esoteric
  interpretation lane available for symbolic readings.
- **Magog receives the phoenix** (1953) — Blitz destruction, replacement,
  the rebirth-after-fire symbolism, with the esoteric death/rebirth reading kept
  distinct from the official meaning.
- **The defeated enemy becomes the guardian** — the full transformation, compared
  cautiously with threshold guardians, St Michael and the dragon, St George,
  apotropaic figures, gargoyles, lamassu. Do not flatten the traditions.
- **"They know" — the elite-memory hypothesis** — the observations that support
  it (centuries of continuity, Guildhall placement, royal entries, rebuilding
  after destruction, ceremony, guild participation, the phoenix, the liberties
  language) and the counter-evidence (no archive, ordinary civic tradition
  explains symbolic survival, meanings demonstrably changed, pageantry preserves
  mythology without asserting history). Marked neither true nor false.
- **Can medieval European art tell us what ancient people looked like?** —
  Balthazar, Saint Maurice, Andromeda, biblical figures in contemporary European
  dress. Conclusion: later European art cannot establish Brutus's or Gogmagog's
  appearance.
- **Ancient Africans in classical art** — Memnon and his attendants, Black
  African head vessels, other securely identified figures, to counter the claim
  that ancient artists could not depict African phenotypes distinctly.
- **Africans in Roman Britain** — the Ivory Bangle Lady, Septimius Severus,
  imperial mobility. Centuries after the traditional Brutus date; evidence that
  Britain was not ethnically isolated, **not** evidence of Bronze Age Africans in
  Britain.
- **"Earlier people become supernatural" comparisons** — giants, trolls,
  fairies, underground people, demons, wild men, primordial races, across
  British, Irish, Scandinavian and other traditions, with real scholarly support
  only. Labelled *comparative cultural-memory hypothesis*.
- **Ireland / Lebor Gabála Érenn** — Cessair, Partholón, Nemed, Fir Bolg, Tuatha
  Dé Danann, Milesians, the Fomorians, with the actual archaeogenetic migration
  phases shown beneath the legendary sequence. No claim of direct equivalence.
- **Did Brutus found New Troy?** — Troia Nova → Trinovantum → London as one
  claim, and the linguistic objection deriving Trinovantum from the Trinovantes
  as another. Both claims, no forced date.
- **The Trinovantes** — the real Iron Age record, classical attestations,
  southeastern Britain, the early Roman period, and the possible role in the
  etymology.
- **Political use of Gog and Magog** — civic champions, defenders of liberties,
  witnesses to government ritual, cartoon figures, protectors of City
  independence; the 1782 oath print, the 1830/31 cartoons, Boreman 1741.
- **What would change the case?** — on each major claim: what would strengthen
  it (a Bronze Age British inscription, a Mediterranean inscription describing
  migration to Britain, Anatolian colony archaeology, an eastern Mediterranean
  population signal in a relevant cemetery, traceable material culture, a
  pre-Roman western source with the same tradition, a burial independently linked
  to the founder tradition) and what would weaken it (tracing the genealogy to a
  known medieval invention, showing the migration has no plausible eastern
  Mediterranean component, showing the geography is medieval wordplay, or
  identifying the giant episode as a literary borrowing).
- **Contradictions are part of the product** — Brutus populates an empty Britain
  in one version and conquers giants in another; Prydein implies indigenous
  origin where Brutus implies immigration; Gogmagog starts as enemy and ends as
  guardian; Corineus starts as giant-killer and is later blurred with giant
  ancestry; the pair changes identity entirely when it becomes Gog and Magog.

**Images:** a large archive, prioritising primary and historic visuals —
Historia Brittonum and Geoffrey manuscripts, medieval Brutus and Corineus/
Gogmagog images, Troy archaeology, tin ingots, ancient ships, trade maps, Memnon
vase paintings, Greek representations of Ethiopians, Tacitus manuscripts,
archaeological and DNA migration maps, early Welsh manuscripts, Guildhall
engravings, old Lord Mayor's Show images, the Saunders statues, the 1782 oath
print, the 1830/31 cartoons, Blitz photographs, the 1953 figures, the modern
Guildhall pair, modern wicker giants. Each with title, date, creator,
institution, what it depicts, why it matters, and **whether it is primary
evidence, later representation, reconstruction or modern interpretation**. Never
present a modern reconstruction as an ancient image. *(This repo's existing
picture rules already enforce most of that: `shows` must be a media kind, every
caption carries or requests its credit, and `later_artwork` and `reconstruction`
print a warning.)*

**Event page tabs requested:** Overview, Tradition, Earliest Sources,
Archaeology, Ancient DNA, Appearance, Giants of Albion, Gogmagog, Prydein,
Mediterranean Connections, London, Alternative Interpretations, Esoteric
Connections, Case For Historical Core, Case Against, Images, Sources, Claims.

**Evidence graph:** central node Brutus of Troy, edges stating relationship type
— genealogy claim, textual influence, chronological parallel, geographic
connection, archaeological context, genetic context, symbolic transformation,
possible transmission, later reinterpretation.

**Goal:** a user starting from "Was Brutus of Troy real?" can walk the whole
chain without the application ever forcing a choice between "everything
traditional is true" and "everything traditional is fiction". The questions it
keeps asking instead: what does the source actually say; when does the claim
first appear; what real-world evidence exists; what changed between versions;
could this preserve cultural memory; what is the strongest alternative; what is
the strongest objection; what evidence would settle it.

---

## What already exists in this repo

- Giants datasets: `giants-hebrew-seed.ts` (Nephilim, Watchers, Book of Giants,
  Goliath), `giants-greek-seed.ts` (Gigantomachy, the bone-finding reports,
  Polyphemus, Mediterranean fossil beds), `giants-mesopotamia-seed.ts`
  (Gilgamesh, Ullikummi, Humbaba, Nimrod). The Hebrew file is the natural
  attachment point for the Watchers ↔ 33-daughters edge.
- **Nothing on Brutus, Albion, Gogmagog, Corineus, Prydein, the Silures, the
  Trinovantes, Guildhall or the Lord Mayor's Show.** The British giants tranche
  was already owed and has not been started.
- The claim/viewpoint/relationship machinery, the picture rules, and the
  multiple-claims-per-event model are all in place and fit both briefs.

## Progress

- **BUILT: 33, tranche 1** — `thirty-three-vedic-seed.ts`. Seven records: the
  Rgveda's thirty-three, the Brahmana classification, the Yajnavalkya dialogue,
  the Buddhist Heaven of the Thirty-Three, the unresolved Avestan question, the
  Proto-Indo-Iranian hypothesis (carrying no date, deliberately), and the
  330-million koti reading. Built from search results with the primary texts
  unreachable; most claims carry NEEDS SOURCE VERIFICATION naming what to check,
  and a test fails if those flags are edited away.

  **What a reader with the books open should check first**, in order of how much
  turns on it: (1) whether any Avestan passage names thirty-three divine beings
  — the whole Proto-Indo-Iranian question rests on it; (2) the Satapatha
  passage, and whether the Indra/Prajapati and Dyaus/Prthivi enumerations are
  different passages or different recensions; (3) the earliest canonical Pali
  reference to Tavatimsa, which is the weakest date in the tranche; (4) the
  philology of *koti*, where the available sources are devotional rather than
  lexical.

## Suggested order when sources are available

1. Schema: A–G transmission classes, esoteric/occult viewpoints, and a home for
   "what would confirm / falsify this" — built alongside the first tranche.
2. **33, tranche 1:** Vedic → Buddhist chain plus the Avestan negative finding.
   Small, strongly sourced, and settles the brief's central question.
3. **Brutus, tranche 1:** Historia Brittonum, Geoffrey, the documentary gap, the
   Giants of Albion, Gogmagog, Corineus — the textual spine, which needs
   manuscript scholarship but no science.
4. **Brutus, tranche 2:** Bronze Age context, tin networks, the ancient-DNA
   migration record, the case for and the case against.
5. **Brutus, tranche 3:** Albion's 33 daughters, the Watchers comparison,
   Prydein, Welsh giants, Ireland.
6. **Brutus, tranche 4:** the London civic timeline through to the phoenix and
   the modern Show.
7. **33, remaining tranches:** Judaism, Christianity, Islam, Dante,
   Rosicrucianism, Freemasonry, vertebrae, numerology — and the negative
   findings for Egypt, Mesopotamia, Pythagoras and Mithraism.
