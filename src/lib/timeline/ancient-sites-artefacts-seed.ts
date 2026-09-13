import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// ANOMALOUS ARTEFACTS: OBJECTS SAID TO HAVE COME OUT OF VERY OLD ROCK
//
// Third tranche of the disputed-dates dataset, and the one where the
// architecture does the most work.
//
// EVERY RECORD HERE HAS THE SAME SHAPE, because every claim here has the same
// shape:
//
//   • A DATE FOR THE REPORT. Somebody wrote something down in 1852, or 1862,
//     or 1891. That is a fact with a date, and it is usually the only firmly
//     dated thing on the record.
//   • A DATE FOR THE HOST MATERIAL. The coal is Pennsylvanian. The conglomerate
//     is Precambrian. The gravels are under a late Miocene lava cap. These are
//     real geological ages and none of them is in dispute.
//   • NO MEASURED DATE FOR THE OBJECT. Not one of these objects has been dated.
//     Four of these five records carry no claim dating a pot, a chain or a bone
//     at all, and that absence is the point rather than a gap.
//
// THE ONE EXCEPTION IS WRITTEN AS AN EXCEPTION. At Table Mountain, Whitney did
// put an age on the worked stone itself, and his claim is on the record because
// he made it — recorded with the dating method `claimant_inference`, conditional
// in its own wording ("if it was where the miners reported it"), and sitting
// beside a separate geological claim for the lava cap so a reader can see which
// of the two was measured. An inference from position is a real claim and is
// not a measurement, and the record has to say which it is.
//
// "FOUND ASSOCIATED WITH COAL" IS NOT "SCIENTIFICALLY DATED TO 300 MILLION
// YEARS". The whole of the popular literature on these objects is that
// substitution, performed once and then repeated. The coal really is that old.
// Whether the object was ever inside it is a question about provenance — about
// who saw what, when, and in what condition — and it is answered by testimony,
// not by measurement.
//
// SO PROVENANCE IS EVIDENCE HERE, AND IT IS RECORDED AS SUCH. Who found it.
// Who reported it. Whether anyone independent saw it in place. Whether the
// object still exists. For most of these the answers are: one person, a local
// paper, no, and no.
//
// ON MICHAEL CREMO. He appears on every one of these records and he discovered
// none of them. Forbidden Archeology is a compilation: it gathers nineteenth-
// and early twentieth-century reports and argues they were set aside for the
// wrong reasons. That makes Cremo a claimant about the HISTORY OF THE EVIDENCE
// rather than a discoverer, and every record here names the person who actually
// made the find and the publication that actually carried it. Treating him as
// the source would be both wrong and, in a small way, unfair to him: his own
// book is scrupulous about citing the originals.
//
// NO CONFIDENCE SCORES, and no verdict words either. "Hoax" is a claim about
// intent and almost none of these has the evidence to support one.
// =============================================================================

export const ANCIENT_SITES_ARTEFACTS_ANCHOR_SLUG = "dorchester-pot-reported";

