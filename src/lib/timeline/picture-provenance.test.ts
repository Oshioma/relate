import { test } from "node:test";
import assert from "node:assert/strict";

import {
  MEDIA_KINDS,
  PROVENANCE_STATUSES,
  mediaKindIsFabricatedSubject,
  mediaKindIsIllustration,
  mediaKindIsPhotograph,
  mediaKindNeedsWarning,
  provenanceNeedsWarning,
  provenanceStatusHint,
  provenanceStatusLabel,
} from "./taxonomy";
import { resolveCredits } from "./bring-in-image";
import type { SeedPicture } from "./seed-types";

// ---------------------------------------------------------------------------
// HOW MUCH OF A PICTURE'S PROVENANCE ANYONE HAS ACTUALLY CHECKED
//
// Every other field on a picture says what its provenance IS. The status says
// who says so — and it is the field most likely to be quietly wrong, because
// "we were told this" and "we looked" render identically unless something
// keeps them apart.
//
// None of this is a scale. "as_supplied" is not a worse "verified"; it is a
// different account of where the information came from.
// ---------------------------------------------------------------------------

test("every provenance status says what it means", () => {
  for (const status of PROVENANCE_STATUSES) {
    assert.ok(provenanceStatusLabel(status.key), `${status.key} needs a label`);
    assert.ok(provenanceStatusHint(status.key).length > 20, `${status.key} needs a hint worth reading`);
  }
});

test("a provenance status carries no number, because it is not a score", () => {
  // The whole timeline refuses confidence scores, and a five-point vocabulary
  // is the most tempting place to smuggle one back in as a percentage. The
  // database enforces the same rule on measurement claims; this is the same
  // rule applied to the words a reader actually sees.
  for (const status of PROVENANCE_STATUSES) {
    const text = `${status.label} ${status.hint}`;
    assert.ok(!/\d+\s*%/.test(text), `${status.key} must not express itself as a percentage`);
    assert.ok(
      !/confidence (score|level|rating)/i.test(text),
      `${status.key} must not describe itself as a confidence score`
    );
  }
});

test("only the two statuses that are actually a problem warn", () => {
  // WHAT IS DELIBERATELY NOT HERE, and why each:
  //
  //   as_supplied      - somebody read the file page and passed on what it
  //                      said. Ordinary good information with its origin
  //                      recorded. Not a defect.
  //   resolved_at_seed - read from the file's own page at the moment of
  //                      import, which is better than anything typed by hand.
  //                      It is the option to PREFER, so warning about it would
  //                      be actively backwards.
  //
  // Warning about those two would train a reader to scroll past the warning,
  // and then the two that matter stop working.
  const WARNS = new Set(["unverified", "contested"]);
  for (const status of PROVENANCE_STATUSES) {
    assert.equal(
      provenanceNeedsWarning(status.key),
      WARNS.has(status.key),
      `${status.key} is on the wrong side of the warning line`
    );
  }
  // The exhaustive loop above is the point: a status added without deciding
  // which side it falls on fails here rather than shipping unmarked.
  assert.equal(PROVENANCE_STATUSES.length, 5);
});

test("an unset provenance status does not warn, which is not the same as being checked", () => {
  // PINNING CURRENT BEHAVIOUR, AND NAMING WHAT IT COSTS.
  //
  // A picture with no provenanceStatus at all is silent, and silence here
  // produces no warning. That is the opposite of the rule the two booleans
  // beside it follow — depictsActualRemains and verifiedIdentity default to
  // false precisely because a picture has to EARN them and silence never
  // grants anything.
  //
  // It is pinned rather than changed because every picture seeded before this
  // vocabulary existed has no status, and making absence warn would put a
  // notice under all of them at once — which is the same crying-wolf failure
  // the test above guards against, arrived at from the other direction.
  //
  // The real fix is to give the existing pictures a status, not to reinterpret
  // silence. Until then this test says out loud that "no warning" here means
  // "nobody has said", not "this has been checked".
  assert.equal(provenanceNeedsWarning(undefined), false);
  assert.equal(provenanceNeedsWarning(null), false);
  assert.equal(provenanceNeedsWarning(""), false);
  assert.equal(provenanceStatusLabel(undefined), null);
  // An invented key is equally silent, and equally must not read as verified.
  assert.equal(provenanceStatusLabel("mostly_checked"), null);
  assert.equal(provenanceNeedsWarning("mostly_checked"), false);
});

