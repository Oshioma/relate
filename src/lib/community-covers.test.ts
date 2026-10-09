import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { COMMUNITY_TEMPLATES } from "./community-templates";
import { COMMUNITY_COVERS, coverPath, coversForTemplate, defaultCoverKey, isCoverKey } from "./community-covers";

test("every suggested cover has its file", () => {
  for (const cover of COMMUNITY_COVERS) {
    assert.ok(existsSync(join(process.cwd(), "public", coverPath(cover.key))), `missing ${cover.key}`);
  }
});

test("every community template gets a matching cover first", () => {
  for (const template of COMMUNITY_TEMPLATES) {
    const first = coversForTemplate(template.key)[0];
    assert.ok(first.templates.includes(template.key), `no cover tagged for template "${template.key}"`);
  }
});

test("unknown keys are rejected and every template has a default", () => {
  assert.equal(isCoverKey("../../etc/passwd"), false);
  assert.equal(isCoverKey(""), false);
  assert.equal(defaultCoverKey("farming"), "market");
  assert.ok(isCoverKey(defaultCoverKey("not-a-template")));
});
