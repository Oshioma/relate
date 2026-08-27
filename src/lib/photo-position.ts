// Where a listing photo's crop sits when no focal point is stored
// (businesses.image_position / business_images.position).
//
// Covers get squeezed into boxes of very different shapes — the detail page's
// 16:10 carousel, directory cards' ~2:1 strips, the feed's ~4:1 banner — and
// `object-cover` keeps only a band of the photo. A percentage object-position
// pins that point of the photo to the same fraction of the box, so whatever
// the box shape, the stored point itself always stays in frame. That makes a
// single stored "x% y%" work for every surface at once.
//
// Without a stored point, dead centre ("50% 50%") is the worst guess for the
// short strips: on a head-and-shoulders photo the surviving band lands on the
// subject's nose. Faces sit in the top third of nearly every photograph, so
// the fallback aims a quarter of the way down instead.
export const DEFAULT_PHOTO_POSITION = "50% 25%";

export function photoObjectPosition(position: string | null | undefined): string {
  return position ?? DEFAULT_PHOTO_POSITION;
}
