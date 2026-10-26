# Ancient Wisdom & Emerald Tablets archive — Stage 1 audit and plan

As of 2026-10-16. Community: `squidgeoverskool` (timeline at
`squidgeoverskool.relate.click/timeline`). Supabase project `relate`.

This is the Stage 1 deliverable: what already exists, how big the full scope is,
what may legally be included, where verified imagery lives, what the schema
needs, the order of work, and what could break. Nothing in this document claims
any corpus is complete. Expected counts are the counts of the named reference
edition or catalogue; every one is marked with how sure the figure is.

---

## 1. What already exists

### 1.1 Data model (already built, and the right foundation)

The timeline was built around one rule that this archive needs: **an event has
no date; dates live on claims**. Every concept the brief asks for already has a
home, and the archive extends these tables rather than replacing any of them.

| Need in the brief | Existing structure | File |
|---|---|---|
| A text placed at its documented date | `timeline_events` + several `timeline_date_claims` | `20260910110648_timeline_core.sql` |
| Five separate chronological concepts | date claims with `what_is_dated`, `temporal_claim_type`, `chronology` (viewpoint), `date_convention` | `20260911180041_temporal_claim_types.sql`, `20260912083905_dating_conventions_and_motifs.sql` |
| Never inventing precise dates | `date_precision`, `is_approximate`, `uncertainty_*`, positionless claim types (`unknown`, `primordial`…) | `20260910122159_timeline_v1_hardening.sql` |
| Passages of a text | `timeline_text_passages` (label, reference, object, institution, accession) | `20260916072636_timeline_evidence_layers.sql` |
| Original text / transliteration / several translations / summary / interpretations | `timeline_text_layers` — one row per rendering, each with its own source and viewpoint; a copyrighted translation may be a citation with no text (`content_absent_reason`) | same |
| Bibliography with provenance | `timeline_sources` (+ `cited_by_source_id`, `quotation`, `accessed_on`) and `timeline_claim_sources` | `…_timeline_source_provenance.sql`, `…_timeline_claim_sources.sql` |
| Record-to-record connections | `timeline_event_links` (`EVENT_RELATIONS`, viewpoint, source, note) | `20260911172256_timeline_event_links.sql` |
| How a claim travelled through history | `timeline_claim_genealogies` + `timeline_genealogy_links` | `20260923231400_timeline_claim_genealogies.sql` |
| Image provenance | `media` jsonb on events/periods, typed by `SeedPicture` (institution, accession, licence, `shows`, `identificationStatus`, `duplicateOf`, provenance status) | `src/lib/timeline/seed-types.ts` |
| Comparison lanes | `timeline_tracks` (`region` / `theme`) + `timeline_event_tracks`; `compare-lanes.tsx` | `timeline-view.tsx` |
| Hierarchical zoom without crowding | prominence tiers, importance selection, clustering, 400-event window cap | `src/lib/timeline/layout.ts`, `prominence.ts` |
| Alternative views kept apart | `CLAIM_VIEWPOINTS`, `TIMELINE_EVENT_TYPES` (`mainstream` … `alternative`, `disputed`) | `src/lib/timeline/taxonomy.ts` |

### 1.2 Interface

- Main strip (`timeline-canvas.tsx`) with log/linear scale, deep-time and BCE/CE
  formatting (`time.ts`), jump-to-date, overview scrollbar, period bands.
- Inline event detail (`event-detail.tsx`) with date-claim cards, viewpoint
  comparison, related records and an image grid. **There is no lightbox or zoom;
  images are cropped by `object-cover`.**
- Standalone record page (`timeline/[eventSlug]`) is the only place that renders
  passages and layers (`evidence-chain-panel.tsx`), with toggles for original /
  transliteration / translation / meaning. This is the seed of the passage reader.
- Compare mode: lanes are tracks. It is React state only; there is no URL parameter
  for it yet.
- Sub-pages: `/timeline/coverage`, `/timeline/comparison` (motif grid), `/timeline/map`.

### 1.3 Content already in the squidgeoverskool timeline (live database)

332 events, 621 date claims, 457 sources, 204 links, 30 tracks, **3 passages and 8
layers** (on 2 events). Records directly relevant to this archive:

| Existing record (slug) | Use in the archive |
|---|---|
| `plato-timaeus-critias` — Plato writes the Timaeus and Critias (c. 360 BCE) | becomes the timeline anchor for both Plato works; no duplicate event |
| `atlantis-destruction` — 12 competing date claims | the "date of the event described" for Plato and Doreal; linked, not copied |
| `set-in-the-pyramid-texts` (inscribed c. 2350–2150 BCE) | thematic record; Pyramid Texts work gets its own corpus record and links here |
| `horus-conception-pyramid-texts` — passage "Teti spell 198" (Allen 2005) | existing passage; will be adopted into the Pyramid Texts hierarchy by key, not re-imported |
| `set-in-the-coffin-texts` (c. 2100–1700 BCE) | thematic record, linked from the Coffin Texts work |
| `nag-hammadi-library-discovered-in-egypt` (1945) | discovery event for the Gnostic codices |
| `gospel-of-thomas`, `gospel-of-truth-gnostic-texts` | existing Nag Hammadi records; linked from the inventory |
| `typhonian-magic-greco-roman` (PGM, 2nd c. BCE–5th c. CE) | context for "magic and sacred words" |
| `plutarch-on-isis-and-osiris` | context for "Thoth and Hermes" |
| `blavatsky-lemuria-root-race`, `steiner-lemurian-epoch`, `crowley-cairo-1904` | modern esoteric anchors |
| Solon's journey to Egypt; "You remember one deluge only…"; Around 9600 BCE | Plato context already researched |

The Set/Sutekh, Horus and Serpent datasets already contain Egyptian
religious-text research with sources and pictures that the Egyptian stages will
cite instead of re-researching.

### 1.4 Import pipeline

Seeded datasets are TypeScript files (`src/lib/timeline/*-seed.ts`) pushed into
the database by staff buttons (`seedDataset` in `timeline/actions.ts`),
idempotent by event slug, with a "Check for corrections" refresh that never
overwrites rows a person has edited. Pictures are copied into Supabase storage
by `bring-in-image.ts`. This works well for tens of events; it is **not** sized
for thousands of passages (one server action, one request, matched by label).

---

## 2. Size of the complete scope

Unit = the conventional citable division of the reference edition (utterance,
spell, chapter, Stephanus section, treatise section…). "Confidence" says how
sure the expected count is before it has been checked against the edition.

### A. Ancient Egyptian

