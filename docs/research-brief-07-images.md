# Research brief 07 — pictures for the Set, Serpent and Horus records

**Status of the datasets as of 2026-09-27, counted from the seed files, not estimated:**

| Dataset | Records | Carry a picture | Carry none |
| --- | --- | --- | --- |
| Set / Sutekh | 34 | 7 | 27 |
| Serpent & Kundalini | 3 | 0 | 3 |
| Horus claims | 5 | 0 | 5 |
| **Total** | **42** | **7** | **35** |

Thirty-five records out of forty-two have no image at all. This brief asks you to
close as much of that as the evidence honestly allows — and to tell me, flatly,
where it does not allow anything.

---

## Why I cannot do this myself

I have no route to the hosts this work needs. The egress proxy in my environment
answers `403` to `CONNECT` for every scholarly host I have tried:
`commons.wikimedia.org`, `loc.gov`, `wellcomecollection.org`,
`resources.metmuseum.org`, `britishmuseum.org`, `chesterbeatty.ie`,
`monash.edu`, `archive.griffith.ox.ac.uk`, `tarsus.ie`. Only GitHub, npm, PyPI
and the Anthropic API resolve. I have not worked around this and will not: the
alternative to fetching a file page is inventing what it says, and that is the
one thing this dataset cannot survive.

So you are the only way these records get pictures. What you send, I seed.

---

## THE ANTI-INVENTION STANDARD

This is the same standard as briefs 03 to 06, and it has not moved.

1. **Exact filenames only.** Copy them from the page. Do not reconstruct a
   filename from a title, do not normalise punctuation, do not swap spaces for
   underscores by hand. A filename that looks right and 404s is worse than no
   filename, because it takes a seeding run and a repair report to discover.
2. **Read each FILE's own licence page.** Never the category's, never the
   article's, never a sibling file's. Files in one Commons category routinely
   carry different licences, and some carry none.
3. **`NOT FOUND` is a correct and valuable answer.** For any record below, "I
   looked at X, Y and Z and there is no freely-licensed image of this object" is
   a finding I will record. A plausible substitute is not. I would rather ship
   thirty-five records with no picture than one record with the wrong picture.
4. **If you are unsure whether an image shows what the record is about, say so
   and send it flagged.** The dataset has a field for exactly that
   (`identificationStatus: "disputed"`), and a disputed identification recorded
   as disputed is an asset. A disputed identification recorded as secure is a lie.

---

## THE FIVE CONFLATIONS

These are the ones that have actually gone wrong in this project before. Each
has its own field, and collapsing any two of them destroys the record's value.

1. **UPLOAD DATE is never IMAGE DATE.** An 1804 etching, scanned in 2009,
   uploaded in 2015, has three dates two centuries apart. They go in
   `objectDate`, `photographDate` and `uploadDate`. An upload date presented as
   an image date turns a modern scan of a Georgian print into a Georgian
   photograph.
2. **COMMONS SOURCE is never ORIGINAL INSTITUTION.** Commons is a re-publisher.
   The Louvre holds the vase; Commons holds a photograph of it. `institution` is
   the Louvre. `sourcePageUrl` is the Commons file page. `originalSourceUrl` is
   the Louvre's own catalogue record — and that is where a rights statement that
   *differs* from the Commons one will be found. When they differ, send both:
   there is a `rightsNotes` field and the application takes the more
   conservative reading.
3. **AN ENGRAVING OF A THING is never A PHOTOGRAPH OF IT.** `shows: "engraving"`
   and `shows: "artefact"` are different keys and the interface renders them
   differently. A nineteenth-century draughtsman's plate of a relief has already
   made interpretive decisions about what is there.
4. **A CATEGORY is a filing decision; a SUBJECT is a claim about the image.**
   They are allowed to differ, and when they do, `subject` wins and the
   difference goes in `provenanceNotes`. (The case that produced this field: a
   music-hall bill from 1886 sitting in the Commons category of a man who died in
   1806.)
