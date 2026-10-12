import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { COMMUNITY_TEMPLATES } from "./community-templates";
import { exampleFeedPosts } from "./feed-examples";

test("every template gets three example posts with distinct photos that exist", () => {
  for (const template of [...COMMUNITY_TEMPLATES.map((t) => t.key), null]) {
    const posts = exampleFeedPosts({ name: "Test", template_key: template });
    assert.equal(posts.length, 3, `${template}`);
    assert.equal(new Set(posts.map((p) => p.imageUrl)).size, 3, `${template} repeats a photo`);
    for (const post of posts) {
      assert.ok(existsSync(join(process.cwd(), "public", post.imageUrl)), `${template}: missing ${post.imageUrl}`);
    }
  }
});

test("the welcome post names the community, and unknown templates fall back", () => {
  const posts = exampleFeedPosts({ name: "Harbour Swimmers", template_key: "not-a-template" });
  assert.equal(posts[0].title, "Welcome to Harbour Swimmers!");
  assert.equal(posts[1].title, "What brought you here?");
});
