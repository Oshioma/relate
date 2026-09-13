import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// WHEN THE ACCEPTED DATE IS THE SURPRISING ONE
//
// Sixth tranche, and the one that exists to stop this dataset leaving a false
// impression. Read enough disputed-date records and a pattern suggests itself:
// the alternative claim is the astonishing one and the accepted chronology is
// the dull, conservative, deflating answer.
//
// THAT IS NOT WHAT THE ACCEPTED CHRONOLOGY IS LIKE. These three records are all
// mainstream, all arrived at by ordinary means, and all more interesting than
// the alternative accounts attached to them.
//
//   • MALTA. The temples are among the oldest free-standing buildings anywhere
//     on Earth — older than the Giza pyramids, older than Stonehenge — and that
//     is the RADIOCARBON answer. Nobody needed an alternative chronology to get
//     there. The accepted date is the extraordinary one.
//   • NAN MADOL. The monument ITSELF is dated, by uranium-thorium on coral in
//     the fabric, to a twenty-year window. Not a deposit near it, not material
//     recovered from around it — the construction. It is the most precisely
//     dated building in this whole dataset.
//   • RAPA NUI. The accepted date MOVED, and it moved later. AD 400 to 800 was
//     the mainstream figure for decades. Hunt and Lipo's stricter radiocarbon
//     selection put settlement at about AD 1200, and that is now the accepted
//     view. A date that was once mainstream is now the superseded one.
//
// SO PUT RAPA NUI BESIDE PEDRA FURADA AND HUEYATLACO, elsewhere in this
// dataset, and the useful lesson appears. At the early American sites the
// accepted date moved EARLIER, and some claims that were alternative became
// accepted. At Rapa Nui it moved LATER, and a claim that was accepted became
// superseded. Chronology is revised in both directions, by the same methods,
// and neither direction is a scandal.
//
// AND "SCIENCE CHANGES ITS MIND" IS THE WRONG HALF OF IT. What actually changed
// at Rapa Nui was the sample selection: Hunt and Lipo applied what they called
// chronometric hygiene, excluding material known to give bad dates — old wood,
// marine shell. The method got stricter and the answer moved eight hundred
// years. Which is also the exact contaminant that makes Giza's mortar dates
// messy on the record before this one: the same problem, removed in one place
// and not removable in the other.
//
// NO CONFIDENCE SCORES, no verdict words. And no treating an accepted date as
// needing less evidence than a disputed one — every claim here says what it
// dates, by what method, and what it does not establish, exactly as the
// contested records do.
// =============================================================================

export const ANCIENT_SITES_ACCEPTED_ANCHOR_SLUG = "malta-megalithic-temples";

