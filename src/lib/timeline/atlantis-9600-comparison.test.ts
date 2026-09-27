import { describe, expect, it } from "vitest";
import { ATLANTIS_EVENTS, ATLANTIS_SOURCES } from "./atlantis-seed";

const event = (slug: string) => ATLANTIS_EVENTS.find((item) => item.slug === slug)!;

describe("Atlantis 9600 BCE comparison cluster", () => {
  it("keeps Plato's 9600 BCE as a calculated date rather than Plato's written year", () => {
    const node = event("atlantis-9600-comparison-node");
    expect(node.claims[0].originalDateText).toContain("modern calculation");
    expect(node.description).toContain("chronology, not causation");
  });

  it("keeps geological overlap separate from Atlantis evidence", () => {
    const mwp = event("mwp1b-atlantis-window");
    expect(mwp.description).toContain("not evidence for an Atlantean civilisation");
    expect(mwp.claims[0].evidence).toContain("does not connect");
  });

  it("records demonstrated monumental construction without turning Gobekli Tepe into Atlantis", () => {
    const gobekli = event("gobekli-tepe-9600-atlantis-comparison");
    expect(gobekli.claims[0].originalDateText).toBe("9600–8200 BCE");
    expect(gobekli.claims[0].evidence).toContain("not evidence that Göbekli Tepe was Atlantis");
  });

  it("does not use modern Sahara geography as a proxy for the early Holocene", () => {
    expect(event("green-sahara-atlantis-window").description).toContain("does not locate Atlantis in Africa");
  });

  it("has independent sources for sea level, Gobekli Tepe and North African palaeoclimate", () => {
    const keys = new Set(ATLANTIS_SOURCES.map((source) => source.key));
    for (const key of ["webster2025_mwp1b", "unesco_gobekli", "shanahan2015_ahp"]) {
      expect(keys.has(key)).toBe(true);
    }
  });
});
