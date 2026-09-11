import type { TimelineDateClaim, TimelinePeriod } from "@/types/database";
import { claimInterval, fractionOf, type TimeScale, type TimeWindow } from "./time";

// PERIODS, TURNED INTO BANDS.
//
// Everything here answers one of three questions, and none of them is "what
// are this period's dates" — because a period has no dates. It has boundary
// claims, several of them, sometimes disagreeing by a thousand years, and this
// module is where that gets turned into something a strip can draw without
// pretending the disagreement away.
//
//   1. HOW WIDE IS IT? The envelope of every boundary claim on it. A period
//      whose start is claimed at 1200 BCE by one source and 800 BCE by another
//      is drawn from the earlier to the later, because both are claims about
//      where it starts and picking one would be this file deciding.
//
//   2. IS IT WORTH DRAWING HERE? Semantic zoom, decided from duration and
//      viewport and nothing else. There is no list of period names in this
//      file and no `if (name === "Bronze Age")`: a period added next year gets
//      the same treatment without anybody editing the renderer.
//
//   3. WHICH PERIOD IS THIS CLAIM IN? Derived, every time, from the claim's own
//      interval — never stored on the event. An event whose sources disagree
//      about its date may be in two different periods depending on which source
//      you believe, and a stored period_id would have quietly settled that.

export type PeriodWithClaims = TimelinePeriod & { claims: TimelineDateClaim[] };

/** A period's full extent, in years, across every boundary claim it has. */
export type PeriodExtent = {
  /** The earliest year any boundary claim reaches. */
  from: number;
  /** The latest — or the present, for a period claimed to be still running. */
  to: number;
  /** True when a claim says the period has not ended. `to` is then the present. */
  ongoing: boolean;
};

export type PeriodBand = {
  period: PeriodWithClaims;
  extent: PeriodExtent;
  /** Which stacked lane to draw it in. Deterministic: see packBands. */
  lane: number;
  /** Pixel edges, clamped to the strip. */
  x: number;
  x2: number;
  /** True when the band's real start is off the left edge of the window, and likewise right. */
  clippedStart: boolean;
  clippedEnd: boolean;
};

/**
 * The envelope of a period's boundary claims.
 *
 * Null when it has none — which is a period nobody has dated yet, not an error,
 * and simply isn't drawn.
 */
export function periodExtent(period: PeriodWithClaims, present: number): PeriodExtent | null {
  if (period.claims.length === 0) return null;

  let from = Number.POSITIVE_INFINITY;
  let to = Number.NEGATIVE_INFINITY;
  let ongoing = false;

  for (const claim of period.claims) {
    // claimInterval already widens a point claim to the width its precision
    // implies, so "c. 1200 BCE" at year precision is not drawn as an instant.
    const interval = claimInterval(claim);
    // A boundary that places nothing cannot contribute an edge. A period whose
    // every boundary is like that has no extent and is not drawn — which is
    // right: there is nowhere to draw it.
    if (!interval) continue;
    from = Math.min(from, interval.lo);
    // A claim that runs to the present has no end_year on purpose — writing one
    // would invent a boundary nobody claimed — so the present is supplied here,
    // at render time, rather than stored.
    to = Math.max(to, claim.is_ongoing ? present : interval.hi);
    if (claim.is_ongoing) ongoing = true;
  }

  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
  return { from, to, ongoing };
}

/** The regions this period's boundaries are claimed for, in the order they first appear. */
export function periodRegions(period: PeriodWithClaims): string[] {
  const seen: string[] = [];
  for (const claim of period.claims) {
    if (claim.region && !seen.includes(claim.region)) seen.push(claim.region);
  }
  return seen;
}

// ---------------------------------------------------------------------------
// Semantic zoom
// ---------------------------------------------------------------------------

/**
 * A band narrower than this is not context, it is a smudge — there is no room
 * for a name in it, and a nameless sliver of colour behind the events is worse
 * than nothing. Dropping them is what makes zooming out show the big periods
 * and zooming in reveal the specific ones, without either behaviour being
 * written down anywhere as a rule about particular periods.
 */
