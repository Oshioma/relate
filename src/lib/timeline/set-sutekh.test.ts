import { test } from "node:test";
import assert from "node:assert/strict";

import {
  SET_SUTEKH_ANCHOR_SLUG,
  SET_SUTEKH_EVENTS,
  SET_SUTEKH_SOURCES,
} from "./set-sutekh-seed";
import {
  IDENTIFICATION_STATUSES,
  TIMELINE_CATEGORIES,
  TIMELINE_EVENT_TYPES,
  TEMPORAL_CLAIM_TYPES,
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  temporalTypeIsPositioned,
} from "./taxonomy";
import { DATE_UNITS } from "./time";

const byslug = new Map(SET_SUTEKH_EVENTS.map((e) => [e.slug, e]));
const record = (slug: string) => {
  const found = byslug.get(slug);
  assert.ok(found, `missing record: ${slug}`);
  return found;
};

// ---------------------------------------------------------------------------
// THE RULE THE DATASET IS BUILT ON
//
// Two questions, kept apart: when is this from, and why do we think it is Set?
// The second is identificationStatus, and it is not a confidence score. These
// tests exist because the easiest way to ruin this dataset is to let the
// answer to the first question quietly stand in for the answer to the second.
// ---------------------------------------------------------------------------

test("the predynastic material is never given a secure identification", () => {
  const early = record("predynastic-possible-set-animals");
  assert.notEqual(
    early.identificationStatus,
    "secure",
    "a strange quadruped on a Naqada sherd is not securely a Set animal, and saying so is the whole point"
  );
  assert.match(early.identificationStatus ?? "", /possible|disputed/);
});

test("Peribsen IS secure, and for a stated reason that is not resemblance", () => {
  const anchor = record(SET_SUTEKH_ANCHOR_SLUG);
  assert.equal(anchor.identificationStatus, "secure");
  assert.match(anchor.description, /serekh/i);
  const identification = anchor.claims.find((c) => /Whether the animal/i.test(c.whatIsDated ?? ""));
  assert.ok(identification, "the identification is a claim of its own, separate from the reign's date");
  assert.match(
    identification.evidence,
    /POSITION AND WRITING/,
    "the security of this identification rests on where the animal stands, not on what it looks like"
  );
  // The reverse of the usual situation in this dataset: the identification is
  // firmer than the date. Both are recorded, neither borrows from the other.
  const reign = anchor.claims.find((c) => /reign/i.test(c.whatIsDated ?? ""));
  assert.ok(reign?.isApproximate, "Early Dynastic absolute chronology is not firm and must not pretend to be");
});

test("the species of the Set animal is recorded as unresolved", () => {
  const species = record("set-animal-species-unidentified");
  assert.equal(species.identificationStatus, "disputed");
  // If nobody can say what the animal IS, an identification by resemblance
  // rests on a resemblance to something undefined. The record has to say so,
  // because it is what licenses the caution on every early record above.
  assert.match(species.description, /resemblance/i);
});

test("Set is never called the Egyptian Satan in this dataset's own voice", () => {
  for (const event of SET_SUTEKH_EVENTS) {
    const text = `${event.title}\n${event.summary}\n${event.description}`;
    for (const match of text.matchAll(/Egyptian Satan/gi)) {
      const window = text.slice(Math.max(0, match.index - 400), match.index + 200);
      assert.match(
        window,
        /cannot|not\b|refus|myth|wrong|popular|descend/i,
        `${event.slug} uses "Egyptian Satan" without disowning it`
      );
    }
  }
});

test("the protective Set is in the dataset, because leaving him out is the distortion", () => {
  const apep = record("set-spears-apep");
  assert.match(apep.summary, /sun/i);
  assert.match(apep.description, /Apep|Apophis/);
  assert.ok(apep.tags.includes("protective"));
});

test("no record gives a date for when Set became evil", () => {
  const decline = record("late-period-persecution-of-set");
  const claim = decline.claims[0];
  // A seven-century range looks imprecise and is in fact the shape of the
  // evidence. What must never appear is a year, a reign or a decree.
  assert.equal(claim.temporalClaimType, "estimated_range");
  assert.ok((claim.endYear ?? 0) - (claim.startYear ?? 0) > 300, "the range must stay as wide as the evidence");
  assert.match(claim.evidence, /not a decision|not a decree|accumulation/i);
});

