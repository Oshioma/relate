// THE GREAT PYRAMID, AS A WORKED EXAMPLE.
//
// One event, five dates, five different KINDS of claim — a showcase of what
// this timeline is actually for. A community can seed it into their own
// timeline and read how the feature handles a genuine disagreement.
//
// The five dates are not five measurements of the same thing, and that is the
// whole lesson. Conventional Egyptology dates the physical construction.
// Radiocarbon dates organic material associated with the monument. The Orion
// correlation proposes an astronomical REFERENCE epoch. Lost-civilisation
// arguments propose inherited knowledge. The medieval Surid tradition is a
// legend about the pyramids, and is evidence that the legend existed rather
// than evidence about when the pyramid was built.
//
// RULES THIS DATA FOLLOWS.
//
//   · Nothing is invented. Every citation below is a real publication with
//     real bibliographic details. Where a detail could not be verified it is
//     omitted rather than guessed — there are no invented ISBNs, DOIs, page
//     numbers or quotations here.
//   · No confidence scores, and none may be added. Viewpoint says where a
//     claim comes from; it never says how likely it is to be right.
//   · Exactly one claim carries the mainstream designation (chronology:
//     "conventional"). The rest are labelled for what they actually are.
//   · Criticism is included for the contested claims, and the mainstream claim
//     gets the same treatment: what the evidence does and does not establish.

import { isHotlinked } from "./bring-in-image";

export type ShowcaseSource = {
  /** Stable key within this file, so claims can name their source. Not stored. */
  key: string;
  title: string;
  author?: string;
  publisher?: string;
  workTitle?: string;
  /** Volume/pages/DOI/chapter — whatever locates the passage. */
  reference?: string;
  url?: string;
  sourceType: string;
  publishedYear?: number;
  publishedDisplay?: string;
  /** What this source is cited FOR. Not a summary of the whole work. */
  notes: string;
  /** Key of the source that cites this one, where that is genuinely true. */
  citedBy?: string;
};

export type ShowcaseCitation = {
  sourceKey: string;
  /** What this source DOES to the claim. Never a score. */
  relation: "supports" | "disputes" | "context";
  note: string;
};

export type ShowcaseClaim = {
  /** The source that ASSERTS this date. */
  sourceKey: string | null;
  /** Everything else worth reading on it — evidence, criticism, context. */
  citations?: ShowcaseCitation[];
  /** Astronomical year numbering: 1 BCE = 0, 2 BCE = −1. See time.ts. */
  startYear: number;
  endYear?: number;
  datePrecision: string;
  isApproximate: boolean;
  /** The claim in its own words, kept verbatim. */
  originalDateText: string;
  datingMethod: string;
  /** The viewpoint (the `chronology` column). "conventional" is the mainstream one. */
  chronology: string;
  /** "Why this date?" — what produced it and what it does and does not establish. */
  evidence: string;
  notes?: string;
};

/** BCE year → astronomical year. 2560 BCE is −2559. */
const bce = (year: number): number => 1 - year;

export const SHOWCASE_EVENT_SLUG = "great-pyramid-of-giza";

