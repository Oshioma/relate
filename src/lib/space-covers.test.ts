import { test } from "node:test";
import assert from "node:assert/strict";
import { pickSpaceCovers } from "./space-covers";

const directory = { id: "dir", space_type: "business_directory", image_url: null };
const map = { id: "map", space_type: "map", image_url: null };
const tides = { id: "tides", space_type: "resources", image_url: null };
const stays = { id: "stays", space_type: "accommodation", image_url: null };

test("an admin-set cover always wins", () => {
  const covers = pickSpaceCovers(
    [{ ...directory, image_url: "https://x/admin.jpg" }],
    [{ spaceId: "dir", url: "https://x/biz.jpg" }],
    null
  );
  assert.equal(covers.get("dir"), "https://x/admin.jpg");
});

test("spaces fall back to their own content, the map to any photo, the rest to the community cover", () => {
  const covers = pickSpaceCovers(
    [directory, map, tides, stays],
    [
      { spaceId: "dir", url: "https://x/biz1.jpg" },
      { spaceId: "dir", url: "https://x/biz2.jpg" },
      { spaceId: "stays", url: "https://x/stay.jpg" },
    ],
    "https://x/community.jpg"
  );
  assert.equal(covers.get("dir"), "https://x/biz1.jpg");
  assert.equal(covers.get("stays"), "https://x/stay.jpg");
  assert.equal(covers.get("map"), "https://x/biz2.jpg");
  assert.equal(covers.get("tides"), "https://x/community.jpg");
});

test("no photo anywhere leaves the card to its icon", () => {
  const covers = pickSpaceCovers([tides], [{ spaceId: "tides", url: "not-a-url" }], null);
  assert.equal(covers.get("tides"), null);
});

test("logos and share cards are skipped, and PNGs come after photos", () => {
  const covers = pickSpaceCovers(
    [directory],
    [
      { spaceId: "dir", url: "https://organzibar.com/og-image.png" },
      { spaceId: "dir", url: "https://seezanzibartours.com/img/logo.png" },
      { spaceId: "dir", url: "https://x/blob.png" },
      { spaceId: "dir", url: "https://x/beach.webp" },
    ],
    null
  );
  assert.equal(covers.get("dir"), "https://x/beach.webp");
});
