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
import { FLOOD_SUBMERGED_EVENTS } from "./flood-submerged-seed";
import { FLOOD_AMERICAS_EVENTS } from "./flood-americas-seed";
import { FLOOD_REGIONS_EVENTS } from "./flood-regions-seed";
import { ANCIENT_SITES_EVENTS } from "./ancient-sites-seed";
import { EARLY_AUSTRALIA_EVENTS } from "./early-australia-seed";
import { COSMOLOGY_EVENTS } from "./cosmology-seed";
import { ATLANTIS_EVENTS } from "./atlantis-seed";
import { LEMURIA_EVENTS } from "./lemuria-seed";
import { HANNIBAL_EVENTS } from "./hannibal-seed";
import { DEEP_TIME_EVENTS } from "./deep-time-seed";
import { EARLY_SAPIENS_EVENTS } from "./early-sapiens-seed";
import { GIANTS_HEBREW_EVENTS } from "./giants-hebrew-seed";
import { GIANTS_GREEK_EVENTS } from "./giants-greek-seed";
import { GIANTS_MESOPOTAMIA_EVENTS } from "./giants-mesopotamia-seed";
import { ANCIENT_SITES_AMERICAS_EVENTS } from "./ancient-sites-americas-seed";
import { ANCIENT_SITES_ARTEFACTS_EVENTS } from "./ancient-sites-artefacts-seed";
import { ANCIENT_SITES_SUBMERGED_EVENTS } from "./ancient-sites-submerged-seed";
import { ANCIENT_SITES_WORKED_STONE_EVENTS } from "./ancient-sites-worked-stone-seed";
import { ANCIENT_SITES_ACCEPTED_EVENTS } from "./ancient-sites-accepted-surprise-seed";
import { ANCIENT_SITES_EXCAVATED_EVENTS } from "./ancient-sites-excavated-seed";
import { SET_SUTEKH_EVENTS } from "./set-sutekh-seed";
import { BENIN_DEEP_PAST_EVENTS } from "./benin-deep-past-seed";
import { BENIN_DAHOMEY_EVENTS } from "./benin-dahomey-seed";
import { BENIN_VODUN_EVENTS } from "./benin-vodun-seed";
import { BENIN_ATLANTIC_EVENTS } from "./benin-atlantic-seed";
import { PERIODS } from "./period-seed";

