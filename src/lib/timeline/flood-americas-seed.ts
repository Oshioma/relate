import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

// =============================================================================
// PARTS L AND M — MESOAMERICA AND THE ANDES
//
// Four records, and NOT ONE OF THEM CARRIES A DATE FOR A FLOOD. That is not a
// gap in the research. None of these sources supplies one, and inventing a BCE
// year because a story is old is the single thing this dataset must not do.
//
// WHAT EACH ONE BREAKS
//
// THE POPOL VUH breaks "a flood destroys humanity". The wooden people are not
// humanity. They are a FAILED ATTEMPT at making humanity — an earlier draft,
// destroyed because it could not speak the names of its makers. Reading it as
// Noah with different names loses the entire point of the passage, which is
// about what a person is for.
//
// THE AZTEC FOURTH SUN breaks "a tradition gives no numbers". The Leyenda de
// los Soles gives an elapsed count — four hundred years, plus two ages, plus
// seventy-six — and that count is real, checkable, and ANCHORED TO NOTHING. It
// measures a duration inside a mythic sequence. It cannot be converted to BCE
// and this record does not convert it.
//
// THE HUAROCHIRÍ LLAMA breaks "the record is neutral". The manuscript was
// compiled around 1608 by indigenous assistants working under Francisco de
// Ávila, a judge in the campaign to destroy exactly the beliefs he was having
// written down. The tradition survives BECAUSE somebody tried to eradicate it,
// and the document says so about itself.
//
// AND THE FOURTH RECORD IS THAT COMPILATION, dated, because when and why a
// tradition was written down is a fact about the evidence — the same reason
// Sima Qian writing Yu into history and the Parian Marble dating Deucalion are
// their own records on this timeline.
//
// THE LINE THE MANUSCRIPT DRAWS ITSELF. At the end of the flood story its
// redactor writes that Christians believe it refers to the time of the Flood,
// "but they believe it was Villca Coto mountain that saved them". That is a
// documented moment of one tradition being read through another, written down
// by the person doing the reading. It is the clearest example on this timeline
// of why the viewpoint on a claim matters more than its date.
// =============================================================================

export const FLOOD_AMERICAS_ANCHOR_SLUG = "popol-vuh-wooden-people";

