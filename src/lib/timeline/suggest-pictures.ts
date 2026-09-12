// =============================================================================
// SUGGESTING PICTURES FOR A RECORD SOMEBODY WROTE THEMSELVES
//
// The seeded records get their pictures from files in this repository, each one
// checked by hand against the Commons file page before it was written down. A
// record somebody adds in the app gets none of that: they have an upload box, a
// caption field, and no help at all finding something to put in it.
//
// This suggests candidates by searching Wikimedia Commons from the record's own
// title, place and people.
//
// THE FAILURE THIS IS BUILT AGAINST, stated first because everything below is
// shaped by it: a search will confidently return a picture that LOOKS right and
// is not. Search "Ur flood" and you get pictures of Ur; one of them is a
// ziggurat built a thousand years after the flood layer, and nothing in the
// search result says so. A suggestion feature that hides that is worse than no
// feature, because it produces wrong captions faster than a person could write
// them.
//
// So three rules run through this file:
//
//   1. NOTHING IS EVER ATTACHED AUTOMATICALLY. Every candidate needs a person
//      to choose it. There is no "use the first result" path, and no
//      confidence, relevance or match score anywhere — a number would be an
//      invitation to stop reading.
//
//   2. EVERY CANDIDATE CARRIES WHAT IT MATCHED ON. A file found because the
//      record's place name appears in its title is a different kind of
//      suggestion from one found because the word "flood" appears somewhere in
//      its description, and the person choosing has to be able to tell those
//      apart. That is what `matchedOn` is for, and the UI prints it.
//
//   3. THE CAPTION IS NEVER WRITTEN FOR THEM. A suggestion fills in the URL.
//      What the picture IS, and what it is a picture OF, stay empty and
//      required, because those are the two fields that mislead a reader when
//      they are wrong, and a machine cannot know either from a search result.
// =============================================================================

/** Words that are in half the records here and so cannot narrow a search. */
const TOO_COMMON = new Set([
  "the", "a", "an", "of", "and", "or", "in", "at", "on", "to", "for", "from", "by", "with",
  "as", "is", "was", "were", "it", "its", "this", "that", "these", "those", "than", "then",
  // Words this timeline uses constantly. A search for "date" or "claim" returns
  // the whole internet and none of it is about the record.
  "date", "dates", "dating", "claim", "claims", "evidence", "record", "records",
  "account", "accounts", "tradition", "traditions", "proposed", "possible", "disputed",
  "early", "late", "ancient", "first", "begins", "began", "beginning", "end", "ends",
  "years", "year", "ago", "before", "after", "about", "around", "century", "millennium",
]);

export type SuggestionSource = { kind: "title" | "place" | "person" | "civilisation"; value: string };

/**
 * The terms to search Commons with, and where each came from.
 *
 * Place and person names are the ones worth having: they are specific, and a
 * file whose own title contains one is very likely to be about the thing. Words
 * from the record's title are kept too, but they are the weakest kind of term
 * and the caller can see that they are.
 */
