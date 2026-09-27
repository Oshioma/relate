import type { SeedEvent, SeedSource, SeedTrack } from "./seed-types";

const bce = (year: number): number => 1 - year;

export const ANCIENT_GREEK_APPEARANCE_ANCHOR_SLUG = "mycenaean-greeks-linear-b";
export const ANCIENT_GREEK_APPEARANCE_TRACK: SeedTrack = {
  name: "Ancient Greeks: appearance evidence",
  slug: "ancient-greeks-appearance",
  kind: "theme",
  color: "#8a5a44",
};

export const ANCIENT_GREEK_APPEARANCE_SOURCES: SeedSource[] = [
  { key:"british_museum_mycenaeans", title:"Greece: Minoans and Mycenaeans", publisher:"British Museum", url:"https://www.britishmuseum.org/collection/galleries/greece-minoans-and-mycenaeans", sourceType:"museum", notes:"Museum overview used for the identity boundary: Mycenaean Greece is the later Greek Bronze Age and Greek is first recorded there in Linear B; Minoan Linear A remains undeciphered." },
  { key:"aegean_genomics_2021", title:"The genomic history of the Aegean palatial civilizations", author:"Clemente et al.", workTitle:"Cell", url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC8127963/", sourceType:"academic_paper", publishedYear:2021, notes:"Ancient-DNA study. Pta08, Kou01 and Log02 were most likely predicted to have brown eyes, dark-brown/black hair and dark skin. The paper also warns through its methods that phenotype inference is probabilistic, not a portrait." },
  { key:"lazaridis_2017", title:"Genetic origins of the Minoans and Mycenaeans", author:"Lazaridis et al.", workTitle:"Nature", url:"https://www.nature.com/articles/nature23310", sourceType:"academic_paper", publishedYear:2017, notes:"Ancient-DNA study of Minoan and Mycenaean individuals; used for ancestry and hair/eye pigmentation context." },
  { key:"heraklion_cupbearer", title:"The Cup-Bearer Fresco", publisher:"Heraklion Archaeological Museum", url:"https://heraklionmuseum.gr/en/exhibit/the-cup-bearer-fresco/", sourceType:"museum", notes:"Official museum record, Knossos 1450–1400 BCE. Describes a young man rendered in the conventional male style with dark brown skin; the convention warning is part of the evidence, not a footnote to omit." },
  { key:"met_keftiu_gifts", title:"Gifts from the Keftiu, Tomb of Rekhmire", publisher:"The Metropolitan Museum of Art", url:"https://www.metmuseum.org/art/collection/search/544611", sourceType:"museum", notes:"Public-domain facsimile copied from TT100, ca. 1479–1425 BCE. The Met identifies the gift bearers as Cretans whom Egyptians called Keftiu." },
  { key:"met_aegean_islanders", title:"Aegean Islanders in the Tomb of Rekhmire", publisher:"The Metropolitan Museum of Art", url:"https://www.metmuseum.org/art/collection/search/544607", sourceType:"museum", notes:"Public-domain facsimile copied from TT100; an Egyptian representation of Aegean islanders, valuable as an external depiction rather than Aegean self-representation." },
  { key:"met_cretans_metal", title:"Cretans Bringing Gifts of Metal and Jewelry, Tomb of Rekhmire", publisher:"The Metropolitan Museum of Art", url:"https://www.metmuseum.org/art/collection/search/544608", sourceType:"museum", notes:"Public-domain facsimile of Aegean islanders/Cretans bringing metal ingots and vessels in TT100." },
  { key:"nam_warrior_krater", title:"The face of farewell — Warrior Krater", publisher:"National Archaeological Museum, Athens", url:"https://www.namuseum.gr/en/monthly_artefact/the-face-of-farewell/", sourceType:"museum", notes:"Official record for the 12th-century BCE Warrior Krater from Mycenae, showing Mycenaean warriors marching and fighting." },
  { key:"met_cretan_warrior", title:"Bronze warrior", publisher:"The Metropolitan Museum of Art", url:"https://www.metmuseum.org/art/collection/search/255360", sourceType:"museum", notes:"Official catalogue: Greek, Cretan, ca. 675–650 BCE. The Met notes the broad chest and narrow waist as surviving features from the Minoan period." },
];

const point=(sourceKey:string, year:number, text:string, evidence:string)=>({
  sourceKey, startYear:bce(year), datePrecision:"range", isApproximate:true,
  originalDateText:text, datingMethod:"archaeological_context", chronology:"conventional",
  evidence
});

export const ANCIENT_GREEK_APPEARANCE_EVENTS: SeedEvent[] = [
  {
    slug:"mycenaean-greeks-linear-b", title:"Mycenaean Greeks: Greek is recorded in Linear B",
    summary:"The identity anchor for this collection: Mycenaeans are Bronze Age Greeks, not merely an unnamed Aegean population.",
    description:"The British Museum describes Mycenaean Greece as the later Greek Bronze Age and states that Greek is first recorded in this period in Linear B. This record exists so appearance evidence attached to Mycenaeans can be labelled Ancient Greek / Bronze Age Greek without projecting that label indiscriminately onto Minoans or Cycladic people.",
    category:"History", subcategory:"Ancient Greeks", eventType:"evidence", tags:["ancient-greeks","mycenaean","linear-b","identity"], civilisations:["Mycenaean Greek"],
    claims:[point("british_museum_mycenaeans",1600,"Mycenaean Greece, later Greek Bronze Age","The museum identifies Mycenaean culture as Greek; this broad marker is contextual, not a single founding date.")]
  },
  {
    slug:"pta08-early-minoan-pigmentation", title:"Pre-Ancient Greek / Early Minoan Pta08: DNA pigmentation prediction",
    summary:"An Early Minoan male from Petras was genetically predicted most likely to have brown eyes, dark-brown/black hair and dark skin.",
    description:"Pta08 is labelled Pre-Ancient Greek / Bronze Age Aegean here, not Ancient Greek: Early Minoan identity is not the same evidentiary category as Greek-speaking Mycenaean identity. The phenotype is a probabilistic DNA prediction and must not be converted into a modern racial label.",
    category:"Science", subcategory:"Ancient DNA", eventType:"evidence", tags:["pre-ancient-greek","minoan","ancient-dna","appearance"], civilisations:["Early Minoan"], locationName:"Petras, Crete",
    claims:[{...point("aegean_genomics_2021",2849,"2849–2621 BCE","Radiocarbon range reported for Pta08; phenotype inference: brown eyes, dark-brown/black hair, dark skin most likely."),endYear:bce(2621)}]
  },
  {
    slug:"kou01-early-cycladic-pigmentation", title:"Pre-Ancient Greek / Early Cycladic Kou01: DNA pigmentation prediction",
    summary:"An Early Cycladic male from Koufonisi was genetically predicted most likely to have brown eyes, dark-brown/black hair and dark skin.",
    description:"Kou01 is Pre-Ancient Greek / Bronze Age Aegean, not labelled Greek without evidence. This is direct ancient-DNA phenotype inference, but still probabilistic.",
    category:"Science", subcategory:"Ancient DNA", eventType:"evidence", tags:["pre-ancient-greek","cycladic","ancient-dna","appearance"], civilisations:["Early Cycladic"], locationName:"Koufonisi",
    claims:[{...point("aegean_genomics_2021",2464,"2464–2349 BCE","Radiocarbon range reported for Kou01; phenotype inference: brown eyes, dark-brown/black hair, dark skin most likely."),endYear:bce(2349)}]
  },
  {
    slug:"log02-middle-helladic-pigmentation", title:"Pre-Ancient Greek / Middle Helladic Log02: DNA pigmentation prediction",
    summary:"A Middle Helladic woman from Logkas was genetically predicted most likely to have brown eyes, dark-brown/black hair and dark skin.",
    description:"Log02 predates the palatial Mycenaean period and is labelled Pre-Ancient Greek / Middle Helladic rather than being silently assigned a later identity. The study models modern Greek ancestry partly from populations related to this Bronze Age Aegean background plus later admixture.",
    category:"Science", subcategory:"Ancient DNA", eventType:"evidence", tags:["pre-ancient-greek","middle-helladic","ancient-dna","appearance"], civilisations:["Middle Helladic"], locationName:"Logkas, Greece",
    claims:[{...point("aegean_genomics_2021",1924,"1924–1831 BCE","Radiocarbon range reported for Log02; phenotype inference: brown eyes, dark-brown/black hair, dark skin most likely."),endYear:bce(1831)}]
  },
  {
    slug:"knossos-cup-bearer-dark-brown", title:"Pre-Ancient Greek / Minoan Cup-Bearer: museum describes dark brown skin",
    summary:"The Heraklion Archaeological Museum describes this life-size Minoan male figure as conventionally rendered with dark brown skin.",
    description:"This is strong evidence for how Minoan men were represented, not a literal skin-colour measurement. The museum itself calls the rendering conventional. It belongs beside DNA evidence, not in place of it.",
    category:"Art", subcategory:"Bronze Age Aegean", eventType:"artefact", tags:["pre-ancient-greek","minoan","fresco","appearance","artistic-convention"], civilisations:["Minoan"], locationName:"Knossos, Crete",
    media:[{url:"https://heraklionmuseum.gr/wp-content/uploads/2023/06/cup-bearer.jpg",caption:"Cup-Bearer Fresco, Knossos. Museum description explicitly says the male figure is conventionally rendered with dark brown skin.",sourcePageUrl:"https://heraklionmuseum.gr/en/exhibit/the-cup-bearer-fresco/",institution:"Heraklion Archaeological Museum",shows:"artefact",provenanceStatus:"institutional",provenanceNotes:"Use the museum catalogue as authority; colour is explicitly described as a convention of male representation."}],
    claims:[{...point("heraklion_cupbearer",1450,"1450–1400 BCE","Official museum dating of the Knossos Cup-Bearer Fresco."),endYear:bce(1400)}]
  },
  {
    slug:"rekhmire-aegean-islanders", title:"Pre-Ancient Greek / Aegean islanders depicted by Egyptians",
    summary:"The Tomb of Rekhmire preserves an Egyptian representation of Aegean islanders/Cretans, giving an external contemporary depiction.",
    description:"This evidence matters because it is not Aegean self-representation. The Met's facsimiles copy the New Kingdom tomb scene and identify the figures as Aegean islanders and Cretans/Keftiu. Egyptian colour conventions also apply, so complexion paint is evidence of representation, not a spectrophotometer reading of living skin.",
    category:"Art", subcategory:"Cross-cultural depiction", eventType:"artefact", tags:["pre-ancient-greek","aegean","keftiu","egypt","appearance"], civilisations:["Bronze Age Aegean","New Kingdom Egypt"], locationName:"Tomb of Rekhmire (TT100), Thebes",
    media:[
      {url:"https://images.metmuseum.org/CRDImages/eg/original/DP234997.jpg",caption:"Aegean Islanders in the Tomb of Rekhmire — Met public-domain facsimile of the ancient Egyptian scene.",sourcePageUrl:"https://www.metmuseum.org/art/collection/search/544607",institution:"The Metropolitan Museum of Art",creator:"Nina de Garis Davies",licence:"Public Domain",accessionNumber:"33.8.1",shows:"later_artwork",provenanceStatus:"institutional"},
      {url:"https://images.metmuseum.org/CRDImages/eg/original/DP234998.jpg",caption:"Cretans/Keftiu bringing gifts — another facsimile preserving the Rekhmire Aegean delegation.",sourcePageUrl:"https://www.metmuseum.org/art/collection/search/544611",institution:"The Metropolitan Museum of Art",creator:"Nina de Garis Davies",licence:"Public Domain",shows:"later_artwork",provenanceStatus:"institutional"},
      {url:"https://images.metmuseum.org/CRDImages/eg/original/DP234999.jpg",caption:"Cretans bringing metal and jewelry in the Rekhmire scene.",sourcePageUrl:"https://www.metmuseum.org/art/collection/search/544608",institution:"The Metropolitan Museum of Art",creator:"Nina de Garis Davies",licence:"Public Domain",shows:"later_artwork",provenanceStatus:"institutional"}
    ],
    claims:[{...point("met_aegean_islanders",1479,"ca. 1479–1396 BCE","Date of the Egyptian original represented by the Met facsimile."),endYear:bce(1396)}]
  },
  {
    slug:"mycenaean-warrior-krater", title:"Ancient Greek / Mycenaean warriors on the Warrior Krater",
    summary:"A 12th-century BCE vessel from Mycenae depicts groups of Mycenaean Greek warriors marching and fighting.",
    description:"These are Ancient Greek / Mycenaean figures by archaeological context. The vase is useful for dress, hair, armour and artistic representation. Painted complexion remains artistic evidence rather than a direct phenotype measurement.",
    category:"Art", subcategory:"Mycenaean Greek", eventType:"artefact", tags:["ancient-greeks","mycenaean","warriors","appearance"], civilisations:["Mycenaean Greek"], locationName:"Mycenae",
    claims:[point("nam_warrior_krater",1200,"12th century BCE","Official National Archaeological Museum dating; post-palatial Mycenaean context.")]
  },
  {
    slug:"archaic-greek-cretan-warrior", title:"Ancient Greek / Cretan warrior: museum-labelled Greek",
    summary:"The Met catalogues this bronze warrior, ca. 675–650 BCE, explicitly as Greek, Cretan.",
    description:"A useful endpoint for the evidence sequence: an unequivocally catalogued Archaic Greek Cretan figure. The Met notes that its broad chest and narrow waist preserve features from the Minoan period, providing an art-historical continuity observation without claiming ethnic identity continuity from body shape.",
    category:"Art", subcategory:"Archaic Greek", eventType:"artefact", tags:["ancient-greeks","cretan","archaic","warrior"], civilisations:["Ancient Greek"], locationName:"Crete",
    claims:[{...point("met_cretan_warrior",675,"ca. 675–650 BCE","Met catalogue date and culture: Greek, Cretan."),endYear:bce(650)}]
  }
];
