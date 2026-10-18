import { test } from "node:test";
import assert from "node:assert/strict";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://ours.supabase.co";

const { copiedPictureName, isCopyOf, keepCopiedPictures, COPIED_LICENCE_STATUSES } = await import("./pictures");

const SOURCE = "https://upload.wikimedia.org/wikipedia/commons/1/14/Coffin_of_Gua.jpg";
const copyOf = (key: string, source: string) =>
  `https://ours.supabase.co/storage/v1/object/public/uploads/user/timeline/${copiedPictureName(key, source)}.jpg`;

test("a copy is recognised only for the same key and the same source address", () => {
  assert.ok(isCopyOf(copyOf("coffin-gua-two-ways", SOURCE), "coffin-gua-two-ways", SOURCE));
  assert.ok(!isCopyOf(copyOf("coffin-gua-two-ways", SOURCE), "coffin-gua-two-ways", `${SOURCE}?v=2`));
  assert.ok(!isCopyOf(copyOf("other-key", SOURCE), "coffin-gua-two-ways", SOURCE));
  assert.ok(!isCopyOf(SOURCE, "coffin-gua-two-ways", SOURCE));
});

test("a re-import keeps the stored copy instead of pointing back at Wikimedia", async () => {
  const stored = [
    { import_key: "coffin-gua-two-ways", url: copyOf("coffin-gua-two-ways", SOURCE) },
    { import_key: "moved", url: copyOf("moved", "https://example.org/old.jpg") },
  ];
  const query = {
    select: () => query,
    eq: () => query,
    in: async () => ({ data: stored }),
  };
  const supabase = { from: () => query } as unknown as Parameters<typeof keepCopiedPictures>[0];
  const rows = await keepCopiedPictures(supabase, "community", [
    { import_key: "coffin-gua-two-ways", url: SOURCE },
    { import_key: "moved", url: "https://example.org/new.jpg" },
    { import_key: "new", url: "https://example.org/fresh.jpg" },
  ]);
  assert.deepEqual(
    rows.map((row) => row.url),
    [copyOf("coffin-gua-two-ways", SOURCE), "https://example.org/new.jpg", "https://example.org/fresh.jpg"]
  );
});

test("every picture is copied except one marked restricted", () => {
  assert.ok(!(COPIED_LICENCE_STATUSES as readonly string[]).includes("restricted"));
  for (const status of ["open", "attribution", "share_alike", "non_commercial", "unknown"]) {
    assert.ok((COPIED_LICENCE_STATUSES as readonly string[]).includes(status), status);
  }
});
