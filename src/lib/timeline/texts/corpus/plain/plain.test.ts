import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_CORPORA } from "..";
import { OUR_TRANSLATION_LAYER_KEY, PLAIN_LAYER_KEY, plainWordsBasis } from ".";
import { PLAIN_AMENEMOPE } from "./amenemope";
import { PLAIN_ASCLEPIUS } from "./asclepius";
import { PLAIN_BLAVATSKY } from "./blavatsky";
import { PLAIN_BOOK_OF_THE_DEAD } from "./book-of-the-dead";
import { PLAIN_COFFIN_TEXTS } from "./coffin-texts";
import { PLAIN_CRITIAS } from "./critias";
import { PLAIN_DOREAL } from "./doreal";
import { PLAIN_EMERALD_TABLET } from "./emerald-tablet";
import { PLAIN_GOSPEL_OF_THOMAS } from "./gospel-of-thomas";
import { PLAIN_HALL } from "./hall-secret-teachings";
import { PLAIN_PISTIS_SOPHIA } from "./pistis-sophia";
import { PLAIN_STEINER } from "./steiner";
import { PLAIN_KYBALION } from "./kybalion";
import { PLAIN_DONNELLY } from "./donnelly";
import { PLAIN_SCOTT_ELLIOT } from "./scott-elliot";
import { PLAIN_VIRGIN_OF_THE_WORLD } from "./virgin-of-the-world";
import { PLAIN_MITHRAS_LITURGY } from "./mithras-liturgy";
import { PLAIN_IRENAEUS } from "./irenaeus";
import { PLAIN_STOBAEUS } from "./stobaeus";
import { PLAIN_HERMETICA } from "./hermetica";
import { PLAIN_KAGEMNI } from "./kagemni";
import { PLAIN_MEMPHITE_THEOLOGY } from "./memphite-theology";
import { PLAIN_AMDUAT } from "./amduat";
import { PLAIN_BOOK_OF_GATES } from "./book-of-gates";
import { PLAIN_HEAVENLY_COW } from "./heavenly-cow";
import { PLAIN_PTAHHOTEP } from "./ptahhotep";
import { PLAIN_PYRAMID_TEXTS } from "./pyramid-texts";
import { PLAIN_SECRETUM } from "./secretum";
import { PLAIN_HORTULANUS } from "./hortulanus";
import { PLAIN_TIMAEUS } from "./timaeus";

const PLAIN: Record<string, Record<string, string>> = {
  "egy.pyramid-texts": PLAIN_PYRAMID_TEXTS,
  "egy.coffin-texts": PLAIN_COFFIN_TEXTS,
  "egy.book-of-the-dead": PLAIN_BOOK_OF_THE_DEAD,
  "egy.kagemni": PLAIN_KAGEMNI,
  "egy.ptahhotep": PLAIN_PTAHHOTEP,
  "egy.amenemope": PLAIN_AMENEMOPE,
  "egy.memphite-theology": PLAIN_MEMPHITE_THEOLOGY,
  "egy.amduat": PLAIN_AMDUAT,
  "egy.book-of-gates": PLAIN_BOOK_OF_GATES,
  "egy.heavenly-cow": PLAIN_HEAVENLY_COW,
  "greek.timaeus": PLAIN_TIMAEUS,
  "greek.critias": PLAIN_CRITIAS,
  "herm.corpus-hermeticum": PLAIN_HERMETICA,
  "herm.asclepius": PLAIN_ASCLEPIUS,
  "gnostic.gospel-of-thomas": PLAIN_GOSPEL_OF_THOMAS,
  "arab.emerald-tablet": PLAIN_EMERALD_TABLET,
  "modern.doreal-emerald-tablets": PLAIN_DOREAL,
  "modern.hall": PLAIN_HALL,
  "herm.stobaeus": PLAIN_STOBAEUS,
  "gnostic.pistis-sophia": PLAIN_PISTIS_SOPHIA,
  "arab.secretum-secretorum": PLAIN_SECRETUM,
  "arab.tablet-commentaries": PLAIN_HORTULANUS,
  "modern.blavatsky": PLAIN_BLAVATSKY,
  "modern.steiner": PLAIN_STEINER,
  "modern.kybalion": PLAIN_KYBALION,
  "modern.donnelly": PLAIN_DONNELLY,
  "modern.scott-elliot": PLAIN_SCOTT_ELLIOT,
  "modern.kingsford-maitland": PLAIN_VIRGIN_OF_THE_WORLD,
  "greek.mithras-liturgy": PLAIN_MITHRAS_LITURGY,
  "gnostic.irenaeus-against-heresies": PLAIN_IRENAEUS,
};

