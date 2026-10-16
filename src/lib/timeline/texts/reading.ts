// READING A WORK IN ITS OWN ORDER, AND MEASURING THE DISTANCE BETWEEN TWO.
//
// Pure functions over plain rows, so the reader, the comparison page and the
// tests all agree on what "next" means and how far apart two passages stand.

import { formatDuration, formatYear } from "../time";
import { PASSAGE_DATE_ROLES } from "./taxonomy";

export type OutlineRow = {
  passage_key: string | null;
  parent_key: string | null;
  ordinal: number | null;
  label: string;
  reference: string | null;
  division_kind: string | null;
};

export type OutlineNode<T extends OutlineRow> = T & { children: OutlineNode<T>[]; depth: number };

/**
 * The work's table of contents: every passage under its parent, each level in
 * reading order. A passage whose parent is missing (not yet imported) sits at
 * the top level rather than disappearing — a gap in the import should show as
 * a gap, not as a passage nobody can reach.
 */
export function buildOutline<T extends OutlineRow>(rows: T[]): OutlineNode<T>[] {
  const nodes = new Map<string, OutlineNode<T>>();
  const sorted = [...rows].sort(byOrdinal);
  for (const row of sorted) {
    if (row.passage_key) nodes.set(row.passage_key, { ...row, children: [], depth: 0 });
  }
  const roots: OutlineNode<T>[] = [];
  for (const row of sorted) {
    if (!row.passage_key) continue;
    const node = nodes.get(row.passage_key)!;
    const parent = row.parent_key ? nodes.get(row.parent_key) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  const setDepth = (list: OutlineNode<T>[], depth: number) => {
    for (const node of list) {
      node.depth = depth;
      setDepth(node.children, depth + 1);
    }
  };
  setDepth(roots, 0);
  return roots;
}

function byOrdinal(a: OutlineRow, b: OutlineRow): number {
  return (a.ordinal ?? Number.MAX_SAFE_INTEGER) - (b.ordinal ?? Number.MAX_SAFE_INTEGER);
}

/** The whole work flattened depth-first: the order a reader turns the pages in. */
export function readingOrder<T extends OutlineRow>(rows: T[]): T[] {
  const out: T[] = [];
  const walk = (list: OutlineNode<T>[]) => {
    for (const node of list) {
      out.push(rowOf(node));
      walk(node.children);
    }
  };
  walk(buildOutline(rows));
  return out;
}

function rowOf<T extends OutlineRow>(node: OutlineNode<T>): T {
  const row: Partial<OutlineNode<T>> = { ...node };
  delete row.children;
  delete row.depth;
  return row as unknown as T;
}

/** Previous and next passage in reading order, and where this one sits in the work. */
export function neighbours<T extends OutlineRow>(
  rows: T[],
  key: string
): { previous: T | null; next: T | null; position: number; total: number } {
  const order = readingOrder(rows);
  const index = order.findIndex((row) => row.passage_key === key);
  if (index === -1) return { previous: null, next: null, position: 0, total: order.length };
  return {
    previous: index > 0 ? order[index - 1] : null,
    next: index < order.length - 1 ? order[index + 1] : null,
    position: index + 1,
    total: order.length,
  };
}

/** Ancestors of a passage, outermost first. */
export function breadcrumb<T extends OutlineRow>(rows: T[], key: string): T[] {
  const byKey = new Map(rows.filter((r) => r.passage_key).map((r) => [r.passage_key!, r]));
  const trail: T[] = [];
  const seen = new Set<string>();
  let current = byKey.get(key)?.parent_key ?? null;
  while (current && !seen.has(current)) {
    seen.add(current);
    const row = byKey.get(current);
    if (!row) break;
    trail.unshift(row);
    current = row.parent_key;
  }
  return trail;
}

// ---------------------------------------------------------------------------
// DATES OF A PASSAGE
// ---------------------------------------------------------------------------

export type DatedStatement = {
  /** A PASSAGE_DATE_ROLES key, or null for a claim that is not one of the five. */
  role: string | null;
  start_year: number | null;
  end_year: number | null;
  original_date_text: string | null;
};

/**
 * WHICH DATE TO MEASURE A GAP FROM.
 *
 * The brief asks for "the historical gap" between two passages. Measured from
 * what? Not from the date a text claims for itself — Doreal's tablets claim to
 * be older than the Pyramid Texts — and not from the events a text describes.
 * The honest comparison is between the oldest EVIDENCE each text has: the
 * earliest surviving witness where one is known, otherwise the estimated
 * composition, otherwise publication. The basis is returned with the year so
 * the page can say which it used.
 */
const GAP_BASIS_ORDER = ["earliest_evidence", "manuscript", "composition", "translation_publication"] as const;

export function evidenceDate(
  statements: DatedStatement[]
): { year: number; role: string; text: string | null } | null {
  for (const role of GAP_BASIS_ORDER) {
    const candidates = statements.filter((s) => s.role === role && s.start_year != null);
    if (candidates.length === 0) continue;
    const earliest = candidates.reduce((a, b) => (a.start_year! <= b.start_year! ? a : b));
    return { year: earliest.start_year!, role, text: earliest.original_date_text };
  }
  return null;
}

export function roleLabel(role: string | null): string {
  return PASSAGE_DATE_ROLES.find((r) => r.key === role)?.label ?? "Date";
}

/**
 * The gap between two passages' oldest evidence, in words. Null when either
 * side has no positioned evidence — a gap measured against nothing is not a gap.
 */
export function historicalGap(
  a: DatedStatement[],
  b: DatedStatement[]
): { years: number; earlier: "a" | "b" | "same"; text: string; aYear: number; bYear: number } | null {
  const ea = evidenceDate(a);
  const eb = evidenceDate(b);
  if (!ea || !eb) return null;
  const years = Math.abs(eb.year - ea.year);
  const earlier = ea.year === eb.year ? "same" : ea.year < eb.year ? "a" : "b";
  const text =
    earlier === "same"
      ? `Both are first attested around ${formatYear(ea.year)}.`
      : `About ${formatDuration(years)} separate the oldest evidence for each (${formatYear(ea.year)} and ${formatYear(eb.year)}).`;
  return { years, earlier, text, aYear: ea.year, bYear: eb.year };
}
