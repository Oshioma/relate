// RELATED PICTURES FOR THE CORPUS HERMETICUM.
//
// Pictures that help a reader of a particular treatise or section: Thoth, the
// Egyptian god the Greeks called Hermes, as Roman-period Egypt pictured him;
// the objects a treatise names (the mixing bowl of IV, the statues of XVII,
// the zodiac of XIII); the Rosetta Stone beside XVI's warning against
// translating Egyptian into Greek; and the Renaissance pictures and prints that
// show how the treatises were read once Ficino had translated them. None is a
// witness to the text. Every caption says what kind of picture it is.
//
// `passageKey` is a treatise (herm.ch.17) or a section (herm.ch.1.4).

import type { CorpusImage } from "../corpus-types";

export const HERMETICA_RELATED_IMAGES: (CorpusImage & { passageKey: string })[] = [
  {
    passageKey: "herm.ch.1",
    key: "herm-related-met-thoth-stela-pluriform",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Two-sided_stela_of_pluriform_Thoth_%281st-2nd_centuries_AD%29_MET_55.143.jpg",
    sourcePageUrl: "https://www.metmuseum.org/art/collection/search/546070",
    institution: "Metropolitan Museum of Art, New York",
    accessionNumber: "55.143",
    objectDate: "First–second century CE",
    caption:
      "A small Egyptian limestone stela of the Roman period showing Thoth in several forms: a child-god with a moon disc, a baboon enthroned under the moon, and an ibis-headed man, with ibises above. Greek-speaking Egyptians called Thoth 'Hermes the thrice-great', the name under which the Poimandres and the other treatises were written in these same centuries. Related evidence for the god, not for the text.",
    creator: "Unknown Egyptian sculptor",
    credit: "Metropolitan Museum of Art (Open Access), via Wikimedia Commons",
    licence: "CC0 1.0",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "herm.ch.1",
    key: "herm-related-pinturicchio-isis-hermes-moses",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Borgia_Apartment_-_Isis_between_Moses_and_Hermes_Trismegistus.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Borgia_Apartment_-_Isis_between_Moses_and_Hermes_Trismegistus.jpg",
    institution: "Vatican Museums, Borgia Apartment (Sala dei Santi)",
    objectDate: "1492–1494",
    caption:
      "Isis enthroned between Hermes Trismegistus and Moses, handing on her wisdom: a ceiling fresco painted by Pinturicchio for Pope Alexander VI in the Vatican, thirty years after Ficino translated the Corpus. Later artwork: it shows the Renaissance belief that Hermes was as ancient as Moses, which Isaac Casaubon disproved in 1614.",
    creator: "Pinturicchio",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-100); Public Domain Mark 1.0",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "herm.ch.1.2",
    key: "herm-related-foix-candale-pimandras-1574",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/1574_Pimandras_utraque_lingua_restitutus_%2852639739827%29.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:1574_Pimandras_utraque_lingua_restitutus_(52639739827).jpg",
    objectDate: "1574",
    imageDate: "2020",
    caption:
      "The title page of 'Mercurii Trismegisti Pimandras utraque lingua restitutus', François de Foix-Candale's Greek and Latin edition printed at Bordeaux by Simon Millanges in 1574, with a woodcut of a figure enthroned above the globe. 'Pimandras' is the Latin form of Poimandres, the name the vision gives itself at I.2. A printed edition, not a manuscript witness.",
    creator: "François de Foix-Candale (editor); Simon Millanges (printer); photograph by Ángel M. Felicísimo",
    credit: "Ángel M. Felicísimo, via Flickr and Wikimedia Commons",
    licence: "CC BY 2.0",
    licenceStatus: "attribution",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "herm.ch.1.4",
    key: "herm-related-fludd-et-sic-in-infinitum-houghton",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Houghton_EC_F6707_B638p_v.1_-_Robert_Fludd%2C_Et_sic_in_infinitum.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Houghton_EC_F6707_B638p_v.1_-_Robert_Fludd,_Et_sic_in_infinitum.jpg",
    institution: "Houghton Library, Harvard University",
    accessionNumber: "EC F6707 B638p v.1",
    objectDate: "1617 (this copy dated 1624 on Commons)",
    caption:
      "A square of black hatching with 'Et sic in infinitum' ('and so on to infinity') on each side: Robert Fludd's engraving of the darkness before creation, from his Utriusque cosmi … historia. Fludd read the Hermetica, and the picture is the darkness 'awesome and gloomy' that follows the light in Poimandres I.4. Later artwork, not an illustration made for the treatise.",
    creator: "Robert Fludd",
    credit: "Houghton Library, Harvard University, via Wikimedia Commons",
    licence: "Public domain (PD-old-100); Public Domain Mark 1.0",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "herm.ch.16.2",
    key: "herm-related-rosetta-stone",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/23/Rosetta_Stone.JPG",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Rosetta_Stone.JPG",
    institution: "British Museum, London",
    objectDate: "196 BCE",
    imageDate: "2007",
    caption:
      "The Rosetta Stone, a priestly decree of 196 BCE carved three times: in hieroglyphs, in demotic Egyptian and in Greek. Corpus Hermeticum XVI.2 warns the king to keep the teaching from being translated into Greek, because the very sound of the Egyptian names carries their power. Related evidence: Ptolemaic Egypt did publish its sacred texts in both languages side by side.",
    creator: "Unknown Egyptian scribes and stonecutters; photograph by Hans Hillewaert",
    credit: "Hans Hillewaert, via Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    passageKey: "herm.ch.17",
    key: "herm-related-louvre-hermes-thoth-balsamarium",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Louvre_Hermes-Thoth_perfume_vase.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Louvre_Hermes-Thoth_perfume_vase.jpg",
    institution: "Musée du Louvre, Paris (as the file name and Commons record indicate)",
    accessionNumber: "Br 2940 (as given on Commons)",
    objectDate: "First–second century CE",
    imageDate: "2012",
    caption:
      "A small bronze perfume vessel in the form of a bust of Hermes-Thoth, with a winged cap and inlaid silver eyes, possibly from an Alexandrian workshop, first or second century CE, found in Egypt. Corpus Hermeticum XVII tells the king to honour the images of the gods, since bodies hold reflections of the bodiless. Related evidence: an image of the Greek-Egyptian Hermes from the world the treatise was written in.",
    creator: "Unknown metalworker; photograph by Karl Steel",
    credit: "Karl Steel, via Flickr and Wikimedia Commons",
    licence: "CC BY 2.0",
    licenceStatus: "attribution",
    shows: "artefact",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },
];
