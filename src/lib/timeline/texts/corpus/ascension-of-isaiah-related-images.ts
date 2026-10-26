// PICTURES FOR THE ASCENSION OF ISAIAH, CHAPTERS VI–XI.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). No picture of an Ethiopic manuscript of the Ascension, and
// none of the Latin or Slavonic copies of chapters vi–xi, was found on
// Wikimedia Commons (searches for the work's English and Latin titles, its
// manuscripts and the seven heavens; the Commons category "Ascension of
// Isaiah" holds only the papyrus below and two scanned books). So the
// pictures are:
// - a leaf of the Amherst Greek papyrus, the oldest copy of any part of the
//   book in Greek, which Charles (1900) reports holds ii. 4–iv. 4, in the
//   Martyrdom, not the Vision: closely related evidence for the book, not for
//   these chapters, and its identification and date are the file page's
//   (which disagrees with Charles on the date), so it is UNVERIFIED;
// - two medieval pictures of Isaiah being sawn in two, the death the
//   Ascension gives him (xi. 41, and the Martyrdom, v. 1–14): a miniature in
//   the Alcobaça Bible (thirteenth century) and one in a German history Bible
//   (about 1470). They illustrate the legend, which was widely known, not the
//   Ascension's text, and their identifications are the file pages', so both
//   are UNVERIFIED;
// - an engraving of 1881 of the Lower Pool of Siloam at Jerusalem, whose
//   printed caption says an old mulberry tree there is said to mark where
//   Isaiah was sawn asunder: a later tradition about a place, not evidence,
//   and UNVERIFIED.
// Every picture is from a Wikimedia Commons file page, with the licence as
// that page states it, and was looked at before it was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

