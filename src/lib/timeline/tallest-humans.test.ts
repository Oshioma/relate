import assert from "node:assert/strict";
import { test } from "node:test";
import { TALLEST_HUMANS_DISPUTED, TALLEST_HUMANS_EVENTS, TALLEST_HUMANS_SOURCES } from "./tallest-humans-seed";
import {
  cmToFeetInches,
  EVIDENCE_STATUSES,
  MEASUREMENT_KINDS,
  MEASUREMENT_METHODS,
  measurementKindIsOfABody,
  MEDIA_KINDS,
} from "./taxonomy";
import { personMatchesFilter, plottedMeasurement } from "./tallest-humans-scale-logic";

/** The seed shape, as the chart receives it. */
const scaleShape = (e: (typeof ALL_TALLEST)[number]) => ({
  slug: e.slug,
  title: e.title,
  summary: e.summary,
  evidenceStatus: e.evidenceStatus,
  measurements: (e.measurements ?? []).map((m) => ({ ...m })),
});

const ALL_TALLEST = [...TALLEST_HUMANS_EVENTS, ...TALLEST_HUMANS_DISPUTED];

const person = (slug: string) => {
  const found = ALL_TALLEST.find((e) => e.slug === slug);
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

test("Byrne preserves the College disagreeing with itself", () => {
  // This test used to assert the simple story: eight feet advertised, less on
  // the bones, gap explained by soft tissue. Reading the catalogue broke it.
  // The institution holding the skeleton supplies TWO measurements of it,
  // twenty-six years apart, five inches apart — Owen 1853 at eight feet,
  // Flower 1879 at 2310 mm. An accession number guarantees a thing can be
  // re-measured. It does not guarantee the measurements agree, and that is
  // now the finding this record carries.
  const byrne = person("charles-byrne-skeleton");
  const skeletal = byrne.measurements!.filter((m) => m.measurementKind === "skeletal_height");
  assert.equal(skeletal.length, 2, "one of the two College catalogue measurements has gone");
  const [low, high] = skeletal.map((m) => m.valueCm!).sort((a, b) => a - b);
  assert.ok(high - low > 10, "the disagreement between the two catalogues has been smoothed away");
  for (const m of skeletal) assert.equal(m.directlyMeasured, true);
  // The advertised and posthumous figures stay, because the gap is the point.
  assert.ok(byrne.measurements!.some((m) => m.measurementKind === "advertised_height"));
  assert.ok(byrne.measurements!.some((m) => m.measurementKind === "posthumous_report"));
  assert.match(byrne.description, /does not guarantee that\s+the measurements agree/i);
});

test("the corpse that grew after death is left visible", () => {
  // The Annual Register gives eight feet in 1780, two inches more by 1782, and
  // eight feet four AFTER he died. The last figure exceeds the last living
  // one, which does not happen. Quietly dropping it would remove the clearest
  // internal evidence that these numbers were not measurements.
  const posthumous = person("charles-byrne-skeleton").measurements!.find(
    (m) => m.measurementKind === "posthumous_report"
  );
  assert.ok(posthumous, "the posthumous report has gone");
  assert.match(posthumous!.originalValueText, /after he was dead he measured eight feet four inches/i);
  assert.match(posthumous!.evidence, /does not happen/i, "the record no longer points out the impossibility");
});

test("the record admits the soft-tissue explanation did not apply here", () => {
  // It previously explained the whole gap by saying a mounted skeleton is
  // necessarily shorter than the living body. Flower says his mount is one "in
  // which due allowance appears to be given for the intervertebral substance".
  // The general rule is sound; it did not apply in the simple form asserted.
  const byrne = person("charles-byrne-skeleton");
  assert.match(byrne.description, /does not apply here in the simple form this record asserted/i);
  const flower = byrne.measurements!.find((m) => /Flower/.test(m.whatIsMeasured));
  assert.match(flower!.evidence, /due allowance appears to be given/i);
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

test("the Byrne figures now come from the catalogue, not from memory", () => {
  // This test used to require a NEEDS SOURCE VERIFICATION flag naming the
  // skeletal figure as the most important unverified number in the dataset.
  // The catalogue has been read, so the flag is gone — and what the test now
  // guards is the evidence of the reading: every Byrne measurement cites the
  // catalogue record, and the figures are attributed to the people who took
  // them rather than floating free.
  const byrne = person("charles-byrne-skeleton");
  for (const m of byrne.measurements!) {
    assert.equal(m.sourceKey, "rcs_surgicat_byrne", `"${m.whatIsMeasured}" no longer cites the catalogue`);
  }
  const flower = byrne.measurements!.find((m) => /Flower/.test(m.whatIsMeasured));
  assert.equal(flower!.measuredBy, "William Henry Flower", "the measurer is no longer named");
  assert.match(flower!.evidence, /femur r\. 625/, "the published bone measurements have gone");
  // And the modern description's own internal inconsistency must stay on the record.
  const modern = byrne.measurements!.find((m) => /modern description/i.test(m.whatIsMeasured));
  assert.match(modern!.evidence, /2\.35 m is about seven\s+feet eight and a half inches, not seven feet seven/i);
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

// ---------------------------------------------------------------------------
// ADVERTISED AGAINST MEASURED, AND THE GAP THAT MUST NOT BE GUESSED
// ---------------------------------------------------------------------------

test("Ella Ewing keeps the poster and refuses to invent the real figure", () => {
  // The interesting quantity is the SIZE OF THE GAP between what was
  // advertised and what was true. A guessed second number produces a guessed
  // gap, which is worse than no gap at all, so the second measurement is
  // deliberately valueless.
  const ella = person("ella-ewing");
  const advertised = ella.measurements!.find((m) => m.measurementKind === "advertised_height");
  const actual = ella.measurements!.find((m) => m.measurementKind === "standing_height_living");
  assert.ok(advertised && actual, "one of the two figures has gone");
  assert.equal(typeof advertised!.valueCm, "number", "the advertised figure has been deleted");
  assert.equal(actual!.valueCm, undefined, "a non-promotional height has been invented");
  assert.match(actual!.valueAbsentReason ?? "", /not been traced|not obtained/i);
  assert.match(actual!.evidence, /SIZE OF THE GAP/i);
});

test("the poster and the newspaper chart are not filed as photographs", () => {
  // A playbill is evidence about the show business of the period. A comparison
  // chart is evidence of what was being claimed in 1900. Neither is evidence
  // of a height, and neither may sit in a gallery as though it were a
  // photograph of the person.
  const ella = person("ella-ewing");
  const poster = ella.media!.find((m) => m.url.includes("Poster"));
  const chart = ella.media!.find((m) => m.url.includes("comparison_chart"));
  assert.ok(poster && chart, "the poster or the chart has gone");
  for (const item of [poster!, chart!]) {
    assert.notEqual(item.shows, "evidence_photograph", "an advertisement filed as a photograph");
    assert.notEqual(item.depictsActualRemains, true);
    assert.equal(item.verifiedIdentity, false, "an advertisement should not assert a verified identity");
  }
  assert.match(chart!.caption!, /[Nn]ot evidence that any figure in it is correct/);
});

test("Beaupré records that the evidence was destroyed, and when", () => {
  // The parallel to Byrne, run to the opposite conclusion: his body was
  // returned and cremated in 1990, so there is nothing left to measure. The
  // record must date the loss rather than quietly reporting a height.
  const eb = person("edouard-beaupre");
  assert.equal(eb.evidenceStatus, "historical_report_remains_lost");
  const cremation = eb.claims.find((c) => c.startYear === 1990);
  assert.ok(cremation, "the date the remains ceased to exist has gone");
  assert.match(cremation!.evidence, /nothing left to measure/i);
  assert.match(eb.description, /Byrne/, "the comparison with the case that ended differently has gone");
});

test("no record copies a height out of an image description", () => {
  // A file description is a good record of a picture and is not an authority
  // for a measurement. The Bates record exists partly to say so.
  const bates = person("anna-and-martin-bates");
  assert.match(bates.description, /file description is a good record of a picture and is not an authority/i);
  for (const m of bates.measurements!) {
    assert.match(m.notes ?? "", /NEEDS SOURCE VERIFICATION/);
  }
});

// ---------------------------------------------------------------------------
// THE DISPUTED SECTION, AND THE LINE BETWEEN IT AND THE REST
// ---------------------------------------------------------------------------

test("the disputed records are a separate export and stay separate", () => {
  // Kept apart so nothing can treat a fabrication as a person by iterating one
  // array. They seed into the same lane, deliberately — a claims section filed
  // somewhere else is a claims section nobody reads — but the code has to keep
  // being able to tell them apart.
  const verifiedSlugs = new Set(TALLEST_HUMANS_EVENTS.map((e) => e.slug));
  for (const d of TALLEST_HUMANS_DISPUTED) {
    assert.ok(!verifiedSlugs.has(d.slug), `${d.slug} is in both arrays`);
    assert.ok(
      ["known_hoax", "disputed", "misidentified", "unresolved", "historical_report_remains_lost"].includes(
        d.evidenceStatus ?? ""
      ),
      `${d.slug}: a disputed record with status ${d.evidenceStatus}`
    );
  }
});

test("a carved object is never recorded as a body measurement", () => {
  // The Cardiff Giant is ten feet long, was measured carefully by people with
  // no reason to lie, and is a block of gypsum. This is the assertion that
  // stops a rock reaching the top of a list of the tallest humans.
  const cardiff = person("cardiff-giant");
  const m = cardiff.measurements![0];
  assert.equal(m.measurementKind, "fabricated_object");
  assert.equal(measurementKindIsOfABody(m.measurementKind), false);
  assert.match(m.evidence, /There was never a body/i);
  // And the chart's own selector must agree, not just the taxonomy.
  assert.equal(plottedMeasurement(scaleShape(cardiff)), null, "the Cardiff Giant would be drawn as a person");
});

test("every disputed record separates the claim from what can be established", () => {
  for (const d of TALLEST_HUMANS_DISPUTED) {
    assert.match(d.description, /THINGS TO ASK/i, `${d.slug}: no questions for the reader`);
    // A hoax record that does not say how the hoax was demonstrated is just an
    // assertion with the opposite sign.
    if (d.evidenceStatus === "known_hoax") {
      assert.match(
        d.description,
        /confessed|originated on a website|photo-manipulation|contest/i,
        `${d.slug}: says it is a hoax without saying how that is known`
      );
    }
  }
});

test("the Smithsonian record does not throw the real problem out with the fake one", () => {
  // The court case is invented. The missing nineteenth-century remains are
  // largely real. Collapsing those into one answer would let a genuine gap in
  // the archaeological record be dismissed along with a fabricated news story.
  const sm = person("smithsonian-giant-skeletons-claim");
  assert.equal(sm.claims.length, 2, "the two halves of the claim have been merged");
  const fabricated = sm.claims.find((c) => c.startYear === 2014);
  const real = sm.claims.find((c) => c.temporalClaimType === "unknown");
  assert.ok(fabricated && real, "one half has gone");
  assert.match(real!.evidence, /probably\s+TRUE/i, "the real half no longer says it is probably true");
  assert.match(real!.evidence, /without conspiracy|casual collecting/i, "the ordinary explanations have gone");
});

// ---------------------------------------------------------------------------
// THE REMAINS CASES
// ---------------------------------------------------------------------------

test("Cotter O'Brien records two exhumations and refuses to invent their figures", () => {
  // A lifetime advertisement plus two physical examinations is a better
  // evidential chain than almost any other historical giant has. The figures
  // are not in this dataset, and putting a plausible number in would
  // manufacture the appearance of a measurement out of a recollection of one.
  const pc = person("patrick-cotter-obrien");
  const exhumations = pc.claims.filter((c) => /exhumation/i.test(c.whatIsDated ?? ""));
  assert.equal(exhumations.length, 2, "one of the two exhumations has gone");
  const skeletal = pc.measurements!.find((m) => m.measurementKind === "skeletal_height");
  assert.equal(skeletal!.valueCm, undefined, "an exhumation figure has been invented");
  assert.match(skeletal!.valueAbsentReason ?? "", /has not read the 1906 or 1972 reports/i);
});

test("Bunford's skeleton is the shorter figure, and the record says why", () => {
  // The opposite direction from Carroll: here the bones survive and they are
  // SHORTER than the woman was. A list that swapped one for the other would
  // move her several places without anybody noticing.
  const jb = person("jane-bunford");
  const living = jb.measurements!.find((m) => m.measurementKind === "standing_height_living");
  const skeletal = jb.measurements!.find((m) => m.measurementKind === "skeletal_height");
  assert.ok(living && skeletal, "one of the two figures has gone");
  assert.ok((skeletal!.valueCm ?? 0) < (living!.valueCm ?? 0), "the skeleton should be shorter than the living woman");
  assert.match(skeletal!.evidence, /not a correction of the one above/i);
  // Her present whereabouts must not be asserted from memory.
  assert.equal(jb.remainsLocation, undefined, "a location has been asserted for remains nobody here has traced");
});

test("Rogan's record treats protected remains as a decision, not a gap", () => {
  const jr = person("john-rogan");
  assert.match(jr.remainsLocation ?? "", /concrete|grave robbing/i);
  assert.match(jr.description, /Byrne/, "the comparison with the man who asked for the same protection has gone");
  // He could not stand; a length is not a standing height.
  const m = jr.measurements![0];
  assert.match(m.evidence, /could not stand/i, "the recumbent/standing distinction has gone");
});

test("the disputed filter finds the hoaxes, and they still get no bar", () => {
  // Both halves matter. A fabrication that is filtered out of view has been
  // hidden rather than explained; a fabrication that gets plotted has been
  // endorsed. It should be findable and unplottable at once.
  const shapes = ALL_TALLEST.map(scaleShape);
  const disputed = shapes.filter((p) => personMatchesFilter(p, "disputed"));
  for (const slug of ["cardiff-giant", "viral-giant-skeleton-images", "smithsonian-giant-skeletons-claim"]) {
    assert.ok(disputed.some((p) => p.slug === slug), `${slug} is not reachable under the disputed filter`);
    assert.equal(plottedMeasurement(shapes.find((p) => p.slug === slug)!), null, `${slug} would be drawn`);
  }
  // And Wadlow, who is not disputed, must not be swept in with them.
  assert.ok(!disputed.some((p) => p.slug === "robert-wadlow"), "Wadlow has been filed as disputed");
});

test("every person with a plottable figure is plotted from a body measurement", () => {
  for (const p of ALL_TALLEST.map(scaleShape)) {
    const m = plottedMeasurement(p);
    if (!m) continue;
    assert.equal(measurementKindIsOfABody(m.measurementKind), true, `${p.slug}: plotted from a non-body figure`);
    assert.equal(typeof m.valueCm, "number", `${p.slug}: plotted with no value`);
  }
});

// ---------------------------------------------------------------------------
// TRANCHE THREE: TRAJECTORIES, IMPOSSIBLE PHOTOGRAPHS, AND WIDE DISAGREEMENT
// ---------------------------------------------------------------------------

test("Trijntje Keever fixes the rule that some photographs cannot exist", () => {
  // She died in 1633. Photography arrives two centuries later. Any image
  // presented as a photograph of her is something else, with certainty and
  // without needing to be examined. That is arithmetic, not a judgement, and
  // it gives the dataset one case where the media question has a hard answer.
  const tk = person("trijntje-keever");
  const life = tk.claims[0];
  assert.ok((life.endYear ?? 9999) < 1800, "her death date no longer predates photography");
  assert.match(tk.description, /NO PHOTOGRAPH OF\s+TRIJNTJE KEEVER EXISTS OR CAN EXIST/i);
  // And no picture may ever be attached to her as a photograph of the person.
  for (const m of tk.media ?? []) {
    assert.notEqual(m.shows, "evidence_photograph", "a photograph has been attached to somebody who died in 1633");
  }
});

test("Adam Rainer is recorded as a trajectory, not a height", () => {
  // He has no height. He has a direction. A list that ranks him by his final
  // figure ranks a man who spent most of his life far shorter than that.
  const ar = person("adam-rainer");
  assert.equal(ar.measurements!.length, 2, "one end of the trajectory has gone");
  const early = ar.measurements!.find((m) => /military/i.test(m.whatIsMeasured));
  const late = ar.measurements!.find((m) => /end of his life/i.test(m.whatIsMeasured));
  assert.ok(early && late, "one of the two measurements has gone");
  // The military figure is the better evidence and is deliberately not invented.
  assert.equal(early!.valueCm, undefined, "a conscription figure has been invented");
  assert.match(early!.evidence, /no interest in the answer/i, "why a disinterested measurement is better has gone");
  assert.match(late!.evidence, /cannot sensibly be ranked/i, "why he cannot be ranked has gone");
  assert.match(ar.description, /He has no height\. He has a trajectory\./);
});

test("Makhnov keeps both ends of the disagreement rather than a midpoint", () => {
  // Thirty centimetres of disagreement about one man means the reporting is
  // unreliable at both ends. A reader shown only the average would be shown a
  // number nobody actually claims.
  const fm = person("fyodor-makhnov");
  const values = fm.measurements!.map((m) => m.valueCm!).sort((a, b) => a - b);
  assert.equal(values.length, 2, "the range has been collapsed");
  assert.ok(values[1] - values[0] > 25, "the spread that is the whole point has been narrowed");
  const advertised = fm.measurements!.find((m) => m.measurementKind === "advertised_height");
  assert.ok(advertised, "the promotional figure has been promoted out of its category");
  assert.match(advertised!.evidence, /does not compete with a well-documented one/i);
});

test("Zeng Jinlian's figure is not silently called a standing height", () => {
  // She could not stand erect, so whatever was done it was not a stadiometer
  // reading. The figure is not in doubt; the method is, and saying "standing
  // height" would assert something this dataset does not know.
  const zj = person("zeng-jinlian");
  const m = zj.measurements![0];
  assert.equal(m.measurementKind, "reported_unspecified");
  assert.notEqual(m.measurementKind, "standing_height_living");
  assert.match(m.evidence, /THE FIGURE IS NOT IN DOUBT\. The method is\./);
});
