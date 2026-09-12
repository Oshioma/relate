import { test } from "node:test";
import assert from "node:assert/strict";

import { PICTURE_SOURCES, creditFor, pictureSourceFor, termsUrlFor } from "./picture-sources";
import { resolveCredits } from "./bring-in-image";

// ---------------------------------------------------------------------------
// WHERE A PICTURE MAY COME FROM
//
// The one rule: a source is allowed only if it publishes, in one place, the
// terms its images may be used on — and every caption ends by pointing there.
// Not a licence this codebase asserts on the source's behalf, which nobody
// here could stand behind, but the source's own statement.
// ---------------------------------------------------------------------------

test("the allowed sources are recognised by host, including subdomains", () => {
  assert.equal(pictureSourceFor("https://commons.wikimedia.org/wiki/Special:FilePath/X.jpg")?.key, "commons");
  assert.equal(pictureSourceFor("https://upload.wikimedia.org/wikipedia/commons/a/ab/X.jpg")?.key, "commons");
  assert.equal(pictureSourceFor("https://images-assets.nasa.gov/image/x/x~large.jpg")?.key, "nasa");
  assert.equal(pictureSourceFor("https://www.usgs.gov/media/images/x")?.key, "usgs");
  assert.equal(pictureSourceFor("https://ids.si.edu/ids/deliveryService?id=x")?.key, "si");
});

test("everywhere else is refused, and refused is the default", () => {
  // This is the part that has to hold. A picture being on the internet says
  // nothing about whether it may be used, and the list is the whole guarantee.
  for (const raw of [
    "https://example.com/photo.jpg",
    "https://images.google.com/x.jpg",
    "https://i.imgur.com/x.jpg",
    "https://www.gettyimages.com/x.jpg",
    "https://someblog.wordpress.com/x.jpg",
    // A host that merely CONTAINS an allowed name must not pass.
    "https://nasa.gov.evil.example/x.jpg",
    "https://notnasa.gov/x.jpg",
    "https://fakecommons.wikimedia.org.attacker.net/x.jpg",
    "not a url",
  ]) {
    assert.equal(pictureSourceFor(raw), null, `${raw} must not be an allowed source`);
    assert.equal(termsUrlFor(raw), null, `${raw} must have no terms to point at`);
  }
});

