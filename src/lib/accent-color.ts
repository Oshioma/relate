import type { CSSProperties } from "react";

// A community can override the platform's accent token with its own colour
// (communities.accent_color). The value travels from the database into a CSS
// custom property on the community shell, so it gets normalised on the way in
// and only ever leaves here as a literal hex string.

// Suggestions offered in the community's branding settings. Deliberately short
// — a palette of colours that already work as an accent (mid-dark, saturated
// enough to read as a choice) beats a free colour wheel that lets an owner pick
// pale yellow for their buttons.
export const ACCENT_PRESETS: { name: string; value: string }[] = [
  { name: "Forest", value: "#4d6a52" },
  { name: "Lagoon", value: "#0b8c8f" },
  { name: "Ocean", value: "#1d6fa5" },
  { name: "Indigo", value: "#4c56a8" },
  { name: "Plum", value: "#7c4a72" },
  { name: "Coral", value: "#c0553f" },
  { name: "Brass", value: "#a06a22" },
  { name: "Slate", value: "#4a5a63" },
];

const HEX = /^#[0-9a-f]{6}$/;

/**
 * Coerce user input to the `#rrggbb` the column's check constraint expects, or
 * null when it isn't a colour. Accepts the 3-digit shorthand and a missing
 * leading `#` because both are things people type; rejects everything else
 * rather than guessing.
 */
export function normalizeAccentColor(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let value = raw.trim().toLowerCase();
  if (!value) return null;
  if (!value.startsWith("#")) value = `#${value}`;
  // #abc -> #aabbcc
  if (/^#[0-9a-f]{3}$/.test(value)) {
    value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return HEX.test(value) ? value : null;
}

/**
 * Text colour that stays legible on top of `hex` — white on a dark accent,
 * near-black on a light one. Uses WCAG relative luminance rather than a naive
 * average so a saturated yellow and a saturated blue of the same "brightness"
 * are judged correctly.
 */
export function accentForeground(hex: string): string {
  const channel = (start: number) => {
    const srgb = parseInt(hex.slice(start, start + 2), 16) / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
  // 0.45 rather than the midpoint: white text holds up on a slightly lighter
  // ground than black text does on a slightly darker one.
  return luminance > 0.45 ? "#1a1a17" : "#ffffff";
}

/**
 * The inline style that re-points the accent tokens for one community's shell,
 * paired with the `data-community-accent` attribute that globals.css keys its
 * dark-mode lift off. Returns undefined when the community hasn't chosen a
 * colour, so the platform accent applies untouched.
 */
export function communityAccentStyle(accentColor: string | null | undefined): CSSProperties | undefined {
  const accent = normalizeAccentColor(accentColor);
  if (!accent) return undefined;
  return {
    "--community-accent": accent,
    "--community-accent-foreground": accentForeground(accent),
  } as CSSProperties;
}
