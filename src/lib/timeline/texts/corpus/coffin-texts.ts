// COFFIN TEXTS: de Buck's spells 1–1185, with what may be shown of each.
//
// No public-domain English translation of the Coffin Texts exists. Faulkner's
// complete translation (1973–78) is in copyright, so every spell carries a
// reference to it and a link to borrow it, never its text. What this file can
// give in full is older and narrower: Breasted (1912) translated the titles of
// about fifty chapters and quoted eight passages from Lacau's publication of
// the Cairo coffins. Those are kept under Breasted's own heading, numbered as
// he cited them (Lacau's chapters), because nobody has yet matched each of
// them to a de Buck spell for this archive. Only the one he quotes from the
// forerunner of Book of the Dead chapter 17 is placed at its spell (335).
//
// Summaries of individual spells are written for this archive, only for
// spells whose subject is well established, and marked unverified until
// checked against Faulkner.
//
// Hierarchy: Faulkner's volume → spell (the Book of Two Ways, spells
// 1029–1130, as its own group inside volume III) and, beside them, Breasted's
// extracts → Lacau's chapter.

import type { CorpusImage, CorpusLayer, CorpusManuscript, CorpusPassage, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";

const PREFIX = "egy.ct";

const SOURCES = INVENTORY_SOURCES.filter((s) => ["debuck-ct", "faulkner-ct", "breasted-1912", "lacau-tr"].includes(s.key));

const FAULKNER_VOLUMES: { key: string; numeral: string; first: number; last: number; url: string }[] = [
  { key: "vol-1", numeral: "I", first: 1, last: 354, url: "https://archive.org/details/ancientegyptianc0000unse_i6e5" },
  { key: "vol-2", numeral: "II", first: 355, last: 787, url: "https://archive.org/details/ancientegyptianc0000unse_i6e5" },
  { key: "vol-3", numeral: "III", first: 788, last: 1185, url: "https://archive.org/details/ancientegyptianc0000unse_v5g3" },
];
const TWO_WAYS = { first: 1029, last: 1130 };

const volumeOf = (spell: number) => FAULKNER_VOLUMES.find((v) => spell >= v.first && spell <= v.last)!;

function faulknerLayer(spell: number): CorpusLayer {
  const volume = volumeOf(spell);
  return {
    key: "eng-faulkner",
    layer: "translation",
    sourceKey: "faulkner-ct",
    contentAbsentReason: `In copyright. Faulkner, The Ancient Egyptian Coffin Texts, vol. ${volume.numeral}, spell ${spell}; the Internet Archive lends the book: ${volume.url}`,
    language: "English",
    licence: "copyrighted_reference",
    evidence: "Faulkner translates de Buck's hieroglyphic text spell by spell; his numbering is de Buck's.",
  };
}

const BREASTED_EVIDENCE =
  "J. H. Breasted, Development of Religion and Thought in Ancient Egypt (1912), translating from Lacau's publication of the Cairo coffins. Public domain.";

/** Spells whose subject is well established, summarised for this archive. */
const SPELLS: Record<number, { summary: string; themes?: [string, string][]; notes?: string }> = {
  75: {
    summary:
      "The first of a run of spells (75–83) in which the dead person becomes Shu, god of air and life, and tells how Shu came into being from the creator Atum.",
    themes: [["creation", "Shu's own account of how he came out of Atum."], ["transformation", "The dead person becomes Shu."]],
  },
  80: {
    summary:
      "From the Shu spells: Atum names his children, Shu as Life and Tefnut as Ma'at, order, and Shu, whom the dead person becomes, gives breath and life to every creature.",
    themes: [["creation", "The first children of the creator and what they stand for."], ["cosmic-law", "Tefnut named as Ma'at."]],
  },
  148: {
    summary:
      "Isis, pregnant with Horus by the dead Osiris, announces the child and asks the gods to protect him in her womb; Horus then speaks of his birth and his flight beyond the gods.",
    themes: [["death-and-rebirth", "Osiris's line continues through the son conceived after his death."]],
  },
  261: {
    summary: "A spell for becoming Heka, the power of effective words, whom the creator made before anything else existed.",
    themes: [["magic-and-sacred-words", "Heka speaks as the first thing the creator made."], ["transformation", "The dead person becomes Heka."]],
  },
  312: {
    summary: "Horus sends a messenger in falcon form to his father Osiris in the underworld. The forerunner of Book of the Dead chapter 78.",
    themes: [["underworld", "A message carried between the living Horus and the dead Osiris."]],
  },
  335: {
    summary:
      "The forerunner of Book of the Dead chapter 17. The speaker is Atum and Re at the first moment of creation, and the text already carries a commentary that explains its own phrases ('that is Osiris').",
    themes: [
      ["creation", "The speaker is the creator at his first appearance."],
      ["time-and-eternity", "'I was yesterday, I know to-morrow.'"],
    ],
    notes: "Breasted quotes its opening from the Berlin coffins published by Lepsius in 1867 (Aelteste Texte des Todtenbuchs).",
  },
  397: {
    summary:
      "Before he will ferry the dead person across, the ferryman asks the name of every part of his boat, and each must be answered. The forerunner of Book of the Dead chapter 99.",
    themes: [["underworld", "The crossing into the next world."], ["magic-and-sacred-words", "Knowing the names is what opens the way."]],
  },
  466: {
    summary:
      "One of the spells (464–468) for the Field of Offerings, a fertile land of fields and waterways in the next world, often drawn on the coffin as a plan. The forerunner of Book of the Dead chapter 110.",
    themes: [["underworld", "A landscape of the next world, drawn as a plan."]],
  },
  1029: {
    summary:
      "The opening of the Book of Two Ways, a guide to the next world painted, with a map, on the floors of coffins from Deir el-Bersha. Two routes, one by water and one by land, are kept apart by a lake of fire.",
    themes: [["underworld", "The earliest surviving map of the next world."]],
  },
  1130: {
    summary:
      "The creator's speech near the end of the Book of Two Ways: he lists four good deeds done at creation (the four winds, the flood for the poor as for the great, every person made like their fellow, and hearts made to remember the West) and says wrongdoing comes from people's own hearts.",
    themes: [["creation", "What the creator says he made, and why."], ["cosmic-law", "People were made equal; wrongdoing is their own."]],
  },
};

/**
 * Breasted's extracts, by Lacau's chapter. [chapter, Lacau reference, Breasted
 * page, heading, whether the heading is Breasted's translation of the
 * chapter's title (otherwise it is a description written for this archive),
 * his quotation if he gives one, themes].
 * Half brackets ⸢ ⸣ mark words Breasted marks as uncertain.
 */
const BREASTED: [string, string, number, string, boolean, string | null, string[]][] = [
  ["II", "Rec. 26, 67–73", 280, "Uniting of the Household of a Man with Him in the Nether World", true, "…union of the household, father, mother, children, friends, ⸢connections⸣, wives, concubines, slaves, servants, everything belonging to a man, with him in the Nether World.", []],
  ["III", "Rec. 26, 73 ff.", 281, "Eating of Bread on the Table of Re, Giving of Plenty in Heliopolis", true, null, []],
  ["IV", "Rec. 26, 76 ff.", 281, "Bread and beer at the table of Re", false, "…the sitter sits to eat bread when Re sits to eat bread. … Give to me bread when I am hungry. Give to me beer when I am thirsty.", []],
  ["VI", "Rec. 26, 225", 274, "Ascending to the Sky to the Place where Re is", true, null, ["ascension"]],
  ["VII", "Rec. 26, 226", 282, "Attachment of a charm so that the magical power of a man may not be taken away from him in the Nether World", true, null, ["magic-and-sacred-words"]],
  ["VIII", "Rec. 26, 226–7", 282, "Preventing that the head of a man be taken from him", true, null, ["magic-and-sacred-words"]],
  ["IX–X", "Rec. 26, 227 ff.", 282, "The charm against Gebga, the hostile scribe", false, null, ["magic-and-sacred-words"]],
  ["XI", "Rec. 26, 229", 277, "Reaching Orion", true, null, ["ascension"]],
  ["XIII", "Rec. 26, 232 ff.", 276, "The Advancement of a Man in the Nether World", true, null, ["underworld"]],
  ["XV", "Rec. 27, 53 f.", 275, "Becoming One Revered by the King", true, null, ["ascension"]],
  ["XVI", "Rec. 27, 54 f.", 274, "Becoming a Falcon", true, null, ["transformation"]],
  ["XVII", "Rec. 27, 55 f.", 274, "Becoming a Falcon", true, null, ["transformation"]],
  ["XIX", "Rec. 27, 217 ff.", 277, "Becoming the Nile", true, null, ["transformation"]],
  ["XX", "Rec. 27, 221–6", 279, "The crowned and purified dead man joins the voyage of the sun", false, "Brought to thee are blocks of silver and ⸢masses⸣ of malachite. Hathor, mistress of Byblos, she makes the rudders of thy ship. … It is said to thee, 'Come into the broad-hall,' by the Great who are in the temple. Bared to thee are the Four Pillars of the Sky, thou seest the secrets that are therein, thou stretchest out thy two legs upon the Pillars of the Sky and the wind is sweet to thy nose.", ["ascension"]],
  ["XXII", "Rec. 29, 143 ff.", 278, "Horus speaks to his father, the dead man made Osiris", false, "I come, I am Horus who opens thy mouth, together with Ptah who glorifies thee, together with Thoth who gives to thee thy heart (understanding); … that thou mayest remember what thou hadst forgotten. I cause that thou eat bread at the desire of thy body. I cause that thou remember what thou hast forgotten. I cause that thou eat bread … more than thou didst on earth. I give to thee thy two feet that thou mayest make the going and coming of thy two soles (or sandals). I cause that thou shouldst carry out commissions with the south wind and shouldst run with the north wind. … I cause that thou shouldst ferry over ⸢Peterui⸣ and ferry over the lake of thy wandering and the sea of (thy) sandal as thou didst on earth. Thou rulest the streams and the Phoenix. … Thou leviest on the royal domains. Thou repulsest the violent who comes in the night, the robber of early morning. … Thou goest around the countries with Re; he lets thee see the pleasant places, thou findest the valleys filled with water for washing thee and for cooling thee, thou pluckest marsh-flowers and heni-blossoms, lilies and lotus-flowers. The bird-pools come to thee by thousands, lying in thy path; when thou hast hurled thy boomerang against them, it is a thousand that fall at the sound of the wind thereof. They are ro-geese, green-fronts, quails, and kunuset. I cause that there be brought to thee the young gazelles, ⸢bullocks⸣ of white bulls; I cause that there be brought to thee males of goats and grain-fed males of sheep. There is fastened for thee a ladder to the sky. Nut gives to thee her two arms. Thou sailest in the Lily-lake. Thou bearest the wind in an eight-ship. These two fathers (Re and Atum) of the Imperishable Stars and of the Unweariable Stars sail thee. They command thee, they tow thee through the district with their imperishable ropes.", ["ascension", "death-and-rebirth"]],
  ["XXV–XXVI", "Rec. 29, 157–9", 282, "That a man may not decay in the Nether World (two chapters)", true, null, ["immortality"]],
  ["XXIX", "Rec. 30, 69 ff.", 255, "Justification before Thoth, Hereditary Prince of the Gods", true, null, ["cosmic-law"]],
  ["XXX", "Rec. 30, 71", 278, "Transformation into an ekhet-bird", true, null, ["transformation"]],
  ["XXXI", "Rec. 30, 72 f.", 278, "Transformation into the servant at the table of Hathor", true, null, ["transformation"]],
  ["XXXII", "Rec. 30, 185 f.", 275, "Embarking in the Ship of Re when he has Gone to his Ka", true, null, ["ascension"]],
  ["XXXIV", "Rec. 30, 186 f.", 280, "A man's being in his house", true, null, []],
  ["XXXV–XXXVI", "Rec. 30, 187–8", 283, "Repulsing Apophis from the Barque of Re; Repulsing the Serpent which ⸢Afflicts⸣ the Kas", true, null, ["magic-and-sacred-words"]],
  ["XXXVII", "Rec. 30, 188 f.", 283, "Going Forth from the Fire", true, null, ["underworld"]],
  ["XXXVIII", "Rec. 30, 189 f.", 274, "Becoming a Falcon", true, null, ["transformation"]],
  ["XXXIX", "Rec. 30, 190 f.", 281, "Causing that X Raise Himself Upon his Right Side", true, null, []],
  ["XL", "Rec. 30, 191", 275, "Becoming One of ⸢the Great⸣ of Heliopolis", true, null, ["transformation"]],
  ["XLI", "Rec. 30, 191 f.", 275, "Entering Into the West among the Followers of Re Every Day", true, null, ["underworld"]],
  ["XLIII", "Rec. 30, 192 f.", 277, "That the Beautiful West Rejoice at the Approach of a Man", true, null, ["underworld"]],
  ["XLIV", "Rec. 30, 193", 284, "Not Walking Head Downward", true, null, ["underworld"]],
  ["XLV", "Rec. 30, 193 f.", 281, "Eating Bread in the Nether World", true, null, []],
  ["XLVIII", "Rec. 30, 197", 283, "Entering Into the Fire and Coming Forth from the Fire Behind the Sky", true, null, ["underworld"]],
  ["XLIX", "Rec. 30, 198", 283, "Going Forth from the Fire Behind the Great God", true, null, ["underworld"]],
  ["LII", "Rec. 31, 10", 274, "Becoming Re-Atum", true, null, ["transformation"]],
  ["LIII", "Rec. 31, 10 f.", 277, "Being the Scribe of Re", true, "I am Kerkeru, scribe of Osiris.", ["transformation"]],
  ["LVIII", "Rec. 31, 15 f.", 277, "Becoming the Harvest-god (Neper)", true, null, ["transformation", "death-and-rebirth"]],
  ["LXII", "Rec. 31, 19", 277, "Burial in the West", true, null, []],
  ["LXIII", "Rec. 31, 20", 283, "Not Entering Into the Place of Execution of the Gods", true, null, ["underworld"]],
  ["LXVII", "Rec. 31, 24 f.", 280, "Building a house for a man in the Nether World, digging a pool and planting fruit-trees", true, null, []],
  ["LXXII", "Rec. 31, 26–29", 280, "Sealing of a Decree concerning the Household, to give the Household [to a man] in the Nether World", true, "Geb, hereditary prince of the gods, has decreed that there be given to me my household, my children, my brothers, my father, my mother, my slaves, and all my establishment. … Geb, hereditary prince of the gods, has said to release for me my household, ⸢my⸣ children, my brothers and sisters, my father, my mother, all my slaves, all my establishment at once, rescued from every god, from every goddess, from every death (or dead person).", []],
  ["LXXIII", "Rec. 31, 29", 283, "Repulsing Serpents and Repulsing Crocodiles", true, null, ["magic-and-sacred-words"]],
  ["LXXVIII", "Rec. 31, 164 ff.", 282, "Becoming a Magician", true, "I am a magician.", ["magic-and-sacred-words", "transformation"]],
  ["LXXX", "Rec. 31, 166", 278, "Becoming the blazing Eye of Horus", true, null, ["transformation"]],
  ["LXXXIV", "Rec. 31, 175", 284, "Power over enemies among the dead", false, "He causes that I gain the power over my enemies. I have expelled them from their tombs. I have overthrown them in their (tomb-)chapels. I have expelled those who were in their places. I have opened their mummies, destroyed their kas. I have suppressed their souls. … An edict of the Self-Generator has been issued against my enemies among the dead, among the living, dwelling in sky and earth.", ["magic-and-sacred-words"]],
  ["LXXXV", "Rec. 32, 78", 284, "Saved from the dead who go head downward", false, "Life comes to thee, but death comes not to thee. … They (Orion, Sothis, and the Morning Star) save thee from the wrath of the dead who go head downward. Thou art not among them. … Rise up for life, thou diest not; lift thee up for life, thou diest not.", ["immortality", "death-and-rebirth"]],
];

/** Where Breasted describes a chapter rather than translating it. */
const SUMMARIES: Record<string, string> = {
  "IX–X":
    "Breasted describes these chapters as a charm that lets the dead man break the pens, smash the writing outfit and tear up the rolls of Gebga, a scribe hostile to the dead.",
};

/** Breasted's passages from coffins outside Lacau's series. */
const BREASTED_OTHER: { key: string; reference: string; page: number; label: string; content: string; themes: string[] }[] = [
  {
    key: "annales-v-235",
    reference: "Annales du Service des Antiquités de l'Égypte V, 235",
    page: 274,
    label: "The dead man as the soul of the self-generating god",
    content:
      "I am the soul of the god, self-generator. … I have become he. I am he before whom the sky is silent, I am he before whom the earth is ⸢…⸣ … I have become the limbs of the god, self-generator. He has made me into his heart (understanding), he has fashioned me into his soul. I am one who has ⸢breathed⸣ the form of him who fashioned me, the august god, self-generator, whose name the gods know not. … He has made me into his heart, he has fashioned me into his soul, I was not born with a birth.",
    themes: ["transformation", "the-soul"],
  },
];

const BD17_OPENING =
  "I am Atum, I who was alone;\nI am Re at his first appearance.\nI am the Great God, self-generator,\nWho fashioned his names, lord of gods,\nWhom none approaches among the gods.\nI was yesterday, I know to-morrow.\nThe battle-field of the gods was made when I spake.\nI know the name of that Great God who is therein.\n'Praise-of-Re' is his name.\nI am that great Phoenix which is in Heliopolis.";

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "coffin-gua",
    name: "Inner coffin of Gua",
    objectKind: "coffin",
    holdingInstitution: "British Museum",
    accessionNumber: "EA 30839",
    findspot: "Deir el-Bersha",
    isApproximate: true,
    originalDateText: "12th Dynasty",
    notes: "Its floor carries the Book of Two Ways with its map. The museum's own record has not been checked for this archive.",
  },
  {
    key: "coffin-iqer",
    name: "Inner facing of the coffin of Iqer",
    objectKind: "coffin",
    holdingInstitution: "Museo Egizio, Turin",
    accessionNumber: "S. 15744/01",
    isApproximate: true,
    originalDateText: "Twelfth Dynasty",
    notes: "Found in 1914 with the coffin itself almost destroyed by termites. The museum describes its spells as a local tradition of the Coffin Texts.",
  },
  {
    key: "coffin-khety-met",
    name: "Coffin of Khety, Overseer of the Storehouse",
    objectKind: "coffin",
    holdingInstitution: "Metropolitan Museum of Art",
    isApproximate: true,
    originalDateText: "mid-12th Dynasty (coffin type)",
    catalogueUrl: "https://www.metmuseum.org/art/collection/search/555675",
    notes: "The museum describes the lid and the lower sides as inscribed with Coffin Texts in cursive script, and the floor as covered with texts in two 'islands' surrounded by water.",
  },
  {
    key: "coffin-rehuerdjersen",
    name: "Coffin of Rehu-er-djer-sen",
    objectKind: "coffin",
    holdingInstitution: "Walters Art Museum, Baltimore",
    accessionNumber: "62.5",
    isApproximate: true,
    originalDateText: "ca. 2000–1950 BC",
    notes: "The museum lists offering formulas and Coffin Texts among its inscriptions.",
  },
  {
    key: "coffin-djehutynakht-outer",
    name: "Outer coffin of the governor Djehutynakht",
    objectKind: "coffin",
    findspot: "Deir el-Bersha, tomb 10A",
    startYear: -2009,
    endYear: -1960,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "late Dynasty 11 – early Dynasty 12, 2010–1961 B.C.",
    datingEvidence: "As given with the photograph on Wikimedia Commons, which appears to copy the museum's label; not checked against the museum's record.",
    notes: "One of the cedar coffins from the Bersha tomb of Djehutynakht, the richest single group of Coffin Text witnesses. The Commons record does not name the holding museum, so none is given here.",
  },
];