test("every passage of the Book of the Heavenly Cow with Budge's English has plain words, and only those", () => {
  const cow = ALL_CORPORA.find((c) => c.workKey === "egy.heavenly-cow")!;
  const withText = cow.passages.filter((p) => p.layers.some((l) => l.key === "eng-budge")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_HEAVENLY_COW).sort(), [...withText].sort());
  assert.equal(withText.length, 12);
});

test("every passage of the Secret of Secrets with Ismail Ali's English has plain words, and only those", () => {
  const secretum = ALL_CORPORA.find((c) => c.workKey === "arab.secretum-secretorum")!;
  const withText = secretum.passages.filter((p) => p.layers.some((l) => l.key === "eng-ismail-ali")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_SECRETUM).sort(), [...withText].sort());
  assert.equal(withText.length, 49);
  // The Tablet's plain words say that its wording is uncertain.
  assert.match(PLAIN_SECRETUM["arab.secretum.10.7"], /Other possible readings:\n- The English is a literal translation/);
});

test("every passage of Hortulanus's commentary with the 1597 English has plain words, and only those", () => {
  const hort = ALL_CORPORA.find((c) => c.workKey === "arab.tablet-commentaries")!;
  const withText = hort.passages.filter((p) => p.layers.some((l) => l.key === "eng-1597")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_HORTULANUS).sort(), [...withText].sort());
  assert.equal(withText.length, 16);
  // The doubtful words are flagged: telesme, the 'firmament' that means ferment, the philosophical dung.
  assert.match(PLAIN_HORTULANUS["arab.comm.hort.tablet"], /Other possible readings:\n- 'Telesme'/);
  assert.match(PLAIN_HORTULANUS["arab.comm.hort.5"], /Other possible readings:\n- 'Which said firmament'/);
  assert.match(PLAIN_HORTULANUS["arab.comm.hort.7"], /Other possible readings:\n- 'Philosophical dung'/);
});

test("every Stanza of Dzyan and every selected passage of Blavatsky has plain words, and only those", () => {
  const hpb = ALL_CORPORA.find((c) => c.workKey === "modern.blavatsky")!;
  const withText = hpb.passages.filter((p) => p.layers.some((l) => l.key === "eng-blavatsky")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_BLAVATSKY).sort(), [...withText].sort());
  assert.equal(withText.length, 39);
  // Her claims are reported as hers, and the racial ranking of the Stanzas is named as the text's own.
  assert.match(PLAIN_BLAVATSKY["modern.hpb.sd.1.xliii"], /^She identifies|^She says/);
  assert.match(PLAIN_BLAVATSKY["modern.hpb.anthro.10"], /Other possible readings:\n- The colours and 'black with sin'.*the text's racial hierarchy/);
});

