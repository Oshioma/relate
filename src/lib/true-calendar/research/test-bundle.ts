// Test helper (not a test): the real research batches as if a reviewer had
// published everything.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseImport } from "./import-plan";
import { type ResearchBundle, EMPTY_BUNDLE } from "./daily";
import { IMPORT_SECTIONS } from "./model";

// The real research batches, as if a reviewer had published everything:
// the acceptance test for "Next advice from the past".
export function publishedBundle(): ResearchBundle {
  const b: ResearchBundle = { ...EMPTY_BUNDLE, cultures: [], systems: [], cycles: [], positions: [], observances: [], meanings: [], recommendations: [], correspondences: [], notes: [], lunarDays: [], months: [], sources: [], citations: [] };
  for (const n of ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"]) {
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
    add(b.months as never[], file.months as never[]);
    add(b.sources as never[], file.sources as never[]);
    for (const { section, table } of IMPORT_SECTIONS) {
      for (const r of file[section] as Array<{ key: string; sources?: { source: string; relation: string }[] }>) {
        for (const c of r.sources ?? []) if (c.relation === "supports") b.citations.push({ claim_table: table, claim_key: r.key, source_key: c.source });
      }
    }
  }
  return b;
}