const IMAGES: (CorpusImage & { spell?: number; manuscriptKey?: string })[] = [
  {
    key: "coffin-gua-two-ways",
    spell: 1029,
    url: "https://upload.wikimedia.org/wikipedia/commons/1/14/Coffin_of_Gua.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Coffin_of_Gua.jpg",
    institution: "British Museum",
    accessionNumber: "EA 30839",
    objectDate: "12th Dynasty",
    caption:
      "The floor of the inner coffin of Gua from Deir el-Bersha, painted with the Book of Two Ways: the map of the next world with its two routes, by water and by land.",
    creator: "Photograph: Jon Bodsworth (Egypt Archive)",
    credit: "Jon Bodsworth, via Wikimedia Commons",
    licence: "Copyrighted free use",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "coffin-iqer-inner-facing",
    manuscriptKey: "coffin-iqer",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Inner_facing_of_the_coffin_of_Iqer%2C_wood_-_Museo_Egizio%2C_Turin_S_15744_01_p02.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Inner_facing_of_the_coffin_of_Iqer,_wood_-_Museo_Egizio,_Turin_S_15744_01_p02.jpg",
    institution: "Museo Egizio, Turin",
    accessionNumber: "S. 15744/01",
    objectDate: "Twelfth Dynasty",
    caption:
      "Two boards from the inner walls of Iqer's wooden coffin, covered in dense columns of Coffin Text spells that the Museo Egizio identifies as a local tradition of the corpus.",
    credit: "Museo Egizio, Turin, via Wikimedia Commons",
    licence: "CC0 1.0",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "coffin-khety-met",
    manuscriptKey: "coffin-khety-met",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/db/DP-15316-001.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:DP-15316-001.jpg",
    institution: "Metropolitan Museum of Art",
    objectDate: "mid-12th Dynasty",
    caption:
      "Two planks of the wooden coffin of Khety, Overseer of the Storehouse, packed with columns of Coffin Texts in cursive script. The Met describes the lid as two planks inscribed this way, so this is probably the lid.",
    credit: "The Metropolitan Museum of Art, via Wikimedia Commons",
    licence: "CC0 1.0",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "coffin-rehuerdjersen-walters",
    manuscriptKey: "coffin-rehuerdjersen",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Egyptian_-_Coffin_of_Rehu-er-djer-sen_-_Walters_625_-_Profile.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Egyptian_-_Coffin_of_Rehu-er-djer-sen_-_Walters_625_-_Profile.jpg",
    institution: "Walters Art Museum, Baltimore",
    accessionNumber: "62.5",
    objectDate: "ca. 2000–1950 BC",
    caption:
      "The cedar coffin of Rehu-er-djer-sen seen from the side. Its Coffin Texts are written inside; this view shows the plain exterior with its band of offering prayer.",
    credit: "Walters Art Museum, via Wikimedia Commons",
    licence: "CC BY-SA 3.0",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "coffin-djehutynakht-outer-side",
    manuscriptKey: "coffin-djehutynakht-outer",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Outer_Coffin_of_Djehutynakht_1.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Outer_Coffin_of_Djehutynakht_1.jpg",
    objectDate: "Late Dynasty 11 – early Dynasty 12, 2010–1961 BC",
    imageDate: "2012",
    caption:
      "A long side of the cedar outer coffin of the governor Djehutynakht from Deir el-Bersha, in a museum case: plain planks framed by two horizontal bands of painted hieroglyphs. On coffins of this kind the Coffin Texts are written on the inner faces, which this view does not show; the identification is the photographer's caption.",
    creator: "Photograph by Marcus Cyron",
    credit: "Marcus Cyron, via Wikimedia Commons, CC BY 3.0",
    licence: "CC BY 3.0",
    licenceStatus: "attribution",
    shows: "artefact",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },
  {
    key: "lacau-1903-coffin-nefri",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Coffin_Nefri_Wahkare_Lacau.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Coffin_Nefri_Wahkare_Lacau.jpg",
    institution: "Egyptian Museum, Cairo",
    accessionNumber: "CG 28088",
    objectDate: "12th Dynasty",
    imageDate: "1903",
    caption:
      "Lacau's 1903 plate of an inner wall of the coffin of the steward Nefri (Cairo CG 28088) from Deir el-Bersha: a painted false door, an offering table, a frieze of objects and, at the right, columns of cursive text. The plate does not say which spells the text holds.",
    creator: "Pierre Lacau",
    credit: "Lacau, Sarcophages antérieurs au Nouvel Empire I (1903), pl. XXVII",
    licence: "Public domain",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];

function imagesFor(spell: number): CorpusImage[] | undefined {
  const found = IMAGES.filter((image) => image.spell === spell).map((image) => {
    const copy: CorpusImage & { spell?: number; manuscriptKey?: string } = { ...image };
    delete copy.spell;
    delete copy.manuscriptKey;
    return copy;
  });
  return found.length > 0 ? found : undefined;
}

function spellPassage(spell: number, parentKey: string): CorpusPassage {
  const known = SPELLS[spell];
  const layers: CorpusLayer[] = [faulknerLayer(spell)];
  if (spell === 335) {
    layers.push({
      key: "eng-breasted",
      layer: "translation",
      sourceKey: "breasted-1912",
      content: BD17_OPENING,
      language: "English",
      licence: "public_domain",
      evidence: `${BREASTED_EVIDENCE} The opening only (p. 275), quoted from the Berlin coffins.`,
    });
  }
  return {
    key: `${PREFIX}.${spell}`,
    parentKey,
    divisionKind: "spell",
    label: `Spell ${spell}`,
    reference: `CT ${spell} (de Buck)`,
    sourceKey: "debuck-ct",
    summary: known?.summary,
    verificationStatus: "unverified",
    notes: known?.notes,
    layers,
    themes: known?.themes?.map(([themeKey, note]) => ({ themeKey, note })),
    images: imagesFor(spell),
  };
}

function buildPassages(): CorpusPassage[] {
  const passages: CorpusPassage[] = [];
  for (const volume of FAULKNER_VOLUMES) {
    const volumeKey = `${PREFIX}.${volume.key}`;
    passages.push({
      key: volumeKey,
      divisionKind: "part",
      label: `Spells ${volume.first}–${volume.last}`,
      reference: `Faulkner, vol. ${volume.numeral}`,
      sourceKey: "faulkner-ct",
      verificationStatus: "unverified",
      notes: "Grouped as Faulkner's three volumes divide them. The spell numbers are de Buck's.",
      layers: [],
    });
    for (let spell = volume.first; spell <= volume.last; spell++) {
      if (spell === TWO_WAYS.first) {
        passages.push({
          key: `${PREFIX}.two-ways`,
          parentKey: volumeKey,
          divisionKind: "part",
          label: `Book of Two Ways (spells ${TWO_WAYS.first}–${TWO_WAYS.last})`,
          reference: `CT ${TWO_WAYS.first}–${TWO_WAYS.last} (de Buck)`,
          sourceKey: "debuck-ct",
          summary:
            "A guide to the next world written, with a map, on the floors of coffins from Deir el-Bersha: two routes, by water and by land, separated by a lake of fire, with the gates, guardians and fiery places along them.",
          verificationStatus: "unverified",
          notes: "The span usually given for the Book of Two Ways in de Buck's numbering. Coffins carry different versions of it.",
          layers: [],
          themes: [{ themeKey: "underworld", note: "The earliest surviving map of the next world." }],
        });
      }
      const inTwoWays = spell >= TWO_WAYS.first && spell <= TWO_WAYS.last;
      passages.push(spellPassage(spell, inTwoWays ? `${PREFIX}.two-ways` : volumeKey));
    }
  }

  const breastedKey = `${PREFIX}.breasted`;
  passages.push({
    key: breastedKey,
    divisionKind: "part",
    label: "Breasted's translations (1912)",
    reference: "Breasted, Development of Religion and Thought in Ancient Egypt, pp. 253–284",
    sourceKey: "breasted-1912",
    summary:
      "The chapter titles and passages Breasted translated in 1912 from the Cairo coffins Lacau had just published. They are filed by Lacau's chapter numbers, as Breasted cites them; matching each to a de Buck spell has not been done yet.",
    verificationStatus: "unverified",
    layers: [],
  });
  for (const [chapter, lacau, page, title, titleIsBreasted, quote, themes] of BREASTED) {
    const text = [titleIsBreasted ? `${title}.` : null, quote].filter(Boolean).join("\n\n");
    passages.push({
      key: `${PREFIX}.lacau-${chapter.toLowerCase().replace("–", "-")}`,
      parentKey: breastedKey,
      divisionKind: "chapter",
      label: `Lacau ${chapter}: ${title}`,
      reference: `Lacau, Textes religieux ${chapter} (${lacau}); Breasted 1912, p. ${page}`,
      sourceKey: "lacau-tr",
      verificationStatus: "unverified",
      notes: "Lacau's chapter number. The matching de Buck spell number has not been established for this archive.",
      summary: SUMMARIES[chapter],
      layers: text
        ? [
            {
              key: "eng-breasted",
              layer: "translation",
              sourceKey: "breasted-1912",
              content: text,
              language: "English",
              licence: "public_domain",
              evidence: `${BREASTED_EVIDENCE} ${
                titleIsBreasted && quote
                  ? "The chapter's title in Breasted's words, then his quotation"
                  : titleIsBreasted
                    ? "Breasted gives the chapter's title only"
                    : "Breasted's quotation; the heading above it is this archive's"
              } (p. ${page}).`,
            },
          ]
        : [],
      themes: themes.length > 0 ? themes.map((themeKey) => ({ themeKey, note: `${title}.` })) : undefined,
    });
  }
  for (const other of BREASTED_OTHER) {
    passages.push({
      key: `${PREFIX}.breasted-${other.key}`,
      parentKey: breastedKey,
      divisionKind: "section",
      label: other.label,
      reference: `${other.reference}; Breasted 1912, p. ${other.page}`,
      sourceKey: "breasted-1912",
      verificationStatus: "unverified",
      notes: "From a coffin published outside Lacau's series. The de Buck spell number has not been established for this archive.",
      layers: [
        {
          key: "eng-breasted",
          layer: "translation",
          sourceKey: "breasted-1912",
          content: other.content,
          language: "English",
          licence: "public_domain",
          evidence: `${BREASTED_EVIDENCE} p. ${other.page}.`,
        },
      ],
      themes: other.themes.map((themeKey) => ({ themeKey, note: `${other.label}.` })),
    });
  }
  return passages;
}

export const COFFIN_TEXTS_CORPUS: TextCorpusFile = {
  workKey: "egy.coffin-texts",
  revision: "faulkner-ref-2026-10",
  sources: SOURCES,
  manuscripts: MANUSCRIPTS,
  images: IMAGES.filter((image) => image.spell == null).map((image) => {
    const copy: CorpusImage & { spell?: number; manuscriptKey?: string } = { ...image };
    delete copy.spell;
    return copy;
  }),
  passages: buildPassages(),
};