5. **FOUR FILES OF ONE OBJECT ARE NOT FOUR PIECES OF EVIDENCE.** If two of the
   files you send are crops, rescans or lower-resolution copies of one
   photograph, say which duplicates which — there is a `duplicateOf` field. A
   gallery of crops presented as an accumulation reads as corroboration, which is
   the most flattering possible error about a thinly documented object.

---

## WHERE A PICTURE MAY COME FROM

The codebase will only accept images from sources that publish, in one findable
place, the terms their images may be used on. The allowed hosts are:

| Source | Hosts |
| --- | --- |
| Wikimedia Commons | `commons.wikimedia.org`, `upload.wikimedia.org`, `wikimedia.org`, `wikipedia.org` |
| Gallica / BnF | `gallica.bnf.fr` |
| The Metropolitan Museum of Art | `metmuseum.org`, `images.metmuseum.org` |
| Library of Congress | `loc.gov` |
| Wellcome Collection | `wellcomecollection.org`, `iiif.wellcomecollection.org` |
| Rijksmuseum | `rijksmuseum.nl` |
| Smithsonian | `si.edu`, `ids.si.edu` |
| NASA | `nasa.gov`, `images-assets.nasa.gov`, `apod.nasa.gov` |
| USGS | `usgs.gov` |
| NOAA | `noaa.gov` |

**Deliberately not on this list:** image search results, "found via Google",
news photography, stock libraries, personal blogs, Pinterest, and general web
hosts. Also — and this matters for several records below — **archive.org and
Google Books are not on the list.** If the only copy of a plate you find is on
archive.org, tell me: that is a request to add a source, which is a deliberate
act needing a name, its hosts and the URL where it states its terms. Do not
silently give me an archive.org link as though it were usable.

**If the best image for a record sits on a museum site not listed above** (the
Ashmolean, the Egyptian Museum in Cairo, the Istanbul Archaeology Museum, the
Chester Beatty), say so and give me the catalogue URL and the museum's rights
page. I will decide whether to add the source. Again: naming an unusable source
is useful; substituting a usable picture of something else is not.

### Technical limits
- **Formats:** JPEG, PNG, WebP, GIF. **Max 8 MB.**
- **SVG is refused** by the image copier (an SVG can carry script). If a file is
  SVG, the URL must ask Commons for a raster: `…?width=1200`.
- Prefer files over ~1000 px on the long edge. Send `pixelWidth`/`pixelHeight`
  so "this one needs replacing" is a fact rather than an impression.

---

## WHAT TO SEND, PER IMAGE

Fill what you can verify; **leave blank what you cannot**, and say why in
`provenanceNotes`. A blank field is honest. A guessed field is not.

```
recordSlug:        (from the lists below, exactly as written)
fileName:          (the exact name at the holding site)
sourcePageUrl:     (the FILE page — never the image file itself)
originalFileUrl:   (the full-size file, no width parameter)
institution:       (who holds the ORIGINAL object)
originalSourceUrl: (the holding institution's own catalogue record)
accessionNumber:   (catalogue / accession / digital ID)
creator:           (photographer, engraver, draughtsman — as named)
licence:           (verbatim as the FILE page states it)
rightsNotes:       (only if two sources state different terms — quote both)
objectDate:        (when the depicted thing was made)
photographDate:    (when the photograph or scan was taken)
uploadDate:        (when the file reached the host)
pixelWidth:
pixelHeight:
subject:           (what the picture is actually OF, if not what it is filed under)
shows:             (one MEDIA_KINDS key — list below)
identificationStatus: (one of six keys — list below)
duplicateOf:       (filename, if this duplicates another file you are sending)
provenanceNotes:   (what is known, what is assumed, what I should go and check)
caption:           (see the caption rules — this one has hard constraints)
```

### The vocabulary keys — use these exactly, nothing else

An invented key typechecks and then renders as a blank label, so the guard tests
reject anything not on these lists.