test("every listed source states where its terms are", () => {
  for (const source of PICTURE_SOURCES) {
    assert.ok(source.name.length > 0, `${source.key} needs a name`);
    assert.ok(source.hosts.length > 0, `${source.key} needs hosts`);
    if (typeof source.terms === "string") {
      assert.match(source.terms, /^https:\/\//, `${source.key} terms must be a URL`);
    }
  }
});

test("a blanket licence is only claimed where one genuinely covers the collection", () => {
  // NASA's own policy has exceptions — partner-agency material, identifiable
  // people — and a museum's open-access release covers the images IN it, not
  // everything the institution serves. Rounding either up to "public domain"
  // is the one part of a caption that could be wrong in a way that matters.
  for (const source of PICTURE_SOURCES) {
    if (source.key === "commons") continue;
    assert.equal(source.generally, null, `${source.key} must not assert a blanket licence`);
  }
});

/** A stand-in for the Commons API. */
function commonsStub(extmetadata: Record<string, { value: string }> | null) {
  return (async () =>
    ({
      ok: true,
      json: async () => ({
        query: { pages: { "1": extmetadata === null ? { missing: "" } : { imageinfo: [{ extmetadata }] } } },
      }),
    }) as unknown as Response) as unknown as typeof fetch;
}

test("Commons is asked outright, because it can answer outright", () => {
  // No reason to send a reader to a page for something we can simply tell them.
  return creditFor(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Scablands.jpg?width=1024",
    commonsStub({ Artist: { value: "<a>Someone</a>" }, LicenseShortName: { value: "CC BY-SA 4.0" } })
  ).then((credit) => {
    assert.ok(credit);
    assert.equal(credit.exact, true);
    assert.equal(credit.credit, "Someone, CC BY-SA 4.0, via Wikimedia Commons");
  });
});

test("when Commons does not answer, the picture is still attached and the caption says where to look", async () => {
  // Commons hosts freely-licensed files and only freely-licensed files, so a
  // missing metadata field there is a missing FIELD, not a missing licence —
  // and a link to the material is a recognised way to attribute it.
  const credit = await creditFor(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Scablands.jpg?width=1024",
    commonsStub(null)
  );
  assert.ok(credit);
  assert.equal(credit.exact, false);
  assert.match(credit.credit, /file page/i);
  assert.match(credit.credit, /https:\/\/commons\.wikimedia\.org\/wiki\/File:Scablands\.jpg/);
  // And it must not have invented terms in the process.
  assert.doesNotMatch(credit.credit, /public domain|CC0|CC BY/i);
});

test("another listed source gets a pointer to its own terms, not a guess at them", async () => {
  const credit = await creditFor("https://images-assets.nasa.gov/image/PIA12345/PIA12345~large.jpg");
  assert.ok(credit);
  assert.equal(credit.exact, false);
  assert.match(credit.credit, /Via NASA/);
  assert.match(credit.credit, /^.*https:\/\/www\.nasa\.gov\//);
  assert.doesNotMatch(credit.credit, /public domain/i);
});

test("an unlisted source yields no credit at all", async () => {
  assert.equal(await creditFor("https://example.com/photo.jpg"), null);
});

// ---------------------------------------------------------------------------
// Finishing the caption
// ---------------------------------------------------------------------------

test("a seeded caption is finished at seed time, not written from memory", async () => {
  const { media, dropped } = await resolveCredits(
    {
      imageUrl: null,
      media: [
        {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Scablands.jpg?width=1024",
          caption: "Channelled scabland, eastern Washington",
          shows: "photograph",
          creditFrom: "source",
        },
      ],
    },
    commonsStub({ Artist: { value: "Someone" }, LicenseShortName: { value: "CC BY-SA 4.0" } })
  );
  assert.equal(dropped.length, 0);
  // The caption stays a caption — it is also the alt text, so the licence must
  // not end up inside it.
  assert.equal(media[0].caption, "Channelled scabland, eastern Washington");
  assert.equal(media[0].credit, "Someone, CC BY-SA 4.0, via Wikimedia Commons");
  // shows must survive — a picture that stops declaring what it is a picture
  // OF reads as a photograph of the event, which is the most persuasive kind
  // of wrong a record can be.
  assert.equal(media[0].shows, "photograph");
  // And the instruction does not get stored on the event.
  assert.equal("creditFrom" in media[0], false);
});

test("a hand-written caption is left exactly as it was", async () => {
  // The existing Hannibal captions carry credits checked by hand, one at a
  // time. Appending a second credit to them would be the obvious way to break
  // this on the way in.
  const original = {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Mommsen_p265.jpg?width=1024",
    caption: "The marble bust from Capua. Public domain, via Wikimedia Commons.",
    shows: "artefact",
  };
  const { media } = await resolveCredits({ imageUrl: null, media: [original] }, commonsStub(null));
  assert.deepEqual(media[0], original);
});

test("a picture from nowhere establishable is dropped, not shown bare", async () => {
  const { media, dropped } = await resolveCredits({
    imageUrl: null,
    media: [{ url: "https://example.com/photo.jpg", caption: "Something", creditFrom: "source" }],
  });
  assert.equal(media.length, 0);
  assert.deepEqual(dropped, ["https://example.com/photo.jpg"]);
});

test("a picture whose credit could not be fetched still gets one, pointing at the file page", async () => {
  const { media, dropped } = await resolveCredits(
    {
      imageUrl: null,
      media: [
        {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Scablands.jpg?width=1024",
          caption: "Channelled scabland",
          shows: "evidence_photograph",
          creditFrom: "source",
        },
      ],
    },
    commonsStub(null)
  );
  assert.equal(dropped.length, 0);
  assert.equal(media[0].caption, "Channelled scabland");
  assert.match(media[0].credit ?? "", /file page/i);
  assert.ok((media[0].credit ?? "").endsWith("File:Scablands.jpg"), media[0].credit);
});