export const ANCIENT_SITES_ACCEPTED_TRACK: SeedTrack = {
  name: "When the accepted date is the surprising one",
  slug: "ancient-sites-accepted-surprise",
  kind: "theme",
  color: "#4f7a4a",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_ACCEPTED_SOURCES: SeedSource[] = [
  // --- Malta --------------------------------------------------------------
  {
    key: "unesco_malta",
    title: "Megalithic Temples of Malta — UNESCO World Heritage List",
    workTitle: "UNESCO World Heritage Centre",
    url: "https://whc.unesco.org/en/list/132/",
    sourceType: "government",
    notes:
      "The inscription for the Maltese temples, describing them as ranking among the earliest free-standing stone " +
      "buildings in the world and noting their diversity of form and decoration. Cited for the accepted standing " +
      "of the sites, which is the point of this record: the extraordinary claim here is the mainstream one.",
  },
  {
    key: "wikipedia_malta_temples",
    title: "Megalithic Temples of Malta — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Megalithic_Temples_of_Malta",
    sourceType: "wikipedia",
    notes:
      "Used for the phase chronology — the Ġgantija phase at 3600–3000 BC on recalibrated radiocarbon, Ta' Ħaġrat, " +
      "Ta' Skorba and Ġgantija between about 3600 and 3200 BC, and the Temple Period as a whole from about 4100 to " +
      "2500 BC — and for the astronomical alignment of Mnajdra's south temple. Orientation; the dating is " +
      "radiocarbon and is attributed as such on the claims.",
  },
  {
    key: "wikipedia_skorba",
    title: "Skorba Temples — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Skorba_Temples",
    sourceType: "wikipedia",
    notes:
      "Cited for something this tranche needs: that radiocarbon analysis of pottery from Skorba moved some finds " +
      "LATER than first thought, and that the Grey and Red Skorba phases were recognised to accommodate the " +
      "result. A revision in the unglamorous direction, made quietly, and worth having on a timeline that is " +
      "otherwise full of arguments about revision.",
  },

  // --- Nan Madol ----------------------------------------------------------
  {
    key: "mccoy2016",
    title:
      "Earliest direct evidence of monument building at the archaeological site of Nan Madol (Pohnpei, Micronesia) identified using 230Th/U coral dating and geochemical sourcing of megalithic architectural stone",
    author: "Mark D. McCoy and colleagues",
    workTitle: "Quaternary Research",
    reference: "2016",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0033589416300436",
    sourceType: "academic_paper",
    publishedYear: 2016,
    notes:
      "The first application of uranium–thorium series dating to the stone architecture of Nan Madol, on coral in " +
      "the fabric, together with geochemical sourcing of the basalt. It dates the BUILDING rather than anything " +
      "near it, to a twenty-year window, and it shows that around forty per cent of the stone in the central tomb " +
      "came from a volcanic plug on the far side of Pohnpei. Cited as the most precisely dated construction in " +
      "this dataset.",
  },
  {
    key: "unesco_nan_madol",
    title: "Nan Madol: Ceremonial Centre of Eastern Micronesia — UNESCO World Heritage List",
    workTitle: "UNESCO World Heritage Centre",
    url: "https://whc.unesco.org/en/list/1503",
    sourceType: "government",
    notes:
      "Cited for the scale and the setting — artificial islets and architecture across some 83 hectares of lagoon, " +
      "built of columnar basalt and coral — and for the site's standing as the ceremonial centre of the Saudeleur " +
      "dynasty. Orientation; the dating on the record is McCoy's.",
  },

  // --- Rapa Nui -----------------------------------------------------------
  {
    key: "hunt_lipo2006",
    title: "Late colonization of Easter Island",
    author: "Terry L. Hunt and Carl P. Lipo",
    workTitle: "Science",
    reference: "Volume 311, pages 1603–1606 (2006)",
    url: "https://www.science.org/doi/10.1126/science.1121879",
    sourceType: "academic_paper",
    publishedYear: 2006,
    notes:
      "The paper that moved the date. Eight wood-charcoal samples from the base of Anakena, plus a reassessment of " +
      "existing dates under what the authors call chronometric hygiene — excluding sample types known to give bad " +
      "results, such as old wood and marine shell. Cited for the method as much as for the answer, because the " +
      "method is what changed.",
  },
  {
    key: "rapanui_islandwide2013",
    title:
      "An island-wide assessment of the chronology of settlement and land use on Rapa Nui (Easter Island) based on radiocarbon data",
    workTitle: "Journal of Archaeological Science",
    reference: "2013",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0305440313002264",
    sourceType: "academic_paper",
    publishedYear: 2013,
    notes:
      "A later island-wide assessment of the radiocarbon record, narrowing initial settlement to roughly AD 1150 " +
      "to 1280 under a stringent selection of dates. Cited because it shows the revision being tested rather than " +
      "simply adopted. NEEDS SOURCE VERIFICATION for the authorship, which was not traced for this entry.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_ACCEPTED_EVENTS: SeedEvent[] = [
  // =========================================================================
  // MALTA — the accepted date is the astonishing one.
  // =========================================================================
  {
    slug: ANCIENT_SITES_ACCEPTED_ANCHOR_SLUG,
    title: "The Maltese temples are built",
    summary:
      "Among the oldest free-standing buildings on Earth — older than Giza, older than Stonehenge — and that is the radiocarbon answer, not an alternative one.",
    description:
      "On Malta and Gozo stand a group of megalithic temple complexes — Ġgantija, Ħaġar Qim, Mnajdra, Tarxien, Ta' Ħaġrat and Ta' Skorba — built during what Maltese archaeology calls the Temple Period, running from roughly 4100 to 2500 BCE. The Ġgantija phase is dated to about 3600 to 3000 BCE on recalibrated radiocarbon, and Ta' Ħaġrat, Ta' Skorba and Ġgantija to between about 3600 and 3200 BCE.\n\n" +
      "THEY ARE AMONG THE EARLIEST FREE-STANDING STONE BUILDINGS IN THE WORLD. Older than the pyramids at Giza. Older than Stonehenge as it now stands. Built on two small islands by a farming population, in stone, to a considered plan, with carved decoration.\n\n" +
      "AND THAT IS THE MAINSTREAM POSITION, WHICH IS WHY THIS RECORD IS ON THIS TIMELINE. Nobody had to reach outside the accepted chronology to arrive at it. It came from excavation and radiocarbon, it is inscribed on the World Heritage List, and it is taught. A reader working through records where an alternative claim is the startling one should meet a site where the startling claim is the conventional one — because otherwise this dataset quietly teaches that official chronology is always the deflating answer, and that is false.\n\n" +
      "MNAJDRA'S SOUTH TEMPLE IS ASTRONOMICALLY ALIGNED, and it is worth saying carefully what that does and does not mean here. Its passage is lit by the sun at the equinoxes and the solstices. That is a real, observable, repeatable fact about the building, and it is evidence that the builders attended to the sun. IT IS NOT HOW THE TEMPLE IS DATED. The dating is radiocarbon. Compare Giza and Tiwanaku, elsewhere in this dataset, where alignments have been run backwards through precession to produce dates — at Mnajdra the alignment works NOW, which tells you about intention and nothing about age.\n\n" +
      "AND THE CHRONOLOGY HAS BEEN REVISED DOWNWARDS TOO. Radiocarbon on pottery from Skorba showed some material to be LATER than had been thought, and the Grey and Red Skorba phases were recognised to accommodate it. A revision in the unglamorous direction, made without fuss. Revision runs both ways, which is the whole argument of this group of records.",
    category: "archaeology",
    subcategory: "Accepted chronology",
    eventType: "mainstream",
    eventTypeNote:
      "Not disputed. Here because the accepted date is the extraordinary one, and because a dataset full of disputes needs a record where the conventional answer is the surprising answer.",
    tags: ["malta", "gozo", "ggantija", "mnajdra", "megalithic", "control", "ancient-sites"],
    civilisations: ["Neolithic Malta"],
    locationName: "Malta and Gozo",
    lat: 35.9,
    lng: 14.4,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Facade_Hagar_Qim.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Facade_Hagar_Qim.jpg?width=1024",
        shows: "site",
        caption:
          "The facade of Ħaġar Qim, Malta. These are among the oldest free-standing stone buildings anywhere, and " +
          "the date is the ACCEPTED one — this record is here because the surprising answer is the mainstream " +
          "answer.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Hagar_qim_temples_2.jpg?width=1024",
        shows: "site",
        caption:
          "Inside the same complex. Nothing about the age of these buildings is a fringe claim: it is the " +
          "excavated, radiocarbon-dated account, and it is older than the pyramids.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "wikipedia_malta_temples",
        startYear: -3599,
        endYear: -2999,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Ġgantija phase, about 3600 to 3000 BCE, on recalibrated radiocarbon",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        whatIsDated: "The phase in which the earliest of these temples were built",
        evidence:
          "WHAT IS DATED: the archaeological phase, from recalibrated radiocarbon on excavated material. DATING " +
          "METHOD: radiocarbon. WHAT IT ESTABLISHES: that free-standing stone temples were being built on Malta " +
          "and Gozo in the fourth millennium BCE — earlier than the Giza pyramids and earlier than Stonehenge as " +
          "it now stands. WHAT IT DOES NOT ESTABLISH: a year for any one building. A phase is a bracket, and the " +
          "individual temples were built, rebuilt and altered within and across these phases.",
        notes:
          "Stored in astronomical year numbering: 3600 BCE is −3599. A century-level bracket marked approximate, " +
          "because that is the resolution the evidence has.\n\n" +
          "THE EXTRAORDINARY CLAIM HERE IS THE CONVENTIONAL ONE, and that is the reason this record exists.",
        citations: [
          {
            sourceKey: "unesco_malta",
            relation: "supports",
            note: "The World Heritage inscription, describing them as among the earliest free-standing stone buildings anywhere.",
          },
        ],
      },
      {
        sourceKey: "wikipedia_malta_temples",
        startYear: -4099,
        endYear: -2499,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Temple Period as a whole, about 4100 to 2500 BCE",
        datingMethod: "archaeological",
        chronology: "conventional",
        whatIsDated: "The whole span of temple building on the islands",
        evidence:
          "WHAT IS DATED: the period, as a sequence of phases built from excavation, pottery typology and " +
          "radiocarbon. DATING METHOD: the archaeological phase sequence. WHAT IT ESTABLISHES: that this was a " +
          "building tradition lasting something like a millennium and a half rather than a single episode. WHAT IT " +
          "DOES NOT ESTABLISH: when any particular temple was begun, which is what the phase claims are for.",
        notes:
          "On the record as its own claim so that the long span is visible. A tradition that ran for fifteen " +
          "hundred years is a different kind of thing from a single extraordinary build, and the difference is " +
          "lost if only the earliest date is shown.",
      },
      {
        sourceKey: "wikipedia_skorba",
        startYear: -4499,
        endYear: -3999,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Grey and Red Skorba phases, about 4500 to 4000 BCE, recognised after radiocarbon moved material later",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        whatIsDated: "The pre-temple Skorba phases, and a revision that made material younger",
        evidence:
          "WHAT IS DATED: pottery from Skorba, by radiocarbon. DATING METHOD: radiocarbon. WHAT IT ESTABLISHES: " +
          "that some finds were later than had been supposed, and that the Grey and Red Skorba phases were " +
          "recognised to accommodate the result. WHAT IT DOES NOT ESTABLISH: anything about the temples " +
          "themselves, which are later — but it establishes something about how chronology is built, which is why " +
          "it is here.",
        notes:
          "A REVISION IN THE UNGLAMOROUS DIRECTION. Dates moving later, quietly, because a measurement said so. " +
          "Worth a claim of its own on a timeline where revision is usually met as a controversy, and worth " +
          "reading against Rapa Nui, where the same direction of movement was a much larger story.",
      },
      {
        sourceKey: "wikipedia_malta_temples",
        startYear: -3599,
        endYear: -2499,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Mnajdra's south temple, aligned so the passage is lit at the equinoxes and solstices",
        datingMethod: "astronomical",
        chronology: "archaeological",
        whatIsDated: "What the builders were attending to — the alignment, which is not how the temple is dated",
        evidence:
          "WHAT IS DATED: nothing. The alignment is evidence about INTENTION and is filed as a claim so that it is " +
          "not mistaken for a date. DATING METHOD: observation of the building as it stands — the passage of the " +
          "south temple is lit by the sun at the equinoxes and the solstices. WHAT IT ESTABLISHES: that the " +
          "builders set the temple to the sun, deliberately. WHAT IT DOES NOT ESTABLISH: the temple's age. The age " +
          "comes from radiocarbon, and an alignment that works NOW tells you about purpose rather than antiquity.",
        notes:
          "THE CONTRAST WITH GIZA AND TIWANAKU IS THE POINT. There, alignments were run backwards through " +
          "precession to generate dates — at Giza to 10,500 BCE, at Tiwanaku to about 15,000 BCE. Here the " +
          "alignment is not used to date anything, and the record says so in the heading rather than leaving a " +
          "reader to infer it.\n\n" +
          "A solar alignment is also much less prone to this than a stellar one: the solstice azimuth moves with " +
          "the slow change in the tilt of the Earth's axis, not at the rate a star's rising shifts under " +
          "precession — which is exactly the substitution that produced Posnansky's figure.",
      },
    ],
  },

  // =========================================================================
  // NAN MADOL — the building itself, dated to twenty years.
  // =========================================================================
  {
    slug: "nan-madol-built",
    title: "Nan Madol's monumental building begins",
    summary:
      "Uranium–thorium on coral in the fabric dates the construction itself — not a deposit near it — to a twenty-year window around AD 1180 to 1200.",
    description:
      "Nan Madol, on Pohnpei in Micronesia, is a complex of artificial islets and monumental architecture spread across some 83 hectares of lagoon, built of columnar basalt and coral. It was the ceremonial centre of the Saudeleur dynasty.\n\n" +
      "WHAT MAKES IT THE MOST PRECISELY DATED BUILDING IN THIS DATASET. McCoy and colleagues applied uranium–thorium series dating to coral within the stone architecture — the first time the method had been used on the structures themselves rather than on associated deposits. The enclosing wall of the Saudeleur tomb gives about AD 1180, and construction continuing gives about AD 1200. A twenty-year window.\n\n" +
      "THAT IS A DIFFERENT KIND OF RESULT FROM ALMOST EVERYTHING ELSE HERE, and the difference is worth dwelling on. At the Gulf of Khambhat a piece of dredged wood was dated and could not be tied to any structure. At Tiwanaku the Pumapunku's date comes from material in the mound fill the platform was raised on — good evidence, and still one step removed. At Nan Madol the dated material is IN THE BUILDING. There is no inferential step from deposit to construction because there is no deposit in the chain.\n\n" +
      "THE SAME STUDY ALSO SOURCED THE STONE. Geochemical analysis showed that around forty per cent of the basalt in the central tomb came from a volcanic plug on the opposite side of the island. So the cost of the thing is measurable: somebody moved columnar basalt across Pohnpei, and the study reads that transport cost as a statement about the authority of the island's first chiefs.\n\n" +
      "NAN MADOL IS OFTEN DRAWN INTO ACCOUNTS OF A SUNKEN PACIFIC CONTINENT — Mu, or Lemuria. This timeline carries records for Lemuria as an idea with its own history, and they are the right place for that claim, traced to the people who made it. What belongs here is the site's own chronology, which is not in dispute and did not need to be rescued from anybody.\n\n" +
      "IT IS ALSO NOT A SMALL THING BUILT RECENTLY. Eight hundred years old, built of stone moved across an island, covering eighty-three hectares of reef. The accepted date is not the deflating answer here either; it is just a checkable one.",
    category: "archaeology",
    subcategory: "Accepted chronology",
    eventType: "mainstream",
    eventTypeNote:
      "Not disputed. Here as the dataset's clearest case of a monument dated directly — the dated material is in the building, so nothing has to be inferred from a nearby deposit.",
    tags: ["nan-madol", "pohnpei", "micronesia", "saudeleur", "uranium-series", "control", "ancient-sites"],
    people: ["Mark D. McCoy"],
    civilisations: ["Saudeleur"],
    locationName: "Nan Madol, Pohnpei, Federated States of Micronesia",
    lat: 6.8417,
    lng: 158.3339,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nan_madol.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Nan_madol.jpg?width=1024",
        shows: "site",
        caption:
          "Walls at Nan Madol, built from columnar basalt laid like logs. Around a hundred artificial islets on a " +
          "reef off Pohnpei — an enormous undertaking that is not disputed and is simply less famous than it should " +
          "be.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Nan_Madol_megalithic_site,_Pohnpei_(Federated_States_of_Micronesia)_5.jpg?width=1024",
        shows: "site",
        caption:
          "Nan Madol, built of columnar basalt laid up in courses. The basalt is naturally columnar — it comes out " +
          "of the ground in prisms — which answers the question of how the pieces were shaped without answering how " +
          "they were moved, and the second question is the one the site is famous for.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "mccoy2016",
        startYear: 1180,
        datePrecision: "year",
        isApproximate: true,
        uncertaintyPlus: 7,
        uncertaintyMinus: 7,
        originalDateText: "about AD 1180 (771 ± 7 years) for the enclosing wall of the Saudeleur tomb",
        datingMethod: "uranium_series",
        chronology: "conventional",
        whatIsDated: "The enclosing wall of the tomb — coral in the structure itself",
        evidence:
          "WHAT IS DATED: coral within the stone architecture of the enclosing wall. DATING METHOD: uranium–thorium " +
          "series, applied to the building rather than to any deposit near it. WHAT IT ESTABLISHES: that massive " +
          "stones were being moved and set by about AD 1180, within a few years. WHAT IT DOES NOT ESTABLISH: when " +
          "Pohnpei was settled, or when the islets were first occupied — both are earlier questions, and this " +
          "dates a wall.",
        notes:
          "The ± 7 years is the reported tolerance on the determination and is stored as a tolerance.\n\n" +
          "NO INFERENTIAL STEP FROM DEPOSIT TO CONSTRUCTION, because the dated material is in the fabric. That is " +
          "what makes this record the best available demonstration of what the other records in this dataset are " +
          "usually missing.",
      },
      {
        sourceKey: "mccoy2016",
        startYear: 1200,
        datePrecision: "year",
        isApproximate: true,
        uncertaintyPlus: 6,
        uncertaintyMinus: 6,
        originalDateText: "about AD 1200 (747 ± 6 years) for construction continuing",
        datingMethod: "uranium_series",
        chronology: "conventional",
        whatIsDated: "A later stage of the same construction",
        evidence:
          "WHAT IS DATED: coral from a later stage of the building work. DATING METHOD: uranium–thorium series. " +
          "WHAT IT ESTABLISHES: that the work continued, placing the monumental phase in a window of about twenty " +
          "years. WHAT IT DOES NOT ESTABLISH: that everything at Nan Madol belongs to those twenty years. The site " +
          "covers 83 hectares and this dates two points in one part of it.",
        notes:
          "Kept as a second claim rather than folded into a span with the first, because they are two separate " +
          "determinations with two separate tolerances. '1180 ± 7 and 1200 ± 6' is not the same assertion as " +
          "'somewhere between 1173 and 1206'.",
        citations: [
          {
            sourceKey: "unesco_nan_madol",
            relation: "context",
            note: "The scale of the complex, and the Saudeleur dynasty whose centre it was.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // RAPA NUI — where the accepted date moved, and moved later.
  // =========================================================================
  {
    slug: "rapa-nui-settled",
    title: "Rapa Nui is settled",
    summary:
      "AD 400 to 800 was the mainstream figure for decades. Stricter sample selection moved it to about AD 1200 — a date that was accepted becoming the superseded one.",
    description:
      "For much of the twentieth century the accepted date for the settlement of Rapa Nui was somewhere between AD 400 and 800, resting on a small number of radiocarbon dates, lake-core results and inferences from historical linguistics.\n\n" +
      "IN 2006 HUNT AND LIPO MOVED IT BY EIGHT HUNDRED YEARS. They took eight wood-charcoal samples from the base of Anakena, the oldest known archaeological site on the island, and reassessed the existing radiocarbon record. Their conclusion, published in Science, was that the island was colonised late — about AD 1200. Later island-wide assessment of the radiocarbon record narrowed initial settlement to roughly AD 1150 to 1280, and that is now the accepted view.\n\n" +
      "WHAT ACTUALLY CHANGED WAS THE SAMPLE SELECTION, NOT THE SCIENCE. Hunt and Lipo applied what they called chronometric hygiene: excluding material of kinds known to give inaccurate results — old wood, and shell from marine animals. The measurements were not wrong. The question of which measurements should be believed was answered differently, and the answer moved by eight centuries.\n\n" +
      "OLD WOOD IS THE SAME CONTAMINANT THAT MAKES GIZA'S MORTAR DATES MESSY, on another record in this dataset. Charcoal from timber that was already old when it was burned dates the tree, not the event. At Giza it cannot be excluded, because the charcoal is in the mortar and there is no way to select around it. At Rapa Nui it could be excluded, and excluding it changed the chronology of an island.\n\n" +
      "NOW PUT THIS RECORD BESIDE PEDRA FURADA AND HUEYATLACO. In the Americas the accepted date moved EARLIER, and claims that had been alternative became accepted. Here it moved LATER, and a claim that was accepted became superseded. Revision runs in both directions, driven by the same kind of argument about which evidence counts. A reader who has only ever seen chronology revised towards greater antiquity has seen half of it.\n\n" +
      "AND IT MAKES THE ISLAND'S ACHIEVEMENT LARGER RATHER THAN SMALLER. The moai, the platforms and the quarrying all postdate settlement, so a later arrival compresses them into a shorter time, not a longer one. Substantial ecological change and major investment in monumental statuary began soon after people landed. That is the accepted account, and it is more remarkable than the one it replaced.",
    category: "archaeology",
    subcategory: "Accepted chronology",
    eventType: "mainstream",
    eventTypeNote:
      "The current accepted date, and the record of a mainstream chronology being revised LATER. The superseded figure is on the record as a claim, because it was a real position held on real evidence.",
    tags: ["rapa-nui", "easter-island", "moai", "chronometric-hygiene", "revision", "ancient-sites"],
    people: ["Terry L. Hunt", "Carl P. Lipo"],
    civilisations: ["Rapa Nui"],
    locationName: "Rapa Nui (Easter Island)",
    lat: -27.1127,
    lng: -109.3497,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ahu_Tongariki.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Ahu_Tongariki.jpg?width=1024",
        shows: "site",
        caption:
          "Moai at Ahu Tongariki. The settlement date on this record is one where SCIENCE CHANGED ITS MIND: the " +
          "earlier estimate of the first millennium CE has been pulled several centuries later by re-dated " +
          "material.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Rano_Raraku_quarry.jpg?width=1024",
        shows: "site",
        caption:
          "The quarry at Rano Raraku, with moai left unfinished in the rock face. The statues are the reason the " +
          "settlement date matters to people arguing about the island — and the quarry shows the work as a process " +
          "with stages, which is what an argument about how long it took has to fit.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "hunt_lipo2006",
        startYear: 1200,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "about AD 1200, from the base of Anakena under chronometric hygiene",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        whatIsDated: "The initial settlement of the island",
        evidence:
          "WHAT IS DATED: the earliest stratigraphic layers at Anakena, from eight wood-charcoal samples, plus a " +
          "reassessment of the existing radiocarbon record. DATING METHOD: radiocarbon under chronometric hygiene " +
          "— excluding sample types known to give inaccurate results, notably old wood and marine shell. WHAT IT " +
          "ESTABLISHES: that colonisation was late, about AD 1200, and so that monumental statuary and major " +
          "ecological change followed soon after arrival. WHAT IT DOES NOT ESTABLISH: that no earlier visit " +
          "happened, which is a different and harder question than when settlement began.",
        notes:
          "THE METHOD IS THE STORY. The measurements were not wrong before; the selection of which measurements to " +
          "believe was. That is the kind of change that moves a date eight hundred years without anyone having " +
          "made an error of arithmetic.",
        citations: [
          {
            sourceKey: "rapanui_islandwide2013",
            relation: "supports",
            note: "The island-wide reassessment, narrowing initial settlement to about AD 1150 to 1280.",
          },
        ],
      },
      {
        sourceKey: "hunt_lipo2006",
        startYear: 400,
        endYear: 800,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the long-accepted figure of about AD 400 to 800, now superseded",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        whatIsDated: "The settlement date as accepted before 2006",
        evidence:
          "WHAT IS DATED: the same event, on the earlier reading of the evidence. DATING METHOD: radiocarbon, from " +
          "a small number of dates, together with lake-core results and inferences from historical linguistics. " +
          "WHAT IT ESTABLISHES: that this was the mainstream position for decades, held by specialists on real " +
          "evidence. WHAT IT DOES NOT ESTABLISH: the settlement date, on the current reading — the samples it " +
          "relied on include kinds now excluded as unreliable.",
        notes:
          "A SUPERSEDED MAINSTREAM DATE, ON THE RECORD AS A CLAIM. Leaving it off would hide the most useful thing " +
          "about this site: that a date can be accepted, taught, and then set aside, and that this happens in the " +
          "direction of LESS antiquity as well as more.\n\n" +
          "It is not filed as an alternative chronology, because it never was one. It was the conventional view, " +
          "which is exactly why it is worth seeing here.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_ACCEPTED_LINKS: SeedEventLink[] = [
  {
    from: ANCIENT_SITES_ACCEPTED_ANCHOR_SLUG,
    to: "rapa-nui-settled",
    relation: "relevant",
    note:
      "Two revisions in the same direction, at very different scales. Radiocarbon moved some Skorba material later " +
      "and a phase was added to accommodate it; radiocarbon moved Rapa Nui's settlement later by eight centuries.",
  },
  {
    from: "nan-madol-built",
    to: ANCIENT_SITES_ACCEPTED_ANCHOR_SLUG,
    relation: "relevant",
    note:
      "Both accepted, both remarkable, and dated by quite different routes — a phase bracket from recalibrated " +
      "radiocarbon against a twenty-year window from uranium–thorium on coral in the wall.",
  },
  {
    from: "rapa-nui-settled",
    to: "nan-madol-built",
    relation: "relevant",
    note:
      "Two Pacific sites dated within a century of each other, by methods of very different precision, and both " +
      "later than popular accounts assume.",
  },
];
