// FOUR CLAIMS ABOUT HORUS, AND WHERE EACH ONE CAME FROM.
//
// WHAT THIS DATASET IS. Not a debunking, and not a defence. Four claims that
// circulate widely — Horus born of a virgin, born on December 25, with twelve
// disciples, crucified — traced backwards through the people who made them
// until the chain either reaches an Egyptian source or stops.
//
// WHY IT IS BUILT AS GENEALOGIES RATHER THAN AS TRUE/FALSE RECORDS. Because
// the true/false question destroys the interesting part in both directions.
// Told the claims are false, a reader loses a real Egyptian conception story
// that is genuinely extraordinary. Told they are true, a reader loses the fact
// that "crucified" enters in 1882 in a footnote by a man citing a page that
// does not say it.
//
// THE FINDING THAT JUSTIFIES THE WHOLE APPARATUS. Doane, in 1882, writes
// "Horus was also crucified in the heavens" and cites Bonwick page 157.
// Bonwick page 157 says "With outstretched arms he is the vault of heaven."
// It does not say crucified, it does not say executed, and it does not say
// cross. THE CHAIN IS BROKEN AT A NAMED PAGE, and everything downstream of it
// — a century of repetition ending in a film watched by millions — rests on
// that misreading. No verdict can say that. A genealogy can.
//
// WHAT THE VERDICTS ARE AND ARE NOT. One claim comes back
// RELATED_TRADITION_EXISTS, and that is not a polite way of saying false: the
// Pyramid Texts really do describe Isis conceiving Horus from Osiris after
// Osiris is dead, in explicit language, and that is an extraordinary
// conception by any standard. It is also not a virginal one, and no Egyptian
// text calls Isis a virgin in the act. Both halves are true and only six
// verdicts can hold them.
//
// HORUS IS NOT ONE PERSON, and this is the methodological point that decides
// most of the results. Harsiese, the son of Isis, is not Haroeris, the elder
// Horus, is not Harpocrates the child. Plutarch himself distinguishes them.
// December 25 dissolves almost entirely on this point: the epagomenal birthday
// belongs to the ELDER Horus, and the solstice remark to HARPOCRATES, and the
// popular claim silently merges them into one biography.
//
// AND OSIRIS IS NOT HORUS. The death and dismemberment belong to the father.
// Where a later writer transfers them to the son, that transfer is itself a
// datable act and is recorded as one.
//
// ON WHAT HAS AND HAS NOT BEEN READ. Allen's Pyramid Texts, Plutarch, Bonwick
// 1878, Doane 1882, Graves 1875, Massey 1907 and the Zeitgeist companion guide
// were opened and are quoted from. Murdock's 2009 chapter, Massey's 1883
// Natural Genesis, Churchward, Higgins and Lenormant were NOT, and the records
// say so rather than inheriting other people's summaries of them.

import type { SeedEvent, SeedSource, SeedTrack } from "./seed-types";

export const HORUS_CLAIMS_ANCHOR_SLUG = "horus-conception-pyramid-texts";

export const HORUS_CLAIMS_TRACK: SeedTrack = {
  name: "Four claims about Horus, and where they came from",
  slug: "horus-claims",
  kind: "theme",
  color: "#7a52a8",
};