| # | Work | Reference edition / catalogue | Expected units | Confidence |
|---|---|---|---|---|
| 1 | Pyramid Texts | Sethe, *Die altägyptischen Pyramidentexte* (1908–22): Utt. 1–714 (§§1–2217); Faulkner (1969) supplementary Utt. 715–759 | 759 utterances, ~2,300 §§; plus later finds (Leclant/MAFS) in Allen's per-pyramid numbering | High for 714/759; later finds to inventory |
| 2 | Coffin Texts | de Buck, *The Egyptian Coffin Texts* I–VII (1935–61) | 1,185 spells (incl. Book of Two Ways) | High |
| 3 | Book of the Dead | Lepsius (1842) 1–165, extended to 192 (Naville, Budge, Allen); Totenbuch-Projekt Bonn catalogue of manuscripts | ~192 numbered spells, with gaps and variant spells; ~3,000 catalogued witnesses (Bonn) | Medium |
| 4 | Amduat | Hornung, *Das Amduat* (1963–67) | 12 hours × 3 registers + introduction + Short Amduat; figures numbered by Hornung (several hundred) | Medium — figure total to verify |
| 5 | Book of Gates | Hornung, *Das Buch von den Pforten des Jenseits* (1979–80) | 12 hours/divisions, 12 gates (count of gates differs by copy), ~100 scenes | Medium |
| 6 | Book of Caverns | Piankoff (1942–46); Werning, *Das Höhlenbuch* (2011) | 6 sections + final scene | Medium |
| 7 | Book of the Earth | Piankoff (1953); Roberson (2012) | 4 parts (A–D), scene count to verify | Low |
| 8 | Book of Thoth | Jasnow & Zauzich (2005; 2021) | 40+ Demotic papyrus fragments, reconstructed into numbered sections; reconstructions kept as a separate layer | Medium |
| 9 | Wisdom literature | Ptahhotep (P. Prisse, BnF; 37 maxims + prologue/epilogue), Kagemni (P. Prisse), Merikare (P. Hermitage 1116A + Moscow, Carlsberg), Amenemope (BM EA 10474; 30 chapters), plus Hardjedef, Amenemhat, Any, Khety, Loyalist, Ankhsheshonq, P. Insinger | ~12 compositions, ~400 units | Medium — inventory documented per work |
| 10 | Temple and ritual texts (Thoth, Ma'at, Heka, Amentet, Duat, ascent) | Open-ended. Proposed inventory: Memphite Theology (Shabaka Stone, BM EA 498), Book of the Heavenly Cow, Litany of Re, Book of Nut, Opening of the Mouth, Books of Breathing, Edfu/Dendera Thoth and Ma'at inscriptions, Hermopolitan cosmogony texts | ~10 works; counts per work once chosen | Low — this is the category that needs an agreed list |

### B. Greek and Hermetic

| # | Work | Reference | Expected units | Confidence |
|---|---|---|---|---|
| 11 | Timaeus | Stephanus 17a–92c (Burnet OCT) | ~370 Stephanus sections; Atlantis 20d–25d | High |
| 12 | Critias | Stephanus 106a–121c (breaks off) | ~76 sections | High |
| 13 | Corpus Hermeticum | Nock & Festugière (1945–54): CH I–XIV, XVI–XVIII (no XV) = 17 treatises | ~240 numbered sections | High for 17; section total to verify |
| 14 | Asclepius | Latin, 41 chapters; Coptic NHC VI,8 parallels §§21–29 | 41 | High |
| 15 | Definitions of Hermes Trismegistus to Asclepius | Armenian (Mahé 1982), 10 chapters; Greek fragments (P. Vindob., Oxford Clarke 11) | ~50 aphorisms | Medium |
| 16 | Stobaean Hermetic fragments | Nock & Festugière III–IV: SH 1–29; Korē Kosmou = SH 23 | 29 excerpts (~70 sections in SH 23) | High |
| 17 | Poimandres | = CH I, sections 1–32 — **reader view onto CH I, no separate copy** | 32 (shared) | High |
| 18 | Related Greek texts | Proposed: Chaldean Oracles, Mithras Liturgy (PGM IV 475–829), Iamblichus *De Mysteriis*, Plutarch *De Iside*, Ptolemy *Tetrabiblos* (planetary rulers), Macrobius *In Somnium Scipionis* I.12 (descent through the spheres) | per work | Low — include only with a demonstrated connection |

### C. Gnostic and related

| # | Work | Witnesses | Expected units | Confidence |
|---|---|---|---|---|
| 19 | Apocryphon of John | NHC II,1 and IV,1 (long); NHC III,1 and BG 8502,2 (short); Irenaeus *Adv. Haer.* I.29 parallel | ~80 synoptic sections × 4 versions (Waldstein & Wisse) | Medium |
| 20 | Pistis Sophia | Codex Askew (BL Add MS 5114) | 4 books, 148 chapters (Schmidt) | High |
| 21 | Hypostasis of the Archons | NHC II,4 (86,20–97,23) | ~30 sections | Medium |
| 22 | Nag Hammadi writings | 13 codices, 52 tractates (~46 distinct works), plus BG 8502 and Codex Tchacos | inventory of each included work; proposed set: On the Origin of the World, Eugnostos, Sophia of Jesus Christ, Discourse on the Eighth and Ninth, Prayer of Thanksgiving, Zostrianos, Allogenes, Three Steles of Seth, Trimorphic Protennoia, Apocalypse of Adam, First Apocalypse of James, Gospel of Mary (BG 1) | High for 52; per-work counts to verify |
| 23 | Other ascent / archon texts | Origen *Contra Celsum* VI.22–38 (Ophite diagram, Mithraic seven gates), Ascension of Isaiah, 2 Enoch, Irenaeus *Adv. Haer.* I | per work | Medium |

### D. Arabic and medieval

| # | Work | Versions | Expected units | Confidence |
|---|---|---|---|---|
| 24 | Historical Emerald Tablet | Arabic: *Sirr al-khalīqa* (Balīnūs) version; Jābirian *Kitāb Usṭuqus al-uss al-thānī* (Holmyard 1923); *Sirr al-asrār* version. Latin: Hugo of Santalla (12th c.); Vulgate *Tabula Smaragdina*; Bacon's edition; 1541 Nuremberg print; Newton's translation (King's College Keynes MS 28) | ~14 lines × ~8 versions (kept separate) | Medium — Ruska (1926) is the reference inventory |
| 25 | *Sirr al-khalīqa* | Weisser (1979) Arabic edition; Hugo of Santalla's Latin *De secretis nature* | 6 books / treatise sections | Medium |
| 26 | *Secretum Secretorum* | Arabic short and long recensions; Latin John of Seville (partial, c. 1120), Philip of Tripoli (full, c. 1230); Bacon (Steele 1920); Middle English (Steele 1898) | 8–10 books; ~600 Latin manuscripts — section-level import, manuscripts sampled | Medium |
| 27 | Medieval Tablet commentaries | Hortulanus (14th c.; English 1597), Bacon's gloss, later printed commentaries | per commentary | Medium |
| 28 | Related Arabic texts | Proposed: *Turba Philosophorum*, Ibn Umayl *al-Māʾ al-waraqī*, *Ghāyat al-ḥakīm* (Picatrix: planetary spirits) | per work | Low |

### E. Modern esoteric

| # | Work | Edition | Expected units | Confidence |
|---|---|---|---|---|
| 29 | Doreal, *The Emerald Tablets of Thoth-the-Atlantean* | Brotherhood of the White Temple, Sedalia, Colorado (publication year given variously, 1925–1939) | Tablets I–XIII + supplementary XIV–XV = 15; paragraph-level references | High for 15 |
| 30 | Blavatsky | *Isis Unveiled* (1877), *The Secret Doctrine* (1888) | selected passages by volume:page (Hermes, Smaragdine Tablet, Atlantis, root races, Stanzas of Dzyan) | — (selection) |
| 31 | Steiner | *Aus der Akasha-Chronik* (1904–08; Eng. *Atlantis and Lemuria* 1911), *Die Geheimwissenschaft im Umriss* (1910) | selected chapters | — |
| 32 | Manly P. Hall | *The Secret Teachings of All Ages* (1928) | selected chapters (Hermes, Atlantis, Isiac Table, alchemy) | — |
| 33 | Other 19th–20th c. | Donnelly *Atlantis* (1882), Scott-Elliot *Story of Atlantis* (1896), Kingsford & Maitland *The Virgin of the World* (1885), *The Kybalion* (1908) | selected passages, only where a documented parallel exists | — |

### Total

Roughly **5,000–6,500 passage records**, plus **1,000+ manuscript-witness rows**
(the Book of the Dead and the Apocryphon of John alone account for most of the
witness rows), and an estimated **1,500–3,000 candidate connections** of which
only the evidenced ones will be published. About 45 works carry their own
timeline marker; everything else is reached through its parent text, as Oshi
asked.

---

## 3. What can legally be included in full

The ancient texts themselves are public domain. **Modern editions and
translations are not automatically**, and each layer row records its own
licence. The rule used throughout: full text only where the specific
edition/translation is public domain (or openly licensed) in the US, where the
site is hosted; otherwise a citation row with no text, plus a short quotation
where that is fair dealing/fair use, plus our own summary.

| Work | Full text allowed (edition) | Reference-and-excerpt only |
|---|---|---|
| Pyramid Texts | Hieroglyphic text (Sethe 1908–22, PD). English: Mercer 1952 — **believed US PD (copyright not renewed, per sacred-texts and ETANA); not PD in UK until 2039**. Treat as US-only full text after a renewal-record check. | Faulkner 1969, Allen 2005/2015 |
| Coffin Texts | Hieroglyphic text (de Buck) — ancient text; our own transliteration. **No PD English translation exists.** | Faulkner 1973–78, Carrier |
| Book of the Dead | Budge, *The Papyrus of Ani* (1895) and *The Chapters of Coming Forth by Day* (1898) — PD | Faulkner, Allen 1974, Quirke 2013 |
| Amduat, Gates | Budge, *The Egyptian Heaven and Hell* (1905) — PD | Hornung, Abt & Hornung, Darnell |
| Caverns, Earth | — | Piankoff, Werning, Roberson; Budge 1905 gives only partial notices |
| Book of Thoth | — | Jasnow & Zauzich (all copyrighted); facts + short quotes only |
| Wisdom | Gunn 1906 (Ptahhotep, Kagemni); Griffith 1926 and Budge 1924 (Amenemope); Gardiner 1914 (Merikare) — PD in the US | Lichtheim, Simpson, Parkinson |
| Plato | Greek: Burnet OCT (PD), via Perseus Digital Library XML (CC BY-SA). English: Jowett 1892 (PD); Bury 1929 Loeb (US PD from 2025) | Lee, Cornford, Zeyl |
| Corpus Hermeticum, Asclepius, Stobaeus | Greek: Parthey 1854, Reitzenstein 1904 (PD). Latin Asclepius: Thomas 1908 (PD). English: Mead 1906, Everard 1650, Chambers 1882 (PD) | Nock–Festugière Greek, Copenhaver 1992, Salaman |
| Definitions | — | Mahé; Salaman et al. 1999 |
| Apocryphon of John, Hypostasis, other NH | Irenaeus (ANF, PD) for the parallel only. **No PD English of the Coptic texts.** | Robinson NHL, Layton, Waldstein & Wisse, Meyer; Coptic transcriptions in modern editions are copyrighted as editions |
| Pistis Sophia | Mead 1921 (2nd ed.; PD) | Schmidt–MacDermot 1978 |
| Emerald Tablet | Holmyard 1923 English of the Jābirian version; Newton's translation (17th c.); Latin vulgate; Ruska 1926 (German, US PD) | Weisser 1979 Arabic, modern translations |
| Secretum Secretorum | Steele 1920 Latin (Bacon); Steele 1898 Middle English — PD | Manzalaoui 1977, Badawi 1954 |
| Doreal | **No.** Treat as copyrighted: tablet/paragraph identifiers, brief quotations, our own analysis, links to authorised editions | everything |
| Blavatsky, Steiner (German and 1911 English), Donnelly, Scott-Elliot, Kybalion, Kingsford | PD — full passages allowed | later translations of Steiner |
| Manly P. Hall 1928 | US PD since 2024; not PD in UK/EU until 2061. **Owner decision needed:** treat as excerpt-only (safe default used here) | all other Hall works |

Reachable from the build environment: archive.org full texts and the Perseus
GitHub XML are reachable; sacred-texts, Gutenberg and Wikisource are not, so
imports will use archive.org scans of the same PD editions.

---

## 4. Collections with verified manuscript imagery

| Collection | What it holds for this archive | Licence (as stated by the institution — rechecked per image at import) |
|---|---|---|
| Metropolitan Museum of Art (Open Access) | coffins with Coffin Texts, Book of the Dead papyri (e.g. Nany), Amduat papyri | CC0 — best case |
| British Museum | Papyrus of Ani EA 10470, Hunefer EA 9901, Amenemope EA 10474, Shabaka Stone EA 498, coffin of Gua (Book of Two Ways) | CC BY-NC-SA 4.0 — non-commercial; see risk R6 |
| Louvre (collections.louvre.fr) | Book of the Dead papyri, Pyramid Text fragments, coffins | mostly "© Musée du Louvre"; some free; per-image check |
| Museo Egizio, Turin | Iufankh papyrus (Lepsius's Book of the Dead), Turin papyri | per-image |
| Griffith Institute (Oxford) | Topographical Bibliography, archival photographs of tomb walls | per-image |
| Digital Egypt for Universities (UCL) | Pyramid Texts and wisdom-text pages, object photos | academic use; per-image |
| Totenbuch-Projekt Bonn | catalogue of Book of the Dead manuscripts (inventory, not images) | catalogue data |
| Heidelberg Papyrus collection / UB Heidelberg | Demotic and Greek papyri; digitised manuscripts | many CC BY-SA 4.0 |
| Bibliothèque nationale de France (Gallica) | Papyrus Prisse (Ptahhotep, Kagemni), Plato Paris. gr. 1807, Arabic and Latin Secretum and Emerald Tablet manuscripts | free for non-commercial use |
| Vatican Library (DigiVatLib) | Greek Plato and Hermetic manuscripts, Latin Secretum | non-commercial |
| British Library | Codex Askew (Pistis Sophia, Add MS 5114), illuminated *Secretum* (Add MS 47680) | per-item; many PD-scan |
| Bodleian (Digital Bodleian) | Clarke Plato (MS. E.D. Clarke 39), Bruce Codex (MS. Bruce 96) | CC BY-NC 4.0 |
| Biblioteca Medicea Laurenziana | Laur. 71.33 (Corpus Hermeticum), Ficino's Pimander | per-image |
| Claremont Colleges Digital Library | Nag Hammadi Codices photographic archive | restricted; per-image |
| Staatliche Museen zu Berlin | Berlin Gnostic Codex BG 8502; Book of Thoth papyri | CC BY-NC-SA |
| Wikimedia Commons | Unas/Teti pyramid chambers, KV34 Amduat, KV9 Caverns and Earth, Seti I sarcophagus (Soane), Khunrath's Tabula Smaragdina (1606), incunabula | PD / CC BY-SA, per file — the existing seed pipeline already resolves these credits |

**Doreal's Emerald Tablets: no authenticated ancient physical tablets exist,** so
those records will say "No verified image is available" rather than show
anything that could be read as an artefact.

---

## 5. Schema changes

The design follows Oshi's direction: **texts appear on the timeline at their
documented dates; every passage is opened from its text, not plotted.** Passages
never enter the windowed event payload (400-event cap), so the strip cannot be
flooded.

Extend (additive columns only, nothing renamed or dropped):

- `timeline_text_passages` + `work_id`, `parent_id` (hierarchy: book → chapter →
  passage), `passage_key` (permanent ID, unique per community, e.g.
  `egy.pt.utt.273`), `division_kind` (`utterance`, `spell`, `chapter`, `hour`,
  `register`, `section`, `line`, `tablet`…), `ordinal` (reading order),
  `summary`, `verification_status`, `content_hash` (for idempotent re-import).
  Existing rows keep working with `work_id` null.

New tables (all community-scoped, same RLS posture as passages):

| Table | Purpose |
|---|---|
| `timeline_text_works` | one per text: anchor `event_id` (the timeline marker), civilisation, original language, attribution, corpus group, reference edition, expected unit count + basis, licence summary, completeness status (`not_started` → `inventory_documented` → `importing` → `imported_unverified` → `verified_against_edition`) |
| `timeline_text_versions` | recensions, manuscript traditions, language versions (ApJohn long/short, Arabic vs Latin Tablet) |
| `timeline_text_manuscripts` | physical witnesses: siglum, institution, shelfmark/accession, findspot, date range with precision and original date text, catalogue URL |
| `timeline_passage_witnesses` | passage ↔ manuscript, with locus (wall, column, line) and variant note — keeps versions distinct instead of merging them |
| `timeline_passage_dates` | passage-level date claims where a passage has its own history, with a `date_role` (`event_described`, `claimed`, `composition`, `earliest_evidence`, `manuscript`, `translation_publication`) |
| `timeline_passage_images` | multiple images per passage or manuscript, with every field of `SeedPicture` (institution, accession, licence, creator, `shows`, `identification_status`, verification) |
| `timeline_passage_links` | passage ↔ passage comparison: the eight connection classes, the ten analysis questions as columns, which is earlier, source, review status |
| `timeline_themes`, `timeline_passage_themes` | navigation themes (Seven cosmic rulers, Amenti…) with per-passage notes — explicitly navigation, not doctrine |
| `timeline_text_import_runs` | log of each import: work, file hash, counts inserted/updated/unchanged/rejected, errors, resumable cursor |
| view `timeline_text_manifest` | per work: expected, imported, verified, missing, translations, images found/verified, unresolved variants, licence restrictions |

---

## 6. Implementation sequence

1. **Architecture PR (now).** Migration above; types; zod validation of corpus
   files; an idempotent, chunked, resumable importer with a run log; the
   inventory of all 33 entries as data with honest status; the text library
   page (Ancient Texts + manifest); the passage reader (original/translation
   side by side, previous/next, hierarchy, images with zoom, connections,
   sources); passage comparison page (two or more passages side by side with
   the gap in years); Trace an Idea page; links from the timeline toolbar and
   a "Read the original text" button on records that have a text. QA checks as
   unit tests. No existing table, record or test changed.
2. **Pilot import inside that PR** to prove the pipeline end to end on PD
   material: the Emerald Tablet versions (Holmyard 1923, Latin vulgate,
   Newton), Corpus Hermeticum I/Poimandres (Mead 1906), Plato's Atlantis
   passages (Jowett + Burnet Greek), each with manuscript witnesses and images,
   and the first comparisons (historical Tablet versions against each other,
   and Tablet ↔ Doreal at reference level).
3. **Egyptian corpus** (separate PRs per work: PT, CT, BD, Netherworld books,
   wisdom, temple texts). Inventories first, then passages, then images.
4. **Greek & Hermetic** — Timaeus/Critias complete, CH I–XVIII, Asclepius, SH,
   Definitions (reference level).
5. **Gnostic** — Pistis Sophia full (Mead), ApJohn and others at reference +
   excerpt level with all four versions distinct.
6. **Arabic & medieval** — every Tablet version, Sirr al-khalīqa, Secretum.
7. **Modern** — Doreal 15 tablets at reference level; Blavatsky/Steiner full PD
   passages; Hall excerpt-level.
8. **Connections**, strongest first, each with the ten analysis answers.
9. **Images**, coverage tracked per passage in the manifest.
10. **Verification & deploy** through the normal PR → merge → Vercel flow, with
    migrations applied to Supabase at merge.

Each corpus stage is a data PR against the same importer, so a stage can be
reviewed and merged on its own and the manifest shows exactly what is done.

---

## 7. Risks to existing timeline functionality

| # | Risk | Mitigation |
|---|---|---|
| R1 | Flooding the strip: thousands of passage markers in a 400-event window | passages are never events; only ~45 work markers are added, at `prominence` 2 for major texts and 3 for minor |
| R2 | `getTimelineSources` loads at most 500 sources and the community already has 457 — new bibliography would silently push records out of the source picker | archive bibliography is loaded per text by the reader, never through the page-wide list; the page-wide cap is left untouched |
| R3 | Event links are loaded whole on every page view | passage connections live in their own table and are fetched per passage |
| R4 | Bulk import through one server action would time out on Vercel | importer is chunked (≤200 rows per call), resumable from the run log, idempotent by `passage_key` + `content_hash` |
| R5 | Generic seed tests scan every `*-seed.ts` file | corpus data lives in `src/lib/timeline/texts/`, not `*-seed.ts`; the existing tests are unaffected and new tests cover the corpus files |
| R6 | Non-commercial image licences (BM, Bodleian, Gallica, Vatican) on a site with paid plans | each image stores its licence. Decided 2026-10-17: the archive is free and educational, so NC images are shown with their credit and licence |
| R7 | Copyright on modern translations and on Doreal/Hall | decided 2026-10-17: Hall 1928 (US public domain since 2024) may be copied in full; Doreal stays reference-only with short quotations, since his publisher still asserts copyright. A QA check fails any copyrighted layer over the excerpt limit |
| R8 | `community_has_timeline` requires a homeschool community | unchanged; the archive is attached to squidgeoverskool |
| R9 | Migrations deploy to Supabase automatically on merge (deploy-supabase-migrations.yml) | the migration is additive (`if not exists`) and safe to re-run; the app reads the archive tables defensively, so a page never breaks if they are missing |
| R10 | The reader showing an unverified identification as fact | `identification_status` is required on every image; `UNVERIFIED —` caption rule from AGENTS.md enforced by test |

---

## 8. Stage 2: what is built (this PR)

- **Schema** — `supabase/migrations/20261016225210_timeline_text_archive.sql`.
- **Inventory** — `src/lib/timeline/texts/inventory.ts`: 38 entries covering all 33 brief items, each with its marker and dates under the five chronological concepts.
- **Corpora**
  - Timaeus: 364 Stephanus sections. Critias: 76. Both in Greek (Burnet) and English (Bury), generated by `scripts/texts/plato-corpus.py` from the Perseus TEI.
  - Emerald Tablet: the Arabic, Secretum, vulgate and Newton versions, line by line, with four manuscript images.
  - Doreal: a reference-only skeleton of 15 tablets.
- **Importer** — `src/lib/timeline/texts/importer.ts`. Validated, idempotent and chunked, it resumes from `timeline_text_import_runs`. Staff run it from the library page.
- **Reader** — `/timeline/texts` (library), `/texts/[work]` (outline and dates), `/texts/[work]/[passage]` (zoomable image beside the text, previous and next, connections), `/texts/compare?p=…`, `/texts/themes`, `/texts/images` and `/texts/interpretations`.
- **Timeline** — an "Ancient texts" link on the strip, and a "Read the original text" button on a text's record. Archive passages are kept out of the record's evidence panel.

Next stages follow §6: Corpus Hermeticum with the Poimandres, the Pyramid Texts, the Coffin Texts, the Book of the Dead, then the rest.

## 9. Stage 3: the Corpus Hermeticum and the Pyramid Texts

- **Corpus Hermeticum** — all seventeen treatises (I–XIV, XVI–XVIII) in Mead's 1906 English, 233 sections plus XVII kept whole (Mead prints it unnumbered). Generated by `scripts/texts/mead-hermetica.py` from the archive.org OCR, with a list of checked OCR fixes in the script. Witnesses: Paris gr. 2518 (folios per treatise from the BnF catalogue) and Laurentianus 71.33 (the Poimandres hymn). Four images. Every passage is `unverified`: Mead's section numbers have not been checked against Nock–Festugière, and XVI §5 is unnumbered in his printing.
- **Pyramid Texts** — utterances 1–714 in Mercer's 1952 English, grouped under his chapters, generated by `scripts/texts/mercer-pyramid.py` from the sacred-texts.com chapter pages (fetched with a headless browser because of the site's bot check). Faulkner's 715–759 are in copyright and absent, so the work cannot show as complete. Four images: two museum or site photographs and two Unas wall photographs marked UNVERIFIED.

## 10. Stage 4: the Coffin Texts

No public-domain English translation of the whole exists, so the work is built as a full spell list with what may be shown of each (decided with Oshi, 2026-10-17).

- **Spells** — all 1,185 in de Buck's numbers, grouped as Faulkner's three volumes divide them, with the Book of Two Ways (1029–1130) as its own group. Every spell cites Faulkner's volume and links to the Internet Archive's lending copy; none carries his text. Ten well-known spells have a summary written for this archive.
- **Breasted 1912** — the only public-domain English: about fifty chapter titles and eight longer passages from Lacau's Cairo coffins, filed by Lacau's chapter numbers because their de Buck numbers have not been matched yet. His opening of the forerunner of Book of the Dead 17 sits at spell 335.
- **Witnesses and images** — the coffins of Gua (British Museum, Book of Two Ways), Iqer (Turin), Khety (Met) and Rehu-er-djer-sen (Walters), and Lacau's 1903 plate of Nefri's coffin. Every passage is `unverified`.
- **Next** — match Lacau's chapters to de Buck's spells, and add summaries spell by spell as they are checked against Faulkner.

## 11. Stage 5: the Book of the Dead

Public-domain translations in full; the in-copyright ones (Allen 1974, Faulkner 1985, Quirke 2013) cited only (Oshi's decision). The base is Budge's *The Book of the Dead: The Papyrus of Ani* (1895), from the web edition at sacred-texts.com, cut up by `scripts/texts/budge-book-of-the-dead.py` into `corpus/book-of-the-dead-text.ts`.

- **Chapters** — every number in Budge's own list of the chapters of the Theban version (pp. xxxi–xlvi), keyed by Lepsius's number with his letters and sub-numbers (`egy.bd.125`, `egy.bd.30b`, `egy.bd.15b-2`), each with Budge's title for it: 1–186 less the seven numbers he lists only as renumbered, plus 29 and 93A from his List of Chapters of the Papyrus of Ani — 199 in all. Chapters he marks as Saite additions say so. Numbers 187–192 are not in his list and are absent.
- **Text** — Budge's running translation, in his words with his line numbers, for the 60 chapters the Papyrus of Ani carries and 10 more he supplies from other papyri (each says which). Where Ani has a chapter more than once (the hymns of XV, the heart spell XXXB, the rubric of CXXV) or Budge adds a fuller version from another copy (XLII, LXXII), the pieces are sections of the chapter. The speeches of the judgement scene, which belong to no numbered chapter, are their own passage (`egy.bd.judgement`). Vignette descriptions, footnotes and Budge's appendices are left out.
- **References** — every chapter cites Allen, Faulkner and Quirke by spell number, with no text.
- **Witnesses and images** — the Papyrus of Ani (BM EA 10470) and of Hunefer (BM EA 9901): the weighing of the heart and sheet 3 of Hunefer (PD-Art), Budge's 1890 facsimiles of Ani's funeral procession and Field of Peace (PD-US), and an `UNVERIFIED` section labelled as spell 17 by its uploader. Every passage is `unverified`.
- **Not done** — the inventory count is still open (`expectedUnits` null): Budge's numbering has not been checked against the Totenbuch-Projekt list. Budge 1898 (*Chapters of Coming Forth by Day*), which would give text for the chapters Ani lacks, is not imported yet.

## 12. Stage 6: the Asclepius

The Latin *Asclepius* (the "Perfect Sermon"), in Mead's public-domain English; the Coptic and the modern translations cited only. The base is Mead's *Thrice-Greatest Hermes* vol. II (1906), from the web edition at sacred-texts.com, cut up by `scripts/texts/mead-asclepius.py` into `corpus/asclepius-text.ts`.

- **Chapters** — Mead's 41 chapters (I–XLI), keyed `herm.ascl.1` … `herm.ascl.41`, each with a summary. Where Mead numbers paragraphs within a chapter they are its sections (`herm.ascl.24.3`); chapter I is undivided. Mead prints no ¶4 in chapter XXIX, so `herm.ascl.29.4` is absent and 29.3 says so. 134 passages carry his text. Footnotes, his commentary and the bracketed Ménard part numbers are left out; the Ménard part is kept in each section's notes.
- **Text** — the web edition drops the text from each mid-chapter Ménard part to the next chapter heading; those seven runs (in chapters 3, 7, 10, 14, 23, 27, 30) are supplied from the archive.org OCR of the same printing (`thricegreatesthe02hermuoft`), with only certain OCR fixes, and each section's evidence says which source it came from. Every passage was word-aligned against the OCR.
- **Latin** — Thomas's Teubner text (1908) is cited per chapter with no content: the archive.org OCR of it is too corrupt to quote safely.
- **Links** — NHC VI,8 (the Coptic of chapters 21–29) and the Prayer of Thanksgiving NHC VI,7 (chapter 41) are version passages citing Robinson's *Nag Hammadi Library* with no text, linked as direct parallels; a few close conceptual parallels go to the Corpus Hermeticum and the *Timaeus*. Copenhaver and Nock–Festugière are cited as references only.
- **Dates** — the lost Greek (c. 2nd–3rd c.), its quotation by Lactantius (c. 300–320) and the Latin translation known to Augustine (by c. 426), each with its evidence; all unverified.
- **Witnesses and images** — Brussels KBR 10054–10056 (Thomas's B), Florence San Marco 341, Venice Marciana Lat. VI 81 and Lat. Z 467, the Rome 1469 Apuleius, and Nag Hammadi Codex VI. Opening pages of the three manuscripts and the 1469 print (PD-Art, identifications from Commons, `probable`), the Siena pavement Hermes (PD-Art, later artwork) and a page of Codex VI (PD-Art, related evidence). Every passage and image is `unverified`.
- **Plain words** — every Mead passage has a plain paraphrase; where Mead's wording is genuinely ambiguous the paraphrase adds "Other possible readings".
- **Not done** — the inventory count is not verified (`inventoryVerified` false): Mead's 41 chapters have not been checked against Nock–Festugière's numbering. No Latin text; the Lactantius and Augustine manuscripts are not pictured.

## 13. Stage 7: Hall's *Secret Teachings of All Ages*

Manly P. Hall's *The Secret Teachings of All Ages* (San Francisco: printed for Hall by H. S. Crocker, 1928) in full. It is a modern compendium, not an ancient text, and its summary, dates and links say so. The book is public domain in the US (not renewed) but not in the UK or EU until 2061; Oshi decided on 2026-10-17 to carry it under its US status (`public_domain_us`). The base is the sacred-texts.com e-text (J. B. Hare, 2001, with the site's errata), fetched with a headless browser and cut up by `scripts/texts/hall-secret-teachings.py` into `corpus/hall-secret-teachings-text*.ts`.

- **Chapters** — the table of contents gives an Introduction, 45 chapters and a Conclusion: 47, checked against the e-text's chapter pages, page ranges and index (`inventoryVerified` true). Hall does not number his chapters; the keys number them in his order (`modern.hall.intro`, `modern.hall.1` … `modern.hall.45`, `modern.hall.conclusion`). The dedication, the preface and the unnumbered Celentano section (26 alchemical leaves, about p. 160) are parts, not counted.
- **Passages** — 964: under each chapter, Hall's own sub-headings as sections (101) and groups of whole paragraphs of about 1,000–4,000 characters as parts (589); each illustration's caption is a `figure` passage after the chapter's text (227, 14 of them a title only). 828 passages carry Hall's text, about 1.8 million characters.
- **Text** — fourteen of the site's chapter pages stop partway (chapters 9, 14, 15, 25–28, 31, 32, 35, 37, 38, 42, 43). They are completed from the archive.org OCR of a printout of the same e-text (`the-secret-teachings-of-all-ages-by-manly-p.-hall-1928`, checked against `pdfy-NXrCfPe_e-QETRFj`), and 68 captions the site leaves out come from it too; each passage's evidence says which source it used. OCR misreadings are fixed where certain. The e-text's own scanning errors (about 520, found while paraphrasing every passage) are corrected in the generator only where the right reading is certain; doubtful ones are left as printed and noted in the plain words. Hebrew and Greek the OCR could not read are marked […].
- **Links** — twelve, all `later_reinterpretation` and all saying Hall's account is discussion, not a witness: Atlantis to the *Critias* and *Timaeus*, the Poimandres (five), the Emerald Tablet (Vulgate, three) and the Book of the Dead (two). Doreal is not linked.
- **Images** — ten from Wikimedia Commons, each licence checked: seven of J. Augustus Knapp's colour plates (Knapp d. 1938; PD-Art, PD-old) marked `UNVERIFIED` because the Commons copies come from image-sharing sites and their place in the first edition is not checked, and three of Hall's line figures from the e-text (PD-US). All are later artwork or diagrams and say so.
- **Plain words** — every passage with text has a plain paraphrase (`PLAIN_HALL`), saying what Hall says, not whether it is true; where the e-text is genuinely ambiguous or damaged the paraphrase adds "Other possible readings".
- **Not done** — nothing is verified against a copy of the first edition. One sentence (`modern.hall.33.s4`, in "Alchemy and Its Exponents", after "the supreme secret of alchemy,") is cut short in every copy found, and a Greek table in the Apocalypse chapter is garbled beyond use. More of Knapp's plates could be added as Commons copies are checked.

## 14. Stage 8: the Gospel of Thomas

The Gospel of Thomas (Nag Hammadi Codex II,2), with the three Greek papyri from Oxyrhynchus (P. Oxy. 1, 654, 655) kept as separate versions. The work attaches to the timeline's existing `gospel-of-thomas` event as its marker (`anchor.existingSlug`); the importer only looks that event up and never creates a second one. File: `corpus/gospel-of-thomas.ts`; plain words in `corpus/plain/gospel-of-thomas.ts`.

- **Sayings** — the prologue (`gnostic.thom.prologue`), sayings 1–114 (`gnostic.thom.1` … `gnostic.thom.114`, a new `saying` division kind) and the closing title (`gnostic.thom.title`), each with the codex page on which it begins. Pages 32, 33 and 51 were read from the Commons photographs; the breaks on pp. 34–50 are not yet checked against the photographs or an edition, and each such saying says so.
- **Coptic** — cited, not reproduced (`cop-nhc-ii`, no content): every transcription found is in copyright or on restrictive terms (Layton 1989; Guillaumont et al. 1959), and the free online ones could not be reached. Each saying points to the page photograph instead.
- **English** — every complete translation of the Coptic (Lambdin in Layton/Robinson, Guillaumont et al., Meyer, DeConick) is a `copyrighted_reference` layer with no content. The English shown for the Coptic is the archive's own translation (`eng-ours`, labelled "Our translation"). It is not a published translation and has not been checked by a specialist; 46 sayings and the prologue end with "Other possible readings". To give it the right label, `plainWordsBasis` gained an `oursCited` basis: a public-domain original that is cited but not shown.
- **Greek** — Grenfell and Hunt's English (New Sayings of Jesus, 1904) for every surviving piece, public domain, with their round-bracket supplements as printed. Their Greek is given only for logia 1–3 and 5–7 of P. Oxy. 1, transcribed from page images of the 1897 first edition, Logia Iesou. The Greek of P. Oxy. 654, 655 and logia 4 and 8 of P. Oxy. 1 is cited with no content: the page images could not be fetched (Wikimedia rate limits) and the OCR of their Greek is unusable. The plain words for the papyri paraphrase Grenfell and Hunt's English.
- **Links** — 20 `direct_textual_parallel` links from the Greek sections to the Coptic sayings (the 654 introduction to both the prologue and saying 1; P. Oxy. 1 logion 5 to sayings 30 and 77; the last 654 saying to 6 and 7; 655 ll. 1–23 to 36 and 37), all `proposed`.
- **Dates** — composition disputed, c. 50–140 CE (`chronology: "disputed"`); earliest evidence P. Oxy. 1, c. 150–300 (Grenfell and Hunt: "not much later than the year 200"); the manuscript NHC II, 340–400 (cartonnage of the 340s); the first publication of Greek sayings, 1897. P. Oxy. 654: middle or end of the third century; P. Oxy. 655: by 250 (Grenfell and Hunt). Later palaeographic dates and the papyri's present holdings come from the English Wikipedia and are marked as not checked.
- **Images** — the twenty Commons photographs of codex pp. 32–51 (PD-old-100, from the metalog.org scan), each on the first saying that begins on that page; the British Library's CC0 photograph of P. Oxy. 654 (Papyrus 1531), with the Commons copy marked `duplicateOf` it; P. Oxy. 1 (PD-US); the printed plate of P. Oxy. 655 (PD-Art). Identifications are secure: the papyrus images were checked against their text, except the British Library photograph, which the library itself identifies. Every image is `unverified` against the holding institution's record.
- **Not done** — `inventoryVerified` is false. The Greek of P. Oxy. 654 and 655 still has to be transcribed from Grenfell and Hunt's page images, and the page breaks for pp. 34–50 still have to be checked against the photographs.

## 15. Stage 9: Egyptian wisdom texts

Four Egyptian works, each attached to the marker the inventory already defines for it (`anchor.event`, which the importer creates): the Instruction of Ptahhotep, the Instruction for Kagemni, the Instruction of Amenemope and the Memphite Theology of the Shabaka Stone. Every English text is public domain and imported in full; every modern translation (Lichtheim, Parkinson, Simpson, Allen, Laisney) is a `copyrighted_reference` layer with no content. No page images of the source books could be reached (archive.org's file servers and Gutenberg are blocked from here), so each text was checked against two or three independent OCRs, not against the printed page, and nothing is marked verified. Files: `corpus/ptahhotep.ts`, `corpus/kagemni.ts`, `corpus/gunn-text.ts`, `corpus/amenemope.ts`, `corpus/amenemope-text.ts`, `corpus/memphite-theology.ts`, `corpus/memphite-theology-text.ts`, with plain words in `corpus/plain/`.

- **Ptahhotep** — Gunn's *Instruction of Ptah-hotep* (1906), from the Project Gutenberg text of the 1906 printing (#30508), compared word by word with the archive.org OCR of the 1908 and 1912 printings (99% in-order agreement; every difference an OCR misreading). Gunn's own divisions are the keys: a prologue (`egy.ptah.prologue`: his title line, A and B), the 37 maxims (`egy.ptah.1` … `egy.ptah.37`, division kind `maxim`, the units counted) and an epilogue (`egy.ptah.epilogue`: C, his 38–43, D and the closing formula). 49 passages carry Gunn's text; his 22 footnotes are in the notes. Gunn does not translate maxim 32 and prints only "[Concerning continence]", which is kept. The inventory now expects 37 maxims (it said 39 "sections"); the prologue and epilogue are not counted, as for Amenemope.
- **Kagemni** — Gunn's translation from the same book: his five sections, the closing narrative and the scribe's formula, seven `section` passages (`egy.kag.1` … `egy.kag.5`, `egy.kag.narrative`, `egy.kag.colophon`). Gunn notes the original is not divided; the beginning of the text is lost, so no unit count is set.
- **Amenemope** — Griffith's translation (*JEA* 12, 1926), typed verse line by verse line from one OCR and checked against two others, keeping Griffith's page and line numbers of the papyrus at the start of each line (556 lines). The thirty chapters (`egy.amenemope.1` … `egy.amenemope.30`) are the units; Griffith's three prologue headings are sections under `egy.amenemope.prologue`, and the colophon a section. Chapter titles are Griffith's. His comparisons with Proverbs 22:17–24:22 are in the chapter notes only, never links (Proverbs is not in the inventory). Budge 1924 was not needed.
- **Memphite Theology** — Breasted's first edition ("The Philosophy of a Memphite Priest", *ZÄS* 39, 1901) and his re-translation from Erman's edition in *Development of Religion and Thought* (1912), each checked against two OCRs. Ten `line` passages keyed by Breasted's line groups (`egy.memphite.1-2` … `egy.memphite.61-64`). Breasted translates inside his discussion, so each 1901 layer gathers his renderings for those lines with his line references; for lines 18–24, 25–47 and 61–64, which he only describes, his description is an `interpretation` layer. The 1912 extracts have no line numbers and are placed by matching their wording; where he paraphrases (48–52, 53–54) they are `interpretation` too. A new source `breasted-memphite-1901` was added.
- **Links** — Amenemope chapter 1 to Ptahhotep's heading B (Griffith's own comparison of 3.11–12 with Prisse 5.7–8), a `close_conceptual_parallel`; Memphite lines 55–57 (creation by the heart's thought and the tongue's command) to Poimandres §6 (Mind and Word), a `close_conceptual_parallel` whose transmission evidence is "None shown"; and two maxims of Ptahhotep on Truth. All `proposed`.
- **Dates** — each work's first passage carries the claimed date (the text's own frame: Isesi; Huni and Sneferu; Shabaka's "worm-eaten" book), the composition (Middle Kingdom for Ptahhotep and Kagemni; Ramesside, and Griffith's later view, for Amenemope; Breasted 1901, Erman–Breasted's Old Kingdom and the post-Junge Ramesside-to-Kushite view for the Memphite Theology), the manuscript and the translation. Gunn's Petrie-chronology dates (Isesi c. 3550 BC) are recorded as his only. Manuscripts: the Papyrus Prisse (BnF Égyptien 183–194), BM EA 10474, the Turin writing tablet (Gardiner: end of Dyn. XX; Griffith: later), the Metropolitan Museum ostracon 26.3.165 and the Shabaka Stone (BM EA 498).
- **Images** — twelve from Commons, each looked at: the BnF's scans of Prisse Égyptien 186 and 188 (PD-France) and Zunkir's photographs of 183, 187 and 194 (CC BY-SA 4.0); Jéquier's facsimile of Kagemni (PD-Art); the British Museum papyrus of Amenemope (PD-Art) and the Met's ostracon (CC0); the Shabaka Stone (CC BY-SA 4.0) and Breasted's 1901 copy of it (PD); and as related evidence the Saqqara mastaba of the vizier Ptahhotep (CC BY-SA 2.0) and a Met cult image of Ptah (CC0). Four are `UNVERIFIED`: the Égyptien 188 scan (BnF maxim numbers not checked against Gunn's), the Jéquier facsimile (plate not identified), the Amenemope papyrus (no accession number on Commons) and the mastaba (that its owner is the Instruction's Ptahhotep).
- **Plain words** — every passage with text has a plain paraphrase: 49 for Ptahhotep, 7 for Kagemni, 34 for Amenemope and 10 for the Memphite Theology. Where the old translation is uncertain (Gunn's "(?)" and obscure passages, Griffith's many "(?)", Breasted's alternative renderings) the paraphrase ends with "Other possible readings".
- **Not done** — `inventoryVerified` stays false for all four: Gunn's 37 sections have not been checked against Žába's maxims, Griffith's chapters and lines not against page images or Laisney, and the Shabaka Stone has no line-by-line count. The British Museum's other copies of Ptahhotep (EA 10371, 10435, 10509) and the Carnarvon tablet, and the other Amenemope ostraca and tablets, are neither imported nor pictured (none found on Commons). The Shabaka Stone's lines are imported as Breasted's groups, not one by one.

## 16. Stage 10: the Amduat and the Book of Gates

The two great New Kingdom books of the sun's night journey, each attached to the marker the inventory already defines for it (`amduat-corpus`, `book-of-gates-corpus`); no new markers. Both texts are Budge's English in *The Egyptian Heaven and Hell* (1905), public domain, imported in full: the Amduat ("Book Am-Tuat") from vol. I, its Short Form from vol. II, and the Book of Gates from vol. II. Hornung's editions (*Das Amduat*, 1963–67; *Das Buch von den Pforten des Jenseits*, 1979–80) and the modern English translations (Abt & Hornung 2003, Warburton 2007, Hornung & Abt 2014, Darnell & Darnell 2018) are `copyrighted_reference` layers with no content; six sources were added for them. Files: `corpus/amduat.ts`, `corpus/book-of-gates.ts`, `corpus/budge-underworld.ts` (shared helpers and the KV17 and KV9 witnesses), the generated `corpus/amduat-text.ts` and `corpus/book-of-gates-text.ts`, `corpus/amduat-related-images.ts`, `corpus/book-of-gates-related-images.ts`, and plain words in `corpus/plain/amduat.ts` and `corpus/plain/book-of-gates.ts`.

- **Source and checking** — the text is the archive.org OCR of the sacred-texts e-text (J. B. Hare, 2003), regenerated by `scripts/texts/budge-underworld.py`, and compared word by word with archive.org OCRs of two printed copies of each volume (in-order word agreement: Amduat 95.9%, Short Form 98.0%, Book of Gates 94.6%, most of the disagreement being hieroglyph debris and OCR noise in the printed copies); the e-text is corrected only where its reading is certainly an OCR error. Every correction is a line in the script's `FIXES` list. No page images could be reached, so nothing is marked verified. Budge's hieroglyphic text, transliteration, footnotes and the captions of his drawings are left out; where he quotes a name only in hieroglyphs, `[hieroglyphs]` stands in its place, and the evidence of every layer says so. Budge's own errata (vol. I: pp. 32, 139, 256; vol. II: pp. 10, 20, 57, 119) are not applied to the text; those that touch a name used in a heading or summary are given in the passage notes.
- **Amduat** — twelve `hour` passages (`egy.amd.1` … `egy.amd.12`, the units counted), each with no text of its own and Budge's chapter beneath it, cut where he turns from the opening scene to the registers: 44 passages (`egy.amd.N.opening`, `.upper`, `.lower`, and `.middle` from hour 7 on, where Budge describes the middle register separately; hour 1 also has Ra's address, hour 2 and hour 5 two parts of one register or scene). The book's title (`egy.amd.title`) and the Short Form (`egy.amd.short`, a `version`, with `egy.amd.short.1` … `.12`) come with it but are not counted. Witnesses: KV34 and KV35 (both complete) on every hour; KV17 (Budge's base, via Lefébure) and KV9 are listed as manuscripts.
- **Book of Gates** — twelve `hour` passages (`egy.gates.1` … `egy.gates.12`) in Budge's numbering of the divisions: the first is the western ante-chamber, with no gate; each later one opens with a `gate` passage (Budge's first to eleventh gates) and then the boat of the sun and the two registers. Budge's chapters VII and VIII are division 6: the Judgment Hall of Osiris (two passages), the gate, then the registers as they survive on Seti I's sarcophagus (`seti-*`) and as Budge gives them complete from the tomb of Ramesses VI after Lefébure (`rvi-*`, witness KV9). 49 text passages in all. In divisions 1–5 Budge speaks of the right and left of the boat's path rather than upper and lower registers; filing them as upper and lower is noted on each. His introductory chapter on the sarcophagus and Belzoni's narrative are not imported. Budge's divisions are not aligned with Hornung's hours or scenes.
- **Dates** — Amduat (on `egy.amd.1`): composition Middle Kingdom to early Eighteenth Dynasty, marked disputed; earliest evidence Thutmose I to Thutmose III (fragments of disputed date; first complete copy KV34); manuscripts KV34 and KV35; translation 1905. Book of Gates (on `egy.gates.1`): composition late Eighteenth Dynasty, inferred and disputed; earliest evidence KV57 (Horemheb); manuscripts the sarcophagus of Seti I (Budge's "B.C. 1370" kept as his) and KV9; translation 1905. All regnal dates are approximate.
- **Links** — all `close_conceptual_parallel`, `proposed`, with transmission evidence "None shown … never as transmission": Amduat hour 12 ↔ Gates division 12 (the sunrise); Amduat 7, middle ↔ Gates 10, upper (Apep pinned and fettered); Amduat 10, lower ↔ Gates 8, middle (the drowned in the water); Amduat 4, opening (Re-stau) ↔ the Coffin Texts' Book of Two Ways; Gates 6, the Judgment Hall ↔ the Book of the Dead judgement scene.
- **Plain words** — 57 for the Amduat (25 with "Other possible readings") and 49 for the Book of Gates (29), each 20–1,500 characters. The readings record Budge's own "(?)", his alternatives "(or, …)" and his rival translations; where his printed text and his errata differ, the paraphrase says so.
- **Images** — twelve from Commons file pages, each downloaded and looked at; the licence is recorded as each page states it. Amduat (five): the burial chamber of KV35 (Ignati, CC BY-SA 3.0, secure, a file-level picture of the witness); two KV34 walls (Gerd Eichmann 1982, CC BY-SA 4.0) placed at hours 1 and 4 by matching their figures to Budge; the Marseille "Papyrus A" (Ismoon, GFDL/CC BY-SA) at hour 12 as related evidence, its label doubted in the record; and an uncredited twelfth-hour photograph (PD-Art claimed, `licenceStatus` "unknown" because the page contradicts itself on KV34/KV35). Book of Gates (seven): Seti I's sarcophagus in the Soane Museum (Djehouty 2023, CC BY-SA 4.0, secure) and KV57's unfinished drawings (Dalbéra, CC BY 2.0, secure) as file-level witness pictures; the KV57 Judgment Hall (Soutekh67, CC BY-SA 3.0) at 6, hall-1; the KV17 boat of the sun under Mehen (Carole Raddato, CC BY-SA 2.0) at 5, middle; KV9's tank of the drowned (R Prazeres, CC BY-SA 4.0) at 8, middle; the KV11 enemies bound to a jackal standard (PD-Art claimed, source TMP, status "unknown") at 6, seti-middle; and Weidenbach's drawing for Lepsius of the four peoples (PD) at 5, lower. Nine are `UNVERIFIED`, each because its hour, division or tomb rests on an uploader's label or on matching to Budge's description; the hour numbers on Commons need not follow Budge's count. The pictures already on the two markers are not repeated. No Apep picture was added.
- **Not done** — `inventoryVerified` stays false for both: the twelve hours have not been checked against Hornung's editions, and Budge's divisions of the Book of Gates are not aligned with Hornung's hours. Budge's drawings and his hieroglyphic text are not reproduced. The Amduat papyri of the Third Intermediate Period (one is pictured, none imported), the other royal copies (KV9's Amduat, Ramesses VI's Book of Gates outside division 6) and the Osireion are not imported. The Met's CC0 Amduat fragment (553717) and further KV34 views were found but not downloaded before Commons' image server began refusing requests.

## 17. Stage 11: Stobaeus's Hermetic excerpts and Pistis Sophia

Two works in G. R. S. Mead's English, both public domain and imported in full. Each is attached to the marker the inventory already defines for it (`stobaeus-hermetic-excerpts`, `pistis-sophia`); no new markers. The Greek of Stobaeus is cited only. Copenhaver gives no Stobaeus, so he is a source for the dates only and not a layer. Nock–Festugière, Litwa and Schmidt–MacDermot are `copyrighted_reference` layers with no content. Six sources were added to the inventory: Mead's *Thrice-Greatest Hermes* III, Litwa's *Hermetica II*, the Wachsmuth–Hense, Gaisford and Meineke editions of Stobaeus, and Schmidt–MacDermot (1978).

Files:
- `corpus/stobaeus.ts` and the generated `corpus/stobaeus-text.ts` (`scripts/texts/mead-stobaeus.py`);
- `corpus/pistis-sophia.ts` and the generated `corpus/pistis-sophia-text.ts` (`scripts/texts/mead-pistis-sophia.py`);
- plain words in `corpus/plain/stobaeus.ts` and `corpus/plain/pistis-sophia.ts`.

### Stobaeus (`herm.stobaeus`)

- **Source and checking** — Mead, *Thrice-Greatest Hermes* vol. III (1906), "Excerpts by Stobaeus". The base is the archive.org OCR of the Toronto copy (`thricegreatesthe03hermuoft`). It was compared word by word with:
  - the University of Michigan e-text (`afx0734.0003.001`);
  - the archive.org OCR of a different scan of the three volumes.

  The majority reading is taken; each hand correction is listed in the script. Of 22,900 words, 97.9% agree with the Michigan text and 95.6% with the second OCR. The few short excerpts that agree less (V, VII, XII, XV) are places where one copy splices in footnote matter or loses a line; each was judged by hand. Mead's source notes, footnotes and commentary are left out. The few Greek words he prints inside the English of Excerpt VI are marked '(Greek word omitted)', and the excerpt's notes say so.
- **Units** — Mead's 27 excerpts (`herm.sh.ex1` … `herm.sh.ex27`, `fragment`), in his order and with his numbering. Nock–Festugière count 29 (SH 1–29), so the work is partial (`expectedUnits` 29). Only Excerpt XXV, the Korē Kosmou, is matched to its SH number (23); the other concordances are not checked. Mead's numbered paragraphs are sections (`herm.sh.ex1.1` …), 164 passages with text. Mead prints no ¶7 in Excerpt III and no ¶37 in Excerpt XXV. Each excerpt carries Mead's references to Wachsmuth–Hense, Gaisford and Meineke.
- **Witnesses** — Naples III D 15 (F, 14th c.) and Paris gr. 2129 (P, 15th c.), listed for the excerpts from the Eclogae, with dates "as usually given; not checked".
- **Dates** (on `herm.sh.ex1`):
  - composition: 1st–3rd c. CE, disputed (Copenhaver);
  - earliest evidence: the Anthology, 5th c.;
  - the two manuscripts;
  - translation: 1906.
- **Links** — four `close_conceptual_parallel` links, all `proposed`, none claiming borrowing:
  - Excerpt I.8 ("First God; second the Cosmos") → Asclepius 10.2;
  - Excerpt II → *Timaeus* 28c;
  - Excerpt XXIV (the seven planets) → Poimandres §9;
  - Korē Kosmou ¶23 → Asclepius 12.
- **Images** — three from Commons, each downloaded and looked at:
  - an early printed opening of the Florilegium, `UNVERIFIED` because the Trincavelli 1536 attribution comes only from the Commons record;
  - the cover of Meineke's 1855 Teubner volume;
  - the Met's CC0 statuette of Isis with the child Horus (45.2.10). It is on Excerpt XXV as related evidence for the Korē Kosmou's two speakers and is labelled "not an illustration of it".
- **Plain words** — 164, of which 36 have "Other possible readings".

### Pistis Sophia (`gnostic.pistis-sophia`)

- **Source and checking** — Mead, *Pistis Sophia* (2nd ed., 1921). The base is the Global Grey e-text. It was compared word by word with two independent OCRs of the printed book: the Celephais Press e-text and the archive.org OCR of the BYU copy. Agreement is 96.5% and 97.2% of 89,000 words.
  - The script lists every short reading where both OCRs agree against the e-text (111) and every place where the e-text stands alone (about 800). These were judged by hand and not applied automatically.
  - While the plain words were written, every chapter was read again. The remaining certain errors were corrected as `FIXES` and `REGEX_FIXES` and checked against the OCRs: misread letters, stray marks, line-break hyphens, quotation marks and colons dropped or set in the wrong order, and side-headings run into the text.
  - The e-text had lost the first paragraph of chapter 20 and a sentence of chapter 142; both are restored from the OCRs.
  - The long-vowel marks on the magical names are lost. Greek letter-names in the scribe's note that no copy gives legibly are marked "(Greek letters omitted)".
  - Mead's footnotes and introduction are left out. His 425 side-headings are kept in the notes; 352 of them are confirmed in the OCRs' margins or his table of contents.
- **Units** — Mead's 148 chapters (`gnostic.ps.1` … `gnostic.ps.148`), under his books:
  - book-1: 1–62;
  - book-2: 63–100;
  - "A portion of the books of the Saviour" (another-book): 101;
  - book-3: 102–125;
  - book-4: 126–135;
  - book-5: 136–143;
  - book-6: 144–148.

  The text of each chapter is Mead's paragraphs. A chapter of more than about 6,000 characters is split into parts (`gnostic.ps.86.1` …) and holds no text itself; there are 18 such chapters.

  The scribe's note after chapter 62, the two subscriptions and the postscript are their own passages. That makes 174 passages with text. Mead's marks for the lacunae (after chapter 125 and chapter 143) are kept, and the notes explain them.
- **Witness** — the Codex Askew (BL Add MS 5114), 4th–5th c., disputed, as Mead's introduction reports.
- **Dates** (on `gnostic.ps.1`):
  - composition: 3rd c., disputed (Harnack, Schmidt, Legge, via Mead);
  - the manuscript;
  - Mead's translations of 1896 and 1921.
- **Themes** — on 23 chapters (for example the dragon of the outer darkness, the cup of forgetfulness and rebirth, the five planetary regents and the rulers of the way of the midst).
- **Links** — two `close_conceptual_parallel` links to Gospel of Thomas 114, both `proposed`: Peter's complaints against Mary in chapters 36 and 72.
- **Images** — two from Commons, each downloaded and looked at:
  - Allan Ramsay's portrait of Anthony Askew (Emmanuel College, PD Mark), secure;
  - a printed reproduction of a magical diagram from the Books of Jeu in the Bruce Codex (PD-1923), on chapter 99, where the Books of Yew are named. It is `UNVERIFIED`: the edition and page are named only by the Commons title, and whether the Books of Yew are these books is debated. It is related evidence, not this codex.

  There is no image of the Codex Askew on Commons.
- **Plain words** — 174, of which 18 have "Other possible readings".

### Not done

- `inventoryVerified` stays false for both works:
  - Mead's 27 excerpts are not aligned with SH 1–29 beyond the Korē Kosmou;
  - Mead's chapters are not checked against Schmidt's Coptic edition.
- No Greek or Coptic text is given.
- The Stobaeus manuscripts are not looked at.
- The Pistis Sophia text has not been read against page images of the printed book; the OCRs were the only check.

## 18. Stage 12: the Book of the Heavenly Cow

The myth of the destruction of mankind and Ra's withdrawal to the sky on the back of the celestial cow (`egy.heavenly-cow`, prefix `egy.cow`). It is attached to the marker the inventory already defines for it (`book-of-the-heavenly-cow`); no new marker. The text is Budge's English in *Legends of the Gods* (1912), "The Legend of the Destruction of Mankind", public domain (Budge died in 1934), imported in full. Hornung's edition (*Der ägyptische Mythos von der Himmelskuh*, OBO 46, 1982) and Lichtheim's English (*Ancient Egyptian Literature* II, 1976) are `copyrighted_reference` layers with no content. One source was added to the inventory: `budge-legends-1912`.

Files:
- `corpus/heavenly-cow.ts` and the generated `corpus/heavenly-cow-text.ts` (`scripts/texts/budge-heavenly-cow.py`);
- `corpus/heavenly-cow-related-images.ts`;
- plain words in `corpus/plain/heavenly-cow.ts`.

- **Source and checking** — Budge prints the hieroglyphic text on the even pages 14–40 and his English on the odd pages 15–41; his introduction (pp. xxiii–xxxiii) summarises the legend and is not imported. Three copies of the 1912 English were compared word by word:
  - the base: the Project Gutenberg e-text no. 9411 (archive.org `legendsofthegods09411gut`), a proofread transcription;
  - the archive.org OCR of a scan of the printed book from the Sandeman Library, Perth (`egyptianliteratu0001eawa`);
  - the archive.org OCR of a second printed copy, from the Digital Library of India (`india.history.resource.91924`).

  Of the e-text's 3,496 words, 98.6% line up with the first OCR, 98.0% with the second and 97.3% with both (the OCRs also carry the hieroglyphic pages, which line up with nothing). Where the two printed copies agree against the e-text, their reading is taken: two words (the e-text's "Re" for "Ra", "stop" for "step") and eight marks of punctuation. Eight places where both OCRs misread the same printed word alike (small capitals, italic transliterations, footnote numbers read as "!" or "?", a stray bracket) are listed in the script's `REJECT` and the e-text kept. Eleven corrections by hand, each checked in both OCRs, are in `FIXES`: eight of quotation marks (stray marks the e-text made of Budge's line-initial ones, Nu's speech and Nut's question in the cow episode, "Shu himself", "The Aged One", Seb's summons), "avenue" for "avenge", a capital ("[Power]") and a comma ("Ra, said"). A fourth archive.org file (`LegendsOfTheGods`) was set aside as an OCR of a printout of the Gutenberg text. Budge's English of 1904 in *The Gods of the Egyptians* I (archive.org `godsofegyptianso00budg`) is an interlinear word-for-word version, a different translation, and was not used for the comparison. No page image was read by eye, so nothing is marked verified. Budge's hieroglyphic text, transliteration and footnotes are left out (the evidence of every layer says so); the few Egyptian words he gives in brackets in the English are kept without their long-vowel marks, and his rows of dots for gaps are kept.
- **Units** — Budge's five sections (`egy.cow.1` … `egy.cow.5`, `section`): the first, which he prints without a numeral, then II–V. Sections II (the Chapter of the Cow: how the picture is to be painted), III (Seb and the serpents) and IV (Thoth made Ra's deputy) carry their text. Sections I and V hold no text; beneath them are the archive's own cuts (`part`), at a change of scene: I.1 Ra's council, I.2 the Eye goes out as Hathor, I.3 the beer, I.4 Ra's weariness and Nut becomes a cow, I.5 the fields, the stars and the supports of heaven; V.1 the rule for the reciter, V.2 the soul of Ra, V.3 the reciter's words of power, V.4 the hymn to the lord of eternity and the close. That makes 12 passages with text; each records Budge's printed pages, read from the running heads of the Perth scan. `expectedUnits` stays null and `inventoryVerified` false: Budge's five sections are not Hornung's division, which was not checked.
- **Witnesses** — the outermost gilded shrine of Tutankhamun (Carter no. 207, Egyptian Museum, Cairo, as usually given), the oldest copy; the tomb of Seti I (KV17), Budge's copy after Lefébure (*Le tombeau de Séti Ier* IV, pls. 15–18), the witness of every passage; and the later royal copies in the tombs of Ramesses II (KV7), Ramesses III (KV11; Budge's "second copy, very much mutilated" published by Naville in 1885 is usually identified with it, not checked here) and Ramesses VI (KV9), listed without loci. Regnal dates are approximate.
- **Dates** (on `egy.cow.1`):
  - composition: Middle Kingdom to late Eighteenth Dynasty, marked disputed;
  - earliest evidence: Tutankhamun's shrine, c. 1332–1323 BCE;
  - manuscripts: KV17, KV7, KV11, KV9;
  - translation: 1912.
