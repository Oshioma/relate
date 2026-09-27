import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { SET_SUTEKH_EVENTS } from "./set-sutekh-seed";
import { SERPENT_KUNDALINI_EVENTS } from "./serpent-kundalini-seed";
import { HORUS_CLAIMS_EVENTS } from "./horus-claims-seed";
import { MEDIA_KINDS, IDENTIFICATION_STATUSES } from "./taxonomy";

// ---------------------------------------------------------------------------
// WHY A TEST OVER A MARKDOWN FILE
//
// docs/research-brief-07-images.md is sent to a researcher with web access, and
// what comes back is filed against the record slugs and vocabulary keys the
// brief quotes. So those two things are not prose: they are an interface, and a
// stale one costs a research round rather than a rebuild. If a slug is renamed
// in a seed, or a MEDIA_KINDS key is dropped, the brief silently starts asking
// for things that cannot be filed — and nobody finds out until a report arrives
// written to the old names.
//
// WHAT THIS DELIBERATELY DOES NOT ASSERT: how many records still lack a
// picture. That number is meant to fall, and a test pinning it would fail on
// success. Only the direction that cannot become wrong through progress is
// checked here — that everything the brief names actually exists.
// ---------------------------------------------------------------------------

const BRIEF = readFileSync(new URL("../../../docs/research-brief-07-images.md", import.meta.url), "utf8");

const RECORD_SLUGS = new Set(
  [...SET_SUTEKH_EVENTS, ...SERPENT_KUNDALINI_EVENTS, ...HORUS_CLAIMS_EVENTS].map((event) => event.slug)
);

test("the images brief cites only record slugs that exist", () => {
  // Three-or-more hyphenated segments inside backticks is the shape of a slug
  // in this brief, and is not the shape of anything else it quotes.
  const cited = new Set([...BRIEF.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+){2,})`/g)].map((match) => match[1]));
  assert.ok(cited.size > 30, `brief cites only ${cited.size} slugs — it should name every record it asks about`);
  for (const slug of cited) {
    assert.ok(
      RECORD_SLUGS.has(slug),
      `brief asks for pictures on "${slug}", which is not a record in any of the three datasets`
    );
  }
});

test("the images brief quotes only vocabulary keys that exist", () => {
  // Set<string>, not the inferred union of literals: the keys being compared
  // come out of a Markdown file, so they are plain strings and `has` must
  // accept one.
  const known = new Set<string>([
    ...MEDIA_KINDS.map((kind) => kind.key),
    ...IDENTIFICATION_STATUSES.map((status) => status.key),
  ]);
  // Backticked snake_case is how the brief quotes a vocabulary key; nothing
  // else it backticks contains an underscore.
  const quoted = new Set([...BRIEF.matchAll(/`([a-z]+(?:_[a-z]+)+)`/g)].map((match) => match[1]));
  for (const key of quoted) {
    assert.ok(known.has(key), `brief tells the researcher to use "${key}", which is not a valid key`);
  }
});

test("the images brief lists EVERY valid key, not a selection", () => {
  // A partial list is the failure mode that matters. The brief tells the
  // researcher these are the only permitted values, so a key left out is a key
  // they will not use — and the record that needed it gets a worse one that
  // happens to be on the list. Adding a MEDIA_KINDS entry therefore has to
  // update the brief, which is what this enforces.
  for (const { key } of MEDIA_KINDS) {
    assert.ok(BRIEF.includes(`\`${key}\``), `MEDIA_KINDS key "${key}" is missing from the brief's list`);
  }
  for (const { key } of IDENTIFICATION_STATUSES) {
    assert.ok(BRIEF.includes(`\`${key}\``), `IDENTIFICATION_STATUSES key "${key}" is missing from the brief's list`);
  }
});

test("the images brief states the count it was written against", () => {
  // The table at the top is a measurement, and a measurement with no date is a
  // vibe. If the brief is revised the date has to move with it.
  assert.match(BRIEF, /as of \d{4}-\d{2}-\d{2}/, "brief does not date its own counts");
});


test("image research policy requires multiple related images and visible UNVERIFIED treatment", () => {
  const agents = readFileSync(new URL("../../../AGENTS.md", import.meta.url), "utf8");
  assert.match(agents, /Prefer multiple useful images/, "AGENTS.md does not tell future AI sessions to seek multiple useful images");
  assert.match(agents, /Related images are allowed/, "AGENTS.md does not permit related/context images");
  assert.match(agents, /UNVERIFIED images/, "AGENTS.md does not define the UNVERIFIED treatment");
  assert.match(BRIEF, /UNVERIFIED —/, "research brief does not require the visible UNVERIFIED caption prefix");
  assert.ok(
    IDENTIFICATION_STATUSES.some((status) => status.key === "unverified"),
    "taxonomy does not expose unverified as a first-class identification status"
  );
});