export function searchTermsFor(event: {
  title?: string | null;
  locationName?: string | null;
  people?: string[] | null;
  civilisations?: string[] | null;
}): SuggestionSource[] {
  const out: SuggestionSource[] = [];
  const seen = new Set<string>();
  const push = (kind: SuggestionSource["kind"], value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const key = `${kind}:${trimmed.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ kind, value: trimmed });
  };

  // A place name is the single most useful thing a record has. Everything after
  // the first comma is usually the country, which widens rather than narrows.
  if (event.locationName) push("place", event.locationName.split(",")[0]!);
  for (const person of event.people ?? []) push("person", person);
  for (const civilisation of event.civilisations ?? []) push("civilisation", civilisation);

  // The title, reduced to the words that could distinguish anything.
  //
  // TWO WORDS AT MOST, AND NAMES BEFORE ANYTHING ELSE. Commons search ANDs its
  // terms, so a long query is a narrow one: "human activity Moyjil" asks for
  // files matching all three and finds nothing, where "Moyjil" alone finds the
  // site. Proper nouns are what a title has that is worth searching — the rest
  // of a title on this timeline is usually the interpretation, not the subject.
  //
  // A title made entirely of common words contributes nothing, which is
  // correct rather than unfortunate: it means the record's own name would not
  // have found a picture either.
  const words = (event.title ?? "")
    .replace(/[—–(),.:;?!"']/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !TOO_COMMON.has(word.toLowerCase()));
  // The first word of a title is capitalised because it is first, not because
  // it is a name, so it only counts as one if it appears capitalised later too.
  const names = words.filter((word, index) => /^\p{Lu}/u.test(word) && index > 0);
  const chosen = (names.length ? names : words).slice(0, 2);
  if (chosen.length) push("title", chosen.join(" "));

  return out;
}

export type PictureCandidate = {
  /** The Commons file name, e.g. "Doggerland.svg". */
  fileName: string;
  /** The address to store — Special:FilePath, so it behaves like every seeded picture. */
  url: string;
  /** A small version, for showing the candidate without pulling the full file. */
  thumbnailUrl: string;
  /** The Commons file page, so a person can go and read what it actually is. */
  filePageUrl: string;
  /** Who made it and under what terms, as Commons states it. Null when Commons does not say. */
  credit: string | null;
  /** Commons' own description, which is the main thing worth reading before choosing. */
  description: string | null;
  /** WHY this was suggested. Printed beside the candidate; never a score. */
  matchedOn: SuggestionSource;
};

/** Commons search only ever returns files; this is belt and braces on the parser. */
const USABLE = /\.(jpe?g|png|gif|webp|svgz?|tiff?)$/i;

function stripHtml(value: string | null | undefined): string | null {
  if (!value) return null;
  const text = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  return text.length ? text : null;
}

/**
 * Turn one Commons API response into candidates.
 *
 * Kept apart from the fetching so the parsing can be tested without a network,
 * which matters because the shape of this response is the only thing standing
 * between a person and a picture of the wrong Ur.
 */
export function candidatesFrom(json: unknown, matchedOn: SuggestionSource): PictureCandidate[] {
  const pages = (json as { query?: { pages?: Record<string, unknown> } })?.query?.pages;
  if (!pages || typeof pages !== "object") return [];

  const out: PictureCandidate[] = [];
  for (const page of Object.values(pages)) {
    const entry = page as {
      title?: string;
      imageinfo?: { url?: string; thumburl?: string; descriptionurl?: string; extmetadata?: Record<string, { value?: string }> }[];
    };
    const title = entry.title ?? "";
    if (!title.startsWith("File:")) continue;
    const fileName = title.slice("File:".length);
    if (!USABLE.test(fileName)) continue;

    const info = entry.imageinfo?.[0];
    if (!info) continue;

    const meta = info.extmetadata ?? {};
    const artist = stripHtml(meta.Artist?.value);
    const licence = stripHtml(meta.LicenseShortName?.value);
    // The same shape the seeded credits take, so a chosen suggestion and a
    // seeded picture are indistinguishable once they are on a record.
    const credit = artist && licence ? `${artist}, ${licence}, via Wikimedia Commons`
      : artist ? `${artist}, via Wikimedia Commons`
      : licence ? `${licence}, via Wikimedia Commons`
      : null;

    out.push({
      fileName,
      url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1024`,
      thumbnailUrl: info.thumburl ?? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=320`,
      filePageUrl: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`,
      credit,
      description: stripHtml(meta.ImageDescription?.value),
      matchedOn,
    });
  }
  return out;
}

/** Long enough for a slow API, short enough that an editor does not hang. */
const SEARCH_TIMEOUT_MS = 8_000;
/** Per search term. Several terms are run, so the total is larger. */
const PER_TERM = 6;

export function commonsSearchUrl(term: string): string {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: `filetype:bitmap|drawing ${term}`,
    gsrnamespace: "6",
    gsrlimit: String(PER_TERM),
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "320",
    iiextmetadatafilter: "Artist|LicenseShortName|ImageDescription",
  });
  return `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
}

/**
 * Search Commons for each term and gather the candidates.
 *
 * A failing term is skipped rather than failing the whole search: a person who
 * gets three suggestions instead of five has something to work with, and one
 * who gets an error message has nothing.
 */
export async function suggestPictures(
  event: Parameters<typeof searchTermsFor>[0],
  fetchImpl: typeof fetch = fetch
): Promise<{ candidates: PictureCandidate[]; searched: SuggestionSource[]; failed: SuggestionSource[] }> {
  const terms = searchTermsFor(event);
  const candidates: PictureCandidate[] = [];
  const searched: SuggestionSource[] = [];
  const failed: SuggestionSource[] = [];
  const seenFiles = new Set<string>();

  for (const term of terms) {
    let json: unknown;
    try {
      const response = await fetchImpl(commonsSearchUrl(term.value), {
        signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS),
        headers: { accept: "application/json" },
      });
      if (!response.ok) { failed.push(term); continue; }
      json = await response.json();
    } catch {
      failed.push(term);
      continue;
    }
    searched.push(term);
    for (const candidate of candidatesFrom(json, term)) {
      // The same file found by two terms is one candidate, kept under the
      // FIRST term that found it — and the terms are ordered place, person,
      // civilisation, title, so it keeps the most specific reason.
      if (seenFiles.has(candidate.fileName)) continue;
      seenFiles.add(candidate.fileName);
      candidates.push(candidate);
    }
  }

  return { candidates, searched, failed };
}
