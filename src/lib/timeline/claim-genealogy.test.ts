import { test } from "node:test";
import assert from "node:assert/strict";

import {
  firstBrokenLink,
  genealogyShape,
  hasAncientBase,
  linkIsUnread,
  orderedLinks,
  unreadLinks,
  whereClaimEnters,
} from "./claim-genealogy";
import {
  CITATION_STATUSES,
  CLAIM_VERDICTS,
  GENEALOGY_STAGES,
  citationBreaksChain,
  claimVerdictLabel,
  genealogyStageOrder,
} from "./taxonomy";

type TestLink = {
  stage: string;
  who: string;
  year?: number;
  says?: string;
  adds?: string;
  citation_status?: string;
};

const link = (stage: string, who: string, extra: Omit<TestLink, "stage" | "who"> = {}): TestLink => ({
  stage,
  who,
  ...extra,
});

test("links order by stage, then by year within a stage", () => {
  const unsorted = [
    link("popular_claim", "a film", { year: 2007 }),
    link("ancient_primary", "an inscription"),
    link("alternative_interpretation", "second writer", { year: 1899 }),
    link("alternative_interpretation", "first writer", { year: 1883 }),
  ];
  const sorted = orderedLinks(unsorted);
  assert.deepEqual(
    sorted.map((l) => l.who),
    ["an inscription", "first writer", "second writer", "a film"]
  );
});

test("a genealogy can run through four confident books and touch no object", () => {
  // The first question a reader has, and the one a reading list does not answer
  // on its face.
  const grounded = [link("ancient_primary", "a stela"), link("popular_claim", "a documentary")];
  const ungrounded = [
    link("early_scholarship", "an 1880s translation"),
    link("alternative_interpretation", "a writer", { year: 1883 }),
    link("popular_claim", "a book"),
    link("popular_claim", "a film"),
  ];
  assert.equal(hasAncientBase(grounded), true);
  assert.equal(hasAncientBase(ungrounded), false);
});

test("a later-antiquity source counts as an ancient base, and is not a primary one", () => {
  // Plutarch on Egypt is ancient evidence about Plutarch. It grounds a chain
  // in antiquity without being the object.
  const viaPlutarch = [link("later_antiquity", "Plutarch"), link("popular_claim", "a meme")];
  assert.equal(hasAncientBase(viaPlutarch), true);
  assert.ok(genealogyStageOrder("later_antiquity") > genealogyStageOrder("ancient_primary"));
});

test("the chain stops at the first broken citation, in chain order", () => {
  const links = [
    link("ancient_primary", "an object", { citation_status: "verified" }),
    link("alternative_interpretation", "writer A", { year: 1883, citation_status: "broken" }),
    link("popular_claim", "book B", { year: 1990, citation_status: "misattributed" }),
  ];
  const broken = firstBrokenLink(links);
  assert.ok(broken);
  assert.equal(broken.who, "writer A", "the FIRST break is what matters; the rest rest on it");
  assert.equal(citationBreaksChain("broken"), true);
  assert.equal(citationBreaksChain("misattributed"), true);
  // Not knowing is not the same as the chain failing.
  assert.equal(citationBreaksChain("unverified"), false);
  assert.equal(citationBreaksChain("no_citation_given"), false);
});

test("a chain with nothing broken says so", () => {
  const links = [
    link("ancient_primary", "an object", { citation_status: "verified" }),
    link("current_scholarship", "a specialist", { citation_status: "verified" }),
  ];
  assert.equal(firstBrokenLink(links), null);
});

test("the claim enters where somebody first adds something, not at the object", () => {
  // "Who first said this?" is almost never answered by an ancient source, and
  // the ancient link is exactly the one people point at.
  const links = [
    link("ancient_primary", "a relief", { adds: "the image everybody cites" }),
    link("early_scholarship", "an 1880s edition", { year: 1885 }),
    link("alternative_interpretation", "a writer", { year: 1883, adds: "the reading, in these words" }),
    link("popular_claim", "a film", { year: 2007, adds: "the phrasing most people have met" }),
  ];
  const enters = whereClaimEnters(links);
  assert.ok(enters);
  assert.equal(enters.who, "a writer");
  assert.equal(enters.year, 1883);
});

