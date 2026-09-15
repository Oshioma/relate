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

import type { SeedEvent, SeedSource } from "./seed-types";

export const TALLEST_HUMANS_ANCHOR_SLUG = "tallest-humans-evidence-record";

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
];
