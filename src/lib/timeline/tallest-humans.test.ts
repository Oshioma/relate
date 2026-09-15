import assert from "node:assert/strict";
import { test } from "node:test";
import { TALLEST_HUMANS_EVENTS, TALLEST_HUMANS_SOURCES } from "./tallest-humans-seed";
import { cmToFeetInches, EVIDENCE_STATUSES, MEASUREMENT_KINDS, MEASUREMENT_METHODS, MEDIA_KINDS } from "./taxonomy";

const person = (slug: string) => {
  const found = TALLEST_HUMANS_EVENTS.find((e) => e.slug === slug);
  assert.ok(found, `no record ${slug}`);
  return found!;
};

// ---------------------------------------------------------------------------
// THE RULE THE DATASET EXISTS FOR
// ---------------------------------------------------------------------------

test("no record carries a single authoritative height", () => {
  // A person has no height, exactly as an event has no date. The moment a
  // height moves onto the record itself, this dataset has become the thing it
  // was built to argue against.
  for (const e of TALLEST_HUMANS_EVENTS) {
    const raw = JSON.stringify({ ...e, measurements: undefined, claims: undefined, media: undefined, description: undefined });
    assert.doesNotMatch(raw, /"heightCm"|"height_cm"|"statureCm"/, `${e.slug}: a height has been put on the event`);
  }
});

test("every measurement has either a figure or a stated reason for having none", () => {
  // The database enforces this too. A row with no number is legitimate — a
  // report can be evidence that a claim was made with no figure surviving —
  // but silence about WHY is how a gap turns into an oversight.
  for (const e of TALLEST_HUMANS_EVENTS) {
    for (const m of e.measurements ?? []) {
      const hasValue = typeof m.valueCm === "number";
      assert.ok(
        hasValue || Boolean(m.valueAbsentReason),
        `${e.slug}: measurement "${m.whatIsMeasured}" has neither a value nor a reason`
      );
    }
  }
});

test("every measurement says what was measured, how, and on what authority", () => {
  const kinds = new Set<string>(MEASUREMENT_KINDS.map((k) => k.key));
  const methods = new Set<string>(MEASUREMENT_METHODS.map((m) => m.key));
  const statuses = new Set<string>(EVIDENCE_STATUSES.map((s) => s.key));
  for (const e of TALLEST_HUMANS_EVENTS) {
    for (const m of e.measurements ?? []) {
      assert.ok(kinds.has(m.measurementKind), `${e.slug}: unknown measurement kind ${m.measurementKind}`);
      assert.ok(methods.has(m.measurementMethod), `${e.slug}: unknown method ${m.measurementMethod}`);
      assert.ok(statuses.has(m.evidenceStatus), `${e.slug}: unknown evidence status ${m.evidenceStatus}`);
      assert.ok(m.evidence.length > 80, `${e.slug}: measurement evidence is too thin to check`);
      assert.ok(m.originalValueText.length > 0, `${e.slug}: nothing records what the source actually said`);
    }
  }
});

test("no measurement anywhere carries a confidence score", () => {
  for (const e of TALLEST_HUMANS_EVENTS) {
    for (const m of e.measurements ?? []) {
      const text = `${m.evidence} ${m.notes ?? ""}`;
      assert.doesNotMatch(text, /confidence (score|level|rating)/i, `${e.slug}: a confidence score`);
      assert.doesNotMatch(text, /\b\d{1,3}\s?% (confiden|certain|likel|probab)/i, `${e.slug}: a confidence score`);
    }
  }
});

// ---------------------------------------------------------------------------
// THE THREE DISTINCTIONS THE DATASET IS ACTUALLY ABOUT
// ---------------------------------------------------------------------------

test("Byrne keeps both the advertisement and the bones, and neither is deleted", () => {
  // The whole point. Eight feet was advertised; the skeleton is shorter; both
  // statements are real. Dropping the advertisement would hide the gap, and
  // the gap is the finding.
  const byrne = person("charles-byrne-skeleton");
  const advertised = byrne.measurements!.find((m) => m.measurementKind === "advertised_height");
  const skeletal = byrne.measurements!.find((m) => m.measurementKind === "skeletal_height");
  assert.ok(advertised, "the advertised height has been deleted");
  assert.ok(skeletal, "the skeletal measurement has gone");
  assert.equal(advertised!.directlyMeasured, false);
  assert.equal(skeletal!.directlyMeasured, true);
  assert.ok((skeletal!.valueCm ?? 0) < (advertised!.valueCm ?? 0), "the skeleton should be shorter than the advertisement");
  // And the record must explain WHY a skeleton is shorter, or the reader will
  // conclude the advertisement was simply a lie.
  assert.match(byrne.description, /cartilage|intervertebral|soft tissue/i, "the record no longer says why bones measure less");
  assert.match(skeletal!.evidence, /floor/i, "the skeletal figure is no longer marked as a floor");
});

test("Byrne's remains are located by an accession number, not by a caption", () => {
  const byrne = person("charles-byrne-skeleton");
  assert.equal(byrne.evidenceStatus, "verified_physical_remains");
  assert.match(byrne.accessionNumber ?? "", /Osteo/i, "the accession number has gone");
  assert.ok(byrne.remainsLocation, "where the remains are has gone");
  // The consent question is part of the record and must not be tidied away.
  assert.match(byrne.description, /buried at sea|consent/i, "the ethics of retention have been dropped");
});

