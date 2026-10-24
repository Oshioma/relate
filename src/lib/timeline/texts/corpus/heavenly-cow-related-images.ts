// PICTURES OF THE BOOK OF THE HEAVENLY COW.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"): the witnesses first — Tutankhamun's outermost gilded shrine,
// the oldest copy, and the cow painted in the tomb of Seti I, the copy Budge
// translates — then a drawing of the cow from Budge's own earlier book, then
// related evidence for the goddesses of the story (Hathor as a cow, Sekhmet).
// Every picture is from a Wikimedia Commons file page, with the licence as
// that page states it, and was looked at before it was added.
//
// The two pictures already on the book's timeline marker (Robert Hay's
// watercolour of the KV17 cow, and the cow inside the first shrine of
// Tutankhamun, File:Book_of_the_Heavenly_Cow_KV62.jpg) are not repeated here.

import type { Placed } from "./budge-underworld";

export const HEAVENLY_COW_IMAGES: Placed[] = [
  {
    key: "cow-kv62-outermost-shrine-burton-1923",
    manuscriptKey: "kv62-shrine",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Removing_the_lid_of_the_outermost_shrine.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Removing_the_lid_of_the_outermost_shrine.jpg",
    institution: "Griffith Institute, University of Oxford (Burton photograph); the shrine is in Cairo",
    objectDate: "Reign of Tutankhamun, Eighteenth Dynasty (c. 1332–1323 BCE)",
    imageDate: "16 December 1923",
    caption:
      "Harry Burton's photograph of 16 December 1923 in the burial chamber of Tutankhamun (KV62): two Egyptian foremen, Howard Carter and Arthur Callender (as the file page names them) lift the roof of the first, outermost, of the four gilded shrines round the sarcophagus — the shrine that carries the oldest known copy of the Book of the Heavenly Cow. The text and the cow are on the inside of the shrine and are not visible here.",
    creator: "Harry Burton (1879–1940)",
    credit: "Harry Burton, Public domain, via Wikimedia Commons",
    licence: "Public domain (PD-1923, published 1927; PD-old-80), as the file page states",
    licenceStatus: "open",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "cow-kv17-heavenly-cow-piercy",
    passageKey: "egy.cow.2",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/77/Book_of_the_Heavenly_Cow_KV17.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Book_of_the_Heavenly_Cow_KV17.jpg",
    objectDate: "Reign of Seti I, Nineteenth Dynasty (c. 1290–1279 BCE), as the file page identifies the tomb",
    caption:
      "UNVERIFIED — The Heavenly Cow painted on a tomb wall, which the file page places in the tomb of Seti I (KV17): a great cow with long horns, a row of figures under her belly and legs holding her up, and columns of hieroglyphs on either side — the picture that Budge's section II says is to be made.",
    whatIsUnverified:
      "That the photograph is of KV17 rests on the file page alone (its source is a personal blog); the scene matches Robert Hay's watercolour of the KV17 cow, but the Ramesside tombs carry similar cows and the photograph has not been matched to a published plan. The photographer and date are not established, and the public-domain claim (PD-Art) is the uploader's, made for a photograph of a painted relief.",
    creator: "Edward Piercy, as the file page gives the author",
    credit: "Edward Piercy, via Wikimedia Commons",
    licence: "Public domain (PD-Art; PD-old-100) and Public Domain Mark, as the file page states",
    licenceStatus: "unknown",
    shows: "evidence_photograph",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "cow-budge-1904-nut-plate",
    passageKey: "egy.cow.1.5",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Nut1.JPG",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Nut1.JPG",
    imageDate: "1904, as the file page gives it",
    caption:
      "UNVERIFIED — A drawing of the Heavenly Cow that the file page says is from Budge's The Gods of the Egyptians, vol. I (1904): the sky as a dark cow held up under her belly by Shu with raised arms, a pair of gods at each leg, two boats of the sun beneath her, and a kneeling god with raised arms before her and above her back. Budge lists a plate 'The Cow-goddess Nut' in that volume and describes it on p. 369.",
    whatIsUnverified:
      "That this scan is Budge's plate rests on the file page; the scan has not been compared with a copy of the 1904 book, and which tomb copy the drawing follows is not stated. The page's public-domain tag (US federal government work) does not fit a British book; if the drawing is Budge's 1904 plate it is public domain for its age.",
    creator: "Unnamed draughtsman, in E. A. Wallis Budge, The Gods of the Egyptians (1904), as the file page gives the source",
    credit: "Wikimedia Commons",
    licence: "Public domain, as the file page states (PD-USGov tag, which does not fit; Public Domain Mark)",
    licenceStatus: "unknown",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "cow-hathor-cow-deir-el-bahari-naville-1907",
    passageKey: "egy.cow.1.2",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Hathor-chapel-ThutmosisIII-Deir_el-Bahari-Naville-01.JPG",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Hathor-chapel-ThutmosisIII-Deir_el-Bahari-Naville-01.JPG",
    institution: "Egyptian Museum, Cairo",
    accessionNumber: "JE 38574–38575",
    objectDate: "Reign of Thutmose III, Eighteenth Dynasty (c. 1450 BCE, as the file page dates the chapel)",
    imageDate: "1907",
    caption:
      "Related evidence, not an illustration of this book: Naville's photograph of 1907 of the Hathor chapel of Thutmose III at Deir el-Bahari as it was found, with the painted sandstone statue of Hathor as a cow standing in its vaulted shrine. The goddess whom Ra's Eye becomes in section I is Hathor, and the book's sky is a cow.",
    creator: "Henry Édouard Naville (1844–1926)",
    credit: "Édouard Naville, The XIth Dynasty Temple at Deir el-Bahari I (1907), pl. XXVII; Public domain, via Wikimedia Commons",
    licence: "Public domain (PD-old-70) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "cow-sekhmet-louvre-a7-a8-janmad",
    passageKey: "egy.cow.1.2",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Sekhmet_statues_Louvre.JPG",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Sekhmet_statues_Louvre.JPG",
    institution: "Musée du Louvre, Paris",
    accessionNumber: "A 8 (left), A 7 (right)",
    objectDate: "Reign of Amenhotep III, Eighteenth Dynasty (c. 1390–1353 BCE)",
    imageDate: "26 July 2009",
    caption:
      "Related evidence, not an illustration of this book: two seated diorite statues of the lion-headed goddess Sekhmet, each with a sun disk and uraeus, made for Amenhotep III and later moved to the temple of Mut at Karnak (the right-hand one reinscribed by Shoshenq I). In section I the slaughter of mankind is carried on by 'Sekhet of the offerings', Budge's name for Sekhmet.",
    creator: "Janmad",
    credit: "Janmad, via Wikimedia Commons",
    licence: "GNU Free Documentation License 1.2+ and Creative Commons Attribution 3.0 Unported (CC BY 3.0), as the file page states",
    licenceStatus: "attribution",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];
