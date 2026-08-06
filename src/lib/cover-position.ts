// Which part of a community's cover photo survives the crop
// (communities.cover_position). The feed header shows the cover as a wide band
// with a text panel over its foot, so a photo's subject can end up cropped away
// or hidden behind the text depending on where it sits in the frame. No single
// default works for every photograph, so the owner picks.

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
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
};

export function isCoverPosition(value: string | null | undefined): value is CoverPosition {
  return value === "top" || value === "center" || value === "bottom";
}

/** The object-position utility for a stored value, falling back to centre. */
export function coverPositionClass(value: string | null | undefined): string {
  return isCoverPosition(value) ? CLASSES[value] : CLASSES.center;
}
