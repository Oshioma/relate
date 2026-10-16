import { test } from "node:test";
import assert from "node:assert/strict";

import { pictureName } from "./bring-in-image";
import {
  fieldsEditedByAPerson,
  isSeededCopy,
  isTopUpOnly,
  reconcileEventText,
  reconcileSeededPictures,
} from "./reconcile-seeded-event";
import { SET_SUTEKH_EVENTS } from "./set-sutekh-seed";
import { OKOMILO_EVENTS } from "./okomilo-avhianwu-benin-seed";

const STORAGE = "https://example.supabase.co/storage/v1/object/public/uploads/user-1/timeline";
const SLUG = "plutarch-on-isis-and-osiris";

/** Where the seeder would have stored a copy of this seed picture. */
const copyOf = (slug: string, seedUrl: string) => `${STORAGE}/${pictureName(slug, seedUrl)}.jpg`;

/** A stored picture as the seeder writes it: the seed's details, our address, credit resolved. */
function stored(slug: string, item: { url: string; creditFrom?: string; [key: string]: unknown }) {
  const { url, creditFrom, ...rest } = item;
  return { ...rest, url: copyOf(slug, url), ...(creditFrom === "source" ? { credit: "Somebody, CC BY" } : {}) };
}

// ---------------------------------------------------------------------------
// WHICH PICTURES THE SEEDER PUT THERE
// ---------------------------------------------------------------------------

test("a seeded copy is recognised by its stored path, and nothing else is", () => {
  assert.equal(isSeededCopy(`${STORAGE}/${SLUG}-4cfc95e9.jpg`, SLUG), true);
  assert.equal(isSeededCopy(`${STORAGE}/${SLUG}-0.png`, SLUG), true, "the older positional names count too");
  assert.equal(isSeededCopy("https://example.supabase.co/storage/v1/object/public/uploads/user-1/3f2a-my-photo.jpg", SLUG), false);
  assert.equal(isSeededCopy("https://upload.wikimedia.org/wikipedia/commons/a/ab/Plutarch.jpg", SLUG), false);
  assert.equal(isSeededCopy(`${STORAGE}/some-other-record-4cfc95e9.jpg`, SLUG), false);
  assert.equal(isSeededCopy(`${STORAGE}/${SLUG}-extra-4cfc95e9.jpg`, SLUG), false);
  assert.equal(isSeededCopy(null, SLUG), false);
});

// ---------------------------------------------------------------------------
// TELLING THE OLD TOP-UP APART FROM A PERSON
// ---------------------------------------------------------------------------

const pdf = { url: `${STORAGE}/${SLUG}-4cfc95e9.jpg`, caption: "Digitised 1691 volume" };
const fuseli = { url: `${STORAGE}/${SLUG}-839bb764.jpg`, caption: "Henry Fuseli drawing" };

test("appending seeded copies and labelling what they show is the top-up, not a person", () => {
  assert.equal(isTopUpOnly([pdf], [pdf, fuseli], SLUG), true);
  assert.equal(isTopUpOnly([pdf], [{ ...pdf, shows: "manuscript" }], SLUG), true);
  assert.equal(isTopUpOnly(null, [fuseli], SLUG), true);
});

test("a top-up that listed the same stored file a second time is still the top-up", () => {
  // Nabta Playa as one community holds it: the old top-up appended a second
  // caption for a file the record already had, then a new picture. Matching by
  // address alone compared the first listing with its twin and called it a
  // person's edit, so the duplicate could never be cleared.
  const slug = "nabta-playa-megaliths";
  const circle = { url: `${STORAGE}/${slug}-8dfcf217.jpg`, caption: "The stone circle in the museum" };
  const twin = { url: circle.url, caption: "The megaliths in the museum" };
  const calendar = { url: `${STORAGE}/${slug}-73960d66.jpg`, caption: "The calendar circle" };
  assert.equal(isTopUpOnly([circle], [circle, twin, calendar], slug), true);
  // A caption change on the existing listing is still a person.
  assert.equal(isTopUpOnly([circle], [{ ...circle, caption: "Mine" }, calendar], slug), false);
});

