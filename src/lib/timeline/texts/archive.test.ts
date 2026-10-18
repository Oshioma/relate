import { test } from "node:test";
import assert from "node:assert/strict";

import { TIMELINE_SOURCE_TYPES } from "../taxonomy";
import { ALL_CORPORA, corpusFor } from "./corpus";
import { PLAIN_LAYER_KEY } from "./corpus/plain";
import { INVENTORY, INVENTORY_SOURCES, workForPassageKey } from "./inventory";
import { buildManifest, coverageText, deriveCompleteness } from "./manifest";
import { breadcrumb, historicalGap, neighbours, readingOrder, RUN_ON_MAX_CHARS, sentenceRunsInFrom, sentenceRunsOnInto } from "./reading";
import { COPYRIGHT_EXCERPT_MAX_CHARS, dateRoleFromWhatIsDated, whatIsDatedFor } from "./taxonomy";
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
      // Faulkner is cited, never reproduced; the only English text quoted is
      // Breasted's (the plain-words paraphrase is our own).
      if (layer.content != null && layer.key !== PLAIN_LAYER_KEY) assert.equal(layer.licence, "public_domain", passage.key);
      if (layer.sourceKey === "faulkner-ct") assert.equal(layer.content, undefined, passage.key);
    }
  }
  const twoWays = spells.filter((p) => p.parentKey === "egy.ct.two-ways").map((p) => Number(p.key.slice("egy.ct.".length)));
  assert.equal(twoWays.length, 102);
  assert.deepEqual([twoWays[0], twoWays.at(-1)], [1029, 1130]);
  assert.match(passages.find((p) => p.key === "egy.ct.335")!.layers.find((l) => l.key === "eng-breasted")!.content!, /^I am Atum/);
});

