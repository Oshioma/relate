import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  KUNDALINI_ELEMENTS,
  elementsInThread,
  elementsWithPrecursor,
  establishedElements,
  establishedSpread,
  openElements,
  tracebackProgress,
  type KundaliniElement,
} from "./kundalini-traceback";
import { SERPENT_THREADS } from "./serpent-kundalini-seed";

// ---------------------------------------------------------------------------
// A FORM THAT CANNOT BE FILLED DISHONESTLY
//
// The table's whole value is that an element either names a text, a passage, a
// date and the scholar who established it — or stands empty with a stated
// reason. There is no free-text cell where a plausible century can be typed,
// and these tests are what keep it that way as the rows get filled in.
// ---------------------------------------------------------------------------

test("an element either establishes its earliest attestation or says why it cannot", () => {
  for (const element of KUNDALINI_ELEMENTS) {
    assert.ok(
      element.earliest || element.earliestAbsentReason,
      `${element.key}: an empty cell must say why it is empty`
    );
    assert.ok(
      !(element.earliest && element.earliestAbsentReason),
      `${element.key}: cannot both have an attestation and a reason for lacking one`
    );
  }
});

test("an attestation names a text, a passage, a date AND who established it", () => {
  // A date with no passage is not an attestation, and a date with no scholar
  // hides the fact that these dates are arguments rather than observations.
  for (const element of establishedElements()) {
    const earliest = element.earliest!;
    assert.ok(earliest.text.trim(), `${element.key}: no text named`);
    assert.ok(earliest.passage.trim(), `${element.key}: a claim with no passage is not an attestation`);
    assert.ok(earliest.dateText.trim(), `${element.key}: no date as the source gives it`);
    assert.ok(
      earliest.establishedBy.trim(),
      `${element.key}: these dates are scholarly estimates — the scholar is part of the answer`
    );
  }
});

test("every element says what would establish it, filled or not", () => {
  // Required even once an attestation exists: the next reader needs to know
  // what would overturn or sharpen it.
  for (const element of KUNDALINI_ELEMENTS) {
    assert.ok(
      element.whatWouldEstablishThis.length > 40,
      `${element.key}: "what would establish this" is not optional and is not a stub`
    );
  }
});

test("a precursor is kept separate from an attestation", () => {
  // "Something like this appears earlier" and "this is attested earlier" are
  // different statements. A precursor that did not say why it is disputed
  // would quietly become the attestation.
  for (const element of elementsWithPrecursor()) {
    const precursor = element.precursor!;
    assert.ok(precursor.text.trim(), `${element.key}: precursor with no text`);
    assert.ok(precursor.dateText.trim(), `${element.key}: precursor with no date`);
    assert.ok(
      precursor.whyDisputed.length > 60,
      `${element.key}: a precursor without a stated dispute is an attestation wearing a disguise`
    );
  }
});

test("the table is currently entirely open, and does not pretend otherwise", () => {
  // If this ever fails it is because research landed, which is the point. It
  // fails loudly rather than letting a half-filled table read as finished.
  const progress = tracebackProgress();
  assert.equal(progress.total, KUNDALINI_ELEMENTS.length);
  assert.equal(progress.established, 0, "nothing has been established yet; update this test when it is");
  assert.equal(progress.open, progress.total);
  assert.equal(openElements().length, progress.total, "every row is open, and the count agrees with itself");
  assert.ok(progress.withPrecursor > 0, "some elements do have disputed precursors, and those are recorded");
});

test("the spread refuses to report a number from one point", () => {
  // A component showing "0 years" would be asserting that every part of the
  // system arrived at once, which is the opposite of what the table is for.
  assert.equal(establishedSpread(), null);

  const two: KundaliniElement[] = [
    {
      key: "a",
      name: "A",
      what: "x",
      threads: [],
      earliest: { text: "T", passage: "1.1", dateText: "c. 700 BCE", startYear: -699, establishedBy: "Someone" },
      whatWouldEstablishThis: "more than forty characters of text explaining what would settle it",
    },
    {
      key: "b",
      name: "B",
      what: "y",
      threads: [],
      earliest: { text: "U", passage: "2.2", dateText: "c. 1100 CE", startYear: 1100, establishedBy: "Another" },
      whatWouldEstablishThis: "more than forty characters of text explaining what would settle it",
    },
  ];
  const spread = establishedSpread(two);
  assert.ok(spread);
  assert.equal(spread.years, 1799);
  assert.equal(spread.earliest.key, "a");
  assert.equal(spread.latest.key, "b");

  // One established element is still not a spread.
  assert.equal(establishedSpread([two[0]]), null);
});

