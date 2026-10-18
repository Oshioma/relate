// ASCLEPIUS: the forty-one chapters of the Latin dialogue, in Mead's English,
// paragraph by paragraph.
//
// The text comes from the generated file beside this one (Mead's 1906
// translation, "The Perfect Sermon, or the Asclepius", from the web edition
// at sacred-texts.com, with the seven passages that edition lost taken from
// the archive.org OCR of the same book; split by
// scripts/texts/mead-asclepius.py). What a reader needs beyond it —
// summaries, the Coptic and Greek parallels, witnesses, pictures, themes and
// connections — is written here, so regenerating the text never loses it.
//
// Hierarchy: chapter → Mead's numbered paragraphs. The chapters are the
// standard ones (herm.ascl.24 is Asclepius 24); the paragraph numbers are
// Mead's own and no other edition uses them. A chapter he does not divide
// carries its text itself.
//
// The Latin (Thomas 1908) is public domain but is not reproduced: the only
// scans found have uncorrected OCR, and correcting it would be re-editing the
// text. Each chapter says where to read it. The Coptic version of chapters
// 21–29 (NHC VI,8) and the Coptic prayer that parallels chapter 41 (NHC VI,7)
// are kept as separate versions, cited only: every English translation of
// them is in copyright.
//
// Nothing here is marked verified: Mead's chapter numbers have not been
// checked against Nock–Festugière, and some of the text is OCR.