test("removing, recaptioning or uploading a picture is a person", () => {
  assert.equal(isTopUpOnly([pdf, fuseli], [fuseli], SLUG), false, "a removal");
  assert.equal(isTopUpOnly([pdf], [{ ...pdf, caption: "My better caption" }], SLUG), false, "a new caption");
  assert.equal(isTopUpOnly([pdf], [pdf, { url: "https://example.supabase.co/x/uploads/u/abc-photo.jpg" }], SLUG), false);
  assert.equal(isTopUpOnly([{ ...pdf, shows: "artefact" }], [{ ...pdf, shows: "manuscript" }], SLUG), false, "a relabel");
});

test("only a person's edits count, field by field", () => {
  const edited = fieldsEditedByAPerson(
    [
      // Written outside the app — the maintenance fixes. Not a person.
      { actor_id: null, changes: { description: { from: "a", to: "b" } } },
      // The refresh, carrying its marker.
      { actor_id: "u1", changes: { summary: { from: "a", to: "b" }, seed_synced_at: { from: null, to: "now" } } },
      // The old top-up, before the marker existed.
      { actor_id: "u1", changes: { media: { from: [pdf], to: [pdf, fuseli] }, image_url: { from: null, to: fuseli.url } } },
      // A person.
      { actor_id: "u2", changes: { title: { from: "a", to: "b" } } },
    ],
    SLUG
  );
  assert.deepEqual([...edited], ["title"]);
});

test("a person choosing a different cover is an edit of the cover", () => {
  const edited = fieldsEditedByAPerson(
    [{ actor_id: "u2", changes: { image_url: { from: pdf.url, to: fuseli.url } } }],
    SLUG
  );
  assert.ok(edited.has("image_url"));
});

// ---------------------------------------------------------------------------
// TEXT
// ---------------------------------------------------------------------------

test("text follows the seed except where a person has written over it", () => {
  const { patch, kept } = reconcileEventText(
    { title: "Old title", summary: "Same", description: "Their own words" },
    { title: "New title", summary: "Same", description: "The seed's new words" },
    new Set(["description"])
  );
  assert.deepEqual(patch, { title: "New title" });
  assert.deepEqual(kept, ["description"]);
});

// ---------------------------------------------------------------------------
// PICTURES — THE CASES #591 LEFT BEHIND
// ---------------------------------------------------------------------------

test("a picture the seed replaced is removed, and the cover moves to the one that replaced it", () => {
  const seed = SET_SUTEKH_EVENTS.find((event) => event.slug === SLUG)!;
  const fuseliSeed = seed.media![0];
  const oldPdf = {
    url: `${STORAGE}/${SLUG}-4cfc95e9.jpg`,
    caption: "Digitised 1691 volume of Plutarch's Moralia",
    fileName: "Plutarch's morals- ... 1691- Vol 5.pdf",
  };
  const result = reconcileSeededPictures({
    slug: SLUG,
    stored: { image_url: oldPdf.url, media: [oldPdf, stored(SLUG, fuseliSeed)] },
    seed,
  });
  assert.equal(result.removed, 1);
  assert.equal(result.media.length, 1);
  assert.equal(result.media[0].caption, fuseliSeed.caption);
  // This dataset names no cover, so a cover that was a dropped copy is cleared
  // rather than left pointing at a picture the record no longer has.
  assert.equal(result.image_url, null);

  // Where the seed does name a cover, the cover moves to it.
  const withCover = reconcileSeededPictures({
    slug: SLUG,
    stored: { image_url: oldPdf.url, media: [oldPdf, stored(SLUG, fuseliSeed)] },
    seed: { ...seed, imageUrl: fuseliSeed.url },
  });
  assert.equal(withCover.image_url, copyOf(SLUG, fuseliSeed.url));
});

