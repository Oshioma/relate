// CORPUS HERMETICUM: seventeen treatises in Mead's English, section by section.
//
// The text comes from the generated file beside this one (Mead's 1906
// translation, cleaned from the archive.org OCR by
// scripts/texts/mead-hermetica.py). What a reader needs beyond it — the
// treatises' titles and summaries, the manuscripts, images, themes and
// connections — is written here, so regenerating the text never loses it.
//
// Hierarchy: treatise → section. Keys use the Nock–Festugière treatise
// number in arabic figures (herm.ch.1.9 is Poimandres §9); Mead prints the
// same numbers, with Parthey's older ones in brackets, which are not used.
//
// Nothing here is marked verified: the text is OCR, lightly corrected, and
// Mead's section numbers have not been checked against Nock–Festugière.

import type { CorpusImage, CorpusLink, CorpusManuscript, CorpusPassage, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { HERMETICA_RELATED_IMAGES } from "./hermetica-related-images";
import { HERMETICA_SECTIONS } from "./hermetica-text";

const PREFIX = "herm.ch";

const ROMAN: Record<string, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10,
  XI: 11, XII: 12, XIII: 13, XIV: 14, XVI: 16, XVII: 17, XVIII: 18,
};

type Treatise = {
  title: string;
  /** Mead's own heading, for readers comparing with his book. */
  meadTitle: string;
  summary: string;
  /** Folios in Paris gr. 2518, from the BnF catalogue description. */
  paris?: string;
  /** Sections Paris gr. 2518 lacks. */
  parisLacks?: number[];
  parisNote?: string;
  themes: [string, string][];
  /** Mead's printing leaves this section unnumbered; its text is under the one before. */
  unnumbered?: number[];
};