import type { CorpusImage, CorpusLayer, CorpusLink, CorpusManuscript, CorpusPassage, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { ASCLEPIUS_RELATED_IMAGES } from "./asclepius-related-images";
import { ASCLEPIUS_SECTIONS } from "./asclepius-text";

const PREFIX = "herm.ascl";

const SOURCES = INVENTORY_SOURCES.filter((s) =>
  ["mead-tgh", "thomas-apuleius-1908", "copenhaver-hermetica", "nock-festugiere", "robinson-nhl", "lactantius-institutes", "augustine-city-of-god"].includes(
    s.key
  )
);

const WEB_EDITION =
  "G. R. S. Mead, Thrice-Greatest Hermes, vol. II (1906), \"The Perfect Sermon, or the Asclepius\", as published by sacred-texts.com. Public domain.";
const OCR_EDITION =
  "G. R. S. Mead, Thrice-Greatest Hermes, vol. II (1906), from the archive.org OCR of the book (thricegreatesthe02hermuoft), because the sacred-texts.com edition lacks this passage. Public domain.";
const MEAD_NOTE =
  "Mead translated the Latin of Hildebrand's edition (1842), now and then preferring Patrizi's (1593) or the Bipontine (1788). His footnotes and commentary are left out; square brackets are his.";

function englishLayer(source: string, text: string): CorpusLayer {
  const where =
    source === "web"
      ? WEB_EDITION
      : source === "ocr"
        ? `${OCR_EDITION} Page headers and footnotes removed; a few OCR misreadings corrected.`
        : `${WEB_EDITION} The paragraphs after Ménard's mark of a new part are missing there and are taken from the archive.org OCR of the book (thricegreatesthe02hermuoft).`;
  return {
    key: "eng-mead",
    layer: "translation",
    sourceKey: "mead-tgh",
    content: text,
    language: "English",
    licence: "public_domain",
    evidence: `${where} ${MEAD_NOTE}`,
  };
}

/** Where to read the Latin, which is not reproduced. */
function latinLayer(chapter: number): CorpusLayer {
  return {
    key: "lat-thomas",
    layer: "primary_text",
    sourceKey: "thomas-apuleius-1908",
    contentAbsentReason: `Public domain, but not reproduced: the only scans of Thomas's edition found (archive.org, Google Books) carry uncorrected OCR too corrupt to quote without re-editing it. Read chapter ${chapter} in Thomas 1908, pp. 36–81 (chapter numbers in the margin).`,
    language: "Latin",
    licence: "public_domain",
    evidence:
      "The Latin translation of the lost Greek 'Perfect Discourse', in P. Thomas's Teubner edition (1908), based on the Brussels manuscript (B, KBR 10054–10056).",
  };
}

/** Roman numerals, as Mead heads the chapters. */
function roman(n: number) {
  const table: [number, string][] = [
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  for (const [value, numeral] of table) {
    while (n >= value) {
      out += numeral;
      n -= value;
    }
  }
  return out;
}

type Chapter = { summary: string; themes?: [string, string][]; notes?: string };

/** A summary of every chapter, written for this archive from Mead's text. */
const CHAPTERS: Record<number, Chapter> = {
  1: {
    summary:
      "Hermes tells Asclepius that God has brought him to hear the most divine of their discourses. Tat is called in, and Ammon at Asclepius's request; with the four of them in the sanctuary and silent, the teaching begins.",
    themes: [["divine-knowledge", "A discourse given only to a chosen few, kept from the crowd."]],
  },
  2: {
    summary:
      "Every human soul is immortal, though not all in the same way. All is One and One is All. What descends from heaven begets, what rises nourishes, and earth receives and restores all kinds.",
    themes: [
      ["the-soul", "Every soul is deathless, but not all alike."],
      ["above-and-below", "All things descend from heaven to earth, water and air; what descends begets, what rises nourishes."],
    ],
  },
  3: {
    summary:
      "The cosmos is made of four elements; there is one cosmos, one soul and one God. Heaven, the sensible god, governs bodies, with the Sun and Moon; God, the maker, governs all, and has made the cosmos a receptacle of every form.",
    themes: [["creation", "God makes the cosmos the receptacle of all forms, from four elements."]],
  },
  4: {
    summary:
      "Every genus produces its species: gods, daimons, humans, birds, animals and plants. Genera are immortal; the species of mortal genera die, so that a human being is mortal and humankind immortal.",
  },
  5: {
    summary:
      "The species of all genera mingle. Bodies cannot be formed without God, nor species without daimons, nor animals tamed without humans. Daimons joined to the gods are counted as gods; humans may join themselves to gods or to daimons, or stay with their own kind.",
  },
  6: {
    summary:
      "'Man is a great wonder': he passes into the nature of God, knows the daimons, and looks down on his earthly part. Set in the middle, he loves what is below and is loved by what is above, and his mind reaches earth, sea and sky. Of all living things, only humans are given reason.",
    themes: [
      ["consciousness", "The human mind reaches every part of the world, as if it were near."],
      ["above-and-below", "Man is placed in the middle, between those above and those below."],
    ],
  },
  7: {
    summary:
      "Only a few have the divine sense of understanding; those who chase its counterfeit become like beasts. Man is twofold: the 'essential' man in the likeness of God, and the cosmic or material man. Asclepius asks why man was put into the world at all.",
    themes: [["the-soul", "The 'essential' man and the cosmic body that houses him."]],
  },
  8: {
    summary:
      "God made a second, visible god, the cosmos, loved it as his own, and made man to behold it. He clothed the essential man in a body, of soul and body, mortal and eternal, so that man could admire heaven and tend the earth.",
    themes: [
      ["creation", "God makes the visible cosmos, a second god, and then man to behold it."],
      ["above-and-below", "Man is made to admire the things of heaven and to care for the things of earth."],
    ],
    notes: "Lactantius quotes the Greek original of the opening of this chapter (Divine Institutes IV.6), according to Mead's note.",
  },
  9: {
    summary:
      "Worship of heaven is man's part. The Muses were sent to humankind so that God should be praised with music on earth too. A few, of pure mind, contemplate heaven; the rest tend the elements and what is below them.",
  },
  10: {
    summary:
      "The Lord of eternity is the first God, the cosmos the second, man the third. Cosmos and man are the two images of God. Man is divine in his soul, sense, spirit and reason, and mortal in the part made of fire, water and air.",
    themes: [["above-and-below", "Two images of God: the cosmos and man."]],
  },
  11: {
    summary:
      "Piety is man's chief capacity, made perfect by despising possessions, which are alien to us, the body included. Man has two sets of four — hands and feet for the lower world, and sense, soul, memory and foresight for things divine — and the pious are promised a return to their divine nature.",
    themes: [
      ["sacred-numbers", "Man is made of 'sets of four'."],
      ["ascension", "The pious are restored at death to the divine part of their nature."],
    ],
  },
  12: {
    summary:
      "The impious are denied return to heaven and pass into other bodies. Hermes foretells that no one after them will keep pure philosophy; it will be confused with clever reasoning.",
    themes: [["reincarnation", "The impious migrate into bodies unworthy of a holy soul."]],
  },
  13: {
    summary:
      "Arithmetic, music and geometry belong to philosophy only so far as they help it admire God's ordering of the stars, the earth and the elements. True music is knowing the order of all things.",
    themes: [["cosmic-law", "Music as knowledge of the order of all things."]],
  },
  14: {
    summary:
      "Those to come will be misled by sophists. Hermes then turns to spirit and matter: in the beginning were God and matter (hyle), and spirit with them. God is unbegotten; matter and spirit, though unborn, have in them the power to beget.",
    themes: [["creation", "God, matter and spirit at the beginning."]],
  },
  15: {
    summary:
      "The space of the cosmos and what is in it seems not to have been born, yet it holds the power of all births. Matter brings forth bad as well as good.",
  },
  16: {
    summary:
      "God did not fail to remove evil from the world: he gave humans sense, knowledge and intelligence to avoid it. All in the cosmos is governed by spirit, as an instrument of the highest God.",
  },
  17: {
    summary:
      "Spirit moves and rules every species. The spherical cosmos cannot be wholly seen by itself; its unseen lowest part is called in Greek Hades ('unseen') and in Latin inferi ('those below').",
    themes: [["underworld", "The unseen bottom of the cosmic sphere: Hades, the inferi."]],
  },
  18: {
    summary:
      "The cosmos feeds bodies, spirit feeds souls, and sense, the heavenly gift, feeds the minds of the few who can receive it; it lights the mind as the Sun lights the world, but is never eclipsed.",
    themes: [["consciousness", "The higher sense illuminates the mind more fully than the Sun lights the world."]],
  },
  19: {
    summary:
      "The orders of gods: intelligible and sensible. Each class of sensible gods has its ruling principle: Zeus for heaven, light for the Sun, the 'Pantomorph' for the thirty-six decans, Fortune and Fate for the seven spheres. All depend from One.",
    themes: [
      ["seven-planetary-spheres", "The seven spheres, whose ruling power is Fortune and Heimarmene (Fate)."],
      ["fate-and-free-will", "Heimarmene changes all things by the law of nature."],
      ["sacred-numbers", "The thirty-six decans ('Horoscopes') and the seven spheres."],
    ],
    notes: "Lydus quotes the Greek of the passage on the seven spheres (De mensibus IV.7), according to Mead's note.",
  },
  20: {
    summary:
      "God can have no single name, or is called by every name. He is One and All, full of the fertility of both sexes, and always brings to birth what he wills.",
  },
  21: {
    summary:
      "All things, living or not, have both sexes and the power to bring forth. Their union, Eros or Aphrodite, is the sweetest of mysteries, and is kept secret from the eyes of the impious.",
    notes: "Chapters 21–29 survive also in Coptic, in Nag Hammadi Codex VI,8 (herm.ascl.coptic).",
  },
  22: {
    summary:
      "The pious are few; vice grows from ignorance. God gave humans alone knowledge and understanding, made them of a divine and a mortal nature, and so set them above both the gods and mortal things.",
  },
  23: {
    summary:
      "As God made the gods of heaven, so man makes the gods of the temples. The gods of heaven come from the purest part of nature; those humans make are fashioned from both natures, in the likeness of their makers.",
    themes: [["magic-and-sacred-words", "Humans as makers of gods."]],
    notes: "Augustine quotes this passage in Latin (City of God VIII.23), according to Mead's note.",
  },
  24: {
    summary:
      "The statues are ensouled: they foretell, send dreams, heal and harm. Egypt is the image of heaven and the temple of the world — but a time will come when the gods leave it, foreigners forbid its worship, and the land is filled with tombs; the Nile will run with blood.",
    themes: [
      ["above-and-below", "Egypt as the image of heaven on earth."],
      ["magic-and-sacred-words", "Statues animated by the gods."],
      ["cosmic-cycles", "The prophecy of Egypt's abandonment by the gods begins."],
    ],
    notes: "The 'Lament' or 'Apocalypse' of the Asclepius runs from here to chapter 26. Augustine quotes part of it (City of God VIII.23–26), according to Mead's notes.",
  },
  25: {
    summary:
      "The lament continues: Egypt will become the most barbarous of lands; the world will no longer be admired, darkness will be preferred to light, and religion of the mind punished by death. The gods will depart, evil angels remain, and earth, sea and sky fall into disorder.",
    themes: [["cosmic-cycles", "The old age of the world."]],
  },
  26: {
    summary:
      "Then God will end the evil by flood, fire or plague and restore the cosmos to its former beauty: a rebirth of the world, by a set course of time. God's will has no beginning and no end.",
    themes: [
      ["cosmic-cycles", "The world destroyed by water, fire or pestilence and restored."],
      ["death-and-rebirth", "The rebirth (restoration) of the cosmos."],
    ],
    notes: "Lactantius quotes the Greek of this passage (Divine Institutes, book VII), according to Mead's note.",
  },
  27: {
    summary:
      "The cosmos is good, the giver of good things to mortals. God is beyond the heaven; Zeus rules between heaven and earth, Zeus 'below' rules earth and sea, and the gods of the earth will be gathered in a city at the edge of Egypt. Death, the body's dissolution, is not to be feared; there is another.",
    themes: [["death-and-rebirth", "Death as the dissolution of the body."]],
    notes: "Stobaeus preserves the Greek of the passage on death (§4), according to Mead's note.",
  },
  28: {
    summary:
      "At death the soul is judged by its highest daimon. The pious soul rests in its place; the impious is thrown into the storms of air, fire and water between heaven and earth, and tormented without end.",
    themes: [
      ["underworld", "Punishment of impious souls in the turbulence between heaven and earth."],
      ["the-soul", "The soul judged after death by its daimon."],
    ],
  },
  29: {
    summary:
      "Those punished by human law pay with their lives; God protects the righteous. The good are known by their piety; the Sun, the second god, lights all, and nothing in the living cosmos can die.",
    themes: [
      ["sun-and-moon", "The Sun, the second god, lighting and ruling all living things."],
      ["immortality", "Nothing in the ever-living cosmos is subject to death."],
    ],
    notes: "Mead's printing has no paragraph numbered 4 in this chapter (1, 2, 3, 5); it is kept as he prints it.",
  },
  30: {
    summary:
      "The cosmos moves within the life of eternity and cannot stop or perish. Time is marked on earth by the seasons and in heaven by the returns of the stars. Nothing that is born is stable; God alone is unmoved.",
    themes: [["time-and-eternity", "Eternity, the cosmos and time."]],
  },
  31: {
    summary:
      "God and eternity are unchanging. Time, by always returning into itself, has its own stability; eternity seems to move through time. God is beyond all bounds, all grasp and all knowing.",
    themes: [["time-and-eternity", "Eternity's stability and time's circular motion."]],
  },
  32: {
    summary:
      "God and eternity (Aeon) are the first principles; the cosmos, being moved, is not. The divine sense, the cosmic sense and the human sense (memory) are distinguished. Hermes gives thanks to God and bids Tat, Asclepius and Ammon keep the mysteries in silence.",
    themes: [
      ["time-and-eternity", "God and Aeon as the principles of all."],
      ["consciousness", "Divine, cosmic and human sense; human sense is memory."],
    ],
  },
  33: {
    summary:
      "There is no void: the cosmos is full of bodies, some too small to see, and anything extra-cosmic is filled with intelligible things. Daimons and heroes live in the air between earth and the purest heaven.",
  },
  34: {
    summary:
      "'Space' means nothing by itself. The intelligible cosmos is bodiless; the sensible cosmos holds all sensible forms, and nothing in it lives without God, from whom, in whom and through whom all things are.",
  },
  35: {
    summary:
      "Each kind of living thing has images of its kind, and no two are alike, because each is formed at a different moment of the turning of the heavens, ruled by the god called All-formed; the idea itself does not change.",
    themes: [["seven-planetary-spheres", "Individual forms vary with the moment of the heavens' revolution."]],
  },
  36: {
    summary:
      "The cosmos is always changing its forms: heaven in its weathers, the earth in its fruits and flowers, fire in its many changes.",
  },
  37: {
    summary:
      "Man's greatest marvel: he found out the nature of the gods and how to make them. The ancestors invented the art of drawing the souls of daimons or angels into statues. Asclepius's ancestor, the first physician, and Hermes's ancestor still help those who come to their temples; so does Isis.",
    themes: [
      ["magic-and-sacred-words", "The art of making gods: souls drawn into images by holy rites."],
      ["thoth-and-hermes", "Hermes's ancestor, 'whose home is in a place called after him', still aids mortals."],
    ],
    notes: "Augustine quotes the opening paragraphs of this chapter in Latin (City of God VIII.24 and 26), according to Mead's note.",
  },
  38: {
    summary:
      "The earthly gods are made of plants, stones and spices; they delight in sacrifices, hymns and music, foretell and help humans like kinsfolk. So man is the maker of gods.",
    themes: [["magic-and-sacred-words", "Herbs, stones, spices, hymns and music bind the gods to their images."]],
  },
  39: {
    summary:
      "Fate (Heimarmene) is the necessity binding all that is born. Fate begins all things, Necessity brings them to their end, and Order follows them.",
    themes: [["fate-and-free-will", "Fate, Necessity and Order."]],
  },
  40: {
    summary:
      "Fate, Necessity and Order are worked by God's will and eternal reason. Eternity rises and sets in its parts; good and bad are mixed in all things. The teaching ends, and they turn to prayer.",
    themes: [
      ["fate-and-free-will", "Fate, Necessity and Order as instruments of God's will."],
      ["cosmic-cycles", "The revolution of eternity, rising and setting."],
    ],
  },
  41: {
    summary:
      "Leaving the sanctuary they turn south to pray. Asclepius proposes incense; Hermes forbids it, since thanks are the best offering. The prayer of thanksgiving for the gift of knowledge follows, and they go to a pure meal without meat.",
    themes: [["divine-knowledge", "Thanks for the gift of gnosis: 'We have known Thee.'"]],
    notes:
      "The prayer survives also in Greek, in the Papyrus Mimaut (cited by Thomas after Reitzenstein), and in Coptic as the Prayer of Thanksgiving, Nag Hammadi Codex VI,7 (herm.ascl.prayer-coptic). Lactantius (Divine Institutes VI.25) quotes the passage on incense, according to Thomas's notes.",
  },
};

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "kbr-10054-10056",
    siglum: "B",
    name: "Brussels, KBR (Royal Library of Belgium), 10054–10056",
    objectKind: "codex",
    holdingInstitution: "KBR, Brussels",
    accessionNumber: "10054–10056",
    startYear: 1000,
    endYear: 1030,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "'saeculo, ut videtur, XI. ineunte' (Thomas 1908)",
    datingEvidence: "Thomas's own judgement in the preface of his edition (pp. v–vi); not checked against the library's catalogue.",
    sourceKey: "thomas-apuleius-1908",
    notes: "Apuleius's philosophical works, the Asclepius among them. Thomas's chief manuscript, which he found better than all the others; the 'codex Vulcanii'.",
  },
  {
    key: "bml-san-marco-341",
    name: "Florence, Biblioteca Medicea Laurenziana, San Marco 341",
    objectKind: "codex",
    holdingInstitution: "Biblioteca Medicea Laurenziana",
    accessionNumber: "San Marco 341",
    startYear: 1170,
    endYear: 1200,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "late twelfth century",
    datingEvidence: "As given on the Wikimedia Commons record of fol. 57v; not checked against the library's catalogue.",
    notes: "The Asclepius begins on fol. 57v.",
  },
  {
    key: "bnm-lat-vi-81",
    name: "Venice, Biblioteca Nazionale Marciana, Lat. VI, 81 (= 3036)",
    objectKind: "codex",
    holdingInstitution: "Biblioteca Nazionale Marciana",
    accessionNumber: "Lat. VI, 81 (= 3036)",
    startYear: 1350,
    endYear: 1400,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "late fourteenth century",
    datingEvidence: "As given on the Wikimedia Commons record of fol. 131v, which calls it a French manuscript; not checked against the library's catalogue.",
    notes: "The Asclepius begins on fol. 131v.",
  },
  {
    key: "bnm-lat-z-467",
    name: "Venice, Biblioteca Nazionale Marciana, Lat. Z. 467 (= 1557)",
    objectKind: "codex",
    holdingInstitution: "Biblioteca Nazionale Marciana",
    accessionNumber: "Lat. Z. 467 (= 1557)",
    startYear: 1430,
    endYear: 1470,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "mid-fifteenth century",
    datingEvidence: "As given on the Wikimedia Commons record of fol. 91v; not checked against the library's catalogue.",
    notes: "Owned by Cardinal Bessarion, according to the Commons record. The Asclepius begins on fol. 91v.",
  },
  {
    key: "rome-1469",
    name: "Apuleius, Opera (Rome, 1469), the first printed edition",
    objectKind: "print",
    startYear: 1469,
    endYear: 1469,
    datePrecision: "year",
    isApproximate: false,
    originalDateText: "1469",
    datingEvidence: "The Wikimedia Commons record of the page calls it the incunabulum printed at Rome, the editio princeps, dated 1469.",
    notes: "Which copy the photographed page comes from is not stated on the Commons record.",
  },
  {
    key: "nhc-vi",
    name: "Nag Hammadi Codex VI",
    objectKind: "codex",
    holdingInstitution: "Coptic Museum, Cairo",
    findspot: "Near Nag Hammadi, Upper Egypt",
    startYear: 340,
    endYear: 400,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "fourth century CE",
    datingEvidence:
      "The Nag Hammadi codices are dated by documents reused in the bindings (those of Codex VII from the 340s); Codex VI is dated with the rest, not by its own cartonnage.",
    sourceKey: "robinson-nhl",
    notes:
      "A Coptic codex of eight tractates, four of them Hermetic: the Discourse on the Eighth and Ninth (VI,6), the Prayer of Thanksgiving (VI,7, parallel to Asclepius 41) and the extract from the Asclepius (VI,8, chapters 21–29). Page and line references are the usual ones and have not been checked here.",
  },
];

