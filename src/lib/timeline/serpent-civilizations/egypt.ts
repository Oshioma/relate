// LANE: EGYPTIAN SERPENT RELIGION (see SERPENT_LANES.egypt in ./shared.ts).
//
// What this section is for. The question of the track is whether Egyptian
// serpent religion could stand behind the serpent traditions of Dan or of the
// Gbe coast. Before that can be asked, the Egyptian side has to be laid out on
// its own terms: which serpents, on which objects and in which texts, at which
// dates. This lane does that and nothing more. It does not compare; the
// comparisons live in the rituals and assessment lanes and are linked from
// here.
//
// HOW IT WAS RESEARCHED. Commons file pages were fetched one by one in this
// session and their licence, author and museum metadata (Met, Brooklyn, Turin,
// Louvre, Walters open-access data copied onto the file pages) were read from
// the page. The museum websites themselves (Met, Brooklyn, British Museum,
// UCL Digital Egypt) refused this machine (429, 403 or a browser check, which
// was not bypassed), so museum facts here come from the Commons copies of
// their data, and statements that rest only on search-engine summaries say
// NEEDS SOURCE VERIFICATION. Primary texts are quoted only from public-domain
// translations already in, or freshly fetched for, this repository: Mercer's
// Pyramid Texts (short quotations), Budge's Papyrus of Ani (1895), Renouf and
// Naville's Book of the Dead (1904, Project Gutenberg 69566), Budge's Egyptian
// Heaven and Hell (1905) for the Amduat and the Book of Gates, and Macaulay's
// Herodotus (1890). The one modern scientific paper read in full is Johnston
// et al. 2020 (open access, via Europe PMC).
//
// WHAT THIS SECTION WILL NOT DO. Call the Egyptian cobra a python; fold Wadjet,
// the uraeus, Apep, Mehen and Nehebkau into one "serpent god"; call the Opet
// festival a serpent festival; or let a resemblance to anything in the Gbe or
// Israelite lanes stand as evidence of contact.

