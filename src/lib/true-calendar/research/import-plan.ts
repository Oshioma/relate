// Planning an import of True Calendar research: validate a file, check every
// reference and citation, and work out what would be added, changed or left
// alone — without writing anything. The dry run shows exactly this plan; a
// real import writes it (see import-apply.ts).
//
// Pure: the database's current rows are passed in, so this is fully testable.

import { IMPORT_FORMAT, IMPORT_SECTIONS, importFileSchema, type CalendarTable, type ImportFile, type ImportSection } from "./model";

export interface ImportIssue {
  /** Where in the file: "cycles[2].anchor_source_key" */
  path: string;
  message: string;
}

export interface SectionPlan {
  section: ImportSection;
  table: CalendarTable;
  insert: string[];
  update: string[];
  unchanged: string[];
}

export interface ImportPlan {
  ok: boolean;
  errors: ImportIssue[];
  warnings: ImportIssue[];
  sections: SectionPlan[];
  citations: number;
  file: ImportFile | null;
}

/** What the database already holds for the keys a file mentions. */
export interface ExistingState {
  /** table → key → stored row (only the columns the file can set matter) */
  rows: Partial<Record<CalendarTable, Map<string, Record<string, unknown>>>>;
  /** "table|key" for claims that already have at least one supporting source */
  citedClaims: Set<string>;
}

// Which fields point at which table.
const REFERENCES: Partial<Record<ImportSection, Record<string, CalendarTable>>> = {
  systems: { culture_key: "calendar_cultures" },
  cycles: { system_key: "calendar_systems", anchor_source_key: "calendar_sources" },
  cycle_positions: { cycle_key: "calendar_cycles" },
  months: { system_key: "calendar_systems" },
  lunar_days: { system_key: "calendar_systems" },
  observances: { culture_key: "calendar_cultures", system_key: "calendar_systems", month_key: "calendar_months", cycle_position_key: "calendar_cycle_positions" },
  meanings: { culture_key: "calendar_cultures", system_key: "calendar_systems" },
  recommendations: {
    culture_key: "calendar_cultures",
    system_key: "calendar_systems",
    cycle_position_key: "calendar_cycle_positions",
    observance_key: "calendar_observances",
    lunar_day_key: "calendar_lunar_days",
    meaning_key: "calendar_meanings",
  },
  date_correspondences: { culture_key: "calendar_cultures", system_key: "calendar_systems" },
};

/** Collects every key a file mentions, per table, so the caller can fetch them. */
export function keysMentioned(file: ImportFile): Record<CalendarTable, Set<string>> {
  const out = Object.fromEntries(IMPORT_SECTIONS.map((s) => [s.table, new Set<string>()])) as Record<CalendarTable, Set<string>>;
  for (const { section, table } of IMPORT_SECTIONS) {
    for (const record of file[section] as Array<Record<string, unknown>>) {
      out[table].add(String(record.key));
      for (const [field, target] of Object.entries(REFERENCES[section] ?? {})) {
        const value = record[field];
        if (typeof value === "string") out[target].add(value);
      }
      for (const c of (record.sources as Array<{ source: string }> | undefined) ?? []) out.calendar_sources.add(c.source);
    }
  }
  return out;
}

/** Strip the inline citations: what is stored in the record's own table. */
export function rowOf(record: Record<string, unknown>): Record<string, unknown> {
  const { sources: _citations, ...row } = record;
  void _citations;
  return row;
}

function sameValue(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) || Array.isArray(b)) return JSON.stringify(a ?? []) === JSON.stringify(b ?? []);
  return (a ?? null) === (b ?? null);
}

// A record already in the database keeps its review status: publishing and
// rejecting are a reviewer's decisions, so re-importing a file (whose records
// say "draft") must not quietly unpublish what was reviewed.
function changed(record: Record<string, unknown>, stored: Record<string, unknown>): boolean {
  return Object.entries(rowOf(record)).some(([field, value]) => field !== "review_status" && !sameValue(value, stored[field]));
}

// A claim that says something about the past must cite a source before it can
// be published. A culture that is only a catalogue entry (name, region) needs
// none; one with an overview does.
function needsCitation(section: ImportSection, record: Record<string, unknown>): boolean {
  if (section === "sources") return false;
  if (section === "cultures") return Boolean(record.overview || record.people || record.places);
  return true;
}

export function parseImport(raw: unknown): { file: ImportFile | null; errors: ImportIssue[] } {
  if (typeof raw === "object" && raw !== null && (raw as { format?: unknown }).format !== IMPORT_FORMAT) {
    return { file: null, errors: [{ path: "format", message: `Expected "format": "${IMPORT_FORMAT}"` }] };
  }
  const parsed = importFileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      file: null,
      errors: parsed.error.issues.map((i) => ({ path: i.path.map((p) => (typeof p === "number" ? `[${p}]` : `.${String(p)}`)).join("").replace(/^\./, ""), message: i.message })),
    };
  }
  return { file: parsed.data, errors: [] };
}

