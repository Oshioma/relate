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

// THE SECOND SET OF COMMONS HELPERS, AND WHY THERE ARE TWO.
//
// The pair above interpolate a file name straight into a URL and add a width.
// That is fine for the names they were written for and wrong for the names
// below, which contain spaces, quotation marks, apostrophes and commas — a
// name interpolated raw makes a URL that mostly works and occasionally does
// not, and "occasionally" is the worst possible failure rate for a link.
//
// These encode the name the way Commons itself does, and `commonsOriginal`
// omits the width parameter on purpose: a width makes a RENDERING of the file,
// and the brief for these images asked for the original. Both are kept, in
// separate fields, because having the picture and having it at the resolution
// it exists in are two different claims.
const commonsName = (file: string) => encodeURIComponent(file).replace(/%20/g, "_");
const commonsOriginal = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${commonsName(file)}`;
const commonsSized = (file: string, width: number) => `${commonsOriginal(file)}?width=${width}`;
const commonsFilePage = (file: string) => `https://commons.wikimedia.org/wiki/File:${commonsName(file)}`;

/**
 * ONE PLACE THAT BUILDS EVERY FIELD A COMMONS PICTURE SHARES.
 *
 * Five things always travel together and always in the same relationship: the
 * display URL, the original, the file page, the exact name, and the fact that
 * the licence has NOT been read here. Writing them out per picture invites the
 * one typo where the file page points at a different file from the image —
 * which is the single hardest provenance error to notice, because everything
 * on screen looks right.
 *
 * WHAT IT DELIBERATELY DOES NOT SET: `licence` and `credit`. Those come from
 * the file's own page at seed time via `creditFrom: "source"`, which reads the
 * per-file licence rather than assuming the category's. A licence typed into
 * this file would be a licence typed from memory.
 */
const fromCommons = (file: string, width = 1024) => ({
  fileName: file,
  url: commonsSized(file, width),
  originalFileUrl: commonsOriginal(file),
  sourcePageUrl: commonsFilePage(file),
  creditFrom: "source" as const,
});

