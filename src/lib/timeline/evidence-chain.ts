import { EVIDENCE_LAYERS, evidenceLayerOrder, orderEvidenceLayers } from "./taxonomy";

// THE READER'S END OF THE INTERPRETIVE CHAIN.
//
// The schema keeps the seven layers apart; this decides what a reader is shown
// and what they are offered to turn on and off. It lives in a .ts file rather
// than inside the component because the test runner cannot import .tsx — and
// because every decision below is a judgement about how evidence is presented,
// which is exactly the sort of thing that should be pinned by a test rather
// than reviewed by eye.
//
// The owner's requirement for this panel, in their words: a reader can toggle
// SHOW ORIGINAL TEXT / SHOW TRANSLITERATION / SHOW TRANSLATION / SHOW WHAT WE
// SAY IT MEANS. Four controls over seven layers, so the mapping is explicit
// below rather than derived.

/**
 * A layer as the panel needs it. Structurally what the database row is, minus
 * everything the presentation does not read — so the pure functions here can
 * be tested without building a whole row.
 */
export type ChainLayer = {
  layer: string;
  content?: string | null;
  content_absent_reason?: string | null;
  source_id?: string | null;
};

/**
 * THE FOUR CONTROLS, AND WHICH LAYERS EACH ONE HOLDS.
 *
 * Written out rather than computed from the vocabulary, because the grouping is
 * an editorial decision and not a property of the layers. Two of them are worth
 * defending:
 *
 * `original` holds the transcription as well as the object and the text. A
 * hieroglyphic transcription is already an act of reading — it has decided
 * something wherever the papyrus is broken — but a reader who asks to see the
 * original is asking for the script, and Gardiner's typeset hieroglyphs are the
 * only form most readers can look at. Putting it behind its own control would
 * hide the most legible witness in the chain.
 *
 * `meaning` holds the summary AND the interpretation, which is the whole point
 * of the control: both are ours, and offering a reader a way to see the text
 * without our commentary is the thing this panel is for.
 */
export const EVIDENCE_LAYER_TOGGLES = [
  {
    key: "original",
    label: "Original text",
    layers: ["primary_object", "primary_text", "transcription"],
    hint: "The object, what is written on it, and a scholar's transcription of the script.",
  },
  {
    key: "transliteration",
    label: "Transliteration",
    layers: ["transliteration"],
    hint: "The sounds in Latin letters. Not a translation — it carries no meaning.",
  },
  {
    key: "translation",
    label: "Translation",
    layers: ["translation"],
    hint: "Into a modern language, by a named translator. Expect more than one, and expect them to differ.",
  },
  {
    key: "meaning",
    label: "What we say it means",
    layers: ["modern_summary", "interpretation"],
    hint: "Summary and interpretation. These are modern voices, not the text's own.",
  },
] as const;

export type EvidenceToggleKey = (typeof EVIDENCE_LAYER_TOGGLES)[number]["key"];

const TOGGLE_BY_LAYER = new Map<string, EvidenceToggleKey>(
  EVIDENCE_LAYER_TOGGLES.flatMap((toggle) => toggle.layers.map((layer) => [layer, toggle.key as EvidenceToggleKey])),
);

/**
 * Which control governs a layer, or null for a layer nobody recognises.
 *
 * Null rather than a fallback bucket on purpose. A vocabulary word a community
 * invented has no place being swept under "what we say it means" — that control
 * makes a claim about whose voice the text is in, and guessing it wrong is the
 * one error this whole panel exists to prevent. Unrecognised layers are shown
 * unconditionally instead; see visibleChainLayers.
 */
export function toggleForLayer(layer: string | null | undefined): EvidenceToggleKey | null {
  return TOGGLE_BY_LAYER.get(layer ?? "") ?? null;
}

/**
 * EVERY LAYER IS SHOWN UNTIL A READER TURNS SOMETHING OFF.
 *
 * The tempting default is to show the translation and hide the rest, because
 * that is the readable part. It is also precisely the lesson this panel exists
 * to unteach: a page that opens on the translation alone has told the reader
 * that the translation is the text. The evidence is not the advanced view.
 *
 * So everything opens expanded, and narrowing is the reader's own act.
 */
