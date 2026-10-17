import { test } from "node:test";
import assert from "node:assert/strict";
import { hotlinkedPicturesToBringIn } from "../bring-in-image";
import { pictureSourceFor } from "../picture-sources";
import { INVENTORY } from "./inventory";
import { markerPictures } from "./importer";
import { MARKER_PICTURES } from "./marker-pictures";

const markers = INVENTORY.flatMap((work) => (work.anchor && "event" in work.anchor ? [work.anchor.event] : []));

test("marker pictures belong to markers the library creates", () => {
  const slugs = new Set(markers.map((marker) => marker.slug));
  for (const slug of Object.keys(MARKER_PICTURES)) assert.ok(slugs.has(slug), slug);
});

test("every marker picture says what it shows, who made it and where it came from", () => {
  for (const [slug, pictures] of Object.entries(MARKER_PICTURES)) {
    const urls = new Set<string>();
    for (const picture of pictures) {
      const where = `${slug}: ${picture.url}`;
      assert.ok(!urls.has(picture.url), `${where} is listed twice`);
      urls.add(picture.url);
      assert.ok(pictureSourceFor(picture.url), `${where} is not from a listed source`);
      assert.ok((picture.caption ?? "").length > 40, `${where} needs a caption`);
      assert.ok(picture.credit?.trim(), `${where} needs a credit`);
      assert.match(picture.sourcePageUrl ?? "", /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, where);
      assert.equal(
        picture.caption!.startsWith("UNVERIFIED —"),
        picture.identificationStatus === "unverified",
        `${where}: an unverified picture says so at the start of its caption, and only then`
      );
    }
  }
});

test("a marker's cover is its first picture, and the copy step will bring every one in", () => {
  for (const marker of markers) {
    const { imageUrl, media } = markerPictures(marker);
    if (media.length === 0) continue;
    assert.equal(imageUrl, media[0].url, marker.slug);
    const plan = hotlinkedPicturesToBringIn({ image_url: imageUrl ?? null, media });
    assert.equal(plan.leftAlone, 0, marker.slug);
    assert.equal(plan.urls.length, media.length, marker.slug);
  }
});
