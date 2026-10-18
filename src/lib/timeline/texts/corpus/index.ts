// EVERY CORPUS FILE IN THE ARCHIVE, in the order the importer offers them.
//
// Adding a work's passages means writing its file and adding it here; the test
// suite then validates it with everything else, and the library page offers
// it for import.

import type { TextCorpusFile } from "../corpus-types";
import { ASCLEPIUS_CORPUS } from "./asclepius";
import { BOOK_OF_THE_DEAD_CORPUS } from "./book-of-the-dead";
import { COFFIN_TEXTS_CORPUS } from "./coffin-texts";
import { DOREAL_CORPUS } from "./doreal";
import { EMERALD_TABLET_CORPUS } from "./emerald-tablet";
import { GOSPEL_OF_THOMAS_CORPUS } from "./gospel-of-thomas";
import { HERMETICA_CORPUS } from "./hermetica";
import { CRITIAS_CORPUS, TIMAEUS_CORPUS } from "./plato";
import { PYRAMID_TEXTS_CORPUS } from "./pyramid-texts";
import { withPlainWords } from "./plain";
import { PLAIN_ASCLEPIUS } from "./plain/asclepius";
import { PLAIN_BOOK_OF_THE_DEAD } from "./plain/book-of-the-dead";
import { PLAIN_COFFIN_TEXTS } from "./plain/coffin-texts";
import { PLAIN_CRITIAS } from "./plain/critias";
import { PLAIN_DOREAL } from "./plain/doreal";
import { PLAIN_EMERALD_TABLET } from "./plain/emerald-tablet";
import { PLAIN_GOSPEL_OF_THOMAS } from "./plain/gospel-of-thomas";
import { PLAIN_HERMETICA } from "./plain/hermetica";
import { PLAIN_PYRAMID_TEXTS } from "./plain/pyramid-texts";
import { PLAIN_TIMAEUS } from "./plain/timaeus";

export const ALL_CORPORA: TextCorpusFile[] = [
  withPlainWords(PYRAMID_TEXTS_CORPUS, PLAIN_PYRAMID_TEXTS),
  withPlainWords(COFFIN_TEXTS_CORPUS, PLAIN_COFFIN_TEXTS),
  withPlainWords(BOOK_OF_THE_DEAD_CORPUS, PLAIN_BOOK_OF_THE_DEAD),
  withPlainWords(TIMAEUS_CORPUS, PLAIN_TIMAEUS),
  withPlainWords(CRITIAS_CORPUS, PLAIN_CRITIAS),
  withPlainWords(HERMETICA_CORPUS, PLAIN_HERMETICA),
  withPlainWords(ASCLEPIUS_CORPUS, PLAIN_ASCLEPIUS),
  withPlainWords(GOSPEL_OF_THOMAS_CORPUS, PLAIN_GOSPEL_OF_THOMAS),
  withPlainWords(EMERALD_TABLET_CORPUS, PLAIN_EMERALD_TABLET),
  withPlainWords(DOREAL_CORPUS, PLAIN_DOREAL),
];

export function corpusFor(workKey: string): TextCorpusFile | undefined {
  return ALL_CORPORA.find((file) => file.workKey === workKey);
}