type Placed = CorpusImage & { chapter?: number; passageKey?: string; manuscriptKey?: string };

const IMAGES: Placed[] = [
  {
    key: "bml-san-marco-341-f57v-asclepius-opening",
    chapter: 1,
    manuscriptKey: "bml-san-marco-341",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/94/Asclepius%2C_BML_San_Marco_341.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Asclepius,_BML_San_Marco_341.jpg",
    institution: "Biblioteca Medicea Laurenziana, Florence",
    accessionNumber: "San Marco 341, fol. 57v",
    objectDate: "Late twelfth century",
    caption:
      "UNVERIFIED — The beginning of the Latin Asclepius in a late-twelfth-century manuscript in Florence (fol. 57v), the form in which the dialogue was read in the Middle Ages. The folio is identified by the Commons record and has not been checked against the library's catalogue.",
    creator: "Unknown scribe",
    credit: "Biblioteca Medicea Laurenziana, via Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-70)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified: "That the page is fol. 57v of San Marco 341 and shows the opening of the Asclepius; both come from the Commons record, and the image itself has not been looked at.",
    verificationStatus: "unverified",
  },
  {
    key: "bnm-lat-vi-81-f131v-asclepius-opening",
    chapter: 1,
    manuscriptKey: "bnm-lat-vi-81",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Asclepius%2C_BNM_Lat._VI%2C_81.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Asclepius,_BNM_Lat._VI,_81.jpg",
    institution: "Biblioteca Nazionale Marciana, Venice",
    accessionNumber: "Lat. VI, 81 (= 3036), fol. 131v",
    objectDate: "Late fourteenth century",
    caption:
      "UNVERIFIED — The beginning of the Asclepius in a late-fourteenth-century French manuscript now in Venice (fol. 131v). Manuscript, folio and date are as the Commons record gives them, not checked against the library's catalogue.",
    creator: "Unknown scribe",
    credit: "Biblioteca Nazionale Marciana, via Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-70), with the Italian Ministry of Culture's disclaimer on reuse",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified: "That the page is fol. 131v of Lat. VI, 81, its date, and that it shows the opening of the Asclepius; all from the Commons record, and the image itself has not been looked at.",
    verificationStatus: "unverified",
  },
  {
    key: "bnm-lat-z-467-f91v-asclepius-opening",
    chapter: 1,
    manuscriptKey: "bnm-lat-z-467",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Asclepius%2C_BNM_Lat._Z._467.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Asclepius,_BNM_Lat._Z._467.jpg",
    institution: "Biblioteca Nazionale Marciana, Venice",
    accessionNumber: "Lat. Z. 467 (= 1557), fol. 91v",
    objectDate: "Mid-fifteenth century",
    caption:
      "UNVERIFIED — The beginning of the Asclepius in a mid-fifteenth-century Italian manuscript once owned by Cardinal Bessarion, now in Venice (fol. 91v). Manuscript, folio and owner are as the Commons record gives them, not checked against the library's catalogue.",
    creator: "Unknown scribe",
    credit: "Biblioteca Nazionale Marciana, via Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-70)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified: "That the page is fol. 91v of Lat. Z. 467, its owner, and that it shows the opening of the Asclepius; all from the Commons record, and the image itself has not been looked at.",
    verificationStatus: "unverified",
  },
  {
    key: "rome-1469-asclepius-opening",
    chapter: 1,
    manuscriptKey: "rome-1469",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/28/Asclepius_1469.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Asclepius_1469.jpg",
    objectDate: "1469",
    caption:
      "UNVERIFIED — The opening of the Asclepius in the first printed edition of Apuleius's works, Rome 1469, with an illuminated initial A. The edition is identified by the Commons record; which copy was photographed is not stated.",
    creator: "Printed at Rome; illuminator unknown",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-70)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified: "That the page is from the Rome 1469 edition and shows the opening of the Asclepius, and which copy was photographed; from the Commons record, and the image itself has not been looked at.",
    verificationStatus: "unverified",
  },
  {
    key: "siena-hermes-pavement-ascl-8",
    chapter: 8,
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Pavimento_di_siena%2C_ermete_trismegisto_%28giovanni_di_stefano%29_01.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Pavimento_di_siena,_ermete_trismegisto_(giovanni_di_stefano)_01.jpg",
    institution: "Siena Cathedral",
    objectDate: "1480s",
    caption:
      "Hermes Trismegistus in the marble pavement of Siena Cathedral, attributed to Giovanni di Stefano. The tablet beside him, as other Commons records read it, begins 'God, the creator of all things, made with himself a visible god' — the opening of Asclepius 8, in the Latin of Lactantius's quotation. Later artwork, not evidence for the text.",
    creator: "Attributed to Giovanni di Stefano",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "nhc-vi-p52-hermetic",
    passageKey: "herm.ascl.coptic",
    manuscriptKey: "nhc-vi",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Nag_Hammadi_VI%2C_52.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Nag_Hammadi_VI,_52.jpg",
    institution: "Coptic Museum, Cairo",
    accessionNumber: "Nag Hammadi Codex VI, p. 52",
    objectDate: "Fourth century CE",
    caption:
      "Page 52 of Nag Hammadi Codex VI, with the beginning of a Hermetic treatise in Coptic. Related evidence: the same codex holds the Coptic version of Asclepius 21–29 (pp. 65–78), which is not this page.",
    creator: "Unknown scribe",
    credit: "Coptic Museum, Cairo, via Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-70)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  ...ASCLEPIUS_RELATED_IMAGES,
];

