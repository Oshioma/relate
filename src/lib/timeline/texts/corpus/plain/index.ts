// "IN PLAIN WORDS": A MODERN PARAPHRASE OF EACH PASSAGE, WRITTEN FOR THIS ARCHIVE.
//
// Oshi asked (2026-10-18) for every passage to carry a plain-English version a
// reader can follow without the translator's period English. Each is a close
// paraphrase of the passage's own public-domain translation: what the text
// says, in today's words, not what it is taken to mean. It is stored as a
// modern_summary layer, so the reader shows it as our voice and never as the
// ancient text or a translation of it.
//
// One file per work, keyed by passage key. What each paraphrase is OF is read
// from the passage itself, so the page can say so:
// - an open English translation: a paraphrase of it (the usual case);
// - only a short quotation from a book in copyright (Doreal): a paraphrase of
//   that quotation, never of the whole work;
// - no English at all (the Secret of Secrets lines, Latin only): our own
//   translation, kept under its own layer key so the page labels it as ours;
// - no English and an original that is cited but not reproduced (the Coptic
//   Gospel of Thomas, whose only transcriptions are under restrictive terms):
//   also our own translation, and the evidence says the original is not shown.

import type { CorpusLayer, TextCorpusFile } from "../../corpus-types";

export const PLAIN_LAYER_KEY = "eng-plain";
/** Plain words for a passage with no English translation: our own translation. */
export const OUR_TRANSLATION_LAYER_KEY = "eng-ours";

const EVIDENCE = {
  paraphrase:
    "Written for this archive: a paraphrase in plain modern English of the English text above (a translation, or a modern author's own words). It says what the passage says, not what it means, and is not itself a translation.",
  excerpt:
    "Written for this archive: a paraphrase in plain modern English of the quotation above only. The book is in copyright, so the rest of the tablet is neither quoted nor paraphrased.",
  ours:
    "Our own translation, written for this archive, in plain modern English. No published English translation of this version has been found, so this is not one, and it has not been checked by a specialist.",
  oursCited:
    "Our own translation, written for this archive, in plain modern English, of the original-language text cited on this passage, which is not reproduced here. No openly licensed English translation of this version has been found, so this is not a published translation, and it has not been checked by a specialist.",
};

type Basis = keyof typeof EVIDENCE;

/** What a passage's plain words can be based on, from its other layers. */
export function plainWordsBasis(layers: CorpusLayer[]): Basis | null {
  const own = layers.filter((l) => l.content && l.key !== PLAIN_LAYER_KEY && l.key !== OUR_TRANSLATION_LAYER_KEY);
  const english = own.filter((l) => l.language === "English");
  if (english.some((l) => l.licence !== "copyrighted_excerpt")) return "paraphrase";
  if (english.length > 0) return "excerpt";
  if (own.some((l) => l.licence !== "copyrighted_excerpt")) return "ours";
  // An ancient original that is public domain but not reproduced here.
  const citedOriginal = layers.some(
    (l) => l.layer === "primary_text" && l.content == null && (l.licence === "public_domain" || l.licence === "public_domain_us")
  );
  if (citedOriginal) return "oursCited";
  return null;
}

/** The corpus with each passage's plain-words paraphrase added as a layer. */
export function withPlainWords(file: TextCorpusFile, plain: Record<string, string>): TextCorpusFile {
  return {
    ...file,
    passages: file.passages.map((passage) => {
      const content = plain[passage.key];
      const basis = plainWordsBasis(passage.layers);
      if (!content || !basis) return passage;
      const layer: CorpusLayer = {
        key: basis === "ours" || basis === "oursCited" ? OUR_TRANSLATION_LAYER_KEY : PLAIN_LAYER_KEY,
        layer: "modern_summary",
        sourceKey: null,
        content,
        language: "English",
        licence: "original_work",
        evidence: EVIDENCE[basis],
      };
      const others = passage.layers.filter((l) => l.key !== PLAIN_LAYER_KEY && l.key !== OUR_TRANSLATION_LAYER_KEY);
      return { ...passage, layers: [...others, layer] };
    }),
  };
}