test("the Book of the Dead lists every chapter Budge lists, gives his Ani text in full, and cites the modern translations only", () => {
  const passages = corpusFor("egy.book-of-the-dead")!.passages;
  const chapters = passages.filter((p) => p.divisionKind === "spell");
  const keys = chapters.map((p) => p.key.slice("egy.bd.".length));
  assert.equal(new Set(keys).size, keys.length);
  // Budge's Theban list: 197 numbers (186 chapters, with lettered and
  // sub-numbered variants, less the 7 he lists only as renumbered), plus 29
  // and 93A, which only his List of Chapters of the Papyrus of Ani gives.
  assert.equal(chapters.length, 199);
  for (const n of [10, 73, 111, 120, 121, 129, 139]) assert.ok(!keys.includes(String(n)), `${n} is only a renumbering`);
  for (const k of ["1", "1b", "15b-2", "17", "29", "30b", "93a", "101", "125", "186"]) assert.ok(keys.includes(k), k);
  assert.deepEqual([keys[0], keys.at(-1)], ["1", "186"]);

  // Budge's own text: 70 chapters, ten of them supplied from other papyri.
  const withText = chapters.filter(
    (p) => p.layers.some((l) => l.key === "eng-budge") || passages.some((c) => c.parentKey === p.key)
  );
  assert.equal(withText.length, 70);
  const supplied = passages.filter((p) => p.layers.some((l) => l.key === "eng-budge" && /does not have this text/.test(l.evidence)));
  assert.equal(supplied.length, 12);

  for (const passage of passages) {
    assert.equal(passage.verificationStatus, "unverified", passage.key);
    for (const layer of passage.layers) {
      if (layer.content != null && layer.key !== PLAIN_LAYER_KEY) assert.equal(layer.licence, "public_domain", passage.key);
      if (["allen-bd", "faulkner-bd", "quirke-bd"].includes(layer.sourceKey ?? "")) {
        assert.equal(layer.licence, "copyrighted_reference", passage.key);
        assert.equal(layer.content, undefined, passage.key);
      }
      if (layer.content) assert.doesNotMatch(layer.content, /\{p\. ?\d|###|\[\d\]|security service|�/, passage.key);
    }
  }
  for (const chapter of chapters) {
    assert.deepEqual(
      chapter.layers.filter((l) => l.licence === "copyrighted_reference").map((l) => l.key),
      ["eng-allen", "eng-faulkner", "eng-quirke"],
      chapter.key
    );
  }

  // Chapter 125: the declarations of innocence, in Budge's words.
  const confession = passages.find((p) => p.key === "egy.bd.125.1")!.layers[0].content!;
  assert.match(confession, /\(1\) Ani saith: "Hail, thou whose strides are long, who comest forth from Annu, I have not done iniquity\."/);
  assert.match(confession, /\(42\) "Hail, thou whose teeth are white, .* I have not slaughtered with evil intent the cattle of the god\."/);
  assert.match(passages.find((p) => p.key === "egy.bd.30b.1")!.layers[0].content!, /^Osiris, the scribe Ani, saith: "My heart my mother/);
  assert.match(passages.find((p) => p.key === "egy.bd.judgement")!.layers[0].content!, /^Thoth, the righteous judge/);
  assert.equal(passages.find((p) => p.key === "egy.bd.6")!.layers[0].content, "The Chapter of making ushabtiu figures do work for a man in the underworld.");
  assert.ok(passages.find((p) => p.key === "egy.bd.judgement")!.images?.some((i) => i.key === "ani-weighing-of-the-heart"));
});

test("the Asclepius has Mead's 41 chapters, his English in full, no Latin it cannot vouch for, and the Coptic cited only", () => {
  const file = corpusFor("herm.asclepius")!;
  const passages = file.passages;
  const chapters = passages.filter((p) => p.divisionKind === "chapter").map((p) => p.key);
  assert.deepEqual(chapters, Array.from({ length: 41 }, (_, i) => `herm.ascl.${i + 1}`));
  const units = passages.filter((p) => p.layers.some((l) => l.key === "eng-mead"));
  assert.equal(units.length, 134);
  for (const passage of passages) {
    assert.equal(passage.verificationStatus, "unverified", passage.key);
    for (const layer of passage.layers) {
      if (layer.key === "eng-mead") assert.doesNotMatch(layer.content!, /Footnotes|security service|[<>{}#\\]|\bp\. \d|THRICE-GREATEST|�/, passage.key);
      if (layer.key === "lat-thomas") assert.equal(layer.content, undefined, passage.key);
      if (layer.licence === "copyrighted_reference") assert.equal(layer.content, undefined, passage.key);
    }
  }
  for (const key of ["herm.ascl.coptic", "herm.ascl.prayer-coptic"]) {
    const version = passages.find((p) => p.key === key)!;
    assert.ok(version.layers.every((l) => l.content == null), key);
  }
  assert.match(passages.find((p) => p.key === "herm.ascl.24.3")!.layers[0].content!, /^Then shall this holiest land/);
  assert.match(passages.find((p) => p.key === "herm.ascl.41.5")!.layers[0].content!, /pure and fleshless meal\.$/);
  // Mead prints no fourth paragraph in chapter XXIX.
  assert.ok(!passages.some((p) => p.key === "herm.ascl.29.4"));
  const work = INVENTORY.find((w) => w.workKey === "herm.asclepius")!;
  assert.equal(work.inventoryVerified, false);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 41, verifiedUnits: 0 }), "verified_against_edition");
});

test("the Gospel of Thomas has its prologue and 114 sayings, cites the Coptic and every English translation, and joins the existing event", () => {
  const file = corpusFor("gnostic.gospel-of-thomas")!;
  const passages = file.passages;
  const sayings = passages.filter((p) => p.divisionKind === "saying").map((p) => p.key);
  assert.deepEqual(sayings, Array.from({ length: 114 }, (_, i) => `gnostic.thom.${i + 1}`));
  assert.ok(passages.some((p) => p.key === "gnostic.thom.prologue"));
  assert.ok(passages.some((p) => p.key === "gnostic.thom.title"));
  for (const passage of passages) {
    assert.equal(passage.verificationStatus, "unverified", passage.key);
    for (const layer of passage.layers) {
      // No Coptic and no modern translation of it is reproduced.
      if (layer.key === "cop-nhc-ii") assert.equal(layer.content, undefined, passage.key);
      if (layer.licence === "copyrighted_reference") assert.equal(layer.content, undefined, passage.key);
    }
  }
  const versions = passages.filter((p) => p.divisionKind === "version").map((p) => p.key);
  assert.deepEqual(versions, ["gnostic.thom.poxy654", "gnostic.thom.poxy1", "gnostic.thom.poxy655"]);
  // Every Greek section is linked to the Coptic it parallels.
  const greek = passages.filter((p) => p.parentKey && versions.includes(p.parentKey)).map((p) => p.key);
  for (const key of greek) assert.ok(file.links!.some((l) => l.from === key), key);
  assert.match(passages.find((p) => p.key === "gnostic.thom.poxy1.logion-7")!.layers[0].content!, /^Λέγει Ἰησοῦς, πόλις/);
  assert.ok(file.links!.some((l) => l.from === "gnostic.thom.poxy1.logion-5" && l.to === "gnostic.thom.77"));
  const work = INVENTORY.find((w) => w.workKey === "gnostic.gospel-of-thomas")!;
  assert.equal(work.inventoryVerified, false);
  assert.ok(work.anchor && "existingSlug" in work.anchor && work.anchor.existingSlug === "gospel-of-thomas");
});

test("Doreal's book is quoted, a few lines a tablet, and has no artefact picture", () => {
  const doreal = corpusFor("modern.doreal-emerald-tablets")!;
  assert.equal(doreal.passages.length, 15);
  for (const passage of doreal.passages) {
    assert.ok(passage.summary, passage.key);
    // The book's own words are a short quotation; the plain words are ours.
    for (const layer of passage.layers.filter((l) => l.key !== PLAIN_LAYER_KEY)) {
      assert.equal(layer.licence, "copyrighted_excerpt", passage.key);
      assert.ok(layer.content && layer.content.length <= COPYRIGHT_EXCERPT_MAX_CHARS, passage.key);
    }
    assert.equal(passage.images, undefined);
  }
  assert.match(doreal.passages[10].layers[0].content!, /Look thee above or look thee below/);
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

test("a sentence cut by a section boundary is finished from the next section and begun from the previous", () => {
  const cut = "we do not examine closely or criticize the paintings, but tolerate, in such cases, an inexact";
  const next = "and deceptive sketch. But whenever any artist tries to portray our bodies, we quickly perceive the defects.";
  assert.equal(sentenceRunsOnInto(cut, next), "and deceptive sketch.");
  assert.equal(sentenceRunsOnInto("A whole sentence.", next), null);
  assert.equal(sentenceRunsOnInto(`"Quoted to the end."`, next), null);
  assert.equal(sentenceRunsInFrom("But whenever any artist tries.", cut), null, "a capitalised start is a new sentence");
  assert.equal(sentenceRunsInFrom("and deceptive sketch.", `First sentence. ${cut}`), cut);
  assert.equal(sentenceRunsInFrom("and deceptive sketch.", "Ends cleanly."), null);
  const long = sentenceRunsOnInto("no stop", "word ".repeat(400));
  assert.ok(long!.length <= RUN_ON_MAX_CHARS + 2 && long!.endsWith("…"));
});
