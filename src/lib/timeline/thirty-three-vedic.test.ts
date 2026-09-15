import { test } from "node:test";
import assert from "node:assert/strict";

import {
  THIRTY_THREE_VEDIC_EVENTS,
  THIRTY_THREE_VEDIC_SOURCES,
  THIRTY_THREE_VEDIC_LINKS,
  THIRTY_THREE_VEDIC_ANCHOR_SLUG,
} from "./thirty-three-vedic-seed";

const byslug = new Map(THIRTY_THREE_VEDIC_EVENTS.map((event) => [event.slug, event]));
const event = (slug: string) => {
  const found = byslug.get(slug);
  assert.ok(found, `${slug} has gone`);
  return found!;
};

// ---------------------------------------------------------------------------
// THE RULES THIS TRANCHE HAS TO KEEP.
//
// It was built without access to the primary texts — the network policy blocked
// every host they live on — so its single most important property is that it
// says so, record by record, wherever somebody needs to open a book. A dataset
// that quietly drops that flag is worse than no dataset, because it looks like
// one that was checked.
// ---------------------------------------------------------------------------

test("every claim that needs a text opened says so, by name", () => {
  // THE FLAG IS THE PRODUCT. Each claim either rests on something that could be
  // read from a search result, or carries NEEDS SOURCE VERIFICATION naming what
  // to check. There is no third case, and a claim that loses its flag during an
  // edit is a claim that now looks verified.
  const flagged = THIRTY_THREE_VEDIC_EVENTS.flatMap((e) =>
    e.claims.filter((c) => /NEEDS SOURCE VERIFICATION/.test(`${c.notes ?? ""}${c.evidence}`))
  );
  assert.ok(
    flagged.length >= 8,
    `only ${flagged.length} claims carry a verification flag; this tranche was built from search results and most of it needs one`
  );
});

test("the sources that could not be opened say which they are", () => {
  // Naming the unreadable sources in the source list matters as much as naming
  // them on the claims: somebody auditing this will start from the bibliography.
  // The threshold was 5 and is now 4, MEASURED, not guessed. It fell because
  // two sources were read, not because flags were removed: the Yasna and the
  // Iranica article both came off the list when their texts were opened and
  // the findings resting on them were corrected. If this number falls again,
  // the reason should be the same one, and the test below is what checks it.
  const unopened = THIRTY_THREE_VEDIC_SOURCES.filter((s) => /NEEDS SOURCE VERIFICATION/.test(s.notes));
  assert.ok(unopened.length >= 4, `only ${unopened.length} sources admit they were not opened`);
});

test("the two sources that were read say what reading them changed", () => {
  // A flag removed silently is indistinguishable from a flag removed because
  // somebody did the work. These two must carry the evidence of the work.
  const byKey = (k: string) => THIRTY_THREE_VEDIC_SOURCES.find((s) => s.key === k)!;
  const yasna = byKey("avesta_yasna");
  assert.doesNotMatch(yasna.notes, /NEEDS SOURCE VERIFICATION/);
  assert.match(yasna.notes, /thrayasca thrisasca/i, "the Yasna note no longer quotes what was found");
  assert.match(yasna.reference ?? "", /Geldner/i, "the edition actually consulted is no longer named");
  const iranica = byKey("iranica_amesa_spenta");
  assert.doesNotMatch(iranica.notes, /NEEDS SOURCE VERIFICATION/);
  assert.match(iranica.notes, /Boyce writes no such thing/i, "the correction has been smoothed away");
  assert.match(iranica.reference ?? "", /933-936/, "the full citation has gone");
  assert.match(iranica.reference ?? "", /10\.1163/, "the DOI has gone");
});

test("no claim anywhere carries a confidence score", () => {
  // The brief this dataset was built from forbids them outright, and so does
  // the rest of this timeline. Percentages, "likelihood", "certainty" and
  // star ratings are all the same mistake.
  for (const e of THIRTY_THREE_VEDIC_EVENTS) {
    for (const c of e.claims) {
      const text = `${c.evidence} ${c.notes ?? ""}`;
      assert.doesNotMatch(text, /\b\d{1,3}\s?% (confiden|certain|likel|probab)/i, `${e.slug}: a confidence score`);
      assert.doesNotMatch(text, /confidence (score|level|rating)/i, `${e.slug}: a confidence score`);
    }
  }
});

// ---------------------------------------------------------------------------
// THE ANCHOR: four questions, four kinds of answer, kept apart
// ---------------------------------------------------------------------------

test("the Rgveda record keeps composition, codification and manuscript apart", () => {
  // The whole point of the anchor. Merging any two of these produces the
  // sentence "the Vedic 33 is 3,500 years old", which is true of one of them
  // and false of another.
  const dated = event(THIRTY_THREE_VEDIC_ANCHOR_SLUG).claims.map((c) => c.whatIsDated);
  assert.ok(dated.some((d) => /composed/i.test(d ?? "")), "no claim about composition");
  assert.ok(dated.some((d) => /codified|collection/i.test(d ?? "")), "no claim about codification");
  assert.ok(dated.some((d) => /manuscript/i.test(d ?? "")), "no claim about the surviving manuscript");
});