function imagesFor(test: (image: Placed) => boolean): CorpusImage[] | undefined {
  const found = IMAGES.filter(test).map((image) => {
    const copy: Placed = { ...image };
    delete copy.chapter;
    delete copy.passageKey;
    delete copy.manuscriptKey;
    return copy;
  });
  return found.length > 0 ? found : undefined;
}

/** Witnesses for a chapter: the Latin manuscripts pictured here hold the whole text. */
function witnessesFor(chapter: number) {
  return [
    { manuscriptKey: "kbr-10054-10056" },
    ...(chapter === 1
      ? [
          { manuscriptKey: "bml-san-marco-341", locus: "fol. 57v (opening)" },
          { manuscriptKey: "bnm-lat-vi-81", locus: "fol. 131v (opening)" },
          { manuscriptKey: "bnm-lat-z-467", locus: "fol. 91v (opening)" },
          { manuscriptKey: "rome-1469" },
        ]
      : []),
  ];
}

const pages = (first: number, last: number) => (first === last ? `p. ${first}` : `pp. ${first}–${last}`);

/** Plain words on what Mead's numbering of this paragraph is. */
function sectionNotes(chapter: number, section: number, menard: string | null): string | undefined {
  const notes: string[] = [];
  if (menard) notes.push(`Mead marks Ménard's part ${menard} as beginning here.`);
  if (chapter === 29 && section === 3) notes.push("Mead prints no paragraph 4 in this chapter; his paragraph 5 follows this one.");
  return notes.length ? notes.join(" ") : undefined;
}

