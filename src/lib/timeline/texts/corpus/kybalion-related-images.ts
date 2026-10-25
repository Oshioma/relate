// PICTURES OF THE KYBALION (CHICAGO, 1908) AND ITS SETTING.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). First the book itself: pages of the Brigham Young University
// copy of 1908, the copy Wikisource transcribed and the base of this import,
// shown from its DjVu on Wikimedia Commons (its title page is the marker's
// picture, in marker-pictures.ts, and is not repeated here). Then the evidence
// for the book's usual attribution: a page of the 1919 Post Office transcript
// in which the publisher's owners speak of William Walker Atkinson and of
// "Yogi Ramacharaka". Then portraits of Atkinson, context for the attribution,
// not evidence of authorship; their dates and origins rest on their file pages
// and are marked UNVERIFIED. The Kybalion has no ancient manuscript or object
// to show: the "Kybalion" it quotes was, by the book's own account, never
// written down. Every picture is from a Wikimedia Commons file page, with the
// licence as that page states it, and was looked at before it was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";
const DJVU = "Kybalion_-_a_study_of_the_hermetic_philosophy_of_ancient_Egypt_and_Greece_%281908%29.djvu";
const djvuPage = (page: number) => `${COMMONS}/thumb/c/c8/${DJVU}/page${page}-960px-${DJVU}.jpg`;
const DJVU_PAGE = `${FILE}Kybalion_-_a_study_of_the_hermetic_philosophy_of_ancient_Egypt_and_Greece_(1908).djvu`;
const DJVU_LICENCE = "Public domain (PD-old-70 and PD-1923) and Public Domain Mark, as the file page states";
const DJVU_CREDIT = "Wikimedia Commons, from the Internet Archive (kybalionstudyofh00init, Brigham Young University copy)";