export const ASCENSION_IMAGES: Placed[] = [
  {
    key: "ascisa-amherst-greek-papyrus-1-verso",
    passageKey: "gnostic.ascisa.vision",
    url: `${COMMONS}/9/9a/Amherst_Greek_Papyrus_1%2C_verso.jpg`,
    sourcePageUrl: `${FILE}Amherst_Greek_Papyrus_1,_verso.jpg`,
    institution: "The Morgan Library & Museum, New York (the file page's source is the Morgan's online record; not checked)",
    accessionNumber: "Amherst Greek Papyrus 1, verso (as the file page names it)",
    objectDate:
      "The file page gives 'between 70 AD and 175 AD'; Charles (1900, p. xxviii) reports Grenfell and Hunt's date for the Greek papyrus of the Ascension as the fifth or sixth century. The two do not agree and neither was checked",
    caption:
      "UNVERIFIED — Related evidence, not chapters vi–xi: three torn fragments of a papyrus leaf, laid side by side on a grey ground, with columns of Greek capitals in a brown ink, broken by holes and worn away at the foot. The file page names it Amherst Greek Papyrus 1, verso, and files it under the Ascension of Isaiah; the Greek papyrus of the Ascension, as Charles reports Grenfell and Hunt's edition, holds ii. 4–iv. 4, which is in the Martyrdom and the Testament of Hezekiah, not the Vision.",
    whatIsUnverified:
      "That this is the papyrus of the Ascension, which leaf and which verses it shows, its present home and its date: all are the file page's (whose date, 70–175 CE, disagrees with the fifth or sixth century Charles reports from Grenfell and Hunt). The Greek was not read for this import.",
    creator: "Unknown scribe",
    credit: "The Morgan Library & Museum, via Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-100), as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "ascisa-alcobaca-bible-martyrdom-of-isaiah",
    passageKey: "gnostic.ascisa.11.41",
    url: `${COMMONS}/b/b9/Mart%C3%ADrio_de_Isa%C3%ADas_%28Biblioteca_Nacional_de_Portugal_ALC.455%2C_fl.229v%29.png`,
    sourcePageUrl: `${FILE}Martírio_de_Isaías_(Biblioteca_Nacional_de_Portugal_ALC.455,_fl.229v).png`,
    institution: "Biblioteca Nacional de Portugal, Lisbon (as the file page says)",
    accessionNumber: "ALC. 455, folio 229 verso (as the file page says)",
    objectDate: "c. 1220s, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — A later picture of the death the Ascension gives Isaiah (xi. 41), not an illustration of its text: a historiated initial in a Latin Bible, in which two men in blue and brown work a two-handled saw down through the head of a kneeling, half-naked, bearded man, with blood running down his face; beside it, in red, the rubric opening the Book of Isaiah ('Incipit ysaias propheta') and the first words of Isaiah 1:1 ('Visio ysaie filii amos'). The file page identifies it as the martyrdom of Isaiah in the Bible of the monastery of Santa Maria de Alcobaça, c. 1220s.",
    whatIsUnverified:
      "The manuscript, its shelfmark, folio and date are the file page's (from the Imago project of the Universidade Nova de Lisboa); the library's own record was not reached. The scene is read as Isaiah from the rubric beside it; the miniature illustrates the legend of his sawing, which was widespread, and nothing shows that its painter knew the Ascension.",
    creator: "Unknown illuminator",
    credit: "Biblioteca Nacional de Portugal (Projecto Imago, IEM, Universidade Nova de Lisboa), via Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-100-expired), as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "ascisa-historienbibel-isaiah-sawn",
    passageKey: "gnostic.ascisa.11.41",
    url: `${COMMONS}/a/ae/Der_Prophet_Jesaja_wird_entzwei_ges%C3%A4gt_-_Historienbibel_um_1470.jpg`,
    sourcePageUrl: `${FILE}Der_Prophet_Jesaja_wird_entzwei_gesägt_-_Historienbibel_um_1470.jpg`,
    objectDate: "About 1470, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — A later picture of the same legend (xi. 41), not an illustration of the Ascension: in a gold-framed miniature against a blue sky and green hills, a naked man hangs upside down by his ankles from a wooden gallows while two men in fifteenth-century dress saw him in two from the groin, his blood pooling on the ground. The file page titles it 'The prophet Isaiah is sawn in two', from a German history Bible (Historienbibel) of about 1470.",
    whatIsUnverified:
      "The identification of the scene as Isaiah, the book it comes from and its date are the file page's, whose source is a newspaper website, not the library that holds the manuscript; which manuscript it is, and where it is, are not given. The picture shows a sawing, not who is sawn.",
    creator: "Unknown illuminator",
    credit: "Wikimedia Commons (source given as an article on wienerzeitung.at)",
    licence: "Public domain (PD-Art, PD-old-100-expired), as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "ascisa-lower-pool-of-siloam-1881",
    passageKey: "gnostic.ascisa.11.41",
    url: `${COMMONS}/4/43/The_Lower_Pool_of_Siloam._The_old_mulberry-tree%2C_supported_by_stones%2C_is_said_to_mark_the_spot_where_the_Prophet_Isaiah_was_sawn_asunder%2C_in_the_presence_of_King_Manasseh_%28NYPL_b10607452-80301%29.jpg`,
    sourcePageUrl: `${FILE}The_Lower_Pool_of_Siloam._The_old_mulberry-tree,_supported_by_stones,_is_said_to_mark_the_spot_where_the_Prophet_Isaiah_was_sawn_asunder,_in_the_presence_of_King_Manasseh_(NYPL_b10607452-80301).jpg`,
    institution: "New York Public Library, Dorot Jewish Division (the scanned copy, as the file page says)",
    imageDate: "1881, as the file page gives it",
    caption:
      "UNVERIFIED — Context only: a page of a nineteenth-century book (page 79, headed 'Jerusalem') with an engraving of a pool under a great twisted tree whose bough is propped on a column of stones, with two figures resting by blocks of stone. The printed caption reads 'The Lower Pool of Siloam. The old mulberry-tree, supported by stones, is said to mark the spot where the Prophet Isaiah was sawn asunder, in the presence of King Manasseh.' It records a later local tradition of the place of Isaiah's death (xi. 41), not evidence of it.",
    whatIsUnverified:
      "The book (the file page's categories name Picturesque Palestine, Sinai, and Egypt, edited by Colonel Wilson) and the year 1881 are the file page's. The tradition the caption reports is the book's; nothing connects the tree or the place with the Ascension's account.",
    creator: "Unknown engraver (the monogram at the lower left was not read)",
    credit: "New York Public Library, via Wikimedia Commons",
    licence: "Public domain (PD-US-expired), as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
