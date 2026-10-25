// PICTURES OF THE SECRET OF SECRETS (SIRR AL-ASRĀR / SECRETUM SECRETORUM).
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). No picture of the Arabic manuscript translated here (Gotha
// 1869) has been found on Wikimedia Commons, so the witnesses come from the
// book's translations: first the Latin copy made for Edward III (British
// Library, Add MS 47680) and the Latin copy made for Louis the Great of
// Hungary (Hertford College, MS 2); then related evidence, the onomantic table
// of the Russian version, which sets out the same reckoning of names as
// Discourse IX; then two Arabic pictures whose identification rests on their
// file pages alone, marked UNVERIFIED. Every picture is from a Wikimedia
// Commons file page, with the licence as that page states it, and was looked
// at before it was added.
//
// The three pictures already on the book's timeline marker
// (Tabula_ex_Secretum_Secretorum.png, Bodleian_Library_MS._Canon._Class._Lat._135_-_Philip_of_Tripoli.png
// and Secret_of_secrets_a.jpg) are not repeated here. Two further files were
// looked at and left out: Kitâb_Sirr_al-asrâr_Tabula_Smaragdina.jpg (its file
// page names no manuscript, and the page it shows holds tables, not the
// Tablet; it appears to be the same page as Secret_of_secrets_a.jpg), and
// "Nagy Lajos alakja ... Hertford College MS D 2.jpg", another scan of the
// Hertford picture used below.

import type { Placed } from "./budge-underworld";

export const SECRETUM_IMAGES: Placed[] = [
  {
    key: "secretum-bl-add-47680-alexander-aristotle",
    manuscriptKey: "bl-add-47680",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Secreta_Secretorum_-_Alexander_and_Aristotle_-_MS_47680.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Secreta_Secretorum_-_Alexander_and_Aristotle_-_MS_47680.png",
    institution: "British Library",
    accessionNumber: "Add MS 47680",
    objectDate: "1326–1327, as the file page gives it",
    caption:
      "The opening of a Latin Secretum secretorum made in England for the young Edward III: a crowned king with a sceptre (Alexander) faces a bearded teacher holding a book (Aristotle), with a kneeling figure between them and the English royal arms above; below begins the list of chapters ('Incipiunt Rubrice'). This is the Latin translation of the book, not the Arabic translated here.",
    creator: "Unknown illuminator",
    credit: "British Library, Public domain, via Wikimedia Commons",
    licence: "Public domain (PD-Art; PD-old-100-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "secretum-hertford-ms-2-louis-of-hungary",
    passageKey: "arab.secretum.0.2",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/9a/The_Secretum_Secretorum_%28The_Secret_of_Secrets%29_-_Louis_the_Great_of_Hungary.jpg",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:The_Secretum_Secretorum_(The_Secret_of_Secrets)_-_Louis_the_Great_of_Hungary.jpg",
    institution: "Hertford College, Oxford",
    accessionNumber: "MS 2",
    objectDate: "Fourteenth century, as the file page gives it",
    caption:
      "A painted initial from a Latin Secretum secretorum made for Louis the Great, king of Hungary: a crowned king in armour with a sceptre and a shield, set in the letter; the text below speaks of Aristotle's pupil Alexander. It shows the book's frame, a philosopher's letter to a king, as a fourteenth-century court saw it; it is the Latin translation, not the Arabic translated here.",
    creator: "Unknown illuminator (the file page names Miklós Meggyesi, an attribution not checked here)",
    credit: "Hertford College, Oxford, Public domain, via Wikimedia Commons",
    licence: "Public domain (PD-Art; PD-old-100) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "secretum-russian-onomantic-table-laud-misc-45",
    passageKey: "arab.secretum.9.3",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Onomantic_table_from_the_Secretum_Secretorum.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Onomantic_table_from_the_Secretum_Secretorum.jpg",
    institution: "Bodleian Library, Oxford",
    accessionNumber: "MS Laud Misc. 45, p. 48",
    objectDate: "Sixteenth century (about 1550), as the file page gives it",
    caption:
      "Related evidence, not this Arabic text: the onomantic table of the Russian version of the Secret of Secrets, as reproduced in W. F. Ryan, The Bathhouse at Midnight (1999). Nine 'gates' (врата) of paired numbers are marked for the challenger and the challenged, with a row of letters and their numbers at the foot: the same reckoning of commanders' names by remainders that Discourse IX sets out in nine tables.",
    creator: "Unknown scribe",
    credit: "Bodleian Library, via W. F. Ryan (1999) and Wikimedia Commons",
    licence: "Public domain (PD-old-70-expired; PD-US) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "secretum-arabic-codex-circle-schoyen",
    passageKey: "arab.secretum.3.2",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/31/Secreta_secretorrum_sirio_%28ca._1250-1275%29.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Secreta_secretorrum_sirio_(ca._1250-1275).jpg",
    objectDate: "c. 1250–1275, as the file page gives it (not checked)",
    caption:
      "UNVERIFIED — An open codex in Arabic script with, on the right-hand page, a circular diagram written in red and black ink. The file page calls it a Syrian Secretum secretorum of about 1250–1275; if so, the circle may be the book's 'Circle of the Sphere', the diagram of government that Discourse III describes.",
    whatIsUnverified:
      "Everything about the object rests on the file page alone: that the codex is a copy of the Sirr al-asrār, its date (c. 1250–1275), its Syrian origin, and its collection (the image comes from the Schøyen Collection's website, which suggests Schøyen MS 2048, but no shelfmark is given). That the circular diagram is the Circle of the Sphere has not been checked against the text on the page.",
    creator: "Unknown scribe",
    credit: "Schøyen Collection (as the source link shows), via Wikimedia Commons",
    licence: "Public domain (PD-Old) and Public Domain Mark, as the file page states",
    licenceStatus: "unknown",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "secretum-mubashshir-aristotle-teaching",
    passageKey: "arab.secretum.0.1",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/9f/MS_Ahmed_III_3206_Aristotle_teaching%2C_illustration_from_%27Kitab_Mukhtar_al-Hikam_wa-Mahasin_al-Kilam%27_by_Al-Mubashir.jpg",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:MS_Ahmed_III_3206_Aristotle_teaching,_illustration_from_%27Kitab_Mukhtar_al-Hikam_wa-Mahasin_al-Kilam%27_by_Al-Mubashir.jpg",
    objectDate: "Thirteenth century, as the file page gives it (not checked)",
    caption:
      "UNVERIFIED — Context, not this book: Aristotle as an Arabic book pictured him, a white-bearded teacher in a turban holding an astrolabe-like instrument before three pupils, with Arabic text above. The file page says it illustrates al-Mubashshir ibn Fātik's Choicest Maxims and Best Sayings (Mukhtār al-ḥikam), another Arabic collection of the sayings of Greek sages, not the Secret of Secrets.",
    whatIsUnverified:
      "The manuscript (Istanbul, Topkapı Palace Library, Ahmed III 3206) is named only in the file's title and category, and the image comes from a print-selling website; the date and the identification of the figure as Aristotle are the file page's and have not been checked against the manuscript.",
    creator: "Unknown painter",
    credit: "Via Wikimedia Commons",
    licence: "Public domain (PD-Art; PD-old-100-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
