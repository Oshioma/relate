import { existsSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

import { TIMELINE_SOURCE_TYPES } from "../taxonomy";
import { ALL_CORPORA, corpusFor } from "./corpus";
import { PLAIN_LAYER_KEY } from "./corpus/plain";
import { INVENTORY, INVENTORY_SOURCES, workForPassageKey } from "./inventory";
import { buildManifest, coverageText, deriveCompleteness } from "./manifest";
import { breadcrumb, historicalGap, neighbours, readingOrder, RUN_ON_MAX_CHARS, sentenceRunsInFrom, sentenceRunsOnInto } from "./reading";
import { KYBALION_CHAPTERS, KYBALION_SAYINGS } from "./corpus/kybalion-text";
import { SCOTT_ELLIOT_MAPS, SCOTT_ELLIOT_SECTIONS } from "./corpus/scott-elliot-text";
import { DONNELLY_CHAPTERS } from "./corpus/donnelly-text";
import { VIRGIN_UNITS } from "./corpus/virgin-of-the-world-text";
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
