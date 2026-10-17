import { test } from "node:test";
import assert from "node:assert/strict";

import { TIMELINE_SOURCE_TYPES } from "../taxonomy";
import { ALL_CORPORA, corpusFor } from "./corpus";
import { INVENTORY, INVENTORY_SOURCES, workForPassageKey } from "./inventory";
import { buildManifest, coverageText, deriveCompleteness } from "./manifest";
import { breadcrumb, historicalGap, neighbours, readingOrder } from "./reading";
import { dateRoleFromWhatIsDated, whatIsDatedFor } from "./taxonomy";
import { formatProblems, validateCorpus, validateInventory } from "./validate";

const SOURCE_TYPES = new Set<string>(TIMELINE_SOURCE_TYPES.map((t) => t.key));

test("the inventory passes every quality check", () => {
  assert.equal(formatProblems(validateInventory(INVENTORY)), "");
});

test("the inventory covers all 33 items of the brief", () => {
  const items = new Set(INVENTORY.map((work) => work.briefItem));
  for (let item = 1; item <= 33; item++) assert.ok(items.has(item), `brief item ${item} has no inventory entry`);
});

test("every inventory claim cites a source the inventory defines", () => {
  const keys = new Set(INVENTORY_SOURCES.map((s) => s.key));
  assert.equal(keys.size, INVENTORY_SOURCES.length, "duplicate inventory source key");
  for (const source of INVENTORY_SOURCES) assert.ok(SOURCE_TYPES.has(source.sourceType), `${source.key}: ${source.sourceType}`);
  for (const work of INVENTORY) {
    const claims = work.anchor == null ? [] : "event" in work.anchor ? work.anchor.event.claims : (work.anchor.extraClaims ?? []);
    for (const claim of claims) {
      if (claim.sourceKey) assert.ok(keys.has(claim.sourceKey), `${work.workKey}: unknown sourceKey ${claim.sourceKey}`);
    }
  }
});

test("every corpus file passes every quality check", () => {
  for (const file of ALL_CORPORA) assert.equal(formatProblems(validateCorpus(file, INVENTORY)), "", file.workKey);
});

test("passage and image keys are unique across the whole archive", () => {
  const passages = new Set<string>();
  const images = new Set<string>();
  for (const file of ALL_CORPORA) {
    for (const passage of file.passages) {
      assert.ok(!passages.has(passage.key), `passage ${passage.key} appears twice`);
      passages.add(passage.key);
      for (const image of passage.images ?? []) {
        assert.ok(!images.has(image.key), `image ${image.key} appears twice`);
        images.add(image.key);
      }
    }
    for (const image of file.images ?? []) {
      assert.ok(!images.has(image.key), `image ${image.key} appears twice`);
      images.add(image.key);
    }
  }
});

test("a connection to an imported work points at a passage that exists", () => {
  const passages = new Map<string, Set<string>>();
  for (const file of ALL_CORPORA) passages.set(file.workKey, new Set(file.passages.map((p) => p.key)));
  for (const file of ALL_CORPORA) {
    for (const link of file.links ?? []) {
      for (const end of [link.from, link.to]) {
        const work = workForPassageKey(end);
        assert.ok(work, `${link.key}: ${end} belongs to no work`);
        const imported = passages.get(work.workKey);
        if (imported) assert.ok(imported.has(end), `${link.key}: ${end} is not a passage of ${work.workKey}`);
      }
    }
  }
});

test("the Plato counts are what the edition's markup gives, and each section has Greek and English", () => {
  for (const workKey of ["greek.timaeus", "greek.critias"]) {
    const work = INVENTORY.find((w) => w.workKey === workKey)!;
    const sections = corpusFor(workKey)!.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
    assert.equal(sections.length, work.expectedUnits, workKey);
    for (const section of sections) {
      const greek = section.layers.find((l) => l.key === "grc-burnet");
      const english = section.layers.find((l) => l.key === "eng-bury");
      assert.ok(greek?.content?.trim(), `${section.key} has no Greek`);
      assert.ok(english?.content?.trim() || english?.contentAbsentReason, `${section.key} has no English or reason`);
    }
  }
  const tim = corpusFor("greek.timaeus")!.passages;
  assert.equal(tim.find((p) => p.divisionKind === "section")!.key, "greek.tim.17a");
  assert.equal(tim.at(-1)!.key, "greek.tim.92c");
  const atlantis = tim.find((p) => p.key === "greek.tim.25d")!;
  assert.match(atlantis.layers[1].content!, /island of Atlantis/);
  assert.ok(atlantis.themes?.some((t) => t.themeKey === "atlantis"));
});