**`shows` — 21 valid keys.** Pick the one that is true, not the one that is
flattering:
`evidence_photograph`, `manuscript`, `artefact`, `site`, `scientific_figure`,
`map`, `diagram`, `portrait`, `reconstruction`, `later_artwork`, `human_remains`,
`museum_specimen`, `excavation_context`, `personal_artefact`, `replica`,
`unverified_image`, `known_manipulation`, `hoax_object`, `historical_document`,
`comparison_chart`, `engraving`.

For this brief the ones that will come up most are `artefact` (an object in a
collection), `manuscript` (a papyrus, tablet or inscription), `site` (a place),
`engraving` (a print or plate), `later_artwork` (a modern or post-classical
depiction), `portrait` (a person who made a claim), and `historical_document` (a
title page, a book plate).

**`identificationStatus` — 6 valid keys:**
`secure`, `probable`, `possible`, `disputed`, `rejected`, `modern_interpretation`.

### The caption rules, which are enforced by tests

- **Longer than 40 characters**, and about the picture — what it shows and what
  it does not.
- **Do not write a licence into the caption.** Not "public domain", not "CC BY",
  not "CC0", not "Creative Commons". The credit is fetched from the file page at
  seed time and appended automatically; a licence typed into the caption is a
  licence typed from memory, and a test fails the build for it. Put the licence
  in the `licence` field instead, where it belongs.
- The caption is also the alt text, so write it as a description of the image,
  not as a citation.
- **Where a picture invites a reading the record refuses, the caption should say
  so.** This is the house style and it is the point of the whole project. Not
  "the Pashupati seal" but "the seal usually called Pashupati; the seated figure's
  posture has been read as yogic, and the seal itself carries no text that says
  so."

---

# TRANCHE A — objects that exist, are well known, and should be findable

Highest value first. For each: what the record is about, what picture would
serve it, and what to be careful of.

### A1. `set-in-the-pyramid-texts` — "Set in the Pyramid Texts: killer and helper in the same corpus"
Want: a photograph of Pyramid Texts *in situ* — the antechamber or sarcophagus
chamber walls of the pyramid of Unas at Saqqara is the canonical one. **Careful:**
the caption must not imply the visible columns are the passages about Set. If you
can find a photograph of a wall that demonstrably contains a Set utterance, that
is much better and worth saying; if not, a general Pyramid Texts wall with a
caption admitting it is general.

### A2. `set-in-the-coffin-texts` — "The Coffin Texts: the mythology spreads beyond the king"
Want: a coffin interior with Coffin Texts visible. The Met holds several Middle
Kingdom coffins and `metmuseum.org` is an allowed host, so start there and give
me the Met accession number. Commons also has Bersha and Asyut coffins.

### A3. `scorpion-macehead-standards` — "The Scorpion Macehead and its standards"
Want: the Scorpion Macehead, Ashmolean Museum (AN1896-1908 E.3632), or a good
drawing of the standards register. **Careful:** the record is about what the
standards on it do and do not establish. If the only free image is a line
drawing, that is `shows: "engraving"` or `"diagram"`, not `"artefact"`.

### A4. `khasekhemwy-horus-and-set` — "Khasekhemwy puts Horus and Set together"
Want: a Khasekhemwy object bearing the serekh with both animals — the Ashmolean
and the Egyptian Museum hold stone vessels and door-jamb fragments. **Careful:**
there are modern redrawings of this serekh all over the web. A redrawing is
`shows: "diagram"` with `identificationStatus: "modern_interpretation"`, and it
must not be captioned as the object.

### A5. `gudea-vase-entwined-serpents` — "The libation vase of Gudea: two serpents about a central axis"
Want: the Louvre's libation vase of Gudea, **AO 190**. This is heavily
photographed and Commons should have it. **This is the single highest-value
image in the brief**, because the record exists to hold apart "two snakes around
a pole, c. 2100 BCE" from "a caduceus" and from "Kundalini", and a reader needs
to see the object to judge that for themselves. Give me the Louvre catalogue URL
as `originalSourceUrl` as well as the Commons page.

