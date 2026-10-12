// Wikimedia Commons serves ready-made thumbnails at fixed widths, so a
// Commons original gets a real srcset (500 → 1920px) and the browser picks
// the smallest that fills the slot. Plain module (not a client component) so
// server code, such as the community feed, can build a thumbnail URL too.

const COMMONS_PREFIX = "https://upload.wikimedia.org/wikipedia/commons/";
const COMMONS_WIDTHS = [500, 960, 1280, 1920];

function commonsThumb(src: string, width: number): string {
  // .../commons/a/ab/File.jpg -> .../commons/thumb/a/ab/File.jpg/960px-File.jpg
  const rest = src.slice(COMMONS_PREFIX.length);
  const file = rest.split("/").pop() ?? "";
  return `${COMMONS_PREFIX}thumb/${rest}/${width}px-${file}`;
}

export function commonsSrcSet(src: string, originalWidth?: number): { src: string; srcSet?: string } {
  if (!src.startsWith(COMMONS_PREFIX) || src.includes("/thumb/") || /\.(svg|tiff?)$/i.test(src)) return { src };
  const widths = COMMONS_WIDTHS.filter((w) => !originalWidth || w < originalWidth);
  if (widths.length === 0) return { src };
  return {
    src: commonsThumb(src, widths[Math.min(1, widths.length - 1)]),
    srcSet: [...widths.map((w) => `${commonsThumb(src, w)} ${w}w`), ...(originalWidth && originalWidth <= 2400 ? [`${src} ${originalWidth}w`] : [])].join(", "),
  };
}
