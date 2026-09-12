import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

// =============================================================================
// PART J — CHINA
//
// The sharpest test in the flood material, because here the proposal has been
// made in a journal and answered in the same journal.
//
// In 2016 Science published a paper arguing that an outburst flood from a
// landslide-dammed lake in Jishi Gorge, around 1920 BCE, is the physical event
// behind China's Great Flood — and therefore evidence for the historicity of
// the Xia dynasty. Science then published a Comment arguing that the
// geological and archaeological events are independent and non-synchronous,
// that the dammed lake had drained long before, and that no physical evidence
// of a great flood exists downstream.
//
// BOTH ARE ON THE RECORD. Seeding only the first would present a contested
// identification as a finding; seeding only the second would suppress a
// serious argument published in a serious place. The claim is stored as a
// proposed correlation with the rebuttal cited on it, which is what the
// literature actually contains.
//
// AND THE TRADITION ITSELF IS A DIFFERENT SHAPE FROM EVERY OTHER ON THIS
// TIMELINE. There is no ark, no chosen survivor, no destruction of humanity
// and no repopulation. The flood is a problem to be MANAGED: Gun fails by
// damming, Yu succeeds by dredging channels to the sea, and the moral is
// about method. Its motifs are correspondingly sparse, and the sparseness is
// the finding rather than a gap in the research.
//
// A DATABLE MOMENT WHEN A TRADITION BECAME HISTORY. By the Shiji, in the first
// century BCE, Sima Qian is treating Gun and Yu as historical figures with
// chronology and genealogies. That transition is itself an event, and it is on
// this record — as the Parian Marble is on Deucalion's.
//
// DELIBERATELY ABSENT: Nüwa. The brief asks for the Nüwa catastrophe as a
// separate Chinese entry and explicitly warns against merging it with Gun-Yu.
// No source for it could be verified to the standard the rest of this file
// meets, so it is omitted rather than seeded thin — and the omission is
// recorded here so the gap is visible.
// =============================================================================

/** Astronomical year numbering: 1 BCE = 0, 2 BCE = −1. See time.ts. */
const bce = (year: number): number => 1 - year;

export const FLOOD_CHINA_ANCHOR_SLUG = "gun-yu-great-flood";

export const FLOOD_CHINA_TRACK: SeedTrack = {
  name: "Flood traditions: China",
  slug: "flood-traditions-china",
  kind: "theme",
  color: "#8c5a4a",
};

export const FLOOD_CHINA_SOURCES: SeedSource[] = [
  {
    key: "wu2016",
    title: "Outburst flood at 1920 BCE supports historicity of China's Great Flood and the Xia dynasty",
    author: "Qinglong Wu and others",
    workTitle: "Science",
    reference: "Science 353, 579–582 (2016); doi:10.1126/science.aaf0842",
    url: "https://www.science.org/doi/10.1126/science.aaf0842",
    sourceType: "academic_paper",
    publishedYear: 2016,
    publishedDisplay: "2016",
    notes:
      "The proposal: an earthquake-triggered landslide dammed the Yellow River at Jishi Gorge, the lake breached around 1920 BCE releasing 11–16 cubic kilometres of water at a peak discharge near 400,000 cubic metres per second, and this is the flood the Yu tradition remembers. Cited for the geology and for the identification, which are two different claims in one paper.",
  },
  {
    key: "wu2016_comment",
    title: "Comment on “Outburst flood at 1920 BCE supports historicity of China's Great Flood and the Xia dynasty”",
    workTitle: "Science",
    reference: "Science (2017); doi:10.1126/science.aal1369",
    url: "https://www.science.org/doi/10.1126/science.aal1369",
    sourceType: "academic_paper",
    publishedYear: 2017,
    publishedDisplay: "2017",
    notes:
      "The published rebuttal, cited so that the identification is not presented as settled. It argues the geological and archaeological events are independent and non-synchronous, that sediment chronology puts the dam's disappearance long before the Lajia dwelling, and that no physical evidence of a great flood is shown for the lower Yellow River.",
  },
  {
    key: "jishi_reflections",
    title: "The Jishi Outburst Flood of 1920 BCE and the Great Flood Legend in Ancient China: Preliminary Reflections",
    reference: "Journal of Chinese Humanities",
    url: "https://www.sciencedirect.com/org/science/article/abs/pii/S2352133317000024",
    sourceType: "academic_paper",
    notes: "A discussion of what the 2016 proposal would and would not establish about the legend, cited as context rather than as support for either side.",
  },
  {
    key: "great_flood_china",
    title: "The Great Flood of Gun-Yu",
    url: "https://en.wikipedia.org/wiki/Great_Flood_(China)",
    sourceType: "wikipedia",
    notes:
      "An overview source, cited for the shape of the tradition and its traditional placement in the reign of Yao — and for the point that by the Shiji, Sima Qian treats Gun and Yu as historical figures with dates and genealogies. Follow its references rather than stopping here.",
  },
  {
    key: "yu_the_great",
    title: "Yu the Great",
    url: "https://en.wikipedia.org/wiki/Yu_the_Great",
    sourceType: "wikipedia",
    notes: "Cited for Yu's method — opening channels and deepening courses so the water reaches the sea — as against Gun's dikes and dams.",
  },
  {
    key: "jishi_wikipedia",
    title: "Jishi Gorge outburst flood",
    url: "https://en.wikipedia.org/wiki/Jishi_Gorge_outburst_flood",
    sourceType: "wikipedia",
    notes: "Overview of the event and the argument around it, cited for orientation only.",
  },
];

