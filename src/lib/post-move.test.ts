import { test } from "node:test";
import assert from "node:assert/strict";
import { guideBodyFromPost, moveKindFor, moveTargets, showsPostFeed } from "./post-move";

test("feeds take posts, Guides take them as guides, other types refuse", () => {
  assert.equal(moveKindFor("discussion"), "post");
  assert.equal(moveKindFor(null), "post");
  assert.equal(moveKindFor("guides"), "guide");
  for (const type of ["live", "course", "growth_journey", "custom", "lessons"]) assert.equal(moveKindFor(type), null, type);
  assert.equal(showsPostFeed("guides"), false);
});

test("move targets skip the post's own space and spaces that hold no posts", () => {
  const spaces = [
    { id: "chat", space_type: "discussion" },
    { id: "tips", space_type: "guides" },
    { id: "live", space_type: "live" },
    { id: "news", space_type: "discussion" },
  ];
  assert.deepEqual(
    moveTargets(spaces, "chat").map((s) => [s.id, s.kind]),
    [
      ["tips", "guide"],
      ["news", "post"],
    ]
  );
});

test("a post's photos and videos follow it into the guide body", () => {
  assert.equal(
    guideBodyFromPost({ body: "<p>Hi</p>", media_url: "https://x.test/a.jpg", extra_media_urls: ["https://x.test/b.mp4", 'https://x.test/c".png'] }),
    '<p>Hi</p>\n<p><img src="https://x.test/a.jpg" alt=""></p>\n<p><video src="https://x.test/b.mp4" controls></video></p>\n<p><img src="https://x.test/c&quot;.png" alt=""></p>'
  );
  assert.equal(guideBodyFromPost({ body: null, media_url: null, extra_media_urls: null }), "");
});
