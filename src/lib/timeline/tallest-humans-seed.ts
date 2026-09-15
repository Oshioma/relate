// THE TALLEST HUMANS IN THE EVIDENCE RECORD.
//
// WHAT THIS DATASET IS FOR. Not a list of giants. A worked demonstration that
// "how tall was he?" is four or five different questions wearing one coat, and
// that the answers rest on wildly different kinds of evidence — a physician
// with a stadiometer, a poster outside a tent, an articulated skeleton with an
// accession number, a coffin plate, a newspaper.
//
// THE RULE THIS FILE EXISTS TO ENFORCE. A person has no height. Heights live on
// measurement claims, exactly as dates live on date claims, because Charles
// Byrne was advertised at eight feet four and his skeleton measures about seven
// feet seven and BOTH of those are real statements that a reader should be able
// to see side by side. Storing one number would be this timeline's founding
// mistake committed in a new place.
//
// THE RULE ABOUT PICTURES. A photograph of a living man, a photograph of his
// skeleton, an 1842 drawing of the museum that held it and a bronze statue
// outside a shop are four different kinds of evidence. Every picture here
// declares which it is, whether it shows actual remains, and whether anything
// other than its caption establishes whose remains they are.
//
// IMAGE RESOLUTION, AND AN HONEST TRADE. The brief asked for original-resolution
// files. Special:FilePath without a width parameter returns the original — for
// Byrne that is 2165x5312, for Sandy Allen 3644x5229. Serving those into a
// gallery is hostile to anybody on a phone, so the declared URL carries a
// display width and `sourcePageUrl` points at the file page, which is where the
// original, the licence and the creator all live. Nothing is lost; it is one
// click further away, and the click is recorded.

import type { SeedEvent, SeedSource, SeedTrack } from "./seed-types";

export const TALLEST_HUMANS_ANCHOR_SLUG = "robert-wadlow";

export const TALLEST_HUMANS_TRACK: SeedTrack = {
  name: "Tallest humans: what the evidence actually is",
  slug: "tallest-humans",
  kind: "theme",
  color: "#6b5b95",
};

const commons = (file: string, width = 1024) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;
const commonsPage = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const TALLEST_HUMANS_SOURCES: SeedSource[] = [
  {
    key: "rcs_surgicat_byrne",
    title: "Articulated skeleton of Charles Byrne",
    workTitle: "SurgiCat, Royal College of Surgeons of England",
    reference: "Object number RCSHC/Osteo. 223; Hunterian Collection",
    url: "https://surgicat.rcseng.ac.uk/Details/collect/4123",
    sourceType: "museum_record",
    notes:
      "THE STRONGEST SINGLE PIECE OF EVIDENCE IN THIS DATASET. A catalogue record with an accession number, which " +
      "is what makes a claim about remains checkable by somebody who was not there. Cited for the existence, " +
      "identity and custody of the skeleton — NOT for Byrne's height in life, which the bones cannot give. " +
      "NEEDS SOURCE VERIFICATION for the catalogue's own measurement figure, which has not been read here.",
  },
  {
    key: "rcs_byrne_statement",
    title: "Statement on the skeleton of Charles Byrne",
    publisher: "Royal College of Surgeons of England",
    url: "https://www.rcseng.ac.uk/news-and-events/news/archive/statement-on-the-skeleton-of-charles-byrne/",
    sourceType: "institutional_statement",
    notes:
      "The College's own position: the skeleton is retained and is no longer on public display. Cited for custody " +
      "and display status, which are facts about an institution's decision and not about Byrne. The ethics of " +
      "retention are genuinely contested — Byrne asked to be buried at sea — and this record does not settle that " +
      "argument, it records that it exists.",
  },
  {
    key: "wellcome_duncan_1900",
    title: "Drawing of the Royal College of Surgeons collection",
    author: "J. A. Duncan",
    workTitle: "Wellcome Collection",
    reference: "1900; catalogued under 'Variation in stature'",
    url: "https://wellcomecollection.org/works/g6rakg97",
    sourceType: "archive_item",
    notes:
      "A DRAWING, dated 1900, showing an exceptionally tall skeleton beside a short one under the heading " +
      "'Variation in stature'. Cited as evidence of how the collection was DISPLAYED AND UNDERSTOOD in 1900. " +
      "NOT a photograph, and not evidence of a measurement: the tall skeleton is presumed to be Byrne and the " +
      "presumption is the cataloguer's.",
  },
  {
    key: "loc_sandy_allen",
    title: "World's tallest woman, Sandy Allen, Boardwalk",
    workTitle: "Library of Congress, Prints and Photographs Division",
    reference: "Digital ID mrg.10218; photographed 1978, Wildwood, New Jersey",
    url: "https://www.loc.gov/pictures/",
    sourceType: "archive_item",
    notes:
      "A dated, located, institutionally held photograph of a living person. Cited for the photograph. NEEDS " +
      "SOURCE VERIFICATION for the Library's own catalogue record, which should replace this entry as the " +
      "primary institutional source once read.",
  },
  {
    key: "commons_provenance",
    title: "Wikimedia Commons file pages",
    url: "https://commons.wikimedia.org/",
    sourceType: "website",
    notes:
      "Cited for image provenance only — creator, date, institution and licence as the file page states them. " +
      "A Commons file page is a good record of a picture and is NOT an authority for a measurement. Where a file " +
      "description repeats an advertised height, that height is recorded here as an advertised height, with the " +
      "poster and not the uploader as its claimant.",
  },
];

