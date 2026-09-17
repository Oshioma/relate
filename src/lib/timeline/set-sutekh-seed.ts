// SET / SETH / SUTEKH: FIVE THOUSAND YEARS OF A CHANGING GOD.
//
// WHAT THIS DATASET IS FOR. To show that Set has not had one meaning — and to
// show it from the objects, not from a story with objects hung on it.
//
// THE RULE THAT GOVERNS EVERY RECORD. Two questions, kept apart, always:
//
//   1. WHEN IS THIS FROM?          a date claim, as everywhere in this timeline
//   2. WHY DO WE THINK IT IS SET?  an identification, which is a different
//                                  question with a different answer and its
//                                  own degrees of doubt
//
// A Naqada I potsherd can be securely dated, securely provenanced and held in
// a named museum, and still be only POSSIBLY a Set animal. Most popular
// writing about Set collapses those two questions, which is how a strange
// quadruped from 3800 BCE becomes evidence that Set was worshipped then.
//
// WHAT THIS DATASET WILL NOT DO.
//   - Call Set the Egyptian Satan. He spends most of Egyptian history as a
//     royal and protective god, and spears the enemy of the sun.
//   - Give a date for when "Set became evil". There is no such date. There is
//     a long, uneven, regionally varied change, and several records for it.
//   - Read later evidence backwards. Plutarch is a Greek writing around 100 CE,
//     roughly three thousand years after the earliest material here, and his
//     account is evidence about Plutarch.
//   - Fill the gap between the end of the documented ancient cult and the
//     modern revivals. Nothing here demonstrates an unbroken lineage, and the
//     gap has a record of its own so it cannot be quietly closed.
//
// ON IMAGES, AND THE RULE THEY ARE UNDER. The pictures here were supplied with
// their file pages, and each one carries the provenance a reader needs to check
// it: the file page, the holding institution where one is known, the accession
// number where there is one, when the IMAGE was made as against when its
// SUBJECT is from, and an identification status of its own.
//
// That last pair exists because of a live example. A file titled "Horus
// spearing Set", easily found and widely reused, is a MODERN ARTWORK MADE IN
// 2025. A file showing Set spearing Apep reproduces a Twenty-first Dynasty
// Book of the Dead scene. Image search presents the two identically. Both are
// in this dataset, labelled differently, and the contrast is the lesson: a
// caption is not provenance, and a picture of a thing is not evidence about
// the thing.
//
// Records with no picture have none because none was verified, not because
// none exists. The environment this file was written in cannot reach museum
// catalogues or archives, so every unillustrated record instead NAMES the
// objects and collections a reader should go to. Inventing an image URL would
// be worse than having no image.

import type { SeedEvent, SeedSource, SeedTrack } from "./seed-types";

export const SET_SUTEKH_ANCHOR_SLUG = "peribsen-set-above-the-serekh";

export const SET_SUTEKH_TRACK: SeedTrack = {
  name: "Set, Seth, Sutekh: how one god changed over five thousand years",
  slug: "set-sutekh",
  kind: "theme",
  color: "#8a5a2b",
};

const commons = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;
const commonsPage = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const SET_SUTEKH_SOURCES: SeedSource[] = [
  {
    key: "ucl_digital_egypt_peribsen",
    title: "King Peribsen",
    workTitle: "Digital Egypt for Universities",
    publisher: "University College London / Petrie Museum of Egyptian Archaeology",
    url: "https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/kingperibsen.html",
    sourceType: "website",
    notes:
      "AN INSTITUTIONAL SOURCE FOR THE CENTRAL FACT OF THIS DATASET. Cited for Peribsen placing the Seth " +
      "image where the Horus falcon belongs, for the seal impression UC 36828 in the Petrie Museum, for the " +
      "granodiorite stela from his tomb now in the British Museum, and for the observation that Khasekhemwy's " +
      "name is preceded by BOTH the falcon and the Set animal. NEEDS SOURCE VERIFICATION for the page's own " +
      "wording, which has not been read here — the facts above are as reported to this dataset.",
  },
  {
    key: "pyramid_texts",
    title: "The Pyramid Texts",
    reference: "Old Kingdom funerary corpus, inscribed from the late Fifth Dynasty onwards",
    sourceType: "religious_text",
    notes:
      "The oldest substantial body of Egyptian religious writing, carved inside royal pyramids at Saqqara. " +
      "Cited for what Set DOES in the earliest texts that discuss him at length — which includes violence " +
      "against Osiris and also a role in the king's ascent. NEEDS SOURCE VERIFICATION throughout: no " +
      "individual utterance is cited here by number, and that is the first thing a serious version of this " +
      "record should fix.",
  },
  {
    key: "coffin_texts",
    title: "The Coffin Texts",
    reference: "Middle Kingdom funerary corpus, painted on coffins",
    sourceType: "religious_text",
    notes:
      "The Middle Kingdom successor to the Pyramid Texts, written on coffins for non-royal owners. Cited for " +
      "the continuing development of the mythology. NEEDS SOURCE VERIFICATION for specific spells.",
  },
  {
    key: "four_hundred_year_stela",
    title: "The 400-Year Stela",
    reference: "Found at Tanis; erected under Ramesses II",
    sourceType: "historical_document",
    notes:
      "A royal stela commemorating a four-hundred-year era of Set/Sutekh. THE REASON IT MATTERS TO THIS " +
      "TIMELINE'S ARCHITECTURE: it carries two dates that must never be merged — when it was made, and what " +
      "it claims to commemorate. NEEDS SOURCE VERIFICATION for its museum location, its inscription and the " +
      "scholarly literature on what the four hundred years are counted from.",
  },
  {
    key: "tla_four_hundred_year_stela",
    title: "Stele mit dem Datum des Jahres 400 (Kairo JdE 60539)",
    workTitle: "Thesaurus Linguae Aegyptiae",
    publisher: "Berlin-Brandenburgische Akademie der Wissenschaften",
    reference: "Object HZGV3J42Y5FEDLP6WDSGQDU4PY; text after KRI II, 287-288, collated with a photograph",
    url: "https://tla.digital/object/HZGV3J42Y5FEDLP6WDSGQDU4PY",
    sourceType: "website",
    notes:
      "READ. The current scholarly transliteration of the stela, and the source of every transliteration on " +
      "this record. Its own header states that the text follows Kitchen, Ramesside Inscriptions II, 287-288, " +
      "COLLATED WITH A PHOTOGRAPH, and cites RITA II, 116-117 and RITANC II, 168-172. That matters: it means " +
      "the readings here descend from Kitchen even though Kitchen's own volumes were not opened.\n\n" +
      "WHERE IT DIFFERS FROM BREASTED, AND WHY BOTH ARE KEPT: the TLA parses the royal-style names in the " +
      "dating formula as SETH HIMSELF — Stẖ-ꜥꜣ-pḥ.tj, 'Seth great of strength', and Nbw.tj, 'the Ombite'. " +
      "Breasted in 1906 read them as the names of an otherwise unknown Hyksos king. The TLA reading is " +
      "current; Breasted's is superseded and is recorded as historiography rather than deleted.\n\n" +
      "ONE LIMITATION, STATED: the TLA gives German. The English on this record is rendered from that German " +
      "by this dataset and is marked as not a published English translation wherever it appears.",
  },
  {
    key: "breasted_records_iii",
    title: "Ancient Records of Egypt, Volume III: The Nineteenth Dynasty",
    author: "James Henry Breasted",
    reference: "Sections 538-542, pages 226-228; University of Chicago Press, 1906",
    url: "https://etana.library.vanderbilt.edu/sites/default/files/coretexts/14898.pdf",
    sourceType: "historical_document",
    publishedYear: 1906,
    notes:
      "READ. The oldest full English translation of the stela that is freely available, and the one most of " +
      "the popular literature ultimately descends from. Cited HERE FOR TWO DIFFERENT THINGS, which must not " +
      "be confused.\n\n" +
      "AS A TRANSLATION it is still usable and is quoted verbatim on this record: Seti's titulary and the " +
      "prayer to Seth are given in full and agree in substance with the modern reading.\n\n" +
      "AS AN INTERPRETATION IT IS SUPERSEDED. Breasted takes the royal titulary in the dating formula to " +
      "name a Hyksos ruler — 'Opehtiset' and 'Nubti' — and reads the date as the four-hundredth year of that " +
      "king's era. Current scholarship parses those as epithets of Seth. Breasted's own note records the " +
      "alternative. THIS DATASET DOES NOT REVIVE HIS READING and does not delete it either: it is where a " +
      "great deal of later writing came from, and a reader meeting that writing should be able to find out " +
      "where it started.\n\n" +
      "ONE MORE LIMITATION: at section 540 Breasted does not print the opening royal titulary at all. He " +
      "writes 'Full fivefold titulary' and moves on. So he cannot supply it, and the transliteration on this " +
      "record comes from the TLA instead.",
  },
  {
    key: "oeai_tell_el_daba",
    title: "Tell el-Dabʿa",
    workTitle: "Austrian Archaeological Institute, Cairo Branch",
    publisher: "Österreichische Akademie der Wissenschaften",
    url: "https://www.oeaw.ac.at/en/oeai/institute/branches/cairo/excavations-projects/tell-el-daba",
    sourceType: "website",
    notes:
      "READ. Cited for three things and NOT for a fourth.\n\n" +
      "CITED FOR: the secure identification of Tell el-Dabʿa as Avaris; the Hyksos capital dating of roughly " +
      "1640-1530 BCE; and the transport of monuments from Pi-Ramesses to Tanis after the abandonment of " +
      "Pi-Ramesses around 1100 BCE — which is why a stela set up near Avaris is found at Tanis.\n\n" +
      "NOT CITED FOR, and this is the important one: a securely dated temple of Seth in the Second " +
      "Intermediate Period stratum. That specific claim is the one an argument about the four-hundred-year " +
      "era most wants, and no excavation report establishing it was opened. General Avaris archaeology must " +
      "not be quietly upgraded into it.",
  },
  {
    key: "hope_kaper_2010",
    title: "Egyptian Interest in the Oases in the New Kingdom and a New Stela for Seth from Mut el-Kharab",
    author: "Colin A. Hope and Olaf E. Kaper",
    reference: "Pages 137-154; the stela described at 144-149, figures 4-7",
    url: "https://www.monash.edu/__data/assets/pdf_file/0018/2231604/Hope-Kaper.pdf",
    sourceType: "academic_paper",
    publishedYear: 2010,
    notes:
      "READ. The publication of the Ramesside sandstone stela carrying a hymn to Seth, and the source of the " +
      "transliteration, translation, measurements and findspot on that record. Cited also for the New " +
      "Kingdom royal material at Mut — the Thutmose III cartouche, the Horemheb blocks naming Amun-Re, the " +
      "Ramesses IV block — and for the Eighteenth Dynasty block reading mry nb wḥꜣt.\n\n" +
      "CITED PARTICULARLY FOR TWO LIMITS THE AUTHORS SET THEMSELVES, which are worth more here than any of " +
      "their positive findings. They could not date the paving in which the stela was reused. And on the " +
      "question this dataset most wants answered they write: 'Whether the two gods physically shared the " +
      "same temple building within this enclosure remains to be established' (p. 147).",
  },
  {
    key: "hope_warfe_2017",
    title: "The Proscription of Seth Revisited",
    author: "Colin A. Hope and Ashten R. Warfe",
    reference: "Pages 273-284, in the Ockinga festschrift; the conclusion quoted here is at 281",
    url: "https://www.monash.edu/__data/assets/pdf_file/0004/2231572/Ockinga-22-Hope-pp-273-284.pdf",
    sourceType: "academic_paper",
    publishedYear: 2017,
    notes:
      "READ, AND IT IS THE MOST IMPORTANT SOURCE ON THIS DATASET'S CENTRAL QUESTION. Cited for the " +
      "conclusion that the attack on Seth's image 'cannot be considered systematic or complete' (p. 281), " +
      "and for the reasoning behind it: that religious vilification and physical erasure are different " +
      "phenomena; that textual vilification is specific to its cult context; that damage to Seth is real but " +
      "selective and often accompanies damage to other signs; that some erasures may predate or postdate the " +
      "first millennium BCE; and that accessibility, reuse, visibility and WHICH ASPECT of Seth is shown all " +
      "affect what survives.\n\n" +
      "ALSO CITED FOR THE OVERWRITTEN DOORWAY BLOCK at Mut, which they take from Kaper 2001, and for their " +
      "argument that centrally supported oasis temples at Mut and Hibis make 'remote priests were merely " +
      "tolerated' an inadequate explanation.\n\n" +
      "WHAT THEY DO NOT PROVIDE, and the dataset must not invent: a table of ban dates by region. Their " +
      "model is contextual rather than cartographic.",
  },
  {
    key: "monash_mut_el_kharab",
    title: "Mut el-Kharab",
    workTitle: "Dakhleh Oasis Project",
    publisher: "Monash University",
    url: "https://www.monash.edu/arts/philosophical-historical-indigenous-studies/dakhleh-oasis-project/excavations/mut-el-kharab",
    sourceType: "website",
    notes:
      "READ. The excavating institution's own site summary. Cited for the enclosure dimensions, the " +
      "occupation sequence, the survival of mainly Late Period temple architecture, the ostraka beginning in " +
      "Dynasty XXV, and the Christian-period use of the site.\n\n" +
      "ONE DISCREPANCY PRESERVED RATHER THAN RESOLVED: this page gives the ancient Egyptian name as Mt/Mrt " +
      "while Hope and Warfe give Mjt. Both are recorded. A dataset that quietly picked one would be making " +
      "an editorial decision it has no basis for.",
  },
  {
    key: "mut_2013_season",
    title: "Mut al-Kharab: Field Season 2013",
    author: "Colin A. Hope",
    reference: "Section I; the decorated block naming Seth from trench 41",
    url: "https://www.monash.edu/__data/assets/pdf_file/0005/2060537/Report-on-the-Mut-al-Kharab-2013-excavations.pdf",
    sourceType: "academic_paper",
    notes:
      "READ. Cited for the reused decorated block from trench 41 naming Seth Great of Strength, found in " +
      "lower paving over an L-shaped mud-brick feature. Cited for the findspot and NOT for a date: a block " +
      "reused in paving is dated by the paving only if the paving is dated, and here it is not.",
  },
  {
    key: "leahy_greater_dakhleh_2010",
    title: "The date of the 'larger' Dakhleh stela (Oxford, Ashmolean 1894.107a)",
    author: "Anthony Leahy",
    workTitle: "Göttinger Miszellen",
    reference: "Volume 226 (2010)",
    sourceType: "academic_paper",
    publishedYear: 2010,
    notes:
      "CITED FROM ITS METADATA AND ABSTRACT; the article itself was NOT OPENED. Cited for the Ashmolean " +
      "accession number 1894.107a, which is verified, and for the stela's content being a water-rights or " +
      "property dispute settled through an ORACLE of Seth. NEEDS SOURCE VERIFICATION for the date: the " +
      "article is specifically a redating study, so the association with Shoshenq I that circulates widely " +
      "is exactly what it examines, and this dataset does not know its conclusion.",
  },
  {
    key: "janssen_smaller_dakhleh_1968",
    title: "The Smaller Dakhla Stela",
    author: "J. J. Janssen",
    workTitle: "Journal of Egyptian Archaeology",
    reference: "Volume 54 (1968), pages 165-172, plate 25",
    sourceType: "academic_paper",
    publishedYear: 1968,
    notes:
      "CITED AT SECOND HAND AND NOT OPENED. The reference comes through Hope and Kaper 2010, page 147, note " +
      "42. Everything this dataset says about the Smaller Dakhleh Stela — the attribution to Piye, Seth as " +
      "principal deity in the upper scene, the decree concerning Amun, and the priest titled God's Father of " +
      "Amun and Second Prophet of Seth — descends from that citation rather than from Janssen. NEEDS SOURCE " +
      "VERIFICATION throughout, and the plate is the thing most worth having: the determinative comparison " +
      "with the Greater Stela cannot be made without it.",
  },
  {
    key: "plutarch_isis_osiris",
    title: "On Isis and Osiris",
    author: "Plutarch",
    reference: "Greek, about the late first or early second century CE",
    sourceType: "historical_document",
    notes:
      "THE MOST INFLUENTIAL AND MOST MISUSED SOURCE ON EGYPTIAN MYTH. A Greek priest of Delphi writing in " +
      "Greek, for Greeks, roughly three thousand years after the earliest material in this dataset, " +
      "identifying Set with Typhon throughout. Cited as EVIDENCE ABOUT GRECO-ROMAN RECEPTION, never as a " +
      "description of Egyptian religion in any earlier period. Much of the popular picture of Set descends " +
      "from this text rather than from Egyptian sources.",
  },
  {
    key: "temple_of_set_primary",
    title: "Temple of Set: its own accounts of its founding",
    reference: "Founded 1975",
    sourceType: "religious_text",
    notes:
      "Cited for what the organisation says about itself, which is the right way to source a religious " +
      "movement's own claims. Kept strictly separate from the documented civil fact of its founding. NEEDS " +
      "SOURCE VERIFICATION against the organisation's own publications and against independent accounts.",
  },
  {
    key: "chester_beatty_i",
    title: "The Contendings of Horus and Seth",
    workTitle: "Papyrus Chester Beatty I",
    reference: "Twentieth Dynasty; from Deir el-Medina; Chester Beatty Library, Dublin",
    sourceType: "religious_text",
    notes:
      "THE LONGEST CONTINUOUS NARRATIVE ABOUT SET THAT SURVIVES FROM EGYPT ITSELF, and the corrective to " +
      "reading Plutarch as though it were Egyptian. Cited for the eighty-year lawsuit between Horus and Set " +
      "before the tribunal of the gods, and for the story's tone, which is closer to comedy than to scripture. " +
      "NEEDS SOURCE VERIFICATION: the papyrus has not been read here in any edition, and no passage below is " +
      "quoted. A serious version of these records cites Gardiner's edition or Lichtheim's translation by page.",
  },
  {
    key: "egyptian_hittite_treaty",
    title: "The Egyptian-Hittite peace treaty",
    reference:
      "Year 21 of Ramesses II; Egyptian versions at Karnak and the Ramesseum, Akkadian tablets from Hattusa",
    sourceType: "historical_document",
    notes:
      "THE EARLIEST SURVIVING PARITY TREATY BETWEEN TWO GREAT POWERS, preserved from BOTH sides — which is " +
      "what makes it unusual and what makes it useful here. Cited for Sutekh appearing among the divine " +
      "witnesses, a role that has nothing to do with evil and everything to do with being a god whose oath " +
      "binds. NEEDS SOURCE VERIFICATION for the wording of the witness list and for which Sutekh or Sutekhs " +
      "of which places appear in it, a detail this record does not pretend to have checked.",
  },
  {
    key: "greek_magical_papyri",
    title: "The Greek Magical Papyri",
    reference: "Papyri Graecae Magicae; Greco-Roman Egypt, roughly the second century BCE to the fifth CE",
    sourceType: "historical_document",
    notes:
      "A body of working magical texts from Greco-Roman Egypt, in Greek, Demotic and Coptic. Cited for the " +
      "invocation of Set under the name Typhon-Seth, which is where the Egyptian god and the Greek monster " +
      "have already fused into a single addressable power. NEEDS SOURCE VERIFICATION for individual spells; " +
      "no PGM number is cited below, and that is the gap to close first.",
  },
  {
    key: "crowley_equinox_of_the_gods",
    title: "The writings around the 1904 reception of Liber AL vel Legis",
    author: "Aleister Crowley",
    reference: "Cairo, April 1904; published and re-published by Crowley across several decades",
    sourceType: "religious_text",
    notes:
      "Cited ONLY as evidence about modern Western occultism, never as evidence about Egyptian religion. " +
      "Crowley's Egypt is filtered through Victorian Egyptology, Greco-Roman sources and his own system, and " +
      "the identifications he makes between Egyptian gods and the figures of his Aeon are his. NEEDS SOURCE " +
      "VERIFICATION throughout: nothing here is quoted, and the relationship between Set, Horus and Crowley's " +
      "'Aeon of Horus' is stated far too confidently in most secondary writing, including much that is hostile.",
  },
];