const ALL: SeedEvent[] = [
  ...FLOOD_PHYSICAL_EVENTS,
  ...FLOOD_MESOPOTAMIA_EVENTS,
  ...FLOOD_CHINA_EVENTS,
  ...FLOOD_EURASIA_EVENTS,
  ...FLOOD_SUBMERGED_EVENTS,
  ...FLOOD_AMERICAS_EVENTS,
  ...FLOOD_REGIONS_EVENTS,
  ...ANCIENT_SITES_EVENTS,
  ...EARLY_AUSTRALIA_EVENTS,
  ...COSMOLOGY_EVENTS,
  ...ATLANTIS_EVENTS,
  ...LEMURIA_EVENTS,
  ...HANNIBAL_EVENTS,
  ...DEEP_TIME_EVENTS,
  ...EARLY_SAPIENS_EVENTS,
  // EVERY DATASET THAT CARRIES PICTURES HAS TO BE IN THIS LIST, and nothing
  // enforces that but remembering. A dataset left out is not a failing test,
  // it is a set of pictures no rule here ever looks at — which is the quietest
  // way for a wrong caption or an unattributed image to ship.
  ...GIANTS_HEBREW_EVENTS,
  ...GIANTS_GREEK_EVENTS,
  ...GIANTS_MESOPOTAMIA_EVENTS,
  ...ANCIENT_SITES_AMERICAS_EVENTS,
  ...ANCIENT_SITES_ARTEFACTS_EVENTS,
  ...ANCIENT_SITES_SUBMERGED_EVENTS,
  ...ANCIENT_SITES_WORKED_STONE_EVENTS,
  ...ANCIENT_SITES_ACCEPTED_EVENTS,
  ...ANCIENT_SITES_EXCAVATED_EVENTS,
  ...SET_SUTEKH_EVENTS,
  ...BENIN_DEEP_PAST_EVENTS,
  ...BENIN_DAHOMEY_EVENTS,
  ...BENIN_VODUN_EVENTS,
  ...BENIN_ATLANTIC_EVENTS,
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

test("an SVG picture asks its source for a raster, because the copier will not take SVG", () => {
  // bringImageIn chooses the stored extension from the RESPONSE content type,
  // and image/svg+xml is deliberately not in IMAGE_TYPES — an SVG can carry
  // script, so storing one and serving it from our own origin would be an
  // injection route. Commons renders a PNG instead when a width is asked for,
  // which is the only reason the map files here work at all. A seeded .svg
  // without ?width= would be refused at seed time with "sent image/svg+xml,
  // not an image" — visible in the repair report, but every such picture
  // silently absent from the records, which is what this catches first.
  for (const { slug, item } of PICTURES) {
    if (!/\.svgz?(\?|$)/i.test(item.url)) continue;
    assert.match(item.url, /[?&]width=\d+/, `${slug}: ${item.url} is an SVG with no width to rasterise it`);
  }
});

test("no record shows the reader the same picture twice", () => {
  // ELEVEN RECORDS DID. Popol Vuh printed the Ximénez manuscript twice side by
  // side, Cannae printed its one diagram twice, and Hannibal's command in
  // Iberia printed one coin twice because the two entries spelled the same file
  // name differently — "Carthage%2C_quarter_shekel" and
  // "Carthage,_quarter_shekel" — so nothing matched them up.
  //
  // It got in because the top-up matches seeded pictures BY CAPTION, which is
  // right for its own job and blind to this one: a second entry pointing at the
  // same file with a freshly written caption looks like a picture the record
  // has not got. The caption tells you whether a record is missing a seeded
  // picture; only the file name tells you whether two entries are the same
  // photograph.
  //
  // Compared percent-DECODED, because that is the pair that got through.
  for (const event of ALL) {
    const names = (event.media ?? []).map((item) => {
      const file = item.url.split("/").pop()?.split("?")[0] ?? item.url;
      try {
        return decodeURIComponent(file);
      } catch {
        return file;
      }
    });
    const seen = new Set<string>();
    for (const name of names) {
      assert.ok(!seen.has(name), `${event.slug}: ${name} is in the gallery twice`);
      seen.add(name);
    }
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

test("a cover image is the FIRST picture in its gallery", () => {
  // Everything downstream treats position one as the cover: the editor writes
  // the cover back from media[0] on every save, and bringEventPicturesIn drops
  // the cover when its gallery twin is dropped by matching the URL. A seed file
  // that puts the cover second still renders correctly today and then silently
  // swaps which picture is the cover the first time anybody edits the record —
  // which is why "among its media" is not a strong enough rule on its own.
  for (const event of ALL) {
    if (!event.imageUrl) continue;
    const first = (event.media ?? [])[0]?.url;
    assert.equal(first, event.imageUrl, `${event.slug}: cover is not the first picture in the gallery`);
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

// ---------------------------------------------------------------------------
// PERIOD PICTURES
//
// A period is the frame every event is read against, so a picture beside one
// carries a risk an event picture does not: one object printed next to a band
// covering thousands of years and several continents reads as a portrait of
// the whole span. The rules below are the ones that can be checked mechanically.
// ---------------------------------------------------------------------------

const PERIOD_PICTURES = PERIODS.flatMap((period) =>
  (period.media ?? []).map((item) => ({ slug: period.slug, item }))
);

test("period pictures follow the same source and credit rules as event pictures", () => {
  assert.ok(PERIOD_PICTURES.length > 0, "there should be seeded period pictures");
  for (const { slug, item } of PERIOD_PICTURES) {
    assert.ok(pictureSourceFor(item.url), `${slug}: ${item.url} is from no listed source`);
    assert.equal(isFetchableWebUrl(item.url).ok, true, `${slug}: ${item.url} would be refused`);
    assert.ok(item.shows && MEDIA_KIND_KEYS.has(item.shows), `${slug}: "${item.shows}" is not a media kind`);
    assert.equal(item.creditFrom, "source", `${slug}: picture must ask for its credit`);
    assert.doesNotMatch(
      item.caption ?? "",
      /public domain|CC BY|CC0|creative commons/i,
      `${slug}: caption states a licence it did not fetch`
    );
  }
});

test("a period cover is always also in its gallery", () => {
  for (const period of PERIODS) {
    if (!period.imageUrl) continue;
    const urls = (period.media ?? []).map((item) => item.url);
    assert.ok(urls.includes(period.imageUrl), `${period.slug}: cover is not among its media`);
  }
});

test("the two periods that are conventions of one region carry no picture", () => {
  // "Medieval" and "Modern" are historical conventions with an origin in one
  // region's history, applied far beyond it — which these entries say in as
  // many words. An illuminated European manuscript beside "Medieval" would not
  // illustrate that problem, it would commit it, in the most persuasive place
  // on the card. If somebody later adds one, this is where they are asked to
  // think about it rather than where they are stopped.
  for (const slug of ["medieval-period", "modern-era"]) {
    const period = PERIODS.find((p) => p.slug === slug);
    assert.ok(period, `${slug} should exist`);
    assert.equal(period.imageUrl, undefined, `${slug} should carry no cover`);
    assert.equal((period.media ?? []).length, 0, `${slug} should carry no pictures`);
  }
});

test("no period caption lets its picture stand for the whole span", () => {
  // Not a style rule. The failure it catches is a caption that says "the Bronze
  // Age" and shows one object, which is the exact reading this file exists to
  // prevent — so each caption has to carry something that pushes back: a named
  // limit, a region, a date, or an outright statement of what it is not.
  for (const { slug, item } of PERIOD_PICTURES) {
    const caption = item.caption ?? "";
    assert.ok(caption.length > 120, `${slug}: caption too short to qualify what it shows`);
    assert.match(
      caption,
      /not |rather than|only|END|example|one object|one animal|one rock|is not|does not/i,
      `${slug}: caption does not say what the picture is NOT`
    );
  }
});

// ---------------------------------------------------------------------------
// AND THE HOLE IN ALL OF THE ABOVE
//
// Every rule in this file runs over ALL, and ALL is a hand-written list of
// imports. A dataset left out of it does not fail anything — its pictures are
// simply never examined, which is the quietest way for a wrong caption or an
// unattributed image to ship. Three datasets carrying no pictures at all were
// absent from this list for exactly that reason, and nobody noticed because
// there was nothing to notice.
//
// So the list is checked against the directory rather than against memory.
// ---------------------------------------------------------------------------

test("every seeded dataset carrying pictures is in the list this file checks", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.dirname(new URL(import.meta.url).pathname);
  const seedFiles = fs.readdirSync(dir).filter((name) => name.endsWith("-seed.ts"));

  const covered = new Set(ALL.map((event) => event.slug));
  const missing: string[] = [];

  for (const file of seedFiles) {
    const seedModule: Record<string, unknown> = await import(`./${file}`);
    for (const [name, value] of Object.entries(seedModule)) {
      if (!name.endsWith("_EVENTS") || !Array.isArray(value)) continue;
      for (const event of value as SeedEvent[]) {
        const hasPictures = Boolean(event.imageUrl) || (event.media ?? []).length > 0;
        if (hasPictures && !covered.has(event.slug)) missing.push(`${file}: ${event.slug}`);
      }
    }
  }

  assert.deepEqual(
    missing,
    [],
    `these events carry pictures that no rule in this file has ever looked at:\n  ${missing.join("\n  ")}`
  );
});