// ---------------------------------------------------------------------------
// WHAT KIND OF THING A PICTURE PHYSICALLY IS
//
// Predicates rather than stored booleans, and that is the whole design. A
// stored is_photograph can disagree with `shows`, and then one picture has two
// answers to one question and no way to tell which is the lie.
// ---------------------------------------------------------------------------

test("a picture is not both exposed to light and drawn by hand", () => {
  for (const kind of MEDIA_KINDS) {
    assert.ok(
      !(mediaKindIsPhotograph(kind.key) && mediaKindIsIllustration(kind.key)),
      `${kind.key} cannot be both a photograph and an illustration`
    );
  }
});

test("every media kind is sorted into photograph, illustration, or neither on purpose", () => {
  // Written out in full so that adding a kind forces the decision here rather
  // than letting it default to "neither" unnoticed.
  const PHOTOGRAPHS = new Set([
    "evidence_photograph",
    "human_remains",
    "museum_specimen",
    "excavation_context",
    "hoax_object",
    "artefact",
    "site",
    "personal_artefact",
  ]);
  const ILLUSTRATIONS = new Set([
    "engraving",
    "later_artwork",
    "reconstruction",
    "diagram",
    "comparison_chart",
    "map",
  ]);
  // NEITHER, and each for its own reason:
  //
  //   manuscript / historical_document - very often literally photographs, and
  //       deliberately not filed as one, because the question these kinds exist
  //       to answer is what the picture is evidence OF. A scan of a show bill
  //       is a photograph of a piece of paper; treating it as a photograph of
  //       the thing the bill describes is the exact error the vocabulary is
  //       for. This boundary is the most arguable one in the list and is
  //       pinned here so that moving it has to be a decision.
  //   scientific_figure - a chart that may be a photograph, a plot, or both.
  //   portrait          - may be a painting or a photograph; the kind does not
  //                       say, and guessing would be inventing a fact.
  //   replica           - a photograph of a cast is a photograph, but the point
  //                       of the kind is that the SUBJECT is not the thing.
  //   unverified_image / known_manipulation - the medium is unknown or beside
  //                       the point; both already warn on their own account.
  const NEITHER = new Set([
    "manuscript",
    "historical_document",
    "scientific_figure",
    "portrait",
    "replica",
    "unverified_image",
    "known_manipulation",
  ]);

  for (const kind of MEDIA_KINDS) {
    const buckets = [
      PHOTOGRAPHS.has(kind.key) && "photograph",
      ILLUSTRATIONS.has(kind.key) && "illustration",
      NEITHER.has(kind.key) && "neither",
    ].filter(Boolean);
    assert.equal(buckets.length, 1, `${kind.key} must be listed in exactly one bucket, got ${buckets.length}`);
    assert.equal(mediaKindIsPhotograph(kind.key), PHOTOGRAPHS.has(kind.key), `${kind.key} photograph`);
    assert.equal(mediaKindIsIllustration(kind.key), ILLUSTRATIONS.has(kind.key), `${kind.key} illustration`);
  }
  assert.equal(PHOTOGRAPHS.size + ILLUSTRATIONS.size + NEITHER.size, MEDIA_KINDS.length);
});

test("a fabricated subject is a real photograph of a thing that is not what it looks like", () => {
  // The case this exists for: a photograph of a carving made to be taken for a
  // body. It is genuinely a photograph AND its subject is manufactured, and a
  // schema forcing a choice between those would delete the fact that makes the
  // case worth keeping. So the invariant is containment, not exclusivity.
  const fabricated = MEDIA_KINDS.filter((kind) => mediaKindIsFabricatedSubject(kind.key));
  assert.ok(fabricated.length > 0, "something must be classified as a fabricated subject");
  for (const kind of fabricated) {
    assert.equal(mediaKindIsPhotograph(kind.key), true, `${kind.key} should still be a photograph`);
    // And it must never sit silently in a gallery beside real evidence.
    assert.equal(mediaKindNeedsWarning(kind.key), true, `${kind.key} must warn`);
  }
  assert.equal(mediaKindIsFabricatedSubject("evidence_photograph"), false);
  assert.equal(mediaKindIsFabricatedSubject(undefined), false);
});

