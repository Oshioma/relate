// RELATED PICTURES FOR THE GOSPEL OF THOMAS.
//
// The pages of Nag Hammadi Codex II and the three Oxyrhynchus papyri are on
// their passages already (gospel-of-thomas.ts). These are the related
// evidence and context beside them: where the copies were found, what else
// came out of the same rubbish mounds at Oxyrhynchus, and the ordinary things
// a few sayings name — a gold coin, a shepherd, a sower, the Temple. None is
// a witness to the text, and every caption says what it is.
//
// `passageKey` places a picture on a saying (gnostic.thom.100), the prologue,
// or a Greek version (gnostic.thom.poxy1).

import type { CorpusImage } from "../corpus-types";

export const THOMAS_RELATED_IMAGES: (CorpusImage & { passageKey: string })[] = [
  {
    passageKey: "gnostic.thom.poxy654",
    key: "thom-related-met-reed-pen-oxyrhynchus",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Pen_MET_05.4.162_EGDP020135.jpg",
    sourcePageUrl: "https://www.metmuseum.org/art/collection/search/568206",
    institution: "Metropolitan Museum of Art, New York",
    accessionNumber: "05.4.162",
    objectDate: "30 BCE–364 CE (Roman period)",
    caption:
      "A reed pen, 9.5 cm long, found at Oxyrhynchus in the Egypt Exploration Fund's excavations of 1904–05 and given to the Met in 1905. P. Oxy. 654, the Greek prologue and sayings 1–7, came out of the same town's rubbish mounds in Grenfell and Hunt's 1903 season, written with a pen of this kind. Related evidence: a scribe's tool from the site, not the pen that wrote the papyrus.",
    creator: "Unknown maker",
    credit: "Metropolitan Museum of Art (Open Access), via Wikimedia Commons",
    licence: "CC0 1.0",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "gnostic.thom.poxy1",
    key: "thom-related-poxy2-papyrus1-matthew",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Papyrus_1_-_recto.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Papyrus_1_-_recto.jpg",
    institution: "University of Pennsylvania (as the Commons record gives the source)",
    objectDate: "About 250 CE",
    caption:
      "P. Oxy. 2 (New Testament Papyrus 1), a leaf of the Gospel of Matthew in Greek from Oxyrhynchus, opening with the genealogy of Matthew 1:1 ('The book of the generation of Jesus Christ, the son of David'). Grenfell and Hunt published it in the same first volume, in 1898, as P. Oxy. 1, the Greek sayings of Thomas. Related evidence: the gospels the town's Christians were reading in the same century, not a witness to Thomas.",
    creator: "Unknown scribe",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-old-70); Public Domain Mark 1.0",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "gnostic.thom.poxy655",
    key: "thom-related-map-oxyrhynchus",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Karte_Oxyrhynchos.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Karte_Oxyrhynchos.png",
    imageDate: "2017",
    caption:
      "A modern map (labels in German) of northern Egypt with the Nile, the Delta, Alexandria, Cairo and Oxyrhynchos in Middle Egypt, where all three Greek copies of the Gospel of Thomas — P. Oxy. 1, 654 and 655 — were dug out of the ancient town's rubbish mounds between 1897 and 1903. Context, not evidence about the text.",
    creator: "NordNordWest, after Yomangani",
    credit: "NordNordWest, via Wikimedia Commons",
    licence: "Public domain (released by the author, PD-self)",
    licenceStatus: "open",
    shows: "map",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "gnostic.thom.9",
    key: "thom-related-saint-romain-en-gal-ploughing-and-sowing-mosaic",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/84/Mosaic_depicting_a_rustic_calendar%2C_panel_the_ploughing_and_sowing_of_the_field_%28Autumn%29%2C_from_Saint-Romain-en-Gal%2C_first_quarter_of_3rd_century_AD%2C_Mus%C3%A9e_d%27Arch%C3%A9ologie_Nationale%2C_Saint-Germain-en-Laye_%2834830203271%29.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Mosaic_depicting_a_rustic_calendar%2C_panel_the_ploughing_and_sowing_of_the_field_%28Autumn%29%2C_from_Saint-Romain-en-Gal%2C_first_quarter_of_3rd_century_AD%2C_Mus%C3%A9e_d%27Arch%C3%A9ologie_Nationale%2C_Saint-Germain-en-Laye_%2834830203271%29.jpg",
    institution: "Musée d'Archéologie Nationale, Saint-Germain-en-Laye",
    objectDate: "First quarter of the third century CE",
    caption:
      "A panel of the 'rustic calendar' mosaic from Saint-Romain-en-Gal in Roman Gaul: an autumn scene of a field being ploughed and sown by hand. Saying 9 is the parable of the sower whose seed falls on the road, on rock, among thorns and on good soil. Related evidence: how sowing was done and pictured in the Roman world of the Greek copies of Thomas, not an illustration of the saying.",
    creator: "Unknown Gallo-Roman mosaicist; photograph by Carole Raddato",
    credit: "Carole Raddato, via Flickr and Wikimedia Commons",
    licence: "CC BY-SA 2.0",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "gnostic.thom.100",
    key: "thom-related-ans-aureus-of-tiberius",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Gold_Aureus_of_Tiberius%2C_Lugdunum_%28MANTIS%29.jpg",
    sourcePageUrl: "https://numismatics.org/collection/1944.100.39239",
    institution: "American Numismatic Society, New York",
    accessionNumber: "1944.100.39239",
    objectDate: "About 16 CE (struck at Lugdunum)",
    caption:
      "A gold aureus of the emperor Tiberius, struck at Lugdunum (Lyon), with his laureate head and the legend TI CAESAR DIVI AVG F AVGVSTVS. In saying 100 Jesus is shown a gold coin and told that Caesar's men demand taxes; the canonical gospels tell the story with a silver denarius. A coin of the emperor of Jesus's lifetime, of the kind the saying names; related evidence, not the coin in the story.",
    creator: "Roman imperial mint at Lugdunum",
    credit: "American Numismatic Society, via Wikimedia Commons",
    licence: "CC0 1.0",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "gnostic.thom.107",
    key: "thom-related-vatican-good-shepherd-statuette",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Marble_statue_of_The_Good_Shepherd_from_the_Catacombs_of_Domitilla_full%2C_Vatican_Museums.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Marble_statue_of_The_Good_Shepherd_from_the_Catacombs_of_Domitilla_full,_Vatican_Museums.jpg",
    institution: "Vatican Museums (Museo Pio Cristiano)",
    accessionNumber: "28590",
    objectDate: "About 300–350 CE",
    imageDate: "2016",
    caption:
      "A marble statuette of a young shepherd carrying a sheep on his shoulders, from a Roman catacomb (Commons names both Domitilla and Callixtus), now in the Vatican. Saying 107 is the parable of the shepherd who leaves ninety-nine sheep to look for the one that went astray, which in Thomas is the largest and the one he loves most. Related evidence: how Christians of the century after the Greek copies of Thomas pictured the shepherd.",
    creator: "Unknown Roman sculptor; photograph by Carole Raddato",
    credit: "Carole Raddato, via Flickr and Wikimedia Commons",
    licence: "CC BY-SA 2.0",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "gnostic.thom.prologue",
    key: "thom-related-map-nag-hammadi",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Eg-NagHamadi-map.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Eg-NagHamadi-map.png",
    caption:
      "A modern outline map of Egypt marking Nag Hammadi on the Nile in Upper Egypt, north of Luxor. Near here, in 1945, farmers dug up the jar of thirteen leather-bound Coptic codices; the Gospel of Thomas, the only complete copy, is the second treatise of Codex II. Context for where the text was found, not evidence about the text.",
    creator: "Based on the CIA World Factbook map of Egypt (uploaded by Quadell)",
    credit: "CIA World Factbook, via Wikimedia Commons",
    licence: "Public domain (PD-USGov-CIA-WF)",
    licenceStatus: "open",
    shows: "map",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "gnostic.thom.71",
    key: "thom-related-arch-of-titus-spoils-of-the-temple",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/17/Carrying_off_the_Menorah_from_the_Temple_in_Jerusalem_depicted_on_a_frieze_on_the_Arch_of_Titus_in_the_Forum_Romanum.JPG",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Carrying_off_the_Menorah_from_the_Temple_in_Jerusalem_depicted_on_a_frieze_on_the_Arch_of_Titus_in_the_Forum_Romanum.JPG",
    institution: "Arch of Titus, Forum Romanum, Rome (in situ)",
    objectDate: "After 81 CE",
    imageDate: "2010",
    caption:
      "The relief inside the Arch of Titus in Rome: Roman soldiers carry the seven-branched lampstand and other spoils from the Temple in Jerusalem, destroyed in 70 CE, in Titus's triumph. In saying 71 Jesus says, 'I will destroy [this] house, and no one will be able to build it [...]' (the end is lost), a house often read as the Temple. Related evidence for the Temple's destruction, which the saying's readers knew had happened; not an illustration of the saying.",
    creator: "Unknown Roman sculptors; photograph by Laurel Lodged",
    credit: "Laurel Lodged, via Wikimedia Commons",
    licence: "Public domain (released by the photographer)",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];
