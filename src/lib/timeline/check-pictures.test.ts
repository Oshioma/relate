import { test } from "node:test";
import assert from "node:assert/strict";

import {
  checkOnePicture,
  checkPictures,
  commonsFileName,
  fetchCommonsAttribution,
  isFetchableWebUrl,
} from "./check-pictures";
import { MEDIA_KINDS, mediaKindHint, mediaKindLabel, mediaKindNeedsWarning } from "./taxonomy";
import { HANNIBAL_EVENTS } from "./hannibal-seed";
import { SHOWCASE_EVENT } from "./showcase-event";

// The guard is the important half of this feature. Everything else reports a
// broken image; a hole here lets a member make the server talk to things the
// internet cannot reach.

test("the guard refuses anything that is not a web address", () => {
  for (const raw of [
    "file:///etc/passwd",
    "data:image/png;base64,AAAA",
    "gopher://example.com/",
    "javascript:alert(1)",
    "not a url at all",
  ]) {
    const verdict = isFetchableWebUrl(raw);
    assert.equal(verdict.ok, false, `${raw} should be refused`);
  }
});

test("the guard refuses this machine and the private ranges", () => {
  const refused = [
    "http://localhost/x.png",
    "http://127.0.0.1/x.png",
    "http://127.1.2.3/x.png",
    "http://0.0.0.0/x.png",
    "http://10.0.0.5/x.png",
    "http://172.16.4.4/x.png",
    "http://172.31.255.1/x.png",
    "http://192.168.1.1/x.png",
    "http://100.64.0.1/x.png",
    "http://[::1]/x.png",
    "http://[fd00::1]/x.png",
    "http://[fe80::1]/x.png",
    "http://box.local/x.png",
    "http://admin.internal/x.png",
  ];
  for (const raw of refused) {
    assert.equal(isFetchableWebUrl(raw).ok, false, `${raw} should be refused`);
  }
});

test("the guard refuses the cloud metadata address specifically", () => {
  // 169.254.169.254 is the one worth naming: it answers with credentials on
  // most cloud providers and needs no authentication.
  assert.equal(isFetchableWebUrl("http://169.254.169.254/latest/meta-data/").ok, false);
  // And the rest of the link-local range with it, since the address is not magic.
  assert.equal(isFetchableWebUrl("http://169.254.1.1/x.png").ok, false);
  // IPv4-mapped IPv6 would otherwise smuggle any of the above through.
  assert.equal(isFetchableWebUrl("http://[::ffff:127.0.0.1]/x.png").ok, false);
});

test("the guard allows ordinary public image URLs", () => {
  for (const raw of [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Example.jpg?width=1024",
    "https://upload.wikimedia.org/wikipedia/commons/1/2/Example.jpg",
    "http://example.org/picture.png",
  ]) {
    assert.equal(isFetchableWebUrl(raw).ok, true, `${raw} should be allowed`);
  }
});

// ---------------------------------------------------------------------------
// What each answer means
// ---------------------------------------------------------------------------

const respond = (status: number, contentType?: string) =>
  new Response(null, { status, headers: contentType ? { "content-type": contentType } : undefined });

test("a healthy image is reported healthy", async () => {
  const result = await checkOnePicture("https://example.org/a.jpg", async () => respond(200, "image/jpeg"));
  assert.equal(result.outcome, "ok");
});

test("an error page served with status 200 is not an image", async () => {
  // THIS IS THE CASE A STATUS CHECK ALONE MISSES, and it is the common one: a
  // renamed Wikimedia file answers 200 with HTML, which an <img> renders as a
  // broken icon.
  const result = await checkOnePicture("https://example.org/gone.jpg", async () => respond(200, "text/html"));
  assert.equal(result.outcome, "not-an-image");
  assert.match(result.detail, /text\/html/);
});

test("a missing picture is reported missing", async () => {
  const result = await checkOnePicture("https://example.org/x.jpg", async () => respond(404));
  assert.equal(result.outcome, "missing");
});

test("a redirect is reported and NOT followed", async () => {
  // A public URL redirecting to an internal one is the standard way past a
  // guard like this, so the destination is never fetched.
  let calls = 0;
  const result = await checkOnePicture("https://example.org/x.jpg", async () => {
    calls++;
    return respond(302, "text/html");
  });
  assert.equal(result.outcome, "redirected");
  assert.equal(calls, 1, "the destination must not be fetched");
  assert.match(result.detail, /not followed/i);
});

test("a host that refuses HEAD is retried with GET", async () => {
  const methods: string[] = [];
  const result = await checkOnePicture("https://example.org/x.jpg", async (_input, init) => {
    methods.push(String(init?.method));
    return methods.length === 1 ? respond(403) : respond(200, "image/png");
  });
  assert.deepEqual(methods, ["HEAD", "GET"]);
  assert.equal(result.outcome, "ok");
});

test("a blocked URL is never fetched at all", async () => {
  let calls = 0;
  const result = await checkOnePicture("http://169.254.169.254/latest/", async () => {
    calls++;
    return respond(200, "image/png");
  });
  assert.equal(result.outcome, "blocked");
  assert.equal(calls, 0, "the guard must run before the request, not after");
});

