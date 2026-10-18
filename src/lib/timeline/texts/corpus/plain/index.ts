// "IN PLAIN WORDS": A MODERN PARAPHRASE OF EACH PASSAGE, WRITTEN FOR THIS ARCHIVE.
//
// Oshi asked (2026-10-18) for every passage to carry a plain-English version a
// reader can follow without the translator's period English. Each is a close
// paraphrase of the passage's own public-domain translation: what the text
// says, in today's words, not what it is taken to mean. It is stored as a
// modern_summary layer, so the reader shows it as our voice and never as the
// ancient text or a translation of it.
//
// One file per work, keyed by passage key. Works in copyright (Doreal) get
// none: their summary already says what the tablet is about.

import type { CorpusLayer, TextCorpusFile } from "../../corpus-types";

export const PLAIN_LAYER_KEY = "eng-plain";

const EVIDENCE =
  "Written for this archive: a paraphrase in plain modern English of the translation above. It says what the passage says, not what it means, and is not itself a translation.";

/** The corpus with each passage's plain-words paraphrase added as a layer. */
export function withPlainWords(file: TextCorpusFile, plain: Record<string, string>): TextCorpusFile {
  return {
    ...file,
    passages: file.passages.map((passage) => {
      const content = plain[passage.key];
      if (!content) return passage;
      const layer: CorpusLayer = {
        key: PLAIN_LAYER_KEY,
        layer: "modern_summary",
        sourceKey: null,
        content,
        language: "English",
        licence: "original_work",
        evidence: EVIDENCE,
      };
      return { ...passage, layers: [...passage.layers.filter((l) => l.key !== PLAIN_LAYER_KEY), layer] };
    }),
  };
}