test("the Hyksos explanation is held as a proposal, with its counter-evidence attached", () => {
  const hyksos = record("hyksos-avaris-sutekh");
  const proposal = hyksos.claims.find((c) => /demonisation/i.test(c.whatIsDated ?? ""));
  assert.ok(proposal, "the causal proposal must be a claim of its own, not a sentence in the prose");
  assert.equal(
    temporalTypeIsPositioned(proposal.temporalClaimType),
    false,
    "an explanation is not a moment and must not be given a position on the timeline"
  );
  assert.match(proposal.evidence, /Nineteenth Dynasty/, "the chronological objection has to travel with it");
});

test("the 400-Year Stela keeps its two dates apart", () => {
  const stela = record("four-hundred-year-stela");
  assert.equal(stela.claims.length, 2, "one for when it was made, one for what it counts back to");
  const made = stela.claims.find((c) => /made/i.test(c.whatIsDated ?? ""));
  const era = stela.claims.find((c) => /counted from/i.test(c.whatIsDated ?? ""));
  assert.ok(made?.startYear, "the manufacture date is the securer one and is entered");
  assert.equal(era?.startYear, undefined, "subtracting four hundred would assert the disputed part");
  assert.equal(temporalTypeIsPositioned(era?.temporalClaimType), false);
});

test("Plutarch is filed as evidence about Plutarch", () => {
  const plutarch = SET_SUTEKH_SOURCES.find((s) => s.key === "plutarch_isis_osiris");
  assert.ok(plutarch);
  assert.match(plutarch.notes, /RECEPTION|never as a description/i);
});

test("the gap between the ancient cult and the modern revivals has its own record", () => {
  const gap = record("documentary-gap-set");
  assert.ok(gap, "without this record the gap can be closed by silence");
  const modern = record("temple-of-set-1975");
  // The documented civil fact and the religious claim are separate claims on
  // the same record. A timeline that adjudicated the second would be doing
  // theology in one direction or the other.
  assert.ok(modern.claims.length >= 2);
  assert.ok(modern.claims.some((c) => c.chronology === "religious"));
  assert.ok(modern.claims.some((c) => c.chronology === "conventional"));
});

test("modern material is labelled modern in the title, not only in the small print", () => {
  const pop = record("set-in-modern-popular-culture");
  assert.match(pop.title, /^MODERN:/);
  assert.equal(pop.identificationStatus, "modern_interpretation");
});

// ---------------------------------------------------------------------------
// PICTURES
//
// The live example this dataset was built around: a widely reused file titled
// "Horus spearing Set" is a modern artwork made in 2025, while a file showing
// Set spearing Apep reproduces a Twenty-first Dynasty scene. Image search
// presents them identically.
// ---------------------------------------------------------------------------

test("the 2025 artwork is labelled as one, and the ancient scene is not lumped in with it", () => {
  const edfu = record("horus-spears-set-edfu");
  const modernPicture = edfu.media?.find((m) => /Horus_spearing_set/i.test(m.url));
  assert.ok(modernPicture, "the cautionary picture must actually be present to be a caution");
  assert.equal(modernPicture.identificationStatus, "modern_interpretation");
  assert.equal(modernPicture.shows, "later_artwork");
  assert.match(modernPicture.imageDate ?? "", /2025/);

  const apep = record("set-spears-apep").media?.[0];
  assert.ok(apep);
  assert.equal(apep.shows, "manuscript");
  assert.match(apep.imageDate ?? "", /Twenty-first Dynasty/);
});

test("every picture carries a file page, and never only a file URL", () => {
  for (const event of SET_SUTEKH_EVENTS) {
    for (const media of event.media ?? []) {
      assert.ok(media.sourcePageUrl, `${event.slug}: a picture with no source page has no provenance`);
      assert.notEqual(
        media.sourcePageUrl,
        media.url,
        `${event.slug}: the file page is where the licence and creator live; the file URL is a place a JPEG lives`
      );
    }
  }
});

