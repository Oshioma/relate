// PICTURES OF BLAVATSKY'S ISIS UNVEILED (1877) AND THE SECRET DOCTRINE (1888).
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). There is no manuscript of the Book of Dzyan to photograph:
// none has ever been produced. The direct evidence for this record is
// therefore the printed first editions themselves: pages of scanned
// first-edition copies on Wikimedia Commons (the Wellcome Collection's 1888
// Secret Doctrine, vol. II, and Cornell's 1877 Isis Unveiled, vol. I), each
// checked against the same page of the archive.org scan. Then portraits of the
// author, whose identity is secure, and two pictures whose date or form rests
// on their file pages alone, marked UNVERIFIED. Every picture is from a
// Wikimedia Commons file page, with the licence as that page states it, and
// was looked at before it was added.
//
// Isis_Unveiled.jpg is already on the "blavatsky-isis-unveiled" timeline
// marker and is not repeated here. The_Secret_Doctrine.gif, described on
// Commons as the cover of the 1888 edition, is the cover of a modern
// Theosophical University Press paperback and was left out;
// Secretdoctrineblav.jpg was looked at and left out for the same reason (it
// is not a first-edition page).
//
// The pages of a Commons PDF are given as that file's page thumbnails; the
// "page" in the URL is the PDF's page, not the book's.

import type { Placed } from "./budge-underworld";

const SD2_PDF = "The_secret_doctrine_-_the_synthesis_of_science%2C_religion%2C_and_philosophy_%28IA_b24886142%29.pdf";
const SD2_PAGE = "https://commons.wikimedia.org/wiki/File:The_secret_doctrine_-_the_synthesis_of_science,_religion,_and_philosophy_(IA_b24886142).pdf";
const IU1_PDF = "Isis_unveiled_-_a_master-key_to_the_mysteries_of_ancient_and_modern_science_and_theology_%28IA_cu31924092304579%29.pdf";
const IU1_PAGE = "https://commons.wikimedia.org/wiki/File:Isis_unveiled_-_a_master-key_to_the_mysteries_of_ancient_and_modern_science_and_theology_(IA_cu31924092304579).pdf";

