// =============================================================================
// MATCHING ONE SEEDED DATE CLAIM TO ONE STORED ROW
//
// The repair button reconciles a community's stored date claims against the
// seed, so a correction made after the dataset shipped can reach a community
// that already took it. Matching is by POSITION — the start and end year — with
// the source's own wording as the tie-break, because the seeder's rule is that
// wording is unique within a record.
//
// THE BUG THIS EXISTS TO FIX. The old matcher said: if exactly one stored row
// sits at this position, that is the match. It never checked the wording in that
// case. So when a record gained SEVERAL positionless claims in a later research
// round while a community still held a copy with ONE, all of the new claims
// matched that single row — and each overwrote the last.
//
// The result was a button that reported "Updated 4 dates" on every press, for
// ever, on the same two records:
//
//   contendings-of-horus-and-seth   4 positionless claims against 1 stored row
//   set-survives-in-the-oases       2 positionless claims against 1 stored row
//
// Three of the four plus one of the two is four updates a run, which is exactly
// what was reported. The work was real; it was just undone again immediately by
// the next claim in the same loop.
//
// TWO RULES FIX IT, and both are about the same thing — a stored row belongs to
// at most one seeded claim:
//
//   * where the SEED has more than one claim at a position, the wording must
//     match. Falling back to "the only stored row" cannot be right, because
//     that row can only be one of them.
//   * a row already taken by an earlier claim in this run is not offered again.
//
// What this deliberately does NOT do is guess. A claim that cannot be matched is
// left alone and counted as ambiguous, which is what the caller already does
// with it. A date nobody can identify is not a date to overwrite.
// =============================================================================

export type StoredClaimRow = {
  id: string;
  start_year: number | null;
  end_year: number | null;
  original_date_text: string | null;
};

export type SeedClaimPosition = {
  startYear?: number;
  endYear?: number;
  originalDateText: string;
};

/** The key a claim is matched on. Null is a value here, not an absence. */
export function claimPositionKey(claim: { startYear?: number; endYear?: number }): string {
  return `${claim.startYear ?? "null"}|${claim.endYear ?? "null"}`;
}

/** How many seeded claims sit at each position, so a collision is known up front. */
export function seedClaimsByPosition(
  claims: readonly { startYear?: number; endYear?: number }[]
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const claim of claims) {
    const key = claimPositionKey(claim);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

// Generic over the row, like pictureTopUp beside it: the caller selects more
// columns than the match needs, and handing back a narrowed row would make the
// caller re-find its own data.
export function matchStoredClaim<T extends StoredClaimRow>(
  seedClaim: SeedClaimPosition,
  stored: readonly T[],
  { seedClaimsAtThisPosition, alreadyClaimed }: { seedClaimsAtThisPosition: number; alreadyClaimed: ReadonlySet<string> }
): T | null {
  const wantStart = seedClaim.startYear ?? null;
  const wantEnd = seedClaim.endYear ?? null;
  const candidates = stored.filter(
    (row) =>
      !alreadyClaimed.has(row.id) && (row.start_year ?? null) === wantStart && (row.end_year ?? null) === wantEnd
  );
  if (candidates.length === 0) return null;

  // The wording decides whenever it has to: either several rows are available,
  // or several seeded claims are competing for however few there are.
  if (candidates.length > 1 || seedClaimsAtThisPosition > 1) {
    const byText = candidates.filter((row) => row.original_date_text === seedClaim.originalDateText);
    return byText.length === 1 ? byText[0] : null;
  }
  return candidates[0];
}