export const SHOWCASE_SOURCES: ShowcaseSource[] = [
  {
    key: "lehner",
    title: "The Complete Pyramids",
    author: "Mark Lehner",
    publisher: "Thames & Hudson",
    sourceType: "academic_book",
    publishedYear: 1997,
    publishedDisplay: "1997",
    notes:
      "Cited for the conventional Egyptological account: the attribution of the Great Pyramid to Khufu, its place in the Fourth Dynasty, and the structure of the Giza complex. A standard reference work by the archaeologist who has directed fieldwork at Giza for decades.",
  },
  {
    key: "merer",
    title: "Papyrus Jarf A and B — the Diary of Merer",
    author: "Merer (inspector under Khufu); edited by Pierre Tallet",
    publisher: "Institut Français d'Archéologie Orientale (IFAO)",
    workTitle: "Les papyrus de la Mer Rouge I: Le « Journal de Merer » (Papyrus Jarf A et B)",
    reference: "Papyrus Jarf A and B, from Wadi al-Jarf",
    sourceType: "historical_document",
    publishedYear: 2017,
    publishedDisplay: "written in Khufu's reign; edition published 2017",
    notes:
      "Cited ONLY for what it actually records: a work-gang inspector's day-by-day log of shipping white limestone from the Tura quarries to Akhet-Khufu — the Great Pyramid's complex — dated to 'the year after the 13th cattle count' of Khufu. It documents transport and logistics during Khufu's reign. It does not describe the pyramid being built, and is not cited here as if it did.",
  },
  {
    key: "bonani",
    title: "Radiocarbon Dates of Old and Middle Kingdom Monuments in Egypt",
    author: "Georges Bonani, Herbert Haas, Zahi Hawass, Mark Lehner, Shawki Nakhla, John Nolan, Robert Wenke, Willy Wölfli",
    publisher: "Cambridge University Press",
    workTitle: "Radiocarbon",
    reference: "Radiocarbon 43(3), 1297–1320. DOI 10.1017/S0033822200038558",
    url: "https://www.cambridge.org/core/journals/radiocarbon/article/radiocarbon-dates-of-old-and-middle-kingdom-monuments-in-egypt/A967302ADD527BFEB9226457682C0B4A",
    sourceType: "academic_paper",
    publishedYear: 2001,
    publishedDisplay: "2001",
    notes:
      "The Old and Middle Kingdom Monuments Project — over 450 samples collected 1984–1995, 269 radiocarbon measurements. Cited for the measurements themselves and for the size and direction of their offset from the historical chronology, not for a construction date.",
    // Literally true: the Wikipedia article's radiocarbon section cites this paper.
    citedBy: "wikipedia",
  },
  {
    key: "dee",
    title: "Reanalysis of the Chronological Discrepancies Obtained by the Old and Middle Kingdom Monuments Project",
    author: "Michael W. Dee, Christopher Bronk Ramsey, Andrew J. Shortland, Thomas F. G. Higham, Joanne M. Rowland",
    publisher: "Cambridge University Press",
    workTitle: "Radiocarbon",
    reference: "Radiocarbon 51(3), 1061–1070",
    sourceType: "academic_paper",
    publishedYear: 2009,
    publishedDisplay: "2009",
    notes:
      "Cited for the specific modelled range used by this claim: a reanalysis restricted to shorter-lived sample material, which placed the completion of Khufu's pyramid at 2620–2484 BC. This is the study that produces the figure, which is why it and not the 2001 paper is the source attached to the claim.",
    citedBy: "wikipedia",
  },
  {
    key: "bauval",
    title: "The Orion Mystery: Unlocking the Secrets of the Pyramids",
    author: "Robert Bauval and Adrian Gilbert",
    publisher: "William Heinemann",
    sourceType: "book",
    publishedYear: 1994,
    publishedDisplay: "1994",
    notes:
      "The proponents' own statement of the Orion correlation, cited so the claim is represented in the words of the people who make it rather than only through its critics. Cited for what the argument is, not as evidence that it is correct.",
  },
  {
    key: "fairall",
    title: "Precession and the layout of the ancient Egyptian pyramids",
    author: "Anthony Fairall",
    publisher: "Oxford University Press / Royal Astronomical Society",
    workTitle: "Astronomy & Geophysics",
    reference: "Astronomy & Geophysics 40(3), June 1999, p. 3.4. DOI 10.1093/astrog/40.3.3.4",
    url: "https://academic.oup.com/astrogeo/article/40/3/3.4/197342",
    sourceType: "academic_paper",
    publishedYear: 1999,
    publishedDisplay: "June 1999",
    notes:
      "Cited for the astronomical criticism of the Orion correlation: measuring the angle of Orion's Belt to north at the proposed epoch as roughly 47–50°, against the roughly 38° formed by the three Giza pyramids.",
  },
  {
    key: "hancock",
    title: "Fingerprints of the Gods",
    author: "Graham Hancock",
    publisher: "William Heinemann",
    sourceType: "book",
    publishedYear: 1995,
    publishedDisplay: "1995",
    notes:
      "Cited as the primary source for what Hancock himself argues, so the claim is not characterised only by its opponents. Cited for the content of the argument, not as evidence for it.",
  },
  {
    key: "maqrizi",
    title: "al-Mawa'iz wa-l-i'tibar fi dhikr al-khitat wa-l-athar (al-Khitat)",
    author: "Taqi al-Din al-Maqrizi",
    reference: "The pyramid chapters",
    sourceType: "historical_document",
    publishedDisplay: "15th century",
    notes:
      "The fullest surviving medieval compilation of Arabic and Coptic pyramid lore, including the Surid narrative. Cited as evidence that the tradition existed and for its content — NOT as evidence about when the Great Pyramid was built. al-Maqrizi is a compiler working centuries after the stories he records, and he names earlier authorities for them.",
  },
  {
    key: "wikipedia",
    title: "Great Pyramid of Giza",
    url: "https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza",
    sourceType: "wikipedia",
    notes:
      "An accessible overview and a starting point for the references below it. Included as a way in, never as a substitute for the academic and primary sources cited on the individual claims — which is exactly the trail the 'can you find the original source?' prompt is asking a reader to follow.",
  },
];

