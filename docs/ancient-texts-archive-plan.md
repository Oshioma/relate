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
