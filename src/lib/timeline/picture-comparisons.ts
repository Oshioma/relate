// PICTURES COMPARED FEATURE BY FEATURE.
//
// Some records exist to set pictures from different traditions side by side:
// a Hueda coronation plate, an Egyptian festival relief, a Kushite temple gate.
// A gallery of three images invites the eye to find likenesses that are not
// there. This turns the comparison into a set of questions — where is the
// ruler, are there priests, is there a sacred animal — and answers each one
// for each picture separately, with a marker only where the thing can actually
// be seen and "not visible" where it cannot.
//
// THE DATA LIVES HERE, KEYED BY RECORD SLUG AND PICTURE FILE NAME, rather than
// in the media column. A seeded picture keeps its fileName when it is copied
// into the community's own storage, so the panel finds its pictures whatever
// URL they are now served from, and no database change is needed.
//
// A MARKER IS A CLAIM ABOUT A PICTURE. Positions are percentages of the
// picture's width and height, placed by looking at the file named. A feature
// with no marker in any picture is shown greyed out, so a reader learns there
// is nothing to find without having to look for it.

export type PictureReading = {
  /** What can be seen, or why it cannot. Shown under the picture. */
  text: string;
  /** Markers as [x%, y%] of the picture. Empty or absent: nothing to point at. */
  points?: [number, number][];
  /** The feature is not in this picture at all. */
  notVisible?: boolean;
};

export type PictureComparison = {
  /** The record this comparison belongs to. */
  eventSlug: string;
  /** One column per picture, in reading order, matched to the record's media by file name. */
  columns: { fileName: string; title: string; meta: string }[];
  features: { label: string; readings: Record<string, PictureReading> }[];
};

const HUEDA = "Labat CourOuidah 1725 B002.png";
const ABYDOS = "Barques of Amun, Mut, and Khonsu, Temple of Seti I at Abydos.jpg";
const NAQA = "Naga Löwentempel.jpg";