export const HORUS_CLAIMS_SOURCES: SeedSource[] = [
  {
    key: "allen_pyramid_texts",
    title: "The Ancient Egyptian Pyramid Texts",
    author: "James P. Allen",
    reference: "Teti spell 198, page 81",
    url: "https://archive.org/download/the-ancient-egyptian-pyramid-texts_202103/The%20Ancient%20Egyptian%20Pyramid%20Texts.pdf",
    sourceType: "religious_text",
    publishedYear: 2005,
    notes:
      "READ. The oldest evidence in this dataset for the conception of Horus, and the reason the virgin-birth " +
      "claim gets the verdict it does rather than a flat refusal. Allen's translation of Teti 198 preserves " +
      "the explicit sexual language: Isis aroused, the phallus, the seed, and Horus.\\n\\n" +
      "CITED FOR THE CONCEPTION AND NOT FOR THE WHOLE TRADITION. The missing phallus, the kite, and the " +
      "reassembly belong to other and later tellings, and must not be read back into this spell.",
  },
  {
    key: "plutarch_de_iside_horus",
    title: "De Iside et Osiride",
    author: "Plutarch",
    reference: "Sections 12, 18-19 and 65 (377C)",
    url: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Plutarch/Moralia/Isis_and_Osiris%2A/D.html",
    sourceType: "historical_document",
    notes:
      "READ. A Greek priest writing in the early second century CE, cited as evidence about Greco-Roman " +
      "reception rather than as a description of Egyptian religion — and cited here for two specific things " +
      "that between them dismantle the December 25 claim.\\n\\n" +
      "SECTION 12 gives the five epagomenal birthdays: Osiris first, Arueris — the ELDER Horus — second, Set " +
      "third, Isis fourth, Nephthys fifth. SECTION 65 says HARPOCRATES was born about the winter solstice, " +
      "and adds that his birth days were celebrated after the spring equinox.\\n\\n" +
      "NOTE THAT PLUTARCH IS ARGUING, NOT REPORTING, in section 65: he is recounting a seasonal explanation " +
      "in order to criticise it. And note that he distinguishes his prematurely born Harpocrates from the " +
      "son already at nurse in Buto, which is why 'Horus' cannot be treated as one biography.",
  },
  {
    key: "great_hymn_to_osiris",
    title: "The Great Hymn to Osiris, stela of Amenmose",
    reference: "Louvre C 286; New Kingdom",
    url: "https://collections.louvre.fr/ark:/53355/cl010026515",
    sourceType: "religious_text",
    notes:
      "PARTIALLY VERIFIED: the object and an available translation were opened; the exact Egyptian line " +
      "numbering and the authoritative edition were NOT checked. Cited for Isis searching, fanning air with " +
      "her wings, receiving Osiris's essence and producing the heir.\\n\\n" +
      "DO NOT IMPORT THE MISSING-PHALLUS ACCOUNT INTO THIS TEXT. That belongs to Plutarch, a thousand years " +
      "later and in Greek, and the habit of reading the whole composite myth into every witness to it is one " +
      "of the things this dataset exists to resist.",
  },
  {
    key: "met_metternich_stela",
    title: "Metternich Stela",
    workTitle: "The Metropolitan Museum of Art",
    reference: "Accession 50.85; 360-343 BCE",
    url: "https://www.metmuseum.org/art/collection/search/546037",
    sourceType: "artefact",
    notes:
      "READ (the museum catalogue record). Cited as the best-documented ancient object in which HORUS IS IN " +
      "DANGER: the child Horus mastering harmful animals, with a narrative of a scorpion sting and a cure. " +
      "It is the closest thing the ancient record offers to a suffering Horus, and it is a poisoning and a " +
      "healing. There is no cross in it.",
  },
  {
    key: "bonwick_1878",
    title: "Egyptian Belief and Modern Thought",
    author: "James Bonwick",
    reference: "Pages 157-158 and 370",
    url: "https://archive.org/stream/egyptianbeliefmo00bonw/egyptianbeliefmo00bonw_djvu.txt",
    sourceType: "historical_document",
    publishedYear: 1878,
    notes:
      "READ, AND IT IS THE HINGE OF THIS ENTIRE DATASET. Page 157 contains the sentence 'With outstretched " +
      "arms he is the vault of heaven.' That is a cosmological remark about a pose. IT DOES NOT SAY " +
      "CRUCIFIED, EXECUTED, OR CROSS.\\n\\n" +
      "Four years later Doane cites this page for the statement that Horus was crucified in the heavens. " +
      "Bonwick is therefore the source of a claim he did not make, which is a different thing from being " +
      "wrong, and the dataset records it that way.\\n\\n" +
      "ALSO CITED for the December 25 chain: Bonwick places a Horus image procession at 'Christmas time, or " +
      "that answering to our festival' and separately discusses the new sun on 25 December. HIS OWN ANCIENT " +
      "SOURCE FOR THAT FESTIVAL WAS NOT VERIFIED and this dataset does not supply one for him.",
  },
  {
    key: "doane_1882",
    title: "Bible Myths and their Parallels in other Religions",
    author: "T. W. Doane",
    reference: "Pages 163, 363-364, 476, 484 note 6, and index page 578",
    url: "https://www.gutenberg.org/files/31885/31885-h/31885-h.htm",
    sourceType: "historical_document",
    publishedYear: 1882,
    notes:
      "READ. The earliest located source for two of the four claims in their modern form, and the place a " +
      "citation chain visibly breaks.\\n\\n" +
      "ON CRUCIFIXION, page 484 note 6: 'Horus was also crucified in the heavens', citing Bonwick page 157. " +
      "The cited page does not say it. Doane supplies the verb. NOTE ALSO that his adjacent sentence puts " +
      "OSIRIS, not Horus, 'to the tree' — the two are not the same god and the sentence has been read as " +
      "though they were.\\n\\n" +
      "ON DECEMBER 25: the main text quotes Le Clerc de Septchênes for Isis's delivery 'towards the end of " +
      "December' and Bonwick for 'Christmas time', while the INDEX at page 578 assigns the date to Horus " +
      "outright. The index is more definite than anything the text supports, which is a small and very " +
      "characteristic way for a claim to harden.\\n\\n" +
      "ON VIRGIN BIRTH: calls Horus 'the Egyptian virgin-born Saviour' at page 163 and reads Isis " +
      "symbolically as dawn at page 476, with no Egyptian citation establishing virginity.",
  },
  {
    key: "graves_1875",
    title: "The World's Sixteen Crucified Saviors",
    author: "Kersey Graves",
    reference: "Around page 79",
    url: "https://archive.org/stream/worldssixteencr00gravgoog/worldssixteencr00gravgoog_djvu.txt",
    sourceType: "historical_document",
    publishedYear: 1875,
    notes:
      "READ, AND CITED PARTLY FOR A NEGATIVE. Graves places Horus in a catalogue of virgin-born saviours but " +
      "cites unnamed 'several authors' for a confused Egyptian infancy parallel, going so far as to call " +
      "Osiris's pursuer Amulius — a name out of Roman legend.\\n\\n" +
      "THE NEGATIVE MATTERS AS MUCH: the searchable occurrence of 'twelve disciples' in this book describes " +
      "KRISHNA, not Horus. Graves is routinely named as the origin of the twelve-disciples claim about " +
      "Horus, and the located passage does not support that attribution.",
  },
  {
    key: "massey_1907",
    title: "Ancient Egypt: The Light of the World",
    author: "Gerald Massey",
    reference: "Volume II, pages 638, 697-698, 752, 764, 803, 903, 911-912",
    url: "https://ia802800.us.archive.org/1/items/AncientEgyptTheLightOfTheWorldvolume2/GeraldMassey-AncientEgyptTheLightOfTheWorldVol.Ii.pdf",
    sourceType: "historical_document",
    publishedYear: 1907,
    notes:
      "READ, AND MORE CAREFUL THAN HIS REPUTATION. Massey is where the twelve-followers claim is first " +
      "verified in this investigation: he calls the Amenta harvest figure 'Horus-Khuti' with twelve " +
      "followers who are REAPERS, and then equates them with the twelve disciples.\\n\\n" +
      "ON CRUCIFIXION HE SAYS THE OPPOSITE OF WHAT HE IS CITED FOR. His reading is astronomical, moves " +
      "between Osiris, the elder Horus, Osiris-Tat and Ptah-Sekari, and he writes outright that the " +
      "word crucified belongs to a later terminology.' He is describing a cross-like cosmic support, not an " +
      "execution, and he knows the word is anachronistic.\\n\\n" +
      "HIS EGYPTIAN WARRANT IS UNVERIFIED THROUGHOUT. What is verified is what Massey said, which is a " +
      "different and still useful thing.",
  },
  {
    key: "zeitgeist_guide",
    title: "Zeitgeist: The Movie — Companion Guide",
    reference: "Pages 10-16, 21, 27-29 and 33; the film is of 2007",
    url: "https://zeitgeistmovie.com/wp-content/uploads/2023/12/ZeitgeistThe-MovieCompanionGuidePDF.pdf",
    sourceType: "website",
    publishedYear: 2007,
    notes:
      "READ (the guide; the film's own frames and transcript were NOT independently collated). The form in " +
      "which most people have met these claims, and the end of every chain in this dataset.\\n\\n" +
      "WHAT IT ADDS, CONSISTENTLY: a single simplified biography. Plutarch's distinct forms of Horus become " +
      "one person; 'about the winter solstice' becomes a date; Massey's celestial reapers become disciples " +
      "'he traveled about with'.\\n\\n" +
      "AND IT IS FAIRER THAN ITS CRITICS OFTEN ALLOW. The guide concedes that the motifs were assembled from " +
      "separate texts; it states that its own term 'crucified' does not mean thrown down and nailed to a " +
      "cross; and it notes that the papyrus image it reproduces is printed upside down. Those concessions " +
      "are recorded here because leaving them out would be the same failure in the opposite direction.",
  },
];