test("the Corpus Hermeticum has all seventeen treatises, the Poimandres whole, and nothing marked verified", () => {
  const passages = corpusFor("herm.corpus-hermeticum")!.passages;
  const treatises = passages.filter((p) => p.divisionKind === "treatise").map((p) => p.key);
  assert.deepEqual(
    treatises,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18].map((n) => `herm.ch.${n}`)
  );
  const poimandres = passages.filter((p) => p.parentKey === "herm.ch.1");
  assert.equal(poimandres.length, 32);
  assert.deepEqual(
    poimandres.map((p) => p.key),
    Array.from({ length: 32 }, (_, i) => `herm.ch.1.${i + 1}`)
  );
  for (const passage of passages) {
    assert.equal(passage.verificationStatus, "unverified", passage.key);
    for (const layer of passage.layers) {
      assert.ok(layer.content?.trim(), `${passage.key} has an empty layer`);
      assert.doesNotMatch(layer.content!, /THRICE-GREATEST|\s[0-9]{1,2}\s|[\\<>£$€#^]/, `${passage.key} still has OCR debris`);
    }
  }
  // The Poimandres alias and Doreal's link both land on passages that exist.
  assert.ok(passages.some((p) => p.key === "herm.ch.1.9"));
});

test("the Pyramid Texts hold every utterance Mercer prints, in Sethe's numbers, and nothing marked verified", () => {
  const passages = corpusFor("egy.pyramid-texts")!.passages;
  const utterances = passages.filter((p) => p.divisionKind === "utterance");
  const numbers = utterances.map((p) => Number(p.key.slice("egy.pt.".length)));
  assert.equal(new Set(numbers).size, numbers.length);
  for (const n of numbers) assert.ok(Number.isInteger(n) && n >= 1 && n <= 714, `utterance ${n}`);
  // 1–714 less 65 (absent from the web edition) and 274 and 445 (printed
  // with 273 and 444).
  assert.equal(utterances.length, 711);
  assert.ok(!numbers.includes(65));
  assert.equal(passages.filter((p) => p.divisionKind === "chapter").length, 59);
  for (const passage of passages) {
    assert.equal(passage.verificationStatus, "unverified", passage.key);
    for (const layer of passage.layers) {
      if (layer.content) assert.doesNotMatch(layer.content, /\bp\. \d|Close navigation|security service/, passage.key);
    }
  }
  assert.match(utterances[0].layers[0].content!, /^1a\. To say by Nut/);
  for (const n of [260, 277]) {
    assert.ok(passages.find((p) => p.key === `egy.pt.${n}`)!.images?.length, `utterance ${n} has its wall`);
  }
});

test("the Coffin Texts list all 1,185 spells, quote only public-domain English, and nothing marked verified", () => {
  const passages = corpusFor("egy.coffin-texts")!.passages;
  const spells = passages.filter((p) => p.divisionKind === "spell");
  assert.deepEqual(
    spells.map((p) => p.key),
    Array.from({ length: 1185 }, (_, i) => `egy.ct.${i + 1}`)
  );
  for (const passage of passages) {
    assert.equal(passage.verificationStatus, "unverified", passage.key);
    for (const layer of passage.layers) {
      // Faulkner is cited, never reproduced; the only English text is Breasted's.
      if (layer.content != null) assert.equal(layer.licence, "public_domain", passage.key);
      if (layer.sourceKey === "faulkner-ct") assert.equal(layer.content, undefined, passage.key);
    }
  }
  const twoWays = spells.filter((p) => p.parentKey === "egy.ct.two-ways").map((p) => Number(p.key.slice("egy.ct.".length)));
  assert.equal(twoWays.length, 102);
  assert.deepEqual([twoWays[0], twoWays.at(-1)], [1029, 1130]);
  assert.match(passages.find((p) => p.key === "egy.ct.335")!.layers.find((l) => l.key === "eng-breasted")!.content!, /^I am Atum/);
});

test("Doreal's book carries no text of its own and no artefact picture", () => {
  const doreal = corpusFor("modern.doreal-emerald-tablets")!;
  assert.equal(doreal.passages.length, 15);
  for (const passage of doreal.passages) {
    for (const layer of passage.layers) assert.equal(layer.content, undefined, passage.key);
    assert.equal(passage.images, undefined);
  }
});

test("the Emerald Tablet keeps its versions apart and says how they connect", () => {
  const tablet = corpusFor("arab.emerald-tablet")!;
  const versions = tablet.passages.filter((p) => p.divisionKind === "version").map((p) => p.key);
  assert.deepEqual(versions, ["arab.tab.arabic", "arab.tab.secretum", "arab.tab.vulgate", "arab.tab.newton"]);
  const link = tablet.links!.find((l) => l.key === "vulgate-02-from-arabic-02")!;
  assert.match(link.differences, /FROM/);
});

test("reading order runs through the outline depth-first, with neighbours and a breadcrumb", () => {
  const rows = corpusFor("greek.critias")!.passages.map((p, i) => ({
    passage_key: p.key,
    parent_key: p.parentKey ?? null,
    ordinal: i,
    label: p.label,
    reference: p.reference,
    division_kind: p.divisionKind,
  }));
  const order = readingOrder(rows).map((r) => r.passage_key);
  assert.deepEqual(order.slice(0, 3), ["greek.crit.part-106a", "greek.crit.106", "greek.crit.106a"]);
  const around = neighbours(rows, "greek.crit.106a");
  assert.equal(around.previous?.passage_key, "greek.crit.106");
  assert.equal(around.next?.passage_key, "greek.crit.106b");
  assert.deepEqual(
    breadcrumb(rows, "greek.crit.113c").map((r) => r.passage_key),
    ["greek.crit.part-113a", "greek.crit.113"]
  );
});

test("the historical gap is measured between the oldest evidence, never a claimed date", () => {
  const gap = historicalGap(
    [
      { role: "claimed", start_year: -9599, end_year: null, original_date_text: "9000 years before Solon" },
      { role: "earliest_evidence", start_year: 850, end_year: 900, original_date_text: "MS A" },
    ],
    [{ role: "composition", start_year: 1100, end_year: 1150, original_date_text: "12th c." }]
  );
  assert.ok(gap);
  assert.equal(gap.years, 250);
  assert.equal(gap.earlier, "a");
  assert.equal(historicalGap([{ role: "claimed", start_year: -9599, end_year: null, original_date_text: null }], []), null);
});

test("a work is complete only when a verified count is fully imported and checked", () => {
  const work = { expectedUnits: 10, inventoryVerified: true };
  assert.equal(deriveCompleteness(work, { importedUnits: 0, verifiedUnits: 0 }), "inventory_documented");
  assert.equal(deriveCompleteness(work, { importedUnits: 5, verifiedUnits: 5 }), "partial");
  assert.equal(deriveCompleteness(work, { importedUnits: 10, verifiedUnits: 9 }), "imported_unverified");
  assert.equal(deriveCompleteness(work, { importedUnits: 10, verifiedUnits: 10 }), "verified_against_edition");
  assert.equal(deriveCompleteness({ ...work, inventoryVerified: false }, { importedUnits: 10, verifiedUnits: 10 }), "imported_unverified");
  assert.equal(deriveCompleteness({ expectedUnits: null, inventoryVerified: false }, { importedUnits: 3, verifiedUnits: 3 }), "partial");
  const manifest = buildManifest(
    { expectedUnits: null, inventoryVerified: false },
    { importedUnits: 3, verifiedUnits: 0, passageRecords: 4, translations: 0, translationsWithText: 0, imagesFound: 0, imagesVerified: 0, unresolvedVariants: 0 }
  );
  assert.equal(manifest.missingUnits, null);
  assert.equal(coverageText(manifest, "versions"), "3 versions (total not yet established)");
});

test("the five chronological concepts round-trip through what_is_dated", () => {
  for (const role of ["event_described", "claimed", "composition", "earliest_evidence", "manuscript", "translation_publication"]) {
    assert.equal(dateRoleFromWhatIsDated(`${whatIsDatedFor(role)} — something`), role);
  }
});
