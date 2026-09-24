import { test } from "node:test";
import assert from "node:assert/strict";

import { HORUS_CLAIMS_EVENTS, HORUS_CLAIMS_SOURCES } from "./horus-claims-seed";
import {
  CLAIM_VERDICTS,
  CITATION_STATUSES,
  GENEALOGY_STAGES,
  TIMELINE_CATEGORIES,
  TIMELINE_EVENT_TYPES,
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  TEMPORAL_CLAIM_TYPES,
  temporalTypeIsPositioned,
} from "./taxonomy";
import { DATE_UNITS } from "./time";
import {
  firstBrokenLink,
  fromSeedLinks,
  hasAncientBase,
  orderedLinks,
  whereClaimEnters,
} from "./claim-genealogy";

const byslug = new Map(HORUS_CLAIMS_EVENTS.map((e) => [e.slug, e]));
const record = (slug: string) => {
  const found = byslug.get(slug);
  assert.ok(found, `missing record: ${slug}`);
  return found;
};
const genealogy = (slug: string, key: string) => {
  const found = (record(slug).genealogies ?? []).find((g) => g.key === key);
  assert.ok(found, `missing genealogy: ${slug}/${key}`);
  return found;
};

// ---------------------------------------------------------------------------
// THE FINDING THIS DATASET EXISTS FOR
//
// Doane, 1882, cites Bonwick page 157 for "Horus was also crucified in the
// heavens". Bonwick page 157 says "With outstretched arms he is the vault of
// heaven." The citation is real, the page is real, and the page does not
// contain the claim.
//
// No verdict can say that. These tests keep the chain from being flattened
// back into one.
// ---------------------------------------------------------------------------

test("the crucifixion chain breaks at Doane, and the panel can find it", () => {
  const chain = genealogy("horus-crucified-claim", "crucifixion");
  // fromSeedLinks, not chain.links: the seed writes camelCase and these
  // functions read database rows. Calling them on raw seed data returns
  // "nothing wrong" on a chain whose break is the whole point.
  const broken = firstBrokenLink(fromSeedLinks(chain.links));
  assert.ok(broken, "the break is the finding; it must be marked, not described");
  assert.match(broken.who, /Doane/);
  assert.equal(broken.year, 1882);
  assert.equal(broken.citation_status, "misattributed");
  assert.match(broken.adds ?? "", /EVERYTHING AFTER THIS LINK RESTS ON THIS FOOTNOTE/);
});

test("both sides of the misattribution are quoted, so a reader can compare them", () => {
  const chain = genealogy("horus-crucified-claim", "crucifixion");
  const bonwick = chain.links.find((l) => /Bonwick/.test(l.who));
  const doane = chain.links.find((l) => /Doane/.test(l.who));
  assert.ok(bonwick && doane);
  // The whole point is that these two sentences sit next to each other.
  assert.match(bonwick.says ?? "", /vault of heaven/);
  assert.doesNotMatch(bonwick.says ?? "", /crucif/i);
  assert.match(doane.says ?? "", /crucified in the heavens/);
  assert.match(doane.reference ?? "", /citing Bonwick page 157/);
});

test("Massey's own disclaimer survives, because he is blamed for a claim he flagged", () => {
  const chain = genealogy("horus-crucified-claim", "crucifixion");
  const massey = chain.links.find((l) => /Massey/.test(l.who));
  assert.ok(massey);
  assert.match(massey.says ?? "", /later terminology/);
  assert.match(massey.adds ?? "", /anachronistic|DISCLAIMER/i);
});

test("the metaphorical defence is recorded rather than recast as a literal claim", () => {
  // Leaving this out would be the same failure as the claim itself, in the
  // opposite direction.
  const chain = genealogy("horus-crucified-claim", "crucifixion");
  assert.match(chain.verdictEvidence, /METAPHORICAL DEFENCE IS PART OF THE RECORD/i);
  const guide = chain.links.find((l) => /Zeitgeist/.test(l.who));
  assert.match(guide?.says ?? "", /does not mean thrown down and nailed/i);
});

test("the virgin birth is not answered with a flat no", () => {
  const chain = genealogy("horus-conception-pyramid-texts", "virgin-birth");
  assert.equal(chain.verdict, "related_tradition_exists");
  // Both halves have to be present, or the verdict is doing only one job.
  assert.match(chain.verdictEvidence, /WHAT IS REAL/);
  assert.match(chain.verdictEvidence, /WHAT IS NOT/);
  assert.match(chain.verdictEvidence, /NEITHER 'YES' NOR 'MADE UP'/i);
  assert.equal(hasAncientBase(fromSeedLinks(chain.links)), true, "there IS an ancient conception story under this one");
});

