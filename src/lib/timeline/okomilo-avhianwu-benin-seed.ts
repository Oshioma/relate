// THE OKOMILO FAMILY → INNIH → OGBONA → AVHIANWU → KINGDOM OF BENIN.
//
// A family history and a community history, kept in ONE track and NEVER
// allowed to merge into one line. The documented and family-supplied part runs
// from Oshioma Okomilo back to Sam Ikhenemho Okomilo and stops at Sam's father,
// whose name is not yet known. Everything older — the Okomilo kindred of Innih,
// Ivhitse, Ivhiochie, Ogbona, Imhakhena, Anwu and Alokoko, and the migration
// from Benin — is community genealogy and oral tradition. Between the two sits
// a record that says, in so many words, that the intermediate generations have
// not been documented. Tests hold every part of that in place.
//
// TWO BENINS. This track is about the KINGDOM OF BENIN — Benin City, Edo
// State, NIGERIA. It has nothing to do with the Republic of Benin (formerly
// Dahomey), and no record here may be tagged, linked or described as if it did.
//
// HOW IT WAS RESEARCHED, AND WHAT THAT MEANS FOR A READER. The research
// environment's network policy blocked every host the material lives on —
// ogbonaelites.org, Wikimedia Commons, Wikipedia, the Met, archive.org, the
// library catalogues — so everything here was gathered from SEARCH-ENGINE
// SNIPPETS, which are short and sometimes paraphrased. Every source records
// that, the quotations are marked as snippet-level, and several sources are
// recorded precisely BECAUSE they could not be opened. The research report in
// docs/okomilo-avhianwu-research-report.md lists every search that came back
// empty so nobody has to run it again.
//
// LANES. The track is one track; the lanes are the record's subcategory —
// "Okomilo family", "Innih & Ogbona", "Avhianwu oral history", "Traditional
// religion", "Migrations", "Colonial record", "Kingdom of Benin context",
// "Material culture" and "Open questions / debates" — and tags carry the
// evidence class and the genealogy layer (documented / unknown / tradition).

import type { SeedClaim, SeedEvent, SeedEventLink, SeedPicture, SeedSource, SeedTrack } from "./seed-types";
import { commonsFilePathUrl } from "./check-pictures";

export const OKOMILO_TRACK: SeedTrack = {
  name: "Okomilo family, Ogbona and Avhianwu (Kingdom of Benin, Nigeria)",
  slug: "okomilo-avhianwu-benin",
  kind: "theme",
  color: "#8a5a2b",
};

export const OKOMILO_ANCHOR_SLUG = "okomilo-oshioma-son-of-sam";

/** The lanes, as subcategories. Exported so tests and the UI agree on spelling. */
export const OKOMILO_LANES = {
  family: "Okomilo family",
  innih: "Innih & Ogbona",
  avhianwu: "Avhianwu oral history",
  religion: "Traditional religion",
  migrations: "Migrations",
  colonial: "Colonial record",
  benin: "Kingdom of Benin context",
  material: "Material culture",
  open: "Open questions / debates",
} as const;

/**
 * THE GENEALOGY LAYER every record sits in, carried as a tag so the break in
 * the line is queryable and testable rather than only described.
 */
export const GENEALOGY_LAYER_TAGS = {
  documented: "genealogy:documented-or-family-supplied",
  unknown: "genealogy:unknown-generations",
  tradition: "genealogy:community-genealogy-and-oral-tradition",
  context: "genealogy:context-not-ancestry",
} as const;

const SNIPPET =
  "READ AT SNIPPET LEVEL ONLY: the page itself could not be opened from the research environment (network " +
  "policy), so what is recorded here is what search-engine snippets of it said, which may be abridged or " +
  "paraphrased. Check the wording at the URL before quoting it.";

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const COMMUNITY_SOURCES: SeedSource[] = [
  // --- Family testimony ----------------------------------------------------
  {
    key: "family_testimony",
    title: "Okomilo family testimony supplied to this investigation",
    author: "Oshioma Okomilo (on behalf of the Okomilo family)",
    sourceType: "interview",
    publishedYear: 2026,
    publishedDisplay: "Supplied October 2026",
    notes:
      "FAMILY-SUPPLIED PRIMARY TESTIMONY, given directly by Oshioma Okomilo when commissioning this research. It is the " +
      "source for: Sam Ikhenemho Okomilo being Oshioma's father; Sam's birth in Jos in the early-to-mid 1940s; his being " +
      "sent home to Ogbona in 1948 so that he would learn Ogbona/Avhianwu culture; his mother Uwomha Ikhuenena and her " +
      "father Pa Asekomhe; and the family account of Sam's father (WWII service with British West African forces, time in " +
      "Egypt, later life in Jos and Ibadan, a burial recorded in 1983). It is NOT derived from any website, and nothing in " +
      "this dataset presents it as though it were a document.",
  },
  {
    key: "research_lead_s_okomilo",
    title: "Research lead: 'S. Okomilo', photographic trainee, c.1960, in an official Nigerian publication",
    author: "Supplied with the commissioning brief",
    sourceType: "other",
    publishedYear: 2026,
    notes:
      "A LEAD, NOT A SOURCE THAT HAS BEEN READ. The brief reports an official Nigerian archival/government publication " +
      "naming 'S. Okomilo' as a photographic trainee around 1960, alongside 'M. U. Eriavbe'. Searches for the phrase, the " +
      "name, the co-trainee and the likely Federation of Nigeria Official Gazette issues (1960–62) did not surface the " +
      "document, so its title, issuing body and page remain unknown. Recorded so the identification question has a home.",
  },
  // --- ogbonaelites.org (community history; several pages reproduce Okhaishie 1999) ---
  {
    key: "oe_profiles",
    title: "Profiles of Ogbona Prominent Persons",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/profiles-of-some-of-ogbona-men-and-women/",
    sourceType: "website",
    notes:
      "Community history website. Cited for Sam Ikhenemo Okomilo's profile: born early 1940s in Jos 'to the families of " +
      "Okomilo and Ikhuenena both of Ivhiochie quarter'; St John's Primary School, Ogbona, taught by Chief Patrick O. " +
      "Oboarekpe under headmaster Chief M.C.K. Orbih; EDC Secondary Model School, Igbhe Road, Auchi, 1957; Blessed " +
      "Martins, Jattu, 1959; a Federal Ministry of Education job in Ibadan, the archive department, then UCH Ibadan " +
      "medical-photography training 1960–1962; LUTH; London 1964; O and A levels; Edinburgh PPE 1970–1972. " +
      SNIPPET,
  },
  {
    key: "oe_footprints",
    title: "Footprints of Ogbona Sons and Daughters",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/footprints-of-ogbona-sons-and-daughters/",
    sourceType: "website",
    notes:
      "Community history website. Cited for: Sam Ikhenemo Okomilo as 'the first journalist from Ogbona' and 'Publisher of " +
      "the London based African News File, a parent magazine that also publishes: AFRICA TODAY, WHO IS WHO IN AFRICA AND " +
      "MAKERS OF MODERN AFRICA'; and Veronica Okomilo among 'the first set of females from Ogbona to go to school' with " +
      "Catherine Ogbualo, Agbedebo Idode and Ashetu Idode. WARNING: a search summary merged a 1991 burial on this page " +
      "(of General Marshal Ileghieuma Sunday Bolivia Osigbemhe, a musician) into Sam's entry; that burial is NOT Sam's and " +
      "is not used. " +
      SNIPPET,
  },
  {
    key: "oe_palace_villages",
    title: "Palace of Okphe-Ukpi of Ogbona Approved Villages (3rd Edition)",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/palace-of-okphe-ukpi-of-ogbona-approved-villages-3rd-edition-2/",
    sourceType: "website",
    notes:
      "Community/palace list. Cited for Pa Simeon Okomilo listed as an Innih representative, with Chief John Ogedegbe for " +
      "Innih; and for the quarter structure (Ivhiochie divided into quarters including Ivhiobore, Ivhiosano and Ivhitse; " +
      "Ivhitse containing villages including Akpheokhai, Enamino, Innih and Ototo). The date of the 3rd edition was not " +
      "visible. " +
      SNIPPET,
  },
  {
    key: "oe_kindreds",
    title: "Ogbona Sub-Clan, Villages and the Kindreds/Families and Palace Chiefs (November 2024)",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/ogbona-sub-clan-villages-and-the-kindreds-families/",
    sourceType: "website",
    publishedYear: 2024,
    publishedDisplay: "November 2024",
    notes:
      "Community list. Cited for 'Innih Village has the Okomilo Family as one of its nine kindred families' — Asekomhe, " +
      "Azoganokhai, Emoekpere, Idegbesor, Iniaru, Odogbo, Ogedegbe, Okomilo and Onokozi — and for Chief John Ogedegbe as " +
      "palace chief of Innih. It does NOT say how the nine families are related. " +
      SNIPPET,
  },
  {
    key: "oe_churches",
    title: "Churches in Ogbona (tag page)",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/tag/churches-in-ogbona/",
    sourceType: "website",
    notes:
      "Community history. Cited for St John the Baptist Catholic Church, Ogbona, 'established in the early 20s', its " +
      "pioneer lay faithful including GEORGE OKOMILO, and seven members — Eramha David Agbiko Enamino, George Okomilo, " +
      "Robert Odogbo, Cletus Anaweokhai, Nicholas Asekomhe, Martins Esi and Richard Asekomhe — 'found culpable', given " +
      "'fourteen strokes of cane each with two months of imprisonment which were served at Auchi prison', in a related " +
      "snippet dated 1931–1932, for opposing 'pagan practices like sacrifices to idols, okhei traditional rites'. " +
      SNIPPET,
  },
  {
    key: "oe_descendants",
    title: "Descendants of Imhakhena (category pages)",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/category/descendants-of-imhakhena/",
    sourceType: "website",
    notes:
      "Community genealogy. Cited for: 'Ogbona was the first born of Imhakhena who was the last born of Anwu… Ogbona later " +
      "gave birth to two children, OKHUA and OMIERELE. Okhua later had OCHIE, OREVHOR, UDOKHAKOR while OMIERELE had " +
      "OKHOTOR and ANAGA'; and for the Asekomhe dynasty text ('Pa Asekomhe was the first son of Pa Ekhaegbai, whose " +
      "father, Pa Ereghi, was the patriarch of today's Asekomhe Dynasty'; Pa Ereghi 'believed to be a direct offspring of " +
      "the great Imhakhena'; Imhakhena's ancestral home 'at the site of the present-day Asekomhe family compound'; the " +
      "'Oghie Descendants (Apoghie, meaning origin)'). Attribution of the Asekomhe text to this exact page is probable, " +
      "not certain. " +
      SNIPPET,
  },
  {
    key: "oe_history_tag",
    title: "Ogbona History and Culture (tag page)",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/tag/ogbona-history-and-culture/",
    sourceType: "website",
    notes:
      "Community history. Cited for the Imhakhena → Ogbona → Okhua/Omierele genealogy (same wording as oe_descendants — " +
      "one text on two pages, not two confirmations), for Imhakhena settling at Utagbabor and moving to Ore Okhiye 'where " +
      "his mother, Alokoko later joined him', and for the Alokoko python purification. " +
      SNIPPET,
  },
  {
    key: "oe_major_events",
    title: "Major Events in Avhianwu History — by Aha Idokpesi Okhaishe n'Avhianwu",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/major-events-in-avhianwu-history-by-aha-idokpesi-okhaishe-n-avhianwu/",
    sourceType: "website",
    notes:
      "A REPRODUCTION OF THE 1999 BOOK'S CHRONOLOGY, by its own byline — so it is the same source as okhaishie_1999, not a " +
      "second one. Cited for: 1481–85 Anwu's 'First Migration' from Benin; 1485 d'Aveiro in Benin; c.1570 'Ivhianwu " +
      "migrated from Afashio-uzairue (Second Migration)'; c.1830 Nupe invasion; c.1886 'Oghie Omiawa of Avhianwu " +
      "introduced the system of each village giving 25 slaves to the Nupes every other year'; 1897 Nupe withdrawal; 1918 " +
      "divisional headquarters at Fugar; 1930 mass arrest of Christians; 1932 clan Native Administrations; 1937 Native " +
      "Clan Courts; 1939 'Hitler War'; 1945 returning soldiers 'inundated the Avhianwu clan with money demanding their " +
      "wives'. " +
      SNIPPET,
  },
  {
    key: "oe_kukuruku",
    title: "The Creation of Kukuruku Division — Aha Idokpesi Okhaishe n'Avhianwu",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/the-creation-of-kukuruku-division-aha-idokpesi-okhaishe-n-avhianwu/",
    sourceType: "website",
    notes:
      "A reproduction of material from Okhaishie 1999. Cited for Kukuruku Division 'created in 1918 with its Headquarters " +
      "at Fugar', J. C. Walker as first District Officer, the Royal Niger Company's handover of Kukuruku to the British " +
      "government in 1899, renaming as Afenmai in 1956, and 'C. B. Denton, Esquire', Acting District Officer, dealing " +
      "with the Avhianwu Clan Council over a Fugar Boys' Society petition. " +
      SNIPPET,
  },
  {
    key: "oe_iraokhor",
    title: "History of Iraokhor",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/history-of-iraokhor/",
    sourceType: "website",
    notes:
      "Community history of Iraokhor (Iviuralokhor, 'children of Uralokhor'). Cited for: Iraokhor's people 'migrated from " +
      "Benin in company of their parents (ANWU and ALOKOKO)'; a migration in the 'middle of the 15th Century during the " +
      "reign of Oba Eware the Great', prompted by a three-year mourning decree forbidding childbirth; Anwu as 'the third " +
      "son of Azama'; the four sons and the communities they founded; first settlement at Afashio under Omoazekpe. NOTE: " +
      "this page's Ewuare dating and the same site's Okhaishie timeline (Ozolua, 1481–85) disagree. " +
      SNIPPET,
  },
  {
    key: "oe_adl",
    title: "Ogbona Elites, Azama genealogy (category 'adl')",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/category/adl/",
    sourceType: "website",
    notes:
      "Cited for: 'Azama was a Bini man who married Ughiosomhe [Ughiosomhi], the mother of Imekeye [Imekele], Ikpemhi, " +
      "Anwu and Omoazekpe [founder of Afashio]'; 'Azama's second wife was Etso, the mother of Ekpa and Anno'. " +
      SNIPPET,
  },
  {
    key: "oe_okhe_palace",
    title: "The Palace of the Okphe-Ukpi of Ogbona",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/the-palace-of-the-okphe-ukpi-of-ogbona-2/",
    sourceType: "website",
    notes:
      "Community history. Cited for the Okphe-Ukpi title (Chief Akpabeghie of Ivhioverah, Akpabeghie village, Okotor, " +
      "'once held the Ukpi title, known as Okphe-Ukpi') and for the 1891 dating of the Okhe incident: 'Following the " +
      "assassination of Akhenavhianwu, a grandson of Omiawa by an Ogbona non-initiate (Ogbhari) in 1891, Ogbona was " +
      "banned… until 1908 when Okoghor… and Arekameh from Iviukasa established… a separate Ogiamotsu at Utu-looko'. Which " +
      "of the site's pages carries which dating was not always clear from the snippets. " +
      SNIPPET,
  },
  {
    key: "oe_clan_split",
    title: "Avianwu clan has been split into Fugar and Anwu clans, with Ogbona and Iraokhor now in Anwu clan",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/avianwu-clan-has-been-split-into-fugar-and-anwu-clans-with-ogbona-and-iraokhor-now-in-anwu-clan/",
    sourceType: "website",
    publishedYear: 2024,
    notes:
      "Community news. Cited for the 2024 split of Avianwu clan, the Ogieavianwu remaining head of Anwu clan, and — quoting " +
      "'Akhigbe' — the 1851 dating of the Okhe incident: 'Fugar banned Ogbona from performing the Okhe title because in " +
      "1851, an uninitiated man (Ogbhari) from Ogbona killed a title holder, a certain Akenavhianwu, the grandson of " +
      "Omiawa… Ogbona set up its own Ogwa shrine'. Who 'Akhigbe' is, and where he wrote, was not established. " +
      SNIPPET,
  },
  {
    key: "oe_names",
    title: "Etsako Names and Meanings",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/etsako-names-and-meanings/",
    sourceType: "website",
    notes:
      "Community onomastics. Cited for 'Oshiomah means \"God makes the plans\"', names prefixed 'Osi, Esi and Osho are names " +
      "that reverence God', and 'Oshomah… means \"God decides\"'. NO entry for Okomilo, Ikhenemho or Innih was found. " +
      "Attribution of these glosses to this exact page is probable, not certain. " +
      SNIPPET,
  },
  {
    key: "oe_chiefs",
    title: "Profile of Traditional Chiefs of Ogbona",
    publisher: "Ogbona Elites (ogbonaelites.org)",
    url: "https://ogbonaelites.org/profile-of-traditional-chiefs-of-ogbona/",
    sourceType: "website",
    notes:
      "Community list of chiefs. Cited for the village headship of Innih (Chief John Oshiomhogho Ogedegbe, title " +
      "'Okhaemho') and for an Ogedegbe genealogy in which 'Okoko was the father of Imhomo, Innih, Esuka' — the only text " +
      "found that treats INNIH as a personal name. Which page carried the Ogedegbe genealogy was not certain. " +
      SNIPPET,
  },
  // --- The 1999 book and its predecessors ------------------------------------
  {
    key: "okhaishie_1999",
    title: "The Descent of Avhianwu",
    author: "Aha Idokpesi Okhaishie n'Avhianwu",
    publisher: "Stirling-Horden Publishers, Ibadan",
    publishedYear: 1999,
    reference: "c.174 pp.; 'Historical Antecedents of the Migration' c. p.8; 'Second Migration' c. p.17 (page locations as supplied with the brief, not checked)",
    url: "http://www.stirlinghorden.com/viewbook.php?tab=0000000047",
    sourceType: "book",
    citedBy: "oe_major_events",
    notes:
      "THE FULLEST WRITTEN AVHIANWU HISTORY FOUND, AND NOT OPENED. Listed by the publisher and on AbeBooks; no table of " +
      "contents, index or bibliography was reachable, so WHAT THIS BOOK CITES REMAINS UNKNOWN — the single most important " +
      "gap in the source chain. Its chronology (1481–85 first migration, c.1570 second migration, c.1886 Omiawa's levy, " +
      "1918, 1930, 1932, 1937…) is known only through its reproduction on ogbonaelites.org.",
  },
  {
    key: "omo_ananigie_1946",
    title: "A Brief History of Etsakor: Being a Critique of the History of Etsakor (in three parts)",
    author: "Peter Inahoureme Omo-Ananigie",
    publisher: "Ope Ife Press, Lagos (Charles Gore's bibliography gives 'Ope-Ifa Press')",
    publishedYear: 1946,
    reference: "Simon Ottenberg collection of Nigerian pamphlets, Hoover Institution Library & Archives (microfilm)",
    url: "https://oac.cdlib.org/findaid/ark:/13030/c8c53q7m/entire_text/",
    sourceType: "book",
    citedBy: "stanwilly_2012",
    notes:
      "THE OLDEST PUBLISHED ETSAKO HISTORY LOCATED, AND NOT OPENED. Its existence, author's full name, subtitle, publisher " +
      "and a holding (Hoover, Ottenberg pamphlet microfilm) are now established. Through two later blogs it is credited " +
      "with an OLUKU tradition — 'Oluku had 5 sons: Uzairue, Ekperi, Ayawun, Weppa and Wanno' — in which 'Ayawun' is " +
      "plausibly Avianwu, and with Adenomo's persecution of Oluku's family. NO Omo-Ananigie text naming Anwu, Alokoko, " +
      "Ewuare or Ozolua has been seen. Page numbers for the origins section are not established.",
  },
  {
    key: "denton_1936_etsako",
    title: "Political Intelligence Report on the Etsako Clans of the Kukuruku Division",
    author: "N. Denton (as given in the brief; a 'C. B. Denton' and an 'H. C. B. Denton' appear in other sources)",
    publishedYear: 1936,
    reference: "National Archives of Nigeria, Ibadan — file number NOT located",
    sourceType: "government",
    notes:
      "NOT LOCATED AND NOT OPENED. No catalogue entry, microfilm reel or quotation was found under this title. What WAS " +
      "found: (1) a Lagos Museum archive record of an 'Intelligence Report on Ifeku Island, Benin Province', Kukuruku " +
      "Division, October 1936, by 'Mr H.C.B. Denton'; (2) a 'C. B. Denton, Esquire', Acting District Officer of Kukuruku " +
      "Division, in the reproduced Okhaishie text; (3) sibling Kukuruku clan reports of 1937 by D. P. Stanfield; (4) CRL's " +
      "16-reel microfilm 'Intelligence reports on southern Nigeria'. The initial, the exact title and the content of the " +
      "Etsako report all remain to be checked. Nothing in this dataset quotes it.",
  },
  {
    key: "denton_1936_ifeku",
    title: "Intelligence Report on Ifeku Island, Benin Province (Kukuruku Division)",
    author: "H. C. B. Denton",
    publisher: "Lagos National Museum archive (catalogue record)",
    publishedYear: 1936,
    publishedDisplay: "October 1936",
    url: "https://lagosmuseum.ng/items/6c9e326c-c943-4afe-8bbc-b5b7cfef7dbb",
    sourceType: "government",
    notes:
      "A real 1936 Denton intelligence report from Kukuruku Division — but on Ifeku Island, not the Etsako clans. Recorded " +
      "because it establishes the officer, the year and an archive where his reports are catalogued. " +
      SNIPPET,
  },
  {
    key: "stanfield_1937",
    title: "Intelligence Reports on the Awain and Aviele Clans, Kukuruku Division",
    author: "D. P. Stanfield",
    publisher: "Lagos National Museum archive (catalogue records)",
    publishedYear: 1937,
    url: "https://lagosmuseum.ng/items/38b24bff-886b-455d-92fd-8b33d7bd770d",
    sourceType: "government",
    notes:
      "Sibling 1937 clan intelligence reports in the same archive (Aviele: https://lagosmuseum.ng/items/e7a03569-35ea-48e0-" +
      "a9c6-93667ca7ae33). The closest catalogued analogues to the Etsako report; no Avianwu report was found in the " +
      "listing. " +
      SNIPPET,
  },
  {
    key: "crl_intel",
    title: "Intelligence reports on southern Nigeria, c.1930–1943 (16 microfilm reels)",
    publisher: "Center for Research Libraries",
    url: "https://catalog.crl.edu/record/34651?ln=en",
    sourceType: "government",
    notes: "Microfilm set that includes Benin Province reports. Not searched reel-by-reel; the obvious next place to look for Denton. " + SNIPPET,
  },
  // --- Later secondary and online sources ----------------------------------
  {
    key: "stanwilly_2012",
    title: "Etsako people of Nigeria: history and…",
    publisher: "stanwilly.blogspot.com",
    publishedYear: 2012,
    url: "http://stanwilly.blogspot.com/2012/01/etsako-people-of-nigeria-history-and.html",
    sourceType: "website",
    notes:
      "Blog that quotes Omo-Ananigie 1946 for the Oluku tradition; also says the Etsako migrated 'in stages during the " +
      "reigns of Oba Ewuare and Oba Ozolua'; a snippet says 'Anwu, also called \"Ofugar\" was once living in a quarter " +
      "called \"Uzora\" in Benin City' (not confirmed by a direct search). " +
      SNIPPET,
  },
  {
    key: "nuntiuspacis",
    title: "The Origin of the Etsako People",
    publisher: "Nuntius Pacis",
    url: "https://nuntiuspacis.org/the-origin-of-the-etsako-people/",
    sourceType: "website",
    notes:
      "Cites Omo-Ananigie (Oluku, Adenomo; 'Uzairue married Azama… eight sons of whom Ikpe was the eldest') and Rev. A. O. " +
      "Anaemhomhe (the Etsako 'emigrated from Edo (Benin)… about the 13th and the 14th Century'; 'Gen. Adaobi led away " +
      "from Benin'). " +
      SNIPPET,
  },
  {
    key: "borgatti_2003",
    title: "The Otsa Festival of the Ekperi",
    author: "Jean Borgatti",
    publisher: "African Arts",
    publishedYear: 2003,
    reference: "African Arts, Winter 2003",
    url: "https://go.gale.com/ps/i.do?id=GALE%7CA120033589&sid=googleScholar&v=2.1&it=r&linkaccess=abs&issn=00019933&p=AONE&sw=w",
    sourceType: "academic_paper",
    notes:
      "Peer-reviewed. Cited for: 'Local histories suggest that they [Ekperi] and the neighboring Uzairhue, Avianwu, and " +
      "Uwepa-Uwano descend from a common Edo ancestor, Oluku.' The underlying evidence is explicitly local history. " +
      SNIPPET,
  },
  {
    key: "erhagbe_1982",
    title: "The Nupe invasion of Etsakoland: its impact on the socio-political development of the Etsako clans, c.1860–1897",
    author: "Edward O. Erhagbe",
    publisher: "MA thesis, Department of History, University of Benin",
    publishedYear: 1982,
    url: "https://www.si.edu/object/nupe-invasion-etsakoland-its-impact-socio-political-development-etsako-clans-c-1860-1897-edward-o:siris_sil_466221",
    sourceType: "academic_paper",
    notes:
      "Scholarly thesis on the Nupe period, catalogued by Smithsonian Libraries (a snippet also mentions a 1991 publication). " +
      "Not opened; recorded as the scholarly anchor for the Nupe record and as a likely place where Denton and Omo-Ananigie " +
      "are cited.",
  },
  {
    key: "afenmaiconnect_uzairue",
    title: "A Brief History of Uzairue Kingdom, Etsako West Local Government Area, Edo State, Nigeria",
    publisher: "Afenmai Connect",
    url: "https://www.afenmaiconnect.com/a-brief-history-of-uzairue-kingdom-etsako-west-local-government-area-edo-statenigeria/",
    sourceType: "website",
    notes:
      "Shares the 'Anwu, the third son of Azama' wording with ogbonaelites, and says Anwu 'founded Avhianwu Kingdom while " +
      "his step brothers, Uneme and Ekperi founded all Uneme and all Ekperi'. Shared wording means shared origin, not " +
      "independent confirmation. " +
      SNIPPET,
  },
  {
    key: "fugar_america",
    title: "Our History",
    publisher: "Fugar America Foundation",
    url: "https://www.fugaramericafoundation.org/our-history/",
    sourceType: "website",
    notes:
      "Fugar diaspora organisation. Repeats the Afashio/Omoazekpe narrative, the four sons and 'about the 16th century when " +
      "Oba Ozolua ruled' — very probably derived from Okhaishie 1999 or its ogbonaelites reproduction, so NOT an " +
      "independent confirmation of the Ozolua dating. Also gives Fugar lineages migrating 'between the 13th and 15th " +
      "centuries' and records Edo State's approval of the clan split on 21 February 2024. " +
      SNIPPET,
  },
  {
    key: "guardian_ogbona",
    title: "Though we are mainly farmers, we love making music and melody in Ogbona",
    publisher: "The Guardian (Nigeria), Sunday Magazine",
    url: "https://guardian.ng/sunday-magazine/though-we-are-mainly-farmers-we-love-making-music-and-melody-in-ogbona/",
    sourceType: "newspaper",
    notes:
      "Newspaper feature: Ogbona 'founded by Imonkhena, one of the four large communities that make up the Avianwon clan'; " +
      "a summary also has it 'founded about 1892', which conflicts with every other account and is recorded, not adopted. " +
      SNIPPET,
  },
  {
    key: "wiki_afemai",
    title: "Afemai people",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Afemai_people",
    sourceType: "wikipedia",
    notes: "Cited for 'Historical accounts claimed that they migrated from Benin during the tyrannical rule of Oba Ewuare' — no source for that sentence was visible. " + SNIPPET,
  },
  {
    key: "edoworld_etsako",
    title: "The Benins in Diaspora: Etsako",
    publisher: "edoworld.net",
    url: "https://edoworld.net/The_Benins_In_Diaspora_Etsako.html",
    sourceType: "website",
    notes: "Places most Etsako migration under Ozolua; glosses 'Etsako' as 'those who file their teeth'. " + SNIPPET,
  },
  {
    key: "forebears_okomilo",
    title: "Okomilo surname distribution",
    publisher: "Forebears",
    url: "https://forebears.io/surnames/okomilo",
    sourceType: "website",
    notes:
      "Cited for: 'Okomilo is most numerous in Nigeria, where it is borne by 46 people… primarily found in: Delta (35%), " +
      "Edo (28%) and Oyo (28%).' A modelled estimate, not a census; useful mainly as evidence that the surname is rare. " +
      SNIPPET,
  },
  {
    key: "know_africa_catalogue",
    title: "Makers of Modern Africa: profiles in history (library catalogue records)",
    author: "Ralph Uwechue (publisher and editor-in-chief)",
    publisher: "Africa Books Ltd, London, 1991; earlier edition Africa Journal Ltd, 1981",
    url: "https://library.au.int/makers-modern-africa-4",
    sourceType: "encyclopedia",
    notes:
      "Catalogue evidence (African Union library; Lafayette College libcat in00000257623) that the 'Know Africa' titles — " +
      "Africa Today, Africa Who's Who, Makers of Modern Africa — are credited to Ralph Uwechue as publisher and " +
      "editor-in-chief. Companies-register listings for Africa Books Ltd name Uwechue family members and Kojo Oparko Adaah " +
      "as officers. OKOMILO DOES NOT APPEAR in any catalogue snippet. This does not contradict family and community " +
      "accounts of Sam's role — a magazine house's staff and associated publishers are rarely in a book's catalogue record " +
      "— but it means that role is not yet documented. " +
      SNIPPET,
  },
  {
    key: "jich_2020_repatriation",
    title: "'No Longer Required for Operations': Troops' Repatriation to West Africa after the Second World War, 1945–1950",
    publisher: "Journal of Imperial and Commonwealth History",
    publishedYear: 2020,
    url: "https://www.tandfonline.com/doi/full/10.1080/03086534.2020.1765536",
    sourceType: "academic_paper",
    notes:
      "Peer-reviewed. Cited for West African garrison companies — eleven of them from Nigeria — that 'disembarked in the " +
      "Middle East at the end of hostilities between September–October 1945 and January 1946', for Nigerian Pioneers " +
      "already in the Middle East by April 1945, and for troops left 'stranded on foreign soils of India and North Africa'. " +
      "The article's footnotes will carry the TNA and Nigerian file references. " +
      SNIPPET,
  },
  {
    key: "korieh_ww2",
    title: "Nigeria and World War II: Colonialism, Empire, and Global Conflict",
    author: "Chima J. Korieh",
    publisher: "Cambridge University Press",
    url: "https://assets.cambridge.org/97811084/44279/frontmatter/9781108444279_frontmatter.pdf",
    sourceType: "academic_book",
    notes:
      "Cited for Nigerians deployed 'as soldiers and workers… to theaters of war in Europe and the Middle East', and for a " +
      "photograph captioned with a Nigerian serviceman 'and fellow African military servicemen in the Middle East', 8 " +
      "April 1945. " +
      SNIPPET,
  },
  {
    key: "jos_tin_labour",
    title: "Forced labour on the Jos tin fields, 1942–1944 (SARJANA article)",
    publisher: "SARJANA (Universiti Malaya)",
    url: "https://ejournal.um.edu.my/index.php/SARJANA/article/download/16495/9854/32724",
    sourceType: "academic_paper",
    notes:
      "Cited for forced labour on the Jos tin fields from February 1942 and tin output peaking in 1943; most conscripts came " +
      "from outside Plateau Province. Context for a Benin Province family living in Jos in the 1940s — nothing more. " +
      SNIPPET,
  },
  {
    key: "tna_wo169",
    title: "WO 169: War Office, Middle East Forces, war diaries, Second World War",
    publisher: "The National Archives (UK)",
    url: "https://discovery.nationalarchives.gov.uk/details/r/C14376",
    sourceType: "government",
    notes:
      "Archive series where West African garrison and pioneer companies in Egypt would appear. Not digitised; not searched " +
      "for any individual. Recorded as the target for the search for Sam's father.",
  },
  {
    key: "bradbury_1957",
    title: "The Benin Kingdom and the Edo-Speaking Peoples of South-Western Nigeria",
    author: "R. E. Bradbury",
    publisher: "International African Institute (Ethnographic Survey of Africa)",
    publishedYear: 1957,
    url: "https://archive.org/details/beninkingdom0000unse",
    sourceType: "academic_book",
    notes:
      "Covers the northern Edo, Etsako included. Only catalogue snippets were reachable; nothing specific to Avianwu was " +
      "seen. Should be opened for the Etsako section and its own sources (it is the likeliest place Denton is cited).",
  },
];

