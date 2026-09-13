import { test } from "node:test";
import assert from "node:assert/strict";

import {
  GIANTS_GREEK_EVENTS,
  GIANTS_GREEK_SOURCES,
  GIANTS_GREEK_LINKS,
  GIANTS_GREEK_TRACK,
  GIANTS_GREEK_ANCHOR_SLUG,
} from "./giants-greek-seed";
import { GIANTS_HEBREW_EVENTS, GIANTS_HEBREW_TRACK } from "./giants-hebrew-seed";
import {
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
  EVENT_RELATIONS,
  DATE_CONVENTIONS,
  TIMELINE_CATEGORIES,
  TEMPORAL_CLAIM_TYPES,
} from "./taxonomy";

// ---------------------------------------------------------------------------
// GIANTS, PART TWO — the Greek and Roman bone-finds.
//
// The guards here are aimed at the specific ways this tranche could go wrong,
// which are not the same ways as the first one. Its new risks are:
//
//   - ATTRIBUTION. Abel proposed the Cyclops hypothesis in 1914; Mayor defends
//     it. Collapsing those is the same error as making Cremo the discoverer of
//     everything in Forbidden Archeology.
//   - A FAVOURITE EXPLANATION SPREADING. The fossil explanation fits three of
//     these finds and argues AGAINST the fourth. A test keeps that refusal.
//   - INVENTED NUMBERS. Plutarch gives no size for the Skyros skeleton. A test
//     refuses one.
//   - A DEAD FACTOID. The Empedocles story has no ancient source, and a record
//     that repeats it without saying so would be passing it on.
//
// And a lesson carried forward from the fourth tranche of the previous dataset:
// a guard that searches a whole record passes a record whose description has
// been gutted, because the words are still sitting in some claim's evidence
// field. Content guards below check the DESCRIPTION, or one named claim.
// ---------------------------------------------------------------------------

const CLAIMS = GIANTS_GREEK_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);
const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));
const byslug = (slug: string) => {
  const found = GIANTS_GREEK_EVENTS.find((event) => event.slug === slug);
  assert.ok(found, `no record ${slug}`);
  return found!;
};
/** The description ALONE. Deliberately not the whole record — see the note above. */
const descriptionOf = (slug: string) => byslug(slug).description;
const sourceByKey = (key: string) => {
  const found = GIANTS_GREEK_SOURCES.find((source) => source.key === key);
  assert.ok(found, `no source ${key}`);
  return found!;
};
const claimWhere = (slug: string, match: RegExp) => {
  const found = byslug(slug).claims.find((claim) => match.test(claim.originalDateText));
  assert.ok(found, `${slug}: no claim whose originalDateText matches ${match}`);
  return found!;
};

const BONE_FINDS = ["orestes-bones-tegea", "theseus-bones-skyros", "antaeus-bones-tingis"];

// ---------------------------------------------------------------------------
// THE SILENT FAILURES
// ---------------------------------------------------------------------------

test("every vocabulary key is real", () => {
  // These columns are typed as string, so an invented key typechecks, inserts,
  // and renders as nothing at all. Nothing else catches it.
  const methods = keys(DATING_METHODS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  const relations = keys(EVENT_RELATIONS);
  const conventions = keys(DATE_CONVENTIONS);
  const categories = keys(TIMELINE_CATEGORIES);
  const claimTypes = keys(TEMPORAL_CLAIM_TYPES);
  const precisions = new Set([
    "day", "month", "year", "decade", "century", "millennium",
    "thousand_years", "million_years", "billion_years",
  ]);

  for (const event of GIANTS_GREEK_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: eventType ${event.eventType}`);
    assert.ok(categories.has(event.category), `${event.slug}: category ${event.category}`);
    for (const claim of event.claims) {
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: datingMethod ${claim.datingMethod}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: chronology ${claim.chronology}`);
      assert.ok(precisions.has(claim.datePrecision), `${event.slug}: datePrecision ${claim.datePrecision}`);
      if (claim.temporalClaimType) {
        assert.ok(claimTypes.has(claim.temporalClaimType), `${event.slug}: temporalClaimType ${claim.temporalClaimType}`);
      }
      if (claim.dateConvention) {
        assert.ok(conventions.has(claim.dateConvention), `${event.slug}: dateConvention ${claim.dateConvention}`);
      }
    }
  }
  for (const source of GIANTS_GREEK_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType), `${source.key}: sourceType ${source.sourceType}`);
  }
  for (const link of GIANTS_GREEK_LINKS) {
    assert.ok(relations.has(link.relation), `link ${link.from}→${link.to}: relation ${link.relation}`);
    if (link.viewpoint) {
      assert.ok(viewpoints.has(link.viewpoint), `link ${link.from}→${link.to}: viewpoint ${link.viewpoint}`);
    }
  }
});

