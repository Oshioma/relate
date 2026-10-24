// PICTURES FOR THE BOOK OF THE SECRETS OF ENOCH (2 ENOCH).
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). No picture of a Slavonic manuscript of 2 Enoch, of either
// recension, was found on Wikimedia Commons (searches for the work's English,
// Russian and Latin titles, its manuscripts and the seven heavens). So the
// pictures are:
// - three pages of the edition imported here, Morfill and Charles 1896, from
//   the Cornell copy whose page images the text was proofread against: the
//   title page, p. 1 (the heading, A's title and the opening) and p. 37
//   (xxix. 4–xxx. 3, the planets in their circles, with Charles's footnotes
//   and commentary). These are what they say they are, so they are secure;
// - the opening leaf of a fourteenth-century copy of Merilo Pravednoe ('The
//   Just Balance'), the judicial codex in whose copies, as Orlov and
//   Wikipedia report, the oldest extracts of 2 Enoch survive. The leaf shown
//   is the codex's title and list of contents, not the Enoch extracts, and
//   whether this copy is one of the manuscripts the scholars count was not
//   checked, so it is UNVERIFIED;
// - later pictures of Enoch: a seventeenth-century icon of the prophets
//   Elijah and Enoch (the two men the Bible says were taken up alive), an
//   engraving of 1728 from the Figures de la Bible of Enoch rising on a cloud
//   before onlookers, an autotype of 1877 after F. J. Shields of Enoch
//   'translated' (Hebrews 11:5), and William Blake's lithograph 'Enoch' of
//   about 1806–7, the patriarch enthroned with an open book among figures of
//   the arts. They illustrate the biblical Enoch and later ideas of him, not
//   2 Enoch's text (which none of their makers is shown to have known), and
//   their identifications are the file pages', so all are UNVERIFIED.
// Considered and left out: the Met's Commons file of Blake's 'Enoch'
// (DP830189), which is the back of the sheet, with Blake's written recipe for
// the process; the CC BY-SA photograph of a second copy of the Merilo leaf
// (the same leaf, so no more evidence); another icon and a fresco of Elijah
// and Enoch (more of the same subject); and a Schnorr von Carolsfeld woodcut
// catalogued under Enoch that shows Cain's city of Henoch, a different Enoch.
// Every picture is from a Wikimedia Commons file page, with the licence as
// that page states it, and was looked at before it was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

const BOOK_PDF = "The_book_of_the_secrets_of_Enoch%3B_%28IA_cu31924014633568%29.pdf";
const BOOK_PAGE = `${FILE}The_book_of_the_secrets_of_Enoch;_(IA_cu31924014633568).pdf`;
const pdfPage = (page: number) => `${COMMONS}/thumb/0/0d/${BOOK_PDF}/page${page}-960px-${BOOK_PDF}.jpg`;

const BOOK_CREDIT = "Cornell University Library, scanned by the Internet Archive (cu31924014633568), via Wikimedia Commons";
const BOOK_LICENCE = "Public domain (PD-old-100-expired) and Public Domain Mark, as the file page states";
const BOOK_CREATOR = "W. R. Morfill (translator) and R. H. Charles (editor); Clarendon Press, Oxford (publisher)";