const TREATISES: Record<string, Treatise> = {
  I: {
    title: "Poimandres",
    meadTitle: "Poemandres, the Shepherd of Men",
    summary:
      "A vision: Poimandres, the Mind of absolute power, shows the narrator how the cosmos came from light and moist darkness, how Man fell in love with Nature, and how the soul rises back through the seven spheres. It ends with a hymn of praise.",
    paris: "ff. 72r–78r",
    themes: [
      ["creation", "The cosmogony of light, darkness and the Word."],
      ["seven-planetary-spheres", "The seven Governors and the soul's ascent through their spheres."],
      ["ascension", "The ascent of the soul after death."],
      ["divine-knowledge", "Revelation by Poimandres, and the narrator sent to preach it."],
    ],
  },
  II: {
    title: "Hermes to Asclepius: on space and motion",
    meadTitle: "To Asclepius",
    summary: "A dialogue on what moves and that in which it moves. Space is shown to be bodiless, and God to be beyond both mind and space, the cause of them.",
    paris: "ff. 78r–80v",
    parisLacks: [1, 2, 3],
    parisNote: "Begins mutilated near the end of §4, according to the BnF catalogue.",
    themes: [["consciousness", "Mind as the bodiless place of all motion."]],
  },
  III: {
    title: "The Sacred Discourse",
    meadTitle: "The Sacred Sermon of Hermes",
    summary: "A short, compressed cosmogony: from God and the divine nature come the elements, the heavens, living things and humankind, who are given the arts and a destiny.",
    paris: "ff. 80v–81v",
    themes: [["creation", "A second, compressed account of the making of the world."]],
  },
  IV: {
    title: "The Mixing Bowl, or the Monad",
    meadTitle: "The Cup or Monad",
    summary: "God filled a great bowl with mind and sent it down; those who dipped themselves in it received knowledge (gnosis) and became complete. The One is the root of all number.",
    paris: "ff. 81v–84r",
    themes: [
      ["divine-knowledge", "Baptism in the bowl of mind gives gnosis."],
      ["sacred-numbers", "The monad as the root of all numbers."],
      ["initiation", "The call to dip oneself in the bowl."],
    ],
  },
  V: {
    title: "God is unmanifest and most manifest",
    meadTitle: "Though Unmanifest God is Most Manifest",
    summary: "God cannot be seen, yet is seen everywhere in the order of the cosmos and in the making of the human body. Ends with a hymn.",
    paris: "ff. 84r–86v",
    themes: [["creation", "God known through the order of what he made."]],
  },
  VI: {
    title: "The Good is in God alone",
    meadTitle: "In God alone is Good and Elsewhere Nowhere",
    summary: "Nothing in the world of becoming is good; the good belongs to God alone, and the cosmos is full of evil only in that it is subject to change.",
    paris: "ff. 86v–88v",
    themes: [["cosmic-law", "The good as belonging to God, not the world."]],
  },
  VII: {
    title: "Ignorance of God is the greatest evil",
    meadTitle: "The Greatest Ill among Men is Ignorance of God",
    summary: "A sermon addressed to drunken humankind: seek a guide to the gates of knowledge, and strip off the body, the garment of ignorance.",
    paris: "ff. 88v–89r",
    themes: [["divine-knowledge", "Ignorance as the soul's drunkenness and the body as its garment."]],
  },
  VIII: {
    title: "Nothing that exists perishes",
    meadTitle: "That No One of Existing Things doth Perish",
    summary: "What people call death is only change: the cosmos is a second god that cannot die, and its parts are dissolved and recomposed, never destroyed.",
    paris: "ff. 89r–90v",
    themes: [
      ["death-and-rebirth", "Death as dissolution and recomposition."],
      ["immortality", "The cosmos as an undying living being."],
    ],
  },
  IX: {
    title: "On thought and sensation",
    meadTitle: "On Thought and Sense",
    summary: "Thought and sensation are joined in humans; the mind conceives both good and evil thoughts, sown by God and by daimons.",
    paris: "ff. 90v–93r",
    themes: [["consciousness", "How thought and sense work together."]],
  },
  X: {
    title: "The Key",
    meadTitle: "The Key of Thrice-Greatest Hermes",
    summary: "A summary of the earlier general teachings: the vision of the Good, the descent and grades of souls, their reward and punishment, and the human being as a divine living thing.",
    paris: "ff. 93r–98bis",
    themes: [
      ["the-soul", "The grades of souls and their passage between bodies."],
      ["reincarnation", "Souls that fail pass into other bodies; human souls do not enter animals."],
      ["ascension", "The soul that knows God becomes all mind."],
    ],
  },
  XI: {
    title: "Mind to Hermes",
    meadTitle: "Mind unto Hermes",
    summary: "Mind teaches Hermes the order of God, eternity (aion), cosmos, time and becoming, and tells him to make himself as great as God in order to know him.",
    paris: "ff. 98bis–103v",
    themes: [
      ["time-and-eternity", "God, Aion, Cosmos, Time and Becoming in descending order."],
      ["consciousness", "Expand yourself to the measure of God in order to know him."],
    ],
  },
  XII: {
    title: "On the common mind",
    meadTitle: "About the Common Mind",
    summary: "Mind is of God's own substance; in humans it is a god that opposes the passions. Fate, necessity and order, and the whole cosmos as one living being.",
    paris: "ff. 103v–109r",
    themes: [
      ["fate-and-free-will", "Mind is not subject to fate, though the soul in the body is."],
      ["consciousness", "Mind as God in humans."],
    ],
  },
  XIII: {
    title: "On rebirth: the secret discourse on the mountain",
    meadTitle: "Concerning Rebirth and the Promise of Silence",
    summary:
      "Hermes leads Tat through rebirth: the twelve torments of matter are driven out by ten powers of God, Tat becomes a new being, and is given the secret hymn of rebirth.",
    paris: "ff. 109r–112v",
    parisNote: "The BnF catalogue notes the title ὑμνωδία over §17 (f. 111v).",
    themes: [
      ["initiation", "The secret teaching of rebirth, given on a mountain."],
      ["death-and-rebirth", "Spiritual rebirth into an immortal body."],
      ["sacred-numbers", "Twelve torments driven out by ten powers."],
      ["transformation", "Tat becomes a new being."],
    ],
  },
  XIV: {
    title: "Hermes to Asclepius: a letter",
    meadTitle: "[A Letter] of Thrice-Greatest Hermes to Asclepius",
    summary: "A letter summarising teaching given to Tat: all that comes into being has a maker, and maker and made together are all that is.",
    paris: "ff. 113r–115r",
    themes: [["creation", "Maker and made as the whole of being."]],
  },
  XVI: {
    title: "Definitions of Asclepius to King Ammon",
    meadTitle: "The Definitions of Asclepius unto King Ammon",
    summary: "Asclepius explains to the king why Egyptian should not be translated into Greek, and teaches the Sun as the craftsman of the cosmos and the daimons set under the stars.",
    themes: [
      ["magic-and-sacred-words", "The Egyptian language has power that is lost in Greek translation."],
      ["sun-and-moon", "The Sun as the craftsman who orders heaven and earth."],
    ],
    unnumbered: [5],
  },
  XVII: {
    title: "Asclepius to the King: on images",
    meadTitle: "[Of Asclepius to the King]",
    summary: "A fragment: there are reflections of bodiless things in bodies, so the king should honour the images of the gods. The king closes the session.",
    themes: [["above-and-below", "Images in the sensible world reflect forms in the intelligible."]],
  },
  XVIII: {
    title: "In praise of kings",
    meadTitle: "The Encomium of Kings",
    summary: "A speech praising God and the kings who keep the peace, opening with an image of the soul hindered by the body like a musician by a broken string.",
    themes: [["cosmic-law", "Kingship as the image of divine order."]],
  },
};