test("the oldest surviving manuscript is medieval, and later than the composition claims", () => {
  // The fact most often left out, asserted here so that removing it fails.
  const claims = event(THIRTY_THREE_VEDIC_ANCHOR_SLUG).claims;
  const manuscript = claims.find((c) => /manuscript/i.test(c.whatIsDated ?? ""));
  assert.ok(manuscript, "the manuscript claim has gone");
  assert.ok(manuscript!.startYear! > 1000, "the manuscript claim is no longer medieval");
  const composition = claims.find((c) => /composed/i.test(c.whatIsDated ?? ""));
  assert.ok(
    manuscript!.startYear! - composition!.startYear! > 2000,
    "the gap between composition and the oldest copy is the point, and it has shrunk"
  );
});

test("the tradition's own view of the text has no position on the strip", () => {
  // apauruseya is not an early date. A timeline that rendered it as one would
  // be putting a doctrinal position into a race with a linguistic one.
  const doctrinal = event(THIRTY_THREE_VEDIC_ANCHOR_SLUG).claims.find((c) => c.chronology === "religious");
  assert.ok(doctrinal, "the doctrinal claim has gone");
  assert.equal(doctrinal!.startYear, undefined, "apauruseya has been given a year");
  assert.equal(doctrinal!.temporalClaimType, "no_beginning");
});

// ---------------------------------------------------------------------------
// THE TRANSMISSION CLAIM, AND WHAT IT IS ALLOWED TO SAY
// ---------------------------------------------------------------------------

test("the Buddhist record argues inheritance from the name not matching its referent", () => {
  // The argument, not the assertion: the heaven is called Thirty-Three and
  // holds far more than thirty-three. If that reasoning is edited out, what is
  // left is two traditions that both happen to use a number.
  const claim = event("trayastrimsa-heaven-of-the-thirty-three").claims.find((c) =>
    /inherited/i.test(c.whatIsDated ?? "")
  );
  assert.ok(claim, "the transmission claim has gone");
  assert.match(claim!.evidence, /far more than thirty-three/i, "the argument from the mismatch has gone");
  assert.match(claim!.notes ?? "", /\bB\b/, "the transmission class is no longer recorded");
  assert.match(claim!.evidence, /not a documented act of borrowing|WHAT IT IS NOT/i);
});

test("the Vedic-to-Buddhist edge is source_of and says it is class B, not A", () => {
  const edge = THIRTY_THREE_VEDIC_LINKS.find(
    (l) => l.from === THIRTY_THREE_VEDIC_ANCHOR_SLUG && l.to === "trayastrimsa-heaven-of-the-thirty-three"
  );
  assert.ok(edge, "the transmission edge has gone");
  assert.equal(edge!.relation, "source_of");
  assert.match(edge!.note, /Class B/i, "the edge no longer states which transmission class it is");
});

// ---------------------------------------------------------------------------
// THE NEGATIVE FINDING, WHICH IS THE POINT OF THE TRANCHE
// ---------------------------------------------------------------------------

test("the Avestan record cites the passage, and shows that it once denied it", () => {
  // This test used to assert the opposite. The record said no Avestan passage
  // naming thirty-three could be found; the Yasna has the formula eight times.
  // A failed search had been written up as though it were a fact about a text.
  // What this test now guards is BOTH halves: that the attestation is cited
  // precisely enough to check, and that the record still admits it was wrong,
  // because a correction that erases its own history teaches nobody anything.
  const record = event("avestan-thirty-three-unresolved");
  assert.notEqual(record.eventType, "disputed", "the attestation is not in dispute; it is in the text");
  assert.match(record.description, /thrayasca thrisasca/i, "the Avestan phrase has gone");
  for (const loc of ["1.10", "2.10", "3.12", "4.15", "6.9", "7.12", "17.9", "22.12"]) {
    assert.ok(record.description.includes(loc), `Yasna ${loc} is no longer cited`);
  }
  assert.match(record.description, /overturned|correction/i, "the record no longer admits it was corrected");
  // And the finding it replaced must not creep back in.
  assert.doesNotMatch(record.description, /no such passage found/i);
});

test("the Vedic and Avestan thirty-threes are not quietly equated", () => {
  // The formula is shared; the referents are not. The Vedic thirty-three
  // counts gods, the Avestan thirty-three counts ratus of ritual time. Losing
  // that distinction would turn a real and interesting finding into an
  // overclaim, which is the failure mode on this side of the correction.
  const record = event("avestan-thirty-three-unresolved");
  assert.match(record.description, /ritual TIME|ritual time/, "the record no longer says what the ratus are");
  assert.match(record.description, /not a census of gods|divergent referent|different things/i);
});