import type { SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { SERPENT_LANES, SERPENT_LANE_ANCHORS, bce, commonsPicture, serpentTags, type SerpentSection } from "./shared";

const LANE = "egypt" as const;
const SUB = SERPENT_LANES.egypt;
const ANCHOR = SERPENT_LANE_ANCHORS.egypt;
const A = SERPENT_LANE_ANCHORS;

const commonsPage = (fileName: string) => `https://commons.wikimedia.org/wiki/File:${fileName.replace(/ /g, "_")}`;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- Objects and museum records (read through their Commons copies) -------
  {
    key: "met_55_144_6_shabaqo_donation_stela",
    title: "Donation Stela of Shabaqo (Metropolitan Museum of Art 55.144.6)",
    publisher: "Metropolitan Museum of Art, New York (open-access record copied to Wikimedia Commons)",
    reference: "Accession 55.144.6; regnal year 6 of Shabaqo, 25th Dynasty",
    url: "https://www.metmuseum.org/art/collection/search/544880",
    sourceType: "museum",
    publishedDisplay: "object c. 710s BCE; record online",
    notes:
      "Cited for a dated royal document in which the king offers to Wadjet and to Horus of Pe, the two gods of Buto: a fixed point showing Wadjet still worshipped as the goddess of Buto under a Kushite king of Egypt. The accession number, date and description were read on the Commons file page, which copies the Met's CC0 record; the Met site itself refused this machine.",
  },
  {
    key: "bm_ea_55586_den_sandal_label",
    title: "Sandal label of King Den, ivory, Abydos (British Museum EA 55586)",
    publisher: "British Museum, London (collection online)",
    reference: "Museum number EA 55586",
    url: "https://www.britishmuseum.org/collection/object/Y_EA55586",
    sourceType: "museum",
    publishedDisplay: "object c. 2950 BCE; record online",
    notes:
      "Cited for the British Museum's own description of the label: Den wears an archaic royal headcloth with the rearing neck and head of a uraeus cobra at his forehead. NEEDS SOURCE VERIFICATION: the Museum's page returned 403 to this machine and its wording was seen only as quoted in a search result.",
  },
  {
    key: "cairo_je_46694_senusret_ii_uraeus",
    title: "Gold uraeus of Senusret II from the pyramid at el-Lahun (Egyptian Museum, Cairo, JE 46694)",
    publisher: "Egyptian Museum, Cairo; photographed in the touring exhibition at La Villette, Paris, 2023 (Wikimedia Commons)",
    reference: "Inventory JE 46694, as given on the Commons file page",
    url: commonsPage("Uraeus provenant d'une couronne royale de Sesostris II (la Villette, 2023).jpg"),
    sourceType: "museum",
    publishedDisplay: "object 12th Dynasty, c. 1880s BCE; found 1919 or 1920",
    notes:
      "Cited for the object itself: a solid gold uraeus with inlays, the crown ornament of a Middle Kingdom king, found in the debris of his pyramid. Inventory number from the Commons file page. The circumstances of discovery (year and finder) differ between accounts and are carried as separate claims.",
  },
  {
    key: "brooklyn_47_218_48_snake_papyrus",
    title: "Papyrus roll, Brooklyn Museum 47.218.48a–f (with 47.218.85, the treatise on snakes and snakebite)",
    publisher: "Brooklyn Museum, Bequest of Theodora Wilbour from the collection of her father, Charles Edwin Wilbour (record copied to Wikimedia Commons)",
    reference: "Accession 47.218.48a–f; Brooklyn date 664–332 BCE; papyrus, ink",
    url: commonsPage("Roll, 664 - 332 B.C.E. Brooklyn Papyrus 47.218.48a-f.jpg"),
    sourceType: "museum",
    publishedDisplay: "papyrus Late Period; Brooklyn record online",
    notes:
      "Cited for the museum's own identification and dating of the papyrus that carries the Egyptian ophiological treatise. The Brooklyn title is only 'Roll'; that this roll is the snake treatise rests on the accession number matching Sauneron's edition. The Brooklyn site refused this machine, so the record was read through Commons.",
  },
  {
    key: "brooklyn_47_218_3_saite_oracle_papyrus",
    title: "Saite Oracle Papyrus, 4 October 651 BCE (Brooklyn Museum 47.218.3a–j)",
    publisher: "Brooklyn Museum, Bequest of Theodora Wilbour from the collection of her father, Charles Edwin Wilbour (record copied to Wikimedia Commons)",
    reference: "Accession 47.218.3a–j; papyrus, pigment; frame 43.5 × 128 cm",
    url: commonsPage("Saite Oracle Papyrus, October 4, 651 B.C.E., 47.218.3a-j.jpg"),
    sourceType: "museum",
    publishedDisplay: "651 BCE; record online",
    notes:
      "Cited for a dated record of a consultation of Amun-Re's oracle at Thebes: the petition of Pemou for his father Harsiese to move from Amun's priesthood to Montu's, with the god's barque drawn carried by priests. Date and accession from the Brooklyn record as copied to Commons.",
  },
  {
    key: "met_50_85_metternich_stela",
    title: "Magical Stela (Cippus of Horus), the 'Metternich Stela' (Metropolitan Museum of Art 50.85)",
    publisher: "Metropolitan Museum of Art, New York (open-access record copied to Wikimedia Commons)",
    reference: "Accession 50.85; Late Period, Dynasty 30, reign of Nectanebo II, 360–343 BCE",
    url: commonsPage("Magical Stela (Cippus of Horus) MET DP319007.jpg"),
    sourceType: "museum",
    publishedDisplay: "object 360–343 BCE; record online",
    notes:
      "Cited for the object, its accession number and the Met's date (reign of Nectanebo II), read on the Commons file pages that copy the Met's CC0 data. The Met's own page could not be opened from this machine.",
  },
  {
    key: "met_04_2_517_snake_mummy_box",
    title: "Box for an animal mummy surmounted by a coiled, rearing snake (Metropolitan Museum of Art 04.2.517)",
    publisher: "Metropolitan Museum of Art, New York (open-access record copied to Wikimedia Commons)",
    reference: "Accession 04.2.517; Late Period–Ptolemaic Period, 664–30 BCE",
    url: commonsPage("Box for an animal mummy surmounted by a coiled, rearing snake MET 04.2.517 EGDP014658.jpg"),
    sourceType: "museum",
    publishedDisplay: "object 664–30 BCE",
    notes:
      "Cited for a bronze container for a snake mummy with a rearing cobra on its lid, dated by the Met to the Late–Ptolemaic period. Read through the Commons copy of the Met record.",
  },
  {
    key: "museo_egizio_snake_coffins",
    title: "Coffins for snakes and snake mummies, Museo Egizio, Turin (Cat. 2402/01, Cat. 7380, Provv. 1441)",
    publisher: "Museo Egizio, Turin (catalogue records copied to Wikimedia Commons under CC0)",
    reference: "Cat. 2402/01 (coffin containing a mummy); Cat. 7380 (wooden coffin with sliding lid); Provv. 1441 (rectangular snake mummy package)",
    url: commonsPage("Coffin for a snake containing a mummy - Museo Egizio (Turin) C 2402 01 p01.jpg"),
    sourceType: "museum",
    publishedDisplay: "objects undated on the Commons pages",
    notes:
      "Cited for the Turin museum's own descriptions of snake coffins and a wrapped snake mummy: a coffin whose lid carries a serpent coiled in a figure of eight with a separately made rearing cobra head, a coffin with a sliding lid and an empty cavity for the mummy, and a coffered linen package. The Commons pages give no dates for these pieces, so none is asserted here.",
  },
  {
    key: "walters_48_1615_nehebkau",
    title: "Neheb-kau, figure (Walters Art Museum 48.1615)",
    publisher: "Walters Art Museum, Baltimore (record copied to Wikimedia Commons)",
    reference: "Accession 48.1615; Third Intermediate Period, between 1070 and 730 BCE",
    url: commonsPage("Egyptian - Neheb-kau - Walters 481615.jpg"),
    sourceType: "museum",
    publishedDisplay: "object 1070–730 BCE",
    notes:
      "Cited for a museum's description of Nehebkau as a serpent-god counted among the 42 judges of the Book of the Dead and as a provider of nourishment to the dead, together with a dated figure of him.",
  },
  {
    key: "bm_ea_9901_hunefer",
    title: "Book of the Dead of Hunefer (British Museum EA 9901)",
    publisher: "British Museum, London (object data copied to Wikimedia Commons)",
    reference: "EA 9901, sheet with the Opening of the Mouth vignette; 19th Dynasty, c. 1275 BCE",
    url: commonsPage("Opening of the mouth ceremony.jpg"),
    sourceType: "museum",
    publishedDisplay: "papyrus c. 1275 BCE",
    notes:
      "Cited for the papyrus whose vignettes show the Opening of the Mouth at the tomb door and the sun-cat cutting the head off the serpent. Museum number and date as given on the Commons file pages.",
  },
  {
    key: "bm_ea_10188_bremner_rhind",
    title: "Papyrus Bremner-Rhind, papyrus of Nesmin (British Museum EA 10188)",
    publisher: "British Museum, London (collection online)",
    reference: "EA 10188; 'Book of Overthrowing Apep' at cols 22–32, 'Names of Apep' at cols 32–33",
    url: "https://www.britishmuseum.org/collection/object/Y_EA10188-13",
    sourceType: "museum",
    publishedDisplay: "papyrus c. 305 BCE (colophon); bought 1865",
    notes:
      "Cited for the content and division of the papyrus (the Songs of Isis and Nephthys, the ritual of bringing in Sokar, the Book of Overthrowing Apep and the Names of Apep), its scribe Nesmin, its find at Thebes, its sale to the Museum by David Bremner in 1865 and the Museum's production date of 305 BCE from the colophon. NEEDS SOURCE VERIFICATION: the BM page returned 403 here and was read only as quoted in a search result.",
  },

  // ---- Primary texts in public-domain translation -----------------------------
  {
    key: "mercer_1952_pyramid_texts",
    title: "The Pyramid Texts in Translation and Commentary",
    author: "Samuel A. B. Mercer",
    publisher: "Longmans, Green, New York (as published by sacred-texts.com and held in this site's text archive)",
    reference: "Chapter 6, 'Mostly serpent charms, utterances 226–243'; Sethe's paragraph numbers as Mercer prints them",
    url: "https://sacred-texts.com/egy/pyt/index.htm",
    sourceType: "religious_text",
    publishedYear: 1952,
    publishedDisplay: "texts carved c. 2350–2180 BCE; translation 1952",
    notes:
      "Cited for the serpent charms carved in the pyramid of Unas and later Old Kingdom pyramids, for the mention of the Nehebkau serpent in utterance 229 and of the uraeus in utterance 240. Only short quotations are given, because Mercer's translation may still be in copyright in some jurisdictions; the full text is in the site's ancient-texts archive under 'pyramid-texts'.",
  },
  {
    key: "budge_1895_papyrus_of_ani",
    title: "The Book of the Dead: The Papyrus of Ani in the British Museum",
    author: "E. A. Wallis Budge",
    publisher: "British Museum, London (as published by sacred-texts.com and held in this site's text archive)",
    reference: "Chapter LXXXVII, plate XXVII, p. 337; the list of Theban chapters, pp. xxxi–xlvi",
    url: "https://sacred-texts.com/egy/ebod/index.htm",
    sourceType: "religious_text",
    publishedYear: 1895,
    publishedDisplay: "papyrus c. 1250 BCE; translation 1895",
    notes:
      "Cited for Budge's public-domain translation of BD 87 (the transformation into the serpent Sata) from the Papyrus of Ani, and for his English titles of BD 7, 39 and 108. A dated Victorian translation, quoted as the oldest freely reproducible rendering, not as the best.",
  },
  {
    key: "renouf_naville_1904_book_of_the_dead",
    title: "The Egyptian Book of the Dead: Translation and Commentary",
    author: "P. Le Page Renouf and Édouard Naville",
    publisher: "Society of Biblical Archaeology, London (Project Gutenberg e-text 69566)",
    reference: "Chapters VII, XXXIX and CVIII with Renouf's notes",
    url: "https://www.gutenberg.org/ebooks/69566",
    sourceType: "religious_text",
    publishedYear: 1904,
    publishedDisplay: "spells New Kingdom and later; translation 1904",
    notes:
      "Cited for public-domain English translations of the three Book of the Dead chapters in which a great serpent is repelled: 7 (Apep), 39 (Rerek/Apep) and 108 (the serpent on the Hill of Bakhu). Renouf's notes reflect nineteenth-century nature-mythology readings (Apep as storm-cloud) that are not current scholarship; the translations are quoted, the interpretations are not adopted.",
  },
  {
    key: "budge_1905_egyptian_heaven_and_hell",
    title: "The Egyptian Heaven and Hell",
    author: "E. A. Wallis Budge",
    publisher: "Kegan Paul, Trench, Trübner, London (3 vols; held in this site's text archive)",
    reference: "Vol. I, ch. VII (the seventh hour of the Amduat), pp. 140–146; vol. II, chs. III–VI (the gates of the Book of Gates), pp. 85–87, 100–103, 139",
    url: "https://archive.org/details/egyptianheavenhe02budg",
    sourceType: "religious_text",
    publishedYear: 1905,
    publishedDisplay: "texts New Kingdom; translation 1905",
    notes:
      "Cited for public-domain translations of the seventh hour of the Amduat (Ra under the canopy of the serpent Mehen; the serpent Neha-hra, i.e. Apep, transfixed with knives and strangled by Serqet) and of the gate-serpents of the Book of Gates (Saa-set, Aqebi, Teka-hra). Budge's transliterations are old-fashioned; the scenes he describes are those on the sarcophagus of Seti I and in the royal tombs.",
  },
  {
    key: "herodotus_macaulay_histories",
    title: "The History of Herodotus",
    author: "Herodotus, translated by G. C. Macaulay",
    publisher: "Macmillan, London (1890); Project Gutenberg e-text",
    reference: "Book 2, chapters 83 and 155–156",
    url: "https://www.gutenberg.org/ebooks/2707",
    sourceType: "primary",
    publishedDisplay: "written c. 430s BCE; translation 1890",
    notes:
      "Cited for a fifth-century BCE Greek visitor's statement that the oracle Egyptians 'hold most in honour of all' was 'the Oracle of Leto which is in the city of Buto', and for his description of its precinct. Herodotus names the goddess Leto, not Wadjet, and says nothing about a serpent there: the equation of Leto with Wadjet (Greek 'Uto' or 'Buto') is a modern reading of Greek usage.",
  },

  // ---- Scholarship -------------------------------------------------------------
  {
    key: "johnson_1990_cobra_goddess",
    title: "The Cobra Goddess of Ancient Egypt: Predynastic, Early Dynastic, and Old Kingdom Periods",
    author: "Sally B. Johnson",
    publisher: "Kegan Paul International, London and New York (Studies in Egyptology)",
    reference: "xxv + 276 pp., drawings by Victoria Solia; bibliographic details from the ARCE library catalogue",
    url: "https://library.arce.org/portal/Record/2077",
    sourceType: "academic_book",
    publishedYear: 1990,
    publishedDisplay: "1990",
    notes:
      "THE SPECIALIST MONOGRAPH on the cobra goddess and the uraeus before the Middle Kingdom, cited as the place where the earliest royal uraei and the early Wadjet material are catalogued. Not opened in this session (out of print; no review was found). NEEDS SOURCE VERIFICATION for anything this record attributes to it beyond its scope.",
  },
  {
    key: "sauneron_1989_traite_ophiologie",
    title: "Un traité égyptien d'ophiologie: Papyrus du Brooklyn Museum nos 47.218.48 et .85",
    author: "Serge Sauneron",
    publisher: "Institut français d'archéologie orientale, Cairo (Bibliothèque générale 11)",
    reference: "Posthumous edition of the Brooklyn snake papyrus",
    sourceType: "academic_book",
    publishedYear: 1989,
    publishedDisplay: "1989",
    notes:
      "THE EDITION of the Brooklyn treatise on snakes, cited for its structure: a catalogue of serpents (with the gods each is associated with and the effects of its bite) followed by remedies used by the 'controller of Serqet'. Bibliographic details and the outline of contents were confirmed from catalogue and citing records in this session; the book itself was not opened. NEEDS SOURCE VERIFICATION for the exact count of species and for page references.",
  },
  {
    key: "anthropozoologica_2012_brooklyn_snakebite",
    title: "Symptomatologie des morsures d'ophidiens d'après le papyrus Brooklyn nos 47.218.48 et 85: aspects épistémologiques d'un texte égyptien ancien recopié au IVe siècle avant notre ère",
    publisher: "Anthropozoologica 47 (1)",
    reference: "Anthropozoologica 47 (1), 2012; DOI 10.5252/az2012n1a6",
    url: "https://doi.org/10.5252/az2012n1a6",
    sourceType: "academic_paper",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "Cited for a more recent reading of the treatise's symptom descriptions and for its dating of the surviving copy to the fourth century BCE, with the question of when the text was first composed kept open. The publisher's page refused this machine; title, journal and dating were read in search records only. NEEDS SOURCE VERIFICATION for author and argument.",
  },
  {
    key: "von_kanel_1984_pretres_serket",
    title: "Les prêtres-ouâb de Sekhmet et les conjurateurs de Serket",
    author: "Frédérique von Känel",
    publisher: "Presses universitaires de France, Paris (Bibliothèque de l'École des Hautes Études, Sciences religieuses 87)",
    reference: "The study of the title ḫrp Srqt, 'controller (conjurer) of Serqet'",
    sourceType: "academic_book",
    publishedYear: 1984,
    publishedDisplay: "1984",
    notes:
      "THE STANDARD STUDY of the kherep-Serqet, the Serqet-conjurers who dealt with snake and scorpion bite, cited for the title's range from the Old Kingdom to the Late Period. Known here through citing works (UCL Digital Egypt's list of healing titles, as summarised in search results). NEEDS SOURCE VERIFICATION for the earliest attestation and for page numbers.",
  },
  {
    key: "scott_1951_metternich_stela",
    title: "The Metternich Stela",
    author: "Nora E. Scott",
    publisher: "The Metropolitan Museum of Art Bulletin, new series 9 (8)",
    reference: "MMA Bulletin n.s. 9 no. 8 (April 1951), pp. 201–217",
    sourceType: "academic_paper",
    publishedYear: 1951,
    publishedDisplay: "1951",
    notes:
      "Cited as the Met's publication of the stela on its acquisition in 1950: the object, its history from Alexandria to Metternich's castle at Kynžvart, and an English translation of its spells against snakes and scorpions. Bibliographic details from memory of the standard citation and catalogue records; the article was not opened. NEEDS SOURCE VERIFICATION for pages.",
  },
  {
    key: "johnston_2020_mummified_animals",
    title: "Evidence of diet, deification, and death within ancient Egyptian mummified animals",
    author: "Richard Johnston, Richard Thomas, Rhys Jones, Carolyn Graves-Brown, Wendy Goodridge and Laura North",
    publisher: "Scientific Reports 10, article 14113",
    reference: "Sci Rep 10:14113 (20 August 2020); DOI 10.1038/s41598-020-69726-0; open access, read in full via Europe PMC (PMC7441183)",
    url: "https://doi.org/10.1038/s41598-020-69726-0",
    sourceType: "scientific_study",
    publishedYear: 2020,
    publishedDisplay: "2020",
    notes:
      "Cited for an X-ray micro-CT study of a snake mummy (Egypt Centre, Swansea, EC308) identified as a juvenile Egyptian cobra (Naja haje) with calcified kidneys suggesting it was kept short of water, killed by a 'whipping' action that broke its spine and skull, with material (probably natron) lodged at the glottis and the jaw held open, which the authors read as possible evidence of an 'opening of the mouth' procedure. The specimen has no recorded provenance or date.",
  },
  {
    key: "ikram_2005_divine_creatures",
    title: "Divine Creatures: Animal Mummies in Ancient Egypt",
    author: "Salima Ikram (ed.)",
    publisher: "American University in Cairo Press, Cairo",
    reference: "Ikram's introduction and classification of animal mummies (pets, victuals, sacred animals, votive offerings and others)",
    sourceType: "academic_book",
    publishedYear: 2005,
    publishedDisplay: "2005",
    notes:
      "Cited for the standard classification of Egyptian animal mummies, as summarised and used by Johnston et al. 2020: the categories that separate a sacred animal kept and buried as the god's living image from the mass votive mummies offered by pilgrims. Not opened in this session; cited through Johnston et al.",
  },
  {
    key: "roth_1993_opening_of_the_mouth",
    title: "Fingers, Stars, and the 'Opening of the Mouth': The Nature and Function of the nṯrwj-Blades",
    author: "Ann Macy Roth",
    publisher: "Journal of Egyptian Archaeology 79",
    reference: "JEA 79 (1993), pp. 57–79",
    url: "https://gizamedia.rc.fas.harvard.edu/images/MFA-images/Giza/GizaImage/full/library/roth_jea_79_1993.pdf",
    sourceType: "academic_paper",
    publishedYear: 1993,
    publishedDisplay: "1993",
    notes:
      "Cited for the argument that the central act of the Opening of the Mouth imitates clearing a newborn's mouth, and that the adze entered the ritual from the statue ritual in the Sixth Dynasty, with older implements kept alongside newer ones. The PDF could not be downloaded here (proxy 502); its argument was read in summary. NEEDS SOURCE VERIFICATION for page references and for the serpent-headed wr-ḥkꜣw implement.",
  },
  {
    key: "faulkner_1933_bremner_rhind",
    title: "The Papyrus Bremner-Rhind (British Museum No. 10188)",
    author: "R. O. Faulkner",
    publisher: "Fondation Égyptologique Reine Élisabeth, Brussels (Bibliotheca Aegyptiaca 3)",
    reference: "Hieroglyphic transcription; English translation of the Apep book in JEA 22 (1936) pp. 121–140 and later parts",
    sourceType: "academic_book",
    publishedYear: 1933,
    publishedDisplay: "1933 (text); 1936–38 (translation in JEA)",
    notes:
      "THE EDITION of the Book of Overthrowing Apep, cited for the text and its ritual instructions (making and destroying images of Apep). Bibliographic details confirmed from the Open Library record and the BM's bibliography as summarised in search results; not opened here.",
  },
  {
    key: "piccione_1990_mehen",
    title: "Mehen, Mysteries, and Resurrection from the Coiled Serpent",
    author: "Peter A. Piccione",
    publisher: "Journal of the American Research Center in Egypt 27",
    reference: "JARCE 27 (1990), pp. 43–52",
    sourceType: "academic_paper",
    publishedYear: 1990,
    publishedDisplay: "1990",
    notes:
      "THE KEY ARTICLE linking the coiled serpent Mehen of the Coffin Texts (spells 758–760, the 'secret form' of Mehen through which the dead are reborn) with the Old Kingdom Mehen board game. Bibliographic details confirmed from several citing works; the article itself was not opened. NEEDS SOURCE VERIFICATION for specific spell readings.",
  },
  {
    key: "hornung_1999_books_of_the_afterlife",
    title: "The Ancient Egyptian Books of the Afterlife",
    author: "Erik Hornung, translated by David Lorton",
    publisher: "Cornell University Press, Ithaca",
    reference: "Chapters on the Amduat and the Book of Gates (their dates, first attestations and the guarded gates)",
    sourceType: "academic_book",
    publishedYear: 1999,
    publishedDisplay: "German 1997; English 1999",
    notes:
      "THE STANDARD HANDBOOK to the New Kingdom underworld books, cited for the dating of the Book of Gates (first in the tomb of Horemheb, complete on the sarcophagus of Seti I) and the Amduat, and for the gate-serpents. Not opened here; cited at chapter level.",
  },
  {
    key: "epigraphic_survey_1994_opet_oip112",
    title: "Reliefs and Inscriptions at Luxor Temple, Volume 1: The Festival Procession of Opet in the Colonnade Hall",
    author: "The Epigraphic Survey (Oriental Institute, University of Chicago)",
    publisher: "Oriental Institute, Chicago (OIP 112)",
    reference: "Plates 1–128 and text booklet with translations and commentary",
    url: "https://isac.uchicago.edu/node/3142",
    sourceType: "academic_book",
    publishedYear: 1994,
    publishedDisplay: "1994",
    notes:
      "THE FACSIMILE PUBLICATION of the Opet reliefs in the Luxor colonnade, cited for the fact that the reliefs are principally of the reign of Tutankhamun and show the barques of the Theban triad and the king travelling between Karnak and Luxor, with texts including the songs of the military escort. Bibliographic and content details from the ISAC and Yale catalogue descriptions; the plates were not opened. The publication is freely downloadable from ISAC.",
  },
  {
    key: "darnell_2010_opet_festival",
    title: "Opet Festival",
    author: "John Coleman Darnell",
    publisher: "UCLA Encyclopedia of Egyptology",
    reference: "UEE, Los Angeles, 2010 (open access on eScholarship)",
    sourceType: "academic_paper",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Cited for the festival's calendar (beginning on II Akhet 15 under Thutmose III and lasting 11 days, citing Sethe's Urkunden; 24 days by the beginning of Ramesses III's reign) and its character as a festival of Amun-Re's procession from Karnak to Luxor. Known here through the quotation in a reference work; NEEDS SOURCE VERIFICATION against the UEE text.",
  },
  {
    key: "klotz_2012_caesar_city_of_amun",
    title: "Caesar in the City of Amun: Egyptian Temple Construction and Theology in Roman Thebes",
    author: "David Klotz",
    publisher: "Brepols, Turnhout (Monographies Reine Élisabeth 15)",
    reference: "Chapters on Djeme (Medinet Habu), Kematef and the Ogdoad",
    sourceType: "academic_book",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "Cited for the late theology of Thebes in which Amun as the primordial serpent Kematef was held to rest at Djeme (the small temple of Medinet Habu) as father of the Ogdoad, and for the god's visit across the river about every ten days to make offerings to them. Known here through citing articles; not opened. NEEDS SOURCE VERIFICATION for the passages.",
  },
  {
    key: "sethe_1929_amun_acht_urgotter",
    title: "Amun und die acht Urgötter von Hermopolis",
    author: "Kurt Sethe",
    publisher: "Abhandlungen der Preussischen Akademie der Wissenschaften, Phil.-hist. Klasse, Berlin",
    reference: "1929, no. 4",
    sourceType: "academic_book",
    publishedYear: 1929,
    publishedDisplay: "1929",
    notes:
      "THE CLASSIC STUDY of the Ogdoad and of Kematef, cited for the history of the idea that the four primeval couples (frog-headed gods, snake-headed goddesses) and the serpent Kematef were buried at Medinet Habu. Not opened in this session; the title could not be confirmed against a catalogue record here. NEEDS SOURCE VERIFICATION.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every file page fetched and read in this session)
// ---------------------------------------------------------------------------

const P = {
  louvreCobraStele: commonsPicture({
    fileName: "Stele cobra goddess Louvre N4193.jpg",
    caption: "Limestone stela with the cobra goddess in the upper register and snakes below, New Kingdom (c. 1550–1069 BCE). Louvre, N 4193. A votive object: it shows that cobras were addressed as divine beings, not which goddess the dedicator named.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY 2.5",
    institution: "Musée du Louvre",
    accessionNumber: "N 4193",
    objectDate: "New Kingdom, c. 1550–1069 BCE",
    subject: "Cobra goddess and snakes on a votive stela",
  }),
  turinSnakeCoffin: commonsPicture({
    fileName: "Coffin for a snake containing a mummy - Museo Egizio (Turin) C 2402 01 p01.jpg",
    caption: "Wooden coffin for a snake, still containing its mummy. The lid carries a serpent coiled in a figure of eight and a separately made rearing cobra head. Museo Egizio, Turin, Cat. 2402/01; undated on the museum record.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Museo Egizio, Turin",
    accessionNumber: "Cat. 2402/01",
    subject: "Snake coffin with mummy",
  }),
  brooklynPapyrusA: commonsPicture({
    fileName: "Brooklyn Papyrus, 664 - 332 B.C.E., 47.218.48a.jpg",
    caption: "Fragment a of Brooklyn Museum papyrus 47.218.48a–f, the roll that carries the Egyptian treatise on snakes and snakebite (with 47.218.85). Hieratic, Late Period (Brooklyn: 664–332 BCE). Which column of the treatise this frame shows is not stated on the record.",
    shows: "manuscript",
    identificationStatus: "secure",
    licence: "No restrictions",
    creator: "Charles Edwin Wilbour (collector, as credited on the file page)",
    institution: "Brooklyn Museum",
    accessionNumber: "47.218.48a",
    objectDate: "664–332 BCE (Brooklyn Museum)",
    subject: "Brooklyn papyrus on snakes",
  }),
  brooklynPapyrusRoll: commonsPicture({
    fileName: "Roll, 664 - 332 B.C.E. Brooklyn Papyrus 47.218.48a-f.jpg",
    caption: "The Brooklyn snake papyrus roll, 47.218.48a–f, under glass. Hieratic, Late Period (Brooklyn: 664–332 BCE).",
    shows: "manuscript",
    identificationStatus: "secure",
    licence: "No restrictions",
    institution: "Brooklyn Museum",
    accessionNumber: "47.218.48a–f",
    objectDate: "664–332 BCE (Brooklyn Museum)",
    subject: "Brooklyn papyrus on snakes",
  }),
  nyuserreWadjet: commonsPicture({
    fileName: "Pharaoh Nyuserre Ini protected by Wadjet and receives life from Anubis. Painted wall fragment from the mortuary temple of Nyuserre Ini at Abusir. Neues Museum.jpg",
    caption: "Painted relief fragment from the mortuary temple of Nyuserre Ini at Abusir: the king protected by Wadjet and receiving life from Anubis. Old Kingdom, 5th Dynasty, 25th century BCE. Neues Museum, Berlin.",
    shows: "artefact",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "Osama Shukir Muhammed Amin FRCP(Glasg)",
    institution: "Neues Museum, Berlin",
    objectDate: "5th Dynasty, 25th century BCE",
    subject: "Wadjet protecting the king",
    provenanceNotes: "The identification of the goddess as Wadjet is the uploader's and the museum label's; the accession number is not given on the file page.",
  }),
  butoMound: commonsPicture({
    fileName: "Ruins of mudbrick buildings on the northern mound of Buto-Desouk.jpg",
    caption: "Mudbrick ruins on the northern mound of Buto (Tell el-Fara'in), the ancient twin towns Pe and Dep, Wadjet's cult centre. Photograph 2010.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Faris knight",
    subject: "Buto, Tell el-Fara'in",
  }),
  shabaqoStela: commonsPicture({
    fileName: "Stela Shabaqo Met.jpg",
    caption: "Donation stela of Shabaqo, regnal year 6, 25th Dynasty (c. 710s BCE): the king offers a field to Wadjet and to Horus of Pe, the gods of Buto. Hieratic text. Metropolitan Museum of Art 55.144.6.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Metropolitan Museum of Art, New York",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "55.144.6",
    objectDate: "Year 6 of Shabaqo, 25th Dynasty",
    subject: "Wadjet and Horus of Pe",
  }),
  menatWadjyt: commonsPicture({
    fileName: "Menat Counterpoise with an Image of Wadjyt MET 26.7.1035 EGDP019578.jpg",
    caption: "Menat counterpoise with an image of Wadjet, Third Intermediate Period (c. 1070–664 BCE). Metropolitan Museum of Art 26.7.1035.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "26.7.1035",
    objectDate: "c. 1070–664 BCE",
    subject: "Wadjet",
  }),
  pennWadjet: commonsPicture({
    fileName: "Cobra (Wadjet) of painted wood from Thebes Egypt 945-712 BCE Dynasty 22 Penn Museum.jpg",
    caption: "Painted wooden cobra identified as Wadjet, from Thebes, 22nd Dynasty (c. 945–712 BCE). Penn Museum, Philadelphia; accession number not given on the file page.",
    shows: "artefact",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "Mary Harrsch",
    institution: "Penn Museum",
    objectDate: "22nd Dynasty",
    subject: "Wooden cobra figure",
  }),
  denLabelBM: commonsPicture({
    fileName: "IvoryLabelOfDen-BritishMuseum-August19-08.jpg",
    caption: "Ivory sandal label of King Den from his tomb at Abydos, 1st Dynasty (c. 2950 BCE), British Museum: the king smiting an easterner. The British Museum describes a uraeus cobra at his brow; at this size the cobra is hard to see.",
    shows: "artefact",
    identificationStatus: "probable",
    licence: "CC BY 2.5",
    creator: "CaptMondo",
    institution: "British Museum",
    objectDate: "1st Dynasty, c. 2950 BCE",
    subject: "King Den smiting",
    provenanceNotes: "The file page names the British Museum but gives no number; the BM's sandal label of Den is EA 55586 (from the BM page as quoted in a search result).",
  }),
  senusretUraeus: commonsPicture({
    fileName: "Uraeus provenant d'une couronne royale de Sesostris II (la Villette, 2023).jpg",
    caption: "Gold uraeus from a royal crown of Senusret II, 12th Dynasty (c. 1880s BCE), found in his pyramid at el-Lahun. Egyptian Museum, Cairo, JE 46694; photographed in a Paris exhibition, 2023.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Tangopaso",
    institution: "Egyptian Museum, Cairo",
    accessionNumber: "JE 46694",
    objectDate: "12th Dynasty",
    subject: "Royal uraeus",
  }),
  mentuhotepUraei: commonsPicture({
    fileName: "UreoMentuhotepII (31260641687).jpg",
    caption: "Detail of a painted limestone relief from the temple of Mentuhotep II at Deir el-Bahari, 11th Dynasty (c. 2000 BCE): a winged sun-disk flanked by uraei with ankh signs, protecting the king. British Museum EA 1450.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "rowanwindwhistler",
    institution: "British Museum",
    accessionNumber: "EA 1450",
    objectDate: "11th Dynasty",
    subject: "Uraei flanking the winged disk",
  }),
  metUraeusAttachment: commonsPicture({
    fileName: "Uraeus MET 50.198.3 EGDP022498.jpg",
    caption: "Headdress attachment in the form of a uraeus, Third Intermediate Period, 22nd Dynasty (c. 945–712 BCE). Metropolitan Museum of Art 50.198.3.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "50.198.3",
    objectDate: "22nd Dynasty",
    subject: "Uraeus",
  }),
  metUraeusLate: commonsPicture({
    fileName: "Uraeus headdress attachment MET 89.2.608 EGDP014662.jpg",
    caption: "Uraeus headdress attachment from a statue, Late Period–Ptolemaic Period (664–30 BCE). Metropolitan Museum of Art 89.2.608.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "89.2.608",
    objectDate: "664–30 BCE",
    subject: "Uraeus",
  }),
  tutThroneUraei: commonsPicture({
    fileName: "Golden Uraes Cobra Tutankhamun's Throne.jpg",
    caption: "Four gilded uraei with sun-disks on the back of Tutankhamun's throne, 18th Dynasty (c. 1330 BCE), from his tomb in the Valley of the Kings. Egyptian Museum, Cairo. Low-resolution photograph.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "GoShow",
    institution: "Egyptian Museum, Cairo",
    objectDate: "c. 1330 BCE",
    subject: "Uraei on a royal throne",
  }),
  uraeusFrieze47: commonsPicture({
    fileName: "Uraeus for freize MET 17.192.47 EGDP014372.jpg",
    caption: "Uraeus made to stand in a row along the top of a shrine or wall (a uraeus frieze), Late Period–Ptolemaic (664–30 BCE). Metropolitan Museum of Art 17.192.47.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "17.192.47",
    objectDate: "664–30 BCE",
    subject: "Uraeus frieze element",
  }),
  uraeusFrieze46: commonsPicture({
    fileName: "Uraeus for freize MET 17.192.46 002.jpg",
    caption: "A second uraeus frieze element of the same type, Late Period–Ptolemaic (664–30 BCE). Metropolitan Museum of Art 17.192.46.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "17.192.46",
    objectDate: "664–30 BCE",
    subject: "Uraeus frieze element",
  }),
  metternichWhole: commonsPicture({
    fileName: "Magical Stela (Cippus of Horus) MET DP319007.jpg",
    caption: "The Metternich Stela, a cippus of Horus: the child Horus on crocodiles grasping snakes and scorpions, its surfaces covered with spells against venom. 30th Dynasty, reign of Nectanebo II (360–343 BCE). Metropolitan Museum of Art 50.85.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "50.85",
    objectDate: "360–343 BCE",
    subject: "Metternich Stela",
  }),
  metternichDetail: commonsPicture({
    fileName: "Magical Stela (Cippus of Horus) MET 50.85 05.jpg",
    caption: "Another view of the Metternich Stela (Met 50.85), 360–343 BCE, showing part of the inscribed and figured surface.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "50.85",
    objectDate: "360–343 BCE",
    subject: "Metternich Stela",
  }),
  healingStela: commonsPicture({
    fileName: "Healing Stela of Horus.jpg",
    caption: "A smaller steatite healing stela of Horus on the crocodiles, Ptolemaic period (c. 305–30 BCE). Holding collection not named on the file page.",
    shows: "artefact",
    identificationStatus: "probable",
    licence: "Public domain",
    creator: "One dead president",
    objectDate: "Ptolemaic, c. 305–30 BCE",
    subject: "Cippus of Horus",
  }),
  snakeAmulets: commonsPicture({
    fileName: "Snake Amulets, Birmingham Museum and Art Gallery.jpg",
    caption: "Egyptian snake amulets on display at Birmingham Museum and Art Gallery. The file page gives no dates or numbers for the individual pieces.",
    shows: "artefact",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "SpeakingArch",
    institution: "Birmingham Museum and Art Gallery",
    subject: "Snake amulets",
  }),
  menqebitAmulet: commonsPicture({
    fileName: "Menqebit (snake's head) amulet MET LC-26 7 1044 EGDP031500.jpg",
    caption: "Snake's-head amulet, Late Period (664–332 BCE). Metropolitan Museum of Art 26.7.1044. Snake-head amulets were worn against snakebite and are prescribed in funerary spells.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "26.7.1044",
    objectDate: "664–332 BCE",
    subject: "Snake's-head amulet",
  }),
  metSnakeBox: commonsPicture({
    fileName: "Box for an animal mummy surmounted by a coiled, rearing snake MET 04.2.517 EGDP014658.jpg",
    caption: "Box for an animal mummy with a coiled, rearing cobra on the lid, Late Period–Ptolemaic (664–30 BCE). Metropolitan Museum of Art 04.2.517.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "04.2.517",
    objectDate: "664–30 BCE",
    subject: "Snake mummy box",
  }),
  turinSnakeMummy: commonsPicture({
    fileName: "Snake mummy - Museo Egizio, Turin P 1441 p01.jpg",
    caption: "A snake mummy: a rectangular linen package with rounded ends, its top woven in coffered patterns. Museo Egizio, Turin, Provv. 1441; undated on the record.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Museo Egizio, Turin",
    accessionNumber: "Provv. 1441",
    subject: "Snake mummy",
  }),
  turinSnakeCoffin7380: commonsPicture({
    fileName: "Coffin for a snake, wood - Museo Egizio, Turin C 7380 p01.jpg",
    caption: "Wooden snake coffin with a sliding lid and an empty cavity for the mummy, the lid carved with a snake. Museo Egizio, Turin, Cat. 7380; undated on the record.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Museo Egizio, Turin",
    accessionNumber: "Cat. 7380",
    subject: "Snake coffin",
  }),
  birminghamSnakeBox: commonsPicture({
    fileName: "Bronze box for a snake relic, Late period, 600-100 BCE, Birmingham Museum and Art Gallery.jpg",
    caption: "Bronze box for a snake relic, Late Period (museum label: 600–100 BCE). Birmingham Museum and Art Gallery.",
    shows: "artefact",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "SpeakingArch",
    institution: "Birmingham Museum and Art Gallery",
    objectDate: "600–100 BCE (museum label)",
    subject: "Bronze snake box",
  }),
  hunefersOpening: commonsPicture({
    fileName: "Opening of the mouth ceremony.jpg",
    caption: "The Opening of the Mouth at the tomb door, from the Book of the Dead of Hunefer, 19th Dynasty (c. 1275 BCE): the mummy held upright by Anubis or a masked priest while priests present the ritual implements. British Museum EA 9901.",
    shows: "manuscript",
    identificationStatus: "secure",
    licence: "Public domain",
    institution: "British Museum",
    accessionNumber: "EA 9901",
    objectDate: "c. 1275 BCE",
    subject: "Opening of the Mouth",
  }),
  saiteOracle: commonsPicture({
    fileName: "Saite Oracle Papyrus, October 4, 651 B.C.E., 47.218.3a-j.jpg",
    caption: "The Saite Oracle Papyrus, dated 4 October 651 BCE: the petition of Pemou to Amun-Re at Thebes, with the god's barque-shrine drawn on its carrying poles. Brooklyn Museum 47.218.3a–j.",
    shows: "manuscript",
    identificationStatus: "secure",
    licence: "No restrictions",
    institution: "Brooklyn Museum",
    accessionNumber: "47.218.3a–j",
    objectDate: "651 BCE",
    subject: "Oracle of Amun-Re",
  }),
  berlinProcessionOstracon: commonsPicture({
    fileName: "-1230 Ostrakon mit Götterprozession anagoria.JPG",
    caption: "Ostracon with a procession of a god, 19th Dynasty (file page: 1192–1186 BCE). Neues Museum, Berlin, ÄM 21434.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY 3.0",
    creator: "Anagoria",
    institution: "Neues Museum, Berlin",
    accessionNumber: "ÄM 21434",
    objectDate: "19th Dynasty",
    subject: "Divine procession",
  }),
  koptosBarques: commonsPicture({
    fileName: "Fragment of a limestone stele. There are 2 solar barques and shrines carried by temple priests. From Koptos, Egypt. 19th Dynasty. Petrie Museum.jpg",
    caption: "Limestone stela fragment from Koptos, 19th Dynasty: a barque carrying a shrine is borne on poles by twelve shaven-headed priests. Petrie Museum, London.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Osama Shukir Muhammed Amin FRCP(Glasg)",
    institution: "Petrie Museum of Egyptian Archaeology",
    objectDate: "19th Dynasty",
    subject: "Barque carried by priests",
  }),
  abydosBarque: commonsPicture({
    fileName: "Abydos Tempelrelief Sethos I. 13.JPG",
    caption: "Relief in the temple of Seti I at Abydos, 19th Dynasty (c. 1290–1279 BCE): a portable divine barque with its shrine on carrying poles. Which god's barque it is is not stated on the file page.",
    shows: "evidence_photograph",
    identificationStatus: "probable",
    licence: "CC BY 3.0",
    creator: "Olaf Tausch",
    objectDate: "c. 1290–1279 BCE",
    subject: "Portable divine barque",
  }),
  raSlaysApep: commonsPicture({
    fileName: "Ra slays Apep (tomb scene in Deir el-Medina).jpg",
    caption: "Tomb painting at Deir el-Medina, New Kingdom: the 'Great Cat of Heliopolis', a form of the sun god, cuts the head off Apep beside a persea tree. The file page does not name the tomb.",
    shows: "evidence_photograph",
    identificationStatus: "probable",
    licence: "CC BY-SA 3.0",
    creator: "Hajor",
    objectDate: "New Kingdom",
    subject: "Ra as a cat killing Apep",
  }),
  hunefersCat: commonsPicture({
    fileName: "Papyrus of Hunefer, detail.jpg",
    caption: "The sun god as a cat killing the serpent of darkness with a knife, Book of the Dead of Hunefer, 19th Dynasty (c. 1275 BCE). British Museum EA 9901.",
    shows: "manuscript",
    identificationStatus: "secure",
    licence: "Public domain",
    institution: "British Museum",
    accessionNumber: "EA 9901",
    objectDate: "c. 1275 BCE",
    subject: "Ra as a cat killing Apep",
  }),
  ramsesIApep: commonsPicture({
    fileName: "The tomb of Ramses I, 7.jpg",
    caption: "Burial chamber of Ramesses I (KV16), 19th Dynasty (c. 1290 BCE), Book of Gates: above, the ram-headed sun god in his barque under the arched coils of Mehen; below, a god faces the coiled Apep; at right, a tall gate-serpent standing on its tail.",
    shows: "evidence_photograph",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "Leon petrosyan",
    objectDate: "c. 1290 BCE",
    subject: "Book of Gates: Mehen, Apep and a gate-serpent",
    provenanceNotes: "The file page says only 'The tomb of Ramses I (KV16)'; the reading of the scene is this record's, from the image and from the standard descriptions of the Book of Gates in KV16.",
  }),
  edfuApep: commonsPicture({
    fileName: "Edfu16.JPG",
    caption: "Relief in the eastern ambulatory of the temple of Horus at Edfu, Ptolemaic period: Apep stabbed with knives.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Rémih",
    objectDate: "Ptolemaic period",
    subject: "Apep transfixed with knives",
  }),
  louvreMehen: commonsPicture({
    fileName: "Plateau de jeu de serpent - Musée du Louvre Antiquités égyptiennes E 29891.jpg",
    caption: "Stone mehen game board in the form of a coiled snake, Early Dynastic (Louvre date: c. 2900–2700 BCE). Musée du Louvre E 29891.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Shonagon",
    institution: "Musée du Louvre",
    accessionNumber: "E 29891",
    objectDate: "c. 2900–2700 BCE",
    subject: "Mehen game board",
  }),
  chicagoMehen: commonsPicture({
    fileName: "Snake (mehen) game, Egypt, Old Kingdom, Dynasties 3-6, c. 2750-2250 BC, alabaster, pigment - Oriental Institute Museum, University of Chicago - DSC07928.JPG",
    caption: "Alabaster mehen board with pigment, Old Kingdom, Dynasties 3–6 (c. 2750–2250 BCE). Oriental Institute (ISAC) Museum, University of Chicago.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Daderot",
    institution: "Oriental Institute Museum, University of Chicago",
    objectDate: "c. 2750–2250 BCE",
    subject: "Mehen game board",
  }),
  berlinMehen: commonsPicture({
    fileName: "-3000 Abydos Spiel der Schlange Mehen anagoria.JPG",
    caption: "The Berlin mehen board with playing pieces, limestone, ÄM 13868. The file page says it is of unknown date and provenance, given to Berlin in 1897; the '3000' and 'Abydos' in its file name are not supported by its own description.",
    shows: "artefact",
    identificationStatus: "probable",
    licence: "CC BY 3.0",
    creator: "Anagoria",
    institution: "Ägyptisches Museum und Papyrussammlung, Berlin",
    accessionNumber: "ÄM 13868",
    subject: "Mehen game board",
  }),
  bmMehen: commonsPicture({
    fileName: "British Museum Mehen Board.jpg",
    caption: "An unusual mehen board in the British Museum with an eye at the centre instead of the snake's head; date uncertain.",
    shows: "artefact",
    identificationStatus: "probable",
    licence: "CC0",
    creator: "Waltros",
    institution: "British Museum",
    subject: "Mehen game board",
  }),
  gatesBarqueKV16: commonsPicture({
    fileName: "Book of Gates Barque of Ra.jpg",
    caption: "Ra, ram-headed, in his barque inside a shrine sheltered by the coils of Mehen, from the Book of Gates in the tomb of Ramesses I (KV16), c. 1290 BCE.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "Public domain",
    objectDate: "c. 1290 BCE",
    subject: "Mehen around the sun god",
  }),
  horemhebMehen: commonsPicture({
    fileName: "La tombe de Horemheb (KV.57) (Vallée des Rois Thèbes ouest).jpg",
    caption: "Tomb of Horemheb (KV57), late 18th Dynasty (c. 1300 BCE): the ram-headed sun god in a naos protected by the serpent Mehen on the solar barque, from the earliest copy of the Book of Gates.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY 2.0",
    creator: "Jean-Pierre Dalbéra",
    objectDate: "c. 1300 BCE",
    subject: "Mehen around the sun god",
  }),
  enigmaticMehen: commonsPicture({
    fileName: "Ra-Osiris in the Enigmatic Book.JPG",
    caption: "UNVERIFIED — the identification of these serpents as Mehen is the file page's and was not checked against the shrine's own captions or Darnell's edition. What the picture shows: a giant mummiform god (read as Ra and Osiris united) with a serpent biting its tail around his head and another around his feet, on the second gilded shrine of Tutankhamun, c. 1330 BCE.",
    shows: "evidence_photograph",
    identificationStatus: "unverified",
    licence: "CC0",
    creator: "A. Parrot",
    institution: "Egyptian Museum, Cairo",
    objectDate: "c. 1330 BCE",
    subject: "Encircling serpents on Tutankhamun's second shrine",
  }),
  ogdoadDeirElMedina: commonsPicture({
    fileName: "Ogdoad - The Place of Truth - Deir el Medina.jpg",
    caption: "The Ogdoad in relief at Deir el-Medina (the 'Place of Truth'), Thebes: frog-headed gods and snake-headed goddesses. The relief is in the Ptolemaic temple there; its exact date is not given on the file page.",
    shows: "evidence_photograph",
    identificationStatus: "probable",
    licence: "CC BY-SA 3.0",
    creator: "S F-E-Cameron; derivative by JMCC1",
    subject: "Ogdoad",
  }),
  walterNehebkau: commonsPicture({
    fileName: "Egyptian - Neheb-kau - Walters 481615.jpg",
    caption: "Figure of the serpent god Nehebkau, Third Intermediate Period (1070–730 BCE). Walters Art Museum 48.1615.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    institution: "Walters Art Museum",
    accessionNumber: "48.1615",
    objectDate: "1070–730 BCE",
    subject: "Nehebkau",
  }),
  champollionKneph: commonsPicture({
    fileName: "Champollion - Panthéon égyptien, 1823 (page 203 crop).jpg",
    caption: "Plate from Champollion's Panthéon égyptien (1823): a nineteenth-century lithograph of the god he called Kneph, the serpent form later discussed as Kematef. A modern scholar's drawing, not an ancient image.",
    shows: "engraving",
    identificationStatus: "modern_interpretation",
    licence: "Public domain",
    creator: "Jean-François Champollion (Panthéon égyptien)",
    objectDate: "1823",
    subject: "Kneph / Kematef in nineteenth-century scholarship",
  }),
  medinetHabuSmallTemple: commonsPicture({
    fileName: "Gateway of the Small Temple.jpg",
    caption: "Gateway of the small temple at Medinet Habu (ancient Djeme), the place late Theban theology made the resting place of Kematef and the Ogdoad. Albumen photograph by W. de W. Abney, 1874.",
    shows: "site",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "William de Wiveleslie Abney",
    objectDate: "photographed 1874",
    subject: "Small temple of Medinet Habu",
  }),
  medinetHabuExterior: commonsPicture({
    fileName: "Exterior of the Small Temple (Thebes and its five greater temples - plate 3).jpg",
    caption: "Exterior of the small temple at Medinet Habu, from Abney's Thebes and its Five Greater Temples (1876); photograph taken in 1874.",
    shows: "site",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "William de Wiveleslie Abney",
    objectDate: "photographed 1874",
    subject: "Small temple of Medinet Habu",
  }),
  aniSpell87: commonsPicture({
    fileName: "Nehebkau - Spell-87 -Book of the Dead.jpg",
    caption: "Vignette of Book of the Dead spell 87, the transformation into the serpent Sata, from the Papyrus of Ani, sheet 27, 19th Dynasty (c. 1250 BCE). British Museum. The file is titled 'Nehebkau', but spell 87 names the serpent Sata.",
    shows: "manuscript",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Anonymous 19th Dynasty painter; excerpt curated by Mykola Tarasenko",
    institution: "British Museum",
    objectDate: "19th Dynasty",
    subject: "Book of the Dead spell 87",
  }),
  setiSarcophagus: commonsPicture({
    fileName: "Sarcophagus of Seti I 2023-02-17a.jpg",
    caption: "The alabaster sarcophagus of Seti I (c. 1279 BCE), inscribed with the first complete copy of the Book of Gates. Sir John Soane's Museum, London; photograph 2023.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Djehouty",
    institution: "Sir John Soane's Museum, London",
    objectDate: "c. 1279 BCE",
    subject: "Sarcophagus of Seti I",
  }),
  kv17Gates: commonsPicture({
    fileName: "KV17, the tomb of Pharaoh Seti I of the Nineteenth Dynasty, Pillared chamber F, southeast wall decorated with the scenes from the Book of Gates, Valley of the Kings, Egypt (49845805158).jpg",
    caption: "Book of Gates scenes on the southeast wall of pillared chamber F, tomb of Seti I (KV17), 19th Dynasty (c. 1290–1279 BCE): registers of gods holding a long rope and a great serpent.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "Carole Raddato",
    objectDate: "c. 1290–1279 BCE",
    subject: "Book of Gates in KV17",
  }),
  budgeTekaHra: commonsPicture({
    fileName: "Serpent-tekaher (2).jpg",
    caption: "Line drawing printed by Budge in The Egyptian Heaven and Hell (1905) of a gate-serpent of the Book of Gates standing on its tail, after the sarcophagus of Seti I. A modern drawing of an ancient image.",
    shows: "engraving",
    identificationStatus: "probable",
    licence: "Public domain",
    creator: "E. A. Wallis Budge",
    objectDate: "drawing published 1905",
    subject: "Gate-serpent of the Book of Gates",
  }),
  luxorColonnade: commonsPicture({
    fileName: "The Colonnade of Amenophis III -Luxor Temple (14075069539).jpg",
    caption: "The processional colonnade of Luxor Temple, built by Amenhotep III (c. 1360s BCE); its walls carry the Opet procession reliefs carved principally under Tutankhamun. Photograph 2012; the reliefs themselves are not legible at this scale.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 2.0",
    creator: "Jorge Láscar",
    objectDate: "photographed 2012",
    subject: "Luxor colonnade",
  }),
  redChapel: commonsPicture({
    fileName: "Red chapel of Hatshepsut at karnak 83d40m egyptarchiveUKkarnak62.JPG",
    caption: "The Red Chapel of Hatshepsut (c. 1470 BCE), a barque shrine for Amun, reassembled at Karnak. Its blocks carry some of the earliest depictions of the Opet procession.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 3.0",
    creator: "Jon Bodsworth, edited by 83d40m",
    objectDate: "c. 1470 BCE",
    subject: "Red Chapel of Hatshepsut",
  }),
  princesProcession: commonsPicture({
    fileName: "Princes' procession, Medinet Habu.jpg",
    caption: "Procession of the sons of Ramesses III in his temple at Medinet Habu, 20th Dynasty (c. 1170s BCE). Each prince carries the royal insignia of his rank; the uraeus is the king's alone.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "Copyrighted free use",
    creator: "Jon Bodsworth",
    objectDate: "c. 1170s BCE",
    subject: "Royal procession in relief",
  }),
  narmerPalette: commonsPicture({
    fileName: "Narmer Palette smiting side.jpg",
    caption: "The Narmer Palette, smiting side, c. 3100 BCE (Egyptian Museum, Cairo): the king in the white crown, with no uraeus at his brow. Included as the 'before' picture for the royal uraeus.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "Public domain",
    institution: "Egyptian Museum, Cairo",
    objectDate: "c. 3100 BCE",
    subject: "Narmer Palette",
  }),
};

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // ===========================================================================
  // 1. THE ANCHOR
  // ===========================================================================
  {
    slug: ANCHOR,
    title: "Egyptian serpents: what the evidence is, and how old each kind is",
    summary:
      "Egyptian serpent religion is known from four kinds of evidence (objects, royal and temple inscriptions, funerary and ritual texts, and animal burials), each with its own date range from about 3000 BCE to the Roman period.",
    description: `WHAT THIS RECORD IS. The opening record of the Egyptian lane. It lists the kinds of evidence the lane rests on and their dates, so that every later record can be read against them. It makes no comparison with Israel or the Gbe coast; those are in the comparison and assessment lanes.

THE OBJECTS. Royal insignia and images: the cobra at the king's brow is described by the British Museum on Den's ivory sandal label from Abydos (1st Dynasty, about 2950 BCE); the gold uraeus of Senusret II (12th Dynasty) survives from his pyramid at el-Lahun; uraei in friezes, on thrones and on statues run on to the Ptolemies. Magical objects: snake-head amulets, healing stelae of Horus on the crocodiles (the Metternich Stela, 360–343 BCE). Game boards: the mehen board, a coiled snake, from about 3000 to about 2300 BCE.

THE INSCRIPTIONS AND DOCUMENTS. The Nebty ('Two Ladies') name, whose cobra is Wadjet of Buto, possibly on a label of Aha and securely from Semerkhet in the 1st Dynasty; temple reliefs; donation stelae such as Shabaqo's to Wadjet and Horus of Pe (late 8th century BCE); oracle papyri such as Brooklyn 47.218.3 (651 BCE).

THE TEXTS. The Pyramid Texts (from Unas, about 2350 BCE) with their serpent charms; the Coffin Texts (Middle Kingdom), where Apep is first named and Mehen first appears; the Book of the Dead (from about 1550 BCE); the Amduat and the Book of Gates on royal tomb walls (New Kingdom); the Brooklyn treatise on snakes (copy of the 7th–4th century BCE); and the Book of Overthrowing Apep in Papyrus Bremner-Rhind (about 305 BCE).

THE ANIMALS. Snake mummies in wooden and bronze coffins, mostly Late to Ptolemaic (664–30 BCE), and a 2020 micro-CT study of one such mummy, a juvenile Egyptian cobra.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that serpents were central to Egyptian kingship, protection and cosmology for some three thousand years, in several distinct forms: Wadjet the cobra goddess, the uraeus as her emblem, Apep the enemy, Mehen the protector, Nehebkau and the primordial snakes. It does not establish one serpent religion: these are different beings with different jobs, and the snake involved is almost always the cobra, not the python. It says nothing by itself about Israel or West Africa. Egypt had no python cult; the pythons of Ouidah are a different animal in a different religion.`,
    category: "religion",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["figure: wadjet and the uraeus", "figure: apep", "figure: mehen", "theme: kingship", "theme: healing and protection", "theme: manuscripts and their dates"], "egypt", "evidence overview"),
    civilisations: ["Ancient Egypt"],
    people: ["Den", "Senusret II", "Nectanebo II", "Unas"],
    locationName: "Nile Valley and Delta, Egypt",
    claims: [
      {
        sourceKey: "bm_ea_55586_den_sandal_label",
        citations: [
          { sourceKey: "johnson_1990_cobra_goddess", relation: "context", note: "The specialist catalogue of early cobra and uraeus evidence, cited at book level only." },
        ],
        startYear: bce(3000),
        endYear: bce(2900),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Earliest securely dated royal serpent imagery: 1st Dynasty, about 3000–2900 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The start of the documented evidence",
        evidence:
          "EVIDENCE TYPE: archaeological. Labels and seal impressions from the royal tombs at Abydos, placed by the reign of the king named on them; the absolute date rests on the conventional Early Dynastic chronology, which is uncertain by a century or so. The date marks the oldest securely datable royal cobra imagery known to this lane; it does not date the beginning of cobra worship, which may be older and undocumented.",
      },
      {
        sourceKey: "bm_ea_10188_bremner_rhind",
        citations: [
          { sourceKey: "met_04_2_517_snake_mummy_box", relation: "supports", note: "Snake mummy containers of the Late–Ptolemaic period show the latest heavy phase of serpent cult practice." },
        ],
        startYear: bce(305),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Latest major ritual text against Apep in this lane: colophon of about 305 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "explicit_date",
        whatIsDated: "A late fixed point in the textual evidence",
        evidence:
          "EVIDENCE TYPE: contemporary written. The colophon of Papyrus Bremner-Rhind dates the copy (British Museum: 305 BCE). It dates this manuscript, not the composition of the ritual it contains, which is older. NEEDS SOURCE VERIFICATION: the BM date was read only as quoted in a search result.",
      },
    ],
    media: [P.louvreCobraStele, P.turinSnakeCoffin, P.brooklynPapyrusA],
  },

  // ===========================================================================
  // 2. WADJET AND BUTO
  // ===========================================================================
  {
    slug: "wadjet-of-buto-cobra-goddess-of-pe-and-dep",
    title: "Wadjet of Buto: the cobra goddess of Pe and Dep, and her earliest datable traces",
    summary:
      "Wadjet, 'the green one', was the cobra goddess of Buto (Pe and Dep) in the Delta; her cobra appears in the royal Nebty title from the 1st Dynasty, she is shown protecting the king by the 5th, and kings still endowed her temple under the 25th.",
    description: `WHO SHE IS. Wadjet (Egyptian wꜣḏyt, 'the green one') was the goddess of the twin towns Pe and Dep, the Greek Buto, today Tell el-Fara'in in the northwestern Delta. She was a rearing cobra, and from early in Egyptian history she was paired with Nekhbet, the vulture goddess of Nekheb in the south, as the 'Two Ladies' (nbtj) who protected the king of a united Egypt.

WHAT IS EXCAVATED. Buto is a large mound of settlement and temple remains, excavated by the German Archaeological Institute since the 1980s, with occupation from the fourth millennium BCE. The excavation shows an important early Delta town; it does not by itself show when the cobra goddess began to be worshipped there.

THE EARLIEST DATABLE EVIDENCE, IN ORDER OF CERTAINTY. (1) A damaged label of King Aha from Naqada with a cobra and a vulture over baskets, the later writing of 'Two Ladies'. Whether it is a royal title, the name of a shrine, or another king's name is disputed. (2) The Nebty name in the royal titulary, securely attested by the reign of Semerkhet, late 1st Dynasty. (3) Wadjet shown and named as the king's protector in Old Kingdom temple reliefs, such as the fragment from Nyuserre's mortuary temple at Abusir (5th Dynasty). (4) Late fixed points: Shabaqo's donation stela of his year 6 (Met 55.144.6) gives land to Wadjet and Horus of Pe, and in the fifth century BCE Herodotus calls 'the Oracle of Leto which is in the city of Buto' the most honoured oracle in Egypt.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a cobra goddess tied to one Delta town and to the royal titulary from the 1st Dynasty into the Late Period. It does not give a date for her first worship (any Predynastic cult is inferred, not documented), and the Aha label cannot carry the weight of 'earliest' on its own. Herodotus names Leto, not Wadjet, and mentions no serpent at Buto; reading his Leto as Wadjet follows later Greek usage and is a modern identification. The cobra here is Naja haje; nothing in the Buto evidence concerns pythons or the Gbe vodun Dan.`,
    category: "religion",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["figure: wadjet and the uraeus", "theme: kingship", "theme: oracle and divination", "theme: names and words"], "wadjet", "buto", "nebty"),
    civilisations: ["Ancient Egypt"],
    people: ["Wadjet", "Nekhbet", "Aha", "Semerkhet", "Nyuserre Ini", "Shabaqo", "Herodotus"],
    locationName: "Buto (Pe and Dep), Tell el-Fara'in, Nile Delta",
    lat: 31.196,
    lng: 30.743,
    claims: [
      {
        sourceKey: "johnson_1990_cobra_goddess",
        startYear: bce(3100),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Reign of Aha, about 3100 BCE: a disputed cobra-and-vulture sign group",
        datingMethod: "regnal_chronology",
        chronology: "disputed",
        temporalClaimType: "approximate_date",
        whatIsDated: "The earliest possible written trace of the Two Ladies",
        evidence:
          "EVIDENCE TYPE: inscription. A damaged label from Naqada with the cobra and vulture over baskets. Whether it gives a king's Nebty name, the name of a shrine, or Narmer's name is disputed in the literature summarised by UCL Digital Egypt and others. NEEDS SOURCE VERIFICATION: Johnson's and Callender's treatment of it was not read here. It does not securely establish the Two Ladies title under Aha.",
      },
      {
        sourceKey: "johnson_1990_cobra_goddess",
        startYear: bce(2900),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Reign of Semerkhet, late 1st Dynasty: the Nebty name securely in the titulary",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The Two Ladies as a secure royal title",
        evidence:
          "EVIDENCE TYPE: inscription. Royal names on 1st Dynasty objects; the absolute date follows the conventional chronology. It establishes the cobra goddess in the royal titulary; it does not say how long she had been worshipped at Buto.",
      },
      {
        sourceKey: "met_55_144_6_shabaqo_donation_stela",
        citations: [
          { sourceKey: "herodotus_macaulay_histories", relation: "supports", note: "Two and a half centuries later Herodotus still finds Buto's goddess the most honoured oracle in Egypt." },
        ],
        startYear: bce(716),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Year 6 of Shabaqo, late 8th century BCE: land given to Wadjet and Horus of Pe",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "explicit_date",
        whatIsDated: "A late dated act of royal patronage of Wadjet",
        evidence:
          "EVIDENCE TYPE: inscription. The stela is dated by regnal year; converting year 6 of Shabaqo to a year BCE depends on 25th Dynasty chronology, which is uncertain by a few years. It establishes royal endowment of Wadjet's cult under a Kushite king; it does not say anything about Kush taking Wadjet south, which is the Kushite lane's question.",
      },
    ],
    passages: [
      {
        label: "Herodotus on the oracle at Buto",
        reference: "Herodotus, Histories 2.83 and 2.155",
        sourceKey: "herodotus_macaulay_histories",
        layers: [
          {
            layer: "translation",
            sourceKey: "herodotus_macaulay_histories",
            language: "English",
            content:
              "there are in their land Oracles of Heracles, of Apollo, of Athene, of Artemis, of Ares, and of Zeus, and moreover that which they hold most in honour of all, namely the Oracle of Leto which is in the city of Buto. … This Oracle which is in Egypt is sacred to Leto, and it is established in a great city near that mouth of the Nile which is called Sebennytic.",
            evidence:
              "Macaulay's 1890 translation, copied from the Project Gutenberg text. A Greek writer of the 430s BCE using Greek divine names for Egyptian gods. He does not name Wadjet and does not mention a serpent; the passage establishes an esteemed oracle at Buto, not a serpent oracle.",
          },
        ],
      },
    ],
    media: [P.nyuserreWadjet, P.butoMound, P.shabaqoStela, P.menatWadjyt, P.pennWadjet],
  },

  // ===========================================================================
  // 3. THE URAEUS ON THE ROYAL BROW
  // ===========================================================================
  {
    slug: "uraeus-on-the-royal-brow-from-den-to-senusret-ii",
    title: "The uraeus on the royal brow: from Den's sandal label to the gold cobra of Senusret II",
    summary:
      "The rearing cobra at the king's forehead is first described on Den's ivory label (1st Dynasty) and was standard by the Old Kingdom; Senusret II's gold uraeus from el-Lahun is one of the few royal uraei that survive from a burial.",
    description: `WHAT THE URAEUS IS. The uraeus (Egyptian jꜥrt, 'the rearing one'; the Greek word comes from Egyptian) is the cobra worn at the brow of the king and of gods. Egyptians understood it as Wadjet herself, and from the Middle Kingdom on, as the fiery Eye of the sun god spitting flame at the king's enemies (see the next record).

THE EARLIEST APPEARANCE. Nothing at the brow of Narmer on his palette (about 3100 BCE): he wears the white and red crowns without a cobra. On the ivory sandal label of Den from Abydos (British Museum EA 55586, about 2950 BCE) the British Museum describes the king wearing an archaic royal headcloth 'with the rearing neck and head of a royal uraeus cobra at his forehead'. Popular and museum-education accounts call this the first uraeus; whether specialist catalogues (Johnson 1990) put it first, or have earlier candidates on seal impressions, was not checked here. NEEDS SOURCE VERIFICATION.

STANDARDISATION. By the Old Kingdom the uraeus is a normal part of royal headgear in statues and reliefs; the winged sun-disk flanked by uraei protects the king in Mentuhotep II's temple (11th Dynasty, BM EA 1450).

AN ACTUAL ROYAL URAEUS. The gold uraeus of Senusret II (12th Dynasty), with lapis lazuli head, carnelian hood and inlays, was found in the debris of the rock-cut chamber of his pyramid at el-Lahun during Petrie's work there (Cairo JE 46694). Accounts disagree on the year (1919 or 1920) and on who is credited with the find (Petrie; the Qufti workman Hosni Ibrahim). Before Tutankhamun's tomb it was the only uraeus known from a royal burial.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes the cobra at the king's brow from the 1st Dynasty and its routine use for the rest of pharaonic history, and later in Kush. It does not establish who 'invented' the uraeus or a precise first reign: the Den attribution depends on how one tiny carved detail is read and on what the earliest seal impressions show. The uraeus is a cobra; any reading of it as a python, or as a sign of a meditative serpent-energy, is a later interpretation (see the serpent-kundalini dataset's uraeus record).`,
    category: "religion",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["figure: wadjet and the uraeus", "theme: kingship"], "uraeus", "royal insignia"),
    civilisations: ["Ancient Egypt"],
    people: ["Den", "Narmer", "Mentuhotep II", "Senusret II", "Flinders Petrie", "Hosni Ibrahim"],
    locationName: "Abydos (Umm el-Qa'ab) and el-Lahun, Egypt",
    lat: 26.175,
    lng: 31.909,
    claims: [
      {
        sourceKey: "bm_ea_55586_den_sandal_label",
        citations: [
          { sourceKey: "johnson_1990_cobra_goddess", relation: "context", note: "The specialist catalogue in which the earliest royal uraei should be checked; not read here." },
        ],
        startYear: bce(2950),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Reign of Den, 1st Dynasty, about 2950 BCE: a cobra at the king's brow",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest royal uraeus known to this record",
        evidence:
          "EVIDENCE TYPE: archaeological. A labelled object from the king's tomb, dated by his reign within the conventional 1st Dynasty chronology. It establishes a uraeus on Den; 'first ever' is a museum-education claim not checked against the specialist literature. NEEDS SOURCE VERIFICATION.",
      },
      {
        sourceKey: "cairo_je_46694_senusret_ii_uraeus",
        startYear: bce(1897),
        endYear: bce(1878),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Reign of Senusret II, about 1897–1878 BCE: the gold uraeus made",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "The making of the Lahun uraeus",
        evidence:
          "EVIDENCE TYPE: archaeological. Dated by its findspot in the king's own pyramid and by Middle Kingdom regnal chronology. It establishes the object as Senusret II's; it does not prove the uraeus was worn in life rather than made for burial.",
      },
      {
        sourceKey: "cairo_je_46694_senusret_ii_uraeus",
        startYear: 1920,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Found in 1920 during Petrie's excavation of the Lahun pyramid",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "explicit_date",
        whatIsDated: "The find (one account)",
        evidence:
          "EVIDENCE TYPE: later historical account. The year given by museum-oriented accounts summarised in a search (Egypt Museum online). Excavation reports (Petrie, Brunton and Murray, Lahun II, 1923) were not read here. NEEDS SOURCE VERIFICATION.",
      },
      {
        sourceKey: null,
        citations: [
          { sourceKey: "cairo_je_46694_senusret_ii_uraeus", relation: "context", note: "The object whose find is dated differently by different accounts." },
        ],
        startYear: 1919,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Found in 1919 by the Qufti workman Hosni Ibrahim, after half an hour's digging",
        datingMethod: "source_assertion",
        chronology: "disputed",
        temporalClaimType: "explicit_date",
        whatIsDated: "The find (another account)",
        evidence:
          "EVIDENCE TYPE: later historical account. The year and the named finder as given in the English Wikipedia article on the uraeus, which does not show its source here and also wrongly places el-Lahun at Saqqara. Kept as a separate claim because it names the Egyptian workman whom other accounts leave out; it is not adopted. NEEDS SOURCE VERIFICATION.",
      },
    ],
    media: [P.denLabelBM, P.senusretUraeus, P.narmerPalette, P.mentuhotepUraei, P.metUraeusAttachment, P.metUraeusLate],
  },

  // ===========================================================================
  // 4. EYE OF RA: THE URAEUS AS ROYAL PROTECTOR
  // ===========================================================================
  {
    slug: "uraeus-eye-of-ra-serpent-protecting-the-king",
    title: "The fiery Eye at the king's brow: the uraeus as protector of kingship",
    summary:
      "Egyptian texts make the uraeus an active guardian: in the Pyramid Texts the uraeus 'belongs to heaven' and the crown's serpent devours enemies, and later the cobra at the brow is the burning Eye of Ra; rows of uraei guard thrones and shrines.",
    description: `WHAT THE TEXTS SAY. In the Pyramid Texts of Unas (about 2350 BCE) the serpent spells include the line 'The uraeus-serpent belongs to heaven' (utterance 240, Mercer's translation) and 'The white crown is gone forth; she has devoured the Great' (utterance 239): the crown itself, with its serpent, is a living power that consumes enemies. Later texts call the uraeus the Eye of Ra, the sun god's daughter who went out as a raging cobra or lioness and was set on his brow, from where she burns his enemies.

WHAT THE OBJECTS SHOW. Uraei are multiplied wherever royal or divine power has to be defended: four gilded uraei with sun-disks stand on the back of Tutankhamun's throne (about 1330 BCE); winged disks flanked by two uraei sit above doorways and over the king (Mentuhotep II); friezes of rearing cobras crown shrines and walls (Met 17.192.46 and 47, Late Period–Ptolemaic).

THE ARGUMENT. In Egypt the protective serpent of kingship is a venomous cobra that strikes and burns. It is an emblem worn by the king and set on his furniture and buildings, not a living animal kept by the court; and it is a goddess (Wadjet, the Eye), not a male god.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes the uraeus as an active protective power in royal ideology from the Old Kingdom texts on, and its use on royal and divine objects for the rest of Egyptian history. The 'Eye of Ra' myth as a connected story is mostly known from New Kingdom and later sources (the Book of the Heavenly Cow and temple texts), so the full myth should not be read back into the Pyramid Texts. Nothing here concerns a living sacred snake at court, which is what the Hueda and Dahomey sources describe for Dangbé.`,
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: wadjet and the uraeus", "theme: kingship", "theme: healing and protection", "theme: sacred landscape"], "eye of ra", "uraeus"),
    civilisations: ["Ancient Egypt"],
    people: ["Wadjet", "Ra", "Unas", "Tutankhamun"],
    locationName: "Royal and temple contexts across Egypt",
    claims: [
      {
        sourceKey: "mercer_1952_pyramid_texts",
        startYear: bce(2350),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Pyramid of Unas, about 2350 BCE: 'The uraeus-serpent belongs to heaven'",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The carving of the texts in the pyramid of Unas",
        evidence:
          "EVIDENCE TYPE: inscription. The texts are carved on the walls of a dated royal pyramid. The date is of the carving; many spells are thought to be older, but how much older is not known.",
      },
      {
        sourceKey: "met_50_85_metternich_stela",
        citations: [
          { sourceKey: "budge_1895_papyrus_of_ani", relation: "context", note: "New Kingdom funerary manuscripts carry the developed Eye-of-Ra imagery that the Late Period inherits." },
        ],
        startYear: bce(1330),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Tutankhamun's throne, about 1330 BCE: four uraei guarding the royal seat",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "approximate_date",
        whatIsDated: "A dated example of uraei guarding royal furniture",
        evidence:
          "EVIDENCE TYPE: archaeological. A dated object from a dated tomb. The Metternich Stela is cited as a later object on which Wadjet's standard stands among the protecting gods; the throne itself is in Cairo and was not checked against a museum record here.",
      },
    ],
    passages: [
      {
        label: "The uraeus and the crown in the serpent charms of Unas",
        reference: "Pyramid Texts, utterances 239 and 240 (Sethe §§243a–244a)",
        sourceKey: "mercer_1952_pyramid_texts",
        objectName: "Walls of the burial chamber and antechamber, pyramid of Unas, Saqqara",
        layers: [
          {
            layer: "translation",
            sourceKey: "mercer_1952_pyramid_texts",
            language: "English",
            content:
              "243a. To say: The white crown is gone forth; she has devoured the Great. … 244a. To say: The uraeus-serpent belongs to heaven; the centipede of Horus, belongs in the earth.",
            evidence:
              "Two short lines from Mercer's 1952 translation, as held in this site's text archive. Mercer is old and his rendering of rare words is often superseded; the gist, a crown that devours and a heavenly uraeus, is not in dispute.",
          },
        ],
      },
    ],
    media: [P.tutThroneUraei, P.uraeusFrieze47, P.uraeusFrieze46, P.mentuhotepUraei],
  },

  // ===========================================================================
  // 5. BROOKLYN SNAKE PAPYRUS AND THE KHEREP-SERQET
  // ===========================================================================
  {
    slug: "brooklyn-snake-papyrus-and-the-kherep-serqet",
    title: "The Brooklyn treatise on snakes and the 'controllers of Serqet'",
    summary:
      "A Late Period papyrus in Brooklyn (47.218.48 and 85) catalogues Egyptian snakes, the effects of their bites and their remedies, for the kherep-Serqet, a class of specialists in venom known from the Old Kingdom on.",
    description: `WHAT THE SOURCE IS. Brooklyn Museum papyri 47.218.48 and 47.218.85, from the collection of Charles Edwin Wilbour, together carry the only surviving Egyptian treatise on snakes. Its first part lists serpents one by one (their appearance, the god each is linked with, and whether the bite kills); its second part gives remedies and incantations. It was edited by Serge Sauneron (published posthumously, 1989).

THE PRIESTS WHO USED IT. The remedies are for the ḫrp Srqt, 'controller' or 'conjurer' of the scorpion goddess Serqet: a title held from the Old Kingdom to the Late Period by men who treated snake and scorpion bite, studied by Frédérique von Känel (1984). Serqet's power over venom also appears in the underworld books: in the seventh hour of the Amduat she binds the serpent Apep by the neck.

THE DATE, AND WHY THERE ARE TWO. The Brooklyn Museum dates the roll 664–332 BCE (Late Period). A 2012 study in Anthropozoologica places the copying in the fourth century BCE and asks how much older the text itself is. Other summaries give the 7th–4th centuries. These are dates for this copy; the knowledge in it may be far older.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a written, systematic Egyptian body of knowledge about snakes and their bites, held by a named class of ritual specialists, in which observation, medicine and incantation are not separated. It does not show a healing serpent: in this tradition the snake is the danger and Serqet and her controllers master it. It is a cobra-and-viper world, not a python one. NEEDS SOURCE VERIFICATION: the number of serpents in the catalogue and the earliest attestation of the title were seen only in summaries.`,
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: healing and protection", "theme: priesthood", "theme: manuscripts and their dates"], "snakebite", "serqet", "medicine"),
    civilisations: ["Ancient Egypt"],
    people: ["Serqet", "Serge Sauneron", "Charles Edwin Wilbour", "Frédérique von Känel"],
    locationName: "Egypt (provenance of the papyrus unrecorded); Brooklyn Museum, New York",
    claims: [
      {
        sourceKey: "brooklyn_47_218_48_snake_papyrus",
        citations: [
          { sourceKey: "sauneron_1989_traite_ophiologie", relation: "context", note: "The edition on which every modern reading of the treatise depends." },
        ],
        startYear: bce(664),
        endYear: bce(332),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Late Period, 664–332 BCE (Brooklyn Museum)",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "The surviving manuscript",
        evidence:
          "EVIDENCE TYPE: archaeological. The museum's period date for the papyrus, based on its hieratic script. It dates the copy, not the composition of the treatise.",
      },
      {
        sourceKey: "anthropozoologica_2012_brooklyn_snakebite",
        startYear: bce(399),
        endYear: bce(300),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Copied in the fourth century BCE",
        datingMethod: "textual_interpretation",
        chronology: "archaeological",
        temporalClaimType: "date_range",
        whatIsDated: "The surviving manuscript (a narrower dating)",
        evidence:
          "EVIDENCE TYPE: modern interpretation. A narrower date for the copy proposed in the 2012 study; the article's own reasoning was not read here. NEEDS SOURCE VERIFICATION.",
      },
      {
        sourceKey: "von_kanel_1984_pretres_serket",
        startYear: bce(2600),
        endYear: bce(2200),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Old Kingdom: the title 'controller of Serqet' already in use",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        temporalClaimType: "approximate_date",
        whatIsDated: "The kherep-Serqet as an institution",
        evidence:
          "EVIDENCE TYPE: inscription. Titles in Old Kingdom tombs, as collected by von Känel and summarised by UCL Digital Egypt. NEEDS SOURCE VERIFICATION: the earliest dated holder was not identified here.",
      },
    ],
    passages: [
      {
        label: "Serqet binds Apep in the seventh hour of the night",
        reference: "Amduat, seventh hour, middle register",
        sourceKey: "budge_1905_egyptian_heaven_and_hell",
        layers: [
          {
            layer: "translation",
            sourceKey: "budge_1905_egyptian_heaven_and_hell",
            language: "English",
            content:
              "The serpent NEHA-HRA, which is transfixed to the ground by means of six knives. The goddess SERQET stands with a band round his neck in the act of strangling him, and the god HER-TESU-F stands by his tail, round which he is tying a fetter.",
            evidence:
              "Budge's 1905 description of the scene, vol. I pp. 140–146, from the site's text archive. Neha-hra ('stinking face') is a name of Apep. The scene shows the goddess of the venom-specialists as the one who masters the cosmic serpent.",
          },
        ],
      },
    ],
    media: [P.brooklynPapyrusA, P.brooklynPapyrusRoll, P.snakeAmulets, P.menqebitAmulet],
  },

  // ===========================================================================
  // 6. HORUS CIPPI AND THE METTERNICH STELA
  // ===========================================================================
  {
    slug: "horus-cippi-and-the-metternich-stela",
    title: "Horus on the crocodiles: the Metternich Stela and protective magic against serpents",
    summary:
      "The Metternich Stela (Met 50.85), made under Nectanebo II (360–343 BCE), is the largest of the 'cippi of Horus': stelae showing the child Horus mastering snakes and scorpions, over which water was poured to heal bites.",
    description: `WHAT THE OBJECT IS. A greywacke stela about 84 cm high, now in the Metropolitan Museum (50.85). On its front the child Horus stands on two crocodiles, gripping snakes, scorpions, a lion and an oryx; above him is the face of Bes. Around and on every face are spells and myths about poisonous creatures, including the story of Isis seeking help for the young Horus stung in the marshes. Its text names the priest who had the inscriptions copied, and the Met dates it to the reign of Nectanebo II (360–343 BCE).

HOW IT WAS USED. Water poured over the carved spells and collected in the basin was drunk by the patient, who was thereby identified with Horus healed by Isis and Thoth. The stela is the grandest of many hundreds of 'cippi', from large temple stelae to small amulet-sized pieces, most of the Late and Ptolemaic periods.

HISTORY OF THE OBJECT. Found in 1828 during building work at a Franciscan monastery in Alexandria, given by Muhammad Ali Pasha to Prince Metternich, kept at Kynžvart castle in Bohemia, and bought by the Met in 1950 (Scott 1951).

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a widespread Late Period practice of healing and protection in which the serpent is the enemy and a child-god is the healer. It does not establish a healing serpent: the snakes on the cippi are what is being defeated. That separates it from the Israelite bronze serpent, where the image of the snake itself heals, and from any claim that Egyptian serpents were 'healing' in the same sense; those comparisons are made, and assessed, in the rituals lane. Wadjet's standard appears among the protecting gods on the stela, so the protective cobra and the harmful snake sit side by side on one object.`,
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: healing and protection", "theme: manuscripts and their dates"], "cippus", "horus", "magic"),
    civilisations: ["Ancient Egypt"],
    people: ["Horus", "Isis", "Thoth", "Bes", "Nectanebo II", "Klemens von Metternich", "Muhammad Ali Pasha"],
    locationName: "Found at Alexandria; Metropolitan Museum of Art, New York",
    claims: [
      {
        sourceKey: "met_50_85_metternich_stela",
        citations: [
          { sourceKey: "scott_1951_metternich_stela", relation: "supports", note: "The Met's first publication of the stela and its spells." },
        ],
        startYear: bce(360),
        endYear: bce(343),
        datePrecision: "decade",
        isApproximate: false,
        originalDateText: "Reign of Nectanebo II, 360–343 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "The making of the stela",
        evidence:
          "EVIDENCE TYPE: inscription. The stela's own text names the king; the absolute dates of his reign are among the better fixed in Late Period chronology. It dates this object; many of its spells are older.",
      },
      {
        sourceKey: "scott_1951_metternich_stela",
        startYear: 1828,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Found at Alexandria and given to Metternich in 1828",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "explicit_date",
        whatIsDated: "The modern discovery",
        evidence:
          "EVIDENCE TYPE: later historical account. The find story as given by the Met's publication and repeated in reference works. It says where the stela was reused, not where it first stood (Heliopolis has been suggested). NEEDS SOURCE VERIFICATION for the year against Scott 1951.",
      },
    ],
    media: [P.metternichWhole, P.metternichDetail, P.healingStela],
  },

  // ===========================================================================
  // 7. SNAKE MUMMIES
  // ===========================================================================
  {
    slug: "egyptian-snake-mummies-and-serpent-coffins",
    title: "Snake mummies and serpent coffins: what was buried, when, and what a 2020 scan found",
    summary:
      "Late and Ptolemaic Egypt buried mummified snakes in wooden and bronze coffins topped with rearing cobras; a 2020 micro-CT study of one such mummy found a juvenile Egyptian cobra, kept short of water and killed by whipping.",
    description: `WHAT SURVIVES. Snake mummies in linen packages (Turin, Provv. 1441), wooden coffins with a coiled serpent and a separately made cobra head on the lid (Turin Cat. 2402/01, Cat. 7380), and bronze boxes surmounted by a rearing cobra (Met 04.2.517, 664–30 BCE; Birmingham, 600–100 BCE). Snake burials are known from several sites, but the museum records used here mostly lack a findspot.

WHAT KIND OF MUMMIES. Salima Ikram's widely used classification separates pets, food offerings, sacred animals (a single animal kept and buried as the living image of a god) and votive mummies (animals bred or caught in large numbers, killed and sold to pilgrims as offerings). Most Late Period snake mummies are usually read as votive offerings, many to Atum, with whom snakes and eels were linked, but each needs its own context.

THE 2020 STUDY. Johnston and colleagues scanned a Swansea Egypt Centre package (EC308), accessioned as 'mummified animal, possibly human', with X-ray micro-CT. They identified a juvenile Egyptian cobra (Naja haje), with calcified kidneys that suggest it was kept short of water, a spine and skull broken in a way consistent with being swung by the tail, and probably natron lodged at the opening of its windpipe with the jaw held open, which they suggest may reflect an 'opening of the mouth' procedure. The package has no provenance or date.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that snakes, and specifically cobras, were killed, mummified and buried in large numbers in late Egypt, in containers that make them divine. It does not establish a living sacred snake kept and protected in a temple as Ouidah's pythons were: the scanned cobra was deliberately killed. Votive killing and living-animal protection are different practices, and the evidence here is for the first.`,
    category: "religion",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["theme: living sacred animals", "theme: healing and protection"], "animal mummies", "votive"),
    civilisations: ["Ancient Egypt"],
    people: ["Atum", "Salima Ikram", "Richard Johnston"],
    locationName: "Egypt (findspots mostly unrecorded); Turin, New York, Birmingham and Swansea collections",
    claims: [
      {
        sourceKey: "met_04_2_517_snake_mummy_box",
        citations: [
          { sourceKey: "museo_egizio_snake_coffins", relation: "context", note: "Turin's snake coffins and mummy are of the same type but undated on their records." },
          { sourceKey: "ikram_2005_divine_creatures", relation: "context", note: "The framework that separates sacred animals from votive mummies." },
        ],
        startYear: bce(664),
        endYear: bce(30),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Late Period to Ptolemaic, 664–30 BCE",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "The main period of snake mummy containers",
        evidence:
          "EVIDENCE TYPE: archaeological. Museum period dates based on the style and type of the containers. They date the bulk of the material; they do not exclude earlier snake burials.",
      },
      {
        sourceKey: "johnston_2020_mummified_animals",
        startYear: 2020,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "20 August 2020: micro-CT identification of a mummified juvenile Egyptian cobra",
        datingMethod: "historical_record",
        chronology: "scientific",
        temporalClaimType: "explicit_date",
        whatIsDated: "The scientific study",
        evidence:
          "EVIDENCE TYPE: modern interpretation. A peer-reviewed imaging study, read in full. The species identification and the injuries are observations; the 'opening of the mouth' reading is the authors' suggestion, which they set beside the alternative that the material lodged there during mummification.",
      },
    ],
    media: [P.metSnakeBox, P.turinSnakeMummy, P.turinSnakeCoffin7380, P.birminghamSnakeBox],
  },

  // ===========================================================================
  // 8. OPENING OF THE MOUTH
  // ===========================================================================
  {
    slug: "opening-of-the-mouth-and-the-serpent-blade",
    title: "The Opening of the Mouth and its serpent-headed blade, 'great of magic'",
    summary:
      "Among the implements of the Opening of the Mouth, the rite that gave a statue or mummy the use of its senses, was a curved blade ending in a serpent's (often ram-headed) head, named wr-ḥkꜣw, 'great of magic'.",
    description: `WHAT THE RITE IS. The Opening of the Mouth (wpt-r) was performed on statues and, from at least the New Kingdom, on the mummy at the tomb door, to restore its ability to eat, breathe, see and speak. The fullest versions have some seventy-five episodes. The vignette in the Book of the Dead of Hunefer (BM EA 9901, about 1275 BCE) shows it at the tomb entrance, with priests holding the implements.

THE SERPENT BLADE. One implement is a curved blade whose end is a snake's head, often ram-headed, called wr-ḥkꜣw, 'great of magic' (the same words as the name of the goddess Weret-hekau, who was a power of the crowns and was shown as a cobra or a lion-headed woman). UCL Digital Egypt describes the blade as named in episode 27 of the ritual, with New Kingdom examples of red jasper or carnelian and earlier ones of flint. NEEDS SOURCE VERIFICATION: that page could not be opened from this machine.

HOW OLD. Ann Macy Roth argued (JEA 1993) that the core act imitates clearing a newborn's mouth with the little finger, and that the adze came into the rite from the statue ritual in the Sixth Dynasty; older implements were kept alongside the newer ones. The serpent blade's own first attestation was not established here.

A SCIENTIFIC FOOTNOTE. Johnston et al. 2020 found material at the throat and an open jaw in a mummified cobra and suggested an opening-of-the-mouth procedure on the snake itself; they flag the alternative explanation.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a serpent-shaped ritual instrument whose name means 'great of magic' at the heart of a central Egyptian rite of revivification. It is relevant to this track only as far as it goes: the serpent here is a magical power carried in the priest's hand, not a deity worshipped for itself, and the rite is not a royal coronation.`,
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["theme: priesthood", "theme: healing and protection"], "opening of the mouth", "ritual implements"),
    civilisations: ["Ancient Egypt"],
    people: ["Hunefer", "Anubis", "Weret-hekau", "Ann Macy Roth"],
    locationName: "Thebes (Hunefer's papyrus); the rite was performed across Egypt",
    claims: [
      {
        sourceKey: "bm_ea_9901_hunefer",
        startYear: bce(1275),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "About 1275 BCE: Hunefer's papyrus shows the rite at the tomb door",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        temporalClaimType: "approximate_date",
        whatIsDated: "A dated depiction of the rite",
        evidence:
          "EVIDENCE TYPE: archaeological. The papyrus is dated by its owner's career under Seti I and by style. It dates one depiction, not the rite's origin.",
      },
      {
        sourceKey: "roth_1993_opening_of_the_mouth",
        startYear: bce(2300),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Sixth Dynasty: the adze added to the rite from the statue ritual",
        datingMethod: "textual_interpretation",
        chronology: "archaeological",
        temporalClaimType: "approximate_date",
        whatIsDated: "A stage in the development of the implements",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Roth's reconstruction from Old Kingdom texts and objects, read only in summary here. It dates a change in the tool kit, not the serpent blade. NEEDS SOURCE VERIFICATION.",
      },
    ],
    media: [P.hunefersOpening],
  },

  // ===========================================================================
  // 9. ORACLES AND BARQUE PROCESSIONS
  // ===========================================================================
  {
    slug: "egyptian-barque-oracles-and-the-saite-oracle-papyrus",
    title: "Gods who answered from their barques: Egyptian processional oracles, and Buto's",
    summary:
      "In New Kingdom and later Egypt a god carried in procession in a portable barque gave answers by the movement of the bearers; the Saite Oracle Papyrus (651 BCE) records one such verdict of Amun-Re. The barques were not serpents, and the oracle gods were not serpent gods.",
    description: `HOW THE ORACLE WORKED. On festival days the god's image, hidden in a shrine on a portable barque, was carried on poles by priests. Petitioners put questions, often written as alternatives, and the god answered by the barque moving forward, back, or toward one choice. Many of the best-documented cases are of Amun-Re at Thebes and of the deified Amenhotep I at Deir el-Medina; the barque rite is also how the god was said to choose a king in Kush (see the Kushite lane).

A DATED CASE. The Saite Oracle Papyrus (Brooklyn 47.218.3), dated 4 October 651 BCE in the reign of Psamtik I, records that Pemou asked Amun-Re on behalf of his father Harsiese, a priest of Amun at Karnak, whether he might move to the priesthood of Montu-Re-Horakhty. The god agreed, and the verdict was written up and decorated with the god's barque carried by priests. Its standard edition is Richard A. Parker's of 1962.

WHAT THE PICTURES SHOW. Barques carried on poles by shaven-headed priests: a Koptos stela of the 19th Dynasty with twelve bearers, an ostracon of a divine procession in Berlin, and a barque in Seti I's temple at Abydos. Where serpents appear on such barques it is as uraei in friezes on the shrine or at the prow, the same protective emblem as on the king's brow.

BUTO. Herodotus calls the oracle 'of Leto' at Buto the most honoured in Egypt. Buto was Wadjet's town, but neither he nor any source read here says that oracle spoke through a snake.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a public, processional and partly written oracle system centred on gods such as Amun-Re. It does not establish a serpent oracle in Egypt. Comparisons with the Hueda king consulting the python are made in the Gbe and rituals lanes, and must start from this difference.`,
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: oracle and divination", "theme: procession and coronation", "theme: priesthood", "place: thebes and luxor"], "oracle", "barque"),
    civilisations: ["Ancient Egypt"],
    people: ["Amun-Re", "Pemou", "Harsiese", "Psamtik I", "Amenhotep I", "Herodotus"],
    locationName: "Karnak, Thebes",
    lat: 25.7188,
    lng: 32.6573,
    claims: [
      {
        sourceKey: "brooklyn_47_218_3_saite_oracle_papyrus",
        startYear: bce(651),
        startMonth: 10,
        startDay: 4,
        datePrecision: "day",
        isApproximate: false,
        originalDateText: "4 October 651 BCE: Amun-Re's verdict for Harsiese",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "explicit_date",
        whatIsDated: "A recorded oracle consultation",
        evidence:
          "EVIDENCE TYPE: contemporary written. The papyrus is dated by regnal year, month and day of Psamtik I; the Julian equivalent is the museum's. It establishes one consultation of a barque oracle; it says nothing about serpents.",
      },
      {
        sourceKey: "herodotus_macaulay_histories",
        startYear: bce(430),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Herodotus, about 430 BCE: Buto's oracle 'held most in honour of all'",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "approximate_date",
        whatIsDated: "A Greek report of the oracle at Wadjet's town",
        evidence:
          "EVIDENCE TYPE: later historical account. A visitor's report, partly hearsay, written in Greek terms. It establishes the oracle's reputation, not its method or that its deity was represented by a snake.",
      },
    ],
    media: [P.saiteOracle, P.koptosBarques, P.berlinProcessionOstracon, P.abydosBarque],
  },

  // ===========================================================================
  // 10. APEP IN THE TEXTS
  // ===========================================================================
  {
    slug: "apep-in-the-texts-coffin-texts-to-book-of-gates",
    title: "Apep in the texts: from the first naming in the Coffin Texts to the Book of the Dead and the Book of Gates",
    summary:
      "Apep, the serpent who attacks the sun's barque every night, is named first in the Middle Kingdom Coffin Texts, not in the Pyramid Texts; he is repelled in Book of the Dead spells 7 and 39 and bound, stabbed and fettered in the Amduat and the Book of Gates.",
    description: `WHAT THIS RECORD ADDS. The existing set-sutekh record 'Set spears Apep from the solar barque' covers Set's role. This one dates Apep himself, text by text.

NOT IN THE PYRAMID TEXTS. The Old Kingdom Pyramid Texts are full of serpent charms (utterances 226–243 in Unas's pyramid, to stop real snakes from biting the dead king), but a search of Mercer's translation in this site's archive found no 'Apep' or 'Apophis'. Reference works agree that the name first appears in the Middle Kingdom, and the Coffin Texts are where his first mythological appearances are found. A Naqada I bowl with a large snake opposite a figure in a boat (about 3800 BCE) has been read as an early Apep; that reading is an interpretation of an unlabelled image.

THE NEW KINGDOM. Book of the Dead 7 ('passing over the back of Apep') and 39 ('repulsing the serpent', in which 'Apep falleth down, the enemy of Râ') are the spells explicitly about him. In the seventh hour of the Amduat the serpent Neha-hra is pinned with six knives and strangled by Serqet. In the Book of Gates gods bind and slaughter him (the tenth hour), and in Ramesses I's tomb (KV16) a god confronts the coiled Apep beneath the barque. In tomb and papyrus vignettes the sun god as a cat beheads him (Hunefer, BM EA 9901; Deir el-Medina).

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes Apep as the archetypal enemy-serpent of Egyptian cosmology from the Middle Kingdom to the Ptolemies, never worshipped, always repelled. It does not support treating 'the Egyptian serpent' as one figure: the same culture that wore Wadjet on the king's brow cut Apep into pieces. Any comparison with a venerated West African serpent has to choose which Egyptian serpent it means, and Apep is the opposite of a venerated one.`,
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: apep", "theme: manuscripts and their dates", "place: thebes and luxor"], "apophis", "funerary texts"),
    civilisations: ["Ancient Egypt"],
    people: ["Apep", "Ra", "Set", "Serqet", "Ramesses I"],
    locationName: "Funerary texts from Egyptian burials; royal tombs in the Valley of the Kings",
    lat: 25.7402,
    lng: 32.6014,
    claims: [
      {
        sourceKey: "mercer_1952_pyramid_texts",
        citations: [
          { sourceKey: "renouf_naville_1904_book_of_the_dead", relation: "context", note: "The New Kingdom Book of the Dead names Apep repeatedly, as the Pyramid Texts do not." },
        ],
        startYear: bce(2050),
        endYear: bce(1650),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Middle Kingdom: Apep first named, in the Coffin Texts",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first written naming of Apep",
        evidence:
          "EVIDENCE TYPE: inscription. Coffin Texts are painted on dated Middle Kingdom coffins. The date rests on reference works (summarised in search results) and on the absence of the name in Mercer's Pyramid Texts as searched here; one source dates the first record to the First Intermediate Period. NEEDS SOURCE VERIFICATION for the specific Coffin Text spells.",
      },
      {
        sourceKey: "budge_1905_egyptian_heaven_and_hell",
        citations: [
          { sourceKey: "hornung_1999_books_of_the_afterlife", relation: "supports", note: "The standard dating of the Amduat and the Book of Gates to the New Kingdom royal tombs." },
        ],
        startYear: bce(1300),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "New Kingdom royal tombs: Apep bound, stabbed and fettered in the underworld books",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "approximate_date",
        whatIsDated: "The tomb copies of the Amduat and the Book of Gates",
        evidence:
          "EVIDENCE TYPE: inscription. Copies on the walls of dated royal tombs (Thutmose I or III onward for the Amduat; Horemheb onward for the Book of Gates). The date is of the copies.",
      },
    ],
    passages: [
      {
        label: "Book of the Dead 39: Apep falls",
        reference: "Book of the Dead, chapter 39 (Renouf's numbering)",
        sourceKey: "renouf_naville_1904_book_of_the_dead",
        layers: [
          {
            layer: "translation",
            sourceKey: "renouf_naville_1904_book_of_the_dead",
            language: "English",
            content:
              "Chapter whereby the Serpent Rekrek is repulsed in the Netherworld. Back! down with thee, stabber from Apepi! … The gods who are on the roads overthrow thee. Apep falleth down, the enemy of Râ. … Apep is fallen and is in bonds. The gods of the South, the North, the West and the East bind him; their bonds are upon him.",
            evidence:
              "Renouf's 1904 translation, copied from Project Gutenberg 69566. Renouf notes a copy of this chapter in a tomb at Saqqara (Lepsius's 'Grab 24'). The chapter calls Apep 'the enemy of Râ' throughout.",
          },
        ],
      },
      {
        label: "Book of the Dead 7: the back of Apep",
        reference: "Book of the Dead, chapter 7",
        sourceKey: "renouf_naville_1904_book_of_the_dead",
        layers: [
          {
            layer: "translation",
            sourceKey: "renouf_naville_1904_book_of_the_dead",
            language: "English",
            content:
              "Chapter of passing through the chine of Apepi which is void. Oh, One of Wax, who takest captive and seizest with violence, and livest upon those who are motionless! Let me not become motionless before thee, let me not be paralysed before thee, let not thy venoms enter into my limbs, for my limbs are the limbs of Tmu.",
            evidence:
              "Renouf's 1904 translation. His note reads Apep as the storm-cloud, a nineteenth-century nature-myth interpretation not followed here. The 'One of Wax' links to the ritual practice of making wax images of Apep to destroy them.",
          },
        ],
      },
    ],
    media: [P.ramsesIApep, P.hunefersCat, P.raSlaysApep, P.kv17Gates],
  },

  // ===========================================================================
  // 11. BOOK OF OVERTHROWING APEP
  // ===========================================================================
  {
    slug: "book-of-overthrowing-apep-bremner-rhind",
    title: "The Book of Overthrowing Apep: a temple ritual against the serpent, in Papyrus Bremner-Rhind",
    summary:
      "Papyrus Bremner-Rhind (BM EA 10188, colophon about 305 BCE), from Thebes, contains the 'Book of Overthrowing Apep' and a list of Apep's names: instructions for making images of the serpent and spitting on, trampling, spearing, cutting and burning them to protect the sun.",
    description: `WHAT THE SOURCE IS. A hieratic papyrus written for the priest Nesmin, found at Thebes in 1860 and sold to the British Museum by David Bremner in 1865 (EA 10188). The Museum's description divides it into the Songs of Isis and Nephthys (cols 1–17), the ritual of bringing in Sokar (18–21), the Book of Overthrowing Apep (22–32) and the Names of Apep (32–33). R. O. Faulkner published the text in 1933 and translated it in the Journal of Egyptian Archaeology from 1936.

WHAT THE RITUAL DOES. Priests make an image of Apep (of wax, or drawn on papyrus) and destroy it in stages: spitting on it, defiling it with the left foot, spearing it, fettering it, cutting it with a knife and putting it on the fire, while reciting spells that the sun may travel safely. The 'Names of Apep' list is there so that every form of the enemy is named and so included in the destruction. The Book of the Dead's 'One of Wax' (chapter 7) is the same idea in a funerary text.

THE DATE. The colophon dates the copy; the British Museum gives 305 BCE. A study of the colophon by Spiegelberg (1913) speaks of the time of Alexander IV, whose nominal reign ended about 310 BCE. The two need reconciling against Faulkner; both are kept as claims.

IMAGE GAP: the papyrus itself — British Museum EA 10188, https://www.britishmuseum.org/collection/object/Y_EA10188-13 (no freely licensed photograph of it was found on Wikimedia Commons). The pictures here are related evidence: Apep stabbed with knives at Edfu, and the cat of Ra beheading Apep in Hunefer's papyrus.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a temple cult of execration in which the serpent is ritually destroyed every day for the sake of the sun and the king. It is the exact reverse of a cult that feeds and protects a living serpent, and a reader comparing Egypt with Ouidah should see that both exist in Egypt only in this sense: Egypt protects the cobra as an emblem and destroys the cosmic serpent in effigy.`,
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["figure: apep", "theme: priesthood", "theme: manuscripts and their dates", "place: thebes and luxor"], "execration", "bremner-rhind"),
    civilisations: ["Ancient Egypt"],
    people: ["Apep", "Nesmin", "David Bremner", "R. O. Faulkner"],
    locationName: "Thebes (where the papyrus was found)",
    lat: 25.7,
    lng: 32.64,
    claims: [
      {
        sourceKey: "bm_ea_10188_bremner_rhind",
        citations: [
          { sourceKey: "faulkner_1933_bremner_rhind", relation: "context", note: "The edition in which the colophon is transcribed." },
        ],
        startYear: bce(305),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "305 BCE, according to the colophon (British Museum)",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "explicit_date",
        whatIsDated: "The copying of the papyrus",
        evidence:
          "EVIDENCE TYPE: contemporary written. A dated colophon, as interpreted by the British Museum. It dates the copy, not the composition of the ritual. NEEDS SOURCE VERIFICATION: read only in a search summary.",
      },
      {
        sourceKey: "faulkner_1933_bremner_rhind",
        startYear: bce(311),
        endYear: bce(310),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "The time of Alexander IV, about 311–310 BCE (colophon as studied by Spiegelberg, 1913)",
        datingMethod: "regnal_chronology",
        chronology: "disputed",
        temporalClaimType: "date_range",
        whatIsDated: "The copying of the papyrus (an alternative reading of the colophon)",
        evidence:
          "EVIDENCE TYPE: modern interpretation. A bibliography cites Spiegelberg's 1913 study of the colophon 'from the time of Alexander IV'. The exact year he gives was not read here; the range is this record's inference from Alexander IV's nominal reign. NEEDS SOURCE VERIFICATION.",
      },
    ],
    media: [P.edfuApep, P.hunefersCat],
  },

  // ===========================================================================
  // 12. MEHEN
  // ===========================================================================
  {
    slug: "mehen-the-coiled-protector-and-the-mehen-game",
    title: "Mehen, the coiled one: the protective serpent of the sun's barque and the oldest Egyptian board game",
    summary:
      "Mehen ('the coiled one') is the serpent who coils round the sun god in his barque at night, first in the Coffin Texts and pictured in the Amduat and Book of Gates; a board game shaped as a coiled snake, also called mehen, was played from about 3000 to about 2300 BCE.",
    description: `THE PROTECTOR. Mehen is a protective serpent, the opposite of Apep. In the Middle Kingdom Coffin Texts (especially spells 758–760, studied by Peter Piccione) the dead person passes through the coils of Mehen to be reborn with the sun. In the New Kingdom underworld books the ram-headed sun god stands in a shrine canopied by Mehen's arching body: in the seventh hour of the Amduat and throughout the Book of Gates, whose earliest copy is in the tomb of Horemheb (KV57) and which is pictured in Ramesses I's tomb (KV16).

THE GAME. The mehen board is a stone or faience disc carved as a coiled snake whose body is divided into spaces, head at the centre, played with lion and lioness pieces and small marbles. Boards date from about 3000 BCE (Louvre E 29891, about 2900–2700 BCE) through the Old Kingdom (Chicago, Dynasties 3–6), and the game is shown in Old Kingdom tombs (Hesy-Ra). No boards or scenes date from the Middle or New Kingdom, so the game seems to have stopped being played in Egypt after the Old Kingdom, though boards of the same spiral type continued in Cyprus and the Levant. The rules are not recorded.

GAME AND GOD. The name is the same, and Piccione argued that the game's path from tail to head mirrored the passage through the serpent to rebirth. But the game is older than any text naming the god, and whether the god comes from the game or the game from an older god is unknown.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a protective cosmic serpent coiled round the sun in Egyptian funerary religion from the Middle Kingdom, and a much older snake-shaped game. It does not establish a cult of Mehen with temples or priests, and the encircling 'ouroboros' form on Tutankhamun's second shrine is only probably Mehen. A coiled serpent that surrounds and protects a god is also how Aido-Hwedo is described in the Fon cosmogony; the similarity of image is recorded in the rituals lane, where it has to be weighed against the lack of any route between the two.`,
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: mehen", "theme: healing and protection", "theme: manuscripts and their dates"], "mehen game", "board game"),
    civilisations: ["Ancient Egypt"],
    people: ["Mehen", "Ra", "Horemheb", "Ramesses I", "Peter Piccione"],
    locationName: "Egyptian burials (game boards) and royal tombs in the Valley of the Kings",
    claims: [
      {
        sourceKey: "piccione_1990_mehen",
        citations: [
          { sourceKey: "budge_1905_egyptian_heaven_and_hell", relation: "context", note: "The New Kingdom pictures of Mehen round the sun god that the Coffin Texts anticipate." },
        ],
        startYear: bce(2050),
        endYear: bce(1650),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Middle Kingdom Coffin Texts: Mehen as protector of the sun and the dead",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest texts naming the serpent god Mehen",
        evidence:
          "EVIDENCE TYPE: inscription. Spells painted on Middle Kingdom coffins, as discussed by Piccione (read only through citing works). The date is of the coffins. NEEDS SOURCE VERIFICATION for spell numbers.",
      },
      {
        sourceKey: "piccione_1990_mehen",
        citations: [
          { sourceKey: "hornung_1999_books_of_the_afterlife", relation: "context", note: "The game long precedes the New Kingdom books in which Mehen is pictured." },
        ],
        startYear: bce(3000),
        endYear: bce(2300),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Mehen game boards, about 3000 to about 2300 BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "date_range",
        whatIsDated: "The period the game was played in Egypt",
        evidence:
          "EVIDENCE TYPE: archaeological. Boards from dated contexts and tomb depictions, as listed in reference works; museum dates on the Louvre and Chicago boards agree. It establishes the game; it does not show the game was religious.",
      },
    ],
    passages: [
      {
        label: "Ra under the canopy of Mehen, seventh hour of the Amduat",
        reference: "Amduat, seventh hour, middle register",
        sourceKey: "budge_1905_egyptian_heaven_and_hell",
        layers: [
          {
            layer: "translation",
            sourceKey: "budge_1905_egyptian_heaven_and_hell",
            language: "English",
            content:
              "The boat of Ra, who stands under a canopy formed by the body of the serpent MEHEN; the god is ram-headed and wears a disk on his head, and his name AFU is written twice near him. … This great god journeyeth in this City in the path of the Circle of SAR (Osiris) by means of the utterances of the words of power of Isis and of the words of power of SER, so that he may journey on his way against NEHA-HRA.",
            evidence:
              "Budge 1905, vol. I pp. 140–146, from the site's text archive. In the same register the enemy serpent is pinned with knives: protective and hostile serpents in one scene.",
          },
        ],
      },
    ],
    media: [P.louvreMehen, P.chicagoMehen, P.gatesBarqueKV16, P.horemhebMehen, P.berlinMehen, P.bmMehen, P.enigmaticMehen],
  },

  // ===========================================================================
  // 13. PRIMORDIAL SERPENTS
  // ===========================================================================
  {
    slug: "primordial-serpents-ogdoad-nehebkau-kematef",
    title: "Serpents at the beginning: the Ogdoad's snake goddesses, Nehebkau and Kematef of Medinet Habu",
    summary:
      "In the Hermopolitan creation the four goddesses of the primeval Ogdoad are snake-headed; Nehebkau, a serpent of life-force, is named in the Pyramid Texts; and in late Theban theology Amun as the primordial serpent Kematef rests at Medinet Habu.",
    description: `THE OGDOAD. The eight gods of Hermopolis who existed before creation were four couples (in the usual list Nun and Naunet, Heh and Hauhet, Kek and Kauket, Amun and Amaunet), the males shown frog-headed and the females snake-headed: creatures of the primeval waters and mud. They are pictured in temple reliefs, including at Deir el-Medina.

NEHEBKAU. A serpent god whose name is usually read 'he who harnesses the kas' (life-forces). He is named in the Pyramid Texts of Unas (utterance 229: 'the finger-nail of Atum, which is upon the dorsal vertebra of the Nḥb.w-kȝ.w serpent', in a charm against snakes), is one of the forty-two judges of the Book of the Dead, and was believed to nourish the dead (Walters Art Museum 48.1615).

KEMATEF. Late Theban theology made Amun in serpent form, Kematef ('he who has completed his moment'), the primordial father of the Ogdoad, at rest with them at Djeme, the small temple of Medinet Habu, which Amun of Luxor visited about every ten days to make offerings. The theology is best documented in Ptolemaic and Roman Thebes (Sethe 1929; Klotz 2012); Greek writers' 'Kneph' is related. The small temple itself was begun under Hatshepsut and Thutmose III.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes serpents among Egypt's images of the time before creation and of the life-force, from the Pyramid Texts to the Roman period. It does not establish one primordial serpent: the Ogdoad goddesses, Nehebkau and Kematef are separate figures from separate places and centuries, and Kematef in particular is a late theological construction at one temple. Resemblances to the Fon image of Aido-Hwedo carrying the creator belong in the rituals lane.`,
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["theme: sacred landscape", "place: thebes and luxor"], "ogdoad", "creation", "nehebkau", "kematef"),
    civilisations: ["Ancient Egypt"],
    people: ["Nehebkau", "Kematef", "Amun", "Amaunet", "Naunet", "Hauhet", "Kauket", "Atum"],
    locationName: "Medinet Habu (Djeme), western Thebes",
    lat: 25.7196,
    lng: 32.6008,
    claims: [
      {
        sourceKey: "mercer_1952_pyramid_texts",
        citations: [
          { sourceKey: "walters_48_1615_nehebkau", relation: "supports", note: "A dated figure of Nehebkau and the museum's account of his funerary role." },
        ],
        startYear: bce(2350),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Pyramid of Unas, about 2350 BCE: the Nehebkau serpent in utterance 229",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest written naming of Nehebkau known to this record",
        evidence:
          "EVIDENCE TYPE: inscription. A carved text in a dated pyramid. It dates the carving.",
      },
      {
        sourceKey: "klotz_2012_caesar_city_of_amun",
        citations: [
          { sourceKey: "sethe_1929_amun_acht_urgotter", relation: "context", note: "The classic study of Amun, Kematef and the Ogdoad at Medinet Habu." },
        ],
        startYear: bce(300),
        endYear: 200,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Ptolemaic and Roman Thebes: Kematef and the Ogdoad at Djeme",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "The documented Kematef theology",
        evidence:
          "EVIDENCE TYPE: inscription. Temple inscriptions of the Ptolemaic and Roman period at Thebes, as studied by Klotz and Sethe (neither read here). It does not show the theology is older. NEEDS SOURCE VERIFICATION.",
      },
    ],
    passages: [
      {
        label: "Nehebkau in a serpent charm of Unas",
        reference: "Pyramid Texts, utterance 229 (Sethe §229a–c)",
        sourceKey: "mercer_1952_pyramid_texts",
        layers: [
          {
            layer: "translation",
            sourceKey: "mercer_1952_pyramid_texts",
            language: "English",
            content:
              "229a. To say: This is the finger-nail of Atum, 229b. which is upon the dorsal vertebra of the Nḥb.w-kȝ.w (serpent) and which caused the strife in Wn.w to cease. 229c. Fall, glide away.",
            evidence:
              "Mercer 1952, as held in the site's archive; a short quotation. The spell turns the primordial serpent's subjection by Atum into a charm against snakes.",
          },
        ],
      },
    ],
    media: [P.ogdoadDeirElMedina, P.walterNehebkau, P.medinetHabuSmallTemple, P.medinetHabuExterior, P.champollionKneph],
  },

  // ===========================================================================
  // 14. BOOK OF THE DEAD SERPENT SPELLS
  // ===========================================================================
  {
    slug: "book-of-the-dead-serpent-spells-7-39-87-108",
    title: "Four serpent spells in the Book of the Dead: 7, 39, 87 and 108",
    summary:
      "The Book of the Dead uses serpents in opposite ways: spells 7 and 39 repel Apep, spell 108 overcomes the serpent on the Hill of Bakhu, and spell 87 lets the dead become the serpent Sata, who 'lies down and is born day by day'.",
    description: `WHAT THE SOURCE IS. The Book of the Dead is a set of spells copied on papyrus for burial from the beginning of the New Kingdom (about 1550 BCE) to the Roman period; no two copies contain the same selection. The spell numbers are Lepsius's, from a late Turin papyrus.

THE FOUR SPELLS. (7) 'Passing through the chine of Apepi': the dead refuses to be paralysed by the venom of the 'One of Wax'. (39) 'Repulsing the serpent Rerek': the dead speaks as Ra and as Seth as Apep 'falleth down' and is bound. (108) 'Knowing the Powers of the West': on the Hill of Bakhu, 'upon which heaven resteth', lies a serpent 'five hundred cubits in length' called 'He who dwelleth in his own flame', who at day's end swallows the water and halts the sun's barque until he is made to vomit it and is chained (Renouf's translation; other translations differ in who chains whom). (87) 'Changing into the serpent Sata': 'I am the serpent Seta, whose years are many. I lie down and I am born day by day' (Budge, Papyrus of Ani).

THE ARGUMENT. Spell 87 is the one place among these where the dead wants to BE a serpent, and what is wanted is the snake's renewal: the shed skin as daily rebirth. The other three are defensive.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes in the most widely copied Egyptian religious text both a feared serpent (to be repelled) and a serpent of renewal (to be become). It does not show any single 'serpent doctrine', and Victorian translations quoted here (Renouf 1904, Budge 1895) are old: modern translations (Allen 1974, Faulkner 1985, Quirke 2013) are referenced in the site's ancient-texts archive under 'book-of-the-dead', where each spell can be read in full.`,
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: apep", "theme: healing and protection", "theme: manuscripts and their dates"], "book of the dead", "funerary texts"),
    civilisations: ["Ancient Egypt"],
    people: ["Ani", "Apep", "Sata", "Sobek", "Seth", "Atum"],
    locationName: "Theban and other Egyptian burials",
    claims: [
      {
        sourceKey: "budge_1895_papyrus_of_ani",
        citations: [
          { sourceKey: "renouf_naville_1904_book_of_the_dead", relation: "context", note: "The public-domain translation used here for spells 7, 39 and 108." },
        ],
        startYear: bce(1550),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "From the beginning of the New Kingdom, about 1550 BCE",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The Book of the Dead as a corpus on papyrus",
        evidence:
          "EVIDENCE TYPE: archaeological. Dated by the earliest burials with Book of the Dead papyri and shrouds. Some spells, including chapter 108 according to Renouf's note, have Middle Kingdom forerunners; the date is of the corpus, not each spell.",
      },
      {
        sourceKey: "budge_1895_papyrus_of_ani",
        startYear: bce(1250),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Papyrus of Ani, 19th Dynasty, about 1250 BCE: spell 87 with its vignette",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        temporalClaimType: "approximate_date",
        whatIsDated: "One dated copy of spell 87",
        evidence:
          "EVIDENCE TYPE: archaeological. The papyrus is dated by style to the 19th Dynasty. It dates this copy only.",
      },
    ],
    passages: [
      {
        label: "Spell 87: becoming the serpent Sata",
        reference: "Book of the Dead, chapter 87; Papyrus of Ani, plate XXVII",
        sourceKey: "budge_1895_papyrus_of_ani",
        objectName: "Papyrus of Ani",
        holdingInstitution: "British Museum",
        layers: [
          {
            layer: "translation",
            sourceKey: "budge_1895_papyrus_of_ani",
            language: "English",
            content:
              "THE CHAPTER OF CHANGING INTO SETA. Osiris Ani, triumphant, saith: \"I am the serpent Seta, whose years are many. I lie down and I am born day by day. I am the serpent Seta, which dwelleth in the limits of the earth. I lie down, I am born, I renew myself, I grow young day by day.\"",
            evidence:
              "Budge 1895, p. 337, from the site's text archive (his line numbers removed). The whole spell: the serpent as an image of daily self-renewal.",
          },
        ],
      },
      {
        label: "Spell 108: the serpent on the Hill of Bakhu",
        reference: "Book of the Dead, chapter 108 (Renouf's numbering)",
        sourceKey: "renouf_naville_1904_book_of_the_dead",
        layers: [
          {
            layer: "translation",
            sourceKey: "renouf_naville_1904_book_of_the_dead",
            language: "English",
            content:
              "There is a serpent on the brow of that hill, five hundred cubits in length, three cubits of his forepart are pierced with swords. I know the name of this serpent on his hill: \"He who dwelleth in his own flame\" is his name. Now, at the close of day he turneth down his eyes to Rā; for there cometh a standing still in the Bark and a deep slumber within the ship. And now he swalloweth three cubits of the Great Water.",
            evidence:
              "Renouf 1904, from Project Gutenberg 69566. Renouf's following lines make 'Sutu' (Seth) the one made to flee in chains; modern translators read the passage differently, so only the description of the serpent is quoted here.",
          },
        ],
      },
    ],
    media: [P.aniSpell87],
  },

  // ===========================================================================
  // 15. THE OPET FESTIVAL AND ROYAL PROCESSIONS
  // ===========================================================================
  {
    slug: "opet-festival-at-luxor-an-amun-festival",
    title: "The Opet festival at Luxor: a procession of Amun, not a serpent festival",
    summary:
      "The Opet festival carried the barques of Amun-Re, Mut and Khonsu from Karnak to Luxor each year; its fullest reliefs, in the Luxor colonnade, date principally from Tutankhamun. It is an Amun festival, and serpents appear in it only as royal and divine insignia.",
    description: `WHAT THE FESTIVAL WAS. The 'beautiful festival of Opet' was celebrated at Thebes in the second month of the inundation season. The barques of the Theban triad (Amun-Re, Mut and Khonsu), and the king, travelled from Karnak to Luxor Temple, by land along the processional way or by river in Amun's great barge, and back. At Luxor the king's divine kingship was renewed in the presence of Amun. Under Thutmose III it began on II Akhet 15 and lasted eleven days; by the start of Ramesses III's reign it lasted twenty-four (Darnell, UEE 2010).

THE RELIEFS. The earliest depictions are on Hatshepsut's Red Chapel at Karnak (about 1470 BCE). The fullest are on the walls of the processional colonnade at Luxor built by Amenhotep III; the Epigraphic Survey's facsimile (OIP 112, 1994) shows they were carved principally under Tutankhamun and later usurped. They show the barques carried by priests, the river procession, the king, soldiers, musicians, dancers, butchers and offerings, and preserve songs of the military escort.

THE FESTIVAL IS NOT A SERPENT FESTIVAL. It is a festival of Amun. Serpents in it are the uraeus on the king's brow and the uraei in friezes on the barque shrines and their canopies, the same insignia found on every royal and divine image. No serpent deity is carried, fed or honoured. Royal processions in other reliefs (for example, Ramesses III's sons at Medinet Habu, each with the insignia of his rank, the uraeus reserved for the king) follow the same pattern.

IMAGE GAP: the Opet procession reliefs of the Luxor colonnade — facsimile plates in The Epigraphic Survey, Reliefs and Inscriptions at Luxor Temple, vol. 1 (OIP 112), free from ISAC at https://isac.uchicago.edu/node/3142 (no freely licensed close photograph of the reliefs was found on Commons). The colonnade photograph here shows the building, not the carved scenes.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a great annual procession that bound king, god and city together, with music, offerings and the distribution of food. Points of comparison with the Hueda coronation (procession to a shrine, the king's role, music, gifts) are real and are weighed in the comparison 'Egyptian royal ceremonies and Hueda coronations'; but the god at the centre of Opet is Amun, not a serpent, and that difference has to stay in view.`,
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: procession and coronation", "theme: kingship", "theme: sacred landscape", "place: thebes and luxor", "figure: wadjet and the uraeus"], "opet", "amun", "festival"),
    civilisations: ["Ancient Egypt"],
    people: ["Amun-Re", "Mut", "Khonsu", "Hatshepsut", "Thutmose III", "Amenhotep III", "Tutankhamun", "Ramesses III"],
    locationName: "Luxor Temple and Karnak, Thebes",
    lat: 25.6995,
    lng: 32.6391,
    claims: [
      {
        sourceKey: "epigraphic_survey_1994_opet_oip112",
        startYear: bce(1332),
        endYear: bce(1323),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Reign of Tutankhamun, about 1332–1323 BCE: the Opet reliefs of the Luxor colonnade",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "The carving of the colonnade reliefs",
        evidence:
          "EVIDENCE TYPE: inscription. Reliefs dated by the king who commissioned them (later usurped), as published in facsimile. It dates the reliefs, not the festival, which is older.",
      },
      {
        sourceKey: "darnell_2010_opet_festival",
        startYear: bce(1479),
        endYear: bce(1425),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Under Thutmose III: Opet begins on II Akhet 15 and lasts eleven days",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "The earliest documented festival calendar",
        evidence:
          "EVIDENCE TYPE: inscription. A festival calendar of Thutmose III cited by Darnell from Sethe's Urkunden; known here only through a quotation. NEEDS SOURCE VERIFICATION.",
      },
    ],
    media: [P.luxorColonnade, P.redChapel, P.princesProcession],
  },

  // ===========================================================================
  // 16. GATE SERPENTS AND GUARDED SPACE
  // ===========================================================================
  {
    slug: "gate-serpents-of-the-book-of-gates",
    title: "Serpents that guard the gates: the Book of Gates and the uraeus friezes of sacred space",
    summary:
      "In the Book of Gates each gate of the night is guarded by a serpent standing on its tail who opens to Ra when told his name; on earth, rows of uraei crown shrines and temple walls. In Egypt serpents mark and guard thresholds.",
    description: `WHAT THE SOURCE SAYS. The Book of Gates divides the night into twelve hours separated by gates. Each gate has a name and a door, and its door is guarded by a great serpent standing on its tail; the god Sa calls on it by name to open to Ra. Budge's translation of the second gate: 'This door is guarded by a serpent called SAA-SET, which stands upon its tail… SA saith unto SAT-SET, Open thy door to Ra, throw wide open thy door to KHUTI.' The same formula is used for Aqebi at the third gate and Teka-hra at the fifth. Fire-spitting serpents sweep the corridors before the doors.

THE DATES. The Book of Gates first appears, incomplete, in the tomb of Horemheb (KV57, about 1300 BCE); the first complete copy is on the alabaster sarcophagus of Seti I (about 1279 BCE, now in Sir John Soane's Museum, London), and it was used in royal tombs into the 20th Dynasty.

ON EARTH. Uraeus friezes (rows of rearing cobras) crown shrines, naoi and temple walls (Met 17.192.46 and 47), and winged sun-disks flanked by two uraei stand over temple doorways: the same idea of serpents guarding a boundary, built into sacred architecture.

WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes serpents as guardians of thresholds in Egyptian funerary cosmology and in temple architecture. It does not establish serpent-shaped landscape features: the gates are in the netherworld, and the friezes are on buildings. No Egyptian source read here describes a ditch, earthwork or enclosure made in the form of a serpent or called one. That absence matters for the 'sacred landscape' comparison with Savi's ditch, which is weighed in the rituals and Gbe lanes.`,
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["theme: sacred landscape", "figure: wadjet and the uraeus", "figure: apep", "figure: mehen"], "book of gates", "thresholds"),
    civilisations: ["Ancient Egypt"],
    people: ["Ra", "Sa", "Saa-set", "Aqebi", "Teka-hra", "Horemheb", "Seti I"],
    locationName: "Valley of the Kings, Thebes",
    lat: 25.7402,
    lng: 32.6014,
    claims: [
      {
        sourceKey: "hornung_1999_books_of_the_afterlife",
        startYear: bce(1300),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Tomb of Horemheb, about 1300 BCE: the earliest copy of the Book of Gates",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first known copy",
        evidence:
          "EVIDENCE TYPE: inscription. A copy painted in a dated royal tomb. It dates the earliest surviving copy; it does not show the composition was new then.",
      },
      {
        sourceKey: "budge_1905_egyptian_heaven_and_hell",
        startYear: bce(1279),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Sarcophagus of Seti I, about 1279 BCE: the first complete Book of Gates",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "approximate_date",
        whatIsDated: "The copy Budge translated",
        evidence:
          "EVIDENCE TYPE: inscription. The sarcophagus was made for Seti I, who died about 1279 BCE; Budge follows its text. It dates this copy.",
      },
    ],
    passages: [
      {
        label: "The serpent of the second gate",
        reference: "Book of Gates, gate of the second division (Budge's chapter III)",
        sourceKey: "budge_1905_egyptian_heaven_and_hell",
        objectName: "Sarcophagus of Seti I",
        holdingInstitution: "Sir John Soane's Museum, London",
        layers: [
          {
            layer: "translation",
            sourceKey: "budge_1905_egyptian_heaven_and_hell",
            language: "English",
            content:
              "This door is guarded by a serpent called SAA-SET, which stands upon its tail. The text referring to this serpent reads:— \"He who is over (i.e., has the mastery over) this door openeth to Ra. SA saith unto SAT-SET, 'Open thy door to Ra, throw wide open thy door to KHUTI. The hidden abode is in darkness, so that the transformations of this god may take place.' This portal is closed after this god hath entered in through it, and there is lamentation on the part of those who are in their mountain when they hear this door shut.\"",
            evidence:
              "Budge 1905, vol. II pp. 85–87, from the site's text archive. The formula repeats at each gate with the serpent's name changed.",
          },
        ],
      },
    ],
    media: [P.setiSarcophagus, P.budgeTekaHra, P.kv17Gates, P.uraeusFrieze47],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const S = {
  wadjet: "wadjet-of-buto-cobra-goddess-of-pe-and-dep",
  uraeus: "uraeus-on-the-royal-brow-from-den-to-senusret-ii",
  eye: "uraeus-eye-of-ra-serpent-protecting-the-king",
  brooklyn: "brooklyn-snake-papyrus-and-the-kherep-serqet",
  cippi: "horus-cippi-and-the-metternich-stela",
  mummies: "egyptian-snake-mummies-and-serpent-coffins",
  mouth: "opening-of-the-mouth-and-the-serpent-blade",
  oracle: "egyptian-barque-oracles-and-the-saite-oracle-papyrus",
  apep: "apep-in-the-texts-coffin-texts-to-book-of-gates",
  bremner: "book-of-overthrowing-apep-bremner-rhind",
  mehen: "mehen-the-coiled-protector-and-the-mehen-game",
  primordial: "primordial-serpents-ogdoad-nehebkau-kematef",
  bd: "book-of-the-dead-serpent-spells-7-39-87-108",
  opet: "opet-festival-at-luxor-an-amun-festival",
  gates: "gate-serpents-of-the-book-of-gates",
};