test("every link points at a record that exists", () => {
  // A link whose endpoint does not exist is not an error anywhere: syncSeedLinks
  // looks the slug up, finds nothing, and silently writes no edge. A typo in a
  // cross-dataset slug would lose the Septuagint connection without a word.
  const known = new Set([
    ...GIANTS_GREEK_EVENTS.map((event) => event.slug),
    ...GIANTS_HEBREW_EVENTS.map((event) => event.slug),
  ]);
  for (const link of GIANTS_GREEK_LINKS) {
    assert.ok(known.has(link.from), `link from ${link.from}: no such record in this dataset or the first tranche`);
    assert.ok(known.has(link.to), `link to ${link.to}: no such record in this dataset or the first tranche`);
  }
});

test("every source key referenced exists, and every source is actually used", () => {
  // The second half caught a real bug last time: a source seeded and then never
  // cited by anything, which is a row in the database doing nothing.
  const declared = new Set(GIANTS_GREEK_SOURCES.map((source) => source.key));
  const used = new Set<string>();
  for (const { slug, claim } of CLAIMS) {
    if (claim.sourceKey) {
      assert.ok(declared.has(claim.sourceKey), `${slug}: claim cites unknown source ${claim.sourceKey}`);
      used.add(claim.sourceKey);
    }
    for (const citation of claim.citations ?? []) {
      assert.ok(declared.has(citation.sourceKey), `${slug}: citation names unknown source ${citation.sourceKey}`);
      used.add(citation.sourceKey);
    }
  }
  for (const link of GIANTS_GREEK_LINKS) {
    if (link.sourceKey) {
      assert.ok(declared.has(link.sourceKey), `link ${link.from}→${link.to}: unknown source ${link.sourceKey}`);
      used.add(link.sourceKey);
    }
  }
  for (const key of declared) {
    assert.ok(used.has(key), `source ${key} is seeded but nothing cites it`);
  }
});

test("slugs are unique, here and against the first tranche", () => {
  const slugs = GIANTS_GREEK_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug inside this dataset");
  for (const slug of slugs) {
    assert.ok(
      !GIANTS_HEBREW_EVENTS.some((event) => event.slug === slug),
      `${slug} already exists in the first tranche — seeding would skip it, not update it`
    );
  }
  assert.ok(slugs.includes(GIANTS_GREEK_ANCHOR_SLUG), "the anchor slug is not one of the records");
});

