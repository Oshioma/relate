import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_CORPORA } from "..";
import { OUR_TRANSLATION_LAYER_KEY, PLAIN_LAYER_KEY, plainWordsBasis } from ".";
import { PLAIN_ASCLEPIUS } from "./asclepius";
import { PLAIN_BOOK_OF_THE_DEAD } from "./book-of-the-dead";
import { PLAIN_COFFIN_TEXTS } from "./coffin-texts";
import { PLAIN_CRITIAS } from "./critias";
import { PLAIN_DOREAL } from "./doreal";
import { PLAIN_EMERALD_TABLET } from "./emerald-tablet";
import { PLAIN_GOSPEL_OF_THOMAS } from "./gospel-of-thomas";
import { PLAIN_HALL } from "./hall-secret-teachings";
import { PLAIN_HERMETICA } from "./hermetica";
import { PLAIN_PYRAMID_TEXTS } from "./pyramid-texts";
import { PLAIN_TIMAEUS } from "./timaeus";

const PLAIN: Record<string, Record<string, string>> = {
  "egy.pyramid-texts": PLAIN_PYRAMID_TEXTS,
  "egy.coffin-texts": PLAIN_COFFIN_TEXTS,
  "egy.book-of-the-dead": PLAIN_BOOK_OF_THE_DEAD,
  "greek.timaeus": PLAIN_TIMAEUS,
  "greek.critias": PLAIN_CRITIAS,
  "herm.corpus-hermeticum": PLAIN_HERMETICA,
  "herm.asclepius": PLAIN_ASCLEPIUS,
  "gnostic.gospel-of-thomas": PLAIN_GOSPEL_OF_THOMAS,
  "arab.emerald-tablet": PLAIN_EMERALD_TABLET,
  "modern.doreal-emerald-tablets": PLAIN_DOREAL,
  "modern.hall": PLAIN_HALL,
};

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
