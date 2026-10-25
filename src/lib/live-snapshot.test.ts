import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeSnapshot, looksBlank, publicSnapshotPath, SNAPSHOT_MAX_BYTES } from "./live-snapshot";

const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);

test("decodeSnapshot accepts a JPEG data URL", () => {
  const bytes = decodeSnapshot(`data:image/jpeg;base64,${JPEG.toString("base64")}`);
  assert.ok(bytes);
  assert.deepEqual(Array.from(bytes), Array.from(JPEG));
});

test("decodeSnapshot rejects other types, non-JPEG bytes and oversized pictures", () => {
  assert.equal(decodeSnapshot(`data:image/png;base64,${JPEG.toString("base64")}`), null);
  assert.equal(decodeSnapshot(`data:image/jpeg;base64,${Buffer.from("hello world").toString("base64")}`), null);
  assert.equal(decodeSnapshot("https://example.com/a.jpg"), null);
  const big = Buffer.alloc(SNAPSHOT_MAX_BYTES + 10);
  JPEG.copy(big);
  assert.equal(decodeSnapshot(`data:image/jpeg;base64,${big.toString("base64")}`), null);
});

test("looksBlank spots a flat frame and keeps a real one", () => {
  const black = new Uint8ClampedArray(64 * 64 * 4);
  assert.equal(looksBlank(black), true);
  const grey = new Uint8ClampedArray(64 * 64 * 4).fill(128);
  assert.equal(looksBlank(grey), true);
  const busy = new Uint8ClampedArray(64 * 64 * 4);
  for (let i = 0; i < busy.length; i += 4) {
    const v = (i / 4) % 7 < 3 ? 30 : 220;
    busy[i] = busy[i + 1] = busy[i + 2] = v;
    busy[i + 3] = 255;
  }
  assert.equal(looksBlank(busy), false);
  assert.equal(looksBlank(new Uint8ClampedArray(0)), true);
});

test("publicSnapshotPath sits in the uploader's folder, one file per session", () => {
  assert.equal(publicSnapshotPath("u1", "s1"), "u1/live-snapshots/s1.jpg");
});
