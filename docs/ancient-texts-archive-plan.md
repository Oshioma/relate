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
