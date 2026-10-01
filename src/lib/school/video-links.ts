// Recognising the video links a lesson can be written from, and turning them
// into something a lesson page can embed.
//
// Shared by the browser (the composer decides which box a link belongs in),
// the API routes (which refuse anything else before it reaches the worker)
// and the lesson page (which embeds the video). Pure, so it runs anywhere.
//
// Deliberately a short list of hosts rather than "anything yt-dlp can read":
// every link here is fetched by a server we pay for, and the embed has to be
// one we know renders. Adding a platform is adding a case below and to
// ALLOWED_HOSTS in workers/video-transcriber/app.py.

export type VideoPlatform = "youtube" | "facebook" | "instagram" | "tiktok" | "vimeo";

export type VideoLink = {
  platform: VideoPlatform;
  // The link as it should be stored and handed to the worker.
  url: string;
  // An iframe src, or null when the platform can't be embedded from this link
  // (a Facebook or TikTok share link, say). The lesson then shows a plain link
  // instead.
  embedUrl: string | null;
  // Instagram reels, YouTube Shorts and TikToks are portrait; everything else
  // 16:9.
  portrait: boolean;
};

// The page that explains how to give the video worker cookies, which the
// worker's login / bot-check errors point at. See src/app/help/video-cookies.
export const VIDEO_COOKIES_HELP_PATH = "/help/video-cookies";

