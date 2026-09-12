import { test } from "node:test";
import assert from "node:assert/strict";

import {
  searchTermsFor,
  candidatesFrom,
  commonsSearchUrl,
  suggestPictures,
  type SuggestionSource,
} from "./suggest-pictures";

const TERM: SuggestionSource = { kind: "place", value: "Göbekli Tepe" };

/** One Commons API response, shaped the way the real one is. */
const commonsResponse = (files: { title: string; artist?: string; licence?: string; desc?: string }[]) => ({
  query: {
    pages: Object.fromEntries(
      files.map((file, i) => [
        String(i),
        {
          title: file.title,
          imageinfo: [
            {
              url: `https://upload.wikimedia.org/x/${file.title.slice(5)}`,
              thumburl: `https://upload.wikimedia.org/thumb/${file.title.slice(5)}`,
              descriptionurl: `https://commons.wikimedia.org/wiki/${file.title}`,
              extmetadata: {
                ...(file.artist ? { Artist: { value: file.artist } } : {}),
                ...(file.licence ? { LicenseShortName: { value: file.licence } } : {}),
                ...(file.desc ? { ImageDescription: { value: file.desc } } : {}),
              },
            },
          ],
        },
      ])
    ),
  },
});

const stubFetch = (byUrl: (url: string) => unknown) =>
  (async (url: string | URL) =>
    new Response(JSON.stringify(byUrl(String(url))), {
      status: 200,
      headers: { "content-type": "application/json" },
    })) as unknown as typeof fetch;

// ---------------------------------------------------------------------------
// WHAT GETS SEARCHED FOR
// ---------------------------------------------------------------------------

test("a place name is used, and the country after the comma is dropped", () => {
  // "Göbekli Tepe, Şanlıurfa Province, Türkiye" searched whole returns things
  // about Türkiye. The first part is the bit that narrows.
  const terms = searchTermsFor({ locationName: "Göbekli Tepe, Şanlıurfa Province, Türkiye" });
  assert.deepEqual(terms[0], { kind: "place", value: "Göbekli Tepe" });
});

test("people and civilisations are searched, and the place comes first", () => {
  const terms = searchTermsFor({
    title: "Hannibal crosses the Rhône",
    locationName: "The Rhône, southern France",
    people: ["Hannibal Barca"],
    civilisations: ["Carthage"],
  });
  assert.equal(terms[0].kind, "place");
  const kinds = terms.map((term) => term.kind);
  assert.ok(kinds.includes("person"));
  assert.ok(kinds.includes("civilisation"));
  // The order matters: a file found by place keeps that as its reason rather
  // than a weaker one, because the first term to find a file wins.
  assert.ok(kinds.indexOf("place") < kinds.indexOf("title"));
});

test("words this timeline uses constantly are not searched for", () => {
  // A search for "possible early evidence dates" returns the internet.
  const terms = searchTermsFor({ title: "Possible early human activity at Moyjil" });
  const title = terms.find((term) => term.kind === "title");
  assert.ok(title);
  for (const banned of ["possible", "early", "evidence", "dates", "activity"]) {
    assert.doesNotMatch(title!.value.toLowerCase(), new RegExp(`\\b${banned}\\b`));
  }
  assert.match(title!.value, /Moyjil/);
});

test("a title made only of common words contributes no term", () => {
  // Correct rather than unfortunate: the record's own name would not have
  // found a picture either, and an empty search is better than a vague one.
  const terms = searchTermsFor({ title: "The dates proposed for this account" });
  assert.equal(terms.filter((term) => term.kind === "title").length, 0);
});

test("nothing at all to search on yields no terms rather than a wildcard", () => {
  assert.deepEqual(searchTermsFor({}), []);
  assert.deepEqual(searchTermsFor({ title: "   ", locationName: "" }), []);
});

test("the same value is never searched twice", () => {
  const terms = searchTermsFor({ people: ["Khafre", "Khafre", "khafre"] });
  assert.equal(terms.length, 1);
});

test("the search asks Commons only for files, and only for pictures", () => {
  const url = commonsSearchUrl("Doggerland");
  assert.match(url, /^https:\/\/commons\.wikimedia\.org\/w\/api\.php\?/);
  assert.match(url, /gsrnamespace=6/);          // the File namespace and no other
  assert.match(url, /filetype%3Abitmap%7Cdrawing/);
  assert.match(url, /iiprop=url%7Cextmetadata/);
});

// ---------------------------------------------------------------------------
// WHAT COMES BACK
// ---------------------------------------------------------------------------

test("a candidate is addressed the same way every seeded picture is", () => {
  // Special:FilePath with a width, so it goes through the same copier, the same
  // credit resolution and the same SVG rasterising as everything else.
  const [candidate] = candidatesFrom(commonsResponse([{ title: "File:Doggerland.svg" }]), TERM);
  assert.equal(candidate.url, "https://commons.wikimedia.org/wiki/Special:FilePath/Doggerland.svg?width=1024");
  assert.match(candidate.filePageUrl, /commons\.wikimedia\.org/);
});

