// Dated objects and diagrams, not a claimed continuous lineage.
// Dates belong to the surviving object, manuscript, print or modern publication.
import type { SeedEvent, SeedPicture, SeedSource, SeedTrack } from "./seed-types";

export const SACRED_TREES_TRACK: SeedTrack = { name: "Sacred trees and sefirotic diagrams", slug: "sacred-trees-diagrams", kind: "theme", color: "#62835b" };
export const SACRED_TREES_ANCHOR_SLUG = "ur-goat-golden-plant";
export const SACRED_TREES_SOURCES: SeedSource[] = [
  {
    "key": "bm_ram",
    "title": "British Museum: statuette/stand, Ur 1929,1017.1",
    "url": "https://www.britishmuseum.org/collection/object/W_1929-1017-1",
    "sourceType": "website",
    "notes": "Source listing consulted for the described object or diagram; linked for readers to inspect. c. 2600 BCE; goat rearing against a plant; catalogue does not establish a Tree of Life doctrine."
  },
  {
    "key": "bm_inlay",
    "title": "British Museum: shell inlay, Ur 1928,1010.220",
    "url": "https://www.britishmuseum.org/collection/object/W_1928-1010-220",
    "sourceType": "website",
    "notes": "Source listing consulted for the described object or diagram; linked for readers to inspect. c. 2600 BCE; two goats rearing over a tree."
  },
  {
    "key": "harappa_pipal",
    "title": "Harappa.com: Seal, Mohenjo-daro DK 6847",
    "url": "https://www.harappa.com/slide/seal-mohenjo-daro-1",
    "sourceType": "website",
    "notes": "Source listing consulted for the described object or diagram; linked for readers to inspect. Photograph and description of the pipal-tree seal, Islamabad Museum NMP 50.295; page does not specify an individual object date."
  },
  {
    "key": "louvre_mari",
    "title": "Musée du Louvre: Peinture de l’Investiture, AO 19826",
    "url": "https://collections.louvre.fr/en/ark:/53355/cl010144553",
    "sourceType": "website",
    "notes": "Source listing consulted for the described object or diagram; linked for readers to inspect. Museum catalogue dates the painting to 2000–1800 BCE; tree imagery is a later interpretation."
  },
  {
    "key": "egypt_kv34",
    "title": "Thutmose III tomb KV34: sycamore goddess scene",
    "url": "https://commons.wikimedia.org/wiki/File:Maler_der_Grabkammer_des_Thutmosis_III._001.jpg",
    "sourceType": "website",
    "notes": "Source listing consulted for the described object or diagram; linked for readers to inspect. Surviving Eighteenth Dynasty tomb painting; c. 15th century BCE, approximate placement based on reign."
  },
  {
    "key": "met_nimrud",
    "title": "The Met: Assyrian relief panel 32.143.3",
    "url": "https://www.metmuseum.org/art/collection/search/322610",
    "sourceType": "website",
    "notes": "Source listing consulted for the described object or diagram; linked for readers to inspect. Museum dates panel to c. 883–859 BCE; describes stylised sacred trees and uncertain symbolism."
  },
  {
    "key": "nli_1284",
    "title": "National Library of Israel: The Kabbalistic Tree: The Map of God",
    "url": "https://blog.nli.org.il/en/djm_ilanot/",
    "sourceType": "website",
    "notes": "Source listing consulted for the described object or diagram; linked for readers to inspect. Institution identifies earliest surviving sefirotic tree, Spain, 1284, in a wheel-like arrangement."
  },
  {
    "key": "cja_1516",
    "title": "Center for Jewish Art: Portae Lucis, object 40577",
    "url": "https://cja.huji.ac.il/browser.php?id=40577&mode=set",
    "sourceType": "website",
    "notes": "Source listing consulted for the described object or diagram; linked for readers to inspect. Catalogue identifies the Augsburg 1516 printed image of the sefirot."
  },
  {
    "key": "chabad_daat",
    "title": "Chabad: Two Systems of Ten Sefirot",
    "url": "https://www.chabad.org/library/article_cdo/aid/137112/jewish/Two-Systems-of-Ten-Sefirot.htm",
    "sourceType": "website",
    "notes": "Source listing consulted for the described object or diagram; linked for readers to inspect. Explains that Keter and Da’at are alternative enumerations within ten sefirot, not simply an extra ancient Egyptian sphere."
  },
  {
    "key": "kamiti_2014",
    "title": "Kamitic Tree of Life, Hafi’s Process Journal",
    "url": "https://hafiprocessjournal.wordpress.com/2014/09/10/kamitic-tree-of-life/",
    "sourceType": "website",
    "notes": "Source listing consulted for the described object or diagram; linked for readers to inspect. Dated web publication of an 11-sphere diagram numbered 0–10 with Amen at 0. This is a modern attestation of this copy, not an ancient object date."
  }
];