test("a corrected accession number reaches the stored picture, which keeps its address and credit", () => {
  const slug = "set-survives-in-the-oases";
  const seed = SET_SUTEKH_EVENTS.find((event) => event.slug === slug)!;
  const hibis = seed.media!.find((item) => item.accessionNumber === "48.105.6")!;
  const old = { ...stored(slug, hibis), accessionNumber: "48.105.5" };
  const others = seed.media!.filter((item) => item !== hibis).map((item) => stored(slug, item));
  const result = reconcileSeededPictures({
    slug,
    stored: { image_url: null, media: [...others, old] },
    seed,
  });
  const fixed = result.media.find((item) => item.url === old.url)!;
  assert.equal(fixed.accessionNumber, "48.105.6");
  assert.equal(fixed.credit, old.credit);
  assert.equal(result.corrected, 1);
  assert.equal(result.removed, 0);
});

test("pictures nobody can show the seeder put there are never touched", () => {
  const seed = SET_SUTEKH_EVENTS.find((event) => event.slug === SLUG)!;
  const theirs = { url: "https://example.supabase.co/storage/v1/object/public/uploads/u2/9b1c-photo.jpg", caption: "Mine" };
  const hotlinked = { url: "https://upload.wikimedia.org/wikipedia/commons/x/xy/Something.jpg", caption: "Pasted" };
  const result = reconcileSeededPictures({
    slug: SLUG,
    stored: { image_url: theirs.url, media: [theirs, stored(SLUG, seed.media![0]), hotlinked] },
    seed,
  });
  assert.equal(result.removed, 0);
  assert.deepEqual(result.media[0], theirs);
  assert.deepEqual(result.media[2], hotlinked);
  assert.equal(result.image_url, theirs.url, "a cover a person chose stays");
});

test("the same seeded picture stored twice is kept once", () => {
  const seed = SET_SUTEKH_EVENTS.find((event) => event.slug === SLUG)!;
  const copy = stored(SLUG, seed.media![0]);
  const legacy = { ...copy, url: `${STORAGE}/${SLUG}-0.jpg` };
  const result = reconcileSeededPictures({ slug: SLUG, stored: { image_url: null, media: [copy, legacy] }, seed });
  assert.equal(result.media.length, 1);
  assert.equal(result.removed, 1);
});

test("where an old positional copy and a source-named copy are the same picture, the source-named one is kept", () => {
  // The Battle of Cannae as one community holds it: the diagram stored twice,
  // once under the old positional name (which a later top-up could overwrite
  // with a different photograph) and once under the name of its source.
  const slug = "battle-of-cannae";
  const url = "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_cannae_destruction.png?width=1024";
  const caption = "The double envelopment at Cannae.";
  const seed = { imageUrl: url, media: [{ url, caption, kind: "image" }] };
  const legacy = { url: `${STORAGE}/${slug}-1.png`, caption, kind: "image" };
  const named = { url: copyOf(slug, url), caption: "An older caption for the same diagram.", kind: "image" };
  const result = reconcileSeededPictures({ slug, stored: { image_url: legacy.url, media: [legacy, named] }, seed });
  assert.deepEqual(result.media.map((item) => item.url), [named.url]);
  assert.equal(result.media[0].caption, caption, "and it takes the seed's caption");
  assert.equal(result.image_url, named.url, "the cover follows it");
});

// ---------------------------------------------------------------------------
// A RECORD ALREADY IN LINE IS LEFT EXACTLY AS IT IS
//
// Run against every real record: a community holding a faithful copy must see
// nothing change, or the button reports work on every press for ever — the bug
// reconcile-claims.ts was written to end.
// ---------------------------------------------------------------------------

test("every seeded record already in line reconciles to no change", () => {
  for (const event of [...SET_SUTEKH_EVENTS, ...OKOMILO_EVENTS]) {
    if (!event.media || event.media.length === 0) continue;
    const media = event.media.map((item) => stored(event.slug, item));
    const image_url = event.imageUrl ? copyOf(event.slug, event.imageUrl) : null;
    const result = reconcileSeededPictures({ slug: event.slug, stored: { image_url, media }, seed: event });
    assert.equal(result.changed, false, `${event.slug} should already be in line`);
    assert.deepEqual(result.media, media, event.slug);
  }
});