const links: SeedEventLink[] = [
  // ---- inside the lane -------------------------------------------------------
  ...Object.values(S).map((slug) => ({ from: ANCHOR, to: slug, relation: "part_of", note: "One of the kinds of Egyptian serpent evidence the anchor lists, treated in its own record." })),
  { from: S.wadjet, to: S.uraeus, relation: "associated", note: "The uraeus is Wadjet's emblem; her cobra at the king's brow is the same goddess." },
  { from: S.uraeus, to: S.eye, relation: "precedes", note: "The cobra appears at the brow first; the texts that make it the burning Eye protecting the king come after." },
  { from: S.wadjet, to: S.oracle, relation: "related", note: "Buto, Wadjet's town, held the oracle Herodotus thought most honoured; no source read here makes it a serpent oracle." },
  { from: S.brooklyn, to: S.cippi, relation: "related", note: "Two Late Period answers to snakebite: a specialist's handbook and a healing stela." },
  { from: S.brooklyn, to: S.apep, relation: "related", note: "Serqet, patron of the snakebite specialists, is the goddess who strangles Apep in the Amduat." },
  { from: S.mummies, to: S.mouth, relation: "related", note: "The 2020 scan suggests a mouth-opening procedure on a mummified cobra." },
  { from: S.apep, to: S.bremner, relation: "precedes", note: "The funerary spells against Apep are older than the late temple ritual that destroys him in effigy." },
  { from: S.apep, to: S.mehen, relation: "related", note: "Apep attacks and Mehen protects the sun's barque, often in the same scene." },
  { from: S.apep, to: S.bd, relation: "related", note: "Book of the Dead 7 and 39 are the spells explicitly against Apep." },
  { from: S.mehen, to: S.gates, relation: "related", note: "The Book of Gates shows Mehen round the sun god and the serpents that guard each gate." },
  { from: S.primordial, to: S.bd, relation: "related", note: "Nehebkau is one of the Book of the Dead's judges; spell 87 makes the dead a serpent of renewal." },
  { from: S.opet, to: S.oracle, relation: "related", note: "Both rest on the portable barque carried by priests in procession." },
  { from: S.opet, to: S.eye, relation: "related", note: "The only serpents in the Opet scenes are royal and divine uraei." },
  { from: S.gates, to: S.eye, relation: "related", note: "Uraeus friezes on shrines are the built form of the serpent guarding a threshold." },

  // ---- to records other datasets already seed --------------------------------
  { from: S.apep, to: "set-spears-apep", relation: "related", note: "The set-sutekh record covers Set's role at the prow; this one dates Apep himself text by text." },
  { from: S.apep, to: "set-in-the-coffin-texts", relation: "related", note: "The Coffin Texts are where both Set's wider mythology and Apep's name first appear in quantity." },
  { from: S.eye, to: "set-in-the-pyramid-texts", relation: "related", note: "The Pyramid Texts that make the crown's serpent a devourer are the same corpus analysed there for Set." },
  { from: S.bremner, to: "set-spears-apep", relation: "related", note: "The temple ritual destroys Apep in effigy, the earthly counterpart of the combat in the barque." },
  { from: S.uraeus, to: "uraeus-kundalini-comparison", relation: "related", note: "That record weighs a modern Kundalini reading of the uraeus; this one gives the ancient dated evidence." },
  { from: ANCHOR, to: "serpent-is-not-one-symbol", relation: "related", note: "The control record's warning applies inside Egypt too: Wadjet, Apep and Mehen are different serpents." },
  { from: ANCHOR, to: "egyptian-origin-theory-for-vodun-and-orisha", relation: "relevant", note: "The Egyptian-origin theory for Vodun needs exactly this evidence base to be tested against." },
  { from: S.wadjet, to: "hueda-serpents-egypt-and-israel-speculation", relation: "relevant", note: "Eighteenth-century Europeans guessed at an Egyptian origin for Hueda's serpents; Wadjet's evidence is what such a guess would have to meet." },
  { from: S.oracle, to: "siwa-oracle-of-ammon", relation: "related", note: "Another oracle of Amun, consulted in the same processional manner in the desert." },
  { from: S.oracle, to: "greater-dakhleh-stela-oracle-of-seth", relation: "related", note: "A dated oracle verdict of Seth: Egyptian oracles belonged to many gods, none of them serpents." },
  { from: S.opet, to: "hueda-coronation-and-serpent-processions-1725", relation: "related", note: "The Hueda procession to the serpent's house is the event most often set beside Egyptian processions." },
  { from: S.mummies, to: "killing-a-python-from-death-to-ordeal", relation: "related", note: "Contrast: Egypt killed cobras to mummify them; Ouidah punished anyone who killed a python." },
  { from: S.cippi, to: "nehushtan-kundalini-comparison", relation: "related", note: "In the cippi the snake is defeated; in the Nehushtan story the image of the snake heals." },
  { from: S.cippi, to: "asclepius-staff-kundalini-comparison", relation: "related", note: "A Greek healing serpent beside an Egyptian magic in which the serpent is the illness." },
  { from: S.mehen, to: "aido-hwedo-the-rainbow-serpent", relation: "related", note: "Both are protective coiled serpents around a god; recorded as a resemblance, with no route between them." },
  { from: S.mehen, to: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", relation: "related", note: "The existing comparison of cosmic serpents can draw on Mehen's dated evidence." },
  { from: S.wadjet, to: "dan-the-serpent", relation: "related", note: "A cobra goddess of one Delta town against the Gbe serpent vodun Dan: different animals, sexes and roles." },
  { from: S.uraeus, to: "khasekhemwy-horus-and-set", relation: "related", note: "Early Dynastic royal iconography in which the uraeus became standard." },
  { from: S.brooklyn, to: "hueda-serpent-priesthood-and-the-king", relation: "related", note: "Egypt's serpent specialists mastered snakes; Hueda's serpent priests served one. Recorded as a contrast." },
  { from: S.primordial, to: "horus-is-not-one-person", relation: "related", note: "Like Horus, Egypt's primordial serpents are several figures from several places and periods." },

  // ---- to the other lanes ----------------------------------------------------
  { from: ANCHOR, to: A.kush, relation: "related", note: "The Kushite lane takes up the uraeus and Egyptian serpent iconography south of Aswan." },
  { from: ANCHOR, to: A.rituals, relation: "related", note: "The comparisons of gods and rituals start from the Egyptian figures listed here." },
  { from: ANCHOR, to: A.assessment, relation: "evidence_for", note: "The Egyptian side of the evidence weighed in the conclusion." },
  { from: ANCHOR, to: A.routes, relation: "relevant", note: "Any route out of Egypt has to start from what Egypt actually had, and when." },
  { from: ANCHOR, to: A.dan, relation: "related", note: "The tribe of Dan lane deals with the Israelite serpent evidence that is sometimes set beside Egypt's." },
  { from: ANCHOR, to: A.gbe, relation: "related", note: "The Gbe serpent traditions this lane's evidence is compared against." },
  { from: S.wadjet, to: "wadjet-and-dangbe-compared", relation: "evidence_for", note: "The Egyptian evidence for the Wadjet side of the comparison." },
  { from: S.opet, to: "egyptian-royal-ceremonies-and-hueda-coronations-compared", relation: "evidence_for", note: "The Opet procession is the best-documented Egyptian royal ceremony to set beside a Hueda coronation." },
  { from: S.oracle, to: "hueda-python-oracle-braguez", relation: "related", note: "Egypt's oracles spoke through barques of gods like Amun; the Hueda oracle is said to have spoken through the python." },
  { from: S.oracle, to: "anlamani-aspelta-enthronement-journey", relation: "related", note: "In Kush, Amun's barque oracle chose the king: the same procedure on the Nile further south." },
  { from: S.uraeus, to: "kushite-double-uraeus", relation: "precedes", note: "The Egyptian single uraeus is the form the Kushite kings doubled." },
  { from: S.uraeus, to: "gebel-barkal-pinnacle-as-uraeus", relation: "related", note: "A Kushite landscape read as a uraeus: the Egyptian emblem projected onto a mountain." },
  { from: S.gates, to: "savi-serpent-ditch-argument", relation: "related", note: "Egyptian serpents guard gates and walls, but no Egyptian source read here makes a ditch or earthwork a serpent." },
  { from: S.opet, to: "savi-palace-to-python-house-route", relation: "related", note: "A processional route between palace and shrine at Savi, set beside Karnak to Luxor; the god at the end differs." },
  { from: S.mummies, to: "route-b-egypt-kush-sahel-west-africa", relation: "relevant", note: "Egyptian serpent practice ends with the Ptolemaic and Roman periods; any route west has to bridge that gap." },
  { from: S.primordial, to: "naqa-lion-temple-serpent-bodied-apedemak", relation: "related", note: "A Meroitic serpent-bodied god set beside Egypt's serpent forms of the creator." },
  { from: S.wadjet, to: "dangbe-from-israel-or-egypt-history-of-the-idea", relation: "relevant", note: "The history of the idea that Dangbé came from Egypt has to be checked against Wadjet's actual evidence." },
  // Cross-lane links added in review: specific records that bear on each other.
  { from: "wadjet-of-buto-cobra-goddess-of-pe-and-dep", to: "serpents-that-protect-kings-wadjet-kush-dangbe", relation: "evidence_for", note: "Wadjet's own evidence, from the nebty name onward, is the Egyptian side of the comparison of how royal serpents guard a king." },
  { from: "uraeus-eye-of-ra-serpent-protecting-the-king", to: "serpents-that-protect-kings-wadjet-kush-dangbe", relation: "evidence_for", note: "The Pyramid Texts' fiery uraeus protecting the king is the function that comparison sets beside the Kushite double uraeus and Dangbé." },
  { from: "uraeus-on-the-royal-brow-from-den-to-senusret-ii", to: "wadjet-and-dangbe-compared", relation: "evidence_for", note: "The dated uraeus objects show what the Egyptian royal cobra was: a cobra worn as insignia, not a living python." },
  { from: "wadjet-of-buto-cobra-goddess-of-pe-and-dep", to: "kushite-double-uraeus", relation: "precedes", note: "Wadjet, one of the 'Two Ladies', is the cobra the Kushite kings doubled at the brow; Tanutamani's dream names the 'Two Goddesses' on his brow." },
  { from: "horus-cippi-and-the-metternich-stela", to: "healing-serpents-nehushtan-egypt-sakpata-dan", relation: "evidence_for", note: "The cippi and the Metternich Stela are the Egyptian 'image against the bite' in that comparison." },
  { from: "brooklyn-snake-papyrus-and-the-kherep-serqet", to: "healing-serpents-nehushtan-egypt-sakpata-dan", relation: "evidence_for", note: "The Brooklyn treatise and the controllers of Serqet are the Egyptian healing specialists that comparison names." },
  { from: "gate-serpents-of-the-book-of-gates", to: "savi-serpent-ditch-vs-nile-valley-landscapes", relation: "evidence_for", note: "Serpents guarding gates and uraeus friezes on shrines are the Egyptian serpent imagery of sacred space the comparison weighs." },
  { from: "opet-festival-at-luxor-an-amun-festival", to: "savi-serpent-ditch-vs-nile-valley-landscapes", relation: "relevant", note: "The sphinx avenue between Karnak and Luxor is the Egyptian processional route the comparison sets beside Savi's palace-to-temple road." },
  { from: "opet-festival-at-luxor-an-amun-festival", to: "coronation-legitimacy-processions-oaths-compared", relation: "evidence_for", note: "Opet is the Egyptian royal festival in the step-by-step comparison: an Amun festival, not a serpent festival." },
  { from: "opet-festival-at-luxor-an-amun-festival", to: "three-royal-ceremonies-side-by-side", relation: "relevant", note: "The Opet procession reliefs that the side-by-side reading could not show for want of a free image are described here." },
  { from: "egyptian-barque-oracles-and-the-saite-oracle-papyrus", to: "oracles-divination-possession-initiation-compared", relation: "evidence_for", note: "Egypt's barque oracles are the 'moving god' of the oracle comparison." },
  { from: "egyptian-snake-mummies-and-serpent-coffins", to: "living-pythons-images-and-snake-mummies", relation: "evidence_for", note: "The snake mummies, coffins and the 2020 scan are the Egyptian side of the living-animal comparison." },
  { from: "apep-in-the-texts-coffin-texts-to-book-of-gates", to: "cosmic-serpents-apep-mehen-aido-hwedo-damballa", relation: "evidence_for", note: "Apep's textual history is the Egyptian enemy-serpent in the cosmic-serpent comparison." },
  { from: "mehen-the-coiled-protector-and-the-mehen-game", to: "cosmic-serpents-apep-mehen-aido-hwedo-damballa", relation: "evidence_for", note: "Mehen, the coil protecting the sun's barque, is the Egyptian protector-serpent in that comparison." },
];

export const EGYPT: SerpentSection = { sources, events, links };
