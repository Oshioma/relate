// PICTURES FOR ORIGEN, AGAINST CELSUS VI.22–38.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). No manuscript page of these chapters, and no ancient copy of
// the diagram, was found on Wikimedia Commons; the diagram Origen describes
// does not survive. So the pictures are:
// - a page of the Tura papyrus (Cairo, Egyptian Museum JE 88747), which the
//   Commons file page calls the earliest witness of the treatise: the work,
//   not these chapters, and its identification and date are the file page's,
//   so it is marked UNVERIFIED;
// - a page of a fifteenth-century Greek manuscript of the work, which the file
//   page identifies as BnF Grec 945, f. 48r: the work, not these chapters,
//   with its shelfmark and date taken from the file page, so UNVERIFIED;
// - a floor mosaic photographed at Ostia, which the file page identifies as
//   the Mithraeum of the Seven Gates: related evidence for the Mithraic
//   'ladder' of VI.22, not the ladder itself, and UNVERIFIED;
// - Jacques Matter's nineteenth-century reconstruction of the diagram, from
//   the plates of his Histoire critique du Gnosticisme, captioned as one;
// - Bernd Witte's modern reconstruction of the Ophite diagram (1993), drawn
//   from Origen's description and uploaded by its author: a reconstruction,
//   captioned as one, placed on VI.38, where Origen describes the diagram's
//   circles and inscriptions.
// Every picture is from a Wikimedia Commons file page, with the licence as
// that page states it, and was looked at before it was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

