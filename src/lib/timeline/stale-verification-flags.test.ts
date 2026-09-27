import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// ---------------------------------------------------------------------------
// A FLAG THAT OUTLIVED ITS OWN ANSWER
//
// "NEEDS SOURCE VERIFICATION" is how a record admits what it has not checked,
// and it is one of the most valuable sentences in these datasets — a reader can
// see the edge of what is known instead of having to guess where it is. That
// only works while the flags are true.
//
// THE CASE THIS CATCHES, which was real. The source note for the 400-Year Stela
// asked for verification of "its museum location, its inscription and the
// scholarly literature on what the four hundred years are counted from". Two
// research rounds later the record beneath that source carried the accession
// number (Cairo JdE 60539), the holding institution, a transliteration quoted
// from the Thesaurus Linguae Aegyptiae after KRI II 287-288, and two
// translations. The note still said none of it was known.
//
// WHY THAT IS WORSE THAN A MISSING FLAG, and why it earns a test rather than a
// one-line fix. A stale flag does not merely go out of date — it actively
// misreports the dataset's own strongest work, and it does so in the one place
// a careful reader looks to calibrate their trust. A reader who checks the
// provenance and finds it better than advertised learns that these notes cannot
// be relied on in either direction.
//
// HOW IT IS CHECKED. For each record, what the record itself establishes is
// collected — a holding institution, an accession number, a transliteration
// layer. Then every source the record cites is read. A cited source may not ask
// for verification of something the record it is cited by already carries.
//
// WHAT THIS DOES NOT DO. It cannot tell whether a flag about something outside
// the file is still true; "no PGM number is cited below" or "Leahy 2010 was not
// opened" are claims about the wider world and are checked by reading, not by a
// test. It catches only the contradiction a file makes with itself, which is
// the one kind of staleness that is knowable from here.
// ---------------------------------------------------------------------------

const SEED_DIR = dirname(fileURLToPath(import.meta.url));

const seedFiles = readdirSync(SEED_DIR)
  .filter((name) => name.endsWith("-seed.ts"))
  .sort();

type Flagged = { file: string; slug: string; sourceKey: string; carries: string; flag: string };

/** Every `key: "..."` block in a file, mapped to the text that follows it. */
function sourceNotes(source: string): Map<string, string> {
  const notes = new Map<string, string>();
  for (const match of source.matchAll(/key: "([^"]+)",/g)) {
    const rest = source.slice(match.index + match[0].length);
    const end = rest.indexOf("\n  {");
    notes.set(match[1], end > 0 ? rest.slice(0, end) : rest.slice(0, 2500));
  }
  return notes;
}

function findStaleFlags(file: string, source: string): Flagged[] {
  const lines = source.split("\n");
  const notes = sourceNotes(source);
  const recordStarts = lines.flatMap((line, index) => (/^ {4}slug: "/.test(line) ? [index] : []));
  const found: Flagged[] = [];

  recordStarts.forEach((start, position) => {
    const end = recordStarts[position + 1] ?? lines.length;
    const block = lines.slice(start, end).join("\n");

    // What this record itself now establishes.
    const establishes: Array<[RegExp, string]> = [];
    if (/accessionNumber: "|holdingInstitution: "/.test(block)) {
      establishes.push([/museum location|where it is held|its location/i, "an accession number or holding institution"]);
    }
    if (block.includes('layer: "transliteration"')) {
      establishes.push([/its inscription|the inscription|its wording/i, "a transliteration of its inscription"]);
    }
    if (establishes.length === 0) return;

    const slug = /^ {4}slug: "([^"]+)"/.exec(lines[start])?.[1] ?? "?";
    for (const sourceKey of new Set([...block.matchAll(/sourceKey: "([^"]+)"/g)].map((m) => m[1]))) {
      for (const flag of (notes.get(sourceKey) ?? "").match(/NEEDS SOURCE VERIFICATION[^"]*/gi) ?? []) {
        // "STILL NEEDS" is how a partly-answered note keeps its remaining gap,
        // and those are the notes that have already been audited once.
        if (/STILL NEEDS SOURCE VERIFICATION/i.test(flag)) continue;
        for (const [asksAbout, carries] of establishes) {
          if (asksAbout.test(flag)) found.push({ file, slug, sourceKey, carries, flag: flag.slice(0, 200) });
        }
      }
    }
  });

  return found;
}

test("no source asks to verify what the record citing it already carries", () => {
  const stale = seedFiles.flatMap((name) => findStaleFlags(name, readFileSync(join(SEED_DIR, name), "utf8")));
  assert.deepEqual(
    stale,
    [],
    stale
      .map((s) => `${s.file} — record "${s.slug}" carries ${s.carries}, but source "${s.sourceKey}" says:\n    ${s.flag}`)
      .join("\n\n")
  );
});

test("the audit actually reads the seed files it claims to", () => {
  // A scan over an empty list passes silently, which would make the test above
  // a decoration. This is the tripwire under it.
  assert.ok(seedFiles.length > 20, `only ${seedFiles.length} seed files found — the scan is not reaching them`);
  const withFlags = seedFiles.filter((name) =>
    readFileSync(join(SEED_DIR, name), "utf8").includes("NEEDS SOURCE VERIFICATION")
  );
  assert.ok(withFlags.length > 5, `only ${withFlags.length} seed files carry verification flags — check the scan`);
});