// Keep the cover and the gallery picture together so a later correction run
// can bring both into communities that took this dataset before it had images.
const commons = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1024`;
const pictured = (picture: SeedPicture) => ({ imageUrl: picture.url, media: [picture] });
const PICTURES: Record<string, ReturnType<typeof pictured>> = {
  "ur-goat-golden-plant": pictured({
    url: commons("Ram in a thicket - British.jpg"),
    fileName: "Ram in a thicket - British.jpg",
    caption: "The excavated goat and flowering plant from Ur, now in the British Museum; the museum object is not itself evidence of a later sefirotic scheme.",
    shows: "artefact", kind: "image", creditFrom: "source",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ram_in_a_thicket_-_British.jpg",
    originalSourceUrl: "https://www.britishmuseum.org/collection/object/W_1929-1017-1",
    institution: "British Museum", accessionNumber: "1929,1017.1",
  }),
  "ur-two-goats-tree-inlay": pictured({
    url: commons("Inlay of two standing goats BM 121529.jpg"),
    fileName: "Inlay of two standing goats BM 121529.jpg",
    caption: "The shell inlay from Ur, with two goats flanking a plant, held by the British Museum as 1928,1010.220.",
    shows: "artefact", kind: "image", creditFrom: "source",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Inlay_of_two_standing_goats_BM_121529.jpg",
    originalSourceUrl: "https://www.britishmuseum.org/collection/object/W_1928-1010-220",
    institution: "British Museum", accessionNumber: "1928,1010.220",
  }),
  "mohenjo-daro-pipal-tree-seal": pictured({
    url: "/images/sacred-trees/indus-seal-schematic.png",
    caption: "New schematic of the reported seal scene: a figure in a pipal tree and an attendant below. This is not a photograph or tracing of DK 6847. Original drawing, CC0.",
    shows: "reconstruction", kind: "image",
    credit: "Original schematic for Relate, 2026; CC0. Compare the photographed seal at Harappa.com.",
    sourcePageUrl: "https://www.harappa.com/slide/seal-mohenjo-daro-1",
    institution: "Islamabad Museum", accessionNumber: "NMP 50.295",
  }),
  "mari-investiture-trees": pictured({
    url: commons("Investiture of Zimri-Lim Louvre AO19826 n01.jpg"),
    fileName: "Investiture of Zimri-Lim Louvre AO19826 n01.jpg",
    caption: "The Investiture painting from the palace at Mari, showing the trees around its central scene; Louvre AO 19826.",
    shows: "artefact", kind: "image", creditFrom: "source",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Investiture_of_Zimri-Lim_Louvre_AO19826_n01.jpg",
    originalSourceUrl: "https://collections.louvre.fr/en/ark:/53355/cl010144553",
    institution: "Musée du Louvre", accessionNumber: "AO 19826",
  }),
  "kv34-sycamore-tree-goddess": pictured({
    url: commons("Maler der Grabkammer des Thutmosis III. 001.jpg"),
    fileName: "Maler der Grabkammer des Thutmosis III. 001.jpg",
    caption: "The tree-goddess scene in Thutmose III's tomb, KV34. This ancient Egyptian image is not an eleven-circle diagram.",
    shows: "artefact", kind: "image", creditFrom: "source",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Maler_der_Grabkammer_des_Thutmosis_III._001.jpg",
    institution: "Tomb of Thutmose III, KV34",
  }),
  "nimrud-sacred-tree-relief": pictured({
    url: commons("Relief panel MET DP375419.jpg"),
    fileName: "Relief panel MET DP375419.jpg",
    caption: "Neo-Assyrian palace relief showing protective figures and a stylised tree, in the Metropolitan Museum of Art.",
    shows: "artefact", kind: "image", creditFrom: "source",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Relief_panel_MET_DP375419.jpg",
    originalSourceUrl: "https://www.metmuseum.org/art/collection/search/322610",
    institution: "Metropolitan Museum of Art", accessionNumber: "32.143.3",
  }),
  "sefirotic-tree-spain-1284": pictured({
    url: "https://gallica.bnf.fr/ark:/12148/btv1b105445692/f76.highres",
    caption: "Wheel-shaped sefirotic diagram in BnF Hébreu 763, folio 35r. Gallica catalogues the manuscript as Italy? 1284; the National Library of Israel describes an early wheel from Spain in 1284.",
    shows: "manuscript", kind: "image", creditFrom: "source",
    sourcePageUrl: "https://gallica.bnf.fr/ark:/12148/btv1b105445692/f76.image",
    institution: "Bibliothèque nationale de France", accessionNumber: "Hébreu 763, fol. 35r",
    objectDate: "1284 CE",
  }),
  "portae-lucis-tree-1516": pictured({
    url: commons("Portae Lucis 1516.jpg"),
    fileName: "Portae Lucis 1516.jpg",
    caption: "The printed sefirotic image on the 1516 Augsburg Portae Lucis title page, a Renaissance print rather than a medieval manuscript.",
    shows: "artefact", kind: "image", creditFrom: "source",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Portae_Lucis_1516.jpg",
    originalSourceUrl: "https://cja.huji.ac.il/browser.php?id=40577&mode=set",
    objectDate: "1516 CE",
  }),
  "kamiti-eleven-sphere-copy-2014": pictured({
    url: "/images/sacred-trees/modern-eleven-sphere-schematic.png",
    caption: "New schematic of eleven positions described in a 2014 article, numbered 0 through 10. It is not an ancient Egyptian artifact or a reproduction of that graphic. Original drawing, CC0.",
    shows: "reconstruction", kind: "image",
    credit: "Original schematic for Relate, 2026; CC0. Source for the modern numbering: Hafi's Process Journal, 10 September 2014.",
    sourcePageUrl: "https://hafiprocessjournal.wordpress.com/2014/09/10/kamitic-tree-of-life/",
    objectDate: "2014 CE online copy",
  }),
};

export const SACRED_TREES_EVENTS: SeedEvent[] = [
  {
    "slug": "ur-goat-golden-plant",
    ...PICTURES["ur-goat-golden-plant"],
    "title": "Goat beside a golden plant at Ur",
    "summary": "An excavated stand shows a goat against a flowering plant. Its role as a Tree of Life is not established by the catalogue.",
    "description": "WHAT SURVIVES. An excavated stand shows a goat against a flowering plant. Its role as a Tree of Life is not established by the catalogue.\n\nSOURCE AND DATE. c. 2600 BCE. Follow the source link for the image or catalogue record. The date belongs to the object or publication named here. Resemblance to other tree imagery does not establish historical transmission.",
    "category": "archaeology",
    "subcategory": "Sacred trees and diagrams",
    "eventType": "historical",
    "tags": [
      "sacred-tree",
      "tree-of-life",
      "comparative-iconography"
    ],
    "civilisations": [
      "Sumer, Royal Cemetery of Ur"
    ],
    "claims": [
      {
        "sourceKey": "bm_ram",
        "startYear": -2599,
        "datePrecision": "year",
        "isApproximate": true,
        "originalDateText": "c. 2600 BCE",
        "datingMethod": "archaeological",
        "chronology": "historical",
        "evidence": "An excavated stand shows a goat against a flowering plant. Its role as a Tree of Life is not established by the catalogue.",
        "whatIsDated": "Date of surviving object, diagram, print or published copy"
      }
    ]
  },
  {
    "slug": "ur-two-goats-tree-inlay",
    ...PICTURES["ur-two-goats-tree-inlay"],
    "title": "Two goats and a central tree at Ur",
    "summary": "A shell inlay pairs two goats around a tree. Similarity to later sacred-tree compositions is a comparison, not a demonstrated transmission.",
    "description": "WHAT SURVIVES. A shell inlay pairs two goats around a tree. Similarity to later sacred-tree compositions is a comparison, not a demonstrated transmission.\n\nSOURCE AND DATE. c. 2600 BCE. Follow the source link for the image or catalogue record. The date belongs to the object or publication named here. Resemblance to other tree imagery does not establish historical transmission.",
    "category": "archaeology",
    "subcategory": "Sacred trees and diagrams",
    "eventType": "historical",
    "tags": [
      "sacred-tree",
      "tree-of-life",
      "comparative-iconography"
    ],
    "civilisations": [
      "Sumer, Royal Cemetery of Ur"
    ],
    "claims": [
      {
        "sourceKey": "bm_inlay",
        "startYear": -2599,
        "datePrecision": "year",
        "isApproximate": true,
        "originalDateText": "c. 2600 BCE",
        "datingMethod": "archaeological",
        "chronology": "historical",
        "evidence": "A shell inlay pairs two goats around a tree. Similarity to later sacred-tree compositions is a comparison, not a demonstrated transmission.",
        "whatIsDated": "Date of surviving object, diagram, print or published copy"
      }
    ]
  },
  {
    "slug": "mohenjo-daro-pipal-tree-seal",
    ...PICTURES["mohenjo-daro-pipal-tree-seal"],
    "title": "A deity in a pipal tree on an Indus seal",
    "summary": "The seal depicts a figure standing in a pipal tree. Its script is undeciphered and the ritual interpretation remains tentative.",
    "description": "WHAT SURVIVES. The seal depicts a figure standing in a pipal tree. Its script is undeciphered and the ritual interpretation remains tentative.\n\nSOURCE AND DATE. Mature Harappan period, approximately 2600–1900 BCE; individual seal date not given by linked catalogue. Follow the source link for the image or catalogue record. The date belongs to the object or publication named here. Resemblance to other tree imagery does not establish historical transmission.",
    "category": "archaeology",
    "subcategory": "Sacred trees and diagrams",
    "eventType": "historical",
    "tags": [
      "sacred-tree",
      "tree-of-life",
      "comparative-iconography"
    ],
    "civilisations": [
      "Indus Valley Civilisation"
    ],
    "claims": [
      {
        "sourceKey": "harappa_pipal",
        "startYear": -2599,
        "datePrecision": "year",
        "isApproximate": true,
        "originalDateText": "Mature Harappan period, approximately 2600–1900 BCE; individual seal date not given by linked catalogue",
        "datingMethod": "archaeological",
        "chronology": "historical",
        "evidence": "The seal depicts a figure standing in a pipal tree. Its script is undeciphered and the ritual interpretation remains tentative.",
        "whatIsDated": "Date of surviving object, diagram, print or published copy",
        "endYear": -1899
      }
    ]
  },
  {
    "slug": "mari-investiture-trees",
    ...PICTURES["mari-investiture-trees"],
    "title": "Trees on the Investiture painting at Mari",
    "summary": "The palace wall painting includes tree imagery. The term Tree of Life is an interpretive label rather than an inscription on the painting.",
    "description": "WHAT SURVIVES. The palace wall painting includes tree imagery. The term Tree of Life is an interpretive label rather than an inscription on the painting.\n\nSOURCE AND DATE. 2000–1800 BCE (Louvre catalogue). Follow the source link for the image or catalogue record. The date belongs to the object or publication named here. Resemblance to other tree imagery does not establish historical transmission.",
    "category": "archaeology",
    "subcategory": "Sacred trees and diagrams",
    "eventType": "historical",
    "tags": [
      "sacred-tree",
      "tree-of-life",
      "comparative-iconography"
    ],
    "civilisations": [
      "Amorite Mari"
    ],
    "claims": [
      {
        "sourceKey": "louvre_mari",
        "startYear": -1999,
        "datePrecision": "year",
        "isApproximate": true,
        "originalDateText": "2000–1800 BCE (Louvre catalogue)",
        "datingMethod": "archaeological",
        "chronology": "historical",
        "evidence": "The palace wall painting includes tree imagery. The term Tree of Life is an interpretive label rather than an inscription on the painting.",
        "whatIsDated": "Date of surviving object, diagram, print or published copy",
        "endYear": -1799
      }
    ]
  },
  {
    "slug": "kv34-sycamore-tree-goddess",
    ...PICTURES["kv34-sycamore-tree-goddess"],
    "title": "Sycamore goddess in the tomb of Thutmose III",
    "summary": "An Egyptian tree-goddess scene, visually distinct from a connected-sphere diagram. The precise year is not established by this image page.",
    "description": "WHAT SURVIVES. An Egyptian tree-goddess scene, visually distinct from a connected-sphere diagram. The precise year is not established by this image page.\n\nSOURCE AND DATE. c. 15th century BCE, reign of Thutmose III. Follow the source link for the image or catalogue record. The date belongs to the object or publication named here. Resemblance to other tree imagery does not establish historical transmission.",
    "category": "archaeology",
    "subcategory": "Sacred trees and diagrams",
    "eventType": "historical",
    "tags": [
      "sacred-tree",
      "tree-of-life",
      "comparative-iconography"
    ],
    "civilisations": [
      "Ancient Egypt"
    ],
    "claims": [
      {
        "sourceKey": "egypt_kv34",
        "startYear": -1449,
        "datePrecision": "year",
        "isApproximate": true,
        "originalDateText": "c. 15th century BCE, reign of Thutmose III",
        "datingMethod": "regnal_chronology",
        "chronology": "historical",
        "evidence": "An Egyptian tree-goddess scene, visually distinct from a connected-sphere diagram. The precise year is not established by this image page.",
        "whatIsDated": "Date of surviving object, diagram, print or published copy"
      }
    ]
  },
  {
    "slug": "nimrud-sacred-tree-relief",
    ...PICTURES["nimrud-sacred-tree-relief"],
    "title": "Stylised sacred trees in Ashurnasirpal II’s palace",
    "summary": "Winged protective figures flank trees. The Met discusses prosperity and protection; interpretation of the cone gesture remains debated.",
    "description": "WHAT SURVIVES. Winged protective figures flank trees. The Met discusses prosperity and protection; interpretation of the cone gesture remains debated.\n\nSOURCE AND DATE. c. 883–859 BCE (Met catalogue). Follow the source link for the image or catalogue record. The date belongs to the object or publication named here. Resemblance to other tree imagery does not establish historical transmission.",
    "category": "archaeology",
    "subcategory": "Sacred trees and diagrams",
    "eventType": "historical",
    "tags": [
      "sacred-tree",
      "tree-of-life",
      "comparative-iconography"
    ],
    "civilisations": [
      "Neo-Assyrian Empire"
    ],
    "claims": [
      {
        "sourceKey": "met_nimrud",
        "startYear": -882,
        "datePrecision": "year",
        "isApproximate": true,
        "originalDateText": "c. 883–859 BCE (Met catalogue)",
        "datingMethod": "regnal_chronology",
        "chronology": "historical",
        "evidence": "Winged protective figures flank trees. The Met discusses prosperity and protection; interpretation of the cone gesture remains debated.",
        "whatIsDated": "Date of surviving object, diagram, print or published copy",
        "endYear": -858
      }
    ]
  },
  {
    "slug": "sefirotic-tree-spain-1284",
    ...PICTURES["sefirotic-tree-spain-1284"],
    "title": "Early sefirotic tree diagram, Spain",
    "summary": "An early surviving Kabbalistic diagram arranged as a wheel; it is not the modern vertical layout.",
    "description": "WHAT SURVIVES. An early surviving Kabbalistic diagram arranged as a wheel; it is not the modern vertical layout.\n\nSOURCE AND DATE. 1284 CE (National Library of Israel). Follow the source link for the image or catalogue record. The date belongs to the object or publication named here. Resemblance to other tree imagery does not establish historical transmission.",
    "category": "archaeology",
    "subcategory": "Sacred trees and diagrams",
    "eventType": "historical",
    "tags": [
      "sacred-tree",
      "tree-of-life",
      "comparative-iconography"
    ],
    "civilisations": [
      "Medieval Jewish Kabbalah"
    ],
    "claims": [
      {
        "sourceKey": "nli_1284",
        "startYear": 1284,
        "datePrecision": "year",
        "isApproximate": false,
        "originalDateText": "1284 CE (National Library of Israel)",
        "datingMethod": "historical_record",
        "chronology": "historical",
        "evidence": "An early surviving Kabbalistic diagram arranged as a wheel; it is not the modern vertical layout.",
        "whatIsDated": "Date of surviving object, diagram, print or published copy"
      }
    ]
  },
  {
    "slug": "portae-lucis-tree-1516",
    ...PICTURES["portae-lucis-tree-1516"],
    "title": "Printed sefirotic tree in Portae Lucis",
    "summary": "The printed title-page image is a datable witness to the sefirotic tree; it is not the date of the underlying tradition.",
    "description": "WHAT SURVIVES. The printed title-page image is a datable witness to the sefirotic tree; it is not the date of the underlying tradition.\n\nSOURCE AND DATE. 1516 CE, Augsburg. Follow the source link for the image or catalogue record. The date belongs to the object or publication named here. Resemblance to other tree imagery does not establish historical transmission.",
    "category": "archaeology",
    "subcategory": "Sacred trees and diagrams",
    "eventType": "historical",
    "tags": [
      "sacred-tree",
      "tree-of-life",
      "comparative-iconography"
    ],
    "civilisations": [
      "Renaissance Kabbalah"
    ],
    "claims": [
      {
        "sourceKey": "cja_1516",
        "startYear": 1516,
        "datePrecision": "year",
        "isApproximate": false,
        "originalDateText": "1516 CE, Augsburg",
        "datingMethod": "historical_record",
        "chronology": "historical",
        "evidence": "The printed title-page image is a datable witness to the sefirotic tree; it is not the date of the underlying tradition.",
        "whatIsDated": "Date of surviving object, diagram, print or published copy"
      }
    ]
  },
  {
    "slug": "kamiti-eleven-sphere-copy-2014",
    ...PICTURES["kamiti-eleven-sphere-copy-2014"],
    "title": "Modern 11-sphere Kamitic tree diagram",
    "summary": "This published copy shows Amen numbered 0 and spheres 1–10. The date is for its modern online appearance, not an ancient Egyptian artifact. Da’at belongs to Kabbalistic terminology.",
    "description": "WHAT SURVIVES. This published copy shows Amen numbered 0 and spheres 1–10. The date is for its modern online appearance, not an ancient Egyptian artifact. Da’at belongs to Kabbalistic terminology.\n\nSOURCE AND DATE. 10 September 2014, dated online copy; original diagram undated. Follow the source link for the image or catalogue record. The date belongs to the object or publication named here. Resemblance to other tree imagery does not establish historical transmission.",
    "category": "archaeology",
    "subcategory": "Sacred trees and diagrams",
    "eventType": "historical",
    "tags": [
      "sacred-tree",
      "tree-of-life",
      "comparative-iconography"
    ],
    "civilisations": [
      "Modern Kemetic spirituality"
    ],
    "claims": [
      {
        "sourceKey": "kamiti_2014",
        "startYear": 2014,
        "datePrecision": "day",
        "isApproximate": false,
        "originalDateText": "10 September 2014, dated online copy; original diagram undated",
        "datingMethod": "historical_record",
        "chronology": "historical",
        "evidence": "This published copy shows Amen numbered 0 and spheres 1–10. The date is for its modern online appearance, not an ancient Egyptian artifact. Da’at belongs to Kabbalistic terminology.",
        "whatIsDated": "Date of surviving object, diagram, print or published copy",
        "startMonth": 9,
        "startDay": 10
      }
    ]
  }
];
