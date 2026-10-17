// EVERY CORPUS FILE IN THE ARCHIVE, in the order the importer offers them.
//
// Adding a work's passages means writing its file and adding it here; the test
// suite then validates it with everything else, and the library page offers
// it for import.

import type { TextCorpusFile } from "../corpus-types";
import { DOREAL_CORPUS } from "./doreal";
import { EMERALD_TABLET_CORPUS } from "./emerald-tablet";
import { CRITIAS_CORPUS, TIMAEUS_CORPUS } from "./plato";

export const ALL_CORPORA: TextCorpusFile[] = [TIMAEUS_CORPUS, CRITIAS_CORPUS, EMERALD_TABLET_CORPUS, DOREAL_CORPUS];

export function corpusFor(workKey: string): TextCorpusFile | undefined {
  return ALL_CORPORA.find((file) => file.workKey === workKey);
}
