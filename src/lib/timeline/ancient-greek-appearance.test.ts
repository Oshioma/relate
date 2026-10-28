import { describe, expect, it } from "vitest";
import { ANCIENT_GREEK_APPEARANCE_EVENTS, ANCIENT_GREEK_APPEARANCE_SOURCES } from "./ancient-greek-appearance-seed";

const event=(slug:string)=>ANCIENT_GREEK_APPEARANCE_EVENTS.find(e=>e.slug===slug)!;

describe("Ancient Greek appearance evidence",()=>{
  it("labels Mycenaeans as Ancient Greek while keeping earlier identities precise",()=>{
    expect(event("mycenaean-greeks-linear-b").summary).toContain("Bronze Age Greeks");
    expect(event("pta08-early-minoan-pigmentation").title).toContain("Pre-Ancient Greek");
    expect(event("kou01-early-cycladic-pigmentation").title).toContain("Pre-Ancient Greek");
    expect(event("mycenaean-warrior-krater").title).toContain("Ancient Greek");
  });
  it("preserves all three published dark-pigmentation predictions",()=>{
    for(const slug of ["pta08-early-minoan-pigmentation","kou01-early-cycladic-pigmentation","log02-middle-helladic-pigmentation"]){
      const text=event(slug).claims[0].evidence;
      expect(text).toContain("dark");
      expect(text).toContain("brown");
    }
  });
  it("does not turn painted complexion into a literal phenotype measurement",()=>{
    expect(event("knossos-cup-bearer-dark-brown").description).toContain("not a literal skin-colour measurement");
    expect(event("rekhmire-aegean-islanders").description).toContain("not a spectrophotometer reading");
    expect(event("mycenaean-warrior-krater").description).toContain("artistic evidence");
  });
  it("keeps Egyptian depictions as an independent evidence stream",()=>{
    const rek=event("rekhmire-aegean-islanders");
    expect(rek.media?.length).toBeGreaterThanOrEqual(3);
    expect(rek.description).toContain("not Aegean self-representation");
  });
  it("uses institutional and academic sources for identity, imagery and DNA",()=>{
    const keys=new Set(ANCIENT_GREEK_APPEARANCE_SOURCES.map(s=>s.key));
    for(const key of ["british_museum_mycenaeans","aegean_genomics_2021","heraklion_cupbearer","met_aegean_islanders","nam_warrior_krater","met_cretan_warrior"]) expect(keys.has(key)).toBe(true);
  });
});
