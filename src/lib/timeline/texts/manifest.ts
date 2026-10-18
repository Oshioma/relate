// THE MANIFEST: WHAT IS ACTUALLY IN THE ARCHIVE, AGAINST WHAT SHOULD BE.
//
// One function decides a work's completeness status, so the library page, the
// importer and the tests cannot disagree about it. The rule the brief sets is
// enforced here and nowhere else: a work is complete only when every expected
// unit is present AND checked AND the expected count itself has been verified
// against a reliable edition. A full import of an unchecked count is
// "imported, not yet verified", however many passages it has.

export type ManifestCounts = {
  /** Passages present at the work's unit division (or all passages, where none is named). */
  importedUnits: number;
  /** Of those, checked at least for numbering. */
  verifiedUnits: number;
  /** All passage records, including containers such as pages and books. */
  passageRecords: number;
  translations: number;
  translationsWithText: number;
  imagesFound: number;
  imagesVerified: number;
  /** Witness rows carrying a variant note — manuscript differences recorded but not resolved. */
  unresolvedVariants: number;
};

export type ManifestWork = {
  expectedUnits: number | null;
  inventoryVerified: boolean;
};

export type Manifest = ManifestCounts & {
  expectedUnits: number | null;
  /** Null where the expected count is not known — never guessed as zero. */
  missingUnits: number | null;
  status: string;
  isComplete: boolean;
};

export function deriveCompleteness(work: ManifestWork, counts: Pick<ManifestCounts, "importedUnits" | "verifiedUnits">): string {
  const { expectedUnits, inventoryVerified } = work;
  const { importedUnits, verifiedUnits } = counts;
  if (importedUnits === 0) return expectedUnits != null ? "inventory_documented" : "not_started";
  if (expectedUnits == null || importedUnits < expectedUnits) return "partial";
  if (inventoryVerified && verifiedUnits >= expectedUnits) return "verified_against_edition";
  return "imported_unverified";
}

export function buildManifest(work: ManifestWork, counts: ManifestCounts): Manifest {
  const status = deriveCompleteness(work, counts);
  return {
    ...counts,
    expectedUnits: work.expectedUnits,
    missingUnits: work.expectedUnits == null ? null : Math.max(0, work.expectedUnits - counts.importedUnits),
    status,
    isComplete: status === "verified_against_edition",
  };
}

/** "214 of 1,185" — or "214 (total not yet established)". */
export function coverageText(manifest: Pick<Manifest, "importedUnits" | "expectedUnits">, unitLabel: string): string {
  const imported = manifest.importedUnits.toLocaleString("en-GB");
  if (manifest.expectedUnits == null) return `${imported} ${unitLabel} (total not yet established)`;
  return `${imported} of ${manifest.expectedUnits.toLocaleString("en-GB")} ${unitLabel}`;
}
