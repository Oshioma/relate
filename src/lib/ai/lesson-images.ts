// Where lesson pictures come from.
//
// Each source is a small adapter: given a search phrase, return one usable
// image or null. Adding a source means adding one entry to IMAGE_SOURCES —
// nothing else in the app needs to know about it.
//
// Sources are tried in order until one returns an image, so put the ones
// with the best child-safety controls first. A source that errors, times
// out, or returns nothing is skipped silently; lessons are never held up
// by an image lookup.
//
// Order and availability can be overridden per-deployment with
// LESSON_IMAGE_SOURCES, e.g. "openverse,commons".
//
// Every source here is either openly licensed or public domain, and Openverse
// leads because it is the only one with a mature-content filter — these images
// are shown to children.

import "server-only";
import type { LessonImage } from "@/lib/school/lesson-types";

// Wikimedia asks for a descriptive agent identifying the application.
const USER_AGENT =
  "relate-lessons/1.0 (https://relate.click; lesson illustrations)";

const PER_SOURCE_TIMEOUT_MS = 4000;

// Ceiling on the whole image phase. Lessons run inside a platform request
// budget, so picture lookups get a fixed slice and stop when it is spent —
// a lesson with some pictures beats a request killed mid-flight.
export const IMAGE_PHASE_BUDGET_MS = 12000;

export type ImageSource = {
  key: string;
  label: string;
  // Set when the source only works if an API key is configured. Sources
  // without this are free and need no account.
  requiresEnv?: string;
  search: (query: string, signal: AbortSignal) => Promise<LessonImage | null>;
};

async function getJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, {
    signal,
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    // These are public catalogues; let the platform cache identical lookups.
    next: { revalidate: 86400 },
  });
  if (!response.ok) throw new Error(`${response.status}`);
  return response.json();
}