test("the credit is built in the same shape the seeded credits use", () => {
  const [candidate] = candidatesFrom(
    commonsResponse([{ title: "File:X.jpg", artist: "<a href='#'>Someone</a>", licence: "CC BY-SA 4.0" }]),
    TERM
  );
  assert.equal(candidate.credit, "Someone, CC BY-SA 4.0, via Wikimedia Commons");
});

test("a missing artist or licence is left missing, never guessed", () => {
  const [noLicence] = candidatesFrom(commonsResponse([{ title: "File:X.jpg", artist: "Someone" }]), TERM);
  assert.equal(noLicence.credit, "Someone, via Wikimedia Commons");
  const [neither] = candidatesFrom(commonsResponse([{ title: "File:Y.jpg" }]), TERM);
  assert.equal(neither.credit, null);
  // And nothing anywhere may invent terms.
  assert.doesNotMatch(JSON.stringify(neither), /public domain|CC BY|CC0/i);
});

test("markup in a description is stripped, because it is shown as text", () => {
  const [candidate] = candidatesFrom(
    commonsResponse([{ title: "File:X.jpg", desc: "<p>A <b>ziggurat</b> at Ur &amp; its ruins</p>" }]),
    TERM
  );
  assert.equal(candidate.description, "A ziggurat at Ur & its ruins");
});

test("anything that is not a usable picture file is dropped", () => {
  const candidates = candidatesFrom(
    commonsResponse([
      { title: "File:Good.jpg" },
      { title: "File:Sound.ogg" },
      { title: "File:Paper.pdf" },
      { title: "Category:Not a file" },
    ]),
    TERM
  );
  assert.deepEqual(candidates.map((candidate) => candidate.fileName), ["Good.jpg"]);
});

test("a malformed or empty response yields nothing rather than throwing", () => {
  for (const junk of [null, undefined, {}, { query: {} }, { query: { pages: null } }, "nonsense"]) {
    assert.deepEqual(candidatesFrom(junk, TERM), []);
  }
});

// ---------------------------------------------------------------------------
// THE RULES THE FEATURE EXISTS TO KEEP
// ---------------------------------------------------------------------------

test("every candidate carries what it matched on", () => {
  // The whole safeguard. A file found because a place name is in its title is
  // a different suggestion from one found on a word from the record's title,
  // and the person choosing has to be able to see which.
  const [candidate] = candidatesFrom(commonsResponse([{ title: "File:X.jpg" }]), TERM);
  assert.deepEqual(candidate.matchedOn, TERM);
});

test("no candidate carries a score, a rank or a confidence", () => {
  const [candidate] = candidatesFrom(
    commonsResponse([{ title: "File:X.jpg", artist: "A", licence: "CC0", desc: "d" }]),
    TERM
  );
  for (const key of Object.keys(candidate)) {
    assert.doesNotMatch(key, /score|rank|confidence|relevance|match(?!edOn)/i, `candidate carries "${key}"`);
  }
});

test("a suggestion supplies the address and nothing a reader would be misled by", () => {
  // It must NOT arrive with a caption or a `shows` value. Those are the two
  // fields that mislead when wrong, and a search result cannot know either.
  const [candidate] = candidatesFrom(commonsResponse([{ title: "File:X.jpg", desc: "some words" }]), TERM);
  assert.equal("caption" in candidate, false);
  assert.equal("shows" in candidate, false);
});

test("one file found by two terms appears once, under the more specific term", async () => {
  const fetchImpl = stubFetch(() => commonsResponse([{ title: "File:Shared.jpg" }]));
  const { candidates } = await suggestPictures(
    { locationName: "Ur, Iraq", title: "Something about Ur specifically" },
    fetchImpl
  );
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].matchedOn.kind, "place", "should keep the place, not the title");
});

test("one failing search does not lose the others", async () => {
  const fetchImpl = (async (url: string | URL) => {
    if (String(url).includes("Ur")) throw new Error("network");
    return new Response(JSON.stringify(commonsResponse([{ title: "File:Found.jpg" }])), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }) as unknown as typeof fetch;

  const { candidates, failed, searched } = await suggestPictures(
    { locationName: "Ur, Iraq", people: ["Woolley"] },
    fetchImpl
  );
  assert.equal(candidates.length, 1);
  assert.equal(failed.length, 1);
  assert.equal(searched.length, 1);
  assert.equal(failed[0].value, "Ur");
});

test("an HTTP error is a failed term, not an exception", async () => {
  const fetchImpl = (async () => new Response("nope", { status: 500 })) as unknown as typeof fetch;
  const { candidates, failed } = await suggestPictures({ locationName: "Anywhere" }, fetchImpl);
  assert.deepEqual(candidates, []);
  assert.equal(failed.length, 1);
});

test("a record with nothing to search on does not call out at all", async () => {
  let calls = 0;
  const fetchImpl = (async () => { calls++; return new Response("{}", { status: 200 }); }) as unknown as typeof fetch;
  const { candidates, searched } = await suggestPictures({ title: "the of and" }, fetchImpl);
  assert.equal(calls, 0, "searched Commons with nothing to search for");
  assert.deepEqual(candidates, []);
  assert.deepEqual(searched, []);
});