export const DEFAULT_VISIBLE_TOGGLES: EvidenceToggleKey[] = EVIDENCE_LAYER_TOGGLES.map((toggle) => toggle.key);

/**
 * The controls worth drawing for a given set of passages.
 *
 * Only the ones whose layers actually appear somewhere. A toggle for a layer no
 * passage carries is a control that does nothing, and worse, it implies the
 * record has a transliteration that somebody has hidden. Returned in the order
 * declared above so the bar does not reshuffle between records.
 */
export function availableToggles(
  passages: { layers: ChainLayer[] }[],
): (typeof EVIDENCE_LAYER_TOGGLES)[number][] {
  const present = new Set<string>();
  for (const passage of passages) {
    for (const layer of passage.layers) {
      const toggle = toggleForLayer(layer.layer);
      if (toggle) present.add(toggle);
    }
  }
  return EVIDENCE_LAYER_TOGGLES.filter((toggle) => present.has(toggle.key));
}

/**
 * The layers to draw for one passage, in chain order, given what is switched on.
 *
 * A LAYER NOBODY RECOGNISES IS ALWAYS SHOWN. It belongs to no control, so no
 * control can reveal it — and silently dropping a row a community wrote, with
 * nothing in the interface admitting it exists, is the worst of the available
 * behaviours. It sorts to the end, after everything the vocabulary knows.
 */
export function visibleChainLayers<T extends ChainLayer>(layers: T[], enabled: readonly string[]): T[] {
  const on = new Set(enabled);
  return orderEvidenceLayers(
    layers.filter((layer) => {
      const toggle = toggleForLayer(layer.layer);
      return toggle == null || on.has(toggle);
    }),
  );
}

/**
 * Has this passage got more than one translation?
 *
 * The question the panel exists to make visible. Where the answer is yes the
 * renderings are drawn together with a line saying they differ — because a
 * reader shown two translations without being told that scholars disagree will
 * read the second as a repetition of the first.
 *
 * Counted by ROW, not by distinct source. Two translations by one scholar in
 * two publications are still two renderings a reader can compare, and a null
 * source is not a reason to drop a row from the count.
 */
export function translationCount(layers: ChainLayer[]): number {
  return layers.filter((layer) => layer.layer === "translation").length;
}

/** The same question for readings of what the passage means. */
export function interpretationCount(layers: ChainLayer[]): number {
  return layers.filter((layer) => layer.layer === "interpretation").length;
}

/**
 * Does this passage reach the surviving evidence at all?
 *
 * A passage carrying only a summary and an interpretation is somebody talking
 * about a text that is not here. That is a legitimate record — it is most of
 * what the Set dataset currently holds — and the panel says so rather than
 * letting the commentary stand where the evidence should be. The honest
 * rendering of second-hand material is a note admitting it, not a hidden row.
 */
export function reachesTheEvidence(layers: ChainLayer[]): boolean {
  return layers.some(
    (layer) => layer.layer === "primary_object" || layer.layer === "primary_text" || layer.layer === "transcription",
  );
}

/**
 * Is this row a citation standing in for text that cannot be reproduced?
 *
 * A translation still in copyright is recorded as its bibliography and a page
 * range with no text. It must never render as an empty box — the reason it is
 * empty is itself the information, and it points the reader at a library.
 */
export function isCitationOnly(layer: ChainLayer): boolean {
  return !layer.content?.trim() && Boolean(layer.content_absent_reason?.trim());
}

/**
 * The gap between what a passage has and what the full chain would be.
 *
 * Used for the line under a passage that names what is missing — "no
 * transliteration, no translation" — because an absent layer is invisible and
 * a reader cannot ask for something they do not know is possible. It reports
 * only the layers the vocabulary knows, in chain order.
 */
export function missingLayers(layers: ChainLayer[]): string[] {
  const present = new Set(layers.map((layer) => layer.layer));
  return EVIDENCE_LAYERS.map((layer) => layer.key as string)
    .filter((key) => !present.has(key))
    .sort((a, b) => evidenceLayerOrder(a) - evidenceLayerOrder(b));
}