// --- Kingdom of Benin (Nigeria) context sources ----------------------------

const BENIN_SOURCES: SeedSource[] = [
  {
    key: "britannica_benin",
    title: "Benin (historical kingdom, West Africa)",
    publisher: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/place/Benin-historical-kingdom-West-Africa",
    sourceType: "encyclopedia",
    notes:
      "The historical kingdom in present-day NIGERIA. Cited for the tradition that the Edo, dissatisfied with the Ogiso, " +
      "invited Prince Oranmiyan of Ife in the 13th century, whose son Eweka became the first Oba; for Ewuare (c.1440–c.1473) " +
      "rebuilding the capital; and for Ozolua's expansion. " +
      SNIPPET,
  },
  {
    key: "wiki_ewuare",
    title: "Ewuare",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Ewuare",
    sourceType: "wikipedia",
    notes: "Ewuare reigned c.1440–c.1473, birth name Ogun, took the throne after killing his brother Uwaifiokun; rebuilt and enlarged the city and its walls and ditches. " + SNIPPET,
  },
  {
    key: "wiki_ozolua",
    title: "Ozolua",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Ozolua",
    sourceType: "wikipedia",
    notes: "Ozolua 'the Conqueror', c.1481–c.1504, youngest son of Ewuare; Portuguese contact under João Afonso de Aveiro, 1485/1486. " + SNIPPET,
  },
  {
    key: "connah_benin",
    title: "Archaeology in Benin (and later reassessments of Connah's 1961–64 excavations)",
    author: "Graham Connah",
    publisher: "Journal of African History; reassessed in Azania (2024)",
    url: "https://www.tandfonline.com/doi/full/10.1080/0067270X.2024.2404312",
    sourceType: "academic_paper",
    notes:
      "Connah excavated in Benin City 1961–64, built a pottery and radiocarbon chronology, dated a cistern/well to the 13th " +
      "century AD and the base of the Ogba Road ditch to cal. AD 1180–1500, and placed the inner-city iya in the 13th–15th " +
      "centuries. " +
      SNIPPET,
  },
  {
    key: "darling_iya",
    title: "A Legacy in Earth: Ancient Benin and Ishan (and related survey reports)",
    author: "Patrick J. Darling",
    url: "https://www.si.edu/object/siris_sil_832503",
    sourceType: "academic_book",
    notes:
      "Darling surveyed about 1,500 km of iya in 1973–77 and estimated about 16,000 km of earthworks enclosing over 500 " +
      "communities across about 6,500 km². " +
      SNIPPET,
  },
  {
    key: "digital_benin_ikpin",
    title: "Ikpin (snake) — Eyo Oto entry and catalogue",
    publisher: "Digital Benin",
    url: "https://digitalbenin.org/eyo-oto/22",
    sourceType: "museum",
    notes:
      "Digital Benin's entry: in Benin the crocodile and the boa constrictor are guardians of Olokun; the palace ikpin were " +
      "taken when the palace burned in 1897 and are not on the present palace roof; an 'Ikpin (snake figure) body fragment " +
      "and head', brass, 17th/18th century, is catalogued, one head sold to Hamburg in 1903 (possibly MARKK C3827 — " +
      "unconfirmed). " +
      SNIPPET,
  },
  {
    key: "artic_edo_spaces",
    title: "Edo Spaces, European Images: Iterations of Art and Architecture of Benin",
    publisher: "Art Institute of Chicago (digital publication)",
    url: "https://www.artic.edu/digital-publications/36/perspectives-on-instability/14/edo-spaces-european-images-iterations-of-art-and-architecture-of-benin",
    sourceType: "academic_paper",
    notes:
      "Cited for the scholarly disagreement over the palace snake: Ben-Amos reads it as a python linked to Olokun; " +
      "Nevadomsky suggests a puff adder associated with wealth. Also the Benin exhibition archive's palace plaque (Berlin III " +
      "C 8377, 16th/17th c., snake running down the turret) and Dapper's 1668 description. " +
      SNIPPET,
  },
  {
    key: "dapper_1668",
    title: "Naukeurige Beschrijvinge der Afrikaensche Gewesten (Description of Africa)",
    author: "Olfert Dapper",
    publishedYear: 1668,
    url: "https://archive.artic.edu/benin/palace/",
    sourceType: "historical_document",
    notes:
      "Dapper never went to Benin; the account rests on an unnamed Dutch visitor. Describes palace turrets topped with " +
      "'copper birds… spreading their wings' and galleries on pillars 'covered with cast copper'. The engraving was made " +
      "from the description, not from life. " +
      SNIPPET,
  },
  {
    key: "met_snake_plaque",
    title: "Plaque: Snake (1979.206.96)",
    publisher: "The Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/art/collection/search/312300",
    sourceType: "museum",
    notes: "Edo, 16th–17th century, cast brass, 47 × 31 cm; Michael C. Rockefeller Memorial Collection, 1979; formerly Berlin III C 8479, deaccessioned 1923. " + SNIPPET,
  },
  {
    key: "bm_snake_head",
    title: "Sculpture: snake head, Af1954,08.1",
    publisher: "The British Museum",
    url: "https://www.britishmuseum.org/collection/object/E_Af1954-08-1",
    sourceType: "museum",
    notes: "Lost-wax cast brass snake head, open mouth, scales in low relief. No date or dimensions were visible in the snippet, and it was not explicitly catalogued as a roof ikpin. " + SNIPPET,
  },
  {
    key: "artic_leopard",
    title: "The Leopard (Benin exhibition archive)",
    publisher: "Art Institute of Chicago",
    url: "https://archive.artic.edu/benin/leopard/",
    sourceType: "museum",
    notes:
      "The Oba as 'ekpen n'owa', leopard of the house, against 'ekpen n'oha', leopard of the bush; the leopard aquamanile " +
      "used to wash the Oba's hands at Ugie Erha Oba; tamed leopards kept at the palace before 1897. " +
      SNIPPET,
  },
  {
    key: "met_leopard",
    title: "Leopard (310764); Leopard aquamaniles (316524, 316530)",
    publisher: "The Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/art/collection/search/310764",
    sourceType: "museum",
    notes: "Edo leopard figure, 1550–1680, brass and iron; aquamaniles of the brass-casters' guild, 16th–19th century. " + SNIPPET,
  },
  {
    key: "edo_religion_encyclopedia",
    title: "Edo Religion",
    publisher: "Encyclopedia of Religion (via encyclopedia.com)",
    url: "https://www.encyclopedia.com/environment/encyclopedias-almanacs-transcripts-and-maps/edo-religion",
    sourceType: "encyclopedia",
    notes:
      "Osanobua the supreme creator ruling from a palace in the spirit world; Olokun his son, ruler of the waters from a " +
      "palace under the Ethiope River, giver of wealth and children; Ogun, patron of smiths, brass-casters, warriors and " +
      "hunters. " +
      SNIPPET,
  },
  {
    key: "met_altars",
    title: "Altar to the Hand (Ikegobo) 312418; Altar tableau of a Queen Mother 316580",
    publisher: "The Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/art/collection/search/316580",
    sourceType: "museum",
    notes: "Cast-brass royal altar objects: an ikegobo made for an iyoba, late 18th century; an urhoto of a queen mother with attendants, 18th century. " + SNIPPET,
  },
  {
    key: "wiki_1897",
    title: "Benin Expedition of 1897",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Benin_Expedition_of_1897",
    sourceType: "wikipedia",
    notes: "British punitive expedition, 9–18 February 1897; Benin City sacked and burned and thousands of objects looted. Reginald Granville photographed the burnt compound; Cyril Punch's 1891 photograph is the earliest known of the Oba's compound. " + SNIPPET,
  },
];

export const OKOMILO_SOURCES: SeedSource[] = [...COMMUNITY_SOURCES, ...BENIN_SOURCES];

// ---------------------------------------------------------------------------
// Helpers — the same claim shapes recur dozens of times, and writing them out
// longhand is how a required field gets forgotten in one of them.
// ---------------------------------------------------------------------------

/** A claim that places nothing, because nothing in the evidence does. */
function undated(
  sourceKey: string | null,
  originalDateText: string,
  evidence: string,
  chronology = "community",
  datingMethod = "source_assertion"
): SeedClaim {
  return {
    sourceKey,
    datePrecision: "year",
    isApproximate: false,
    temporalClaimType: "unknown",
    originalDateText,
    datingMethod,
    chronology,
    evidence,
  };
}

const COMMONS_NOTE =
  "File name taken from a search-result URL. The Commons file page could not be opened from the research environment " +
  "(network policy), so creator and licence are fetched from the page at seed time and nothing here has been checked " +
  "against it by hand.";