export const SHOWCASE_CLAIMS: ShowcaseClaim[] = [
  // -------------------------------------------------------------------------
  // 1. MAINSTREAM. The only claim carrying chronology "conventional".
  // -------------------------------------------------------------------------
  {
    sourceKey: "lehner",
    citations: [
      {
        sourceKey: "merer",
        relation: "supports",
        note:
          "Contemporary administrative evidence from inside Khufu's reign: a log of gangs shipping Tura limestone to Akhet-Khufu. It supports the reign, the logistics and the scale — not the act of construction, which it never describes.",
      },
      {
        sourceKey: "bonani",
        relation: "context",
        note:
          "Radiocarbon measurements from the monument are consistent with an Old Kingdom date while sitting systematically older than this chronology. Attached as context rather than support, because the offset is an open question rather than a confirmation.",
      },
      {
        sourceKey: "wikipedia",
        relation: "context",
        note: "A general overview, and a route to the references underneath it.",
      },
    ],
    startYear: bce(2589),
    endYear: bce(2528),
    datePrecision: "year",
    isApproximate: true,
    originalDateText: "c. 2560 BCE — during the reign of Khufu, Fourth Dynasty",
    datingMethod: "regnal_chronology",
    chronology: "conventional",
    evidence:
      "This is the overwhelmingly accepted archaeological and historical account, and it is not a close-run thing: the Great Pyramid was built as the tomb of the Fourth Dynasty king Khufu, in the middle of the 26th century BCE.\n\n" +
      "WHAT IS BEING DATED: the physical construction of the monument.\n\n" +
      "HOW THE DATE IS REACHED. Egyptian chronology for the Old Kingdom is built by counting reigns and reign-lengths back through king lists and administrative records, anchored where possible to datable events. It is a historical chronology, not a measurement, and it carries real uncertainty — which is why the standard reference works do not agree to the year. Khufu's reign is placed at 2589–2566 BCE in one widely used chronology and 2551–2528 BCE in another. The range on this claim spans both, which is what the 'c.' in 'c. 2560 BCE' actually covers.\n\n" +
      "WHAT THE EVIDENCE ESTABLISHES, piece by piece:\n\n" +
      "· Work-gang graffiti painted in the relieving chambers above the King's Chamber include Khufu's name. These were applied during construction and are not accessible for later forgery, tying the fabric of the pyramid to his reign.\n\n" +
      "· The Giza plateau's archaeological context — the pyramid's own complex of causeway, temples and subsidiary pyramids, the surrounding Fourth Dynasty cemeteries, and the excavated workers' settlement and its administration — places the monument inside a coherent Old Kingdom landscape rather than standing alone in time.\n\n" +
      "· The Wadi al-Jarf papyri, including the log kept by the inspector Merer, record gangs shipping white limestone from the Tura quarries to Akhet-Khufu — the Great Pyramid's complex — dated to 'the year after the 13th cattle count' of Khufu. BE PRECISE ABOUT THIS: the diary documents transport and logistics during Khufu's reign. It does not describe the pyramid being built, and it is not evidence of that.\n\n" +
      "· Radiocarbon measurements from the monument are consistent with an Old Kingdom date, though they sit systematically older than the historical chronology. That offset is a real result and is the subject of its own claim below.\n\n" +
      "WHAT IT DOES NOT ESTABLISH: an exact year. No evidence gives one, and the round figure 'c. 2560 BCE' is a convention rather than a measurement.",
    notes:
      "This claim is labelled as the mainstream / established view. That is a statement about where it sits in current scholarship, not a declaration that it is beyond question — and the other claims below are shown in full so a reader can see what disagreeing with it would have to account for.",
  },

  // -------------------------------------------------------------------------
  // 2. SCIENTIFIC MEASUREMENT. Evidence bearing on claim 1, not a rival school.
  // -------------------------------------------------------------------------
  {
    sourceKey: "dee",
    citations: [
      {
        sourceKey: "bonani",
        relation: "supports",
        note:
          "The project that produced the underlying measurements — over 450 samples collected 1984–1995, and the 46 determinations on the Great Pyramid that the reanalysis works from.",
      },
      {
        sourceKey: "lehner",
        relation: "context",
        note:
          "The conventional chronology these measurements are being compared against. Its author is also an author of the radiocarbon project, which is worth noticing: this is not science against archaeology.",
      },
    ],
    startYear: bce(2620),
    endYear: bce(2484),
    datePrecision: "year",
    isApproximate: true,
    originalDateText: "2620–2484 BC (modelled completion of Khufu's pyramid)",
    datingMethod: "radiocarbon",
    chronology: "scientific",
    evidence:
      "WHAT IS BEING DATED: organic material physically associated with the monument — not the stone, which cannot be radiocarbon dated at all.\n\n" +
      "WHAT WAS TESTED. The Old and Middle Kingdom Monuments Project collected over 450 organic samples between 1984 and 1995, yielding 269 measurements across monuments of the 1st to 12th dynasties. The datable material is charcoal, reed, straw and other plant matter caught in the gypsum mortar between the blocks, and charcoal from the associated settlement debris. For the Great Pyramid the project reported 46 individual determinations.\n\n" +
      "WHAT CAME OUT. The Great Pyramid results scatter widely — roughly 400 years — and sit systematically OLDER than the historical chronology, by something in the order of a century to three. A later reanalysis by Dee and colleagues, restricted to shorter-lived sample material, modelled the completion of the pyramid at 2620–2484 BC. That narrower range is the figure on this claim.\n\n" +
      "WHY THE SAMPLES CAN READ OLD. Two reasons, both mundane:\n\n" +
      "· THE OLD WOOD PROBLEM. Radiocarbon dates when a plant stopped taking up carbon, not when a building went up. Timber and charcoal from long-lived trees can already be centuries old when used, and in a largely treeless landscape wood was valuable and reused.\n\n" +
      "· RECYCLED DEBRIS. The builders appear to have burnt and reused their own settlement material, so charcoal in the mortar can carry dates from decades of earlier occupation rather than from the day it was mixed.\n\n" +
      "WHAT THIS CAN AND CANNOT ESTABLISH. It can show that the material is Old Kingdom, and it can measure how far the scientific and historical chronologies sit apart — which is a genuinely open research question. It cannot, on its own, give a construction year, because the gap between the age of the sample and the age of the building is exactly what is unknown.\n\n" +
      "THIS IS NOT A RIVAL THEORY. It is evidence bearing on the conventional chronology, produced by archaeologists working within it — including the excavator whose reference work is cited on the mainstream claim above.",
    notes:
      "Deliberately labelled as a scientific viewpoint rather than a competing historical school. Reading it as 'science says a different date from the Egyptologists' would misrepresent both.",
  },

  // -------------------------------------------------------------------------
  // 3. ORION CORRELATION. An astronomical REFERENCE epoch, not a build date.
  // -------------------------------------------------------------------------
  {
    sourceKey: "bauval",
    citations: [
      {
        sourceKey: "fairall",
        relation: "disputes",
        note:
          "Measures the angle of Orion's Belt to north at the proposed epoch as roughly 47–50°, against roughly 38° formed by the three pyramids — the correlation the argument depends on is not as close as claimed.",
      },
    ],
    startYear: bce(10450),
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "c. 10,450 BC",
    datingMethod: "astronomical",
    chronology: "alternative",
    evidence:
      "WHAT IS BEING DATED — and this is the distinction that matters most on this claim. Robert Bauval's Orion correlation proposes an astronomical REFERENCE EPOCH that the Giza ground plan is said to commemorate. It is not, in itself, a claim that the masonry was laid in 10,450 BCE. Three different things are easily confused here and should be kept apart: an astronomical reference date, a proposed ground-plan or symbolic date, and a physical construction date. Only the last is what the mainstream claim above is about.\n\n" +
      "THE ARGUMENT. The three main Giza pyramids are held to mirror the three stars of Orion's Belt, with the slight offset of the third pyramid matching the offset of the third star. Because the Earth's axis precesses over roughly 26,000 years, the belt's orientation relative to north changes slowly, and proponents place the configuration that best fits the ground plan at around 10,450 BCE. Orion was identified by the Egyptians with Osiris, which is offered as the reason such an epoch would be commemorated.\n\n" +
      "WHY PROPONENTS PICK THAT EPOCH: it is placed at the bottom of the precessional cycle for Orion's Belt, argued to be a meaningful 'first time' to record.\n\n" +
      "THE CRITICISMS, which are substantial:\n\n" +
      "· THE ANGLE DOES NOT MATCH. Ed Krupp of the Griffith Observatory and Anthony Fairall of the University of Cape Town independently measured the angle of the belt to north at the proposed epoch and got roughly 47–50°, against roughly 38° formed by the pyramids. The correlation critics measure is not the close fit the argument requires.\n\n" +
      "· THE MAP HAS TO BE INVERTED. To make the bend in the belt match the offset of the third pyramid, Orion has to be turned upside down — north and south reversed — which is not how the Egyptians depicted the sky.\n\n" +
      "· NO ARCHAEOLOGY SUPPORTS CONSTRUCTION AT THAT DATE. There is no accepted archaeological evidence of any construction at Giza in the 11th millennium BCE, and no material culture there to build it.\n\n" +
      "WHERE IT SITS: outside mainstream Egyptology, and treated as a fringe position in archaeology and archaeoastronomy.",
    notes:
      "Included because a reader is far more likely to meet this claim than to meet the response to it, and because working out what is actually being asserted — an epoch, a symbol, or a date of construction — is the skill this timeline exists to practise.",
  },

  // -------------------------------------------------------------------------
  // 4. LOST-CIVILISATION ARGUMENT. Handled carefully: the usual summary of it
  //    is not quite what its author argues.
  // -------------------------------------------------------------------------
  {
    sourceKey: "hancock",
    citations: [
      {
        sourceKey: "fairall",
        relation: "disputes",
        note:
          "The same astronomical objection applies here, since this argument rests on the same Orion correlation: the measured angle at the proposed epoch does not match the ground plan.",
      },
      {
        sourceKey: "lehner",
        relation: "disputes",
        note:
          "Sets out the excavated Fourth Dynasty context — the workers' settlement, the administration, the unfinished work — which is the archaeological evidence for who built the pyramid and when.",
      },
    ],
    startYear: bce(10500),
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "c. 10,500 BC",
    datingMethod: "astronomical",
    chronology: "alternative",
    evidence:
      "WHAT IS BEING DATED. Read carefully, because the popular summary — 'Hancock says the Great Pyramid was built in 10,500 BC' — is not what the argument states. The date is offered as the epoch the Giza complex is said to COMMEMORATE: the sky above Giza at the vernal equinox of around 10,500 BCE, identified with Zep Tepi, the 'First Time' of Egyptian cosmology. The argument is about an inherited plan, an inherited body of knowledge, and a proposed lost civilisation at the end of the last Ice Age — not straightforwardly about when the blocks were set.\n\n" +
      "That distinction is the point of including this claim. A reader who wants to weigh it has to be clear whether the assertion is (a) the monuments were physically built then, (b) the site plan encodes that epoch while the masonry is Old Kingdom, or (c) Old Kingdom builders inherited knowledge from a much older culture. These are different claims requiring different evidence, and they are frequently run together — by supporters and critics alike.\n\n" +
      "WHAT WOULD BE NEEDED TO SUPPORT IT: material evidence of a civilisation capable of the work at that date. No such evidence is accepted by archaeology, and the excavated Fourth Dynasty context at Giza — the workers' settlement, the administration, the tools, the unfinished work — is evidence of who built the pyramid and when.\n\n" +
      "WHERE IT SITS: outside mainstream archaeological consensus.\n\n" +
      "The source attached here is Hancock's own book, so that the claim is stated by the person making it rather than only characterised by people arguing against it. Citing it is not endorsing it — it is the only honest way to describe what someone actually said.",
    notes:
      "Hancock's emphasis has shifted across his books and public statements, and this record does not attribute a single fixed construction-date claim to him. Anyone evaluating it should go to his own words, which is why they are the source cited.",
  },

  // -------------------------------------------------------------------------
  // 5. MEDIEVAL LEGEND. Evidence that a tradition existed — nothing more.
  // -------------------------------------------------------------------------
  {
    sourceKey: "maqrizi",
    citations: [
      {
        sourceKey: "lehner",
        relation: "context",
        note:
          "What the archaeology of the site actually shows, set beside the legend — so the tradition can be read as a tradition without being mistaken for a rival account of the building work.",
      },
    ],
    startYear: bce(3500),
    endYear: bce(2650),
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "three hundred years before the Flood",
    datingMethod: "textual_interpretation",
    chronology: "traditional",
    evidence:
      "WHAT THIS IS. A medieval Arabic and Coptic tradition, not an archaeological finding. In it a pre-Flood king — rendered Surid, Saurid, or Surid ibn Salhouk — dreams of a coming catastrophe in which the stars fall and the earth is overturned, consults his priests, and orders the pyramids built to preserve the knowledge, sciences and treasures of Egypt through the deluge. The fullest surviving compilation is al-Maqrizi's al-Khitat, written in the 15th century, which gathers the story from earlier writers rather than originating it.\n\n" +
      "WHAT IS BEING DATED: nothing, in the archaeological sense. This is a legendary chronology.\n\n" +
      "THE DATE, AND WHY IT IS A RANGE. The tradition gives a RELATIVE date — three hundred years before the Flood — and no absolute year. Turning that into a BCE date requires choosing a date for the Flood, which the medieval writers took from biblical genealogy and which differs between textual traditions by several centuries. The wide window on this claim is that derivation and nothing firmer. The tradition's own wording is kept above the number, because the wording is the evidence and the number is our arithmetic.\n\n" +
      "WHY THIS MATTERS FOR A READER: a widely repeated figure of 36,400 BCE is often attached to this tradition. It does not come from it. The medieval texts contain no such chronology; the figure comes from a modern astronomical model published in the 21st century and associated with the Zep Tepi idea. Treating it as though it were the medieval tradition's own date would be a false precision laid on top of a legend.\n\n" +
      "WHAT IT IS GOOD EVIDENCE FOR — and it genuinely is good evidence for this: that by the medieval period the pyramids were already so old, and so unexplained, that an elaborate literature had grown up to account for them. That is a real fact about how people have related to this monument, and it belongs on a timeline of what has been said about the Great Pyramid.\n\n" +
      "WHAT IT IS NOT: evidence that the Great Pyramid was built before the Flood, or at any date in the 4th millennium BCE or earlier.",
    notes:
      "Filed as a traditional account. The distinction between 'a tradition says X' and 'X happened' is the single most important thing on this claim, and it is why the tradition's own words are preserved rather than replaced by a number.",
  },
];

