import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { claimSpan, fractionOf, precisionSpanYears, type TimeWindow } from "./time";

// Turning a set of events into positions on a strip of pixels.
//
// Pure and separate from the component that draws it, because this is where the
// hard parts are: nothing that happens at 13.8 billion years wide is intuitive,
// and it is much easier to reason about "four events within six pixels of each
// other" as a function than as a render.
//
// THREE THINGS THIS DOES
//
// 1. Places every claim of every event, not just one per event — the
//    disagreement between sources is drawn, so each claim needs its own x.
// 2. Clusters what cannot be told apart. At "all of time" the whole of recorded
//    history is under a pixel wide; drawing 900 overlapping dots there is worse
//    than useless, so a crowd becomes one marker with a count that zooms into
//    its own span when tapped.
// 3. Packs what is left into rows so labels don't sit on top of each other,
//    and stops at a row count that fits the height it was given rather than
//    growing without limit.

/** How close two events have to be, in pixels, before a reader can't tell them apart. */
const CLUSTER_PX = 12;
/** How many crowded events it takes before a cluster is more honest than a pile. */
const CLUSTER_MIN = 4;
/** Breathing room between one event's label and the next event's marker. */
const ROW_GAP_PX = 14;

export type PlacedClaim = {
  id: string;
  x: number;
  /** The right-hand end for a claim that is a range or a coarse precision; equal to x for a point. */
  x2: number;
  isRange: boolean;
  isApproximate: boolean;
};

export type PlacedEvent = {
  event: TimelineEventWithClaims;
  row: number;
  /** Where the event's own marker goes — the earliest thing any source claims. */
  x: number;
  /** The full footprint of every claim, which is the disagreement made visible. */
  xFrom: number;
  xTo: number;
  claims: PlacedClaim[];
  disputed: boolean;
  showLabel: boolean;
  labelWidth: number;
};

export type PlacedCluster = {
  key: string;
  row: number;
  x: number;
  count: number;
  /** The window to move to when this cluster is opened. */
  from: number;
  to: number;
};

export type TimelineLayout = {
  events: PlacedEvent[];
  clusters: PlacedCluster[];
  rows: number;
};

function estimateLabelWidth(title: string): number {
  // ~6.2px per character at the 13px the labels render at, capped so one long
  // title can't reserve half the strip.
  return Math.min(190, Math.max(48, title.length * 6.2 + 18));
}

/**
 * Where a single claim sits, and how wide it is.
 *
 * A point claim still gets width when its precision implies width: "the 3rd
 * century BCE" is a hundred-year bar, and drawing it as a dot would assert a
 * precision the claim explicitly disclaims. Below a pixel that width simply
 * disappears, which is the correct behaviour rather than a special case.
 */
function placeClaim(
  claim: TimelineEventWithClaims["claims"][number],
  window: TimeWindow,
  width: number
): PlacedClaim {
  const span = claimSpan(claim);
  const implied = span.isRange ? 0 : precisionSpanYears(claim.date_precision);
  const from = span.from - (span.isRange ? 0 : implied / 2);
  const to = span.to + (span.isRange ? 0 : implied / 2);
  return {
    id: claim.id,
    x: fractionOf(window, from) * width,
    x2: fractionOf(window, to) * width,
    isRange: span.isRange,
    isApproximate: claim.is_approximate || claim.date_precision !== "exact_date",
  };
}

