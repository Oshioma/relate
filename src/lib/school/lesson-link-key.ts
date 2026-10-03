// Telling whether a link has already been made into a lesson.
//
// The composer asks before reading a link in, so a teacher who pastes the same
// article or video twice hears "you've made this one already" before the page
// read or the transcription is paid for, not after a second lesson exists.
//
// The same page arrives in many spellings — with or without www, a trailing
// slash, a #section, a tracking tag from wherever it was shared — and a video
// in more still (youtu.be, m.youtube.com, &t=42s). This boils a link down to
// one key so those all count as the same thing. Pure, so it runs anywhere.

import { parseVideoLink } from "./video-links";

// Query parameters that say where a link was shared from, not what it points
// at. Anything else is kept: on plenty of sites ?id=… is the page.
const TRACKING_PARAM = /^(utm_.*|fbclid|gclid|dclid|msclkid|mc_cid|mc_eid|igshid|si|ref|ref_src|share|s)$/i;

export function lessonLinkKey(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;

  // A video is keyed by the link it would be stored as, which already folds
  // every spelling of the same video into one.
  const video = parseVideoLink(value);
  if (video) return `video:${video.url}`;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase().replace(/^(www\.|m\.|mobile\.|amp\.)/, "");
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const params = [...url.searchParams.entries()]
    .filter(([name]) => !TRACKING_PARAM.test(name))
    .sort(([a], [b]) => a.localeCompare(b));
  const query = params.length ? `?${new URLSearchParams(params).toString()}` : "";

  // The scheme is left out: http and https of one page are one page.
  return `page:${host}${path}${query}`;
}
