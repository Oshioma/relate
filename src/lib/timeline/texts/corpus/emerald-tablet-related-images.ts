// RELATED PICTURES FOR THE EMERALD TABLET.
//
// The manuscripts and early prints of the Tablet are on their versions already
// (emerald-tablet.ts). These are the pictures alchemists made from its lines
// once the Latin Vulgate circulated: Michael Maier turned 'the wind carried it
// in its womb' and 'the earth is its nurse' into the first two emblems of his
// Atalanta fugiens; the Rosarium philosophorum set the king and queen on the
// Sun and Moon its 'father' and 'mother'; Maier and Stolcius drew Hermes
// himself. All are later artwork, not evidence for the text's origin, and every
// caption says so. Newton's portrait sits beside his own translation.
//
// `passageKey` places a picture on a version (arab.tab.newton) or one of its
// lines (arab.tab.vulgate.06).

import type { CorpusImage } from "../corpus-types";

export const EMERALD_TABLET_RELATED_IMAGES: (CorpusImage & { passageKey: string })[] = [
  {
    passageKey: "arab.tab.vulgate.05",
    key: "emerald-related-rosarium-king-and-queen-on-sun-and-moon-wellcome",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Woodcut_depicting_the_king_%26_queen_standing_atop_a_sun_%26_moon_Wellcome_L0073562.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Woodcut_depicting_the_king_%26_queen_standing_atop_a_sun_%26_moon_Wellcome_L0073562.jpg",
    institution: "Wellcome Collection, London",
    accessionNumber: "L0073562 (Wellcome photo number)",
    objectDate: "1550",
    caption:
      "A woodcut from the Rosarium philosophorum, bound with De alchimia opuscula complura veterum philosophorum (1550): a crowned king standing on the Sun and a crowned queen standing on a crescent Moon join hands and hold crossed flowering branches, with a dove and a star above. The Vulgate's fifth line says of the one thing, 'The father thereof is the Sun, the mother the Moon'. Later artwork: how sixteenth-century alchemists pictured that line, not evidence for the Tablet itself.",
    creator: "Unknown woodcut artist",
    credit: "Wellcome Collection, via Wikimedia Commons",
    licence: "CC BY 4.0",
    licenceStatus: "attribution",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "arab.tab.vulgate.06",
    key: "emerald-related-maier-atalanta-fugiens-emblem-1",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/39/Atalanta_Fugiens_Emblema_I.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Atalanta_Fugiens_Emblema_I.jpg",
    objectDate: "1617",
    caption:
      "Emblem I of Michael Maier's Atalanta fugiens (Oppenheim, 1617), with the motto 'Portavit eum ventus in ventre suo' ('The wind carried it in its belly'): a wind-god with billowing cloud for hair strides over a coastal landscape, a child visible in his belly. The motto is the Vulgate's sixth line, 'Portavit illuc ventus in ventre suo'. Later artwork: an alchemist's emblem of the line, not evidence for the Tablet's origin.",
    creator: "Michael Maier (author); engraving attributed on Commons to the book only",
    credit: "Internet Archive scan, via Wikimedia Commons",
    licence: "Public domain (PD-old-70, PD-US-expired); Public Domain Mark 1.0",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "arab.tab.vulgate.06",
    key: "emerald-related-maier-atalanta-fugiens-emblem-2",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Michael_Maier_Atalanta_Fugiens_Emblem_02.jpeg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Michael_Maier_Atalanta_Fugiens_Emblem_02.jpeg",
    objectDate: "1617",
    caption:
      "Emblem II of Michael Maier's Atalanta fugiens (Oppenheim, 1617), with the motto 'Nutrix ejus terra est' ('Its nurse is the earth'): a woman whose body is the globe of the earth suckles a child at her breast, while a goat and a she-wolf nurse infants at her feet. The motto is the second half of the Vulgate's sixth line. Later artwork: an alchemist's emblem of the line, not evidence for the Tablet's origin.",
    creator: "Michael Maier (author)",
    credit: "Internet Archive scan, via Wikimedia Commons",
    licence: "Public domain (PD-old-100); Public Domain Mark 1.0",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "arab.tab.vulgate.17",
    key: "emerald-related-maier-hermes-aegyptius-symbola-1617",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Hermes_Aegyptius%2C_from_M._Maier%2C_%22Symbola_aureae...%22%2C_1617.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Hermes_Aegyptius,_from_M._Maier,_%22Symbola_aureae...%22,_1617.jpg",
    institution: "Wellcome Collection, London",
    accessionNumber: "L0022783 (Wellcome photo number)",
    objectDate: "1617",
    caption:
      "'Hermes Aegyptius', a bearded sage in a pointed hood and a richly patterned robe, holding up an armillary sphere: a roundel portrait from Michael Maier's Symbola aureae mensae duodecim nationum (Frankfurt, 1617), which sets Hermes first among the twelve masters of alchemy. In the Vulgate's seventeenth line the speaker says, 'I am called Hermes Trismegistus, because I hold three parts of the wisdom of the whole world'. Later artwork: an imagined portrait, not a likeness of anyone.",
    creator: "Michael Maier (author)",
    credit: "Wellcome Collection, via Wikimedia Commons",
    licence: "CC BY 4.0",
    licenceStatus: "attribution",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "arab.tab.newton.05",
    key: "emerald-related-stolcius-viridarium-hermes-sun-and-moon",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/15/Trismegistos.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Trismegistos.jpg",
    objectDate: "1624",
    caption:
      "Hermes Trismegistus in a pointed cap, an armillary sphere in one hand, pointing with the other to a flaming Sun above and the Moon below: an engraving from Daniel Stolcius von Stolzenberg's Viridarium chymicum (Frankfurt, 1624), a book of alchemical emblems that reused plates from Maier's works. Newton's fifth line reads 'The Sun is its father, the moon its mother'. Later artwork: the alchemists' picture of the line, not evidence for the Tablet.",
    creator: "Daniel Stolcius von Stolzenberg (compiler)",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-old-70); Public Domain Mark 1.0",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "arab.tab.newton",
    key: "emerald-related-newton-portrait-after-kneller-1689",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/39/GodfreyKneller-IsaacNewton-1689.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:GodfreyKneller-IsaacNewton-1689.jpg",
    institution: "Isaac Newton Institute for Mathematical Sciences, University of Cambridge",
    objectDate: "Copy after Godfrey Kneller's portrait of 1689",
    caption:
      "Isaac Newton at forty-six, with long grey hair, in a copy (Commons names James Thornhill as the copyist) of the portrait Godfrey Kneller painted in 1689. Newton's English translation of the Tablet, in Keynes MS 28, belongs to the same years of his alchemical study. Portrait of the translator, not evidence for the text.",
    creator: "James Thornhill, after Sir Godfrey Kneller (as given on Commons)",
    credit: "Isaac Newton Institute, via Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-100); Public Domain Mark 1.0",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];