test("the negative about 'virgin' is bounded to what was actually searched", () => {
  const conception = record("horus-conception-pyramid-texts");
  const negative = conception.claims.find((c) => /calls Isis a virgin/i.test(c.whatIsDated ?? ""));
  assert.ok(negative);
  assert.match(negative.evidence, /What was searched/i);
  assert.match(negative.evidence, /What was not/i);
  assert.match(negative.evidence, /NOT FOUND HERE/);
  assert.match(negative.evidence, /DOES NOT EXIST/);
});

test("December 25 is dismantled on the forms of Horus, not only on the calendar", () => {
  const chain = genealogy("horus-december-25-claim", "december-25");
  // "They used a different calendar" is true and dodges the question.
  const record25 = record("horus-december-25-claim");
  assert.match(record25.description, /dodges the real question|does not rest on that alone/i);
  // The two Plutarch passages are two links, about two different gods.
  const plutarchLinks = chain.links.filter((l) => /Plutarch/.test(l.who));
  assert.equal(plutarchLinks.length, 2);
  assert.ok(plutarchLinks.some((l) => /Arueris|Elder/.test(l.says ?? "")));
  assert.ok(plutarchLinks.some((l) => /Harpocrates/.test(l.says ?? "")));
  // And the sentence nobody quotes.
  assert.ok(plutarchLinks.some((l) => /after the spring equinox/i.test(l.says ?? "")));
});

test("the December 25 claim enters in two steps, and the second is an index", () => {
  const chain = genealogy("horus-december-25-claim", "december-25");
  // The Christian seasonal reading enters first, with Bonwick in 1878 — an
  // analogy, not a date. That is what whereClaimEnters reports, and it is the
  // honest answer to "who first said this".
  const enters = whereClaimEnters(fromSeedLinks(chain.links));
  assert.ok(enters);
  assert.match(enters.who, /Bonwick/);
  assert.equal(enters.year, 1878);

  // The DATE arrives four years later, and not in Doane's argument — in his
  // index, which is more definite than anything his text supports.
  const doane = chain.links.find((l) => /Doane/.test(l.who));
  assert.ok(doane);
  assert.match(doane.adds ?? "", /ENTERS IN AN INDEX/i);
  assert.match(doane.says ?? "", /index at page 578/i);
});

test("Graves is cleared of the twelve-disciples attribution", () => {
  // Everybody names him for it. The located passage is about Krishna.
  const chain = genealogy("horus-twelve-followers-claim", "twelve-disciples");
  const graves = chain.links.find((l) => /Graves/.test(l.who));
  assert.ok(graves);
  assert.match(graves.says ?? "", /Krishna/);
  assert.equal(graves.citationStatus, "misattributed");
  assert.match(graves.notes ?? "", /against the CLAIM rather than against Graves/);
});

test("the twelve are reapers before they are disciples, and the change is recorded", () => {
  const chain = genealogy("horus-twelve-followers-claim", "twelve-disciples");
  const massey = chain.links.find((l) => /Massey/.test(l.who));
  const guide = chain.links.find((l) => /Zeitgeist/.test(l.who));
  assert.match(massey?.says ?? "", /reapers/i);
  assert.match(guide?.says ?? "", /traveled about with/i);
  assert.match(guide?.adds ?? "", /CHANGE OF CATEGORY/i);
});

test("nothing is backdated to a page that was not found", () => {
  const chain = genealogy("horus-twelve-followers-claim", "twelve-disciples");
  // Massey 1883 is the obvious guess and was not established.
  assert.match(chain.whatWouldChangeThis, /NOT BACKDATED TO 1883/i);
  const dateClaim = record("horus-twelve-followers-claim").claims[0];
  assert.match(dateClaim.evidence, /a proof of priority/i);
});

test("Horus is not treated as one person anywhere in the dataset", () => {
  const forms = record("horus-is-not-one-person");
  for (const name of ["Harsiese", "Haroeris", "Harpocrates"]) {
    assert.match(forms.description, new RegExp(name.toUpperCase()), `${name} must be distinguished`);
  }
  // And Osiris's death stays Osiris's.
  assert.match(forms.description, /OSIRIS IS NOT HORUS/);
  assert.equal(temporalTypeIsPositioned(forms.claims[0].temporalClaimType), false);
});