export const ORIGEN_IMAGES: Placed[] = [
  {
    key: "origen-tura-papyrus-cairo-je-88747-p29",
    passageKey: "gnostic.origen.6",
    url: `${COMMONS}/2/24/Origenes%2C_Papyrus_Cairo%2C_JE_88747.jpg`,
    sourcePageUrl: `${FILE}Origenes,_Papyrus_Cairo,_JE_88747.jpg`,
    institution: "Egyptian Museum, Cairo (as the file page says; not checked)",
    accessionNumber: "JE 88747, page 29 (as the file page says; not checked)",
    objectDate: "Late sixth or early seventh century, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — A black-and-white photograph of a papyrus page of Greek, written in long lines in a sloping hand, with a long split down the left of the text, holes along the edges, and three short indented lines at the foot beside a marginal mark. The file page identifies it as page 29 of the papyrus Cairo, Egyptian Museum JE 88747, from Tura, containing Origen's Against Celsus, and calls it the earliest witness of the treatise. It shows the work, not Book VI, chapters 22–38.",
    whatIsUnverified:
      "That this is page 29 of Cairo JE 88747, that the papyrus holds Against Celsus, and its date: all are the file page's, which gives its source only as '2d copy' (the picture looks like a photograph of a printed reproduction). The Greek was not read for this import, so which part of the work the page holds is not known here.",
    creator: "Unknown scribe",
    credit: "Wikimedia Commons (source given as '2d copy')",
    licence: "Public domain (PD-Art, PD-old-70), as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "origen-bnf-grec-945-f48r",
    passageKey: "gnostic.origen.6",
    url: `${COMMONS}/1/1c/Grec_945_48r.jpg`,
    sourcePageUrl: `${FILE}Grec_945_48r.jpg`,
    institution: "Bibliothèque nationale de France (as the file page says)",
    accessionNumber: "Grec 945, folio 48 recto (the shelfmark as the file page gives it; '48' is written at the top right of the page)",
    objectDate: "Fifteenth century, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — A page of a Greek manuscript in a cursive hand, numbered 48 at the top right, opening with a red heading marked with a cross and a tall red decorated initial; the margin of the facing page shows at the left. The file page identifies it as the Bibliothèque nationale de France's manuscript Grec 945, of the fifteenth century, containing Origen's eight books Against Celsus. It shows a Greek copy of the work, not Book VI, chapters 22–38.",
    whatIsUnverified:
      "The shelfmark, the date and the identification of the text are the file page's, which credits the Bibliothèque nationale de France; the library's own record was not reached. The red heading seems to name Origen and a book ('βιβλίον'), but it was not read with confidence, so which book of Against Celsus begins on this page is not known here.",
    creator: "Unknown scribe",
    credit: "Bibliothèque nationale de France, via Wikimedia Commons",
    licence: "Public domain, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "origen-ostia-mithraeum-seven-gates-mosaic",
    passageKey: "gnostic.origen.6.22",
    url: `${COMMONS}/a/a0/Mithraeum_of_the_Seven_Gates_01.jpg`,
    sourcePageUrl: `${FILE}Mithraeum_of_the_Seven_Gates_01.jpg`,
    institution: "In place, Ostia Antica (Regio IV, Insula V, 13, as the file page gives it)",
    objectDate: "About 160–170 CE, as the file page gives it; not checked",
    imageDate: "2019",
    caption:
      "UNVERIFIED — Related evidence, not the ladder Celsus describes: a black-and-white floor mosaic photographed in sunlight and shadow, showing a row of gates drawn in black tesserae, a central arch on columns topped with battlements and pinnacles, and smaller gates with battlements on either side. The file page identifies it as the floor of the Mithraeum of the Seven Gates at Ostia, laid about 160–170 CE, and reads the seven gates as the seven planetary spheres through which the initiates' souls passed. Celsus, as Origen quotes him (VI.22), describes a Mithraic 'ladder' of seven gates and an eighth; whether this floor has anything to do with it is a modern comparison, not something either writer says.",
    whatIsUnverified:
      "That the photograph shows the Mithraeum of the Seven Gates, its date and its reading as the planetary spheres are all the file page's (from the photographer's Flickr description); the site's publications were not read. Only part of the row of gates is in the picture, so the number seven was not counted on it. No ancient writer connects this floor with Celsus's ladder.",
    creator: "Unknown Roman mosaicist; photograph by MumblerJamie",
    credit: "MumblerJamie, CC BY-SA 2.0, via Flickr and Wikimedia Commons",
    licence: "CC BY-SA 2.0, as the file page states (Flickr review passed)",
    licenceStatus: "open",
    shows: "site",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "origen-matter-ophite-diagram-reconstruction",
    passageKey: "gnostic.origen.6.25",
    url: `${COMMONS}/b/b8/Ophitediagram-matter.png`,
    sourcePageUrl: `${FILE}Ophitediagram-matter.png`,
    imageDate: "1826, as the file page gives it",
    caption:
      "A nineteenth-century reconstruction of the Ophite diagram by Jacques Matter, from the plates of his Histoire critique du Gnosticisme ('Planche I. D., Fig. 5'), drawn from Origen's description; it is not a copy of an ancient diagram, none of which survives. From the top: small circles with Greek words; a ring of Greek letters around four circles inscribed γνῶσις, σοφία, φύσις and σύνεσις (knowledge, wisdom, nature, understanding), with a gateway and an empty square beside it; a black band labelled 'Géhenne ou Tartare'; a circle headed 'Leviathan' holding seven small circles with names read here as Orai, Eloi, Astaphaï, Sabaoth, Iao, Ialdabaoth and Adonaï, between the words 'Formulaires de Prières' (forms of prayer); a band labelled 'Atmosphère terrestre'; and a lower circle, headed by three circles marked '?', with seven animal figures named Michael, Suriel, Raphael, Gabriel, Thautabaoth, Erataoth and Onoël, above 'Behemoth'. Faint pencilled notes beside some names were not read. Matter's arrangement differs from Witte's of 1993: both are readings of Origen's words.",
    creator: "Jacques Matter",
    credit:
      "Jacques Matter, Histoire critique du Gnosticisme, vol. III, plate I, D, Public domain, via Wikimedia Commons",
    licence: "Public domain, as the file page states",
    licenceStatus: "open",
    shows: "reconstruction",
    identificationStatus: "modern_interpretation",
    verificationStatus: "unverified",
  },
  {
    key: "origen-witte-ophite-diagram-reconstruction",
    passageKey: "gnostic.origen.6.38",
    url: `${COMMONS}/5/5b/Ophitendiagramm2.jpg`,
    sourcePageUrl: `${FILE}Ophitendiagramm2.jpg`,
    imageDate: "1993",
    caption:
      "A modern reconstruction of the Ophite diagram, drawn by Bernd Witte from Origen's description for his book Das Ophitendiagramm nach Origenes Contra Celsum (1993); it is not a copy of an ancient diagram, none of which survives. Concentric circles lie inside a serpent labelled in Greek 'Leviathan', with 'Leviathan, the soul of all things' written at the right. Down the left, beside small figures, are seven names, read here as Ialdabaoth, Iao, Sabaoth, Adonaios, Astaphaios, Ailoaios and Horaios. At the centre is Paradise, with 'the tree of knowledge and of life' and a flaming sword; a dark band at the lower right is labelled Tartarus (Gehenna), and Behemoth lies under the lowest circle. Below are seven winged animals, a lion, a horned beast, a serpent, an eagle, a bear, a dog and an ass, named Michael, Souriel, Raphael, Gabriel, Thauthabaoth, Erathaoth and Thaphabaoth (Onoel). The arrangement is Witte's reading of Against Celsus VI.25–38, not Origen's words.",
    creator: "Bernd Witte",
    credit: "Bernd Witte, Das Ophitendiagramm nach Origenes Contra Celsum (Altenberge, 1993), p. 142, via Wikimedia Commons, CC BY 3.0",
    licence: "CC BY 3.0 or GFDL, as the file page states; the author asks that his book be quoted as the source",
    licenceStatus: "open",
    shows: "reconstruction",
    identificationStatus: "modern_interpretation",
    verificationStatus: "unverified",
  },
];
