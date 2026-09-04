#!/usr/bin/env node
//
// Import lessons from the standalone school app into a Lessons space.
//
// The two apps store the same document — space_lessons.lesson is the shape
// school_lessons.lesson always was, pictures included — so nothing here
// rewrites content. What it does is re-home each lesson: the standalone app
// scoped a lesson to one person, relate scopes it to a space in a community.
//
// WHERE THE FILE COMES FROM
// Run this in the standalone app's Supabase SQL editor and download the result
// as JSON:
//
//   select coalesce(json_agg(t order by t.created_at), '[]'::json)
//   from (
//     select age_band, title, subject, source_text, lesson, created_at
//     from school_lessons
//   ) t;
//
// USAGE
//   SUPABASE_URL=https://<project>.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=<service role key> \
//     node scripts/import-school-lessons.mjs lessons.json squidge-over-skool
//
// Add a third argument to target a particular space by slug; without one it
// picks the community's first Lessons space.
//
// Writes as the community's owner through the service-role client, which is
// also what gets past the staff-only insert policy on space_lessons.
//
// Safe to re-run: a lesson whose title and age band already exist in the space
// is skipped rather than duplicated, so a part-finished import can just be run
// again.

import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const [, , filePath, communitySlug, spaceSlug] = process.argv;
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

if (!filePath || !communitySlug) {
  fail("usage: node scripts/import-school-lessons.mjs <lessons.json> <community-slug> [space-slug]");
}
if (!url || !key) {
  fail("set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

let rows;
try {
  rows = JSON.parse(await readFile(filePath, "utf8"));
} catch (error) {
  fail(`could not read ${filePath}: ${error.message}`);
}
if (!Array.isArray(rows)) fail("expected the file to hold a JSON array of lessons");

const { data: community, error: communityError } = await supabase
  .from("communities")
  .select("id, name, owner_id")
  .eq("slug", communitySlug)
  .maybeSingle();

if (communityError) fail(`looking up the community: ${communityError.message}`);
if (!community) fail(`no community with slug "${communitySlug}"`);

let spaceQuery = supabase
  .from("spaces")
  .select("id, name, slug")
  .eq("community_id", community.id)
  .eq("space_type", "lessons");
if (spaceSlug) spaceQuery = spaceQuery.eq("slug", spaceSlug);

const { data: spaces, error: spaceError } = await spaceQuery.order("sort_order", { ascending: true });
if (spaceError) fail(`looking up the space: ${spaceError.message}`);
if (!spaces?.length) {
  fail(
    spaceSlug
      ? `"${communitySlug}" has no Lessons space with slug "${spaceSlug}"`
      : `"${communitySlug}" has no Lessons space - add one in Admin first`
  );
}
const space = spaces[0];

// What is already there, so a re-run tops up rather than duplicating.
const { data: existing, error: existingError } = await supabase
  .from("space_lessons")
  .select("title, age_band")
  .eq("space_id", space.id);
if (existingError) fail(`reading existing lessons: ${existingError.message}`);

const seen = new Set((existing ?? []).map((l) => `${l.title} ${l.age_band}`));

console.log(`\n  ${community.name} -> ${space.name}`);
console.log(`  ${rows.length} lesson(s) in the file, ${existing?.length ?? 0} already in the space\n`);

let imported = 0;
let skipped = 0;

for (const row of rows) {
  const title = (row.title ?? "").trim();
  const ageBand = row.age_band ?? "8-10";

  if (!title || !row.lesson) {
    console.log(`  skipped (no title or document): ${title || "(untitled)"}`);
    skipped += 1;
    continue;
  }
  if (seen.has(`${title} ${ageBand}`)) {
    console.log(`  skipped (already here): ${title} [${ageBand}]`);
    skipped += 1;
    continue;
  }

  const { error } = await supabase.from("space_lessons").insert({
    space_id: space.id,
    community_id: community.id,
    created_by: community.owner_id,
    age_band: ageBand,
    title,
    subject: row.subject ?? "",
    source_text: row.source_text ?? "",
    lesson: row.lesson,
    // Keeps the library in the order the lessons were actually written.
    ...(row.created_at ? { created_at: row.created_at } : {}),
  });

  if (error) {
    console.log(`  FAILED: ${title} - ${error.message}`);
    continue;
  }

  seen.add(`${title} ${ageBand}`);
  imported += 1;
  console.log(`  imported: ${title} [${ageBand}]`);
}

console.log(`\n  done - ${imported} imported, ${skipped} skipped\n`);