const SECTION_SUMMARIES: Record<string, string> = {
  "1.1": "The narrator, deep in thought, is addressed by a vast being.",
  "1.2": "The being names himself Poimandres, Mind of absolute power.",
  "1.4": "The vision of light, then a coiling darkness that becomes a moist nature.",
  "1.6": "Poimandres explains: the light is Mind, God; the Word that came from it is the son of God.",
  "1.9": "Mind the Craftsman makes seven Governors who encompass the sensible world in circles; their government is called fate.",
  "1.12": "Mind, father of all, brings forth Man in his own image.",
  "1.14": "Man leans through the framework of the spheres; Nature sees his form and loves him, and he comes to dwell in her.",
  "1.15": "For this reason humans alone are twofold: mortal in body, immortal in essential Man.",
  "1.24": "At death the body is given up to dissolution and the character to the daimon.",
  "1.25": "The soul rises through the seven zones, giving back at each one a vice.",
  "1.26": "Stripped of these, it reaches the eighth nature and becomes God; this is the end for those who have knowledge.",
  "1.27": "The narrator begins to preach to humankind: why have you given yourselves over to death?",
  "1.31": "The hymn: Holy is God, the Father of all.",
  "13.1": "Tat asks Hermes to teach him rebirth, as promised.",
  "13.7": "The twelve torments of matter, beginning with ignorance.",
  "13.8": "The powers of God come in: knowledge, joy, self-control.",
  "13.17": "The secret hymn of rebirth begins.",
};

const SOURCES = INVENTORY_SOURCES.filter((s) => ["mead-tgh", "copenhaver-hermetica", "ficino-pimander"].includes(s.key));

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "laur-plut-71-33",
    siglum: "A",
    name: "Florence, Biblioteca Medicea Laurenziana, Plut. 71.33",
    objectKind: "codex",
    holdingInstitution: "Biblioteca Medicea Laurenziana",
    accessionNumber: "Plut. 71.33",
    startYear: 1300,
    endYear: 1400,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "fourteenth century",
    datingEvidence:
      "As given in the modern literature on the Hermetic manuscripts (Copenhaver 1992). The Wikimedia Commons record of its fol. 125v says fifteenth century; neither has been checked against the library's catalogue.",
    sourceKey: "copenhaver-hermetica",
    notes: "One of the principal Byzantine witnesses to the Corpus. Which treatises it contains, and on which folios, has not yet been recorded here beyond the Poimandres hymn.",
  },
  {
    key: "paris-gr-2518",
    name: "Paris, Bibliothèque nationale de France, grec 2518",
    objectKind: "codex",
    holdingInstitution: "Bibliothèque nationale de France",
    accessionNumber: "Grec 2518",
    startYear: 1530,
    endYear: 1539,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "copied in Venice, 1530s",
    datingEvidence: "As stated in the BnF record reproduced on Wikimedia Commons (copied in Venice; dated between 1530 and 1539).",
    catalogueUrl: "https://gallica.bnf.fr/ark:/12148/btv1b10509612q",
    notes:
      "A Renaissance copy holding Hero of Alexandria's Pneumatica, Corpus Hermeticum I–XIV (ff. 72r–115r) and Ocellus Lucanus. Folios for each treatise are from the BnF catalogue description. Late, and a copy of earlier manuscripts, but fully digitised.",
  },
  {
    key: "bnm-gr-z-263",
    name: "Venice, Biblioteca Nazionale Marciana, Gr. Z. 263 (= 1025)",
    objectKind: "codex",
    holdingInstitution: "Biblioteca Nazionale Marciana",
    accessionNumber: "Gr. Z. 263 (= 1025)",
    startYear: 1430,
    endYear: 1470,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "mid-fifteenth century",
    datingEvidence: "As given on Wikimedia Commons with the image of its fol. 42r; not checked against the library's catalogue.",
    notes: "Owned by Cardinal Bessarion (Commons record). The Poimandres begins at fol. 42r; what else it holds has not been recorded here.",
  },
];