### A6. `pashupati-seal` — "The Pashupati seal: what is on it, and what has been read into it"
Want: seal **M-304** from Mohenjo-daro (National Museum, New Delhi). Both a
photograph and the standard drawing would be ideal — send them as two entries,
with the drawing marked `shows: "diagram"`. **Careful, and this is the whole
record:** the name "Pashupati" is a modern identification, not a label on the
object. `identificationStatus: "disputed"`. The caption must not call the figure
Shiva or proto-Shiva as though the seal said so.

### A7. `indus-script-undeciphered` — "The Indus script cannot be read, and that governs everything above"
Want: a clear photograph of an Indus seal or tablet with a good run of script
signs. Any well-provenanced one; the point is legibility of the signs, not the
specific seal. **Careful:** do not send anything captioned with a "translation".

### A8. `egyptian-hittite-treaty-sutekh` — "Sutekh witnesses a treaty between empires"
Want: either the Akkadian cuneiform tablet from Boğazköy (Istanbul Archaeology
Museum — widely photographed, and there is a replica at the UN) or the
hieroglyphic version on the Karnak wall. **Careful:** the UN replica is
`shows: "replica"`, not `"artefact"`. Please distinguish which you are sending,
and if it is the Istanbul tablet give me the museum's rights page since
`muze.gov.tr` is not an allowed host.

### A9. `nineteenth-dynasty-named-for-set` — "Kings named for Set: Seti I and the Nineteenth Dynasty"
Want: a cartouche of Seti I. **And here is the detail worth chasing:** in his
Abydos temple, Seti I's cartouche substitutes Osiris for the Set animal — the
king named for Set having the god's own sign replaced in a temple context. If you
can find a photograph of that substitution, and a scholarly source confirming
that is what it is, it is a far better picture than a plain cartouche, and it
belongs on this record with a caption that explains the swap.

### A10. `crowley-cairo-1904` — "Cairo, 1904: Egypt enters modern occultism, filtered twice"
Want: the Stele of Ankh-ef-en-Khonsu (Egyptian Museum, Cairo, A 9422 — the
object Crowley called the "Stele of Revealing"). A photograph of the stele itself
is the right image here, not a portrait of Crowley, because the record is about
how an actual Twenty-fifth/Twenty-sixth Dynasty funerary stele was read through
two layers of interpretation. **If** a free Crowley portrait also exists, send it
second as `shows: "portrait"`.

### A11. `plutarch-on-isis-and-osiris` — "Plutarch writes On Isis and Osiris"
Want: a manuscript page or early printed edition title page of the *Moralia*.
Gallica is an allowed host and is the likeliest place. `shows: "manuscript"` or
`"historical_document"` as appropriate. **Careful:** the record is about
Plutarch as a Greek writer at a distance from Egypt; a caption should not present
his text as an Egyptian source.

### A12. `predynastic-possible-set-animals` — "Strange animals on Predynastic pottery"
Want: Naqada-period decorated pottery showing quadrupeds. The Met and the
Petrie/UCL collections both hold examples; the Met is an allowed host.
**Careful, and the record turns on it:** the title says *possible*. The caption
must not identify the animal as a Set animal. `identificationStatus: "possible"`
at most, and `"disputed"` is likelier honest.

### A13. `set-animal-species-unidentified` — "Nobody knows what animal the Set animal is"
Want: a clean, high-resolution view of the Set animal on its own — a standing
figure or a hieroglyph — where the ears, snout and tail are all clearly visible.
The whole record is that zoologists and Egyptologists cannot agree what species
it is, so the reader needs to be able to look.

