// Which part of a community's cover photo survives the crop
// (communities.cover_position, communities.cover_position_mobile). The feed
// header shows the cover as a wide band with a text panel over its foot, so a
// photo's subject can end up cropped away or hidden behind the text depending
// on where it sits in the frame. No single default works for every photograph,
// so the owner picks.

export type CoverPosition = "top" | "center" | "bottom";

export const COVER_POSITIONS: { key: CoverPosition; label: string; hint: string }[] = [
  { key: "top", label: "Top", hint: "Keeps the sky and anything high in the frame" },
  { key: "center", label: "Centre", hint: "The default — an even crop" },
  { key: "bottom", label: "Bottom", hint: "Keeps the foreground and anything low in the frame" },
];

// Written out in full rather than built by interpolation: Tailwind reads class
// names as literal strings from the source, so `object-${position}` would
// produce classes that never make it into the stylesheet.
const CLASSES: Record<CoverPosition, string> = {
  top: "sm:object-top",
  center: "sm:object-center",
  bottom: "sm:object-bottom",
};

export function isCoverPosition(value: string | null | undefined): value is CoverPosition {
  return value === "top" || value === "center" || value === "bottom";
}

/**
 * The same crop with no breakpoint on it, for a preview that stands in for the
 * wide header rather than being it — a preview is the shape it's showing at
 * every screen size, so it must not switch at sm.
 */
export function coverPositionPreviewClass(value: string | null | undefined): string {
  const key = isCoverPosition(value) ? value : "center";
  return MOBILE_CLASSES[key];
}

// --- The phone crop ----------------------------------------------------------
//
// On a wide screen the header band is far wider than any photograph, so the
// photo is scaled to the width and it's the top and bottom that get cut — three
// vertical choices cover it. On a phone the same header is roughly square, so
// the crop turns ninety degrees: a landscape photo is scaled to the height and
// cut at the sides, where "top" and "bottom" do nothing whatsoever.
//
// Which axis gets cut therefore depends on the photograph, so the phone setting
// is a focal point — the part of the picture to keep, on both axes — rather
// than a second list of vertical options.

export type MobileCoverPosition =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

// In reading order, which is the order the 3×3 picker lays them out.
export const MOBILE_COVER_POSITIONS: { key: MobileCoverPosition; label: string }[] = [
  { key: "top-left", label: "Top left" },
  { key: "top", label: "Top" },
  { key: "top-right", label: "Top right" },
  { key: "left", label: "Left" },
  { key: "center", label: "Centre" },
  { key: "right", label: "Right" },
  { key: "bottom-left", label: "Bottom left" },
  { key: "bottom", label: "Bottom" },
  { key: "bottom-right", label: "Bottom right" },
];

const MOBILE_CLASSES: Record<MobileCoverPosition, string> = {
  "top-left": "object-top-left",
  top: "object-top",
  "top-right": "object-top-right",
  left: "object-left",
  center: "object-center",
  right: "object-right",
  "bottom-left": "object-bottom-left",
  bottom: "object-bottom",
  "bottom-right": "object-bottom-right",
};

export function isMobileCoverPosition(value: string | null | undefined): value is MobileCoverPosition {
  return Object.prototype.hasOwnProperty.call(MOBILE_CLASSES, value ?? "");
}

/**
 * The object-position utilities for a cover image: an unprefixed one that
 * governs phones and an `sm:` one that takes over from the header's wider
 * layout up.
 *
 * With no phone value set, the desktop choice applies at every width — which is
 * what every community had before the phone crop existed, so nothing moves
 * under anyone until they choose.
 */
/** The phone crop on its own, for the phone-shaped preview in the picker. */
export function mobileCoverPositionClass(
  mobileValue: string | null | undefined,
  fallback: string | null | undefined
): string {
  if (isMobileCoverPosition(mobileValue)) return MOBILE_CLASSES[mobileValue];
  return coverPositionPreviewClass(fallback);
}

export function coverPositionClass(value: string | null | undefined, mobileValue?: string | null): string {
  const desktop = isCoverPosition(value) ? CLASSES[value] : CLASSES.center;
  if (isMobileCoverPosition(mobileValue)) return `${MOBILE_CLASSES[mobileValue]} ${desktop}`;
  // The desktop keywords are a subset of the mobile ones, so the fallback is
  // simply the same choice with no breakpoint on it.
  const shared = isCoverPosition(value) ? value : "center";
  return `${MOBILE_CLASSES[shared]} ${desktop}`;
}