- **Themes** — on 8 passages (for example the gods' council on mankind's rebellion, Ra's ascent on the cow, the creation of the fields and stars, Thoth and the moon, Heka).
- **Links** — six `close_conceptual_parallel` links, all `proposed`, with transmission evidence "None shown … never as transmission":
  - I.4 (Ra weary of mankind) → Book of the Dead 175 (the strife of the children of Nut; Tmu's doing away with what he made);
  - I.2 (the slaughter begins at Suten-henen) → BD 17 (Ra first rises as king in Suten-henen before the pillars of Shu were made), a connection Budge himself suggests (p. xxvi);
  - I.5 (Sekhet-hetep and Sekhet-aaru made) → BD 110 (the Field of Peace and the Field of Reeds);
  - I.5 (Shu set under Nut, the Heh supports) → Amduat hour 12, lower register (the image Shu lifts beneath the sky, with Hehu and Hehut);
  - II (the sun's boat on the cow's belly) → Book of Gates division 12, the gate ("Nut receiveth Ra");
  - I.1 (mankind's plot against Ra) → Coffin Text 1130 (the creator says wrongdoing came from people's hearts).
- **Images** — five from Commons file pages, each looked at; the licence is recorded as each page states it. The two pictures already on the marker (Hay's watercolour of the KV17 cow; the cow inside Tutankhamun's first shrine) are not repeated.
  - Harry Burton's photograph of 16 December 1923 of the roof of the outermost shrine being lifted in KV62 (PD), a file-level picture of the oldest witness, secure; the text itself is inside the shrine and not visible.
  - A photograph of the painted cow that the file page places in KV17 (Edward Piercy, PD-Art claimed), at section II: `UNVERIFIED`, because the tomb rests on the file page alone and the public-domain claim is for a photograph of a relief (`licenceStatus` "unknown").
  - A drawing of the cow that the file page says is Budge's plate "The Cow-goddess Nut" from *The Gods of the Egyptians* I (1904), at I.5: `UNVERIFIED`, because the scan has not been compared with the book and the page's licence tag does not fit (`licenceStatus` "unknown").
  - Related evidence, labelled "not an illustration of this book", at I.2: Naville's 1907 photograph of the Hathor cow in the chapel of Thutmose III at Deir el-Bahari (Cairo JE 38574–38575, PD), and the Louvre's two Sekhmet statues of Amenhotep III (A 7, A 8; Janmad, CC BY 3.0).
- **Plain words** — 12, of which 10 have "Other possible readings" (Budge's own "(?)" and "(or, …)", and his restorations in brackets).

### Not done

- `inventoryVerified` stays false and `expectedUnits` null: Budge's sections are not aligned with Hornung's edition.
- The text has not been read against page images of the printed book; the two OCRs and the e-text were the only check.
- Only Seti I's copy is translated. The Tutankhamun shrine and the Ramesside copies are listed, not compared, and the extent of each is not recorded.
- No photograph of the cow in the tombs of Ramesses II, III or VI was found on Commons, and the cow on the outermost shrine is shown only on the marker.
- Budge's 1904 interlinear version and Naville's 1874 and 1885 translations are not imported.

## 19. Stage 13: the Secretum secretorum

The *Secret of Secrets* (Arabic *Sirr al-asrār*, Latin *Secretum secretorum*; `arab.secretum-secretorum`, prefix `arab.secretum`), the mirror for princes presented as Aristotle's letter to Alexander. It is attached to the marker the inventory already defines for it (`secretum-secretorum`); no new marker. The text is Ismail Ali's English of the Arabic in Steele's edition of Roger Bacon's *Secretum secretorum* (*Opera hactenus inedita Rogeri Baconi*, fasc. V, Oxford, 1920), "The Translation from the Arabic: The Secret of Secrets", pp. 176–266, public domain (published 1920), imported in full. Steele calls it "a literal translation of the original Arabic made under my supervision by Mr. Ismail Ali and edited by Mr. Fulton" (p. vii); it translates one manuscript, Gotha 1869 (Steele's A). Philip of Tripoli's Latin, which Steele prints on pp. 1–172, is public domain but is cited, not transcribed (its Emerald Tablet is already `arab.tab.secretum`). Manzalaoui's *Secretum secretorum: Nine English Versions* (EETS OS 276, 1977) and Badawi's Arabic text (*Fontes Graecae doctrinarum politicarum Islamicarum*, 1954) are `copyrighted_reference` layers with no content. Two sources were added to the inventory (`manzalaoui-1977`, `badawi-1954`), and `steele-secretum` now records the English, its pages and the scan.

Files:
- `corpus/secretum.ts` and the generated `corpus/secretum-text.ts` (`scripts/texts/steele-secretum.py`);
- `corpus/secretum-related-images.ts`;
- plain words in `corpus/plain/secretum.ts`.

- **Source and checking** — three archive.org scans of three printed copies of the 1920 fascicle, all the same printing: University of Toronto (`operahactenusin05baco`, the base), Boston College (`operahactenusine05baco`) and a third copy scanned in 2026 (`secretumsecretor0005robe`). A fourth item (`operahactenusine00baco`) returned a server error and was not used. The generator reads the OCR word files (`*_djvu.xml`) of pp. 176–266 and uses the word positions to leave out the running heads, Steele's footnotes (smaller type, closer lines), his marginal notes (outside the text column) and footnote marks. The three word lists (T 31,505, B 31,440, R 31,208 words; in-order agreement with T 97.5% for B and 98.6% for R) are aligned with difflib, and where B and R agree against T their reading is taken: 114 words changed, 18 words only T has dropped, 5 words T lacks added, 78 stray marks dropped. Line-end hyphens are joined unless the word is printed with a hyphen inside a line somewhere in the three copies (four compounds are kept by hand, `KEEP_HYPHEN`). Every decision is logged. 83 corrections by hand are in `FIXES`, each asserted to apply the stated number of times: readings all three OCRs garbled, among them "O Alexander" read as "0 Alexander", quotation marks left by footnote marks, and the fractions of hours (pp. 199–202) and drug weights (pp. 210–216), which were read from the page images of the Toronto copy, as were "leads" (p. 183) and a few others. The letter-number table of p. 251 is replaced by its transliterations and values read from the page image (`LETTER_TABLE`); the Arabic letters are left out. The printer's misprints are kept ("phys cal", "Likwise", "mattter", "strategetic", "they mayest"). The long-vowel marks of the transliterations are not reproduced. Steele's footnotes, marginal notes and apparatus are left out, and the evidence of every layer says so. Nothing is marked verified.
- **Units** — the ten discourses (`arab.secretum.1` … `arab.secretum.10`, `chapter`), which Aristotle's letter itself lists, after `arab.secretum.0` (`section`): the translator's preface (Yuhanna ibn al-Batrik's account of finding the book) and Aristotle's letter. Discourses V–VIII (scribes, ambassadors, tax officials, the army) carry their text. The others hold none; beneath them are the archive's own cuts (`part`) at Steele's headings or a change of subject: 0 (2 parts), I (2), II (20: the king's conduct, then the regimen of health, the seasons, diet, wine, the bath, the great medicine, bleeding and music, divination and physiognomy), III (2: justice, and the Circle of the Sphere), IV (7: creation, the soul and senses, counsel and nativity, ministers, the fifteen qualities, the Jew and the Mage), IX (3: battle, sieges and astrology, the reckoning of names) and X (9: talismans, the ring of sovereignty, the egg talisman, Aristotle's talismans, the golden tomb, the stone that is not a stone, **the Emerald Tablet**, stones, plants). That makes 49 passages with text; each records Steele's printed pages. `expectedUnits` stays null and `inventoryVerified` false: the Arabic recensions differ, and the ten discourses have not been checked against a stated inventory (Manzalaoui, Badawi).
- **The Emerald Tablet** has its own key, `arab.secretum.10.7` ("Hermes Trismegistus: the Emerald Tablet", p. 262), with a `lat-philip` layer that points to the Latin at `arab.tab.secretum` instead of repeating it. Steele's footnote at its end says "This section is found only in A"; the golden tomb (10.5) is also "found only in A". Steele's 1920 view that this is "the oldest known text of the Emerald Table" is recorded as his and noted as superseded by the Secret of Creation version.
- **Witnesses** — Gotha 1869 (A) on every passage with text, except 10.3 (the egg talisman; Steele: "pp. 258⁸–259² only in B", Gotha 1870) and 10.4 (Aristotle's talismans; "pp. 259¹⁵–260²⁷ only in C", BL Or. 3118). Also listed, undated: Gotha 1870 (B), BL Or. 3118 (C), BL Or. 6421 (D), Bodleian Laud Or. 210 (W); and, for the Latin, Bodleian MS Tanner 116 (Bacon's text, thirteenth century, per Steele) and BL Add MS 47680 (1326–1327, as the Commons file page gives it). No Arabic manuscript is dated here, because Steele gives no dates and no catalogue was checked.
- **Dates** (on `arab.secretum.0`):
  - composition: ninth to tenth century, marked disputed (the preface's attribution to Yuhanna ibn al-Batrik, d. 815, which Steele thought not unlikely, against the usual tenth-century dating of the Arabic recensions);
  - Johannes Hispalensis's partial Latin: "early in the twelfth century" (Steele);
  - Philip of Tripoli's Latin: before Bacon's quotations of 1243–1254 ("probably about 1247");
  - manuscripts: Tanner 116 (thirteenth century; Bacon's text and notes "before 1257"), BL Add MS 47680 (1326–1327);
  - translation: 1920.
- **Themes** — on 18 passages (for example the order of creation and the planetary spheres, the soul, fate and nativity, the Circle of the Sphere, talismans, the stone, and the Tablet's above-and-below, Sun and Moon, ascent and Hermes).
- **Links** — three `close_conceptual_parallel` links from `arab.secretum.10.7`, all `proposed`, with transmission evidence "None shown … never as transmission":
  - → `arab.tab.secretum` (Philip's Latin of the Tablet in the Secretum): the same sequence of statements, with the Latin's "respondent", "Operator miraculorum unus solus est Deus" and "Hermogenes triplex" as differences; nothing shows that Gotha 1869 is the Arabic Philip used;
  - → `arab.tab.arabic` (the Secret of Creation version), with the earlier date of the Secret of Creation noted;
  - → `arab.tab.secretum.17` (the "threefold" name).
- **Images** — five from Commons file pages, each looked at; the licence is recorded as each page states it. The three pictures already on the marker (`Tabula_ex_Secretum_Secretorum.png`, `Bodleian_Library_MS._Canon._Class._Lat._135_-_Philip_of_Tripoli.png`, `Secret_of_secrets_a.jpg`) are not repeated.
  - BL Add MS 47680, Alexander and Aristotle at the opening of the Latin made for Edward III (PD-Art), file level, secure.
  - Hertford College MS 2, the initial with a crowned king in the Latin made for Louis the Great of Hungary (PD-Art), at 0.2, secure; a second scan of the same picture was left out.
  - The onomantic table of the Russian version, Bodleian MS Laud Misc. 45, p. 48 (from Ryan 1999; PD), at 9.3, secure, labelled "Related evidence, not this Arabic text".
  - An Arabic codex with a red and black circular diagram, which the file page calls a Syrian Secretum of c. 1250–1275 (from the Schøyen Collection's site), at 3.2: `UNVERIFIED` (identification, date, origin and collection rest on the file page; the circle is not shown to be the Circle of the Sphere; `licenceStatus` "unknown").
  - Aristotle teaching, from al-Mubashshir's *Mukhtār al-ḥikam* (Topkapı Ahmed III 3206 per the file name only), at 0.1: `UNVERIFIED`, context only, a different book.
  - `Kitâb_Sirr_al-asrâr_Tabula_Smaragdina.jpg` was left out: its page names no manuscript, and it shows tables, not the Tablet, apparently the same page as a marker picture.
- **Plain words** — 49, of which 14 have "Other possible readings" (the translator's own queries, readings that rest on one manuscript, the restored fractions, and the Tablet's uncertain lines). The plain words of 4.7 say that the story of the Jew and the Mage rests on a hostile caricature that is the text's own.

### Not done

- `inventoryVerified` stays false and `expectedUnits` null: the ten discourses of this one Arabic manuscript are not checked against Manzalaoui's or Badawi's account of the recensions.
- Only Ismail Ali's English of Gotha 1869 is imported. Steele's footnoted variants (B, C, D, W, H) are left out, and the Arabic itself is not in the archive.
- Philip of Tripoli's Latin (Steele pp. 1–172), Johannes Hispalensis's partial Latin and Steele's 1898 Middle English are not imported; only the Latin Tablet is, already, under the Emerald Tablet.
- The text was compared across three OCRs and checked on page images only where the OCRs could not settle it; it has not been proofread page by page.
- No picture of an Arabic manuscript whose identification could be verified was found on Commons.

## 20. Stage 14: Blavatsky's Stanzas of Dzyan and selected passages

Helena Blavatsky's *Isis Unveiled* (New York: J. W. Bouton, 1877) and *The Secret Doctrine* (London: The Theosophical Publishing Company, 1888), `modern.blavatsky`, prefix `modern.hpb`. It is a selection from the public-domain first editions, cited by volume and page, attached to the marker the inventory already defines (`blavatsky-isis-unveiled`); no new marker. The selection has 39 units (`section`):
- the Stanzas of Dzyan, one unit per stanza: Cosmogenesis I–VII (SD I pp. 27–34) and Anthropogenesis I–XII, slokas 1–49 (SD II pp. 15–21);
- twenty passages of her own prose.

They sit under five `part` records with no text of their own: the Isis selection, the SD vol. I selection, the two sets of Stanzas, and the SD vol. II selection. One source was added to the inventory, `coleman-1895`. The two Blavatsky sources now record the selection's pages and the scans, and `inventoryBasis` lists the selection by volume and page.

Files:
- `corpus/blavatsky.ts` and the generated `corpus/blavatsky-text.ts` (`scripts/texts/blavatsky-dzyan.py`);
- `corpus/blavatsky-related-images.ts`;
- plain words in `corpus/plain/blavatsky.ts`.

### Source and checking

The base is the Theosophical University Press online edition (theosociety.org/pasadena), which reproduces the first editions page for page and is proofread. It is compared word by word with the archive.org OCRs of separate printed copies:

| Volume | Copies |
|---|---|
| SD I | `secretdoctrinesy0001hpbl_w8r1` (1888); the 1977 TUP facsimile `bwb_C0-ADX-874`; the 1925 Theosophy Company facsimile `in.ernet.dli.2015.62045` |
| SD II | the Wellcome Library's 1888 copy `b24886142`; `secretdoctrinesy0002hpbl_o5q6`; `bwb_Y0-BMG-596`; `in.ernet.dli.2015.62045` |
| Isis | Cornell's 1877 copies `cu31924092304579` / `-587`; the Wellcome Library's 1878 printing `b24886154`; `india.history.resource.85989–90` |

How the collation works:
- Each OCR is located by difflib.
- Words are compared on letters only.
- Where at least two OCRs agree against the base, and outnumber it, their reading is taken. Closing punctuation is voted the same way.
- Figures and sloka numerals are never changed.
- In-order agreement with the base was 0.86–1.00 per copy and passage.

Results:
- The vote changed 3 words, all checked on page images and all first-edition misprints that are kept:
  - "brillant" (SD I p. 29);
  - "heard ot the book of Dzyan" (SD I p. viii);
  - "autara" (Isis I p. 590).
- It changed one comma ("And," in Cosmogenesis VII).
- `REJECT` overrules 12 agreeing misreadings: small capitals, ligatures, a broken letter, line-break splits and a Greek word.
- `FIXES` holds 7 corrections by hand, each asserted:
  - the circle "◯" in Cosmogenesis IV.5, which the base omits (page image of SD I p. 31);
  - sloka 5 of Cosmogenesis IV restored as its own paragraph;
  - "He collects" (Cosmogenesis VI);
  - a capital I, a full stop and a capital T in Anthropogenesis (page images of SD II pp. 17, 20);
  - a line of the Odyssey in Greek type, given in the base's transliteration and marked as such.

What is left out or changed:
- Footnotes are left out, except two that are part of a selected passage, printed after it as "[Footnote]".
- Small capitals are given in ordinary case, and accents are not reproduced.
- The revised third edition (1893) is not used.

### The Stanzas apart from the commentary

Each Stanza is imported as first printed together, before the commentary that repeats it sloka by sloka. Her closing sentence ("Thus ends this portion …") is left out. Each stanza's notes give the heading and page of its commentary from the table of contents, for example "The Night of the Universe", p. 35. The commentary itself is not imported.

### The Book of Dzyan

The Book of Dzyan is framed as unsupported, and the corpus header and the part notes say so: no manuscript has ever been produced, and Blavatsky herself wrote that it was "utterly unknown to our Philologists" (SD I p. xxii). W. E. Coleman wrote (p. 359) that it was "the work of Madame Blavatsky, — a compilation, in her own language, from a variety of sources". His essay is "The Sources of Madame Blavatsky's Writings", Appendix C to Solovyoff, *A Modern Priestess of Isis*, London 1895, pp. 353–366; archive.org `cu31924031226792`, checked against a second copy, `modernpriestesso00solo`. The selection includes her own words on the book:
- the preface, "who has ever even heard of the book of Dzyan?" and "the charge of having invented the whole of it";
- the etymology footnote (p. xx);
- p. xxii;
- the claim of descent and Senzar (p. xliii);
- the palm-leaf "Archaic Manuscript" of the Proem (p. 1).

### Selection

| Book | Volume | Pages |
|---|---|---|
| Isis | I | 1, 3, xxxi–xxxii, 507, 589–591, 592–593 |
| Isis | II | 360, 361, 364 |
| SD | I | viii, xx (footnote), xxii–xxiii, xliii, 1 |
| SD | II | 1–2 (with a footnote quoting the Pymander), 6–9, 109, 113, 556, 743 |

The topics are Hermes and the forty-two books, the Smaragdine Tablet (four passages), the Book of the Dead, the island of the "Sons of God", Atlantis and Thevetat, the continents of the root races, and the priests of Sais.

### Dates

- On `modern.hpb.isis`: publication 1877 (title page).
- On `modern.hpb.sd.1`: publication 1888 (title page; preface signed "London, October, 1888").
- On `modern.hpb.cosmo`:
  - claimed: no year. Her claim (SD I p. xliii; Isis I p. 1) is that the book was taken down in Senzar at the beginning of her fifth race. It is recorded as "Blavatsky's claim, not a date".
  - composition: 1880–1888, `decade`, approximate. The evidence is that the Stanzas were first printed in 1888, that no manuscript or earlier witness exists, her own admissions, and Coleman (written after April 1893, published 1895). The start of the span is not a finding.
  - publication: 1888.

### Links

There are 14 links, all `proposed`.

Thirteen are `later_reinterpretation`, each saying she quotes, cites or retells the text, "not a witness to the earlier text":
- Isis I 507 → `arab.tab.vulgate`;
- Isis I xxxi and SD II 109 → `arab.tab.vulgate.05`;
- SD II 109 → `.06`;
- SD II 113 → `.02`;
- SD II 556 → `.10`;
- SD II 1 → `herm.ch.1.16` (the Seven men);
- Isis II 360 → `herm.ascl.24.3` (a free paraphrase of the lament);
- Isis II 364 → `egy.bd.125`;
- Isis I 589 → `greek.crit.113c`;
- SD II 6 → `greek.tim.25d`;
- SD II 743 → `greek.tim.23b` and `greek.tim.24e`.

One is `broad_thematic_resemblance`, Anthropogenesis X → `modern.doreal.01` (Atlantis). Its transmission evidence is "None shown". None claims ancient transmission.

### Images

Nine images, all from Commons file pages, each looked at, all `licenceStatus` "open".

Four are pages of the first editions, given as Commons PDF page thumbnails (960px) and checked against the archive.org page images:
- the SD II 1888 title page (Wellcome copy);
- SD II p. 15, the Stanzas of Anthropogenesis with the forty-nine-slokas footnote;
- the Isis I 1877 title page (Cornell copy);
- Isis I p. 507, the Smaragdine Tablet.

Three are secure portraits:
- the Library of Congress Bain photograph, LCCN 2005688465, undated;
- Rijksmuseum RP-F-2001-7-67-105, a printed portrait captioned by hand "in all the majesty of her wrinkles", CC0;
- Hermann Schmiechen's oil portrait.

Two are `UNVERIFIED`:
- `H.P.Blavatsky_1887.jpg`: its date, place (Norwood) and photographer rest on the file page;
- `Tsseal1875.gif`: a modern redrawing of the Theosophical Society's emblem whose form at any date is not verified.

Several pictures are not used:
- `Isis_Unveiled.jpg` is on the marker and is not repeated.
- `The_Secret_Doctrine.gif`, described as the 1888 cover, is a modern TUP paperback cover and was left out.
- `Secretdoctrineblav.jpg` was left out.
- No picture is filed as a manuscript: there is none.

### Plain words

There are 39 plain-words entries, 16 of which have "Other possible readings". These cover the obscure terms of the Stanzas, the bracketed readings that are hers, not the Stanzas', and her misprints. The racial hierarchy of Anthropogenesis VII and X ("narrow-headed", "black with sin") and her term "Aryan" are named in the notes and the plain words as the text's own.

### Not done

- `inventoryVerified` stays false and `expectedUnits` null. The selection is the archive's choice, listed by page, not a count stated by an edition.
- The commentary on the Stanzas, the rest of both books and the 1893 edition are not imported.
- Blavatsky's own footnotes are left out, except two. Footnotes recorded only in notes include the forty-nine-slokas note, the note on the Sanskrit numbers, and the note that Stanza VI.1 is "of a far later date".
- Coleman is cited for his verdict only. The appendix promises its detailed proofs for "a work I am preparing for publication" and does not give them, and no later scholarship is cited here.
- The text was checked on page images only where the OCRs disagreed or a reading was in doubt. It has not been proofread page by page.

## 21. Stage 15: Hortulanus and the Mirror of Alchimy

The medieval commentaries on the Emerald Tablet (`arab.tablet-commentaries`, prefix `arab.comm`). This stage imports one of them, Hortulanus's commentary, as a treatise, `arab.comm.hort`. It is attached to the marker the inventory already defines (`hortulanus-emerald-tablet-commentary`); there is no new marker.

The text is the English of *The Mirror of Alchimy* (London: Thomas Creede for Richard Olive, 1597; STC 1182, ESTC S100517), which is public domain. Two pieces are imported in full, in the 1597 spelling:
- the Smaragdine Table of Hermes as the book prints it (pp. 16–17), since the archive had no English of 1597;
- "A briefe Commentarie of Hortulanus the Philosopher" (pp. 17–27).

Three things are cited rather than imported:
- **Bacon's *Mirror* proper (pp. 1–16).** It is not imported. The only second transcription found is in modernised spelling, so it is left for a later stage.
- **The Latin of *De Alchemia* (Nuremberg: Petreius, 1541).** It is public domain, and the layer `lat-de-alchemia-1541` carries a `contentAbsentReason`. Only one copy's page images could be reached (e-rara, doi:10.3931/e-rara-5596), and nothing was available to check a reading against.
- **Linden's edition (1992).** It is in copyright and is a `copyrighted_reference` layer (`eng-linden`).

The inventory gained three sources: `mirror-alchimy-1597`, `de-alchemia-1541` and `linden-1992`. The work record was rewritten, with:
- `unitDivisionKind` "chapter";
- `expectedUnits` null;
- `inventoryVerified` false;
- dates with evidence.

Files:
- `corpus/hortulanus.ts`;
- the generated `corpus/hortulanus-text.ts`, made by `scripts/texts/hortulanus-mirror.py`;
- `corpus/hortulanus-related-images.ts`;
- plain words in `corpus/plain/hortulanus.ts`.

### Source and checking

The witnesses are:

| Siglum | Witness | Notes |
|---|---|---|
| T | EEBO-TCP A01683 (CC0), in the EarlyPrint Project's tokenised edition | The base. Keyed from the microfilm of the Huntington Library copy; "not fully proofread". Its original spellings are used, never EarlyPrint's regularised ones. |
| M | Adam McLean's transcription (alchemywebsite.com/hortulan.html) | The commentary only, in modern u/v and i/j. |
| C | archive.org OCR of the Countway Library copy (`mirrorofalchimy00baco`) | A second physical copy. |
| H | archive.org OCR of the Huntington microfilm (`bim_early-english-books-1475-1640_the-mirror-of-alchimy-_bacon-roger_1597`) | |

How the collation works:
- The words are aligned with difflib on letters only (long s and f as s, u = v, i = j).
- In the commentary, a reading is taken against T only where at least two witnesses agree, M is one of them, and they outnumber T. Agreements between the two OCRs alone are logged and not taken.
- In the Tablet, which M does not have, the OCRs' agreements are only logged.
- In-order agreement with T was:
  - M: 0.98;
  - C: 0.54 in the commentary, 0.53 in the Tablet;
  - H: 0.48 in the commentary, 0.41 in the Tablet.
- The vote changed one word: "Sunue" became "Sunne" on p. 20.
- Every place where M and T differ (47) was logged and read on the page images, as were the OCR-only agreements (4).
- The microfilm images of the Huntington copy (pp. 16–27) were read in full against the output.
- The Countway scan was read for pp. 16–17, 21–23 and 26, and wherever the microfilm was faint.
- `FIXES` holds 20 corrections by hand, each asserted to apply the stated number of times.

The two copies are of different states of the sheet, so `VARIANTS` records three Countway press variants:
- "tha gently";
- "discendeth";
- "adabtations".

The Huntington readings are kept. The copies were not collated in full, so these are the differences seen, not all there are.

The printer's misprints are kept:
- "and and againe" across pp. 16–17;
- "adatpations";
- "beeause";
- "seperate";
- "CHAP X." without its stop.

Long s is printed s, and abbreviations are expanded. Running heads, page numbers, signatures and catchwords are left out. The book has no editorial apparatus. The generator reproduces `hortulanus-text.ts` byte for byte from the four inputs.

### Units

`arab.comm.hort` (`treatise`) holds no text. It carries:
- the cited Latin and Linden layers;
- the dates;
- the two title-page pictures.

Its 16 children carry the text:

| Key | Division | Content |
|---|---|---|
| `arab.comm.hort.tablet` | `version` | The Tablet as printed |
| `.prayer` | `section` | The commentary's title and Hortulanus's prayer |
| `.preface` | `section` | The preface |
| `.1` … `.13` | `chapter` | The thirteen chapters |

Each child records:
- its printed pages;
- both copies as witnesses: `huntington-1597`, the base, and `countway-1597`, which has the variant note on the Tablet.

Themes are on 14 passages, including above-and-below, Sun and Moon, ascension, creation, and death and rebirth.

### Attribution and dates

The title page attributes the book to "the thrice-famous and learned Fryer, Roger Bachon". This is recorded as the title page's claim, which scholars doubt, and it does not extend to Hortulanus. The translator is not named.

The dates on `arab.comm.hort`:
- **Composition: 1300–1400, `century`, marked disputed.**
  - It is the usual fourteenth-century dating (Ruska 1926).
  - The commentary gives no date. Its author names himself only as "Hortulanus, so called for the Gardens bordering vpon the sea coast, wrapped in a Iacobin skinne".
  - The e-rara catalogue record of *De Alchemia* gives "14. Jht., bzw. 11./12. Jht".
- **Latin first printing: 1541.** This is the imprint of *De Alchemia*. Its p. 363, seen on Commons, has the whole Tablet and ends with the catchword "Hortula-".
- **English translation: 1597.** This is from the title page and the colophon (Thomas Creede).

### Links

There are 25 links, all `proposed`:
- **Gloss links: 21 `later_reinterpretation` links**, from each chapter to the vulgate line or lines whose words it quotes as its lemma (`hortulanus-N-explains-vulgate-NN`). Every chapter explains at least one line, and all 18 lines are explained. Each link says what the Tablet itself does and does not say. Two examples:
  - "telesme" renders an Arabic word for talismans, which Hortulanus did not know;
  - the commentary's "Thou shalt separate" stands against the vulgate's "separabit".
- **`arab.comm.hort.tablet` → `arab.tab.vulgate`:** `direct_textual_parallel`. The links note:
  - the 1597 opening narrative and "philosophy" agree with the 1541 Latin and not with the archive's vulgate;
  - that the translator used the 1541 printing is likely but not shown.
- **`arab.comm.hort.tablet` → `arab.secretum.10.7`:** `close_conceptual_parallel`, with "None shown … never as transmission".
- **`modern.hpb.sd.2.109` → `arab.comm.hort.4`:** `symbolic_similarity`, on the Sun and Moon.
- **`modern.hpb.sd.2.113` → `arab.comm.hort.2`:** `close_conceptual_parallel`, on the Lapis Philosophorum.

Both Blavatsky links say "None shown": she does not cite Hortulanus.

### Images

There are four images, all from Commons file pages, each looked at, all `licenceStatus` "open":

| Image | Placed on | Identification |
|---|---|---|
| The 1597 title page, the Countway copy (owners' signatures Comstock and Neile) | `arab.comm.hort` | secure |
| Creede's printer's device ("VIRESCIT VULNERE VERITAS", "TC"), cut from the same title page | `arab.comm.hort` | secure, marked `duplicateOf` the title page |
| Kriegsmann's *Tabula Smaragdina* title (1657, SLUB Dresden / Deutsche Fotothek) | the Tablet | secure, related and later evidence |
| Zentralbibliothek Zürich Ms. Rh. 172 f. 3r (*Aurora consurgens*), an old man holding a painted board | the Tablet | `UNVERIFIED` |

The Zürich picture is `UNVERIFIED` because "the discovery of the Emerald Tablet" is the file page's description only. The board carries pictures, not the Tablet's words.

The following are not repeated, because they are already used elsewhere:
- on the marker: the Petreius p. 363 page and Khunrath's Smaragdtafel;
- on the vulgate: the Chrysogonus page and Wellcome M0012393.

The Mirror's ornamental initials and fleuron were looked at and left out, because they belong to Bacon's text. No picture of Hortulanus's Latin commentary, or of a manuscript of it, was found on Commons.

### Plain words

There are 16 plain-words entries, of which 11 have "Other possible readings". These cover:
- telesme;
- meditation/mediation and adaptation;
- "perfect man" in the prayer;
- the "Iacobin skinne" and the name;
- "firmament" for ferment (Chapters V and VIII);
- philosophical dung as gentle heat;
- obscurity;
- adaptations;
- philosophers' Mercury.

They explain the alchemical terms as they are usually taken, without claiming to know Hortulanus's laboratory practice.

### Not done

- `inventoryVerified` stays false and `expectedUnits` null. The thirteen chapters have not been checked against a stated inventory of the Latin.
- The 1541 Latin is cited, not transcribed. Whether the 1597 translator used that printing is not shown.
- Bacon's *Mirror* proper, Calid's *Booke of the secrets of alchimie* and the rest of the 1597 book are not imported.
- The other medieval commentaries on the Tablet are not imported.
- The two copies were collated only at disputed places. The Huntington microfilm was read in full, but the text has not been proofread against a second full collation.
- The marker's caption for the Petreius p. 363 picture still says it is unchecked; it was not changed in this stage, although the page was looked at here.

## 22. Stage 16: Steiner's Atlantis and Lemuria (1911)

Rudolf Steiner's account of Atlantis and Lemuria (`modern.steiner`, prefix `modern.steiner`). It is attached to the marker that already exists (`steiner-lemurian-epoch`); there is no new marker. The inventory entry gained two extra claims for it: Steiner's claim (the Akashic Records, no year) and the English of 1911. The marker already has the 1904–1908 writing date, so no second composition claim was added.

The text is *The Submerged Continents of Atlantis and Lemuria, Their History and Civilization, Being Chapters from the Akashic Records* (London: Theosophical Publishing Society, 1911), "authorized translation from the German", sold as *Atlantis and Lemuria*. It is the first English of the articles "Aus der Akasha-Chronik" (*Lucifer-Gnosis*, 1904–08). All ten chapters are imported in full.

From the title page and the trade:
- The title page, as transcribed, gives London, Theosophical Publishing Society, 1911. Its verso reads "Copyright 1911, Dr Weller Van Hook, in the United States of America" and names Max Gysi as editor. The title page names no translator.
- *The Bookman* (London), September 1911, reviews "Atlantis and Lemuria (3s 6d. net)".
- *Publishers Weekly*, 21 October 1911, lists the American issue: "auth. tr. from the German by Max Gysi. Chic., Rajput Press, '11".
- The page counts reported disagree (202, 204, 223 and 241 pp.), and no page image was seen, so no page is cited.

Copyright: the 1911 English is public domain in the United States, so its layer is `public_domain_us`. Gysi was alive in 1934 and his death date was not established, so its status elsewhere is flagged as unsettled.

Two things are cited rather than imported:
- **The German (GA 11).** It is public domain, and the layer `deu-akasha-chronik` carries a `contentAbsentReason`. The only German reached is the sixth edition's, on the Rudolf Steiner Archive's parallel pages, not the articles as first printed in *Lucifer-Gnosis*.
- **Cosmic Memory (1959).** Karl E. Zimmer's complete translation is in copyright and is a `copyrighted_reference` layer (`eng-cosmic-memory`).

The inventory gained five sources:
- `steiner-atlantis-lemuria-1911`;
- `steiner-akasha-chronik`;
- `steiner-cosmic-memory-1959`;
- `scott-elliot-atlantis-1896`;
- `bookman-1911`.

The work record was rewritten, with:
- `unitDivisionKind` "section";
- `expectedUnits` null;
- `inventoryVerified` false.

Files:
- `corpus/steiner.ts`;
- the generated `corpus/steiner-text.ts`, made by `scripts/texts/steiner-atlantis.py`;
- `corpus/steiner-related-images.ts`;
- plain words in `corpus/plain/steiner.ts`.

### Source and checking

**Only one transcription of the 1911 English could be reached.** No scan of the book was found:
- archive.org holds none. It was searched by title, by creator and in full text for four distinctive sentences, and every hit was S or a later book quoting it;
- HathiTrust refused the request (403);
- Google Books offers no full view;
- Project Gutenberg and Wikisource have no copy;
- sacred-texts.com refused the request (403).

The witnesses are:

| Siglum | Witness | Notes |
|---|---|---|
| R | The Rudolf Steiner Archive's e-text (rsarchive.org, `GA011/English/TPS1911`, pages `_c01` to `_c10`; chapter V is the second half of `_c04`) | The base. |
| S | archive.org `ste-11_202012`, a PDF print-out of the same e-text ("On-line since: 15th August, 2011"), read through archive.org's OCR | The same transcription at an earlier date. It is not an independent copy. |
| B | *The Bookman*, September 1911 (archive.org `sim_bookman_the-bookman_1911-09_40_240`) | Quotes four phrases of the book. Independent, but short. |
| G | The Archive's German–English parallel pages (`Compare_P1.php` … `Compare_08.php?version=TPS`) | Used for the paragraph structure and for the two corrections. |

No majority of independent witnesses could be formed, and no reading could be checked on a page. What was done instead:
- R was compared word by word with S (difflib on letters and figures). Every difference is settled in `REJECT`, where S is wrong (4: OCR run-togethers and rows of stars), or in `DISPUTED`.
- Two readings are left `DISPUTED`, and R's is kept:
  - "palaeontology" (S "paleontology", chapter I);
  - "mastery of natural forces was learnt" (B "were learnt", chapter IV).
- Errors common to R and S were looked for by listing every word not found in the archive's other English texts and by reading the whole text. Two were found and are corrected in `FIXES`, each on the sense and on the German:
  - "clone" becomes "done" ("was die Führer getan hatten", chapter V);
  - "on which" becomes "one which" ("eine solche, die", chapter X).
- B's four quotations are asserted to stand in the result: three in the same words, and one as the disputed reading.
- G's paragraphs match R's in every chapter, with two exceptions:
  - the last paragraph of "Die lemurische Rasse", which the Archive marks "Not translated";
  - the last paragraph of "Austritt des Mondes", where the English prints an editor's note on *An Outline of Occult Science* instead.
- R renumbers paragraphs to match the German. S's paragraph breaks are restored inside R's paragraphs wherever both texts align and the break follows the end of a sentence.

The text keeps the 1911 spellings ("Âkâshic", "Âryan", "to-day"). The book's three footnotes, all in chapter I, are printed after the text as "[Footnote]". Italic is not marked. The generator reproduces `steiner-text.ts` byte for byte from its three inputs.

### Units

`modern.steiner.1911` (`book`) holds no text. It carries:
- the cited German and Cosmic Memory layers;
- the dates;
- the portrait.

Under it are ten `chapter` records, `modern.steiner.1911.1` … `.10`. Each gives its German chapter title and holds no text.

Under the chapters are 26 `section` passages, `modern.steiner.1911.N.M`, which carry the text. They follow the Archive's paragraph numbers:

| Chapter | Sections (Archive paragraphs) |
|---|---|
| I From the Âkâshic Records | [1–2] |
| II Our Atlantean Forefathers | [1–4], [5–10], [11–16], [17–22] |
| III Transition of the Atlantean into the Âryan Root-Race | [1–4], [5–8], [9–12] |
| IV The Lemurian Era | [1–3], [4–7] |
| V Woman in the Third Root-Race | [8–12], [13–18] (numbered on from IV) |
| VI Humanity Before the Division of Sex | [1–6], [7–8], [9] |
| VII The Beginnings of Sex Duality | [1–5], [6–10], [11–12] |
| VIII Man's First Ancestors | [1–2], [3–7], [8–10] |
| IX The First, or Polar, Race | [1–4], [5–8] |
| X The Second, or Hyperborean, Race | [1–3], [4–5], [6–8] |

The 1911 headings of IX and X do not translate the German ones ("Anfang der gegenwärtigen Erde: Austritt der Sonne", "Austritt des Mondes"); the chapter records say so. The selection is listed by chapter and paragraph, not by page, so `inventoryVerified` stays false.

### The Akashic Records, Steiner's sources, and the racial theory

Steiner says the chapters repeat the "Akashic Records", a record of the past that he says trained seers can read. This is recorded as his claim and given no year.

He names his Theosophical sources:
- W. Scott-Elliot's *The Story of Atlantis* (1896), in chapter I, for the outer history of Atlantis. His seven Atlantean sub-races (Rmoahal to Mongolian) are Scott-Elliot's, and so are his figures (a million years; the last remnant sunk "nearly 10,000 years B.C.").
- the "Secret Doctrine", for the root races (chapter II);
- "Theosophical literature" or "Theosophical books", for the Lemurian continent "from Ceylon to Madagascar", the Manu, the Polar and Hyperborean races, Prâna and Kâma.

He wrote the articles as General Secretary of the German Section of the Theosophical Society.

The book ranks human groups as advanced or degenerate races. Examples:
- the "so-called savages" as Lemurian descendants;
- the Mongolians' "blind faith";
- the "animal-men";
- "monkeys are retrograde human beings";
- "savage" tribes as "degraded descendants";
- the descendants of the last Lemurians and Atlanteans "dying out".

The notes on chapters II–V and VII, and on the five sections concerned, say plainly that this is the text's own racial theory. The plain words say the same.

### Dates

On `modern.steiner.1911`:
- **Claimed: no year, `millennium`.** "Steiner's claim, not a date": he says he reads the Akashic Records and must "for the present" be silent about his sources. His Atlantis figures are Scott-Elliot's.
- **Composition: 1904–1908.** The Rudolf Steiner Archive's GA 11 note gives "a series of twenty articles between July 1904 and May 1908 in the magazine Lucifer-Gnosis": monthly to the sixteenth instalment, then yearly; collected 1908–10; the first part issued separately in 1908. The 1911 English adds two references to *An Outline of Occult Science* (1910) that the German articles do not have.
- **English: 1911**, not approximate. The title page as transcribed, *The Bookman* and *Publishers Weekly*.

### Links

There are 14 links, all `proposed`, none `documented_transmission`:
- **Plato, three `later_reinterpretation` links** from chapter I: to `greek.tim.24e` (the island in the Atlantic), `greek.tim.25d` (the sinking) and `greek.crit.113c` (Poseidon's island). They say that "Poseidonis" is not Plato's name but Scott-Elliot's, and that Steiner quotes nothing of Plato.
- **Blavatsky, `later_reinterpretation`, where he names a Theosophical source:**
  - 2.2 → `modern.hpb.sd.2.6` (the root races, "Secret Doctrine");
  - 4.1 → `modern.hpb.sd.2.6` (Lemuria, "Theosophical books");
  - 3.2 → `modern.hpb.anthro.12` (the Manu and the fifth race);
  - 8.2 → `modern.hpb.anthro.5` (the Polar and Hyperborean races).
- **Blavatsky, `close_conceptual_parallel`, "None shown", where he names none:**
  - 6.1 and 7.1 → `modern.hpb.anthro.6` (the two-sexed race; the egg);
  - 7.3 → `modern.hpb.anthro.8` (the mindless and the apes);
  - 8.3 → `modern.hpb.anthro.10` (the one eye and the Third Eye);
  - 2.3 → `modern.hpb.isis.1.592` (Atlantis falls by the misuse of power).
- **Doreal, two `broad_thematic_resemblance` links**, "None shown": 1.1 → `modern.doreal.01` and 3.1 → `modern.doreal.05`.

Every `later_reinterpretation` says that Steiner's book is "not a witness to the earlier text".

### Images

There are six images, all from Commons file pages, each looked at, all `licenceStatus` "open". No page of the 1911 book could be shown.

| Image | Placed on | Identification |
|---|---|---|
| *Lucifer-Gnosis* no. 13, June 1904, the cover ("Herausgeber: Dr. Rudolf Steiner"; contents open with "Wie erlangt man Erkenntnisse der höheren Welten?") | 1.1 | secure |
| Steiner, head and shoulders, "when he was 46" (about 1907) | the book | `UNVERIFIED` |
| Steiner with Annie Besant, Munich 1907 (after Vögele 2005, p. 167) | 2.2 | `UNVERIFIED` |
| The first Goetheanum under construction, "1. April 1914" written on the print | the file | secure, context |
| Steiner with the model of the first Goetheanum, attributed to Otto Rietmann | the file | `UNVERIFIED` |
| The first Goetheanum finished, in colour, undated | the file | `UNVERIFIED` |

Why the four are `UNVERIFIED`:
- the 1907 portrait: its date rests on the file page alone, and so does its attribution to Ita Wegman;
- the Besant photograph: its date and place rest on a book that was not checked;
- the model photograph: the file page gives both 16 June and 16 May 1914;
- the colour photograph: it has no date, no photographer and an unclear colouring.

`Steiner_um_1905.jpg` and `Goetheanum_Dornach.jpg` are on the marker and are not repeated. The fire ruin of 1923 was looked at and left out as too far from the text.

### Plain words

There are 26 plain-words entries, one per section. Each reports the account as Steiner's ("Steiner says", "According to Steiner"), and each passage with racial ranking names it as the text's own racial theory. Five have "Other possible readings":
- "Poseidonis" is not Plato's word (1.1);
- what "Theosophical literature" refers to (2.2);
- the disputed "was learnt"/"were learnt" (4.2);
- the corrections "clone"/"done" (5.2) and "on which"/"one which" (10.1).

### Not done

- No page image of the 1911 book was reached, so no reading could be checked on the page. If a scan turns up, the two disputed readings and the two corrections should be read there, and pages added to the references.
- The German is cited, not transcribed. The *Lucifer-Gnosis* issues were not seen, so the 1904–1908 span rests on the Archive's note.
- *An Outline of Occult Science* (1910), named in the old inventory summary, is not imported.
- Gysi's death date, and so the 1911 English's copyright outside the United States, was not established.
- Scott-Elliot's *The Story of Atlantis* is cited as a source, not imported, so Steiner's dependence on it cannot be linked passage to passage.

## 23. Stage 17: The Kybalion (1908)

*The Kybalion: A Study of the Hermetic Philosophy of Ancient Egypt and Greece*, by "Three Initiates" (Chicago: The Yogi Publication Society, Masonic Temple, 1908).

It has its own work entry, `modern.kybalion`, with the prefix `modern.kyb`. It is filed under brief item 33 beside `modern.other-authors`. That entry's list of proposed members now says the Kybalion is imported as its own work, and it is no longer listed among that entry's full-text editions.

Its tradition class is `modern_claiming_ancient`: a modern book that presents its maxims as an unwritten ancient tradition, never produced for examination. It creates its own marker, `kybalion-published`, which shows the claimed antiquity and the 1908 publication side by side. The marker's picture is the 1908 title page (`Kybalion_1908.jpg`, added to `marker-pictures.ts`).

The whole book is imported from the 1908 first edition: the Introduction and the fifteen chapters, 16 units in all.

The inventory gained four sources:
- `kybalion-1908`, the book;
- `cce-1908`, the Catalog of Copyright Entries for 1908, entry 15439;
- `post-office-1919`, the Post Office hearing of 4 April 1919 on the Advanced Thought Publishing Company and the Yogi Publication Society;
- `deslippe-2011`, Philip Deslippe's introduction to *The Kybalion: The Definitive Edition* (Tarcher/Penguin, 2011), which is in copyright and cited only.

Files:
- `corpus/kybalion.ts`;
- the generated `corpus/kybalion-text.ts`, made by `scripts/texts/kybalion.py`;
- `corpus/kybalion-related-images.ts`;
- plain words in `corpus/plain/kybalion.ts`.

Copyright: public domain. The book was published in the United States in 1908 and is pseudonymous; its usual attributed author died in 1932. The text layer is `public_domain`.

### Source and checking

Four 1908 copies and one later printing could be reached. The witnesses are:

| Siglum | Witness | Notes |
|---|---|---|
| W | Wikisource's proofread transcription (`en.wikisource.org/wiki/The_Kybalion`) of the Brigham Young University copy (archive.org `kybalionstudyofh00init`; also on Commons as a DjVu) | The base. It is the only transcription of a 1908 copy read by a person, and it gives the pages. |
| B | archive.org's OCR of the same BYU copy | An independent reading of the same copy. |
| T | archive.org's OCR of the Internet Archive's own 1908 copy (`kybalionstudyofh00thre`) | An independent copy. |
| C | archive.org's OCR of the Claremont School of Theology's 1908 copy (`kybalionstudyofh0000thre`) | An independent copy. |
| K | archive.org's OCR of Google's scan of a Stanford copy (`kybalionastudyh00unkngoog`) | An independent copy. |
| G | Project Gutenberg #14209 | An e-text of a later printing ("Copyright 1912"). Its setting differs from 1908's in small ways. |

**The vote.** W's words were aligned with each witness (difflib on letters and figures only). Running heads, page numbers and chapter headings were removed first, and words broken at line ends were joined. Where witnesses agree on another reading and outnumber those agreeing with W (W counts as one), the majority reading is taken.

The vote changed seven places, each asserted in `EXPECTED_TAKEN`:
- "Kyhalion", twice;
- "EXILE" (the page has "RULE");
- "Kelative";
- "conscionsness";
- "refusings" (the page has "refusing");
- a "to" that W leaves out.

One wrong majority is rejected: three OCRs read the "O," of "O, let not the flame die out!" as a zero.

**Joins.** Thirty-five words that W splits at a page break or at a leftover hyphen are joined where G has the whole word.

**Corrections by hand.** `FIXES` holds eight:
- three more "Kyhalion". These were ties, because B and K misread the italic b too; the page image of p. 26 shows the b;
- "Eeality";
- "comers" (the page image of p. 90 has "corners");
- a misplaced comma on p. 36;
- four of W's quotation marks.

Punctuation is not voted, so every paragraph with an odd number of quotation marks was compared by hand with the other witnesses. At the four corrected marks, the other 1908 copies all read otherwise. One of the four closes the saying "But, the report of Reason must be hospitably received, and treated with respect."

**1908 misprints kept.** Every 1908 copy shares these, so they stay; G corrects most of them:
- "understading";
- "Princible";
- "phenomennon";
- "resistence";
- "Appollo";
- "They they";
- "a steam of Vibratory Energy";
- "If the Universal is Mental";
- "no such things as Chance".

**G's own changes are not taken.** In 76 places G follows its later setting, for example:
- Arabic numerals in lists;
- "scepter" and "centers";
- "in italics" for 1908's "in quotation marks";
- "biggest" and "whenever".

**Page images.** These were read wherever the decision turned on the print: pp. 26, 27, 36, 39, 90, 213 and 218 of the BYU copy. The text has not been proofread page by page.

**How the text is given:**
- W's paragraphs and straight quotation marks are kept;
- dashes are closed up as the book sets them;
- italic and small capitals are not marked;
- the heading "VII. THE PRINCIPLE OF GENDER." is printed twice on p. 39 (seen on the page image), and both are kept;
- the Introduction's signature, "The Three Initiates.", and the closing "Finis" are kept.

### Units

`modern.kyb.1908` (`book`) holds no text. It carries:
- the cited Definitive Edition layer (`eng-deslippe-2011`, `copyrighted_reference`);
- the dates;
- six of the pictures.

Under it are 16 `chapter` units, which carry the text (layer `eng-1908`, `primary_text`):

| Unit | Chapter | Pages |
|---|---|---|
| `.intro` | Introduction | 7–14 |
| `.1` | I The Hermetic Philosophy | 15–24 |
| `.2` | II The Seven Hermetic Principles | 25–41 |
| `.3` | III Mental Transmutation | 43–51 |
| `.4` | IV The All | 53–63 |
| `.5` | V The Mental Universe | 65–76 |
| `.6` | VI The Divine Paradox | 77–93 |
| `.7` | VII "The All" in All | 95–111 |
| `.8` | VIII The Planes of Correspondence | 113–135 |
| `.9` | IX Vibration | 137–147 |
| `.10` | X Polarity | 149–158 |
| `.11` | XI Rhythm | 159–170 |
| `.12` | XII Causation | 171–182 |
| `.13` | XIII Gender | 183–192 |
| `.14` | XIV Mental Gender | 193–211 |
| `.15` | XV Hermetic Axioms | 213–223 |

The count comes from the book's own Contents, so `expectedUnits` is 16 and `inventoryVerified` is true. The Contents puts chapter XV at p. 212, but it begins on p. 213, a right-hand page after a blank. No passage is marked verified, so the work is not "verified against edition".

The book prints 39 sayings as quotations from "The Kybalion". They stay inside their chapters, and `KYBALION_SAYINGS` lists each with its chapter and page.

### The claim, the attribution, and "As above, so below"

**The claim.** The book says its teaching goes back to Hermes Trismegistus, "contemporary with Abraham". It came down through "THE KYBALION", a collection of maxims handed on "from mouth to ear", whose precepts "have never been written down, or printed, so far as we know". This is recorded as the book's claim and given no year.

No such collection has been produced. The Seven Principles are not in the Corpus Hermeticum or the Asclepius, and the sayings have no known ancient source. Every chapter that quotes them says so.

**The attribution.** The book is signed only "The Three Initiates". It is usually attributed to William Walker Atkinson (1862–1932), and the archive gives the attribution with its evidence:
- The Catalog of Copyright Entries for 1908 (entry 15439, seen on the page image) registers the copyright on June 13, 1908 to "The Yogi publication society, Chicago", not to a person. The same volume registers books by "Yogi Ramacharaka" to the same society.
- The 1919 Post Office hearing (an IAPSOP scan, read in full) records an inspector's report that the society "was founded by William Walker Atkinson", and that its owner had bought the business from him. It also reports that "Yogi Ramacharaka" was "no such person".
- Deslippe (2011) argues the attribution most fully. It is cited, not quoted, and was not read for this import.

Neither document names the author of the Kybalion, so the attribution is a scholarly inference, not a signature. The work's `attribution` field says "usually attributed".

**"As above, so below".** "As above, so below; as below, so above" is the book's second principle. It calls it "the old Hermetic axiom" (chapter II) and "this centuries old Hermetic axiom" (chapter VIII). The book never names the Emerald Tablet, the Corpus Hermeticum or Blavatsky. "Secret Doctrine(s)" appears only as a general phrase.

### Dates

On `modern.kyb.1908`:
- **Claimed: no year, `millennium`.** "The book's claim, not a date": Hermes in Egypt at the time of Abraham, and an unwritten Kybalion.
- **Publication: 1908**, not approximate. The source is `cce-1908` (two copies received June 13, 1908, registration A 209612), together with the title-page verso of the BYU copy. Its evidence also gives the attribution and its limits.

The marker `kybalion-published` carries the same two claims.

### Links

There are 10 links, all `proposed`. None is `documented_transmission` or `direct_textual_parallel`.

**Emerald Tablet and Hermes, `later_reinterpretation`.** These are used only where the book invokes Hermes or the axiom, and each says the book is "not a witness to the earlier text":
- 2 → `arab.tab.vulgate.02`. "The old Hermetic axiom" is a short form of the Latin line, given a new meaning: a law of correspondence between planes.
- 8 → `arab.tab.vulgate.02`. The planes of correspondence.
- 1 → `arab.tab.vulgate.17`. Hermes Trismegistus and his title: "thrice-great" in the book, "three parts of the wisdom" in the Tablet.

**Contrasts, `broad_thematic_resemblance`, "None shown":**
- 2 → `arab.tab.arabic.02`. The Arabic says the upper is FROM the lower; the wording "as above, so below" belongs to the Latin.
- 2 → `arab.comm.hort.2`. Hortulanus reads the same line as the two parts of the Stone.

**Hermetica and Blavatsky, `close_conceptual_parallel`, "None shown":**
- 5 → `herm.ch.11.20`. God holds all things in himself as thoughts; the Universe is held in the Mind of THE ALL.
- 7 → `herm.ch.11.18`. "All are in God".
- 7 → `herm.ch.12.23`. "In the All is naught that is not God".
- 2 → `modern.hpb.isis.1.507`. The Tablet's axiom as the essence of Hermetic wisdom.
- intro → `modern.hpb.sd.1.xliii`. All sacred teaching from one hidden source.

### Images

There are seven images in the corpus. All are from Commons file pages, each was looked at, and all have `licenceStatus` "open". The 1908 title page is on the marker and is not repeated. The book has no ancient object to show.

| Image | Placed on | Identification |
|---|---|---|
| The front cover of the BYU copy (DjVu page 1): gilt "The KYBALION / Hermetic Philosophy" | the book | secure |
| The title-page verso (DjVu page 6): "Copyright 1908 by The Yogi Publication Society. Entered at Stationer's Hall" | the book | secure |
| The dedication "To Hermes Trismegistus" (DjVu page 7) | Introduction | secure |
| A typed page of the 1919 Post Office transcript ("Yogi Ramacharaka ... no such person") | the book | secure; its 1919 date was checked against the transcript itself |
| Atkinson, an oval portrait over the printed signature "William Walker Atkinson" | the book | `UNVERIFIED` |
| Atkinson, an oval portrait, "Chicago, 1900", said to be from *Suggestion* | the book | `UNVERIFIED` |
| Atkinson, captioned "WILLIAM WALKER ATKINSON", said to be from 1901 | the book | `UNVERIFIED` |

The three portraits are `UNVERIFIED` because their dates and printed sources rest on their file pages alone. Each caption says the portrait is context for the usual attribution, "not evidence that he wrote it".

Left out:
- `William_Walker_Atkinson,_1900.jpg`, a colourised copy of the *Suggestion* portrait;
- `William_Walker_Atkinson.jpg`, which has no description;
- `Kybalion_Book_Cover.jpg`, a modern French cover.

### Plain words

There are 16 plain-words entries, one per unit. Each begins "The book" or "The authors" and reports the book's account of Hermes and the Kybalion as the book's. Each has "Other possible readings", covering one of these:
- a 1908 misprint that is kept;
- the corrected quotation mark (chapter V);
- whether "the old Hermetic axiom" means the Latin Emerald Tablet (chapters II and VIII);
- a phrase of the book's that can be taken more than one way.

### Not done

- The text has not been proofread page by page against the page images. Punctuation was not voted; only quotation marks were checked across witnesses.
- Deslippe's introduction (2011) was not read. The attribution here rests on the copyright register and the 1919 hearing. The hearing transcript is partial, and the OCR of its first pages is poor.
- The *Suggestion* portrait's source and date were not checked against the IAPSOP scan of *Suggestion* vol. 7.
- The 1912 and later printings are used only as a witness (G). Their differences are listed in the generator, not recorded as a separate edition.

## 24. Stage 18: Donnelly's Atlantis (1882) and Scott-Elliot's Story of Atlantis (1896)

Two members of `modern.other-authors` (brief item 33) are imported, each as its own work. That entry's list of proposed members now says so, and its full-text editions keep only Kingsford & Maitland.

- **`modern.scott-elliot`** (prefix `modern.scott`): W. Scott-Elliot, *The Story of Atlantis: A Geographical, Historical, and Ethnological Sketch*, with a preface by A. P. Sinnett (London: Theosophical Publishing Society, 7 Duke Street, Adelphi, 1896). The whole book: the Preface and the text, 24 units. Tradition class `modern`. Marker `story-of-atlantis-published`.
- **`modern.donnelly`** (prefix `modern.donnelly`): Ignatius Donnelly, *Atlantis: The Antediluvian World* (New York: Harper & Brothers, 1882). A selection of five chapters. Tradition class `modern`. Marker `donnelly-atlantis-published`.

The inventory gained one source, `donnelly-atlantis-1882`. The source `scott-elliot-atlantis-1896`, which the Steiner stage had added as a cited source, now describes the witnesses.

Files:
- `corpus/scott-elliot.ts`, `corpus/donnelly.ts`;
- the generated `corpus/scott-elliot-text.ts` and `corpus/donnelly-text.ts`, both made by `scripts/texts/atlantis-authors.py`, which records the method, every reading the vote took, the wrong majorities rejected and every correction by hand with the page it was read on;
- `corpus/scott-elliot-related-images.ts`, `corpus/donnelly-related-images.ts`;
- plain words in `corpus/plain/scott-elliot.ts` and `corpus/plain/donnelly.ts`.

Copyright: both are public domain (1896, Scott-Elliot died 1930, Sinnett 1921; 1882, Donnelly died 1901). Donnelly quotes Plato in Jowett's translation, also public domain. The text layers are `public_domain`.

### Source and checking

No proofread transcription of a copy of either first printing could be reached (Wikisource refused or did not resolve). So the base of each is a Project Gutenberg e-text of a later printing (G), voted word by word against archive.org's OCRs of independent copies of the reference printing. G's words are aligned with each witness (difflib on letters and figures only, after removing running heads, page numbers and headings and joining words broken at line ends). A reading is taken where at least three witnesses agree on it and outnumber those agreeing with G (G counting as one). Punctuation and capitals are not voted.

**Scott-Elliot.**

| Siglum | Witness |
|---|---|
| G | Project Gutenberg #21796, a later Theosophical Publishing House printing ("first printed 1896"). The base. |
| U | University of California (Los Angeles) copy of 1896 (`storyofatlantisg00scot`), with its page images; its leaves give the pages. |
| D | Digital Library of India copy of 1896 (`in.ernet.dli.2015.204900`). |
| M | Digital Library of India (Ministry) copy with the 1896 title page (`dli.ministry.23349`). |
| E | The "second and revised edition" (London, 1909; `in.ernet.dli.2015.38206`): a witness only, revised in sections 16–17. |

- Taken by the vote: "colonized" for G's "colonial" (p. 1), and the 1896 misprint "goverment" (p. 61, seen on U).
- Rejected majorities: three OCR misreadings of the figure 1 ("nth", "i", "ist").
- Corrected by hand, on U's page images: "him self" → "himself" (p. vii), "were-filled" → "were filled" (p. 43).
- 1896 misprints kept: "goverment", "an Intitiate emperor", "the various savages races", "while other travelled west".

**Donnelly.**

| Siglum | Witness |
|---|---|
| G | Project Gutenberg #4032. The base. (#3607, sometimes cited for this book, is Baker's *Ismailia*.) |
| K | Duke University copy, "Eleventh Edition" (`atlantisantedil00donn`, also on Commons as a DjVu), with its page images; its page list gives the pages. |
| U | `atlantisantedilu0000unse`, "Eleventh Edition". |
| A | `Atlantis1882` (Google scan), "Eleventh Edition". |
| S | `atlantisantedilu0000igna_s0m2`, "Twenty-fourth Edition", 1904, from the same plates. |

- Taken by the vote (the copies against G): "hearing" for "bearing" (Timaeus 22a); "hear" for "bear" twice (Critias 113a); Jowett's "ii., 517" for G's 617; a phrase of Critias 116c ("the royal palace; and then") back in its place; "Poseidon's"; "others"; "Hea, Anu, and Bel" for "Idea" (p. 283, seen); "Manual"; "falling"; "ship".
- Corrected by hand, on K's page images: Oppert's two tables, which G sets as text boxes, given from the print (pp. 29–30; G's "1,822" is "1,322"), with "[together]" for the brace and "[rule]" for the rule; "judgment" (p. 20); a dash (p. 3); "poem" (p. 5), "population" (p. 65), "R. P." (p. 67).
- No copy of the very first printing was reached; Harper reprinted the 1882 plates as numbered "editions". The Toronto copy could not be read.

Neither text has been proofread page by page.

### Units

**Scott-Elliot.** `modern.scott.1896` (`book`) holds no text. It carries the dates, the list of the four maps, and notes. Under it are 24 `section` units with the text (layer `eng-1896`). The book has no chapters. The archive divides it at the five classes of evidence ("First" to "Fifth"), at the six side-headings, and where the subject changes inside the longer heads. `expectedUnits` is 24 and `inventoryVerified` is false.

| Unit | Section | Pages |
|---|---|---|
| `.preface` | Preface, by A. P. Sinnett | iii–xi |
| `.1` | The Fifth Race, the four catastrophes, five kinds of evidence | 1–3 |
| `.2` | First: the deep-sea soundings | 3–4 |
| `.3` | Second: fauna and flora | 4–7 |
| `.4` | Third: language and ethnological types (names Donnelly) | 7–9 |
| `.5` | Fourth: religion, ritual and architecture | 9–12 |
| `.6` | Fifth: ancient writers, traditions, flood legends (quotes Plato) | 12–16 |
| `.7` | The "contemporary records" and the four maps | 16–19 |
| `.8` | The Manus and the seven sub-races | 19–26 |
| `.9` | Political Institutions: the Toltecs and sorcery | 26–31 |
| `.10` | The later sub-races' governments | 31–33 |
| `.11` | Emigrations: Rmoahals, Tlavatli, Toltecs (with a footnote) | 33–37 |
| `.12` | Egypt | 37–38 |
| `.13` | Emigrations of the later sub-races | 39–41 |
| `.14` | Arts and Sciences | 41–44 |
| `.15` | Education | 44–46 |
| `.16` | Agriculture and animal breeding | 46–49 |
| `.17` | The City of the Golden Gates | 49–51 |
| `.18` | Air-ships | 51–55 |
| `.19` | Manners and Customs | 55–58 |
| `.20` | Land tenure | 58–61 |
| `.21` | Religion (quotes the "Book of Dzyan") | 62–65 |
| `.22` | Religion: Trinity, elementals, sacrifice | 65–68 |
| `.23` | Conclusion | 68–71 |

The maps (`SCOTT_ELLIOT_MAPS`) are No. 1 "Atlantis at its Prime", No. 2 "Atlantis in its Decadence", No. 3 "Ruta & Daitya" and No. 4 "Poseidonis". Nos. 3 and 4 were read on the UCLA copy and the British Library copy's scans. Nos. 1 and 2 were not found in any 1896 copy reached, and their titles are G's.

**Donnelly.** `modern.donnelly.1882` (`book`) holds no text. It carries the dates, the selection and what was not imported. Under it are 5 `chapter` units (layer `eng-1882`); `expectedUnits` is null, because this is a selection.

| Unit | Chapter | Pages |
|---|---|---|
| `.1.1` | Part I ch. I, The Purpose of the Book | 1–4 |
| `.1.2` | Part I ch. II, Plato's History of Atlantis (Jowett's Timaeus and Critias) | 5–21 |
| `.1.3` | Part I ch. III, The Probabilities of Plato's Story | 22–30 |
| `.2.1` | Part II ch. I, The Destruction of Atlantis described in the Deluge Legends | 65–67 |
| `.4.2` | Part IV ch. II, The Kings of Atlantis become the Gods of the Greeks | 283–307 |

Part I chs. I–III were asked for. The rest of the book was searched for quotations of the Timaeus or Critias, and the two chapters that retell or quote the dialogues' story as their subject were added. Not imported, because they quote Plato only in passing: Part I ch. IV; Part II chs. V, VI; Part III chs. II, IV; Part IV ch. V; Part V chs. II, IX, X.

### Framing

- **Scott-Elliot's sources are his claim.** Sinnett's Preface says the facts were read by "astral clairvoyance" from "the memory of Nature", with access to "maps and other records physically preserved". The text says they were "drawn ... from contemporary records". This is recorded as the book's claim and given no year. No such record has been produced, and every map caption says the maps are Scott-Elliot's own of 1896.
- **Donnelly's thesis is rejected by geology and archaeology.** This is said plainly and neutrally in the work entry, the source, the book record, the chapter notes and the map's caption: no sunken continent lies under the Atlantic, whose ridge is a spreading ridge, and the likenesses he draws do not show a common origin.
- **The racial theory is the text's own.** Scott-Elliot's sections 1, 4, 8–13, 22 and 23 and their plain words say so; Donnelly's notes on 1.1 and 2.1 do the same.
- Other modern claims are flagged in notes: the Troano manuscript (in Madrid, not the British Museum, and Le Plongeon's reading is not accepted), the dates for Giza, Karnak and Stonehenge, and the Mid-Atlantic Ridge.

### Dates

- **Scott-Elliot**, on `modern.scott.1896`:
  - claimed, the occult records (no year, `millennium`);
  - claimed, the sinking of Poseidonis in 9564 BC (−9563, `year`);
  - publication 1896 (the UCLA and Ministry title pages).
  The marker carries the 9564 BC claim and 1896.
- **Donnelly**, on `modern.donnelly.1882`:
  - claimed, about 9600 BC (−9599, `century`, approximate), Plato's figure taken as history (p. 29, seen);
  - publication 1882 ("Entered according to Act of Congress, in the year 1882", seen on the Duke copy's title-page verso).
  The marker carries the same two.

### Links

All are `proposed`; none claims ancient transmission.

**Scott-Elliot (16).**
- `later_reinterpretation`, where he names or quotes Plato ("not a witness to the earlier text"): 1 → `greek.tim.25d` (Poseidonis, a name that is not Plato's); 6 → `greek.tim.24e`, `greek.tim.25a`, `greek.crit.114d`, `greek.crit.115a` (his quotation of the Timaeus and Critias, in an older English close to Taylor's).
- `close_conceptual_parallel`, "None shown": 17 → `greek.crit.113d` (the ringed capital); 8 → `modern.hpb.sd.2.6`; 9 → `modern.hpb.isis.1.592`.
- `documented_transmission`, between modern books only:
  - 1 → `modern.steiner.1911.1.1` (Steiner names the book), 8 → `modern.steiner.1911.2.2` and 10 → `modern.steiner.1911.2.4` (Steiner's sub-races);
  - 21 → `modern.hpb.anthro.10`, `modern.hpb.anthro.11` (he quotes the "Book of Dzyan", slokas 40 and 43, whose only text is Blavatsky's);
  - 4 → `modern.donnelly.1882.1.1` (he names Donnelly); 6 → `modern.donnelly.1882.1.3` (the same list of ancient writers, with the same reference to *Pre-Adamites*, p. 380).
- `broad_thematic_resemblance`, "None shown": 12 → `modern.doreal.01` (Atlantean wisdom carried to Egypt).

**Donnelly (19).**
- `later_reinterpretation`, 17 links, each where he names Plato or quotes him in Jowett's English:
  - 1.2 → `greek.tim.20d`, `22b`, `24e`, `25d`, `greek.crit.108e`, `113c`, `116c`, `119c`, `121b`;
  - 1.3 → `greek.tim.23e` (the 9,000 years made a date), `greek.crit.116a` (the three stones), `117a` (hot springs), `118a` (the lofty coast);
  - 2.1 → `greek.tim.23b` ("the great deluge of all");
  - 4.2 → `greek.crit.120e`, `121b`, `greek.tim.40e` (Oceanus and Tethys).
- `close_conceptual_parallel`, "None shown": 1.2 → `modern.hpb.sd.2.743` (both quote the priests of Sais).
- `broad_thematic_resemblance`, "None shown": 1.1 → `modern.doreal.01`.

### Images

All are from Commons file pages and each was looked at; all have `licenceStatus` "open".

| Image | Placed on | Identification |
|---|---|---|
| Map 4 of 1896, British Library copy ("... the final submergence of Poseidonis in 9564 B.C.") | marker `story-of-atlantis-published` (cover) | secure |
| Front cover of the British Library copy (the file page calls it page 1) | marker | secure |
| Map 3 of 1896, British Library copy ("Ruta & Daitya") | Scott-Elliot 7 | secure |
| A Russian redrawing of map 1 ("Атлантида во времена расцвета"), said to be of 1910 | Scott-Elliot 7 | `UNVERIFIED`: edition and redrawer |
| A Spanish map of Lemuria, No. 2, which its file page assigns to this book | Scott-Elliot 8 | `UNVERIFIED`: probably *The Lost Lemuria* (1904) |
| A. P. Sinnett, from blavatskyarchives.com | Scott-Elliot Preface | `UNVERIFIED`: date, photographer, source |
| The frontispiece, "The Profile of Atlantis" | marker `donnelly-atlantis-published` (cover) | secure |
| Donnelly, Mathew Brady studio, 1860–65 (NARA 526051) | marker | secure |
| Duke copy, DjVu pages 11 (title page), 12 (verso, "in the year 1882"), 19 (p. 1), 23 (p. 5), 47 (p. 29) | Donnelly book, 1.1, 1.2, 1.3 | secure |
| "The Empire of Atlantis", the full-page map (pp. 295–296 in the Duke copy) | Donnelly 4.2 | secure |
| Donnelly, F. Gutekunst, about 1898, Minnesota Historical Society | Donnelly book | `UNVERIFIED`: date, photographer, record |

No portrait of Scott-Elliot was found on Commons.

### Plain words

There are 24 entries for Scott-Elliot, each beginning "The book says" or "Sinnett says". There are 5 for Donnelly, each beginning "Donnelly says" and following his quotation of Plato, not the Greek. "Other possible readings" cover:
- the kept misprints ("goverment", "Intitiate", "savages races");
- the name Poseidonis, the "Book of Dzyan", the Troano manuscript and the maps' claimed source;
- Jowett's page 517, the bracketed table marks, and Donnelly's identification of "the great deluge of all".

### Not done

- Neither text has been proofread page by page. Punctuation and capitals were not voted, only checked where seen.
- No copy of Donnelly's very first printing was reached; the Duke copy is an "Eleventh Edition" from the 1882 plates.
- Scott-Elliot's maps 1 and 2 were not found in any 1896 copy; their titles are from the later printing.
- The identification of Scott-Elliot's Plato as Taylor's translation rests on the wording, not on a statement in the book.
- Donnelly's other chapters that quote Plato in passing are listed, not imported.

## 25. Stage 19: Kingsford and Maitland's Virgin of the World (1885)

The last full-text member of `modern.other-authors` (brief item 33), listed there as "Kingsford & Maitland 1885", is imported as its own work. It is *The Virgin of the World of Hermes Mercurius Trismegistus*, translated by Anna Kingsford and Edward Maitland (London: George Redway, 1885). That entry's proposed member now says "imported as its own work, modern.kingsford-maitland", and its full-text editions are now empty.

- **`modern.kingsford-maitland`** (prefix `modern.vow`). Tradition class `modern`, corpus group `modern_esoteric`. Marker `virgin-of-the-world-published`.

The inventory gained two sources:
- `kingsford-maitland-1885`, the book, which describes the witnesses;
- `menard-hermes-1866`, Louis Ménard's *Hermès Trismégiste*, the French version the translators "used, but not entirely followed" (p. ii). It is cited only and was not read.

Files:
- `corpus/virgin-of-the-world.ts`;
- the generated `corpus/virgin-of-the-world-text.ts`, made by `scripts/texts/virgin-of-the-world.py`. The script records the method, the one reading the vote took, the wrong majorities rejected, and every correction by hand with the page it was read on;
- `corpus/virgin-of-the-world-related-images.ts`;
- plain words in `corpus/plain/virgin-of-the-world.ts`;
- the marker's pictures in `marker-pictures.ts`.

Copyright: public domain (1885; Kingsford died 1888, Maitland 1897, Ménard 1901). The text layers are `public_domain`.

### What the book is

A Victorian translation, not an ancient witness. It renders Greek and Latin texts through Ménard's French, so the English is at one remove from the originals.

The translators wrote *The Perfect Way* (1882) and founded the Hermetic Society in London in 1884. The book was published "under the auspices of the Hermetic Society" (p. 154), for Robert H. Fryar's Bath Occult Reprint Series. Its essays and Kingsford's Introduction read the Hermetic writings as an esoteric wisdom one with "the creed of catholic Christendom". The archive records this aim as context in the work entry, the book record and the Introduction's notes and plain words. It is not given as the meaning of the ancient texts.

### Source and checking

No proofread transcription of an 1885 copy, and no Gutenberg or Wikisource text, could be reached (sacred-texts.com refused the requests).

| Siglum | Witness |
|---|---|
| E | archive.org's OCR of the Global Grey e-book (2018), a typeset reissue of an e-text of the 1885 book. The base: the only e-text with the Introduction. |
| T | archive.org's OCR of another PDF of the same e-text. It has no Introduction and no Tatios V. |
| V | archive.org's OCR of Google's scan of an 1885 copy (`1885-kingsford-maitland-virgin-of-the-world`), read from its djvu.xml, with its page images. |

E and T share the e-text's page markers and errors, so they are one transcription. **V is the only independent witness, and the only one of the 1885 printing.** In effect, then, two independent copies were compared word by word. The Introduction and Tatios V were compared on E and V alone.

- **Taken by the vote:** one reading, '"I' for E's '"T]' (p. 9).
- **Rejected majorities:** "Hyle" (the book prints "Hylé", p. 61, seen) and "Stobzus" (an OCR misreading of "Stobæus").
- **Corrected by hand, on V's page images:**
  - the one-letter words lost before drop capitals ("O MY", "A GREAT");
  - errors E and T share ("hast", p. 18; "But", p. 135; "cucurbite"; "Kytheræa");
  - the closing brackets of the translators' and the book's source notes;
  - OCR of ornaments at the ends of parts;
  - the Greek words βασιλεύς and βαίνειν (p. 112);
  - spacing and line-break hyphens, each checked in V's word boxes.
- **Kept 1885 misprint:** "corporealites" (p. 107).

The text has not been proofread page by page. Punctuation and capitals were not voted, only checked where seen. Italic and small capitals are not marked. The footnotes are left out; the translators' bracketed notes printed in the text are kept.

### Units

`modern.vow.1885` (`book`) holds no text. It carries Ménard as a cited layer, the 1885 date, and notes on what is not imported.

Under it come:
- the Introduction's first section;
- six `treatise` records, which hold no text and carry the composition dates;
- 44 `part` units with the English (layer `eng-1885`; `primary_text` for the Introduction, `translation` for the rest).

That makes 45 units and 52 passages.

| Units | The book's title | Pages | Ancient text |
|---|---|---|---|
| `.intro` | An Introduction to the Virgin of the World, first section | xix–xxi | Kingsford's own |
| `.kore.1`–`.3` | The Virgin of the World, Parts I–III | 1–39 | Korē Kosmou (Stobaeus) |
| `.ascl.1`–`.15` | A Treatise on Initiations; or, Asclepios, Parts I–XV | 45–94 | Latin Asclepius |
| `.def.1`–`.4` | The Definitions of Asclepios, Parts I–IV | 101–113 | Corpus Hermeticum XVI, XVII, XVIII (Parts III–IV) |
| `.tat.1`–`.8` | Fragments of the Book of Hermes to his Son Tatios | 119–140 | Stobaean excerpts |
| `.ammon.1`–`.6` | Fragments of the Writings of Hermes to Ammon | 141–148 | Stobaean excerpts |
| `.frag.1`–`.8` | Various Hermetic Fragments | 148–154 | Stobaeus (I, II, VII), Cyril (III–V), the Suda (VI), Lactantius (VIII) |

**Why only the first section of the Introduction.** The Introduction is twelve close pages (xix–xxx) without sections, so it is not short. Only its first section is imported, as the archive divides it: up to "the curse of Eva" (p. xxi), before the turn to the soul's "apostacy".

**Listed, not imported:**
- the rest of the Introduction;
- Maitland's essays "The Hermetic Books" (pp. i–viii) and "The Hermetic System and the Significance of its Present Revival" (pp. ix–xviii);
- the footnotes.

### Dates

- **Publication:** 1885, on `modern.vow.1885`, from the title page ("MDCCCLXXXV") and the prefatory note ("Bath; May, 1885"), both seen.
- **Composition:** 100–300 CE (`century`, approximate, `copenhaver-hermetica`), on the treatise records for the Korē Kosmou, the Asclepius, the Definitions, Tatios and Ammon. It is carried across from the Mead records and is not a new dating. The various fragments are not dated, since they come from mixed sources.
- **Marker:** carries the same composition range and 1885.

### Links

All 73 are `proposed`. None says one translation copied the other.

**Parallels with Mead's English (68).** Each is a `direct_textual_parallel`, "two translations of one ancient text", with `wordingComparable` "partly" and the common source named.
- **Korē Kosmou:** kore.1–3 → `herm.sh.ex25`, `ex26`, `ex27`.
- **Definitions:** def.1 → `herm.ch.16`, def.2 → `herm.ch.17`, def.3 and def.4 → `herm.ch.18`.
- **Tatios:** tat.1–8 → ex1, ex8, ex7, ex11, ex6, ex5, ex3, ex2.
- **Ammon:**
  - ammon.1–4 → ex13, ex12, ex14, ex16;
  - ammon.5 → ex17 and ex18;
  - ammon.6 → ex19.
- **Various fragments:** frag.1 → ex20, frag.2 → ex4, frag.7 → ex24.
- **Asclepius:** the 15 parts → all 41 chapters of `herm.ascl.*` (43 links). The 1885 division follows Ménard and does not fall at Mead's chapters, so each part is linked to the chapters whose matter it renders.

**Where the two translations differ in meaning,** `meaningComparable` is "partly", and both the link and the plain words say how:

| Part | 1885 English | Mead |
|---|---|---|
| def.2 | the King answers "Tat" | the speaker is Asclepius |
| tat.4 | "a great and divine power" | "a very mighty Daimon" |
| tat.6 | "the vehicle of becoming" | "the vase of genesis" |
| ammon.2 | Providence is "the Free Will of the Supreme God" | "the Self-perfect Reason" |
| frag.2 | the sun "governs fluid things" | "regulates the breaths" |
| frag.7 | the planets' gifts shared out one way | shared out differently |

**Other links (5).** All but the first say "None shown." for transmission.
- ascl.15 → `herm.ascl.prayer-coptic`, `direct_textual_parallel`, with the Papyrus Mimaut as the common source.
- ascl.9 → `modern.hpb.isis.2.360`, `close_conceptual_parallel`: Blavatsky's paraphrase of the lament.
- ascl.9 → `modern.kyb.1908.2` and kore.1 → `modern.kyb.1908.intro`, `broad_thematic_resemblance`.
- intro → `arab.comm.hort.7`, `symbolic_similarity`: the image of distillation.

**Not linked:** the archive's `herm.definitions`, the Armenian Definitions, which is a different work.

### Images

All are from Commons file pages, and each was looked at; all have `licenceStatus` "open". The 1885 title page and frontispiece are not on Commons and are described only.

| Image | Placed on | Identification |
|---|---|---|
| Anna Kingsford, portrait | marker `virgin-of-the-world-published` | `UNVERIFIED`: date, photographer, source |
| Edward Maitland, portrait | marker | `UNVERIFIED`: date, photographer, source |
| Patrizi, *Nova de universis philosophia*, title page of the second edition ("1593"), listing the Hermetic books and "Asclepii discipuli tres libelli" | `modern.vow.1885.def` | secure |
| Patrizi, *Nova de universis philosophia*, page listing the Hermetic books, from Google Books | `modern.vow.1885` | `UNVERIFIED`: edition (the file page says 1591) and copy |

### Plain words

There are 45 entries, one per unit:
- The ancient texts' teachings are reported as theirs, and Kingsford's reading as hers.
- Each entry for a part with a meaning difference says how the two translations differ.
- "Other possible readings" cover:
  - "corporealites" and the King's "Tat" (def.2);
  - "God manifest" (ascl.2), and matter's standing beside God (ascl.7);
  - the note's etymology of βασιλεύς (def.4);
  - "fluid things" against "breaths" (frag.2);
  - Cyril's wording (frag.5);
  - Kingsford's "Kosmic Virgin" and her Eve and Mary reading (intro).

### Not done

- The text has not been proofread page by page, and only one independent witness to the e-text, V, was reached.
- Ménard's French was not read. Where the 1885 English departs from the Greek or Latin, it is not established whether the cause is Ménard or the translators.
- These have no partner English in the archive:
  - frag.3–6 (Cyril and the Suda) and frag.8 (Lactantius) are not linked;
  - Mead's excerpt XV is not in the 1885 book.
- The rest of Kingsford's Introduction, Maitland's essays and the footnotes are listed, not imported.
- The 1885 title page and frontispiece could not be shown.

## 26. Stage 20: the "Mithras Liturgy" (PGM IV 475–829) in Mead's A Mithriac Ritual (1907)

The first proposed member of `greek.related` (brief item 18), "Mithras Liturgy (PGM IV 475–829)", is imported as its own work. The English is G. R. S. Mead's, in *A Mithriac Ritual*, vol. VI of his series *Echoes from the Gnosis* (London and Benares: Theosophical Publishing Society, 1907). The `greek.related` entry's proposed member now ends "imported as its own work, greek.mithras-liturgy".

- **`greek.mithras-liturgy`** (prefix `greek.mithras`). Tradition class `ancient_primary` (the text survives in a fourth-century papyrus), corpus group `greek_hermetic`. Marker `mithras-liturgy-papyrus`.

The inventory gained three sources:
- `mead-mithriac-ritual-1907`, the book, which describes the witnesses;
- `dieterich-mithrasliturgie-1903`, Albrecht Dieterich's *Eine Mithrasliturgie* (Leipzig, 1903), the Greek text Mead translated. It is public domain but was not read, so it is cited only;
- `bnf-suppl-grec-574`, the papyrus itself, in the BnF's digitisation as it appears on Wikimedia Commons.

Files:
- `corpus/mithras-liturgy.ts`;
- the generated `corpus/mithras-liturgy-text.ts`, made by `scripts/texts/mead-mithriac-ritual.py`. The script records the method, the readings the vote took and every correction by hand with the page it was read on;
- `corpus/mithras-liturgy-related-images.ts`;
- plain words in `corpus/plain/mithras-liturgy.ts`;
- the marker's picture in `marker-pictures.ts`.

Copyright: public domain (1907; Mead died 1933). The text layers are `public_domain`.

### What the text is

A Greek ritual of ascent and immortalisation, in the first person, preserved only in the Great Paris Magical Papyrus (Bibliothèque nationale de France, Supplément grec 574), a fourth-century book of magical texts. Dieterich named it a "Mithrasliturgie" because its prayer names "Sun Mithras, the Great God". Mead agrees that it is Mithraic, but reports that Cumont rejected it "as a genuine Mithriac document" (p. 10). Whether it belongs to the Roman cult of Mithras is therefore recorded as disputed.

Mead translates Dieterich's Greek and leaves out the magical names and vowel-strings that he takes for later insertions by "a school of Egyptian magicians". The names he keeps are marked by obeli (†), and he prints one block of vowels (VII.2). His Preamble and Comments read the rite in Theosophical terms, as "a yoga-rite" of "prāṇa's" and "Ātmic Energy". The archive records that reading as his: in the Preamble's notes and plain words, and in the work entry.

### Source and checking

No proofread transcription of the 1907 book, and no Gutenberg or Wikisource text, could be reached. Sacred-texts.com and Gallica refused the requests.

| Siglum | Witness |
|---|---|
| H | archive.org's OCR of the University of Toronto copy (`amythicritu06meaduoft`). The base; its page images were read. |
| G | archive.org's OCR of Google's scan of a copy from an unnamed library (`amithriacritual00meadgoog`). |
| S | archive.org's OCR of the Servants of Knowledge scan (`ult.mithriacritualvo0000grsm`), of a copy stamped as a Bangalore library's. |

A fourth item (`MeadGRSEchoesFromTheGnosisVolVIAMithriacRitual1907`) carries the same Robarts call number as H, so it is another OCR of the Toronto copy. It was not used.

- **The vote.** H, G and S were aligned word by word. Where G and S agreed against H, their reading was taken: 42 times.
- **Proofreading.** Because the text is short, every page of the Preamble and the Ritual (pp. 9–33) was then read line by line against H's page images. The 60 corrections made by hand are listed in the script with their pages. They include:
  - the obeli, which the OCRs read as "f", "4" or "/";
  - the Greek words ἄσημα ὀνόματα (p. 10) and συριγμὸς, ποππυσμός (p. 15);
  - Æ, the Sanskrit diacritics of the Preamble, and "S̄! S̄!" (p. 23);
  - the macrons of the vowel block (p. 26), read at high resolution;
  - "leave me not" (p. 33), which H's OCR misread as "learn".
- Ten line-end hyphens are kept as compounds ("vowel-combinations", "thunder-clap" and others); the rest are joined.

Italic is not marked (Mead prints the prayers in italic and the instructions in roman). His square brackets, his supplements, are kept. So are his paragraph numbers.

### Units

`greek.mithras.1907` (`book`) holds no text. It carries Dieterich as a cited layer (`grc-dieterich-1903`, no content), the 1907 date, and notes on what is not imported.

Under it come:
- `greek.mithras.1907.preamble`, Mead's Preamble (pp. 9–17), layer `eng-1907`, kind `interpretation`: Mead's own words, not a translation;
- `greek.mithras.1907.ritual` (`part`), which holds no text. It carries the papyrus as its witness (`PGM IV 475–829`) and the papyrus and composition dates;
- `greek.mithras.1907.1`–`.14`, Mead's fourteen sections (pp. 18–33), layer `eng-1907`, kind `translation`, each with the papyrus as witness.

That makes 15 `section` units and 17 passages.

| Section | Mead's heading | Pages |
|---|---|---|
| I | [The Father's Prayer.] | 18 |
| II | The Invocatory Utterance (Logos). | 18–21 |
| III | [The First Instruction.] | 21–22 |
| IV | [The First Utterance.] | 22–23 |
| V | [The Second Instruction.] | 23 |
| VI | The [Second] Utterance (Logos). | 24 |
| VII | The Third Utterance (Logos). | 25–27 |
| VIII–XIV | [The Fourth Utterance.] to [The Tenth Utterance.] | 27–33 |

**Why the Preamble is imported.** It is nine small pages, and it is where Mead names the papyrus, gives its date and Dieterich's dating, and states his method.

**Listed, not imported:**
- Mead's Comments (pp. 34–77), a running commentary without headings. It compares the rite with the "Trismegistic sermons", the "Virgin of the World" (p. 44), the Naassene document, the Oracles, Plato, Proclus and Empedocles;
- the front matter.

The papyrus line numbers of Mead's sections were not established, and none are given. Whether his fourteen sections cover every line to PGM IV 829 was not checked against an edition of the Greek. For both reasons the inventory is not marked verified.

### Manuscript

`bnf-suppl-gr-574`: Paris, BnF, Supplément grec 574, papyrus, 300–400 CE (`century`, approximate). The date is the library's own, from its label ("IVe siècle"), seen on its digitisation; the label does not state its grounds. Mead narrows it to "the earliest years of the fourth century A.D." (p. 10). The label also gives "36 feuillets. 305 sur 130 millimètres ... Acquis en 1857". A printed note on the labels refers to the sale of d'Anastasi's collection in Paris, 23–27 June 1857, lot 1073. The BnF catalogue record was not reached.

### Dates

- **Publication:** 1907, on `greek.mithras.1907`, from the title page, seen in two scans.
- **Manuscript:** 300–400 CE, on `greek.mithras.1907.ritual`, from the BnF's label. The papyrus is the only witness, so this is also the earliest evidence for the text.
- **Composition:** 100–150 CE (`century`, approximate), on the same record. This is Dieterich's dating as Mead reports it (p. 13: "first made in Egypt about 100-150 A.D., and was used in the Mysteries until 200 A.D."). It is shown as one scholar's view. The date of composition is debated, and no other dating was read for this import.
- **Marker:** carries all three.

### Links

All 7 are `proposed`, and all say "None shown." for transmission. None claims that one text knew another.

| From | To | Class | What it rests on |
|---|---|---|---|
| 2 | `herm.ch.13.3` | `close_conceptual_parallel` | "re-born in Mind" / "I am born in Mind", into a body that cannot die |
| 14 | `herm.ch.13.10` | `close_conceptual_parallel` | rebirth that lifts a mortal beyond birth / "by this Birth we are made into Gods" |
| 2 | `herm.sh.ex25.4` | `symbolic_similarity` | "the Deep of the [New] Dawn" / "that New Dawn" (Korē Kosmou) |
| 3 | `herm.ch.1.25` | `broad_thematic_resemblance` | ascent through the heavens; Poimandres' ascent is after death, through seven zones |
| 7 | `gnostic.ps.136` | `symbolic_similarity` | vowel-strings in a prayer to the highest power, then a vision of the sky |
| 7 | `modern.hall.2.s1.p3` | `broad_thematic_resemblance` | Hall's "the priests chanted the seven vowels" (Serapis) |
| 11 | `modern.hall.36.s7.p2` | `broad_thematic_resemblance` | seven heavenly powers; Hall's Mithraic "seven steps" |

**Mead translated both sides** of the three Hermetic links, so the shared English may be his. The links say so. In the Korē Kosmou link, the shared word "New" is Mead's own bracketed supplement in the Ritual; the link says that too. Mead himself sets the Ritual beside the Hermetic sermons (p. 43) and quotes the Korē Kosmou (p. 44). These are recorded as his view (`scholarlyView`, `sourceKey` Mead 1907), not as evidence of transmission.

### Images

All are from Commons file pages, and each was looked at; all have `licenceStatus` "open". None repeats a picture shown elsewhere in the archive. The Sidon and London tauroctonies are already with Hall's Mithras chapter.

| Image | Placed on | Identification |
|---|---|---|
| G. R. S. Mead, portrait | marker `mithras-liturgy-papyrus` | `UNVERIFIED`: photographer, date and source |
| BnF labels of Supplément grec 574 ("IVe siècle", "Acquis en 1857"), Commons image 1 of 73 | `greek.mithras.1907.ritual` | secure |
| Leaf "7" of the papyrus, Commons image 14 of 73, holding (as read here) the opening of the Ritual: "ἵλαθί μοι πρόνοια ... ψυχή, τάδε γράφοντι" and Ἥλιος Μίθρας | `greek.mithras.1907.1` | `UNVERIFIED`: the identification rests on reading the image, not on a catalogue or the edition's line numbers |
| Fiano Romano relief (Louvre Ma 3441), Sol and Mithras banqueting, PD | `greek.mithras.1907.9` | secure; captioned "Related evidence, not the Ritual" |
| Vatican tauroctony with heads of Helios and Selene (inv. 870), CC BY-SA 4.0 | `greek.mithras.1907.preamble` | secure; captioned "Related evidence, not the Ritual" |

The papyrus's vowel block (p. 26 of Mead) was not found among the leaves examined. The Commons API rate-limited the search, and only leaves 1–9, 11–14, 16 and 17 were downloaded and examined.

### Plain words

There are 15 entries, one per unit:
- The rite's instructions are reported as instructions ("The instructions say ..."), never as things that happen.
- Mead's Theosophical reading in the Preamble is reported as his, "not history".
- Where Mead leaves out a name, the paraphrase says so.
- "Other possible readings" cover:
  - Mead's bracketed "[a Son]" and "[as I am, by mine own self]" (I);
  - "[New] Dawn" (II);
  - "[O Lord]" and "[remain]" (XIII).

### Not done

- Dieterich's Greek, Preisendanz's edition and later scholarship were not read. The composition date is Dieterich's view as Mead reports it.
- The papyrus line numbers of Mead's sections were not established. It was not checked whether Mead leaves out instructions from the end of the papyrus text.
- The identification of the papyrus leaf with the Ritual's opening is the archive's own reading, so it is marked `UNVERIFIED`.
- Mead's Comments (pp. 34–77) are listed, not imported.
- Gallica and the BnF catalogue record could not be reached; the digitisation was seen through Commons.

## 27. Stage 21: Irenaeus, Against Heresies I.29–31, in the Ante-Nicene Fathers (1885)

The Apocryphon of John entry (brief item 19) listed "Irenaeus, Against Heresies I.29 (ANF 1885)" as its only full-text edition. Book I, chapters 29, 30 and 31 are now imported, whole, in the English of Alexander Roberts and W. H. Rambaut as reprinted in *The Ante-Nicene Fathers*, vol. I (Buffalo: The Christian Literature Publishing Company, 1885), pp. 353–358. The Apocryphon entry's full-text edition now reads "... a hostile report of a closely related system, not the Apocryphon; imported as its own work, gnostic.irenaeus-against-heresies", and its copyright summary says the same.

- **`gnostic.irenaeus-against-heresies`** (prefix `gnostic.iren`). Tradition class `ancient_late_transmission` (Irenaeus wrote in Greek; these chapters survive in the old Latin version), corpus group `gnostic`. No marker of its own: it hangs off the existing `apocryphon-of-john` marker, as the Critias hangs off the Timaeus's.

**Why a work of its own, and not the Apocryphon's own text.** Irenaeus's chapters are an opponent's summary of what others taught, in his words and with his judgements ("Such are the falsehoods which these people invent"). They are not the Apocryphon of John, and chapter 30 is not even about the same system. The archive's practice for a text that is related to an inventory item but is not that item is to import it as its own work and have the item point to it (the Mithras Liturgy for `greek.related`, Kingsford and Maitland for `modern.other-authors`). Putting Irenaeus's English under `gnostic.apocryphon-of-john` would present it as the Apocryphon's own wording. Hanging the work off the Apocryphon's marker, not a new one, keeps the timeline honest the other way: Irenaeus's report is the earliest evidence for the system the Apocryphon sets out, and it is dated there as such.

The inventory gained five sources:
- `anf-1885-irenaeus`, the 1885 volume, which describes the witnesses;
- `ancl-1868-irenaeus`, the Edinburgh first printing (Ante-Nicene Christian Library, vol. V, 1868), compared only;
- `schmidt-irenaeus-quelle-1907`, Carl Schmidt, "Irenäus und seine Quelle in adv. haer. I, 29", in *Philotesia: Paul Kleinert zum LXX. Geburtstag* (Berlin, 1907), pp. 315–336, read on archive.org;
- `mead-fragments-1906`, G. R. S. Mead, *Fragments of a Faith Forgotten* (London, 1906), "The Akhmîm Codex", pp. 579–586, Mead's English summary of Schmidt's report of 1896;
- `kirsch-eleutherius-1909`, J. P. Kirsch, "Pope St. Eleutherius", *Catholic Encyclopedia* vol. 5 (1909), for the dates of Eleutherius's episcopate.

Files:
- `corpus/irenaeus.ts`;
- the generated `corpus/irenaeus-text.ts`, made by `scripts/texts/irenaeus-against-heresies.py`. The script records the method, the reading the vote took, the one it rejected, every correction by hand with its page, and the footnotes;
- `corpus/irenaeus-related-images.ts`;
- plain words in `corpus/plain/irenaeus.ts`.

`marker-pictures.ts` is unchanged: the `apocryphon-of-john` marker keeps its two pictures (NHC II p. 32 and BG 8502 p. 19), and no new marker or marker picture was made.

Copyright: public domain (the translation was printed in 1868 and reprinted in 1885). Schmidt (d. 1938) and Mead (d. 1933) are public domain too, and are cited and briefly quoted. The text layers are `public_domain`.

### What the text is

The last three chapters of Book I of *Against Heresies*, which Irenaeus, bishop of Lyons, wrote in Greek about 180 CE. Having refuted the Valentinians at length, he summarises further sects "from whom", he says (I.31.3), the Valentinians descend:

- **Chapter 29** (4 sections): a system of "a multitude of Gnostics" built on Barbelos, the unnameable Father, Autogenes and the four luminaries, Adamas, and Sophia, whose unconsented work, the Protarchon, makes the lower world and says "I am a jealous God".
- **Chapter 30** (15 sections): a different, related system: the first and second Man, the Holy Spirit as first woman, Christ, Sophia-Prunicus and her son Ialdabaoth, who begets six more rulers (Iao, Sabaoth, Adoneus, Eloeus, Oreus, Astanphaeus); the making of Adam, Eve and the serpent; the flood, Abraham and the prophets shared out among the seven; and Christ's descent through the seven heavens into Jesus.
- **Chapter 31** (4 sections): the "Cainites", with their "Gospel of Judas", and Irenaeus's close to Book I.

The chapter headings ("Barbeliotes or Borborians", "Ophites and Sethians", "Cainites") are the edition's. The text itself never names the teachers of chapters 29 and 30. The name "Ophites" comes from the heading and the translators' footnote at I.30.5. The archive says so in the chapter notes and in the Hall link.

**The parallel with the Apocryphon of John** is the scholarly-standard one, and it is stated as Schmidt's:
- Schmidt announced in 1896 that Irenaeus had excerpted a work in the Coptic Berlin codex (P. Berol. 8502);
- in 1907 he set the Latin of I.29 beside his German of the Coptic, and concluded that the writing Irenaeus excerpts "mit unserm Apokryphon Johannis identisch ist" (p. 335);
- he also lists the differences: Irenaeus "paraphrasiert mehr, als daß er exzerpiert" (p. 331); the Protarchon's offspring (Kakia, Zelos, Phthonos, Erinnys, Epithymia) have no parallel in the manuscript, while Irenaeus leaves out the seven planetary powers (p. 333); Irenaeus breaks off chapter 29, Schmidt thinks, to avoid repeating chapter 30, which excerpts a different writing of a related sect, the Sethians to whom Theodoret ascribes it (p. 334).

Mead's 1906 summary of Schmidt's first report compares the two point by point but calls the Coptic work "The Gospel of Mary", which Schmidt corrected in 1907; it is cited for the history of the identification only. Because the Apocryphon has no passages in the archive, the parallel is in the notes of the work, of chapter 29 and of I.29.1 and I.29.4, and in the claim on the Apocryphon's marker. It is not a passage link.

### Source and checking

| Siglum | Witness |
|---|---|
| C | The CCEL transcription of ANF vol. I (`anf01.ix.ii.xxx`–`xxxii`). The base: it keeps the edition's page breaks, footnotes apart from the text, and its Æ and œ, and it carries Coxe's bracketed notes, so it is of the 1885 American printing. |
| T | archive.org's OCR of the University of Toronto copy (`antenicenefather01buff`, title page 1885). Its page images (leaves n370–n375 = pp. 353–358) were read. |
| R | archive.org's OCR of the UCLA copy (`antenicenefathers01robe`, title page 1887, "Copyright, 1885"), the same plates. |
| S | archive.org's OCR of a third copy (`antenicenefather0001unse_s4g9`, title page 1885), with a later OCR engine. |
| E | archive.org's OCR of the Edinburgh first printing (`AnteNiceneChristianLibraryV05`, 1868). Compared, not voted. |
| N | New Advent's text (newadvent.org/fathers/0103129–0103131), "revised and edited" by Kevin Knight. Compared, not used. |

- **Normalised before the vote:** the OCRs' systematic misreadings of Æ ("^", "/E", "JE"), œ ("c") and the capital I of Ialdabaoth and Iao ("l"), each seen on the page images and counted by the script.
- **The vote.** C, T, R and S were aligned word by word. Where two or three scans agreed against C, their reading was taken: once, "begirt" for C's misprint "begin" (I.30.3, p. 355), confirmed on the page image. One majority was rejected: "conceptions" (I.29.1, p. 353), where the scans read the footnote mark 5 as an "s".
- **Stops.** Where all three scans agree on a stop that C lacks, the script reports the place but does not apply it. Each place was looked up on the page image; three were real and are corrected by hand: "uttermost, and" (I.29.4, p. 354), "Zechariah, to Sabaoth" and "Sophia herself" without a comma (I.30.11, p. 357). All three agree with the 1868 printing.
- **Proofreading.** Every column of pp. 353–358 was read against T's page images. There is no italic in these chapters' text. The dashes are closed up. The translators' square brackets, their supplements, are kept.
- **Which printing.** Compared word by word, the 1868 and 1885 printings differ in these chapters in one place: I.29.1, 1868 "in the conception", 1885 "in conception". The text follows 1885. "Ill-conditioned" (I.31.4) is in both.
- **New Advent** silently modernises the translation: "begot" for "begat" four times, "you"/"your" for "thou"/"thy", "carcass" for "carcase", "Son of Nun". It drops some quotation marks and sets scripture references into the text. It keeps C's misprint "begin" and C's three wrong stops: 39 places differ in all. It is not a witness of the printing.

**The footnotes** are the editors', not Irenaeus's. There are 23:
- 19 by the translators (citing the Latin and the editions of Grabe and Harvey);
- 2 by Coxe alone, in square brackets ("[Cant. ii. 15; St. Luke xiii. 32.]" and "[Let the reader bear in mind ...]");
- 2 by the translators with a bracketed addition by Coxe (I.30.7, "Philastr."; I.31.2, "Note the 'Americanism'").

Every unbracketed note was found in the 1868 OCR. They are listed, not imported: each section's notes give each footnote's place (the words its mark follows), page and author. The eight that warn the reader that the Latin or the translation is doubtful are quoted there:

| Section | The translators' warning |
|---|---|
| I.29.1 | "Both the text and meaning are here altogether doubtful" ("in conception [thus formed]") |
| I.30.2 | "The punctuation is here difficult and doubtful" |
| I.30.5 | the Latin *evertisse* implies Nous "was more degraded" ("imparted") |
| I.30.9 | "We here follow the emendation of Grabe" |
| I.30.10 | *ex quibus* is "exceedingly obscure"; the next sentence "seems unintelligible" |
| I.30.11 | the common text's "et incorruptibili Æone" is left out as a gloss |
| I.30.15 | "The text of this sentence is hopelessly corrupt" |
| I.31.2 | "The text is here imperfect, and the translation only conjectural" |

### Units

- **`gnostic.iren.1`** (`book`) holds no text. It carries the old Latin version as a cited layer (`lat-vetus`, no content), the dates, and notes on what is not imported.
- Under it come three **`chapter`** records, `gnostic.iren.1.29`, `.30` and `.31`. They hold no text and carry the edition's headings, summaries, and the notes on the Apocryphon parallel and the names.
- Under these come 23 **`section`** units, `gnostic.iren.1.29.1` to `gnostic.iren.1.31.4`, each with layer `eng-1885`, kind `translation`.

That makes 23 units and 27 passages. `expectedUnits` is 23: the edition's own sections of the three chapters, read on the page images. `inventoryVerified` stays false, because only three chapters of a five-book work are in scope and the section numbers are the editors'.

**Listed, not imported:**
- the rest of *Against Heresies*;
- the ANF's Introductory Note;
- the 23 footnotes.

Every summary begins "Irenaeus reports", "says", "calls" or "gives". The layer evidence calls the text "Irenaeus's hostile report of what others taught".

### Dates

- **Composition:** 174–189 CE (`decade`, approximate), on `gnostic.iren.1`. The basis is documented:
  - Irenaeus names Eleutherius as bishop of Rome "now" in III.3.3 (ANF p. 416: "Eleutherius does now, in the twelfth place from the apostles, hold the inheritance of the episcopate");
  - Kirsch (*Catholic Encyclopedia*, 1909) gives Eleutherius's episcopate as "c. 174-189";
  - the ANF's Introductory Note (p. 312) narrows the writing to "between A.D. 182 and A.D. 188".

  Book I comes before Book III, since it ends by promising a refutation "in the following book" (I.31.4), so it may be a little earlier. The record says so, and gives "c. 180" as the usual round figure.
- **Translation and publication:** 1868 (Edinburgh, the first printing) and 1885 (Buffalo, the printing used, from the title page seen in the Toronto scan).
- **On the Apocryphon's marker:** one claim is added, `earliest_evidence`, "Irenaeus's report of a closely related system, Against Heresies I.29", 174–189. Its evidence says the report is not the Apocryphon itself. The Coptic copies (fourth and fifth centuries) are already dated on that marker and are not repeated.

No manuscript of these chapters is dated in this import.

### Links

All 11 are `proposed`, all go from Irenaeus's sections, and all say "None shown." for transmission. Each link's similarities or differences say that Irenaeus's side is his report.

| From | To | Class | What it rests on |
|---|---|---|---|
| 29.1 | `gnostic.ps.8` | `symbolic_similarity` | the name Barbelo(s) |
| 29.4 | `gnostic.ps.31` | `close_conceptual_parallel` | Sophia goes below without her consort; a lower ruler comes from what she brings forth |
| 30.5 | `gnostic.ps.31` | `symbolic_similarity` | the name Ialdabaoth / Yaldabaoth for the ruler born of Sophia |
| 30.12 | `gnostic.ps.15` | `close_conceptual_parallel` | the saviour passes the rulers and takes away their power |
| 30.9 | `herm.ch.1.9` | `symbolic_similarity` | seven rulers as the planets |
| 30.4 | `herm.ch.1.26` | `symbolic_similarity` | an eighth above the seven |
| 30.12 | `herm.ch.1.25` | `broad_thematic_resemblance` | passage through seven heavens (descent / ascent) |
| 30.5 | `greek.mithras.1907.11` | `broad_thematic_resemblance` | seven powers in order in heaven |
| 30.7 | `modern.hall.17.s2.p1` | `close_conceptual_parallel` | the serpent leads to knowledge against the Demiurge |
| 30.15 | `modern.hall.19.s1.p3` | `symbolic_similarity` | "the Ophites (serpent worshipers) revered the Edenic snake" |
| 30.4 | `modern.hpb.cosmo.4` | `broad_thematic_resemblance` | "the seven fighters, the one, the eighth left out" |

**Not linked:** the Apocryphon of John, which has no passages in the archive. The parallel is stated in the notes, with Schmidt cited. Hall cites Irenaeus elsewhere but not in the two passages linked; the links say Hall gives no source there.

### Images

All are from Commons file pages, and each was looked at; all have `licenceStatus` "open". None repeats a picture shown elsewhere in the archive, and none repeats the Apocryphon marker's two pictures. No manuscript page of chapters 29–31 was found.

| Image | Placed on | Identification |
|---|---|---|
| Title page of Erasmus's first edition (Basel: Froben, 1526), Biblioteca Nazionale Centrale di Roma 14.18.P.9, PD | `gnostic.iren.1` | secure: the title and date read on the page, the library's stamp and shelfmark on it |
| A Latin manuscript page with the opening of Book IV ("Incipit liber quartus"), said to be British Library, twelfth century, PD-Art | `gnostic.iren.1` | `UNVERIFIED`: no shelfmark on the file page; its catalogue link could not be reached; the text was identified by reading the image |
| P. Oxy. 405 (Cambridge University Library Add. 4413), fragments of the Greek of Book III, chapter 9, PD-Art | `gnostic.iren.1` | secure: the frame's labels read "Ox. 405" and "Add 4413"; the identification as Irenaeus is Armitage Robinson's, as Grenfell and Hunt report (*Oxyrhynchus Papyri* IV, 1904, App. II). Captioned "Related evidence, not the chapters imported here". Its date was not checked. |
| P. Berol. 8502, pages 22 and 127 (Staatliche Museen zu Berlin / Sandra Steiß, CC BY-SA 4.0) | `gnostic.iren.1.29.1` | `UNVERIFIED`: Mead (1906, p. 583) cites the codex's "p. 22" for the Father passage he sets beside I.29.1. Whether his numbering is the museum's was not established, and the Coptic was not read. Page 127's closing title, "The Sophia of Jesus Christ", was read on the image. Captioned "Related evidence, not Irenaeus". |

No portrait of Irenaeus was added: any would be a later artist's imagining, and none was examined.

### Plain words

There are 23 entries, one per section:
- Each begins "Irenaeus reports", "says" or "turns", and keeps the doctrines as what "they say" and the judgements as his.
- None mentions the Apocryphon.
- "Other possible readings" give the eight warnings of the translators' notes, and for I.29.1 the 1868 reading "in the conception".

### Not done

- The Latin version, the Greek fragments and the modern editions (Rousseau and Doutreleau) were not read. The English is checked against its own printing, not against the Latin.
- No English of the Apocryphon of John is in the archive, so the I.29 parallel cannot be shown passage to passage. Schmidt's German of the Coptic is cited and quoted, not imported.
- Only chapters 29–31 of Book I are imported. The rest of *Against Heresies*, including the earlier chapters on the Valentinians and on Simon, is not.
- The 1868 page numbers (about pp. 101–115) come from the OCR's running heads and were not checked on the page images.
- The Latin manuscript picture's shelfmark and date, P. Oxy. 405's date, and whether Mead's "p. 22" is the museum's page 22 were not established.
- The Commons API rate-limited the image searches. Other candidate files (further Berlin codex pages, portraits) were not examined.

## 28. Stage 22: Origen, Against Celsus VI.22–38, in the Ante-Nicene Fathers (1885)

Brief item 23 ("Other ancient texts on planetary rulers, archons and ascent") listed "Origen, Contra Celsum VI.22–38 — the Ophite diagram and the seven archons" among its proposed members, and item 18 listed "Origen, Contra Celsum VI.22 — the Mithraic ladder of seven gates". Book VI, chapters 22–38 are now imported, whole, in the English of Frederick Crombie as reprinted in *The Ante-Nicene Fathers*, vol. IV (Buffalo: The Christian Literature Publishing Company, 1885), pp. 583–590. Both proposed-member lines now end "imported as its own work, gnostic.origen-contra-celsum" (item 18's: "imported with VI.23–38 as its own work, ...").

- **`gnostic.origen-contra-celsum`** (prefix `gnostic.origen`), brief item 23. Tradition class `ancient_late_transmission`, corpus group `gnostic`. It has a marker of its own, `origen-against-celsus-ophite-diagram`: no record existed for Origen, Celsus or the Ophites.

**Why a work of its own.** These chapters are not an Ophite text. They are a hostile report inside a refutation, and three voices run through them, which the archive keeps apart in every summary, note, plain-words entry and link:

- **Celsus**, whose *True Word* (c. 175–180, debated) attacked the Christians. The book is lost and survives only in Origen's quotations. Celsus describes the Mithraic ladder (VI.22), a diagram of circles (VI.25, 38), a "seal" (VI.27), seven animal-faced ruling demons (VI.30) and a list of phrases (VI.34).
- **Origen**, writing about 248. He says Celsus half understood "a very insignificant sect called Ophites" (VI.24), says he has seen the diagram himself, describes it (VI.25, 30, 33, 38), sets it beside Celsus's account, and rejects all of it as no part of Christian teaching.
- **The prayers** at the gates of the rulers (VI.31), which Origen gives as what the sect's members "are taught to say". They are the nearest thing to the sect's own words here, and they come only through Origen.

The inventory gained five sources:
- `anf-1885-origen`, the 1885 volume, which describes the witnesses;
- `ancl-1872-origen`, the Edinburgh first printing (Ante-Nicene Christian Library, vol. XXIII, 1872), compared only;
- `eusebius-he-npnf-1890`, McGiffert's Eusebius (*Nicene and Post-Nicene Fathers*, 2nd series, vol. 1, 1890), VI.34 and VI.36 with his notes, read on CCEL;
- `turner-celsus-1908`, William Turner, "Celsus the Platonist", *Catholic Encyclopedia* vol. 3 (1908);
- `witte-ophitendiagramm-1993`, Bernd Witte, *Das Ophitendiagramm nach Origenes Contra Celsum* (Altenberge, 1993), cited only as the source of the reconstruction drawing, as its Commons file page asks; the book was not read.

Files:
- `corpus/origen-contra-celsum.ts`;
- the generated `corpus/origen-contra-celsum-text.ts`, made by `scripts/texts/origen-contra-celsum.py`. The script records the method, the reading the vote took, the stops it reported and how each was settled, every correction by hand with its page, and the footnotes;
- `corpus/origen-contra-celsum-related-images.ts`;
- plain words in `corpus/plain/origen-contra-celsum.ts`;
- the marker's pictures in `marker-pictures.ts`.

Copyright: public domain (the translation was printed in 1872 and reprinted in 1885). McGiffert (1890) and Turner (1908) are public domain and briefly quoted. The text layers are `public_domain`.

### Source and checking

| Siglum | Witness |
|---|---|
| C | The CCEL transcription of ANF vol. IV (`anf04.vi.ix.vi.xxii`–`xxxviii`). The base. Its page anchors run one page ahead of the printed pages (checked on the page images: p. 584 begins "the book of Moses entitled Numbers"), so the script subtracts one. It carries the American edition's bracketed notes, so it is of the 1885 printing. |
| T | archive.org's OCR of the University of Toronto copy (`antenicenefather04robeuoft`, Buffalo, 1885). Its page images (leaves n594–n601 = pp. 583–590) were read. |
| Q | archive.org's OCR of a second copy of the 1885 printing (`antenicenefather0004reva_q8u8`). |
| B | archive.org's OCR of a third copy (`bwb_S0-AWY-298_4`, with a University of the Pacific stamp). |
| E | archive.org's OCR of the Edinburgh first printing (`writingsoforigen02origuoft`, 1872). Compared, not voted; pp. 367 and 373 were seen as page images. |
| N | New Advent's text (newadvent.org/fathers/04166.htm). Compared, not used. |

Two later printings found on archive.org (New York, 1890; Scribner's, 1913) were not used.

- **Normalised before the vote:** the OCRs' misreadings of the Æ in Astaphæus, Aloæus, Horæus, Eloæus, Adonæus, Phænon and Ægina, and their reading of footnote marks as words or letters.
- **The vote.** C, T, Q and B were aligned word by word. Where two or three scans agreed against C, their reading was taken: once, "takes" for C's "take" (VI.22, p. 583, "that which takes place among the planets"), confirmed on the page image.
- **Stops.** Where the scans agree on a stop that C lacks, the script reports it and does not apply it. Each was looked up on the page images. Two were real and are corrected by hand: "uttered, instead" (VI.26, p. 585) and "was also different." (VI.32, p. 588). The others the scans proposed (around 'works of darkness', 'tree,' and 'a greater and a less,') are quotation marks the book prints and C keeps.
- **Words split at a page break** in C, corrected by hand: "mat ters" (VI.32) and "efflu ent" (VI.35).
- **Proofreading.** Every column of pp. 583–590 was read against T's page images. The translator's round brackets, his supplements, are kept. Italic is dropped: C marks four italic words (*rational*, *name*, *not*, *we*); the book also sets "seven" in VI.27 in italic; the small capitals of LORD are not marked.
- **Which printing.** Compared word by word, the 1872 and 1885 printings differ in three places, each confirmed on the 1872 page images: VI.28, 1872 "or admit even that He was a wise man", 1885 "or omit even" (the 1885 reading looks like a misprint, but it is the printing imported and is kept); VI.34, 1872 "a carpenter by trade", 1885 "by craft"; VI.35, 1872 "show from the prophetic writings that the events", 1885 without "that". The 1872 printing puts the translator's supplements in square brackets, the 1885 in round. All three are in the chapter notes and in the plain words' "Other possible readings".
- **New Advent** modernises the translation and drops some of the edition's quotation marks. It is not a witness of the printing.

**The footnotes** are the editors', not Origen's. There are 79:
- 74 by the translator (Scripture references and the Greek of words, with the editors' conjectures);
- 3 in square brackets, added in the American edition of 1885 (two signed "S.", not identified);
- 2 by the translator with a bracketed addition of 1885 (one signed "S.").

They are listed, not imported: each chapter's notes give each footnote's place (the words its mark follows), page and author. The eight that say the Greek is uncertain or emended at that point are quoted there:

| Chapter | The translator's note |
|---|---|
| VI.22 | κλίμαξ ἱψίπυλος (as the book prints it); "Boherellus conjectures ἑπτάπυλος" ("ladder with lofty gates") |
| VI.22 | "For ὕλης, another reading is πύλης" ("the rest of matter") |
| VI.22 | Spencer's οὐδ᾽ for ὡς "has been adopted in the translation" ("dissatisfied even with these") |
| VI.29 | "Boherellus proposes φῇς for the textual reading φησί" ("as you say") |
| VI.31 | "For καταλυθέν Boherellus conjectures καταγλυφθέν, which has been adopted" ("sculptured") |
| VI.33 | "Guietus thinks that some word has been omitted here, as ξίφος" |
| VI.36 | "Cf., however, Mark vi. 3", with the 1885 addition that some manuscripts read "the carpenter's son" |
| VI.38 | Gelenius's emendation, "which has been followed in the translation" ("and another composed of two circles") |

Two of the editors' notes compare Origen's Ophites with Irenaeus's chapter on them (VI.24, "[Vol. i. p. 354, this series.]"; VI.28, "cf. Irenæus"). The archive records them as modern cross-references, not as evidence that either writer used the other.

### Units

- **`gnostic.origen.6`** (`book`) holds no text. It carries the Greek as a cited layer (`grc`, no content), the dates, and notes on what is not imported.
- Under it come 17 **`chapter`** units, `gnostic.origen.6.22` to `gnostic.origen.6.38`, each with layer `eng-1885`, kind `translation`. The edition prints each chapter as one paragraph, with a number and no title.

That makes 17 units and 18 passages. `expectedUnits` is 17, the edition's own chapters in the brief's range, read on the page images. `inventoryVerified` stays false: only seventeen chapters of an eight-book work are in scope, the range is the brief's and not a division Origen makes, and the chapter numbers are the editors'.

**Listed, not imported:**
- the rest of *Against Celsus*;
- the edition's introductory matter;
- the 79 footnotes.

Every summary begins "Origen says", "reports", "quotes", "describes", "sets", "gives", "offers" or "continues". Every chapter's notes begin "Voice:" or "Voices:" and say whose words are whose. The layer evidence calls the text "Origen's hostile report, in his reply to Celsus, not an Ophite text".

### Dates

On `gnostic.origen.6`, and as claims on the marker:

- **Composition of Origen's reply:** 244–249 CE (`decade`, approximate). Eusebius (*Church History* VI.34–36, McGiffert's translation) puts it in the reign of Philip the Arab, when Origen was "as they say, over sixty years old": "He also at this time composed a work of eight books in answer to that entitled True Discourse, which had been written against us by Celsus" (VI.36.2). McGiffert's notes give Philip's reign as early 244 to 249, and say the time meant "must have been as late as 245". The record gives "c. 248" as the usual round figure; it was not separately sourced.
- **Composition of Celsus's True Word,** which Origen quotes: 175–180 (`decade`, approximate, debated). Turner (1908) says Celsus's "literary activity falls between the years 175 and 180"; McGiffert reports Keim's 178 and says of Celsus "we know nothing with certainty, nor did Origen know any more". Turner also says a copy reached Origen "about the year 240", which does not square exactly with Eusebius; the record says so and leaves it.
- **Translation and publication:** 1872 (Edinburgh, the first printing, from its title page) and 1885 (Buffalo, the printing used). The marker carries 1885.

No manuscript of these chapters is dated in this import.

### Links

All 11 are `proposed`, all go from Origen's chapters, and all say "None shown." for transmission. Those to Irenaeus also say that the ANF editors' cross-references are a modern comparison and that Origen does not name Irenaeus here.

| From | To | Class | What it rests on |
|---|---|---|---|
| 32 | `gnostic.iren.1.30.5` | `close_conceptual_parallel` | the same seven names (Ialdabaoth, Iao, Sabaoth, Adonaeus/Adoneus, Eloaeus/Eloeus, Horaeus/Oreus, Astaphaeus/Astanphaeus), in two hostile reports |
| 30 | `gnostic.iren.1.30.9` | `symbolic_similarity` | the angel's name Michael given to a hostile power ("Michael the Lion-like"; the serpent "Michael and Samael") |
| 31 | `gnostic.ps.31` | `symbolic_similarity` | Ialdabaoth and a lion-formed ruler |
| 22 | `herm.ch.1.25` | `broad_thematic_resemblance` | the soul's passage through seven planetary levels |
| 22 | `herm.ch.1.26` | `symbolic_similarity` | an eighth above the seven |
| 31 | `greek.mithras.1907.7` | `broad_thematic_resemblance` | set words to make a closed heavenly way open |
| 30 | `greek.mithras.1907.11` | `broad_thematic_resemblance` | seven powers in order, each named |
| 22 | `modern.hall.1.s2.p4` | `symbolic_similarity` | "a ladder of seven rungs appears in the Mithraic initiation" |
| 22 | `modern.hall.42.p4` | `symbolic_similarity` | the rungs of a Mithraic ladder, the seven planets and a door above |
| 28 | `modern.hall.19.s1.p3` | `symbolic_similarity` | "the Ophites (serpent worshipers) revered the Edenic snake" |
| 25 | `modern.hpb.cosmo.5` | `speculative_connection` | figures enclosed by a ring (Leviathan's circle; the ring "Pass Not") |

Hall and Blavatsky name no ancient source in the passages linked, and the links say so.

### Images

All are from Commons file pages, and each was looked at (as a thumbnail; the image server rate-limited full-size downloads); all have `licenceStatus` "open". None repeats a picture shown elsewhere in the archive. No manuscript page of VI.22–38 was found, and no ancient copy of the diagram survives.

| Image | Placed on | Identification |
|---|---|---|
| A page of the Tura papyrus, "page 29 of papyrus Cairo, Egyptian Museum, JE 88747", "the earliest text witness of the treatise", late 6th or early 7th century (all the file page's; source "2d copy"), PD-Art | `gnostic.origen.6` | `UNVERIFIED`: identification, page and date are the file page's; the picture looks like a photograph of a printed reproduction; the Greek was not read, so which part of the work it holds is not known. Captioned as the work, not Book VI, chapters 22–38. |
| BnF Grec 945, f. 48r, a fifteenth-century Greek manuscript of *Against Celsus* (the file page's), PD | `gnostic.origen.6`; the marker's cover | `UNVERIFIED`: shelfmark, date and text are the file page's; "48" is on the page; the red heading seems to name Origen and a book but was not read with confidence. |
| A floor mosaic at Ostia that the file page identifies as the Mithraeum of the Seven Gates (c. 160–170, the file page's), photographed by MumblerJamie, CC BY-SA 2.0 | `gnostic.origen.6.22` | `UNVERIFIED`, captioned "Related evidence, not the ladder Celsus describes". The file page reads its gates as the planetary spheres; only part of the row is in the picture; no ancient writer connects the floor with Celsus's ladder. |
| Jacques Matter's reconstruction of the diagram, *Histoire critique du Gnosticisme*, "Planche I. D., Fig. 5" (1826 by the file page), PD | `gnostic.origen.6.25` | `modern_interpretation`, `shows` "reconstruction"; the caption says it is a reconstruction and "not a copy of an ancient diagram", and describes what is drawn: Gehenna as a black band, the seven rulers' names in a circle headed "Leviathan", "Formulaires de Prières", the seven animal-formed angels above "Behemoth". |
| Bernd Witte's reconstruction (1993), uploaded by its author, CC BY 3.0 / GFDL, citing his *Das Ophitendiagramm nach Origenes Contra Celsum* (Altenberge, 1993), p. 142 | `gnostic.origen.6.38`; the marker's second picture | `modern_interpretation`, `shows` "reconstruction"; the caption begins "A modern reconstruction" and says it is "not a copy of an ancient diagram". Matter's and Witte's arrangements differ, and the captions say both are readings of Origen's words. |

The marker `origen-against-celsus-ophite-diagram` has two pictures: the Grec 945 page (cover, `UNVERIFIED`) and Witte's reconstruction. No portrait of Origen or Celsus was added: any would be a later artist's imagining.

### Plain words

There are 17 entries, one per chapter:
- Each begins "Origen says", "reports", "quotes" or "describes".
- Celsus's words are given as what Origen quotes or reports of him; the prayers in VI.31 as what the sect's members "are taught to say"; the descriptions of the diagram as what Origen says he saw.
- "Other possible readings" give the eight quoted footnotes and the three readings of the 1872 printing.

### Not done

- The Greek was not read. The English is checked against its own printing, not against the Greek, and the manuscripts of the work (Vat. gr. 386 and others) were not looked into.
- Only VI.22–38 is imported. The rest of *Against Celsus* is not, nor any other ancient account of the Ophites.
- Who signed the American edition's notes "S." was not established.
- "c. 248" is given as the usual figure without a source of its own; only the range from Eusebius is sourced.
- The 1872 page range of these chapters was not checked.
- The Commons API and image server rate-limited the picture searches. Other candidates (further pages of Grec 945, the Mithraeum of Felicissimus, a 1481 Latin edition, the other Seven Gates photographs) were not examined.

## 29. Stage 23: the Ascension of Isaiah, chapters vi–xi (the Vision of Isaiah), in R. H. Charles's English (1900)

Brief item 23 ("Other ancient texts on planetary rulers, archons and ascent") listed "Ascension of Isaiah 6–11 — ascent through seven heavens" among its proposed members, and its full-text editions list "Charles 1900 (Ascension of Isaiah)". Chapters vi–xi are now imported, whole, verse by verse, in R. H. Charles's *The Ascension of Isaiah, translated from the Ethiopic version* (London: Adam and Charles Black, 1900), pp. 42–82. The proposed-member line now ends "imported as its own work, gnostic.ascension-of-isaiah".

- **`gnostic.ascension-of-isaiah`** (prefix `gnostic.ascisa`), brief item 23. Tradition class `ancient_late_transmission` (an ancient text known through late copies and versions), corpus group `gnostic`, the group that holds item 23. It is not a Gnostic text, and the work's summary, notes and links say so. It has a marker of its own, `ascension-of-isaiah-vision`: no record existed for Isaiah's ascension.

**What it is.** Charles calls the Ascension a composite book, "partly of Jewish, partly of Christian origin": the Martyrdom of Isaiah (Jewish), the Testament of Hezekiah (iii. 13b–iv. 18) and the Vision of Isaiah (vi.–xi. 40), both Christian, joined by an editor (xi. 41–43, which his margin marks as editorial additions). Only the Vision is imported. It survives complete only in Ethiopic (Ge'ez); chapters vi–xi also in a Latin version (L2) and in Slavonic (S); vii. 1–19 in a Latin palimpsest fragment (L1, Vat. 5750, fifth or sixth century); and ii. 4–iv. 4 in a Greek papyrus (fifth or sixth century, Grenfell and Hunt), all as Charles reports them. The Greek original is lost. Charles holds that vi–xi circulated in two Greek recensions, G1 (behind the Ethiopic and L1) and G2 (behind L2 and S). A Coptic fragment is sometimes mentioned; nothing read for this import documents one, so none is cited.

The inventory gained three sources:
- `charles-1900-ascension`, the edition imported, also the only source read for the dates, the manuscripts and the versions;
- `laurence-1819-ascension`, Richard Laurence's *Ascensio Isaiae Vatis* (Oxford, 1819), the first edition of the Ethiopic (manuscript a), with an English translation, compared only;
- `ecw-ascension-transcription`, the unsigned web transcription of Charles's English on earlychristianwritings.com, the third witness in the vote.

The division kind `verse` was added to `TEXT_DIVISION_KINDS` (a numbered verse within a chapter, in the edition's own numbering).

Files:
- `corpus/ascension-of-isaiah.ts`;
- the generated `corpus/ascension-of-isaiah-text.ts`, made by `scripts/texts/ascension-of-isaiah.py`, which records the method and every correction by hand with its page and kind;
- `corpus/ascension-of-isaiah-related-images.ts`;
- plain words in `corpus/plain/ascension-of-isaiah.ts`;
- the marker's pictures in `marker-pictures.ts`.

Copyright: public domain (published 1900; Charles died in 1931). The text layers are `public_domain`.

### Source and checking

| Siglum | Witness |
|---|---|
| C | archive.org's OCR (djvu.xml) of the Cornell University Library copy (`cu31924014590529`); printed page = leaf − 79. The base; its page images (n121–n161) were read. |
| P | archive.org's OCR of the Princeton Theological Seminary copy (`ascensionofisaia00unse`); printed page = leaf − 77. |
| E | The web transcription on earlychristianwritings.com: Charles's English without his signs, with modern double quotes and its own slips. |
| L | Laurence's English (Oxford, 1819), archive.org OCR (`ascensioisaiaeva00laur`). Compared on chapter xi, not voted. |

Wikisource was not reachable (HTTP 429). sacred-texts.com has no copy. Charles's revised translation (SPCK, 1917) was not found as a scan and was not used.

- **The text block** of each page was cut from the OCR by type size: the footnotes are set smaller, so the text ends at the first run of three clearly smaller lines.
- **The vote.** C, P and E were aligned word by word (by letters and digits). Where P and E agreed against C, within one word in length, their reading was taken: 20 times, nearly all OCR misreadings in C ("zpper" for "upper", "1o." for "10.") and a few of the OCR's renderings of Charles's signs. 89 places where P or E differ were left as C has them and settled on the page images.
- **Proofreading.** Every page, 42 to 82, was read line by line against the Cornell page images (and the Princeton copy where the Cornell image was unclear: two marks around "Him and" in xi. 14, p. 77, are specks). The differences are the generator's `FIXES`, 291 entries: 204 restore Charles's signs, which the OCR reads as quotation marks, "T", "f", "+" or "™", or drops; 41 close up the printer's spaces (inside quotation marks and sign pairs, before colons) or join broken words; 40 are misread words or marks; 6 remove footnote or margin-note lines the page split took for text. One word broken over a page ("like-" / "wise", viii. 14, pp. 56–57) is joined.
- **The check.** The result was compared word by word with E: 44 places differ, every one a slip or omission of E on the page images (for example "descent" for "descend", "forth" for "fourth", "astonished" for Charles's "astonied", and E's omission of "for these are great things" in xi. 34).
- **Laurence (1819)** is a different, freer translation from the Bodleian manuscript alone (xi. 8, Laurence: "while Mary was attentively gazing on the ground, she suddenly perceived with astonishment a small infant"; Charles: "Mary straightway looked with her eyes and saw a small babe, and she was astonied"). It is not imported.

**Charles's signs** are kept as printed, and explained in each verse's notes and in the layer evidence: his raised double half-brackets, written ⸢ ⸣ (U+2E22, U+2E23), mark words of G1 absent from G2 (a pair may open in one verse and close in a later one); `* *` his emendations; `† †` words he holds corrupt; `[ ]` words he holds interpolated, or doublets; `( )` words he supplied. The heading ("THE VISION WHICH ISAIAH THE SON OF AMOS SAW.") is kept at the head of vi. 1 and the colophon ("Here endeth the vision of Isaiah the prophet with his ascension.") at the end of xi. 43. The ellipsis Charles prints at xi. 40 is kept.

**The footnotes** are listed, not imported. Where a footnote says what the manuscripts read in place of an emendation, or how Charles would read a corrupt or bracketed passage, the plain words give it under "Other possible readings"; footnotes that only refer to his Critical Notes say so. Verse notes quote his footnote on the bracketed "five hundred and forty-five days" of ix. 16 ("The idea is a Gnostic one. It was held by the Valentinians and the Ophites (see Irenaeus, adv. Haer. i. 3. 2, 30. 14)").

### Units

- **`gnostic.ascisa.vision`** (`part`) holds no text. It carries the Ge'ez as a cited layer (`gez`, no content), the dates, and notes on what is not imported.
- Under it, six **`chapter`** records, `gnostic.ascisa.6` to `gnostic.ascisa.11`, with summaries, themes and notes and no text.
- Under them, 197 **`verse`** units, `gnostic.ascisa.6.1` to `gnostic.ascisa.11.43`, each with layer `eng-1900`, kind `translation`. ix. 12 and 13 are printed together ("12, 13."), where Charles restores their order, and are one unit, `gnostic.ascisa.9.12-13`.

That makes 197 units and 204 passages. Verses per chapter: vi 17, vii 37, viii 28, ix 41 (42 verses), x 31, xi 43. `expectedUnits` is 197, Charles's own numbering read on the page images; `inventoryVerified` stays false, since other editions may divide differently (Charles's numbering follows Dillmann's edition of 1877, which was not read).

**Listed, not imported:** chapters i–v; Charles's footnotes, margin notes, Critical Notes and Introduction; the Ethiopic, the Greek papyrus fragment, the Greek Legend, the Latin versions and the Latin translation of the Slavonic printed in the same book.

### Dates

On `gnostic.ascisa.vision`, all from Charles (1900), all approximate except the publication:

- **Composition of the Vision, in its first form:** 80–100 CE (`decade`), rendering "Thus the composition of the Vision in its primitive form G belongs to the close of the first century" (p. xlv). His grounds: use by Jerome, Hieracas and the Archontici; attestation in the Actus Petri Vercellenses; the Protevangelium's apparent knowledge of it; and Ignatius, *To the Ephesians* 19, which his note on xi. 16 finds it "hard to avoid concluding" depends on the Vision. The Introduction's sentence on Ignatius is printed "I do think it is reasonable to explain the agreement ... otherwise than that the former is dependent on the latter"; followed by "Thus", it reads as a misprint for "I do not think", and the record quotes it as printed and flags it as an apparent misprint.
- **The final editing of the whole book:** 150–230 (`century`): "it is probable that the work of editing goes back to early in the third century, or even to the second" (p. xlv).
- **The Ethiopic version:** fifth century (`century`, as `translation_publication`): "the probable date of the Ethiopic version is the fifth century".
- **Manuscript a** (Bodleian, the base of Charles's Ethiopic): fifteenth century (`manuscript`); b and c (British Museum Nos. 501 and 503) are fifteenth and eighteenth century, named in the notes.
- **Earliest evidence for chapters vi–xi:** the Latin palimpsest fragment of vii. 1–19 (Vat. 5750), fifth or sixth century (`earliest_evidence`).
- **Translation and publication:** 1900 (the Preface is signed at Oxford, September 1900).

The marker carries the two compositions and the 1900 publication.

### Links

All 8 are `proposed`, all go from the Vision's verses, and all say "None shown." for transmission. The link to Irenaeus records that the comparison is Charles's own footnote, a modern editor's comparison, not evidence that either text knew the other.

| From | To | Class | What it rests on |
|---|---|---|---|
| ix. 16 | `gnostic.iren.1.30.14` | `close_conceptual_parallel` | a long stay of the risen Christ in the world (the bracketed 545 days; the Ophites' eighteen months), compared by Charles himself |
| x. 20 | `gnostic.ps.7` | `close_conceptual_parallel` | the Saviour takes the form of the powers he passes so that they do not know him (the angels of each heaven; Gabriel among the rulers of the aeons) |
| x. 24 | `gnostic.origen.6.31` | `close_conceptual_parallel` | a password or token demanded at the gates of the heavens |
| vii. 10 | `modern.kyb.1908.8` | `symbolic_similarity` | "as above so on the earth also" and "As above, so below" |
| vii. 25 | `herm.ch.1.25` | `broad_thematic_resemblance` | a change in the one who rises at each heaven |
| ix. 9 | `herm.ch.1.26` | `symbolic_similarity` | stripped of the flesh (or of the Harmony), newly clothed and made like those above |
| ix. 1 | `greek.mithras.1907.9` | `broad_thematic_resemblance` | a mortal reaching the highest heaven |
| x. 5 | `modern.hall.16.s2.p2` | `symbolic_similarity` | the praise of the lower heavens rising to the highest |

No passage of Blavatsky in the archive was found that bears on the Vision closely enough to link.

### Images

All are from Commons file pages and each was looked at (as a thumbnail; the image server rate-limited full-size downloads). All have `licenceStatus` "open", all are `UNVERIFIED`, and none repeats a picture shown elsewhere. No picture of an Ethiopic, Latin or Slavonic manuscript of the Ascension was found on Commons; the Commons category "Ascension of Isaiah" holds only the papyrus and two scanned books.

| Image | Placed on | Identification |
|---|---|---|
| Amherst Greek Papyrus 1, verso (the file page's name; source the Morgan Library), PD-Art | `gnostic.ascisa.vision`; the marker's cover | `UNVERIFIED`, "Related evidence, not chapters vi–xi": Charles reports the Greek papyrus holds ii. 4–iv. 4 and dates it (after Grenfell and Hunt) to the fifth or sixth century; the file page says 70–175 CE. Neither was checked; the Greek was not read. |
| A historiated initial of Isaiah being sawn, beside the rubric opening the Book of Isaiah, which the file page identifies as the Alcobaça Bible, BNP ALC. 455, f. 229v, c. 1220s, PD-Art | `gnostic.ascisa.11.41`; the marker's second picture | `UNVERIFIED`, `later_artwork`: the legend of xi. 41, not the Ascension's text; shelfmark and date are the file page's. |
| A miniature of a man sawn in two, hung by the ankles, which the file page calls Isaiah in a German Historienbibel of about 1470, PD-Art | `gnostic.ascisa.11.41` | `UNVERIFIED`, `later_artwork`: the file page's source is a newspaper website; which manuscript it is, is not given. |
| An 1881 engraving of the Lower Pool of Siloam, whose printed caption says an old mulberry tree "is said to mark the spot where the Prophet Isaiah was sawn asunder" (NYPL scan), PD-US-expired | `gnostic.ascisa.11.41` | `UNVERIFIED`, `later_artwork`: a later local tradition, not evidence; the book and year are the file page's. |

### Plain words

There are 197 entries, one per verse:
- Each begins "The narrator says" (or "goes on") for vi. 1–vii. 1 and xi. 36–43, or "Isaiah says" (or "tells") for the vision itself, so the two voices stay apart.
- "Other possible readings" give, where Charles's footnote states them, the manuscripts' readings behind his emendations, his proposed readings for corrupt words, and his reasons for bracketing (19 verses are tested for them).

### Not done

- The Ethiopic was not read, nor Dillmann's edition, the Latin versions or the Slavonic; the English is checked against its own printing only.
- The dates rest on Charles alone (1900); later scholarship was not read, and the record says so.
- No Coptic witness is documented here.
- Charles's footnotes are not imported, and his Critical Notes (pp. 107–139 and elsewhere), to which several footnotes refer, were not read.
- The Commons API and image server rate-limited the searches; other candidates (Ethiopic manuscripts generally, illustrations of the seven heavens) were not examined.