// ---------------------------------------------------------------------------
// THE FIELDS HAVE TO SURVIVE THE JOURNEY
//
// A seed writes provenance; bringEventPicturesIn copies the bytes and spreads
// the rest into the jsonb column. A spread carries whatever it is handed, so
// for months `shows` was carried through while the type at the other end said
// it did not exist — set by every seed, defended by nothing.
//
// SeedPicture is now the single type at both ends, and this is the test that
// says so at runtime rather than only in the type checker.
// ---------------------------------------------------------------------------

function commonsStub(extmetadata: Record<string, { value: string }>) {
  return (async () =>
    ({
      ok: true,
      json: async () => ({ query: { pages: { "1": { imageinfo: [{ extmetadata }] } } } }),
    }) as unknown as Response) as unknown as typeof fetch;
}

test("every provenance field a seed writes survives the trip to storage", async () => {
  // THREE DATES, NEVER ONE — an etching made in 1804, scanned in this century,
  // uploaded later still. Collapsing them is how a modern scan of a Georgian
  // print becomes a Georgian photograph.
  const written: SeedPicture = {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/An_etching.jpg?width=1200",
    caption: "An etching of a man, printed from life",
    kind: "image",
    shows: "engraving",
    fileName: "An_etching.jpg",
    originalFileUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/An_etching.jpg",
    originalSourceUrl: "https://www.britishmuseum.org/collection/object/P_1874-0808-1",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:An_etching.jpg",
    institution: "The British Museum",
    creator: "An engraver",
    objectDate: "1804",
    photographDate: "2011",
    uploadDate: "2014-03-02",
    rightsNotes: "Commons marks the scan public domain; the museum's own record asserts CC BY-NC-SA.",
    subject: "A man who died before photography existed",
    pixelWidth: 2400,
    pixelHeight: 3600,
    accessionNumber: "P,1.74",
    duplicateOf: undefined,
    provenanceStatus: "contested",
    provenanceNotes: "Two rights statements disagree; the more conservative one is applied.",
    identificationStatus: "probable",
    depictsActualRemains: false,
    verifiedIdentity: false,
    creditFrom: "source",
  };

  const { media, dropped } = await resolveCredits(
    { imageUrl: null, media: [written] },
    commonsStub({ Artist: { value: "An engraver" }, LicenseShortName: { value: "Public domain" } })
  );

  assert.equal(dropped.length, 0);
  assert.equal(media.length, 1);
  const carried = media[0];

  // Everything comes out exactly as it went in, with two deliberate exceptions.
  //
  //   credit     - the one field resolveCredits is allowed to WRITE, read from
  //                the file's own page at the moment of import rather than
  //                typed into a seed file months earlier. It goes into its own
  //                field, never into the caption, which is also the alt text.
  //   creditFrom - an instruction TO this function, not a fact about the
  //                picture, so it is consumed here and never stored.
  for (const [key, value] of Object.entries(written)) {
    if (value === undefined || key === "creditFrom") continue;
    assert.deepEqual(
      carried[key as keyof SeedPicture],
      value,
      `${key} must survive the trip to storage unchanged`
    );
  }
  assert.ok(carried.credit, "the credit is resolved from the file's own page at seed time");
  assert.equal(carried.caption, written.caption, "the caption is not where a licence goes");
  assert.equal(carried.creditFrom, undefined, "creditFrom is an instruction, not something to store");

  // The three dates are still three dates.
  assert.notEqual(carried.objectDate, carried.photographDate);
  assert.notEqual(carried.photographDate, carried.uploadDate);
});
