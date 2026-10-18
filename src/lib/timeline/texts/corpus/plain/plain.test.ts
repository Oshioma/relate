import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_CORPORA } from "..";
import { PLAIN_LAYER_KEY } from ".";
import { PLAIN_BOOK_OF_THE_DEAD } from "./book-of-the-dead";
import { PLAIN_COFFIN_TEXTS } from "./coffin-texts";
import { PLAIN_CRITIAS } from "./critias";
import { PLAIN_EMERALD_TABLET } from "./emerald-tablet";
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
  "arab.emerald-tablet": PLAIN_EMERALD_TABLET,
};

test("plain words are written only for passages that exist and have text to paraphrase", () => {
  for (const [workKey, plain] of Object.entries(PLAIN)) {
    const file = ALL_CORPORA.find((c) => c.workKey === workKey)!;
    const byKey = new Map(file.passages.map((p) => [p.key, p]));
    for (const [key, words] of Object.entries(plain)) {
      const passage = byKey.get(key);
      assert.ok(passage, `${workKey}: no passage ${key}`);
      assert.ok(
        passage.layers.some(
          (l) =>
            l.key !== PLAIN_LAYER_KEY &&
            l.content &&
            l.language === "English" &&
            l.licence !== "copyrighted_excerpt"
        ),
        `${key}: no open English translation to paraphrase`
      );
      assert.ok(words.trim().length >= 20 && words.length <= 1500, `${key}: ${words.length} characters`);
    }
  }
});

test("the plain words are our voice, never the text's", () => {
  for (const file of ALL_CORPORA) {
    for (const passage of file.passages) {
      for (const layer of passage.layers.filter((l) => l.key === PLAIN_LAYER_KEY)) {
        assert.equal(layer.layer, "modern_summary", passage.key);
        assert.equal(layer.licence, "original_work", passage.key);
      }
    }
  }
});
