import { existsSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

import { TIMELINE_SOURCE_TYPES } from "../taxonomy";
import { ALL_CORPORA, corpusFor } from "./corpus";
import { OUR_TRANSLATION_LAYER_KEY, PLAIN_LAYER_KEY } from "./corpus/plain";
import { INVENTORY, INVENTORY_SOURCES, workForPassageKey } from "./inventory";
import { buildManifest, coverageText, deriveCompleteness } from "./manifest";
import { breadcrumb, historicalGap, layerDisplayOrder, neighbours, readingOrder, RUN_ON_MAX_CHARS, sentenceRunsInFrom, sentenceRunsOnInto } from "./reading";
import { KYBALION_CHAPTERS, KYBALION_SAYINGS } from "./corpus/kybalion-text";
import { SCOTT_ELLIOT_MAPS, SCOTT_ELLIOT_SECTIONS } from "./corpus/scott-elliot-text";
import { DONNELLY_CHAPTERS } from "./corpus/donnelly-text";
import { VIRGIN_UNITS } from "./corpus/virgin-of-the-world-text";
import { MITHRIAC_UNITS } from "./corpus/mithras-liturgy-text";
import { IRENAEUS_NOTES, IRENAEUS_UNITS } from "./corpus/irenaeus-text";
import { ORIGEN_NOTES, ORIGEN_UNITS } from "./corpus/origen-contra-celsum-text";
import { ASCENSION_UNITS } from "./corpus/ascension-of-isaiah-text";
import { SECRETS_OF_ENOCH_UNITS } from "./corpus/secrets-of-enoch-text";
import { TURBA_UNITS } from "./corpus/turba-philosophorum-text";
import { MARKER_PICTURES } from "./marker-pictures";
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

test("Hall's book has its 47 chapters in full, is marked modern, and is linked as discussion only", () => {
  const file = corpusFor("modern.hall")!;
  const passages = file.passages;
  const chapters = passages.filter((p) => p.divisionKind === "chapter").map((p) => p.key);
  assert.deepEqual(chapters, [
    "modern.hall.intro",
    ...Array.from({ length: 45 }, (_, i) => `modern.hall.${i + 1}`),
    "modern.hall.conclusion",
  ]);
  const work = INVENTORY.find((w) => w.workKey === "modern.hall")!;
  assert.equal(work.expectedUnits, 47);
  assert.equal(work.inventoryVerified, true);
  assert.match(work.summary, /modern compendium, not an ancient text.*1928/);
  for (const passage of passages) {
    assert.equal(passage.verificationStatus, "unverified", passage.key);
    for (const layer of passage.layers) {
      if (layer.key !== "eng-hall") continue;
      assert.equal(layer.licence, "public_domain_us", passage.key);
      if (layer.content) assert.doesNotMatch(layer.content, /security service|\n\np\. A\d|�/, passage.key);
    }
  }
  // Hall's account is a later reading, never a witness, and Doreal is not linked.
  for (const link of file.links ?? []) {
    assert.equal(link.connectionClass, "later_reinterpretation", link.key);
    assert.match(link.transmissionEvidence, /not a witness/, link.key);
    assert.doesNotMatch(link.to, /doreal/, link.key);
  }
  // Hall's own pictures are later artwork or diagrams; pictures of what he
  // discusses (keys "hall-related-…") may be anything. The unverified ones say so first.
  const images = passages.flatMap((p) => p.images ?? []);
  assert.ok(images.length >= 5);
  for (const image of images) {
    if (!image.key.startsWith("hall-related-")) assert.ok(["later_artwork", "diagram"].includes(image.shows ?? ""), image.key);
    if (image.identificationStatus === "unverified") {
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    }
  }
  // Every figure but one (Table VII of the Gichtel tables, which the web
  // edition does not print) has a picture, and every stored copy is in the repo.
  const bare = passages.filter((p) => p.divisionKind === "figure" && !p.images?.length).map((p) => p.key);
  assert.deepEqual(bare, ["modern.hall.32.fig6"]);
  for (const image of images) {
    const local = image.url.match(/^https:\/\/relate\.click\/(archive-pictures\/hall\/[\w-]+\.jpg)$/);
    if (local) assert.ok(existsSync(`public/${local[1]}`), image.key);
    else assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\//, image.key);
  }
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

/** Every layer of a work: open text only where the licence allows it, and no copyrighted text at all. */
function assertOpenTextOnly(workKey: string, openLayerKeys: string[]) {
  const file = corpusFor(workKey)!;
  for (const passage of file.passages) {
    assert.equal(passage.verificationStatus, "unverified", passage.key);
    for (const layer of passage.layers) {
      if (layer.licence === "copyrighted_reference") assert.equal(layer.content, undefined, `${passage.key} ${layer.key}`);
      assert.notEqual(layer.licence, "copyrighted_excerpt", `${passage.key} ${layer.key}`);
      if (layer.content == null || layer.key === PLAIN_LAYER_KEY) continue;
      assert.ok(openLayerKeys.includes(layer.key), `${passage.key}: unexpected text layer ${layer.key}`);
      assert.equal(layer.licence, "public_domain", `${passage.key} ${layer.key}`);
      assert.doesNotMatch(layer.content, /\[\d+\]|\{\d+\}|_|�|--/, `${passage.key}: footnote marker, page marker or OCR debris`);
    }
  }
  // Every passage with text has plain words.
  for (const passage of file.passages.filter((p) => p.layers.some((l) => l.content && l.key !== PLAIN_LAYER_KEY))) {
    assert.ok(passage.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${passage.key} has no plain words`);
  }
  const work = INVENTORY.find((w) => w.workKey === workKey)!;
  assert.equal(work.inventoryVerified, false, workKey);
  assert.ok(work.anchor && "event" in work.anchor, `${workKey} creates its own marker`);
  return file;
}

test("Ptahhotep has Gunn's 37 maxims in full between a prologue and an epilogue, and cites the modern translations only", () => {
  const file = assertOpenTextOnly("egy.ptahhotep", ["eng-gunn"]);
  const maxims = file.passages.filter((p) => p.divisionKind === "maxim").map((p) => p.key);
  assert.deepEqual(maxims, Array.from({ length: 37 }, (_, i) => `egy.ptah.${i + 1}`));
  const work = INVENTORY.find((w) => w.workKey === "egy.ptahhotep")!;
  assert.equal(work.expectedUnits, 37);
  assert.equal(work.unitDivisionKind, "maxim");
  const withGunn = file.passages.filter((p) => p.layers.some((l) => l.key === "eng-gunn"));
  // title, A, B, 37 maxims, C, 38–43, D and the closing formula.
  assert.equal(withGunn.length, 49);
  for (const key of ["egy.ptah.38", "egy.ptah.43", "egy.ptah.d", "egy.ptah.colophon"]) {
    assert.equal(file.passages.find((p) => p.key === key)!.parentKey, "egy.ptah.epilogue", key);
  }
  for (const maxim of file.passages.filter((p) => p.divisionKind === "maxim")) {
    const cited = maxim.layers.filter((l) => l.licence === "copyrighted_reference").map((l) => l.key);
    assert.deepEqual(cited, ["eng-lichtheim", "eng-parkinson", "eng-simpson", "eng-allen"], maxim.key);
  }
  const text = (key: string) => file.passages.find((p) => p.key === key)!.layers[0].content!;
  assert.match(text("egy.ptah.1"), /^Be not proud because thou art learned/);
  assert.match(text("egy.ptah.5"), /Great is Truth/);
  assert.match(text("egy.ptah.colophon"), /^IT IS FINISHED\nFROM ITS BEGINNING TO ITS END/);
  assert.match(file.passages.find((p) => p.key === "egy.ptah.5")!.notes!, /Gunn's note 4/);
  assert.equal(deriveCompleteness(work, { importedUnits: 37, verifiedUnits: 0 }) === "verified_against_edition", false);
});

test("Kagemni has Gunn's five sections, the closing narrative and the colophon", () => {
  const file = assertOpenTextOnly("egy.kagemni", ["eng-gunn"]);
  assert.deepEqual(
    file.passages.map((p) => p.key),
    ["egy.kag.1", "egy.kag.2", "egy.kag.3", "egy.kag.4", "egy.kag.5", "egy.kag.narrative", "egy.kag.colophon"]
  );
  assert.match(file.passages[5].layers[0].content!, /Then was Ke'gemni made Governor of his City and Vizier\.$/);
  assert.equal(INVENTORY.find((w) => w.workKey === "egy.kagemni")!.expectedUnits, null);
});

test("Amenemope has its thirty chapters in Griffith's verse lines, with Proverbs in the notes and never as a link", () => {
  const file = assertOpenTextOnly("egy.amenemope", ["eng-griffith"]);
  const chapters = file.passages.filter((p) => p.divisionKind === "chapter").map((p) => p.key);
  assert.deepEqual(chapters, Array.from({ length: 30 }, (_, i) => `egy.amenemope.${i + 1}`));
  assert.equal(INVENTORY.find((w) => w.workKey === "egy.amenemope")!.expectedUnits, 30);
  const text = (key: string) => file.passages.find((p) => p.key === key)!.layers[0].content!;
  assert.match(text("egy.amenemope.1"), /^3\.8 He saith: First Chapter:\n3\.9 Give thine ears/);
  assert.match(text("egy.amenemope.30"), /^27\.6 Thirtieth Chapter:\n27\.7 See for thyself these thirty chapters/);
  assert.match(text("egy.amenemope.colophon"), /Written by Senu son of the divine father Pemu\.$/);
  const lines = file.passages.flatMap((p) => p.layers.filter((l) => l.key === "eng-griffith").flatMap((l) => l.content!.split("\n")));
  assert.equal(lines.length, 556);
  assert.match(file.passages.find((p) => p.key === "egy.amenemope.6")!.notes!, /Prov\. 22:28/);
  for (const link of file.links ?? []) assert.doesNotMatch(`${link.from} ${link.to}`, /prov/i, link.key);
});

test("the Memphite Theology gives Breasted's 1901 and 1912 English, and its Hermetic parallel claims no transmission", () => {
  const file = assertOpenTextOnly("egy.memphite-theology", ["eng-breasted-1901", "eng-breasted-1912"]);
  assert.equal(file.passages.length, 10);
  assert.ok(file.passages.every((p) => p.divisionKind === "line"));
  const descriptions = file.passages.filter((p) => p.layers.some((l) => l.key === "eng-breasted-1901" && l.layer === "interpretation"));
  assert.deepEqual(
    descriptions.map((p) => p.key),
    ["egy.memphite.18-24", "egy.memphite.25-47", "egy.memphite.61-64"]
  );
  const creation = file.passages.find((p) => p.key === "egy.memphite.55-57")!;
  assert.match(creation.layers.find((l) => l.key === "eng-breasted-1912")!.content!, /^"When the eyes see, the ears hear/);
  const link = file.links!.find((l) => l.to.startsWith("herm."))!;
  assert.equal(link.connectionClass, "close_conceptual_parallel");
  assert.equal(link.reviewStatus, "proposed");
  assert.match(link.transmissionEvidence, /^None shown\..*never as transmission/);
  const dates = file.passages[0].dates!.map((d) => d.key);
  assert.deepEqual(dates, ["claimed", "composition-breasted-1901", "composition-old-kingdom", "composition-current", "manuscript", "translation"]);
});

test("every picture of the Egyptian wisdom texts is from Commons, and the unverified ones say so first", () => {
  let unverified = 0;
  for (const workKey of ["egy.ptahhotep", "egy.kagemni", "egy.amenemope", "egy.memphite-theology"]) {
    const file = corpusFor(workKey)!;
    const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
    assert.ok(images.length >= 2, workKey);
    assert.ok(images.some((i) => i.shows === "manuscript" && i.identificationStatus === "secure"), `${workKey} has a securely identified witness`);
    for (const image of images) {
      assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
      assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
      assert.ok(image.licence, image.key);
      if (image.identificationStatus === "unverified") {
        unverified++;
        assert.match(image.caption, /^UNVERIFIED — /, image.key);
        assert.ok(image.whatIsUnverified, image.key);
      }
    }
  }
  assert.equal(unverified, 4);
});

test("the Amduat has Budge's twelve hours, his Short Form beside them, and cites Hornung and the modern translations only", () => {
  const file = assertOpenTextOnly("egy.amduat", ["eng-budge"]);
  const hours = file.passages.filter((p) => p.divisionKind === "hour");
  assert.deepEqual(
    hours.map((p) => p.key),
    Array.from({ length: 12 }, (_, i) => `egy.amd.${i + 1}`)
  );
  const work = INVENTORY.find((w) => w.workKey === "egy.amduat")!;
  assert.equal(work.expectedUnits, 12);
  assert.equal(work.unitDivisionKind, "hour");
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "amduat-corpus");
  for (const hour of hours) {
    assert.equal(hour.layers.some((l) => l.content), false, `${hour.key} holds no text of its own`);
    const cited = hour.layers.filter((l) => l.licence === "copyrighted_reference").map((l) => l.key);
    assert.deepEqual(cited, ["deu-hornung", "eng-abt-hornung", "eng-warburton", "eng-darnell"], hour.key);
    const registers = file.passages.filter((p) => p.parentKey === hour.key);
    assert.ok(registers.length >= 3, hour.key);
    for (const register of registers) assert.ok(register.layers.some((l) => l.key === "eng-budge" && l.content!.length > 0), register.key);
  }
  // Hours 7 to 12 have a middle register: the boat of the sun.
  for (let n = 7; n <= 12; n++) assert.ok(file.passages.some((p) => p.key === `egy.amd.${n}.middle`), `hour ${n}`);
  const short = file.passages.filter((p) => p.parentKey === "egy.amd.short");
  assert.equal(short.length, 12);
  const text = (key: string) => file.passages.find((p) => p.key === key)!.layers.find((l) => l.key === "eng-budge")!.content!;
  assert.match(text("egy.amd.title"), /^"THE WRITINGS AND THE DRAWINGS OF THE HIDDEN PALACE/);
  assert.match(text("egy.amd.1.opening"), /^IN the scene that illustrates the FIRST DIVISION of the Tuat/);
  assert.match(text("egy.amd.7.middle"), /^In the middle register are/);
  for (const passage of file.passages) {
    for (const layer of passage.layers.filter((l) => l.key === "eng-budge")) {
      assert.match(layer.evidence!, /hieroglyphic text, transliteration/, passage.key);
    }
  }
  const dates = file.passages[1].dates!;
  assert.equal(file.passages[1].key, "egy.amd.1");
  assert.deepEqual(
    dates.map((d) => d.role),
    ["composition", "earliest_evidence", "manuscript", "manuscript", "translation_publication"]
  );
  assert.match(dates[0].originalDateText, /disputed/);
  assert.equal(deriveCompleteness(work, { importedUnits: 12, verifiedUnits: 0 }) === "verified_against_edition", false);
});

test("the Book of Gates has Budge's twelve divisions, the Judgment Hall, and both copies of the sixth", () => {
  const file = assertOpenTextOnly("egy.book-of-gates", ["eng-budge"]);
  const hours = file.passages.filter((p) => p.divisionKind === "hour");
  assert.deepEqual(
    hours.map((p) => p.key),
    Array.from({ length: 12 }, (_, i) => `egy.gates.${i + 1}`)
  );
  const work = INVENTORY.find((w) => w.workKey === "egy.book-of-gates")!;
  assert.equal(work.expectedUnits, 12);
  assert.equal(work.unitDivisionKind, "hour");
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "book-of-gates-corpus");
  for (const hour of hours) {
    assert.equal(hour.layers.some((l) => l.content), false, `${hour.key} holds no text of its own`);
    assert.deepEqual(
      hour.layers.filter((l) => l.licence === "copyrighted_reference").map((l) => l.key),
      ["deu-hornung", "eng-hornung-abt", "eng-darnell"],
      hour.key
    );
  }
  // A gate opens every division after the first.
  for (let n = 2; n <= 12; n++) assert.equal(file.passages.find((p) => p.key === `egy.gates.${n}.gate`)?.divisionKind, "gate", `division ${n}`);
  assert.equal(file.passages.some((p) => p.key === "egy.gates.1.gate"), false);
  const sixth = file.passages.filter((p) => p.parentKey === "egy.gates.6").map((p) => p.key.replace("egy.gates.6.", ""));
  assert.deepEqual(sixth, ["hall-1", "hall-2", "gate", "seti-middle", "seti-upper", "seti-lower", "rvi-middle", "rvi-upper", "rvi-lower"]);
  for (const passage of file.passages.filter((p) => p.key.startsWith("egy.gates.6.rvi-"))) {
    assert.deepEqual(passage.witnesses, [{ manuscriptKey: "kv9" }], passage.key);
  }
  const text = (key: string) => file.passages.find((p) => p.key === key)!.layers.find((l) => l.key === "eng-budge")!.content!;
  assert.match(text("egy.gates.1.opening"), /^IN THE FIRST DIVISION of the "Book of Gates of the Tuat,"/);
  assert.match(text("egy.gates.6.hall-1"), /if the judgment of Osiris prove adverse to him/);
  assert.deepEqual(
    file.passages[0].dates!.map((d) => d.role),
    ["composition", "earliest_evidence", "manuscript", "manuscript", "translation_publication"]
  );
  assert.match(file.passages[0].dates![0].originalDateText, /disputed/);
});

test("the Amduat and the Book of Gates are linked as proposed parallels only, never as transmission", () => {
  const links = ["egy.amduat", "egy.book-of-gates"].flatMap((workKey) => corpusFor(workKey)!.links ?? []);
  assert.ok(links.length >= 4);
  assert.ok(links.some((l) => l.from.startsWith("egy.amd.") && l.to.startsWith("egy.gates.")));
  for (const link of links) {
    assert.equal(link.connectionClass, "close_conceptual_parallel", link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.transmissionEvidence, /^None shown\..*never as transmission/, link.key);
  }
});

/** Pictures whose hour, scene or object identification rests on an uploader's label. */
const UNDERWORLD_UNVERIFIED_IMAGES = 9;

test("every picture of the Amduat and the Book of Gates is from Commons, and claimed hours are marked unverified", () => {
  let unverified = 0;
  for (const workKey of ["egy.amduat", "egy.book-of-gates"]) {
    const file = corpusFor(workKey)!;
    const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
    assert.ok(images.length >= 4, workKey);
    assert.ok(images.some((i) => i.identificationStatus === "secure"), `${workKey} has a securely identified witness`);
    for (const image of images) {
      assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
      assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
      assert.ok(image.licence, image.key);
      if (image.identificationStatus === "unverified") {
        unverified++;
        assert.match(image.caption, /^UNVERIFIED — /, image.key);
        assert.ok(image.whatIsUnverified, image.key);
      } else {
        assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
      }
    }
  }
  assert.equal(unverified, UNDERWORLD_UNVERIFIED_IMAGES);
});

test("Stobaeus's Hermetic excerpts have Mead's 27 in full, and cite the Greek and the modern translations only", () => {
  const file = assertOpenTextOnly("herm.stobaeus", ["eng-mead"]);
  const excerpts = file.passages.filter((p) => p.divisionKind === "fragment").map((p) => p.key);
  assert.deepEqual(excerpts, Array.from({ length: 27 }, (_, i) => `herm.sh.ex${i + 1}`));
  const work = INVENTORY.find((w) => w.workKey === "herm.stobaeus")!;
  assert.equal(work.unitDivisionKind, "fragment");
  // Mead prints 27 of the 29 Stobaean Hermetic excerpts, so the work is partial.
  assert.equal(work.expectedUnits, 29);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 27, verifiedUnits: 0 }), "verified_against_edition");
  const withMead = file.passages.filter((p) => p.layers.some((l) => l.key === "eng-mead" && l.content));
  assert.equal(withMead.length, 164);
  assert.match(file.passages.find((p) => p.key === "herm.sh.ex1.8")!.layers[0].content!, /^First God; second the Cosmos/);
  // Mead prints no seventh paragraph in Excerpt III and no 37th in Excerpt XXV.
  assert.ok(!file.passages.some((p) => p.key === "herm.sh.ex3.7" || p.key === "herm.sh.ex25.37"));
  for (const excerpt of file.passages.filter((p) => p.divisionKind === "fragment")) {
    const greek = excerpt.layers.find((l) => l.key === "grc-stobaeus")!;
    assert.equal(greek.content, undefined, excerpt.key);
    const cited = excerpt.layers.filter((l) => l.licence === "copyrighted_reference").map((l) => l.key);
    assert.deepEqual(cited, ["grc-fra-nock-festugiere", "eng-litwa"], excerpt.key);
  }
  for (const link of file.links ?? []) {
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.ok(workForPassageKey(link.to), link.key);
  }
});

test("the Pistis Sophia has Mead's 148 chapters in full, the scribe's additions apart, and cites MacDermot only", () => {
  const file = assertOpenTextOnly("gnostic.pistis-sophia", ["eng-mead"]);
  const chapters = file.passages.filter((p) => p.divisionKind === "chapter").map((p) => p.key);
  assert.deepEqual(chapters, Array.from({ length: 148 }, (_, i) => `gnostic.ps.${i + 1}`));
  const work = INVENTORY.find((w) => w.workKey === "gnostic.pistis-sophia")!;
  assert.equal(work.expectedUnits, 148);
  assert.equal(work.unitDivisionKind, "chapter");
  const withMead = file.passages.filter((p) => p.layers.some((l) => l.key === "eng-mead" && l.content));
  assert.equal(withMead.length, 174);
  for (const key of ["gnostic.ps.scribe-note", "gnostic.ps.subscription-1", "gnostic.ps.subscription-2", "gnostic.ps.postscript"]) {
    assert.ok(withMead.some((p) => p.key === key), key);
  }
  assert.match(file.passages.find((p) => p.key === "gnostic.ps.1")!.layers[0].content!, /^IT came to pass, when Jesus had risen/);
  // A long chapter holds no text itself; its parts do.
  const split = file.passages.find((p) => p.key === "gnostic.ps.86")!;
  assert.ok(split.layers.every((l) => l.content == null));
  assert.deepEqual(
    file.passages.filter((p) => p.parentKey === "gnostic.ps.86").map((p) => p.key),
    ["gnostic.ps.86.1", "gnostic.ps.86.2", "gnostic.ps.86.3"],
  );
  for (const passage of withMead) {
    const text = passage.layers.find((l) => l.key === "eng-mead")!.content!;
    // No side-heading left in the text, and the psalm verses open with Mead's marks.
    assert.doesNotMatch(text, /www\.globalgrey|Pistis Sophia By G\.R\.S\. Mead|^‘“/m, passage.key);
  }
  for (const chapter of file.passages.filter((p) => p.divisionKind === "chapter")) {
    const cited = chapter.layers.filter((l) => l.licence === "copyrighted_reference").map((l) => l.key);
    assert.deepEqual(cited, ["eng-macdermot"], chapter.key);
  }
  for (const link of file.links ?? []) {
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.ok(workForPassageKey(link.to), link.key);
  }
});

test("every picture of Stobaeus and the Pistis Sophia is from Commons, and the unverified ones say so first", () => {
  const expected: Record<string, number> = { "herm.stobaeus": 1, "gnostic.pistis-sophia": 1 };
  for (const [workKey, count] of Object.entries(expected)) {
    const file = corpusFor(workKey)!;
    const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
    assert.ok(images.length >= 2, workKey);
    let unverified = 0;
    for (const image of images) {
      assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
      assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
      assert.ok(image.licence, image.key);
      if (image.identificationStatus === "unverified") {
        unverified++;
        assert.match(image.caption, /^UNVERIFIED — /, image.key);
        assert.ok(image.whatIsUnverified, image.key);
      } else {
        assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
      }
    }
    assert.equal(unverified, count, workKey);
  }
});

test("the Book of the Heavenly Cow has Budge's five sections in full, and cites Hornung and Lichtheim only", () => {
  const file = assertOpenTextOnly("egy.heavenly-cow", ["eng-budge"]);
  const sections = file.passages.filter((p) => p.divisionKind === "section").map((p) => p.key);
  assert.deepEqual(sections, ["egy.cow.1", "egy.cow.2", "egy.cow.3", "egy.cow.4", "egy.cow.5"]);
  const work = INVENTORY.find((w) => w.workKey === "egy.heavenly-cow")!;
  assert.equal(work.unitDivisionKind, "section");
  assert.equal(work.expectedUnits, null);
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "book-of-the-heavenly-cow");
  assert.notEqual(deriveCompleteness(work, { importedUnits: 5, verifiedUnits: 0 }), "verified_against_edition");
  // Sections I and V are split into the archive's parts and hold no text themselves.
  for (const [key, parts] of [["egy.cow.1", 5], ["egy.cow.5", 4]] as const) {
    const section = file.passages.find((p) => p.key === key)!;
    assert.equal(section.layers.some((l) => l.content), false, key);
    const children = file.passages.filter((p) => p.parentKey === key);
    assert.equal(children.length, parts, key);
    assert.ok(children.every((p) => p.divisionKind === "part"), key);
  }
  const withBudge = file.passages.filter((p) => p.layers.some((l) => l.key === "eng-budge" && l.content));
  assert.equal(withBudge.length, 12);
  for (const passage of withBudge) {
    const layer = passage.layers.find((l) => l.key === "eng-budge")!;
    assert.equal(layer.licence, "public_domain", passage.key);
    assert.match(layer.evidence, /hieroglyphic text, transliteration and footnotes are left out/, passage.key);
    assert.deepEqual(passage.witnesses?.map((w) => w.manuscriptKey), ["kv17"], passage.key);
    // No footnote marker or transcriber's heading left in the text.
    assert.doesNotMatch(layer.content!, /FN#|CHAPTER [IVX]|\{|\}/, passage.key);
  }
  const text = (key: string) => file.passages.find((p) => p.key === key)!.layers.find((l) => l.key === "eng-budge")!.content!;
  assert.match(text("egy.cow.1.1"), /^\[Here is the story of Ra,\] the god who was self-begotten and self-created/);
  assert.match(text("egy.cow.2"), /^II\. This Chapter shall be said over \[a figure of\] the cow\./);
  assert.match(text("egy.cow.5.4"), /by means of words of power\.$/);
  // The majority readings of the two printed copies over the e-text.
  assert.match(text("egy.cow.1.3"), /Now when the Majesty of Ra, the King/);
  assert.match(text("egy.cow.5.3"), /step forth in the evening/);
  assert.match(text("egy.cow.1.4"), /and avenge \(\?\) him/);
  for (const section of file.passages.filter((p) => p.divisionKind === "section")) {
    const cited = section.layers.filter((l) => l.licence === "copyrighted_reference").map((l) => l.key);
    assert.deepEqual(cited, section.key === "egy.cow.1" ? ["deu-hornung", "eng-lichtheim"] : ["deu-hornung"], section.key);
  }
  const dates = file.passages[0].dates!;
  assert.equal(file.passages[0].key, "egy.cow.1");
  assert.deepEqual(
    dates.map((d) => d.role),
    ["composition", "earliest_evidence", "manuscript", "manuscript", "manuscript", "manuscript", "translation_publication"]
  );
  assert.match(dates[0].originalDateText, /disputed/);
  assert.match(dates[1].originalDateText, /Tutankhamun/);
  assert.equal(dates[6].startYear, 1912);
  assert.deepEqual(file.manuscripts!.map((m) => m.key), ["kv62-shrine", "kv17", "kv7", "kv11", "kv9"]);
});

test("the Heavenly Cow's links are proposed parallels to passages that exist, never transmission", () => {
  const links = corpusFor("egy.heavenly-cow")!.links ?? [];
  assert.ok(links.length >= 5);
  const targets = links.map((l) => l.to);
  for (const to of ["egy.bd.175", "egy.bd.17", "egy.bd.110", "egy.amd.12.lower", "egy.gates.12.gate", "egy.ct.1130"]) assert.ok(targets.includes(to), to);
  for (const link of links) {
    assert.ok(link.from.startsWith("egy.cow."), link.key);
    assert.equal(link.connectionClass, "close_conceptual_parallel", link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.transmissionEvidence, /^None shown\..*never as transmission/, link.key);
  }
});

test("every picture of the Heavenly Cow is from Commons, the witnesses come first, and the unverified ones say so first", () => {
  const file = corpusFor("egy.heavenly-cow")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  assert.equal(images.length, 5);
  assert.equal(images[0].key, "cow-kv62-outermost-shrine-burton-1923");
  assert.equal(images[0].identificationStatus, "secure");
  let unverified = 0;
  for (const image of images) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.ok(image.licence, image.key);
    if (image.identificationStatus === "unverified") {
      unverified++;
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else {
      assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
    }
    // The two pictures already on the marker are not repeated.
    assert.doesNotMatch(image.url, /Himmelskuh_grab_sethos|Book_of_the_Heavenly_Cow_KV62/, image.key);
  }
  assert.equal(unverified, 2);
  // Related evidence says it is not an illustration of the book.
  for (const image of images.filter((i) => i.key.startsWith("cow-hathor") || i.key.startsWith("cow-sekhmet"))) {
    assert.match(image.caption, /^Related evidence, not an illustration of this book/, image.key);
  }
});

test("the Secret of Secrets has Ismail Ali's English of the Arabic in full, by discourse, and cites Manzalaoui and Badawi only", () => {
  const file = assertOpenTextOnly("arab.secretum-secretorum", ["eng-ismail-ali"]);
  const work = INVENTORY.find((w) => w.workKey === "arab.secretum-secretorum")!;
  assert.equal(work.unitDivisionKind, "chapter");
  assert.equal(work.expectedUnits, null);
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "secretum-secretorum");
  const discourses = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind).map((p) => p.key);
  assert.deepEqual(discourses, Array.from({ length: 10 }, (_, i) => `arab.secretum.${i + 1}`));
  assert.notEqual(deriveCompleteness(work, { importedUnits: 10, verifiedUnits: 0 }), "verified_against_edition");
  assert.equal(file.passages[0].key, "arab.secretum.0");
  assert.equal(file.passages[0].divisionKind, "section");
  // The long discourses are split into the archive's parts and hold no text themselves; V–VIII are whole.
  for (const [d, parts] of [[0, 2], [1, 2], [2, 20], [3, 2], [4, 7], [9, 3], [10, 9]] as const) {
    const key = `arab.secretum.${d}`;
    const discourse = file.passages.find((p) => p.key === key)!;
    assert.equal(discourse.layers.some((l) => l.content), false, key);
    const children = file.passages.filter((p) => p.parentKey === key);
    assert.equal(children.length, parts, key);
    assert.ok(children.every((p) => p.divisionKind === "part"), key);
  }
  for (const d of [5, 6, 7, 8]) {
    const key = `arab.secretum.${d}`;
    assert.ok(file.passages.find((p) => p.key === key)!.layers.some((l) => l.key === "eng-ismail-ali" && l.content), key);
    assert.equal(file.passages.filter((p) => p.parentKey === key).length, 0, key);
  }
  const withText = file.passages.filter((p) => p.layers.some((l) => l.key === "eng-ismail-ali" && l.content));
  assert.equal(withText.length, 49);
  for (const passage of withText) {
    const layer = passage.layers.find((l) => l.key === "eng-ismail-ali")!;
    assert.match(layer.evidence, /footnotes \(the variants of the other manuscripts\), marginal notes and apparatus are left out/, passage.key);
    assert.match(layer.evidence, /three printed copies/, passage.key);
    assert.equal(passage.witnesses?.length, 1, passage.key);
    // No OCR debris: a figure 0 for the vocative O, a stray asterisk or a footnote figure.
    assert.doesNotMatch(layer.content!, /\b0 Alexander|\*|[a-z][0-9]\b/, passage.key);
  }
  // The two passages Steele's footnotes give to one other manuscript only.
  assert.deepEqual(file.passages.find((p) => p.key === "arab.secretum.10.3")!.witnesses!.map((w) => w.manuscriptKey), ["gotha-1870"]);
  assert.deepEqual(file.passages.find((p) => p.key === "arab.secretum.10.4")!.witnesses!.map((w) => w.manuscriptKey), ["bl-or-3118"]);
  const text = (key: string) => file.passages.find((p) => p.key === key)!.layers.find((l) => l.key === "eng-ismail-ali")!.content!;
  assert.match(text("arab.secretum.0.1"), /^In the name of God, the Merciful, the Compassionate\./);
  assert.match(text("arab.secretum.0.1"), /known as Dhu ’l-Karnain/);
  assert.match(text("arab.secretum.1.1"), /^Discourse I\.\n\nOn the Kinds of Kings\./);
  assert.match(text("arab.secretum.10.7"), /^And truly has our ancestor Hermes Trismegistus said:/);
  assert.match(text("arab.secretum.10.7"), /Whose father is the Sun and mother the Moon\./);
  assert.match(text("arab.secretum.10.9"), /Praise be to God, Lord of the worlds\. Amen\.$/);
  // Readings the OCRs lost, restored from the page images.
  assert.match(text("arab.secretum.2.8"), /23⅓ hours/);
  assert.match(text("arab.secretum.2.9"), /88 days and 17 1\/12 hours/);
  assert.match(text("arab.secretum.9.3"), /^On the Victorious and the Defeated\.\n\n.*\n\nA \(1\)\. B \(2\)\. J \(3\)\./);
  // Only Manzalaoui and Badawi are cited, on every discourse.
  for (const discourse of file.passages.filter((p) => p.parentKey == null)) {
    const cited = discourse.layers.filter((l) => l.licence === "copyrighted_reference").map((l) => l.key);
    assert.deepEqual(cited, ["ara-badawi", "eng-manzalaoui"], discourse.key);
  }
  const dates = file.passages[0].dates!;
  assert.deepEqual(
    dates.map((d) => d.role),
    ["composition", "translation_publication", "translation_publication", "manuscript", "manuscript", "translation_publication"]
  );
  assert.match(dates[0].originalDateText, /disputed/);
  assert.match(dates[0].evidence, /Yuhanna ibn al-Batrik/);
  assert.equal(dates[2].endYear, 1254);
  assert.equal(dates[5].startYear, 1920);
  assert.equal(file.manuscripts![0].key, "gotha-1869");
  assert.equal(file.manuscripts![0].startYear, undefined);
});

test("the Secret of Secrets' Emerald Tablet has a key of its own, linked to the Tablet's versions as proposed parallels only", () => {
  const file = corpusFor("arab.secretum-secretorum")!;
  const tablet = file.passages.find((p) => p.key === "arab.secretum.10.7")!;
  assert.match(tablet.label, /Emerald Tablet/);
  assert.ok(tablet.layers.some((l) => l.key === "lat-philip" && l.content == null && /arab\.tab\.secretum/.test(l.contentAbsentReason!)));
  const links = file.links ?? [];
  const targets = links.map((l) => l.to);
  for (const to of ["arab.tab.secretum", "arab.tab.arabic", "arab.tab.secretum.17"]) assert.ok(targets.includes(to), to);
  const tabletKeys = new Set(corpusFor("arab.emerald-tablet")!.passages.map((p) => p.key));
  for (const link of links) {
    assert.equal(link.from, "arab.secretum.10.7", link.key);
    assert.ok(tabletKeys.has(link.to), link.key);
    assert.equal(link.connectionClass, "close_conceptual_parallel", link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.transmissionEvidence, /^None shown( here)?\..*never as transmission/, link.key);
  }
});

test("every picture of the Secret of Secrets is from Commons, none repeats the marker, and the unverified ones say so first", () => {
  const file = corpusFor("arab.secretum-secretorum")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  assert.equal(images.length, 5);
  assert.equal(images[0].key, "secretum-bl-add-47680-alexander-aristotle");
  let unverified = 0;
  for (const image of images) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.ok(image.licence, image.key);
    if (image.identificationStatus === "unverified") {
      unverified++;
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else {
      assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
    }
    // The three pictures already on the marker are not repeated.
    assert.doesNotMatch(image.url, /Tabula_ex_Secretum_Secretorum|Canon\._Class\._Lat\._135|Secret_of_secrets_a/, image.key);
  }
  assert.equal(unverified, 2);
  // The Latin and Russian pictures say they are not the Arabic translated here.
  for (const image of images.filter((i) => i.identificationStatus === "secure")) {
    assert.match(image.caption, /not the Arabic translated here|not this Arabic text/, image.key);
  }
});

test("Hortulanus's commentary is imported in the English of 1597, with the Tablet as that book prints it, and the Latin cited", () => {
  const file = assertOpenTextOnly("arab.tablet-commentaries", ["eng-1597"]);
  const work = INVENTORY.find((w) => w.workKey === "arab.tablet-commentaries")!;
  assert.equal(work.unitDivisionKind, "chapter");
  assert.equal(work.expectedUnits, null);
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "hortulanus-emerald-tablet-commentary");
  const chapters = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind).map((p) => p.key);
  assert.deepEqual(chapters, Array.from({ length: 13 }, (_, i) => `arab.comm.hort.${i + 1}`));
  assert.notEqual(deriveCompleteness(work, { importedUnits: 13, verifiedUnits: 0 }), "verified_against_edition");
  assert.equal(file.passages[0].key, "arab.comm.hort");
  assert.equal(file.passages[0].divisionKind, "treatise");
  // The treatise holds no text; the Latin is cited, not transcribed, and Linden only cited.
  const top = file.passages[0];
  assert.equal(top.layers.some((l) => l.content), false);
  assert.ok(top.layers.some((l) => l.key === "lat-de-alchemia-1541" && l.contentAbsentReason && /only one copy/.test(l.contentAbsentReason)));
  assert.deepEqual(top.layers.filter((l) => l.licence === "copyrighted_reference").map((l) => l.key), ["eng-linden"]);
  const withText = file.passages.filter((p) => p.layers.some((l) => l.key === "eng-1597" && l.content));
  assert.equal(withText.length, 16);
  for (const passage of withText) {
    assert.equal(passage.parentKey, "arab.comm.hort", passage.key);
    const layer = passage.layers.find((l) => l.key === "eng-1597")!;
    assert.match(layer.evidence, /EEBO-TCP A01683/, passage.key);
    assert.match(layer.evidence, /translator is not named/, passage.key);
    assert.deepEqual(passage.witnesses!.map((w) => w.manuscriptKey), ["huntington-1597", "countway-1597"], passage.key);
    // No transcription debris: long s, gap markers, brackets or a page number.
    assert.doesNotMatch(layer.content!, /ſ|〈|\[|\]|\bp\. \d/, passage.key);
  }
  const text = (key: string) => file.passages.find((p) => p.key === key)!.layers.find((l) => l.key === "eng-1597")!.content!;
  assert.match(text("arab.comm.hort.tablet"), /^The Smaragdine Table of Hermes, Trismegistus of Alchimy\.\n\nTHe wordes of the secrets of Hermes/);
  assert.match(text("arab.comm.hort.tablet"), /His father is the sun, his mother is the moone/);
  assert.match(text("arab.comm.hort.tablet"), /Here endeth the Table of Hermes\.$/);
  assert.match(text("arab.comm.hort.prayer"), /^A briefe Commentarie of Hortulanus the Philosopher/);
  assert.match(text("arab.comm.hort.preface"), /wrapped in a Iacobin skinne/);
  assert.match(text("arab.comm.hort.1"), /^CHAP\. I\.\n\nThat the Art of Alchimy is true and certaine\.\n\nTHe Philosopher saith\./);
  assert.match(text("arab.comm.hort.10"), /^CHAP X\.\n\n/);
  assert.match(text("arab.comm.hort.13"), /Thus endeth the Commentarie of Hortulanus, vppon the Smaragdine table of Hermes, the father of Philosophers\.$/);
  // The printer's misprints are kept, and the other copy's press variants recorded.
  assert.match(text("arab.comm.hort.tablet"), /and and againe/);
  assert.match(text("arab.comm.hort.tablet"), /adatpations/);
  assert.match(file.passages.find((p) => p.key === "arab.comm.hort.tablet")!.witnesses![1].variantNote!, /tha gently/);
  // Dates: Hortulanus disputed; the Latin printed in 1541; the English in 1597.
  const dates = top.dates!;
  assert.deepEqual(dates.map((d) => d.role), ["composition", "translation_publication", "translation_publication"]);
  assert.match(dates[0].originalDateText, /disputed/);
  assert.match(dates[0].evidence, /^Disputed\./);
  assert.equal(dates[1].startYear, 1541);
  assert.equal(dates[2].startYear, 1597);
  // The Bacon attribution is reported as the title page's claim, and doubted.
  assert.match(dates[2].evidence, /attribution is a claim, which scholars doubt/);
  assert.equal(work.inventoryVerified, false);
});

test("Hortulanus's chapters are linked to the Tablet lines they explain, as proposed later readings only", () => {
  const file = corpusFor("arab.tablet-commentaries")!;
  const links = file.links ?? [];
  const keys = new Set(ALL_CORPORA.flatMap((c) => c.passages.map((p) => p.key)));
  for (const link of links) {
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.ok(keys.has(link.from), `${link.key}: ${link.from}`);
    assert.ok(keys.has(link.to), `${link.key}: ${link.to}`);
  }
  const glosses = links.filter((l) => /^hortulanus-\d+-explains-vulgate-\d\d$/.test(l.key));
  assert.equal(glosses.length, 21);
  for (const link of glosses) {
    assert.match(link.from, /^arab\.comm\.hort\.\d+$/, link.key);
    assert.match(link.to, /^arab\.tab\.vulgate\.\d\d$/, link.key);
    assert.equal(link.connectionClass, "later_reinterpretation", link.key);
  }
  // Every chapter explains at least one line, and every line of the vulgate is explained.
  assert.equal(new Set(glosses.map((l) => l.from)).size, 13);
  assert.deepEqual(
    [...new Set(glosses.map((l) => l.to))].sort(),
    Array.from({ length: 18 }, (_, i) => `arab.tab.vulgate.${String(i + 1).padStart(2, "0")}`)
  );
  const secretum = links.find((l) => l.to === "arab.secretum.10.7")!;
  assert.match(secretum.transmissionEvidence, /^None shown\..*never as transmission/);
  for (const link of links.filter((l) => l.from.startsWith("modern.hpb."))) {
    assert.match(link.transmissionEvidence, /^None shown\./, link.key);
  }
  assert.equal(links.length, 25);
});

test("every picture of Hortulanus and the 1597 book is from Commons, none repeats the marker or the Tablet, and the unverified one says so first", () => {
  const file = corpusFor("arab.tablet-commentaries")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  assert.equal(images.length, 4);
  assert.equal(images[0].key, "hortulanus-mirror-1597-title-page");
  let unverified = 0;
  for (const image of images) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.ok(image.licence, image.key);
    if (image.identificationStatus === "unverified") {
      unverified++;
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else {
      assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
    }
    assert.doesNotMatch(image.url, /Emerald_Tablet_Johannes_Petreius|Smaragdtafel|Chrysogonus|M0012393/, image.key);
  }
  assert.equal(unverified, 1);
  assert.equal(images.find((i) => i.key === "hortulanus-mirror-1597-printers-device")!.duplicateOf, "hortulanus-mirror-1597-title-page");
});

test("Blavatsky's Stanzas of Dzyan are imported stanza by stanza, apart from her commentary, with twenty passages of her prose, each cited by first-edition volume and page", () => {
  const file = assertOpenTextOnly("modern.blavatsky", ["eng-blavatsky"]);
  const work = INVENTORY.find((w) => w.workKey === "modern.blavatsky")!;
  assert.equal(work.unitDivisionKind, "section");
  assert.equal(work.expectedUnits, null);
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "blavatsky-isis-unveiled");
  // The selection is listed by volume and page, yet is the archive's choice, not a stated count.
  assert.match(work.inventoryBasis, /vol\. I pp\. 27–34/);
  assert.match(work.inventoryBasis, /vol\. II pp\. 15–21/);
  assert.match(work.inventoryBasis, /39 units/);
  const units = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  assert.equal(units.length, 39);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 39, verifiedUnits: 0 }), "verified_against_edition");
  // Five parts, holding no text of their own.
  const parts = file.passages.filter((p) => p.divisionKind === "part").map((p) => p.key);
  assert.deepEqual(parts, ["modern.hpb.isis", "modern.hpb.sd.1", "modern.hpb.cosmo", "modern.hpb.anthro", "modern.hpb.sd.2"]);
  for (const key of parts) assert.equal(file.passages.find((p) => p.key === key)!.layers.length, 0, key);
  // One unit per stanza: seven of Cosmogenesis, twelve of Anthropogenesis holding slokas 1–49.
  const stanzas = (book: string) => file.passages.filter((p) => p.parentKey === `modern.hpb.${book}`).map((p) => p.key);
  assert.deepEqual(stanzas("cosmo"), Array.from({ length: 7 }, (_, i) => `modern.hpb.cosmo.${i + 1}`));
  assert.deepEqual(stanzas("anthro"), Array.from({ length: 12 }, (_, i) => `modern.hpb.anthro.${i + 1}`));
  const text = (key: string) => file.passages.find((p) => p.key === key)!.layers.find((l) => l.key === "eng-blavatsky")!.content!;
  const slokas = stanzas("anthro").flatMap((key) => [...text(key).matchAll(/(?:^|\n\n)(\d+)\. /g)].map((m) => Number(m[1])));
  assert.deepEqual(slokas, Array.from({ length: 49 }, (_, i) => i + 1));
  assert.match(text("modern.hpb.cosmo.1"), /^1\. The eternal parent wrapped in her ever invisible robes/);
  assert.match(text("modern.hpb.cosmo.7"), /descend on radiant earth and reign over men — who are themselves\. \. \. \.$/);
  assert.match(text("modern.hpb.anthro.1"), /^1\. The Lha which turns the fourth/);
  assert.match(text("modern.hpb.anthro.12"), /who taught and instructed it\. \. \. \. \. \.$/);
  // The Stanzas are the Stanzas only: her commentary and closing words are not in them.
  for (const key of [...stanzas("cosmo"), ...stanzas("anthro")]) {
    assert.doesNotMatch(text(key), /Thus ends this portion|STANZA|Commentary|\(a\)/, key);
    assert.match(file.passages.find((p) => p.key === key)!.reference, /^The Secret Doctrine \(1888\), vol\. II?, pp?\. \d+/, key);
  }
  // Readings restored from the page images, and first-edition misprints kept.
  assert.match(text("modern.hpb.cosmo.4"), /enclosed within the ◯ are the sacred four/);
  assert.match(text("modern.hpb.cosmo.4"), /which is:\n\n5\. “Darkness” the boundless/);
  assert.match(text("modern.hpb.cosmo.3"), /the white brillant son/);
  assert.match(text("modern.hpb.anthro.4"), /were I to give it mine\.” said the Great Fire/);
  // The selected passages: nine from Isis Unveiled, eleven from The Secret Doctrine.
  const selected = file.passages.filter((p) => p.divisionKind === "section" && !/\.(cosmo|anthro)\./.test(p.key));
  assert.equal(selected.length, 20);
  assert.equal(selected.filter((p) => p.sourceKey === "blavatsky-isis").length, 9);
  for (const passage of selected) {
    assert.match(passage.reference, /^(Isis Unveiled \(1877\)|The Secret Doctrine \(1888\)), vol\. II?, pp?\. [0-9ivxlc]+/, passage.key);
  }
  assert.match(text("modern.hpb.isis.1.507"), /^Tradition declares that on the dead body of Hermes, at Hebron/);
  assert.match(text("modern.hpb.isis.1.507"), /"By it the world was formed\."$/);
  assert.match(text("modern.hpb.sd.1.viii"), /who has ever even heard ot the book of Dzyan\?/);
  assert.match(text("modern.hpb.sd.1.viii"), /the charge of having invented the whole of it/);
  assert.match(text("modern.hpb.sd.1.xxii"), /utterly unknown to our Philologists/);
  assert.match(text("modern.hpb.sd.1.xx"), /^\[Footnote\] Dan, now become/);
  assert.match(text("modern.hpb.sd.2.1"), /\n\n\[Footnote\] Thus saith Pymander/);
  assert.match(text("modern.hpb.sd.2.6"), /\[Greek, given in the online edition's transliteration: [^\]]+\]/);
  assert.match(text("modern.hpb.sd.2.6"), /some 12,000 years ago, and was followed by the submersion/);
  for (const passage of file.passages) {
    const layer = passage.layers.find((l) => l.key === "eng-blavatsky");
    if (!layer) continue;
    assert.match(layer.evidence, /first edition, 18(77|88)/, passage.key);
    assert.match(layer.evidence, /compared word by word with the archive\.org OCRs/, passage.key);
    // No page lines, footnote marks or a paragraph broken by a page.
    assert.doesNotMatch(layer.content!, /Vol\. \d, Page|Footnote\(s\)|[†‡§¶]|\[\[|[a-z,;]\n\n[a-z]|(?<!\n)\n(?!\n)/, passage.key);
  }
});

test("the Book of Dzyan's antiquity is recorded as Blavatsky's claim, its composition in the 1880s, and Coleman's verdict is cited", () => {
  const file = corpusFor("modern.blavatsky")!;
  const dates = (key: string) => file.passages.find((p) => p.key === key)!.dates!;
  assert.deepEqual(dates("modern.hpb.isis").map((d) => [d.role, d.startYear]), [["translation_publication", 1877]]);
  assert.deepEqual(dates("modern.hpb.sd.1").map((d) => [d.role, d.startYear]), [["translation_publication", 1888]]);
  const dzyan = dates("modern.hpb.cosmo");
  assert.deepEqual(dzyan.map((d) => d.role), ["claimed", "composition", "translation_publication"]);
  const [claimed, composition] = dzyan;
  assert.equal(claimed.startYear, undefined, "a claim of antiquity is given no year");
  assert.match(claimed.evidence, /Blavatsky's claim, not a date/);
  assert.match(claimed.evidence, /No manuscript has ever been produced/);
  assert.deepEqual([composition.startYear, composition.endYear], [1880, 1888]);
  assert.equal(composition.sourceKey, "coleman-1895");
  assert.match(composition.evidence, /The Book of Dzyan was the work of Madame Blavatsky/);
  assert.match(composition.evidence, /London, October 1888/);
  const coleman = INVENTORY_SOURCES.find((s) => s.key === "coleman-1895")!;
  assert.equal(coleman.publishedYear, 1895);
  assert.match(coleman.reference!, /A Modern Priestess of Isis.*pp\. 353–366/);
  assert.ok(file.sources.some((s) => s.key === "coleman-1895"));
  // The parts and her own preface frame the Stanzas' claim honestly.
  assert.match(file.passages.find((p) => p.key === "modern.hpb.cosmo")!.notes!, /no manuscript has ever been produced, and Coleman \(1895\)/);
  assert.match(file.passages.find((p) => p.key === "modern.hpb.anthro")!.notes!, /Only forty-nine Slokas out of several hundred/);
});

test("Blavatsky's links say she quotes, cites or retells the earlier text, and none claims ancient transmission", () => {
  const file = corpusFor("modern.blavatsky")!;
  const links = file.links ?? [];
  assert.ok(links.length >= 10);
  const targets = new Set(links.map((l) => l.to));
  for (const to of ["arab.tab.vulgate", "herm.ch.1.16", "herm.ascl.24.3", "egy.bd.125", "greek.tim.25d", "greek.crit.113c", "modern.doreal.01"]) {
    assert.ok(targets.has(to), to);
  }
  for (const link of links) {
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^modern\.hpb\./, link.key);
    assert.notEqual(link.connectionClass, "documented_transmission", link.key);
    if (link.to.startsWith("modern.")) {
      assert.equal(link.connectionClass, "broad_thematic_resemblance", link.key);
      assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    } else {
      assert.equal(link.connectionClass, "later_reinterpretation", link.key);
      assert.match(link.transmissionEvidence, /^She (names|attributes)/, link.key);
      assert.match(link.transmissionEvidence, /not a witness to the earlier text/, link.key);
    }
  }
});

test("Blavatsky's pictures are first-edition pages and portraits from Commons, none repeats the marker, and the unverified ones say so first", () => {
  const file = corpusFor("modern.blavatsky")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  assert.equal(images.length, 9);
  let unverified = 0;
  for (const image of images) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.ok(image.licence, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    if (image.identificationStatus === "unverified") {
      unverified++;
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else {
      assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
    }
    // The picture already on the marker is not repeated, nor the modern paperback cover.
    assert.doesNotMatch(image.url, /Isis_Unveiled\.jpg|The_Secret_Doctrine\.gif/, image.key);
    // There is no manuscript of the Book of Dzyan to show.
    assert.notEqual(image.shows, "manuscript", image.key);
  }
  assert.equal(unverified, 2);
  const pages = images.filter((i) => i.shows === "historical_document");
  assert.equal(pages.length, 4);
  for (const image of pages) assert.match(image.url, /\.pdf\/page\d+-960px-/, image.key);
});

test("Steiner's Atlantis and Lemuria is imported whole in the English of 1911, in 26 sections under ten chapters, with the German and Cosmic Memory cited", () => {
  const file = corpusFor("modern.steiner")!;
  const work = INVENTORY.find((w) => w.workKey === "modern.steiner")!;
  assert.equal(work.unitDivisionKind, "section");
  assert.equal(work.expectedUnits, null);
  assert.equal(work.inventoryVerified, false, "the sections are the archive's division, listed by paragraph, not by page");
  assert.equal(work.anchor && "existingSlug" in work.anchor && work.anchor.existingSlug, "steiner-lemurian-epoch");
  assert.match(work.inventoryBasis, /26 sections/);
  assert.match(work.copyrightSummary, /Gysi/);
  // One book record and ten chapter records, holding no 1911 text of their own.
  assert.equal(file.passages[0].key, "modern.steiner.1911");
  assert.equal(file.passages[0].divisionKind, "book");
  const chapters = file.passages.filter((p) => p.divisionKind === "chapter");
  assert.deepEqual(chapters.map((p) => p.key), Array.from({ length: 10 }, (_, i) => `modern.steiner.1911.${i + 1}`));
  for (const chapter of chapters) assert.equal(chapter.layers.length, 0, chapter.key);
  const units = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  assert.equal(units.length, 26);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 26, verifiedUnits: 0 }), "verified_against_edition");
  const perChapter = chapters.map((c) => units.filter((u) => u.parentKey === c.key).length);
  assert.deepEqual(perChapter, [1, 4, 3, 2, 2, 3, 3, 3, 2, 3]);
  // The 1911 English, public domain in the United States, with the method and its limits stated.
  const text = (key: string) => file.passages.find((p) => p.key === `modern.steiner.1911.${key}`)!.layers.find((l) => l.key === "eng-1911")!.content!;
  for (const unit of units) {
    const layer = unit.layers.find((l) => l.key === "eng-1911")!;
    assert.equal(layer.licence, "public_domain_us", unit.key);
    assert.equal(layer.layer, "translation", unit.key);
    assert.match(layer.evidence, /Only one transcription of the 1911 English could be reached, and no page image of the book/, unit.key);
    assert.match(layer.evidence, /Gysi's death date was not established/, unit.key);
    assert.match(unit.reference, /^Atlantis and Lemuria \(London, 1911\), chapter [IVX]+, '.+', the Rudolf Steiner Archive's paragraphs.* \[\d+(–\d+)?\]$/, unit.key);
    // No paragraph broken by a page, no stray markup.
    assert.doesNotMatch(layer.content!, /[a-z,;]\n\n[a-z]|(?<!\n)\n(?!\n)|<|Not translated|⟦|⟧/, unit.key);
  }
  assert.match(text("1.1"), /^It is but a small part of prehistoric human experience which can be learnt by the methods of ordinary history\./);
  assert.match(text("1.1"), /Plato still told of the last remnant of this land—the Island of Poseidonis/);
  assert.match(text("1.1"), /In the little book, The Story of Atlantis, by W\. Scott-Elliot/);
  assert.match(text("1.1"), /\n\n\[Footnote\] Published by the Theosophical Publishing Society, London\.$/);
  assert.match(text("2.1"), /^Our Atlantean ancestors differed more/);
  assert.match(text("2.2"), /According to the nomenclature of the “Secret Doctrine,” Lemurians, Atlanteans, and Âryans are Root-Races/);
  assert.match(text("4.1"), /^The following contains a fragment from the Âkâshic Records/);
  assert.match(text("5.1"), /^The development undergone by woman during the Lemurian era/);
  assert.match(text("8.1"), /\[See An Outline Of Occult Science, by Rudolf Steiner, Ph\.D\.\]/);
  assert.match(text("10.3"), /what we find in the worlds to-day\.$/);
  // The two corrections by hand, and the disputed readings kept as the transcription has them.
  assert.match(text("5.2"), /what had been done by the leaders/);
  assert.doesNotMatch(text("5.2"), /clone/);
  assert.match(text("10.1"), /is, of course, one which merely approaches/);
  assert.match(text("4.2"), /mastery of natural forces was learnt/);
  assert.match(text("1.1"), /palaeontology/);
  const notes = (key: string) => file.passages.find((p) => p.key === `modern.steiner.1911.${key}`)!.notes ?? "";
  assert.match(notes("4.2"), /The Bookman quoted the phrase in 1911 as 'were learnt'/);
  assert.match(notes("1.1"), /'paleontology'/);
  assert.match(notes("5"), /'Not translated'/);
  assert.match(notes("10.3"), /English editor's/);
  for (const key of ["2", "3", "4", "5", "7", "2.2", "2.4", "4.2", "5.2", "7.3"]) assert.match(notes(key), /the text's own racial theory/, key);
  // The German and the later translation are cited, never reproduced.
  const book = file.passages[0];
  const german = book.layers.find((l) => l.key === "deu-akasha-chronik")!;
  assert.equal(german.content, undefined);
  assert.equal(german.licence, "public_domain");
  assert.match(german.contentAbsentReason!, /only German text reached is a later edition's/);
  const later = book.layers.find((l) => l.key === "eng-cosmic-memory")!;
  assert.equal(later.licence, "copyrighted_reference");
  assert.equal(later.content, undefined);
  for (const key of ["steiner-atlantis-lemuria-1911", "steiner-akasha-chronik", "steiner-cosmic-memory-1959", "scott-elliot-atlantis-1896", "bookman-1911"]) {
    assert.ok(file.sources.some((s) => s.key === key), key);
  }
});

test("Steiner's Akashic Records are recorded as his claim, the writing dated to Lucifer-Gnosis 1904–08, the English to 1911", () => {
  const file = corpusFor("modern.steiner")!;
  const dates = file.passages.find((p) => p.key === "modern.steiner.1911")!.dates!;
  assert.deepEqual(dates.map((d) => d.role), ["claimed", "composition", "translation_publication"]);
  const [claimed, composition, english] = dates;
  assert.equal(claimed.startYear, undefined, "a claim read from the Akashic Records is given no year");
  assert.match(claimed.evidence, /^Steiner's claim, not a date/);
  assert.match(claimed.evidence, /Scott-Elliot's The Story of Atlantis/);
  assert.deepEqual([composition.startYear, composition.endYear], [1904, 1908]);
  assert.equal(composition.sourceKey, "steiner-akasha-chronik");
  assert.match(composition.originalDateText, /twenty articles between July 1904 and May 1908 in the magazine Lucifer-Gnosis/);
  assert.deepEqual([english.startYear, english.endYear, english.isApproximate], [1911, 1911, false]);
  assert.match(english.evidence, /The Bookman/);
  assert.match(english.evidence, /Publishers Weekly, 21 October 1911/);
  // The marker that already exists gets the claim and the English, not a second composition date.
  const work = INVENTORY.find((w) => w.workKey === "modern.steiner")!;
  const extra = work.anchor && "existingSlug" in work.anchor ? (work.anchor.extraClaims ?? []) : [];
  assert.deepEqual(
    extra.map((c) => dateRoleFromWhatIsDated(c.whatIsDated!)),
    ["claimed", "translation_publication"]
  );
  assert.equal(extra[0].startYear, undefined);
});

test("Steiner's links say he retells Plato and the Theosophists, or only parallels them, and none claims ancient transmission", () => {
  const file = corpusFor("modern.steiner")!;
  const links = file.links ?? [];
  assert.ok(links.length >= 12);
  const targets = new Set(links.map((l) => l.to));
  for (const to of ["greek.tim.24e", "greek.tim.25d", "greek.crit.113c", "modern.hpb.sd.2.6", "modern.hpb.anthro.12", "modern.doreal.01", "modern.doreal.05"]) {
    assert.ok(targets.has(to), to);
  }
  for (const link of links) {
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^modern\.steiner\.1911\./, link.key);
    assert.notEqual(link.connectionClass, "documented_transmission", link.key);
    if (link.to.startsWith("modern.doreal.")) {
      assert.equal(link.connectionClass, "broad_thematic_resemblance", link.key);
      assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    } else if (link.connectionClass === "later_reinterpretation") {
      // A retelling only where he names his source, and never as a witness to it.
      assert.match(link.transmissionEvidence, /^He names /, link.key);
      assert.match(link.transmissionEvidence, /not a witness to the earlier text/, link.key);
    } else {
      assert.equal(link.connectionClass, "close_conceptual_parallel", link.key);
      assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    }
  }
  // Plato is retold, through a name that is not Plato's.
  const plato = links.filter((l) => l.to.startsWith("greek."));
  assert.equal(plato.length, 3);
  for (const link of plato) assert.equal(link.connectionClass, "later_reinterpretation", link.key);
  assert.ok(plato.some((l) => /Poseidonis', a name that is not Plato's/.test(l.transmissionEvidence)));
});

test("Steiner's pictures are from Commons, none repeats the marker, and the unverified ones say so first", () => {
  const file = corpusFor("modern.steiner")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  assert.equal(images.length, 6);
  let unverified = 0;
  for (const image of images) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.ok(image.licence, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    if (image.identificationStatus === "unverified") {
      unverified++;
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else {
      assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
    }
    // The pictures already on the marker are not repeated.
    assert.doesNotMatch(image.url, /Steiner_um_1905|Goetheanum_Dornach/, image.key);
  }
  assert.equal(unverified, 4);
  const magazine = images.find((i) => i.key === "steiner-lucifer-gnosis-1904-06")!;
  assert.equal(magazine.identificationStatus, "secure");
  assert.match(magazine.objectDate!, /Juni 1904/);
});

test("the Kybalion is imported whole from the 1908 first edition, the Introduction and fifteen chapters, with the majority reading and the fixes by hand", () => {
  const file = corpusFor("modern.kybalion")!;
  const work = INVENTORY.find((w) => w.workKey === "modern.kybalion")!;
  assert.equal(work.passagePrefix, "modern.kyb");
  assert.equal(work.traditionClass, "modern_claiming_ancient");
  assert.equal(work.unitDivisionKind, "chapter");
  assert.equal(work.expectedUnits, 16);
  assert.equal(work.inventoryVerified, true, "the count is the book's own Contents");
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "kybalion-published");
  assert.match(work.attributionNote!, /usually attributed to William Walker Atkinson/);
  assert.match(work.attributionNote!, /not in the Corpus Hermeticum or the Asclepius/);
  // The other-authors entry says the Kybalion now has its own.
  const others = INVENTORY.find((w) => w.workKey === "modern.other-authors")!;
  assert.ok(others.proposedMembers!.some((m) => /Kybalion.*imported as its own work, modern\.kybalion/.test(m)));
  assert.ok(!others.fullTextEditions.some((e) => /Kybalion/.test(e)));
  // One book record, holding only the cited Definitive Edition, and sixteen chapters with the text.
  assert.equal(file.passages[0].key, "modern.kyb.1908");
  assert.equal(file.passages[0].divisionKind, "book");
  const deslippe = file.passages[0].layers.find((l) => l.key === "eng-deslippe-2011")!;
  assert.equal(deslippe.licence, "copyrighted_reference");
  assert.equal(deslippe.content, undefined);
  const units = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  assert.deepEqual(units.map((u) => u.key), ["modern.kyb.1908.intro", ...Array.from({ length: 15 }, (_, i) => `modern.kyb.1908.${i + 1}`)]);
  assert.equal(file.passages.length, 17);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 16, verifiedUnits: 0 }), "verified_against_edition");
  const text = (id: string) => file.passages.find((p) => p.key === `modern.kyb.1908.${id}`)!.layers.find((l) => l.key === "eng-1908")!.content!;
  for (const unit of units) {
    assert.equal(unit.verificationStatus, "unverified", unit.key);
    const layer = unit.layers.find((l) => l.key === "eng-1908")!;
    assert.equal(layer.licence, "public_domain", unit.key);
    assert.equal(layer.layer, "primary_text", unit.key);
    assert.match(layer.evidence, /compared word by word with the archive\.org OCRs of that copy and of three other 1908 copies/, unit.key);
    assert.match(layer.evidence, /Project Gutenberg #14209/, unit.key);
    assert.match(unit.reference, /^The Kybalion \(Chicago, 1908\), (Introduction|chapter [IVX]+, '.+'), pp\. \d+–\d+$/, unit.key);
    assert.ok(unit.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${unit.key} has no plain words`);
    // No page numbers, running heads, broken words or stray markup.
    assert.doesNotMatch(layer.content!, /\[\d+\]|\{\d+\}|_|�|--|⟨|  |(?<!\n)\n(?!\n)|[a-z,;]\n\n[a-z]|Kyhalion|THE KYBALION\n|CHAPTER [IVX]/, unit.key);
  }
  assert.equal(file.passages.find((p) => p.key === "modern.kyb.1908.2")!.reference, "The Kybalion (Chicago, 1908), chapter II, 'The Seven Hermetic Principles', pp. 25–41");
  assert.equal(file.passages.find((p) => p.key === "modern.kyb.1908.15")!.reference, "The Kybalion (Chicago, 1908), chapter XV, 'Hermetic Axioms', pp. 213–223");
  assert.match(text("intro"), /^We take great pleasure in presenting to the attention of students/);
  assert.match(text("intro"), /Contemporary with Abraham, and, if the legends be true, an instructor of that venerable sage/);
  assert.match(text("intro"), /\n\nThe Three Initiates\.$/);
  assert.match(text("1"), /^"The lips of wisdom are closed, except to the ears of Understanding\."—The Kybalion\./);
  assert.match(text("1"), /Its precepts have never been written down, or printed, so far as we know\./);
  assert.match(text("1"), /are printed herein, in quotation marks, the proper credit being given/);
  assert.match(text("2"), /"As above, so below; as below, so above\."—The Kybalion\.\n\nThis Principle embodies the truth that there is always a Correspondence/);
  assert.match(text("2"), /The old Hermetic axiom ran in these words: "As above, so below; as below, so above\."/);
  assert.equal(text("2").match(/VII\. THE PRINCIPLE OF GENDER\./g)!.length, 3, "listed once, and printed twice over its section on p. 39");
  assert.match(text("8"), /^"As above, so below; as below, so above\."—The Kybalion\./);
  assert.match(text("14"), /^Students of psychology who have followed the modern trend/);
  assert.match(text("15"), /"THE ALL is MIND; The Universe is Mental\."—The Kybalion\.\n\nFinis$/);
  // The book never names the Emerald Tablet or the Corpus Hermeticum.
  for (const unit of units) assert.doesNotMatch(text(unit.key.slice("modern.kyb.1908.".length)), /Emerald|Smaragd|Tabula|Pymander|Poimandres|Asclepius/, unit.key);
  // Readings taken by the vote and corrections by hand.
  assert.match(text("2"), /THE ALL is MIND; The Universe is Mental/);
  assert.match(text("2"), /which exist, in accordance/);
  assert.match(text("3"), /Underlying Reality of the Universe/);
  assert.match(text("6"), /dark corners\./);
  assert.match(text("4"), /hospitably received, and treated with respect\."—The Kybalion\./);
  assert.match(text("4"), /if it had ever "not been," even for a moment/);
  assert.match(text("2"), /begin\? What is the difference between "Large and Small"\?/);
  assert.match(text("5"), /It projects its Will toward the Feminine Principle/);
  assert.match(text("5"), /and on, and on, to higher and still higher planes of life/);
  // 1908 misprints that every 1908 copy shares are kept, not silently corrected.
  assert.match(text("9"), /the Princible of Vibration/);
  assert.match(text("3"), /If the Universal is Mental/);
  assert.match(text("12"), /There is no such things as Chance\./);
  assert.match(text("14"), /directs a steam of Vibratory Energy/);
  // The sayings quoted as 'The Kybalion' are listed with chapter and page.
  assert.equal(KYBALION_SAYINGS.length, 39);
  assert.deepEqual(KYBALION_SAYINGS.find((s) => s.text === "As above, so below; as below, so above."), { chapter: "2", page: 28, text: "As above, so below; as below, so above." });
  assert.ok(KYBALION_SAYINGS.some((s) => s.chapter === "4" && /^But, the report of Reason/.test(s.text)));
  assert.equal(KYBALION_CHAPTERS.find((c) => c.id === "15")!.firstPage, 213);
  assert.match(file.passages.find((p) => p.key === "modern.kyb.1908.15")!.notes!, /The Contents puts this chapter at p\. 212/);
  for (const unit of units.filter((u) => u.key !== "modern.kyb.1908.14" && u.key !== "modern.kyb.1908.intro")) {
    assert.match(unit.notes!, /have no known ancient source/, unit.key);
  }
  for (const key of ["kybalion-1908", "cce-1908", "post-office-1919", "deslippe-2011"]) assert.ok(file.sources.some((s) => s.key === key), key);
});

test("the Kybalion's Hermetic antiquity is recorded as its claim, the book dated to 1908, and the Atkinson attribution given with its evidence", () => {
  const file = corpusFor("modern.kybalion")!;
  const dates = file.passages[0].dates!;
  assert.deepEqual(dates.map((d) => d.role), ["claimed", "translation_publication"]);
  const [claimed, published] = dates;
  assert.equal(claimed.startYear, undefined, "a claim of descent from Hermes is given no year");
  assert.match(claimed.evidence, /^The book's claim, not a date/);
  assert.match(claimed.evidence, /have no known ancient source/);
  assert.match(claimed.originalDateText, /Contemporary with Abraham/);
  assert.deepEqual([published.startYear, published.endYear, published.isApproximate], [1908, 1908, false]);
  assert.equal(published.sourceKey, "cce-1908");
  assert.match(published.originalDateText, /June 13, 1908/);
  assert.match(published.evidence, /entry 15439/);
  // The attribution: evidence for the publisher, and no claim that a document names the author.
  assert.match(published.evidence, /founded by William Walker Atkinson/);
  assert.match(published.evidence, /Neither document names the author of the Kybalion/);
  assert.match(published.evidence, /Deslippe \(2011\)/);
  const cce = INVENTORY_SOURCES.find((s) => s.key === "cce-1908")!;
  assert.match(cce.reference!, /no\. 209612, June 13, 1908/);
  const hearing = INVENTORY_SOURCES.find((s) => s.key === "post-office-1919")!;
  assert.match(hearing.notes!, /does not mention the Kybalion/);
  const deslippe = INVENTORY_SOURCES.find((s) => s.key === "deslippe-2011")!;
  assert.match(deslippe.notes!, /In copyright; cited only/);
  // The marker shows the claim and the real date side by side.
  const work = INVENTORY.find((w) => w.workKey === "modern.kybalion")!;
  const claims = work.anchor && "event" in work.anchor ? work.anchor.event.claims : [];
  assert.deepEqual(claims.map((c) => dateRoleFromWhatIsDated(c.whatIsDated!)), ["claimed", "translation_publication"]);
  assert.equal(claims[0].startYear, undefined);
  assert.equal(claims[1].startYear, 1908);
});

test("the Kybalion's links say it reinterprets the Tablet and Hermes, or only parallels the Hermetica and Blavatsky, and none claims ancient transmission", () => {
  const file = corpusFor("modern.kybalion")!;
  const links = file.links ?? [];
  assert.ok(links.length >= 10);
  const targets = new Set(links.map((l) => l.to));
  for (const to of ["arab.tab.vulgate.02", "arab.tab.arabic.02", "arab.tab.vulgate.17", "arab.comm.hort.2", "herm.ch.11.20", "herm.ch.12.23", "modern.hpb.isis.1.507", "modern.hpb.sd.1.xliii"]) {
    assert.ok(targets.has(to), to);
  }
  const keys = new Set(ALL_CORPORA.flatMap((f) => f.passages.map((p) => p.key)));
  for (const link of links) {
    assert.ok(keys.has(link.from) && keys.has(link.to), link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^modern\.kyb\.1908\./, link.key);
    assert.notEqual(link.connectionClass, "documented_transmission", link.key);
    assert.notEqual(link.connectionClass, "direct_textual_parallel", link.key);
    if (link.connectionClass === "later_reinterpretation") {
      // Only where the book invokes Hermes or the axiom, and never as a witness to the earlier text.
      assert.match(link.to, /^arab\.tab\.vulgate\./, link.key);
      assert.match(link.transmissionEvidence, /^The book (calls|names)/, link.key);
      assert.match(link.transmissionEvidence, /not a witness to the earlier text/, link.key);
    } else {
      assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    }
  }
  // The Tablet's Arabic is set beside it as a difference, not a source.
  const arabic = links.find((l) => l.to === "arab.tab.arabic.02")!;
  assert.match(arabic.differences, /FROM/);
  for (const link of links.filter((l) => l.to.startsWith("herm.ch."))) assert.match(link.transmissionEvidence, /does not name or quote the Corpus Hermeticum/, link.key);
});

test("the Kybalion's pictures are pages of the 1908 copy, the 1919 transcript and portraits from Commons, none repeats the marker, and the unverified ones say so first", () => {
  const file = corpusFor("modern.kybalion")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  assert.equal(images.length, 7);
  let unverified = 0;
  for (const image of images) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.ok(image.licence, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    if (image.identificationStatus === "unverified") {
      unverified++;
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
      assert.equal(image.shows, "portrait", image.key);
      assert.match(image.caption, /not evidence that he wrote it/, image.key);
    } else {
      assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
    }
    // The title page is the marker's picture and is not repeated; there is no ancient object to show.
    assert.doesNotMatch(image.url, /Kybalion_1908\.jpg|Kybalion_Book_Cover/, image.key);
    assert.notEqual(image.shows, "manuscript", image.key);
    assert.notEqual(image.shows, "artefact", image.key);
  }
  assert.equal(unverified, 3);
  const pages = images.filter((i) => /\.djvu\/page\d+-960px-/.test(i.url));
  assert.deepEqual(pages.map((i) => i.key), ["kybalion-1908-cover", "kybalion-1908-copyright-page", "kybalion-1908-dedication"]);
  assert.match(images.find((i) => i.key === "kybalion-1908-copyright-page")!.caption, /Copyright 1908 by The Yogi Publication Society/);
  const transcript = images.find((i) => i.key === "kybalion-post-office-transcript-1919")!;
  assert.equal(transcript.identificationStatus, "secure");
  assert.match(transcript.caption, /It does not mention the Kybalion\.$/);
});

test("Scott-Elliot's Story of Atlantis is imported whole from the 1896 first edition, the Preface and 23 sections, with the majority reading and the fixes by hand", () => {
  const file = corpusFor("modern.scott-elliot")!;
  const work = INVENTORY.find((w) => w.workKey === "modern.scott-elliot")!;
  assert.equal(work.passagePrefix, "modern.scott");
  assert.equal(work.traditionClass, "modern");
  assert.equal(work.unitDivisionKind, "section");
  assert.equal(work.expectedUnits, 24);
  assert.equal(work.inventoryVerified, false, "the sections are the archive's division");
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "story-of-atlantis-published");
  assert.match(work.attributionNote!, /astral clairvoyance/);
  const others = INVENTORY.find((w) => w.workKey === "modern.other-authors")!;
  assert.ok(others.proposedMembers!.some((m) => /Scott-Elliot.*imported as its own work, modern\.scott-elliot/.test(m)));
  assert.ok(others.proposedMembers!.some((m) => /Donnelly.*imported as its own work, modern\.donnelly/.test(m)));
  assert.ok(!others.fullTextEditions.some((e) => /Scott-Elliot|Donnelly/.test(e)));
  // One book record with no text of its own, and 24 units with the 1896 text.
  assert.equal(file.passages[0].key, "modern.scott.1896");
  assert.equal(file.passages[0].divisionKind, "book");
  assert.equal(file.passages[0].layers.filter((l) => l.content && l.key !== PLAIN_LAYER_KEY).length, 0);
  const units = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  assert.deepEqual(units.map((u) => u.key), ["modern.scott.1896.preface", ...Array.from({ length: 23 }, (_, i) => `modern.scott.1896.${i + 1}`)]);
  assert.equal(file.passages.length, 25);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 24, verifiedUnits: 0 }), "verified_against_edition");
  const text = (id: string) => file.passages.find((p) => p.key === `modern.scott.1896.${id}`)!.layers.find((l) => l.key === "eng-1896")!.content!;
  const notes = (id: string) => file.passages.find((p) => p.key === `modern.scott.1896.${id}`)!.notes ?? "";
  for (const unit of units) {
    assert.equal(unit.verificationStatus, "unverified", unit.key);
    const layer = unit.layers.find((l) => l.key === "eng-1896")!;
    assert.equal(layer.licence, "public_domain", unit.key);
    assert.equal(layer.layer, "primary_text", unit.key);
    assert.match(layer.evidence, /compared word by word with the archive\.org OCRs of three copies of 1896/, unit.key);
    assert.match(layer.evidence, /Project Gutenberg #21796/, unit.key);
    assert.match(unit.reference, /^The Story of Atlantis \(London, 1896\), (the Preface by A\. P\. Sinnett|the archive's section \d+(, at the side-heading '.+')?), pp\. [ivx\d]+–[ivx\d]+$/, unit.key);
    assert.ok(unit.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${unit.key} has no plain words`);
    assert.doesNotMatch(layer.content!, /\[\d+\]|_|�|--|  |(?<!\n)\n(?!\n)|[a-z,;]\n\n[a-z]|STORY OF ATLANTIS\n/, unit.key);
  }
  assert.equal(file.passages.find((p) => p.key === "modern.scott.1896.preface")!.reference, "The Story of Atlantis (London, 1896), the Preface by A. P. Sinnett, pp. iii–xi");
  assert.match(text("preface"), /^For readers unacquainted with the progress/);
  assert.match(text("preface"), /allowed access to some maps and other records physically preserved/);
  assert.match(text("preface"), /\n\nA\. P\. Sinnett\.$/);
  assert.match(text("1"), /submerged in the fourth and final great catastrophe of 9,564 B\.C\./);
  assert.match(text("4"), /see also Atlantis, by Ignatius Donnelly/);
  assert.match(text("6"), /But the greatest authority on this subject is Plato/);
  assert.match(text("7"), /Drawn as they have been from contemporary records/);
  assert.match(text("8"), /^Some reference to the very mystical subject of the Manus/);
  assert.match(text("11"), /\n\n\[Footnote\] Students of geology and palæontology/);
  assert.match(text("21"), /As is written in the Book of Dzyan, "Then the Fourth became tall with pride/);
  assert.match(text("23"), /stand themselves as Masters of Wisdom to help the race in its upward progress\.$/);
  // The vote's readings and the corrections by hand.
  assert.match(text("1"), /colonized Egypt in prehistoric times/);
  assert.match(text("preface"), /with which he himself is in normal relationship/);
  assert.match(text("14"), /The window-spaces were filled/);
  // 1896 misprints that every 1896 copy shares are kept, not silently corrected.
  assert.match(text("20"), /machinery of goverment\./);
  assert.match(text("9"), /an Intitiate emperor/);
  assert.match(text("4"), /the various savages races/);
  // The claim and the racial theory are named as the book's own.
  for (const key of ["1", "4", "8", "9", "10", "11", "12", "13", "22", "23"]) assert.match(notes(key), /the text's own racial theory/, key);
  assert.match(notes("7"), /no such record has been produced/);
  assert.match(notes("2"), /not a sunken continent/);
  // The four maps are listed with the book.
  assert.equal(SCOTT_ELLIOT_MAPS.length, 4);
  assert.deepEqual(SCOTT_ELLIOT_MAPS.map((m) => m.name), ["Atlantis at its Prime", "Atlantis in its Decadence", "Ruta & Daitya", "Poseidonis"]);
  assert.match(file.passages[0].notes!, /No\. 4, 'The World after the catastrophe of 80,000 years ago/);
  assert.match(file.passages[0].notes!, /The maps are Scott-Elliot's own of 1896/);
  assert.equal(SCOTT_ELLIOT_SECTIONS.find((s) => s.id === "21")!.firstPage, "62");
  assert.ok(file.sources.some((s) => s.key === "scott-elliot-atlantis-1896"));
});

test("Scott-Elliot's clairvoyant records and 9564 BC are recorded as the book's claims, the book dated to 1896", () => {
  const file = corpusFor("modern.scott-elliot")!;
  const dates = file.passages[0].dates!;
  assert.deepEqual(dates.map((d) => d.role), ["claimed", "claimed", "translation_publication"]);
  const [records, poseidonis, published] = dates;
  assert.equal(records.startYear, undefined, "a claim read by clairvoyance is given no year");
  assert.match(records.evidence, /^The book's claim, not a date/);
  assert.match(records.originalDateText, /physically preserved/);
  assert.equal(poseidonis.startYear, -9563, "9564 BC");
  assert.match(poseidonis.evidence, /^The book's claim, not a date/);
  assert.match(poseidonis.evidence, /No geological or archaeological evidence/);
  assert.deepEqual([published.startYear, published.endYear, published.isApproximate], [1896, 1896, false]);
  assert.match(published.originalDateText, /Theosophical Publishing Society, 7, Duke Street, Adelphi/);
  const work = INVENTORY.find((w) => w.workKey === "modern.scott-elliot")!;
  const claims = work.anchor && "event" in work.anchor ? work.anchor.event.claims : [];
  assert.deepEqual(claims.map((c) => dateRoleFromWhatIsDated(c.whatIsDated!)), ["claimed", "translation_publication"]);
  assert.equal(claims[0].startYear, -9563);
  assert.equal(claims[1].startYear, 1896);
});

test("Scott-Elliot's links retell Plato, are named by Steiner, quote Blavatsky and name Donnelly, and none claims ancient transmission", () => {
  const file = corpusFor("modern.scott-elliot")!;
  const links = file.links ?? [];
  assert.ok(links.length >= 14);
  const targets = new Set(links.map((l) => l.to));
  for (const to of ["greek.tim.25d", "greek.tim.24e", "greek.crit.114d", "modern.steiner.1911.1.1", "modern.steiner.1911.2.2", "modern.steiner.1911.2.4", "modern.hpb.anthro.10", "modern.hpb.anthro.11", "modern.hpb.sd.2.6", "modern.hpb.isis.1.592", "modern.doreal.01", "modern.donnelly.1882.1.1"]) {
    assert.ok(targets.has(to), to);
  }
  const keys = new Set(ALL_CORPORA.flatMap((f) => f.passages.map((p) => p.key)));
  for (const link of links) {
    assert.ok(keys.has(link.from) && keys.has(link.to), link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^modern\.scott\.1896\./, link.key);
    if (link.to.startsWith("greek.")) {
      // Plato is never a documented source: a retelling where he names Plato, else a parallel.
      assert.notEqual(link.connectionClass, "documented_transmission", link.key);
      if (link.connectionClass === "later_reinterpretation") {
        assert.match(link.transmissionEvidence, /^He names Plato/, link.key);
        assert.match(link.transmissionEvidence, /not a witness to the earlier text/, link.key);
      } else assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    } else if (link.connectionClass === "documented_transmission") {
      // Only between modern books, and only where one names or quotes the other.
      assert.match(link.to, /^modern\.(steiner|hpb|donnelly)\./, link.key);
      assert.match(link.transmissionEvidence, /^(A named source|A quotation|He names)/, link.key);
      assert.match(link.transmissionEvidence, /between two modern books/, link.key);
    } else {
      assert.match(link.transmissionEvidence, /^None shown/, link.key);
    }
    if (link.to.startsWith("modern.doreal.")) assert.equal(link.connectionClass, "broad_thematic_resemblance", link.key);
  }
  assert.match(links.find((l) => l.key === "se-1-poseidonis-timaeus-25d")!.transmissionEvidence, /Plato gives it no such name/);
  const steiner = links.find((l) => l.to === "modern.steiner.1911.1.1")!;
  assert.equal(steiner.connectionClass, "documented_transmission");
  assert.match(steiner.transmissionEvidence, /In the little book, The Story of Atlantis, by W\. Scott-Elliot/);
});

test("Scott-Elliot's pictures are the British Library map, related maps and a portrait from Commons, none repeats the marker, and the unverified ones say so first", () => {
  const file = corpusFor("modern.scott-elliot")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  assert.equal(images.length, 4);
  let unverified = 0;
  for (const image of images) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    if (image.identificationStatus === "unverified") {
      unverified++;
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
    // Every map is said to be the author's own, not a record.
    if (image.shows === "map") assert.match(image.caption, /author's own|Scott-Elliot's own/, image.key);
    // The marker's pictures (the cover and map 4) are not repeated.
    assert.doesNotMatch(image.url, /Map4|ethnological_sketch/, image.key);
  }
  assert.equal(unverified, 3);
  assert.equal(images.find((i) => i.key === "scott-elliot-1896-map-3")!.identificationStatus, "secure");
});

test("Donnelly's Atlantis is imported as a selection of five chapters of the 1882 setting, with Plato as he quotes him and the fixes by hand", () => {
  const file = corpusFor("modern.donnelly")!;
  const work = INVENTORY.find((w) => w.workKey === "modern.donnelly")!;
  assert.equal(work.passagePrefix, "modern.donnelly");
  assert.equal(work.unitDivisionKind, "chapter");
  assert.equal(work.expectedUnits, null, "a selection, not the whole book");
  assert.equal(work.inventoryVerified, false);
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "donnelly-atlantis-published");
  assert.match(work.attributionNote!, /rejected by modern geology and archaeology/);
  assert.match(work.inventoryBasis, /Part I ch\. I, The Purpose of the Book \(pp\. 1–4\)/);
  assert.equal(file.passages[0].key, "modern.donnelly.1882");
  assert.equal(file.passages[0].divisionKind, "book");
  assert.match(file.passages[0].notes!, /Not imported: the chapters that quote Plato only in passing/);
  const units = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  assert.deepEqual(units.map((u) => u.key), ["1.1", "1.2", "1.3", "2.1", "4.2"].map((id) => `modern.donnelly.1882.${id}`));
  assert.deepEqual(units.map((u) => u.reference.match(/pp\. (\d+–\d+)$/)![1]), ["1–4", "5–21", "22–30", "65–67", "283–307"]);
  const text = (id: string) => file.passages.find((p) => p.key === `modern.donnelly.1882.${id}`)!.layers.find((l) => l.key === "eng-1882")!.content!;
  for (const unit of units) {
    assert.equal(unit.verificationStatus, "unverified", unit.key);
    const layer = unit.layers.find((l) => l.key === "eng-1882")!;
    assert.equal(layer.licence, "public_domain", unit.key);
    assert.match(layer.evidence, /compared word by word with the archive\.org OCRs of four printed copies of the 1882 setting/, unit.key);
    assert.match(layer.evidence, /No copy of the very first printing was reached/, unit.key);
    assert.match(unit.reference, /^Atlantis: The Antediluvian World \(New York, 1882\), Part [IV]+, chapter [IV]+, '.+', pp\. \d+–\d+$/, unit.key);
    assert.ok(unit.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${unit.key} has no plain words`);
    assert.doesNotMatch(layer.content!, /\[\d+\]|_|�|--|\+-|  |(?<!\n)\n(?!\n)|[a-z,;]\n\n[a-z]|THE EMPIRE OF ATLANTIS\.|POSEIDON, OR NEPTUNE\./, unit.key);
    assert.match(unit.notes ?? "", /rejected by modern geology and archaeology|Jowett/, unit.key);
  }
  assert.match(text("1.1"), /^This book is an attempt to demonstrate several distinct and novel propositions/);
  assert.match(text("1.1"), /our fundamental ideas—the men/);
  assert.match(text("1.2"), /such as no other story, fable, or poem ever had/);
  assert.match(text("1.2"), /\("Plato's Dialogues," ii\., 517, Timæus\.\)/);
  assert.match(text("1.2"), /made a passage into and out of the royal palace; and then they began to build the palace/);
  assert.match(text("1.2"), /passed judgment on him accordingly/);
  assert.match(text("1.2"), /\n\n\[Here Plato's story abruptly ends\.\]$/);
  assert.match(text("1.3"), /about 9600 years before the Christian era/);
  assert.match(text("1.3"), /12 × 1460 = 17,520 \/ 12 × 1805 = 21,660 \/ \[together\] = 39,180\./);
  assert.match(text("1.3"), /1,460 — 1,805 \/ 1,322 — 712/);
  assert.match(text("2.1"), /the Rev\. R\. P\. Bellynck/);
  assert.match(text("2.1"), /regarded this as "the great deluge of all\."$/);
  assert.match(text("4.2"), /^Lord Bacon said:/);
  assert.match(text("4.2"), /The Babylonian trinity was composed of Hea, Anu, and Bel/);
  assert.match(text("4.2"), /\("Dialogues," Timæus, vol\. ii\., p\. 533\)/);
  assert.match(text("4.2"), /\n\n7\. They existed during the Bronze Age/);
  assert.equal(DONNELLY_CHAPTERS.length, 5);
  assert.ok(file.sources.some((s) => s.key === "donnelly-atlantis-1882"));
});

test("Donnelly's 9600 BC is recorded as his claim after Plato, the book dated to 1882", () => {
  const file = corpusFor("modern.donnelly")!;
  const dates = file.passages[0].dates!;
  assert.deepEqual(dates.map((d) => d.role), ["claimed", "translation_publication"]);
  const [claimed, published] = dates;
  assert.equal(claimed.startYear, -9599, "about 9600 BC");
  assert.equal(claimed.datePrecision, "century");
  assert.equal(claimed.isApproximate, true);
  assert.match(claimed.evidence, /^The book's claim, not a date/);
  assert.match(claimed.evidence, /The figure is Plato's/);
  assert.match(claimed.originalDateText, /p\. 29/);
  assert.deepEqual([published.startYear, published.endYear, published.isApproximate], [1882, 1882, false]);
  assert.match(published.originalDateText, /Entered according to Act of Congress, in the year 1882/);
  const work = INVENTORY.find((w) => w.workKey === "modern.donnelly")!;
  const claims = work.anchor && "event" in work.anchor ? work.anchor.event.claims : [];
  assert.deepEqual(claims.map((c) => dateRoleFromWhatIsDated(c.whatIsDated!)), ["claimed", "translation_publication"]);
  assert.equal(claims[1].startYear, 1882);
});

test("Donnelly's links say he retells Plato as history, or only parallels Blavatsky and Doreal, and none claims ancient transmission", () => {
  const file = corpusFor("modern.donnelly")!;
  const links = file.links ?? [];
  assert.ok(links.length >= 15);
  const targets = new Set(links.map((l) => l.to));
  for (const to of ["greek.tim.22b", "greek.tim.23b", "greek.tim.23e", "greek.tim.24e", "greek.tim.25d", "greek.tim.40e", "greek.crit.113c", "greek.crit.120e", "greek.crit.121b", "modern.hpb.sd.2.743", "modern.doreal.01"]) {
    assert.ok(targets.has(to), to);
  }
  const keys = new Set(ALL_CORPORA.flatMap((f) => f.passages.map((p) => p.key)));
  for (const link of links) {
    assert.ok(keys.has(link.from) && keys.has(link.to), link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^modern\.donnelly\.1882\./, link.key);
    assert.notEqual(link.connectionClass, "documented_transmission", link.key);
    assert.notEqual(link.connectionClass, "direct_textual_parallel", link.key);
    if (link.connectionClass === "later_reinterpretation") {
      assert.match(link.to, /^greek\.(tim|crit)\./, link.key);
      assert.match(link.transmissionEvidence, /^He names Plato/, link.key);
      assert.match(link.transmissionEvidence, /not a witness to the earlier text/, link.key);
    } else {
      assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    }
  }
  // Scott-Elliot's link to this book, which he names, is documented.
  const se = corpusFor("modern.scott-elliot")!.links!.find((l) => l.to === "modern.donnelly.1882.1.1")!;
  assert.equal(se.connectionClass, "documented_transmission");
  assert.match(se.transmissionEvidence, /see also Atlantis, by Ignatius Donnelly/);
});

test("Donnelly's pictures are pages of the Duke copy, his map and a portrait from Commons, none repeats the marker, and the unverified one says so first", () => {
  const file = corpusFor("modern.donnelly")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  assert.equal(images.length, 7);
  let unverified = 0;
  for (const image of images) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    if (image.identificationStatus === "unverified") {
      unverified++;
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
      assert.equal(image.shows, "portrait", image.key);
    } else assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
    // The frontispiece and the Brady portrait are the marker's and are not repeated.
    assert.doesNotMatch(image.url, /Frontispiece|Hon\._Ignatius_Donnelly/, image.key);
  }
  assert.equal(unverified, 1);
  const pages = images.filter((i) => /\.djvu\/page\d+-960px-/.test(i.url));
  assert.deepEqual(pages.map((i) => i.key), ["donnelly-1882-title-page", "donnelly-1882-copyright-page", "donnelly-1882-page-1", "donnelly-1882-page-5", "donnelly-1882-page-29"]);
  assert.match(images.find((i) => i.key === "donnelly-1882-copyright-page")!.caption, /in the year 1882, by Harper & Brothers/);
  assert.match(images.find((i) => i.key === "donnelly-1882-empire-map")!.caption, /modern geology and archaeology reject/);
});

test("The Virgin of the World is imported from the 1885 first edition, the treatises whole and the Introduction's first section, with the vote and the fixes by hand", () => {
  const file = corpusFor("modern.kingsford-maitland")!;
  const work = INVENTORY.find((w) => w.workKey === "modern.kingsford-maitland")!;
  assert.equal(work.passagePrefix, "modern.vow");
  assert.equal(work.traditionClass, "modern");
  assert.equal(work.unitDivisionKind, "part");
  assert.equal(work.expectedUnits, 45);
  assert.equal(work.inventoryVerified, false, "the selection from the front matter is the archive's");
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "virgin-of-the-world-published");
  assert.match(work.attributionNote!, /founded the Hermetic Society in London in 1884/);
  assert.match(work.attributionNote!, /Louis Ménard's French version \(1866\) 'used, but not entirely followed'/);
  assert.match(work.attributionNote!, /the creed of catholic Christendom/);
  const others = INVENTORY.find((w) => w.workKey === "modern.other-authors")!;
  assert.ok(others.proposedMembers!.some((m) => /Kingsford.*imported as its own work, modern\.kingsford-maitland/.test(m)));
  assert.ok(!others.fullTextEditions.some((e) => /Kingsford|Virgin/.test(e)));
  assert.ok(INVENTORY_SOURCES.some((s) => s.key === "kingsford-maitland-1885"));
  assert.ok(INVENTORY_SOURCES.some((s) => s.key === "menard-hermes-1866"));
  // One book record (citing Ménard only), six treatise records without text, and 45 units with the 1885 English.
  const book = file.passages[0];
  assert.equal(book.key, "modern.vow.1885");
  assert.equal(book.divisionKind, "book");
  assert.equal(book.layers.filter((l) => l.content && l.key !== PLAIN_LAYER_KEY).length, 0);
  assert.ok(book.layers.some((l) => l.key === "fra-menard-1866"));
  const treatises = file.passages.filter((p) => p.divisionKind === "treatise");
  assert.deepEqual(treatises.map((t) => t.key), ["kore", "ascl", "def", "tat", "ammon", "frag"].map((t) => `modern.vow.1885.${t}`));
  for (const t of treatises) assert.equal(t.layers.filter((l) => l.content && l.key !== PLAIN_LAYER_KEY).length, 0, t.key);
  const units = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  const counts: [string, number][] = [["kore", 3], ["ascl", 15], ["def", 4], ["tat", 8], ["ammon", 6], ["frag", 8]];
  assert.deepEqual(
    units.map((u) => u.key),
    ["modern.vow.1885.intro", ...counts.flatMap(([t, n]) => Array.from({ length: n }, (_, i) => `modern.vow.1885.${t}.${i + 1}`))],
  );
  assert.equal(VIRGIN_UNITS.length, 45);
  assert.equal(file.passages.length, 52);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 45, verifiedUnits: 0 }), "verified_against_edition");
  const text = (id: string) => file.passages.find((p) => p.key === `modern.vow.1885.${id}`)!.layers.find((l) => l.key === "eng-1885")!.content!;
  for (const unit of units) {
    assert.equal(unit.verificationStatus, "unverified", unit.key);
    const layer = unit.layers.find((l) => l.key === "eng-1885")!;
    assert.equal(layer.licence, "public_domain", unit.key);
    assert.equal(layer.layer, unit.key.endsWith(".intro") ? "primary_text" : "translation", unit.key);
    assert.match(layer.evidence, /compared word by word with a second OCR of the same e-text/, unit.key);
    assert.match(layer.evidence, /the 1885 scan is the only independent witness/, unit.key);
    assert.match(layer.evidence, /scripts\/texts\/virgin-of-the-world\.py/, unit.key);
    assert.match(unit.reference, /^The Virgin of the World \(London, 1885\), (An Introduction to the Virgin of the World \(first section\), pp\. xix–xxi|.+, Part [IVX]+, (p\. \d+|pp\. \d+–\d+))$/, unit.key);
    assert.ok(unit.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${unit.key} has no plain words`);
    assert.doesNotMatch(layer.content!, /\[\d+\]|_|�|--|  |(?<!\n)\n(?!\n)|[a-z,;]\n\n[a-z]|Stobzus|stobzus/, unit.key);
  }
  assert.equal(file.passages.find((p) => p.key === "modern.vow.1885.ascl.13")!.reference, "The Virgin of the World (London, 1885), A Treatise on Initiations; or, Asclepios, Part XIII, pp. 87–90");
  assert.match(text("intro"), /^THE mystic title of the celebrated Hermetic fragment/);
  assert.match(text("intro"), /curse of Eva\.$/);
  assert.match(text("kore.1"), /^HAVING thus spoken, Isis first pours out for Horos the sweet draught of immortality/);
  assert.match(text("ascl.7"), /In the beginning were God and Hylé/);
  assert.match(text("def.1"), /^Asclepios to the King Ammon\.\n\n/);
  assert.match(text("frag.7"), /^SEVEN Planets revolve in the ways of Olympos/);
  // The drop-capital openings restored by hand, and the Greek words.
  assert.match(text("kore.2"), /^O MY illustrious son/);
  assert.match(text("tat.4"), /^A GREAT and divine power/);
  assert.match(text("tat.6"), /^O MY son, matter becomes/);
  assert.match(text("def.4"), /βασιλεύς/);
  assert.match(text("def.4"), /βαίνειν/);
  // The 1885 misprint is kept, not silently corrected.
  assert.match(text("def.2"), /incorporeal corporealites/);
  assert.match(file.passages.find((p) => p.key === "modern.vow.1885.def.2")!.notes!, /1885 spelling/);
  // Kingsford's esoteric reading is recorded as hers.
  assert.match(file.passages.find((p) => p.key === "modern.vow.1885.intro")!.notes!, /translator's own esoteric interpretation/);
  assert.match(book.notes!, /A nineteenth-century translation, not an ancient witness/);
});

test("The Virgin of the World is dated to 1885, with the ancient composition dates carried across from the Mead records", () => {
  const file = corpusFor("modern.kingsford-maitland")!;
  const book = file.passages[0];
  assert.deepEqual(book.dates!.map((d) => d.role), ["translation_publication"]);
  const [published] = book.dates!;
  assert.deepEqual([published.startYear, published.endYear, published.isApproximate], [1885, 1885, false]);
  assert.match(published.originalDateText, /MDCCCLXXXV/);
  assert.match(published.evidence, /not of the ancient writings it renders/);
  for (const t of ["kore", "ascl", "def", "tat", "ammon"]) {
    const dates = file.passages.find((p) => p.key === `modern.vow.1885.${t}`)!.dates!;
    assert.equal(dates.length, 1, t);
    assert.deepEqual([dates[0].role, dates[0].startYear, dates[0].endYear, dates[0].datePrecision, dates[0].isApproximate], ["composition", 100, 300, "century", true], t);
    assert.equal(dates[0].sourceKey, "copenhaver-hermetica", t);
    assert.match(dates[0].evidence, /not a new dating/, t);
  }
  assert.equal(file.passages.find((p) => p.key === "modern.vow.1885.frag")!.dates, undefined, "the fragments from Cyril, the Suda and Lactantius are not dated");
  const work = INVENTORY.find((w) => w.workKey === "modern.kingsford-maitland")!;
  const claims = work.anchor && "event" in work.anchor ? work.anchor.event.claims : [];
  assert.deepEqual(claims.map((c) => dateRoleFromWhatIsDated(c.whatIsDated!)), ["composition", "translation_publication"]);
  assert.deepEqual([claims[0].startYear, claims[0].endYear], [100, 300]);
  assert.equal(claims[1].startYear, 1885);
});

test("The Virgin of the World is linked to Mead's English of the same texts as two translations, and none says one copied the other", () => {
  const file = corpusFor("modern.kingsford-maitland")!;
  const links = file.links ?? [];
  assert.equal(links.length, 73);
  const keys = new Set(ALL_CORPORA.flatMap((f) => f.passages.map((p) => p.key)));
  assert.equal(new Set(links.map((l) => l.key)).size, links.length, "duplicate link key");
  for (const link of links) {
    assert.ok(keys.has(link.from) && keys.has(link.to), link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^modern\.vow\.1885\./, link.key);
    assert.notEqual(link.connectionClass, "documented_transmission", link.key);
    assert.doesNotMatch(`${link.similarities} ${link.differences} ${link.transmissionEvidence}`, /\bcopied\b/, link.key);
    if (/^herm\.(sh|ascl\.\d|ch)/.test(link.to)) {
      assert.equal(link.connectionClass, "direct_textual_parallel", link.key);
      assert.equal(link.wordingComparable, "partly", link.key);
      assert.match(link.differences, /Neither is said to copy the other/, link.key);
      assert.ok(link.commonSourceNote, link.key);
    } else if (link.to !== "herm.ascl.prayer-coptic") {
      assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    }
  }
  const to = (from: string) => links.filter((l) => l.from === `modern.vow.1885.${from}`).map((l) => l.to);
  assert.deepEqual(to("kore.1").filter((t) => t.startsWith("herm.")), ["herm.sh.ex25"]);
  assert.deepEqual(to("kore.2"), ["herm.sh.ex26"]);
  assert.deepEqual(to("kore.3"), ["herm.sh.ex27"]);
  assert.deepEqual(to("def.1"), ["herm.ch.16"]);
  assert.deepEqual(to("def.2"), ["herm.ch.17"]);
  assert.deepEqual(to("ammon.5"), ["herm.sh.ex17", "herm.sh.ex18"]);
  // Every part of the Asclepius is linked to Mead's chapters, and all 41 chapters are covered.
  for (let part = 1; part <= 15; part++) assert.ok(to(`ascl.${part}`).some((t) => /^herm\.ascl\.\d+$/.test(t)), `ascl.${part}`);
  const chapters = new Set(links.filter((l) => /^herm\.ascl\.\d+$/.test(l.to)).map((l) => l.to));
  assert.equal(chapters.size, 41);
  // Where the translations differ in meaning, the link says so.
  for (const from of ["def.2", "tat.4", "tat.6", "ammon.2", "frag.2", "frag.7"]) {
    const link = links.find((l) => l.from === `modern.vow.1885.${from}` && l.connectionClass === "direct_textual_parallel")!;
    assert.equal(link.meaningComparable, "partly", from);
  }
  assert.match(links.find((l) => l.from === "modern.vow.1885.ammon.2")!.differences, /the Free Will of the Supreme God/);
  // The other links: the Coptic prayer, Blavatsky, the Kybalion and Hortulanus.
  assert.equal(links.find((l) => l.to === "herm.ascl.prayer-coptic")!.connectionClass, "direct_textual_parallel");
  assert.equal(links.find((l) => l.to === "modern.hpb.isis.2.360")!.connectionClass, "close_conceptual_parallel");
  assert.equal(links.find((l) => l.to === "modern.kyb.1908.2")!.connectionClass, "broad_thematic_resemblance");
  assert.equal(links.find((l) => l.to === "modern.kyb.1908.intro")!.connectionClass, "broad_thematic_resemblance");
  assert.equal(links.find((l) => l.to === "arab.comm.hort.7")!.connectionClass, "symbolic_similarity");
  // The Armenian Definitions are a different work and are not linked.
  assert.ok(!links.some((l) => l.to.startsWith("herm.definitions") || l.to.startsWith("herm.def.")));
});

test("The Virgin of the World's pictures are Patrizi pages from Commons and the marker's portraits, and the unverified ones say so first", () => {
  const file = corpusFor("modern.kingsford-maitland")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  const seen = new Map(images.map((i) => [i.key, i]));
  assert.equal(seen.size, 2);
  for (const image of seen.values()) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    if (image.identificationStatus === "unverified") {
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
    // The portraits are the marker's and are not repeated.
    assert.doesNotMatch(image.url, /Kingsford|Maitland/, image.key);
  }
  assert.equal(seen.get("vow-patrizi-1593-title-page")!.identificationStatus, "secure");
  assert.equal(seen.get("vow-patrizi-contents-hermetica")!.identificationStatus, "unverified");
  const marker = MARKER_PICTURES["virgin-of-the-world-published"];
  assert.equal(marker.length, 2);
  for (const picture of marker) {
    assert.match(picture.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/.+\/(Anna_Kingsford_2|Edward_Maitland)\.JPG$/);
    assert.equal(picture.identificationStatus, "unverified");
    assert.match(picture.caption ?? "", /^UNVERIFIED — /);
  }
});

test("The Mithras Liturgy is imported from Mead's 1907 book, the Preamble and the fourteen sections of the Ritual, voted over three scans", () => {
  const file = corpusFor("greek.mithras-liturgy")!;
  const work = INVENTORY.find((w) => w.workKey === "greek.mithras-liturgy")!;
  assert.equal(work.passagePrefix, "greek.mithras");
  assert.equal(work.traditionClass, "ancient_primary");
  assert.equal(work.corpusGroup, "greek_hermetic");
  assert.equal(work.unitDivisionKind, "section");
  assert.equal(work.expectedUnits, 15);
  assert.equal(work.inventoryVerified, false, "the sections' coverage of the papyrus lines is not checked");
  assert.equal(work.anchor && "event" in work.anchor && work.anchor.event.slug, "mithras-liturgy-papyrus");
  assert.match(work.attributionNote!, /Cumont rejected it 'as a genuine Mithriac document'/);
  assert.match(work.attributionNote!, /Theosophical/);
  const related = INVENTORY.find((w) => w.workKey === "greek.related")!;
  assert.ok(related.proposedMembers!.some((m) => /^Mithras Liturgy.*imported as its own work, greek\.mithras-liturgy$/.test(m)));
  for (const key of ["mead-mithriac-ritual-1907", "dieterich-mithrasliturgie-1903", "bnf-suppl-grec-574"]) assert.ok(INVENTORY_SOURCES.some((s) => s.key === key), key);
  // One book record (citing Dieterich only), the Preamble, a Ritual record without text, and fourteen sections.
  const book = file.passages[0];
  assert.equal(book.key, "greek.mithras.1907");
  assert.equal(book.divisionKind, "book");
  assert.equal(book.layers.filter((l) => l.content && l.key !== PLAIN_LAYER_KEY).length, 0);
  assert.ok(book.layers.some((l) => l.key === "grc-dieterich-1903" && l.content == null));
  assert.match(book.notes!, /Not imported, and listed here: Mead's Comments \(pp\. 34–77\)/);
  const ritual = file.passages.find((p) => p.key === "greek.mithras.1907.ritual")!;
  assert.equal(ritual.layers.length, 0);
  assert.deepEqual(ritual.witnesses, [{ manuscriptKey: "bnf-suppl-gr-574", locus: "PGM IV 475–829" }]);
  assert.deepEqual(file.manuscripts!.map((m) => [m.key, m.objectKind, m.accessionNumber]), [["bnf-suppl-gr-574", "papyrus", "Supplément grec 574"]]);
  const units = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  assert.deepEqual(units.map((u) => u.key), ["preamble", ...Array.from({ length: 14 }, (_, i) => `${i + 1}`)].map((id) => `greek.mithras.1907.${id}`));
  assert.equal(MITHRIAC_UNITS.length, 15);
  assert.equal(file.passages.length, 17);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 15, verifiedUnits: 0 }), "verified_against_edition");
  const text = (id: string) => file.passages.find((p) => p.key === `greek.mithras.1907.${id}`)!.layers.find((l) => l.key === "eng-1907")!.content!;
  for (const unit of units) {
    assert.equal(unit.verificationStatus, "unverified", unit.key);
    const layer = unit.layers.find((l) => l.key === "eng-1907")!;
    assert.equal(layer.licence, "public_domain", unit.key);
    assert.equal(layer.layer, unit.key.endsWith(".preamble") ? "interpretation" : "translation", unit.key);
    assert.match(layer.evidence, /three independent scans/, unit.key);
    assert.match(layer.evidence, /read page by page against the Toronto page images/, unit.key);
    assert.match(layer.evidence, /scripts\/texts\/mead-mithriac-ritual\.py/, unit.key);
    assert.match(unit.reference, /^A Mithriac Ritual \(London, 1907\), (Preamble, pp\. 9–17|The Ritual, section [IVX]+, (p\. \d+|pp\. \d+–\d+))$/, unit.key);
    assert.ok(unit.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${unit.key} has no plain words`);
    assert.doesNotMatch(layer.content!, /_|�|--|  |(?<!\n)\n(?!\n)|[a-z,;]\n\n[a-z]|¦|\b0\b|MITHRIAC|RITUAL\./, unit.key);
  }
  assert.match(text("preamble"), /^The last little volume gave the reader/);
  assert.match(text("preamble"), /Dieterich thinks that this Greek ritual was first made in Egypt about 100-150 A\.D\./);
  assert.match(text("preamble"), /ἄσημα ὀνόματα/);
  assert.match(text("preamble"), /συριγμὸς and ποππυσμός/);
  assert.match(text("1"), /^O Providence, O Fortune, bestow on me Thy Grace/);
  assert.match(text("1"), /Sun Mithras, the Great God/);
  assert.match(text("2"), /re-born in Mind/);
  assert.match(text("4"), /S̄! S̄!/);
  assert.match(text("7"), /\n\nĒeō · oēeō · iōō · .+ · ooouiōē!\n\n/);
  assert.match(text("13"), /Oh! leave me not!/);
  assert.match(text("14"), /made the Mystery\.$/);
  // The Preamble's Theosophical reading is recorded as Mead's.
  assert.match(file.passages.find((p) => p.key === "greek.mithras.1907.preamble")!.notes!, /Mead's Theosophical interpretation, recorded as such/);
});

test("The Mithras Liturgy is dated by its papyrus and by Dieterich's view as Mead reports it, and Mead's book to 1907", () => {
  const file = corpusFor("greek.mithras-liturgy")!;
  const book = file.passages[0];
  assert.deepEqual(book.dates!.map((d) => [d.role, d.startYear, d.endYear, d.isApproximate]), [["translation_publication", 1907, 1907, false]]);
  assert.match(book.dates![0].evidence, /not of the papyrus or of the Greek ritual/);
  const ritual = file.passages.find((p) => p.key === "greek.mithras.1907.ritual")!;
  const [papyrus, composition] = ritual.dates!;
  assert.deepEqual([papyrus.role, papyrus.startYear, papyrus.endYear, papyrus.datePrecision, papyrus.sourceKey], ["manuscript", 300, 400, "century", "bnf-suppl-grec-574"]);
  assert.match(papyrus.originalDateText, /IVe siècle/);
  assert.deepEqual([composition.role, composition.startYear, composition.endYear, composition.datePrecision, composition.isApproximate], ["composition", 100, 150, "century", true]);
  assert.match(composition.originalDateText, /about 100-150 A\.D\./);
  assert.match(composition.evidence, /one scholar's judgement and the date of composition is debated/);
  const manuscript = file.manuscripts![0];
  assert.deepEqual([manuscript.startYear, manuscript.endYear], [300, 400]);
  const work = INVENTORY.find((w) => w.workKey === "greek.mithras-liturgy")!;
  const claims = work.anchor && "event" in work.anchor ? work.anchor.event.claims : [];
  assert.deepEqual(claims.map((c) => dateRoleFromWhatIsDated(c.whatIsDated!)), ["composition", "manuscript", "translation_publication"]);
  assert.deepEqual(claims.map((c) => [c.startYear, c.endYear ?? null]), [[100, 150], [300, 400], [1907, null]]);
});

test("The Mithras Liturgy's links are proposed resemblances, and none claims one text knew another", () => {
  const file = corpusFor("greek.mithras-liturgy")!;
  const links = file.links ?? [];
  assert.equal(links.length, 7);
  const keys = new Set(ALL_CORPORA.flatMap((f) => f.passages.map((p) => p.key)));
  assert.equal(new Set(links.map((l) => l.key)).size, links.length, "duplicate link key");
  for (const link of links) {
    assert.ok(keys.has(link.from) && keys.has(link.to), link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^greek\.mithras\.1907\./, link.key);
    assert.ok(["close_conceptual_parallel", "symbolic_similarity", "broad_thematic_resemblance"].includes(link.connectionClass), link.key);
    assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    assert.doesNotMatch(`${link.similarities} ${link.differences} ${link.transmissionEvidence}`, /\bcop(ied|y)\b/, link.key);
  }
  const to = (from: string) => links.filter((l) => l.from === `greek.mithras.1907.${from}`).map((l) => l.to);
  assert.deepEqual(to("2"), ["herm.ch.13.3", "herm.sh.ex25.4"]);
  assert.deepEqual(to("3"), ["herm.ch.1.25"]);
  assert.deepEqual(to("7"), ["gnostic.ps.136", "modern.hall.2.s1.p3"]);
  assert.deepEqual(to("11"), ["modern.hall.36.s7.p2"]);
  assert.deepEqual(to("14"), ["herm.ch.13.10"]);
  // Mead translated both, and the shared 'New' is his own supplement: the links say so.
  for (const link of links.filter((l) => l.to.startsWith("herm.ch.13") || l.to.startsWith("herm.sh."))) assert.match(link.differences, /Mead translated both texts/, link.key);
  assert.match(links.find((l) => l.to === "herm.sh.ex25.4")!.differences, /The word 'New' in the Ritual is Mead's own addition/);
  assert.match(links.find((l) => l.to === "herm.sh.ex25.4")!.scholarlyView!, /p\. 44/);
});

test("The Mithras Liturgy's pictures are the BnF papyrus and Mithraic reliefs from Commons, with Mead as the marker, and the unverified ones say so first", () => {
  const file = corpusFor("greek.mithras-liturgy")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  const seen = new Map(images.map((i) => [i.key, i]));
  assert.equal(seen.size, 4);
  const elsewhere = new Set(ALL_CORPORA.filter((f) => f.workKey !== "greek.mithras-liturgy").flatMap((f) => [...(f.images ?? []), ...f.passages.flatMap((p) => p.images ?? [])].map((i) => i.url)));
  for (const image of seen.values()) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    assert.ok(image.licence, image.key);
    assert.ok(!elsewhere.has(image.url), `${image.key} repeats a picture shown elsewhere`);
    if (image.identificationStatus === "unverified") {
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
  }
  assert.equal(seen.get("mithras-bnf-suppl-gr-574-labels")!.identificationStatus, "secure");
  assert.equal(seen.get("mithras-bnf-suppl-gr-574-leaf-7")!.identificationStatus, "unverified");
  assert.match(seen.get("mithras-bnf-suppl-gr-574-leaf-7")!.whatIsUnverified!, /not on the library's catalogue or on an edition's line numbers/);
  for (const key of ["mithras-fiano-romano-banquet-sol", "mithras-vatican-tauroctony-helios-selene"]) assert.match(seen.get(key)!.caption, /^Related evidence, not the Ritual: /, key);
  const marker = MARKER_PICTURES["mithras-liturgy-papyrus"];
  assert.equal(marker.length, 1);
  assert.match(marker[0].url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/.+\/George_Robert_Stow_Mead\.001\.jpg$/);
  assert.equal(marker[0].identificationStatus, "unverified");
  assert.match(marker[0].caption ?? "", /^UNVERIFIED — /);
});

test("Irenaeus, Against Heresies I.29–31 is imported as its own work from the 1885 ANF, voted over three scans, and hangs off the Apocryphon's marker", () => {
  const file = corpusFor("gnostic.irenaeus-against-heresies")!;
  const work = INVENTORY.find((w) => w.workKey === "gnostic.irenaeus-against-heresies")!;
  assert.equal(work.passagePrefix, "gnostic.iren");
  assert.equal(work.traditionClass, "ancient_late_transmission");
  assert.equal(work.corpusGroup, "gnostic");
  assert.equal(work.unitDivisionKind, "section");
  assert.equal(work.expectedUnits, 23);
  assert.equal(work.inventoryVerified, false, "only three chapters of a five-book work, on the editors' numbering");
  // No second marker: it hangs off the Apocryphon of John's.
  assert.equal(work.anchor && "existingSlug" in work.anchor && work.anchor.existingSlug, "apocryphon-of-john");
  assert.ok(!INVENTORY.some((w) => w.anchor && "event" in w.anchor && /irenaeus/i.test(w.anchor.event.slug)));
  assert.match(work.attributionNote!, /^A hostile report, not a Gnostic text\./);
  assert.match(work.attributionNote!, /scholarly-standard parallel to the Apocryphon of John/);
  // The Apocryphon entry points here, and says the report is not the Apocryphon.
  const apocryphon = INVENTORY.find((w) => w.workKey === "gnostic.apocryphon-of-john")!;
  assert.ok(apocryphon.fullTextEditions.some((e) => /not the Apocryphon; imported as its own work, gnostic\.irenaeus-against-heresies$/.test(e)));
  assert.ok(INVENTORY.indexOf(work) > INVENTORY.indexOf(apocryphon), "the Apocryphon's marker must exist first");
  for (const key of ["anf-1885-irenaeus", "ancl-1868-irenaeus", "schmidt-irenaeus-quelle-1907", "mead-fragments-1906", "kirsch-eleutherius-1909"]) {
    assert.ok(INVENTORY_SOURCES.some((s) => s.key === key), key);
  }
  // One book record (citing the Latin only), three chapter records without text, and 23 sections.
  const book = file.passages[0];
  assert.equal(book.key, "gnostic.iren.1");
  assert.equal(book.divisionKind, "book");
  assert.equal(book.layers.filter((l) => l.content && l.key !== PLAIN_LAYER_KEY).length, 0);
  assert.ok(book.layers.some((l) => l.key === "lat-vetus" && l.content == null && l.language === "Latin"));
  assert.match(book.notes!, /Not imported, and listed here: the rest of Against Heresies/);
  assert.match(book.summary!, /It is a report by an opponent, not a Gnostic text\./);
  const chapters = file.passages.filter((p) => p.divisionKind === "chapter");
  assert.deepEqual(chapters.map((c) => c.key), ["gnostic.iren.1.29", "gnostic.iren.1.30", "gnostic.iren.1.31"]);
  for (const chapter of chapters) assert.equal(chapter.layers.length, 0, chapter.key);
  const units = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  const expected = [
    ...[1, 2, 3, 4].map((n) => `29.${n}`),
    ...Array.from({ length: 15 }, (_, i) => `30.${i + 1}`),
    ...[1, 2, 3, 4].map((n) => `31.${n}`),
  ].map((ref) => `gnostic.iren.1.${ref}`);
  assert.deepEqual(units.map((u) => u.key), expected);
  assert.equal(IRENAEUS_UNITS.length, 23);
  assert.equal(file.passages.length, 27);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 23, verifiedUnits: 0 }), "verified_against_edition");
  const text = (ref: string) => file.passages.find((p) => p.key === `gnostic.iren.1.${ref}`)!.layers.find((l) => l.key === "eng-1885")!.content!;
  for (const unit of units) {
    assert.equal(unit.verificationStatus, "unverified", unit.key);
    assert.equal(unit.parentKey, unit.key.replace(/\.\d+$/, ""), unit.key);
    const layer = unit.layers.find((l) => l.key === "eng-1885")!;
    assert.equal(layer.licence, "public_domain", unit.key);
    assert.equal(layer.layer, "translation", unit.key);
    assert.equal(layer.sourceKey, "anf-1885-irenaeus", unit.key);
    assert.match(layer.evidence, /three independent scans of the 1885 plates/, unit.key);
    assert.match(layer.evidence, /scripts\/texts\/irenaeus-against-heresies\.py/, unit.key);
    assert.match(layer.evidence, /Irenaeus's hostile report of what others taught/, unit.key);
    assert.match(unit.reference, /^Irenaeus, Against Heresies I\.\d\d\.\d+; The Ante-Nicene Fathers, vol\. I \(Buffalo, 1885\), (p\. \d+|pp\. \d+–\d+)$/, unit.key);
    assert.match(unit.summary!, /^Irenaeus (says|reports|calls|gives)/, unit.key);
    assert.ok(unit.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${unit.key} has no plain words`);
    assert.doesNotMatch(layer.content!, /_|�|--|  |\n|⟦|¦|IREN|HERESIES|— /, unit.key);
  }
  assert.match(text("29.1"), /^Besides those, however, among these heretics who are Simonians/);
  assert.match(text("29.1"), /and in conception \[thus formed\], rejoicing/);
  assert.match(text("29.4"), /to the uttermost, and looked down/);
  assert.match(text("29.4"), /“I am a jealous God, and besides me there is no one\.” Such are the falsehoods which these people invent\.$/);
  assert.match(text("30.3"), /and begirt it all round/);
  assert.match(text("30.5"), /Ialdabaoth; he, again, descended from him, is named Iao/);
  assert.match(text("30.5"), /Astanphæus/);
  assert.match(text("30.11"), /Joel, and Zechariah, to Sabaoth/);
  assert.match(text("30.11"), /maintain that Sophia herself has also spoken/);
  assert.match(text("31.1"), /which they style the Gospel of Judas\.$/);
  assert.match(text("31.4"), /may inflict wounds upon it from every side\.$/);
  // The footnotes are listed, not imported; the eight that warn of a doubtful text are quoted.
  assert.equal(IRENAEUS_NOTES.length, 23);
  assert.deepEqual(
    ["translators", "coxe", "both"].map((by) => IRENAEUS_NOTES.filter((n) => n.by === by).length),
    [19, 2, 2]
  );
  const essential = IRENAEUS_NOTES.filter((n) => n.essential);
  assert.deepEqual(essential.map((n) => `${n.chapter}.${n.section}`), ["29.1", "30.2", "30.5", "30.9", "30.10", "30.11", "30.15", "31.2"]);
  for (const note of IRENAEUS_NOTES) {
    const unit = file.passages.find((p) => p.key === `gnostic.iren.1.${note.chapter}.${note.section}`)!;
    assert.ok(unit.notes!.includes(`after '${note.after}'`), `${unit.key}: footnote after '${note.after}' is not listed`);
    assert.equal(unit.notes!.includes(note.text), note.essential, `${unit.key}: only essential footnotes are quoted`);
    assert.ok(!unit.layers.some((l) => l.content?.includes(note.text)), `${unit.key}: a footnote was imported`);
  }
  // The I.29 parallel with the Apocryphon is stated as Schmidt's, and the report is never called the Apocryphon.
  const ch29 = chapters[0];
  assert.match(ch29.notes!, /scholarly-standard parallel/);
  assert.match(ch29.notes!, /keinem Zweifel \[unterliegt\], daß die von Irenäus exzerpierte gnostische Schrift mit unserm Apokryphon Johannis identisch ist' \(Philotesia, Berlin, 1907, p\. 335\)/);
  assert.match(ch29.notes!, /Mead's summary .*'The Gospel of Mary'/);
  assert.match(chapters[1].notes!, /never names its teachers/);
});

test("Irenaeus's Against Heresies is dated by Eleutherius's episcopate, named in III.3.3, and its English to 1868 and 1885", () => {
  const file = corpusFor("gnostic.irenaeus-against-heresies")!;
  const book = file.passages[0];
  assert.deepEqual(
    book.dates!.map((d) => [d.role, d.startYear, d.endYear, d.isApproximate, d.sourceKey]),
    [
      ["composition", 174, 189, true, "anf-1885-irenaeus"],
      ["translation_publication", 1868, 1868, false, "ancl-1868-irenaeus"],
      ["translation_publication", 1885, 1885, false, "anf-1885-irenaeus"],
    ]
  );
  const [composition] = book.dates!;
  assert.match(composition.originalDateText, /Eleutherius does now, in the twelfth place from the apostles/);
  assert.match(composition.originalDateText, /III\.3\.3/);
  assert.match(composition.evidence, /'c\. 174-189' by Kirsch/);
  assert.match(composition.evidence, /between A\.D\. 182 and A\.D\. 188/);
  assert.match(composition.evidence, /'c\. 180'/);
  assert.equal(file.manuscripts, undefined, "no manuscript of these chapters is dated in this import");
  const work = INVENTORY.find((w) => w.workKey === "gnostic.irenaeus-against-heresies")!;
  const claims = work.anchor && "existingSlug" in work.anchor ? (work.anchor.extraClaims ?? []) : [];
  assert.deepEqual(claims.map((c) => dateRoleFromWhatIsDated(c.whatIsDated!)), ["earliest_evidence"]);
  assert.deepEqual(claims.map((c) => [c.startYear, c.endYear]), [[174, 189]]);
  assert.match(claims[0].whatIsDated!, /Irenaeus's report of a closely related system/);
  assert.match(claims[0].evidence, /his report is not the Apocryphon itself/);
  // The Apocryphon's own dates (its Coptic copies) stay on its marker and are not repeated.
  const apocryphon = INVENTORY.find((w) => w.workKey === "gnostic.apocryphon-of-john")!;
  const own = apocryphon.anchor && "event" in apocryphon.anchor ? apocryphon.anchor.event.claims : [];
  assert.ok(own.some((c) => c.startYear === 300 && c.endYear === 400));
  assert.ok(!(book.dates ?? []).some((d) => d.startYear === 300));
});

test("Irenaeus's links are proposed resemblances, all from his report, and none claims one text knew another", () => {
  const file = corpusFor("gnostic.irenaeus-against-heresies")!;
  const links = file.links ?? [];
  assert.equal(links.length, 11);
  const keys = new Set(ALL_CORPORA.flatMap((f) => f.passages.map((p) => p.key)));
  assert.equal(new Set(links.map((l) => l.key)).size, links.length, "duplicate link key");
  for (const link of links) {
    assert.ok(keys.has(link.from) && keys.has(link.to), link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^gnostic\.iren\.1\.\d\d\.\d+$/, link.key);
    assert.ok(["close_conceptual_parallel", "symbolic_similarity", "broad_thematic_resemblance"].includes(link.connectionClass), link.key);
    assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    assert.doesNotMatch(`${link.similarities} ${link.differences} ${link.transmissionEvidence}`, /\bcop(ied|y)\b/, link.key);
    assert.match(`${link.similarities} ${link.differences}`, /Irenaeus('s)? (report|reports)/, link.key);
    // No link to the Apocryphon: it has no passages here, and its parallel is in the notes.
    assert.doesNotMatch(link.to, /apjohn/, link.key);
  }
  const to = (from: string) => links.filter((l) => l.from === `gnostic.iren.1.${from}`).map((l) => l.to);
  assert.deepEqual(to("29.1"), ["gnostic.ps.8"]);
  assert.deepEqual(to("29.4"), ["gnostic.ps.31"]);
  assert.deepEqual(to("30.4"), ["herm.ch.1.26", "modern.hpb.cosmo.4"]);
  assert.deepEqual(to("30.5"), ["gnostic.ps.31", "greek.mithras.1907.11"]);
  assert.deepEqual(to("30.7"), ["modern.hall.17.s2.p1"]);
  assert.deepEqual(to("30.9"), ["herm.ch.1.9"]);
  assert.deepEqual(to("30.12"), ["gnostic.ps.15", "herm.ch.1.25"]);
  assert.deepEqual(to("30.15"), ["modern.hall.19.s1.p3"]);
  // The name 'Ophites' is the editors', and the Hall link says so.
  assert.match(links.find((l) => l.to === "modern.hall.19.s1.p3")!.differences, /never uses the name 'Ophites'/);
});

test("Irenaeus's pictures are from Commons, related evidence is labelled, the unverified say so first, and the Apocryphon's marker is not duplicated", () => {
  const file = corpusFor("gnostic.irenaeus-against-heresies")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  const seen = new Map(images.map((i) => [i.key, i]));
  assert.equal(seen.size, 4);
  const elsewhere = new Set(ALL_CORPORA.filter((f) => f.workKey !== "gnostic.irenaeus-against-heresies").flatMap((f) => [...(f.images ?? []), ...f.passages.flatMap((p) => p.images ?? [])].map((i) => i.url)));
  const marker = MARKER_PICTURES["apocryphon-of-john"];
  for (const image of seen.values()) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    assert.ok(image.licence, image.key);
    assert.ok(!elsewhere.has(image.url), `${image.key} repeats a picture shown elsewhere`);
    assert.ok(!marker.some((m) => m.url === image.url), `${image.key} repeats the marker's picture`);
    if (image.identificationStatus === "unverified") {
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
  }
  assert.equal(seen.get("iren-erasmus-1526-title-page")!.identificationStatus, "secure");
  assert.equal(seen.get("iren-p-oxy-405")!.identificationStatus, "secure");
  assert.match(seen.get("iren-p-oxy-405")!.caption, /^Related evidence, not the chapters imported here: /);
  assert.equal(seen.get("iren-latin-manuscript-book-iv-opening")!.identificationStatus, "unverified");
  assert.match(seen.get("iren-latin-manuscript-book-iv-opening")!.whatIsUnverified!, /names no shelfmark/);
  const berlin = seen.get("iren-berlin-8502-pages-22-127")!;
  assert.equal(berlin.identificationStatus, "unverified");
  assert.match(berlin.caption, /^UNVERIFIED — Related evidence, not Irenaeus: /);
  assert.match(berlin.licence!, /CC BY-SA 4\.0/);
  // The Apocryphon keeps its own marker and its two pictures; no new marker was made.
  assert.equal(marker.length, 2);
  assert.ok(!Object.keys(MARKER_PICTURES).some((slug) => /irenaeus/i.test(slug)));
});

test("Origen, Against Celsus VI.22–38 is imported as its own work from the 1885 ANF, voted over three scans, with its own marker", () => {
  const file = corpusFor("gnostic.origen-contra-celsum")!;
  const work = INVENTORY.find((w) => w.workKey === "gnostic.origen-contra-celsum")!;
  assert.equal(work.passagePrefix, "gnostic.origen");
  assert.equal(work.briefItem, 23);
  assert.equal(work.traditionClass, "ancient_late_transmission");
  assert.equal(work.corpusGroup, "gnostic");
  assert.equal(work.unitDivisionKind, "chapter");
  assert.equal(work.expectedUnits, 17);
  assert.equal(work.inventoryVerified, false, "seventeen chapters of an eight-book work, on the editors' numbering");
  assert.match(work.attributionNote!, /^A hostile report inside a refutation, not an Ophite text\./);
  assert.match(work.attributionNote!, /Three voices are kept apart throughout/);
  // Items 23 and 18 of the brief point here.
  const related = INVENTORY.find((w) => w.workKey === "gnostic.related")!;
  assert.ok(related.proposedMembers!.some((m) => /^Origen, Contra Celsum VI\.22–38 .*; imported as its own work, gnostic\.origen-contra-celsum$/.test(m)));
  const greek = INVENTORY.find((w) => w.workKey === "greek.related")!;
  assert.ok(greek.proposedMembers!.some((m) => /^Origen, Contra Celsum VI\.22 .*gnostic\.origen-contra-celsum$/.test(m)));
  for (const key of ["anf-1885-origen", "ancl-1872-origen", "eusebius-he-npnf-1890", "turner-celsus-1908"]) {
    assert.ok(INVENTORY_SOURCES.some((s) => s.key === key), key);
  }
  // One book record (citing the Greek only) and 17 chapters.
  const book = file.passages[0];
  assert.equal(book.key, "gnostic.origen.6");
  assert.equal(book.divisionKind, "book");
  assert.equal(book.layers.filter((l) => l.content && l.key !== PLAIN_LAYER_KEY).length, 0);
  assert.ok(book.layers.some((l) => l.key === "grc" && l.content == null && l.language === "Greek"));
  assert.match(book.notes!, /Not imported, and listed here: the rest of Against Celsus/);
  assert.match(book.summary!, /It is a hostile report, not an Ophite text\.$/);
  const units = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  assert.deepEqual(
    units.map((u) => u.key),
    Array.from({ length: 17 }, (_, i) => `gnostic.origen.6.${22 + i}`)
  );
  assert.equal(ORIGEN_UNITS.length, 17);
  assert.equal(file.passages.length, 18);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 17, verifiedUnits: 0 }), "verified_against_edition");
  const text = (n: number) => file.passages.find((p) => p.key === `gnostic.origen.6.${n}`)!.layers.find((l) => l.key === "eng-1885")!.content!;
  for (const unit of units) {
    assert.equal(unit.verificationStatus, "unverified", unit.key);
    assert.equal(unit.parentKey, "gnostic.origen.6", unit.key);
    const layer = unit.layers.find((l) => l.key === "eng-1885")!;
    assert.equal(layer.licence, "public_domain", unit.key);
    assert.equal(layer.layer, "translation", unit.key);
    assert.equal(layer.sourceKey, "anf-1885-origen", unit.key);
    assert.match(layer.evidence, /three independent scans of the 1885 plates/, unit.key);
    assert.match(layer.evidence, /scripts\/texts\/origen-contra-celsum\.py/, unit.key);
    assert.match(layer.evidence, /Origen's hostile report, in his reply to Celsus, not an Ophite text/, unit.key);
    assert.match(unit.reference, /^Origen, Against Celsus VI\.\d\d \(chapter [XVI]+\); The Ante-Nicene Fathers, vol\. IV \(Buffalo, 1885\), (p\. \d+|pp\. \d+–\d+)$/, unit.key);
    assert.match(unit.summary!, /^Origen (says|reports|quotes|describes|sets|gives|offers|continues)/, unit.key);
    assert.match(unit.notes!, /^Voices?: /, unit.key);
    assert.ok(unit.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${unit.key} has no plain words`);
    assert.doesNotMatch(layer.content!, /_|�|--|  |\n|⟦|¦|ORIGEN|CELSUS|— |\d/, unit.key);
  }
  assert.match(text(22), /^After this, Celsus, desiring to exhibit his learning/);
  assert.match(text(22), /There is a ladder with lofty gates, and on the top of it an eighth gate\./);
  assert.match(text(22), /of that which takes place among the planets/);
  assert.match(text(24), /a very insignificant sect called Ophites/);
  assert.match(text(25), /ten circles, distinct from each other, but united by one circle/);
  assert.match(text(26), /which they never uttered, instead of/);
  assert.match(text(28), /or omit even that He was a wise man/);
  assert.match(text(30), /Michael the Lion-like/);
  assert.match(text(30), /Onoel, or Thartharaoth, being somewhat asinine in appearance/);
  assert.match(text(31), /“O governor of the fifth realm, powerful Sabaoth/);
  assert.match(text(31), /O Horæus, who didst obtain the government of the first gate/);
  assert.match(text(32), /such matters\./);
  assert.match(text(32), /Iao or Jah, and Sabaoth, and Adonæus, and Eloæus/);
  assert.match(text(34), /a carpenter by craft/);
  assert.match(text(35), /an effluent from a heavenly church/);
  assert.match(text(38), /strangers to our Christian faith\.$/);
  // The footnotes are listed, not imported; the eight that say the Greek is uncertain or emended are quoted.
  assert.equal(ORIGEN_NOTES.length, 79);
  assert.deepEqual(
    ["translator", "american", "both"].map((by) => ORIGEN_NOTES.filter((n) => n.by === by).length),
    [74, 3, 2]
  );
  const essential = ORIGEN_NOTES.filter((n) => n.essential);
  assert.deepEqual(essential.map((n) => n.chapter), ["22", "22", "22", "29", "31", "33", "36", "38"]);
  for (const note of ORIGEN_NOTES) {
    const unit = file.passages.find((p) => p.key === `gnostic.origen.6.${note.chapter}`)!;
    assert.ok(unit.notes!.includes(`after '${note.after}'`), `${unit.key}: footnote after '${note.after}' is not listed`);
    assert.equal(unit.notes!.includes(note.text), note.essential, `${unit.key}: only essential footnotes are quoted`);
    assert.ok(!unit.layers.some((l) => l.content?.includes(note.text)), `${unit.key}: a footnote was imported`);
  }
  // The three voices: Celsus quoted, Origen's description, the prayers as taught.
  const notes = (n: number) => file.passages.find((p) => p.key === `gnostic.origen.6.${n}`)!.notes!;
  assert.match(notes(22), /is Celsus's, as Origen quotes him/);
  assert.match(notes(24), /the naming of the Ophites is Origen's opinion/);
  assert.match(notes(24), /a modern editor's cross-reference, not a statement by Origen/);
  assert.match(notes(30), /the names are what Origen says he found in the diagram/);
  assert.match(notes(31), /given by Origen as what 'they are taught to say'/);
  assert.match(notes(31), /No prayer to a fourth gate/);
  assert.match(notes(28), /1872 printing reads 'or admit even that He was a wise man'/);
});

test("Origen's reply is dated by Eusebius to Philip's reign, Celsus's True Word to 175–180 (debated), and its English to 1872 and 1885", () => {
  const file = corpusFor("gnostic.origen-contra-celsum")!;
  const book = file.passages[0];
  assert.deepEqual(
    book.dates!.map((d) => [d.role, d.startYear, d.endYear, d.datePrecision, d.isApproximate, d.sourceKey]),
    [
      ["composition", 175, 180, "decade", true, "turner-celsus-1908"],
      ["composition", 244, 249, "decade", true, "eusebius-he-npnf-1890"],
      ["translation_publication", 1872, 1872, "year", false, "ancl-1872-origen"],
      ["translation_publication", 1885, 1885, "year", false, "anf-1885-origen"],
    ]
  );
  const [celsus, origen] = book.dates!;
  assert.match(celsus.evidence, /^The date of Celsus's lost True Word, which Origen quotes in these chapters, not of Origen's reply\./);
  assert.match(celsus.evidence, /Keim fixes the date of the work at 178/);
  assert.match(celsus.evidence, /The date is debated\./);
  assert.match(origen.originalDateText, /Eusebius, Church History VI\.36\.2/);
  assert.match(origen.evidence, /over sixty years old/);
  assert.match(origen.evidence, /'c\. 248'/);
  // Its own marker, with the same two compositions kept apart.
  const work = INVENTORY.find((w) => w.workKey === "gnostic.origen-contra-celsum")!;
  assert.ok(work.anchor && "event" in work.anchor);
  const event = work.anchor && "event" in work.anchor ? work.anchor.event : undefined;
  assert.equal(event!.slug, "origen-against-celsus-ophite-diagram");
  assert.deepEqual(
    event!.claims.map((c) => [dateRoleFromWhatIsDated(c.whatIsDated!), c.startYear, c.endYear]),
    [
      ["composition", 244, 249],
      ["composition", 175, 180],
      ["translation_publication", 1885, undefined],
    ]
  );
  assert.match(event!.claims[1].whatIsDated!, /Celsus's True Word, which Origen quotes/);
});

test("Origen's links are proposed resemblances, from his report, and none claims one text knew another", () => {
  const file = corpusFor("gnostic.origen-contra-celsum")!;
  const links = file.links ?? [];
  assert.equal(links.length, 11);
  const keys = new Set(ALL_CORPORA.flatMap((f) => f.passages.map((p) => p.key)));
  assert.equal(new Set(links.map((l) => l.key)).size, links.length, "duplicate link key");
  for (const link of links) {
    assert.ok(keys.has(link.from) && keys.has(link.to), link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^gnostic\.origen\.6\.\d\d$/, link.key);
    assert.ok(
      ["close_conceptual_parallel", "symbolic_similarity", "broad_thematic_resemblance", "speculative_connection"].includes(link.connectionClass),
      link.key
    );
    assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    assert.doesNotMatch(`${link.similarities} ${link.differences} ${link.transmissionEvidence}`, /\bcop(ied|y)\b/, link.key);
    assert.match(`${link.similarities} ${link.differences}`, /Origen|Celsus/, link.key);
  }
  const to = (from: number) => links.filter((l) => l.from === `gnostic.origen.6.${from}`).map((l) => l.to);
  assert.deepEqual(to(22), ["herm.ch.1.25", "herm.ch.1.26", "modern.hall.1.s2.p4", "modern.hall.42.p4"]);
  assert.deepEqual(to(25), ["modern.hpb.cosmo.5"]);
  assert.deepEqual(to(28), ["modern.hall.19.s1.p3"]);
  assert.deepEqual(to(30), ["gnostic.iren.1.30.9", "greek.mithras.1907.11"]);
  assert.deepEqual(to(31), ["gnostic.ps.31", "greek.mithras.1907.7"]);
  assert.deepEqual(to(32), ["gnostic.iren.1.30.5"]);
  // The ANF editors' cross-references to Irenaeus are not evidence of transmission.
  for (const link of links.filter((l) => l.to.startsWith("gnostic.iren."))) {
    assert.match(link.transmissionEvidence, /a modern editor's comparison; Origen does not name Irenaeus here/, link.key);
  }
});

test("Origen's pictures are from Commons, the manuscripts and the mosaic are marked UNVERIFIED, and the diagram is shown only in modern reconstructions", () => {
  const file = corpusFor("gnostic.origen-contra-celsum")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  const seen = new Map(images.map((i) => [i.key, i]));
  assert.equal(seen.size, 5);
  const elsewhere = new Set(ALL_CORPORA.filter((f) => f.workKey !== "gnostic.origen-contra-celsum").flatMap((f) => [...(f.images ?? []), ...f.passages.flatMap((p) => p.images ?? [])].map((i) => i.url)));
  for (const image of seen.values()) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    assert.ok(image.licence, image.key);
    assert.ok(!elsewhere.has(image.url), `${image.key} repeats a picture shown elsewhere`);
    if (image.identificationStatus === "unverified") {
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
  }
  for (const key of ["origen-tura-papyrus-cairo-je-88747-p29", "origen-bnf-grec-945-f48r"]) {
    const image = seen.get(key)!;
    assert.equal(image.identificationStatus, "unverified", key);
    assert.equal(image.shows, "manuscript", key);
    assert.match(image.caption, /not Book VI, chapters 22–38\.$/, key);
  }
  const gates = seen.get("origen-ostia-mithraeum-seven-gates-mosaic")!;
  assert.equal(gates.identificationStatus, "unverified");
  assert.match(gates.caption, /^UNVERIFIED — Related evidence, not the ladder Celsus describes: /);
  assert.match(gates.caption, /a modern comparison, not something either writer says\.$/);
  // No ancient copy of the diagram survives: the drawings are Matter's and Witte's reconstructions and say so.
  const matter = seen.get("origen-matter-ophite-diagram-reconstruction")!;
  assert.equal(matter.shows, "reconstruction");
  assert.equal(matter.identificationStatus, "modern_interpretation");
  assert.match(matter.caption, /not a copy of an ancient diagram/);
  const witte = seen.get("origen-witte-ophite-diagram-reconstruction")!;
  assert.equal(witte.shows, "reconstruction");
  assert.equal(witte.identificationStatus, "modern_interpretation");
  assert.match(witte.caption, /^A modern reconstruction/);
  assert.match(witte.caption, /not a copy of an ancient diagram/);
  assert.match(witte.licence!, /CC BY 3\.0/);
  // The marker's cover is the manuscript page, marked UNVERIFIED; the reconstruction follows it.
  const marker = MARKER_PICTURES["origen-against-celsus-ophite-diagram"];
  assert.equal(marker.length, 2);
  assert.equal(marker[0].url, seen.get("origen-bnf-grec-945-f48r")!.url);
  assert.equal(marker[0].identificationStatus, "unverified");
  assert.equal(marker[1].url, witte.url);
  assert.equal(marker[1].shows, "reconstruction");
  assert.match(marker[1].caption ?? "", /reconstruction/);
});

test("the Ascension of Isaiah vi–xi is imported as its own work, verse by verse, from Charles 1900, with his signs", () => {
  const file = corpusFor("gnostic.ascension-of-isaiah")!;
  const work = INVENTORY.find((w) => w.workKey === "gnostic.ascension-of-isaiah")!;
  assert.equal(work.passagePrefix, "gnostic.ascisa");
  assert.equal(work.briefItem, 23);
  assert.equal(work.corpusGroup, "gnostic");
  assert.equal(work.traditionClass, "ancient_late_transmission");
  assert.equal(work.unitDivisionKind, "verse");
  assert.equal(work.expectedUnits, 197);
  assert.equal(work.inventoryVerified, false, "Charles's verse numbering, not checked against other editions");
  assert.match(work.attributionNote!, /^A composite book, 'partly of Jewish, partly of Christian origin'/);
  assert.match(work.summary, /a Christian apocalypse/);
  // Item 23 of the brief points here, and the inventory lists Charles 1900 as the full-text edition.
  const related = INVENTORY.find((w) => w.workKey === "gnostic.related")!;
  assert.ok(related.proposedMembers!.includes("Ascension of Isaiah 6–11 — ascent through seven heavens; imported as its own work, gnostic.ascension-of-isaiah"));
  assert.ok(related.fullTextEditions.includes("Charles 1900 (Ascension of Isaiah)"));
  for (const key of ["charles-1900-ascension", "laurence-1819-ascension", "ecw-ascension-transcription"]) {
    assert.ok(INVENTORY_SOURCES.some((s) => s.key === key), key);
  }
  // One record for the Vision (citing the Ge'ez only), six chapters, 197 verses (ix. 12–13 as one).
  const vision = file.passages[0];
  assert.equal(vision.key, "gnostic.ascisa.vision");
  assert.equal(vision.layers.filter((l) => l.content && l.key !== PLAIN_LAYER_KEY).length, 0);
  assert.ok(vision.layers.some((l) => l.key === "gez" && l.content == null && l.language === "Ge'ez"));
  assert.match(vision.summary!, /It is not a Gnostic text\.$/);
  assert.match(vision.notes!, /Not imported, and listed here: chapters i–v \(the Martyrdom of Isaiah/);
  assert.match(vision.notes!, /Richard Laurence's English \(Oxford, 1819\)/);
  const chapters = file.passages.filter((p) => p.divisionKind === "chapter");
  assert.deepEqual(chapters.map((c) => c.key), ["6", "7", "8", "9", "10", "11"].map((c) => `gnostic.ascisa.${c}`));
  const verses = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  assert.equal(verses.length, 197);
  assert.equal(ASCENSION_UNITS.length, 197);
  assert.equal(file.passages.length, 1 + 6 + 197);
  const counts = Object.fromEntries(chapters.map((c) => [c.key, verses.filter((v) => v.parentKey === c.key).length]));
  assert.deepEqual(counts, { "gnostic.ascisa.6": 17, "gnostic.ascisa.7": 37, "gnostic.ascisa.8": 28, "gnostic.ascisa.9": 41, "gnostic.ascisa.10": 31, "gnostic.ascisa.11": 43 });
  assert.ok(verses.some((v) => v.key === "gnostic.ascisa.9.12-13"));
  assert.ok(!verses.some((v) => v.key === "gnostic.ascisa.9.12" || v.key === "gnostic.ascisa.9.13"));
  assert.notEqual(deriveCompleteness(work, { importedUnits: 197, verifiedUnits: 0 }), "verified_against_edition");
  const text = (key: string) => file.passages.find((p) => p.key === `gnostic.ascisa.${key}`)!.layers.find((l) => l.key === "eng-1900")!.content!;
  for (const verse of verses) {
    assert.equal(verse.verificationStatus, "unverified", verse.key);
    const layer = verse.layers.find((l) => l.key === "eng-1900")!;
    assert.equal(layer.licence, "public_domain", verse.key);
    assert.equal(layer.layer, "translation", verse.key);
    assert.equal(layer.sourceKey, "charles-1900-ascension", verse.key);
    assert.match(layer.evidence, /scripts\/texts\/ascension-of-isaiah\.py/, verse.key);
    assert.match(verse.reference, /^Ascension of Isaiah [vix]+\. [\d, ]+ \(Charles's chapter and verse\); Charles, The Ascension of Isaiah \(London, 1900\), (p\. \d+|pp\. \d+–\d+)$/, verse.key);
    assert.ok(verse.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${verse.key} has no plain words`);
    // No OCR debris: no stray quotation-mark signs, no footnote numerals, no doubled spaces, no TM or hyphen breaks.
    assert.doesNotMatch(layer.content!, /"|™|_|�|  |- |\b(ix|vi|vii|viii|x|xi)\. \d|\d/, verse.key);
  }
  // Charles's signs are kept, and every half-bracket that opens closes.
  const all = ASCENSION_UNITS.map((u) => u.text).join(" ");
  assert.equal((all.match(/⸢/g) ?? []).length, (all.match(/⸣/g) ?? []).length);
  assert.equal((all.match(/†/g) ?? []).length % 2, 0);
  assert.equal((all.match(/\*/g) ?? []).length % 2, 0);
  assert.match(text("6.1"), /^THE VISION WHICH ISAIAH THE SON OF AMOS SAW\.\n\nIn the twentieth year of the reign of Hezekiah/);
  assert.match(text("6.9"), /†who had thus bestowed a door in an alien world, had bestowed \(it\) on a man†/);
  assert.match(text("7.10"), /^And as above so on the earth also; for the likeness of that which is in the firmament is here on the earth\.$/);
  assert.match(text("7.34"), /\[from the third to the fourth\]/);
  assert.match(text("8.14"), /and likewise other numbered garments/);
  assert.match(text("9.12-13"), /\[will descend, I say\]/);
  assert.match(text("9.16"), /\[and he will remain in that world five hundred and forty-five days\]/);
  assert.match(text("10.24"), /demanded the password, and the Lord gave \(it\) to them/);
  assert.match(text("11.8"), /she was astonied\.$/);
  assert.match(text("11.40"), /^\. \. \. \*Such things\* ye will read\./);
  assert.match(text("11.43"), /he was destroyed\.\n\nHere endeth the vision of Isaiah the prophet with his ascension\.$/);
  // Verse notes explain the signs, and the composite character is stated on the chapters.
  assert.match(file.passages.find((p) => p.key === "gnostic.ascisa.9.16")!.notes!, /'The idea is a Gnostic one\./);
  assert.match(file.passages.find((p) => p.key === "gnostic.ascisa.11")!.notes!, /xi\. 41–43 in the margin as editorial additions/);
});

test("the Vision of Isaiah is dated only from Charles 1900: its first form to the close of the first century, its English to 1900", () => {
  const file = corpusFor("gnostic.ascension-of-isaiah")!;
  const vision = file.passages[0];
  assert.deepEqual(
    vision.dates!.map((d) => [d.role, d.startYear, d.endYear, d.datePrecision, d.isApproximate, d.sourceKey]),
    [
      ["composition", 80, 100, "decade", true, "charles-1900-ascension"],
      ["composition", 150, 230, "century", true, "charles-1900-ascension"],
      ["translation_publication", 400, 500, "century", true, "charles-1900-ascension"],
      ["manuscript", 1400, 1500, "century", true, "charles-1900-ascension"],
      ["earliest_evidence", 400, 600, "century", true, "charles-1900-ascension"],
      ["translation_publication", 1900, 1900, "year", false, "charles-1900-ascension"],
    ]
  );
  const [composition, editing] = vision.dates!;
  assert.match(composition.originalDateText!, /belongs to the close of the first century/);
  assert.match(composition.evidence, /Actus Petri Vercellenses/);
  assert.match(composition.evidence, /one scholar's dating of 1900/);
  assert.match(editing.originalDateText!, /early in the third century, or even to the second/);
  const work = INVENTORY.find((w) => w.workKey === "gnostic.ascension-of-isaiah")!;
  const event = work.anchor && "event" in work.anchor ? work.anchor.event : undefined;
  assert.equal(event!.slug, "ascension-of-isaiah-vision");
  assert.deepEqual(
    event!.claims.map((c) => [dateRoleFromWhatIsDated(c.whatIsDated!), c.startYear, c.endYear]),
    [
      ["composition", 80, 100],
      ["composition", 150, 230],
      ["translation_publication", 1900, undefined],
    ]
  );
});

test("the Ascension's links are proposed resemblances, and none claims one text knew another", () => {
  const file = corpusFor("gnostic.ascension-of-isaiah")!;
  const links = file.links ?? [];
  assert.equal(links.length, 8);
  const keys = new Set(ALL_CORPORA.flatMap((f) => f.passages.map((p) => p.key)));
  assert.equal(new Set(links.map((l) => l.key)).size, links.length, "duplicate link key");
  for (const link of links) {
    assert.ok(keys.has(link.from) && keys.has(link.to), link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^gnostic\.ascisa\.\d+\.[\d-]+$/, link.key);
    assert.ok(["close_conceptual_parallel", "symbolic_similarity", "broad_thematic_resemblance", "speculative_connection"].includes(link.connectionClass), link.key);
    assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    assert.doesNotMatch(`${link.similarities} ${link.differences} ${link.transmissionEvidence}`, /\bcop(ied|y)\b/, link.key);
  }
  assert.deepEqual(
    links.map((l) => [l.from, l.to]),
    [
      ["gnostic.ascisa.9.16", "gnostic.iren.1.30.14"],
      ["gnostic.ascisa.10.20", "gnostic.ps.7"],
      ["gnostic.ascisa.10.24", "gnostic.origen.6.31"],
      ["gnostic.ascisa.7.10", "modern.kyb.1908.8"],
      ["gnostic.ascisa.7.25", "herm.ch.1.25"],
      ["gnostic.ascisa.9.9", "herm.ch.1.26"],
      ["gnostic.ascisa.9.1", "greek.mithras.1907.9"],
      ["gnostic.ascisa.10.5", "modern.hall.16.s2.p2"],
    ]
  );
  // Charles's own comparison with Irenaeus is reported as an editor's, not as evidence.
  const iren = links[0];
  assert.match(iren.transmissionEvidence, /a modern editor's comparison, not evidence that either text knew the other/);
});

test("the Ascension's pictures are from Commons and all are marked UNVERIFIED: no manuscript of chapters vi–xi was found", () => {
  const file = corpusFor("gnostic.ascension-of-isaiah")!;
  const images = [...(file.images ?? []), ...file.passages.flatMap((p) => p.images ?? [])];
  const seen = new Map(images.map((i) => [i.key, i]));
  assert.equal(seen.size, 4);
  const elsewhere = new Set(ALL_CORPORA.filter((f) => f.workKey !== "gnostic.ascension-of-isaiah").flatMap((f) => [...(f.images ?? []), ...f.passages.flatMap((p) => p.images ?? [])].map((i) => i.url)));
  for (const image of seen.values()) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    assert.ok(image.licence, image.key);
    assert.ok(!elsewhere.has(image.url), `${image.key} repeats a picture shown elsewhere`);
    assert.equal(image.identificationStatus, "unverified", image.key);
    assert.match(image.caption, /^UNVERIFIED — /, image.key);
    assert.ok(image.whatIsUnverified, image.key);
  }
  const papyrus = seen.get("ascisa-amherst-greek-papyrus-1-verso")!;
  assert.equal(papyrus.shows, "manuscript");
  assert.match(papyrus.caption, /^UNVERIFIED — Related evidence, not chapters vi–xi: /);
  assert.match(papyrus.objectDate!, /do not agree/);
  for (const key of ["ascisa-alcobaca-bible-martyrdom-of-isaiah", "ascisa-historienbibel-isaiah-sawn", "ascisa-lower-pool-of-siloam-1881"]) {
    assert.equal(seen.get(key)!.shows, "later_artwork", key);
    assert.match(seen.get(key)!.caption, /xi\. 41/, key);
  }
  // Its own marker: the papyrus first, then the Alcobaça miniature, both UNVERIFIED.
  const marker = MARKER_PICTURES["ascension-of-isaiah-vision"];
  assert.equal(marker.length, 2);
  assert.equal(marker[0].url, papyrus.url);
  assert.equal(marker[1].url, seen.get("ascisa-alcobaca-bible-martyrdom-of-isaiah")!.url);
  for (const picture of marker) assert.equal(picture.identificationStatus, "unverified");
});

test("2 Enoch is imported as its own work, verse by verse, from Morfill and Charles 1896, with Charles's signs", () => {
  const file = corpusFor("gnostic.secrets-of-enoch")!;
  const work = INVENTORY.find((w) => w.workKey === "gnostic.secrets-of-enoch")!;
  assert.equal(work.passagePrefix, "gnostic.2en");
  assert.equal(work.briefItem, 23);
  assert.equal(work.corpusGroup, "gnostic");
  assert.equal(work.traditionClass, "ancient_late_transmission");
  assert.equal(work.unitDivisionKind, "verse");
  assert.equal(work.expectedUnits, 357);
  assert.equal(work.inventoryVerified, false, "Charles's chapter and verse, not checked against other editions");
  assert.match(work.attributionNote!, /survives complete only in Slavonic manuscripts of the fourteenth to eighteenth centuries/);
  assert.match(work.attributionNote!, /Milik's \(1976\) for a Byzantine monk of the ninth century/);
  // Item 23 of the brief points here, and lists Morfill & Charles 1896 as the full-text edition.
  const related = INVENTORY.find((w) => w.workKey === "gnostic.related")!;
  assert.ok(related.proposedMembers!.includes("2 Enoch — the seven heavens; imported as its own work, gnostic.secrets-of-enoch"));
  assert.ok(related.fullTextEditions.includes("Morfill & Charles 1896 (2 Enoch)"));
  for (const key of ["morfill-charles-1896-enoch", "orlov-2enoch-intro", "wikipedia-2-enoch"]) {
    assert.ok(INVENTORY_SOURCES.some((s) => s.key === key), key);
  }
  // One record for the book (citing the Slavonic only), the prologue, 68 chapters and 356 verses.
  const book = file.passages[0];
  assert.equal(book.key, "gnostic.2en.book");
  assert.equal(book.layers.filter((l) => l.content && l.key !== PLAIN_LAYER_KEY).length, 0);
  assert.ok(book.layers.some((l) => l.key === "chu" && l.content == null && l.language === "Church Slavonic"));
  assert.match(book.summary!, /survives complete only in Slavonic manuscripts, none earlier than the fourteenth century/);
  assert.match(book.summary!, /It is not a Gnostic text\.$/);
  assert.match(book.notes!, /Not imported, and listed here: Charles's footnotes .*xxi\. 6 and xxii\. 1–3/);
  assert.match(book.notes!, /the Melchizedekian fragment \(pp\. 85–93\)/);
  const prologue = file.passages[1];
  assert.equal(prologue.key, "gnostic.2en.prologue");
  assert.match(prologue.layers.find((l) => l.key === "eng-1896")!.content!, /^THE BOOK OF THE SECRETS OF ENOCH THE SON OF ARED; A MAN WISE AND BELOVED OF GOD¹\.\n\n\[\*Concerning the Life and the Dream of Enoch²\.\]\n\nThere was a very³ wise man/);
  const chapters = file.passages.filter((p) => p.divisionKind === "chapter");
  assert.deepEqual(chapters.map((c) => c.key), Array.from({ length: 68 }, (_, i) => `gnostic.2en.${i + 1}`));
  const verses = file.passages.filter((p) => p.divisionKind === work.unitDivisionKind);
  assert.equal(verses.length, 356);
  assert.equal(SECRETS_OF_ENOCH_UNITS.length, 356);
  assert.equal(file.passages.length, 1 + 1 + 68 + 356);
  assert.equal(file.passages.filter((p) => p.layers.some((l) => l.key === "eng-1896")).length, work.expectedUnits);
  const counts = chapters.map((c) => verses.filter((v) => v.parentKey === c.key).length);
  assert.deepEqual(counts, [
    10, 4, 3, 2, 2, 1, 5, 8, 1, 6, 5, 3, 5, 3, 4, 8, 1, 9, 6, 4, 5, 9, 6, 5, 5, 3, 4, 5, 5, 18, 8, 2, 12, 3, 3, 2, 2, 3, 8, 13, 2, 14, 3, 5, 4, 3, 5, 9, 2,
    5, 5, 15, 4, 1, 3, 2, 2, 6, 5, 5, 5, 3, 4, 5, 10, 8, 3, 7,
  ]);
  // xxii begins at verse 4: A's tenth heaven (xxii. 1–3) is in Charles's notes, not his text.
  assert.deepEqual(verses.filter((v) => v.parentKey === "gnostic.2en.22").map((v) => v.label), Array.from({ length: 9 }, (_, i) => `xxii. ${i + 4}`));
  assert.match(file.passages.find((p) => p.key === "gnostic.2en.22")!.notes!, /Verses 1–3 in manuscript A, .* the tenth heaven, Aravoth/);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 357, verifiedUnits: 0 }), "verified_against_edition");
  const text = (key: string) => file.passages.find((p) => p.key === `gnostic.2en.${key}`)!.layers.find((l) => l.key === "eng-1896")!.content!;
  for (const verse of verses) {
    assert.equal(verse.verificationStatus, "unverified", verse.key);
    const layer = verse.layers.find((l) => l.key === "eng-1896")!;
    assert.equal(layer.licence, "public_domain", verse.key);
    assert.equal(layer.layer, "translation", verse.key);
    assert.equal(layer.sourceKey, "morfill-charles-1896-enoch", verse.key);
    assert.match(layer.evidence, /scripts\/texts\/secrets-of-enoch\.py/, verse.key);
    assert.match(verse.reference, /^2 Enoch [ivxl]+\. \d+ \(Charles's chapter and verse\); Morfill and Charles, The Book of the Secrets of Enoch \(Oxford, 1896\), (p\. \d+|pp\. \d+–\d+)$/, verse.key);
    assert.ok(verse.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${verse.key} has no plain words`);
    // No OCR debris: no straight quotation marks, no stray marks, no doubled spaces, no hyphen breaks, no leftover verse numbers or Cyrillic.
    assert.doesNotMatch(layer.content!, /"|™|_|�|\{|\||  |\w- |[a-z]\. \d+\. [A-Z]|[А-я]/, verse.key);
  }
  // A's chapter titles are kept in square brackets at the head of the verse they precede: 63 of them.
  assert.equal(SECRETS_OF_ENOCH_UNITS.filter((u) => u.title).length, 63);
  for (const unit of SECRETS_OF_ENOCH_UNITS.filter((u) => u.title)) assert.match(unit.title!, /^\[.*\]$/, `${unit.chapter}.${unit.verse}`);
  // Charles's signs are kept: a * span may run on into the next verse, but every one is closed by a raised note number, and ( ) pair up.
  const signs = SECRETS_OF_ENOCH_UNITS.map((u) => `${u.title ?? ""} ${u.text}`).join(" ");
  assert.ok((signs.match(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g) ?? []).length >= (signs.match(/\*/g) ?? []).length, "more * than note numbers");
  for (const unit of SECRETS_OF_ENOCH_UNITS) {
    const t = `${unit.title ?? ""} ${unit.text}`;
    assert.equal((t.match(/\(/g) ?? []).length, (t.match(/\)/g) ?? []).length, `${unit.chapter}.${unit.verse}`);
  }
  assert.match(text("3.2"), /\*And again \(going\) higher I saw the air and \(going still\) higher I saw the ether⁹, and they placed me in the first heaven\.$/);
  assert.match(text("16.5"), /\[Thus the great circle has five hundred and thirty-two years\.\]$/);
  assert.match(text("19.1"), /there is no difference \*in their countenances, or their manner, or the style of their clothing⁸\.$/);
  assert.match(text("22.8"), /take from Enoch his earthly robe, and anoint him with My holy³ oil, and clothe him with the raiment of My glory/);
  assert.match(text("25.1"), /And out came Adoil very great²/);
  assert.match(text("29.4"), /^\[Here Satanail was hurled from the Heights with his Angels\.\]\n\n\*One of these in the ranks of the Archangels/);
  assert.match(text("30.3"), /^In the first and highest circle I placed the star Kruno; and on the second⁷ Aphrodite; on the third Ares; \*on the fourth the Sun¹; on the fifth Zeus; on the sixth Hermes; on the seventh² the moon\.$/);
  assert.match(text("30.8"), /\(1\) His flesh from the earth; .*\(7\) his spirit from My spirit and from the wind\.$/);
  assert.match(text("31.7"), /them I did not curse⁴,$/);
  assert.match(text("33.11"), /Ariukh and Pariukh/);
  assert.match(text("37.1"), /^\[Here God summons an Angel\.\]\n\n\[And God called one of His greatest angels/);
  assert.match(text("37.2"), /no man can look upon thy face⁶\.’\]$/);
  assert.match(text("47.5"), /\* so that¹¹\.$|\*so that¹¹\.$/);
  assert.match(text("48.9"), /^Blessed is the man who bears their yoke/);
  assert.match(text("54.1"), /be the inheritance of your peace³/);
  assert.match(text("68.7"), /from generation to generation, for ever\. Amen⁵\.$/);
  // The notes give the recension decisions and Charles's own arguments as his.
  assert.match(file.passages.find((p) => p.key === "gnostic.2en.20.3")!.notes!, /In the tenth heaven, in the tenth heaven is God/);
  assert.match(file.passages.find((p) => p.key === "gnostic.2en.37")!.notes!, /'xxxvii seems foreign to the entire text\.'/);
  assert.match(file.passages.find((p) => p.key === "gnostic.2en.19.1")!.notes!, /his argument, not shown/);
});

test("2 Enoch is dated from Charles 1896 and from later scholarship as reported, and neither date stands alone", () => {
  const file = corpusFor("gnostic.secrets-of-enoch")!;
  const book = file.passages[0];
  assert.deepEqual(
    book.dates!.map((d) => [d.role, d.startYear, d.endYear, d.datePrecision, d.isApproximate, d.sourceKey]),
    [
      ["composition", 1, 50, "decade", true, "morfill-charles-1896-enoch"],
      ["composition", 800, 900, "century", true, "orlov-2enoch-intro"],
      ["earliest_evidence", 1300, 1400, "century", true, "morfill-charles-1896-enoch"],
      ["manuscript", 1500, 1600, "century", true, "morfill-charles-1896-enoch"],
      ["manuscript", 1650, 1700, "decade", true, "morfill-charles-1896-enoch"],
      ["translation_publication", 1896, 1896, "year", false, "morfill-charles-1896-enoch"],
    ]
  );
  const [charles, milik, earliest] = book.dates!;
  assert.match(charles.originalDateText!, /with reasonable certainty assign the composition of our text to the period 1-50 A\.D\./);
  assert.match(charles.evidence, /the temple is still standing; see lix\. 2/);
  assert.match(charles.evidence, /later scholars disagree/);
  assert.match(milik.originalDateText!, /Byzantine monk in the ninth century/);
  assert.match(milik.evidence, /reported second-hand/);
  assert.match(earliest.originalDateText!, /Tikhonravov cites from a fourteenth century MS/);
  const work = INVENTORY.find((w) => w.workKey === "gnostic.secrets-of-enoch")!;
  const event = work.anchor && "event" in work.anchor ? work.anchor.event : undefined;
  assert.equal(event!.slug, "secrets-of-enoch-seven-heavens");
  assert.deepEqual(
    event!.claims.map((c) => [dateRoleFromWhatIsDated(c.whatIsDated!), c.startYear, c.endYear, c.sourceKey]),
    [
      ["composition", 1, 50, "morfill-charles-1896-enoch"],
      ["composition", 800, 900, "orlov-2enoch-intro"],
      ["earliest_evidence", 1300, 1400, "orlov-2enoch-intro"],
      ["translation_publication", 1896, undefined, "morfill-charles-1896-enoch"],
    ]
  );
});

test("2 Enoch's links are proposed resemblances, and none claims one text knew another", () => {
  const file = corpusFor("gnostic.secrets-of-enoch")!;
  const links = file.links ?? [];
  assert.equal(links.length, 11);
  const keys = new Set(ALL_CORPORA.flatMap((f) => f.passages.map((p) => p.key)));
  assert.equal(new Set(links.map((l) => l.key)).size, links.length, "duplicate link key");
  for (const link of links) {
    assert.ok(keys.has(link.from) && keys.has(link.to), link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^gnostic\.2en\.\d+\.\d+$/, link.key);
    assert.ok(["close_conceptual_parallel", "symbolic_similarity", "broad_thematic_resemblance", "speculative_connection"].includes(link.connectionClass), link.key);
    assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    assert.doesNotMatch(`${link.similarities} ${link.differences} ${link.transmissionEvidence}`, /\bcop(ied|y)\b/, link.key);
  }
  assert.deepEqual(
    links.map((l) => [l.from, l.to, l.connectionClass]),
    [
      ["gnostic.2en.19.1", "gnostic.ascisa.8.16", "close_conceptual_parallel"],
      ["gnostic.2en.22.8", "gnostic.ascisa.9.9", "close_conceptual_parallel"],
      ["gnostic.2en.22.10", "herm.ch.1.26", "symbolic_similarity"],
      ["gnostic.2en.33.11", "gnostic.ps.134", "close_conceptual_parallel"],
      ["gnostic.2en.30.3", "gnostic.origen.6.22", "symbolic_similarity"],
      ["gnostic.2en.30.3", "greek.tim.38d", "broad_thematic_resemblance"],
      ["gnostic.2en.29.4", "gnostic.iren.1.30.6", "broad_thematic_resemblance"],
      ["gnostic.2en.25.3", "herm.ch.1.4", "broad_thematic_resemblance"],
      ["gnostic.2en.3.2", "greek.mithras.1907.3", "broad_thematic_resemblance"],
      ["gnostic.2en.68.1", "modern.hall.39.p2", "speculative_connection"],
      ["gnostic.2en.64.5", "modern.hall.5.s1", "speculative_connection"],
    ]
  );
  // Charles's own argument that the Ascension used 2 Enoch is reported as an editor's argument, not as evidence.
  assert.match(links[0].transmissionEvidence, /an editor's argument from resemblance, not evidence of borrowing in either direction/);
});

test("2 Enoch's pictures: pages of the 1896 edition are secure; the Merilo leaf and the later pictures of Enoch are UNVERIFIED", () => {
  const file = corpusFor("gnostic.secrets-of-enoch")!;
  const placed = file.passages.flatMap((p) => (p.images ?? []).map((i) => [p.key, i] as const));
  const images = [...(file.images ?? []), ...placed.map(([, i]) => i)];
  const seen = new Map(images.map((i) => [i.key, i]));
  assert.equal(seen.size, images.length, "duplicate image key");
  assert.equal(seen.size, 8);
  const elsewhere = new Set(ALL_CORPORA.filter((f) => f.workKey !== "gnostic.secrets-of-enoch").flatMap((f) => [...(f.images ?? []), ...f.passages.flatMap((p) => p.images ?? [])].map((i) => i.url)));
  for (const image of seen.values()) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    assert.ok(image.licence, image.key);
    assert.ok(!elsewhere.has(image.url), `${image.key} repeats a picture shown elsewhere`);
    if (image.identificationStatus === "unverified") {
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else {
      assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
    }
  }
  // Where each one hangs.
  assert.deepEqual(
    placed.map(([key, i]) => [key, i.key, i.identificationStatus]),
    [
      ["gnostic.2en.book", "2en-morfill-charles-1896-title-page", "secure"],
      ["gnostic.2en.book", "2en-merilo-pravednoe-troitsky-codex-leaf-2", "unverified"],
      ["gnostic.2en.prologue", "2en-morfill-charles-1896-page-1", "secure"],
      ["gnostic.2en.23", "2en-blake-enoch-lithograph-british-museum", "unverified"],
      ["gnostic.2en.30", "2en-morfill-charles-1896-page-37", "secure"],
      ["gnostic.2en.67", "2en-sanok-icon-elijah-and-enoch", "unverified"],
      ["gnostic.2en.67", "2en-hoet-figures-de-la-bible-1728-god-took-enoch", "unverified"],
      ["gnostic.2en.67", "2en-shields-enoch-translated-1877-wellcome", "unverified"],
    ]
  );
  for (const [, image] of placed) {
    if (image.identificationStatus === "secure") assert.equal(image.shows, "historical_document", image.key);
  }
  const merilo = seen.get("2en-merilo-pravednoe-troitsky-codex-leaf-2")!;
  assert.equal(merilo.shows, "manuscript");
  assert.match(merilo.caption, /^UNVERIFIED — Related evidence, not a page of 2 Enoch: /);
  // Its own marker: the 1896 title page, then the Sanok icon, UNVERIFIED.
  const marker = MARKER_PICTURES["secrets-of-enoch-seven-heavens"];
  assert.equal(marker.length, 2);
  assert.equal(marker[0].url, seen.get("2en-morfill-charles-1896-title-page")!.url);
  assert.equal(marker[0].identificationStatus, "secure");
  assert.equal(marker[1].url, seen.get("2en-sanok-icon-elijah-and-enoch")!.url);
  assert.equal(marker[1].identificationStatus, "unverified");
  assert.match(marker[1].caption ?? "", /^UNVERIFIED — /);
});

test("the Turba is imported as its own work from Waite 1896: the Epistle, Dicta 1–72 by his numbering and the Conclusion", () => {
  const file = corpusFor("arab.turba-philosophorum")!;
  const work = INVENTORY.find((w) => w.workKey === "arab.turba-philosophorum")!;
  assert.equal(work.passagePrefix, "arab.turba");
  assert.equal(work.briefItem, 28);
  assert.equal(work.corpusGroup, "arabic_medieval");
  assert.equal(work.traditionClass, "medieval");
  assert.equal(work.unitDivisionKind, "chapter");
  assert.equal(work.expectedUnits, 74);
  assert.equal(work.inventoryVerified, false, "Waite's numbering, not checked against Ruska's");
  assert.match(work.originalLanguage, /^Latin, in medieval manuscripts; a lost Arabic original has been argued/);
  assert.match(work.attributionNote!, /the text's attributions, not historical authorship/);
  assert.match(work.attributionNote!, /first printed in 1572/);
  assert.match(work.attributionNote!, /Julius Ruska \(1931\) argued for a lost Arabic original/);
  assert.match(work.attributionNote!, /Plessner is known here only second-hand/);
  // Item 28 of the brief points here.
  const related = INVENTORY.find((w) => w.workKey === "arab.related")!;
  assert.ok(related.proposedMembers!.includes("Turba Philosophorum — imported as its own work, arab.turba-philosophorum"));
  for (const key of ["waite-1896-turba", "auriferae-artis-1572", "ruska-1931-problemes", "wikipedia-turba", "wikipedia-ibn-umayl", "de-wikipedia-turba", "fr-wikipedia-turba"]) {
    assert.ok(INVENTORY_SOURCES.some((s) => s.key === key), key);
  }
  // One record for the book (citing the Latin only), then 74 units.
  const book = file.passages[0];
  assert.equal(book.key, "arab.turba.book");
  assert.equal(book.layers.filter((l) => l.content && l.key !== PLAIN_LAYER_KEY).length, 0);
  assert.ok(book.layers.some((l) => l.key === "lat" && l.content == null && l.language === "Latin"));
  assert.match(book.summary!, /It is a Latin text, known from medieval manuscripts .* first printed at Basel in 1572/);
  assert.match(book.summary!, /that origin is a scholarly argument, debated, not a documented fact/);
  assert.match(book.notes!, /Not imported, and listed here: the title page; Waite's Preface \(pp\. i–iv\)/);
  assert.match(book.notes!, /the Index \(pp\. 209–210\)/);
  assert.match(book.notes!, /The second recension as a whole is not printed by Waite as a text and is not imported/);
  const units = file.passages.slice(1);
  assert.equal(TURBA_UNITS.length, 74);
  assert.deepEqual(
    units.map((u) => u.key),
    ["arab.turba.epistle", ...Array.from({ length: 72 }, (_, i) => `arab.turba.${i + 1}`), "arab.turba.conclusion"]
  );
  assert.equal(file.passages.length, 1 + 74);
  assert.equal(file.passages.filter((p) => p.layers.some((l) => l.key === "eng-1896")).length, work.expectedUnits);
  assert.equal(units.filter((u) => u.divisionKind === work.unitDivisionKind).length, 72);
  assert.deepEqual(units.filter((u) => u.divisionKind === "section").map((u) => u.key), ["arab.turba.epistle", "arab.turba.conclusion"]);
  assert.notEqual(deriveCompleteness(work, { importedUnits: 74, verifiedUnits: 0 }), "verified_against_edition");
  const text = (key: string) => file.passages.find((p) => p.key === `arab.turba.${key}`)!.layers.find((l) => l.key === "eng-1896")!.content!;
  for (const unit of units) {
    assert.equal(unit.parentKey, "arab.turba.book", unit.key);
    assert.equal(unit.verificationStatus, "unverified", unit.key);
    const layer = unit.layers.find((l) => l.key === "eng-1896")!;
    assert.equal(layer.licence, "public_domain", unit.key);
    assert.equal(layer.layer, "translation", unit.key);
    assert.equal(layer.sourceKey, "waite-1896-turba", unit.key);
    assert.match(layer.evidence, /scripts\/texts\/turba-philosophorum\.py/, unit.key);
    assert.match(unit.reference, /^Turba Philosophorum, (the Epistle of Arisleus|Dictum \d+ \(Waite's numbering\)|the Conclusion \(the last Dictum of the second recension\)); A\. E\. Waite, The Turba Philosophorum \(London, 1896\), (p\. \d+|pp\. \d+–\d+)$/, unit.key);
    assert.ok(unit.layers.some((l) => l.key === PLAIN_LAYER_KEY), `${unit.key} has no plain words`);
    // No OCR debris: no stray marks, doubled spaces or hyphen breaks. (Quotation marks are kept
    // straight throughout; Waite's one double-quoted phrase is in Dictum 20.)
    assert.doesNotMatch(layer.content!, /™|_|�|\{|\||  |\w- [a-z]|[“”‘’]/, unit.key);
    if (unit.key !== "arab.turba.20") assert.doesNotMatch(layer.content!, /"/, unit.key);
  }
  assert.match(text("20"), /the best is:—"That which is produced out of metals\." So also/);
  // Each Dictum is labelled with its speaker, as the text names him; the names are attributions.
  for (const unit of TURBA_UNITS.filter((u) => u.speaker)) {
    assert.match(unit.text, new RegExp(`^(But )?${unit.speaker}(, the Philosopher,)? saith`), unit.key);
  }
  assert.equal(file.passages.find((p) => p.key === "arab.turba.1")!.label, "The First Dictum: Iximidrus");
  assert.equal(file.passages.find((p) => p.key === "arab.turba.epistle")!.label, "The Epistle of Arisleus");
  assert.equal(file.passages.find((p) => p.key === "arab.turba.conclusion")!.label, "The Conclusion: Agmon");
  assert.match(text("epistle"), /^The Turba Philosophorum, Taken from an Ancient Manuscript Codex, more perfect than any edition published heretofore\.\n\nThe Epistle of Arisleus/);
  assert.match(text("epistle"), /Arisleus, begotten of Pythagoras, a disciple of the disciples by the grace of thrice great Hermes/);
  assert.match(text("4"), /four things are conjoined/);
  assert.match(text("13"), /a stone, and also not a stone/);
  assert.match(text("conclusion"), /^Agmon saith: I will add the following by way of a corollary\. Whosoever does not liquefy and coagulate errs greatly/);
  for (const passage of units) assert.match(passage.notes ?? "", /attribution, not a claim that a historical philosopher said this/, passage.key);
});

test("the Turba is dated by the arguments for its Arabic original, its reported manuscripts and its printings, each sourced", () => {
  const file = corpusFor("arab.turba-philosophorum")!;
  const book = file.passages[0];
  assert.deepEqual(
    book.dates!.map((d) => [d.role, d.startYear, d.endYear, d.datePrecision, d.isApproximate, d.sourceKey]),
    [
      ["composition", 850, 950, "century", true, "wikipedia-turba"],
      ["earliest_evidence", 1200, 1300, "century", true, "de-wikipedia-turba"],
      ["manuscript", 1250, 1300, "decade", true, "fr-wikipedia-turba"],
      ["translation_publication", 1572, 1572, "year", false, "auriferae-artis-1572"],
      ["translation_publication", 1896, 1896, "year", false, "waite-1896-turba"],
    ]
  );
  const [plessner, earliest, berlin, printed] = book.dates!;
  assert.match(plessner.originalDateText!, /written c\. 900 A\. D\..*as quoted by the English Wikipedia/);
  assert.match(plessner.evidence, /known here only from the English Wikipedia's report of his article \(not read\)/);
  assert.match(plessner.evidence, /Debated; not established\.$/);
  assert.match(earliest.evidence, /^Second-hand/);
  assert.match(berlin.evidence, /not checked/);
  assert.match(printed.originalDateText!, /Basileae\. Apud Petrum Pernam\. M\. D\. LXXII\./);
  const work = INVENTORY.find((w) => w.workKey === "arab.turba-philosophorum")!;
  const event = work.anchor && "event" in work.anchor ? work.anchor.event : undefined;
  assert.equal(event!.slug, "turba-philosophorum-assembly");
  assert.deepEqual(
    event!.claims.map((c) => [dateRoleFromWhatIsDated(c.whatIsDated!), c.startYear, c.endYear, c.sourceKey]),
    [
      ["composition", 850, 950, "wikipedia-turba"],
      ["earliest_evidence", 1200, 1300, "de-wikipedia-turba"],
      ["translation_publication", 1572, 1572, "auriferae-artis-1572"],
      ["translation_publication", 1896, 1896, "waite-1896-turba"],
    ]
  );
  assert.match(event!.claims[0].evidence, /^Second-hand: Plessner was not read/);
});

test("the Turba's links are proposed resemblances, and none claims one text knew another", () => {
  const file = corpusFor("arab.turba-philosophorum")!;
  const links = file.links ?? [];
  assert.equal(links.length, 12);
  const keys = new Set(ALL_CORPORA.flatMap((f) => f.passages.map((p) => p.key)));
  assert.equal(new Set(links.map((l) => l.key)).size, links.length, "duplicate link key");
  for (const link of links) {
    assert.ok(keys.has(link.from) && keys.has(link.to), link.key);
    assert.equal(link.reviewStatus, "proposed", link.key);
    assert.match(link.from, /^arab\.turba\.(book|epistle|\d+)$/, link.key);
    // Only Hall's later reading names the Turba; every other link shows no transmission.
    if (link.connectionClass === "later_reinterpretation") assert.match(link.transmissionEvidence, /^Hall names the Turba Philosophorum/, link.key);
    else assert.match(link.transmissionEvidence, /^None shown\./, link.key);
    assert.doesNotMatch(`${link.similarities} ${link.differences} ${link.transmissionEvidence}`, /\bcop(ied|y)\b/, link.key);
  }
  assert.deepEqual(
    links.map((l) => [l.from, l.to, l.connectionClass]),
    [
      ["arab.turba.70", "arab.tab.vulgate.03", "symbolic_similarity"],
      ["arab.turba.57", "arab.tab.vulgate.05", "symbolic_similarity"],
      ["arab.turba.13", "arab.secretum.10.6", "close_conceptual_parallel"],
      ["arab.turba.4", "arab.secretum.10.6", "close_conceptual_parallel"],
      ["arab.turba.8", "greek.tim.32b", "broad_thematic_resemblance"],
      ["arab.turba.45", "greek.tim.49c", "close_conceptual_parallel"],
      ["arab.turba.9", "herm.ch.1.5", "broad_thematic_resemblance"],
      ["arab.turba.37", "arab.comm.hort.13", "symbolic_similarity"],
      ["arab.turba.32", "arab.comm.hort.13", "symbolic_similarity"],
      ["arab.turba.65", "arab.comm.hort.11", "broad_thematic_resemblance"],
      ["arab.turba.book", "modern.hall.31.fig3", "later_reinterpretation"],
      ["arab.turba.epistle", "modern.hpb.isis.1.xxxi", "speculative_connection"],
    ]
  );
});

test("the Turba's pictures: the 1572 title page and pages of Waite 1896 are secure; the woodcut of the sages is UNVERIFIED", () => {
  const file = corpusFor("arab.turba-philosophorum")!;
  const placed = file.passages.flatMap((p) => (p.images ?? []).map((i) => [p.key, i] as const));
  const images = [...(file.images ?? []), ...placed.map(([, i]) => i)];
  const seen = new Map(images.map((i) => [i.key, i]));
  assert.equal(seen.size, images.length, "duplicate image key");
  assert.equal(seen.size, 7);
  const elsewhere = new Set(ALL_CORPORA.filter((f) => f.workKey !== "arab.turba-philosophorum").flatMap((f) => [...(f.images ?? []), ...f.passages.flatMap((p) => p.images ?? [])].map((i) => i.url)));
  for (const image of seen.values()) {
    assert.match(image.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//, image.key);
    assert.match(image.sourcePageUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, image.key);
    assert.equal(image.licenceStatus, "open", image.key);
    assert.ok(image.licence, image.key);
    assert.ok(!elsewhere.has(image.url), `${image.key} repeats a picture shown elsewhere`);
    if (image.identificationStatus === "unverified") {
      assert.match(image.caption, /^UNVERIFIED — /, image.key);
      assert.ok(image.whatIsUnverified, image.key);
    } else {
      assert.doesNotMatch(image.caption, /UNVERIFIED/, image.key);
      assert.equal(image.shows, "historical_document", image.key);
    }
  }
  assert.deepEqual(
    placed.map(([key, i]) => [key, i.key, i.identificationStatus]),
    [
      ["arab.turba.book", "turba-auriferae-artis-1572-title-page-wellcome", "secure"],
      ["arab.turba.book", "turba-waite-1896-title-page", "secure"],
      ["arab.turba.book", "turba-sages-round-the-fire-woodcut", "unverified"],
      ["arab.turba.epistle", "turba-waite-1896-page-1", "secure"],
      ["arab.turba.4", "turba-waite-1896-page-11", "secure"],
      ["arab.turba.11", "turba-waite-1896-page-35", "secure"],
      ["arab.turba.conclusion", "turba-waite-1896-page-206", "secure"],
    ]
  );
  const woodcut = seen.get("turba-sages-round-the-fire-woodcut")!;
  assert.equal(woodcut.shows, "later_artwork");
  assert.match(woodcut.whatIsUnverified!, /The two disagree and neither was checked/);
  // Its own marker: the 1572 title page, then the woodcut, UNVERIFIED.
  const marker = MARKER_PICTURES["turba-philosophorum-assembly"];
  assert.equal(marker.length, 2);
  assert.equal(marker[0].url, seen.get("turba-auriferae-artis-1572-title-page-wellcome")!.url);
  assert.equal(marker[0].identificationStatus, "secure");
  assert.equal(marker[1].url, woodcut.url);
  assert.equal(marker[1].identificationStatus, "unverified");
  assert.match(marker[1].caption ?? "", /^UNVERIFIED — /);
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

test("an opened passage shows our own translation first and cited-only layers last", () => {
  const layer = (id: string, import_key: string | null, content: string | null) => ({ id, import_key, content });
  const ordered = layerDisplayOrder([
    layer("coptic", "cop", null),
    layer("lambdin", "eng-lambdin", null),
    layer("greek", "grc", "words"),
    layer("ours", OUR_TRANSLATION_LAYER_KEY, "our words"),
    layer("plain", PLAIN_LAYER_KEY, "plain words"),
  ]);
  assert.deepEqual(
    ordered.map((l) => l.id),
    ["ours", "greek", "plain", "coptic", "lambdin"]
  );
});
