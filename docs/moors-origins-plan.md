# Origins of the Moors — research and implementation plan

Track: **Origins of the Moors — 315,000 BCE to 711 CE** (slug `origins-of-the-moors`), seeded into the
`squidgeoverskool` community, which hosts the timeline at squidgeoverskool.relate.click/timeline.

## What already exists (inspected 2026-10-18)

- **Seeded datasets.** Every themed track is a data file in `src/lib/timeline/*-seed.ts` typed by
  `seed-types.ts` (sources, events with date *claims* rather than dates, citations, pictures, genealogies of
  disputed claims, links between records). Staff add a dataset with a "Add these records" card on the timeline
  page; `seedDataset()` in `src/app/c/[communitySlug]/timeline/actions.ts` writes it idempotently (per slug),
  reuses sources by title + author, copies pictures into the community's own storage, and links records.
  No migration is needed for a new dataset.
- **Lanes.** Tracks are lanes. Within a track, the Okomilo dataset set the convention of using the record's
  `subcategory` as a sub-lane; the "Show on its own" dropdown (PR #696) can open any track, civilisation,
  shared tag or person by itself.
- **Deep time.** Years are astronomical numbers, so 315,000 years ago needs nothing special; the timeline already
  has a Log scale (`?scale=log`) where every ten-fold step in age gets equal width, which is how 315 ka and the
  first millennium BCE can be read on one screen.
- **Records this track can link to** (already in squidgeoverskool): Early Homo sapiens (Qafzeh, ochre, shell beads
  incl. Bizmoune in Morocco), Deep human past, the Green Sahara record in Atlantis, Set/Sutekh (Libyan Period
  Dakhleh stela, Nineteenth Dynasty, Set as lord of foreign lands), Carthage and Rome (the Hannibal dataset),
  Plato's Timaeus. There is **no Etruscan, Phoenician or Iberian track yet**, so those relationships are made
  between records inside this track.

## Design

- One dataset file `src/lib/timeline/moors-origins-seed.ts`, assembled from seven section files in
  `src/lib/timeline/moors-origins/` (prehistory; Egypt and the Libyans; Carthage and Etruria; Numidia and
  Mauretania; the Sahara; Roman and late-antique Africa to 711; the words and the disputed theories).
- **Nine lanes**, each a `subcategory` *and* a readable tag (`moors: …`), so each lane opens on its own from the
  existing dropdown with no new controls: Prehistoric North Africa · Ancient Amazigh and Libyan peoples · Egypt and
  North Africa · Carthage and Etruria · Numidia and Mauretania · Garamantes and the Sahara · Roman and post-Roman
  Africa · Emergence of medieval Moors · Alternative historical interpretations.
- **315,000 years ago is the opening of this track, not a floor on the timeline.** Jebel Irhoud's published age is
  315,000 ± 34,000 years ago (≈313,000 BCE); it is stored as a years-ago figure counted from 1950. Older occupation
  of Morocco by earlier humans is one record placed before it, clearly not Homo sapiens.
- **Alternative interpretations** are records in their own lane, each with who proposed it (a genealogy of the
  claim), the evidence cited, the strongest counter-evidence, the current scholarly position and what would change
  that verdict. Their claims are never filed as the conventional view.
- **Pictures** are Wikimedia Commons files only, each checked against the Commons API (exists, free licence,
  creator, size) during research; credit is fetched again when seeded and every picture is copied into the
  community's storage. Unverified identifications are captioned "UNVERIFIED —".
- **Guard rails as tests** (`src/lib/timeline/moors-origins.test.ts`): ≥54 records, ≥2 sources per record, ≥1 picture
  per record, every lane populated, ≥10 alternative interpretations with both cases, the track opens at Jebel Irhoud
  and closes in 711, no prehistoric record calls its people Moors, no modern racial categories, every link resolves.

## Wiring (no migration, no change to global timeline behaviour)

- `actions.ts`: `seedMoorsOriginsDataset()` and an entry in `SEEDED_DATASETS` so "Check for corrections" covers it.
- `page.tsx` / `timeline-view.tsx`: the standard staff "Add …?" card, shown until the anchor record exists.
- `seeded-pictures.test.ts`: the dataset joins the list every picture rule runs over.

## After merge

Staff open squidgeoverskool.relate.click/timeline and press **Add the Origins of the Moors**. Then open
`/timeline?track=origins-of-the-moors&scale=log` to read it.
