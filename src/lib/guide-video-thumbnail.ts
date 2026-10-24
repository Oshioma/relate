import { parseVideoLink } from "./school/video-links";

// The picture a guide card shows for the first video in a guide's body, so a
// list of guides that are mostly videos reads as videos at a glance.
//
//   image — a YouTube video (embedded with the editor's video button, or just
//           a pasted link): YouTube's own still for it.
//   video — a video uploaded into the guide: the card shows its first frame.
//   tile  — a video we can't get a still for without asking its host (Vimeo):
//           the card shows a plain play tile so it still reads as a video.
export type GuideVideoThumbnail =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string }
  | { kind: "tile" };

const MEDIA_ATTR = /<(iframe|video|source|a)\b[^>]*?\s(src|href)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

function decodeAmp(value: string): string {
  return value.replace(/&amp;/gi, "&").trim();
}

// The embed button writes youtube-nocookie.com/embed/<id>, which the lesson
// link parser doesn't read (nobody pastes it), so it's mapped back first.
function fromLink(raw: string): GuideVideoThumbnail | null {
  const link = parseVideoLink(raw.replace(/^(https?:\/\/)(www\.)?youtube-nocookie\.com\//i, "$1www.youtube.com/"));
  if (!link) return null;
  if (link.platform === "youtube") {
    const id = new URL(link.url).searchParams.get("v");
    return id ? { kind: "image", src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` } : null;
  }
  if (link.platform === "vimeo" && link.embedUrl) return { kind: "tile" };
  return null;
}

export function guideVideoThumbnail(body: string | null | undefined): GuideVideoThumbnail | null {
  if (!body) return null;
  MEDIA_ATTR.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = MEDIA_ATTR.exec(body)) !== null) {
    const tag = match[1].toLowerCase();
    const value = decodeAmp(match[3] ?? match[4] ?? "");
    if (!/^https?:\/\//i.test(value) && !value.startsWith("/")) continue;
    if (tag === "video" || tag === "source") return { kind: "video", src: value };
    const found = fromLink(value);
    if (found) return found;
  }
  // A guide written in Markdown with a bare link on its own.
  for (const url of body.match(/https?:\/\/[^\s<>"')\]]+/g) ?? []) {
    const found = fromLink(url);
    if (found) return found;
  }
  return null;
}
