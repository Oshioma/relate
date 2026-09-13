import { test } from "node:test";
import assert from "node:assert/strict";

import { picturesMissingFrom, pictureName } from "./bring-in-image";
import { ANCIENT_SITES_EVENTS } from "./ancient-sites-seed";

// ---------------------------------------------------------------------------
// TOPPING UP AN EVENT THAT IS ALREADY THERE.
//
// Seeding skips an event a community already has, which is right — they may
// have edited it. The cost was that pictures added to a seed AFTERWARDS never
// reached anybody who took the dataset early. Göbekli Tepe carries four
// pictures and communities were showing one.
//
// The two rules this has to keep, in order of how bad it is to break them:
//
//   1. NEVER TOUCH WHAT THE COMMUNITY PUT THERE. Not replaced, not reordered,
//      not counted as covering a seeded picture.
//   2. NEVER ADD THE SAME PICTURE TWICE, however many times it is run.
// ---------------------------------------------------------------------------

const seeded = (caption: string) => ({ caption, url: `https://commons.example/${caption.slice(0, 8)}.jpg` });

test("an event with no pictures is missing all of them", () => {
  const seed = [seeded("A carved pillar"), seeded("The main excavation area")];
  assert.deepEqual(picturesMissingFrom([], seed), seed);
});

test("an event with all of them is missing none", () => {
  const seed = [seeded("A carved pillar"), seeded("The main excavation area")];
  const have = seed.map((item) => ({ caption: item.caption, url: "https://ours.example/stored-1.jpg" }));
  assert.deepEqual(picturesMissingFrom(have, seed), []);
});

test("an event seeded when there was one picture gets the rest", () => {
  // The reported case, in miniature.
  const seed = [seeded("Building D"), seeded("A pillar with a fox"), seeded("The excavation area"), seeded("A replica")];
  const have = [{ caption: "Building D", url: "https://ours.example/stored-1.jpg" }];
  const missing = picturesMissingFrom(have, seed);
  assert.equal(missing.length, 3);
  assert.deepEqual(missing.map((item) => item.caption), ["A pillar with a fox", "The excavation area", "A replica"]);
});

test("a picture the community added is never matched and never counted", () => {
  // RULE ONE. Their caption belongs to no seed, so it must not satisfy a seeded
  // picture — otherwise adding a photograph of your own would silently stop a
  // seeded one ever arriving.
  const seed = [seeded("Building D"), seeded("A pillar with a fox")];
  const have = [{ caption: "Our trip to the site, 2024", url: "https://ours.example/theirs.jpg" }];
  const missing = picturesMissingFrom(have, seed);
  assert.equal(missing.length, 2, "the community's own picture was counted as covering a seeded one");
});

test("running it twice adds nothing the second time", () => {
  // RULE TWO. The caller appends what comes back, so a second run that returned
  // anything already present would duplicate pictures on every seeding.
  const seed = [seeded("Building D"), seeded("A pillar with a fox")];
  let have: { caption?: string | null; url: string }[] = [];
  for (const round of [1, 2, 3]) {
    const missing = picturesMissingFrom(have, seed);
    have = [...have, ...missing.map((item) => ({ caption: item.caption, url: `https://ours.example/${round}.jpg` }))];
  }
  assert.equal(have.length, seed.length, `ended with ${have.length} pictures for ${seed.length} seeded`);
});

test("a caption that differs only by surrounding space is the same picture", () => {
  const seed = [seeded("Building D")];
  const have = [{ caption: "  Building D  ", url: "https://ours.example/stored.jpg" }];
  assert.deepEqual(picturesMissingFrom(have, seed), []);
});

test("a seeded picture with no caption is left alone rather than added for ever", () => {
  // It cannot be told apart from another one, so adding it would mean adding it
  // again on every run. The caption rule in seeded-pictures.test.ts means this
  // should not arise; being wrong about that should cost nothing.
  const missing = picturesMissingFrom([], [{ caption: "" }, { caption: "A real caption" }]);
  assert.deepEqual(missing.map((item) => item.caption), ["A real caption"]);
});