export const KYBALION_IMAGES: Placed[] = [
  // ---- the 1908 book: the BYU copy
  {
    key: "kybalion-1908-cover",
    passageKey: "modern.kyb.1908",
    url: djvuPage(1),
    sourcePageUrl: DJVU_PAGE,
    institution: "Brigham Young University Library (the scanned copy)",
    objectDate: "1908 (the edition: 'Copyright 1908 by The Yogi Publication Society')",
    caption:
      "The front cover of a copy of the 1908 first edition, the copy at Brigham Young University: dark cloth stamped in gilt 'The KYBALION' over 'Hermetic Philosophy' inside a scrolled frame, with a small round gilt emblem below. Page 1 of the DjVu scan on Wikimedia Commons; this import's text was transcribed from the same copy.",
    creator: "The Yogi Publication Society, Chicago (publisher)",
    credit: DJVU_CREDIT,
    licence: DJVU_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "kybalion-1908-copyright-page",
    passageKey: "modern.kyb.1908",
    url: djvuPage(6),
    sourcePageUrl: DJVU_PAGE,
    institution: "Brigham Young University Library (the scanned copy)",
    objectDate: "1908 (printed: 'Copyright 1908')",
    caption:
      "The back of the title page of the BYU copy of 1908: 'Copyright 1908 by The Yogi Publication Society. Entered at Stationer's Hall. All rights reserved', with the library's stamp, 'The Library, Brigham Young University, Provo, Utah'. The copyright is claimed by the publisher, Atkinson's firm, not by a named author. Page 6 of the DjVu scan.",
    creator: "The Yogi Publication Society, Chicago (publisher)",
    credit: DJVU_CREDIT,
    licence: DJVU_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "kybalion-1908-dedication",
    passageKey: "modern.kyb.1908.intro",
    url: djvuPage(7),
    sourcePageUrl: DJVU_PAGE,
    institution: "Brigham Young University Library (the scanned copy)",
    objectDate: "1908 (the edition)",
    caption:
      "The dedication of the 1908 first edition, in the BYU copy: 'To Hermes Trismegistus, known by the ancient Egyptians as \"The Great Great\" and \"Master of Masters\", this little volume of Hermetic teachings is reverently dedicated', with a former owner's signature in ink at the top. Page 7 of the DjVu scan.",
    creator: "The Yogi Publication Society, Chicago (publisher)",
    credit: DJVU_CREDIT,
    licence: DJVU_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- evidence for the attribution
  {
    key: "kybalion-post-office-transcript-1919",
    passageKey: "modern.kyb.1908",
    url: `${COMMONS}/0/01/A_quote_from_the_mail_fraud_file_on_William_Walker_Atkinson_and_Advance_Thought_Magazine_and_The_Yogi_Publication_Society.png`,
    sourcePageUrl: `${FILE}A_quote_from_the_mail_fraud_file_on_William_Walker_Atkinson_and_Advance_Thought_Magazine_and_The_Yogi_Publication_Society.png`,
    objectDate: "4 April 1919, the date of the hearing on the transcript's cover (the file page gives 1919 and, in its author field, 1916)",
    caption:
      "Typed lines from the transcript of a Post Office Department hearing in Washington, 4 April 1919, on the Advanced Thought Publishing Company and the Yogi Publication Society: 'Inspector Angier. I wanted to know who Magnitus Incognito was. I also wanted him to tell me who this famous Hindu was this Yogi Ramacharaka, and he stated that there was no such person; that there were several books under that name and that several were written by friends of his.' The same transcript records that the Yogi Publication Society was founded by William Walker Atkinson. It does not mention the Kybalion.",
    creator: "Post Office Department, Washington (Roy L. Whitman, shorthand reporter)",
    credit: "Wikimedia Commons, from the IAPSOP scan of the transcript",
    licence: "Public domain in the United States (PD-1923), as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- the usual attributed author: context, not evidence of authorship
  {
    key: "kybalion-atkinson-signed-portrait",
    passageKey: "modern.kyb.1908",
    url: `${COMMONS}/a/a8/William_Walker_Atkinson_2.jpg`,
    sourcePageUrl: `${FILE}William_Walker_Atkinson_2.jpg`,
    objectDate: "Undated (the file page gives only its upload date, 10 February 2012)",
    caption:
      "UNVERIFIED — An oval portrait of a man in middle age, balding, in a dark suit and tie, printed above the signature 'William Walker Atkinson'. The sitter is identified by the printed signature; where and when the portrait was printed, and who made it, are not verified. William Walker Atkinson (1862–1932) is the usual attributed author of The Kybalion; the portrait is context, not evidence that he wrote it.",
    whatIsUnverified:
      "The date, the printing it comes from and the photographer: the file page names an unknown author and takes the picture from a personal website (users.telenet.be/ananda/ramach.htm).",
    creator: "Unknown photographer",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-70) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "kybalion-atkinson-oval-portrait",
    passageKey: "modern.kyb.1908",
    url: `${COMMONS}/4/43/William_Walker_Atkinson%2C_Chicago%2C_1900.jpg`,
    sourcePageUrl: `${FILE}William_Walker_Atkinson,_Chicago,_1900.jpg`,
    objectDate: "1900, as the file page gives it (not checked)",
    caption:
      "UNVERIFIED — An oval photograph of a younger William Walker Atkinson, dark hair swept back, in a white wing collar and dark tie. The file page says it is from Suggestion magazine, Chicago, 1900; that source and date are not verified. Context for the book's usual attributed author, not evidence that he wrote it.",
    whatIsUnverified:
      "The date and the source: the file page gives 'Chicago, 1900' and 'from Suggestion Magazine 1900', citing an IAPSOP scan of advertisements from Suggestion vol. 7, whose year and whose portrait were not checked. The identification of the sitter rests on the file page.",
    creator: "Unknown photographer",
    credit: "Wikimedia Commons, from the IAPSOP scan of Suggestion",
    licence: "Public domain in the United States (PD-1923), as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "kybalion-atkinson-portrait-1901",
    passageKey: "modern.kyb.1908",
    url: `${COMMONS}/9/98/A_portrait_of_Dr._Herbert_A._Parkyn%27s_prot%C3%A9g%C3%A9_and_New_Thought_author%2C_William_Walker_Atkinson%2C_in_1901.png`,
    sourcePageUrl: `${FILE}A_portrait_of_Dr._Herbert_A._Parkyn%27s_prot%C3%A9g%C3%A9_and_New_Thought_author,_William_Walker_Atkinson,_in_1901.png`,
    objectDate: "1901, as the file page gives it (not checked)",
    caption:
      "UNVERIFIED — A printed half-length photograph of a young man in a dark suit and loose bow tie, captioned beneath in capitals 'WILLIAM WALKER ATKINSON'. The file page dates it 1901 and calls him Dr Herbert A. Parkyn's protégé; the date and the publication it was printed in are not verified. Context for the book's usual attributed author, not evidence that he wrote it.",
    whatIsUnverified:
      "The date (1901) and the publication it comes from: the file page takes the picture from a biography website (alchetron.com) and names no photographer or printed source.",
    creator: "Unknown photographer",
    credit: "Wikimedia Commons, from alchetron.com",
    licence: "Public domain in the United States (PD-1923), as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
