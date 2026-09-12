import { commonsFilePageUrl, commonsFileName, fetchCommonsAttribution } from "./check-pictures";

// =============================================================================
// WHERE A PICTURE MAY COME FROM, AND HOW ITS TERMS ARE STATED
//
// Wikimedia Commons was the only source this understood, and Commons is easy:
// it hosts freely-licensed files and only freely-licensed files, so "it is on
// Commons" is itself most of the licence answer, and its API will usually give
// the author and licence outright.
//
// Everywhere else, that reasoning does not transfer. A picture being on the
// internet says nothing about whether it may be used, and a picture being on a
// museum's website says nothing either — plenty of museums publish images they
// licence narrowly, or not at all. So the rule cannot be "fetch from anywhere
// and hope".
//
// THE RULE INSTEAD: a source is allowed here only if it publishes, in one
// place, the terms on which its images may be used — and every caption ends by
// pointing at those terms. Not a licence this file asserts on the source's
// behalf, which would be a claim nobody here can stand behind, but the source's
// own statement, where a reader or a lawyer can check it.
//
// That single rule covers both cases without special-casing:
//
//   * Commons, when the API answers  → the exact author and licence.
//   * Commons, when it does not      → the file page, which states both.
//   * A national collection          → its own rights or usage page.
//
// WHAT IS DELIBERATELY NOT HERE. No image search results, no "found via
// Google", no news photography, no stock library, no personal blog, and no
// general web host. Each of those either has no usable terms or has terms this
// use would breach, and the absence is the point rather than an oversight.
//
// Adding a source is a deliberate act: it needs a name, its hosts, and the URL
// where it states its terms. If that URL cannot be found, the source does not
// go in the list.
// =============================================================================

export type PictureSource = {
  key: string;
  /** What the caption calls it. */
  name: string;
  /** Hostnames, matched as themselves or as a suffix after a dot. */
  hosts: string[];
  /**
   * Where this source states the terms its images are published on.
   *
   * For most sources this is one page for everything. For Commons it is a page
   * PER FILE, which is better, so that one builds a URL from the picture.
   */
  terms: string | ((url: string) => string | null);
  /**
   * What is generally true of this source's images, in the source's own words
   * rather than this file's summary of them.
   *
   * Null where no single statement covers the collection — in which case the
   * caption sends the reader to the terms and says nothing else, because a
   * blanket claim would be the one part of a caption that could be wrong in a
   * way that matters.
   */
  generally: string | null;
};

export const PICTURE_SOURCES: PictureSource[] = [
  {
    key: "commons",
    name: "Wikimedia Commons",
    hosts: ["commons.wikimedia.org", "upload.wikimedia.org", "wikimedia.org", "wikipedia.org"],
    terms: (url) => {
      const file = commonsFileName(url);
      return file ? commonsFilePageUrl(file) : null;
    },
    // Commons' own scope rule: it accepts only files under a free licence or in
    // the public domain. That is why a missing metadata field there is a
    // missing field rather than a missing licence.
    generally: "freely licensed",
  },
  {
    key: "nasa",
    name: "NASA",
    hosts: ["nasa.gov", "images-assets.nasa.gov", "apod.nasa.gov"],
    terms: "https://www.nasa.gov/nasa-brand-center/images-and-media/",
    // NASA's wording, not a paraphrase that rounds it up to "public domain":
    // NASA content is generally not copyrighted and may be used for
    // educational purposes, and NASA says outright that there are exceptions —
    // material from partner agencies, and images containing identifiable
    // people. So the caption points at the policy rather than declaring one.
    generally: null,
  },
  {
    key: "usgs",
    name: "the U.S. Geological Survey",
    hosts: ["usgs.gov"],
    terms: "https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits",
    // The USGS distinguishes its own work from material it has licensed in,
    // and asks that the second be credited to whoever holds it.
    generally: null,
  },
  {
    key: "noaa",
    name: "NOAA",
    hosts: ["noaa.gov"],
    terms: "https://www.noaa.gov/information-technology/disclaimer",
    generally: null,
  },
  {
    key: "si",
    name: "the Smithsonian",
    hosts: ["si.edu", "ids.si.edu"],
    terms: "https://www.si.edu/openaccess/terms",
    // The Smithsonian's Open Access release is CC0 — but it covers the images
    // released under it, not everything the institution serves, so the caption
    // still sends the reader to the terms.
    generally: null,
  },
  {
    key: "met",
    name: "the Metropolitan Museum of Art",
    hosts: ["metmuseum.org", "images.metmuseum.org"],
    terms: "https://www.metmuseum.org/information/terms-and-conditions/image-resources",
    generally: null,
  },
  {
    key: "rijksmuseum",
    name: "the Rijksmuseum",
    hosts: ["rijksmuseum.nl"],
    terms: "https://www.rijksmuseum.nl/en/copyright",
    generally: null,
  },
  {
    key: "loc",
    name: "the Library of Congress",
    hosts: ["loc.gov"],
    terms: "https://www.loc.gov/legal/",
    generally: null,
  },
  {
    key: "wellcome",
    name: "Wellcome Collection",
    hosts: ["wellcomecollection.org", "iiif.wellcomecollection.org"],
    terms: "https://wellcomecollection.org/pages/Vm7l4yQAACUAXsOn",
    generally: null,
  },
];

/** Which of the allowed sources, if any, is this picture from? */
export function pictureSourceFor(url: string): PictureSource | null {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  return (
    PICTURE_SOURCES.find((source) =>
      source.hosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))
    ) ?? null
  );
}

/** Where this particular picture's terms are stated, if we can say. */
export function termsUrlFor(url: string): string | null {
  const source = pictureSourceFor(url);
  if (!source) return null;
  return typeof source.terms === "function" ? source.terms(url) : source.terms;
}

/**
 * Work out the credit line for one picture, and say so in the caption.
 *
 * Commons is asked directly, because it will usually answer with the exact
 * author and licence and there is no reason to send a reader to a page for
 * something we can simply tell them. Every other source gets the pointer.
 *
 * A picture from no listed source gets NOTHING APPENDED and — this is the part
 * that matters — is left for the caller to decline. There is no case where
 * this invents terms.
 */
export async function creditFor(
  url: string,
  fetchImpl: typeof fetch = fetch
): Promise<{ credit: string; exact: boolean } | null> {
  const source = pictureSourceFor(url);
  if (!source) return null;

  if (source.key === "commons") {
    const file = commonsFileName(url);
    if (file) {
      const attribution = await fetchCommonsAttribution(file, fetchImpl);
      if (attribution) return { credit: attribution.credit, exact: true };
      return {
        credit: `Via ${source.name}; author and licence are stated on the file page: ${commonsFilePageUrl(file)}`,
        exact: false,
      };
    }
  }

  const terms = termsUrlFor(url);
  if (!terms) return null;
  return { credit: `Via ${source.name}; terms of use: ${terms}`, exact: false };
}