export const PICTURE_COMPARISONS: PictureComparison[] = [
  {
    eventSlug: "three-royal-ceremonies-side-by-side",
    columns: [
      { fileName: HUEDA, title: "Hueda, Savi", meta: "Engraving, printed 1730 · caption says April 1725" },
      { fileName: ABYDOS, title: "Egypt, Abydos", meta: "Relief, c. 1290–1279 BCE · photographed 2015" },
      { fileName: NAQA, title: "Kush, Naqa", meta: "Temple pylon, 1st century CE · photographed 2010" },
    ],
    features: [
      {
        label: "Ruler's position",
        readings: {
          [HUEDA]: { text: "The king (legend 2) sits enthroned at the back of the court, in front of an open hall.", points: [[47, 26]] },
          [ABYDOS]: { text: "Seti I stands at the left, facing the barque.", points: [[11, 67]] },
          [NAQA]: { text: "Natakamani on the left tower, weapon raised over captives.", points: [[26, 55]] },
        },
      },
      {
        label: "Priests",
        readings: {
          [HUEDA]: { text: "None labelled. The crowning is done by the grandee of Ardres (13), an envoy, not a priest.", points: [[77, 62]] },
          [ABYDOS]: { notVisible: true, text: "Not identifiable. Small figures stand in the lower register, but their role cannot be read here." },
          [NAQA]: { notVisible: true, text: "Not visible." },
        },
      },
      {
        label: "Sacred animals",
        readings: {
          [HUEDA]: { text: "A living serpent (24) beside a small conical hut for a serpent about to give birth (23).", points: [[54, 45], [49, 46]] },
          [ABYDOS]: { text: "Ram heads at the prow and stern of Amun's barque.", points: [[34, 52], [67, 50]] },
          [NAQA]: { text: "A lion at the king's feet.", points: [[18, 77]] },
        },
      },
      {
        label: "Divine images",
        readings: {
          [HUEDA]: { notVisible: true, text: "None, other than the living serpent." },
          [ABYDOS]: { text: "The veiled cabin-shrine on the barque, which holds the god's image out of sight.", points: [[51, 55]] },
          [NAQA]: { notVisible: true, text: "None identifiable on the pylon front at this size. Apedemak is on the temple's other walls." },
        },
      },
      {
        label: "Offerings",
        readings: {
          [HUEDA]: { notVisible: true, text: "Not visible." },
          [ABYDOS]: { text: "A heaped offering table before the barque, and the king's censer.", points: [[21, 73], [20, 58]] },
          [NAQA]: { notVisible: true, text: "Not visible." },
        },
      },
      {
        label: "Instruments",
        readings: {
          [HUEDA]: { text: "Drums and trumpets (12), a large band at the right.", points: [[62, 57]] },
          [ABYDOS]: { notVisible: true, text: "Not visible." },
          [NAQA]: { notVisible: true, text: "Not visible." },
        },
      },
      {
        label: "Procession order",
        readings: {
          [HUEDA]: { notVisible: true, text: "Not a procession: a seated assembly. Labat's text puts the procession to the serpent's house afterwards." },
          [ABYDOS]: { text: "Three barques in a row: Amun, then Khonsu and Mut behind, standing still.", points: [[47, 55], [84, 49], [84, 73]] },
          [NAQA]: { notVisible: true, text: "Not visible." },
        },
      },
      {
        label: "Temple location",
        readings: {
          [HUEDA]: { text: "The palace court (1), not a temple. The serpent's house was half a league away and is not in the picture.", points: [[44, 49]] },
          [ABYDOS]: { text: "Inside the chapel of Amun in Seti I's temple: the whole wall." },
          [NAQA]: { text: "The temple front itself, with its doorway.", points: [[50, 74]] },
        },
      },
      {
        label: "Royal women",
        readings: {
          [HUEDA]: { text: "The king's wives (4), lying prostrate near the throne.", points: [[54, 34]] },
          [ABYDOS]: { notVisible: true, text: "Not visible." },
          [NAQA]: { text: "Queen Amanitore on the right tower, at the same scale and in the same pose as the king.", points: [[72, 50]] },
        },
      },
      {
        label: "Boundaries",
        readings: {
          [HUEDA]: { text: "The court's walls and gate (15), with the king's guards (20).", points: [[91, 47], [71, 34]] },
          [ABYDOS]: { text: "The frame of the chapel wall: the whole picture." },
          [NAQA]: { text: "The pylon is itself the temple's boundary.", points: [[50, 30]] },
        },
      },
      {
        label: "Insignia",
        readings: {
          [HUEDA]: { text: "Parasol held by a grandee (3), throne, fan. The Europeans' flag (21).", points: [[43, 19], [26, 26]] },
          [ABYDOS]: { text: "The censer and the fans on poles beside the barque. The crown's details are not legible.", points: [[20, 58], [43, 44], [59, 44]] },
          [NAQA]: { text: "A winged figure above the king. Crowns and weapons are present but not legible at this size.", points: [[27, 27]] },
        },
      },
    ],
  },
];

export function pictureComparisonFor(eventSlug: string): PictureComparison | undefined {
  return PICTURE_COMPARISONS.find((comparison) => comparison.eventSlug === eventSlug);
}

/** In how many pictures a feature has at least one marker. Zero greys the feature out. */
export function picturesShowing(comparison: PictureComparison, featureIndex: number): number {
  const feature = comparison.features[featureIndex];
  return comparison.columns.filter((column) => {
    const reading = feature.readings[column.fileName];
    return reading && !reading.notVisible && (reading.points?.length ?? 0) > 0;
  }).length;
}

/**
 * HOW MUCH ONE WHEEL EVENT ZOOMS.
 *
 * A trackpad sends dozens of small wheel events per gesture and a mouse sends
 * a few large ones. A fixed step per event made the trackpad zoom far too
 * fast, so the step follows the distance moved, capped so one mouse notch is
 * still a modest step. Line-mode deltas (Firefox with a mouse) are converted
 * to pixels first.
 */
export function wheelZoomFactor(deltaY: number, deltaMode = 0): number {
  const pixels = deltaMode === 1 ? deltaY * 16 : deltaMode === 2 ? deltaY * 400 : deltaY;
  const capped = Math.max(-40, Math.min(40, pixels));
  return Math.exp(-capped * 0.002);
}