export const ANCIENT_SITES_ARTEFACTS_TRACK: SeedTrack = {
  name: "Anomalous artefacts: objects said to have come out of old rock",
  slug: "ancient-sites-anomalous-artefacts",
  kind: "theme",
  color: "#6b5a48",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_ARTEFACTS_SOURCES: SeedSource[] = [
  {
    key: "sciam1852",
    title: "A relic of a by-gone age",
    workTitle: "Scientific American",
    reference: "Volume 7, 5 June 1852, page 298",
    sourceType: "newspaper",
    publishedYear: 1852,
    notes:
      "The original report of the Dorchester object, and the only contemporary account of it. Cited for what it " +
      "actually says — a blast, scattered rock, a vessel in two pieces — and not for anything it does not say, " +
      "which includes anybody watching the object come out of solid stone.",
  },
  {
    key: "morrisonville_times1891",
    title: "Report of a gold chain found in coal at Morrisonville",
    workTitle: "The Morrisonville Times",
    reference: "11 June 1891",
    sourceType: "newspaper",
    publishedYear: 1891,
    notes:
      "The original report, two days after the find. Cited for the description — about ten inches, eight " +
      "pennyweights, eight carat, lying in a circular hollow with both ends inside the lump — and for the " +
      "provenance, which is on the record because it is evidence: the paper's proprietor was the finder's husband, " +
      "and he was also the town's jeweller.",
  },
  {
    key: "geologist1862",
    title: "Report of human bones found on a coal bed in Macoupin County, Illinois",
    workTitle: "The Geologist",
    reference: "December 1862",
    sourceType: "newspaper",
    publishedYear: 1862,
    notes:
      "A short notice, and the whole of the primary evidence for this find. Cited for its own wording — bones on a " +
      "coal bed capped with two feet of slate, ninety feet down, coated in a black glossy crust — and because what " +
      "it does not contain is as important: no finder is named, no location within the county, and no account of " +
      "anybody examining the bones afterwards.",
  },
  {
    key: "whitney1880",
    title: "The auriferous gravels of the Sierra Nevada of California",
    author: "Josiah Dwight Whitney",
    workTitle: "Memoirs of the Museum of Comparative Zoology at Harvard College",
    reference: "Volume 6, number 1 (1880)",
    url: "https://www.biodiversitylibrary.org/item/91613",
    sourceType: "academic_book",
    publishedYear: 1880,
    notes:
      "Whitney was State Geologist of California and later a Harvard professor, and this is the work the Californian " +
      "finds come from — not a later compilation of it. Cited as the original claimant's own publication, which is " +
      "what this dataset requires of an alternative claim and what makes Whitney rather than anyone later the " +
      "person making it.",
  },
  {
    key: "holmes1891",
    title: "Antiquities from under Tuolumne Table Mountain in California",
    author: "William Henry Holmes",
    workTitle: "Bulletin of the Geological Society of America",
    reference: "Volume 2, number 1, page 189",
    sourceType: "academic_paper",
    publishedYear: 1891,
    notes:
      "Holmes' first published examination of the Table Mountain material, after going to California to look at it. " +
      "Cited for the investigation rather than for a verdict.",
  },
  {
    key: "holmes1899",
    title: "Review of the evidence relating to auriferous gravel man in California",
    author: "William Henry Holmes",
    workTitle: "Annual Report of the Smithsonian Institution for 1899",
    reference: "Pages 419–472, published 1901",
    sourceType: "academic_paper",
    publishedYear: 1899,
    notes:
      "The long assessment of the whole Californian case, by the Smithsonian's leading archaeologist. Its argument " +
      "is about provenance and about the objects themselves — that they resemble the work of recent Native " +
      "Californian peoples, and that mine workings are not sealed contexts — rather than about whether the gravels " +
      "are old.",
  },
  {
    key: "geolex_table_mountain",
    title: "Table Mountain Latite — Geologic Names Lexicon (Geolex)",
    workTitle: "National Geologic Map Database, United States Geological Survey",
    url: "https://ngmdb.usgs.gov/Geolex/Units/TableMountain_12039.html",
    sourceType: "government",
    notes:
      "The lexicon entry for the unit, giving its late Miocene age and its type section on Table Mountain west of " +
      "Shaws Flat in Tuolumne County. Cited for the age of the lava cap, which is the one measured quantity in the " +
      "whole Table Mountain argument and which neither Whitney nor Holmes disputed.",
  },
  {
    key: "cremo_thompson1993",
    title: "Forbidden Archeology: The Hidden History of the Human Race",
    author: "Michael A. Cremo and Richard L. Thompson",
    publisher: "Bhaktivedanta Institute, San Diego",
    reference: "1993; 914 pages; ISBN 0-9635309-8-4",
    sourceType: "book",
    publishedYear: 1993,
    notes:
      "The compilation that brought these nineteenth-century reports back into circulation, and the source of the " +
      "modern argument about them. Cited as the claimants' own book. It is a compilation and says so: the finds in " +
      "it were made by other people, and this dataset names those people on each record rather than attributing " +
      "the discoveries to Cremo.",
  },
  {
    key: "badarchaeology_ooparts",
    title: "Out-of-place artefacts — Bad Archaeology",
    author: "Keith Fitzpatrick-Matthews and James Doeser",
    url: "http://www.badarchaeology.com/out-of-place-artefacts/",
    sourceType: "modern_interpretation",
    notes:
      "Two archaeologists working through these reports one at a time. Cited for the provenance analysis — what " +
      "the original notices do and do not establish — which is the part of this argument that is actually " +
      "checkable, and which no measurement can supply.",
  },
  {
    key: "wikipedia_calaveras",
    title: "Calaveras Skull — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Calaveras_Skull",
    sourceType: "wikipedia",
    notes:
      "Overview of the most famous of the Californian finds and of how it came apart. Used for orientation only; " +
      "no date on any record rests on it.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_ARTEFACTS_EVENTS: SeedEvent[] = [
  // =========================================================================
  // DORCHESTER — a report, a rock, and no object claim.
  // =========================================================================
  {
    slug: ANCIENT_SITES_ARTEFACTS_ANCHOR_SLUG,
    title: "The Dorchester object is reported",
    summary:
      "A metal vessel found in blasting rubble in 1852, and a Precambrian conglomerate. Nobody has ever dated the vessel.",
    description:
      "In the spring of 1852, blasting at Meeting House Hill in Dorchester, Massachusetts, threw out rock in pieces weighing up to several tons. Among the rubble was a metal vessel in two parts, apparently broken by the explosion.\n\n" +
      "WHAT THE REPORT DESCRIBES. Scientific American carried it on 5 June 1852 under the title 'A Relic of a By-gone Age'. Reassembled, the vessel was bell-shaped: about 114 mm high, 165 mm across the base, 63.5 mm at the mouth, of a zinc-like metal, with a vine and six flowers inlaid in silver running round it. The rock at the site is Roxbury conglomerate — the local puddingstone — and Precambrian.\n\n" +
      "WHAT THE REPORT DOES NOT DESCRIBE, which is the whole of the matter. It does not describe anyone watching the object come out of solid rock. The vessel was found among rubble after the blast. Between 'this was in the debris' and 'this was inside the conglomerate' there is an inference, and the inference is the claim.\n\n" +
      "PROVENANCE: NOBODY IS NAMED. The notice names no finder. It does not say who picked the vessel up, or who was standing there when the charge went off, and no independent examination of the find spot is recorded by anyone. So there is no witness to question and never was one — which matters more than it might seem, because every later retelling of this find is a retelling of an anonymous paragraph.\n\n" +
      "THE OBJECT'S OWN STYLE IS EVIDENCE TOO. Inlaid silver floral work on a zinc-alloy vessel is a recognisable nineteenth-century manner. It is possible for an object to look like its own century and not be of it; it is not usual, and a reader weighing this should know that the style points where the provenance already points.\n\n" +
      "THE VESSEL NO LONGER EXISTS AS FAR AS ANYONE CAN TELL. There is no known photograph and no known location. So the object cannot now be examined, dated, or compared with anything — which means this record can never be more than it is: a report, a rock, and the gap between them.",
    category: "archaeology",
    subcategory: "Anomalous finds",
    eventType: "disputed",
    eventTypeNote:
      "The report is real and its date is certain. What is disputed is whether the object was ever in the rock — a question of provenance, which no dating method can answer.",
    tags: ["dorchester-pot", "massachusetts", "ooparts", "provenance", "cremo", "ancient-sites"],
    people: ["Michael A. Cremo", "Richard L. Thompson"],
    locationName: "Meeting House Hill, Dorchester, Massachusetts",
    lat: 42.3126,
    lng: -71.0662,
    claims: [
      {
        sourceKey: "sciam1852",
        startYear: 1852,
        startMonth: 6,
        startDay: 5,
        datePrecision: "day",
        isApproximate: false,
        originalDateText: "Scientific American, 5 June 1852 — 'A Relic of a By-gone Age'",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The publication of the report, which is the firmly dated thing here",
        evidence:
          "WHAT IS DATED: the appearance of the notice in Scientific American. DATING METHOD: the historical record " +
          "— a dated issue of a periodical. WHAT IT ESTABLISHES: that an object of this description was reported " +
          "found in blasting rubble at Dorchester in the spring of 1852. WHAT IT DOES NOT ESTABLISH: that the " +
          "object came out of the rock. The notice describes a find in debris after a blast, which is a different " +
          "thing from a find in place, and no independent examination of the find spot is recorded.",
        notes:
          "The date of a report is worth having on a timeline in its own right. It is the one thing about this " +
          "find that is not in question, and putting it beside the age of the conglomerate is the quickest way to " +
          "see that the two are not the same claim.",
        citations: [
          {
            sourceKey: "badarchaeology_ooparts",
            relation: "context",
            note:
              "The provenance analysis: found among rubble with nothing establishing it was ever inside the rock, " +
              "and of an obviously nineteenth-century style.",
          },
          {
            sourceKey: "cremo_thompson1993",
            relation: "context",
            note: "The compilation that returned this report to circulation, citing the 1852 original.",
          },
        ],
      },
      {
        sourceKey: "badarchaeology_ooparts",
        startYear: -600000000,
        datePrecision: "million_years",
        isApproximate: true,
        originalDateText: "Roxbury conglomerate, of Precambrian date",
        datingMethod: "geological",
        chronology: "geological",
        whatIsDated: "The Roxbury conglomerate at the blasting site",
        evidence:
          "WHAT IS DATED: the rock formation at Meeting House Hill. DATING METHOD: the geological record. WHAT IT " +
          "ESTABLISHES: that the conglomerate is Precambrian. WHAT IT DOES NOT ESTABLISH, AND THIS IS THE RECORD: " +
          "anything at all about the vessel. A Precambrian formation is Precambrian whether or not a Victorian " +
          "candlestick was lying on top of the rubble blasted out of it. The age of the rock cannot distinguish " +
          "between an object that was inside it and an object that was near it, so it is not evidence either way.",
        notes:
          "Stored at the round order of magnitude and marked approximate, because 'Precambrian' is an era rather " +
          "than a date and the sources consulted give no closer figure for this formation. NEEDS SOURCE " +
          "VERIFICATION for a specific age.\n\n" +
          "NO CLAIM DATING THE VESSEL IS SEEDED ON THIS RECORD. Nobody has dated it, the object cannot now be " +
          "found, and an empty space is the accurate representation of that.",
      },
    ],
  },

  // =========================================================================
  // MORRISONVILLE — where the provenance is the story.
  // =========================================================================
  {
    slug: "morrisonville-gold-chain-reported",
    title: "The Morrisonville gold chain is reported",
    summary:
      "A gold chain said to have been found inside a lump of coal in 1891 — reported by a newspaper whose proprietor was the finder's husband, and the town jeweller.",
    description:
      "On 9 June 1891 at Morrisonville, Illinois, Nina Maxon Culp broke a lump of coal and found a small gold chain apparently embedded in it. The Morrisonville Times carried the report two days later.\n\n" +
      "WHAT WAS DESCRIBED. About ten inches long, eight pennyweights in weight — a little over twelve grams — and assessed at eight carat. It lay in a circular hollow in the coal with both ends close together and inside the lump. The report called the workmanship antique and quaint. The coal was believed to have come from the Taylorville or Pana mines.\n\n" +
      "THE PROVENANCE, WHICH IS EVIDENCE AND IS RECORDED AS SUCH. Silas W. Culp — the finder's husband — had been proprietor of The Morrisonville Times since 1887, and the town's jeweller since 1889. So the paper that reported the find was the finder's family paper, and the person best placed to assess a gold chain was the finder's husband.\n\n" +
      "THAT IS NOT AN ACCUSATION AND IS NOT WRITTEN AS ONE. It is a statement about how much independent verification exists, which is the question a reader needs answered. The answer is: none recorded. There is no known photograph of the chain and its present whereabouts are unknown.\n\n" +
      "THE COAL IS GENUINELY OLD. Illinois coal of this kind is Pennsylvanian, in the region of three hundred million years. That figure is not in dispute and it is not evidence about the chain — which is the same point this whole tranche keeps making, because it is the same substitution being performed each time.",
    category: "archaeology",
    subcategory: "Anomalous finds",
    eventType: "disputed",
    eventTypeNote:
      "A dated report with no independent verification, about an object that no longer exists. The disagreement is about provenance rather than about the age of the coal.",
    tags: ["morrisonville", "illinois", "coal", "ooparts", "provenance", "cremo", "ancient-sites"],
    people: ["Nina Maxon Culp", "Silas W. Culp", "Michael A. Cremo"],
    locationName: "Morrisonville, Christian County, Illinois",
    lat: 39.4192,
    lng: -89.4562,
    claims: [
      {
        sourceKey: "morrisonville_times1891",
        startYear: 1891,
        startMonth: 6,
        startDay: 11,
        datePrecision: "day",
        isApproximate: false,
        originalDateText: "The Morrisonville Times, 11 June 1891, reporting a find of 9 June",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The publication of the report, two days after the find",
        evidence:
          "WHAT IS DATED: the notice in the local paper. DATING METHOD: the historical record. WHAT IT " +
          "ESTABLISHES: that the find was reported, promptly, with a specific description — ten inches, eight " +
          "pennyweights, eight carat, in a circular hollow with both ends inside the lump. WHAT IT DOES NOT " +
          "ESTABLISH: that the chain was in the coal. PROVENANCE, WHICH BEARS ON THAT DIRECTLY: the finder was " +
          "Nina Maxon Culp; her husband Silas owned the paper that reported it and was the town's jeweller. No " +
          "independent examination is recorded, no photograph is known, and the object's whereabouts are unknown.",
        notes:
          "The provenance is stated as fact and not as an allegation. A find reported by the finder's family paper " +
          "and assessed by the finder's husband is not thereby false; it is unverified, and the difference matters " +
          "enough to be written down.",
        citations: [
          {
            sourceKey: "badarchaeology_ooparts",
            relation: "context",
            note: "The provenance analysis, including the Culps' position in the town.",
          },
          { sourceKey: "cremo_thompson1993", relation: "context", note: "The compilation that carries this report today." },
        ],
      },
      {
        sourceKey: "badarchaeology_ooparts",
        startYear: -300000000,
        datePrecision: "million_years",
        isApproximate: true,
        originalDateText: "Illinois coal of Pennsylvanian age",
        datingMethod: "geological",
        chronology: "geological",
        whatIsDated: "The coal seam the lump is believed to have come from",
        evidence:
          "WHAT IS DATED: the coal measures of central Illinois. DATING METHOD: the geological record. WHAT IT " +
          "ESTABLISHES: that the coal is Pennsylvanian, around three hundred million years old. WHAT IT DOES NOT " +
          "ESTABLISH: anything about the chain. NOTE ALSO that the lump's own source is reported as a belief — the " +
          "Taylorville or Pana mines — rather than as a known fact, so even the association between this chain and " +
          "this coalfield rests on what somebody assumed about a domestic delivery.",
        notes:
          "NO CLAIM DATING THE CHAIN IS SEEDED. It has never been dated, it cannot now be found, and '300 million " +
          "year old gold chain' is this measurement wearing the wrong label.",
      },
    ],
  },

  // =========================================================================
  // MACOUPIN — a notice with no finder, no place, and no follow-up.
  // =========================================================================
  {
    slug: "macoupin-county-bones-reported",
    title: "Human bones on a coal bed are reported in Macoupin County",
    summary:
      "Eight lines in an 1862 journal, naming no finder and no location within the county — and a coal seam some three hundred million years old.",
    description:
      "In December 1862 a short notice appeared in The Geologist. It said that in Macoupin County, Illinois, the bones of a man had recently been found on a coal bed capped with two feet of slate rock, ninety feet below the surface, and that the bones were covered with a hard glossy black crust which scraped away to leave them white.\n\n" +
      "THAT NOTICE IS THE ENTIRE PRIMARY EVIDENCE. There is no named finder. There is no location within the county. There is no account of anyone examining the bones afterwards, no record of where they went, and no indication that any geologist or anatomist saw them. What exists is a paragraph.\n\n" +
      "SO THE QUESTION HERE IS PROVENANCE, as it is on every record in this group, and here there is almost nothing to examine. Provenance means the chain of custody of a find: who lifted it, from exactly where, with whom watching, and where it went afterwards. For this find every link in that chain is missing, and no amount of certainty about the age of the coal supplies any of them.\n\n" +
      "WHY THAT MATTERS MORE HERE THAN ANYWHERE ELSE IN THIS TRANCHE. The Dorchester object and the Morrisonville chain were at least described in detail by people who had them in their hands. This is a second-hand notice of a find nobody is named as having made. A reader can weigh a description; there is very little here to weigh.\n\n" +
      "THE COAL IS OLD AND THAT IS NOT THE QUESTION. Illinois coal of this kind runs from roughly 286 to 320 million years. Nothing about that figure is contested, and nothing about it bears on whether a human skeleton was ever lying on it — a question which, in the absence of the bones, of a finder, and of a location, cannot now be investigated at all.\n\n" +
      "IT IS ON THE TIMELINE ANYWAY, because the alternative is that a reader who has encountered the claim finds nothing here and concludes the record is hiding it. What they find instead is exactly how much there is.",
    category: "archaeology",
    subcategory: "Anomalous finds",
    eventType: "disputed",
    eventTypeNote:
      "A report with no named finder, no precise location and no follow-up. Recorded as what it is — a notice — rather than as a find.",
    tags: ["macoupin", "illinois", "coal", "ooparts", "provenance", "cremo", "ancient-sites"],
    people: ["Michael A. Cremo", "Richard L. Thompson"],
    locationName: "Macoupin County, Illinois",
    lat: 39.26,
    lng: -89.93,
    claims: [
      {
        sourceKey: "geologist1862",
        startYear: 1862,
        startMonth: 12,
        datePrecision: "month",
        isApproximate: false,
        originalDateText: "The Geologist, December 1862",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The publication of the notice, which is all the primary evidence there is",
        evidence:
          "WHAT IS DATED: the appearance of a short notice in a journal. DATING METHOD: the historical record. " +
          "WHAT IT ESTABLISHES: that such a report was published, and its wording — bones on a coal bed under two " +
          "feet of slate, ninety feet down, in a black glossy crust. WHAT IT DOES NOT ESTABLISH: that the find " +
          "happened as described, or at all. No finder is named, no location within the county is given, no later " +
          "examination is recorded, and the bones have never been traced.",
        notes:
          "This claim dates a paragraph. That is not a criticism of the record; it is the record. Where an " +
          "anomalous find has only a notice behind it, the honest thing a timeline can do is date the notice and " +
          "say so.",
        citations: [
          {
            sourceKey: "cremo_thompson1993",
            relation: "context",
            note: "Discussed in Forbidden Archeology, which cites the 1862 original rather than claiming the find.",
          },
        ],
      },
      {
        sourceKey: "cremo_thompson1993",
        startYear: -320000000,
        endYear: -286000000,
        datePrecision: "million_years",
        isApproximate: true,
        originalDateText: "coal at least 286 million years old and possibly as much as 320 million",
        datingMethod: "geological",
        chronology: "geological",
        whatIsDated: "The coal seam described in the notice",
        evidence:
          "WHAT IS DATED: the Illinois coal measures. DATING METHOD: the geological record. WHAT IT ESTABLISHES: " +
          "the age of the coal. WHAT IT DOES NOT ESTABLISH: that anything human was ever on it. With no bones, no " +
          "finder and no location, there is nothing left to examine — so this is a case where the question cannot " +
          "be reopened by better evidence, because no evidence survives to re-examine.",
        notes:
          "The range is quoted as the compilation states it. NO CLAIM DATING THE BONES IS SEEDED, for the reason " +
          "that runs through this whole tranche: the coal has been dated and the bones have not.",
      },
    ],
  },

  // =========================================================================
  // TABLE MOUNTAIN — the one with a real geologist on each side.
  // =========================================================================
  {
    slug: "table-mountain-auriferous-gravels",
    title: "Whitney's finds under Tuolumne Table Mountain",
    summary:
      "Mortars and other worked stone reported from gold-bearing gravels beneath a lava cap — argued between two of the most senior American scientists of their day.",
    description:
      "Through the 1860s and 1870s, miners tunnelling for gold under Table Mountain in Tuolumne County, California, reported finding stone mortars, pestles and other worked objects in the auriferous gravels. Josiah Dwight Whitney — State Geologist of California, later a Harvard professor — collected the reports and published them in 1880.\n\n" +
      "THIS IS THE STRONGEST OF THE ANOMALOUS-ARTEFACT CASES, AND THE REASON IS THE OBJECTS. A Victorian vase in blasting rubble invites a simple explanation. A stone mortar fifteen inches across, reported by Albert G. Walton from the Valentine claim at a hundred and eighty feet below the surface and beneath the lava cap, does not: mortars of that kind are unambiguously made by people, and nobody argues otherwise. The argument is entirely about where they were.\n\n" +
      "WHY THE LAVA CAP MATTERS. The Table Mountain Latite is a late Miocene lava flow, erupted about ten million years ago. Gravels genuinely sealed beneath it would be older than that, and the gold-bearing channel gravels of the region are mostly Eocene and Early Oligocene. So an object demonstrably in place under the cap would be extraordinarily old, and Whitney's claim was exactly that.\n\n" +
      "HOLMES' OBJECTION, WHICH IS ABOUT MINES RATHER THAN ABOUT GEOLOGY. William Henry Holmes of the Smithsonian went to California to look. He published on the Table Mountain material in 1891 and reviewed the whole Californian case in the Smithsonian's report for 1899. His argument: a gold mine is not a sealed context. Tunnels, shafts and washing move material; objects enter workings from above and from the surface; and what miners describe as 'in the gravel' is often material recovered from a working face after it has been disturbed. He also pointed out that the objects resemble the work of recent Native Californian peoples — which is what one would expect if they were recent and not what one would expect of an assemblage tens of millions of years old, in which nothing else about the toolkit had changed.\n\n" +
      "THE CALAVERAS SKULL SITS BEHIND ALL OF THIS. The most famous of the Californian finds, produced in 1866 and championed by Whitney, came apart under Holmes' examination: the material encrusting it included a modern snail and a shell bead like those made by Native Californians. That one find's collapse does not settle the mortars, and this record does not treat it as though it did — but it is why the whole body of Californian material is read the way it is.\n\n" +
      "NEITHER MAN WAS A CRANK. Whitney and Holmes were both at the top of American science. This is what a nineteenth-century scientific dispute looks like from inside, and it is on this timeline as one rather than as a curiosity.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "A dispute between two senior scientists about provenance in mine workings — not about whether the objects are artefacts, which neither doubted, and not about the age of the gravels.",
    tags: ["table-mountain", "california", "auriferous-gravels", "whitney", "holmes", "ooparts", "ancient-sites"],
    people: ["Josiah Dwight Whitney", "William Henry Holmes", "Albert G. Walton", "Michael A. Cremo"],
    locationName: "Table Mountain, Tuolumne County, California",
    lat: 37.9628,
    lng: -120.4547,
    claims: [
      {
        sourceKey: "whitney1880",
        startYear: 1880,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Whitney's Auriferous Gravels, published 1880",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The publication that collected and argued the Californian finds",
        evidence:
          "WHAT IS DATED: Whitney's memoir. DATING METHOD: the historical record. WHAT IT ESTABLISHES: that a State " +
          "Geologist published a sustained case for very ancient human presence in California, from miners' " +
          "reports he gathered. WHAT IT DOES NOT ESTABLISH: the finds themselves. Whitney was not present at the " +
          "discoveries; his evidence is testimony from miners, and its strength is the strength of that testimony.",
        notes:
          "This record exists to name Whitney as the claimant. The Californian finds are usually met today inside " +
          "a twentieth-century compilation, and the compilation is not the claim — the 1880 memoir is.",
      },
      {
        sourceKey: "geolex_table_mountain",
        startYear: -10400000,
        datePrecision: "million_years",
        isApproximate: true,
        originalDateText: "Table Mountain Latite, late Miocene — the flow is given as 10.4 million years",
        datingMethod: "geological",
        chronology: "geological",
        whatIsDated: "The lava cap above the gold-bearing gravels",
        evidence:
          "WHAT IS DATED: the Table Mountain Latite — the lava flow that forms the cap, filling what was the " +
          "palaeocanyon of the Stanislaus River. DATING METHOD: the geological record; a late Miocene unit, the " +
          "flow given as 10.4 million years. WHAT IT ESTABLISHES: the age of the rock above. WHAT IT DOES NOT " +
          "ESTABLISH: that any particular object was beneath it. THIS IS THE MEASURED QUANTITY IN THE WHOLE " +
          "ARGUMENT, and it is the part nobody disputes — Whitney and Holmes agreed about the lava and disagreed " +
          "about the mine. Separating the two is the only way to see that.",
        notes:
          "Kept as a claim of its own rather than folded into Whitney's inference below, so the detail view shows " +
          "the two side by side under different headings: one dates a lava flow, the other dates a mortar on the " +
          "strength of where miners said it was. They are not the same kind of statement and they should not read " +
          "as though they were.",
      },
      {
        sourceKey: "whitney1880",
        startYear: -10000000,
        datePrecision: "million_years",
        isApproximate: true,
        originalDateText:
          "a stone mortar fifteen inches across, in gold-bearing gravel a hundred and eighty feet down and beneath the latite cap",
        datingMethod: "claimant_inference",
        chronology: "alternative",
        whatIsDated: "The worked stone, if it was where the miners reported it",
        evidence:
          "WHAT IS DATED: nothing directly. The date comes from the position: gravel sealed beneath the Table " +
          "Mountain Latite, a late Miocene flow of about ten million years, with the underlying channel gravels " +
          "mostly Eocene and Early Oligocene. DATING METHOD: an inference from stratigraphic position, so it is " +
          "recorded as the claimant's inference rather than as a measurement of an object. WHO REPORTED THE FIND: " +
          "Albert G. Walton, part-owner of the Valentine claim, at a hundred and eighty feet. WHO MAKES THE CLAIM: " +
          "Whitney, in 1880. WHAT IT ESTABLISHES IF THE POSITION HOLDS: an object in place under a ten-million-" +
          "year-old cap. WHAT IT DOES NOT ESTABLISH: that the position holds. That is the disputed part and it is " +
          "a question about mine workings, not about lava.",
        notes:
          "Stored at ten million years — the age of the cap — rather than at any larger figure, because the cap is " +
          "the constraint the argument actually rests on. Later literature quotes tens of millions on the basis of " +
          "the Eocene gravels beneath, and that is a different and weaker claim about which gravel a given object " +
          "came from.\n\n" +
          "THE OBJECTS ARE NOT IN DOUBT. A fifteen-inch stone mortar is a made thing and Holmes did not argue " +
          "otherwise. Everything here turns on provenance.",
        citations: [
          {
            sourceKey: "geolex_table_mountain",
            relation: "context",
            note:
              "The age of the cap, which is where this figure comes from. It is a measurement of a lava flow and " +
              "not of anything underneath it.",
          },
          {
            sourceKey: "holmes1891",
            relation: "disputes",
            note: "Holmes' examination of the Table Mountain material after going to California to see it.",
          },
          {
            sourceKey: "holmes1899",
            relation: "disputes",
            note:
              "The full review: a mine is not a sealed context, and the objects resemble the work of recent Native " +
              "Californian peoples.",
          },
          {
            sourceKey: "wikipedia_calaveras",
            relation: "context",
            note:
              "The Calaveras skull, the most famous of these finds, and how its associated material came apart " +
              "under examination.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // THE COMPILATION ITSELF — a claimant profile with a date.
  // =========================================================================
  {
    slug: "forbidden-archeology-published",
    title: "Forbidden Archeology is published",
    summary:
      "A 914-page compilation of nineteenth-century anomaly reports, and an argument about why they were set aside — which is a claim about the history of a discipline rather than about any object.",
    description:
      "Michael A. Cremo and Richard L. Thompson published Forbidden Archeology in 1993, through the Bhaktivedanta Institute in San Diego. It runs to 914 pages and gathers a very large number of nineteenth- and early twentieth-century reports of human remains and artefacts in unexpectedly old deposits.\n\n" +
      "WHAT KIND OF CLAIM IT ACTUALLY MAKES. Not that any one object has been dated. Its argument is historiographic: that a body of reported evidence for far greater human antiquity was set aside during the twentieth century by a process the authors call a knowledge filter, and that the setting-aside was driven by expectation rather than by examination of each case.\n\n" +
      "THAT IS A CLAIM ABOUT THE HISTORY OF A DISCIPLINE, and it is worth stating precisely because it is a different claim from the ones on the records this dataset links to. A reader can agree that some nineteenth-century reports were dismissed too briskly and still find that the Dorchester object was in blasting rubble and the Morrisonville chain was reported by the finder's husband's newspaper.\n\n" +
      "CREMO IS NOT THE DISCOVERER OF ANY OF IT, and the book does not say he is. Every find in it belongs to somebody else — Whitney, Walton, the Culps, an unnamed correspondent in Macoupin County. This timeline names those people on their own records, which is both more accurate and more useful: it puts each claim next to the person who could actually have been mistaken about it.\n\n" +
      "THE AUTHORS ARE WHAT THEY ARE AND THE RECORD SAYS SO. Cremo is a writer and researcher associated with the Bhaktivedanta Institute; Richard L. Thompson was a mathematician with a doctorate from Cornell. Neither was an archaeologist. That is a fact about their training and is not, on its own, an argument about whether their historiographic case holds.",
    category: "culture",
    subcategory: "History of an idea",
    eventType: "historical",
    eventTypeNote:
      "The publication of a book, which is a dated event. The claims inside it are on the records of the finds it discusses.",
    tags: ["cremo", "forbidden-archeology", "history-of-an-idea", "ooparts", "ancient-sites"],
    people: ["Michael A. Cremo", "Richard L. Thompson"],
    locationName: "San Diego, California",
    lat: 32.7157,
    lng: -117.1611,
    claims: [
      {
        sourceKey: "cremo_thompson1993",
        startYear: 1993,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Forbidden Archeology, Bhaktivedanta Institute, San Diego, 1993",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The publication of the compilation",
        evidence:
          "WHAT IS DATED: the book's appearance. DATING METHOD: the historical record — a published edition, 914 " +
          "pages, ISBN 0-9635309-8-4. WHAT IT ESTABLISHES: when this argument entered wide circulation. WHAT IT " +
          "DOES NOT ESTABLISH: anything about any of the finds it discusses. A compilation is a claim about how " +
          "evidence has been treated, and the evidence itself has to be weighed one case at a time — which is why " +
          "each case on this timeline is its own record with its own original source.",
        notes:
          "Filed under the history of an idea rather than under archaeology, because that is the kind of claim it " +
          "makes. The book is cited as context on each of the find records rather than as their source, since the " +
          "source of each find is the nineteenth-century notice the book itself points at.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_ARTEFACTS_LINKS: SeedEventLink[] = [
  {
    from: "forbidden-archeology-published",
    to: ANCIENT_SITES_ARTEFACTS_ANCHOR_SLUG,
    relation: "related",
    note:
      "The compilation and one of the reports it compiles. Kept as separate records so the 1852 notice stays the " +
      "source of the Dorchester claim and the 1993 book stays the source of the argument about how such notices " +
      "were treated.",
  },
  {
    from: "forbidden-archeology-published",
    to: "table-mountain-auriferous-gravels",
    relation: "related",
    note:
      "The Californian finds reach most readers today through this book. The claim itself is Whitney's, published " +
      "in 1880, and belongs to him.",
  },
  {
    from: ANCIENT_SITES_ARTEFACTS_ANCHOR_SLUG,
    to: "morrisonville-gold-chain-reported",
    relation: "relevant",
    note:
      "The same structure twice: a dated report, an undisputed geological age for the host material, no date for " +
      "the object, and an object that can no longer be found.",
  },
  {
    from: "table-mountain-auriferous-gravels",
    to: "macoupin-county-bones-reported",
    relation: "relevant",
    note:
      "The two ends of the range. Table Mountain has named finders, unambiguous artefacts and two senior " +
      "scientists arguing in print; Macoupin County has eight lines and nobody's name on them.",
  },
];