// Strips the HTML Wikimedia returns inside its metadata fields.
function stripTags(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------- Openverse

// Aggregates openly-licensed images across many providers and, unlike the
// others, offers an explicit filter for mature content — so it goes first.
const openverse: ImageSource = {
  key: "openverse",
  label: "Openverse",
  async search(query, signal) {
    const url =
      "https://api.openverse.org/v1/images/" +
      `?q=${encodeURIComponent(query)}` +
      "&page_size=3&mature=false&license_type=commercial&format=json";

    const data = (await getJson(url, signal)) as {
      results?: {
        title?: string;
        url?: string;
        thumbnail?: string;
        creator?: string;
        license?: string;
        license_version?: string;
        foreign_landing_url?: string;
        source?: string;
      }[];
    };

    const hit = data.results?.find((r) => r.url);
    if (!hit?.url) return null;

    const license = [hit.license?.toUpperCase(), hit.license_version]
      .filter(Boolean)
      .join(" ");

    return {
      url: hit.url,
      thumbUrl: hit.thumbnail || hit.url,
      title: hit.title || query,
      creator: hit.creator || "",
      license: license || "Openly licensed",
      sourceName: hit.source ? `Openverse · ${hit.source}` : "Openverse",
      sourceUrl: hit.foreign_landing_url || hit.url,
    };
  },
};

// -------------------------------------------------------- Wikimedia Commons

// Deep on factual and scientific subjects. Restricted to bitmaps so the
// results are photographs and diagrams rather than icons or audio.
const commons: ImageSource = {
  key: "commons",
  label: "Wikimedia Commons",
  async search(query, signal) {
    const url =
      "https://commons.wikimedia.org/w/api.php" +
      "?action=query&format=json&formatversion=2" +
      "&generator=search&gsrnamespace=6&gsrlimit=3" +
      `&gsrsearch=${encodeURIComponent(`filetype:bitmap ${query}`)}` +
      "&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=900";

    const data = (await getJson(url, signal)) as {
      query?: {
        pages?: {
          title?: string;
          imageinfo?: {
            url?: string;
            thumburl?: string;
            mime?: string;
            descriptionurl?: string;
            extmetadata?: Record<string, { value?: string }>;
          }[];
        }[];
      };
    };

    for (const page of data.query?.pages ?? []) {
      const info = page.imageinfo?.[0];
      if (!info?.url) continue;
      // Skip anything that isn't a plain raster image.
      if (info.mime && !/^image\/(jpeg|png|webp|gif)$/.test(info.mime)) continue;

      const meta = info.extmetadata ?? {};
      return {
        url: info.thumburl || info.url,
        thumbUrl: info.thumburl || info.url,
        title: stripTags(page.title ?? query).replace(/^File:/, ""),
        creator: stripTags(meta.Artist?.value ?? ""),
        license: stripTags(meta.LicenseShortName?.value ?? "See source"),
        sourceName: "Wikimedia Commons",
        sourceUrl: info.descriptionurl || info.url,
      };
    }
    return null;
  },
};

// -------------------------------------------------------- Met Museum (art)

// Public-domain works from the Metropolitan Museum. Strong for art, history
// and artefacts, where the other two return modern stock photography.
const metMuseum: ImageSource = {
  key: "met",
  label: "The Met",
  async search(query, signal) {
    const searchUrl =
      "https://collectionapi.metmuseum.org/public/collection/v1/search" +
      `?hasImages=true&isPublicDomain=true&q=${encodeURIComponent(query)}`;

    const found = (await getJson(searchUrl, signal)) as {
      objectIDs?: number[] | null;
    };
    const objectId = found.objectIDs?.[0];
    if (!objectId) return null;

    const object = (await getJson(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`,
      signal
    )) as {
      title?: string;
      primaryImage?: string;
      primaryImageSmall?: string;
      artistDisplayName?: string;
      objectURL?: string;
      isPublicDomain?: boolean;
    };

    if (!object.primaryImageSmall || !object.isPublicDomain) return null;

    return {
      url: object.primaryImageSmall,
      thumbUrl: object.primaryImageSmall,
      title: object.title || query,
      creator: object.artistDisplayName || "",
      license: "Public domain",
      sourceName: "The Met",
      sourceUrl: object.objectURL || "https://www.metmuseum.org",
    };
  },
};

// ------------------------------------------------- Key-gated stock sources

// Free to use but require a free account. They stay dormant until their key
// is set, so adding one is purely an environment change.
const pexels: ImageSource = {
  key: "pexels",
  label: "Pexels",
  requiresEnv: "PEXELS_API_KEY",
  async search(query, signal) {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        signal,
        headers: {
          Authorization: process.env.PEXELS_API_KEY ?? "",
          "User-Agent": USER_AGENT,
        },
        next: { revalidate: 86400 },
      }
    );
    if (!response.ok) throw new Error(`${response.status}`);

    const data = (await response.json()) as {
      photos?: {
        alt?: string;
        photographer?: string;
        url?: string;
        src?: { large?: string; medium?: string };
      }[];
    };

    const hit = data.photos?.[0];
    const url = hit?.src?.large || hit?.src?.medium;
    if (!url) return null;

    return {
      url,
      thumbUrl: hit?.src?.medium || url,
      title: hit?.alt || query,
      creator: hit?.photographer || "",
      license: "Pexels licence",
      sourceName: "Pexels",
      sourceUrl: hit?.url || "https://www.pexels.com",
    };
  },
};

// Registry. Order is the fallback order; Openverse leads because it is the
// only one with a mature-content filter.
export const IMAGE_SOURCES: ImageSource[] = [
  openverse,
  commons,
  metMuseum,
  pexels,
];

// Sources usable in this deployment, in the order they should be tried.
export function activeSources(): ImageSource[] {
  const configured = (process.env.LESSON_IMAGE_SOURCES ?? "")
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  const usable = IMAGE_SOURCES.filter(
    (source) => !source.requiresEnv || Boolean(process.env[source.requiresEnv])
  );

  if (configured.length === 0) return usable;

  return configured
    .map((key) => usable.find((source) => source.key === key))
    .filter((source): source is ImageSource => Boolean(source));
}

// Finds one image for a search phrase, trying each source in turn. Returns
// null rather than throwing: a lesson without pictures is still a lesson.
// Stops early once the shared deadline has passed.
export async function findImage(
  query: string,
  deadline = Number.POSITIVE_INFINITY
): Promise<LessonImage | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  for (const source of activeSources()) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) return null;

    try {
      const result = await source.search(
        trimmed,
        AbortSignal.timeout(Math.min(PER_SOURCE_TIMEOUT_MS, remaining))
      );
      if (result?.url) return result;
    } catch {
      // Unreachable, rate-limited, or shape changed — try the next source.
    }
  }
  return null;
}

// Resolves images for every section at once, all sharing one deadline.
// Order is preserved; any lookup that fails or runs out of time leaves that
// section without a picture.
export async function findImages(
  queries: string[],
  budgetMs: number = IMAGE_PHASE_BUDGET_MS
): Promise<(LessonImage | null)[]> {
  const deadline = Date.now() + budgetMs;
  return Promise.all(queries.map((query) => findImage(query, deadline)));
}