test("originalDateText is unique within each record", () => {
  // seedDataset matches citations back to claims by this text. Two claims on one
  // event sharing it attaches the wrong sources to the wrong dates.
  for (const event of GIANTS_GREEK_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share an originalDateText`);
  }
});

test("all the giants records share one lane", () => {
  // seedDataset resolves a track by slug, so a second literal with the same slug
  // would work but could drift in name or colour. Sharing the object cannot.
  assert.equal(GIANTS_GREEK_TRACK, GIANTS_HEBREW_TRACK);
  assert.equal(GIANTS_GREEK_TRACK.slug, "giants-traditions");
});

// ---------------------------------------------------------------------------
// THE ARITHMETIC OF DATES
// ---------------------------------------------------------------------------

test("every BCE date in a claim's own words converts correctly", () => {
  // Astronomical year numbering: 1 BCE is 0, so n BCE is 1 − n. Off-by-one here
  // is invisible on screen and wrong by a year forever. The figure is parsed out
  // of the source's own words rather than trusted.
  let checked = 0;
  for (const { slug, claim } of CLAIMS) {
    const text = claim.originalDateText;
    // "about 560 BCE", "730–700 BCE", "476/475 BCE"
    const matches = [...text.matchAll(/(\d[\d,]*)(?:\s*\/\s*\d+)?(?:–(\d[\d,]*))?\s*BCE/g)];
    for (const match of matches) {
      const first = Number(match[1].replace(/,/g, ""));
      const second = match[2] ? Number(match[2].replace(/,/g, "")) : null;
      // The earlier year is the larger BCE number, and it is the start.
      const earlier = second === null ? first : Math.max(first, second);
      const later = second === null ? first : Math.min(first, second);
      assert.equal(
        claim.startYear,
        1 - earlier,
        `${slug}: "${text}" — ${earlier} BCE should be stored as ${1 - earlier}, not ${claim.startYear}`
      );
      if (second !== null) {
        assert.equal(
          claim.endYear,
          1 - later,
          `${slug}: "${text}" — ${later} BCE should end at ${1 - later}, not ${claim.endYear}`
        );
      }
      checked++;
    }
  }
  assert.ok(checked >= 6, `only ${checked} BCE conversions checked — the parser has stopped matching`);
});

test("every before-present figure is converted from 1950, not carried across", () => {
  // The guard the first dataset had to have rewritten: checking that the stored
  // year is not round does NOT catch this, because 9,500 years ago copied as
  // −9500 is not round either. The only honest check reads the figure out of the
  // claim's own words and does the subtraction.
  let checked = 0;
  for (const { slug, claim } of CLAIMS) {
    const match = /([\d,]+)\s*(?:to\s*[\d,]+\s*)?years ago/.exec(claim.originalDateText);
    if (!match) continue;
    const bp = Number(match[1].replace(/,/g, ""));
    assert.equal(claim.dateConvention, "before_present", `${slug}: a years-ago figure with no convention set`);
    assert.equal(claim.conventionReferenceYear, 1950, `${slug}: years-ago with no 1950 reference`);
    assert.equal(
      claim.startYear,
      1950 - bp,
      `${slug}: "${claim.originalDateText}" — ${bp} years ago is ${1950 - bp}, not ${claim.startYear}`
    );
    const end = /to\s*([\d,]+)\s*years ago/.exec(claim.originalDateText);
    if (end) {
      const endBp = Number(end[1].replace(/,/g, ""));
      assert.equal(claim.endYear, 1950 - endBp, `${slug}: end of ${endBp} years ago should be ${1950 - endBp}`);
    }
    checked++;
  }
  assert.ok(checked >= 2, `only ${checked} before-present figures checked`);
});

test("a claim that places nothing uses a type the database permits", () => {
  // Found the hard way in the first tranche: "before_event" with no year
  // typechecks, passes every vocabulary test, and is then rejected outright by
  // timeline_date_claims_start_or_positionless.
  const POSITIONLESS = new Set(["cyclic", "eternal", "no_beginning", "primordial", "previous_world", "unknown"]);
  let found = 0;
  for (const { slug, claim } of CLAIMS) {
    if (claim.startYear !== undefined) continue;
    found++;
    assert.ok(
      POSITIONLESS.has(claim.temporalClaimType ?? ""),
      `${slug}: no start year with temporalClaimType "${claim.temporalClaimType}" — the database will reject this row`
    );
  }
  assert.equal(found, 2, `expected two positionless claims (the Gigantes' origin and Theseus' missing size), found ${found}`);
});

test("a range never runs backwards, and deep time is not given false precision", () => {
  for (const { slug, claim } of CLAIMS) {
    if (claim.startYear !== undefined && claim.endYear !== undefined) {
      assert.ok(claim.endYear >= claim.startYear, `${slug}: ends before it starts`);
    }
    if (claim.startYear !== undefined && claim.startYear < -100000) {
      assert.ok(
        ["thousand_years", "million_years", "billion_years"].includes(claim.datePrecision),
        `${slug}: ${claim.startYear} with precision "${claim.datePrecision}" claims a year on a deep-time date`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// EVERY CLAIM SAYS WHAT IT IS A DATE FOR
// ---------------------------------------------------------------------------

test("every claim says which question it answers, and the evidence says what it does not establish", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.ok((claim.whatIsDated ?? "").trim().length > 10, `${slug}: whatIsDated missing or thin`);
    assert.match(claim.evidence, /WHAT IS DATED:/, `${slug}: evidence does not say what is dated`);
    assert.match(claim.evidence, /DATING METHOD:/, `${slug}: evidence does not say how`);
    assert.match(
      claim.evidence,
      /WHAT IT DOES NOT ESTABLISH:/,
      `${slug}: evidence does not say what it does NOT establish — the half that stops a date being over-read`
    );
  }
});

test("records carrying several kinds of date give each one a distinct heading", () => {
  // whatIsDated is what groups claims in the detail view. Two claims about
  // different things sharing a heading are stacked as though they were rivals.
  for (const event of GIANTS_GREEK_EVENTS) {
    if (event.claims.length < 2) continue;
    const headings = event.claims.map((claim) => claim.whatIsDated);
    assert.equal(
      new Set(headings).size,
      headings.length,
      `${event.slug}: two claims share a whatIsDated heading`
    );
  }
});

// ---------------------------------------------------------------------------
// ATTRIBUTION: WHO PROPOSED IT, AND WHO MERELY DEFENDS IT
// ---------------------------------------------------------------------------

test("Abel is named as the proposer of the Cyclops hypothesis and Mayor as its defender", () => {
  const description = descriptionOf("polyphemus-cyclopes");
  assert.match(description, /1914/, "the year of the proposal is missing from the description");
  assert.match(description, /Othenio Abel/, "the proposer is not named in the description");
  assert.match(
    description,
    /ABEL PROPOSED IT/,
    "the description does not state plainly who proposed it — which is the error this dataset keeps making elsewhere"
  );
  assert.match(
    description,
    /Mayor is (its|the) best-known modern defender/,
    "Mayor's actual role is not stated"
  );
  const abel = sourceByKey("abel_1914");
  assert.equal(abel.publishedYear, 1914);
  assert.match(
    abel.notes,
    /attributing the idea to her/,
    "the source entry does not warn against crediting the defender with the proposal"
  );
  const claim = claimWhere("polyphemus-cyclopes", /proposed in 1914/);
  assert.equal(claim.sourceKey, "abel_1914", "the 1914 claim is not sourced to Abel");
  assert.equal(claim.startYear, 1914, "a modern proposal should be stored at its own year");
});

test("the Empedocles story is never repeated without saying it has no ancient source", () => {
  // A factoid that survives because everyone copies everyone. Repeating it
  // without the correction is how it survives another generation.
  for (const event of GIANTS_GREEK_EVENTS) {
    const mentions = [event.description, ...event.claims.map((claim) => claim.evidence), ...GIANTS_GREEK_SOURCES.map((s) => s.notes)];
    for (const text of mentions) {
      if (!/Empedocles/.test(text)) continue;
      assert.match(
        text,
        /NO BASIS IN ANY SURVIVING ANCIENT TEXT|has no basis in any surviving ancient record|no ancient source/,
        `a mention of Empedocles does not say the claim is unsourced: ${text.slice(0, 120)}…`
      );
    }
  }
  // And it must be mentioned, because leaving it out silently is the other way
  // to fail: a reader who meets it elsewhere gets no warning.
  assert.match(descriptionOf("polyphemus-cyclopes"), /Empedocles/, "the dead factoid is not addressed at all");
});

test("the dwarf elephant's actual size is stated where the hypothesis is", () => {
  // Without it a reader pictures a mammoth skull. The species the story is
  // usually told with stood about a metre at the shoulder.
  const description = descriptionOf("polyphemus-cyclopes");
  assert.match(description, /Palaeoloxodon falconeri/, "the species is not named");
  assert.match(description, /96 cm|96\.5 cm|about a metre|one metre/, "the animal's size is not stated beside the hypothesis");
  assert.match(description, /not an eye/, "the description does not say what the hole in the skull actually is");
});

test("Homer's Cyclopes and Hesiod's are kept apart", () => {
  const description = descriptionOf("polyphemus-cyclopes");
  assert.match(description, /Brontes/, "Hesiod's named Cyclopes are missing");
  assert.match(description, /TWO TRADITIONS, ONE WORD/, "the distinction is not made prominently");
  const hesiodClaim = claimWhere("polyphemus-cyclopes", /Brontes/);
  assert.match(
    hesiodClaim.whatIsDated ?? "",
    /OTHER tradition/,
    "the second tradition has no claim of its own saying what it is"
  );
});

// ---------------------------------------------------------------------------
// THE REFUSAL: A FAVOURITE EXPLANATION DOES NOT GET APPLIED EVERYWHERE
// ---------------------------------------------------------------------------

test("the fossil explanation is NOT linked to the find that argues against it", () => {
  // Skyros came with a bronze spear and a sword, which a fossil bed does not
  // supply. An edge here would be the dataset preferring its own explanation to
  // its own evidence.
  const edge = GIANTS_GREEK_LINKS.find(
    (link) =>
      (link.from === GIANTS_GREEK_ANCHOR_SLUG && link.to === "theseus-bones-skyros") ||
      (link.from === "theseus-bones-skyros" && link.to === GIANTS_GREEK_ANCHOR_SLUG)
  );
  assert.equal(edge, undefined, "the Skyros bones are linked to the fossil beds despite the grave goods");
  assert.match(
    descriptionOf("theseus-bones-skyros"),
    /a fossil deposit does not supply a bronze spear|fossil bed does not supply/i,
    "the record does not say why the fossil explanation is withheld"
  );
  // And the two it DOES fit are linked, so the refusal is a judgement rather
  // than an omission.
  for (const slug of ["orestes-bones-tegea", "antaeus-bones-tingis"]) {
    assert.ok(
      GIANTS_GREEK_LINKS.some((link) => link.from === GIANTS_GREEK_ANCHOR_SLUG && link.to === slug),
      `${slug} is not linked to the fossil record`
    );
  }
});

test("no size is ever invented for the Skyros skeleton", () => {
  // Plutarch gives none. A figure here would be quoted forever.
  const event = byslug("theseus-bones-skyros");
  const everything = [event.summary, event.description, ...event.claims.map((c) => `${c.evidence} ${c.notes ?? ""} ${c.originalDateText}`)].join("\n");
  assert.ok(!/cubit/i.test(everything), "a cubit figure has appeared on a record whose source gives no measurement");
  assert.match(event.description, /NO MEASUREMENT/, "the description does not say the measurement is missing");
  const missing = claimWhere("theseus-bones-skyros", /no measurement given/);
  assert.equal(missing.startYear, undefined, "the missing-size claim has acquired a year");
  assert.match(missing.whatIsDated ?? "", /no figure/, "the missing-size claim does not say the figure is absent");
});

test("the two bone-finds that report a measurement both carry it as its own claim", () => {
  for (const [slug, match] of [
    ["orestes-bones-tegea", /seven cubits/],
    ["antaeus-bones-tingis", /sixty cubits/],
  ] as const) {
    const claim = claimWhere(slug, match);
    assert.match(
      claim.whatIsDated ?? "",
      /length|long/i,
      `${slug}: the measurement claim does not say it is a length rather than a date`
    );
    assert.match(claim.evidence, /WHAT IS DATED: nothing/, `${slug}: a length claim that does not say it dates nothing`);
  }
});

// ---------------------------------------------------------------------------
// THE CONTENT THAT MAKES THESE RECORDS WORTH HAVING
// ---------------------------------------------------------------------------

test("the blacksmith's own scepticism is in the Tegea record", () => {
  // The single best thing in this tranche: a man in the sixth century BCE who
  // did not believe a claim, so opened the box and measured. Losing it would
  // leave a credulous-ancients story, which is not what the source says.
  const description = descriptionOf("orestes-bones-tegea");
  assert.match(description, /did not believe/, "the blacksmith's disbelief is gone");
  assert.match(description, /MEASURED THE BODY|measured the body/, "the act of measuring is gone");
  const doubt = description.indexOf("did not believe");
  const figure = description.indexOf("WHAT SEVEN CUBITS IS");
  assert.ok(doubt > -1 && figure > -1, "one of the two passages is missing, so the ordering cannot be checked");
  assert.ok(doubt < figure, "the disbelief should be stated before the interpretation of the figure");
});

test("Sertorius' doubt is stated before the wonder he reported", () => {
  const description = descriptionOf("antaeus-bones-tingis");
  const doubt = description.indexOf("DID NOT BELIEVE");
  const figure = description.indexOf("SIXTY CUBITS IS ABOUT 27 METRES");
  assert.ok(doubt > -1, "Sertorius' doubt is not in the record");
  assert.ok(figure > -1, "the figure is not discussed");
  assert.ok(doubt < figure, "the record leads with the wonder rather than with the general's doubt");
});

test("the scaling argument in the Antaeus record is arithmetically right", () => {
  // Not a word-match: the numbers are recomputed. A record that explains why a
  // 27 m person cannot stand up has to get the explanation right, or it is
  // teaching a wrong reason for a right conclusion.
  const factor = 27 / 1.8;
  assert.equal(Math.round(factor), 15);
  const mass = Math.round(factor ** 3);
  const area = Math.round(factor ** 2);
  assert.equal(mass, 3375, "the cube of the scale factor is not what the record claims");
  assert.equal(area, 225, "the square of the scale factor is not what the record claims");
  const claim = claimWhere("antaeus-bones-tingis", /sixty cubits/);
  // CHECKED IN EACH PLACE SEPARATELY. The figures are stated twice — once in the
  // description and once in the claim's notes — and a guard that searched the
  // two joined together passed a version with one of them wrong. That is the
  // same loose-guard failure as the whole-record searches noted at the top of
  // this file, and it got committed once more before this test was tightened.
  for (const [where, text] of [
    ["description", byslug("antaeus-bones-tingis").description],
    ["claim notes", claim.notes ?? ""],
  ] as const) {
    assert.match(text, /3,400|3,375/, `${where}: the mass factor is missing or restated as something else`);
    assert.match(text, /225/, `${where}: the bone cross-section factor is missing`);
  }
  assert.match(claim.notes ?? "", /cube|15³/, "the claim does not say why mass grows faster than bone");
  assert.match(
    byslug("antaeus-bones-tingis").description,
    /NOT A STATEMENT ABOUT WHAT WAS IN THE MOUND/,
    "the physics is allowed to read as a finding about the find"
  );
});

test("the Gigantes record says the earliest sources give no height", () => {
  const description = descriptionOf("gigantes-gigantomachy");
  assert.match(description, /NO HEIGHT, NO MEASUREMENT AND NO DATE/, "the central negative fact is missing");
  assert.match(description, /man-sized hoplites/, "the Archaic iconography is missing");
  assert.match(
    description,
    /THE MONSTROUS GIANT IS THE END OF THIS TRADITION, NOT ITS BEGINNING/,
    "the record does not state what the iconography means"
  );
  // And it must not overclaim the Greek: "great" may or may not mean big.
  assert.match(
    description,
    /Whether 'great' means physically big or merely mighty is a real question/,
    "the record settles a question the scholarship leaves open"
  );
});

test("the fossil record keeps its own age apart from the age of any report", () => {
  const description = descriptionOf(GIANTS_GREEK_ANCHOR_SLUG);
  assert.match(
    description,
    /THE AGE OF THESE FOSSILS IS NOT THE AGE OF ANYTHING ANYBODY REPORTED/,
    "the critical distinction is missing from the anchor record"
  );
  assert.match(description, /seven million years before Herodotus/, "the size of the gap is not stated");
  assert.match(
    description,
    /IT CANNOT identify any particular find/,
    "the record does not say what the explanation cannot do"
  );
});

test("Mayor's argument is stored at the ancient find on the finds, and at its own year on the book", () => {
  // A documented decision, so it is worth a test: the same argument appears
  // twice in two roles, and the distinction is the point.
  for (const slug of ["orestes-bones-tegea", "antaeus-bones-tingis"]) {
    const claim = byslug(slug).claims.find((c) => c.sourceKey === "mayor_2000");
    assert.ok(claim, `${slug}: no claim carrying Mayor's proposal`);
    assert.ok((claim!.startYear ?? 0) < 0, `${slug}: the proposal should sit at the ancient find it is about`);
    assert.match(claim!.notes ?? "", /Stored at the ancient/, `${slug}: the choice of position is not explained`);
  }
  const book = byslug(GIANTS_GREEK_ANCHOR_SLUG).claims.find((c) => c.sourceKey === "mayor_2000");
  assert.ok(book, "the anchor record does not carry Mayor's argument");
  assert.equal(book!.startYear, 2000, "on the anchor record the date should be the publication");
});