// The worker's errors end with a link to its cookie instructions — by default
// this site's page, but an older worker (or one configured elsewhere) points
// at the README in the private repository, which a teacher can't open. Either
// way the composer shows this site's page. Absolute, because the composer only
// turns full URLs into links.
const WORKER_HELP_LINK = /https?:\/\/\S*(?:README\.md#cookies|\/help\/video-cookies)/g;

export function withSiteHelpLink(text: string | null, siteUrl?: string): string | null {
  if (!text) return text;
  const site = (siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://relate.click").replace(/\/+$/, "");
  return text.replace(WORKER_HELP_LINK, `${site}${VIDEO_COOKIES_HELP_PATH}`);
}

export const VIDEO_PLATFORM_NAMES: Record<VideoPlatform, string> = {
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  vimeo: "Vimeo",
};

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

function hostOf(url: URL): string {
  return url.hostname.toLowerCase().replace(/^(www\.|m\.|mobile\.|web\.)/, "");
}

function youtube(url: URL): VideoLink | null {
  const host = hostOf(url);
  let id: string | null = null;
  let portrait = false;

  if (host === "youtu.be") {
    id = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "music.youtube.com") {
    const [, first, second] = url.pathname.split("/");
    if (first === "watch") id = url.searchParams.get("v");
    else if (first === "shorts") {
      id = second ?? null;
      portrait = true;
    } else if (first === "live" || first === "embed" || first === "v") id = second ?? null;
  } else {
    return null;
  }

  if (!id || !YOUTUBE_ID.test(id)) return null;
  return {
    platform: "youtube",
    url: `https://www.youtube.com/watch?v=${id}`,
    // The no-cookie domain: a lesson page shouldn't drop tracking cookies on a
    // child just for showing a video.
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    portrait,
  };
}

function instagram(url: URL): VideoLink | null {
  if (hostOf(url) !== "instagram.com") return null;
  const match = /^\/(?:[^/]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/.exec(url.pathname);
  if (!match) return null;
  const kind = match[1] === "reels" ? "reel" : match[1];
  const code = match[2];
  return {
    platform: "instagram",
    url: `https://www.instagram.com/${kind}/${code}/`,
    embedUrl: `https://www.instagram.com/${kind}/${code}/embed`,
    portrait: kind === "reel",
  };
}

function facebook(url: URL): VideoLink | null {
  const host = hostOf(url);
  if (host === "fb.watch") {
    // A short link: fine to download, but the embed plugin needs the full
    // address, which only following the redirect would reveal.
    return { platform: "facebook", url: url.toString(), embedUrl: null, portrait: false };
  }
  if (host !== "facebook.com") return null;

  const path = url.pathname;
  const isVideo =
    /\/videos\//.test(path) ||
    /^\/reel\//.test(path) ||
    /^\/watch\/?$/.test(path) ||
    /^\/share\/(v|r)\//.test(path);
  if (!isVideo) return null;

  // Keep only the query parameter that identifies the video; the rest is
  // tracking that has no business in a stored link.
  const clean = new URL(`https://www.facebook.com${path}`);
  const v = url.searchParams.get("v");
  if (v) clean.searchParams.set("v", v);

  const embeddable = !/^\/share\//.test(path);
  return {
    platform: "facebook",
    url: clean.toString(),
    embedUrl: embeddable
      ? `https://www.facebook.com/plugins/video.php?show_text=false&href=${encodeURIComponent(clean.toString())}`
      : null,
    portrait: /^\/reel\//.test(path),
  };
}

function tiktok(url: URL): VideoLink | null {
  const host = hostOf(url);
  // vm.tiktok.com (and vt.) are the app's share links, and /t/… is the same
  // thing on the main host. Like fb.watch: yt-dlp follows them happily, but
  // the numeric id the embed player needs is only behind the redirect, and
  // following it here would mean fetching TikTok on every page render.
  if (host === "vm.tiktok.com" || host === "vt.tiktok.com") {
    const code = /^\/([A-Za-z0-9]+)\/?$/.exec(url.pathname)?.[1];
    if (!code) return null;
    return { platform: "tiktok", url: `https://${host}/${code}/`, embedUrl: null, portrait: true };
  }
  if (host !== "tiktok.com") return null;

  const short = /^\/t\/([A-Za-z0-9]+)\/?$/.exec(url.pathname)?.[1];
  if (short) {
    return { platform: "tiktok", url: `https://www.tiktok.com/t/${short}/`, embedUrl: null, portrait: true };
  }

  // A profile (/@someone) or a photo post isn't something to transcribe; only
  // /@user/video/<id> is. The query is all share tracking (is_from_webapp,
  // sender_device…), so it's dropped.
  const match = /^\/@([A-Za-z0-9._-]+)\/video\/(\d+)\/?$/.exec(url.pathname);
  if (!match) return null;
  const [, user, id] = match;
  return {
    platform: "tiktok",
    url: `https://www.tiktok.com/@${user}/video/${id}`,
    // The v2 player takes the bare id; the username isn't needed to embed.
    embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
    portrait: true,
  };
}

const VIMEO_ID = /^\d+$/;
const VIMEO_HASH = /^[0-9a-f]+$/i;

function vimeo(url: URL): VideoLink | null {
  const host = hostOf(url);
  const parts = url.pathname.split("/").filter(Boolean);
  let id: string | undefined;
  let hash: string | null = null;

  if (host === "player.vimeo.com") {
    // The embed address itself, which people copy out of an embed code.
    if (parts[0] !== "video") return null;
    id = parts[1];
    hash = url.searchParams.get("h");
  } else if (host === "vimeo.com") {
    if (parts[0] === "channels") id = parts[2];
    else if (parts[0] === "groups") id = parts[2] === "videos" ? parts[3] : undefined;
    else {
      // vimeo.com/<id>, or vimeo.com/<id>/<hash> for an unlisted video. Any
      // other first segment (a user, a showcase) isn't a single video, and
      // the numeric-id check below turns it away.
      id = parts[0];
      hash = parts[1] ?? null;
    }
  } else {
    return null;
  }

  if (!id || !VIMEO_ID.test(id)) return null;
  // An unlisted video can't be played (or downloaded) without its hash, so it
  // travels with the id. Anything that doesn't look like one is dropped
  // rather than written into the stored link and the iframe src.
  if (hash && !VIMEO_HASH.test(hash)) hash = null;

  return {
    platform: "vimeo",
    url: hash ? `https://vimeo.com/${id}/${hash}` : `https://vimeo.com/${id}`,
    // dnt=1 is Vimeo's own "don't track the viewer" switch, for the same
    // reason YouTube gets the no-cookie domain.
    embedUrl: `https://player.vimeo.com/video/${id}?dnt=1${hash ? `&h=${hash}` : ""}`,
    portrait: false,
  };
}

// The one entry point. Accepts what people actually paste — no scheme, a
// mobile host, tracking parameters — and returns null for anything that isn't
// a video on a supported platform.
export function parseVideoLink(raw: string): VideoLink | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(trimmed)?.[1]?.toLowerCase();
  if (scheme && scheme !== "http" && scheme !== "https") return null;

  let url: URL;
  try {
    url = new URL(scheme ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  return youtube(url) ?? instagram(url) ?? facebook(url) ?? tiktok(url) ?? vimeo(url);
}

// "1:02:03" / "4:05" / "0:00" — a point in a video, as a player shows it.
// Whole seconds, rounded down: a section that starts at 12:30.8 is found by
// starting at 12:30, not by skipping past its first word.
export function formatTimestamp(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${rest}` : `${m}:${rest}`;
}

// "1:02:03" / "4:05", for a duration the worker reported in seconds.
export function formatDuration(seconds: number | null | undefined): string | null {
  if (!seconds || seconds <= 0) return null;
  return formatTimestamp(Math.round(seconds));
}

// The embed address that starts the video at `seconds` and plays it, or null
// when this platform's player can't be told where to start — the lesson page
// then offers no "watch from" buttons rather than ones that start at 0:00.
//
// Built from the parsed link, never from a stored embed address, for the same
// reason the embed itself is: only parseVideoLink decides what may be framed.
// A platform that can seek is a case here (Vimeo would append "#t=<n>s").
export function seekEmbedUrl(link: VideoLink, seconds: number): string | null {
  if (!link.embedUrl || !Number.isFinite(seconds) || seconds < 0) return null;
  switch (link.platform) {
    case "youtube": {
      const url = new URL(link.embedUrl);
      url.searchParams.set("start", String(Math.floor(seconds)));
      // The click that asked for this moment is the viewer's go-ahead to play.
      url.searchParams.set("autoplay", "1");
      return url.toString();
    }
    default:
      return null;
  }
}