test("every section of Steiner's 1911 English has plain words, and only those", () => {
  const steiner = ALL_CORPORA.find((c) => c.workKey === "modern.steiner")!;
  const withText = steiner.passages.filter((p) => p.layers.some((l) => l.key === "eng-1911")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_STEINER).sort(), [...withText].sort());
  assert.equal(withText.length, 26);
  // His account is reported as his, and the racial theory is named as the text's own.
  for (const [key, words] of Object.entries(PLAIN_STEINER)) assert.match(words, /^(Steiner|According to Steiner|At the end of Atlantis, Steiner|This chapter, Steiner)/, key);
  for (const key of ["2.2", "2.4", "4.2", "5.2", "7.3"]) assert.match(PLAIN_STEINER[`modern.steiner.1911.${key}`], /the text's own racial theory/, key);
  // The corrections and the disputed reading are shown as other readings.
  assert.match(PLAIN_STEINER["modern.steiner.1911.4.2"], /Other possible readings:\n- The transcription reads 'the knowledge and mastery of natural forces was learnt'/);
  assert.match(PLAIN_STEINER["modern.steiner.1911.5.2"], /Other possible readings:\n- The transcription reads 'what had been clone/);
  assert.match(PLAIN_STEINER["modern.steiner.1911.10.1"], /Other possible readings:\n- The transcription reads 'on which/);
});

test("the Introduction and every chapter of the Kybalion have plain words, and only those", () => {
  const kyb = ALL_CORPORA.find((c) => c.workKey === "modern.kybalion")!;
  const withText = kyb.passages.filter((p) => p.layers.some((l) => l.key === "eng-1908")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_KYBALION).sort(), [...withText].sort());
  assert.equal(withText.length, 16);
  // The book's account is reported as the book's, never as history.
  for (const [key, words] of Object.entries(PLAIN_KYBALION)) assert.match(words, /^The (book|authors)/, key);
  assert.match(PLAIN_KYBALION["modern.kyb.1908.intro"], /at the time of Abraham/);
  // The echo of the Emerald Tablet and the kept misprints are shown as other readings.
  assert.match(PLAIN_KYBALION["modern.kyb.1908.2"], /Other possible readings:\n- 'The old Hermetic axiom' may mean the second line of the Latin Emerald Tablet/);
  assert.match(PLAIN_KYBALION["modern.kyb.1908.3"], /Other possible readings:\n- 'If the Universal is Mental in its nature': a 1908 misprint/);
  assert.match(PLAIN_KYBALION["modern.kyb.1908.9"], /'Principle', a 1908 misprint/);
  assert.match(PLAIN_KYBALION["modern.kyb.1908.14"], /'stream', a 1908 misprint/);
});

test("the Introduction's first section and every part of The Virgin of the World have plain words, and only those", () => {
  const vow = ALL_CORPORA.find((c) => c.workKey === "modern.kingsford-maitland")!;
  const withText = vow.passages.filter((p) => p.layers.some((l) => l.key === "eng-1885")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_VIRGIN_OF_THE_WORLD).sort(), [...withText].sort());
  assert.equal(withText.length, 45);
  // Kingsford's esoteric reading is reported as hers, not as the ancient text's.
  assert.match(PLAIN_VIRGIN_OF_THE_WORLD["modern.vow.1885.intro"], /translator's own esoteric reading/);
  // Where the 1885 English and Mead's differ in meaning, the plain words say so.
  assert.match(PLAIN_VIRGIN_OF_THE_WORLD["modern.vow.1885.def.2"], /disagree over who is speaking/);
  assert.match(PLAIN_VIRGIN_OF_THE_WORLD["modern.vow.1885.tat.4"], /'a very mighty Daimon'/);
  assert.match(PLAIN_VIRGIN_OF_THE_WORLD["modern.vow.1885.tat.6"], /'the vase of genesis'/);
  assert.match(PLAIN_VIRGIN_OF_THE_WORLD["modern.vow.1885.ammon.2"], /'the Self-perfect Reason'/);
  assert.match(PLAIN_VIRGIN_OF_THE_WORLD["modern.vow.1885.frag.2"], /'regulates the breaths'/);
  assert.match(PLAIN_VIRGIN_OF_THE_WORLD["modern.vow.1885.frag.7"], /share out the gifts differently/);
  // The kept misprint is shown as another reading.
  assert.match(PLAIN_VIRGIN_OF_THE_WORLD["modern.vow.1885.def.2"], /Other possible readings:\n- 'Incorporeal corporealites' \(p\. 107\) is a misprint of 1885/);
});

test("the Preamble and every section of the Mithras Liturgy have plain words, and only those", () => {
  const ml = ALL_CORPORA.find((c) => c.workKey === "greek.mithras-liturgy")!;
  const withText = ml.passages.filter((p) => p.layers.some((l) => l.key === "eng-1907")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_MITHRAS_LITURGY).sort(), [...withText].sort());
  assert.equal(withText.length, 15);
  // Mead's Theosophical reading is reported as his, not as the rite's.
  assert.match(PLAIN_MITHRAS_LITURGY["greek.mithras.1907.preamble"], /In his own interpretation, which is a Theosophical one and not history/);
  // The instructions are reported as instructions, and Mead's bracketed words as his.
  assert.match(PLAIN_MITHRAS_LITURGY["greek.mithras.1907.3"], /^The instructions say/);
  assert.match(PLAIN_MITHRAS_LITURGY["greek.mithras.1907.2"], /Other possible readings:\n- 'the Deep of the \[New\] Dawn': the word 'New' is Mead's addition/);
});

test("every section of Irenaeus, Against Heresies I.29–31 has plain words, kept as his report, and only those", () => {
  const iren = ALL_CORPORA.find((c) => c.workKey === "gnostic.irenaeus-against-heresies")!;
  const withText = iren.passages.filter((p) => p.layers.some((l) => l.key === "eng-1885")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_IRENAEUS).sort(), [...withText].sort());
  assert.equal(withText.length, 23);
  // A hostile report: every entry says it is Irenaeus's report or his own words, never the Gnostics' own.
  for (const [key, words] of Object.entries(PLAIN_IRENAEUS)) assert.match(words, /^Irenaeus (says|reports|turns)/, key);
  for (const words of Object.values(PLAIN_IRENAEUS)) assert.doesNotMatch(words, /Apocryphon/);
  // Where the translators warn that the text is doubtful, the other readings say so.
  for (const ref of ["29.1", "30.2", "30.5", "30.9", "30.10", "30.11", "30.15", "31.2"]) {
    assert.match(PLAIN_IRENAEUS[`gnostic.iren.1.${ref}`], /\n\nOther possible readings:\n- /, ref);
  }
  assert.match(PLAIN_IRENAEUS["gnostic.iren.1.29.1"], /the 1868 printing reads 'in the conception'/);
  assert.match(PLAIN_IRENAEUS["gnostic.iren.1.30.15"], /'hopelessly corrupt'/);
});