test("the seven-cakra system is a row of its own, and says why", () => {
  // The single most load-bearing row: the familiar diagram is routinely
  // presented as timeless, and it may be one late arrangement among several.
  const seven = KUNDALINI_ELEMENTS.find((e) => e.key === "seven-cakra-system");
  assert.ok(seven);
  assert.match(seven.earliestAbsentReason ?? "", /no reason to assume there were always seven/i);
  assert.match(seven.whatWouldEstablishThis, /texts giving other numbers/i);

  // And it is separate from cakras in general, because they are separate facts.
  assert.ok(KUNDALINI_ELEMENTS.some((e) => e.key === "cakras"));
});

test("the things likeliest to be much older have their precursors attached", () => {
  // nadi, upward movement and inner fire are where the Upanisadic and Vedic
  // material sits. If those turn out far older than the word kundalini, the
  // table shows the system assembling rather than appearing.
  for (const key of ["nadi", "upward-movement", "inner-fire"]) {
    const element = KUNDALINI_ELEMENTS.find((e) => e.key === key);
    assert.ok(element?.precursor, `${key}: the obvious earlier candidate should be named and disputed`);
  }
});

test("the word and the serpent are two rows, not one", () => {
  // kundalini derives from a word for coiled. A coil is not a serpent, and the
  // two may enter at different dates.
  const word = KUNDALINI_ELEMENTS.find((e) => e.key === "kundalini-word");
  const serpent = KUNDALINI_ELEMENTS.find((e) => e.key === "kundalini-as-serpent");
  assert.ok(word && serpent);
  assert.match(serpent.earliestAbsentReason ?? "", /coil is not automatically a serpent/i);
});

test("threads match the collection's own tags, so an element can be found from the timeline", () => {
  const known = new Set<string>(Object.values(SERPENT_THREADS));
  for (const element of KUNDALINI_ELEMENTS) {
    for (const thread of element.threads) {
      assert.ok(known.has(thread), `${element.key}: unknown thread "${thread}"`);
    }
  }
  assert.ok(elementsInThread(SERPENT_THREADS.subtleBody).length >= 3);
  assert.ok(elementsInThread("not-a-thread").length === 0);
});

test("keys and names are unique, and nothing carries a confidence score", () => {
  const keys = KUNDALINI_ELEMENTS.map((e) => e.key);
  const names = KUNDALINI_ELEMENTS.map((e) => e.name);
  assert.equal(new Set(keys).size, keys.length, "a duplicate key would silently overwrite a row");
  assert.equal(new Set(names).size, names.length);
  const text = JSON.stringify(KUNDALINI_ELEMENTS);
  assert.doesNotMatch(text, /"confidence"/);
  assert.doesNotMatch(text, /\b\d{1,3}\s?% (certain|confident|likely|sure)\b/i);
});

// ---------------------------------------------------------------------------
// THE BRIEF THAT FILLS THIS TABLE
//
// docs/research-brief-05b-serpent-textual-chain.md is what goes to a researcher
// with web access, and what comes back is filed against these element keys. So
// the keys in that document are not prose — they are the interface, and a stale
// one costs a research round rather than a rebuild.
//
// It also has to name EVERY element. A brief that quietly lists twenty-four of
// twenty-six does not produce two open rows; it produces two rows nobody was
// ever asked about, which then read as "looked at, nothing found".
// ---------------------------------------------------------------------------

const BRIEF_05B = readFileSync(
  new URL("../../../docs/research-brief-05b-serpent-textual-chain.md", import.meta.url),
  "utf8"
);

test("brief 05b asks about every element, not a subset", () => {
  for (const element of KUNDALINI_ELEMENTS) {
    assert.ok(
      BRIEF_05B.includes(`\`${element.key}\``),
      `element "${element.key}" is not named in brief 05b, so nobody will be asked to date it`
    );
  }
});

test("brief 05b invents no element keys", () => {
  const real = new Set<string>(KUNDALINI_ELEMENTS.map((element) => element.key));
  // Only the rows that present a key as an element — the table cells.
  const tabulated = new Set([...BRIEF_05B.matchAll(/\| `([a-z]+(?:-[a-z]+)+)` \|/g)].map((match) => match[1]));
  assert.ok(tabulated.size > 5, `brief 05b tabulates only ${tabulated.size} keys — check the scan`);
  for (const key of tabulated) {
    assert.ok(real.has(key), `brief 05b asks for "${key}", which is not an element of the traceback`);
  }
});

test("brief 05b still demands a scholar for every date", () => {
  // The rule that makes the table impossible to fill dishonestly. If this
  // sentence is ever softened out of the brief, the table can be filled with
  // plausible centuries and will look finished.
  // Whitespace-tolerant on purpose: this is a wrapped Markdown document and a
  // test that broke when a paragraph was re-flowed would be noise, not a guard.
  assert.match(
    BRIEF_05B,
    /will\s+not\s+accept\s+a\s+date\s+without\s+a\s+name/i,
    "brief 05b no longer requires a named scholar for each date"
  );
  assert.match(
    BRIEF_05B,
    /A\s+date\s+with\s+no\s+passage\s+is\s+not\s+an\s+attestation/i,
    "brief 05b no longer requires a passage for each date"
  );
});
