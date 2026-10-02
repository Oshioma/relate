# Okomilo → Ogbona → Avhianwu → Kingdom of Benin: research report

Track: `okomilo-avhianwu-benin` — seed file `src/lib/timeline/okomilo-avhianwu-benin-seed.ts`, tests `okomilo-avhianwu-benin.test.ts`.
Research pass: 2026-10-02.

**Kingdom of Benin = Benin City, Edo State, Nigeria.** Nothing here concerns the Republic of Benin (Dahomey). The `benin-dahomey`, `benin-vodun` and `benin-atlantic` datasets the brief mentions are **not in this repository** (no file, branch or commit contains them), so there was nothing to keep apart in code. Test 5 guards the separation anyway.

## How this was researched, and the limits that follow from it

The environment's network policy blocked direct access to every host the material lives on. That included ogbonaelites.org, Wikimedia Commons, Wikipedia, the Met, the British Museum, archive.org, Google Books, JSTOR, WorldCat, HathiTrust, TNA Discovery and Companies House.

**Search-engine snippets were the only window.** About 200 web searches were run across four parallel research threads before the session's search quota ran out. Every quotation in the dataset is therefore **snippet-level**. Every source says so, and nothing was quoted from a page that was not at least partly visible in a snippet.

Image file names come from search-result URLs. They have not been opened, so all pictures carry `provenanceStatus: "unverified"` and fetch their credit at seed time. A wrong file name will show in the seeding repair report, not as a broken record.

## Source dependency (what actually depends on what)

```
Avhianwu elders (oral testimony, unrecorded)
   │
   ├─▶ [?] Denton 1936 intelligence report ─ NOT LOCATED
   ├─▶ Omo-Ananigie 1946, A Brief History of Etsakor (Hoover microfilm; NOT OPENED)
   │      └─▶ quoted by stanwilly (2012) and nuntiuspacis ─▶ "Oluku" tradition
   │      └─▶ echoed (as "local histories") by Borgatti 2003, African Arts
   └─▶ Okhaishie 1999, The Descent of Avhianwu (NOT OPENED; its own sources UNKNOWN)
          └─▶ ogbonaelites.org reproductions (bylined to the author) ─ SAME SOURCE
                 └─▶ Fugar America Foundation, afenmaiconnect ─ shared wording, DERIVATIVE
History of Iraokhor (ogbonaelites) ─ Ewuare version, no cited source
Wikipedia "Afemai people" ─ Ewuare (general Afemai), unsourced
```

Chronological order is not treated as copying. Omo-Ananigie 1946 and Okhaishie 1999 have **not** been shown to depend on each other or on Denton.

## Searches that returned nothing relevant (do not repeat)

| Database / engine | Search terms | Result |
|---|---|---|
| Web | "Sam Okomilo", "S.I. Okomilo", "S. I. Okomilo", "Samuel Okomilo" | Only ogbonaelites.org |
| Web | Okomilo + Africa Today / African News File / Who's Who in Africa / Uwechue | None |
| Web | "African News File" London magazine | No such title in any catalogue snippet |
| Web | Okomilo + WorldCat / author / editor / journalist London | None |
| Web | Okomilo Companies House | Only a present-day person; no Sam |
| Web | "S. Okomilo" photographic; "photographic trainee" Okomilo; "M. U. Eriavbe"; Eriavbe photographic | None |
| Web | "photographic trainee" 1960 Nigeria annual report; UCH medical illustration 1960 | None |
| Web / gazettes.africa | Okomilo / Eriavbe in Federation of Nigeria Official Gazette 1960–62 | Gazette PDFs listed (1960-05-26 no.31, 1960-08-18 no.49, 1961-12-21 no.99, 1962-04-26 no.31); no snippet hit. **Read by hand.** |
| Web | Okomillo, Okomilu, Okhomilo, Okomelo, Okomila, Okomiro (+ Nigeria/Edo/Etsako/Kukuruku/obituary) | None |
| Web | Okomilo obituary / burial / 1983 Ogbona | None |
| Web | Okomilo soldier / RWAFF / Nigeria Regiment | None |
| Web | Ikhenemho / Ikhenemo meaning; Okomilo meaning; Innih meaning | None |
| Web | "Intelligence Report on the Etsako"; Denton Etsako 1936 CSO 26 NAI | Not found; only Denton's Ifeku Island report (1936) and Stanfield's Awain/Aviele (1937) |
| Web | Bradbury 1957 + Avianwu; Egharevba + Kukuruku/Etsako | Catalogue snippets only |
| Web | Okpoko / archaeology / radiocarbon Etsako, Afemai, Okpella, Ososo, Somorika | None for Etsako |
| Web | Aleukoko, Aleokoko, Aloukoko, Alukoko | None; only "Alokoko" occurs |
| Web | Python river-crossing / python helps Anwu migration | Not found |
| Web | Commons "Fugar", "Avianwu", Etsako masquerade / age grade | None |
| Web | Benin roof python head on Commons; Pitt Rivers python head | None |
| Web | WWII: Suez transit of 81st/82nd West African Divisions | Not documented |

