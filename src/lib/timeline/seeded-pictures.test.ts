import { test } from "node:test";
import assert from "node:assert/strict";

import { MEDIA_KINDS } from "./taxonomy";
import { pictureSourceFor } from "./picture-sources";
import { isFetchableWebUrl } from "./check-pictures";
import type { SeedEvent } from "./seed-types";
import { FLOOD_PHYSICAL_EVENTS } from "./flood-physical-seed";
import { FLOOD_MESOPOTAMIA_EVENTS } from "./flood-mesopotamia-seed";
import { FLOOD_CHINA_EVENTS } from "./flood-china-seed";
import { FLOOD_EURASIA_EVENTS } from "./flood-eurasia-seed";
import { COSMOLOGY_EVENTS } from "./cosmology-seed";
import { ATLANTIS_EVENTS } from "./atlantis-seed";
import { LEMURIA_EVENTS } from "./lemuria-seed";
import { HANNIBAL_EVENTS } from "./hannibal-seed";
import { DEEP_TIME_EVENTS } from "./deep-time-seed";
import { EARLY_SAPIENS_EVENTS } from "./early-sapiens-seed";

const ALL: SeedEvent[] = [
  ...FLOOD_PHYSICAL_EVENTS,
  ...FLOOD_MESOPOTAMIA_EVENTS,
  ...FLOOD_CHINA_EVENTS,
  ...FLOOD_EURASIA_EVENTS,
  ...COSMOLOGY_EVENTS,
  ...ATLANTIS_EVENTS,
  ...LEMURIA_EVENTS,
  ...HANNIBAL_EVENTS,
  ...DEEP_TIME_EVENTS,
  ...EARLY_SAPIENS_EVENTS,
];

const PICTURES = ALL.flatMap((event) =>
  (event.media ?? []).map((item) => ({ slug: event.slug, item }))
);

const MEDIA_KIND_KEYS = new Set<string>(MEDIA_KINDS.map((kind) => kind.key));

// ---------------------------------------------------------------------------
// WHAT MAY BE SEEDED AS A PICTURE
//
// These are not style rules. Each one is a thing that, done wrong, puts
// something on the page that misleads a reader or breaches somebody's licence
// — and neither shows up as a failure anywhere else, because a picture with a
// wrong caption renders exactly as well as a picture with a right one.
// ---------------------------------------------------------------------------

test("every seeded picture comes from a source whose terms are known", () => {
  // The absence of a general "fetch from anywhere" path is the guarantee, and
  // this is where it is checked against what was actually written down.
  assert.ok(PICTURES.length > 0, "there should be seeded pictures to check");
  for (const { slug, item } of PICTURES) {
    assert.ok(pictureSourceFor(item.url), `${slug}: ${item.url} is from no listed source`);
  }
});

test("every seeded picture address is one the server is allowed to fetch", () => {
  for (const { slug, item } of PICTURES) {
    assert.equal(isFetchableWebUrl(item.url).ok, true, `${slug}: ${item.url} would be refused`);
  }
});

test("every seeded picture says what it is a picture OF", () => {
  // A later artwork or a reconstruction that does not declare itself reads as
  // a photograph of the event, which is the most persuasive kind of wrong a
  // record can be. The Song painting of Yu is the case in point: it is three
  // thousand years after the story and fifteen hundred years after Sima Qian.
  for (const { slug, item } of PICTURES) {
    assert.ok(item.shows, `${slug}: picture does not say what it shows`);
    assert.ok(MEDIA_KIND_KEYS.has(item.shows), `${slug}: "${item.shows}" is not a media kind`);
  }
});

test("every seeded picture has a caption, and the caption is about the picture", () => {
  for (const { slug, item } of PICTURES) {
    assert.ok(item.caption && item.caption.trim().length > 40, `${slug}: caption is missing or too thin`);
  }
});

test("a caption either carries its credit or asks for one — never neither", () => {
  // The two ways are deliberate. The Hannibal captions were checked by hand,
  // one at a time, and say their licence outright. Everything since asks for
  // the credit to be fetched at seed time, because a credit typed into a file
  // is a credit typed from memory. What must not exist is a third case: a
  // picture that arrives on the page with no credit and nothing asking for one.
  for (const { slug, item } of PICTURES) {
    const asks = item.creditFrom === "source";
    const carries = /via Wikimedia Commons|public domain|CC BY|CC0/i.test(item.caption ?? "");
    assert.ok(asks || carries, `${slug}: picture has neither a credit nor creditFrom`);
    // And never both, which would print two credits on one picture.
    assert.ok(!(asks && carries), `${slug}: picture would get a second credit appended`);
  }
});

test("a cover image is always also in the gallery", () => {
  // The cover has no caption of its own, so it has no way to carry a credit.
  // It only works because it is the same file as a gallery picture that does.
  for (const event of ALL) {
    if (!event.imageUrl) continue;
    const urls = (event.media ?? []).map((item) => item.url);
    assert.ok(urls.includes(event.imageUrl), `${event.slug}: cover image is not among its media`);
  }
});

test("no seeded caption states a licence that was not fetched", () => {
  // The failure this prevents: writing "public domain" beside a picture
  // because nothing came back from the API, which is inventing terms rather
  // than reporting them.
  for (const { slug, item } of PICTURES) {
    if (item.creditFrom !== "source") continue;
    assert.doesNotMatch(
      item.caption ?? "",
      /public domain|CC BY|CC0|creative commons/i,
      `${slug}: caption states a licence it did not fetch`
    );
  }
});