test("an unreachable host is reported rather than thrown", async () => {
  const result = await checkOnePicture("https://example.org/x.jpg", async () => {
    throw new Error("getaddrinfo ENOTFOUND");
  });
  assert.equal(result.outcome, "unreachable");
  assert.match(result.detail, /ENOTFOUND/);
});

test("the same URL is fetched once however many records use it", async () => {
  // Every seeded record lists its cover image in media as well, so a naive
  // pass would ask for each picture twice.
  let calls = 0;
  const results = await checkPictures(
    [
      { slug: "a", title: "A", image_url: "https://example.org/same.jpg", media: [{ url: "https://example.org/same.jpg" }] },
      { slug: "b", title: "B", image_url: null, media: [{ url: "https://example.org/same.jpg" }] },
    ],
    {
      fetchImpl: async () => {
        calls++;
        return respond(200, "image/jpeg");
      },
    }
  );
  assert.equal(results.length, 3, "every attachment is reported");
  assert.equal(calls, 1, "but the URL is only asked once");
  assert.ok(results.every((result) => result.outcome === "ok"));
});

test("a report names the record, not just the URL", async () => {
  const results = await checkPictures(
    [{ slug: "bonneville-flood", title: "The Bonneville flood", image_url: "https://example.org/x.jpg", media: [] }],
    { fetchImpl: async () => respond(404) }
  );
  assert.equal(results[0].slug, "bonneville-flood");
  assert.equal(results[0].title, "The Bonneville flood");
  assert.equal(results[0].where, "cover");
  assert.equal(results[0].outcome, "missing");
});

// ---------------------------------------------------------------------------
// What kind of picture it is
// ---------------------------------------------------------------------------

test("every picture kind has a label and a hint that says what it is evidence of", () => {
  for (const kind of MEDIA_KINDS) {
    assert.ok(mediaKindLabel(kind.key), `${kind.key} has no label`);
    assert.ok(mediaKindHint(kind.key).length > 40, `${kind.key} has no real hint`);
  }
});

test("the two kinds mistaken for evidence are the two that get warned about", () => {
  // A later artwork and a reconstruction are the ones that illustrate a
  // tradition and read as a photograph of it.
  assert.equal(mediaKindNeedsWarning("later_artwork"), true);
  assert.equal(mediaKindNeedsWarning("reconstruction"), true);
  for (const kind of MEDIA_KINDS) {
    if (kind.key === "later_artwork" || kind.key === "reconstruction") continue;
    assert.equal(mediaKindNeedsWarning(kind.key), false, `${kind.key} should not warn`);
  }
  // And their hints say so in as many words.
  assert.match(mediaKindHint("later_artwork"), /never evidence/i);
  assert.match(mediaKindHint("reconstruction"), /inference/i);
});

test("every seeded picture says what it is a picture of", () => {
  // A later artwork that does not declare itself reads as a photograph of the
  // event, which is the most persuasive kind of wrong a record can be. The
  // Turner and the Leutemann woodcut are the cases this exists for.
  const keys = new Set<string>(MEDIA_KINDS.map((kind) => kind.key));
  const withMedia = [...HANNIBAL_EVENTS, { ...SHOWCASE_EVENT, claims: [] }] as { slug: string; media?: { shows?: string }[] }[];
  let declared = 0;
  for (const event of withMedia) {
    for (const item of event.media ?? []) {
      assert.ok(item.shows, `${event.slug}: a picture does not say what it shows`);
      assert.ok(keys.has(item.shows), `${event.slug}: unknown picture kind "${item.shows}"`);
      declared++;
    }
  }
  assert.ok(declared >= 8, `expected the seeded pictures to be classified, found ${declared}`);
});

test("the paintings are classified as paintings", () => {
  // Turner's storm and Leutemann's woodcut are the two that most look like
  // records of the crossing and are neither.
  const turner = HANNIBAL_EVENTS.flatMap((event) => event.media ?? []).find((item) =>
    /Turner/.test(item.caption ?? "")
  );
  assert.ok(turner);
  assert.equal(turner.shows, "later_artwork");
  assert.equal(mediaKindNeedsWarning(turner.shows), true);

  const cannae = HANNIBAL_EVENTS.flatMap((event) => event.media ?? []).find((item) =>
    /double envelopment/.test(item.caption ?? "")
  );
  assert.ok(cannae);
  assert.equal(cannae.shows, "reconstruction");
});

test("an unknown kind degrades to a readable label rather than breaking", () => {
  assert.equal(mediaKindLabel(null), null);
  assert.equal(mediaKindLabel("some_new_kind"), "Some new kind");
  assert.equal(mediaKindNeedsWarning("some_new_kind"), false);
});

// ---------------------------------------------------------------------------
// WHO MADE THE PICTURE
//
// Attribution is a licence condition, not a courtesy. CC BY-SA says name the
// author; a photograph used without that credit is used in breach of the
// licence it was offered under. So the rule these tests protect is: if we
// cannot establish who made a picture and under what terms, we do not use the
// picture. Failing closed costs us an image. Failing open costs somebody else
// their credit.
// ---------------------------------------------------------------------------

