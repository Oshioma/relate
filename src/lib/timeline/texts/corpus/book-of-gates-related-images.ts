// PICTURES OF THE BOOK OF GATES.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"): the sarcophagus of Seti I that Budge translates, then the
// royal tombs (Horemheb's KV57, the earliest copy; Seti I's KV17; Ramesses
// VI's KV9), then related copies and drawings. Every picture is from a
// Wikimedia Commons file page, with the licence as that page states it, and
// was looked at before it was added. A picture placed at a division or
// register on the strength of an uploader's hour number is marked UNVERIFIED:
// Budge's divisions and Hornung's hours are counted differently, and the
// match has not been checked against an edition's plates.

import type { Placed } from "./budge-underworld";

export const BOOK_OF_GATES_IMAGES: Placed[] = [
  {
    key: "gates-seti-sarcophagus-rim-djehouty-2023",
    manuscriptKey: "seti-sarcophagus",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Sarcophagus_of_Seti_I_2023-02-17c.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Sarcophagus_of_Seti_I_2023-02-17c.jpg",
    institution: "Sir John Soane's Museum, London",
    objectDate: "Reign of Seti I, Nineteenth Dynasty (c. 1290–1279 BCE)",
    imageDate: "17 February 2023",
    caption:
      "The alabaster sarcophagus of Seti I in Sir John Soane's Museum, the copy of the Book of Gates that Budge translates: a close view of the upper edge of the chest, with a band of incised hieroglyphs including the king's cartouches, a band of small drilled pits beneath it, and the tops of the inscribed columns below.",
    creator: "Djehouty",
    credit: "Djehouty, via Wikimedia Commons",
    licence: "Creative Commons Attribution-Share Alike 4.0 International (CC BY-SA 4.0)",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "gates-kv57-judgment-hall-soutekh67",
    passageKey: "egy.gates.6.hall-1",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c0/La_tombe_de_Horemheb_Tribunal.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:La_tombe_de_Horemheb_Tribunal.jpg",
    objectDate: "Reign of Horemheb, late Eighteenth Dynasty (c. 1319–1292 BCE), as the uploader identifies the tomb",
    imageDate: "8 June 2014",
    caption:
      "UNVERIFIED — The Judgment Hall of Osiris, which the uploader places in the tomb of Horemheb (KV57) and calls the fifth hour of the Book of Gates: Osiris enthroned at left, a mummy-shaped figure holding the balance, a row of men standing on a flight of steps, Anubis at upper right, and a small boat with an ape and a pig — the elements Budge describes for this scene.",
    whatIsUnverified:
      "That the photograph is of KV57 rests on the uploader's description, and the uploader's 'fifth hour' is a different count from Budge's, who places the hall between his fifth gate and sixth division. The scene itself matches Budge's description.",
    creator: "Soutekh67",
    credit: "Soutekh67, via Wikimedia Commons",
    licence: "Creative Commons Attribution-Share Alike 3.0 Unported (CC BY-SA 3.0)",
    licenceStatus: "share_alike",
    shows: "evidence_photograph",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "gates-kv17-solar-barque-raddato-2020",
    passageKey: "egy.gates.5.middle",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/KV17%2C_the_tomb_of_Pharaoh_Seti_I_of_the_Nineteenth_Dynasty%2C_Burial_chamber_J%2C_Book_of_Gates%2C_5th_hour%2C_detail_of_the_solar_barque%2C_Valley_of_the_Kings%2C_Egypt_%2849845803783%29.jpg",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:KV17,_the_tomb_of_Pharaoh_Seti_I_of_the_Nineteenth_Dynasty,_Burial_chamber_J,_Book_of_Gates,_5th_hour,_detail_of_the_solar_barque,_Valley_of_the_Kings,_Egypt_(49845803783).jpg",
    objectDate: "Reign of Seti I, Nineteenth Dynasty (c. 1290–1279 BCE)",
    imageDate: "11 February 2020",
    caption:
      "UNVERIFIED — The boat of the sun in the tomb of Seti I (KV17), labelled by the photographer as the fifth hour of the Book of Gates: the ram-headed sun god with the disk stands in a shrine wrapped in the coils of the serpent Mehen, with a standing god before and behind it — the arrangement Budge describes in the middle of each division, with Sa and Heka.",
    whatIsUnverified:
      "Which hour this is rests on the photographer's label ('Book of Gates, 5th hour', burial chamber J). Budge's numbering differs from the hour count used by the label, and the boat looks much the same in every division, so the placement at Budge's fifth division is not checked.",
    creator: "Carole Raddato",
    credit: "Carole Raddato from Frankfurt, Germany, via Wikimedia Commons",
    licence: "Creative Commons Attribution-Share Alike 2.0 Generic (CC BY-SA 2.0)",
    licenceStatus: "share_alike",
    shows: "evidence_photograph",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "gates-kv9-drowned-prazeres-2019",
    passageKey: "egy.gates.8.middle",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/df/KV9_Tomb_of_Ramses_V-VI_DSCF2767.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:KV9_Tomb_of_Ramses_V-VI_DSCF2767.jpg",
    objectDate: "Reign of Ramesses VI, Twentieth Dynasty (c. 1145–1137 BCE)",
    imageDate: "21 June 2019",
    caption:
      "UNVERIFIED — The tomb of Ramesses VI (KV9), fourth corridor, left wall, which the uploader identifies as the ninth division of the Book of Gates: in the middle register a long blue band of water in which small figures lie and swim, with a god standing at its end; above, a row of figures with long bird-like bodies; below, a great undulating serpent with figures rising from its coils. The water scene matches Budge's description of the tank of the drowned in his eighth division.",
    whatIsUnverified:
      "The uploader's 'ninth division' is not Budge's numbering, and the placement at Budge's eighth division rests on this archive's matching of the water scene to his description, not on an edition's plates.",
    creator: "R Prazeres",
    credit: "R Prazeres, via Wikimedia Commons",
    licence: "Creative Commons Attribution-Share Alike 4.0 International (CC BY-SA 4.0)",
    licenceStatus: "share_alike",
    shows: "evidence_photograph",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "gates-kv11-enemies-jackal-standard-tmp",
    passageKey: "egy.gates.6.seti-middle",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Enemies_bound_to_jackal-headed_pillar_%28KV11%29.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Enemies_bound_to_jackal-headed_pillar_(KV11).jpg",
    objectDate: "Reign of Ramesses III, Twentieth Dynasty",
    caption:
      "UNVERIFIED — Related evidence from another royal copy, the tomb of Ramesses III (KV11): two men with their arms bound to a black jackal-headed standard, a mummy-shaped god and a standing god holding a long staff. The file page calls it Book of Gates 'sixth division (P)/seventh hour (H), middle register, scene 45', the scene Budge describes from Seti I's sarcophagus as enemies bound to standards before the god Tem.",
    whatIsUnverified:
      "The scene and division numbers are the file page's, taken from the Theban Mapping Project; they have not been checked against Budge's or Hornung's plates. The photographer is unknown and the public-domain claim for a photograph of a relief is the uploader's.",
    creator: "Unknown (Theban Mapping Project, as the file page gives the source)",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art; PD-old-100-expired), as the file page states",
    licenceStatus: "unknown",
    shows: "evidence_photograph",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "gates-kv57-unfinished-figures-dalbera-2002",
    manuscriptKey: "kv57",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/91/La_tombe_de_Horemheb_%28KV.57%29_%28Vall%C3%A9e_des_Rois_Th%C3%A8bes_ouest%29_-9.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:La_tombe_de_Horemheb_(KV.57)_(Vall%C3%A9e_des_Rois_Th%C3%A8bes_ouest)_-9.jpg",
    objectDate: "Reign of Horemheb, late Eighteenth Dynasty (c. 1319–1292 BCE)",
    imageDate: "2002 (as the file page gives it)",
    caption:
      "The tomb of Horemheb (KV57), the earliest known copy of the Book of Gates, left unfinished: three standing women drawn in black over red preliminary sketches and guide lines, with a small seated figure and hieroglyphs between them. The photographer describes these as corrected and unfinished drawings from sequences of the Book of Gates.",
    creator: "Jean-Pierre Dalbéra",
    credit: "Jean-Pierre Dalbéra, via Wikimedia Commons",
    licence: "Creative Commons Attribution 2.0 Generic (CC BY 2.0)",
    licenceStatus: "attribution",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "gates-lepsius-four-peoples-kv17",
    passageKey: "egy.gates.5.lower",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/53/From_Richard_Lepsius_-_Ethnic_groups_%22Table_Nations%22_portrayed_in_the_Book_of_Gates%2C_4th_Division%2C_5th_Hour%2C_Tomb_of_Seti_I.jpg",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:From_Richard_Lepsius_-_Ethnic_groups_%22Table_Nations%22_portrayed_in_the_Book_of_Gates,_4th_Division,_5th_Hour,_Tomb_of_Seti_I.jpg",
    institution: "Tomb of Seti I (KV17), as drawn for Lepsius",
    objectDate: "Tomb: reign of Seti I (c. 1290–1279 BCE); drawing published 1849–1859",
    imageDate: "1849–1859",
    caption:
      "UNVERIFIED — Ernst Weidenbach's colour drawing for Lepsius's Denkmäler of a scene in the tomb of Seti I, which the file page places in the Book of Gates, '4th Division, 5th Hour': Horus leaning on a staff leads men of four peoples, told apart by dress, hair and skin colour — the scene Budge describes as Horus with the Egyptians, the Aamu, the Nehesu and the Themehu.",
    whatIsUnverified:
      "The division and hour are the file page's; the placement at Budge's fifth division, lower register, matches his description but is not checked against the plate. The drawing shows twelve men, not all sixteen of the scene, and is a nineteenth-century copy, not a photograph.",
    creator: "Karl Richard Lepsius; illustrator Ernst Weidenbach",
    credit: "Lepsius, Denkmäler aus Aegypten und Aethiopien, via Wikimedia Commons",
    licence: "Public domain (PD-Art; PD-old-100-expired)",
    licenceStatus: "open",
    shows: "scientific_figure",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