export const TALLEST_HUMANS_EVENTS: SeedEvent[] = [
  {
    slug: "robert-wadlow",
    title: "Robert Pershing Wadlow",
    summary:
      "1918-1940. 272 cm. The tallest human being for whom the medical documentation is strong enough that the figure is not really in dispute.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person, with measurements attached as claims.\n\n" +
      "WHY HE IS THE ANCHOR OF THIS DATASET. Not because he was the tallest — because he is the tallest for whom " +
      "the evidence is of a kind that can be checked. He was measured repeatedly, over years, by physicians, " +
      "with the records surviving; he was photographed constantly beside people of ordinary height; and the " +
      "final figure was taken shortly before his death. Almost every other name in this dataset is a poster, a " +
      "newspaper, or a bone.\n\n" +
      "THE CONDITION. Pituitary hyperplasia producing excess growth hormone from childhood. He was still growing " +
      "when he died at twenty-two, of an infection from a brace worn on his ankle — which is why 272 cm is a " +
      "final measurement and not a ceiling.\n\n" +
      "WHAT THE PHOTOGRAPHS DO AND DO NOT SHOW. The one seeded here is the most useful kind: Wadlow at nine, " +
      "beside a neighbour of ten, in a studio in Alton in January 1928. Two children, one frame, one lens. " +
      "That is a scale comparison a reader can reason about, in a way a solo portrait never is.\n\n" +
      "A WARNING ABOUT THE STATUE. There is a life-size bronze of Wadlow in Alton, and photographs of it " +
      "circulate as photographs of him. It is a sculptor's reading of measurements. If it appears in this " +
      "record it appears tagged as a replica, and it is not evidence of anything except what a sculptor was " +
      "told.\n\n" +
      "THINGS TO ASK: Why is a photograph of two children more useful than a measurement in a newspaper? What " +
      "would it take to measure somebody this tall accurately, and what goes wrong if it is done casually?",
    category: "biography",
    subcategory: "Documented stature",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["tallest-humans", "gigantism", "wadlow", "medical-record", "photographed"],
    people: ["Robert Pershing Wadlow"],
    locationName: "Alton, Illinois, United States",
    claims: [
      {
        sourceKey: null,
        startYear: 1918,
        endYear: 1940,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "His life",
        originalDateText: "22 February 1918 - 15 July 1940",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: birth and death, from ordinary civil and press records. WHY IT MATTERS HERE: he died " +
          "at twenty-two and was still growing, so his final height is a measurement taken at a moment, not a " +
          "adult ceiling.",
        notes: "NEEDS SOURCE VERIFICATION against a primary civil record rather than secondary accounts.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Standing height, measured shortly before his death",
        valueCm: 272,
        originalValueText: "8 ft 11.1 in (2.72 m)",
        measurementKind: "standing_height_living",
        measurementMethod: "medical_examination",
        evidenceStatus: "strongly_documented",
        directlyMeasured: true,
        measuredOn: "1940-06-27",
        evidence:
          "WHAT IS CLAIMED: 272 cm, measured in June 1940, weeks before his death. WHY THIS FIGURE IS UNUSUALLY " +
          "SECURE: it is one of a long series taken by physicians who had measured him repeatedly since " +
          "childhood, rather than a single occasion with an interested party holding the tape. WHAT IT DOES NOT " +
          "ESTABLISH: any ceiling. He was twenty-two and still growing.",
        notes:
          "NEEDS SOURCE VERIFICATION for the exact date and the measuring physicians, which are given here from " +
          "general knowledge and should be replaced by the medical record or the records-body citation.",
      },
    ],
    media: [
      {
        url: commons("Robert_Wadlow,_aged_9,_with_neighbor_Ray_Carter,_aged_10,_circa_January_1928,_at_Kopp_Studio_in_Alton.jpg"),
        sourcePageUrl: commonsPage("Robert_Wadlow,_aged_9,_with_neighbor_Ray_Carter,_aged_10,_circa_January_1928,_at_Kopp_Studio_in_Alton.jpg"),
        caption:
          "Robert Wadlow, aged 9, with his neighbour Ray Carter, aged 10, at the Kopp photography studio in Alton, Illinois, about January 1928. Two children of the same age in one frame: the comparison is the evidence.",
        kind: "image",
        shows: "evidence_photograph",
        institution: "Kopp Photography Studio, Alton, Illinois",
        imageDate: "circa January 1928",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "charles-byrne-skeleton",
    title: "Charles Byrne, and the skeleton that outlived him",
    summary:
      "1761-1783. Advertised at eight feet and more; his articulated skeleton, held with an accession number since the 1780s, measures about 231 cm.",
    description:
      "WHAT KIND OF RECORD IS THIS? The best physical evidence in this dataset, and the sharpest example of why " +
      "one number will not do.\n\n" +
      "WHY THE FIGURES DIFFER, AND NEITHER IS A LIE. Byrne was exhibited in London in the 1780s with advertised " +
      "heights running to eight feet and beyond. His skeleton, articulated and held by the Royal College of " +
      "Surgeons as RCSHC/Osteo. 223, measures a good deal less. Three things account for most of the gap and " +
      "only one of them is dishonesty. A mounted skeleton is SHORTER THAN THE LIVING BODY by several " +
      "centimetres, because cartilage, intervertebral discs and soft tissue are gone. How a mount is assembled " +
      "changes the answer again. And showmen inflated heights, routinely, by inches and sometimes by a foot. A " +
      "reader who knows only the skeleton figure will conclude he was never as tall as claimed; a reader who " +
      "knows only the advertisement will conclude the museum is hiding something. Both are wrong in the same way.\n\n" +
      "WHAT THE ACCESSION NUMBER BUYS. It is the difference between this record and almost every 'giant " +
      "skeleton' on the internet. The remains exist, are held somewhere nameable, have an unbroken " +
      "institutional history, and can be re-examined. That is not a stronger opinion; it is a different " +
      "category of evidence.\n\n" +
      "THE PART THAT IS NOT ABOUT MEASUREMENT. Byrne is reported to have asked to be buried at sea, " +
      "specifically to keep his body from the anatomists, and John Hunter obtained it anyway. The College " +
      "announced in 2023 that the skeleton is retained but no longer publicly displayed. Whether it should be " +
      "held at all is a live argument with serious people on both sides, and this record does not settle it. " +
      "It records that the argument exists and that it is about consent, not about centimetres.\n\n" +
      "THINGS TO ASK: If a skeleton is always shorter than the person, how would you work back? What would you " +
      "need to know? Does an accession number tell you a measurement is right, or only that it can be checked?",
    category: "biography",
    subcategory: "Surviving physical remains",
    eventType: "historical",
    evidenceStatus: "verified_physical_remains",
    remainsLocation: "Hunterian Collection, Royal College of Surgeons of England (retained; not on public display)",
    accessionNumber: "RCSHC/Osteo. 223",
    tags: ["tallest-humans", "charles-byrne", "skeleton", "hunterian", "physical-remains", "consent"],
    people: ["Charles Byrne", "John Hunter"],
    locationName: "London, England",
    claims: [
      {
        sourceKey: null,
        startYear: 1761,
        endYear: 1783,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "His life",
        originalDateText: "1761 - 1783",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: birth and death. He died at about twenty-two, in London, having been exhibited there. " +
          "WHY IT MATTERS: the skeleton entered a collection within months of the death, which is why its " +
          "provenance is unusually unbroken for an eighteenth-century specimen.",
        notes: "NEEDS SOURCE VERIFICATION for both dates against parish or press records.",
      },
      {
        sourceKey: "rcs_byrne_statement",
        startYear: 2023,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "When the skeleton ceased to be publicly displayed",
        originalDateText: "Retained but withdrawn from display, announced around the 2023 museum reopening",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that the College retains the skeleton and no longer displays it publicly. WHY IT IS " +
          "ON THE TIMELINE: because the custody of evidence is itself datable, and because a reader who goes " +
          "looking for the exhibit should know what they will find. WHAT IT IS NOT: a judgement on whether " +
          "retention is right.",
        notes:
          "NEEDS SOURCE VERIFICATION for the precise wording and date of the statement, which has not been read " +
          "here.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Height as advertised during his exhibition in London",
        valueLowCm: 244,
        valueHighCm: 254,
        valueCm: 254,
        originalValueText: "Advertised at eight feet and upwards; figures to about 8 ft 4 in circulated",
        measurementKind: "advertised_height",
        measurementMethod: "promotional",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: eight feet and more. WHO CLAIMED IT: the exhibition that was charging admission to " +
          "see him. WHAT IT IS EVIDENCE OF: what was advertised in London in the 1780s, which is a real " +
          "historical fact about the period and about him. WHAT IT IS NOT EVIDENCE OF: what he measured. THIS " +
          "CLAIM IS KEPT DELIBERATELY. Deleting it because the skeleton is shorter would hide the most " +
          "interesting thing in the record, which is the size and the shape of the gap.",
        notes:
          "NEEDS SOURCE VERIFICATION against the surviving handbills and press advertisements, which exist and " +
          "have not been consulted here. The range given is indicative of figures in circulation, not a " +
          "reading of any one bill.",
      },
      {
        sourceKey: "rcs_surgicat_byrne",
        whatIsMeasured: "The articulated skeleton, as mounted",
        valueCm: 231,
        originalValueText: "About 7 ft 7 in as catalogued",
        measurementKind: "skeletal_height",
        measurementMethod: "mounted_skeleton",
        evidenceStatus: "verified_physical_remains",
        directlyMeasured: true,
        evidence:
          "WHAT IS MEASURED: the bones, articulated and standing, in a collection, under accession number " +
          "RCSHC/Osteo. 223. WHY IT IS LOWER THAN THE LIVING MAN NECESSARILY WAS: a mounted skeleton lacks " +
          "cartilage, intervertebral discs and soft tissue, and the assembly itself introduces variation. THE " +
          "FIGURE IS THEREFORE A FLOOR, not an estimate of his stature. WHAT IT ESTABLISHES BEYOND THE NUMBER: " +
          "that the remains exist and can be re-measured, which separates this record from every undocumented " +
          "giant-skeleton claim in the disputed section.",
        notes:
          "NEEDS SOURCE VERIFICATION for the catalogue's own figure and for when it was last taken. The value " +
          "here is given from general knowledge of the specimen and MUST be replaced with the catalogue " +
          "measurement; it is the single most important unverified number in this dataset.",
      },
    ],
    media: [
      {
        url: commons("The_skeleton_of_Charles_Byrne_%281761%E2%80%931783%29.jpg"),
        sourcePageUrl: commonsPage("The_skeleton_of_Charles_Byrne_%281761%E2%80%931783%29.jpg"),
        caption:
          "The articulated skeleton of Charles Byrne (1761-1783), from the Hunterian Museum at the Royal College of Surgeons of England. Photographed against a plain ground; the original file is approximately 2165 x 5312 pixels.",
        kind: "image",
        shows: "human_remains",
        institution: "Hunterian Museum, Royal College of Surgeons of England",
        accessionNumber: "RCSHC/Osteo. 223",
        depictsActualRemains: true,
        verifiedIdentity: true,
        creditFrom: "source",
      },
      {
        url: commons("Hunterian_7ft_%2B_skeleton.jpg"),
        sourcePageUrl: commonsPage("Hunterian_7ft_%2B_skeleton.jpg"),
        caption:
          "The skeleton of Charles Byrne in its museum display setting at the Hunterian. Valuable for showing the specimen in the context it was kept and seen in, rather than isolated.",
        kind: "image",
        shows: "museum_specimen",
        institution: "Hunterian Museum, Royal College of Surgeons of England",
        licence: "CC BY 2.0",
        depictsActualRemains: true,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "john-f-carroll",
    title: "John F. Carroll, and the two heights of one man",
    summary:
      "1932-1969. The clearest case in the dataset of why 'how tall was he' has two correct answers that differ by roughly a foot.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person whose record exists mainly to make one distinction impossible to " +
      "miss.\n\n" +
      "THE DISTINCTION. Carroll had severe scoliosis and kyphosis. His MEASURED STANDING HEIGHT — what a rule " +
      "against his actual standing body gave — was substantially less than the figure usually quoted for him. " +
      "The quoted figure, around 263.5 cm, is an ESTIMATE OF WHAT HE WOULD HAVE MEASURED had his spine been " +
      "straight. Both numbers are about him. Only one of them was ever measured.\n\n" +
      "WHY THIS MATTERS BEYOND CARROLL. Lists of the tallest people mix these two quantities freely and without " +
      "marking them, which means the list is not ordered by any single property. A corrected figure and a " +
      "measured figure are not two attempts at the same number; they are different numbers, and one of them is " +
      "a reconstruction.\n\n" +
      "WHAT MUST NOT BE DONE HERE. His straightened height must not be inferred from photographs. Estimating " +
      "spinal correction from an image is not a method, and this dataset does not have the clinical " +
      "measurements that would support one. The corrected figure below is recorded as a figure in circulation " +
      "whose derivation this dataset has not seen.\n\n" +
      "THINGS TO ASK: If a list mixes measured and corrected heights, what is it a list of? Which of the two " +
      "would you want if you were asking who was tallest, and why?",
    category: "biography",
    subcategory: "Documented stature",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["tallest-humans", "gigantism", "scoliosis", "measurement-method"],
    people: ["John F. Carroll"],
    locationName: "Buffalo, New York, United States",
    claims: [
      {
        sourceKey: null,
        startYear: 1932,
        endYear: 1969,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "His life",
        originalDateText: "1932 - 1969",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth and death, from secondary accounts.",
        notes: "NEEDS SOURCE VERIFICATION against primary records.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Height with the spinal curvature corrected for",
        valueCm: 263.5,
        originalValueText: "8 ft 7.75 in, adjusted for curvature",
        measurementKind: "corrected_living_height",
        measurementMethod: "unstated",
        evidenceStatus: "disputed",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 263.5 cm. WHAT KIND OF NUMBER IT IS: an estimate of a height he never stood " +
          "at, produced by correcting for severe scoliosis and kyphosis. IT WAS NOT MEASURED. WHY IT IS ON THE " +
          "RECORD ANYWAY: it is the figure by which he is almost always listed, and a reader meeting it " +
          "elsewhere needs to be able to find out what it is. WHAT WOULD MAKE IT CHECKABLE: the clinical " +
          "measurements and the correction method, neither of which this dataset has seen.",
        notes:
          "NEEDS SOURCE VERIFICATION, and this one is serious: the derivation of the correction is unknown to " +
          "this dataset. Do not infer it from photographs.",
      },
      {
        sourceKey: null,
        whatIsMeasured: "Standing height as actually measured",
        valueAbsentReason:
          "This dataset has not obtained the measured standing figure from a source it can cite. It is recorded " +
          "as a gap rather than filled with an approximation, because an invented number here would destroy the " +
          "only distinction this record exists to make.",
        originalValueText: "Substantially lower than the corrected figure; exact value not obtained here",
        measurementKind: "standing_height_living",
        measurementMethod: "medical_examination",
        evidenceStatus: "unresolved",
        directlyMeasured: true,
        evidence:
          "WHAT IS KNOWN: that his measured standing height was markedly lower than the 263.5 cm usually " +
          "printed, because of severe spinal curvature. WHAT IS NOT KNOWN HERE: the figure. A CLAIM WITH NO " +
          "NUMBER IS STILL A CLAIM: it records that the quantity exists, that it differs from the famous one, " +
          "and that this dataset has not got it. THE ALTERNATIVE — quietly printing only the corrected height — " +
          "is how the distinction gets lost in every other list.",
        notes:
          "NEEDS SOURCE VERIFICATION. Medical or records-body documentation would close this. Until then the " +
          "gap is the honest content of the claim.",
      },
    ],
  },

  {
    slug: "vaino-myllyrinne",
    title: "Väinö Myllyrinne",
    summary: "1909-1963. Finland. Reported at about 251 cm at his maximum, having grown again in adulthood.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person, with a growth history that complicates the single-number question.\n\n" +
      "THE UNUSUAL PART. He is reported to have been about 222 cm as a young man and to have grown substantially " +
      "again in his twenties, reaching roughly 251 cm. A height for him is therefore only meaningful with a date " +
      "attached, and lists that give one figure are quietly picking a year.\n\n" +
      "THE PHOTOGRAPH SEEDED HERE. He is shaking hands with another person. Like the Wadlow photograph, the value " +
      "is the second body in the frame: a handshake puts two people at the same distance from the lens, which is " +
      "the condition under which a photographic comparison means anything at all.\n\n" +
      "THINGS TO ASK: If somebody's height changes by thirty centimetres in adulthood, what does 'his height' " +
      "refer to? What else would you want to know before trusting a height taken from a photograph?",
    category: "biography",
    subcategory: "Documented stature",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["tallest-humans", "gigantism", "finland", "photographed"],
    people: ["Väinö Myllyrinne"],
    locationName: "Finland",
    claims: [
      {
        sourceKey: null,
        startYear: 1909,
        endYear: 1963,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "His life",
        originalDateText: "1909 - 1963",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth and death, from secondary accounts.",
        notes: "NEEDS SOURCE VERIFICATION against Finnish civil records.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Standing height at his reported maximum",
        valueCm: 251,
        originalValueText: "About 8 ft 3 in at maximum reported measurement",
        measurementKind: "standing_height_living",
        measurementMethod: "unstated",
        evidenceStatus: "strongly_documented",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 251 cm. WHAT IS UNUSUAL: this is a maximum reached after renewed growth in " +
          "adulthood, not a stable adult height, so the figure belongs to a period of his life rather than to " +
          "him. WHAT IS MISSING: who measured it, when, and how.",
        notes:
          "NEEDS SOURCE VERIFICATION for the occasion and the measurer. Finnish national archives, Finna and " +
          "SA-kuva are the places to look, and this dataset cannot reach them.",
      },
    ],
    media: [
      {
        url: commons("V%C3%A4in%C3%B6_Myllyrinne_k%C3%A4ttelem%C3%A4ss%C3%A4.jpg"),
        sourcePageUrl: commonsPage("V%C3%A4in%C3%B6_Myllyrinne_k%C3%A4ttelem%C3%A4ss%C3%A4.jpg"),
        caption:
          "Väinö Myllyrinne shaking hands with another man. A handshake places both people at the same distance from the lens, which is what makes a photographic size comparison worth anything.",
        kind: "image",
        shows: "evidence_photograph",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "bernard-coyne",
    title: "Bernard Coyne",
    summary: "1897-1921. Iowa. About 254 cm, in a record that rests on a small number of surviving photographs and documents.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person for whom the documentary base is thinner than the fame suggests.\n\n" +
      "WHAT SURVIVES. Photographs, and the ordinary paper a short American life leaves — including, in his case, " +
      "a draft registration, which is the sort of document that records a height for an unrelated reason and is " +
      "therefore unusually free of showmanship.\n\n" +
      "WHY HE IS WORTH SEEDING BEFORE THE RESEARCH IS FINISHED. Because the honest state of his record is itself " +
      "the lesson: a figure around 254 cm is widely printed, and this dataset has not yet seen the document it " +
      "comes from. The measurement claim below says so.\n\n" +
      "THINGS TO ASK: Why might a draft registration be better evidence of a height than a newspaper? What kinds " +
      "of document record a measurement without wanting anything from it?",
    category: "biography",
    subcategory: "Documented stature",
    eventType: "historical",
    evidenceStatus: "historical_report_remains_lost",
    tags: ["tallest-humans", "gigantism", "iowa", "photographed"],
    people: ["Bernard Coyne"],
    locationName: "Anthon, Iowa, United States",
    claims: [
      {
        sourceKey: null,
        startYear: 1897,
        endYear: 1921,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "His life",
        originalDateText: "1897 - 1921",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth and death, from secondary accounts.",
        notes: "NEEDS SOURCE VERIFICATION against Iowa civil records.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Standing height as usually reported",
        valueCm: 254,
        originalValueText: "About 8 ft 4 in",
        measurementKind: "reported_unspecified",
        measurementMethod: "unstated",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 254 cm. WHERE IT COMES FROM: not established here. The figure is in wide " +
          "circulation and this dataset has not traced it to the document that produced it. WHY IT IS FILED AS " +
          "REPORTED RATHER THAN DOCUMENTED: because 'everybody prints it' is not a provenance.",
        notes:
          "NEEDS SOURCE VERIFICATION. His draft registration is the document most likely to settle it and has " +
          "not been consulted.",
      },
    ],
    media: [
      {
        url: commons("Bernard_Coyne_(1897-1921)_circa_1920.jpg"),
        sourcePageUrl: commonsPage("Bernard_Coyne_(1897-1921)_circa_1920.jpg"),
        caption:
          "Bernard Coyne, photographed about 1920, a year or so before his death at twenty-four. A solo portrait with nothing of known size in the frame, which is why it is evidence that he existed and was photographed, and not evidence of how tall he was.",
        kind: "image",
        shows: "evidence_photograph",
        imageDate: "circa 1920",
        licence: "Public domain in the United States",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "sandy-allen",
    title: "Sandy Allen",
    summary: "1955-2008. 231.7 cm. A modern, institutionally documented case, with a dated Library of Congress photograph.",
    description:
      "WHAT KIND OF RECORD IS THIS? A modern person whose evidence is of the kind historians wish they had for " +
      "everybody in this dataset.\n\n" +
      "WHAT MAKES IT GOOD. The photograph seeded here is held by the Library of Congress, with a digital " +
      "identifier, a date and a place: Wildwood, New Jersey, 1978. A picture with a catalogue record behind it " +
      "is a different kind of object from a picture with a caption, and this dataset is largely about that " +
      "difference.\n\n" +
      "THINGS TO ASK: What does a digital ID give you that a filename does not? If you wanted to check this " +
      "photograph was what it says, what would you actually do?",
    category: "biography",
    subcategory: "Documented stature",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["tallest-humans", "gigantism", "library-of-congress", "photographed"],
    people: ["Sandy Allen"],
    locationName: "Indiana, United States",
    claims: [
      {
        sourceKey: null,
        startYear: 1955,
        endYear: 2008,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "Her life",
        originalDateText: "1955 - 2008",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth and death.",
        notes: "NEEDS SOURCE VERIFICATION against primary records.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Standing height as recorded",
        valueCm: 231.7,
        originalValueText: "7 ft 7.25 in",
        measurementKind: "standing_height_living",
        measurementMethod: "official_records_body",
        evidenceStatus: "strongly_documented",
        directlyMeasured: true,
        evidence:
          "WHAT IS CLAIMED: 231.7 cm. WHY IT IS BETTER EVIDENCE THAN MOST FIGURES HERE: it belongs to the era of " +
          "records-body verification, where a stated procedure and a named measurer exist, rather than to the " +
          "era of the playbill.",
        notes: "NEEDS SOURCE VERIFICATION for the measuring occasion and the procedure used.",
      },
    ],
    media: [
      {
        url: commons("World%27s_tallest_woman,_Sandy_Allen,_Boardwalk.jpg"),
        sourcePageUrl: commonsPage("World%27s_tallest_woman,_Sandy_Allen,_Boardwalk.jpg"),
        caption:
          "Sandy Allen on the boardwalk at Wildwood, New Jersey, 1978. Held by the Library of Congress; the original file is approximately 3644 x 5229 pixels.",
        kind: "image",
        shows: "evidence_photograph",
        institution: "United States Library of Congress, Prints and Photographs Division",
        accessionNumber: "mrg.10218",
        imageDate: "1978",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "sultan-kosen",
    title: "Sultan Kösen",
    summary: "Born 1982. 251 cm. The modern control case: measured under a stated procedure, while alive, by people with no stake in the answer.",
    description:
      "WHAT KIND OF RECORD IS THIS? A living person, included as the comparison that makes the rest of the " +
      "dataset legible.\n\n" +
      "WHY A MODERN CASE BELONGS IN A HISTORICAL DATASET. Because it shows what the evidence looks like when " +
      "nothing is missing. Kösen was measured repeatedly, under a published procedure, by a records body, with " +
      "the date and the method recorded and no admission money riding on the result. Every historical record " +
      "here can be read against that: what is absent, and what difference the absence makes.\n\n" +
      "THINGS TO ASK: Which of the historical figures in this dataset would survive being held to this " +
      "standard? Is that a fact about them or about their centuries?",
    category: "biography",
    subcategory: "Documented stature",
    eventType: "historical",
    evidenceStatus: "verified_physical_remains",
    tags: ["tallest-humans", "gigantism", "modern", "records-body", "photographed"],
    people: ["Sultan Kösen"],
    locationName: "Turkey",
    claims: [
      {
        sourceKey: null,
        startYear: 1982,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "His birth",
        originalDateText: "1982",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth. He is living, so the record has no end.",
        notes: "NEEDS SOURCE VERIFICATION for the exact date.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Standing height, measured under a records-body procedure",
        valueCm: 251,
        originalValueText: "8 ft 2.8 in",
        measurementKind: "standing_height_living",
        measurementMethod: "official_records_body",
        evidenceStatus: "verified_physical_remains",
        directlyMeasured: true,
        evidence:
          "WHAT IS CLAIMED: 251 cm. WHY IT IS THE STRONGEST KIND OF FIGURE IN THIS DATASET: the subject is " +
          "living and re-measurable, the procedure is published, the measurer is named and disinterested, and " +
          "the measurement has been repeated. Nothing about a historical figure can be this good, which is the " +
          "point of including him.",
        notes: "NEEDS SOURCE VERIFICATION for the measuring dates and the published procedure.",
      },
    ],
    media: [
      {
        url: commons("The_tallest_man_in_the_world,_Sultan_Kosen_(4046630148).jpg"),
        sourcePageUrl: commonsPage("The_tallest_man_in_the_world,_Sultan_Kosen_(4046630148).jpg"),
        caption:
          "Sultan Kösen photographed with others, 24 October 2009. The surrounding people give the frame its scale; the original file is approximately 3527 x 2531 pixels.",
        kind: "image",
        shows: "evidence_photograph",
        creator: "Helgi Halldórsson",
        imageDate: "2009-10-24",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "edouard-beaupre",
    title: "Édouard Beaupré, and what happened to his body",
    summary:
      "1881-1904. Saskatchewan. About 251 cm. His body was embalmed and exhibited for most of a century before it was cremated in 1990 and returned home.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person, and a second story about custody of remains that runs parallel to " +
      "Charles Byrne's and ends differently.\n\n" +
      "THE LIFE. Born at Willow Bunch in what is now Saskatchewan, he worked as a strongman and was exhibited; " +
      "he died at twenty-three, of tuberculosis, in St Louis.\n\n" +
      "WHAT HAPPENED AFTERWARDS, WHICH IS WHY HE IS HERE. His body was not buried. It was embalmed and displayed " +
      "for decades, and eventually held at the Université de Montréal. In 1990 it was cremated and the ashes " +
      "returned to Willow Bunch. That sequence — exhibited, retained by an institution, released after a family " +
      "campaign — is the same argument as Byrne's, run to a conclusion. Byrne's skeleton is still held. " +
      "Beaupré's body is not. A reader who wants to think about what institutions owe the dead has two cases " +
      "here and can compare them.\n\n" +
      "WHAT THIS DOES TO THE EVIDENCE. It removes it. There is no longer a body to measure, so every figure for " +
      "Beaupré now rests on records made before 1990. That is the trade: the remains were returned, and the " +
      "physical evidence went with them. This record does not treat that as a loss to be regretted — it records " +
      "it as the outcome of a decision, and notes what it costs to know.\n\n" +
      "THE PHOTOGRAPHS. Two are seeded, both from about 1900-1901. One has a second adult man standing beside " +
      "him, which is what makes it useful.\n\n" +
      "THINGS TO ASK: If remains are returned and the measurements were never taken, what is lost? Is that a " +
      "reason to keep them? Who should decide?",
    category: "biography",
    subcategory: "Remains no longer available",
    eventType: "historical",
    evidenceStatus: "historical_report_remains_lost",
    remainsLocation: "Cremated 1990; ashes at Willow Bunch, Saskatchewan",
    tags: ["tallest-humans", "gigantism", "canada", "remains-returned", "consent", "photographed"],
    people: ["Édouard Beaupré"],
    locationName: "Willow Bunch, Saskatchewan, Canada",
    claims: [
      {
        sourceKey: null,
        startYear: 1881,
        endYear: 1904,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "His life",
        originalDateText: "1881 - 1904",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth at Willow Bunch and death at St Louis, aged twenty-three.",
        notes: "NEEDS SOURCE VERIFICATION against Canadian civil records.",
      },
      {
        sourceKey: null,
        startYear: 1990,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "When his remains were cremated and returned",
        originalDateText: "Cremated in 1990; ashes returned to Willow Bunch",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the end of an eighty-six-year period in which his body was held and displayed rather " +
          "than buried. WHY IT IS ON THE TIMELINE: the custody of remains is datable, and in this dataset it is " +
          "one of the things most worth dating. WHAT IT MEANS FOR THE EVIDENCE: after this date there is nothing " +
          "left to measure.",
        notes: "NEEDS SOURCE VERIFICATION for the date and the circumstances of the return.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Standing height as usually reported",
        valueCm: 251,
        originalValueText: "About 8 ft 3 in",
        measurementKind: "reported_unspecified",
        measurementMethod: "unstated",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 251 cm. WHAT SUPPORTS IT: figures recorded during his exhibition years and " +
          "during the long period the body was held. WHAT CANNOT NOW BE DONE: checking any of them, because the " +
          "body was cremated in 1990. THE EVIDENCE STATUS IS NOT A JUDGEMENT ON THE FIGURE. It records that the " +
          "object which could settle it no longer exists.",
        notes:
          "NEEDS SOURCE VERIFICATION. Measurements taken at the Université de Montréal before 1990, if they were " +
          "published, would be the best surviving evidence and have not been consulted here.",
      },
    ],
    media: [
      {
        url: commons("Edouard_Beaupre.JPG"),
        sourcePageUrl: commonsPage("Edouard_Beaupre.JPG"),
        caption:
          "Édouard Beaupré standing beside another adult man, about 1900. The second figure is the point: a lone portrait of a very tall person tells a viewer almost nothing about scale.",
        kind: "image",
        shows: "evidence_photograph",
        imageDate: "circa 1900",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
      {
        url: commons("Montr%C3%A9al_d%C3%A9but_XX%C3%A8_si%C3%A8cle._Le_g%C3%A9ant_Beaupr%C3%A9.jpg"),
        sourcePageUrl: commonsPage("Montr%C3%A9al_d%C3%A9but_XX%C3%A8_si%C3%A8cle._Le_g%C3%A9ant_Beaupr%C3%A9.jpg"),
        caption:
          "Édouard Beaupré photographed in Montreal, about 1901, during the years he was being exhibited. Associated with the Archives de Montréal; the original file is approximately 1200 x 1664 pixels.",
        kind: "image",
        shows: "evidence_photograph",
        institution: "Archives de Montréal",
        imageDate: "circa 1901",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "ella-ewing",
    title: "Ella Ewing, and the gap between the poster and the woman",
    summary:
      "1872-1913. Missouri. Advertised at over eight feet; the figure supported by non-promotional evidence is substantially lower.",
    description:
      "WHAT KIND OF RECORD IS THIS? The dataset's clearest worked example of ADVERTISED HEIGHT as a category of " +
      "its own.\n\n" +
      "THE TWO NUMBERS. She was exhibited, and the bills claimed heights above eight feet. Accounts resting on " +
      "measurement rather than on admission money put her considerably lower — in the region of seven feet four " +
      "to seven feet six. This dataset does not have a measurement it can cite for her, and says so below rather " +
      "than picking one.\n\n" +
      "WHY THE POSTER IS EVIDENCE ANYWAY. Not of her height. Of the industry. A playbill is a primary source " +
      "about what nineteenth-century audiences were sold and what the trade thought would sell, and it is worth " +
      "keeping for exactly that. The mistake is not printing the poster; the mistake is reading it as a " +
      "measurement.\n\n" +
      "THE NEWSPAPER COMPARISON CHART. A chart printed in the Morning World-Herald in May 1900 ranked famous " +
      "tall people against one another. It is an extraordinary document and it is NOT evidence that any figure " +
      "in it was accurate: it is evidence of what was being claimed, by whom, in 1900, and of the fact that the " +
      "comparison was already a public entertainment. Seeded as an illustration, never as a measurement.\n\n" +
      "THINGS TO ASK: If every performer's height was inflated by roughly the same amount, would the rankings " +
      "still be right? What would you need to check that?",
    category: "biography",
    subcategory: "Advertised against measured",
    eventType: "disputed",
    evidenceStatus: "disputed",
    tags: ["tallest-humans", "advertised-height", "missouri", "sideshow", "photographed"],
    people: ["Ella Ewing"],
    locationName: "Gorin, Missouri, United States",
    claims: [
      {
        sourceKey: null,
        startYear: 1872,
        endYear: 1913,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Her life",
        originalDateText: "1872 - 1913",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth and death, from secondary accounts.",
        notes: "NEEDS SOURCE VERIFICATION against Missouri civil records; the birth year is given variously.",
      },
    ],
    measurements: [
      {
        sourceKey: "commons_provenance",
        whatIsMeasured: "Height as advertised in her exhibition years",
        valueCm: 249,
        originalValueText: "Advertised at over 8 ft; figures around 8 ft 4 in appeared on bills",
        measurementKind: "advertised_height",
        measurementMethod: "promotional",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: over eight feet. WHO CLAIMED IT: the shows exhibiting her. WHAT IT IS GOOD EVIDENCE " +
          "OF: the advertising practice of American exhibition in the 1890s and 1900s. WHAT IT IS NOT EVIDENCE " +
          "OF: her height. KEPT ON THE RECORD because deleting advertised heights would remove the only way a " +
          "reader can see how large the inflation typically was.",
        notes:
          "NEEDS SOURCE VERIFICATION against the surviving bills themselves. The value is a representative " +
          "figure for claims in circulation, not a reading of one document.",
      },
      {
        sourceKey: null,
        whatIsMeasured: "Height on non-promotional evidence",
        valueAbsentReason:
          "This dataset has not obtained a measurement of Ella Ewing from a source independent of the shows that " +
          "exhibited her. Accounts in the region of 7 ft 4 in to 7 ft 6 in circulate; none has been traced here " +
          "to a measuring occasion, so no figure is entered.",
        originalValueText: "Reported substantially lower than the advertised figure; not established here",
        measurementKind: "standing_height_living",
        measurementMethod: "unstated",
        evidenceStatus: "unresolved",
        directlyMeasured: false,
        evidence:
          "WHAT IS KNOWN: that the advertised figure was inflated, which is the ordinary finding for exhibited " +
          "performers and is not a slur on her. WHAT IS NOT KNOWN HERE: by how much. ENTERING A GUESS WOULD " +
          "DESTROY THE COMPARISON this record exists to make, because the interesting quantity is the SIZE OF " +
          "THE GAP and a guessed second number produces a guessed gap.",
        notes:
          "NEEDS SOURCE VERIFICATION. A physician's note, a census or draft record, or a coffin measurement " +
          "would each be better than anything currently here.",
      },
    ],
    media: [
      {
        url: commons("EllaEwing1.jpg"),
        sourcePageUrl: commonsPage("EllaEwing1.jpg"),
        caption:
          "Ella Ewing, photographed during her exhibition years. A studio portrait made to be sold to audiences, which is a fact about the picture worth knowing before reading anything off it.",
        kind: "image",
        shows: "evidence_photograph",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
      {
        url: commons("EllaEwingPoster.jpg"),
        sourcePageUrl: commonsPage("EllaEwingPoster.jpg"),
        caption:
          "An advertising poster for Ella Ewing's exhibition. A primary source about the show business of the period; the height printed on a bill is a selling point and was never a measurement.",
        kind: "image",
        shows: "later_artwork",
        depictsActualRemains: false,
        verifiedIdentity: false,
        creditFrom: "source",
      },
      {
        url: commons("Giant_comparison_chart_Morning_World_Herald_Sun_May_13_1900.png"),
        sourcePageUrl: commonsPage("Giant_comparison_chart_Morning_World_Herald_Sun_May_13_1900.png"),
        caption:
          "A comparison chart of famous tall people printed in the Morning World-Herald, Sunday 13 May 1900. Evidence of what was being claimed in 1900, and of the fact that ranking them was already a public entertainment. Not evidence that any figure in it is correct.",
        kind: "image",
        shows: "later_artwork",
        imageDate: "1900-05-13",
        depictsActualRemains: false,
        verifiedIdentity: false,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "anna-and-martin-bates",
    title: "Anna Haining Bates and Martin Van Buren Bates",
    summary:
      "Married 1871. Both exceptionally tall, both exhibited, and both carrying advertised figures that later accounts reduce.",
    description:
      "WHAT KIND OF RECORD IS THIS? Two people in one record, because the surviving evidence is largely of them " +
      "together and because the photograph that matters shows them together.\n\n" +
      "ANNA HAINING SWAN, of Nova Scotia, and MARTIN VAN BUREN BATES, of Kentucky, married in 1871 and were " +
      "exhibited as a couple. Both were genuinely very tall. Both were also advertised, and the advertised " +
      "figures for both are higher than the figures in accounts that are not selling tickets — the same pattern " +
      "as Ella Ewing, in a case where it can be watched happening to two people at once.\n\n" +
      "A WARNING ATTACHED TO THE PHOTOGRAPH. The Commons description of the image seeded here repeats heights " +
      "for them. Those heights have NOT been copied into this record. A file description is a good record of a " +
      "picture and is not an authority for a measurement, and the distinction is exactly what this dataset is " +
      "for. The figures below are recorded as reported, flagged, and awaiting a document.\n\n" +
      "THINGS TO ASK: Why would a married couple both be advertised taller than they were? What would it take " +
      "to establish either figure now?",
    category: "biography",
    subcategory: "Advertised against measured",
    eventType: "historical",
    evidenceStatus: "historical_report_remains_lost",
    tags: ["tallest-humans", "advertised-height", "nova-scotia", "kentucky", "photographed"],
    people: ["Anna Haining Bates", "Martin Van Buren Bates"],
    locationName: "Seville, Ohio, United States",
    claims: [
      {
        sourceKey: null,
        startYear: 1871,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "Their marriage",
        originalDateText: "Married in 1871",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the marriage, which is also roughly the date of the photograph seeded here and the " +
          "beginning of their joint exhibition.",
        notes: "NEEDS SOURCE VERIFICATION against the marriage record.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Anna Haining Bates, height as reported",
        valueCm: 241,
        originalValueText: "About 7 ft 11 in in non-promotional accounts; advertised at 8 ft",
        measurementKind: "reported_unspecified",
        measurementMethod: "unstated",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 241 cm. HOW IT DIFFERS FROM THE ADVERTISEMENT: the round eight feet used on " +
          "bills is higher. WHY THE LOWER FIGURE IS RECORDED AS THE REPORTED ONE: because it is the figure that " +
          "appears where nothing is being sold. WHAT IS MISSING: the measuring occasion.",
        notes:
          "NEEDS SOURCE VERIFICATION. Nova Scotia Archives holds material on her and has not been consulted. Do " +
          "NOT take the figure from an image description.",
      },
      {
        sourceKey: null,
        whatIsMeasured: "Martin Van Buren Bates, height as reported",
        valueCm: 236,
        originalValueText: "About 7 ft 9 in in non-promotional accounts; advertised higher",
        measurementKind: "reported_unspecified",
        measurementMethod: "unstated",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 236 cm. SAME PATTERN AS HIS WIFE: the advertised figure is higher than the " +
          "reported one. WHAT IS MISSING: a measuring occasion, and any document taken for a purpose other than " +
          "exhibition.",
        notes: "NEEDS SOURCE VERIFICATION. Kentucky archives and his military service records are the places to look.",
      },
    ],
    media: [
      {
        url: commons("Martin_Van_Buren_Bates_and_Anna_Haining_Bates.png"),
        sourcePageUrl: commonsPage("Martin_Van_Buren_Bates_and_Anna_Haining_Bates.png"),
        caption:
          "Martin Van Buren Bates and Anna Haining Bates, about 1871. Two exceptionally tall people photographed together, which makes the image striking and makes it useless for establishing either height, since neither provides a known scale for the other.",
        kind: "image",
        shows: "evidence_photograph",
        imageDate: "circa 1871",
        depictsActualRemains: false,
        verifiedIdentity: true,
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "john-rogan",
    title: "John William \"Bud\" Rogan",
    summary:
      "1868-1905. Tennessee. About 267 cm — second only to Wadlow — and his family took deliberate steps to make sure nobody would ever dig him up.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person, and a case where the absence of physical evidence is the " +
      "result of a decision rather than of neglect.\n\n" +
      "THE LIFE. Born near Gallatin, Tennessee. Ankylosis fused his joints from adolescence, so that for " +
      "most of his life he could not stand or walk; he moved in a cart he had built, drawn by goats. He is " +
      "reported to have weighed very little for his length — a detail that says more about his condition " +
      "than any height does.\n\n" +
      "WHY HE IS HERE. On reported figures he is the second tallest person in this dataset. He is also, " +
      "unlike Wadlow, almost entirely undocumented medically, which makes the comparison between them the " +
      "useful thing: two men of nearly the same reported stature, one with a clinical record and one " +
      "without.\n\n" +
      "THE REMAINS, AND WHY THERE ARE NO PHOTOGRAPHS OF THEM. Body-snatching from Black cemeteries for " +
      "anatomical sale was a real and well-documented practice in the nineteenth-century American South, " +
      "and his family are reported to have buried him in a way intended to defeat it — in concrete, at the " +
      "family home. That is the reason no skeleton exists to photograph, and it belongs in the record as an " +
      "act of protection rather than as a gap in the evidence. Compare Charles Byrne, who asked for the " +
      "same protection and did not get it.\n\n" +
      "ON THE PHOTOGRAPHS. The surviving pictures show him seated in his cart. Searching archives for them " +
      "may require the racial terminology of the period, which appears in catalogue records and in " +
      "contemporary captions. That terminology belongs in search strings and in source metadata; it does " +
      "not belong in this dataset's own descriptive language.\n\n" +
      "THINGS TO ASK: If two men are the same height and only one was examined by doctors, are the two " +
      "figures the same kind of fact? What does it mean that protecting a body from anatomists also " +
      "removes it from the evidence record?",
    category: "biography",
    subcategory: "Remains deliberately protected",
    eventType: "historical",
    evidenceStatus: "historical_report_remains_lost",
    remainsLocation: "Buried at the family home near Gallatin, Tennessee; reported to have been interred in concrete against grave robbing",
    tags: ["tallest-humans", "gigantism", "tennessee", "remains-protected", "consent"],
    people: ["John William Rogan"],
    locationName: "Gallatin, Tennessee, United States",
    claims: [
      {
        sourceKey: null,
        startYear: 1868,
        endYear: 1905,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "His life",
        originalDateText: "About 1868 - 1905",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: birth and death. WHY APPROXIMATE: birth records for Black Tennesseans of this " +
          "period are frequently incomplete, and his birth year is given variously.",
        notes: "NEEDS SOURCE VERIFICATION against Tennessee records; the birth year in particular.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Height as reported, lying rather than standing",
        valueCm: 267,
        originalValueText: "About 8 ft 9 in",
        measurementKind: "reported_unspecified",
        measurementMethod: "unstated",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 267 cm. AN IMPORTANT COMPLICATION: he could not stand. Any figure for him " +
          "is therefore a length measured on a body that was never upright, which is not the same quantity " +
          "as a standing height and is not obviously convertible into one. WHAT IS MISSING: who measured " +
          "him, when, and how. NO REMAINS EXIST to settle it, by his family's deliberate choice.",
        notes:
          "NEEDS SOURCE VERIFICATION. This figure is widely repeated and this dataset has not traced it to " +
          "a measuring occasion. Note also that the standing/recumbent distinction is rarely made when it " +
          "is quoted, including in lists that rank him against men who were measured standing.",
      },
    ],
  },

  {
    slug: "patrick-cotter-obrien",
    title: "Patrick Cotter O'Brien, and two exhumations",
    summary:
      "1760-1806. The Bristol Giant. Advertised at eight feet seven; buried deep against body snatchers; dug up twice in the twentieth century.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person whose remains were examined twice, long after death, which " +
      "makes him one of very few historical cases where a physical check on an advertised height was " +
      "actually attempted.\n\n" +
      "THE LIFE. Born in Ireland, exhibited in England, died at Clifton in Bristol in 1806. He was among " +
      "the best-known exhibited giants of his generation and was advertised at eight feet seven or " +
      "thereabouts.\n\n" +
      "THE BURIAL, WHICH WAS DEFENSIVE. He is reported to have been buried unusually deep and with " +
      "precautions, for the same reason Charles Byrne asked to be buried at sea twenty-three years " +
      "earlier: the anatomists. Byrne's precautions failed within weeks. Cotter's held for a century.\n\n" +
      "TWO EXHUMATIONS. His remains are reported to have been examined in 1906 and again in 1972, and the " +
      "figures that came out of those examinations are substantially lower than the advertised height — in " +
      "the region of seven feet ten to eight feet one, depending on which account is read. THIS IS THE " +
      "IMPORTANT PART OF THE RECORD and it is exactly the part this dataset cannot yet cite properly.\n\n" +
      "WHAT IS DELIBERATELY NOT ENTERED. No value is given below for either exhumation. This dataset has " +
      "not read the 1906 or 1972 reports, does not know what was measured, whether the skeleton was " +
      "articulated, or what allowance if any was made for soft tissue. Entering a number would create the " +
      "appearance of a physical measurement where there is only a recollection of one — which, in a record " +
      "whose entire purpose is to distinguish those two things, would be self-defeating.\n\n" +
      "WHY HE MAY BE THE MOST VALUABLE UNFINISHED RECORD HERE. A lifetime advertisement, a coffin, and two " +
      "separate physical examinations sixty-six years apart is a better evidential chain than almost any " +
      "other historical giant has. Somebody with access to the Bristol archives and the relevant journals " +
      "could turn this record into the best one in the dataset in an afternoon.\n\n" +
      "THINGS TO ASK: If two exhumations sixty-six years apart gave different figures, what would explain " +
      "that? What can a skeleton tell you about the height of the living person, and what can it not?",
    category: "biography",
    subcategory: "Surviving physical remains",
    eventType: "historical",
    evidenceStatus: "disputed",
    remainsLocation: "Bristol, England; exhumed and reinterred",
    tags: ["tallest-humans", "bristol", "exhumation", "advertised-height", "physical-remains", "consent"],
    people: ["Patrick Cotter O'Brien"],
    locationName: "Bristol, England",
    claims: [
      {
        sourceKey: null,
        startYear: 1760,
        endYear: 1806,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "His life",
        originalDateText: "About 1760 - 1806",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth in Ireland and death at Clifton, Bristol.",
        notes: "NEEDS SOURCE VERIFICATION for both, and particularly the birth year.",
      },
      {
        sourceKey: null,
        startYear: 1906,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "absolute_date",
        whatIsDated: "The first exhumation and examination",
        originalDateText: "Examined on exhumation, reported as 1906",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: an occasion on which his remains were physically examined, a century after " +
          "burial. WHY IT IS ON THE TIMELINE SEPARATELY FROM THE SECOND: because two examinations are two " +
          "pieces of evidence, and collapsing them would hide whether they agreed.",
        notes:
          "NEEDS SOURCE VERIFICATION, urgently. Neither the date nor the findings have been read here. " +
          "Bristol Archives and contemporary medical journals are the places to look.",
      },
      {
        sourceKey: null,
        startYear: 1972,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "absolute_date",
        whatIsDated: "The second exhumation and examination",
        originalDateText: "Examined again on exhumation, reported as 1972",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: a second physical examination, sixty-six years after the first. WHY BOTH MATTER: " +
          "a twentieth-century examination is likely to have been better recorded than an Edwardian one, " +
          "and whether the two agreed is a question this record exists to make askable.",
        notes: "NEEDS SOURCE VERIFICATION for the date, the examiners and the findings.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Height as advertised during his exhibition",
        valueCm: 262,
        originalValueText: "Advertised at about 8 ft 7 in",
        measurementKind: "advertised_height",
        measurementMethod: "promotional",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 262 cm. WHO CLAIMED IT: the exhibition. WHAT IT IS EVIDENCE OF: the " +
          "advertising of exhibited giants around 1800, and of what was thought plausible enough to print. " +
          "KEPT, as Byrne's and Ella Ewing's are kept, because the gap between the bill and the bones is " +
          "the finding.",
        notes:
          "NEEDS SOURCE VERIFICATION against surviving handbills. The figure is the one usually quoted and " +
          "has not been read off a document here.",
      },
      {
        sourceKey: null,
        whatIsMeasured: "Height indicated by the examinations of his remains",
        valueAbsentReason:
          "This dataset has not read the 1906 or 1972 reports. Figures in the region of 7 ft 10 in to 8 ft " +
          "1 in are associated with them, but what was measured, whether the skeleton was articulated, and " +
          "what allowance was made for soft tissue are all unknown here. Entering a number would " +
          "manufacture the appearance of a physical measurement out of a recollection of one.",
        originalValueText: "Reported lower than the advertised figure; the reports have not been read here",
        measurementKind: "skeletal_height",
        measurementMethod: "osteological",
        evidenceStatus: "unresolved",
        directlyMeasured: true,
        evidence:
          "WHAT IS KNOWN: that his remains were examined twice and that the resulting figures are lower " +
          "than the advertisement. WHAT IS NOT KNOWN HERE: the figures, the method, or whether the two " +
          "examinations agreed with each other. WHY THE CLAIM EXISTS WITH NO VALUE: because the " +
          "measurement was genuinely taken, twice, by people whose reports survive somewhere — the gap is " +
          "in this dataset, not in the historical record, and saying so is what tells a researcher where " +
          "to go.",
        notes:
          "NEEDS SOURCE VERIFICATION. This is the most valuable unread source in the dataset: a physical " +
          "check on an advertised giant's height, performed twice, with reports that exist.",
      },
    ],
  },

  {
    slug: "jane-bunford",
    title: "Jane Bunford, and why her skeleton is shorter than she was",
    summary:
      "1895-1922. Birmingham. Severe scoliosis meant her mounted skeleton measures well under her living stature — a textbook case of two figures for one woman.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person whose record makes the same point as John Carroll's, from the " +
      "other direction: here the skeleton survives, and the skeleton is the SHORTER figure.\n\n" +
      "THE LIFE. Born at Bartley Green near Birmingham. A head injury in adolescence is reported to have " +
      "triggered pituitary overgrowth; she developed severe spinal curvature and died at twenty-six.\n\n" +
      "THE TWO FIGURES, AND WHY BOTH ARE RIGHT. Her living stature is usually given at around 241 cm. Her " +
      "mounted skeleton, preserved for decades at the University of Birmingham, is reported at around " +
      "223.5 cm. The difference is not an error and not a dispute. It is the ordinary consequence of two " +
      "things at once: a mounted skeleton lacks cartilage, discs and soft tissue, AND her spine was " +
      "severely curved, so a standing measurement taken in life was itself shorter than her skeletal length " +
      "would suggest if straightened. Three quantities, not one — living standing height, mounted skeletal " +
      "height, and a hypothetical straightened height that nobody has cause to state.\n\n" +
      "THE PROVENANCE QUESTION. Her remains were held by a university anatomy collection for a long period, " +
      "and there has been subsequent controversy about their handling and whereabouts. This record notes " +
      "that neutrally and does not adjudicate it. What it does do is refuse to state a present location it " +
      "cannot verify, because asserting where a named woman's remains are today is not something to do " +
      "from memory.\n\n" +
      "THINGS TO ASK: If a skeleton is shorter than the person AND the person was bent, which figure " +
      "belongs in a list of the tallest people? Is there a right answer, or only a stated one?",
    category: "biography",
    subcategory: "Surviving physical remains",
    eventType: "historical",
    evidenceStatus: "disputed",
    tags: ["tallest-humans", "gigantism", "scoliosis", "birmingham", "physical-remains", "provenance"],
    people: ["Jane Bunford"],
    locationName: "Bartley Green, Birmingham, England",
    claims: [
      {
        sourceKey: null,
        startYear: 1895,
        endYear: 1922,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "Her life",
        originalDateText: "1895 - 1922",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth and death. She died at twenty-six.",
        notes: "NEEDS SOURCE VERIFICATION against English civil records.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Living stature as usually reported",
        valueCm: 241,
        originalValueText: "About 7 ft 11 in",
        measurementKind: "standing_height_living",
        measurementMethod: "unstated",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 241 cm in life. HOW IT RELATES TO THE SKELETON BELOW: it is the LARGER " +
          "figure, which is the normal relationship and the opposite of what people expect when they hear " +
          "that a skeleton survives. WHAT IS MISSING: the measuring occasion.",
        notes: "NEEDS SOURCE VERIFICATION for who measured her and when.",
      },
      {
        sourceKey: null,
        whatIsMeasured: "The mounted skeleton, as preserved at Birmingham",
        valueCm: 223.5,
        originalValueText: "About 7 ft 4 in as mounted",
        measurementKind: "skeletal_height",
        measurementMethod: "mounted_skeleton",
        evidenceStatus: "strongly_documented",
        directlyMeasured: true,
        evidence:
          "WHAT IS MEASURED: articulated bones, as assembled and held in a university anatomy collection. " +
          "WHY IT IS SHORTER THAN SHE WAS: cartilage, intervertebral discs and soft tissue are gone, and " +
          "how a mount is assembled changes the result. THE FIGURE IS NOT A CORRECTION OF THE ONE ABOVE. " +
          "It is a different quantity, and a list that swapped one for the other would move her several " +
          "places without anybody noticing.",
        notes:
          "NEEDS SOURCE VERIFICATION for the figure and for the present whereabouts of the skeleton, which " +
          "this record deliberately does not assert. University of Birmingham collections and the Cadbury " +
          "Research Library are where to ask.",
      },
    ],
  },

  {
    slug: "adam-rainer",
    title: "Adam Rainer, the only person recorded as both",
    summary:
      "1899-1950. Austria. Rejected from military service for being too short, then grew past two metres. The one case where the same man appears in the medical literature as a dwarf and as a giant.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person, and the strongest medical case in the dataset after Wadlow — " +
      "for a different reason. Wadlow was measured well. Rainer was measured for a reason that had nothing " +
      "to do with his height being interesting.\n\n" +
      "WHAT HAPPENED. As a young man he was unusually short. He presented for military service during the " +
      "First World War and was rejected as too small — twice, on separate occasions, which is why there are " +
      "two independent measurements of him taken by people with no interest in the answer. In his " +
      "twenties a pituitary tumour began producing excess growth hormone and he grew, substantially and " +
      "for the rest of his life, ending well over two metres.\n\n" +
      "WHY THE MILITARY RECORDS MATTER MORE THAN THE FAMOUS FIGURES. A conscription board measuring a " +
      "recruit is doing paperwork. It has no stake in whether he is remarkable, it applies a stated " +
      "procedure, and it writes the number down for an unrelated purpose. That is a better class of " +
      "evidence than almost anything else in this dataset, and it exists here only by accident.\n\n" +
      "WHY HE IS A HARD CASE FOR A LIST. He has no height. He has a trajectory. Any single figure for Adam " +
      "Rainer is a figure for a particular year, and a list that ranks him by his final measurement is " +
      "ranking a man who spent most of his life far shorter than that — while a list that ranks him by his " +
      "military measurement is ranking a man who later towered over it. Both are him.\n\n" +
      "ON THE SPECIFIC NUMBERS BELOW. The pattern is well established and the figures are not, in this " +
      "dataset. They are recorded as reported and flagged, because the medical literature that would fix " +
      "them has not been read here.\n\n" +
      "THINGS TO ASK: If a measurement was taken for a reason unconnected to the thing being measured, why " +
      "is that better evidence? What would you put in a list, for a man whose height changed by most of a " +
      "metre?",
    category: "biography",
    subcategory: "Documented stature",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["tallest-humans", "acromegaly", "austria", "medical-record", "growth-trajectory"],
    people: ["Adam Rainer"],
    locationName: "Graz, Austria",
    claims: [
      {
        sourceKey: null,
        startYear: 1899,
        endYear: 1950,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "His life",
        originalDateText: "About 1899 - 1950",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth and death, from secondary accounts.",
        notes: "NEEDS SOURCE VERIFICATION against Austrian civil records.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Standing height at military examination, as a young man",
        valueAbsentReason:
          "This dataset has not read the conscription records or the medical literature reporting them. " +
          "Figures well under 1.5 m circulate for his examinations around 1917-1918. No value is entered, " +
          "because the whole point of this measurement is that it was taken carefully by a disinterested " +
          "party, and a number taken from general knowledge would have exactly the property the record is " +
          "praising the original for lacking.",
        originalValueText: "Rejected as too short at military examination; figure not obtained here",
        measurementKind: "standing_height_living",
        measurementMethod: "official_records_body",
        evidenceStatus: "unresolved",
        directlyMeasured: true,
        evidence:
          "WHAT IS KNOWN: that he was measured at least twice by a conscription board and rejected as too " +
          "small. WHY THAT IS THE BEST EVIDENCE ABOUT HIM: the board had no interest in the answer and " +
          "wrote it down for an unrelated purpose. WHAT IS NOT KNOWN HERE: the figures.",
        notes:
          "NEEDS SOURCE VERIFICATION. Austrian military records and the case reports in the endocrinology " +
          "literature would close this, and it is worth closing: a disinterested measurement of a person " +
          "later famous for their height is a rare thing.",
      },
      {
        sourceKey: null,
        whatIsMeasured: "Standing height at or near the end of his life",
        valueCm: 234,
        originalValueText: "Reported at about 2.34 m at death",
        measurementKind: "standing_height_living",
        measurementMethod: "medical_examination",
        evidenceStatus: "strongly_documented",
        directlyMeasured: true,
        evidence:
          "WHAT IS CLAIMED: about 234 cm. THE IMPORTANT THING IS NOT THE NUMBER BUT THE DIFFERENCE between " +
          "it and the figure above: he grew by something in the order of a metre after the age at which " +
          "growth normally stops. WHY HE CANNOT SENSIBLY BE RANKED: this figure describes the last years of " +
          "a life spent mostly at a very different height.",
        notes:
          "NEEDS SOURCE VERIFICATION for the figure and for who took it. Reported values for his final " +
          "height vary between accounts.",
      },
    ],
  },

  {
    slug: "trijntje-keever",
    title: "Trijntje Keever, who died two centuries before photography",
    summary:
      "1616-1633. Edam. Reported at about 2.54 m at seventeen. No photograph of her can exist, which makes her the record that fixes a rule for the whole dataset.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person, and a hard logical boundary that the rest of the dataset can " +
      "be checked against.\n\n" +
      "SHE DIED IN 1633. Photography was not invented for another two centuries. Therefore NO PHOTOGRAPH OF " +
      "TRIJNTJE KEEVER EXISTS OR CAN EXIST. Any image presented as one is, with certainty and without " +
      "needing to be examined, something else: a painting, an engraving, a later illustration, or a " +
      "fabrication. That is not a judgement about any particular picture. It is arithmetic.\n\n" +
      "WHY THAT IS WORTH A RECORD OF ITS OWN. Because it gives the dataset one case where the media " +
      "question has a certain answer, and a rule that generalises: for anybody who died before roughly the " +
      "1840s, a photograph is impossible, and for anybody who died in the decades after, it is a claim " +
      "requiring evidence rather than an assumption. A collection that cannot apply that test to its own " +
      "pictures is not an evidence archive.\n\n" +
      "WHAT DOES SURVIVE. She was known as de Groote Meid, the Big Girl, was exhibited in her lifetime, and " +
      "died at seventeen. A painted portrait is associated with her, and objects connected to her are " +
      "reported. Those are real categories of evidence with real limitations — a painter works to a " +
      "commission and to a convention, and a portrait that flatters a subject's size is doing its job.\n\n" +
      "THE HEIGHT. About 2.54 m is the figure usually given, which would make her the tallest woman in this " +
      "dataset by a considerable margin. It rests on seventeenth-century report and on nothing this dataset " +
      "has been able to check. That is not a reason to leave her out; it is a reason to say so.\n\n" +
      "THINGS TO ASK: What could establish the height of somebody who died in 1633? If a painting is the " +
      "only image, what is it evidence of?",
    category: "biography",
    subcategory: "Before photography",
    eventType: "historical",
    evidenceStatus: "historical_report_remains_lost",
    tags: ["tallest-humans", "netherlands", "pre-photographic", "portrait", "advertised-height"],
    people: ["Trijntje Keever"],
    locationName: "Edam, Netherlands",
    claims: [
      {
        sourceKey: null,
        startYear: 1616,
        endYear: 1633,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Her life",
        originalDateText: "About 1616 - 1633; she died at seventeen",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: birth and death. WHY IT MATTERS BEYOND HER: the death date is what makes a " +
          "photograph of her impossible, which is the rule this record exists to fix.",
        notes: "NEEDS SOURCE VERIFICATION against Dutch parish records, which for Edam may well survive.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Height as reported in her lifetime",
        valueCm: 254,
        originalValueText: "About 2.54 m, reported at seventeen",
        measurementKind: "reported_unspecified",
        measurementMethod: "press_report",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 254 cm. WHAT SUPPORTS IT: seventeenth-century report, in a context where " +
          "she was being exhibited. WHAT DOES NOT SUPPORT IT: any surviving measurement, any remains, and " +
          "any document this dataset has read. IF TRUE she would be the tallest woman recorded anywhere — " +
          "which is exactly the kind of claim that should be held to a higher standard than it usually is, " +
          "and is not being held to one here for want of sources.",
        notes:
          "NEEDS SOURCE VERIFICATION. Dutch local archives at Edam are the place to look. Treat the figure " +
          "as a seventeenth-century assertion, not as a measurement.",
      },
    ],
  },

  {
    slug: "zeng-jinlian",
    title: "Zeng Jinlian",
    summary:
      "1964-1982. Hunan. 246.3 cm — the tallest woman reliably recorded — and, like John Carroll, she could not stand straight to be measured.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person, and a reminder that the measurement problem this dataset is " +
      "built around is not confined to the nineteenth century.\n\n" +
      "THE FIGURE. 246.3 cm, which is the tallest reliably recorded for any woman. It belongs to the modern " +
      "era of documented measurement rather than to the era of the playbill, and it is not seriously " +
      "disputed.\n\n" +
      "THE COMPLICATION, WHICH IS THE SAME ONE AS CARROLL'S. She had severe spinal curvature and could not " +
      "stand erect. A figure for somebody who cannot stand is not a standing height — it is a length, " +
      "obtained some other way, and the method matters enormously to what the number means. This dataset " +
      "does not know how hers was obtained and says so below rather than implying a stadiometer.\n\n" +
      "WHY SHE IS NOT FILED THE WAY CARROLL IS. Carroll's famous figure is explicitly a CORRECTION — a " +
      "reconstruction of a height he never stood at. Hers is presented as a measurement of her. Those are " +
      "different claims even when the underlying difficulty is the same, and flattening them would be its " +
      "own error.\n\n" +
      "SHE DIED AT SEVENTEEN, of illness, having begun growing in infancy. Like Wadlow and like Bunford, " +
      "she is a record of a life cut short by the same condition that made it remarkable, and the dataset " +
      "should not lose that behind the number.\n\n" +
      "THINGS TO ASK: How would you measure somebody who cannot stand? Does the answer change what the " +
      "figure can be compared with?",
    category: "biography",
    subcategory: "Documented stature",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["tallest-humans", "gigantism", "china", "scoliosis", "tallest-woman"],
    people: ["Zeng Jinlian"],
    locationName: "Yujiang village, Hunan, China",
    claims: [
      {
        sourceKey: null,
        startYear: 1964,
        endYear: 1982,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "Her life",
        originalDateText: "1964 - 1982",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth and death. She died at seventeen.",
        notes: "NEEDS SOURCE VERIFICATION against Chinese records.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Height as recorded, by a method this dataset has not established",
        valueCm: 246.3,
        originalValueText: "246.3 cm (8 ft 1 in)",
        measurementKind: "reported_unspecified",
        measurementMethod: "unstated",
        evidenceStatus: "strongly_documented",
        directlyMeasured: true,
        evidence:
          "WHAT IS CLAIMED: 246.3 cm, the tallest reliably recorded figure for a woman. WHY IT IS FILED AS " +
          "METHOD-UNSTATED RATHER THAN AS A STANDING HEIGHT: because she could not stand erect, so whatever " +
          "was done, it was not a stadiometer reading, and calling it one would assert something this " +
          "dataset does not know. THE FIGURE IS NOT IN DOUBT. The method is.",
        notes:
          "NEEDS SOURCE VERIFICATION for how and when the measurement was taken. The precision of the " +
          "figure — a tenth of a centimetre — implies a careful procedure, which is a further reason to " +
          "want the procedure named rather than assumed.",
      },
    ],
  },

  {
    slug: "fyodor-makhnov",
    title: "Fyodor Makhnov, and a thirty-centimetre disagreement",
    summary:
      "1878-1912. Reported anywhere between about 239 cm and 285 cm. The spread between the claims is larger than the difference between most people in this dataset.",
    description:
      "WHAT KIND OF RECORD IS THIS? A person whose record is mostly a record of how badly heights can be " +
      "reported.\n\n" +
      "THE PROBLEM. Figures given for Makhnov range from the high two-thirties to around 285 cm. That " +
      "spread — something like thirty centimetres — is bigger than the gap between Robert Wadlow and John " +
      "Carroll. Whatever else is true, most of the numbers in circulation for him are wrong, and there is " +
      "no basis in this dataset for choosing among them.\n\n" +
      "WHY THE HIGH FIGURE SHOULD BE TREATED WITH PARTICULAR CARE. 285 cm would make him by a wide margin " +
      "the tallest human ever recorded, comfortably beyond Wadlow, whose 272 cm rests on years of " +
      "physicians' measurements. An extraordinary figure resting on publicity material is not a rival to a " +
      "well-documented one; it is a different kind of statement, and the dataset records it as such rather " +
      "than either printing it or deleting it.\n\n" +
      "WHAT WOULD SETTLE IT. Original Russian and Belarusian material: press of the period, any medical " +
      "examination, and the circumstances of his burial. His name appears in several transliterations, " +
      "which is itself part of why the record is a mess — the same man is searched for under half a dozen " +
      "spellings and the results do not meet.\n\n" +
      "WHY HE IS IN THE DATASET AT ALL. Because leaving out the badly-evidenced cases would make the " +
      "collection look far tidier than the subject is. A reader should be able to see that some famous " +
      "heights are supported and some are not, and the way to show that is to include both and say which " +
      "is which.\n\n" +
      "THINGS TO ASK: When several figures for one person differ by a foot, what does that tell you about " +
      "all of them? Which would you believe, and what would change your mind?",
    category: "biography",
    subcategory: "Contested figures",
    eventType: "disputed",
    evidenceStatus: "disputed",
    tags: ["tallest-humans", "belarus", "contested", "advertised-height", "transliteration"],
    people: ["Fyodor Makhnov"],
    locationName: "Vitebsk region, present-day Belarus",
    claims: [
      {
        sourceKey: null,
        startYear: 1878,
        endYear: 1912,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "His life",
        originalDateText: "About 1878 - 1912",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "WHAT IS DATED: birth and death, from secondary accounts.",
        notes:
          "NEEDS SOURCE VERIFICATION. His name is transliterated variously — Makhnov, Machnow, Makhnow — " +
          "which fragments the record and is worth noting for anybody searching.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Height as claimed in publicity material",
        valueCm: 285,
        originalValueText: "About 285 cm, in promotional and popular accounts",
        measurementKind: "advertised_height",
        measurementMethod: "promotional",
        evidenceStatus: "disputed",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 285 cm. WHAT THAT WOULD MEAN: comfortably the tallest human ever " +
          "recorded, well beyond Wadlow's medically documented 272 cm. WHO CLAIMED IT: publicity. WHY IT IS " +
          "RECORDED AND NOT PRINTED AS HIS HEIGHT: an extraordinary figure resting on promotional material " +
          "does not compete with a well-documented one — it belongs in a different column, and this is that " +
          "column.",
        notes:
          "NEEDS SOURCE VERIFICATION against period Russian and Belarusian sources. Do not promote this " +
          "figure out of the advertised category without a measuring occasion.",
      },
      {
        sourceKey: null,
        whatIsMeasured: "Height in the lower accounts",
        valueCm: 239,
        originalValueText: "About 239 cm in more conservative accounts",
        measurementKind: "reported_unspecified",
        measurementMethod: "unstated",
        evidenceStatus: "disputed",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: about 239 cm. WHY BOTH ENDS ARE RECORDED: the SPREAD is the finding. Thirty " +
          "centimetres of disagreement about one man means the reporting is unreliable at both ends, and a " +
          "reader shown only the midpoint would be shown a number nobody actually claims.",
        notes: "NEEDS SOURCE VERIFICATION. Neither end of the range has been traced to a document here.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// DISPUTED AND FABRICATED REMAINS
//
// A separate section, and separate for a reason. These records are NOT weaker
// versions of the ones above. They are records about a different thing: what
// was claimed, who claimed it, and what can be established now.
//
// The rule the brief set and this file keeps: do not automatically reject
// them, and do not present them as fact. An 1869 newspaper is real evidence
// that a claim was made. It is not evidence that a body measured anything. A
// demonstrated hoax stays on the record with its demonstration attached,
// because deleting hoaxes is how they get rediscovered.
// ---------------------------------------------------------------------------

export const TALLEST_HUMANS_DISPUTED: SeedEvent[] = [
  {
    slug: "cardiff-giant",
    title: "The Cardiff Giant",
    summary:
      "Unearthed in New York in 1869 and exhibited as a petrified ten-foot man. Carved from gypsum the year before, on purpose, by a man who had lost an argument about Genesis.",
    description:
      "WHAT KIND OF RECORD IS THIS? A known hoax, with the object still in a museum — which makes it the best " +
      "possible teaching case, because everything about it can be checked.\n\n" +
      "WHAT HAPPENED. In October 1869 workers digging a well behind William Newell's barn at Cardiff, in " +
      "central New York, uncovered a human figure about ten feet long. It was exhibited for money almost " +
      "immediately and drew large paying crowds. Within weeks it was being argued about in print as a " +
      "petrified antediluvian man — which is to say, as physical proof of the giants of Genesis 6:4.\n\n" +
      "WHAT IT ACTUALLY WAS. A carving. George Hull, a New York tobacconist, had it cut from a block of " +
      "gypsum quarried at Fort Dodge, Iowa, worked by a stonecutter in Chicago, shipped east and buried " +
      "behind the barn in November 1868 to be dug up nearly a year later. Hull is reported to have " +
      "conceived it after an argument with a preacher about whether the giants of Genesis were literal. He " +
      "confessed before the end of 1869.\n\n" +
      "WHY IT IS FILED AS A KNOWN HOAX AND NOT AS A DISPUTE. Because there is nothing left to dispute: the " +
      "maker named himself, the quarry is known, the stonecutter is known, and the object survives and can " +
      "be examined. This is the strongest evidential position any record in this dataset occupies, and it " +
      "happens to belong to a fake.\n\n" +
      "THE DETAIL WORTH KEEPING. Scientists who looked at it said so at once — the Yale palaeontologist " +
      "Othniel Marsh is reported to have called it a decided humbug — and it went on selling tickets " +
      "anyway. P. T. Barnum, unable to buy it, had a copy made and exhibited that. So the record also " +
      "documents something true about evidence: expert dismissal, promptly given, did not slow it down.\n\n" +
      "THE MEASUREMENT BELOW IS NOT A HEIGHT. It is the length of a piece of carved stone. It is recorded " +
      "with a measurement kind that says so, and the scale chart will not draw it beside a person.\n\n" +
      "THINGS TO ASK: If the experts were right immediately and it made money anyway, what was the " +
      "audience actually buying? Why is a confessed hoax better documented than most real remains?",
    category: "archaeology",
    subcategory: "Fabricated remains",
    eventType: "disputed",
    evidenceStatus: "known_hoax",
    remainsLocation: "The Farmers' Museum, Cooperstown, New York",
    tags: ["tallest-humans", "disputed", "hoax", "cardiff-giant", "new-york", "genesis"],
    people: ["George Hull"],
    locationName: "Cardiff, New York, United States",
    claims: [
      {
        sourceKey: null,
        startYear: 1869,
        startMonth: 10,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "When it was dug up and exhibited",
        originalDateText: "Unearthed 16 October 1869 at Cardiff, New York",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the discovery, which was staged. WHY THE DATE IS SECURE: the exhibition, the " +
          "newspaper coverage and the subsequent legal and journalistic wrangling are all contemporary and " +
          "abundant. A hoax that draws crowds documents itself.",
        notes: "NEEDS SOURCE VERIFICATION for the exact day against contemporary newspapers.",
      },
      {
        sourceKey: null,
        startYear: 1868,
        startMonth: 11,
        datePrecision: "month",
        isApproximate: true,
        temporalClaimType: "absolute_date",
        whatIsDated: "When it was carved and buried",
        originalDateText: "Buried behind the barn about November 1868, eleven months before discovery",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the manufacture. THIS IS THE CLAIM THAT SETTLES IT — a burial date preceding the " +
          "discovery by under a year, established from Hull's own account and from the quarry and " +
          "stonecutting trail. TWO DATES ON ONE OBJECT, eleven months apart, is what a fabrication looks " +
          "like in a timeline.",
        notes:
          "NEEDS SOURCE VERIFICATION for the burial month and for the names of the quarry and the " +
          "stonecutter, which are given here from general knowledge.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Length of the carved figure",
        valueCm: 305,
        originalValueText: "About ten feet long",
        measurementKind: "fabricated_object",
        measurementMethod: "unstated",
        evidenceStatus: "known_hoax",
        directlyMeasured: true,
        evidence:
          "WHAT IS MEASURED: a block of carved gypsum, which exists, is held at a museum and can be " +
          "measured again by anybody who asks. WHAT IS NOT MEASURED: a person. There was never a body. " +
          "THIS IS WHY THE MEASUREMENT KIND MATTERS: the figure is real, careful and checkable, and it is " +
          "not a statement about human stature. A chart that plots it beside Robert Wadlow would be showing " +
          "a man and a rock.",
        notes:
          "NEEDS SOURCE VERIFICATION for the museum's own dimensions. The value here is the commonly " +
          "reported figure and should be replaced with the catalogue measurement.",
      },
    ],
  },

  {
    slug: "viral-giant-skeleton-images",
    title: "The viral giant skeleton photographs",
    summary:
      "The most widely circulated 'giant skeleton' pictures come from a photo-manipulation contest. At least one was built on a real excavation photograph, which is why it works.",
    description:
      "WHAT KIND OF RECORD IS THIS? A record about images rather than about remains — and the brief asked " +
      "for it specifically, because these pictures are how most people encounter this subject.\n\n" +
      "WHERE THEY COME FROM. A set of enormously circulated images showing archaeologists crouched beside " +
      "gigantic human skeletons in open trenches originate in photo-manipulation contests run by the site " +
      "Worth1000 in the early 2000s, on themes such as archaeological anomalies. They were made as digital " +
      "artwork, entered into a competition, and credited. They were never presented by their makers as " +
      "photographs of anything.\n\n" +
      "WHY THEY ARE SO CONVINCING, WHICH IS THE POINT. Because at least one of the best-known entries was " +
      "composited onto a REAL excavation photograph — a mastodon dig — so the trench, the soil, the light " +
      "and the posture of the people in it are all genuine. The only false element is the skeleton. That " +
      "is a far more effective deception than a picture drawn from nothing, and it is the reason these " +
      "images survive every debunking: everything a viewer checks looks right, because most of it is.\n\n" +
      "HOW THEY TRAVEL. The same image reappears captioned to India, Saudi Arabia, Greece and half a dozen " +
      "other places, with a new discovery date each time. A picture that is claimed for four countries in " +
      "five years is telling you something about its provenance before you examine a single pixel.\n\n" +
      "WHY THIS RECORD KEEPS THEM RATHER THAN DELETING THEM. Because a reader who has seen these images — " +
      "and most have — is not helped by their absence. They are helped by seeing the original beside the " +
      "altered version, with the alteration named. Deleting the image leaves the claim in circulation and " +
      "removes the answer to it.\n\n" +
      "IMAGES NOT YET ATTACHED. This dataset has not been able to reach the web to retrieve either the " +
      "contest entries or the underlying excavation photograph, and it will not guess at URLs. The record " +
      "exists so the pair can be attached when somebody can fetch them, and the media slots below are " +
      "deliberately empty rather than filled with something plausible.\n\n" +
      "THINGS TO ASK: Which parts of one of these pictures are real? If most of an image is authentic, " +
      "what exactly is the forgery? What would you check first?",
    category: "archaeology",
    subcategory: "Fabricated remains",
    eventType: "disputed",
    evidenceStatus: "known_hoax",
    tags: ["tallest-humans", "disputed", "manipulated-image", "viral", "photo-forensics"],
    locationName: "Internet",
    claims: [
      {
        sourceKey: null,
        startYear: 2002,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        endYear: 2008,
        whatIsDated: "When the images were made and began circulating",
        originalDateText: "Made for photo-manipulation contests in the early 2000s; circulating as news ever since",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the manufacture of the images and the beginning of their second life as purported " +
          "news photographs. WHY A RANGE: the contests ran over several years and the images have no single " +
          "release date. WHAT THIS ESTABLISHES: that every 'newly discovered giant skeleton' photograph " +
          "matching these compositions postdates its own supposed discovery.",
        notes:
          "NEEDS SOURCE VERIFICATION for the contest names, dates and the handle of the artist behind the " +
          "most-circulated entry, all given here from general knowledge. This record should not name an " +
          "individual until that is checked.",
      },
    ],
    measurements: [
      {
        sourceKey: null,
        whatIsMeasured: "Length of the skeleton as depicted",
        valueAbsentReason:
          "There is no object to measure. The skeleton exists only as pixels, and any figure derived from " +
          "the image would be a measurement of a composition decision. Captions accompanying these pictures " +
          "have claimed anything from eight to eighty feet, which is itself evidence that no measurement " +
          "underlies them.",
        originalValueText: "Claimed figures vary wildly between captions of the same image",
        measurementKind: "fabricated_object",
        measurementMethod: "unstated",
        evidenceStatus: "known_hoax",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: a range of enormous heights, differing between versions of the SAME PICTURE. " +
          "WHY THAT IS THE most useful fact here: when one image carries several incompatible measurements, " +
          "the measurements are not observations of anything. They are captions. NO VALUE IS ENTERED, " +
          "because entering one would imply something was measured.",
        notes: "Nothing to verify. There is no object.",
      },
    ],
  },

  {
    slug: "smithsonian-giant-skeletons-claim",
    title: "The claim that the Smithsonian destroyed giant skeletons",
    summary:
      "A widely shared story about a court ordering the release of suppressed giant skeletons. There was no case, and the story began on a site that publishes invented news.",
    description:
      "WHAT KIND OF RECORD IS THIS? A claim about a cover-up, recorded because it is repeated constantly " +
      "and because the honest answer to it is more interesting than a flat denial.\n\n" +
      "THE STORY. That the Smithsonian Institution destroyed thousands of oversized human skeletons in the " +
      "early twentieth century to protect orthodox chronology, and that a court case forced this into the " +
      "open. It circulates with dates, figures and the appearance of legal detail.\n\n" +
      "WHERE IT CAME FROM. The best-known version originated on a website that publishes fabricated news " +
      "stories as entertainment. There was no such case. The detail that makes it persuasive — a court, a " +
      "ruling, a compelled disclosure — is the part that was invented, because it is the part that sounds " +
      "checkable.\n\n" +
      "THE PART THAT IS NOT NONSENSE, AND MUST NOT BE THROWN OUT WITH IT. Nineteenth-century American " +
      "antiquarian and newspaper literature genuinely does contain many reports of very large skeletons " +
      "found in mounds, and some were genuinely sent to institutions, and a great many of those remains " +
      "genuinely cannot now be located. That is real, and it has real explanations — poor cataloguing, " +
      "casual collecting, loss, reburial, and the fact that a bone reported as enormous by a farmer in 1885 " +
      "may never have been measured by anybody. A reader who is told only 'the cover-up story is fake' has " +
      "been given a true statement and no understanding.\n\n" +
      "SO THE RECORD SPLITS THE CLAIM. The court case: fabricated. The suppression: unevidenced. The " +
      "missing remains: partly real, and explained by ordinary institutional history rather than by " +
      "conspiracy. Those are three different findings and they get three different answers.\n\n" +
      "THINGS TO ASK: Why does an invented legal detail make a story more believable? What would a real " +
      "record of a nineteenth-century mound excavation look like, and where would you look for one?",
    category: "archaeology",
    subcategory: "Disputed reports",
    eventType: "disputed",
    evidenceStatus: "known_hoax",
    tags: ["tallest-humans", "disputed", "smithsonian", "mound-builders", "fabricated-news"],
    locationName: "United States",
    claims: [
      {
        sourceKey: null,
        startYear: 2014,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "When the court-case version of the story appeared",
        originalDateText: "Circulated from about 2014 as a news story; no case exists",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the appearance of the fabricated article, not any event it describes. WHY THAT IS " +
          "the right thing to date: the story has a real origin and a real date, and they belong to the " +
          "twenty-first century rather than the twentieth. WHAT IT ESTABLISHES: that the legal detail " +
          "postdates every version of the giant-skeleton literature it claims to vindicate.",
        notes:
          "NEEDS SOURCE VERIFICATION for the publication date and the site, given here from general " +
          "knowledge. The finding — that no such case exists — should be checkable against court records " +
          "by anybody with access to them.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether large skeletal remains reported in the nineteenth century are unaccounted for",
        originalDateText: "Many nineteenth-century reported finds cannot now be located; this is undated and real",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that a substantial number of remains reported from American mound excavations " +
          "in the nineteenth century cannot now be traced. WHY THIS CLAIM IS SEPARATED FROM THE ONE ABOVE: " +
          "because it is probably TRUE, and lumping it in with the fabricated court case would let a real " +
          "problem be dismissed along with an invented one. WHAT EXPLAINS IT WITHOUT CONSPIRACY: casual " +
          "collecting, poor or absent cataloguing, loss, sale, reburial, and reports that never rested on a " +
          "measurement in the first place. WHY IT CARRIES NO DATE: it is a statement about a condition of " +
          "the record, not about an event.",
        notes:
          "NEEDS SOURCE VERIFICATION throughout, and this is the half of the record worth someone's time. " +
          "Work on the history of American mound archaeology and its collecting practices would replace " +
          "this general statement with something specific.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// THE SHAPE THE SCALE CHART READS.
//
// Built from the seed rather than from the database on purpose. The chart is a
// view of THIS DATASET — a fixed set of people whose measurements are the
// argument the dataset makes — and not of whatever a community has since
// edited. The database copy exists so the records can be read, linked and
// corrected like any other; the chart is the dataset's own illustration of
// itself, and it should not silently change shape because somebody added a
// record to their timeline.
// ---------------------------------------------------------------------------

export function tallestHumansScalePeople() {
  // Disputed and fabricated records are included on purpose. They carry no
  // plottable body measurement, so they appear in the filters and in the
  // detail panel without ever getting a bar — which is the honest rendering:
  // present in the evidence record, absent from the chart of human stature.
  return [...TALLEST_HUMANS_EVENTS, ...TALLEST_HUMANS_DISPUTED].map((event) => ({
    slug: event.slug,
    title: event.title,
    summary: event.summary,
    evidenceStatus: event.evidenceStatus,
    remainsLocation: event.remainsLocation,
    accessionNumber: event.accessionNumber,
    hasPhotograph: (event.media ?? []).some((m) => m.shows === "evidence_photograph"),
    hasRemainsPhotograph: (event.media ?? []).some((m) => m.depictsActualRemains === true),
    measurements: (event.measurements ?? []).map((m) => ({
      whatIsMeasured: m.whatIsMeasured,
      valueCm: m.valueCm,
      valueAbsentReason: m.valueAbsentReason,
      valueLowCm: m.valueLowCm,
      valueHighCm: m.valueHighCm,
      originalValueText: m.originalValueText,
      measurementKind: m.measurementKind,
      measurementMethod: m.measurementMethod,
      evidenceStatus: m.evidenceStatus,
      directlyMeasured: m.directlyMeasured,
      measuredOn: m.measuredOn,
      measuredBy: m.measuredBy,
      evidence: m.evidence,
      notes: m.notes,
    })),
  }));
}