export const ENOCH_IMAGES: Placed[] = [
  // ---- the edition imported here
  {
    key: "2en-morfill-charles-1896-title-page",
    passageKey: "gnostic.2en.book",
    url: pdfPage(9),
    sourcePageUrl: `${BOOK_PAGE}?page=9`,
    institution: "Cornell University Library (the scanned copy, via the Internet Archive)",
    accessionNumber: "Internet Archive cu31924014633568",
    objectDate: "1896 (the date printed on the title page)",
    caption:
      "The title page of the edition this archive imports: 'The Book of the Secrets of Enoch, translated from the Slavonic by W. R. Morfill, M.A., Reader in Russian and the other Slavonic languages, and edited, with introduction, notes and indices by R. H. Charles, M.A., Trinity College, Dublin, and Exeter College, Oxford. Oxford, at the Clarendon Press, 1896', from Cornell University Library's copy.",
    creator: BOOK_CREATOR,
    credit: BOOK_CREDIT,
    licence: BOOK_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "2en-morfill-charles-1896-page-1",
    passageKey: "gnostic.2en.prologue",
    url: pdfPage(53),
    sourcePageUrl: `${BOOK_PAGE}?page=53`,
    institution: "Cornell University Library (the scanned copy, via the Internet Archive)",
    accessionNumber: "Internet Archive cu31924014633568",
    objectDate: "1896",
    caption:
      "Page 1 of Morfill and Charles (1896): the heading 'The Book of the Secrets of Enoch the son of Ared; a man wise and beloved of God', manuscript A's title in square brackets, '[*Concerning the Life and the Dream of Enoch.]', the opening paragraph and the start of chapter i. Charles's footnotes below say that B gives the title as 'These are the secret books of God which were shown to Enoch', that the introduction 'is entirely wanting in B', and that he keeps A's headings in brackets because 'they do not belong to the original text'.",
    creator: BOOK_CREATOR,
    credit: BOOK_CREDIT,
    licence: BOOK_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "2en-morfill-charles-1896-page-37",
    passageKey: "gnostic.2en.30",
    url: pdfPage(89),
    sourcePageUrl: `${BOOK_PAGE}?page=89`,
    institution: "Cornell University Library (the scanned copy, via the Internet Archive)",
    accessionNumber: "Internet Archive cu31924014633568",
    objectDate: "1896",
    caption:
      "Page 37 of Morfill and Charles (1896), headed 'Chapters XXIX. 4—XXX. 3', showing how the edition is laid out: Morfill's English at the top (the third and fourth days of creation, ending 'In the first and highest circle I placed the star Kruno; and on the second Aphrodite'), Charles's textual footnotes on the readings of A, B and Sokolov's text beneath, and his commentary in two columns at the foot, citing Jubilees, Philo and the Chronography of Joel. The archive imports the English, and lists but does not import the notes and commentary.",
    creator: BOOK_CREATOR,
    credit: BOOK_CREDIT,
    licence: BOOK_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- closely related evidence: the codex the oldest extracts are found in
  {
    key: "2en-merilo-pravednoe-troitsky-codex-leaf-2",
    passageKey: "gnostic.2en.book",
    url: `${COMMONS}/d/d3/Merilo_Pravednoe_Troitskiy_codex_page_2.jpg`,
    sourcePageUrl: `${FILE}Merilo_Pravednoe_Troitskiy_codex_page_2.jpg`,
    institution: "Trinity-Sergius Lavra library (now in the Russian State Library), as the related Commons file of the same leaf says; not checked",
    accessionNumber: "Troitsky codex, leaf 2, as the file page names it (another Commons file of the same leaf names it Trinity-Sergius Lavra MS No. 15, fond 304.I); not checked",
    objectDate: "Fourteenth century, as the file page gives it; not checked",
    imageDate: "A photograph of a plate in B. D. Grekov (ed.), Pravda Russkaya, vol. III (Moscow, 1963), as the file page says",
    caption:
      "UNVERIFIED — Related evidence, not a page of 2 Enoch: a photograph of a printed facsimile of a manuscript leaf, with a band of interlace and two birds at the head, and below, in red Cyrillic capitals, the opening of the codex's title and contents, beginning 'Сиꙗ книги Мерило праведное' ('These books, the Just Balance'), then the first lines of the text in black, numbered 2 at the foot. The file page identifies it as leaf 2 of the fourteenth-century Troitsky codex of Merilo Pravednoe, the law book in whose copies, as Orlov reports, the oldest surviving extracts of 2 Enoch (from its chapters 40–65, rearranged) are found.",
    whatIsUnverified:
      "The codex, its holding library, its date and the leaf number are the file page's. Whether this copy is one of the Merilo Pravednoe manuscripts in which Orlov and Wikipedia say the Enoch extracts survive (MPr and the Trinity-Sergius copies TSS 253, 489 and 682) was not checked; the leaf shown is the codex's title and contents, not the Enoch extracts. The Church Slavonic was read only as far as the title.",
    creator: "Unknown scribe; facsimile published by B. D. Grekov (1963)",
    credit: "Photograph of Pravda Russkaya, vol. III (Moscow, 1963), via Wikimedia Commons",
    licence: "Public domain, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  // ---- later pictures of Enoch taken up
  {
    key: "2en-sanok-icon-elijah-and-enoch",
    passageKey: "gnostic.2en.67",
    url: `${COMMONS}/b/b4/MHS_Eliasz_i_Enoch_XVII_w_p.jpg`,
    sourcePageUrl: `${FILE}MHS_Eliasz_i_Enoch_XVII_w_p.jpg`,
    institution: "Historical Museum in Sanok, Poland (as the file page says)",
    objectDate: "Seventeenth century, as the file page gives it; not checked",
    imageDate: "Photographed August 2007, as the file page says",
    caption:
      "UNVERIFIED — A later picture of Enoch, not an illustration of 2 Enoch: a painted wooden icon in a carved and gilded frame, in which two haloed, white-bearded old men sit before a rocky hill, the one on the left in a brown fur garment labelled 'Енох' (Enoch), the one on the right in a red cloak holding an open book, labelled 'Илия' (Elijah), with a raven above them; the inscription at the top reads 'The holy prophets Elijah and Enoch'. The two are paired as the men the Bible says were taken up without dying, as 2 Enoch has Enoch taken up (lxvii).",
    whatIsUnverified:
      "The museum, the date and the attribution to an icon of the seventeenth century are the file page's; the museum's own record was not reached. The icon shows the biblical Enoch; nothing shows that its painter knew 2 Enoch, though the book was read in Slavonic in the region.",
    creator: "Unknown icon painter",
    credit: "Photograph by Przykuta, Historical Museum in Sanok, via Wikimedia Commons",
    licence: "Public domain (PD-old; the photographer's own photograph released as public domain), as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "2en-hoet-figures-de-la-bible-1728-god-took-enoch",
    passageKey: "gnostic.2en.67",
    url: `${COMMONS}/3/33/Figures_God_took_Enoch.jpg`,
    sourcePageUrl: `${FILE}Figures_God_took_Enoch.jpg`,
    institution: "Bizzell Bible Collection, University of Oklahoma Libraries (the copy, as the file page says)",
    objectDate: "1728, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — A later picture of Enoch taken up, not an illustration of 2 Enoch: an engraving in which a bearded old man in a cloak rises on a bank of dark cloud towards a burst of light, while a crowd of men, women and children below throw up their arms or kneel, one man fallen back on the ground beside a low wall. The file page identifies it as 'God took Enoch' (Genesis 5:24) from the Figures de la Bible (The Hague: P. de Hondt, 1728), after Gerard Hoet and others. The watching crowd may be set beside 2 Enoch lxvii, where the people see Enoch taken up and go home glorifying God, but the engraving illustrates Genesis.",
    whatIsUnverified:
      "The book, the year, the publisher and the attribution to Gerard Hoet are the file page's (whose image came from a mythology website, from the University of Oklahoma's copy); the plate was not compared with a copy of the book. Its makers illustrated Genesis, and nothing shows they knew 2 Enoch, then unknown in the West.",
    creator: "Gerard Hoet (1648–1733) and others, designers; published by P. de Hondt, The Hague (as the file page says)",
    credit: "University of Oklahoma Libraries (Bizzell Bible Collection), via Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired), as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "2en-shields-enoch-translated-1877-wellcome",
    passageKey: "gnostic.2en.67",
    url: `${COMMONS}/a/a7/Enoch_is_spared_death_and_%27translated%27_to_heaven._Autotype_a_Wellcome_V0034407.jpg`,
    sourcePageUrl: `${FILE}Enoch_is_spared_death_and_'translated'_to_heaven._Autotype_a_Wellcome_V0034407.jpg`,
    institution: "Wellcome Collection, London (as the file page says)",
    accessionNumber: "Wellcome Images V0034407 (as the file page says)",
    objectDate: "1877, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — A later picture of Enoch taken up, not an illustration of 2 Enoch: an old, bearded man in long robes, arms raised and face turned upward, rising on a cloud through shafts of light; signed 'Fred. J. Shields' and 'Autotype', with the title 'Enoch' and the line 'By faith Enoch was translated, that he should not see death. Hebrews XI. 5.' It illustrates the biblical verse, which 2 Enoch expands into its account of Enoch's two ascents (i–iii, lxvii).",
    whatIsUnverified:
      "The date (1877) and the description of the print as an autotype after Frederick James Shields are the file page's, from the Wellcome's catalogue, which was not reached. The picture illustrates Hebrews 11:5, not 2 Enoch, which was published in English only in 1896.",
    creator: "Frederick James Shields (artist)",
    credit: "Wellcome Collection, CC BY 4.0, via Wikimedia Commons",
    licence: "CC BY 4.0, as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "2en-blake-enoch-lithograph-british-museum",
    passageKey: "gnostic.2en.23",
    url: `${COMMONS}/d/db/Enoch_%28BM_1874%2C0711.1028%29.jpg`,
    sourcePageUrl: `${FILE}Enoch_(BM_1874,0711.1028).jpg`,
    institution: "British Museum, London (as the file page says)",
    accessionNumber: "1874,0711.1028 (as the file page says)",
    objectDate: "1806–7, as the file page gives it (its date field says about 1803–1807); not checked",
    caption:
      "UNVERIFIED — A later idea of Enoch, not an illustration of 2 Enoch: a lithograph in which a long-bearded patriarch sits enthroned on a stepped platform in rays of light, a large open book across his knees; around him a kneeling woman writes with a quill, a naked youth holds a palette and brush, a woman kneels with a lyre, and winged figures in the air on either side hold up scrolls or a tablet, within a border of vines and grapes; signed 'W Blake inv'. Enoch as the giver of writing and the arts may be set beside 2 Enoch xxiii, where he writes 366 books at the archangel Vretil's dictation, but Blake's source was not this book.",
    whatIsUnverified:
      "The title, the attribution to William Blake (beyond the signature read on the print), the date and the British Museum number are the file page's; the Museum's record was not reached. Blake's 'Enoch' draws on the biblical and other Enoch traditions; 2 Enoch was not published until 1880 (in Slavonic) and 1896 (in English), so he cannot have known it.",
    creator: "William Blake (designer and printmaker)",
    credit: "British Museum, via Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired; PD-scan), as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
