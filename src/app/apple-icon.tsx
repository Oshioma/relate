import { ImageResponse } from "next/og";

/* iOS "Add to Home Screen" reads apple-touch-icon, not the 32px favicon that
   icon.tsx serves. With no apple-touch-icon at all, iOS had nothing to install
   and fell back to a thumbnail of the page itself — which is why the shortcut
   never looked like an app.

   Two things matter here and nowhere else in the app:

   - The background must be opaque. iOS composites a Home Screen icon onto
     black, so a transparent PNG reads as a dark square with a glyph floating
     in it. icon.tsx can stay transparent because a browser tab sits on the
     chrome's own colour; this one cannot.
   - 180x180 is what current iPhones request (60pt at @3x). iOS applies its own
     rounded-corner and shine mask, so the artwork stays square — rounding it
     here would only show up as a double-rounded edge. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // --accent from globals.css: the platform green, so the installed
          // icon matches the app it opens.
          background: "#4d6a52",
          // Leaves roughly a tenth of the square as margin on each side, so the
          // glyph still clears iOS's corner mask.
          fontSize: 116,
          lineHeight: 1,
        }}
      >
        🙏🏼
      </div>
    ),
    { ...size }
  );
}