test("a Commons URL yields the file name it actually points at", () => {
  assert.equal(
    commonsFileName("https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Bonneville_map.png"),
    "Lake_Bonneville_map.png"
  );
  // The width parameter is how these are normally written into seed files.
  assert.equal(
    commonsFileName("https://commons.wikimedia.org/wiki/Special:FilePath/Scablands.jpg?width=1024"),
    "Scablands.jpg"
  );
  // Percent-encoding comes back decoded, because that is what the API wants.
  assert.equal(
    commonsFileName("https://commons.wikimedia.org/wiki/Special:FilePath/Gilgamesh%20tablet.jpg"),
    "Gilgamesh tablet.jpg"
  );
  // The direct upload form, and its thumbnail variant — whose final segment is
  // a resized copy, so the file name has to come from the segment before it.
  assert.equal(
    commonsFileName("https://upload.wikimedia.org/wikipedia/commons/a/ab/Deluge_tablet.jpg"),
    "Deluge_tablet.jpg"
  );
  assert.equal(
    commonsFileName(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Deluge_tablet.jpg/800px-Deluge_tablet.jpg"
    ),
    "Deluge_tablet.jpg"
  );
});

test("a URL that is not a Commons file is not guessed at", () => {
  for (const raw of [
    "https://example.com/wiki/Special:FilePath/Faked.jpg",
    "https://commons.wikimedia.org/wiki/Main_Page",
    "https://en.wikipedia.org/wiki/Flood_myth",
    "not a url",
  ]) {
    assert.equal(commonsFileName(raw), null, `${raw} should not resolve to a file name`);
  }
});

/** A stand-in for the Commons API that answers with whatever metadata a test needs. */
function commonsStub(extmetadata: Record<string, { value: string }> | null, ok = true) {
  return (async () =>
    ({
      ok,
      json: async () => ({
        query: {
          pages: {
            "123":
              extmetadata === null
                ? { missing: "" }
                : { imageinfo: [{ extmetadata }] },
          },
        },
      }),
    }) as unknown as Response) as unknown as typeof fetch;
}

test("attribution comes back as a credit line a caption can print", async () => {
  const attribution = await fetchCommonsAttribution(
    "Scablands.jpg",
    commonsStub({
      // Commons returns this field as markup, almost always a link.
      Artist: { value: '<a href="//commons.wikimedia.org/wiki/User:Someone" title="User:Someone">Someone</a>' },
      LicenseShortName: { value: "CC BY-SA 4.0" },
    })
  );
  assert.ok(attribution);
  assert.equal(attribution.artist, "Someone");
  assert.equal(attribution.licence, "CC BY-SA 4.0");
  assert.equal(attribution.credit, "Someone, CC BY-SA 4.0, via Wikimedia Commons");
});

test("a public-domain file with no named author still carries its licence", async () => {
  // Plenty of genuinely usable files have no author — a 19th-century map, a
  // government survey. The licence is the part that has to be there.
  const attribution = await fetchCommonsAttribution(
    "Old_map.jpg",
    commonsStub({ LicenseShortName: { value: "Public domain" } })
  );
  assert.ok(attribution);
  assert.equal(attribution.artist, null);
  assert.equal(attribution.credit, "Public domain, via Wikimedia Commons");
});

test("no author AND no licence means no picture", async () => {
  // This is the fail-closed rule, and it is the whole point of the function.
  assert.equal(await fetchCommonsAttribution("Mystery.jpg", commonsStub({})), null);
  // A file that is not there at all.
  assert.equal(await fetchCommonsAttribution("Absent.jpg", commonsStub(null)), null);
  // An API that errors, which must not read as "nothing to attribute".
  assert.equal(
    await fetchCommonsAttribution("Scablands.jpg", commonsStub({ LicenseShortName: { value: "CC0" } }, false)),
    null
  );
  // A network failure, likewise.
  const throwing = (async () => {
    throw new Error("offline");
  }) as unknown as typeof fetch;
  assert.equal(await fetchCommonsAttribution("Scablands.jpg", throwing), null);
});

test("the credit line is readable text, not the markup Commons stores", async () => {
  const attribution = await fetchCommonsAttribution(
    "Tablet.jpg",
    commonsStub({
      Artist: {
        value:
          '<span class="fn"><a href="//example.org">Bob &amp; Co.</a></span>\n  <i>photographer</i>',
      },
      LicenseShortName: { value: "CC BY 2.0" },
    })
  );
  assert.ok(attribution);
  assert.equal(attribution.artist, "Bob & Co. photographer");
  // No tags and no runs of whitespace left in it. An ampersand IS allowed to
  // survive — "Bob & Co." is somebody's actual name, and a credit line that
  // dropped it would be crediting the wrong person; what must not survive is
  // the entity reference it arrived as.
  assert.doesNotMatch(attribution.credit, /[<>]|\s\s/);
  assert.doesNotMatch(attribution.credit, /&(?:amp|quot|nbsp|lt|gt|#\d+);/);
});