export const SHOWCASE_EVENT = {
  slug: SHOWCASE_EVENT_SLUG,
  /** Filed into this starter lane when the community has it, so Compare works. */
  trackSlug: "ancient-egypt",
  title: "Great Pyramid of Giza",
  summary:
    "The tomb built for the Fourth Dynasty king Khufu on the Giza plateau — and the most argued-over date in archaeology.",
  category: "archaeology",
  subcategory: "Ancient Egypt",
  eventType: "historical",
  eventTypeNote:
    "That the Great Pyramid exists and stands on the Giza plateau is not in dispute. What the five claims below disagree about is WHEN — and much of that disagreement comes from their dating DIFFERENT THINGS. " +
    "Conventional Egyptology dates the physical construction. Radiocarbon studies date organic samples associated with the monument. The Orion correlation proposes an astronomical reference epoch. Lost-civilisation arguments propose inherited knowledge from a much older culture. The medieval Surid tradition preserves a legendary pre-Flood account. " +
    "They should not be read as five equivalent measurements of one thing, and the gaps between them are not five rival answers to the same question.",
  locationName: "Giza plateau, Giza, Egypt",
  lat: 29.9792,
  lng: 31.1342,
  tags: [
    "ancient-egypt", "egypt", "archaeology", "architecture", "monument", "pyramid",
    "old-kingdom", "fourth-dynasty", "giza", "archaeoastronomy",
    "alternative-history", "contested-chronology",
  ],
  people: ["Khufu", "Merer", "Mark Lehner", "Pierre Tallet", "Robert Bauval", "Graham Hancock", "al-Maqrizi"],
  civilisations: ["Ancient Egypt", "Old Kingdom"],
  // Freely licensed images from Wikimedia Commons, with attribution and licence
  // in the caption where a reader can actually see them. Attribution is a
  // condition of these licences, not a courtesy, so it travels with the image
  // rather than sitting in a field nothing renders.
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/1024px-Kheops-Pyramid.jpg",
  media: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/1024px-Kheops-Pyramid.jpg",
      caption: "The Great Pyramid of Khufu from the north-east. Photograph by Nina Aldin Thune, CC BY 2.5, via Wikimedia Commons.",
      kind: "image",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/All_Gizah_Pyramids.jpg/1024px-All_Gizah_Pyramids.jpg",
      caption: "The Giza plateau, with all three main pyramids and the subsidiary queens' pyramids. Photograph by Ricardo Liberato, CC BY-SA 2.0, via Wikimedia Commons.",
      kind: "image",
    },
  ],
  description:
    "The Great Pyramid of Giza — also called the Great Pyramid, the Great Pyramid of Khufu, the Pyramid of Khufu, the Pyramid of Cheops, and known to the Egyptians themselves as Akhet-Khufu, 'the Horizon of Khufu' — is the largest of the three pyramids on the Giza plateau, on the west bank of the Nile near modern Cairo.\n\n" +
    "It was built as the tomb of Khufu, a king of Egypt's Fourth Dynasty, in the Old Kingdom. It stood about 146.6 metres high when finished and stands about 138.5 metres today, the difference being the smooth white limestone casing that was stripped away over the centuries; what a visitor sees now is the core beneath it. Each side of the base measures about 230.3 metres. It is built of limestone blocks bedded in gypsum mortar, with granite used inside for the burial chamber and its structure, and it remained the tallest structure built by human beings for more than three and a half thousand years.\n\n" +
    "Inside are three main spaces — the King's Chamber, which holds a granite sarcophagus, the Queen's Chamber, which is empty, and an unfinished subterranean chamber cut into the bedrock — linked by the Ascending and Descending Passages and the corbelled Grand Gallery. Above the King's Chamber are five relieving chambers, and it is in these that work-gang graffiti including Khufu's name survive. The pyramid does not stand alone: it is the centrepiece of a complex with a mortuary temple, a causeway, a valley temple, subsidiary queens' pyramids and boat pits, alongside the wider Giza necropolis and the excavated settlement where the workforce lived.\n\n" +
    "WHY ITS DATE MATTERS. The Great Pyramid sits near the foundation of Egyptian historical chronology, and Egyptian chronology in turn anchors much of the dating of the wider ancient Mediterranean and Near East. A change in when it was built would not be a local correction; it would move a great deal else.\n\n" +
    "WHY ALTERNATIVE CHRONOLOGIES CLUSTER AROUND IT. Its scale, its precision and the near-absence of contemporary written description of the building work have made it a magnet for competing accounts for well over a thousand years — from medieval Arabic writers who took it for a pre-Flood ark of knowledge, to modern astronomical and lost-civilisation arguments. The claims below set those out alongside the archaeological consensus, with the evidence and the objections for each, so that a reader can see not just that people disagree but WHY, and what kind of claim each one actually is.",
};

/**
 * Does this community's copy of the worked example still need its photographs?
 *
 * TWO WAYS TO BE MISSING A PICTURE, and both look the same to a reader.
 *
 * 1. It has none. The worked example shipped before the photographs were part
 *    of it, and seeding is a no-op once the event exists — so a community that
 *    took it in that window has an event that was never offered them.
 * 2. It has them, but as links to somebody else's server, which is the
 *    arrangement that produced empty grey boxes in the first place.
 *
 * Either way there is something to do and somebody should be offered it.
 */
export function showcaseNeedsPictures(event: {
  image_url: string | null;
  media?: { url: string }[] | null;
}): boolean {
  const media = event.media ?? [];
  if (media.length === 0 && !event.image_url) return true;
  return isHotlinked(event.image_url) || media.some((item) => isHotlinked(item.url));
}