test("Carroll's two heights stay two heights, and the missing one stays missing", () => {
  // The clearest case of one man with two correct answers. If the measured
  // standing figure is ever silently filled in with an approximation, the
  // distinction this record exists for is gone.
  const carroll = person("john-f-carroll");
  const corrected = carroll.measurements!.find((m) => m.measurementKind === "corrected_living_height");
  const standing = carroll.measurements!.find((m) => m.measurementKind === "standing_height_living");
  assert.ok(corrected && standing, "one of Carroll's two heights has gone");
  assert.equal(corrected!.directlyMeasured, false, "a corrected height was never measured");
  assert.equal(standing!.valueCm, undefined, "the measured standing height has been invented");
  assert.ok(standing!.valueAbsentReason, "the gap no longer says it is a gap");
  assert.match(carroll.description, /must not be inferred from photographs/i);
});

// ---------------------------------------------------------------------------
// PICTURES
// ---------------------------------------------------------------------------

test("every seeded picture declares what kind of thing it is", () => {
  const kinds = new Set<string>(MEDIA_KINDS.map((k) => k.key));
  for (const e of TALLEST_HUMANS_EVENTS) {
    for (const m of e.media ?? []) {
      assert.ok(m.shows, `${e.slug}: a picture with no 'shows'`);
      assert.ok(kinds.has(m.shows!), `${e.slug}: unknown media kind ${m.shows}`);
      assert.ok(m.caption && m.caption.length > 20, `${e.slug}: a picture with no real caption`);
    }
  }
});

test("every picture records the page its provenance lives on", () => {
  // The file URL is where a JPEG lives. The FILE PAGE is where the licence,
  // the creator and the institution live, and it is what survives a rename.
  for (const e of TALLEST_HUMANS_EVENTS) {
    for (const m of e.media ?? []) {
      assert.ok(m.sourcePageUrl, `${e.slug}: a picture with no source page`);
      assert.match(m.sourcePageUrl!, /^https:\/\//, `${e.slug}: source page is not a URL`);
      assert.notEqual(m.sourcePageUrl, m.url, `${e.slug}: the source page is just the file again`);
    }
  }
});

test("nothing claims to show remains without something other than a caption saying so", () => {
  // The rule that separates this dataset from every viral giant-skeleton post:
  // a picture asserting it shows a named person's remains must also assert
  // that the identification is established, and must name where they are held.
  for (const e of TALLEST_HUMANS_EVENTS) {
    for (const m of e.media ?? []) {
      if (!m.depictsActualRemains) continue;
      assert.equal(m.verifiedIdentity, true, `${e.slug}: remains claimed with an unverified identity`);
      assert.ok(m.institution, `${e.slug}: remains claimed with no holding institution`);
    }
  }
});

test("no picture of a living person is marked as remains", () => {
  for (const e of TALLEST_HUMANS_EVENTS) {
    for (const m of e.media ?? []) {
      if (m.shows !== "evidence_photograph") continue;
      assert.notEqual(m.depictsActualRemains, true, `${e.slug}: a photograph of a person marked as remains`);
    }
  }
});

// ---------------------------------------------------------------------------
// SOURCING HONESTY, SAME RULE AS EVERY OTHER TRANCHE
// ---------------------------------------------------------------------------

test("figures this dataset has not traced to a document say so", () => {
  const flagged = TALLEST_HUMANS_EVENTS.flatMap((e) =>
    (e.measurements ?? []).filter((m) => /NEEDS SOURCE VERIFICATION/.test(`${m.notes ?? ""}${m.evidence}`))
  );
  assert.ok(flagged.length >= 5, `only ${flagged.length} measurements carry a verification flag`);
});

test("the Byrne catalogue measurement is flagged as the one that matters most", () => {
  // It is the strongest number in the dataset and it is currently given from
  // general knowledge. That combination is exactly what a flag is for.
  const skeletal = person("charles-byrne-skeleton").measurements!.find((m) => m.measurementKind === "skeletal_height");
  assert.match(skeletal!.notes ?? "", /NEEDS SOURCE VERIFICATION/);
  assert.match(skeletal!.notes ?? "", /most important unverified number/i);
});

test("every source says what it is cited FOR", () => {
  for (const s of TALLEST_HUMANS_SOURCES) {
    assert.ok(s.notes.length > 60, `${s.key}: no real note`);
    assert.ok(s.sourceType, `${s.key}: no source type`);
  }
});

// ---------------------------------------------------------------------------
// THE ARITHMETIC THE CHART DEPENDS ON
// ---------------------------------------------------------------------------

test("centimetres convert to feet and inches without drifting", () => {
  assert.equal(cmToFeetInches(175), "5 ft 8.9 in");
  assert.equal(cmToFeetInches(272), "8 ft 11.1 in"); // Wadlow, the published figure
  assert.equal(cmToFeetInches(231.7), "7 ft 7.2 in"); // Sandy Allen
  // The carry: 11.96 inches must become the next foot, not "5 ft 12 in".
  assert.equal(cmToFeetInches(182.88), "6 ft 0 in");
  assert.doesNotMatch(cmToFeetInches(182.87), /12 in/);
});