test("no picture claims to show remains, because none of them does", () => {
  for (const event of SET_SUTEKH_EVENTS) {
    for (const media of event.media ?? []) {
      assert.notEqual(media.depictsActualRemains, true, `${event.slug}: this dataset has no human remains in it`);
    }
  }
});

// ---------------------------------------------------------------------------
// VOCABULARY AND SHAPE
// ---------------------------------------------------------------------------

const keys = (list: readonly { key: string }[]) => new Set(list.map((x) => x.key));

test("every key used comes from the shared vocabularies", () => {
  const categories = keys(TIMELINE_CATEGORIES);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const identifications = keys(IDENTIFICATION_STATUSES);
  const temporal = keys(TEMPORAL_CLAIM_TYPES);
  const methods = keys(DATING_METHODS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const units = keys(DATE_UNITS);

  for (const event of SET_SUTEKH_EVENTS) {
    assert.ok(categories.has(event.category), `${event.slug}: category ${event.category}`);
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: eventType ${event.eventType}`);
    if (event.identificationStatus) {
      assert.ok(identifications.has(event.identificationStatus), `${event.slug}: ${event.identificationStatus}`);
    }
    for (const claim of event.claims) {
      assert.ok(temporal.has(claim.temporalClaimType ?? ""), `${event.slug}: ${claim.temporalClaimType}`);
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: ${claim.datingMethod}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: ${claim.chronology}`);
      assert.ok(units.has(claim.datePrecision), `${event.slug}: ${claim.datePrecision}`);
    }
  }
});

test("a positionless claim carries no year, and a positioned one does", () => {
  for (const event of SET_SUTEKH_EVENTS) {
    for (const claim of event.claims) {
      if (temporalTypeIsPositioned(claim.temporalClaimType)) {
        assert.ok(
          claim.startYear !== undefined,
          `${event.slug}: "${claim.originalDateText}" claims a position with no year`
        );
      } else {
        assert.equal(
          claim.startYear,
          undefined,
          `${event.slug}: "${claim.originalDateText}" is positionless and must not carry a year`
        );
      }
    }
  }
});

test("every claim names a source that exists, or honestly names none", () => {
  const sourceKeys = new Set(SET_SUTEKH_SOURCES.map((s) => s.key));
  for (const event of SET_SUTEKH_EVENTS) {
    for (const claim of event.claims) {
      if (claim.sourceKey !== null) {
        assert.ok(sourceKeys.has(claim.sourceKey), `${event.slug}: unknown source ${claim.sourceKey}`);
      }
    }
  }
});

test("slugs are unique and every record has at least one claim", () => {
  assert.equal(byslug.size, SET_SUTEKH_EVENTS.length, "a duplicate slug would silently overwrite a record");
  for (const event of SET_SUTEKH_EVENTS) {
    assert.ok(event.claims.length > 0, `${event.slug} has no claims`);
    for (const claim of event.claims) {
      assert.ok(claim.evidence.length > 40, `${event.slug}: "why this date?" is not optional`);
    }
  }
});