### A14. `typhonian-magic-greco-roman` — "Typhon-Seth in the magical papyri"
Want: a Greek magical papyrus page. The BnF, the British Library and Leiden hold
the main ones; Gallica is allowed. **Careful:** send a papyrus that actually
belongs to the PGM corpus and say which, or say you could not establish which —
"a Greek magical papyrus" with no identification is not much use.

### A15. `egyptological-rediscovery-of-set` — "Europe learns to read the evidence again"
Want: either a plate from the *Description de l'Égypte* (Gallica, and it is
public domain) or a portrait of Champollion. **Careful:** a *Description* plate
is `shows: "engraving"`, dated to its publication, not to the monument it draws.
This is exactly the case where `objectDate` and `photographDate` diverge by
three thousand years.

---

# TRANCHE B — the hard ones, where the honest answer may be "no free image"

I expect several of these to come back `NOT FOUND`. Please look, and please tell
me what you looked at. A named dead end is a permanent asset: it stops the next
person repeating the search.

### B1. `contendings-of-horus-and-seth` — Papyrus Chester Beatty I
The papyrus is in the Chester Beatty Library, Dublin. Their images are likely
restricted. **Gardiner's 1931 facsimile plates** would be ideal and are old
enough to be out of copyright in most jurisdictions — but I need to know *where*
a copy is hosted and under what stated terms. If the answer is "archive.org
only", say that plainly rather than sending the link as though it were usable.

### B2. `four-hundred-year-stela` — the 400-Year Stela
The stela was found at Tanis and is in the Egyptian Museum, Cairo. Photographs
exist; free ones may not. Mariette's nineteenth-century publication drawing is
another route. **Careful:** the record's entire point is that the object carries
two dates that must not be merged, so a drawing is fine but must be labelled a
drawing.

### B3–B6. The Dakhleh records
`mut-el-kharab-ramesside-seth-stela`, `mut-el-kharab-seth-determinative-overwritten`,
`greater-dakhleh-stela-oracle-of-seth`, `smaller-dakhleh-stela-piye`.

The two Dakhleh Stelae are in the Ashmolean. Mut el-Kharab material was excavated
by the Monash University Dakhleh Oasis Project and its photographs are almost
certainly under copyright. Gardiner published the Greater Dakhleh Stela in 1933
and Janssen the Smaller in 1968 (plate 25), so century-old plates may be
available. **There is also an outstanding question on the overwriting record** —
whether the determinative change is visible in any published photograph, which
Kaper 2001 and Griffith Institute photograph `Griffith-2-9` may settle. If you
can see that, say what is actually visible, not what the literature says should be.

### B7. `hyksos-avaris-sutekh` — Tell el-Dab'a
Excavation photographs are Austrian Archaeological Institute copyright. A
Hyksos-period scarab or seal naming Sutekh, in a museum with open images, would
serve better. Or: nothing, honestly recorded.

### B8. `set-lord-of-the-red-land` — Set as lord of desert, storm and foreign land
No single object is obvious. Options: a Set figure holding a *was* sceptre; a
desert landscape (`shows: "site"`, and a caption admitting a landscape is not
evidence of a god). **I would rather this record carry nothing than carry a
stock desert photograph.** Your call, argued.

### B9. `late-period-persecution-of-set` — erasure and marginalisation
A neighbouring record (`set-image-obliterated`) already carries an image of a cut-away
Set figure. If you find a *different*, securely dated Late Period erasure, send
it; if the best candidate is another view of the same kind of thing, say so and I
will leave this record without a picture rather than imply two independent
witnesses.

### B10. `set-survives-in-the-oases` — "Dakhleh: where Seth's story stops being one story"
This record exists to break the assumption that hostility to Set happened
everywhere at once. A **map** would serve it better than an object: the Nile
Valley and the Western Desert oases, showing how far Dakhleh is from Thebes.
`shows: "map"`. A modern freely-licensed map of the oases is acceptable here, and
the caption should give the distance.

