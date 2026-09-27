import { test } from "node:test";
import assert from "node:assert/strict";

import { ATLANTIS_EVENTS, ATLANTIS_SOURCES } from "./atlantis-seed";

const event = (slug: string) => {
  const found = ATLANTIS_EVENTS.find((item) => item.slug === slug);
  assert.ok(found, `no Atlantis event with slug ${slug}`);
  return found;
};

// ---------------------------------------------------------------------------
// THE COINCIDENCE TRAP
//
// Four things in this cluster sit at roughly the same date: Plato's calculated
// 9600 BCE, meltwater pulse 1B, Göbekli Tepe's oldest enclosures and the start
// of the African Humid Period. Three of those are physically evidenced and one
// is a number derived from a literary text, and the arithmetic that makes them
// line up says nothing whatever about whether Atlantis existed.
//
// These tests exist because a cluster like this is exactly where a timeline
// starts to argue by adjacency — putting four records on one screen and
// letting the reader draw the line. Each test below pins the sentence that
// refuses to draw it.
// ---------------------------------------------------------------------------

test("Plato's 9600 BCE is a modern calculation, not a year Plato wrote", () => {
  const node = event("atlantis-9600-comparison-node");
  assert.ok(
    node.claims[0].originalDateText?.includes("modern calculation"),
    "the 9600 BCE date must be labelled a modern calculation"
  );
  assert.ok(
    node.description.includes("chronology, not causation"),
    "the comparison node must say what the comparison is for"
  );
});

test("geological overlap is kept separate from Atlantis evidence", () => {
  const mwp = event("mwp1b-atlantis-window");
  assert.ok(
    mwp.description.includes("not evidence for an Atlantean civilisation"),
    "a sea-level pulse at the right date is still not evidence for Atlantis"
  );
  assert.ok(
    mwp.claims[0].evidence?.includes("does not connect"),
    "the study's own boundary must be recorded on the claim"
  );
});

test("Göbekli Tepe is demonstrated monumental construction, not Atlantis", () => {
  const gobekli = event("gobekli-tepe-9600-atlantis-comparison");
  assert.equal(gobekli.claims[0].originalDateText, "9600–8200 BCE");
  assert.ok(
    gobekli.claims[0].evidence?.includes("not evidence that Göbekli Tepe was Atlantis"),
    "the record must refuse the identification it invites"
  );
});

test("modern Sahara geography is not used as a proxy for the early Holocene", () => {
  assert.ok(
    event("green-sahara-atlantis-window").description.includes("does not locate Atlantis in Africa"),
    "a greener North Africa is context, not a location"
  );
});

test("sea level, Göbekli Tepe and North African palaeoclimate have independent sources", () => {
  const keys = new Set(ATLANTIS_SOURCES.map((source) => source.key));
  for (const key of ["webster2025_mwp1b", "unesco_gobekli", "shanahan2015_ahp"]) {
    assert.ok(keys.has(key), `missing source ${key} — the cluster would rest on one authority`);
  }
});