test("originalDateText is unique within its record", () => {
  // The seeder matches claims back to their citations by this text. Two claims
  // sharing one would attach the wrong citations to the wrong claim.
  for (const event of SET_SUTEKH_EVENTS) {
    const texts = event.claims.map((c) => c.originalDateText);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: duplicate originalDateText`);
  }
});

test("nothing in this dataset carries a confidence score", () => {
  for (const event of SET_SUTEKH_EVENTS) {
    const text = JSON.stringify(event);
    assert.doesNotMatch(text, /"confidence"/, `${event.slug}`);
    assert.doesNotMatch(
      text,
      /\b\d{1,3}\s?% (certain|confident|likely|sure)\b/i,
      `${event.slug}: a percentage is a confidence score wearing a hat`
    );
  }
});

test("unread sources say so, and the count is visible rather than buried", () => {
  const unread = SET_SUTEKH_SOURCES.filter((s) => /NEEDS SOURCE VERIFICATION/.test(s.notes));
  // This dataset was built without the primary texts open and the flags are
  // the record of that. The assertion is not that the number is low; it is
  // that the sources which have not been read admit it.
  assert.ok(unread.length > 0, "if this ever reaches zero, check that it was earned rather than edited away");
  for (const source of SET_SUTEKH_SOURCES) {
    assert.ok(source.notes.length > 40, `${source.key}: a source note must say what it is cited FOR`);
  }
});

// ---------------------------------------------------------------------------
// THE 400-YEAR STELA, READ FROM THE INSCRIPTION
//
// The first record in this dataset built from the text rather than from
// writing about the text. These tests exist because every one of the gains is
// the kind that erodes quietly: a transliteration gets "tidied", a superseded
// reading gets deleted for being wrong, a citation-only row gets filled in
// with something plausible, and a passage that says "enemies" starts saying
// "Apep" because that is the story everyone knows.
// ---------------------------------------------------------------------------

const stela = record("four-hundred-year-stela");
const stelaPassages = stela.passages ?? [];
const layersOf = (label: string) => {
  const passage = stelaPassages.find((p) => p.label === label);
  assert.ok(passage, `missing passage: ${label}`);
  return passage.layers;
};

test("the stela carries the evidence chain in pieces, not one block of prose", () => {
  assert.ok(stelaPassages.length >= 5, "five passages were read; fewer means one was lost");
  for (const passage of stelaPassages) {
    assert.ok(passage.reference, `${passage.label}: a passage with no location is a quotation floating free`);
    assert.equal(passage.accessionNumber, "JdE 60539 (often written JE 60539)");
    assert.equal(passage.holdingInstitution, "Egyptian Museum, Cairo");
    assert.ok(passage.layers.length >= 2, `${passage.label}: one layer is not a chain`);
  }
});

test("every transliteration is quoted from a publication, never assembled here", () => {
  for (const passage of stelaPassages) {
    for (const layer of passage.layers) {
      if (layer.layer !== "transliteration") continue;
      if (!layer.content) {
        // A citation-only row is legitimate and must say why it is empty.
        assert.ok(layer.contentAbsentReason, `${passage.label}: an empty transliteration with no reason`);
        continue;
      }
      assert.equal(
        layer.sourceKey,
        "tla_four_hundred_year_stela",
        `${passage.label}: a transliteration must name the edition it is quoted from`
      );
      assert.match(layer.evidence, /QUOTED/, `${passage.label}: say that it is quoted rather than built`);
    }
  }
});

test("the lunette phrase stays NOT FOUND rather than being reconstructed", () => {
  // The reading conventionally rendered "Seth of Ramesses" is widely quoted and
  // was not verified. A plausible transliteration in that row would sit in the
  // most authoritative-looking position on the page.
  const lunette = layersOf("The lunette: what the inscription calls the god");
  const translit = lunette.find((l) => l.layer === "transliteration");
  assert.ok(translit, "the row must exist, so the absence is visible");
  assert.equal(translit.content, undefined, "this is exactly the row that must not be filled in");
  assert.match(translit.contentAbsentReason ?? "", /NOT FOUND/);
});

test("Breasted's Hyksos-king reading is kept, and kept marked as superseded", () => {
  const dating = layersOf("The dating formula, and Seth in royal titulary");
  const breasted = dating.find((l) => l.sourceKey === "breasted_records_iii" && l.layer === "interpretation");
  assert.ok(breasted, "deleting an obsolete reading removes the explanation, not the reading");
  assert.match(breasted.evidence, /SUPERSEDED/);

  // And the current reading has to be present beside it, or the record would
  // be teaching the superseded one.
  const current = dating.find((l) => l.layer === "translation" && l.sourceKey === "tla_four_hundred_year_stela");
  assert.ok(current);
  assert.match(current.content ?? "", /Seth-with-great-strength/);
});

test("the two translations of the ancestor formula are both kept", () => {
  // Breasted writes "grandfather" and flags it himself; the TLA reads
  // jtj jtj.PL=f, "father of his fathers". They assert different genealogies,
  // and one translation field would have silently picked a winner.
  const opening = layersOf("The opening royal titulary, and the order to make the stela");
  const translations = opening.filter((l) => l.layer === "translation");
  assert.equal(translations.length, 2, "two editions were read; both belong here");
  assert.ok(translations.some((l) => /grandfather/i.test(l.content ?? "")));
  assert.ok(translations.some((l) => /father of his fathers/i.test(l.evidence)));
});

test("a rendering out of German is never presented as a published English translation", () => {
  for (const passage of stelaPassages) {
    for (const layer of passage.layers) {
      if (layer.layer !== "translation") continue;
      if (layer.sourceKey !== "tla_four_hundred_year_stela") continue;
      assert.match(
        layer.evidence,
        /NOT A PUBLISHED ENGLISH TRANSLATION|from the TLA's German|Rendered into English/,
        `${passage.label}: the TLA gives German; say so`
      );
    }
  }
});

test("the prayer evidences the solar barque and stops short of Apep", () => {
  const prayer = layersOf("The prayer to Seth: in the bow of the barque of Re");
  const breasted = prayer.find((l) => l.sourceKey === "breasted_records_iii");
  assert.ok(breasted);
  assert.match(breasted.content ?? "", /barque of Re/);
  // The surviving prayer says "enemies". The lunette is a wine offering. The
  // record may connect this to the protective tradition and may not borrow its
  // authority for the serpent's name.
  assert.doesNotMatch(breasted.content ?? "", /Apep|Apophis/);
  assert.match(breasted.evidence, /DOES NOT NAME APEP/);

  const apep = record("set-spears-apep");
  const claim = apep.claims[0];
  assert.match(claim.evidence, /400-Year Stela|four-hundred-year-stela/);
  assert.match(claim.evidence, /does not name Apep|not name Apep/i);
});

test("the era's starting point is recorded as unstated ON THE STONE", () => {
  const era = stela.claims.find((c) => /counted from/i.test(c.whatIsDated ?? ""));
  assert.ok(era);
  assert.equal(era.startYear, undefined, "subtracting four hundred would assert the disputed part");
  assert.match(era.evidence, /NEVER NAMES THE EVENT/);
});

test("Avaris archaeology is not upgraded into a dated Seth temple", () => {
  // The single most tempting unsupported step available here: Tell el-Dab'a is
  // securely Avaris, so it is one short move to "and a Seth temple was found
  // there in the right stratum". No excavation report establishing that was
  // opened.
  const hyksos = record("hyksos-avaris-sutekh");
  const notes = hyksos.claims.map((c) => c.notes ?? "").join("\n");
  assert.match(notes, /not be quietly upgraded|NOT FOUND|was looked for and not found/i);

  const oeai = SET_SUTEKH_SOURCES.find((s) => s.key === "oeai_tell_el_daba");
  assert.ok(oeai);
  assert.match(oeai.notes, /NOT CITED FOR/);
});

test("the sources that were actually read no longer claim they were not", () => {
  for (const key of ["tla_four_hundred_year_stela", "breasted_records_iii", "oeai_tell_el_daba"]) {
    const source = SET_SUTEKH_SOURCES.find((s) => s.key === key);
    assert.ok(source, `missing source: ${key}`);
    assert.match(source.notes, /^READ\./, `${key}: these three were opened; the notes should open by saying so`);
    assert.ok(source.url, `${key}: a source that was read has a URL somebody else can open`);
  }
});

// ---------------------------------------------------------------------------
// DAKHLEH: THE OASIS RECORDS
//
// This group exists because reading the excavation reports moved the dataset
// in BOTH directions at once, and both movements are easy to lose.
//
// It confirmed the load-bearing claim: the Dakhleh evidence really does
// overlap in date with hostility to Seth elsewhere, so "Egypt turned against
// Set" is the wrong shape.
//
// And it destroyed the comfortable version of that claim: Mut el-Kharab was
// NOT a refuge. Seth's name was overwritten there too. The old title of the
// record — "Set outlasts his own disgrace in the western oases" — was a story,
// and the tests below keep it from creeping back.
// ---------------------------------------------------------------------------

test("the oasis record no longer says Dakhleh was untouched", () => {
  const oases = record("set-survives-in-the-oases");
  const answer = oases.claims.find((c) => /escaped the hostility/i.test(c.whatIsDated ?? ""));
  assert.ok(answer, "the question has an answer now and it belongs on the record as a claim");
  assert.match(answer.originalDateText, /^No\./, "the answer is no, and it should read as one");
  assert.match(answer.evidence, /overwritten/);
  // And the regional finding has to survive the correction, or the record has
  // simply swung to the opposite oversimplification.
  assert.match(answer.evidence, /DIFFERENT TRAJECTORY|different trajectory/);
});

test("the excavators' conclusion is quoted rather than paraphrased", () => {
  const oases = record("set-survives-in-the-oases");
  const systematic = oases.claims.find((c) => /systematic/i.test(c.whatIsDated ?? ""));
  assert.ok(systematic);
  assert.match(systematic.originalDateText, /cannot be considered systematic or complete/);
  assert.match(systematic.originalDateText, /281/, "a quotation without its page is not checkable");
  // The sentence licenses site-by-site recording. It does not license "nothing
  // happened", and the record has to say which.
  assert.match(systematic.evidence, /WHAT IT DOES NOT LICENSE/);
});

test("no regional ban-date map is manufactured from a paper that declined to draw one", () => {
  const oases = record("set-survives-in-the-oases");
  const text = JSON.stringify(oases) + JSON.stringify(record("late-period-persecution-of-set"));
  assert.match(text, /contextual rather than cartographic/);
  assert.match(text, /do NOT supply ban dates by region|deliberately do NOT supply/);
});

test("the span at Mut is the outer bound of the evidence, not a continuous sequence", () => {
  const oases = record("set-survives-in-the-oases");
  const span = oases.claims.find((c) => /span of evidenced Seth cult/i.test(c.whatIsDated ?? ""));
  assert.ok(span, "the positionless claim became a real span once objects existed at both ends");
  assert.ok(span.startYear !== undefined && span.endYear !== undefined);
  // The publications say "continuously". The object record is clusters. A
  // reader must not take the range as an attestation of every century in it.
  assert.match(span.evidence, /clusters/i);
  assert.match(span.evidence, /not a continuous sequence|NOT: a continuous sequence/i);
});

test("Mut and Ismant el-Kharab are kept as two different sites", () => {
  // The latest Seth at Mut is late Ptolemaic and Roman evidence there is
  // "scant". Seth appears in Roman paintings at Ismant el-Kharab into the
  // early fourth century. Merging them would silently extend Mut by centuries.
  const oases = record("set-survives-in-the-oases");
  assert.match(oases.description, /Ismant el-Kharab/);
  assert.match(oases.description, /TWO DIFFERENT SITES|two different sites/);
  assert.match(oases.description, /scant/i);
});

test("occupation is never allowed to stand in for cult", () => {
  const oases = record("set-survives-in-the-oases");
  assert.match(oases.description, /Occupation is not cult/i);
  // Mut was a bishop's seat with pottery running to the 6th-7th century. That
  // dates Christian use of the site, not the end of Seth's cult.
  assert.match(oases.description, /Christian occupation, not the last act/i);
});

test("the Ramesside stela records how little of it can be read", () => {
  const stela = record("mut-el-kharab-ramesside-seth-stela");
  assert.match(stela.description, /Only the first two form substantially readable text/);
  const passage = stela.passages?.find((p) => /hymn to Seth/i.test(p.label));
  assert.ok(passage);
  const translit = passage.layers.find((l) => l.layer === "transliteration");
  assert.ok(translit?.content);
  // The brackets ARE the text. A transliteration of this stela with few gaps
  // in it would be a different and much better-preserved object.
  assert.ok((translit.content.match(/…|\[/g) ?? []).length > 10, "the lacunae must survive into the record");
});

test("the earliest evidence found is not dated as the beginning of the cult", () => {
  const stela = record("mut-el-kharab-ramesside-seth-stela");
  const beginning = stela.claims.find((c) => /had already existed/i.test(c.whatIsDated ?? ""));
  assert.ok(beginning, "'earliest evidence' and 'when it began' are two claims");
  assert.equal(beginning.startYear, undefined);
  assert.match(beginning.evidence, /history of digging|excavation/i);
});

test("Seth and Nephthys stay a reconstruction, because the heads are lost", () => {
  const stela = record("mut-el-kharab-ramesside-seth-stela");
  const scene = stela.passages?.find((p) => /Amun, Seth and Nephthys/i.test(p.label));
  assert.ok(scene, "the scene is a separate passage so the inference cannot merge into the description");
  const reading = scene.layers.find((l) => l.layer === "interpretation");
  assert.ok(reading, "the identification is an interpretation layer, not an object description");
  const object = scene.layers.find((l) => l.layer === "primary_object");
  assert.match(object?.content ?? "", /heads and the top of the scene are lost/i);
});

test("the overwritten determinative is recorded as a respelling, not an erasure", () => {
  const block = record("mut-el-kharab-seth-determinative-overwritten");
  // The god was kept and rewritten. Filing that under "persecution" alongside
  // a hacked-out figure would flatten two different acts.
  assert.match(block.description, /He was RESPELLED|respelled/i);
  assert.match(block.description, /not the same act as chiselling/i);
  assert.match(block.description, /must not be written here|MUST NOT BE WRITTEN HERE/i);
  assert.match(block.description, /demonisation/i, "the record names the word it refuses");

  const claim = block.claims[0];
  assert.equal(claim.temporalClaimType, "after_event", "a terminus, not a moment");
  assert.match(claim.notes ?? "", /AT SECOND HAND|second hand/i);
});

test("the determinative comparison is recorded as not made", () => {
  // Comparing how the Greater and Smaller Dakhleh Stelae write Seth's name is
  // what would show whether the Mut respelling is a pattern. The facsimiles
  // were not accessible. An answer here would be invention.
  const greater = record("greater-dakhleh-stela-oracle-of-seth");
  const written = greater.claims.find((c) => /how Seth's name is written/i.test(c.whatIsDated ?? ""));
  assert.ok(written);
  assert.match(written.originalDateText, /Not established/i);
  assert.match(written.evidence, /NOTHING IS ENTERED HERE/);
  assert.match(written.evidence, /Griffith-2-9/);
});

test("the Greater Stela is not dated to Shoshenq I on an unread redating study", () => {
  const greater = record("greater-dakhleh-stela-oracle-of-seth");
  const date = greater.claims.find((c) => /when the stela was made/i.test(c.whatIsDated ?? ""));
  assert.ok(date);
  // Leahy 2010 is specifically about that attribution and was not opened, so
  // entering it would assert the thing under examination.
  assert.match(date.evidence, /under examination|redating study/i);
  assert.ok((date.endYear ?? 0) - (date.startYear ?? 0) > 100, "a whole-period range, not a reign");
});

test("a shared priesthood is not upgraded into a shared temple", () => {
  const smaller = record("smaller-dakhleh-stela-piye");
  const building = smaller.claims.find((c) => /shared a temple building/i.test(c.whatIsDated ?? ""));
  assert.ok(building);
  assert.match(building.originalDateText, /remains to be established/i);
  assert.equal(temporalTypeIsPositioned(building.temporalClaimType), false);
  assert.match(smaller.description, /Whether the two gods physically shared the same temple building/);
});

test("the sources read at Dakhleh say so, and the ones taken at second hand say that", () => {
  const read = ["hope_kaper_2010", "hope_warfe_2017", "monash_mut_el_kharab", "mut_2013_season"];
  for (const key of read) {
    const source = SET_SUTEKH_SOURCES.find((s) => s.key === key);
    assert.ok(source, `missing source: ${key}`);
    assert.match(source.notes, /^READ/, `${key}: opened sources should open by saying so`);
    assert.ok(source.url, `${key}: a source that was read has a URL`);
  }
  for (const key of ["leahy_greater_dakhleh_2010", "janssen_smaller_dakhleh_1968"]) {
    const source = SET_SUTEKH_SOURCES.find((s) => s.key === key);
    assert.ok(source, `missing source: ${key}`);
    assert.match(source.notes, /NOT OPENED|not opened|second hand/i, `${key}: say that it was not read`);
  }
});