test("the real Göbekli Tepe record would be topped up from one picture to four", () => {
  // Against the actual seed rather than a fixture, because the bug was reported
  // against the actual seed.
  const event = ANCIENT_SITES_EVENTS.find((candidate) => candidate.slug === "gobekli-tepe-enclosures");
  assert.ok(event, "the Göbekli Tepe record has gone");
  assert.equal((event!.media ?? []).length, 4, "the record no longer carries four pictures");
  const have = [{ caption: event!.media![0].caption, url: "https://ours.example/stored-1.jpg" }];
  assert.equal(picturesMissingFrom(have, event!.media ?? []).length, 3);
});

// ---------------------------------------------------------------------------
// AND THE REASON THE TOP-UP CANNOT QUIETLY DESTROY A PICTURE
// ---------------------------------------------------------------------------

test("a stored picture is named after itself, not after its place in a list", () => {
  // THE TRAP THIS AVOIDS. Storage upserts, and the path used to be
  // "<slug>-<position>". Topping up an event with the two pictures it is
  // missing makes them positions 1 and 2 of THAT list — overwriting the objects
  // the event's existing pictures point at, so those pictures silently become
  // different photographs while the row still looks right.
  const a = "https://commons.example/Building_D.jpg";
  const b = "https://commons.example/Fox_pillar.jpg";

  // Same picture, same name, whether it is first in a full seed or alone in a
  // top-up. That is what makes bringing it in twice cost one object.
  assert.equal(pictureName("gobekli", a), pictureName("gobekli", a));
  // Different pictures can never land on the same object.
  assert.notEqual(pictureName("gobekli", a), pictureName("gobekli", b));
  // The slug is still there to read.
  assert.match(pictureName("gobekli", a), /^gobekli-[0-9a-f]{8}$/);
  // And two events do not share a path for the same picture.
  assert.notEqual(pictureName("gobekli", a), pictureName("karahan", a));
});

test("no two pictures on one seeded record collide in storage", () => {
  // The property that matters across the whole dataset, not just in principle.
  for (const event of ANCIENT_SITES_EVENTS) {
    const names = (event.media ?? []).map((item) => pictureName(event.slug, item.url));
    assert.equal(new Set(names).size, names.length, `${event.slug}: two pictures would share one stored object`);
  }
});

test("a SEED caption with surrounding space still matches its stored twin", () => {
  // The other half of the trim, and the one that bites: the caption is stored
  // exactly as the seed wrote it, so an untrimmed seed caption is stored
  // untrimmed too — and comparing a trimmed stored set against an untrimmed
  // seed string would miss, re-adding that picture on every single run.
  const seed = [{ caption: "  Building D  ", url: "https://commons.example/b.jpg" }];
  const have = [{ caption: "  Building D  ", url: "https://ours.example/stored.jpg" }];
  assert.deepEqual(picturesMissingFrom(have, seed), []);
});

test("bringEventPicturesIn actually stores each picture under its own name", () => {
  // pictureName being right is worth nothing if the caller does not use it, and
  // that gap is exactly where the picture-destroying bug lived. So this runs the
  // real function with a stubbed fetch and a fake store, and looks at the paths
  // it asked for.
  const paths: string[] = [];
  const supabase = {
    storage: {
      from: () => ({
        upload: async (path: string) => {
          paths.push(path);
          return { error: null };
        },
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://ours.example/${path}` } }),
      }),
    },
  };

  const realFetch = globalThis.fetch;
  // A one-pixel PNG is enough: the code only cares that it is an image and not
  // empty.
  const png = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13]);
  globalThis.fetch = (async () =>
    new Response(png, { status: 200, headers: { "content-type": "image/png" } })) as typeof fetch;

  return (async () => {
    try {
      const { bringEventPicturesIn } = await import("./bring-in-image");
      const media = [
        { url: "https://commons.example/Building_D.jpg", caption: "Building D" },
        { url: "https://commons.example/Fox_pillar.jpg", caption: "A pillar with a fox" },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await bringEventPicturesIn(supabase as any, { pictures: { imageUrl: null, media }, userId: "u1", slug: "gobekli" });

      assert.equal(paths.length, 2, `stored ${paths.length} objects for two pictures`);
      assert.equal(new Set(paths).size, 2, `both pictures were written to the same object: ${paths.join(", ")}`);
      for (const path of paths) {
        assert.match(
          path,
          /^u1\/timeline\/gobekli-[0-9a-f]{8}\.png$/,
          `stored at ${path} — a name that is not derived from the picture can collide with another one`
        );
      }
    } finally {
      globalThis.fetch = realFetch;
    }
  })();
});