test("the Septuagint link reaches the first tranche and says what kind of link it is", () => {
  const link = GIANTS_GREEK_LINKS.find((edge) => edge.to === "nephilim-genesis");
  assert.ok(link, "the gigantes/nephilim connection is missing");
  assert.equal(link!.relation, "associated", "the relation overstates the connection");
  assert.match(
    link!.note,
    /NOT a finding that the two traditions describe the same beings/,
    "the edge does not guard against being read as an identification"
  );
});

// ---------------------------------------------------------------------------
// WHAT THIS DATASET MUST NEVER SAY
// ---------------------------------------------------------------------------

test("no confidence scores, ratings or verdicts anywhere", () => {
  const banned = /\b(confidence (score|level|rating)|credibility score|truth score|reliability score|\d+% (reliable|certain|likely true)|rated (strong|weak))\b/i;
  for (const event of GIANTS_GREEK_EVENTS) {
    const everything = [event.summary, event.description, event.eventTypeNote ?? "",
      ...event.claims.map((claim) => `${claim.evidence} ${claim.notes ?? ""}`)].join("\n");
    assert.ok(!banned.test(everything), `${event.slug}: scoring language`);
  }
  for (const source of GIANTS_GREEK_SOURCES) {
    assert.ok(!banned.test(source.notes), `${source.key}: scoring language`);
  }
});