### B11–B15. The Horus claim records
`horus-conception-pyramid-texts`, `horus-is-not-one-person`,
`horus-december-25-claim`, `horus-twelve-followers-claim`, `horus-crucified-claim`.

These are the four-claims investigation plus its "which Horus?" record. What
would serve each:

- **Conception:** the Abydos relief of Isis as a kite over the recumbent Osiris.
  Commons should have this. High value — it is the actual ancient image behind
  the "virgin birth" claim, and seeing it is the fastest way to understand why
  the claim is both not baseless and not what it says.
- **Which Horus:** two or three different Horus forms side by side — Horus the
  falcon, Harpocrates as a child, Haroeris. The Met is a good source.
  Send them as separate entries on this one record; the multiplicity *is* the point.
- **December 25:** the birth-house (mammisi) reliefs at Dendera or Luxor. **Careful:**
  no such relief carries a date, and the caption must say that.
- **Twelve followers:** the most useful image is not Egyptian at all — it is the
  **title page or relevant plate of Gerald Massey's own book**, since the record
  traces where the claim entered. If Massey is unavailable, the Dendera zodiac
  (Louvre) is the object the "twelve" is usually read off. Label whichever you send.
- **Crucified:** this is the one with a specific open question. The claim traces
  back through Doane (1882) to Bonwick, and to an illustration at **Sharpe
  p. 143** whose original has never been identified. **If you can identify what
  Sharpe's plate was drawn from, that is the most valuable single finding in this
  brief** — more valuable than any photograph. Please treat it as a research
  question, not an image request: what is the object, where is it, and does it
  show what Sharpe's engraver drew?

---

# TRANCHE C — records I expect should carry NO picture

I am asking you to **confirm or overturn** these, not to fill them. If you think
one of them *should* have an image, argue for it.

| Record | Why I think it takes no image |
| --- | --- |
| `documentary-gap-set` — "roughly fourteen centuries with nothing in them" | The record is the absence. A picture would be an illustration of nothing, and would make the gap look furnished. |
| `decline-of-the-ancient-cult` — "ends slowly and without a last day" | A gradual non-event has no object. Any image would date it. |
| `set-in-modern-popular-culture` — film villain, comic antagonist, game boss | Every candidate is in copyright. **Do not send film stills, comic panels, game screenshots or promotional art**, whatever a site says about fair use. |
| `temple-of-set-1975` | Probably no freely-licensed image exists. If a logo or document is genuinely free, say where its terms are stated. |
| `set-the-egyptian-satan-claim` | This is a claim genealogy — a chain of who said what — not an object. **Unless** you can identify the Victorian popularisation in the chain, in which case its title page would be a real addition. See below. |

### And one non-image request, attached to that last row

The Satan genealogy has **three unread links**: Christian-era demonology,
Victorian popularisation, and a named modern work. I will not name the modern
work from memory — a wrong title would undercut the record's own argument, which
is the exact failure the record exists to expose. If your searching happens to
surface an **author, date and page** for any of those three, send it. That is
worth more than a picture.

---

## Return format

Plain text or Markdown, grouped by `recordSlug`, one block per image, using the
field list above. Verbatim quotes for anything you are reporting as the source's
own words — especially `licence`.

End with two lists:

1. **NOT FOUND** — every record you searched and found nothing usable for, with
   what you searched. I will record these as findings on the records themselves.
2. **BLOCKED BY SOURCE** — every record where a good image exists on a host not
   in the allowed list, with the catalogue URL and the institution's rights page,
   so I can decide whether to add the source.

## What not to send

- Any URL from an image search, Pinterest, a blog, a news site or a stock library.
- Any file whose licence you read off a category, an article or a sibling file.
- Any filename you reconstructed rather than copied.
- Any film still, comic panel, game screenshot or promotional artwork.
- A picture of a different object that would "work" for the record.
- A confident `identificationStatus` on an identification that is actually argued.

The dataset's whole claim on a reader's trust is that it says how much evidence
sits under each statement. A picture is a statement.
