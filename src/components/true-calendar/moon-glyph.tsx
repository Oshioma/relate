// The Moon as it actually looks on a day: the lit part drawn from the real
// illuminated fraction and the waxing/waning side, not one of eight stock
// icons. The terminator is the ellipse a sphere's shadow line projects to.
//
// Seen from the northern hemisphere a waxing Moon is lit on the right; from
// the southern hemisphere the picture is mirrored (lit on the left). Near the
// equator — Zanzibar, say — the crescent lies closer to a "boat" shape; the
// mirror choice is the viewer's preference.

export function MoonGlyph({
  illumination,
  waxing,
  size = 16,
  southern = false,
  className,
  title,
}: {
  illumination: number;
  waxing: boolean;
  size?: number;
  southern?: boolean;
  className?: string;
  title?: string;
}) {
  const r = 10;
  const k = Math.min(1, Math.max(0, illumination));
  // Distance of the terminator's widest point from the centre line.
  const rx = Math.abs(1 - 2 * k) * r;
  // Lit limb on the right (waxing, northern view); the terminator bulges
  // right for a crescent and left for a gibbous Moon.
  const litPath = `M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${rx} ${r} 0 0 ${k < 0.5 ? 0 : 1} 0 ${-r} Z`;
  const mirror = waxing === southern; // waning (north) or waxing (south) → lit on the left
  return (
    <svg
      viewBox="-11 -11 22 22"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <circle r={r} fill="var(--tc-moon-dark)" stroke="var(--tc-moon-edge)" strokeWidth={0.6} />
      {k > 0.003 ? <path d={litPath} fill="var(--tc-moon-lit)" transform={mirror ? "scale(-1 1)" : undefined} /> : null}
    </svg>
  );
}