const MIN_BAND_PX = 64;

export type BandOptions = {
  /** How many stacked lanes of bands the strip will give up to context. */
  maxLanes: number;
  present: number;
  scale?: TimeScale;
};

/**
 * Which periods are worth drawing in this window, and where.
 *
 * The order is the whole of the zoom behaviour: MOST SPECIFIC FIRST. Sorting by
 * duration ascending means that when several periods qualify — and inside the
 * Middle Palaeolithic the Cenozoic also qualifies, because it covers the whole
 * screen — the narrowest one, the one that says the most about where you are,
 * takes the top lane. Zoom out and it falls below MIN_BAND_PX and disappears,
 * leaving the wider one behind it. Nothing anywhere decides that the Mesozoic
 * is a zoomed-out period and the Bronze Age a zoomed-in one; that falls out of
 * how long they are.
 */
export function periodBands(
  periods: PeriodWithClaims[],
  window: TimeWindow,
  width: number,
  options: BandOptions
): PeriodBand[] {
  if (width <= 0 || options.maxLanes <= 0) return [];
  const scale = options.scale ?? "linear";

  const candidates: { band: Omit<PeriodBand, "lane">; span: number }[] = [];

  for (const period of periods) {
    const extent = periodExtent(period, options.present);
    if (!extent) continue;
    // No overlap with what is on screen at all.
    if (extent.to <= window.from || extent.from >= window.to) continue;

    const rawX = fractionOf(window, extent.from, scale) * width;
    const rawX2 = fractionOf(window, extent.to, scale) * width;
    const x = Math.max(0, rawX);
    const x2 = Math.min(width, rawX2);
    if (x2 - x < MIN_BAND_PX) continue;

    candidates.push({
      band: { period, extent, x, x2, clippedStart: rawX < 0, clippedEnd: rawX2 > width },
      span: extent.to - extent.from,
    });
  }

  candidates.sort((a, b) => {
    if (a.span !== b.span) return a.span - b.span;
    // Same length: whoever the data says to prefer, then something stable.
    const priority = b.band.period.display_priority - a.band.period.display_priority;
    if (priority !== 0) return priority;
    return a.band.period.name.localeCompare(b.band.period.name);
  });

  return packBands(candidates.map((candidate) => candidate.band), options.maxLanes);
}

/**
 * Stack overlapping bands into lanes, first-fit.
 *
 * Periods MUST be allowed to overlap — the Cenozoic contains the Quaternary,
 * and an archaeological period sits inside the same centuries as a historical
 * one without either containing the other — so two bands covering the same
 * pixels is the normal case rather than a collision to resolve. First-fit over
 * a sorted list is deterministic: the same window always produces the same
 * arrangement, and adding a period later cannot reshuffle the ones above it
 * except by taking a lane they were not using.
 */
function packBands(bands: Omit<PeriodBand, "lane">[], maxLanes: number): PeriodBand[] {
  /** What each lane already has in it, as pixel intervals. */
  const lanes: { from: number; to: number }[][] = [];
  const packed: PeriodBand[] = [];
  /** A little air between two bands in one lane, so they read as two. */
  const gap = 4;

  for (const band of bands) {
    // EVERY INTERVAL IN THE LANE, not just how far along it has been drawn.
    //
    // Tracking a single "lane end" per lane is the obvious implementation and
    // it is wrong here, because these bands are sorted by DURATION rather than
    // by position: a later band routinely starts to the LEFT of one already
    // placed. Against a running end, such a band never fits anywhere and gets
    // dropped — which is exactly what happened to the Bronze Age and the
    // Neolithic in a window showing the last six thousand years, while the
    // Modern era and the medieval period sat in three lanes of their own.
    let lane = lanes.findIndex((placed) =>
      placed.every((item) => band.x2 + gap <= item.from || band.x - gap >= item.to)
    );
    if (lane === -1) {
      if (lanes.length >= maxLanes) continue; // No room; it simply isn't drawn.
      lane = lanes.length;
      lanes.push([]);
    }
    lanes[lane].push({ from: band.x, to: band.x2 });
    packed.push({ ...band, lane });
  }

  return packed;
}