test("an ancient link that adds something is still not where the claim enters", () => {
  const links = [link("ancient_primary", "an object", { adds: "the object itself" })];
  assert.equal(whereClaimEnters(links), null, "an object does not make a claim; a reader of it does");
});

test("a link nobody has read cannot be reported as saying anything", () => {
  assert.equal(linkIsUnread(link("popular_claim", "a book")), true);
  assert.equal(linkIsUnread(link("popular_claim", "a book", { says: "   " })), true, "whitespace is not a reading");
  assert.equal(linkIsUnread(link("popular_claim", "a book", { says: "what it says" })), false);

  const links = [
    link("ancient_primary", "an object", { says: "read" }),
    link("alternative_interpretation", "writer", { year: 1883 }),
    link("popular_claim", "film", { year: 2007 }),
  ];
  assert.equal(unreadLinks(links).length, 2);
  assert.deepEqual(
    unreadLinks(links).map((l) => l.who),
    ["writer", "film"],
    "unread links come back in chain order too"
  );
});

test("the shape summary answers the structural questions and passes no judgement", () => {
  const links = [
    link("ancient_primary", "a relief", { says: "what is carved", citation_status: "verified" }),
    link("alternative_interpretation", "a writer", {
      year: 1883,
      adds: "the reading",
      citation_status: "broken",
    }),
    link("popular_claim", "a film", { year: 2007, adds: "the phrasing" }),
  ];
  const shape = genealogyShape(links);
  assert.equal(shape.ancientBase, true);
  assert.equal(shape.entersAt?.year, 1883);
  assert.equal(shape.breaksAt?.year, 1883);
  assert.equal(shape.unread, 2);
  assert.equal(shape.linkCount, 3);
  // Deliberately absent: anything resembling a score or a true/false.
  assert.equal("verdict" in shape, false);
  assert.equal("score" in shape, false);
});

test("the verdicts are six, and none of them is true or false", () => {
  // A boolean on "Horus was born of a virgin" forces a choice between two
  // wrong answers. The Egyptian conception story is genuinely extraordinary
  // AND it is not a virginal conception, and "related tradition exists" is the
  // sentence that holds both.
  assert.equal(CLAIM_VERDICTS.length, 6);
  const keys = CLAIM_VERDICTS.map((v) => v.key);
  assert.ok(keys.includes("related_tradition_exists"));
  assert.ok(keys.includes("no_primary_evidence_located"));
  for (const key of keys) {
    assert.doesNotMatch(key, /^(true|false)$/);
  }
  assert.equal(claimVerdictLabel("related_tradition_exists"), "A related ancient tradition exists");
  assert.equal(claimVerdictLabel("nonsense"), null);
});

test("not finding evidence is not the same as disproving it", () => {
  const verdict = CLAIM_VERDICTS.find((v) => v.key === "no_primary_evidence_located");
  assert.ok(verdict);
  assert.match(verdict.hint, /NOT the same as 'disproved'|not the same as/i);
});

test("every vocabulary entry carries a real hint", () => {
  for (const list of [GENEALOGY_STAGES, CLAIM_VERDICTS, CITATION_STATUSES]) {
    for (const entry of list) {
      assert.ok(entry.label.length > 0, `${entry.key} has no label`);
      assert.ok(entry.hint.length > 30, `${entry.key} has no real hint`);
    }
  }
});

test("an unknown stage sorts last rather than throwing", () => {
  const links = [link("not_a_stage", "mystery"), link("ancient_primary", "an object")];
  assert.equal(orderedLinks(links)[0].who, "an object");
});