export function planImport(file: ImportFile, existing: ExistingState): ImportPlan {
  const errors: ImportIssue[] = [];
  const warnings: ImportIssue[] = [];
  const inFile = Object.fromEntries(IMPORT_SECTIONS.map((s) => [s.table, new Map<string, Record<string, unknown>>()])) as Record<CalendarTable, Map<string, Record<string, unknown>>>;

  // Duplicate keys inside the file.
  for (const { section, table } of IMPORT_SECTIONS) {
    (file[section] as Array<Record<string, unknown>>).forEach((record, i) => {
      const k = String(record.key);
      if (inFile[table].has(k)) errors.push({ path: `${section}[${i}].key`, message: `Key "${k}" appears twice in this file` });
      inFile[table].set(k, record);
    });
  }

  const exists = (table: CalendarTable, k: string) => inFile[table].has(k) || Boolean(existing.rows[table]?.has(k));
  const lookup = (table: CalendarTable, k: string) => inFile[table].get(k) ?? existing.rows[table]?.get(k);

  let citations = 0;
  const sections: SectionPlan[] = [];
  for (const { section, table } of IMPORT_SECTIONS) {
    const plan: SectionPlan = { section, table, insert: [], update: [], unchanged: [] };
    (file[section] as Array<Record<string, unknown>>).forEach((record, i) => {
      const at = `${section}[${i}]`;
      const k = String(record.key);

      for (const [field, target] of Object.entries(REFERENCES[section] ?? {})) {
        const value = record[field];
        if (typeof value === "string" && !exists(target, value)) {
          errors.push({ path: `${at}.${field}`, message: `"${value}" is not in this file or the database` });
        }
      }

      const cites = (record.sources as Array<{ source: string; relation: string }> | undefined) ?? [];
      cites.forEach((c, j) => {
        citations++;
        if (!exists("calendar_sources", c.source)) errors.push({ path: `${at}.sources[${j}].source`, message: `Source "${c.source}" is not in this file or the database` });
      });

      if (record.review_status === "published" && needsCitation(section, record)) {
        const supported = cites.some((c) => c.relation === "supports") || existing.citedClaims.has(`${table}|${k}`);
        if (!supported) errors.push({ path: at, message: `"${k}" is marked published but cites no supporting source` });
      }
      if (record.review_status !== "published" && section !== "sources") {
        warnings.push({ path: at, message: `"${k}" will be saved as ${record.review_status} and stay hidden until a reviewer publishes it` });
      }

      if (section === "cycles") {
        const anchored = record.anchor_date != null;
        if (anchored && (record.anchor_position == null || record.anchor_source_key == null)) {
          errors.push({ path: at, message: "An anchor date needs anchor_position and anchor_source_key" });
        }
        if (record.anchor_position != null && Number(record.anchor_position) >= Number(record.length_days)) {
          errors.push({ path: `${at}.anchor_position`, message: "Anchor position must be less than the cycle length" });
        }
        if (!anchored) warnings.push({ path: at, message: `Cycle "${k}" has no sourced anchor, so it cannot be placed on calendar dates` });
      }
      if (section === "cycle_positions") {
        const cycle = lookup("calendar_cycles", String(record.cycle_key));
        if (cycle && Number(record.position) >= Number(cycle.length_days)) {
          errors.push({ path: `${at}.position`, message: `Position ${record.position} is outside a ${cycle.length_days}-day cycle` });
        }
      }
      if (section === "recommendations" && record.modern_interpretation && !(record.evidence as string[]).includes("modern_interpretation")) {
        warnings.push({ path: at, message: "Has a modern interpretation; it will be labelled as modern" });
      }
      if (section === "daily_notes" && !(record.evidence as string[]).includes("modern_interpretation")) {
        errors.push({ path: `${at}.evidence`, message: "A daily note is a modern suggestion: its evidence must include modern_interpretation" });
      }
      if (section === "date_correspondences" && record.certainty === "exact" && !record.gregorian_from) {
        errors.push({ path: at, message: "An exact correspondence needs gregorian_from" });
      }

      const stored = existing.rows[table]?.get(k);
      if (!stored) plan.insert.push(k);
      else if (changed(record, stored)) plan.update.push(k);
      else plan.unchanged.push(k);
    });
    sections.push(plan);
  }

  return { ok: errors.length === 0, errors, warnings, sections, citations, file };
}