test("Boyce is quoted for what she wrote, and not for the number she did not give", () => {
  // This dataset once attributed to her a sentence about "the thirty-three
  // divinities" with day-names or Yashts. She wrote no such sentence. The
  // fabricated version was doing work in an argument. This test guards the
  // real quotation and, just as importantly, guards the admission that the
  // arithmetic of thirty-plus-three is the reader's and not hers.
  const claim = event("avestan-thirty-three-unresolved").claims.find((c) => c.sourceKey === "iranica_amesa_spenta");
  assert.ok(claim, "the Iranica claim has gone");
  assert.match(claim!.originalDateText, /present-day|modern/i);
  assert.match(claim!.evidence, /calendrical/i, "Boyce's actual wording has gone");
  assert.match(claim!.evidence, /Burz Yazad/, "the three extra dedications she names have gone");
  assert.match(claim!.evidence, /BOYCE DOES NOT GIVE THE NUMBER/);
  assert.ok(claim!.startYear! > 1800, "a modern usage has been given an ancient date");
  // The invented paraphrase must not return.
  assert.doesNotMatch(claim!.evidence, /Yasht/i, "the Yasht detail was never in the article");
});

test("the Proto-Indo-Iranian hypothesis carries no date at all", () => {
  // The brief asked for c. 2500-2000 BCE to be investigated and forbade
  // assigning it without evidence. There is no evidence, so there is no date,
  // and this test is what stops one appearing.
  const record = event("proto-indo-iranian-thirty-three-hypothesis");
  assert.equal(record.eventType, "hypothesised");
  for (const claim of record.claims) {
    assert.equal(claim.startYear, undefined, "the reconstruction has been given a date");
    assert.equal(claim.endYear, undefined, "the reconstruction has been given a date range");
  }
  assert.match(record.description, /must not be given a date/i);
});

test("the hypothesis now has both branches, and still has no date", () => {
  // It previously said the argument failed for want of a second branch. The
  // second branch was there all along. The claim must now say so, must say
  // what is still missing, and must go on refusing a date: two attestations
  // argue for inheritance and say nothing whatever about when.
  const claim = event("proto-indo-iranian-thirty-three-hypothesis").claims[0];
  assert.match(claim.evidence, /attestation in both/i);
  assert.match(claim.evidence, /cognate/i, "the reason the parallel is strong has gone");
  assert.match(claim.evidence, /STILL MISSING/i, "the claim no longer says what it lacks");
  assert.doesNotMatch(claim.evidence, /attestation in one\./i, "the superseded finding is back");
  assert.match(claim.notes ?? "", /CORRECTED/);
  assert.equal(claim.startYear, undefined);
});

// ---------------------------------------------------------------------------
// THE 330 MILLION RECORD
// ---------------------------------------------------------------------------

test("the koti record treats the traditional reading as a claim with a claimant", () => {
  // It is very likely right, and it is not this dataset's finding. The
  // difference has to survive editing.
  const record = event("thirty-three-becomes-three-hundred-and-thirty-million");
  assert.equal(record.eventType, "disputed");
  const claim = record.claims[0];
  assert.equal(claim.chronology, "traditional");
  assert.match(claim.evidence, /WHO CLAIMS IT/i, "the claim no longer names who holds it");
  assert.match(claim.notes ?? "", /devotional and educational rather than philological/i);
});

// ---------------------------------------------------------------------------
// STRUCTURE
// ---------------------------------------------------------------------------

test("every link joins two records that exist, in this dataset", () => {
  const slugs = new Set(THIRTY_THREE_VEDIC_EVENTS.map((e) => e.slug));
  for (const link of THIRTY_THREE_VEDIC_LINKS) {
    assert.ok(slugs.has(link.from), `link from ${link.from}, which is not here`);
    assert.ok(slugs.has(link.to), `link to ${link.to}, which is not here`);
  }
});

test("every claim's source key names a source in this dataset", () => {
  const keys = new Set(THIRTY_THREE_VEDIC_SOURCES.map((s) => s.key));
  for (const e of THIRTY_THREE_VEDIC_EVENTS) {
    for (const c of e.claims) {
      if (c.sourceKey) assert.ok(keys.has(c.sourceKey), `${e.slug}: no source ${c.sourceKey}`);
    }
  }
});

test("originalDateText is unique within each record", () => {
  // The seeder matches claims back to their citations by this text, so two
  // claims on one record sharing it would collapse into one.
  for (const e of THIRTY_THREE_VEDIC_EVENTS) {
    const texts = e.claims.map((c) => c.originalDateText);
    assert.equal(new Set(texts).size, texts.length, `${e.slug}: two claims share an originalDateText`);
  }
});