export const TALLEST_HUMANS_SOURCES: SeedSource[] = [
  {
    key: "rcs_surgicat_byrne",
    title: "Articulated skeleton of Charles Byrne",
    workTitle: "SurgiCat, Royal College of Surgeons of England",
    reference: "Object number RCSHC/Osteo. 223; Hunterian Collection",
    url: "https://surgicat.rcseng.ac.uk/Details/collect/4123",
    sourceType: "museum_record",
    notes:
      "THE STRONGEST SINGLE PIECE OF EVIDENCE IN THIS DATASET, AND NOW READ. A catalogue record with an " +
      "accession number, which is what makes a claim about remains checkable by somebody who was not there. " +
      "WHAT READING IT PRODUCED, and it was not what was expected: the record does not give ONE measurement. " +
      "It preserves the College's own catalogues disagreeing with each other. Owen's catalogue of 1853 " +
      "records the skeleton at EIGHT FEET; Flower's of 1879 records it at 2310 mm, seven feet seven, and " +
      "says in terms that the earlier advertised heights 'are evidently exaggerations'; the modern online " +
      "description gives 2.35 m while also printing 7'7\", which are not the same number. Three figures for " +
      "one object from one institution across 170 years. Also cited for Flower's individual bone " +
      "measurements, for the display history (1813-2017), for the Trustees' 2020 decision, and for the " +
      "note that a boot and slipper he wore are preserved with the skeleton.",
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
    key: "bm_surprizing_irish_giant",
    title: "The surprizing Irish giant of St James's Street",
    reference: "British Museum 1868,0808.5425; the sheet is dated 1785",
    sourceType: "historical_document",
    notes:
      "A PRINTED ADVERTISEMENT, CITED AS ONE. Exhibition material for Cotter's London appearances, carrying " +
      "the claim that the giant measured about eight feet five inches. WHAT IT ESTABLISHES: that the figure " +
      "was in print in 1785, which is a real and datable fact about what was being claimed. WHAT IT DOES " +
      "NOT ESTABLISH: anything about his height. A showman's bill is a selling document, and the number on " +
      "it had a job to do. NEEDS SOURCE VERIFICATION for the sheet's own wording, which has not been read " +
      "here — the British Museum's collection record is the place to read it, and the environment this was " +
      "written in cannot reach it.",
  },
  {
    key: "morning_world_herald_1900_chart",
    title: "Giant comparison chart",
    workTitle: "Morning World-Herald",
    reference: "Sunday 13 May 1900",
    sourceType: "newspaper",
    notes:
      "A NEWSPAPER GRAPHIC PUTTING SEVERAL EXHIBITED GIANTS SIDE BY SIDE, each drawn at the height his or " +
      "her own publicity claimed. Cited as evidence of what was believed and printed in 1900, and cited for " +
      "nothing else: drawing advertised figures to scale does not measure them, it only makes them look " +
      "measured. No measurement claim in this dataset uses it.",
  },
  {
    key: "jstor_cardiff_controversy",
    title: "December Meeting. The \"Cardiff Giant\" Controversy",
    reference: "Scanned as an Internet Archive copy of JSTOR item 25079407; in the Commons Cardiff Giant category as a PDF",
    sourceType: "academic_paper",
    notes:
      "FILED AS A SOURCE RATHER THAN AS A PICTURE, which is the only correct place for it: it is a PDF of a " +
      "learned society's proceedings and the importer handles images. WHY IT MATTERS MORE THAN ANY " +
      "PHOTOGRAPH IN THE SET: it is a contemporary record of the argument itself — scholars meeting to " +
      "discuss whether the object was genuine — which is the part of the Cardiff Giant story that has " +
      "anything to teach. NEEDS SOURCE VERIFICATION: not read here, and the society, the date and the " +
      "author are all unknown to this record.",
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
      "FIVE FIGURES, AND THE INSTITUTION HOLDING THE BONES SUPPLIES FOUR OF THEM. The catalogue record has now " +
      "been read, and it does not settle his height. It preserves the disagreement. A Morning Herald " +
      "advertisement of 24 April 1782 sells him at eight feet two. The Annual Register, reporting his death, " +
      "gives a sequence ending at eight feet four AFTER he died — a corpse taller than the man, which should " +
      "stop any reader. Owen's College catalogue of 1853 measures the mounted skeleton at eight feet. Flower's " +
      "College catalogue of 1879 measures the same object at 2310 mm, seven feet seven, publishes every bone " +
      "length behind it, and says the earlier figures 'are evidently exaggerations'. The College's modern " +
      "description gives 2.35 m while printing 7'7\" in the same breath, which are not the same number.\n\n" +
      "SO THE INTERESTING GAP IS NOT BETWEEN THE POSTER AND THE BONES. It is between two catalogues of the " +
      "same institution, twenty-six years apart, differing by five inches on an object neither of them could " +
      "have lost. An accession number guarantees that a thing can be re-measured. It does not guarantee that " +
      "the measurements agree, and this dataset was built on a slightly rosier assumption than that.\n\n" +
      "A CORRECTION THIS RECORD OWES THE READER. It previously explained the gap by saying a mounted skeleton " +
      "is necessarily shorter than the living body, cartilage and discs being gone. Flower says his mount is " +
      "one 'in which due allowance appears to be given for the intervertebral substance'. The general rule is " +
      "sound; it does not apply here in the simple form this record asserted.\n\n" +
      "WHAT THE ACCESSION NUMBER BUYS. It is the difference between this record and almost every 'giant " +
      "skeleton' on the internet. The remains exist, are held somewhere nameable, have an unbroken " +
      "institutional history, and can be re-examined. That is not a stronger opinion; it is a different " +
      "category of evidence.\n\n" +
      "THE PART THAT IS NOT ABOUT MEASUREMENT. Byrne is reported to have asked to be buried at sea, " +
      "specifically to keep his body from the anatomists, and John Hunter obtained it anyway. The catalogue " +
      "says so itself, and adds that Hunter 'did not leave any direct record or description of Byrne's " +
      "skeleton'. It was displayed from 1813 until 2017; in 2020 the Trustees agreed it would not be shown " +
      "again but would be retained for research. The College's own record closes with the sentence " +
      "'Opinions differ as to whether Byrne's skeleton should now be buried', which is a more honest ending " +
      "than most institutions manage, and this dataset does not improve on it.\n\n" +
      "WHAT THE RETENTION HAS PRODUCED, which belongs in the argument on both sides. In 1891 Daniel " +
      "Cunningham proposed acromegaly. In 1909 Harvey Cushing persuaded Arthur Keith to examine the inside of " +
      "the skull, and the pituitary fossa was found enlarged. In 2009 a team led by Márta Korbonits took DNA " +
      "from two of his teeth and identified an AIP mutation — familial isolated pituitary adenoma — shared " +
      "with living families in Northern Ireland, traced to a common ancestor the researchers place very " +
      "roughly fifteen hundred years ago, with a range they give as about 400 to 3700 years. That work led to " +
      "a screening programme. None of this settles whether the skeleton should be kept. All of it is what a " +
      "reader needs in order to have the argument properly.\n\n" +
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
        sourceKey: "rcs_surgicat_byrne",
        startYear: 1813,
        endYear: 2017,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "How long the skeleton was on public display",
        originalDateText: "Displayed in the College's museum from 1813 until 2017",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: two hundred and four years of public display, which is a fact about an institution " +
          "and about what generations of visitors were shown. WHY IT IS ON THE TIMELINE: the custody and " +
          "visibility of evidence is itself datable, and it is one of the few things in this dataset that can " +
          "be dated precisely.",
        notes: "From the SurgiCat catalogue record, read directly.",
      },
      {
        sourceKey: "rcs_surgicat_byrne",
        startYear: 2020,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "When the Trustees decided against further display",
        originalDateText: "In 2020 the Trustees of the Hunterian Collection agreed the skeleton would no longer be displayed",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that in 2020 the Hunterian Collection Trustees agreed the skeleton would not be " +
          "displayed again, but would be retained for further research into pituitary gigantism. CORRECTED: " +
          "this dataset previously dated the decision to 2023 and tied it to a museum reopening. The catalogue " +
          "gives 2020 for the decision and 2017 for the end of display, which are two different events and " +
          "neither is 2023. WHAT IT IS NOT: a judgement on whether retention is right. The College's own record " +
          "says plainly that 'opinions differ as to whether Byrne's skeleton should now be buried', and this " +
          "dataset does not settle that either.",
        notes: "From the SurgiCat catalogue record, read directly. Replaces a date given here from memory.",
      },
    ],
    measurements: [
      {
        sourceKey: "rcs_surgicat_byrne",
        valueCm: 248.9,
        whatIsMeasured: "Height advertised in the Morning Herald, 24 April 1782",
        originalValueText: "\"his height is eight feet two inches\" — Morning Herald advertisement, 24 April 1782",
        measurementKind: "advertised_height",
        measurementMethod: "promotional",
        evidenceStatus: "strongly_documented",
        directlyMeasured: false,
        measuredOn: "1782-04-24",
        evidence:
          "WHAT IS CLAIMED: eight feet two inches. WHO CLAIMED IT: the exhibition, in a newspaper " +
          "advertisement quoted verbatim in the College's catalogue — 'Mr. Byrne, the surprising Irish Giant, " +
          "who is allowed to be the tallest man in the world, his height is eight feet two inches, and in full " +
          "proportion accordingly, only 21 years of age.' WHY THIS IS BETTER THAN AN ADVERTISED HEIGHT USUALLY " +
          "IS: it is dated to the day and quoted from the paper, so a reader can see the exact words that were " +
          "sold. WHAT IT IS EVIDENCE OF: what was advertised in London in April 1782. Nothing else.",
        notes:
          "Read from the SurgiCat catalogue record, which quotes the advertisement. The catalogue itself marks " +
          "the figure '[sic]'.",
      },
      {
        sourceKey: "rcs_surgicat_byrne",
        valueCm: 254,
        whatIsMeasured: "Height reported after death in the Annual Register, June 1783",
        originalValueText: "\"in August 1780, measured eight feet; that in 1782 he had gained two inches; and after he was dead he measured eight feet four inches\"",
        measurementKind: "posthumous_report",
        measurementMethod: "press_report",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: a sequence — eight feet in August 1780, two inches more by 1782, eight feet four " +
          "inches after death. WHY A GROWING CORPSE SHOULD GIVE A READER PAUSE: the last figure exceeds the " +
          "last living one, which does not happen. WHOSE CLAIM IT IS: an 'ingenious correspondent' of the " +
          "Annual Register, as quoted in the College's catalogue. THE VALUE HERE IS THE FINAL FIGURE; the " +
          "earlier two are in the quoted text so the whole sequence can be seen.",
        notes:
          "Read from the SurgiCat record, which reproduces the Annual Register Chronicle, June 1783, vol. xxvi, " +
          "p. 209.",
      },
      {
        sourceKey: "rcs_surgicat_byrne",
        valueCm: 244,
        whatIsMeasured: "The skeleton, as catalogued by Owen in 1853",
        originalValueText: "\"It measures eight feet, in a straight line from the vertex to the sole\" — Owen 1853",
        measurementKind: "skeletal_height",
        measurementMethod: "mounted_skeleton",
        evidenceStatus: "disputed",
        directlyMeasured: true,
        measuredOn: "1853-01-01",
        evidence:
          "WHAT IS MEASURED: the mounted skeleton, by the College, in the mid-nineteenth century. THE FIGURE IS " +
          "EIGHT FEET. THIS IS THE FINDING THAT MAKES THIS RECORD WORTH READING: twenty-six years later the " +
          "same institution catalogued the same object at seven feet seven, and called the eight-foot class of " +
          "figures 'evidently exaggerations'. An accession number guarantees that an object can be re-measured. " +
          "It does not guarantee that the measurements will agree.",
        notes:
          "Read from the SurgiCat record, quoting Owen 1853 vol. 2, no. 5905. What changed between 1853 and " +
          "1879 — the mount, the method, or the care — is not stated and is worth somebody establishing.",
      },
      {
        sourceKey: "rcs_surgicat_byrne",
        valueCm: 231,
        whatIsMeasured: "The skeleton, as measured by Flower in 1879",
        originalValueText: "\"Height 2310 [mm] = 7 feet 7 inches\" — Flower 1879, pp. 24-25",
        measurementKind: "skeletal_height",
        measurementMethod: "osteological",
        evidenceStatus: "verified_physical_remains",
        directlyMeasured: true,
        measuredOn: "1879-01-01",
        measuredBy: "William Henry Flower",
        evidence:
          "WHAT IS MEASURED: 2310 mm, on the mounted skeleton, published with a full set of individual bone " +
          "measurements — femur r. 625 l. 642, tibia r. 541 l. 537, humerus r. 450 l. 430, and so on — which is " +
          "what makes it checkable rather than merely stated. WHY IT IS THE BEST FIGURE HERE: it is the only one " +
          "accompanied by its own workings. FLOWER'S OWN JUDGEMENT ON THE ADVERTISEMENTS: 'The above-named " +
          "heights are evidently exaggerations, as the actual height of the skeleton... is only seven feet " +
          "seven inches.' AND A DETAIL THAT CORRECTS THIS DATASET: he says the mount is one 'in which due " +
          "allowance appears to be given for the intervertebral substance' — so this is NOT simply a " +
          "bones-only figure needing soft tissue added back, and the general rule that a mounted skeleton " +
          "understates the living person does not apply here in the simple way this record previously implied.",
        notes:
          "Read from the SurgiCat record. Flower also notes the corresponding limb bones of opposite sides " +
          "'present great differences in dimensions', which is a real observation about asymmetry in his " +
          "skeleton and not a measurement problem.",
      },
      {
        sourceKey: "rcs_surgicat_byrne",
        valueCm: 235,
        whatIsMeasured: "Byrne's stature in life, as the College's modern description gives it",
        originalValueText: "\"he... grew to be 2.35m (7'7\") tall\" — RCS online description",
        measurementKind: "reported_unspecified",
        measurementMethod: "unstated",
        evidenceStatus: "disputed",
        directlyMeasured: false,
        evidence:
          "WHAT IS CLAIMED: 2.35 m for the living man. A PROBLEM INSIDE ONE SENTENCE: 2.35 m is about seven " +
          "feet eight and a half inches, not seven feet seven, and the description prints both. Seven feet " +
          "seven is Flower's SKELETON figure, 2310 mm. Somewhere between the 1879 catalogue and the modern web " +
          "page, a measurement of the bones has been restated as a measurement of the man and picked up an " +
          "extra four centimetres. WHY THIS IS RECORDED RATHER THAN QUIETLY CORRECTED: it is the single " +
          "clearest illustration in this dataset of how a figure drifts — not through dishonesty, but through " +
          "being copied across a category boundary by people with no reason to check.",
        notes:
          "Read from the SurgiCat record. NEEDS SOURCE VERIFICATION for where 2.35 m entered the College's " +
          "literature, which is a question about modern museum documentation rather than about Byrne.",
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
    // THE HERO IS THE 1899 PHOTOGRAPH WITH DR LACKEY, because it is the only
    // one of the four that puts Rogan beside a known adult of ordinary height.
    // A photograph of a tall man alone shows a man; a photograph of him beside
    // someone shows a comparison, and a comparison is the whole subject here.
    imageUrl: commonsSized("John \"Bud\" Rogan 1899.jpg", 1024),
    media: [
      {
        ...fromCommons("John \"Bud\" Rogan 1899.jpg", 1024),
        caption:
          "John William \"Bud\" Rogan photographed in 1899 with the physician William Lackey. The presence of a second person of ordinary height is what makes this the most useful image of Rogan that survives: it turns a picture into a comparison.",
        kind: "image",
        shows: "evidence_photograph",
        subject: "John William Rogan with Dr William Lackey",
        photographDate: "1899",
        pixelWidth: 598,
        pixelHeight: 1023,
        licence: "Public domain (Public Domain Mark)",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "LICENCE AND DATE AS SUPPLIED BY A READER WHO OPENED THE FILE PAGE; this codebase has not opened " +
          "it. WHAT WOULD MAKE THIS THE BEST EVIDENCE IN THE RECORD and currently does not: Lackey's own " +
          "height. A comparison photograph with one unknown quantity is a comparison with nothing. If " +
          "Lackey's height is recorded anywhere — a medical register, a census, his own papers — this " +
          "picture becomes a measurement rather than an impression.",
      },
      {
        ...fromCommons("John Rogan.jpg", 1600),
        caption:
          "John Rogan on the goat cart he used to move around Gallatin, Tennessee. The largest version of this photograph in the set.",
        kind: "image",
        shows: "evidence_photograph",
        subject: "John William Rogan on his goat cart",
        pixelWidth: 2048,
        pixelHeight: 1649,
        licence: "CC BY-SA 2.5",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "contested",
        provenanceNotes:
          "THE IMMEDIATE SOURCE ON COMMONS IS REPORTED TO BE A REDDIT REPOST, AND THAT IS NOT A SOURCE. A " +
          "repost is a place a copy was found; it says nothing about who took the photograph, when, or under " +
          "what terms — and a CC BY-SA licence applied by a re-uploader to somebody else's historical " +
          "photograph may not be theirs to apply. WHAT TO TRACE: the Gallatin, Tennessee municipal and " +
          "historical collections, Sumner County records, and the Tennessee State Library and Archives. " +
          "UNTIL THEN this file is kept, shown with its problem attached, and never described as though " +
          "Reddit were the photographer.",
      },
      {
        ...fromCommons("John Rogan.png", 1024),
        caption:
          "John Rogan on his goat cart. The same photograph as the file above, at lower resolution and under a different licence statement.",
        kind: "image",
        shows: "evidence_photograph",
        subject: "John William Rogan on his goat cart",
        pixelWidth: 847,
        pixelHeight: 1200,
        licence: "CC BY-SA 4.0",
        duplicateOf: "John Rogan.jpg",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "TWO FILES, TWO LICENCES, ONE PHOTOGRAPH — and the licences cannot both be right about the same " +
          "historical image, which is itself a reason to distrust both. This one is attributed to Gallatin, " +
          "Tennessee municipal material, which is the more promising lead of the two and the one to follow. " +
          "MARKED AS A DUPLICATE ON THE STRENGTH OF THE DESCRIPTIONS, not by comparing the images, because " +
          "the images cannot be fetched from here. If they turn out to be different exposures from the same " +
          "sitting, that is two photographs and this field is wrong.",
      },
      {
        ...fromCommons("John-Rogan.jpg", 512),
        caption: "John Rogan. A small copy, photographed before 1905; which of the surviving photographs it is taken from is not established.",
        kind: "image",
        shows: "evidence_photograph",
        subject: "John William Rogan",
        pixelWidth: 244,
        pixelHeight: 281,
        licence: "Public domain in the United States",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "244 x 281 IS A THUMBNAIL, NOT A PHOTOGRAPH. Almost certainly a crop or a reduction of one of the " +
          "images above, but WHICH ONE IS NOT ESTABLISHED, so duplicateOf is deliberately left unset rather " +
          "than guessed: a wrong duplicate link would quietly delete a real photograph from the count. " +
          "RIGHTS CAVEAT AS SUPPLIED: public domain in the United States; the file page warns that the " +
          "status elsewhere may differ, which matters for any reader outside the US.",
      },
    ],
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
    // THE HERO IS KAY'S 1803 ETCHING, and every word of that sentence is a
    // classification. It is an ETCHING, made from life, three years before
    // Cotter died — so it is contemporary testimony rather than a photograph,
    // and it is the largest scan in the set at 2640 x 3318. There are no
    // photographs of Patrick Cotter O'Brien and there cannot be: he died in
    // 1806, three decades before photography.
    imageUrl: commonsSized("Patrick O'Brien, a giant. Etching by J. Kay, 1803. Wellcome V0007208.jpg", 1600),
    media: [
      {
        ...fromCommons("Patrick O'Brien, a giant. Etching by J. Kay, 1803. Wellcome V0007208.jpg", 1600),
        caption:
          "Patrick Cotter O'Brien, etching by John Kay, 1803. Made three years before his death, from a living subject — and drawn by a hand with a view about how a giant should look.",
        kind: "image",
        shows: "engraving",
        subject: "Patrick Cotter O'Brien",
        creator: "John Kay",
        objectDate: "1803",
        institution: "Wellcome Collection",
        accessionNumber: "V0007208",
        licence: "CC BY 4.0",
        pixelWidth: 2640,
        pixelHeight: 3318,
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "AN ETCHING IS NOT A PHOTOGRAPH, and for this man there is no alternative: he died in 1806 and the " +
          "earliest photographs are of the 1820s at the outside, in practice the 1840s. So every image in " +
          "this record is an artist's rendering, and the proportions in it are an artist's decision. Kay was " +
          "a caricaturist. THAT IS NOT A REASON TO EXCLUDE THE PRINT — it is the best contemporary depiction " +
          "there is — but it is a reason never to measure anything off it.",
      },
      {
        ...fromCommons("Patrick O'Brien, a giant. Etching by A. van Assen, 1804, aft Wellcome V0007209EL.jpg", 1600),
        caption:
          "Patrick Cotter O'Brien, etching by A. van Assen, 1804, after J. Parry. A print of a print: van Assen worked from Parry's image rather than from Cotter.",
        kind: "image",
        shows: "engraving",
        subject: "Patrick Cotter O'Brien",
        creator: "A. van Assen, after J. Parry",
        objectDate: "1804",
        institution: "Wellcome Collection",
        accessionNumber: "V0007209EL",
        licence: "CC BY 4.0",
        pixelWidth: 1304,
        pixelHeight: 2120,
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "\"AFTER J. PARRY\" IS THE WHOLE PROVENANCE PROBLEM IN TWO WORDS. This is one artist's version of " +
          "another artist's version of a man. Each copying adds a little, and eighteenth-century printmakers " +
          "copying a famous giant had every commercial reason to add height rather than take it away. Not " +
          "independent evidence of Cotter's appearance; evidence of how his image circulated.",
      },
      {
        ...fromCommons("Patrick O'Brien, a giant. Engraving, 1804. Wellcome V0007209ER.jpg", 1600),
        caption: "Patrick Cotter O'Brien, engraving, 1804. Wellcome V0007209ER — one of a group sharing the V0007209 number.",
        kind: "image",
        shows: "engraving",
        subject: "Patrick Cotter O'Brien",
        objectDate: "1804",
        institution: "Wellcome Collection",
        accessionNumber: "V0007209ER",
        licence: "CC BY 4.0",
        pixelWidth: 1435,
        pixelHeight: 2458,
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "THREE FILES SHARE THE BASE NUMBER V0007209, with the suffixes ER, EL and none. In Wellcome's " +
          "iconographic numbering that pattern normally means one sheet photographed in parts or in states, " +
          "not three separate works. WHETHER THESE ARE THREE IMAGES OR ONE is unresolved here and is exactly " +
          "the sort of question a catalogue lookup answers in a minute. Until it is answered they are not " +
          "counted as three independent depictions.",
      },
      {
        ...fromCommons("Patrick O'Brien, a giant. Engraving, Wellcome V0007209.jpg", 1600),
        caption: "Patrick Cotter O'Brien, engraving. Wellcome V0007209, the base number of the group above.",
        kind: "image",
        shows: "engraving",
        subject: "Patrick Cotter O'Brien",
        institution: "Wellcome Collection",
        accessionNumber: "V0007209",
        licence: "CC BY 4.0",
        pixelWidth: 1499,
        pixelHeight: 1274,
        duplicateOf: "Patrick O'Brien, a giant. Engraving, 1804. Wellcome V0007209ER.jpg",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "LINKED TO THE ER FILE ON THE SHARED ACCESSION NUMBER ALONE — a reasonable inference and not a " +
          "verified one. A shared Wellcome number is far stronger evidence of a shared original than a " +
          "shared subject would be, which is why this link is drawn and the Rogan thumbnail's is not.",
      },
      {
        ...fromCommons("The surprizing Irish giant of St, James's Street. (BM 1868,0808.5425).jpg", 1600),
        caption:
          "\"The surprizing Irish giant of St James's Street\", 1785. A printed advertisement for the exhibition, carrying the claim that the giant measured about eight feet five inches — which is a selling point, not a measurement.",
        kind: "image",
        shows: "historical_document",
        subject: "Patrick Cotter O'Brien, as advertised in London",
        objectDate: "1785",
        institution: "British Museum",
        accessionNumber: "1868,0808.5425",
        licence: "Public domain / Public Domain Mark (Commons statement, for the scan)",
        rightsNotes:
          "TWO RIGHTS STATEMENTS, BOTH PRESERVED, AND THEY DISAGREE. Commons marks the scan public domain. " +
          "The British Museum's own metadata asserts \u00a9 Trustees of the British Museum, CC BY-NC-SA 4.0. " +
          "This dataset does not adjudicate between them: it records both and the application takes the " +
          "MORE CONSERVATIVE position, which means treating reuse as non-commercial and share-alike.",
        pixelWidth: 1600,
        pixelHeight: 1147,
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "THE EIGHT-FOOT-FIVE FIGURE ON THIS SHEET IS RECORDED AS A MEASUREMENT CLAIM OF ITS OWN, filed as " +
          "advertised rather than measured. A showman's bill is evidence that the number was printed in " +
          "1785, which is a real and datable fact, and it is not evidence that anybody held a rule against " +
          "him. The dataset keeps the claim and refuses the promotion.",
      },
      {
        ...fromCommons("Giant comparison chart Morning World Herald Sun May 13 1900.png", 1600),
        caption:
          "A newspaper comparison chart, Morning World-Herald, 13 May 1900. Figures of famous giants drawn side by side — each one at whatever height its own publicity had claimed.",
        kind: "image",
        shows: "comparison_chart",
        subject: "Several exhibited giants, compared graphically",
        objectDate: "1900-05-13",
        licence: "Public domain (published in the United States before 1931)",
        pixelWidth: 1391,
        pixelHeight: 1956,
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "A CHART INHERITS EVERY ERROR OF THE NUMBERS IT WAS DRAWN FROM AND ADDS THE AUTHORITY OF A PICTURE. " +
          "This one is a century-old graphic built from advertised heights, and drawing them to scale makes " +
          "them look measured. It is in the dataset as evidence of what was believed and published in 1900, " +
          "and no measurement claim anywhere cites it.",
      },
      {
        ...fromCommons("Show Bill. Attractions at the Middlesex Music Hall Wellcome M0015550.jpg", 1600),
        caption:
          "A show bill for the Middlesex Music Hall, 1886 — eighty years after Patrick Cotter O'Brien died. It advertises a performer billed as \"Pat O'Brien\", who cannot be him.",
        kind: "image",
        shows: "historical_document",
        subject: "NOT Patrick Cotter O'Brien. A later performer billed under a similar name",
        objectDate: "1886",
        institution: "Wellcome Collection",
        accessionNumber: "M0015550",
        licence: "CC BY 4.0",
        pixelWidth: 1890,
        pixelHeight: 5662,
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "contested",
        provenanceNotes:
          "POSSIBLE MISCATEGORISATION — REQUIRES REVIEW, and the clearest case in this whole import of why a " +
          "Commons category is not a provenance. The bill is dated 1886. Patrick Cotter O'Brien died in 1806. " +
          "NO PART OF THIS DOCUMENT CAN BE ABOUT HIM. It is kept in the record because it is genuinely " +
          "interesting — a stage name outliving its owner by eighty years is how these reputations worked, " +
          "and \"Irish giant\" was a billing rather than a person — but it is attached with its subject " +
          "field saying NOT Patrick Cotter O'Brien, so nothing can read it as a lifetime document. WHAT TO " +
          "ESTABLISH: which performer the 1886 bill advertises, and whether the Commons categorisation " +
          "should be corrected upstream.",
      },
    ],
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
        sourceKey: "bm_surprizing_irish_giant",
        whatIsMeasured: "Height as advertised on a dated London exhibition sheet",
        valueCm: 256.5,
        originalValueText: "About 8 ft 5 in, on a sheet of 1785",
        measurementKind: "advertised_height",
        measurementMethod: "unstated",
        evidenceStatus: "historical_report_remains_lost",
        directlyMeasured: false,
        evidence:
          "WHY THIS IS A SEPARATE CLAIM FROM THE 8 FT 7 IN ONE BELOW, and not a correction of it: they are " +
          "two different advertised figures, and having both is the point. The one here comes with a DATE " +
          "and a DOCUMENT — a 1785 sheet held by the British Museum with an accession number — where the " +
          "taller figure is the one that circulates without either. WHAT THAT PATTERN SUGGESTS AND DOES NOT " +
          "PROVE: that the advertised height grew during his career, which is what one would expect of a " +
          "figure whose job was to sell tickets. Two data points are not a trend, and the second is undated, " +
          "so this is recorded as something to test rather than something found.\n\n" +
          "WHAT IS ESTABLISHED: that eight feet five inches was in print in 1785. WHAT IS NOT: that anyone " +
          "measured him.",
        notes:
          "NEEDS SOURCE VERIFICATION against the British Museum's own record of 1868,0808.5425, which would " +
          "give the sheet's exact wording and its printer. The conversion is from the stated feet and inches.",
      },
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
    // NO HERO IMAGE, AND THE ABSENCE IS THE FINDING.
    //
    // The brief for this import asked for an authenticated historical
    // photograph. The one file that exists is not authenticated — its Commons
    // author field reads as an own-work claim for a photograph of a woman who
    // died in 1922 — so promoting it to the cover of this record would assert
    // exactly the thing that has not been established. It is recorded below,
    // with the problem attached, and it is not the hero.
    media: [
      {
        ...fromCommons("Jane Bunford.jpg", 1024),
        caption:
          "Stated to be Jane Bunford, dated 1 April 1922 on its file page. What the image actually is — an original photograph, a reproduction of one, or something else — has not been established.",
        kind: "image",
        shows: "unverified_image",
        subject: "Stated to be Jane Bunford; not confirmed here",
        photographDate: "Stated as 1 April 1922; unverified",
        licence: "CC0 1.0 Universal (Public Domain Dedication)",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "contested",
        provenanceNotes:
          "THE PROBLEM IS THE AUTHOR FIELD, AND IT IS NOT A TECHNICALITY. Commons records an uploader name " +
          "against a date of 1 April 1922. Jane Bunford died in 1922. Nobody uploading to Commons " +
          "photographed her, so an own-work claim here cannot mean what it normally means — it usually " +
          "indicates a scan, a reproduction, or a field filled in carelessly.\n\n" +
          "WHY IT IS NOT DELETED. A CC0 dedication on somebody else's historical photograph is void, but the " +
          "photograph may still be out of copyright on its own merits, and a 1922 British photograph very " +
          "likely is. The file is probably fine to use and its paperwork is certainly wrong, and those are " +
          "different statements.\n\n" +
          "WHAT WOULD SETTLE IT: the University of Birmingham anatomical collection, which holds material " +
          "relating to her; Bagnall and Birmingham local newspaper archives for 1922; and the Guinness " +
          "archive. Any one of those would turn this from a file into a document.",
      },
    ],
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
    // THE HERO IS THE c.1930 PHOTOGRAPH, because it is the only image that
    // does the one thing this record needs: it puts him beside somebody of
    // ordinary height, in the years after the growth. It is also 300 x 194,
    // which is a postage stamp, and finding a better original is the single
    // most valuable outstanding job on this record.
    imageUrl: commonsSized("Adam Rainer (1899-1950) circa 1930.webp", 600),
    media: [
      {
        ...fromCommons("Adam Rainer (1899-1950) circa 1930.webp", 600),
        caption:
          "Adam Rainer beside a man of ordinary height, about 1930 — after the growth that took him from being rejected by a conscription board as too short to over two metres.",
        kind: "image",
        shows: "evidence_photograph",
        subject: "Adam Rainer with an unidentified man of ordinary height",
        photographDate: "circa 1930",
        creator: "Unknown / anonymous",
        pixelWidth: 300,
        pixelHeight: 194,
        licence: "Public domain (Commons rationale for anonymous EU works)",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "LOW RESOLUTION, HIGH VALUE, AND IT IS WORTH SAYING WHY. Rainer is the only person in this dataset " +
          "whose record is a trajectory rather than a height, and a photograph taken after the change, with " +
          "a second person in frame, is the only surviving thing that shows it. At 300 x 194 it is barely " +
          "large enough to look at. WHERE A BETTER ONE MIGHT BE: the Austrian medical literature of the " +
          "1930s, in which his case was reported; Landesarchiv and hospital collections; and the original " +
          "publication the anonymous photograph came from. THE PUBLIC-DOMAIN RATIONALE DEPENDS ON THE " +
          "AUTHOR GENUINELY BEING UNKNOWN, so identifying the photographer could change the licence — which " +
          "is an odd incentive and not a reason to stop looking.",
      },
      {
        ...fromCommons("Tamaños-rainer.jpg", 1024),
        caption:
          "A modern graphic comparing Adam Rainer's height before and after his growth. Explanatory artwork, not a medical record — the figures in it are as good as their unstated sources and no better.",
        kind: "image",
        shows: "comparison_chart",
        subject: "A size-comparison diagram of Adam Rainer",
        licence: "Public domain (released by the copyright holder)",
        pixelWidth: 600,
        pixelHeight: 623,
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "as_supplied",
        provenanceNotes:
          "THE DANGER HERE IS SPECIFIC AND WORTH NAMING. This record deliberately holds NO figure for " +
          "Rainer's conscription measurements, because the best evidence about him — a military board " +
          "measuring a recruit for reasons unconnected to any claim about his height — has not been read " +
          "from the primary record, and a number from general knowledge would lack exactly the property " +
          "that makes the original valuable. A diagram drawn from those same unsourced numbers would " +
          "reintroduce them as a picture, which is harder to argue with than a figure. So this is filed as " +
          "explanatory imagery, it carries no measurement claim, and nothing in the record cites it.",
      },
    ],
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
    // THE HERO IS THE EXHUMATION, and the choice is an argument.
    //
    // The strongest historical image of this case is the one of the thing
    // coming out of the ground, because that is the moment the claim was made:
    // a figure in a pit, being uncovered, in front of witnesses. Everything
    // about it is real except what it was taken to mean.
    imageUrl: commonsSized("Cardiff giant exhumed 1869.jpg", 1600),
    media: [
      {
        ...fromCommons("Cardiff giant exhumed 1869.jpg", 1600),
        caption:
          "The Cardiff Giant being uncovered at Cardiff, New York, in 1869. A genuine photograph of a genuine object, taken at the moment it was being presented as a petrified man. The object is carved gypsum: it was cut in Chicago from a block quarried at Fort Dodge and buried behind the barn in November 1868.",
        kind: "image",
        shows: "hoax_object",
        subject: "The carved gypsum figure known as the Cardiff Giant",
        objectDate: "1868 (carved)",
        photographDate: "1869",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "unverified",
        provenanceNotes:
          "FILE NAME AND CATEGORY MEMBERSHIP ARE ALL THAT IS ESTABLISHED HERE. The Commons file page has not " +
          "been opened from this environment, so the photographer, the licence, the exact date and the " +
          "original publication are unread. The licence is fetched from the file's own page at seed time " +
          "rather than guessed; everything else on this line needs a person to open the page.",
      },
      {
        ...fromCommons("Cardiff Giant LCCN2014693762.jpg", 1600),
        caption:
          "The Cardiff Giant, from the Library of Congress. Catalogued material with an LCCN, which makes it the most traceable image of the object in this set.",
        kind: "image",
        shows: "hoax_object",
        subject: "The carved gypsum figure known as the Cardiff Giant",
        institution: "Library of Congress",
        accessionNumber: "LCCN 2014693762",
        originalSourceUrl: "https://www.loc.gov/item/2014693762/",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "unverified",
        provenanceNotes:
          "THE LIBRARY OF CONGRESS URL ABOVE WAS DERIVED FROM THE LCCN IN THE FILE NAME, not read from the " +
          "catalogue. That derivation is a reliable convention and it is still a derivation, so it is flagged " +
          "rather than presented as checked. WHAT THE LoC RECORD WOULD SETTLE and nothing else can: the " +
          "photographer, the date, the format (print, stereograph, negative) and the rights statement. " +
          "Reported to be available at high resolution — up to about 6858 x 5166 — which is larger than the " +
          "importer's eight-megabyte ceiling is likely to accept at full size.",
      },
      {
        ...fromCommons("The Onondaga giant LCCN2003666806.jpg", 1600),
        caption:
          "\"The Onondaga giant\" — a contemporary name for the same object, after the county in which it was dug up. Library of Congress material.",
        kind: "image",
        shows: "hoax_object",
        subject: "The Cardiff Giant, under its contemporary alternative name",
        institution: "Library of Congress",
        accessionNumber: "LCCN 2003666806",
        originalSourceUrl: "https://www.loc.gov/item/2003666806/",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "unverified",
        provenanceNotes:
          "THE NAME IS THE INTERESTING PART and it is why this file is not a duplicate of the one above: " +
          "\"the Onondaga giant\" is what the object was called in the period, and a reader searching " +
          "nineteenth-century sources for \"Cardiff Giant\" will miss material filed under it. LoC URL " +
          "derived from the LCCN in the file name, not read. Whether this is a photograph, a print or a " +
          "lithograph is UNKNOWN here and changes what it is evidence of.",
      },
      {
        ...fromCommons("Cardiff Giant 2.jpg", 1600),
        caption: "The Cardiff Giant. Content and date not established here.",
        kind: "image",
        shows: "unverified_image",
        subject: "Stated to be the Cardiff Giant; not confirmed here",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "unverified",
        provenanceNotes:
          "NOTHING IS KNOWN ABOUT THIS FILE BEYOND ITS NAME. It is filed as unverified rather than as a " +
          "photograph of the object, because \"Cardiff Giant 2.jpg\" establishes that somebody thought it " +
          "was of the Cardiff Giant and nothing more. It is kept so it can be checked, not so it can be shown.",
      },
      {
        ...fromCommons("Cardiff Giant.gif", 1024),
        caption: "The Cardiff Giant. Format suggests a scanned illustration rather than a photograph; not established here.",
        kind: "image",
        shows: "unverified_image",
        subject: "Stated to be the Cardiff Giant; not confirmed here",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "unverified",
        provenanceNotes:
          "A GIF, which in this kind of category usually means a scan of a printed illustration rather than " +
          "a photograph — but 'usually' is not a provenance. Unverified until the file page is read.",
      },
      {
        ...fromCommons("Cardiff Giant.png", 1024),
        caption: "The Cardiff Giant. Content and date not established here.",
        kind: "image",
        shows: "unverified_image",
        subject: "Stated to be the Cardiff Giant; not confirmed here",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "unverified",
        provenanceNotes: "File name only. Not opened, not classified, not shown as evidence.",
      },
      {
        ...fromCommons("The Cardiff Giant - History of Iowa.jpg", 1600),
        caption:
          "The Cardiff Giant as printed in a History of Iowa. An illustration reproduced from a book, which is a picture of how the object was depicted rather than a record of the object.",
        kind: "image",
        shows: "unverified_image",
        subject: "The Cardiff Giant, as reproduced in a printed history",
        provenanceStatus: "unverified",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceNotes:
          "THE IOWA CONNECTION IS REAL AND WORTH FOLLOWING: the gypsum was quarried at Fort Dodge, which is " +
          "why an Iowa county history carries the story at all. Which volume, which page and which engraver " +
          "are unread here. Whether this is an engraving, a halftone or a photograph decides its kind, and " +
          "that is exactly what has not been checked.",
      },
      {
        ...fromCommons("The Cardiff Giant (8923364469).jpg", 1600),
        caption:
          "The Cardiff Giant. The numeric suffix is the identifier of the photo-sharing account the file was imported from, which makes this most likely a modern photograph rather than a historical one.",
        kind: "image",
        shows: "unverified_image",
        subject: "The Cardiff Giant object, probably as displayed today",
        provenanceStatus: "unverified",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceNotes:
          "A MODERN PHOTOGRAPH OF A HISTORICAL OBJECT IS NOT A HISTORICAL PHOTOGRAPH, and this set contains " +
          "both. The nine-digit suffix is the shape of a photo-sharing site's own ID, which is how the file " +
          "reached Commons; it is not an accession number and not a provenance. The photographer and date " +
          "are unread.",
      },
      {
        ...fromCommons("Cardiff Giant, Cooperstown, NY (8906282793).jpg", 1600),
        caption:
          "The Cardiff Giant at Cooperstown, New York, where the object is on display. A modern museum photograph of a nineteenth-century hoax — the most recent link in the chain, not a record of the events of 1869.",
        kind: "image",
        shows: "artefact",
        subject: "The Cardiff Giant object on museum display at Cooperstown",
        institution: "Cooperstown, New York (museum not named on the file)",
        provenanceStatus: "unverified",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceNotes:
          "CLASSIFIED AS A MODERN MUSEUM PHOTOGRAPH on the strength of the place name in the file name, " +
          "which is weaker evidence than it looks: Cooperstown is where the object went, so a picture taken " +
          "there is a picture of the surviving object rather than of the 1869 exhibition. The photographer, " +
          "the date and the holding museum's own name are unread.",
      },
      {
        ...fromCommons("Cardiff1869 Street Art Installation In Pasadena, California, 2011.jpg", 1600),
        caption:
          "A street-art installation in Pasadena, California, made in 2011 and referencing the Cardiff Giant. It is not the object and it is not from 1869 — it is a modern artwork about the hoax.",
        kind: "image",
        shows: "later_artwork",
        subject: "A 2011 street-art installation referring to the Cardiff Giant",
        photographDate: "2011 or later",
        objectDate: "2011",
        provenanceStatus: "as_supplied",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceNotes:
          "THIS IS THE TRAP THE CATEGORY SETS. The file name opens with \"Cardiff1869\" and the picture is " +
          "of something made in 2011. Anything that scraped the category and read the leading digits as a " +
          "date would file a piece of twenty-first-century street art as a contemporary record of the hoax. " +
          "The date is in the file name itself, which is the only reason this one could be caught from here.",
      },
      {
        ...fromCommons("Irish fossilized giant.jpg", 1024),
        caption: "Filed in the Cardiff Giant category under a title that does not name the Cardiff Giant. What it depicts is not established here.",
        kind: "image",
        shows: "unverified_image",
        subject: "Unestablished. The title refers to an Irish fossilised giant, which is not this object's usual name",
        provenanceStatus: "contested",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceNotes:
          "POSSIBLE MISCATEGORISATION, FLAGGED RATHER THAN RESOLVED. The Cardiff Giant was exhibited under " +
          "several names, so an \"Irish fossilized giant\" could be it — or could be one of the several " +
          "OTHER nineteenth-century petrified-man exhibits, which is precisely the kind of conflation this " +
          "dataset exists to prevent. Not attached to the Cardiff Giant as a depiction until somebody reads " +
          "the file page.",
      },
      {
        ...fromCommons("View in Cardiff Glen, near Fort Dodge, Iowa (NYPL b11707469-G90F191 001F).tiff", 1600),
        caption:
          "View in Cardiff Glen, near Fort Dodge, Iowa. The New York Public Library's stereograph of the locality the gypsum came from — a picture of the quarry country, not of the giant.",
        kind: "image",
        shows: "site",
        subject: "Landscape near Fort Dodge, Iowa, the source of the gypsum block",
        institution: "The New York Public Library",
        accessionNumber: "b11707469-G90F191 001F",
        provenanceStatus: "unverified",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceNotes:
          "TWO PROBLEMS, BOTH WORTH KNOWING. First, this is a TIFF: the importer accepts JPEG, PNG, WebP and " +
          "GIF, so it cannot be brought in as it stands and needs a derivative from the NYPL's own digital " +
          "collections. Second, the 001F and 001B pair are the two faces of one stereograph card, which " +
          "makes them one item rather than two views. The place name is suggestive rather than decisive: " +
          "'Cardiff Glen' near Fort Dodge is Iowa, and the hoax was buried in Cardiff, New York.",
      },
      {
        ...fromCommons("View in Cardiff Glen, near Fort Dodge, Iowa (NYPL b11707469-G90F191 001B).tiff", 1600),
        caption:
          "The reverse of the same New York Public Library stereograph card. Card backs usually carry the publisher, the series and the caption, which is often where a date comes from.",
        kind: "image",
        shows: "historical_document",
        subject: "The reverse of the stereograph card above",
        institution: "The New York Public Library",
        accessionNumber: "b11707469-G90F191 001B",
        duplicateOf: "View in Cardiff Glen, near Fort Dodge, Iowa (NYPL b11707469-G90F191 001F).tiff",
        provenanceStatus: "unverified",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceNotes:
          "MARKED AS THE SAME ITEM AS THE FILE ABOVE, not as a second view. 001F and 001B are front and back " +
          "of one card. Counting them as two images would inflate the evidence by one, which is small and is " +
          "exactly the kind of small that accumulates. Also a TIFF, so also not importable as it stands.",
      },
    ],
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