test("nothing asserts that giants existed, and nothing claims a myth disproves them", () => {
  const existed = /\bgiants (existed|were real)\b/i;
  const disproved = /\b(proves|shows) (that )?giants (never existed|were not real)\b/i;
  for (const event of GIANTS_GREEK_EVENTS) {
    const everything = [event.summary, event.description, event.eventTypeNote ?? "",
      ...event.claims.map((claim) => `${claim.evidence} ${claim.notes ?? ""}`)].join("\n");
    assert.ok(!existed.test(everything), `${event.slug}: asserts giants existed`);
    assert.ok(!disproved.test(everything), `${event.slug}: claims something disproves giants`);
  }
});

test("absence of evidence is distinguished from proof of absence where it is relied on", () => {
  // The fossil records are where this is tempting, because they have a real
  // mechanism and no confirmation.
  const anchor = descriptionOf(GIANTS_GREEK_ANCHOR_SLUG);
  assert.match(anchor, /cannot identify any particular find/i, "the anchor record overstates what it can do");
  const cyclopes = descriptionOf("polyphemus-cyclopes");
  assert.match(
    cyclopes,
    /says nothing about whether ancient people ever misread fossil bones/i,
    "the Cyclops record lets a refuted proposal read as a refuted subject"
  );
});

test("every record answers what kind of record it is, in its opening block", () => {
  // Checked against the OPENING of the description, not the whole of it: the
  // first tranche had a guard that passed a record whose opening had been
  // stripped because the words survived further down.
  for (const event of GIANTS_GREEK_EVENTS) {
    const opening = event.description.split("\n\n")[0];
    assert.match(opening, /WHAT KIND OF RECORD IS THIS\?/, `${event.slug}: opening block does not say what kind of record it is`);
    assert.match(
      opening,
      /Physical remains|Physical evidence/,
      `${event.slug}: opening block does not say what physical evidence exists`
    );
  }
});