function buildPassages(): CorpusPassage[] {
  const byChapter = new Map<number, (typeof ASCLEPIUS_SECTIONS)[number][]>();
  for (const row of ASCLEPIUS_SECTIONS) byChapter.set(row[0], [...(byChapter.get(row[0]) ?? []), row]);

  const passages: CorpusPassage[] = [];
  for (const [chapter, rows] of byChapter) {
    const known = CHAPTERS[chapter];
    const key = `${PREFIX}.${chapter}`;
    const whole = rows.length === 1 && rows[0][1] === 0;
    const first = rows[0][2];
    const last = rows[rows.length - 1][3];
    const notes = [
      known?.notes,
      whole ? sectionNotes(chapter, 0, rows[0][4]) : undefined,
      whole ? "Mead does not divide this chapter into numbered paragraphs." : undefined,
    ].filter(Boolean);
    passages.push({
      key,
      divisionKind: "chapter",
      label: `Asclepius ${chapter}`,
      reference: `Asclepius ${chapter} (Mead's chapter ${roman(chapter)}; Mead 1906, ${pages(first, last)})`,
      sourceKey: "mead-tgh",
      summary: known?.summary,
      verificationStatus: "unverified",
      notes: notes.length ? notes.join(" ") : undefined,
      layers: [...(whole ? [englishLayer(rows[0][5], rows[0][6])] : []), latinLayer(chapter)],
      witnesses: witnessesFor(chapter),
      themes: known?.themes?.map(([themeKey, note]) => ({ themeKey, note })),
      images: imagesFor((image) => image.chapter === chapter),
    });
    if (whole) continue;
    for (const [, section, firstPage, lastPage, menard, source, english] of rows) {
      const sectionKey = `${key}.${section}`;
      passages.push({
        key: sectionKey,
        parentKey: key,
        divisionKind: "section",
        label: `Asclepius ${chapter}.${section}`,
        reference: `Asclepius ${chapter}, Mead's paragraph ${section} (Mead 1906, ${pages(firstPage, lastPage)})`,
        sourceKey: "mead-tgh",
        verificationStatus: "unverified",
        notes: sectionNotes(chapter, section, menard),
        layers: [englishLayer(source, english)],
        images: imagesFor((image) => image.passageKey === sectionKey),
      });
    }
  }

  // THE COPTIC VERSIONS, cited only.
  passages.push({
    key: `${PREFIX}.coptic`,
    divisionKind: "version",
    label: "Coptic version of chapters 21–29 (Nag Hammadi Codex VI,8)",
    reference: "NHC VI,8, pp. 65,15–78,43",
    versionKey: "coptic",
    sourceKey: "robinson-nhl",
    summary:
      "A Coptic translation of the Greek of Asclepius 21–29 — the union of the sexes, the making of gods, the lament for Egypt and its restoration, and the fate of souls — copied in the fourth century and buried near Nag Hammadi.",
    verificationStatus: "unverified",
    notes:
      "A separate version, not a witness to the Latin: it was translated from the Greek independently, and differs from the Latin in many places. Page and line reference as usually given; not checked here.",
    layers: [
      {
        key: "eng-robinson",
        layer: "translation",
        sourceKey: "robinson-nhl",
        contentAbsentReason:
          "In copyright, cited only: J. Brashler, P. A. Dirkse and D. M. Parrott's translation in The Nag Hammadi Library in English (ed. J. M. Robinson, 1977 and later editions), under 'Asclepius 21–29 (VI,8)'.",
        language: "English",
        licence: "copyrighted_reference",
        evidence: "No public-domain English translation of the Coptic is known; the Coptic text itself is not reproduced here.",
      },
    ],
    witnesses: [{ manuscriptKey: "nhc-vi", locus: "pp. 65,15–78,43" }],
    images: imagesFor((image) => image.passageKey === `${PREFIX}.coptic`),
  });
  passages.push({
    key: `${PREFIX}.prayer-coptic`,
    divisionKind: "version",
    label: "Coptic Prayer of Thanksgiving (Nag Hammadi Codex VI,7), parallel to chapter 41",
    reference: "NHC VI,7, pp. 63,33–65,7",
    versionKey: "prayer",
    sourceKey: "robinson-nhl",
    summary:
      "The prayer that closes the Asclepius, in a Coptic version copied just before the Asclepius extract in the same codex. A scribal note follows it.",
    verificationStatus: "unverified",
    notes:
      "A separate tractate in the codex, kept here because it is the same prayer as Asclepius 41. The Greek of the prayer survives in the Papyrus Mimaut. Page and line reference as usually given; not checked here.",
    layers: [
      {
        key: "eng-robinson",
        layer: "translation",
        sourceKey: "robinson-nhl",
        contentAbsentReason:
          "In copyright, cited only: J. Brashler, P. A. Dirkse and D. M. Parrott's translation in The Nag Hammadi Library in English (ed. J. M. Robinson, 1977 and later editions), under 'The Prayer of Thanksgiving (VI,7)'.",
        language: "English",
        licence: "copyrighted_reference",
        evidence: "No public-domain English translation of the Coptic is known; the Coptic text itself is not reproduced here.",
      },
    ],
    witnesses: [{ manuscriptKey: "nhc-vi", locus: "pp. 63,33–65,7" }],
  });
  return passages;
}

