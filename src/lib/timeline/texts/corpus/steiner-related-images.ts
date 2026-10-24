// PICTURES OF RUDOLF STEINER'S ATLANTIS AND LEMURIA (1911) AND ITS SETTING.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). No page image of the 1911 book was reached (see
// scripts/texts/steiner-atlantis.py), so there is no picture of its title page
// here. The closest evidence that could be shown is an issue of the magazine
// in which the German articles first ran, Lucifer-Gnosis, from the month
// before the series began. Then portraits of the author, and the first
// Goetheanum, the building his movement put up at Dornach after he left the
// Theosophical Society: context, not evidence for the text. Pictures whose
// date, place or photographer rest on their file pages alone are marked
// UNVERIFIED. Every picture is from a Wikimedia Commons file page, with the
// licence as that page states it, and was looked at before it was added.
//
// The "steiner-lemurian-epoch" timeline marker already shows Steiner_um_1905.jpg
// and Goetheanum_Dornach.jpg; neither is repeated here.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

export const STEINER_IMAGES: Placed[] = [
  // ---- the magazine the articles first appeared in
  {
    key: "steiner-lucifer-gnosis-1904-06",
    passageKey: "modern.steiner.1911.1.1",
    url: `${COMMONS}/5/5d/Lucifer-gnosis-1904.jpg`,
    sourcePageUrl: `${FILE}Lucifer-gnosis-1904.jpg`,
    objectDate: "June 1904 (printed on the cover: 'Nr. 13, Juni 1904')",
    caption:
      "The cover of Lucifer-Gnosis no. 13, June 1904, 'Herausgeber: Dr. Rudolf Steiner', sold 'in Commission bei C. A. Schwetschke und Sohn, Berlin', the magazine in which the articles 'Aus der Akasha-Chronik' began to appear the next month. Its contents open with Steiner's 'Wie erlangt man Erkenntnisse der höheren Welten?', the series that chapter I of the 1911 book recommends in its English forms, The Way of Initiation and Initiation and its Results. An issue of the magazine, not a page of the articles translated here.",
    creator: "Rudolf Steiner (editor); C. A. Schwetschke und Sohn, Berlin (agents)",
    credit: "Wikimedia Commons (uploaded by Ulz)",
    licence: "Public domain (PD-old) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- the author
  {
    key: "steiner-portrait-c1907",
    passageKey: "modern.steiner.1911",
    url: `${COMMONS}/4/41/Rudolf-Steiner-1907.jpg`,
    sourcePageUrl: `${FILE}Rudolf-Steiner-1907.jpg`,
    objectDate: "About 1907, as the file name and description give it (not checked)",
    caption:
      "UNVERIFIED — Rudolf Steiner (1861–1925), head and shoulders, in a dark coat and loose bow tie. The file page describes it as his picture 'when he was 46', that is about 1907, while the Akasha-Chronik articles were still appearing; that date and the photographer it names are not verified. The sitter is Steiner.",
    whatIsUnverified:
      "The date (about 1907) and the photographer: the file page gives no date of its own beyond 'when he was 46', names Ita Wegman as author without a source for that attribution, and takes the picture from a biographical website (paudedamasc.com).",
    creator: "Unknown photographer (the file page names Ita Wegman)",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-old) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "steiner-with-annie-besant-1907",
    passageKey: "modern.steiner.1911.2.2",
    url: `${COMMONS}/0/00/Steiner_mit_Annie_Besant.jpg`,
    sourcePageUrl: `${FILE}Steiner_mit_Annie_Besant.jpg`,
    objectDate: "1907, as the file page gives it (not checked)",
    caption:
      "UNVERIFIED — Rudolf Steiner standing beside Annie Besant, President of the Theosophical Society, who is seated in a carved chair wearing an embroidered shawl. The file page dates the photograph to Munich, 1907, the year of the Theosophical congress Steiner's German Section held there, when he was still its General Secretary and was writing the articles whose Lemuria and Atlantis follow Theosophical literature; the date and place are not verified.",
    whatIsUnverified:
      "The date and place (Munich, 1907), which rest on the file page, citing Wolfgang G. Vögele, Der andere Rudolf Steiner (2005), p. 167, which has not been checked. The photographer is not named.",
    creator: "Unknown photographer",
    credit: "Wikimedia Commons (from W. G. Vögele, Der andere Rudolf Steiner, 2005, p. 167)",
    licence: "Public domain (PD-old) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  // ---- the first Goetheanum: the movement's later setting, context only
  {
    key: "steiner-first-goetheanum-construction-1914",
    url: `${COMMONS}/9/9c/Goetheanum-1914.gif`,
    sourcePageUrl: `${FILE}Goetheanum-1914.gif`,
    objectDate: "1 April 1914 (written on the print: '1. April 1914', no. 87)",
    caption:
      "The first Goetheanum at Dornach, near Basel, under construction on 1 April 1914, as written on the print: the two timber domes on their scaffolding above the concrete base, with workers and visitors on the terrace. Steiner designed the building as the centre of the Anthroposophical movement he founded after leaving the Theosophical Society in 1912–13. Context for the book's author, not evidence for the text.",
    creator: "Unknown photographer",
    credit: "Wikimedia Commons (from the Hungarian Wikipedia)",
    licence: "Public domain (PD-old) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "steiner-with-goetheanum-model-1914",
    url: `${COMMONS}/a/a4/Rudolf_Steiner_mit_Modell_Erstes_Goetheanum_-16._Juni_1914.Foto_Rietmann.jpg`,
    sourcePageUrl: `${FILE}Rudolf_Steiner_mit_Modell_Erstes_Goetheanum_-16._Juni_1914.Foto_Rietmann.jpg`,
    objectDate: "16 June or 16 May 1914: the file page gives both (not checked)",
    caption:
      "UNVERIFIED — Rudolf Steiner standing beside a large model of the first Goetheanum, its double dome and columned windows, in a timber workshop. The file page attributes the photograph to Otto Rietmann and dates it 16 June 1914 in its title and caption but 16 May 1914 in its date field; neither date is verified. Context for the author, not evidence for the text.",
    whatIsUnverified:
      "The date, which the file page gives as both 16 June and 16 May 1914, and the attribution to Otto Rietmann (1856–1942), which rests on the file page and its source (rudolf-steiner.com).",
    creator: "Otto Rietmann, as the file page states (not checked)",
    credit: "Wikimedia Commons (from rudolf-steiner.com)",
    licence: "CC0 1.0 and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "steiner-first-goetheanum-colour",
    url: `${COMMONS}/d/d0/First_Goetheanum.jpg`,
    sourcePageUrl: `${FILE}First_Goetheanum.jpg`,
    objectDate: "Built 1913–1920; burned on New Year's Eve 1922–23. The photograph is undated",
    caption:
      "UNVERIFIED — The first Goetheanum at Dornach, finished, in colour: its large and small domes, clad in grey slate, over a carved timber upper storey and a concrete base, on a grassy slope with young trees. The building stood from about 1920 until it burned on New Year's Eve 1922–23, so the picture is of those years if it shows the building as it stood; its date, photographer and whether it is coloured by hand are not verified. Context for the author, not evidence for the text.",
    whatIsUnverified:
      "The date, the photographer and the colouring: the file page names no author and gives no date, saying only that the photo is 'from www.goetheanum.org'.",
    creator: "Unknown photographer",
    credit: "Wikimedia Commons (from goetheanum.org)",
    licence: "Public domain in the United States (copyright expired there), as the file page states; it notes the picture may not be public domain elsewhere",
    licenceStatus: "open",
    shows: "site",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