test("every record ends by asking the reader questions rather than giving them a conclusion", () => {
  for (const event of GIANTS_GREEK_EVENTS) {
    assert.match(event.description, /THINGS TO ASK:/, `${event.slug}: no questions for the reader`);
    const asks = event.description.slice(event.description.indexOf("THINGS TO ASK:"));
    assert.ok((asks.match(/\?/g) ?? []).length >= 3, `${event.slug}: fewer than three questions`);
  }
});

// ---------------------------------------------------------------------------
// UNVERIFIED THINGS ARE FLAGGED, AND THE FLAGS NAME THEIR CLAIM
// ---------------------------------------------------------------------------

test("the two things that could not be verified are flagged on the claims that carry them", () => {
  // Counting flags was a bug last time: removing one left the total above the
  // threshold. These name the specific claims instead.
  const iconography = claimWhere("gigantes-gigantomachy", /serpent-legged/);
  assert.match(
    iconography.evidence,
    /NEEDS SOURCE VERIFICATION/,
    "the about-380-BCE threshold is quoted as though it had been checked"
  );
  const abel = claimWhere("polyphemus-cyclopes", /proposed in 1914/);
  assert.match(
    abel.notes ?? "",
    /NEEDS SOURCE VERIFICATION/,
    "Abel's publication is treated as verified when only the proposal and year are"
  );
  // And the source entry must not invent a title to paper over it.
  assert.match(
    sourceByKey("abel_1914").notes,
    /DESCRIBES THE PROPOSAL RATHER THAN NAMING A PUBLICATION/,
    "the Abel source does not say why it has no real title"
  );
});