// ---------------------------------------------------------------------------
// Which period is a date in?
// ---------------------------------------------------------------------------

export type PeriodMembership = {
  period: PeriodWithClaims;
  /** True when the claim's whole interval sits inside the period's extent. */
  whollyInside: boolean;
};

/**
 * The periods a single date claim falls in — derived, never stored.
 *
 * DERIVED IS THE POINT. An event with two proposed dates two hundred years
 * apart may be in the Bronze Age on one source's reading and the Iron Age on
 * another's, and that is a fact about the sources worth seeing. A period_id
 * column on the event would have replaced it with whichever answer somebody
 * typed in first.
 *
 * Partial overlap counts. An event that is itself a range — a siege, a dynasty,
 * a glacial cycle — can begin in one period and end in the next, and reducing
 * it to its midpoint to get a tidy answer would be inventing a date the sources
 * do not give.
 */
export function periodsForClaim(
  periods: PeriodWithClaims[],
  claim: TimelineDateClaim,
  present: number
): PeriodMembership[] {
  const interval = claimInterval(claim);
  // A claim with no position is inside no period. "No finite beginning" does
  // not fall in the Holocene, and a containment test that returned true would
  // be asserting something nobody claimed.
  if (!interval) return [];
  const found: { membership: PeriodMembership; span: number }[] = [];

  for (const period of periods) {
    const extent = periodExtent(period, present);
    if (!extent) continue;
    if (interval.hi < extent.from || interval.lo > extent.to) continue;
    found.push({
      membership: { period, whollyInside: interval.lo >= extent.from && interval.hi <= extent.to },
      span: extent.to - extent.from,
    });
  }

  // Most specific first, for the same reason the bands are ordered that way:
  // "Middle Palaeolithic" tells a reader more about 100,000 years ago than
  // "Cenozoic" does, even though both are true.
  found.sort((a, b) => a.span - b.span);
  return found.map((entry) => entry.membership);
}

/** Every period any of these claims falls in, most specific first, without repeats. */
export function periodsForClaims(
  periods: PeriodWithClaims[],
  claims: TimelineDateClaim[],
  present: number
): PeriodMembership[] {
  const byId = new Map<string, PeriodMembership>();
  const spans = new Map<string, number>();

  for (const claim of claims) {
    for (const membership of periodsForClaim(periods, claim, present)) {
      const known = byId.get(membership.period.id);
      // Wholly inside beats partially overlapping when two claims disagree.
      if (!known || (membership.whollyInside && !known.whollyInside)) {
        byId.set(membership.period.id, membership);
      }
      if (!spans.has(membership.period.id)) {
        const extent = periodExtent(membership.period, present);
        spans.set(membership.period.id, extent ? extent.to - extent.from : Number.POSITIVE_INFINITY);
      }
    }
  }

  return [...byId.values()].sort(
    (a, b) => (spans.get(a.period.id) ?? 0) - (spans.get(b.period.id) ?? 0)
  );
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

/**
 * Does this period answer to that word?
 *
 * Aliases are matched as well as the name, which is the whole reason aliases
 * are a column: "Age of Dinosaurs" and "Mesozoic Era" are one period, and a
 * reader who types either should land on it rather than on nothing or, worse,
 * on a second period somebody created because the search came up empty.
 */
export function periodMatches(period: TimelinePeriod, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return false;
  if (period.name.toLowerCase().includes(needle)) return true;
  if (period.aliases.some((alias) => alias.toLowerCase().includes(needle))) return true;
  if (period.region && period.region.toLowerCase().includes(needle)) return true;
  return period.summary.toLowerCase().includes(needle);
}
