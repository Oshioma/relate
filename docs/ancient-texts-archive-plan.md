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
| R6 | Non-commercial image licences (BM, Bodleian, Gallica, Vatican) on a site with paid plans | each image stores its licence; NC images are linked to the institution rather than copied into storage until Oshi decides |
| R7 | Copyright on modern translations and on Doreal/Hall | layer rows without text plus short quotations; a QA check fails any layer whose source is marked copyrighted and whose content exceeds the excerpt limit |
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
