import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseImport } from "./import-plan";
import { type ResearchBundle, EMPTY_BUNDLE } from "./daily";
import { adviceAhead, groupUndated, matchesFilter } from "./ahead";
import { IMPORT_SECTIONS } from "./model";
import { moonDays } from "../astronomy";

// The real research batches, as if a reviewer had published everything:
// the acceptance test for "Next advice from the past".
function publishedBundle(): ResearchBundle {
  const b: ResearchBundle = { ...EMPTY_BUNDLE, cultures: [], systems: [], cycles: [], positions: [], observances: [], meanings: [], recommendations: [], correspondences: [], notes: [], lunarDays: [], sources: [], citations: [] };
  for (const n of ["01", "02", "03", "04", "05"]) {
    const { file } = parseImport(JSON.parse(readFileSync(new URL(`../../../../docs/true-calendar/research/batch-${n}.v1.json`, import.meta.url), "utf8")));
    assert.ok(file, `batch ${n} parses`);
    const add = <T extends { key: string }>(list: T[], rows: T[]) => {
      for (const r of rows) {
        const i = list.findIndex((x) => x.key === r.key);
        if (i >= 0) list[i] = r;
        else list.push(r);
      }
    };
    add(b.cultures as never[], file.cultures as never[]);
    add(b.systems as never[], file.systems as never[]);
    add(b.cycles as never[], file.cycles as never[]);
    add(b.positions as never[], file.cycle_positions as never[]);
    add(b.observances as never[], file.observances as never[]);
    add(b.meanings as never[], file.meanings as never[]);
    add(b.recommendations as never[], file.recommendations as never[]);
    add(b.correspondences as never[], file.date_correspondences as never[]);
    add(b.lunarDays as never[], file.lunar_days as never[]);
    add(b.sources as never[], file.sources as never[]);
    for (const { section, table } of IMPORT_SECTIONS) {
      for (const r of file[section] as Array<{ key: string; sources?: { source: string; relation: string }[] }>) {
        for (const c of r.sources ?? []) if (c.relation === "supports") b.citations.push({ claim_table: table, claim_key: r.key, source_key: c.source });
      }
    }
  }
  return b;
}

test("next advice: Akwasidae on its published date, Whiro and the Kū nights undated", () => {
  const from = { year: 2026, month: 11, day: 2 };
  const { dated, undated } = adviceAhead(publishedBundle(), from, moonDays(from, 35, "Africa/Dar_es_Salaam"));

  const akwasidae = dated.find((i) => i.name === "Akwasidae");
  assert.ok(akwasidae);
  assert.deepEqual(akwasidae.date, { year: 2026, month: 11, day: 22 });
  assert.equal(akwasidae.status, "published");
  assert.ok(akwasidae.sources.some((s) => s.key === "src.nyamedua-akwasidae-2026"));
  assert.ok(akwasidae.sources.some((s) => s.key === "src.akandictionary-akwasidae-2026"));
  // Batch 05's caveat: a secondary listing, not a Manhyia announcement.
  assert.match(akwasidae.caution ?? "", /Manhyia/);

  const whiro = undated.filter((i) => i.name === "Whiro");
  assert.ok(whiro.length >= 1 && whiro.every((i) => i.date === null && i.cultureKey === "oceania.maori"));
  for (const name of ["Kukahi", "Kulua", "Kukolu", "Kupau"]) {
    const night = undated.find((i) => i.name === name);
    assert.ok(night, name);
    assert.equal(night.status, "undated");
    assert.ok(night.sources.length > 0, `${name} cites a source`);
  }
  // Conflicting Hawaiian accounts are both shown, never collapsed.
  const night22 = undated.find((i) => i.id === "night|oceania.hawaiian.oahu-lunar-nights.night-22");
  assert.ok(night22 && night22.says.length >= 2 && night22.evidence.includes("contested"));

  const cultures = new Set([...dated, ...undated].map((i) => i.cultureKey));
  assert.ok(cultures.size >= 3);
  // Daily notes (modern suggestions) are never presented as advice from the past.
  assert.ok(![...dated, ...undated].some((i) => i.name === "Review unfinished work"));
  // Unanchored cycles (Igbo market week) stay discoverable, undated.
  assert.ok(undated.some((i) => i.cultureKey === "africa.west.igbo"));

  // Filters and grouping.
  assert.ok(undated.filter((i) => matchesFilter(i, "fishing", "all")).length > 0);
  assert.ok(undated.filter((i) => matchesFilter(i, "all", "oceania.hawaiian")).every((i) => i.cultureKey === "oceania.hawaiian"));
  const groups = groupUndated(undated);
  assert.ok(groups[0].items.length >= groups[groups.length - 1].items.length);
});

test("next advice: dated items are in date order and never before the day asked about", () => {
  const from = { year: 2026, month: 11, day: 23 };
  const { dated } = adviceAhead(publishedBundle(), from, moonDays(from, 35, "UTC"));
  const akwasidae = dated.find((i) => i.name === "Akwasidae");
  // After the last published 2026 date the next one is counted from the anchor.
  assert.deepEqual(akwasidae?.date, { year: 2027, month: 1, day: 3 });
  assert.equal(akwasidae?.status, "provisional");
  const days = dated.map((i) => i.date!.year * 400 + i.date!.month * 32 + i.date!.day);
  assert.deepEqual(days, [...days].sort((a, b) => a - b));
});
