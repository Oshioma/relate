import { test } from "node:test";
import assert from "node:assert/strict";

import { hotlinkedPicturesToBringIn, withBroughtInPictures } from "./bring-in-image";

// isHotlinked compares against the project's own storage address, read when it
// is called, so the test needs one to tell "ours" from "somebody else's".
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://ours.supabase.co";

const COMMONS = "https://commons.wikimedia.org/wiki/Special:FilePath/Seal_impression_Peribsen.jpg?width=1200";
const UPLOAD = "https://upload.wikimedia.org/wikipedia/commons/a/ab/Deucalion.jpg";
const OURS = "https://ours.supabase.co/storage/v1/object/public/uploads/u/timeline/x.jpg";

test("a credited picture from a listed source is brought in, with its cover twin", () => {
  const plan = hotlinkedPicturesToBringIn({
    image_url: UPLOAD,
    media: [{ url: UPLOAD, credit: "Somebody, CC BY-SA 4.0, via Wikimedia Commons" }],
  });
  assert.deepEqual(plan.urls, [UPLOAD], "one address, not one per place it is used");
  assert.equal(plan.leftAlone, 0);
});

test("a Commons picture with no credit is still brought in, because its file page can be derived", () => {
  const plan = hotlinkedPicturesToBringIn({ image_url: null, media: [{ url: COMMONS }] });
  assert.deepEqual(plan.urls, [COMMONS]);
});

test("a picture from a host nobody has listed is never fetched", () => {
  // A member can put any URL on a record they wrote; copying it would be both
  // a fetch from the server and a licence question nobody has answered.
  const plan = hotlinkedPicturesToBringIn({
    image_url: "https://example.org/a.jpg",
    media: [{ url: "https://example.org/a.jpg", credit: "Someone" }, { url: "http://169.254.169.254/x.jpg" }],
  });
  assert.deepEqual(plan.urls, []);
  assert.equal(plan.leftAlone, 2, "the cover is counted with its twin, not on its own");
});

test("a listed-source picture with no provenance at all stays where it is", () => {
  const plan = hotlinkedPicturesToBringIn({ image_url: null, media: [{ url: "https://images.metmuseum.org/x.jpg" }] });
  assert.deepEqual(plan.urls, []);
  assert.equal(plan.leftAlone, 1);
});

test("a cover with no gallery twin is left alone and counted", () => {
  const plan = hotlinkedPicturesToBringIn({ image_url: UPLOAD, media: [] });
  assert.deepEqual(plan.urls, []);
  assert.equal(plan.leftAlone, 1);
});

test("pictures that are already ours, or bundled with the app, are not counted at all", () => {
  const plan = hotlinkedPicturesToBringIn({
    image_url: OURS,
    media: [{ url: OURS }, { url: "/images/sacred-trees/oak.png" }],
  });
  assert.deepEqual(plan, { urls: [], leftAlone: 0 });
});

test("bringing in swaps only the copied addresses and keeps everything else on the picture", () => {
  const record = {
    image_url: COMMONS,
    media: [
      { url: COMMONS, caption: "Seal impression", kind: "photograph", identificationStatus: "secure" },
      { url: "https://example.org/kept.jpg", caption: "Not copied" },
    ],
  };
  const after = withBroughtInPictures(record, new Map([[COMMONS, OURS]]));
  assert.equal(after.image_url, OURS);
  assert.equal(after.media[0].url, OURS);
  assert.equal(after.media[0].caption, "Seal impression");
  assert.equal(after.media[0].identificationStatus, "secure");
  // The copy has to still say where it came from.
  assert.equal(
    (after.media[0] as { sourcePageUrl?: string }).sourcePageUrl,
    "https://commons.wikimedia.org/wiki/File:Seal_impression_Peribsen.jpg"
  );
  assert.deepEqual(after.media[1], record.media[1], "a picture that was not copied is untouched");
});

test("a source page the picture already names is never overwritten", () => {
  const after = withBroughtInPictures(
    { image_url: null, media: [{ url: UPLOAD, sourcePageUrl: "https://www.britishmuseum.org/collection/object/Y" }] },
    new Map([[UPLOAD, OURS]])
  );
  assert.equal(after.media[0].sourcePageUrl, "https://www.britishmuseum.org/collection/object/Y");
});