// ---------------------------------------------------------------------------
// SHAPE
// ---------------------------------------------------------------------------

const keys = (list: readonly { key: string }[]) => new Set(list.map((x) => x.key));

test("every genealogy states its verdict, its evidence and what would change it", () => {
  const verdicts = keys(CLAIM_VERDICTS);
  const stages = keys(GENEALOGY_STAGES);
  const citations = keys(CITATION_STATUSES);

  for (const event of HORUS_CLAIMS_EVENTS) {
    for (const chain of event.genealogies ?? []) {
      assert.ok(verdicts.has(chain.verdict), `${chain.key}: ${chain.verdict}`);
      assert.ok(chain.verdictEvidence.length > 100, `${chain.key}: verdict evidence is a stub`);
      assert.ok(
        chain.whatWouldChangeThis.length > 80,
        `${chain.key}: a verdict with no overturning conditions is an opinion`
      );
      assert.ok(chain.links.length >= 3, `${chain.key}: fewer than three links is not a chain`);

      for (const genealogyLink of chain.links) {
        assert.ok(stages.has(genealogyLink.stage), `${chain.key}: stage ${genealogyLink.stage}`);
        assert.ok(
          genealogyLink.says || genealogyLink.saysAbsentReason,
          `${chain.key}/${genealogyLink.who}: a link with no text must say why`
        );
        if (genealogyLink.citationStatus) {
          assert.ok(citations.has(genealogyLink.citationStatus), `${chain.key}: ${genealogyLink.citationStatus}`);
        }
      }
      // The chain has to be readable in order, which is what makes `adds` mean
      // anything at all.
      const ordered = orderedLinks(chain.links);
      assert.equal(ordered.length, chain.links.length);
    }
  }
});

test("every popular claim in this dataset has a modern link and an older one", () => {
  // A genealogy that is only a popular claim is an accusation, not a chain.
  for (const event of HORUS_CLAIMS_EVENTS) {
    for (const chain of event.genealogies ?? []) {
      const stages = chain.links.map((l) => l.stage);
      assert.ok(stages.includes("popular_claim"), `${chain.key}: where does it end up?`);
      assert.ok(
        stages.some((s) => s !== "popular_claim"),
        `${chain.key}: where did it come from?`
      );
    }
  }
});

test("every key used comes from the shared vocabularies", () => {
  const categories = keys(TIMELINE_CATEGORIES);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const temporal = keys(TEMPORAL_CLAIM_TYPES);
  const methods = keys(DATING_METHODS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const units = keys(DATE_UNITS);

  for (const event of HORUS_CLAIMS_EVENTS) {
    assert.ok(categories.has(event.category), `${event.slug}: ${event.category}`);
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: ${event.eventType}`);
    for (const claim of event.claims) {
      assert.ok(temporal.has(claim.temporalClaimType ?? ""), `${event.slug}: ${claim.temporalClaimType}`);
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: ${claim.datingMethod}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: ${claim.chronology}`);
      assert.ok(units.has(claim.datePrecision), `${event.slug}: ${claim.datePrecision}`);
    }
  }
});

test("the sources say whether they were read, and the unread ones are named", () => {
  for (const source of HORUS_CLAIMS_SOURCES) {
    assert.match(source.notes, /READ|NOT READ|PARTIALLY VERIFIED/, `${source.key}`);
    assert.ok(source.notes.length > 60, `${source.key}: a note must say what it is cited FOR`);
  }
  // Murdock's chapter is cited by the guide and was not opened. Saying so is
  // the difference between a chain and a rumour.
  const guide = HORUS_CLAIMS_SOURCES.find((s) => s.key === "zeitgeist_guide");
  assert.match(guide?.notes ?? "", /NOT independently collated/i);
});

test("slugs are unique and no claim carries a confidence score", () => {
  assert.equal(byslug.size, HORUS_CLAIMS_EVENTS.length);
  for (const event of HORUS_CLAIMS_EVENTS) {
    const text = JSON.stringify(event);
    assert.doesNotMatch(text, /"confidence"/, event.slug);
    assert.doesNotMatch(text, /\b\d{1,3}\s?% (certain|confident|likely|sure)\b/i, event.slug);
  }
});