export const FLOOD_CHINA_EVENTS: SeedEvent[] = [
  {
    slug: FLOOD_CHINA_ANCHOR_SLUG,
    title: "The Great Flood of Gun and Yu",
    summary:
      "A flood nobody escapes and everybody works on. No ark, no chosen survivor, no end of humanity — Gun fails by damming the water, Yu succeeds by giving it somewhere to go.",
    description:
      "<p>The flood lasts for two generations. Gun tries to hold it back with dikes and dams — in the mythological telling, with a self-expanding soil he steals from the Supreme Divinity — and fails. His son Yu studies the river systems, opens channels, deepens courses, and lets the water run to the sea. Yu becomes the founder of the Xia.</p>" +
      "<p><strong>This is a different shape of story from every other on this timeline.</strong> There is no vessel, no survivor chosen to be spared, no destruction of humanity and no repopulation afterwards. The flood is a problem of engineering and persistence, and the moral is about method: the man who tried to block the water failed, and the man who gave it a path succeeded.</p>" +
      "<p>The motifs on this record are sparse for that reason. The sparseness is the finding, not a gap in the research — a comparison grid that filled them in to match Noah would be manufacturing the parallel it claims to test.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["flood", "china", "gun-yu", "xia", "yellow-river"],
    locationName: "The Yellow River valley, China",
    people: ["Gun", "Yu the Great", "Yao", "Sima Qian"],
    civilisations: ["Ancient China"],
    // Deliberately short. No boat, no chosen survivor, no divine punishment, no
    // repopulation — none of which the tradition contains.
    motifs: ["river_flood", "land_drained"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/King_Yu_of_Xia.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/King_Yu_of_Xia.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "Yu the Great, painted by Ma Lin in the Song dynasty \u2014 some three thousand years after the events the " +
          "tradition describes, and about fifteen hundred years after Sima Qian wrote Yu into history. It is " +
          "evidence for how Yu was pictured in the thirteenth century CE and for nothing earlier.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "great_flood_china",
        startYear: bce(2300),
        endYear: bce(2200),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        dateConvention: "calendar",
        whatIsDated: "Where the tradition places the flood",
        originalDateText: "traditionally about 2300–2200 BCE, in the reign of Yao",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "WHAT IS CLAIMED: that the flood fell in the reign of Emperor Yao, conventionally placed in the third millennium BCE. HOW THE DATE IS ARRIVED AT: by the traditional regnal sequence, counted back through a king list — the same kind of reckoning as the Sumerian King List, and carrying the same caution. WHAT IT ESTABLISHES: where the tradition puts the flood. WHAT IT DOES NOT: that a flood occurred then, and nothing at all about the Jishi Gorge event, which is a separate claim on this record.",
      },
      {
        sourceKey: "great_flood_china",
        startYear: bce(100),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When the tradition was written up as history",
        originalDateText: "the Shiji, first century BCE",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A DATABLE MOMENT WHEN A TRADITION BECAME HISTORY. By the Shiji, Sima Qian is treating Gun and Yu as historical figures — placing them in a chronology, giving them dates and genealogies. WHAT IT ESTABLISHES: that by the first century BCE the flood was being handled as history rather than as legend. WHAT IT DOES NOT: that it was history. This claim dates the historicising, which is the act of a first-century historian and not evidence about the third millennium. The Parian Marble does the same thing for Deucalion, and both are on this timeline for the same reason.",
        notes:
          "The Shiji is not the earliest mention of the tradition — earlier material exists in the classics. This claim is about when it was given a CHRONOLOGY, which is a different and more specific thing.",
      },
      {
        sourceKey: "wu2016",
        startYear: bce(1920),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "proposed_correlation",
        dateConvention: "calendar",
        whatIsDated: "The geological flood proposed as the event behind the tradition",
        originalDateText: "the Jishi Gorge outburst flood, c. 1920 BCE, proposed as a correlation",
        datingMethod: "radiocarbon",
        chronology: "disputed",
        evidence:
          "WHAT IS PROPOSED: that an outburst flood from a landslide-dammed lake in Jishi Gorge around 1920 BCE is the event the Yu tradition remembers, and that this supports the historicity of the Xia. WHY IT IS FILED AS A CORRELATION: because the geology and the identification are two different claims in one paper, and only the first is a measurement. WHAT THE PUBLISHED REBUTTAL ARGUES: that the geological and archaeological events are independent and non-synchronous, that sediment chronology puts the dam's disappearance long before the Lajia dwelling the paper connects it to, and that no physical evidence is shown for a great flood along the lower Yellow River. IMPORTANT: the traditional date is 2300–2200 BCE and the proposed flood is 1920 BCE — three to four centuries apart, which the proposal addresses by revising the traditional chronology rather than by matching it.",
        citations: [
          {
            sourceKey: "wu2016_comment",
            relation: "disputes",
            note: "The published Comment in Science. The identification is argued over in the literature, and this record shows the argument rather than its outcome.",
          },
          {
            sourceKey: "jishi_reflections",
            relation: "context",
            note: "A discussion of what the proposal would and would not establish about the legend.",
          },
        ],
      },
    ],
  },
  {
    slug: "jishi-gorge-outburst-flood",
    title: "The Jishi Gorge outburst flood",
    summary:
      "An earthquake, a landslide dam across the Yellow River, and a breach releasing 11–16 cubic kilometres of water — one of the largest river floods of the Holocene, around 1920 BCE.",
    description:
      "<p>A landslide triggered by an earthquake dammed the Yellow River in Jishi Gorge. The lake behind it breached, releasing an estimated 11 to 16 cubic kilometres of water at a peak discharge near 400,000 cubic metres per second — roughly five hundred times the river's average, and among the largest known river floods of the Holocene.</p>" +
      "<p>That is the geological claim, and it is separate from what it has been argued to mean. The proposal that this is the flood behind the Yu tradition lives on the tradition's own record, with the published rebuttal beside it. <strong>This record is about the water.</strong></p>",
    category: "nature",
    subcategory: "Megaflood",
    eventType: "scientific_model",
    tags: ["flood", "china", "yellow-river", "megaflood", "jishi"],
    locationName: "Jishi Gorge, upper Yellow River, Qinghai, China",
    claims: [
      {
        sourceKey: "wu2016",
        startYear: bce(1920),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "radiometric_date",
        dateConvention: "calendar",
        whatIsDated: "The outburst flood itself",
        originalDateText: "c. 1920 BCE",
        datingMethod: "radiocarbon",
        chronology: "geological",
        evidence:
          "WHAT IS CLAIMED: the breach of a landslide-dammed lake in Jishi Gorge, releasing 11–16 cubic kilometres of water with a peak discharge near 400,000 cubic metres per second. HOW IT IS DATED: radiocarbon dating of material associated with the dam, the lake sediments and the destruction level at the Lajia site. WHAT IT ESTABLISHES: a very large outburst flood on the upper Yellow River. WHAT IT DOES NOT ESTABLISH: what anybody later remembered about it — that is the correlation, and it is argued over.",
        citations: [
          {
            sourceKey: "wu2016_comment",
            relation: "disputes",
            note:
              "The Comment challenges the chronology as well as the identification: it argues the dammed lake had drained long before the archaeological level the paper ties it to.",
          },
        ],
      },
    ],
  },
];

export const FLOOD_CHINA_LINKS: SeedEventLink[] = [
  {
    from: "jishi-gorge-outburst-flood",
    to: FLOOD_CHINA_ANCHOR_SLUG,
    relation: "relevant",
    viewpoint: "disputed",
    sourceKey: "wu2016",
    note:
      "RELEVANT, NOT EVIDENCE FOR — and here the distinction is not this timeline's editorial caution but the state of the literature. The identification was proposed in Science and disputed in Science, and the dispute is about whether the events are even contemporary. The flood happened; that it is the flood the tradition remembers is the contested part.",
  },
  {
    from: FLOOD_CHINA_ANCHOR_SLUG,
    to: "deucalion-flood",
    relation: "related",
    sourceKey: "great_flood_china",
    note:
      "Two traditions that a later historian turned into chronology — Sima Qian for Gun and Yu, the Parian compiler for Deucalion. Linked for that parallel in how they were HANDLED, which is a fact about historiography, and not for any resemblance between the floods themselves. The stories are not alike: one has an ark and a survivor, the other has an engineer.",
  },
];
