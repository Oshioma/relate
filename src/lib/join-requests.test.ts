import { test } from "node:test";
import assert from "node:assert/strict";
import { communitySlugFromNext } from "./join-requests";

test("communitySlugFromNext reads the community from a community page path", () => {
  assert.equal(communitySlugFromNext("/c/squidgeoverskool"), "squidgeoverskool");
  assert.equal(communitySlugFromNext("/c/SquidgeOverSkool/spaces/chat?x=1"), "squidgeoverskool");
  assert.equal(communitySlugFromNext("/c/my%20club#top"), "my club");
});

test("communitySlugFromNext ignores everything else", () => {
  assert.equal(communitySlugFromNext("/dashboard"), null);
  assert.equal(communitySlugFromNext("/invite/abc"), null);
  assert.equal(communitySlugFromNext("/"), null);
  assert.equal(communitySlugFromNext("/c/"), null);
});