/** The Coptic extract against each chapter it covers. */
const COPTIC_LINKS: CorpusLink[] = Array.from({ length: 9 }, (_, i) => 21 + i).map((chapter) => ({
  key: `coptic-nhc-vi-8-ascl-${chapter}`,
  from: `${PREFIX}.coptic`,
  to: `${PREFIX}.${chapter}`,
  connectionClass: "direct_textual_parallel",
  similarities: `The Coptic of NHC VI,8 runs parallel to the Latin of chapter ${chapter}: both translate the same lost Greek 'Perfect Discourse', sentence by sentence.`,
  differences:
    "Two independent translations, into Coptic and into Latin. The Coptic is generally held to be closer to the Greek; the Latin expands and paraphrases in places. The differences in this chapter have not been set out here.",
  wordingComparable: "partly",
  meaningComparable: "yes",
  transmissionEvidence:
    "Both descend from the Greek original, which Lactantius quotes; the Coptic was copied in the fourth century, the Latin is quoted by Augustine early in the fifth.",
  commonSourceNote: "The common source is the lost Greek Logos Teleios.",
  sourceKey: "robinson-nhl",
  reviewStatus: "proposed",
}));

const LINKS: CorpusLink[] = [
  ...COPTIC_LINKS,
  {
    key: "prayer-nhc-vi-7-ascl-41",
    from: `${PREFIX}.prayer-coptic`,
    to: `${PREFIX}.41.3`,
    connectionClass: "direct_textual_parallel",
    similarities: "The same prayer of thanksgiving for the gift of knowledge ('We give thanks to Thee … we have known Thee'), in Coptic and in Latin.",
    differences: "Two translations of a Greek prayer, made independently; the Coptic stands as a tractate on its own, without the dialogue's frame of incense and a meal.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence: "The Greek of the prayer survives in the Papyrus Mimaut; the Coptic and the Latin are both translations of a Greek form of it.",
    commonSourceNote: "A Greek Hermetic prayer, preserved in the Papyrus Mimaut.",
    sourceKey: "robinson-nhl",
    reviewStatus: "proposed",
  },
  {
    key: "ascl-8-1-loves-cosmos-ch-1-12",
    from: `${PREFIX}.8.1`,
    to: "herm.ch.1.12",
    connectionClass: "close_conceptual_parallel",
    similarities:
      "In both the highest God brings forth from himself a being that is his image and falls in love with it as his own ('He fell in love with Him as being part of His Divinity'; 'with whom He fell in love, as being His own child').",
    differences: "In the Asclepius what God loves is the cosmos, the second god, and man is made afterwards to behold it; in the Poimandres it is Man, the archetypal human.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: "Both are Greek Hermetic writings of the Roman period, compared here in Mead's English. No direct borrowing is shown.",
    reviewStatus: "proposed",
  },
  {
    key: "ascl-6-2-measures-heaven-ch-10-25",
    from: `${PREFIX}.6.2`,
    to: "herm.ch.10.25",
    connectionClass: "close_conceptual_parallel",
    similarities: "Both praise the human mind as reaching heaven: it 'is measured by the wisdom of his mind as though it were quite near'; 'man doth mount up to heaven and measure it'.",
    differences: "The Asclepius sets man in the middle station, loving what is below him; the Key goes on to rank man above the gods of heaven, who do not come down to earth.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence: "Same Hermetic tradition; no direct borrowing is shown.",
    reviewStatus: "proposed",
  },
  {
    key: "ascl-24-1-statues-ch-17",
    from: `${PREFIX}.24.1`,
    to: "herm.ch.17",
    connectionClass: "close_conceptual_parallel",
    similarities: "Both defend the images of the gods: bodies can hold reflections of bodiless things, and statues are 'ensouled with sense, and filled with spirit'.",
    differences: "Corpus Hermeticum XVII argues from reflections and asks the king to honour the images; the Asclepius claims that humans make gods by drawing souls into statues, which foretell and heal.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence: "Same Hermetic tradition; no direct borrowing is shown.",
    reviewStatus: "proposed",
  },
  {
    key: "ascl-26-1-restoration-tim-22c",
    from: `${PREFIX}.26.1`,
    to: "greek.tim.22c",
    connectionClass: "close_conceptual_parallel",
    similarities: "Both speak of the world's destruction by water and by fire, after which a new order begins.",
    differences:
      "In the Timaeus the floods and fires are recurring natural catastrophes, explained by the heavens' motions; in the Asclepius they are God's act to end an age of impiety and restore the cosmos to its former beauty.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence:
      "The Timaeus was widely read in the Roman period and the Hermetic writers drew on Platonic and Stoic ideas, including the Stoic periodic conflagration; no quotation is shown here.",
    earlierNote: "The Timaeus (fourth century BCE) is centuries earlier.",
    reviewStatus: "proposed",
  },
  {
    key: "ascl-41-3-thanksgiving-ch-1-31",
    from: `${PREFIX}.41.3`,
    to: "herm.ch.1.31",
    connectionClass: "close_conceptual_parallel",
    similarities: "Both teachings close with a hymn of thanksgiving to God for the knowledge he has given.",
    differences: "The Poimandres hymn is a series of 'Holy art Thou' acclamations ending in a plea to be filled with power; the Asclepius prayer gives thanks for gnosis received and asks only to stay in the love of knowing God.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence: "Same Hermetic tradition of closing a revelation with prayer; no direct borrowing is shown.",
    reviewStatus: "proposed",
  },
];

export const ASCLEPIUS_CORPUS: TextCorpusFile = {
  workKey: "herm.asclepius",
  revision: "mead-2026-10",
  sources: SOURCES,
  versions: [
    { key: "coptic", label: "Coptic extract (NHC VI,8)", language: "Coptic", description: "Chapters 21–29, translated from the Greek independently of the Latin." },
    { key: "prayer", label: "Coptic Prayer of Thanksgiving (NHC VI,7)", language: "Coptic", description: "The prayer of chapter 41, as a separate tractate." },
  ],
  manuscripts: MANUSCRIPTS,
  images: IMAGES.filter((image) => image.chapter == null && image.passageKey == null).map((image) => {
    const copy: Placed = { ...image };
    delete copy.chapter;
    delete copy.passageKey;
    return copy;
  }),
  passages: buildPassages(),
  links: LINKS,
};