test("the Preface and every section of Scott-Elliot's Story of Atlantis have plain words, and only those", () => {
  const se = ALL_CORPORA.find((c) => c.workKey === "modern.scott-elliot")!;
  const withText = se.passages.filter((p) => p.layers.some((l) => l.key === "eng-1896")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_SCOTT_ELLIOT).sort(), [...withText].sort());
  assert.equal(withText.length, 24);
  // What the book reports of Atlantis is reported as the book's, never as history.
  for (const [key, words] of Object.entries(PLAIN_SCOTT_ELLIOT)) assert.match(words, /^(The book says|Sinnett says)/, key);
  for (const key of ["1", "4", "8", "9", "10", "11", "13", "22"]) assert.match(PLAIN_SCOTT_ELLIOT[`modern.scott.1896.${key}`], /the text's own racial theory/, key);
  // The kept misprints and the doubtful phrases are shown as other readings.
  assert.match(PLAIN_SCOTT_ELLIOT["modern.scott.1896.20"], /Other possible readings:\n- 'All the machinery of goverment': 'goverment' is an 1896 misprint/);
  assert.match(PLAIN_SCOTT_ELLIOT["modern.scott.1896.9"], /'An Intitiate emperor or king' is an 1896 misprint/);
  assert.match(PLAIN_SCOTT_ELLIOT["modern.scott.1896.1"], /Other possible readings:\n- 'To which Plato gave the name of Poseidonis': Plato gives the island no such name/);
  assert.match(PLAIN_SCOTT_ELLIOT["modern.scott.1896.21"], /Blavatsky's Stanzas of Dzyan/);
});

test("every imported chapter of Donnelly's Atlantis has plain words, and only those", () => {
  const don = ALL_CORPORA.find((c) => c.workKey === "modern.donnelly")!;
  const withText = don.passages.filter((p) => p.layers.some((l) => l.key === "eng-1882")).map((p) => p.key);
  assert.deepEqual(Object.keys(PLAIN_DONNELLY).sort(), [...withText].sort());
  assert.equal(withText.length, 5);
  // His thesis is reported as his argument.
  for (const [key, words] of Object.entries(PLAIN_DONNELLY)) assert.match(words, /^Donnelly says/, key);
  for (const words of Object.values(PLAIN_DONNELLY)) assert.match(words, /\n\nOther possible readings:\n- /);
  assert.match(PLAIN_DONNELLY["modern.donnelly.1882.1.2"], /'Plato's Dialogues, ii\., 517'/);
  assert.match(PLAIN_DONNELLY["modern.donnelly.1882.1.3"], /'\[together\]' and '\[rule\]' stand for a brace and a rule/);
  assert.match(PLAIN_DONNELLY["modern.donnelly.1882.2.1"], /the identification is Donnelly's reading/);
});

test("plain words are written only for passages that exist and have text to paraphrase", () => {
  for (const [workKey, plain] of Object.entries(PLAIN)) {
    const file = ALL_CORPORA.find((c) => c.workKey === workKey)!;
    const byKey = new Map(file.passages.map((p) => [p.key, p]));
    for (const [key, words] of Object.entries(plain)) {
      const passage = byKey.get(key);
      assert.ok(passage, `${workKey}: no passage ${key}`);
      const basis = plainWordsBasis(passage.layers);
      assert.ok(basis, `${key}: nothing to paraphrase or translate`);
      // A book in copyright is paraphrased only as far as its short quotation goes.
      if (basis === "excerpt") assert.ok(words.length <= 600, `${key}: too long for a paraphrase of a quotation`);
      assert.ok(words.trim().length >= 20 && words.length <= 1500, `${key}: ${words.length} characters`);
    }
  }
});

test("the plain words are our voice, never the text's", () => {
  for (const file of ALL_CORPORA) {
    for (const passage of file.passages) {
      for (const layer of passage.layers.filter((l) => l.key === PLAIN_LAYER_KEY || l.key === OUR_TRANSLATION_LAYER_KEY)) {
        assert.equal(layer.layer, "modern_summary", passage.key);
        assert.equal(layer.licence, "original_work", passage.key);
      }
    }
  }
});

test("our own translation appears only where there is no English to paraphrase", () => {
  const secretum = ALL_CORPORA.find((c) => c.workKey === "arab.emerald-tablet")!.passages.find((p) => p.key === "arab.tab.secretum.01")!;
  assert.equal(secretum.layers.find((l) => l.layer === "modern_summary")?.key, OUR_TRANSLATION_LAYER_KEY);
  const vulgate = ALL_CORPORA.find((c) => c.workKey === "arab.emerald-tablet")!.passages.find((p) => p.key === "arab.tab.vulgate.01")!;
  assert.equal(vulgate.layers.find((l) => l.layer === "modern_summary")?.key, PLAIN_LAYER_KEY);
});

test("the Coptic Gospel of Thomas carries our own translation; the Greek papyri a paraphrase of Grenfell and Hunt", () => {
  const thomas = ALL_CORPORA.find((c) => c.workKey === "gnostic.gospel-of-thomas")!;
  const summary = (key: string) =>
    thomas.passages.find((p) => p.key === key)!.layers.find((l) => l.layer === "modern_summary");
  for (const key of ["gnostic.thom.prologue", "gnostic.thom.1", "gnostic.thom.77", "gnostic.thom.114", "gnostic.thom.title"]) {
    assert.equal(summary(key)?.key, OUR_TRANSLATION_LAYER_KEY, key);
  }
  for (const n of Array.from({ length: 114 }, (_, i) => i + 1)) {
    assert.ok(PLAIN_GOSPEL_OF_THOMAS[`gnostic.thom.${n}`], `saying ${n} has no translation`);
  }
  assert.ok(PLAIN_GOSPEL_OF_THOMAS["gnostic.thom.prologue"]);
  for (const key of ["gnostic.thom.poxy654.saying-1", "gnostic.thom.poxy1.logion-5", "gnostic.thom.poxy655.lines-41-46"]) {
    assert.equal(summary(key)?.key, PLAIN_LAYER_KEY, key);
  }
});

test("where a passage can be read more than one way, the other readings are listed in one shape", () => {
  for (const plain of Object.values(PLAIN)) {
    for (const [key, words] of Object.entries(plain)) {
      if (!words.includes("Other possible readings")) continue;
      assert.match(words, /\S\n\nOther possible readings:\n- \S.*(\n- \S.*)*$/, key);
    }
  }
});
