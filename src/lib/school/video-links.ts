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

export type VideoPlatform = "youtube" | "facebook" | "instagram";

export type VideoLink = {
  platform: VideoPlatform;
  // The link as it should be stored and handed to the worker.
  url: string;
  // An iframe src, or null when the platform can't be embedded from this link
  // (a Facebook share link, say). The lesson then shows a plain link instead.
  embedUrl: string | null;
  // Instagram reels and YouTube Shorts are portrait; everything else 16:9.
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

  return youtube(url) ?? instagram(url) ?? facebook(url);
}

// "1:02:03" / "4:05", for a duration the worker reported in seconds.
export function formatDuration(seconds: number | null | undefined): string | null {
  if (!seconds || seconds <= 0) return null;
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${rest}` : `${m}:${rest}`;
}