export const FLOOD_AMERICAS_TRACK: SeedTrack = {
  name: "Flood traditions: Mesoamerica and the Andes",
  slug: "flood-traditions-americas",
  kind: "theme",
  color: "#9c6b4f",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const FLOOD_AMERICAS_SOURCES: SeedSource[] = [
  {
    key: "popol_vuh_christenson",
    title: "Popol Vuh: Sacred Book of the Quiché Maya People",
    reference: "Translation and commentary by Allen J. Christenson; electronic edition published by Mesoweb",
    url: "https://www.mesoweb.com/publications/Christenson/PopolVuh.pdf",
    sourceType: "religious_text",
    publishedDisplay: "2007",
    notes:
      "A modern scholarly translation, freely available in full. Used here in preference to the many retellings " +
      "that paraphrase the flood passage into something closer to Genesis than to what the text says.",
  },
  {
    key: "ximenez_manuscript",
    title: "The Ximénez manuscript of the Popol Vuh",
    reference:
      "Francisco Ximénez, bilingual K'iche' and Spanish transcription, c. 1701–1703; now at the Newberry Library, Chicago",
    sourceType: "historical_document",
    publishedDisplay: "c. 1701–1703",
    notes:
      "THE OLDEST SURVIVING COPY, and it is a copy. Ximénez transcribed a K'iche' text into two columns and " +
      "translated it; the manuscript he worked from is lost. Everything anybody knows about the wording of the " +
      "Popol Vuh passes through this document, made around two centuries after the conquest.",
  },
  {
    key: "leyenda_de_los_soles",
    title: "Leyenda de los Soles",
    reference: "Part of the Codex Chimalpopoca; written in Nahuatl in the Latin alphabet, 1558",
    url: "https://en.wikipedia.org/wiki/Codex_Chimalpopoca",
    sourceType: "historical_document",
    publishedDisplay: "1558",
    notes:
      "Written thirty-seven years after the fall of Tenochtitlan, by Nahua scribes trained in the colonial " +
      "alphabetic tradition. That is not a reason to discount it and it is a reason to say so: it records a " +
      "pre-conquest tradition in a post-conquest form. The URL is a reference entry rather than the text itself.",
  },
  {
    key: "huarochiri_salomon",
    title: "The Huarochirí Manuscript: A Testament of Ancient and Colonial Andean Religion",
    reference: "Translated by Frank Salomon and George L. Urioste — University of Texas Press",
    url: "https://utpress.utexas.edu/9780292730533/",
    sourceType: "academic_book",
    publishedDisplay: "1991",
    notes:
      "The first English translation of the manuscript, with the Quechua text. The flood narrative and the " +
      "redactor's closing comment about what 'we Christians' believe both come from here.",
  },
  {
    key: "avila_compilation",
    title: "Francisco de Ávila and the extirpation of idolatries",
    reference: "Ávila, c. 1573–1647; the Huarochirí compilation was made under his mandate at San Damián de Checa",
    url: "https://en.wikipedia.org/wiki/Francisco_de_%C3%81vila",
    sourceType: "wikipedia",
    notes:
      "A TERTIARY SOURCE for the circumstances of the compilation, marked as one. It is used for the date and the " +
      "institutional setting, both uncontroversial; the manuscript's contents are cited to the Salomon and " +
      "Urioste translation instead.",
  },
];

// ---------------------------------------------------------------------------
// The records
// ---------------------------------------------------------------------------

export const FLOOD_AMERICAS_EVENTS: SeedEvent[] = [
  {
    slug: FLOOD_AMERICAS_ANCHOR_SLUG,
    title: "The destruction of the wooden people",
    summary:
      "In the Popol Vuh, a flood and a rain of resin destroy people made of wood — not humanity, but a failed attempt at it. The survivors became monkeys.",
    description:
      "<p>In the K'iche' Maya account, the makers try more than once. An attempt at people made of mud falls apart. An attempt at people carved from wood walks, speaks and multiplies — but the wooden people never call on their makers, never keep the days, and have nothing in their faces. They are destroyed: a flood, a rain of resin, and four destroyers who come apart from the sky. What survives of them, the text says, are the monkeys, which is why monkeys look like people and are not.</p>" +
      "<p><strong>This is not a flood that destroys humanity, and calling it one gets the passage exactly backwards.</strong> Humanity does not exist yet. The wooden people are a draft, discarded because they could not do the one thing people are for in this account — speak the names of their makers and keep the count of days. Human beings are made afterwards, out of maize.</p>" +
      "<p>There is no date. The sequence is a sequence of creations, not a chronology, and the text offers no year, no reign and no interval that could be converted into one.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["flood", "maya", "kiche", "popol-vuh", "mesoamerica", "previous-world"],
    locationName: "The K'iche' Maya highlands, Guatemala",
    civilisations: ["K'iche' Maya"],
    // What the text contains, and only that. No ark, no chosen survivor, no
    // covenant, no repopulation from the survivors — the survivors are monkeys.
    motifs: [
      "divine_punishment",
      "previous_world_destroyed",
      "prolonged_rain",
      "no_warning",
      "humanity_remade",
    ],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Popol_vuh.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Popol_vuh.jpg?width=1024",
        shows: "manuscript",
        caption:
          "The opening folio of the Xim\u00e9nez manuscript at the Newberry Library, K'iche' and Spanish in parallel " +
          "columns. This is the oldest surviving text of the Popol Vuh, written about 1701 and itself a copy. " +
          "Nothing earlier survives, so the destruction of the wooden people reaches us through a Dominican " +
          "friar's hand.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "popol_vuh_christenson",
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "previous_world",
        dateConvention: "unknown",
        whatIsDated: "Nothing — the account places this before humanity exists",
        originalDateText: "in the sequence of creations, before people were made from maize",
        datingMethod: "source_assertion",
        chronology: "traditional",
        evidence:
          "WHAT THE SOURCE GIVES: a position in a sequence, not a time. The wooden people come after the people of mud and before the people of maize. WHAT IT DOES NOT GIVE: a year, a reign, a generation count or any interval that could be converted to one. THIS CLAIM IS DELIBERATELY POSITIONLESS. A flood story from a culture with one of the most precise calendars in the ancient world does not date this event, and putting it on the axis anyway would be this timeline inventing the number the source declined to supply.",
      },
      {
        sourceKey: "ximenez_manuscript",
        startYear: 1702,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When the surviving copy of the text was made",
        originalDateText: "Ximénez's bilingual transcription, c. 1701–1703",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the manuscript, not the tradition. Ximénez copied a K'iche' text into one column and translated it into Spanish in the other; the document he worked from has not survived. WHAT THIS ESTABLISHES: that the wording everybody reads passes through a Dominican friar's hand around two centuries after the conquest. WHAT IT DOES NOT ESTABLISH: when the tradition began, which nothing here can.",
      },
    ],
  },

  {
    slug: "aztec-fourth-sun-flood",
    title: "The Fourth Sun ends in water",
    summary:
      "In the Leyenda de los Soles the fourth world ends in flood and its people become fish. The text gives an elapsed count of years — anchored to nothing that can be converted into a date.",
    description:
      "<p>The Nahua account of the suns is a sequence of worlds, each ending in a different destruction. The fourth, Nahui-Atl — Four Water — ends in flood, and its people are turned into fish.</p>" +
      "<p><strong>What makes this record worth having is the arithmetic in it.</strong> The Leyenda de los Soles does not simply say &ldquo;long ago&rdquo;. It gives an elapsed count: four hundred years, plus two ages, plus seventy-six years. That is a real figure from a real text and it is a DURATION, not a date — it measures a span inside the sequence of suns and is fixed to no year anybody can convert.</p>" +
      "<p>So this record carries the number and refuses the conversion. A count of years that cannot be tied to a calendar is not a date, however precise it looks, and treating it as one is how a tradition ends up with a spurious BCE year attached to it for ever.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["flood", "aztec", "nahua", "five-suns", "mesoamerica", "previous-world"],
    locationName: "Central Mexico",
    civilisations: ["Nahua", "Aztec"],
    motifs: ["previous_world_destroyed", "multiple_floods", "natural_catastrophe"],
    claims: [
      {
        sourceKey: "leyenda_de_los_soles",
        durationYears: 676,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "previous_world",
        dateConvention: "relative",
        whatIsDated: "An elapsed count inside the sequence of suns, not a position in time",
        originalDateText: "four hundred years, plus two ages, plus seventy-six years",
        datingMethod: "source_assertion",
        chronology: "traditional",
        evidence:
          "WHAT THE SOURCE GIVES: an elapsed count, stated in the text's own units — four hundred years, two ages and seventy-six years. WHY THERE IS NO START YEAR: the count runs from a point inside the sequence of suns, and that point is not fixed to any calendar. A duration without an anchor cannot become a date. WHAT THE NUMBER HERE IS: the count read as 676 years, which is what the phrase adds to if 'age' is read as a unit of years; that reading is not certain and the original wording is kept above it so anybody can check. NEEDS SOURCE VERIFICATION: the value of an 'age' in this passage, against the Nahuatl rather than a translation of a translation.",
      },
      {
        sourceKey: "leyenda_de_los_soles",
        startYear: 1558,
        datePrecision: "year",
        // The document's date is firm; nothing about it is approximate.
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When this account was written down",
        originalDateText: "1558",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A FIRM DATE, and it is a date for the document. The Leyenda de los Soles was written in Nahuatl in the Latin alphabet in 1558 — thirty-seven years after the fall of Tenochtitlan, by scribes trained in a colonial tradition recording a pre-conquest one. That is worth stating plainly rather than leaving as an unexamined 'ancient Aztec myth': the account is pre-conquest, the document is not, and every reader deserves to know which they are holding.",
      },
    ],
  },

  {
    slug: "huarochiri-villca-coto",
    title: "The llama that would not eat, and the mountain Villca Coto",
    summary:
      "A llama knows the sea is about to overflow and warns its owner. They climb Villca Coto with five days' food and find every animal already there. The flood lasts five days.",
    description:
      "<p>In the Huarochirí account a llama buck will not eat. Its owner complains, and the llama tells him the ocean will overflow in five days. They go up Villca Coto mountain with five days' food and find the peak already crowded with every kind of animal. The water comes as soon as they arrive, rises to the peak, and after five days goes back to where the sea belongs.</p>" +
      "<p><strong>The warning comes from an animal, and that is not a decorative difference.</strong> There is no god who decides, no covenant, no punishment of anybody for anything, and no ark — the refuge is a mountain that was already there and already full. The people who survive are not chosen; they are the ones who listened to a llama.</p>" +
      "<p>At the end of the passage the manuscript's redactor adds that Christians believe this refers to the time of the Flood, <em>but they believe it was Villca Coto mountain that saved them</em>. The document records the moment of its own reinterpretation, and names both readings.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["flood", "andes", "quechua", "huarochiri", "peru", "oral-tradition"],
    locationName: "Huarochirí province, central highlands of Peru",
    civilisations: ["Quechua", "Andean highland communities"],
    // An animal warns; the refuge is a mountain; animals are already on it; a
    // few survive. No ark, no divine punishment, no covenant, no repopulation.
    motifs: ["animal_warning", "rising_sea", "mountain_refuge", "animals_preserved", "few_survive", "waters_recede"],
    claims: [
      {
        sourceKey: "huarochiri_salomon",
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "unknown",
        dateConvention: "unknown",
        whatIsDated: "Nothing — the account gives no time at all",
        originalDateText: "no time is given",
        datingMethod: "source_assertion",
        chronology: "oral_tradition",
        evidence:
          "WHAT THE SOURCE GIVES: a duration inside the story — five days' warning, five days of water — and NOTHING that places the story in time. No reign, no generation count, no interval from any fixed point. THIS CLAIM IS POSITIONLESS ON PURPOSE. The alternative is to guess, and a guess written into a database becomes a fact within about one retelling.",
      },
      {
        sourceKey: "huarochiri_salomon",
        startYear: 1608,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When the account was written down",
        originalDateText: "compiled by about 1608",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the writing down. The account exists in a manuscript compiled around 1608 in Quechua by indigenous assistants working under Francisco de Ávila. WHAT THIS ESTABLISHES: the earliest surviving form of the narrative and the circumstances of its recording. WHAT IT DOES NOT: how old the tradition is, which this record does not claim to know.",
      },
    ],
  },

  {
    slug: "huarochiri-manuscript-compiled",
    title: "The Huarochirí Manuscript is compiled, to be destroyed",
    summary:
      "Around 1608 Francisco de Ávila had the traditions of Huarochirí written down in Quechua — as a catalogue of beliefs to be eradicated. It is now the best source for the religion he was suppressing.",
    description:
      "<p>Francisco de Ávila was a judge in the Peruvian campaign known as the extirpation of idolatries. Around 1608, at San Damián de Checa, he had literate indigenous assistants record the oral traditions of the Huarochirí province in Quechua — so that the beliefs could be identified and destroyed.</p>" +
      "<p><strong>The result is the most important surviving source for Andean religion.</strong> Ávila's lasting legacy is a written record of exactly the culture he spent his life trying to erase, and no reading of any story in it is complete without that fact.</p>" +
      "<p>This record is here for the same reason Sima Qian writing Gun and Yu into history is here, and the Parian Marble dating Deucalion: <em>when a tradition was written down, by whom, and why</em> is a fact about the evidence, it is datable, and leaving it out makes a document look like a neutral window onto the past.</p>",
    category: "culture",
    subcategory: "Textual history",
    eventType: "historical_event",
    tags: ["andes", "quechua", "huarochiri", "peru", "colonial", "source-history"],
    locationName: "San Damián de Checa, Huarochirí province, Peru",
    people: ["Francisco de Ávila"],
    civilisations: ["Viceroyalty of Peru", "Quechua"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Huarochiri_Runa_yndio_niscap_machoncuna_naupa_pacha.png?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Huarochiri_Runa_yndio_niscap_machoncuna_naupa_pacha.png?width=1024",
        shows: "manuscript",
        caption:
          "The opening of the Huarochir\u00ed Manuscript in Quechua: \u201cRuna yndio \u00f1iscap machoncuna \u00f1aupa pacha\u201d. It " +
          "was commissioned in order to find and destroy what it records, and it survives because the page was " +
          "written before the campaign it was meant to serve got to the things on it.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "avila_compilation",
        startYear: 1608,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        dateConvention: "calendar",
        whatIsDated: "The compilation of the manuscript",
        originalDateText: "compiled by about 1608, under Ávila's mandate",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS CLAIMED: that the manuscript was compiled by about 1608 at San Damián de Checa under Francisco de Ávila, as part of the extirpation campaign. HOW IT IS DATED: from the colonial administrative record of the campaign and of Ávila's posting. WHY THIS IS ITS OWN RECORD RATHER THAN A NOTE: the circumstances of a document's making are evidence about the document, and a reader who does not know that this one was made by the people trying to destroy its contents will read every story in it wrongly.",
      },
    ],
  },
];

export const FLOOD_AMERICAS_LINKS: SeedEventLink[] = [
  {
    from: "huarochiri-villca-coto",
    to: "huarochiri-manuscript-compiled",
    relation: "source_of",
    viewpoint: "historical",
    sourceKey: "huarochiri_salomon",
    note:
      "The account survives only in that compilation, and the compilation was made in order to destroy what it recorded. The circumstances travel with the story.",
  },
  {
    from: FLOOD_AMERICAS_ANCHOR_SLUG,
    to: "aztec-fourth-sun-flood",
    relation: "related",
    viewpoint: "traditional",
    note:
      "Two Mesoamerican accounts in which a flood ends a world that is not ours, and neither destroys humanity: the Popol Vuh's wooden people are a failed draft of people, and the Fourth Sun is an earlier world entirely. They are NOT versions of one story and neither is a version of Noah.",
  },
];
