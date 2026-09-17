// THE TERRITORY OF MODERN BÉNIN, BEFORE THE KINGDOMS.
//
// WHAT THIS DATASET IS FOR. To show that the history of this ground does not
// begin with Dahomey, and does not begin with European contact. It begins with
// stone tools on the Mékrou, a rainforest that is no longer there, and an iron
// spearhead from a settlement that had been abandoned for two thousand years
// before anybody built a palace at Abomey.
//
// THE SENTENCE THIS DATASET EXISTS TO PREVENT. "Benin civilisation began in
// 1100 BCE." A stone tool found inside a modern border is evidence of human
// activity in that place. It is not evidence that a nation, a people or a
// religion existed there, and the modern state cannot be projected backwards
// over it. So every early record here is phrased as EVIDENCE OF HUMAN ACTIVITY
// IN THE TERRITORY OF MODERN BÉNIN, and no prehistoric material anywhere in
// this file is called Fon, Aja, Yoruba, Bariba or Vodun.
//
// THE OTHER SENTENCE IT EXISTS TO PREVENT. "The Kingdom of Benin built this."
// It did not. The Kingdom of Benin was an Edo state in what is now NIGERIA,
// and the Republic of Bénin took its name in 1975 from the Bight of Benin.
// They are different places, and the confusion is so routine that it has a
// record of its own.
//
// WHAT IS GENUINELY WEAK HERE, SAID OUT LOUD. Bénin's Stone Age is known
// mostly from SURVEY rather than excavation, and most of it carries no
// absolute date at all. Sites are counted, classified by tool type, and left
// undated. That is not a gap in this dataset; it is the state of the evidence,
// and the first record in the file is about exactly that.
//
// ON DATES AND CONVENTIONS. The palaeoenvironmental records here are published
// in CALIBRATED YEARS BEFORE PRESENT, where "present" is fixed at 1950. They
// are stored through astronomicalFromYearsAgo() with the convention recorded,
// because 4,500 cal BP and 4500 BCE are nineteen and a half centuries apart
// and writing the second for the first would manufacture a correlation out of
// pure arithmetic.
//
// ON SOURCES, AND A LIMITATION THAT IS NOT HIDDEN. The environment this file
// was written in could not reach journal sites, museum catalogues or archives:
// every fetch was refused by the network policy. What could be reached was a
// search index. So the excavation literature is cited by author, title and
// journal — which is checkable — and the figures attributed to it are marked
// NEEDS SOURCE VERIFICATION wherever they were taken from a summary of a paper
// rather than from the paper. Naming the paper a reader should go to is worth
// doing. Pretending it was read here is not.
//
// ON PICTURES. Every file below is one whose Commons file page was returned by
// a search index, so the name is a name that exists rather than one that looks
// plausible. That is weaker than asking the API and it is recorded as such:
// the credits are fetched from the file page at seed time, not typed here.

import { astronomicalFromYearsAgo } from "./time";
import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

export const BENIN_DEEP_PAST_ANCHOR_SLUG = "sodohome-1-earliest-settlement";

export const BENIN_DEEP_PAST_TRACK: SeedTrack = {
  name: "Bénin before the kingdoms: archaeology, environment, peoples",
  slug: "benin-deep-past",
  kind: "region",
  color: "#8a6b2f",
};

const commons = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
const commonsPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

export const BENIN_DEEP_PAST_SOURCES: SeedSource[] = [
  {
    key: "merkyte_urbanizing_forest",
    title: "Urbanizing Forest: Archaeological Evidence from Southern Bénin",
    author: "Inga Merkyte and colleagues",
    workTitle: "Journal of African Archaeology",
    reference: "Volume 17, issue 2 (2019), pages 95 onwards",
    sourceType: "academic_paper",
    publishedYear: 2019,
    notes:
      "THE CENTRAL ARCHAEOLOGICAL SOURCE FOR THIS DATASET. Cited for the two large settlements at Sodohomé " +
      "in the Abomey/Bohicon region, for their sizes in hectares, for the early ironworking evidence and for " +
      "the second-millennium-CE centre that overlies the first. NEEDS SOURCE VERIFICATION throughout: the " +
      "publisher's site could not be reached from the environment this file was written in, and every figure " +
      "attributed to this paper here came from a summary of it rather than from its pages.",
  },
  {
    key: "randsborg_merkyte_benin_archaeology",
    title: "Bénin Archaeology: The Ancient Kingdoms",
    author: "Klavs Randsborg and Inga Merkyte",
    publisher: "Centre of World Archaeology / Acta Archaeologica",
    sourceType: "academic_book",
    notes:
      "The monograph publication of the Danish-Beninese excavations on the Abomey plateau and in central " +
      "Bénin. Cited for the excavation programme as a whole and for the ceramic sequence its authors propose. " +
      "NEEDS SOURCE VERIFICATION: this is the book a serious version of several records below should be " +
      "rewritten from, and it has not been read here.",
  },
  {
    key: "salzmann_hoelzmann_dahomey_gap",
    title: "The Dahomey Gap: an abrupt climatically induced rain forest fragmentation in West Africa during the late Holocene",
    author: "Ulrich Salzmann and Philipp Hoelzmann",
    workTitle: "The Holocene",
    reference: "Volume 15 (2005), pages 190 onwards",
    url: "https://journals.sagepub.com/doi/10.1191/0959683605hl799rp",
    sourceType: "scientific_study",
    publishedYear: 2005,
    notes:
      "THE PALAEOENVIRONMENTAL SPINE OF THIS DATASET. A pollen and geochemical record from Lac Sélé in " +
      "southern Bénin. Cited for the sequence of vegetation phases in calibrated years before present, and " +
      "for its authors' conclusion that the opening of the Dahomey Gap was driven by climate rather than by " +
      "people. NEEDS SOURCE VERIFICATION for the exact figures, which are reported here at second hand.",
  },
  {
    key: "gurstelle_save_settlement",
    title: "Settlement history and chronology in the Savè area of central Bénin",
    author: "Andrew W. Gurstelle and colleagues",
    sourceType: "academic_paper",
    notes:
      "Cited for iron-using agricultural communities in the Savè area by about 1000 CE, for the changes " +
      "associated with the rise of the Shabe kingdom in the seventeenth century, and for the shift to " +
      "fortified settlement in the nineteenth. NEEDS SOURCE VERIFICATION for the radiocarbon determinations " +
      "behind those statements.",
  },
  {
    key: "ndah_atakora_sites",
    title: "Integration of Atakora's archaeological sites (North-Western Bénin)",
    author: "Didier N'Dah",
    reference: "Society of Africanist Archaeologists conference paper, 2006",
    url: "https://piano-corn-b69n.squarespace.com/s/SAFA2006Ndah.pdf",
    sourceType: "academic_paper",
    publishedYear: 2006,
    notes:
      "Cited for the archaeological landscape of north-western Bénin and for the research history there, " +
      "including Oliver Davies's surveys of the 1950s and the later German and Beninese programmes. NEEDS " +
      "SOURCE VERIFICATION for the site counts and classifications reported in the records below.",
  },
  {
    key: "scerri_west_africa_stone_age",
    title: "The Stone Age Archaeology of West Africa",
    author: "Eleanor Scerri",
    publisher: "University of Oxford",
    url: "https://ora.ox.ac.uk/objects/uuid:1442d1c1-7f76-454d-97db-8fd52a4c6c1e",
    sourceType: "academic_paper",
    notes:
      "A regional synthesis, cited here for the general point that West African Stone Age chronology is thin, " +
      "that much of the material is surface-collected and undated, and that the region's sequence does not " +
      "map neatly onto eastern and southern African schemes.",
  },
  {
    key: "pleistocene_west_africa_hominin",
    title: "Hominin Behaviour and Palaeoenvironments of Pleistocene West Africa",
    reference: "Conference and review literature on Pleistocene West Africa, including newly reported Middle Stone Age layers at Tannongou, Atakora",
    sourceType: "academic_paper",
    notes:
      "Cited for the report of Middle Stone Age deposits in the Tannongou valley in the Atakora. NEEDS " +
      "SOURCE VERIFICATION and specifically for whether any absolute dates have been published for those " +
      "layers: none is entered in this dataset, because none was found.",
  },
  {
    key: "openedition_sodohome_burial",
    title: "Archéologie et fouilles en contexte difficile — le cas d'une sépulture d'individu immature de l'horizon Sodohomé au Bénin (1000-1200 AD)",
    publisher: "Éditions de la Sorbonne",
    url: "https://books.openedition.org/psorbonne/112048",
    sourceType: "academic_paper",
    notes:
      "Cited for the excavation of the burial of a young individual attributed to the Sodohomé horizon and " +
      "dated in its title to 1000–1200 CE. NEEDS SOURCE VERIFICATION for the dating basis and for what the " +
      "burial does and does not show about the community that made it.",
  },
  {
    key: "unesco_agongointo_tentative",
    title: "Village souterrain d'Agongointo-Zoungoudo",
    publisher: "UNESCO World Heritage Centre",
    workTitle: "Tentative Lists",
    url: "https://whc.unesco.org/en/tentativelists/988/",
    sourceType: "government",
    notes:
      "Bénin's own submission describing the underground site at Bohicon, placed on the Tentative List in " +
      "1998. Cited as a statement of how the site is officially presented — which is a different thing from " +
      "an excavation report, and is treated as such.",
  },
  {
    key: "law_rise_of_dahomey_historiography",
    title: "Dahomey and the Slave Trade: Reflections on the Historiography of the Rise of Dahomey",
    author: "Robin Law",
    workTitle: "The Journal of African History",
    url: "https://www.cambridge.org/core/journals/journal-of-african-history/article/abs/dahomey-and-the-slave-trade-reflections-on-the-historiography-of-the-rise-of-dahomey/A293827948246D98B83BBAA5828E740F",
    sourceType: "academic_paper",
    notes:
      "Cited for the documentary horizon of the region: Allada appearing in Portuguese records in 1539, and " +
      "people identified as Arda or Arara from this coast appearing in the Americas by the 1560s. Also the " +
      "standard critique of the older view that Dahomey rose in order to control or resist the slave trade.",
  },
  {
    key: "monroe_building_the_state",
    title: "The Precolonial State in West Africa: Building Power in Dahomey",
    author: "J. Cameron Monroe",
    publisher: "Cambridge University Press",
    sourceType: "academic_book",
    notes:
      "Landscape archaeology of the Abomey plateau. Cited for the argument that Dahomey's claimed dynastic " +
      "descent from Allada is probably a later construction serving the conquest of Allada, and for the " +
      "archaeology of palace and settlement on the plateau. NEEDS SOURCE VERIFICATION for specific pages.",
  },
  {
    key: "borgu_kisra_tradition",
    title: "Oral Tradition in Changing Political Contexts: The Kisra Legend in Northern Borgu",
    workTitle: "History in Africa",
    url: "https://www.cambridge.org/core/journals/history-in-africa/article/abs/oral-tradition-in-changing-political-contexts-the-kisra-legend-in-northern-borgu/2BC0AB7DBA98C2B72694F25DEBA14F72",
    sourceType: "academic_paper",
    notes:
      "Cited for the Kisra legend as told in Borgu and — the reason it is here rather than a summary of the " +
      "legend — for the point that what the tradition says has changed with the political situation of the " +
      "people telling it. An oral tradition is evidence about the people who keep it as well as about the " +
      "past it describes.",
  },
  {
    key: "coastal_benin_salt",
    title: "A coastal occupation in Bénin, West Africa: Earthenwares and salt at the time of Atlantic entanglement",
    workTitle: "The Journal of Island and Coastal Archaeology",
    url: "https://www.tandfonline.com/doi/full/10.1080/15564894.2022.2084654",
    sourceType: "academic_paper",
    publishedYear: 2022,
    notes:
      "Cited for archaeological evidence of coastal occupation and salt production in Bénin around the " +
      "period of Atlantic contact. NEEDS SOURCE VERIFICATION for the site, the dates and the scale of " +
      "production.",
  },
  {
    key: "aja_oral_traditions_general",
    title: "Aja and Fon foundation traditions, as recorded by historians and ethnographers",
    reference: "A body of traditions collected from the nineteenth century onwards, not a single work",
    sourceType: "oral_tradition",
    notes:
      "WHAT THIS SOURCE ENTRY IS. Not a book. A body of migration and foundation traditions — Tado, the " +
      "move to Allada, the three brothers — recorded in many versions by many collectors over more than a " +
      "century. It is cited whenever a record rests on tradition rather than on a document or an excavation, " +
      "so that a reader can see which of the two they are looking at. WHAT A BETTER VERSION WOULD DO: name " +
      "the collector, the teller, the place and the year for each version, because those are the things that " +
      "make an oral source checkable and they are missing here.",
  },
  {
    key: "wikipedia_benin_navigation",
    title: "Wikipedia articles on Bénin, Dahomey, Allada, Porto-Novo, Borgu and related subjects",
    url: "https://en.wikipedia.org/wiki/History_of_Benin",
    sourceType: "wikipedia",
    notes:
      "USED FOR NAVIGATION AND CROSS-CHECKING ONLY, never as the evidence for an archaeological claim. Where " +
      "a record below rests on nothing better than this, it says so in its own notes. An encyclopedia anyone " +
      "can edit is a good place to find the references and a poor place to stop.",
  },
];