**Not searched because the quota ran out:** "Okomiloh"; "Ikhememho" and "Ikhenenbo" individually; Oghena, Osinegba, Adi, Esi, Ukpe; Odionwere in Ogbona; leopard in Etsako (two indirect searches only); Ikime, Afigbo, Okojie; Library of Congress images; MARKK C3827.

## Sources that remain inaccessible

1. **Denton 1936**, "Political Intelligence Report on the Etsako Clans of the Kukuruku Division". It was not located at all; no file number was found.
2. **Omo-Ananigie 1946**, *A Brief History of Etsakor*. It is located (Hoover Institution, Ottenberg Nigerian pamphlets, microfilm) but has not been opened.
3. **Okhaishie 1999**, *The Descent of Avhianwu*. It is located (Stirling-Horden) but has not been opened. Its bibliography is unknown.
4. **Erhagbe 1982**, MA thesis on the Nupe invasion, University of Benin. Catalogued but not opened.
5. **Bradbury 1957**, Ethnographic Survey. Only catalogue snippets were reachable.
6. **JICH 2020** repatriation article. Its footnotes, which hold the file references, could not be read.
7. **ogbonaelites.org**: every page. Only snippets were seen.
8. The "S. Okomilo, photographic trainee" document: its title and issuing body are unknown.

## Top next actions

1. **Okhaishie 1999, migration chapters (c. pp. 8 and 17) and bibliography.** Find what the 1481–85 date and Alokoko rest on. This decides whether the written tradition starts in 1999 or earlier.
2. **Hoover Institution, Ottenberg pamphlet microfilm: Omo-Ananigie 1946, the origins section (from c. p. 12).** Check for Anwu, Alokoko, Ewuare and Ozolua. If they are there, the written Avhianwu tradition moves back to 1946.
3. **NAI Ibadan (ibadan@nigerianarchives.gov.ng) and CRL's 16-reel "Intelligence reports on southern Nigeria".** Search for Denton 1936, Etsako clans, under "Kukuruku" and "Benin Prof". It is the likeliest oldest written Anwu genealogy, recorded from elders.
4. **St John's Catholic parish, Ogbona, and the Auchi diocese archive: baptism, marriage, burial and school registers, 1920s–1983.** Search for Okomilo. These would give Sam's father's name (1948 school admission and the 1983 burial), Veronica's parents, and George's family.
5. **Family elders: the Okomilo family ancestral shrine and its line of custodians.** If custody passes eldest son to eldest son, the custodian list is the missing genealogy. Record it as testimony, with a date and the speaker.
6. **University of Edinburgh matriculation and graduation records, 1970–72, and UCH Ibadan personnel files, 1960.** Both normally record a parent or guardian, and the exact form of Sam's name.
7. **Federation of Nigeria Official Gazette, 1960–62 (gazettes.africa), read page by page.** Look for "Okomilo" and "Eriavbe" in appointment and training notices. This would settle the S. Okomilo identification.
8. **TNA WO 169 (Middle East war diaries, 1945–46): West African garrison companies and Nigerian Pioneer companies.** Also read the footnotes of the JICH 2020 article. These are the units most likely to explain the family memory of "Egypt".
9. **NAI Benin Prof / Kukuruku Division: ex-servicemen nominal rolls and resettlement files, 1945–47.** A model exists in the Ijebu Prof 1946 rolls. A named Ogbona ex-serviceman who went to Jos would be a candidate for Sam's father.
10. **"Indigenous Etsako Names Among Auchi People" (Fourth World Journal), and an Etsako-speaking linguist.** Look for segmentation of Okomilo, Ikhenemho and Innih. Without it, all three meanings stay unresolved.