const IMAGES: (CorpusImage & { manuscriptKey?: string; passageKey?: string })[] = [
  {
    key: "bnm-gr-z-263-f42r-poimandres-opening",
    passageKey: "herm.ch.1.1",
    manuscriptKey: "bnm-gr-z-263",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Poimandres%2C_BNM_Gr._Z._263.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Poimandres,_BNM_Gr._Z._263.jpg",
    institution: "Biblioteca Nazionale Marciana, Venice",
    accessionNumber: "Gr. Z. 263 (= 1025), fol. 42r",
    objectDate: "Mid-fifteenth century",
    caption:
      "The beginning of the Poimandres (Corpus Hermeticum I) in Greek, under a red interlace headpiece and the title 'Of Hermes Trismegistus: Poimandres', in a fifteenth-century manuscript once owned by Cardinal Bessarion. The page runs on past §1 into the opening of the vision; manuscript, folio and owner are as the Commons record gives them.",
    creator: "Unknown scribe",
    credit: "Biblioteca Nazionale Marciana, via Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-70), with the Italian Ministry of Culture's disclaimer on reuse",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "laur-71-33-f125v-poimandres-hymn",
    passageKey: "herm.ch.1.31",
    manuscriptKey: "laur-plut-71-33",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Poimandres_Hymnus.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Poimandres_Hymnus.jpg",
    institution: "Biblioteca Medicea Laurenziana",
    accessionNumber: "Plut. 71.33, fol. 125v",
    objectDate: "Fourteenth or fifteenth century (sources differ)",
    caption:
      "The hymn that closes the Poimandres (Corpus Hermeticum I.31–32), in Greek, in a Byzantine manuscript in Florence. The identification of the page is the Commons record's and has not been checked against the library's catalogue.",
    creator: "Unknown scribe",
    credit: "Biblioteca Medicea Laurenziana, via Wikimedia Commons",
    licence: "Public domain",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },
  {
    key: "paris-gr-2518-poimandres-opening",
    passageKey: "herm.ch.1.6",
    manuscriptKey: "paris-gr-2518",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/H%C3%A9ron_d%27Alexandrie%2C_Pneumatica_%3B_Corpus_Hermeticum_%3B_Ocellus_Lucanus%2C_De_universi_Natura._-_btv1b10509612q_%28154_of_284%29.jpg",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:H%C3%A9ron_d%27Alexandrie,_Pneumatica_;_Corpus_Hermeticum_;_Ocellus_Lucanus,_De_universi_Natura._-_btv1b10509612q_(154_of_284).jpg",
    institution: "Bibliothèque nationale de France",
    accessionNumber: "Grec 2518 (image 154 of 284; probably f. 72v)",
    objectDate: "1530s",
    caption:
      "UNVERIFIED — A page of the Poimandres in Greek in a sixteenth-century Venetian copy now in Paris. The manuscript is securely identified by the BnF record; the folio number and the sections on the page (read here as about §§4–6, where the name Poimandres appears) are this archive's reading and have not been checked.",
    creator: "Unknown scribe",
    credit: "Bibliothèque nationale de France, Département des Manuscrits, via Wikimedia Commons",
    licence: "Public domain",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified: "The folio number and which sections of the Poimandres the page carries.",
    verificationStatus: "unverified",
  },
  {
    key: "laur-21-8-ficino-argumentum",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/71/Ficino%2C_Pimander.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ficino,_Pimander.jpg",
    institution: "Biblioteca Medicea Laurenziana",
    accessionNumber: "Plut. 21.8, fol. 3r",
    objectDate: "Later fifteenth century",
    caption:
      "Marsilio Ficino's introduction to his Latin translation of the Corpus Hermeticum, in a manuscript dedicated to Lorenzo de' Medici. The translation, made in 1463, is how Renaissance Europe came to know these texts. Related evidence: a translation, not a Greek witness.",
    creator: "Marsilio Ficino (text); unknown scribe",
    credit: "Biblioteca Medicea Laurenziana, via Wikimedia Commons",
    licence: "Public domain",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },
  {
    key: "ficino-pimander-1471-bph",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Corpus_Hermeticum.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Corpus_Hermeticum.jpg",
    institution: "Bibliotheca Philosophica Hermetica, Amsterdam (per the Commons record)",
    objectDate: "1471",
    caption:
      "An open copy of the first printed edition of Ficino's Latin Corpus Hermeticum (the 'Pimander'), Treviso 1471: on the left a printed note naming the scribe-printer Gerardus de Lisa and dated at Treviso 1471, on the right the opening of Ficino's argumentum with an illuminated initial. A translation, not a Greek witness.",
    creator: "Marsilio Ficino (translation); printed by Gerardus de Lisa",
    credit: "Bibliotheca Philosophica Hermetica, via Wikimedia Commons",
    licence: "Public domain (PD-old-100-1923)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "siena-hermes-pavement",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Hermes_mercurius_trismegistus_siena_cathedral.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Hermes_mercurius_trismegistus_siena_cathedral.jpg",
    institution: "Siena Cathedral",
    objectDate: "1480s",
    caption:
      "Hermes Mercurius Trismegistus, 'contemporary of Moses', in the marble pavement of Siena Cathedral. Context, not evidence for the text: it shows the antiquity Renaissance readers gave Hermes before Casaubon dated the treatises to the Roman period in 1614.",
    creator: "Attributed to Giovanni di Stefano",
    credit: "Wikimedia Commons",
    licence: "Public domain",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  ...HERMETICA_RELATED_IMAGES,
];

const LINKS: CorpusLink[] = [
  {
    key: "ch-1-9-governors-tim-41d",
    from: "herm.ch.1.9",
    to: "greek.tim.41d",
    connectionClass: "close_conceptual_parallel",
    similarities:
      "In both a divine craftsman makes the cosmos, and lesser makers (Plato's young gods, the Poimandres's seven Governors) are set over the heavens and over what is mortal.",
    differences:
      "Plato's craftsman is good and his star-gods are benevolent; in the Poimandres the Governors' government is fate, which binds the soul and must be shed on its ascent.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence:
      "The Timaeus was the most read Platonic dialogue in the Roman period, and the Hermetic writers drew on Middle Platonism; no direct quotation is shown here.",
    earlierNote: "The Timaeus (fourth century BCE) is centuries earlier.",
    scholarlyView: "The Hermetica are generally read as Egyptian-Greek religious writing shaped by Platonic and Stoic philosophy.",
    sourceKey: "copenhaver-hermetica",
    reviewStatus: "proposed",
  },
  {
    key: "ch-11-20-expand-tim-90a",
    from: "herm.ch.11.20",
    to: "greek.tim.90a",
    connectionClass: "close_conceptual_parallel",
    similarities: "Both make the highest part of the human being kin to the divine and call on it to rise to the heavens.",
    differences:
      "Plato's guardian spirit lifts us toward our kindred in heaven by study; Mind to Hermes asks him to make himself as great as God, everywhere at once, in order to know him.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence: "As for the Poimandres: Platonic influence on the Hermetica is general, not shown by quotation here.",
    reviewStatus: "proposed",
  },
  {
    key: "ch-1-25-ascent-ch-13-7-torments",
    from: "herm.ch.1.25",
    to: "herm.ch.13.7",
    connectionClass: "close_conceptual_parallel",
    similarities: "Both strip the soul of vices to free it: seven given back at the planetary zones in the Poimandres, twelve torments driven out in the rebirth of Tat.",
    differences: "The Poimandres places the stripping after death in the ascent; Treatise XIII makes it a rebirth in this life.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence: "Same corpus; XIII refers back to the 'General Discourses' and shares its vocabulary with I. Whether one author knew the other's text is not established.",
    reviewStatus: "proposed",
  },
];

const ENGLISH_EVIDENCE =
  "G. R. S. Mead's translation (Thrice-Greatest Hermes, vol. II, 1906), cleaned from the archive.org OCR. Mead translated Reitzenstein's and Parthey's Greek. Public domain.";

function treatiseKey(roman: string) {
  return `${PREFIX}.${ROMAN[roman]}`;
}

function buildPassages(): CorpusPassage[] {
  const passages: CorpusPassage[] = [];
  const imagesFor = (key: string) => {
    const found = IMAGES.filter((image) => image.passageKey === key).map((image) => {
      const copy: CorpusImage & { manuscriptKey?: string; passageKey?: string } = { ...image };
      delete copy.passageKey;
      delete copy.manuscriptKey;
      return copy;
    });
    return found.length > 0 ? found : undefined;
  };
  const byTreatise = new Map<string, [number, string][]>();
  for (const [roman, section, english] of HERMETICA_SECTIONS) {
    if (!byTreatise.has(roman)) byTreatise.set(roman, []);
    byTreatise.get(roman)!.push([section, english]);
  }

  for (const [roman, rows] of byTreatise) {
    const t = TREATISES[roman];
    const key = treatiseKey(roman);
    const whole = rows.length === 1 && rows[0][0] === 0;
    passages.push({
      key,
      divisionKind: "treatise",
      label: `CH ${roman}. ${t.title}`,
      reference: `Corpus Hermeticum ${roman}`,
      sourceKey: "mead-tgh",
      summary: t.summary,
      verificationStatus: "unverified",
      notes: `Mead's heading: "${t.meadTitle}".${whole ? " Mead prints this treatise without section numbers, so it is kept whole; Nock–Festugière divide it into sections." : ""}`,
      layers: whole
        ? [
            {
              key: "eng-mead",
              layer: "translation",
              sourceKey: "mead-tgh",
              content: rows[0][1],
              language: "English",
              licence: "public_domain",
              evidence: ENGLISH_EVIDENCE,
            },
          ]
        : [],
      themes: t.themes.map(([themeKey, note]) => ({ themeKey, note })),
      images: imagesFor(key),
    });
    if (whole) continue;

    for (const [section, english] of rows) {
      const sectionKey = `${key}.${section}`;
      const absorbs = (t.unnumbered ?? []).filter((n) => n === section + 1);
      const inParis = t.paris && !(t.parisLacks ?? []).includes(section);
      passages.push({
        key: sectionKey,
        parentKey: key,
        divisionKind: "section",
        label: absorbs.length ? `CH ${roman}.${section}–${absorbs[absorbs.length - 1]}` : `CH ${roman}.${section}`,
        reference: `Corpus Hermeticum ${roman}.${section}${absorbs.length ? `–${absorbs[absorbs.length - 1]}` : ""} (Mead's numbering)`,
        sourceKey: "mead-tgh",
        summary: SECTION_SUMMARIES[`${ROMAN[roman]}.${section}`],
        verificationStatus: "unverified",
        notes: absorbs.length
          ? `Mead's printing leaves §${absorbs.join(", ")} unnumbered; its text is included here.`
          : undefined,
        layers: [
          {
            key: "eng-mead",
            layer: "translation",
            sourceKey: "mead-tgh",
            content: english,
            language: "English",
            licence: "public_domain",
            evidence: ENGLISH_EVIDENCE,
          },
        ],
        witnesses: [
          ...(inParis
            ? [{ manuscriptKey: "paris-gr-2518", locus: t.paris, variantNote: section === 4 && roman === "II" ? t.parisNote : undefined }]
            : []),
          ...(sectionKey === "herm.ch.1.31" || sectionKey === "herm.ch.1.32" ? [{ manuscriptKey: "laur-plut-71-33", locus: "fol. 125v" }] : []),
          ...(sectionKey === "herm.ch.1.1" ? [{ manuscriptKey: "bnm-gr-z-263", locus: "fol. 42r" }] : []),
        ],
        images: imagesFor(sectionKey),
      });
    }
  }
  return passages;
}

export const HERMETICA_CORPUS: TextCorpusFile = {
  workKey: "herm.corpus-hermeticum",
  revision: "mead-2026-10",
  sources: SOURCES,
  manuscripts: MANUSCRIPTS,
  images: IMAGES.filter((image) => !image.passageKey).map((image) => {
    const copy: CorpusImage & { manuscriptKey?: string; passageKey?: string } = { ...image };
    delete copy.passageKey;
    return copy;
  }),
  passages: buildPassages(),
  links: LINKS,
};