test("no source carries a reference that looks like a citation but points nowhere", () => {
  for (const source of GIANTS_GREEK_SOURCES) {
    if (source.url) {
      assert.match(source.url, /^https:\/\//, `${source.key}: url is not https`);
    }
    const doi = /doi:(\S+)/.exec(source.reference ?? "");
    if (doi) {
      assert.ok(source.url, `${source.key}: quotes a DOI but gives no url`);
      assert.ok(
        source.url!.includes(doi[1]),
        `${source.key}: the DOI in the reference does not appear in the url — one of them is wrong`
      );
    }
  }
  // The two sources whose authorship could not be confirmed must say so rather
  // than carrying an invented author.
  for (const key of ["proboscidea_greece", "abel_1914"]) {
    const source = sourceByKey(key);
    assert.match(source.notes, /could not be (verified|confirmed) from here/, `${key}: an unverified detail is not flagged`);
  }
  assert.equal(sourceByKey("proboscidea_greece").author, undefined, "an author has been supplied for a chapter whose authorship was not confirmed");
});

test("the ancient texts are cited by passage, not as whole works", () => {
  for (const key of ["hesiod_theogony", "apollodorus", "homer_odyssey", "herodotus_orestes", "plutarch_theseus", "plutarch_sertorius"]) {
    const source = sourceByKey(key);
    assert.equal(source.sourceType, "primary", `${key}: an ancient text should be a primary source`);
    assert.ok((source.reference ?? "").length > 0, `${key}: no passage given, so nobody can check it`);
  }
});

test("the bone-find records all say the remains are lost", () => {
  // The honest centre of this tranche: a good explanation and nothing left to
  // test it against. A record that omits this reads as though the case were
  // open to investigation.
  // IN THE OPENING BLOCK, not anywhere in the description. Each of these records
  // states it twice, so a regex over the whole description passed even with the
  // statement removed from the body — it was matching the opening. Pinning the
  // guard to one location is what makes it mean something.
  for (const slug of BONE_FINDS) {
    const opening = byslug(slug).description.split("\n\n")[0];
    assert.match(
      opening,
      /lost|gone|reburied|never examined again/i,
      `${slug}: the opening block does not say the remains cannot now be examined`
    );
  }
});