/** A Wikimedia Commons picture whose credit is fetched at seed time. */
function commons(fileName: string, caption: string, shows: string, extra: Partial<SeedPicture> = {}): SeedPicture {
  return {
    url: commonsFilePathUrl(fileName),
    fileName,
    sourcePageUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName).replace(/%20/g, "_")}`,
    caption,
    kind: "image",
    shows,
    creditFrom: "source",
    provenanceStatus: "unverified",
    provenanceNotes: COMMONS_NOTE,
    ...extra,
  };
}

const AVHIANWU = "Avhianwu (Etsako, Edo State, Nigeria)";
const BENIN_KINGDOM = "Kingdom of Benin (Edo, Nigeria)";

// ---------------------------------------------------------------------------
// LANE: OKOMILO FAMILY — documented and family-supplied
// ---------------------------------------------------------------------------

const FAMILY_EVENTS: SeedEvent[] = [
  {
    slug: OKOMILO_ANCHOR_SLUG,
    title: "Oshioma Okomilo, son of Sam Ikhenemho Okomilo",
    summary:
      "The present-day member of the Okomilo family who commissioned this investigation. His father is Sam Ikhenemho " +
      "Okomilo — family-supplied primary testimony.",
    description:
      "Oshioma Okomilo is a present-day member of the Okomilo family of Innih, Ogbona, and the person conducting and " +
      "commissioning this historical investigation.\n\n" +
      "THE RELATIONSHIP THIS RECORD CARRIES: Sam Ikhenemho Okomilo is the father of Oshioma Okomilo. The evidence is " +
      "FAMILY-SUPPLIED PRIMARY TESTIMONY, given directly for this research. It is not taken from a website and is not " +
      "presented as a document.\n\n" +
      "Deliberately absent: a birth date, a birthplace, and any other personal details. None were supplied for the " +
      "timeline, and a family history does not need them to be true.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    eventTypeNote: "A living person, recorded only for the relationship that anchors the family line.",
    tags: ["okomilo", "okomilo-specific", "evidence:family-testimony", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Oshioma Okomilo", "Sam Ikhenemho Okomilo"],
    civilisations: [AVHIANWU],
    locationName: null,
    claims: [
      {
        sourceKey: "family_testimony",
        startYear: 2026,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        originalDateText: "Testimony supplied for this investigation, 2026",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "when the family testimony was given — not anybody's birth",
        evidence:
          "WHAT IS DATED IS THE TESTIMONY, not a life event. The year is when Oshioma Okomilo supplied the family's account " +
          "to this research. It places the start of the documented family line in the present and says nothing about when " +
          "anyone was born.",
      },
    ],
  },
  {
    slug: "okomilo-sam-born-in-jos",
    title: "Sam Ikhenemho Okomilo born in Jos",
    summary:
      "Born in Jos, in the early-to-mid 1940s, to the Okomilo and Ikhuenena families of Ivhiochie quarter, Ogbona.",
    description:
      "Sam Ikhenemho Okomilo — spelled IKHENEMO in the Ogbona community profiles — was born in Jos on the Plateau, far " +
      "from Ogbona, while his father was living there.\n\n" +
      "PARENTS: the community profile says he was born 'to the families of Okomilo and Ikhuenena both of Ivhiochie " +
      "quarter'. Family testimony names his mother as Uwomha Ikhuenena, daughter of Pa Asekomhe. His father's name is " +
      "not yet known (see the separate record).\n\n" +
      "SPELLINGS: Ikhenemho (family) and Ikhenemo (ogbonaelites.org) are both in use. Ikhememho and Ikhenenbo were " +
      "searched and NOT found anywhere; nothing shows them to be real variants rather than typing or OCR errors, and " +
      "they should not be used as names.\n\n" +
      "A WARNING ABOUT ONE SNIPPET: a search summary said Sam 'was born in 1942 and was buried on February 2nd 1991'. " +
      "Follow-up showed the burial text belongs to a different Ogbona man, a musician, on the same web page. Neither the " +
      "1991 burial nor the bare '1942' is used here.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "jos", "evidence:family-testimony", "evidence:community-history", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Sam Ikhenemho Okomilo", "Uwomha Ikhuenena"],
    civilisations: [AVHIANWU],
    locationName: "Jos, Plateau, Nigeria",
    claims: [
      {
        sourceKey: "family_testimony",
        startYear: 1940,
        endYear: 1946,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        originalDateText: "Born in Jos, early-to-mid 1940s",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "Sam's birth",
        evidence:
          "Family testimony gives the early-to-mid 1940s and Jos. No birth certificate, baptismal entry or school register " +
          "has yet been seen; the range is the family's, not a calculation.",
      },
      {
        sourceKey: "oe_profiles",
        startYear: 1940,
        endYear: 1943,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        originalDateText: "'born in the early 1940s in Jos'",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "Sam's birth",
        evidence:
          "The Ogbona community profile, read at snippet level. 'Early 1940s' is the profile's phrase; the bounds here are " +
          "that phrase and no more. It is consistent with the family account and is NOT independent of the family — a " +
          "community profile of a living man is very likely based on what his family told the editors.",
      },
    ],
  },
  {
    slug: "okomilo-sam-sent-home-to-ogbona-1948",
    title: "Sam Okomilo sent home from Jos to Ogbona; St John's Primary School",
    summary:
      "In 1948 Sam was sent from Jos back to Ogbona so that he would learn Ogbona/Avhianwu culture, and started at St " +
      "John's Primary School, taught by Patrick O. Oboarekpe under headmaster M.C.K. Orbih.",
    description:
      "Family testimony is precise about WHY: Sam was returned to Ogbona in 1948 specifically so he would grow up in " +
      "Ogbona and Avhianwu culture rather than in Jos.\n\n" +
      "NEW DETAIL FROM THE COMMUNITY PROFILE: at St John's Primary School, Ogbona, he 'was taught by Chief Patrick O " +
      "Oboarekpe under the Headship of Chief MCK Orbih'. St John's belongs to the Catholic mission whose Ogbona church, St " +
      "John the Baptist, had its first lay faithful in the 1920s — among them a George Okomilo (separate record).\n\n" +
      "The school's admission register, if it survives, would name Sam's parent or guardian and is one of the most " +
      "promising places to find his father's name.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "ogbona", "education", "mission-school", "evidence:family-testimony", "evidence:community-history", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Sam Ikhenemho Okomilo", "Patrick O. Oboarekpe", "M. C. K. Orbih"],
    civilisations: [AVHIANWU],
    locationName: "Ogbona, Etsako Central, Edo State, Nigeria",
    claims: [
      {
        sourceKey: "family_testimony",
        citations: [{ sourceKey: "oe_profiles", relation: "context", note: "Names his teacher and headmaster at St John's; gives no year for the move." }],
        startYear: 1948,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "Sent home to Ogbona in 1948",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "Sam's return from Jos to Ogbona",
        evidence: "The year comes from family testimony. The school, teacher and headmaster come from the community profile, read at snippet level.",
      },
    ],
  },
  {
    slug: "okomilo-sam-secondary-auchi-jattu",
    title: "Sam Okomilo at secondary school in Auchi (1957) and Jattu (1959)",
    summary:
      "EDC Secondary Model School, Igbhe Road, Auchi, from 1957; finished at Blessed Martins, Jattu, in 1959.",
    description:
      "The Ogbona community profile is the only source found for Sam's secondary schooling: he 'proceeded to EDC " +
      "Secondary Model School at Igbhe Rd in Auchi in 1957 and finished at Blessed Martins in Jattu in 1959'. It adds that " +
      "he 'declined an offer to teach' and went to Ibadan.\n\n" +
      "Not previously in the family brief, and worth chasing: both schools' registers would carry a parent's name.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "auchi", "jattu", "education", "evidence:community-history", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Sam Ikhenemho Okomilo"],
    civilisations: [AVHIANWU],
    locationName: "Auchi and Jattu, Etsako West, Edo State, Nigeria",
    claims: [
      {
        sourceKey: "oe_profiles",
        startYear: 1957,
        endYear: 1959,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "'EDC Secondary Model School… Auchi in 1957… Blessed Martins in Jattu in 1959'",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence: "Community profile, snippet level. No school record has been seen.",
      },
    ],
  },
  {
    slug: "okomilo-sam-uch-medical-photography",
    title: "Sam Okomilo trains as a medical photographer at UCH Ibadan",
    summary:
      "Employed by the Federal Ministry of Education in Ibadan, posted to its archive department, then sent to University " +
      "College Hospital, Ibadan, to train as a medical photographer, 1960–1962.",
    description:
      "The community profile: he 'went to Ibadan and got a job in the Federal Ministry of Education, was sent to the archive " +
      "department but was subsequently sent to UCH Ibadan to be trained as a medical photographer from 1960 to 1962'.\n\n" +
      "This is the record the 'S. Okomilo, photographic trainee' lead may belong to — see the separate record, which keeps " +
      "that identification OPEN.\n\n" +
      "Where to look: UCH's Department of Medical Illustration staff records; Federal Ministry of Education establishment " +
      "lists and the Federation of Nigeria Official Gazette for 1960–62 (appointments and training postings were " +
      "gazetted).",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "ibadan", "uch", "medical-photography", "evidence:community-history", "evidence:family-testimony", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Sam Ikhenemho Okomilo"],
    civilisations: [AVHIANWU],
    locationName: "University College Hospital, Ibadan, Nigeria",
    claims: [
      {
        sourceKey: "oe_profiles",
        citations: [{ sourceKey: "family_testimony", relation: "supports", note: "Family account gives medical-photography training c.1960–62 associated with UCH Ibadan." }],
        startYear: 1960,
        endYear: 1962,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "'trained as a medical photographer from 1960 to 1962'",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence: "Community profile (snippet level), agreeing with family testimony — very probably one account, not two.",
      },
    ],
  },
  {
    slug: "okomilo-s-photographic-trainee-1960",
    title: "'S. Okomilo' documented as photographic trainee — possible identification with Sam Ikhenemho Okomilo",
    summary:
      "UNRESOLVED IDENTITY. An official Nigerian publication of about 1960 is reported to name 'S. Okomilo', with 'M. U. " +
      "Eriavbe', as photographic trainees. The document has not been located and the identification is not established.",
    description:
      "WHY IT MATTERS: Okomilo is a rare surname (a modelled estimate gives 46 bearers in Nigeria), and Sam independently " +
      "entered medical-photography training in 1960. An 'S. Okomilo' photographic trainee in 1960 is therefore a strong " +
      "candidate — and still only a candidate.\n\n" +
      "WHAT IS NOT KNOWN: the document's title, issuing body, date, page and course; whether the training was UCH's or a " +
      "government photographic section's (for example the Ministry of Information); and whether M. U. Eriavbe can be " +
      "traced. Searches for 'S. Okomilo', the phrase 'photographic trainee', 'Eriavbe', and Official Gazette issues of " +
      "1960–62 returned nothing that named either man.\n\n" +
      "WHAT WOULD SETTLE IT: the document itself, or a later report giving the trainee's full name, posting (UCH or LUTH) " +
      "or ministry. Until then this record is NOT linked to Sam as the same person.",
    category: "people",
    subcategory: OKOMILO_LANES.open,
    eventType: "disputed",
    eventTypeNote: "UNRESOLVED IDENTITY — a possible, unproven identification.",
    identificationStatus: "unverified",
    evidenceStatus: "unresolved",
    tags: ["okomilo", "okomilo-specific", "unresolved-identity", "open-question", "evidence:contemporary-document", "evidence:unverified-claim", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["S. Okomilo", "M. U. Eriavbe"],
    civilisations: [AVHIANWU],
    locationName: "Nigeria (place of training not established)",
    claims: [
      {
        sourceKey: "research_lead_s_okomilo",
        startYear: 1960,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        originalDateText: "'S. Okomilo', photographic trainee, around 1960",
        datingMethod: "source_assertion",
        chronology: "historical",
        whatIsDated: "the official listing of S. Okomilo as a trainee",
        evidence:
          "The date is as reported in the lead, not read from the document. It coincides with the start of Sam's UCH " +
          "training — a coincidence that makes the identification plausible and does not make it proven.",
      },
    ],
  },
  {
    slug: "okomilo-sam-luth-lagos",
    title: "Sam Okomilo moves to LUTH, Lagos",
    summary: "After UCH, Sam worked at Lagos University Teaching Hospital, before leaving for London in 1964.",
    description:
      "Both the family and the community profile say Sam moved from UCH Ibadan to LUTH. No year is given. The window can " +
      "only be bounded: after the 1960–62 training and before the 1964 move to London.\n\n" +
      "A CAUTION ON THE BOUNDS: LUTH as an institution dates from the early 1960s; whether its photographic department " +
      "existed before 1964 has not been checked. If it did not, the family's 'LUTH' may refer to a predecessor or to a " +
      "later return — an open point, not a contradiction.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "lagos", "luth", "evidence:family-testimony", "evidence:community-history", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Sam Ikhenemho Okomilo"],
    civilisations: [AVHIANWU],
    locationName: "Lagos University Teaching Hospital, Lagos, Nigeria",
    claims: [
      {
        sourceKey: "family_testimony",
        citations: [{ sourceKey: "oe_profiles", relation: "supports", note: "'later moved to LUTH (Lagos University Teaching Hospital)'." }],
        startYear: 1962,
        endYear: 1964,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        originalDateText: "Later at LUTH, between UCH training and London",
        datingMethod: "claimant_inference",
        chronology: "community",
        evidence:
          "NOT A STATED DATE. The bounds are inferred here from the end of UCH training (1962) and the move to London " +
          "(1964); the sources give only the sequence.",
      },
    ],
  },
  {
    slug: "okomilo-sam-to-london-1964",
    title: "Sam Okomilo goes to London; O and A levels",
    summary: "'In 1964, with the help of his immediate boss who was an expatriate, he found his way to London', where he took O and A levels.",
    description:
      "New from the community profile, which gives the year and the route: 'In 1964, with the help of his immediate boss " +
      "who was an expatriate, he found his way to London. While in London, he did his O level and A levels.'\n\n" +
      "UK passenger lists for 1964 (BT 26 inbound lists end in 1960, so a 1964 arrival would need other records) and " +
      "London college registers are the obvious next sources.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "london", "united-kingdom", "migration", "evidence:community-history", GENEALOGY_LAYER_TAGS.documented],
    people: ["Sam Ikhenemho Okomilo"],
    civilisations: [AVHIANWU],
    locationName: "London, United Kingdom",
    claims: [
      {
        sourceKey: "oe_profiles",
        startYear: 1964,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "'In 1964… he found his way to London'",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence: "Community profile, snippet level.",
      },
    ],
  },
  {
    slug: "okomilo-sam-edinburgh-ppe",
    title: "Sam Okomilo reads Politics, Philosophy and Economics at the University of Edinburgh",
    summary: "Admitted to the University of Edinburgh to study PPE, 1970–1972.",
    description:
      "Family testimony and the community profile agree: the University of Edinburgh, politics, philosophy and economics, " +
      "1970–72.\n\n" +
      "NOT YET DOCUMENTED BY THE UNIVERSITY. The University's matriculation and graduation rolls and the Centre for Research " +
      "Collections would confirm the exact name used, the degree and its date; no online snippet surfaced them.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "edinburgh", "united-kingdom", "education", "evidence:family-testimony", "evidence:community-history", GENEALOGY_LAYER_TAGS.documented],
    people: ["Sam Ikhenemho Okomilo"],
    civilisations: [AVHIANWU],
    locationName: "University of Edinburgh, Scotland",
    claims: [
      {
        sourceKey: "family_testimony",
        citations: [{ sourceKey: "oe_profiles", relation: "supports", note: "'got admitted into The University of Edinburgh to study politics, philosophy and economics between 1970 and 1972'." }],
        startYear: 1970,
        endYear: 1972,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        originalDateText: "Edinburgh, PPE, approximately 1970–72",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence: "Family testimony; the community profile gives the same years. No university record has been seen.",
      },
    ],
  },
  {
    slug: "okomilo-sam-publisher-journalist",
    title: "Sam Okomilo, journalist and publisher in London",
    summary:
      "Called 'the first journalist from Ogbona' and 'Publisher of the London based African News File', associated with " +
      "Africa Today, Who's Who in Africa and Makers of Modern Africa. Library catalogues credit those titles to Ralph " +
      "Uwechue's Africa Books / Africa Journal group; Sam's role there is not yet documented.",
    description:
      "WHAT THE COMMUNITY SAYS: 'Mr. Sam Ikhenemo Okomilo is the Publisher of the London based African News File, a parent " +
      "magazine that also publishes: AFRICA TODAY, WHO IS WHO IN AFRICA AND MAKERS OF MODERN AFRICA', and he was 'the first " +
      "journalist from Ogbona'.\n\n" +
      "WHAT THE CATALOGUES SAY (new): Makers of Modern Africa (Africa Journal Ltd 1981; Africa Books Ltd 1991), Africa " +
      "Who's Who and Africa Today — the 'Know Africa' series — are credited to Ralph Uwechue as publisher and " +
      "editor-in-chief; listed officers of Africa Books Ltd are Uwechue family members and Kojo Oparko Adaah. No catalogue " +
      "or company snippet names Okomilo, and no title 'African News File' was found in any catalogue.\n\n" +
      "HOW THOSE FIT TOGETHER is unresolved. They are not contradictory — a newsletter or news-file service, or a " +
      "publishing role within the same London group, would not appear on the books' title pages — but the role is not " +
      "documented outside the community and family accounts. The British Library's serials catalogue (for 'African News " +
      "File') and Companies House filings for the Uwechue companies are the places to settle it.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "journalism", "publishing", "london", "evidence:community-history", "evidence:family-testimony", GENEALOGY_LAYER_TAGS.documented],
    people: ["Sam Ikhenemho Okomilo", "Ralph Uwechue"],
    civilisations: [AVHIANWU],
    locationName: "London, United Kingdom",
    claims: [
      undated(
        "oe_footprints",
        "Publisher of African News File (no year given)",
        "The community page gives the role and no date. The catalogue dates of the associated titles (1981, 1991) date the " +
          "books, not Sam's involvement, and are not used to place this record."
      ),
    ],
  },
  {
    slug: "okomilo-sam-father-unknown",
    title: "Sam Okomilo's father — name not yet identified",
    summary:
      "The highest-priority gap. Family testimony: he served with British West African forces in the Second World War, " +
      "survived, was in Egypt, later lived in Jos and Ibadan, sent Sam home to Ogbona in 1948, and died before or around a " +
      "burial recorded in 1983. His name has not been found.",
    description:
      "THIS RECORD EXISTS SO THE GAP IS VISIBLE. Everything above it in the family line is documented or family-supplied; " +
      "this is where the documented line currently ends.\n\n" +
      "WHAT THE FAMILY SAYS: WWII service with British West African forces; survival; time in Egypt; later residence in Jos " +
      "and Ibadan; the decision to send Sam to Ogbona in 1948; and a burial recorded in 1983. Family tradition also says he " +
      "gave Sam the name Ikhenemho after surviving the war — its meaning is unresolved (separate record).\n\n" +
      "EGYPT IS PLAUSIBLE, AND THE UNIT IS NOT ASSUMED. Research for this record found that Nigerian Pioneers were in the " +
      "Middle East by April 1945, and that twenty West African garrison companies — eleven of them Nigerian — disembarked in " +
      "the Middle East between September 1945 and January 1946, waiting there for repatriation. That fits 'was in Egypt' " +
      "better than the usual East Africa / Burma story, in which no Suez transit of the 81st or 82nd Divisions is " +
      "documented. None of this identifies him or his unit.\n\n" +
      "WHERE HIS NAME IS MOST LIKELY TO BE: the St John's Primary School register (1948); Sam's secondary-school registers " +
      "(Auchi 1957, Jattu 1959); UCH and Federal Ministry personnel files (1960); University of Edinburgh matriculation " +
      "records (1970); a 1983 Ogbona funeral programme or Catholic burial register; and NAI Ibadan / Benin Prof and " +
      "Kukuruku Division ex-servicemen nominal rolls and resettlement files.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    eventTypeNote: "A real person whose name is not yet known. Not a placeholder for a guess.",
    evidenceStatus: "unresolved",
    tags: ["okomilo", "okomilo-specific", "open-question", "ww2", "rwaff", "egypt", "jos", "ibadan", "evidence:family-testimony", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Sam Okomilo's father (name unknown)"],
    civilisations: [AVHIANWU],
    locationName: "Ogbona; Jos; Ibadan; Egypt (wartime)",
    claims: [
      {
        sourceKey: "family_testimony",
        citations: [
          { sourceKey: "jich_2020_repatriation", relation: "context", note: "Nigerian Pioneers in the Middle East by April 1945; eleven Nigerian garrison companies landed there Sept 1945 – Jan 1946." },
          { sourceKey: "korieh_ww2", relation: "context", note: "Nigerians deployed as soldiers and workers to the Middle East." },
          { sourceKey: "tna_wo169", relation: "context", note: "Middle East war diaries — where a unit, not a man, could be traced." },
        ],
        startYear: 1939,
        endYear: 1945,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        originalDateText: "Served with British West African forces in the Second World War; in Egypt",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "his wartime service",
        evidence:
          "The war's span, not a service record. Family testimony; no unit, number or record yet. If he was among the " +
          "garrison companies, his time in Egypt may have run into 1946.",
      },
      {
        sourceKey: "family_testimony",
        startYear: 1983,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "Burial recorded in 1983",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "his burial",
        evidence:
          "Family testimony of a burial recorded in 1983. The record itself (programme, register or notice) has not been " +
          "seen; it is likely to carry his full name and possibly his service.",
      },
    ],
  },
  {
    slug: "okomilo-uwomha-ikhuenena",
    title: "Uwomha Ikhuenena, Sam Okomilo's mother",
    summary: "Mother of Sam Ikhenemho Okomilo; daughter of Pa Asekomhe. Of the Ikhuenena family of Ivhiochie quarter, Ogbona.",
    description:
      "Family testimony names Sam's mother as Uwomha Ikhuenena, daughter of Pa Asekomhe. The community profile says Sam was " +
      "born to 'the families of Okomilo and Ikhuenena both of Ivhiochie quarter'.\n\n" +
      "OPEN: her dates; her own village within Ivhiochie; and how a daughter of 'Pa Asekomhe' carries the name Ikhuenena. " +
      "Whether that Pa Asekomhe belongs to the Asekomhe family of Innih is a separate, open question — same name is not " +
      "same family.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo-specific", "ikhuenena", "asekomhe", "ivhiochie", "evidence:family-testimony", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Uwomha Ikhuenena", "Pa Asekomhe", "Sam Ikhenemho Okomilo"],
    civilisations: [AVHIANWU],
    locationName: "Ivhiochie quarter, Ogbona",
    claims: [undated("family_testimony", "Dates not known", "No date of birth, marriage or death has been supplied or found.")],
  },
  {
    slug: "okomilo-pa-asekomhe-maternal-grandfather",
    title: "Pa Asekomhe, father of Uwomha Ikhuenena",
    summary: "Sam Okomilo's maternal grandfather, per family testimony. His relationship to the Asekomhe family of Innih is NOT established.",
    description:
      "Family testimony: Uwomha Ikhuenena was the daughter of Pa Asekomhe.\n\n" +
      "A TEMPTING MATCH, NOT YET A MATCH. The Ogbona community site carries a genealogy of a 'Pa Asekomhe', first son of Pa " +
      "Ekhaegbai, son of Pa Ereghi, patriarch of the Asekomhe dynasty of Innih — a hunter, trader, herbalist who healed " +
      "snakebite, and a seer, 'feared… for his closeness to colonial slave masters'. Asekomhe is also one of the nine " +
      "families of Innih, the village of the Okomilo family. If this is the same man, Sam's maternal line reaches into the " +
      "community genealogy. But Asekomhe is a family name borne by many men, nothing yet connects THIS Pa Asekomhe to that " +
      "one, and the two records are therefore kept apart.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo-specific", "asekomhe", "evidence:family-testimony", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Pa Asekomhe", "Uwomha Ikhuenena"],
    civilisations: [AVHIANWU],
    locationName: "Ogbona",
    claims: [undated("family_testimony", "Dates not known", "Family testimony gives the relationship and no dates.")],
  },
  {
    slug: "okomilo-veronica-early-schoolgirl",
    title: "Veronica Okomilo among the first girls from Ogbona to attend school",
    summary:
      "Named with Catherine Ogbualo, Agbedebo Idode and Ashetu Idode as 'the first set of females from Ogbona to go to " +
      "school'. Her relationship to Sam's branch is not known.",
    description:
      "The community record names four women. No date, school or parents are given; the likeliest school is the Catholic " +
      "mission school at Ogbona (later St John's), which would put her schooling somewhere between the 1920s and 1940s — " +
      "an inference, and recorded as one.\n\n" +
      "NOT ASSUMED: that she belongs to Sam's immediate branch. She shares the surname and the village, and that is all " +
      "that has been documented. A mission baptismal or school register is the place to find her parents.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "women", "education", "mission-school", "evidence:community-history", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Veronica Okomilo", "Catherine Ogbualo", "Agbedebo Idode", "Ashetu Idode"],
    civilisations: [AVHIANWU],
    locationName: "Ogbona",
    claims: [undated("oe_footprints", "'among the first set of females from Ogbona to go to school' (no year)", "The source gives no date; none is supplied here.")],
  },
  {
    slug: "okomilo-george-catholic-pioneer-jailed",
    title: "George Okomilo, Catholic pioneer, caned and jailed at Auchi — the earliest documented Okomilo found",
    summary:
      "One of seven pioneer lay faithful of St John the Baptist Catholic Church, Ogbona, given fourteen strokes of the cane " +
      "and two months' imprisonment at Auchi prison, dated 1931–1932, in a conflict over the new faith's teaching against " +
      "sacrifice and Okhe rites.",
    description:
      "NEW, AND THE EARLIEST DATED OKOMILO FOUND. The Ogbona community history names George Okomilo among the pioneer lay " +
      "faithful of the Catholic church 'established in the early 20s', and among seven men — Eramha David Agbiko Enamino, " +
      "George Okomilo, Robert Odogbo, Cletus Anaweokhai, Nicholas Asekomhe, Martins Esi and Richard Asekomhe — 'found " +
      "culpable' and given 'fourteen strokes of cane each with two months of imprisonment which were served at Auchi " +
      "prison'. The stated background is the church's 'teaching against pagan practices like sacrifices to idols, okhei " +
      "traditional rites'.\n\n" +
      "TWO DATES, ONE EPISODE?: a related snippet says the seven 'were jailed for two months in Auchi prison in " +
      "1931-1932'; the Okhaishie chronology lists '1930: mass arrest of Christians'. Both are on the same website and may " +
      "share an origin; they are kept as separate claims.\n\n" +
      "WHY IT MATTERS GENEALOGICALLY: Odogbo and Asekomhe — two of George's fellow prisoners' families — are, like Okomilo, " +
      "among the nine families of Innih. George is a plausible senior relative of Sam's father's generation, and nothing " +
      "yet says so. A conviction would have produced a Native Court or District Officer's record in the Kukuruku Division " +
      "files — a colonial document with his full name.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "earliest-documented-okomilo", "catholic", "mission", "auchi", "colonial-court", "evidence:community-history", "evidence:missionary-record", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["George Okomilo", "Eramha David Agbiko Enamino", "Robert Odogbo", "Cletus Anaweokhai", "Nicholas Asekomhe", "Martins Esi", "Richard Asekomhe"],
    civilisations: [AVHIANWU],
    locationName: "Ogbona; Auchi prison",
    claims: [
      {
        sourceKey: "oe_churches",
        startYear: 1931,
        endYear: 1932,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "'jailed for two months in Auchi prison in 1931-1932'",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "the imprisonment of the seven Catholic pioneers",
        evidence: "Community church history, snippet level. The underlying court record has not been seen.",
      },
      {
        sourceKey: "oe_major_events",
        startYear: 1930,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "'1930: mass arrest of Christians'",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "the arrests of Christians in Avhianwu (George is not named in this line)",
        evidence:
          "The Okhaishie chronology as reproduced online. It does not name George; it is recorded here because it may be " +
          "the same episode a year earlier, and the difference should be visible rather than resolved by choosing.",
      },
    ],
  },
  {
    slug: "okomilo-pa-simeon-innih-representative",
    title: "Pa Simeon Okomilo, Innih representative in the Okphe-Ukpi palace list",
    summary:
      "Listed for Innih in the 'Palace of Okphe-Ukpi of Ogbona Approved Villages (3rd Edition)'. His exact office, dates, " +
      "parents and relationship to Sam are not known.",
    description:
      "The palace list names 'Pa. Simeon Okomilo from Innih' as an Innih representative, alongside Chief John Ogedegbe, " +
      "palace chief and village head of Innih.\n\n" +
      "WHAT 'REPRESENTATIVE' MEANS here — family head, elder, village delegate, or the eldest Okomilo man at the time of " +
      "compilation — is not stated. 'Pa' marks seniority. Because Odionwere-type headship in Etsako villages is usually " +
      "by age, a man holding such a seat is not thereby the senior line of the family, and nothing about his relationship " +
      "to Sam is assumed.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "innih", "palace", "evidence:community-history", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["Simeon Okomilo", "John Ogedegbe"],
    civilisations: [AVHIANWU],
    locationName: "Innih, Ogbona",
    claims: [undated("oe_palace_villages", "Listed in the 3rd edition of the palace list (edition year not visible)", "The edition's year was not visible in the snippets.")],
  },
  {
    slug: "okomilo-surname-sweep",
    title: "The Okomilo surname: how rare it is, and every variant searched",
    summary:
      "A modelled estimate puts the surname at 46 bearers in Nigeria (Delta, Edo, Oyo). Okomillo, Okomilu, Okomelo, " +
      "Okomila, Okomiro and Okhomilo returned nothing relevant.",
    description:
      "Forebears estimates 46 bearers of Okomilo in Nigeria, concentrated in Delta (35%), Edo (28%) and Oyo (28%) — a " +
      "model, not a count, but strong evidence that the name is rare. Rarity is what makes an 'S. Okomilo' in 1960 or a " +
      "'George Okomilo' in 1931 worth taking seriously — and rarity alone does not join them to Sam.\n\n" +
      "VARIANTS SEARCHED with Nigeria, Edo, Etsako, Kukuruku, Fugar, Auchi, Ogbona, Jos, Ibadan, Lagos, obituary and " +
      "burial: Okomillo, Okomilu, Okomelo, Okomila, Okomiro, Okhomilo — nothing relevant. 'Okomiloh' was not searched " +
      "separately.\n\n" +
      "HISTORICAL OKOMILOS FOUND: George (Catholic pioneer, 1931–32), Veronica (early schoolgirl, undated), Simeon (palace " +
      "list, undated), Sam (born early 1940s), and the unresolved S. Okomilo (1960). No Okomilo was found in any colonial, " +
      "military, gazette or newspaper text reachable by search.",
    category: "people",
    subcategory: OKOMILO_LANES.family,
    eventType: "historical",
    tags: ["okomilo", "okomilo-specific", "surname", "evidence:community-history", GENEALOGY_LAYER_TAGS.documented],
    people: ["George Okomilo", "Veronica Okomilo", "Simeon Okomilo", "Sam Ikhenemho Okomilo"],
    civilisations: [AVHIANWU],
    claims: [undated("forebears_okomilo", "Present-day distribution (modelled)", "A distribution estimate has no historical date.")],
  },
];

// ---------------------------------------------------------------------------
// THE BREAK IN THE LINE
// ---------------------------------------------------------------------------

export const GENEALOGY_BREAK_SLUG = "okomilo-documented-genealogy-disappears";

const BREAK_EVENT: SeedEvent = {
  slug: GENEALOGY_BREAK_SLUG,
  title: "Documented Okomilo genealogy disappears from the record",
  summary:
    "From here backwards, identified members of the Okomilo family have not yet been connected generation-by-generation " +
    "to the older genealogy of Innih, Ogbona and Avhianwu. The evidence changes kind at this point.",
  description:
    "At this point backwards, identified members of the Okomilo family have not yet been connected generation-by-" +
    "generation to the older genealogy of Innih, Ogbona and Avhianwu.\n\n" +
    "The timeline therefore changes evidence level:\n\n" +
    "DOCUMENTED / FAMILY-SUPPLIED OKOMILO GENEALOGY — Oshioma → Sam Ikhenemho → Sam's father (name not yet known)\n" +
    "↓\n" +
    "UNKNOWN GENERATIONS — Sam's paternal grandfather and every Okomilo before him back to the founder of the family; " +
    "George, Veronica and Simeon Okomilo are documented but not yet placed\n" +
    "↓\n" +
    "INNIH / OGBONA / AVHIANWU COMMUNITY GENEALOGY AND ORAL TRADITION — the Okomilo kindred of Innih, Ivhitse, Ivhiochie, " +
    "Ochie, Okhua, Ogbona, Imhakhena, Anwu and Alokoko, and the migration from the Kingdom of Benin.\n\n" +
    "THIS IS NOT EVIDENCE THAT THE TRADITIONS ARE FALSE. It means the intermediate genealogy has not yet been " +
    "documented. Nothing in this track joins Sam's line to the older genealogy with a parent–child edge, and a test " +
    "fails if one is ever added without a record for each generation in between.\n\n" +
    "WHAT WOULD CLOSE THE GAP: Sam's father's name; the custodian line of the Okomilo family ancestral shrine (if shrine " +
    "custody passes eldest son to eldest son, it preserves exactly the genealogy that is missing); and the relationship " +
    "of George, Veronica and Simeon Okomilo to Sam's branch.",
  category: "people",
  subcategory: OKOMILO_LANES.open,
  eventType: "other",
  eventTypeNote: "Not an event in the past: a statement about where the evidence currently stops.",
  evidenceStatus: "unresolved",
  tags: ["okomilo", "okomilo-specific", "genealogy-break", "open-question", GENEALOGY_LAYER_TAGS.unknown],
  people: [],
  civilisations: [AVHIANWU],
  claims: [
    undated(
      null,
      "Unknown — the number of missing generations is itself unknown",
      "POSITIONLESS ON PURPOSE. The break has no date because the generations it stands for have no dates; placing it " +
        "would invent a generation length and a founding date for the Okomilo family that no source gives.",
      "community"
    ),
  ],
};

// ---------------------------------------------------------------------------
// LANE: INNIH & OGBONA
// ---------------------------------------------------------------------------

const INNIH_EVENTS: SeedEvent[] = [
  {
    slug: "okomilo-family-of-innih",
    title: "The Okomilo family, one of the nine kindred families of Innih",
    summary:
      "'Innih Village has the Okomilo Family as one of its nine kindred families': Asekomhe, Azoganokhai, Emoekpere, " +
      "Idegbesor, Iniaru, Odogbo, Ogedegbe, Okomilo, Onokozi. The founder, date of arrival and relationship to the other " +
      "eight are not recorded.",
    description:
      "ESTABLISHED (community history): Okomilo is one of the nine families of Innih, a village of Ivhitse in the " +
      "Ivhiochie section of Ogbona, under palace chief John Ogedegbe.\n\n" +
      "NOT ESTABLISHED: who founded the Okomilo family; when it became part of Innih; whether it branched from another " +
      "Innih family or arrived separately; its seniority; its ancestral compound, shrine, praise names, taboos and titles.\n\n" +
      "CLUES WORTH FOLLOWING, NONE OF THEM ANSWERS: (1) an Ogedegbe genealogy names an INNIH as a son of Okoko, which would " +
      "make Innih an eponymous ancestor and the nine families either his descendants or later attachments to his " +
      "village; (2) the Asekomhe family claims descent from Imhakhena and says Imhakhena's house stood on its compound — " +
      "a claim of seniority within Innih; (3) Okomilo, Odogbo and Asekomhe men were jailed together in 1931–32, a sign of " +
      "close association, not of kinship.\n\n" +
      "SHRINE, NOT TITLE. Village headship (Odionwere-type) in Etsako is generally by age, so lists of village heads are " +
      "not father-to-son genealogies. The family ancestral shrine and its custodians are a better route: if custody passes " +
      "to the eldest son, the custodian list IS a genealogy. Not yet documented for Okomilo.",
    category: "people",
    subcategory: OKOMILO_LANES.innih,
    eventType: "traditional_account",
    tags: ["okomilo", "okomilo-specific", "innih", "kindred", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: [],
    civilisations: [AVHIANWU],
    locationName: "Innih, Ivhitse, Ivhiochie, Ogbona",
    claims: [
      {
        sourceKey: "oe_kindreds",
        startYear: 2024,
        datePrecision: "month",
        startMonth: 11,
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        originalDateText: "Listed in the November 2024 kindreds list",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "the list that records the nine families — not the family's founding",
        evidence: "Dates the written list, not the family. The family's origin is undated in every source found.",
      },
      undated("oe_kindreds", "Founding of the Okomilo family: no date in any source", "No source gives a founder or a date.", "oral_tradition", "oral_tradition"),
    ],
  },
  {
    slug: "okomilo-innih-village",
    title: "Innih village, Ivhitse",
    summary:
      "A village of Ivhitse quarter in Ivhiochie, Ogbona, with nine kindred families. One Ogedegbe genealogy treats Innih " +
      "as a personal name — a son of Okoko — which would make the village eponymous.",
    description:
      "Innih is one of the villages of Ivhitse (with Akpheokhai, Enamino and Ototo), itself a quarter of Ivhiochie. Its " +
      "palace chief and village head is Chief John Oshiomhogho Ogedegbe, title Okhaemho.\n\n" +
      "WHAT INNIH MEANS is not settled. The only explanation found is genealogical: 'Okoko was the father of Imhomo, Innih, " +
      "Esuka'. That makes Innih an ancestor's name in at least one family's account; it is not a linguistic gloss, and it " +
      "is not known whether the other eight families accept it.",
    category: "history",
    subcategory: OKOMILO_LANES.innih,
    eventType: "traditional_account",
    tags: ["innih", "ivhitse", "avhianwu-context", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: ["Okoko", "Innih", "Imhomo", "Esuka", "John Ogedegbe"],
    civilisations: [AVHIANWU],
    locationName: "Innih, Ogbona",
    claims: [undated("oe_chiefs", "Eponym Innih, son of Okoko (undated genealogy)", "Genealogical tradition with no generation count or date.", "oral_tradition", "genealogy")],
  },
  {
    slug: "okomilo-ivhitse-quarter",
    title: "Ivhitse, a quarter of Ivhiochie",
    summary: "Ivhitse lies within Ivhiochie and contains villages including Akpheokhai, Enamino, Innih and Ototo.",
    description:
      "From the palace list: 'Ivhiochie is divided into several quarters including Ivhiobore, Ivhiosano, and Ivhitse, with " +
      "Ivhitse containing villages such as Akpheokhai, Enamino, Innih, and Ototo.'\n\n" +
      "How and when Ivhitse formed, and whether its name is 'children of' a founder (Ivhi- + name, as in Ivhiochie) is not " +
      "documented. One snippet placed Ivhiochie in 'Etsako East LGA'; Ogbona is in Etsako Central, and that line is " +
      "treated as an error in the snippet.",
    category: "history",
    subcategory: OKOMILO_LANES.innih,
    eventType: "traditional_account",
    tags: ["ivhitse", "ivhiochie", "avhianwu-context", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    civilisations: [AVHIANWU],
    locationName: "Ivhitse, Ogbona",
    claims: [undated("oe_palace_villages", "Formation of Ivhitse: undated", "No source dates the quarter.", "oral_tradition", "oral_tradition")],
  },
  {
    slug: "okomilo-ivhiochie-children-of-ochie",
    title: "Ivhiochie — 'the children of Ochie'",
    summary:
      "The Ogbona section descended, in tradition, from Ochie, a son of Okhua and grandson of Ogbona. Its quarters include " +
      "Ivhiobore, Ivhiosano and Ivhitse.",
    description:
      "The Ivhi-/Ivi- prefix is glossed in the community histories as 'children of' (Iviuralokhor/Iraokhor, 'children of " +
      "Uralokhor'), so Ivhiochie is 'children of Ochie'. In the Ogbona genealogy Ochie is a son of Okhua, son of Ogbona, son " +
      "of Imhakhena.\n\n" +
      "THE GLOSS IS THE COMMUNITY'S; no Etsako grammar was reached to confirm it. When Ivhiochie became a named section is " +
      "undated. Sam's parents' families — Okomilo and Ikhuenena — are both described as 'of Ivhiochie quarter'.",
    category: "history",
    subcategory: OKOMILO_LANES.innih,
    eventType: "traditional_account",
    tags: ["ivhiochie", "ochie", "avhianwu-context", "evidence:community-history", "evidence:linguistic", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: ["Ochie"],
    civilisations: [AVHIANWU],
    locationName: "Ivhiochie, Ogbona",
    claims: [undated("oe_descendants", "Ochie, son of Okhua (genealogical position, undated)", "A genealogical position with no year.", "oral_tradition", "genealogy")],
  },
  {
    slug: "okomilo-ogbona-genealogy",
    title: "The Ogbona genealogy: Imhakhena → Ogbona → Okhua and Omierele",
    summary:
      "In the community genealogy OGBONA IS A PERSON — Imhakhena's first son — before it is a place. Ogbona's sons Okhua and " +
      "Omierele; Okhua's sons Ochie, Orevhor, Udokhakor; Omierele's Okhotor and Anaga. A variant gives Omierele different " +
      "sons.",
    description:
      "THE GENEALOGY AS WRITTEN: 'Ogbona was the first born of Imhakhena who was the last born of Anwu… Ogbona later gave " +
      "birth to two children, OKHUA and OMIERELE. Okhua later had OCHIE, OREVHOR, UDOKHAKOR while OMIERELE had OKHOTOR and " +
      "ANAGA.'\n\n" +
      "PERSON, PLACE, LINEAGE: in this text Ogbona is a man, the community is named after him, and the sections " +
      "(Ivhiochie etc.) are named after his grandsons. The Guardian instead says Ogbona was 'founded by Imonkhena' — i.e. " +
      "the community's founder is Imhakhena, the eponym is his son. Both are compatible; neither turns a place into an " +
      "ancestor without saying so.\n\n" +
      "A VARIANT EXISTS: 'Omiorele was the father of Osua and Anaga; Osua father of Oroke and Ozima; Anaga father of " +
      "Uluagwa and Overa.' It shares Anaga and replaces Okhotor. Both versions are kept.\n\n" +
      "EARLIEST WRITTEN VERSION: the online text appears to derive from Okhaishie 1999; whether that book had an older " +
      "source is unknown.",
    category: "history",
    subcategory: OKOMILO_LANES.innih,
    eventType: "traditional_account",
    tags: ["ogbona", "imhakhena", "okhua", "omierele", "genealogy", "avhianwu-context", "evidence:oral-tradition", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: ["Imhakhena", "Ogbona", "Okhua", "Omierele", "Ochie", "Orevhor", "Udokhakor", "Okhotor", "Anaga"],
    civilisations: [AVHIANWU],
    locationName: "Ogbona",
    claims: [
      undated("oe_descendants", "Genealogy without generation dates", "No source attaches years to these generations, and none are calculated here.", "oral_tradition", "genealogy"),
    ],
  },
  {
    slug: "okomilo-imhakhena-founds-ogbona",
    title: "Imhakhena founds Ogbona: from Utagbabor to Ore Okhiye",
    summary:
      "Imhakhena, last-born son of Anwu, settled at Utagbabor (Fugar), then, after 'mutual mistrust and strife', moved to " +
      "Ore Okhiye in Ogbona, where his mother Alokoko later joined him.",
    description:
      "The community account: Imhakhena 'settled at UTAGBABOR, Fugar'; 'mutual mistrust and strife… forced Imhakhena to " +
      "migrate further from Utagbabor to Ore Okhiye in Ogbona where his mother, Alokoko later joined him.' The Asekomhe " +
      "family adds that Imhakhena 'settled in an ancestral home that he built at the site of the present-day Asekomhe " +
      "family compound'.\n\n" +
      "This is the tradition that ties Alokoko — and so the python purification — specifically to Ogbona. Its date is " +
      "only relative: after the second migration from Afashio.",
    category: "history",
    subcategory: OKOMILO_LANES.avhianwu,
    eventType: "traditional_account",
    tags: ["imhakhena", "ogbona", "utagbabor", "alokoko", "avhianwu-context", "evidence:oral-tradition", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: ["Imhakhena", "Alokoko"],
    civilisations: [AVHIANWU],
    locationName: "Utagbabor (Fugar) and Ore Okhiye (Ogbona)",
    claims: [
      undated("oe_history_tag", "After the second migration; no year", "A narrative sequence with no date.", "oral_tradition", "oral_tradition"),
      {
        sourceKey: "guardian_ogbona",
        startYear: 1892,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        originalDateText: "'founded about 1892' (newspaper summary)",
        datingMethod: "source_assertion",
        chronology: "other",
        whatIsDated: "Ogbona's founding, as one newspaper summary puts it",
        evidence:
          "RECORDED, NOT ADOPTED. Every other account puts Ogbona's founding centuries earlier. The figure may refer to a " +
          "re-founding after the Nupe period, to a church or school, or be an error in the summary; the article was not " +
          "readable to check.",
      },
    ],
  },
  {
    slug: "okomilo-asekomhe-dynasty-genealogy",
    title: "The Asekomhe dynasty genealogy: Pa Ereghi → Pa Ekhaegbai → Pa Asekomhe",
    summary:
      "A community genealogy tracing the Asekomhe family of Innih to Imhakhena, through Pa Ereghi, 'patriarch of today's " +
      "Asekomhe Dynasty', his son Pa Ekhaegbai and grandson Pa Asekomhe — the 'Oghie Descendants'.",
    description:
      "'Pa Asekomhe was the first son of Pa Ekhaegbai, whose father, Pa Ereghi, was the patriarch of today's Asekomhe " +
      "Dynasty'; Pa Ereghi 'is believed to be a direct offspring of the great Imhakhena'. Pa Asekomhe was 'a prominent " +
      "hunter and commodity trader… feared by his subjects for his closeness to colonial slave masters' and 'a great " +
      "popular herbalist… prominent in healing people bitten by snakes and a Seer'. The family and associated families are " +
      "'known today in Ogbona as the Oghie Descendants (Apoghie, meaning origin)'.\n\n" +
      "THE ONE NAMED INNIH GENEALOGY FOUND, and important for two reasons: it is the only text that links an Innih family " +
      "to Imhakhena; and its Pa Asekomhe MAY be Sam's maternal grandfather. 'Believed to be a direct offspring' is the " +
      "source's own hedge, and the gap between Pa Ereghi and Imhakhena is not counted in generations. The identification " +
      "with Sam's grandfather is NOT made here.",
    category: "people",
    subcategory: OKOMILO_LANES.innih,
    eventType: "traditional_account",
    tags: ["asekomhe", "innih", "oghie", "imhakhena", "avhianwu-context", "evidence:community-history", "evidence:oral-tradition", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: ["Pa Ereghi", "Pa Ekhaegbai", "Pa Asekomhe", "Imhakhena"],
    civilisations: [AVHIANWU],
    locationName: "Asekomhe compound, Innih, Ogbona",
    claims: [
      undated(
        "oe_descendants",
        "Pa Asekomhe's lifetime: 'closeness to colonial slave masters' (no years)",
        "The reference to colonial-era dealings implies a late-19th- or early-20th-century life, but no year is given and " +
          "none is assigned. It would be the obvious point of contact with Sam's maternal line if the two Pa Asekomhes are " +
          "one man.",
        "oral_tradition",
        "genealogy"
      ),
    ],
  },
  {
    slug: "okomilo-okphe-ukpi-palace",
    title: "The Okphe-Ukpi of Ogbona and the palace structure",
    summary:
      "Ogbona's traditional head bears the Ukpi title, Okphe-Ukpi; the palace keeps an approved list of villages and their " +
      "representatives, in which Innih is represented.",
    description:
      "The community site: Chief Akpabeghie of Ivhioverah (Akpabeghie village, Okotor) 'once held the Ukpi title, known " +
      "as Okphe-Ukpi'; an Emmanuel Ogah, 'Okphe Ukpi of Ivhiunone', became 'Okugbe of Fugar Clan'. The approved-villages " +
      "list (3rd edition) is the document in which Pa Simeon Okomilo appears.\n\n" +
      "The age, origin and succession rule of the Okphe-Ukpi title were not found.",
    category: "history",
    subcategory: OKOMILO_LANES.innih,
    eventType: "traditional_account",
    tags: ["okphe-ukpi", "ogbona", "chieftaincy", "avhianwu-context", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: ["Akpabeghie", "Emmanuel Ogah"],
    civilisations: [AVHIANWU],
    locationName: "Ogbona",
    claims: [undated("oe_okhe_palace", "Origin of the title: undated", "No date for the title's origin was found.")],
  },
  {
    slug: "okomilo-st-john-baptist-church-ogbona",
    title: "St John the Baptist Catholic Church and St John's School, Ogbona",
    summary: "Catholic mission 'established in the early 20s'; its school educated Sam Okomilo from 1948, and its first lay faithful included George Okomilo.",
    description:
      "The church's first lay faithful included Thomas Eragbe, Michael Idodo, Erumhire, Dominic Enamhino, Bernard Ozibe " +
      "Ogboalo, Mathias Ekiegbmhe Atsegwosi and George Okomilo; seven were imprisoned in 1931–32. The mission's school, St " +
      "John's, is where Sam was sent in 1948 and where the first Ogbona girls — Veronica Okomilo among them — are likeliest " +
      "to have studied.\n\n" +
      "MISSION REGISTERS (baptisms, marriages, burials, school admissions) for Ogbona are the single richest unexamined " +
      "source for Okomilo genealogy. Their location — parish, the Auchi diocese, or the original missionary society's " +
      "archive — has not been established.",
    category: "religion",
    subcategory: OKOMILO_LANES.colonial,
    eventType: "historical",
    tags: ["catholic", "mission", "ogbona", "education", "okomilo-specific", "evidence:community-history", "evidence:missionary-record", GENEALOGY_LAYER_TAGS.documented, "nigeria"],
    people: ["George Okomilo", "Thomas Eragbe", "Michael Idodo", "Dominic Enamhino", "Bernard Ozibe Ogboalo", "Mathias Ekiegbmhe Atsegwosi"],
    civilisations: [AVHIANWU],
    locationName: "Ogbona",
    claims: [
      {
        sourceKey: "oe_churches",
        startYear: 1920,
        endYear: 1925,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        originalDateText: "'established in the early 20s'",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence: "Community church history, snippet level; 'early 20s' rendered as 1920–25 and no narrower.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// LANE: AVHIANWU ORAL HISTORY and MIGRATIONS
// ---------------------------------------------------------------------------

export const ANWU_MIGRATION_SLUG = "okomilo-anwu-leaves-benin";

const AVHIANWU_EVENTS: SeedEvent[] = [
  {
    slug: "okomilo-anwu",
    title: "Anwu, ancestral father of Avhianwu",
    summary:
      "In Avhianwu tradition, Anwu left the Kingdom of Benin with his wife Alokoko and four sons. One account makes him the " +
      "third son of Azama, a Bini man, and Ughiosomhe; an older-attested Etsako tradition names Oluku as the common " +
      "ancestor instead.",
    description:
      "WHAT THE TRADITIONS AGREE ON: Anwu came from Benin; his wife was Alokoko; his sons founded the Avhianwu " +
      "communities; Avhianwu ('children of Anwu') bears his name, and Fugar is said to be the place first named after him.\n\n" +
      "PARENTAGE — TWO TRADITIONS, BOTH KEPT:\n" +
      "• AZAMA (ogbonaelites, afenmaiconnect): 'Azama was a Bini man who married Ughiosomhe, the mother of Imekeye, Ikpemhi, " +
      "Anwu and Omoazekpe [founder of Afashio]'; Azama's second wife Etso bore Ekpa and Anno; Anwu 'the third son of " +
      "Azama', step-brother of the founders of Uneme and Ekperi.\n" +
      "• OLUKU (Omo-Ananigie 1946, as quoted online; echoed by Borgatti 2003): Oluku had five sons, 'Uzairue, Ekperi, " +
      "Ayawun, Weppa and Wanno' — Ayawun plausibly Avianwu — and AZAMA appears as the WIFE of Uzairue. The two traditions " +
      "share names and disagree about who was whose parent.\n\n" +
      "OTHER DETAILS, UNCONFIRMED: a blog snippet says Anwu was 'also called \"Ofugar\"' and once lived 'in a quarter called " +
      "\"Uzora\" in Benin City'. A direct search did not find the phrase again.\n\n" +
      "WHO ANWU WAS — chief, war leader, prince, commoner — is not stated in any source reached.",
    category: "people",
    subcategory: OKOMILO_LANES.avhianwu,
    eventType: "traditional_account",
    tags: ["anwu", "azama", "oluku", "alokoko", "avhianwu-context", "evidence:oral-tradition", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria", "kingdom-of-benin"],
    people: ["Anwu", "Alokoko", "Azama", "Ughiosomhe", "Etso", "Omoazekpe", "Oluku"],
    civilisations: [AVHIANWU, BENIN_KINGDOM],
    claims: [
      undated("oe_adl", "Azama tradition: Anwu third son of Azama (no date)", "Genealogical tradition; no years.", "oral_tradition", "genealogy"),
      undated("omo_ananigie_1946", "Oluku tradition (1946, via later quotation; no date for Oluku)", "Known only through blogs that quote the 1946 book; the book was not opened.", "oral_tradition", "oral_tradition"),
    ],
  },
  {
    slug: "okomilo-anwu-four-sons",
    title: "Anwu's four sons and the four Avhianwu communities",
    summary:
      "Uralokhor (Iraokhor/Iviuralokhor), Unone (Ivhiunone), Arua (Ivhiarua) and Imhakhena (Ogbona). Uralokhor is " +
      "remembered as a war leader; Imhakhena as the last-born.",
    description:
      "The Iraokhor history and the Ogbona pages agree on the four sons and their foundations: Uralokhor → Iraokhor " +
      "(Iviuralokhor, 'children of Uralokhor'); Unone → Ivhiunone; Arua → Ivhiarua; Imhakhena → Ogbona. The Guardian " +
      "likewise calls Ogbona 'one of the four large communities that make up the Avianwon clan'.\n\n" +
      "SPELLINGS SEEN: Uralokhor / Iraokhor / Iviuralokhor; Unone / Ivhiunone / Iviunone; Arua / Ivhiarua; Imhakhena / " +
      "Imonkhena. No spelling Imhakhena→'Imhakena' etc. was searched.\n\n" +
      "SOURCE DEPENDENCY: all of the online versions probably descend from Okhaishie 1999 or from shared community " +
      "tradition. They are one account appearing in several places, not several confirmations.",
    category: "people",
    subcategory: OKOMILO_LANES.avhianwu,
    eventType: "traditional_account",
    tags: ["anwu", "uralokhor", "unone", "arua", "imhakhena", "iraokhor", "avhianwu-context", "evidence:oral-tradition", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: ["Uralokhor", "Unone", "Arua", "Imhakhena", "Anwu"],
    civilisations: [AVHIANWU],
    claims: [undated("oe_iraokhor", "Four sons (genealogical position, no years)", "No years are attached to the sons.", "oral_tradition", "genealogy")],
  },
  {
    slug: "okomilo-alokoko-ancestral-mother",
    title: "Alokoko, ancestral mother of Avhianwu, and the python",
    summary:
      "Alokoko is Anwu's wife and the mother who 'later joined' Imhakhena at Ore Okhiye, Ogbona. The python is her sacred " +
      "totem: an Avhianwu indigene who kills or eats one must be cleansed at Alokoko's ancestral home at Ogbona.",
    description:
      "WHAT THE SOURCES CALL HER: a HUMAN ancestral mother — Anwu's wife, Imhakhena's mother — in every text reached. The " +
      "python is her 'sacred totemic python'; no source reached describes Alokoko herself as a python, a spirit or a " +
      "deity.\n\n" +
      "THE TABOO AND ITS REMEDY: 'Any bonafide indigene of Avhianwu who accidentally kills the python or eats its meat must " +
      "be spiritually cleansed only at the ancestral home of Alokoko… at Ogbona.' This is a GENERAL AVHIANWU practice " +
      "centred on Ogbona, not a specifically Okomilo one.\n\n" +
      "SPELLINGS: Alokoko is the only form found. Aleukoko, Aleokoko, Aloukoko and Alukoko returned nothing.\n\n" +
      "EARLIEST WRITTEN OCCURRENCE: no text earlier than the online reproductions of Okhaishie 1999 has been found. " +
      "Whether Denton (1936) or Omo-Ananigie (1946) mentions her is unknown — neither has been opened.\n\n" +
      "THE PYTHON-ASSISTS-THE-MIGRATION STORY (a python helping Anwu's party across a river) was NOT found in any source " +
      "reached. It is not recorded here as a tradition until someone can cite it.",
    category: "religion",
    subcategory: OKOMILO_LANES.religion,
    eventType: "traditional_account",
    tags: ["alokoko", "python", "taboo", "ogbona", "avhianwu-context", "general-avhianwu-practice", "evidence:oral-tradition", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: ["Alokoko", "Anwu", "Imhakhena"],
    civilisations: [AVHIANWU],
    locationName: "Alokoko's ancestral home, Ogbona",
    claims: [
      {
        sourceKey: "okhaishie_1999",
        citations: [
          { sourceKey: "oe_history_tag", relation: "supports", note: "The online text; probably reproduces or paraphrases the 1999 book — the same chain, not an independent witness." },
          { sourceKey: "oe_iraokhor", relation: "supports", note: "Names Anwu and Alokoko as the migrating parents. Same website; same chain." },
        ],
        startYear: 1999,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        originalDateText: "Earliest dated written attestation found: 1999",
        datingMethod: "source_assertion",
        chronology: "oral_tradition",
        whatIsDated: "the earliest written attestation located — NOT the age of the tradition",
        evidence:
          "A FLOOR ON WHEN IT WAS WRITTEN, not on how old it is. The tradition may be centuries older; the written record " +
          "found starts with the 1999 book as reproduced online, and even that attribution rests on the site's bylines.",
      },
    ],
  },
  {
    slug: ANWU_MIGRATION_SLUG,
    title: "Anwu leaves the Kingdom of Benin",
    summary:
      "Avhianwu tradition says Anwu, Alokoko and their sons left Benin. WHEN is disputed: under Oba Ewuare (mid-15th " +
      "century), under Oba Ozolua (1481–85, or loosely 'the 16th century'), or as part of an Etsako exodus placed anywhere " +
      "from the 13th to the 15th century. All claims are kept.",
    description:
      "THE CLAIMS, SIDE BY SIDE (see the date claims):\n" +
      "A. EWUARE — 'middle of the 15th Century during the reign of Oba Eware the Great', prompted by a three-year mourning " +
      "decree forbidding childbirth (History of Iraokhor). Wikipedia's 'Afemai people' gives a migration of the Afemai " +
      "generally 'during the tyrannical rule of Oba Ewuare', unsourced.\n" +
      "B. OZOLUA — 'Between 1481 and 1485 Anwu and family migrated from Benin (First Migration)' (Okhaishie 1999, via its " +
      "online reproduction); Benin-context material elsewhere ties this to civil war at Ozolua's accession. 'About the " +
      "16th century when Oba Ozolua ruled' (Fugar America Foundation) is the same tradition stated loosely.\n" +
      "C. BROADER ETSAKO — 'about the 13th and the 14th Century' (Rev. A. O. Anaemhomhe); 'between the 13th and 15th " +
      "centuries' (Fugar America Foundation); 'in stages during the reigns of Oba Ewuare and Oba Ozolua' (stanwilly).\n" +
      "D. THE SECOND MIGRATION from Afashio-Uzairue, c.1570, is a separate record.\n\n" +
      "ARE A AND B INDEPENDENT TRADITIONS? Not demonstrably. The same website carries both, which suggests two family or " +
      "community versions coexisting rather than one copied from the other; but every online B-version traces to " +
      "Okhaishie 1999, and the A-version's source is not given. The 1946 Omo-Ananigie book is the obvious older witness " +
      "and has not been read. Neither date is chosen here.\n\n" +
      "WHY THE TWO DATES ARE CLOSE BUT NOT THE SAME: Ewuare's reign ends c.1473 and Ozolua's begins c.1481 — the two claims " +
      "do not overlap, so they cannot both be right as stated. A tradition remembering 'the reign of the great king' and " +
      "a later writer fitting it to a king-list could produce exactly this split. That is a hypothesis about the sources, " +
      "not a finding.",
    category: "history",
    subcategory: OKOMILO_LANES.migrations,
    eventType: "traditional_account",
    tags: ["anwu", "migration", "ewuare", "ozolua", "avhianwu-context", "evidence:oral-tradition", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria", "kingdom-of-benin"],
    people: ["Anwu", "Alokoko", "Ewuare", "Ozolua"],
    civilisations: [AVHIANWU, BENIN_KINGDOM],
    locationName: "From Benin City (Edo, Nigeria) northwards",
    claims: [
      {
        sourceKey: "oe_iraokhor",
        citations: [{ sourceKey: "wiki_afemai", relation: "context", note: "Afemai migration generally 'during the tyrannical rule of Oba Ewuare' — about the Afemai, not Anwu; unsourced." }],
        startYear: 1440,
        endYear: 1473,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        originalDateText: "'middle of the 15th Century during the reign of Oba Eware the Great'",
        datingMethod: "regnal_chronology",
        chronology: "oral_tradition",
        whatIsDated: "Anwu's departure from Benin (Ewuare-era tradition)",
        evidence:
          "CLAIM A — EWUARE. The tradition names a king; the years are that king's conventional reign (c.1440–c.1473), " +
          "supplied from the Benin king-list, not from the tradition. The reason given — a three-year ban on childbirth " +
          "during royal mourning — is the most specific motive in any version.",
      },
      {
        sourceKey: "okhaishie_1999",
        citations: [
          { sourceKey: "oe_major_events", relation: "supports", note: "The online reproduction of the 1999 chronology — the SAME source, not a second one." },
          { sourceKey: "afenmaiconnect_uzairue", relation: "context", note: "Shares wording with the ogbonaelites pages; derivative, not independent." },
        ],
        startYear: 1481,
        endYear: 1485,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        originalDateText: "'Between 1481 and 1485 Anwu and family migrated from Benin (First Migration)'",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        whatIsDated: "Anwu's departure from Benin (Ozolua-era tradition, narrow form)",
        evidence:
          "CLAIM B — OZOLUA, NARROW. The four-year window sits at the start of Ozolua's reign (c.1481) and before the " +
          "Portuguese arrival the same chronology lists for 1485. That precision almost certainly comes from fitting the " +
          "tradition to the king-list, not from the oral tradition itself.",
      },
      {
        sourceKey: "fugar_america",
        startYear: 1481,
        endYear: 1504,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        originalDateText: "'about the 16th century when Oba Ozolua ruled'",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        whatIsDated: "Anwu's departure from Benin (Ozolua-era tradition, broad form)",
        evidence:
          "CLAIM B — OZOLUA, BROAD. The source says 'the 16th century'; Ozolua's conventional reign (c.1481–c.1504) is " +
          "used for the bounds because it is the king the source names. DEPENDENT on the same chain as the narrow form — " +
          "not a second witness.",
      },
      {
        sourceKey: "nuntiuspacis",
        startYear: 1200,
        endYear: 1399,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        originalDateText: "Etsako emigrated from Benin 'about the 13th and the 14th Century' (Anaemhomhe)",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        whatIsDated: "the Etsako migrations generally — not Anwu's specifically",
        evidence:
          "CLAIM C — BROADER ETSAKO. About the Etsako as a whole, through a church writer quoted online. Included because " +
          "it is the earliest bracket any source gives and it does not name a king.",
      },
    ],
    genealogies: [
      {
        key: "ozolua-1481-85",
        claim: "Anwu and his family left Benin between 1481 and 1485, under Oba Ozolua",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "Every online statement of the 1481–85 date traces to Okhaishie 1999, and what that book rests on is not known. " +
          "No colonial report, no 1946 text, and no recorded elder's testimony carrying the Ozolua dating has been found. " +
          "THIS IS A REPORT ON SEARCHING, NOT A VERDICT ON THE TRADITION.",
        whatWouldChangeThis:
          "The 1999 book's own references (if any) for the migration chapter; an Ozolua-era dating in Denton 1936 or " +
          "Omo-Ananigie 1946; or a recorded Avhianwu elder naming Ozolua independently of the book.",
        links: [
          {
            stage: "oral_testimony",
            who: "Avhianwu elders (unrecorded)",
            saysAbsentReason: "No recorded testimony has been located; the oral layer is inferred from the book's subject, not read.",
            citationStatus: "no_citation_given",
          },
          {
            stage: "community_history",
            who: "Aha Idokpesi Okhaishie n'Avhianwu, The Descent of Avhianwu",
            year: 1999,
            sourceKey: "okhaishie_1999",
            saysAbsentReason: "The book was not opened; its wording is known only through the 2010s–2020s online reproduction.",
            adds: "The narrow 1481–85 window and the 'First Migration' framing, as far as can be seen.",
            citationStatus: "unverified",
          },
          {
            stage: "community_history",
            who: "Ogbona Elites, 'Major Events in Avhianwu History — by Aha Idokpesi Okhaishe n'Avhianwu'",
            sourceKey: "oe_major_events",
            says: "Between 1481 and 1485 Anwu and family migrated from Benin (First Migration) (snippet)",
            adds: "Nothing — it reproduces the book under the author's name.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "Fugar America Foundation, 'Our History'",
            sourceKey: "fugar_america",
            says: "about the 16th century when Oba Ozolua ruled (snippet)",
            adds: "Loosens the window to 'the 16th century' — a drift in the date, not new evidence.",
            citationStatus: "no_citation_given",
          },
        ],
      },
      {
        key: "ewuare-mid-15th",
        claim: "Anwu left Benin in the middle of the 15th century, under Oba Ewuare",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "Found on a community page (History of Iraokhor) with a distinctive motive — a royal mourning decree forbidding " +
          "childbirth — and no cited source. The Wikipedia sentence about the Afemai is general and unsourced. Neither can " +
          "be traced further back from what was reachable.",
        whatWouldChangeThis:
          "The Iraokhor page's own source; Omo-Ananigie 1946, which as an Etsako-wide history is the likeliest older text " +
          "to name a king; or Egharevba's Benin chronicle, if it records an Ewuare-era exodus in this direction.",
        links: [
          {
            stage: "oral_testimony",
            who: "Iraokhor community tradition",
            saysAbsentReason: "Not recorded anywhere reachable; known only from the community page.",
            citationStatus: "no_citation_given",
          },
          {
            stage: "community_history",
            who: "Ogbona Elites, 'History of Iraokhor'",
            sourceKey: "oe_iraokhor",
            says: "middle of the 15th Century during the reign of Oba Eware the Great (snippet)",
            adds: "The king's name and the mourning-decree motive.",
            citationStatus: "no_citation_given",
          },
          {
            stage: "popular_claim",
            who: "Wikipedia, 'Afemai people'",
            sourceKey: "wiki_afemai",
            says: "Historical accounts claimed that they migrated from Benin during the tyrannical rule of Oba Ewuare (snippet)",
            adds: "Generalises to all Afemai and adds 'tyrannical'.",
            citationStatus: "no_citation_given",
          },
        ],
      },
    ],
  },
  {
    slug: "okomilo-afashio-first-settlement",
    title: "First settlement at Afashio (Uzairue) under Omoazekpe",
    summary:
      "'The first place of full settlement was Afashio, Omoazekpe was then the ruler… noted for his diabolical powers… very " +
      "cruel.' In the Azama tradition Omoazekpe is Anwu's own brother.",
    description:
      "The Iraokhor history and the Uzairue page both put the first settlement at Afashio (Afasio/Afashio-Uzairue), ruled " +
      "by Omoazekpe. In the Azama genealogy Omoazekpe is a son of Azama and Ughiosomhe — Anwu's full brother — which makes " +
      "the hostility at Afashio a quarrel within a family.\n\n" +
      "UZAIRUE'S OWN TRADITION (Omo-Ananigie, as quoted) has Uzairue marry Azama and have eight sons, Ikpe the eldest — a " +
      "different arrangement of overlapping names.",
    category: "history",
    subcategory: OKOMILO_LANES.migrations,
    eventType: "traditional_account",
    tags: ["afashio", "uzairue", "omoazekpe", "migration", "avhianwu-context", "evidence:oral-tradition", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: ["Omoazekpe", "Anwu"],
    civilisations: [AVHIANWU],
    locationName: "Afashio, Uzairue, Etsako West",
    claims: [undated("oe_iraokhor", "After leaving Benin; no year", "Relative order only.", "oral_tradition", "oral_tradition")],
  },
  {
    slug: "okomilo-second-migration-afashio",
    title: "Second migration: the Ivhianwu leave Afashio-Uzairue",
    summary: "'c.1570 Ivhianwu migrated from Afashio-uzairue (Second Migration)' — the Okhaishie chronology.",
    description:
      "After Afashio the families moved on — by one account to Ugbiogwa and then Ulumhogie in Ivhiunone-Fugar — and the " +
      "four sons dispersed to found their communities, Imhakhena going on to Utagbabor and then Ogbona.\n\n" +
      "The c.1570 date appears only in the Okhaishie chronology. How it was arrived at (generation counting? a king-list " +
      "synchronism?) is not visible.",
    category: "history",
    subcategory: OKOMILO_LANES.migrations,
    eventType: "traditional_account",
    tags: ["migration", "afashio", "fugar", "avhianwu-context", "evidence:community-history", GENEALOGY_LAYER_TAGS.tradition, "nigeria"],
    people: ["Anwu"],
    civilisations: [AVHIANWU],
    locationName: "Afashio-Uzairue to Fugar",
    claims: [
      {
        sourceKey: "okhaishie_1999",
        citations: [{ sourceKey: "oe_major_events", relation: "supports", note: "The online reproduction — same source." }],
        startYear: 1570,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        originalDateText: "'c.1570 Ivhianwu migrated from Afashio-uzairue (Second Migration)'",
        datingMethod: "source_assertion",
        chronology: "traditional",
        evidence: "CLAIM D. Stated by the 1999 chronology without visible derivation.",
      },
    ],
  },
  {
    slug: "okomilo-nupe-invasion-avhianwu",
    title: "The Nupe invasion and Omiawa's slave levy",
    summary:
      "Nupe raiders reached Avhianwu from about 1830 (Okhaishie) or 1860 (Erhagbe). About 1886 'Oghie Omiawa of Avhianwu " +
      "introduced the system of each village giving 25 slaves to the Nupes every other year'. The Nupe withdrew in 1897.",
    description:
      "The Nupe period is the best-documented pre-colonial episode in Etsako history: a scholarly thesis (Erhagbe, University " +
      "of Benin, 1982) covers c.1860–1897, and the Avhianwu chronology gives c.1830 for the invasion and 1897 for the " +
      "withdrawal.\n\n" +
      "OMIAWA matters to this track twice: as the Oghie who negotiated the levy, and as the grandfather of the Akenavhianwu " +
      "killed in the Okhe dispute — which is why the 1851 date for that dispute is hard to sustain.",
    category: "history",
    subcategory: OKOMILO_LANES.avhianwu,
    eventType: "historical",
    tags: ["nupe", "omiawa", "slave-raids", "avhianwu-context", "evidence:modern-scholarship", "evidence:community-history", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Omiawa"],
    civilisations: [AVHIANWU, "Nupe"],
    locationName: "Avhianwu clan",
    claims: [
      {
        sourceKey: "okhaishie_1999",
        citations: [{ sourceKey: "oe_major_events", relation: "supports", note: "Online reproduction — same source." }],
        startYear: 1830,
        endYear: 1897,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        originalDateText: "'c.1830 Nupe invasion' … '1897 Nupe withdrawal'",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence: "Community chronology.",
      },
      {
        sourceKey: "erhagbe_1982",
        startYear: 1860,
        endYear: 1897,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        originalDateText: "'c.1860–1897' (thesis title)",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "The bracket in the scholarly thesis title; the thesis itself was not read.",
      },
      {
        sourceKey: "okhaishie_1999",
        startYear: 1886,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        originalDateText: "'c.1886 Oghie Omiawa… 25 slaves to the Nupes every other year'",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "Omiawa's levy",
        evidence: "Community chronology. The date that makes a grandson of Omiawa a grown title-holder in 1851 implausible.",
      },
    ],
  },
  {
    slug: "okomilo-okhe-title-institution",
    title: "Okhe (Okhei): the male title and initiation of Avhianwu",
    summary:
      "An initiation and title, 'the exclusive preserve of males only', taken with 'an oath and vow of dedication to an " +
      "Iroko tree in the forest'. The Catholic pioneers of the 1930s opposed 'okhei traditional rites'.",
    description:
      "WHAT IS DOCUMENTED (community sources, snippet level): Okhe is a title and initiation restricted to men; its oath is " +
      "sworn to an iroko tree in the forest; initiation involves age groups (Ayogwiri and Apana are named, from Uzairue); " +
      "a shrine (Ogwa / Ogiamotsu) is needed to perform it; Fugar and Ogbona have disputed the right to perform it.\n\n" +
      "WHAT IS NOT: its meaning; its full grade structure; its songs, dress, privileges and political role; and its age. " +
      "It is GENERAL AVHIANWU PRACTICE — nothing ties a particular form of it to the Okomilo family.\n\n" +
      "ITS COLONIAL-ERA COLLISION: the 1931–32 imprisonment of George Okomilo and six others arose from church teaching " +
      "against 'okhei traditional rites' — the one point where the documented Okomilo record touches Okhe.",
    category: "culture",
    subcategory: OKOMILO_LANES.religion,
    eventType: "traditional_account",
    tags: ["okhe", "initiation", "iroko", "avhianwu-context", "general-avhianwu-practice", "evidence:community-history", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [AVHIANWU],
    claims: [undated("oe_okhe_palace", "Origin of Okhe: undated", "No source dates the institution's origin.", "oral_tradition", "oral_tradition")],
  },
  {
    slug: "okomilo-okhe-dispute-ogbhari-akenavhianwu",
    title: "The Okhe dispute: Ogbhari kills Akenavhianwu, and Fugar bans Ogbona from the title",
    summary:
      "CLAIM. An uninitiated Ogbona man, Ogbhari, killed Akenavhianwu, a title-holder and grandson of Omiawa; Fugar then " +
      "barred Ogbona from performing Okhe, and Ogbona set up its own shrine. Dated 1851 by one account and 1891 by another.",
    description:
      "TWO VERSIONS OF THE DATE, BOTH ON OGBONA PAGES:\n" +
      "• 1851, 'according to Akhigbe': Fugar banned Ogbona from the Okhe title because 'an uninitiated man (Ogbhari) from " +
      "Ogbona killed a title holder, a certain Akenavhianwu, the grandson of Omiawa'; Ogbona 'set up its own Ogwa shrine to " +
      "perform the title which he described as inferior'.\n" +
      "• 1891: 'Following the assassination of Akhenavhianwu, a grandson of Omiawa by an Ogbona non-initiate (Ogbhari) in " +
      "1891, Ogbona was banned… until 1908 when Okoghor, Igbadumeh's father and Arekameh from Iviukasa established… a " +
      "separate Ogiamotsu at Utu-looko.'\n\n" +
      "A CHRONOLOGICAL TEST, NOT A VERDICT: Omiawa was active as Oghie around 1886; a grandson of his holding a senior title " +
      "in 1851 is hard to fit, and 1891 fits easily. A single transposed digit (5 / 9) would explain the difference. This " +
      "is recorded as a reason to prefer checking the 1891 version first, not as a decision.\n\n" +
      "Ogbona writers call the ban 'unjustified, biased, punitive'. Who 'Akhigbe' is and where he wrote are unknown.",
    category: "history",
    subcategory: OKOMILO_LANES.open,
    eventType: "disputed",
    eventTypeNote: "A claim with two dates and no independent corroboration.",
    evidenceStatus: "unresolved",
    tags: ["okhe", "ogbhari", "akenavhianwu", "omiawa", "fugar", "dispute", "open-question", "avhianwu-context", "evidence:community-history", "evidence:unverified-claim", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Ogbhari", "Akenavhianwu", "Omiawa", "Okoghor", "Arekameh", "Akhigbe"],
    civilisations: [AVHIANWU],
    locationName: "Fugar and Ogbona",
    claims: [
      {
        sourceKey: "oe_clan_split",
        startYear: 1851,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "'in 1851' (according to Akhigbe)",
        datingMethod: "source_assertion",
        chronology: "disputed",
        whatIsDated: "the killing of Akenavhianwu and the ban",
        evidence: "As quoted from 'Akhigbe' on an Ogbona page. Chronologically strained against Omiawa's c.1886 activity.",
      },
      {
        sourceKey: "oe_okhe_palace",
        startYear: 1891,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "'in 1891'",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "the killing of Akenavhianwu and the ban",
        evidence: "Ogbona community page. Fits Omiawa's dates; uncorroborated by any record outside the community.",
      },
      {
        sourceKey: "oe_okhe_palace",
        startYear: 1908,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "'until 1908' — Ogiamotsu established at Utu-looko",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "Ogbona's own Okhe shrine (Ogiamotsu) at Utu-looko",
        evidence: "Community page. If accurate, the shrine's founders Okoghor and Arekameh are named Ogbona men of c.1908.",
      },
    ],
  },
  {
    slug: "okomilo-avhianwu-clan-split-2024",
    title: "Avianwu clan split into Fugar and Anwu clans; Ogbona in Anwu clan",
    summary: "Edo State approved the split on 21 February 2024. Ogbona and Iraokhor are now in Anwu clan, headed by the Ogieavianwu; Ogbona protested the creation of Fugar clan.",
    description:
      "The newest event in the community lane and a reminder that 'Avhianwu' is a living political unit, not only an " +
      "ancestral one. Ogbona's protest letter to the Governor of Edo State is on the same site.",
    category: "history",
    subcategory: OKOMILO_LANES.avhianwu,
    eventType: "historical",
    tags: ["avhianwu", "fugar", "anwu-clan", "avhianwu-context", "evidence:community-history", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [AVHIANWU],
    locationName: "Etsako Central, Edo State, Nigeria",
    claims: [
      {
        sourceKey: "fugar_america",
        citations: [{ sourceKey: "oe_clan_split", relation: "supports", note: "Ogbona's account of the same split." }],
        startYear: 2024,
        startMonth: 2,
        startDay: 21,
        datePrecision: "day",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "Approved by Edo State, 21 February 2024",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence: "Two community sources from opposite sides of the split agree on the fact.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// LANE: TRADITIONAL RELIGION and linguistics
// ---------------------------------------------------------------------------

const RELIGION_EVENTS: SeedEvent[] = [
  {
    slug: "okomilo-osi-theophoric-names",
    title: "Osi-, Oshi-, Esi- names: how Etsako names speak of God",
    summary:
      "Etsako personal names prefixed Osi, Esi and Osho 'reverence God': Oshiomah is glossed 'God makes the plans', Oshomah " +
      "'God decides'. The only documented window found into the Avhianwu name for the supreme being.",
    description:
      "From an Ogbona community list of Etsako names and meanings. The glosses establish that an Osi-/Oshi- element " +
      "meaning God is productive in Etsako naming. They do NOT establish the form of the high-god's name in Avhianwu " +
      "worship; the terms Oghena, Osinegba, Adi, Esi and Ukpe given in the brief were not found in any source reached, " +
      "and are therefore not recorded as attested.\n\n" +
      "GENERAL ETSAKO PRACTICE, not anything specific to the Okomilo family.",
    category: "religion",
    subcategory: OKOMILO_LANES.religion,
    eventType: "traditional_account",
    tags: ["etsako-names", "osi", "god", "avhianwu-context", "general-avhianwu-practice", "evidence:linguistic", "evidence:community-history", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [AVHIANWU],
    claims: [undated("oe_names", "Present-day usage (no historical date)", "A gloss list has no historical date; the age of the naming pattern is unknown.")],
  },
  {
    slug: "okomilo-otsanobua-unattested",
    title: "'Otsanobua' — not attested in any source found",
    summary:
      "OPEN. The Edo (Bini) high god is OSANOBUA, well attested. No source found uses 'Otsanobua' for an Etsako or " +
      "Avhianwu deity. No cognate is created here.",
    description:
      "Osanobua is documented in standard reference works on Edo religion as the supreme creator. 'Otsanobua' — the form " +
      "proposed for Avhianwu — was not found in any search result, dictionary snippet, ethnography or community page " +
      "reached. Etsako is a North-Central Edoid language and sound correspondences with Edo are real, but a form becomes " +
      "a cognate when a linguist documents it, not when it looks plausible.\n\n" +
      "STATUS: UNATTESTED. If a source is found, this record should cite it and become a linguistic record.",
    category: "religion",
    subcategory: OKOMILO_LANES.open,
    eventType: "disputed",
    evidenceStatus: "unresolved",
    tags: ["otsanobua", "osanobua", "unattested", "open-question", "evidence:linguistic", "evidence:unverified-claim", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [AVHIANWU, BENIN_KINGDOM],
    claims: [
      undated(
        "edo_religion_encyclopedia",
        "No date: the word is unattested",
        "Osanobua is attested for Edo; Otsanobua is not attested anywhere searched. Nothing is dated because nothing has been found to date.",
        "other"
      ),
    ],
  },
  {
    slug: "okomilo-olokun-not-alokoko",
    title: "Olokun is not Alokoko: a resemblance of sound, recorded so it is not mistaken for evidence",
    summary:
      "Olokun is the Edo god of the waters, whose messengers include snakes; Alokoko is Avhianwu's human ancestral mother, " +
      "whose totem is the python. The names look alike in English spelling. No linguistic study connecting them was found.",
    description:
      "WHY THIS RECORD EXISTS: the two words are easy to run together, and the python links both to snakes. That is " +
      "precisely the kind of resemblance that turns into a 'connection' by repetition.\n\n" +
      "WHAT IS DOCUMENTED: Olokun is a male deity, son of Osanobua, ruling the waters; Benin snakes, especially the olose " +
      "water snake, are his messengers, and Digital Benin calls the crocodile and boa his guardians. Alokoko is described " +
      "only as a human ancestress whose python is a family totem. Different kind of being, different gender, different " +
      "role.\n\n" +
      "WHAT IS NOT: any scholarly derivation of one name from the other. Without it the two are treated as UNRELATED, and " +
      "the test suite holds that line.",
    category: "religion",
    subcategory: OKOMILO_LANES.open,
    eventType: "disputed",
    evidenceStatus: "unresolved",
    tags: ["olokun", "alokoko", "linguistics", "open-question", "evidence:linguistic", "evidence:comparative-hypothesis", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [AVHIANWU, BENIN_KINGDOM],
    claims: [undated("edo_religion_encyclopedia", "No date — a comparison, not an event", "A methodological record.", "other")],
  },
];

// ---------------------------------------------------------------------------
// LANE: COLONIAL RECORD
// ---------------------------------------------------------------------------

const COLONIAL_EVENTS: SeedEvent[] = [
  {
    slug: "okomilo-kukuruku-division",
    title: "Kukuruku Division, headquarters Fugar",
    summary:
      "The Royal Niger Company handed the area to the British government in 1899; Kukuruku Division was created in 1918 " +
      "with its headquarters at Fugar (J. C. Walker first District Officer), in Benin Province; renamed Afenmai in 1956.",
    description:
      "WHY IT MATTERS FOR GENEALOGY: before 1956 every official record of an Ogbona person — court cases, tax rolls, " +
      "school returns, recruitment, ex-servicemen lists — sits under KUKURUKU DIVISION, BENIN PROVINCE, not Etsako or " +
      "Afemai. Archive searches must use the colonial names.\n\n" +
      "Kukuruku 'holds no inherent meaning' in Etsako, according to one newspaper account; it is an outsiders' name.",
    category: "history",
    subcategory: OKOMILO_LANES.colonial,
    eventType: "historical",
    tags: ["kukuruku", "benin-province", "fugar", "colonial", "avhianwu-context", "evidence:colonial-document", "evidence:community-history", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["J. C. Walker"],
    civilisations: [AVHIANWU, "British colonial Nigeria"],
    locationName: "Fugar, Kukuruku Division, Benin Province",
    imageUrl: commonsFilePathUrl("Nigeria_Edo_State_map.png"),
    media: [
      commons(
        "Nigeria_Edo_State_map.png",
        "Locator map of present-day Edo State within Nigeria. A modern administrative map, not a colonial one: Kukuruku " +
          "Division and Benin Province had different boundaries, and Ogbona is not marked.",
        "map",
        { identificationStatus: "secure", subject: "Edo State, Nigeria (modern boundaries)" }
      ),
    ],
    claims: [
      {
        sourceKey: "oe_kukuruku",
        startYear: 1918,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "'created in 1918 with its Headquarters at Fugar'",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence: "From the Okhaishie text as reproduced online; the colonial gazette notice was not seen.",
      },
      {
        sourceKey: "oe_kukuruku",
        startYear: 1899,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "Royal Niger Company hands Kukuruku to the British government, 1899",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "transfer from Royal Niger Company administration",
        evidence: "As above.",
      },
      {
        sourceKey: "oe_kukuruku",
        startYear: 1956,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "Renamed Afenmai Division, 1956",
        datingMethod: "source_assertion",
        chronology: "community",
        whatIsDated: "the renaming",
        evidence: "As above.",
      },
    ],
  },
  {
    slug: "okomilo-native-administration-courts",
    title: "Clan Native Administrations (1932) and Native Clan Courts (1937) in Avhianwu",
    summary: "Indirect-rule reorganisation: Avhianwu became a clan Native Administration in 1932 and received Native Clan Courts in 1937.",
    description:
      "The years when the British reorganised Kukuruku Division by clan — the same years as the Denton (1936) and " +
      "Stanfield (1937) intelligence reports, which were written to justify that reorganisation and usually record clan " +
      "genealogies taken from elders. The Native Court records from 1937 onwards are where land and family disputes " +
      "naming Okomilo men would be.",
    category: "history",
    subcategory: OKOMILO_LANES.colonial,
    eventType: "historical",
    tags: ["native-court", "indirect-rule", "colonial", "avhianwu-context", "evidence:community-history", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [AVHIANWU, "British colonial Nigeria"],
    locationName: "Avhianwu clan, Kukuruku Division",
    claims: [
      {
        sourceKey: "okhaishie_1999",
        citations: [{ sourceKey: "oe_major_events", relation: "supports", note: "Online reproduction — same source." }],
        startYear: 1932,
        endYear: 1937,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "'1932 clan Native Administrations… 1937 Native Clan Courts'",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence: "Community chronology; gazette notices not seen.",
      },
    ],
  },
  {
    slug: "okomilo-denton-1936-report",
    title: "Denton's 1936 intelligence report on the Etsako clans — not yet found",
    summary:
      "Cited by later scholarship as N. Denton, 'Political Intelligence Report on the Etsako Clans of the Kukuruku " +
      "Division', 1936, NAI Ibadan. No file number, microfilm or quotation was located. A 1936 Denton report on Ifeku " +
      "Island in the same division WAS found.",
    description:
      "WHAT WAS FOUND: 'Mr H.C.B. Denton' wrote an 'Intelligence Report on Ifeku Island, Benin Province' (Kukuruku " +
      "Division) in October 1936, catalogued in the Lagos National Museum archive; a 'C. B. Denton, Esquire', Acting " +
      "District Officer of Kukuruku Division, dealt with the Avhianwu Clan Council; D. P. Stanfield's 1937 Awain and Aviele " +
      "clan reports sit in the same archive; CRL holds a 16-reel microfilm of southern Nigerian intelligence reports, " +
      "c.1930–43.\n\n" +
      "WHAT WAS NOT: the Etsako report itself. It has NOT been opened, and nothing in this track quotes or summarises its " +
      "contents. Whether it mentions Okomilo, Ogbona, Anwu, Alokoko or the python is unknown.\n\n" +
      "WHY IT MATTERS: intelligence reports of this kind recorded clan genealogies and migration traditions from elders. " +
      "If it contains the Anwu tradition, the written record would move back from 1999 to 1936 — and its underlying " +
      "evidence would still be oral testimony, which should be recorded as such.",
    category: "history",
    subcategory: OKOMILO_LANES.colonial,
    eventType: "historical",
    evidenceStatus: "historical_report_remains_lost",
    tags: ["denton", "intelligence-report", "colonial", "kukuruku", "inaccessible", "avhianwu-context", "evidence:colonial-document", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["N. Denton", "H. C. B. Denton", "D. P. Stanfield"],
    civilisations: [AVHIANWU, "British colonial Nigeria"],
    locationName: "National Archives of Nigeria, Ibadan (reported)",
    claims: [
      {
        sourceKey: "denton_1936_etsako",
        citations: [
          { sourceKey: "denton_1936_ifeku", relation: "context", note: "A different 1936 Denton report from the same division — establishes the officer and the archive, not the Etsako report's content." },
          { sourceKey: "stanfield_1937", relation: "context", note: "Sibling clan reports of 1937." },
          { sourceKey: "crl_intel", relation: "context", note: "Microfilm set to search." },
        ],
        startYear: 1936,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "1936 (as cited by later scholarship)",
        datingMethod: "source_assertion",
        chronology: "historical",
        whatIsDated: "the report's compilation",
        evidence: "The year as cited by later writers. The report itself has not been seen.",
      },
    ],
  },
  {
    slug: "okomilo-omo-ananigie-1946",
    title: "Omo-Ananigie publishes 'A Brief History of Etsakor' (Lagos, 1946)",
    summary:
      "The oldest published Etsako history located: Peter Inahoureme Omo-Ananigie, 'A Brief History of Etsakor: Being a " +
      "Critique of the History of Etsakor (in three parts)', Ope Ife Press, Lagos, 1946. A copy survives on microfilm at " +
      "the Hoover Institution.",
    description:
      "NEW BIBLIOGRAPHIC DETAIL: the author's full name (Peter Inahoureme Omo-Ananigie), the subtitle, the publisher (Ope " +
      "Ife Press, Lagos; 'Ope-Ifa' in one bibliography) and a holding (Simon Ottenberg's Nigerian pamphlet collection, " +
      "Hoover Institution, microfilm). He is described as from Etsako-West.\n\n" +
      "WHAT IT IS QUOTED AS SAYING (second-hand, via blogs): Oluku as common ancestor with five sons — Uzairue, Ekperi, " +
      "'Ayawun', Weppa and Wanno; Oluku's family persecuted by an Adenomo and settling 'between the swampy River Olie " +
      "valley, Okpella and Ibie Hills'; Uzairue marrying Azama.\n\n" +
      "WHAT IS NOT KNOWN: whether it names Anwu, Alokoko, Ewuare or Ozolua. It has not been opened. If it carries the Anwu " +
      "tradition, the written Avhianwu record moves back from 1999 to 1946.",
    category: "history",
    subcategory: OKOMILO_LANES.colonial,
    eventType: "historical",
    tags: ["omo-ananigie", "etsako-history", "source-chain", "inaccessible", "avhianwu-context", "evidence:community-history", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Peter Inahoureme Omo-Ananigie", "Oluku", "Adenomo"],
    civilisations: [AVHIANWU],
    locationName: "Lagos (publication)",
    claims: [
      {
        sourceKey: "omo_ananigie_1946",
        startYear: 1946,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "Ope Ife Press, Lagos, 1946",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "publication",
        evidence: "From the Hoover/Ottenberg pamphlet inventory.",
      },
    ],
  },
  {
    slug: "okomilo-descent-of-avhianwu-1999",
    title: "'The Descent of Avhianwu' published (Ibadan, 1999)",
    summary:
      "Aha Idokpesi Okhaishie n'Avhianwu's history of the clan, Stirling-Horden, Ibadan, 1999 — the source of most of what " +
      "circulates online about Anwu, the two migrations and the Avhianwu chronology.",
    description:
      "THE HUB OF THE SOURCE CHAIN. ogbonaelites.org reproduces chapters under the author's name ('Major Events in " +
      "Avhianwu History', 'The Creation of Kukuruku Division'); Fugar America Foundation and others repeat its sentences. " +
      "Those are one source in several places.\n\n" +
      "WHAT IT CITES IS UNKNOWN — and is the most important single question in this track's source chain. The book was " +
      "not opened; no table of contents, index or bibliography was reachable. A bookseller snippet mentions its treatment " +
      "of bride price ('Amhoya at marriage becomes a bona-fide property of the husband') and of foreign religions.",
    category: "history",
    subcategory: OKOMILO_LANES.avhianwu,
    eventType: "historical",
    tags: ["okhaishie", "source-chain", "inaccessible", "avhianwu-context", "evidence:community-history", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Aha Idokpesi Okhaishie n'Avhianwu"],
    civilisations: [AVHIANWU],
    locationName: "Ibadan (publication)",
    claims: [
      {
        sourceKey: "okhaishie_1999",
        startYear: 1999,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "Stirling-Horden, Ibadan, 1999",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "publication",
        evidence: "Publisher and bookseller listings.",
      },
    ],
  },
  {
    slug: "okomilo-hitler-war-avhianwu",
    title: "'Hitler War' in Avhianwu, and the soldiers' return in 1945",
    summary:
      "The Avhianwu chronology records WWII as 'Hitler War' (1939) and, in 1945, returning soldiers who 'inundated the " +
      "Avhianwu clan with money demanding their wives'. Context for Sam's father's family testimony; he is not named.",
    description:
      "A rare local record of the war's effect on the clan. Alongside it, documented context: Nigerian Pioneers were in " +
      "the Middle East by April 1945; eleven Nigerian garrison companies landed there between September 1945 and January " +
      "1946 and waited — 'stranded on foreign soils of India and North Africa' — for ships home; and from 1942 forced " +
      "labour drove tin output on the Jos plateau, where many Benin Province men lived and worked.\n\n" +
      "None of this names Sam's father. It establishes that 'in Egypt' is historically plausible for a Nigerian " +
      "serviceman, and that a Kukuruku Division man in Jos in the 1940s is unremarkable.",
    category: "history",
    subcategory: OKOMILO_LANES.colonial,
    eventType: "historical",
    tags: ["ww2", "rwaff", "egypt", "jos", "avhianwu-context", "evidence:community-history", "evidence:modern-scholarship", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [AVHIANWU, "British colonial Nigeria"],
    claims: [
      {
        sourceKey: "okhaishie_1999",
        citations: [{ sourceKey: "oe_major_events", relation: "supports", note: "Online reproduction — same source." }],
        startYear: 1939,
        endYear: 1945,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "'Hitler War' 1939 … soldiers return 1945",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence: "Community chronology.",
      },
      {
        sourceKey: "jich_2020_repatriation",
        startYear: 1945,
        startMonth: 9,
        endYear: 1946,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "Garrison companies disembark in the Middle East, Sept–Oct 1945 to Jan 1946",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "West African garrison companies in the Middle East",
        evidence: "Peer-reviewed article built on archival files; read at snippet level.",
      },
      {
        sourceKey: "jos_tin_labour",
        startYear: 1942,
        startMonth: 2,
        endYear: 1944,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "Forced labour on the Jos tin fields from February 1942 to the end of 1944",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "wartime forced labour at Jos",
        evidence: "Academic article; snippet level.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// LANE: OPEN QUESTIONS / DEBATES — one record per question, so a question
// is something a reader can find, link to and eventually close.
// ---------------------------------------------------------------------------

type OpenQuestion = { slug: string; title: string; summary: string; description: string; tags: string[]; sourceKey?: string | null; okomiloSpecific?: boolean };

function openQuestion(q: OpenQuestion): SeedEvent {
  return {
    slug: q.slug,
    title: q.title,
    summary: q.summary,
    description: q.description,
    category: "history",
    subcategory: OKOMILO_LANES.open,
    eventType: "disputed",
    eventTypeNote: "An open question, recorded so that it can be answered rather than forgotten.",
    evidenceStatus: "unresolved",
    tags: [
      "open-question",
      ...(q.okomiloSpecific ? ["okomilo", "okomilo-specific"] : ["avhianwu-context"]),
      ...q.tags,
      q.okomiloSpecific ? GENEALOGY_LAYER_TAGS.unknown : GENEALOGY_LAYER_TAGS.tradition,
    ],
    civilisations: [AVHIANWU],
    claims: [undated(q.sourceKey ?? null, "Unresolved", "An open question has no date of its own.", "other")],
  };
}

const OPEN_QUESTIONS: SeedEvent[] = [
  openQuestion({
    slug: "okomilo-q-sams-paternal-grandfather",
    title: "Who was Sam Okomilo's paternal grandfather?",
    summary: "Unknown, and unknowable until Sam's father is named. The first of the missing generations.",
    description:
      "Requires Sam's father's name first. Candidates to test once that is known: George Okomilo (Catholic pioneer, " +
      "1931–32) and Pa Simeon Okomilo (Innih representative) are documented Okomilo men of plausibly earlier generations; " +
      "neither is assumed.",
    tags: ["genealogy"],
    sourceKey: "family_testimony",
    okomiloSpecific: true,
  }),
  openQuestion({
    slug: "okomilo-q-founder-of-okomilo-family",
    title: "Who founded the Okomilo family, and when did it become a family of Innih?",
    summary: "No founder, founding generation or date of arrival in Innih is recorded in any source found.",
    description:
      "The question splits in two: was Okomilo an ancestor's name (as Innih appears to be), and did his descendants branch " +
      "from another Innih family or arrive from elsewhere? The family ancestral shrine and its line of custodians is the " +
      "likeliest surviving record. Elders of the Okomilo family are the primary source, and should be recorded.",
    tags: ["innih", "founder"],
    sourceKey: "oe_kindreds",
    okomiloSpecific: true,
  }),
  openQuestion({
    slug: "okomilo-q-meaning-of-okomilo",
    title: "What does 'Okomilo' mean?",
    summary: "MEANING UNRESOLVED. No Etsako dictionary, wordlist, name study or community gloss for Okomilo was found.",
    description:
      "Searched: Etsako name lists (the community list has no entry), Edoid linguistic material reachable by search, and " +
      "the surname with 'meaning'. Nothing found. Yoruba 'oko' (farm, husband) is NOT relevant without a demonstrated " +
      "historical link and is not used.\n\n" +
      "Whether Okomilo is a personal name, a sentence name (Etsako names are often short sentences — 'God makes the " +
      "plans'), a praise name, an ancestor's name or a title is unknown. The academic paper 'Indigenous Etsako Names Among " +
      "Auchi People' (Fourth World Journal) and Okomilo family elders are the next places to ask.",
    tags: ["linguistics", "onomastics", "evidence:linguistic"],
    sourceKey: "oe_names",
    okomiloSpecific: true,
  }),
  openQuestion({
    slug: "okomilo-q-meaning-of-ikhenemho",
    title: "What does 'Ikhenemho' mean — and does it remember the war?",
    summary:
      "Family tradition: Sam's father gave him the name after surviving WWII. No gloss or segmentation of Ikhenemho / " +
      "Ikhenemo was found.",
    description:
      "If Ikhenemho is a sentence name (as many Etsako names are), its meaning may say something about the father's " +
      "experience — but only once a speaker or a linguistic source segments it. Not guessed here. Ikhememho and Ikhenenbo " +
      "appear nowhere and are treated as errors, not variants.",
    tags: ["linguistics", "onomastics", "ww2", "evidence:linguistic"],
    sourceKey: "family_testimony",
    okomiloSpecific: true,
  }),
  openQuestion({
    slug: "okomilo-q-meaning-of-innih",
    title: "What does 'Innih' mean?",
    summary: "One family genealogy makes Innih a son of Okoko — a personal name. No linguistic gloss was found.",
    description: "See the Innih village record. Whether all nine families accept Innih as an eponymous ancestor is unknown.",
    tags: ["innih", "linguistics"],
    sourceKey: "oe_chiefs",
  }),
  openQuestion({
    slug: "okomilo-q-who-was-anwu",
    title: "Who exactly was Anwu, and why did he leave Benin?",
    summary:
      "Son of Azama (one tradition) or descendant of Oluku (another); left during a royal mourning decree (Ewuare version) " +
      "or a civil war at Ozolua's accession (Ozolua version). No source says what his status in Benin was.",
    description:
      "Two parentage traditions and two motives, recorded on the Anwu and migration records. The 1946 book and the 1936 " +
      "report are the oldest places either could be checked.",
    tags: ["anwu", "migration"],
    sourceKey: "oe_adl",
  }),
  openQuestion({
    slug: "okomilo-q-ewuare-or-ozolua",
    title: "Was the migration under Ewuare or Ozolua?",
    summary: "Both are claimed; the reigns do not overlap; no independent source decides it. Kept as competing claims.",
    description: "See the migration record and its two source genealogies. The question is about the sources as much as the event.",
    tags: ["ewuare", "ozolua", "migration"],
    sourceKey: "okhaishie_1999",
  }),
  openQuestion({
    slug: "okomilo-q-who-was-alokoko",
    title: "Who was Alokoko, and how old is the sacred-python tradition?",
    summary:
      "Every source reached calls her a human ancestral mother. The earliest written trace found is 1999. Why the python is " +
      "sacred is not explained in any source reached.",
    description:
      "Open sub-questions: (1) is Alokoko ever described as a python, spirit or deity? (2) is the python taboo older than " +
      "its 1999 attestation? (3) why the python — does any source give an origin story, such as the river-crossing episode " +
      "that was searched for and not found? (4) is Alokoko specifically Ogbona's, or all Avhianwu's? The purification is " +
      "located at Ogbona, which suggests the latter centred on the former.",
    tags: ["alokoko", "python"],
    sourceKey: "oe_history_tag",
  }),
  openQuestion({
    slug: "okomilo-q-leopard-in-avhianwu",
    title: "Did leopard symbolism have any role in Avhianwu?",
    summary:
      "NOTHING FOUND. No Avhianwu or Ogbona leopard taboo, title, ritual, proverb or lineage was documented in any source " +
      "reached. Benin's royal leopard is well documented and is NOT used to supply one.",
    description:
      "Recorded as a negative result. A Benin connection cannot be made from similarity alone; the Benin leopard material " +
      "sits in its own context record.",
    tags: ["leopard", "evidence:comparative-hypothesis"],
  }),
  openQuestion({
    slug: "okomilo-q-age-of-religious-institutions",
    title: "How old are Avhianwu's traditional religious institutions?",
    summary: "Okhe, the Ogwa/Ogiamotsu shrines, the Alokoko purification and the Osi- naming are documented in the present; none is dated.",
    description:
      "The only dates attached to any of them are 1891/1851 (the Okhe dispute) and 1908 (Ogbona's Ogiamotsu). The oldest " +
      "external description would be the 1936 intelligence report.",
    tags: ["religion", "okhe"],
  }),
  openQuestion({
    slug: "okomilo-q-archaeology-of-etsako",
    title: "What archaeology exists in Etsako / Afemai?",
    summary:
      "No excavation, radiocarbon date, smelting site or rock-shelter study for Etsako, Avhianwu, Ogbona, Fugar, Uzairue or " +
      "Auchi was found. Benin City's archaeology (Connah, Darling) is not a substitute.",
    description:
      "A negative result from search, not proof of absence: Nigerian university theses (UniBen, AAU Ekpoma, Ibadan " +
      "Archaeology) are the place to check. Any prehistoric population found would be context for the region and NOT " +
      "named Okomilo ancestors.",
    tags: ["archaeology", "evidence:archaeology"],
  }),
];

// ---------------------------------------------------------------------------
// LANES: KINGDOM OF BENIN CONTEXT and MATERIAL CULTURE
//
// "HISTORICAL CONTEXT OF THE SOCIETY FROM WHICH AVHIANWU TRADITION SAYS ANWU
// MIGRATED." Not ancestry. Every record here carries the context tag, and none
// is joined to the family by a parent–child edge.
// ---------------------------------------------------------------------------

const CONTEXT_NOTE =
  "HISTORICAL CONTEXT OF THE SOCIETY FROM WHICH AVHIANWU TRADITION SAYS ANWU MIGRATED — not a record of Okomilo " +
  "ancestry. The Kingdom of Benin here is Benin City, Edo State, NIGERIA, not the Republic of Benin.";

const BENIN_CITY = { lat: 6.335, lng: 5.627 };

const BENIN_EVENTS: SeedEvent[] = [
  {
    slug: "okomilo-benin-ogiso-tradition",
    title: "The Ogiso kings in Benin tradition",
    summary: "Benin tradition remembers a first dynasty, the Ogiso ('rulers of the sky'), before the present line of Obas.",
    description:
      CONTEXT_NOTE +
      "\n\nThe Ogiso are described in standard references as semi-legendary; no securely dated evidence attaches to " +
      "individual Ogiso. Their era is left undated here rather than borrowed from a king-list count.",
    category: "history",
    subcategory: OKOMILO_LANES.benin,
    eventType: "traditional_account",
    tags: ["ogiso", "benin-kingdom-context", "kingdom-of-benin", "evidence:oral-tradition", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [BENIN_KINGDOM],
    locationName: "Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    claims: [undated("britannica_benin", "Before the 13th-century Oba dynasty; no date", "Tradition gives an order, not years.", "traditional", "oral_tradition")],
  },
  {
    slug: "okomilo-benin-oranmiyan-eweka",
    title: "Oranmiyan of Ife and Eweka, first Oba of Benin",
    summary: "By tradition, the Edo invited Prince Oranmiyan of Ife in the 13th century; his son Eweka became the first Oba.",
    description: CONTEXT_NOTE,
    category: "history",
    subcategory: OKOMILO_LANES.benin,
    eventType: "traditional_account",
    tags: ["oranmiyan", "eweka", "benin-kingdom-context", "kingdom-of-benin", "evidence:oral-tradition", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Oranmiyan", "Eweka I"],
    civilisations: [BENIN_KINGDOM],
    locationName: "Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    claims: [
      {
        sourceKey: "britannica_benin",
        startYear: 1200,
        endYear: 1299,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        originalDateText: "13th century",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence: "A reference work's placement of the tradition.",
      },
    ],
  },
  {
    slug: "okomilo-benin-connah-excavations",
    title: "Connah's excavations in Benin City: radiocarbon dates for the early city",
    summary:
      "Graham Connah excavated in Benin City in 1961–64. A cistern dated to the 13th century AD; the base of the Ogba Road " +
      "ditch to cal. AD 1180–1500; the inner-city earthworks placed in the 13th–15th centuries.",
    description:
      CONTEXT_NOTE +
      "\n\nThe archaeology of Benin City, not of Etsako: it describes the city a migrant from Benin would have left, and " +
      "says nothing about any individual. No comparable work was found for the Avhianwu area.",
    category: "archaeology",
    subcategory: OKOMILO_LANES.benin,
    eventType: "archaeological_interpretation",
    tags: ["connah", "radiocarbon", "benin-kingdom-context", "kingdom-of-benin", "evidence:archaeology", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Graham Connah"],
    civilisations: [BENIN_KINGDOM],
    locationName: "Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    claims: [
      {
        sourceKey: "connah_benin",
        startYear: 1180,
        endYear: 1500,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "radiometric_date",
        originalDateText: "Base of the Ogba Road ditch, cal. AD 1180–1500",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        whatIsDated: "the base of the Ogba Road ditch",
        evidence: "Calibrated radiocarbon range as reported in later reassessment; snippet level.",
      },
      {
        sourceKey: "connah_benin",
        startYear: 1961,
        endYear: 1964,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "Excavations 1961–64",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "the excavations themselves",
        evidence: "Dates of fieldwork.",
      },
    ],
  },
  {
    slug: "okomilo-benin-iya-earthworks",
    title: "The iya: Benin's earthworks",
    summary:
      "Patrick Darling surveyed about 1,500 km of iya in 1973–77 and estimated about 16,000 km in all, enclosing over 500 " +
      "communities across some 6,500 km² — among the largest earthworks of the pre-mechanical world.",
    description:
      CONTEXT_NOTE +
      "\n\nTradition credits Ewuare with enlarging the city's walls and ditches, which ties the earthworks to the reign " +
      "in which Claim A puts Anwu's departure. The landscape-scale iya, though, belong to many centuries and many " +
      "communities.",
    category: "archaeology",
    subcategory: OKOMILO_LANES.benin,
    eventType: "archaeological_interpretation",
    tags: ["iya", "earthworks", "darling", "benin-kingdom-context", "kingdom-of-benin", "evidence:archaeology", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Patrick Darling"],
    civilisations: [BENIN_KINGDOM],
    locationName: "Benin City and surrounding Edo landscape, Nigeria",
    ...BENIN_CITY,
    imageUrl: commonsFilePathUrl("Benin_wallsss.jpg"),
    media: [
      commons(
        "Benin_wallsss.jpg",
        "UNVERIFIED — a photograph filed on Commons as the Benin walls or moat. Which section of the iya it shows, and when " +
          "it was taken, could not be checked; it is not a picture of any earthwork in Etsako or Avhianwu.",
        "site",
        { identificationStatus: "unverified", subject: "Benin City earthworks (iya), section not identified" }
      ),
    ],
    claims: [
      {
        sourceKey: "darling_iya",
        startYear: 1973,
        endYear: 1977,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "Survey 1973–77",
        datingMethod: "historical_record",
        chronology: "archaeological",
        whatIsDated: "Darling's survey",
        evidence: "The survey's dates; the earthworks themselves span centuries.",
      },
    ],
  },
  {
    slug: "okomilo-benin-ewuare-reign",
    title: "Oba Ewuare the Great (c.1440–c.1473)",
    summary:
      "Born Ogun, took the throne after killing his brother Uwaifiokun; rebuilt and enlarged Benin City and reorganised its " +
      "government. CLAIM A of the Avhianwu migration places Anwu's departure in his reign.",
    description: CONTEXT_NOTE,
    category: "history",
    subcategory: OKOMILO_LANES.benin,
    eventType: "historical",
    tags: ["ewuare", "oba", "benin-kingdom-context", "kingdom-of-benin", "evidence:modern-scholarship", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Ewuare", "Uwaifiokun"],
    civilisations: [BENIN_KINGDOM],
    locationName: "Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    claims: [
      {
        sourceKey: "wiki_ewuare",
        citations: [{ sourceKey: "britannica_benin", relation: "supports", note: "Same conventional dates." }],
        startYear: 1440,
        endYear: 1473,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        originalDateText: "c.1440–c.1473",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "Conventional regnal dates, derived ultimately from Benin court tradition (Egharevba) — themselves a reconstruction.",
      },
    ],
  },
  {
    slug: "okomilo-benin-ozolua-reign",
    title: "Oba Ozolua the Conqueror (c.1481–c.1504) and the Portuguese",
    summary:
      "Ewuare's youngest son, who extended Benin from the Niger towards Lagos; João Afonso de Aveiro reached Benin in " +
      "1485/86. CLAIM B of the Avhianwu migration places Anwu's departure early in his reign.",
    description:
      CONTEXT_NOTE +
      "\n\nThe Okhaishie chronology lists d'Aveiro's arrival (1485) immediately after the 1481–85 migration — the clearest " +
      "sign that the Avhianwu chronology was built against the Benin king-list.",
    category: "history",
    subcategory: OKOMILO_LANES.benin,
    eventType: "historical",
    tags: ["ozolua", "oba", "portuguese", "benin-kingdom-context", "kingdom-of-benin", "evidence:modern-scholarship", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Ozolua", "Esigie", "João Afonso de Aveiro"],
    civilisations: [BENIN_KINGDOM],
    locationName: "Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    imageUrl: commonsFilePathUrl("Queen_Mother_Pendant_Mask-_Iyoba_MET_DP231460.jpg"),
    media: [
      commons(
        "Queen_Mother_Pendant_Mask-_Iyoba_MET_DP231460.jpg",
        "Ivory pendant mask of an Iyoba (queen mother), Edo, Kingdom of Benin, in the Metropolitan Museum of Art. Associated " +
          "with Idia, mother of Ozolua's son Esigie — a later object of the court Ozolua founded, not a portrait of Ozolua " +
          "or anything to do with Anwu.",
        "artefact",
        { identificationStatus: "secure", institution: "The Metropolitan Museum of Art", originalSourceUrl: "https://www.metmuseum.org/art/collection/search/318622", subject: "Iyoba pendant mask" }
      ),
    ],
    claims: [
      {
        sourceKey: "wiki_ozolua",
        citations: [{ sourceKey: "britannica_benin", relation: "supports", note: "Same conventional dates." }],
        startYear: 1481,
        endYear: 1504,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        originalDateText: "c.1481–c.1504",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "Conventional regnal dates.",
      },
      {
        sourceKey: "wiki_ozolua",
        startYear: 1485,
        endYear: 1486,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "d'Aveiro reaches Benin, 1485 or 1486",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "first definite Portuguese contact",
        evidence: "European documentary dating; sources differ by a year.",
      },
    ],
  },
  {
    slug: "okomilo-benin-palace-pythons",
    title: "The brass pythons (ikpin) of the Oba's palace",
    summary:
      "Monumental cast-brass snakes ran head-down the palace turrets; they were taken in 1897 and survive as heads and " +
      "fragments in museums. Scholars disagree whether the snake is a python (Ben-Amos, linked to Olokun) or a puff adder " +
      "(Nevadomsky).",
    description:
      CONTEXT_NOTE +
      "\n\nWHAT SURVIVES AND WHERE (as far as search reached): a British Museum brass snake head, Af1954,08.1; a Digital " +
      "Benin 'Ikpin (snake figure) body fragment and head', 17th/18th century, one head sold to Hamburg in 1903; a large " +
      "brass snake head in the Benin National Museum; and the snake shown running down a turret on palace plaques (Berlin " +
      "III C 8377) and on a brass box in the form of a palace. A Met plaque of a snake (1979.206.96) is a separate object " +
      "type.\n\n" +
      "MEANING: Digital Benin calls the crocodile and the boa guardians of Olokun; Olokun literature calls snakes his " +
      "messengers and says pythons are sent to punish wrongdoing. The roof snakes were protective.\n\n" +
      "1897: Digital Benin states the ikpin were taken when the palace burned in 1897 and are not on the present palace " +
      "roof. A claim that 'fifteen' heads survive could not be traced to a source and is not used.\n\n" +
      "No public-domain photograph of a roof snake head was found; the picture here is a plaque that may show one, marked " +
      "accordingly.",
    category: "culture",
    subcategory: OKOMILO_LANES.material,
    eventType: "historical",
    tags: ["python", "ikpin", "palace", "olokun", "1897", "benin-kingdom-context", "kingdom-of-benin", "evidence:museum-object", "evidence:material-culture", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [BENIN_KINGDOM],
    locationName: "The Oba's palace, Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    imageUrl: commonsFilePathUrl("Benin_plaque_in_the_Ethnological_Museum,_Berlin_-_080.JPG"),
    media: [
      commons(
        "Benin_plaque_in_the_Ethnological_Museum,_Berlin_-_080.JPG",
        "UNVERIFIED — a Benin brass plaque in the Ethnological Museum, Berlin, filed on Commons under snakes in art. Whether " +
          "it shows a palace snake was not checked against the image or the museum record; it is not a roof python head.",
        "artefact",
        { identificationStatus: "unverified", institution: "Ethnologisches Museum, Berlin", subject: "Benin plaque (subject unconfirmed)" }
      ),
    ],
    claims: [
      {
        sourceKey: "digital_benin_ikpin",
        citations: [
          { sourceKey: "bm_snake_head", relation: "context", note: "A surviving brass snake head; no date visible in the snippet." },
          { sourceKey: "artic_edo_spaces", relation: "context", note: "Python (Ben-Amos) vs puff adder (Nevadomsky)." },
        ],
        startYear: 1600,
        endYear: 1799,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        originalDateText: "17th/18th century (catalogued ikpin fragment and head)",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        whatIsDated: "surviving ikpin fragments",
        evidence: "Catalogue dating of surviving pieces, not of the custom.",
      },
      {
        sourceKey: "dapper_1668",
        startYear: 1668,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        originalDateText: "Dapper's description, 1668",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "the earliest printed European description of the palace turrets",
        evidence:
          "Second-hand: Dapper never saw Benin. The snippets reached mention turret birds and brass-covered pillars; the " +
          "snakes under the birds are described in modern commentary on his account.",
      },
    ],
  },
  {
    slug: "okomilo-benin-leopard-symbolism",
    title: "The leopard and the Oba",
    summary:
      "The Oba is 'ekpen n'owa', leopard of the house, against 'ekpen n'oha', the leopard of the bush. Leopard aquamaniles " +
      "held the water for the Oba's hands; tamed leopards were kept at the palace before 1897.",
    description:
      CONTEXT_NOTE +
      "\n\nNO AVHIANWU COUNTERPART WAS FOUND (see the open question). This record is Benin's, and only Benin's.",
    category: "culture",
    subcategory: OKOMILO_LANES.material,
    eventType: "historical",
    tags: ["leopard", "oba", "aquamanile", "benin-kingdom-context", "kingdom-of-benin", "evidence:museum-object", "evidence:material-culture", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [BENIN_KINGDOM],
    locationName: "Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    imageUrl: commonsFilePathUrl("Leopard_aquamanile,_Nigeria,_Benin_Kingdom,_17th_century_AD,_brass_-_Ethnological_Museum,_Berlin_-_DSC02208.JPG"),
    media: [
      commons(
        "Leopard_aquamanile,_Nigeria,_Benin_Kingdom,_17th_century_AD,_brass_-_Ethnological_Museum,_Berlin_-_DSC02208.JPG",
        "Brass leopard aquamanile, Kingdom of Benin, 17th century, Ethnological Museum Berlin — the vessel type used for the " +
          "Oba's hand-washing. One object of a type, not a symbol of Avhianwu.",
        "artefact",
        { identificationStatus: "secure", institution: "Ethnologisches Museum, Berlin", subject: "Leopard aquamanile", objectDate: "17th century" }
      ),
      commons(
        "Brass_Leopard_from_the_Kingdom_of_Benin_in_the_Cambridge_University_Museum_of_Archaeology_and_Anthropology.jpg",
        "Brass leopard from the Kingdom of Benin, Museum of Archaeology and Anthropology, Cambridge. A different object from " +
          "the Berlin aquamanile; its date and 1897 history are not given here because they were not checked.",
        "artefact",
        { identificationStatus: "secure", institution: "Museum of Archaeology and Anthropology, University of Cambridge", subject: "Brass leopard" }
      ),
    ],
    claims: [
      {
        sourceKey: "met_leopard",
        citations: [{ sourceKey: "artic_leopard", relation: "context", note: "ekpen n'owa / ekpen n'oha; aquamanile use." }],
        startYear: 1550,
        endYear: 1680,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        originalDateText: "1550–1680 (Met leopard figure)",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        whatIsDated: "one surviving leopard figure",
        evidence: "Museum dating of one object.",
      },
    ],
  },
  {
    slug: "okomilo-benin-osanobua-olokun-ogun",
    title: "Osanobua, Olokun and Ogun in Edo religion",
    summary:
      "Osanobua the creator rules the spirit world from a palace; his son Olokun rules the waters and gives wealth and " +
      "children; Ogun is patron of smiths, brass-casters, warriors and hunters.",
    description:
      CONTEXT_NOTE +
      "\n\nThe Edo religious world in outline. Whether any of it reached Avhianwu belief by descent, borrowing or not at " +
      "all is not documented; Osanobua's Avhianwu counterpart is unattested, and Olokun is not Alokoko.",
    category: "religion",
    subcategory: OKOMILO_LANES.benin,
    eventType: "religious_account",
    tags: ["osanobua", "olokun", "ogun", "benin-kingdom-context", "kingdom-of-benin", "evidence:modern-scholarship", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [BENIN_KINGDOM],
    locationName: "Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    claims: [undated("edo_religion_encyclopedia", "Undated — a description of belief", "Reference-work description; no date of origin.", "religious", "source_assertion")],
  },
  {
    slug: "okomilo-benin-royal-ancestral-altars",
    title: "Royal ancestral altars of Benin",
    summary:
      "Altars to royal ancestors, crowded with cast-brass heads, bells and tableaux; altars to the hand (ikegobo). Cyril " +
      "Punch photographed a palace ancestral shrine in 1891, six years before the city was sacked.",
    description:
      CONTEXT_NOTE +
      "\n\nAncestor veneration on a royal scale. It is tempting to set it beside Avhianwu's family ancestral shrines; " +
      "that comparison is not made here, because nothing documented joins them beyond both being West African ancestor " +
      "cults in the Edoid world.",
    category: "religion",
    subcategory: OKOMILO_LANES.material,
    eventType: "historical",
    tags: ["ancestral-altar", "ikegobo", "benin-kingdom-context", "kingdom-of-benin", "evidence:museum-object", "evidence:material-culture", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Cyril Punch"],
    civilisations: [BENIN_KINGDOM],
    locationName: "The Oba's palace, Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    imageUrl: commonsFilePathUrl("Ancestral_shrine_Royal_Palace,_Benin_City,_1891.jpg"),
    media: [
      commons(
        "Ancestral_shrine_Royal_Palace,_Benin_City,_1891.jpg",
        "Ancestral shrine in the royal palace at Benin City, photographed by Cyril Punch in 1891 — before the 1897 " +
          "expedition. A royal shrine, not an Avhianwu or Okomilo family shrine.",
        "evidence_photograph",
        { identificationStatus: "secure", creator: "Cyril Punch", photographDate: "1891", subject: "Royal ancestral shrine, Benin City" }
      ),
      commons(
        "Head_of_an_Oba_MET_DT9876.jpg",
        "Brass commemorative head of an Oba, 1550–1680, Metropolitan Museum of Art — the kind of head that stood on royal " +
          "ancestral altars. Not a portrait of any individual named in this track.",
        "artefact",
        { identificationStatus: "secure", institution: "The Metropolitan Museum of Art", accessionNumber: "1979.206.87 (as given in a search snippet; not checked)", subject: "Head of an Oba" }
      ),
    ],
    claims: [
      {
        sourceKey: "wiki_1897",
        startYear: 1891,
        startMonth: 5,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        originalDateText: "Cyril Punch's photograph, May 1891",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "the earliest known photograph of the Oba's compound",
        evidence: "Published in Ling Roth, Great Benin (1903).",
      },
      {
        sourceKey: "met_altars",
        startYear: 1700,
        endYear: 1799,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        originalDateText: "18th century (altar tableau and ikegobo)",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        whatIsDated: "surviving altar objects",
        evidence: "Museum dating of objects.",
      },
    ],
  },
  {
    slug: "okomilo-benin-1897-expedition",
    title: "The British punitive expedition against Benin, February 1897",
    summary: "Benin City was taken, sacked and burned between 9 and 18 February 1897 and thousands of objects looted — the route by which the palace pythons and leopards reached Western museums.",
    description:
      CONTEXT_NOTE +
      "\n\nIncluded because the provenance of every Benin object in this track runs through it, and because it ended the " +
      "palace in which the ikpin stood.",
    category: "history",
    subcategory: OKOMILO_LANES.benin,
    eventType: "historical",
    tags: ["1897", "punitive-expedition", "looting", "benin-kingdom-context", "kingdom-of-benin", "evidence:contemporary-document", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    people: ["Reginald Granville"],
    civilisations: [BENIN_KINGDOM, "British Empire"],
    locationName: "Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    imageUrl: commonsFilePathUrl("Interior_of_Oba's_compound_burnt_during_siege_of_Benin_City,_1897.jpg"),
    media: [
      commons(
        "Interior_of_Oba's_compound_burnt_during_siege_of_Benin_City,_1897.jpg",
        "The burnt interior of the Oba's compound, Benin City, 1897, with brass plaques in the foreground and three British " +
          "soldiers; attributed to Reginald Granville. A record of the looting, not of Benin before it.",
        "evidence_photograph",
        { identificationStatus: "secure", creator: "Reginald Granville (attributed)", photographDate: "1897", subject: "Oba's compound after the 1897 fire" }
      ),
      commons(
        "Looted_objects_from_the_Benin_Punative_Raid,_1897.jpg",
        "British officers with objects looted from Benin City in 1897 (the file's own title misspells 'Punitive'). Shows " +
          "the looting, and does not identify which objects later reached which museum.",
        "evidence_photograph",
        { identificationStatus: "secure", photographDate: "1897", subject: "Looted objects, 1897" }
      ),
    ],
    claims: [
      {
        sourceKey: "wiki_1897",
        startYear: 1897,
        startMonth: 2,
        startDay: 9,
        endYear: 1897,
        datePrecision: "day",
        isApproximate: false,
        temporalClaimType: "date_range",
        originalDateText: "9–18 February 1897",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "Contemporary British military records, as summarised.",
      },
    ],
  },
  {
    slug: "okomilo-benin-palace-today",
    title: "The Oba's palace, Benin City, today",
    summary: "The palace was rebuilt after 1897 (by tradition under Eweka II, 1914–1932) on the site associated with the early Obas.",
    description: CONTEXT_NOTE + "\n\nIncluded so the 1897 record is not the last image of the palace in this track.",
    category: "civilisation",
    subcategory: OKOMILO_LANES.benin,
    eventType: "historical",
    tags: ["palace", "benin-kingdom-context", "kingdom-of-benin", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [BENIN_KINGDOM],
    locationName: "Benin City, Edo State, Nigeria",
    ...BENIN_CITY,
    imageUrl: commonsFilePathUrl("Royal_Palace_of_the_Oba_of_Benin.jpg"),
    media: [
      commons(
        "Royal_Palace_of_the_Oba_of_Benin.jpg",
        "The present-day royal palace of the Oba of Benin in Benin City — the rebuilt palace, not the one that stood before " +
          "1897 and not one in Etsako.",
        "site",
        { identificationStatus: "secure", subject: "Royal palace, Benin City" }
      ),
    ],
    claims: [
      {
        sourceKey: "britannica_benin",
        startYear: 1914,
        endYear: 1932,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        originalDateText: "Rebuilt under Eweka II (1914–1932)",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "As given in a Commons file description and standard accounts; snippet level.",
      },
    ],
  },
  {
    slug: "okomilo-python-comparison",
    title: "Are Avhianwu's sacred python and Benin's palace pythons historically connected?",
    summary:
      "OPEN QUESTION / COMPARATIVE HYPOTHESIS. Both traditions give the python a protected, sacred place; nothing yet " +
      "documents a historical connection between them. They are not claimed to be the same tradition.",
    description:
      "SET SIDE BY SIDE:\n" +
      "• TERMINOLOGY — Benin: ikpin (the roof snakes). Avhianwu: no Etsako word for the sacred python was found. No shared " +
      "term documented.\n" +
      "• RITUAL MEANING — Benin: protective palace emblem; snakes as Olokun's messengers and agents of punishment. " +
      "Avhianwu: a totem whose killing or eating requires purification.\n" +
      "• WATER — Benin: strong (Olokun, god of the waters). Avhianwu: none documented; the river-crossing story was not " +
      "found.\n" +
      "• ANCESTRY — Avhianwu: tied to an ancestral MOTHER, Alokoko. Benin: tied to a god and to kingship, not to an " +
      "ancestress.\n" +
      "• ROYALTY — Benin: royal. Avhianwu: clan-wide, not royal.\n" +
      "• TABOO — Avhianwu: explicit. Benin: python taboos exist in Edo belief, but no specific comparison was found.\n" +
      "• MIGRATION — Avhianwu tradition derives the people from Benin; it does not derive the python from Benin.\n" +
      "• GEOGRAPHY AND CHRONOLOGY — same Edoid world; Benin's roof snakes are attested from the 16th–18th centuries in " +
      "objects; the Avhianwu taboo from 1999 in writing.\n\n" +
      "INTERPRETATIONS THAT COEXIST: historical continuity from Benin; a broader Edo inheritance shared by both; later " +
      "borrowing in either direction; independent development (python reverence is widespread in West Africa); or " +
      "insufficient evidence to say. The last is where the evidence currently stands.",
    category: "religion",
    subcategory: OKOMILO_LANES.open,
    eventType: "hypothesised",
    eventTypeNote: "A comparison, explicitly unestablished.",
    evidenceStatus: "unresolved",
    transmissionStatus: "contact_possible",
    argumentsFor:
      "The Avhianwu migration tradition places the people's origin in Benin, where the python was a sacred royal emblem; " +
      "both are Edoid societies; both give the python a protected status.",
    argumentsAgainst:
      "No shared term, no shared ritual, no documented water association in Avhianwu, a different focus (ancestress vs god " +
      "and king), and python reverence is common across West Africa, so the resemblance needs no transmission to explain it.",
    tags: ["python", "alokoko", "ikpin", "comparison", "open-question", "avhianwu-context", "benin-kingdom-context", "evidence:comparative-hypothesis", GENEALOGY_LAYER_TAGS.context, "nigeria"],
    civilisations: [AVHIANWU, BENIN_KINGDOM],
    claims: [undated(null, "No date — a comparison", "A comparison has no date; each side's dates are on its own record.", "other")],
  },
];

// ---------------------------------------------------------------------------
// All events
// ---------------------------------------------------------------------------

export const OKOMILO_EVENTS: SeedEvent[] = [
  ...FAMILY_EVENTS,
  BREAK_EVENT,
  ...INNIH_EVENTS,
  ...AVHIANWU_EVENTS,
  ...RELIGION_EVENTS,
  ...COLONIAL_EVENTS,
  ...OPEN_QUESTIONS,
  ...BENIN_EVENTS,
];

// ---------------------------------------------------------------------------
// The relationships
//
// child_of edges come in exactly two kinds and the viewpoint says which:
// "community" — FAMILY-SUPPLIED TESTIMONY about the documented line — and
// "oral_tradition" — the community genealogy of Ogbona and Avhianwu. No
// child_of edge crosses from the first set to the second. That is the break in
// the line, enforced by a test rather than by remembering.
// ---------------------------------------------------------------------------

const FAMILY = "community";
const TRADITION = "oral_tradition";

export const OKOMILO_LINKS: SeedEventLink[] = [
  // --- Documented / family-supplied line ---
  {
    from: OKOMILO_ANCHOR_SLUG,
    to: "okomilo-sam-born-in-jos",
    relation: "child_of",
    viewpoint: FAMILY,
    sourceKey: "family_testimony",
    note: "FAMILY-SUPPLIED PRIMARY TESTIMONY: Oshioma Okomilo is the son of Sam Ikhenemho Okomilo.",
  },
  {
    from: "okomilo-sam-born-in-jos",
    to: "okomilo-sam-father-unknown",
    relation: "child_of",
    viewpoint: FAMILY,
    sourceKey: "family_testimony",
    note: "FAMILY-SUPPLIED TESTIMONY: Sam's father — a real man whose name is not yet known. The documented line currently ends here.",
  },
  {
    from: "okomilo-sam-born-in-jos",
    to: "okomilo-uwomha-ikhuenena",
    relation: "child_of",
    viewpoint: FAMILY,
    sourceKey: "family_testimony",
    note: "FAMILY-SUPPLIED TESTIMONY: Sam's mother is Uwomha Ikhuenena.",
  },
  {
    from: "okomilo-uwomha-ikhuenena",
    to: "okomilo-pa-asekomhe-maternal-grandfather",
    relation: "child_of",
    viewpoint: FAMILY,
    sourceKey: "family_testimony",
    note: "FAMILY-SUPPLIED TESTIMONY: Uwomha Ikhuenena is the daughter of Pa Asekomhe.",
  },
  {
    from: "okomilo-pa-asekomhe-maternal-grandfather",
    to: "okomilo-asekomhe-dynasty-genealogy",
    relation: "relevant",
    note: "OPEN — SAME NAME IS NOT SAME PERSON. Sam's maternal grandfather and the Pa Asekomhe of the Asekomhe dynasty text may be one man; nothing yet shows it.",
  },
  // --- Sam's life, in order ---
  { from: "okomilo-sam-born-in-jos", to: "okomilo-sam-sent-home-to-ogbona-1948", relation: "precedes", viewpoint: FAMILY, sourceKey: "family_testimony", note: "Born in Jos; returned to Ogbona in 1948 to learn its culture." },
  { from: "okomilo-sam-sent-home-to-ogbona-1948", to: "okomilo-sam-secondary-auchi-jattu", relation: "precedes", viewpoint: FAMILY, sourceKey: "oe_profiles", note: "St John's, then secondary school in Auchi and Jattu." },
  { from: "okomilo-sam-secondary-auchi-jattu", to: "okomilo-sam-uch-medical-photography", relation: "precedes", viewpoint: FAMILY, sourceKey: "oe_profiles", note: "From school to the Federal Ministry of Education and UCH." },
  { from: "okomilo-sam-uch-medical-photography", to: "okomilo-sam-luth-lagos", relation: "precedes", viewpoint: FAMILY, sourceKey: "family_testimony", note: "UCH, then LUTH." },
  { from: "okomilo-sam-luth-lagos", to: "okomilo-sam-to-london-1964", relation: "precedes", viewpoint: FAMILY, sourceKey: "oe_profiles", note: "Lagos to London, 1964." },
  { from: "okomilo-sam-to-london-1964", to: "okomilo-sam-edinburgh-ppe", relation: "precedes", viewpoint: FAMILY, sourceKey: "oe_profiles", note: "O and A levels in London, then Edinburgh." },
  { from: "okomilo-sam-edinburgh-ppe", to: "okomilo-sam-publisher-journalist", relation: "precedes", viewpoint: FAMILY, sourceKey: "oe_footprints", note: "Journalism and publishing in London; the order is the obvious one, not a dated one." },
  {
    from: "okomilo-sam-sent-home-to-ogbona-1948",
    to: "okomilo-st-john-baptist-church-ogbona",
    relation: "relevant",
    viewpoint: FAMILY,
    sourceKey: "oe_profiles",
    note: "Sam returned to Ogbona and was schooled at the mission's St John's Primary School.",
  },
  {
    from: "okomilo-s-photographic-trainee-1960",
    to: "okomilo-sam-uch-medical-photography",
    relation: "relevant",
    sourceKey: "research_lead_s_okomilo",
    note: "UNRESOLVED IDENTITY. A POSSIBLE identification only: same rare surname, same initial, same year, same field. Not asserted to be the same man.",
  },
  {
    from: "okomilo-sam-father-unknown",
    to: "okomilo-hitler-war-avhianwu",
    relation: "relevant",
    note: "Context for the family account of his war service and time in Egypt. Does not name him.",
  },
  {
    from: "okomilo-sam-father-unknown",
    to: GENEALOGY_BREAK_SLUG,
    relation: "relevant",
    note: "The documented / family-supplied line ends with him. Everything older is in the next layer.",
  },
  { from: "okomilo-sam-father-unknown", to: "okomilo-q-sams-paternal-grandfather", relation: "relevant", note: "The next question, which cannot be asked until this one is answered." },
  { from: "okomilo-sam-born-in-jos", to: "okomilo-q-meaning-of-ikhenemho", relation: "relevant", note: "His own name, and what it may say about his father's war." },
  // --- Membership: family, village, quarter, section ---
  {
    from: "okomilo-sam-born-in-jos",
    to: "okomilo-family-of-innih",
    relation: "part_of",
    viewpoint: FAMILY,
    sourceKey: "family_testimony",
    note: "MEMBERSHIP, NOT DESCENT: Sam is of the Okomilo family. The generations joining his line to the family's founder are unknown.",
  },
  {
    from: "okomilo-pa-simeon-innih-representative",
    to: "okomilo-family-of-innih",
    relation: "part_of",
    viewpoint: FAMILY,
    sourceKey: "oe_palace_villages",
    note: "'Pa. Simeon Okomilo from Innih' — a member of the Okomilo family of Innih. His relationship to Sam is not known.",
  },
  { from: "okomilo-george-catholic-pioneer-jailed", to: "okomilo-family-of-innih", relation: "relevant", note: "Same surname and village; his branch and his relationship to Sam are not documented." },
  { from: "okomilo-veronica-early-schoolgirl", to: "okomilo-family-of-innih", relation: "relevant", note: "Same surname and village; her branch is not documented." },
  { from: "okomilo-george-catholic-pioneer-jailed", to: "okomilo-st-john-baptist-church-ogbona", relation: "relevant", viewpoint: FAMILY, sourceKey: "oe_churches", note: "One of the church's pioneer lay faithful." },
  { from: "okomilo-george-catholic-pioneer-jailed", to: "okomilo-okhe-title-institution", relation: "relevant", sourceKey: "oe_churches", note: "Imprisoned in a conflict over church teaching against 'okhei traditional rites'." },
  {
    from: "okomilo-family-of-innih",
    to: "okomilo-innih-village",
    relation: "part_of",
    viewpoint: FAMILY,
    sourceKey: "oe_kindreds",
    note: "One of the nine kindred families of Innih.",
  },
  { from: "okomilo-asekomhe-dynasty-genealogy", to: "okomilo-innih-village", relation: "part_of", viewpoint: FAMILY, sourceKey: "oe_kindreds", note: "Asekomhe is another of the nine families of Innih." },
  { from: "okomilo-innih-village", to: "okomilo-ivhitse-quarter", relation: "part_of", viewpoint: FAMILY, sourceKey: "oe_palace_villages", note: "Innih is a village of Ivhitse." },
  { from: "okomilo-ivhitse-quarter", to: "okomilo-ivhiochie-children-of-ochie", relation: "part_of", viewpoint: FAMILY, sourceKey: "oe_palace_villages", note: "Ivhitse is a quarter of Ivhiochie." },
  { from: "okomilo-ivhiochie-children-of-ochie", to: "okomilo-ogbona-genealogy", relation: "part_of", viewpoint: FAMILY, sourceKey: "oe_descendants", note: "Ivhiochie is a section of Ogbona, named for Ochie, Ogbona's grandson in tradition." },
  {
    from: GENEALOGY_BREAK_SLUG,
    to: "okomilo-family-of-innih",
    relation: "relevant",
    note: "Beyond the break: the family is known as a kindred of Innih, but the generations joining Sam's line to it are not documented.",
  },
  // --- Community genealogy / oral tradition (never joined to the documented line by child_of) ---
  {
    from: "okomilo-ivhiochie-children-of-ochie",
    to: "okomilo-ogbona-genealogy",
    relation: "child_of",
    viewpoint: TRADITION,
    sourceKey: "oe_descendants",
    note: "TRADITIONAL GENEALOGY: Ochie, eponym of Ivhiochie, is a son of Okhua, son of Ogbona.",
  },
  {
    from: "okomilo-ogbona-genealogy",
    to: "okomilo-imhakhena-founds-ogbona",
    relation: "child_of",
    viewpoint: TRADITION,
    sourceKey: "oe_descendants",
    note: "TRADITIONAL DESCENT: Ogbona (a person) is the first-born of Imhakhena; the community bears his name.",
  },
  {
    from: "okomilo-asekomhe-dynasty-genealogy",
    to: "okomilo-imhakhena-founds-ogbona",
    relation: "child_of",
    viewpoint: TRADITION,
    sourceKey: "oe_descendants",
    note: "TRADITIONAL DESCENT, WITH THE SOURCE'S OWN HEDGE: Pa Ereghi 'is believed to be a direct offspring of the great Imhakhena'. Generations between are not counted.",
  },
  {
    from: "okomilo-imhakhena-founds-ogbona",
    to: "okomilo-anwu",
    relation: "child_of",
    viewpoint: TRADITION,
    sourceKey: "oe_descendants",
    note: "TRADITIONAL DESCENT: Imhakhena is the last-born son of Anwu.",
  },
  {
    from: "okomilo-imhakhena-founds-ogbona",
    to: "okomilo-alokoko-ancestral-mother",
    relation: "child_of",
    viewpoint: TRADITION,
    sourceKey: "oe_history_tag",
    note: "TRADITIONAL DESCENT: Alokoko is Imhakhena's mother, who 'later joined him' at Ore Okhiye.",
  },
  {
    from: "okomilo-anwu-four-sons",
    to: "okomilo-anwu",
    relation: "child_of",
    viewpoint: TRADITION,
    sourceKey: "oe_iraokhor",
    note: "TRADITIONAL DESCENT: Uralokhor, Unone, Arua and Imhakhena are Anwu's sons.",
  },
  { from: "okomilo-alokoko-ancestral-mother", to: "okomilo-anwu", relation: "associated", viewpoint: TRADITION, sourceKey: "oe_iraokhor", note: "Wife of Anwu in tradition: 'their parents (ANWU and ALOKOKO)'." },
  { from: "okomilo-anwu", to: ANWU_MIGRATION_SLUG, relation: "relevant", viewpoint: TRADITION, sourceKey: "okhaishie_1999", note: "MIGRATION TRADITION: Anwu's departure from the Kingdom of Benin." },
  { from: ANWU_MIGRATION_SLUG, to: "okomilo-afashio-first-settlement", relation: "precedes", viewpoint: TRADITION, sourceKey: "oe_iraokhor", note: "First full settlement at Afashio." },
  { from: "okomilo-afashio-first-settlement", to: "okomilo-second-migration-afashio", relation: "precedes", viewpoint: TRADITION, sourceKey: "okhaishie_1999", note: "Then the second migration." },
  { from: "okomilo-second-migration-afashio", to: "okomilo-imhakhena-founds-ogbona", relation: "precedes", viewpoint: TRADITION, sourceKey: "oe_history_tag", note: "Imhakhena to Utagbabor, then Ogbona." },
  { from: "okomilo-anwu-four-sons", to: "okomilo-avhianwu-clan-split-2024", relation: "relevant", note: "The four communities of tradition are today divided between Fugar and Anwu clans." },
  // --- Migration date claims against the Benin king-list ---
  { from: ANWU_MIGRATION_SLUG, to: "okomilo-benin-ewuare-reign", relation: "relevant", viewpoint: TRADITION, sourceKey: "oe_iraokhor", note: "CLAIM A: the Ewuare-era dating places the departure in this reign." },
  { from: ANWU_MIGRATION_SLUG, to: "okomilo-benin-ozolua-reign", relation: "relevant", viewpoint: "traditional", sourceKey: "okhaishie_1999", note: "CLAIM B: the Ozolua-era dating places the departure early in this reign." },
  { from: "okomilo-q-ewuare-or-ozolua", to: ANWU_MIGRATION_SLUG, relation: "relevant", note: "The question this record keeps open." },
  // --- Source chain ---
  { from: "okomilo-descent-of-avhianwu-1999", to: ANWU_MIGRATION_SLUG, relation: "source_of", sourceKey: "okhaishie_1999", note: "The 1481–85 dating and the two-migration framework come from this book, as reproduced online." },
  { from: "okomilo-descent-of-avhianwu-1999", to: "okomilo-alokoko-ancestral-mother", relation: "source_of", sourceKey: "okhaishie_1999", note: "The earliest written attestation found for Alokoko and the python taboo." },
  { from: "okomilo-omo-ananigie-1946", to: "okomilo-anwu", relation: "source_of", sourceKey: "omo_ananigie_1946", note: "Source (via later quotation) of the OLUKU parentage tradition, which competes with the Azama one. Whether it names Anwu is unknown." },
  { from: "okomilo-denton-1936-report", to: "okomilo-native-administration-courts", relation: "relevant", note: "Intelligence reports of 1936–37 were written to set up the clan administrations and courts." },
  { from: "okomilo-kukuruku-division", to: "okomilo-native-administration-courts", relation: "precedes", note: "Division created 1918; clan administrations 1932; clan courts 1937." },
  // --- Religion, Okhe, Nupe ---
  { from: "okomilo-nupe-invasion-avhianwu", to: "okomilo-okhe-dispute-ogbhari-akenavhianwu", relation: "relevant", note: "Omiawa, the Oghie of the Nupe levy (c.1886), is grandfather of the man killed — the reason the 1851 date is strained." },
  { from: "okomilo-okhe-title-institution", to: "okomilo-okhe-dispute-ogbhari-akenavhianwu", relation: "relevant", note: "The title whose performance was banned." },
  { from: "okomilo-q-age-of-religious-institutions", to: "okomilo-okhe-title-institution", relation: "relevant", note: "Undated institution." },
  { from: "okomilo-osi-theophoric-names", to: "okomilo-otsanobua-unattested", relation: "relevant", note: "What IS attested about naming God in Etsako, beside what is not." },
  { from: "okomilo-otsanobua-unattested", to: "okomilo-benin-osanobua-olokun-ogun", relation: "relevant", note: "Osanobua is attested for Edo; no Etsako cognate is asserted." },
  { from: "okomilo-olokun-not-alokoko", to: "okomilo-alokoko-ancestral-mother", relation: "relevant", note: "Kept apart: a resemblance of spelling, not a documented link." },
  { from: "okomilo-olokun-not-alokoko", to: "okomilo-benin-osanobua-olokun-ogun", relation: "relevant", note: "Olokun as Edo religion describes him." },
  { from: "okomilo-q-who-was-alokoko", to: "okomilo-alokoko-ancestral-mother", relation: "relevant", note: "The question this record keeps open." },
  // --- The comparative python link: explicitly unestablished ---
  {
    from: "okomilo-benin-palace-pythons",
    to: "okomilo-alokoko-ancestral-mother",
    relation: "relevant",
    note: "COMPARATIVE / UNESTABLISHED CONNECTION. Both give the python a sacred place; no historical connection is documented and they are not claimed to be one tradition.",
  },
  { from: "okomilo-python-comparison", to: "okomilo-alokoko-ancestral-mother", relation: "relevant", note: "COMPARATIVE / UNESTABLISHED CONNECTION — the Avhianwu side of the comparison." },
  { from: "okomilo-python-comparison", to: "okomilo-benin-palace-pythons", relation: "relevant", note: "COMPARATIVE / UNESTABLISHED CONNECTION — the Benin side of the comparison." },
  { from: "okomilo-q-leopard-in-avhianwu", to: "okomilo-benin-leopard-symbolism", relation: "relevant", note: "Benin's leopard is documented; Avhianwu's is not. Similarity is not used to supply one." },
  // --- Kingdom of Benin, in its own order ---
  { from: "okomilo-benin-ogiso-tradition", to: "okomilo-benin-oranmiyan-eweka", relation: "precedes", viewpoint: "traditional", sourceKey: "britannica_benin", note: "Ogiso, then the dynasty of Obas." },
  { from: "okomilo-benin-oranmiyan-eweka", to: "okomilo-benin-ewuare-reign", relation: "precedes", viewpoint: "conventional", sourceKey: "britannica_benin", note: "Eweka's line, to Ewuare." },
  { from: "okomilo-benin-ewuare-reign", to: "okomilo-benin-ozolua-reign", relation: "precedes", viewpoint: "conventional", sourceKey: "wiki_ozolua", note: "Ozolua, Ewuare's youngest son." },
  { from: "okomilo-benin-ewuare-reign", to: "okomilo-benin-iya-earthworks", relation: "relevant", sourceKey: "wiki_ewuare", note: "Tradition credits Ewuare with enlarging the walls and ditches." },
  { from: "okomilo-benin-connah-excavations", to: "okomilo-benin-iya-earthworks", relation: "related", note: "Two programmes of fieldwork on the same city and landscape." },
  { from: "okomilo-q-archaeology-of-etsako", to: "okomilo-benin-connah-excavations", relation: "relevant", note: "Benin City's archaeology exists; Etsako's was not found. One is not a substitute for the other." },
  { from: "okomilo-benin-palace-pythons", to: "okomilo-benin-1897-expedition", relation: "relevant", sourceKey: "digital_benin_ikpin", note: "The ikpin were taken when the palace burned in 1897." },
  { from: "okomilo-benin-royal-ancestral-altars", to: "okomilo-benin-1897-expedition", relation: "relevant", note: "Altar objects reached museums through the 1897 looting." },
  { from: "okomilo-benin-leopard-symbolism", to: "okomilo-benin-1897-expedition", relation: "relevant", note: "The ivory leopards were given to Queen Victoria by the expedition's commander." },
  { from: "okomilo-benin-1897-expedition", to: "okomilo-benin-palace-today", relation: "precedes", note: "The palace was rebuilt in the 20th century." },
  // --- Questions pinned to their records ---
  { from: "okomilo-q-meaning-of-okomilo", to: "okomilo-family-of-innih", relation: "relevant", note: "The family whose name is unexplained." },
  { from: "okomilo-q-founder-of-okomilo-family", to: "okomilo-family-of-innih", relation: "relevant", note: "Founder and date of arrival unknown." },
  { from: "okomilo-q-meaning-of-innih", to: "okomilo-innih-village", relation: "relevant", note: "Personal name in one genealogy; no gloss." },
  { from: "okomilo-q-who-was-anwu", to: "okomilo-anwu", relation: "relevant", note: "Two parentages, two motives." },
];