export const HORUS_CLAIMS_EVENTS: SeedEvent[] = [
  {
    slug: HORUS_CLAIMS_ANCHOR_SLUG,
    title: "Isis conceives Horus from a dead Osiris",
    summary:
      "Old Kingdom. The Pyramid Texts describe the conception in explicit language — Isis aroused, the phallus, the seed, and Horus. It is extraordinary. It is not a virgin birth, and no Egyptian text calls Isis a virgin in the act.",
    description:
      "WHAT KIND OF RECORD IS THIS? The ancient evidence under the most-repeated of the four claims, and the " +
      "reason that claim gets a careful verdict rather than a flat refusal.\\n\\n" +
      "WHAT THE TEXT SAYS. Teti spell 198, in Allen's translation, opens: 'Your sister Isis has come to you, " +
      "aroused [for] love of you.' The lines that follow specify the phallus and the seed and identify " +
      "Horus. The father is dead. THAT IS A GENUINELY EXTRAORDINARY CONCEPTION by any standard anyone has " +
      "ever applied, and a dataset that answered the virgin-birth claim with a simple no would be hiding it.\\n\\n" +
      "AND IT IS NOT A VIRGINAL CONCEPTION. There is a father, he is named, and the language is sexual. " +
      "Searching for an Egyptian epithet of Isis meaning virgin, maiden or pure APPLIED TO THIS ACT turned " +
      "up nothing — though one spell cannot establish an absence across the whole corpus, and the record " +
      "says so rather than claiming more than a search can give.\\n\\n" +
      "WHAT MUST NOT BE READ INTO THIS SPELL. The dismembered body, the missing phallus, the kite hovering, " +
      "the reassembly: those belong to other and later tellings, and Plutarch's version is Greek and a " +
      "thousand years younger. The habit of reading the whole composite myth into every witness to it is one " +
      "of the things this dataset resists, and it is how a spell about conception acquires details it does " +
      "not contain.\\n\\n" +
      "THINGS TO ASK: What would an ancient culture have to say for us to recognise a miraculous conception " +
      "on its own terms rather than through a later tradition's categories?",
    category: "religion",
    subcategory: "Old Kingdom",
    eventType: "religious_account",
    identificationStatus: "secure",
    tags: ["horus", "isis", "osiris", "pyramid-texts", "conception", "harsiese"],
    civilisations: ["Ancient Egypt"],
    locationName: "Saqqara, Egypt",
    passages: [
      {
        label: "Teti spell 198: the conception",
        reference: "Pyramid Texts, Teti spell 198; Allen 2005, page 81",
        sourceKey: "allen_pyramid_texts",
        objectName: "Pyramid Texts, inscribed in the pyramid of Teti",
        holdingInstitution: "In situ, Saqqara",
        layers: [
          {
            layer: "translation",
            sourceKey: "allen_pyramid_texts",
            content: "Your sister Isis has come to you, aroused [for] love of you.",
            language: "English",
            evidence:
              "ALLEN 2005, PAGE 81, QUOTED SHORT — the translation is in copyright. The lines following this " +
              "one specify the phallus and the seed and identify Horus; they are cited rather than " +
              "reproduced.\\n\\n" +
              "WHY THE SHORT QUOTATION IS ENOUGH: the word that decides the virgin-birth question is " +
              "'aroused', and the sexual character of what follows is not in dispute among translators. " +
              "WHAT IS NOT HERE and would improve this record: the Egyptian, a transliteration, and the " +
              "readings of other witnesses to the spell.",
            notes: "The bracketed word is Allen's.",
          },
          {
            layer: "modern_summary",
            sourceKey: null,
            content:
              "Isis comes to the dead Osiris, is described as aroused with love for him, and conceives Horus " +
              "from his seed.",
            evidence:
              "WHAT IT ESTABLISHES: conception from a dead father, in explicit language, in the oldest " +
              "substantial body of Egyptian religious writing. WHAT IT DOES NOT: that Isis was a virgin, " +
              "which this text neither says nor implies.",
          },
        ],
      },
    ],
    genealogies: [
      {
        key: "virgin-birth",
        claim: "Horus was born of the virgin Isis",
        verdict: "related_tradition_exists",
        verdictEvidence:
          "THE MOST INTERESTING OF THE FOUR VERDICTS, and the one a true/false flag destroys in both " +
          "directions.\\n\\n" +
          "WHAT IS REAL: the Pyramid Texts describe Isis conceiving Horus from Osiris AFTER OSIRIS IS DEAD. " +
          "That is an extraordinary conception on any account, it is ancient, and it is explicit.\\n\\n" +
          "WHAT IS NOT: a virgin birth. There is a named father and the language is sexual. No Egyptian text " +
          "located calls Isis a virgin in connection with conceiving this Horus.\\n\\n" +
          "WHERE THE CHRISTIAN VOCABULARY ENTERS: with Graves in 1875, who places Horus in a catalogue of " +
          "virgin-born saviours while citing unnamed 'several authors' — and who calls Osiris's pursuer " +
          "Amulius, a name out of Roman legend. Doane makes it explicit in 1882: 'the Egyptian virgin-born " +
          "Saviour', with no Egyptian citation for the virginity. Massey in 1907 writes 'Isis, the virgin' " +
          "inside an avowedly theological synthesis.\\n\\n" +
          "SO THE ANSWER IS NEITHER 'YES' NOR 'MADE UP'. An authentic and strange Egyptian tradition was " +
          "described in the vocabulary of a different religion, and the vocabulary then travelled without it.",
        whatWouldChangeThis:
          "A dated Egyptian inscription calling Isis a virgin IN THE ACT OF CONCEIVING THIS HORUS, giving " +
          "the Egyptian term, its context and a defensible translation. Or a demonstrably earlier text that " +
          "changes the account of the conception itself.\\n\\n" +
          "ALSO OUTSTANDING: the search for an epithet of Isis rendered virgin, maiden, great virgin, pure " +
          "or unmarried covered one spell, not the corpus. An absence found in Teti 198 is not an absence in " +
          "Egyptian religion, and this verdict does not claim otherwise.",
        links: [
          {
            stage: "ancient_primary",
            who: "Pyramid Texts, Teti spell 198",
            sourceKey: "allen_pyramid_texts",
            reference: "Allen 2005, page 81",
            says: "Your sister Isis has come to you, aroused [for] love of you.",
            adds:
              "The conception itself, from a dead father, in explicit terms — and NOT the word virgin. The " +
              "extraordinary part is ancient; the Christian description of it is not.",
            citationStatus: "verified",
          },
          {
            stage: "ancient_primary",
            who: "Great Hymn to Osiris, stela of Amenmose",
            sourceKey: "great_hymn_to_osiris",
            reference: "Louvre C 286, New Kingdom",
            says:
              "Isis searches for Osiris, fans air with her wings, receives his essence and produces the heir, " +
              "whom she raises in hiding.",
            adds:
              "The bird and wing imagery, and the hidden upbringing. NOT the missing phallus, which is " +
              "Plutarch's and is routinely read back into this hymn.",
            citationStatus: "unverified",
            notes:
              "The object and an available translation were opened; the exact line numbering and the " +
              "authoritative edition were not checked.",
          },
          {
            stage: "later_antiquity",
            who: "Plutarch, De Iside et Osiride",
            year: 120,
            sourceKey: "plutarch_de_iside_horus",
            reference: "Sections 18-19",
            says:
              "Describes the lost phallus, and says Isis had Harpocrates by Osiris after his decease; also " +
              "reports a Horus already at nurse before the search for the scattered limbs.",
            adds:
              "A late and internally awkward variant: the sequence does not line up, and the Horus at nurse " +
              "is not the child just conceived. THE CONFUSION OF FORMS BEGINS IN THE ANCIENT SOURCE, which " +
              "is worth knowing before blaming later writers for all of it.",
            citationStatus: "verified",
          },
          {
            stage: "alternative_interpretation",
            who: "Kersey Graves, The World's Sixteen Crucified Saviors",
            year: 1875,
            sourceKey: "graves_1875",
            reference: "Around page 79",
            says:
              "Places Horus in a catalogue of virgin-born saviours, citing unnamed 'several authors' for an " +
              "Egyptian infancy parallel, and names Osiris's pursuer Amulius.",
            adds:
              "The comparative Christian framing, with no Egyptian passage behind it. Amulius is a figure of " +
              "Roman legend, which is a fair measure of how close this is to an Egyptian source.",
            citationStatus: "broken",
            notes: "The chain to any ancient source ends here: the authorities are unnamed.",
          },
          {
            stage: "alternative_interpretation",
            who: "T. W. Doane, Bible Myths",
            year: 1882,
            sourceKey: "doane_1882",
            reference: "Pages 163 and 476",
            says:
              "Calls Horus 'the Egyptian virgin-born Saviour'; at page 476 reads Isis symbolically as the dawn.",
            adds:
              "THE EXPLICIT FORMULATION. Horus and virgin birth in one phrase, inside a solar allegory, and " +
              "still with no Egyptian citation establishing virginity.",
            citationStatus: "no_citation_given",
          },
          {
            stage: "alternative_interpretation",
            who: "Gerald Massey, Ancient Egypt: The Light of the World",
            year: 1907,
            sourceKey: "massey_1907",
            reference: "Volume II, page 764",
            says: "Speaks of 'Isis, the virgin' and of a dual Horus, in a comparison with Christian baptism.",
            adds:
              "An overt theological synthesis. Massey is arguing a system, not reporting a text, and the " +
              "sentence is his.",
            citationStatus: "unverified",
            notes: "Verified as Massey's statement; his Egyptian warrant was not.",
          },
          {
            stage: "popular_claim",
            who: "Zeitgeist: The Movie, and its companion guide",
            year: 2007,
            sourceKey: "zeitgeist_guide",
            reference: "Companion guide, pages 10-16",
            says: "Packages the virgin claim with a set of parallels to Jesus.",
            adds:
              "A single simplified biography, and mass circulation. Everything qualified upstream arrives " +
              "here unqualified.",
            citationStatus: "verified",
            notes: "The guide was read; the film's own frames and transcript were not independently collated.",
          },
          {
            stage: "current_scholarship",
            who: "James P. Allen, The Ancient Egyptian Pyramid Texts",
            year: 2005,
            sourceKey: "allen_pyramid_texts",
            reference: "Page 81",
            says: "The translation preserves the explicit sexual language of Teti 198 rather than softening it.",
            adds:
              "A checkable ancient text in its context — which is what the whole chain above was substituting " +
              "for.",
            citationStatus: "verified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "allen_pyramid_texts",
        startYear: -2349,
        endYear: -2149,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the spell was inscribed",
        originalDateText: "Old Kingdom; the pyramid of Teti",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the carving, which is not the composition. The Pyramid Texts are generally held to " +
          "be older than the walls they are written on by an unmeasured amount, and the inscribed date is " +
          "what the evidence gives.",
        notes: "NEEDS SOURCE VERIFICATION for Teti's reign dates and for the relation of this spell to other witnesses.",
      },
      {
        sourceKey: "allen_pyramid_texts",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether any Egyptian text calls Isis a virgin at this conception",
        originalDateText: "None located. One spell was searched, not the corpus",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "A NEGATIVE, RECORDED AS ONE, AND BOUNDED. What was searched: Teti 198 and the translations around " +
          "it. What was not: the rest of the Pyramid Texts, the Coffin Texts, the Book of the Dead, temple " +
          "inscriptions and the epithet literature.\\n\\n" +
          "SO THIS CLAIM SAYS 'NOT FOUND HERE' AND NOT 'DOES NOT EXIST'. The difference is the whole " +
          "discipline of the dataset, and it is easiest to lose on exactly this kind of question.",
      },
    ],
  },

  {
    slug: "horus-is-not-one-person",
    title: "Horus is not one person, and most of these claims depend on forgetting that",
    summary:
      "Not an event, and given no date. Harsiese, Haroeris and Harpocrates are different gods with different stories — and Plutarch, the source most often cited, distinguishes them himself.",
    description:
      "WHAT KIND OF RECORD IS THIS? The methodological condition the other records rest on, and the single " +
      "fact that dissolves most of the December 25 claim on its own.\\n\\n" +
      "THE FORMS, KEPT APART. HARSIESE, Hor-sa-Iset, Horus son of Isis: the heir conceived by Isis from " +
      "Osiris. HAROERIS, Arueris, Horus the Elder: placed among the five epagomenal births, and NOT the son " +
      "of Isis. HARPOCRATES, Har-pa-khered, the child form. HORUS OF BEHDET and the solar and sky forms, " +
      "with their own cults and iconography.\\n\\n" +
      "PLUTARCH DISTINGUISHES THEM HIMSELF, which matters because he is the source most often quoted for the " +
      "claims. At sections 18 and 19 he separates his prematurely born Harpocrates from a Horus already at " +
      "nurse in Buto. At section 12 the second epagomenal birthday belongs to Arueris, the elder.\\n\\n" +
      "WHAT HAPPENS WHEN THEY MERGE. December 25 is the clearest case: the epagomenal birthday belongs to " +
      "the ELDER Horus, and the winter-solstice remark to HARPOCRATES, and the popular claim attaches both " +
      "to the son of Isis. Three gods, two sources, one sentence.\\n\\n" +
      "AND OSIRIS IS NOT HORUS. The murder, the dismemberment and the death belong to the father. Where a " +
      "later writer transfers them to the son — Doane's own page puts OSIRIS, not Horus, to the tree — that " +
      "transfer is a datable act by a named person, and is recorded as one rather than silently inherited.\\n\\n" +
      "WHY THIS IS NOT PEDANTRY. Egyptian religion ran for thousands of years across many regions and " +
      "theologies. Asking what 'Horus' did is like asking what 'the saint' did. Syncretic and solar " +
      "identifications are real and are themselves historical events to be documented — they are not " +
      "permission to write one continuous biography.\\n\\n" +
      "THINGS TO ASK: When a tradition has many forms of one god, what is the honest unit of description?",
    category: "religion",
    subcategory: "Method",
    eventType: "mainstream",
    identificationStatus: "secure",
    tags: ["horus", "harsiese", "haroeris", "harpocrates", "method", "conflation"],
    civilisations: ["Ancient Egypt"],
    claims: [
      {
        sourceKey: "plutarch_de_iside_horus",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Which Horus a claim is about",
        originalDateText: "A standing distinction, not an event",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHY THIS CARRIES NO DATE: it is a condition of reading the evidence, not something that happened. " +
          "WHAT IS ESTABLISHED: that the forms are distinct, and that Plutarch — the source most quoted in " +
          "these comparisons — distinguishes them himself at sections 12, 18 and 19. WHAT FOLLOWS: a claim " +
          "that does not say which Horus it is about has not yet said anything checkable.",
      },
    ],
  },

  {
    slug: "horus-december-25-claim",
    title: "December 25: three gods, two passages, one date that is in neither",
    summary:
      "Plutarch puts the ELDER Horus on the second epagomenal day and HARPOCRATES near the winter solstice — while adding that his birth was celebrated after the spring equinox. The fixed date appears in an 1882 index.",
    description:
      "WHAT KIND OF RECORD IS THIS? The claim that comes apart most completely when the forms of Horus are " +
      "kept separate, and a demonstration of how a hedge disappears.\\n\\n" +
      "WHAT PLUTARCH ACTUALLY SAYS, in two different places about two different gods. Section 12 gives the " +
      "five epagomenal birthdays — Osiris first, ARUERIS THE ELDER HORUS second, Set third, Isis fourth, " +
      "Nephthys fifth. Section 65 says HARPOCRATES was born about the time of the winter solstice.\\n\\n" +
      "AND THEN SECTION 65 ADDS THE PART NOBODY QUOTES: that his birth days were celebrated AFTER THE SPRING " +
      "EQUINOX. Plutarch is recounting a seasonal explanation in order to criticise it. The passage most " +
      "often produced as evidence for a solstice birthday is Plutarch arguing against reading it that way.\\n\\n" +
      "THE CALENDAR PROBLEM, WHICH IS REAL AND IS NOT THE WHOLE ANSWER. The five epagomenal days were added " +
      "to a 360-day year, and in the traditional 365-day civil calendar they drift against the seasons. So " +
      "an epagomenal birthday does not sit at a fixed Julian date at all. BUT THE DATASET DOES NOT REST ON " +
      "THAT ALONE: 'the Egyptians had a different calendar' is a true answer that dodges the real question, " +
      "which is whether any festival of any Horus fell near a solstice. One did, near enough for Plutarch to " +
      "mention it, and about Harpocrates.\\n\\n" +
      "WHERE THE DATE ITSELF ENTERS. Bonwick in 1878 places a Horus image procession at 'Christmas time, or " +
      "that answering to our festival' — an analogy, with his own ancient source unverified. Doane in 1882 " +
      "quotes Le Clerc de Septchênes for Isis's delivery 'towards the end of December' and Bonwick for " +
      "'Christmas time' — and then his INDEX, at page 578, assigns December 25 to Horus outright.\\n\\n" +
      "THAT GAP BETWEEN A BOOK'S TEXT AND ITS OWN INDEX is a very characteristic way for a claim to harden: " +
      "nobody decided anything, an indexer needed a short entry, and the qualification had nowhere to go.\\n\\n" +
      "THINGS TO ASK: How many claims are firmer in a book's index than in its argument?",
    category: "religion",
    subcategory: "Modern reception",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["horus", "harpocrates", "haroeris", "december-25", "calendar", "solstice", "epagomenal"],
    civilisations: ["Ancient Egypt", "Greco-Roman world", "Modern world"],
    genealogies: [
      {
        key: "december-25",
        claim: "Horus was born on December 25",
        verdict: "later_interpretation",
        verdictEvidence:
          "NO ANCIENT SOURCE LOCATED GIVES A FIXED DATE, and the two passages produced for it are about two " +
          "different gods, neither of them the son of Isis.\\n\\n" +
          "Plutarch section 12 puts the ELDER Horus on the second epagomenal day. Section 65 puts " +
          "HARPOCRATES near the winter solstice — and immediately adds that the birth days were celebrated " +
          "AFTER THE SPRING EQUINOX, because he is criticising the seasonal reading rather than endorsing " +
          "it.\\n\\n" +
          "WHAT IS A REAL LEAD AND SHOULD NOT BE DISMISSED: a solstice association and a solar rebirth do " +
          "exist in the material. The step that is modern is the conversion into a fixed Julian 25 December " +
          "attached to Horus son of Isis.\\n\\n" +
          "WHAT THIS VERDICT DOES NOT CLAIM: that no festival of any form of Horus occurred near a solstice " +
          "anywhere. It is the much narrower finding that no fixed December 25 birthday for Horus was " +
          "documented.",
        whatWouldChangeThis:
          "A securely dated Egyptian, Alexandrian or Roman-Egyptian calendar pairing a NAMED form of Horus " +
          "with December 25 in a SPECIFIED calendar — not a modern solstitial calculation, and not a Khoiak " +
          "date converted by assumption.\\n\\n" +
          "ALSO OUTSTANDING: Bonwick's own source for his Horus procession at 'Christmas time', and Le Clerc " +
          "de Septchênes in the original.",
        links: [
          {
            stage: "later_antiquity",
            who: "Plutarch, De Iside et Osiride, section 12",
            year: 120,
            sourceKey: "plutarch_de_iside_horus",
            reference: "Section 12",
            says:
              "The epagomenal birthdays: Osiris on the first, Arueris — Horus the Elder — on the second, Set " +
              "on the third, Isis on the fourth, Nephthys on the fifth.",
            adds:
              "An actual list of divine birthdays. FOR THE ELDER FORM, and in a calendar whose days drift " +
              "against the seasons. Neither the date nor the god the claim needs.",
            citationStatus: "verified",
          },
          {
            stage: "later_antiquity",
            who: "Plutarch, De Iside et Osiride, section 65",
            year: 120,
            sourceKey: "plutarch_de_iside_horus",
            reference: "Section 65, 377C",
            says:
              "Harpocrates was born about the time of the winter solstice; his birth days were celebrated " +
              "after the spring equinox.",
            adds:
              "A genuine solstice association — and, in the same breath, the detail that removes it as " +
              "evidence for a birthday. Plutarch is criticising the seasonal explanation, not reporting a " +
              "festival date.",
            citationStatus: "verified",
          },
          {
            stage: "early_scholarship",
            who: "James Bonwick, Egyptian Belief and Modern Thought",
            year: 1878,
            sourceKey: "bonwick_1878",
            reference: "Pages 157-158 and 370",
            says:
              "Places a procession of a Horus image at 'Christmas time, or that answering to our festival', " +
              "and separately discusses the new sun on 25 December.",
            adds:
              "THE CHRISTIAN SEASONAL ANALOGY, in a book by an Egyptologist. Not a dated Egyptian festival " +
              "inscription, and his own ancient source for the procession was not verified.",
            citationStatus: "unverified",
          },
          {
            stage: "alternative_interpretation",
            who: "T. W. Doane, Bible Myths",
            year: 1882,
            sourceKey: "doane_1882",
            reference: "Pages 363-364, and the index at page 578",
            says:
              "The text says 25 December was the birthday of Egyptian gods, quoting Le Clerc de Septchênes " +
              "for Isis's delivery 'towards the end of December' and Bonwick for 'Christmas time'. The index " +
              "at page 578 assigns the date to Horus.",
            adds:
              "THE CLAIM IN ITS MODERN FORM, AND IT ENTERS IN AN INDEX. The index is more definite than " +
              "anything the text supports: 'towards the end of December' and 'Christmas time' become " +
              "December 25 attached to Horus. Nobody decided this; a hedge simply had nowhere to go in a " +
              "short entry.",
            citationStatus: "broken",
            notes:
              "The chain to any Egyptian calendar ends here. Neither cited authority supplies a fixed date " +
              "for Horus.",
          },
          {
            stage: "popular_claim",
            who: "Zeitgeist: The Movie, and its companion guide",
            year: 2007,
            sourceKey: "zeitgeist_guide",
            reference: "Companion guide, pages 10-16",
            says: "States a December 25 birthday as one datum in a Horus biography.",
            adds:
              "Removes the distinction between Plutarch's forms, and removes the word 'about'. Three gods " +
              "become one and an approximation becomes a date.",
            citationStatus: "verified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "plutarch_de_iside_horus",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether any ancient source gives Horus a fixed December 25 birthday",
        originalDateText: "None located. Two passages, two other gods, no fixed date",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "A BOUNDED NEGATIVE. What was searched: Plutarch sections 12 and 65, and the nineteenth-century " +
          "chain that cites them. What was not: Roman-Egyptian festival calendars, Alexandrian religious " +
          "calendars, and local Khoiak observances.\\n\\n" +
          "WHY THE CALENDAR ARGUMENT IS NOT ENOUGH ON ITS OWN: 'the Egyptians used a different calendar' is " +
          "true and dodges the question, which is whether a festival of a Horus fell near a solstice. One " +
          "did, and Plutarch mentions it, and it is Harpocrates, and he is arguing against reading it as a " +
          "birthday.",
      },
    ],
  },

  {
    slug: "horus-twelve-followers-claim",
    title: "Twelve disciples: Massey's celestial reapers, and what they became",
    summary:
      "Massey in 1907 gives a harvest figure in the Egyptian underworld twelve followers who are reapers, and equates them with the twelve apostles. By 2007 they are disciples Horus travelled about with.",
    description:
      "WHAT KIND OF RECORD IS THIS? The clearest case in the dataset of a claim changing category rather " +
      "than changing truth value.\\n\\n" +
      "WHAT MASSEY ACTUALLY WROTE, in 1907. He describes a figure he calls Horus-Khuti in the Amenta, the " +
      "Egyptian underworld, with twelve followers who are REAPERS in a harvest scene. He then equates those " +
      "twelve with the twelve disciples of Jesus. The equation is his, it is astrotheological, and it is " +
      "openly an interpretation.\\n\\n" +
      "WHAT IT BECOMES. In the Zeitgeist companion guide, page 21: 'Horus had 12 disciples he traveled about " +
      "with.' Celestial harvest helpers in an underworld have become an itinerant teacher's companions on " +
      "the road. Nothing was falsified; a category was swapped.\\n\\n" +
      "WHAT THE EGYPTIAN MATERIAL ACTUALLY OFFERS, and it is not nothing. Twelvefold schemes are real — " +
      "twelve hours of the day and of the night, twelve divisions of the Duat, and figures in Field of Reeds " +
      "scenes. THOSE ARE PLAUSIBLE RAW MATERIAL AND THEY ARE NOT DISCIPLES. The FOUR sons of Horus are a " +
      "different group again, and the Shemsu-Hor, the followers of Horus, are a different category still.\\n\\n" +
      "A NEGATIVE WORTH RECORDING. Kersey Graves is routinely named as the origin of this claim. The " +
      "searchable occurrence of 'twelve disciples' in his 1875 book describes KRISHNA, not Horus. An " +
      "attribution that everybody repeats did not survive being checked.\\n\\n" +
      "AND AN HONEST GAP. Whether Massey said it earlier — in the Natural Genesis of 1883 — or whether " +
      "Churchward, Higgins or Lenormant said it first, was NOT established. The claim is not backdated to " +
      "1883 here, because a page was not found.\\n\\n" +
      "THINGS TO ASK: What happens to a claim when it moves from the sky to a road?",
    category: "religion",
    subcategory: "Modern reception",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["horus", "twelve-disciples", "massey", "shemsu-hor", "amenta", "astrotheology"],
    civilisations: ["Ancient Egypt", "Modern world"],
    genealogies: [
      {
        key: "twelve-disciples",
        claim: "Horus had twelve disciples",
        verdict: "later_interpretation",
        verdictEvidence:
          "NO EGYPTIAN TEXT LOCATED GIVES A NAMED HORUS TWELVE DISCIPLES. The oldest explicit " +
          "twelve-followers formulation verified here is Massey's, in 1907, and his twelve are REAPERS in " +
          "the Amenta — celestial harvest helpers in an underworld, equated by him with the apostles.\\n\\n" +
          "WHAT THE MATERIAL DOES OFFER: twelvefold hours, twelve divisions of the Duat, and figures in " +
          "Field of Reeds scenes. Real number symbolism, and not a teacher with pupils. THE FOUR sons of " +
          "Horus and the Shemsu-Hor are different groups again, and conflating any of them with disciples is " +
          "the step under examination.\\n\\n" +
          "AND A CHECKED NEGATIVE THAT OVERTURNS A COMMON ATTRIBUTION: the 'twelve disciples' passage in " +
          "Graves 1875 is about KRISHNA. He is repeatedly named as the origin of this claim about Horus and " +
          "the located passage does not support it.\\n\\n" +
          "THE GUIDE ITSELF CONCEDES the motifs were assembled from separate texts, which is worth recording " +
          "because it is more candid than the claim's critics usually allow.",
        whatWouldChangeThis:
          "An Egyptian text or securely catalogued scene identifying exactly TWELVE NAMED BEINGS as the " +
          "disciples of a NAMED form of Horus, with date, provenance and context. Twelve depicted reapers " +
          "alone would support the narrower 'twelve followers' formulation and not the disciples one.\\n\\n" +
          "ALSO OUTSTANDING, and it would move the date rather than the verdict: whether Massey's 1883 " +
          "Natural Genesis, or Churchward, Higgins or Lenormant, asserted this first. THE CLAIM IS NOT " +
          "BACKDATED TO 1883 HERE because no page was found. And Lenormant, whom the guide cites for solar " +
          "'companions', needs checking in the original French for what the twelve actually refers to.",
        links: [
          {
            stage: "ancient_primary",
            who: "Twelvefold schemes: hours, Duat divisions, Field of Reeds scenes",
            saysAbsentReason:
              "NOT FOUND as a specific object. Twelvefold schemes are real and well attested, but no " +
              "particular scene, papyrus, line and set of twelve names was located behind Massey's reading.",
            adds:
              "Number symbolism that is genuinely available as raw material — and, on its own, nothing about " +
              "disciples.",
            citationStatus: "unverified",
          },
          {
            stage: "alternative_interpretation",
            who: "Kersey Graves, The World's Sixteen Crucified Saviors",
            year: 1875,
            sourceKey: "graves_1875",
            reference: "Searched full text",
            says: "The located 'twelve disciples' passage describes Krishna, not Horus.",
            adds:
              "NOTHING TO THIS CLAIM, and that is the finding. Graves is routinely named as its origin, and " +
              "the checked passage does not attribute twelve disciples to Horus at all.",
            citationStatus: "misattributed",
            notes:
              "Recorded as misattributed against the CLAIM rather than against Graves: he did not say this " +
              "about Horus, and later writers have credited him with it.",
          },
          {
            stage: "alternative_interpretation",
            who: "Gerald Massey, Ancient Egypt: The Light of the World",
            year: 1907,
            sourceKey: "massey_1907",
            reference: "Volume II, pages 803, 903 and 911-912",
            says:
              "Calls the Amenta harvest figure Horus-Khuti and gives him twelve followers who are reapers; " +
              "then equates the twelve followers of Har-Khuti with the twelve disciples of Jesus.",
            adds:
              "THE CONVERSION, AND THE CLAIM ENTERS HERE. Celestial and harvest helpers become an apostolic " +
              "parallel. The equation is explicit, it is Massey's, and it is the earliest verified in this " +
              "investigation.",
            citationStatus: "verified",
            notes: "Verified as Massey's argument. The underlying Egyptian identification of twelve persons was not.",
          },
          {
            stage: "popular_claim",
            who: "Zeitgeist: The Movie, and its companion guide",
            year: 2007,
            sourceKey: "zeitgeist_guide",
            reference: "Companion guide, page 21",
            says:
              "'Horus had 12 disciples he traveled about with.' The guide notes that the motifs are " +
              "reconstructed from separate texts.",
            adds:
              "THE CHANGE OF CATEGORY. Massey's reapers in an underworld become companions on a road with an " +
              "itinerant teacher — a claim about a life, which Massey's celestial reading never made.",
            citationStatus: "verified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "massey_1907",
        startYear: 1907,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The earliest verified twelve-followers formulation",
        originalDateText: "Massey, Ancient Egypt: The Light of the World, 1907",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: a publication, which is a firm kind of date. WHAT IT IS NOT: a proof of priority. " +
          "Earlier claimants were not ruled out, and the record says so rather than treating the earliest " +
          "thing found as the first thing said.",
        notes:
          "NEEDS SOURCE VERIFICATION for Massey's Natural Genesis of 1883, Churchward, Higgins and " +
          "Lenormant. Any of them could move this date.",
      },
    ],
  },

  {
    slug: "horus-crucified-claim",
    title: "Crucified: a sentence about the vault of heaven, and the footnote that changed it",
    summary:
      "Bonwick in 1878 wrote that with outstretched arms Horus is the vault of heaven. Doane in 1882 cited that page for 'Horus was also crucified in the heavens'. The page does not say it.",
    description:
      "WHAT KIND OF RECORD IS THIS? The case this whole apparatus was built for, and the one where the " +
      "chain visibly snaps at a named page.\\n\\n" +
      "WHAT BONWICK WROTE, in 1878, at page 157: 'With outstretched arms he is the vault of heaven.' That is " +
      "a remark about a pose and a cosmology. It does not say crucified. It does not say executed. It does " +
      "not say cross.\\n\\n" +
      "WHAT DOANE WROTE, four years later, at page 484 note 6: 'Horus was also crucified in the heavens' — " +
      "citing Bonwick page 157. THE VERB IS DOANE'S. The citation is real, the page is real, and the page " +
      "does not contain the claim it is cited for. That is not a lie and it is not a forgery; it is a " +
      "reading that hardened into a quotation, and it is the single most instructive object in this " +
      "dataset.\\n\\n" +
      "AND DOANE'S OWN ADJACENT SENTENCE puts OSIRIS, not Horus, 'to the tree'. The father's death has been " +
      "sitting next to the son's supposed crucifixion on the same page for over a century.\\n\\n" +
      "WHAT MASSEY SAID, WHICH IS NOT WHAT HE IS CITED FOR. His 1907 reading is astronomical — the djed or " +
      "Tat pillar as a cross-like cosmic support, solar death, movement between Osiris, the elder Horus, " +
      "Osiris-Tat and Ptah-Sekari. AND HE SAYS OUTRIGHT THAT THE WORD 'CRUCIFIED' BELONGS TO A LATER " +
      "TERMINOLOGY. The man most often blamed for the claim flagged the anachronism himself.\\n\\n" +
      "WHAT THE ANCIENT RECORD OFFERS INSTEAD. The Metternich Stela, Metropolitan Museum 50.85, of 360-343 " +
      "BCE: the child Horus mastering dangerous animals, with a narrative of a scorpion sting and a cure. A " +
      "real Horus in real danger, and a healing. No cross.\\n\\n" +
      "THE MODERN VERSION IS MORE CAREFUL THAN ITS REPUTATION TOO. The Zeitgeist companion guide states that " +
      "its own term 'crucified' does not mean thrown down and nailed to a cross, and notes that the papyrus " +
      "image it reproduces is printed upside down. Recording that is not a defence of the claim; leaving it " +
      "out would be the same failure this record is about, committed in the other direction.\\n\\n" +
      "THINGS TO ASK: How many citations that everybody repeats have been opened by anybody?",
    category: "religion",
    subcategory: "Modern reception",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["horus", "crucifixion", "doane", "bonwick", "massey", "djed", "broken-citation"],
    civilisations: ["Ancient Egypt", "Modern world"],
    genealogies: [
      {
        key: "crucifixion",
        claim: "Horus was crucified",
        verdict: "later_interpretation",
        verdictEvidence:
          "THE CHAIN BREAKS AT A NAMED PAGE, and that is the finding.\\n\\n" +
          "Doane, 1882, page 484 note 6, writes 'Horus was also crucified in the heavens' and cites Bonwick " +
          "page 157. BONWICK PAGE 157 SAYS 'With outstretched arms he is the vault of heaven.' It does not " +
          "say crucified, executed, or cross. Doane supplies the verb, and everything downstream of that " +
          "footnote rests on it.\\n\\n" +
          "WHAT THE ANCIENT RECORD HAS INSTEAD: the Metternich Stela, Met 50.85, 360-343 BCE — the child " +
          "Horus among dangerous animals, stung by a scorpion and healed. No Egyptian narrative checked " +
          "attests an execution of Horus, and none attests thieves.\\n\\n" +
          "MASSEY, WHO IS MOST OFTEN BLAMED, SAYS THE OPPOSITE. His reading is astronomical — the djed as a " +
          "cross-like cosmic support — and he states outright that the word crucified belongs to a later " +
          "terminology. The guide likewise says its 'crucified' does not mean nailed to a cross. THE " +
          "METAPHORICAL DEFENCE IS PART OF THE RECORD and must not be recast as a claim of literal Roman " +
          "execution.\\n\\n" +
          "THE SEPARATE THINGS THIS VERDICT KEEPS APART: execution on a cross; binding to a tree, which in " +
          "Doane's own adjacent sentence is OSIRIS; arms extended in a cross-like pose; the ankh as a sign " +
          "of life; celestial 'crucifixion'; the death of Horus; the death of Osiris. Collapsing any two of " +
          "them is how this claim is usually either made or dismissed.",
        whatWouldChangeThis:
          "A pre-Christian Egyptian text or identified artefact explicitly showing a NAMED Horus bound to, " +
          "executed on, or killed on a cross — with provenance, accession number and inscription. For " +
          "'between two thieves', the two companions must be IDENTIFIED IN THE SOURCE and not inferred from " +
          "flanking figures.\\n\\n" +
          "SPECIFICALLY OUTSTANDING: the earliest source for 'on a cross' naming Horus, and for 'between two " +
          "thieves', were NOT FOUND in the books opened. And the illustration reproduced from Sharpe page " +
          "143 has no identified original — museum, accession, date, provenance and the identity of the " +
          "depicted figure are all unknown, and the guide's reproduction of it is inverted. No object-level " +
          "record can be made from a redrawn and upside-down illustration.",
        links: [
          {
            stage: "ancient_primary",
            who: "Metternich Stela, Metropolitan Museum 50.85",
            sourceKey: "met_metternich_stela",
            reference: "360-343 BCE; Met accession 50.85",
            says:
              "The child Horus masters dangerous animals; the narrative concerns a scorpion sting and a cure.",
            adds:
              "A real instance of Horus in danger, securely dated and accessioned — and no cross, no " +
              "execution, and a recovery.",
            citationStatus: "verified",
          },
          {
            stage: "early_scholarship",
            who: "James Bonwick, Egyptian Belief and Modern Thought",
            year: 1878,
            sourceKey: "bonwick_1878",
            reference: "Page 157",
            says: "With outstretched arms he is the vault of heaven.",
            adds:
              "A cosmological remark about a pose. NOT an execution, NOT a cross, NOT the word crucified — " +
              "and no object identified for the figure he is describing.",
            citationStatus: "verified",
          },
          {
            stage: "alternative_interpretation",
            who: "T. W. Doane, Bible Myths",
            year: 1882,
            sourceKey: "doane_1882",
            reference: "Page 484, note 6, citing Bonwick page 157",
            says: "Horus was also crucified in the heavens.",
            adds:
              "THE VERB. Doane adds 'crucified' to Bonwick's cosmic pose and cites Bonwick for it. The cited " +
              "page does not say it. EVERYTHING AFTER THIS LINK RESTS ON THIS FOOTNOTE.\\n\\n" +
              "His adjacent sentence puts OSIRIS, not Horus, to the tree — the two have been sitting next to " +
              "each other on this page for a century.",
            citationStatus: "misattributed",
          },
          {
            stage: "alternative_interpretation",
            who: "Gerald Massey, Ancient Egypt: The Light of the World",
            year: 1907,
            sourceKey: "massey_1907",
            reference: "Volume II, pages 638, 697-698 and 752",
            says:
              "An astronomical underworld reading, moving between Osiris, the elder Horus, Osiris-Tat and " +
              "Ptah-Sekari, of the djed as a cross-like cosmic support — with the explicit observation that " +
              "the word crucified belongs to a later terminology.",
            adds:
              "A deliberately retrospective reading, AND ITS OWN DISCLAIMER. Massey is routinely cited as " +
              "the authority for a literal claim he flagged as anachronistic.",
            citationStatus: "verified",
          },
          {
            stage: "popular_claim",
            who: "Zeitgeist: The Movie, and its companion guide",
            year: 2007,
            sourceKey: "zeitgeist_guide",
            reference: "Companion guide, pages 27-29 and 33",
            says:
              "Quotes Doane's 'in the heavens', reproduces an illustration after Sharpe page 143, and " +
              "relates the pose to a sky-spanning falcon. At page 33 it states that its term 'crucified' " +
              "does not mean thrown down and nailed to a cross.",
            adds:
              "A strong visual Christian comparison — and, at page 33, an explicit metaphorical defence. The " +
              "guide also notes that the image it prints is upside down. Both concessions are recorded here.",
            citationStatus: "verified",
            notes:
              "The Sharpe illustration has no identified original object, museum, accession, date or " +
              "provenance. Murdock's 2009 chapter, cited by the guide, was NOT read.",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "doane_1882",
        startYear: 1882,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The earliest located 'crucified in the heavens'",
        originalDateText: "Doane, Bible Myths, 1882, page 484 note 6",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the publication in which the wording is first located here, with its citation to " +
          "Bonwick — which is what makes the break checkable rather than asserted. WHAT IS NOT DATED: the " +
          "variants 'on a cross' and 'between two thieves', whose earliest sources were NOT FOUND in the " +
          "books opened.",
        notes:
          "NEEDS SOURCE VERIFICATION for those two variants, and for Sharpe's page 143 illustration, which " +
          "has no identified original object.",
      },
      {
        sourceKey: "met_metternich_stela",
        startYear: -359,
        endYear: -342,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Metternich Stela",
        originalDateText: "360-343 BCE, per the Metropolitan Museum",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: an accessioned object in a named museum, on the museum's own catalogue record. " +
          "WHY IT IS ON THIS RECORD: it is the best-documented ancient instance of Horus in danger, and what " +
          "it shows is a poisoning and a cure.",
      },
    ],
  },
];