export const SET_SUTEKH_EVENTS: SeedEvent[] = [
  // -------------------------------------------------------------------------
  // PREDYNASTIC: WHERE THE EVIDENCE IS WEAKEST AND THE CLAIMS ARE LOUDEST
  // -------------------------------------------------------------------------
  {
    slug: "predynastic-possible-set-animals",
    title: "Strange animals on Predynastic pottery",
    summary:
      "c. 4000-3500 BCE. Naqada I material shows creatures sometimes called Set animals. Whether any of them is Set is genuinely open, and this record is mostly about why.",
    description:
      "WHAT KIND OF RECORD IS THIS? The weakest evidence in the dataset, given the most careful handling, " +
      "because it is the material most often oversold.\n\n" +
      "WHAT SURVIVES. Predynastic Egyptian pottery, ivories and carved objects carry animals: real ones, " +
      "stylised ones, and some that do not correspond to any living species. Among these are quadrupeds with " +
      "long snouts, upright squared-off ears and stiff forked tails, which are the features later Egyptian art " +
      "uses for the creature written with Set's name.\n\n" +
      "WHY THAT IS NOT ENOUGH. Three problems, and they compound.\n\n" +
      "FIRST, no Predynastic object names anything. There is no writing to check the picture against. Every " +
      "identification is made by looking at an animal and deciding what it resembles, from a distance of five " +
      "thousand years and with a later convention in mind.\n\n" +
      "SECOND, the later convention is exactly what may be doing the work. If a scholar knows what a Dynastic " +
      "Set animal looks like and then sorts Predynastic beasts by resemblance to it, the resemblance is " +
      "guaranteed and proves nothing. This is not a hypothetical criticism; it is the standard difficulty of " +
      "reading early iconography backwards.\n\n" +
      "THIRD, Predynastic art contains several fantastic animals that nobody has identified with any later god, " +
      "so 'not a real species' does not narrow it to Set.\n\n" +
      "WHAT WOULD CHANGE IT. An early object where the creature appears with a name, or in a context that only " +
      "Set could occupy. That is what makes the Second Dynasty serekhs decisive and this material not.\n\n" +
      "THE HONEST POSITION. Some of these animals may well be ancestral to the Set animal. Nothing here " +
      "demonstrates it, and this record does not choose. It is filed as POSSIBLE, which is a situation and not " +
      "a score.\n\n" +
      "THINGS TO ASK: If you sort ancient pictures by how much they resemble a later picture, what have you " +
      "discovered? What would an identification need in order to be more than a resemblance?",
    category: "archaeology",
    subcategory: "Predynastic Egypt",
    eventType: "disputed",
    identificationStatus: "possible",
    tags: ["set", "predynastic", "naqada", "disputed-identification", "iconography"],
    civilisations: ["Predynastic Egypt"],
    locationName: "Upper Egypt",
    claims: [
      {
        sourceKey: null,
        startYear: -3999,
        endYear: -3499,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Naqada I material in question",
        originalDateText: "c. 4000-3500 BCE (Naqada I / Amratian)",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        evidence:
          "WHAT IS DATED: the objects, by ceramic sequence and archaeological context. THIS DATE IS NOT THE " +
          "DISPUTED PART. Predynastic chronology is reasonably well controlled; what is disputed is what the " +
          "animals ARE, which is a separate claim below and is the reason this record exists.",
        notes:
          "NEEDS SOURCE VERIFICATION for the specific objects, their excavation contexts and their museum " +
          "numbers. This record currently describes a class of material rather than citing items, which is the " +
          "honest state of it and not good enough for long.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether any of these animals is the Set animal",
        originalDateText: "Open. No Predynastic object names the creature it depicts",
        datingMethod: "textual_interpretation",
        chronology: "archaeological",
        evidence:
          "WHAT IS PROPOSED: that some Naqada I creatures are early forms of the Set animal. WHAT SUPPORTS IT: " +
          "shared features — long down-curved snout, squared upright ears, stiff raised tail — with the later " +
          "securely identified creature. WHAT UNDERMINES IT: the features are the criteria by which the objects " +
          "were selected, so the match is circular; no Predynastic object carries writing; and Predynastic art " +
          "has other fantastic animals with no later identification. WHY THIS CLAIM CARRIES NO DATE: it is not " +
          "a claim about when anything happened. It is a claim about what a picture shows, and it is recorded " +
          "as unresolved.",
        notes:
          "NEEDS SOURCE VERIFICATION, and specifically: who has argued each side, in print, and on what " +
          "grounds. A version of this record naming the scholars would be far more useful than one describing " +
          "the argument in the abstract.",
      },
    ],
  },

  {
    slug: "nubt-ombos-set-cult-centre",
    title: "Nubt, Ombos, and the difference between a cult centre and its beginning",
    summary:
      "Naqada's ancient town is Set's great Upper Egyptian cult centre in historic times. That is not the same as evidence that he was worshipped there in the Predynastic.",
    description:
      "WHAT KIND OF RECORD IS THIS? A distinction, given a record of its own because it is constantly " +
      "collapsed.\n\n" +
      "WHAT IS WELL ESTABLISHED. Nubt — Greek Ombos, beside modern Naqada in Upper Egypt — is a major centre " +
      "of Set's cult in the historic period. His epithet 'Lord of Ombos' (Nubti) ties him to it, and the " +
      "association is not in doubt.\n\n" +
      "WHAT IS NOT ESTABLISHED. That Set was worshipped there in 3500 BCE. Naqada is also one of the richest " +
      "Predynastic sites in Egypt, which is why it gives its name to the whole cultural sequence. Those two " +
      "facts sit on top of each other and get multiplied together: a place with important Predynastic remains, " +
      "and a place that is later Set's town, becomes 'Set worshipped at Naqada since the Predynastic'. The " +
      "second does not follow from the first.\n\n" +
      "THE SENTENCE THIS RECORD EXISTS TO PREVENT. 'The temple of Set was founded at Nubt in 3500 BCE.' " +
      "Nothing in this dataset supports it. A cult centre attested in the historic period is evidence for the " +
      "historic period.\n\n" +
      "WHAT WOULD ACTUALLY SETTLE IT. Predynastic cult material from the site that is identifiably Set's — " +
      "which runs straight back into the identification problem in the previous record, because Predynastic " +
      "objects do not carry names.\n\n" +
      "THINGS TO ASK: How would you demonstrate continuity of worship at a place across a thousand years? What " +
      "would count, and what would only look like it counted?",
    category: "archaeology",
    subcategory: "Cult geography",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "nubt", "ombos", "naqada", "cult-centre"],
    civilisations: ["Ancient Egypt"],
    locationName: "Nubt (Ombos), near Naqada, Upper Egypt",
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Set's cult at Nubt began",
        originalDateText: "Not established. Attested in the historic period; its origin is undated here",
        datingMethod: "textual_interpretation",
        chronology: "archaeological",
        evidence:
          "WHAT IS ESTABLISHED: that Nubt is Set's major Upper Egyptian cult centre in historic times, and that " +
          "his epithet Nubti, Lord of Ombos, attaches him to it. WHAT IS NOT ESTABLISHED: when that began. " +
          "WHY THE CLAIM IS POSITIONLESS RATHER THAN EARLY: giving it a Predynastic date would convert a " +
          "later attestation into an early one by assertion, which is the specific error this record exists to " +
          "block.",
        notes:
          "NEEDS SOURCE VERIFICATION for the earliest securely dated evidence of Set's cult at the site, which " +
          "is the number that should eventually replace this claim.",
      },
    ],
    media: [
      {
        url: commons(
          "Limestone_architectural_fragment._A_door_jamb,_part_of_a_doorway._From_the_temple_of_Seth_(which_was_built_by_Thutmosis_III)_at_Naqada,_Egypt._18th_Dynasty._The_Petrie_Museum.jpg"
        ),
        sourcePageUrl: commonsPage(
          "Limestone_architectural_fragment._A_door_jamb,_part_of_a_doorway._From_the_temple_of_Seth_(which_was_built_by_Thutmosis_III)_at_Naqada,_Egypt._18th_Dynasty._The_Petrie_Museum.jpg"
        ),
        caption:
          "Limestone door jamb from the temple of Seth at Naqada, built under Thutmose III, Eighteenth Dynasty. Held by the Petrie Museum. The temple at Set's great cult centre is a New Kingdom building — which is exactly why an Eighteenth Dynasty fragment cannot be used as evidence for Predynastic worship at the site.",
        kind: "image",
        shows: "artefact",
        institution: "Petrie Museum of Egyptian Archaeology, University College London",
        identificationStatus: "secure",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // EARLY DYNASTIC: WHERE THE IDENTIFICATION BECOMES SECURE
  // -------------------------------------------------------------------------
  {
    slug: "scorpion-macehead-standards",
    title: "The Scorpion Macehead and its standards",
    summary:
      "c. 3200-3000 BCE. A late Predynastic royal object carrying rows of standards topped with animals. Whether any is a Set animal is argued, and the object's own date is argued too.",
    description:
      "WHAT KIND OF RECORD IS THIS? An object with two live disputes running on it at once, which makes it a " +
      "good demonstration of why a timeline should keep dates and identifications apart.\n\n" +
      "THE OBJECT. A large ceremonial limestone macehead from Hierakonpolis, carved with a king wearing the " +
      "White Crown, and including registers of standards — poles topped with emblems and animals — of the kind " +
      "that appear on other late Predynastic and Early Dynastic royal objects.\n\n" +
      "DISPUTE ONE: THE DATE. It belongs to Naqada III, in the century or two before the First Dynasty, and " +
      "precise figures in the literature differ. That is ordinary for the period and is recorded as competing " +
      "date claims rather than averaged.\n\n" +
      "DISPUTE TWO: THE ANIMALS. Whether any standard carries a Set animal is a separate question from when " +
      "the macehead was made, and it has a different answer with different reasons. Standards of this kind " +
      "carry various creatures and emblems, and identifying them individually depends on carving that is worn, " +
      "small and schematic.\n\n" +
      "WHY THE TWO DISPUTES MUST NOT BE MERGED. Because a reader told simply that 'the Scorpion Macehead shows " +
      "Set around 3200 BCE' has been given one confident sentence built from two uncertain ones. Click-through " +
      "on 'why this date?' and 'why is this Set?' should produce different answers, and in this dataset they " +
      "do.\n\n" +
      "THINGS TO ASK: If an object's date is argued and its imagery is argued, how confident can any statement " +
      "combining both be? Which of the two would you want settled first?",
    category: "archaeology",
    subcategory: "Late Predynastic",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["set", "scorpion-macehead", "hierakonpolis", "naqada-iii", "standards", "disputed-identification"],
    civilisations: ["Ancient Egypt"],
    locationName: "Hierakonpolis, Upper Egypt",
    claims: [
      {
        sourceKey: null,
        startYear: -3199,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "When the macehead was made — the earlier figure in circulation",
        originalDateText: "c. 3200 BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS CLAIMED: about 3200 BCE, on Naqada III archaeological grounds. WHY IT IS ONE CLAIM AND NOT " +
          "THE DATE: the literature also carries figures a century later, and this dataset has no basis for " +
          "choosing. Both are recorded so a reader can see the width of the disagreement.",
        notes: "NEEDS SOURCE VERIFICATION for who proposes this figure and on what basis.",
      },
      {
        sourceKey: null,
        startYear: -3099,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "When the macehead was made — the later figure in circulation",
        originalDateText: "c. 3100 BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS CLAIMED: about 3100 BCE. WHY BOTH ENDS ARE HERE: a century of disagreement on an object of " +
          "this importance is worth seeing, and a midpoint would be a number nobody actually proposes.",
        notes: "NEEDS SOURCE VERIFICATION, as above.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether any standard on the macehead carries a Set animal",
        originalDateText: "Argued. The carving is small, worn and schematic",
        datingMethod: "textual_interpretation",
        chronology: "archaeological",
        evidence:
          "WHAT IS AT ISSUE: the identification of individual animals on standards, not the date of the object. " +
          "WHAT MAKES IT HARD: scale, wear and schematic carving, on emblems whose conventions are only partly " +
          "understood. WHY IT IS A SEPARATE CLAIM: 'when was this made' and 'what is that animal' are different " +
          "questions with different evidence, and the interface should make a reader ask them separately.",
        notes:
          "NEEDS SOURCE VERIFICATION. The museum holding the macehead and the published archaeological drawings " +
          "are where this should be settled; neither has been consulted here.",
      },
    ],
  },

  {
    slug: "peribsen-set-above-the-serekh",
    title: "Peribsen puts Set above the royal name",
    summary:
      "Second Dynasty, c. 28th century BCE. A king replaces the Horus falcon over his serekh with the Set animal. This is where the identification stops being arguable.",
    description:
      "WHAT KIND OF RECORD IS THIS? The anchor of the dataset, and the point at which Set becomes visible " +
      "beyond argument.\n\n" +
      "WHAT A SEREKH IS, BECAUSE THE FORCE OF THIS DEPENDS ON IT. Early Egyptian kings wrote one of their names " +
      "inside a rectangular panel representing the palace façade, with the falcon of Horus perched on top. The " +
      "falcon is not decoration. It says the king is the earthly Horus. It is as fixed a convention as Egyptian " +
      "royal art has.\n\n" +
      "WHAT PERIBSEN DID. He replaced the falcon with the Set animal. The creature stands where Horus stands, " +
      "over the king's own name, on his own monuments — on stone vessels, on seal impressions, in inscriptions " +
      "from his tomb complex at Umm el-Qaab at Abydos.\n\n" +
      "WHY THIS SETTLES THE IDENTIFICATION. Not because the animal looks like anything. Because of where it is. " +
      "A creature occupying the falcon's position over a royal serekh can only be the god who stands opposite " +
      "Horus in Egyptian kingship, and the inscriptions are writing, in a period with writing. This is the " +
      "difference between a Naqada I potsherd and a Second Dynasty king's titulary, and it is a difference of " +
      "kind rather than of degree.\n\n" +
      "WHAT IT MEANS, WHICH IS NOT SETTLED. Explanations offered include religious change, a split in the " +
      "kingdom, a southern power base, a dynastic dispute, and a deliberate theological statement whose content " +
      "we cannot recover. These are scholarly proposals. This dataset records that they exist and does not " +
      "pick one, because the evidence is a handful of inscriptions and the proposals are considerably larger " +
      "than that.\n\n" +
      "WHAT MUST NOT BE DONE HERE. The temptation is to narrate a war between the followers of Horus and the " +
      "followers of Set. It makes a wonderful story and the evidence for it is thin. Any such reconstruction " +
      "belongs in this record as an attributed theory, never as the description of what happened.\n\n" +
      "THINGS TO ASK: What does it take to change the god over your own name? If we cannot recover why, what " +
      "can we still say with confidence?",
    category: "archaeology",
    subcategory: "Second Dynasty",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "peribsen", "serekh", "second-dynasty", "abydos", "kingship"],
    civilisations: ["Ancient Egypt"],
    locationName: "Umm el-Qaab, Abydos, Egypt",
    people: ["Peribsen"],
    claims: [
      {
        sourceKey: null,
        startYear: -2799,
        endYear: -2700,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Peribsen's reign",
        originalDateText: "Second Dynasty, about the 28th century BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: a reign, placed within the Second Dynasty. WHY IT IS A RANGE: Early Dynastic absolute " +
          "chronology is built from king lists, regnal counts and archaeology, and carries real uncertainty — " +
          "commonly a century or more at this depth. The identification below is far more secure than the date, " +
          "which is the reverse of the usual situation in this dataset.",
        notes: "NEEDS SOURCE VERIFICATION against a current Early Dynastic chronology.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the animal over Peribsen's serekh is Set",
        originalDateText: "Secure. The creature occupies the Horus falcon's position over the royal name",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHAT IS ESTABLISHED: that the Set animal stands over Peribsen's serekh in place of the Horus falcon, " +
          "on his own monuments. WHY THIS IS SECURE WHERE THE PREDYNASTIC MATERIAL IS NOT: the identification " +
          "rests on POSITION AND WRITING rather than on resemblance. Nothing else can stand in the falcon's " +
          "place. WHAT IS NOT ESTABLISHED, and must not be smuggled in with it: why he did it.",
        notes:
          "Partly verified: the Petrie Museum seal impression UC 36828 and the granodiorite stela from his tomb " +
          "now in the British Museum are named by UCL's Digital Egypt. NEEDS SOURCE VERIFICATION for the wider " +
          "corpus of stone vessels and Umm el-Qaab material.",
      },
    ],
    media: [
      {
        url: commons("Seal_impression_Peribsen.jpg"),
        sourcePageUrl: "https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/kingperibsen.html",
        caption:
          "Seal impression naming Peribsen, Petrie Museum UC 36828. The Set animal stands over the royal name in the place the Horus falcon occupies on every conventional serekh — which is what makes this identification secure rather than a matter of resemblance.",
        kind: "image",
        shows: "artefact",
        institution: "Petrie Museum of Egyptian Archaeology, University College London",
        accessionNumber: "UC 36828",
        identificationStatus: "secure",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "khasekhemwy-horus-and-set",
    title: "Khasekhemwy puts Horus and Set together",
    summary:
      "Second Dynasty, c. 27th century BCE. Both animals stand over one king's name at once — the clearest ancient statement that these two gods belong together.",
    description:
      "WHAT KIND OF RECORD IS THIS? The other half of the Second Dynasty evidence, and the image this dataset " +
      "would put beside Peribsen's if it could.\n\n" +
      "WHAT IT SHOWS. Khasekhemwy's serekh carries the Horus falcon AND the Set animal together above the royal " +
      "name. Not Horus replaced, as with Peribsen. Both, at once.\n\n" +
      "WHY IT MATTERS MORE THAN THE STORY USUALLY TOLD ABOUT IT. The familiar reading is reconciliation: " +
      "Peribsen's rupture, then Khasekhemwy healing it, the two halves of a divided kingdom rejoined. It is a " +
      "satisfying narrative and it rests on very little. What the object shows is the pairing. The politics " +
      "behind the pairing is inference, and it should be labelled as inference.\n\n" +
      "WHAT IS SOLID, AND IS ENOUGH TO BE GOING ON WITH. Egyptian kingship pairs Horus and Set structurally, " +
      "for most of its history — two gods in tension who together constitute the completeness of the realm. " +
      "That is visible in temple scenes for two thousand years afterwards, in the binding of the Two Lands, in " +
      "coronation and purification scenes. Khasekhemwy's serekh is an early, explicit instance of a pattern " +
      "that turns out to be fundamental rather than a one-off political gesture.\n\n" +
      "THE COMPARISON THIS DATASET WANTS A READER TO SEE. Peribsen: Set alone, where Horus should be. " +
      "Khasekhemwy: both. Two kings, two adjacent reigns, two different statements about the same pair of " +
      "gods — and no surviving text from either explaining himself.\n\n" +
      "THINGS TO ASK: Is a pairing evidence of a conflict resolved, or of a pairing? What would distinguish " +
      "those in the archaeological record?",
    category: "archaeology",
    subcategory: "Second Dynasty",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "khasekhemwy", "horus", "serekh", "second-dynasty", "kingship"],
    civilisations: ["Ancient Egypt"],
    locationName: "Abydos and Hierakonpolis, Egypt",
    people: ["Khasekhemwy"],
    claims: [
      {
        sourceKey: null,
        startYear: -2699,
        endYear: -2600,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Khasekhemwy's reign",
        originalDateText: "Second Dynasty, about the 27th century BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the last reign of the Second Dynasty, placed by king lists and archaeology with the " +
          "usual Early Dynastic uncertainty.",
        notes: "NEEDS SOURCE VERIFICATION against a current chronology.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "What the double serekh means politically",
        originalDateText: "The pairing is on the object; the politics behind it is inference",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHAT IS ON THE OBJECT: both animals over one name. WHAT IS INFERRED: reconciliation after a schism, " +
          "the reunification of a divided kingdom, the end of a dynastic conflict. WHY THE INFERENCE IS KEPT " +
          "SEPARATE: no text from the period explains it, and the same image is equally consistent with a " +
          "structural pairing of the two gods that had nothing to do with any quarrel. The reading may well be " +
          "right. It is not what the object says.",
        notes:
          "NEEDS SOURCE VERIFICATION for the scholarly positions, which should be named and attributed rather " +
          "than summarised as 'the familiar reading'.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SET AS DEFENDER: THE HALF OF HIS CAREER THAT GETS FORGOTTEN
  // -------------------------------------------------------------------------
  {
    slug: "set-spears-apep",
    title: "Set spears Apep from the solar barque",
    summary:
      "For most of Egyptian history Set stands in the prow of Ra's boat and kills the serpent that threatens the sun. This is not a minor role. It is his job.",
    description:
      "WHAT KIND OF RECORD IS THIS? The single image most likely to change a reader's mind about Set.\n\n" +
      "WHAT IT SHOWS. Ra travels through the night in his barque. Apep — Apophis — the serpent of " +
      "non-existence, attacks the boat and must be driven off every night or the sun does not rise. The god " +
      "who does the driving off, again and again in Egyptian religious art, is Set. Spear in hand, in the " +
      "prow, killing the enemy of order on behalf of the creator.\n\n" +
      "WHY THIS DEMOLISHES THE EASY STORY. A figure described as 'the Egyptian Satan' cannot also be the god " +
      "who defends the sun from annihilation nightly, at the request of the supreme god, in official religious " +
      "imagery, for centuries. Both are in the record. The resolution is not that one is wrong; it is that Set " +
      "is a god of force and disruption, and force pointed outward at chaos is exactly what the solar barque " +
      "requires.\n\n" +
      "SET IS NOT 'GOOD' HERE EITHER. He is dangerous, and that is the point of him. The Egyptians did not " +
      "think the answer to a monster was a gentle god. What changes over time is not Set's nature but whether " +
      "that dangerousness is pointed outwards, at Apep, or inwards, at Osiris.\n\n" +
      "THE COMPARISON THIS DATASET IS BUILT AROUND. Hold this image beside the Edfu reliefs of Horus spearing " +
      "Set, and the whole question of the dataset appears in two pictures: HOW DOES THE GOD HOLDING THE SPEAR " +
      "BECOME THE THING ON THE END OF IT? That question does not have a one-sentence answer and this dataset " +
      "does not give it one.\n\n" +
      "THINGS TO ASK: If a god's role reverses, has the god changed, or has what the culture needed from him " +
      "changed? Which would leave traces, and what would they look like?",
    category: "religion",
    subcategory: "Mythology and cult",
    eventType: "religious_account",
    identificationStatus: "secure",
    tags: ["set", "apep", "apophis", "ra", "solar-barque", "protective"],
    civilisations: ["Ancient Egypt"],
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "How long Set held the protective role",
        originalDateText: "Attested across much of pharaonic history; no single date applies",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "WHAT IS ESTABLISHED: that Set defending the solar barque is a standard motif of Egyptian " +
          "religious art and text over a long span. WHY THE CLAIM CARRIES NO DATE: it is not an event. It is " +
          "a role, held for centuries, and pinning it to a year would misrepresent what kind of thing it " +
          "is.\n\n" +
          "ONE FIXED POINT NOW EXISTS, AND IT IS TEXTUAL. The 400-Year Stela — a dated royal monument of " +
          "Ramesses II — hails Seth as 'great in strength in the barque of millions of years, overthrowing " +
          "enemies in front of the barque of Re' (Breasted 1906, section 542). That is this role asserted on " +
          "a king's stela in the thirteenth century BCE, not inferred from a vignette. See the " +
          "four-hundred-year-stela record, where the passage is given in transliteration and in two " +
          "translations.\n\n" +
          "WHAT THAT PASSAGE DOES NOT DO, AND THE DISTINCTION IS THE POINT: it does not name Apep. It says " +
          "'enemies'. So it evidences SET IN THE PROW DEFENDING RE; it does not evidence the Apep combat " +
          "specifically, and this record must not borrow the stela's authority for the serpent's name.",
        notes:
          "STILL NEEDS SOURCE VERIFICATION for the chronological range of the motif — the earliest and " +
          "latest securely dated examples, which would turn a role into a span. The stela supplies one dated " +
          "attestation in the middle of it, which is a beginning and not the answer.",
      },
    ],
    media: [
      {
        url: commons("Set_speared_Apep.jpg"),
        sourcePageUrl: commonsPage("Set_speared_Apep.jpg"),
        caption:
          "Set spearing the serpent Apep as Ra looks on, from the Book of the Dead of Lady Cheritwebeshet, Twenty-first Dynasty; the original is associated with the Egyptian Museum, Cairo. The god later cast as the enemy of order is here its defender.",
        kind: "image",
        shows: "manuscript",
        institution: "Egyptian Museum, Cairo (original object)",
        imageDate: "Twenty-first Dynasty (object)",
        identificationStatus: "secure",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "horus-and-set-together-kingship",
    title: "Horus and Set together, holding up the kingship",
    summary:
      "Crowning the king, purifying him, binding the Two Lands. For two thousand years Egyptian art shows these two as a pair, not as a winner and a loser.",
    description:
      "WHAT KIND OF RECORD IS THIS? The structural fact that the famous rivalry is usually reported without.\n\n" +
      "WHAT THE SCENES SHOW. Horus and Set flanking the king and crowning him. Pouring purifying water over " +
      "him. Standing either side of the sema-tawy, the emblem of the binding together of Upper and Lower Egypt, " +
      "each tying a plant around it. These are not rare or marginal images. They are official temple art, " +
      "repeated across dynasties, including under Ramesses III.\n\n" +
      "WHAT IT MEANS. Egyptian kingship is not Horus defeating Set. It is Horus AND Set — two forces in " +
      "tension whose combination is what a complete realm requires. The king is legitimate because both " +
      "sanction him. Read that way, Khasekhemwy's double serekh two thousand years earlier stops being a " +
      "peace treaty and starts looking like an early statement of an idea that stayed put.\n\n" +
      "WHY THE RIVALRY STILL MATTERS. Because it is also real: the contendings of Horus and Set are genuine " +
      "Egyptian mythology, with violence and injury in them. The point is not that the conflict is invented. " +
      "It is that in Egyptian thought a pair can be in conflict AND constitutive at the same time, and a " +
      "modern reader who can only hold one of those at once will get Set wrong in whichever direction they " +
      "are pushed.\n\n" +
      "ON THE DRAWINGS. Some widely circulated versions of these scenes are modern line drawings, including " +
      "vector redrawings. Those are useful for seeing the composition and are NOT photographs of ancient " +
      "objects. Where this dataset can reach the original relief it should, and where it cannot it says so.\n\n" +
      "THINGS TO ASK: If two gods crown the king together, what work is the rivalry doing? Can a culture " +
      "believe both at once — and do we?",
    category: "religion",
    subcategory: "Kingship",
    eventType: "religious_account",
    identificationStatus: "secure",
    tags: ["set", "horus", "kingship", "sema-tawy", "two-lands", "ramesses-iii"],
    civilisations: ["Ancient Egypt"],
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "How long Horus and Set appear as a royal pair",
        originalDateText: "From the Early Dynastic serekhs to the New Kingdom and beyond; a pattern, not an event",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "WHAT IS ESTABLISHED: that joint Horus-and-Set imagery supporting kingship recurs over a very long " +
          "period, from Khasekhemwy's serekh to New Kingdom temple scenes. WHY NO DATE: it is a convention " +
          "with a long life, and the interesting fact is its persistence rather than any one instance.",
        notes: "NEEDS SOURCE VERIFICATION for the earliest and latest examples and for specific temple scenes.",
      },
    ],
    media: [
      {
        url: commons("Horus_and_Seth_crowning_Ramesses_III,_detail_of_Seth.JPG"),
        sourcePageUrl: commonsPage("Horus_and_Seth_crowning_Ramesses_III,_detail_of_Seth.JPG"),
        caption:
          "Detail of Set from a scene of Horus and Set crowning Ramesses III. Set is not being defeated here; he is conferring legitimacy, alongside Horus, on the reigning king.",
        kind: "image",
        shows: "artefact",
        identificationStatus: "secure",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
      {
        url: commons("Seth_%2B_Horus_%3D_2_terres.jpg"),
        sourcePageUrl: commonsPage("Seth_%2B_Horus_%3D_2_terres.jpg"),
        caption:
          "Horus and Set binding the Two Lands — the sema-tawy — each securing the emblem that represents Upper and Lower Egypt joined. The unity of the kingdom is shown as requiring both of them.",
        kind: "image",
        shows: "artefact",
        identificationStatus: "secure",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE TURN
  // -------------------------------------------------------------------------
  {
    slug: "set-image-obliterated",
    title: "Set's image, deliberately cut away",
    summary:
      "On some monuments Set's figure or name has been hacked out. That is physical evidence of hostility — but the damage is easier to see than to date or to explain.",
    description:
      "WHAT KIND OF RECORD IS THIS? The best physical evidence in the dataset for Set's changing reputation, " +
      "and a warning about how to read damage.\n\n" +
      "WHAT SURVIVES. Reliefs and inscriptions in which Set's animal head, figure or name has been removed — " +
      "chiselled away while the surrounding scene is left intact. A relief of Herihor with Set obliterated is " +
      "one circulated example.\n\n" +
      "WHY IT IS STRONG EVIDENCE. Selective damage is not weathering. When one figure in a scene is destroyed " +
      "and the rest survives, somebody chose. That is about as close as this subject gets to an ancient " +
      "person's attitude surviving as a physical act.\n\n" +
      "WHY IT IS STILL HARD. THREE QUESTIONS, and the photograph answers none of them. WHEN was the damage " +
      "done — a century after the relief, or two thousand years? BY WHOM — Egyptian priests in a period of " +
      "hostility to Set, later Christians removing pagan images generally, or someone else? AND WHY — because " +
      "it was Set specifically, or because it was a god, or for reasons nobody recorded? Damage to a Set " +
      "figure inside a broadly defaced temple is weaker evidence than damage to a Set figure in an otherwise " +
      "untouched wall.\n\n" +
      "WHAT MUST NOT BE DONE. Infer motive from the photograph. This record exists because the inference is " +
      "so tempting and so often made silently: a damaged Set becomes 'Set was demonised' becomes a date. The " +
      "damage is the evidence. The motive is a claim, and it needs its own support.\n\n" +
      "THINGS TO ASK: How would you date an act of destruction? What would distinguish targeted erasure from " +
      "general defacement?",
    category: "archaeology",
    subcategory: "Changing reputation",
    eventType: "archaeological_interpretation",
    identificationStatus: "disputed",
    tags: ["set", "erasure", "damnatio-memoriae", "demonisation", "herihor"],
    civilisations: ["Ancient Egypt"],
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Set's images were defaced",
        originalDateText: "Not established. The damage is visible; its date is not on the object",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS ESTABLISHED: that Set's figure and name were deliberately removed from some monuments. " +
          "WHAT IS NOT: when, by whom, or why in any individual case. WHY THIS CLAIM IS POSITIONLESS: giving " +
          "the erasure a date would be inventing the one piece of information the evidence most conspicuously " +
          "lacks, and it is precisely the piece that a narrative of demonisation needs.",
        notes:
          "NEEDS SOURCE VERIFICATION for individual monuments, their condition reports and the Egyptological " +
          "literature on periods of hostility to Set. This is the record where a specialist would add most.",
      },
    ],
    media: [
      {
        url: commons("Relief_Herihor_Seth_obliterated.jpg"),
        sourcePageUrl: commonsPage("Relief_Herihor_Seth_obliterated.jpg"),
        caption:
          "A relief associated with Herihor in which the figure of Set has been deliberately cut away while the surrounding scene survives. The selectivity is the evidence; the date and the motive of the damage are not visible in the stone.",
        kind: "image",
        shows: "artefact",
        identificationStatus: "disputed",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "horus-spears-set-edfu",
    title: "Horus spears Set at Edfu",
    summary:
      "Ptolemaic temple reliefs show Horus harpooning Set as a hippopotamus. The god who once held the spear is now on the end of it.",
    description:
      "WHAT KIND OF RECORD IS THIS? The other half of this dataset's central comparison.\n\n" +
      "WHAT THE RELIEFS SHOW. At the temple of Horus at Edfu, built under the Ptolemies, a ritual cycle depicts " +
      "the triumph of Horus: Set, in the form of a hippopotamus, harpooned and destroyed. It is liturgy carved " +
      "on a wall — a ritual of triumph, performed, not merely a story illustrated.\n\n" +
      "THE COMPARISON. Set spearing Apep from the solar barque, and Horus spearing Set at Edfu, are the same " +
      "composition with the roles moved along by one. The defender has become the thing defended against.\n\n" +
      "HOW THIS DATASET REFUSES TO EXPLAIN IT. Several factors are offered in the literature — foreign rule " +
      "and Set's association with foreigners, the rise of Osirian religion, regional cult politics, the " +
      "internal logic of a mythology where Osiris's murderer cannot stay respectable. Any of these may " +
      "contribute. This record does not choose, and specifically does not offer the single tidy sentence the " +
      "question invites, because the change took centuries, varied by region, and is visible in the evidence " +
      "as a drift rather than a decision.\n\n" +
      "WHAT IS NOT IN DOUBT. The Edfu reliefs are late. They are Ptolemaic, some two and a half thousand years " +
      "after Peribsen put Set above his name. A reader who meets Horus-spears-Set first and assumes it was " +
      "always so has inverted the chronology of the whole subject.\n\n" +
      "A WARNING ABOUT PICTURES, and it is not hypothetical. A widely circulated image titled 'Horus spearing " +
      "Set' on Wikimedia Commons is a MODERN ARTWORK made in 2025. It is not a photograph of an Edfu relief " +
      "and must never be shown as one. The contrast with the Apep image is the lesson: one file reproduces a " +
      "Twenty-first Dynasty Book of the Dead scene, the other was drawn last year, and image search presents " +
      "them identically. Every picture in this dataset is provenance-checked or absent.\n\n" +
      "THINGS TO ASK: How does the god holding the spear become the thing on the end of it? What would you " +
      "need to see, in what order, to answer that from evidence rather than from a story?",
    category: "archaeology",
    subcategory: "Changing reputation",
    eventType: "religious_account",
    identificationStatus: "secure",
    tags: ["set", "horus", "edfu", "ptolemaic", "hippopotamus", "triumph-of-horus"],
    civilisations: ["Ptolemaic Egypt"],
    locationName: "Temple of Horus, Edfu, Egypt",
    claims: [
      {
        sourceKey: null,
        startYear: -237,
        endYear: -57,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The building and decoration of the Edfu temple",
        originalDateText: "Ptolemaic; construction spanning roughly the third to first centuries BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the temple, whose construction and decoration are documented in its own inscriptions " +
          "and are among the best-dated major structures in Egypt. WHY THE DATE MATTERS SO MUCH HERE: it places " +
          "this imagery roughly two and a half millennia after the Second Dynasty serekhs, which is the single " +
          "most important thing a reader can know when the two images are shown side by side.",
        notes: "NEEDS SOURCE VERIFICATION for the construction dates and for the specific reliefs.",
      },
    ],
    media: [
      {
        url: commons("Horus_spearing_set.png"),
        sourcePageUrl: commonsPage("Horus_spearing_set.png"),
        caption:
          "MODERN ARTWORK, created in June 2025. This is NOT an Edfu relief and not an ancient Egyptian image. It is included only as a worked example: it circulates under a title that invites exactly that assumption, and a caption is not provenance.",
        kind: "image",
        shows: "later_artwork",
        imageDate: "2025-06",
        identificationStatus: "modern_interpretation",
        depictsActualRemains: false,
        verifiedIdentity: false,
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // RECEPTION
  // -------------------------------------------------------------------------
  {
    slug: "set-becomes-typhon",
    title: "Set becomes Typhon",
    summary:
      "Greeks reading Egyptian religion matched Set to Typhon, the monstrous adversary of Zeus. Much of the modern picture of Set descends from that equation rather than from Egypt.",
    description:
      "WHAT KIND OF RECORD IS THIS? A translation, and the moment the modern misunderstanding becomes " +
      "traceable.\n\n" +
      "WHAT HAPPENED. Greek writers and Greco-Egyptian practitioners identified Set with Typhon — in Greek " +
      "myth a monstrous chaos-serpent who fights Zeus and loses. The identification runs through Plutarch and " +
      "through the Greco-Egyptian magical material, where 'Typhon' is routinely the name used.\n\n" +
      "WHY IT MATTERS ENORMOUSLY. Typhon is an unambiguous monster. Set, in Egyptian terms, is not: he is " +
      "dangerous, necessary, royal, and for centuries the defender of the sun. Translating him as Typhon keeps " +
      "the danger and discards the rest. Once that translation is made, Set arrives in European thought " +
      "pre-simplified — and the line from Typhon to 'the Egyptian Satan' is short and well travelled.\n\n" +
      "THE HONEST QUALIFICATION. The Greeks were not simply wrong. By the Ptolemaic and Roman periods Set HAD " +
      "become a considerably more hostile figure in Egypt itself, as the Edfu material shows. The Greek " +
      "equation captured something real about the Set of its own day. What it could not capture, and what " +
      "readers of Greek sources therefore lost, was the two-and-a-half thousand years before it.\n\n" +
      "THINGS TO ASK: When you translate a god into another language's pantheon, what gets lost? If a " +
      "translation is accurate to its own moment, is it accurate to the past?",
    category: "religion",
    subcategory: "Greco-Roman reception",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "typhon", "hellenistic", "reception", "greco-egyptian"],
    civilisations: ["Ptolemaic Egypt", "Roman Egypt"],
    claims: [
      {
        sourceKey: "plutarch_isis_osiris",
        startYear: -299,
        endYear: 399,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the Set-Typhon identification is visible in the sources",
        originalDateText: "Visible from the Hellenistic period through Roman Egypt",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the period across which the equation is attested in Greek and Greco-Egyptian " +
          "sources, not the moment it was invented, which is not recoverable. WHY A WIDE RANGE: it is a usage " +
          "that spreads, not an event that happens.",
        notes: "NEEDS SOURCE VERIFICATION for the earliest attestations of the identification.",
      },
    ],
    media: [
      {
        url: commons("Greco-Roman_Set.jpg"),
        sourcePageUrl: commonsPage("Greco-Roman_Set.jpg"),
        caption:
          "A Greco-Roman period representation of Set. Provenance of the underlying object has not been established by this dataset and the Commons caption has not been checked against a museum catalogue.",
        kind: "image",
        shows: "artefact",
        identificationStatus: "possible",
        depictsActualRemains: false,
        verifiedIdentity: false,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "plutarch-on-isis-and-osiris",
    title: "Plutarch writes On Isis and Osiris",
    summary:
      "c. 100 CE. A Greek priest of Delphi produces the most influential account of Egyptian myth ever written — roughly three thousand years after this dataset begins.",
    description:
      "WHAT KIND OF RECORD IS THIS? A source about a source, placed on the timeline where it actually belongs " +
      "rather than where it is usually used.\n\n" +
      "WHAT IT IS. A Greek treatise, written for Greeks, by a priest of Apollo at Delphi, setting out the myth " +
      "of Isis, Osiris, Horus and Typhon — Typhon being Set throughout. It is coherent, readable, " +
      "philosophically framed, and it is the version of Egyptian myth that most educated Europeans have " +
      "actually read for two thousand years.\n\n" +
      "THE GAP THAT HAS TO BE STATED. Plutarch is later than Peribsen by something like two thousand seven " +
      "hundred years. He is later than the Pyramid Texts by more than two thousand. Using him to describe " +
      "'what the Egyptians believed' is like using a twenty-first-century essay to describe the religion of " +
      "Iron Age Britain — not worthless, and not a primary source.\n\n" +
      "WHY HE IS ON THE TIMELINE ANYWAY. Because the transmission is the history. The modern idea of Set is " +
      "substantially Plutarch's idea of Typhon, and a reader cannot see that unless Plutarch is placed in his " +
      "own century with the distance visible. Put him at 100 CE on a strip that starts at 4000 BCE and the " +
      "point makes itself.\n\n" +
      "THINGS TO ASK: Why has the latest major source been the most influential one? What would the story look " +
      "like if the Pyramid Texts had been as readable?",
    category: "religion",
    subcategory: "Greco-Roman reception",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "plutarch", "typhon", "reception", "textual-transmission"],
    civilisations: ["Roman Empire"],
    claims: [
      {
        sourceKey: "plutarch_isis_osiris",
        startYear: 100,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "When Plutarch wrote",
        originalDateText: "About the late first or early second century CE",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the composition, placed by Plutarch's own life. WHAT THE DATE IS FOR: measuring the " +
          "distance between this text and the Egyptian material it describes, which is the only reason it is " +
          "on this timeline.",
        notes: "NEEDS SOURCE VERIFICATION for a tighter date of composition.",
      },
    ],
  },

  {
    slug: "decline-of-the-ancient-cult",
    title: "The documented cult ends, slowly and without a last day",
    summary:
      "Temples close, hieroglyphic writing stops, Egypt becomes Christian. There is no date on which Set worship ended, and this record refuses to supply one.",
    description:
      "WHAT KIND OF RECORD IS THIS? An ending, recorded as the gradual and uneven thing it was.\n\n" +
      "WHAT HAPPENED. Over late antiquity, traditional Egyptian temple religion declines: funding dries up, " +
      "priesthoods shrink, Christianity spreads, temples close or are converted. The last securely dated " +
      "hieroglyphic inscriptions belong to the fourth century CE, at Philae. With the script goes the ability " +
      "to read the entire preceding record, which is not incidental — Egypt loses access to its own past for " +
      "fourteen hundred years.\n\n" +
      "WHAT THIS RECORD WILL NOT SAY. That Set worship ended in any particular year. Institutional cult is " +
      "datable through buildings, endowments and inscriptions. Belief and private practice are not, and their " +
      "absence from the record is absence of evidence. The honest statement is that documented institutional " +
      "cult disappears, and when it does so is a range rather than a date.\n\n" +
      "WHY THE SCRIPT MATTERS TO THIS DATASET SPECIFICALLY. Everything before this point is written in a " +
      "system nobody could read from roughly the fifth century until the 1820s. The whole of the ancient " +
      "material in this timeline was, for that period, physically present and completely mute.\n\n" +
      "THINGS TO ASK: What would evidence of the end of a religion look like? Is the last inscription the end " +
      "of anything except inscriptions?",
    category: "history",
    subcategory: "Late antiquity",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "late-antiquity", "philae", "hieroglyphs", "christianisation"],
    civilisations: ["Roman Egypt"],
    claims: [
      {
        sourceKey: null,
        startYear: 300,
        endYear: 600,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The disappearance of documented institutional cult",
        originalDateText: "A range across late antiquity, not a date",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: a process, given as a range because that is what it was. THE LAST HIEROGLYPHIC " +
          "INSCRIPTIONS at Philae fall in the fourth century CE and are the nearest thing to a marker. WHY NOT " +
          "A SINGLE DATE: temples closed at different times in different places, and the end of a documented " +
          "institution is not the end of a belief.",
        notes: "NEEDS SOURCE VERIFICATION for the Philae dates and for the closure history of Set's own cult sites.",
      },
    ],
  },

  {
    slug: "documentary-gap-set",
    title: "The gap: roughly fourteen centuries with nothing in them",
    summary:
      "Between the end of the documented ancient cult and the modern revivals there is no evidence of a continuous institution. The gap is a finding and gets a record of its own.",
    description:
      "WHAT KIND OF RECORD IS THIS? A deliberate hole in the timeline, given the same weight as the objects.\n\n" +
      "WHY IT EXISTS. A timeline that runs from 4000 BCE to the present with an event every century implies " +
      "continuity by its shape alone. For Set there is a long stretch — very roughly the fifth century to the " +
      "nineteenth — with no demonstrated organised worship, no priesthood, no temple, and no institution " +
      "claiming descent that can be checked. Leaving that stretch looking like the rest would be the single " +
      "most misleading thing this dataset could do, and it would do it silently.\n\n" +
      "WHAT THE GAP IS NOT. It is not proof that nobody anywhere held any belief about Set. Absence of " +
      "evidence is not evidence of absence, and this dataset holds to that here as it does everywhere else. " +
      "Egyptian material survived in texts, in magical traditions, in Coptic and Arabic writing, and the god's " +
      "name was never wholly lost.\n\n" +
      "WHAT THE GAP IS. The absence of any demonstrated INSTITUTIONAL continuity. Modern groups that describe " +
      "themselves as continuing an ancient tradition are making a claim, and the claim has this gap to cross. " +
      "Recording the gap is not hostility to those groups; it is the difference between their religious " +
      "self-understanding and a documented chain of custody, and both belong on the record as what they are.\n\n" +
      "IF EVIDENCE APPEARS. Credible evidence of continuing folk tradition or textual transmission belongs " +
      "here, separately sourced, and would narrow the gap. Narrowing it with evidence is exactly what should " +
      "happen. Filling it with assumption is not.\n\n" +
      "THINGS TO ASK: What would demonstrate continuity across fourteen centuries? Does a revival need one in " +
      "order to be genuine?",
    category: "history",
    subcategory: "Evidence gaps",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "documentary-gap", "continuity", "transmission"],
    claims: [
      {
        sourceKey: null,
        startYear: 500,
        endYear: 1800,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The span with no demonstrated institutional continuity",
        originalDateText: "Roughly the fifth century to the nineteenth: no documented organised cult",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that across this span this dataset finds no evidence of organised, institutional " +
          "worship of Set. WHAT IT DOES NOT CLAIM: that nothing survived, or that no individual believed " +
          "anything. WHY IT IS ON THE TIMELINE AS AN EVENT: because a gap that is not drawn is a gap that gets " +
          "filled by the reader's assumption of continuity, which is the specific error this record blocks.",
        notes:
          "NEEDS SOURCE VERIFICATION, in the most productive possible sense: anybody who can narrow this gap " +
          "with evidence should, and the record is built to be narrowed.",
      },
    ],
  },

  {
    slug: "egyptological-rediscovery-of-set",
    title: "Europe learns to read the evidence again",
    summary:
      "From the 1820s decipherment onwards, Set is reconstructed from Egyptian sources for the first time in more than a millennium — and reconstructed by people with their own assumptions.",
    description:
      "WHAT KIND OF RECORD IS THIS? The point at which the ancient material becomes legible again, and the " +
      "beginning of the modern idea of Set.\n\n" +
      "WHAT CHANGED. The decipherment of hieroglyphs in the 1820s made the entire preceding record readable. " +
      "Everything in this dataset before late antiquity was recovered, as knowledge, in the two centuries " +
      "after that — by Champollion, Lepsius, Wilkinson, Maspero, Budge and their successors, in books with " +
      "plates that are themselves now historical objects.\n\n" +
      "THE PART WORTH NOTICING. These scholars did not arrive empty-handed. They arrived having read Plutarch, " +
      "in a Christian intellectual culture with a strong category for an evil adversary, and they published " +
      "for a public that found Egyptomania thrilling. The reconstruction of Set that reached the general " +
      "reader was shaped by those things as well as by the inscriptions.\n\n" +
      "WHY THE BOOKS THEMSELVES ARE EVIDENCE. A nineteenth-century engraving of a Set animal is not an " +
      "Egyptian image. It is evidence of how a Victorian Egyptologist read an Egyptian image, which is a " +
      "different and also interesting thing. Anything from this period in this dataset is labelled as " +
      "nineteenth-century interpretation, never as ancient.\n\n" +
      "THINGS TO ASK: What did the first modern readers of these texts already expect to find? How would you " +
      "detect that in what they wrote?",
    category: "history",
    subcategory: "Egyptology",
    eventType: "historical",
    identificationStatus: "modern_interpretation",
    tags: ["set", "egyptology", "champollion", "decipherment", "reception"],
    claims: [
      {
        sourceKey: null,
        startYear: 1822,
        endYear: 1920,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The reconstruction of Set within Egyptology",
        originalDateText: "From the 1820s decipherment through the early twentieth century",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the period in which Set was reconstructed from primary Egyptian sources for the " +
          "first time since antiquity. WHY IT STARTS IN THE 1820s: before decipherment the inscriptions were " +
          "present and unreadable, so no reconstruction from them was possible.",
        notes: "NEEDS SOURCE VERIFICATION for specific publications and plates, which should be cited individually.",
      },
    ],
  },

  {
    slug: "temple-of-set-1975",
    title: "The Temple of Set is founded, 1975",
    summary:
      "A documented organisational fact, and a religious claim about its origin. This record keeps those two things apart, because they are different kinds of statement.",
    description:
      "WHAT KIND OF RECORD IS THIS? The modern end of the timeline, handled with the same rule as the " +
      "Predynastic end: say what is documented, say what is claimed, and do not convert either into the other.\n\n" +
      "THE DOCUMENTED FACT. In 1975 the Temple of Set was established in the United States, by Michael Aquino " +
      "and others who had left the Church of Satan, founded in 1966. That the organisation exists, when it was " +
      "founded, and who founded it are matters of ordinary public record.\n\n" +
      "THE RELIGIOUS CLAIM, KEPT SEPARATE. Aquino's account of the founding involves receiving a text, The " +
      "Book of Coming Forth by Night, and a Setian interpretation of that event. This dataset records that the " +
      "claim is made, by whom, and when. IT DOES NOT ADJUDICATE IT. Whether a revelation occurred is not a " +
      "question this timeline is equipped to answer, and treating it as either established or debunked would " +
      "be equally unwarranted. It is a religious claim and is labelled one.\n\n" +
      "WHY THE CHURCH OF SATAN IS MENTIONED AT ALL. Only because the Temple of Set emerged from it, which is " +
      "organisational history. It carries no implication that Set is Satan — a conflation this dataset spends " +
      "five thousand years of records arguing against, and which the Temple of Set itself rejects.\n\n" +
      "THE RELATIONSHIP TO ANCIENT EGYPT. Modern Setians draw on Egyptian material. That is a real and " +
      "documented act of interpretation, happening in the twentieth and twenty-first centuries. It is not " +
      "evidence about ancient Egypt, and the fourteen-hundred-year gap recorded elsewhere in this dataset sits " +
      "between the two. Modern symbolism is labelled modern, always.\n\n" +
      "THINGS TO ASK: What is the difference between a revival and a continuation? Does it matter to the " +
      "people practising it, and does it matter to a historian, and are those the same question?",
    category: "religion",
    subcategory: "Modern reception",
    eventType: "historical",
    identificationStatus: "modern_interpretation",
    tags: ["set", "temple-of-set", "setianism", "modern", "religious-claim"],
    people: ["Michael Aquino"],
    locationName: "United States",
    claims: [
      {
        sourceKey: null,
        startYear: 1966,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "The founding of the Church of Satan",
        originalDateText: "1966",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: an organisational founding, included ONLY because the Temple of Set later emerged " +
          "from it. WHAT IT DOES NOT IMPLY: any identification of Set with Satan.",
        notes: "NEEDS SOURCE VERIFICATION against independent accounts.",
      },
      {
        sourceKey: null,
        startYear: 1975,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "The founding of the Temple of Set",
        originalDateText: "1975",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the establishment of the organisation, which is a matter of public record. THIS IS " +
          "THE DOCUMENTED HALF of this record and is not in dispute.",
        notes: "NEEDS SOURCE VERIFICATION for the precise date and founding circumstances.",
      },
      {
        sourceKey: "temple_of_set_primary",
        startYear: 1975,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "traditional_date",
        whatIsDated: "The religious account of the Temple's origin",
        originalDateText: "Aquino's account of receiving The Book of Coming Forth by Night",
        datingMethod: "source_assertion",
        chronology: "religious",
        evidence:
          "WHAT IS CLAIMED: that the text was received, and the Setian interpretation of that event. WHOSE " +
          "CLAIM IT IS: Michael Aquino's, and the Temple of Set's. WHAT THIS DATASET DOES WITH IT: records " +
          "that it is made, by whom, and when. IT DOES NOT ADJUDICATE IT, in either direction. A timeline that " +
          "declared revelations true would be doing theology; one that declared them false would be doing a " +
          "different theology. Both are outside what evidence can settle.",
        notes:
          "NEEDS SOURCE VERIFICATION against the Temple of Set's own publications and against independent " +
          "scholarly accounts of the movement.",
      },
    ],
  },

  {
    slug: "set-in-the-pyramid-texts",
    title: "Set in the Pyramid Texts: killer and helper in the same corpus",
    summary:
      "Old Kingdom, from about the 24th century BCE. The oldest substantial Egyptian religious writing already has Set killing Osiris — and already has him helping the dead king climb to the sky.",
    description:
      "WHAT KIND OF RECORD IS THIS? The earliest large body of writing that tells us what Egyptians said about " +
      "Set, rather than what they drew.\n\n" +
      "WHY THAT DISTINCTION MATTERS. Everything before this in the dataset is images, names and placements: a " +
      "creature on a standard, an animal over a serekh. Those establish that Set existed and mattered. They do " +
      "not tell us what he DID. The Pyramid Texts do.\n\n" +
      "WHAT THEY CONTAIN, IN OUTLINE. Set is implicated in the death of Osiris. He is also invoked in the " +
      "king's ascent, and his strength is something the dead king takes for himself rather than something to " +
      "be destroyed. Both are in the same corpus, carved in the same tombs, for the same readers.\n\n" +
      "THE THING MOST OFTEN GOT WRONG. This is routinely reported as 'even in the earliest texts Set is the " +
      "murderer', which is half of it. A corpus that both blames him for a killing and wants his power for the " +
      "king is not describing a devil. It is describing something Egyptian religion did not find contradictory " +
      "and modern summaries cannot hold in one hand.\n\n" +
      "THE HONEST LIMIT OF THIS RECORD. No utterance is cited here by number. The characterisation above is " +
      "the standard one in Egyptological summary and it is repeated here without the texts open. That is a " +
      "real weakness and it is stated rather than hidden.\n\n" +
      "THINGS TO ASK: If a tradition's oldest text already contains a conflict, where did the conflict come " +
      "from? What would evidence of a still earlier stage even look like?",
    category: "religion",
    subcategory: "Old Kingdom",
    eventType: "religious_account",
    identificationStatus: "secure",
    tags: ["set", "pyramid-texts", "osiris", "old-kingdom", "saqqara"],
    civilisations: ["Ancient Egypt"],
    locationName: "Saqqara, Egypt",
    claims: [
      {
        sourceKey: "pyramid_texts",
        startYear: -2349,
        endYear: -2149,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the Pyramid Texts were inscribed",
        originalDateText: "From the late Fifth Dynasty through the Sixth, roughly 2350-2150 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the carving of the texts, which is not the same as the composition of what they " +
          "contain. Much of the material is generally held to be older than the walls it is written on, " +
          "transmitted before it was inscribed — but HOW MUCH older is not recoverable, and this record does " +
          "not guess. The inscribed date is what the evidence gives.",
        notes: "NEEDS SOURCE VERIFICATION against a current edition and a current Old Kingdom chronology.",
      },
      {
        sourceKey: "pyramid_texts",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "How far back the mythology itself goes",
        originalDateText: "Unknown. The texts are older than their inscription by an unmeasured amount",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHY THIS CLAIM CARRIES NO DATE: it is a genuine hole in the evidence, not a rounding problem. " +
          "Composition-before-inscription is widely accepted; the interval is not measurable from the texts. " +
          "Given a positionless claim rather than an invented range, because a range would be a number where " +
          "there is none.",
        notes: "This record exists so the gap cannot be quietly closed by the inscription date.",
      },
    ],
  },

  {
    slug: "set-in-the-coffin-texts",
    title: "The Coffin Texts: the mythology spreads beyond the king",
    summary:
      "Middle Kingdom, roughly 2100-1700 BCE. The funerary material moves from royal pyramid walls to private coffins, and with it the story of Set reaches a far wider readership.",
    description:
      "WHAT KIND OF RECORD IS THIS? A change in WHO the texts were for, which matters as much as a change in " +
      "what they said.\n\n" +
      "WHAT CHANGED. Pyramid Texts were carved inside royal pyramids. Coffin Texts are painted inside the " +
      "coffins of officials and other non-royal people. The afterlife machinery, and the divine cast operating " +
      "it, stop being a royal monopoly.\n\n" +
      "WHY IT BELONGS IN A DATASET ABOUT SET. A god whose story is known to a few hundred people at court is " +
      "not the same cultural object as a god whose story is painted into the coffins of a provincial " +
      "administrative class. The spread is part of how the later, harder-edged Set became possible: there was " +
      "a much larger audience to shift.\n\n" +
      "WHAT THIS RECORD DOES NOT CLAIM. That Set's character changes here. It is listed as a stage in " +
      "transmission, not as a turning point in meaning, because no spell is cited below to support a claim " +
      "about meaning.\n\n" +
      "THINGS TO ASK: Does a story change when more people own a copy of it? What kind of evidence would show " +
      "that it had?",
    category: "religion",
    subcategory: "Middle Kingdom",
    eventType: "religious_account",
    identificationStatus: "secure",
    tags: ["set", "coffin-texts", "middle-kingdom", "funerary", "transmission"],
    civilisations: ["Ancient Egypt"],
    claims: [
      {
        sourceKey: "coffin_texts",
        startYear: -2099,
        endYear: -1699,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period in which the Coffin Texts were in use",
        originalDateText: "First Intermediate Period and Middle Kingdom, roughly 2100-1700 BCE",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: a corpus in use over several centuries, dated by the archaeological context of the " +
          "coffins that carry it. WHY IT IS A BROAD RANGE: it is a practice rather than an event, and the " +
          "boundaries at either end are conventions of periodisation rather than observations.",
        notes: "NEEDS SOURCE VERIFICATION for the range and for any specific spell mentioning Set.",
      },
    ],
  },

  {
    slug: "set-lord-of-the-red-land",
    title: "Set as lord of the desert, the storm and the foreign land",
    summary:
      "Not an event and given no date. A cluster of associations that runs through Egyptian history and explains more about Set's later fate than any single incident does.",
    description:
      "WHAT KIND OF RECORD IS THIS? A standing association rather than something that happened, and it carries " +
      "a positionless claim for exactly that reason.\n\n" +
      "THE ASSOCIATIONS. Set belongs to the deshret, the red land — desert as against the black cultivated " +
      "soil of the valley. He belongs to storm, to thunder, to the sea, to disturbance. And he belongs to " +
      "abroad: to the lands Egypt traded with, fought and feared.\n\n" +
      "WHY THIS IS THE MOST USEFUL SINGLE FACT IN THE DATASET. It makes both halves of Set intelligible " +
      "without a conversion narrative. A god of the desert is indispensable when Egypt is confident: the " +
      "desert is where the mines are, where the caravans go, where the sun goes at night and must be defended. " +
      "The same god is a liability when Egypt is invaded or occupied, because the foreign is no longer a " +
      "frontier but an occupier. The god did not change sides. The border changed meaning.\n\n" +
      "WHAT THIS RECORD IS NOT. It is not a causal explanation, and it should not be read as one. It is the " +
      "material that any explanation has to account for. Several records in this dataset later become much " +
      "easier to read once it is in place.\n\n" +
      "THINGS TO ASK: Which gods in other traditions carry the foreign in the same way? What happens to them " +
      "when the foreign arrives in force?",
    category: "religion",
    subcategory: "Mythology and cult",
    eventType: "mainstream",
    identificationStatus: "secure",
    tags: ["set", "desert", "storm", "foreign-lands", "deshret", "thematic"],
    civilisations: ["Ancient Egypt"],
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When these associations held",
        originalDateText: "Throughout pharaonic history; no date applies",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHY THERE IS NO DATE HERE: the record describes a set of associations attested across millennia, " +
          "not a moment. Giving it a start year would invent a beginning for something that has no recorded " +
          "one. WHAT IS ESTABLISHED: the associations themselves, which are standard in Egyptological " +
          "description and visible in epithets, iconography and the contexts Set appears in. WHAT WOULD " +
          "IMPROVE THIS: specific epithets, cited, with the texts that carry them.",
        notes: "NEEDS SOURCE VERIFICATION for the epithets that would turn this from a summary into evidence.",
      },
    ],
  },

  {
    slug: "hyksos-avaris-sutekh",
    title: "The Hyksos at Avaris and the god they called Sutekh",
    summary:
      "Fifteenth Dynasty, roughly 1650-1550 BCE. Rulers of foreign origin govern the eastern Delta and make Set their principal god — identified with the storm gods of the Levant.",
    description:
      "WHAT KIND OF RECORD IS THIS? A hinge, and a much-abused one.\n\n" +
      "WHAT IS REASONABLY WELL ESTABLISHED. A line of rulers of West Semitic background held the eastern " +
      "Delta from a capital at Avaris, modern Tell el-Dabaa. Set, under the writing Sutekh, was their chief " +
      "god, and he was identified with the Levantine storm god whom Egyptians rendered as Baal — a god with a " +
      "genuinely similar profile of storm, strength and the foreign.\n\n" +
      "WHAT IS NOT ESTABLISHED, AND IS CONSTANTLY ASSERTED. That this is WHY Set later became evil. It is the " +
      "single most popular explanation in general writing and it has real problems. The largest is " +
      "chronological: Set's royal standing rises rather than collapses after the Hyksos are expelled. The " +
      "Nineteenth Dynasty, whose kings name themselves for him, comes AFTER this, not before. An explanation " +
      "that predicts the opposite of what happened next needs more than plausibility.\n\n" +
      "HOW THIS DATASET HANDLES IT. As an attested episode with an attested divine identification, and " +
      "separately as a proposed explanation that is recorded as a proposal. Both are true statements; only " +
      "one is a fact about the past.\n\n" +
      "ON THE WORD HYKSOS. It renders an Egyptian phrase for rulers of foreign lands. It is a title, not an " +
      "ethnicity, and the older picture of a single violent invading horde has been substantially revised by " +
      "excavation at Tell el-Dabaa. This record does not depend on the old picture.\n\n" +
      "THINGS TO ASK: If a foreign dynasty adopts a local god, what does that tell you about the god, and " +
      "what does it tell you about the dynasty?",
    category: "history",
    subcategory: "Second Intermediate Period",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "sutekh", "hyksos", "avaris", "baal", "tell-el-dabaa", "delta"],
    civilisations: ["Ancient Egypt", "Levant"],
    locationName: "Tell el-Dabaa (Avaris), eastern Nile Delta, Egypt",
    claims: [
      {
        sourceKey: null,
        startYear: -1649,
        endYear: -1549,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Fifteenth Dynasty's rule from Avaris",
        originalDateText: "Roughly 1650-1550 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: a period of rule, from king lists, monuments and the stratigraphy of Tell el-Dabaa. " +
          "WHY THE RANGE: Second Intermediate Period chronology is among the less settled parts of Egyptian " +
          "dating, and both ends carry decades of uncertainty.",
        notes: "NEEDS SOURCE VERIFICATION against current Second Intermediate Period chronology.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the Hyksos episode caused Set's later demonisation",
        originalDateText: "A proposed explanation, not a dated event",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED, BY OTHERS: that Egyptian hostility to the Hyksos transferred to their god and " +
          "eventually made him the enemy. WHY IT IS RECORDED AS A CLAIM RATHER THAN A CAUSE: the chronology " +
          "runs against it. Set's royal prominence is HIGHER in the Nineteenth Dynasty, after the expulsion, " +
          "than before it — see the Nineteenth Dynasty record and the 400-Year Stela. WHAT THIS DATASET " +
          "CONCLUDES: nothing. It holds the proposal and the counter-evidence together and leaves them there.",
        notes:
          "PARTLY VERIFIED SINCE THIS RECORD WAS WRITTEN. The Austrian Archaeological Institute securely " +
          "identifies Tell el-Dabʿa as Avaris and dates the Hyksos capital to roughly 1640-1530 BCE, which " +
          "supports the episode itself.\n\n" +
          "WHAT WAS LOOKED FOR AND NOT FOUND, which matters more: an excavation report establishing a " +
          "securely dated TEMPLE OF SETH in the relevant Second Intermediate Period stratum. That is the " +
          "specific claim an argument about the four-hundred-year era most wants, and general Avaris " +
          "archaeology must not be quietly upgraded into it.\n\n" +
          "ALSO CORRECTED: an older literature treated Tanis as Avaris, and several early reconstructions " +
          "rested on that. It is no longer tenable. Monuments were carried from Pi-Ramesses to Tanis after " +
          "Pi-Ramesses was abandoned around 1100 BCE, which is why Ramesside material turns up there.\n\n" +
          "STILL NEEDS SOURCE VERIFICATION for the scholarly literature on both sides of the demonisation " +
          "question, which exists and has not been consulted.",
      },
    ],
  },

  {
    slug: "contendings-of-horus-and-seth",
    title: "The Contendings of Horus and Seth: eighty years in court",
    summary:
      "Twentieth Dynasty papyrus. The longest surviving Egyptian narrative about Set is a lawsuit — and it is frequently funny.",
    description:
      "WHAT KIND OF RECORD IS THIS? The best corrective available to reading Plutarch as though it were what " +
      "Egyptians thought.\n\n" +
      "WHAT THE TEXT IS. Papyrus Chester Beatty I, from the workmen's village at Deir el-Medina, Twentieth " +
      "Dynasty. It narrates the dispute between Horus and Set over the kingship as a court case before the " +
      "tribunal of the gods, dragging on for eighty years, with the deities bickering, changing their minds, " +
      "being rude to one another, and being repeatedly unable to reach a decision.\n\n" +
      "WHY ITS TONE IS EVIDENCE. Popular accounts of Egyptian religion present a solemn cosmic struggle " +
      "between order and chaos. The longest Egyptian telling of that struggle that survives is closer to " +
      "farce. That does not make it un-religious — myths can be funny and serious at once — but it does mean " +
      "the solemnity in most retellings is imported.\n\n" +
      "WHAT SET IS IN IT. Strong, crude, dangerous, sometimes ridiculous, and a party to a legal dispute with " +
      "a genuine claim. Not a devil. Not an abstraction of evil. A litigant with a bad temper and a real case.\n\n" +
      "A WARNING ABOUT THIS RECORD SPECIFICALLY. The papyrus has not been read here in any edition. The " +
      "description above is the standard characterisation, given without page references, and it is exactly " +
      "the kind of confident secondhand summary this dataset exists to be suspicious of. It is included " +
      "because leaving out the most important Egyptian source on Set would distort the whole more.\n\n" +
      "THINGS TO ASK: Why does a culture tell a comic version of its central conflict? Who was this copy for?",
    category: "religion",
    subcategory: "New Kingdom",
    eventType: "religious_account",
    identificationStatus: "secure",
    tags: ["set", "horus", "chester-beatty", "deir-el-medina", "kingship", "narrative"],
    civilisations: ["Ancient Egypt"],
    locationName: "Deir el-Medina, Egypt",
    claims: [
      {
        sourceKey: "chester_beatty_i",
        startYear: -1189,
        endYear: -1076,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the surviving copy was written",
        originalDateText: "Twentieth Dynasty",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: THIS PAPYRUS, not the story. A manuscript date is the date of a copy, and the " +
          "narrative it carries may be considerably older. The distinction is the same one the dataset makes " +
          "everywhere: the date of the object and the date of the content are two claims.",
        notes:
          "NEEDS SOURCE VERIFICATION for the dynasty, the reign sometimes attached to it, and the papyrus's " +
          "history before the Chester Beatty Library.",
      },
      {
        sourceKey: "chester_beatty_i",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "How old the story is",
        originalDateText: "Unknown; older than the copy by an unmeasured amount",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHY THIS CARRIES NO DATE: elements of the Horus-and-Set dispute are attested far earlier, but " +
          "nothing dates THIS narrative's composition. Recorded as positionless rather than assigned the " +
          "papyrus's own date, which would silently claim the story was invented in the Twentieth Dynasty.",
      },
    ],
  },

  {
    slug: "four-hundred-year-stela",
    title: "The 400-Year Stela: one object, two dates, and they must not be merged",
    summary:
      "Erected under Ramesses II, commemorating four hundred years of Set. The date it was made and the date it points back to are different claims about different things.",
    description:
      "WHAT KIND OF RECORD IS THIS? The first record in this dataset built from the inscription rather than " +
      "from writing about the inscription, and the clearest example of why an object needs more than one " +
      "date claim.\n\n" +
      "WHAT THE OBJECT IS, NOW VERIFIED. A round-topped rose granite stela, 220 by 134 by 50 centimetres, " +
      "with its lower part missing. Egyptian Museum, Cairo, JdE 60539. Found in the eastern part of the Amun " +
      "temple at Tanis, and generally held to have come originally from Pi-Ramesses or Qantir — the Austrian " +
      "Archaeological Institute records that monuments were carried from Pi-Ramesses to Tanis after " +
      "Pi-Ramesses was abandoned around 1100 BCE. The lunette shows Ramesses II offering wine to Seth.\n\n" +
      "A CORRECTION THIS RECORD USED TO NEED. An older literature treated Tanis AS Avaris. That premise is " +
      "no longer tenable, and several early reconstructions of what this stela commemorates rested on it.\n\n" +
      "THE TWO DATES, AND WHY THEY ARE NOT ONE DATE.\n" +
      "  1. WHEN IT WAS MADE. Ramesside, in the reign of Ramesses II. An ordinary object date, and the " +
      "     better-founded of the two.\n" +
      "  2. WHAT IT COUNTS BACK TO. Four hundred years earlier. This is not an observation. It is an " +
      "     ANCIENT ERA RECKONING, made by the people who set the stone up, from a starting point THE " +
      "     SURVIVING INSCRIPTION NEVER NAMES.\n" +
      "A timeline that flattened these into one entry would be asserting that the four hundred years are " +
      "real, which is precisely the disputed part.\n\n" +
      "WHOSE REIGN THE YEARS BELONG TO, AND THE LONG-LIVED ERROR ABOUT IT. Line 7 dates the stela to " +
      "'Year 400, month 4 of Shemu, day 4' of a king titled nswt-bj.tj Stẖ-ꜥꜣ-pḥ.tj, sꜣ-Rꜥw Nbw.tj. Current " +
      "scholarship parses those as SETH HIMSELF — Seth great of strength, and the Ombite — given the " +
      "titulary of a reigning king. Breasted in 1906 read them as the personal names of an otherwise unknown " +
      "Hyksos ruler, 'Opehtiset' and 'Nubti', and a great deal of later popular writing follows him. Both " +
      "readings are on this record, the superseded one marked as superseded, because deleting an obsolete " +
      "reading does not remove it from the world — it only removes the explanation.\n\n" +
      "THE FIND THAT CHANGES ANOTHER RECORD. The prayer, in Breasted's own words, hails Seth as 'son of Nut, " +
      "great in strength in the barque of millions of years, overthrowing enemies in front of the barque of " +
      "Re'. This dataset previously had Set's protective solar role only in PICTURES. Here it is in TEXT, on " +
      "a king's monument, in the thirteenth century BCE. BUT THE SURVIVING PRAYER DOES NOT NAME APEP — it " +
      "says 'enemies' — and the lunette is a wine offering, not a combat scene. The passage supports the " +
      "tradition and does not show this stela depicting that battle.\n\n" +
      "SETI IS HIGH PRIEST OF SETH, ḥm-nṯr-tp.j-n-Stẖ, and the two editions agree on it completely. The " +
      "office sits in an unbroken run of civil, military and frontier commands — vizier, commandant of the " +
      "fortress of Tharu, master of horse, royal scribe — held by the man whose family became the Nineteenth " +
      "Dynasty, and his father held a nearly identical set. That is institutional, not a king's private " +
      "devotion, and it is hard to reconcile with Seth being under any official shadow at this date.\n\n" +
      "WHAT IS STILL NOT KNOWN. The event the four hundred years count FROM is not stated anywhere on the " +
      "surviving stone. Proposals exist — the founding or institutionalisation of Seth's cult at Avaris " +
      "among them — and no publication directly making that argument was opened for this record, so they " +
      "are recorded as proposals with that gap admitted.\n\n" +
      "THINGS TO ASK: When an ancient monument does arithmetic, what is it doing? If the era belongs to a " +
      "god given a king's titles, what kind of claim is that?",
    category: "archaeology",
    subcategory: "New Kingdom",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "sutekh", "400-year-stela", "ramesses-ii", "tanis", "avaris", "era"],
    civilisations: ["Ancient Egypt"],
    locationName: "Tanis, Egypt (findspot); probably originally Pi-Ramesses / Qantir",
    people: ["Ramesses II", "Seti", "Paramessu"],
    passages: [
      {
        label: "The opening royal titulary, and the order to make the stela",
        reference: "Lines 1-6",
        sourceKey: "tla_four_hundred_year_stela",
        objectName: "Round-topped rose granite stela, lower part missing; 220 x 134 x 50 cm",
        holdingInstitution: "Egyptian Museum, Cairo",
        accessionNumber: "JdE 60539 (often written JE 60539)",
        notes:
          "THE FIRST PLACE THE TWO EDITIONS PART COMPANY, and it is not over a word of theology. Breasted " +
          "does not print this titulary at all: at section 540 he writes 'Full fivefold titulary' and moves " +
          "on. So the oldest freely available English translation of this stela cannot supply the opening of " +
          "it, and the transliteration below had to come from elsewhere.",
        layers: [
          {
            layer: "primary_object",
            sourceKey: "tla_four_hundred_year_stela",
            content:
              "Round-topped rose granite stela, lower part missing, 220 x 134 x 50 cm. Found in the eastern " +
              "part of the Amun temple at Tanis. The lunette shows Ramesses II offering wine to Seth, with an " +
              "official standing behind him in adoration.",
            evidence:
              "WHAT IS ESTABLISHED: the object's material, shape, surviving dimensions, findspot and the " +
              "subject of its lunette, from the Thesaurus Linguae Aegyptiae object record. THE FINDSPOT IS " +
              "NOT THE ORIGINAL SETTING: the stela is generally held to have come from Pi-Ramesses or " +
              "Qantir, and the Austrian Archaeological Institute records that monuments were carried from " +
              "Pi-Ramesses to Tanis after Pi-Ramesses was abandoned around 1100 BCE. An older literature " +
              "treated Tanis AS Avaris; that premise is no longer tenable, and several early reconstructions " +
              "of this stela rested on it.",
            notes:
              "A PHOTOGRAPH OF THE STELA IS STILL MISSING FROM THIS RECORD. The object is catalogued, " +
              "measured and published, and this dataset has no picture of it.",
          },
          {
            layer: "transliteration",
            sourceKey: "tla_four_hundred_year_stela",
            content:
              "ꜥnḫ Ḥr.w Kꜣ-nḫt-mri̯-Mꜣꜥ.t-nb-ḥb-sd.PL-mj-jtj=f-Ptḥ-Tꜣṯnn nswt-bj.tj " +
              "Wsr-Mꜣꜥ.t-Rꜥw-stp.n-Rꜥw sꜣ-Rꜥw Rꜥw-msi̯-sw-mri̯-Jmn di ꜥnḫ Nb.tj " +
              "mki̯-Km.t-wꜥf-ḫꜣs.t.PL-Rꜥw-msi̯-nṯr.PL-grg-tꜣ.DU Ḥr.w-nbw Wsr-rnp.t.PL-ꜥꜣ-nḫt.w nswt-bj.tj " +
              "Wsr-Mꜣꜥ.t-Rꜥw-stp.n-Rꜥw sꜣ-Rꜥw Rꜥw-msi̯-sw-mri̯-Jmn jty grg-tꜣ.DU m mn.w ḥr rn=f wbn Rꜥw m " +
              "ḥr.t n mrw.t=f nswt-bj.tj Wsr-Mꜣꜥ.t-Rꜥw-stp.n-Rꜥw sꜣ-Rꜥw Rꜥw-msi̯-sw-mri̯-Jmn",
            language: "Egyptian",
            script: "Transliteration in Latin letters",
            evidence:
              "QUOTED, NOT ASSEMBLED. From the Thesaurus Linguae Aegyptiae, whose text follows Kitchen, " +
              "Ramesside Inscriptions II, 287-288, collated with a photograph. A transliteration built from " +
              "memory would be indistinguishable from this one on the page and is the layer a reader is " +
              "least able to check, so it is quoted or it is absent.",
          },
          {
            layer: "translation",
            sourceKey: "tla_four_hundred_year_stela",
            content:
              "Live the Horus, Mighty Bull, beloved of Maat, lord of jubilees like his father Ptah-Tatenen; " +
              "King of Upper and Lower Egypt Usermaatre-setepenre; Son of Re Ramesses-meryamun, given life; " +
              "the Two Ladies, Protector of Egypt, Subduer of Foreign Lands, Re-who-begot-the-gods, Founder " +
              "of the Two Lands; the Golden Horus, Rich in Years, Great in Victories; King of Upper and " +
              "Lower Egypt Usermaatre-setepenre; Son of Re Ramesses-meryamun, the ruler who establishes the " +
              "Two Lands with monuments in his name, for love of whom Re rises in heaven.",
            language: "English",
            evidence:
              "NOT A PUBLISHED ENGLISH TRANSLATION. This is a rendering into English of the Thesaurus " +
              "Linguae Aegyptiae's German, made for this dataset. It is a real and useful row and it is one " +
              "step further from the stone than the rows around it, which is why the distinction is recorded " +
              "rather than left for a reader to guess.",
          },
          {
            layer: "translation",
            sourceKey: "breasted_records_iii",
            content:
              "Live … King Ramses II, sovereign, who equips the Two Lands with monuments in his name, so " +
              "that Re rises in heaven for love of him, King Ramses II. His majesty commanded to make a " +
              "great stela of granite, in the great name of his fathers, in order that the name of his " +
              "grandfather, King Menmare, Son of Re: Seti-Merneptah, might be exalted, enduring and abiding " +
              "forever, like Re, every day.",
            language: "English",
            evidence:
              "BREASTED 1906, VERBATIM, and the disagreement inside it is worth more than the agreement. " +
              "Breasted writes 'his grandfather' and FLAGS IT HIMSELF as problematic, suggesting 'father of " +
              "his fathers' may be preferable. The Thesaurus Linguae Aegyptiae reads jtj jtj.PL=f and gives " +
              "exactly that: father of his fathers.\n\n" +
              "WHY IT MATTERS: the two readings assert different genealogies. 'Grandfather' names a specific " +
              "relationship; 'father of his fathers' is an ancestral formula that need not be one generation " +
              "back. A dataset with one translation field would have silently picked a winner here, and a " +
              "reader would never have known there was a contest.",
            notes:
              "The ellipsis is Breasted's own: he does not print the full titulary, writing 'Full fivefold " +
              "titulary' in its place.",
          },
          {
            layer: "modern_summary",
            sourceKey: null,
            content:
              "Ramesses II names himself with his full titulary and states that he ordered a great granite " +
              "stela to be made, so that the name of his ancestor Seti (Menmaatre Seti-Merenptah) should " +
              "endure. Whether that ancestor is his grandfather specifically, or an ancestor more generally, " +
              "is where the two translations differ.",
            evidence:
              "OUR OWN WORDS, marked as ours. It reports what the layers above contain and adds nothing to " +
              "them — including the disagreement, which a summary is not entitled to resolve.",
          },
        ],
      },
      {
        label: "The dating formula, and Seth in royal titulary",
        reference: "Line 7",
        sourceKey: "tla_four_hundred_year_stela",
        objectName: "Round-topped rose granite stela, lower part missing; 220 x 134 x 50 cm",
        holdingInstitution: "Egyptian Museum, Cairo",
        accessionNumber: "JdE 60539 (often written JE 60539)",
        notes:
          "THE MOST CONSEQUENTIAL LINE ON THE STONE, and the one where a superseded reading is still in " +
          "wide circulation. Read the two translations below against each other before reading anything " +
          "written about this object.",
        layers: [
          {
            layer: "transliteration",
            sourceKey: "tla_four_hundred_year_stela",
            content:
              "rnp.t 400 ꜣbd 4 Šm.w sw 4 nswt-bj.tj Stẖ-ꜥꜣ-pḥ.tj sꜣ-Rꜥw mri̯=f Nbw.tj mri̯ Rꜥw-Ḥr.w-ꜣḫ.tj " +
              "wnn=f r nḥḥ ḏ.t",
            language: "Egyptian",
            script: "Transliteration in Latin letters",
            evidence:
              "QUOTED FROM THE THESAURUS LINGUAE AEGYPTIAE, after Kitchen collated with a photograph. THE " +
              "TWO GROUPS THAT DECIDE THE ARGUMENT: Stẖ-ꜥꜣ-pḥ.tj — Seth, great of strength — and Nbw.tj, the " +
              "Ombite, the god of Nubt. Both stand inside the royal formulae nswt-bj.tj and sꜣ-Rꜥw.",
          },
          {
            layer: "translation",
            sourceKey: "tla_four_hundred_year_stela",
            content:
              "Year 400, month 4 of the Shemu season, day 4, of the King of Upper and Lower Egypt " +
              "Seth-with-great-strength, beloved Son of Re, the Ombite, beloved of Re-Harakhty, existing " +
              "forever and eternity.",
            language: "English",
            evidence:
              "THE CURRENT READING: the royal names in this line are SETH'S OWN. Seth is given the titles of " +
              "a reigning king — King of Upper and Lower Egypt, Son of Re — and the era is reckoned in his " +
              "regnal years. Rendered into English from the TLA's German for this dataset; not a published " +
              "English translation.",
          },
          {
            layer: "translation",
            sourceKey: "breasted_records_iii",
            content:
              "In the year 400, in the fourth month of the third season, on the fourth day, of the King of " +
              "Upper and Lower Egypt: Opehtiset; Son of Re, his beloved: Nubti, whom Harakhte desires to be " +
              "forever and ever …",
            language: "English",
            evidence:
              "BREASTED 1906, VERBATIM, AND THIS IS WHERE A LONG-LIVED ERROR ENTERS. He transcribes the same " +
              "two groups as PERSONAL NAMES — 'Opehtiset', 'Nubti' — and takes them to belong to an " +
              "otherwise unknown Hyksos ruler, so that Year 400 becomes the four-hundredth year of that " +
              "king's era.\n\n" +
              "NOTE WHAT DOES AND DOES NOT DIFFER. The calendar date is the same in both: Shemu IS the third " +
              "season, so 'month 4 of Shemu' and 'the fourth month of the third season' are one reading, not " +
              "two. The entire disagreement is over whether those royal titles name a god or a man.",
            notes:
              "Breasted's own note records the alternative identification with Set. He did not hide the " +
              "question; later writers simply stopped reporting it.",
          },
          {
            layer: "modern_summary",
            sourceKey: null,
            content:
              "The stela dates itself to Year 400, fourth month of Shemu, day 4 — and the reign it counts " +
              "those years in is Seth's. Seth is given a king's titulary and an era of his own.",
            evidence:
              "WHAT THIS SETTLES FOR THE DATASET: the era belongs to a god presented as a king, not to an " +
              "unknown pharaoh. WHAT IT DOES NOT SETTLE, and no line on the stone does: what event the four " +
              "hundred years are counted FROM.",
          },
          {
            layer: "interpretation",
            sourceKey: "breasted_records_iii",
            content:
              "That the royal names belong to a Hyksos ruler, and that Year 400 is the four-hundredth year " +
              "of that ruler's era.",
            viewpoint: "historical",
            evidence:
              "RECORDED AS SUPERSEDED, AND KEPT ANYWAY. This reading is wrong by current scholarship and it " +
              "is the ancestor of a great deal of popular writing about the stela, including the claim that " +
              "it names an unknown Hyksos king. A reader who meets that claim elsewhere should be able to " +
              "find out here where it came from and when it was abandoned. Deleting a superseded reading " +
              "does not remove it from the world; it only removes the explanation.",
            notes: "Breasted 1906. See the current reading in the TLA row above.",
          },
        ],
      },
      {
        label: "Seti's titulary, including High Priest of Seth",
        reference: "Lines 8-10",
        sourceKey: "tla_four_hundred_year_stela",
        objectName: "Round-topped rose granite stela, lower part missing; 220 x 134 x 50 cm",
        holdingInstitution: "Egyptian Museum, Cairo",
        accessionNumber: "JdE 60539 (often written JE 60539)",
        notes:
          "THE ONE PLACE WHERE BOTH EDITIONS AGREE COMPLETELY, on the detail that matters most to this " +
          "dataset: ḥm-nṯr-tp.j-n-Stẖ, High Priest of Seth, held by the father of a future dynasty.",
        layers: [
          {
            layer: "transliteration",
            sourceKey: "tla_four_hundred_year_stela",
            content:
              "jr.j-pꜥ.t jm.j-rʾ-nʾ.t ṯꜣ.tj ṯꜣ.y-ḫw-ḥr-wnm.j-nswt ḥr.j-pḏ.t.PL jm.j-rʾ-ḫꜣs.t.PL jm.j-rʾ-ḫtm n " +
              "Ṯꜣr.w wr-n-mḏꜣ.w.PL sẖꜣ.w-nswt jm.j-rʾ-ssm.PL sšm-ḥb n Bꜣ-nb-Ḏd.t ḥm-nṯr-tp.j-n-Stẖ ẖr.j-ḥb n " +
              "Wꜣḏ.jt wp.t-Tꜣ.DU jm.j-rʾ-ḥm.PL-nṯr n nṯr.PL nb.PL Stẖ.y mꜣꜥ-ḫrw",
            language: "Egyptian",
            script: "Transliteration in Latin letters",
            evidence:
              "QUOTED FROM THE THESAURUS LINGUAE AEGYPTIAE. ḥm-nṯr-tp.j-n-Stẖ is explicitly High Priest of " +
              "Seth, and it sits in an unbroken sequence of civil, military, frontier-administration and " +
              "priestly offices — not as an isolated religious curiosity.",
          },
          {
            layer: "translation",
            sourceKey: "breasted_records_iii",
            content:
              "the hereditary prince, governor of the (residence) city, vizier, fan-bearer on the right of " +
              "the king, chief of bowmen, governor of foreign countries, commandant of the fortress of " +
              "Tharu, chief of the foreign gendarmes, king's-scribe, master of horse, chief priest of the " +
              "Ram-god, lord of Mendes, High Priest of Set, ritual priest of Buto-Upet-Towe, chief of " +
              "prophets of all gods, Seti, triumphant",
            language: "English",
            evidence:
              "BREASTED 1906, VERBATIM, AND UNCONTESTED HERE. The 1906 translation and the modern " +
              "transliteration agree on this passage, which is why it can be quoted without hedging. The " +
              "stela goes on to name Seti's father Paramessu, holding a closely parallel run of offices, and " +
              "his mother Tia, lady of the house and musician of Re.",
          },
          {
            layer: "modern_summary",
            sourceKey: null,
            content:
              "Seti is titled across the whole apparatus of the Ramesside state — vizier, commandant of the " +
              "frontier fortress of Tharu, master of horse, royal scribe — and, among those offices, High " +
              "Priest of Seth. His father held a nearly identical set.",
            evidence:
              "WHY THIS IS EVIDENCE AND NOT COLOUR: the office is institutional, hereditary in effect, and " +
              "held alongside the vizierate by the family that became the Nineteenth Dynasty. That is a very " +
              "different thing from a king privately favouring a god, and it is hard to reconcile with Seth " +
              "being under any kind of official shadow at this date.",
          },
        ],
      },
      {
        label: "The prayer to Seth: in the bow of the barque of Re",
        reference: "Lines 11-12, breaking off; line 13 onwards destroyed",
        sourceKey: "tla_four_hundred_year_stela",
        objectName: "Round-topped rose granite stela, lower part missing; 220 x 134 x 50 cm",
        holdingInstitution: "Egyptian Museum, Cairo",
        accessionNumber: "JdE 60539 (often written JE 60539)",
        notes:
          "THE PASSAGE THAT CONNECTS THIS RECORD TO THE PICTURES. Read it beside the record of Set spearing " +
          "Apep — and then read the caution at the end of it, which is equally important.",
        layers: [
          {
            layer: "transliteration",
            sourceKey: "tla_four_hundred_year_stela",
            content:
              "[j]:nḏ ḥr=k Stẖ sꜣ-Nw.t ꜥꜣ-pḥ.tj m wjꜣ-n-ḥḥ.w ḫr ḫft.w m ḥꜣ.t wjꜣ-n-Rꜥw ꜥꜣ hmhm.t ⸮m? … " +
              "⸢di⸣=[k] [n]=⸢j⸣ ꜥḥꜥ.w nfr ḥr šms kꜣ=k jw=j mn m …",
            language: "Egyptian",
            script: "Transliteration in Latin letters",
            evidence:
              "QUOTED FROM THE THESAURUS LINGUAE AEGYPTIAE, WITH ITS EDITORIAL MARKS LEFT IN. The brackets, " +
              "the half-brackets and the question mark are the edition's own signals of damage and doubt, " +
              "and they are kept rather than tidied away: a clean-looking transliteration of a broken stone " +
              "is a small lie about how much survives.",
            notes: "The TLA marks line 13 onwards as destroyed. The lower part of the stela is missing.",
          },
          {
            layer: "translation",
            sourceKey: "breasted_records_iii",
            content:
              "Hail to thee, O Set, son of Nut, great in strength in the barque of millions of years, " +
              "overthrowing enemies in front of the barque of Re, great in terror, [grant me] a happy life " +
              "following thy ka, while I remain in …",
            language: "English",
            evidence:
              "BREASTED 1906, VERBATIM. THIS IS THE FIND. A Ramesside royal monument states in TEXT what " +
              "this dataset previously had only in PICTURES: that Seth stands at the front of Re's barque " +
              "and overthrows its enemies. The protective solar role is not an art-historical inference from " +
              "a Book of the Dead vignette — it is asserted on a king's stela.\n\n" +
              "AND NOW THE CAUTION, WHICH MATTERS AS MUCH. THE SURVIVING PRAYER DOES NOT NAME APEP. It says " +
              "'enemies'. The lunette of this stela shows a wine offering, not a combat. So this passage " +
              "supports the protective-solar-barque tradition and does NOT show this stela depicting or " +
              "naming the Apep battle, and the difference is exactly the kind a record like this exists to " +
              "hold on to.",
            notes:
              "The bracketed words and the trailing ellipsis are Breasted's: the text breaks off in damage.",
          },
          {
            layer: "modern_summary",
            sourceKey: null,
            content:
              "The stela addresses Seth directly as son of Nut, great of strength in the barque of millions " +
              "of years, overthrowing enemies at the front of Re's barque, and asks him for a good lifetime " +
              "in his service. The petition breaks off in damage.",
            evidence:
              "WHAT IT ESTABLISHES: Seth's protective solar role, in a dated royal text, in the thirteenth " +
              "century BCE. WHAT IT DOES NOT: that the enemy in question is Apep, or that this monument " +
              "depicts that battle.",
          },
        ],
      },
      {
        label: "The lunette: what the inscription calls the god",
        reference: "Lunette (Bildfeld)",
        sourceKey: "tla_four_hundred_year_stela",
        objectName: "Round-topped rose granite stela, lower part missing; 220 x 134 x 50 cm",
        holdingInstitution: "Egyptian Museum, Cairo",
        accessionNumber: "JdE 60539 (often written JE 60539)",
        notes:
          "A PASSAGE RECORDED SO THAT ITS ABSENCE IS VISIBLE. The reading usually quoted for the lunette " +
          "could not be verified, and an unverified reading in the place where a verified one belongs is " +
          "worse than an empty row.",
        layers: [
          {
            layer: "primary_object",
            sourceKey: "tla_four_hundred_year_stela",
            content:
              "Ramesses II offers wine to Seth. An official stands behind the king in adoration.",
            evidence:
              "AGREED BY BOTH EDITIONS: the TLA object description and Breasted at section 539 both describe " +
              "the lunette as Ramesses II offering wine to Set. The god is shown in the distinctive " +
              "iconography usually described as foreign or Asiatic in character.",
          },
          {
            layer: "transliteration",
            sourceKey: null,
            contentAbsentReason:
              "NOT FOUND. The phrase conventionally rendered 'Seth of Ramesses' is widely quoted for this " +
              "lunette. The Thesaurus Linguae Aegyptiae carries a separate lunette subtext based on Kitchen " +
              "and a photograph, and the phrase could not be safely extracted from the accessible display. " +
              "IT IS NOT RECONSTRUCTED HERE. A plausible transliteration in this row would be indistinguish" +
              "able from a quoted one and would sit in the most authoritative-looking position on the page.",
            evidence:
              "A CITATION-ONLY ROW, WHICH IS A REAL ROW. It records that the text exists, where it is " +
              "published, and that this dataset has not read it — which is a different and more useful " +
              "statement than silence. The reading to check is in the TLA's lunette subtext, and behind that " +
              "Kitchen, Ramesside Inscriptions II, 287-288.",
          },
          {
            layer: "modern_summary",
            sourceKey: null,
            content:
              "The lunette shows the king offering wine to Seth, in iconography commonly described as " +
              "Asiatic. What the lunette inscription calls the god has not been verified for this dataset.",
            evidence:
              "THE SCENE AND THE LABEL ARE TWO CLAIMS, and only one of them is currently supported. The " +
              "iconographic claim rests on both editions describing the scene; the textual claim rests on " +
              "nothing yet.",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "four_hundred_year_stela",
        startYear: -1278,
        endYear: -1212,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the stela was made",
        originalDateText: "In the reign of Ramesses II",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the manufacture of the monument, placed by the king it names. WHY A RANGE RATHER " +
          "THAN A YEAR: the reign is long and the stela's position within it is debated. This is the securer " +
          "of the object's two dates.",
        notes:
          "VERIFIED that the stela is of Ramesses II's reign: the Thesaurus Linguae Aegyptiae object record " +
          "and Breasted agree, and the king's titulary opens the text. NEEDS SOURCE VERIFICATION still for " +
          "the regnal dates used in the conversion, and for any proposed year WITHIN the reign.",
      },
      {
        sourceKey: "four_hundred_year_stela",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "What the four hundred years are counted from",
        originalDateText: "The four-hundredth year of Sutekh",
        datingMethod: "source_assertion",
        chronology: "traditional",
        evidence:
          "WHAT KIND OF CLAIM THIS IS: an era reckoning performed in antiquity, not a modern dating result. " +
          "WHY IT IS FILED AS POSITIONLESS RATHER THAN AS A CALCULATED DATE: a calculated date would put a " +
          "point on the timeline, and this dataset would then be the one asserting it. " +
          "WHY NO START YEAR IS ENTERED: subtracting four hundred from the stela's own date would produce a " +
          "figure this dataset would then be asserting, and what the era counts from is exactly what is " +
          "disputed. The arithmetic is easy and the meaning is not, and entering the easy part would " +
          "misrepresent the hard part as settled. WHAT IS ESTABLISHED, and it is now established from the " +
          "stone rather than from report: that the stela makes the claim, and that THE SURVIVING " +
          "INSCRIPTION NEVER NAMES THE EVENT THE COUNT STARTS FROM. That silence is a finding. It means " +
          "every proposal about the era is an argument from outside the object.",
        notes:
          "THE INSCRIPTION'S OWN WORDING IS NOW ON THIS RECORD, in transliteration and in two translations: " +
          "rnp.t 400 ꜣbd 4 Šm.w sw 4. The two editions agree on the calendar date — Shemu IS the third " +
          "season, so Breasted's 'fourth month of the third season' and the TLA's 'month 4 of Shemu' are one " +
          "reading, not two.\n\n" +
          "STILL NEEDS SOURCE VERIFICATION: the range of scholarly proposals about what the era counts from. " +
          "No publication directly arguing for a particular founding event was opened — Sethe 1930, Montet " +
          "1933 and Habachi are the trail to follow, and none was read.",
      },
    ],
  },

  {
    slug: "nineteenth-dynasty-named-for-set",
    title: "Kings named for Set: Seti I and the Nineteenth Dynasty",
    summary:
      "Thirteenth century BCE. A pharaoh takes a throne name meaning 'he of Set' — the strongest single argument against the idea that Set was Egypt's devil.",
    description:
      "WHAT KIND OF RECORD IS THIS? A fact that is very hard to argue with and very widely left out.\n\n" +
      "THE FACT. Seti I, father of Ramesses II, bears a name built on Set. Kings of the Nineteenth Dynasty " +
      "carry Set in their names and honour him in their monuments. The dynasty's own roots lie in the eastern " +
      "Delta, where Set's cult was strong.\n\n" +
      "WHY IT SETTLES SOMETHING. Names in Egyptian royal titulary are theological statements made in public, " +
      "permanently, in stone. No Egyptian king was named for the enemy of order. That a king was named for " +
      "Set, several centuries after the Hyksos expulsion and several centuries before the Greeks arrived, " +
      "places the demonisation firmly outside this period.\n\n" +
      "WHAT IT DOES NOT SETTLE. Whether the honour was universal or regional; how the rest of Egypt regarded " +
      "a Delta dynasty's Delta god; and whether there were places or periods within this same era where Set " +
      "was already treated with hostility. Egypt was not uniform, and the dataset's decline records are " +
      "deliberately not written as a single national switch.\n\n" +
      "A SMALL DETAIL WORTH KNOWING. In some inscriptions in the Osiris temple at Abydos, Seti I's name is " +
      "written with a different sign in place of the Set animal — a courtesy to the god Set was held to have " +
      "killed, in that god's own house. If that is right, it shows Egyptians were entirely capable of holding " +
      "both ideas at once, in the same reign, and choosing which to display by location. NEEDS SOURCE " +
      "VERIFICATION: this is reported here from secondary knowledge and has not been checked against the " +
      "inscriptions.\n\n" +
      "THINGS TO ASK: What would you have to believe about a god to put his name in your own?",
    category: "history",
    subcategory: "New Kingdom",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "seti-i", "nineteenth-dynasty", "ramesses-ii", "titulary", "abydos"],
    civilisations: ["Ancient Egypt"],
    people: ["Seti I", "Ramesses II"],
    claims: [
      {
        sourceKey: null,
        startYear: -1289,
        endYear: -1278,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The reign of Seti I",
        originalDateText: "Roughly 1290-1279 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: a reign, on conventional New Kingdom chronology, which is better founded than the " +
          "earlier periods in this dataset but still carries competing high, middle and low schemes differing " +
          "by decades.",
        notes: "NEEDS SOURCE VERIFICATION against a current New Kingdom chronology.",
      },
    ],
  },

  {
    slug: "egyptian-hittite-treaty-sutekh",
    title: "Sutekh witnesses a treaty between empires",
    summary:
      "About 1259 BCE. In the earliest surviving peace treaty between two great powers, preserved from both sides, Set stands among the gods who guarantee the oath.",
    description:
      "WHAT KIND OF RECORD IS THIS? Set doing state business, in a document that survives in two languages " +
      "from two archives.\n\n" +
      "WHAT THE DOCUMENT IS. After years of war culminating at Kadesh, Egypt under Ramesses II and Hatti " +
      "concluded a parity treaty. Egyptian versions are carved at Karnak and the Ramesseum; Akkadian tablets " +
      "were found at Hattusa in Anatolia. Having both sides of an ancient international agreement is rare " +
      "enough to be remarkable on its own.\n\n" +
      "WHERE SET IS IN IT. Among the divine witnesses invoked to guarantee the oath. Treaties of this kind " +
      "list the gods of both parties as guarantors, and Sutekh appears in that capacity.\n\n" +
      "WHY THAT MATTERS HERE. A witness god is a god whose oath BINDS. You do not call on chaos to guarantee " +
      "a peace. This is Set functioning as an instrument of the state's most solemn commitment, in the same " +
      "century as the 400-Year Stela and the Nineteenth Dynasty's Set-names — three independent kinds of " +
      "evidence pointing the same way.\n\n" +
      "THE HONEST LIMIT. Neither version has been read here. Which Sutekh or Sutekhs of which places appear " +
      "in the witness list is a real question in the literature, because the Hittite storm god is rendered " +
      "with the same sign in Egyptian, and this record does not claim to have resolved it.\n\n" +
      "THINGS TO ASK: What does it mean that two empires could agree on whose gods count? What happens to a " +
      "treaty when one side's god falls out of favour?",
    category: "history",
    subcategory: "New Kingdom",
    eventType: "historical",
    identificationStatus: "probable",
    tags: ["set", "sutekh", "hittites", "treaty", "ramesses-ii", "kadesh", "hattusa"],
    civilisations: ["Ancient Egypt", "Hittite Empire"],
    locationName: "Karnak, Egypt, and Hattusa, Anatolia",
    people: ["Ramesses II"],
    claims: [
      {
        sourceKey: "egyptian_hittite_treaty",
        startYear: -1258,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "When the treaty was concluded",
        originalDateText: "Year 21 of Ramesses II",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the treaty, by its own regnal year, converted to a BCE figure using the " +
          "conventional chronology of the reign. WHY IT IS FLAGGED APPROXIMATE DESPITE BEING A YEAR: the " +
          "regnal year is exact and the conversion is not. The stated year depends entirely on which " +
          "chronology of Ramesses II is used, and they differ. The record keeps the ancient statement — " +
          "'Year 21' — beside the modern conversion for that reason.",
        notes: "NEEDS SOURCE VERIFICATION for both the regnal year and the conversion used.",
      },
      {
        sourceKey: "egyptian_hittite_treaty",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Which Sutekh appears in the witness list",
        originalDateText: "Disputed; the writing does not distinguish as sharply as a modern reader wants",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHY THIS IS A SEPARATE CLAIM: Egyptian scribes used the Set sign to render the Levantine and " +
          "Anatolian storm gods as well as Set. So 'Sutekh witnesses the treaty' may mean the Egyptian god, " +
          "the Hittite storm god written Egyptian-fashion, or several local Sutekhs listed by place. WHAT IS " +
          "ESTABLISHED: the sign is there. WHAT IS NOT: exactly whom it names in each instance.",
        notes:
          "NEEDS SOURCE VERIFICATION. This is the detail a reader would most want checked and it has not " +
          "been checked here.",
      },
    ],
  },

  {
    slug: "late-period-persecution-of-set",
    title: "The late turn against Set: erasure, and a cult driven to the margins",
    summary:
      "Roughly the first millennium BCE. Set's images are attacked, his name removed, and hostile ritual texts are composed — unevenly, over centuries, not by decree on a date.",
    description:
      "WHAT KIND OF RECORD IS THIS? The change everybody wants a date for, recorded without one.\n\n" +
      "WHAT IS OBSERVABLE. Over the Third Intermediate and Late Periods, evidence accumulates of hostility: " +
      "Set figures chiselled out of reliefs, his name replaced in inscriptions, ritual texts for the " +
      "destruction of the enemy of Osiris, and a cult presence that thins out in the Nile Valley.\n\n" +
      "WHAT IS NOT OBSERVABLE, AND IS ROUTINELY SUPPLIED ANYWAY. A moment, a reign, a decree, a cause. There " +
      "is no Egyptian equivalent of a date on which Set was declared evil, and every popular account that " +
      "gives one has made it up or borrowed it from someone who did.\n\n" +
      "WHY IT WAS UNEVEN. Egypt is a long country with strong regional cults. The evidence suggests Set fell " +
      "away in some places long before others, and that in the oases in particular he was still receiving " +
      "cult when the valley had turned against him. A single national switch is the wrong shape for what the " +
      "evidence shows.\n\n" +
      "CANDIDATE EXPLANATIONS, HELD AS CANDIDATES. The growing dominance of Osiris; repeated foreign " +
      "occupation making a god of the foreign intolerable; the Hyksos memory; Greek identification with " +
      "Typhon reinforcing what was already under way. Several may be true at once. None is demonstrated here.\n\n" +
      "THINGS TO ASK: How would you date a change of attitude, as opposed to an event? What evidence could " +
      "even in principle show when a feeling shifted?",
    category: "religion",
    subcategory: "Late Period",
    eventType: "mainstream",
    identificationStatus: "probable",
    tags: ["set", "erasure", "late-period", "osiris", "demonisation", "regional"],
    civilisations: ["Ancient Egypt"],
    claims: [
      {
        sourceKey: null,
        startYear: -999,
        endYear: -299,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period over which hostility to Set becomes visible in the evidence",
        originalDateText: "Third Intermediate and Late Periods, very roughly the first millennium BCE",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the accumulation of hostile evidence, not a decision. WHY THE RANGE IS SO WIDE, " +
          "AND WHY IT IS HONEST FOR IT TO BE: a seven-century range looks like a failure of precision and is " +
          "in fact the shape of the thing. Narrowing it would mean claiming a resolution the evidence does " +
          "not carry. WHAT WOULD IMPROVE THIS RECORD: dated instances of erasure, site by site, which would " +
          "replace one vague span with a map of many precise ones.",
        notes:
          "PARTLY ANSWERED, AND NOT IN THE DIRECTION THIS RECORD EXPECTED. Hope and Warfe, having gone " +
          "through the material, conclude that the attack on Seth's image 'cannot be considered systematic " +
          "or complete' (2017, page 281). They separate religious vilification from physical erasure and " +
          "treat vilification as specific to its cult context; they find the damage real but selective, and " +
          "often accompanied by damage to other signs; and they note that some erasures may fall outside " +
          "the first millennium BCE altogether, earlier or later.\n\n" +
          "SO THE SEVEN-CENTURY RANGE ABOVE IS NOT MERELY IMPRECISE — IT MAY BE THE WRONG INSTRUMENT. What " +
          "the evidence appears to support is not a national process with fuzzy edges but a set of local " +
          "acts whose timing, motive and completeness differ. See the Dakhleh records: at Mut, a doorway " +
          "block has Seth's name overwritten from the Twenty-fifth Dynasty onward while the same temple is " +
          "being maintained, expanded and given donations.\n\n" +
          "STILL NEEDS SOURCE VERIFICATION for dated instances of erasure site by site in the Nile Valley, " +
          "which would replace this record with a set of them. Hope and Warfe deliberately do NOT supply " +
          "ban dates by region, and this dataset must not manufacture the map they declined to draw.",
      },
    ],
  },

  {
    slug: "set-survives-in-the-oases",
    title: "Dakhleh: where Seth's story stops being one story",
    summary:
      "Seth's cult at Mut el-Kharab runs to the end of the Ptolemaic period, contemporary with hostility to him elsewhere. It was not untouched — his name was overwritten there too — and it was not continuous.",
    description:
      "WHAT KIND OF RECORD IS THIS? The synthesis of the Dakhleh objects, and a record that has been " +
      "substantially rewritten because reading the excavation reports changed what it could say — in both " +
      "directions.\n\n" +
      "WHAT THIS RECORD USED TO SAY, AND WHY IT WAS WRONG. It was titled 'Set outlasts his own disgrace in " +
      "the western oases' and described a place the valley's hostility did not reach. That is too clean. At " +
      "Mut el-Kharab a temple doorway block has Seth's name overwritten — the crouching Seth-animal " +
      "determinative and 'great of strength' replaced by a seated-god sign and 'the great god' — dated from " +
      "the Twenty-fifth Dynasty onward, and later writings on unpublished material from the site also avoid " +
      "the Seth animal. THE OASIS WAS NOT A REFUGE FROM THE CHANGE. It had its own version of it.\n\n" +
      "WHAT SURVIVED THE CORRECTION, AND IT IS THE LOAD-BEARING PART. The overlap is real. The alteration of " +
      "Seth's name at Mut is CONTEMPORARY with continued temple maintenance and expansion, continued " +
      "donations, Seth-bearing personal names, a Twenty-fifth Dynasty royal decree with Seth presiding over " +
      "its upper scene, and demotic ostraka recording donations to Seth into the late Ptolemaic period. So " +
      "the Dakhleh material really does sit in the same centuries as vilification and erasure elsewhere, " +
      "and it really does show a different trajectory. 'Egypt turned against Set' remains the wrong shape " +
      "for the evidence.\n\n" +
      "WHAT THE EXCAVATORS CONCLUDE, IN THEIR OWN WORDS. The attack on Seth's image 'cannot be considered " +
      "systematic or complete' (Hope and Warfe 2017, page 281). They argue that religious vilification and " +
      "physical erasure are different phenomena; that vilification is specific to its cult context; that " +
      "damage to Seth is real but selective and often accompanies damage to other signs; that some erasures " +
      "may predate or postdate the first millennium BCE; and that what survives depends on accessibility, " +
      "reuse, visibility and WHICH ASPECT of Seth was shown.\n\n" +
      "NOTE WHAT THEY DO NOT PROVIDE. A table of ban dates by region. Their model is contextual rather than " +
      "cartographic, and this dataset does not manufacture the map they declined to draw.\n\n" +
      "IT WAS NOT CONTINUOUS, AND THE PUBLICATIONS' OWN WORD INVITES THE MISREADING. Site summaries say " +
      "veneration is documented 'continuously' to the end of the Ptolemaic period. The object record behind " +
      "that word is CLUSTERS: a Ramesside cluster, a Libyan and Twenty-fifth Dynasty cluster, a late " +
      "Ptolemaic cluster, with reused pieces between them. A gap in site material between the early Old " +
      "Kingdom and the New Kingdom is noted outright. An object-by-object cult sequence is not established, " +
      "and this record does not claim one.\n\n" +
      "HOW LATE IT ACTUALLY RUNS, KEPT SEPARATE BY PLACE. At MUT, securely to the end of the Ptolemaic " +
      "period; Hope and Warfe call Roman evidence for Seth's cult there SCANT. Elsewhere in DAKHLEH, Seth " +
      "appears among the deities painted in the Tutu temple mammisi at Ismant el-Kharab, a cult that ran " +
      "into the early fourth century CE. THOSE ARE TWO DIFFERENT SITES and the later one must not be " +
      "relabelled as the earlier. Mut was a bishop's seat in the fourth century with a church and pottery " +
      "running to the sixth or seventh — which dates Christian occupation, not the last act of Seth's cult.\n\n" +
      "THE DISTINCTION THE WHOLE RECORD TURNS ON. Occupation is not cult. A standing temple is not a " +
      "continuing one, and pottery in a stratum shows that people were there, not that anyone was making " +
      "offerings.\n\n" +
      "THINGS TO ASK: If a god's name is being rewritten in the same decades his temple is being given " +
      "property, what is happening to him? Is there one word for it?",
    category: "archaeology",
    subcategory: "Late Period",
    eventType: "archaeological_interpretation",
    identificationStatus: "secure",
    tags: ["set", "dakhla", "mut-el-kharab", "oasis", "survival", "regional", "proscription"],
    civilisations: ["Ancient Egypt"],
    locationName: "Mut el-Kharab, Dakhla Oasis, Egypt",
    claims: [
      {
        sourceKey: "hope_warfe_2017",
        endYear: -30,
        startYear: -1294,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The span of evidenced Seth cult at Mut el-Kharab",
        originalDateText: "From the Ramesside stela to the late Ptolemaic donation ostraka",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT THE TWO ENDS REST ON. The early end is the Ramesside hymn stela, which the excavators call " +
          "the earliest evidence for Seth's cult at the site — a statement about excavation, not about when " +
          "the cult began. The late end is the demotic ostraka recording donations to Seth, running to the " +
          "close of the Ptolemaic period.\n\n" +
          "WHAT THIS RANGE IS NOT: a continuous sequence. The evidence inside it is clusters — Ramesside, " +
          "Libyan and Twenty-fifth Dynasty, late Ptolemaic — with reused pieces and gaps between. The span " +
          "is the outer bound of the evidence, not a claim that every century within it is attested.",
        notes:
          "NEEDS SOURCE VERIFICATION for the ostraka, whose individual object numbers were not accessible. " +
          "That is the weakest point in the late end of this range.",
      },
      {
        sourceKey: "hope_warfe_2017",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether Dakhleh escaped the hostility seen elsewhere",
        originalDateText: "No. Seth's name was overwritten at Mut too, from the Twenty-fifth Dynasty onward",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "THE CORRECTION THIS RECORD WAS REWRITTEN AROUND. The oasis is routinely described, including by " +
          "an earlier version of this record, as the place Seth's cult was left alone. A temple doorway " +
          "block at Mut has his determinative and epithet overwritten, and later writings on unpublished " +
          "site material avoid the Seth animal.\n\n" +
          "WHAT THAT DOES AND DOES NOT DO TO THE ARGUMENT. It kills 'the oases were untouched'. It does not " +
          "kill the regional point, because the same site and the same centuries also give continued " +
          "donations, temple expansion, Seth-theophoric names and a royal decree with Seth in its upper " +
          "scene. The finding is not shelter. It is a DIFFERENT TRAJECTORY, and a stranger one.",
      },
      {
        sourceKey: "hope_warfe_2017",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the attack on Seth was systematic",
        originalDateText: "It 'cannot be considered systematic or complete' — Hope and Warfe 2017, page 281",
        datingMethod: "source_assertion",
        chronology: "archaeological",
        evidence:
          "QUOTED, NOT PARAPHRASED, because this sentence is the thing the dataset's whole late-period " +
          "section has been circling. WHAT IT LICENSES: recording erasure site by site rather than as a " +
          "national event. WHAT IT DOES NOT LICENSE: a claim that nothing happened. Damage to Seth is real; " +
          "it is selective, contextual, and frequently accompanies damage to other signs.",
        notes:
          "The excavators explicitly do NOT supply ban dates by region. Their model is contextual rather " +
          "than cartographic, and a regional map built on this paper would be this dataset's invention.",
      },
    ],
  },

  {
    slug: "mut-el-kharab-ramesside-seth-stela",
    title: "A sandstone stela at Mut el-Kharab: the earliest Seth at Dakhleh",
    summary:
      "Ramesside. A hymn to Seth, son of Nut, found face-down in a paving. Its excavators call it the earliest evidence for the cult of Seth at Mut el-Kharab — and only its first two lines can be read.",
    description:
      "WHAT KIND OF RECORD IS THIS? The object the whole oasis argument rests on, given a record of its own " +
      "so that the argument can be checked against a thing rather than against a sentence.\n\n" +
      "WHAT IT IS. Local reddish sandstone, 109 centimetres of surviving height, 37 centimetres wide at the " +
      "base tapering to 34, 20 thick. Sunk relief, crudely and schematically carved, with residual red and " +
      "blue pigment still on it. The top and the lower-left corner are gone, a large loss runs through the " +
      "middle-right, and the lower surface is abraded — because the stela ended its life face-down as a " +
      "paving slab, walked on.\n\n" +
      "WHAT THE EXCAVATORS SAY IT IS FOR. 'It is currently the earliest evidence for the cult of Seth at Mut " +
      "el-Kharab' (Hope and Kaper 2010, page 143). Note the word CURRENTLY. They are describing the state of " +
      "excavation, not the age of the cult.\n\n" +
      "HOW MUCH OF IT CAN ACTUALLY BE READ, WHICH IS THE PART USUALLY LEFT OUT. The hymn has nine lines. " +
      "Only the first two form substantially readable text. From line three onward, in the excavators' own " +
      "account, no sentences can be read at all — only disconnected words. The names of the donor family are " +
      "largely illegible. A record that quoted the opening line and moved on would be reporting a legible " +
      "monument, and this is not one.\n\n" +
      "WHY IT IS DATED THE WAY IT IS, AND WHY THAT IS WEAKER THAN IT SOUNDS. Ramesside, on the strength of " +
      "parallels for the prayers and hymns to Seth — stylistic and epigraphic, not a sealed context. The " +
      "reuse tells us nothing: Hope and Kaper could not date the paving. Worse, the deposits around it " +
      "disagree with each other. Ptolemaic ostraka came from nearby basal levels in one unit; contexts " +
      "beneath the room walls in another held Early Dynastic and Old Kingdom sherds with nothing later. THE " +
      "AUTHORS STRESS THE DISPARITY RATHER THAN USING EITHER DEPOSIT TO DATE THE STELA, and that restraint " +
      "is the model this dataset tries to follow.\n\n" +
      "THINGS TO ASK: What is the earliest evidence for a cult, as opposed to the earliest evidence anyone " +
      "has dug up? How would you tell the difference?",
    category: "archaeology",
    subcategory: "New Kingdom",
    eventType: "archaeological_interpretation",
    identificationStatus: "secure",
    tags: ["set", "dakhla", "mut-el-kharab", "oasis", "ramesside", "stela", "hymn"],
    civilisations: ["Ancient Egypt"],
    locationName: "Mut el-Kharab, Dakhla Oasis, Egypt",
    passages: [
      {
        label: "The hymn to Seth, son of Nut",
        reference: "Lines 1-9; only lines 1-2 substantially readable",
        sourceKey: "hope_kaper_2010",
        objectName: "Sandstone stela with a hymn to Seth; surviving height 109 cm, width 37 cm tapering to 34 cm, thickness 20 cm",
        holdingInstitution: "Not established in the accessible publication",
        notes:
          "THE EXCAVATION NUMBER AND THE CURRENT LOCATION OF THIS STELA ARE BOTH UNKNOWN TO THIS DATASET. " +
          "That is an uncomfortable gap on the object the oasis argument rests on, and it is recorded rather " +
          "than glossed over.",
        layers: [
          {
            layer: "primary_object",
            sourceKey: "hope_kaper_2010",
            content:
              "Local reddish sandstone. Surviving height 109 cm; width 37 cm at the base tapering to 34 cm; " +
              "thickness 20 cm. Top and lower-left corner missing; large loss from the middle-right; lower " +
              "surface abraded by reuse. Sunk relief, crude and schematic, with residual red and blue " +
              "pigment. Upper scene: three damaged deities. Lower register: a donor, two women and a male " +
              "child. Found at the entrance of the small room west of excavation unit 18 and north of unit " +
              "25, reused face-down within a paving.",
            evidence:
              "MEASURED AND DESCRIBED BY ITS EXCAVATORS. The findspot is a REUSE context: the stela was a " +
              "paving slab when it was found, which is why the lower face is worn. WHAT THE CONTEXT CANNOT " +
              "DO: date it. Hope and Kaper could not date the laying of the pavement, and the deposits " +
              "nearby disagree — Ptolemaic ostraka in one unit, Early Dynastic and Old Kingdom sherds with " +
              "nothing later beneath walls in another.",
          },
          {
            layer: "transliteration",
            sourceKey: "hope_kaper_2010",
            content:
              "dwA %tX sA Nw.t nTr aA nb p.t my […] / wn [...]=k nty Hr aA.wy n.w p.t [...] / [... …] mAa […] " +
              "/ [… …] m [t]A Ha.t […] isf.t(?) […] / [… …] n=k m[…] nb m […] / [… …] itn […] =k m St.w / " +
              "[… … …] Hr nfrw.t snb anx / […] mw [… …] wab nb.t […] / […] Sdi m [… … …]",
            language: "Egyptian",
            script: "Transliteration in Latin letters",
            evidence:
              "QUOTED FROM HOPE AND KAPER 2010, PAGE 148, WITH ITS BRACKETS INTACT. Count them. The square " +
              "brackets and ellipses are most of this text, and they are the honest shape of it: nine lines " +
              "survive as damage with words in it. Tidying them away would turn a wrecked hymn into a " +
              "readable one.",
            notes: "The Seth determinative is not safely legible from the text as extracted. Figure inspection is required.",
          },
          {
            layer: "translation",
            sourceKey: "hope_kaper_2010",
            content:
              "Adoring Seth the son of Nut, the Great God, Lord of Heaven. Come … open … the one who is at " +
              "the doors of heaven … …in the prow … evil … … sun … tortoise … on account of the beauty, " +
              "health and life… … recite … …",
            language: "English",
            evidence:
              "HOPE AND KAPER 2010, PAGE 149, VERBATIM. WHAT SURVIVES INTACT is the opening address: Seth, " +
              "son of Nut, the Great God, Lord of Heaven. That is a god being praised, at Dakhleh, on a " +
              "monument set up by a named family. AFTER THAT IT IS WORDS, not sentences — and one of those " +
              "words is 'prow', which is tantalising beside the 400-Year Stela's placing of Seth at the bow " +
              "of Re's barque, AND IS NOT AN ARGUMENT. A disconnected word in a broken line cannot carry a " +
              "parallel, and this record does not let it.",
          },
          {
            layer: "modern_summary",
            sourceKey: null,
            content:
              "A Ramesside stela from Mut el-Kharab opens by adoring Seth as son of Nut, Great God, Lord of " +
              "Heaven, and was dedicated by a family shown in its lower register. Its excavators consider it " +
              "the earliest evidence so far found for Seth's cult at the site. Two of its nine lines can be " +
              "read.",
            evidence:
              "WHAT IT ESTABLISHES: Seth worshipped at Dakhleh in the Ramesside period, by private " +
              "individuals, in a temple enclosure. WHAT IT DOES NOT: how long before this, what the cult " +
              "did, or anything at all from line three onward.",
          },
        ],
      },
      {
        label: "The upper scene: Amun, Seth and Nephthys — a reconstruction, not a survival",
        reference: "Upper register; heads and top lost",
        sourceKey: "hope_kaper_2010",
        objectName: "Sandstone stela with a hymn to Seth",
        notes:
          "KEPT AS A SEPARATE PASSAGE BECAUSE THE IDENTIFICATION IS INFERRED. Merging it into the object " +
          "description would let a reasoned reconstruction read as surviving iconography, which is the " +
          "precise error this dataset is built to avoid.",
        layers: [
          {
            layer: "primary_object",
            sourceKey: "hope_kaper_2010",
            content:
              "A male deity at the left with a wꜣs staff and blue skin faces a male and a female deity. The " +
              "second male holds a wꜣs staff. The goddess holds a wꜣḏ staff and what appears to be an " +
              "ostrich feather; her damaged rear arm probably held an ankh. The heads and the top of the " +
              "scene are lost.",
            evidence:
              "WHAT PHYSICALLY SURVIVES, AND NOTE WHAT DOES NOT: the heads. In Egyptian art the head is " +
              "where a deity is usually identified — by crown, by animal form, by attribute. This scene has " +
              "lost exactly the part that would name its figures.",
          },
          {
            layer: "interpretation",
            sourceKey: "hope_kaper_2010",
            content:
              "Amun at the left, with Seth and Nephthys facing him. Supported by the blue skin of the left " +
              "figure, by the room available above it for Amun's feather crown, and by a later Dakhleh " +
              "depiction of Nephthys holding an ostrich feather. The authors reject the alternative " +
              "arrangement, in which Seth would be the principal deity receiving Amun's adoration, as less " +
              "plausible.",
            viewpoint: "archaeological",
            evidence:
              "THE EXCAVATORS' REASONED RECONSTRUCTION, AND THEY PRESENT IT AS ONE. It is a good argument " +
              "from blue skin, available space and a regional parallel. It is still an argument. 'Seth and " +
              "Nephthys appear together at Mut el-Kharab' is a sentence this dataset can only write with " +
              "the word RECONSTRUCTED in it, because the stela does not preserve a single labelled head.",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "hope_kaper_2010",
        startYear: -1294,
        endYear: -1070,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the stela was carved",
        originalDateText: "Ramesside Period, from parallels for the prayers and hymns to Seth",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "WHAT PRODUCED THIS DATE: comparison with other prayers and hymns to Seth. Stylistic and " +
          "epigraphic, which is the weakest kind of date in this dataset and is here the only kind " +
          "available. WHY THE ARCHAEOLOGY CANNOT HELP: the stela was reused face-down in a paving, the " +
          "excavators could not date the paving, and the surrounding deposits contradict each other. The " +
          "range entered is the conventional span of the Ramesside period, not a finding of its own.",
        notes:
          "NEEDS SOURCE VERIFICATION for the parallels themselves, which are named in the publication and " +
          "not read here, and for the Ramesside dates used for the range.",
      },
      {
        sourceKey: "hope_kaper_2010",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "How long Seth's cult at Mut el-Kharab had already existed",
        originalDateText: "Unknown. This is the earliest evidence FOUND, which is a fact about excavation",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "WHY THIS IS A SEPARATE, POSITIONLESS CLAIM: 'the earliest evidence for the cult' and 'when the " +
          "cult began' are different statements, and the excavators mark the difference themselves with the " +
          "word CURRENTLY. A dataset that dated the cult from its earliest surviving object would be " +
          "reporting the history of digging as the history of religion.",
      },
    ],
  },

  {
    slug: "mut-el-kharab-seth-determinative-overwritten",
    title: "The doorway block at Mut where Seth's name was overwritten",
    summary:
      "A temple doorway block whose Seth-animal determinative and 'great of strength' were replaced with a seated-god sign and 'the great god'. Dated from the Twenty-fifth Dynasty onward — in the oasis usually said to have sheltered him.",
    description:
      "WHAT KIND OF RECORD IS THIS? The object that complicates this dataset's own oasis story, which is why " +
      "it gets a record of its own rather than a clause in somebody else's.\n\n" +
      "WHAT WAS DONE. Seth's name on this block was originally written with a crouching Seth-animal " +
      "determinative followed by the epithet 'great of strength'. Both were overwritten: the animal became a " +
      "seated-god determinative, and the epithet became 'the great god'.\n\n" +
      "READ THAT AGAIN, BECAUSE THE SHAPE OF IT MATTERS. The god was not erased. His name was not hacked " +
      "out. He was RESPELLED — kept, and written in a way that does not draw the animal. Whatever that is, " +
      "it is not the same act as chiselling a figure off a wall, and a dataset that filed both under " +
      "'persecution' would be flattening two different things.\n\n" +
      "WHY IT MATTERS TO THE ARGUMENT THIS DATASET WAS MAKING. The oasis record here said Set 'outlasts his " +
      "own disgrace' in the west, as though Dakhleh were untouched. It was not. The alteration is dated from " +
      "the Twenty-fifth Dynasty onward, and later writings on unpublished material from the site also avoid " +
      "the Seth animal. The shelter was partial.\n\n" +
      "AND WHY IT DOES NOT DEMOLISH THE ARGUMENT EITHER. At the same site, across the same centuries, the " +
      "temple was maintained and expanded, donations continued, Seth-bearing personal names continued, and " +
      "demotic ostraka record donations to Seth into the late Ptolemaic period. A god whose name is being " +
      "respelled and who is still being given property is in a stranger position than either 'worshipped' " +
      "or 'proscribed' allows for. That strangeness is the finding.\n\n" +
      "WHAT IS NOT KNOWN, AND IT IS A LOT. The block's excavation number, its size, its exact findspot and " +
      "its present whereabouts are all unknown to this dataset. Kaper's 2001 publication and its figure were " +
      "not opened; everything here comes through Hope and Warfe's 2017 citation of it. There is no " +
      "photograph. WHEN this dataset was written it was the only alteration at Mut known to them.\n\n" +
      "WHAT MUST NOT BE WRITTEN HERE. That this is demonisation. That is the conclusion under test, and the " +
      "excavators' own framing is that vilification in text and destruction of images are different " +
      "phenomena that need not travel together.\n\n" +
      "THINGS TO ASK: Why respell a name rather than remove it? Who is the new spelling for?",
    category: "archaeology",
    subcategory: "Late Period",
    eventType: "archaeological_interpretation",
    identificationStatus: "secure",
    tags: ["set", "dakhla", "mut-el-kharab", "determinative", "erasure", "orthography", "late-period"],
    civilisations: ["Ancient Egypt"],
    locationName: "Mut el-Kharab, Dakhla Oasis, Egypt",
    claims: [
      {
        sourceKey: "hope_warfe_2017",
        startYear: -746,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "after_event",
        whatIsDated: "When the name was overwritten",
        originalDateText: "From the Twenty-fifth Dynasty onward",
        datingMethod: "textual_interpretation",
        chronology: "archaeological",
        evidence:
          "WHAT KIND OF DATE THIS IS: a terminus, not a moment. The alteration is placed no earlier than the " +
          "Twenty-fifth Dynasty and is not otherwise fixed, which is why the claim is filed as 'after' " +
          "rather than as a range with an invented end. The original inscription is assigned to the New " +
          "Kingdom or the Third Intermediate Period, so the block was already old when somebody changed it.",
        notes:
          "AT SECOND HAND. Hope and Warfe 2017, pages 274-275, citing Kaper 2001, pages 72-74. NEEDS SOURCE " +
          "VERIFICATION against Kaper directly — his figure is the thing to see, because everything about " +
          "this record turns on what the recutting actually looks like.",
      },
    ],
  },

  {
    slug: "greater-dakhleh-stela-oracle-of-seth",
    title: "The Greater Dakhleh Stela: a water dispute settled by Seth's oracle",
    summary:
      "Libyan Period. A property and water-rights case decided through an oracle of Seth — the god acting as a working legal institution in the oasis. Ashmolean 1894.107a.",
    description:
      "WHAT KIND OF RECORD IS THIS? Seth doing administrative work, which is a long way from either the " +
      "protector of the sun boat or the enemy of Osiris.\n\n" +
      "WHAT IT IS. A stela now in the Ashmolean Museum, Oxford, accession 1894.107a — a number this dataset " +
      "has verified. Its content is a water-rights or property dispute, adjudicated through THE ORACLE OF " +
      "SETH.\n\n" +
      "WHY AN ORACLE IS THE INTERESTING PART. An oracle is not devotion. It is procedure. For a community to " +
      "settle a dispute over water — which in an oasis is a dispute over survival — by putting it to Seth, " +
      "Seth has to be an institution with standing that the parties will accept. That is a much heavier fact " +
      "than a hymn, because a hymn only tells you somebody praised him.\n\n" +
      "THE DATE IS EXACTLY WHAT IS DISPUTED, AND THIS RECORD DOES NOT SETTLE IT. The stela is Libyan Period " +
      "and is widely associated with Shoshenq I. But the article cited here, Leahy 2010, is SPECIFICALLY A " +
      "REDATING STUDY — its whole subject is that association — and it was not opened. So this dataset " +
      "knows the question exists and does not know the answer, and enters a broad Libyan Period range " +
      "rather than the confident attribution that circulates.\n\n" +
      "WHAT IS MISSING, AND WHY IT BLOCKS SOMETHING THIS DATASET WANTED. The determinative. The Greater and " +
      "Smaller Dakhleh Stelae were to be compared on how each writes Seth's name — the comparison that would " +
      "show whether the respelling seen on the Mut doorway block is part of a pattern. The Griffith " +
      "Institute holds a scale hand-copy and a hieroglyphic transcription under Griffith-2-9; access was " +
      "blocked. WITHOUT THE FACSIMILES THE COMPARISON CANNOT BE MADE, and it is recorded as not made rather " +
      "than guessed at.\n\n" +
      "THINGS TO ASK: What does it take for a god to be trusted with a water dispute? Is that the same thing " +
      "as being worshipped?",
    category: "archaeology",
    subcategory: "Third Intermediate Period",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "dakhla", "greater-dakhleh-stela", "oracle", "libyan-period", "ashmolean", "water-rights"],
    civilisations: ["Ancient Egypt"],
    locationName: "Dakhla Oasis, Egypt; now Ashmolean Museum, Oxford",
    claims: [
      {
        sourceKey: "leahy_greater_dakhleh_2010",
        startYear: -1069,
        endYear: -746,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the stela was made",
        originalDateText: "Libyan Period; often associated with Shoshenq I, which is itself under review",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHY THE RANGE IS THE WHOLE LIBYAN PERIOD RATHER THAN A REIGN: the Shoshenq I attribution is " +
          "widely repeated and is the express subject of a redating study this dataset has not read. " +
          "Entering the popular attribution would mean asserting the very thing under examination. The broad " +
          "range says what is not in doubt and nothing more.",
        notes:
          "NEEDS SOURCE VERIFICATION, and it is a specific and reachable job: read Leahy, Göttinger " +
          "Miszellen 226 (2010), and enter whatever he concludes, with his argument.",
      },
      {
        sourceKey: "leahy_greater_dakhleh_2010",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "How Seth's name is written on this stela",
        originalDateText: "Not established. The facsimiles were not accessible",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "A CLAIM RECORDED SO THAT ITS EMPTINESS IS VISIBLE. The comparison between this stela and the " +
          "Smaller Dakhleh Stela on the writing of Seth's name is the single piece of evidence that would " +
          "show whether the Mut doorway block's respelling is an isolated act or a regional pattern. The " +
          "Griffith Institute holds a scale hand-copy and hieroglyphic transcription under Griffith-2-9. " +
          "Access was blocked. NOTHING IS ENTERED HERE, because a guess in this field would answer the " +
          "dataset's own open question on no evidence.",
      },
    ],
  },

  {
    slug: "smaller-dakhleh-stela-piye",
    title: "The Smaller Dakhleh Stela: one priest, two gods",
    summary:
      "Reign of Piye. A donation decree that principally concerns Amun, with Seth as the principal deity of its upper scene — and a priest who served both.",
    description:
      "WHAT KIND OF RECORD IS THIS? The best evidence at Dakhleh that Seth and Amun were institutionally " +
      "entangled, and a careful account of how far that evidence reaches.\n\n" +
      "WHAT IS REPORTED. A donation decree of the reign of Piye, Twenty-fifth Dynasty. Seth is the principal " +
      "deity in the upper scene. The decree itself principally concerns Amun. And line five names an " +
      "otherwise anonymous priest carrying both titles at once: God's Father of Amun, and Second Prophet of " +
      "Seth.\n\n" +
      "WHAT THAT ONE MAN ESTABLISHES. A shared priestly institution. Not a metaphor, not an iconographic " +
      "association — an office-holder drawing two titles, in a dated royal document.\n\n" +
      "WHAT IT DOES NOT ESTABLISH, and the excavators are explicit about it: that the two gods occupied the " +
      "same temple building. Hope and Kaper's own sentence is worth keeping exactly: 'Whether the two gods " +
      "physically shared the same temple building within this enclosure remains to be established' (2010, " +
      "page 147). A shared priesthood and a shared building are different claims and the evidence supports " +
      "one of them.\n\n" +
      "THE DATE IS THE FIRM PART. Piye's reign is a Twenty-fifth Dynasty anchor, which makes this the most " +
      "securely dated Seth evidence at Dakhleh in this dataset — and it sits in the same window as the " +
      "overwriting of Seth's name on the Mut doorway block. The same dynasty, the same oasis: a royal decree " +
      "with Seth presiding over its upper scene, and a doorway where his animal was being written out. Both " +
      "are the evidence. Neither cancels the other.\n\n" +
      "THE HONEST LIMIT. Janssen's 1968 publication was not opened. Everything above comes through Hope and " +
      "Kaper's citation of it. The object number, the material, the size, the present location and the " +
      "exact findspot are all unknown here, and the plate — which would allow the determinative comparison " +
      "with the Greater Stela — has not been seen.\n\n" +
      "THINGS TO ASK: If one man served both gods, whose temple was he in? What would settle it?",
    category: "archaeology",
    subcategory: "Late Period",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "amun", "dakhla", "smaller-dakhleh-stela", "piye", "priesthood", "twenty-fifth-dynasty"],
    civilisations: ["Ancient Egypt"],
    locationName: "Dakhla Oasis, Egypt",
    people: ["Piye"],
    claims: [
      {
        sourceKey: "janssen_smaller_dakhleh_1968",
        startYear: -743,
        endYear: -713,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the decree was issued",
        originalDateText: "The reign of Piye",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "DATED BY A NAMED KING, which is why this is the firmest Seth date at Dakhleh on this dataset. The " +
          "range is the conventional span of Piye's reign; the attribution comes through Hope and Kaper " +
          "citing Janssen.",
        notes:
          "NEEDS SOURCE VERIFICATION against Janssen, Journal of Egyptian Archaeology 54 (1968), 165-172 " +
          "and plate 25, which was not opened. Also needs the regnal dates used for the range.",
      },
      {
        sourceKey: "hope_kaper_2010",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether Seth and Amun shared a temple building at Mut",
        originalDateText: "Remains to be established, in the excavators' own words",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS ESTABLISHED: a shared priesthood, from a priest holding both titles on this stela; Amun " +
          "named on Horemheb blocks at Mut; and Amun reconstructed alongside Seth in the upper scene of the " +
          "Ramesside hymn stela. WHAT IS NOT: a shared building. Hope and Kaper say so directly, and this " +
          "claim exists to carry their limit rather than to quietly pass over it.",
      },
    ],
  },

  {
    slug: "typhonian-magic-greco-roman",
    title: "Typhon-Seth in the magical papyri: the god becomes a power to be summoned",
    summary:
      "Greco-Roman Egypt. In working magical texts, Set and Typhon have already fused, and the resulting figure is invoked by name for real ends.",
    description:
      "WHAT KIND OF RECORD IS THIS? The stage between Egyptian cult and modern occultism, and the one most " +
      "often skipped — which is why the modern revivals look as though they came from nowhere.\n\n" +
      "WHAT THE TEXTS ARE. The Greek Magical Papyri: a body of practical magical material from Greco-Roman " +
      "Egypt, in Greek, Demotic and Coptic, spanning several centuries. Not literature and not liturgy. " +
      "Working documents, with instructions.\n\n" +
      "WHAT SET IS IN THEM. Addressed as Typhon-Seth, or under strings of names in which the two are already " +
      "one. He is invoked for coercive and protective purposes alike. The fusion Plutarch describes as an " +
      "interpretation is here simply the operative assumption.\n\n" +
      "WHY THIS IS A DISTINCT STAGE AND NOT A FOOTNOTE TO PLUTARCH. Plutarch explains Egyptian religion to " +
      "Greek readers. These texts USE it. A god who has become a name of power in a working manual is in a " +
      "different condition from a god who has a temple, and also from a god who is a literary character.\n\n" +
      "THE LINE TO THE MODERN MATERIAL. Much later Western occultism draws on this corpus, directly and " +
      "through intermediaries. That is a real line of transmission — of TEXTS. It is not evidence that " +
      "Egyptian religion continued, and this dataset's gap record says why the two must not be confused.\n\n" +
      "THINGS TO ASK: What changes about a god when he becomes a name in a spell? Is that survival, or " +
      "something else?",
    category: "religion",
    subcategory: "Greco-Roman Egypt",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "typhon", "magical-papyri", "pgm", "greco-roman", "syncretism"],
    civilisations: ["Ancient Egypt", "Greco-Roman world"],
    locationName: "Egypt",
    claims: [
      {
        sourceKey: "greek_magical_papyri",
        startYear: -199,
        endYear: 499,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The span of the surviving magical papyri",
        originalDateText: "Roughly the second century BCE to the fifth century CE",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: a corpus of manuscripts, dated individually by hand and context and summarised here " +
          "as a span. WHY A SPAN AND NOT A DATE: these are many documents by many people over many " +
          "generations, and the single date a reader wants does not exist. WHAT WOULD IMPROVE THIS RECORD: " +
          "named papyri with their own dates, which would replace the span with instances.",
        notes: "NEEDS SOURCE VERIFICATION for the range and for any individual spell naming Typhon-Seth.",
      },
    ],
  },

  {
    slug: "set-animal-species-unidentified",
    title: "Nobody knows what animal the Set animal is",
    summary:
      "Not an event, and given no date. After two centuries of Egyptology the creature on Set's shoulders has never been securely matched to any living species.",
    description:
      "WHAT KIND OF RECORD IS THIS? An open question, recorded as open, because the alternative is the " +
      "confident answer found in most popular writing — which is several different confident answers that " +
      "cannot all be right.\n\n" +
      "WHAT THE PROBLEM IS. Set's animal form is consistent and distinctive: a curved snout, tall squared " +
      "ears, an erect forked tail. It is not drawn the way Egyptian artists drew animals they knew — and they " +
      "drew animals they knew with great precision, well enough for modern zoologists to identify species " +
      "from tomb paintings.\n\n" +
      "WHAT HAS BEEN PROPOSED. Aardvark, donkey, jackal, greyhound, fennec, oryx, okapi, giraffe, pig, " +
      "and an extinct or composite creature that never existed. Each has had serious advocates. None has " +
      "carried the field.\n\n" +
      "WHY THE ANSWER MIGHT BE THAT THERE IS NO ANSWER. A god of disorder and the foreign could reasonably " +
      "be given a body that is deliberately not any real thing — a creature from outside the catalogue of " +
      "creatures. That is a proposal too, and it is not more provable than the others; but it is the one " +
      "that explains why the precision of Egyptian animal art fails here and nowhere else.\n\n" +
      "HOW THIS INTERACTS WITH THE PREDYNASTIC RECORD. Directly and importantly. If nobody can say what the " +
      "Set animal IS, then identifying a strange quadruped on a 3800 BCE potsherd as a Set animal by " +
      "resemblance is resting on a resemblance to something undefined. That is why the early identifications " +
      "in this dataset are marked possible and the Peribsen one is marked secure: one rests on looks, the " +
      "other on position in writing.\n\n" +
      "THINGS TO ASK: How would you prove an image is of no real animal? What would count as evidence either way?",
    category: "archaeology",
    subcategory: "Iconography",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["set", "set-animal", "iconography", "zoology", "unresolved"],
    civilisations: ["Ancient Egypt"],
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "What species the Set animal represents",
        originalDateText: "Unresolved. Many proposals, no consensus",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "WHY THIS RECORD CARRIES NO DATE: it is not about a moment at all. It is placed in the dataset " +
          "because it governs how much weight every identification by resemblance can bear. WHAT IS " +
          "ESTABLISHED: that the iconography is consistent, distinctive, and not matched to a species. WHAT " +
          "IS NOT: which of the proposals, if any, is right. THE DATASET TAKES NO SIDE and lists the " +
          "candidates so a reader can see how wide the disagreement is.",
        notes:
          "NEEDS SOURCE VERIFICATION for the individual proposals and their advocates, none of whom is named " +
          "here — which is a fair criticism of this record.",
      },
    ],
  },

  {
    slug: "crowley-cairo-1904",
    title: "Cairo, 1904: Egypt enters modern occultism, filtered twice",
    summary:
      "Aleister Crowley's Cairo working and the text that came out of it put Egyptian gods at the centre of a new Western religious current — via Victorian Egyptology and Greco-Roman sources, not via Egypt.",
    description:
      "WHAT KIND OF RECORD IS THIS? Evidence about modern religion. It is not evidence about ancient Egypt " +
      "and is filed here so the modern material has a documented starting point instead of an implied " +
      "ancient one.\n\n" +
      "WHAT HAPPENED, AS A CIVIL FACT. In Cairo in April 1904, Aleister Crowley produced the text he called " +
      "Liber AL vel Legis, and built a system around it that has shaped Western esotericism ever since. That " +
      "the text was written then and there is documented. What Crowley said about HOW it came to be written " +
      "is his religious claim, and this dataset records that he made it without adjudicating it — the same " +
      "treatment the Temple of Set record gets, for the same reason.\n\n" +
      "THE DOUBLE FILTER, WHICH IS THE POINT OF THE RECORD. The Egypt in this material arrives through two " +
      "lenses. First Greco-Roman interpretation — Plutarch's Typhon, the magical papyri, Hermetic " +
      "literature. Then Victorian and Edwardian Egyptology, with its own preoccupations, and the Cairo " +
      "museum as Crowley found it. What emerges is a real religious tradition with real texts and real " +
      "adherents. It is not a survival of Egyptian religion, and the difference matters in both directions.\n\n" +
      "ON SET SPECIFICALLY. Later Thelemic and Typhonian currents make much of Set. Those readings are " +
      "twentieth-century developments, some of them long after Crowley, and this record does not project " +
      "them back onto 1904. What the 1904 material does and does not say about Set is a question this " +
      "dataset has not checked, and it says so rather than filling in.\n\n" +
      "WHY THIS IS NOT DEBUNKING. A modern tradition is not discredited by being modern. Every religion was " +
      "new once. The claim this record refuses is the specific one — that these are Egyptian survivals — " +
      "not the worth of the tradition itself.\n\n" +
      "THINGS TO ASK: What does a tradition gain by claiming ancient descent? What does it lose by needing to?",
    category: "religion",
    subcategory: "Modern reception",
    eventType: "historical",
    identificationStatus: "secure",
    tags: ["set", "typhon", "crowley", "thelema", "occultism", "modern", "reception"],
    civilisations: ["Modern Western esotericism"],
    locationName: "Cairo, Egypt",
    people: ["Aleister Crowley"],
    claims: [
      {
        sourceKey: "crowley_equinox_of_the_gods",
        startYear: 1904,
        startMonth: 4,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Cairo working",
        originalDateText: "Cairo, April 1904",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS ESTABLISHED: that the text was produced in Cairo in April 1904. This is a documented " +
          "modern fact with a paper trail, and it is the part of the record that is not in dispute.",
        notes: "NEEDS SOURCE VERIFICATION for the exact days, which are given precisely in the literature.",
      },
      {
        sourceKey: "crowley_equinox_of_the_gods",
        startYear: 1904,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "traditional_date",
        whatIsDated: "The religious account of how the text was received",
        originalDateText: "Crowley's own account of the reception of the Book of the Law",
        datingMethod: "source_assertion",
        chronology: "religious",
        evidence:
          "WHAT IS CLAIMED: a reception rather than an authorship. WHOSE CLAIM: Crowley's, and his " +
          "tradition's. WHAT THIS DATASET DOES: records that the claim is made, by whom, and when, and stops " +
          "there. Declaring it true would be theology; declaring it false would be a different theology. " +
          "Neither is what a timeline is for.",
      },
    ],
  },

  {
    slug: "set-in-modern-popular-culture",
    title: "MODERN: Set as film villain, comic antagonist, game boss",
    summary:
      "Twentieth and twenty-first centuries. For most people alive today, the Set they have met is a screen character — and that character is descended from Plutarch, not from Egypt.",
    description:
      "WHAT KIND OF RECORD IS THIS? Labelled MODERN in its title on purpose. It is evidence about us.\n\n" +
      "WHAT IT COVERS. Set as antagonist across modern media: films, television, comics, video games, novels. " +
      "The recurring shape is consistent — an evil god of darkness and death, the enemy of a heroic sky god, " +
      "and often outright Satanic in framing.\n\n" +
      "WHERE THAT CHARACTER ACTUALLY COMES FROM. Not from the Egyptian record. It descends from Plutarch's " +
      "Typhon, through Greco-Roman interpretation, through Christian-era readings of pagan gods as demons, " +
      "through Victorian popularisation, into the modern entertainment version. Four or five handovers, each " +
      "of which sharpened the same edge.\n\n" +
      "WHY IT BELONGS IN THIS DATASET RATHER THAN BEING BENEATH IT. Because it is the most widely " +
      "transmitted version of Set in human history, by an enormous margin. More people have encountered the " +
      "film version in the last fifty years than encountered the Egyptian god in three thousand. Leaving it " +
      "out would leave out the version the reader most likely arrived with.\n\n" +
      "WHAT THIS RECORD IS NOT DOING. Complaining. A film is not obliged to be an Egyptology seminar. The " +
      "point is only that a reader should know which Set they are looking at, and that the screen version is " +
      "the far end of a long chain rather than a picture of the start of it.\n\n" +
      "THINGS TO ASK: Which of your beliefs about any ancient god came from a screen? How would you tell?",
    category: "culture",
    subcategory: "Modern reception",
    eventType: "mainstream",
    identificationStatus: "modern_interpretation",
    tags: ["set", "modern", "popular-culture", "reception", "typhon", "media"],
    civilisations: ["Modern world"],
    claims: [
      {
        sourceKey: null,
        startYear: 1900,
        isOngoing: true,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period of modern mass-media depiction",
        originalDateText: "Twentieth century to the present",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: an ongoing practice, opened at a round century boundary because there is no first " +
          "instance to point to and pretending otherwise would be worse. WHY IT IS MARKED ONGOING: it has " +
          "not stopped. WHAT WOULD IMPROVE THIS RECORD: named works with their own dates, which would turn " +
          "a generalisation into a series — and would let a reader watch the character drift.",
        notes:
          "NO INDIVIDUAL FILM, GAME OR COMIC IS NAMED HERE, deliberately: naming them from memory is exactly " +
          "the kind of unchecked confident detail this dataset is built to avoid, and a wrong title would " +
          "undercut the record's own argument.",
      },
    ],
  },
];