export const BENIN_DEEP_PAST_EVENTS: SeedEvent[] = [
  // -------------------------------------------------------------------------
  // WHERE THE EVIDENCE IS, AND WHERE IT IS NOT
  // -------------------------------------------------------------------------
  {
    slug: "benin-deep-past-is-mostly-undated",
    title: "The deep past of this territory is mostly undated, and that is the finding",
    summary:
      "Bénin has Acheulean, Middle Stone Age and Later Stone Age material. Almost none of it carries an absolute date. This record exists so the silence is visible rather than filled in.",
    description:
      "WHAT KIND OF RECORD IS THIS? A statement about the state of the evidence, placed first because every " +
      "early record after it has to be read against it.\n\n" +
      "WHAT EXISTS. Stone tools have been collected across what is now Bénin since the middle of the " +
      "twentieth century — handaxes of Acheulean type, flake industries described as Middle Stone Age, " +
      "smaller tool kits described as Later Stone Age. Surveys in the north and north-west have counted them " +
      "in the dozens of sites.\n\n" +
      "WHAT DOES NOT EXIST. A published chronology for most of it. The great majority of this material is " +
      "SURFACE-COLLECTED: picked up from the ground rather than excavated from a layer. A tool lying on the " +
      "surface has lost the one thing that could date it, which is what it was lying under. So the sites are " +
      "counted and classified by the SHAPE of the tools, and dated — when they are dated at all — by " +
      "resemblance to sequences established somewhere else.\n\n" +
      "WHY THAT MATTERS HERE. A timeline is a machine for putting things in order, and this material cannot " +
      "be put in order yet. The honest response is not to invent a number. It is to file the material as " +
      "undated, say which kind of tool it is, name the survey that found it, and leave the position empty " +
      "until somebody excavates and dates a sequence.\n\n" +
      "WHAT WOULD CHANGE IT. Excavated, stratified, dated deposits — a rock shelter with layers, charcoal or " +
      "burnt sediment, and a laboratory result. A handful of Beninese sites are now being worked on in " +
      "exactly that way, and the Tannongou record below is one of them.\n\n" +
      "THINGS TO ASK: If you can say what a tool IS but not when it was made, what have you learned? Why " +
      "might a region end up well surveyed and badly dated?",
    category: "archaeology",
    subcategory: "Research history",
    eventType: "archaeological_interpretation",
    evidenceStatus: "unresolved",
    tags: ["archaeology", "deep-history", "stone-age", "dating", "method", "benin"],
    locationName: "Republic of Bénin",
    lat: 9.3,
    lng: 2.3,
    claims: [
      {
        sourceKey: "scerri_west_africa_stone_age",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the Stone Age material from Bénin was made",
        originalDateText: "Not established. Most of it is surface-collected and undated",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHY THIS CLAIM CARRIES NO POSITION: because the sources do not give one. West African Stone Age " +
          "chronology is built from a small number of dated sequences spread over an enormous area, and " +
          "Bénin is not one of the places where that work has been concentrated. Assigning a date here " +
          "would be borrowing one from a different country and presenting it as a finding about this one.",
        notes:
          "This is the record that licenses the caution on every Stone Age record below. If a dated " +
          "sequence is published for Bénin, this record should be kept and the new dates added beside it, " +
          "not used to overwrite it — the history of the research is itself worth keeping.",
      },
    ],
  },

  {
    slug: "benin-acheulean-and-msa-on-the-mekrou",
    title: "Acheulean and Middle Stone Age sites on the Mékrou",
    summary:
      "A reconnaissance of about thirty kilometres of the Mékrou, on the Niger–Bénin border, recorded some seventy prehistoric sites, including Acheulean and Middle Stone Age material. None of it is dated here.",
    description:
      "WHAT WAS FOUND. Survey along the banks of the Mékrou river, which runs along part of the frontier " +
      "between Bénin and Niger, recorded around seventy prehistoric localities in roughly thirty kilometres. " +
      "Among them were sites classed as Acheulean — the long-lived handaxe tradition — and sites classed as " +
      "Middle Stone Age, with a smaller number described as Later Stone Age.\n\n" +
      "WHAT THAT DOES AND DOES NOT TELL YOU. It tells you that people were making stone tools along this " +
      "river, repeatedly, over a very long span: the Acheulean and the Middle Stone Age are separated by " +
      "hundreds of thousands of years anywhere they are both dated. It does NOT tell you when, here. The " +
      "classification is by tool form, and tool form is the evidence for the label, not for a date.\n\n" +
      "WHY A RIVER. River banks offer the two things a stone-tool maker needs together: water, and stone. " +
      "They also erode, which is why the material is visible — and which is the same reason it is usually " +
      "out of its original layer by the time anybody sees it.\n\n" +
      "THE LANGUAGE THIS RECORD USES ON PURPOSE. Evidence of human activity in the territory of modern " +
      "Bénin. Not 'early Beninese', not 'the first inhabitants of Bénin'. Whoever made these tools belonged " +
      "to no modern nation and no modern people, and the border they sit on is a hundred and thirty years " +
      "old.\n\n" +
      "THINGS TO ASK: What is the difference between a place where a lot of material is FOUND and a place " +
      "where a lot of people LIVED?",
    category: "archaeology",
    subcategory: "Stone Age",
    eventType: "archaeological_interpretation",
    identificationStatus: "probable",
    tags: ["archaeology", "deep-history", "stone-age", "acheulean", "lithics", "mekrou", "northern-benin"],
    locationName: "Mékrou valley, northern Bénin / Niger border",
    lat: 11.9,
    lng: 2.4,
    claims: [
      {
        sourceKey: "ndah_atakora_sites",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the Mékrou material was made",
        originalDateText: "Not dated. Sites classified by tool type, not by an absolute determination",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        evidence:
          "WHAT IS ESTABLISHED: that tools of Acheulean and Middle Stone Age type are present along this " +
          "stretch of river, in numbers. WHAT IS NOT: when any of them was made. The only dating applied is " +
          "classification by form, which inherits the chronology of whatever dated sequence the forms are " +
          "being compared with — and that sequence is not in Bénin.",
        notes:
          "NEEDS SOURCE VERIFICATION for the site counts, which are reported here at second hand from a " +
          "summary of the survey literature rather than from the survey reports themselves.",
      },
    ],
  },

  {
    slug: "davies-survey-northern-benin-1950s",
    title: "Oliver Davies maps Stone Age sites in the north, in the 1950s",
    summary:
      "The research history matters: more than twenty Stone Age sites in this region were on a map by the 1950s, and the modern programmes are working over ground that was already known.",
    description:
      "WHAT HAPPENED. In the 1950s the archaeologist Oliver Davies surveyed widely across West Africa and " +
      "mapped more than twenty Stone Age sites in what is now northern Bénin. Later programmes — German " +
      "university projects from Frankfurt, and Beninese archaeologists including Didier N'Dah — have worked " +
      "the same landscape with modern methods.\n\n" +
      "WHY A RESEARCH HISTORY IS A HISTORICAL RECORD. Because the map of what is 'known' about a region is " +
      "shaped by who went looking, when, with what questions and with what funding. Bénin's archaeology is " +
      "a young discipline with a small number of projects in it, and the distribution of known sites is " +
      "partly a distribution of fieldwork. A blank on the archaeological map of this country is at least as " +
      "likely to mean nobody has surveyed there as it is to mean nobody lived there.\n\n" +
      "WHAT THIS RECORD IS NOT SAYING. It is not saying the earlier work was wrong. It is saying that when " +
      "you read '20 sites' or '70 sites', you are reading a fact about survey as well as a fact about the " +
      "past.\n\n" +
      "THINGS TO ASK: If a country has few known archaeological sites, what are the possible reasons, and " +
      "how would you tell them apart?",
    category: "archaeology",
    subcategory: "Research history",
    eventType: "historical",
    tags: ["archaeology", "research-history", "stone-age", "northern-benin", "method"],
    people: ["Oliver Davies", "Didier N'Dah"],
    locationName: "Northern and north-western Bénin",
    lat: 10.3,
    lng: 1.4,
    claims: [
      {
        sourceKey: "ndah_atakora_sites",
        startYear: 1950,
        endYear: 1959,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Davies's survey work in the region",
        originalDateText: "The 1950s",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED HERE IS THE FIELDWORK, not the sites. That distinction is the point of the record: " +
          "an archaeological survey has a date of its own, and it is usually far better established than " +
          "the date of anything it found.",
        notes:
          "NEEDS SOURCE VERIFICATION for the precise years of Davies's Bénin work and for the number of " +
          "sites he recorded there specifically, as against across West Africa generally.",
      },
    ],
  },

  {
    slug: "tannongou-middle-stone-age-layers",
    title: "Middle Stone Age layers at Tannongou, in the Atakora",
    summary:
      "Excavated deposits in the Tannongou valley are reported as Middle Stone Age — which would make them one of the few places in Bénin where this material sits in a layer rather than on the surface.",
    description:
      "WHY THIS RECORD MATTERS OUT OF PROPORTION TO ITS SIZE. Almost everything else in Bénin's Stone Age " +
      "record is surface material. A STRATIFIED deposit — tools sealed in a layer, with things above and " +
      "below them — is the only kind that can be dated, and dating is the thing this country's deep past is " +
      "missing. The Tannongou valley in the Atakora hills has been reported as carrying such deposits.\n\n" +
      "WHAT THE ATAKORA OFFERS. Hills with caves and rock shelters — around ten are known — beside streams, " +
      "with stone available for tools. Rock shelters are where sequences survive, because sediment " +
      "accumulates in them instead of washing away.\n\n" +
      "WHAT THIS RECORD DELIBERATELY DOES NOT DO. Give a date. No absolute determination for these layers " +
      "was found in the material available here. The Middle Stone Age spans roughly three hundred thousand " +
      "to thirty thousand years ago where it is dated elsewhere in Africa, and writing any figure from that " +
      "range into this record would be transferring somebody else's chronology onto an undated Beninese " +
      "deposit — the exact move the first record in this dataset warns about.\n\n" +
      "THINGS TO ASK: Why is a tool found inside a layer worth so much more than the same tool found on the " +
      "ground above it?",
    category: "archaeology",
    subcategory: "Stone Age",
    eventType: "archaeological_interpretation",
    identificationStatus: "probable",
    evidenceStatus: "unresolved",
    tags: ["archaeology", "deep-history", "stone-age", "middle-stone-age", "atakora", "rock-shelter", "stratigraphy"],
    locationName: "Tannongou valley, Atakora, north-western Bénin",
    lat: 10.55,
    lng: 1.4,
    claims: [
      {
        sourceKey: "pleistocene_west_africa_hominin",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "The age of the Tannongou Middle Stone Age deposits",
        originalDateText: "Reported as Middle Stone Age; no absolute date entered here",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "WHAT SUPPORTS THE ATTRIBUTION: the character of the stone tools in the deposits, which is what " +
          "'Middle Stone Age' names. WHY NO NUMBER: no published luminescence or radiometric determination " +
          "for these layers was found in the sources reachable here. The attribution is a statement about " +
          "technology; a date would be a statement about time, and only one of the two has been made.",
        notes:
          "THIS IS THE RECORD MOST LIKELY TO BE OUT OF DATE FIRST, and that is a good thing. If dates are " +
          "published, add them as further claims on this record — do not delete this one, because 'reported " +
          "as MSA, undated' is the state the field was in and is worth being able to see.",
      },
    ],
    media: [
      {
        url: commons("Benin village atakora.JPG"),
        sourcePageUrl: commonsPage("Benin village atakora.JPG"),
        fileName: "Benin village atakora.JPG",
        caption:
          "A village in the Atakora, northern Bénin. The hills, streams and rock shelters of this landscape are where the country's only stratified Stone Age deposits have been reported — a photograph of the setting, not of the site.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE ENVIRONMENT: A RAINFOREST THAT IS NO LONGER THERE
  // -------------------------------------------------------------------------
  {
    slug: "lac-sele-rainforest-mid-holocene",
    title: "Southern Bénin under semi-evergreen rainforest",
    summary:
      "Pollen from Lac Sélé indicates rainforest across southern Bénin between roughly 8,400 and 4,500 years ago. The savanna corridor that now runs to the coast did not exist.",
    description:
      "WHAT THE EVIDENCE IS. A core through the sediments of Lac Sélé in southern Bénin, analysed for pollen " +
      "and for geochemistry. Pollen accumulates year on year and preserves; the mix of species in a layer is " +
      "a record of the vegetation that was standing when that layer formed.\n\n" +
      "WHAT IT SHOWS. Between about 8,400 and 4,500 calibrated years before present, the pollen record is " +
      "dominated by semi-evergreen rainforest. During the mid-Holocene marine transgression, mangrove spread " +
      "along the inland lagoons.\n\n" +
      "WHY THIS IS STRANGE, AND IMPORTANT. Today southern Bénin sits inside the DAHOMEY GAP: a corridor of " +
      "savanna that interrupts the West African rain forest belt and reaches the sea. It is one of the most " +
      "striking features on a vegetation map of Africa. This record says it was not there. The forest was " +
      "continuous, and the gap is a late arrival.\n\n" +
      "WHAT IT MEANS FOR HUMAN HISTORY. Everything about living in this landscape — what can be grown, what " +
      "can be hunted, where people can move, where a settlement can be defended — is different under closed " +
      "forest than under open savanna. Any account of early settlement here that assumes today's landscape " +
      "has been reading the map backwards.\n\n" +
      "ON THE DATES. These are CALIBRATED YEARS BEFORE PRESENT, where 'present' is fixed at 1950 by " +
      "convention. 8,400 BP is around 6450 BCE, not 8400 BCE. The difference is nineteen and a half " +
      "centuries and this record stores the convention so the difference cannot be lost.\n\n" +
      "THINGS TO ASK: How much of what you assume about a place's history comes from what it looks like now?",
    category: "nature",
    subcategory: "Palaeoenvironment",
    eventType: "scientific_model",
    evidenceStatus: "strongly_documented",
    tags: ["palaeoenvironment", "deep-history", "climate", "rainforest", "dahomey-gap", "pollen", "southern-benin"],
    locationName: "Lac Sélé, southern Bénin",
    lat: 6.6,
    lng: 2.1,
    claims: [
      {
        sourceKey: "salzmann_hoelzmann_dahomey_gap",
        startYear: astronomicalFromYearsAgo(8400),
        endYear: astronomicalFromYearsAgo(4500),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "The rainforest phase in the Lac Sélé pollen record",
        originalDateText: "c. 8400 to 4500 calibrated years BP",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        evidence:
          "WHAT PRODUCED THIS DATE: radiocarbon dating of the lake core, calibrated, giving an age-depth " +
          "model against which the pollen changes are placed. WHAT IT ESTABLISHES: the vegetation standing " +
          "around this lake, across this span. WHAT IT DOES NOT ESTABLISH: conditions across the whole of " +
          "southern Bénin at every moment — one core is one place, and the authors' regional argument rests " +
          "on comparison with other records as well as this one.",
        notes:
          "NEEDS SOURCE VERIFICATION for the exact calibrated boundaries, which are quoted here from a " +
          "summary of the paper rather than from its figures.",
      },
    ],
  },

  {
    slug: "dahomey-gap-opens",
    title: "The Dahomey Gap opens: rainforest gives way to savanna",
    summary:
      "Between roughly 4,500 and 3,400 years ago the forest of southern Bénin deteriorated rapidly and Sudano-Guinean savanna spread. The corridor that splits West Africa's forest belt dates from this change.",
    description:
      "WHAT HAPPENED. The Lac Sélé record shows an abrupt change at the start of the late Holocene: drier " +
      "conditions, rapid deterioration of the rain forest, and the spread of Sudano-Guinean savanna in its " +
      "place. This is the origin of the Dahomey Gap — the savanna corridor that reaches the Atlantic between " +
      "the Upper Guinean forest to the west and the Nigerian–Congolian forest to the east.\n\n" +
      "WHY IT IS ONE OF THE MOST CONSEQUENTIAL EVENTS IN THIS WHOLE TIMELINE. Almost everything that comes " +
      "later happens in the landscape this change created. The plateau where Abomey was later built, the " +
      "open country the Dahomean army marched and fought in, the mixed savanna-farming economy of the " +
      "region, the routes between the coast and the interior: all of it sits in the gap.\n\n" +
      "HOW ABRUPT IS ABRUPT. On a geological scale, this is fast. On a human scale, eleven hundred years is " +
      "about forty generations, and nobody living through it would have experienced it as an event. That " +
      "difference between the timescale of a record and the timescale of a life is worth holding on to " +
      "whenever a timeline draws a band.\n\n" +
      "WHAT THIS RECORD DOES NOT CLAIM. That anybody caused it, or that anybody noticed. The cause is " +
      "argued about, and the argument has a record of its own.\n\n" +
      "THINGS TO ASK: Is a change that takes a thousand years an event? Who decides where it starts?",
    category: "nature",
    subcategory: "Palaeoenvironment",
    eventType: "scientific_model",
    evidenceStatus: "strongly_documented",
    tags: ["palaeoenvironment", "deep-history", "climate", "dahomey-gap", "savanna", "pollen", "southern-benin"],
    locationName: "Southern Bénin and the wider Dahomey Gap",
    lat: 6.9,
    lng: 2.2,
    claims: [
      {
        sourceKey: "salzmann_hoelzmann_dahomey_gap",
        startYear: astronomicalFromYearsAgo(4500),
        endYear: astronomicalFromYearsAgo(3400),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "The forest-to-savanna transition in the Lac Sélé record",
        originalDateText: "An abrupt climatic change between c. 4500 and 3400 cal. yr BP",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        evidence:
          "WHAT PRODUCED THIS DATE: the same radiocarbon-dated core, read across the interval where forest " +
          "taxa fall away and savanna taxa rise, supported by geochemical indicators of drier conditions. " +
          "WHAT IT ESTABLISHES: that the change happened, and roughly when. WHY IT IS A RANGE RATHER THAN A " +
          "YEAR: because it is a transition in a sediment column, not an event somebody recorded.",
        notes:
          "The word 'abrupt' belongs to the authors and is relative to the rest of the Holocene record. It " +
          "should not be read as 'sudden' in any human sense.",
      },
    ],
  },

  {
    slug: "dahomey-gap-cause-debate",
    title: "Did people open the Dahomey Gap, or did the climate?",
    summary:
      "A long-standing view held that West African savannas were largely made by farmers clearing forest. The Lac Sélé authors argue the opposite for this corridor. Both positions are recorded here.",
    description:
      "WHAT KIND OF RECORD IS THIS? A debate, with the evidence on each side set out and no verdict issued " +
      "by this timeline.\n\n" +
      "THE OLDER POSITION. West Africa's savannas — and the spread of the oil palm through them — are " +
      "substantially anthropogenic: the product of clearance, burning and farming by people over the last " +
      "few thousand years. The oil palm in particular is useful to people, tolerant of disturbance, and " +
      "abundant in pollen records at exactly the period when farming is thought to spread. That coincidence " +
      "has been read for decades as cause and effect.\n\n" +
      "THE POSITION ARGUED FROM LAC SÉLÉ. That the role of humans in shaping these savannas has been " +
      "OVERESTIMATED, and that the opening of the Dahomey Gap and the spread of Elaeis guineensis can be " +
      "attributed to climatic change rather than initiated by people. The argument rests on the timing and " +
      "on the geochemical evidence for drier conditions accompanying the vegetation change.\n\n" +
      "WHY THE QUESTION IS HARD. Climate change and human activity produce overlapping signatures in a " +
      "pollen core. Burning shows up as charcoal — but savannas burn without people. Oil palm increases — " +
      "but it would increase under drying anyway. Separating them needs independent evidence for climate, " +
      "which is what the geochemistry is doing in this case.\n\n" +
      "WHY IT MATTERS BEYOND BOTANY. If people made this landscape, then the region's environmental history " +
      "is a human history and the farmers are its authors. If the climate made it, then human settlement " +
      "here is a response to a landscape it did not create. Those are different stories about the same " +
      "ground.\n\n" +
      "THINGS TO ASK: What evidence would separate 'people cleared the forest' from 'the forest went and " +
      "people moved in'?",
    category: "science",
    subcategory: "Debate",
    eventType: "disputed",
    tags: ["debate", "palaeoenvironment", "dahomey-gap", "agriculture", "oil-palm", "climate", "method"],
    locationName: "The Dahomey Gap, West Africa",
    lat: 7.2,
    lng: 1.9,
    claims: [
      {
        sourceKey: "salzmann_hoelzmann_dahomey_gap",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether human activity or climate opened the Dahomey Gap",
        originalDateText: "Open question. Not a claim about when, but about why",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "FOR CLIMATE: the vegetation change at Lac Sélé is accompanied by independent geochemical " +
          "indicators of drier conditions, and its authors state that the human role has been " +
          "overestimated. FOR PEOPLE: the long-standing regional argument that West African savanna and the " +
          "oil palm's spread track the spread of farming. WHY THIS CLAIM HAS NO POSITION ON THE AXIS: it is " +
          "a claim about causation, not about when anything happened, and giving it a date would smuggle it " +
          "onto the timeline as an event.",
        notes:
          "NEEDS SOURCE VERIFICATION for the anthropogenic side specifically: it is summarised here from " +
          "the general literature rather than cited to a particular author, and a version of this record " +
          "that names who argues what would be far more useful.",
      },
    ],
  },

  {
    slug: "forest-returns-then-savanna-again",
    title: "The forest comes back, and then goes again",
    summary:
      "Wetter conditions between roughly 3,300 and 1,100 years ago pushed forest back into the savanna. After about 1,100 years ago the lake fell and open savanna returned, and has stayed.",
    description:
      "WHAT THE RECORD SHOWS. The Lac Sélé sequence does not stop at the opening of the gap. A return to " +
      "wetter conditions between about 3,300 and 1,100 calibrated years before present raised the lake level " +
      "and pushed forest back into the savanna. After about 1,100 BP the lake fell again, the record turns " +
      "drier, and the open savanna that persists to the present was established.\n\n" +
      "WHY THIS IS THE MOST USEFUL PART OF THE SEQUENCE FOR HISTORY. Because the second drying — around " +
      "1,100 years ago, which is around 850 CE — lands close to the period when large settlement appears on " +
      "the Abomey plateau in the archaeological record. This dataset does NOT assert that one caused the " +
      "other. It puts them on the same axis so a reader can see the coincidence and ask what would be needed " +
      "to turn a coincidence into a connection.\n\n" +
      "WHAT WOULD BE NEEDED. Dated evidence that the settlement change follows rather than precedes the " +
      "environmental one; evidence that the environmental change was regional rather than local to one lake; " +
      "and some mechanism connecting them that is more than 'both happened'.\n\n" +
      "THINGS TO ASK: Two things happen at about the same time. What is the difference between noticing " +
      "that and explaining it?",
    category: "nature",
    subcategory: "Palaeoenvironment",
    eventType: "scientific_model",
    tags: ["palaeoenvironment", "climate", "dahomey-gap", "pollen", "southern-benin", "deep-history"],
    locationName: "Lac Sélé, southern Bénin",
    lat: 6.6,
    lng: 2.1,
    claims: [
      {
        sourceKey: "salzmann_hoelzmann_dahomey_gap",
        startYear: astronomicalFromYearsAgo(3300),
        endYear: astronomicalFromYearsAgo(1100),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "The wetter phase and renewed spread of forest",
        originalDateText: "Wetter conditions between c. 3300 and 1100 cal. yr BP",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        evidence:
          "WHAT PRODUCED THIS DATE: the radiocarbon-dated lake core, read across the interval of rising lake " +
          "level and returning forest taxa.",
      },
      {
        sourceKey: "salzmann_hoelzmann_dahomey_gap",
        startYear: astronomicalFromYearsAgo(1100),
        datePrecision: "century",
        isApproximate: true,
        isOngoing: true,
        temporalClaimType: "approximate_date",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "The onset of the open savanna that persists today",
        originalDateText: "After c. 1100 cal. yr BP, drier conditions and open savanna to the present",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        evidence:
          "WHAT PRODUCED THIS DATE: falling lake level and drier indicators in the upper part of the same " +
          "core. WHY IT IS RECORDED AS ONGOING: because the condition it describes is the one the landscape " +
          "is still in, which is a different kind of statement from a span that ended.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SODOHOMÉ: THE EARLIEST LARGE SETTLEMENT KNOWN IN SOUTHERN BÉNIN
  // -------------------------------------------------------------------------
  {
    slug: "sodohome-1-earliest-settlement",
    title: "Sodohomé I: five hundred hectares of settlement, before 500 BCE",
    summary:
      "Geophysics and excavation on the Abomey–Bohicon plateau revealed a settlement reported at around 500 hectares, occupied roughly 1100–500 BCE. It is the earliest substantial settlement known in southern Bénin.",
    description:
      "WHY THIS IS THE ANCHOR RECORD OF THIS DATASET. Because it is the single hardest fact against the idea " +
      "that the history of this ground begins with Dahomey. A large, dense, ironworking settlement stood on " +
      "the Abomey plateau more than two thousand years before anybody built a palace there.\n\n" +
      "WHAT WAS FOUND. Geophysical mapping followed by extensive excavation in the Sodohomé area, between " +
      "Abomey and Bohicon, identified archaeological remains spread densely over an area reported at around " +
      "five hundred hectares. The excavators describe foundations of large earthen structures with pounded " +
      "clay floors; pottery; iron slag and smelting residues; and deposits of deliberately fragmented " +
      "pottery, slag and iron that they interpret as ritualised.\n\n" +
      "WHAT 'FIVE HUNDRED HECTARES' DOES AND DOES NOT MEAN. It is the extent over which material is found, " +
      "not the footprint of a built-up town, and not a population. Settlement in this region is " +
      "characteristically DISPERSED — compounds and fields rather than streets — and a shifting settlement " +
      "pattern can spread material over a wide area without a large number of people ever living there at " +
      "one time. The excavators' own term for this kind of site is 'urbanizing', which is a careful word and " +
      "is doing careful work.\n\n" +
      "WHAT IT IS NOT EVIDENCE OF. Any later people, kingdom or religion. Nothing found here is Fon, Aja or " +
      "Dahomean, and nothing here is Vodun. The people who lived at Sodohomé I left no writing and no " +
      "self-description, and the plateau was empty of large settlement for something like two thousand years " +
      "between them and the next one.\n\n" +
      "THINGS TO ASK: What would you need to find before you could call a scatter of material a town? How " +
      "would you tell a big settlement from a small one that moved a lot?",
    category: "archaeology",
    subcategory: "Iron Age settlement",
    eventType: "archaeological_interpretation",
    evidenceStatus: "strongly_documented",
    identificationStatus: "secure",
    tags: ["archaeology", "settlement", "iron-age", "metallurgy", "abomey-plateau", "sodohome", "bohicon", "deep-history"],
    locationName: "Sodohomé, between Abomey and Bohicon, southern Bénin",
    lat: 7.16,
    lng: 2.03,
    claims: [
      {
        sourceKey: "merkyte_urbanizing_forest",
        // Astronomical numbering: 1100 BCE = -1099, 500 BCE = -499.
        startYear: -1099,
        endYear: -499,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The main occupation of Sodohomé I",
        originalDateText: "c. 1100–500 BCE",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        evidence:
          "WHAT PRODUCED THIS DATE: radiocarbon determinations from the excavated deposits, placed against " +
          "the site's stratigraphy and ceramic sequence. WHAT IT ESTABLISHES: that people were living and " +
          "working iron here across this span. WHAT IT DOES NOT ESTABLISH: that the whole five hundred " +
          "hectares was occupied simultaneously, which is a different claim requiring dates from across the " +
          "area rather than from the excavated parts of it.",
        notes:
          "NEEDS SOURCE VERIFICATION for the individual determinations, their laboratory codes and their " +
          "calibrated ranges. The span is reported here from a summary of the excavation publication.",
      },
      {
        sourceKey: "randsborg_merkyte_benin_archaeology",
        startYear: -1099,
        endYear: -449,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The main occupation of Sodohomé I",
        originalDateText: "From about 1100 BCE to the middle of the first millennium BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "A SECOND WORDING OF THE SAME OCCUPATION, kept as its own claim because the two are not identical: " +
          "'to the mid-first millennium BCE' is a looser end than '500 BCE', and averaging them would " +
          "invent a precision neither source offers. The excavation project is the same one, so these are " +
          "not independent confirmations of each other.",
        notes:
          "Where two publications from one project word a span differently, this dataset keeps both rather " +
          "than choosing — but a reader should know they are one team, not two.",
      },
    ],
    media: [
      {
        url: commons("Palais royaux d'Abomey en 2020 03.jpg"),
        sourcePageUrl: commonsPage("Palais royaux d'Abomey en 2020 03.jpg"),
        fileName: "Palais royaux d'Abomey en 2020 03.jpg",
        caption:
          "The Abomey plateau in 2020, at the royal palace site. This is the landscape Sodohomé I stood in, photographed about two and a half thousand years after that settlement ended and three centuries after the palaces were begun — a picture of the ground, not of the site, and it is here because no excavation photograph could be verified for this record.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "The picture is of the palace site on the plateau, NOT of the Sodohomé excavations. It illustrates " +
          "the setting and must not be read as showing the archaeology described in this record.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "sodohome-early-iron-spearhead",
    title: "An iron spearhead from Sodohomé, and the claim made for it",
    summary:
      "The excavators report ironworking at Sodohomé from the eleventh century BCE, including a spearhead of around 1000 BCE described as the oldest directly dated iron artefact in Africa. That is a large claim and is recorded as one.",
    description:
      "WHAT IS REPORTED. Very early evidence of ironworking at Sodohomé — slag, smelting residues, and iron " +
      "objects including a spearhead — with the metal attributed to around the eleventh century BCE. The " +
      "strongest form of the claim, as reported, is that the spearhead is the oldest iron artefact in Africa " +
      "with a DIRECT absolute date on the object itself.\n\n" +
      "WHY THE WORD 'DIRECT' IS CARRYING THE WEIGHT. Most early iron dates in Africa come from charcoal " +
      "found NEAR the iron — in a furnace, in a pit, in a layer. Charcoal can be older than the thing beside " +
      "it (old wood), or younger (later disturbance), so a charcoal date is a date for the context rather " +
      "than for the metal. A date measured on the object itself removes that step. It also makes the claim " +
      "much harder to check, because the method is specialised and the sample is destroyed in the measuring.\n\n" +
      "WHY A READER SHOULD BE CAREFUL ANYWAY. Early African iron dates have a long history of being " +
      "published, disputed and revised — this is one of the most contested areas in African archaeology, and " +
      "a superlative ('the oldest in Africa') is exactly the kind of claim that attracts scrutiny and " +
      "sometimes does not survive it. That argument has a record of its own, next to this one.\n\n" +
      "WHAT THIS RECORD DOES. Reports the claim, names who makes it, and marks it as a claim rather than " +
      "as a settled fact — without dismissing it, because there is no basis here for dismissing it either.\n\n" +
      "THINGS TO ASK: Why is dating the object better than dating the charcoal next to it? What would " +
      "convince you that the oldest example of something really is the oldest?",
    category: "technology",
    subcategory: "Metallurgy",
    eventType: "archaeological_interpretation",
    identificationStatus: "probable",
    evidenceStatus: "strongly_documented",
    tags: ["metallurgy", "iron", "archaeology", "sodohome", "technology", "disputed-claim", "deep-history"],
    locationName: "Sodohomé, Abomey–Bohicon plateau, southern Bénin",
    lat: 7.16,
    lng: 2.03,
    claims: [
      {
        sourceKey: "merkyte_urbanizing_forest",
        startYear: -1099,
        endYear: -1000,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The earliest ironworking evidence at Sodohomé",
        originalDateText: "Ironworking from the eleventh century BC",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        evidence:
          "WHAT IS DATED: the ironworking evidence in the excavated deposits — slag and smelting residues " +
          "in dated contexts. WHAT MAKES THIS SIGNIFICANT: it is very early for West Africa, in a region " +
          "where the beginnings of iron are actively argued about.",
        notes: "NEEDS SOURCE VERIFICATION for the determinations behind the eleventh-century attribution.",
      },
      {
        sourceKey: "merkyte_urbanizing_forest",
        startYear: -999,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "radiometric_date",
        whatIsDated: "The spearhead said to be the oldest directly dated iron object in Africa",
        originalDateText: "A spearhead dating to around 1000 BCE, reported as the oldest iron artefact in Africa with a direct absolute date",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        evidence:
          "WHAT THE CLAIM RESTS ON: a date measured on the object rather than on material beside it. WHY " +
          "IT IS KEPT SEPARATE FROM THE CLAIM ABOVE: 'there was ironworking here in the eleventh century " +
          "BCE' and 'this particular object is the oldest directly dated iron in Africa' are two different " +
          "assertions with different consequences if either is wrong. THE SUPERLATIVE IS THE SOURCE'S, NOT " +
          "THIS TIMELINE'S.",
        notes:
          "NEEDS SOURCE VERIFICATION, and this is the record in the dataset where that matters most: the " +
          "laboratory, the method used to date iron directly, the sample, the calibrated range and any " +
          "published response to the claim should all be recorded here and none of them could be read.",
      },
    ],
  },

  {
    slug: "west-african-early-iron-debate",
    title: "How early is iron in West Africa?",
    summary:
      "Very early dates for African iron have been proposed for sites in Niger, Nigeria and Central Africa, and each has been argued over. Sodohomé's claim belongs in that argument, not outside it.",
    description:
      "WHAT KIND OF RECORD IS THIS? A debate record, so that a striking date from one site is read against " +
      "the state of the question rather than on its own.\n\n" +
      "THE SHAPE OF THE ARGUMENT. For decades, the standard account had iron reaching sub-Saharan Africa " +
      "relatively late and from outside. Against it, dates in the second millennium BCE and earlier have " +
      "been proposed for sites including Termit in Niger, Lejja and Opi in south-eastern Nigeria, and Oboui " +
      "in the Central African Republic — some of them implying an independent African invention of " +
      "smelting.\n\n" +
      "WHY THESE DATES ARE HARD TO SETTLE. Four recurring problems. OLD WOOD: charcoal from a long-lived " +
      "tree can be centuries older than the fire it burned in. CONTEXT: a furnace cut into older deposits " +
      "picks up older charcoal. SELECTION: publishing the earliest date from a spread of dates makes any " +
      "site look early. And REPLICATION: many of the very early results come from one campaign at one site, " +
      "and have not been reproduced by another team.\n\n" +
      "WHAT WOULD MOVE IT. Multiple dates, on material that can only be as old as the smelting, from more " +
      "than one site, published with the full spread rather than the earliest figure — and independent " +
      "reanalysis.\n\n" +
      "WHERE SODOHOMÉ SITS. Its reported eleventh-century BCE ironworking and directly dated spearhead " +
      "would be at the early end of this argument. This timeline neither endorses nor rejects it; it records " +
      "the claim, and records that there is an argument.\n\n" +
      "THINGS TO ASK: Why is 'the earliest known example' such an unstable kind of fact? Who benefits when " +
      "one is announced?",
    category: "technology",
    subcategory: "Debate",
    eventType: "disputed",
    tags: ["debate", "metallurgy", "iron", "archaeology", "method", "west-africa", "dating"],
    locationName: "West and Central Africa",
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When iron smelting began in West Africa",
        originalDateText: "Actively disputed. Proposals range across the second and first millennia BCE",
        datingMethod: "radiocarbon",
        chronology: "disputed",
        evidence:
          "WHY THIS CLAIM CARRIES NO POSITION: because putting one on the axis would be picking a winner in " +
          "an argument that specialists have not settled. The competing dates belong on the records of the " +
          "individual sites that produced them, where each can be read with its own evidence — which is how " +
          "this dataset handles Sodohomé's.",
        notes:
          "NEEDS SOURCE VERIFICATION and specifically NEEDS NAMED PARTICIPANTS: a genuinely useful version " +
          "of this record would cite the principal publications on each side. It currently describes the " +
          "shape of a debate without citing it, which is the weakest kind of record in this dataset.",
      },
    ],
  },

  {
    slug: "sodohome-pottery-and-earthen-buildings",
    title: "Pounded clay floors, pottery, and deposits that look deliberate",
    summary:
      "Beyond iron, Sodohomé I produced foundations of large earthen buildings and deposits of broken pottery, slag and iron that the excavators read as ritual rather than rubbish.",
    description:
      "WHAT WAS FOUND. Foundations of large earthen structures with pounded clay floors — the same building " +
      "tradition, in its materials, that the Abomey palaces would later be built in. Pottery, including " +
      "roulette-decorated wares. And concentrations of fragmented pottery, slag and iron which the " +
      "excavators describe as RITUALISED DEPOSITIONS rather than as discarded waste.\n\n" +
      "THE DISTINCTION THAT IS DOING THE WORK. Broken pottery in the ground is the commonest thing in " +
      "archaeology and normally means rubbish. Calling a deposit ritual is an INTERPRETATION, and it needs " +
      "grounds: material that is too complete, or too deliberately smashed, or placed rather than dumped, " +
      "or repeated in a pattern across a site. Those grounds may well exist here — but they are the " +
      "excavators' reading of the evidence, and this record marks them as a reading.\n\n" +
      "ON THE POTTERY COMPARISONS. The Sodohomé I ceramics have been described as having broad similarities " +
      "to the Kintampo tradition of Ghana and to a tradition labelled 'Yellow'. A similarity in pottery is " +
      "a real observation and a weak connection: pots resemble each other for many reasons, of which shared " +
      "descent is only one. The names belong to the excavation literature and this dataset does not treat " +
      "them as established period labels for Bénin.\n\n" +
      "WHY 'RITUAL' IS THE WORD ARCHAEOLOGISTS REACH FOR. Sometimes because the evidence demands it. " +
      "Sometimes because nothing else explains the pattern — which is a different and weaker reason, and " +
      "worth being able to tell apart.\n\n" +
      "THINGS TO ASK: How would you tell a rubbish pit from an offering? What would each look like after " +
      "three thousand years?",
    category: "archaeology",
    subcategory: "Material culture",
    eventType: "archaeological_interpretation",
    identificationStatus: "probable",
    tags: ["archaeology", "pottery", "architecture", "ritual", "sodohome", "interpretation", "deep-history"],
    locationName: "Sodohomé, southern Bénin",
    lat: 7.16,
    lng: 2.03,
    claims: [
      {
        sourceKey: "merkyte_urbanizing_forest",
        startYear: -1099,
        endYear: -499,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The buildings, pottery and deposits at Sodohomé I",
        originalDateText: "Within the occupation of Sodohomé I, c. 1100–500 BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS DATED: the deposits, by their position in the site's dated sequence. WHAT IS NOT DATED: " +
          "the interpretation. Whether a deposit is ritual is not a question a radiocarbon date can answer.",
      },
      {
        sourceKey: "merkyte_urbanizing_forest",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the fragmented deposits are ritual",
        originalDateText: "An interpretation offered by the excavators, not a dated event",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT SUPPORTS IT: the excavators' description of the deposits as deliberate and patterned. WHAT " +
          "WOULD UNDERMINE IT: any ordinary explanation — a midden, a clearance episode, redeposition — " +
          "that accounts for the same material. WHY IT IS A CLAIM OF ITS OWN: because it is the part of " +
          "this record most likely to be revised, and it should be revisable without disturbing the dates.",
        notes:
          "NEEDS SOURCE VERIFICATION for the grounds the excavators give. A version of this record that " +
          "quoted their reasoning would let a reader weigh it instead of taking it on trust.",
      },
    ],
  },

  {
    slug: "abomey-plateau-two-thousand-year-gap",
    title: "Two thousand years with no large settlement on the plateau",
    summary:
      "Sodohomé I ends in the mid-first millennium BCE. The next large settlement in the same landscape begins around the end of the tenth century CE. The gap between them is a real feature of the record.",
    description:
      "WHAT THE SEQUENCE SHOWS. Two settlements of comparable size, partly overlapping on the ground, " +
      "separated by roughly two thousand years. Sodohomé I runs to about the middle of the first millennium " +
      "BCE. Sodohomé 2 — also called Sodohomé-Bohicon — comes into existence at the end of the tenth " +
      "century CE.\n\n" +
      "WHY THE GAP IS WORTH A RECORD OF ITS OWN. Because the natural reading of a map with two dots on it " +
      "is continuity, and the natural reading of a name used for both is one place with a long history. " +
      "Neither is supported. Whatever the relationship between the people of the two settlements, it is not " +
      "demonstrated by their both being at Sodohomé.\n\n" +
      "WHAT THE GAP MIGHT MEAN. Three possibilities, and they are not equally interesting. The area was " +
      "genuinely empty or thinly occupied. The area was occupied in ways that leave little archaeological " +
      "trace — small, mobile, dispersed. Or the intervening material exists and has not been found, because " +
      "the excavations targeted the two large sites. Nothing available here separates them.\n\n" +
      "A WARNING THIS RECORD IS FOR. 'Continuous occupation since 1100 BCE' is the kind of sentence that " +
      "gets written about places like this, and it is not what the evidence says.\n\n" +
      "THINGS TO ASK: What is the difference between 'nothing was found' and 'nothing was there'? Which is " +
      "easier to prove?",
    category: "archaeology",
    subcategory: "Settlement history",
    eventType: "archaeological_interpretation",
    evidenceStatus: "unresolved",
    tags: ["archaeology", "settlement", "abomey-plateau", "sodohome", "method", "deep-history"],
    locationName: "Abomey–Bohicon plateau, southern Bénin",
    lat: 7.16,
    lng: 2.03,
    claims: [
      {
        sourceKey: "merkyte_urbanizing_forest",
        startYear: -499,
        endYear: 900,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The interval between the two large settlements at Sodohomé",
        originalDateText: "Roughly two thousand years, between the end of Sodohomé I and the rise of Sodohomé 2",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS ESTABLISHED: dates for the two settlements at either end. WHAT IS NOT: what happened in " +
          "between, which is the span this claim covers and about which the excavations reported here say " +
          "little. THIS CLAIM IS A DESCRIPTION OF AN ABSENCE, and an absence in an excavation record is " +
          "evidence about the excavation as well as about the past.",
      },
    ],
  },

  {
    slug: "sodohome-bohicon-second-settlement",
    title: "Sodohomé 2: a centre of nearly six hundred hectares, around 900–1220 CE",
    summary:
      "At the end of the tenth century a large settlement appears on the same plateau, reported at 580 hectares or more and dated to roughly 900–1150/1220 CE, with industrial-scale iron production.",
    description:
      "WHAT WAS FOUND. A second large settlement — Sodohomé 2, or Sodohomé-Bohicon — mapped by geophysics " +
      "and tested by excavation, reported as occupying at least 580 hectares by the end of the tenth " +
      "century and dated to approximately 900–1150 or 1220 CE. Its defining activity, as published, is " +
      "IRON PRODUCTION on a scale the excavators describe as industrial.\n\n" +
      "WHY THIS IS THE MOST IMPORTANT SETTLEMENT RECORD FOR WHAT COMES LATER. It puts a large, " +
      "iron-producing population on the Abomey plateau four to seven centuries before the kingdom of " +
      "Dahomey. Whatever Dahomey was, it was not the first political or economic concentration in this " +
      "landscape, and the plateau it was built on was not empty ground.\n\n" +
      "WHAT IRON PRODUCTION AT SCALE IMPLIES, CAREFULLY. Fuel, in quantity — which means woodland managed " +
      "or consumed. Ore. Labour, and therefore food to feed it. Smiths with transmitted skill. And, usually, " +
      "somebody to trade the iron to. Each of those is an inference from slag rather than a finding, and " +
      "they are listed here as inferences.\n\n" +
      "WHAT THIS RECORD REFUSES TO SAY. That the people here were Fon, or Aja, or the ancestors of the " +
      "Dahomean royal line. No evidence available here supports the identification, the later dynasty's own " +
      "traditions do not claim descent from them, and a settlement in the same place is not a genealogy.\n\n" +
      "THINGS TO ASK: What does a slag heap tell you about the people who made it? What does it not?",
    category: "archaeology",
    subcategory: "Iron Age settlement",
    eventType: "archaeological_interpretation",
    evidenceStatus: "strongly_documented",
    identificationStatus: "secure",
    tags: ["archaeology", "settlement", "metallurgy", "iron", "abomey-plateau", "bohicon", "sodohome", "technology"],
    locationName: "Sodohomé–Bohicon, southern Bénin",
    lat: 7.18,
    lng: 2.07,
    claims: [
      {
        sourceKey: "merkyte_urbanizing_forest",
        startYear: 900,
        endYear: 1220,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The occupation of Sodohomé 2",
        originalDateText: "AD 900–1150/1220",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        evidence:
          "WHAT PRODUCED THIS DATE: radiocarbon determinations from excavated contexts. NOTE THE DOUBLE END " +
          "DATE IN THE SOURCE'S OWN WORDING — '1150/1220' is the excavators recording that the end of " +
          "occupation is not tightly fixed. This claim takes the later figure as its end so the span is not " +
          "narrowed by transcription.",
        notes:
          "NEEDS SOURCE VERIFICATION for the determinations. The alternative end date of about 1150 is " +
          "recorded in this evidence note rather than as a second claim, because it is one source hedging " +
          "rather than two sources disagreeing.",
      },
      {
        sourceKey: "openedition_sodohome_burial",
        startYear: 1000,
        endYear: 1200,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Sodohomé horizon, as dated in a separate excavation publication",
        originalDateText: "L'horizon Sodohomé au Bénin (1000-1200 AD)",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "A SECOND, NARROWER SPAN for the same archaeological horizon, taken from the title of a study of " +
          "a burial attributed to it. Kept as its own claim because it is a different figure published by a " +
          "different route, not because the two disagree in substance.",
      },
    ],
    media: [
      {
        url: commons("Village souterrain d'Agongointo.jpg"),
        sourcePageUrl: commonsPage("Village souterrain d'Agongointo.jpg"),
        fileName: "Village souterrain d'Agongointo.jpg",
        caption:
          "The underground site at Agongointo near Bohicon, on the same plateau. It is a different site and a much later one than the settlement this record is about, and it is attached here only to show what archaeology on this plateau physically looks like — not as a picture of Sodohomé 2.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "DELIBERATELY LABELLED AGAINST ITSELF: this is not the site described in the record, and the " +
          "caption says so. It is included because no verified photograph of the Sodohomé excavations was " +
          "available, and an unlabelled stand-in would be worse than none.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "sodohome-child-burial",
    title: "The burial of a young individual, Sodohomé horizon",
    summary:
      "One excavated burial of an immature individual, attributed to the Sodohomé horizon and dated in its publication to 1000–1200 CE. A single grave, and most of what can be said about it is methodological.",
    description:
      "WHAT SURVIVES. The burial of a young individual, excavated from deposits attributed to the Sodohomé " +
      "horizon, published in a volume about excavation in difficult conditions.\n\n" +
      "WHY A SINGLE BURIAL IS WORTH A RECORD. Because in a region where the archaeology is mostly slag, " +
      "sherds and geophysical anomalies, a body is the only direct evidence of a PERSON. It carries age, " +
      "sometimes sex, sometimes health and diet, and the treatment given to them by the people who buried " +
      "them.\n\n" +
      "WHY THE PUBLICATION IS ABOUT DIFFICULTY. Human bone survives badly in tropical acidic soils. A " +
      "skeleton that would be routine to lift in a temperate cemetery may be fragile to the point of " +
      "disintegration here. The conditions of excavation are part of what a reader needs in order to judge " +
      "what the excavators could and could not observe.\n\n" +
      "WHAT MUST NOT BE BUILT ON THIS. Burial customs of a population, beliefs about death, or anything " +
      "about the religion of the people of Sodohomé. One grave is one grave. Inferring a funerary tradition " +
      "from it — or, worse, connecting it to Vodun practices documented eight hundred years later — would be " +
      "the sort of leap this whole dataset is arranged to prevent.\n\n" +
      "THINGS TO ASK: What can one burial tell you? What would you need before you could describe a " +
      "people's treatment of their dead?",
    category: "archaeology",
    subcategory: "Burial",
    eventType: "archaeological_interpretation",
    evidenceStatus: "verified_physical_remains",
    tags: ["archaeology", "burial", "human-remains", "sodohome", "method", "deep-history"],
    locationName: "Sodohomé, southern Bénin",
    lat: 7.16,
    lng: 2.03,
    claims: [
      {
        sourceKey: "openedition_sodohome_burial",
        startYear: 1000,
        endYear: 1200,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The burial",
        originalDateText: "1000-1200 AD, as given in the publication's title",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS DATED: the burial, through its attribution to the Sodohomé horizon and that horizon's " +
          "own dating. NOTE WHAT THIS MEANS: unless the bone itself was dated, the grave's date is " +
          "inherited from the layer it was cut into, which is a weaker thing than a direct determination.",
        notes:
          "NEEDS SOURCE VERIFICATION for whether the remains themselves were radiocarbon dated, which would " +
          "change the standing of this date considerably.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // CENTRAL AND COASTAL BÉNIN
  // -------------------------------------------------------------------------
  {
    slug: "save-iron-using-agriculturalists",
    title: "Savè: iron-using farmers in central Bénin by about 1000 CE",
    summary:
      "Survey and excavation around Savè show communities using iron and farming by roughly 1000 CE, with settlement patterns that change measurably over the following centuries.",
    description:
      "WHAT THE EVIDENCE IS. A regional programme of survey and excavation in the Savè area of central " +
      "Bénin, reading changes in site patterning and in material culture rather than digging one site " +
      "deeply. By about 1000 CE the area is inhabited by iron-using agriculturalists.\n\n" +
      "WHY REGIONAL SURVEY ANSWERS DIFFERENT QUESTIONS. A single excavation tells you about one place in " +
      "detail. A survey tells you how many settlements there were, how big, how far apart, and how that " +
      "changed — which is how you see a society reorganising itself. The Savè work is the clearest example " +
      "in Bénin of archaeology used that way.\n\n" +
      "WHAT IT SHOWS ACROSS TIME. Settlement size increases and the pattern becomes more dispersed with the " +
      "establishment of the Shabe kingdom in the seventeenth century, together with a greater variety of " +
      "pottery decoration. In the nineteenth century, instability produces a settlement pattern centred on " +
      "FORTIFIED sites — which is what insecurity looks like in an archaeological record.\n\n" +
      "NON-LOCAL OBJECTS. The survey also recovered artefacts from outside the region, showing connections " +
      "beyond it and, in the later periods, participation in wider economic networks.\n\n" +
      "WHAT THIS RECORD IS NOT. Evidence that farming or iron BEGAN here at 1000 CE. It is evidence of what " +
      "was there by then. The beginning is a different question, and the survey was not designed to answer " +
      "it.\n\n" +
      "THINGS TO ASK: What does it mean when people start building on defensible ground? What else could " +
      "explain it?",
    category: "archaeology",
    subcategory: "Settlement history",
    eventType: "archaeological_interpretation",
    evidenceStatus: "strongly_documented",
    tags: ["archaeology", "settlement", "agriculture", "iron", "save", "central-benin", "survey"],
    locationName: "Savè area, central Bénin",
    lat: 8.03,
    lng: 2.49,
    claims: [
      {
        sourceKey: "gurstelle_save_settlement",
        startYear: 1000,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "Iron-using agricultural communities in the Savè area",
        originalDateText: "By AD 1000 the area was inhabited by iron-using agriculturalists",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        evidence:
          "WHAT PRODUCED THIS DATE: the survey's excavated test contexts and their radiocarbon dating, " +
          "combined with ceramic sequencing across the surveyed sites. NOTE THE WORDING: 'by AD 1000' is a " +
          "LATEST-BY date, not a start date, and it is entered as an approximate point rather than as a " +
          "beginning for that reason.",
        notes: "NEEDS SOURCE VERIFICATION for the determinations behind the figure.",
      },
      {
        sourceKey: "gurstelle_save_settlement",
        startYear: 1600,
        endYear: 1699,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The settlement changes associated with the Shabe kingdom",
        originalDateText: "The establishment of the Shabe kingdom in the seventeenth century",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS OBSERVED: larger sites, a more dispersed pattern, more varied pottery decoration. WHAT " +
          "IS INFERRED: that these changes are associated with the rise of a kingdom. The association is " +
          "the survey's interpretation and rests on combining its archaeology with historical traditions " +
          "about Shabe, which is a legitimate move and is not the same as reading the kingdom out of the " +
          "ground.",
      },
      {
        sourceKey: "gurstelle_save_settlement",
        startYear: 1800,
        endYear: 1899,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The shift to fortified settlement",
        originalDateText: "Instability in the nineteenth century led to a settlement pattern centred on fortified sites",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS OBSERVED: fortification, and settlement concentrating on defensible locations. WHAT IT " +
          "COINCIDES WITH: a century in which Dahomean and Yoruba warfare, slave-raiding and the collapse " +
          "of Oyo reshaped this whole region. The archaeology shows the insecurity; the documentary and " +
          "oral record is where its causes are argued about.",
      },
    ],
  },

  {
    slug: "coastal-benin-salt-and-earthenware",
    title: "Salt and pottery on the coast, at the time of Atlantic contact",
    summary:
      "Excavation of a coastal occupation in Bénin has recovered earthenwares associated with salt production around the period when Atlantic trade reached this shore.",
    description:
      "WHAT WAS FOUND. A coastal occupation site with earthenware assemblages connected to SALT PRODUCTION, " +
      "published as evidence for coastal life at the time of Atlantic entanglement.\n\n" +
      "WHY SALT. Before refrigeration, salt is one of the few ways to keep fish and meat, and a lagoon coast " +
      "with fish to preserve and brackish water to boil is a place where salt gets made. Salt is also one of " +
      "the great inland trade goods of West Africa. A salt-producing coast is therefore not a marginal place " +
      "but a node — producing something the interior wants, long before any European ship arrives.\n\n" +
      "WHY THIS MATTERS FOR THE SLAVE-TRADE HISTORY THAT FOLLOWS. Because the standard picture has the " +
      "Atlantic arriving at an empty shore and creating the coastal economy. Archaeology of coastal " +
      "production complicates that: there was an economy here, with its own products and its own links " +
      "inland, and the Atlantic trade attached itself to it.\n\n" +
      "WHAT IS NOT CLAIMED. A date is not entered as a precise figure here, because the published range " +
      "could not be verified. The record is entered with a broad span and says so.\n\n" +
      "THINGS TO ASK: What did this coast export before it exported people?",
    category: "archaeology",
    subcategory: "Coastal economy",
    eventType: "archaeological_interpretation",
    tags: ["archaeology", "coast", "salt", "pottery", "trade", "technology", "atlantic"],
    locationName: "Coastal lagoons, southern Bénin",
    lat: 6.32,
    lng: 2.1,
    claims: [
      {
        sourceKey: "coastal_benin_salt",
        startYear: 1400,
        endYear: 1800,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The coastal occupation and its salt-working earthenwares",
        originalDateText: "Around the time of Atlantic entanglement; the published range is not verified here",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHY THIS SPAN IS SO WIDE: it is deliberately wider than the source's, because the source's could " +
          "not be read. 'Around the time of Atlantic entanglement' is the phrase available, and a wide " +
          "range that certainly contains the truth is better than a narrow one invented to look precise.",
        notes:
          "NEEDS SOURCE VERIFICATION, urgently — this claim's range is a placeholder around a real " +
          "publication and should be replaced with the excavators' own dates as soon as the paper can be " +
          "read.",
      },
    ],
  },

  {
    slug: "agongointo-underground-site-found-1998",
    title: "1998: a bulldozer falls into an underground town at Bohicon",
    summary:
      "Roadworks near Bohicon broke into a complex of underground chambers. More than fifty were recorded, and the site was on UNESCO's Tentative List within months.",
    description:
      "WHAT HAPPENED. In February 1998, during construction of a bypass at Bohicon carried out with Danish " +
      "involvement, machinery broke through into a void. What lay beneath was a complex of underground " +
      "chambers and passages — more than fifty dwellings were reported — cut into the plateau's laterite at " +
      "depths of around ten metres. Some have several levels; some appear connected to wells.\n\n" +
      "HOW IT WAS FIRST EXPLAINED. The traditional account attaches the souterrains to warfare and to the " +
      "reign of Dakodonou, placing them in the late sixteenth or early seventeenth century and explaining " +
      "them as shelters for warriors — hiding places in a landscape repeatedly raided.\n\n" +
      "WHAT HAPPENED NEXT, INSTITUTIONALLY. The site was added to Bénin's UNESCO Tentative List within " +
      "months of its discovery, and turned into an archaeological park open to visitors. That is fast, and " +
      "it matters: the interpretation that a site receives in its first year is the one that ends up on the " +
      "signs, in the guidebooks, and in every article written afterwards.\n\n" +
      "WHY THIS RECORD KEEPS THE DISCOVERY SEPARATE FROM THE EXPLANATION. Because the discovery is a " +
      "documented event of 1998 with a date anyone can check, and the explanation is an interpretation that " +
      "has since been revised. Merging them would give the interpretation the date's certainty.\n\n" +
      "THINGS TO ASK: Who gets to say what a site means, and how quickly does that answer harden?",
    category: "archaeology",
    subcategory: "Discovery",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["archaeology", "agongointo", "bohicon", "discovery", "heritage", "unesco", "abomey-plateau"],
    locationName: "Agongointo-Zoungoudo, Bohicon, southern Bénin",
    lat: 7.16,
    lng: 2.08,
    claims: [
      {
        sourceKey: "unesco_agongointo_tentative",
        startYear: 1998,
        startMonth: 2,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The discovery of the underground site",
        originalDateText: "February 1998, during construction of a bypass at Bohicon",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: a modern event, recorded at the time by the people it happened to. This is the " +
          "securest date on this record and it is a date about ARCHAEOLOGISTS, not about the site.",
      },
      {
        sourceKey: "unesco_agongointo_tentative",
        startYear: 1998,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Placement on Bénin's UNESCO Tentative List",
        originalDateText: "Added to the Tentative List in 1998, within months of the discovery",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the administrative act. WHAT IT ESTABLISHES: that the state moved quickly to " +
          "claim and protect the site. WHAT IT DOES NOT ESTABLISH: anything about the site's age, function " +
          "or builders — a Tentative List entry is a nomination, not a finding.",
      },
    ],
    media: [
      {
        url: commons("Village souterrain d'Agongointo.jpg"),
        sourcePageUrl: commonsPage("Village souterrain d'Agongointo.jpg"),
        fileName: "Village souterrain d'Agongointo.jpg",
        caption:
          "The underground village at Agongointo near Bohicon as it is presented today, after the site was developed as an archaeological park. A photograph of a managed heritage site rather than of an excavation in progress, which is worth knowing when reading what it shows.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "agongointo-function-debate",
    title: "What were the souterrains for?",
    summary:
      "War shelters is the traditional answer and the one on the signs. Since 2009 scholars have added mining, water storage and military installation. The site's date is not securely fixed either.",
    description:
      "WHAT KIND OF RECORD IS THIS? A debate, kept separate from the discovery so that the two are not read " +
      "as one settled story.\n\n" +
      "THE TRADITIONAL ANSWER. Hiding places for warriors and for populations during raiding, attached to " +
      "the reign of Dakodonou in the late sixteenth or early seventeenth century. It is coherent, it fits " +
      "the region's history of warfare, and it is what the site is presented as.\n\n" +
      "THE REVISION. Since about 2009, scholars have proposed that the souterrains of the Abomey plateau " +
      "served a RANGE of functions — mining, water storage, and military installation among them — rather " +
      "than one. That is a substantial change: it turns a single monument with a single story into a class " +
      "of features with different purposes, possibly cut at different times.\n\n" +
      "WHY THE DATE IS THE WEAK POINT. The attribution to Dakodonou's reign comes from tradition and from " +
      "association, not from a laboratory. Cut features are notoriously hard to date: what you can date is " +
      "what ends up in the fill, which is younger than the cutting, sometimes by a lot. So 'sixteenth or " +
      "seventeenth century' should be read as the traditional attribution rather than as an excavation " +
      "result.\n\n" +
      "WHAT WOULD SETTLE IT. Dated material from primary fills across several souterrains; tool marks and " +
      "cutting technique studied comparatively; and evidence of use — hearths, occupation debris, storage " +
      "residues, ore — from the chambers themselves.\n\n" +
      "THINGS TO ASK: If a hole in the ground has no floor deposit, what can date it? Why might the same " +
      "kind of chamber have been used for different things at different times?",
    category: "archaeology",
    subcategory: "Debate",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["debate", "archaeology", "agongointo", "bohicon", "dating", "interpretation", "warfare"],
    locationName: "Agongointo-Zoungoudo and the Abomey plateau souterrains",
    lat: 7.16,
    lng: 2.08,
    claims: [
      {
        sourceKey: "wikipedia_benin_navigation",
        startYear: 1580,
        endYear: 1645,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "When the souterrains were cut, on the traditional attribution",
        originalDateText: "The late sixteenth or early seventeenth century, during the reign of Dakodonou",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "WHAT THIS DATE RESTS ON: attribution to a named reign in tradition, and the plausibility of war " +
          "shelters in a period of raiding. WHAT IT DOES NOT REST ON: any dated sample from the site " +
          "reported here. THE REIGN ITSELF IS NOT SECURELY DATED, so this is a date pinned to a date that " +
          "is also uncertain — which is worth seeing, because it is a common and invisible way for " +
          "confidence to be manufactured.",
        notes:
          "NEEDS BETTER SOURCING: this claim currently rests on general reference material rather than on " +
          "an archaeological publication, which is the weakest footing of any dated claim in this dataset.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "What the souterrains were for",
        originalDateText: "Open. War shelter, mine, water store and military installation have all been proposed",
        datingMethod: "archaeological",
        chronology: "disputed",
        evidence:
          "WHAT CHANGED THE QUESTION: work from around 2009 onwards proposing that souterrains across the " +
          "plateau served different functions rather than one. WHY THIS CLAIM CARRIES NO POSITION: function " +
          "is not a moment. It is recorded as a claim so that the interface can show it as unresolved " +
          "instead of leaving the traditional answer standing unopposed in the prose.",
        notes:
          "NEEDS SOURCE VERIFICATION and named participants: who proposed the revision, on what evidence, " +
          "and whether it is now the consensus or one position among several.",
      },
    ],
  },

  {
    slug: "republic-of-benin-is-not-kingdom-of-benin",
    title: "The Republic of Bénin is not the Kingdom of Benin",
    summary:
      "The kingdom famous for the Benin Bronzes was an Edo state in what is now Nigeria. The Republic of Bénin took its name in 1975 from the Bight of Benin. Confusing them is the commonest error in this whole subject.",
    description:
      "WHY THIS RECORD IS IN AN ARCHAEOLOGY DATASET. Because the confusion actively corrupts research. " +
      "Search for 'Benin archaeology' and a large part of what comes back is about a different country: " +
      "excavations at Benin City, the earthworks of the Edo kingdom, the bronzes taken by the British " +
      "punitive expedition of 1897. None of it is evidence about the Republic of Bénin.\n\n" +
      "THE TWO THINGS. THE KINGDOM OF BENIN was an Edo state centred on Benin City in what is now " +
      "south-western Nigeria, famous for its brass and ivory sculpture and for the sack of its capital by a " +
      "British force in 1897. THE REPUBLIC OF BÉNIN is the modern West African state formerly called " +
      "Dahomey, which adopted the name Benin in 1975, taking it from the Bight of Benin — the stretch of " +
      "coast — rather than from the kingdom.\n\n" +
      "WHY THE NAME WAS CHOSEN. 'Dahomey' was the name of one kingdom among several within the modern " +
      "borders, and using it for the whole country privileged the Fon south over the Bariba north, the " +
      "Yoruba east and everyone else. A neutral geographical name did not. That is a political decision " +
      "about national identity, and it had the side-effect of creating a permanent collision with a famous " +
      "kingdom next door.\n\n" +
      "THE ERROR TO WATCH FOR. Benin Bronzes captioned as art of this country. Edo kingship described as " +
      "the background to Dahomey. Nigerian excavation dates cited as evidence for the Beninese sequence. " +
      "All three happen constantly.\n\n" +
      "THINGS TO ASK: How much of what you think you know about a place depends on its name?",
    category: "history",
    subcategory: "Naming and identity",
    eventType: "historical",
    tags: ["method", "naming", "modern-benin", "historiography", "nigeria", "heritage"],
    locationName: "Republic of Bénin, and Benin City, Nigeria",
    claims: [
      {
        sourceKey: "wikipedia_benin_navigation",
        startYear: 1975,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The adoption of the name Benin by the modern state",
        originalDateText: "1975, when the Republic of Dahomey was renamed",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: a government act with a documentary record. The reasoning behind the choice — " +
          "that the name of one kingdom should not stand for a country containing many peoples — is " +
          "reported in the general literature and is the part of this record most worth checking against " +
          "the debates of the time.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // PEOPLES, MIGRATIONS AND THE TRADITIONS THAT CARRY THEM
  // -------------------------------------------------------------------------
  {
    slug: "oral-tradition-is-evidence-but-not-a-transcript",
    title: "Oral tradition is evidence — and it is not a transcript of the past",
    summary:
      "Nearly everything known about this region before about 1500 comes through traditions transmitted by telling. This record sets out how the dataset handles them, because the alternative is to treat them as either gospel or noise.",
    description:
      "WHY THIS RECORD EXISTS. Most of the migration and foundation history in this dataset rests on ORAL " +
      "TRADITION. Those traditions are not decoration around a documentary core: for long stretches they " +
      "are the only account there is. Dismissing them would empty the record. Taking them literally would " +
      "fill it with things nobody can check.\n\n" +
      "WHAT AN ORAL TRADITION IS GOOD AT. Carrying names, sequences, relationships and claims of descent " +
      "across generations with real fidelity. Preserving a community's account of where it came from and " +
      "who it is related to. Recording events that mattered enough to be worth keeping.\n\n" +
      "WHAT IT IS BAD AT, STRUCTURALLY. ABSOLUTE DATES — generations are counted, not years, and counts " +
      "drift. DEPTH — middle stretches compress, so a long past can telescope into a short list of " +
      "ancestors. And POLITICAL NEUTRALITY — a tradition about who founded what is also a claim about who " +
      "should rule, which means it has an interest in its own content.\n\n" +
      "THE FIVE THINGS THIS DATASET TRIES TO RECORD ABOUT ANY TRADITION. Who keeps it. When the earliest " +
      "version we have was written down, and by whom. What the later variants say. What political work it " +
      "does for the people who tell it. And whether archaeology agrees, disagrees or is silent.\n\n" +
      "THE HONEST ADMISSION. This dataset does the first and the fourth reasonably well and the second " +
      "badly, because the collections where the earliest recorded versions sit could not be read from here. " +
      "Where a record says 'oral tradition', a reader should understand: a tradition recorded by somebody, " +
      "somewhere, at some point, and this file usually cannot say who or when.\n\n" +
      "THINGS TO ASK: If a story is told to explain why a family rules, does that make it false? What would " +
      "make it checkable?",
    category: "history",
    subcategory: "Method",
    eventType: "other",
    eventTypeNote: "A methodological record about how this dataset handles oral sources, not an event.",
    tags: ["oral-knowledge", "method", "migration", "historiography", "tradition"],
    locationName: "Southern and northern Bénin",
    claims: [
      {
        sourceKey: "aja_oral_traditions_general",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Nothing. This record is about method",
        originalDateText: "Not a dated event",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHY THIS RECORD HAS A POSITIONLESS CLAIM RATHER THAN NO CLAIM: so it appears in searches and " +
          "filters for oral tradition alongside the records it governs, without being drawn anywhere on " +
          "the axis. A statement about how to read sources is not an event and must not be given a year.",
      },
    ],
  },

  {
    slug: "aja-and-the-tado-tradition",
    title: "Tado, and the traditions of Aja origin",
    summary:
      "Aja traditions place an origin at Tado on the Mono, in what is now Togo, with earlier movement from further east. The chronology is traditional and historians divide over the routes.",
    description:
      "WHAT THE TRADITIONS SAY. Aja-speaking communities across what is now southern Bénin and south-eastern " +
      "Togo trace themselves to TADO, on the Mono river. Behind Tado, traditions describe earlier movement " +
      "from the east — from the region of the Niger-Benue confluence, or through Ketu, or from the Yoruba " +
      "country — before the eleventh to fourteenth centuries.\n\n" +
      "WHAT HISTORIANS DO WITH THAT. They treat Tado as a real focus of dispersal, because too many " +
      "communities over too wide an area name it for it to be a local invention. What they divide over is " +
      "the ROUTES and the DATES: whether particular groups passed through Ketu, or Notsé, or neither, and " +
      "how far back any of it goes.\n\n" +
      "WHAT A MIGRATION TRADITION IS ALSO DOING. Saying who you are related to. A shared origin at Tado is " +
      "a statement of kinship between communities that later fought each other, and it can be invoked or " +
      "forgotten depending on what the present requires. That is not a reason to disbelieve it; it is a " +
      "reason to notice that it has a function.\n\n" +
      "WHAT ARCHAEOLOGY CONTRIBUTES. Very little, so far, and this should be said plainly: there is no " +
      "excavated sequence known here that tracks the movement of Aja-speaking populations. Language, " +
      "tradition and archaeology are three separate lines of evidence, and in this region only the first " +
      "two are currently saying much.\n\n" +
      "WHY NO PREHISTORIC MATERIAL IN THIS DATASET IS CALLED AJA. Because none of it can be. The " +
      "identification of an archaeological culture with a language group needs evidence, and 'they were in " +
      "the same place later' is not evidence.\n\n" +
      "THINGS TO ASK: How do you trace the movement of a language? Is that the same as tracing the movement " +
      "of people?",
    category: "people",
    subcategory: "Migration tradition",
    eventType: "traditional_account",
    tags: ["migration", "oral-knowledge", "aja", "tado", "peoples", "tradition", "disputed-chronology"],
    people: ["Aja"],
    civilisations: ["Aja"],
    locationName: "Tado, on the Mono river, in modern Togo",
    lat: 7.0,
    lng: 1.7,
    claims: [
      {
        sourceKey: "aja_oral_traditions_general",
        startYear: 1100,
        endYear: 1299,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The migration of Aja communities to the south, as tradition places it",
        originalDateText: "The twelfth or thirteenth centuries, from Tado on the Mono",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHAT THIS DATE RESTS ON: traditions of descent and generation-counting, converted into centuries " +
          "by later collectors and historians. WHAT IT DOES NOT REST ON: any document or excavation. THE " +
          "CONVERSION IS THE WEAK STEP: turning a remembered number of generations into a number of years " +
          "requires assuming a generation length, and different assumptions move the answer by centuries.",
        notes:
          "NEEDS SOURCE VERIFICATION for who recorded this version, when, and from whom — the three things " +
          "that would let a reader weigh it.",
      },
      {
        sourceKey: "aja_oral_traditions_general",
        startYear: 1000,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The founding of Tado itself, as reported in the general literature",
        originalDateText: "The Kingdom of Tado, established around the year 1000",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "A SEPARATE AND EARLIER DATE, kept apart from the migration above because they are different " +
          "events: when Tado was founded and when people left it are two questions. A round figure like " +
          "'around 1000' in this kind of literature is usually a scholar's estimate rather than a " +
          "tradition's own statement, and should be read that way.",
        notes: "NEEDS BETTER SOURCING: this figure circulates widely in reference works with no evident origin.",
      },
    ],
  },

  {
    slug: "three-brothers-tradition-allada-abomey-hogbonu",
    title: "The tradition of the three brothers: Allada, Abomey and Hogbonu",
    summary:
      "A widely told tradition has three brothers dividing the inheritance of Allada around 1600 — one keeping Allada, one founding Abomey, one founding Little Ardra at Porto-Novo. It explains three states with one story.",
    description:
      "THE TRADITION. Around 1600, the rulership of Allada is disputed between three brothers, commonly " +
      "named Kokpon, Do-Aklin and Te-Agdanlin (Te-Agbanlin). Kokpon keeps Great Ardra — Allada itself. " +
      "Do-Aklin goes north to the Abomey plateau, where his line will found Dahomey. Te-Agdanlin goes " +
      "south-east to the lagoon and founds the state that Europeans will call Little Ardra and Porto-Novo, " +
      "and which its own people call Hogbonu.\n\n" +
      "WHY IT IS SO USEFUL, AND THAT IS THE PROBLEM. One story explains the existence of three states, " +
      "their relative seniority, their kinship, and therefore the legitimacy of each dynasty and its claims " +
      "on the others. A tradition that does that much political work is exactly the kind that gets shaped " +
      "by the work it does.\n\n" +
      "THE SPECIFIC SUSPICION HISTORIANS RAISE. That Dahomey's claimed descent from Allada is a LATER " +
      "CONSTRUCTION, produced or sharpened to justify Dahomey's conquest of Allada in 1724 — a conquest " +
      "reframed as a family matter rather than an act of aggression against a foreign state. J. Cameron " +
      "Monroe argues along these lines from the archaeology of the plateau.\n\n" +
      "WHAT WOULD TEST IT. Whether the three-brothers story is attested BEFORE 1724 in any source. That is " +
      "the single most valuable piece of evidence anybody could bring to this record, and it is not " +
      "established here.\n\n" +
      "WHAT THE TRADITION IS NOT. Refuted. Dynasties do send out branches, and a genuine memory of one " +
      "would look much like this. The record's position is that the story cannot currently be separated " +
      "from the use later made of it.\n\n" +
      "THINGS TO ASK: If a story would have been invented had it not been true, how do you tell which " +
      "happened?",
    category: "history",
    subcategory: "Foundation tradition",
    eventType: "traditional_account",
    identificationStatus: "disputed",
    tags: ["oral-knowledge", "migration", "kingdoms", "allada", "abomey", "porto-novo", "legitimacy", "tradition"],
    people: ["Kokpon", "Do-Aklin", "Te-Agdanlin"],
    civilisations: ["Aja", "Allada", "Dahomey", "Hogbonu"],
    locationName: "Allada, southern Bénin",
    lat: 6.66,
    lng: 2.15,
    claims: [
      {
        sourceKey: "aja_oral_traditions_general",
        startYear: 1600,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The division between the three brothers, as tradition places it",
        originalDateText: "Around 1600",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHAT THIS DATE RESTS ON: back-counting from the reigns of the Dahomean dynasty, whose own early " +
          "chronology is itself reconstructed from tradition. So it is a traditional date anchored to a " +
          "traditional date. IT IS ALSO SUSPICIOUSLY ROUND, and roundness in a reconstructed chronology " +
          "usually marks the point where a scholar had to choose.",
      },
      {
        sourceKey: "monroe_building_the_state",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether Dahomey's descent from Allada is a genuine memory or a later construction",
        originalDateText: "Argued. Probably a later creation serving the conquest of Allada, on Monroe's reading",
        datingMethod: "archaeological",
        chronology: "disputed",
        evidence:
          "WHAT SUPPORTS THE SCEPTICAL READING: the story's usefulness to Dahomey precisely when it " +
          "conquered Allada in 1724; the general pattern by which conquering dynasties in the region " +
          "acquire prestigious genealogies; and the absence, so far as this dataset can establish, of any " +
          "pre-conquest attestation. WHAT SUPPORTS THE TRADITION: its wide distribution among communities " +
          "with no interest in flattering Dahomey. WHY THIS CLAIM HAS NO POSITION: it is an argument about " +
          "a story's origin, not an event with a date.",
        notes: "NEEDS SOURCE VERIFICATION for Monroe's exact argument and the evidence he brings to it.",
      },
    ],
  },

  {
    slug: "allada-in-portuguese-records-1539",
    title: "1539: Allada appears in Portuguese documentation",
    summary:
      "The documentary horizon for this coast. From 1539 there is a written record of Allada — which is where checkable chronology begins, and where oral tradition stops being the only source.",
    description:
      "WHY THIS DATE IS A TURNING POINT IN THE DATASET RATHER THAN IN THE REGION. Nothing changed in Allada " +
      "in 1539. What changed is the EVIDENCE: from this point there are documents written by outsiders at " +
      "the time, which can be dated independently of anybody's tradition. Everything before it in this file " +
      "is archaeology or oral tradition; from here on there is a third kind of source.\n\n" +
      "WHAT THE DOCUMENTS ARE AND ARE NOT. Portuguese records naming Allada — or Arda, Ardra, Arada, in the " +
      "various spellings — as a place and a polity on this coast. They establish that it existed, was known " +
      "to Europeans, and mattered enough to be written about. They do not describe its institutions, its " +
      "history or its extent with any accuracy, and they are written by people who had every reason to " +
      "misunderstand what they were looking at.\n\n" +
      "THE ERROR TO AVOID. Treating 1539 as the beginning of Allada. It is the beginning of the written " +
      "record OF Allada, which is a fact about European shipping.\n\n" +
      "WHY IT MATTERS FOR THE VODUN LANE. Because the first surviving written use of the word 'vodu' comes " +
      "just over a century later, from a text connected with this same kingdom. The gap between a kingdom " +
      "entering the record in 1539 and its religion entering it in 1658 is a gap in DOCUMENTATION, not in " +
      "existence — and it is exactly the kind of gap that gets misread as a date of origin.\n\n" +
      "THINGS TO ASK: What is the difference between the earliest evidence of a thing and the beginning of " +
      "it? How often are the two quietly swapped?",
    category: "history",
    subcategory: "Documentary horizon",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["allada", "kingdoms", "european-encounter", "documents", "method", "atlantic"],
    civilisations: ["Allada"],
    locationName: "Allada, southern Bénin",
    lat: 6.66,
    lng: 2.15,
    claims: [
      {
        sourceKey: "law_rise_of_dahomey_historiography",
        startYear: 1539,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest Portuguese documentation of Allada identified in the historiography",
        originalDateText: "1539",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT THIS DATE IS: the date of a DOCUMENT, which is the most checkable kind of date in this " +
          "dataset and also the most easily misread. It establishes a latest-by date for Allada's " +
          "existence and says nothing whatever about how long it had existed already.",
        notes:
          "NEEDS SOURCE VERIFICATION for the identity of the document and for whether 1539 is still the " +
          "earliest reference accepted by specialists.",
      },
    ],
  },

  {
    slug: "arada-people-in-the-americas-1560s",
    title: "By the 1560s, people from this coast are in the Americas",
    summary:
      "People identified as Arara or Arada — from the Allada region — are documented in Spanish America, including Peru, within a generation of Allada entering the European record.",
    description:
      "WHAT IS DOCUMENTED. Individuals identified by the label Arara or Arada, derived from Allada, appear " +
      "in Spanish American records — including in Peru — in the 1560s. They are there because they were " +
      "enslaved and shipped.\n\n" +
      "WHY THIS RECORD SITS IN A DEEP-PAST DATASET. Because it fixes something about chronology that is " +
      "routinely got wrong. The Atlantic deportation of people from this coast is OLDER THAN DAHOMEY. It " +
      "begins before the kingdom that is most associated with it existed, and it continues after that " +
      "kingdom is destroyed. Dahomey became a major participant in a trade already running.\n\n" +
      "WHAT THE LABEL DOES AND DOES NOT TELL YOU. 'Arara' is a category used by slavers and notaries, " +
      "derived from a port or a region, not a self-description. It groups people by where a ship took them " +
      "from. Two people filed under it may have come from different places, spoken differently and shared " +
      "nothing but a point of embarkation. Reading it as an ethnicity is one of the standard errors in this " +
      "material — and, at the same time, these labels are among the few threads that connect named " +
      "communities in the Americas back to this coast at all.\n\n" +
      "WHERE THIS LEADS. To the diaspora records elsewhere in this timeline: Arará traditions in Cuba, " +
      "Jeje in Brazil, and the vocabulary that travelled with people. Those connections are real and they " +
      "are not simple, and none of them means a tradition crossed unchanged.\n\n" +
      "THINGS TO ASK: Who made the categories in an archive, and what were they for?",
    category: "history",
    subcategory: "Atlantic world",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["slavery", "atlantic", "diaspora", "allada", "documents", "peoples"],
    civilisations: ["Allada"],
    locationName: "Spanish America, including Peru",
    claims: [
      {
        sourceKey: "law_rise_of_dahomey_historiography",
        startYear: 1560,
        endYear: 1569,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The documented presence of Arara/Arada people in Spanish America",
        originalDateText: "The 1560s",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT PRODUCED THIS DATE: colonial administrative and notarial records in Spanish America, in " +
          "which enslaved people are identified by an ethnonym derived from Allada. THIS IS A LATEST-BY " +
          "DATE for deportation from this coast, not a start: records survive unevenly and the trade is " +
          "older than its paperwork.",
      },
    ],
  },

  {
    slug: "hueda-kingdom-and-savi",
    title: "Hueda, and its capital at Savi",
    summary:
      "The coastal kingdom of Hueda, with its capital at Savi and its port at Ouidah, controlled one of the busiest stretches of the Atlantic coast until Dahomey destroyed it in 1727.",
    description:
      "WHAT HUEDA WAS. A kingdom of the coastal plain behind the lagoons, with its capital at SAVI a few " +
      "kilometres inland and its trading beach at Ouidah. For roughly the second half of the seventeenth " +
      "century and the first quarter of the eighteenth it was one of the principal African powers of the " +
      "Atlantic trade, dealing with Portuguese, English, French and Dutch traders on terms it largely set.\n\n" +
      "HOW THE ARRANGEMENT WORKED. Europeans were not permitted to build where they liked or trade as they " +
      "pleased. They were quartered, taxed, supplied and regulated. The forts at Ouidah were built by " +
      "permission, garrisoned in small numbers, and existed at the pleasure of an African ruler. Nothing " +
      "about a European fort on this coast implies European control of the country around it.\n\n" +
      "THE RELIGIOUS DIMENSION. Hueda is the kingdom most associated with the serpent vodun DANGBÈ, and " +
      "the python cult at Ouidah is Hueda's before it is Dahomey's. Willem Bosman, writing at the end of " +
      "the seventeenth century, describes serpent veneration there in detail. That is dealt with in the " +
      "Vodun records; what matters here is that the religion and the state belong together.\n\n" +
      "HOW IT ENDED. Conquest by Dahomey under Agaja in 1727, after the conquest of Allada in 1724. The " +
      "Hueda royal line and a part of the population withdrew westwards and Hueda continued in exile; the " +
      "coast passed into Dahomean hands.\n\n" +
      "WHAT SURVIVES TO DIG. Savi has been excavated, and is one of the few places in this region where the " +
      "archaeology of an Atlantic-era African capital can be read directly.\n\n" +
      "THINGS TO ASK: Who was the host and who was the guest, on this coast in 1700?",
    category: "civilisation",
    subcategory: "Coastal kingdoms",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["kingdoms", "hueda", "savi", "ouidah", "trade", "atlantic", "european-encounter", "archaeology"],
    civilisations: ["Hueda"],
    locationName: "Savi, near Ouidah, southern Bénin",
    lat: 6.42,
    lng: 2.09,
    claims: [
      {
        sourceKey: "law_rise_of_dahomey_historiography",
        startYear: 1650,
        endYear: 1727,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Hueda as an independent coastal power",
        originalDateText: "c. 1650 to 1727",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT FIXES THE END: the Dahomean conquest of 1727, which is documented by European traders " +
          "present on the coast and is among the securest dates in this dataset. WHAT DOES NOT FIX THE " +
          "START: the kingdom's origins, which are earlier than its prominence and are not established " +
          "here. The opening figure is the period from which it is well documented, not a foundation date.",
      },
    ],
  },

  {
    slug: "porto-novo-hogbonu-founded",
    title: "Hogbonu: the lagoon city that Europeans called Porto-Novo",
    summary:
      "Founded by Gun people in the late sixteenth or seventeenth century, connected by tradition to migration from Allada, and known by three names at once — Hogbonu, Ajase and Porto-Novo.",
    description:
      "THE CITY AND ITS NAMES. HOGBONU to the Gun people who founded it. AJASE (Àjàṣẹ́) to Yoruba " +
      "speakers. PORTO-NOVO — 'new port' — to the Portuguese, and thereafter to the colonial and modern " +
      "state, which is why it is the name on maps. Three names for one place, belonging to three different " +
      "relationships with it, and the one that won is the one used by people who arrived by sea.\n\n" +
      "THE FOUNDATION TRADITION. A migration westward from the region of Allada in the sixteenth or " +
      "seventeenth century, associated with Te-Agbanlin, bringing a ruling group to the lagoon and " +
      "establishing the state that Europeans would call Little Ardra. It is the third strand of the " +
      "three-brothers tradition.\n\n" +
      "WHY ITS POSITION MATTERED. On the northern shore of a lagoon system connecting east to Lagos and " +
      "west along the coast, it sat where lagoon traffic, inland routes and Atlantic shipping met. It also " +
      "sat between two much larger powers — Dahomey to the west, Oyo and later Lagos to the east — which " +
      "shaped its politics for three centuries.\n\n" +
      "HOW THAT ENDED. A series of treaties with France: an agreement in the 1860s, a protectorate " +
      "confirmed in 1882 under King Toffa, and incorporation into the French colony of Dahomey and " +
      "dependencies in 1883. Porto-Novo's kings sought French protection AGAINST Dahomey — which is why " +
      "the French conquest of Dahomey a decade later was fought partly on behalf of an African ally, a " +
      "fact that fits badly into every simple version of the story.\n\n" +
      "THINGS TO ASK: What does it mean when a place has three names? Which one does a historian use, and " +
      "what does the choice carry?",
    category: "civilisation",
    subcategory: "Lagoon states",
    eventType: "historical",
    tags: ["kingdoms", "porto-novo", "hogbonu", "gun", "ogu", "lagoon", "colonialism", "naming"],
    people: ["Te-Agbanlin", "Toffa I"],
    civilisations: ["Hogbonu", "Gun"],
    locationName: "Porto-Novo (Hogbonu), southern Bénin",
    lat: 6.5,
    lng: 2.62,
    claims: [
      {
        sourceKey: "aja_oral_traditions_general",
        startYear: 1580,
        endYear: 1699,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The founding of Hogbonu",
        originalDateText: "The late sixteenth century, or the seventeenth, depending on the account",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHY THE RANGE SPANS MORE THAN A CENTURY: because the accounts do. Some place the arrival of " +
          "Te-Agbanlin's group in the late sixteenth century, others in the seventeenth, and the difference " +
          "is not resolved by anything documentary. Narrowing it would be choosing between traditions " +
          "without grounds.",
      },
      {
        sourceKey: "wikipedia_benin_navigation",
        startYear: 1882,
        startMonth: 4,
        startDay: 4,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The French protectorate over Porto-Novo under King Toffa",
        originalDateText: "4 April 1882",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: a treaty, with a documentary record on the French side. WHAT IT MEANT TO EACH " +
          "PARTY IS NOT THE SAME THING: for France, a step in colonial acquisition; for Toffa, protection " +
          "against Dahomey. A treaty date is secure; a treaty's meaning is contested by definition.",
        notes: "NEEDS BETTER SOURCING: the exact date should be confirmed against the published treaty text.",
      },
    ],
  },

  {
    slug: "nikki-and-the-wasangari",
    title: "Nikki, the Baatombu and the Wasangari",
    summary:
      "In the north, Borgu was organised around Nikki, Bussa and Illo, ruled by a horse-borne warrior aristocracy whose traditions claim descent from a figure called Kisra.",
    description:
      "A DIFFERENT COUNTRY IN THE SAME BORDERS. Northern Bénin is not a variation on the south. It is drier " +
      "savanna, it faces the Niger rather than the Atlantic, its history runs with Hausaland, Borgu and the " +
      "Songhay world rather than with the slave coast, and Islam is present there centuries before it is a " +
      "factor in the south. A timeline of 'Bénin' that treats the north as background has silently made " +
      "Dahomey the country.\n\n" +
      "WHAT BORGU WAS. A set of connected kingdoms — Nikki, Bussa, Illo and others — spanning what is now " +
      "north-eastern Bénin and west-central Nigeria, whose rulers claimed close kinship with each other. " +
      "NIKKI is the principal centre on the Beninese side and the traditional capital of the BAATOMBU " +
      "(Bariba).\n\n" +
      "THE WASANGARI. A ruling warrior class, mounted, holding authority over the farming population. " +
      "Cavalry is the decisive fact: horses gave Borgu a military character quite unlike the infantry " +
      "warfare of the forest and southern savanna, and horses are also why this region's power sat where " +
      "the tsetse fly did not.\n\n" +
      "BORGU AND DAHOMEY. Borgu was never conquered by Dahomey. In the colonial period it was divided " +
      "between the French and British spheres, which is why Baatombu communities are today split between " +
      "two countries by a line drawn in Europe.\n\n" +
      "THINGS TO ASK: Why does the north of this country have a different history from the south? What " +
      "does a border do to a people?",
    category: "civilisation",
    subcategory: "Northern kingdoms",
    eventType: "historical",
    tags: ["kingdoms", "nikki", "bariba", "baatombu", "borgu", "northern-benin", "cavalry", "peoples"],
    civilisations: ["Borgu", "Baatombu"],
    locationName: "Nikki, north-eastern Bénin",
    lat: 9.94,
    lng: 3.21,
    claims: [
      {
        sourceKey: "borgu_kisra_tradition",
        startYear: 1400,
        endYear: 1499,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The establishment of the Borgu kingdoms including Nikki",
        originalDateText: "By the fifteenth century, Borgu comprised interconnected kingdoms centred at Bussa, Nikki and Illo",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "WHAT THIS DATE RESTS ON: king lists and traditions of descent, read together with the " +
          "suggestion that the Kisra legend commemorates an incursion of mounted warriors in this period. " +
          "IT IS A RECONSTRUCTION, not a documented foundation, and the fifteenth century is where several " +
          "independent lines of tradition converge rather than a year anybody recorded.",
        notes: "NEEDS SOURCE VERIFICATION for the king lists and for how the fifteenth-century figure is reached.",
      },
    ],
  },

  {
    slug: "kisra-legend-in-borgu",
    title: "The Kisra legend, and what it has been used for",
    summary:
      "Borgu's ruling traditions claim descent from Kisra, a figure said to have come from the east. What the legend says has changed with the political situation of those telling it — which is the finding.",
    description:
      "THE LEGEND. Ruling lineages in Borgu trace themselves to KISRA, a figure who came from the east — in " +
      "some tellings connected with Arabia and with opposition to the Prophet, in others simply an eastern " +
      "origin. His sons are named as the founders of the principal towns: Woru at Bussa, Shabi at Nikki, " +
      "Bio at Illo.\n\n" +
      "WHY IT IS RECORDED HERE AS A TRADITION AND NOT AS HISTORY. Nothing outside the tradition establishes " +
      "that Kisra existed. The name itself is generally connected to Khosrau, the title of Persian kings, " +
      "which is the sort of detail that suggests a story travelling and acquiring prestige along the way " +
      "rather than a memory of a person.\n\n" +
      "THE ACTUALLY INTERESTING FINDING. Scholarship on the Kisra legend in northern Borgu has shown that " +
      "the CONTENT OF THE TRADITION SHIFTS WITH THE POLITICAL CONTEXT of those who tell it. Emphasis on an " +
      "Islamic connection, on an eastern origin, on links between towns — these strengthen and weaken " +
      "depending on what the tellers' position requires. That is not a scandal. It is how oral traditions " +
      "work everywhere, and Borgu happens to be a place where it has been documented carefully enough to " +
      "see.\n\n" +
      "WHAT IT MIGHT STILL PRESERVE. A memory of horse-borne conquest from the east, which would fit the " +
      "Wasangari's cavalry aristocracy and has been suggested for the fifteenth century. That is an " +
      "interpretation of the legend, not the legend's own claim.\n\n" +
      "THINGS TO ASK: If a tradition changes, has it stopped being evidence? Evidence of what?",
    category: "history",
    subcategory: "Oral tradition",
    eventType: "traditional_account",
    identificationStatus: "modern_interpretation",
    tags: ["oral-knowledge", "borgu", "nikki", "bariba", "kisra", "legitimacy", "tradition", "northern-benin"],
    civilisations: ["Borgu", "Baatombu"],
    locationName: "Borgu, northern Bénin and western Nigeria",
    lat: 9.94,
    lng: 3.21,
    claims: [
      {
        sourceKey: "borgu_kisra_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "primordial",
        whatIsDated: "When Kisra came, in the tradition's own terms",
        originalDateText: "In the time of the ancestors; the tradition does not date itself",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHY THIS CLAIM CARRIES NO POSITION: because the tradition does not offer one. It places Kisra in " +
          "founding time — before the towns, at the origin of the ruling lines — which is a kind of " +
          "temporal statement that a year would misrepresent rather than clarify.",
      },
      {
        sourceKey: "borgu_kisra_tradition",
        startYear: 1400,
        endYear: 1499,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "proposed_correlation",
        whatIsDated: "The historical event the legend may commemorate, on a scholarly reading",
        originalDateText: "Likely commemorating an invasion and occupation of Borgu by horse-mounted warriors in the fifteenth century",
        datingMethod: "estimate",
        chronology: "conventional",
        evidence:
          "WHAT THIS IS: a historian's proposal that a legend preserves a real event in transformed form, " +
          "dated by the political geography the proposal requires rather than by anything in the legend. " +
          "WHY IT IS KEPT SEPARATE FROM THE TRADITION'S OWN CLAIM: because a scholarly reading of a story " +
          "and the story are two different sources, and merging them would put a modern date in an ancient " +
          "mouth.",
      },
    ],
  },

  {
    slug: "batammariba-and-the-tata-houses",
    title: "The Batammariba and their fortified houses",
    summary:
      "In the Atakora, Batammariba communities build the tower-houses known as tata somba. Their landscape in neighbouring Togo is a World Heritage site, and the architecture is itself a historical argument.",
    description:
      "WHAT THEY BUILD. The Batammariba — also called Somba, Tammari, Betammaribè — build tall earthen " +
      "houses with towers, granaries, enclosed terraces and a single controlled entrance: the buildings " +
      "known in French as tata somba. The house is a defensible unit, and it is also a religious one, with " +
      "the family's altars, its dead, its stores and its animals arranged in a plan that encodes how the " +
      "household is supposed to work.\n\n" +
      "WHY THE ARCHITECTURE IS AN ARGUMENT. A landscape of individually fortified houses is what you build " +
      "when danger is constant and comes from raiders rather than armies, and when there is no central " +
      "power offering protection. The Atakora's people were on the raiding frontier of larger states for " +
      "centuries, and stayed politically decentralised. The houses are evidence of both facts.\n\n" +
      "THE HERITAGE STATUS, AND ITS BORDER. KOUTAMMAKOU, the Batammariba landscape, was inscribed on the " +
      "World Heritage List — but the inscribed property lies in TOGO, while Batammariba communities and " +
      "the same architecture continue across the border in Bénin. The heritage line follows a colonial " +
      "line, not a cultural one.\n\n" +
      "WHAT THIS RECORD WILL NOT DO. Give a date for when the tradition began. No excavated sequence for " +
      "this architecture was found here. A building tradition that is alive is not thereby ancient, and not " +
      "thereby recent; without stratigraphy, the honest answer is that its beginning is not established.\n\n" +
      "THINGS TO ASK: What does a house tell you about the century it was built in? What has to be true " +
      "before people fortify every home?",
    category: "culture",
    subcategory: "Architecture",
    eventType: "historical",
    tags: ["architecture", "batammariba", "somba", "atakora", "northern-benin", "peoples", "heritage", "unesco"],
    people: ["Batammariba"],
    civilisations: ["Batammariba"],
    locationName: "Atakora, north-western Bénin, and Koutammakou, Togo",
    lat: 10.07,
    lng: 1.14,
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the tata building tradition began",
        originalDateText: "Not established. A living tradition with no excavated sequence known here",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHY NO DATE: earthen architecture is rebuilt continuously, and a standing house may be decades " +
          "old while the tradition behind it is much older. Dating the tradition needs excavation of " +
          "abandoned structures, and none was found reported here. A LIVING TRADITION IS NOT SELF-DATING.",
        notes:
          "NEEDS SOURCE VERIFICATION: if archaeological work on Batammariba settlement exists, it belongs " +
          "in this record and would replace this claim with a real one.",
      },
    ],
    media: [
      {
        url: commons("Tata Somba banner.jpg"),
        sourcePageUrl: commonsPage("Tata Somba banner.jpg"),
        fileName: "Tata Somba banner.jpg",
        caption:
          "A tata somba: the tower-house of the Batammariba, with its granaries, terrace and single controlled entrance. The plan is defensive and religious at once, which is what makes the architecture a historical argument as well as a dwelling.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Tata-somba-Kirche.jpg"),
        sourcePageUrl: commonsPage("Tata-somba-Kirche.jpg"),
        fileName: "Tata-somba-Kirche.jpg",
        caption:
          "A CHURCH built in the tata somba style. Not a traditional house: a Christian building borrowing the local form, which is evidence of how the architecture has been adopted and reused rather than of how it was traditionally lived in.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "ganvie-founding-tradition",
    title: "Ganvié: a town built on water, and the tradition of why",
    summary:
      "The Tofinu town on stilts in Lake Nokoué is explained by tradition as refuge from Dahomean slave raiding, on the grounds that the raiders would not follow onto the water.",
    description:
      "WHAT IS THERE. A large town of stilt houses standing in the shallow water of Lake Nokoué, north of " +
      "Cotonou, inhabited by Tofinu people, reached only by boat, living substantially by fishing.\n\n" +
      "THE TRADITION. That the Tofinu moved onto the water to escape raiding by Dahomey, and that they were " +
      "safe there because of a religious prohibition preventing the raiders from following onto the lake. " +
      "The name is commonly translated as something like 'we are saved' or 'community of the saved'.\n\n" +
      "HOW TO HOLD THIS. The tradition is widely told, including by the people of the town. It is also the " +
      "explanation given to every visitor, and a story that is told to outsiders for two centuries acquires " +
      "a polished shape. This dataset records it as a TRADITION with an identified social function, which " +
      "is not the same as doubting it.\n\n" +
      "WHAT MAKES IT PLAUSIBLE ANYWAY. Dahomey did raid for captives; the lagoon communities were exposed; " +
      "and a religious prohibition against pursuing onto water is the kind of specific detail that " +
      "traditions preserve well. What is missing is anything independent — a dated European reference to " +
      "the town's foundation, or archaeology on the lake bed.\n\n" +
      "THE HISTORY THIS RECORD POINTS AT. Slave raiding is usually recorded from the side of those doing it, " +
      "because they are the ones the Europeans were talking to. A settlement pattern created by fleeing is " +
      "evidence from the other side.\n\n" +
      "THINGS TO ASK: What does the map of where people live tell you about who was dangerous?",
    category: "history",
    subcategory: "Lagoon communities",
    eventType: "traditional_account",
    tags: ["ganvie", "tofinu", "lagoon", "slavery", "oral-knowledge", "settlement", "dahomey", "refuge"],
    civilisations: ["Tofinu"],
    locationName: "Ganvié, Lake Nokoué, southern Bénin",
    lat: 6.47,
    lng: 2.41,
    claims: [
      {
        sourceKey: "aja_oral_traditions_general",
        startYear: 1650,
        endYear: 1799,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The founding of Ganvié, as tradition places it",
        originalDateText: "During the period of Dahomean raiding, commonly placed in the seventeenth or eighteenth century",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHAT THIS DATE RESTS ON: the tradition's own attachment of the move to the era of Dahomean " +
          "raiding, which is itself a span rather than a moment. WHY THE RANGE IS WIDE: because the " +
          "raiding was, and because no independent date for the foundation was found here.",
        notes:
          "NEEDS SOURCE VERIFICATION for the earliest European mention of a stilt settlement on Lake " +
          "Nokoué, which would give a latest-by date and considerably improve this record.",
      },
    ],
    media: [
      {
        url: commons("The village of Ganvié on Lake Nokoué.jpg"),
        sourcePageUrl: commonsPage("The village of Ganvié on Lake Nokoué.jpg"),
        fileName: "The village of Ganvié on Lake Nokoué.jpg",
        caption:
          "Ganvié standing in the shallow water of Lake Nokoué. A modern photograph of a living town: it shows what the settlement pattern looks like, and it is not evidence for the tradition about why the pattern exists.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("La vie sur l'eau à Ganvié au Bénin.jpg"),
        sourcePageUrl: commonsPage("La vie sur l'eau à Ganvié au Bénin.jpg"),
        fileName: "La vie sur l'eau à Ganvié au Bénin.jpg",
        caption:
          "Daily life on the water at Ganvié. Fishing, transport and trade are all carried on by boat, which is the practical consequence of the choice the foundation tradition describes.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "benin-migration-chronology-debate",
    title: "How old are the migrations, really?",
    summary:
      "Foundation traditions across this region are dated by counting generations. Different assumptions about a generation's length move the answers by centuries, and there is no independent check.",
    description:
      "WHAT KIND OF RECORD IS THIS? A debate about method, which is where most of the real uncertainty in " +
      "this dataset's pre-1500 records actually lives.\n\n" +
      "HOW THESE DATES ARE MADE. A tradition preserves a list: this many rulers, or this many generations, " +
      "between the founding and now. A historian multiplies the count by an assumed average and subtracts " +
      "from a known date. That is the whole method for most of the pre-documentary chronology of this " +
      "region.\n\n" +
      "WHERE IT GOES WRONG. THE MULTIPLIER: estimates for an average reign or generation in West African " +
      "king lists have ranged from the high teens to the low thirties of years. Over fifteen generations " +
      "that is a spread of two hundred years. TELESCOPING: lists lose their middles, so long pasts shorten. " +
      "PADDING: lists also gain ancestors, because a longer line is a better claim. And COLLATERAL " +
      "SUCCESSION: brothers counted as generations stretch a chronology that did not actually pass through " +
      "them.\n\n" +
      "WHY THERE IS NO CHECK. Because the independent evidence is missing. Documents start in the sixteenth " +
      "century and are external and thin. The archaeology of this period in Bénin is not dense enough to " +
      "date a dynasty. So the traditional chronologies float, anchored only at the recent end.\n\n" +
      "WHAT THIS DATASET DOES ABOUT IT. Records traditional dates AS traditional, with wide ranges, marked " +
      "with the method that produced them — and never converts them silently into the same kind of number " +
      "as a radiocarbon date or a treaty date. On the interface they should not look alike, because they " +
      "are not alike.\n\n" +
      "THINGS TO ASK: If you multiply a remembered number by a guessed number, what have you got?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    tags: ["debate", "method", "chronology", "oral-knowledge", "migration", "genealogy", "dating"],
    locationName: "Southern and northern Bénin",
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "The reliability of generation-counted chronologies in this region",
        originalDateText: "Disputed as a method, not as a single date",
        datingMethod: "genealogy",
        chronology: "disputed",
        evidence:
          "WHY THIS CLAIM CARRIES NO POSITION: it is about how dates are made, not about when anything " +
          "happened. It is entered as a claim so that a reader following 'why this date?' on any " +
          "traditional chronology in this dataset can be brought here.",
        notes:
          "NEEDS SOURCE VERIFICATION and named participants. The generation-length problem is discussed at " +
          "length in the Africanist literature on chronology and this record should cite that discussion " +
          "rather than summarise it anonymously.",
      },
    ],
  },
];

export const BENIN_DEEP_PAST_LINKS: SeedEventLink[] = [
  {
    from: "lac-sele-rainforest-mid-holocene",
    to: "dahomey-gap-opens",
    relation: "precedes",
    viewpoint: "scientific",
    sourceKey: "salzmann_hoelzmann_dahomey_gap",
    note: "Two phases of one pollen sequence: the forest that was there, and its replacement.",
  },
  {
    from: "dahomey-gap-opens",
    to: "dahomey-gap-cause-debate",
    relation: "responds_to",
    viewpoint: "disputed",
    note: "The debate is about what caused the change recorded in the other event.",
  },
  {
    from: "sodohome-1-earliest-settlement",
    to: "sodohome-early-iron-spearhead",
    relation: "source_of",
    viewpoint: "archaeological",
    sourceKey: "merkyte_urbanizing_forest",
    note: "The spearhead comes out of this settlement; the claim made for it is separate from the settlement's own dating.",
  },
  {
    from: "sodohome-early-iron-spearhead",
    to: "west-african-early-iron-debate",
    relation: "evidence_for",
    viewpoint: "disputed",
    note: "Sodohomé's date is one of the claims the wider argument about early African iron has to accommodate.",
  },
  {
    from: "sodohome-1-earliest-settlement",
    to: "abomey-plateau-two-thousand-year-gap",
    relation: "precedes",
    viewpoint: "archaeological",
    note: "The gap begins where this settlement ends.",
  },
  {
    from: "abomey-plateau-two-thousand-year-gap",
    to: "sodohome-bohicon-second-settlement",
    relation: "precedes",
    viewpoint: "archaeological",
    note: "And ends where the second one begins.",
  },
  {
    from: "agongointo-underground-site-found-1998",
    to: "agongointo-function-debate",
    relation: "responds_to",
    viewpoint: "disputed",
    note: "The discovery is documented; what the site was for is not.",
  },
  {
    from: "three-brothers-tradition-allada-abomey-hogbonu",
    to: "porto-novo-hogbonu-founded",
    relation: "source_of",
    viewpoint: "oral_tradition",
    sourceKey: "aja_oral_traditions_general",
    note: "Hogbonu's foundation account is the third strand of the three-brothers tradition.",
  },
  {
    from: "oral-tradition-is-evidence-but-not-a-transcript",
    to: "benin-migration-chronology-debate",
    relation: "related",
    note: "The method record and the debate about what the method produces.",
  },
  {
    from: "allada-in-portuguese-records-1539",
    to: "arada-people-in-the-americas-1560s",
    relation: "precedes",
    viewpoint: "historical",
    sourceKey: "law_rise_of_dahomey_historiography",
    note: "A kingdom enters the European record, and within a generation people from it are being sold across the Atlantic.",
  },
];
