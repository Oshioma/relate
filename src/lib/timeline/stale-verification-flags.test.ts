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

// ---------------------------------------------------------------------------
// A FLAG NO STATE OF THE DATASET COULD EVER SATISFY
//
// The staleness check above catches a flag that has become false. This catches
// a flag that was never capable of becoming false — which is the quieter and
// more common failure, because it looks like diligence.
//
// THE TEST APPLIED WHEN THESE WERE AUDITED: is there an achievable state of
// this dataset that would clear the flag? "No PGM number is cited below" passes
// — cite one and it is done. "Read Leahy, Göttinger Miszellen 226 (2010)"
// passes. "NEEDS SOURCE VERIFICATION against a current chronology" fails: there
// is no such thing as "a current chronology", so nothing anyone could enter
// would ever satisfy it, and the flag would have sat there permanently looking
// like an open task.
//
// Ten flags were rewritten on that test. Each now names the condition that
// clears it, and where a work is named it is named as an unread trail rather
// than as something whose content the dataset is asserting.
//
// THIS IS A REGRESSION LIST, NOT A VAGUENESS DETECTOR, and saying so matters:
// it holds the exact formulas that were found unsatisfiable and removed. It
// cannot tell whether a newly written flag is answerable — only a person can.
// What it can do is stop these particular ones coming back, which they would,
// because each reads as perfectly reasonable until you try to act on it.
// ---------------------------------------------------------------------------

const UNSATISFIABLE: Array<{ pattern: RegExp; why: string }> = [
  {
    pattern: /against (a |the )?current[a-z ]*chronolog/i,
    why: '"a current chronology" names no work; say which chronology the years come from',
  },
  {
    pattern: /NEEDS SOURCE VERIFICATION,? as above/i,
    why: '"as above" is a back-reference, not a target; state the condition on this claim',
  },
  {
    pattern: /against (a |the )?current edition/i,
    why: '"a current edition" names no edition; name the one that would settle it',
  },
  {
    pattern: /given precisely in the literature/i,
    why: '"the literature" is doing a citation\'s job; name the account',
  },
  {
    pattern: /VERIFICATION against independent accounts\./i,
    why: "independent of what? say what a source would have to be independent OF",
  },
  {
    pattern: /This is the detail a reader would most want checked/i,
    why: "says only that it matters; say what would establish it",
  },
];

test("no verification flag asks for something that could never be supplied", () => {
  const offences: string[] = [];
  for (const name of seedFiles) {
    const text = readFileSync(join(SEED_DIR, name), "utf8");
    for (const { pattern, why } of UNSATISFIABLE) {
      const hit = pattern.exec(text);
      if (hit) offences.push(`${name}: ${JSON.stringify(hit[0])}\n    ${why}`);
    }
  }
  assert.deepEqual(offences, [], offences.join("\n\n"));
});