const pdfPage = (hash: string, file: string, page: number) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash}/${file}/page${page}-960px-${file}.jpg`;

export const BLAVATSKY_IMAGES: Placed[] = [
  // ---- the printed first editions
  {
    key: "hpb-sd-1888-vol2-title-wellcome",
    passageKey: "modern.hpb.anthro",
    url: pdfPage("1/1e", SD2_PDF, 7),
    sourcePageUrl: `${SD2_PAGE}?page=7`,
    institution: "Wellcome Collection (scan by the Internet Archive, b24886142)",
    objectDate: "1888 (the date printed on the title page)",
    caption:
      "The title page of the first edition of The Secret Doctrine, volume II, Anthropogenesis (London: The Theosophical Publishing Company, Limited; New York: William Q. Judge; Adyar, Madras: the Manager of the Theosophist; 1888), from the Wellcome Collection's copy, with the Sanskrit motto 'There is no Religion higher than Truth'. This is the edition whose pages the archive cites; the Stanzas of Anthropogenesis begin on its p. 15.",
    creator: "H. P. Blavatsky (author); The Theosophical Publishing Company (publisher)",
    credit: "Wellcome Collection, via the Internet Archive and Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "hpb-sd-1888-vol2-p15-stanzas-wellcome",
    passageKey: "modern.hpb.anthro.1",
    url: pdfPage("1/1e", SD2_PDF, 35),
    sourcePageUrl: `${SD2_PAGE}?page=35`,
    institution: "Wellcome Collection (scan by the Internet Archive, b24886142)",
    objectDate: "1888",
    caption:
      "Page 15 of The Secret Doctrine, volume II (1888), in the Wellcome Collection's copy: under the running head 'Stanzas from the Book of Dzyan', the heading 'Anthropogenesis in the Secret Volume. (Verbatim extracts.)' and slokas 1–5, set in small capitals, with Blavatsky's footnote that only forty-nine slokas out of several hundred are given. A page of the printed book: no manuscript of the Book of Dzyan has ever been produced.",
    creator: "H. P. Blavatsky",
    credit: "Wellcome Collection, via the Internet Archive and Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "hpb-isis-1877-vol1-title-cornell",
    passageKey: "modern.hpb.isis",
    url: pdfPage("a/a0", IU1_PDF, 7),
    sourcePageUrl: `${IU1_PAGE}?page=7`,
    institution: "Cornell University Library (scan by the Internet Archive, cu31924092304579)",
    objectDate: "1877 (the date printed on the title page)",
    caption:
      "The title page of the first edition of Isis Unveiled, volume I, Science ('A Master-Key to the Mysteries of Ancient and Modern Science and Theology'), New York: J. W. Bouton, 1877, from Cornell University Library's copy; the author is styled 'Corresponding Secretary of the Theosophical Society', and London is given as Bernard Quaritch. The archive cites Isis Unveiled by the pages of this edition.",
    creator: "H. P. Blavatsky (author); J. W. Bouton (publisher)",
    credit: "Cornell University Library, via the Internet Archive and Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "hpb-isis-1877-vol1-p507-cornell",
    passageKey: "modern.hpb.isis.1.507",
    url: pdfPage("a/a0", IU1_PDF, 565),
    sourcePageUrl: `${IU1_PAGE}?page=565`,
    institution: "Cornell University Library (scan by the Internet Archive, cu31924092304579)",
    objectDate: "1877",
    caption:
      "Page 507 of Isis Unveiled, volume I (1877), in Cornell University Library's copy, headed 'The Sacred Tetragram': Blavatsky's account of the Smaragdine Tablet found 'on the dead body of Hermes, at Hebron', and her English of the Tablet's precepts. A page of the printed book, not of any tablet.",
    creator: "H. P. Blavatsky",
    credit: "Cornell University Library, via the Internet Archive and Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- the author
  {
    key: "hpb-portrait-loc-bain",
    passageKey: "modern.hpb.sd.1",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/10/Mme._Blavatsky%2C_head-and-shoulders_portrait_LCCN2005688465.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Mme._Blavatsky,_head-and-shoulders_portrait_LCCN2005688465.jpg",
    institution: "Library of Congress, Prints and Photographs Division (George Grantham Bain Collection)",
    accessionNumber: "LCCN 2005688465",
    objectDate: "Undated in the Library of Congress record",
    caption:
      "Helena Petrovna Blavatsky (1831–1891), head and shoulders, her chin resting on her hand, in an oval frame: a photograph from the Bain news-photograph collection, catalogued by the Library of Congress as 'Mme. Blavatsky'. The photograph is undated.",
    creator: "Unknown photographer",
    credit: "Library of Congress, Bain Collection, via Wikimedia Commons",
    licence: "Public domain (no known copyright restrictions; PD-US-no notice, PD-Bain), as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "hpb-portrait-rijksmuseum-wrinkles",
    passageKey: "modern.hpb.sd.1.viii",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Portret_van_Helena_Blavatsky%2C_RP-F-2001-7-67-105.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Portret_van_Helena_Blavatsky,_RP-F-2001-7-67-105.jpg",
    institution: "Rijksmuseum, Amsterdam",
    accessionNumber: "RP-F-2001-7-67-105",
    objectDate: "c. 1881 – in or before 1891, as the file page gives it",
    caption:
      "A printed photograph of Blavatsky in late life, wrapped in a dark shawl, her cheek on her hand, on page 124 of an album or book, with a handwritten caption: 'H. P. Blavatsky \"in all the majesty of her wrinkles\"'.",
    creator: "Unknown photographer",
    credit: "Rijksmuseum, Amsterdam, via Wikimedia Commons",
    licence: "CC0 1.0 (public domain dedication), as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "hpb-portrait-schmiechen",
    passageKey: "modern.hpb.sd.2",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/61/HPB_by_Schmiechen.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:HPB_by_Schmiechen.jpg",
    objectDate: "Painted 1884, as the file page describes it; the file page dates the reproduction 1886",
    caption:
      "Hermann Schmiechen's oil portrait of Blavatsky, seated three-quarter length against a stone pillar, a finger to her temple and a roll of paper in her hand: a reproduction of the painting.",
    creator: "Hermann Schmiechen",
    credit: "Hermann Schmiechen, Public domain, via Wikimedia Commons",
    licence: "Public domain (PD-old-70), as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "hpb-photograph-1887-norwood",
    passageKey: "modern.hpb.cosmo",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/H.P.Blavatsky_1887.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:H.P.Blavatsky_1887.jpg",
    objectDate: "1887, as the file page gives it (not checked)",
    caption:
      "UNVERIFIED — Blavatsky seated in a carved armchair by a window, reading a sheet of paper, with a covered box on the table before her. The file page dates the photograph to 1887 and places it at Mabel Collins's house in Norwood, London, the year she was preparing The Secret Doctrine for the press; that date, place and the photographer are not verified. The sitter is Blavatsky.",
    whatIsUnverified:
      "The date (1887), the place (Mabel Collins's house, Norwood) and the photographer, which rest on the Commons file page alone (its source is a Russian website, lomonosov.org, and it gives the author as unclear).",
    creator: "Unknown photographer",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-old) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "hpb-theosophical-society-seal",
    passageKey: "modern.hpb.sd.1.xliii",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/94/Tsseal1875.gif",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Tsseal1875.gif",
    caption:
      "UNVERIFIED — The emblem of the Theosophical Society, the movement Blavatsky co-founded in New York in 1875: a serpent biting its tail (ouroboros) encircling two interlaced triangles with an ankh at the centre and a swastika at the top. A modern redrawing; the file page says it is based on documents published since 1875, but its exact form at any date is not verified.",
    whatIsUnverified:
      "That this drawing reproduces the Society's seal as it stood in 1875 or in 1877–1888: the file is a modern redrawing 'based on various published documents since 1875', and the form of the seal changed over time (this drawing has no motto, though the Society's motto 'There is no Religion higher than Truth' stands on the title page of the 1888 Secret Doctrine).",
    creator: "Unknown (modern redrawing)",
    credit: "Wikimedia Commons",
    licence: "Public domain, as the file page states",
    licenceStatus: "open",
    shows: "diagram",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
