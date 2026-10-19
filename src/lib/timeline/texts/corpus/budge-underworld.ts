// Shared by amduat.ts and book-of-gates.ts: how Budge's English from The
// Egyptian Heaven and Hell (1905) becomes passages. Each hour (Amduat) or
// division (Book of Gates) is one passage with no text of its own; beneath it,
// one passage per scene or register, as the generator cut Budge's chapters
// (scripts/texts/budge-underworld.py, which lists every OCR correction).

import type { CorpusImage, CorpusLayer, CorpusManuscript } from "../corpus-types";
import type { BudgeSection } from "./amduat-text";

export const BUDGE_EVIDENCE =
  "E. A. Wallis Budge, The Egyptian Heaven and Hell (1905), public domain. Taken from the archive.org OCR of the sacred-texts e-text (J. B. Hare, 2003) and checked word by word against archive.org OCRs of two printed copies of the volume; no page images were compared. Only OCR errors that are certain are corrected, and each correction is listed in scripts/texts/budge-underworld.py. Budge's hieroglyphic text, transliteration, footnotes and the captions of his drawings are left out; where he quotes a name or word only in hieroglyphs, '[hieroglyphs]' stands in its place. Budge moves between describing the scene and translating its texts: both are his, and the translated texts are the parts in quotation marks or introduced as 'the text reads'.";

/** register / gate / scene / section, from the generator's section key. */
export function sectionDivisionKind(key: string): string {
  if (/^(upper|middle|lower)(-\d)?$/.test(key) || /^(seti|rvi)-/.test(key)) return "register";
  if (key === "gate") return "gate";
  if (key.startsWith("hall")) return "scene";
  return "section";
}

export function budgeLayer(section: Pick<BudgeSection, "text">, where: string): CorpusLayer {
  return {
    key: "eng-budge",
    layer: "translation",
    sourceKey: "budge-heaven-hell",
    content: section.text,
    language: "English",
    licence: "public_domain",
    evidence: `${BUDGE_EVIDENCE} (${where})`,
  };
}

export function citedLayer(key: string, sourceKey: string, citation: string, what: string): CorpusLayer {
  return {
    key,
    layer: "translation",
    sourceKey,
    contentAbsentReason: `In copyright, cited only: ${citation}.`,
    language: key.startsWith("deu-") ? "German" : "English",
    licence: "copyrighted_reference",
    evidence: `${what} Named so a reader can find the passage; no text is reproduced.`,
  };
}

export type Placed = CorpusImage & { passageKey?: string; manuscriptKey?: string };

export function imagesFor(images: Placed[], passageKey: string): CorpusImage[] | undefined {
  const found = images
    .filter((image) => image.passageKey === passageKey)
    .map((image) => {
      const copy: Placed = { ...image };
      delete copy.passageKey;
      delete copy.manuscriptKey;
      return copy;
    });
  return found.length > 0 ? found : undefined;
}

export function fileImages(images: Placed[]): (CorpusImage & { manuscriptKey?: string })[] {
  return images
    .filter((image) => image.passageKey == null)
    .map((image) => {
      const copy: Placed = { ...image };
      delete copy.passageKey;
      return copy;
    });
}

/** The royal tombs both books are painted in. Dates are regnal, approximate and chronology-dependent. */
export const TOMB_KV17: CorpusManuscript = {
  key: "kv17",
  name: "Tomb of Seti I (KV17), Valley of the Kings",
  objectKind: "inscription",
  holdingInstitution: "In situ",
  findspot: "Valley of the Kings, Thebes",
  startYear: -1289,
  endYear: -1278,
  datePrecision: "decade",
  isApproximate: true,
  originalDateText: "Reign of Seti I, Nineteenth Dynasty (c. 1290–1279 BCE)",
  datingEvidence: "Made for Seti I; his reign is usually dated c. 1290–1279 BCE, though chronologies differ by a decade or more.",
  sourceKey: "hornung-netherworld",
  notes:
    "Budge (vol. III, preface, p. xiii) says the drawings of his Amduat are traced from Lefébure's edition of this tomb (Mémoires de la Mission archéologique française au Caire II, 1886), and (vol. III, pp. 81–82) that it carries eleven of the twelve hours, the most complete and best illustrated copy. The tomb also carries the Book of Gates.",
};

export const TOMB_KV9: CorpusManuscript = {
  key: "kv9",
  name: "Tomb of Ramesses VI (KV9), Valley of the Kings",
  objectKind: "inscription",
  holdingInstitution: "In situ",
  findspot: "Valley of the Kings, Thebes",
  startYear: -1144,
  endYear: -1136,
  datePrecision: "decade",
  isApproximate: true,
  originalDateText: "Reign of Ramesses VI, Twentieth Dynasty (c. 1145–1137 BCE)",
  datingEvidence: "Made for Ramesses VI (begun for Ramesses V); his reign is usually dated c. 1145–1137 BCE, though chronologies differ.",
  sourceKey: "hornung-netherworld",
  notes:
    "Budge calls it 'Rameses VI.' and uses the texts as Lefébure published them (Mémoires de la Mission archéologique française au Caire III, 1889). For the Amduat he calls it the next fullest copy after Seti I's, with less careful drawings and later additions (vol. III, p. 82); for the Book of Gates he takes the whole sixth division from it, because the sarcophagus of Seti I is damaged there (vol. II, p. 168).",
};