export function layoutTimeline(
  events: TimelineEventWithClaims[],
  window: TimeWindow,
  width: number,
  maxRows: number
): TimelineLayout {
  if (width <= 0) return { events: [], clusters: [], rows: 0 };

  const placed = events
    .map((event): PlacedEvent | null => {
      const claims = event.claims.map((claim) => placeClaim(claim, window, width));
      if (claims.length === 0) return null;
      const xFrom = Math.min(...claims.map((c) => Math.min(c.x, c.x2)));
      const xTo = Math.max(...claims.map((c) => Math.max(c.x, c.x2)));
      // "Disputed" means the sources land in different places — two sources
      // that agree on 1066 are corroboration, and calling that a dispute would
      // make the whole signal meaningless.
      const disputed =
        claims.length > 1 &&
        claims.some((c) => Math.abs(c.x - claims[0].x) > 0.5 || Math.abs(c.x2 - claims[0].x2) > 0.5);
      return {
        event,
        row: 0,
        x: xFrom,
        xFrom,
        xTo,
        claims,
        disputed,
        showLabel: true,
        labelWidth: estimateLabelWidth(event.title),
      };
    })
    .filter((item): item is PlacedEvent => item !== null)
    .sort((a, b) => a.xFrom - b.xFrom);

  // --- Cluster the indistinguishable ------------------------------------------------
  const clusters: PlacedCluster[] = [];
  const survivors: PlacedEvent[] = [];
  const yearsPerPixel = (window.to - window.from) / width;

  let i = 0;
  while (i < placed.length) {
    let j = i + 1;
    // A run of events that all start within CLUSTER_PX of the first, and none
    // of which is wide enough to be worth drawing as a span of its own.
    while (
      j < placed.length &&
      placed[j].xFrom - placed[i].xFrom < CLUSTER_PX &&
      placed[j].xTo - placed[j].xFrom < CLUSTER_PX
    ) {
      j++;
    }
    const run = placed.slice(i, j);
    if (run.length >= CLUSTER_MIN) {
      const x = run.reduce((sum, item) => sum + item.xFrom, 0) / run.length;
      const from = window.from + (Math.min(...run.map((r) => r.xFrom)) - CLUSTER_PX) * yearsPerPixel;
      const to = window.from + (Math.max(...run.map((r) => r.xTo)) + CLUSTER_PX) * yearsPerPixel;
      clusters.push({ key: run.map((r) => r.event.id).join(":").slice(0, 60), row: 0, x, count: run.length, from, to });
    } else {
      survivors.push(...run);
    }
    i = j;
  }

  // --- Pack into rows ---------------------------------------------------------------
  //
  // Two reservations per row, not one. `labelEnds` is how far a row is spoken
  // for including the caption; `markerEnds` is how far it is spoken for by the
  // marker alone. An event takes the first row where its LABEL fits, and only
  // when every row is captioned does it squeeze into one where the marker fits
  // — so labels spread out while they can, and a crowded stretch degrades to
  // bare dots rather than to events that aren't drawn.
  const labelEnds: number[] = [];
  const markerEnds: number[] = [];
  const placedRows: PlacedEvent[] = [];
  const overflow: PlacedEvent[] = [];

  for (const item of survivors) {
    const start = item.xFrom - 6;

    let row = labelEnds.findIndex((rowEnd) => rowEnd <= start);
    if (row === -1 && labelEnds.length < maxRows) {
      row = labelEnds.length;
      labelEnds.push(-Infinity);
      markerEnds.push(-Infinity);
    }
    if (row === -1) row = markerEnds.findIndex((rowEnd) => rowEnd <= start);
    if (row === -1) {
      overflow.push(item);
      continue;
    }

    item.row = row;
    markerEnds[row] = item.xTo + ROW_GAP_PX;
    labelEnds[row] = item.xTo + item.labelWidth + ROW_GAP_PX;
    placedRows.push(item);
  }

  // Then decide captions, per row, now that the row's contents are known: a
  // label shows when the next thing in its own row starts far enough to the
  // right of it. survivors is sorted by xFrom, so each row is already in order.
  const rowContents = new Map<number, PlacedEvent[]>();
  for (const item of placedRows) {
    const list = rowContents.get(item.row);
    if (list) list.push(item);
    else rowContents.set(item.row, [item]);
  }
  for (const list of rowContents.values()) {
    for (let index = 0; index < list.length; index++) {
      const next = list[index + 1];
      list[index].showLabel = !next || next.xFrom > list[index].xTo + list[index].labelWidth + ROW_GAP_PX;
    }
  }

  // Whatever still doesn't fit becomes "+N" markers, bucketed by position, in
  // the last row. Nothing is silently dropped.
  if (overflow.length > 0) {
    const bucketPx = 36;
    const buckets = new Map<number, PlacedEvent[]>();
    for (const item of overflow) {
      const bucket = Math.round(item.xFrom / bucketPx);
      const list = buckets.get(bucket);
      if (list) list.push(item);
      else buckets.set(bucket, [item]);
    }
    const row = Math.max(0, Math.min(maxRows, labelEnds.length) - 1);
    for (const [bucket, items] of buckets) {
      // A "+1" chip reads as a bug rather than as a crowd. One leftover event
      // goes back on the strip as a bare marker — it may sit under a neighbour's
      // label, which is a smaller cost than a badge that says nothing.
      if (items.length === 1) {
        items[0].row = row;
        items[0].showLabel = false;
        placedRows.push(items[0]);
        continue;
      }
      const x = items.reduce((sum, item) => sum + item.xFrom, 0) / items.length;
      clusters.push({
        key: `overflow-${bucket}`,
        row,
        x,
        count: items.length,
        from: window.from + (x - bucketPx) * yearsPerPixel,
        to: window.from + (x + bucketPx) * yearsPerPixel,
      });
    }
  }

  // Clusters share the rows: spread them so several in a row don't collide.
  const clusterRowEnds: number[] = [];
  for (const cluster of clusters.filter((c) => !c.key.startsWith("overflow-"))) {
    const start = cluster.x - 14;
    const end = cluster.x + 46;
    let row = clusterRowEnds.findIndex((rowEnd) => rowEnd <= start);
    if (row === -1) {
      row = Math.min(clusterRowEnds.length, Math.max(0, maxRows - 1));
      if (clusterRowEnds.length <= row) clusterRowEnds.push(end);
      else clusterRowEnds[row] = end;
    } else {
      clusterRowEnds[row] = end;
    }
    cluster.row = row;
  }

  const rows = Math.max(
    labelEnds.length,
    clusters.reduce((max, cluster) => Math.max(max, cluster.row + 1), 0)
  );

  // `placedRows`, not `survivors`: an event that overflowed is represented by
  // its cluster and must not also be drawn, or it is counted twice.
  return { events: placedRows, clusters, rows: Math.max(1, rows) };
}

/** The same placement for one lane of Compare mode: a single row, labels dropped where they'd collide. */
export function layoutLane(
  events: TimelineEventWithClaims[],
  window: TimeWindow,
  width: number
): PlacedEvent[] {
  if (width <= 0) return [];
  const placed = events
    .map((event): PlacedEvent | null => {
      const claims = event.claims.map((claim) => placeClaim(claim, window, width));
      if (claims.length === 0) return null;
      const xFrom = Math.min(...claims.map((c) => Math.min(c.x, c.x2)));
      const xTo = Math.max(...claims.map((c) => Math.max(c.x, c.x2)));
      return {
        event,
        row: 0,
        x: xFrom,
        xFrom,
        xTo,
        claims,
        disputed: claims.length > 1 && claims.some((c) => Math.abs(c.x - claims[0].x) > 0.5),
        showLabel: true,
        labelWidth: estimateLabelWidth(event.title),
      };
    })
    .filter((item): item is PlacedEvent => item !== null)
    .sort((a, b) => a.xFrom - b.xFrom);

  let lastLabelEnd = -Infinity;
  for (const item of placed) {
    if (item.xFrom < lastLabelEnd) item.showLabel = false;
    else lastLabelEnd = item.xTo + item.labelWidth + 10;
  }
  return placed;
}
