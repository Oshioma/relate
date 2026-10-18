import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { SPACE_TYPES } from "./space-types";
import { defaultSpaceImage, spaceImage } from "./space-images";

test("every space type has a default photo on disk", () => {
  for (const type of Object.keys(SPACE_TYPES) as (keyof typeof SPACE_TYPES)[]) {
    const file = join(process.cwd(), "public", defaultSpaceImage(type));
    assert.ok(existsSync(file), `missing default photo for ${type}: ${file}`);
  }
});

test("an uploaded photo wins over the default", () => {
  assert.equal(spaceImage({ image_url: "https://x/y.jpg", space_type: "discussion" }), "https://x/y.jpg");
  assert.equal(spaceImage({ image_url: null, space_type: "map" }), "/images/space-defaults/map.webp");
});
