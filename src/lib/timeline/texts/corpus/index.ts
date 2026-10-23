// EVERY CORPUS FILE IN THE ARCHIVE, in the order the importer offers them.
//
// Adding a work's passages means writing its file and adding it here; the test
// suite then validates it with everything else, and the library page offers
// it for import.

import type { TextCorpusFile } from "../corpus-types";
import { AMENEMOPE_CORPUS } from "./amenemope";
import { ASCLEPIUS_CORPUS } from "./asclepius";
import { BLAVATSKY_CORPUS } from "./blavatsky";
import { BOOK_OF_THE_DEAD_CORPUS } from "./book-of-the-dead";
import { COFFIN_TEXTS_CORPUS } from "./coffin-texts";
import { DOREAL_CORPUS } from "./doreal";
import { EMERALD_TABLET_CORPUS } from "./emerald-tablet";
import { GOSPEL_OF_THOMAS_CORPUS } from "./gospel-of-thomas";
import { HALL_CORPUS } from "./hall-secret-teachings";
import { HERMETICA_CORPUS } from "./hermetica";
import { KAGEMNI_CORPUS } from "./kagemni";
import { MEMPHITE_THEOLOGY_CORPUS } from "./memphite-theology";
import { AMDUAT_CORPUS } from "./amduat";
import { BOOK_OF_GATES_CORPUS } from "./book-of-gates";
import { HEAVENLY_COW_CORPUS } from "./heavenly-cow";
import { HORTULANUS_CORPUS } from "./hortulanus";
import { CRITIAS_CORPUS, TIMAEUS_CORPUS } from "./plato";
import { PTAHHOTEP_CORPUS } from "./ptahhotep";
import { PISTIS_SOPHIA_CORPUS } from "./pistis-sophia";
import { PYRAMID_TEXTS_CORPUS } from "./pyramid-texts";
import { SECRETUM_CORPUS } from "./secretum";
import { STEINER_CORPUS } from "./steiner";
import { KYBALION_CORPUS } from "./kybalion";
import { DONNELLY_CORPUS } from "./donnelly";
import { SCOTT_ELLIOT_CORPUS } from "./scott-elliot";
import { STOBAEUS_CORPUS } from "./stobaeus";
import { withPlainWords } from "./plain";
import { PLAIN_AMENEMOPE } from "./plain/amenemope";
import { PLAIN_ASCLEPIUS } from "./plain/asclepius";
import { PLAIN_BLAVATSKY } from "./plain/blavatsky";
import { PLAIN_BOOK_OF_THE_DEAD } from "./plain/book-of-the-dead";
import { PLAIN_COFFIN_TEXTS } from "./plain/coffin-texts";
import { PLAIN_CRITIAS } from "./plain/critias";
import { PLAIN_DOREAL } from "./plain/doreal";
import { PLAIN_EMERALD_TABLET } from "./plain/emerald-tablet";
import { PLAIN_GOSPEL_OF_THOMAS } from "./plain/gospel-of-thomas";
import { PLAIN_HALL } from "./plain/hall-secret-teachings";
import { PLAIN_HERMETICA } from "./plain/hermetica";
import { PLAIN_KAGEMNI } from "./plain/kagemni";
import { PLAIN_MEMPHITE_THEOLOGY } from "./plain/memphite-theology";
import { PLAIN_AMDUAT } from "./plain/amduat";
import { PLAIN_BOOK_OF_GATES } from "./plain/book-of-gates";
import { PLAIN_HEAVENLY_COW } from "./plain/heavenly-cow";
import { PLAIN_HORTULANUS } from "./plain/hortulanus";
import { PLAIN_PISTIS_SOPHIA } from "./plain/pistis-sophia";
import { PLAIN_PTAHHOTEP } from "./plain/ptahhotep";
import { PLAIN_PYRAMID_TEXTS } from "./plain/pyramid-texts";
import { PLAIN_SECRETUM } from "./plain/secretum";
import { PLAIN_STEINER } from "./plain/steiner";
import { PLAIN_KYBALION } from "./plain/kybalion";
import { PLAIN_DONNELLY } from "./plain/donnelly";
import { PLAIN_SCOTT_ELLIOT } from "./plain/scott-elliot";
import { PLAIN_STOBAEUS } from "./plain/stobaeus";
import { PLAIN_TIMAEUS } from "./plain/timaeus";

export const ALL_CORPORA: TextCorpusFile[] = [
  withPlainWords(PYRAMID_TEXTS_CORPUS, PLAIN_PYRAMID_TEXTS),
  withPlainWords(COFFIN_TEXTS_CORPUS, PLAIN_COFFIN_TEXTS),
  withPlainWords(BOOK_OF_THE_DEAD_CORPUS, PLAIN_BOOK_OF_THE_DEAD),
  withPlainWords(KAGEMNI_CORPUS, PLAIN_KAGEMNI),
  withPlainWords(PTAHHOTEP_CORPUS, PLAIN_PTAHHOTEP),
  withPlainWords(AMENEMOPE_CORPUS, PLAIN_AMENEMOPE),
  withPlainWords(MEMPHITE_THEOLOGY_CORPUS, PLAIN_MEMPHITE_THEOLOGY),
  withPlainWords(AMDUAT_CORPUS, PLAIN_AMDUAT),
  withPlainWords(BOOK_OF_GATES_CORPUS, PLAIN_BOOK_OF_GATES),
  withPlainWords(HEAVENLY_COW_CORPUS, PLAIN_HEAVENLY_COW),
  withPlainWords(TIMAEUS_CORPUS, PLAIN_TIMAEUS),
  withPlainWords(CRITIAS_CORPUS, PLAIN_CRITIAS),
  withPlainWords(HERMETICA_CORPUS, PLAIN_HERMETICA),
  withPlainWords(ASCLEPIUS_CORPUS, PLAIN_ASCLEPIUS),
  withPlainWords(STOBAEUS_CORPUS, PLAIN_STOBAEUS),
  withPlainWords(GOSPEL_OF_THOMAS_CORPUS, PLAIN_GOSPEL_OF_THOMAS),
  withPlainWords(PISTIS_SOPHIA_CORPUS, PLAIN_PISTIS_SOPHIA),
  withPlainWords(EMERALD_TABLET_CORPUS, PLAIN_EMERALD_TABLET),
  withPlainWords(SECRETUM_CORPUS, PLAIN_SECRETUM),
  withPlainWords(HORTULANUS_CORPUS, PLAIN_HORTULANUS),
  withPlainWords(DOREAL_CORPUS, PLAIN_DOREAL),
  withPlainWords(HALL_CORPUS, PLAIN_HALL),
  withPlainWords(BLAVATSKY_CORPUS, PLAIN_BLAVATSKY),
  withPlainWords(STEINER_CORPUS, PLAIN_STEINER),
  withPlainWords(KYBALION_CORPUS, PLAIN_KYBALION),
  withPlainWords(DONNELLY_CORPUS, PLAIN_DONNELLY),
  withPlainWords(SCOTT_ELLIOT_CORPUS, PLAIN_SCOTT_ELLIOT),
];

export function corpusFor(workKey: string): TextCorpusFile | undefined {
  return ALL_CORPORA.find((file) => file.workKey === workKey);
}
